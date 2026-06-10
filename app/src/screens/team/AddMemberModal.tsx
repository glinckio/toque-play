import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
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
import { VOLLEYBALL_POSITIONS, POSITION_LABELS, type VolleyballPosition } from '../../types/team';
import type { TeamStackParamList } from '../../navigation/types';
import HeroHeader from '../../components/HeroHeader';
import ChevronButton from '../../components/ChevronButton';
import TabBar from '../../components/TabBar';
import { useDialogStore } from '../../stores/dialogStore';

type Nav = NativeStackNavigationProp<TeamStackParamList, 'AddMember'>;
type Route = RouteProp<TeamStackParamList, 'AddMember'>;

export default function AddMemberModal() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { teamId, memberId, isGuest, guestName: initialGuestName, memberName, positions: initialPositions } = route.params;
  const dialog = useDialogStore();

  const isEditMode = !!memberId;

  const [tab, setTab] = useState('email');
  const [email, setEmail] = useState('');
  const [guestName, setGuestName] = useState(initialGuestName ?? '');
  const [positions, setPositions] = useState<VolleyballPosition[]>(initialPositions ?? []);
  const [submitting, setSubmitting] = useState(false);

  const togglePosition = (pos: VolleyballPosition) => {
    setPositions((prev) => (prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]));
  };

  const handleAddMember = async () => {
    const trimmed = email.trim();
    if (!trimmed) { dialog.warning('Informe o e-mail.'); return; }
    setSubmitting(true);
    try {
      await teamService.addMember(teamId, { email: trimmed, positions });
      dialog.success('Convite enviado!');
      navigation.goBack();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Não foi possível adicionar.';
      dialog.error(typeof msg === 'string' ? msg : 'Não foi possível adicionar.');
    } finally { setSubmitting(false); }
  };

  const handleAddGuest = async () => {
    const trimmed = guestName.trim();
    if (!trimmed) { dialog.warning('Informe o nome.'); return; }
    setSubmitting(true);
    try {
      await teamService.addGuest(teamId, { guestName: trimmed, positions });
      dialog.success('Convidado adicionado!');
      navigation.goBack();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Não foi possível adicionar.';
      dialog.error(typeof msg === 'string' ? msg : 'Não foi possível adicionar.');
    } finally { setSubmitting(false); }
  };

  const handleSaveEdit = async () => {
    if (!memberId) return;
    if (isGuest && !guestName.trim()) { dialog.warning('Informe o nome.'); return; }
    setSubmitting(true);
    try {
      await teamService.updateMember(teamId, memberId, {
        positions,
        ...(isGuest ? { guestName: guestName.trim() } : {}),
      });
      dialog.success('Alterações salvas!');
      navigation.goBack();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Não foi possível salvar.';
      dialog.error(typeof msg === 'string' ? msg : 'Não foi possível salvar.');
    } finally { setSubmitting(false); }
  };

  const onSubmit = isEditMode ? handleSaveEdit : (tab === 'email' ? handleAddMember : handleAddGuest);
  const submitDisabled = isEditMode
    ? (isGuest ? !guestName.trim() : false) || submitting
    : (tab === 'email' ? !email.trim() : !guestName.trim()) || submitting;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <HeroHeader
        title={isEditMode ? 'EDITAR MEMBRO' : 'ADICIONAR MEMBRO'}
        watermark={isEditMode ? 'EDIT' : 'ADD'}
        onBack={() => navigation.goBack()}
        rounded
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.content}>
          {!isEditMode && (
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
          )}

          {isEditMode ? (
            isGuest ? (
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
            ) : (
              <>
                <Text style={styles.label}>Atleta</Text>
                <View style={styles.readonlyField}>
                  <Ionicons name="person-outline" size={16} color={colors.textMuted} />
                  <Text style={styles.readonlyText} numberOfLines={1}>{memberName ?? 'Atleta'}</Text>
                </View>
              </>
            )
          ) : tab === 'email' ? (
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

          {/* Positions picker (multi-select) */}
          <View style={styles.positionSection}>
            <Text style={styles.label}>Posições ({positions.length})</Text>
            <View style={styles.positionRow}>
              {VOLLEYBALL_POSITIONS.map((pos) => {
                const active = positions.includes(pos);
                return (
                  <TouchableOpacity
                    key={pos}
                    style={[styles.positionPill, active && styles.positionPillActive]}
                    onPress={() => togglePosition(pos)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.positionPillText, active && styles.positionPillTextActive]}>
                      {POSITION_LABELS[pos]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={{ marginTop: spacing.xl }}>
            <ChevronButton
              variant="primary"
              size="lg"
              fullWidth
              onPress={onSubmit}
              disabled={submitDisabled}
              icon={<Ionicons name={isEditMode ? 'save-outline' : 'person-add-outline'} size={16} color="#FFFFFF" />}
            >
              {submitting ? 'SALVANDO...' : isEditMode ? 'SALVAR' : 'ADICIONAR'}
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
  readonlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    height: 48,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.md,
  },
  readonlyText: {
    flex: 1,
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.input,
    color: colors.text,
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
