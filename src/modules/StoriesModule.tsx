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
import { AppProgress, BibleStory, VoiceMode } from '../types/app';
import { BIBLE_STORIES } from '../data/stories';
import { ASSET_IMAGES } from '../data/modulesData';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { ScenarioStage } from '../components/ScenarioStage';
import { CHARACTERS } from '../data/characters';
import { audioEngine } from '../services/audioEngine';

interface StoriesModuleProps {
  progress: AppProgress;
  onCompleteStory: (storyId: string, starsEarned: number) => void;
  onChangeVoiceMode: (mode: VoiceMode) => void;
}

export const StoriesModule: React.FC<StoriesModuleProps> = ({
  progress,
  onCompleteStory,
  onChangeVoiceMode,
}) => {
  const [selectedStory, setSelectedStory] = useState<BibleStory>(BIBLE_STORIES[0]);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [guidedPhraseIdx, setGuidedPhraseIdx] = useState<number | null>(null);
  const [narrationNotice, setNarrationNotice] = useState<string | null>(null);
  const [pastorNotice, setPastorNotice] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [speechInfo, setSpeechInfo] = useState(() => audioEngine.getSpeechSupport());

  useEffect(() => {
    const refreshVoices = () => setSpeechInfo(audioEngine.getSpeechSupport());
    refreshVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
    }
    return () => {
      audioEngine.stopNarration();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener('voiceschanged', refreshVoices);
      }
    };
  }, []);

  const currentScene = selectedStory.scenes[sceneIndex];
  const narrationText = currentScene.narration[progress.ageGroup];
  const narrationPhrases = React.useMemo(
    () =>
      narrationText
        .split(/(?<=[.!?])\s+/)
        .map((p) => p.trim())
        .filter(Boolean),
    [narrationText]
  );
  const question = selectedStory.questions[progress.ageGroup][0];
  const isCompleted = progress.completedStories.includes(selectedStory.id);

  useEffect(() => {
    if (!isSpeaking) {
      setGuidedPhraseIdx(null);
      return;
    }
    setGuidedPhraseIdx(0);
    const id = window.setInterval(() => {
      setGuidedPhraseIdx((prev) => {
        if (prev === null) return 0;
        if (prev + 1 >= narrationPhrases.length) {
          return prev;
        }
        return prev + 1;
      });
    }, 3200);
    return () => window.clearInterval(id);
  }, [isSpeaking, narrationPhrases.length]);

  const stopAllPlayback = () => {
    audioEngine.stopNarration();
    setIsSpeaking(false);
    setGuidedPhraseIdx(null);
  };

  const openStory = (story: BibleStory) => {
    stopAllPlayback();
    setSelectedStory(story);
    setSceneIndex(0);
    setSelectedAnswer(null);
    setQuizFeedback(null);
    setPastorNotice(null);
    setNarrationNotice(null);
  };

  const startGuidedFallback = (reason: 'muted' | 'no-api' | 'no-spanish-voice' | undefined) => {
    if (reason === 'muted') {
      setIsSpeaking(false);
      setNarrationNotice(
        'El sonido y las voces están silenciados en el Espacio para Padres. Activamos la lectura visual en pantalla.'
      );
      setGuidedPhraseIdx(0);
      return;
    }
    setNarrationNotice(
      'Este dispositivo no tiene una voz compatible en español instalada. Activamos Lectura Guiada Interactiva con campanas suaves para leer juntos.'
    );
    setGuidedPhraseIdx(0);
    const totalMs = Math.max(3500, narrationPhrases.length * 3200);
    narrationPhrases.forEach((_, idx) => {
      window.setTimeout(() => {
        audioEngine.playTone(523.25 + idx * 65, 0.22, 'triangle', 0.08);
      }, idx * 3200);
    });
    window.setTimeout(() => {
      setIsSpeaking(false);
      setGuidedPhraseIdx(null);
    }, totalMs);
  };

  const handlePlayNarration = async () => {
    if (isSpeaking) {
      stopAllPlayback();
      return;
    }

    setPastorNotice(null);
    setNarrationNotice(null);
    setIsSpeaking(true);

    if (progress.settings.voiceMode === 'pastor') {
      const result = await audioEngine.playAuthorizedPastorAudio(
        selectedStory.pastorAudioSlot,
        () => stopAllPlayback()
      );
      if (!result.available) {
        setIsSpeaking(false);
        setPastorNotice(
          'Espacio listo para la grabación auténtica del Pastor Jair. Aún no se ha subido este audio oficial; puedes cambiar a Voces infantiles o usar la Lectura Guiada.'
        );
      }
      return;
    }

    const res = audioEngine.speakKidsVoice(
      `${selectedStory.title}. ${currentScene.title}. ${narrationText}`,
      currentScene.characterFocus,
      progress.settings.soundEnabled,
      () => stopAllPlayback()
    );
    if (!res.startedSpeech) {
      startGuidedFallback(res.reason);
    }
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

          <ScenarioStage
            theme={currentScene.visualTheme}
            title={currentScene.title}
            character={currentScene.characterFocus}
            expression="alegre"
            soundEnabled={progress.settings.soundEnabled}
            darkMode={progress.settings.darkMode}
            interactiveHint="Toca o gira el diorama 3D para descubrir una enseñanza"
            heightClass="h-56 sm:h-64"
          />

          {/* Narration Card with Character */}
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <CharacterAvatar character={currentScene.characterFocus} size="md" />
              <div className="flex-1 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-display text-base font-bold text-stone-900 dark:text-stone-100">
                    {currentScene.title}
                  </h4>
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                    Guía: {CHARACTERS[currentScene.characterFocus].name} ·{' '}
                    {speechInfo.hasSpanishVoice ? 'Voz español lista' : 'Lectura guiada visual'}
                  </span>
                </div>
                <p className="text-base leading-relaxed text-stone-800 dark:text-stone-200">
                  {narrationPhrases.map((phrase, idx) => (
                    <span
                      key={`${sceneIndex}-${idx}`}
                      className={`mr-1.5 rounded px-0.5 transition-colors ${
                        guidedPhraseIdx === idx
                          ? 'bg-amber-200/80 font-bold text-stone-950 dark:bg-amber-900/60 dark:text-amber-100'
                          : ''
                      }`}
                    >
                      {phrase}
                    </span>
                  ))}
                </p>

                {narrationNotice && (
                  <div className="mt-2 flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs text-sky-900 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{narrationNotice}</span>
                  </div>
                )}

                {pastorNotice && (
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                    <div className="flex items-start gap-2 flex-1">
                      <Info className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{pastorNotice}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPastorNotice(null);
                        onChangeVoiceMode('kids');
                      }}
                      className="rounded-lg bg-amber-600 px-3 py-1.5 font-bold text-white hover:bg-amber-700 whitespace-nowrap"
                    >
                      Usar Voces infantiles
                    </button>
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
                      ? 'Detener narración'
                      : progress.settings.voiceMode === 'pastor'
                      ? 'Reproducir audio del Pastor Jair'
                      : speechInfo.hasSpanishVoice
                      ? 'Escuchar con voz infantil'
                      : 'Lectura guiada con audio'}
                  </button>

                  {isSpeaking && (
                    <button
                      type="button"
                      onClick={() => {
                        stopAllPlayback();
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
                        stopAllPlayback();
                        setNarrationNotice(null);
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
                        stopAllPlayback();
                        setNarrationNotice(null);
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
