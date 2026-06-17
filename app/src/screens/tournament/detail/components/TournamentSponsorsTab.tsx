import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../theme/colors';
import { spacing } from '../../../../theme/spacing';
import { fonts } from '../../../../theme/fonts';
import { radius } from '../../../../theme/radius';
import type { Tournament } from '../../../../types/tournament';

interface Props {
  tournament: Tournament;
}

export function TournamentSponsorsTab({ tournament }: Props) {
  if (!tournament.sponsors || tournament.sponsors.length === 0) {
    return <Text style={styles.emptyText}>Nenhum patrocinador.</Text>;
  }
  return (
    <View style={styles.grid}>
      {tournament.sponsors.map((sp: any) => (
        <View key={sp.id} style={styles.card}>
          <View style={styles.icon}>
            <Ionicons name="trophy-outline" size={24} color={colors.primary} />
          </View>
          <Text style={styles.name}>{sp.name}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    fontFamily: fonts.text.regular,
    fontSize: 13,
    color: colors.textPlaceholder,
    textAlign: 'center',
    paddingVertical: spacing.xxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.xl,
    alignItems: 'center',
    width: '47%',
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    fontFamily: fonts.text.bold,
    fontSize: 13,
    color: colors.text,
  },
});
