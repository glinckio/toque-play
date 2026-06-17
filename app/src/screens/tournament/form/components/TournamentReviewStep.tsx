import React from 'react';
import { View, Text } from 'react-native';
import {
  FORMAT_LABELS,
  MODALITY_OPTIONS,
  TYPE_OPTIONS,
  type CategoryInput,
  type StageInput,
} from '../../tournamentForm.types';
import { formStyles as s } from './formStyles';

interface Props {
  name: string;
  description: string;
  eventType: string;
  stages: StageInput[];
  categories: CategoryInput[];
  sponsors: { name: string }[];
}

export function TournamentReviewStep({
  name,
  description,
  eventType,
  stages,
  categories,
  sponsors,
}: Props) {
  return (
    <View>
      <Text style={s.stepTitle}>REVISÃO</Text>

      <View style={s.reviewCard}>
        <Text style={s.reviewLabel}>INFORMAÇÕES</Text>
        <Text style={s.reviewValue}>{name}</Text>
        {description ? <Text style={s.reviewMeta}>{description}</Text> : null}
        <Text style={s.reviewMeta}>
          Tipo: {eventType === 'SINGLE' ? 'Evento Único' : 'Circuito'}
        </Text>
      </View>

      <View style={s.reviewCard}>
        <Text style={s.reviewLabel}>ETAPAS</Text>
        {stages.map((st, idx) => (
          <View key={idx} style={s.reviewItem}>
            {eventType === 'CIRCUIT' && <Text style={s.reviewMeta}>Etapa {idx + 1}</Text>}
            <Text style={s.reviewValue}>
              {st.date ? new Date(st.date).toLocaleDateString('pt-BR') : '—'}
              {st.startTime ? ` às ${st.startTime}` : ''}
            </Text>
            <Text style={s.reviewMeta}>
              {[st.street, st.number, st.neighborhood].filter(Boolean).join(', ')}
              {st.city ? ` — ${st.city}` : ''}
              {st.state ? `/${st.state}` : ''}
            </Text>
            {st.maxTeams ? <Text style={s.reviewMeta}>Máx. times: {st.maxTeams}</Text> : null}
            {st.facilities.length > 0 && (
              <Text style={s.reviewMeta}>Instalações: {st.facilities.join(', ')}</Text>
            )}
          </View>
        ))}
      </View>

      <View style={s.reviewCard}>
        <Text style={s.reviewLabel}>CATEGORIAS</Text>
        {categories.map((cat, idx) => (
          <View key={idx} style={s.reviewItem}>
            <Text style={s.reviewValue}>
              {TYPE_OPTIONS.find((t) => t.key === cat.type)?.label} ·{' '}
              {MODALITY_OPTIONS.find((m) => m.key === cat.modality)?.label} ·{' '}
              {FORMAT_LABELS[cat.format] ?? cat.format}
            </Text>
            <Text style={s.reviewMeta}>Melhor de {cat.bestOfSets} sets</Text>
            {cat.semifinalBestOfSets ? (
              <Text style={s.reviewMeta}>
                Semifinal: melhor de {cat.semifinalBestOfSets}
              </Text>
            ) : null}
            {cat.finalBestOfSets ? (
              <Text style={s.reviewMeta}>Final: melhor de {cat.finalBestOfSets}</Text>
            ) : null}
            {cat.registrationPrice ? (
              <Text style={s.reviewMeta}>R$ {cat.registrationPrice}</Text>
            ) : null}
            {cat.registrationDeadline ? (
              <Text style={s.reviewMeta}>
                Prazo: {new Date(cat.registrationDeadline).toLocaleDateString('pt-BR')}
              </Text>
            ) : null}
          </View>
        ))}
      </View>

      {sponsors.length > 0 && (
        <View style={s.reviewCard}>
          <Text style={s.reviewLabel}>PATROCINADORES</Text>
          {sponsors.map((sp, idx) => (
            <Text key={idx} style={s.reviewMeta}>
              {sp.name}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
