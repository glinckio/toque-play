import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import type { AuthStackParamList } from '../../navigation/types';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'EmailConfirmed'>;

export default function EmailConfirmedScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <AuthLayout>
      <ImageBackground
        source={require('../../../assets/img/ChatGPT Image 27 de mai. de 2026, 21_15_28.png')}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            'rgba(5,6,10,0.55)',
            'rgba(5,6,10,0.7)',
            'rgba(5,6,10,0.92)',
            'rgba(5,6,10,1)',
          ]}
          locations={[0, 0.25, 0.55, 0.8]}
          style={StyleSheet.absoluteFillObject}
        />

        <LinearGradient
          colors={['rgba(109,46,192,0.15)', 'transparent']}
          locations={[0.3, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.content}>
          {/* ─── Brand ─────────────────────────── */}
          <View style={styles.brandBlock}>
            <Text style={styles.brandName}>TOQUEPLAY</Text>
          </View>

          {/* ─── Card ──────────────────────────── */}
          <View style={styles.card}>
            <View style={styles.cardGlowBar} />

            {/* Success icon */}
            <View style={styles.iconCircle}>
              <LinearGradient
                colors={[colors.primary, colors.primaryGlow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <Ionicons name="checkmark" size={36} color={colors.text} />
              </LinearGradient>
            </View>

            <Text style={styles.cardTitle}>CONFIRMADO</Text>
            <Text style={styles.cardSubtitle}>
              Seu e-mail foi verificado com sucesso. Você está pronto para
              entrar na arena.
            </Text>

            <Button
              title="ENTRAR"
              onPress={() => navigation.navigate('Login')}
              style={{ marginTop: spacing.xl }}
            />
          </View>
        </View>
      </ImageBackground>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  brandBlock: {
    position: 'absolute',
    top: spacing.hero + 12,
    left: spacing.xl,
  },
  brandName: {
    fontFamily: fonts.title.display,
    fontSize: 42,
    lineHeight: 44,
    color: colors.text,
    letterSpacing: 6,
  },

  card: {
    backgroundColor: 'rgba(10,10,16,0.75)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(157,115,230,0.12)',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardGlowBar: {
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: 2,
    backgroundColor: colors.primaryGlow,
    borderRadius: 2,
    shadowColor: colors.primaryGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(109,46,192,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(157,115,230,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  iconGradient: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardTitle: {
    fontFamily: fonts.title.display,
    fontSize: 38,
    lineHeight: 40,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.md,
    fontFamily: fonts.text.regular,
  },
});
