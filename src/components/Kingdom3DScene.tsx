import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, Compass, Eye, Sparkles, Sun, Moon } from 'lucide-react';
import { CharacterId, ModuleId } from '../types/app';
import { ASSET_IMAGES } from '../data/modulesData';

interface Kingdom3DSceneProps {
  darkMode: boolean;
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
  { id: 'overview', label: 'Vista del Reino', position: [0, 9.5, 21], target: [0, 2.2, 0] },
  { id: 'castle', label: 'Castillo de Luz', position: [6.5, 6.8, 12], target: [0, 3.8, -2.5] },
  { id: 'waterfall', label: 'Cascada Musical', position: [-10.5, 6.2, 11], target: [-6.5, 2.4, -2] },
  { id: 'garden', label: 'Jardín y Amigos', position: [5.5, 4.2, 11.5], target: [2.5, 1.1, 3.8] },
  { id: 'starlight', label: 'Arcoíris y Cielo', position: [0, 12.5, 24], target: [0, 5.2, -3] },
];

// Reusable module-scope math objects to eliminate per-frame GC allocations
const _vec3 = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _dummy = new THREE.Object3D();
const _color = new THREE.Color();

function groundHeightAt(x: number, z: number): number {
  const castleHill = Math.exp(-((x * x + (z + 2.5) * (z + 2.5)) / 32)) * 1.45;
  const westPeak = Math.exp(-(((x + 9.5) ** 2 + (z + 4.5) ** 2) / 26)) * 1.1;
  const gentleRoll = Math.sin(x * 0.16) * Math.cos(z * 0.14) * 0.28;
  return castleHill + westPeak + gentleRoll;
}

export const Kingdom3DScene: React.FC<Kingdom3DSceneProps> = ({
  darkMode,
  onSelectCharacter,
  onSelectModule,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activePreset, setActivePreset] = useState<CameraPresetId>('overview');
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  const presetRef = useRef<CameraPreset>(CAMERA_PRESETS[0]);
  const isTransitioningRef = useRef(false);
  const darkModeRef = useRef(darkMode);
  const onCharacterRef = useRef(onSelectCharacter);
  const onModuleRef = useRef(onSelectModule);

  useEffect(() => {
    darkModeRef.current = darkMode;
  }, [darkMode]);

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
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL probe per Three.js directives
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
    const height = container.clientHeight || 520;

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
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
    const daySky = new THREE.Color(0xbae6fd);
    const nightSky = new THREE.Color(0x0f172a);
    scene.background = (darkModeRef.current ? nightSky : daySky).clone();
    scene.fog = new THREE.FogExp2(darkModeRef.current ? 0x0f172a : 0xbae6fd, 0.015);

    // Studio environment map for PBR sheen and golden metallic beacons
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 160);
    camera.position.set(...CAMERA_PRESETS[0].position);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS[0].target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI * 0.46;
    controls.minPolarAngle = 0.25;
    controls.minDistance = 8;
    controls.maxDistance = 32;
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    controls.addEventListener('start', () => {
      isTransitioningRef.current = false;
    });

    // Warm/cool 3-point lighting rig
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x3f6212, 0.85);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff1d6, 1.75);
    sunLight.position.set(16, 22, 14);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.left = -18;
    sunLight.shadow.camera.right = 18;
    sunLight.shadow.camera.top = 18;
    sunLight.shadow.camera.bottom = -18;
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 55;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x7dd3fc, 0.55);
    rimLight.position.set(-14, 10, -14);
    scene.add(rimLight);

    // Track disposable resources
    const disposables: { dispose: () => void }[] = [envTarget];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    // 2. Terrain with vertex colors (grass hills + cobblestone path)
    const terrainGeo = track(new THREE.PlaneGeometry(76, 76, 64, 64));
    terrainGeo.rotateX(-Math.PI / 2);
    const posAttr = terrainGeo.attributes.position;
    const colors = new Float32Array(posAttr.count * 3);
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const y = groundHeightAt(x, z);
      posAttr.setY(i, y);

      const onPath = Math.abs(x - Math.sin(z * 0.22) * 1.4) < 1.35 && z > -1 && z < 15;
      if (onPath) {
        _color.setHex(0xe7d3b0);
      } else if (y > 1.2) {
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
        roughness: 0.92,
        metalness: 0.02,
      })
    );
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // Interactive raycast proxy targets
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

    // 3. Composite Illuminated Castle (8+ distinct PBR parts)
    const castleGroup = new THREE.Group();
    const castleY = groundHeightAt(0, -2.5);
    castleGroup.position.set(0, castleY, -2.5);

    const stoneMat = track(
      new THREE.MeshStandardMaterial({ color: 0xf5f0e6, roughness: 0.72, metalness: 0.04 })
    );
    const goldMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.25,
        metalness: 0.85,
        emissive: 0x78350f,
        emissiveIntensity: 0.22,
      })
    );
    const roofMat = track(
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.42, metalness: 0.15 })
    );
    const glowWindowMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xfbbf24,
        emissiveIntensity: 1.4,
        roughness: 0.2,
      })
    );

    const plinth = new THREE.Mesh(track(new THREE.CylinderGeometry(4.2, 4.7, 0.8, 12)), stoneMat);
    plinth.position.y = 0.4;
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    castleGroup.add(plinth);

    const keep = new THREE.Mesh(track(new THREE.BoxGeometry(4.2, 3.2, 3.6)), stoneMat);
    keep.position.y = 2.2;
    keep.castShadow = true;
    keep.receiveShadow = true;
    castleGroup.add(keep);

    const centerTower = new THREE.Mesh(track(new THREE.CylinderGeometry(1.15, 1.3, 4.8, 16)), stoneMat);
    centerTower.position.set(0, 3.4, -0.2);
    centerTower.castShadow = true;
    castleGroup.add(centerTower);

    const centerSpire = new THREE.Mesh(track(new THREE.ConeGeometry(1.45, 2.3, 16)), roofMat);
    centerSpire.position.set(0, 6.85, -0.2);
    centerSpire.castShadow = true;
    castleGroup.add(centerSpire);

    // Golden Crown Beacon atop main spire
    const beaconRing = new THREE.Mesh(track(new THREE.TorusGeometry(0.45, 0.09, 10, 20)), goldMat);
    beaconRing.position.set(0, 8.2, -0.2);
    castleGroup.add(beaconRing);

    const turretCoords: [number, number][] = [
      [-2.3, 1.8],
      [2.3, 1.8],
      [-2.3, -1.8],
      [2.3, -1.8],
    ];
    turretCoords.forEach(([tx, tz]) => {
      const tBody = new THREE.Mesh(track(new THREE.CylinderGeometry(0.65, 0.75, 3.6, 12)), stoneMat);
      tBody.position.set(tx, 2.1, tz);
      tBody.castShadow = true;
      castleGroup.add(tBody);

      const tCone = new THREE.Mesh(track(new THREE.ConeGeometry(0.85, 1.5, 12)), roofMat);
      tCone.position.set(tx, 4.6, tz);
      tCone.castShadow = true;
      castleGroup.add(tCone);

      const finial = new THREE.Mesh(track(new THREE.SphereGeometry(0.14, 10, 10)), goldMat);
      finial.position.set(tx, 5.42, tz);
      castleGroup.add(finial);
    });

    // Arched Golden Gate + Glowing Window
    const gate = new THREE.Mesh(track(new THREE.BoxGeometry(1.2, 1.7, 0.3)), goldMat);
    gate.position.set(0, 1.45, 1.8);
    castleGroup.add(gate);

    const roseWindow = new THREE.Mesh(track(new THREE.CircleGeometry(0.48, 16)), glowWindowMat);
    roseWindow.position.set(0, 3.2, 1.82);
    castleGroup.add(roseWindow);

    scene.add(castleGroup);
    registerClickable(castleGroup, 'Castillo de Historias Bíblicas 3D', () =>
      onModuleRef.current('stories')
    );

    // 4. Mountains + Animated Waterfall + Lagoon
    const mountainGroup = new THREE.Group();
    const rockMat = track(
      new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.88, metalness: 0.05 })
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
      const mMesh = new THREE.Mesh(track(new THREE.ConeGeometry(p.r, p.h, 7)), rockMat);
      mMesh.position.set(p.x, p.h * 0.45, p.z);
      mMesh.castShadow = true;
      mMesh.receiveShadow = true;
      mountainGroup.add(mMesh);

      const cap = new THREE.Mesh(track(new THREE.ConeGeometry(p.r * 0.36, p.h * 0.32, 7)), snowCapMat);
      cap.position.set(p.x, p.h * 0.78, p.z);
      mountainGroup.add(cap);
    });

    // Waterfall Stream & Lagoon
    const waterMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.25,
        roughness: 0.14,
        metalness: 0.1,
        clearcoat: 1,
        transparent: true,
        opacity: 0.88,
      })
    );
    const waterfallGeo = track(new THREE.CylinderGeometry(0.9, 1.25, 5.2, 12, 8, true));
    const waterfall = new THREE.Mesh(waterfallGeo, waterMat);
    waterfall.position.set(-8.6, 2.7, -4.4);
    waterfall.rotation.x = 0.24;
    mountainGroup.add(waterfall);

    const lagoonGeo = track(new THREE.CircleGeometry(3.8, 28));
    lagoonGeo.rotateX(-Math.PI / 2);
    const lagoon = new THREE.Mesh(lagoonGeo, waterMat);
    lagoon.position.set(-7.8, 0.36, -1.6);
    lagoon.receiveShadow = true;
    mountainGroup.add(lagoon);

    const foamRingMat = track(
      new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.65 })
    );
    const foamRing = new THREE.Mesh(track(new THREE.TorusGeometry(1.4, 0.09, 8, 24)), foamRingMat);
    foamRing.rotation.x = Math.PI / 2;
    foamRing.position.set(-8.1, 0.4, -2.9);
    mountainGroup.add(foamRing);

    scene.add(mountainGroup);
    registerClickable(mountainGroup, 'Cascada del Planeta Musical', () =>
      onModuleRef.current('music')
    );

    // 5. Seven-Band Radiant Rainbow Arch
    const rainbowGroup = new THREE.Group();
    const rainbowColors = [0xef4444, 0xf97316, 0xfacc15, 0x22c55e, 0x06b6d4, 0x3b82f6, 0x8b5cf6];
    rainbowColors.forEach((hex, idx) => {
      const rMat = track(
        new THREE.MeshBasicMaterial({
          color: hex,
          transparent: true,
          opacity: 0.72,
        })
      );
      const rGeo = track(new THREE.TorusGeometry(10.5 - idx * 0.26, 0.12, 8, 48, Math.PI));
      const arc = new THREE.Mesh(rGeo, rMat);
      rainbowGroup.add(arc);
    });
    rainbowGroup.position.set(0, 1.4, -6.5);
    scene.add(rainbowGroup);

    // 6. Instanced Trees & Garden Flowers
    const treeCount = 26;
    const trunkGeo = track(new THREE.CylinderGeometry(0.16, 0.24, 1.3, 8));
    const trunkMat = track(new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 }));
    const foliageGeo = track(new THREE.ConeGeometry(0.95, 2.2, 8));
    const foliageMat = track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.78 }));

    const trunkInst = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount);
    const foliageInst = new THREE.InstancedMesh(foliageGeo, foliageMat, treeCount);
    trunkInst.castShadow = !isSoftwareGl;
    foliageInst.castShadow = !isSoftwareGl;

    const treeAngles: number[] = [];
    for (let i = 0; i < treeCount; i++) {
      const angle = (i / treeCount) * Math.PI * 2;
      treeAngles.push(angle);
      const radius = 8.5 + (i % 4) * 3.1;
      const tx = Math.cos(angle) * radius;
      const tz = Math.sin(angle) * radius * 0.78 - 1;
      // Leave front path clear
      const safeX = Math.abs(tx) < 2.4 && tz > 2 ? tx + 3.4 : tx;
      const ty = groundHeightAt(safeX, tz);
      const scale = 0.85 + (i % 5) * 0.1;

      _dummy.position.set(safeX, ty + 0.65 * scale, tz);
      _dummy.scale.set(scale, scale, scale);
      _dummy.updateMatrix();
      trunkInst.setMatrixAt(i, _dummy.matrix);

      _dummy.position.set(safeX, ty + 1.95 * scale, tz);
      _dummy.updateMatrix();
      foliageInst.setMatrixAt(i, _dummy.matrix);

      _color.setHSL(0.28 + (i % 4) * 0.025, 0.65, 0.36 + (i % 3) * 0.05);
      foliageInst.setColorAt(i, _color);
    }
    trunkInst.computeBoundingSphere();
    foliageInst.computeBoundingSphere();
    if (foliageInst.instanceColor) foliageInst.instanceColor.needsUpdate = true;
    scene.add(trunkInst);
    scene.add(foliageInst);

    // 7. Five Original Composite 3D Characters in the Kingdom Meadow
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
      grp.position.set(x, y, z);

      const bMat = track(new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.45 }));
      const aMat = track(new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.35 }));
      const skinMat = track(new THREE.MeshStandardMaterial({ color: 0xfdba74, roughness: 0.55 }));
      const eyeMat = track(new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 }));

      if (id === 'estrellita') {
        const starCore = new THREE.Mesh(
          track(new THREE.OctahedronGeometry(0.52, 0)),
          track(
            new THREE.MeshStandardMaterial({
              color: 0xfacc15,
              emissive: 0xf59e0b,
              emissiveIntensity: 1.1,
              roughness: 0.2,
              metalness: 0.6,
            })
          )
        );
        starCore.position.y = 2.2;
        grp.add(starCore);

        const halo = new THREE.Mesh(
          track(new THREE.TorusGeometry(0.76, 0.06, 8, 24)),
          track(new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.7 }))
        );
        halo.position.y = 2.2;
        halo.rotation.x = Math.PI / 2.5;
        grp.add(halo);
      } else {
        const basePedestal = new THREE.Mesh(
          track(new THREE.CylinderGeometry(0.55, 0.62, 0.14, 16)),
          aMat
        );
        basePedestal.position.y = 0.07;
        basePedestal.receiveShadow = true;
        grp.add(basePedestal);

        const torso = new THREE.Mesh(
          track(new THREE.CapsuleGeometry(0.32, 0.55, 6, 12)),
          bMat
        );
        torso.position.y = 0.72;
        torso.castShadow = true;
        grp.add(torso);

        const head = new THREE.Mesh(
          track(new THREE.SphereGeometry(0.34, 16, 16)),
          id === 'leon' || id === 'cordero' ? bMat : skinMat
        );
        head.position.y = 1.45;
        head.castShadow = true;
        grp.add(head);

        // Eyes
        const eyeGeo = track(new THREE.SphereGeometry(0.055, 8, 8));
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-0.11, 1.48, 0.29);
        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(0.11, 1.48, 0.29);
        grp.add(leftEye, rightEye);

        // Unique silhouette accessories
        if (id === 'lucas') {
          const brim = new THREE.Mesh(track(new THREE.CylinderGeometry(0.46, 0.46, 0.06, 16)), aMat);
          brim.position.y = 1.72;
          const crown = new THREE.Mesh(track(new THREE.CylinderGeometry(0.24, 0.3, 0.28, 12)), aMat);
          crown.position.y = 1.88;
          grp.add(brim, crown);
        } else if (id === 'luna') {
          const scarf = new THREE.Mesh(track(new THREE.TorusGeometry(0.29, 0.08, 8, 16)), aMat);
          scarf.position.y = 1.15;
          scarf.rotation.x = Math.PI / 2;
          grp.add(scarf);
        } else if (id === 'leon') {
          const mane = new THREE.Mesh(track(new THREE.TorusGeometry(0.36, 0.14, 10, 18)), aMat);
          mane.position.set(0, 1.45, -0.05);
          grp.add(mane);
        } else if (id === 'cordero') {
          const earGeo = track(new THREE.SphereGeometry(0.12, 8, 8));
          const earL = new THREE.Mesh(earGeo, aMat);
          earL.position.set(-0.36, 1.46, 0);
          const earR = new THREE.Mesh(earGeo, aMat);
          earR.position.set(0.36, 1.46, 0);
          grp.add(earL, earR);
        }
      }

      scene.add(grp);
      registerClickable(grp, label, () => onCharacterRef.current(id));
      return grp;
    }

    const lucas3D = createCharacter3D('lucas', 0x059669, 0xd97706, -1.8, 3.6, 'Saludar a Lucas');
    const luna3D = createCharacter3D('luna', 0x0284c7, 0xf43f5e, 1.9, 3.8, 'Saludar a Luna');
    const leon3D = createCharacter3D('leon', 0xfbbf24, 0xc2410c, 4.2, 2.2, 'Saludar a León');
    const cordero3D = createCharacter3D('cordero', 0xffffff, 0x0284c7, -3.9, 2.4, 'Saludar a Cordero');
    const estrellita3D = createCharacter3D('estrellita', 0xfacc15, 0xfef08a, 0, 2.8, 'Saludar a Estrellita');

    // Interactive Games Pavilion in Garden
    const pavilionGroup = new THREE.Group();
    pavilionGroup.position.set(5.4, groundHeightAt(5.4, 5.2), 5.2);
    const pavBase = new THREE.Mesh(
      track(new THREE.CylinderGeometry(1.5, 1.65, 0.35, 8)),
      track(new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.6 }))
    );
    pavBase.position.y = 0.18;
    const pavRoof = new THREE.Mesh(
      track(new THREE.ConeGeometry(1.75, 1.2, 8)),
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
    registerClickable(pavilionGroup, 'Laboratorio de Juegos', () => onModuleRef.current('games'));

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
      if (dist > 8) return; // Was dragging OrbitControls
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
      if (now - lastMoveCheck < 70) return;
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
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    resizeObserver?.observe(container);

    // Animation loop with software WebGL pacing
    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

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

    function tick() {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const t = clock.getElapsedTime();

      // Dynamic day/night sky & lighting transition
      const desiredSky = darkModeRef.current ? nightSky : daySky;
      if (scene.background instanceof THREE.Color) {
        scene.background.lerp(desiredSky, 1 - Math.exp(-4 * dt));
      }
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.lerp(desiredSky, 1 - Math.exp(-4 * dt));
      }
      sunLight.intensity = THREE.MathUtils.damp(
        sunLight.intensity,
        darkModeRef.current ? 0.55 : 1.75,
        4,
        dt
      );
      glowWindowMat.emissiveIntensity = darkModeRef.current ? 2.4 : 1.2;

      // Animate castle beacon, waterfall pulse, and character gentle motions
      beaconRing.rotation.y = t * 0.9;
      foamRing.scale.setScalar(1 + Math.sin(t * 3) * 0.12);
      foamRingMat.opacity = 0.5 + Math.cos(t * 3) * 0.2;

      lucas3D.position.y = groundHeightAt(-1.8, 3.6) + Math.abs(Math.sin(t * 2.1)) * 0.12;
      luna3D.position.y = groundHeightAt(1.9, 3.8) + Math.abs(Math.sin(t * 2.1 + 1.1)) * 0.12;
      leon3D.rotation.y = Math.sin(t * 1.2) * 0.25;
      cordero3D.position.y = groundHeightAt(-3.9, 2.4) + Math.abs(Math.sin(t * 2.4 + 2)) * 0.1;

      estrellita3D.position.x = Math.cos(t * 0.7) * 2.8;
      estrellita3D.position.z = Math.sin(t * 0.7) * 2.2 + 0.5;
      estrellita3D.position.y = 3.2 + Math.sin(t * 2.4) * 0.35;
      estrellita3D.rotation.y = t * 1.5;

      // Smooth exponential camera preset transition
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
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative h-[420px] sm:h-[500px] lg:h-[540px] w-full overflow-hidden rounded-3xl border border-stone-200 bg-sky-100 shadow-lg dark:border-slate-800 dark:bg-slate-900">
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
              Modo ilustrado del Reino activado automáticamente.
            </p>
          </div>
        </div>
      ) : (
        <div
          ref={mountRef}
          className="h-full w-full touch-none"
          aria-label="Escena 3D del Reino"
        />
      )}

      {/* Minimal Top-Left Interactive Hint */}
      <div className="pointer-events-none absolute top-4 left-4 right-4 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl bg-stone-950/75 px-3.5 py-2 text-xs font-semibold text-white shadow-sm">
          {darkMode ? <Moon className="h-3.5 w-3.5 text-amber-300" /> : <Sun className="h-3.5 w-3.5 text-amber-300" />}
          <span>{hoveredLabel || 'Arrastra para girar · Toca un personaje o el castillo'}</span>
        </div>
      </div>

      {/* Collapsible Bottom Control Dock (Zero Viewport Occlusion) */}
      <div className="absolute bottom-4 left-1/2 z-10 w-[94%] max-w-2xl -translate-x-1/2 flex flex-col items-center">
        <button
          type="button"
          onClick={() => setControlsCollapsed((v) => !v)}
          className="mb-1.5 inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-stone-950/80 px-3.5 py-1 text-xs font-semibold text-white shadow hover:bg-stone-900 transition"
        >
          {controlsCollapsed ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              Mostrar cámaras 3D
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              Ocultar controles
            </>
          )}
        </button>

        {!controlsCollapsed && (
          <div className="w-full rounded-2xl border border-white/15 bg-stone-950/85 p-2 shadow-xl">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {CAMERA_PRESETS.map((preset) => {
                const isActive = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => selectPreset(preset)}
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-amber-500 text-stone-950 shadow-sm'
                        : 'bg-white/10 text-stone-100 hover:bg-white/20'
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
