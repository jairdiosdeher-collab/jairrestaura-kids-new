import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Gamepad2,
  Heart,
  Music,
  Palette,
  Sparkles,
  Star,
  Trophy,
  Users,
  Volume2,
} from 'lucide-react';
import { AgeGroup, AppProgress, CharacterExpression, CharacterId, ModuleId } from '../types/app';
import { ASSET_IMAGES, MODULES } from '../data/modulesData';
import { CHARACTER_LIST, CHARACTERS } from '../data/characters';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { Kingdom3DScene } from '../components/Kingdom3DScene';
import { audioEngine } from '../services/audioEngine';

interface KingdomModuleProps {
  progress: AppProgress;
  onSelectModule: (moduleId: ModuleId) => void;
  onSelectAgeGroup: (age: AgeGroup) => void;
}

const MODULE_ICONS: Record<ModuleId, React.ReactNode> = {
  kingdom: <Compass className="h-5 w-5" />,
  stories: <BookOpen className="h-5 w-5" />,
  music: <Music className="h-5 w-5" />,
  games: <Gamepad2 className="h-5 w-5" />,
  creativity: <Palette className="h-5 w-5" />,
  prayer: <Heart className="h-5 w-5" />,
  characters: <Sparkles className="h-5 w-5" />,
  missions: <Trophy className="h-5 w-5" />,
  family: <Users className="h-5 w-5" />,
  pastor: <Star className="h-5 w-5" />,
};

export const KingdomModule: React.FC<KingdomModuleProps> = ({
  progress,
  onSelectModule,
  onSelectAgeGroup,
}) => {
  const [heroViewMode, setHeroViewMode] = useState<'3d' | 'cinema'>('3d');
  const [activeCharacter, setActiveCharacter] = useState<CharacterId>('lucas');
  const [expression, setExpression] = useState<CharacterExpression>('alegre');

  const charData = CHARACTERS[activeCharacter];

  const handleCharacterTap = (id: CharacterId) => {
    setActiveCharacter(id);
    setExpression('alegre');
    audioEngine.playCharacterSound(id, progress.settings.soundEnabled);
    if (progress.settings.voiceMode === 'kids' && progress.settings.soundEnabled) {
      audioEngine.speakKidsVoice(
        CHARACTERS[id].greetings[progress.ageGroup],
        id,
        true
      );
    }
  };

  const ageOptions: { id: AgeGroup; label: string; desc: string }[] = [
    { id: '3-5', label: '3–5 años', desc: 'Botones grandes e imágenes' },
    { id: '6-8', label: '6–8 años', desc: 'Historias y juegos guiados' },
    { id: '9-12', label: '9–12 años', desc: 'Retos bíblicos y misiones' },
  ];

  return (
    <div className="space-y-10">
      {/* Cinematic Opening Stage */}
      <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-wide text-amber-700 dark:text-amber-400">
                JAIRRESTAURA · Pastor Jair Hernández
              </p>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
                ¡Pequeños exploradores, grandes aventuras con Jesús!
              </h1>
              <p className="text-base leading-relaxed text-stone-600 dark:text-stone-300">
                Bienvenido al Reino iluminado. Recorre las montañas, el castillo, las cascadas y el
                arcoíris junto a Lucas, Luna, León, Cordero y Estrellita.
              </p>

              {/* Age Mode Selector */}
              <div className="pt-2">
                <p className="mb-2 text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Elige tu edad de explorador
                </p>
                <div className="flex flex-wrap gap-2">
                  {ageOptions.map((opt) => {
                    const active = progress.ageGroup === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={progress.settings.ageLocked}
                        onClick={() => {
                          onSelectAgeGroup(opt.id);
                          audioEngine.playChime(progress.settings.soundEnabled);
                        }}
                        className={`min-h-[44px] rounded-xl px-3.5 py-2 text-left text-xs font-semibold transition whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-200 dark:hover:bg-slate-700'
                        } ${progress.settings.ageLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">
                  {ageOptions.find((a) => a.id === progress.ageGroup)?.desc}
                  {progress.settings.ageLocked ? ' · Bloqueado por padres' : ''}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  audioEngine.playChime(progress.settings.soundEnabled);
                  onSelectModule('stories');
                }}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700 whitespace-nowrap shrink-0"
              >
                <BookOpen className="h-4 w-4" />
                Explorar Historias 3D
              </button>
              <button
                type="button"
                onClick={() => {
                  audioEngine.playChime(progress.settings.soundEnabled);
                  onSelectModule('games');
                }}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-stone-300 bg-white px-5 py-3 text-sm font-bold text-stone-800 transition hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-100 dark:hover:bg-slate-700 whitespace-nowrap shrink-0"
              >
                <Gamepad2 className="h-4 w-4" />
                Jugar Ahora
              </button>
            </div>
          </div>

          {/* Right Stage: Interactive 3D Kingdom or Cinematic Film Illustration */}
          <div className="flex flex-col justify-between bg-stone-100 p-4 sm:p-5 lg:col-span-7 dark:bg-slate-950">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                Escenario del Reino · {heroViewMode === '3d' ? 'Mundo 3D Interactivo' : 'Vista Cinematográfica'}
              </span>
              <div className="inline-flex rounded-xl bg-stone-200/80 p-1 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setHeroViewMode('3d')}
                  className={`min-h-[36px] rounded-lg px-3 py-1 text-xs font-semibold transition whitespace-nowrap ${
                    heroViewMode === '3d'
                      ? 'bg-white text-stone-900 shadow-sm dark:bg-slate-700 dark:text-white'
                      : 'text-stone-600 dark:text-stone-300'
                  }`}
                >
                  Reino 3D
                </button>
                <button
                  type="button"
                  onClick={() => setHeroViewMode('cinema')}
                  className={`min-h-[36px] rounded-lg px-3 py-1 text-xs font-semibold transition whitespace-nowrap ${
                    heroViewMode === 'cinema'
                      ? 'bg-white text-stone-900 shadow-sm dark:bg-slate-700 dark:text-white'
                      : 'text-stone-600 dark:text-stone-300'
                  }`}
                >
                  Ilustración 3D
                </button>
              </div>
            </div>

            {heroViewMode === '3d' ? (
              <Kingdom3DScene
                darkMode={progress.settings.darkMode}
                onSelectCharacter={handleCharacterTap}
                onSelectModule={onSelectModule}
              />
            ) : (
              <div className="relative h-[420px] sm:h-[500px] lg:h-[540px] w-full overflow-hidden rounded-3xl border border-stone-200 dark:border-slate-800">
                <img
                  src={ASSET_IMAGES.heroKingdom}
                  alt="Reino fantástico de JAIRRESTAURA KIDS con castillo iluminado, cascada, arcoíris y amigos"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <p className="font-display text-xl font-bold text-white">
                    El Castillo de la Luz y el Arcoíris de la Promesa
                  </p>
                  <p className="mt-1 text-sm text-stone-200">
                    Cambia a «Reino 3D» arriba para girar la cámara y saludar a cada personaje en tiempo real.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Character Greeting Strip */}
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <CharacterAvatar character={activeCharacter} expression={expression} size="lg" />
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
                <span className="font-bold text-amber-700 dark:text-amber-400">{charData.name}</span>
                <span aria-hidden="true">·</span>
                <span>{charData.role}</span>
              </div>
              <p className="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
                “{charData.greetings[progress.ageGroup]}”
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-300">{charData.favoriteVerse}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CHARACTER_LIST.map((char) => {
              const selected = char.id === activeCharacter;
              return (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => handleCharacterTap(char.id)}
                  className={`flex min-h-[48px] items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-bold transition whitespace-nowrap shrink-0 ${
                    selected
                      ? 'border-amber-500 bg-amber-50 text-amber-900 dark:border-amber-500 dark:bg-amber-950/50 dark:text-amber-200'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-200'
                  }`}
                >
                  <CharacterAvatar character={char.id} size="sm" animated={false} className="!w-8 !h-8" />
                  <span>{char.name}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => handleCharacterTap(activeCharacter)}
              className="inline-flex min-h-[48px] items-center gap-1.5 rounded-2xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700 whitespace-nowrap shrink-0"
            >
              <Volume2 className="h-4 w-4" />
              Escuchar saludo
            </button>
          </div>
        </div>
      </section>

      {/* All 10 Kingdom Modules Grid */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-stone-900 dark:text-stone-50">
              Los 10 Mundos del Reino
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Cada módulo funciona al instante y guarda tus estrellas en este dispositivo sin registro.
            </p>
          </div>
          <span className="font-mono-nums text-xs font-semibold text-stone-500 dark:text-stone-400">
            {progress.visitedModules.length}/10 mundos explorados
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {MODULES.map((mod) => {
            const visited = progress.visitedModules.includes(mod.id);
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => {
                  audioEngine.playChime(progress.settings.soundEnabled);
                  onSelectModule(mod.id);
                }}
                className="group flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-500"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${mod.bgTint} ${mod.accent}`}>
                      {MODULE_ICONS[mod.id]}
                    </span>
                    <span className="font-mono-nums text-xs font-bold text-stone-400 dark:text-stone-500">
                      {mod.number}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-stone-900 group-hover:text-amber-700 dark:text-stone-100 dark:group-hover:text-amber-400">
                    {mod.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-stone-600 dark:text-stone-400">
                    {mod.subtitle}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400">
                  <span>{visited ? 'Explorado' : 'Entrar'}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
