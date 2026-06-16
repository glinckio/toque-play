"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Flag, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const forbidden = search.get("error") === "forbidden";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body?.message ?? "Falha no login");
        return;
      }
      router.replace("/");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-page px-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="size-14 rounded-2xl mx-auto flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/30">
            <Flag size={26} color="#FFF" strokeWidth={2.4} />
          </div>
          <h1 className="font-display text-3xl text-ink-900 mt-4">TOQUEPLAY</h1>
          <p className="text-xs uppercase tracking-widest text-ink-500 mt-1">Admin Console</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl border border-brand-100 p-6 space-y-4"
          style={{ boxShadow: "0 1px 0 rgba(20,10,30,0.02)" }}
        >
          {forbidden && (
            <div className="rounded-xl bg-danger-bg text-danger-fg text-xs font-semibold px-3 py-2">
              Acesso restrito: perfil sem permissão de administrador.
            </div>
          )}

          <Field label="Email" error={errors.email?.message}>
            <Mail size={16} className="text-ink-300" />
            <input
              type="email"
              autoComplete="username"
              placeholder="voce@toqueplay.app"
              {...register("email")}
              className="w-full bg-transparent outline-none text-sm text-ink-900 placeholder:text-ink-300"
            />
          </Field>

          <Field label="Senha" error={errors.password?.message}>
            <Lock size={16} className="text-ink-300" />
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
              className="w-full bg-transparent outline-none text-sm text-ink-900 placeholder:text-ink-300"
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 rounded-xl text-white font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#6D2EC0,#4A1F87)" }}
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Entrar
          </button>
        </form>

        <p className="text-center text-xs text-ink-500 mt-6">
          Acesso apenas para administradores autorizados.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 h-11 px-3 rounded-xl border border-brand-100 bg-page focus-within:border-brand-500">
        {children}
      </div>
      {error && <span className="block text-xs text-danger-fg mt-1">{error}</span>}
    </label>
  );
}
