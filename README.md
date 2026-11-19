# JAIRRESTAURA KIDS — Versión 1.0

**¡Pequeños exploradores, grandes aventuras con Jesús!**  
Aplicación educativa cristiana infantil en 3D creada por **JAIRRESTAURA – Pastor Jair Hernández**.

## Características Verificadas

- **Escenario 3D Interactivo (Three.js)**: Castillo iluminado, montañas, cascada animada, arcoíris, árboles instanciados y los 5 personajes en 3D (Lucas, Luna, León, Cordero y Estrellita) con soporte táctil móvil (`touch-action: none`).
- **10 Módulos Funcionales**: Reino de las Aventuras, Historias Bíblicas 3D, Planeta Musical, Laboratorio de Juegos, Fábrica de Creatividad, Mi Rincón con Dios, Mis Amigos del Reino, Misiones y Recompensas, Familia y Valores y El Pastor Jair Cuenta.
- **9 Historias Bíblicas**: Noé y el arca, David y Goliat, Daniel y los leones, José y sus hermanos, Moisés y el mar Rojo, Jonás, El nacimiento de Jesús, Jesús calma la tormenta y Jesús recibe a los niños.
- **8 Juegos Reales**: Memoria bíblica, Rompecabezas del Arca, Preguntas bíblicas por edad, Encuentra las diferencias con pistas, Ordena la historia, Busca los animales, Une las parejas y Tesoro de versículos.
- **Música Original**: 5 canciones infantiles cristianas con arreglos polifónicos en Web Audio API, pausa/reanudación en el segundo exacto, repetición y xilófono interactivo.
- **Seguridad Infantil**: Gratuito, sin registro, sin anuncios, sin chats, sin compras, sin rastreo ni recolección de datos personales. Espacio para padres protegido sin contraseña mediante verificación matemática.
- **PWA Instalable y Sin Conexión**: Configurada con `vite-plugin-pwa`, manifiesto Web App, íconos PNG/SVG y Service Worker.

## Incorporación de Material Auténtico del Pastor Jair

Coloca los archivos oficiales autorizados en `public/media/pastor-jair/`:

- Fotografía oficial: `public/media/pastor-jair/foto-autorizada.jpg`
- Audios de historias: `public/media/pastor-jair/historias/<id-historia>.mp3`
- Videos evangelísticos: `public/media/pastor-jair/videos/bienvenida.mp4` y `jesus-mejor-amigo.mp4`

## Comandos Locales

```bash
npm install
npm run lint
npm run build
npm run dev
```

## Publicación en GitHub (`jairrestaura-kids`) y Vercel

1. Inicializa Git y sube al repositorio `jairrestaura-kids`:

```bash
git init
git add .
git commit -m "JAIRRESTAURA KIDS v1.0 listo para publicación"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/jairrestaura-kids.git
git push -u origin main
```

2. Despliega en Vercel (plan gratuito Hobby, sin tarjeta de crédito ni servicios pagos):
   - Inicia sesión en Vercel con tu cuenta de GitHub.
   - Selecciona **Add New Project** → importa `jairrestaura-kids`.
   - Verifica **Framework Preset: Vite**, **Build Command: `npm run build`**, **Output Directory: `dist`**.
   - No agregues variables de entorno ni claves API (la aplicación funciona 100% sin claves externas).
   - Haz clic en **Deploy**.
