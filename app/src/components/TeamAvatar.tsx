import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

interface TeamAvatarProps {
  avatarUrl: string | null | undefined;
  name: string;
  size?: number;
}

export default function TeamAvatar({ avatarUrl, name, size = 48 }: TeamAvatarProps) {
  const borderRadius = size * 0.3;
  const fontSize = size * 0.46;
  const letter = (name ?? '?').charAt(0).toUpperCase();

  if (avatarUrl) {
    console.log('[TeamAvatar] uri:', avatarUrl);
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={[styles.image, { width: size, height: size, borderRadius }]}
        onLoad={() => console.log('[TeamAvatar] loaded OK')}
        onError={(e) => console.log('[TeamAvatar] ERROR:', e.nativeEvent.error)}
      />
    );
  }

  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius }]}>
      <LinearGradient
        colors={[colors.primary, colors.primaryGlow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius }]}
      >
        <Text style={[styles.letter, { fontSize }]}>{letter}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surface,
  },
  wrap: {
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontFamily: fonts.title.display,
    color: colors.text,
  },
});
