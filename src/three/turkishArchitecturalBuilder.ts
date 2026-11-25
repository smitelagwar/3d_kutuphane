import * as THREE from 'three';
import type {
  ArchitecturalAsset,
  AssetArchetype,
  MaterialFinish,
  PatternVariant,
} from '../lib/catalogTypes';
import type { BuiltAssetModel } from './assetMeshBuilder';
import { createWoodGrainTexture } from './proceduralTextures';
import { buildTurkishMepModel, isTurkishMepArchetype } from './turkishMepBuilder';

const TURKISH_GAP_ARCHETYPES = new Set<AssetArchetype>([
  'tr_alaturka_squat_toilet',
  'tr_geberit_flush_plate',
  'tr_schuko_socket',
  'tr_branded_dishwasher',
  'tr_branded_builtin_oven',
  'tr_pullout_kitchen_faucet',
  'tr_condensing_boiler',
  'tr_panel_radiator',
  'tr_armored_steel_door',
  'tr_magnetic_track_light',
  'tr_modern_fireplace',
]);

export function isTurkishGapArchetype(archetype: AssetArchetype): boolean {
  return TURKISH_GAP_ARCHETYPES.has(archetype) || isTurkishMepArchetype(archetype);
}

function getLuminance(hex: string): number {
  const c = new THREE.Color(hex);
  return 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
}

function createCanvasTexture(
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

function createMarbleVeinTexture(baseHex: string, maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTexture(512, 512, maxAnisotropy, (ctx, w, h) => {
    const isDark = getLuminance(baseHex) < 0.35;
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, w, h);

    // Subtle organic mineral clouding
    for (let i = 0; i < 24; i++) {
      const gx = ((i * 97) % w);
      const gy = ((i * 151) % h);
      const rad = 60 + (i % 5) * 32;
      const grad = ctx.createRadialGradient(gx, gy, 4, gx, gy, rad);
      grad.addColorStop(0, isDark ? 'rgba(255,255,255,0.04)' : 'rgba(130,122,110,0.07)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // Diagonal architectural veins
    ctx.lineCap = 'round';
    for (let v = 0; v < 9; v++) {
      ctx.beginPath();
      let x = -30 + v * 68;
      let y = 0;
      ctx.moveTo(x, y);
      for (let step = 1; step <= 14; step++) {
        x += Math.sin(step * 0.7 + v * 1.3) * 26 + 14;
        y = (step / 14) * h;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = isDark ? 'rgba(218, 212, 200, 0.24)' : 'rgba(128, 122, 114, 0.22)';
      ctx.lineWidth = v % 3 === 0 ? 3.2 : 1.4;
      ctx.stroke();
    }
  });
}

function createBrushedMetalTexture(baseHex: string, maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTexture(512, 512, maxAnisotropy, (ctx, w, h) => {
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, w, h);
    const isDark = getLuminance(baseHex) < 0.35;
    for (let y = 0; y < h; y += 2) {
      const alpha = ((y * 37) % 10) * 0.0045;
      ctx.fillStyle = isDark
        ? `rgba(255,255,255,${alpha.toFixed(3)})`
        : `rgba(30,36,44,${alpha.toFixed(3)})`;
      ctx.fillRect(0, y, w, 1);
    }
  });
}

function createWordmarkDecalTexture(
  text: string,
  color: string,
  maxAnisotropy: number,
  options?: {
    fontWeight?: string;
    letterSpacing?: number;
    accentColor?: string;
    subtitle?: string;
    style?: 'default' | 'vaillant' | 'bosch' | 'eca' | 'demirdokum' | 'baymak' | 'arcelik' | 'beko';
  },
): THREE.CanvasTexture {
  return createCanvasTexture(512, 160, maxAnisotropy, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    if (options?.style === 'vaillant') {
      // Iconic Vaillant green oval emblem + wordmark
      ctx.fillStyle = '#00917C';
      ctx.beginPath();
      ctx.ellipse(w * 0.24, h * 0.48, 44, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(w * 0.24, h * 0.54, 14, Math.PI * 0.1, Math.PI * 0.9, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(w * 0.22, h * 0.36, 4.5, 11, -0.25, 0, Math.PI * 2);
      ctx.ellipse(w * 0.26, h * 0.36, 4.5, 11, 0.25, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      ctx.fillStyle = '#007C6A';
      ctx.font = '700 54px "Inter", "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Vaillant', w * 0.36, h * 0.44);
      ctx.fillStyle = '#525B66';
      ctx.font = '500 22px "Inter", "Segoe UI", Arial, sans-serif';
      ctx.fillText('ecoTEC plus', w * 0.365, h * 0.75);
      return;
    }

    if (options?.style === 'eca') {
      // Iconic crimson E.C.A. emblem + Proteus Premix typography
      ctx.fillStyle = '#C8102E';
      ctx.fillRect(w * 0.16, h * 0.2, w * 0.68, 7);
      ctx.font = '900 66px "Inter", "Helvetica Neue", Arial, sans-serif';
      ctx.fillText('E.C.A', w / 2, h * 0.5);
      ctx.fillStyle = '#334155';
      ctx.font = '600 24px "Inter", Arial, sans-serif';
      ctx.fillText(options.subtitle || 'Proteus Premix', w / 2, h * 0.82);
      return;
    }

    if (options?.style === 'demirdokum') {
      // Iconic DemirDöküm red-navy architectural badge + Nitromix P
      ctx.fillStyle = '#D91A2A';
      ctx.beginPath();
      ctx.arc(w * 0.13, h * 0.46, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 24px "Inter", Arial, sans-serif';
      ctx.fillText('DD', w * 0.13, h * 0.47);

      ctx.fillStyle = '#1E293B';
      ctx.font = '800 48px "Inter", "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('DemirDöküm', w * 0.2, h * 0.45);
      ctx.fillStyle = '#D91A2A';
      ctx.font = '700 24px "Inter", Arial, sans-serif';
      ctx.fillText(options.subtitle || 'Nitromix P', w * 0.205, h * 0.77);
      return;
    }

    if (options?.style === 'bosch') {
      // Iconic circular Bosch armature symbol + bold crimson BOSCH + Condens 2500 W
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(w * 0.2, h * 0.44, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w * 0.175, h * 0.31);
      ctx.lineTo(w * 0.175, h * 0.57);
      ctx.moveTo(w * 0.225, h * 0.31);
      ctx.lineTo(w * 0.225, h * 0.57);
      ctx.moveTo(w * 0.175, h * 0.44);
      ctx.lineTo(w * 0.225, h * 0.44);
      ctx.stroke();

      ctx.fillStyle = '#E11D48';
      ctx.font = '900 58px "Inter", "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('BOSCH', w * 0.28, h * 0.44);
      ctx.fillStyle = '#475569';
      ctx.font = '600 23px "Inter", Arial, sans-serif';
      ctx.fillText(options.subtitle || 'Condens 2500 W', w * 0.285, h * 0.77);
      return;
    }

    if (options?.style === 'baymak') {
      // Iconic cobalt blue BAYMAK emblem + Duo Tec Compact subtitle
      ctx.fillStyle = '#005BAC';
      ctx.fillRect(w * 0.14, h * 0.22, w * 0.72, 6);
      ctx.font = '900 62px "Inter", "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BAYMAK', w / 2, h * 0.51);
      ctx.fillStyle = '#0284C7';
      ctx.font = '600 23px "Inter", Arial, sans-serif';
      ctx.fillText(options.subtitle || 'Duo Tec Compact', w / 2, h * 0.82);
      return;
    }

    const weight = options?.fontWeight || '700';
    ctx.fillStyle = color;
    ctx.font = `${weight} 52px "Inter", "Helvetica Neue", Arial, sans-serif`;
    ctx.fillText(text, w / 2, options?.subtitle ? h * 0.44 : h * 0.52);

    if (options?.subtitle) {
      ctx.fillStyle = options.accentColor || color;
      ctx.font = '500 24px "Inter", "Helvetica Neue", Arial, sans-serif';
      ctx.fillText(options.subtitle, w / 2, h * 0.78);
    }
  });
}

function createDishwasherFasciaTexture(
  brand: 'bosch' | 'siemens' | 'beko',
  maxAnisotropy: number,
): THREE.CanvasTexture {
  return createCanvasTexture(1024, 256, maxAnisotropy, (ctx, w, h) => {
    // Sleek glossy obsidian glass control strip
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#1B1F27');
    bgGrad.addColorStop(0.5, '#12151B');
    bgGrad.addColorStop(1, '#0E1015');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle top metallic bevel reflection line
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.fillRect(0, 0, w, 4);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(0, h - 4, w, 4);

    // Center digital display recess box
    const dispX = w * 0.43;
    const dispY = h * 0.24;
    const dispW = w * 0.16;
    const dispH = h * 0.52;
    ctx.fillStyle = '#07090D';
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 2;
    ctx.fillRect(dispX, dispY, dispW, dispH);
    ctx.strokeRect(dispX, dispY, dispW, dispH);

    ctx.textBaseline = 'middle';

    if (brand === 'bosch') {
      // Bosch circular symbol + bold red/silver BOSCH wordmark
      ctx.strokeStyle = '#D9DEE6';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(58, h * 0.47, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(49, h * 0.35);
      ctx.lineTo(49, h * 0.59);
      ctx.moveTo(67, h * 0.35);
      ctx.lineTo(67, h * 0.59);
      ctx.moveTo(49, h * 0.47);
      ctx.lineTo(67, h * 0.47);
      ctx.stroke();

      ctx.fillStyle = '#E11D48';
      ctx.font = '800 50px "Inter", "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('BOSCH', 92, h * 0.46);

      ctx.fillStyle = '#9BA4B4';
      ctx.font = '500 20px "Inter", Arial, sans-serif';
      ctx.fillText('Serie | 6  ·  PerfectDry', 94, h * 0.74);

      // Glowing crisp white/red LED display
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 56px "JetBrains Mono", "Consolas", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('01:45', dispX + dispW / 2, dispY + dispH * 0.5);

      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(dispX + dispW - 18, dispY + 20, 5, 0, Math.PI * 2);
      ctx.fill();

      // Right touch program icons
      const labels = ['Eco 50°', 'Auto 45°', '70°', '1h 65°', 'Start'];
      labels.forEach((lbl, i) => {
        const bx = w * 0.63 + i * 72;
        ctx.strokeStyle = i === 0 ? '#FFFFFF' : 'rgba(255,255,255,0.28)';
        ctx.lineWidth = i === 0 ? 2.5 : 1.5;
        ctx.strokeRect(bx, h * 0.34, 60, 74);
        ctx.fillStyle = i === 0 ? '#FFFFFF' : '#AEB6C4';
        ctx.font = '600 14px "Inter", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(lbl, bx + 30, h * 0.56);
      });
    } else if (brand === 'siemens') {
      // Siemens iconic teal-silver wordmark + cyan iQ500 LED UI
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '800 48px "Inter", "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('SIEMENS', 44, h * 0.45);

      ctx.fillStyle = '#38BDF8';
      ctx.font = '600 22px "Inter", Arial, sans-serif';
      ctx.fillText('iQ500  ·  zeolith®', 46, h * 0.74);

      // Signature Siemens cyan LED readout
      ctx.fillStyle = '#38BDF8';
      ctx.shadowColor = '#0EA5E9';
      ctx.shadowBlur = 12;
      ctx.font = '700 56px "JetBrains Mono", "Consolas", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('02:10', dispX + dispW / 2, dispY + dispH * 0.5);
      ctx.shadowBlur = 0;

      // Cyan touch program strip
      const labels = ['Eco 50°', 'Auto', 'vario+', '70°', 'Start'];
      labels.forEach((lbl, i) => {
        const bx = w * 0.63 + i * 72;
        ctx.fillStyle = i === 0 ? 'rgba(56,189,248,0.18)' : 'rgba(255,255,255,0.04)';
        ctx.fillRect(bx, h * 0.35, 60, 70);
        ctx.fillStyle = i === 0 ? '#38BDF8' : '#CBD5E1';
        ctx.fillRect(bx, h * 0.35, 60, 4);
        ctx.font = '600 14px "Inter", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(lbl, bx + 30, h * 0.57);
      });
    } else {
      // Beko iconic blue-white logo + HygieneIntense display
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 58px "Inter", "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('beko', 46, h * 0.45);
      // Iconic angled blue underline bar
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(46, h * 0.66, 136, 9);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '500 19px "Inter", Arial, sans-serif';
      ctx.fillText('BM 6046 · CornerIntense', 196, h * 0.62);

      // Bright crisp white LED readout
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '700 56px "JetBrains Mono", "Consolas", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('01:30', dispX + dispW / 2, dispY + dispH * 0.5);

      const labels = ['P1 Eco', 'P2 Auto', 'Hygiene', 'Quick+', 'Start'];
      labels.forEach((lbl, i) => {
        const bx = w * 0.63 + i * 72;
        ctx.strokeStyle = i === 0 ? '#38BDF8' : 'rgba(255,255,255,0.24)';
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, h * 0.36, 60, 68);
        ctx.fillStyle = i === 0 ? '#FFFFFF' : '#CBD5E1';
        ctx.font = '600 13px "Inter", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(lbl, bx + 30, h * 0.56);
      });
    }
  });
}

function createArcelikOvenFasciaTexture(isLightBody: boolean, maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTexture(1024, 220, maxAnisotropy, (ctx, w, h) => {
    ctx.fillStyle = isLightBody ? '#F4F6F8' : '#14171D';
    ctx.fillRect(0, 0, w, h);

    // Subtle glass sheen border
    ctx.fillStyle = isLightBody ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)';
    ctx.fillRect(0, h - 4, w, 4);

    // Central digital timer/temp display
    const cx = w / 2;
    ctx.fillStyle = '#090B0F';
    ctx.fillRect(cx - 140, 38, 280, 144);
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - 140, 38, 280, 144);

    // Classic Arçelik red + white wordmark above readout
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#E11D48';
    ctx.font = '800 32px "Inter", "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('arçelik', cx, 68);

    // Glowing temperature & timer
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 48px "JetBrains Mono", monospace';
    ctx.fillText('180°C', cx, 128);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 18px "Inter", Arial, sans-serif';
    ctx.fillText('3D PİŞİRME  ·  00:45', cx, 165);

    // Dial ring markings around left & right rotary knobs
    const knobColor = isLightBody ? '#334155' : '#CBD5E1';
    [w * 0.19, w * 0.81].forEach((kx, idx) => {
      for (let a = 0; a < 8; a++) {
        const ang = (a / 8) * Math.PI * 2 - Math.PI / 2;
        const r1 = 68;
        const r2 = 78;
        ctx.strokeStyle = knobColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(kx + Math.cos(ang) * r1, h * 0.5 + Math.sin(ang) * r1);
        ctx.lineTo(kx + Math.cos(ang) * r2, h * 0.5 + Math.sin(ang) * r2);
        ctx.stroke();
      }
      ctx.fillStyle = knobColor;
      ctx.font = '600 18px "Inter", Arial, sans-serif';
      ctx.fillText(idx === 0 ? 'PROGRAM' : 'SICAKLIK', kx, h - 18);
    });
  });
}

function createVaillantLcdTexture(maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTexture(512, 220, maxAnisotropy, (ctx, w, h) => {
    ctx.fillStyle = '#151921';
    ctx.fillRect(0, 0, w, h);

    // Backlit cyan-blue Vaillant LCD screen
    const sx = 128;
    const sy = 36;
    const sw = 256;
    const sh = 148;
    const lcdGrad = ctx.createLinearGradient(sx, sy, sx, sy + sh);
    lcdGrad.addColorStop(0, '#E0F2FE');
    lcdGrad.addColorStop(1, '#BAE6FD');
    ctx.fillStyle = lcdGrad;
    ctx.fillRect(sx, sy, sw, sh);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.strokeRect(sx, sy, sw, sh);

    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0F172A';
    ctx.font = '800 58px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('55°C', sx + sw * 0.5, sy + sh * 0.44);

    ctx.fillStyle = '#0369A1';
    ctx.font = '700 24px "Inter", Arial, sans-serif';
    ctx.fillText('1.5 bar  ·  eco', sx + sw * 0.5, sy + sh * 0.8);

    // Side touch controls
    ctx.fillStyle = '#94A3B8';
    ctx.font = '700 30px "Inter", Arial, sans-serif';
    ctx.fillText('−', 64, h * 0.5);
    ctx.fillText('+', w - 64, h * 0.5);

    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(64, h * 0.5, 28, 0, Math.PI * 2);
    ctx.arc(w - 64, h * 0.5, 28, 0, Math.PI * 2);
    ctx.stroke();
  });
}

function createBoilerBrandLcdTexture(
  brand: 'eca' | 'demirdokum' | 'bosch' | 'baymak',
  maxAnisotropy: number,
): THREE.CanvasTexture {
  return createCanvasTexture(512, 240, maxAnisotropy, (ctx, w, h) => {
    if (brand === 'baymak') {
      ctx.fillStyle = '#18202C';
      ctx.fillRect(0, 0, w, h);
      const sx = 122;
      const sy = 36;
      const sw = 268;
      const sh = 148;
      const grad = ctx.createLinearGradient(sx, sy, sx, sy + sh);
      grad.addColorStop(0, '#0284C7');
      grad.addColorStop(1, '#0369A1');
      ctx.fillStyle = grad;
      ctx.fillRect(sx, sy, sw, sh);
      ctx.strokeStyle = '#7DD3FC';
      ctx.lineWidth = 3;
      ctx.strokeRect(sx, sy, sw, sh);

      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 58px "JetBrains Mono", monospace';
      ctx.fillText('53°C', sx + sw * 0.5, sy + sh * 0.43);
      ctx.fillStyle = '#E0F2FE';
      ctx.font = '700 21px "Inter", Arial, sans-serif';
      ctx.fillText('1.5 bar · COMPACT', sx + sw * 0.5, sy + sh * 0.8);

      // Left & right tactile control buttons
      [54, w - 54].forEach((bx) => {
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(bx, h * 0.36, 20, 0, Math.PI * 2);
        ctx.arc(bx, h * 0.68, 20, 0, Math.PI * 2);
        ctx.fill();
      });
      return;
    }

    if (brand === 'eca') {
      ctx.fillStyle = '#1E242D';
      ctx.fillRect(0, 0, w, h);
      // Signature E.C.A. deep-blue backlit LCD center
      const sx = 128;
      const sy = 36;
      const sw = 256;
      const sh = 148;
      const grad = ctx.createLinearGradient(sx, sy, sx, sy + sh);
      grad.addColorStop(0, '#1D4ED8');
      grad.addColorStop(1, '#1E3A8A');
      ctx.fillStyle = grad;
      ctx.fillRect(sx, sy, sw, sh);
      ctx.strokeStyle = '#60A5FA';
      ctx.lineWidth = 3;
      ctx.strokeRect(sx, sy, sw, sh);

      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '800 58px "JetBrains Mono", monospace';
      ctx.fillText('52°C', sx + sw * 0.5, sy + sh * 0.44);
      ctx.fillStyle = '#BFDBFE';
      ctx.font = '700 23px "Inter", Arial, sans-serif';
      ctx.fillText('1.4 bar  ·  ECO', sx + sw * 0.5, sy + sh * 0.8);

      // Left & right crimson/silver tactile buttons
      [56, w - 56].forEach((bx) => {
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(bx, h * 0.36, 22, 0, Math.PI * 2);
        ctx.arc(bx, h * 0.68, 22, 0, Math.PI * 2);
        ctx.fill();
      });
      return;
    }

    if (brand === 'demirdokum') {
      // Silver metallic fascia with center dark-teal LCD
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#CBD5E1');
      bg.addColorStop(0.5, '#E2E8F0');
      bg.addColorStop(1, '#94A3B8');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const sx = 150;
      const sy = 44;
      const sw = 212;
      const sh = 148;
      ctx.fillStyle = '#0F2937';
      ctx.fillRect(sx, sy, sw, sh);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.strokeRect(sx, sy, sw, sh);

      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#E0F2FE';
      ctx.font = '800 52px "JetBrains Mono", monospace';
      ctx.fillText('55°C', sx + sw * 0.5, sy + sh * 0.44);
      ctx.fillStyle = '#7DD3FC';
      ctx.font = '700 21px "Inter", Arial, sans-serif';
      ctx.fillText('1.5 bar · P', sx + sw * 0.5, sy + sh * 0.8);
      return;
    }

    // Bosch Condens 2500 W sleek glossy black control screen
    ctx.fillStyle = '#0D1016';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 66px "JetBrains Mono", monospace';
    ctx.fillText('54°C', w * 0.5, h * 0.42);
    ctx.fillStyle = '#38BDF8';
    ctx.font = '700 22px "Inter", Arial, sans-serif';
    ctx.fillText('ECO  ·  1.5 bar  ·  24 kW', w * 0.5, h * 0.74);
  });
}

function createSmartLockTexture(maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTexture(256, 512, maxAnisotropy, (ctx, w, h) => {
    ctx.fillStyle = '#11141A';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, w - 8, h - 8);

    // KALE top wordmark
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '800 32px "Inter", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('KALE', w / 2, 54);

    // Touch keypad digits 1..9, *, 0, #
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
    ctx.font = '600 28px "Inter", Arial, sans-serif';
    ctx.fillStyle = '#CBD5E1';
    keys.forEach((k, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      ctx.fillText(k, 58 + col * 70, 128 + row * 58);
    });

    // Fingerprint sensor circle
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(w / 2, 412, 34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w / 2, 412, 20, 0, Math.PI * 2);
    ctx.stroke();
  });
}

function createRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const hw = w / 2;
  const hh = h / 2;
  const cr = Math.min(r, hw * 0.45, hh * 0.45);
  const shape = new THREE.Shape();
  shape.moveTo(-hw + cr, -hh);
  shape.lineTo(hw - cr, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + cr);
  shape.lineTo(hw, hh - cr);
  shape.quadraticCurveTo(hw, hh, hw - cr, hh);
  shape.lineTo(-hw + cr, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - cr);
  shape.lineTo(-hw, -hh + cr);
  shape.quadraticCurveTo(-hw, -hh, -hw + cr, -hh);
  return shape;
}

export function buildTurkishGapMesh(
  asset: ArchitecturalAsset,
  finish: MaterialFinish,
  options: {
    isSoftwareGl: boolean;
    maxAnisotropy: number;
    wireframe?: boolean;
    pattern?: PatternVariant;
  },
): BuiltAssetModel {
  if (isTurkishMepArchetype(asset.archetype)) {
    return buildTurkishMepModel(asset, finish, options);
  }

  const group = new THREE.Group();
  group.name = asset.slug || asset.id;

  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometriesToDispose.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    if (options.wireframe && 'wireframe' in m) {
      (m as unknown as { wireframe: boolean }).wireframe = true;
    }
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
    const m = new THREE.Mesh(trackGeo(geo), mat);
    if (pos) m.position.set(pos[0], pos[1], pos[2]);
    if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
    m.castShadow = !options.isSoftwareGl;
    m.receiveShadow = !options.isSoftwareGl;
    parent.add(m);
    return m;
  };

  const w = asset.dimensionsCm.width / 100;
  const d = asset.dimensionsCm.depth / 100;
  const h = asset.dimensionsCm.height / 100;
  const roughDelta = options.pattern?.roughnessDelta ?? 0;

  const pf = finish.partFinishes;
  const primaryHex = pf?.primary.hex || finish.primaryHex;
  const secondaryHex = pf?.secondary.hex || finish.secondaryHex;
  const accentHex = pf?.accent.hex || finish.accentHex;
  const ceramicHex = pf?.ceramic?.hex || '#F4F6F8';

  const primaryRough = THREE.MathUtils.clamp(
    (pf?.primary.roughness ?? finish.roughness) + roughDelta,
    0.06,
    0.92,
  );
  const primaryMetal = pf?.primary.metalness ?? finish.metalness;
  const secondaryRough = THREE.MathUtils.clamp(
    (pf?.secondary.roughness ?? 0.35) + roughDelta * 0.5,
    0.06,
    0.92,
  );
  const secondaryMetal = pf?.secondary.metalness ?? 0.25;
  const accentRough = THREE.MathUtils.clamp(pf?.accent.roughness ?? 0.16, 0.05, 0.7);
  const accentMetal = pf?.accent.metalness ?? 0.94;

  const makePrimaryMat = (extra?: THREE.MeshPhysicalMaterialParameters) =>
    trackMat(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(primaryHex),
        roughness: primaryRough,
        metalness: primaryMetal,
        ...extra,
      }),
    );

  const makeSecondaryMat = (extra?: THREE.MeshStandardMaterialParameters) =>
    trackMat(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(secondaryHex),
        roughness: secondaryRough,
        metalness: secondaryMetal,
        ...extra,
      }),
    );

  const makeAccentMat = (extra?: THREE.MeshStandardMaterialParameters) =>
    trackMat(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(accentHex),
        roughness: accentRough,
        metalness: accentMetal,
        ...extra,
      }),
    );

  // ============================================================================
  // 1. VitrA Arkitekt 50×60 cm Alaturka Hela Taşı
  // ============================================================================
  if (asset.archetype === 'tr_alaturka_squat_toilet') {
    const ceramicMat = makePrimaryMat({
      clearcoat: primaryRough < 0.25 ? 0.85 : 0.18,
      clearcoatRoughness: primaryRough < 0.25 ? 0.06 : 0.35,
    });
    const antiSlipMat = makeSecondaryMat();
    const chromeDrainMat = makeAccentMat();
    const darkTrapMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#14171D', roughness: 0.5, metalness: 0.1 }),
    );

    // Outer raised porcelain deck with sculpted oval bowl cutout
    const deckShape = createRoundedRectShape(w, d, 0.045);
    const bowlHole = new THREE.Path();
    // Ellipse hole centered slightly forward (+Z in world -> -Y in rotated shape)
    bowlHole.absellipse(0, -0.025, w * 0.225, d * 0.34, 0, Math.PI * 2, true, 0);
    deckShape.holes.push(bowlHole);

    const deckGeo = new THREE.ExtrudeGeometry(deckShape, {
      depth: 0.026,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 4,
      curveSegments: 32,
    });
    deckGeo.rotateX(-Math.PI / 2);
    addMesh(deckGeo, ceramicMat, [0, h - 0.036, 0]);

    // Outer perimeter splash rim border (raised 1.6 cm lip)
    const borderShape = createRoundedRectShape(w, d, 0.045);
    const borderInner = createRoundedRectShape(w - 0.042, d - 0.042, 0.032);
    borderShape.holes.push(borderInner);
    const borderGeo = new THREE.ExtrudeGeometry(borderShape, {
      depth: 0.015,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.004,
      bevelSegments: 3,
      curveSegments: 24,
    });
    borderGeo.rotateX(-Math.PI / 2);
    addMesh(borderGeo, ceramicMat, [0, h - 0.012, 0]);

    // Recessed sloped ceramic bowl outer skirt (open-ended so the inner oval cavity is genuinely hollow!)
    const outerShellGeo = new THREE.CylinderGeometry(w * 0.44, w * 0.28, h - 0.038, 36, 1, true);
    outerShellGeo.scale(1.0, 1.0, d / w);
    addMesh(outerShellGeo, ceramicMat, [0, (h - 0.038) / 2, 0]);

    // Inner hollow concave basin liner (visible through the top opening)
    const funnelGeo = new THREE.CylinderGeometry(w * 0.23, 0.056, h - 0.045, 36, 1, true);
    funnelGeo.scale(1.0, 1.0, (d * 0.34) / (w * 0.23));
    const innerCeramicMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(primaryHex).multiplyScalar(0.96),
        roughness: primaryRough,
        metalness: primaryMetal,
        clearcoat: 0.8,
        side: THREE.DoubleSide,
      }),
    );
    addMesh(funnelGeo, innerCeramicMat, [0, h * 0.44, 0.025]);

    // Bottom trap shadow + stainless chrome siphon collar
    addMesh(
      new THREE.CylinderGeometry(0.054, 0.054, 0.016, 28),
      darkTrapMat,
      [0, 0.036, 0.025],
    );
    addMesh(
      new THREE.TorusGeometry(0.054, 0.006, 12, 32),
      chromeDrainMat,
      [0, 0.046, 0.025],
      [Math.PI / 2, 0, 0],
    );

    // Ergonomic left & right raised anti-slip footrest pads with 7 tactile grip ribs
    for (const side of [-1, 1]) {
      const padShape = createRoundedRectShape(0.105, 0.27, 0.024);
      const padGeo = new THREE.ExtrudeGeometry(padShape, {
        depth: 0.008,
        bevelEnabled: true,
        bevelThickness: 0.003,
        bevelSize: 0.003,
        bevelSegments: 2,
      });
      padGeo.rotateX(-Math.PI / 2);
      addMesh(padGeo, antiSlipMat, [side * (w * 0.34), h - 0.008, 0.035], [0, side * -0.09, 0]);

      for (let r = -3; r <= 3; r++) {
        addMesh(
          new THREE.BoxGeometry(0.076, 0.004, 0.011),
          antiSlipMat,
          [side * (w * 0.34) + side * (r * -0.002), h + 0.002, 0.035 + r * 0.031],
          [0, side * -0.09, 0],
        );
      }
    }

    // Rear ceramic flush water hood (cowl) + chrome water inlet flange
    const hoodGeo = new THREE.CylinderGeometry(0.068, 0.088, 0.11, 24, 1, false, -Math.PI * 0.5, Math.PI);
    addMesh(hoodGeo, ceramicMat, [0, h + 0.032, -d * 0.38], [Math.PI * 0.44, 0, 0]);
    addMesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.03, 20),
      chromeDrainMat,
      [0, h + 0.022, -d * 0.48],
      [Math.PI / 2, 0, 0],
    );

    // Printed VitrA ceramic badge on front lip
    const vitraColor = getLuminance(primaryHex) > 0.5 ? '#1E3A8A' : '#E2E8F0';
    const vitraTex = trackTex(createWordmarkDecalTexture('VitrA', vitraColor, options.maxAnisotropy));
    const badgeMat = trackMat(
      new THREE.MeshBasicMaterial({ map: vitraTex, transparent: true, depthWrite: false }),
    );
    addMesh(
      new THREE.PlaneGeometry(0.095, 0.03),
      badgeMat,
      [0, h + 0.009, d * 0.435],
      [-Math.PI / 2, 0, 0],
    );
  }

  // ============================================================================
  // 2. Geberit Sigma20 (Round) & Sigma30 (Rectangular) Flush Actuator Plates
  // ============================================================================
  else if (asset.archetype === 'tr_geberit_flush_plate') {
    const isSigma20 = asset.id.includes('sigma20');
    const plateMat = makePrimaryMat({
      clearcoat: primaryRough < 0.25 && primaryMetal < 0.3 ? 0.65 : 0.15,
    });
    const buttonMat = makeSecondaryMat();
    const ringMat = makeAccentMat();
    const shadowMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#0D0F14', roughness: 0.85, metalness: 0.1 }),
    );

    const pw = 0.246;
    const ph = 0.164;
    const pt = 0.012;

    // Hidden rear wall mounting bracket + crisp shadow reveal
    addMesh(new THREE.BoxGeometry(pw - 0.016, ph - 0.016, 0.006), shadowMat, [0, ph / 2, -0.005]);

    // Main beveled Geberit front plate
    const plateShape = createRoundedRectShape(pw, ph, 0.005);
    const plateGeo = new THREE.ExtrudeGeometry(plateShape, {
      depth: pt - 0.004,
      bevelEnabled: true,
      bevelThickness: 0.002,
      bevelSize: 0.002,
      bevelSegments: 3,
    });
    plateGeo.center();
    addMesh(plateGeo, plateMat, [0, ph / 2, 0.003]);

    if (isSigma20) {
      // Sigma20 signature dual circular flush buttons with metallic accent rings
      const buttons = [
        { x: -0.044, r: 0.039 }, // 6L full flush
        { x: 0.052, r: 0.027 }, // 3L eco flush
      ];
      for (const b of buttons) {
        // Recessed shadow ring
        addMesh(
          new THREE.CylinderGeometry(b.r + 0.0045, b.r + 0.0045, 0.003, 40),
          shadowMat,
          [b.x, ph * 0.54, 0.0082],
          [Math.PI / 2, 0, 0],
        );
        // Proud metallic Geberit design ring
        addMesh(
          new THREE.TorusGeometry(b.r + 0.001, 0.0034, 16, 48),
          ringMat,
          [b.x, ph * 0.54, 0.0102],
        );
        // Circular flush button face
        addMesh(
          new THREE.CylinderGeometry(b.r - 0.002, b.r - 0.0015, 0.0055, 40),
          buttonMat,
          [b.x, ph * 0.54, 0.0112],
          [Math.PI / 2, 0, 0],
        );
      }
    } else {
      // Sigma30 architectural rectangular dual-flush buttons + iconic horizontal accent bar
      const leftBtnShape = createRoundedRectShape(0.104, 0.072, 0.003);
      const leftBtnGeo = new THREE.ExtrudeGeometry(leftBtnShape, {
        depth: 0.004,
        bevelEnabled: true,
        bevelThickness: 0.0015,
        bevelSize: 0.0015,
        bevelSegments: 2,
      });
      leftBtnGeo.center();

      const rightBtnShape = createRoundedRectShape(0.064, 0.072, 0.003);
      const rightBtnGeo = new THREE.ExtrudeGeometry(rightBtnShape, {
        depth: 0.004,
        bevelEnabled: true,
        bevelThickness: 0.0015,
        bevelSize: 0.0015,
        bevelSegments: 2,
      });
      rightBtnGeo.center();

      // Dark button reveal recess
      addMesh(new THREE.BoxGeometry(0.184, 0.082, 0.003), shadowMat, [0, ph * 0.55, 0.0085]);
      // Left 6L & Right 3L buttons
      addMesh(leftBtnGeo, buttonMat, [-0.036, ph * 0.55, 0.0115]);
      addMesh(rightBtnGeo, buttonMat, [0.054, ph * 0.55, 0.0115]);
      // Signature Sigma30 gleaming metallic accent strip below buttons
      addMesh(new THREE.BoxGeometry(0.174, 0.0065, 0.0045), ringMat, [0.002, ph * 0.55 - 0.043, 0.0118]);
    }

    // Crisp GEBERIT wordmark at bottom center
    const logoColor = getLuminance(primaryHex) > 0.45 ? '#2B313B' : '#E5E9F0';
    const gebTex = trackTex(createWordmarkDecalTexture('GEBERIT', logoColor, options.maxAnisotropy));
    const gebMat = trackMat(
      new THREE.MeshBasicMaterial({ map: gebTex, transparent: true, depthWrite: false }),
    );
    addMesh(new THREE.PlaneGeometry(0.068, 0.021), gebMat, [0, ph * 0.125, 0.0102]);
  }

  // ============================================================================
  // 3. Viko Karre / Schneider Asfora European Type F Schuko & Komütatör Switch
  // ============================================================================
  else if (asset.archetype === 'tr_schuko_socket') {
    const isDoubleUsb = asset.id.includes('cift-priz-usb');
    const isSwitch = asset.id.includes('komutator');
    const isViko = asset.id.includes('viko');

    const woodFrame = finish.materialKind === 'wood';
    let frameMat: THREE.Material;
    if (woodFrame) {
      const woodTex = createWoodGrainTexture(primaryHex, options.maxAnisotropy);
      trackTex(woodTex.map);
      trackTex(woodTex.bumpMap);
      frameMat = trackMat(
        new THREE.MeshStandardMaterial({
          map: woodTex.map,
          bumpMap: woodTex.bumpMap,
          bumpScale: 0.004,
          roughness: 0.48,
          metalness: 0.03,
        }),
      );
    } else {
      frameMat = makePrimaryMat({
        clearcoat: primaryMetal < 0.3 && primaryRough < 0.25 ? 0.55 : 0.1,
      });
    }

    const innerMat = makeSecondaryMat();
    const clipMat = makeAccentMat();
    const darkHoleMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#090B0F', roughness: 0.9, metalness: 0.05 }),
    );

    const fw = isDoubleUsb ? 0.156 : 0.084;
    const fh = 0.084;
    const ft = 0.011;

    // Rear wall mounting box (flush recessed back)
    addMesh(new THREE.BoxGeometry(fw - 0.014, fh - 0.014, 0.016), darkHoleMat, [0, fh / 2, -0.009]);

    // Outer beveled architectural frame (Karre sharp / Asfora soft radius)
    const outerShape = createRoundedRectShape(fw, fh, isViko ? 0.0025 : 0.005);
    const outerGeo = new THREE.ExtrudeGeometry(outerShape, {
      depth: ft - 0.003,
      bevelEnabled: true,
      bevelThickness: 0.0018,
      bevelSize: 0.0018,
      bevelSegments: 3,
    });
    outerGeo.center();
    addMesh(outerGeo, frameMat, [0, fh / 2, 0.005]);

    const buildSchukoModule = (cx: number) => {
      // Square inner cover plate with circular Schuko recess hole
      const coverShape = createRoundedRectShape(0.056, 0.056, 0.002);
      const wellHole = new THREE.Path();
      wellHole.absarc(0, 0, 0.0215, 0, Math.PI * 2, true);
      coverShape.holes.push(wellHole);
      const coverGeo = new THREE.ExtrudeGeometry(coverShape, {
        depth: 0.006,
        bevelEnabled: true,
        bevelThickness: 0.001,
        bevelSize: 0.001,
        bevelSegments: 2,
        curveSegments: 32,
      });
      coverGeo.center();
      addMesh(coverGeo, innerMat, [cx, fh / 2, 0.0115]);

      // Cylindrical inner Schuko well walls (18 mm deep)
      const wallCyl = new THREE.CylinderGeometry(0.0215, 0.021, 0.018, 32, 1, true);
      const innerWellMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(secondaryHex).multiplyScalar(0.88),
          roughness: secondaryRough + 0.08,
          metalness: secondaryMetal,
          side: THREE.DoubleSide,
        }),
      );
      addMesh(wallCyl, innerWellMat, [cx, fh / 2, 0.004], [Math.PI / 2, 0, 0]);

      // Back face of the Schuko recess
      addMesh(
        new THREE.CircleGeometry(0.0212, 32),
        innerWellMat,
        [cx, fh / 2, -0.001],
      );

      // Two European Type F 4.8 mm pin holes (19 mm center-to-center) + center screw
      for (const sx of [-0.0095, 0.0095]) {
        addMesh(
          new THREE.CylinderGeometry(0.0028, 0.0028, 0.004, 18),
          darkHoleMat,
          [cx + sx, fh / 2, 0.0005],
          [Math.PI / 2, 0, 0],
        );
      }
      addMesh(
        new THREE.CylinderGeometry(0.002, 0.002, 0.003, 14),
        clipMat,
        [cx, fh / 2, 0.0002],
        [Math.PI / 2, 0, 0],
      );

      // Iconic European Type F Top & Bottom metallic spring grounding clips (Topraklama Tırnakları)
      for (const sy of [-1, 1]) {
        addMesh(
          new THREE.BoxGeometry(0.0052, 0.003, 0.016),
          clipMat,
          [cx, fh / 2 + sy * 0.0195, 0.004],
        );
        // Curved tip of grounding clip
        addMesh(
          new THREE.CylinderGeometry(0.0024, 0.0024, 0.0052, 12),
          clipMat,
          [cx, fh / 2 + sy * 0.0175, 0.0115],
          [0, 0, Math.PI / 2],
        );
      }
    };

    if (isSwitch) {
      // Schneider Asfora Double Rocker Light Switch (Komütatör)
      addMesh(new THREE.BoxGeometry(0.058, 0.058, 0.004), darkHoleMat, [0, fh / 2, 0.01]);
      for (const [idx, sx] of [-0.0145, 0.0145].entries()) {
        addMesh(
          new THREE.BoxGeometry(0.0272, 0.056, 0.0075),
          innerMat,
          [sx, fh / 2, 0.0142],
          [idx === 0 ? 0.07 : -0.04, 0, 0],
        );
      }
      // Thin blue-white night locator LED bar
      const ledMat = trackMat(
        new THREE.MeshBasicMaterial({ color: '#7DD3FC' }),
      );
      addMesh(new THREE.BoxGeometry(0.018, 0.0018, 0.002), ledMat, [0, fh / 2 - 0.021, 0.0185]);
    } else if (isDoubleUsb) {
      // Left gang: Schuko socket | Right gang: USB-A + USB-C PD charging module
      buildSchukoModule(-0.036);

      const usbCx = 0.036;
      const usbPlateShape = createRoundedRectShape(0.056, 0.056, 0.002);
      const usbPlateGeo = new THREE.ExtrudeGeometry(usbPlateShape, {
        depth: 0.006,
        bevelEnabled: true,
        bevelThickness: 0.001,
        bevelSize: 0.001,
        bevelSegments: 2,
      });
      usbPlateGeo.center();
      addMesh(usbPlateGeo, innerMat, [usbCx, fh / 2, 0.0115]);

      // USB-A port (upper)
      addMesh(new THREE.BoxGeometry(0.016, 0.0075, 0.003), clipMat, [usbCx, fh / 2 + 0.009, 0.0145]);
      addMesh(new THREE.BoxGeometry(0.0135, 0.0052, 0.0035), darkHoleMat, [usbCx, fh / 2 + 0.009, 0.0148]);
      const usbBlueMat = trackMat(new THREE.MeshStandardMaterial({ color: '#0284C7', roughness: 0.4 }));
      addMesh(new THREE.BoxGeometry(0.012, 0.0018, 0.003), usbBlueMat, [usbCx, fh / 2 + 0.0102, 0.0152]);

      // USB-C port (lower)
      addMesh(new THREE.BoxGeometry(0.012, 0.0048, 0.003), clipMat, [usbCx, fh / 2 - 0.009, 0.0145]);
      addMesh(new THREE.BoxGeometry(0.0095, 0.003, 0.0035), darkHoleMat, [usbCx, fh / 2 - 0.009, 0.0148]);
      addMesh(new THREE.BoxGeometry(0.0075, 0.0009, 0.0032), clipMat, [usbCx, fh / 2 - 0.009, 0.0152]);
    } else {
      buildSchukoModule(0);
    }

    // Crisp brand marking at bottom frame edge (VİKO or Schneider)
    const brandText = isViko ? 'VİKO' : 'Schneider';
    const textCol = getLuminance(primaryHex) > 0.45 ? '#334155' : '#E2E8F0';
    const brandTex = trackTex(createWordmarkDecalTexture(brandText, textCol, options.maxAnisotropy));
    const brandMat = trackMat(
      new THREE.MeshBasicMaterial({ map: brandTex, transparent: true, depthWrite: false }),
    );
    addMesh(
      new THREE.PlaneGeometry(isViko ? 0.028 : 0.044, 0.0095),
      brandMat,
      [isDoubleUsb ? 0.042 : 0, 0.0068, 0.0108],
    );
  }

  // ============================================================================
  // 4. Bosch Serie 6 / Siemens iQ500 / Beko BM 6046 Branded Dishwashers
  // ============================================================================
  else if (asset.archetype === 'tr_branded_dishwasher') {
    const brand: 'bosch' | 'siemens' | 'beko' = asset.id.includes('siemens')
      ? 'siemens'
      : asset.id.includes('beko')
        ? 'beko'
        : 'bosch';

    const bodyTex =
      primaryMetal > 0.45
        ? trackTex(createBrushedMetalTexture(primaryHex, options.maxAnisotropy))
        : undefined;
    const bodyMat = makePrimaryMat(bodyTex ? { map: bodyTex } : undefined);
    const sideMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(primaryHex).multiplyScalar(0.92),
        roughness: THREE.MathUtils.clamp(primaryRough + 0.08, 0.15, 0.65),
        metalness: primaryMetal * 0.85,
      }),
    );
    const darkKickMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#14171D', roughness: 0.58, metalness: 0.2 }),
    );
    const handleMat = makeAccentMat();

    // Recessed 10 cm toe-kick plinth
    addMesh(new THREE.BoxGeometry(w - 0.01, 0.1, d - 0.06), darkKickMat, [0, 0.05, -0.025]);

    // Main appliance cabinet body
    addMesh(new THREE.BoxGeometry(w, h - 0.1, d - 0.03), sideMat, [0, 0.1 + (h - 0.1) / 2, -0.015]);

    // Lower front door panel with crisp 3 mm shadow reveal
    const doorH = h - 0.105 - 0.145;
    const doorShape = createRoundedRectShape(w - 0.006, doorH, 0.004);
    const doorGeo = new THREE.ExtrudeGeometry(doorShape, {
      depth: 0.026,
      bevelEnabled: true,
      bevelThickness: 0.0025,
      bevelSize: 0.0025,
      bevelSegments: 3,
    });
    doorGeo.center();
    addMesh(doorGeo, bodyMat, [0, 0.105 + doorH / 2, d / 2 - 0.014]);

    // Upper 13.8 cm Branded Control Fascia with high-res Canvas2D brand UI
    const fasciaH = 0.136;
    const fasciaY = h - fasciaH / 2 - 0.004;
    const fasciaTex = trackTex(createDishwasherFasciaTexture(brand, options.maxAnisotropy));
    const fasciaFrontMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: fasciaTex,
        emissiveMap: fasciaTex,
        emissive: new THREE.Color('#FFFFFF'),
        emissiveIntensity: 0.35,
        roughness: 0.14,
        metalness: 0.25,
      }),
    );
    const fasciaBoxMat = makeSecondaryMat();
    addMesh(new THREE.BoxGeometry(w - 0.006, fasciaH, 0.028), fasciaBoxMat, [0, fasciaY, d / 2 - 0.014]);
    addMesh(
      new THREE.PlaneGeometry(w - 0.012, fasciaH - 0.006),
      fasciaFrontMat,
      [0, fasciaY, d / 2 + 0.0012],
    );

    // Brand-authentic handle styling
    if (brand === 'siemens') {
      // Sleek Siemens horizontal stainless steel bar handle on twin standoffs
      const hy = 0.105 + doorH - 0.042;
      addMesh(new THREE.BoxGeometry(w - 0.12, 0.016, 0.016), handleMat, [0, hy, d / 2 + 0.032]);
      for (const sx of [-w * 0.36, w * 0.36]) {
        addMesh(new THREE.BoxGeometry(0.016, 0.016, 0.034), handleMat, [sx, hy, d / 2 + 0.014]);
      }
      // Subtle top stainless accent trim under fascia
      addMesh(new THREE.BoxGeometry(w - 0.008, 0.006, 0.006), handleMat, [0, fasciaY - fasciaH / 2 - 0.002, d / 2 + 0.001]);
    } else if (brand === 'bosch') {
      // Recessed stainless pocket handle centered below fascia + full-width chrome trim bar
      const hy = 0.105 + doorH - 0.032;
      addMesh(new THREE.BoxGeometry(0.24, 0.038, 0.012), darkKickMat, [0, hy, d / 2 - 0.002]);
      addMesh(new THREE.BoxGeometry(0.244, 0.008, 0.014), handleMat, [0, hy + 0.02, d / 2]);
      addMesh(new THREE.BoxGeometry(w - 0.008, 0.005, 0.005), handleMat, [0, fasciaY - fasciaH / 2 - 0.002, d / 2 + 0.001]);
    } else {
      // Beko wide horizontal ergonomic recess + gleaming chrome accent bar
      const hy = 0.105 + doorH - 0.03;
      addMesh(new THREE.BoxGeometry(w - 0.08, 0.034, 0.012), darkKickMat, [0, hy, d / 2 - 0.002]);
      addMesh(new THREE.BoxGeometry(w - 0.06, 0.009, 0.016), handleMat, [0, hy + 0.018, d / 2 + 0.002]);
    }
  }

  // ============================================================================
  // 5. Arçelik 9620 Serisi Ankastre Cam Fırın (60×57×60 cm)
  // ============================================================================
  else if (asset.archetype === 'tr_branded_builtin_oven') {
    const isLight = getLuminance(primaryHex) > 0.55;
    const frameMat = makePrimaryMat({ clearcoat: isLight ? 0.8 : 0.7, clearcoatRoughness: 0.08 });
    const casingMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#262A32', roughness: 0.52, metalness: 0.65 }),
    );
    const handleMat = makeAccentMat();
    const darkCavityMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#1A1C22', roughness: 0.48, metalness: 0.45 }),
    );

    // Built-in rear steel oven chassis (slightly inset to slide into 60cm cabinet)
    addMesh(new THREE.BoxGeometry(w - 0.04, h - 0.025, d - 0.04), casingMat, [0, h / 2, -0.02]);

    // Upper 11.5 cm control fascia with Arçelik logo & 180°C display
    const fasciaH = 0.115;
    const fasciaY = h - fasciaH / 2;
    const fasciaTex = trackTex(createArcelikOvenFasciaTexture(isLight, options.maxAnisotropy));
    const fasciaMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: fasciaTex,
        emissiveMap: fasciaTex,
        emissive: new THREE.Color('#FFFFFF'),
        emissiveIntensity: 0.34,
        roughness: 0.14,
        metalness: 0.18,
      }),
    );
    addMesh(new THREE.BoxGeometry(w, fasciaH, 0.028), frameMat, [0, fasciaY, d / 2 - 0.014]);
    addMesh(new THREE.PlaneGeometry(w - 0.008, fasciaH - 0.006), fasciaMat, [0, fasciaY, d / 2 + 0.0012]);

    // Twin 3D pop-out brushed metal rotary knobs
    for (const sx of [-w * 0.31, w * 0.31]) {
      addMesh(
        new THREE.CylinderGeometry(0.022, 0.023, 0.022, 32),
        handleMat,
        [sx, fasciaY, d / 2 + 0.012],
        [Math.PI / 2, 0, 0],
      );
      addMesh(
        new THREE.CylinderGeometry(0.017, 0.017, 0.003, 28),
        darkCavityMat,
        [sx, fasciaY, d / 2 + 0.023],
        [Math.PI / 2, 0, 0],
      );
    }

    // Lower oven door outer glass frame with window opening
    const doorH = h - fasciaH - 0.008;
    const doorY = doorH / 2;
    const doorShape = createRoundedRectShape(w, doorH, 0.004);
    const winHole = createRoundedRectShape(w - 0.12, doorH - 0.13, 0.008);
    doorShape.holes.push(winHole);
    const doorGeo = new THREE.ExtrudeGeometry(doorShape, {
      depth: 0.026,
      bevelEnabled: true,
      bevelThickness: 0.002,
      bevelSize: 0.002,
      bevelSegments: 2,
    });
    doorGeo.center();
    addMesh(doorGeo, frameMat, [0, doorY, d / 2 - 0.014]);

    // Recessed warm-lit oven interior cavity + 2 horizontal chrome wire racks visible behind smoked glass
    addMesh(new THREE.BoxGeometry(w - 0.125, doorH - 0.135, 0.08), darkCavityMat, [0, doorY, d / 2 - 0.065]);
    const warmGlowMat = trackMat(
      new THREE.MeshBasicMaterial({ color: '#F59E0B', transparent: true, opacity: 0.22 }),
    );
    addMesh(new THREE.PlaneGeometry(w - 0.15, doorH - 0.16), warmGlowMat, [0, doorY, d / 2 - 0.048]);
    for (const ry of [doorY - 0.07, doorY + 0.05]) {
      addMesh(new THREE.BoxGeometry(w - 0.15, 0.005, 0.006), handleMat, [0, ry, d / 2 - 0.032]);
      for (let gx = -5; gx <= 5; gx++) {
        addMesh(new THREE.BoxGeometry(0.003, 0.003, 0.045), handleMat, [gx * 0.038, ry, d / 2 - 0.05]);
      }
    }

    // Smoked tempered triple oven window glass
    const ovenGlassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(pf?.ceramic?.hex || '#181B22'),
        roughness: 0.06,
        metalness: 0.15,
        transparent: true,
        opacity: 0.62,
        clearcoat: 1.0,
      }),
    );
    addMesh(new THREE.BoxGeometry(w - 0.116, doorH - 0.126, 0.008), ovenGlassMat, [0, doorY, d / 2 - 0.004]);

    // Full-width cylindrical tubular stainless steel / brass door handle
    const handleY = doorH - 0.034;
    addMesh(
      new THREE.CylinderGeometry(0.011, 0.011, w - 0.08, 24),
      handleMat,
      [0, handleY, d / 2 + 0.036],
      [0, 0, Math.PI / 2],
    );
    for (const sx of [-w * 0.37, w * 0.37]) {
      addMesh(new THREE.BoxGeometry(0.022, 0.022, 0.038), handleMat, [sx, handleY, d / 2 + 0.017]);
    }
  }

  // ============================================================================
  // 6. E.C.A. / Artema Spiralli (Pull-Out) Yaylı Mutfak Bataryası
  // ============================================================================
  else if (asset.archetype === 'tr_pullout_kitchen_faucet') {
    const bodyMat = makePrimaryMat();
    const hoseMat = makeSecondaryMat();
    const springMat = makeAccentMat();

    // Base escutcheon ring + solid machined column
    addMesh(new THREE.CylinderGeometry(0.028, 0.031, 0.016, 32), bodyMat, [0, 0.008, -0.05]);
    addMesh(new THREE.CylinderGeometry(0.023, 0.024, 0.155, 32), bodyMat, [0, 0.092, -0.05]);

    // Crisp E.C.A. logo engraving on front lower cylinder
    const ecaCol = getLuminance(primaryHex) > 0.45 ? '#1E293B' : '#F1F5F9';
    const ecaTex = trackTex(createWordmarkDecalTexture('E.C.A.', ecaCol, options.maxAnisotropy));
    const ecaMat = trackMat(
      new THREE.MeshBasicMaterial({ map: ecaTex, transparent: true, depthWrite: false }),
    );
    addMesh(new THREE.PlaneGeometry(0.032, 0.011), ecaMat, [0, 0.052, -0.0255]);

    // Side ceramic cartridge mixer handle + red/blue hot/cold indicator dots
    addMesh(
      new THREE.CylinderGeometry(0.016, 0.016, 0.032, 24),
      bodyMat,
      [0.032, 0.095, -0.05],
      [0, 0, Math.PI / 2],
    );
    addMesh(
      new THREE.CylinderGeometry(0.0055, 0.0065, 0.092, 20),
      bodyMat,
      [0.044, 0.132, -0.05],
      [0, 0, -0.14],
    );
    const hotMat = trackMat(new THREE.MeshBasicMaterial({ color: '#EF4444' }));
    const coldMat = trackMat(new THREE.MeshBasicMaterial({ color: '#3B82F6' }));
    addMesh(new THREE.SphereGeometry(0.0022, 10, 10), hotMat, [0.048, 0.098, -0.042]);
    addMesh(new THREE.SphereGeometry(0.0022, 10, 10), coldMat, [0.048, 0.098, -0.058]);

    // High-arch flexible silicone inner hose curve (TubeGeometry)
    const archCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.16, -0.05),
      new THREE.Vector3(0, 0.34, -0.052),
      new THREE.Vector3(0, 0.455, -0.015),
      new THREE.Vector3(0, 0.47, 0.07),
      new THREE.Vector3(0, 0.41, 0.145),
      new THREE.Vector3(0, 0.285, 0.175),
    ]);
    addMesh(new THREE.TubeGeometry(archCurve, 48, 0.0095, 16, false), hoseMat);

    // Authentic 3D helical coiled steel spring wrapping around the high-arch hose!
    const helixPoints: THREE.Vector3[] = [];
    const turns = 26;
    const samples = 240;
    const springRadius = 0.0155;
    for (let i = 0; i <= samples; i++) {
      const t = 0.06 + (i / samples) * 0.72;
      const center = archCurve.getPointAt(t);
      const tangent = archCurve.getTangentAt(t).normalize();
      const upRef = new THREE.Vector3(1, 0, 0);
      const normal = new THREE.Vector3().crossVectors(tangent, upRef).normalize();
      const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
      const angle = (i / samples) * turns * Math.PI * 2;
      const pt = center
        .clone()
        .addScaledVector(normal, Math.cos(angle) * springRadius)
        .addScaledVector(binormal, Math.sin(angle) * springRadius);
      helixPoints.push(pt);
    }
    const springCurve = new THREE.CatmullRomCurve3(helixPoints);
    addMesh(new THREE.TubeGeometry(springCurve, 220, 0.0022, 8, false), springMat);

    // Horizontal magnetic docking arm from column to spray wand
    addMesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.21, 16),
      bodyMat,
      [0, 0.275, 0.055],
      [Math.PI / 2, 0, 0],
    );
    addMesh(
      new THREE.TorusGeometry(0.016, 0.0045, 12, 24),
      springMat,
      [0, 0.275, 0.168],
      [Math.PI / 2, 0, 0],
    );

    // Dual-mode ergonomic pull-out spray wand nozzle
    addMesh(
      new THREE.CylinderGeometry(0.013, 0.022, 0.105, 28),
      bodyMat,
      [0, 0.228, 0.178],
      [0.08, 0, 0],
    );
    // Rubberized dual-spray rocker button
    addMesh(new THREE.BoxGeometry(0.012, 0.036, 0.008), hoseMat, [0, 0.235, 0.197], [0.08, 0, 0]);
    // Nozzle aerator face
    addMesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.005, 24),
      hoseMat,
      [0, 0.175, 0.182],
      [0.08, 0, 0],
    );
  }

  // ============================================================================
  // 7. Vaillant ecoTEC Plus Yoğuşmalı Kombi (44×34×72 cm)
  // ============================================================================
  else if (asset.archetype === 'tr_condensing_boiler') {
    const bodyMat = makePrimaryMat({
      clearcoat: primaryMetal < 0.3 ? 0.55 : 0.15,
    });
    const panelMat = makeSecondaryMat();
    const valveMat = makeAccentMat();
    const pipeMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#CBD5E1', roughness: 0.22, metalness: 0.92 }),
    );
    const gasYellowMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#EAB308', roughness: 0.35, metalness: 0.1 }),
    );
    const flueMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#F1F5F9', roughness: 0.28, metalness: 0.15 }),
    );

    const bodyH = h - 0.12;
    const bodyBottom = 0.12;

    // Main beveled steel boiler enclosure
    const cabShape = createRoundedRectShape(w, bodyH, 0.014);
    const cabGeo = new THREE.ExtrudeGeometry(cabShape, {
      depth: d - 0.014,
      bevelEnabled: true,
      bevelThickness: 0.007,
      bevelSize: 0.007,
      bevelSegments: 3,
    });
    cabGeo.center();
    addMesh(cabGeo, bodyMat, [0, bodyBottom + bodyH / 2, 0]);

    // Front service seam line
    const seamMat = trackMat(new THREE.MeshStandardMaterial({ color: '#94A3B8', roughness: 0.6 }));
    addMesh(new THREE.BoxGeometry(w - 0.02, 0.0025, 0.002), seamMat, [0, bodyBottom + 0.175, d / 2 + 0.001]);

    // Brand-specific emblem + digital LCD control fascia
    const isEcaBoiler = asset.id.includes('eca-proteus');
    const isDdBoiler = asset.id.includes('demirdokum-nitromix');
    const isBoschBoiler = asset.id.includes('bosch-condens');
    const isBaymakBoiler = asset.id.includes('baymak');

    const logoTex = trackTex(
      isEcaBoiler
        ? createWordmarkDecalTexture('E.C.A', '#C8102E', options.maxAnisotropy, {
            style: 'eca',
            subtitle: 'Proteus Premix',
          })
        : isDdBoiler
          ? createWordmarkDecalTexture('DemirDöküm', '#1E293B', options.maxAnisotropy, {
              style: 'demirdokum',
              subtitle: 'Nitromix P',
            })
          : isBoschBoiler
            ? createWordmarkDecalTexture('BOSCH', '#E11D48', options.maxAnisotropy, {
                style: 'bosch',
                subtitle: 'Condens 2500 W',
              })
            : isBaymakBoiler
              ? createWordmarkDecalTexture('BAYMAK', '#005BAC', options.maxAnisotropy, {
                  style: 'baymak',
                  subtitle: 'Duo Tec Compact',
                })
              : createWordmarkDecalTexture('Vaillant', '#007C6A', options.maxAnisotropy, {
                  style: 'vaillant',
                }),
    );
    const logoMat = trackMat(
      new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, depthWrite: false }),
    );
    addMesh(
      new THREE.PlaneGeometry(isDdBoiler ? 0.27 : 0.24, 0.078),
      logoMat,
      [0, bodyBottom + bodyH * (isBoschBoiler ? 0.74 : 0.68), d / 2 + 0.0025],
    );

    // Lower backlit digital LCD fascia
    const lcdTex = trackTex(
      isEcaBoiler
        ? createBoilerBrandLcdTexture('eca', options.maxAnisotropy)
        : isDdBoiler
          ? createBoilerBrandLcdTexture('demirdokum', options.maxAnisotropy)
          : isBoschBoiler
            ? createBoilerBrandLcdTexture('bosch', options.maxAnisotropy)
            : isBaymakBoiler
              ? createBoilerBrandLcdTexture('baymak', options.maxAnisotropy)
              : createVaillantLcdTexture(options.maxAnisotropy),
    );
    const lcdMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: lcdTex,
        emissiveMap: lcdTex,
        emissive: new THREE.Color('#FFFFFF'),
        emissiveIntensity: 0.38,
        roughness: 0.16,
        metalness: 0.2,
      }),
    );
    addMesh(new THREE.BoxGeometry(w - 0.06, 0.125, 0.014), panelMat, [0, bodyBottom + 0.095, d / 2 - 0.002]);
    addMesh(new THREE.PlaneGeometry(w - 0.08, 0.112), lcdMat, [0, bodyBottom + 0.095, d / 2 + 0.006]);

    // DemirDöküm Nitromix signature twin 3D rotary dial knobs flanking the LCD
    if (isDdBoiler) {
      const dialMat = trackMat(
        new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.32, metalness: 0.65 }),
      );
      for (const dx of [-0.118, 0.118]) {
        addMesh(
          new THREE.CylinderGeometry(0.022, 0.024, 0.018, 24),
          dialMat,
          [dx, bodyBottom + 0.095, d / 2 + 0.011],
          [Math.PI / 2, 0, 0],
        );
      }
    }

    // Top Ø100 mm white coaxial hermetic flue collar & elbow
    addMesh(new THREE.CylinderGeometry(0.052, 0.056, 0.055, 28), flueMat, [0, h + 0.025, -0.04]);
    addMesh(new THREE.SphereGeometry(0.052, 24, 20), flueMat, [0, h + 0.068, -0.04]);
    addMesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.14, 28),
      flueMat,
      [0, h + 0.068, -0.11],
      [Math.PI / 2, 0, 0],
    );

    // Bottom 5-pipe Turkish manifold (heating, DHW, gas, cold, return) + brass valves + yellow gas valve!
    const pipeXs = [-0.13, -0.065, 0, 0.065, 0.13];
    pipeXs.forEach((px, idx) => {
      addMesh(new THREE.CylinderGeometry(0.011, 0.011, 0.12, 16), pipeMat, [px, 0.06, -0.02]);
      addMesh(new THREE.CylinderGeometry(0.016, 0.016, 0.024, 16), valveMat, [px, 0.072, -0.02]);
      // Valve shutoff butterfly handles (center is yellow natural gas valve!)
      const handleCol =
        idx === 2
          ? gasYellowMat
          : idx === 0 || idx === 4
            ? trackMat(new THREE.MeshStandardMaterial({ color: '#DC2626', roughness: 0.4 }))
            : trackMat(new THREE.MeshStandardMaterial({ color: '#2563EB', roughness: 0.4 }));
      addMesh(new THREE.BoxGeometry(0.008, 0.026, 0.034), handleCol, [px, 0.072, 0.002]);
    });
  }

  // ============================================================================
  // 8. Demirdöküm Plus Tip 22 PKKP Panel Radyatör (120×11×60 cm)
  // ============================================================================
  else if (asset.archetype === 'tr_panel_radiator') {
    const panelMat = makePrimaryMat();
    const grilleMat = makeSecondaryMat();
    const valveMat = makeAccentMat();
    const trvHeadMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#F8FAFC', roughness: 0.25, metalness: 0.05 }),
    );

    const bodyW = w - 0.1; // Leave room for right-side TRV valve
    const cx = -0.03;

    // Front & rear steel radiator plates (Type 22 dual-panel)
    addMesh(new THREE.BoxGeometry(bodyW, h - 0.016, 0.024), panelMat, [cx, h / 2, 0.034]);
    addMesh(new THREE.BoxGeometry(bodyW, h - 0.016, 0.024), panelMat, [cx, h / 2, -0.034]);

    // 30 crisp vertical pressed water-channel ribs on front face
    const ribCount = 30;
    const ribSpan = bodyW - 0.06;
    for (let i = 0; i < ribCount; i++) {
      const rx = cx - ribSpan / 2 + (i / (ribCount - 1)) * ribSpan;
      addMesh(new THREE.BoxGeometry(0.018, h - 0.048, 0.009), panelMat, [rx, h / 2, 0.048]);
    }

    // Internal convector core + closed side panels
    addMesh(new THREE.BoxGeometry(bodyW - 0.02, h - 0.05, 0.044), grilleMat, [cx, h / 2, 0]);
    for (const sx of [cx - bodyW / 2 - 0.004, cx + bodyW / 2 + 0.004]) {
      addMesh(new THREE.BoxGeometry(0.01, h, d - 0.006), panelMat, [sx, h / 2, 0]);
    }

    // Perforated top convector grille cover with parallel louver slots
    addMesh(new THREE.BoxGeometry(bodyW + 0.014, 0.012, d - 0.004), grilleMat, [cx, h - 0.006, 0]);
    const slotMat = trackMat(new THREE.MeshStandardMaterial({ color: '#1F242D', roughness: 0.85 }));
    for (let s = 0; s < 16; s++) {
      const sx = cx - (bodyW - 0.08) / 2 + (s / 15) * (bodyW - 0.08);
      addMesh(new THREE.BoxGeometry(0.046, 0.002, d * 0.56), slotMat, [sx, h + 0.001, 0]);
    }

    // Crisp DemirDöküm corner badge on upper-left front panel
    const ddCol = getLuminance(primaryHex) > 0.45 ? '#B91C1C' : '#F1F5F9';
    const ddTex = trackTex(createWordmarkDecalTexture('DemirDöküm', ddCol, options.maxAnisotropy));
    const ddMat = trackMat(
      new THREE.MeshBasicMaterial({ map: ddTex, transparent: true, depthWrite: false }),
    );
    addMesh(new THREE.PlaneGeometry(0.115, 0.032), ddMat, [cx - bodyW / 2 + 0.085, h - 0.042, 0.0538]);

    // Upper-right Thermostatic Radiator Valve (TRV) + lower-right return valve
    const vx = cx + bodyW / 2 + 0.036;
    // Upper chrome elbow + vertical feed pipe
    addMesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.055, 18),
      valveMat,
      [vx - 0.012, h - 0.065, 0],
      [0, 0, Math.PI / 2],
    );
    addMesh(new THREE.CylinderGeometry(0.01, 0.01, 0.14, 16), valveMat, [vx + 0.004, h - 0.135, 0]);
    // White-chrome stepped TRV thermostatic dial head
    addMesh(
      new THREE.CylinderGeometry(0.022, 0.018, 0.068, 24),
      trvHeadMat,
      [vx + 0.042, h - 0.065, 0],
      [0, 0, Math.PI / 2],
    );
    addMesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.012, 20),
      valveMat,
      [vx + 0.012, h - 0.065, 0],
      [0, 0, Math.PI / 2],
    );

    // Lower-right return lockshield valve
    addMesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.052, 18),
      valveMat,
      [vx - 0.012, 0.065, 0],
      [0, 0, Math.PI / 2],
    );
    addMesh(new THREE.CylinderGeometry(0.01, 0.01, 0.08, 16), valveMat, [vx + 0.004, 0.032, 0]);
  }

  // ============================================================================
  // 9. Sur / Kale Modern Villa & Daire Çelik Dış Kapısı (95×14×210 cm)
  // ============================================================================
  else if (asset.archetype === 'tr_armored_steel_door') {
    const isWoodDoor = finish.materialKind === 'wood';
    let leafMat: THREE.Material;
    if (isWoodDoor) {
      const woodTex = createWoodGrainTexture(primaryHex, options.maxAnisotropy);
      trackTex(woodTex.map);
      trackTex(woodTex.bumpMap);
      leafMat = trackMat(
        new THREE.MeshStandardMaterial({
          map: woodTex.map,
          bumpMap: woodTex.bumpMap,
          bumpScale: 0.006,
          roughness: primaryRough,
          metalness: 0.04,
        }),
      );
    } else {
      leafMat = makePrimaryMat();
    }

    const frameMat = makeSecondaryMat();
    const hardwareMat = makeAccentMat();
    const darkGrooveMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#14171D', roughness: 0.45, metalness: 0.5 }),
    );

    const frameThick = 0.075;
    const leafW = w - frameThick * 2;
    const leafH = h - frameThick - 0.018;

    // Heavy armored steel outer frame (left, right, top architrave)
    addMesh(new THREE.BoxGeometry(frameThick, h, d), frameMat, [-w / 2 + frameThick / 2, h / 2, 0]);
    addMesh(new THREE.BoxGeometry(frameThick, h, d), frameMat, [w / 2 - frameThick / 2, h / 2, 0]);
    addMesh(new THREE.BoxGeometry(w, frameThick, d), frameMat, [0, h - frameThick / 2, 0]);

    // Stainless steel threshold plate with SUR branding
    addMesh(new THREE.BoxGeometry(leafW + 0.01, 0.018, d * 0.92), hardwareMat, [0, 0.009, 0]);

    // Armored steel door leaf (7.5 cm thick)
    addMesh(new THREE.BoxGeometry(leafW, leafH, 0.076), leafMat, [0, 0.018 + leafH / 2, 0.015]);

    // 5 Architectural horizontal CNC grooves + 3 gleaming metallic/glass inlay strips
    const inlayYs = [0.46, 0.88, 1.32, 1.72];
    inlayYs.forEach((iy, idx) => {
      addMesh(new THREE.BoxGeometry(leafW - 0.012, 0.014, 0.004), darkGrooveMat, [0, iy, 0.054]);
      if (idx === 1 || idx === 2) {
        addMesh(new THREE.BoxGeometry(leafW - 0.06, 0.022, 0.006), hardwareMat, [0, iy + 0.022, 0.055]);
      }
    });

    // Vertical full-height 138 cm architectural stainless/gold pull bar on right side
    const barX = leafW * 0.34;
    addMesh(new THREE.BoxGeometry(0.026, 1.38, 0.022), hardwareMat, [barX, 1.08, 0.098]);
    for (const sy of [0.48, 1.68]) {
      addMesh(new THREE.BoxGeometry(0.024, 0.024, 0.044), hardwareMat, [barX, sy, 0.072]);
    }

    // Modern Kale Smart Fingerprint & PIN Keypad Lock Module
    const lockTex = trackTex(createSmartLockTexture(options.maxAnisotropy));
    const lockFaceMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: lockTex,
        emissiveMap: lockTex,
        emissive: new THREE.Color('#FFFFFF'),
        emissiveIntensity: 0.3,
        roughness: 0.12,
        metalness: 0.25,
      }),
    );
    const lockX = leafW * 0.21;
    addMesh(new THREE.BoxGeometry(0.074, 0.21, 0.022), darkGrooveMat, [lockX, 1.02, 0.062]);
    addMesh(new THREE.PlaneGeometry(0.068, 0.2), lockFaceMat, [lockX, 1.02, 0.074]);

    // Upper metallic wide-angle peephole (kapı dürbünü) + SUR badge
    addMesh(
      new THREE.CylinderGeometry(0.013, 0.013, 0.012, 20),
      hardwareMat,
      [0, 1.56, 0.056],
      [Math.PI / 2, 0, 0],
    );
    addMesh(
      new THREE.CylinderGeometry(0.007, 0.007, 0.014, 16),
      darkGrooveMat,
      [0, 1.56, 0.057],
      [Math.PI / 2, 0, 0],
    );

    const surTex = trackTex(
      createWordmarkDecalTexture('SUR', '#E2E8F0', options.maxAnisotropy),
    );
    const surMat = trackMat(
      new THREE.MeshBasicMaterial({ map: surTex, transparent: true, depthWrite: false }),
    );
    addMesh(new THREE.PlaneGeometry(0.09, 0.028), surMat, [0, h - frameThick / 2, d / 2 + 0.002]);

    // 3 Heavy-duty armored barrel hinges on left edge
    for (const hy of [0.34, 1.06, 1.78]) {
      addMesh(new THREE.CylinderGeometry(0.011, 0.011, 0.11, 16), hardwareMat, [-leafW / 2 - 0.006, hy, 0.058]);
    }
  }

  // ============================================================================
  // 10. Pelsan / Jupiter 3'lü Manyetik Ray Spot & Lineer LED Sistem (150 cm)
  // ============================================================================
  else if (asset.archetype === 'tr_magnetic_track_light') {
    const railMat = makePrimaryMat();
    const spotMat = makeSecondaryMat();
    const ringMat = makeAccentMat();
    const ledGlowMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(ceramicHex),
        emissive: new THREE.Color(ceramicHex),
        emissiveIntensity: 1.35,
        roughness: 0.2,
        metalness: 0.0,
      }),
    );
    const busbarMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#111419', roughness: 0.65, metalness: 0.5 }),
    );

    const railY = h - 0.024;
    // Extruded U-profile 150 cm aluminum magnetic track rail
    addMesh(new THREE.BoxGeometry(w, 0.044, 0.038), railMat, [0, railY, 0]);
    addMesh(new THREE.BoxGeometry(w - 0.012, 0.028, 0.026), busbarMat, [0, railY - 0.012, 0]);

    // Flush 42 cm linear opal LED diffuser bar snapped into track center-left
    addMesh(new THREE.BoxGeometry(0.42, 0.014, 0.024), ledGlowMat, [-0.14, railY - 0.024, 0]);

    // 3 Articulating cylindrical COB LED spotlights with metallic anti-glare rings
    const spotConfigs = [
      { x: -0.54, tiltZ: 0.24, tiltX: 0.28 },
      { x: 0.24, tiltZ: -0.18, tiltX: 0.34 },
      { x: 0.56, tiltZ: -0.26, tiltX: 0.22 },
    ];
    for (const sc of spotConfigs) {
      // Magnetic snap adapter block
      addMesh(new THREE.BoxGeometry(0.085, 0.016, 0.024), railMat, [sc.x, railY - 0.028, 0]);
      // Articulated pivot stem
      addMesh(new THREE.CylinderGeometry(0.0055, 0.0055, 0.036, 12), railMat, [sc.x, railY - 0.052, 0]);

      // Aimable spotlight head sub-group
      const head = new THREE.Group();
      head.position.set(sc.x, railY - 0.095, 0);
      head.rotation.set(sc.tiltX, 0, sc.tiltZ);
      group.add(head);

      // Cylindrical aluminum heat-sink housing
      addMesh(new THREE.CylinderGeometry(0.029, 0.029, 0.112, 28), spotMat, [0, 0, 0], undefined, head);
      // Anti-glare gold/chrome/gunmetal reflector bezel ring
      addMesh(
        new THREE.TorusGeometry(0.027, 0.0038, 12, 32),
        ringMat,
        [0, -0.056, 0],
        [Math.PI / 2, 0, 0],
        head,
      );
      // Warm 3000K/4000K glowing COB LED optical lens
      addMesh(
        new THREE.CylinderGeometry(0.023, 0.023, 0.006, 24),
        ledGlowMat,
        [0, -0.052, 0],
        undefined,
        head,
      );
    }

    // Crisp PELSAN brand mark on rail side
    const pelCol = getLuminance(primaryHex) > 0.45 ? '#1E293B' : '#E2E8F0';
    const pelTex = trackTex(createWordmarkDecalTexture('PELSAN', pelCol, options.maxAnisotropy));
    const pelMat = trackMat(
      new THREE.MeshBasicMaterial({ map: pelTex, transparent: true, depthWrite: false }),
    );
    addMesh(new THREE.PlaneGeometry(0.09, 0.026), pelMat, [-w / 2 + 0.08, railY, 0.0205]);
  }

  // ============================================================================
  // 11. Modern TV Altı Ankastre Bioetanol / Buharlı Villa Şöminesi (140 cm)
  // ============================================================================
  else if (asset.archetype === 'tr_modern_fireplace') {
    let surroundMat: THREE.Material;
    if (finish.materialKind === 'wood') {
      const woodTex = createWoodGrainTexture(primaryHex, options.maxAnisotropy);
      trackTex(woodTex.map);
      trackTex(woodTex.bumpMap);
      surroundMat = trackMat(
        new THREE.MeshStandardMaterial({
          map: woodTex.map,
          bumpMap: woodTex.bumpMap,
          bumpScale: 0.005,
          roughness: primaryRough,
          metalness: 0.03,
        }),
      );
    } else {
      const stoneTex = trackTex(createMarbleVeinTexture(primaryHex, options.maxAnisotropy));
      surroundMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          map: stoneTex,
          roughness: primaryRough,
          metalness: primaryMetal,
          clearcoat: primaryRough < 0.3 ? 0.6 : 0.08,
        }),
      );
    }

    const fireboxMat = makeSecondaryMat();
    const burnerMat = makeAccentMat();
    const stoneMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#1A1C21', roughness: 0.82, metalness: 0.08 }),
    );
    const glassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(pf?.glass?.hex || '#E8F0F6'),
        transparent: true,
        opacity: pf?.glass?.opacity ?? 0.24,
        roughness: 0.05,
        metalness: 0.05,
        clearcoat: 1.0,
      }),
    );

    const wallT = 0.085;
    // Outer architectural marble/travertine/walnut surround (bottom, top, left, right)
    addMesh(new THREE.BoxGeometry(w, wallT, d), surroundMat, [0, wallT / 2, 0]);
    addMesh(new THREE.BoxGeometry(w, wallT, d), surroundMat, [0, h - wallT / 2, 0]);
    addMesh(new THREE.BoxGeometry(wallT, h - wallT * 2, d), surroundMat, [-w / 2 + wallT / 2, h / 2, 0]);
    addMesh(new THREE.BoxGeometry(wallT, h - wallT * 2, d), surroundMat, [w / 2 - wallT / 2, h / 2, 0]);

    // Deep recessed matte black steel firebox chamber (back, floor, ceiling, sides)
    const innerW = w - wallT * 2;
    const innerH = h - wallT * 2;
    addMesh(new THREE.BoxGeometry(innerW, innerH, 0.024), fireboxMat, [0, h / 2, -d / 2 + 0.016]);
    addMesh(new THREE.BoxGeometry(innerW, 0.022, d - 0.02), fireboxMat, [0, wallT + 0.011, 0]);
    addMesh(new THREE.BoxGeometry(innerW, 0.022, d - 0.02), fireboxMat, [0, h - wallT - 0.011, 0]);
    addMesh(new THREE.BoxGeometry(0.02, innerH, d - 0.02), fireboxMat, [-innerW / 2 + 0.01, h / 2, 0]);
    addMesh(new THREE.BoxGeometry(0.02, innerH, d - 0.02), fireboxMat, [innerW / 2 - 0.01, h / 2, 0]);

    // Brushed stainless / brass 96 cm linear bioethanol burner plate + flame slot
    const burnerY = wallT + 0.026;
    addMesh(new THREE.BoxGeometry(0.96, 0.014, 0.14), burnerMat, [0, burnerY, 0]);
    const slotDarkMat = trackMat(new THREE.MeshBasicMaterial({ color: '#7C2D12' }));
    addMesh(new THREE.BoxGeometry(0.84, 0.004, 0.022), slotDarkMat, [0, burnerY + 0.008, 0]);

    // Decorative black volcanic basalt stones along the burner perimeter
    for (let i = 0; i < 22; i++) {
      const sx = -0.54 + (i / 21) * 1.08;
      const sz = i % 2 === 0 ? -0.095 : 0.088;
      const r = 0.014 + (i % 3) * 0.004;
      const pebbleGeo = new THREE.DodecahedronGeometry(r, 1);
      pebbleGeo.scale(1.2, 0.65, 1.0);
      addMesh(pebbleGeo, stoneMat, [sx, burnerY + 0.008, sz], [0, i * 0.7, 0]);
    }

    // Layered architectural 3D warm glowing bioethanol flame tongues
    const outerFlameMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: '#F97316',
        transparent: true,
        opacity: 0.82,
        side: THREE.DoubleSide,
      }),
    );
    const innerFlameMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: '#FDE047',
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
      }),
    );
    const flameCount = 13;
    for (let i = 0; i < flameCount; i++) {
      const t = i / (flameCount - 1);
      const fx = -0.38 + t * 0.76;
      const archFactor = 0.68 + 0.45 * Math.sin(t * Math.PI);
      const fh = (0.095 + ((i * 19) % 5) * 0.016) * archFactor;
      const fw = 0.044;

      const fShape = new THREE.Shape();
      fShape.moveTo(-fw / 2, 0);
      fShape.quadraticCurveTo(-fw * 0.55, fh * 0.48, 0, fh);
      fShape.quadraticCurveTo(fw * 0.55, fh * 0.48, fw / 2, 0);
      fShape.closePath();

      addMesh(
        new THREE.ShapeGeometry(fShape, 8),
        outerFlameMat,
        [fx, burnerY + 0.01, (i % 2 === 0 ? 1 : -1) * 0.004],
        [0, (i % 3 - 1) * 0.14, 0],
      );

      const coreGeo = new THREE.ShapeGeometry(fShape, 6);
      coreGeo.scale(0.55, 0.58, 1);
      addMesh(
        coreGeo,
        innerFlameMat,
        [fx, burnerY + 0.01, 0.006],
        [0, (i % 3 - 1) * 0.08, 0],
      );
    }

    // Tempered clear glass front wind-guard + brushed stainless clamps
    addMesh(new THREE.BoxGeometry(innerW - 0.1, 0.115, 0.008), glassMat, [0, wallT + 0.08, d / 2 - 0.04]);
    for (const cx of [-innerW * 0.36, innerW * 0.36]) {
      addMesh(new THREE.BoxGeometry(0.024, 0.028, 0.022), burnerMat, [cx, wallT + 0.032, d / 2 - 0.04]);
    }
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
