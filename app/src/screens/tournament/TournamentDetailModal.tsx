import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { tournamentService } from '../../services/tournament';
import { registrationService } from '../../services/registration';
import { useAuthStore } from '../../stores/authStore';
import { useDialogStore } from '../../stores/dialogStore';
import { useTournamentSocket } from '../../hooks/useTournamentSocket';
import type { TournamentStackParamList } from '../../navigation/types';
import type { Tournament } from '../../types/tournament';
import type { BracketResponse, Match, RankingResponse } from '../../types/match';
import { BracketType } from '../../types/tournament';
import StatusBadge from '../../components/StatusBadge';
import ChevronButton from '../../components/ChevronButton';
import TabBar from '../../components/TabBar';

type Nav = NativeStackNavigationProp<TournamentStackParamList, 'TournamentDetail'>;
type Route = RouteProp<TournamentStackParamList, 'TournamentDetail'>;
type Tab = 'overview' | 'categories' | 'bracket' | 'sponsors';

const MODALITY_LABELS: Record<string, string> = { BEACH: 'Praia', COURT: 'Quadra' };
const FORMAT_LABELS: Record<string, string> = { PAIR: 'Dupla', QUARTET: 'Quarteto', SEXTET: 'Sexteto' };
const TYPE_LABELS: Record<string, string> = { MASC: 'Masculino', FEM: 'Feminino', MISTO: 'Misto', MALE: 'Masculino', FEMALE: 'Feminino', MIX: 'Misto' };

const BRACKET_TYPE_OPTIONS: { key: BracketType; label: string; icon: string }[] = [
  { key: BracketType.SINGLE_ELIMINATION, label: 'Eliminatória Simples', icon: 'git-branch-outline' },
  { key: BracketType.DOUBLE_ELIMINATION, label: 'Eliminatória Dupla', icon: 'git-merge-outline' },
  { key: BracketType.ROUND_ROBIN, label: 'Todos contra Todos', icon: 'sync-outline' },
  { key: BracketType.GROUPS_THEN_ELIMINATION, label: 'Fases + Eliminatória', icon: 'grid-outline' },
];

const BRACKET_INFO: Record<BracketType, { title: string; description: string; example: string }> = {
  [BracketType.SINGLE_ELIMINATION]: {
    title: 'Eliminatória Simples (Mata-mata)',
    description: 'Cada partida elimina o perdedor. Quem perde, está fora do torneio. O vencedor de cada jogo avança para a próxima rodada até restar apenas o campeão.',
    example: 'Exemplo com 8 times:\n\n  Oitavas    Quartas    Semifinal    Final\n  A vs B ─┐\n          ├─ ??? ─┐\n  C vs D ─┘       │\n                  ├─ ??? ─┐\n  E vs F ─┐       │       │\n          ├─ ??? ─┘       │\n  G vs H ─┘               │\n                          ├─ 🏆\n  (outro lado)            │\n                          ─┘',
  },
  [BracketType.DOUBLE_ELIMINATION]: {
    title: 'Eliminatória Dupla',
    description: 'Cada time tem duas chances. A primeira derrota envia o time para a chave de repescagem (losers bracket). Uma segunda derrota elimina definitivamente. O vencedor da repescagem enfrenta o vencedor da chave principal na grande final.',
    example: 'Exemplo com 4 times:\n\n  Chave Principal          Repescagem\n  A vs B ─┐\n          ├─ Vencedor ──┐     A vs B (perdedores)\n  C vs D ─┘             │     e C vs D\n                          │         │\n                    Semifinal   ──┤\n                          │         │\n                        Final ◀────┘\n                        (Campeão)',
  },
  [BracketType.ROUND_ROBIN]: {
    title: 'Todos contra Todos (Pontos Corridos)',
    description: 'Cada time joga contra todos os outros times do grupo. Vitória soma pontos, derrota não. Ao final de todas as rodadas, a classificação define o campeão ou quem avança para a próxima fase.',
    example: 'Exemplo com 4 times:\n\n  Rodada 1: A vs B  |  C vs D\n  Rodada 2: A vs C  |  B vs D\n  Rodada 3: A vs D  |  B vs C\n\n  Classificação final:\n  1º Time A  3V  6pts  🏆\n  2º Time C  2V  4pts\n  3º Time B  1V  2pts\n  4º Time D  0V  0pts',
  },
  [BracketType.GROUPS_THEN_ELIMINATION]: {
    title: 'Fase de Grupos + Eliminatória',
    description: 'Os times são divididos em grupos. Dentro de cada grupo, todos jogam contra todos. Os melhores de cada grupo avançam para uma fase eliminatória (mata-mata) que define o campeão.',
    example: 'Exemplo com 8 times:\n\n  Grupo A          Grupo B\n  ─────────        ────────\n  Time 1  2V  ✅   Time 5  2V  ✅\n  Time 2  1V  ✅   Time 6  1V  ✅\n  Team 3  1V       Team 7  1V\n  Team 4  0V       Team 8  0V\n\n  Eliminatória:\n  1º A vs 2º B ─┐\n                 ├─ Final 🏆\n  1º B vs 2º A ─┘',
  },
};

const ROUND_LABELS: Record<number, string> = {
  1: 'Final',
  2: 'Semifinal',
  3: 'Quartas',
  4: 'Oitavas',
};

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
  const dialog = useDialogStore();
  const insets = useSafeAreaInsets();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('overview');
  const [refereeCode, setRefereeCode] = useState<string | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const [referees, setReferees] = useState<any[]>([]);
  const [refereeEmail, setRefereeEmail] = useState('');
  const [addingReferee, setAddingReferee] = useState(false);
  const [bracketType, setBracketType] = useState<BracketType>(BracketType.SINGLE_ELIMINATION);
  const [bracketInfoVisible, setBracketInfoVisible] = useState<BracketType | null>(null);
  const [generatingBracket, setGeneratingBracket] = useState(false);
  const [bracketData, setBracketData] = useState<BracketResponse[] | null>(null);
  const [rankingData, setRankingData] = useState<RankingResponse | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [t, regs, refs] = await Promise.all([
        tournamentService.findOne(tournamentId),
        registrationService.listMine().catch(() => []),
        tournamentService.getReferees(tournamentId).catch(() => []),
      ]);
      setTournament(t);
      setAlreadyRegistered(regs.some((r: any) => r.tournamentId === tournamentId));
      setReferees(refs as any[]);
      if (t.refereeCode) setRefereeCode(t.refereeCode);
      if (['BRACKET_GENERATED', 'IN_PROGRESS'].includes(t.status)) {
        tournamentService.getBracket(tournamentId).then(setBracketData).catch(() => {});
        tournamentService.getRanking(tournamentId).then(setRankingData).catch(() => {});
      }
    } catch {}
  }, [tournamentId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData().finally(() => setLoading(false));
    }, [loadData]),
  );

  // Real-time socket updates for bracket/matches
  useTournamentSocket(tournamentId, loadData);

  const handleAddReferee = async () => {
    if (!refereeEmail.trim()) return;
    setAddingReferee(true);
    try {
      const newRef = await tournamentService.addReferee(tournamentId, refereeEmail.trim());
      setReferees((prev) => [...prev, newRef]);
      setRefereeEmail('');
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'Não foi possível adicionar arbitro.';
      dialog.error(typeof msg === 'string' ? msg : 'Não foi possível adicionar arbitro.');
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
      <View style={styles.loadingRoot}>
        <View style={{ height: insets.top }} />
        <ActivityIndicator color={colors.primary} size="large" style={{ flex: 1 }} />
      </View>
    );
  }

  if (!tournament) {
    return (
      <View style={styles.loadingRoot}>
        <View style={{ height: insets.top }} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.textMuted, fontSize: 16, fontFamily: fonts.text.regular }}>Torneio não encontrado</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: spacing.md }}>
            <Text style={{ color: colors.primary, fontFamily: fonts.text.semiBold }}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const stage = tournament.stages?.[0];
  const category = tournament.categories?.[0];
  const regCount = (tournament as any)._count?.registrations ?? (tournament as any).registrationCount ?? 0;
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
  const coverUrl = (tournament as any).coverUrl;
  const owner = (tournament as any).owner;
  const firstCatModality = tournament.categories?.[0]?.modality;

  const handlePublish = async () => {
    try {
      await tournamentService.publish(tournamentId);
      const updated = await tournamentService.findOne(tournamentId);
      setTournament(updated);
      dialog.success('Torneio publicado com sucesso.');
    } catch (e: any) {
      dialog.error(e?.response?.data?.message ?? 'Erro ao publicar');
    }
  };

  const handleCancel = () => {
    dialog.confirm({
      title: 'Excluir torneio?',
      message: 'Essa ação não pode ser desfeita.',
      confirmText: 'Excluir',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try { await tournamentService.cancel(tournamentId); navigation.goBack(); }
        catch (e: any) { dialog.error(e?.response?.data?.message ?? 'Erro ao excluir'); }
      },
    });
  };

  const handleGenerateBracket = async () => {
    const cat = tournament?.categories?.[0];
    if (!cat) { dialog.error('Nenhuma categoria encontrada.'); return; }
    dialog.confirm({
      title: 'Gerar chaveamento?',
      message: `Tipo: ${BRACKET_TYPE_OPTIONS.find((b) => b.key === bracketType)?.label}`,
      confirmText: 'Gerar',
      onConfirm: async () => {
        setGeneratingBracket(true);
        try {
          await tournamentService.generateBracket(tournamentId, { categoryId: cat.id, type: bracketType });
          const updated = await tournamentService.findOne(tournamentId);
          setTournament(updated);
          const bracket = await tournamentService.getBracket(tournamentId).catch(() => null);
          if (bracket) setBracketData(bracket);
          dialog.success('Chaveamento gerado!');
        } catch (e: any) { dialog.error(e?.response?.data?.message ?? 'Erro ao gerar chaveamento'); }
        finally { setGeneratingBracket(false); }
      },
    });
  };

  const handleGenerateCode = async () => {
    if (codeLoading) return;
    setCodeLoading(true);
    try {
      const result = await tournamentService.generateRefereeCode(tournamentId);
      setRefereeCode(result.code);
    } catch { dialog.error('Não foi possível gerar o código.'); }
    finally { setCodeLoading(false); }
  };

  return (
    <View style={styles.root}>
      {/* ─── Cover Header ─── */}
      <View style={styles.cover}>
        {coverUrl ? (
          <Image source={{ uri: coverUrl }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        ) : (
          <LinearGradient colors={[colors.primary, colors.primaryDark]} style={StyleSheet.absoluteFillObject} />
        )}
        <View style={styles.coverGradient} />

        {/* Top bar */}
        <View style={[styles.coverTop, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <StatusBadge status={tournament.status} />
        </View>

        {/* Bottom info */}
        <View style={styles.coverBottom}>
          <Text style={styles.coverTitle} numberOfLines={2}>{tournament.name}</Text>
          <View style={styles.coverMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.8)" />
              <Text style={styles.metaText}>
                {stage?.date ? new Date(stage.date).toLocaleDateString('pt-BR') : ''}
              </Text>
            </View>
            {(stage?.city || tournament.city) && (
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.8)" />
                <Text style={styles.metaText}>{stage?.city ?? tournament.city ?? ''}</Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={13} color="rgba(255,255,255,0.8)" />
              <Text style={styles.metaText}>{regCount}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ─── Stats Grid ─── */}
      <View style={styles.statsWrap}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{MODALITY_LABELS[firstCatModality ?? ''] ?? '—'}</Text>
            <Text style={styles.statLabel}>Modalidade</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{tournament.eventType === 'CIRCUIT' ? 'Circuito' : 'Único'}</Text>
            <Text style={styles.statLabel}>Formato</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{String(tournament.categories?.length ?? 0)}</Text>
            <Text style={styles.statLabel}>Categorias</Text>
          </View>
        </View>
      </View>

      {/* ─── Tabs ─── */}
      <View style={styles.tabWrap}>
        <TabBar
          tabs={[
            { key: 'overview', label: 'Visão geral' },
            { key: 'categories', label: 'Categorias' },
            { key: 'bracket', label: 'Chaves' },
            { key: 'sponsors', label: 'Patroc.' },
          ]}
          activeTab={tab}
          onTabChange={setTab}
        />
      </View>

      {/* ─── Tab Content ─── */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {tab === 'overview' && (
            <>
              {/* Description */}
              {tournament.description && (
                <Text style={styles.description}>{tournament.description}</Text>
              )}

              {/* Stages */}
              {(tournament.stages?.length ?? 0) > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    {(tournament.stages?.length ?? 0) === 1 ? 'ETAPA ÚNICA' : 'ETAPAS'}
                  </Text>
                  <View style={styles.stagesCard}>
                    {tournament.stages!.map((s, i) => {
                      const isSingle = tournament.stages!.length === 1;
                      const d = new Date(s.date);
                      const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
                      const startD = (s as any).startTime ? new Date((s as any).startTime) : null;
                      const timeStr = startD ? startD.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : null;
                      return (
                      <View key={s.id} style={[styles.stageRow, i < tournament.stages!.length - 1 && styles.stageBorder]}>
                        {!isSingle && (
                          <View style={styles.stageNum}>
                            <Text style={styles.stageNumText}>{i + 1}</Text>
                          </View>
                        )}
                        <View style={{ flex: 1 }}>
                          <Text style={styles.stageName}>
                            {isSingle ? ((s as any).name ?? tournament.name) : ((s as any).name ?? `Etapa ${i + 1}`)}
                          </Text>
                          <Text style={styles.stageMeta}>
                            {dateStr}{timeStr ? ` · ${timeStr}` : ''}{s.city ? ` · ${s.city}` : ''}{s.state ? `/${s.state}` : ''}
                          </Text>
                        </View>
                      </View>
                    );
                    })}
                  </View>
                </View>
              )}

              {/* Organizer */}
              {owner && (
                <View style={styles.organizerCard}>
                  <LinearGradient colors={[colors.primary, colors.primaryDark]} style={StyleSheet.absoluteFillObject} />
                  <Text style={styles.organizerTitle}>ORGANIZADOR</Text>
                  <View style={styles.organizerRow}>
                    <View style={styles.organizerAvatar}>
                      <Text style={styles.organizerAvatarText}>{(owner.name ?? '?')[0].toUpperCase()}</Text>
                    </View>
                    <View>
                      <Text style={styles.organizerName}>{owner.name}</Text>
                      <Text style={styles.organizerEmail}>{owner.email}</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Organizer-only sections */}
              {isOwner && renderOrganizerSections()}
            </>
          )}

          {tab === 'categories' && (
            tournament.categories && tournament.categories.length > 0 ? (
              <View style={styles.gapMd}>
                {tournament.categories.map((cat) => (
                  <View key={cat.id} style={styles.catCard}>
                    <View style={styles.catHeader}>
                      <View>
                        <Text style={styles.catTitle}>
                          {TYPE_LABELS[cat.type] ?? cat.type} · {FORMAT_LABELS[cat.format] ?? cat.format} · {MODALITY_LABELS[cat.modality] ?? cat.modality}
                        </Text>
                        <Text style={styles.catMeta}>
                          {(cat as any).bracketType ? String((cat as any).bracketType).replace(/_/g, ' ') : ''}
                        </Text>
                      </View>
                      <View style={styles.catRight}>
                        <View style={styles.catRegBadge}>
                          <Text style={styles.catRegText}>{(cat as any).registrationsCount ?? (cat as any)._count?.registrations ?? 0} insc.</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.catDetails}>
                      <Text style={styles.catDetailText}>Melhor de {cat.bestOfSets}</Text>
                      <Text style={styles.catDetailText}>Tiebreak {cat.tiebreakScore}</Text>
                      <Text style={[styles.catDetailText, (cat.registrationPrice ?? (cat as any).price) ? {} : { color: colors.success }]}>
                        {formatBRL(cat.registrationPrice ?? (cat as any).price)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>Sem categorias ainda.</Text>
            )
          )}

          {tab === 'bracket' && !canViewBrackets && (
            <Text style={styles.emptyText}>Chaveamento ainda não gerado.</Text>
          )}
          {tab === 'bracket' && canViewBrackets && (
            !bracketData ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 40 }} />
            ) : bracketData.length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma chave encontrada.</Text>
            ) : (
              <View style={styles.inlineBracketWrap}>
                {bracketData.map((bracket) => {
                  if (bracket.type === 'ROUND_ROBIN') return renderRoundRobinBracket(bracket);
                  if (bracket.type === 'DOUBLE_ELIMINATION') return renderDoubleEliminationBracket(bracket);
                  if (bracket.type === 'GROUPS_THEN_ELIMINATION') return renderGroupsThenEliminationBracket(bracket);
                  return renderEliminationBracket(bracket);
                })}
              </View>
            )
          )}

          {tab === 'sponsors' && (
            tournament.sponsors && tournament.sponsors.length > 0 ? (
              <View style={styles.sponsorsGrid}>
                {tournament.sponsors.map((sp) => (
                  <View key={sp.id} style={styles.sponsorCard}>
                    <View style={styles.sponsorIcon}>
                      <Ionicons name="trophy-outline" size={24} color={colors.primary} />
                    </View>
                    <Text style={styles.sponsorName}>{sp.name}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>Nenhum patrocinador.</Text>
            )
          )}

          {/* Action buttons for organizer */}
          {isOwner && tab === 'overview' && (
            <View style={styles.actionsSection}>
              {canPublish && (
                <ChevronButton variant="primary" size="lg" fullWidth onPress={handlePublish} icon={<Ionicons name="rocket-outline" size={16} color="#FFFFFF" />}>PUBLICAR</ChevronButton>
              )}
              {canEdit && (
                <ChevronButton variant="ghost" size="lg" fullWidth onPress={() => navigation.navigate('CreateTournament', { tournamentId })} icon={<Ionicons name="create-outline" size={16} color={colors.primary} />}>EDITAR</ChevronButton>
              )}
              {canDelete && (
                <ChevronButton variant="danger" size="lg" fullWidth onPress={handleCancel} icon={<Ionicons name="trash-outline" size={16} color="#FFFFFF" />}>EXCLUIR TORNEIO</ChevronButton>
              )}
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ─── Bracket Info Modal ─── */}
      <Modal visible={bracketInfoVisible !== null} transparent animationType="fade" onRequestClose={() => setBracketInfoVisible(null)}>
        <TouchableOpacity style={styles.infoModalOverlay} activeOpacity={1} onPress={() => setBracketInfoVisible(null)}>
          <TouchableOpacity style={styles.infoModalContent} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            {bracketInfoVisible && (() => {
              const info = BRACKET_INFO[bracketInfoVisible];
              return (
                <>
                  <View style={styles.infoModalHeader}>
                    <Text style={styles.infoModalTitle}>{info.title}</Text>
                    <TouchableOpacity onPress={() => setBracketInfoVisible(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Ionicons name="close" size={22} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.infoModalDesc}>{info.description}</Text>
                    <View style={styles.infoModalExampleBox}>
                      <Text style={styles.infoModalExampleLabel}>EXEMPLO</Text>
                      <Text style={styles.infoModalExample}>{info.example}</Text>
                    </View>
                  </ScrollView>
                </>
              );
            })()}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ─── Fixed Bottom Action ─── */}
      <View style={[styles.fixedBottom, { paddingBottom: Math.max(insets.bottom, 12), gap: spacing.md }]}>
        {alreadyRegistered && !canRegister && (
          <View style={styles.registeredBadge}>
            <View style={styles.registeredDot}>
              <Text style={styles.registeredDotText}>✓</Text>
            </View>
            <View>
              <Text style={styles.registeredTitle}>VOCÊ ESTÁ INSCRITO</Text>
            </View>
          </View>
        )}
        {canRegister && (
          <ChevronButton variant="primary" size="lg" fullWidth onPress={() => navigation.navigate('RegistrationTeamSelect', { tournamentId })} icon={<Ionicons name="person-add-outline" size={16} color="#FFFFFF" />}>
            INSCREVER MEU TIME
          </ChevronButton>
        )}
        {canStart && (
          <View style={{ gap: spacing.md }}>
            <ChevronButton variant="primary" size="lg" fullWidth onPress={async () => {
              await tournamentService.startTournament(tournamentId);
              setTournament(await tournamentService.findOne(tournamentId));
            }} icon={<Ionicons name="play" size={16} color="#FFFFFF" />}>
              INICIAR TORNEIO
            </ChevronButton>
            <ChevronButton variant="ghost" size="lg" fullWidth onPress={() => navigation.navigate('BracketView', { tournamentId })} icon={<Ionicons name="git-branch-outline" size={16} color={colors.primary} />}>
              VER CHAVES
            </ChevronButton>
          </View>
        )}
        {canViewBrackets && !canStart && !canRegister && (
          <ChevronButton variant="primary" size="lg" fullWidth onPress={() => navigation.navigate('BracketView', { tournamentId })} icon={<Ionicons name="git-branch-outline" size={16} color="#FFFFFF" />}>
            ACOMPANHAR PARTIDAS
          </ChevronButton>
        )}
      </View>
    </View>
  );

  function renderOrganizerSections() {
    return (
      <>
        {/* Referees */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ÁRBITROS</Text>
          <View style={styles.refAddRow}>
            <View style={styles.refInputWrap}>
              <Ionicons name="mail-outline" size={16} color={colors.textPlaceholder} />
              <TextInput style={styles.refInput} value={refereeEmail} onChangeText={setRefereeEmail} placeholder="Email do arbitro" placeholderTextColor={colors.textPlaceholder} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" />
            </View>
            <TouchableOpacity style={styles.refAddBtn} onPress={handleAddReferee} disabled={addingReferee || !refereeEmail.trim()} activeOpacity={0.7}>
              {addingReferee ? <ActivityIndicator size="small" color={colors.primary} /> : <Ionicons name="add-circle-outline" size={24} color={colors.primary} />}
            </TouchableOpacity>
          </View>
          {referees.length > 0 ? referees.map((ref) => (
            <View key={ref.id} style={styles.refCard}>
              <View style={styles.refAvatar}><Text style={styles.refAvatarText}>{(ref.user?.name ?? '?').charAt(0).toUpperCase()}</Text></View>
              <View style={styles.refInfo}>
                <Text style={styles.refName}>{ref.user?.name}</Text>
                <Text style={styles.refEmail}>{ref.user?.email}</Text>
              </View>
              <TouchableOpacity onPress={() => handleRemoveReferee(ref.id)} activeOpacity={0.7}>
                <Ionicons name="close-circle-outline" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          )) : <Text style={styles.emptyText}>Nenhum arbitro adicionado</Text>}
        </View>

        {/* Referee Code */}
        {['BRACKET_GENERATED', 'IN_PROGRESS'].includes(tournament.status) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CÓDIGO DE ACESSO</Text>
            <View style={styles.codeSection}>
              <Text style={styles.codeDesc}>Gere um código e compartilhe com o árbitro para que ele possa apitar as partidas.</Text>
              {refereeCode ? (
                <View style={styles.codeCard}>
                  <Ionicons name="key-outline" size={24} color={colors.primary} />
                  <Text style={styles.codeLabel}>CÓDIGO DE ACESSO</Text>
                  <Text style={styles.codeValue}>{refereeCode}</Text>
                  <Text style={styles.codeHint}>Compartilhe este código com o árbitro para que ele possa apitar a partida.</Text>
                </View>
              ) : (
                <ChevronButton variant="ghost" size="lg" fullWidth onPress={handleGenerateCode} disabled={codeLoading} icon={codeLoading ? undefined : <Ionicons name="key-outline" size={16} color={colors.primary} />}>
                  {codeLoading ? 'GERANDO...' : 'GERAR CÓDIGO DE ACESSO'}
                </ChevronButton>
              )}
            </View>
          </View>
        )}

        {/* Bracket generation */}
        {canGenerate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CHAVEAMENTO</Text>
            <Text style={styles.bracketDesc}>Selecione o tipo de chaveamento.</Text>
            <View style={styles.bracketOptions}>
              {BRACKET_TYPE_OPTIONS.map((opt) => (
                <TouchableOpacity key={opt.key} style={[styles.bracketOption, bracketType === opt.key && styles.bracketOptionActive]} onPress={() => setBracketType(opt.key)} activeOpacity={0.7}>
                  <Ionicons name={opt.icon as any} size={20} color={bracketType === opt.key ? colors.primary : colors.textMuted} />
                  <Text style={[styles.bracketOptionText, bracketType === opt.key && styles.bracketOptionTextActive]}>{opt.label}</Text>
                  <TouchableOpacity style={styles.bracketInfoBtn} onPress={() => setBracketInfoVisible(opt.key)} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="information-circle-outline" size={20} color={bracketType === opt.key ? colors.primary : colors.textMuted} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
            <ChevronButton variant="primary" size="lg" fullWidth onPress={handleGenerateBracket} disabled={generatingBracket} icon={<Ionicons name="git-branch-outline" size={16} color="#FFFFFF" />}>
              {generatingBracket ? 'GERANDO...' : 'GERAR CHAVES'}
            </ChevronButton>
          </View>
        )}
      </>
    );
  }

  function renderMatchCard(match: Match) {
    const isTeamAWinner = match.winnerId === match.teamAId;
    const isTeamBWinner = match.winnerId === match.teamBId;
    return (
      <TouchableOpacity
        key={match.id}
        style={styles.bracketMatch}
        activeOpacity={0.7}
        onPress={() => {
          if (match.teamA && match.teamB) {
            navigation.navigate('LiveMatch', { matchId: match.id, tournamentId });
          }
        }}
      >
        <View style={[styles.bracketTeamRow, isTeamAWinner && styles.bracketWinnerRow]}>
          <Text style={[styles.bracketTeamName, isTeamAWinner && styles.bracketTeamNameWinner]} numberOfLines={1}>
            {match.teamA?.name ?? 'TBD'}
          </Text>
          <Text style={[styles.bracketScore, isTeamAWinner && styles.bracketScoreWinner]}>
            {match.status !== 'SCHEDULED' ? match.scoreTeamA : ''}
          </Text>
        </View>
        <View style={styles.bracketDivider} />
        <View style={[styles.bracketTeamRow, isTeamBWinner && styles.bracketWinnerRow]}>
          <Text style={[styles.bracketTeamName, isTeamBWinner && styles.bracketTeamNameWinner]} numberOfLines={1}>
            {match.teamB?.name ?? 'TBD'}
          </Text>
          <Text style={[styles.bracketScore, isTeamBWinner && styles.bracketScoreWinner]}>
            {match.status !== 'SCHEDULED' ? match.scoreTeamB : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  function renderEliminationBracket(bracket: BracketResponse) {
    const elimMatches = bracket.matches.filter((m) => m.group === null);
    if (elimMatches.length === 0) return null;
    const sorted = [...elimMatches].sort((a, b) => a.round - b.round || a.position - b.position);
    const maxRound = Math.max(...sorted.map((m) => m.round), 1);
    const rounds: Record<number, Match[]> = {};
    for (const m of sorted) {
      if (!rounds[m.round]) rounds[m.round] = [];
      rounds[m.round].push(m);
    }
    const sortedRounds = Object.entries(rounds).sort(([a], [b]) => Number(a) - Number(b));
    const catLabel = `${TYPE_LABELS[bracket.category.type] ?? bracket.category.type} · ${FORMAT_LABELS[bracket.category.format] ?? bracket.category.format}`;
    return (
      <View key={bracket.id} style={styles.rrSection}>
        {bracketData && bracketData.length > 1 && (
          <Text style={styles.bracketCatTitle}>{catLabel}</Text>
        )}
        {sortedRounds.map(([roundKey, roundMatches]) => {
          const roundNum = Number(roundKey);
          const fromFinal = maxRound - roundNum + 1;
          const label = ROUND_LABELS[fromFinal] ?? `Rodada ${roundNum}`;
          return (
            <View key={roundNum} style={styles.rrRoundSection}>
              <Text style={styles.rrRoundLabel}>{label}</Text>
              <View style={styles.rrMatches}>
                {roundMatches.sort((a, b) => a.position - b.position).map(renderMatchCard)}
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  function renderDoubleEliminationBracket(bracket: BracketResponse) {
    const catLabel = `${TYPE_LABELS[bracket.category.type] ?? bracket.category.type} · ${FORMAT_LABELS[bracket.category.format] ?? bracket.category.format}`;

    const winnersMatches = bracket.matches.filter((m) => m.group === 0 || m.group === null);
    const losersMatches = bracket.matches.filter((m) => m.group === 1);
    const grandFinal = bracket.matches.filter((m) => m.group === 2);

    const groupByRound = (matches: Match[]) => {
      const sorted = [...matches].sort((a, b) => a.round - b.round || a.position - b.position);
      const rounds: Record<number, Match[]> = {};
      for (const m of sorted) {
        if (!rounds[m.round]) rounds[m.round] = [];
        rounds[m.round].push(m);
      }
      return Object.entries(rounds).sort(([a], [b]) => Number(a) - Number(b));
    };

    const winnersRounds = groupByRound(winnersMatches);
    const losersRounds = groupByRound(losersMatches);

    const maxWinnersRound = winnersMatches.length > 0 ? Math.max(...winnersMatches.map((m) => m.round)) : 1;

    return (
      <View key={bracket.id} style={styles.rrSection}>
        {bracketData && bracketData.length > 1 && (
          <Text style={styles.bracketCatTitle}>{catLabel}</Text>
        )}

        {/* Winners Bracket */}
        <Text style={styles.deGroupTitle}>Chave Principal</Text>
        {winnersRounds.map(([roundKey, roundMatches]) => {
          const roundNum = Number(roundKey);
          const fromFinal = maxWinnersRound - roundNum + 1;
          const label = ROUND_LABELS[fromFinal] ?? `Rodada ${roundNum}`;
          return (
            <View key={`W${roundNum}`} style={styles.rrRoundSection}>
              <Text style={styles.rrRoundLabel}>{label}</Text>
              <View style={styles.rrMatches}>
                {roundMatches.sort((a, b) => a.position - b.position).map(renderMatchCard)}
              </View>
            </View>
          );
        })}

        {/* Losers Bracket */}
        {losersRounds.length > 0 && (
          <>
            <Text style={[styles.deGroupTitle, { marginTop: spacing.md }]}>Repescagem</Text>
            {losersRounds.map(([roundKey, roundMatches]) => {
              const roundNum = Number(roundKey);
              const label = `Rodada ${roundNum}`;
              return (
                <View key={`L${roundNum}`} style={styles.rrRoundSection}>
                  <Text style={styles.rrRoundLabel}>{label}</Text>
                  <View style={styles.rrMatches}>
                    {roundMatches.sort((a, b) => a.position - b.position).map(renderMatchCard)}
                  </View>
                </View>
              );
            })}
          </>
        )}

        {/* Grand Final */}
        {grandFinal.length > 0 && (
          <View style={styles.rrRoundSection}>
            <Text style={styles.rrRoundLabel}>Grande Final</Text>
            <View style={styles.rrMatches}>
              {grandFinal.map(renderMatchCard)}
            </View>
          </View>
        )}
      </View>
    );
  }

  function renderGroupsThenEliminationBracket(bracket: BracketResponse) {
    const catLabel = `${TYPE_LABELS[bracket.category.type] ?? bracket.category.type} · ${FORMAT_LABELS[bracket.category.format] ?? bracket.category.format}`;

    // Group matches: group >= 0 and round < 100
    const groupMatches = bracket.matches.filter((m) => m.group !== null && m.group !== undefined && (m.round ?? 0) < 100);
    // Elimination matches: group === null or round >= 100
    const elimMatches = bracket.matches.filter((m) => m.group === null || (m.round ?? 0) >= 100);

    // Group matches by group number
    const groupsMap: Record<number, Match[]> = {};
    for (const m of groupMatches) {
      const g = m.group ?? 0;
      if (!groupsMap[g]) groupsMap[g] = [];
      groupsMap[g].push(m);
    }
    const sortedGroups = Object.entries(groupsMap).sort(([a], [b]) => Number(a) - Number(b));

    const GROUP_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    return (
      <View key={bracket.id} style={styles.rrSection}>
        {bracketData && bracketData.length > 1 && (
          <Text style={styles.bracketCatTitle}>{catLabel}</Text>
        )}

        {/* Group Phase */}
        {sortedGroups.length > 0 && (
          <>
            <Text style={styles.deGroupTitle}>Fase de Grupos</Text>
            {sortedGroups.map(([groupKey, matches]) => {
              const groupNum = Number(groupKey);
              const letter = GROUP_LETTERS[groupNum] ?? `${groupNum + 1}`;
              const sortedMatches = [...matches].sort((a, b) => a.round - b.round || a.position - b.position);

              // Compute standings for this group
              const teamMap = new Map<string, { id: string; name: string; wins: number; played: number; pointsScored: number }>();
              for (const m of matches) {
                const isFinished = m.status !== 'SCHEDULED';
                if (m.teamA) {
                  const t = teamMap.get(m.teamA.id) ?? { id: m.teamA.id, name: m.teamA.name, wins: 0, played: 0, pointsScored: 0 };
                  if (isFinished) { t.played++; t.pointsScored += m.scoreTeamA; }
                  if (m.winnerId === m.teamA.id) t.wins++;
                  teamMap.set(m.teamA.id, t);
                }
                if (m.teamB) {
                  const t = teamMap.get(m.teamB.id) ?? { id: m.teamB.id, name: m.teamB.name, wins: 0, played: 0, pointsScored: 0 };
                  if (isFinished) { t.played++; t.pointsScored += m.scoreTeamB; }
                  if (m.winnerId === m.teamB.id) t.wins++;
                  teamMap.set(m.teamB.id, t);
                }
              }
              const standings = Array.from(teamMap.values()).sort((a, b) => b.wins - a.wins || b.pointsScored - a.pointsScored);

              return (
                <View key={groupNum} style={styles.geGroupSection}>
                  <Text style={styles.geGroupLabel}>Grupo {letter}</Text>
                  {/* Standings */}
                  {standings.length > 0 && (
                    <View style={styles.standingsCard}>
                      <View style={styles.standingsHeader}>
                        <Text style={styles.standingsHeaderPos}>#</Text>
                        <Text style={styles.standingsHeaderTeam}>Time</Text>
                        <Text style={styles.standingsHeaderStat}>J</Text>
                        <Text style={styles.standingsHeaderStat}>V</Text>
                        <Text style={styles.standingsHeaderStat}>Pts</Text>
                      </View>
                      {standings.map((entry, i) => (
                        <View key={entry.id} style={[styles.standingsRow, i < standings.length - 1 && styles.standingsRowBorder, i === 0 && styles.standingsLeaderRow]}>
                          <Text style={[styles.standingsPos, i === 0 && styles.standingsLeaderText]}>{i + 1}</Text>
                          <Text style={[styles.standingsTeamName, i === 0 && styles.standingsLeaderText]} numberOfLines={1}>{entry.name}</Text>
                          <Text style={[styles.standingsStat, i === 0 && styles.standingsLeaderText]}>{entry.played}</Text>
                          <Text style={[styles.standingsStat, i === 0 && styles.standingsLeaderText]}>{entry.wins}</Text>
                          <Text style={[styles.standingsStatBold, i === 0 && { color: '#0E7A4A' }]}>{entry.pointsScored}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {/* Matches */}
                  {sortedMatches.map(renderMatchCard)}
                </View>
              );
            })}
          </>
        )}

        {/* Elimination Phase */}
        {elimMatches.length > 0 && (
          <>
            <Text style={[styles.deGroupTitle, { marginTop: spacing.md }]}>Eliminatória</Text>
            {(() => {
              const sorted = [...elimMatches].sort((a, b) => a.round - b.round || a.position - b.position);
              const maxRound = Math.max(...sorted.map((m) => m.round), 1);
              const rounds: Record<number, Match[]> = {};
              for (const m of sorted) {
                if (!rounds[m.round]) rounds[m.round] = [];
                rounds[m.round].push(m);
              }
              const sortedRounds = Object.entries(rounds).sort(([a], [b]) => Number(a) - Number(b));
              const displayMaxRound = sortedRounds.length;
              return sortedRounds.map(([roundKey, roundMatches]) => {
                const roundNum = Number(roundKey);
                const fromFinal = displayMaxRound - sortedRounds.findIndex(([k]) => k === roundKey);
                const label = ROUND_LABELS[fromFinal] ?? `Rodada ${roundNum}`;
                return (
                  <View key={roundNum} style={styles.rrRoundSection}>
                    <Text style={styles.rrRoundLabel}>{label}</Text>
                    <View style={styles.rrMatches}>
                      {roundMatches.sort((a, b) => a.position - b.position).map(renderMatchCard)}
                    </View>
                  </View>
                );
              });
            })()}
          </>
        )}
      </View>
    );
  }

  function renderRoundRobinBracket(bracket: BracketResponse) {
    const sorted = [...bracket.matches].sort((a, b) => a.round - b.round || a.position - b.position);
    const rounds: Record<number, Match[]> = {};
    for (const m of sorted) {
      if (!rounds[m.round]) rounds[m.round] = [];
      rounds[m.round].push(m);
    }
    const sortedRounds = Object.entries(rounds).sort(([a], [b]) => Number(a) - Number(b));
    const catLabel = `${TYPE_LABELS[bracket.category.type] ?? bracket.category.type} · ${FORMAT_LABELS[bracket.category.format] ?? bracket.category.format}`;
    const totalRounds = sortedRounds.length;

    // Compute standings from all matches
    const teamMap = new Map<string, { id: string; name: string; avatarUrl: string | null; wins: number; played: number; pointsScored: number }>();
    for (const m of bracket.matches) {
      const isFinished = m.status !== 'SCHEDULED';
      if (m.teamA) {
        const t = teamMap.get(m.teamA.id) ?? { id: m.teamA.id, name: m.teamA.name, avatarUrl: m.teamA.avatarUrl, wins: 0, played: 0, pointsScored: 0 };
        if (isFinished) { t.played++; t.pointsScored += m.scoreTeamA; }
        if (m.winnerId === m.teamA.id) t.wins++;
        teamMap.set(m.teamA.id, t);
      }
      if (m.teamB) {
        const t = teamMap.get(m.teamB.id) ?? { id: m.teamB.id, name: m.teamB.name, avatarUrl: m.teamB.avatarUrl, wins: 0, played: 0, pointsScored: 0 };
        if (isFinished) { t.played++; t.pointsScored += m.scoreTeamB; }
        if (m.winnerId === m.teamB.id) t.wins++;
        teamMap.set(m.teamB.id, t);
      }
    }
    const standings = Array.from(teamMap.values()).sort((a, b) => b.wins - a.wins || b.pointsScored - a.pointsScored);

    return (
      <View key={bracket.id} style={styles.rrSection}>
        {bracketData && bracketData.length > 1 && (
          <Text style={styles.bracketCatTitle}>{catLabel}</Text>
        )}
        {/* Standings */}
        {standings.length > 0 && (
          <View style={styles.standingsCard}>
            <Text style={styles.standingsTitle}>CLASSIFICAÇÃO</Text>
            <View style={styles.standingsHeader}>
              <Text style={styles.standingsHeaderPos}>#</Text>
              <Text style={styles.standingsHeaderTeam}>Time</Text>
              <Text style={styles.standingsHeaderStat}>J</Text>
              <Text style={styles.standingsHeaderStat}>V</Text>
              <Text style={styles.standingsHeaderStat}>Pts</Text>
            </View>
            {standings.map((entry, i) => (
              <View key={entry.id} style={[styles.standingsRow, i < standings.length - 1 && styles.standingsRowBorder, i === 0 && styles.standingsLeaderRow]}>
                <Text style={[styles.standingsPos, i === 0 && styles.standingsLeaderText]}>{i + 1}</Text>
                <Text style={[styles.standingsTeamName, i === 0 && styles.standingsLeaderText]} numberOfLines={1}>{entry.name}</Text>
                <Text style={[styles.standingsStat, i === 0 && styles.standingsLeaderText]}>{entry.played}</Text>
                <Text style={[styles.standingsStat, i === 0 && styles.standingsLeaderText]}>{entry.wins}</Text>
                <Text style={[styles.standingsStatBold, i === 0 && { color: '#0E7A4A' }]}>{entry.pointsScored}</Text>
              </View>
            ))}
          </View>
        )}
        {/* Match rounds */}
        {sortedRounds.map(([roundKey, roundMatches], idx) => {
          const roundNum = Number(roundKey);
          const isPlayoff = idx === totalRounds - 1 && totalRounds > 1;
          const label = isPlayoff ? 'Playoffs' : `Rodada ${roundNum}`;
          return (
            <View key={roundNum} style={styles.rrRoundSection}>
              <Text style={styles.rrRoundLabel}>{label}</Text>
              <View style={styles.rrMatches}>
                {roundMatches.map(renderMatchCard)}
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  loadingRoot: { flex: 1, backgroundColor: colors.background },

  // ─── Cover Header ───
  cover: {
    height: 280,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  coverGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,10,30,0.45)',
  },
  coverTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverBottom: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  coverTitle: {
    fontFamily: fonts.title.regular,
    fontSize: 34,
    color: '#FFFFFF',
    letterSpacing: 0.3,
    lineHeight: 38,
  },
  coverMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: fonts.text.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },

  // ─── Stats Grid ───
  statsWrap: {
    paddingHorizontal: spacing.xl,
    marginTop: -16,
    position: 'relative',
    zIndex: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.lg,
    shadowColor: 'rgba(20,10,30,0.08)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fonts.title.regular,
    fontSize: 18,
    color: colors.primary,
  },
  statLabel: {
    fontFamily: fonts.text.regular,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ECECF0',
    marginVertical: 4,
  },

  // ─── Tabs ───
  tabWrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },

  // ─── Scroll Content ───
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 40,
  },
  gapMd: { gap: spacing.md },

  // ─── Overview Tab ───
  description: {
    fontFamily: fonts.text.regular,
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  section: { marginBottom: spacing.xxl },
  sectionTitle: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.heading,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
    marginBottom: spacing.lg,
  },
  stagesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: 0,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  stageBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryTint,
  },
  stageNum: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageNumText: {
    fontFamily: fonts.title.regular,
    fontSize: 14,
    color: colors.primary,
  },
  stageName: {
    fontFamily: fonts.text.bold,
    fontSize: 14,
    color: colors.text,
  },
  stageMeta: {
    fontFamily: fonts.text.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },

  // ─── Organizer Card ───
  organizerCard: {
    borderRadius: radius.card,
    padding: spacing.xl,
    overflow: 'hidden',
    marginBottom: spacing.xxl,
  },
  organizerTitle: {
    fontFamily: fonts.title.regular,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  organizerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  organizerAvatarText: {
    fontFamily: fonts.title.regular,
    fontSize: 18,
    color: '#FFFFFF',
  },
  organizerName: {
    fontFamily: fonts.text.bold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  organizerEmail: {
    fontFamily: fonts.text.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },

  // ─── Categories Tab ───
  catCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.lg,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  catHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  catTitle: {
    fontFamily: fonts.title.regular,
    fontSize: 18,
    color: colors.text,
    letterSpacing: 0.4,
  },
  catMeta: {
    fontFamily: fonts.text.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  catRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  catRegBadge: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  catRegText: {
    fontFamily: fonts.title.regular,
    fontSize: 12,
    color: colors.primary,
  },
  catDetails: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  catDetailText: {
    fontFamily: fonts.text.regular,
    fontSize: 11,
    color: colors.textMuted,
  },

  // ─── Sponsors Tab ───
  sponsorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  sponsorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.xl,
    alignItems: 'center',
    width: '47%',
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  sponsorIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  sponsorName: {
    fontFamily: fonts.text.bold,
    fontSize: 13,
    color: colors.text,
  },

  emptyText: {
    fontFamily: fonts.text.regular,
    fontSize: 13,
    color: colors.textPlaceholder,
    textAlign: 'center',
    paddingVertical: spacing.xxl,
  },

  // ─── Inline Bracket ───
  inlineBracketWrap: {
    gap: spacing.xl,
  },
  bracketCatTitle: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.subtitle,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
    marginBottom: spacing.md,
  },
  bracketScroll: {
    paddingVertical: spacing.sm,
  },
  bracketColumns: {
    flexDirection: 'row',
    gap: 12,
  },
  roundColumn: {
    width: 170,
    flexShrink: 0,
  },
  roundLabel: {
    fontFamily: fonts.title.regular,
    fontSize: 14,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  roundMatches: {
    gap: 12,
  },
  bracketMatch: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F4EFFA',
  },
  bracketTeamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bracketWinnerRow: {
    backgroundColor: 'rgba(31,184,122,0.1)',
  },
  bracketTeamName: {
    flex: 1,
    fontFamily: fonts.text.semiBold,
    fontSize: 12,
    color: '#150A1F',
  },
  bracketTeamNameWinner: {
    color: '#0E7A4A',
  },
  bracketScore: {
    fontFamily: fonts.title.regular,
    fontSize: 14,
    color: '#A89BBA',
    minWidth: 20,
    textAlign: 'right',
  },
  bracketScoreWinner: {
    color: '#0E7A4A',
  },
  bracketDivider: {
    height: 1,
    backgroundColor: '#F4EFFA',
  },

  // ─── Round Robin ───
  rrSection: {
    gap: spacing.lg,
  },
  standingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.lg,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  standingsTitle: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.heading,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
    marginBottom: spacing.md,
  },
  standingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECF0',
    marginBottom: spacing.xs,
  },
  standingsHeaderPos: {
    width: 28,
    fontFamily: fonts.text.semiBold,
    fontSize: 10,
    color: colors.textMuted,
  },
  standingsHeaderTeam: {
    flex: 1,
    fontFamily: fonts.text.semiBold,
    fontSize: 10,
    color: colors.textMuted,
  },
  standingsHeaderStat: {
    width: 34,
    textAlign: 'center',
    fontFamily: fonts.text.semiBold,
    fontSize: 10,
    color: colors.textMuted,
  },
  standingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  standingsRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F4EFFA',
  },
  standingsPos: {
    width: 28,
    fontFamily: fonts.text.bold,
    fontSize: typography.sizes.input,
    color: colors.primary,
  },
  standingsTeamName: {
    flex: 1,
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.input,
    color: colors.text,
  },
  standingsStat: {
    width: 34,
    textAlign: 'center',
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.input,
    color: colors.textMuted,
  },
  standingsStatBold: {
    width: 34,
    textAlign: 'center',
    fontFamily: fonts.text.bold,
    fontSize: typography.sizes.input,
    color: colors.primary,
  },
  rrRoundSection: {
    marginBottom: spacing.md,
  },
  rrRoundLabel: {
    fontFamily: fonts.title.regular,
    fontSize: 14,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  deGroupTitle: {
    fontFamily: fonts.title.regular,
    fontSize: 16,
    color: colors.text,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  geGroupSection: {
    marginBottom: spacing.lg,
  },
  geGroupLabel: {
    fontFamily: fonts.title.regular,
    fontSize: 14,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  rrMatches: {
    gap: spacing.sm,
  },
  standingsLeaderRow: {
    backgroundColor: 'rgba(31,184,122,0.1)',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    marginHorizontal: -spacing.sm,
  },
  standingsLeaderText: {
    color: '#0E7A4A',
  },

  // ─── Referee Management ───
  refAddRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  refInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    gap: spacing.sm,
  },
  refInput: { flex: 1, color: colors.text, fontFamily: fonts.form.regular, fontSize: typography.sizes.input, paddingVertical: 0 },
  refAddBtn: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.sm },
  refCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  refAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  refAvatarText: { fontFamily: fonts.title.regular, fontSize: 16, color: colors.primary },
  refInfo: { flex: 1 },
  refName: { fontSize: typography.sizes.input, color: colors.text, fontFamily: fonts.text.semiBold },
  refEmail: { fontSize: typography.sizes.md, color: colors.textMuted, fontFamily: fonts.text.regular },

  // ─── Code Section ───
  codeSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.xl,
    gap: spacing.md,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  codeDesc: { fontSize: typography.sizes.body, color: colors.textMuted, fontFamily: fonts.text.regular, lineHeight: 18 },
  codeCard: {
    backgroundColor: colors.surface, borderRadius: radius.card,
    borderWidth: 1, borderColor: colors.primary,
    padding: spacing.xl, alignItems: 'center',
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2,
  },
  codeLabel: { fontSize: typography.sizes.md, fontFamily: fonts.text.medium, color: colors.textMuted, marginTop: spacing.sm, letterSpacing: typography.letterSpacing.medium },
  codeValue: { fontFamily: fonts.title.regular, fontSize: typography.sizes.hero, color: colors.primary, letterSpacing: 6 },
  codeHint: { fontSize: typography.sizes.md, fontFamily: fonts.text.regular, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, lineHeight: 16 },

  // ─── Bracket Generation ───
  bracketDesc: { fontSize: typography.sizes.body, color: colors.textMuted, fontFamily: fonts.text.regular, marginBottom: spacing.lg, lineHeight: 18 },
  bracketOptions: { gap: spacing.sm, marginBottom: spacing.lg },
  bracketOption: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: '#FFFFFF', borderRadius: radius.lg,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    shadowColor: 'rgba(20,10,30,0.06)', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 4, elevation: 1,
  },
  bracketInfoBtn: {
    marginLeft: 'auto',
    padding: 4,
  },
  bracketOptionActive: { backgroundColor: colors.primaryTint, borderWidth: 1, borderColor: colors.primary },
  bracketOptionText: { fontSize: typography.sizes.input, fontFamily: fonts.text.semiBold, color: colors.textMuted },
  bracketOptionTextActive: { color: colors.primary },

  // ─── Actions ───
  actionsSection: { gap: spacing.md, marginTop: spacing.xl },

  // ─── Fixed Bottom ───
  fixedBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#ECECF0',
  },
  registeredBadge: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(31,184,122,0.1)',
    borderRadius: 9999,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  registeredDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registeredDotText: {
    fontFamily: fonts.title.regular,
    fontSize: 14,
    color: '#FFFFFF',
  },
  registeredTitle: {
    fontFamily: fonts.title.regular,
    fontSize: 14,
    color: '#0E7A4A',
    letterSpacing: 0.5,
  },

  // ─── Bracket Info Modal ───
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  infoModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.xl,
    width: '100%',
    maxHeight: '80%',
    shadowColor: 'rgba(20,10,30,0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  infoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  infoModalTitle: {
    flex: 1,
    fontFamily: fonts.title.regular,
    fontSize: 18,
    color: colors.text,
    letterSpacing: 0.3,
    marginRight: spacing.md,
  },
  infoModalDesc: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.body,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  infoModalExampleBox: {
    backgroundColor: colors.primaryTint,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  infoModalExampleLabel: {
    fontFamily: fonts.title.regular,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  infoModalExample: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: colors.text,
    lineHeight: 16,
  },
});
