import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import TabBar from '../../components/TabBar';
import type { TournamentStackParamList } from '../../navigation/types';
import { MODALITY_LABELS } from './detail/detail.constants';
import { useTournamentDetail } from './detail/useTournamentDetail';
import { TournamentCover } from './detail/components/TournamentCover';
import { TournamentStatsGrid } from './detail/components/TournamentStatsGrid';
import { TournamentOverviewTab } from './detail/components/TournamentOverviewTab';
import { TournamentCategoriesTab } from './detail/components/TournamentCategoriesTab';
import { TournamentBracketTab } from './detail/components/TournamentBracketTab';
import { TournamentSponsorsTab } from './detail/components/TournamentSponsorsTab';
import { TournamentOrganizerPanel } from './detail/components/TournamentOrganizerPanel';
import { TournamentOrganizerActions } from './detail/components/TournamentOrganizerActions';
import { TournamentBottomActionBar } from './detail/components/TournamentBottomActionBar';
import { BracketInfoModal } from './detail/components/BracketInfoModal';

type Route = RouteProp<TournamentStackParamList, 'TournamentDetail'>;

export default function TournamentDetailModal() {
  const route = useRoute<Route>();
  const { tournamentId } = route.params;
  const insets = useSafeAreaInsets();

  const {
    navigation,
    user,
    tournament,
    alreadyRegistered,
    loading,
    tab,
    setTab,
    refereeCode,
    codeLoading,
    referees,
    refereeEmail,
    setRefereeEmail,
    addingReferee,
    bracketType,
    setBracketType,
    bracketInfoVisible,
    setBracketInfoVisible,
    generatingBracket,
    bracketData,
    handleAddReferee,
    handleRemoveReferee,
    handlePublish,
    handleCancel,
    handleGenerateBracket,
    handleGenerateCode,
    handleStartTournament,
  } = useTournamentDetail({ tournamentId });

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
          <Text
            style={{ color: colors.textMuted, fontSize: 16, fontFamily: fonts.text.regular }}
          >
            Torneio não encontrado
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginTop: spacing.md }}
          >
            <Text style={{ color: colors.primary, fontFamily: fonts.text.semiBold }}>
              Voltar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const t = tournament as any;
  const stage = tournament.stages?.[0];
  const regCount = t._count?.registrations ?? t.registrationCount ?? 0;
  const maxTeams = stage?.maxTeams ?? 0;
  const isOwner = tournament.ownerId === user?.id;
  const canRegister =
    ['REGISTRATION_OPEN', 'PUBLISHED'].includes(tournament.status) &&
    !isOwner &&
    !alreadyRegistered;
  const canViewBrackets = ['BRACKET_GENERATED', 'IN_PROGRESS'].includes(tournament.status);
  const canStart = isOwner && tournament.status === 'BRACKET_GENERATED';
  const canGenerate =
    isOwner &&
    ['REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'PUBLISHED'].includes(tournament.status) &&
    regCount >= 2;
  const canPublish = isOwner && tournament.status === 'DRAFT';
  const canEdit = isOwner && ['DRAFT', 'PUBLISHED'].includes(tournament.status);
  const canDelete =
    isOwner && !['IN_PROGRESS', 'FINISHED', 'CANCELLED'].includes(tournament.status);
  const owner = t.owner;
  const firstCatModality = tournament.categories?.[0]?.modality;

  return (
    <View style={styles.root}>
      <TournamentCover
        tournament={tournament}
        coverUrl={t.coverUrl}
        stageDate={stage?.date ?? null}
        stageCity={stage?.city ?? null}
        tournamentCity={tournament.city}
        regCount={regCount}
        insetsTop={insets.top}
        onBack={() => navigation.goBack()}
      />

      <TournamentStatsGrid
        modalityLabel={MODALITY_LABELS[firstCatModality ?? ''] ?? '—'}
        formatLabel={tournament.eventType === 'CIRCUIT' ? 'Circuito' : 'Único'}
        categoryCount={tournament.categories?.length ?? 0}
      />

      <View style={styles.tabWrap}>
        <TabBar
          tabs={[
            { key: 'overview', label: 'Visão geral' },
            { key: 'categories', label: 'Categorias' },
            { key: 'bracket', label: 'Chaves' },
            { key: 'sponsors', label: 'Patroc.' },
          ]}
          activeTab={tab}
          onTabChange={(key) => setTab(key as typeof tab)}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {tab === 'overview' && (
            <>
              <TournamentOverviewTab tournament={tournament} owner={owner} />
              {isOwner && (
                <TournamentOrganizerPanel
                  tournamentStatus={tournament.status}
                  refereeEmail={refereeEmail}
                  referees={referees}
                  addingReferee={addingReferee}
                  refereeCode={refereeCode}
                  codeLoading={codeLoading}
                  bracketType={bracketType}
                  generatingBracket={generatingBracket}
                  canGenerate={canGenerate}
                  onRefereeEmailChange={setRefereeEmail}
                  onAddReferee={handleAddReferee}
                  onRemoveReferee={handleRemoveReferee}
                  onSetBracketType={setBracketType}
                  onShowBracketInfo={setBracketInfoVisible}
                  onGenerateCode={handleGenerateCode}
                  onGenerateBracket={handleGenerateBracket}
                />
              )}
              {isOwner && (
                <TournamentOrganizerActions
                  canPublish={canPublish}
                  canEdit={canEdit}
                  canDelete={canDelete}
                  onPublish={handlePublish}
                  onEdit={() => navigation.navigate('CreateTournament', { tournamentId })}
                  onDelete={handleCancel}
                />
              )}
            </>
          )}

          {tab === 'categories' && <TournamentCategoriesTab tournament={tournament} />}

          {tab === 'bracket' && (
            <TournamentBracketTab
              bracketData={bracketData}
              canViewBrackets={canViewBrackets}
              onPressMatch={(matchId) =>
                navigation.navigate('LiveMatch', { matchId, tournamentId })
              }
            />
          )}

          {tab === 'sponsors' && <TournamentSponsorsTab tournament={tournament} />}

          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <BracketInfoModal visible={bracketInfoVisible} onClose={() => setBracketInfoVisible(null)} />

      <TournamentBottomActionBar
        insetsBottom={insets.bottom}
        alreadyRegistered={alreadyRegistered}
        canRegister={canRegister}
        canStart={canStart}
        canViewBrackets={canViewBrackets}
        onRegister={() =>
          navigation.navigate('RegistrationTeamSelect', { tournamentId })
        }
        onStart={handleStartTournament}
        onViewBrackets={() => navigation.navigate('BracketView', { tournamentId })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  loadingRoot: { flex: 1, backgroundColor: colors.background },
  tabWrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 40,
  },
});
