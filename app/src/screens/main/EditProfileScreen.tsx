import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { useAuthStore } from '../../stores/authStore';
import { userService } from '../../services/user';
import { formatPhoneBR } from '../../utils/phone';
import HeroHeader from '../../components/HeroHeader';
import ChevronButton from '../../components/ChevronButton';
import { useDialogStore } from '../../stores/dialogStore';
import type { RootStackParamList } from '../../navigation/types';

type RootNav = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;

export default function EditProfileScreen() {
  const navigation = useNavigation<RootNav>();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const dialog = useDialogStore();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(formatPhoneBR(user?.phone ?? ''));
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const uploadAndSetAvatar = async (uri: string) => {
    setUploadingAvatar(true);
    try {
      const updated = await userService.uploadAvatar(uri);
      setUser(updated);
    } catch {
      dialog.error('Não foi possível enviar o avatar.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      await uploadAndSetAvatar(result.assets[0].uri);
    }
  };

  const handleGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      await uploadAndSetAvatar(result.assets[0].uri);
    }
  };

  const handleAvatarPress = () => {
    Alert.alert('Foto de perfil', undefined, [
      { text: 'Tirar foto', onPress: handleCamera },
      { text: 'Escolher da galeria', onPress: handleGallery },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      dialog.warning('Informe o nome.');
      return;
    }
    setSubmitting(true);
    try {
      const updated = await userService.updateProfile({
        name: trimmedName,
        // store only digits — mask is presentation-only
        phone: phone.replace(/\D/g, ''),
      });
      setUser(updated);
      dialog.success('Perfil atualizado!');
      navigation.goBack();
    } catch {
      dialog.error('Não foi possível salvar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <HeroHeader
        title="EDITAR PERFIL"
        watermark="EDIT"
        onBack={() => navigation.goBack()}
        rounded
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar */}
          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={handleAvatarPress}
            activeOpacity={0.85}
          >
            <View style={styles.avatarCircle}>
              {uploadingAvatar ? (
                <ActivityIndicator color={colors.primary} />
              ) : user?.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarLetter}>
                  {(user?.name ?? 'J').charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Toque para alterar a foto</Text>

          {/* Name field */}
          <View style={styles.field}>
            <Text style={styles.label}>NOME</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color={colors.textPlaceholder} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Seu nome"
                placeholderTextColor={colors.textPlaceholder}
                autoCapitalize="words"
                returnKeyType="next"
                maxLength={100}
              />
            </View>
          </View>

          {/* Phone field */}
          <View style={styles.field}>
            <Text style={styles.label}>TELEFONE</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="call-outline" size={18} color={colors.textPlaceholder} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={(v) => setPhone(formatPhoneBR(v))}
                placeholder="(00) 00000-0000"
                placeholderTextColor={colors.textPlaceholder}
                keyboardType="phone-pad"
                returnKeyType="done"
                maxLength={15}
              />
            </View>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Sticky save button */}
        <View style={styles.saveBar}>
          <ChevronButton
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSave}
            disabled={!name.trim() || submitting}
            icon={<Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />}
          >
            {submitting ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
          </ChevronButton>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.xxl },

  // Avatar
  avatarWrap: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: spacing.xs,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 28,
  },
  avatarLetter: {
    fontFamily: fonts.title.regular,
    fontSize: 40,
    color: colors.primary,
    lineHeight: 1,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  avatarHint: {
    alignSelf: 'center',
    fontFamily: fonts.text.medium,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.xxl,
  },

  // Fields
  field: { marginBottom: spacing.xl },
  label: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.textPlaceholder,
    letterSpacing: typography.letterSpacing.extraWide,
    marginBottom: spacing.sm,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 52,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: typography.sizes.input,
    fontFamily: fonts.text.regular,
    paddingVertical: 0,
  },

  // Save bar
  saveBar: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
});
