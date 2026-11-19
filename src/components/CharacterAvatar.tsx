import React, { useId } from 'react';
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
  const uid = useId().replace(/:/g, '');
  const isHappy = expression === 'alegre';
  const isCheering = expression === 'animando';
  const isAmazed = expression === 'asombrado';
  const isCurious = expression === 'curioso';
  const isTender = expression === 'tierno';

  const eyeRadius = isAmazed ? 4.3 : isCheering ? 3.8 : 3.4;
  const eyeOffsetX = isCurious ? 1.3 : 0;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${SIZE_CLASSES[size]} ${
        animated ? 'animate-float' : ''
      } ${className}`}
    >
      {character === 'lucas' && (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md" aria-label="Lucas">
          <defs>
            <radialGradient id={`${uid}-bg`} cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="100%" stopColor="#FDE68A" />
            </radialGradient>
            <linearGradient id={`${uid}-hat`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill={`url(#${uid}-bg)`} stroke="#D97706" strokeWidth="4" />
          {/* Explorer Hat */}
          <ellipse cx="60" cy="34" rx="35" ry="8.5" fill="#92400E" />
          <path d="M35 34 C38 15 82 15 85 34 Z" fill={`url(#${uid}-hat)`} />
          <rect x="37" y="29" width="46" height="5.5" rx="2.5" fill="#059669" />
          {/* Ears & Face */}
          <circle cx="35" cy="60" r="5.5" fill="#FDBA74" />
          <circle cx="85" cy="60" r="5.5" fill="#FDBA74" />
          <circle cx="60" cy="60" r="24" fill="#FDBA74" />
          {/* Curly Hair */}
          <path d="M36 52 C38 35 82 35 84 52 C74 42 46 42 36 52 Z" fill="#451A03" />
          {/* Rosy Cheeks */}
          <circle cx="44" cy="65" r="3.6" fill="#FB7185" opacity={isTender || isCheering ? '0.55' : '0.32'} />
          <circle cx="76" cy="65" r="3.6" fill="#FB7185" opacity={isTender || isCheering ? '0.55' : '0.32'} />
          {/* Eyes */}
          {isTender ? (
            <g stroke="#1E293B" strokeWidth="2.8" fill="none" strokeLinecap="round">
              <path d="M46 58 Q51 53 56 58" />
              <path d="M64 58 Q69 53 74 58" />
            </g>
          ) : (
            <g>
              <circle cx={51 + eyeOffsetX} cy="58" r={eyeRadius} fill="#1E293B" />
              <circle cx={69 + eyeOffsetX} cy="58" r={eyeRadius} fill="#1E293B" />
              <circle cx={52.2 + eyeOffsetX} cy="56.6" r="1.3" fill="#FFFFFF" />
              <circle cx={70.2 + eyeOffsetX} cy="56.6" r="1.3" fill="#FFFFFF" />
            </g>
          )}
          {/* Eyebrows */}
          <path
            d={isCurious ? 'M45 49 Q51 45 56 50' : isAmazed ? 'M45 48 Q51 44 57 48' : 'M46 51 Q51 49 56 51'}
            stroke="#451A03"
            strokeWidth="2.3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={isCurious ? 'M64 52 Q69 50 75 51' : isAmazed ? 'M63 48 Q69 44 75 48' : 'M64 51 Q69 49 74 51'}
            stroke="#451A03"
            strokeWidth="2.3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Mouth */}
          {isAmazed ? (
            <ellipse cx="60" cy="70" rx="5" ry="6.2" fill="#9A3412" />
          ) : isCheering ? (
            <path d="M49 66 Q60 79 71 66 Z" fill="#9A3412" />
          ) : isCurious ? (
            <path d="M54 69 Q61 72 67 68" stroke="#9A3412" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          ) : (
            <path
              d={isHappy || isTender ? 'M50 67 Q60 77 70 67' : 'M53 69 Q60 73 67 69'}
              stroke="#9A3412"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          )}
          {/* Explorer Collar & Compass */}
          <path d="M38 96 C42 82 78 82 82 96 Z" fill="#059669" />
          <circle cx="60" cy="92" r="7.5" fill="#FBBF24" stroke="#78350F" strokeWidth="2" />
          <path d="M60 86.5 L62.2 92 L60 97.5 L57.8 92 Z" fill="#DC2626" />
          {/* Expression Accents */}
          {isTender && (
            <path d="M89 35 C89 32 93 31 95 34 C97 31 101 32 101 35 C101 39 95 43 95 43 C95 43 89 39 89 35 Z" fill="#F43F5E" />
          )}
          {isCheering && (
            <polygon points="94,28 96,33 101,34 97,37 98,42 94,39 90,42 91,37 87,34 92,33" fill="#FACC15" />
          )}
        </svg>
      )}

      {character === 'luna' && (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md" aria-label="Luna">
          <defs>
            <radialGradient id={`${uid}-bg`} cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#F0F9FF" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill={`url(#${uid}-bg)`} stroke="#0284C7" strokeWidth="4" />
          {/* Hair Back & Buns */}
          <circle cx="35" cy="55" r="12" fill="#312E81" />
          <circle cx="85" cy="55" r="12" fill="#312E81" />
          <path d="M34 48 C36 22 84 22 86 48 Z" fill="#312E81" />
          {/* Star Hairpin */}
          <polygon points="82,34 85,40 91,41 86,45 87,51 82,48 77,51 78,45 73,41 79,40" fill="#FACC15" />
          {/* Face */}
          <circle cx="60" cy="60" r="23" fill="#FED7AA" />
          <path d="M38 49 C46 36 74 36 82 49 C70 43 50 43 38 49 Z" fill="#312E81" />
          {/* Rosy cheeks */}
          <circle cx="44" cy="64" r="3.8" fill="#FB7185" opacity={isTender || isCheering ? '0.6' : '0.42'} />
          <circle cx="76" cy="64" r="3.8" fill="#FB7185" opacity={isTender || isCheering ? '0.6' : '0.42'} />
          {/* Eyes */}
          {isTender ? (
            <g stroke="#0F172A" strokeWidth="2.8" fill="none" strokeLinecap="round">
              <path d="M46 58 Q51 53 56 58" />
              <path d="M64 58 Q69 53 74 58" />
            </g>
          ) : (
            <g>
              <circle cx={51 + eyeOffsetX} cy="58" r={eyeRadius} fill="#0F172A" />
              <circle cx={69 + eyeOffsetX} cy="58" r={eyeRadius} fill="#0F172A" />
              <circle cx={52.3 + eyeOffsetX} cy="56.6" r="1.4" fill="#FFFFFF" />
              <circle cx={70.3 + eyeOffsetX} cy="56.6" r="1.4" fill="#FFFFFF" />
            </g>
          )}
          {/* Eyebrows */}
          <path
            d={isCurious ? 'M45 49 Q51 45 56 50' : 'M46 51 Q51 49 56 51'}
            stroke="#312E81"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={isCurious ? 'M64 51 Q69 49 75 51' : 'M64 51 Q69 49 74 51'}
            stroke="#312E81"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Mouth */}
          {isAmazed ? (
            <circle cx="60" cy="70" r="4.9" fill="#BE123C" />
          ) : isCheering ? (
            <path d="M50 66 Q60 78 70 66 Z" fill="#BE123C" />
          ) : isCurious ? (
            <path d="M54 69 Q60 72 67 68" stroke="#BE123C" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          ) : (
            <path
              d={isHappy || isTender ? 'M51 67 Q60 76 69 67' : 'M53 69 Q60 73 67 69'}
              stroke="#BE123C"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          )}
          {/* Explorer Scarf & Tunic */}
          <path d="M37 96 C42 82 78 82 83 96 Z" fill="#0284C7" />
          <path d="M44 82 Q60 92 76 82" stroke="#F43F5E" strokeWidth="6" fill="none" strokeLinecap="round" />
          {isTender && (
            <path d="M22 33 C22 30 26 29 28 32 C30 29 34 30 34 33 C34 37 28 41 28 41 C28 41 22 37 22 33 Z" fill="#F43F5E" />
          )}
          {isCheering && (
            <polygon points="26,28 28,33 33,34 29,37 30,42 26,39 22,42 23,37 19,34 24,33" fill="#FACC15" />
          )}
        </svg>
      )}

      {character === 'leon' && (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md" aria-label="León">
          <defs>
            <radialGradient id={`${uid}-bg`} cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#FFF7ED" />
              <stop offset="100%" stopColor="#FED7AA" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill={`url(#${uid}-bg)`} stroke="#EA580C" strokeWidth="4" />
          {/* Fluffy Mane */}
          <circle cx="60" cy="60" r="35" fill="#C2410C" />
          <circle cx="38" cy="40" r="12" fill="#EA580C" />
          <circle cx="82" cy="40" r="12" fill="#EA580C" />
          <circle cx="32" cy="64" r="12" fill="#EA580C" />
          <circle cx="88" cy="64" r="12" fill="#EA580C" />
          <circle cx="60" cy="30" r="13" fill="#EA580C" />
          <circle cx="44" cy="84" r="11" fill="#EA580C" />
          <circle cx="76" cy="84" r="11" fill="#EA580C" />
          {/* Ears */}
          <circle cx="40" cy="37" r="7.5" fill="#FBBF24" />
          <circle cx="80" cy="37" r="7.5" fill="#FBBF24" />
          <circle cx="40" cy="37" r="4" fill="#B45309" />
          <circle cx="80" cy="37" r="4" fill="#B45309" />
          {/* Face */}
          <circle cx="60" cy="62" r="23" fill="#FCD34D" />
          {/* Eyes */}
          {isTender ? (
            <g stroke="#1E293B" strokeWidth="2.8" fill="none" strokeLinecap="round">
              <path d="M46 57 Q51 52 56 57" />
              <path d="M64 57 Q69 52 74 57" />
            </g>
          ) : (
            <g>
              <circle cx={51 + eyeOffsetX} cy="57" r={eyeRadius} fill="#1E293B" />
              <circle cx={69 + eyeOffsetX} cy="57" r={eyeRadius} fill="#1E293B" />
              <circle cx={52 + eyeOffsetX} cy="55.6" r="1.3" fill="#FFFFFF" />
              <circle cx={70 + eyeOffsetX} cy="55.6" r="1.3" fill="#FFFFFF" />
            </g>
          )}
          {/* Snout & Nose */}
          <ellipse cx="60" cy="69" rx="11.5" ry="8.5" fill="#FEF3C7" />
          <polygon points="55,64 65,64 60,70" fill="#7C2D12" />
          {isAmazed ? (
            <circle cx="60" cy="75" r="4.2" fill="#7C2D12" />
          ) : isCheering ? (
            <path d="M51 71 Q60 81 69 71 Z" fill="#7C2D12" />
          ) : (
            <path
              d={isHappy || isTender ? 'M53 72 Q60 78 67 72' : 'M55 73 Q60 76 65 73'}
              stroke="#7C2D12"
              strokeWidth="2.6"
              fill="none"
              strokeLinecap="round"
            />
          )}
          {isTender && (
            <path d="M88 30 C88 27 92 26 94 29 C96 26 100 27 100 30 C100 34 94 38 94 38 C94 38 88 34 88 30 Z" fill="#F43F5E" />
          )}
        </svg>
      )}

      {character === 'cordero' && (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md" aria-label="Cordero">
          <defs>
            <radialGradient id={`${uid}-bg`} cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#ECFDF5" />
              <stop offset="100%" stopColor="#A7F3D0" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill={`url(#${uid}-bg)`} stroke="#059669" strokeWidth="4" />
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
          {isTender ? (
            <g stroke="#1E293B" strokeWidth="2.6" fill="none" strokeLinecap="round">
              <path d="M47 58 Q52 53 57 58" />
              <path d="M63 58 Q68 53 73 58" />
            </g>
          ) : (
            <g>
              <circle cx={52 + eyeOffsetX} cy="58" r={eyeRadius - 0.1} fill="#1E293B" />
              <circle cx={68 + eyeOffsetX} cy="58" r={eyeRadius - 0.1} fill="#1E293B" />
              <circle cx={53 + eyeOffsetX} cy="56.8" r="1.2" fill="#FFFFFF" />
              <circle cx={69 + eyeOffsetX} cy="56.8" r="1.2" fill="#FFFFFF" />
            </g>
          )}
          <circle cx="45" cy="64" r="3.6" fill="#FDA4AF" opacity="0.65" />
          <circle cx="75" cy="64" r="3.6" fill="#FDA4AF" opacity="0.65" />
          {/* Nose & Smile */}
          <path d="M57 65 L60 68 L63 65" stroke="#FB7185" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {isAmazed ? (
            <circle cx="60" cy="73" r="4" fill="#64748B" />
          ) : isCheering ? (
            <path d="M52 70 Q60 79 68 70 Z" fill="#FB7185" />
          ) : (
            <path
              d={isHappy || isTender ? 'M53 71 Q60 76 67 71' : 'M55 72 Q60 74 65 72'}
              stroke="#64748B"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
            />
          )}
          {/* Olive sprig + Ribbon */}
          <path d="M48 86 L60 92 L72 86 L60 96 Z" fill="#0284C7" />
          <path d="M74 79 Q83 73 88 68" stroke="#15803D" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <ellipse cx="83" cy="72" rx="4" ry="2.2" transform="rotate(-25 83 72)" fill="#22C55E" />
          <ellipse cx="88" cy="68" rx="4" ry="2.2" transform="rotate(15 88 68)" fill="#16A34A" />
        </svg>
      )}

      {character === 'estrellita' && (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md" aria-label="Estrellita">
          <defs>
            <radialGradient id={`${uid}-bg`} cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#FEFCE8" />
              <stop offset="100%" stopColor="#FEF08A" />
            </radialGradient>
            <linearGradient id={`${uid}-star`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill={`url(#${uid}-bg)`} stroke="#CA8A04" strokeWidth="4" />
          {/* Outer Halo Glow */}
          <circle cx="60" cy="60" r="42" fill="#FDE047" opacity="0.38" />
          {/* Star Body */}
          <polygon
            points="60,18 71,44 99,46 77,64 84,92 60,77 36,92 43,64 21,46 49,44"
            fill={`url(#${uid}-star)`}
            stroke="#CA8A04"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Eyes */}
          {isTender ? (
            <g stroke="#1E293B" strokeWidth="2.6" fill="none" strokeLinecap="round">
              <path d="M47 57 Q52 52 57 57" />
              <path d="M63 57 Q68 52 73 57" />
            </g>
          ) : (
            <g>
              <circle cx={52 + eyeOffsetX} cy="57" r={eyeRadius - 0.1} fill="#1E293B" />
              <circle cx={68 + eyeOffsetX} cy="57" r={eyeRadius - 0.1} fill="#1E293B" />
              <circle cx={53 + eyeOffsetX} cy="55.8" r="1.2" fill="#FFFFFF" />
              <circle cx={69 + eyeOffsetX} cy="55.8" r="1.2" fill="#FFFFFF" />
            </g>
          )}
          <circle cx="46" cy="63" r="3.2" fill="#FB7185" opacity="0.48" />
          <circle cx="74" cy="63" r="3.2" fill="#FB7185" opacity="0.48" />
          {isAmazed ? (
            <circle cx="60" cy="68" r="4" fill="#854D0E" />
          ) : isCheering ? (
            <path d="M52 65 Q60 74 68 65 Z" fill="#854D0E" />
          ) : (
            <path
              d={isHappy || isTender ? 'M53 66 Q60 72 67 66' : 'M55 67 Q60 70 65 67'}
              stroke="#854D0E"
              strokeWidth="2.6"
              fill="none"
              strokeLinecap="round"
            />
          )}
          {/* Extra Magic Mini Sparkles */}
          <circle cx="28" cy="30" r="2.6" fill="#F59E0B" />
          <circle cx="93" cy="30" r="2.6" fill="#F59E0B" />
        </svg>
      )}
    </div>
  );
};
