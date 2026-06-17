import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { teamService } from '../../../services/team';
import { useAuthStore } from '../../../stores/authStore';
import { useDialogStore } from '../../../stores/dialogStore';
import type { TeamStackParamList } from '../../../navigation/types';
import type { Team, TeamMember } from '../../../types/team';
import { memberName } from '../utils';

type Nav = NativeStackNavigationProp<TeamStackParamList, 'TeamDetail'>;

export function useTeamDetail(teamId: string) {
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const dialog = useDialogStore();

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [infoMember, setInfoMember] = useState<TeamMember | null>(null);

  const load = useCallback(async () => {
    try {
      const [t, m] = await Promise.all([
        teamService.findOne(teamId),
        teamService.findMembers(teamId),
      ]);
      setTeam(t);
      setMembers(m);
    } catch {
      // noop
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [teamId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const isOwner = team?.ownerId === user?.id;

  const handleRemoveMember = useCallback(
    (member: TeamMember) => {
      if (member.isCaptain) {
        dialog.warning('Não é possível remover o capitão.');
        return;
      }
      dialog.confirm({
        title: 'Remover Membro',
        message: `Remover ${memberName(member)}?`,
        confirmText: 'Remover',
        confirmVariant: 'danger',
        onConfirm: async () => {
          try {
            await teamService.removeMember(teamId, member.id);
            setMembers((prev) => prev.filter((m) => m.id !== member.id));
          } catch {
            dialog.error('Não foi possível remover.');
          }
        },
      });
    },
    [dialog, teamId],
  );

  const handleDeleteTeam = useCallback(() => {
    dialog.confirm({
      title: 'Excluir Equipe',
      message: 'Tem certeza? Essa ação não pode ser desfeita.',
      confirmText: 'Excluir',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await teamService.remove(teamId);
          navigation.goBack();
        } catch {
          dialog.error('Não foi possível excluir.');
        }
      },
    });
  }, [dialog, navigation, teamId]);

  const handleToggleCaptain = useCallback(
    (member: TeamMember) => {
      dialog.confirm({
        title: member.isCaptain ? 'Remover Capitão' : 'Tornar Capitão',
        message: member.isCaptain
          ? `${memberName(member)} não será mais capitão.`
          : `${memberName(member)} será o novo capitão.`,
        confirmText: 'Confirmar',
        onConfirm: async () => {
          try {
            await teamService.updateMember(teamId, member.id, {
              isCaptain: !member.isCaptain,
            });
            setMembers((prev) =>
              prev.map((m) =>
                m.id === member.id ? { ...m, isCaptain: !m.isCaptain } : m,
              ),
            );
          } catch {
            dialog.error('Não foi possível atualizar.');
          }
        },
      });
    },
    [dialog, teamId],
  );

  const handleEditMember = useCallback(
    (member: TeamMember) => {
      navigation.navigate('AddMember', {
        teamId,
        memberId: member.id,
        isGuest: member.isGuest,
        guestName: member.guestName ?? undefined,
        memberName: member.user?.name,
        positions: member.positions,
      });
    },
    [navigation, teamId],
  );

  const handleAvatarUpload = useCallback(async () => {
    if (!isOwner || uploadingAvatar) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    setUploadingAvatar(true);
    try {
      const updated = await teamService.uploadAvatar(teamId, result.assets[0].uri);
      setTeam(updated);
    } catch {
      dialog.error('Não foi possível enviar o brasão.');
    } finally {
      setUploadingAvatar(false);
    }
  }, [dialog, isOwner, teamId, uploadingAvatar]);

  return {
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
    goBack: navigation.goBack,
    navigateAddMember: () => navigation.navigate('AddMember', { teamId }),
  };
}
