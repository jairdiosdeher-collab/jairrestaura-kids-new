import React, { useState } from 'react';
import { Sparkles, Volume2 } from 'lucide-react';
import { AppProgress, CharacterExpression, CharacterId } from '../types/app';
import { CHARACTER_LIST, CHARACTERS } from '../data/characters';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { audioEngine } from '../services/audioEngine';

interface CharactersModuleProps {
  progress: AppProgress;
}

const EXPRESSIONS: { id: CharacterExpression; label: string }[] = [
  { id: 'alegre', label: 'Alegre' },
  { id: 'curioso', label: 'Curioso' },
  { id: 'asombrado', label: 'Asombrado' },
  { id: 'tierno', label: 'Tierno' },
  { id: 'animando', label: 'Animando' },
];

export const CharactersModule: React.FC<CharactersModuleProps> = ({ progress }) => {
  const [selectedId, setSelectedId] = useState<CharacterId>('lucas');
  const [expression, setExpression] = useState<CharacterExpression>('alegre');
  const [bounceKey, setBounceKey] = useState(0);

  const char = CHARACTERS[selectedId];

  const triggerReaction = (expr: CharacterExpression) => {
    setExpression(expr);
    setBounceKey((k) => k + 1);
    audioEngine.playCharacterSound(selectedId, progress.settings.soundEnabled);
    if (progress.settings.voiceMode === 'kids' && progress.settings.soundEnabled) {
      audioEngine.speakKidsVoice(char.reactions[expr], selectedId, true);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
          Módulo 07 · Mis Amigos del Reino
        </p>
        <h2 className="mt-1 font-display text-2xl font-extrabold text-stone-900 sm:text-3xl dark:text-stone-50">
          Conoce a Lucas, Luna, León, Cordero y Estrellita
        </h2>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
          Selecciona un personaje, cambia sus expresiones y escucha sus mensajes preparados para tu edad ({progress.ageGroup} años).
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {CHARACTER_LIST.map((item) => {
            const active = item.id === selectedId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedId(item.id);
                  setExpression('alegre');
                  audioEngine.playCharacterSound(item.id, progress.settings.soundEnabled);
                }}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                  active
                    ? 'border-teal-500 bg-teal-50 dark:border-teal-500 dark:bg-teal-950/40'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 dark:border-slate-800 dark:bg-slate-800'
                }`}
              >
                <CharacterAvatar character={item.id} size="md" animated={active} />
                <div>
                  <p className="font-display text-sm font-bold text-stone-900 dark:text-stone-100">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">{item.role}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Character Interactive Stage */}
      <div className="grid grid-cols-1 gap-6 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm lg:grid-cols-12 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-stone-50 p-6 lg:col-span-4 dark:bg-slate-950/70">
          <div key={bounceKey} className="transition-transform duration-200 hover:scale-105">
            <CharacterAvatar character={selectedId} expression={expression} size="xl" />
          </div>
          <p className="mt-4 font-display text-2xl font-extrabold text-stone-900 dark:text-stone-50">
            {char.name}
          </p>
          <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
            {char.role} · {char.badgeLabel}
          </p>
        </div>

        <div className="flex flex-col justify-between space-y-5 lg:col-span-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">{char.tagline}</p>
            <p className="text-base leading-relaxed text-stone-700 dark:text-stone-200">
              {char.description}
            </p>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                Diálogo actual ({EXPRESSIONS.find((e) => e.id === expression)?.label})
              </p>
              <p className="mt-1 font-display text-lg font-bold text-stone-900 dark:text-stone-100">
                “{char.reactions[expression]}”
              </p>
            </div>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Versículo favorito: <strong className="text-stone-800 dark:text-stone-200">{char.favoriteVerse}</strong>
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-stone-600 dark:text-stone-300">
              Prueba sus expresiones y reacciones:
            </p>
            <div className="flex flex-wrap gap-2">
              {EXPRESSIONS.map((expr) => (
                <button
                  key={expr.id}
                  type="button"
                  onClick={() => triggerReaction(expr.id)}
                  className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                    expression === expr.id
                      ? 'bg-teal-600 text-white'
                      : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-200'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {expr.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() =>
                  audioEngine.speakKidsVoice(
                    char.greetings[progress.ageGroup],
                    selectedId,
                    progress.settings.soundEnabled
                  )
                }
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
              >
                <Volume2 className="h-4 w-4" />
                Saludo para {progress.ageGroup} años
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
