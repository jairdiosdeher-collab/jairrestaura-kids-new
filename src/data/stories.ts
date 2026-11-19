import { BibleStory } from '../types/app';

export const BIBLE_STORIES: BibleStory[] = [
  {
    id: 'noe-y-el-arca',
    title: 'Noé y el arca',
    reference: 'Génesis 6–9',
    subtitle: 'Obediencia, cuidado de los animales y la promesa del arcoíris',
    durationLabel: '3 min',
    rewardName: 'Medalla del Arcoíris',
    starsReward: 8,
    pastorAudioSlot: '/media/pastor-jair/historias/noe-y-el-arca.mp3',
    scenes: [
      {
        id: 'noe-1',
        title: 'El gran barco de madera',
        visualTheme: 'ark',
        characterFocus: 'lucas',
        narration: {
          '3-5': 'Dios le pidió a Noé construir un barco gigante llamado arca. Noé obedeció con alegría y subieron parejas de animalitos.',
          '6-8': 'Dios le confió a Noé una misión enorme: construir un arca de madera para proteger a su familia y a dos animalitos de cada especie.',
          '9-12': 'Aunque las personas no entendían por qué construía un barco en tierra seca, Noé confió en la palabra de Dios y obedeció paso a paso con fidelidad.',
        },
      },
      {
        id: 'noe-2',
        title: 'Lluvia y protección en el mar',
        visualTheme: 'storm',
        characterFocus: 'cordero',
        narration: {
          '3-5': 'Llovió cuarenta días, pero adentro del arca todos estaban calientitos, seguros y cuidados por Dios.',
          '6-8': 'Durante cuarenta días y cuarenta noches cayó lluvia sobre la tierra. Adentro del arca, Dios cuidó a Noé y a todos los animales.',
          '9-12': 'Cuando llegaron las lluvias del diluvio, el arca flotó sobre las aguas. La misma obediencia que parecía extraña se convirtió en refugio seguro.',
        },
      },
      {
        id: 'noe-3',
        title: 'La paloma y el arcoíris',
        visualTheme: 'rainbow',
        characterFocus: 'estrellita',
        narration: {
          '3-5': 'Una palomita trajo una hojita verde. Al salir, ¡Dios puso un hermoso arcoíris en el cielo!',
          '6-8': 'Cuando dejó de llover, una paloma regresó con una rama de olivo. Al pisar tierra firme, Dios dibujó un arcoíris como señal de Su amor.',
          '9-12': 'La paloma con la hoja de olivo anunció un nuevo comienzo. Dios selló un pacto eterno con el arcoíris, recordándonos que Él siempre cumple Sus promesas.',
        },
      },
    ],
    learning: {
      '3-5': 'Obedecer a Dios y a nuestros papás nos mantiene seguros, y el arcoíris nos recuerda Su amor.',
      '6-8': 'Dios siempre cumple Sus promesas y cuida con ternura a quienes obedecen Su voz.',
      '9-12': 'La obediencia fiel a Dios puede requerir paciencia, pero siempre trae bendición y un nuevo comienzo.',
    },
    questions: {
      '3-5': [
        {
          question: '¿Qué puso Dios en el cielo al final de la historia?',
          options: ['Un arcoíris de colores', 'Un camión rojo', 'Una pelota gigante'],
          correctIndex: 0,
          explanation: '¡Exacto! El arcoíris fue la señal hermosa de la promesa de Dios.',
        },
      ],
      '6-8': [
        {
          question: '¿Qué trajo la paloma en su pico para mostrar que había tierra seca?',
          options: ['Una piedra azul', 'Una ramita verde de olivo', 'Una concha del mar'],
          correctIndex: 1,
          explanation: '¡Muy bien! La ramita de olivo mostró que los árboles volvían a brotar.',
        },
      ],
      '9-12': [
        {
          question: '¿Qué enseñanza principal deja la actitud de Noé al construir el arca?',
          options: [
            'Confiar y obedecer a Dios aunque otros no entiendan',
            'Construir barcos solo cuando llueve',
            'Esperar a que los demás hagan el trabajo',
          ],
          correctIndex: 0,
          explanation: '¡Correcto! La fe de Noé se demostró en su obediencia constante.',
        },
      ],
    },
  },
  {
    id: 'david-y-goliat',
    title: 'David y Goliat',
    reference: '1 Samuel 17',
    subtitle: 'La valentía que nace de confiar en el Señor',
    durationLabel: '3 min',
    rewardName: 'Honda de la Valentía',
    starsReward: 8,
    pastorAudioSlot: '/media/pastor-jair/historias/david-y-goliat.mp3',
    scenes: [
      {
        id: 'dav-1',
        title: 'El pequeño pastor de ovejas',
        visualTheme: 'meadow',
        characterFocus: 'cordero',
        narration: {
          '3-5': 'David era un niño pastor que tocaba el arpa y cuidaba sus ovejitas con ayuda de Dios.',
          '6-8': 'David cuidaba las ovejas de su papá en las colinas. Mientras el gigante Goliat asustaba al pueblo, David sabía que Dios era más grande.',
          '9-12': 'Aunque era el hermano menor y pastor de ovejas, David había aprendido en el campo que Dios lo libraba de peligros reales.',
        },
      },
      {
        id: 'dav-2',
        title: 'Cinco piedras lisas del arroyo',
        visualTheme: 'valley',
        characterFocus: 'lucas',
        narration: {
          '3-5': 'David buscó cinco piedritas lisas en el río y llevó su honda, sabiendo que Dios estaba con él.',
          '6-8': 'La armadura del rey era demasiado pesada para David. En cambio, escogió cinco piedras lisas del arroyo y confió en el nombre del Señor.',
          '9-12': 'David rechazó armas prestadas y eligió lo que Dios ya había entrenado en sus manos: cinco piedras del arroyo y una honda.',
        },
      },
      {
        id: 'dav-3',
        title: 'La victoria de la fe',
        visualTheme: 'valley',
        characterFocus: 'leon',
        narration: {
          '3-5': 'Con una sola piedrita y la fuerza de Dios, David venció al gigante y todo el pueblo celebró.',
          '6-8': 'David declaró que la batalla pertenecía a Dios. Con una sola piedra de su honda venció a Goliat y dio paz a su pueblo.',
          '9-12': 'David declaró: «Yo vengo a ti en el nombre del Señor». Su victoria demostró que Dios mira el corazón valiente y fiel, no la estatura.',
        },
      },
    ],
    learning: {
      '3-5': 'Aunque seamos pequeñitos, con Jesús en el corazón somos muy valientes.',
      '6-8': 'No importa qué tan grande sea un problema, Dios siempre es muchísimo más grande.',
      '9-12': 'Nuestra verdadera fortaleza frente a los desafíos gigantes está en confiar en Dios y usar los talentos que Él nos dio.',
    },
    questions: {
      '3-5': [
        {
          question: '¿Cuántas piedritas recogió David del arroyo?',
          options: ['Cinco piedras lisas', 'Cien piedras cuadradas', 'Ninguna'],
          correctIndex: 0,
          explanation: '¡Sí! David escogió cinco piedras lisas del arroyo.',
        },
      ],
      '6-8': [
        {
          question: '¿Por qué David no tuvo miedo del gigante Goliat?',
          options: [
            'Porque tenía una armadura de oro',
            'Porque confiaba en que Dios peleaba por él',
            'Porque era más alto que Goliat',
          ],
          correctIndex: 1,
          explanation: '¡Exacto! David confió completamente en el poder de Dios.',
        },
      ],
      '9-12': [
        {
          question: '¿Qué lección nos enseña que David rechazara la armadura del rey Saúl?',
          options: [
            'Dios usa nuestra fe auténtica y lo que ya sabemos hacer para Él',
            'Las armaduras nunca sirven',
            'Solo los pastores pueden luchar',
          ],
          correctIndex: 0,
          explanation: '¡Brillante! No necesitamos imitar a otros, sino confiar en Dios con lo que Él puso en nuestras manos.',
        },
      ],
    },
  },
  {
    id: 'daniel-y-los-leones',
    title: 'Daniel y los leones',
    reference: 'Daniel 6',
    subtitle: 'Orar con fidelidad y descansar bajo el cuidado de Dios',
    durationLabel: '3 min',
    rewardName: 'Sello de Fidelidad',
    starsReward: 8,
    pastorAudioSlot: '/media/pastor-jair/historias/daniel-y-los-leones.mp3',
    scenes: [
      {
        id: 'dan-1',
        title: 'Tres veces al día en oración',
        visualTheme: 'palace',
        characterFocus: 'estrellita',
        narration: {
          '3-5': 'Daniel amaba hablar con Dios cada mañana, tarde y noche junto a su ventana.',
          '6-8': 'Daniel era un consejero honesto en el palacio. Aunque hicieron una ley injusta para prohibir orar, él siguió hablando con Dios tres veces al día.',
          '9-12': 'A pesar de la envidia de otros oficiales y el decreto real que prohibía orar a Dios, Daniel mantuvo su integridad y disciplina de oración.',
        },
      },
      {
        id: 'dan-2',
        title: 'El ángel en la cueva de los leones',
        visualTheme: 'palace',
        characterFocus: 'leon',
        narration: {
          '3-5': 'Enviaron a Daniel con los leones, pero un ángel cerró sus bocas y los leones parecían gatitos dormidos.',
          '6-8': 'Cuando metieron a Daniel en el foso de los leones, Dios envió a Su ángel para cerrar la boca de los leones y proteger a Su amigo fiel.',
          '9-12': 'Durante toda la noche en el foso, Dios envió a Su ángel para mantener a los leones en calma. Ningún daño sufrió Daniel porque confió en su Dios.',
        },
      },
      {
        id: 'dan-3',
        title: 'Un testimonio que alegró al reino',
        visualTheme: 'star',
        characterFocus: 'luna',
        narration: {
          '3-5': 'Al amanecer, Daniel salió sin un rasguño y todos conocieron lo bueno que es Dios.',
          '6-8': 'El rey corrió al amanecer y vio con asombro que Daniel estaba vivo y feliz. Todo el reino alabó al Dios que salva y protege.',
          '9-12': 'La fidelidad de Daniel transformó el corazón del rey Darío, quien proclamó en todo el imperio la grandeza del Dios viviente.',
        },
      },
    ],
    learning: {
      '3-5': 'Podemos hablar con Dios en oración a cualquier hora y Él nos cuida siempre.',
      '6-8': 'Nunca dejemos de orar ni de hacer lo correcto, porque Dios cuida a Sus hijos fieles.',
      '9-12': 'La integridad diaria —hacer lo correcto incluso bajo presión— honra a Dios e inspira a otros.',
    },
    questions: {
      '3-5': [
        {
          question: '¿Quién cerró la boca de los leones para cuidar a Daniel?',
          options: ['Un ángel enviado por Dios', 'Un perro guardián', 'Un viento frío'],
          correctIndex: 0,
          explanation: '¡Sí! Dios envió a Su ángel para cuidar a Daniel toda la noche.',
        },
      ],
      '6-8': [
        {
          question: '¿Cuántas veces al día oraba Daniel junto a su ventana?',
          options: ['Una vez al año', 'Tres veces al día', 'Solo los domingos'],
          correctIndex: 1,
          explanation: '¡Correcto! Daniel oraba y daba gracias a Dios tres veces cada día.',
        },
      ],
      '9-12': [
        {
          question: '¿Por qué Daniel no cerró su ventana para esconder su oración?',
          options: [
            'Porque su fe era constante y no se avergonzaba de ser fiel a Dios',
            'Porque la ventana estaba rota',
            'Porque quería pelear con los oficiales',
          ],
          correctIndex: 0,
          explanation: '¡Excelente! Daniel mantuvo su devoción con valentía y paz.',
        },
      ],
    },
  },
  {
    id: 'jose-y-sus-hermanos',
    title: 'José y sus hermanos',
    reference: 'Génesis 37–45',
    subtitle: 'El perdón transforma el dolor en bendición',
    durationLabel: '3 min',
    rewardName: 'Túnica del Perdón',
    starsReward: 8,
    pastorAudioSlot: '/media/pastor-jair/historias/jose-y-sus-hermanos.mp3',
    scenes: [
      {
        id: 'jos-1',
        title: 'La túnica de muchos colores',
        visualTheme: 'meadow',
        characterFocus: 'lucas',
        narration: {
          '3-5': 'José tenía una túnica hermosa de muchos colores y amaba contar sus sueños.',
          '6-8': 'Su papá regaló a José una túnica de colores. Sus hermanos sintieron celos y lo enviaron muy lejos a Egipto.',
          '9-12': 'La envidia dividió a los hermanos de José, quienes lo vendieron a mercaderes rumbo a Egipto. Sin embargo, Dios tenía un propósito mayor.',
        },
      },
      {
        id: 'jos-2',
        title: 'Sabiduría para cuidar al pueblo',
        visualTheme: 'palace',
        characterFocus: 'luna',
        narration: {
          '3-5': 'En Egipto, Dios ayudó a José a guardar comida para cuando hubiera hambre.',
          '6-8': 'Aunque pasó momentos difíciles, José trabajó con honestidad. Dios le dio sabiduría para guardar alimento para muchas familias.',
          '9-12': 'Dios estuvo con José en cada prueba hasta convertirlo en gobernador de Egipto, encargado de almacenar grano para siete años de escasez.',
        },
      },
      {
        id: 'jos-3',
        title: 'Un abrazo lleno de perdón',
        visualTheme: 'rainbow',
        characterFocus: 'cordero',
        narration: {
          '3-5': 'Cuando llegaron sus hermanos, José los abrazó, los perdonó y compartió comida con ellos.',
          '6-8': 'Cuando sus hermanos llegaron buscando comida, José los perdonó de corazón y les dio abrazos y alimento para toda su familia.',
          '9-12': 'José perdonó sinceramente a sus hermanos y les explicó: «Ustedes pensaron hacerme mal, pero Dios lo encaminó para bien, para salvar muchas vidas».',
        },
      },
    ],
    learning: {
      '3-5': 'Perdonar y abrazar a nuestros hermanos y amigos alegra el corazón de Jesús.',
      '6-8': 'Dios puede transformar los momentos tristes en bendición cuando elegimos perdonar.',
      '9-12': 'El perdón verdadero libera el corazón del rencor y refleja la gracia de Dios incluso hacia quienes nos hirieron.',
    },
    questions: {
      '3-5': [
        {
          question: '¿Qué hizo José cuando volvió a ver a sus hermanos?',
          options: ['Los perdonó y los abrazó', 'Los echó de la casa', 'Se escondió'],
          correctIndex: 0,
          explanation: '¡Muy bien! José perdonó con mucho amor a toda su familia.',
        },
      ],
      '6-8': [
        {
          question: '¿Cómo ayudó Dios a José en Egipto?',
          options: [
            'Dándole sabiduría para guardar alimento para todos',
            'Construyendo un barco',
            'Enviando nieve en verano',
          ],
          correctIndex: 0,
          explanation: '¡Exacto! Gracias a esa sabiduría muchas familias tuvieron pan.',
        },
      ],
      '9-12': [
        {
          question: '¿Qué frase resume la mirada espiritual de José sobre su historia?',
          options: [
            'Dios encaminó para bien lo que otros pensaron para mal',
            'La venganza es mejor que el perdón',
            'Solo los sueños fáciles se cumplen',
          ],
          correctIndex: 0,
          explanation: '¡Correcto! Dios obra soberanamente para bien de quienes le aman.',
        },
      ],
    },
  },
  {
    id: 'moises-y-el-mar-rojo',
    title: 'Moisés y el mar Rojo',
    reference: 'Éxodo 14',
    subtitle: 'Dios abre camino donde parece imposible',
    durationLabel: '3 min',
    rewardName: 'Vara del Camino Nuevo',
    starsReward: 8,
    pastorAudioSlot: '/media/pastor-jair/historias/moises-y-el-mar-rojo.mp3',
    scenes: [
      {
        id: 'moi-1',
        title: 'Frente a las aguas profundas',
        visualTheme: 'sea',
        characterFocus: 'luna',
        narration: {
          '3-5': 'El pueblo caminaba con Moisés y llegó frente a un mar muy grande y azul.',
          '6-8': 'El pueblo de Dios había salido de Egipto, pero delante estaba el mar Rojo y detrás venía un ejército. Todos tenían miedo.',
          '9-12': 'Acorralado entre los carros del faraón y el mar Rojo, el pueblo sintió temor, pero Moisés les dijo: «No teman, vean la salvación del Señor».',
        },
      },
      {
        id: 'moi-2',
        title: '¡Un camino seco en el mar!',
        visualTheme: 'sea',
        characterFocus: 'lucas',
        narration: {
          '3-5': 'Moisés levantó su vara, sopló un viento suave ¡y el mar se abrió como dos paredes de agua!',
          '6-8': 'Dios le dijo a Moisés que extendiera su mano sobre el mar. Un viento fuerte abrió las aguas y apareció un camino seco.',
          '9-12': 'Al extender Moisés su mano por orden de Dios, un recio viento dividió las aguas toda la noche, formando murallas de agua a izquierda y derecha.',
        },
      },
      {
        id: 'moi-3',
        title: 'Canto de libertad al otro lado',
        visualTheme: 'rainbow',
        characterFocus: 'estrellita',
        narration: {
          '3-5': 'Niños, papás y abuelitos cruzaron felices y cantaron gracias a Dios al otro lado.',
          '6-8': 'Todo el pueblo cruzó sano y salvo hasta la otra orilla, y cantaron con panderos dando gracias al Señor por Su gran milagro.',
          '9-12': 'Israel cruzó en seco hacia la libertad. Al otro lado, Moisés y María guiaron un himno de gratitud celebrando el poder liberador de Dios.',
        },
      },
    ],
    learning: {
      '3-5': 'Cuando algo parece muy difícil, Jesús puede abrir un camino hermoso.',
      '6-8': 'No tengas miedo frente a los obstáculos; Dios abre caminos donde no los había.',
      '9-12': 'La fe avanza incluso antes de ver el camino completo, confiando en que Dios abre paso en lo imposible.',
    },
    questions: {
      '3-5': [
        {
          question: '¿Cómo cruzó el pueblo el mar Rojo?',
          options: ['Caminando por un camino seco entre las aguas', 'Nadando con flotadores', 'En avión'],
          correctIndex: 0,
          explanation: '¡Exacto! Dios abrió el mar para que caminaran en seco.',
        },
      ],
      '6-8': [
        {
          question: '¿Qué le pidió Dios a Moisés que hiciera frente al mar?',
          options: ['Que regresara corriendo', 'Que extendiera su mano con la vara sobre el mar', 'Que construyera un puente de piedra'],
          correctIndex: 1,
          explanation: '¡Muy bien! Moisés obedeció y Dios dividió las aguas.',
        },
      ],
      '9-12': [
        {
          question: '¿Qué hizo el pueblo al llegar a la otra orilla del mar Rojo?',
          options: [
            'Se quejó del viento',
            'Cantó alabanzas de gratitud a Dios por Su liberación',
            'Se olvidó de Moisés',
          ],
          correctIndex: 1,
          explanation: '¡Correcto! La gratitud y la alabanza fueron su respuesta al milagro.',
        },
      ],
    },
  },
  {
    id: 'jonas',
    title: 'Jonás',
    reference: 'Jonás 1–4',
    subtitle: 'Segundas oportunidades y el amor de Dios por todas las personas',
    durationLabel: '3 min',
    rewardName: 'Brújula de Nínive',
    starsReward: 8,
    pastorAudioSlot: '/media/pastor-jair/historias/jonas.mp3',
    scenes: [
      {
        id: 'jon-1',
        title: 'El viaje en dirección contraria',
        visualTheme: 'storm',
        characterFocus: 'lucas',
        narration: {
          '3-5': 'Dios envió a Jonás a dar un mensaje bueno a una ciudad, pero Jonás se subió a un barco hacia otro lado.',
          '6-8': 'Dios pidió a Jonás ir a Nínive, pero él tuvo miedo y tomó un barco en sentido contrario. Entonces llegó una gran tormenta.',
          '9-12': 'Jonás intentó huir de su llamado abordando un barco hacia Tarsis, pero descubrió que nadie puede esconderse de la presencia y el cuidado de Dios.',
        },
      },
      {
        id: 'jon-2',
        title: 'Una oración dentro del gran pez',
        visualTheme: 'whale',
        characterFocus: 'estrellita',
        narration: {
          '3-5': 'Un pez gigante cuidó a Jonás en su pancita por tres días. Jonás oró y el pez lo dejó en la playa.',
          '6-8': 'Un gran pez se tragó a Jonás para salvarlo del mar. Allí adentro, Jonás oró pidiendo perdón y Dios le dio una segunda oportunidad.',
          '9-12': 'Rescatado por un gran pez, Jonás oró con humildad reconociendo la misericordia de Dios. Tres días después fue puesto en tierra firme.',
        },
      },
      {
        id: 'jon-3',
        title: 'Toda una ciudad escucha el amor de Dios',
        visualTheme: 'meadow',
        characterFocus: 'cordero',
        narration: {
          '3-5': 'Jonás fue a Nínive, contó el mensaje de Dios ¡y toda la ciudad decidió portarse bien!',
          '6-8': 'Jonás obedeció y habló en Nínive. La gente escuchó, pidió perdón a Dios y toda la ciudad recibió Su misericordia.',
          '9-12': 'El mensaje en Nínive produjo un cambio sincero en toda la ciudad, enseñándole a Jonás que la compasión de Dios alcanza a cada pueblo.',
        },
      },
    ],
    learning: {
      '3-5': 'Si nos equivocamos, podemos pedir perdón a Jesús y volver a obedecer.',
      '6-8': 'Dios siempre nos da segundas oportunidades y ama a todas las personas de la tierra.',
      '9-12': 'Escapar del propósito de Dios trae tormentas, pero el arrepentimiento sincero abre puertas de misericordia para muchos.',
    },
    questions: {
      '3-5': [
        {
          question: '¿Qué animal marino cuidó a Jonás durante tres días?',
          options: ['Un gran pez', 'Un cangrejo chiquito', 'Un pato'],
          correctIndex: 0,
          explanation: '¡Sí! Un gran pez protegió a Jonás hasta que oró a Dios.',
        },
      ],
      '6-8': [
        {
          question: '¿Qué hizo Jonás mientras estaba dentro del gran pez?',
          options: ['Se puso a dormir todo el tiempo', 'Oró a Dios pidiendo ayuda y perdón', 'Construyó una mesa'],
          correctIndex: 1,
          explanation: '¡Exacto! Desde allí Jonás oró y Dios lo escuchó.',
        },
      ],
      '9-12': [
        {
          question: '¿Qué aprendió Jonás sobre el corazón de Dios hacia Nínive?',
          options: [
            'Que Dios es compasivo y desea perdonar a quienes se arrepienten',
            'Que Dios solo ama a una ciudad',
            'Que los viajes largos no importan',
          ],
          correctIndex: 0,
          explanation: '¡Muy bien! Dios ama con misericordia a todas las personas.',
        },
      ],
    },
  },
  {
    id: 'nacimiento-de-jesus',
    title: 'El nacimiento de Jesús',
    reference: 'Lucas 2 · Mateo 2',
    subtitle: 'El regalo más hermoso del cielo llegó en un pesebre',
    durationLabel: '4 min',
    rewardName: 'Estrella de Belén',
    starsReward: 10,
    pastorAudioSlot: '/media/pastor-jair/historias/nacimiento-de-jesus.mp3',
    scenes: [
      {
        id: 'nac-1',
        title: 'Una noche tranquila en Belén',
        visualTheme: 'star',
        characterFocus: 'cordero',
        narration: {
          '3-5': 'María y José llegaron a Belén. En un establo tibiecito y humilde nació el bebé Jesús.',
          '6-8': 'En la pequeña ciudad de Belén, María y José encontraron lugar en un pesebre. Esa noche nació Jesús, el Salvador prometido.',
          '9-12': 'Lejos de los palacios reales, el Hijo de Dios nació en un humilde pesebre de Belén, mostrando que Su reino es de amor y humildad.',
        },
      },
      {
        id: 'nac-2',
        title: 'Ángeles y pastores cantan alegría',
        visualTheme: 'star',
        characterFocus: 'estrellita',
        narration: {
          '3-5': 'Un coro de ángeles cantó en el cielo y los pastores corrieron felices a conocer a Jesús.',
          '6-8': 'Los ángeles iluminaron la noche anunciando a los pastores: «¡Hoy les ha nacido un Salvador!». Todos fueron a adorarlo.',
          '9-12': 'Los primeros en recibir la gran noticia fueron sencillos pastores en el campo, quienes escucharon el coro celestial de paz y buena voluntad.',
        },
      },
      {
        id: 'nac-3',
        title: 'La estrella guía hasta el Rey de Amor',
        visualTheme: 'rainbow',
        characterFocus: 'luna',
        narration: {
          '3-5': 'Una estrella brillante guió a unos sabios con regalos para el niño Jesús.',
          '6-8': 'Una estrella especial brilló sobre Belén guiando a visitantes de oriente, quienes llevaron regalos de amor para el pequeño Rey.',
          '9-12': 'Guiados por la estrella, sabios de oriente adoraron a Jesús, recordándonos que Él vino como luz para todas las naciones.',
        },
      },
    ],
    learning: {
      '3-5': 'Jesús nació por amor a nosotros; Él es el mejor regalo del mundo.',
      '6-8': 'El nacimiento de Jesús trajo paz, alegría y esperanza para cada familia.',
      '9-12': 'La encarnación de Jesús muestra la humildad de Dios al acercarse a la humanidad para traernos salvación.',
    },
    questions: {
      '3-5': [
        {
          question: '¿Qué brilló en el cielo para guiar hasta donde estaba el niño Jesús?',
          options: ['Una estrella muy brillante', 'Un semáforo', 'Una linterna'],
          correctIndex: 0,
          explanation: '¡Sí! La estrella de Belén brilló guiando hacia Jesús.',
        },
      ],
      '6-8': [
        {
          question: '¿Quiénes fueron los primeros en escuchar el anuncio de los ángeles?',
          options: ['Los pastores en el campo', 'Los soldados de Roma', 'Los marineros'],
          correctIndex: 0,
          explanation: '¡Exacto! Los pastores escucharon la noticia llena de gozo.',
        },
      ],
      '9-12': [
        {
          question: '¿Qué nos enseña que Jesús haya nacido en un humilde pesebre?',
          options: [
            'Que Dios valora la humildad y se acerca a todos sin distinción',
            'Que no había estrellas esa noche',
            'Que solo los reyes podían visitarlo',
          ],
          correctIndex: 0,
          explanation: '¡Verdad hermosa! Jesús vino con humildad para estar cerca de cada corazón.',
        },
      ],
    },
  },
  {
    id: 'jesus-calma-la-tormenta',
    title: 'Jesús calma la tormenta',
    reference: 'Marcos 4:35–41',
    subtitle: 'Con Jesús en nuestra barca nunca estamos solos',
    durationLabel: '3 min',
    rewardName: 'Ancla de la Paz',
    starsReward: 8,
    pastorAudioSlot: '/media/pastor-jair/historias/jesus-calma-la-tormenta.mp3',
    scenes: [
      {
        id: 'tor-1',
        title: 'Olas altas en el lago',
        visualTheme: 'storm',
        characterFocus: 'leon',
        narration: {
          '3-5': 'Los amigos de Jesús iban en un bote y empezó un viento muy fuerte con olas grandes.',
          '6-8': 'Mientras cruzaban el lago en una barca, se desató una tormenta fuerte. El agua entraba y los discípulos sintieron mucho miedo.',
          '9-12': 'Una tempestad repentina golpeó el mar de Galilea. Aunque eran pescadores expertos, los discípulos temieron hundirse en medio de las olas.',
        },
      },
      {
        id: 'tor-2',
        title: '¡Paz, cálmate!',
        visualTheme: 'sea',
        characterFocus: 'lucas',
        narration: {
          '3-5': 'Despertaron a Jesús, y con una palabra dulce y firme: «¡Cálmate!», el mar quedó lisito.',
          '6-8': 'Los discípulos despertaron a Jesús. Él se levantó, habló al viento y al mar diciendo: «¡Calla, enmudece!», y todo quedó en calma.',
          '9-12': 'Al escuchar el clamor de Sus amigos, Jesús se levantó con autoridad y ordenó al viento y al mar aquietarse. Al instante hubo gran bonanza.',
        },
      },
      {
        id: 'tor-3',
        title: 'Paz en nuestro corazón',
        visualTheme: 'rainbow',
        characterFocus: 'estrellita',
        narration: {
          '3-5': 'Todos sonrieron sorprendidos. Cuando tenemos miedo, Jesús también calma nuestro corazón.',
          '6-8': 'Asombrados, comprendieron que hasta el viento y el mar obedecen a Jesús. Con Él en nuestra vida tenemos verdadera paz.',
          '9-12': 'Jesús les preguntó: «¿Por qué tienen miedo? ¿Todavía no tienen fe?». Su poder sobre la naturaleza nos invita a confiar en Su paz.',
        },
      },
    ],
    learning: {
      '3-5': 'Cuando sientas miedo, llama a Jesús; Él llena tu corazón de calma.',
      '6-8': 'Jesús tiene poder sobre las tormentas del mar y también sobre los temores del corazón.',
      '9-12': 'La verdadera fe no es ausencia de tormentas, sino recordar que Jesús viaja en nuestra barca y gobierna sobre todo.',
    },
    questions: {
      '3-5': [
        {
          question: '¿Qué pasó cuando Jesús le habló a la tormenta?',
          options: ['El mar y el viento se calmaron al instante', 'Llovió más fuerte', 'El bote voló'],
          correctIndex: 0,
          explanation: '¡Sí! El viento y las olas obedecieron la voz de Jesús.',
        },
      ],
      '6-8': [
        {
          question: '¿Qué estaba haciendo Jesús antes de que lo despertaran en la barca?',
          options: ['Durmiendo tranquilo en la popa', 'Nadando en el lago', 'Pescando solo'],
          correctIndex: 0,
          explanation: '¡Correcto! Jesús descansaba en paz y luego calmó toda la tormenta.',
        },
      ],
      '9-12': [
        {
          question: '¿Qué nos enseña esta historia cuando atravesamos días difíciles?',
          options: [
            'Acudir a Jesús en oración sabiendo que Él nos da paz en medio de la prueba',
            'Evitar viajar en bote para siempre',
            'Resolver todo sin pedir ayuda a Dios',
          ],
          correctIndex: 0,
          explanation: '¡Excelente respuesta! Jesús es nuestro refugio y paz.',
        },
      ],
    },
  },
  {
    id: 'jesus-recibe-a-los-ninos',
    title: 'Jesús recibe a los niños',
    reference: 'Mateo 19:13–15 · Marcos 10:13–16',
    subtitle: 'Eres muy valioso y especial para Jesús',
    durationLabel: '3 min',
    rewardName: 'Corona de Amistad con Jesús',
    starsReward: 10,
    pastorAudioSlot: '/media/pastor-jair/historias/jesus-recibe-a-los-ninos.mp3',
    scenes: [
      {
        id: 'nin-1',
        title: 'Los niños corren a ver a Jesús',
        visualTheme: 'meadow',
        characterFocus: 'lucas',
        narration: {
          '3-5': 'Muchos niños corrían alegres con sus papás para saludar y abrazar a Jesús.',
          '6-8': 'Las familias llevaban a sus niños para que Jesús los bendijera. Algunos adultos pensaron que Jesús estaba muy ocupado.',
          '9-12': 'Padres y madres llevaron a sus hijos ante Jesús para que orara por ellos, pero los discípulos intentaron apartarlos pensando que interrumpían.',
        },
      },
      {
        id: 'nin-2',
        title: '«Dejen que los niños vengan a mí»',
        visualTheme: 'meadow',
        characterFocus: 'cordero',
        narration: {
          '3-5': 'Jesús sonrió y dijo: «¡Dejen que los niños vengan a mí! Yo los quiero muchísimo».',
          '6-8': 'Al ver eso, Jesús dijo con cariño: «Dejen que los niños vengan a mí, y no se lo impidan, porque el reino de los cielos es de quienes son como ellos».',
          '9-12': 'Jesús corrigió con firmeza y ternura a Sus discípulos, declarando que la fe sencilla y confiada de los niños es ejemplo para entrar al reino de Dios.',
        },
      },
      {
        id: 'nin-3',
        title: 'Abrazados y bendecidos por Jesús',
        visualTheme: 'rainbow',
        characterFocus: 'estrellita',
        narration: {
          '3-5': 'Jesús abrazó a cada niño, puso Su mano sobre ellos y los bendijo con alegría.',
          '6-8': 'Jesús tomó a los niños en Sus brazos y los bendijo uno por uno. ¡Tú también eres un tesoro muy amado para Él!',
          '9-12': 'Tomándolos en Sus brazos y bendiciéndolos, Jesús demostró que los niños no son solo el futuro, sino protagonistas amados de Su reino hoy.',
        },
      },
    ],
    learning: {
      '3-5': 'Jesús te ama, te escucha y siempre tiene tiempo para abrazarte.',
      '6-8': 'Nunca eres demasiado pequeño para ser amigo de Jesús y brillar con Su amor.',
      '9-12': 'Para Jesús eres sumamente importante: tu fe alegre, sincera y valiente tiene un valor inmenso en Su reino.',
    },
    questions: {
      '3-5': [
        {
          question: '¿Qué hizo Jesús cuando llegaron los niños?',
          options: ['Los recibió feliz, los abrazó y los bendijo', 'Les pidió que se fueran', 'Se quedó dormido'],
          correctIndex: 0,
          explanation: '¡Sí! Jesús recibió a todos los niños con brazos abiertos.',
        },
      ],
      '6-8': [
        {
          question: '¿Qué frase famosa dijo Jesús en esta historia?',
          options: [
            'Dejen que los niños vengan a mí',
            'Vuelvan cuando sean grandes',
            'No hagan ruido en el jardín',
          ],
          correctIndex: 0,
          explanation: '¡Exacto! ¡Jesús siempre abre Sus brazos para recibirte!',
        },
      ],
      '9-12': [
        {
          question: '¿Por qué dijo Jesús que el reino de Dios pertenece a quienes son como los niños?',
          options: [
            'Por su corazón humilde, confiado y lleno de amor sincero',
            'Porque a los niños les gustan los juguetes',
            'Porque corren muy rápido',
          ],
          correctIndex: 0,
          explanation: '¡Maravilloso! La confianza sencilla y pura es el tesoro del reino.',
        },
      ],
    },
  },
];
