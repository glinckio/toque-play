import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formata valor em centavos como BRL. */
export function brl(cents: number) {
  return `R$ ${(cents / 100).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
}

/** Iniciais a partir de nome para avatars fallback. */
export function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}
