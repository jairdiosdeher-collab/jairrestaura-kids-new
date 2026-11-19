import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Pause, Play, Repeat, Sparkles, Trophy } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
type PianoNote = { key: string; letter: NoteName; octave: number; label: string; frequency: number; black: boolean };

type Lesson = {
  id: string;
  title: string;
  level: string;
  description: string;
  notes: string[];
  source: string;
};

const NOTE_LABELS: Record<NoteName, string> = {
  C: 'DO', D: 'RE', E: 'MI', F: 'FA', G: 'SOL', A: 'LA', B: 'SI',
};
const NOTE_ORDER: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_AFTER: NoteName[] = ['C', 'D', 'F', 'G', 'A'];
const LESSONS: Lesson[] = [
  {
    id: 'cumpleanos-practica',
    title: 'Cumpleaños feliz',
    level: 'Principiante',
    description: 'Ejercicio de lectura con la secuencia de notas compartida para esta escuela.',
    notes: ['D4','D4','E4','D4','G4','F4','D4','D4','E4','D4','A4','G4','D4','D4','D5','B4','G4','F4','E4','C5','C5','B4','G4','A4','G4'],
    source: 'Secuencia de práctica proporcionada por el usuario; no es una partitura editorial verificada.',
  },
  {
    id: 'cristo-es-mi-luz',
    title: 'Cristo es mi luz',
    level: 'Principiante',
    description: 'Melodía original de práctica creada para JAIRRESTAURA KIDS.',
    notes: ['C4','E4','G4','G4','A4','G4','E4','D4','C4','E4','G4','A4','C5','A4','G4','E4','D4','C4'],
    source: 'Composición original de práctica para esta aplicación.',
  },
];

const midiFrequency = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);
const makeKeyboard = (): PianoNote[] => {
  const notes: PianoNote[] = [];
  for (let octave = 4; octave <= 5; octave += 1) {
    NOTE_ORDER.forEach((letter, index) => {
      const midi = 12 * (octave + 1) + [0, 2, 4, 5, 7, 9, 11][index];
      notes.push({
        key: letter + octave,
        letter,
        octave,
        label: NOTE_LABELS[letter],
        frequency: midiFrequency(midi),
        black: false,
      });
    });
  }
  return notes;
};

const KEYBOARD = makeKeyboard();
const BLACK_KEYS = [
  { after: 'C', letter: 'C#', offset: 1 },
  { after: 'D', letter: 'D#', offset: 2 },
  { after: 'F', letter: 'F#', offset: 4 },
  { after: 'G', letter: 'G#', offset: 5 },
  { after: 'A', letter: 'A#', offset: 6 },
] as const;

export const PianoSchool: React.FC = () => {
  const [lessonId, setLessonId] = useState(LESSONS[0].id);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [demoIndex, setDemoIndex] = useState(0);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [slowMode, setSlowMode] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [hits, setHits] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const timerRef = useRef<number | null>(null);
  const activeLesson = LESSONS.find((lesson) => lesson.id === lessonId) ?? LESSONS[0];
  const keyboardByKey = useMemo(() => new Map(KEYBOARD.map((note) => [note.key, note])), []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('jairrestaura-kids-piano-progress-v1');
      if (saved) {
        const parsed = JSON.parse(saved) as { completedLessons?: string[]; hits?: number };
        setCompletedLessons(Array.isArray(parsed.completedLessons) ? parsed.completedLessons : []);
        setHits(typeof parsed.hits === 'number' ? parsed.hits : 0);
      }
    } catch {
      // El aprendizaje sigue disponible aunque el almacenamiento esté bloqueado.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'jairrestaura-kids-piano-progress-v1',
        JSON.stringify({ completedLessons, hits })
      );
    } catch {
      // No se bloquea la práctica si el navegador no permite guardar.
    }
  }, [completedLessons, hits]);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  const playNote = (key: string, countPractice = true) => {
    const note = keyboardByKey.get(key);
    if (!note) return;
    audioEngine.playTone(note.frequency, 0.42, 'triangle', 0.16);
    setActiveNote(key);
    window.setTimeout(() => setActiveNote((current) => current === key ? null : current), 260);
    if (countPractice && practiceMode) {
      const expected = activeLesson.notes[practiceIndex];
      setAttempts((value) => value + 1);
      if (key === expected) {
        const next = practiceIndex + 1;
        setHits((value) => value + 1);
        setPracticeIndex(next);
        if (next >= activeLesson.notes.length) {
          setCompletedLessons((current) => current.includes(activeLesson.id) ? current : [...current, activeLesson.id]);
          setPracticeIndex(0);
        }
      }
    }
  };

  const stopDemo = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    setDemoPlaying(false);
  };

  const runDemoFrom = (index: number) => {
    if (index >= activeLesson.notes.length) {
      if (repeat) {
        setDemoIndex(0);
        runDemoFrom(0);
      } else {
        setDemoPlaying(false);
        setDemoIndex(0);
      }
      return;
    }
    const key = activeLesson.notes[index];
    setDemoIndex(index);
    playNote(key, false);
    timerRef.current = window.setTimeout(
      () => runDemoFrom(index + 1),
      slowMode ? 1050 : 620
    );
  };

  const toggleDemo = () => {
    if (demoPlaying) {
      stopDemo();
      return;
    }
    setDemoPlaying(true);
    runDemoFrom(demoIndex);
  };

  const chooseLesson = (id: string) => {
    stopDemo();
    setLessonId(id);
    setDemoIndex(0);
    setPracticeIndex(0);
    setAttempts(0);
    setPracticeMode(false);
  };

  const expectedNote = activeLesson.notes[practiceIndex] ?? activeLesson.notes[0];
  const whiteKeys = KEYBOARD;
  const blackKeyFrequency = (letter: string, octave: number) => {
    const base = KEYBOARD.find((note) => note.letter === letter[0] && note.octave === octave);
    return base ? base.frequency * Math.pow(2, 1 / 12) : 0;
  };

  return (
    <section className="space-y-5 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-sky-50 p-5 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">Nueva aula · Planeta Musical</p>
          <h3 className="mt-1 font-display text-2xl font-extrabold text-stone-900 dark:text-white">🎹 Escuela de Piano y Teclado</h3>
          <p className="mt-1 max-w-2xl text-sm text-stone-600 dark:text-stone-300">Aprende las notas, escucha la melodía y tócala tecla por tecla. C = DO · D = RE · E = MI · F = FA · G = SOL · A = LA · B = SI.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 text-xs font-bold text-amber-800 dark:bg-slate-800 dark:text-amber-200">
          <Trophy className="h-4 w-4" /> {hits} aciertos
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {LESSONS.map((lesson) => (
          <button key={lesson.id} type="button" onClick={() => chooseLesson(lesson.id)}
            className={`rounded-2xl border p-4 text-left transition ${lessonId === lesson.id ? 'border-amber-500 bg-amber-100/80 dark:bg-amber-950/40' : 'border-stone-200 bg-white dark:border-slate-700 dark:bg-slate-800'}`}>
            <span className="text-[11px] font-extrabold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">{lesson.level}</span>
            <span className="mt-1 block font-bold text-stone-900 dark:text-white">{lesson.title}</span>
            <span className="mt-1 block text-xs text-stone-600 dark:text-stone-300">{lesson.description}</span>
            {completedLessons.includes(lesson.id) && <span className="mt-2 inline-block text-xs font-bold text-emerald-700 dark:text-emerald-300">✓ Lección practicada</span>}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={toggleDemo} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700">
          {demoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {demoPlaying ? 'Pausar demostración' : demoIndex > 0 ? 'Continuar demostración' : 'Escuchar melodía'}
        </button>
        <button type="button" onClick={() => { stopDemo(); setDemoIndex(0); }} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
          <Repeat className="h-4 w-4" /> Reiniciar
        </button>
        <button type="button" onClick={() => setSlowMode((value) => !value)} className={`min-h-[44px] rounded-xl border px-4 py-2 text-sm font-bold ${slowMode ? 'border-sky-500 bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200' : 'border-stone-300 bg-white text-stone-700 dark:border-slate-600 dark:bg-slate-800 dark:text-white'}`}>
          {slowMode ? 'Velocidad lenta' : 'Velocidad normal'}
        </button>
        <button type="button" onClick={() => setRepeat((value) => !value)} className={`min-h-[44px] rounded-xl border px-4 py-2 text-sm font-bold ${repeat ? 'border-amber-500 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200' : 'border-stone-300 bg-white text-stone-700 dark:border-slate-600 dark:bg-slate-800 dark:text-white'}`}>
          {repeat ? 'Repetición activada' : 'Repetir'}
        </button>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-950/60">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-800 dark:text-white"><BookOpen className="h-4 w-4 text-amber-600" /> Cifrado de la melodía</div>
          <span className="text-xs text-stone-500 dark:text-stone-400">Nota {Math.min(demoIndex + 1, activeLesson.notes.length)} de {activeLesson.notes.length}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {activeLesson.notes.map((note, index) => (
            <span key={`${note}-${index}`} className={`rounded-lg px-2 py-1 font-mono text-xs font-bold ${index === demoIndex && demoPlaying ? 'bg-amber-400 text-amber-950' : 'bg-stone-100 text-stone-700 dark:bg-slate-800 dark:text-stone-200'}`}>{note}</span>
          ))}
        </div>
        <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">{activeLesson.source}</p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950/70 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-extrabold text-stone-900 dark:text-white">Tu teclado de dos octavas</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">Desliza horizontalmente si lo necesitas.</p>
          </div>
          <Sparkles className="h-5 w-5 text-amber-500" />
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="relative min-w-[700px]">
            <div className="grid grid-cols-14 gap-0">
              {whiteKeys.map((note) => (
                <button key={note.key} type="button" onClick={() => playNote(note.key)}
                  aria-label={`${note.label} ${note.octave} (${note.key})`}
                  className={`relative z-0 flex h-36 min-w-0 flex-col items-center justify-end rounded-b-lg border border-stone-300 pb-3 text-[10px] font-extrabold transition sm:h-44 ${activeNote === note.key ? 'bg-amber-200 ring-2 ring-amber-500' : 'bg-white text-stone-600 hover:bg-amber-50'}`}>
                  <span>{note.letter}</span><span>{note.label}</span><span className="text-[9px] text-stone-400">{note.octave}</span>
                </button>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 grid h-24 grid-cols-14">
              {Array.from({ length: 14 }, (_, index) => {
                const letter = NOTE_ORDER[index % 7];
                const octave = 4 + Math.floor(index / 7);
                const black = BLACK_KEYS.find((item) => item.after === letter);
                if (!black) return <span key={index} />;
                const key = black.letter + octave;
                const frequency = blackKeyFrequency(black.letter, octave);
                return <button key={key} type="button" onClick={(event) => { event.stopPropagation(); audioEngine.playTone(frequency, 0.42, 'triangle', 0.16); setActiveNote(key); window.setTimeout(() => setActiveNote(null), 260); }}
                  aria-label={`Tecla sostenida ${key}`} className={`pointer-events-auto relative -ml-2 h-24 w-4/5 justify-self-end rounded-b-md border border-black bg-stone-900 text-[9px] font-bold text-white shadow-md ${activeNote === key ? 'bg-amber-600' : 'hover:bg-stone-700'}`}>
                  ♯
                </button>;
              })}
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-stone-500 dark:text-stone-400">Las teclas blancas muestran letra y nombre musical. Las negras son sostenidos (♯).</p>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-bold text-emerald-900 dark:text-emerald-200">Ahora inténtalo tú</p>
            <p className="text-xs text-emerald-800 dark:text-emerald-300">Activa la práctica y toca la siguiente nota correcta.</p>
          </div>
          <button type="button" onClick={() => { setPracticeMode((value) => !value); setPracticeIndex(0); setAttempts(0); }}
            className={`min-h-[42px] rounded-xl px-4 py-2 text-sm font-bold ${practiceMode ? 'bg-emerald-800 text-white' : 'bg-white text-emerald-800 dark:bg-slate-800 dark:text-emerald-200'}`}>
            {practiceMode ? 'Salir de práctica' : 'Iniciar práctica'}
          </button>
        </div>
        {practiceMode && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
            <p className="font-bold text-emerald-900 dark:text-emerald-100">Busca: {expectedNote} ({NOTE_LABELS[expectedNote[0] as NoteName]})</p>
            <p className="text-xs text-emerald-800 dark:text-emerald-300">Progreso: {practiceIndex}/{activeLesson.notes.length} · Intentos: {attempts}</p>
          </div>
        )}
      </div>
    </section>
  );
};
