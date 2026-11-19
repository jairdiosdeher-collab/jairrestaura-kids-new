import React from 'react';
import { CheckCircle2, HeartHandshake, MessageCircle, Users } from 'lucide-react';
import { AppProgress } from '../types/app';
import { FAMILY_VALUES } from '../data/modulesData';
import { audioEngine } from '../services/audioEngine';

interface FamilyValuesModuleProps {
  progress: AppProgress;
  onToggleValue: (valueId: string) => void;
}

export const FamilyValuesModule: React.FC<FamilyValuesModuleProps> = ({
  progress,
  onToggleValue,
}) => {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-lime-700 dark:text-lime-400">
              Módulo 09 · Familia y Valores
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-stone-900 sm:text-3xl dark:text-stone-50">
              Valores Cristianos para Conversar y Practicar en Casa
            </h2>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
              Diseñado para que papás, abuelitos y niños lean un versículo juntos, dialoguen y
              practiquen una acción amable durante la semana.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-lime-50 px-4 py-2.5 text-sm font-bold text-lime-800 dark:bg-lime-950/50 dark:text-lime-300">
            <Users className="h-5 w-5" />
            <span className="font-mono-nums">{progress.completedValues.length}/6 practicados</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {FAMILY_VALUES.map((val) => {
          const done = progress.completedValues.includes(val.id);
          return (
            <article
              key={val.id}
              className="flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-extrabold text-stone-900 dark:text-stone-50">
                    {val.title}
                  </h3>
                  <HeartHandshake className="h-5 w-5 text-lime-700 dark:text-lime-400 shrink-0" />
                </div>

                <p className="text-xs font-bold text-amber-700 dark:text-amber-400">{val.verse}</p>
                <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                  {val.summary}
                </p>

                <div className="rounded-2xl bg-stone-50 p-4 text-xs space-y-2 dark:bg-slate-950/60">
                  <p className="text-stone-800 dark:text-stone-200">
                    <strong>Reto en familia:</strong> {val.familyActivity}
                  </p>
                  <p className="flex items-start gap-1.5 text-stone-600 dark:text-stone-300">
                    <MessageCircle className="mt-0.5 h-3.5 w-3.5 text-sky-600 shrink-0" />
                    <span>
                      <strong>Charla en la mesa:</strong> {val.discussionQuestion}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onToggleValue(val.id);
                  if (!done) audioEngine.playSuccess(progress.settings.soundEnabled);
                }}
                className={`mt-5 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition ${
                  done
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'border border-stone-300 bg-white text-stone-800 hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-100'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                {done ? 'Practicado en familia' : 'Marcar como practicado (+5 ★)'}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
};
