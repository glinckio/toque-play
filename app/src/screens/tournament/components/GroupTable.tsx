import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BracketResponse, Match, MatchStatus } from '../../../types/match';
import { BracketType } from '../../../types/tournament';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';

interface Props {
  matchesByRound?: Record<number, Match[]>;
  brackets: BracketResponse[];
}

interface GroupStats {
  teamId: string;
  teamName: string;
  played: number;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
}

function computeGroupStats(matches: Match[]): GroupStats[] {
  const stats: Record<string, GroupStats> = {};

  for (const m of matches) {
    if (!m.teamA || !m.teamB) continue;
    if (m.status !== MatchStatus.FINISHED && m.status !== MatchStatus.WALKOVER) continue;

    if (!stats[m.teamA.id]) stats[m.teamA.id] = { teamId: m.teamA.id, teamName: m.teamA.name, played: 0, wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0 };
    if (!stats[m.teamB.id]) stats[m.teamB.id] = { teamId: m.teamB.id, teamName: m.teamB.name, played: 0, wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0 };

    stats[m.teamA.id].played++;
    stats[m.teamB.id].played++;
    stats[m.teamA.id].pointsFor += m.scoreTeamA;
    stats[m.teamA.id].pointsAgainst += m.scoreTeamB;
    stats[m.teamB.id].pointsFor += m.scoreTeamB;
    stats[m.teamB.id].pointsAgainst += m.scoreTeamA;

    if (m.scoreTeamA > m.scoreTeamB) {
      stats[m.teamA.id].wins++;
      stats[m.teamB.id].losses++;
    } else if (m.scoreTeamB > m.scoreTeamA) {
      stats[m.teamB.id].wins++;
      stats[m.teamA.id].losses++;
    }
  }

  return Object.values(stats).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    const saldoA = a.pointsFor - a.pointsAgainst;
    const saldoB = b.pointsFor - b.pointsAgainst;
    if (saldoB !== saldoA) return saldoB - saldoA;
    return b.pointsFor - a.pointsFor;
  });
}

export default function GroupTable({ brackets }: Props) {
  const roundRobinBrackets = brackets.filter((b) => b.type === BracketType.ROUND_ROBIN);

  // Group matches by match.group field (for GROUPS_THEN_ELIMINATION)
  const hasGroupField = roundRobinBrackets.some((b) =>
    b.matches.some((m) => m.group !== null && m.group !== undefined),
  );

  if (hasGroupField) {
    // GROUPS_THEN_ELIMINATION: group by match.group
    const bracket = roundRobinBrackets[0];
    const groupMap = new Map<number, Match[]>();
    for (const m of bracket.matches) {
      const g = m.group ?? 0;
      if (!groupMap.has(g)) groupMap.set(g, []);
      groupMap.get(g)!.push(m);
    }

    const sortedGroups = [...groupMap.entries()].sort((a, b) => a[0] - b[0]);

    if (sortedGroups.length === 0) {
      return (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhum grupo disponível</Text>
        </View>
      );
    }

    return (
      <View>
        {sortedGroups.map(([groupIdx, matches], idx) => {
          const stats = computeGroupStats(matches);
          return (
            <View key={groupIdx} style={styles.groupSection}>
              <Text style={styles.groupTitle}>
                GRUPO {String.fromCharCode(65 + idx)}
              </Text>

              <View style={styles.headerRow}>
                <Text style={[styles.cell, styles.cellPos, styles.headerText]}>#</Text>
                <Text style={[styles.cell, styles.cellName, styles.headerText]}>TIME</Text>
                <Text style={[styles.cell, styles.cellStat, styles.headerText]}>J</Text>
                <Text style={[styles.cell, styles.cellStat, styles.headerText]}>V</Text>
                <Text style={[styles.cell, styles.cellStat, styles.headerText]}>D</Text>
                <Text style={[styles.cell, styles.cellStat, styles.headerText]}>PF</Text>
                <Text style={[styles.cell, styles.cellStat, styles.headerText]}>PS</Text>
                <Text style={[styles.cell, styles.cellStat, styles.headerText]}>SD</Text>
              </View>

              {stats.map((entry, pos) => {
                const isTop = pos < 2;
                const saldo = entry.pointsFor - entry.pointsAgainst;
                return (
                  <View key={entry.teamId} style={[styles.row, isTop && styles.topRow]}>
                    <Text style={[styles.cell, styles.cellPos, isTop && styles.topText]}>{pos + 1}</Text>
                    <Text style={[styles.cell, styles.cellName, isTop && styles.topText]} numberOfLines={1}>
                      {entry.teamName}
                    </Text>
                    <Text style={[styles.cell, styles.cellStat, isTop && styles.topText]}>{entry.played}</Text>
                    <Text style={[styles.cell, styles.cellStat, isTop && styles.topText]}>{entry.wins}</Text>
                    <Text style={[styles.cell, styles.cellStat, isTop && styles.topText]}>{entry.losses}</Text>
                    <Text style={[styles.cell, styles.cellStat, isTop && styles.topText]}>{entry.pointsFor}</Text>
                    <Text style={[styles.cell, styles.cellStat, isTop && styles.topText]}>{entry.pointsAgainst}</Text>
                    <Text style={[styles.cell, styles.cellStat, isTop && styles.topText, styles.cellBold]}>
                      {saldo > 0 ? `+${saldo}` : saldo}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    );
  }

  // Standard ROUND_ROBIN: 1 bracket = 1 group
  if (roundRobinBrackets.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Nenhum grupo disponível</Text>
      </View>
    );
  }

  return (
    <View>
      {roundRobinBrackets.map((bracket, idx) => {
        const stats = computeGroupStats(bracket.matches);

        return (
          <View key={bracket.id} style={styles.groupSection}>
            <Text style={styles.groupTitle}>
              GRUPO {String.fromCharCode(65 + idx)}
            </Text>

            <View style={styles.headerRow}>
              <Text style={[styles.cell, styles.cellPos, styles.headerText]}>#</Text>
              <Text style={[styles.cell, styles.cellName, styles.headerText]}>TIME</Text>
              <Text style={[styles.cell, styles.cellStat, styles.headerText]}>J</Text>
              <Text style={[styles.cell, styles.cellStat, styles.headerText]}>V</Text>
              <Text style={[styles.cell, styles.cellStat, styles.headerText]}>D</Text>
              <Text style={[styles.cell, styles.cellStat, styles.headerText]}>PF</Text>
              <Text style={[styles.cell, styles.cellStat, styles.headerText]}>PS</Text>
              <Text style={[styles.cell, styles.cellStat, styles.headerText]}>SD</Text>
            </View>

            {stats.map((entry, pos) => {
              const isTop = pos < 2;
              const saldo = entry.pointsFor - entry.pointsAgainst;
              return (
                <View key={entry.teamId} style={[styles.row, isTop && styles.topRow]}>
                  <Text style={[styles.cell, styles.cellPos, isTop && styles.topText]}>{pos + 1}</Text>
                  <Text style={[styles.cell, styles.cellName, isTop && styles.topText]} numberOfLines={1}>
                    {entry.teamName}
                  </Text>
                  <Text style={[styles.cell, styles.cellStat, isTop && styles.topText]}>{entry.played}</Text>
                  <Text style={[styles.cell, styles.cellStat, isTop && styles.topText]}>{entry.wins}</Text>
                  <Text style={[styles.cell, styles.cellStat, isTop && styles.topText]}>{entry.losses}</Text>
                  <Text style={[styles.cell, styles.cellStat, isTop && styles.topText]}>{entry.pointsFor}</Text>
                  <Text style={[styles.cell, styles.cellStat, isTop && styles.topText]}>{entry.pointsAgainst}</Text>
                  <Text style={[styles.cell, styles.cellStat, isTop && styles.topText, styles.cellBold]}>
                    {saldo > 0 ? `+${saldo}` : saldo}
                  </Text>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  groupSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  groupTitle: {
    fontSize: 16,
    fontFamily: fonts.title.display,
    color: colors.text,
    letterSpacing: 2,
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
  },
  headerText: {
    fontSize: 9,
    fontFamily: fonts.text.semiBold,
    color: colors.textMuted,
    letterSpacing: 1.5,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
  },
  topRow: { backgroundColor: 'rgba(109,46,192,0.08)' },
  topText: { color: colors.primaryGlow, fontFamily: fonts.text.semiBold },
  cell: { fontSize: 12, fontFamily: fonts.text.regular, color: colors.textSecondary },
  cellPos: { width: 28, textAlign: 'center' },
  cellName: { flex: 1 },
  cellStat: { width: 32, textAlign: 'center' },
  cellBold: { fontFamily: fonts.text.bold },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 14, fontFamily: fonts.text.regular, color: colors.textMuted },
});
