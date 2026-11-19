import React, { useState } from 'react';
import { Compass, Heart, MapPin, Sparkles, Trophy, Volume2 } from 'lucide-react';
import { AppProgress, CharacterExpression, CharacterId, StoryScene } from '../types/app';
import { CHARACTER_LIST, CHARACTERS } from '../data/characters';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { ScenarioStage } from '../components/ScenarioStage';
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

const SCENARIO_VISITS: { theme: StoryScene['visualTheme']; label: string }[] = [
  { theme: 'valley', label: 'Colinas del Castillo' },
  { theme: 'star', label: 'Cielo de Estrellas' },
  { theme: 'palace', label: 'Palacio Real' },
  { theme: 'meadow', label: 'Pradera de Paz' },
  { theme: 'rainbow', label: 'Arcoíris de Promesas' },
];

export const CharactersModule: React.FC<CharactersModuleProps> = ({ progress }) => {
  const [selectedId, setSelectedId] = useState<CharacterId>('lucas');
  const [expression, setExpression] = useState<CharacterExpression>('alegre');
  const [scenarioTheme, setScenarioTheme] = useState<StoryScene['visualTheme']>('valley');
  const [activeTab, setActiveTab] = useState<'dialogue' | 'fact' | 'challenge'>('dialogue');
  const [bounceKey, setBounceKey] = useState(0);

  // Interactive expression mini-game state
  const [quizTarget, setQuizTarget] = useState<CharacterExpression>('asombrado');
  const [quizResult, setQuizResult] = useState<'idle' | 'correct' | 'try'>('idle');
  const [friendshipPoints, setFriendshipPoints] = useState(0);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);

  const char = CHARACTERS[selectedId];

  const selectCharacter = (id: CharacterId) => {
    setSelectedId(id);
    setExpression('alegre');
    setScenarioTheme(CHARACTERS[id].scenarioTheme);
    setQuizResult('idle');
    setVoiceNote(null);
    setBounceKey((k) => k + 1);
    audioEngine.playCharacterSound(id, progress.settings.soundEnabled);
  };

  const triggerReaction = (expr: CharacterExpression) => {
    setExpression(expr);
    setActiveTab('dialogue');
    setVoiceNote(null);
    setBounceKey((k) => k + 1);
    audioEngine.playCharacterSound(selectedId, progress.settings.soundEnabled);
    if (progress.settings.voiceMode === 'kids' && progress.settings.soundEnabled) {
      const res = audioEngine.speakKidsVoice(char.reactions[expr], selectedId, true);
      if (!res.startedSpeech && res.reason !== 'muted') {
        setVoiceNote(
          `Sin voz en español en este navegador: lee el mensaje de ${char.name} acompañado de su sonido musical.`
        );
      }
    }
  };

  const handleGuessMood = (guess: CharacterExpression) => {
    if (guess === quizTarget) {
      setQuizResult('correct');
      setFriendshipPoints((p) => p + 1);
      setExpression('animando');
      audioEngine.playSuccess(progress.settings.soundEnabled);
      const nextList = EXPRESSIONS.filter((e) => e.id !== quizTarget);
      const next = nextList[Math.floor(Math.random() * nextList.length)];
      window.setTimeout(() => {
        setQuizTarget(next.id);
        setQuizResult('idle');
      }, 1500);
    } else {
      setQuizResult('try');
      audioEngine.playGentleError(progress.settings.soundEnabled);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & 5-Friend Selector */}
      <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
              Módulo 07 · Mis Amigos del Reino
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-stone-900 sm:text-3xl dark:text-stone-50">
              Conoce a Lucas, Luna, León, Cordero y Estrellita
            </h2>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
              Elige un amigo, visita los escenarios del Reino, cambia sus expresiones y descubre datos para tu edad ({progress.ageGroup} años).
            </p>
          </div>
          <div className="text-xs font-bold text-amber-700 dark:text-amber-300">
            Sonrisas en esta sesión: <span className="font-mono-nums">{friendshipPoints}</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {CHARACTER_LIST.map((item) => {
            const active = item.id === selectedId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectCharacter(item.id)}
                className={`flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition ${
                  active
                    ? 'border-teal-500 bg-teal-50 shadow-sm dark:border-teal-400 dark:bg-teal-950/50'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 dark:border-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-800'
                }`}
              >
                <CharacterAvatar
                  character={item.id}
                  expression={active ? expression : 'alegre'}
                  size="md"
                  animated={active}
                />
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
      </section>

      {/* Two-Zone Character & Living Scenario Stage */}
      <section className="grid grid-cols-1 gap-6 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm lg:grid-cols-12 dark:border-slate-800 dark:bg-slate-900">
        {/* Left Zone: Interactive Scenario + Character Preview */}
        <div className="space-y-4 lg:col-span-6">
          <ScenarioStage
            theme={scenarioTheme}
            title={`${char.name} en ${SCENARIO_VISITS.find((s) => s.theme === scenarioTheme)?.label || char.favoritePlace}`}
            character={selectedId}
            expression={expression}
            soundEnabled={progress.settings.soundEnabled}
            darkMode={progress.settings.darkMode}
            interactiveHint={`Toca el escenario para escuchar a ${char.name}`}
            heightClass="h-64 sm:h-72"
          />

          {/* Visit Any Kingdom Scenario */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-300">
              <MapPin className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span>Viaja con {char.name} a otro escenario del Reino:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SCENARIO_VISITS.map((place) => {
                const active = scenarioTheme === place.theme;
                return (
                  <button
                    key={place.theme}
                    type="button"
                    onClick={() => {
                      setScenarioTheme(place.theme);
                      audioEngine.playChime(progress.settings.soundEnabled);
                    }}
                    className={`min-h-[38px] rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-200'
                    }`}
                  >
                    {place.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Zone: Character Profile, Expressions & Interactive Content */}
        <div className="flex flex-col justify-between space-y-5 lg:col-span-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div key={bounceKey} className="shrink-0 transition-transform duration-200 hover:scale-105">
                <CharacterAvatar character={selectedId} expression={expression} size="lg" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-extrabold text-stone-900 dark:text-stone-50">
                  {char.name}
                </h3>
                <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                  {char.role} · {char.badgeLabel} · {char.favoritePlace}
                </p>
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{char.description}</p>
              </div>
            </div>

            {/* Mode Switch Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-stone-100 p-1.5 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('dialogue')}
                className={`flex-1 min-h-[40px] rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'dialogue'
                    ? 'bg-white text-stone-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white'
                }`}
              >
                Diálogo y Voz
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('fact')}
                className={`flex-1 min-h-[40px] rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'fact'
                    ? 'bg-white text-stone-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white'
                }`}
              >
                Dato Bíblico
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('challenge')}
                className={`flex-1 min-h-[40px] rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'challenge'
                    ? 'bg-white text-stone-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white'
                }`}
              >
                Reto de Amistad
              </button>
            </div>

            {activeTab === 'dialogue' && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
                <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                  Expresión actual: {EXPRESSIONS.find((e) => e.id === expression)?.label}
                </p>
                <p className="mt-1 font-display text-lg font-bold text-stone-900 dark:text-stone-100">
                  “{char.reactions[expression]}”
                </p>
                <p className="mt-2 text-xs text-stone-600 dark:text-stone-300">
                  Versículo favorito: <strong>{char.favoriteVerse}</strong>
                </p>
              </div>
            )}

            {activeTab === 'fact' && (
              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-900/60 dark:bg-sky-950/30">
                <p className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 dark:text-sky-300">
                  <Compass className="h-4 w-4" />
                  Dato curioso para exploradores de {progress.ageGroup} años
                </p>
                <p className="mt-1.5 text-base font-semibold leading-relaxed text-stone-900 dark:text-stone-100">
                  {char.funFacts[progress.ageGroup]}
                </p>
              </div>
            )}

            {activeTab === 'challenge' && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                <p className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <Heart className="h-4 w-4" />
                  Misión de amistad con {char.name}
                </p>
                <p className="mt-1.5 text-base font-semibold text-stone-900 dark:text-stone-100">
                  {char.friendshipAction}
                </p>
              </div>
            )}
          </div>

          {/* Expressions + Voice Controls */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold text-stone-600 dark:text-stone-300">
              Cambia su rostro y escúchalo hablar:
            </p>
            <div className="flex flex-wrap gap-2">
              {EXPRESSIONS.map((expr) => (
                <button
                  key={expr.id}
                  type="button"
                  onClick={() => triggerReaction(expr.id)}
                  className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap shrink-0 ${
                    expression === expr.id
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-200'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {expr.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  const res = audioEngine.speakKidsVoice(
                    char.greetings[progress.ageGroup],
                    selectedId,
                    progress.settings.soundEnabled
                  );
                  if (!res.startedSpeech && res.reason !== 'muted') {
                    setVoiceNote(
                      `Sin voz en español en este navegador. Saludo de ${char.name}: «${char.greetings[progress.ageGroup]}»`
                    );
                  } else {
                    setVoiceNote(null);
                  }
                }}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 whitespace-nowrap shrink-0"
              >
                <Volume2 className="h-4 w-4" />
                Saludo para {progress.ageGroup} años
              </button>
            </div>
            {voiceNote && (
              <p className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
                {voiceNote}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Emotion Discovery Mini-Activity */}
      <section className="rounded-3xl border border-amber-200/80 bg-amber-50/70 p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center justify-center rounded-2xl bg-white p-4 shadow-xs dark:bg-slate-800">
            <CharacterAvatar character={selectedId} expression={quizTarget} size="lg" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
              <Trophy className="h-4 w-4" />
              <span>Mini-Juego de Emociones · Adivina cómo se siente {char.name}</span>
            </div>
            <p className="font-display text-lg font-extrabold text-stone-900 dark:text-stone-50">
              Mira el rostro de {char.name} arriba. ¿Qué expresión está mostrando ahora?
            </p>
            <div className="flex flex-wrap gap-2">
              {EXPRESSIONS.map((expr) => (
                <button
                  key={expr.id}
                  type="button"
                  onClick={() => handleGuessMood(expr.id)}
                  className="min-h-[44px] rounded-xl border border-amber-300 bg-white px-4 py-2 text-xs font-bold text-stone-800 transition hover:bg-amber-100 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-100 dark:hover:bg-slate-700 whitespace-nowrap"
                >
                  {expr.label}
                </button>
              ))}
            </div>
            {quizResult === 'correct' && (
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                ¡Excelente! Descubriste su emoción con mucho cariño.
              </p>
            )}
            {quizResult === 'try' && (
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                ¡Casi! Observa sus ojos y su sonrisa e inténtalo otra vez.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
