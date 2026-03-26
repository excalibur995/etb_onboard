import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { storage } from '../utils/kv';

export interface JourneySession {
  currentScreenIndex: number;
  journeyState: Record<string, unknown>;
}

// ── MMKV adapter for Zustand persist ──────────────────────────────────────────
const mmkvStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: name => storage.getString(name) ?? null,
  removeItem: name => storage.remove(name),
};

// ── Direct MMKV helpers (individual session keys) ─────────────────────────────
const SESSION_PREFIX = 'journey-session::';
const sessionKey = (journeyId: string) => `${SESSION_PREFIX}${journeyId}`;

const readSessionFromMMKV = (journeyId: string): JourneySession | null => {
  try {
    const raw = storage.getString(sessionKey(journeyId));
    return raw ? (JSON.parse(raw) as JourneySession) : null;
  } catch {
    return null;
  }
};

const writeSessionToMMKV = (journeyId: string, session: JourneySession) => {
  storage.set(sessionKey(journeyId), JSON.stringify(session));
};

const deleteSessionFromMMKV = (journeyId: string) => {
  storage.remove(sessionKey(journeyId));
};

// ── Store ──────────────────────────────────────────────────────────────────────
interface JourneyStoreState {
  sessions: Record<string, JourneySession>;

  getSession: (journeyId: string) => JourneySession | null;
  setSession: (journeyId: string, session: JourneySession) => void;
  updateSession: (journeyId: string, patch: Partial<JourneySession>) => void;
  clearSession: (journeyId: string | undefined) => void;
}

export const useJourneyStore = create<JourneyStoreState>()(
  persist(
    (set, get) => ({
      sessions: {},

      getSession: journeyId => {
        // Prefer in-memory (Zustand), fall back to direct MMKV read
        return get().sessions[journeyId] ?? readSessionFromMMKV(journeyId);
      },

      setSession: (journeyId, session) => {
        writeSessionToMMKV(journeyId, session);
        set(state => ({
          sessions: { ...state.sessions, [journeyId]: session },
        }));
      },

      updateSession: (journeyId, patch) => {
        set(state => {
          const current = state.sessions[journeyId] ??
            readSessionFromMMKV(journeyId) ?? {
              currentScreenIndex: 0,
              journeyState: {},
            };

          const newJourneyState = patch.journeyState
            ? { ...current.journeyState, ...patch.journeyState }
            : current.journeyState;

          const updated: JourneySession = {
            ...current,
            ...patch,
            journeyState: newJourneyState,
          };

          writeSessionToMMKV(journeyId, updated);

          return {
            sessions: { ...state.sessions, [journeyId]: updated },
          };
        });
      },

      clearSession: journeyId => {
        if (!journeyId) return;
        deleteSessionFromMMKV(journeyId);
        set(state => {
          const next = { ...state.sessions };
          delete next[journeyId];
          return { sessions: next };
        });
      },
    }),
    {
      name: 'journey-storage',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
