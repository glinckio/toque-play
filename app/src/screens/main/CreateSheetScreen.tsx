import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import type { RootStackParamList } from '../../navigation/types';

export default function CreateSheetScreen() {
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const go = (target: () => void) => {
    rootNav.goBack();
    setTimeout(target, 300);
  };

  return (
    <SafeAreaView style={s.container} edges={['bottom']}>
      <View style={s.header}>
        <Text style={s.title}>CRIAR</Text>
        <TouchableOpacity style={s.closeBtn} onPress={() => rootNav.goBack()} activeOpacity={0.7}>
          <Ionicons name="close" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <Text style={s.subtitle}>O que vamos organizar agora?</Text>

      <View style={s.grid}>
        <TouchableOpacity
          style={s.optionTournament}
          onPress={() => go(() => rootNav.navigate('Tournament', { screen: 'CreateTournament' }))}
          activeOpacity={0.8}
        >
          <Ionicons name="trophy" size={28} color="#FFFFFF" />
          <Text style={s.optionTitleWhite}>TORNEIO</Text>
          <Text style={s.optionDescWhite}>Crie um circuito ou copa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.optionRow}
          onPress={() => go(() => rootNav.navigate('Team', { screen: 'TeamDetail', params: { teamId: '' } }))}
          activeOpacity={0.8}
        >
          <Ionicons name="shield" size={28} color={colors.primary} />
          <View style={s.rowText}>
            <Text style={s.optionTitlePurple}>TIME</Text>
            <Text style={s.optionDesc}>Monte sua equipe</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.optionRow}
          onPress={() => go(() => rootNav.navigate('Friendly', { screen: 'CreateFriendly' }))}
          activeOpacity={0.8}
        >
          <Ionicons name="volleyball" size={28} color={colors.primary} />
          <View style={s.rowText}>
            <Text style={s.optionTitlePurple}>AMISTOSO</Text>
            <Text style={s.optionDesc}>Desafie outro time</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: fonts.title.regular, fontSize: 22, color: colors.text, letterSpacing: typography.letterSpacing.medium },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  subtitle: { fontFamily: fonts.text.regular, fontSize: typography.sizes.md, color: colors.textMuted, marginTop: 2, marginBottom: spacing.xl },
  grid: { gap: spacing.md },
  optionTournament: { backgroundColor: colors.primary, borderRadius: radius.card, padding: spacing.xl },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.primaryTint, borderRadius: radius.card, padding: spacing.lg },
  rowText: { flex: 1 },
  optionTitleWhite: { fontFamily: fonts.title.regular, fontSize: 18, color: '#FFFFFF', letterSpacing: typography.letterSpacing.medium, marginTop: spacing.md },
  optionTitlePurple: { fontFamily: fonts.title.regular, fontSize: 18, color: colors.primary, letterSpacing: typography.letterSpacing.medium },
  optionDescWhite: { fontFamily: fonts.text.regular, fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  optionDesc: { fontFamily: fonts.text.regular, fontSize: typography.sizes.sm, color: colors.textMuted, marginTop: 2 },
});
