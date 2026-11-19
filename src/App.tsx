import React, { Suspense, lazy, useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Compass,
  Gamepad2,
  Moon,
  Music,
  ShieldCheck,
  Star,
  Sun,
} from 'lucide-react';
import { ModuleId } from './types/app';
import { MODULES } from './data/modulesData';
import { useAppState } from './hooks/useAppState';
import { OfflineAndUpdateBanners, PWAInstallButton } from './components/PWAControls';
import { ParentalSpaceModal } from './components/ParentalSpaceModal';
import { audioEngine } from './services/audioEngine';

const KingdomModule = lazy(() =>
  import('./modules/KingdomModule').then((m) => ({ default: m.KingdomModule }))
);
const StoriesModule = lazy(() =>
  import('./modules/StoriesModule').then((m) => ({ default: m.StoriesModule }))
);
const MusicModule = lazy(() =>
  import('./modules/MusicModule').then((m) => ({ default: m.MusicModule }))
);
const GamesModule = lazy(() =>
  import('./modules/GamesModule').then((m) => ({ default: m.GamesModule }))
);
const CreativityModule = lazy(() =>
  import('./modules/CreativityModule').then((m) => ({ default: m.CreativityModule }))
);
const PrayerCornerModule = lazy(() =>
  import('./modules/PrayerCornerModule').then((m) => ({ default: m.PrayerCornerModule }))
);
const CharactersModule = lazy(() =>
  import('./modules/CharactersModule').then((m) => ({ default: m.CharactersModule }))
);
const MissionsModule = lazy(() =>
  import('./modules/MissionsModule').then((m) => ({ default: m.MissionsModule }))
);
const FamilyValuesModule = lazy(() =>
  import('./modules/FamilyValuesModule').then((m) => ({ default: m.FamilyValuesModule }))
);
const PastorJairModule = lazy(() =>
  import('./modules/PastorJairModule').then((m) => ({ default: m.PastorJairModule }))
);

const PRIMARY_NAV: { id: ModuleId; label: string }[] = [
  { id: 'kingdom', label: 'Reino 3D' },
  { id: 'stories', label: 'Historias' },
  { id: 'music', label: 'Música' },
  { id: 'games', label: 'Juegos' },
  { id: 'pastor', label: 'Pastor Jair' },
];

export default function App() {
  const {
    progress,
    setAgeGroup,
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
  } = useAppState();

  const [activeModule, setActiveModule] = useState<ModuleId>('kingdom');
  const [parentalOpen, setParentalOpen] = useState(false);
  const [restReminderShown, setRestReminderShown] = useState(false);

  useEffect(() => {
    setRestReminderShown(false);
    const limit = progress.settings.screenTimeLimitMin;
    if (!limit || limit <= 0) return;
    const id = window.setTimeout(() => {
      setRestReminderShown(true);
      audioEngine.playChime(progress.settings.soundEnabled);
    }, limit * 60 * 1000);
    return () => window.clearTimeout(id);
  }, [progress.settings.screenTimeLimitMin, progress.settings.soundEnabled]);

  const navigateTo = (mod: ModuleId) => {
    audioEngine.stopSong();
    audioEngine.stopNarration();
    audioEngine.stopAmbientKingdom();
    setActiveModule(mod);
    markModuleVisited(mod);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentModDef = MODULES.find((m) => m.id === activeModule);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50/70 via-stone-50 to-amber-50/40 text-stone-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-stone-100">
      {/* Three-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 border-b border-amber-200/70 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3 sm:px-6">
          {/* Zone 1: Single-element Wordmark */}
          <button
            type="button"
            onClick={() => navigateTo('kingdom')}
            className="font-display text-lg font-extrabold tracking-tight text-amber-700 dark:text-amber-400 whitespace-nowrap shrink-0"
          >
            JAIRRESTAURA KIDS
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-stone-600 dark:text-stone-300">
            {PRIMARY_NAV.map((item) => {
              const active = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    audioEngine.playChime(progress.settings.soundEnabled);
                    navigateTo(item.id);
                  }}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                    active
                      ? 'border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-300'
                      : 'border-transparent hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setParentalOpen(true)}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-700 whitespace-nowrap shrink-0"
            >
              <ShieldCheck className="h-4 w-4" />
              Espacio Padres
            </button>
          </div>
        </div>
      </header>

      {/* Adventure Status Bar (Clean on Kingdom Home; Return + World Switcher in Sub-modules) */}
      <div className="border-b border-amber-200/50 bg-amber-50/60 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          {activeModule === 'kingdom' ? (
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
              <span>¡Bienvenido, {progress.explorerName}!</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-600 dark:text-stone-400">
                Nivel {progress.ageGroup} años
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => navigateTo('kingdom')}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-sm hover:bg-amber-700 whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Reino
              </button>
              <span className="text-xs font-bold text-stone-700 dark:text-stone-200 whitespace-nowrap">
                {currentModDef?.title}
              </span>
              <div className="hidden lg:flex items-center gap-1.5 ml-2">
                {MODULES.filter((m) => m.id !== 'kingdom').map((m) => {
                  const active = activeModule === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => navigateTo(m.id)}
                      className={`min-h-[36px] rounded-xl px-2.5 py-1 text-xs font-semibold transition whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950'
                          : 'bg-white text-stone-700 hover:bg-stone-200/70 dark:bg-slate-800 dark:text-stone-200'
                      }`}
                    >
                      {m.shortTitle}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Explorer Stars, Day/Night Switch & PWA Install */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => navigateTo('missions')}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3 py-1.5 font-mono-nums text-xs font-extrabold text-amber-800 shadow-xs dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300 whitespace-nowrap"
            >
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              {progress.stars} ★
            </button>

            <button
              type="button"
              onClick={() => updateSettings({ darkMode: !progress.settings.darkMode })}
              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                progress.settings.darkMode
                  ? 'border-amber-500/40 bg-slate-800 text-amber-200 hover:bg-slate-700'
                  : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
              }`}
              aria-label={progress.settings.darkMode ? 'Activar modo día' : 'Activar modo noche'}
            >
              {progress.settings.darkMode ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600" />
              )}
              <span className="hidden sm:inline">{progress.settings.darkMode ? 'Día' : 'Noche'}</span>
            </button>

            <PWAInstallButton />
          </div>
        </div>
      </div>

      {/* Main Content Stage */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Suspense
          fallback={
            <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-stone-200 bg-white p-8 text-sm font-semibold text-stone-600 dark:border-slate-800 dark:bg-slate-900 dark:text-stone-300">
              Cargando aventura del Reino...
            </div>
          }
        >
          {activeModule === 'kingdom' && (
            <KingdomModule
              progress={progress}
              onSelectModule={navigateTo}
              onSelectAgeGroup={setAgeGroup}
            />
          )}
          {activeModule === 'stories' && (
            <StoriesModule
              progress={progress}
              onCompleteStory={completeStory}
              onChangeVoiceMode={(mode) => updateSettings({ voiceMode: mode })}
            />
          )}
          {activeModule === 'music' && (
            <MusicModule progress={progress} onCompleteSong={completeSong} />
          )}
          {activeModule === 'games' && (
            <GamesModule progress={progress} onCompleteGame={completeGame} />
          )}
          {activeModule === 'creativity' && (
            <CreativityModule progress={progress} onSaveArtwork={saveArtwork} />
          )}
          {activeModule === 'prayer' && (
            <PrayerCornerModule progress={progress} onAddPrayer={addPrayer} />
          )}
          {activeModule === 'characters' && <CharactersModule progress={progress} />}
          {activeModule === 'missions' && (
            <MissionsModule
              progress={progress}
              onClaimMission={claimMission}
              onNavigateModule={navigateTo}
            />
          )}
          {activeModule === 'family' && (
            <FamilyValuesModule progress={progress} onToggleValue={toggleFamilyValue} />
          )}
          {activeModule === 'pastor' && <PastorJairModule progress={progress} />}
        </Suspense>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 pb-24 md:pb-6 text-xs text-stone-600 dark:border-slate-800 dark:bg-slate-950 dark:text-stone-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <p>
            <strong>JAIRRESTAURA KIDS</strong> · ¡Pequeños exploradores, grandes aventuras con Jesús!
          </p>
          <p>
            Creado por JAIRRESTAURA – Pastor Jair Hernández · Gratuito, sin publicidad y sin recolección de datos.
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (<= 15% mobile height cap) */}
      <nav
        aria-label="Navegación móvil principal"
        className="fixed bottom-0 left-0 right-0 z-30 grid h-14 grid-cols-5 border-t border-stone-200 bg-white/95 backdrop-blur-md md:hidden dark:border-slate-800 dark:bg-slate-950/95"
      >
        {(
          [
            { id: 'kingdom', label: 'Reino', icon: <Compass className="h-4 w-4" /> },
            { id: 'stories', label: 'Historias', icon: <BookOpen className="h-4 w-4" /> },
            { id: 'music', label: 'Música', icon: <Music className="h-4 w-4" /> },
            { id: 'games', label: 'Juegos', icon: <Gamepad2 className="h-4 w-4" /> },
            { id: 'pastor', label: 'Pastor', icon: <Star className="h-4 w-4" /> },
          ] as { id: ModuleId; label: string; icon: React.ReactNode }[]
        ).map((tab) => {
          const active = activeModule === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => navigateTo(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${
                active
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {restReminderShown && (
        <div className="fixed top-20 right-4 z-40 max-w-sm rounded-2xl border border-amber-300 bg-white p-4 shadow-xl dark:border-amber-700 dark:bg-slate-900">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-2 text-xs">
              <p className="font-bold text-stone-900 dark:text-stone-100">
                Tiempo de descanso visual ({progress.settings.screenTimeLimitMin} min)
              </p>
              <p className="text-stone-600 dark:text-stone-300">
                ¡Gran exploración! Recuerda descansar tus ojitos, tomar agua y compartir lo aprendido en familia.
              </p>
              <button
                type="button"
                onClick={() => setRestReminderShown(false)}
                className="min-h-[36px] rounded-lg bg-amber-600 px-3 py-1 font-bold text-white"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      <ParentalSpaceModal
        isOpen={parentalOpen}
        onClose={() => setParentalOpen(false)}
        progress={progress}
        onUpdateSettings={updateSettings}
        onChangeAgeGroup={setAgeGroup}
        onResetProgress={resetAllProgress}
      />

      <OfflineAndUpdateBanners />
    </div>
  );
}
