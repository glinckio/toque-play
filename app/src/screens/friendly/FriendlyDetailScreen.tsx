import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeroHeader from '../../components/HeroHeader';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { FriendlyStatus } from '../../types/friendly';
import { useFriendlyDetail } from './hooks/useFriendlyDetail';
import { useAcceptForm } from './hooks/useAcceptForm';
import { useLivePulse } from './hooks/useLivePulse';
import { getCategoryMax } from './constants';
import { FriendlyStatusBadge } from './components/FriendlyStatusBadge';
import { TeamsVSRow } from './components/TeamsVSRow';
import { CompletedMatchInfo } from './components/CompletedMatchInfo';
import { FriendlyInfoCard } from './components/FriendlyInfoCard';
import { AcceptedSection } from './components/AcceptedSection';
import { AcceptForm } from './components/AcceptForm';
import { ActionsFooter } from './components/ActionsFooter';
import { AthletesModal } from './components/AthletesModal';

export default function FriendlyDetailScreen({ route, navigation }: any) {
  const { friendlyId } = route.params;

  const [showAcceptForm, setShowAcceptForm] = useState(false);
  const [athletesSide, setAthletesSide] = useState<'REQUESTER' | 'CHALLENGED' | null>(null);

  const {
    rootNav,
    displayFriendly,
    loading,
    actionLoading,
    isRequester,
    isChallenged,
    canRespond,
    canCancel,
    isLive,
    canWatchLive,
    handleAccept,
    handleRejectOrCancel,
    handleGenerateCode,
  } = useFriendlyDetail(friendlyId);

  const acceptForm = useAcceptForm(displayFriendly, showAcceptForm);
  const pulse = useLivePulse(!!isLive);

  if (loading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <HeroHeader title="AMISTOSO" watermark="MATCH" onBack={() => navigation.goBack()} rounded />
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!displayFriendly) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <HeroHeader title="AMISTOSO" watermark="MATCH" onBack={() => navigation.goBack()} rounded />
        <View style={styles.center}>
          <Ionicons name="flash-outline" size={48} color={colors.textPlaceholder} />
          <Text style={styles.emptyText}>Amistoso não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const nameA = displayFriendly.requesterTeam?.name ?? 'Time A';
  const nameB = displayFriendly.challengedTeam?.name ?? 'A definir';
  const max = getCategoryMax(displayFriendly.categoryFormat);

  const onConfirmAccept = async () => {
    const ok = await handleAccept(
      Array.from(acceptForm.acceptAthletes),
      acceptForm.acceptCaptainId,
      max,
    );
    if (ok) {
      setShowAcceptForm(false);
      acceptForm.reset();
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <HeroHeader
        title={(displayFriendly.title ?? 'AMISTOSO').toUpperCase()}
        watermark="VS"
        subtitle={`${nameA} vs ${nameB}`}
        onBack={() => navigation.goBack()}
        rounded
      />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.statusRow}>
          <FriendlyStatusBadge isLive={!!isLive} status={displayFriendly.status} pulse={pulse} />
        </View>

        <TeamsVSRow friendly={displayFriendly} nameA={nameA} nameB={nameB} onShowAthletes={setAthletesSide} />

        {displayFriendly.status === FriendlyStatus.COMPLETED && (
          <CompletedMatchInfo friendly={displayFriendly} nameA={nameA} nameB={nameB} />
        )}

        <FriendlyInfoCard friendly={displayFriendly} />

        {displayFriendly.status === FriendlyStatus.ACCEPTED && (
          <AcceptedSection
            canWatchLive={!!canWatchLive}
            matchId={displayFriendly.match?.id}
            refereeCode={displayFriendly.refereeCode}
            canManageCode={isRequester || isChallenged}
            codeLoading={actionLoading}
            onWatchLive={() =>
              rootNav.navigate('Friendly', {
                screen: 'LiveMatch',
                params: { matchId: displayFriendly.match!.id },
              })
            }
            onGenerateCode={handleGenerateCode}
            onEnterAsReferee={() => rootNav.navigate('RefereeCodeEntry', { mode: 'friendly' })}
          />
        )}

        {canRespond && showAcceptForm && (
          <AcceptForm
            members={acceptForm.acceptMembers}
            selected={acceptForm.acceptAthletes}
            captainId={acceptForm.acceptCaptainId}
            loading={acceptForm.loadingAcceptMembers}
            max={max}
            submitting={actionLoading}
            onToggle={acceptForm.toggleAcceptAthlete}
            onSetCaptain={acceptForm.setAcceptCaptainId}
            onCancel={() => {
              setShowAcceptForm(false);
              acceptForm.reset();
            }}
            onConfirm={onConfirmAccept}
          />
        )}

        {!showAcceptForm && (
          <ActionsFooter
            canRespond={canRespond}
            canCancel={canCancel}
            loading={actionLoading}
            onAccept={() => setShowAcceptForm(true)}
            onReject={() => handleRejectOrCancel('reject')}
            onCancel={() => handleRejectOrCancel('cancel')}
          />
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <AthletesModal
        visible={!!athletesSide}
        side={athletesSide}
        teamName={athletesSide === 'REQUESTER' ? nameA : nameB}
        athletes={displayFriendly.athletes ?? []}
        onClose={() => setAthletesSide(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  emptyText: {
    fontSize: typography.sizes.input,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
  },
  content: { paddingHorizontal: spacing.xl, paddingBottom: 40 },
  statusRow: { marginTop: spacing.lg, marginBottom: spacing.md },
});
