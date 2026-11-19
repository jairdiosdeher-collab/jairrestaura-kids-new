export type AgeGroup = '3-5' | '6-8' | '9-12';

export type ModuleId =
  | 'kingdom'
  | 'stories'
  | 'music'
  | 'games'
  | 'creativity'
  | 'prayer'
  | 'characters'
  | 'missions'
  | 'family'
  | 'pastor';

export type CharacterId = 'lucas' | 'luna' | 'leon' | 'cordero' | 'estrellita';

export type CharacterExpression = 'alegre' | 'curioso' | 'asombrado' | 'tierno' | 'animando';

export type VoiceMode = 'kids' | 'pastor';

export type GameId =
  | 'memory'
  | 'puzzle'
  | 'quiz'
  | 'differences'
  | 'sequence'
  | 'animals'
  | 'pairs'
  | 'verses';

export interface CharacterData {
  id: CharacterId;
  name: string;
  role: string;
  tagline: string;
  description: string;
  favoriteVerse: string;
  primaryColor: string;
  accentColor: string;
  badgeLabel: string;
  favoritePlace: string;
  scenarioTheme: 'ark' | 'storm' | 'valley' | 'palace' | 'sea' | 'whale' | 'star' | 'meadow' | 'rainbow';
  funFacts: Record<AgeGroup, string>;
  friendshipAction: string;
  greetings: Record<AgeGroup, string>;
  reactions: Record<CharacterExpression, string>;
}

export interface StoryScene {
  id: string;
  title: string;
  narration: Record<AgeGroup, string>;
  visualTheme: 'ark' | 'storm' | 'valley' | 'palace' | 'sea' | 'whale' | 'star' | 'meadow' | 'rainbow';
  characterFocus: CharacterId;
}

export interface StoryQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BibleStory {
  id: string;
  title: string;
  reference: string;
  subtitle: string;
  durationLabel: string;
  rewardName: string;
  starsReward: number;
  scenes: StoryScene[];
  learning: Record<AgeGroup, string>;
  questions: Record<AgeGroup, StoryQuestion[]>;
  pastorAudioSlot: string;
}

export interface SongLyricLine {
  timeSec: number;
  text: string;
  section?: string;
}

export interface NoteEvent {
  freq: number;
  duration: number;
  harmonyFreq?: number;
}

export interface KidsSong {
  id: string;
  title: string;
  theme: string;
  bpm: number;
  durationSec: number;
  verse: string;
  characterLead: CharacterId;
  lyrics: SongLyricLine[];
  melody: NoteEvent[];
  pastorIntroSlot: string;
}

export interface PrayerEntry {
  id: string;
  date: string;
  gratitude: string;
  prayerFor: string;
  trustStatement: string;
}

export interface SavedArtwork {
  id: string;
  title: string;
  templateId: string;
  dataUrl: string;
  createdAt: string;
}

export interface ParentalSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  voiceMode: VoiceMode;
  ageLocked: boolean;
  screenTimeLimitMin: 0 | 20 | 30 | 45;
  darkMode: boolean;
}

export interface AppProgress {
  explorerName: string;
  ageGroup: AgeGroup;
  stars: number;
  completedStories: string[];
  completedGames: GameId[];
  completedSongs: string[];
  completedValues: string[];
  rewardedValues: string[];
  claimedMissions: string[];
  visitedModules: ModuleId[];
  prayers: PrayerEntry[];
  artworks: SavedArtwork[];
  settings: ParentalSettings;
}
