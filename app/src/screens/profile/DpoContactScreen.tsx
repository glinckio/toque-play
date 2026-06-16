import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import HeroHeader from '../../components/HeroHeader';
import { dpoService, type DpoRequestType } from '../../services/dpo';

const TYPE_OPTIONS: Array<{ value: DpoRequestType; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { value: 'ACCESS', label: 'Acesso aos dados', icon: 'eye-outline' },
  { value: 'PORTABILITY', label: 'Portabilidade', icon: 'swap-horizontal-outline' },
  { value: 'RECTIFICATION', label: 'Correção de dados', icon: 'create-outline' },
  { value: 'DELETION', label: 'Eliminação', icon: 'trash-outline' },
  { value: 'COMPLAINT', label: 'Reclação (ANPD)', icon: 'megaphone-outline' },
  { value: 'OTHER', label: 'Outro assunto', icon: 'chatbubble-outline' },
];

export default function DpoContactScreen() {
  const [type, setType] = useState<DpoRequestType>('ACCESS');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (subject.trim().length < 3 || message.trim().length < 10) {
      Alert.alert('Validação', 'Preencha assunto (mín. 3 caracteres) e mensagem (mín. 10).');
      return;
    }
    setLoading(true);
    try {
      await dpoService.create({ type, subject: subject.trim(), message: message.trim() });
      Alert.alert('Enviado', 'Sua solicitação foi registrada. O DPO entrará em contato.', [
        { text: 'OK', onPress: () => undefined },
      ]);
      setSubject('');
      setMessage('');
    } catch {
      Alert.alert('Erro', 'Não foi possível registrar a solicitação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <HeroHeader
        title="Fale com o DPO"
        subtitle="Exercício de direitos (LGPD art. 18)"
        watermark="DPO"
        rounded
      />

      <View style={styles.body}>
        <Text style={styles.label}>TIPO DE SOLICITAÇÃO</Text>
        <View style={styles.typesGrid}>
          {TYPE_OPTIONS.map((opt) => {
            const active = type === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[styles.typeChip, active && styles.typeChipActive]}
                onPress={() => setType(opt.value)}
              >
                <Ionicons
                  name={opt.icon}
                  size={16}
                  color={active ? colors.textOnPrimary : colors.text}
                />
                <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>ASSUNTO</Text>
        <TextInput
          value={subject}
          onChangeText={setSubject}
          placeholder="Resumo curto"
          style={styles.input}
          maxLength={200}
        />

        <Text style={styles.label}>MENSAGEM</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Descreva sua solicitação em detalhe..."
          style={[styles.input, styles.textarea]}
          multiline
          numberOfLines={6}
          maxLength={5000}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.button, (!subject.trim() || message.trim().length < 10 || loading) && styles.buttonDisabled]}
          onPress={submit}
          disabled={loading || !subject.trim() || message.trim().length < 10}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.textOnPrimary} />
          ) : (
            <Text style={styles.buttonText}>ENVIAR SOLICITAÇÃO</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { paddingHorizontal: spacing.xl, paddingBottom: spacing.section },
  label: {
    color: colors.textMuted,
    fontFamily: fonts.text.bold,
    fontSize: typography.sizes.xs,
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  typesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  typeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeChipText: {
    color: colors.text,
    fontFamily: fonts.text.medium,
    fontSize: typography.sizes.sm,
  },
  typeChipTextActive: { color: colors.textOnPrimary },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.md,
  },
  textarea: { minHeight: 120 },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: {
    color: colors.textOnPrimary,
    fontFamily: fonts.text.bold,
    fontSize: typography.sizes.md,
  },
});
