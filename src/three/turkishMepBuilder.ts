import * as THREE from 'three';
import type {
  ArchitecturalAsset,
  AssetArchetype,
  MaterialFinish,
} from '../lib/catalogTypes';
import type { BuiltAssetModel } from './assetMeshBuilder';

export const TURKISH_MEP_ARCHETYPES = new Set<AssetArchetype>([
  'tr_fuse_box',
  'tr_video_intercom',
  'tr_tv_data_socket',
  'tr_gas_valve_assembly',
  'tr_gas_meter_g4',
  'tr_manifold_cabinet',
  'tr_vertical_radiator',
  'tr_room_thermostat',
  'tr_split_ac_unit',
  'tr_water_meter_group',
  'tr_elevator_landing',
  'tr_elevator_cabin',
]);

export function isTurkishMepArchetype(archetype: AssetArchetype): boolean {
  return TURKISH_MEP_ARCHETYPES.has(archetype);
}

function getLuminance(hex: string): number {
  const c = new THREE.Color(hex);
  return 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
}

function createCanvasTex(
  width: number,
  height: number,
  maxAnisotropy: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  draw(ctx, width, height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(maxAnisotropy, 8);
  tex.needsUpdate = true;
  return tex;
}

function createBrushedTex(baseHex: string, maxAnisotropy: number, vertical = false): THREE.CanvasTexture {
  return createCanvasTex(512, 512, maxAnisotropy, (ctx, w, h) => {
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, w, h);
    const isDark = getLuminance(baseHex) < 0.35;
    const steps = vertical ? w : h;
    for (let i = 0; i < steps; i += 2) {
      const alpha = ((i * 41) % 11) * 0.0045;
      ctx.fillStyle = isDark
        ? `rgba(255,255,255,${alpha.toFixed(3)})`
        : `rgba(20,24,32,${alpha.toFixed(3)})`;
      if (vertical) ctx.fillRect(i, 0, 1, h);
      else ctx.fillRect(0, i, w, 1);
    }
  });
}

function createWordmarkTex(
  text: string,
  color: string,
  maxAnisotropy: number,
  subtitle?: string,
): THREE.CanvasTexture {
  return createCanvasTex(512, 160, maxAnisotropy, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.font = '800 54px "Inter", "Segoe UI", Arial, sans-serif';
    ctx.fillText(text, w / 2, subtitle ? h * 0.4 : h * 0.52);
    if (subtitle) {
      ctx.globalAlpha = 0.78;
      ctx.font = '600 22px "Inter", "Segoe UI", Arial, sans-serif';
      ctx.fillText(subtitle, w / 2, h * 0.76);
    }
  });
}

export function buildTurkishMepModel(
  asset: ArchitecturalAsset,
  finish: MaterialFinish,
  options: { maxAnisotropy: number },
): BuiltAssetModel {
  const group = new THREE.Group();
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometriesToDispose.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materialsToDispose.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T): T => {
    texturesToDispose.push(t);
    return t;
  };

  const addMesh = (
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    pos?: [number, number, number],
    rot?: [number, number, number],
    parent: THREE.Object3D = group,
  ): THREE.Mesh => {
    const mesh = new THREE.Mesh(trackGeo(geo), mat);
    if (pos) mesh.position.set(pos[0], pos[1], pos[2]);
    if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  const pf = finish.partFinishes;
  const primaryHex = pf?.primary.hex || finish.primaryHex;
  const secondaryHex = pf?.secondary.hex || finish.secondaryHex;
  const accentHex = pf?.accent.hex || finish.accentHex;
  const primaryRough = pf?.primary.roughness ?? finish.roughness;
  const primaryMetal = pf?.primary.metalness ?? finish.metalness;
  const secondaryRough = pf?.secondary.roughness ?? 0.32;
  const secondaryMetal = pf?.secondary.metalness ?? 0.4;
  const accentRough = pf?.accent.roughness ?? 0.22;
  const accentMetal = pf?.accent.metalness ?? 0.85;

  const makePrimaryMat = () =>
    trackMat(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(primaryHex),
        roughness: primaryRough,
        metalness: primaryMetal,
        clearcoat: primaryRough < 0.24 ? 0.45 : 0.08,
      }),
    );

  const makeSecondaryMat = () =>
    trackMat(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(secondaryHex),
        roughness: secondaryRough,
        metalness: secondaryMetal,
      }),
    );

  const makeAccentMat = () =>
    trackMat(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(accentHex),
        roughness: accentRough,
        metalness: accentMetal,
      }),
    );

  const w = asset.dimensionsCm.width / 100;
  const d = asset.dimensionsCm.depth / 100;
  const h = asset.dimensionsCm.height / 100;

  // ============================================================================
  // 1. Viko by Panasonic 24'lü & Siemens 18'li Sıva Altı Sigorta Kutusu
  // ============================================================================
  if (asset.archetype === 'tr_fuse_box') {
    const isSiemens = asset.id.includes('siemens');
    const frameMat = makePrimaryMat();
    const innerMat = makeSecondaryMat();
    const accentMat = makeAccentMat();
    const breakerBodyMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#EDF0F4', roughness: 0.34, metalness: 0.05 }),
    );
    const dinRailMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#9CA3AF', roughness: 0.3, metalness: 0.85 }),
    );
    const darkSlotMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#1E242D', roughness: 0.65, metalness: 0.2 }),
    );
    const switchBlackMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#1E293B', roughness: 0.38, metalness: 0.12 }),
    );
    const rccbBlueMat = trackMat(
      new THREE.MeshStandardMaterial({ color: isSiemens ? '#0D9488' : '#2563EB', roughness: 0.32, metalness: 0.1 }),
    );
    const testBtnMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#FACC15', roughness: 0.35, metalness: 0.05 }),
    );
    const copperMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#C27438', roughness: 0.24, metalness: 0.92 }),
    );

    // Recessed back wall box (mostly inside wall)
    addMesh(new THREE.BoxGeometry(w - 0.028, h - 0.028, d * 0.65), darkSlotMat, [0, h / 2, -d * 0.25]);
    // Flush architectural front outer frame
    addMesh(new THREE.BoxGeometry(w, h, 0.024), frameMat, [0, h / 2, 0.012]);
    // Inner white/grey molded fascia plate with 2 DIN windows
    addMesh(new THREE.BoxGeometry(w - 0.036, h - 0.044, 0.014), innerMat, [0, h / 2, 0.022]);

    const rows = isSiemens ? 2 : 2;
    const colsPerRow = isSiemens ? 9 : 12;
    const rowYs = [h * 0.64, h * 0.32];
    const moduleW = (w - 0.075) / colsPerRow;

    for (let r = 0; r < rows; r++) {
      const ry = rowYs[r];
      // Dark cutout channel + steel DIN rail
      addMesh(new THREE.BoxGeometry(w - 0.064, 0.072, 0.012), darkSlotMat, [0, ry, 0.026]);
      addMesh(new THREE.BoxGeometry(w - 0.07, 0.028, 0.008), dinRailMat, [0, ry, 0.029]);

      // Populate individual miniature circuit breakers (MCB) + 30mA RCCB on top-left
      const startX = -(w - 0.075) / 2 + moduleW / 2;
      for (let c = 0; c < colsPerRow; c++) {
        // Leave 1-2 spare blank slots on bottom right for realism
        if (r === 1 && c >= colsPerRow - 2) continue;
        const cx = startX + c * moduleW;
        const isRccb = r === 0 && c < 2;
        addMesh(
          new THREE.BoxGeometry(moduleW * 0.88, 0.064, 0.024),
          breakerBodyMat,
          [cx, ry, 0.034],
        );
        // Circuit breaker toggle lever (ON position — angled up)
        addMesh(
          new THREE.BoxGeometry(moduleW * 0.52, 0.014, 0.014),
          isRccb ? rccbBlueMat : c === 2 && r === 0 ? accentMat : switchBlackMat,
          [cx, ry + 0.008, 0.048],
          [-0.35, 0, 0],
        );
        // Tiny yellow/blue Test button on RCCB
        if (r === 0 && c === 1) {
          addMesh(new THREE.BoxGeometry(0.007, 0.009, 0.006), testBtnMat, [cx, ry - 0.016, 0.047]);
        }
        // Small ON/OFF green-red indicator window
        const indMat = trackMat(
          new THREE.MeshBasicMaterial({ color: isRccb ? '#EF4444' : '#22C55E' }),
        );
        addMesh(new THREE.BoxGeometry(moduleW * 0.36, 0.005, 0.002), indMat, [cx, ry + 0.022, 0.047]);
      }

      // Circuit label legend strip below each row
      const labelTex = trackTex(
        createCanvasTex(512, 48, options.maxAnisotropy, (ctx, lw, lh) => {
          ctx.fillStyle = '#F8FAFC';
          ctx.fillRect(0, 0, lw, lh);
          ctx.strokeStyle = '#CBD5E1';
          ctx.lineWidth = 2;
          ctx.strokeRect(1, 1, lw - 2, lh - 2);
          ctx.fillStyle = '#1E293B';
          ctx.font = '700 18px "Inter", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const labels =
            r === 0
              ? ['KAÇAK AKIM', 'ANA', 'SALON', 'MUTFAK', 'FIRIN', 'BULAŞIK']
              : ['KOMBİ', 'KLİMA', 'ÇAMAŞIR', 'BANYO', 'AYDINLATMA', 'YEDEK'];
          labels.forEach((lbl, idx) => {
            ctx.fillText(lbl, ((idx + 0.5) / labels.length) * lw, lh / 2);
          });
        }),
      );
      const labelMat = trackMat(new THREE.MeshBasicMaterial({ map: labelTex }));
      addMesh(new THREE.PlaneGeometry(w - 0.072, 0.018), labelMat, [0, ry - 0.046, 0.03]);
    }

    // Copper ground/neutral busbar at top
    addMesh(new THREE.BoxGeometry(w - 0.14, 0.008, 0.008), copperMat, [0, h - 0.056, 0.032]);

    // Hinged translucent smoked polycarbonate door (slightly bevelled)
    const doorGlass = pf?.glass;
    const doorMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(doorGlass?.hex || '#374151'),
        transparent: true,
        opacity: doorGlass?.opacity ?? 0.42,
        roughness: doorGlass?.roughness ?? 0.08,
        metalness: 0.08,
        clearcoat: 1.0,
      }),
    );
    addMesh(new THREE.BoxGeometry(w - 0.022, h - 0.052, 0.01), doorMat, [0, h * 0.475, 0.058]);
    // Push-latch handle tab on right edge of cover
    addMesh(new THREE.BoxGeometry(0.014, 0.052, 0.012), frameMat, [w / 2 - 0.02, h * 0.475, 0.062]);

    // Crisp brand header (VIKO by Panasonic or SIEMENS)
    const brandColor = isSiemens
      ? '#009999'
      : getLuminance(primaryHex) > 0.45
        ? '#1E293B'
        : '#F8FAFC';
    const brandTex = trackTex(
      createWordmarkTex(
        isSiemens ? 'SIEMENS' : 'VIKO',
        brandColor,
        options.maxAnisotropy,
        isSiemens ? '5SL6 / 5SV · 18 MODÜL' : 'by Panasonic · 24 MODÜL',
      ),
    );
    const brandMat = trackMat(
      new THREE.MeshBasicMaterial({ map: brandTex, transparent: true, depthWrite: false }),
    );
    addMesh(new THREE.PlaneGeometry(0.14, 0.042), brandMat, [0, h - 0.026, 0.026]);
  }

  // ============================================================================
  // 2. Audio 7" Dokunmatik Görüntülü Diafon & Akıllı Ev İnterkom Paneli
  // ============================================================================
  else if (asset.archetype === 'tr_video_intercom') {
    const bodyMat = makePrimaryMat();
    const trimMat = makeAccentMat();

    // Ultra-slim wall mount backplate + metallic chamfer bezel
    addMesh(new THREE.BoxGeometry(w + 0.004, h + 0.004, d * 0.55), trimMat, [0, h / 2, d * 0.28]);
    addMesh(new THREE.BoxGeometry(w, h, d * 0.65), bodyMat, [0, h / 2, d * 0.52]);

    // 7" HD IPS live building entrance intercom screen texture + right touch icons
    const screenTex = trackTex(
      createCanvasTex(640, 420, options.maxAnisotropy, (ctx, sw, sh) => {
        // Sleek dark glass surround
        ctx.fillStyle = '#0F141D';
        ctx.fillRect(0, 0, sw, sh);

        // Left 72%: Live building lobby camera feed graphic
        const camW = sw * 0.72;
        const grad = ctx.createLinearGradient(0, 0, camW, sh);
        grad.addColorStop(0, '#1E293B');
        grad.addColorStop(0.55, '#334155');
        grad.addColorStop(1, '#1E2530');
        ctx.fillStyle = grad;
        ctx.fillRect(14, 14, camW - 20, sh - 28);

        // Architectural entrance door silhouette in camera preview
        ctx.fillStyle = 'rgba(226, 232, 240, 0.14)';
        ctx.fillRect(camW * 0.25, 58, camW * 0.45, sh - 96);
        ctx.strokeStyle = 'rgba(226, 232, 240, 0.35)';
        ctx.lineWidth = 3;
        ctx.strokeRect(camW * 0.25, 58, camW * 0.45, sh - 96);

        // Camera HUD top bar
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fillRect(14, 14, camW - 20, 40);
        ctx.fillStyle = '#38BDF8';
        ctx.font = '700 18px "Inter", Arial, sans-serif';
        ctx.fillText('● BİNA GİRİŞİ KAMERA 1', 28, 40);
        ctx.fillStyle = '#E2E8F0';
        ctx.textAlign = 'right';
        ctx.fillText('14:25', camW - 20, 40);
        ctx.textAlign = 'left';

        // Bottom caption
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fillRect(14, sh - 52, camW - 20, 38);
        ctx.fillStyle = '#F8FAFC';
        ctx.font = '600 17px "Inter", Arial, sans-serif';
        ctx.fillText('Daire 12 · Görüntülü Görüşme Hazır', 28, sh - 28);

        // Right 28%: 4 backlit touch icon buttons (Kapı Aç, Konuş, Kamera, Güvenlik)
        const btnX = camW + 14;
        const btnW = sw - btnX - 18;
        const btns = [
          { label: 'KAPI AÇ', bg: '#15803D', icon: '🔑' },
          { label: 'KONUŞ', bg: '#1D4ED8', icon: '📞' },
          { label: 'KAMERA', bg: '#334155', icon: '📷' },
          { label: 'GÜVENLİK', bg: '#334155', icon: '🛡' },
        ];
        btns.forEach((b, idx) => {
          const by = 22 + idx * 94;
          ctx.fillStyle = b.bg;
          ctx.beginPath();
          ctx.roundRect(btnX, by, btnW, 78, 10);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'center';
          ctx.font = '700 16px "Inter", Arial, sans-serif';
          ctx.fillText(b.label, btnX + btnW / 2, by + 46);
        });
      }),
    );

    const screenMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: screenTex,
        emissiveMap: screenTex,
        emissive: new THREE.Color('#FFFFFF'),
        emissiveIntensity: 0.42,
        roughness: 0.08,
        metalness: 0.1,
      }),
    );
    addMesh(new THREE.PlaneGeometry(w - 0.022, h - 0.032), screenMat, [0, h * 0.535, d * 0.86]);

    // Crisp AUDIO brand wordmark along lower bezel
    const audioCol = getLuminance(primaryHex) > 0.45 ? '#1D4ED8' : '#E2E8F0';
    const audioTex = trackTex(createWordmarkTex('AUDIO', audioCol, options.maxAnisotropy));
    const audioMat = trackMat(
      new THREE.MeshBasicMaterial({ map: audioTex, transparent: true, depthWrite: false }),
    );
    addMesh(new THREE.PlaneGeometry(0.056, 0.018), audioMat, [0, 0.011, d * 0.865]);
  }

  // ============================================================================
  // 3. Viko Karre TV-Uydu (SAT) + RJ45 Cat6 İnternet İkili Priz Seti
  // ============================================================================
  else if (asset.archetype === 'tr_tv_data_socket') {
    const frameMat = makePrimaryMat();
    const plateMat = makeSecondaryMat();
    const metalMat = makeAccentMat();
    const darkPortMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#11151C', roughness: 0.65, metalness: 0.2 }),
    );
    const goldPinMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#D4AF37', roughness: 0.2, metalness: 0.96 }),
    );

    // Double flush Viko Karre square outer frame
    addMesh(new THREE.BoxGeometry(w, h, 0.012), frameMat, [0, h / 2, 0.006]);
    // Subtle center divider line
    addMesh(new THREE.BoxGeometry(0.006, h - 0.016, 0.014), frameMat, [0, h / 2, 0.007]);

    // Left module: TV / SAT Coaxial F-Connector Plate
    const lx = -w * 0.235;
    addMesh(new THREE.BoxGeometry(w * 0.4, h * 0.72, 0.008), plateMat, [lx, h / 2, 0.013]);
    // Threaded hex collar + coaxial F-connector barrel + copper center conductor
    addMesh(
      new THREE.CylinderGeometry(0.0085, 0.0085, 0.008, 6),
      metalMat,
      [lx, h / 2, 0.018],
      [Math.PI / 2, 0, 0],
    );
    addMesh(
      new THREE.CylinderGeometry(0.0055, 0.0055, 0.014, 20),
      metalMat,
      [lx, h / 2, 0.022],
      [Math.PI / 2, 0, 0],
    );
    addMesh(
      new THREE.CylinderGeometry(0.0022, 0.0022, 0.015, 12),
      darkPortMat,
      [lx, h / 2, 0.023],
      [Math.PI / 2, 0, 0],
    );
    addMesh(
      new THREE.CylinderGeometry(0.0008, 0.0008, 0.016, 10),
      goldPinMat,
      [lx, h / 2, 0.0235],
      [Math.PI / 2, 0, 0],
    );

    // Right module: RJ45 Cat6 Ethernet Socket
    const rx = w * 0.235;
    addMesh(new THREE.BoxGeometry(w * 0.4, h * 0.72, 0.008), plateMat, [rx, h / 2, 0.013]);
    // Angled dust shutter + recessed RJ45 jack cavity + gold contacts
    addMesh(new THREE.BoxGeometry(0.024, 0.022, 0.006), frameMat, [rx, h / 2, 0.016]);
    addMesh(new THREE.BoxGeometry(0.013, 0.012, 0.008), darkPortMat, [rx, h / 2 - 0.001, 0.017]);
    for (let p = 0; p < 6; p++) {
      addMesh(
        new THREE.BoxGeometry(0.0008, 0.004, 0.002),
        goldPinMat,
        [rx - 0.004 + p * 0.0016, h / 2 + 0.002, 0.021],
      );
    }

    // Crisp SAT / CAT6 & VIKO labels
    const txtCol = getLuminance(primaryHex) > 0.45 ? '#334155' : '#E2E8F0';
    const satTex = trackTex(createWordmarkTex('TV / SAT', txtCol, options.maxAnisotropy));
    const catTex = trackTex(createWordmarkTex('CAT 6 · RJ45', txtCol, options.maxAnisotropy));
    const vikoTex = trackTex(createWordmarkTex('VIKO', txtCol, options.maxAnisotropy));
    addMesh(
      new THREE.PlaneGeometry(0.032, 0.01),
      trackMat(new THREE.MeshBasicMaterial({ map: satTex, transparent: true, depthWrite: false })),
      [lx, h * 0.76, 0.018],
    );
    addMesh(
      new THREE.PlaneGeometry(0.036, 0.01),
      trackMat(new THREE.MeshBasicMaterial({ map: catTex, transparent: true, depthWrite: false })),
      [rx, h * 0.76, 0.018],
    );
    addMesh(
      new THREE.PlaneGeometry(0.028, 0.009),
      trackMat(new THREE.MeshBasicMaterial({ map: vikoTex, transparent: true, depthWrite: false })),
      [0, h * 0.14, 0.0135],
    );
  }

  // ============================================================================
  // 4. E.C.A. Küresel Doğalgaz Vanası (Sarı Kol), İGDAŞ Boru & Çelik Flex Grubu
  // ============================================================================
  else if (asset.archetype === 'tr_gas_valve_assembly') {
    const pipeMat = makePrimaryMat();
    const brassMat = makeSecondaryMat();
    const flexMat = makeAccentMat();
    const yellowHandleMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#EAB308', roughness: 0.3, metalness: 0.18 }),
    );
    const clampMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#374151', roughness: 0.55, metalness: 0.5 }),
    );
    const solenoidMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#1F2937', roughness: 0.36, metalness: 0.3 }),
    );

    const pipeX = -0.075;
    const pipeZ = 0.042;

    // Vertical İGDAŞ steel riser pipe
    addMesh(new THREE.CylinderGeometry(0.012, 0.012, h, 20), pipeMat, [pipeX, h / 2, pipeZ]);

    // 2 Rubber-lined wall pipe clamps with anchor studs
    for (const cy of [h * 0.2, h * 0.82]) {
      addMesh(new THREE.CylinderGeometry(0.016, 0.016, 0.018, 18), clampMat, [pipeX, cy, pipeZ]);
      addMesh(new THREE.BoxGeometry(0.042, 0.014, 0.038), clampMat, [pipeX, cy, pipeZ - 0.022]);
    }

    // 90° Tee branch to horizontal valve run at mid-height
    const vy = h * 0.52;
    addMesh(new THREE.CylinderGeometry(0.016, 0.016, 0.046, 18), brassMat, [pipeX, vy, pipeZ]);
    addMesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.068, 18),
      pipeMat,
      [pipeX + 0.034, vy, pipeZ],
      [0, 0, Math.PI / 2],
    );

    // E.C.A. Forged Brass Ball Valve body + hexagonal union nuts
    const valveX = pipeX + 0.095;
    addMesh(
      new THREE.CylinderGeometry(0.019, 0.019, 0.056, 6),
      brassMat,
      [valveX, vy, pipeZ],
      [0, 0, Math.PI / 2],
    );
    addMesh(new THREE.SphereGeometry(0.021, 20, 16), brassMat, [valveX, vy, pipeZ]);
    // Valve stem + TS EN 331 yellow lever handle
    addMesh(new THREE.CylinderGeometry(0.006, 0.006, 0.026, 14), brassMat, [valveX, vy + 0.022, pipeZ]);
    addMesh(
      new THREE.BoxGeometry(0.092, 0.012, 0.016),
      yellowHandleMat,
      [valveX + 0.032, vy + 0.036, pipeZ],
    );

    // E.C.A. tag plate on valve body
    const ecaTex = trackTex(createWordmarkTex('E.C.A.', '#B91C1C', options.maxAnisotropy, 'PN5 · TS EN 331'));
    addMesh(
      new THREE.PlaneGeometry(0.055, 0.02),
      trackMat(new THREE.MeshBasicMaterial({ map: ecaTex, transparent: true, depthWrite: false })),
      [valveX, vy - 0.032, pipeZ + 0.002],
    );

    // Solenoid emergency gas shut-off valve block downstream
    const solX = valveX + 0.062;
    addMesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.042, 16),
      brassMat,
      [solX, vy, pipeZ],
      [0, 0, Math.PI / 2],
    );
    addMesh(new THREE.BoxGeometry(0.036, 0.044, 0.036), solenoidMat, [solX, vy + 0.032, pipeZ]);
    addMesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.012, 12),
      trackMat(new THREE.MeshStandardMaterial({ color: '#DC2626', roughness: 0.3 })),
      [solX, vy + 0.058, pipeZ],
    );

    // Curved braided stainless steel appliance flex hose descending to boiler/hob
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(solX + 0.02, vy, pipeZ),
      new THREE.Vector3(solX + 0.062, vy - 0.015, pipeZ + 0.012),
      new THREE.Vector3(solX + 0.066, vy - 0.11, pipeZ + 0.02),
      new THREE.Vector3(solX + 0.038, vy - 0.19, pipeZ + 0.008),
    ]);
    addMesh(new THREE.TubeGeometry(curve, 32, 0.0095, 14, false), flexMat);
    // Brass union nut at flex tip
    addMesh(
      new THREE.CylinderGeometry(0.014, 0.014, 0.02, 6),
      brassMat,
      [solX + 0.038, vy - 0.2, pipeZ + 0.008],
    );
  }

  // ============================================================================
  // 5. Elster / Elektromed G4 Diyaframlı Doğalgaz Sayacı & Regülatör Seti
  // ============================================================================
  else if (asset.archetype === 'tr_gas_meter_g4') {
    const bodyMat = makePrimaryMat();
    const regMat = makeSecondaryMat();
    const valveYellowMat = makeAccentMat();
    const brassMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#CCA44E', roughness: 0.24, metalness: 0.92 }),
    );
    const pipeSteelMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#D4DBE3', roughness: 0.28, metalness: 0.85 }),
    );

    const meterW = 0.21;
    const meterH = 0.23;
    const meterD = 0.145;
    const meterX = 0.035;
    const meterY = 0.145;

    // Pressed steel seam-welded G4 diaphragm gas meter body
    addMesh(new THREE.BoxGeometry(meterW, meterH, meterD), bodyMat, [meterX, meterY, 0.095]);
    // Horizontal center crimped flange seam
    addMesh(new THREE.BoxGeometry(meterW + 0.012, 0.01, meterD + 0.012), bodyMat, [meterX, meterY, 0.095]);

    // High-resolution G4 m³ mechanical roller register plate on front face
    const dialTex = trackTex(
      createCanvasTex(512, 320, options.maxAnisotropy, (ctx, dw, dh) => {
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(0, 0, dw, dh);
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 8;
        ctx.strokeRect(8, 8, dw - 16, dh - 16);

        // Header
        ctx.fillStyle = '#0F172A';
        ctx.font = '800 34px "Inter", Arial, sans-serif';
        ctx.fillText('ELSTER · G4', 28, 54);
        ctx.fillStyle = '#DC2626';
        ctx.font = '700 22px "Inter", Arial, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('İGDAŞ / CE', dw - 28, 52);
        ctx.textAlign = 'left';

        // 8-digit roller window (5 black m³ + 3 red decimal)
        const digits = ['0', '0', '4', '2', '8', '6', '1', '5'];
        digits.forEach((dig, idx) => {
          const bx = 28 + idx * 54;
          ctx.fillStyle = idx < 5 ? '#111827' : '#B91C1C';
          ctx.fillRect(bx, 90, 48, 72);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '700 44px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(dig, bx + 24, 142);
        });
        ctx.textAlign = 'left';
        ctx.fillStyle = '#0F172A';
        ctx.font = '700 26px "Inter", Arial, sans-serif';
        ctx.fillText('m³', dw - 52, 198);

        // Specs footer
        ctx.fillStyle = '#475569';
        ctx.font = '600 20px "JetBrains Mono", monospace';
        ctx.fillText('Qmax 6 m³/h · Qmin 0.04 m³/h', 28, 226);
        ctx.fillText('Pmax 0.5 bar · TS EN 1359', 28, 262);
      }),
    );
    const dialMat = trackMat(new THREE.MeshStandardMaterial({ map: dialTex, roughness: 0.22, metalness: 0.05 }));
    addMesh(new THREE.BoxGeometry(0.145, 0.088, 0.018), regMat, [meterX, meterY + 0.032, 0.172]);
    addMesh(new THREE.PlaneGeometry(0.136, 0.08), dialMat, [meterX, meterY + 0.032, 0.182]);

    // Twin top union inlet/outlet bosses (130 mm centers)
    const leftPipeX = meterX - 0.065;
    const rightPipeX = meterX + 0.065;
    for (const px of [leftPipeX, rightPipeX]) {
      addMesh(new THREE.CylinderGeometry(0.019, 0.019, 0.028, 6), brassMat, [px, meterY + meterH / 2 + 0.014, 0.095]);
      addMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.11, 18), pipeSteelMat, [px, meterY + meterH / 2 + 0.078, 0.095]);
    }

    // Left-side 21 mbar diaphragm pressure regulator + yellow shut-off ball valve
    const regX = leftPipeX - 0.075;
    const regY = meterY + meterH / 2 + 0.095;
    addMesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.085, 16),
      pipeSteelMat,
      [leftPipeX - 0.04, regY, 0.095],
      [0, 0, Math.PI / 2],
    );
    // Circular pancake gas regulator
    addMesh(
      new THREE.CylinderGeometry(0.042, 0.042, 0.028, 24),
      regMat,
      [regX, regY, 0.095],
      [Math.PI / 2, 0, 0],
    );
    addMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 16), pipeSteelMat, [regX, regY - 0.095, 0.095]);
    // Yellow ball valve on left riser
    addMesh(new THREE.SphereGeometry(0.018, 16, 14), brassMat, [regX, regY - 0.11, 0.095]);
    addMesh(new THREE.BoxGeometry(0.068, 0.011, 0.014), valveYellowMat, [regX + 0.025, regY - 0.11, 0.115]);
  }

  // ============================================================================
  // 6. Rehau / E.C.A. 8'li Yerden Isıtma & Kalorifer Kollektör Dolabı (Sıva Altı)
  // ============================================================================
  else if (asset.archetype === 'tr_manifold_cabinet') {
    const cabMat = makePrimaryMat();
    const brassMat = makeSecondaryMat();
    const redMat = trackMat(new THREE.MeshStandardMaterial({ color: '#DC2626', roughness: 0.34, metalness: 0.12 }));
    const blueMat = trackMat(new THREE.MeshStandardMaterial({ color: '#2563EB', roughness: 0.34, metalness: 0.12 }));
    const whiteCapMat = trackMat(new THREE.MeshStandardMaterial({ color: '#F8FAFC', roughness: 0.25, metalness: 0.05 }));
    const backWallMat = trackMat(new THREE.MeshStandardMaterial({ color: '#E2E7EE', roughness: 0.5, metalness: 0.35 }));
    const glassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(pf?.glass?.hex || '#E2E8F0'),
        transparent: true,
        opacity: pf?.glass?.opacity ?? 0.18,
        roughness: pf?.glass?.roughness ?? 0.1,
        metalness: 0.05,
        clearcoat: 0.9,
      }),
    );

    const wallT = 0.022;
    // Recessed sheet-metal cabinet box (back, top, bottom, left, right)
    addMesh(new THREE.BoxGeometry(w, h, 0.012), backWallMat, [0, h / 2, 0.006]);
    addMesh(new THREE.BoxGeometry(w, wallT, d), cabMat, [0, h - wallT / 2, d / 2]);
    addMesh(new THREE.BoxGeometry(w, wallT, d), cabMat, [0, wallT / 2, d / 2]);
    addMesh(new THREE.BoxGeometry(wallT, h, d), cabMat, [-w / 2 + wallT / 2, h / 2, d / 2]);
    addMesh(new THREE.BoxGeometry(wallT, h, d), cabMat, [w / 2 - wallT / 2, h / 2, d / 2]);

    // Upper Supply Manifold Bar (Gidiş) & Lower Return Manifold Bar (Dönüş)
    const barW = w - 0.18;
    const upperY = h * 0.68;
    const lowerY = h * 0.44;
    const barZ = 0.068;

    addMesh(new THREE.CylinderGeometry(0.017, 0.017, barW, 20), brassMat, [0.02, upperY, barZ], [0, 0, Math.PI / 2]);
    addMesh(new THREE.CylinderGeometry(0.017, 0.017, barW, 20), brassMat, [0.02, lowerY, barZ], [0, 0, Math.PI / 2]);

    // Left side Red & Blue E.C.A. Main Shut-Off Ball Valves
    const leftValX = 0.02 - barW / 2 - 0.025;
    addMesh(new THREE.CylinderGeometry(0.019, 0.019, 0.044, 6), brassMat, [leftValX, upperY, barZ], [0, 0, Math.PI / 2]);
    addMesh(new THREE.BoxGeometry(0.055, 0.01, 0.014), redMat, [leftValX, upperY + 0.026, barZ + 0.008]);
    addMesh(new THREE.CylinderGeometry(0.019, 0.019, 0.044, 6), brassMat, [leftValX, lowerY, barZ], [0, 0, Math.PI / 2]);
    addMesh(new THREE.BoxGeometry(0.055, 0.01, 0.014), blueMat, [leftValX, lowerY + 0.026, barZ + 0.008]);

    // Right side Automatic Air Vents (Purjör) & Drain Cocks
    const rightEndX = 0.02 + barW / 2 + 0.018;
    for (const my of [upperY, lowerY]) {
      addMesh(new THREE.CylinderGeometry(0.014, 0.014, 0.042, 16), brassMat, [rightEndX, my + 0.028, barZ]);
      addMesh(new THREE.CylinderGeometry(0.008, 0.008, 0.014, 12), redMat, [rightEndX, my + 0.052, barZ]);
    }

    // 8 Supply Flowmeters (Debimetre) + 8 Return Valves + 16 Red/Blue PEX-A Pipes
    const portCount = 8;
    const portSpan = barW - 0.08;
    for (let i = 0; i < portCount; i++) {
      const px = 0.02 - portSpan / 2 + (i / (portCount - 1)) * portSpan;
      // Top clear flowmeter sight glass with red float ring
      addMesh(new THREE.CylinderGeometry(0.009, 0.009, 0.042, 14), whiteCapMat, [px, upperY + 0.032, barZ]);
      addMesh(new THREE.CylinderGeometry(0.0105, 0.0105, 0.008, 14), redMat, [px, upperY + 0.034, barZ]);
      // Bottom white thermostatic cap on return bar
      addMesh(new THREE.CylinderGeometry(0.011, 0.011, 0.028, 14), whiteCapMat, [px, lowerY + 0.026, barZ]);

      // Brass compression fittings
      addMesh(new THREE.CylinderGeometry(0.011, 0.011, 0.018, 6), brassMat, [px, upperY - 0.022, barZ]);
      addMesh(new THREE.CylinderGeometry(0.011, 0.011, 0.018, 6), brassMat, [px, lowerY - 0.022, barZ]);

      // Red supply PEX-A pipe descending cleanly behind lower bar to floor
      addMesh(new THREE.CylinderGeometry(0.0075, 0.0075, upperY - 0.04, 12), redMat, [px - 0.011, (upperY - 0.02) / 2, barZ - 0.018]);
      // Blue return PEX-A pipe descending to floor
      addMesh(new THREE.CylinderGeometry(0.0075, 0.0075, lowerY - 0.04, 12), blueMat, [px + 0.011, (lowerY - 0.02) / 2, barZ + 0.006]);
    }

    // Front architectural trim bezel + optional semi-transparent/louver inspection panel
    addMesh(new THREE.BoxGeometry(w - 0.036, h - 0.036, 0.006), glassMat, [0, h / 2, d + 0.003]);
    // Brand nameplate on top frame
    const txtCol = getLuminance(primaryHex) > 0.45 ? '#B91C1C' : '#F8FAFC';
    const brandTex = trackTex(createWordmarkTex('REHAU · E.C.A.', txtCol, options.maxAnisotropy));
    addMesh(
      new THREE.PlaneGeometry(0.16, 0.022),
      trackMat(new THREE.MeshBasicMaterial({ map: brandTex, transparent: true, depthWrite: false })),
      [0, h - wallT / 2, d + 0.004],
    );
  }

  // ============================================================================
  // 7. E.C.A. / DemirDöküm Dikey Alüminyum Tasarım Kalorifer Radyatörü (50×180 cm)
  // ============================================================================
  else if (asset.archetype === 'tr_vertical_radiator') {
    const finMat = makePrimaryMat();
    const backMat = makeSecondaryMat();
    const valveMat = makeAccentMat();
    const trvCapMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#F8FAFC', roughness: 0.24, metalness: 0.06 }),
    );

    const finCount = 8;
    const finW = 0.052;
    const gap = (w - finCount * finW) / (finCount - 1);
    const bodyH = h - 0.1; // Leave bottom 10 cm for thermostatic valve assembly

    // 8 Sleek vertical extruded aluminum flat-bar radiator fins
    for (let i = 0; i < finCount; i++) {
      const fx = -w / 2 + finW / 2 + i * (finW + gap);
      addMesh(new THREE.BoxGeometry(finW, bodyH, 0.028), finMat, [fx, 0.1 + bodyH / 2, 0.068]);
      // Subtle vertical bevel highlight lip
      addMesh(new THREE.BoxGeometry(finW - 0.008, bodyH - 0.012, 0.004), finMat, [fx, 0.1 + bodyH / 2, 0.084]);
    }

    // Rear horizontal manifold collector pipes (top & bottom) + wall mounting standoffs
    for (const cy of [0.22, h - 0.14]) {
      addMesh(new THREE.CylinderGeometry(0.018, 0.018, w - 0.04, 20), backMat, [0, cy, 0.036], [0, 0, Math.PI / 2]);
      for (const bx of [-w * 0.36, w * 0.36]) {
        addMesh(new THREE.CylinderGeometry(0.009, 0.009, 0.036, 14), backMat, [bx, cy, 0.018], [Math.PI / 2, 0, 0]);
      }
    }

    // Bottom center-aligned Chrome/Black Thermostatic Valve (TRV) + Return Valve
    for (const [idx, vx] of [-0.045, 0.045].entries()) {
      addMesh(new THREE.CylinderGeometry(0.01, 0.01, 0.09, 16), valveMat, [vx, 0.055, 0.048]);
      addMesh(new THREE.CylinderGeometry(0.01, 0.01, 0.052, 16), valveMat, [vx, 0.03, 0.024], [Math.PI / 2, 0, 0]);
      if (idx === 0) {
        // Horizontal thermostatic head pointing left
        addMesh(
          new THREE.CylinderGeometry(0.019, 0.016, 0.064, 20),
          trvCapMat,
          [vx - 0.042, 0.048, 0.048],
          [0, 0, Math.PI / 2],
        );
      }
    }

    // Minimal E.C.A. corner badge on upper-left fin
    const ecaCol = getLuminance(primaryHex) > 0.45 ? '#B91C1C' : '#F1F5F9';
    const ecaTex = trackTex(createWordmarkTex('E.C.A.', ecaCol, options.maxAnisotropy));
    addMesh(
      new THREE.PlaneGeometry(0.048, 0.016),
      trackMat(new THREE.MeshBasicMaterial({ map: ecaTex, transparent: true, depthWrite: false })),
      [-w / 2 + finW / 2, h - 0.055, 0.087],
    );
  }

  // ============================================================================
  // 8. Cosa / General Life Kablosuz Dijital Akıllı Kombi Oda Termostatı
  // ============================================================================
  else if (asset.archetype === 'tr_room_thermostat') {
    const bodyMat = makePrimaryMat();
    const trimMat = makeAccentMat();

    // Rounded-feel architectural thermostat wall casing
    addMesh(new THREE.BoxGeometry(w + 0.004, h + 0.004, d * 0.55), trimMat, [0, h / 2, d * 0.28]);
    addMesh(new THREE.BoxGeometry(w, h, d * 0.72), bodyMat, [0, h / 2, d * 0.56]);

    // Crisp OLED temperature dial texture
    const isLightBody = getLuminance(primaryHex) > 0.45;
    const oledTex = trackTex(
      createCanvasTex(512, 512, options.maxAnisotropy, (ctx, sw, sh) => {
        ctx.fillStyle = isLightBody ? '#F8FAFC' : '#11151E';
        ctx.fillRect(0, 0, sw, sh);

        // Dark central OLED display circle/card
        ctx.fillStyle = '#0B1018';
        ctx.beginPath();
        ctx.roundRect(36, 36, sw - 72, sh - 72, 48);
        ctx.fill();

        // Warm amber heating arc ring
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(sw / 2, sh * 0.48, 152, Math.PI * 0.78, Math.PI * 2.22);
        ctx.stroke();

        ctx.strokeStyle = '#F97316';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(sw / 2, sh * 0.48, 152, Math.PI * 0.78, Math.PI * 1.75);
        ctx.stroke();

        // Big 22.5°C temperature readout
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '700 84px "Inter", Arial, sans-serif';
        ctx.fillText('22.5°', sw / 2, sh * 0.46);

        ctx.fillStyle = '#FB923C';
        ctx.font = '700 24px "Inter", Arial, sans-serif';
        ctx.fillText('🔥 EV MODU · HEDEF 23.0°', sw / 2, sh * 0.62);

        // Touch +/- & COSA brand
        ctx.fillStyle = '#94A3B8';
        ctx.font = '700 36px "Inter", Arial, sans-serif';
        ctx.fillText('−', sw * 0.24, sh * 0.78);
        ctx.fillText('+', sw * 0.76, sh * 0.78);
        ctx.fillStyle = '#E2E8F0';
        ctx.font = '800 26px "Inter", Arial, sans-serif';
        ctx.fillText('COSA', sw / 2, sh * 0.8);
      }),
    );

    const oledMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: oledTex,
        emissiveMap: oledTex,
        emissive: new THREE.Color('#FFFFFF'),
        emissiveIntensity: 0.48,
        roughness: 0.08,
        metalness: 0.1,
      }),
    );
    addMesh(new THREE.PlaneGeometry(w - 0.012, h - 0.012), oledMat, [0, h / 2, d * 0.93]);
  }

  // ============================================================================
  // 9. Daikin Shira Plus 12.000 BTU Duvar Tipi Inverter Split Klima (İç Ünite)
  // ============================================================================
  else if (asset.archetype === 'tr_split_ac_unit') {
    const bodyMat = makePrimaryMat();
    const vaneMat = makeSecondaryMat();
    const trimMat = makeAccentMat();
    const darkVentMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#141820', roughness: 0.72, metalness: 0.2 }),
    );

    // Main wall-mounted evaporator chassis
    addMesh(new THREE.BoxGeometry(w, h * 0.82, d * 0.82), bodyMat, [0, h * 0.56, d * 0.41]);
    // Sculpted slightly curved front fascia plate
    addMesh(new THREE.BoxGeometry(w - 0.014, h * 0.68, 0.022), bodyMat, [0, h * 0.62, d * 0.84], [-0.07, 0, 0]);
    // Sleek metallic horizontal accent strip along lower front seam
    addMesh(new THREE.BoxGeometry(w - 0.018, 0.01, 0.012), trimMat, [0, h * 0.29, d * 0.87]);

    // Recessed dark air-discharge cavity + internal vertical deflector blades
    addMesh(new THREE.BoxGeometry(w - 0.08, 0.048, 0.055), darkVentMat, [0, h * 0.16, d * 0.74]);
    for (let i = 0; i < 12; i++) {
      const lx = -(w - 0.12) / 2 + (i / 11) * (w - 0.12);
      addMesh(new THREE.BoxGeometry(0.004, 0.036, 0.032), darkVentMat, [lx, h * 0.16, d * 0.75]);
    }
    // Motorized tilted lower air-swing louver flap (open operating angle)
    addMesh(new THREE.BoxGeometry(w - 0.06, 0.008, 0.052), vaneMat, [0, h * 0.08, d * 0.84], [0.46, 0, 0]);

    // Top intake vent grille slots
    for (let s = 0; s < 14; s++) {
      const sx = -(w - 0.1) / 2 + (s / 13) * (w - 0.1);
      addMesh(new THREE.BoxGeometry(0.036, 0.004, d * 0.48), darkVentMat, [sx, h * 0.972, d * 0.42]);
    }

    // Crisp DAIKIN logo centered on front fascia
    const logoCol = getLuminance(primaryHex) > 0.45 ? '#0284C7' : '#E2E8F0';
    const daikinTex = trackTex(createWordmarkTex('DAIKIN', logoCol, options.maxAnisotropy, 'INVERTER · R32'));
    addMesh(
      new THREE.PlaneGeometry(0.14, 0.04),
      trackMat(new THREE.MeshBasicMaterial({ map: daikinTex, transparent: true, depthWrite: false })),
      [0, h * 0.52, d * 0.896],
      [-0.07, 0, 0],
    );

    // Subtle glowing hidden LED temperature readout (23°C) on right side
    const ledTex = trackTex(
      createCanvasTex(160, 80, options.maxAnisotropy, (ctx, lw, lh) => {
        ctx.clearRect(0, 0, lw, lh);
        ctx.fillStyle = '#38BDF8';
        ctx.font = '700 44px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('23°C', lw / 2, lh / 2);
      }),
    );
    addMesh(
      new THREE.PlaneGeometry(0.065, 0.032),
      trackMat(
        new THREE.MeshBasicMaterial({ map: ledTex, transparent: true, depthWrite: false }),
      ),
      [w * 0.34, h * 0.48, d * 0.898],
      [-0.07, 0, 0],
    );
  }

  // ============================================================================
  // 10. Baylan Su Sayacı, E.C.A. Ana Vana & Basınç Düşürücü Tesisat Grubu
  // ============================================================================
  else if (asset.archetype === 'tr_water_meter_group') {
    const meterMat = makePrimaryMat();
    const brassMat = makeSecondaryMat();
    const valveRedMat = makeAccentMat();
    const clampMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#374151', roughness: 0.55, metalness: 0.45 }),
    );

    const lineY = h * 0.45;
    const lineZ = 0.065;

    // Horizontal main 3/4" plumbing pipe run
    addMesh(new THREE.CylinderGeometry(0.013, 0.013, w, 20), brassMat, [0, lineY, lineZ], [0, 0, Math.PI / 2]);

    // 2 Wall mounting clamps
    for (const cx of [-w * 0.42, w * 0.42]) {
      addMesh(new THREE.CylinderGeometry(0.017, 0.017, 0.016, 16), clampMat, [cx, lineY, lineZ], [0, 0, Math.PI / 2]);
      addMesh(new THREE.BoxGeometry(0.016, 0.022, 0.058), clampMat, [cx, lineY, lineZ - 0.032]);
    }

    // Left: E.C.A. Red-Handle Main Shut-Off Ball Valve
    const vx = -w * 0.31;
    addMesh(new THREE.SphereGeometry(0.021, 18, 14), brassMat, [vx, lineY, lineZ]);
    addMesh(new THREE.CylinderGeometry(0.018, 0.018, 0.048, 6), brassMat, [vx, lineY, lineZ], [0, 0, Math.PI / 2]);
    addMesh(new THREE.CylinderGeometry(0.006, 0.006, 0.026, 12), brassMat, [vx, lineY + 0.02, lineZ]);
    addMesh(new THREE.BoxGeometry(0.072, 0.011, 0.014), valveRedMat, [vx + 0.02, lineY + 0.034, lineZ]);

    // Left-Center: Brass Y-Strainer (Pislik Tutucu Filtre)
    const sx = -w * 0.16;
    addMesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.058, 16),
      brassMat,
      [sx, lineY - 0.024, lineZ],
      [0, 0, 0.65],
    );

    // Center: Baylan Blue Cast-Brass Water Meter + Circular m³ Dial
    const mx = 0.015;
    addMesh(new THREE.CylinderGeometry(0.044, 0.044, 0.056, 28), meterMat, [mx, lineY + 0.014, lineZ]);
    addMesh(new THREE.CylinderGeometry(0.022, 0.022, 0.13, 6), brassMat, [mx, lineY, lineZ], [0, 0, Math.PI / 2]);
    // Circular Baylan water meter dial face angled slightly forward for visibility
    const waterDialTex = trackTex(
      createCanvasTex(256, 256, options.maxAnisotropy, (ctx, dw, dh) => {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(dw / 2, dh / 2, 122, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1D4ED8';
        ctx.lineWidth = 10;
        ctx.stroke();

        ctx.fillStyle = '#1E3A8A';
        ctx.textAlign = 'center';
        ctx.font = '800 28px "Inter", Arial, sans-serif';
        ctx.fillText('BAYLAN', dw / 2, 72);

        // Register box
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(46, 92, 164, 38);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '700 26px "JetBrains Mono", monospace';
        ctx.fillText('00184', dw / 2, 120);

        ctx.fillStyle = '#DC2626';
        ctx.font = '700 20px "Inter", Arial, sans-serif';
        ctx.fillText('Q3=2.5 · m³', dw / 2, 162);

        // Small red sub-dials
        for (const ox of [-42, 0, 42]) {
          ctx.strokeStyle = '#DC2626';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(dw / 2 + ox, 200, 14, 0, Math.PI * 2);
          ctx.stroke();
        }
      }),
    );
    const waterDialMat = trackMat(new THREE.MeshStandardMaterial({ map: waterDialTex, roughness: 0.16 }));
    addMesh(
      new THREE.CylinderGeometry(0.039, 0.039, 0.008, 28),
      waterDialMat,
      [mx, lineY + 0.044, lineZ + 0.006],
      [0.42, 0, 0],
    );

    // Right: Brass Pressure Reducing Valve (Basınç Düşürücü) + Top 0–10 Bar Manometer
    const rx = w * 0.25;
    addMesh(new THREE.CylinderGeometry(0.022, 0.022, 0.068, 18), brassMat, [rx, lineY + 0.018, lineZ]);
    addMesh(new THREE.CylinderGeometry(0.019, 0.021, 0.024, 18), clampMat, [rx, lineY + 0.056, lineZ]);
    // Circular front-facing pressure gauge (4.0 bar)
    const gaugeTex = trackTex(
      createCanvasTex(256, 256, options.maxAnisotropy, (ctx, dw, dh) => {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(dw / 2, dh / 2, 118, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1F2937';
        ctx.lineWidth = 14;
        ctx.stroke();
        ctx.fillStyle = '#111827';
        ctx.textAlign = 'center';
        ctx.font = '700 32px "Inter", Arial, sans-serif';
        ctx.fillText('BAR', dw / 2, 178);
        // Gauge needle pointing to 4 bar
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(dw / 2, dh / 2);
        ctx.lineTo(dw / 2 - 58, dh / 2 - 42);
        ctx.stroke();
      }),
    );
    addMesh(
      new THREE.CylinderGeometry(0.026, 0.026, 0.014, 24),
      clampMat,
      [rx, lineY + 0.026, lineZ + 0.03],
      [Math.PI / 2, 0, 0],
    );
    addMesh(
      new THREE.CircleGeometry(0.023, 24),
      trackMat(new THREE.MeshBasicMaterial({ map: gaugeTex })),
      [rx, lineY + 0.026, lineZ + 0.038],
    );
  }

  // ============================================================================
  // 11. KONE / Ake Asansör EN 81-20 Otomatik Çift Kanatlı Kat Kapısı & LOP Panel
  // ============================================================================
  else if (asset.archetype === 'tr_elevator_landing') {
    const steelTex = trackTex(createBrushedTex(primaryHex, options.maxAnisotropy, true));
    const steelMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        map: steelTex,
        roughness: primaryRough,
        metalness: primaryMetal,
        clearcoat: 0.2,
      }),
    );
    const darkGlassMat = makeSecondaryMat();
    const trimMat = makeAccentMat();
    const gasketMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#14171D', roughness: 0.72, metalness: 0.1 }),
    );

    const doorOpenW = 0.9; // TS EN 81-20 / EN 81-70 accessible clear width: 90 cm
    const doorOpenH = 2.1; // 210 cm clear height
    const jambW = (w - doorOpenW) / 2;
    const headerH = h - doorOpenH;

    // Deep brushed stainless portal jamb frame (left, right, overhead lintel)
    addMesh(new THREE.BoxGeometry(jambW, h, d), steelMat, [-w / 2 + jambW / 2, h / 2, 0]);
    addMesh(new THREE.BoxGeometry(jambW, h, d), steelMat, [w / 2 - jambW / 2, h / 2, 0]);
    addMesh(new THREE.BoxGeometry(w, headerH, d), steelMat, [0, h - headerH / 2, 0]);

    // Grooved extruded aluminum floor sill (alt eşik rayı)
    addMesh(new THREE.BoxGeometry(doorOpenW + 0.06, 0.018, d * 0.96), trimMat, [0, 0.009, 0]);
    addMesh(new THREE.BoxGeometry(doorOpenW, 0.004, 0.014), gasketMat, [0, 0.019, 0.015]);

    // Center-opening double automatic stainless elevator door leaves (45 cm × 210 cm each)
    const leafW = doorOpenW / 2 - 0.004;
    addMesh(new THREE.BoxGeometry(leafW, doorOpenH - 0.018, 0.045), steelMat, [-leafW / 2 - 0.004, 0.018 + (doorOpenH - 0.018) / 2, -0.025]);
    addMesh(new THREE.BoxGeometry(leafW, doorOpenH - 0.018, 0.045), steelMat, [leafW / 2 + 0.004, 0.018 + (doorOpenH - 0.018) / 2, -0.025]);
    // Rubber safety edge center seam
    addMesh(new THREE.BoxGeometry(0.008, doorOpenH - 0.018, 0.047), gasketMat, [0, 0.018 + (doorOpenH - 0.018) / 2, -0.025]);

    // Overhead digital LED Floor Position Indicator (Transom Display: ↑ 04 · KONE)
    const indTex = trackTex(
      createCanvasTex(640, 140, options.maxAnisotropy, (ctx, iw, ih) => {
        ctx.fillStyle = '#0D1117';
        ctx.fillRect(0, 0, iw, ih);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;
        ctx.strokeRect(4, 4, iw - 8, ih - 8);

        // Glowing amber/white dot-matrix floor indicator
        ctx.fillStyle = '#F59E0B';
        ctx.font = '800 68px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('▲  04', iw * 0.44, ih * 0.52);

        // Brand & capacity badge
        ctx.fillStyle = '#E2E8F0';
        ctx.font = '800 28px "Inter", Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('KONE', 32, ih * 0.42);
        ctx.fillStyle = '#94A3B8';
        ctx.font = '600 18px "Inter", Arial, sans-serif';
        ctx.fillText('EN 81-20', 32, ih * 0.72);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#CBD5E1';
        ctx.font = '600 20px "Inter", Arial, sans-serif';
        ctx.fillText('630 kg · 8 KİŞİ', iw - 28, ih * 0.54);
      }),
    );
    const indMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: indTex,
        emissiveMap: indTex,
        emissive: new THREE.Color('#FFFFFF'),
        emissiveIntensity: 0.55,
        roughness: 0.1,
        metalness: 0.2,
      }),
    );
    addMesh(new THREE.BoxGeometry(0.56, 0.125, 0.016), darkGlassMat, [0, h - headerH / 2, d / 2 + 0.008]);
    addMesh(new THREE.PlaneGeometry(0.54, 0.115), indMat, [0, h - headerH / 2, d / 2 + 0.017]);

    // Right-jamb Hall Call Button Panel (LOP) at accessible height (110 cm)
    const lopX = w / 2 - jambW / 2;
    const lopY = 1.1;
    addMesh(new THREE.BoxGeometry(0.088, 0.24, 0.014), darkGlassMat, [lopX, lopY, d / 2 + 0.007]);
    const ledRingMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#38BDF8',
        emissive: '#38BDF8',
        emissiveIntensity: 1.1,
        roughness: 0.2,
      }),
    );
    for (const dy of [0.036, -0.028]) {
      addMesh(new THREE.CylinderGeometry(0.018, 0.018, 0.006, 20), ledRingMat, [lopX, lopY + dy, d / 2 + 0.014], [Math.PI / 2, 0, 0]);
      addMesh(new THREE.CylinderGeometry(0.014, 0.014, 0.008, 20), trimMat, [lopX, lopY + dy, d / 2 + 0.015], [Math.PI / 2, 0, 0]);
    }
  }

  // ============================================================================
  // 12. Ake / Otis EN 81-20 630 kg (8 Kişilik) Paslanmaz & Aynalı Asansör Kabini
  // ============================================================================
  else if (asset.archetype === 'tr_elevator_cabin') {
    const steelTex = trackTex(createBrushedTex(primaryHex, options.maxAnisotropy, true));
    const wallMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        map: steelTex,
        roughness: primaryRough,
        metalness: primaryMetal,
        clearcoat: 0.22,
      }),
    );
    const floorMat = makeSecondaryMat();
    const handrailMat = makeAccentMat();
    const mirrorMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: '#E2EAF2',
        roughness: 0.03,
        metalness: 0.96,
        clearcoat: 1.0,
      }),
    );
    const ledCeilingMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#FFFBEB',
        emissive: '#FEF3C7',
        emissiveIntensity: 1.25,
        roughness: 0.18,
      }),
    );
    const revealMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#14171D', roughness: 0.55, metalness: 0.35 }),
    );

    const wallT = 0.05;
    const innerW = w - wallT * 2;
    const innerH = h - 0.08;

    // Granite / marble elevator floor slab + front grooved aluminum sill
    addMesh(new THREE.BoxGeometry(w, 0.04, d), floorMat, [0, 0.02, 0]);
    addMesh(new THREE.BoxGeometry(w, 0.022, 0.065), handrailMat, [0, 0.032, d / 2 - 0.032]);

    // Rear wall, Left wall, Right wall (open-front cutaway for architectural interior inspection)
    addMesh(new THREE.BoxGeometry(w, innerH, wallT), wallMat, [0, 0.04 + innerH / 2, -d / 2 + wallT / 2]);
    addMesh(new THREE.BoxGeometry(wallT, innerH, d), wallMat, [-w / 2 + wallT / 2, 0.04 + innerH / 2, 0]);
    addMesh(new THREE.BoxGeometry(wallT, innerH, d), wallMat, [w / 2 - wallT / 2, 0.04 + innerH / 2, 0]);

    // Front portal return jamb strips (framing the 90 cm cabin entry)
    const returnW = (w - 0.9) / 2;
    addMesh(new THREE.BoxGeometry(returnW, innerH, 0.04), wallMat, [-w / 2 + returnW / 2, 0.04 + innerH / 2, d / 2 - 0.02]);
    addMesh(new THREE.BoxGeometry(returnW, innerH, 0.04), wallMat, [w / 2 - returnW / 2, 0.04 + innerH / 2, d / 2 - 0.02]);

    // Architectural dark vertical panel reveals on left & right walls
    for (const rz of [-0.25, 0.25]) {
      addMesh(new THREE.BoxGeometry(0.006, innerH - 0.1, 0.012), revealMat, [-innerW / 2 + 0.003, 0.04 + innerH / 2, rz]);
      addMesh(new THREE.BoxGeometry(0.006, innerH - 0.1, 0.012), revealMat, [innerW / 2 - 0.003, 0.04 + innerH / 2, rz]);
    }

    // Rear wall full-width safety mirror (upper 60% per TS EN 81-70)
    addMesh(new THREE.BoxGeometry(innerW - 0.14, 1.15, 0.01), mirrorMat, [0, 1.44, -d / 2 + wallT + 0.006]);
    // Stainless steel skirting kick-plates along bottom of 3 walls
    addMesh(new THREE.BoxGeometry(innerW, 0.12, 0.008), handrailMat, [0, 0.1, -d / 2 + wallT + 0.005]);
    addMesh(new THREE.BoxGeometry(0.008, 0.12, d - wallT), handrailMat, [-innerW / 2 + 0.005, 0.1, wallT / 2]);
    addMesh(new THREE.BoxGeometry(0.008, 0.12, d - wallT), handrailMat, [innerW / 2 - 0.005, 0.1, wallT / 2]);

    // Rear Ø38 mm tubular stainless steel accessible handrail (tutamak at 90 cm height)
    const railY = 0.9;
    addMesh(
      new THREE.CylinderGeometry(0.019, 0.019, innerW - 0.18, 20),
      handrailMat,
      [0, railY, -d / 2 + wallT + 0.065],
      [0, 0, Math.PI / 2],
    );
    for (const rx of [-innerW * 0.34, innerW * 0.34]) {
      addMesh(
        new THREE.CylinderGeometry(0.01, 0.01, 0.065, 14),
        handrailMat,
        [rx, railY, -d / 2 + wallT + 0.032],
        [Math.PI / 2, 0, 0],
      );
    }

    // Full-height Right-Wall Car Operating Panel (COP) with glowing floor display & Z..8 buttons
    const copTex = trackTex(
      createCanvasTex(240, 840, options.maxAnisotropy, (ctx, cw, ch) => {
        ctx.fillStyle = '#0F131A';
        ctx.fillRect(0, 0, cw, ch);
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 4;
        ctx.strokeRect(4, 4, cw - 8, ch - 8);

        // Top digital floor display
        ctx.fillStyle = '#020617';
        ctx.fillRect(24, 30, cw - 48, 96);
        ctx.fillStyle = '#F59E0B';
        ctx.textAlign = 'center';
        ctx.font = '800 54px "JetBrains Mono", monospace';
        ctx.fillText('▲ 04', cw / 2, 96);

        // Capacity plaque
        ctx.fillStyle = '#CBD5E1';
        ctx.font = '700 18px "Inter", Arial, sans-serif';
        ctx.fillText('AKE / OTIS', cw / 2, 162);
        ctx.fillStyle = '#94A3B8';
        ctx.font = '600 15px "Inter", Arial, sans-serif';
        ctx.fillText('630 kg · 8 KİŞİ', cw / 2, 188);

        // Tactile circular floor buttons (2 columns × 5 rows: Z, 1..8, Alarm)
        const labels = ['7', '8', '5', '6', '3', '4', '1', '2', 'Z', '🔔', '◄►', '►◄'];
        labels.forEach((lbl, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const bx = col === 0 ? cw * 0.32 : cw * 0.68;
          const by = 258 + row * 78;
          ctx.beginPath();
          ctx.arc(bx, by, 26, 0, Math.PI * 2);
          ctx.fillStyle = lbl === '🔔' ? '#EAB308' : lbl === '4' ? '#1D4ED8' : '#1E293B';
          ctx.fill();
          ctx.strokeStyle = lbl === '4' ? '#38BDF8' : '#94A3B8';
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.fillStyle = lbl === '🔔' ? '#111827' : '#F8FAFC';
          ctx.font = '700 22px "Inter", Arial, sans-serif';
          ctx.fillText(lbl, bx, by + 8);
        });
      }),
    );
    const copMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: copTex,
        emissiveMap: copTex,
        emissive: new THREE.Color('#FFFFFF'),
        emissiveIntensity: 0.44,
        roughness: 0.12,
        metalness: 0.25,
      }),
    );
    addMesh(new THREE.BoxGeometry(0.018, 1.35, 0.26), revealMat, [innerW / 2 - 0.009, 1.25, 0.18]);
    addMesh(
      new THREE.PlaneGeometry(0.24, 1.3),
      copMat,
      [innerW / 2 - 0.019, 1.25, 0.18],
      [0, -Math.PI / 2, 0],
    );

    // Ceiling slab with recessed warm architectural LED diffuser panels
    addMesh(new THREE.BoxGeometry(w, 0.04, d), wallMat, [0, h - 0.02, 0]);
    addMesh(new THREE.BoxGeometry(innerW - 0.24, 0.012, d - 0.34), ledCeilingMat, [0, h - 0.044, 0]);
  }

  return {
    group,
    dispose: () => {
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      texturesToDispose.forEach((t) => t.dispose());
    },
  };
}
