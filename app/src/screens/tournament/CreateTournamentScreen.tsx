import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import DatePickerField from '../../components/DatePickerField';
import CEPInput from '../../components/CEPInput';
import { tournamentService } from '../../services/tournament';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';

// ─── Types ─────────────────────────────────────────────────

interface StageInput {
  date: string;
  startTime: string;
  maxTeams: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  facilities: string[];
}

interface CategoryInput {
  type: string;
  modality: string;
  format: string;
  registrationPrice: string;
  registrationDeadline: string;
  bestOfSets: string;
}

const FACILITY_OPTIONS = ['Estacionamento', 'Cantina', 'Churrasqueira', 'Vestiário', 'Banheiros'];

const MODALITY_FORMATS: Record<string, string[]> = {
  BEACH: ['PAIR', 'QUARTET'],
  COURT: ['SEXTET'],
};

const FORMAT_LABELS: Record<string, string> = {
  PAIR: 'Dupla',
  QUARTET: 'Quarteto',
  SEXTET: 'Sexteto',
};

const TYPE_OPTIONS = [
  { key: 'MALE', label: 'Masculino' },
  { key: 'FEMALE', label: 'Feminino' },
  { key: 'MIX', label: 'Misto' },
];

const MODALITY_OPTIONS = [
  { key: 'BEACH', label: 'Areia' },
  { key: 'COURT', label: 'Quadra' },
];

const TOTAL_STEPS = 4;

const DEFAULT_STAGE: StageInput = {
  date: '', startTime: '', maxTeams: '', cep: '', street: '', number: '', neighborhood: '', city: '', state: '', facilities: [],
};

const DEFAULT_CATEGORY: CategoryInput = {
  type: 'MALE', modality: 'BEACH', format: 'PAIR', registrationPrice: '', registrationDeadline: '', bestOfSets: '3',
};

// ─── Main Screen ───────────────────────────────────────────

export default function CreateTournamentScreen({ navigation }: any) {
  const route = useRoute<any>();
  const tournamentId = route.params?.tournamentId;
  const isEditing = !!tournamentId;
  const loadedRef = useRef(false);

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<string>('SINGLE');

  // Step 2
  const [stages, setStages] = useState<StageInput[]>([{ ...DEFAULT_STAGE }]);

  // Step 3
  const [categories, setCategories] = useState<CategoryInput[]>([{ ...DEFAULT_CATEGORY }]);
  const [sponsors, setSponsors] = useState<{ name: string }[]>([]);

  // Load existing tournament data for edit mode
  useEffect(() => {
    if (!tournamentId || loadedRef.current) return;
    loadedRef.current = true;
    tournamentService.findOne(tournamentId).then((t) => {
      setName(t.name || '');
      setDescription(t.description || '');
      setEventType(t.eventType || 'SINGLE');
      if (t.stages?.length) {
        setStages(t.stages.map((st: any) => ({
          date: st.date ? new Date(st.date).toISOString().split('T')[0] : '',
          startTime: st.startTime ? new Date(st.startTime).toISOString().slice(11, 16) : '',
          maxTeams: st.maxTeams ? String(st.maxTeams) : '',
          cep: st.cep || '',
          street: st.street || '',
          number: st.number || '',
          neighborhood: st.neighborhood || '',
          city: st.city || '',
          state: st.state || '',
          facilities: st.facilities?.map((f: any) => f.name) || [],
        })));
      }
      if (t.categories?.length) {
        setCategories(t.categories.map((c: any) => ({
          type: c.type || 'MALE',
          modality: c.modality || 'BEACH',
          format: c.format || 'PAIR',
          registrationPrice: c.registrationPrice != null ? String(c.registrationPrice) : '',
          registrationDeadline: c.registrationDeadline ? new Date(c.registrationDeadline).toISOString().split('T')[0] : '',
          bestOfSets: c.bestOfSets ? String(c.bestOfSets) : '3',
        })));
      }
      if (t.sponsors?.length) {
        setSponsors(t.sponsors.map((sp: any) => ({ name: sp.name || '' })));
      }
    }).catch(() => Alert.alert('Erro', 'Não foi possível carregar o torneio.'));
  }, [tournamentId]);

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => { if (step > 1) setStep((s) => s - 1); else navigation.goBack(); };

  const validate = useCallback((): string | null => {
    if (!name.trim()) return 'Nome do torneio é obrigatório';
    if (stages.length === 0) return 'Adicione pelo menos uma etapa';
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7);
    minDate.setHours(0, 0, 0, 0);
    for (const s of stages) {
      if (!s.date) return 'Data da etapa é obrigatória';
      if (!s.city.trim()) return 'Cidade da etapa é obrigatória';
      if (new Date(s.date + 'T00:00:00') < minDate) return 'A data da etapa deve ser pelo menos 7 dias no futuro';
    }
    if (categories.length === 0) return 'Adicione pelo menos uma categoria';
    return null;
  }, [name, stages, categories]);

  const buildPayload = () => ({
    eventType,
    stages: stages.map((s) => ({
      date: s.date,
      startTime: s.startTime && s.date ? `${s.date}T${s.startTime}:00Z` : undefined,
      maxTeams: s.maxTeams ? parseInt(s.maxTeams) : undefined,
      street: s.street || undefined,
      number: s.number || undefined,
      neighborhood: s.neighborhood || undefined,
      cep: s.cep || undefined,
      city: s.city || undefined,
      state: s.state || undefined,
      facilities: s.facilities.map((f) => ({ name: f })),
    })),
    categories: categories.map((c) => ({
      type: c.type,
      format: c.format,
      modality: c.modality,
      minMembers: c.format === 'PAIR' ? 2 : c.format === 'QUARTET' ? 4 : 6,
      maxMembers: c.format === 'PAIR' ? 2 : c.format === 'QUARTET' ? 4 : 6,
      bestOfSets: c.bestOfSets ? parseInt(c.bestOfSets) : 3,
      registrationPrice: c.registrationPrice ? parseFloat(c.registrationPrice) : undefined,
      registrationDeadline: c.registrationDeadline || undefined,
    })),
  });

  const handleSave = useCallback(async (publish: boolean) => {
    if (publish) {
      const err = validate();
      if (err) { Alert.alert('Validação', err); return; }
    }
    setSaving(true);
    try {
      let tid = tournamentId;
      const payload = buildPayload();
      console.log('[SAVE] mode:', isEditing ? 'EDIT' : 'CREATE', 'publish:', publish, 'tournamentId:', tid);
      console.log('[SAVE] payload:', JSON.stringify(payload, null, 2));
      if (isEditing) {
        console.log('[SAVE] calling updateStructure...');
        await tournamentService.updateStructure(tid!, payload);
        console.log('[SAVE] updateStructure OK');
      } else {
        const tournament = await tournamentService.create({ name: name.trim(), description: description.trim() || undefined });
        tid = tournament.id;
        await tournamentService.updateStructure(tid, payload);
        for (const sp of sponsors) {
          if (sp.name.trim()) {
            await tournamentService.addSponsors(tid, [{ name: sp.name.trim() }]);
          }
        }
      }
      if (publish) {
        console.log('[SAVE] calling publish...');
        await tournamentService.publish(tid!);
        console.log('[SAVE] publish OK');
        Alert.alert('Publicado!', 'Torneio publicado com sucesso.');
      } else {
        Alert.alert('Salvo', 'Torneio salvo com sucesso.');
      }
      navigation.goBack();
    } catch (e: any) {
      console.error('[SAVE ERROR] Status:', e?.response?.status);
      console.error('[SAVE ERROR] Response:', JSON.stringify(e?.response?.data, null, 2));
      const fallback = publish ? 'Erro ao publicar' : 'Erro ao salvar';
      const raw = e?.response?.data?.message;
      const code = e?.response?.data?.code;
      const isGeneric = typeof raw !== 'string' || raw === 'Bad Request Exception';
      const msg = isGeneric ? (code ?? fallback) : raw;
      Alert.alert('Erro', typeof msg === 'string' ? msg : fallback);
    } finally {
      setSaving(false);
    }
  }, [name, description, sponsors, validate, navigation, tournamentId, isEditing]);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={goBack} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{isEditing ? 'EDITAR TORNEIO' : 'CRIAR TORNEIO'}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Stepper */}
      <View style={s.stepper}>
        {[1, 2, 3, 4].map((n) => (
          <React.Fragment key={n}>
            <TouchableOpacity
              style={[s.stepDot, step >= n && s.stepDotActive]}
              onPress={() => n < step && setStep(n)}
              disabled={n >= step}
              activeOpacity={n < step ? 0.7 : 1}
            >
              <Text style={[s.stepNum, step >= n && s.stepNumActive]}>{n}</Text>
            </TouchableOpacity>
            {n < 4 && <View style={[s.stepLine, step > n && s.stepLineActive]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom bar */}
      <View style={s.bottomBar}>
        {step < 4 ? (
          <View style={s.navRow}>
            {step > 1 ? (
              <TouchableOpacity style={s.backStepBtn} onPress={goBack} activeOpacity={0.8}>
                <Ionicons name="arrow-back" size={18} color={colors.textMuted} />
                <Text style={s.backStepBtnText}>VOLTAR</Text>
              </TouchableOpacity>
            ) : <View style={{ flex: 1 }} />}
            <TouchableOpacity style={s.nextBtn} onPress={goNext} activeOpacity={0.8}>
              <LinearGradient colors={[colors.primary, colors.primaryGlow]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.nextGradient}>
                <Text style={s.nextBtnText}>PRÓXIMO</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.text} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={s.publishRow}>
            <TouchableOpacity style={s.backStepBtn} onPress={goBack} activeOpacity={0.8}>
              <Ionicons name="arrow-back" size={18} color={colors.textMuted} />
              <Text style={s.backStepBtnText}>VOLTAR</Text>
            </TouchableOpacity>
            {!isEditing && (
              <TouchableOpacity style={s.draftBtn} onPress={() => handleSave(false)} disabled={saving} activeOpacity={0.8}>
                {saving ? <ActivityIndicator color={colors.textMuted} /> : <Text style={s.draftBtnText}>RASCUNHO</Text>}
              </TouchableOpacity>
            )}
            <TouchableOpacity style={s.publishBtnWrap} onPress={() => handleSave(true)} disabled={saving} activeOpacity={0.8}>
              <LinearGradient colors={[colors.primary, colors.primaryGlow]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.publishGradient}>
                {saving ? <ActivityIndicator color={colors.text} /> : <Text style={s.publishBtnText}>{isEditing ? 'SALVAR' : 'PUBLICAR'}</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  // ─── Step 1 ────────────────────────────────────────────────

  function renderStep1() {
    return (
      <View>
        <Text style={s.stepTitle}>INFORMAÇÕES BÁSICAS</Text>

        <Text style={s.fieldLabel}>Nome do torneio *</Text>
        <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Ex: Copa ToquePlay 2025" placeholderTextColor={colors.textMuted} />

        <Text style={s.fieldLabel}>Descrição</Text>
        <TextInput style={[s.input, s.inputMultiline]} value={description} onChangeText={setDescription} placeholder="Sobre o torneio..." placeholderTextColor={colors.textMuted} multiline numberOfLines={3} />

        <Text style={s.fieldLabel}>Tipo de evento</Text>
        <View style={s.chipRow}>
          <TouchableOpacity style={[s.chip, eventType === 'SINGLE' && s.chipActive]} onPress={() => setEventType('SINGLE')}>
            <Text style={[s.chipText, eventType === 'SINGLE' && s.chipTextActive]}>Evento Único</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.chip, eventType === 'CIRCUIT' && s.chipActive]} onPress={() => setEventType('CIRCUIT')}>
            <Text style={[s.chipText, eventType === 'CIRCUIT' && s.chipTextActive]}>Circuito (Liga)</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ─── Step 2 ────────────────────────────────────────────────

  function renderStep2() {
    const updateStage = (idx: number, field: string, value: any) => {
      setStages(stages.map((s, i) => i === idx ? { ...s, [field]: value } : s));
    };

    const toggleFacility = (idx: number, facility: string) => {
      setStages(stages.map((s, i) => {
        if (i !== idx) return s;
        const has = s.facilities.includes(facility);
        return { ...s, facilities: has ? s.facilities.filter((f) => f !== facility) : [...s.facilities, facility] };
      }));
    };

    const addStage = () => setStages([...stages, { ...DEFAULT_STAGE }]);
    const removeStage = (idx: number) => { if (stages.length > 1) setStages(stages.filter((_, i) => i !== idx)); };

    return (
      <View>
        <Text style={s.stepTitle}>LOCALIZAÇÃO</Text>

        {stages.map((stage, idx) => (
          <View key={idx} style={s.stageCard}>
            {eventType === 'CIRCUIT' && (
              <View style={s.stageHeader}>
                <Text style={s.stageLabel}>ETAPA {idx + 1}</Text>
                {stages.length > 1 && (
                  <TouchableOpacity onPress={() => removeStage(idx)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="trash-outline" size={18} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            )}

            <DatePickerField label="Data" value={stage.date} onChange={(v) => updateStage(idx, 'date', v)} mode="date" />
            <DatePickerField label="Horário" value={stage.startTime} onChange={(v) => updateStage(idx, 'startTime', v)} mode="time" />

            <CEPInput
              value={stage.cep}
              onAddressFound={(data) => {
                setStages(stages.map((s, i) => i === idx ? { ...s, cep: data.cep, street: data.street, neighborhood: data.neighborhood, city: data.city, state: data.state } : s));
              }}
            />

            <Text style={s.fieldLabel}>Rua</Text>
            <TextInput style={s.input} value={stage.street} onChangeText={(v) => updateStage(idx, 'street', v)} placeholder="Rua" placeholderTextColor={colors.textMuted} />

            <Text style={s.fieldLabel}>Número</Text>
            <TextInput style={s.input} value={stage.number} onChangeText={(v) => updateStage(idx, 'number', v)} placeholder="Número" placeholderTextColor={colors.textMuted} keyboardType="numeric" />

            <Text style={s.fieldLabel}>Bairro</Text>
            <TextInput style={s.input} value={stage.neighborhood} onChangeText={(v) => updateStage(idx, 'neighborhood', v)} placeholder="Bairro" placeholderTextColor={colors.textMuted} />

            <View style={s.row2}>
              <View style={s.col2}>
                <Text style={s.fieldLabel}>Cidade *</Text>
                <TextInput style={s.input} value={stage.city} onChangeText={(v) => updateStage(idx, 'city', v)} placeholder="Cidade" placeholderTextColor={colors.textMuted} />
              </View>
              <View style={s.col2}>
                <Text style={s.fieldLabel}>Estado</Text>
                <TextInput style={s.input} value={stage.state} onChangeText={(v) => updateStage(idx, 'state', v)} placeholder="UF" placeholderTextColor={colors.textMuted} maxLength={2} autoCapitalize="characters" />
              </View>
            </View>

            <Text style={s.fieldLabel}>Máx. times</Text>
            <TextInput style={s.input} value={stage.maxTeams} onChangeText={(v) => updateStage(idx, 'maxTeams', v)} placeholder="Ex: 16" placeholderTextColor={colors.textMuted} keyboardType="numeric" />

            <Text style={s.fieldLabel}>Instalações</Text>
            <View style={s.chipRowWrap}>
              {FACILITY_OPTIONS.map((f) => {
                const active = stage.facilities.includes(f);
                return (
                  <TouchableOpacity key={f} style={[s.chipSm, active && s.chipSmActive]} onPress={() => toggleFacility(idx, f)}>
                    <Text style={[s.chipSmText, active && s.chipSmTextActive]}>{f}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {eventType === 'CIRCUIT' && (
          <TouchableOpacity style={s.addStageBtn} onPress={addStage} activeOpacity={0.8}>
            <Ionicons name="add" size={18} color={colors.primaryGlow} />
            <Text style={s.addStageText}>ADICIONAR ETAPA</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // ─── Step 3 ────────────────────────────────────────────────

  function renderStep3() {
    const updateCat = (idx: number, field: string, value: string) => {
      setCategories(categories.map((c, i) => {
        if (i !== idx) return c;
        const updated = { ...c, [field]: value };
        if (field === 'modality') {
          updated.format = MODALITY_FORMATS[value]?.[0] ?? c.format;
        }
        return updated;
      }));
    };

    const addCategory = () => setCategories([...categories, { ...DEFAULT_CATEGORY }]);
    const removeCategory = (idx: number) => { if (categories.length > 1) setCategories(categories.filter((_, i) => i !== idx)); };

    const addSponsor = () => setSponsors([...sponsors, { name: '' }]);
    const removeSponsor = (idx: number) => setSponsors(sponsors.filter((_, i) => i !== idx));
    const updateSponsor = (idx: number, value: string) => {
      setSponsors(sponsors.map((s, i) => i === idx ? { name: value } : s));
    };

    return (
      <View>
        <Text style={s.stepTitle}>CATEGORIAS</Text>

        {categories.map((cat, idx) => (
          <View key={idx} style={s.stageCard}>
            <View style={s.stageHeader}>
              <Text style={s.stageLabel}>CATEGORIA {idx + 1}</Text>
              {categories.length > 1 && (
                <TouchableOpacity onPress={() => removeCategory(idx)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>

            <Text style={s.fieldLabel}>Tipo</Text>
            <View style={s.chipRow}>
              {TYPE_OPTIONS.map((t) => (
                <TouchableOpacity key={t.key} style={[s.chip, cat.type === t.key && s.chipActive]} onPress={() => updateCat(idx, 'type', t.key)}>
                  <Text style={[s.chipText, cat.type === t.key && s.chipTextActive]}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.fieldLabel}>Modalidade</Text>
            <View style={s.chipRow}>
              {MODALITY_OPTIONS.map((m) => (
                <TouchableOpacity key={m.key} style={[s.chip, cat.modality === m.key && s.chipActive]} onPress={() => updateCat(idx, 'modality', m.key)}>
                  <Text style={[s.chipText, cat.modality === m.key && s.chipTextActive]}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.fieldLabel}>Formato</Text>
            <View style={s.chipRow}>
              {(MODALITY_FORMATS[cat.modality] ?? []).map((f) => (
                <TouchableOpacity key={f} style={[s.chip, cat.format === f && s.chipActive]} onPress={() => updateCat(idx, 'format', f)}>
                  <Text style={[s.chipText, cat.format === f && s.chipTextActive]}>{FORMAT_LABELS[f] ?? f}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.fieldLabel}>Valor da inscrição (R$)</Text>
            <TextInput style={s.input} value={cat.registrationPrice} onChangeText={(v) => updateCat(idx, 'registrationPrice', v)} placeholder="0.00" placeholderTextColor={colors.textMuted} keyboardType="decimal-pad" />

            <Text style={s.fieldLabel}>Melhor de quantos sets</Text>
            <View style={s.chipRow}>
              {['1', '3', '5'].map((n) => (
                <TouchableOpacity key={n} style={[s.chip, cat.bestOfSets === n && s.chipActive]} onPress={() => updateCat(idx, 'bestOfSets', n)}>
                  <Text style={[s.chipText, cat.bestOfSets === n && s.chipTextActive]}>Melhor de {n}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <DatePickerField label="Prazo de inscrição" value={cat.registrationDeadline} onChange={(v) => updateCat(idx, 'registrationDeadline', v)} mode="date" />
          </View>
        ))}

        <TouchableOpacity style={s.addStageBtn} onPress={addCategory} activeOpacity={0.8}>
          <Ionicons name="add" size={18} color={colors.primaryGlow} />
          <Text style={s.addStageText}>ADICIONAR CATEGORIA</Text>
        </TouchableOpacity>

        <View style={s.divider} />

        <Text style={s.stepTitle}>PATROCINADORES</Text>

        {sponsors.map((sp, idx) => (
          <View key={idx} style={s.sponsorRow}>
            <TextInput style={[s.input, { flex: 1 }]} value={sp.name} onChangeText={(v) => updateSponsor(idx, v)} placeholder="Nome do patrocinador" placeholderTextColor={colors.textMuted} />
            <TouchableOpacity onPress={() => removeSponsor(idx)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={s.addStageBtn} onPress={addSponsor} activeOpacity={0.8}>
          <Ionicons name="add" size={18} color={colors.primaryGlow} />
          <Text style={s.addStageText}>ADICIONAR PATROCINADOR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Step 4 ────────────────────────────────────────────────

  function renderStep4() {
    return (
      <View>
        <Text style={s.stepTitle}>REVISÃO</Text>

        {/* Basic info */}
        <View style={s.reviewCard}>
          <Text style={s.reviewLabel}>INFORMAÇÕES</Text>
          <Text style={s.reviewValue}>{name}</Text>
          {description ? <Text style={s.reviewMeta}>{description}</Text> : null}
          <Text style={s.reviewMeta}>Tipo: {eventType === 'SINGLE' ? 'Evento Único' : 'Circuito'}</Text>
        </View>

        {/* Stages */}
        <View style={s.reviewCard}>
          <Text style={s.reviewLabel}>ETAPAS</Text>
          {stages.map((st, idx) => (
            <View key={idx} style={s.reviewItem}>
              {eventType === 'CIRCUIT' && <Text style={s.reviewMeta}>Etapa {idx + 1}</Text>}
              <Text style={s.reviewValue}>{st.date ? new Date(st.date).toLocaleDateString('pt-BR') : '—'}{st.startTime ? ` às ${st.startTime}` : ''}</Text>
              <Text style={s.reviewMeta}>
                {[st.street, st.number, st.neighborhood].filter(Boolean).join(', ')}{st.city ? ` — ${st.city}` : ''}{st.state ? `/${st.state}` : ''}
              </Text>
              {st.maxTeams ? <Text style={s.reviewMeta}>Máx. times: {st.maxTeams}</Text> : null}
              {st.facilities.length > 0 && <Text style={s.reviewMeta}>Instalações: {st.facilities.join(', ')}</Text>}
            </View>
          ))}
        </View>

        {/* Categories */}
        <View style={s.reviewCard}>
          <Text style={s.reviewLabel}>CATEGORIAS</Text>
          {categories.map((cat, idx) => (
            <View key={idx} style={s.reviewItem}>
              <Text style={s.reviewValue}>
                {TYPE_OPTIONS.find((t) => t.key === cat.type)?.label} · {MODALITY_OPTIONS.find((m) => m.key === cat.modality)?.label} · {FORMAT_LABELS[cat.format] ?? cat.format}
              </Text>
              {cat.registrationPrice ? <Text style={s.reviewMeta}>R$ {cat.registrationPrice}</Text> : null}
              {cat.registrationDeadline ? <Text style={s.reviewMeta}>Prazo: {new Date(cat.registrationDeadline).toLocaleDateString('pt-BR')}</Text> : null}
            </View>
          ))}
        </View>

        {/* Sponsors */}
        {sponsors.length > 0 && (
          <View style={s.reviewCard}>
            <Text style={s.reviewLabel}>PATROCINADORES</Text>
            {sponsors.map((sp, idx) => (
              <Text key={idx} style={s.reviewMeta}>{sp.name}</Text>
            ))}
          </View>
        )}
      </View>
    );
  }
}

// ─── Styles ─────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: spacing.md, marginBottom: spacing.md,
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 20, fontFamily: fonts.title.display, color: colors.text, letterSpacing: 2 },

  // Stepper
  stepper: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.xl, marginBottom: spacing.xl, gap: 0,
  },
  stepDot: {
    width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  stepDotActive: { backgroundColor: 'rgba(109,46,192,0.2)', borderColor: colors.primary },
  stepNum: { fontSize: 12, fontFamily: fonts.text.semiBold, color: colors.textMuted },
  stepNumActive: { color: colors.primaryGlow },
  stepLine: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.06)', marginHorizontal: 4 },
  stepLineActive: { backgroundColor: colors.primary },

  content: { paddingHorizontal: spacing.xl, paddingBottom: 20 },

  // Fields
  stepTitle: { fontSize: 16, fontFamily: fonts.title.display, color: colors.text, letterSpacing: 2, marginBottom: spacing.lg },
  fieldLabel: { fontSize: 10, fontFamily: fonts.text.semiBold, color: colors.textMuted, marginBottom: 6, marginTop: spacing.md, letterSpacing: 1.5 },
  input: {
    backgroundColor: colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    color: colors.text, fontFamily: fonts.text.regular, fontSize: 14,
  },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },

  // Chips
  chipRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm - 2, borderRadius: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
  },
  chipActive: { backgroundColor: 'rgba(109,46,192,0.15)', borderColor: 'rgba(157,115,230,0.3)' },
  chipText: { fontSize: 12, fontFamily: fonts.text.semiBold, color: colors.textMuted, letterSpacing: 0.5 },
  chipTextActive: { color: colors.primaryGlow },

  chipRowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  chipSm: {
    paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: 8,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
  },
  chipSmActive: { backgroundColor: 'rgba(109,46,192,0.12)', borderColor: 'rgba(157,115,230,0.3)' },
  chipSmText: { fontSize: 11, fontFamily: fonts.text.medium, color: colors.textMuted },
  chipSmTextActive: { color: colors.primaryGlow },

  // Stage card
  stageCard: {
    backgroundColor: colors.surface, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
    padding: spacing.lg, marginBottom: spacing.lg,
  },
  stageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  stageLabel: { fontSize: 12, fontFamily: fonts.text.semiBold, color: colors.primaryGlow, letterSpacing: 1.5 },

  addStageBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, paddingVertical: spacing.lg, borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(157,115,230,0.2)', borderStyle: 'dashed',
    marginBottom: spacing.lg,
  },
  addStageText: { fontSize: 12, fontFamily: fonts.text.semiBold, color: colors.primaryGlow, letterSpacing: 1.5 },

  row2: { flexDirection: 'row', gap: spacing.md },
  col2: { flex: 1 },

  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.04)', marginVertical: spacing.lg },

  // Sponsors
  sponsorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },

  // Bottom bar
  bottomBar: {
    paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.lg,
    backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.04)',
  },
  navRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  backStepBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
  },
  backStepBtnText: { fontSize: 12, fontFamily: fonts.text.semiBold, color: colors.textMuted, letterSpacing: 1.5 },
  nextBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  nextGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  nextBtnText: { fontSize: 14, fontFamily: fonts.text.semiBold, color: colors.text, letterSpacing: 2 },

  publishRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  draftBtn: {
    paddingVertical: spacing.lg, paddingHorizontal: spacing.lg, borderRadius: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
  },
  draftBtnText: { fontSize: 12, fontFamily: fonts.text.semiBold, color: colors.textMuted, letterSpacing: 1.5 },
  publishBtnWrap: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  publishGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.lg },
  publishBtnText: { fontSize: 14, fontFamily: fonts.text.semiBold, color: colors.text, letterSpacing: 2 },

  // Review
  reviewCard: {
    backgroundColor: colors.surface, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
    padding: spacing.lg, marginBottom: spacing.lg,
  },
  reviewLabel: { fontSize: 10, fontFamily: fonts.text.semiBold, color: colors.textMuted, letterSpacing: 1.5, marginBottom: spacing.sm },
  reviewValue: { fontSize: 14, fontFamily: fonts.text.semiBold, color: colors.text, marginBottom: 4 },
  reviewMeta: { fontSize: 12, fontFamily: fonts.text.regular, color: colors.textMuted, lineHeight: 18 },
  reviewItem: { marginBottom: spacing.md },
});
