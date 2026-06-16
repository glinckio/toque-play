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
import type { AdminUserDetail } from "@/lib/api/admin";
import { Card, CardHeader, GhostButton, PrimaryButton } from "@/components/admin/ui";
import { PhoneInput } from "@/components/admin/phone-input";

const schema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  role: z.enum(["ATLETA", "ORGANIZADOR", "SUPER_ADMIN"]),
  status: z.enum(["ACTIVE", "BLOCKED"]),
  password: z.string().min(6, "Mínimo 6").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export function UserEditForm({ initial }: { initial: AdminUserDetail }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [phone, setPhone] = useState(initial.phone ?? "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      name: initial.name,
      email: initial.email,
      role: initial.role as FormValues["role"],
      status: initial.status as FormValues["status"],
      password: "",
    },
  });

  const saveMut = useMutation({
    mutationFn: (values: FormValues) => {
      const payload: Record<string, unknown> = {
        name: values.name,
        email: values.email,
        role: values.role,
        status: values.status,
        phone,
      };
      if (values.password) payload.password = values.password;
      return api.patch(`admin/users/${initial.id}`, payload);
    },
    onSuccess: () => {
      toast.success("Usuário atualizado");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form onSubmit={handleSubmit((v) => saveMut.mutate(v))} className="space-y-4 max-w-3xl">
      <Card>
        <CardHeader title="Dados do usuário" />
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome" error={errors.name?.message}>
            <input {...register("name")} className={inputCls} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input {...register("email")} className={inputCls} />
          </Field>
          <Field label="Telefone">
            <PhoneInput value={phone} onChange={setPhone} className={inputCls} />
          </Field>
          <Field label="Perfil">
            <select {...register("role")} className={inputCls}>
              <option value="ATLETA">Atleta</option>
              <option value="ORGANIZADOR">Organizador</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </Field>
          <Field label="Status">
            <select {...register("status")} className={inputCls}>
              <option value="ACTIVE">Ativo</option>
              <option value="BLOCKED">Bloqueado</option>
            </select>
          </Field>
          <Field
            label="Redefinir senha"
            error={errors.password?.message}
            className="md:col-span-2"
          >
            <input
              type="password"
              {...register("password")}
              placeholder="Deixe vazio para manter"
              className={inputCls}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader title="Resumo" />
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <KV k="Times (owner)" v={String(initial._count?.teams ?? 0)} />
          <KV k="Membros de time" v={String(initial._count?.teamMembers ?? 0)} />
          <KV k="Inscrições" v={String(initial._count?.registrations ?? 0)} />
          <KV k="Torneios criados" v={String(initial._count?.tournaments ?? 0)} />
          <KV k="Email verificado" v={initial.isEmailVerified ? "Sim" : "Não"} />
          <KV k="Telefone" v={initial.phone ?? "—"} />
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <GhostButton onClick={() => router.push("/users")}>Voltar</GhostButton>
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

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">{k}</p>
      <p className="font-bold text-ink-900">{v}</p>
    </div>
  );
}
