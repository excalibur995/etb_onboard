// api/client.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:1337/api',
});

// Store ETags in memory (or AsyncStorage for persistence)
const etagCache = new Map<string, string>();

api.interceptors.request.use(config => {
  const etag = etagCache.get(config.url || '');
  if (etag) {
    config.headers['If-None-Match'] = etag;
  }
  return config;
});

api.interceptors.response.use(
  response => {
    const etag = response.headers.etag;
    if (etag && response.config.url) {
      etagCache.set(response.config.url, etag);
    }
    return response;
  },
  error => {
    // 304 means cached version is still valid
    if (error.response?.status === 304) {
      return Promise.reject({ ...error, isCached: true });
    }
    return Promise.reject(error);
  },
);

export default api;
