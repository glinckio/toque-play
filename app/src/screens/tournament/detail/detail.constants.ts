import { BracketType } from '../../../types/tournament';

export const MODALITY_LABELS: Record<string, string> = {
  BEACH: 'Praia',
  COURT: 'Quadra',
};

export const FORMAT_LABELS: Record<string, string> = {
  PAIR: 'Dupla',
  QUARTET: 'Quarteto',
  SEXTET: 'Sexteto',
};

export const TYPE_LABELS: Record<string, string> = {
  MASC: 'Masculino',
  FEM: 'Feminino',
  MISTO: 'Misto',
  MALE: 'Masculino',
  FEMALE: 'Feminino',
  MIX: 'Misto',
};

export const BRACKET_TYPE_OPTIONS: { key: BracketType; label: string; icon: string }[] = [
  { key: BracketType.SINGLE_ELIMINATION, label: 'Eliminatória Simples', icon: 'git-branch-outline' },
  { key: BracketType.DOUBLE_ELIMINATION, label: 'Eliminatória Dupla', icon: 'git-merge-outline' },
  { key: BracketType.ROUND_ROBIN, label: 'Todos contra Todos', icon: 'sync-outline' },
  { key: BracketType.GROUPS_THEN_ELIMINATION, label: 'Fases + Eliminatória', icon: 'grid-outline' },
];

export const BRACKET_INFO: Record<BracketType, { title: string; description: string; example: string }> = {
  [BracketType.SINGLE_ELIMINATION]: {
    title: 'Eliminatória Simples (Mata-mata)',
    description:
      'Cada partida elimina o perdedor. Quem perde, está fora do torneio. O vencedor de cada jogo avança para a próxima rodada até restar apenas o campeão.',
    example:
      'Exemplo com 8 times:\n\n  Oitavas    Quartas    Semifinal    Final\n  A vs B ─┐\n          ├─ ??? ─┐\n  C vs D ─┘       │\n                  ├─ ??? ─┐\n  E vs F ─┐       │       │\n          ├─ ??? ─┘       │\n  G vs H ─┘               │\n                          ├─ 🏆\n  (outro lado)            │\n                          ─┘',
  },
  [BracketType.DOUBLE_ELIMINATION]: {
    title: 'Eliminatória Dupla',
    description:
      'Cada time tem duas chances. A primeira derrota envia o time para a chave de repescagem (losers bracket). Uma segunda derrota elimina definitivamente. O vencedor da repescagem enfrenta o vencedor da chave principal na grande final.',
    example:
      'Exemplo com 4 times:\n\n  Chave Principal          Repescagem\n  A vs B ─┐\n          ├─ Vencedor ──┐     A vs B (perdedores)\n  C vs D ─┘             │     e C vs D\n                          │         │\n                    Semifinal   ──┤\n                          │         │\n                        Final ◀────┘\n                        (Campeão)',
  },
  [BracketType.ROUND_ROBIN]: {
    title: 'Todos contra Todos (Pontos Corridos)',
    description:
      'Cada time joga contra todos os outros times do grupo. Vitória soma pontos, derrota não. Ao final de todas as rodadas, a classificação define o campeão ou quem avança para a próxima fase.',
    example:
      'Exemplo com 4 times:\n\n  Rodada 1: A vs B  |  C vs D\n  Rodada 2: A vs C  |  B vs D\n  Rodada 3: A vs D  |  B vs C\n\n  Classificação final:\n  1º Time A  3V  6pts  🏆\n  2º Time C  2V  4pts\n  3º Time B  1V  2pts\n  4º Time D  0V  0pts',
  },
  [BracketType.GROUPS_THEN_ELIMINATION]: {
    title: 'Fase de Grupos + Eliminatória',
    description:
      'Os times são divididos em grupos. Dentro de cada grupo, todos jogam contra todos. Os melhores de cada grupo avançam para uma fase eliminatória (mata-mata) que define o campeão.',
    example:
      'Exemplo com 8 times:\n\n  Grupo A          Grupo B\n  ─────────        ────────\n  Time 1  2V  ✅   Time 5  2V  ✅\n  Time 2  1V  ✅   Time 6  1V  ✅\n  Team 3  1V       Team 7  1V\n  Team 4  0V       Team 8  0V\n\n  Eliminatória:\n  1º A vs 2º B ─┐\n                 ├─ Final 🏆\n  1º B vs 2º A ─┘',
  },
};

export const ROUND_LABELS: Record<number, string> = {
  1: 'Final',
  2: 'Semifinal',
  3: 'Quartas',
  4: 'Oitavas',
};

export function formatBRL(v: any): string {
  const n = Number(v);
  if (!v || isNaN(n) || n === 0) return 'Grátis';
  return `R$ ${n.toFixed(2).replace('.', ',')}`;
}
