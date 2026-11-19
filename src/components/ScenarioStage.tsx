import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
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
    dayBg: number;
    nightBg: number;
    discovery: string;
  }
> = {
  ark: {
    name: 'El Arca de la Promesa',
    skyClass: 'from-sky-400 via-sky-200 to-emerald-200 dark:from-sky-950 dark:via-slate-800 dark:to-emerald-950',
    dayBg: 0x7dd3fc,
    nightBg: 0x0f172a,
    discovery: '¡Tocaste el arca 3D! Dios cuidó con amor a Noé, su familia y cada animalito.',
  },
  storm: {
    name: 'Barca en la Tormenta Calma',
    skyClass: 'from-slate-700 via-sky-800 to-indigo-950',
    dayBg: 0x334155,
    nightBg: 0x0f172a,
    discovery: '¡Paz en el mar! Cuando llamamos a Jesús, Su paz calma cualquier tormenta.',
  },
  valley: {
    name: 'Colinas del Castillo de Luz',
    skyClass: 'from-amber-200 via-sky-200 to-lime-200 dark:from-slate-900 dark:via-indigo-950 dark:to-emerald-950',
    dayBg: 0xbae6fd,
    nightBg: 0x1e1b4b,
    discovery: '¡Valle de aventura! El Señor camina contigo en cada paso que das.',
  },
  palace: {
    name: 'Palacio de la Valentía',
    skyClass: 'from-amber-300 via-orange-200 to-stone-200 dark:from-amber-950 dark:via-slate-900 dark:to-stone-950',
    dayBg: 0xfde68a,
    nightBg: 0x1c1917,
    discovery: '¡Corazón valiente! Como Daniel, podemos orar y confiar sin temor.',
  },
  sea: {
    name: 'Camino en el Mar Abierto',
    skyClass: 'from-cyan-400 via-sky-400 to-blue-700 dark:from-cyan-950 dark:via-sky-900 dark:to-blue-950',
    dayBg: 0x38bdf8,
    nightBg: 0x0c4a6e,
    discovery: '¡Camino milagroso! Dios abre senderos donde parecía imposible pasar.',
  },
  whale: {
    name: 'Océano del Gran Pez',
    skyClass: 'from-blue-600 via-cyan-600 to-teal-800 dark:from-slate-950 dark:via-blue-950 dark:to-teal-950',
    dayBg: 0x0284c7,
    nightBg: 0x082f49,
    discovery: '¡Gran rescate! Dios escucha nuestra oración incluso desde lo más profundo.',
  },
  star: {
    name: 'Cielo de la Estrella de Belén',
    skyClass: 'from-indigo-950 via-slate-900 to-amber-950',
    dayBg: 0x1e1b4b,
    nightBg: 0x090d1f,
    discovery: '¡Luz en la noche! Una estrella especial anunció el nacimiento de Jesús.',
  },
  meadow: {
    name: 'Pradera del Buen Pastor',
    skyClass: 'from-lime-200 via-emerald-200 to-sky-200 dark:from-emerald-950 dark:via-slate-900 dark:to-sky-950',
    dayBg: 0xbae6fd,
    nightBg: 0x064e3b,
    discovery: '¡Pradera de paz! El Buen Pastor cuida de ti con ternura cada día.',
  },
  rainbow: {
    name: 'Arcoíris de las Promesas',
    skyClass: 'from-sky-300 via-amber-100 to-emerald-200 dark:from-sky-950 dark:via-slate-900 dark:to-emerald-950',
    dayBg: 0x93c5fd,
    nightBg: 0x0f172a,
    discovery: '¡Arcoíris brillante! Cada color recuerda que Dios siempre cumple Sus promesas.',
  },
};

export const ScenarioStage: React.FC<ScenarioStageProps> = ({
  theme,
  title,
  character,
  expression = 'alegre',
  soundEnabled = true,
  darkMode = false,
  interactiveHint,
  heightClass = 'h-60 sm:h-72',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);
  const [discoveryMsg, setDiscoveryMsg] = useState<string | null>(null);
  const [sparkCount, setSparkCount] = useState(0);
  const pulseTimerRef = useRef(0);
  const darkModeRef = useRef(darkMode);
  const meta = THEME_META[theme];

  useEffect(() => {
    darkModeRef.current = darkMode;
  }, [darkMode]);

  useEffect(() => {
    setDiscoveryMsg(null);
  }, [theme]);

  const handleInteract = () => {
    pulseTimerRef.current = 1;
    setSparkCount((c) => c + 1);
    setDiscoveryMsg(meta.discovery);
    if (character) {
      audioEngine.playCharacterSound(character, soundEnabled);
    } else {
      audioEngine.playSparkleBurst(soundEnabled);
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const testCanvas = document.createElement('canvas');
        const gl = testCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'default',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 260;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFailed(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(darkModeRef.current ? meta.nightBg : meta.dayBg);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 80);
    camera.position.set(0, 3.6, 8.8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.0, 0);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = !isSoftwareGl;
    controls.minPolarAngle = 0.45;
    controls.maxPolarAngle = Math.PI * 0.46;

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    scene.add(new THREE.HemisphereLight(0xf0f9ff, 0x365314, 1.1));
    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.45);
    keyLight.position.set(6, 10, 7);
    scene.add(keyLight);

    // Diorama Circular Stage Plinth
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const baseColor =
      theme === 'ark' || theme === 'storm' || theme === 'whale'
        ? 0x0284c7
        : theme === 'sea'
        ? 0xfde68a
        : theme === 'star' || theme === 'palace'
        ? 0x334155
        : 0x4d7c0f;

    const plinth = new THREE.Mesh(
      track(new THREE.CylinderGeometry(3.8, 4.1, 0.45, 28)),
      track(new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.72 }))
    );
    plinth.position.y = -0.22;
    stageGroup.add(plinth);

    const heroActor = new THREE.Group();
    stageGroup.add(heroActor);

    // Build real 3D diorama meshes per story visualTheme
    if (theme === 'ark' || theme === 'storm') {
      const woodMat = track(new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.7 }));
      const roofMat = track(new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.65 }));
      const hull = new THREE.Mesh(track(new THREE.CylinderGeometry(1.15, 0.75, 2.8, 12)), woodMat);
      hull.rotation.z = Math.PI / 2;
      hull.scale.set(0.65, 1, 1.1);
      hull.position.y = 0.52;
      heroActor.add(hull);

      if (theme === 'ark') {
        const cabin = new THREE.Mesh(track(new THREE.BoxGeometry(1.7, 0.8, 1.1)), woodMat);
        cabin.position.y = 1.12;
        const roof = new THREE.Mesh(track(new THREE.ConeGeometry(1.15, 0.65, 4)), roofMat);
        roof.rotation.y = Math.PI / 4;
        roof.position.y = 1.82;
        heroActor.add(cabin, roof);
      } else {
        const mast = new THREE.Mesh(track(new THREE.CylinderGeometry(0.06, 0.08, 2.0, 8)), roofMat);
        mast.position.y = 1.45;
        const sail = new THREE.Mesh(
          track(new THREE.BoxGeometry(0.06, 1.15, 1.1)),
          track(new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.6 }))
        );
        sail.position.set(0.08, 1.65, 0);
        heroActor.add(mast, sail);
      }
    } else if (theme === 'sea') {
      const waterMat = track(
        new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.25, transparent: true, opacity: 0.86 })
      );
      const wallL = new THREE.Mesh(track(new THREE.BoxGeometry(1.5, 1.7, 3.8)), waterMat);
      wallL.position.set(-1.95, 0.85, 0);
      const wallR = new THREE.Mesh(track(new THREE.BoxGeometry(1.5, 1.7, 3.8)), waterMat);
      wallR.position.set(1.95, 0.85, 0);
      const beacon = new THREE.Mesh(
        track(new THREE.OctahedronGeometry(0.45, 0)),
        track(new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xf59e0b, emissiveIntensity: 0.8 }))
      );
      beacon.position.set(0, 1.65, -0.5);
      heroActor.add(wallL, wallR, beacon);
    } else if (theme === 'whale') {
      const whaleMat = track(new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.35 }));
      const body = new THREE.Mesh(track(new THREE.SphereGeometry(1.25, 18, 14)), whaleMat);
      body.scale.set(1.55, 0.82, 0.92);
      body.position.y = 0.72;
      const tail = new THREE.Mesh(track(new THREE.ConeGeometry(0.75, 1.1, 4)), whaleMat);
      tail.rotation.z = -Math.PI / 2;
      tail.position.set(1.95, 1.15, 0);
      const spout = new THREE.Mesh(
        track(new THREE.TorusGeometry(0.32, 0.08, 8, 18, Math.PI)),
        track(new THREE.MeshBasicMaterial({ color: 0xbae6fd }))
      );
      spout.position.set(-0.5, 1.9, 0);
      heroActor.add(body, tail, spout);
    } else if (theme === 'palace') {
      const stoneMat = track(new THREE.MeshStandardMaterial({ color: 0xf5f0e6, roughness: 0.6 }));
      const goldMat = track(new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.25 }));
      [-1.55, 1.55].forEach((px) => {
        const col = new THREE.Mesh(track(new THREE.CylinderGeometry(0.28, 0.32, 2.3, 12)), stoneMat);
        col.position.set(px, 1.15, -0.4);
        heroActor.add(col);
      });
      const arch = new THREE.Mesh(track(new THREE.BoxGeometry(3.8, 0.42, 0.8)), stoneMat);
      arch.position.set(0, 2.35, -0.4);
      const angelOrb = new THREE.Mesh(
        track(new THREE.OctahedronGeometry(0.45, 0)),
        track(new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfacc15, emissiveIntensity: 1.1 }))
      );
      angelOrb.position.set(0, 1.25, 0.35);
      const crest = new THREE.Mesh(track(new THREE.TorusGeometry(0.65, 0.09, 8, 22)), goldMat);
      crest.position.set(0, 1.25, 0.35);
      heroActor.add(arch, angelOrb, crest);
    } else if (theme === 'star') {
      const stableMat = track(new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 }));
      const postL = new THREE.Mesh(track(new THREE.BoxGeometry(0.2, 1.5, 0.2)), stableMat);
      postL.position.set(-1.1, 0.75, 0);
      const postR = new THREE.Mesh(track(new THREE.BoxGeometry(0.2, 1.5, 0.2)), stableMat);
      postR.position.set(1.1, 0.75, 0);
      const roof = new THREE.Mesh(track(new THREE.ConeGeometry(1.8, 0.85, 4)), stableMat);
      roof.rotation.y = Math.PI / 4;
      roof.position.set(0, 1.8, 0);
      const star = new THREE.Mesh(
        track(new THREE.OctahedronGeometry(0.55, 0)),
        track(new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfef08a, emissiveIntensity: 1.4 }))
      );
      star.position.set(0, 2.75, 0);
      heroActor.add(postL, postR, roof, star);
    } else {
      // valley / meadow / rainbow
      const hillMat = track(new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.75 }));
      const hill = new THREE.Mesh(track(new THREE.SphereGeometry(1.6, 16, 12)), hillMat);
      hill.scale.set(1.6, 0.45, 1.2);
      hill.position.set(0, 0.2, -0.4);
      heroActor.add(hill);

      if (theme === 'rainbow') {
        const rbColors = [0xef4444, 0xf97316, 0xfacc15, 0x22c55e, 0x0ea5e9, 0x8b5cf6];
        rbColors.forEach((hex, idx) => {
          const arc = new THREE.Mesh(
            track(new THREE.TorusGeometry(2.55 - idx * 0.14, 0.06, 8, 32, Math.PI)),
            track(new THREE.MeshBasicMaterial({ color: hex }))
          );
          arc.position.set(0, 0.15, -0.5);
          heroActor.add(arc);
        });
      } else {
        const castleKeep = new THREE.Mesh(
          track(new THREE.BoxGeometry(1.4, 1.4, 1.1)),
          track(new THREE.MeshStandardMaterial({ color: 0xf5f0e6, roughness: 0.65 }))
        );
        castleKeep.position.set(0, 1.0, -0.4);
        const spire = new THREE.Mesh(
          track(new THREE.ConeGeometry(0.75, 1.0, 12)),
          track(new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 }))
        );
        spire.position.set(0, 2.15, -0.4);
        heroActor.add(castleKeep, spire);
      }
    }

    // Floating sparkle crown orb
    const sparkleOrb = new THREE.Mesh(
      track(new THREE.OctahedronGeometry(0.18, 0)),
      track(new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfacc15, emissiveIntensity: 1 }))
    );
    sparkleOrb.position.set(-2.3, 1.85, 0.8);
    stageGroup.add(sparkleOrb);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 560;
      const h = container.clientHeight || 260;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let frameId = 0;
    let disposed = false;
    const startMs = performance.now();
    let lastMs = startMs;

    function tick() {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - lastMs) / 1000, 0.1);
      lastMs = now;
      const t = (now - startMs) / 1000;

      if (pulseTimerRef.current > 0) {
        pulseTimerRef.current = Math.max(0, pulseTimerRef.current - dt * 1.5);
      }
      const boost = Math.sin(pulseTimerRef.current * Math.PI) * 0.35;

      stageGroup.rotation.y = Math.sin(t * 0.45) * 0.25;
      heroActor.position.y =
        (theme === 'ark' || theme === 'storm' || theme === 'whale' ? Math.sin(t * 1.8) * 0.12 : 0) +
        boost;
      heroActor.rotation.z = theme === 'storm' ? Math.sin(t * 2.4) * 0.08 : 0;

      sparkleOrb.position.y = 1.8 + Math.sin(t * 2.6) * 0.22;
      sparkleOrb.rotation.y = t * 1.8;

      if (scene.background instanceof THREE.Color) {
        scene.background.setHex(darkModeRef.current ? meta.nightBg : meta.dayBg);
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        frameId = window.setTimeout(tick, 90);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme, meta.dayBg, meta.nightBg]);

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
      aria-label={`Escenario 3D interactivo: ${title || meta.name}. Arrastra para girar o toca para descubrir un mensaje`}
      className={`group relative ${heightClass} w-full cursor-pointer overflow-hidden rounded-3xl border-2 border-white/60 bg-gradient-to-b ${meta.skyClass} shadow-md transition-transform duration-200 hover:shadow-lg dark:border-slate-700`}
    >
      {webglFailed ? (
        <div className="flex h-full w-full items-center justify-center p-6 text-center text-sm font-bold text-stone-800 dark:text-stone-100">
          Escena ilustrada: {title || meta.name}
        </div>
      ) : (
        <div ref={mountRef} className="h-full w-full touch-none" />
      )}

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
          <span className="truncate max-w-[260px] sm:max-w-md">
            Escena 3D · {title || meta.name}
          </span>
        </div>
      </div>

      {/* Bottom Discovery Banner */}
      <div className="pointer-events-none absolute bottom-3 left-3.5 max-w-[70%] sm:max-w-md">
        <div className="rounded-2xl bg-stone-950/80 px-3.5 py-2 text-xs font-semibold text-white shadow">
          {discoveryMsg || interactiveHint || 'Arrastra en 3D o toca la escena para descubrir una enseñanza'}
        </div>
      </div>
    </div>
  );
};
