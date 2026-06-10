import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Platform, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fonts } from '../theme/fonts';

interface Props {
  label: string;
  value: string; // ISO date "YYYY-MM-DD" or time "HH:mm"
  onChange: (value: string) => void;
  mode: 'date' | 'time';
  required?: boolean;
  placeholder?: string;
}

export default function DatePickerField({ label, value, onChange, mode, required, placeholder }: Props) {
  const [show, setShow] = useState(false);

  const displayValue = mode === 'date'
    ? (value ? formatDate(value) : placeholder || 'Selecionar data')
    : (value || placeholder || 'Selecionar horário');

  const applyDate = (date: Date) => {
    if (mode === 'date') {
      onChange(date.toISOString().slice(0, 10));
    } else {
      const h = String(date.getHours()).padStart(2, '0');
      const m = String(date.getMinutes()).padStart(2, '0');
      onChange(`${h}:${m}`);
    }
  };

  const handleChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (date) applyDate(date);
      return;
    }
    if (date) applyDate(date);
  };

  const initialDate = mode === 'date' && value
    ? new Date(value + 'T12:00:00')
    : new Date();

  return (
    <View style={s.container}>
      <Text style={s.label}>
        {label}{required ? ' *' : ''}
      </Text>
      <TouchableOpacity style={s.touchable} onPress={() => setShow(true)} activeOpacity={0.7}>
        <Text style={[s.value, !value && s.placeholder]}>{displayValue}</Text>
        <Ionicons
          name={mode === 'date' ? 'calendar-outline' : 'time-outline'}
          size={20}
          color={colors.textMuted}
        />
      </TouchableOpacity>

      {Platform.OS === 'android' && show && (
        <DateTimePicker
          value={initialDate}
          mode={mode}
          display="default"
          onChange={handleChange}
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal visible={show} transparent animationType="slide">
          <View style={s.modalOverlay}>
            <View style={s.modalContent}>
              <View style={s.modalHeader}>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={s.modalCancel}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={s.modalConfirm}>Confirmar</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={initialDate}
                mode={mode}
                display="spinner"
                onChange={handleChange}
                locale="pt-BR"
                style={s.iosPicker}
                textColor={colors.text}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

function formatDate(iso: string): string {
  try {
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  } catch {
    return iso;
  }
}

const s = StyleSheet.create({
  container: { marginTop: spacing.md },
  label: { fontSize: 10, fontFamily: fonts.text.semiBold, color: colors.textMuted, marginBottom: 8, letterSpacing: 1.5 },
  touchable: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.inputBackground, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  value: { fontSize: 14, fontFamily: fonts.text.regular, color: colors.text },
  placeholder: { color: colors.textMuted },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: {
    backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  modalCancel: { fontSize: 14, fontFamily: fonts.text.semiBold, color: colors.textMuted },
  modalConfirm: { fontSize: 14, fontFamily: fonts.text.bold, color: colors.primaryLight },
  iosPicker: { height: 200 },
});
