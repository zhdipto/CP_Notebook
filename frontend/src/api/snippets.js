import api from './client';

export function listSnippets(params) {
  return api.get('/snippets/', { params }).then((res) => res.data);
}

export function getSnippet(id) {
  return api.get(`/snippets/${id}/`).then((res) => res.data);
}

export function createSnippet(data) {
  return api.post('/snippets/', data).then((res) => res.data);
}

export function updateSnippet(id, data) {
  return api.patch(`/snippets/${id}/`, data).then((res) => res.data);
}

export function deleteSnippet(id) {
  return api.delete(`/snippets/${id}/`);
}

export function toggleFavorite(id) {
  return api.post(`/snippets/${id}/favorite/`).then((res) => res.data);
}

export function listMyFavorites(params) {
  return api.get('/snippets/favorites/', { params }).then((res) => res.data);
}
