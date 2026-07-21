import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

export async function loginRequest(username, password) {
  // Plain axios, NOT the shared `api` instance from client.js. A bad-
  // credentials 401 here means "wrong password," not "expired token" —
  // routing it through `api`'s response interceptor would make it try to
  // refresh using a refresh token that doesn't exist yet, fail, then
  // redirect back to /login anyway. Confusing and pointless for a login
  // failure specifically.
  const response = await axios.post(`${BASE_URL}/auth/token/`, { username, password });
  return response.data; // { access, refresh }
}

export async function registerRequest(username, email, password, firstName, lastName) {
  const response = await axios.post(`${BASE_URL}/auth/register/`, {
    username,
    email,
    password,
    first_name: firstName,
    last_name: lastName,
  });
  return response.data;
}

export async function silentRefresh(refreshToken) {
  const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh: refreshToken });
  return response.data; // { access, refresh }
}
