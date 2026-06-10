import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { Match } from '../../types/match';
import TeamAvatar from '../TeamAvatar';

interface Props {
  match: Match;
  tournamentName?: string;
  onPress?: () => void;
}

function fmtShortDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export default function MatchCard({ match, tournamentName, onPress }: Props) {
  const isLive = match.status === 'IN_PROGRESS';
  const isFinished = match.status === 'FINISHED' || match.status === 'WALKOVER';
  const setsWonA = match.sets?.filter((s) => s.scoreA > s.scoreB).length ?? 0;
  const setsWonB = match.sets?.filter((s) => s.scoreB > s.scoreA).length ?? 0;
  const currentSet = match.sets?.[match.sets.length - 1];
  const scoreA = isLive && currentSet ? currentSet.scoreA : (isLive ? match.scoreTeamA : setsWonA);
  const scoreB = isLive && currentSet ? currentSet.scoreB : (isLive ? match.scoreTeamB : setsWonB);

  const cleanName = (name?: string | null) => name?.replace('[Seed T] ', '') ?? 'TBD';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.card}>
      {/* Live gradient background */}
      {isLive && (
        <LinearGradient
          colors={[colors.primaryDark, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {/* Top row: tournament name + live badge */}
      <View style={[styles.topRow, isLive && styles.topRowLive]}>
        <View style={styles.tournamentRow}>
          <Ionicons name="trophy" size={13} color={isLive ? 'rgba(255,255,255,0.7)' : colors.primary} />
          <Text style={[styles.tournamentName, isLive && styles.tournamentNameLive]} numberOfLines={1}>
            {tournamentName ?? 'Amistoso'}
          </Text>
        </View>
        {isLive && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>AO VIVO</Text>
          </View>
        )}
        {isFinished && (
          <View style={styles.doneBadge}>
            <Ionicons name="checkmark-circle" size={12} color={colors.success} />
            <Text style={styles.doneText}>ENCERRADA</Text>
          </View>
        )}
      </View>

      {/* Score section */}
      <View style={styles.scoreSection}>
        {/* Team A */}
        <View style={styles.teamCol}>
          <TeamAvatar
            avatarUrl={match.teamA?.avatarUrl}
            name={cleanName(match.teamA?.name)}
            size={48}
          />
          <Text style={[styles.teamName, isLive && styles.textLive]} numberOfLines={1}>
            {cleanName(match.teamA?.name)}
          </Text>
        </View>

        {/* Score center */}
        <View style={styles.scoreCenter}>
          <Text style={[styles.scoreNum, isLive && styles.scoreNumLive]}>{scoreA}</Text>
          <View style={styles.scoreMidCol}>
            <Text style={[styles.scoreVs, isLive && styles.scoreVsLive]}>×</Text>
            {isLive && currentSet && (
              <Text style={styles.setLabel}>Set {currentSet.setNumber}</Text>
            )}
          </View>
          <Text style={[styles.scoreNum, isLive && styles.scoreNumLive]}>{scoreB}</Text>
        </View>

        {/* Team B */}
        <View style={styles.teamCol}>
          <TeamAvatar
            avatarUrl={match.teamB?.avatarUrl}
            name={cleanName(match.teamB?.name)}
            size={48}
          />
          <Text style={[styles.teamName, isLive && styles.textLive]} numberOfLines={1}>
            {cleanName(match.teamB?.name)}
          </Text>
        </View>
      </View>

      {/* Sets chips (if best of > 1) */}
      {match.sets && match.sets.length > 1 && (
        <View style={[styles.setsRow, isLive && styles.setsRowLive]}>
          {match.sets.map((set) => {
            const isCurrent = isLive && set === currentSet;
            return (
              <View key={set.id} style={[styles.setChip, isCurrent && styles.setChipCurrent, !isLive && set.scoreA !== set.scoreB && styles.setChipDone]}>
                <Text style={[styles.setChipText, isCurrent && styles.setChipTextCurrent, !isLive && set.scoreA !== set.scoreB && styles.setChipTextDone]}>
                  {set.scoreA}-{set.scoreB}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Footer */}
      <View style={[styles.footer, isLive && styles.footerLive]}>
        <Text style={[styles.footerText, isLive && styles.footerTextLive]}>
          {isLive ? 'Acompanhar' : isFinished ? 'Partida encerrada' : fmtShortDate(match.scheduledAt)}
        </Text>
        <Ionicons name="chevron-forward" size={14} color={isLive ? 'rgba(255,255,255,0.5)' : colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },

  // Top row
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  topRowLive: {},
  tournamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  tournamentName: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.md,
    color: colors.primary,
    flex: 1,
  },
  tournamentNameLive: {
    color: 'rgba(255,255,255,0.8)',
  },

  // Live badge
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(224,69,69,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  liveText: {
    fontFamily: fonts.text.bold,
    fontSize: 11,
    color: '#FF4444',
    letterSpacing: 1.5,
  },

  // Done badge
  doneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(31,184,122,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  doneText: {
    fontFamily: fonts.text.semiBold,
    fontSize: 11,
    color: colors.success,
    letterSpacing: 0.5,
  },

  // Score section
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  teamCol: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  teamName: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.body,
    color: colors.text,
    textAlign: 'center',
  },
  textLive: {
    color: '#FFFFFF',
  },

  // Score center
  scoreCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  scoreMidCol: {
    alignItems: 'center',
    gap: 2,
  },
  scoreNum: {
    fontFamily: fonts.title.regular,
    fontSize: 40,
    color: colors.primary,
    lineHeight: 44,
    letterSpacing: 2,
  },
  scoreNumLive: {
    color: '#FFFFFF',
    fontSize: 44,
    lineHeight: 48,
  },
  scoreVs: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.input,
    color: colors.textMuted,
  },
  scoreVsLive: {
    color: 'rgba(255,255,255,0.4)',
  },
  setLabel: {
    fontFamily: fonts.text.semiBold,
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },

  // Sets row
  setsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  setsRowLive: {},
  setChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.primaryTint,
  },
  setChipCurrent: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  setChipDone: {
    backgroundColor: colors.primary,
  },
  setChipText: {
    fontFamily: fonts.title.regular,
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  setChipTextCurrent: {
    color: '#FFFFFF',
  },
  setChipTextDone: {
    color: '#FFFFFF',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F0ECF5',
  },
  footerLive: {
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  footerText: {
    fontFamily: fonts.text.medium,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
  },
  footerTextLive: {
    color: 'rgba(255,255,255,0.6)',
  },
});
