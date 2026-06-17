import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { tournamentService } from '../../../services/tournament';
import { registrationService } from '../../../services/registration';
import { useAuthStore } from '../../../stores/authStore';
import { useDialogStore } from '../../../stores/dialogStore';
import { useTournamentSocket } from '../../../hooks/useTournamentSocket';
import type { TournamentStackParamList } from '../../../navigation/types';
import type { Tournament } from '../../../types/tournament';
import type { BracketResponse, RankingResponse } from '../../../types/match';
import { BracketType } from '../../../types/tournament';
import { BRACKET_TYPE_OPTIONS } from './detail.constants';

export type TournamentTab = 'overview' | 'categories' | 'bracket' | 'sponsors';

interface Args {
  tournamentId: string;
}

export function useTournamentDetail({ tournamentId }: Args) {
  const navigation = useNavigation<NativeStackNavigationProp<TournamentStackParamList, 'TournamentDetail'>>();
  const user = useAuthStore((s) => s.user);
  const dialog = useDialogStore();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TournamentTab>('overview');
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
    } catch {
      // noop
    }
  }, [tournamentId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData().finally(() => setLoading(false));
    }, [loadData]),
  );

  useTournamentSocket(tournamentId, loadData);

  const handleAddReferee = useCallback(async () => {
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
  }, [refereeEmail, tournamentId, dialog]);

  const handleRemoveReferee = useCallback(
    async (refereeId: string) => {
      try {
        await tournamentService.removeReferee(tournamentId, refereeId);
        setReferees((prev) => prev.filter((r) => r.id !== refereeId));
      } catch {
        // noop
      }
    },
    [tournamentId],
  );

  const handlePublish = useCallback(async () => {
    try {
      await tournamentService.publish(tournamentId);
      const updated = await tournamentService.findOne(tournamentId);
      setTournament(updated);
      dialog.success('Torneio publicado com sucesso.');
    } catch (e: any) {
      dialog.error(e?.response?.data?.message ?? 'Erro ao publicar');
    }
  }, [tournamentId, dialog]);

  const handleCancel = useCallback(() => {
    dialog.confirm({
      title: 'Excluir torneio?',
      message: 'Essa ação não pode ser desfeita.',
      confirmText: 'Excluir',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await tournamentService.cancel(tournamentId);
          navigation.goBack();
        } catch (e: any) {
          dialog.error(e?.response?.data?.message ?? 'Erro ao excluir');
        }
      },
    });
  }, [tournamentId, dialog, navigation]);

  const handleGenerateBracket = useCallback(async () => {
    const cat = tournament?.categories?.[0];
    if (!cat) {
      dialog.error('Nenhuma categoria encontrada.');
      return;
    }
    dialog.confirm({
      title: 'Gerar chaveamento?',
      message: `Tipo: ${BRACKET_TYPE_OPTIONS.find((b) => b.key === bracketType)?.label}`,
      confirmText: 'Gerar',
      onConfirm: async () => {
        setGeneratingBracket(true);
        try {
          await tournamentService.generateBracket(tournamentId, {
            categoryId: cat.id,
            type: bracketType,
          });
          const updated = await tournamentService.findOne(tournamentId);
          setTournament(updated);
          const bracket = await tournamentService.getBracket(tournamentId).catch(() => null);
          if (bracket) setBracketData(bracket);
          dialog.success('Chaveamento gerado!');
        } catch (e: any) {
          dialog.error(e?.response?.data?.message ?? 'Erro ao gerar chaveamento');
        } finally {
          setGeneratingBracket(false);
        }
      },
    });
  }, [tournament, tournamentId, bracketType, dialog]);

  const handleGenerateCode = useCallback(async () => {
    if (codeLoading) return;
    setCodeLoading(true);
    try {
      const result = await tournamentService.generateRefereeCode(tournamentId);
      setRefereeCode(result.code);
    } catch {
      dialog.error('Não foi possível gerar o código.');
    } finally {
      setCodeLoading(false);
    }
  }, [codeLoading, tournamentId, dialog]);

  const handleStartTournament = useCallback(async () => {
    await tournamentService.startTournament(tournamentId);
    setTournament(await tournamentService.findOne(tournamentId));
  }, [tournamentId]);

  return {
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
    rankingData,
    handleAddReferee,
    handleRemoveReferee,
    handlePublish,
    handleCancel,
    handleGenerateBracket,
    handleGenerateCode,
    handleStartTournament,
  };
}
