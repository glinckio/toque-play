"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { api, type Paginated } from "@/lib/api/client";
import { Card, CardHeader, GhostButton, PrimaryButton } from "./ui";
import { Combobox } from "./combobox";
import { CepInput } from "./cep-input";

interface UserOpt { id: string; name: string; email: string; }
interface TeamOpt { id: string; name: string; ownerId: string; }

interface FriendlyInitial {
  id: string;
  title?: string | null;
  status: string;
  date: string;
  startTime?: string | null;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  modality?: string | null;
  categoryFormat?: string | null;
  scoreTeamA?: number | null;
  scoreTeamB?: number | null;
  requesterId: string;
  requesterTeamId?: string | null;
  challengedId?: string | null;
  challengedTeamId?: string | null;
}

const schema = z.object({
  title: z.string().min(3, "Mínimo 3"),
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "CANCELLED", "COMPLETED"]),
  requesterId: z.string().min(1, "Obrigatório"),
  requesterTeamId: z.string().optional(),
  challengedId: z.string().optional(),
  challengedTeamId: z.string().optional(),
  date: z.string(),
  startTime: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional(),
  modality: z.enum(["BEACH", "COURT"]).optional(),
  categoryFormat: z.enum(["PAIR", "QUARTET", "SEXTET"]).optional(),
  scoreTeamA: z.coerce.number().int().min(0).optional(),
  scoreTeamB: z.coerce.number().int().min(0).optional(),
});

type FormValues = z.infer<typeof schema>;

function toDateInput(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function toDatetimeLocal(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function FriendlyForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: FriendlyInitial;
}) {
  const router = useRouter();
  const qc = useQueryClient();

  const usersQ = useQuery({
    queryKey: ["admin", "users", "all"],
    queryFn: () => api.get<Paginated<UserOpt>>("admin/users", { limit: 100 }),
  });
  const teamsQ = useQuery({
    queryKey: ["admin", "teams-all"],
    queryFn: () => api.get<Paginated<TeamOpt>>("admin/teams", { limit: 100 }),
  });

  const users = usersQ.data?.data ?? [];
  const teams = teamsQ.data?.data ?? [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: initial
      ? {
          title: initial.title ?? "",
          status: initial.status as FormValues["status"],
          requesterId: initial.requesterId,
          requesterTeamId: initial.requesterTeamId ?? "",
          challengedId: initial.challengedId ?? "",
          challengedTeamId: initial.challengedTeamId ?? "",
          date: toDateInput(initial.date),
          startTime: toDatetimeLocal(initial.startTime),
          city: initial.city ?? "",
          state: initial.state ?? "",
          address: initial.address ?? "",
          modality: (initial.modality as FormValues["modality"]) ?? "BEACH",
          categoryFormat: (initial.categoryFormat as FormValues["categoryFormat"]) ?? "PAIR",
          scoreTeamA: initial.scoreTeamA ?? 0,
          scoreTeamB: initial.scoreTeamB ?? 0,
        }
      : {
          title: "",
          status: "PENDING",
          requesterId: "",
          date: toDateInput(new Date().toISOString()),
          modality: "BEACH",
          categoryFormat: "PAIR",
        },
  });

  const requesterId = watch("requesterId");
  useEffect(() => {
    if (!requesterId) return;
    const owned = teams.find((t) => t.ownerId === requesterId);
    if (owned) setValue("requesterTeamId", owned.id);
  }, [requesterId, teams, setValue]);

  const saveMut = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: Record<string, unknown> = {
        title: values.title,
        status: values.status,
        requesterId: values.requesterId,
        requesterTeamId: values.requesterTeamId || undefined,
        challengedId: values.challengedId || undefined,
        challengedTeamId: values.challengedTeamId || undefined,
        date: values.date ? new Date(values.date).toISOString() : undefined,
        startTime: values.startTime ? new Date(values.startTime).toISOString() : undefined,
        city: values.city || undefined,
        state: values.state || undefined,
        address: values.address || undefined,
        modality: values.modality,
        categoryFormat: values.categoryFormat,
      };
      if (mode === "edit" && initial) {
        payload.scoreTeamA = values.scoreTeamA ?? 0;
        payload.scoreTeamB = values.scoreTeamB ?? 0;
        return api.patch(`admin/friendlies/${initial.id}`, payload);
      }
      return api.post("admin/friendlies", payload);
    },
    onSuccess: () => {
      toast.success(mode === "edit" ? "Amistoso atualizado" : "Amistoso criado");
      qc.invalidateQueries({ queryKey: ["admin", "friendlies"] });
      router.push("/friendlies");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form onSubmit={handleSubmit((v) => saveMut.mutate(v))} className="space-y-4 max-w-4xl">
      <Card>
        <CardHeader title="Dados do amistoso" />
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Título" error={errors.title?.message} className="md:col-span-3">
            <input {...register("title")} className={inputCls} />
          </Field>
          <Field label="Status">
            <select {...register("status")} className={inputCls}>
              <option value="PENDING">Pendente</option>
              <option value="ACCEPTED">Aceito</option>
              <option value="COMPLETED">Concluído</option>
              <option value="REJECTED">Rejeitado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </Field>
          <Field label="Data" error={errors.date?.message}>
            <input type="date" {...register("date")} className={inputCls} />
          </Field>
          <Field label="Horário">
            <input type="datetime-local" {...register("startTime")} className={inputCls} />
          </Field>
          <Field label="Modalidade">
            <select {...register("modality")} className={inputCls}>
              <option value="BEACH">Praia</option>
              <option value="COURT">Quadra</option>
            </select>
          </Field>
          <Field label="Formato">
            <select {...register("categoryFormat")} className={inputCls}>
              <option value="PAIR">Dupla</option>
              <option value="QUARTET">Quarteto</option>
              <option value="SEXTET">Sexteto</option>
            </select>
          </Field>
          <div className="md:col-span-3">
            <CepInput
              onAddressFound={(addr) => {
                setValue("address", addr.street);
                setValue("city", addr.city);
                setValue("state", addr.state);
              }}
            />
          </div>
          <Field label="Cidade">
            <input {...register("city")} className={inputCls} />
          </Field>
          <Field label="Estado">
            <input {...register("state")} className={inputCls} />
          </Field>
          <Field label="Endereço" className="md:col-span-3">
            <input {...register("address")} className={inputCls} />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader title="Desafiante × Desafiado" />
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Usuário desafiante" error={errors.requesterId?.message}>
            <Combobox
              value={watch("requesterId")}
              onChange={(v) => setValue("requesterId", v)}
              placeholder="Buscar usuário…"
              searchPlaceholder="Digite nome ou email…"
              options={users.map((u) => ({ value: u.id, label: u.name, hint: u.email }))}
            />
          </Field>
          <Field label="Time desafiante">
            <Combobox
              value={watch("requesterTeamId") ?? ""}
              onChange={(v) => setValue("requesterTeamId", v)}
              placeholder="Buscar time…"
              searchPlaceholder="Digite o nome…"
              options={teams.map((t) => ({ value: t.id, label: t.name }))}
            />
          </Field>
          <Field label="Usuário desafiado">
            <Combobox
              value={watch("challengedId") ?? ""}
              onChange={(v) => setValue("challengedId", v)}
              placeholder="Buscar usuário…"
              searchPlaceholder="Digite nome ou email…"
              options={users.map((u) => ({ value: u.id, label: u.name, hint: u.email }))}
            />
          </Field>
          <Field label="Time desafiado">
            <Combobox
              value={watch("challengedTeamId") ?? ""}
              onChange={(v) => setValue("challengedTeamId", v)}
              placeholder="Buscar time…"
              searchPlaceholder="Digite o nome…"
              options={teams.map((t) => ({ value: t.id, label: t.name }))}
            />
          </Field>
        </div>
      </Card>

      {mode === "edit" && (
        <Card>
          <CardHeader
            title="Sets vencidos"
            action={<span className="text-xs text-ink-500">ex.: 2-1 (melhor de 3)</span>}
          />
          <div className="p-5 grid grid-cols-2 gap-4">
            <Field label="Sets desafiante" error={errors.scoreTeamA?.message}>
              <input type="number" min={0} {...register("scoreTeamA")} className={inputCls} />
            </Field>
            <Field label="Sets desafiado" error={errors.scoreTeamB?.message}>
              <input type="number" min={0} {...register("scoreTeamB")} className={inputCls} />
            </Field>
          </div>
        </Card>
      )}

      <div className="flex justify-end gap-2">
        <GhostButton onClick={() => router.push("/friendlies")}>Voltar</GhostButton>
        <PrimaryButton
          type="submit"
          disabled={saveMut.isPending}
          icon={saveMut.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        >
          Salvar
        </PrimaryButton>
      </div>
    </form>
  );
}

const inputCls =
  "w-full h-10 px-3 rounded-xl bg-page border border-brand-100 focus:border-brand-500 outline-none text-sm text-ink-900";

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[11px] uppercase tracking-wider font-semibold text-ink-500 mb-1.5">
        {label}
      </span>
      {children}
      {error && <span className="block text-xs text-danger-fg mt-1">{error}</span>}
    </label>
  );
}
