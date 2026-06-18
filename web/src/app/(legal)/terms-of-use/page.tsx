import { renderLegalDoc } from "@/lib/legal-doc";

export const metadata = {
  title: "Termos de Uso · ToquePlay",
  description: "Termos de Uso da plataforma ToquePlay",
};

export const dynamic = "force-static";

export default async function TermsOfUsePage() {
  const html = await renderLegalDoc("terms-of-use");
  return (
    <article
      className="prose prose-sm mx-auto max-w-3xl px-4 py-12 text-ink-800"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
