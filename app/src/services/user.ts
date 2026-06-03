import api from './api';

export const userService = {
  updateLocation: (latitude: number, longitude: number) =>
    api.patch('/users/me/location', { latitude, longitude }).then((r) => r.data),

  updateProfile: (data: { name?: string; phone?: string; bio?: string }) =>
    api.patch('/users/me', data).then((r) => r.data),
};
