import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { opacity } from '../../theme/glow';

interface Props {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark, colors.dark]}
        locations={[0, 0.6, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Watermarks */}
      <Text style={styles.watermarkRight} numberOfLines={1}>PLAY</Text>
      <Text style={styles.watermarkLeft} numberOfLines={1}>TOQUE</Text>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="volleyball" size={52} color="#FFFFFF" />
        </View>
      </View>

      {/* Brand */}
      <Text style={styles.brand}>TOQUEPLAY</Text>
      <Text style={styles.tagline}>Onde o vôlei acontece</Text>

      {/* Loading dots */}
      <View style={styles.dots}>
        <View style={[styles.dot, { opacity: 0.4 }]} />
        <View style={[styles.dot, { opacity: 0.7 }]} />
        <View style={[styles.dot, { opacity: 1 }]} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watermarkRight: {
    position: 'absolute',
    right: -20,
    top: 60,
    fontFamily: fonts.title.regular,
    fontSize: 220,
    color: '#FFFFFF',
    opacity: opacity.watermark,
    letterSpacing: 4,
    lineHeight: 1,
  },
  watermarkLeft: {
    position: 'absolute',
    left: -15,
    bottom: 100,
    fontFamily: fonts.title.regular,
    fontSize: 220,
    color: '#FFFFFF',
    opacity: opacity.watermark,
    letterSpacing: 4,
    lineHeight: 1,
  },
  logoContainer: {
    marginBottom: spacing.xxl,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryLight,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  brand: {
    fontFamily: fonts.mono.bold,
    fontSize: 28,
    color: '#FFFFFF',
    letterSpacing: typography.letterSpacing.tight,
    fontWeight: '700',
  },
  tagline: {
    fontFamily: fonts.text.medium,
    fontSize: typography.sizes.input,
    color: 'rgba(255,255,255,0.6)',
    marginTop: spacing.sm,
  },
  dots: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
});
