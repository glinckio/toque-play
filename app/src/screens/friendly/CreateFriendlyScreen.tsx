import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Alert, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { friendlyService } from '../../services/friendly';
import { teamService } from '../../services/team';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import type { Team } from '../../types/team';
import DatePickerField from '../../components/DatePickerField';
import TeamAvatar from '../../components/TeamAvatar';
import CEPInput, { type CEPAddress } from '../../components/CEPInput';
import HeroHeader from '../../components/HeroHeader';
import ChevronButton from '../../components/ChevronButton';

const MODALITIES = [
  { label: 'Areia', value: 'BEACH' },
  { label: 'Quadra', value: 'COURT' },
];

const CATEGORIES = [
  { label: 'Dupla', value: 'PAIR', modalities: ['BEACH'] },
  { label: 'Quarteto', value: 'QUARTET', modalities: ['BEACH'] },
  { label: 'Sexteto', value: 'SEXTET', modalities: ['COURT'] },
];

function getCategoryMax(cat: string) {
  switch (cat) {
    case 'PAIR': return 2;
    case 'QUARTET': return 4;
    case 'SEXTET': return 6;
    default: return 0;
  }
}

export default function CreateFriendlyScreen({ navigation, route }: any) {
  const preselectedTeam = route.params?.challengedTeamId ?? null;
  const preselectedName = route.params?.challengedTeamName ?? '';

  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [modality, setModality] = useState('');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [address, setAddress] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [cep, setCep] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Athletes
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [selectedAthletes, setSelectedAthletes] = useState<Set<string>>(new Set());
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Opponent search
  const [challengedTeamId, setChallengedTeamId] = useState<string | null>(preselectedTeam);
  const [challengedTeamName, setChallengedTeamName] = useState(preselectedName);
  const [showTeamSearch, setShowTeamSearch] = useState(false);
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [teamSearchResults, setTeamSearchResults] = useState<Team[]>([]);
  const [teamSearching, setTeamSearching] = useState(false);

  const handleCEPFound = (data: CEPAddress) => {
    setAddress(data.street);
    setNeighborhood(data.neighborhood);
    setCity(data.city);
    setState(data.state);
    setCep(data.cep);
  };

  useFocusEffect(
    useCallback(() => {
      teamService.findAll().then(setTeams).catch(() => setTeams([]));
    }, []),
  );

  useEffect(() => {
    if (selectedTeam && category) {
      setLoadingMembers(true);
      teamService.findOne(selectedTeam)
        .then((team) => setTeamMembers(team.members ?? []))
        .catch(() => setTeamMembers([]))
        .finally(() => setLoadingMembers(false));
    } else {
      setTeamMembers([]);
      setSelectedAthletes(new Set());
    }
  }, [selectedTeam, category]);

  const handleTeamSearch = async (q: string) => {
    setTeamSearchQuery(q);
    if (q.trim().length < 2) { setTeamSearchResults([]); return; }
    setTeamSearching(true);
    try {
      const results = await teamService.search(q.trim());
      setTeamSearchResults(results);
    } catch {
      setTeamSearchResults([]);
    } finally {
      setTeamSearching(false);
    }
  };

  const toggleAthlete = (memberId: string) => {
    const max = getCategoryMax(category);
    setSelectedAthletes((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        next.delete(memberId);
        if (captainId === memberId) setCaptainId(null);
      } else {
        if (next.size >= max) return prev;
        next.add(memberId);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!selectedTeam) { Alert.alert('Atenção', 'Selecione um time.'); return; }
    if (!modality) { Alert.alert('Atenção', 'Selecione a modalidade.'); return; }
    if (!category) { Alert.alert('Atenção', 'Selecione a categoria.'); return; }
    if (!date) { Alert.alert('Atenção', 'Selecione a data.'); return; }
    if (!address.trim() && !cep) { Alert.alert('Atenção', 'Informe o CEP ou endereço.'); return; }

    const max = getCategoryMax(category);
    if (max > 0 && selectedAthletes.size !== max) {
      Alert.alert('Atenção', `Selecione exatamente ${max} jogador${max > 1 ? 'es' : ''}.`);
      return;
    }

    setSubmitting(true);
    try {
      const [y, m, d] = date.split('-');
      const dateObj = new Date(Number(y), Number(m) - 1, Number(d), 12, 0, 0);

      let startISO: string | undefined;
      if (startTime) {
        const [hh, mm] = startTime.split(':');
        dateObj.setHours(Number(hh), Number(mm), 0, 0);
        startISO = dateObj.toISOString();
      }

      await friendlyService.create({
        title: title.trim() || undefined,
        requesterTeamId: selectedTeam,
        challengedTeamId: challengedTeamId || undefined,
        date: dateObj.toISOString(),
        startTime: startISO,
        address: [address, neighborhood].filter(Boolean).join(', ') || undefined,
        addressNumber: addressNumber.trim() || undefined,
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        modality,
        categoryFormat: category,
        athleteIds: Array.from(selectedAthletes),
        captainId: captainId ?? undefined,
      });
      navigation.goBack();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Não foi possível criar o amistoso.';
      Alert.alert('Erro', typeof msg === 'string' ? msg : 'Não foi possível criar o amistoso.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <HeroHeader title="NOVO AMISTOSO" watermark="FRIENDLY" onBack={() => navigation.goBack()} rounded />

        <ScrollView contentContainerStyle={s.form} keyboardShouldPersistTaps="handled">
          {/* Title */}
          <Text style={s.label}>TÍTULO (OPCIONAL)</Text>
          <View style={s.inputWrap}>
            <Ionicons name="flash-outline" size={16} color={colors.textPlaceholder} />
            <TextInput style={s.input} value={title} onChangeText={setTitle} placeholder="Ex: Amistoso de Areia" placeholderTextColor={colors.textPlaceholder} maxLength={80} />
          </View>

          {/* Team select */}
          <Text style={s.label}>SEU TIME *</Text>
          <View style={s.chipRow}>
            {teams.map((t) => (
              <TouchableOpacity key={t.id} style={[s.chip, selectedTeam === t.id && s.chipActive]} onPress={() => setSelectedTeam(t.id)} activeOpacity={0.7}>
                <Text style={[s.chipText, selectedTeam === t.id && s.chipTextActive]} numberOfLines={1}>{t.name}</Text>
              </TouchableOpacity>
            ))}
            {teams.length === 0 && <Text style={s.hint}>Nenhum time encontrado</Text>}
          </View>

          {/* Opponent */}
          <Text style={s.label}>ADVERSÁRIO</Text>
          <TouchableOpacity
            style={s.searchableInput}
            onPress={() => { setShowTeamSearch(true); setTeamSearchQuery(''); setTeamSearchResults([]); }}
            activeOpacity={0.7}
          >
            <Text style={challengedTeamName ? s.inputValue : s.inputPlaceholder}>
              {challengedTeamName || 'Buscar time adversário...'}
            </Text>
            {challengedTeamName ? (
              <TouchableOpacity onPress={() => { setChallengedTeamId(null); setChallengedTeamName(''); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={20} color={colors.textPlaceholder} />
              </TouchableOpacity>
            ) : (
              <Ionicons name="search" size={20} color={colors.textPlaceholder} />
            )}
          </TouchableOpacity>

          {/* Modality */}
          <Text style={s.label}>MODALIDADE *</Text>
          <View style={s.chipRow}>
            {MODALITIES.map((m) => (
              <TouchableOpacity key={m.value} style={[s.chip, modality === m.value && s.chipActive]} onPress={() => { setModality(m.value); setCategory(''); }} activeOpacity={0.7}>
                <Text style={[s.chipText, modality === m.value && s.chipTextActive]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Category */}
          <Text style={s.label}>CATEGORIA *</Text>
          <View style={s.chipRow}>
            {CATEGORIES.map((c) => {
              const enabled = modality ? c.modalities.includes(modality) : true;
              const isActive = category === c.value;
              return (
                <TouchableOpacity
                  key={c.value}
                  style={[s.chip, isActive && s.chipActive, !enabled && s.chipDisabled]}
                  onPress={() => { if (enabled) { setCategory(c.value); setSelectedAthletes(new Set()); } }}
                  activeOpacity={enabled ? 0.7 : 1}
                >
                  <Text style={[s.chipText, isActive && s.chipTextActive, !enabled && s.chipTextDisabled]}>{c.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Athletes */}
          {selectedTeam && category && getCategoryMax(category) > 0 && (
            <View style={s.athletesSection}>
              <Text style={s.label}>JOGADORES ({selectedAthletes.size}/{getCategoryMax(category)}) *</Text>
              {loadingMembers ? (
                <ActivityIndicator color={colors.primary} size="small" style={{ marginVertical: spacing.md }} />
              ) : teamMembers.length === 0 ? (
                <Text style={s.hint}>Nenhum membro encontrado no time</Text>
              ) : (
                teamMembers.map((member) => {
                  const isSelected = selectedAthletes.has(member.id);
                  const isCap = captainId === member.id;
                  const name = member.user?.name ?? member.guestName ?? '?';
                  return (
                    <View key={member.id} style={[s.athleteCard, isSelected && s.athleteCardActive]}>
                      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }} onPress={() => toggleAthlete(member.id)} activeOpacity={0.7}>
                        <View style={[s.checkCircle, isSelected && s.checkCircleActive]}>
                          {isSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                        </View>
                        <View style={s.athleteInfo}>
                          <Text style={[s.athleteName, isSelected && s.athleteNameActive]} numberOfLines={1}>{name}</Text>
                          {member.isCaptain && <Text style={s.capBadge}>CAP</Text>}
                        </View>
                      </TouchableOpacity>
                      {isSelected && (
                        <TouchableOpacity onPress={() => setCaptainId(isCap ? null : member.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                          <Ionicons name={isCap ? 'star' : 'star-outline'} size={18} color={isCap ? '#FFD700' : colors.textMuted} />
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })
              )}
            </View>
          )}

          {/* Date */}
          <DatePickerField label="DATA" value={date} onChange={setDate} mode="date" required placeholder="Selecionar data" />

          {/* Time */}
          <DatePickerField label="HORÁRIO" value={startTime} onChange={setStartTime} mode="time" placeholder="Selecionar horário" />

          {/* CEP + Address */}
          <CEPInput value={cep} onAddressFound={handleCEPFound} />

          <Text style={s.label}>ENDEREÇO</Text>
          <View style={s.inputWrap}>
            <TextInput style={s.input} value={address} onChangeText={setAddress} placeholder="Rua" placeholderTextColor={colors.textPlaceholder} maxLength={200} />
          </View>

          <Text style={s.label}>NÚMERO</Text>
          <View style={s.inputWrap}>
            <TextInput style={s.input} value={addressNumber} onChangeText={setAddressNumber} placeholder="Número" placeholderTextColor={colors.textPlaceholder} keyboardType="numeric" />
          </View>

          <Text style={s.label}>BAIRRO</Text>
          <View style={s.inputWrap}>
            <TextInput style={s.input} value={neighborhood} onChangeText={setNeighborhood} placeholder="Bairro" placeholderTextColor={colors.textPlaceholder} maxLength={100} />
          </View>

          <Text style={s.label}>CIDADE</Text>
          <View style={s.inputWrap}>
            <TextInput style={s.input} value={city} onChangeText={setCity} placeholder="Cidade" placeholderTextColor={colors.textPlaceholder} maxLength={100} />
          </View>

          <Text style={s.label}>ESTADO</Text>
          <View style={s.inputWrap}>
            <TextInput style={s.input} value={state} onChangeText={setState} placeholder="UF" placeholderTextColor={colors.textPlaceholder} maxLength={2} autoCapitalize="characters" />
          </View>

          {/* Submit */}
          <View style={{ marginTop: spacing.xxl }}>
            <ChevronButton
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleSubmit}
              disabled={submitting}
              icon={<Ionicons name="flash" size={16} color="#FFFFFF" />}
            >
              {submitting ? 'CRIANDO...' : 'CRIAR AMISTOSO'}
            </ChevronButton>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Team search modal */}
      <Modal visible={showTeamSearch} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowTeamSearch(false)}>
        <View style={s.searchContainer}>
          <HeroHeader title="BUSCAR TIME" watermark="SEARCH" onBack={() => setShowTeamSearch(false)} rounded />
          <View style={s.searchInputWrap}>
            <Ionicons name="search" size={20} color={colors.textPlaceholder} />
            <TextInput
              style={s.searchInputField}
              value={teamSearchQuery}
              onChangeText={handleTeamSearch}
              placeholder="Nome do time..."
              placeholderTextColor={colors.textPlaceholder}
              autoFocus
            />
            {teamSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => { setTeamSearchQuery(''); setTeamSearchResults([]); }}>
                <Ionicons name="close-circle" size={18} color={colors.textPlaceholder} />
              </TouchableOpacity>
            )}
          </View>
          {teamSearching ? (
            <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 40 }} />
          ) : (
            <ScrollView contentContainerStyle={{ padding: spacing.lg }} keyboardShouldPersistTaps="handled">
              {teamSearchResults.map((team) => (
                <TouchableOpacity
                  key={team.id}
                  style={s.searchResultCard}
                  onPress={() => {
                    setChallengedTeamId(team.id);
                    setChallengedTeamName(team.name);
                    setShowTeamSearch(false);
                  }}
                  activeOpacity={0.7}
                >
                  <TeamAvatar avatarUrl={team.avatarUrl} name={team.name} size={36} />
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={s.searchResultName}>{team.name}</Text>
                    <Text style={s.searchResultMeta}>{team._count?.members ?? 0} membros</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textPlaceholder} />
                </TouchableOpacity>
              ))}
              {teamSearchQuery.length >= 2 && teamSearchResults.length === 0 && (
                <Text style={s.hint}>Nenhum time encontrado</Text>
              )}
              {teamSearchQuery.length < 2 && (
                <Text style={s.hint}>Digite ao menos 2 caracteres para buscar</Text>
              )}
            </ScrollView>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  form: { paddingHorizontal: spacing.xl, paddingBottom: 40 },
  label: {
    fontSize: typography.sizes.input,
    fontFamily: fonts.form.medium,
    color: colors.textDefault,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    height: 48,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  input: {
    flex: 1, color: colors.text, fontSize: typography.sizes.input,
    fontFamily: fonts.form.regular, paddingVertical: 0,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  chip: {
    backgroundColor: colors.inputBackground,
    borderRadius: radius.xl,
    paddingHorizontal: 16,
    paddingVertical: spacing.sm,
  },
  chipActive: { backgroundColor: colors.primaryTint, borderWidth: 1, borderColor: colors.primary },
  chipDisabled: { opacity: 0.3 },
  chipText: { fontSize: typography.sizes.md, fontFamily: fonts.text.medium, color: colors.textSecondary },
  chipTextActive: { color: colors.primary, fontFamily: fonts.text.semiBold },
  chipTextDisabled: { color: colors.textMuted },
  hint: { fontSize: typography.sizes.md, color: colors.textMuted, fontFamily: fonts.text.regular },
  searchableInput: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.inputBackground,
    height: 48,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  inputValue: { flex: 1, color: colors.text, fontFamily: fonts.text.regular, fontSize: typography.sizes.input },
  inputPlaceholder: { flex: 1, color: colors.textPlaceholder, fontFamily: fonts.text.regular, fontSize: typography.sizes.input },

  athletesSection: { marginBottom: spacing.sm },
  athleteCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.sm,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 1, shadowRadius: 4, elevation: 1,
  },
  athleteCardActive: { backgroundColor: colors.primaryTint, borderWidth: 1, borderColor: colors.primary },
  checkCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.textPlaceholder, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  checkCircleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  athleteInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  athleteName: { fontSize: typography.sizes.md, fontFamily: fonts.text.semiBold, color: colors.text },
  athleteNameActive: { color: colors.primary },
  capBadge: { fontSize: 8, fontFamily: fonts.text.bold, color: '#FFD700', backgroundColor: 'rgba(255,215,0,0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, letterSpacing: 1 },

  // Search modal
  searchContainer: { flex: 1, backgroundColor: colors.background },
  searchInputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: spacing.lg, height: 48,
    marginHorizontal: spacing.xl, marginBottom: spacing.lg, marginTop: spacing.lg,
  },
  searchInputField: { flex: 1, color: colors.text, fontFamily: fonts.form.regular, fontSize: typography.sizes.input, height: 48 },
  searchResultCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.card,
    padding: spacing.lg, marginBottom: spacing.sm,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 2,
  },
  searchResultName: { fontSize: typography.sizes.input, fontFamily: fonts.text.semiBold, color: colors.text },
  searchResultMeta: { fontSize: typography.sizes.md, fontFamily: fonts.text.regular, color: colors.textMuted, marginTop: 2 },
});
