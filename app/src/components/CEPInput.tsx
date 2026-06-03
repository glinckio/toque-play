import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fonts } from '../theme/fonts';

export interface CEPAddress {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

interface CEPInputProps {
  value?: string;
  onAddressFound: (data: CEPAddress) => void;
  error?: string;
}

function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function cleanCEP(value: string): string {
  return value.replace(/\D/g, '');
}

export default function CEPInput({ value = '', onAddressFound, error }: CEPInputProps) {
  const [cep, setCep] = useState(() => (value ? formatCEP(value) : ''));
  const [loading, setLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const fetchedRef = useRef('');

  useEffect(() => {
    if (!value) return;
    const formatted = formatCEP(value);
    const digits = cleanCEP(formatted);
    if (digits === cleanCEP(cep)) return;
    setCep(formatted);
    fetchedRef.current = digits;
  }, [value]);

  const handleChange = async (text: string) => {
    const formatted = formatCEP(text);
    setCep(formatted);
    setCepError(null);

    const digits = cleanCEP(formatted);
    if (digits.length !== 8) return;
    if (digits === fetchedRef.current) return;

    fetchedRef.current = digits;
    setLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepError('CEP não encontrado');
        return;
      }
      onAddressFound({
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
        cep: data.cep || '',
      });
    } catch {
      setCepError('Erro ao buscar CEP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.label}>CEP</Text>
      <View style={[s.inputRow, (error || cepError) && s.inputRowError]}>
        <Ionicons name="location-outline" size={20} color={colors.textMuted} style={s.icon} />
        <TextInput
          style={s.input}
          value={cep}
          onChangeText={handleChange}
          placeholder="00000-000"
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          maxLength={9}
          returnKeyType="done"
        />
        {loading && <ActivityIndicator size="small" color={colors.primary} />}
        {cep.length === 9 && !loading && !cepError && (
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
        )}
      </View>
      {(cepError || error) && <Text style={s.errorText}>{cepError || error}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginTop: spacing.md },
  label: { fontSize: 10, fontFamily: fonts.text.semiBold, color: colors.textMuted, marginBottom: 8, letterSpacing: 1.5 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  inputRowError: { borderColor: colors.error },
  icon: { marginRight: spacing.sm },
  input: { flex: 1, fontSize: 14, fontFamily: fonts.text.regular, color: colors.text },
  errorText: { fontSize: 11, color: colors.error, marginTop: 4, fontFamily: fonts.text.regular },
});
