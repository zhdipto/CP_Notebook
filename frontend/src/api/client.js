import axios from 'axios';
import { getDeviceId } from './device';

const BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({ baseURL: BASE_URL });

// There are no accounts and no tokens to refresh, so the whole
// refresh-and-retry interceptor from the JWT design is gone. Identity is one
// header, attached to every request.
//
// Read on each request rather than captured once at module load, so a device id
// created mid-session (or cleared from another tab) is always current.
api.interceptors.request.use((config) => {
  const deviceId = getDeviceId();
  if (deviceId) {
    config.headers['X-Device-Id'] = deviceId;
  }
  return config;
});

export default api;
