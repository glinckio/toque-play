"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import type { AdminTournamentDetail } from "@/lib/api/admin";
import { Card, CardHeader, GhostButton, PrimaryButton } from "@/components/admin/ui";
import { CepInput } from "@/components/admin/cep-input";

const TOURNAMENT_STATUSES: { value: string; label: string }[] = [
  { value: "DRAFT", label: "Rascunho" },
  { value: "PUBLISHED", label: "Publicado" },
  { value: "REGISTRATION_OPEN", label: "Inscrições abertas" },
  { value: "REGISTRATION_CLOSED", label: "Inscrições fechadas" },
  { value: "BRACKET_GENERATED", label: "Chave gerada" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "FINISHED", label: "Finalizado" },
  { value: "CANCELLED", label: "Cancelado" },
];

const EVENT_TYPES = ["SINGLE", "CIRCUIT"];
const CATEGORY_TYPES = ["MALE", "FEMALE", "MIX"];
const FORMATS = ["PAIR", "QUARTET", "SEXTET"];
const MODALITIES = ["BEACH", "COURT"];

const schema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres"),
  description: z.string().optional(),
  eventType: z.enum(["SINGLE", "CIRCUIT"]),
  status: z.enum([
    "DRAFT",
    "PUBLISHED",
    "REGISTRATION_OPEN",
    "REGISTRATION_CLOSED",
    "BRACKET_GENERATED",
    "IN_PROGRESS",
    "FINISHED",
    "CANCELLED",
  ]),
  isPublished: z.boolean(),
  categoryType: z.enum(["MALE", "FEMALE", "MIX"]),
  categoryFormat: z.enum(["PAIR", "QUARTET", "SEXTET"]),
  categoryModality: z.enum(["BEACH", "COURT"]),
  categoryPrice: z.coerce.number().min(0),
  stageName: z.string().optional(),
  stageDate: z.string(),
  stageTime: z.string().optional(),
  stageMaxTeams: z.coerce.number().int().min(1),
  stageCity: z.string().optional(),
  stageState: z.string().optional(),
  stageAddress: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function toDatetimeLocal(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toDateInput(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function TournamentEditForm({ initial }: { initial: AdminTournamentDetail }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [published, setPublished] = useState(initial.isPublished);

  const category = initial.categories[0];
  const stage = initial.stages[0];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      name: initial.name,
      description: initial.description ?? "",
      eventType: initial.eventType as FormValues["eventType"],
      status: initial.status as FormValues["status"],
      isPublished: initial.isPublished,
      categoryType: (category?.type ?? "MALE") as FormValues["categoryType"],
      categoryFormat: (category?.format ?? "PAIR") as FormValues["categoryFormat"],
      categoryModality: (category?.modality ?? "BEACH") as FormValues["categoryModality"],
      categoryPrice: category?.registrationPrice ? Number(category.registrationPrice) : 0,
      stageName: stage?.name ?? "",
      stageDate: toDateInput(stage?.date),
      stageTime: stage?.startTime ? toDatetimeLocal(stage.startTime) : "",
      stageMaxTeams: stage?.maxTeams ?? 16,
      stageCity: stage?.city ?? "",
      stageState: stage?.state ?? "",
      stageAddress: stage?.address ?? "",
    },
  });

  const saveMut = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: Record<string, unknown> = {
        name: values.name,
        description: values.description || null,
        eventType: values.eventType,
        status: values.status,
        isPublished: published,
        category: {
          type: values.categoryType,
          format: values.categoryFormat,
          modality: values.categoryModality,
          registrationPrice: values.categoryPrice,
        },
      };
      if (stage) {
        payload.stage = {
          name: values.stageName || undefined,
          date: values.stageDate ? new Date(values.stageDate).toISOString() : undefined,
          startTime: values.stageTime ? new Date(values.stageTime).toISOString() : undefined,
          maxTeams: values.stageMaxTeams,
          city: values.stageCity || undefined,
          state: values.stageState || undefined,
          address: values.stageAddress || undefined,
        };
      }
      return api.patch(`admin/tournaments/${initial.id}`, payload);
    },
    onSuccess: () => {
      toast.success("Torneio atualizado");
      qc.invalidateQueries({ queryKey: ["admin", "tournaments"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onSubmit = (values: FormValues) => saveMut.mutate(values);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-4xl">
      <Card>
        <CardHeader title="Dados" />
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome" error={errors.name?.message} className="md:col-span-2">
            <input {...register("name")} className={inputCls} />
          </Field>
          <Field label="Descrição" className="md:col-span-2">
            <textarea rows={3} {...register("description")} className={inputCls} />
          </Field>
          <Field label="Tipo de evento">
            <select {...register("eventType")} className={inputCls}>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === "SINGLE" ? "Único" : "Circuito"}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select {...register("status")} className={inputCls}>
              {TOURNAMENT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Publicado">
            <button
              type="button"
              onClick={() => setPublished((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors ${published ? "bg-brand-500" : "bg-brand-100"}`}
              aria-pressed={published}
            >
              <span
                className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${published ? "left-[22px]" : "left-0.5"}`}
              />
            </button>
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader title="Categoria" action={<span className="text-xs text-ink-500">primeira categoria do torneio</span>} />
        <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Field label="Tipo">
            <select {...register("categoryType")} className={inputCls}>
              {CATEGORY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === "MALE" ? "Masculino" : t === "FEMALE" ? "Feminino" : "Misto"}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Formato">
            <select {...register("categoryFormat")} className={inputCls}>
              {FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f === "PAIR" ? "Dupla" : f === "QUARTET" ? "Quarteto" : "Sexteto"}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Modalidade">
            <select {...register("categoryModality")} className={inputCls}>
              {MODALITIES.map((m) => (
                <option key={m} value={m}>
                  {m === "BEACH" ? "Praia" : "Quadra"}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Preço (BRL)" error={errors.categoryPrice?.message}>
            <input type="number" step="0.01" {...register("categoryPrice")} className={inputCls} />
          </Field>
        </div>
      </Card>

      {stage && (
        <Card>
          <CardHeader title="Etapa" />
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Nome da etapa" className="md:col-span-3">
              <input {...register("stageName")} className={inputCls} />
            </Field>
            <Field label="Data" error={errors.stageDate?.message}>
              <input type="date" {...register("stageDate")} className={inputCls} />
            </Field>
            <Field label="Horário início">
              <input type="datetime-local" {...register("stageTime")} className={inputCls} />
            </Field>
            <Field label="Máx. times" error={errors.stageMaxTeams?.message}>
              <input type="number" {...register("stageMaxTeams")} className={inputCls} />
            </Field>
            <div className="md:col-span-3">
              <CepInput
                onAddressFound={(addr) => {
                  setValue("stageAddress", addr.street ? `${addr.street}` : "");
                  setValue("stageCity", addr.city);
                  setValue("stageState", addr.state);
                }}
              />
            </div>
            <Field label="Cidade">
              <input {...register("stageCity")} className={inputCls} />
            </Field>
            <Field label="Estado">
              <input {...register("stageState")} className={inputCls} />
            </Field>
            <Field label="Endereço" className="md:col-span-3">
              <input {...register("stageAddress")} className={inputCls} />
            </Field>
          </div>
        </Card>
      )}

      <Card>
        <CardHeader title="Resumo" />
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <KV k="Organizador" v={initial.owner?.name ?? "—"} />
          <KV k="Inscrições" v={String(initial._count?.registrations ?? 0)} />
          <KV k="Chaves" v={String(initial._count?.brackets ?? 0)} />
          <KV k="Estatísticas" v={String(initial._count?.athleteStats ?? 0)} />
        </div>
      </Card>

      <div className="flex justify-end gap-2 sticky bottom-0 bg-page/80 backdrop-blur py-3">
        <GhostButton onClick={() => router.push("/tournaments")}>Voltar</GhostButton>
        <PrimaryButton
          type="submit"
          disabled={isSubmitting || saveMut.isPending}
          icon={saveMut.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        >
          Salvar alterações
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

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">{k}</p>
      <p className="font-bold text-ink-900">{v}</p>
    </div>
  );
}
