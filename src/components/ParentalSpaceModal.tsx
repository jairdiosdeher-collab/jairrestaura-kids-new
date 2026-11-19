import React, { useMemo, useState } from 'react';
import { Clock, Lock, Moon, ShieldCheck, Sun, Trash2, Volume2, X } from 'lucide-react';
import { AgeGroup, AppProgress, ParentalSettings, VoiceMode } from '../types/app';

interface ParentalSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: AppProgress;
  onUpdateSettings: (patch: Partial<ParentalSettings>) => void;
  onChangeAgeGroup: (age: AgeGroup) => void;
  onResetProgress: () => void;
}

const MATH_CHALLENGES = [
  { a: 7, b: 6, answer: 42 },
  { a: 6, b: 4, answer: 24 },
  { a: 8, b: 5, answer: 40 },
  { a: 9, b: 4, answer: 36 },
];

export const ParentalSpaceModal: React.FC<ParentalSpaceModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateSettings,
  onChangeAgeGroup,
  onResetProgress,
}) => {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const challenge = useMemo(
    () => MATH_CHALLENGES[challengeIdx % MATH_CHALLENGES.length],
    [challengeIdx]
  );
  const [unlocked, setUnlocked] = useState(false);
  const [answerInput, setAnswerInput] = useState('');
  const [gateError, setGateError] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(answerInput.trim()) === challenge.answer) {
      setUnlocked(true);
      setGateError(false);
    } else {
      setGateError(true);
    }
  };

  const handleClose = () => {
    setUnlocked(false);
    setAnswerInput('');
    setGateError(false);
    setConfirmReset(false);
    setChallengeIdx((i) => (i + 1) % MATH_CHALLENGES.length);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
            <div>
              <h2 className="font-display text-lg font-extrabold text-stone-900 dark:text-stone-50">
                Espacio Seguro para Padres y Tutores
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Acceso sin contraseñas: protegido por verificación matemática para adultos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-stone-500 hover:bg-stone-100 dark:hover:bg-slate-800"
            aria-label="Cerrar espacio para padres"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!unlocked ? (
          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
              <p className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
                <Lock className="h-4 w-4 text-amber-600" />
                Verificación para adultos (sin contraseña)
              </p>
              <p className="mt-1 text-xs text-stone-600 dark:text-stone-300">
                No necesitas cuenta ni clave secreta. Solo resuelve esta multiplicación sencilla:
              </p>
              <p className="mt-3 font-mono-nums text-2xl font-extrabold text-amber-700 dark:text-amber-400">
                ¿Cuánto es {challenge.a} × {challenge.b}?
              </p>
              <input
                type="number"
                inputMode="numeric"
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="Escribe el resultado"
                className="mt-3 w-full min-h-[46px] rounded-xl border border-stone-300 bg-white px-4 text-base font-bold dark:border-slate-700 dark:bg-slate-800"
              />
              {gateError && (
                <p className="mt-2 text-xs font-semibold text-rose-600">
                  Respuesta incorrecta. Inténtalo de nuevo.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full min-h-[48px] rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              Entrar al Panel de Padres
            </button>
          </form>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Audio & Theme Controls */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ soundEnabled: !progress.settings.soundEnabled })}
                className="flex min-h-[52px] items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-left text-xs font-bold dark:border-slate-800 dark:bg-slate-800"
              >
                <span className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-sky-600" />
                  Efectos y voces
                </span>
                <span>{progress.settings.soundEnabled ? 'Activados' : 'Silenciados'}</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ musicEnabled: !progress.settings.musicEnabled })}
                className="flex min-h-[52px] items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-left text-xs font-bold dark:border-slate-800 dark:bg-slate-800"
              >
                <span>Música de Planeta Musical</span>
                <span>{progress.settings.musicEnabled ? 'Activada' : 'Silenciada'}</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ darkMode: !progress.settings.darkMode })}
                className="flex min-h-[52px] items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-left text-xs font-bold dark:border-slate-800 dark:bg-slate-800"
              >
                <span className="flex items-center gap-2">
                  {progress.settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  Tema visual
                </span>
                <span>{progress.settings.darkMode ? 'Modo Oscuro' : 'Modo Claro'}</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ ageLocked: !progress.settings.ageLocked })}
                className="flex min-h-[52px] items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-left text-xs font-bold dark:border-slate-800 dark:bg-slate-800"
              >
                <span>Bloquear cambio de edad</span>
                <span>{progress.settings.ageLocked ? 'Bloqueado' : 'Libre'}</span>
              </button>
            </div>

            {/* Age & Voice Preference */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Rango de edad predeterminado
              </p>
              <div className="flex flex-wrap gap-2">
                {(['3-5', '6-8', '9-12'] as AgeGroup[]).map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => onChangeAgeGroup(age)}
                    className={`min-h-[40px] rounded-xl px-3.5 py-2 text-xs font-bold ${
                      progress.ageGroup === age
                        ? 'bg-amber-600 text-white'
                        : 'border border-stone-200 bg-stone-50 dark:border-slate-700 dark:bg-slate-800'
                    }`}
                  >
                    {age} años
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Modo de narración de historias
              </p>
              <div className="flex flex-wrap gap-2">
                {([
                  { id: 'kids', label: 'Voces infantiles de personajes' },
                  { id: 'pastor', label: 'Audios reales del Pastor Jair' },
                ] as { id: VoiceMode; label: string }[]).map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => onUpdateSettings({ voiceMode: v.id })}
                    className={`min-h-[40px] rounded-xl px-3.5 py-2 text-xs font-bold ${
                      progress.settings.voiceMode === v.id
                        ? 'bg-sky-600 text-white'
                        : 'border border-stone-200 bg-stone-50 dark:border-slate-700 dark:bg-slate-800'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gentle Screen Time Reminder */}
            <div className="space-y-2">
              <p className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
                Recordatorio amable de descanso visual
              </p>
              <div className="flex flex-wrap gap-2">
                {([0, 20, 30, 45] as const).map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => onUpdateSettings({ screenTimeLimitMin: mins })}
                    className={`min-h-[40px] rounded-xl px-3.5 py-2 text-xs font-bold ${
                      progress.settings.screenTimeLimitMin === mins
                        ? 'bg-emerald-600 text-white'
                        : 'border border-stone-200 bg-stone-50 dark:border-slate-700 dark:bg-slate-800'
                    }`}
                  >
                    {mins === 0 ? 'Desactivado' : `${mins} min`}
                  </button>
                ))}
              </div>
            </div>

            {/* Child Safety Statement */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs leading-relaxed text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100">
              <p className="font-bold">Compromiso de Protección Infantil Digital</p>
              <p className="mt-1">
                JAIRRESTAURA KIDS funciona sin cuentas de usuario, sin chats, sin redes sociales, sin
                publicidad, sin compras dentro de la aplicación, sin rastreo, sin geolocalización,
                sin acceso a cámara ni micrófono. Todo el progreso se guarda únicamente en este
                navegador mediante almacenamiento local.
              </p>
            </div>

            {/* Delete Local Progress */}
            <div className="border-t border-stone-200 pt-4 dark:border-slate-800">
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-800 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar progreso guardado en este dispositivo
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-rose-300 bg-rose-50 p-3 dark:border-rose-800 dark:bg-rose-950/40">
                  <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
                    ¿Seguro? Se borrarán estrellas, medallas, dibujos y oraciones locales.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onResetProgress();
                      setConfirmReset(false);
                    }}
                    className="min-h-[38px] rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white"
                  >
                    Sí, borrar todo
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="min-h-[38px] rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-stone-700 dark:bg-slate-800 dark:text-stone-200"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
