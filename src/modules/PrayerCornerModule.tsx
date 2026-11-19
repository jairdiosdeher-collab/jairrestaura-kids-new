import React, { useEffect, useState } from 'react';
import { Heart, Sparkles, Sun, Trash2, Volume2 } from 'lucide-react';
import { AppProgress, PrayerEntry } from '../types/app';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { audioEngine } from '../services/audioEngine';

interface PrayerCornerModuleProps {
  progress: AppProgress;
  onAddPrayer: (entry: Omit<PrayerEntry, 'id' | 'date'>) => void;
  onDeletePrayer: (prayerId: string) => void;
}

const DAILY_VERSES = [
  'El Señor es mi pastor; nada me faltará. — Salmo 23:1',
  'En el día que temo, yo en ti confío. — Salmo 56:3',
  'Dejen que los niños vengan a mí, porque de ellos es el reino de los cielos. — Mateo 19:14',
  'Todo lo puedo en Cristo que me fortalece. — Filipenses 4:13',
];

const QUICK_GRATITUDE_CHIPS = [
  'Mi familia',
  'Mis amigos',
  'La creación de Dios',
  'Un nuevo día',
];

export const PrayerCornerModule: React.FC<PrayerCornerModuleProps> = ({
  progress,
  onAddPrayer,
  onDeletePrayer,
}) => {
  const [gratitude, setGratitude] = useState('');
  const [prayerFor, setPrayerFor] = useState('');
  const [trustStatement, setTrustStatement] = useState('Confío en que Jesús cuida de mí.');
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [breathActive, setBreathActive] = useState(false);
  const [verseNote, setVerseNote] = useState<string | null>(null);

  const verseOfDay = DAILY_VERSES[new Date().getDate() % DAILY_VERSES.length];

  useEffect(() => {
    if (!breathActive) return;
    const cycle = () => {
      setBreathPhase((prev) => (prev === 'in' ? 'hold' : prev === 'hold' ? 'out' : 'in'));
    };
    const id = window.setInterval(cycle, 3200);
    return () => window.clearInterval(id);
  }, [breathActive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitude.trim() && !prayerFor.trim()) return;
    onAddPrayer({
      gratitude: gratitude.trim() || 'Gracias Jesús por este nuevo día.',
      prayerFor: prayerFor.trim() || 'Por mi familia y mis amigos.',
      trustStatement: trustStatement.trim(),
    });
    setGratitude('');
    setPrayerFor('');
    audioEngine.playSuccess(progress.settings.soundEnabled);
  };

  const handleSpeakVerse = () => {
    const res = audioEngine.speakKidsVoice(
      verseOfDay,
      'estrellita',
      progress.settings.soundEnabled
    );
    if (!res.startedSpeech && res.reason !== 'muted') {
      setVerseNote('Sin voz en español instalada en este navegador; acompaña el versículo con el brillo de Estrellita.');
    } else if (res.reason === 'muted') {
      setVerseNote('El sonido está silenciado en el Espacio para Padres.');
    } else {
      setVerseNote(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Daily Verse & Calm Breathing with Estrellita */}
        <div className="space-y-5 rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6 sm:p-8 shadow-sm lg:col-span-5 dark:border-indigo-900 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950">
          <div className="flex items-center gap-4">
            <CharacterAvatar character="estrellita" expression="tierno" size="lg" />
            <div>
              <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                Módulo 06 · Mi Rincón con Dios
              </p>
              <h2 className="font-display text-2xl font-extrabold text-stone-900 dark:text-stone-50">
                Un momento tranquilo con Jesús
              </h2>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-white/90 p-4 dark:border-indigo-800 dark:bg-slate-900/90">
            <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
              <Sun className="h-4 w-4 text-amber-500" />
              Versículo para guardar en el corazón
            </p>
            <p className="mt-2 font-display text-base font-bold text-stone-900 dark:text-stone-100">
              “{verseOfDay}”
            </p>
            <button
              type="button"
              onClick={handleSpeakVerse}
              className="mt-3 inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
            >
              <Volume2 className="h-3.5 w-3.5" />
              Escuchar con Estrellita
            </button>
            {verseNote && (
              <p className="mt-2 text-xs text-indigo-700 dark:text-indigo-300">{verseNote}</p>
            )}
          </div>

          {/* Calm Breathing Exercise */}
          <div className="rounded-2xl border border-indigo-200 bg-white/90 p-5 text-center dark:border-indigo-800 dark:bg-slate-900/90">
            <p className="text-xs font-bold text-stone-700 dark:text-stone-200">
              Respiración de paz antes de orar
            </p>
            <div className="my-4 flex justify-center">
              <div
                className={`flex h-28 w-28 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-900 transition-transform duration-1000 dark:bg-indigo-900/60 dark:text-indigo-100 ${
                  breathActive && breathPhase === 'in'
                    ? 'scale-110'
                    : breathActive && breathPhase === 'hold'
                    ? 'scale-110 ring-4 ring-amber-300'
                    : 'scale-95'
                }`}
              >
                {!breathActive
                  ? 'Listo'
                  : breathPhase === 'in'
                  ? 'Respira suave'
                  : breathPhase === 'hold'
                  ? 'Siente paz'
                  : 'Suelta lento'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setBreathActive((b) => !b);
                audioEngine.playChime(progress.settings.soundEnabled);
              }}
              className="min-h-[42px] rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-800 hover:bg-indigo-100 dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-200"
            >
              {breathActive ? 'Detener ejercicio' : 'Comenzar momento de calma'}
            </button>
          </div>
        </div>

        {/* Guided Prayer Form & Local Gratitude Journal */}
        <div className="space-y-6 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-display text-xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              Escribe tu oración de hoy
            </h3>

            <div>
              <label
                htmlFor="prayer-gratitude-input"
                className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-1"
              >
                1. Hoy doy gracias a Dios por...
              </label>
              <input
                id="prayer-gratitude-input"
                type="text"
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="Ej. Mi familia, el sol y mis amigos..."
                className="w-full min-h-[46px] rounded-xl border border-stone-200 bg-stone-50 px-3.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {QUICK_GRATITUDE_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setGratitude(chip)}
                    className="rounded-lg border border-indigo-200 bg-indigo-50/70 px-2.5 py-1 text-[11px] font-semibold text-indigo-800 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-200"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="prayer-for-input"
                className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-1"
              >
                2. Quiero pedir a Jesús que cuide a...
              </label>
              <input
                id="prayer-for-input"
                type="text"
                value={prayerFor}
                onChange={(e) => setPrayerFor(e.target.value)}
                placeholder="Ej. Mis abuelitos, mis maestros..."
                className="w-full min-h-[46px] rounded-xl border border-stone-200 bg-stone-50 px-3.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div>
              <label
                htmlFor="prayer-trust-input"
                className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-1"
              >
                3. Promesa que recuerdo hoy:
              </label>
              <input
                id="prayer-trust-input"
                type="text"
                value={trustStatement}
                onChange={(e) => setTrustStatement(e.target.value)}
                className="w-full min-h-[46px] rounded-xl border border-stone-200 bg-stone-50 px-3.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <button
              type="submit"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
            >
              <Sparkles className="h-4 w-4" />
              Guardar en mi Diario de Oración (+4 ★)
            </button>
          </form>

          <div className="border-t border-stone-200 pt-5 dark:border-slate-800 space-y-3">
            <h4 className="font-display text-sm font-bold text-stone-700 dark:text-stone-200">
              Mis Oraciones Guardadas en este dispositivo ({progress.prayers.length})
            </h4>
            {progress.prayers.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-4 text-xs text-stone-600 dark:border-slate-700 dark:bg-slate-950/60 dark:text-stone-300">
                Aún no hay oraciones guardadas en este dispositivo. Escribe arriba tu primera
                oración de gratitud o toca una sugerencia rápida.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {progress.prayers.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-950/60"
                  >
                    <div className="space-y-1 min-w-0">
                      <p className="font-bold text-indigo-700 dark:text-indigo-400">{p.date}</p>
                      <p className="text-stone-800 dark:text-stone-200">
                        <strong>Gracias:</strong> {p.gratitude}
                      </p>
                      <p className="text-stone-700 dark:text-stone-300">
                        <strong>Oración:</strong> {p.prayerFor}
                      </p>
                      <p className="italic text-stone-500 dark:text-stone-400">“{p.trustStatement}”</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeletePrayer(p.id)}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-stone-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                      aria-label="Eliminar oración"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
