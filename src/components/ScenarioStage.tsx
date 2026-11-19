import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { CharacterExpression, CharacterId, StoryScene } from '../types/app';
import { CharacterAvatar } from './CharacterAvatar';
import { audioEngine } from '../services/audioEngine';

interface ScenarioStageProps {
  theme: StoryScene['visualTheme'];
  title?: string;
  character?: CharacterId;
  expression?: CharacterExpression;
  soundEnabled?: boolean;
  darkMode?: boolean;
  interactiveHint?: string;
  heightClass?: string;
}

const THEME_META: Record<
  StoryScene['visualTheme'],
  {
    name: string;
    skyClass: string;
    discovery: string;
  }
> = {
  ark: {
    name: 'El Arca de la Promesa',
    skyClass: 'from-sky-400 via-sky-200 to-emerald-200 dark:from-sky-950 dark:via-slate-800 dark:to-emerald-950',
    discovery: '¡Tocaste el arca! Dios cuidó con amor a Noé, su familia y cada animalito.',
  },
  storm: {
    name: 'Barca en la Tormenta Calma',
    skyClass: 'from-slate-700 via-sky-800 to-indigo-950',
    discovery: '¡Paz en el mar! Cuando llamamos a Jesús, Su paz calma cualquier tormenta.',
  },
  valley: {
    name: 'Colinas del Castillo de Luz',
    skyClass: 'from-amber-200 via-sky-200 to-lime-200 dark:from-slate-900 dark:via-indigo-950 dark:to-emerald-950',
    discovery: '¡Valle de aventura! El Señor camina contigo en cada paso que das.',
  },
  palace: {
    name: 'Palacio de la Valentía',
    skyClass: 'from-amber-300 via-orange-200 to-stone-200 dark:from-amber-950 dark:via-slate-900 dark:to-stone-950',
    discovery: '¡Corazón valiente! Como Daniel, podemos orar y confiar sin temor.',
  },
  sea: {
    name: 'Camino en el Mar Abierto',
    skyClass: 'from-cyan-400 via-sky-400 to-blue-700 dark:from-cyan-950 dark:via-sky-900 dark:to-blue-950',
    discovery: '¡Camino milagroso! Dios abre senderos donde parecía imposible pasar.',
  },
  whale: {
    name: 'Océano del Gran Pez',
    skyClass: 'from-blue-600 via-cyan-600 to-teal-800 dark:from-slate-950 dark:via-blue-950 dark:to-teal-950',
    discovery: '¡Gran rescate! Dios escucha nuestra oración incluso desde lo más profundo.',
  },
  star: {
    name: 'Cielo de la Estrella de Belén',
    skyClass: 'from-indigo-950 via-slate-900 to-amber-950',
    discovery: '¡Luz en la noche! Una estrella especial anunció el nacimiento de Jesús.',
  },
  meadow: {
    name: 'Pradera del Buen Pastor',
    skyClass: 'from-lime-200 via-emerald-200 to-sky-200 dark:from-emerald-950 dark:via-slate-900 dark:to-sky-950',
    discovery: '¡Pradera de paz! El Buen Pastor cuida de ti con ternura cada día.',
  },
  rainbow: {
    name: 'Arcoíris de las Promesas',
    skyClass: 'from-sky-300 via-amber-100 to-emerald-200 dark:from-sky-950 dark:via-slate-900 dark:to-emerald-950',
    discovery: '¡Arcoíris brillante! Cada color recuerda que Dios siempre cumple Sus promesas.',
  },
};

export const ScenarioStage: React.FC<ScenarioStageProps> = ({
  theme,
  title,
  character,
  expression = 'alegre',
  soundEnabled = true,
  interactiveHint,
  heightClass = 'h-60 sm:h-72',
}) => {
  const [discoveryMsg, setDiscoveryMsg] = useState<string | null>(null);
  const [sparkCount, setSparkCount] = useState(0);
  const meta = THEME_META[theme];

  const handleInteract = () => {
    setSparkCount((c) => c + 1);
    setDiscoveryMsg(meta.discovery);
    if (character) {
      audioEngine.playCharacterSound(character, soundEnabled);
    } else {
      audioEngine.playSparkleBurst(soundEnabled);
    }
  };

  return (
    <div
      onClick={handleInteract}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleInteract();
        }
      }}
      aria-label={`Escenario interactivo: ${title || meta.name}. Toca para descubrir un mensaje`}
      className={`group relative ${heightClass} w-full cursor-pointer overflow-hidden rounded-3xl border-2 border-white/60 bg-gradient-to-b ${meta.skyClass} shadow-md transition-transform duration-200 hover:shadow-lg dark:border-slate-700`}
    >
      <svg viewBox="0 0 640 280" className="h-full w-full" aria-hidden="true">
        {/* Soft Sunbeams / Atmospheric Glow */}
        <circle
          cx={theme === 'star' ? 320 : 530}
          cy={theme === 'star' ? 75 : 58}
          r={theme === 'star' ? 42 : 34}
          fill={theme === 'storm' ? '#CBD5E1' : '#FEF08A'}
          opacity={theme === 'storm' ? '0.35' : '0.88'}
        />

        {/* Animated Soft Clouds on Sky Themes */}
        {theme !== 'star' && theme !== 'whale' && (
          <g fill="#FFFFFF" opacity={theme === 'storm' ? '0.28' : '0.78'}>
            <ellipse cx="120" cy="62" rx="46" ry="18" />
            <ellipse cx="148" cy="56" rx="28" ry="15" />
            <ellipse cx="420" cy="48" rx="42" ry="15" />
          </g>
        )}

        {/* Rainbow Arc */}
        {theme === 'rainbow' && (
          <g fill="none" strokeWidth="11" opacity="0.88">
            <path d="M90 230 A 230 185 0 0 1 550 230" stroke="#EF4444" />
            <path d="M104 230 A 216 171 0 0 1 536 230" stroke="#F59E0B" />
            <path d="M118 230 A 202 157 0 0 1 522 230" stroke="#10B981" />
            <path d="M132 230 A 188 143 0 0 1 508 230" stroke="#0284C7" />
            <path d="M146 230 A 174 129 0 0 1 494 230" stroke="#8B5CF6" />
          </g>
        )}

        {/* Stars for Night & Palace */}
        {(theme === 'star' || theme === 'palace') && (
          <g>
            <circle cx="95" cy="52" r="3" fill="#FEF08A" />
            <circle cx="195" cy="36" r="2.5" fill="#FEF08A" />
            <circle cx="470" cy="54" r="3.5" fill="#FEF08A" />
            <circle cx="560" cy="84" r="2.5" fill="#FEF08A" />
            <polygon
              points="320,22 332,54 366,56 339,76 348,108 320,90 292,108 301,76 274,56 308,54"
              fill="#FACC15"
            />
          </g>
        )}

        {/* Noah's Ark */}
        {theme === 'ark' && (
          <g>
            <path d="M0 202 Q160 182 320 202 T640 202 L640 280 L0 280 Z" fill="#0284C7" opacity="0.78" />
            <path d="M170 164 L470 164 L436 218 L204 218 Z" fill="#92400E" />
            <rect x="232" y="114" width="176" height="52" rx="8" fill="#B45309" />
            <polygon points="220,116 320,76 420,116" fill="#78350F" />
            <rect x="256" y="128" width="26" height="24" rx="4" fill="#FEF3C7" />
            <rect x="307" y="128" width="26" height="24" rx="4" fill="#FEF3C7" />
            <rect x="358" y="128" width="26" height="24" rx="4" fill="#FEF3C7" />
          </g>
        )}

        {/* Storm & Boat */}
        {theme === 'storm' && (
          <g>
            <ellipse cx="190" cy="66" rx="92" ry="32" fill="#334155" />
            <ellipse cx="410" cy="58" rx="102" ry="34" fill="#1E293B" />
            <path d="M0 198 Q80 166 160 198 T320 198 T480 198 T640 198 L640 280 L0 280 Z" fill="#0369A1" />
            <path d="M245 178 L395 178 L368 214 L272 214 Z" fill="#B45309" />
            <rect x="316" y="110" width="8" height="68" fill="#78350F" />
            <polygon points="324,116 382,158 324,164" fill="#FEF3C7" />
          </g>
        )}

        {/* Red Sea Parting */}
        {theme === 'sea' && (
          <g>
            <path d="M0 148 C135 126 195 190 226 280 L0 280 Z" fill="#0EA5E9" opacity="0.88" />
            <path d="M640 148 C505 126 445 190 414 280 L640 280 Z" fill="#0EA5E9" opacity="0.88" />
            <path d="M226 280 L272 168 L368 168 L414 280 Z" fill="#FDE68A" />
          </g>
        )}

        {/* Whale & Ocean */}
        {theme === 'whale' && (
          <g>
            <path d="M0 202 Q160 180 320 202 T640 202 L640 280 L0 280 Z" fill="#075985" />
            <ellipse cx="320" cy="186" rx="122" ry="54" fill="#1E40AF" />
            <path d="M428 186 L498 148 L482 186 L498 220 Z" fill="#1E40AF" />
            <circle cx="248" cy="172" r="7" fill="#FFFFFF" />
            <circle cx="249" cy="172" r="3.5" fill="#0F172A" />
            <path d="M268 134 Q260 105 245 100" stroke="#7DD3FC" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M276 134 Q286 105 300 100" stroke="#7DD3FC" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* Valley / Meadow / Rainbow Hills */}
        {(theme === 'valley' || theme === 'meadow' || theme === 'rainbow') && (
          <g>
            <path d="M0 218 Q180 156 360 202 T640 182 L640 280 L0 280 Z" fill="#4D7C0F" />
            <path d="M0 236 Q230 188 440 228 T640 218 L640 280 L0 280 Z" fill="#65A30D" />
            {/* Castle silhouette in Valley */}
            {theme === 'valley' && (
              <g opacity="0.9">
                <rect x="268" y="130" width="104" height="66" rx="4" fill="#F8FAFC" />
                <polygon points="320,88 346,130 294,130" fill="#0284C7" />
                <rect x="242" y="144" width="30" height="52" fill="#E2E8F0" />
                <polygon points="257,114 275,144 239,144" fill="#0EA5E9" />
                <rect x="368" y="144" width="30" height="52" fill="#E2E8F0" />
                <polygon points="383,114 401,144 365,144" fill="#0EA5E9" />
              </g>
            )}
            {/* Flowers */}
            <circle cx="130" cy="228" r="7" fill="#FB7185" />
            <circle cx="245" cy="240" r="6" fill="#FACC15" />
            <circle cx="430" cy="232" r="7" fill="#38BDF8" />
            <circle cx="520" cy="242" r="6" fill="#C084FC" />
          </g>
        )}

        {/* Palace of Courage */}
        {theme === 'palace' && (
          <g>
            <path d="M0 220 L640 220 L640 280 L0 280 Z" fill="#D97706" opacity="0.32" />
            <rect x="210" y="128" width="220" height="94" rx="4" fill="#F5F0E6" />
            <rect x="176" y="102" width="48" height="120" fill="#E7E5E4" />
            <rect x="416" y="102" width="48" height="120" fill="#E7E5E4" />
            <polygon points="170,102 200,66 230,102" fill="#0284C7" />
            <polygon points="410,102 440,66 470,102" fill="#0284C7" />
            <path d="M292 222 V176 C292 158 348 158 348 176 V222 Z" fill="#B45309" />
          </g>
        )}
      </svg>

      {/* Character Standing Inside Scenario */}
      {character && (
        <div
          key={`${character}-${expression}-${sparkCount}`}
          className="pointer-events-none absolute bottom-3 right-4 sm:right-6 transition-transform duration-300 group-hover:scale-105"
        >
          <CharacterAvatar character={character} expression={expression} size="lg" />
        </div>
      )}

      {/* Top Left Scenario Caption */}
      <div className="pointer-events-none absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-2xl bg-stone-950/80 px-3.5 py-1.5 text-xs font-bold text-white shadow">
          <Sparkles className="h-3.5 w-3.5 text-amber-300 shrink-0" />
          <span className="truncate max-w-[260px] sm:max-w-md">{title || meta.name}</span>
        </div>
      </div>

      {/* Bottom Discovery Banner */}
      <div className="pointer-events-none absolute bottom-3 left-3.5 max-w-[70%] sm:max-w-md">
        <div className="rounded-2xl bg-stone-950/80 px-3.5 py-2 text-xs font-semibold text-white shadow">
          {discoveryMsg || interactiveHint || 'Toca el escenario para descubrir una enseñanza'}
        </div>
      </div>
    </div>
  );
};
