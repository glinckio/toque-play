"use client";

/** Aplica máscara brasileira: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX. */
export function formatPhoneBR(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

interface PhoneInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function PhoneInput({
  value,
  onChange,
  placeholder = "(00) 00000-0000",
  className,
  id,
}: PhoneInputProps) {
  return (
    <input
      id={id}
      type="tel"
      inputMode="tel"
      value={formatPhoneBR(value)}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      maxLength={15}
    />
  );
}
