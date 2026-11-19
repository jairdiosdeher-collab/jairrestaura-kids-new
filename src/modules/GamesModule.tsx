import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Gamepad2,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';
import { AgeGroup, AppProgress, GameId } from '../types/app';
import { VERSE_TREASURES } from '../data/modulesData';
import { audioEngine } from '../services/audioEngine';

interface GamesModuleProps {
  progress: AppProgress;
  onCompleteGame: (gameId: GameId, stars: number) => void;
}

const GAME_CATALOG: { id: GameId; title: string; rule: string; stars: number }[] = [
  { id: 'memory', title: 'Memoria Bíblica', rule: 'Encuentra todas las parejas iguales dando vuelta a las tarjetas.', stars: 8 },
  { id: 'puzzle', title: 'Rompecabezas del Arca', rule: 'Ordena los cuadros numerados intercambiando fichas hasta completar el dibujo.', stars: 9 },
  { id: 'quiz', title: 'Preguntas Bíblicas', rule: 'Responde correctamente los retos bíblicos adaptados a tu edad.', stars: 10 },
  { id: 'differences', title: 'Encuentra las Diferencias', rule: 'Toca las 5 diferencias ocultas en la escena derecha de Noé y el arca.', stars: 9 },
  { id: 'sequence', title: 'Ordena la Historia', rule: 'Coloca los eventos de «Jesús calma la tormenta» en orden cronológico.', stars: 8 },
  { id: 'animals', title: 'Busca los Animales', rule: 'Encuentra y toca los 6 animalitos escondidos en el jardín del Reino.', stars: 8 },
  { id: 'pairs', title: 'Une las Parejas', rule: 'Conecta cada personaje bíblico con su símbolo correspondiente.', stars: 8 },
  { id: 'verses', title: 'Tesoro de Versículos', rule: 'Toca las palabras en orden para armar el versículo del cofre.', stars: 10 },
];

export const GamesModule: React.FC<GamesModuleProps> = ({ progress, onCompleteGame }) => {
  const [activeGame, setActiveGame] = useState<GameId>('memory');

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-orange-700 dark:text-orange-400">
              Módulo 04 · Laboratorio de Juegos
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-stone-900 sm:text-3xl dark:text-stone-50">
              8 Juegos Bíblicos Reales e Interactivos
            </h2>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
              Dificultad adaptada a tu nivel ({progress.ageGroup} años) · {progress.completedGames.length}/8 juegos completados.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
            <Trophy className="h-5 w-5" />
            <span className="font-mono-nums">{progress.completedGames.length}/8</span>
          </div>
        </div>

        {/* Game Tabs */}
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {GAME_CATALOG.map((g) => {
            const active = activeGame === g.id;
            const done = progress.completedGames.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  setActiveGame(g.id);
                  audioEngine.playChime(progress.settings.soundEnabled);
                }}
                className={`flex min-h-[48px] items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-xs font-bold transition ${
                  active
                    ? 'border-orange-500 bg-orange-50 text-orange-950 dark:border-orange-500 dark:bg-orange-950/40 dark:text-orange-100'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-200'
                }`}
              >
                <span className="truncate">{g.title}</span>
                {done ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <Gamepad2 className="h-4 w-4 shrink-0 text-stone-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Game Area */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4 dark:border-slate-800">
          <div>
            <h3 className="font-display text-xl font-extrabold text-stone-900 dark:text-stone-50">
              {GAME_CATALOG.find((g) => g.id === activeGame)?.title}
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Regla: {GAME_CATALOG.find((g) => g.id === activeGame)?.rule}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
            <Star className="h-4 w-4" />+{GAME_CATALOG.find((g) => g.id === activeGame)?.stars} estrellas
          </span>
        </div>

        {activeGame === 'memory' && (
          <MemoryGame
            key={`mem-${progress.ageGroup}`}
            ageGroup={progress.ageGroup}
            soundEnabled={progress.settings.soundEnabled}
            onWin={() => onCompleteGame('memory', 8)}
          />
        )}
        {activeGame === 'puzzle' && (
          <SlidingPuzzleGame
            key={`puz-${progress.ageGroup}`}
            ageGroup={progress.ageGroup}
            soundEnabled={progress.settings.soundEnabled}
            onWin={() => onCompleteGame('puzzle', 9)}
          />
        )}
        {activeGame === 'quiz' && (
          <BibleQuizGame
            key={`quiz-${progress.ageGroup}`}
            ageGroup={progress.ageGroup}
            soundEnabled={progress.settings.soundEnabled}
            onWin={() => onCompleteGame('quiz', 10)}
          />
        )}
        {activeGame === 'differences' && (
          <DifferencesGame
            soundEnabled={progress.settings.soundEnabled}
            onWin={() => onCompleteGame('differences', 9)}
          />
        )}
        {activeGame === 'sequence' && (
          <SequenceGame
            soundEnabled={progress.settings.soundEnabled}
            onWin={() => onCompleteGame('sequence', 8)}
          />
        )}
        {activeGame === 'animals' && (
          <FindAnimalsGame
            soundEnabled={progress.settings.soundEnabled}
            onWin={() => onCompleteGame('animals', 8)}
          />
        )}
        {activeGame === 'pairs' && (
          <ConnectPairsGame
            soundEnabled={progress.settings.soundEnabled}
            onWin={() => onCompleteGame('pairs', 8)}
          />
        )}
        {activeGame === 'verses' && (
          <VerseTreasureGame
            soundEnabled={progress.settings.soundEnabled}
            onWin={() => onCompleteGame('verses', 10)}
          />
        )}
      </div>
    </div>
  );
};

/* ---------------- 1. MEMORIA BÍBLICA ---------------- */
const MEMORY_SYMBOLS = [
  { id: 'arca', label: 'Arca', glyph: '⛵', bg: 'bg-sky-100 dark:bg-sky-900/50' },
  { id: 'arcoiris', label: 'Arcoíris', glyph: '🌈', bg: 'bg-amber-100 dark:bg-amber-900/50' },
  { id: 'estrella', label: 'Estrella', glyph: '⭐', bg: 'bg-yellow-100 dark:bg-yellow-900/50' },
  { id: 'leon', label: 'León', glyph: '🦁', bg: 'bg-orange-100 dark:bg-orange-900/50' },
  { id: 'cordero', label: 'Cordero', glyph: '🐑', bg: 'bg-emerald-100 dark:bg-emerald-900/50' },
  { id: 'paloma', label: 'Paloma', glyph: '🕊️', bg: 'bg-indigo-100 dark:bg-indigo-900/50' },
];

const MemoryGame: React.FC<{ ageGroup: AgeGroup; soundEnabled: boolean; onWin: () => void }> = ({
  ageGroup,
  soundEnabled,
  onWin,
}) => {
  const pairCount = ageGroup === '3-5' ? 4 : ageGroup === '6-8' ? 5 : 6;
  const createDeck = () =>
    [...MEMORY_SYMBOLS.slice(0, pairCount), ...MEMORY_SYMBOLS.slice(0, pairCount)]
      .map((item, idx) => ({ ...item, uid: `${item.id}-${idx}`, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort);

  const [cards, setCards] = useState(createDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const reset = () => {
    setCards(createDeck());
    setFlipped([]);
    setMatchedIds([]);
    setMoves(0);
    setWon(false);
  };

  const handleFlip = (index: number) => {
    if (won || flipped.length === 2 || flipped.includes(index)) return;
    if (matchedIds.includes(cards[index].id)) return;

    const nextFlipped = [...flipped, index];
    setFlipped(nextFlipped);
    audioEngine.playTone(587, 0.1, 'sine', 0.08);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nextFlipped;
      if (cards[a].id === cards[b].id) {
        const nextMatched = [...matchedIds, cards[a].id];
        setMatchedIds(nextMatched);
        setFlipped([]);
        audioEngine.playChime(soundEnabled);
        if (nextMatched.length === pairCount) {
          setWon(true);
          audioEngine.playSuccess(soundEnabled);
          onWin();
        }
      } else {
        window.setTimeout(() => setFlipped([]), 650);
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono-nums text-xs font-semibold text-stone-600 dark:text-stone-300">
          Parejas: {matchedIds.length}/{pairCount} · Intentos: {moves}
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-slate-700 dark:text-stone-200 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reiniciar tablero
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-xl mx-auto">
        {cards.map((card, idx) => {
          const revealed = flipped.includes(idx) || matchedIds.includes(card.id);
          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => handleFlip(idx)}
              className={`min-h-[86px] rounded-2xl border p-2 flex flex-col items-center justify-center transition ${
                revealed
                  ? `${card.bg} border-amber-400 text-stone-900 dark:text-stone-100`
                  : 'border-stone-200 bg-amber-600 text-white hover:bg-amber-700 dark:border-slate-700'
              }`}
            >
              {revealed ? (
                <>
                  <span className="text-2xl">{card.glyph}</span>
                  <span className="mt-1 text-[11px] font-bold">{card.label}</span>
                </>
              ) : (
                <Sparkles className="h-6 w-6 opacity-80" />
              )}
            </button>
          );
        })}
      </div>

      {won && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-center text-sm font-bold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
          ¡Felicidades! Completaste Memoria Bíblica en {moves} intentos y ganaste +8 estrellas.
        </div>
      )}
    </div>
  );
};

/* ---------------- 2. ROMPECABEZAS ---------------- */
const PUZZLE_COLORS = [
  'bg-sky-500', 'bg-sky-400', 'bg-amber-400',
  'bg-amber-600', 'bg-emerald-500', 'bg-emerald-600',
  'bg-orange-500', 'bg-yellow-500', 'bg-teal-500',
];
const PUZZLE_LABELS = ['Cielo', 'Sol', 'Arcoíris', 'Monte', 'Arca', 'Paloma', 'Olas', 'Olivo', 'Paz'];
const PUZZLE_ICONS = ['🌤️', '☀️', '🌈', '⛰️', '⛵', '🕊️', '🌊', '🫒', '💛'];

const SlidingPuzzleGame: React.FC<{ ageGroup: AgeGroup; soundEnabled: boolean; onWin: () => void }> = ({
  ageGroup,
  soundEnabled,
  onWin,
}) => {
  const tileCount = ageGroup === '3-5' ? 4 : ageGroup === '6-8' ? 6 : 9;
  const colsClass = ageGroup === '3-5' ? 'grid-cols-2 max-w-xs' : 'grid-cols-3 max-w-sm';

  const initialScrambled = () => {
    if (tileCount === 4) return [2, 0, 3, 1];
    if (tileCount === 6) return [3, 0, 4, 1, 5, 2];
    return [2, 0, 5, 1, 4, 8, 6, 3, 7];
  };

  const [tiles, setTiles] = useState<number[]>(initialScrambled);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [swaps, setSwaps] = useState(0);
  const [won, setWon] = useState(false);

  const handleTileClick = (idx: number) => {
    if (won) return;
    if (selectedIdx === null) {
      setSelectedIdx(idx);
      return;
    }
    if (selectedIdx === idx) {
      setSelectedIdx(null);
      return;
    }
    const next = [...tiles];
    [next[selectedIdx], next[idx]] = [next[idx], next[selectedIdx]];
    setTiles(next);
    setSelectedIdx(null);
    setSwaps((s) => s + 1);
    audioEngine.playTone(620, 0.08, 'triangle', 0.08);

    const solved = next.every((val, pos) => val === pos);
    if (solved) {
      setWon(true);
      audioEngine.playSuccess(soundEnabled);
      onWin();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-stone-600 dark:text-stone-300">
            Toca dos cuadros para intercambiarlos hasta ordenar del 1 al {tileCount} · Movimientos: {swaps}
          </p>
          <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">
            Meta: {Array.from({ length: tileCount }, (_, i) => `${i + 1} ${PUZZLE_LABELS[i]}`).join(' · ')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setTiles(initialScrambled());
            setSelectedIdx(null);
            setSwaps(0);
            setWon(false);
          }}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-slate-700 dark:text-stone-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Mezclar de nuevo
        </button>
      </div>

      <div className={`mx-auto grid gap-2.5 ${colsClass}`}>
        {tiles.map((tileVal, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrectPlace = tileVal === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleTileClick(idx)}
              className={`relative flex min-h-[90px] flex-col items-center justify-center rounded-2xl ${PUZZLE_COLORS[tileVal]} text-white shadow-sm transition ${
                isSelected ? 'ring-4 ring-stone-900 dark:ring-white scale-95' : ''
              } ${isCorrectPlace ? 'ring-2 ring-emerald-200 brightness-105' : 'opacity-90'}`}
            >
              {isCorrectPlace && (
                <span className="absolute top-1.5 right-2 text-[10px] font-extrabold text-white/95">
                  ✓
                </span>
              )}
              <span className="text-xl leading-none">{PUZZLE_ICONS[tileVal]}</span>
              <span className="mt-1 font-mono-nums text-base font-extrabold">{tileVal + 1}</span>
              <span className="text-[11px] font-semibold">{PUZZLE_LABELS[tileVal]}</span>
            </button>
          );
        })}
      </div>

      {won && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-center text-sm font-bold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
          ¡Rompecabezas armado en {swaps} movimientos! Ganaste +9 estrellas.
        </div>
      )}
    </div>
  );
};

/* ---------------- 3. PREGUNTAS BÍBLICAS ---------------- */
const QUIZ_BY_AGE: Record<
  AgeGroup,
  { q: string; options: string[]; correct: number; exp: string }[]
> = {
  '3-5': [
    {
      q: '¿Quién construyó el barco grande llamado arca?',
      options: ['Noé', 'Jonás', 'David'],
      correct: 0,
      exp: 'Noé obedeció a Dios y cuidó a los animalitos en el arca.',
    },
    {
      q: '¿Qué animalitos cuidó un ángel junto a Daniel?',
      options: ['Leones', 'Pingüinos', 'Ranas'],
      correct: 0,
      exp: 'Un ángel de Dios cerró la boca de los leones.',
    },
    {
      q: '¿Quién ama mucho a los niños y los abraza?',
      options: ['Jesús', 'Goliat', 'El viento'],
      correct: 0,
      exp: 'Jesús dijo: «Dejen que los niños vengan a mí».',
    },
  ],
  '6-8': [
    {
      q: '¿Quién construyó el arca obedeciendo a Dios?',
      options: ['Noé', 'Jonás', 'Salomón'],
      correct: 0,
      exp: 'Noé obedeció a Dios y construyó el arca para salvar a su familia y los animales.',
    },
    {
      q: '¿Qué animal protegió Dios dentro del foso donde estaba Daniel?',
      options: ['Osos polares', 'Leones', 'Águilas'],
      correct: 1,
      exp: 'Un ángel enviado por Dios cerró la boca de los leones toda la noche.',
    },
    {
      q: '¿Con qué venció David al gigante Goliat confiando en Dios?',
      options: ['Una honda y una piedra lisa', 'Un cañón antiguo', 'Una lanza gigante'],
      correct: 0,
      exp: 'David confió en el nombre del Señor usando cinco piedras lisas y su honda.',
    },
    {
      q: '¿En qué ciudad nació el niño Jesús?',
      options: ['Nazaret', 'Belén', 'Jericó'],
      correct: 1,
      exp: 'Jesús nació en un humilde pesebre en Belén.',
    },
  ],
  '9-12': [
    {
      q: '¿Qué señal estableció Dios con Noé como pacto tras el diluvio?',
      options: ['Una estrella fugaz', 'El arcoíris en las nubes', 'Una montaña de oro'],
      correct: 1,
      exp: 'Génesis 9:13 enseña que el arcoíris recuerda el pacto fiel de Dios.',
    },
    {
      q: '¿Qué respondió José a sus hermanos al perdonarlos en Egipto?',
      options: [
        'Ustedes pensaron hacerme mal, pero Dios lo encaminó para bien',
        'No quiero volver a verlos nunca',
        'Trabajen para mí durante diez años',
      ],
      correct: 0,
      exp: 'Génesis 50:20 muestra el perdón generoso y la confianza en Dios.',
    },
    {
      q: '¿Qué palabras dijo Jesús para calmar la tempestad en el mar de Galilea?',
      options: ['¡Remen más rápido!', '¡Calla, enmudece!', '¡Regresen a la orilla!'],
      correct: 1,
      exp: 'Marcos 4:39 muestra la autoridad de Jesús sobre el viento y las olas.',
    },
    {
      q: '¿Qué ciudad escuchó el mensaje de Dios anunciado por Jonás?',
      options: ['Tarsis', 'Nínive', 'Babilonia'],
      correct: 1,
      exp: 'Toda la ciudad de Nínive se arrepintió y recibió la misericordia de Dios.',
    },
  ],
};

const BibleQuizGame: React.FC<{ ageGroup: AgeGroup; soundEnabled: boolean; onWin: () => void }> = ({
  ageGroup,
  soundEnabled,
  onWin,
}) => {
  const questions = QUIZ_BY_AGE[ageGroup];
  const passThreshold = Math.ceil(questions.length * 0.6);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const current = questions[idx];

  const pickOption = (optIdx: number) => {
    if (chosen !== null) return;
    setChosen(optIdx);
    if (optIdx === current.correct) {
      setScore((s) => s + 1);
      audioEngine.playChime(soundEnabled);
    } else {
      audioEngine.playGentleError(soundEnabled);
    }
  };

  const nextQuestion = () => {
    if (idx + 1 < questions.length) {
      setIdx((i) => i + 1);
      setChosen(null);
    } else {
      setFinished(true);
      if (score >= passThreshold) {
        audioEngine.playSuccess(soundEnabled);
        onWin();
      } else {
        audioEngine.playGentleError(soundEnabled);
      }
    }
  };

  if (finished) {
    const passed = score >= passThreshold;
    return (
      <div className="space-y-4 text-center py-4">
        <p
          className={`font-display text-2xl font-extrabold ${
            passed
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-amber-700 dark:text-amber-400'
          }`}
        >
          ¡Lograste {score} de {questions.length} aciertos!
        </p>
        <p className="text-sm text-stone-600 dark:text-stone-300">
          {passed
            ? `¡Aprobado! Ganaste +10 estrellas por completar el desafío de Preguntas Bíblicas (${ageGroup} años).`
            : `Necesitas al menos ${passThreshold} aciertos para ganar las +10 estrellas. ¡Repasa las historias e inténtalo de nuevo!`}
        </p>
        <button
          type="button"
          onClick={() => {
            setIdx(0);
            setScore(0);
            setChosen(null);
            setFinished(false);
          }}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-amber-600 px-5 py-2 text-sm font-bold text-white"
        >
          <RotateCcw className="h-4 w-4" />
          {passed ? 'Jugar otra vez' : 'Intentar de nuevo'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex justify-between font-mono-nums text-xs font-semibold text-stone-500 dark:text-stone-400">
        <span>Pregunta {idx + 1} de {questions.length} · Meta: {passThreshold}+</span>
        <span>Aciertos: {score}</span>
      </div>
      <h4 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
        {current.q}
      </h4>
      <div className="space-y-2.5">
        {current.options.map((opt, oIdx) => {
          const isPicked = chosen === oIdx;
          const isRight = oIdx === current.correct;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => pickOption(oIdx)}
              className={`w-full min-h-[48px] rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition ${
                chosen !== null && isRight
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200'
                  : isPicked && !isRight
                  ? 'border-rose-400 bg-rose-50 text-rose-900 dark:bg-rose-950/50 dark:text-rose-200'
                  : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-amber-400 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-100'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {chosen !== null && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-stone-100 p-3.5 text-xs dark:bg-slate-800">
          <span className="text-stone-700 dark:text-stone-200">{current.exp}</span>
          <button
            type="button"
            onClick={nextQuestion}
            className="min-h-[40px] rounded-lg bg-amber-600 px-4 py-1.5 font-bold text-white whitespace-nowrap"
          >
            {idx + 1 < questions.length ? 'Siguiente' : 'Ver resultado'}
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------------- 4. ENCUENTRA LAS DIFERENCIAS ---------------- */
const DIFFERENCE_SPOTS = [
  { id: 'sun', label: 'Sol naranja', cx: 245, cy: 38, r: 24 },
  { id: 'dove', label: 'Palomita en el cielo', cx: 65, cy: 52, r: 24 },
  { id: 'window', label: 'Ventana redonda azul', cx: 150, cy: 108, r: 22 },
  { id: 'flower', label: 'Flor en el prado', cx: 52, cy: 170, r: 22 },
  { id: 'star', label: 'Estrella en el techo', cx: 150, cy: 62, r: 22 },
];

const DifferencesGame: React.FC<{ soundEnabled: boolean; onWin: () => void }> = ({
  soundEnabled,
  onWin,
}) => {
  const [found, setFound] = useState<string[]>([]);
  const [hintText, setHintText] = useState<string | null>(null);

  const tapSpot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (found.includes(id)) return;
    const next = [...found, id];
    setFound(next);
    setHintText(null);
    audioEngine.playChime(soundEnabled);
    if (next.length === DIFFERENCE_SPOTS.length) {
      audioEngine.playSuccess(soundEnabled);
      onWin();
    }
  };

  const showHint = () => {
    const remaining = DIFFERENCE_SPOTS.find((s) => !found.includes(s.id));
    if (remaining) {
      setHintText(`Pista: busca «${remaining.label}» en la imagen derecha.`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold text-stone-600 dark:text-stone-300">
          Encontradas: {found.length}/5 · Toca la escena de la derecha donde veas algo diferente.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={showHint}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            Ver pista
          </button>
          <button
            type="button"
            onClick={() => {
              setFound([]);
              setHintText(null);
            }}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-stone-300 px-3 py-1 text-xs font-semibold dark:border-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reiniciar
          </button>
        </div>
      </div>

      {hintText && (
        <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">{hintText}</p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-sky-100 p-2 dark:border-slate-700">
          <p className="mb-1 text-center text-xs font-bold text-stone-700">Escena Original</p>
          <svg viewBox="0 0 300 200" className="w-full rounded-xl bg-sky-200">
            <rect y="145" width="300" height="55" fill="#4D7C0F" />
            <circle cx="245" cy="38" r="18" fill="#FACC15" />
            <path d="M90 130 L210 130 L195 162 L105 162 Z" fill="#92400E" />
            <rect x="115" y="90" width="70" height="40" fill="#B45309" />
            <polygon points="108,92 150,62 192,92" fill="#78350F" />
            <rect x="125" y="100" width="16" height="16" fill="#FEF3C7" />
            <rect x="160" y="100" width="16" height="16" fill="#FEF3C7" />
          </svg>
        </div>

        <div className="rounded-2xl border border-amber-300 bg-sky-100 p-2 dark:border-amber-700">
          <p className="mb-1 text-center text-xs font-bold text-amber-800">Toca aquí las 5 diferencias</p>
          <svg
            viewBox="0 0 300 200"
            className="w-full rounded-xl bg-sky-200 cursor-pointer"
            onClick={() => {
              if (found.length < DIFFERENCE_SPOTS.length) {
                audioEngine.playGentleError(soundEnabled);
                setHintText('Allí son iguales. Observa el sol, el cielo, el techo, la ventana y el pasto.');
              }
            }}
          >
            <rect y="145" width="300" height="55" fill="#4D7C0F" />
            <circle cx="245" cy="38" r="18" fill="#FB923C" />
            <circle cx="65" cy="52" r="9" fill="#FFFFFF" />
            <polygon points="72,52 82,48 74,56" fill="#F59E0B" />
            <path d="M90 130 L210 130 L195 162 L105 162 Z" fill="#92400E" />
            <rect x="115" y="90" width="70" height="40" fill="#B45309" />
            <polygon points="108,92 150,62 192,92" fill="#78350F" />
            <rect x="125" y="100" width="16" height="16" fill="#FEF3C7" />
            <circle cx="150" cy="108" r="8" fill="#38BDF8" />
            <rect x="160" y="100" width="16" height="16" fill="#FEF3C7" />
            <circle cx="52" cy="170" r="8" fill="#FACC15" />
            <circle cx="52" cy="170" r="3.5" fill="#DC2626" />
            <polygon points="150,52 153,60 161,60 155,65 157,73 150,68 143,73 145,65 139,60 147,60" fill="#FDE047" />

            {DIFFERENCE_SPOTS.map((spot) => {
              const isFound = found.includes(spot.id);
              return (
                <g key={spot.id} onClick={(e) => tapSpot(spot.id, e)}>
                  <circle cx={spot.cx} cy={spot.cy} r={spot.r} fill="transparent" />
                  {isFound && (
                    <circle
                      cx={spot.cx}
                      cy={spot.cy}
                      r={spot.r - 2}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3.5"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {found.length === DIFFERENCE_SPOTS.length && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-center text-sm font-bold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
          ¡Ojo de explorador! Encontraste las 5 diferencias y ganaste +9 estrellas.
        </div>
      )}
    </div>
  );
};

/* ---------------- 5. ORDENA LA HISTORIA ---------------- */
const CORRECT_SEQUENCE = [
  { id: 1, text: 'Los discípulos suben con Jesús a la barca para cruzar el lago.' },
  { id: 2, text: 'Llega un viento fuerte y las olas cubren la barca.' },
  { id: 3, text: 'Despiertan a Jesús pidiendo Su ayuda.' },
  { id: 4, text: 'Jesús dice «¡Paz, cálmate!» y el mar queda tranquilo.' },
];

const SequenceGame: React.FC<{ soundEnabled: boolean; onWin: () => void }> = ({
  soundEnabled,
  onWin,
}) => {
  const initialOrder = () => [
    CORRECT_SEQUENCE[2],
    CORRECT_SEQUENCE[0],
    CORRECT_SEQUENCE[3],
    CORRECT_SEQUENCE[1],
  ];
  const [items, setItems] = useState(initialOrder);
  const [checked, setChecked] = useState<boolean | null>(null);

  const move = (idx: number, dir: -1 | 1) => {
    if (checked === true) return;
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[idx], next[target]] = [next[target], next[idx]];
    setItems(next);
    setChecked(null);
    audioEngine.playTone(500, 0.08, 'sine', 0.07);
  };

  const verify = () => {
    if (checked === true) return;
    const ok = items.every((item, i) => item.id === i + 1);
    setChecked(ok);
    if (ok) {
      audioEngine.playSuccess(soundEnabled);
      onWin();
    } else {
      audioEngine.playGentleError(soundEnabled);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setItems(initialOrder());
            setChecked(null);
          }}
          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-stone-300 px-3 py-1 text-xs font-semibold dark:border-slate-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reiniciar orden
        </button>
      </div>

      <div className="space-y-2.5">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 font-mono-nums text-xs font-extrabold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {idx + 1}
              </span>
              <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                {item.text}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                disabled={idx === 0 || checked === true}
                onClick={() => move(idx, -1)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl border border-stone-300 bg-white disabled:opacity-30 dark:border-slate-600 dark:bg-slate-700"
                aria-label="Subir"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={idx === items.length - 1 || checked === true}
                onClick={() => move(idx, 1)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl border border-stone-300 bg-white disabled:opacity-30 dark:border-slate-600 dark:bg-slate-700"
                aria-label="Bajar"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={checked === true}
        onClick={verify}
        className="w-full min-h-[48px] rounded-2xl bg-amber-600 px-5 py-3 text-sm font-bold text-white hover:bg-amber-700 disabled:opacity-50"
      >
        Comprobar orden de la historia
      </button>

      {checked === true && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-center text-sm font-bold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
          ¡Orden perfecto! Ganaste +8 estrellas.
        </div>
      )}
      {checked === false && (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-center text-xs font-semibold text-rose-900 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
          Casi lo logras. Revisa qué ocurrió primero en el lago y vuelve a intentar.
        </div>
      )}
    </div>
  );
};

/* ---------------- 6. BUSCA LOS ANIMALES ---------------- */
const HIDDEN_ANIMALS = [
  { id: 'leon', name: 'León', emoji: '🦁', x: 18, y: 68 },
  { id: 'cordero', name: 'Cordero', emoji: '🐑', x: 76, y: 74 },
  { id: 'paloma', name: 'Paloma', emoji: '🕊️', x: 32, y: 22 },
  { id: 'jirafa', name: 'Jirafa', emoji: '🦒', x: 84, y: 36 },
  { id: 'elefante', name: 'Elefante', emoji: '🐘', x: 48, y: 62 },
  { id: 'pez', name: 'Pez', emoji: '🐟', x: 60, y: 86 },
];

const FindAnimalsGame: React.FC<{ soundEnabled: boolean; onWin: () => void }> = ({
  soundEnabled,
  onWin,
}) => {
  const [found, setFound] = useState<string[]>([]);

  const tapAnimal = (id: string) => {
    if (found.includes(id)) return;
    const next = [...found, id];
    setFound(next);
    audioEngine.playChime(soundEnabled);
    if (next.length === HIDDEN_ANIMALS.length) {
      audioEngine.playSuccess(soundEnabled);
      onWin();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {HIDDEN_ANIMALS.map((a) => (
            <span
              key={a.id}
              className={
                found.includes(a.id)
                  ? 'line-through text-emerald-700 dark:text-emerald-400'
                  : 'text-stone-700 dark:text-stone-300'
              }
            >
              {a.emoji} {a.name}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono-nums text-xs font-bold text-amber-700 dark:text-amber-400">
            {found.length}/6
          </span>
          <button
            type="button"
            onClick={() => setFound([])}
            className="inline-flex min-h-[36px] items-center gap-1 rounded-xl border border-stone-300 px-2.5 py-1 text-xs font-semibold dark:border-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reiniciar
          </button>
        </div>
      </div>

      <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-b from-sky-200 via-emerald-200 to-cyan-500 dark:border-slate-700">
        <div className="absolute bottom-10 left-0 right-0 h-28 rounded-t-[100%] bg-emerald-500/80" />
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-sky-600/80" />
        <div className="absolute left-[14%] top-[56%] h-16 w-24 rounded-full bg-emerald-700/70" />
        <div className="absolute right-[16%] top-[28%] h-24 w-16 rounded-full bg-emerald-700/70" />

        {HIDDEN_ANIMALS.map((a) => {
          const isFound = found.includes(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => tapAnimal(a.id)}
              style={{ left: `${a.x}%`, top: `${a.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] rounded-full text-2xl transition ${
                isFound ? 'scale-125 ring-4 ring-amber-400 bg-white/80' : 'opacity-85 hover:scale-110'
              }`}
              aria-label={`Encontrar ${a.name}`}
            >
              {a.emoji}
            </button>
          );
        })}
      </div>

      {found.length === HIDDEN_ANIMALS.length && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-center text-sm font-bold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
          ¡Encontraste a todos los animalitos de la creación! Ganaste +8 estrellas.
        </div>
      )}
    </div>
  );
};

/* ---------------- 7. UNE LAS PAREJAS ---------------- */
const PAIRS_DATA = [
  { id: 'noe', left: 'Noé', right: 'Arca y arcoíris' },
  { id: 'david', left: 'David', right: 'Cinco piedras lisas' },
  { id: 'daniel', left: 'Daniel', right: 'Oración y leones en paz' },
  { id: 'moises', left: 'Moisés', right: 'Camino en el mar Rojo' },
];

const ConnectPairsGame: React.FC<{ soundEnabled: boolean; onWin: () => void }> = ({
  soundEnabled,
  onWin,
}) => {
  const rightShuffled = useMemo(
    () => [PAIRS_DATA[2], PAIRS_DATA[0], PAIRS_DATA[3], PAIRS_DATA[1]],
    []
  );
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);

  const handleRightClick = (rightId: string) => {
    if (!selectedLeft || matched.includes(rightId)) return;
    if (selectedLeft === rightId) {
      const next = [...matched, rightId];
      setMatched(next);
      setSelectedLeft(null);
      audioEngine.playChime(soundEnabled);
      if (next.length === PAIRS_DATA.length) {
        audioEngine.playSuccess(soundEnabled);
        onWin();
      }
    } else {
      audioEngine.playGentleError(soundEnabled);
      setSelectedLeft(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold text-stone-600 dark:text-stone-300">
          1. Toca un personaje a la izquierda · 2. Toca su pareja a la derecha ({matched.length}/4).
        </p>
        <button
          type="button"
          onClick={() => {
            setMatched([]);
            setSelectedLeft(null);
          }}
          className="inline-flex min-h-[36px] items-center gap-1 rounded-xl border border-stone-300 px-2.5 py-1 text-xs font-semibold dark:border-slate-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reiniciar
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2.5">
          {PAIRS_DATA.map((p) => {
            const done = matched.includes(p.id);
            const active = selectedLeft === p.id;
            return (
              <button
                key={p.id}
                type="button"
                disabled={done}
                onClick={() => setSelectedLeft(p.id)}
                className={`w-full min-h-[48px] rounded-xl border px-3 py-2 text-sm font-bold transition ${
                  done
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200'
                    : active
                    ? 'border-amber-500 bg-amber-100 text-amber-950'
                    : 'border-stone-200 bg-stone-50 text-stone-800 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-100'
                }`}
              >
                {p.left}
              </button>
            );
          })}
        </div>
        <div className="space-y-2.5">
          {rightShuffled.map((p) => {
            const done = matched.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                disabled={done}
                onClick={() => handleRightClick(p.id)}
                className={`w-full min-h-[48px] rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  done
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200'
                    : 'border-stone-200 bg-white text-stone-800 hover:border-amber-400 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-100'
                }`}
              >
                {p.right}
              </button>
            );
          })}
        </div>
      </div>

      {matched.length === PAIRS_DATA.length && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-center text-sm font-bold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
          ¡Todas las parejas conectadas! Ganaste +8 estrellas.
        </div>
      )}
    </div>
  );
};

/* ---------------- 8. TESORO DE VERSÍCULOS ---------------- */
const VerseTreasureGame: React.FC<{ soundEnabled: boolean; onWin: () => void }> = ({
  soundEnabled,
  onWin,
}) => {
  const [verseIdx, setVerseIdx] = useState(0);
  const [solvedVerseIds, setSolvedVerseIds] = useState<string[]>([]);
  const current = VERSE_TREASURES[verseIdx];
  const scrambled = useMemo(
    () =>
      [...current.parts]
        .map((w, i) => ({ w, origIdx: i, r: (i * 7 + 3) % 11 }))
        .sort((a, b) => a.r - b.r),
    [current]
  );

  const [usedOrigIndices, setUsedOrigIndices] = useState<number[]>([]);
  const [assembledWords, setAssembledWords] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [won, setWon] = useState(false);

  const pickWord = (word: string, origIdx: number) => {
    if (won || usedOrigIndices.includes(origIdx)) return;
    const expected = current.parts[assembledWords.length];
    if (word === expected) {
      const nextWords = [...assembledWords, word];
      const nextUsed = [...usedOrigIndices, origIdx];
      setAssembledWords(nextWords);
      setUsedOrigIndices(nextUsed);
      setErrorMsg(null);
      audioEngine.playChime(soundEnabled);
      if (nextWords.length === current.parts.length) {
        setWon(true);
        setSolvedVerseIds((prev) => (prev.includes(current.id) ? prev : [...prev, current.id]));
        audioEngine.playSuccess(soundEnabled);
        onWin();
      }
    } else {
      setErrorMsg(`Pista: la siguiente palabra empieza con «${expected[0]}»`);
      audioEngine.playGentleError(soundEnabled);
    }
  };

  const switchVerse = (nextIdx: number) => {
    setVerseIdx(nextIdx);
    setAssembledWords([]);
    setUsedOrigIndices([]);
    setErrorMsg(null);
    setWon(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {VERSE_TREASURES.map((v, i) => {
            const solved = solvedVerseIds.includes(v.id);
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => switchVerse(i)}
                className={`min-h-[38px] rounded-xl px-3 py-1.5 text-xs font-bold ${
                  i === verseIdx
                    ? 'bg-amber-600 text-white'
                    : solved
                    ? 'border border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'bg-stone-100 text-stone-700 dark:bg-slate-800 dark:text-stone-300'
                }`}
              >
                {solved ? '✓ ' : ''}
                {v.reference}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => switchVerse(verseIdx)}
          className="inline-flex min-h-[38px] items-center gap-1 rounded-xl border border-stone-300 px-3 py-1 text-xs font-semibold dark:border-slate-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reiniciar
        </button>
      </div>

      <div className="min-h-[84px] rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/60 p-4 dark:border-amber-800 dark:bg-amber-950/30">
        <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-2">
          Cofre de {current.reference}:
        </p>
        <p className="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
          {assembledWords.length > 0
            ? assembledWords.join(' ')
            : 'Toca las palabras en el orden correcto...'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {scrambled.map((item) => {
          const used = usedOrigIndices.includes(item.origIdx);
          return (
            <button
              key={`${item.w}-${item.origIdx}`}
              type="button"
              disabled={used}
              onClick={() => pickWord(item.w, item.origIdx)}
              className={`min-h-[44px] rounded-xl border px-3.5 py-2 text-sm font-bold transition ${
                used
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 opacity-50 dark:bg-emerald-950/40'
                  : 'border-stone-200 bg-white text-stone-800 hover:border-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-100'
              }`}
            >
              {item.w}
            </button>
          );
        })}
      </div>

      {errorMsg && (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
          <HelpCircle className="h-4 w-4" />
          {errorMsg}
        </p>
      )}

      {won && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm font-bold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
          ¡Tesoro desbloqueado! «{current.meaning}» (+10 estrellas)
        </div>
      )}
    </div>
  );
};
