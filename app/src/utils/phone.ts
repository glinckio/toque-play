/**
 * Brazilian phone mask formatter.
 * Handles both 10-digit (landline: (00) 0000-0000) and 11-digit (mobile: (00) 00000-0000).
 * Strips non-digit input, then applies the mask progressively.
 *
 * @example
 *   formatPhoneBR('11987654321')  // '(11) 98765-4321'
 *   formatPhoneBR('1133334444')   // '(11) 3333-4444'
 *   formatPhoneBR('11')           // '(11'
 *   formatPhoneBR('abc')          // ''
 */
export function formatPhoneBR(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';

  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);

  let out = `(${ddd}`;
  if (digits.length > 2) out += ') ';
  else return out; // "(11" while still typing DDD

  if (rest.length === 0) return out;

  // Mobile: 9 digits after DDD → 00000-0000
  if (rest.length > 6) {
    return `${out}${rest.slice(0, 5)}-${rest.slice(5, 9)}`;
  }
  // Landline or partial mobile up to 6 digits → 0000-0000 (partial)
  if (rest.length > 4) {
    return `${out}${rest.slice(0, 4)}-${rest.slice(4)}`;
  }
  // Up to 4 digits, no hyphen yet
  return `${out}${rest}`;
}
