import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../theme/colors';
import DatePickerField from '../../../../components/DatePickerField';
import {
  FORMAT_LABELS,
  MODALITY_FORMATS,
  MODALITY_OPTIONS,
  TYPE_OPTIONS,
  type CategoryInput,
} from '../../tournamentForm.types';
import { formStyles as s } from './formStyles';

interface Props {
  categories: CategoryInput[];
  sponsors: { name: string }[];
  onUpdateCategory: (idx: number, field: string, value: string) => void;
  onAddCategory: () => void;
  onRemoveCategory: (idx: number) => void;
  onAddSponsor: () => void;
  onRemoveSponsor: (idx: number) => void;
  onUpdateSponsor: (idx: number, value: string) => void;
}

export function TournamentCategoriesStep({
  categories,
  sponsors,
  onUpdateCategory,
  onAddCategory,
  onRemoveCategory,
  onAddSponsor,
  onRemoveSponsor,
  onUpdateSponsor,
}: Props) {
  return (
    <View>
      <Text style={s.stepTitle}>CATEGORIAS</Text>

      {categories.map((cat, idx) => (
        <View key={idx} style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardLabel}>CATEGORIA {idx + 1}</Text>
            {categories.length > 1 && (
              <TouchableOpacity
                onPress={() => onRemoveCategory(idx)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="trash-outline" size={18} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={s.fieldLabel}>Tipo</Text>
          <View style={s.chipRow}>
            {TYPE_OPTIONS.map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[s.chip, cat.type === t.key && s.chipActive]}
                onPress={() => onUpdateCategory(idx, 'type', t.key)}
              >
                <Text style={[s.chipText, cat.type === t.key && s.chipTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.fieldLabel}>Modalidade</Text>
          <View style={s.chipRow}>
            {MODALITY_OPTIONS.map((m) => (
              <TouchableOpacity
                key={m.key}
                style={[s.chip, cat.modality === m.key && s.chipActive]}
                onPress={() => onUpdateCategory(idx, 'modality', m.key)}
              >
                <Text style={[s.chipText, cat.modality === m.key && s.chipTextActive]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.fieldLabel}>Formato</Text>
          <View style={s.chipRow}>
            {(MODALITY_FORMATS[cat.modality] ?? []).map((f) => (
              <TouchableOpacity
                key={f}
                style={[s.chip, cat.format === f && s.chipActive]}
                onPress={() => onUpdateCategory(idx, 'format', f)}
              >
                <Text style={[s.chipText, cat.format === f && s.chipTextActive]}>
                  {FORMAT_LABELS[f] ?? f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.fieldLabel}>Valor da inscrição (R$)</Text>
          <View style={s.inputWrap}>
            <Ionicons name="cash-outline" size={16} color={colors.textPlaceholder} />
            <TextInput
              style={s.input}
              value={cat.registrationPrice}
              onChangeText={(v) => onUpdateCategory(idx, 'registrationPrice', v)}
              placeholder="0.00"
              placeholderTextColor={colors.textPlaceholder}
              keyboardType="decimal-pad"
            />
          </View>

          <Text style={s.fieldLabel}>Melhor de quantos sets</Text>
          <View style={s.chipRow}>
            {['1', '3', '5'].map((n) => (
              <TouchableOpacity
                key={n}
                style={[s.chip, cat.bestOfSets === n && s.chipActive]}
                onPress={() => onUpdateCategory(idx, 'bestOfSets', n)}
              >
                <Text style={[s.chipText, cat.bestOfSets === n && s.chipTextActive]}>
                  Melhor de {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.fieldLabel}>Semifinal e 3º lugar</Text>
          <Text style={s.fieldHint}>Deixe vazio para usar o padrão acima</Text>
          <View style={s.chipRow}>
            {['', '1', '3', '5'].map((n) => (
              <TouchableOpacity
                key={n || 'auto'}
                style={[s.chip, cat.semifinalBestOfSets === n && s.chipActive]}
                onPress={() => onUpdateCategory(idx, 'semifinalBestOfSets', n)}
              >
                <Text
                  style={[s.chipText, cat.semifinalBestOfSets === n && s.chipTextActive]}
                >
                  {n ? `Melhor de ${n}` : 'Padrão'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.fieldLabel}>Final (1º e 2º lugar)</Text>
          <Text style={s.fieldHint}>Deixe vazio para usar o padrão acima</Text>
          <View style={s.chipRow}>
            {['', '1', '3', '5'].map((n) => (
              <TouchableOpacity
                key={n || 'auto'}
                style={[s.chip, cat.finalBestOfSets === n && s.chipActive]}
                onPress={() => onUpdateCategory(idx, 'finalBestOfSets', n)}
              >
                <Text style={[s.chipText, cat.finalBestOfSets === n && s.chipTextActive]}>
                  {n ? `Melhor de ${n}` : 'Padrão'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <DatePickerField
            label="Prazo de inscrição"
            value={cat.registrationDeadline}
            onChange={(v: string) => onUpdateCategory(idx, 'registrationDeadline', v)}
            mode="date"
          />
        </View>
      ))}

      <TouchableOpacity style={s.addBtn} onPress={onAddCategory} activeOpacity={0.8}>
        <Ionicons name="add" size={18} color={colors.primary} />
        <Text style={s.addBtnText}>ADICIONAR CATEGORIA</Text>
      </TouchableOpacity>

      <View style={s.divider} />

      <Text style={s.stepTitle}>PATROCINADORES</Text>

      {sponsors.map((sp, idx) => (
        <View key={idx} style={s.sponsorRow}>
          <View style={[s.inputWrap, { flex: 1 }]}>
            <Ionicons name="business-outline" size={16} color={colors.textPlaceholder} />
            <TextInput
              style={s.input}
              value={sp.name}
              onChangeText={(v) => onUpdateSponsor(idx, v)}
              placeholder="Nome do patrocinador"
              placeholderTextColor={colors.textPlaceholder}
            />
          </View>
          <TouchableOpacity
            onPress={() => onRemoveSponsor(idx)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={22} color={colors.textPlaceholder} />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={s.addBtn} onPress={onAddSponsor} activeOpacity={0.8}>
        <Ionicons name="add" size={18} color={colors.primary} />
        <Text style={s.addBtnText}>ADICIONAR PATROCINADOR</Text>
      </TouchableOpacity>
    </View>
  );
}
