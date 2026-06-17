import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { typography } from '../../../theme/typography';
import TeamAvatar from '../../../components/TeamAvatar';
import type { Friendly } from '../../../types/friendly';

interface Props {
  friendly: Friendly;
  nameA: string;
  nameB: string;
  onShowAthletes: (side: 'REQUESTER' | 'CHALLENGED') => void;
}

export function TeamsVSRow({ friendly, nameA, nameB, onShowAthletes }: Props) {
  const hasRequesterAthletes =
    friendly.athletes?.some((a) => a.side === 'REQUESTER') ?? false;
  const hasChallengedAthletes =
    friendly.athletes?.some((a) => a.side === 'CHALLENGED') ?? false;

  return (
    <View style={styles.teamsRow}>
      <TeamColumn
        avatarUrl={friendly.requesterTeam?.avatarUrl}
        name={nameA}
        hasAthletes={hasRequesterAthletes}
        onShowAthletes={() => onShowAthletes('REQUESTER')}
      />
      <Text style={styles.vs}>VS</Text>
      <TeamColumn
        avatarUrl={friendly.challengedTeam?.avatarUrl}
        name={nameB}
        hasAthletes={hasChallengedAthletes}
        onShowAthletes={() => onShowAthletes('CHALLENGED')}
      />
    </View>
  );
}

function TeamColumn({
  avatarUrl,
  name,
  hasAthletes,
  onShowAthletes,
}: {
  avatarUrl?: string | null;
  name: string;
  hasAthletes: boolean;
  onShowAthletes: () => void;
}) {
  return (
    <View style={styles.teamCol}>
      <View style={styles.teamCircleWrap}>
        <TeamAvatar avatarUrl={avatarUrl} name={name} size={56} />
        {hasAthletes && (
          <TouchableOpacity style={styles.athletesBtn} onPress={onShowAthletes} activeOpacity={0.7}>
            <Ionicons name="people" size={12} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.teamName} numberOfLines={1}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: spacing.xxl,
  },
  teamCol: { alignItems: 'center', flex: 1 },
  teamCircleWrap: { position: 'relative', marginBottom: spacing.md },
  teamName: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.semiBold,
    color: colors.text,
    textAlign: 'center',
  },
  vs: {
    fontSize: typography.sizes.display,
    fontFamily: fonts.title.regular,
    color: colors.primary,
    marginHorizontal: spacing.md,
  },
  athletesBtn: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
});
