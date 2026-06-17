import { useCallback, useEffect, useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { tournamentService } from '../../../services/tournament';
import { useDialogStore } from '../../../stores/dialogStore';
import {
  DEFAULT_CATEGORY,
  DEFAULT_STAGE,
  MODALITY_FORMATS,
  type CategoryInput,
  type StageInput,
} from '../tournamentForm.types';

interface Args {
  tournamentId?: string;
  navigation: any;
}

export function useTournamentForm({ tournamentId, navigation }: Args) {
  const isEditing = !!tournamentId;
  const loadedRef = useRef(false);
  const dialog = useDialogStore();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Step 1 — basic
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<string>('SINGLE');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [bannerModalVisible, setBannerModalVisible] = useState(false);
  const [defaultBanners, setDefaultBanners] = useState<string[]>([]);

  // Step 2 — stages
  const [stages, setStages] = useState<StageInput[]>([{ ...DEFAULT_STAGE }]);

  // Step 3 — categories + sponsors
  const [categories, setCategories] = useState<CategoryInput[]>([{ ...DEFAULT_CATEGORY }]);
  const [sponsors, setSponsors] = useState<{ name: string }[]>([]);

  useEffect(() => {
    tournamentService.getBanners().then(setDefaultBanners).catch(() => {});
  }, []);

  useEffect(() => {
    if (!tournamentId || loadedRef.current) return;
    loadedRef.current = true;
    tournamentService
      .findOne(tournamentId)
      .then((t: any) => {
        setName(t.name || '');
        setDescription(t.description || '');
        setEventType(t.eventType || 'SINGLE');
        setImageUrl(t.imageUrl || null);
        if (t.stages?.length) {
          setStages(
            t.stages.map((st: any) => ({
              date: st.date ? new Date(st.date).toISOString().split('T')[0] : '',
              startTime: st.startTime
                ? new Date(st.startTime).toISOString().slice(11, 16)
                : '',
              maxTeams: st.maxTeams ? String(st.maxTeams) : '',
              cep: st.cep || '',
              street: st.street || '',
              number: st.number || '',
              neighborhood: st.neighborhood || '',
              city: st.city || '',
              state: st.state || '',
              facilities: st.facilities?.map((f: any) => f.name) || [],
            })),
          );
        }
        if (t.categories?.length) {
          setCategories(
            t.categories.map((c: any) => ({
              type: c.type || 'MALE',
              modality: c.modality || 'BEACH',
              format: c.format || 'PAIR',
              registrationPrice:
                c.registrationPrice != null ? String(c.registrationPrice) : '',
              registrationDeadline: c.registrationDeadline
                ? new Date(c.registrationDeadline).toISOString().split('T')[0]
                : '',
              bestOfSets: c.bestOfSets ? String(c.bestOfSets) : '3',
              semifinalBestOfSets: c.semifinalBestOfSets
                ? String(c.semifinalBestOfSets)
                : '',
              finalBestOfSets: c.finalBestOfSets ? String(c.finalBestOfSets) : '',
            })),
          );
        }
        if (t.sponsors?.length) {
          setSponsors(t.sponsors.map((sp: any) => ({ name: sp.name || '' })));
        }
      })
      .catch(() => dialog.error('Não foi possível carregar o torneio.'));
  }, [tournamentId, dialog]);

  const goNext = useCallback(() => setStep((s) => Math.min(s + 1, 3)), []);
  const goBack = useCallback(() => {
    setStep((s) => {
      if (s > 0) return s - 1;
      navigation.goBack();
      return s;
    });
  }, [navigation]);

  // Stage ops
  const updateStage = useCallback((idx: number, field: string, value: any) => {
    setStages((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  }, []);

  const toggleFacility = useCallback((idx: number, facility: string) => {
    setStages((prev) =>
      prev.map((s, i) => {
        if (i !== idx) return s;
        const has = s.facilities.includes(facility);
        return {
          ...s,
          facilities: has
            ? s.facilities.filter((f) => f !== facility)
            : [...s.facilities, facility],
        };
      }),
    );
  }, []);

  const addStage = useCallback(() => setStages((prev) => [...prev, { ...DEFAULT_STAGE }]), []);
  const removeStage = useCallback(
    (idx: number) =>
      setStages((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev)),
    [],
  );

  // Category ops
  const updateCategory = useCallback((idx: number, field: string, value: string) => {
    setCategories((prev) =>
      prev.map((c, i) => {
        if (i !== idx) return c;
        const updated = { ...c, [field]: value };
        if (field === 'modality') {
          updated.format = MODALITY_FORMATS[value]?.[0] ?? c.format;
        }
        return updated;
      }),
    );
  }, []);

  const addCategory = useCallback(
    () => setCategories((prev) => [...prev, { ...DEFAULT_CATEGORY }]),
    [],
  );
  const removeCategory = useCallback(
    (idx: number) =>
      setCategories((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev)),
    [],
  );

  // Sponsor ops
  const addSponsor = useCallback(
    () => setSponsors((prev) => [...prev, { name: '' }]),
    [],
  );
  const removeSponsor = useCallback(
    (idx: number) => setSponsors((prev) => prev.filter((_, i) => i !== idx)),
    [],
  );
  const updateSponsor = useCallback(
    (idx: number, value: string) =>
      setSponsors((prev) => prev.map((s, i) => (i === idx ? { name: value } : s))),
    [],
  );

  const pickImage = useCallback(async () => {
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
          const updated: any = await tournamentService.uploadCover(tournamentId, asset.uri);
          setImageUrl(updated.imageUrl);
        } else {
          setImageUrl(asset.uri);
        }
      } catch {
        dialog.error('Erro ao enviar imagem.');
      }
      setBannerModalVisible(false);
    }
  }, [tournamentId, dialog]);

  const validate = useCallback((): string | null => {
    if (!name.trim()) return 'Nome do torneio é obrigatório';
    if (stages.length === 0) return 'Adicione pelo menos uma etapa';
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7);
    minDate.setHours(0, 0, 0, 0);
    for (const st of stages) {
      if (!st.date) return 'Data da etapa é obrigatória';
      if (!st.city.trim()) return 'Cidade da etapa é obrigatória';
      if (new Date(st.date + 'T00:00:00') < minDate)
        return 'A data da etapa deve ser pelo menos 7 dias no futuro';
    }
    if (categories.length === 0) return 'Adicione pelo menos uma categoria';
    return null;
  }, [name, stages, categories]);

  const buildPayload = useCallback(() => {
    return {
      eventType,
      stages: stages.map((st) => ({
        date: st.date,
        startTime: st.startTime && st.date ? `${st.date}T${st.startTime}:00Z` : undefined,
        maxTeams: st.maxTeams ? parseInt(st.maxTeams) : undefined,
        street: st.street || undefined,
        number: st.number || undefined,
        neighborhood: st.neighborhood || undefined,
        cep: st.cep || undefined,
        city: st.city || undefined,
        state: st.state || undefined,
        facilities: st.facilities.map((f) => ({ name: f })),
      })),
      categories: categories.map((c) => ({
        type: c.type,
        format: c.format,
        modality: c.modality,
        minMembers: c.format === 'PAIR' ? 2 : c.format === 'QUARTET' ? 4 : 6,
        maxMembers: c.format === 'PAIR' ? 2 : c.format === 'QUARTET' ? 4 : 6,
        bestOfSets: c.bestOfSets ? parseInt(c.bestOfSets) : 3,
        semifinalBestOfSets: c.semifinalBestOfSets
          ? parseInt(c.semifinalBestOfSets)
          : undefined,
        finalBestOfSets: c.finalBestOfSets ? parseInt(c.finalBestOfSets) : undefined,
        registrationPrice: c.registrationPrice ? parseFloat(c.registrationPrice) : undefined,
        registrationDeadline: c.registrationDeadline || undefined,
      })),
    };
  }, [eventType, stages, categories]);

  const handleSave = useCallback(
    async (publish: boolean) => {
      if (publish) {
        const err = validate();
        if (err) {
          dialog.warning(err);
          return;
        }
      }
      setSaving(true);
      try {
        let tid: string;
        const payload = buildPayload();
        if (isEditing) {
          tid = tournamentId!;
          await tournamentService.updateStructure(tid, payload);
        } else {
          const tournament = await tournamentService.create({
            name: name.trim(),
            description: description.trim() || undefined,
          });
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
        const msg = isGeneric ? code ?? fallback : raw;
        dialog.error(typeof msg === 'string' ? msg : fallback);
      } finally {
        setSaving(false);
      }
    },
    [
      name,
      description,
      sponsors,
      validate,
      navigation,
      tournamentId,
      isEditing,
      imageUrl,
      buildPayload,
      dialog,
    ],
  );

  return {
    isEditing,
    step,
    saving,
    name,
    description,
    eventType,
    imageUrl,
    bannerModalVisible,
    defaultBanners,
    stages,
    categories,
    sponsors,
    setName,
    setDescription,
    setEventType,
    setImageUrl,
    setBannerModalVisible,
    goNext,
    goBack,
    updateStage,
    toggleFacility,
    addStage,
    removeStage,
    updateCategory,
    addCategory,
    removeCategory,
    addSponsor,
    removeSponsor,
    updateSponsor,
    pickImage,
    handleSave,
  };
}

export type TournamentForm = ReturnType<typeof useTournamentForm>;
