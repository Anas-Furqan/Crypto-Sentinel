import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

export const api = {
  health: () => apiClient.get('/health'),
  getPrices: () => apiClient.get('/prices'),
  getPortfolio: () => apiClient.get('/portfolio'),
  getRisk: () => apiClient.get('/risk'),
  getSentiment: () => apiClient.get('/sentiment'),
  buyOrder: (coin: string, amount: number) =>
    apiClient.post('/buy', { coin, amount }),
  sellOrder: (coin: string, amount: number) =>
    apiClient.post('/sell', { coin, amount }),
};

export default apiClient;
