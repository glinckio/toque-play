"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-8 text-center">
      <p className="font-display text-2xl text-ink-900">Algo deu errado</p>
      <p className="text-sm text-ink-500 max-w-md">
        {error?.message || "Ocorreu um erro inesperado ao carregar esta página."}
      </p>
      {error?.digest && (
        <p className="text-[11px] text-ink-400 font-mono">
          Ref: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        className="px-4 h-10 rounded-xl text-white"
        style={{
          background: "linear-gradient(135deg,#6D2EC0,#4A1F87)",
          fontSize: 13,
          fontWeight: 700,
          boxShadow: "0 4px 12px rgba(109,46,192,0.25)",
        }}
      >
        Tentar novamente
      </button>
    </div>
  );
}
