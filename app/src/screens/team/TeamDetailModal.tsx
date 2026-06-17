import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import HeroHeader from '../../components/HeroHeader';
import type { TeamStackParamList } from '../../navigation/types';
import { useTeamDetail } from './hooks/useTeamDetail';
import { TeamAvatarSection } from './components/TeamAvatarSection';
import { TeamStatsCard } from './components/TeamStatsCard';
import { TeamMembersSection } from './components/TeamMembersSection';
import { TeamDeleteButton } from './components/TeamDeleteButton';
import { AthleteInfoModal } from './components/AthleteInfoModal';

type Route = RouteProp<TeamStackParamList, 'TeamDetail'>;

export default function TeamDetailModal() {
  const route = useRoute<Route>();
  const { teamId } = route.params;
  const {
    team,
    members,
    loading,
    refreshing,
    uploadingAvatar,
    infoMember,
    setInfoMember,
    isOwner,
    onRefresh,
    handleRemoveMember,
    handleDeleteTeam,
    handleToggleCaptain,
    handleEditMember,
    handleAvatarUpload,
    goBack,
    navigateAddMember,
  } = useTeamDetail(teamId);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingRoot} edges={['top']}>
        <HeroHeader title="EQUIPE" watermark="TEAM" onBack={goBack} rounded />
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!team) {
    return (
      <SafeAreaView style={styles.loadingRoot} edges={['top']}>
        <HeroHeader title="EQUIPE" watermark="TEAM" onBack={goBack} rounded />
        <View style={styles.loadingWrap}>
          <Text style={styles.errorText}>Equipe não encontrada</Text>
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.backLink}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <HeroHeader
        title={team.name.toUpperCase()}
        watermark={team.name.toUpperCase().slice(0, 8)}
        onBack={goBack}
        subtitle={team.description ?? undefined}
        rounded
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <TeamAvatarSection
          avatarUrl={team.avatarUrl}
          teamName={team.name}
          isOwner={isOwner}
          uploading={uploadingAvatar}
          onPress={handleAvatarUpload}
        />

        <TeamStatsCard memberCount={members.length} />

        <TeamMembersSection
          members={members}
          isOwner={isOwner}
          onAddMember={navigateAddMember}
          onInfo={setInfoMember}
          onEdit={handleEditMember}
          onToggleCaptain={handleToggleCaptain}
          onRemove={handleRemoveMember}
        />

        {isOwner && <TeamDeleteButton onPress={handleDeleteTeam} />}

        <View style={{ height: 40 }} />
      </ScrollView>

      <AthleteInfoModal member={infoMember} onClose={() => setInfoMember(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  loadingRoot: { flex: 1, backgroundColor: colors.background },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: colors.textMuted, fontSize: 16, fontFamily: fonts.text.regular },
  backLink: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.text.semiBold,
    marginTop: spacing.md,
  },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 40 },
});
