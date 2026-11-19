import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Info,
  Music,
  Pause,
  Play,
  Repeat,
  RotateCcw,
  Sparkles,
  Square,
} from 'lucide-react';
import { AppProgress, KidsSong } from '../types/app';
import { KIDS_SONGS } from '../data/songs';
import { ASSET_IMAGES } from '../data/modulesData';
import { CHARACTERS } from '../data/characters';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { audioEngine } from '../services/audioEngine';

interface MusicModuleProps {
  progress: AppProgress;
  onCompleteSong: (songId: string) => void;
}

const XYLOPHONE_KEYS = [
  { note: 'Do', freq: 523.25, color: 'bg-rose-500 hover:bg-rose-600' },
  { note: 'Re', freq: 587.33, color: 'bg-orange-500 hover:bg-orange-600' },
  { note: 'Mi', freq: 659.25, color: 'bg-amber-500 hover:bg-amber-600' },
  { note: 'Fa', freq: 698.46, color: 'bg-emerald-500 hover:bg-emerald-600' },
  { note: 'Sol', freq: 783.99, color: 'bg-sky-500 hover:bg-sky-600' },
  { note: 'La', freq: 880.0, color: 'bg-indigo-500 hover:bg-indigo-600' },
  { note: 'Si', freq: 987.77, color: 'bg-violet-500 hover:bg-violet-600' },
  { note: 'Do+', freq: 1046.5, color: 'bg-pink-500 hover:bg-pink-600' },
];

const EQ_BARS = [0.45, 0.8, 0.65, 0.95, 0.7, 0.85, 0.55, 0.9];

export const MusicModule: React.FC<MusicModuleProps> = ({ progress, onCompleteSong }) => {
  const [selectedSong, setSelectedSong] = useState<KidsSong>(KIDS_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [beatStep, setBeatStep] = useState(0);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [realRecordingAvailable, setRealRecordingAvailable] = useState(false);

  useEffect(() => {
    return () => {
      audioEngine.stopSong();
    };
  }, []);

  useEffect(() => {
    let active = true;
    const checkSlot = async () => {
      try {
        const res = await fetch(selectedSong.pastorIntroSlot, { method: 'HEAD' });
        const ct = res.headers.get('content-type') || '';
        if (active) {
          setRealRecordingAvailable(res.ok && ct.startsWith('audio/'));
        }
      } catch {
        if (active) setRealRecordingAvailable(false);
      }
    };
    void checkSlot();
    return () => {
      active = false;
    };
  }, [selectedSong]);

  const startPlayback = (song: KidsSong) => {
    setSelectedSong(song);
    setElapsedSec(0);
    setHasStarted(true);
    setIsPlaying(progress.settings.musicEnabled);
    audioEngine.playSong(song, {
      repeat,
      musicEnabled: progress.settings.musicEnabled,
      startAtSec: 0,
      onProgress: (sec) => setElapsedSec(sec),
      onBeat: (step) => setBeatStep(step),
      onEnded: () => {
        setIsPlaying(false);
        setHasStarted(false);
        setElapsedSec(song.durationSec);
        onCompleteSong(song.id);
      },
    });
  };

  const stopPlayback = () => {
    audioEngine.stopSong();
    setIsPlaying(false);
    setHasStarted(false);
    setElapsedSec(0);
  };

  const togglePlay = () => {
    if (!progress.settings.musicEnabled) return;
    if (isPlaying) {
      const pausedSec = audioEngine.pauseSong();
      setElapsedSec(pausedSec);
      setIsPlaying(false);
    } else if (hasStarted && elapsedSec > 0 && elapsedSec < selectedSong.durationSec) {
      const resumed = audioEngine.resumeSong();
      if (resumed) {
        setIsPlaying(true);
      } else {
        startPlayback(selectedSong);
      }
    } else {
      startPlayback(selectedSong);
    }
  };

  const activeLyricIndex = selectedSong.lyrics.reduce((acc, line, idx) => {
    return elapsedSec >= line.timeSec ? idx : acc;
  }, 0);

  const percent = Math.min(100, Math.round((elapsedSec / selectedSong.durationSec) * 100));

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-6">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Módulo 03 · Planeta Musical
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-stone-900 sm:text-3xl dark:text-stone-50">
              Canciones infantiles originales para cantar con Jesús
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              Composiciones completas (60–64 s) interpretadas con arreglo instrumental sintetizado
              en Web Audio API (marimba, flauta suave, bajo y percusión) que funciona sin internet.
              Acompaña con tu propia voz siguiendo la letra iluminada.
            </p>
            {!progress.settings.musicEnabled && (
              <p className="mt-3 text-xs font-semibold text-amber-700 dark:text-amber-400">
                La música está silenciada en el control parental. Actívala para escuchar las canciones.
              </p>
            )}
          </div>
          <div className="relative min-h-[200px] lg:col-span-6">
            <img
              src={ASSET_IMAGES.musicPlanet}
              alt="Escenario musical con marimba y arpa dorada"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Song List & Player */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-2.5 lg:col-span-5">
          {KIDS_SONGS.map((song) => {
            const active = song.id === selectedSong.id;
            const sung = progress.completedSongs.includes(song.id);
            return (
              <button
                key={song.id}
                type="button"
                onClick={() => startPlayback(song)}
                className={`flex w-full min-h-[64px] items-center justify-between gap-3 rounded-2xl border p-4 text-left transition ${
                  active
                    ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/40'
                    : 'border-stone-200 bg-white hover:bg-stone-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                    <Music className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold text-stone-900 dark:text-stone-100">
                      {song.title}
                    </p>
                    <p className="truncate text-xs text-stone-500 dark:text-stone-400">
                      {song.theme} · {song.durationSec}s · Instrumental sintetizado
                    </p>
                  </div>
                </div>
                {sung && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />}
              </button>
            );
          })}
        </div>

        <div className="space-y-5 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <CharacterAvatar
                character={selectedSong.characterLead}
                expression={isPlaying ? 'animando' : 'alegre'}
                size="md"
              />
              <div>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Canta con {CHARACTERS[selectedSong.characterLead].name}
                </p>
                <h3 className="font-display text-2xl font-extrabold text-stone-900 dark:text-stone-50">
                  {selectedSong.title}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">{selectedSong.verse}</p>
              </div>
            </div>

            {/* Rhythmic Visualizer Stage */}
            <div className="flex items-end gap-1 h-10 rounded-xl bg-emerald-50 px-3 py-2 dark:bg-emerald-950/40" aria-hidden="true">
              {EQ_BARS.map((base, idx) => {
                const factor = isPlaying
                  ? 0.35 + (((beatStep + idx * 3) % 7) / 6) * base
                  : 0.2;
                return (
                  <span
                    key={idx}
                    className="w-1.5 rounded-full bg-emerald-600 transition-all duration-150 dark:bg-emerald-400"
                    style={{ height: `${Math.round(factor * 26)}px` }}
                  />
                );
              })}
            </div>
          </div>

          {/* Honest Audio Source Distinction */}
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs text-stone-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-stone-300">
            <Info className="h-4 w-4 text-sky-600 shrink-0" />
            <span>
              <strong>Fuente actual:</strong> Instrumental sintetizado en vivo (Web Audio API).{' '}
              {realRecordingAvailable
                ? 'Grabación real adicional detectada en este dispositivo.'
                : `Sin grabación vocal real cargada aún (${selectedSong.pastorIntroSlot}).`}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-200"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex justify-between font-mono-nums text-xs text-stone-500 dark:text-stone-400">
              <span>{Math.floor(elapsedSec)}s</span>
              <span>{selectedSong.durationSec}s</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              disabled={!progress.settings.musicEnabled}
              onClick={togglePlay}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-45 whitespace-nowrap"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Pausar' : hasStarted && elapsedSec > 0 ? 'Continuar' : 'Reproducir'}
            </button>

            <button
              type="button"
              disabled={!hasStarted && elapsedSec === 0}
              onClick={stopPlayback}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-800 hover:bg-rose-100 disabled:opacity-45 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200 whitespace-nowrap"
            >
              <Square className="h-3.5 w-3.5" />
              Detener
            </button>

            <button
              type="button"
              disabled={!progress.settings.musicEnabled}
              onClick={() => startPlayback(selectedSong)}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-xs font-bold text-stone-700 hover:bg-stone-100 disabled:opacity-45 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-200 whitespace-nowrap"
            >
              <RotateCcw className="h-4 w-4" />
              Reiniciar
            </button>

            <button
              type="button"
              onClick={() => setRepeat((r) => !r)}
              className={`inline-flex min-h-[48px] items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-bold transition whitespace-nowrap ${
                repeat
                  ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                  : 'border-stone-300 bg-white text-stone-700 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-300'
              }`}
            >
              <Repeat className="h-4 w-4" />
              {repeat ? 'Repetición activa' : 'Modo repetir'}
            </button>
          </div>

          {/* Synchronized Lyrics */}
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 space-y-2 max-h-72 overflow-y-auto dark:border-slate-800 dark:bg-slate-950/60">
            <p className="text-xs font-bold text-stone-500 dark:text-stone-400">
              Letra sincronizada para cantar
            </p>
            {selectedSong.lyrics.map((line, idx) => {
              const current = isPlaying && idx === activeLyricIndex;
              return (
                <p
                  key={line.timeSec}
                  className={`text-sm sm:text-base transition-colors ${
                    current
                      ? 'font-bold text-emerald-700 dark:text-emerald-400'
                      : 'text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {line.section && (
                    <span className="mr-2 font-mono-nums text-[11px] font-bold text-stone-400 dark:text-stone-500">
                      [{line.section}]
                    </span>
                  )}
                  {line.text}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Kingdom Xylophone */}
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
              Xilófono Alegre del Reino
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Toca las teclas de colores para crear tu propia melodía de alabanza.
            </p>
          </div>
          <Sparkles className="h-5 w-5 text-amber-500" />
        </div>

        <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-8">
          {XYLOPHONE_KEYS.map((k) => (
            <button
              key={k.note}
              type="button"
              onClick={() => {
                setActiveKey(k.note);
                audioEngine.playTone(k.freq, 0.45, 'triangle', 0.16);
                window.setTimeout(() => setActiveKey(null), 200);
              }}
              className={`min-h-[84px] rounded-2xl ${k.color} flex flex-col items-center justify-end p-3 font-display text-sm font-extrabold text-white shadow-sm transition-transform ${
                activeKey === k.note ? 'scale-95 brightness-110' : 'hover:-translate-y-0.5'
              }`}
            >
              <span>{k.note}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
