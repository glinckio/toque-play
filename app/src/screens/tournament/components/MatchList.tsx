import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Match, MatchStatus } from '../../../types/match';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import type { TournamentStackParamList } from '../../../navigation/types';
import TeamAvatar from '../../../components/TeamAvatar';

type Nav = NativeStackNavigationProp<TournamentStackParamList>;

interface Props {
  matches: Match[];
  tournamentId: string;
  isReferee?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: colors.textMuted,
  IN_PROGRESS: colors.primary,
  FINISHED: colors.success,
  WALKOVER: colors.primary,
  CANCELLED: colors.textMuted,
};

const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: 'Agendada',
  IN_PROGRESS: 'AO VIVO',
  FINISHED: 'Finalizada',
  WALKOVER: 'W.O.',
  CANCELLED: 'Cancelada',
};

const GROUP_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function hasGroupPhase(matches: Match[]): boolean {
  return matches.some((m) => m.group !== null && m.group !== undefined);
}

/**
 * Sort matches: interleave between groups for group phase.
 * For elimination, sort by round then position.
 */
function sortMatches(matches: Match[]): Match[] {
  const groupPhase = hasGroupPhase(matches);

  if (groupPhase) {
    const groupMatches = matches.filter((m) => m.group !== null && m.group !== undefined);
    const elimMatches = matches.filter((m) => m.group === null || m.group === undefined);

    // Assign sequential game index per group, then interleave A1 B1 C1 A2 B2 C2...
    const byGroup = new Map<number, Match[]>();
    for (const m of groupMatches) {
      const g = m.group ?? 0;
      if (!byGroup.has(g)) byGroup.set(g, []);
      byGroup.get(g)!.push(m);
    }

    // Sort matches within each group by round then position
    for (const [, gMatches] of byGroup) {
      gMatches.sort((a, b) => a.round - b.round || a.position - b.position);
    }

    // Interleave: pick match[i] from each group in order
    const sortedGroups = [...byGroup.keys()].sort((a, b) => a - b);
    const maxLen = Math.max(...[...byGroup.values()].map(gm => gm.length), 0);
    const interleaved: Match[] = [];
    for (let i = 0; i < maxLen; i++) {
      for (const gKey of sortedGroups) {
        const gMatches = byGroup.get(gKey)!;
        if (i < gMatches.length) {
          interleaved.push(gMatches[i]);
        }
      }
    }

    // Append elimination matches (sorted by round)
    const sortedElim = [...elimMatches].sort((a, b) => a.round - b.round || a.position - b.position);
    return [...interleaved, ...sortedElim];
  }

  // No group phase: sort by round then position
  return [...matches].sort((a, b) => a.round - b.round || a.position - b.position);
}

export default function MatchList({ matches, tournamentId, isReferee }: Props) {
  const navigation = useNavigation<Nav>();

  if (matches.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="calendar-outline" size={40} color={colors.textMuted} />
        <Text style={styles.emptyText}>Nenhum jogo encontrado</Text>
      </View>
    );
  }

  const sorted = sortMatches(matches);
  const showGroupLabels = hasGroupPhase(matches);

  return (
    <View>
      {sorted.map((match) => {
        const groupLabel = match.group !== null && match.group !== undefined
          ? `GRUPO ${GROUP_LABELS[match.group] ?? match.group + 1}`
          : null;

        return (
          <TouchableOpacity
            key={match.id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => {
              if (match.teamA && match.teamB) {
                navigation.navigate('LiveMatch', { matchId: match.id, tournamentId });
              }
            }}
          >
            {/* Group label + status badge */}
            <View style={styles.cardHeader}>
              <Text style={styles.roundLabel}>
                {match.label === 'FINAL' ? 'FINAL (1º e 2º Lugar)' : match.label === 'TERCEIRO_LUGAR' ? 'DISPUTA 3º E 4º LUGAR' : match.label === 'SEMIFINAL' ? 'SEMIFINAL' : groupLabel ?? `RODADA ${match.round}`}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[match.status] + '22' }]}>
                <Text style={[styles.statusText, { color: STATUS_COLORS[match.status] }]}>
                  {STATUS_LABELS[match.status]}
                </Text>
              </View>
            </View>

            {/* Teams + Score */}
            <View style={styles.scoreRow}>
              <View style={styles.teamCell}>
                <View style={[styles.avatarWrap, match.status === MatchStatus.FINISHED && match.winnerId && (match.winnerId === match.teamAId ? styles.winnerBorder : styles.loserBorder)]}>
                  <TeamAvatar avatarUrl={match.teamA?.avatarUrl} name={match.teamA?.name ?? 'TBD'} size={60} />
                </View>
                <Text style={styles.teamName} numberOfLines={1}>
                  {match.teamA?.name ?? 'TBD'}
                </Text>
              </View>
              <View style={styles.scoreCell}>
                <Text style={styles.scoreText}>{match.scoreTeamA}</Text>
                <Text style={styles.scoreDivider}>×</Text>
                <Text style={styles.scoreText}>{match.scoreTeamB}</Text>
              </View>
              <View style={styles.teamCell}>
                <View style={[styles.avatarWrap, match.status === MatchStatus.FINISHED && match.winnerId && (match.winnerId === match.teamBId ? styles.winnerBorder : styles.loserBorder)]}>
                  <TeamAvatar avatarUrl={match.teamB?.avatarUrl} name={match.teamB?.name ?? 'TBD'} size={60} />
                </View>
                <Text style={[styles.teamName, { textAlign: 'center' }]} numberOfLines={1}>
                  {match.teamB?.name ?? 'TBD'}
                </Text>
              </View>
            </View>

            {/* Referee "Apitar" button */}
            {isReferee && match.teamA && match.teamB && (match.status === MatchStatus.SCHEDULED || match.status === MatchStatus.IN_PROGRESS) && (
              <TouchableOpacity
                style={styles.refBtn}
                onPress={() => navigation.navigate('LiveMatch', { matchId: match.id, tournamentId })}
                activeOpacity={0.7}
              >
                <Ionicons name="flag" size={16} color={colors.text} />
                <Text style={styles.refBtnText}>
                  {match.status === MatchStatus.SCHEDULED ? 'APITAR' : 'VER PARTIDA'}
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', marginTop: 60, gap: spacing.md },
  emptyText: { fontSize: 14, fontFamily: fonts.text.regular, color: colors.textMuted },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md,
  },
  roundLabel: {
    fontSize: 10,
    fontFamily: fonts.text.semiBold,
    color: colors.primaryGlow,
    letterSpacing: 2,
  },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 10, fontFamily: fonts.text.semiBold, letterSpacing: 1 },
  scoreRow: { flexDirection: 'row', alignItems: 'center' },
  teamCell: { flex: 1, alignItems: 'center', gap: spacing.xs },
  teamName: {
    fontSize: 12, fontFamily: fonts.text.medium, color: colors.textSecondary, textAlign: 'center',
  },
  scoreCell: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md,
  },
  scoreText: {
    fontSize: 24, fontFamily: fonts.title.display, color: colors.text,
    minWidth: 32, textAlign: 'center', letterSpacing: 1,
  },
  scoreDivider: {
    fontSize: 18, fontFamily: fonts.text.regular, color: colors.textMuted,
    marginHorizontal: 6,
  },
  avatarWrap: { borderRadius: 22, padding: 2 },
  winnerBorder: { borderWidth: 2.5, borderColor: colors.success },
  loserBorder: { borderWidth: 2.5, borderColor: colors.error, opacity: 0.6 },
  refBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.md,
  },
  refBtnText: { fontSize: 12, fontFamily: fonts.text.semiBold, color: colors.text, letterSpacing: 1.5 },
});
