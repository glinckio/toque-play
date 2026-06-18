import { redirect } from "next/navigation";
import DeleteAccountForm from "./DeleteAccountForm";

export const metadata = {
  title: "Excluir conta · ToquePlay",
  description:
    "Solicite a exclusão da sua conta ToquePlay e anonimização dos seus dados pessoais (LGPD art. 18, VI · Google Play Data Deletion).",
};

const API = process.env.API_INTERNAL_URL ?? "http://localhost:3000/api";

async function submitDeleteRequest(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").trim();
  const confirmEmail = String(formData.get("confirmEmail") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();
  const ack = formData.get("ack") === "on";

  const errors: Record<string, string> = {};
  if (!email) errors.email = "Email obrigatório";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Email inválido";
  if (email !== confirmEmail) errors.confirmEmail = "Os emails não conferem";
  if (!ack) errors.ack = "Você precisa confirmar que entende as consequências";

  if (Object.keys(errors).length > 0) {
    redirect(
      `/delete-account?error=${encodeURIComponent(JSON.stringify(errors))}&email=${encodeURIComponent(email)}`,
    );
  }

  const message = reason
    ? `Solicitação de exclusão de conta via formulário web (Google Play Data Deletion). Motivo informado: ${reason}`
    : "Solicitação de exclusão de conta via formulário web (Google Play Data Deletion).";

  const res = await fetch(`${API}/me/dpo-contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "DELETION",
      subject: "Exclusão de conta — formulário web",
      message,
      email,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    redirect(
      `/delete-account?error=${encodeURIComponent(
        `Falha ao registrar (${res.status}). Tente novamente ou escreva para dpo@toqueplay.com.`,
      )}&email=${encodeURIComponent(email)}`,
    );
  }

  redirect("/delete-account?success=1");
}

export default async function DeleteAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; email?: string }>;
}) {
  const params = await searchParams;
  const success = params.success === "1";
  let fieldErrors: Record<string, string> = {};
  let topError: string | null = null;
  if (params.error) {
    try {
      const parsed = JSON.parse(decodeURIComponent(params.error));
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        fieldErrors = parsed as Record<string, string>;
      } else {
        topError = String(parsed);
      }
    } catch {
      topError = decodeURIComponent(params.error);
    }
  }

  return (
    <DeleteAccountForm
      action={submitDeleteRequest}
      success={success}
      fieldErrors={fieldErrors}
      topError={topError}
      defaultEmail={params.email ?? ""}
    />
  );
}
