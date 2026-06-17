import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../../theme/colors';
import { spacing } from '../../../../theme/spacing';
import { fonts } from '../../../../theme/fonts';
import StatusBadge from '../../../../components/StatusBadge';
import type { Tournament } from '../../../../types/tournament';

interface Props {
  tournament: Tournament;
  coverUrl?: string | null;
  stageDate?: string | null;
  stageCity?: string | null;
  tournamentCity?: string | null;
  regCount: number;
  insetsTop: number;
  onBack: () => void;
}

export function TournamentCover({
  tournament,
  coverUrl,
  stageDate,
  stageCity,
  tournamentCity,
  regCount,
  insetsTop,
  onBack,
}: Props) {
  return (
    <View style={styles.cover}>
      {coverUrl ? (
        <Image source={{ uri: coverUrl }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      ) : (
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <View style={styles.coverGradient} />

      <View style={[styles.coverTop, { paddingTop: insetsTop + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <StatusBadge status={tournament.status} />
      </View>

      <View style={styles.coverBottom}>
        <Text style={styles.coverTitle} numberOfLines={2}>{tournament.name}</Text>
        <View style={styles.coverMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.8)" />
            <Text style={styles.metaText}>
              {stageDate ? new Date(stageDate).toLocaleDateString('pt-BR') : ''}
            </Text>
          </View>
          {(stageCity || tournamentCity) && (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.8)" />
              <Text style={styles.metaText}>{stageCity ?? tournamentCity ?? ''}</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={13} color="rgba(255,255,255,0.8)" />
            <Text style={styles.metaText}>{regCount}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    height: 280,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  coverGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,10,30,0.45)',
  },
  coverTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverBottom: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  coverTitle: {
    fontFamily: fonts.title.regular,
    fontSize: 34,
    color: '#FFFFFF',
    letterSpacing: 0.3,
    lineHeight: 38,
  },
  coverMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: fonts.text.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
});
