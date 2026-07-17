import api from './client';

export function getProfile() {
  return api.get('/auth/me/').then((res) => res.data);
}

export function updateProfile(data) {
  return api.patch('/auth/me/', data).then((res) => res.data);
}
