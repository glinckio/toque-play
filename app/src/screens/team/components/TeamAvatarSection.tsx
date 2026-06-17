import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';

interface Props {
  avatarUrl: string | null;
  teamName: string;
  isOwner: boolean;
  uploading: boolean;
  onPress: () => void;
}

export function TeamAvatarSection({ avatarUrl, teamName, isOwner, uploading, onPress }: Props) {
  return (
    <View style={styles.avatarSection}>
      <TouchableOpacity
        style={styles.avatarWrap}
        onPress={isOwner ? onPress : undefined}
        activeOpacity={isOwner ? 0.7 : 1}
      >
        {uploading ? (
          <View style={styles.avatarCircle}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : (
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{teamName[0]}</Text>
          </View>
        )}
        {isOwner && !uploading && (
          <View style={styles.avatarEditBadge}>
            <Ionicons name="camera" size={12} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  avatarWrap: { position: 'relative' },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontFamily: fonts.title.regular,
    fontSize: 32,
    color: colors.primary,
    lineHeight: 1,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
