import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fonts } from '../theme/fonts';
import { useAuthStore } from '../stores/authStore';

interface AppHeaderProps {
  title?: string;
  showAvatar?: boolean;
  rightAction?: React.ReactNode;
  onAvatarPress?: () => void;
}

export default function AppHeader({
  title,
  showAvatar = true,
  rightAction,
  onAvatarPress,
}: AppHeaderProps) {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(' ')[0] ?? 'Jogador';
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.titleBlock}>
        {title ? (
          <Text style={styles.screenTitle}>{title}</Text>
        ) : (
          <>
            <Text style={styles.greeting}>OLÁ,</Text>
            <Text style={styles.userName}>{firstName.toUpperCase()}</Text>
          </>
        )}
      </View>

      {showAvatar && (
        <TouchableOpacity style={styles.avatarCircle} onPress={onAvatarPress} activeOpacity={0.7}>
          <LinearGradient
            colors={[colors.primary, colors.primaryGlow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarInitial}>
              {firstName.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {!showAvatar && rightAction && rightAction}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
  },
  titleBlock: {},
  greeting: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    letterSpacing: 2,
    color: colors.textMuted,
  },
  userName: {
    fontFamily: fonts.title.display,
    fontSize: 36,
    lineHeight: 38,
    color: colors.text,
    letterSpacing: 3,
  },
  screenTitle: {
    fontFamily: fonts.title.display,
    fontSize: 32,
    lineHeight: 34,
    color: colors.text,
    letterSpacing: 3,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
  },
  avatarGradient: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: fonts.title.display,
    fontSize: 22,
    color: colors.text,
  },
});
