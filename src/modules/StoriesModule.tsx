import React, { useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Pause,
  Play,
  RotateCcw,
  Star,
  Volume2,
} from 'lucide-react';
import { AppProgress, BibleStory, StoryScene, VoiceMode } from '../types/app';
import { BIBLE_STORIES } from '../data/stories';
import { ASSET_IMAGES } from '../data/modulesData';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { CHARACTERS } from '../data/characters';
import { audioEngine } from '../services/audioEngine';

interface StoriesModuleProps {
  progress: AppProgress;
  onCompleteStory: (storyId: string, starsEarned: number) => void;
  onChangeVoiceMode: (mode: VoiceMode) => void;
}

const StorySceneDiorama: React.FC<{ theme: StoryScene['visualTheme'] }> = ({ theme }) => {
  const gradients: Record<StoryScene['visualTheme'], string> = {
    ark: 'from-sky-400 via-sky-200 to-emerald-300 dark:from-sky-900 dark:via-slate-800 dark:to-emerald-950',
    storm: 'from-slate-700 via-sky-800 to-indigo-950',
    valley: 'from-amber-200 via-lime-200 to-emerald-300 dark:from-amber-950 dark:via-emerald-950 dark:to-slate-900',
    palace: 'from-amber-300 via-orange-200 to-stone-300 dark:from-amber-950 dark:via-slate-900 dark:to-stone-950',
    sea: 'from-cyan-400 via-sky-500 to-blue-700',
    whale: 'from-blue-600 via-cyan-600 to-teal-800',
    star: 'from-indigo-950 via-slate-900 to-amber-950',
    meadow: 'from-lime-200 via-emerald-200 to-sky-200 dark:from-emerald-950 dark:via-slate-900 dark:to-sky-950',
    rainbow: 'from-sky-300 via-amber-100 to-emerald-200 dark:from-sky-950 dark:via-slate-900 dark:to-emerald-950',
  };

  return (
    <div className={`relative h-56 sm:h-64 w-full overflow-hidden rounded-2xl bg-gradient-to-b ${gradients[theme]} border border-stone-200/70 dark:border-slate-700`}>
      <svg viewBox="0 0 600 260" className="h-full w-full" aria-hidden="true">
        {theme === 'rainbow' && (
          <g fill="none" strokeWidth="10" opacity="0.85">
            <path d="M80 220 A 220 180 0 0 1 520 220" stroke="#EF4444" />
            <path d="M94 220 A 206 166 0 0 1 506 220" stroke="#F59E0B" />
            <path d="M108 220 A 192 152 0 0 1 492 220" stroke="#10B981" />
            <path d="M122 220 A 178 138 0 0 1 478 220" stroke="#0284C7" />
          </g>
        )}
        {(theme === 'star' || theme === 'palace') && (
          <g>
            <circle cx="110" cy="52" r="3" fill="#FEF08A" />
            <circle cx="480" cy="64" r="4" fill="#FEF08A" />
            <circle cx="210" cy="38" r="2.5" fill="#FEF08A" />
            <polygon points="300,24 312,56 346,58 319,78 328,110 300,92 272,110 281,78 254,58 288,56" fill="#FACC15" />
          </g>
        )}
        {theme === 'ark' && (
          <g>
            <path d="M0 190 Q150 175 300 190 T600 190 L600 260 L0 260 Z" fill="#0284C7" opacity="0.7" />
            <path d="M160 155 L440 155 L410 205 L190 205 Z" fill="#92400E" />
            <rect x="220" y="108" width="160" height="48" rx="6" fill="#B45309" />
            <polygon points="210,110 300,72 390,110" fill="#78350F" />
            <rect x="245" y="122" width="24" height="22" rx="4" fill="#FEF3C7" />
            <rect x="288" y="122" width="24" height="22" rx="4" fill="#FEF3C7" />
            <rect x="331" y="122" width="24" height="22" rx="4" fill="#FEF3C7" />
          </g>
        )}
        {theme === 'storm' && (
          <g>
            <ellipse cx="200" cy="62" rx="85" ry="30" fill="#334155" />
            <ellipse cx="370" cy="56" rx="95" ry="34" fill="#1E293B" />
            <path d="M0 185 Q75 155 150 185 T300 185 T450 185 T600 185 L600 260 L0 260 Z" fill="#0369A1" />
            <path d="M235 168 L365 168 L340 200 L260 200 Z" fill="#B45309" />
            <rect x="296" y="105" width="8" height="63" fill="#78350F" />
            <polygon points="304,110 355,150 304,155" fill="#FEF3C7" />
          </g>
        )}
        {theme === 'sea' && (
          <g>
            <path d="M0 140 C120 120 180 180 210 260 L0 260 Z" fill="#0EA5E9" opacity="0.85" />
            <path d="M600 140 C480 120 420 180 390 260 L600 260 Z" fill="#0EA5E9" opacity="0.85" />
            <path d="M210 260 L255 160 L345 160 L390 260 Z" fill="#E7D3B0" />
            <circle cx="300" cy="70" r="32" fill="#FDE047" />
          </g>
        )}
        {theme === 'whale' && (
          <g>
            <path d="M0 190 Q150 170 300 190 T600 190 L600 260 L0 260 Z" fill="#075985" />
            <ellipse cx="300" cy="175" rx="115" ry="52" fill="#1E40AF" />
            <path d="M400 175 L465 140 L450 175 L465 205 Z" fill="#1E40AF" />
            <circle cx="235" cy="162" r="6" fill="#FFFFFF" />
            <circle cx="236" cy="162" r="3" fill="#0F172A" />
          </g>
        )}
        {(theme === 'meadow' || theme === 'valley') && (
          <g>
            <circle cx="490" cy="58" r="30" fill="#FACC15" />
            <path d="M0 210 Q160 150 340 195 T600 175 L600 260 L0 260 Z" fill="#4D7C0F" />
            <path d="M0 225 Q220 180 420 220 T600 210 L600 260 L0 260 Z" fill="#65A30D" />
            <circle cx="140" cy="212" r="8" fill="#FB7185" />
            <circle cx="260" cy="222" r="7" fill="#FACC15" />
            <circle cx="420" cy="215" r="8" fill="#38BDF8" />
          </g>
        )}
        {theme === 'palace' && (
          <g>
            <path d="M0 210 L600 210 L600 260 L0 260 Z" fill="#D97706" opacity="0.35" />
            <rect x="200" y="120" width="200" height="90" fill="#F5F0E6" />
            <rect x="170" y="95" width="46" height="115" fill="#E7E5E4" />
            <rect x="384" y="95" width="46" height="115" fill="#E7E5E4" />
            <polygon points="165,95 193,60 221,95" fill="#0284C7" />
            <polygon points="379,95 407,60 435,95" fill="#0284C7" />
            <path d="M275 210 V168 C275 152 325 152 325 168 V210 Z" fill="#B45309" />
          </g>
        )}
      </svg>
    </div>
  );
};

export const StoriesModule: React.FC<StoriesModuleProps> = ({
  progress,
  onCompleteStory,
  onChangeVoiceMode,
}) => {
  const [selectedStory, setSelectedStory] = useState<BibleStory>(BIBLE_STORIES[0]);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pastorNotice, setPastorNotice] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      audioEngine.stopNarration();
    };
  }, []);

  const currentScene = selectedStory.scenes[sceneIndex];
  const narrationText = currentScene.narration[progress.ageGroup];
  const question = selectedStory.questions[progress.ageGroup][0];
  const isCompleted = progress.completedStories.includes(selectedStory.id);

  const openStory = (story: BibleStory) => {
    audioEngine.stopNarration();
    setIsSpeaking(false);
    setSelectedStory(story);
    setSceneIndex(0);
    setSelectedAnswer(null);
    setQuizFeedback(null);
    setPastorNotice(null);
  };

  const handlePlayNarration = async () => {
    if (isSpeaking) {
      audioEngine.stopNarration();
      setIsSpeaking(false);
      return;
    }

    setPastorNotice(null);
    setIsSpeaking(true);

    if (progress.settings.voiceMode === 'pastor') {
      const result = await audioEngine.playAuthorizedPastorAudio(
        selectedStory.pastorAudioSlot,
        () => setIsSpeaking(false)
      );
      if (!result.available) {
        setIsSpeaking(false);
        setPastorNotice(
          'Espacio listo para la grabación auténtica del Pastor Jair. Puedes escuchar ahora la voz de nuestros personajes infantiles o leer la historia juntos.'
        );
      }
      return;
    }

    audioEngine.speakKidsVoice(
      `${selectedStory.title}. ${currentScene.title}. ${narrationText}`,
      currentScene.characterFocus,
      progress.settings.soundEnabled,
      () => setIsSpeaking(false)
    );
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (index === question.correctIndex) {
      audioEngine.playSuccess(progress.settings.soundEnabled);
      setQuizFeedback(`¡Excelente! ${question.explanation}`);
      onCompleteStory(selectedStory.id, selectedStory.starsReward);
    } else {
      audioEngine.playGentleError(progress.settings.soundEnabled);
      setQuizFeedback('¡Buen intento! Vuelve a leer la escena e inténtalo otra vez.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-7">
            <p className="text-xs font-semibold text-sky-700 dark:text-sky-400">
              Módulo 02 · Historias Bíblicas 3D
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-stone-900 sm:text-3xl dark:text-stone-50">
              9 Aventuras de la Biblia para explorar en familia
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              Cada historia se adapta a tu edad ({progress.ageGroup} años), incluye narración interactiva,
              enseñanza práctica, pregunta final y medalla coleccionable.
            </p>

            {/* Dual Voice Mode Switcher */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Modalidad de voz:
              </span>
              <div className="inline-flex rounded-xl bg-stone-100 p-1 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    audioEngine.stopNarration();
                    setIsSpeaking(false);
                    setPastorNotice(null);
                    onChangeVoiceMode('kids');
                  }}
                  className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
                    progress.settings.voiceMode === 'kids'
                      ? 'bg-white text-stone-900 shadow-sm dark:bg-slate-700 dark:text-white'
                      : 'text-stone-600 dark:text-stone-300'
                  }`}
                >
                  Voces infantiles
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioEngine.stopNarration();
                    setIsSpeaking(false);
                    onChangeVoiceMode('pastor');
                  }}
                  className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
                    progress.settings.voiceMode === 'pastor'
                      ? 'bg-white text-stone-900 shadow-sm dark:bg-slate-700 dark:text-white'
                      : 'text-stone-600 dark:text-stone-300'
                  }`}
                >
                  Narración Pastor Jair
                </button>
              </div>
            </div>
          </div>

          <div className="relative min-h-[200px] lg:col-span-5">
            <img
              src={ASSET_IMAGES.bibleStories}
              alt="Diorama bíblico de Noé y el arca bajo el arcoíris"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Main Split: 9 Stories Index + Active Story Theater */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Stories Selector */}
        <aside className="space-y-2.5 lg:col-span-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display text-sm font-bold text-stone-700 dark:text-stone-200">
              Biblioteca de Historias ({progress.completedStories.length}/9)
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {BIBLE_STORIES.map((story) => {
              const active = story.id === selectedStory.id;
              const done = progress.completedStories.includes(story.id);
              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => openStory(story)}
                  className={`flex min-h-[56px] items-center justify-between gap-3 rounded-2xl border p-3.5 text-left transition ${
                    active
                      ? 'border-sky-500 bg-sky-50 dark:border-sky-500 dark:bg-sky-950/40'
                      : 'border-stone-200 bg-white hover:bg-stone-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold text-stone-900 dark:text-stone-100">
                      {story.title}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                      {story.reference} · {story.durationLabel}
                    </p>
                  </div>
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <BookOpen className="h-4 w-4 shrink-0 text-stone-400" />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Active Story Stage */}
        <div className="space-y-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                {selectedStory.reference} · Escena {sceneIndex + 1} de {selectedStory.scenes.length}
              </p>
              <h3 className="mt-1 font-display text-2xl font-extrabold text-stone-900 dark:text-stone-50">
                {selectedStory.title}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300">{selectedStory.subtitle}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
              <Award className="h-4 w-4" />
              <span>{isCompleted ? `Obtenida: ${selectedStory.rewardName}` : `Recompensa: +${selectedStory.starsReward} estrellas`}</span>
            </div>
          </div>

          <StorySceneDiorama theme={currentScene.visualTheme} />

          {/* Narration Card with Character */}
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <CharacterAvatar character={currentScene.characterFocus} size="md" />
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-display text-base font-bold text-stone-900 dark:text-stone-100">
                    {currentScene.title}
                  </h4>
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                    Guía: {CHARACTERS[currentScene.characterFocus].name}
                  </span>
                </div>
                <p className="text-base leading-relaxed text-stone-800 dark:text-stone-200">
                  {narrationText}
                </p>

                {pastorNotice && (
                  <div className="mt-2 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{pastorNotice}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handlePlayNarration}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700 whitespace-nowrap"
                  >
                    {isSpeaking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isSpeaking
                      ? 'Pausar narración'
                      : progress.settings.voiceMode === 'pastor'
                      ? 'Reproducir audio del Pastor Jair'
                      : 'Escuchar con voz infantil'}
                  </button>

                  {isSpeaking && (
                    <button
                      type="button"
                      onClick={() => {
                        audioEngine.stopNarration();
                        setIsSpeaking(false);
                        void handlePlayNarration();
                      }}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-200"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Repetir
                    </button>
                  )}

                  <div className="ml-auto flex items-center gap-2">
                    <button
                      type="button"
                      disabled={sceneIndex === 0}
                      onClick={() => {
                        audioEngine.stopNarration();
                        setIsSpeaking(false);
                        setSceneIndex((i) => Math.max(0, i - 1));
                      }}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-stone-300 bg-white text-stone-700 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-200"
                      aria-label="Escena anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      disabled={sceneIndex === selectedStory.scenes.length - 1}
                      onClick={() => {
                        audioEngine.stopNarration();
                        setIsSpeaking(false);
                        setSceneIndex((i) => Math.min(selectedStory.scenes.length - 1, i + 1));
                      }}
                      className="inline-flex min-h-[44px] items-center gap-1 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
                    >
                      Siguiente escena
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning & Quiz */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <Volume2 className="h-4 w-4" />
                Lo que aprendemos hoy
              </div>
              <p className="mt-2 text-sm leading-relaxed text-emerald-950 dark:text-emerald-100">
                {selectedStory.learning[progress.ageGroup]}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
                Pregunta para ganar tu medalla
              </p>
              <p className="mt-1.5 text-sm font-bold text-stone-900 dark:text-stone-100">
                {question.question}
              </p>
              <div className="mt-3 space-y-2">
                {question.options.map((opt, idx) => {
                  const chosen = selectedAnswer === idx;
                  const correct = idx === question.correctIndex;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleAnswer(idx)}
                      className={`w-full min-h-[44px] rounded-xl border px-3.5 py-2 text-left text-xs font-semibold transition ${
                        chosen && correct
                          ? 'border-emerald-500 bg-emerald-100 text-emerald-950 dark:bg-emerald-900/50 dark:text-emerald-100'
                          : chosen && !correct
                          ? 'border-rose-400 bg-rose-50 text-rose-900 dark:bg-rose-950/50 dark:text-rose-200'
                          : 'border-stone-200 bg-white text-stone-800 hover:border-amber-400 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-200'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {quizFeedback && (
                <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-200">
                  <Star className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>{quizFeedback}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
