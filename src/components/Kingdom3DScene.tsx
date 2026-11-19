import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ChevronDown,
  ChevronUp,
  Compass,
  Eye,
  Moon,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { CharacterId, ModuleId } from '../types/app';
import { ASSET_IMAGES } from '../data/modulesData';
import { audioEngine } from '../services/audioEngine';

interface Kingdom3DSceneProps {
  darkMode: boolean;
  soundEnabled: boolean;
  ambientPlaying: boolean;
  activeCharacter?: CharacterId;
  onToggleAmbient: () => void;
  onSelectCharacter: (character: CharacterId) => void;
  onSelectModule: (moduleId: ModuleId) => void;
}

type CameraPresetId = 'overview' | 'castle' | 'waterfall' | 'garden' | 'starlight';

interface CameraPreset {
  id: CameraPresetId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

const CAMERA_PRESETS: CameraPreset[] = [
  { id: 'overview', label: 'Todo el Reino', position: [0, 8.8, 22.4], target: [0, 1.8, 0] },
  { id: 'castle', label: 'Castillo de Luz', position: [6.4, 6.8, 12.2], target: [0, 3.8, -2.5] },
  { id: 'waterfall', label: 'Cascada Musical', position: [-10.8, 6.2, 11.4], target: [-7.2, 2.5, -2.5] },
  { id: 'garden', label: 'Jardín y Amigos', position: [3.8, 4.4, 12.2], target: [0.2, 1.3, 3.4] },
  { id: 'starlight', label: 'Arcoíris y Nubes', position: [0, 12.8, 25], target: [0, 5.2, -3] },
];

// Reusable module-scope math objects (Zero per-frame GC allocations)
const _vec3 = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _dummy = new THREE.Object3D();
const _color = new THREE.Color();

function groundHeightAt(x: number, z: number): number {
  const castleHill = Math.exp(-((x * x + (z + 2.5) * (z + 2.5)) / 34)) * 1.45;
  const westPeak = Math.exp(-(((x + 9.5) ** 2 + (z + 4.5) ** 2) / 26)) * 1.1;
  const gentleRoll = Math.sin(x * 0.16) * Math.cos(z * 0.14) * 0.25;
  return castleHill + westPeak + gentleRoll;
}

function createWaterfallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 128, 0);
    grad.addColorStop(0, '#0284c7');
    grad.addColorStop(0.5, '#38bdf8');
    grad.addColorStop(1, '#0ea5e9');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 256);

    // Animated white foam streaks
    for (let i = 0; i < 48; i++) {
      const x = (i * 23) % 120;
      const y = (i * 41) % 240;
      const h = 18 + (i % 4) * 10;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(240, 249, 255, 0.72)' : 'rgba(186, 230, 253, 0.52)';
      ctx.fillRect(x, y, 5 + (i % 3) * 2, h);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const Kingdom3DScene: React.FC<Kingdom3DSceneProps> = ({
  darkMode,
  soundEnabled,
  ambientPlaying,
  activeCharacter = 'lucas',
  onToggleAmbient,
  onSelectCharacter,
  onSelectModule,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activePreset, setActivePreset] = useState<CameraPresetId>('overview');
  const [controlsCollapsed, setControlsCollapsed] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );
  const [webglFailed, setWebglFailed] = useState(false);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  const presetRef = useRef<CameraPreset>(CAMERA_PRESETS[0]);
  const isTransitioningRef = useRef(false);
  const darkModeRef = useRef(darkMode);
  const syncThemeRef = useRef<((isNight: boolean) => void) | null>(null);
  const soundRef = useRef(soundEnabled);
  const activeCharRef = useRef<CharacterId>(activeCharacter);
  const charJumpTimersRef = useRef<Record<CharacterId, number>>({
    lucas: 0,
    luna: 0,
    leon: 0,
    cordero: 0,
    estrellita: 0,
  });
  const onCharacterRef = useRef(onSelectCharacter);
  const onModuleRef = useRef(onSelectModule);

  useEffect(() => {
    darkModeRef.current = darkMode;
    syncThemeRef.current?.(darkMode);
  }, [darkMode]);

  useEffect(() => {
    soundRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    activeCharRef.current = activeCharacter;
    charJumpTimersRef.current[activeCharacter] = 1.0;
  }, [activeCharacter]);

  useEffect(() => {
    onCharacterRef.current = onSelectCharacter;
  }, [onSelectCharacter]);

  useEffect(() => {
    onModuleRef.current = onSelectModule;
  }, [onSelectModule]);

  const selectPreset = (preset: CameraPreset) => {
    setActivePreset(preset.id);
    presetRef.current = preset;
    isTransitioningRef.current = true;
    audioEngine.playChime(soundRef.current);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Software WebGL probe per Three.js guidelines
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
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 540;
    const isCompactViewport = width < 768;

    renderer.setSize(width, height);
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, isCompactViewport ? 1.5 : 1.75)
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFailed(true);
    };
    const onContextRestored = () => setWebglFailed(false);
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const scene = new THREE.Scene();
    const daySky = new THREE.Color(0x93c5fd);
    const nightSky = new THREE.Color(0x0f172a);
    scene.background = (darkModeRef.current ? nightSky : daySky).clone();
    scene.fog = new THREE.FogExp2(darkModeRef.current ? 0x0f172a : 0xbae6fd, 0.0135);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 180);
    camera.position.set(...CAMERA_PRESETS[0].position);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS[0].target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI * 0.465;
    controls.minPolarAngle = 0.22;
    controls.minDistance = 7.5;
    controls.maxDistance = 33;
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    controls.addEventListener('start', () => {
      isTransitioningRef.current = false;
    });

    // Warm/cool lighting rig
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x3f6212, 0.95);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff1d6, 1.85);
    sunLight.position.set(16, 22, 14);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.left = -19;
    sunLight.shadow.camera.right = 19;
    sunLight.shadow.camera.top = 19;
    sunLight.shadow.camera.bottom = -19;
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 55;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x7dd3fc, 0.6);
    rimLight.position.set(-14, 10, -14);
    scene.add(rimLight);

    // Disposable tracker
    const disposables: { dispose: () => void }[] = [envTarget];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    const interactiveTargets: THREE.Object3D[] = [];
    const registerClickable = (
      obj: THREE.Object3D,
      label: string,
      action: () => void
    ) => {
      obj.userData.label = label;
      obj.userData.onAction = action;
      interactiveTargets.push(obj);
    };

    // 1. Terrain with sunlit meadow + golden cobblestone path
    const terrainGeo = track(new THREE.PlaneGeometry(80, 80, 64, 64));
    terrainGeo.rotateX(-Math.PI / 2);
    const posAttr = terrainGeo.attributes.position;
    const colors = new Float32Array(posAttr.count * 3);
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const y = groundHeightAt(x, z);
      posAttr.setY(i, y);

      const onPath = Math.abs(x - Math.sin(z * 0.22) * 1.4) < 1.38 && z > -1 && z < 16;
      if (onPath) {
        _color.setHex(0xf3e2c0);
      } else if (y > 1.25) {
        _color.setHex(0x65a30d);
      } else {
        _color.setHex(0x4d7c0f);
      }
      colors[i * 3] = _color.r;
      colors[i * 3 + 1] = _color.g;
      colors[i * 3 + 2] = _color.b;
    }
    terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    terrainGeo.computeVertexNormals();

    const terrainMat = track(
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.9,
        metalness: 0.02,
      })
    );
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // 2. Sky Bodies: Day Sun, Night Moon & Twinkling Stars
    const sunOrb = new THREE.Mesh(
      track(new THREE.SphereGeometry(1.75, 20, 20)),
      track(
        new THREE.MeshBasicMaterial({
          color: 0xfef08a,
        })
      )
    );
    sunOrb.position.set(15, 17.5, -18);
    scene.add(sunOrb);

    const moonOrb = new THREE.Mesh(
      track(new THREE.SphereGeometry(1.35, 20, 20)),
      track(
        new THREE.MeshBasicMaterial({
          color: 0xf8fafc,
        })
      )
    );
    moonOrb.position.set(-14, 16, -20);
    moonOrb.visible = darkModeRef.current;
    scene.add(moonOrb);

    const starCount = 85;
    const starGeo = track(new THREE.OctahedronGeometry(0.14, 0));
    const starMat = track(
      new THREE.MeshBasicMaterial({
        color: 0xfef9c3,
        transparent: true,
        opacity: 0.9,
      })
    );
    const starField = new THREE.InstancedMesh(starGeo, starMat, starCount);
    for (let i = 0; i < starCount; i++) {
      const angle = (i / starCount) * Math.PI * 2;
      const radius = 18 + (i % 7) * 3.8;
      _dummy.position.set(
        Math.cos(angle) * radius,
        12 + (i % 5) * 2.8,
        Math.sin(angle) * radius - 8
      );
      const sc = 0.65 + (i % 4) * 0.28;
      _dummy.scale.setScalar(sc);
      _dummy.updateMatrix();
      starField.setMatrixAt(i, _dummy.matrix);
    }
    starField.computeBoundingSphere();
    starField.visible = darkModeRef.current;
    scene.add(starField);

    // 3. Animated Fluffy Clouds
    interface CloudActor {
      group: THREE.Group;
      baseY: number;
      speed: number;
      bounce: number;
    }
    const cloudMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.85,
        metalness: 0.0,
      })
    );
    const clouds: CloudActor[] = [];
    const cloudDefs = [
      { x: -13, y: 11.2, z: -11, s: 1.1, speed: 0.55 },
      { x: -3, y: 12.6, z: -14, s: 1.35, speed: 0.38 },
      { x: 8, y: 10.8, z: -10, s: 1.0, speed: 0.48 },
      { x: 16, y: 12.2, z: -15, s: 1.2, speed: 0.42 },
      { x: -19, y: 11.8, z: -6, s: 0.9, speed: 0.6 },
    ];
    cloudDefs.forEach((cd, idx) => {
      const grp = new THREE.Group();
      const puffs = [
        [0, 0, 0, 1.05],
        [-0.95, -0.15, 0.1, 0.78],
        [0.95, -0.12, -0.1, 0.82],
        [0.35, 0.42, 0.15, 0.74],
      ];
      puffs.forEach(([px, py, pz, r]) => {
        const puff = new THREE.Mesh(track(new THREE.SphereGeometry(r, 12, 12)), cloudMat);
        puff.position.set(px, py, pz);
        grp.add(puff);
      });
      grp.position.set(cd.x, cd.y, cd.z);
      grp.scale.setScalar(cd.s);
      scene.add(grp);

      const actor: CloudActor = { group: grp, baseY: cd.y, speed: cd.speed, bounce: 0 };
      clouds.push(actor);
      registerClickable(grp, `Nube esponjosa #${idx + 1}`, () => {
        actor.bounce = 1;
        audioEngine.playSparkleBurst(soundRef.current);
      });
    });

    // 4. Illuminated Castle with Fluttering Pennants
    const castleGroup = new THREE.Group();
    const castleY = groundHeightAt(0, -2.5);
    castleGroup.position.set(0, castleY, -2.5);

    const stoneMat = track(
      new THREE.MeshStandardMaterial({ color: 0xf5f0e6, roughness: 0.72, metalness: 0.04 })
    );
    const goldMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.24,
        metalness: 0.85,
        emissive: 0x78350f,
        emissiveIntensity: 0.25,
      })
    );
    const roofMat = track(
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.18 })
    );
    const bannerMat = track(
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.55, side: THREE.DoubleSide })
    );
    const glowWindowMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xfbbf24,
        emissiveIntensity: 1.5,
        roughness: 0.2,
      })
    );

    const plinth = new THREE.Mesh(track(new THREE.CylinderGeometry(4.3, 4.9, 0.85, 16)), stoneMat);
    plinth.position.y = 0.42;
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    castleGroup.add(plinth);

    const frontSteps = new THREE.Mesh(track(new THREE.BoxGeometry(2.1, 0.45, 1.3)), goldMat);
    frontSteps.position.set(0, 0.22, 4.2);
    castleGroup.add(frontSteps);

    const keep = new THREE.Mesh(track(new THREE.BoxGeometry(4.3, 3.3, 3.7)), stoneMat);
    keep.position.y = 2.25;
    keep.castShadow = true;
    keep.receiveShadow = true;
    castleGroup.add(keep);

    const centerTower = new THREE.Mesh(track(new THREE.CylinderGeometry(1.18, 1.34, 4.9, 16)), stoneMat);
    centerTower.position.set(0, 3.45, -0.2);
    centerTower.castShadow = true;
    castleGroup.add(centerTower);

    const centerSpire = new THREE.Mesh(track(new THREE.ConeGeometry(1.5, 2.4, 16)), roofMat);
    centerSpire.position.set(0, 7.0, -0.2);
    centerSpire.castShadow = true;
    castleGroup.add(centerSpire);

    const beaconRing = new THREE.Mesh(track(new THREE.TorusGeometry(0.48, 0.1, 10, 20)), goldMat);
    beaconRing.position.set(0, 8.4, -0.2);
    castleGroup.add(beaconRing);

    const flags: THREE.Mesh[] = [];
    const turretCoords: [number, number][] = [
      [-2.35, 1.85],
      [2.35, 1.85],
      [-2.35, -1.85],
      [2.35, -1.85],
    ];
    turretCoords.forEach(([tx, tz]) => {
      const tBody = new THREE.Mesh(track(new THREE.CylinderGeometry(0.66, 0.76, 3.7, 12)), stoneMat);
      tBody.position.set(tx, 2.15, tz);
      tBody.castShadow = true;
      castleGroup.add(tBody);

      const tCone = new THREE.Mesh(track(new THREE.ConeGeometry(0.86, 1.55, 12)), roofMat);
      tCone.position.set(tx, 4.65, tz);
      tCone.castShadow = true;
      castleGroup.add(tCone);

      const pole = new THREE.Mesh(track(new THREE.CylinderGeometry(0.03, 0.03, 0.85, 6)), goldMat);
      pole.position.set(tx, 5.75, tz);
      castleGroup.add(pole);

      const pennant = new THREE.Mesh(track(new THREE.ConeGeometry(0.18, 0.55, 4)), bannerMat);
      pennant.rotation.z = -Math.PI / 2;
      pennant.position.set(tx + 0.28, 5.95, tz);
      castleGroup.add(pennant);
      flags.push(pennant);
    });

    const gate = new THREE.Mesh(track(new THREE.BoxGeometry(1.28, 1.75, 0.34)), goldMat);
    gate.position.set(0, 1.5, 1.85);
    castleGroup.add(gate);

    const roseWindow = new THREE.Mesh(track(new THREE.CircleGeometry(0.5, 18)), glowWindowMat);
    roseWindow.position.set(0, 3.25, 1.88);
    castleGroup.add(roseWindow);

    scene.add(castleGroup);
    registerClickable(castleGroup, 'Castillo de Historias Bíblicas 3D', () => {
      audioEngine.playSparkleBurst(soundRef.current);
      onModuleRef.current('stories');
    });

    // 5. Mountains + Flowing Waterfall Texture + Splashing Droplets
    const mountainGroup = new THREE.Group();
    const rockMat = track(
      new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.86, metalness: 0.05 })
    );
    const snowCapMat = track(
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.65, metalness: 0.05 })
    );

    const peaks = [
      { x: -11, z: -7, r: 4.5, h: 7.5 },
      { x: -7.5, z: -9.5, r: 5.2, h: 9.2 },
      { x: 10.5, z: -9, r: 4.8, h: 8.4 },
    ];
    peaks.forEach((p) => {
      const mMesh = new THREE.Mesh(track(new THREE.ConeGeometry(p.r, p.h, 8)), rockMat);
      mMesh.position.set(p.x, p.h * 0.45, p.z);
      mMesh.castShadow = true;
      mMesh.receiveShadow = true;
      mountainGroup.add(mMesh);

      const cap = new THREE.Mesh(track(new THREE.ConeGeometry(p.r * 0.36, p.h * 0.32, 8)), snowCapMat);
      cap.position.set(p.x, p.h * 0.78, p.z);
      mountainGroup.add(cap);
    });

    const waterfallTexture = track(createWaterfallTexture());
    waterfallTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const waterfallMat = track(
      new THREE.MeshStandardMaterial({
        map: waterfallTexture,
        emissive: 0x0284c7,
        emissiveIntensity: 0.35,
        roughness: 0.16,
        transparent: true,
        opacity: 0.92,
      })
    );
    const lagoonMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        emissive: 0x0369a1,
        emissiveIntensity: 0.22,
        roughness: 0.12,
        metalness: 0.1,
        clearcoat: 1,
        transparent: true,
        opacity: 0.88,
      })
    );

    const waterfall = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.95, 1.32, 5.4, 14, 8, true)),
      waterfallMat
    );
    waterfall.position.set(-8.6, 2.75, -4.4);
    waterfall.rotation.x = 0.24;
    mountainGroup.add(waterfall);

    const lagoonGeo = track(new THREE.CircleGeometry(4.0, 28));
    lagoonGeo.rotateX(-Math.PI / 2);
    const lagoon = new THREE.Mesh(lagoonGeo, lagoonMat);
    lagoon.position.set(-7.8, 0.36, -1.6);
    lagoon.receiveShadow = true;
    mountainGroup.add(lagoon);

    const foamRingMat = track(
      new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.7 })
    );
    const foamRing = new THREE.Mesh(track(new THREE.TorusGeometry(1.45, 0.09, 8, 24)), foamRingMat);
    foamRing.rotation.x = Math.PI / 2;
    foamRing.position.set(-8.1, 0.4, -2.9);
    mountainGroup.add(foamRing);

    // Instanced splash droplets at waterfall base
    const dropletCount = 24;
    const dropletGeo = track(new THREE.SphereGeometry(0.11, 6, 6));
    const dropletMat = track(
      new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.82 })
    );
    const droplets = new THREE.InstancedMesh(dropletGeo, dropletMat, dropletCount);
    droplets.frustumCulled = false;
    mountainGroup.add(droplets);

    scene.add(mountainGroup);
    registerClickable(mountainGroup, 'Cascada del Planeta Musical', () => {
      audioEngine.playSparkleBurst(soundRef.current);
      onModuleRef.current('music');
    });

    // 6. Radiant Rainbow Arch (Interactive to Missions)
    const rainbowGroup = new THREE.Group();
    const rainbowColors = [0xef4444, 0xf97316, 0xfacc15, 0x22c55e, 0x06b6d4, 0x3b82f6, 0x8b5cf6];
    const rainbowMats: THREE.MeshBasicMaterial[] = [];
    rainbowColors.forEach((hex, idx) => {
      const rMat = track(
        new THREE.MeshBasicMaterial({
          color: hex,
          transparent: true,
          opacity: 0.78,
        })
      );
      rainbowMats.push(rMat);
      const rGeo = track(new THREE.TorusGeometry(10.8 - idx * 0.27, 0.13, 8, 48, Math.PI));
      const arc = new THREE.Mesh(rGeo, rMat);
      rainbowGroup.add(arc);
    });
    rainbowGroup.position.set(0, 1.4, -6.6);
    scene.add(rainbowGroup);
    registerClickable(rainbowGroup, 'Arcoíris de Promesas · Misiones', () => {
      audioEngine.playSparkleBurst(soundRef.current);
      onModuleRef.current('missions');
    });

    // 7. Instanced Trees + Instanced Colorful Garden Flowers
    const treeCount = 26;
    const trunkGeo = track(new THREE.CylinderGeometry(0.16, 0.24, 1.35, 8));
    const trunkMat = track(new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 }));
    const foliageGeo = track(new THREE.ConeGeometry(0.98, 2.25, 8));
    const foliageMat = track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.76 }));

    const trunkInst = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount);
    const foliageInst = new THREE.InstancedMesh(foliageGeo, foliageMat, treeCount);
    trunkInst.castShadow = !isSoftwareGl;
    foliageInst.castShadow = !isSoftwareGl;

    for (let i = 0; i < treeCount; i++) {
      const angle = (i / treeCount) * Math.PI * 2;
      const radius = 8.8 + (i % 4) * 3.1;
      const tx = Math.cos(angle) * radius;
      const tz = Math.sin(angle) * radius * 0.78 - 1;
      const safeX = Math.abs(tx) < 2.6 && tz > 1.5 ? tx + 3.6 : tx;
      const ty = groundHeightAt(safeX, tz);
      const scale = 0.85 + (i % 5) * 0.1;

      _dummy.position.set(safeX, ty + 0.65 * scale, tz);
      _dummy.scale.set(scale, scale, scale);
      _dummy.rotation.set(0, 0, 0);
      _dummy.updateMatrix();
      trunkInst.setMatrixAt(i, _dummy.matrix);

      _dummy.position.set(safeX, ty + 1.95 * scale, tz);
      _dummy.updateMatrix();
      foliageInst.setMatrixAt(i, _dummy.matrix);

      _color.setHSL(0.28 + (i % 4) * 0.025, 0.68, 0.36 + (i % 3) * 0.05);
      foliageInst.setColorAt(i, _color);
    }
    trunkInst.computeBoundingSphere();
    foliageInst.computeBoundingSphere();
    if (foliageInst.instanceColor) foliageInst.instanceColor.needsUpdate = true;
    scene.add(trunkInst);
    scene.add(foliageInst);

    // Instanced Meadow Flowers
    const flowerCount = 46;
    const flowerGeo = track(new THREE.CylinderGeometry(0.18, 0.08, 0.24, 6));
    const flowerMat = track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }));
    const flowerInst = new THREE.InstancedMesh(flowerGeo, flowerMat, flowerCount);
    const flowerPalette = [0xf43f5e, 0xfacc15, 0xec4899, 0x38bdf8, 0xa855f7, 0xfb923c];
    for (let i = 0; i < flowerCount; i++) {
      const a = (i / flowerCount) * Math.PI * 2 + 0.3;
      const r = 4.6 + (i % 5) * 1.45;
      const fx = Math.cos(a) * r;
      const fz = Math.sin(a) * r * 0.8 + 1.2;
      const safeX = Math.abs(fx) < 1.5 ? fx + (fx >= 0 ? 1.8 : -1.8) : fx;
      const fy = groundHeightAt(safeX, fz);
      _dummy.position.set(safeX, fy + 0.14, fz);
      _dummy.scale.setScalar(0.8 + (i % 3) * 0.22);
      _dummy.rotation.set(0, a, 0);
      _dummy.updateMatrix();
      flowerInst.setMatrixAt(i, _dummy.matrix);
      _color.setHex(flowerPalette[i % flowerPalette.length]);
      flowerInst.setColorAt(i, _color);
    }
    flowerInst.computeBoundingSphere();
    if (flowerInst.instanceColor) flowerInst.instanceColor.needsUpdate = true;
    scene.add(flowerInst);

    // 8. Fluttering Butterflies in the Garden
    interface ButterflyActor {
      group: THREE.Group;
      wingL: THREE.Mesh;
      wingR: THREE.Mesh;
      centerX: number;
      centerZ: number;
      phase: number;
      radius: number;
    }
    const butterflies: ButterflyActor[] = [];
    const butterflyColors = [0xfacc15, 0xf43f5e, 0x38bdf8, 0xc084fc, 0xfb923c];
    butterflyColors.forEach((hex, idx) => {
      const bGrp = new THREE.Group();
      const wingGeo = track(new THREE.BoxGeometry(0.24, 0.02, 0.18));
      const wingMat = track(
        new THREE.MeshStandardMaterial({
          color: hex,
          emissive: hex,
          emissiveIntensity: 0.25,
          roughness: 0.35,
        })
      );
      const wingL = new THREE.Mesh(wingGeo, wingMat);
      wingL.position.x = -0.12;
      const wingR = new THREE.Mesh(wingGeo, wingMat);
      wingR.position.x = 0.12;
      bGrp.add(wingL, wingR);
      scene.add(bGrp);
      butterflies.push({
        group: bGrp,
        wingL,
        wingR,
        centerX: (idx - 2) * 2.3,
        centerZ: 3.4 + (idx % 2) * 1.4,
        phase: idx * 1.4,
        radius: 1.1 + (idx % 3) * 0.45,
      });
    });

    // 9. Five Original Living 3D Characters with Halo Ground Rings & Articulated Arms
    const characterRings: Record<CharacterId, THREE.Mesh> = {} as Record<CharacterId, THREE.Mesh>;
    const characterBaseY: Record<CharacterId, number> = {} as Record<CharacterId, number>;
    const characterArms: Partial<Record<CharacterId, { left: THREE.Mesh; right: THREE.Mesh }>> = {};

    function createCharacter3D(
      id: CharacterId,
      bodyColor: number,
      accentColor: number,
      x: number,
      z: number,
      label: string
    ): THREE.Group {
      const grp = new THREE.Group();
      const y = groundHeightAt(x, z);
      characterBaseY[id] = y;
      grp.position.set(x, y, z);

      const bMat = track(new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.45 }));
      const aMat = track(new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.35 }));
      const skinMat = track(new THREE.MeshStandardMaterial({ color: 0xfdba74, roughness: 0.52 }));
      const eyeMat = track(new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 }));

      // Interactive glowing selection ring at ground level
      const ringMat = track(
        new THREE.MeshBasicMaterial({
          color: accentColor,
          transparent: true,
          opacity: 0.45,
        })
      );
      const ring = new THREE.Mesh(track(new THREE.RingGeometry(0.65, 0.85, 24)), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.04;
      grp.add(ring);
      characterRings[id] = ring;

      if (id === 'estrellita') {
        const starCore = new THREE.Mesh(
          track(new THREE.OctahedronGeometry(0.56, 0)),
          track(
            new THREE.MeshStandardMaterial({
              color: 0xfacc15,
              emissive: 0xf59e0b,
              emissiveIntensity: 1.15,
              roughness: 0.2,
              metalness: 0.65,
            })
          )
        );
        starCore.position.y = 2.25;
        grp.add(starCore);

        const halo = new THREE.Mesh(
          track(new THREE.TorusGeometry(0.8, 0.065, 8, 24)),
          track(new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.78 }))
        );
        halo.position.y = 2.25;
        halo.rotation.x = Math.PI / 2.4;
        const miniSparkMat = track(new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        const miniSparkGeo = track(new THREE.OctahedronGeometry(0.14, 0));
        const sparkL = new THREE.Mesh(miniSparkGeo, miniSparkMat);
        sparkL.position.set(-0.95, 2.35, 0);
        const sparkR = new THREE.Mesh(miniSparkGeo, miniSparkMat);
        sparkR.position.set(0.95, 2.15, 0);
        grp.add(halo, sparkL, sparkR);
      } else {
        const basePedestal = new THREE.Mesh(
          track(new THREE.CylinderGeometry(0.56, 0.64, 0.14, 16)),
          aMat
        );
        basePedestal.position.y = 0.07;
        basePedestal.receiveShadow = true;
        grp.add(basePedestal);

        const torso = new THREE.Mesh(track(new THREE.CapsuleGeometry(0.32, 0.56, 6, 12)), bMat);
        torso.position.y = 0.72;
        torso.castShadow = true;
        grp.add(torso);

        // Articulated arms / paws
        const armGeo = track(new THREE.CapsuleGeometry(0.085, 0.3, 4, 8));
        const armMat = id === 'lucas' || id === 'luna' ? skinMat : bMat;
        const leftArm = new THREE.Mesh(armGeo, armMat);
        leftArm.position.set(-0.42, 0.86, 0);
        leftArm.rotation.z = 0.28;
        const rightArm = new THREE.Mesh(armGeo, armMat);
        rightArm.position.set(0.42, 0.86, 0);
        rightArm.rotation.z = -0.28;
        grp.add(leftArm, rightArm);
        characterArms[id] = { left: leftArm, right: rightArm };

        const head = new THREE.Mesh(
          track(new THREE.SphereGeometry(0.35, 16, 16)),
          id === 'leon' || id === 'cordero' ? bMat : skinMat
        );
        head.position.y = 1.46;
        head.castShadow = true;
        grp.add(head);

        // Eyes with white highlights
        const eyeGeo = track(new THREE.SphereGeometry(0.056, 8, 8));
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-0.11, 1.49, 0.3);
        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(0.11, 1.49, 0.3);
        grp.add(leftEye, rightEye);

        // Distinguishing 3D accessories
        if (id === 'lucas') {
          const brim = new THREE.Mesh(track(new THREE.CylinderGeometry(0.48, 0.48, 0.06, 16)), aMat);
          brim.position.y = 1.74;
          const crown = new THREE.Mesh(track(new THREE.CylinderGeometry(0.24, 0.3, 0.28, 12)), aMat);
          crown.position.y = 1.9;
          const backpack = new THREE.Mesh(track(new THREE.BoxGeometry(0.4, 0.44, 0.22)), aMat);
          backpack.position.set(0, 0.76, -0.32);
          const compassMedallion = new THREE.Mesh(
            track(new THREE.CylinderGeometry(0.11, 0.11, 0.05, 12)),
            track(new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.6, roughness: 0.25 }))
          );
          compassMedallion.rotation.x = Math.PI / 2;
          compassMedallion.position.set(0, 0.92, 0.32);
          grp.add(brim, crown, backpack, compassMedallion);
        } else if (id === 'luna') {
          const scarf = new THREE.Mesh(track(new THREE.TorusGeometry(0.29, 0.08, 8, 16)), aMat);
          scarf.position.y = 1.15;
          scarf.rotation.x = Math.PI / 2;
          const bunL = new THREE.Mesh(track(new THREE.SphereGeometry(0.14, 10, 10)), eyeMat);
          bunL.position.set(-0.34, 1.56, -0.05);
          const bunR = new THREE.Mesh(track(new THREE.SphereGeometry(0.14, 10, 10)), eyeMat);
          bunR.position.set(0.34, 1.56, -0.05);
          const starPin = new THREE.Mesh(
            track(new THREE.OctahedronGeometry(0.1, 0)),
            track(new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xf59e0b, emissiveIntensity: 0.4 }))
          );
          starPin.position.set(0.32, 1.69, 0.06);
          grp.add(scarf, bunL, bunR, starPin);
        } else if (id === 'leon') {
          const mane = new THREE.Mesh(track(new THREE.TorusGeometry(0.38, 0.15, 10, 18)), aMat);
          mane.position.set(0, 1.46, -0.05);
          const snout = new THREE.Mesh(track(new THREE.SphereGeometry(0.13, 10, 10)), skinMat);
          snout.position.set(0, 1.38, 0.31);
          const earGeo = track(new THREE.SphereGeometry(0.11, 8, 8));
          const earL = new THREE.Mesh(earGeo, bMat);
          earL.position.set(-0.27, 1.76, 0.02);
          const earR = new THREE.Mesh(earGeo, bMat);
          earR.position.set(0.27, 1.76, 0.02);
          const tailTuft = new THREE.Mesh(track(new THREE.SphereGeometry(0.11, 8, 8)), aMat);
          tailTuft.position.set(0, 0.56, -0.44);
          grp.add(mane, snout, earL, earR, tailTuft);
        } else if (id === 'cordero') {
          const woolTop = new THREE.Mesh(track(new THREE.SphereGeometry(0.22, 10, 10)), bMat);
          woolTop.position.set(0, 1.78, 0);
          const earGeo = track(new THREE.SphereGeometry(0.12, 8, 8));
          const earL = new THREE.Mesh(earGeo, aMat);
          earL.position.set(-0.36, 1.46, 0);
          const earR = new THREE.Mesh(earGeo, aMat);
          earR.position.set(0.36, 1.46, 0);
          const bow = new THREE.Mesh(track(new THREE.TorusGeometry(0.26, 0.07, 8, 16)), aMat);
          bow.position.y = 1.12;
          bow.rotation.x = Math.PI / 2;
          const oliveSprig = new THREE.Mesh(
            track(new THREE.ConeGeometry(0.08, 0.24, 6)),
            track(new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.5 }))
          );
          oliveSprig.position.set(0.22, 1.06, 0.24);
          oliveSprig.rotation.z = -0.6;
          grp.add(woolTop, earL, earR, bow, oliveSprig);
        }
      }

      scene.add(grp);
      registerClickable(grp, label, () => {
        charJumpTimersRef.current[id] = 1.0;
        onCharacterRef.current(id);
      });
      return grp;
    }

    const lucas3D = createCharacter3D('lucas', 0x059669, 0xd97706, -1.8, 3.8, 'Saludar a Lucas');
    const luna3D = createCharacter3D('luna', 0x0284c7, 0xf43f5e, 1.9, 3.9, 'Saludar a Luna');
    const leon3D = createCharacter3D('leon', 0xfbbf24, 0xc2410c, 4.3, 2.2, 'Saludar a León');
    const cordero3D = createCharacter3D('cordero', 0xffffff, 0x0284c7, -4.0, 2.5, 'Saludar a Cordero');
    const estrellita3D = createCharacter3D('estrellita', 0xfacc15, 0xfef08a, 0, 2.6, 'Saludar a Estrellita');

    // 10. Interactive Landmarks: Games Pavilion & Prayer Garden Shrine
    const pavilionGroup = new THREE.Group();
    pavilionGroup.position.set(5.8, groundHeightAt(5.8, 5.2), 5.2);
    const pavBase = new THREE.Mesh(
      track(new THREE.CylinderGeometry(1.5, 1.65, 0.35, 8)),
      track(new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.6 }))
    );
    pavBase.position.y = 0.18;
    const pavRoof = new THREE.Mesh(
      track(new THREE.ConeGeometry(1.78, 1.25, 8)),
      track(new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.45 }))
    );
    pavRoof.position.y = 2.3;
    const pavPillar = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.22, 0.25, 1.8, 12)),
      stoneMat
    );
    pavPillar.position.y = 1.05;
    pavilionGroup.add(pavBase, pavPillar, pavRoof);
    scene.add(pavilionGroup);
    registerClickable(pavilionGroup, 'Pabellón · Laboratorio de Juegos', () => {
      audioEngine.playSparkleBurst(soundRef.current);
      onModuleRef.current('games');
    });

    const prayerGardenGroup = new THREE.Group();
    prayerGardenGroup.position.set(-5.6, groundHeightAt(-5.6, 5.4), 5.4);
    const shrineBase = new THREE.Mesh(
      track(new THREE.CylinderGeometry(1.3, 1.45, 0.3, 12)),
      track(new THREE.MeshStandardMaterial({ color: 0xe0e7ff, roughness: 0.55 }))
    );
    shrineBase.position.y = 0.15;
    const shrineStar = new THREE.Mesh(
      track(new THREE.OctahedronGeometry(0.62, 0)),
      track(
        new THREE.MeshStandardMaterial({
          color: 0x6366f1,
          emissive: 0x4f46e5,
          emissiveIntensity: 0.65,
          roughness: 0.25,
        })
      )
    );
    shrineStar.position.y = 1.45;
    prayerGardenGroup.add(shrineBase, shrineStar);
    scene.add(prayerGardenGroup);
    registerClickable(prayerGardenGroup, 'Jardín de Paz · Mi Rincón con Dios', () => {
      audioEngine.playSparkleBurst(soundRef.current);
      onModuleRef.current('prayer');
    });

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Raycaster for hover & click
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };
    let lastMoveCheck = 0;

    const updatePointer = (ev: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (ev: PointerEvent) => {
      pointerDownPos = { x: ev.clientX, y: ev.clientY };
    };

    const onPointerUp = (ev: PointerEvent) => {
      const dist = Math.hypot(ev.clientX - pointerDownPos.x, ev.clientY - pointerDownPos.y);
      if (dist > 9) return;
      updatePointer(ev);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactiveTargets, true);
      if (hits.length > 0) {
        let node: THREE.Object3D | null = hits[0].object;
        while (node && !node.userData.onAction) {
          node = node.parent;
        }
        if (node?.userData.onAction) {
          (node.userData.onAction as () => void)();
        }
      }
    };

    const onPointerMove = (ev: PointerEvent) => {
      const now = performance.now();
      if (now - lastMoveCheck < 75) return;
      lastMoveCheck = now;
      updatePointer(ev);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactiveTargets, true);
      if (hits.length > 0) {
        let node: THREE.Object3D | null = hits[0].object;
        while (node && !node.userData.label) {
          node = node.parent;
        }
        if (node?.userData.label) {
          renderer.domElement.style.cursor = 'pointer';
          setHoveredLabel(String(node.userData.label));
          return;
        }
      }
      renderer.domElement.style.cursor = 'grab';
      setHoveredLabel(null);
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 540;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    resizeObserver?.observe(container);

    let frameId = 0;
    let disposed = false;
    const startTime = performance.now();
    let lastTime = startTime;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync?.(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const animateCharacterBounce = (
      id: CharacterId,
      mesh: THREE.Group,
      t: number,
      dt: number,
      idlePhase: number
    ) => {
      const jump = charJumpTimersRef.current[id];
      if (jump > 0) {
        charJumpTimersRef.current[id] = Math.max(0, jump - dt * 1.4);
      }
      const hop = Math.sin(jump * Math.PI) * 0.75;
      const idle = Math.abs(Math.sin(t * 2.1 + idlePhase)) * 0.1;
      mesh.position.y = characterBaseY[id] + idle + hop;
      if (jump > 0) {
        mesh.rotation.y = jump * Math.PI * 2;
      } else {
        mesh.rotation.y = Math.sin(t * 0.9 + idlePhase) * 0.22;
      }

      const arms = characterArms[id];
      if (arms) {
        if (jump > 0) {
          const wave = Math.sin(jump * Math.PI * 3) * 0.55;
          arms.left.rotation.z = 0.85 + wave;
          arms.right.rotation.z = -0.85 - wave;
        } else {
          const sway = Math.sin(t * 2.2 + idlePhase) * 0.14;
          arms.left.rotation.z = 0.28 + sway;
          arms.right.rotation.z = -0.28 - sway;
        }
      }

      const ring = characterRings[id];
      if (ring) {
        const isCurrent = activeCharRef.current === id;
        const pulseScale = isCurrent ? 1.15 + Math.sin(t * 4) * 0.1 : 0.92;
        ring.scale.setScalar(pulseScale);
        (ring.material as THREE.MeshBasicMaterial).opacity = isCurrent ? 0.85 : 0.3;
      }
    };

    const applyThemeImmediate = (isNight: boolean) => {
      if (disposed) return;
      const targetSky = isNight ? nightSky : daySky;
      if (scene.background instanceof THREE.Color) {
        scene.background.copy(targetSky);
      }
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.copy(targetSky);
      }
      sunLight.intensity = isNight ? 0.58 : 1.85;
      hemiLight.intensity = isNight ? 0.55 : 0.95;
      glowWindowMat.emissiveIntensity = isNight ? 2.5 : 1.25;
      sunOrb.visible = !isNight;
      moonOrb.visible = isNight;
      starField.visible = isNight;
      renderer.render(scene, camera);
    };
    syncThemeRef.current = applyThemeImmediate;
    applyThemeImmediate(darkModeRef.current);

    function tick() {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const t = (now - startTime) / 1000;

      // Day / Night transition
      const isNight = darkModeRef.current;
      const desiredSky = isNight ? nightSky : daySky;
      if (scene.background instanceof THREE.Color) {
        scene.background.lerp(desiredSky, 1 - Math.exp(-5 * dt));
      }
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.lerp(desiredSky, 1 - Math.exp(-5 * dt));
      }
      sunLight.intensity = THREE.MathUtils.damp(sunLight.intensity, isNight ? 0.58 : 1.85, 5, dt);
      hemiLight.intensity = THREE.MathUtils.damp(hemiLight.intensity, isNight ? 0.55 : 0.95, 5, dt);
      glowWindowMat.emissiveIntensity = isNight ? 2.5 : 1.25;
      sunOrb.visible = !isNight;
      moonOrb.visible = isNight;
      starField.visible = isNight;
      if (isNight) {
        starField.rotation.y = t * 0.02;
      }

      // Castle beacon & flags
      beaconRing.rotation.y = t * 1.05;
      flags.forEach((f, idx) => {
        f.rotation.y = Math.sin(t * 4.2 + idx) * 0.35;
      });
      shrineStar.rotation.y = t * 0.9;
      shrineStar.position.y = 1.45 + Math.sin(t * 2.2) * 0.15;

      // Flowing waterfall texture & splash droplets
      waterfallTexture.offset.y -= dt * 1.45;
      foamRing.scale.setScalar(1 + Math.sin(t * 3.4) * 0.14);
      foamRingMat.opacity = 0.5 + Math.cos(t * 3.4) * 0.22;

      for (let i = 0; i < dropletCount; i++) {
        const cycle = (t * 0.9 + i / dropletCount) % 1;
        const angle = i * 1.1;
        const spread = 0.3 + cycle * 1.15;
        _dummy.position.set(
          -8.1 + Math.cos(angle) * spread,
          0.42 + Math.sin(cycle * Math.PI) * 1.15,
          -2.9 + Math.sin(angle) * spread
        );
        _dummy.scale.setScalar(0.6 + (1 - cycle) * 0.7);
        _dummy.updateMatrix();
        droplets.setMatrixAt(i, _dummy.matrix);
      }
      droplets.instanceMatrix.needsUpdate = true;

      // Soft rainbow shimmer
      rainbowMats.forEach((mat, idx) => {
        mat.opacity = 0.65 + Math.sin(t * 1.5 + idx * 0.4) * 0.14;
      });

      // Drifting clouds
      clouds.forEach((c, idx) => {
        c.group.position.x += c.speed * dt;
        if (c.group.position.x > 24) c.group.position.x = -24;
        if (c.bounce > 0) c.bounce = Math.max(0, c.bounce - dt * 2.2);
        c.group.position.y = c.baseY + Math.sin(t * 0.9 + idx) * 0.2 + Math.sin(c.bounce * Math.PI) * 0.9;
      });

      // Fluttering butterflies
      butterflies.forEach((b) => {
        const ang = t * 1.15 + b.phase;
        const bx = b.centerX + Math.cos(ang) * b.radius;
        const bz = b.centerZ + Math.sin(ang * 1.4) * (b.radius * 0.7);
        b.group.position.set(
          bx,
          groundHeightAt(bx, bz) + 1.25 + Math.sin(t * 3 + b.phase) * 0.28,
          bz
        );
        b.group.rotation.y = -ang;
        const flap = Math.sin(t * 14 + b.phase) * 0.65;
        b.wingL.rotation.z = flap;
        b.wingR.rotation.z = -flap;
      });

      // Five characters
      animateCharacterBounce('lucas', lucas3D, t, dt, 0);
      animateCharacterBounce('luna', luna3D, t, dt, 1.1);
      animateCharacterBounce('leon', leon3D, t, dt, 2.2);
      animateCharacterBounce('cordero', cordero3D, t, dt, 3.3);

      const eJump = charJumpTimersRef.current.estrellita;
      if (eJump > 0) charJumpTimersRef.current.estrellita = Math.max(0, eJump - dt * 1.4);
      estrellita3D.position.x = Math.cos(t * 0.72) * 2.9;
      estrellita3D.position.z = Math.sin(t * 0.72) * 2.2 + 0.5;
      estrellita3D.position.y = 3.25 + Math.sin(t * 2.5) * 0.35 + Math.sin(eJump * Math.PI) * 0.8;
      estrellita3D.rotation.y = t * 1.6;

      // Smooth camera transition
      if (isTransitioningRef.current) {
        const p = presetRef.current;
        _targetPos.set(...p.position);
        _targetLook.set(...p.target);
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetPos.x, 4.5, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetPos.y, 4.5, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetPos.z, 4.5, dt);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetLook.x, 4.5, dt);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetLook.y, 4.5, dt);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetLook.z, 4.5, dt);

        if (_vec3.copy(camera.position).distanceTo(_targetPos) < 0.08) {
          isTransitioningRef.current = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      resizeObserver?.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      syncThemeRef.current = null;
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative h-[430px] sm:h-[520px] lg:h-[560px] w-full overflow-hidden rounded-3xl border-2 border-amber-200/80 bg-sky-200 shadow-xl dark:border-slate-700 dark:bg-slate-900">
      {webglFailed ? (
        <div className="relative h-full w-full">
          <img
            src={ASSET_IMAGES.heroKingdom}
            alt="Reino 3D de JAIRRESTAURA KIDS"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex items-end p-6">
            <p className="text-sm font-medium text-white">
              Modo ilustrado del Reino activado automáticamente para tu dispositivo.
            </p>
          </div>
        </div>
      ) : (
        <div
          ref={mountRef}
          className="h-full w-full touch-none"
          aria-label="Escena 3D interactiva del Reino de JAIRRESTAURA KIDS"
        />
      )}

      {/* Top Interactive Status Label (no backdrop-blur over WebGL) */}
      <div className="pointer-events-none absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-stone-950/80 px-3.5 py-1.5 text-xs font-bold text-white shadow-md">
          {darkMode ? (
            <Moon className="h-3.5 w-3.5 text-amber-300 shrink-0" />
          ) : (
            <Sun className="h-3.5 w-3.5 text-amber-300 shrink-0" />
          )}
          <span className="line-clamp-1">
            {hoveredLabel ||
              'Arrastra para girar · Toca nubes, castillo, cascada, arcoíris o tus 5 amigos'}
          </span>
        </div>
      </div>

      {/* Collapsible Slim Bottom Dock */}
      <div className="absolute bottom-2.5 left-1/2 z-10 w-[96%] max-w-4xl -translate-x-1/2 flex flex-col items-center">
        {controlsCollapsed ? (
          <button
            type="button"
            onClick={() => setControlsCollapsed(false)}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-2xl bg-stone-950/88 px-4 py-1.5 text-xs font-bold text-white shadow-lg hover:bg-stone-900 transition"
          >
            <ChevronUp className="h-4 w-4 text-amber-300" />
            Cámaras y Música 3D
          </button>
        ) : (
          <div className="flex w-full items-center gap-1.5 rounded-2xl border border-white/15 bg-stone-950/88 p-1.5 shadow-xl">
            <div className="flex flex-1 items-center gap-1.5 overflow-x-auto no-scrollbar">
              {CAMERA_PRESETS.map((preset) => {
                const isActive = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => selectPreset(preset)}
                    className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-amber-400 text-stone-950 shadow-sm'
                        : 'bg-white/12 text-stone-100 hover:bg-white/22'
                    }`}
                  >
                    {preset.id === 'overview' && <Compass className="h-3.5 w-3.5" />}
                    {preset.id === 'starlight' && <Sparkles className="h-3.5 w-3.5" />}
                    {preset.id !== 'overview' && preset.id !== 'starlight' && (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                    {preset.label}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={onToggleAmbient}
                className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition whitespace-nowrap shrink-0 ${
                  ambientPlaying
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/15 text-amber-200 hover:bg-white/25'
                }`}
              >
                {ambientPlaying ? (
                  <Volume2 className="h-3.5 w-3.5" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5" />
                )}
                {ambientPlaying ? 'Música activa' : 'Música'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setControlsCollapsed(true)}
              aria-label="Ocultar barra 3D"
              className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-xl bg-white/10 text-stone-200 hover:bg-white/20 transition shrink-0"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
