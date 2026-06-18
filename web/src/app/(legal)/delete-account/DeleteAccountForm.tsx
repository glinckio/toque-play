"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  success: boolean;
  fieldErrors: Record<string, string>;
  topError: string | null;
  defaultEmail: string;
};

export default function DeleteAccountForm({
  action,
  success,
  fieldErrors,
  topError,
  defaultEmail,
}: Props) {
  const [pending, setPending] = useState(false);

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-page px-4 py-12">
        <div className="w-full max-w-[560px]">
          <div className="text-center mb-8">
            <div className="size-14 rounded-2xl mx-auto flex items-center justify-center bg-green-100">
              <CheckCircle2 size={28} className="text-green-600" />
            </div>
            <h1 className="font-display text-3xl text-ink-900 mt-4">
              Solicitação registrada
            </h1>
          </div>
          <div className="bg-white rounded-2xl border border-brand-100 p-6 space-y-4">
            <p className="text-sm text-ink-700 leading-relaxed">
              Sua solicitação de exclusão de conta foi registrada. O time de
              privacidade (DPO) confirmará a exclusão e anonimização dos seus
              dados pessoais em até <strong>15 dias</strong> no email informado
              (LGPD art. 18).
            </p>
            <p className="text-xs text-ink-500">
              Registros financeiros e fiscais podem ser retidos por obrigação
              legal por até 5 anos (LGPD art. 16, II). Mensagens de chat
              associadas serão substituídas por um marcador de remoção.
            </p>
            <Link
              href="/"
              className="block w-full h-11 rounded-xl text-white font-bold text-center leading-[44px] mt-2"
              style={{ background: "linear-gradient(135deg,#6D2EC0,#4A1F87)" }}
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-page px-4 py-12">
      <div className="w-full max-w-[560px]">
        <div className="text-center mb-8">
          <div className="size-14 rounded-2xl mx-auto flex items-center justify-center bg-red-100">
            <ShieldAlert size={26} className="text-red-600" />
          </div>
          <h1 className="font-display text-3xl text-ink-900 mt-4">
            Excluir minha conta
          </h1>
          <p className="text-xs uppercase tracking-widest text-ink-500 mt-1">
            LGPD art. 18, VI
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-brand-100 p-6 space-y-5">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-2">
            <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">
              Atenção — ação irreversível
            </p>
            <ul className="text-xs text-amber-800 list-disc list-inside space-y-1">
              <li>Nome, email, telefone, foto, bio e localização serão anonimizados.</li>
              <li>Suas senhas e contas Google vinculadas serão desvinculadas.</li>
              <li>Todas as sessões ativas serão encerradas.</li>
              <li>Mensagens de chat serão substituídas por um marcador de remoção.</li>
              <li>Registros financeiros/fiscais podem ser retidos 5 anos por obrigação legal.</li>
            </ul>
          </div>

          {topError && (
            <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{topError}</span>
            </div>
          )}

          <form
            action={action}
            onSubmit={() => setPending(true)}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-ink-900 mb-1.5">
                Email da conta
              </label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={defaultEmail}
                required
                className="w-full h-11 px-3 rounded-xl border border-brand-200 bg-white text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-900 mb-1.5">
                Confirmar email
              </label>
              <input
                name="confirmEmail"
                type="email"
                autoComplete="email"
                required
                className="w-full h-11 px-3 rounded-xl border border-brand-200 bg-white text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
              />
              {fieldErrors.confirmEmail && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.confirmEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-900 mb-1.5">
                Motivo <span className="text-ink-500 font-normal">(opcional)</span>
              </label>
              <textarea
                name="reason"
                rows={3}
                maxLength={1000}
                placeholder="Conte o que motivou a exclusão (ajuda a melhorar o produto)"
                className="w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-none"
              />
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="ack"
                required
                className="mt-0.5 size-4 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-xs text-ink-700">
                Entendo que esta ação é <strong>irreversível</strong> e que
                alguns dados poderão ser retidos por obrigação legal.
              </span>
            </label>
            {fieldErrors.ack && (
              <p className="text-xs text-red-600 -mt-2">{fieldErrors.ack}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full h-11 rounded-xl text-white font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#DC2626,#991B1B)" }}
            >
              {pending ? "Enviando…" : "Excluir conta"}
            </button>

            <p className="text-[11px] text-ink-500 text-center">
              Em alternativa, você pode solicitar a exclusão dentro do app
              (Perfil → Privacidade → Excluir conta) ou escrever para{" "}
              <a
                href="mailto:dpo@toqueplay.com"
                className="underline hover:text-ink-700"
              >
                dpo@toqueplay.com
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
