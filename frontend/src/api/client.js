import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

// Access token: in-memory only, never persisted. Gone on reload — smallest
// possible exposure window if this app were ever hit by an XSS bug.
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

// Refresh token: persisted so the user isn't forced to re-login on every
// page reload. localStorage is JS-readable (the "common simplified choice"
// tradeoff from Phase 3, not the maximally secure httpOnly-cookie design,
// which would need server-side changes we haven't built).
export function setRefreshToken(token) {
  localStorage.setItem('refresh_token', token);
}

export function getRefreshToken() {
  return localStorage.getItem('refresh_token');
}

export function clearTokens() {
  accessToken = null;
  localStorage.removeItem('refresh_token');
}

const api = axios.create({ baseURL: BASE_URL });

// Request interceptor — attach the access token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor: refresh-and-retry on 401 ---
//
// The race condition this guards against: if three requests all 401 at
// roughly the same moment (e.g. a page firing several parallel API calls
// right as the access token expires), a naive handler would have each one
// independently call the refresh endpoint. With ROTATE_REFRESH_TOKENS +
// BLACKLIST_AFTER_ROTATION on (from Phase 3), the first refresh call
// blacklists the refresh token — so the second and third concurrent calls,
// which grabbed the OLD refresh token before any of them saw a new one,
// come back "token is blacklisted" and the user gets logged out even
// though their session was actually fine.
//
// The fix: only one refresh is ever in flight. The first 401 starts the
// refresh and stores the PROMISE itself (not the result) in a shared
// variable. Every 401 that arrives while that promise is still pending
// just awaits the SAME promise instead of starting its own. Once it
// resolves, everyone retries their original request with the new token.

let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  // Plain axios here, not `api` — going through `api` would re-enter these
  // same interceptors if this call itself ever failed, recursively.
  const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
    refresh: refreshToken,
  });
  setAccessToken(response.data.access);
  if (response.data.refresh) {
    // ROTATE_REFRESH_TOKENS means a new refresh token comes back too.
    setRefreshToken(response.data.refresh);
  }
  return response.data.access;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      // Not a 401, or this exact request has already been retried once —
      // don't retry forever, just surface the error.
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          // Reset once settled so a FUTURE, unrelated 401 can trigger a
          // fresh refresh cycle instead of reusing a resolved/rejected one.
          refreshPromise = null;
        });
      }
      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearTokens();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

export default api;
