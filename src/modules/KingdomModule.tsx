import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Film,
  Gamepad2,
  Heart,
  Music,
  Palette,
  Sparkles,
  Star,
  Trophy,
  Users,
  Volume2,
  VolumeX,
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
  kingdom: <Compass className="h-7 w-7" />,
  stories: <BookOpen className="h-7 w-7" />,
  music: <Music className="h-7 w-7" />,
  games: <Gamepad2 className="h-7 w-7" />,
  creativity: <Palette className="h-7 w-7" />,
  prayer: <Heart className="h-7 w-7" />,
  characters: <Sparkles className="h-7 w-7" />,
  missions: <Trophy className="h-7 w-7" />,
  family: <Users className="h-7 w-7" />,
  pastor: <Star className="h-7 w-7" />,
};

const PORTAL_STYLES: Record<
  ModuleId,
  { surface: string; iconWrap: string; ctaBg: string; image?: string }
> = {
  kingdom: {
    surface:
      'bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 border-amber-300 dark:from-amber-950/70 dark:via-slate-900 dark:to-orange-950/60 dark:border-amber-800',
    iconWrap: 'bg-amber-500 text-white shadow-md',
    ctaBg: 'bg-amber-600 text-white',
    image: ASSET_IMAGES.heroKingdom,
  },
  stories: {
    surface:
      'bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100 border-sky-300 dark:from-sky-950/70 dark:via-slate-900 dark:to-blue-950/60 dark:border-sky-800',
    iconWrap: 'bg-sky-600 text-white shadow-md',
    ctaBg: 'bg-sky-600 text-white',
    image: ASSET_IMAGES.bibleStories,
  },
  music: {
    surface:
      'bg-gradient-to-br from-emerald-100 via-teal-50 to-green-100 border-emerald-300 dark:from-emerald-950/70 dark:via-slate-900 dark:to-teal-950/60 dark:border-emerald-800',
    iconWrap: 'bg-emerald-600 text-white shadow-md',
    ctaBg: 'bg-emerald-600 text-white',
    image: ASSET_IMAGES.musicPlanet,
  },
  games: {
    surface:
      'bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100 border-orange-300 dark:from-orange-950/70 dark:via-slate-900 dark:to-rose-950/60 dark:border-orange-800',
    iconWrap: 'bg-orange-500 text-white shadow-md',
    ctaBg: 'bg-orange-600 text-white',
  },
  creativity: {
    surface:
      'bg-gradient-to-br from-rose-100 via-pink-50 to-fuchsia-100 border-rose-300 dark:from-rose-950/70 dark:via-slate-900 dark:to-fuchsia-950/60 dark:border-rose-800',
    iconWrap: 'bg-rose-500 text-white shadow-md',
    ctaBg: 'bg-rose-600 text-white',
    image: ASSET_IMAGES.creativityWorkshop,
  },
  prayer: {
    surface:
      'bg-gradient-to-br from-indigo-100 via-violet-50 to-sky-100 border-indigo-300 dark:from-indigo-950/70 dark:via-slate-900 dark:to-violet-950/60 dark:border-indigo-800',
    iconWrap: 'bg-indigo-600 text-white shadow-md',
    ctaBg: 'bg-indigo-600 text-white',
  },
  characters: {
    surface:
      'bg-gradient-to-br from-teal-100 via-cyan-50 to-emerald-100 border-teal-300 dark:from-teal-950/70 dark:via-slate-900 dark:to-emerald-950/60 dark:border-teal-800',
    iconWrap: 'bg-teal-600 text-white shadow-md',
    ctaBg: 'bg-teal-600 text-white',
  },
  missions: {
    surface:
      'bg-gradient-to-br from-yellow-100 via-amber-50 to-lime-100 border-yellow-300 dark:from-yellow-950/70 dark:via-slate-900 dark:to-amber-950/60 dark:border-yellow-800',
    iconWrap: 'bg-yellow-500 text-stone-950 shadow-md',
    ctaBg: 'bg-amber-600 text-white',
  },
  family: {
    surface:
      'bg-gradient-to-br from-lime-100 via-emerald-50 to-yellow-100 border-lime-300 dark:from-lime-950/70 dark:via-slate-900 dark:to-emerald-950/60 dark:border-lime-800',
    iconWrap: 'bg-lime-600 text-white shadow-md',
    ctaBg: 'bg-lime-700 text-white',
  },
  pastor: {
    surface:
      'bg-gradient-to-br from-amber-100 via-stone-100 to-sky-100 border-amber-300 dark:from-amber-950/70 dark:via-slate-900 dark:to-slate-800 dark:border-amber-800',
    iconWrap: 'bg-amber-700 text-white shadow-md',
    ctaBg: 'bg-amber-700 text-white',
    image: ASSET_IMAGES.pastorJairStudio,
  },
};

export const KingdomModule: React.FC<KingdomModuleProps> = ({
  progress,
  onSelectModule,
  onSelectAgeGroup,
}) => {
  const [heroViewMode, setHeroViewMode] = useState<'3d' | 'cinema'>('3d');
  const [activeCharacter, setActiveCharacter] = useState<CharacterId>('lucas');
  const [expression, setExpression] = useState<CharacterExpression>('alegre');
  const [ambientPlaying, setAmbientPlaying] = useState(false);

  useEffect(() => {
    if (!progress.settings.musicEnabled && ambientPlaying) {
      audioEngine.stopAmbientKingdom();
      setAmbientPlaying(false);
    }
  }, [progress.settings.musicEnabled, ambientPlaying]);

  useEffect(() => {
    return () => {
      audioEngine.stopAmbientKingdom();
    };
  }, []);

  const toggleAmbient = () => {
    if (ambientPlaying) {
      audioEngine.stopAmbientKingdom();
      setAmbientPlaying(false);
    } else {
      const ok = audioEngine.startAmbientKingdom(progress.settings.musicEnabled);
      setAmbientPlaying(ok);
    }
  };

  const charData = CHARACTERS[activeCharacter];

  const handleCharacterTap = (id: CharacterId) => {
    setActiveCharacter(id);
    setExpression((prev) => (prev === 'alegre' ? 'animando' : 'alegre'));
    audioEngine.playCharacterSound(id, progress.settings.soundEnabled);
    if (progress.settings.voiceMode === 'kids' && progress.settings.soundEnabled) {
      audioEngine.speakKidsVoice(CHARACTERS[id].greetings[progress.ageGroup], id, true);
    }
  };

  const ageOptions: { id: AgeGroup; label: string; desc: string; badge: string }[] = [
    { id: '3-5', label: '3–5 años', desc: 'Dibujos grandes, sonidos y juegos suaves', badge: 'Pequeños' },
    { id: '6-8', label: '6–8 años', desc: 'Historias guiadas, música y retos', badge: 'Exploradores' },
    { id: '9-12', label: '9–12 años', desc: 'Misiones bíblicas, trivia y valores', badge: 'Valientes' },
  ];

  const isPreschool = progress.ageGroup === '3-5';

  return (
    <div className="space-y-10">
      {/* Cinematic Adventure Kingdom Stage */}
      <section className="overflow-hidden rounded-3xl border-2 border-amber-200 bg-gradient-to-b from-sky-100 via-amber-50/70 to-emerald-50/60 p-4 sm:p-7 shadow-lg dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        {/* Top Kingdom Story Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between mb-6">
          <div className="max-w-2xl space-y-2.5">
            <p className="text-xs font-bold tracking-wide text-amber-800 dark:text-amber-300">
              JAIRRESTAURA · Pastor Jair Hernández · Gratuito y seguro
            </p>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
              ¡Pequeños exploradores, grandes aventuras con Jesús!
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-300">
              {isPreschool
                ? 'Toca el castillo, las nubes, la cascada o a tus amigos Lucas, Luna, León, Cordero y Estrellita para jugar juntos.'
                : progress.ageGroup === '6-8'
                ? 'Explora un reino vivo en 3D con historias de la Biblia, música alegre, juegos y momentos especiales con Dios.'
                : 'Recorre el Reino 3D, supera retos bíblicos por nivel, colecciona medallas y comparte valores con tu familia.'}
            </p>
          </div>

          {/* Interactive World Mode + Music Toggle */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={toggleAmbient}
              className={`inline-flex min-h-[46px] items-center gap-2 rounded-2xl px-4 py-2 text-xs font-extrabold shadow-sm transition whitespace-nowrap ${
                ambientPlaying
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-white text-stone-800 border border-stone-300 hover:bg-amber-50 dark:bg-slate-800 dark:border-slate-700 dark:text-stone-100'
              }`}
            >
              {ambientPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              {ambientPlaying ? 'Música del Reino activa' : 'Escuchar Música del Reino'}
            </button>

            <div className="inline-flex rounded-2xl border border-stone-200 bg-white/90 p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setHeroViewMode('3d')}
                className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                  heroViewMode === '3d'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-600 dark:text-stone-300'
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                Reino 3D Vivo
              </button>
              <button
                type="button"
                onClick={() => setHeroViewMode('cinema')}
                className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                  heroViewMode === 'cinema'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-600 dark:text-stone-300'
                }`}
              >
                <Film className="h-3.5 w-3.5" />
                Escena Ilustrada
              </button>
            </div>
          </div>
        </div>

        {/* Full-Width 3D Living Kingdom Viewport */}
        {heroViewMode === '3d' ? (
          <Kingdom3DScene
            darkMode={progress.settings.darkMode}
            soundEnabled={progress.settings.soundEnabled}
            ambientPlaying={ambientPlaying}
            activeCharacter={activeCharacter}
            onToggleAmbient={toggleAmbient}
            onSelectCharacter={handleCharacterTap}
            onSelectModule={onSelectModule}
          />
        ) : (
          <div className="relative h-[440px] sm:h-[520px] lg:h-[560px] w-full overflow-hidden rounded-3xl border-2 border-amber-200/80 shadow-xl dark:border-slate-700">
            <img
              src={ASSET_IMAGES.heroKingdom}
              alt="Reino fantástico de JAIRRESTAURA KIDS con castillo iluminado, cascada, arcoíris y amigos"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
              <p className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                El Castillo de la Luz y el Arcoíris de la Promesa
              </p>
              <p className="mt-1.5 max-w-2xl text-sm text-stone-200">
                Cambia a «Reino 3D Vivo» arriba para explorar en 360°, tocar las nubes, escuchar la
                cascada y hacer saltar a Lucas, Luna, León, Cordero y Estrellita.
              </p>
            </div>
          </div>
        )}

        {/* Explorer Age Selector & Direct Big Adventure CTAs */}
        <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold text-stone-700 dark:text-stone-300">
              Elige tu aventura por edad{' '}
              {progress.settings.ageLocked ? '· Bloqueado por papás' : ''}
            </p>
            <div className="flex flex-wrap gap-2.5">
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
                    className={`min-h-[50px] rounded-2xl px-4 py-2 text-left transition whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-300'
                        : 'border border-stone-300 bg-white text-stone-800 hover:bg-amber-50 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-100'
                    } ${progress.settings.ageLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <span className="block text-sm font-extrabold">{opt.label}</span>
                    <span className="block text-[11px] opacity-90">{opt.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                audioEngine.playSparkleBurst(progress.settings.soundEnabled);
                onSelectModule('stories');
              }}
              className="inline-flex min-h-[54px] items-center gap-2.5 rounded-2xl bg-sky-600 px-6 py-3 text-base font-extrabold text-white shadow-md transition hover:scale-[1.02] hover:bg-sky-700 whitespace-nowrap"
            >
              <BookOpen className="h-5 w-5" />
              Entrar a Historias 3D
            </button>
            <button
              type="button"
              onClick={() => {
                audioEngine.playSparkleBurst(progress.settings.soundEnabled);
                onSelectModule('games');
              }}
              className="inline-flex min-h-[54px] items-center gap-2.5 rounded-2xl bg-orange-500 px-6 py-3 text-base font-extrabold text-white shadow-md transition hover:scale-[1.02] hover:bg-orange-600 whitespace-nowrap"
            >
              <Gamepad2 className="h-5 w-5" />
              ¡A Jugar Ahora!
            </button>
            <button
              type="button"
              onClick={() => {
                audioEngine.playSparkleBurst(progress.settings.soundEnabled);
                onSelectModule('music');
              }}
              className="inline-flex min-h-[54px] items-center gap-2.5 rounded-2xl bg-emerald-600 px-5 py-3 text-base font-extrabold text-white shadow-md transition hover:scale-[1.02] hover:bg-emerald-700 whitespace-nowrap"
            >
              <Music className="h-5 w-5" />
              Cantar
            </button>
          </div>
        </div>
      </section>

      {/* Plaza de tus 5 Amigos del Reino */}
      <section className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-sky-50 p-6 sm:p-7 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CharacterAvatar character={activeCharacter} expression={expression} size="xl" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                <span>{charData.name}</span>
                <span aria-hidden="true">·</span>
                <span>{charData.role}</span>
              </div>
              <p className="font-display text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-50">
                “{charData.greetings[progress.ageGroup]}”
              </p>
              <p className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                {charData.favoriteVerse}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {CHARACTER_LIST.map((char) => {
              const selected = char.id === activeCharacter;
              return (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => handleCharacterTap(char.id)}
                  className={`flex min-h-[56px] items-center gap-2.5 rounded-2xl border-2 px-3.5 py-2 text-sm font-extrabold transition whitespace-nowrap shrink-0 ${
                    selected
                      ? 'border-amber-500 bg-amber-100 text-amber-950 shadow-sm scale-[1.03] dark:border-amber-400 dark:bg-amber-950/60 dark:text-amber-100'
                      : 'border-stone-200 bg-white text-stone-800 hover:border-amber-300 hover:bg-amber-50 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-100'
                  }`}
                >
                  <CharacterAvatar character={char.id} size="sm" animated={false} className="!w-10 !h-10" />
                  <span>{char.name}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => handleCharacterTap(activeCharacter)}
              className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl bg-sky-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-sky-700 whitespace-nowrap shrink-0"
            >
              <Volume2 className="h-5 w-5" />
              Saludar
            </button>
          </div>
        </div>
      </section>

      {/* Los 10 Portales Visuales de Aventura */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50">
              Explora los 10 Mundos de JAIRRESTAURA KIDS
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300">
              Toca cualquier portal colorido para entrar a jugar, cantar, pintar o descubrir la Biblia.
            </p>
          </div>
          <span className="font-mono-nums text-sm font-extrabold text-amber-700 dark:text-amber-400">
            {progress.visitedModules.length}/10 mundos explorados
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {MODULES.map((mod) => {
            const visited = progress.visitedModules.includes(mod.id);
            const style = PORTAL_STYLES[mod.id];
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => {
                  audioEngine.playSparkleBurst(progress.settings.soundEnabled);
                  onSelectModule(mod.id);
                }}
                className={`group flex flex-col justify-between overflow-hidden rounded-3xl border-2 ${style.surface} text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl`}
              >
                {style.image && (
                  <div className="h-28 w-full overflow-hidden">
                    <img
                      src={style.image}
                      alt={mod.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${style.iconWrap}`}
                      >
                        {MODULE_ICONS[mod.id]}
                      </span>
                      <span className="font-mono-nums text-xs font-extrabold text-stone-500 dark:text-stone-400">
                        {mod.number}
                      </span>
                    </div>

                    <h3
                      className={`mt-4 font-display font-extrabold text-stone-900 dark:text-stone-50 ${
                        isPreschool ? 'text-xl' : 'text-lg'
                      }`}
                    >
                      {mod.title}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                      {mod.subtitle}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-extrabold ${style.ctaBg} shadow-sm whitespace-nowrap`}
                    >
                      {visited ? 'Volver a entrar' : '¡Explorar!'}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
