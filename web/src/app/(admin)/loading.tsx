export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="inline-block size-8 rounded-full border-2 border-brand-200 border-t-brand-600 animate-spin" />
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
