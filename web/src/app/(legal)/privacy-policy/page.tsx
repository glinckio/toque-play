import { renderLegalDoc } from "@/lib/legal-doc";

export const metadata = {
  title: "Política de Privacidade · ToquePlay",
  description: "Política de Privacidade da plataforma ToquePlay (LGPD)",
};

export const dynamic = "force-static";

export default async function PrivacyPolicyPage() {
  const html = await renderLegalDoc("privacy-policy");
  return (
    <article
      className="prose prose-sm mx-auto max-w-3xl px-4 py-12 text-ink-800"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
