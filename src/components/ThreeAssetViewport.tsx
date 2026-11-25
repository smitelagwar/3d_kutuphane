import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Box,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Grid3x3,
  Loader2,
  Palette,
  X,
} from 'lucide-react';
import type {
  ArchitecturalAsset,
  MaterialFinish,
  PatternId,
  PatternVariant,
} from '../lib/catalogTypes';
import { buildArchitecturalAssetMesh, type BuiltAssetModel } from '../three/assetMeshBuilder';
import {
  applyFinishAndPatternToExternalModel,
  loadExternalArchitecturalModel,
} from '../three/externalModelLoader';
import { createContactShadowTexture } from '../three/proceduralTextures';
import { exportAssetAsGlb } from '../three/glbExporter';
import { formatDimensionsText } from '../lib/catalogLogic';
import { PROCEDURAL_RUG_DESIGNER_FINISHES } from '../lib/catalogData';

type CameraPreset = 'perspective' | 'front' | 'side' | 'top';
type SurfaceModeId = 'matte' | 'satin' | 'glossy' | 'metallic';

interface ThreeAssetViewportProps {
  asset: ArchitecturalAsset;
  finish: MaterialFinish;
  pattern: PatternVariant;
  isCustomFinishActive: boolean;
  onSelectFinish: (finishId: string) => void;
  onApplyCustomFinish: (custom: MaterialFinish) => void;
  onSelectPattern: (patternId: PatternId) => void;
  onDownloadPython: () => void;
}

const CAMERA_LABELS: Record<CameraPreset, string> = {
  perspective: 'Persp',
  front: 'Ön',
  side: 'Yan',
  top: 'Üst',
};

const SURFACE_MODES: Array<{
  id: SurfaceModeId;
  label: string;
  roughness: number;
  metalness: number;
  materialKind: MaterialFinish['materialKind'];
}> = [
  { id: 'metallic', label: 'Metalik PVD', roughness: 0.2, metalness: 0.94, materialKind: 'metal' },
  { id: 'matte', label: 'Mat Yüzey', roughness: 0.56, metalness: 0.06, materialKind: 'ceramic' },
  { id: 'satin', label: 'Saten', roughness: 0.28, metalness: 0.14, materialKind: 'wood' },
  { id: 'glossy', label: 'Parlak Sır', roughness: 0.09, metalness: 0.04, materialKind: 'ceramic' },
];

const ARCHITECTURAL_RAL_PRESETS: Array<{
  label: string;
  group: 'Metal' | 'Taş' | 'Ahşap' | 'Tekstil';
  hex: string;
  roughness: number;
  metalness: number;
  materialKind: MaterialFinish['materialKind'];
}> = [
  { label: 'Parlak Krom', group: 'Metal', hex: '#E8ECEF', roughness: 0.08, metalness: 0.98, materialKind: 'metal' },
  { label: 'Mat Siyah', group: 'Metal', hex: '#202329', roughness: 0.42, metalness: 0.72, materialKind: 'metal' },
  { label: 'Fırçalı Gold', group: 'Metal', hex: '#D4AF5A', roughness: 0.24, metalness: 0.94, materialKind: 'metal' },
  { label: 'Füme Gunmetal', group: 'Metal', hex: '#4D535E', roughness: 0.26, metalness: 0.9, materialKind: 'metal' },
  { label: 'Fırçalı Nikel', group: 'Metal', hex: '#BFC4CB', roughness: 0.28, metalness: 0.92, materialKind: 'metal' },
  { label: 'Rose Gold', group: 'Metal', hex: '#C98A74', roughness: 0.22, metalness: 0.94, materialKind: 'metal' },
  { label: 'Parlak Beyaz', group: 'Taş', hex: '#FAFAFB', roughness: 0.09, metalness: 0.04, materialKind: 'ceramic' },
  { label: 'Traverten Taş', group: 'Taş', hex: '#DDD3C2', roughness: 0.48, metalness: 0.03, materialKind: 'stone' },
  { label: 'Kaşmir Bej', group: 'Taş', hex: '#D8CFC2', roughness: 0.46, metalness: 0.03, materialKind: 'ceramic' },
  { label: 'Mat Antrasit', group: 'Taş', hex: '#393E46', roughness: 0.48, metalness: 0.08, materialKind: 'ceramic' },
  { label: 'Doğal Meşe', group: 'Ahşap', hex: '#C6A378', roughness: 0.52, metalness: 0.03, materialKind: 'wood' },
  { label: 'Amerikan Ceviz', group: 'Ahşap', hex: '#6F4E37', roughness: 0.46, metalness: 0.04, materialKind: 'wood' },
  { label: 'Spa Adaçayı', group: 'Ahşap', hex: '#7B8F7E', roughness: 0.48, metalness: 0.03, materialKind: 'wood' },
  { label: 'Koyu Venge', group: 'Ahşap', hex: '#3D2E26', roughness: 0.44, metalness: 0.05, materialKind: 'wood' },
  { label: 'Krem Bukle', group: 'Tekstil', hex: '#EFEAE0', roughness: 0.88, metalness: 0.01, materialKind: 'fabric' },
  { label: 'Vizon Keten', group: 'Tekstil', hex: '#A99E92', roughness: 0.86, metalness: 0.01, materialKind: 'fabric' },
];

function isExternalProvider(provider?: string): boolean {
  return provider === 'polyhaven' || provider === 'khronos' || provider === 'abo' || provider === 'hf';
}

function getSwatchStyle(f: MaterialFinish): React.CSSProperties {
  if (f.preserveOriginalTextures) {
    return {
      background: `conic-gradient(from 45deg, ${f.primaryHex} 0% 42%, ${f.secondaryHex} 42% 76%, ${f.accentHex} 76% 100%)`,
    };
  }
  if (f.paletteRecolorMode === 'tri-tone-rug' || f.paletteRecolorMode === 'multi-part-retail') {
    return {
      background: `linear-gradient(135deg, ${f.primaryHex} 0% 46%, ${f.secondaryHex} 46% 78%, ${f.accentHex} 78% 100%)`,
    };
  }
  if (f.metalness >= 0.65) {
    return {
      background: `linear-gradient(135deg, ${f.accentHex || '#FFFFFF'} 0%, ${f.primaryHex} 48%, ${f.secondaryHex || f.primaryHex} 100%)`,
    };
  }
  return { backgroundColor: f.primaryHex };
}

function detectSoftwareGl(): boolean {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export const ThreeAssetViewport: React.FC<ThreeAssetViewportProps> = ({
  asset,
  finish,
  pattern,
  isCustomFinishActive,
  onSelectFinish,
  onApplyCustomFinish,
  onSelectPattern,
  onDownloadPython,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('perspective');
  const [showGrid, setShowGrid] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [customHex, setCustomHex] = useState(finish.primaryHex || '#202329');
  const [rugPrimaryHex, setRugPrimaryHex] = useState(finish.primaryHex || '#EFEAE1');
  const [rugSecondaryHex, setRugSecondaryHex] = useState(finish.secondaryHex || '#B8A997');
  const [rugAccentHex, setRugAccentHex] = useState(finish.accentHex || '#5E5348');
  const [surfaceMode, setSurfaceMode] = useState<SurfaceModeId>(
    finish.metalness >= 0.6 ? 'metallic' : finish.roughness < 0.2 ? 'glossy' : 'matte',
  );
  const [exportingGlb, setExportingGlb] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [loadProgress, setLoadProgress] = useState<{ loaded: number; total: number } | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);
  const [loadedAssetId, setLoadedAssetId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState('');
  const [webglError, setWebglError] = useState(false);

  const isExternalAsset = isExternalProvider(asset.modelSource?.provider);
  const isRugMode = asset.finishes.some(
    (f) => f.paletteRecolorMode === 'tri-tone-rug' || f.materialKind === 'rug',
  );
  const isRetailMultiPartMode =
    !isRugMode && asset.finishes.some((f) => f.paletteRecolorMode === 'multi-part-retail');
  const retailCombos = isRetailMultiPartMode
    ? asset.finishes.filter((f) => !f.preserveOriginalTextures && f.partFinishes)
    : [];
  const activeComboRole =
    finish.comboRole || retailCombos[0]?.comboRole;

  // Keep customHex & 3-tone rug pickers synced when switching assets or finishes
  useEffect(() => {
    setCustomHex(finish.primaryHex);
    setRugPrimaryHex(finish.primaryHex || '#EFEAE1');
    setRugSecondaryHex(finish.secondaryHex || '#B8A997');
    setRugAccentHex(finish.accentHex || '#5E5348');
  }, [finish.primaryHex, finish.secondaryHex, finish.accentHex, asset.id]);

  // Refs for latest finish/pattern/wireframe so async GLTF loads apply fresh values
  const latestPropsRef = useRef({ finish, pattern, wireframe, cameraPreset });
  latestPropsRef.current = { finish, pattern, wireframe, cameraPreset };

  const engineRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    grid: THREE.GridHelper;
    shadowDisc: THREE.Mesh;
    isSoftwareGl: boolean;
    maxAnisotropy: number;
    currentModel: BuiltAssetModel | null;
    loadedExternalAssetId: string | null;
    requestRender: (immediate?: boolean) => void;
    fitCamera: (preset: CameraPreset) => void;
  } | null>(null);

  // Initialize WebGLRenderer & studio lighting rig ONCE
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError(true);
      return;
    }

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const scene = new THREE.Scene();
    const bgHex = 0x262b34;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.032);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.92;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.02, 80);
    camera.position.set(2.4, 1.6, 2.8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.minDistance = 0.16;
    controls.maxDistance = 18;

    // 3-point warm/cool architectural studio lighting rig
    const hemiLight = new THREE.HemisphereLight(0xdbe8ff, 0x3b3630, 0.62);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff2de, 1.6);
    keyLight.position.set(4.8, 6.4, 4.6);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.2;
    keyLight.shadow.camera.far = 22;
    keyLight.shadow.camera.left = -4.5;
    keyLight.shadow.camera.right = 4.5;
    keyLight.shadow.camera.top = 4.5;
    keyLight.shadow.camera.bottom = -4.5;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa3c9ff, 0.85);
    rimLight.position.set(-4.6, 3.8, -4.4);
    scene.add(rimLight);

    const floorGeo = new THREE.CircleGeometry(10, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x303642,
      roughness: 0.92,
      metalness: 0.04,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.003;
    floorMesh.receiveShadow = !isSoftwareGl;
    scene.add(floorMesh);

    const grid = new THREE.GridHelper(12, 24, 0x596477, 0x3b4352);
    grid.position.y = 0.001;
    scene.add(grid);

    const shadowTex = createContactShadowTexture();
    const shadowDiscGeo = new THREE.CircleGeometry(1.4, 36);
    const shadowDiscMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.72,
    });
    const shadowDisc = new THREE.Mesh(shadowDiscGeo, shadowDiscMat);
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.y = 0.0025;
    scene.add(shadowDisc);

    let rafId = 0;
    let cooldownTimer = 0;
    let renderScheduled = false;
    let renderCooldown = false;
    let renderDirty = false;
    let disposed = false;

    const executeRenderNow = () => {
      if (disposed) return;
      renderScheduled = false;
      renderDirty = false;
      controls.update();
      renderer.render(scene, camera);
      if (isSoftwareGl) {
        renderCooldown = true;
        window.clearTimeout(cooldownTimer);
        cooldownTimer = window.setTimeout(() => {
          renderCooldown = false;
          if (renderDirty && !disposed) {
            requestRender();
          }
        }, 64);
      }
    };

    const requestRender = (immediate = false) => {
      if (disposed) return;
      if (immediate) {
        cancelAnimationFrame(rafId);
        window.clearTimeout(cooldownTimer);
        renderCooldown = false;
        executeRenderNow();
        return;
      }
      if (renderScheduled || renderCooldown) {
        renderDirty = true;
        return;
      }
      renderScheduled = true;
      rafId = requestAnimationFrame(() => {
        executeRenderNow();
      });
    };

    const fitCamera = (preset: CameraPreset) => {
      const current = engineRef.current?.currentModel;
      const box = new THREE.Box3();
      if (current) {
        box.setFromObject(current.group);
      } else {
        box.set(new THREE.Vector3(-1, 0, -1), new THREE.Vector3(1, 1, 1));
      }
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);

      const maxDim = Math.max(size.x, size.y, size.z, 0.24);
      const isFlatWide = size.y < maxDim * 0.14;
      const isTallThinWall = size.y > size.z * 1.35 && size.x < 1.65;
      const dist = isFlatWide
        ? maxDim * 1.82
        : isTallThinWall
          ? maxDim * 2.15
          : maxDim * 2.08;

      if (preset === 'front') {
        camera.position.set(center.x, center.y + maxDim * 0.08, center.z + dist);
      } else if (preset === 'side') {
        camera.position.set(center.x + dist, center.y + maxDim * 0.1, center.z);
      } else if (preset === 'top') {
        camera.position.set(center.x, center.y + dist * 1.18, center.z + dist * 0.14);
      } else if (isFlatWide) {
        camera.position.set(center.x + dist * 0.56, center.y + dist * 0.9, center.z + dist * 0.8);
      } else if (isTallThinWall) {
        camera.position.set(center.x + dist * 0.58, center.y + dist * 0.2, center.z + dist * 0.88);
      } else {
        camera.position.set(center.x + dist * 0.72, center.y + dist * 0.42, center.z + dist * 0.84);
      }

      controls.target.set(center.x, isFlatWide ? center.y - 0.08 : center.y - size.y * 0.05, center.z);
      controls.update();

      const footprint = Math.max(size.x, size.z, 0.32) * 0.72;
      shadowDisc.scale.set(footprint, footprint, 1);
      shadowDisc.position.set(center.x, 0.0025, center.z);
      shadowDisc.visible = !isFlatWide;
      requestRender(true);
    };

    const onControlsChange = () => requestRender(false);
    controls.addEventListener('change', onControlsChange);

    const onContextLost = (ev: Event) => {
      ev.preventDefault();
      setWebglError(true);
    };
    const onContextRestored = () => {
      setWebglError(false);
      requestRender();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const resizeObserver = new ResizeObserver(() => {
      if (!container || disposed) return;
      const nextW = Math.max(container.clientWidth, 280);
      const nextH = Math.max(container.clientHeight, 260);
      camera.aspect = nextW / nextH;
      camera.updateProjectionMatrix();
      renderer.setSize(nextW, nextH);
      requestRender();
    });
    resizeObserver.observe(container);

    engineRef.current = {
      scene,
      camera,
      renderer,
      controls,
      grid,
      shadowDisc,
      isSoftwareGl,
      maxAnisotropy: renderer.capabilities.getMaxAnisotropy(),
      currentModel: null,
      loadedExternalAssetId: null,
      requestRender,
      fitCamera,
    };

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.clearTimeout(cooldownTimer);
      resizeObserver.disconnect();
      controls.removeEventListener('change', onControlsChange);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      if (engineRef.current?.currentModel) {
        scene.remove(engineRef.current.currentModel.group);
        engineRef.current.currentModel.dispose();
      }
      envTex.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      shadowDiscGeo.dispose();
      shadowDiscMat.dispose();
      shadowTex.dispose();
      renderer.dispose();
      engineRef.current = null;
    };
  }, []);

  // Load external GLTF/GLB model when active asset changes (only re-fetches when asset.id changes!)
  useEffect(() => {
    const eng = engineRef.current;
    if (!eng) return;

    const isExternal = isExternalProvider(asset.modelSource?.provider);

    if (!isExternal) {
      eng.loadedExternalAssetId = null;
      setLoadingModel(false);
      setLoadError('');
      return;
    }

    const controller = new AbortController();
    setLoadingModel(true);
    setLoadProgress(null);
    setLoadedAssetId(null);
    setLoadError('');

    if (eng.currentModel) {
      eng.scene.remove(eng.currentModel.group);
      eng.currentModel.dispose();
      eng.currentModel = null;
      eng.loadedExternalAssetId = null;
      eng.requestRender();
    }

    loadExternalArchitecturalModel(
      asset,
      latestPropsRef.current.finish,
      latestPropsRef.current.pattern,
      {
        isSoftwareGl: eng.isSoftwareGl,
        maxAnisotropy: eng.maxAnisotropy,
        wireframe: latestPropsRef.current.wireframe,
        onProgress: (loadedBytes, totalBytes) => {
          setLoadProgress({ loaded: loadedBytes, total: totalBytes });
        },
      },
      controller.signal,
    )
      .then((built) => {
        if (controller.signal.aborted || !engineRef.current) {
          built.dispose();
          return;
        }
        engineRef.current.currentModel = built;
        engineRef.current.loadedExternalAssetId = asset.id;
        engineRef.current.scene.add(built.group);
        engineRef.current.fitCamera(latestPropsRef.current.cameraPreset);
        setLoadedAssetId(asset.id);
        setLoadingModel(false);
        setLoadProgress(null);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setLoadingModel(false);
        setLoadProgress(null);
        setLoadError(
          err instanceof Error ? err.message : 'Hazır 3D model indirilirken bağlantı hatası oluştu.',
        );
      });

    return () => {
      controller.abort();
    };
  }, [asset, retryNonce]);

  // Apply finish, pattern, wireframe updates (for procedural: rebuild; for external: instant non-destructive PBR update!)
  useEffect(() => {
    const eng = engineRef.current;
    if (!eng) return;

    const isExternal = isExternalProvider(asset.modelSource?.provider);

    if (isExternal) {
      if (eng.currentModel && eng.loadedExternalAssetId === asset.id) {
        applyFinishAndPatternToExternalModel(eng.currentModel.group, finish, pattern, wireframe);
        eng.requestRender(true);
      }
      return;
    }

    if (eng.currentModel) {
      eng.scene.remove(eng.currentModel.group);
      eng.currentModel.dispose();
      eng.currentModel = null;
    }

    const built = buildArchitecturalAssetMesh(asset, finish, {
      isSoftwareGl: eng.isSoftwareGl,
      maxAnisotropy: eng.maxAnisotropy,
      wireframe,
      pattern,
    });
    eng.currentModel = built;
    eng.scene.add(built.group);
    eng.fitCamera(cameraPreset);
    setLoadedAssetId(asset.id);
  }, [asset, finish, pattern, wireframe]);

  // Toggle grid visibility
  useEffect(() => {
    const eng = engineRef.current;
    if (!eng) return;
    eng.grid.visible = showGrid;
    eng.requestRender();
  }, [showGrid]);

  const handleCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    engineRef.current?.fitCamera(preset);
  };

  const handleExportGlb = async () => {
    setExportingGlb(true);
    try {
      const existingGroup =
        engineRef.current?.loadedExternalAssetId === asset.id
          ? engineRef.current?.currentModel?.group
          : null;
      await exportAssetAsGlb(asset, finish, pattern, existingGroup);
    } finally {
      setExportingGlb(false);
    }
  };

  const applyCustomColorAndMode = (hexValue: string, modeId: SurfaceModeId, labelOverride?: string) => {
    const cleanHex = /^#[0-9a-fA-F]{6}$/.test(hexValue) ? hexValue.toUpperCase() : '#202329';
    const mode = SURFACE_MODES.find((m) => m.id === modeId) ?? SURFACE_MODES[0];
    setCustomHex(cleanHex);
    setSurfaceMode(modeId);
    onApplyCustomFinish({
      id: `ozel-${cleanHex.slice(1).toLowerCase()}-${mode.id}`,
      label: labelOverride || `Özel ${mode.label} (${cleanHex})`,
      materialKind: mode.materialKind,
      primaryHex: cleanHex,
      secondaryHex: '#F5F6F8',
      accentHex: cleanHex,
      roughness: mode.roughness,
      metalness: mode.metalness,
      preserveOriginalTextures: false,
    });
  };

  const applyCustomRugPalette = (pHex: string, sHex: string, aHex: string) => {
    const cleanP = /^#[0-9a-fA-F]{6}$/.test(pHex) ? pHex.toUpperCase() : '#EFEAE1';
    const cleanS = /^#[0-9a-fA-F]{6}$/.test(sHex) ? sHex.toUpperCase() : '#B8A997';
    const cleanA = /^#[0-9a-fA-F]{6}$/.test(aHex) ? aHex.toUpperCase() : '#5E5348';
    setRugPrimaryHex(cleanP);
    setRugSecondaryHex(cleanS);
    setRugAccentHex(cleanA);
    onApplyCustomFinish({
      id: `ozel-hali-${cleanP.slice(1).toLowerCase()}-${cleanS.slice(1).toLowerCase()}`,
      label: `Özel 3 Ton (${cleanP} / ${cleanS})`,
      materialKind: 'rug',
      primaryHex: cleanP,
      secondaryHex: cleanS,
      accentHex: cleanA,
      roughness: 0.92,
      metalness: 0.0,
      preserveOriginalTextures: false,
      paletteRecolorMode: 'tri-tone-rug',
    });
  };

  const applyCustomMultiPartCombo = (pHex: string, sHex: string, aHex: string) => {
    const cleanP = /^#[0-9a-fA-F]{6}$/.test(pHex) ? pHex.toUpperCase() : '#ECE5D8';
    const cleanS = /^#[0-9a-fA-F]{6}$/.test(sHex) ? sHex.toUpperCase() : '#63432D';
    const cleanA = /^#[0-9a-fA-F]{6}$/.test(aHex) ? aHex.toUpperCase() : '#C6A056';
    setRugPrimaryHex(cleanP);
    setRugSecondaryHex(cleanS);
    setRugAccentHex(cleanA);
    const refParts = finish.partFinishes || retailCombos[0]?.partFinishes;
    onApplyCustomFinish({
      id: `ozel-kombin-${cleanP.slice(1).toLowerCase()}-${cleanS.slice(1).toLowerCase()}-${cleanA.slice(1).toLowerCase()}`,
      label: `Özel Kombin (${cleanP} · ${cleanS})`,
      comboSummary: `Ana: ${cleanP} · İkincil: ${cleanS} · Detay: ${cleanA}`,
      materialKind: finish.materialKind,
      primaryHex: cleanP,
      secondaryHex: cleanS,
      accentHex: cleanA,
      roughness: refParts?.primary.roughness ?? finish.roughness,
      metalness: refParts?.primary.metalness ?? finish.metalness,
      preserveOriginalTextures: false,
      paletteRecolorMode: 'multi-part-retail',
      comboRole: activeComboRole,
      partFinishes: {
        primary: {
          hex: cleanP,
          roughness: refParts?.primary.roughness ?? finish.roughness,
          metalness: refParts?.primary.metalness ?? finish.metalness,
        },
        secondary: {
          hex: cleanS,
          roughness: refParts?.secondary.roughness ?? 0.45,
          metalness: refParts?.secondary.metalness ?? 0.15,
        },
        accent: {
          hex: cleanA,
          roughness: refParts?.accent.roughness ?? 0.24,
          metalness: refParts?.accent.metalness ?? 0.9,
        },
        ...(refParts?.ceramic ? { ceramic: refParts.ceramic } : {}),
        ...(refParts?.glass ? { glass: refParts.glass } : {}),
      },
    });
  };

  const blendUrl = asset.modelSource?.blendUrl;
  const isModelPending =
    loadingModel || (isExternalAsset && loadedAssetId !== asset.id && !loadError);
  const isModelReady = loadedAssetId === asset.id && !loadingModel && !loadError;
  const progressText = loadProgress
    ? loadProgress.total > 0
      ? `3D model yükleniyor... %${Math.min(99, Math.round((loadProgress.loaded / loadProgress.total) * 100))} (${(loadProgress.loaded / 1048576).toFixed(1)} MB)`
      : `3D model yükleniyor... ${(loadProgress.loaded / 1048576).toFixed(1)} MB`
    : '3D model yükleniyor...';

  return (
    <div
      className="relative w-full h-[520px] lg:h-full min-h-[520px] rounded-lg overflow-hidden border border-[#272B33] bg-[#242830]"
      data-testid="three-viewport-shell"
      data-model-loaded={isModelReady ? 'true' : 'false'}
      data-active-finish={finish.id}
      data-active-hex={finish.primaryHex}
      data-active-pattern={pattern.id}
    >
      {/* Dedicated isolated WebGL canvas mount container */}
      {!webglError ? (
        <div
          ref={mountRef}
          data-testid="three-canvas-container"
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#242830]">
          <img
            src={asset.thumbnailUrl}
            alt={asset.name}
            referrerPolicy="no-referrer"
            className="max-h-72 object-contain rounded-lg mb-4"
          />
          <p className="text-xs text-[#D1D5DB]">
            WebGL önizleme bu cihazda devre dışı. Referans görsel gösteriliyor.
          </p>
        </div>
      )}

      {/* Clean non-blocking loading badge when downloading ready-made GLTF/GLB */}
      {isModelPending && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 bg-[#161920] border border-[#323846] text-white text-xs font-medium px-3.5 py-2 rounded-md shadow-lg">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#60A5FA]" aria-hidden="true" />
            <span className="tabular-nums">{progressText}</span>
          </div>
        </div>
      )}

      {/* Error state if network blocked external CDN */}
      {loadError && !isModelPending && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-[#242830]">
          <img
            src={asset.thumbnailUrl}
            alt={asset.name}
            referrerPolicy="no-referrer"
            className="max-h-60 object-contain rounded-md mb-3 border border-[#323846]"
          />
          <p className="text-xs font-medium text-white">3D model yüklenemedi</p>
          <p className="text-[11px] text-[#A1A8B5] mt-1 max-w-md">{loadError}</p>
          <button
            type="button"
            onClick={() => setRetryNonce((n) => n + 1)}
            className="mt-3 h-7 px-3 text-[11px] font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-md cursor-pointer"
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {/* Minimal top-left architectural readout (no backdrop-blur over WebGL) */}
      <div className="pointer-events-none absolute top-3 left-3 z-10 bg-[#161920]/95 border border-[#323846] rounded-md px-3 py-1.5 max-w-[440px]">
        <p className="text-xs font-medium text-white truncate">{asset.name}</p>
        <p className="text-[11px] font-mono tabular-nums text-[#A1A8B5] truncate">
          {formatDimensionsText(asset)} · {finish.label} · {pattern.label}
        </p>
        {finish.comboSummary && !finish.preserveOriginalTextures && (
          <p className="text-[10px] text-[#93C5FD] truncate mt-0.5">{finish.comboSummary}</p>
        )}
      </div>

      {/* Ultra-compact, collapsible bottom control dock + floating Custom RAL/HEX Palette Popover */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-24px)] max-w-[1120px] flex flex-col items-center">
        {/* Custom RAL / HEX Architectural Color Studio Popover (opens neatly above dock) */}
        {paletteOpen && !dockCollapsed && (
          <div
            role="dialog"
            aria-label="Özel mimari renk ve doku seçici"
            className="w-full max-w-[760px] mb-2 bg-white border border-[#D8DCE3] rounded-xl p-3.5 shadow-xl text-[#111318]"
          >
            <div className="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b border-[#EEF1F5]">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#1E40AF]" aria-hidden="true" />
                <span className="text-xs font-semibold">
                  Mimari Renk & Doku Stüdyosu (Canlı PBR + Blender BPY)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPaletteOpen(false)}
                aria-label="Renk ve doku penceresini kapat"
                className="p-1 rounded-md text-[#6B7280] hover:text-[#111318] hover:bg-[#F1F3F6] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            {/* Designer Tri-Tone Rug Palettes OR Real-World Multi-Part Retail Combos OR Standard 16 RAL Presets */}
            {isRugMode ? (
              <div className="mb-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-semibold text-[#525866]">
                    Moda Tasarım Halı Kombinasyonları (Desen Korumalı 3 Tonlu PBR)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {PROCEDURAL_RUG_DESIGNER_FINISHES.map((combo) => {
                    const isActive =
                      !finish.preserveOriginalTextures &&
                      finish.primaryHex.toLowerCase() === combo.primaryHex.toLowerCase() &&
                      finish.secondaryHex.toLowerCase() === combo.secondaryHex.toLowerCase();
                    return (
                      <button
                        key={combo.id}
                        type="button"
                        onClick={() => onSelectFinish(combo.id)}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-md border text-[11px] font-medium transition-colors cursor-pointer truncate ${
                          isActive
                            ? 'bg-[#09090B] text-white border-[#09090B]'
                            : 'bg-[#F8F9FA] text-[#111318] border-[#E4E7EC] hover:border-[#9CA3AF]'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                          style={getSwatchStyle(combo)}
                          aria-hidden="true"
                        />
                        <span className="truncate">{combo.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : isRetailMultiPartMode && retailCombos.length > 0 ? (
              <div className="mb-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-semibold text-[#525866]">
                    Gerçek Satış Renk Kombinasyonları (Çok Parçalı PBR)
                  </span>
                  {finish.comboSummary && (
                    <span className="text-[10.5px] text-[#1D4ED8] font-medium truncate max-w-[360px]">
                      {finish.comboSummary}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
                  {retailCombos.map((combo) => {
                    const isActive = !isCustomFinishActive && finish.id === combo.id;
                    return (
                      <button
                        key={combo.id}
                        type="button"
                        onClick={() => onSelectFinish(combo.id)}
                        title={combo.comboSummary || combo.label}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-left transition-colors cursor-pointer min-w-0 ${
                          isActive
                            ? 'bg-[#09090B] text-white border-[#09090B]'
                            : 'bg-[#F8F9FA] text-[#111318] border-[#E4E7EC] hover:border-[#9CA3AF]'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/25 shrink-0"
                          style={getSwatchStyle(combo)}
                          aria-hidden="true"
                        />
                        <span className="text-[11px] font-medium truncate">{combo.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
                {ARCHITECTURAL_RAL_PRESETS.map((preset) => {
                  const isActive =
                    !finish.preserveOriginalTextures &&
                    finish.primaryHex.toLowerCase() === preset.hex.toLowerCase() &&
                    Math.abs(finish.metalness - preset.metalness) < 0.25;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        const mode: SurfaceModeId =
                          preset.metalness >= 0.6
                            ? 'metallic'
                            : preset.roughness < 0.18
                              ? 'glossy'
                              : preset.roughness < 0.43
                                ? 'satin'
                                : 'matte';
                        setCustomHex(preset.hex);
                        setSurfaceMode(mode);
                        onApplyCustomFinish({
                          id: `ral-${preset.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                          label: preset.label,
                          materialKind: preset.materialKind,
                          primaryHex: preset.hex,
                          secondaryHex: '#F6F7F9',
                          accentHex: preset.hex,
                          roughness: preset.roughness,
                          metalness: preset.metalness,
                          preserveOriginalTextures: false,
                        });
                      }}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md border text-[11px] font-medium transition-colors cursor-pointer truncate ${
                        isActive
                          ? 'bg-[#09090B] text-white border-[#09090B]'
                          : 'bg-[#F8F9FA] text-[#111318] border-[#E4E7EC] hover:border-[#9CA3AF]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                        style={
                          preset.metalness >= 0.65
                            ? {
                                background: `linear-gradient(135deg, #FFFFFF 0%, ${preset.hex} 50%, #1F242C 100%)`,
                              }
                            : { backgroundColor: preset.hex }
                        }
                        aria-hidden="true"
                      />
                      <span className="truncate">{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tactile Procedural PBR Texture Selector */}
            {asset.patterns.length > 1 && (
              <div className="pt-2.5 mb-2.5 border-t border-[#EEF1F5]">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-semibold text-[#525866]">
                    Yüzey Dokusu (Canlı PBR Kabartma & Normal)
                  </span>
                  <span className="text-[10.5px] text-[#71717A] truncate max-w-[380px]">
                    {pattern.description}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1" role="group" aria-label="Mimari doku seçimi">
                  {asset.patterns.map((p) => {
                    const active = p.id === pattern.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => onSelectPattern(p.id)}
                        aria-pressed={active}
                        className={`h-6.5 px-2 text-[11px] font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                            : 'bg-[#F8F9FA] text-[#27272A] border-[#E4E7EC] hover:border-[#9CA3AF]'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom Color Mixer: 3-Tone Rug Mixer OR 3-Part Retail Combo Mixer OR Single Color Wheel */}
            {isRugMode ? (
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t border-[#EEF1F5]">
                <span className="text-[11px] font-semibold text-[#525866]">
                  Özel 3 Renkli Kombin:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#111318]">
                    <span className="text-[#525866]">Zemin</span>
                    <input
                      type="color"
                      aria-label="Halı zemin rengi"
                      value={/^#[0-9a-fA-F]{6}$/.test(rugPrimaryHex) ? rugPrimaryHex : '#EFEAE1'}
                      onChange={(e) => applyCustomRugPalette(e.target.value, rugSecondaryHex, rugAccentHex)}
                      className="w-7 h-7 p-0.5 bg-white border border-[#D8DCE3] rounded-md cursor-pointer"
                    />
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#111318]">
                    <span className="text-[#525866]">Desen</span>
                    <input
                      type="color"
                      aria-label="Halı desen rengi"
                      value={/^#[0-9a-fA-F]{6}$/.test(rugSecondaryHex) ? rugSecondaryHex : '#B8A997'}
                      onChange={(e) => applyCustomRugPalette(rugPrimaryHex, e.target.value, rugAccentHex)}
                      className="w-7 h-7 p-0.5 bg-white border border-[#D8DCE3] rounded-md cursor-pointer"
                    />
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#111318]">
                    <span className="text-[#525866]">Kontrast</span>
                    <input
                      type="color"
                      aria-label="Halı kontrast bordür rengi"
                      value={/^#[0-9a-fA-F]{6}$/.test(rugAccentHex) ? rugAccentHex : '#5E5348'}
                      onChange={(e) => applyCustomRugPalette(rugPrimaryHex, rugSecondaryHex, e.target.value)}
                      className="w-7 h-7 p-0.5 bg-white border border-[#D8DCE3] rounded-md cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            ) : isRetailMultiPartMode ? (
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t border-[#EEF1F5]">
                <span className="text-[11px] font-semibold text-[#525866]">
                  Özel 3 Bölge Kombin:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#111318]">
                    <span className="text-[#525866]">Ana Gövde</span>
                    <input
                      type="color"
                      aria-label="Ana gövde rengi"
                      value={/^#[0-9a-fA-F]{6}$/.test(rugPrimaryHex) ? rugPrimaryHex : '#ECE5D8'}
                      onChange={(e) => applyCustomMultiPartCombo(e.target.value, rugSecondaryHex, rugAccentHex)}
                      className="w-7 h-7 p-0.5 bg-white border border-[#D8DCE3] rounded-md cursor-pointer"
                    />
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#111318]">
                    <span className="text-[#525866]">Ayak / Tabla</span>
                    <input
                      type="color"
                      aria-label="İkincil parça rengi"
                      value={/^#[0-9a-fA-F]{6}$/.test(rugSecondaryHex) ? rugSecondaryHex : '#63432D'}
                      onChange={(e) => applyCustomMultiPartCombo(rugPrimaryHex, e.target.value, rugAccentHex)}
                      className="w-7 h-7 p-0.5 bg-white border border-[#D8DCE3] rounded-md cursor-pointer"
                    />
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#111318]">
                    <span className="text-[#525866]">Metal / Detay</span>
                    <input
                      type="color"
                      aria-label="Detay ve metal rengi"
                      value={/^#[0-9a-fA-F]{6}$/.test(rugAccentHex) ? rugAccentHex : '#C6A056'}
                      onChange={(e) => applyCustomMultiPartCombo(rugPrimaryHex, rugSecondaryHex, e.target.value)}
                      className="w-7 h-7 p-0.5 bg-white border border-[#D8DCE3] rounded-md cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t border-[#EEF1F5]">
                <div className="flex items-center gap-2">
                  <label htmlFor="custom-color-wheel" className="text-[11px] font-medium text-[#525866]">
                    Özel Ton:
                  </label>
                  <input
                    id="custom-color-wheel"
                    type="color"
                    value={/^#[0-9a-fA-F]{6}$/.test(customHex) ? customHex : '#202329'}
                    onChange={(e) => applyCustomColorAndMode(e.target.value, surfaceMode)}
                    className="w-7 h-7 p-0.5 bg-white border border-[#D8DCE3] rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    aria-label="HEX renk kodu"
                    value={customHex}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomHex(val);
                      if (/^#[0-9a-fA-F]{6}$/.test(val)) {
                        applyCustomColorAndMode(val, surfaceMode);
                      }
                    }}
                    className="w-20 h-7 px-2 text-[11px] font-mono bg-[#F8F9FA] border border-[#D8DCE3] rounded-md text-[#111318]"
                  />
                </div>

                <div className="flex items-center gap-1 bg-[#F1F3F6] p-0.5 rounded-lg" role="group" aria-label="Yüzey parlaklık türü">
                  {SURFACE_MODES.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => applyCustomColorAndMode(customHex, m.id)}
                      aria-pressed={surfaceMode === m.id}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                        surfaceMode === m.id
                          ? 'bg-white text-[#111318] shadow-xs'
                          : 'text-[#525866] hover:text-[#111318]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => setDockCollapsed((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium text-[#111318] bg-white border border-b-0 border-[#D8DCE3] rounded-t-lg hover:bg-[#F8F9FA] cursor-pointer whitespace-nowrap"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              <span>3D Kontrolleri Göster</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Kontrolleri Gizle</span>
            </>
          )}
        </button>

        {!dockCollapsed && (
          <div className="w-full bg-white border border-[#D8DCE3] rounded-lg px-2 py-1.5 shadow-md flex flex-wrap lg:flex-nowrap items-center justify-between gap-x-1.5 gap-y-1.5">
            {/* Compact Swatch Selector + Custom RAL/HEX Color Trigger */}
            <div className="flex items-center gap-1 min-w-0 flex-wrap lg:flex-nowrap">
              <div className="flex items-center gap-0.5 flex-wrap lg:flex-nowrap" role="group" aria-label="Kaplama renk seçimi">
                {asset.finishes.map((f) => {
                  const active = !isCustomFinishActive && f.id === finish.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => onSelectFinish(f.id)}
                      aria-pressed={active}
                      aria-label={`Kaplama: ${f.label}`}
                      title={f.comboSummary ? `${f.label} — ${f.comboSummary}` : f.label}
                      className={`inline-flex items-center gap-1 h-7 px-1 rounded-md border text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-[#09090B] text-white border-[#09090B] px-1.5'
                          : 'bg-[#F8F9FA] text-[#09090B] border-[#E5E7EB] hover:border-[#9CA3AF]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/25 shrink-0"
                        style={getSwatchStyle(f)}
                        aria-hidden="true"
                      />
                      {active && <span className="max-w-[118px] truncate">{f.label}</span>}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setPaletteOpen((o) => !o)}
                  aria-expanded={paletteOpen}
                  aria-label="Özel RAL veya HEX renk ve doku seçici aç"
                  title="Renk & Doku Stüdyosu (RAL / HEX / PBR)"
                  className={`inline-flex items-center gap-1 h-7 px-2 rounded-md border text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isCustomFinishActive || paletteOpen
                      ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                      : 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE] hover:bg-[#DBEAFE]'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span className="max-w-[84px] truncate">
                    {isCustomFinishActive ? finish.label : 'Renk & Doku'}
                  </span>
                </button>
              </div>
            </div>

            {/* Compact Pattern / Texture Preset Selector */}
            {asset.patterns.length > 1 && (
              <div className="flex items-center gap-1 border-l border-[#E5E7EB] pl-1.5 shrink-0">
                <select
                  id="viewport-pattern-select"
                  aria-label="Doku ve desen seçimi"
                  value={pattern.id}
                  onChange={(e) => onSelectPattern(e.target.value as PatternId)}
                  className="h-7 max-w-[126px] pl-1.5 pr-4 text-[11px] font-medium bg-[#F8F9FA] border border-[#E5E7EB] rounded-md text-[#09090B] focus:outline-none focus:border-[#1D4ED8] cursor-pointer"
                >
                  {asset.patterns.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Compact Camera Presets + Grid/Wireframe Icons */}
            <div className="flex items-center gap-1 lg:border-l lg:border-[#E4E7EC] lg:pl-1.5 shrink-0">
              <div className="inline-flex items-center bg-[#F1F3F6] p-0.5 rounded-md">
                {(Object.keys(CAMERA_LABELS) as CameraPreset[]).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleCameraPreset(preset)}
                    className={`px-1.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                      cameraPreset === preset
                        ? 'bg-white text-[#111318] shadow-xs'
                        : 'text-[#525866] hover:text-[#111318]'
                    }`}
                  >
                    {CAMERA_LABELS[preset]}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowGrid((g) => !g)}
                aria-pressed={showGrid}
                aria-label="Metrik ızgarayı aç veya kapat"
                title="Metrik Izgara"
                className={`h-7 w-7 inline-flex items-center justify-center rounded-md border transition-colors cursor-pointer shrink-0 ${
                  showGrid
                    ? 'bg-[#EFF4FF] border-[#1E40AF] text-[#1E40AF]'
                    : 'bg-white border-[#E4E7EC] text-[#525866]'
                }`}
              >
                <Grid3x3 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => setWireframe((w) => !w)}
                aria-pressed={wireframe}
                aria-label="Tel kafes görünümünü aç veya kapat"
                title="Tel Kafes (Wireframe)"
                className={`h-7 w-7 inline-flex items-center justify-center rounded-md border transition-colors cursor-pointer shrink-0 ${
                  wireframe
                    ? 'bg-[#EFF4FF] border-[#1E40AF] text-[#1E40AF]'
                    : 'bg-white border-[#E4E7EC] text-[#525866]'
                }`}
              >
                <Box className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            {/* Direct Blender Exports (.GLB / .PY / .BLEND) */}
            <div className="flex items-center gap-1 lg:border-l lg:border-[#E4E7EC] lg:pl-1.5 ml-auto shrink-0">
              <button
                type="button"
                onClick={handleExportGlb}
                disabled={exportingGlb || isModelPending}
                className="inline-flex items-center gap-1 h-7 px-2.5 text-[11px] font-medium text-white bg-[#1E40AF] hover:bg-[#1E3A8A] disabled:opacity-60 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Download className="w-3 h-3" aria-hidden="true" />
                <span>{exportingGlb ? 'Hazırlanıyor...' : '.GLB'}</span>
              </button>
              <button
                type="button"
                onClick={onDownloadPython}
                className="inline-flex items-center gap-1 h-7 px-2.5 text-[11px] font-medium text-[#111318] bg-[#F1F3F6] hover:bg-[#E4E7EC] rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Download className="w-3 h-3" aria-hidden="true" />
                <span>.PY</span>
              </button>
              {blendUrl && (
                <a
                  href={blendUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 h-7 px-2.5 text-[11px] font-medium text-[#111318] bg-[#FEF3C7] hover:bg-[#FDE68A] border border-[#F59E0B]/30 rounded-md transition-colors whitespace-nowrap shrink-0"
                  title="Orijinal Blender .blend dosyasını indir"
                >
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  <span>.BLEND</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
