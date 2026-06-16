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
import { useAuthStore } from '../../stores/authStore';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import HeroHeader from '../../components/HeroHeader';
import { privacyService } from '../../services/privacy';

export default function DeleteAccountScreen() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (email !== user?.email) {
      Alert.alert('Confirmação inválida', 'Digite seu email corretamente para confirmar.');
      return;
    }
    Alert.alert(
      'Excluir conta',
      'Esta ação é irreversível. Seus dados serão anonimizados. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await privacyService.deleteAccount(email);
              Alert.alert('Conta excluída', 'Seus dados foram anonimizados.');
              clearAuth();
            } catch (err: any) {
              const code = err?.response?.data?.code;
              Alert.alert(
                'Erro',
                code === 'ACCOUNT_DELETION_CONFIRMATION_REQUIRED'
                  ? 'Confirmação de email não confere.'
                  : 'Não foi possível excluir a conta.',
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <HeroHeader
        title="Excluir conta"
        subtitle="Anonimização irreversível (LGPD art. 18, VI)"
        watermark="Excluir"
        rounded
      />

      <View style={styles.body}>
        <View style={styles.warningCard}>
          <Ionicons name="warning-outline" size={28} color={colors.error} />
          <Text style={styles.warningTitle}>Atenção — operação irreversível</Text>
          <Text style={styles.warningText}>
            Ao confirmar, seus dados pessoais (nome, email, telefone, avatar, localização)
            serão anonimizados. Mensagens que você enviou em chats serão substituídas por
            "[mensagem removida]". Registros financeiros (pagamentos) são mantidos por
            obrigação legal por 5 anos (LGPD art. 16 II) sem PII associada.
          </Text>
        </View>

        <Text style={styles.label}>CONFIRME SEU EMAIL</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder={user?.email}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <Text style={styles.hint}>Digite <Text style={styles.bold}>{user?.email}</Text> para confirmar.</Text>

        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={handleDelete}
          disabled={loading || email !== user?.email}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>EXCLUIR MINHA CONTA</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { paddingHorizontal: spacing.xl, paddingBottom: spacing.section },
  warningCard: {
    backgroundColor: 'rgba(224,69,69,0.08)',
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  warningTitle: {
    color: colors.error,
    fontFamily: fonts.text.bold,
    fontSize: typography.sizes.md,
  },
  warningText: {
    color: colors.text,
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
  label: {
    color: colors.textMuted,
    fontFamily: fonts.text.bold,
    fontSize: typography.sizes.xs,
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
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
  hint: {
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  bold: { fontFamily: fonts.text.bold },
  button: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  dangerButton: { backgroundColor: colors.error },
  buttonText: {
    color: '#fff',
    fontFamily: fonts.text.bold,
    fontSize: typography.sizes.md,
  },
});
