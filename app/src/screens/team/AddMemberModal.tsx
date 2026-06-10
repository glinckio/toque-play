import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { teamService } from '../../services/team';
import type { TeamStackParamList } from '../../navigation/types';
import HeroHeader from '../../components/HeroHeader';
import ChevronButton from '../../components/ChevronButton';
import TabBar from '../../components/TabBar';

type Nav = NativeStackNavigationProp<TeamStackParamList, 'AddMember'>;
type Route = RouteProp<TeamStackParamList, 'AddMember'>;

const POSITIONS = ['Levantador', 'Ponteiro', 'Oposto', 'Central', 'Líbero', 'Ponta'];

export default function AddMemberModal() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { teamId } = route.params;

  const [tab, setTab] = useState('email');
  const [email, setEmail] = useState('');
  const [guestName, setGuestName] = useState('');
  const [position, setPosition] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAddMember = async () => {
    const trimmed = email.trim();
    if (!trimmed) { Alert.alert('Atenção', 'Informe o e-mail.'); return; }
    setSubmitting(true);
    try {
      await teamService.addMember(teamId, { email: trimmed });
      if (position) {
        // Note: position is set after member is added via updateMember
        // since addMember doesn't accept position in the DTO
      }
      Alert.alert('Sucesso', 'Membro adicionado!');
      navigation.goBack();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Não foi possível adicionar.';
      Alert.alert('Erro', typeof msg === 'string' ? msg : 'Não foi possível adicionar.');
    } finally { setSubmitting(false); }
  };

  const handleAddGuest = async () => {
    const trimmed = guestName.trim();
    if (!trimmed) { Alert.alert('Atenção', 'Informe o nome.'); return; }
    setSubmitting(true);
    try {
      const member = await teamService.addGuest(teamId, { guestName: trimmed });
      if (position && member?.id) {
        await teamService.updateMember(teamId, member.id, { position });
      }
      Alert.alert('Sucesso', 'Convidado adicionado!');
      navigation.goBack();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Não foi possível adicionar.';
      Alert.alert('Erro', typeof msg === 'string' ? msg : 'Não foi possível adicionar.');
    } finally { setSubmitting(false); }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <HeroHeader title="ADICIONAR MEMBRO" watermark="ADD" onBack={() => navigation.goBack()} rounded />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.content}>
          <View style={styles.tabContainer}>
            <TabBar
              tabs={[
                { key: 'email', label: 'Por e-mail' },
                { key: 'guest', label: 'Convidado' },
              ]}
              activeTab={tab}
              onTabChange={setTab}
              variant="pill"
            />
          </View>

          {tab === 'email' ? (
            <>
              <Text style={styles.label}>E-mail do jogador</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={16} color={colors.textPlaceholder} />
                <TextInput
                  style={styles.input}
                  placeholder="email@exemplo.com"
                  placeholderTextColor={colors.textPlaceholder}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.label}>Nome do convidado</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={16} color={colors.textPlaceholder} />
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  placeholderTextColor={colors.textPlaceholder}
                  value={guestName}
                  onChangeText={setGuestName}
                  autoCapitalize="words"
                  returnKeyType="done"
                />
              </View>
            </>
          )}

          {/* Position picker */}
          <View style={styles.positionSection}>
            <Text style={styles.label}>Posição (opcional)</Text>
            <View style={styles.positionRow}>
              {POSITIONS.map((pos) => (
                <TouchableOpacity
                  key={pos}
                  style={[styles.positionPill, position === pos && styles.positionPillActive]}
                  onPress={() => setPosition(position === pos ? null : pos)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.positionPillText, position === pos && styles.positionPillTextActive]}>
                    {pos}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ marginTop: spacing.xl }}>
            <ChevronButton
              variant="primary"
              size="lg"
              fullWidth
              onPress={tab === 'email' ? handleAddMember : handleAddGuest}
              disabled={(tab === 'email' ? !email.trim() : !guestName.trim()) || submitting}
              icon={<Ionicons name="person-add-outline" size={16} color="#FFFFFF" />}
            >
              {submitting ? 'ADICIONANDO...' : 'ADICIONAR'}
            </ChevronButton>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xxl },
  tabContainer: { marginBottom: spacing.xxl },
  label: {
    fontFamily: fonts.form.medium,
    fontSize: typography.sizes.input,
    color: colors.textDefault,
    marginBottom: spacing.sm,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    height: 48,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1, color: colors.text, fontSize: typography.sizes.input,
    fontFamily: fonts.form.regular, paddingVertical: 0,
  },
  positionSection: {
    marginTop: spacing.xl,
  },
  positionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  positionPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.lg,
    backgroundColor: colors.inputBackground,
  },
  positionPillActive: {
    backgroundColor: colors.primary,
  },
  positionPillText: {
    fontFamily: fonts.text.medium,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  positionPillTextActive: {
    color: '#FFFFFF',
  },
});
