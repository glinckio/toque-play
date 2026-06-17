import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../../theme/colors';
import { spacing } from '../../../../theme/spacing';
import { fonts } from '../../../../theme/fonts';
import { radius } from '../../../../theme/radius';
import { typography } from '../../../../theme/typography';
import type { Tournament } from '../../../../types/tournament';

interface Props {
  tournament: Tournament;
  owner?: { name: string; email: string } | null;
}

export function TournamentOverviewTab({ tournament, owner }: Props) {
  return (
    <>
      {tournament.description ? (
        <Text style={styles.description}>{tournament.description}</Text>
      ) : null}

      {(tournament.stages?.length ?? 0) > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {(tournament.stages?.length ?? 0) === 1 ? 'ETAPA ÚNICA' : 'ETAPAS'}
          </Text>
          <View style={styles.stagesCard}>
            {tournament.stages!.map((s: any, i: number) => {
              const isSingle = tournament.stages!.length === 1;
              const d = new Date(s.date);
              const dateStr = d.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
              const startD = s.startTime ? new Date(s.startTime) : null;
              const timeStr = startD
                ? startD.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                : null;
              return (
                <View
                  key={s.id}
                  style={[
                    styles.stageRow,
                    i < tournament.stages!.length - 1 && styles.stageBorder,
                  ]}
                >
                  {!isSingle && (
                    <View style={styles.stageNum}>
                      <Text style={styles.stageNumText}>{i + 1}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stageName}>
                      {isSingle ? (s.name ?? tournament.name) : (s.name ?? `Etapa ${i + 1}`)}
                    </Text>
                    <Text style={styles.stageMeta}>
                      {dateStr}
                      {timeStr ? ` · ${timeStr}` : ''}
                      {s.city ? ` · ${s.city}` : ''}
                      {s.state ? `/${s.state}` : ''}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {owner && (
        <View style={styles.organizerCard}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={StyleSheet.absoluteFillObject}
          />
          <Text style={styles.organizerTitle}>ORGANIZADOR</Text>
          <View style={styles.organizerRow}>
            <View style={styles.organizerAvatar}>
              <Text style={styles.organizerAvatarText}>
                {(owner.name ?? '?')[0].toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.organizerName}>{owner.name}</Text>
              <Text style={styles.organizerEmail}>{owner.email}</Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  description: {
    fontFamily: fonts.text.regular,
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  section: { marginBottom: spacing.xxl },
  sectionTitle: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.heading,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
    marginBottom: spacing.lg,
  },
  stagesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: 0,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  stageBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryTint,
  },
  stageNum: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageNumText: {
    fontFamily: fonts.title.regular,
    fontSize: 14,
    color: colors.primary,
  },
  stageName: {
    fontFamily: fonts.text.bold,
    fontSize: 14,
    color: colors.text,
  },
  stageMeta: {
    fontFamily: fonts.text.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  organizerCard: {
    borderRadius: radius.card,
    padding: spacing.xl,
    overflow: 'hidden',
    marginBottom: spacing.xxl,
  },
  organizerTitle: {
    fontFamily: fonts.title.regular,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  organizerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  organizerAvatarText: {
    fontFamily: fonts.title.regular,
    fontSize: 18,
    color: '#FFFFFF',
  },
  organizerName: {
    fontFamily: fonts.text.bold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  organizerEmail: {
    fontFamily: fonts.text.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
});
