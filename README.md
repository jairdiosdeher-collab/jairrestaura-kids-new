# JAIRRESTAURA KIDS

**¡Pequeños exploradores, grandes aventuras con Jesús!**  
Aplicación educativa cristiana infantil en 3D creada por **JAIRRESTAURA – Pastor Psicólogo Jair Hernández**.

Repositorio oficial: `https://github.com/jairdiosdeher-collab/jairrestaura-kids-new`

---

## Características Verificadas

- **Reino de Aventuras en Three.js (`Kingdom3DScene`)**: Escenario 3D interactivo con cielo en degradado día/noche, sol con corona luminosa o luna con luciérnagas nocturnas, montañas en capas, cascada animada, arcoíris, aves en vuelo, arbustos y árboles instanciados, castillo iluminado, onda dorada al tocar el terreno y los 5 personajes en 3D (**Lucas, Luna, León, Cordero y Estrellita**) con soporte táctil (`touch-action: none`) y controles colapsables de cámara/zoom.
- **Historias Bíblicas con Dioramas 3D Ligeros (`ScenarioStage`)**: Escenarios 3D reales en Three.js para las 9 historias bíblicas, con órbita táctil, partículas de brillo al tocar y respaldo ilustrado únicamente si el dispositivo carece de WebGL. Incluye **Lectura Guiada Interactiva con campanas suaves** cuando el navegador no dispone de voces en español.
- **10 Módulos Funcionales y Conectados**: Reino 3D, Historias Bíblicas, Planeta Musical, Laboratorio de Juegos, Fábrica de Creatividad, Mi Rincón con Dios, Mis Amigos del Reino, Misiones y Recompensas, Familia y Valores y El Pastor Jair Cuenta.
- **Música Cristiana Infantil Transparente**: 5 composiciones extendidas (`60–64 s`) con estructura completa (*Estrofa 1, Coro, Estrofa 2, Puente y Final*) y arreglo multicapa en **Web Audio API** (identificadas explícitamente como instrumentales sintetizados, con espacio preparado para grabaciones reales en `public/media/musica/<id>.mp3`). Incluye Play, Pausa exacta, Detener, Repetición y Xilófono Interactivo.
- **8 Juegos Bíblicos Reales**: Memoria bíblica, Rompecabezas del Arca con guía de iconos, Preguntas bíblicas por edad (requiere mínimo 60% de aciertos para ganar estrellas), Encuentra las diferencias con pistas, Ordena la historia, Busca los animales, Une las parejas y Tesoro de versículos.
- **Seguridad Infantil y Progreso Honestos**: Gratuito, sin cuentas, sin publicidad, sin chats, sin compras, sin rastreo ni recopilación de datos personales. Inicia desde `0 ★` reales en `localStorage` y el Espacio para Padres utiliza verificación matemática sin contraseñas.
- **PWA Instalable y Sin Conexión**: Configurada con `vite-plugin-pwa`, manifiesto Web App, íconos PNG/SVG y Service Worker.

---

## Incorporación de Material Auténtico del Pastor Jair y Música Real

Coloca archivos oficiales autorizados en `public/media/` (nunca se simulan ni fabrican grabaciones ni fotografías personales):

- **Fotografía oficial del Pastor Jair**: `public/media/pastor-jair/foto-autorizada.jpg`
- **Audios reales de historias**: `public/media/pastor-jair/historias/<id-historia>.mp3`
- **Videos evangelísticos**: `public/media/pastor-jair/videos/bienvenida.mp4` y `jesus-mejor-amigo.mp4`
- **Grabaciones musicales vocales reales (opcional)**: `public/media/musica/<id-cancion>.mp3`

---

## Notas Técnicas (`package.json` y `dev-dist/`)

- `dev-dist/` contiene el Service Worker temporal generado automáticamente por `vite-plugin-pwa` cuando `devOptions.enabled` está activo en modo desarrollo (`npm run dev`). Está excluido en `.gitignore` y no se incluye en el build de producción (`dist/`).
- `package.json` conserva `express`, `dotenv`, `@google/genai` y `motion` heredados de la plantilla base de despliegue sin afectar el bundle de cliente (Vite realiza tree-shaking y excluye dependencias no importadas de `dist/`).

---

## Comandos Locales

```bash
npm install
npx tsc --noEmit
npm run build
npm run dev
```

---

## Flujo de Ramas Git y Publicación en `jairrestaura-kids-new` + Vercel

Trabaja siempre sobre una rama evolutiva y protege las ramas principales y de respaldo:

- Rama de producción estable: `main`
- Ramas de respaldo protegidas: `backup/pre-fase-2-2026-11-19`, `respaldo-fase1-v1`, `respaldo-fase2`
- Rama de desarrollo actual: `evolucion/jairrestaura-kids-pro`

1. Sube cambios revisados únicamente a tu rama de trabajo en `https://github.com/jairdiosdeher-collab/jairrestaura-kids-new`:

```bash
git remote -v
# Debe apuntar a https://github.com/jairdiosdeher-collab/jairrestaura-kids-new.git
git add .
git commit -m "Auditoria y mejoras integrales JAIRRESTAURA KIDS"
git push -u origin evolucion/jairrestaura-kids-pro
```

2. Una vez aprobada la revisión, integra en Vercel (plan gratuito Hobby, sin tarjeta ni servicios pagos) sobre el proyecto conectado a `https://github.com/jairdiosdeher-collab/jairrestaura-kids-new`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Variables de entorno / API keys**: ninguna requerida (funciona 100% sin claves externas).
