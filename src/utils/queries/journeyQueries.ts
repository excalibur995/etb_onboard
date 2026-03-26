import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useRegion } from '../../hooks/useRegion';
import { useLanguageStore } from '../../store/useLanguageStore';
import { Journey, SDUIScreen } from '../../types/api';
import {
  fetchJourney,
  fetchJourneys,
  fetchLang,
  fetchScreen,
} from '../api/journey';
import { injectIntoI18next } from '../i18n';
import { queryClient } from '../queryClient';

export const journeyKeys = {
  journeys: () => ['journeys'] as const,
  journey: (journeyId: string) => ['journey', journeyId] as const,
  screen: (screenId: string) => ['screen', screenId] as const,
};

export const useJourneys = () =>
  useQuery<Journey[]>({
    queryKey: journeyKeys.journeys(),
    queryFn: fetchJourneys,
    staleTime: 0,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

export const useLang = (locale: string = 'en') => {
  const { setLanguage, setLanguageContent } = useLanguageStore();
  const { data, isSuccess, ...rest } = useQuery({
    queryKey: ['lang', locale],
    queryFn: () => fetchLang(locale),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,

    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  useEffect(() => {
    if (isSuccess && data) {
      const contents = (
        data as unknown as { contents: Record<string, unknown> }
      ).contents;

      setLanguageContent(contents);
      injectIntoI18next(locale, contents);
    }
  }, [isSuccess, data, locale, setLanguage, setLanguageContent]);

  return { data, isSuccess, ...rest };
};

export const preloadJourney = (journeyId: string) => {
  return queryClient.prefetchQuery({
    queryKey: journeyKeys.journey(journeyId),
    queryFn: () => fetchJourney(journeyId),
    staleTime: 30 * 1000,
  });
};

export const useJourney = (journeyId?: string) =>
  useQuery<Journey>({
    enabled: !!journeyId,
    queryKey: journeyKeys.journey(journeyId!),
    queryFn: () => fetchJourney(journeyId!),
    staleTime: 0,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2,
    retryDelay: 500,
  });

export const useScreen = (screenId: string | null) => {
  const { currentLocale } = useRegion();
  return useQuery<SDUIScreen>({
    queryKey: journeyKeys.screen(screenId!),
    queryFn: () => fetchScreen(screenId!, currentLocale),
    enabled: !!screenId,
    staleTime: 0,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
