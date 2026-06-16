import { Platform } from 'react-native';
import api from './api';
import { validateImageFile } from '../utils/image-validation';

export const userService = {
  updateLocation: (latitude: number, longitude: number) =>
    api.patch('/users/me/location', { latitude, longitude }).then((r) => r.data),

  updateProfile: (data: { name?: string; phone?: string; bio?: string }) =>
    api.patch('/users/me', data).then((r) => r.data),

  uploadAvatar: async (uri: string) => {
    const validation = await validateImageFile(uri);
    if (!validation.ok) {
      throw new Error(validation.reason ?? 'Arquivo inválido');
    }

    const formData = new FormData();

    const filename = uri.split('/').pop() ?? 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const ext = match?.[1]?.toLowerCase() ?? 'jpg';

    // Use the magic-bytes-validated mime; fall back to extension heuristic only
    // if detection somehow returned nothing.
    const mimeType =
      validation.detectedType ??
      (ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg');

    formData.append('file', {
      uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
      name: filename,
      type: mimeType,
    } as any);

    const { data } = await api.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
