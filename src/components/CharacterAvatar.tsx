import React from 'react';
import { CharacterExpression, CharacterId } from '../types/app';

interface CharacterAvatarProps {
  character: CharacterId;
  expression?: CharacterExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-28 h-28',
  xl: 'w-36 h-36',
};

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  character,
  expression = 'alegre',
  size = 'md',
  animated = true,
  className = '',
}) => {
  const isHappy = expression === 'alegre' || expression === 'animando';
  const isAmazed = expression === 'asombrado';
  const isCurious = expression === 'curioso';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${SIZE_CLASSES[size]} ${
        animated ? 'animate-float' : ''
      } ${className}`}
    >
      {character === 'lucas' && (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md" aria-label="Lucas">
          <circle cx="60" cy="60" r="54" fill="#FEF3C7" stroke="#D97706" strokeWidth="4" />
          {/* Explorer Hat */}
          <ellipse cx="60" cy="34" rx="34" ry="8" fill="#B45309" />
          <path d="M36 34 C38 16 82 16 84 34 Z" fill="#D97706" />
          <rect x="38" y="29" width="44" height="5" rx="2" fill="#059669" />
          {/* Face */}
          <circle cx="60" cy="60" r="24" fill="#FDBA74" />
          {/* Curly Hair */}
          <path d="M36 52 C38 36 82 36 84 52 C74 42 46 42 36 52 Z" fill="#451A03" />
          {/* Eyes */}
          <circle cx="51" cy="58" r={isAmazed ? 4.2 : 3.4} fill="#1E293B" />
          <circle cx="69" cy="58" r={isAmazed ? 4.2 : 3.4} fill="#1E293B" />
          <circle cx="52.2" cy="56.8" r="1.2" fill="#FFFFFF" />
          <circle cx="70.2" cy="56.8" r="1.2" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d={isCurious ? 'M45 50 Q51 47 56 51' : 'M46 51 Q51 49 56 51'} stroke="#451A03" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d={isCurious ? 'M64 52 Q69 49 75 50' : 'M64 51 Q69 49 74 51'} stroke="#451A03" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {/* Mouth */}
          {isAmazed ? (
            <ellipse cx="60" cy="70" rx="5" ry="6" fill="#9A3412" />
          ) : (
            <path d={isHappy ? 'M50 67 Q60 77 70 67' : 'M53 69 Q60 73 67 69'} stroke="#9A3412" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
          {/* Explorer Collar & Compass */}
          <path d="M38 96 C42 82 78 82 82 96 Z" fill="#059669" />
          <circle cx="60" cy="92" r="7" fill="#FBBF24" stroke="#78350F" strokeWidth="2" />
          <path d="M60 87 L62 92 L60 97 L58 92 Z" fill="#DC2626" />
        </svg>
      )}

      {character === 'luna' && (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md" aria-label="Luna">
          <circle cx="60" cy="60" r="54" fill="#E0F2FE" stroke="#0284C7" strokeWidth="4" />
          {/* Hair Back */}
          <circle cx="36" cy="56" r="12" fill="#312E81" />
          <circle cx="84" cy="56" r="12" fill="#312E81" />
          <path d="M34 48 C36 22 84 22 86 48 Z" fill="#312E81" />
          {/* Star Hairpin */}
          <polygon points="82,34 85,40 91,41 86,45 87,51 82,48 77,51 78,45 73,41 79,40" fill="#FACC15" />
          {/* Face */}
          <circle cx="60" cy="60" r="23" fill="#FED7AA" />
          <path d="M38 49 C46 36 74 36 82 49 C70 43 50 43 38 49 Z" fill="#312E81" />
          {/* Rosy cheeks */}
          <circle cx="44" cy="64" r="3.5" fill="#FB7185" opacity="0.45" />
          <circle cx="76" cy="64" r="3.5" fill="#FB7185" opacity="0.45" />
          {/* Eyes */}
          <circle cx="51" cy="58" r={isAmazed ? 4.3 : 3.5} fill="#0F172A" />
          <circle cx="69" cy="58" r={isAmazed ? 4.3 : 3.5} fill="#0F172A" />
          <circle cx="52.3" cy="56.8" r="1.3" fill="#FFFFFF" />
          <circle cx="70.3" cy="56.8" r="1.3" fill="#FFFFFF" />
          {/* Mouth */}
          {isAmazed ? (
            <circle cx="60" cy="70" r="4.8" fill="#BE123C" />
          ) : (
            <path d={isHappy ? 'M51 67 Q60 76 69 67' : 'M53 69 Q60 73 67 69'} stroke="#BE123C" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
          {/* Explorer Scarf & Tunic */}
          <path d="M37 96 C42 82 78 82 83 96 Z" fill="#0284C7" />
          <path d="M44 82 Q60 92 76 82" stroke="#F43F5E" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
      )}

      {character === 'leon' && (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md" aria-label="León">
          <circle cx="60" cy="60" r="54" fill="#FFEDD5" stroke="#EA580C" strokeWidth="4" />
          {/* Fluffy Mane */}
          <circle cx="60" cy="60" r="35" fill="#C2410C" />
          <circle cx="38" cy="40" r="12" fill="#EA580C" />
          <circle cx="82" cy="40" r="12" fill="#EA580C" />
          <circle cx="32" cy="64" r="12" fill="#EA580C" />
          <circle cx="88" cy="64" r="12" fill="#EA580C" />
          <circle cx="60" cy="30" r="13" fill="#EA580C" />
          {/* Ears */}
          <circle cx="40" cy="37" r="7" fill="#FBBF24" />
          <circle cx="80" cy="37" r="7" fill="#FBBF24" />
          {/* Face */}
          <circle cx="60" cy="62" r="23" fill="#FCD34D" />
          {/* Eyes */}
          <circle cx="51" cy="57" r={isAmazed ? 4.2 : 3.4} fill="#1E293B" />
          <circle cx="69" cy="57" r={isAmazed ? 4.2 : 3.4} fill="#1E293B" />
          <circle cx="52" cy="55.8" r="1.2" fill="#FFFFFF" />
          <circle cx="70" cy="55.8" r="1.2" fill="#FFFFFF" />
          {/* Snout & Nose */}
          <ellipse cx="60" cy="69" rx="11" ry="8" fill="#FEF3C7" />
          <polygon points="55,64 65,64 60,70" fill="#7C2D12" />
          <path d={isHappy ? 'M53 72 Q60 78 67 72' : 'M55 73 Q60 76 65 73'} stroke="#7C2D12" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </svg>
      )}

      {character === 'cordero' && (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md" aria-label="Cordero">
          <circle cx="60" cy="60" r="54" fill="#D1FAE5" stroke="#059669" strokeWidth="4" />
          {/* Ears */}
          <ellipse cx="30" cy="54" rx="11" ry="6" transform="rotate(-20 30 54)" fill="#FDE68A" />
          <ellipse cx="90" cy="54" rx="11" ry="6" transform="rotate(20 90 54)" fill="#FDE68A" />
          {/* Fluffy Wool */}
          <circle cx="60" cy="36" r="14" fill="#FFFFFF" />
          <circle cx="43" cy="44" r="13" fill="#FFFFFF" />
          <circle cx="77" cy="44" r="13" fill="#FFFFFF" />
          <circle cx="40" cy="72" r="13" fill="#FFFFFF" />
          <circle cx="80" cy="72" r="13" fill="#FFFFFF" />
          <circle cx="60" cy="84" r="14" fill="#FFFFFF" />
          {/* Face */}
          <ellipse cx="60" cy="62" rx="21" ry="19" fill="#FFFBEB" />
          <circle cx="52" cy="58" r={isAmazed ? 4 : 3.2} fill="#1E293B" />
          <circle cx="68" cy="58" r={isAmazed ? 4 : 3.2} fill="#1E293B" />
          <circle cx="53" cy="56.8" r="1.1" fill="#FFFFFF" />
          <circle cx="69" cy="56.8" r="1.1" fill="#FFFFFF" />
          <circle cx="45" cy="64" r="3.4" fill="#FDA4AF" opacity="0.6" />
          <circle cx="75" cy="64" r="3.4" fill="#FDA4AF" opacity="0.6" />
          {/* Nose & Smile */}
          <path d="M57 65 L60 68 L63 65" stroke="#FB7185" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d={isHappy ? 'M53 71 Q60 76 67 71' : 'M55 72 Q60 74 65 72'} stroke="#64748B" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          {/* Ribbon */}
          <path d="M48 86 L60 92 L72 86 L60 96 Z" fill="#0284C7" />
        </svg>
      )}

      {character === 'estrellita' && (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md" aria-label="Estrellita">
          <circle cx="60" cy="60" r="54" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="4" />
          {/* Outer Glow */}
          <circle cx="60" cy="60" r="40" fill="#FDE047" opacity="0.35" />
          {/* Star Body */}
          <polygon
            points="60,18 71,44 99,46 77,64 84,92 60,77 36,92 43,64 21,46 49,44"
            fill="#FACC15"
            stroke="#CA8A04"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Eyes */}
          <circle cx="52" cy="57" r={isAmazed ? 4 : 3.2} fill="#1E293B" />
          <circle cx="68" cy="57" r={isAmazed ? 4 : 3.2} fill="#1E293B" />
          <circle cx="53" cy="55.8" r="1.2" fill="#FFFFFF" />
          <circle cx="69" cy="55.8" r="1.2" fill="#FFFFFF" />
          <circle cx="46" cy="63" r="3" fill="#FB7185" opacity="0.45" />
          <circle cx="74" cy="63" r="3" fill="#FB7185" opacity="0.45" />
          <path d={isHappy ? 'M53 66 Q60 72 67 66' : 'M55 67 Q60 70 65 67'} stroke="#854D0E" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
};
