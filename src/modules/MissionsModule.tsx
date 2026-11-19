import React from 'react';
import { Award, CheckCircle2, Star, Trophy } from 'lucide-react';
import { AppProgress, ModuleId } from '../types/app';
import { EXPLORER_MISSIONS } from '../data/modulesData';
import { BIBLE_STORIES } from '../data/stories';
import { audioEngine } from '../services/audioEngine';

interface MissionsModuleProps {
  progress: AppProgress;
  onClaimMission: (missionId: string, bonusStars: number) => void;
  onNavigateModule: (moduleId: ModuleId) => void;
}

export const MissionsModule: React.FC<MissionsModuleProps> = ({
  progress,
  onClaimMission,
  onNavigateModule,
}) => {
  const rank =
    progress.stars >= 100
      ? 'Guardián de la Luz'
      : progress.stars >= 55
      ? 'Cronista Real'
      : progress.stars >= 25
      ? 'Aventurero Fiel'
      : 'Pequeño Explorador';

  return (
    <div className="space-y-8">
      {/* Rank & Trophy Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/40">
          <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">Rango Actual</p>
          <p className="mt-1 font-display text-xl font-extrabold text-amber-950 dark:text-amber-100">
            {rank}
          </p>
        </div>
        <div className="rounded-3xl border border-stone-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">Estrellas Totales</p>
          <p className="mt-1 font-mono-nums text-2xl font-extrabold text-stone-900 dark:text-stone-50 flex items-center gap-1.5">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            {progress.stars}
          </p>
        </div>
        <div className="rounded-3xl border border-stone-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">Historias Completadas</p>
          <p className="mt-1 font-mono-nums text-2xl font-extrabold text-stone-900 dark:text-stone-50">
            {progress.completedStories.length}/9
          </p>
        </div>
        <div className="rounded-3xl border border-stone-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">Juegos Ganados</p>
          <p className="mt-1 font-mono-nums text-2xl font-extrabold text-stone-900 dark:text-stone-50">
            {progress.completedGames.length}/8
          </p>
        </div>
      </div>

      {/* Explorer Missions */}
      <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
              Módulo 08 · Misiones y Recompensas
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-stone-900 dark:text-stone-50">
              Retos del Explorador
            </h2>
          </div>
          <Trophy className="h-7 w-7 text-amber-500" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {EXPLORER_MISSIONS.map((m) => {
            const status = m.check({
              completedStories: progress.completedStories,
              completedGames: progress.completedGames,
              completedSongs: progress.completedSongs,
              completedValues: progress.completedValues,
              prayersCount: progress.prayers.length,
              artworksCount: progress.artworks.length,
              visitedModules: progress.visitedModules,
            });
            const ready = status.current >= status.total;
            const claimed = progress.claimedMissions.includes(m.id);
            const pct = Math.min(100, Math.round((status.current / status.total) * 100));

            return (
              <div
                key={m.id}
                className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-stone-50 p-5 dark:border-slate-800 dark:bg-slate-950/60"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-base font-bold text-stone-900 dark:text-stone-100">
                      {m.title}
                    </h3>
                    <span className="font-mono-nums text-xs font-bold text-amber-700 dark:text-amber-400">
                      +{m.bonusStars} ★
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-stone-600 dark:text-stone-300">{m.description}</p>

                  <div className="mt-3 space-y-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="font-mono-nums text-[11px] text-stone-500 dark:text-stone-400">
                      Progreso: {status.current}/{status.total}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  {claimed ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Recompensa reclamada
                    </span>
                  ) : ready ? (
                    <button
                      type="button"
                      onClick={() => {
                        onClaimMission(m.id, m.bonusStars);
                        audioEngine.playSuccess(progress.settings.soundEnabled);
                      }}
                      className="min-h-[42px] rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
                    >
                      Reclamar +{m.bonusStars} estrellas
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onNavigateModule(m.targetModule)}
                      className="min-h-[42px] rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-200"
                    >
                      Ir a completar misión
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Story Medals Collection */}
      <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-display text-xl font-extrabold text-stone-900 dark:text-stone-50 mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-sky-600" />
          Medallero de Historias Bíblicas
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {BIBLE_STORIES.map((s) => {
            const unlocked = progress.completedStories.includes(s.id);
            return (
              <div
                key={s.id}
                className={`flex items-center gap-3 rounded-2xl border p-4 ${
                  unlocked
                    ? 'border-amber-300 bg-amber-50/70 dark:border-amber-800 dark:bg-amber-950/30'
                    : 'border-stone-200 bg-stone-50 opacity-60 dark:border-slate-800 dark:bg-slate-950'
                }`}
              >
                <Award
                  className={`h-6 w-6 shrink-0 ${
                    unlocked ? 'text-amber-600' : 'text-stone-400'
                  }`}
                />
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-bold text-stone-900 dark:text-stone-100">
                    {s.rewardName}
                  </p>
                  <p className="truncate text-xs text-stone-500 dark:text-stone-400">
                    {unlocked ? `Desbloqueada · ${s.title}` : `Pendiente · ${s.title}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
