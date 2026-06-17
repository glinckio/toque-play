import React, { useRef } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import HeroHeader from '../../components/HeroHeader';
import Stepper from '../../components/Stepper';
import { STEP_LABELS } from './tournamentForm.types';
import { useTournamentForm } from './form/useTournamentForm';
import { TournamentBasicInfoStep } from './form/components/TournamentBasicInfoStep';
import { TournamentLocationStep } from './form/components/TournamentLocationStep';
import { TournamentCategoriesStep } from './form/components/TournamentCategoriesStep';
import { TournamentReviewStep } from './form/components/TournamentReviewStep';
import { TournamentFormBottomBar } from './form/components/TournamentFormBottomBar';

export default function CreateTournamentScreen({ navigation }: any) {
  const route = useRoute<any>();
  const tournamentId = route.params?.tournamentId;
  const scrollRef = useRef<ScrollView>(null);

  const form = useTournamentForm({ tournamentId, navigation });

  const goNext = () => {
    form.goNext();
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };
  const goBack = () => {
    form.goBack();
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <HeroHeader
          title={form.isEditing ? 'EDITAR TORNEIO' : 'CRIAR TORNEIO'}
          watermark={form.isEditing ? 'EDIT' : 'CREATE'}
          onBack={goBack}
          rounded
        />

        <View style={styles.stepperWrap}>
          <Stepper steps={STEP_LABELS} currentStep={form.step} />
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {form.step === 0 && (
            <TournamentBasicInfoStep
              name={form.name}
              description={form.description}
              eventType={form.eventType}
              imageUrl={form.imageUrl}
              bannerModalVisible={form.bannerModalVisible}
              defaultBanners={form.defaultBanners}
              onNameChange={form.setName}
              onDescriptionChange={form.setDescription}
              onEventTypeChange={form.setEventType}
              onOpenBannerModal={() => form.setBannerModalVisible(true)}
              onCloseBannerModal={() => form.setBannerModalVisible(false)}
              onPickDefaultBanner={form.setImageUrl}
              onUpload={form.pickImage}
              onRemoveBanner={() => form.setImageUrl(null)}
            />
          )}
          {form.step === 1 && (
            <TournamentLocationStep
              eventType={form.eventType}
              stages={form.stages}
              onUpdateStage={form.updateStage}
              onCepFound={(idx, data) => {
                form.updateStage(idx, 'cep', data.cep);
                form.updateStage(idx, 'street', data.street);
                form.updateStage(idx, 'neighborhood', data.neighborhood);
                form.updateStage(idx, 'city', data.city);
                form.updateStage(idx, 'state', data.state);
              }}
              onToggleFacility={form.toggleFacility}
              onAddStage={form.addStage}
              onRemoveStage={form.removeStage}
            />
          )}
          {form.step === 2 && (
            <TournamentCategoriesStep
              categories={form.categories}
              sponsors={form.sponsors}
              onUpdateCategory={form.updateCategory}
              onAddCategory={form.addCategory}
              onRemoveCategory={form.removeCategory}
              onAddSponsor={form.addSponsor}
              onRemoveSponsor={form.removeSponsor}
              onUpdateSponsor={form.updateSponsor}
            />
          )}
          {form.step === 3 && (
            <TournamentReviewStep
              name={form.name}
              description={form.description}
              eventType={form.eventType}
              stages={form.stages}
              categories={form.categories}
              sponsors={form.sponsors}
            />
          )}
          <View style={{ height: 120 }} />
        </ScrollView>

        <TournamentFormBottomBar
          step={form.step}
          isEditing={form.isEditing}
          saving={form.saving}
          onBack={goBack}
          onNext={goNext}
          onSaveDraft={() => form.handleSave(false)}
          onPublish={() => form.handleSave(true)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  stepperWrap: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  content: { paddingHorizontal: spacing.xl, paddingBottom: 20 },
});
