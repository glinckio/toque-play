"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Flag, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const schema2fa = z.object({
  code: z.string().min(6, "Código incompleto").max(8, "Código muito longo"),
});

type FormValues = z.infer<typeof schema>;
type Form2faValues = z.infer<typeof schema2fa>;

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginFlow />
    </Suspense>
  );
}

function LoginFlow() {
  const router = useRouter();
  const search = useSearchParams();
  const forbidden = search.get("error") === "forbidden";

  const [submitting, setSubmitting] = useState(false);
  const [pending2fa, setPending2fa] = useState<{
    temporaryToken: string;
    email: string;
  } | null>(null);

  const credentialsForm = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const twoFactorForm = useForm<Form2faValues>({
    resolver: zodResolver(schema2fa),
    defaultValues: { code: "" },
  });

  async function onCredentials(values: FormValues) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body?.message ?? "Falha no login");
        return;
      }
      if (body?.twoFactorRequired) {
        setPending2fa({
          temporaryToken: body.temporaryToken,
          email: values.email,
        });
        twoFactorForm.setFocus("code");
        return;
      }
      router.replace("/");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function onVerify2fa(values: Form2faValues) {
    if (!pending2fa) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temporaryToken: pending2fa.temporaryToken,
          code: values.code.trim(),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body?.message ?? "Código inválido");
        return;
      }
      router.replace("/");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  if (pending2fa) {
    return (
      <Shell title="AUTENTICAÇÃO 2FA" subtitle={`Confirme o código para ${pending2fa.email}`}>
        <form
          onSubmit={twoFactorForm.handleSubmit(onVerify2fa)}
          className="bg-white rounded-2xl border border-brand-100 p-6 space-y-4"
          style={{ boxShadow: "0 1px 0 rgba(20,10,30,0.02)" }}
        >
          <p className="text-xs text-ink-500 leading-relaxed">
            Digite o código de 6 dígitos do seu app autenticador (TOTP) ou um
            código de backup de 8 caracteres.
          </p>

          <Field label="Código" error={twoFactorForm.formState.errors.code?.message}>
            <ShieldCheck size={16} className="text-ink-300" />
            <input
              type="text"
              inputMode="text"
              autoComplete="one-time-code"
              placeholder="000000 ou A1B2C3D4"
              {...twoFactorForm.register("code")}
              className="w-full bg-transparent outline-none text-sm text-ink-900 placeholder:text-ink-300 uppercase tracking-widest"
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 rounded-xl text-white font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#6D2EC0,#4A1F87)" }}
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Verificar e entrar
          </button>

          <button
            type="button"
            onClick={() => {
              setPending2fa(null);
              twoFactorForm.reset();
            }}
            className="w-full text-xs text-ink-500 hover:text-ink-700"
          >
            Voltar para o login
          </button>
        </form>
      </Shell>
    );
  }

  return (
    <Shell title="TOQUEPLAY" subtitle="Admin Console">
      <form
        onSubmit={credentialsForm.handleSubmit(onCredentials)}
        className="bg-white rounded-2xl border border-brand-100 p-6 space-y-4"
        style={{ boxShadow: "0 1px 0 rgba(20,10,30,0.02)" }}
      >
        {forbidden && (
          <div className="rounded-xl bg-danger-bg text-danger-fg text-xs font-semibold px-3 py-2">
            Acesso restrito: perfil sem permissão de administrador.
          </div>
        )}

        <Field label="Email" error={credentialsForm.formState.errors.email?.message}>
          <Mail size={16} className="text-ink-300" />
          <input
            type="email"
            autoComplete="username"
            placeholder="voce@toqueplay.app"
            {...credentialsForm.register("email")}
            className="w-full bg-transparent outline-none text-sm text-ink-900 placeholder:text-ink-300"
          />
        </Field>

        <Field label="Senha" error={credentialsForm.formState.errors.password?.message}>
          <Lock size={16} className="text-ink-300" />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...credentialsForm.register("password")}
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
    </Shell>
  );
}

function Shell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-page px-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="size-14 rounded-2xl mx-auto flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/30">
            <Flag size={26} color="#FFF" strokeWidth={2.4} />
          </div>
          <h1 className="font-display text-3xl text-ink-900 mt-4">{title}</h1>
          <p className="text-xs uppercase tracking-widest text-ink-500 mt-1">{subtitle}</p>
        </div>
        {children}
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
