import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../theme/colors';
import DatePickerField from '../../../../components/DatePickerField';
import CEPInput from '../../../../components/CEPInput';
import { FACILITY_OPTIONS } from '../../tournamentForm.types';
import type { StageInput } from '../../tournamentForm.types';
import { formStyles as s } from './formStyles';

interface Props {
  eventType: string;
  stages: StageInput[];
  onUpdateStage: (idx: number, field: string, value: any) => void;
  onCepFound: (idx: number, data: Partial<StageInput>) => void;
  onToggleFacility: (idx: number, facility: string) => void;
  onAddStage: () => void;
  onRemoveStage: (idx: number) => void;
}

export function TournamentLocationStep({
  eventType,
  stages,
  onUpdateStage,
  onCepFound,
  onToggleFacility,
  onAddStage,
  onRemoveStage,
}: Props) {
  return (
    <View>
      <Text style={s.stepTitle}>LOCALIZAÇÃO</Text>

      {stages.map((stage, idx) => (
        <View key={idx} style={s.card}>
          {eventType === 'CIRCUIT' && (
            <View style={s.cardHeader}>
              <Text style={s.cardLabel}>ETAPA {idx + 1}</Text>
              {stages.length > 1 && (
                <TouchableOpacity
                  onPress={() => onRemoveStage(idx)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
          )}

          <DatePickerField
            label="Data"
            value={stage.date}
            onChange={(v: string) => onUpdateStage(idx, 'date', v)}
            mode="date"
          />
          <DatePickerField
            label="Horário"
            value={stage.startTime}
            onChange={(v: string) => onUpdateStage(idx, 'startTime', v)}
            mode="time"
          />

          <CEPInput
            value={stage.cep}
            onAddressFound={(data: Partial<StageInput>) => onCepFound(idx, data)}
          />

          <Text style={s.fieldLabel}>Rua</Text>
          <View style={s.inputWrap}>
            <TextInput
              style={s.input}
              value={stage.street}
              onChangeText={(v) => onUpdateStage(idx, 'street', v)}
              placeholder="Rua"
              placeholderTextColor={colors.textPlaceholder}
            />
          </View>

          <Text style={s.fieldLabel}>Número</Text>
          <View style={s.inputWrap}>
            <TextInput
              style={s.input}
              value={stage.number}
              onChangeText={(v) => onUpdateStage(idx, 'number', v)}
              placeholder="Número"
              placeholderTextColor={colors.textPlaceholder}
              keyboardType="numeric"
            />
          </View>

          <Text style={s.fieldLabel}>Bairro</Text>
          <View style={s.inputWrap}>
            <TextInput
              style={s.input}
              value={stage.neighborhood}
              onChangeText={(v) => onUpdateStage(idx, 'neighborhood', v)}
              placeholder="Bairro"
              placeholderTextColor={colors.textPlaceholder}
            />
          </View>

          <View style={s.row2}>
            <View style={s.col2}>
              <Text style={s.fieldLabel}>Cidade *</Text>
              <View style={s.inputWrap}>
                <TextInput
                  style={s.input}
                  value={stage.city}
                  onChangeText={(v) => onUpdateStage(idx, 'city', v)}
                  placeholder="Cidade"
                  placeholderTextColor={colors.textPlaceholder}
                />
              </View>
            </View>
            <View style={s.col2}>
              <Text style={s.fieldLabel}>Estado</Text>
              <View style={s.inputWrap}>
                <TextInput
                  style={s.input}
                  value={stage.state}
                  onChangeText={(v) => onUpdateStage(idx, 'state', v)}
                  placeholder="UF"
                  placeholderTextColor={colors.textPlaceholder}
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>
            </View>
          </View>

          <Text style={s.fieldLabel}>Máx. times</Text>
          <View style={s.inputWrap}>
            <TextInput
              style={s.input}
              value={stage.maxTeams}
              onChangeText={(v) => onUpdateStage(idx, 'maxTeams', v)}
              placeholder="Ex: 16"
              placeholderTextColor={colors.textPlaceholder}
              keyboardType="numeric"
            />
          </View>

          <Text style={s.fieldLabel}>Instalações</Text>
          <View style={s.chipRowWrap}>
            {FACILITY_OPTIONS.map((f) => {
              const active = stage.facilities.includes(f);
              return (
                <TouchableOpacity
                  key={f}
                  style={[s.chipSm, active && s.chipSmActive]}
                  onPress={() => onToggleFacility(idx, f)}
                >
                  <Text style={[s.chipSmText, active && s.chipSmTextActive]}>{f}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      {eventType === 'CIRCUIT' && (
        <TouchableOpacity style={s.addBtn} onPress={onAddStage} activeOpacity={0.8}>
          <Ionicons name="add" size={18} color={colors.primary} />
          <Text style={s.addBtnText}>ADICIONAR ETAPA</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
