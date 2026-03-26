import type { Journey, SDUIScreen } from '../../types/api';
import api from './client';

export const fetchJourneys = async (): Promise<Journey[]> => {
  const res = await api.get('/journeys');
  return res.data?.data;
};

export const fetchLang = async (locale = 'en'): Promise<Journey[]> => {
  const res = await api.get(`/lang?locale=${locale}`);

  return res.data?.data;
};

export const fetchJourney = async (journeyId: string): Promise<Journey> => {
  const res = await api.get(`/journeys/${journeyId}`);
  return res.data?.data;
};

export const fetchScreen = async (
  screenId: string,
  language?: string,
): Promise<SDUIScreen> => {
  const res = await api.get(`/screens/${screenId}?locale=${language}`);
  return res.data?.data;
};
