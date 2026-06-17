import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { radius } from '../../../theme/radius';
import { typography } from '../../../theme/typography';

interface TimelineEvent {
  type: string;
  team?: 'A' | 'B';
  setNumber?: number;
  scoreA?: number;
  scoreB?: number;
  timestamp: string;
}

interface Props {
  events: TimelineEvent[];
  teamAName: string;
  teamBName: string;
}

export function MatchEventTimeline({ events, teamAName, teamBName }: Props) {
  if (events.length === 0) return null;
  return (
    <View style={styles.timeline}>
      <Text style={styles.timelineTitle}>TIMELINE</Text>
      <View style={styles.timelineList}>
        {events.map((ev, i) => {
          const isPoint = ev.type === 'POINT';
          const isStart = ev.type === 'MATCH_START';
          const isMatchEnd = ev.type === 'MATCH_FINISH';
          const isSetEnd = ev.type === 'SET_FINISH';

          return (
            <View key={i} style={styles.timelineItem}>
              <View
                style={[
                  styles.tlDot,
                  isPoint && { backgroundColor: colors.primary },
                  isStart && { backgroundColor: colors.success },
                  isMatchEnd && { backgroundColor: colors.success },
                  isSetEnd && { backgroundColor: colors.primaryLight },
                  ev.type === 'SIDE_SWITCH' && { backgroundColor: '#FF9800' },
                  ev.type === 'WALKOVER' && { backgroundColor: colors.error },
                ]}
              />
              <Text style={styles.tlText}>
                {ev.type === 'POINT' &&
                  `Ponto ${ev.team === 'A' ? teamAName : teamBName}`}
                {ev.type === 'SIDE_SWITCH' && 'TROCA DE LADOS'}
                {ev.type === 'SET_FINISH' &&
                  `Set ${ev.setNumber} finalizado (${ev.scoreA} × ${ev.scoreB})`}
                {ev.type === 'MATCH_START' && 'Partida iniciada'}
                {ev.type === 'MATCH_FINISH' && 'Partida encerrada'}
                {ev.type === 'WALKOVER' &&
                  `W.O. — ${ev.team === 'A' ? teamAName : teamBName} venceu`}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timeline: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#EDEDF0',
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  timelineTitle: {
    fontSize: typography.sizes.heading,
    fontFamily: fonts.title.regular,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
    marginBottom: spacing.lg,
  },
  timelineList: { gap: spacing.md },
  timelineItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  tlDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  tlText: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.regular,
    color: colors.textSecondary,
    flex: 1,
  },
});
