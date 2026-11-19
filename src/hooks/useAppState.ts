import { useCallback, useEffect, useState } from 'react';
import {
  AgeGroup,
  AppProgress,
  GameId,
  ModuleId,
  ParentalSettings,
  PrayerEntry,
  SavedArtwork,
} from '../types/app';

const STORAGE_KEY = 'jairrestaura_kids_v1_progress';

const DEFAULT_PROGRESS: AppProgress = {
  explorerName: 'Pequeño Explorador',
  ageGroup: '6-8',
  stars: 10,
  completedStories: [],
  completedGames: [],
  completedSongs: [],
  completedValues: [],
  claimedMissions: [],
  visitedModules: ['kingdom'],
  prayers: [
    {
      id: 'initial-prayer',
      date: 'Hoy',
      gratitude: 'Gracias Jesús por mi familia, los árboles y Tu gran amor.',
      prayerFor: 'Por todos los niños del mundo para que conozcan Tu paz.',
      trustStatement: 'Confío en que Tú caminas conmigo cada día.',
    },
  ],
  artworks: [],
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    voiceMode: 'kids',
    ageLocked: false,
    screenTimeLimitMin: 0,
    darkMode: false,
  },
};

function loadInitialProgress(): AppProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<AppProgress>;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      settings: {
        ...DEFAULT_PROGRESS.settings,
        ...(parsed.settings || {}),
      },
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function useAppState() {
  const [progress, setProgress] = useState<AppProgress>(loadInitialProgress);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore quota errors gracefully
    }
  }, [progress]);

  useEffect(() => {
    const root = document.documentElement;
    if (progress.settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [progress.settings.darkMode]);

  const setAgeGroup = useCallback((ageGroup: AgeGroup) => {
    setProgress((prev) => ({ ...prev, ageGroup }));
  }, []);

  const setExplorerName = useCallback((explorerName: string) => {
    const clean = explorerName.trim().slice(0, 24) || 'Pequeño Explorador';
    setProgress((prev) => ({ ...prev, explorerName: clean }));
  }, []);

  const updateSettings = useCallback((patch: Partial<ParentalSettings>) => {
    setProgress((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
    }));
  }, []);

  const markModuleVisited = useCallback((moduleId: ModuleId) => {
    setProgress((prev) => {
      if (prev.visitedModules.includes(moduleId)) return prev;
      return {
        ...prev,
        visitedModules: [...prev.visitedModules, moduleId],
      };
    });
  }, []);

  const completeStory = useCallback((storyId: string, starsEarned: number) => {
    setProgress((prev) => {
      const alreadyDone = prev.completedStories.includes(storyId);
      return {
        ...prev,
        stars: prev.stars + (alreadyDone ? 2 : starsEarned),
        completedStories: alreadyDone ? prev.completedStories : [...prev.completedStories, storyId],
      };
    });
  }, []);

  const completeGame = useCallback((gameId: GameId, starsEarned: number) => {
    setProgress((prev) => {
      const alreadyDone = prev.completedGames.includes(gameId);
      return {
        ...prev,
        stars: prev.stars + (alreadyDone ? 3 : starsEarned),
        completedGames: alreadyDone ? prev.completedGames : [...prev.completedGames, gameId],
      };
    });
  }, []);

  const completeSong = useCallback((songId: string) => {
    setProgress((prev) => {
      const alreadyDone = prev.completedSongs.includes(songId);
      return {
        ...prev,
        stars: prev.stars + (alreadyDone ? 1 : 5),
        completedSongs: alreadyDone ? prev.completedSongs : [...prev.completedSongs, songId],
      };
    });
  }, []);

  const toggleFamilyValue = useCallback((valueId: string) => {
    setProgress((prev) => {
      const exists = prev.completedValues.includes(valueId);
      return {
        ...prev,
        stars: prev.stars + (exists ? 0 : 5),
        completedValues: exists
          ? prev.completedValues.filter((v) => v !== valueId)
          : [...prev.completedValues, valueId],
      };
    });
  }, []);

  const claimMission = useCallback((missionId: string, bonusStars: number) => {
    setProgress((prev) => {
      if (prev.claimedMissions.includes(missionId)) return prev;
      return {
        ...prev,
        stars: prev.stars + bonusStars,
        claimedMissions: [...prev.claimedMissions, missionId],
      };
    });
  }, []);

  const addPrayer = useCallback((entry: Omit<PrayerEntry, 'id' | 'date'>) => {
    const newEntry: PrayerEntry = {
      ...entry,
      id: `prayer-${Date.now()}`,
      date: new Date().toLocaleDateString('es-419', { day: 'numeric', month: 'short' }),
    };
    setProgress((prev) => ({
      ...prev,
      stars: prev.stars + 4,
      prayers: [newEntry, ...prev.prayers].slice(0, 20),
    }));
  }, []);

  const saveArtwork = useCallback((artwork: Omit<SavedArtwork, 'id' | 'createdAt'>) => {
    const item: SavedArtwork = {
      ...artwork,
      id: `art-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('es-419', { day: 'numeric', month: 'short' }),
    };
    setProgress((prev) => ({
      ...prev,
      stars: prev.stars + 5,
      artworks: [item, ...prev.artworks].slice(0, 12),
    }));
  }, []);

  const resetAllProgress = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
    setProgress(DEFAULT_PROGRESS);
  }, []);

  return {
    progress,
    setAgeGroup,
    setExplorerName,
    updateSettings,
    markModuleVisited,
    completeStory,
    completeGame,
    completeSong,
    toggleFamilyValue,
    claimMission,
    addPrayer,
    saveArtwork,
    resetAllProgress,
  };
}
