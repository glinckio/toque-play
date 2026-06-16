"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, MapPin } from "lucide-react";

export interface CepAddress {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function cleanCep(value: string): string {
  return value.replace(/\D/g, "");
}

export function CepInput({
  value,
  onAddressFound,
  onError,
}: {
  value?: string;
  onAddressFound: (data: CepAddress) => void;
  onError?: (msg: string | null) => void;
}) {
  const [cep, setCep] = useState(() => (value ? formatCep(value) : ""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef("");

  useEffect(() => {
    if (!value) return;
    const formatted = formatCep(value);
    if (cleanCep(formatted) === cleanCep(cep)) return;
    setCep(formatted);
    fetchedRef.current = cleanCep(formatted);
  }, [value]);

  async function handleChange(text: string) {
    const formatted = formatCep(text);
    setCep(formatted);
    setError(null);
    onError?.(null);

    const digits = cleanCep(formatted);
    if (digits.length !== 8) return;
    if (digits === fetchedRef.current) return;
    fetchedRef.current = digits;

    setLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = (await res.json()) as { erro?: boolean; logradouro?: string; bairro?: string; localidade?: string; uf?: string; cep?: string };
      if (data.erro) {
        setError("CEP não encontrado");
        onError?.("CEP não encontrado");
        return;
      }
      onAddressFound({
        street: data.logradouro ?? "",
        neighborhood: data.bairro ?? "",
        city: data.localidade ?? "",
        state: data.uf ?? "",
        cep: data.cep ?? "",
      });
    } catch {
      setError("Erro ao buscar CEP");
      onError?.("Erro ao buscar CEP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wider font-semibold text-ink-500 mb-1.5">
        CEP
      </span>
      <div
        className={`flex items-center gap-2 h-10 px-3 rounded-xl bg-page border ${
          error ? "border-danger" : "border-brand-100 focus-within:border-brand-500"
        } outline-none`}
      >
        <MapPin size={15} className="text-ink-300" />
        <input
          value={cep}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="00000-000"
          inputMode="numeric"
          maxLength={9}
          className="flex-1 bg-transparent outline-none text-sm text-ink-900 placeholder:text-ink-300"
        />
        {loading && <Loader2 size={14} className="animate-spin text-brand-500" />}
        {!loading && cep.length === 9 && !error && <Check size={14} className="text-success" />}
      </div>
      {error && <span className="block text-xs text-danger-fg mt-1">{error}</span>}
    </label>
  );
}
