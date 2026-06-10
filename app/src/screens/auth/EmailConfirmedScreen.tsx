import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import type { AuthStackParamList } from '../../navigation/types';
import AuthLayout from '../../components/AuthLayout';
import HeroHeader from '../../components/HeroHeader';
import ChevronButton from '../../components/ChevronButton';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'EmailConfirmed'>;

export default function EmailConfirmedScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <AuthLayout>
      <HeroHeader title="CONFIRMADO" watermark="OK" rounded />

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={64} color={colors.success} />
        </View>

        <Text style={styles.title}>E-mail verificado!</Text>
        <Text style={styles.subtitle}>
          Seu e-mail foi verificado com sucesso. Você está pronto para entrar na arena.
        </Text>

        <ChevronButton
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => navigation.navigate('Login')}
        >
          ENTRAR
        </ChevronButton>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.section,
    alignItems: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.display,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.input,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
});
