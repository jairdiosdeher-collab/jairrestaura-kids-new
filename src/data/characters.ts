import { CharacterData, CharacterId } from '../types/app';

export const CHARACTERS: Record<CharacterId, CharacterData> = {
  lucas: {
    id: 'lucas',
    name: 'Lucas',
    role: 'Explorador alegre',
    tagline: '¡Siempre listo para descubrir la Palabra de Dios!',
    description:
      'Lucas lleva su brújula de madera y una mochila llena de mapas bíblicos. Le encanta recorrer las colinas del Reino ayudando a sus amigos a recordar que Jesús camina con nosotros.',
    favoriteVerse: 'Esfuérzate y sé valiente, porque el Señor estará contigo. — Josué 1:9',
    primaryColor: '#d97706',
    accentColor: '#fef3c7',
    badgeLabel: 'Brújula de la Fe',
    greetings: {
      '3-5': '¡Hola amiguito! Soy Lucas. ¡Vamos a explorar juntos con Jesús!',
      '6-8': '¡Bienvenido al Reino! Soy Lucas. ¿Listo para descubrir una gran aventura bíblica hoy?',
      '9-12': '¡Qué alegría verte, explorador! Soy Lucas. Hoy tenemos misiones increíbles para fortalecer tu fe.',
    },
    reactions: {
      alegre: '¡Qué gran día para aprender del amor de Jesús!',
      curioso: 'Mmm, me pregunto qué tesoro encontraremos en este pasaje bíblico.',
      asombrado: '¡Guau! ¡Mira todo lo maravilloso que Dios ha creado!',
      tierno: 'Recuerda que nunca caminas solo, Jesús es nuestro mejor amigo.',
      animando: '¡Tú puedes lograrlo! ¡Sigue adelante con valentía y alegría!',
    },
  },
  luna: {
    id: 'luna',
    name: 'Luna',
    role: 'Aventurera curiosa',
    tagline: 'Cada pregunta es una puerta hacia la sabiduría.',
    description:
      'Luna observa las estrellas y los jardines con su lupa brillante. Siempre hace preguntas inteligentes sobre los milagros de la Biblia y anima a todos a investigar con corazón humilde.',
    favoriteVerse: 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino. — Salmo 119:105',
    primaryColor: '#0284c7',
    accentColor: '#e0f2fe',
    badgeLabel: 'Lupa de Sabiduría',
    greetings: {
      '3-5': '¡Hola! Soy Luna. ¡Mira las flores y estrellas que hizo Dios!',
      '6-8': '¡Hola explorador! Soy Luna. Tengo muchas curiosidades bíblicas para compartir contigo.',
      '9-12': '¡Saludos! Soy Luna. Acompáñame a resolver acertijos y descubrir verdades profundas de la Biblia.',
    },
    reactions: {
      alegre: '¡Me encanta investigar nuevas historias contigo!',
      curioso: '¿Sabías que cada detalle de la Biblia tiene una enseñanza especial?',
      asombrado: '¡Increíble! Dios pensó en cada estrella y en cada uno de nosotros.',
      tierno: 'Dios escucha hasta las preguntas más pequeñitas de tu corazón.',
      animando: '¡Excelente observación! ¡Eres un investigador brillante!',
    },
  },
  leon: {
    id: 'leon',
    name: 'León',
    role: 'Leoncito amigable',
    tagline: 'Valiente de corazón, manso y protector.',
    description:
      'Aunque tiene una melena dorada digna de la selva, León es el compañero más bondadoso y pacífico del Reino. Nos recuerda que el verdadero valor viene de confiar en Dios, como Daniel en el foso.',
    favoriteVerse: 'El Señor es mi fuerza y mi escudo; mi corazón en él confía. — Salmo 28:7',
    primaryColor: '#ea580c',
    accentColor: '#ffedd5',
    badgeLabel: 'Corazón Valiente',
    greetings: {
      '3-5': '¡Ruuugido alegre! Soy León, tu amigo fuerte y bueno.',
      '6-8': '¡Hola campeón! Soy León. Con Jesús podemos ser valientes y amables al mismo tiempo.',
      '9-12': '¡Bienvenido, guerrero de paz! Soy León. La verdadera valentía nace de la confianza en Dios.',
    },
    reactions: {
      alegre: '¡Mi melena brilla de felicidad al verte por aquí!',
      curioso: '¿Escuchaste ese sonido en el jardín? ¡Vamos a cuidar a nuestros amigos!',
      asombrado: '¡Ni los leones feroces pudieron hacer daño a Daniel cuando Dios lo cuidó!',
      tierno: 'Ser fuerte también significa cuidar a los más pequeños con dulzura.',
      animando: '¡Ruge de alegría! ¡Lo hiciste con mucha valentía!',
    },
  },
  cordero: {
    id: 'cordero',
    name: 'Cordero',
    role: 'Personaje tierno',
    tagline: 'Suave como una nube, lleno de paz y gratitud.',
    description:
      'Cordero lleva un lazo de colores y una ramita de olivo. Enseña a los niños sobre la ternura, el perdón y cómo Jesús es nuestro Buen Pastor que siempre cuida de sus ovejitas.',
    favoriteVerse: 'El Señor es mi pastor; nada me faltará. — Salmo 23:1',
    primaryColor: '#059669',
    accentColor: '#d1fae5',
    badgeLabel: 'Paz del Pastor',
    greetings: {
      '3-5': '¡Beee! Soy Cordero. Jesús nos cuida con mucho amor.',
      '6-8': '¡Hola amiguito! Soy Cordero. Qué lindo es descansar en los cuidados del Buen Pastor.',
      '9-12': '¡Paz para ti! Soy Cordero. Hoy aprenderemos el valor del perdón, la humildad y la gratitud.',
    },
    reactions: {
      alegre: '¡Salto de alegría porque el Buen Pastor conoce tu nombre!',
      curioso: '¿A quién podemos darle un abrazo o una palabra amable hoy?',
      asombrado: '¡Qué paz se siente cuando entregamos nuestras preocupaciones a Jesús!',
      tierno: 'Jesús nos abraza con Su amor infinito todos los días.',
      animando: '¡Qué hermoso corazón tienes! ¡Sigue sembrando bondad!',
    },
  },
  estrellita: {
    id: 'estrellita',
    name: 'Estrellita',
    role: 'Guía mágica',
    tagline: 'Luz celestial que ilumina tus oraciones y canciones.',
    description:
      'Estrellita brilla suavemente sobre el Castillo del Reino. Guía a los niños en el Rincón con Dios, recuerda la Estrella de Belén que anunció a Jesús y celebra cada misión cumplida.',
    favoriteVerse: 'Yo soy la luz del mundo; el que me sigue no andará en tinieblas. — Juan 8:12',
    primaryColor: '#ca8a04',
    accentColor: '#fef9c3',
    badgeLabel: 'Luz de Belén',
    greetings: {
      '3-5': '¡Tintín! Soy Estrellita. ¡Brilla conmigo cantándole a Jesús!',
      '6-8': '¡Hola luz del Reino! Soy Estrellita. Te acompañaré en tus oraciones, canciones y misiones.',
      '9-12': '¡Hola, estrella exploradora! Estoy aquí para recordarte que la luz de Cristo brilla en ti.',
    },
    reactions: {
      alegre: '¡Mi luz brilla más fuerte cada vez que aprendes un versículo!',
      curioso: '¿Sabías que una estrella especial guió a los sabios hasta el niño Jesús?',
      asombrado: '¡Las estrellas en el cielo cantan la grandeza de nuestro Creador!',
      tierno: 'Cuando tengas miedo en la noche, recuerda que Jesús cuida tu sueño.',
      animando: '¡Brillas como una estrella! ¡Acabas de ganar una nueva luz!',
    },
  },
};

export const CHARACTER_LIST: CharacterData[] = [
  CHARACTERS.lucas,
  CHARACTERS.luna,
  CHARACTERS.leon,
  CHARACTERS.cordero,
  CHARACTERS.estrellita,
];
