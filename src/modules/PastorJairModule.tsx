import React, { useEffect, useState } from 'react';
import { BookHeart, Film, Heart, Mic, Play, ShieldCheck, UserCheck, Volume2 } from 'lucide-react';
import { AppProgress } from '../types/app';
import { ASSET_IMAGES } from '../data/modulesData';
import { BIBLE_STORIES } from '../data/stories';
import { audioEngine } from '../services/audioEngine';

interface PastorJairModuleProps {
  progress: AppProgress;
}

const PASTOR_MESSAGES = [
  {
    id: 'msg-amor',
    title: 'Jesús te conoce por tu nombre',
    verse: 'Isaías 43:1 · Mateo 19:14',
    text: 'Querido pequeño explorador: antes de que saliera el sol hoy, Dios ya pensó en ti con alegría. Nunca pienses que eres demasiado pequeño para hablar con Jesús; Él escucha cada oración sencilla y sonríe cuando compartes amor en tu hogar.',
  },
  {
    id: 'msg-paz',
    title: 'Cuando sientas temor, descansa en Su abrazo',
    verse: 'Salmo 4:8 · Marcos 4:39',
    text: 'Si alguna noche escuchas truenos o tienes un día difícil en la escuela, recuerda que el mismo Jesús que calmó la tormenta viaja contigo. Cierra tus ojos, respira tranquilo y dile: «Jesús, confío en Ti».',
  },
];

const KIDS_PRAYERS_BY_PASTOR = [
  {
    title: 'Oración de la Mañana',
    prayer:
      'Padre bueno, gracias por este nuevo día, por mi familia y por Tu amor. Ayúdame hoy a ser amable, obediente y valiente en el nombre de Jesús. Amén.',
  },
  {
    title: 'Oración Antes de Dormir',
    prayer:
      'Señor Jesús, gracias por cuidarme todo el día. Perdona si en algo fallé, abraza a mi familia esta noche y dame un descanso lleno de paz. Amén.',
  },
];

export const PastorJairModule: React.FC<PastorJairModuleProps> = ({ progress }) => {
  const [audioStatus, setAudioStatus] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string | null>(null);
  const [readAssistNote, setReadAssistNote] = useState<string | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [photoAvailable, setPhotoAvailable] = useState(false);

  useEffect(() => {
    let active = true;
    const checkPhoto = async () => {
      try {
        const res = await fetch('/media/pastor-jair/foto-autorizada.jpg', { method: 'HEAD' });
        const contentType = res.headers.get('content-type') || '';
        if (active && res.ok && contentType.startsWith('image/')) {
          setPhotoAvailable(true);
        }
      } catch {
        // Offline or file not uploaded yet
      }
    };
    void checkPhoto();
    return () => {
      active = false;
      audioEngine.stopNarration();
    };
  }, []);

  const readWrittenDevotional = (title: string, text: string) => {
    setReadAssistNote(null);
    const res = audioEngine.speakKidsVoice(
      `${title}. ${text}`,
      'leon',
      progress.settings.soundEnabled
    );
    if (!res.startedSpeech && res.reason !== 'muted') {
      setReadAssistNote(
        'Este dispositivo no tiene voz en español instalada. Pueden leer juntos en familia este mensaje escrito del Pastor Jair.'
      );
    } else if (res.reason === 'muted') {
      setReadAssistNote('El sonido está silenciado en el Espacio para Padres.');
    } else {
      setReadAssistNote(
        'Lectura de apoyo de Estrellita/León sobre el texto escrito (no simula ni reemplaza la voz real del Pastor Jair).'
      );
    }
  };

  const testAuthorizedAudio = async (slotPath: string, label: string) => {
    setAudioStatus(null);
    const res = await audioEngine.playAuthorizedPastorAudio(slotPath);
    if (!res.available) {
      setAudioStatus(
        `Espacio preparado para el audio auténtico «${label}» (${slotPath}). No simulamos la voz del Pastor Jair; cuando se cargue su archivo autorizado, sonará aquí directamente.`
      );
    }
  };

  const checkAuthorizedVideo = async (slotPath: string, title: string) => {
    setVideoStatus(null);
    try {
      const response = await fetch(slotPath, { method: 'HEAD' });
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.startsWith('video/')) {
        setActiveVideoUrl(slotPath);
        return;
      }
    } catch {
      // Offline or not yet uploaded
    }
    setActiveVideoUrl(null);
    setVideoStatus(
      `Espacio preparado para el video oficial «${title}» (${slotPath}). Aún no se ha cargado el archivo MP4 autorizado del Pastor Jair.`
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Showcase */}
      <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">
                Módulo 10 · JAIRRESTAURA – Pastor Jair Hernández
              </p>
              <h2 className="font-display text-2xl font-extrabold text-stone-900 sm:text-3xl dark:text-stone-50">
                El Pastor Jair Cuenta
              </h2>
              <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                Un espacio pastoral creado con respeto y verdad para compartir exclusivamente el
                material auténtico autorizado por el Pastor Jair Hernández: su presentación, videos
                evangelísticos, narraciones bíblicas reales, mensajes del amor de Jesús y oraciones
                infantiles.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-amber-300 bg-amber-50 flex items-center justify-center dark:border-amber-800 dark:bg-slate-800">
                {photoAvailable ? (
                  <img
                    src="/media/pastor-jair/foto-autorizada.jpg"
                    alt="Fotografía autorizada del Pastor Jair Hernández"
                    onError={() => setPhotoAvailable(false)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-2 text-center">
                    <UserCheck className="h-6 w-6 text-amber-700 dark:text-amber-400" />
                    <span className="mt-1 text-[10px] font-bold text-stone-600 dark:text-stone-300">
                      Foto oficial
                    </span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-display text-base font-bold text-stone-900 dark:text-stone-100">
                  Pastor Psicólogo Jair Hernández · JAIRRESTAURA
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Compromiso de autenticidad: la aplicación nunca genera ni imita grabaciones o
                  imágenes sintéticas del Pastor Jair. Espacio preparado para su fotografía oficial
                  en <code className="font-mono-nums text-[11px]">/media/pastor-jair/foto-autorizada.jpg</code>.
                </p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[240px] lg:col-span-5">
            <img
              src={ASSET_IMAGES.pastorJairStudio}
              alt="Estudio de narración bíblica infantil JAIRRESTAURA"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Messages & Children's Prayers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <BookHeart className="h-5 w-5 text-amber-600" />
            Mensajes del Amor de Jesús
          </h3>
          <div className="space-y-4">
            {PASTOR_MESSAGES.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-5 dark:border-slate-800 dark:bg-slate-950/60"
              >
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400">{m.verse}</p>
                <h4 className="mt-1 font-display text-base font-bold text-stone-900 dark:text-stone-100">
                  {m.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                  {m.text}
                </p>
                <button
                  type="button"
                  onClick={() => readWrittenDevotional(m.title, m.text)}
                  className="mt-3 inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3 py-1 text-xs font-bold text-amber-800 hover:bg-amber-50 dark:border-amber-800 dark:bg-slate-900 dark:text-amber-300"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  Lectura de apoyo en pantalla
                </button>
              </div>
            ))}
          </div>
          {readAssistNote && (
            <p className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs text-sky-900 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
              {readAssistNote}
            </p>
          )}
        </div>

        <div className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            Oraciones Infantiles
          </h3>
          <div className="space-y-4">
            {KIDS_PRAYERS_BY_PASTOR.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900 dark:bg-amber-950/30"
              >
                <h4 className="font-display text-sm font-bold text-stone-900 dark:text-stone-100">
                  {item.title}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-700 dark:text-stone-200">
                  “{item.prayer}”
                </p>
                <button
                  type="button"
                  onClick={() => readWrittenDevotional(item.title, item.prayer)}
                  className="mt-2.5 inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-[11px] font-bold text-amber-800 hover:bg-amber-50 dark:border-amber-800 dark:bg-slate-900 dark:text-amber-300"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  Escuchar oración
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Authorized Narrations & Evangelistic Videos Integration Slots */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Mic className="h-5 w-5 text-sky-600" />
              Narraciones Bíblicas del Pastor Jair
            </h3>
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Cada historia cuenta con su canal listo para reproducir los archivos reales grabados por
            el Pastor Jair en <code className="font-mono-nums">/media/pastor-jair/historias/</code>.
          </p>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {BIBLE_STORIES.map((story) => (
              <div
                key={story.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3 dark:border-slate-800 dark:bg-slate-950/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-stone-900 dark:text-stone-100">
                    {story.title}
                  </p>
                  <p className="truncate font-mono-nums text-[11px] text-stone-500">
                    {story.pastorAudioSlot}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => testAuthorizedAudio(story.pastorAudioSlot, story.title)}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-700 shrink-0"
                >
                  <Play className="h-3.5 w-3.5" />
                  Escuchar
                </button>
              </div>
            ))}
          </div>

          {audioStatus && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              {audioStatus}
            </p>
          )}
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Film className="h-5 w-5 text-amber-600" />
            Videos Evangelísticos Autorizados
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Área reservada exclusivamente para videos oficiales del ministerio JAIRRESTAURA. Sin
            enlaces externos no verificados ni sugerencias automáticas de plataformas de terceros.
          </p>

          <div className="space-y-3">
            {[
              {
                title: 'Bienvenida al Reino de Jesús',
                slot: '/media/pastor-jair/videos/bienvenida.mp4',
                desc: 'Presentación del Pastor Jair Hernández para niños y familias.',
              },
              {
                title: 'Jesús es el Mejor Amigo',
                slot: '/media/pastor-jair/videos/jesus-mejor-amigo.mp4',
                desc: 'Mensaje evangelístico infantil con lenguaje cercano y lleno de esperanza.',
              },
            ].map((vid) => (
              <div
                key={vid.title}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-950/60"
              >
                <div className="min-w-0">
                  <p className="font-display text-sm font-bold text-stone-900 dark:text-stone-100">
                    {vid.title}
                  </p>
                  <p className="mt-1 text-xs text-stone-600 dark:text-stone-300">{vid.desc}</p>
                  <p className="mt-1 font-mono-nums text-[11px] text-stone-500 truncate">
                    {vid.slot}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => checkAuthorizedVideo(vid.slot, vid.title)}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 shrink-0"
                >
                  <Play className="h-3.5 w-3.5" />
                  Abrir video
                </button>
              </div>
            ))}
          </div>

          {activeVideoUrl && (
            <video
              src={activeVideoUrl}
              controls
              className="w-full rounded-2xl border border-stone-200 dark:border-slate-700"
            />
          )}

          {videoStatus && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              {videoStatus}
            </p>
          )}
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            Nota: No se reproducen videos simulados; los archivos oficiales se integran directamente en{' '}
            <code className="font-mono-nums">public/media/pastor-jair/</code>.
            {progress.settings.soundEnabled ? '' : ' (Sonido desactivado en control parental)'}
          </p>
        </section>
      </div>
    </div>
  );
};
