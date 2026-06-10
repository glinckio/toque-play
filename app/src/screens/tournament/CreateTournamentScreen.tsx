import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Image, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import DatePickerField from '../../components/DatePickerField';
import CEPInput from '../../components/CEPInput';
import HeroHeader from '../../components/HeroHeader';
import Stepper from '../../components/Stepper';
import ChevronButton from '../../components/ChevronButton';
import { useDialogStore } from '../../stores/dialogStore';
import { tournamentService } from '../../services/tournament';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';

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
  semifinalBestOfSets: string;
  finalBestOfSets: string;
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

const STEP_LABELS = ['Básico', 'Estrutura', 'Categorias', 'Revisão'];

const DEFAULT_STAGE: StageInput = {
  date: '', startTime: '', maxTeams: '', cep: '', street: '', number: '', neighborhood: '', city: '', state: '', facilities: [],
};

const DEFAULT_CATEGORY: CategoryInput = {
  type: 'MALE', modality: 'BEACH', format: 'PAIR', registrationPrice: '', registrationDeadline: '', bestOfSets: '3', semifinalBestOfSets: '', finalBestOfSets: '',
};

// ─── Main Screen ───────────────────────────────────────────

export default function CreateTournamentScreen({ navigation }: any) {
  const route = useRoute<any>();
  const tournamentId = route.params?.tournamentId;
  const isEditing = !!tournamentId;
  const loadedRef = useRef(false);
  const dialog = useDialogStore();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // Step 1
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<string>('SINGLE');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [bannerModalVisible, setBannerModalVisible] = useState(false);
  const [defaultBanners, setDefaultBanners] = useState<string[]>([]);

  useEffect(() => {
    tournamentService.getBanners().then(setDefaultBanners).catch(() => {});
  }, []);

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
      setImageUrl((t as any).imageUrl || null);
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
          semifinalBestOfSets: c.semifinalBestOfSets ? String(c.semifinalBestOfSets) : '',
          finalBestOfSets: c.finalBestOfSets ? String(c.finalBestOfSets) : '',
        })));
      }
      if (t.sponsors?.length) {
        setSponsors(t.sponsors.map((sp: any) => ({ name: sp.name || '' })));
      }
    }).catch(() => dialog.error('Não foi possível carregar o torneio.'));
  }, [tournamentId]);

  const goNext = () => { setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1)); scrollRef.current?.scrollTo({ y: 0, animated: false }); };
  const goBack = () => { if (step > 0) { setStep((s) => s - 1); scrollRef.current?.scrollTo({ y: 0, animated: false }); } else navigation.goBack(); };

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
      semifinalBestOfSets: c.semifinalBestOfSets ? parseInt(c.semifinalBestOfSets) : undefined,
      finalBestOfSets: c.finalBestOfSets ? parseInt(c.finalBestOfSets) : undefined,
      registrationPrice: c.registrationPrice ? parseFloat(c.registrationPrice) : undefined,
      registrationDeadline: c.registrationDeadline || undefined,
    })),
  });

  const handleSave = useCallback(async (publish: boolean) => {
    if (publish) {
      const err = validate();
      if (err) { dialog.warning(err); return; }
    }
    setSaving(true);
    try {
      let tid = tournamentId;
      const payload = buildPayload();
      if (isEditing) {
        await tournamentService.updateStructure(tid!, payload);
      } else {
        const tournament = await tournamentService.create({ name: name.trim(), description: description.trim() || undefined });
        tid = tournament.id;
        await tournamentService.updateStructure(tid, payload);
        if (imageUrl) {
          if (imageUrl.startsWith('file://') || imageUrl.startsWith('content://')) {
            await tournamentService.uploadCover(tid, imageUrl);
          } else {
            await tournamentService.setBannerUrl(tid, imageUrl);
          }
        }
        for (const sp of sponsors) {
          if (sp.name.trim()) {
            await tournamentService.addSponsors(tid, [{ name: sp.name.trim() }]);
          }
        }
      }
      if (publish) {
        await tournamentService.publish(tid!);
        dialog.success('Torneio publicado com sucesso.');
      } else {
        dialog.success('Torneio salvo com sucesso.');
      }
      navigation.goBack();
    } catch (e: any) {
      const fallback = publish ? 'Erro ao publicar' : 'Erro ao salvar';
      const raw = e?.response?.data?.message;
      const code = e?.response?.data?.code;
      const isGeneric = typeof raw !== 'string' || raw === 'Bad Request Exception';
      const msg = isGeneric ? (code ?? fallback) : raw;
      dialog.error(typeof msg === 'string' ? msg : fallback);
    } finally {
      setSaving(false);
    }
  }, [name, description, sponsors, validate, navigation, tournamentId, isEditing]);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <HeroHeader
          title={isEditing ? 'EDITAR TORNEIO' : 'CRIAR TORNEIO'}
          watermark={isEditing ? 'EDIT' : 'CREATE'}
          onBack={goBack}
          rounded
        />

        {/* Stepper */}
        <View style={s.stepperWrap}>
          <Stepper steps={STEP_LABELS} currentStep={step} />
        </View>

        <ScrollView ref={scrollRef} contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {step === 0 && renderStep1()}
          {step === 1 && renderStep2()}
          {step === 2 && renderStep3()}
          {step === 3 && renderStep4()}
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Bottom bar */}
        <View style={s.bottomBar}>
          {step < 3 ? (
            <View style={s.navRow}>
              {step > 0 ? (
                <ChevronButton variant="ghost" size="md" onPress={goBack}>
                  VOLTAR
                </ChevronButton>
              ) : <View style={{ flex: 1 }} />}
              <ChevronButton variant="primary" size="md" onPress={goNext}
                icon={<Ionicons name="arrow-forward" size={14} color="#FFFFFF" />}
              >
                PRÓXIMO
              </ChevronButton>
            </View>
          ) : (
            <View style={s.publishRow}>
              <ChevronButton variant="ghost" size="md" onPress={goBack}>
                VOLTAR
              </ChevronButton>
              {!isEditing && (
                <ChevronButton variant="secondary" size="md" onPress={() => handleSave(false)} disabled={saving}>
                  {saving ? 'SALVANDO...' : 'RASCUNHO'}
                </ChevronButton>
              )}
              <ChevronButton variant="primary" size="md" onPress={() => handleSave(true)} disabled={saving}
                icon={<Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              >
                {saving ? 'SALVANDO...' : isEditing ? 'SALVAR' : 'PUBLICAR'}
              </ChevronButton>
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

        {/* Banner area */}
        <Text style={s.fieldLabel}>Banner do torneio</Text>
        <TouchableOpacity style={s.bannerArea} onPress={() => setBannerModalVisible(true)} activeOpacity={0.7}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
          ) : (
            <View style={s.bannerPlaceholder}>
              <Ionicons name="image-outline" size={32} color={colors.textPlaceholder} />
              <Text style={s.bannerPlaceholderText}>Toque para escolher um banner</Text>
              <Text style={s.bannerPlaceholderHint}>1200 x 800 px</Text>
            </View>
          )}
          {imageUrl && (
            <View style={s.bannerEditBadge}>
              <Ionicons name="pencil" size={12} color="#FFFFFF" />
              <Text style={s.bannerEditText}>Editar</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Banner modal */}
        <Modal visible={bannerModalVisible} transparent animationType="fade" onRequestClose={() => setBannerModalVisible(false)}>
          <TouchableOpacity style={s.bannerModalOverlay} activeOpacity={1} onPress={() => setBannerModalVisible(false)}>
            <TouchableOpacity style={s.bannerModalContent} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <View style={s.bannerModalHeader}>
                <Text style={s.bannerModalTitle}>Escolher Banner</Text>
                <TouchableOpacity onPress={() => setBannerModalVisible(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close" size={22} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <Text style={s.bannerModalSubtitle}>Banners padrão</Text>
              <View style={s.bannerGrid}>
                {defaultBanners.map((url) => (
                  <TouchableOpacity
                    key={url}
                    style={[s.bannerGridThumb, imageUrl === url && s.bannerGridThumbActive]}
                    onPress={() => { setImageUrl(url); setBannerModalVisible(false); }}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: url }} style={s.bannerGridImg} resizeMode="cover" />
                    {imageUrl === url && (
                      <View style={s.bannerCheckBadge}>
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={s.bannerModalDivider} />

              <Text style={s.bannerModalSubtitle}>Enviar minha foto</Text>
              <TouchableOpacity style={s.bannerUploadCard} onPress={pickImage} activeOpacity={0.7}>
                <Ionicons name="cloud-upload-outline" size={28} color={colors.primary} />
                <Text style={s.bannerUploadLabel}>Escolher da galeria</Text>
                <Text style={s.bannerUploadHint}>JPG ou PNG, máximo 10MB</Text>
              </TouchableOpacity>

              {imageUrl && (
                <TouchableOpacity style={s.bannerRemoveOption} onPress={() => { setImageUrl(null); setBannerModalVisible(false); }}>
                  <Ionicons name="trash-outline" size={16} color={colors.error} />
                  <Text style={s.bannerRemoveText}>Remover banner</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        <Text style={s.fieldLabel}>Nome do torneio *</Text>
        <View style={s.inputWrap}>
          <Ionicons name="trophy-outline" size={16} color={colors.textPlaceholder} />
          <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Ex: Copa ToquePlay 2025" placeholderTextColor={colors.textPlaceholder} />
        </View>

        <Text style={s.fieldLabel}>Descrição</Text>
        <View style={[s.inputWrap, s.inputMultilineWrap]}>
          <Ionicons name="document-text-outline" size={16} color={colors.textPlaceholder} style={{ marginTop: 12 }} />
          <TextInput style={[s.input, s.inputMultiline]} value={description} onChangeText={setDescription} placeholder="Sobre o torneio..." placeholderTextColor={colors.textPlaceholder} multiline numberOfLines={3} />
        </View>

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

    async function pickImage() {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1200, 800],
        quality: 0.85,
      });
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        try {
          if (tournamentId) {
            const updated = await tournamentService.uploadCover(tournamentId, asset.uri);
            setImageUrl((updated as any).imageUrl);
          } else {
            setImageUrl(asset.uri);
          }
        } catch {
          dialog.error('Erro ao enviar imagem.');
        }
        setBannerModalVisible(false);
      }
    }
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
          <View key={idx} style={s.card}>
            {eventType === 'CIRCUIT' && (
              <View style={s.cardHeader}>
                <Text style={s.cardLabel}>ETAPA {idx + 1}</Text>
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
            <View style={s.inputWrap}>
              <TextInput style={s.input} value={stage.street} onChangeText={(v) => updateStage(idx, 'street', v)} placeholder="Rua" placeholderTextColor={colors.textPlaceholder} />
            </View>

            <Text style={s.fieldLabel}>Número</Text>
            <View style={s.inputWrap}>
              <TextInput style={s.input} value={stage.number} onChangeText={(v) => updateStage(idx, 'number', v)} placeholder="Número" placeholderTextColor={colors.textPlaceholder} keyboardType="numeric" />
            </View>

            <Text style={s.fieldLabel}>Bairro</Text>
            <View style={s.inputWrap}>
              <TextInput style={s.input} value={stage.neighborhood} onChangeText={(v) => updateStage(idx, 'neighborhood', v)} placeholder="Bairro" placeholderTextColor={colors.textPlaceholder} />
            </View>

            <View style={s.row2}>
              <View style={s.col2}>
                <Text style={s.fieldLabel}>Cidade *</Text>
                <View style={s.inputWrap}>
                  <TextInput style={s.input} value={stage.city} onChangeText={(v) => updateStage(idx, 'city', v)} placeholder="Cidade" placeholderTextColor={colors.textPlaceholder} />
                </View>
              </View>
              <View style={s.col2}>
                <Text style={s.fieldLabel}>Estado</Text>
                <View style={s.inputWrap}>
                  <TextInput style={s.input} value={stage.state} onChangeText={(v) => updateStage(idx, 'state', v)} placeholder="UF" placeholderTextColor={colors.textPlaceholder} maxLength={2} autoCapitalize="characters" />
                </View>
              </View>
            </View>

            <Text style={s.fieldLabel}>Máx. times</Text>
            <View style={s.inputWrap}>
              <TextInput style={s.input} value={stage.maxTeams} onChangeText={(v) => updateStage(idx, 'maxTeams', v)} placeholder="Ex: 16" placeholderTextColor={colors.textPlaceholder} keyboardType="numeric" />
            </View>

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
          <TouchableOpacity style={s.addBtn} onPress={addStage} activeOpacity={0.8}>
            <Ionicons name="add" size={18} color={colors.primary} />
            <Text style={s.addBtnText}>ADICIONAR ETAPA</Text>
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
          <View key={idx} style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardLabel}>CATEGORIA {idx + 1}</Text>
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
            <View style={s.inputWrap}>
              <Ionicons name="cash-outline" size={16} color={colors.textPlaceholder} />
              <TextInput style={s.input} value={cat.registrationPrice} onChangeText={(v) => updateCat(idx, 'registrationPrice', v)} placeholder="0.00" placeholderTextColor={colors.textPlaceholder} keyboardType="decimal-pad" />
            </View>

            <Text style={s.fieldLabel}>Melhor de quantos sets</Text>
            <View style={s.chipRow}>
              {['1', '3', '5'].map((n) => (
                <TouchableOpacity key={n} style={[s.chip, cat.bestOfSets === n && s.chipActive]} onPress={() => updateCat(idx, 'bestOfSets', n)}>
                  <Text style={[s.chipText, cat.bestOfSets === n && s.chipTextActive]}>Melhor de {n}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.fieldLabel}>Semifinal e 3º lugar</Text>
            <Text style={s.fieldHint}>Deixe vazio para usar o padrão acima</Text>
            <View style={s.chipRow}>
              {['', '1', '3', '5'].map((n) => (
                <TouchableOpacity key={n || 'auto'} style={[s.chip, cat.semifinalBestOfSets === n && s.chipActive]} onPress={() => updateCat(idx, 'semifinalBestOfSets', n)}>
                  <Text style={[s.chipText, cat.semifinalBestOfSets === n && s.chipTextActive]}>{n ? `Melhor de ${n}` : 'Padrão'}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.fieldLabel}>Final (1º e 2º lugar)</Text>
            <Text style={s.fieldHint}>Deixe vazio para usar o padrão acima</Text>
            <View style={s.chipRow}>
              {['', '1', '3', '5'].map((n) => (
                <TouchableOpacity key={n || 'auto'} style={[s.chip, cat.finalBestOfSets === n && s.chipActive]} onPress={() => updateCat(idx, 'finalBestOfSets', n)}>
                  <Text style={[s.chipText, cat.finalBestOfSets === n && s.chipTextActive]}>{n ? `Melhor de ${n}` : 'Padrão'}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <DatePickerField label="Prazo de inscrição" value={cat.registrationDeadline} onChange={(v) => updateCat(idx, 'registrationDeadline', v)} mode="date" />
          </View>
        ))}

        <TouchableOpacity style={s.addBtn} onPress={addCategory} activeOpacity={0.8}>
          <Ionicons name="add" size={18} color={colors.primary} />
          <Text style={s.addBtnText}>ADICIONAR CATEGORIA</Text>
        </TouchableOpacity>

        <View style={s.divider} />

        <Text style={s.stepTitle}>PATROCINADORES</Text>

        {sponsors.map((sp, idx) => (
          <View key={idx} style={s.sponsorRow}>
            <View style={[s.inputWrap, { flex: 1 }]}>
              <Ionicons name="business-outline" size={16} color={colors.textPlaceholder} />
              <TextInput style={s.input} value={sp.name} onChangeText={(v) => updateSponsor(idx, v)} placeholder="Nome do patrocinador" placeholderTextColor={colors.textPlaceholder} />
            </View>
            <TouchableOpacity onPress={() => removeSponsor(idx)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={22} color={colors.textPlaceholder} />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={s.addBtn} onPress={addSponsor} activeOpacity={0.8}>
          <Ionicons name="add" size={18} color={colors.primary} />
          <Text style={s.addBtnText}>ADICIONAR PATROCINADOR</Text>
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
              <Text style={s.reviewMeta}>Melhor de {cat.bestOfSets} sets</Text>
              {cat.semifinalBestOfSets ? <Text style={s.reviewMeta}>Semifinal: melhor de {cat.semifinalBestOfSets}</Text> : null}
              {cat.finalBestOfSets ? <Text style={s.reviewMeta}>Final: melhor de {cat.finalBestOfSets}</Text> : null}
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

  stepperWrap: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, backgroundColor: colors.surface },

  content: { paddingHorizontal: spacing.xl, paddingBottom: 20 },

  // Fields
  stepTitle: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.heading,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
    marginBottom: spacing.lg,
    marginTop: spacing.lg,
  },
  fieldLabel: {
    fontFamily: fonts.form.medium,
    fontSize: typography.sizes.input,
    color: colors.textDefault,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  fieldHint: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    marginTop: -spacing.xs,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    height: 48,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: typography.sizes.input,
    fontFamily: fonts.form.regular,
    paddingVertical: 0,
  },
  inputMultilineWrap: { alignItems: 'flex-start', minHeight: 80 },
  inputMultiline: { minHeight: 60, textAlignVertical: 'top' },

  // Chips
  chipRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    borderRadius: radius.lg,
    backgroundColor: colors.inputBackground,
  },
  chipActive: { backgroundColor: colors.primaryTint, borderWidth: 1, borderColor: colors.primary },
  chipText: { fontSize: typography.sizes.md, fontFamily: fonts.text.semiBold, color: colors.textMuted },
  chipTextActive: { color: colors.primary },

  chipRowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  chipSm: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.inputBackground,
  },
  chipSmActive: { backgroundColor: colors.primaryTint, borderWidth: 1, borderColor: colors.primary },
  chipSmText: { fontSize: typography.sizes.md, fontFamily: fonts.text.medium, color: colors.textMuted },
  chipSmTextActive: { color: colors.primary },

  // Cards
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardLabel: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.semiBold,
    color: colors.primary,
    letterSpacing: typography.letterSpacing.medium,
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    marginBottom: spacing.lg,
  },
  addBtnText: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.semiBold,
    color: colors.primary,
    letterSpacing: typography.letterSpacing.medium,
  },

  row2: { flexDirection: 'row', gap: spacing.md },
  col2: { flex: 1 },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xl },

  // Sponsors
  sponsorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },

  // Bottom bar
  bottomBar: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  publishRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },

  // Review
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  reviewLabel: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.semiBold,
    color: colors.textMuted,
    letterSpacing: typography.letterSpacing.medium,
    marginBottom: spacing.sm,
  },
  reviewValue: {
    fontSize: typography.sizes.input,
    fontFamily: fonts.text.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  reviewMeta: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.regular,
    color: colors.textMuted,
    lineHeight: 18,
  },
  reviewItem: { marginBottom: spacing.md },

  // Banner picker
  bannerArea: {
    height: 140,
    borderRadius: radius.card,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    backgroundColor: colors.inputBackground,
  },
  bannerPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  bannerPlaceholderText: {
    fontFamily: fonts.text.medium,
    fontSize: typography.sizes.input,
    color: colors.textPlaceholder,
    marginTop: spacing.sm,
  },
  bannerPlaceholderHint: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  bannerEditBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  bannerEditText: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.sm,
    color: '#FFFFFF',
  },

  // Banner modal
  bannerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20,10,30,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  bannerModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  bannerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  bannerModalTitle: {
    fontFamily: fonts.title.regular,
    fontSize: 20,
    color: colors.text,
    letterSpacing: 0.3,
  },
  bannerModalSubtitle: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    letterSpacing: typography.letterSpacing.medium,
    marginBottom: spacing.sm,
  },
  bannerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  bannerGridThumb: {
    width: '47%',
    height: 80,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bannerGridThumbActive: {
    borderColor: colors.primary,
  },
  bannerGridImg: {
    width: '100%',
    height: '100%',
  },
  bannerCheckBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerModalDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  bannerUploadCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    gap: 4,
  },
  bannerUploadLabel: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.input,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  bannerUploadHint: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  bannerRemoveOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  bannerRemoveText: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.input,
    color: colors.error,
  },
});
