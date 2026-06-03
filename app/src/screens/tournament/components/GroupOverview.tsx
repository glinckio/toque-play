import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BracketResponse, Match, MatchStatus } from '../../../types/match';
import TeamAvatar from '../../../components/TeamAvatar';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';

interface Props {
  brackets: BracketResponse[];
}

const GROUP_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

interface TeamCard {
  id: string;
  name: string;
  avatarUrl: string | null;
  wins: number;
  losses: number;
  played: number;
}

function computeTeamStats(matches: Match[]): Map<string, TeamCard> {
  const stats = new Map<string, TeamCard>();

  for (const m of matches) {
    if (!m.teamA || !m.teamB) continue;
    if (m.status !== MatchStatus.FINISHED && m.status !== MatchStatus.WALKOVER) continue;

    for (const team of [m.teamA, m.teamB]) {
      if (!stats.has(team.id)) {
        stats.set(team.id, { id: team.id, name: team.name, avatarUrl: team.avatarUrl, wins: 0, losses: 0, played: 0 });
      }
    }

    const a = stats.get(m.teamA.id)!;
    const b = stats.get(m.teamB.id)!;
    a.played++;
    b.played++;

    if (m.scoreTeamA > m.scoreTeamB) { a.wins++; b.losses++; }
    else if (m.scoreTeamB > m.scoreTeamA) { b.wins++; a.losses++; }
  }

  return stats;
}

export default function GroupOverview({ brackets }: Props) {
  if (brackets.length === 0) return null;

  const bracket = brackets[0];
  const matches = bracket.matches;

  // Check if matches have group field
  const hasGroupField = matches.some((m) => m.group !== null && m.group !== undefined);

  if (hasGroupField) {
    // GROUPS_THEN_ELIMINATION: group by match.group
    const groupMap = new Map<number, Match[]>();
    for (const m of matches) {
      const g = m.group ?? 0;
      if (!groupMap.has(g)) groupMap.set(g, []);
      groupMap.get(g)!.push(m);
    }

    const sortedGroups = [...groupMap.entries()].sort((a, b) => a[0] - b[0]);

    return (
      <View>
        {sortedGroups.map(([groupIdx, groupMatches], idx) => {
          const stats = computeTeamStats(groupMatches);
          const sorted = [...stats.values()].sort((a, b) => b.wins - a.wins || (b.wins / (b.played || 1)) - (a.wins / (a.played || 1)));
          const allTeams = getAllTeamsFromMatches(groupMatches);

          return (
            <View key={groupIdx} style={styles.groupCard}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupLabel}>GRUPO {GROUP_LABELS[idx]}</Text>
                <Text style={styles.groupCount}>{allTeams.length} times</Text>
              </View>
              <View style={styles.teamsGrid}>
                {allTeams.map((team) => {
                  const s = stats.get(team.id);
                  return (
                    <View key={team.id} style={styles.teamCard}>
                      <View style={styles.teamAvatar}>
                        <TeamAvatar avatarUrl={team.avatarUrl} name={team.name} size={44} />
                      </View>
                      <Text style={styles.teamName} numberOfLines={1}>{team.name.replace('[Seed T] ', '')}</Text>
                      {s && s.played > 0 && (
                        <Text style={styles.teamStats}>{s.wins}V {s.losses}D</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  return null;
}

function getAllTeamsFromMatches(matches: Match[]): { id: string; name: string; avatarUrl: string | null }[] {
  const seen = new Map<string, { id: string; name: string; avatarUrl: string | null }>();
  for (const m of matches) {
    if (m.teamA && !seen.has(m.teamA.id)) seen.set(m.teamA.id, m.teamA);
    if (m.teamB && !seen.has(m.teamB.id)) seen.set(m.teamB.id, m.teamB);
  }
  return [...seen.values()];
}

const styles = StyleSheet.create({
  groupCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  groupLabel: {
    fontSize: 18,
    fontFamily: fonts.title.display,
    color: colors.text,
    letterSpacing: 2,
  },
  groupCount: {
    fontSize: 11,
    fontFamily: fonts.text.medium,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  teamsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  teamCard: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  teamAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  teamName: {
    fontSize: 12,
    fontFamily: fonts.text.semiBold,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  teamStats: {
    fontSize: 10,
    fontFamily: fonts.text.medium,
    color: colors.primaryGlow,
    letterSpacing: 1,
  },
});
