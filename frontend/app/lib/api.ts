import axios, { AxiosHeaders } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

let accessToken: string | null = null;

export const setApiToken = (token: string | null) => {
  accessToken = token;
};

export const loadStoredApiToken = () => {
  if (typeof window === 'undefined') return null;
  const storedToken = window.localStorage.getItem('cryptosentinel_token');
  accessToken = storedToken;
  return storedToken;
};

export const clearApiToken = () => {
  accessToken = null;
};

apiClient.interceptors.request.use((config) => {
  const token = accessToken || loadStoredApiToken();
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

export const api = {
  health: () => apiClient.get('/health'),
  register: (payload: {
    username: string;
    email: string;
    password: string;
    riskPreference?: string;
  }) => apiClient.post('/auth/register', payload),
  login: (payload: { email: string; password: string }) =>
    apiClient.post('/auth/login', payload),
  profile: () => apiClient.get('/auth/profile'),
  getPrices: () => apiClient.get('/prices'),
  getPortfolio: () => apiClient.get('/portfolio'),
  getRisk: () => apiClient.get('/risk'),
  getSentiment: () => apiClient.get('/sentiment'),
  getStrategy: (mode?: 'conservative' | 'moderate' | 'aggressive') =>
    apiClient.get('/strategy', { params: mode ? { mode } : {} }),
  simulateStrategy: (payload: { asset: string; amount: number }) =>
    apiClient.post('/strategy/simulate', payload),
  getAlerts: () => apiClient.get('/alerts'),
  buyOrder: (coin: string, amount: number) =>
    apiClient.post('/buy', { coin, amount }),
  sellOrder: (coin: string, amount: number) =>
    apiClient.post('/sell', { coin, amount }),
};

export default apiClient;
