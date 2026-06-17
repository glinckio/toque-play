export const LIVE_COLOR = '#E04545';

export function getCategoryMax(cat: string | null | undefined): number {
  switch (cat) {
    case 'DUO':
    case 'PAIR':
      return 2;
    case 'QUARTET':
      return 4;
    case 'SEXTET':
      return 6;
    default:
      return 0;
  }
}

export function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatTime(d: string | null): string | null {
  return d
    ? new Date(d).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : null;
}
