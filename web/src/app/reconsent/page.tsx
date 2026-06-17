import { redirect } from "next/navigation";
import { Flag, FileText, ShieldCheck } from "lucide-react";
import { getSessionUser } from "@/lib/auth/cookies";
import { acceptCurrentTerms, getConsentsState } from "@/lib/auth/consents";
import { performLogout } from "@/lib/auth/session";

export const metadata = { title: "Termos atualizados · ToquePlay Admin" };

const TERMS_OF_USE_URL = "https://toqueplay.com/terms-of-use";
const PRIVACY_POLICY_URL = "https://toqueplay.com/privacy-policy";

export default async function ReconsentPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const state = await getConsentsState();
  if (state && !state.termsOutdated) redirect("/");

  async function accept(formData: FormData) {
    "use server";
    await acceptCurrentTerms();
    redirect("/");
  }

  async function logout() {
    "use server";
    await performLogout();
    redirect("/login");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-page px-4 py-12">
      <div className="w-full max-w-[560px]">
        <div className="text-center mb-8">
          <div className="size-14 rounded-2xl mx-auto flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/30">
            <Flag size={26} color="#FFF" strokeWidth={2.4} />
          </div>
          <h1 className="font-display text-3xl text-ink-900 mt-4">
            TERMOS ATUALIZADOS
          </h1>
          <p className="text-xs uppercase tracking-widest text-ink-500 mt-1">
            Versão {state?.version ?? "—"}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-brand-100 p-6 space-y-5">
          <p className="text-sm text-ink-700 leading-relaxed">
            Os <strong>Termos de Uso</strong> e a <strong>Política de
            Privacidade</strong> do ToquePlay foram atualizados. Para continuar
            acessando o console administrativo, revise a nova versão e confirme
            sua aceitação (LGPD art. 8).
          </p>

          {state?.lastAcceptedVersion && (
            <p className="text-xs text-ink-500">
              Você havia aceito a versão{" "}
              <strong>{state.lastAcceptedVersion}</strong>
              {state.lastAcceptedAt
                ? ` em ${new Date(state.lastAcceptedAt).toLocaleDateString("pt-BR")}`
                : ""}
              .
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={TERMS_OF_USE_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-brand-100 bg-page hover:border-brand-500 transition-colors"
            >
              <FileText size={18} className="text-brand-500" />
              <div>
                <p className="text-xs font-bold text-ink-900">Termos de Uso</p>
                <p className="text-[11px] text-ink-500">Abrir em nova aba</p>
              </div>
            </a>
            <a
              href={PRIVACY_POLICY_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-brand-100 bg-page hover:border-brand-500 transition-colors"
            >
              <ShieldCheck size={18} className="text-brand-500" />
              <div>
                <p className="text-xs font-bold text-ink-900">Política de Privacidade</p>
                <p className="text-[11px] text-ink-500">Abrir em nova aba</p>
              </div>
            </a>
          </div>

          <form action={accept} className="space-y-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-0.5 size-4 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-xs text-ink-700">
                Li e aceito a nova versão dos Termos de Uso e da Política de
                Privacidade do ToquePlay.
              </span>
            </label>

            <button
              type="submit"
              className="w-full h-11 rounded-xl text-white font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#6D2EC0,#4A1F87)" }}
            >
              Aceitar e continuar
            </button>
          </form>

          <form action={logout}>
            <button
              type="submit"
              className="w-full h-9 text-xs font-semibold text-ink-500 hover:text-ink-700"
            >
              Sair da conta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
