import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { tournamentService } from '../../services/tournament';
import { registrationService } from '../../services/registration';
import { useAuthStore } from '../../stores/authStore';
import type { TournamentStackParamList } from '../../navigation/types';
import type { Tournament } from '../../types/tournament';
import { BracketType } from '../../types/tournament';

type Nav = NativeStackNavigationProp<TournamentStackParamList, 'TournamentDetail'>;
type Route = RouteProp<TournamentStackParamList, 'TournamentDetail'>;

const STATUS_COLORS: Record<string, string> = {
  REGISTRATION_OPEN: '#4CAF50',
  PUBLISHED: '#4CAF50',
  REGISTRATION_CLOSED: '#FF9800',
  BRACKET_GENERATED: '#2196F3',
  IN_PROGRESS: '#FF4444',
  FINISHED: '#888',
  DRAFT: '#666',
  CANCELLED: '#555',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicado',
  REGISTRATION_OPEN: 'Inscrições Abertas',
  REGISTRATION_CLOSED: 'Inscrições Fechadas',
  BRACKET_GENERATED: 'Chaves Geradas',
  IN_PROGRESS: 'Em Andamento',
  FINISHED: 'Finalizado',
  CANCELLED: 'Cancelado',
};

const MODALITY_LABELS: Record<string, string> = { BEACH: 'Areia', COURT: 'Quadra' };
const FORMAT_LABELS: Record<string, string> = { PAIR: 'Dupla', QUARTET: 'Quarteto', SEXTET: 'Sexteto' };
const TYPE_LABELS: Record<string, string> = { MASC: 'Masculino', FEM: 'Feminino', MISTO: 'Misto', MALE: 'Masculino', FEMALE: 'Feminino', MIX: 'Misto' };

const BRACKET_TYPE_OPTIONS: { key: BracketType; label: string; icon: string }[] = [
  { key: BracketType.SINGLE_ELIMINATION, label: 'Eliminatória Simples', icon: 'git-branch-outline' },
  { key: BracketType.DOUBLE_ELIMINATION, label: 'Eliminatória Dupla', icon: 'git-merge-outline' },
  { key: BracketType.ROUND_ROBIN, label: 'Todos contra Todos', icon: 'sync-outline' },
  { key: BracketType.GROUPS_THEN_ELIMINATION, label: 'Fases + Eliminatória', icon: 'grid-outline' },
];

function formatBRL(v: any) {
  const n = Number(v);
  if (!v || isNaN(n) || n === 0) return 'Grátis';
  return `R$ ${n.toFixed(2).replace('.', ',')}`;
}

export default function TournamentDetailModal() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { tournamentId } = route.params;
  const user = useAuthStore((s) => s.user);

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refereeCode, setRefereeCode] = useState<string | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const [referees, setReferees] = useState<any[]>([]);
  const [refereeEmail, setRefereeEmail] = useState('');
  const [addingReferee, setAddingReferee] = useState(false);
  const [bracketType, setBracketType] = useState<BracketType>(BracketType.SINGLE_ELIMINATION);
  const [generatingBracket, setGeneratingBracket] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      Promise.all([
        tournamentService.findOne(tournamentId),
        registrationService.listMine().catch(() => []),
        tournamentService.getReferees(tournamentId).catch(() => []),
      ]).then(([t, regs, refs]) => {
        setTournament(t);
        setAlreadyRegistered(regs.some((r: any) => r.tournamentId === tournamentId));
        setReferees(refs as any[]);
        if (t.refereeCode) setRefereeCode(t.refereeCode);
      }).catch(() => {})
      .finally(() => {
        setLoading(false);
      });
    }, [tournamentId]),
  );

  const handleAddReferee = async () => {
    if (!refereeEmail.trim()) return;
    setAddingReferee(true);
    try {
      const newRef = await tournamentService.addReferee(tournamentId, refereeEmail.trim());
      setReferees((prev) => [...prev, newRef]);
      setRefereeEmail('');
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'Não foi possível adicionar arbitro.';
      Alert.alert('Erro', typeof msg === 'string' ? msg : 'Não foi possível adicionar arbitro.');
    } finally {
      setAddingReferee(false);
    }
  };

  const handleRemoveReferee = async (refereeId: string) => {
    try {
      await tournamentService.removeReferee(tournamentId, refereeId);
      setReferees((prev) => prev.filter((r) => r.id !== refereeId));
    } catch {}
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingRoot} edges={['top']}>
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  if (!tournament) {
    return (
      <SafeAreaView style={styles.loadingRoot} edges={['top']}>
        <Text style={styles.errorText}>Torneio não encontrado</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const stage = tournament.stages?.[0];
  const category = tournament.categories?.[0];
  const regCount =
    (tournament as any)._count?.registrations ??
    (tournament as any).registrationCount ??
    (tournament as any).registrations?.length ??
    0;
  const maxTeams = stage?.maxTeams ?? 0;
  const remaining = maxTeams > 0 ? maxTeams - regCount : null;
  const isOwner = tournament.ownerId === user?.id;
  const canRegister = ['REGISTRATION_OPEN', 'PUBLISHED'].includes(tournament.status) && !isOwner && !alreadyRegistered;
  const canViewBrackets = ['BRACKET_GENERATED', 'IN_PROGRESS'].includes(tournament.status);
  const canStart = isOwner && tournament.status === 'BRACKET_GENERATED';
  const canGenerate = isOwner && ['REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'PUBLISHED'].includes(tournament.status) && regCount >= 2;
  const canPublish = isOwner && tournament.status === 'DRAFT';
  const canEdit = isOwner && ['DRAFT', 'PUBLISHED'].includes(tournament.status);
  const canDelete = isOwner && !['IN_PROGRESS', 'FINISHED', 'CANCELLED'].includes(tournament.status);

  const handlePublish = async () => {
    console.log('[PUBLISH] Tournament data:', JSON.stringify({
      id: tournament?.id,
      name: tournament?.name,
      status: tournament?.status,
      stagesCount: tournament?.stages?.length ?? 0,
      categoriesCount: tournament?.categories?.length ?? 0,
      stages: tournament?.stages?.map((s: any) => ({
        date: s.date,
        city: s.city,
        street: s.street,
        address: s.address,
        maxTeams: s.maxTeams,
      })),
      categories: tournament?.categories?.map((c: any) => ({
        type: c.type,
        format: c.format,
        modality: c.modality,
      })),
    }, null, 2));
    try {
      await tournamentService.publish(tournamentId);
      const updated = await tournamentService.findOne(tournamentId);
      setTournament(updated);
      Alert.alert('Publicado!', 'Torneio publicado com sucesso.');
    } catch (e: any) {
      console.error('[PUBLISH ERROR] Response:', JSON.stringify(e?.response?.data, null, 2));
      console.error('[PUBLISH ERROR] Status:', e?.response?.status);
      const msg = e?.response?.data?.message ?? 'Erro ao publicar';
      Alert.alert('Erro', typeof msg === 'string' ? msg : 'Erro ao publicar');
    }
  };

  const handleCancel = () => {
    Alert.alert('Excluir torneio?', 'Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await tournamentService.cancel(tournamentId);
            navigation.goBack();
          } catch (e: any) {
            const msg = e?.response?.data?.message ?? 'Erro ao excluir';
            Alert.alert('Erro', typeof msg === 'string' ? msg : 'Erro ao excluir');
          }
        },
      },
    ]);
  };

  const handleGenerateBracket = async () => {
    const category = tournament?.categories?.[0];
    if (!category) { Alert.alert('Erro', 'Nenhuma categoria encontrada.'); return; }
    Alert.alert(
      'Gerar chaveamento?',
      `Tipo: ${BRACKET_TYPE_OPTIONS.find((b) => b.key === bracketType)?.label}\nCategoria: ${TYPE_LABELS[category.type] ?? category.type} · ${FORMAT_LABELS[category.format] ?? category.format}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Gerar',
          onPress: async () => {
            setGeneratingBracket(true);
            try {
              await tournamentService.generateBracket(tournamentId, { categoryId: category.id, type: bracketType });
              const updated = await tournamentService.findOne(tournamentId);
              setTournament(updated);
              Alert.alert('Sucesso', 'Chaveamento gerado!');
            } catch (e: any) {
              const raw = e?.response?.data?.message;
              const code = e?.response?.data?.code;
              const isGeneric = typeof raw !== 'string' || raw === 'Bad Request Exception';
              const msg = isGeneric ? (code ?? 'Erro ao gerar chaveamento') : raw;
              Alert.alert('Erro', typeof msg === 'string' ? msg : 'Erro ao gerar chaveamento');
            } finally {
              setGeneratingBracket(false);
            }
          },
        },
      ],
    );
  };

  const handleGenerateCode = async () => {
    if (codeLoading) return;
    setCodeLoading(true);
    try {
      const result = await tournamentService.generateRefereeCode(tournamentId);
      setRefereeCode(result.code);
    } catch {
      Alert.alert('Erro', 'Não foi possível gerar o código.');
    } finally {
      setCodeLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="close" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Status badge */}
        <View style={[styles.statusBadge, { backgroundColor: (STATUS_COLORS[tournament.status] ?? '#888') + '18' }]}>
          <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[tournament.status] ?? '#888' }]} />
          <Text style={[styles.statusText, { color: STATUS_COLORS[tournament.status] ?? '#888' }]}>
            {STATUS_LABELS[tournament.status] ?? tournament.status}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{tournament.name}</Text>
        {tournament.description && <Text style={styles.desc}>{tournament.description}</Text>}

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={18} color={colors.primaryGlow} />
            <Text style={styles.statVal}>{regCount}</Text>
            <Text style={styles.statLabel}>INSCRITOS</Text>
          </View>
          {remaining !== null && (
            <View style={styles.statItem}>
              <Ionicons name="meter-outline" size={18} color={colors.primaryGlow} />
              <Text style={styles.statVal}>{remaining}</Text>
              <Text style={styles.statLabel}>VAGAS</Text>
            </View>
          )}
          {category && (
            <View style={styles.statItem}>
              <Ionicons name="pricetag-outline" size={18} color={colors.primaryGlow} />
              <Text style={[styles.statVal, { fontSize: 14 }]}>{formatBRL(category.registrationPrice ?? category.price)}</Text>
              <Text style={styles.statLabel}>INSCRIÇÃO</Text>
            </View>
          )}
        </View>

        {/* Stage info */}
        {stage && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LOCAL E DATA</Text>
            <View style={styles.infoCard}>
              {stage.date && (
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={18} color={colors.primaryGlow} />
                  <Text style={styles.infoText}>
                    {new Date(stage.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    {stage.startTime ? ` às ${new Date(stage.startTime).toISOString().slice(11, 16)}` : ''}
                  </Text>
                </View>
              )}
              {(stage.street || stage.city) && (
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={18} color={colors.primaryGlow} />
                  <Text style={styles.infoText}>
                    {[stage.street, stage.number].filter(Boolean).join(', ')}{stage.neighborhood ? `, ${stage.neighborhood}` : ''}{stage.city ? ` — ${stage.city}` : ''}{stage.state ? `/${stage.state}` : ''}
                  </Text>
                </View>
              )}
              {stage.maxTeams && (
                <View style={styles.infoRow}>
                  <Ionicons name="trophy-outline" size={18} color={colors.primaryGlow} />
                  <Text style={styles.infoText}>Máximo {stage.maxTeams} equipes</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Categories */}
        {tournament.categories && tournament.categories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CATEGORIAS</Text>
            {tournament.categories.map((cat) => (
              <View key={cat.id} style={styles.catCard}>
                <View style={styles.catTags}>
                  <View style={styles.catTag}>
                    <Text style={styles.catTagText}>{TYPE_LABELS[cat.type] ?? cat.type}</Text>
                  </View>
                  <View style={styles.catTag}>
                    <Text style={styles.catTagText}>{FORMAT_LABELS[cat.format] ?? cat.format}</Text>
                  </View>
                  <View style={styles.catTag}>
                    <Text style={styles.catTagText}>{MODALITY_LABELS[cat.modality] ?? cat.modality}</Text>
                  </View>
                </View>
                <Text style={styles.catPrice}>{formatBRL(cat.registrationPrice ?? (cat as any).price)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Referees (organizer manages) */}
        {isOwner && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ÁRBITROS</Text>

            {/* Add referee */}
            <View style={styles.refAddRow}>
              <TextInput
                style={styles.refInput}
                value={refereeEmail}
                onChangeText={setRefereeEmail}
                placeholder="Email do arbitro"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
              <TouchableOpacity
                style={styles.refAddBtn}
                onPress={handleAddReferee}
                disabled={addingReferee || !refereeEmail.trim()}
                activeOpacity={0.7}
              >
                {addingReferee ? (
                  <ActivityIndicator size="small" color={colors.primaryGlow} />
                ) : (
                  <Ionicons name="add-circle-outline" size={24} color={colors.primaryGlow} />
                )}
              </TouchableOpacity>
            </View>

            {/* Referee list */}
            {referees.length > 0 ? (
              referees.map((ref) => (
                <View key={ref.id} style={styles.refCard}>
                  <View style={styles.refAvatar}>
                    <Text style={styles.refAvatarText}>
                      {(ref.user?.name ?? '?').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.refInfo}>
                    <Text style={styles.refName}>{ref.user?.name}</Text>
                    <Text style={styles.refEmail}>{ref.user?.email}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveReferee(ref.id)} activeOpacity={0.7}>
                    <Ionicons name="close-circle-outline" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.refEmpty}>Nenhum arbitro adicionado</Text>
            )}
          </View>
        )}

        {/* Referee Code — organizer generates, shares with anyone */}
        {isOwner && ['BRACKET_GENERATED', 'IN_PROGRESS'].includes(tournament.status) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CÓDIGO DE ACESSO</Text>
            <View style={styles.codeSection}>
              <Text style={styles.codeDesc}>
                Gere um código e compartilhe. Quem tiver o código pode entrar como arbitro.
              </Text>
              {refereeCode ? (
                <View style={styles.codeCard}>
                  <Text style={styles.codeLabel}>CÓDIGO</Text>
                  <Text style={styles.codeValue}>{refereeCode}</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.codeGenBtn}
                  onPress={handleGenerateCode}
                  disabled={codeLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[colors.primary, colors.primaryGlow]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.codeGenGradient}
                  >
                    {codeLoading ? (
                      <ActivityIndicator color={colors.text} />
                    ) : (
                      <>
                        <Ionicons name="key-outline" size={20} color={colors.text} />
                        <Text style={styles.codeGenText}>GERAR CÓDIGO</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Sponsors */}
        {tournament.sponsors && tournament.sponsors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PATROCINADORES</Text>
            <View style={styles.sponsorsRow}>
              {tournament.sponsors.map((s) => (
                <View key={s.id} style={styles.sponsorChip}>
                  <Text style={styles.sponsorText}>{s.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bracket generation (organizer) */}
        {canGenerate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CHAVEAMENTO</Text>
            <Text style={styles.bracketDesc}>Selecione o tipo de chaveamento para gerar as chaves do torneio.</Text>
            <View style={styles.bracketOptions}>
              {BRACKET_TYPE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.bracketOption, bracketType === opt.key && styles.bracketOptionActive]}
                  onPress={() => setBracketType(opt.key)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={opt.icon as any} size={20} color={bracketType === opt.key ? colors.primaryGlow : colors.textMuted} />
                  <Text style={[styles.bracketOptionText, bracketType === opt.key && styles.bracketOptionTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={handleGenerateBracket}
              disabled={generatingBracket}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryGlow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaGradient}
              >
                {generatingBracket ? (
                  <ActivityIndicator color={colors.text} />
                ) : (
                  <>
                    <Ionicons name="git-branch-outline" size={20} color={colors.text} />
                    <Text style={styles.ctaText}>GERAR CHAVES</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actionsSection}>
          {canPublish && (
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={handlePublish}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryGlow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaGradient}
              >
                <Ionicons name="rocket-outline" size={20} color={colors.text} />
                <Text style={styles.ctaText}>PUBLICAR</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          {canEdit && (
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={() => navigation.navigate('CreateTournament', { tournamentId })}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(109,46,192,0.3)', 'rgba(157,115,230,0.3)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaGradient}
              >
                <Ionicons name="create-outline" size={20} color={colors.text} />
                <Text style={styles.ctaText}>EDITAR</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          {canDelete && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={18} color={colors.error} />
              <Text style={styles.deleteText}>EXCLUIR TORNEIO</Text>
            </TouchableOpacity>
          )}
          {alreadyRegistered && (
            <View style={styles.registeredBadge}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.registeredText}>VOCÊ JÁ ESTÁ INSCRITO</Text>
            </View>
          )}
          {canRegister && (
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={() => navigation.navigate('RegistrationTeamSelect', { tournamentId })}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryGlow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaGradient}
              >
                <Ionicons name="person-add-outline" size={20} color={colors.text} />
                <Text style={styles.ctaText}>INSCREVER TIME</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          {canViewBrackets && !canRegister && !canStart && (
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={() => navigation.navigate('BracketView', { tournamentId })}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryGlow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaGradient}
              >
                <Ionicons name="git-branch-outline" size={20} color={colors.text} />
                <Text style={styles.ctaText}>VER CHAVES</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          {canStart && (
            <View style={{ gap: spacing.md }}>
              <TouchableOpacity
                style={styles.ctaBtn}
                onPress={async () => {
                  await tournamentService.startTournament(tournamentId);
                  const updated = await tournamentService.findOne(tournamentId);
                  setTournament(updated);
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryGlow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.ctaGradient}
                >
                  <Ionicons name="play" size={20} color={colors.text} />
                  <Text style={styles.ctaText}>INICIAR TORNEIO</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ctaBtn}
                onPress={() => navigation.navigate('BracketView', { tournamentId })}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(109,46,192,0.3)', 'rgba(157,115,230,0.3)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.ctaGradient}
                >
                  <Ionicons name="git-branch-outline" size={20} color={colors.text} />
                  <Text style={styles.ctaText}>VER CHAVES</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  loadingRoot: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: colors.textMuted, fontSize: 16, fontFamily: fonts.text.regular },
  backLink: { color: colors.primaryGlow, fontSize: 14, fontFamily: fonts.text.semiBold, marginTop: spacing.md },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 40 },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, letterSpacing: 1.5, fontFamily: fonts.text.semiBold },

  title: {
    fontFamily: fonts.title.display,
    fontSize: 34,
    lineHeight: 36,
    color: colors.text,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  desc: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    fontFamily: fonts.text.regular,
    marginBottom: spacing.xl,
  },

  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  statVal: { fontFamily: fonts.title.display, fontSize: 20, color: colors.text, letterSpacing: 1 },
  statLabel: { fontSize: 9, letterSpacing: 2, color: colors.textMuted, fontFamily: fonts.text.regular },

  section: { marginBottom: spacing.xxl },
  sectionTitle: { fontFamily: fonts.title.display, fontSize: 18, color: colors.text, letterSpacing: 2, marginBottom: spacing.lg },

  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    padding: spacing.lg,
    gap: spacing.md,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  infoText: { fontSize: 14, color: colors.textSecondary, fontFamily: fonts.text.regular, flex: 1 },

  catCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  catTags: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  catTag: {
    backgroundColor: 'rgba(109,46,192,0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 8,
  },
  catTagText: { fontSize: 11, color: colors.primaryGlow, fontFamily: fonts.text.semiBold, letterSpacing: 1 },
  catPrice: { fontFamily: fonts.title.display, fontSize: 22, color: colors.text, letterSpacing: 1 },
  catMembers: { fontSize: 12, color: colors.textMuted, fontFamily: fonts.text.regular, marginTop: 4 },

  sponsorsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  sponsorChip: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sponsorText: { fontSize: 12, color: colors.textSecondary, fontFamily: fonts.text.medium },

  // Referee management
  refAddRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  refInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    fontFamily: fonts.text.regular,
    fontSize: 14,
  },
  refAddBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  refCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  refAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(109,46,192,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refAvatarText: {
    fontFamily: fonts.title.display,
    fontSize: 16,
    color: colors.primaryGlow,
  },
  refInfo: { flex: 1 },
  refName: { fontSize: 14, color: colors.text, fontFamily: fonts.text.semiBold },
  refEmail: { fontSize: 12, color: colors.textMuted, fontFamily: fonts.text.regular },
  refEmpty: { fontSize: 13, color: colors.textMuted, fontFamily: fonts.text.regular, textAlign: 'center', paddingVertical: spacing.md },

  // Referee code section
  codeSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    padding: spacing.lg,
    gap: spacing.md,
  },
  codeDesc: { fontSize: 13, color: colors.textMuted, fontFamily: fonts.text.regular, lineHeight: 18 },
  codeGenBtn: { borderRadius: 14, overflow: 'hidden' },
  codeGenGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, paddingVertical: spacing.lg,
  },
  codeGenText: { fontSize: 14, letterSpacing: 2, color: colors.text, fontFamily: fonts.text.semiBold },
  codeCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(109,46,192,0.06)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(109,46,192,0.15)',
    padding: spacing.xl,
  },
  codeLabel: { fontSize: 9, fontFamily: fonts.text.semiBold, color: colors.textMuted, letterSpacing: 2, marginBottom: spacing.sm },
  codeValue: { fontFamily: fonts.title.display, fontSize: 40, color: colors.primaryGlow, letterSpacing: 8 },

  progressBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryGlow,
  },
  progressLabel: { fontSize: 12, color: colors.textMuted, fontFamily: fonts.text.regular, marginTop: spacing.sm },

  actionsSection: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  ctaBtn: { borderRadius: 14, overflow: 'hidden' },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  ctaText: { fontSize: 14, letterSpacing: 2, color: colors.text, fontFamily: fonts.text.semiBold },

  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    backgroundColor: 'rgba(76,175,80,0.1)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.2)',
  },
  registeredText: {
    fontSize: 14,
    letterSpacing: 2,
    color: colors.success,
    fontFamily: fonts.text.semiBold,
  },

  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: 14,
    backgroundColor: 'rgba(244,67,54,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(244,67,54,0.15)',
  },
  deleteText: {
    fontSize: 14,
    letterSpacing: 2,
    color: colors.error,
    fontFamily: fonts.text.semiBold,
  },

  // Bracket generation
  bracketDesc: { fontSize: 13, color: colors.textMuted, fontFamily: fonts.text.regular, marginBottom: spacing.lg, lineHeight: 18 },
  bracketOptions: { gap: spacing.sm, marginBottom: spacing.lg },
  bracketOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  bracketOptionActive: {
    backgroundColor: 'rgba(109,46,192,0.08)',
    borderColor: 'rgba(157,115,230,0.3)',
  },
  bracketOptionText: { fontSize: 13, fontFamily: fonts.text.semiBold, color: colors.textMuted },
  bracketOptionTextActive: { color: colors.primaryGlow },
});
