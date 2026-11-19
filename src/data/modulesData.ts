import { GameId, ModuleId } from '../types/app';

export const ASSET_IMAGES = {
  heroKingdom: '/src/assets/images/hero_kingdom_castle_1795097049015.jpg',
  bibleStories: '/src/assets/images/bible_stories_diorama_1795097047730.jpg',
  musicPlanet: '/src/assets/images/music_planet_stage_1795097047846.jpg',
  creativityWorkshop: '/src/assets/images/creativity_workshop_1795097048709.jpg',
  pastorJairStudio: '/src/assets/images/pastor_jair_studio_1795097048311.jpg',
};

export interface ModuleDefinition {
  id: ModuleId;
  number: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  accent: string;
  bgTint: string;
}

export const MODULES: ModuleDefinition[] = [
  {
    id: 'kingdom',
    number: '01',
    title: 'Reino de las Aventuras',
    shortTitle: 'Reino 3D',
    subtitle: 'Explora el castillo, cascadas, arcoíris y jardines en 3D',
    accent: 'text-amber-700 dark:text-amber-300',
    bgTint: 'bg-amber-50 dark:bg-amber-950/40',
  },
  {
    id: 'stories',
    number: '02',
    title: 'Historias Bíblicas 3D',
    shortTitle: 'Historias',
    subtitle: '9 aventuras bíblicas narradas con preguntas y medallas',
    accent: 'text-sky-700 dark:text-sky-300',
    bgTint: 'bg-sky-50 dark:bg-sky-950/40',
  },
  {
    id: 'music',
    number: '03',
    title: 'Planeta Musical',
    shortTitle: 'Música',
    subtitle: 'Canciones cristianas originales y xilófono interactivo',
    accent: 'text-emerald-700 dark:text-emerald-300',
    bgTint: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  {
    id: 'games',
    number: '04',
    title: 'Laboratorio de Juegos',
    shortTitle: 'Juegos',
    subtitle: '8 juegos reales: memoria, rompecabezas, versículos y más',
    accent: 'text-orange-700 dark:text-orange-300',
    bgTint: 'bg-orange-50 dark:bg-orange-950/40',
  },
  {
    id: 'creativity',
    number: '05',
    title: 'Fábrica de Creatividad',
    shortTitle: 'Creatividad',
    subtitle: 'Estudio para colorear escenas bíblicas y crear tarjetas',
    accent: 'text-rose-700 dark:text-rose-300',
    bgTint: 'bg-rose-50 dark:bg-rose-950/40',
  },
  {
    id: 'prayer',
    number: '06',
    title: 'Mi Rincón con Dios',
    shortTitle: 'Con Dios',
    subtitle: 'Oración guiada, respiración en paz y diario de gratitud',
    accent: 'text-indigo-700 dark:text-indigo-300',
    bgTint: 'bg-indigo-50 dark:bg-indigo-950/40',
  },
  {
    id: 'characters',
    number: '07',
    title: 'Mis Amigos del Reino',
    shortTitle: 'Amigos',
    subtitle: 'Conoce a Lucas, Luna, León, Cordero y Estrellita',
    accent: 'text-teal-700 dark:text-teal-300',
    bgTint: 'bg-teal-50 dark:bg-teal-950/40',
  },
  {
    id: 'missions',
    number: '08',
    title: 'Misiones y Recompensas',
    shortTitle: 'Misiones',
    subtitle: 'Retos del explorador, medallero y estrellas ganadas',
    accent: 'text-yellow-700 dark:text-yellow-300',
    bgTint: 'bg-yellow-50 dark:bg-yellow-950/40',
  },
  {
    id: 'family',
    number: '09',
    title: 'Familia y Valores',
    shortTitle: 'Familia',
    subtitle: 'Valores cristianos y momentos de charla en familia',
    accent: 'text-lime-700 dark:text-lime-300',
    bgTint: 'bg-lime-50 dark:bg-lime-950/40',
  },
  {
    id: 'pastor',
    number: '10',
    title: 'El Pastor Jair Cuenta',
    shortTitle: 'Pastor Jair',
    subtitle: 'Espacio ministerial JAIRRESTAURA – Pastor Jair Hernández',
    accent: 'text-amber-800 dark:text-amber-200',
    bgTint: 'bg-stone-100 dark:bg-slate-900',
  },
];

export interface FamilyValueItem {
  id: string;
  title: string;
  verse: string;
  summary: string;
  familyActivity: string;
  discussionQuestion: string;
}

export const FAMILY_VALUES: FamilyValueItem[] = [
  {
    id: 'amor',
    title: 'Amor incondicional',
    verse: 'Ámense unos a otros con amor fraternal. — Romanos 12:10',
    summary: 'El amor de Jesús se demuestra en palabras amables, abrazos sinceros y ayuda diaria en casa.',
    familyActivity: 'Hoy cada miembro de la familia dirá algo bonito que admira de los demás.',
    discussionQuestion: '¿De qué forma demostró Jesús Su amor hoy a través de nuestra familia?',
  },
  {
    id: 'obediencia',
    title: 'Obediencia con alegría',
    verse: 'Hijos, obedezcan en el Señor a sus padres, porque esto es justo. — Efesios 6:1',
    summary: 'Como Noé al construir el arca, obedecer protege nuestro hogar y llena de paz el corazón.',
    familyActivity: 'Cumplir una tarea de casa juntos cantando una canción de Planeta Musical.',
    discussionQuestion: '¿Por qué obedecer a tiempo nos ayuda a cuidarnos unos a otros?',
  },
  {
    id: 'valentia',
    title: 'Valentía y confianza',
    verse: 'En el día que temo, yo en ti confío. — Salmo 56:3',
    summary: 'Como David frente a Goliat, la valentía no es no sentir miedo, sino confiar en que Jesús está cerca.',
    familyActivity: 'Orar juntos antes de dormir entregando cualquier preocupación a Jesús.',
    discussionQuestion: '¿Cuándo sentiste miedo esta semana y cómo te ayudó recordar que Jesús te cuida?',
  },
  {
    id: 'gratitud',
    title: 'Corazón agradecido',
    verse: 'Den gracias en todo, porque esta es la voluntad de Dios. — 1 Tesalonicenses 5:18',
    summary: 'Agradecer por los alimentos, la salud y las pequeñas sorpresas llena la casa de alegría.',
    familyActivity: 'Escribir tres motivos de gratitud en Mi Rincón con Dios antes de cenar.',
    discussionQuestion: '¿Qué regalo sencillo de Dios disfrutaste más el día de hoy?',
  },
  {
    id: 'perdon',
    title: 'Perdón que sana',
    verse: 'Sean bondadosos y compasivos unos con otros, perdonándose. — Efesios 4:32',
    summary: 'Como José abrazó a sus hermanos, perdonar nos libera del enojo y restaura la amistad.',
    familyActivity: 'Dibujar una tarjeta de amistad o reconciliación en la Fábrica de Creatividad.',
    discussionQuestion: '¿Cómo se siente nuestro corazón cuando perdonamos en lugar de guardar enojo?',
  },
  {
    id: 'generosidad',
    title: 'Manos generosas',
    verse: 'Dios ama al que da con alegría. — 2 Corintios 9:7',
    summary: 'Compartir juguetes, tiempo y sonrisas multiplica la bendición en todo nuestro vecindario.',
    familyActivity: 'Elegir juntos un juguete o libro en buen estado para regalar a otro niño.',
    discussionQuestion: '¿A quién podemos alegrarle la semana compartiendo algo nuestro?',
  },
];

export interface MissionDef {
  id: string;
  title: string;
  description: string;
  bonusStars: number;
  targetModule: ModuleId;
  check: (state: {
    completedStories: string[];
    completedGames: GameId[];
    completedSongs: string[];
    completedValues: string[];
    prayersCount: number;
    artworksCount: number;
    visitedModules: ModuleId[];
  }) => { current: number; total: number };
}

export const EXPLORER_MISSIONS: MissionDef[] = [
  {
    id: 'mision-primera-historia',
    title: 'Cronista del Reino',
    description: 'Completa tu primera Historia Bíblica 3D respondiendo su pregunta final.',
    bonusStars: 10,
    targetModule: 'stories',
    check: (s) => ({ current: Math.min(1, s.completedStories.length), total: 1 }),
  },
  {
    id: 'mision-tres-historias',
    title: 'Explorador de la Biblia',
    description: 'Completa 3 historias bíblicas diferentes.',
    bonusStars: 20,
    targetModule: 'stories',
    check: (s) => ({ current: Math.min(3, s.completedStories.length), total: 3 }),
  },
  {
    id: 'mision-cantor',
    title: 'Cantor del Planeta Musical',
    description: 'Escucha y canta al menos 2 canciones originales completas.',
    bonusStars: 12,
    targetModule: 'music',
    check: (s) => ({ current: Math.min(2, s.completedSongs.length), total: 2 }),
  },
  {
    id: 'mision-jugador',
    title: 'Maestro del Laboratorio',
    description: 'Completa 3 juegos distintos en el Laboratorio de Juegos.',
    bonusStars: 18,
    targetModule: 'games',
    check: (s) => ({ current: Math.min(3, s.completedGames.length), total: 3 }),
  },
  {
    id: 'mision-oracion',
    title: 'Corazón en Oración',
    description: 'Guarda 2 oraciones o agradecimientos en Mi Rincón con Dios.',
    bonusStars: 10,
    targetModule: 'prayer',
    check: (s) => ({ current: Math.min(2, s.prayersCount), total: 2 }),
  },
  {
    id: 'mision-artista',
    title: 'Artista de la Creación',
    description: 'Guarda 1 dibujo o tarjeta en la Fábrica de Creatividad.',
    bonusStars: 10,
    targetModule: 'creativity',
    check: (s) => ({ current: Math.min(1, s.artworksCount), total: 1 }),
  },
  {
    id: 'mision-familia',
    title: 'Embajador de Valores',
    description: 'Practica 2 valores en familia en el módulo Familia y Valores.',
    bonusStars: 12,
    targetModule: 'family',
    check: (s) => ({ current: Math.min(2, s.completedValues.length), total: 2 }),
  },
  {
    id: 'mision-pastor',
    title: 'Oyente del Pastor Jair',
    description: 'Visita la sección El Pastor Jair Cuenta.',
    bonusStars: 8,
    targetModule: 'pastor',
    check: (s) => ({ current: s.visitedModules.includes('pastor') ? 1 : 0, total: 1 }),
  },
];

export const VERSE_TREASURES = [
  {
    id: 'juan-3-16',
    reference: 'Juan 3:16',
    parts: ['Porque', 'tanto', 'amó', 'Dios', 'al', 'mundo'],
    meaning: 'Dios nos ama inmensamente y nos regaló a Jesús.',
  },
  {
    id: 'salmo-23-1',
    reference: 'Salmo 23:1',
    parts: ['El', 'Señor', 'es', 'mi', 'pastor', 'nada', 'me', 'faltará'],
    meaning: 'Jesús cuida de cada una de nuestras necesidades.',
  },
  {
    id: 'filipenses-4-13',
    reference: 'Filipenses 4:13',
    parts: ['Todo', 'lo', 'puedo', 'en', 'Cristo', 'que', 'me', 'fortalece'],
    meaning: 'Con Jesús tenemos fuerza para aprender y vencer temores.',
  },
  {
    id: 'mateo-19-14',
    reference: 'Mateo 19:14',
    parts: ['Dejen', 'que', 'los', 'niños', 'vengan', 'a', 'mí'],
    meaning: 'Jesús siempre abre Sus brazos para recibirte con alegría.',
  },
];
