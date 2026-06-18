import { promises as fs } from "node:fs";
import path from "node:path";
import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

export type LegalDocSlug = "terms-of-use" | "privacy-policy";

const DOC_FILES: Record<LegalDocSlug, string> = {
  "terms-of-use": "terms-of-use.md",
  "privacy-policy": "privacy-policy.md",
};

/**
 * Reads a LGPD legal doc from packages/docs/lgpd and returns rendered HTML.
 * Runs in Node (server component only). Path is relative to the web package
 * root (process.cwd()).
 */
export async function renderLegalDoc(slug: LegalDocSlug): Promise<string> {
  const file = DOC_FILES[slug];
  if (!file) throw new Error(`Unknown legal doc: ${slug}`);
  const docPath = path.resolve(process.cwd(), "..", "docs", "lgpd", file);
  const md = await fs.readFile(docPath, "utf8");
  return await marked.parse(md);
}
