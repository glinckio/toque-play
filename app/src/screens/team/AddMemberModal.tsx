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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { teamService } from '../../services/team';
import type { TeamStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<TeamStackParamList, 'AddMember'>;
type Route = RouteProp<TeamStackParamList, 'AddMember'>;

type Tab = 'member' | 'guest';

export default function AddMemberModal() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { teamId } = route.params;

  const [tab, setTab] = useState<Tab>('member');
  const [email, setEmail] = useState('');
  const [guestName, setGuestName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddMember = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      Alert.alert('Atenção', 'Informe o e-mail.');
      return;
    }
    setSubmitting(true);
    try {
      await teamService.addMember(teamId, { email: trimmed });
      Alert.alert('Sucesso', 'Membro adicionado!');
      navigation.goBack();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Não foi possível adicionar.';
      Alert.alert('Erro', typeof msg === 'string' ? msg : 'Não foi possível adicionar.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddGuest = async () => {
    const trimmed = guestName.trim();
    if (!trimmed) {
      Alert.alert('Atenção', 'Informe o nome.');
      return;
    }
    setSubmitting(true);
    try {
      await teamService.addGuest(teamId, { guestName: trimmed });
      Alert.alert('Sucesso', 'Convidado adicionado!');
      navigation.goBack();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Não foi possível adicionar.';
      Alert.alert('Erro', typeof msg === 'string' ? msg : 'Não foi possível adicionar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ADICIONAR MEMBRO</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'member' && styles.tabActive]}
          onPress={() => setTab('member')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="mail-outline"
            size={16}
            color={tab === 'member' ? colors.primaryGlow : colors.textMuted}
          />
          <Text style={[styles.tabText, tab === 'member' && styles.tabTextActive]}>
            POR E-MAIL
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'guest' && styles.tabActive]}
          onPress={() => setTab('guest')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="person-outline"
            size={16}
            color={tab === 'guest' ? colors.primaryGlow : colors.textMuted}
          />
          <Text style={[styles.tabText, tab === 'guest' && styles.tabTextActive]}>
            CONVIDADO
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {tab === 'member' ? (
          <>
            <Text style={styles.label}>E-mail do jogador</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="email@exemplo.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
              />
            </View>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleAddMember}
              disabled={!email.trim() || submitting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryGlow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.submitGradient,
                  (!email.trim() || submitting) && styles.submitDisabled,
                ]}
              >
                {submitting ? (
                  <ActivityIndicator color={colors.text} size="small" />
                ) : (
                  <>
                    <Ionicons name="person-add-outline" size={18} color={colors.text} />
                    <Text style={styles.submitText}>ADICIONAR</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>Nome do convidado</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor={colors.textMuted}
                value={guestName}
                onChangeText={setGuestName}
                autoCapitalize="words"
                returnKeyType="done"
              />
            </View>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleAddGuest}
              disabled={!guestName.trim() || submitting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryGlow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.submitGradient,
                  (!guestName.trim() || submitting) && styles.submitDisabled,
                ]}
              >
                {submitting ? (
                  <ActivityIndicator color={colors.text} size="small" />
                ) : (
                  <>
                    <Ionicons name="person-add-outline" size={18} color={colors.text} />
                    <Text style={styles.submitText}>ADICIONAR</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontFamily: fonts.title.display,
    fontSize: 22,
    color: colors.text,
    letterSpacing: 2,
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.md,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  tabActive: {
    borderColor: 'rgba(157,115,230,0.3)',
    backgroundColor: 'rgba(109,46,192,0.1)',
  },
  tabText: {
    fontSize: 11,
    letterSpacing: 2,
    color: colors.textMuted,
    fontFamily: fonts.text.semiBold,
  },
  tabTextActive: {
    color: colors.primaryGlow,
  },

  // Form
  form: { paddingHorizontal: spacing.xl },
  label: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.textMuted,
    fontFamily: fonts.text.semiBold,
    marginBottom: spacing.sm,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: spacing.md,
    height: 52,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.text.regular,
  },

  submitBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  submitDisabled: { opacity: 0.4 },
  submitText: {
    fontSize: 14,
    letterSpacing: 2,
    color: colors.text,
    fontFamily: fonts.text.semiBold,
  },
});
