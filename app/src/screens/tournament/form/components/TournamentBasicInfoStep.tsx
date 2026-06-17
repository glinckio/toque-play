import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../theme/colors';
import { formStyles as s } from './formStyles';
import { TournamentBannerPickerModal } from './TournamentBannerPickerModal';

interface Props {
  name: string;
  description: string;
  eventType: string;
  imageUrl: string | null;
  bannerModalVisible: boolean;
  defaultBanners: string[];
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onEventTypeChange: (v: string) => void;
  onOpenBannerModal: () => void;
  onCloseBannerModal: () => void;
  onPickDefaultBanner: (url: string) => void;
  onUpload: () => void;
  onRemoveBanner: () => void;
}

export function TournamentBasicInfoStep({
  name,
  description,
  eventType,
  imageUrl,
  bannerModalVisible,
  defaultBanners,
  onNameChange,
  onDescriptionChange,
  onEventTypeChange,
  onOpenBannerModal,
  onCloseBannerModal,
  onPickDefaultBanner,
  onUpload,
  onRemoveBanner,
}: Props) {
  return (
    <View>
      <Text style={s.stepTitle}>INFORMAÇÕES BÁSICAS</Text>

      <Text style={s.fieldLabel}>Banner do torneio</Text>
      <TouchableOpacity style={s.bannerArea} onPress={onOpenBannerModal} activeOpacity={0.7}>
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

      <TournamentBannerPickerModal
        visible={bannerModalVisible}
        defaultBanners={defaultBanners}
        imageUrl={imageUrl}
        onClose={onCloseBannerModal}
        onPickDefault={(url) => {
          onPickDefaultBanner(url);
          onCloseBannerModal();
        }}
        onUpload={onUpload}
        onRemove={() => {
          onRemoveBanner();
          onCloseBannerModal();
        }}
      />

      <Text style={s.fieldLabel}>Nome do torneio *</Text>
      <View style={s.inputWrap}>
        <Ionicons name="trophy-outline" size={16} color={colors.textPlaceholder} />
        <TextInput
          style={s.input}
          value={name}
          onChangeText={onNameChange}
          placeholder="Ex: Copa ToquePlay 2025"
          placeholderTextColor={colors.textPlaceholder}
        />
      </View>

      <Text style={s.fieldLabel}>Descrição</Text>
      <View style={[s.inputWrap, s.inputMultilineWrap]}>
        <Ionicons
          name="document-text-outline"
          size={16}
          color={colors.textPlaceholder}
          style={{ marginTop: 12 }}
        />
        <TextInput
          style={[s.input, s.inputMultiline]}
          value={description}
          onChangeText={onDescriptionChange}
          placeholder="Sobre o torneio..."
          placeholderTextColor={colors.textPlaceholder}
          multiline
          numberOfLines={3}
        />
      </View>

      <Text style={s.fieldLabel}>Tipo de evento</Text>
      <View style={s.chipRow}>
        <TouchableOpacity
          style={[s.chip, eventType === 'SINGLE' && s.chipActive]}
          onPress={() => onEventTypeChange('SINGLE')}
        >
          <Text style={[s.chipText, eventType === 'SINGLE' && s.chipTextActive]}>
            Evento Único
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.chip, eventType === 'CIRCUIT' && s.chipActive]}
          onPress={() => onEventTypeChange('CIRCUIT')}
        >
          <Text style={[s.chipText, eventType === 'CIRCUIT' && s.chipTextActive]}>
            Circuito (Liga)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
