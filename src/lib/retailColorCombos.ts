import type {
  ArchitecturalAsset,
  AssetCategory,
  MaterialFinish,
  MultiPartFinishSpec,
  RetailComboRole,
} from './catalogTypes';
import { classifyAssetGroup } from './taxonomy';
import { TURKISH_GAP_ASSET_IDS } from './turkishGapAssets';

/**
 * Phase 1 covers the first half of the 731-asset catalog (374 assets = 51.2%):
 * - Banyo (212 assets across all 12 bathroom product groups)
 * - Salon (149 assets across all 8 living room product groups)
 * - Oda Tasarımları (13 full-room interior scenes across all 5 room groups)
 *
 * Every asset receives curated, real-world retail multi-part color combinations
 * matching Turkish & European architectural retail products (İnegöl, Enza, Lazzoni,
 * Mudo, VitrA, Kale, Artema, ECA, Geberit, Hüppe) — zero flat monochrome White/Black washes.
 */
export const PHASE_1_RETAIL_CATEGORIES: ReadonlySet<AssetCategory> = new Set<AssetCategory>([
  'Banyo',
  'Salon',
  'Oda Tasarımları',
]);

/**
 * Phase 2 completes the remaining half of the 731-asset catalog (357 assets = 48.8%):
 * - Çamaşır Odası (43), Yatak Odası (47), Yemek & Mutfak (115), Mimari & Çalışma (85),
 *   Aydınlatma (30), Dekor & Bitki (21), Dış Cephe (16).
 */
export const PHASE_2_RETAIL_CATEGORIES: ReadonlySet<AssetCategory> = new Set<AssetCategory>([
  'Çamaşır Odası',
  'Yatak Odası',
  'Çocuk & Oyun',
  'Yemek & Mutfak',
  'Mutfak Ankastre',
  'Antre & Giriş',
  'Mimari & Çalışma',
  'Elektrik Tesisatı',
  'Aydınlatma',
  'Dekor & Bitki',
  'Dış Cephe',
]);

export function isPhase1RetailAsset(asset: ArchitecturalAsset): boolean {
  return PHASE_1_RETAIL_CATEGORIES.has(asset.category);
}

export function isPhase2RetailAsset(asset: ArchitecturalAsset): boolean {
  return PHASE_2_RETAIL_CATEGORIES.has(asset.category);
}

interface ComboDef {
  id: string;
  label: string;
  comboSummary: string;
  materialKind: MaterialFinish['materialKind'];
  comboRole: RetailComboRole;
  partFinishes: MultiPartFinishSpec;
}

function buildCombo(def: ComboDef): MaterialFinish {
  return {
    id: def.id,
    label: def.label,
    comboSummary: def.comboSummary,
    materialKind: def.materialKind,
    primaryHex: def.partFinishes.primary.hex,
    secondaryHex: def.partFinishes.secondary.hex,
    accentHex: def.partFinishes.accent.hex,
    roughness: def.partFinishes.primary.roughness,
    metalness: def.partFinishes.primary.metalness,
    preserveOriginalTextures: false,
    paletteRecolorMode: 'multi-part-retail',
    comboRole: def.comboRole,
    partFinishes: def.partFinishes,
  };
}

function withOriginalPbr(
  asset: ArchitecturalAsset,
  combos: MaterialFinish[],
  comboRole: RetailComboRole,
): MaterialFinish[] {
  const isProcedural = asset.modelSource?.provider === 'procedural';
  if (isProcedural) {
    return combos;
  }
  const baseFirst = asset.finishes[0];
  const originalFinish: MaterialFinish = {
    id: 'orijinal-pbr',
    label: 'Orijinal PBR',
    comboSummary: 'Üretici orijinal PBR haritaları',
    materialKind: baseFirst?.materialKind || combos[0]?.materialKind || 'fabric',
    primaryHex: baseFirst?.primaryHex || combos[0]?.primaryHex || '#D8D2C8',
    secondaryHex: baseFirst?.secondaryHex || combos[0]?.secondaryHex || '#6B5847',
    accentHex: baseFirst?.accentHex || combos[0]?.accentHex || '#C5A059',
    roughness: baseFirst?.roughness ?? 0.55,
    metalness: baseFirst?.metalness ?? 0.05,
    preserveOriginalTextures: true,
    paletteRecolorMode: 'multi-part-retail',
    comboRole,
  };
  return [originalFinish, ...combos];
}

// =============================================================================
// 1. SALON — SEATING (Köşe Koltuk, Üçlü/İkili Koltuk, Berjer, Puf)
// Authentic İnegöl / Enza / Lazzoni / Mudo upholstery + wood/metal legs + cushion/hardware combos
// =============================================================================
const SALON_SEATING_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'krem-bukle-ceviz',
    label: 'Krem Bukle · Ceviz Ayak',
    comboSummary: 'Döşeme: Krem Bukle · Ayak/İskelet: Amerikan Ceviz · Detay: Fırçalı Pirinç',
    materialKind: 'fabric',
    comboRole: 'seating',
    partFinishes: {
      primary: { hex: '#ECE5D8', roughness: 0.9, metalness: 0.0, partLabel: 'Krem Bukle Döşeme' },
      secondary: { hex: '#63432D', roughness: 0.48, metalness: 0.03, partLabel: 'Amerikan Ceviz Ayak' },
      accent: { hex: '#C6A056', roughness: 0.26, metalness: 0.9, partLabel: 'Fırçalı Pirinç Detay' },
    },
  }),
  buildCombo({
    id: 'vizon-keten-mese',
    label: 'Vizon Keten · Doğal Meşe',
    comboSummary: 'Döşeme: Vizon Keten · Ayak/İskelet: Doğal Meşe · Detay: Mat Siyah Metal',
    materialKind: 'linen',
    comboRole: 'seating',
    partFinishes: {
      primary: { hex: '#AFA395', roughness: 0.88, metalness: 0.0, partLabel: 'Vizon Keten Kumaş' },
      secondary: { hex: '#B99264', roughness: 0.52, metalness: 0.02, partLabel: 'Doğal Meşe Ayak' },
      accent: { hex: '#282C33', roughness: 0.42, metalness: 0.72, partLabel: 'Mat Siyah Metal' },
    },
  }),
  buildCombo({
    id: 'adacayi-kadife-pirinc',
    label: 'Adaçayı Kadife · Pirinç',
    comboSummary: 'Döşeme: Adaçayı Kadife · Ayak: Fırçalı Pirinç · Kırlent/Biye: Sıcak Ekru',
    materialKind: 'fabric',
    comboRole: 'seating',
    partFinishes: {
      primary: { hex: '#6C8070', roughness: 0.82, metalness: 0.01, partLabel: 'Adaçayı Kadife' },
      secondary: { hex: '#4A3829', roughness: 0.46, metalness: 0.04, partLabel: 'Koyu Ceviz İskelet' },
      accent: { hex: '#D0AA5A', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Ayak' },
    },
  }),
  buildCombo({
    id: 'antrasit-dokuma-siyah-metal',
    label: 'Antrasit Dokuma · Ceviz',
    comboSummary: 'Döşeme: Antrasit Dokuma · Ayak: Ceviz / Füme · Detay: Füme Gunmetal',
    materialKind: 'fabric',
    comboRole: 'seating',
    partFinishes: {
      primary: { hex: '#3D424B', roughness: 0.86, metalness: 0.01, partLabel: 'Antrasit Dokuma' },
      secondary: { hex: '#7A563B', roughness: 0.48, metalness: 0.04, partLabel: 'Ceviz İskelet' },
      accent: { hex: '#8E95A0', roughness: 0.28, metalness: 0.88, partLabel: 'Saten Krom / Gunmetal' },
    },
  }),
  buildCombo({
    id: 'konyak-deri-siyah-celik',
    label: 'Konyak Deri · Siyah Çelik',
    comboSummary: 'Döşeme: Konyak Deri · Ayak: Mat Siyah Çelik · Detay: Eskitme Bronz',
    materialKind: 'fabric',
    comboRole: 'seating',
    partFinishes: {
      primary: { hex: '#9A5B32', roughness: 0.44, metalness: 0.04, partLabel: 'Konyak Hakiki Deri' },
      secondary: { hex: '#23262B', roughness: 0.42, metalness: 0.78, partLabel: 'Mat Siyah Çelik' },
      accent: { hex: '#B8894D', roughness: 0.3, metalness: 0.86, partLabel: 'Eskitme Bronz' },
    },
  }),
  buildCombo({
    id: 'gece-lacivert-kadife-gold',
    label: 'Lacivert Kadife · Gold',
    comboSummary: 'Döşeme: Gece Lacivert Kadife · Ayak: Siyah Meşe · Detay: Fırçalı Gold',
    materialKind: 'fabric',
    comboRole: 'seating',
    partFinishes: {
      primary: { hex: '#243A59', roughness: 0.82, metalness: 0.01, partLabel: 'Gece Lacivert Kadife' },
      secondary: { hex: '#2B2624', roughness: 0.45, metalness: 0.05, partLabel: 'Siyah Meşe Baz' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Gold Detay' },
    },
  }),
];

// =============================================================================
// 2. SALON — COFFEE TABLES, SIDE TABLES, TV UNITS, CONSOLES & BOOKSHELVES
// Real İnegöl / Lazzoni / Mudo marble/travertine/walnut top + matte black/brass base combos
// =============================================================================
const SALON_TABLE_CONSOLE_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'calacatta-mermer-siyah',
    label: 'Calacatta Mermer · Siyah Metal',
    comboSummary: 'Üst Tabla: Beyaz Calacatta Mermer · Ayak/Gövde: Mat Siyah Metal · Detay: Pirinç',
    materialKind: 'stone',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#EFECE6', roughness: 0.22, metalness: 0.02, partLabel: 'Calacatta Mermer Tabla' },
      secondary: { hex: '#22252B', roughness: 0.42, metalness: 0.76, partLabel: 'Mat Siyah Metal Ayak' },
      accent: { hex: '#CAA45A', roughness: 0.24, metalness: 0.92, partLabel: 'Pirinç Kulp & Detay' },
    },
  }),
  buildCombo({
    id: 'amerikan-ceviz-siyah-metal',
    label: 'Amerikan Ceviz · Siyah & Pirinç',
    comboSummary: 'Gövde/Tabla: Amerikan Ceviz · İskelet: Mat Siyah · Kulp/Detay: Fırçalı Pirinç',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#714D34', roughness: 0.46, metalness: 0.03, partLabel: 'Amerikan Ceviz' },
      secondary: { hex: '#25282E', roughness: 0.4, metalness: 0.74, partLabel: 'Mat Siyah İskelet' },
      accent: { hex: '#CFA85B', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Kulp' },
    },
  }),
  buildCombo({
    id: 'traverten-tas-dogal-mese',
    label: 'Traverten · Doğal Meşe',
    comboSummary: 'Üst Tabla: Honlu Traverten · Gövde/Ayak: Doğal Meşe · Detay: Bronz Metal',
    materialKind: 'stone',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#DFD4C2', roughness: 0.52, metalness: 0.02, partLabel: 'Honlu Traverten Taş' },
      secondary: { hex: '#B99164', roughness: 0.5, metalness: 0.02, partLabel: 'Doğal Meşe Gövde' },
      accent: { hex: '#9E7B4F', roughness: 0.3, metalness: 0.86, partLabel: 'Saten Bronz Detay' },
    },
  }),
  buildCombo({
    id: 'kasmir-lake-mese-gold',
    label: 'Kaşmir Lake · Meşe & Gold',
    comboSummary: 'Kapak/Gövde: Mat Kaşmir Lake · Üst/Ayak: Doğal Meşe · Detay: Fırçalı Gold',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#D8CFC2', roughness: 0.36, metalness: 0.03, partLabel: 'Mat Kaşmir Lake' },
      secondary: { hex: '#8F6A48', roughness: 0.48, metalness: 0.03, partLabel: 'Sıcak Meşe Tabla' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Gold Kulp' },
    },
  }),
  buildCombo({
    id: 'fume-mermer-gunmetal',
    label: 'Füme Mermer · Gunmetal',
    comboSummary: 'Tabla: Koyu Füme Mermer · Ayak/Gövde: Füme Gunmetal · Detay: Şampanya Pirinç',
    materialKind: 'stone',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#43464C', roughness: 0.2, metalness: 0.04, partLabel: 'Füme Mermer Tabla' },
      secondary: { hex: '#2C3038', roughness: 0.3, metalness: 0.86, partLabel: 'Füme Gunmetal Ayak' },
      accent: { hex: '#C8B088', roughness: 0.24, metalness: 0.9, partLabel: 'Şampanya Pirinç' },
    },
  }),
  buildCombo({
    id: 'sicak-beyaz-lake-ceviz',
    label: 'Mat Beyaz Lake · Ceviz',
    comboSummary: 'Gövde: Sıcak Beyaz Lake · Üst Tabla/Ayak: Doğal Ceviz · Detay: Mat Siyah',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#F0EDE6', roughness: 0.32, metalness: 0.03, partLabel: 'Mat Beyaz Lake' },
      secondary: { hex: '#7C573B', roughness: 0.46, metalness: 0.03, partLabel: 'Ceviz Tabla & Ayak' },
      accent: { hex: '#262930', roughness: 0.42, metalness: 0.72, partLabel: 'Mat Siyah Kulp' },
    },
  }),
];

// =============================================================================
// 3. BANYO — VANITY CABINETS (Banyo Dolabı)
// Real VitrA / Orka / Kale: Cabinet wood/lacquer + white ceramic/travertine counter + metal hardware
// =============================================================================
const BANYO_VANITY_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'dogal-mese-beyaz-siyah',
    label: 'Doğal Meşe · Beyaz Seramik · Siyah',
    comboSummary: 'Dolap: Doğal Meşe · Lavabo: Parlak Beyaz Seramik · Kulp/Batarya: Mat Siyah',
    materialKind: 'wood',
    comboRole: 'vanity',
    partFinishes: {
      primary: { hex: '#C29B6F', roughness: 0.5, metalness: 0.02, partLabel: 'Doğal Meşe Dolap' },
      secondary: { hex: '#F6F7F9', roughness: 0.1, metalness: 0.03, partLabel: 'Beyaz Seramik Lavabo' },
      accent: { hex: '#202329', roughness: 0.38, metalness: 0.76, partLabel: 'Mat Siyah Armatür & Kulp' },
      ceramic: { hex: '#F7F8FA', roughness: 0.09, metalness: 0.03, partLabel: 'Vitrifiye Porselen' },
    },
  }),
  buildCombo({
    id: 'kasmir-lake-traverten-gold',
    label: 'Kaşmir Lake · Traverten · Gold',
    comboSummary: 'Dolap: Mat Kaşmir Lake · Tezgah: Traverten · Kulp/Armatür: Fırçalı Gold',
    materialKind: 'wood',
    comboRole: 'vanity',
    partFinishes: {
      primary: { hex: '#D6CCBF', roughness: 0.38, metalness: 0.02, partLabel: 'Kaşmir Mat Lake' },
      secondary: { hex: '#EAE2D4', roughness: 0.28, metalness: 0.02, partLabel: 'Traverten Tezgah' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Gold Kulp' },
      ceramic: { hex: '#F8F8F6', roughness: 0.1, metalness: 0.03, partLabel: 'Beyaz Porselen Lavabo' },
    },
  }),
  buildCombo({
    id: 'amerikan-ceviz-mermer-siyah',
    label: 'Amerikan Ceviz · Calacatta · Siyah',
    comboSummary: 'Dolap: Amerikan Ceviz · Tezgah/Lavabo: Beyaz Mermer · Detay: Mat Siyah',
    materialKind: 'wood',
    comboRole: 'vanity',
    partFinishes: {
      primary: { hex: '#6D4B33', roughness: 0.46, metalness: 0.03, partLabel: 'Amerikan Ceviz' },
      secondary: { hex: '#F4F3F0', roughness: 0.14, metalness: 0.03, partLabel: 'Calacatta Tezgah' },
      accent: { hex: '#23262C', roughness: 0.36, metalness: 0.78, partLabel: 'Mat Siyah Metal' },
      ceramic: { hex: '#F7F8FA', roughness: 0.09, metalness: 0.03, partLabel: 'Beyaz Seramik' },
    },
  }),
  buildCombo({
    id: 'adacayi-lake-beyaz-pirinc',
    label: 'Spa Adaçayı · Beyaz · Pirinç',
    comboSummary: 'Dolap: Mat Adaçayı Lake · Lavabo: Parlak Beyaz · Kulp/Armatür: Fırçalı Pirinç',
    materialKind: 'wood',
    comboRole: 'vanity',
    partFinishes: {
      primary: { hex: '#778B7A', roughness: 0.42, metalness: 0.02, partLabel: 'Spa Adaçayı Lake' },
      secondary: { hex: '#F7F8FA', roughness: 0.1, metalness: 0.03, partLabel: 'Beyaz Seramik Lavabo' },
      accent: { hex: '#CFA859', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç' },
      ceramic: { hex: '#F7F8FA', roughness: 0.09, metalness: 0.03, partLabel: 'Beyaz Porselen' },
    },
  }),
  buildCombo({
    id: 'antrasit-oluklu-beyaz-gunmetal',
    label: 'Antrasit Lake · Beyaz · Gunmetal',
    comboSummary: 'Dolap: Mat Antrasit · Lavabo: Parlak Beyaz Seramik · Detay: Füme Gunmetal',
    materialKind: 'wood',
    comboRole: 'vanity',
    partFinishes: {
      primary: { hex: '#383D46', roughness: 0.44, metalness: 0.05, partLabel: 'Mat Antrasit Dolap' },
      secondary: { hex: '#F6F7F9', roughness: 0.1, metalness: 0.03, partLabel: 'Beyaz Seramik' },
      accent: { hex: '#5A616E', roughness: 0.24, metalness: 0.9, partLabel: 'Füme Gunmetal' },
      ceramic: { hex: '#F7F8FA', roughness: 0.09, metalness: 0.03, partLabel: 'Vitrifiye Seramik' },
    },
  }),
  buildCombo({
    id: 'mat-beyaz-lake-mese-krom',
    label: 'Beyaz Lake · Meşe Tezgah · Krom',
    comboSummary: 'Dolap: Sıcak Beyaz Lake · Tezgah/Raf: Doğal Meşe · Kulp/Armatür: Parlak Krom',
    materialKind: 'wood',
    comboRole: 'vanity',
    partFinishes: {
      primary: { hex: '#F0F1F3', roughness: 0.3, metalness: 0.03, partLabel: 'Mat Beyaz Lake' },
      secondary: { hex: '#BA9367', roughness: 0.5, metalness: 0.02, partLabel: 'Doğal Meşe Tezgah' },
      accent: { hex: '#E4E8EC', roughness: 0.1, metalness: 0.96, partLabel: 'Parlak Krom' },
      ceramic: { hex: '#F8F9FB', roughness: 0.08, metalness: 0.03, partLabel: 'Parlak Beyaz Lavabo' },
    },
  }),
];

// =============================================================================
// 4. BANYO — KLOZET & PİSUVAR (Sanitary Ceramic)
// Real VitrA / Kale / Geberit: Porcelain body + metallic flush actuator & hinges
// Note: preserves 'mat-antrasit-seramik' ID for backward compatibility with existing tests
// =============================================================================
const BANYO_SANITARY_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'parlak-beyaz-krom',
    label: 'Parlak Beyaz · Parlak Krom',
    comboSummary: 'Gövde & Kapak: Parlak Beyaz Vitrifiye · Kumanda & Menteşe: Parlak Krom',
    materialKind: 'ceramic',
    comboRole: 'sanitary_ceramic',
    partFinishes: {
      primary: { hex: '#F7F8FA', roughness: 0.08, metalness: 0.02, partLabel: 'Parlak Beyaz Porselen' },
      secondary: { hex: '#ECEEF2', roughness: 0.12, metalness: 0.02, partLabel: 'Soft-Close Kapak' },
      accent: { hex: '#DFE4EA', roughness: 0.1, metalness: 0.96, partLabel: 'Parlak Krom Kumanda' },
    },
  }),
  buildCombo({
    id: 'mat-beyaz-gold',
    label: 'Mat Beyaz · Fırçalı Gold',
    comboSummary: 'Gövde: Mat Beyaz Seramik · Kapak: Saten Beyaz · Kumanda & Menteşe: Fırçalı Gold',
    materialKind: 'ceramic',
    comboRole: 'sanitary_ceramic',
    partFinishes: {
      primary: { hex: '#EFEFE9', roughness: 0.36, metalness: 0.02, partLabel: 'Mat Beyaz Seramik' },
      secondary: { hex: '#E6E6DF', roughness: 0.28, metalness: 0.02, partLabel: 'Mat Beyaz Kapak' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Gold Detay' },
    },
  }),
  buildCombo({
    id: 'mat-beyaz-siyah-detay',
    label: 'Mat Beyaz · Mat Siyah Detay',
    comboSummary: 'Gövde: Mat Beyaz Porselen · Kumanda Paneli & Menteşe: Mat Siyah Metal',
    materialKind: 'ceramic',
    comboRole: 'sanitary_ceramic',
    partFinishes: {
      primary: { hex: '#F1F2F4', roughness: 0.34, metalness: 0.02, partLabel: 'Mat Beyaz Seramik' },
      secondary: { hex: '#E6E8EC', roughness: 0.24, metalness: 0.02, partLabel: 'İnce Soft-Close Kapak' },
      accent: { hex: '#202329', roughness: 0.4, metalness: 0.74, partLabel: 'Mat Siyah Kumanda' },
    },
  }),
  buildCombo({
    id: 'kasmir-mat-bronz',
    label: 'Kaşmir Mat · Saten Pirinç',
    comboSummary: 'Gövde: Mat Kaşmir Seramik · Kapak: Kaşmir · Kumanda & Menteşe: Saten Pirinç',
    materialKind: 'ceramic',
    comboRole: 'sanitary_ceramic',
    partFinishes: {
      primary: { hex: '#D6CEC2', roughness: 0.4, metalness: 0.02, partLabel: 'Mat Kaşmir Seramik' },
      secondary: { hex: '#CAC0B2', roughness: 0.32, metalness: 0.02, partLabel: 'Kaşmir Kapak' },
      accent: { hex: '#C69F58', roughness: 0.24, metalness: 0.92, partLabel: 'Saten Pirinç Detay' },
    },
  }),
  buildCombo({
    id: 'mat-antrasit-seramik',
    label: 'Mat Antrasit · Fırçalı Pirinç',
    comboSummary: 'Gövde: Mat Antrasit Seramik · Kumanda & Menteşe: Fırçalı Pirinç',
    materialKind: 'ceramic',
    comboRole: 'sanitary_ceramic',
    partFinishes: {
      primary: { hex: '#383D45', roughness: 0.42, metalness: 0.05, partLabel: 'Mat Antrasit Seramik' },
      secondary: { hex: '#2E3239', roughness: 0.36, metalness: 0.05, partLabel: 'Mat Antrasit Kapak' },
      accent: { hex: '#CFA859', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Detay' },
    },
  }),
  buildCombo({
    id: 'mat-siyah-gunmetal',
    label: 'Mat Siyah · Füme Gunmetal',
    comboSummary: 'Gövde: Mat Siyah Vitrifiye · Kumanda & Menteşe: Füme Gunmetal',
    materialKind: 'ceramic',
    comboRole: 'sanitary_ceramic',
    partFinishes: {
      primary: { hex: '#24272D', roughness: 0.44, metalness: 0.06, partLabel: 'Mat Siyah Seramik' },
      secondary: { hex: '#1D2025', roughness: 0.38, metalness: 0.06, partLabel: 'Mat Siyah Kapak' },
      accent: { hex: '#636B78', roughness: 0.24, metalness: 0.9, partLabel: 'Füme Gunmetal' },
    },
  }),
];

// =============================================================================
// 5. BANYO — LAVABO (Basins: Countertop & Pedestal)
// Ceramic/Travertine bowl + metallic drain/faucet/waste cap
// =============================================================================
const BANYO_BASIN_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'beyaz-seramik-krom-sifon',
    label: 'Parlak Beyaz · Krom Sifon',
    comboSummary: 'Çanak: Parlak Beyaz Seramik · Sifon & Gider: Parlak Krom',
    materialKind: 'ceramic',
    comboRole: 'sanitary_ceramic',
    partFinishes: {
      primary: { hex: '#F7F8FA', roughness: 0.08, metalness: 0.02, partLabel: 'Parlak Beyaz Seramik' },
      secondary: { hex: '#E6E9EE', roughness: 0.14, metalness: 0.03, partLabel: 'İç Sır Yüzeyi' },
      accent: { hex: '#E3E7EC', roughness: 0.09, metalness: 0.96, partLabel: 'Parlak Krom Sifon' },
    },
  }),
  buildCombo({
    id: 'mat-beyaz-gold-sifon',
    label: 'Mat Beyaz · Fırçalı Gold',
    comboSummary: 'Çanak: Mat Beyaz Porselen · Sifon & Detay: Fırçalı Gold',
    materialKind: 'ceramic',
    comboRole: 'sanitary_ceramic',
    partFinishes: {
      primary: { hex: '#F0EFEA', roughness: 0.36, metalness: 0.02, partLabel: 'Mat Beyaz Porselen' },
      secondary: { hex: '#E5E3DC', roughness: 0.32, metalness: 0.02, partLabel: 'Saten İç Yüzey' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Gold Sifon' },
    },
  }),
  buildCombo({
    id: 'traverten-dogal-tas-bronz',
    label: 'Traverten Taş · Bronz Detay',
    comboSummary: 'Gövde: Doğal Honlu Traverten · Gider & Sifon: Saten Bronz',
    materialKind: 'stone',
    comboRole: 'sanitary_ceramic',
    partFinishes: {
      primary: { hex: '#DDD1BE', roughness: 0.5, metalness: 0.02, partLabel: 'Doğal Traverten Taş' },
      secondary: { hex: '#C6B79F', roughness: 0.56, metalness: 0.02, partLabel: 'Taş Damar Tonu' },
      accent: { hex: '#9E7948', roughness: 0.28, metalness: 0.88, partLabel: 'Saten Bronz Sifon' },
    },
  }),
  buildCombo({
    id: 'kasmir-mat-siyah-sifon',
    label: 'Kaşmir Mat · Mat Siyah',
    comboSummary: 'Çanak: Mat Kaşmir Seramik · Sifon & Gider: Mat Siyah Metal',
    materialKind: 'ceramic',
    comboRole: 'sanitary_ceramic',
    partFinishes: {
      primary: { hex: '#D5CDC0', roughness: 0.42, metalness: 0.02, partLabel: 'Kaşmir Mat Seramik' },
      secondary: { hex: '#C2B8A8', roughness: 0.38, metalness: 0.02, partLabel: 'Kaşmir Gövde' },
      accent: { hex: '#202329', roughness: 0.38, metalness: 0.76, partLabel: 'Mat Siyah Sifon' },
    },
  }),
  buildCombo({
    id: 'mat-siyah-seramik-gold',
    label: 'Mat Siyah Seramik · Gold',
    comboSummary: 'Çanak: Mat Siyah Vitrifiye · Sifon & Gider Kapağı: Fırçalı Gold',
    materialKind: 'ceramic',
    comboRole: 'sanitary_ceramic',
    partFinishes: {
      primary: { hex: '#25282E', roughness: 0.42, metalness: 0.06, partLabel: 'Mat Siyah Seramik' },
      secondary: { hex: '#343840', roughness: 0.38, metalness: 0.06, partLabel: 'Saten Siyah İç' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Gold Sifon' },
    },
  }),
  buildCombo({
    id: 'adacayi-mat-krom',
    label: 'Adaçayı Mat · Krom Sifon',
    comboSummary: 'Çanak: Mat Adaçayı Seramik · Sifon & Armatür: Parlak Krom',
    materialKind: 'ceramic',
    comboRole: 'sanitary_ceramic',
    partFinishes: {
      primary: { hex: '#7E9180', roughness: 0.4, metalness: 0.02, partLabel: 'Adaçayı Seramik' },
      secondary: { hex: '#F3F4F2', roughness: 0.14, metalness: 0.02, partLabel: 'Açık İç Hazne' },
      accent: { hex: '#E3E7EC', roughness: 0.1, metalness: 0.96, partLabel: 'Parlak Krom' },
    },
  }),
];

// =============================================================================
// 6. BANYO — DUŞAKABİN (Shower Cabins & Enclosures)
// Profiles + Hinges + Clear/Bronze/Smoked/Frosted Glass + White Acrylic Tray
// Note: preserves 'fircali-gold-profil' ID for backward compatibility with existing tests
// =============================================================================
const BANYO_SHOWER_CABIN_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'mat-siyah-profil-seffaf-cam',
    label: 'Mat Siyah Profil · Şeffaf Cam',
    comboSummary: 'Profil: Mat Siyah Alüminyum · Cam: Şeffaf Temperli · Menteşe: Saten Siyah',
    materialKind: 'metal',
    comboRole: 'shower_cabin',
    partFinishes: {
      primary: { hex: '#1F2228', roughness: 0.42, metalness: 0.74, partLabel: 'Mat Siyah Profil' },
      secondary: { hex: '#353942', roughness: 0.36, metalness: 0.65, partLabel: 'Fitil & Kulp' },
      accent: { hex: '#4B505A', roughness: 0.28, metalness: 0.85, partLabel: 'Menteşe & Rulman' },
      ceramic: { hex: '#F5F6F8', roughness: 0.14, metalness: 0.02, partLabel: 'Beyaz Akrilik Tekne' },
      glass: { hex: '#E6F0F4', opacity: 0.24, roughness: 0.05 },
    },
  }),
  buildCombo({
    id: 'parlak-krom-profil-seffaf',
    label: 'Parlak Krom · Şeffaf Cam',
    comboSummary: 'Profil: Parlak Krom · Cam: Şeffaf 8mm Temperli · Tekne: Beyaz Akrilik',
    materialKind: 'metal',
    comboRole: 'shower_cabin',
    partFinishes: {
      primary: { hex: '#E4E8ED', roughness: 0.1, metalness: 0.96, partLabel: 'Parlak Krom Profil' },
      secondary: { hex: '#C6CCD4', roughness: 0.2, metalness: 0.88, partLabel: 'Krom Kulp' },
      accent: { hex: '#EEF2F6', roughness: 0.08, metalness: 0.98, partLabel: 'Parlak Menteşe' },
      ceramic: { hex: '#F6F7F9', roughness: 0.12, metalness: 0.02, partLabel: 'Beyaz Akrilik Tekne' },
      glass: { hex: '#EBF4F8', opacity: 0.22, roughness: 0.04 },
    },
  }),
  buildCombo({
    id: 'fircali-gold-profil',
    label: 'Fırçalı Gold · Bronz Füme Cam',
    comboSummary: 'Profil: Fırçalı Altın Gold · Cam: Bronz Füme Temperli · Menteşe: Saten Pirinç',
    materialKind: 'metal',
    comboRole: 'shower_cabin',
    partFinishes: {
      primary: { hex: '#D4AF5A', roughness: 0.24, metalness: 0.94, partLabel: 'Fırçalı Gold Profil' },
      secondary: { hex: '#B99242', roughness: 0.28, metalness: 0.9, partLabel: 'Pirinç Kulp' },
      accent: { hex: '#E0C070', roughness: 0.2, metalness: 0.95, partLabel: 'Gold Menteşe' },
      ceramic: { hex: '#F5F4F0', roughness: 0.14, metalness: 0.02, partLabel: 'Beyaz Akrilik Tekne' },
      glass: { hex: '#9E8568', opacity: 0.34, roughness: 0.06 },
    },
  }),
  buildCombo({
    id: 'fume-gunmetal-fume-cam',
    label: 'Füme Gunmetal · Füme Cam',
    comboSummary: 'Profil: Füme Gunmetal PVD · Cam: Füme Antrasit Temperli · Detay: Mat Siyah',
    materialKind: 'metal',
    comboRole: 'shower_cabin',
    partFinishes: {
      primary: { hex: '#4B525E', roughness: 0.26, metalness: 0.9, partLabel: 'Füme Gunmetal Profil' },
      secondary: { hex: '#282C33', roughness: 0.36, metalness: 0.78, partLabel: 'Siyah Kulp' },
      accent: { hex: '#636B78', roughness: 0.22, metalness: 0.92, partLabel: 'Gunmetal Menteşe' },
      ceramic: { hex: '#F2F3F5', roughness: 0.14, metalness: 0.02, partLabel: 'Akrilik Tekne' },
      glass: { hex: '#4A525C', opacity: 0.38, roughness: 0.06 },
    },
  }),
  buildCombo({
    id: 'fircali-nikel-buzlu-cam',
    label: 'Fırçalı Nikel · Buzlu Cam',
    comboSummary: 'Profil: Fırçalı Saten Nikel · Cam: Kumlu Buzlu Temperli · Menteşe: Krom',
    materialKind: 'metal',
    comboRole: 'shower_cabin',
    partFinishes: {
      primary: { hex: '#C0C5CC', roughness: 0.28, metalness: 0.92, partLabel: 'Fırçalı Nikel Profil' },
      secondary: { hex: '#9FA5AE', roughness: 0.32, metalness: 0.86, partLabel: 'Saten Kulp' },
      accent: { hex: '#DCE0E6', roughness: 0.16, metalness: 0.95, partLabel: 'Krom Menteşe' },
      ceramic: { hex: '#F6F7F9', roughness: 0.12, metalness: 0.02, partLabel: 'Beyaz Tekne' },
      glass: { hex: '#DFE6EC', opacity: 0.56, roughness: 0.42 },
    },
  }),
];

// =============================================================================
// 7. BANYO — KÜVET (Bathtubs)
// Realistic freestanding & built-in tubs: interior white acrylic + outer skirt + metallic drain/mixer
// =============================================================================
const BANYO_BATHTUB_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'beyaz-akrilik-krom',
    label: 'Parlak Beyaz · Krom Armatür',
    comboSummary: 'Gövde: Parlak Beyaz Akrilik · Sifon & Armatür: Parlak Krom',
    materialKind: 'ceramic',
    comboRole: 'bathtub',
    partFinishes: {
      primary: { hex: '#F7F8FA', roughness: 0.1, metalness: 0.02, partLabel: 'Parlak Beyaz Akrilik' },
      secondary: { hex: '#ECEFF3', roughness: 0.14, metalness: 0.02, partLabel: 'Dış Gövde' },
      accent: { hex: '#E3E7EC', roughness: 0.09, metalness: 0.96, partLabel: 'Parlak Krom Armatür' },
      ceramic: { hex: '#F8F9FB', roughness: 0.09, metalness: 0.02, partLabel: 'İç Küvet Haznesi' },
    },
  }),
  buildCombo({
    id: 'mat-beyaz-tas-gold',
    label: 'Mat Beyaz Taş · Fırçalı Gold',
    comboSummary: 'Gövde: Mat Beyaz Solid Surface · Sifon & Batarya: Fırçalı Gold',
    materialKind: 'stone',
    comboRole: 'bathtub',
    partFinishes: {
      primary: { hex: '#F0EFEA', roughness: 0.38, metalness: 0.02, partLabel: 'Mat Beyaz Solid Surface' },
      secondary: { hex: '#E6E4DD', roughness: 0.34, metalness: 0.02, partLabel: 'Mat Dış Etek' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Gold Armatür' },
      ceramic: { hex: '#F2F1EC', roughness: 0.32, metalness: 0.02, partLabel: 'İç Hazne' },
    },
  }),
  buildCombo({
    id: 'disi-siyah-ici-beyaz-gold',
    label: 'Siyah Dış · Beyaz İç · Gold',
    comboSummary: 'Dış Gövde: Mat Siyah · İç Hazne: Parlak Beyaz · Sifon/Batarya: Fırçalı Gold',
    materialKind: 'ceramic',
    comboRole: 'bathtub',
    partFinishes: {
      primary: { hex: '#23262C', roughness: 0.4, metalness: 0.08, partLabel: 'Mat Siyah Dış Gövde' },
      secondary: { hex: '#F7F8FA', roughness: 0.1, metalness: 0.02, partLabel: 'Beyaz İç Hazne' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Gold Sifon' },
      ceramic: { hex: '#F7F8FA', roughness: 0.1, metalness: 0.02, partLabel: 'Beyaz Akrilik İç' },
    },
  }),
  buildCombo({
    id: 'kasmir-tas-bronz-kuvet',
    label: 'Kaşmir Taş · Beyaz İç · Bronz',
    comboSummary: 'Dış Gövde: Mat Kaşmir Taş · İç Hazne: Sıcak Beyaz · Detay: Saten Bronz',
    materialKind: 'stone',
    comboRole: 'bathtub',
    partFinishes: {
      primary: { hex: '#D5CBBF', roughness: 0.44, metalness: 0.02, partLabel: 'Kaşmir Dış Gövde' },
      secondary: { hex: '#F5F4F0', roughness: 0.12, metalness: 0.02, partLabel: 'Beyaz İç Hazne' },
      accent: { hex: '#A5804E', roughness: 0.26, metalness: 0.88, partLabel: 'Saten Bronz Sifon' },
      ceramic: { hex: '#F5F4F0', roughness: 0.12, metalness: 0.02, partLabel: 'Beyaz İç' },
    },
  }),
  buildCombo({
    id: 'antrasit-tas-siyah-kuvet',
    label: 'Antrasit Dış · Beyaz İç · Siyah',
    comboSummary: 'Dış Gövde: Mat Antrasit · İç Hazne: Beyaz Akrilik · Armatür: Mat Siyah',
    materialKind: 'stone',
    comboRole: 'bathtub',
    partFinishes: {
      primary: { hex: '#3B4048', roughness: 0.44, metalness: 0.06, partLabel: 'Antrasit Dış Yüzey' },
      secondary: { hex: '#F6F7F9', roughness: 0.1, metalness: 0.02, partLabel: 'Beyaz İç Hazne' },
      accent: { hex: '#1F2228', roughness: 0.38, metalness: 0.78, partLabel: 'Mat Siyah Armatür' },
      ceramic: { hex: '#F6F7F9', roughness: 0.1, metalness: 0.02, partLabel: 'Beyaz Akrilik' },
    },
  }),
];

// =============================================================================
// 8. BANYO — LAVABO BATARYASI & DUŞ SETİ / TEPE DUŞ (Faucets & Shower Sets)
// Real Artema / ECA / Grohe PVD metallic body + contrast aerator/cartridge/nozzles
// Note: preserves 'fircali-pirinc-gold' with label 'Fırçalı Pirinç (Gold)' & metalness >= 0.9
// =============================================================================
const BANYO_FAUCET_SHOWER_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'parlak-krom-siyah-perlator',
    label: 'Parlak Krom · Siyah Detay',
    comboSummary: 'Gövde: Parlak Krom PVD · Perlatör/Nozul: Mat Siyah · Rozet: Saten Krom',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#E7EBF0', roughness: 0.08, metalness: 0.98, partLabel: 'Parlak Krom Gövde' },
      secondary: { hex: '#282C32', roughness: 0.55, metalness: 0.18, partLabel: 'Mat Siyah Perlatör/Nozul' },
      accent: { hex: '#C6CDD5', roughness: 0.22, metalness: 0.92, partLabel: 'Saten Krom Detay' },
    },
  }),
  buildCombo({
    id: 'mat-siyah-gold-detay',
    label: 'Mat Siyah · Pirinç Detay',
    comboSummary: 'Gövde: Mat Siyah PVD · Kumanda/Halka: Fırçalı Pirinç · Nozul: Antrasit Silikon',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#1F2228', roughness: 0.4, metalness: 0.76, partLabel: 'Mat Siyah Gövde' },
      secondary: { hex: '#353942', roughness: 0.62, metalness: 0.12, partLabel: 'Silikon Nozul / Kartuş' },
      accent: { hex: '#CFA859', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Detay' },
    },
  }),
  buildCombo({
    id: 'fircali-pirinc-gold',
    label: 'Fırçalı Pirinç (Gold)',
    comboSummary: 'Gövde: Fırçalı Altın Pirinç PVD · Perlatör/Nozul: Saten Siyah · Detay: Parlak Gold',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#D4AF5A', roughness: 0.24, metalness: 0.94, partLabel: 'Fırçalı Pirinç (Gold)' },
      secondary: { hex: '#2B2D32', roughness: 0.58, metalness: 0.16, partLabel: 'Siyah Kartuş & Nozul' },
      accent: { hex: '#E4C676', roughness: 0.18, metalness: 0.96, partLabel: 'Parlak Gold Halka' },
    },
  }),
  buildCombo({
    id: 'fume-gunmetal-siyah',
    label: 'Füme Gunmetal · Siyah',
    comboSummary: 'Gövde: Füme Gunmetal PVD · Perlatör/Nozul: Mat Siyah · Detay: Fırçalı Antrasit',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#4C535F', roughness: 0.24, metalness: 0.91, partLabel: 'Füme Gunmetal PVD' },
      secondary: { hex: '#24272D', roughness: 0.58, metalness: 0.18, partLabel: 'Mat Siyah Nozul' },
      accent: { hex: '#6E7684', roughness: 0.2, metalness: 0.94, partLabel: 'Parlak Antrasit Detay' },
    },
  }),
  buildCombo({
    id: 'fircali-nikel-krom',
    label: 'Fırçalı Nikel · Krom',
    comboSummary: 'Gövde: Fırçalı Saten Nikel · Detay: Parlak Krom · Nozul: Gri Silikon',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#C0C5CC', roughness: 0.28, metalness: 0.92, partLabel: 'Fırçalı Nikel Gövde' },
      secondary: { hex: '#4B5058', roughness: 0.6, metalness: 0.15, partLabel: 'Gri Silikon Nozul' },
      accent: { hex: '#E6EAEF', roughness: 0.1, metalness: 0.97, partLabel: 'Parlak Krom Detay' },
    },
  }),
  buildCombo({
    id: 'beyaz-mat-krom-ikili',
    label: 'Mat Beyaz & Krom İkili',
    comboSummary: 'Gövde: Mat Beyaz PVD · Kol & Perlatör Detayı: Parlak Krom',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#ECEEEB', roughness: 0.34, metalness: 0.16, partLabel: 'Mat Beyaz Gövde' },
      secondary: { hex: '#383C44', roughness: 0.56, metalness: 0.15, partLabel: 'Koyu Perlatör' },
      accent: { hex: '#E4E8EE', roughness: 0.1, metalness: 0.96, partLabel: 'Parlak Krom Kol' },
    },
  }),
];

// =============================================================================
// 9. BANYO — HAVLUPAN, HAVLULUK & TUVALET KAĞITLIĞI (Bath Metal Hardware)
// Preserves white paper rolls / indicator caps & adds authentic valve/rosette contrast!
// Note: preserves 'mat-altin-pirinc' with 'Fırçalı Altın Pirinç' in label for test compatibility
// =============================================================================
const BANYO_TOWEL_HARDWARE_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'mat-siyah-pirinc-rozet',
    label: 'Mat Siyah · Pirinç Detay',
    comboSummary: 'Gövde: Mat Siyah Elektrostatik · Vana/Rozet: Fırçalı Pirinç · Beyaz Rulo Korumalı',
    materialKind: 'metal',
    comboRole: 'towel_hardware',
    partFinishes: {
      primary: { hex: '#1F2228', roughness: 0.42, metalness: 0.72, partLabel: 'Mat Siyah Metal' },
      secondary: { hex: '#F3F2EE', roughness: 0.65, metalness: 0.0, partLabel: 'Beyaz Rulo / Havlu' },
      accent: { hex: '#CFA859', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Vana/Rozet' },
      ceramic: { hex: '#F5F5F2', roughness: 0.72, metalness: 0.0, partLabel: 'Beyaz Kağıt / Kapak' },
    },
  }),
  buildCombo({
    id: 'parlak-krom-saten-rozet',
    label: 'Parlak Krom · Saten Rozet',
    comboSummary: 'Gövde: Parlak Krom · Bağlantı/Vana: Saten Nikel · Beyaz Parçalar Korumalı',
    materialKind: 'metal',
    comboRole: 'towel_hardware',
    partFinishes: {
      primary: { hex: '#E5E9EE', roughness: 0.1, metalness: 0.96, partLabel: 'Parlak Krom' },
      secondary: { hex: '#F4F4F0', roughness: 0.68, metalness: 0.0, partLabel: 'Beyaz Kağıt / Detay' },
      accent: { hex: '#B8BFC8', roughness: 0.28, metalness: 0.9, partLabel: 'Saten Nikel Rozet' },
      ceramic: { hex: '#F5F5F2', roughness: 0.72, metalness: 0.0, partLabel: 'Beyaz Rulo' },
    },
  }),
  buildCombo({
    id: 'mat-altin-pirinc',
    label: 'Fırçalı Altın Pirinç · Siyah',
    comboSummary: 'Gövde: Fırçalı Altın Pirinç · Vana/Rozet: Mat Siyah · Beyaz Parçalar Korumalı',
    materialKind: 'metal',
    comboRole: 'towel_hardware',
    partFinishes: {
      primary: { hex: '#D4AF5A', roughness: 0.24, metalness: 0.94, partLabel: 'Fırçalı Altın Pirinç' },
      secondary: { hex: '#F4F3EE', roughness: 0.68, metalness: 0.0, partLabel: 'Beyaz Kağıt / Detay' },
      accent: { hex: '#262930', roughness: 0.4, metalness: 0.72, partLabel: 'Mat Siyah Vana/Bağlantı' },
      ceramic: { hex: '#F5F5F2', roughness: 0.72, metalness: 0.0, partLabel: 'Beyaz Rulo' },
    },
  }),
  buildCombo({
    id: 'fume-gunmetal-antrasit',
    label: 'Füme Gunmetal · Siyah',
    comboSummary: 'Gövde: Füme Gunmetal PVD · Rozet/Vana: Mat Siyah · Beyaz Parçalar Korumalı',
    materialKind: 'metal',
    comboRole: 'towel_hardware',
    partFinishes: {
      primary: { hex: '#4B525E', roughness: 0.26, metalness: 0.9, partLabel: 'Füme Gunmetal' },
      secondary: { hex: '#F3F3EF', roughness: 0.68, metalness: 0.0, partLabel: 'Beyaz Rulo' },
      accent: { hex: '#22252B', roughness: 0.42, metalness: 0.74, partLabel: 'Mat Siyah Bağlantı' },
      ceramic: { hex: '#F5F5F2', roughness: 0.72, metalness: 0.0, partLabel: 'Beyaz Kağıt' },
    },
  }),
  buildCombo({
    id: 'antrasit-mese-raf',
    label: 'Antrasit Metal · Doğal Meşe',
    comboSummary: 'Gövde: Mat Antrasit · Raf/Detay: Doğal Meşe · Beyaz Parçalar Korumalı',
    materialKind: 'metal',
    comboRole: 'towel_hardware',
    partFinishes: {
      primary: { hex: '#383D46', roughness: 0.42, metalness: 0.65, partLabel: 'Mat Antrasit Metal' },
      secondary: { hex: '#F3F2EE', roughness: 0.68, metalness: 0.0, partLabel: 'Beyaz Rulo' },
      accent: { hex: '#BC956A', roughness: 0.5, metalness: 0.04, partLabel: 'Doğal Meşe Detay' },
      ceramic: { hex: '#F5F5F2', roughness: 0.72, metalness: 0.0, partLabel: 'Beyaz Kağıt' },
    },
  }),
  buildCombo({
    id: 'mat-beyaz-krom-vana',
    label: 'Mat Beyaz · Krom Vana',
    comboSummary: 'Gövde: Mat Beyaz Elektrostatik · Vana & Bağlantı: Parlak Krom',
    materialKind: 'metal',
    comboRole: 'towel_hardware',
    partFinishes: {
      primary: { hex: '#EEEFE9', roughness: 0.36, metalness: 0.14, partLabel: 'Mat Beyaz Gövde' },
      secondary: { hex: '#F6F6F2', roughness: 0.68, metalness: 0.0, partLabel: 'Beyaz Rulo' },
      accent: { hex: '#DFE4EA', roughness: 0.1, metalness: 0.96, partLabel: 'Parlak Krom Vana' },
      ceramic: { hex: '#F6F6F2', roughness: 0.72, metalness: 0.0, partLabel: 'Beyaz Kağıt' },
    },
  }),
];

// =============================================================================
// 10. BANYO — AYNA & APLİK (Mirrors & Wall Sconces)
// Reflective mirror glass & glowing diffuser stay protected; frame & sconce metal change!
// =============================================================================
const BANYO_MIRROR_LIGHT_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'mat-siyah-cerceve-ayna',
    label: 'Mat Siyah Çerçeve · Ayna Cam',
    comboSummary: 'Çerçeve/Gövde: Mat Siyah Alüminyum · Ayna: Gümüş Yansıtıcı · Difüzör: Gün Işığı',
    materialKind: 'metal',
    comboRole: 'mirror_light',
    partFinishes: {
      primary: { hex: '#1F2228', roughness: 0.38, metalness: 0.78, partLabel: 'Mat Siyah Çerçeve' },
      secondary: { hex: '#D8DDE4', roughness: 0.08, metalness: 0.96, partLabel: 'Yansıtıcı Ayna Camı' },
      accent: { hex: '#F7E7C8', roughness: 0.22, metalness: 0.0, partLabel: 'Sıcak 3000K Difüzör' },
    },
  }),
  buildCombo({
    id: 'fircali-pirinc-cerceve-ayna',
    label: 'Fırçalı Pirinç · Sıcak LED',
    comboSummary: 'Çerçeve: Fırçalı Pirinç Gold · Ayna: Kristal Gümüş · Difüzör: Sıcak 3000K',
    materialKind: 'metal',
    comboRole: 'mirror_light',
    partFinishes: {
      primary: { hex: '#D4AF5A', roughness: 0.24, metalness: 0.94, partLabel: 'Fırçalı Pirinç Çerçeve' },
      secondary: { hex: '#DCE1E8', roughness: 0.08, metalness: 0.96, partLabel: 'Kristal Ayna' },
      accent: { hex: '#FCE8C2', roughness: 0.2, metalness: 0.0, partLabel: 'Sıcak LED Şerit' },
    },
  }),
  buildCombo({
    id: 'dogal-mese-cerceve-ayna',
    label: 'Doğal Meşe Çerçeve · Ayna',
    comboSummary: 'Çerçeve: Doğal Masif Meşe · Ayna: Gümüş Cam · Detay: Mat Siyah Bağlantı',
    materialKind: 'wood',
    comboRole: 'mirror_light',
    partFinishes: {
      primary: { hex: '#BC9468', roughness: 0.5, metalness: 0.03, partLabel: 'Doğal Meşe Çerçeve' },
      secondary: { hex: '#DCE1E8', roughness: 0.08, metalness: 0.96, partLabel: 'Ayna Camı' },
      accent: { hex: '#282C33', roughness: 0.38, metalness: 0.72, partLabel: 'Siyah Montaj Detayı' },
    },
  }),
  buildCombo({
    id: 'amerikan-ceviz-cerceve-pirinc',
    label: 'Amerikan Ceviz · Pirinç Detay',
    comboSummary: 'Çerçeve: Amerikan Ceviz · Ayna: Gümüş Cam · Aplik/Detay: Fırçalı Pirinç',
    materialKind: 'wood',
    comboRole: 'mirror_light',
    partFinishes: {
      primary: { hex: '#6D4B33', roughness: 0.46, metalness: 0.03, partLabel: 'Amerikan Ceviz Çerçeve' },
      secondary: { hex: '#DCE1E8', roughness: 0.08, metalness: 0.96, partLabel: 'Ayna Camı' },
      accent: { hex: '#CFA859', roughness: 0.24, metalness: 0.92, partLabel: 'Pirinç Aplik Detayı' },
    },
  }),
  buildCombo({
    id: 'fume-gunmetal-cerceve',
    label: 'Füme Gunmetal · Sıcak LED',
    comboSummary: 'Çerçeve: Füme Gunmetal PVD · Ayna: Gümüş Cam · Difüzör: Opal Beyaz',
    materialKind: 'metal',
    comboRole: 'mirror_light',
    partFinishes: {
      primary: { hex: '#4B525E', roughness: 0.26, metalness: 0.9, partLabel: 'Füme Gunmetal Çerçeve' },
      secondary: { hex: '#D8DDE4', roughness: 0.08, metalness: 0.96, partLabel: 'Ayna Camı' },
      accent: { hex: '#F3EFE6', roughness: 0.24, metalness: 0.0, partLabel: 'Opal Cam Difüzör' },
    },
  }),
];

// =============================================================================
// 11. BANYO — AKSESUAR & ÇAMAŞIR (Soap Dispensers, Brushes, Bins, Baskets, Shelves)
// Real Zara Home / Mudo / VitrA spa accessory combos (marble+brass, black+bamboo, travertine+black)
// =============================================================================
const BANYO_ACCESSORY_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'beyaz-mermer-pirinc-aksesuar',
    label: 'Beyaz Mermer · Pirinç Detay',
    comboSummary: 'Gövde: Beyaz Damarlı Mermer · Pompa/Kapak/Sap: Fırçalı Pirinç',
    materialKind: 'stone',
    comboRole: 'bath_accessory',
    partFinishes: {
      primary: { hex: '#EFECE6', roughness: 0.28, metalness: 0.02, partLabel: 'Beyaz Mermer Gövde' },
      secondary: { hex: '#D6D0C5', roughness: 0.36, metalness: 0.02, partLabel: 'Taş Kontrast Detay' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Pirinç Pompa/Sap' },
    },
  }),
  buildCombo({
    id: 'mat-siyah-bambu-aksesuar',
    label: 'Mat Siyah · Doğal Bambu',
    comboSummary: 'Gövde: Mat Siyah Seramik/Metal · Kapak/Sap: Doğal Bambu · Detay: Füme',
    materialKind: 'ceramic',
    comboRole: 'bath_accessory',
    partFinishes: {
      primary: { hex: '#24272D', roughness: 0.44, metalness: 0.14, partLabel: 'Mat Siyah Gövde' },
      secondary: { hex: '#C6A06B', roughness: 0.52, metalness: 0.02, partLabel: 'Doğal Bambu Kapak' },
      accent: { hex: '#525864', roughness: 0.26, metalness: 0.88, partLabel: 'Gunmetal Detay' },
    },
  }),
  buildCombo({
    id: 'traverten-tas-siyah-aksesuar',
    label: 'Traverten · Mat Siyah Metal',
    comboSummary: 'Gövde: Doğal Traverten Taş · Pompa/Çerçeve: Mat Siyah Metal',
    materialKind: 'stone',
    comboRole: 'bath_accessory',
    partFinishes: {
      primary: { hex: '#DDD2BF', roughness: 0.52, metalness: 0.02, partLabel: 'Traverten Taş' },
      secondary: { hex: '#C2B49D', roughness: 0.56, metalness: 0.02, partLabel: 'Taş Detay' },
      accent: { hex: '#202329', roughness: 0.38, metalness: 0.78, partLabel: 'Mat Siyah Metal' },
    },
  }),
  buildCombo({
    id: 'kasmir-seramik-krom',
    label: 'Kaşmir Seramik · Parlak Krom',
    comboSummary: 'Gövde: Mat Kaşmir Seramik · Pompa/Sap/Halka: Parlak Krom',
    materialKind: 'ceramic',
    comboRole: 'bath_accessory',
    partFinishes: {
      primary: { hex: '#D5CDC0', roughness: 0.42, metalness: 0.02, partLabel: 'Kaşmir Seramik' },
      secondary: { hex: '#EDE8E0', roughness: 0.34, metalness: 0.02, partLabel: 'Açık Kaşmir' },
      accent: { hex: '#E3E7EC', roughness: 0.1, metalness: 0.96, partLabel: 'Parlak Krom' },
    },
  }),
  buildCombo({
    id: 'dogal-bambu-ekru-tekstil',
    label: 'Doğal Bambu · Ekru Keten',
    comboSummary: 'Gövde: Doğal Bambu/Ahşap · İç Torba/Kumaş: Ekru Keten · Detay: Bronz',
    materialKind: 'wood',
    comboRole: 'bath_accessory',
    partFinishes: {
      primary: { hex: '#C59E6A', roughness: 0.54, metalness: 0.02, partLabel: 'Doğal Bambu' },
      secondary: { hex: '#ECE5D8', roughness: 0.88, metalness: 0.0, partLabel: 'Ekru Keten Astar' },
      accent: { hex: '#9E7A4A', roughness: 0.28, metalness: 0.86, partLabel: 'Bronz Detay' },
    },
  }),
  buildCombo({
    id: 'adacayi-mat-pirinc-aksesuar',
    label: 'Spa Adaçayı · Pirinç',
    comboSummary: 'Gövde: Mat Adaçayı Seramik · Pompa/Kapak: Fırçalı Pirinç',
    materialKind: 'ceramic',
    comboRole: 'bath_accessory',
    partFinishes: {
      primary: { hex: '#7A8E7D', roughness: 0.44, metalness: 0.02, partLabel: 'Adaçayı Seramik' },
      secondary: { hex: '#EAE5DA', roughness: 0.4, metalness: 0.02, partLabel: 'Ekru Detay' },
      accent: { hex: '#CFA859', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç' },
    },
  }),
];

// =============================================================================
// 12. BANYO — HAVLU & TEKSTİL (Non-rug bath towels in banyo-halisi)
// Spa cotton towel combinations (body + woven dobby border stripe)
// =============================================================================
const BANYO_TOWEL_TEXTILE_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'ekru-pamuk-vizon-bordur',
    label: 'Ekru Pamuk · Vizon Bordür',
    comboSummary: 'Ana Havlu: %100 Ekru Pamuk · Dokuma Bordür: Vizon · Detay: Koyu Grej',
    materialKind: 'linen',
    comboRole: 'bath_textile',
    partFinishes: {
      primary: { hex: '#EFE9DE', roughness: 0.94, metalness: 0.0, partLabel: 'Ekru Pamuk Havlu' },
      secondary: { hex: '#AEA08E', roughness: 0.92, metalness: 0.0, partLabel: 'Vizon Bordür' },
      accent: { hex: '#6E6154', roughness: 0.9, metalness: 0.0, partLabel: 'Grej Şerit' },
    },
  }),
  buildCombo({
    id: 'adacayi-waffle-keten',
    label: 'Adaçayı Spa · Keten Şerit',
    comboSummary: 'Ana Havlu: Adaçayı Waffle Pamuk · Bordür: Doğal Keten · Detay: Yosun',
    materialKind: 'linen',
    comboRole: 'bath_textile',
    partFinishes: {
      primary: { hex: '#7A8E7D', roughness: 0.94, metalness: 0.0, partLabel: 'Adaçayı Pamuk' },
      secondary: { hex: '#E6DFD2', roughness: 0.92, metalness: 0.0, partLabel: 'Keten Bordür' },
      accent: { hex: '#435547', roughness: 0.92, metalness: 0.0, partLabel: 'Yosun Şerit' },
    },
  }),
  buildCombo({
    id: 'antrasit-spa-tas-gri',
    label: 'Antrasit Spa · Taş Gri',
    comboSummary: 'Ana Havlu: Antrasit Pamuk · Bordür: Taş Gri · Detay: Gümüş Şerit',
    materialKind: 'linen',
    comboRole: 'bath_textile',
    partFinishes: {
      primary: { hex: '#3B4048', roughness: 0.94, metalness: 0.0, partLabel: 'Antrasit Pamuk' },
      secondary: { hex: '#9DA3AC', roughness: 0.92, metalness: 0.0, partLabel: 'Taş Gri Bordür' },
      accent: { hex: '#D8DCE2', roughness: 0.9, metalness: 0.0, partLabel: 'Gümüş Şerit' },
    },
  }),
  buildCombo({
    id: 'sicak-kum-terracotta',
    label: 'Sıcak Kum · Terracotta',
    comboSummary: 'Ana Havlu: Sıcak Kum Pamuk · Bordür: Anadolu Terracotta · Detay: Kiremit',
    materialKind: 'linen',
    comboRole: 'bath_textile',
    partFinishes: {
      primary: { hex: '#E4D8C6', roughness: 0.94, metalness: 0.0, partLabel: 'Sıcak Kum Pamuk' },
      secondary: { hex: '#B86245', roughness: 0.92, metalness: 0.0, partLabel: 'Terracotta Bordür' },
      accent: { hex: '#7C3E2A', roughness: 0.92, metalness: 0.0, partLabel: 'Kiremit Şerit' },
    },
  }),
  buildCombo({
    id: 'otel-beyaz-gumus-serit',
    label: 'Otel Beyazı · Gümüş Bordür',
    comboSummary: 'Ana Havlu: Parlak Otel Beyazı · Bordür: Saten Gümüş · Detay: Antrasit Biye',
    materialKind: 'linen',
    comboRole: 'bath_textile',
    partFinishes: {
      primary: { hex: '#F5F5F2', roughness: 0.92, metalness: 0.0, partLabel: 'Otel Beyazı Pamuk' },
      secondary: { hex: '#C6CBD2', roughness: 0.88, metalness: 0.0, partLabel: 'Gümüş Bordür' },
      accent: { hex: '#525864', roughness: 0.9, metalness: 0.0, partLabel: 'Antrasit Biye' },
    },
  }),
];

// =============================================================================
// 13. ODA TASARIMLARI (Full-Room Interior Design Palettes)
// Cohesive multi-surface architectural interior schemes (walls + wood + upholstery + metal)
// =============================================================================
const ROOM_SCENE_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'akdeniz-krem-mese-pirinc',
    label: 'Akdeniz · Krem, Meşe & Pirinç',
    comboSummary: 'Duvar/Döşeme: Sıcak Krem · Mobilya/Parke: Doğal Meşe · Detay: Fırçalı Pirinç',
    materialKind: 'wood',
    comboRole: 'room_scene',
    partFinishes: {
      primary: { hex: '#EBE4D8', roughness: 0.72, metalness: 0.01, partLabel: 'Sıcak Krem Duvar & Tekstil' },
      secondary: { hex: '#BA9266', roughness: 0.5, metalness: 0.02, partLabel: 'Doğal Meşe Mobilya & Parke' },
      accent: { hex: '#CFA859', roughness: 0.24, metalness: 0.9, partLabel: 'Pirinç Aydınlatma & Aksesuar' },
      ceramic: { hex: '#F6F5F0', roughness: 0.25, metalness: 0.02, partLabel: 'Tavan & Beyaz Seramik' },
    },
  }),
  buildCombo({
    id: 'iskandinav-keten-acik-mese-siyah',
    label: 'İskandinav · Keten, Meşe & Siyah',
    comboSummary: 'Ana Yüzey: Açık Keten & Beyaz · Ahşap: İskandinav Meşe · Kontrast: Mat Siyah',
    materialKind: 'wood',
    comboRole: 'room_scene',
    partFinishes: {
      primary: { hex: '#E6E2DA', roughness: 0.78, metalness: 0.01, partLabel: 'Keten & Kırık Beyaz' },
      secondary: { hex: '#C9A87E', roughness: 0.54, metalness: 0.02, partLabel: 'Açık İskandinav Meşe' },
      accent: { hex: '#262A32', roughness: 0.4, metalness: 0.65, partLabel: 'Mat Siyah Metal Detay' },
      ceramic: { hex: '#F5F6F7', roughness: 0.24, metalness: 0.02, partLabel: 'Beyaz Vitrifiye & Tavan' },
    },
  }),
  buildCombo({
    id: 'koyu-villa-antrasit-ceviz-bronz',
    label: 'Lüks Villa · Antrasit, Ceviz & Bronz',
    comboSummary: 'Ana Yüzey: Sıcak Antrasit & Grej · Ahşap: Amerikan Ceviz · Detay: Bronz Gold',
    materialKind: 'wood',
    comboRole: 'room_scene',
    partFinishes: {
      primary: { hex: '#4B5059', roughness: 0.66, metalness: 0.03, partLabel: 'Antrasit & Koyu Grej' },
      secondary: { hex: '#714D34', roughness: 0.46, metalness: 0.03, partLabel: 'Amerikan Ceviz' },
      accent: { hex: '#C69D54', roughness: 0.24, metalness: 0.9, partLabel: 'Saten Bronz & Gold' },
      ceramic: { hex: '#E8E4DC', roughness: 0.3, metalness: 0.02, partLabel: 'Sıcak Taş & Beyaz' },
    },
  }),
  buildCombo({
    id: 'dogal-traverten-kasmir-adacayi',
    label: 'Doğal Spa · Kaşmir, Traverten & Adaçayı',
    comboSummary: 'Ana Yüzey: Kaşmir & Traverten · Vurgu: Adaçayı Yeşil · Detay: Bronz',
    materialKind: 'stone',
    comboRole: 'room_scene',
    partFinishes: {
      primary: { hex: '#DDD3C3', roughness: 0.58, metalness: 0.02, partLabel: 'Traverten & Kaşmir' },
      secondary: { hex: '#768B79', roughness: 0.68, metalness: 0.02, partLabel: 'Adaçayı Mobilya & Vurgu' },
      accent: { hex: '#9E7A4C', roughness: 0.28, metalness: 0.86, partLabel: 'Saten Bronz Detay' },
      ceramic: { hex: '#F4F1EA', roughness: 0.22, metalness: 0.02, partLabel: 'Fildişi & Seramik' },
    },
  }),
  buildCombo({
    id: 'cagdas-loft-beton-ceviz-gunmetal',
    label: 'Çağdaş Loft · Beton, Ceviz & Gunmetal',
    comboSummary: 'Ana Yüzey: Mikroçimento Gri · Ahşap: Sıcak Ceviz · Metal: Füme Gunmetal',
    materialKind: 'stone',
    comboRole: 'room_scene',
    partFinishes: {
      primary: { hex: '#B8B9BC', roughness: 0.68, metalness: 0.03, partLabel: 'Mikroçimento & Açık Gri' },
      secondary: { hex: '#7C563A', roughness: 0.48, metalness: 0.03, partLabel: 'Sıcak Ceviz Ahşap' },
      accent: { hex: '#434954', roughness: 0.28, metalness: 0.86, partLabel: 'Füme Gunmetal' },
      ceramic: { hex: '#F1F2F4', roughness: 0.22, metalness: 0.02, partLabel: 'Beyaz Detay' },
    },
  }),
];

// =============================================================================
// PHASE 2 — 14. ÇAMAŞIR ODASI DOLAP, SEPET & ÜTÜ ÜNİTELERİ (Laundry Cabinets)
// Preserves curated IDs (kasmir-mese-siyah, gece-lacivert-pirinc, etc.) with full multi-part specs!
// =============================================================================
const LAUNDRY_CABINET_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'kasmir-mese-siyah',
    label: 'Kaşmir Mat · Doğal Meşe · Siyah',
    comboSummary: 'Dolap: Mat Kaşmir Lake · İç Niş/Tezgah: Doğal Meşe · Kulp/Askı: Mat Siyah',
    materialKind: 'wood',
    comboRole: 'laundry_cabinet',
    partFinishes: {
      primary: { hex: '#D8CFC2', roughness: 0.38, metalness: 0.02, partLabel: 'Kaşmir Mat Lake' },
      secondary: { hex: '#BA9366', roughness: 0.5, metalness: 0.02, partLabel: 'Doğal Meşe Niş & Raf' },
      accent: { hex: '#22252C', roughness: 0.38, metalness: 0.78, partLabel: 'Mat Siyah Kulp & Boru' },
      ceramic: { hex: '#F6F7F9', roughness: 0.12, metalness: 0.03, partLabel: 'Beyaz Evye & Makine' },
    },
  }),
  buildCombo({
    id: 'mat-beyaz-lake',
    label: 'Mat Beyaz Lake · Meşe · Siyah',
    comboSummary: 'Dolap: Sıcak Beyaz Lake · Tezgah/Sepet: Doğal Meşe · Kulp: Mat Siyah Metal',
    materialKind: 'wood',
    comboRole: 'laundry_cabinet',
    partFinishes: {
      primary: { hex: '#F2F0EB', roughness: 0.32, metalness: 0.02, partLabel: 'Mat Beyaz Lake' },
      secondary: { hex: '#B89164', roughness: 0.52, metalness: 0.02, partLabel: 'Doğal Meşe Tezgah' },
      accent: { hex: '#23262D', roughness: 0.38, metalness: 0.76, partLabel: 'Mat Siyah Kulp' },
      ceramic: { hex: '#F7F8FA', roughness: 0.1, metalness: 0.03, partLabel: 'Beyaz Evye & Seramik' },
    },
  }),
  buildCombo({
    id: 'gece-lacivert-pirinc',
    label: 'Gece Lacivert · Meşe · Pirinç',
    comboSummary: 'Dolap: Gece Lacivert Lake · İç Niş/Tezgah: Sıcak Meşe · Kulp: Fırçalı Pirinç',
    materialKind: 'wood',
    comboRole: 'laundry_cabinet',
    partFinishes: {
      primary: { hex: '#253852', roughness: 0.4, metalness: 0.04, partLabel: 'Gece Lacivert Lake' },
      secondary: { hex: '#B99265', roughness: 0.5, metalness: 0.02, partLabel: 'Sıcak Meşe Niş' },
      accent: { hex: '#D4AF5A', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Kulp' },
      ceramic: { hex: '#F6F7F9', roughness: 0.12, metalness: 0.03, partLabel: 'Beyaz Evye & Makine' },
    },
  }),
  buildCombo({
    id: 'dogal-mese-siyah',
    label: 'Doğal Meşe · Beyaz · Mat Siyah',
    comboSummary: 'Dolap: Doğal Masif Meşe · Tezgah/İç: Kırık Beyaz · Kulp & Askı: Mat Siyah',
    materialKind: 'wood',
    comboRole: 'laundry_cabinet',
    partFinishes: {
      primary: { hex: '#BD966A', roughness: 0.5, metalness: 0.02, partLabel: 'Doğal Meşe Dolap' },
      secondary: { hex: '#EAE6DE', roughness: 0.44, metalness: 0.02, partLabel: 'Kırık Beyaz Niş' },
      accent: { hex: '#202329', roughness: 0.4, metalness: 0.78, partLabel: 'Mat Siyah Metal' },
      ceramic: { hex: '#F6F7F9', roughness: 0.1, metalness: 0.03, partLabel: 'Beyaz Seramik Evye' },
    },
  }),
  buildCombo({
    id: 'spa-adacayi-yesili',
    label: 'Spa Adaçayı · Meşe · Pirinç',
    comboSummary: 'Dolap: Mat Adaçayı Lake · İç Niş/Sepet: Doğal Meşe · Kulp: Fırçalı Pirinç',
    materialKind: 'wood',
    comboRole: 'laundry_cabinet',
    partFinishes: {
      primary: { hex: '#778B7A', roughness: 0.42, metalness: 0.02, partLabel: 'Spa Adaçayı Lake' },
      secondary: { hex: '#C29D70', roughness: 0.5, metalness: 0.02, partLabel: 'Doğal Meşe Raf' },
      accent: { hex: '#CFA859', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Kulp' },
      ceramic: { hex: '#F7F8FA', roughness: 0.12, metalness: 0.03, partLabel: 'Beyaz Evye & Makine' },
    },
  }),
  buildCombo({
    id: 'mat-antrasit-ceviz',
    label: 'Mat Antrasit · Ceviz · Gunmetal',
    comboSummary: 'Dolap: Mat Antrasit Lake · İç Niş/Tezgah: Amerikan Ceviz · Kulp: Gunmetal',
    materialKind: 'wood',
    comboRole: 'laundry_cabinet',
    partFinishes: {
      primary: { hex: '#383D46', roughness: 0.44, metalness: 0.05, partLabel: 'Mat Antrasit Dolap' },
      secondary: { hex: '#734F35', roughness: 0.48, metalness: 0.03, partLabel: 'Amerikan Ceviz Niş' },
      accent: { hex: '#636B78', roughness: 0.24, metalness: 0.9, partLabel: 'Füme Gunmetal Kulp' },
      ceramic: { hex: '#F5F6F8', roughness: 0.12, metalness: 0.03, partLabel: 'Beyaz Evye & Makine' },
    },
  }),
];

// =============================================================================
// PHASE 2 — 15. ANKASTRE & BEYAZ EŞYA / ÇAMAŞIR MAKİNELERİ (Appliances)
// Real Arçelik / Bosch / Siemens / Franke: Inox + black glass, obsidian matte black, white + dark panel
// =============================================================================
const APPLIANCE_RETAIL_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'inox-celik-siyah-cam',
    label: 'İnox Çelik · Siyah Cam',
    comboSummary: 'Gövde: Fırçalı Paslanmaz İnox · Kapak/Panel: Siyah Cam · Kulp: Parlak Krom',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#C6CCD4', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı İnox Çelik' },
      secondary: { hex: '#1C1F26', roughness: 0.16, metalness: 0.28, partLabel: 'Siyah Kontrol & Kapak' },
      accent: { hex: '#E4E8EE', roughness: 0.12, metalness: 0.96, partLabel: 'Parlak Krom Kulp' },
      ceramic: { hex: '#20242C', roughness: 0.18, metalness: 0.22, partLabel: 'Füme Cam Kapak' },
    },
  }),
  buildCombo({
    id: 'mat-siyah-cam-inox',
    label: 'Mat Siyah Cam · İnox Detay',
    comboSummary: 'Gövde: Mat Siyah Çelik/Cam · Panel: Parlak Siyah · Kulp/Düğme: Fırçalı İnox',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#23262D', roughness: 0.32, metalness: 0.62, partLabel: 'Mat Siyah Ankastre' },
      secondary: { hex: '#16181E', roughness: 0.14, metalness: 0.32, partLabel: 'Siyah Temperli Cam' },
      accent: { hex: '#CFD5DC', roughness: 0.2, metalness: 0.94, partLabel: 'Fırçalı İnox Kulp' },
      ceramic: { hex: '#181B21', roughness: 0.14, metalness: 0.28, partLabel: 'Siyah Cam Yüzey' },
    },
  }),
  buildCombo({
    id: 'parlak-beyaz-antrasit-panel',
    label: 'Parlak Beyaz · Antrasit Panel',
    comboSummary: 'Gövde: Parlak Beyaz Emaye · Kapak/Panel: Koyu Antrasit · Detay: Parlak Krom',
    materialKind: 'ceramic',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#F3F5F7', roughness: 0.16, metalness: 0.08, partLabel: 'Parlak Beyaz Gövde' },
      secondary: { hex: '#282C34', roughness: 0.24, metalness: 0.35, partLabel: 'Antrasit Kapak/Panel' },
      accent: { hex: '#DCE1E7', roughness: 0.12, metalness: 0.95, partLabel: 'Parlak Krom Detay' },
      ceramic: { hex: '#22262E', roughness: 0.16, metalness: 0.25, partLabel: 'Koyu Cam Pencere' },
    },
  }),
  buildCombo({
    id: 'fume-antrasit-inox-siyah',
    label: 'Füme Antrasit İnox · Siyah',
    comboSummary: 'Gövde: Füme Titanyum İnox · Panel: Siyah Cam · Kulp: Füme Gunmetal',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#4B525E', roughness: 0.26, metalness: 0.88, partLabel: 'Füme Titanyum İnox' },
      secondary: { hex: '#1A1D23', roughness: 0.16, metalness: 0.28, partLabel: 'Siyah Cam Panel' },
      accent: { hex: '#88909C', roughness: 0.22, metalness: 0.92, partLabel: 'Saten Metal Kulp' },
      ceramic: { hex: '#1B1E24', roughness: 0.16, metalness: 0.24, partLabel: 'Füme Cam Kapak' },
    },
  }),
  buildCombo({
    id: 'saten-sampanya-siyah-cam',
    label: 'Saten Şampanya · Siyah Cam',
    comboSummary: 'Gövde: Saten Şampanya İnox · Panel: Siyah Cam · Kulp/Detay: Fırçalı Pirinç',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#D0C5B4', roughness: 0.26, metalness: 0.86, partLabel: 'Saten Şampanya İnox' },
      secondary: { hex: '#1E2128', roughness: 0.16, metalness: 0.28, partLabel: 'Siyah Cam Panel' },
      accent: { hex: '#CFA859', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Pirinç Kulp' },
      ceramic: { hex: '#1E2128', roughness: 0.16, metalness: 0.24, partLabel: 'Siyah Cam' },
    },
  }),
];

// =============================================================================
// PHASE 2 — 16. YATAK ODASI — ÇİFT & TEK KİŞİLİK YATAKLAR (Bed Frames + Crisp Bedding)
// Keeps hotel-white/ecru sheets & pillows realistic while headboards, bases & legs change!
// =============================================================================
const BEDROOM_BED_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'krem-bukle-yatak-ceviz',
    label: 'Krem Bukle · Ceviz · Ekru Nevresim',
    comboSummary: 'Başlık & Baza: Krem Bukle · Ayak/Çerçeve: Amerikan Ceviz · Yatak/Nevresim: Ekru Pamuk',
    materialKind: 'fabric',
    comboRole: 'bed_frame',
    partFinishes: {
      primary: { hex: '#EAE2D4', roughness: 0.9, metalness: 0.0, partLabel: 'Krem Bukle Başlık & Baza' },
      secondary: { hex: '#6B4930', roughness: 0.48, metalness: 0.03, partLabel: 'Amerikan Ceviz Ayak' },
      accent: { hex: '#CFA859', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Detay' },
      ceramic: { hex: '#F5F3EE', roughness: 0.92, metalness: 0.0, partLabel: 'Ekru Otel Nevresimi' },
    },
  }),
  buildCombo({
    id: 'dogal-mese-karyola-keten',
    label: 'Doğal Meşe · Keten Nevresim · Siyah',
    comboSummary: 'Karyola & Başlık: Doğal Meşe · Yatak/Örtü: Kırık Beyaz Keten · Kulp/Ayak: Mat Siyah',
    materialKind: 'wood',
    comboRole: 'bed_frame',
    partFinishes: {
      primary: { hex: '#C0986B', roughness: 0.5, metalness: 0.02, partLabel: 'Doğal Meşe Karyola' },
      secondary: { hex: '#A47D54', roughness: 0.52, metalness: 0.02, partLabel: 'Masif Meşe Baza' },
      accent: { hex: '#23262C', roughness: 0.4, metalness: 0.74, partLabel: 'Mat Siyah Metal Detay' },
      ceramic: { hex: '#F4F1EA', roughness: 0.92, metalness: 0.0, partLabel: 'Doğal Keten Nevresim' },
    },
  }),
  buildCombo({
    id: 'amerikan-ceviz-yatak-pirinc',
    label: 'Amerikan Ceviz · Ekru · Pirinç',
    comboSummary: 'Karyola/Başlık: Amerikan Ceviz · Nevresim/Yastık: Sıcak Ekru · Kulp/Detay: Pirinç',
    materialKind: 'wood',
    comboRole: 'bed_frame',
    partFinishes: {
      primary: { hex: '#6D4B33', roughness: 0.46, metalness: 0.03, partLabel: 'Amerikan Ceviz Gövde' },
      secondary: { hex: '#553A26', roughness: 0.48, metalness: 0.03, partLabel: 'Koyu Ceviz Baza' },
      accent: { hex: '#D4AF5A', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Kulp' },
      ceramic: { hex: '#F3EFE7', roughness: 0.92, metalness: 0.0, partLabel: 'Sıcak Ekru Nevresim' },
    },
  }),
  buildCombo({
    id: 'vizon-keten-yatak-mese',
    label: 'Vizon Keten · Meşe · Taş Nevresim',
    comboSummary: 'Başlık & Baza: Vizon Keten · Ayak: Doğal Meşe · Nevresim: Sıcak Taş Beyazı',
    materialKind: 'linen',
    comboRole: 'bed_frame',
    partFinishes: {
      primary: { hex: '#ABA092', roughness: 0.88, metalness: 0.0, partLabel: 'Vizon Keten Başlık' },
      secondary: { hex: '#BA9266', roughness: 0.5, metalness: 0.02, partLabel: 'Doğal Meşe Ayak' },
      accent: { hex: '#9E7B4F', roughness: 0.28, metalness: 0.88, partLabel: 'Saten Bronz Detay' },
      ceramic: { hex: '#F2EFEA', roughness: 0.92, metalness: 0.0, partLabel: 'Taş Beyazı Nevresim' },
    },
  }),
  buildCombo({
    id: 'antrasit-kadife-yatak-ceviz',
    label: 'Antrasit Kadife · Ceviz · Beyaz Nevresim',
    comboSummary: 'Başlık & Baza: Antrasit Kadife · Ayak: Ceviz · Yatak & Nevresim: Otel Beyazı',
    materialKind: 'fabric',
    comboRole: 'bed_frame',
    partFinishes: {
      primary: { hex: '#3C414A', roughness: 0.84, metalness: 0.01, partLabel: 'Antrasit Kadife Başlık' },
      secondary: { hex: '#735036', roughness: 0.48, metalness: 0.03, partLabel: 'Ceviz Ayak/Baza' },
      accent: { hex: '#C6A056', roughness: 0.24, metalness: 0.92, partLabel: 'Pirinç Detay' },
      ceramic: { hex: '#F5F6F8', roughness: 0.92, metalness: 0.0, partLabel: 'Otel Beyazı Nevresim' },
    },
  }),
  buildCombo({
    id: 'mat-beyaz-genc-mese',
    label: 'Mat Beyaz Lake · Meşe · Siyah',
    comboSummary: 'Karyola/Çekmece: Mat Beyaz Lake · Detay/Ayak: Doğal Meşe · Kulp: Mat Siyah',
    materialKind: 'wood',
    comboRole: 'bed_frame',
    partFinishes: {
      primary: { hex: '#F0EFEA', roughness: 0.34, metalness: 0.02, partLabel: 'Mat Beyaz Lake Gövde' },
      secondary: { hex: '#BF976A', roughness: 0.5, metalness: 0.02, partLabel: 'Doğal Meşe Ayak' },
      accent: { hex: '#262A31', roughness: 0.4, metalness: 0.72, partLabel: 'Mat Siyah Kulp' },
      ceramic: { hex: '#E8E4DC', roughness: 0.92, metalness: 0.0, partLabel: 'Sıcak Keten Örtü' },
    },
  }),
];

// =============================================================================
// PHASE 2 — 17. MUTFAK DOLABI & ADA (Lineadecor / Intema / Kelebek Kitchen Systems)
// Cabinet fronts + Marble/Quartz/Wood countertop + Metal pulls & faucet
// =============================================================================
const KITCHEN_CABINET_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'kasmir-mutfak-calacatta-siyah',
    label: 'Kaşmir Lake · Calacatta · Siyah',
    comboSummary: 'Kapak/Dolap: Mat Kaşmir Lake · Tezgah: Calacatta Kuvars · Kulp/Batarya: Mat Siyah',
    materialKind: 'wood',
    comboRole: 'vanity',
    partFinishes: {
      primary: { hex: '#D8CFC2', roughness: 0.38, metalness: 0.02, partLabel: 'Mat Kaşmir Mutfak Kapağı' },
      secondary: { hex: '#F3F1EC', roughness: 0.16, metalness: 0.02, partLabel: 'Calacatta Kuvars Tezgah' },
      accent: { hex: '#22252B', roughness: 0.36, metalness: 0.8, partLabel: 'Mat Siyah Kulp & Evye' },
      ceramic: { hex: '#F6F7F9', roughness: 0.14, metalness: 0.02, partLabel: 'Beyaz Tezgah / Evye' },
    },
  }),
  buildCombo({
    id: 'dogal-mese-mutfak-kuvars-siyah',
    label: 'Doğal Meşe · Beyaz Kuvars · Siyah',
    comboSummary: 'Dolap: Doğal Ahşap Meşe · Tezgah: Beyaz Kuvars · Kulp & Armatür: Mat Siyah',
    materialKind: 'wood',
    comboRole: 'vanity',
    partFinishes: {
      primary: { hex: '#BE966A', roughness: 0.5, metalness: 0.02, partLabel: 'Doğal Meşe Kapak' },
      secondary: { hex: '#F5F5F2', roughness: 0.16, metalness: 0.02, partLabel: 'Beyaz Kuvars Tezgah' },
      accent: { hex: '#202329', roughness: 0.38, metalness: 0.78, partLabel: 'Mat Siyah Kulp' },
      ceramic: { hex: '#F7F8FA', roughness: 0.12, metalness: 0.02, partLabel: 'Beyaz Kuvars & Evye' },
    },
  }),
  buildCombo({
    id: 'antrasit-mutfak-mese-pirinc',
    label: 'Mat Antrasit · Meşe Tezgah · Pirinç',
    comboSummary: 'Dolap: Mat Antrasit Lake · Tezgah/Ada: Doğal Meşe · Kulp & Batarya: Fırçalı Pirinç',
    materialKind: 'wood',
    comboRole: 'vanity',
    partFinishes: {
      primary: { hex: '#363B44', roughness: 0.42, metalness: 0.05, partLabel: 'Mat Antrasit Lake' },
      secondary: { hex: '#B99264', roughness: 0.48, metalness: 0.02, partLabel: 'Masif Meşe Tezgah' },
      accent: { hex: '#CFA859', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Kulp' },
      ceramic: { hex: '#F2EFEA', roughness: 0.18, metalness: 0.02, partLabel: 'Açık Mermer Tezgah' },
    },
  }),
  buildCombo({
    id: 'adacayi-mutfak-traverten-gold',
    label: 'Adaçayı Lake · Traverten · Gold',
    comboSummary: 'Dolap: Mat Adaçayı Lake · Tezgah: Honlu Traverten · Kulp & Batarya: Fırçalı Gold',
    materialKind: 'wood',
    comboRole: 'vanity',
    partFinishes: {
      primary: { hex: '#768B79', roughness: 0.42, metalness: 0.02, partLabel: 'Mat Adaçayı Lake' },
      secondary: { hex: '#E6DCCC', roughness: 0.34, metalness: 0.02, partLabel: 'Traverten Tezgah' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Gold Kulp' },
      ceramic: { hex: '#F5F2EA', roughness: 0.16, metalness: 0.02, partLabel: 'Açık Taş Tezgah' },
    },
  }),
  buildCombo({
    id: 'beyaz-lake-mutfak-ceviz-krom',
    label: 'Beyaz Lake · Ceviz Tezgah · Krom',
    comboSummary: 'Dolap: Sıcak Beyaz Lake · Tezgah: Amerikan Ceviz · Kulp & Evye: Saten İnox/Krom',
    materialKind: 'wood',
    comboRole: 'vanity',
    partFinishes: {
      primary: { hex: '#F1F1EE', roughness: 0.3, metalness: 0.02, partLabel: 'Sıcak Beyaz Lake' },
      secondary: { hex: '#744F35', roughness: 0.46, metalness: 0.03, partLabel: 'Amerikan Ceviz Tezgah' },
      accent: { hex: '#D8DDE4', roughness: 0.14, metalness: 0.94, partLabel: 'Saten İnox & Krom' },
      ceramic: { hex: '#F6F7F9', roughness: 0.12, metalness: 0.02, partLabel: 'Beyaz Seramik' },
    },
  }),
  buildCombo({
    id: 'ceviz-mutfak-fume-mermer-bronz',
    label: 'Amerikan Ceviz · Füme Mermer · Bronz',
    comboSummary: 'Dolap: Amerikan Ceviz · Tezgah: Koyu Füme Mermer · Kulp/Armatür: Saten Bronz',
    materialKind: 'wood',
    comboRole: 'vanity',
    partFinishes: {
      primary: { hex: '#6D4B33', roughness: 0.46, metalness: 0.03, partLabel: 'Amerikan Ceviz Kapak' },
      secondary: { hex: '#3E4249', roughness: 0.2, metalness: 0.04, partLabel: 'Füme Mermer Tezgah' },
      accent: { hex: '#B58E52', roughness: 0.26, metalness: 0.9, partLabel: 'Saten Bronz Kulp' },
      ceramic: { hex: '#ECE9E2', roughness: 0.18, metalness: 0.02, partLabel: 'Açık Taş Evye' },
    },
  }),
];

// =============================================================================
// PHASE 2 — 18. İÇ KAPI, SÜRGÜ KAPI, PENCERE & MERDİVEN (Architectural Doors/Windows/Stairs)
// Real Dortek / Variodor / Rehau / Villa Stairs: Door leaf/steps + contrast hardware/railing!
// =============================================================================
const ARCH_DOOR_WINDOW_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'beyaz-lake-kapi-siyah-kulp',
    label: 'Mat Beyaz Lake · Mat Siyah Kulp',
    comboSummary: 'Kanat/Kasa: Sıcak Beyaz Lake · Kulp, Menteşe & Ray: Mat Siyah Metal',
    materialKind: 'wood',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#F2F1ED', roughness: 0.32, metalness: 0.02, partLabel: 'Mat Beyaz Lake Kanat' },
      secondary: { hex: '#E4E2DC', roughness: 0.36, metalness: 0.02, partLabel: 'Pervaz & Kasa' },
      accent: { hex: '#1F2228', roughness: 0.38, metalness: 0.8, partLabel: 'Mat Siyah Kulp & Menteşe' },
      glass: { hex: '#E8F0F4', opacity: 0.26, roughness: 0.06 },
    },
  }),
  buildCombo({
    id: 'dogal-mese-kapi-siyah-metal',
    label: 'Doğal Meşe · Mat Siyah Metal',
    comboSummary: 'Kanat/Basamak: Doğal Masif Meşe · Kasa/Korkuluk & Kulp: Mat Siyah Çelik',
    materialKind: 'wood',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#BE9568', roughness: 0.5, metalness: 0.02, partLabel: 'Doğal Meşe Ahşap' },
      secondary: { hex: '#262930', roughness: 0.42, metalness: 0.72, partLabel: 'Mat Siyah Çelik İskelet' },
      accent: { hex: '#1E2127', roughness: 0.36, metalness: 0.82, partLabel: 'Mat Siyah Kulp & Menteşe' },
      glass: { hex: '#E4EDF2', opacity: 0.26, roughness: 0.06 },
    },
  }),
  buildCombo({
    id: 'amerikan-ceviz-kapi-pirinc',
    label: 'Amerikan Ceviz · Fırçalı Pirinç',
    comboSummary: 'Kanat/Basamak: Amerikan Ceviz · Kasa: Koyu Ceviz · Kulp/Detay: Fırçalı Pirinç',
    materialKind: 'wood',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#6F4C33', roughness: 0.46, metalness: 0.03, partLabel: 'Amerikan Ceviz Kaplama' },
      secondary: { hex: '#543825', roughness: 0.48, metalness: 0.03, partLabel: 'Ceviz Kasa & Pervaz' },
      accent: { hex: '#D4AF5A', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Kulp' },
      glass: { hex: '#9D866B', opacity: 0.32, roughness: 0.06 },
    },
  }),
  buildCombo({
    id: 'antrasit-ral7016-saten-krom',
    label: 'Antrasit RAL 7016 · Saten Krom',
    comboSummary: 'Doğrama/Kanat: Antrasit RAL 7016 · Kulp & Menteşe: Saten Krom/İnox',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#383E46', roughness: 0.38, metalness: 0.52, partLabel: 'Antrasit RAL 7016' },
      secondary: { hex: '#2B3038', roughness: 0.42, metalness: 0.48, partLabel: 'Koyu Kasa Profili' },
      accent: { hex: '#D4DAE2', roughness: 0.2, metalness: 0.94, partLabel: 'Saten Krom Kulp' },
      glass: { hex: '#525C68', opacity: 0.32, roughness: 0.06 },
    },
  }),
  buildCombo({
    id: 'kasmir-lake-kapi-bronz',
    label: 'Kaşmir Lake · Saten Bronz',
    comboSummary: 'Kanat/Pervaz: Mat Kaşmir Lake · Kulp & Menteşe: Saten Bronz Metal',
    materialKind: 'wood',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#D6CCBF', roughness: 0.38, metalness: 0.02, partLabel: 'Mat Kaşmir Lake' },
      secondary: { hex: '#C5B9AA', roughness: 0.42, metalness: 0.02, partLabel: 'Kaşmir Pervaz' },
      accent: { hex: '#A5804D', roughness: 0.26, metalness: 0.88, partLabel: 'Saten Bronz Kulp' },
      glass: { hex: '#EAE5DB', opacity: 0.34, roughness: 0.14 },
    },
  }),
  buildCombo({
    id: 'mat-siyah-loft-fume-cam',
    label: 'Mat Siyah Loft · Füme Cam · Pirinç',
    comboSummary: 'Çerçeve/Korkuluk: Mat Siyah Çelik · Cam: Füme Temperli · Kulp: Fırçalı Pirinç',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#202329', roughness: 0.38, metalness: 0.78, partLabel: 'Mat Siyah Çelik Profil' },
      secondary: { hex: '#735036', roughness: 0.48, metalness: 0.03, partLabel: 'Ceviz Basamak/Detay' },
      accent: { hex: '#CFA859', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Kulp' },
      glass: { hex: '#49515C', opacity: 0.38, roughness: 0.06 },
    },
  }),
];

// =============================================================================
// PHASE 2 — 19. PERDE & JALUZİ (Curtains & Blinds)
// Soft linen/velvet drapery + contrast curtain rod/rail/slats
// =============================================================================
const CURTAIN_BLIND_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'ekru-keten-perde-siyah-ray',
    label: 'Ekru Keten · Mat Siyah Korniş',
    comboSummary: 'Kumaş/Lamela: Doğal Ekru Keten · Korniş/Ray: Mat Siyah Metal',
    materialKind: 'linen',
    comboRole: 'seating',
    partFinishes: {
      primary: { hex: '#EFE9DE', roughness: 0.92, metalness: 0.0, partLabel: 'Ekru Keten Perde' },
      secondary: { hex: '#DDD4C6', roughness: 0.9, metalness: 0.0, partLabel: 'Tül / Astar Tonu' },
      accent: { hex: '#22252C', roughness: 0.38, metalness: 0.78, partLabel: 'Mat Siyah Korniş' },
    },
  }),
  buildCombo({
    id: 'vizon-keten-perde-pirinc-ray',
    label: 'Vizon Dokuma · Fırçalı Pirinç',
    comboSummary: 'Kumaş: Vizon Keten Fon · Astar: Kırık Beyaz · Korniş/Halka: Fırçalı Pirinç',
    materialKind: 'linen',
    comboRole: 'seating',
    partFinishes: {
      primary: { hex: '#B4A798', roughness: 0.9, metalness: 0.0, partLabel: 'Vizon Keten Fon' },
      secondary: { hex: '#EAE4DA', roughness: 0.88, metalness: 0.0, partLabel: 'Sıcak Ekru Tül' },
      accent: { hex: '#CFA859', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Ray' },
    },
  }),
  buildCombo({
    id: 'tas-gri-blackout-krom',
    label: 'Taş Gri Blackout · Saten Krom',
    comboSummary: 'Kumaş: Taş Gri Blackout · Mekanizma/Korniş: Saten Krom Metal',
    materialKind: 'fabric',
    comboRole: 'seating',
    partFinishes: {
      primary: { hex: '#959BA3', roughness: 0.88, metalness: 0.0, partLabel: 'Taş Gri Blackout' },
      secondary: { hex: '#D8DCE0', roughness: 0.86, metalness: 0.0, partLabel: 'Açık Gri Astar' },
      accent: { hex: '#CFD5DC', roughness: 0.2, metalness: 0.92, partLabel: 'Saten Krom Ray' },
    },
  }),
  buildCombo({
    id: 'adacayi-keten-perde-mese',
    label: 'Adaçayı Keten · Doğal Meşe',
    comboSummary: 'Kumaş/Lamela: Adaçayı Keten · Korniş/Ahşap Detay: Doğal Meşe',
    materialKind: 'linen',
    comboRole: 'seating',
    partFinishes: {
      primary: { hex: '#7A8E7D', roughness: 0.9, metalness: 0.0, partLabel: 'Adaçayı Keten' },
      secondary: { hex: '#BD966A', roughness: 0.5, metalness: 0.02, partLabel: 'Doğal Meşe Korniş' },
      accent: { hex: '#A5804D', roughness: 0.28, metalness: 0.86, partLabel: 'Saten Bronz Halka' },
    },
  }),
  buildCombo({
    id: 'antrasit-kadife-perde-bronz',
    label: 'Antrasit Kadife · Saten Bronz',
    comboSummary: 'Kumaş: Antrasit Blackout Kadife · Korniş & Mekanizma: Saten Bronz',
    materialKind: 'fabric',
    comboRole: 'seating',
    partFinishes: {
      primary: { hex: '#3D424B', roughness: 0.84, metalness: 0.01, partLabel: 'Antrasit Kadife Fon' },
      secondary: { hex: '#5A606B', roughness: 0.86, metalness: 0.01, partLabel: 'Koyu Astar' },
      accent: { hex: '#B58E52', roughness: 0.26, metalness: 0.9, partLabel: 'Saten Bronz Korniş' },
    },
  }),
];

// =============================================================================
// PHASE 2 — 20. AYDINLATMA — AVİZE, LAMBADER & MASA LAMBASI (Lighting Fixtures)
// Keeps glowing opal globes & warm linen shades bright while metal stems/bases change!
// =============================================================================
const LIGHTING_FIXTURE_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'mat-siyah-opal-pirinc',
    label: 'Mat Siyah · Opal Beyaz · Pirinç',
    comboSummary: 'Gövde/Ayak: Mat Siyah Metal · Başlık/Cam: Opal Beyaz 3000K · Duy/Detay: Fırçalı Pirinç',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#1F2228', roughness: 0.38, metalness: 0.78, partLabel: 'Mat Siyah Metal Gövde' },
      secondary: { hex: '#F6F1E6', roughness: 0.28, metalness: 0.0, partLabel: 'Opal Beyaz Difüzör/Başlık' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Pirinç Detay' },
      ceramic: { hex: '#FAF4E8', roughness: 0.24, metalness: 0.0, partLabel: 'Sıcak 3000K Başlık' },
    },
  }),
  buildCombo({
    id: 'fircali-pirinc-mermer-opal',
    label: 'Fırçalı Pirinç · Beyaz Mermer · Opal',
    comboSummary: 'Gövde: Fırçalı Pirinç Gold · Kaide/Başlık: Beyaz Mermer & Opal Cam',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#D4AF5A', roughness: 0.24, metalness: 0.94, partLabel: 'Fırçalı Pirinç Gövde' },
      secondary: { hex: '#F3F0E8', roughness: 0.22, metalness: 0.02, partLabel: 'Beyaz Mermer & Opal' },
      accent: { hex: '#E4C676', roughness: 0.18, metalness: 0.96, partLabel: 'Parlak Gold Detay' },
      ceramic: { hex: '#FBF6EC', roughness: 0.24, metalness: 0.0, partLabel: 'Opal Cam Difüzör' },
    },
  }),
  buildCombo({
    id: 'saten-bronz-krem-keten',
    label: 'Saten Bronz · Krem Keten Abajur',
    comboSummary: 'Gövde: Eskitme Saten Bronz · Başlık: Sıcak Krem Keten · Detay: Pirinç',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#8E6B3E', roughness: 0.3, metalness: 0.88, partLabel: 'Saten Bronz Gövde' },
      secondary: { hex: '#EFE6D5', roughness: 0.86, metalness: 0.0, partLabel: 'Krem Keten Abajur' },
      accent: { hex: '#CFA859', roughness: 0.24, metalness: 0.92, partLabel: 'Pirinç Bağlantı' },
      ceramic: { hex: '#F5EDE0', roughness: 0.84, metalness: 0.0, partLabel: 'Krem Keten Şapka' },
    },
  }),
  buildCombo({
    id: 'fume-gunmetal-amber-cam',
    label: 'Füme Gunmetal · Amber Cam · Gold',
    comboSummary: 'Gövde: Füme Gunmetal PVD · Cam/Başlık: Sıcak Amber Füme · Detay: Gold',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#484F5B', roughness: 0.26, metalness: 0.9, partLabel: 'Füme Gunmetal Gövde' },
      secondary: { hex: '#E6C99C', roughness: 0.22, metalness: 0.02, partLabel: 'Sıcak Amber Cam' },
      accent: { hex: '#CFA859', roughness: 0.24, metalness: 0.92, partLabel: 'Gold Duy & Halka' },
      ceramic: { hex: '#EBD3AB', roughness: 0.22, metalness: 0.0, partLabel: 'Amber Difüzör' },
      glass: { hex: '#D8A662', opacity: 0.42, roughness: 0.08 },
    },
  }),
  buildCombo({
    id: 'mat-beyaz-mese-pirinc-lamba',
    label: 'Mat Beyaz · Doğal Meşe · Pirinç',
    comboSummary: 'Gövde: Mat Beyaz Metal · Detay: Doğal Meşe Ahşap · Duy: Fırçalı Pirinç',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#F0EFEA', roughness: 0.34, metalness: 0.14, partLabel: 'Mat Beyaz Metal' },
      secondary: { hex: '#BC956A', roughness: 0.5, metalness: 0.02, partLabel: 'Doğal Meşe Detay' },
      accent: { hex: '#D4AF5A', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Duy' },
      ceramic: { hex: '#FAF6EE', roughness: 0.28, metalness: 0.0, partLabel: 'Sıcak Opal Beyaz' },
    },
  }),
  buildCombo({
    id: 'parlak-krom-opal-cam',
    label: 'Parlak Krom · Kristal Opal Cam',
    comboSummary: 'Gövde: Parlak Krom PVD · Difüzör/Şapka: Kristal Opal Beyaz · Detay: Saten Nikel',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#E4E8EE', roughness: 0.1, metalness: 0.96, partLabel: 'Parlak Krom Gövde' },
      secondary: { hex: '#F7F8FA', roughness: 0.2, metalness: 0.0, partLabel: 'Kristal Opal Cam' },
      accent: { hex: '#BCC3CC', roughness: 0.24, metalness: 0.92, partLabel: 'Saten Nikel Detay' },
      ceramic: { hex: '#FAF9F5', roughness: 0.2, metalness: 0.0, partLabel: 'Opal Difüzör' },
    },
  }),
];

// =============================================================================
// PHASE 2 — 21. DEKOR & BİTKİ — SAKSI BİTKİLERİ (Botanical Plants — Foliage Protected!)
// Green leaves & botanical stems ALWAYS remain natural green; only planter pot & stand change!
// =============================================================================
const BOTANICAL_PLANTER_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'mat-beyaz-saksi-mese',
    label: 'Mat Beyaz Saksı · Doğal Meşe',
    comboSummary: 'Saksı: Mat Beyaz Seramik · Ayak/Stand: Doğal Meşe · Yapraklar: Doğal Yeşil Korumalı',
    materialKind: 'ceramic',
    comboRole: 'botanical_plant',
    partFinishes: {
      primary: { hex: '#F1EFE9', roughness: 0.44, metalness: 0.02, partLabel: 'Mat Beyaz Seramik Saksı' },
      secondary: { hex: '#BE966A', roughness: 0.5, metalness: 0.02, partLabel: 'Doğal Meşe Stand' },
      accent: { hex: '#CFA859', roughness: 0.24, metalness: 0.9, partLabel: 'Pirinç Detay' },
    },
  }),
  buildCombo({
    id: 'terracotta-saksi-siyah-stand',
    label: 'Anadolu Terracotta · Siyah Stand',
    comboSummary: 'Saksı: Doğal Terracotta Kil · Stand: Mat Siyah Metal · Yapraklar: Doğal Yeşil Korumalı',
    materialKind: 'ceramic',
    comboRole: 'botanical_plant',
    partFinishes: {
      primary: { hex: '#BC6C4D', roughness: 0.68, metalness: 0.01, partLabel: 'Terracotta Kil Saksı' },
      secondary: { hex: '#23262C', roughness: 0.4, metalness: 0.76, partLabel: 'Mat Siyah Metal Stand' },
      accent: { hex: '#9E7948', roughness: 0.3, metalness: 0.86, partLabel: 'Saten Bronz Detay' },
    },
  }),
  buildCombo({
    id: 'traverten-saksi-pirinc',
    label: 'Traverten Saksı · Fırçalı Pirinç',
    comboSummary: 'Saksı: Honlu Traverten Taş · Stand/Halka: Fırçalı Pirinç · Yapraklar Korumalı',
    materialKind: 'stone',
    comboRole: 'botanical_plant',
    partFinishes: {
      primary: { hex: '#DDD1BE', roughness: 0.54, metalness: 0.02, partLabel: 'Traverten Taş Saksı' },
      secondary: { hex: '#C2B39B', roughness: 0.56, metalness: 0.02, partLabel: 'Doğal Taş Altlık' },
      accent: { hex: '#D4AF5A', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Stand' },
    },
  }),
  buildCombo({
    id: 'antrasit-beton-saksi-ceviz',
    label: 'Antrasit Beton · Ceviz Stand',
    comboSummary: 'Saksı: Mat Antrasit Brüt Beton · Stand: Amerikan Ceviz · Yapraklar Korumalı',
    materialKind: 'stone',
    comboRole: 'botanical_plant',
    partFinishes: {
      primary: { hex: '#434850', roughness: 0.72, metalness: 0.04, partLabel: 'Antrasit Beton Saksı' },
      secondary: { hex: '#6F4C33', roughness: 0.48, metalness: 0.03, partLabel: 'Amerikan Ceviz Stand' },
      accent: { hex: '#C6A056', roughness: 0.26, metalness: 0.9, partLabel: 'Pirinç Detay' },
    },
  }),
  buildCombo({
    id: 'kasmir-seramik-saksi-bronz',
    label: 'Kaşmir Seramik · Saten Bronz',
    comboSummary: 'Saksı: Mat Kaşmir Seramik · Stand: Saten Bronz · Yapraklar: Doğal Yeşil Korumalı',
    materialKind: 'ceramic',
    comboRole: 'botanical_plant',
    partFinishes: {
      primary: { hex: '#D6CCBE', roughness: 0.46, metalness: 0.02, partLabel: 'Kaşmir Seramik Saksı' },
      secondary: { hex: '#A5804D', roughness: 0.28, metalness: 0.86, partLabel: 'Saten Bronz Stand' },
      accent: { hex: '#282C33', roughness: 0.4, metalness: 0.72, partLabel: 'Siyah Ayak Ucu' },
    },
  }),
];

// =============================================================================
// PHASE 2 — 22. DEKOR & OBJE (Vases, Frames, Clocks, Baskets, Candlesticks)
// =============================================================================
const DECOR_OBJECT_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'traverten-dekor-bronz',
    label: 'Traverten Taş · Saten Bronz',
    comboSummary: 'Gövde: Doğal Traverten Taş · Detay/Çerçeve: Saten Bronz Metal',
    materialKind: 'stone',
    comboRole: 'bath_accessory',
    partFinishes: {
      primary: { hex: '#DFD4C2', roughness: 0.52, metalness: 0.02, partLabel: 'Traverten Taş' },
      secondary: { hex: '#C4B59E', roughness: 0.56, metalness: 0.02, partLabel: 'Sıcak Taş Tonu' },
      accent: { hex: '#A5804D', roughness: 0.28, metalness: 0.88, partLabel: 'Saten Bronz Detay' },
    },
  }),
  buildCombo({
    id: 'mat-beyaz-seramik-pirinc-dekor',
    label: 'Mat Beyaz Seramik · Pirinç',
    comboSummary: 'Gövde: Mat Beyaz Seramik · Detay/Kaide: Fırçalı Pirinç',
    materialKind: 'ceramic',
    comboRole: 'bath_accessory',
    partFinishes: {
      primary: { hex: '#F1EFE9', roughness: 0.42, metalness: 0.02, partLabel: 'Mat Beyaz Seramik' },
      secondary: { hex: '#DDD6CA', roughness: 0.48, metalness: 0.02, partLabel: 'Keten / Taş Kontrast' },
      accent: { hex: '#D4AF5A', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç' },
    },
  }),
  buildCombo({
    id: 'amerikan-ceviz-siyah-dekor',
    label: 'Amerikan Ceviz · Mat Siyah',
    comboSummary: 'Gövde: Amerikan Ceviz Ahşap · Detay/Metal: Mat Siyah & Pirinç',
    materialKind: 'wood',
    comboRole: 'bath_accessory',
    partFinishes: {
      primary: { hex: '#6F4C33', roughness: 0.46, metalness: 0.03, partLabel: 'Amerikan Ceviz' },
      secondary: { hex: '#E8E2D6', roughness: 0.72, metalness: 0.01, partLabel: 'Ekru Kontrast' },
      accent: { hex: '#22252B', roughness: 0.38, metalness: 0.78, partLabel: 'Mat Siyah Metal' },
    },
  }),
  buildCombo({
    id: 'terracotta-kil-keten-dekor',
    label: 'Terracotta Kil · Doğal Keten',
    comboSummary: 'Gövde: El Yapımı Terracotta · Kontrast: Doğal Keten/Hasır · Detay: Bronz',
    materialKind: 'ceramic',
    comboRole: 'bath_accessory',
    partFinishes: {
      primary: { hex: '#BA6A4C', roughness: 0.68, metalness: 0.01, partLabel: 'Terracotta Kil' },
      secondary: { hex: '#DFD2BD', roughness: 0.84, metalness: 0.0, partLabel: 'Doğal Keten / Hasır' },
      accent: { hex: '#9E7948', roughness: 0.3, metalness: 0.86, partLabel: 'Eskitme Bronz' },
    },
  }),
  buildCombo({
    id: 'mat-antrasit-tas-gold-dekor',
    label: 'Mat Antrasit Taş · Gold',
    comboSummary: 'Gövde: Mat Antrasit Seramik/Taş · Detay: Fırçalı Gold Metal',
    materialKind: 'stone',
    comboRole: 'bath_accessory',
    partFinishes: {
      primary: { hex: '#383D46', roughness: 0.5, metalness: 0.06, partLabel: 'Mat Antrasit Taş' },
      secondary: { hex: '#585F6B', roughness: 0.54, metalness: 0.06, partLabel: 'Füme Kontrast' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Gold' },
    },
  }),
];

// =============================================================================
// PHASE 2 — 23. DIŞ CEPHE — BİOKLİMATİK PERGOLA & BAHÇE MOBİLYASI / PEYZAJ
// Preserves pergola IDs (antrasit-ral7016, krem-bej-aluminyum, ahsap-desen-antrasit) + warm LED!
// =============================================================================
const BIOCLIMATIC_PERGOLA_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'antrasit-ral7016',
    label: 'Antrasit RAL 7016 · Füme Lamela · 3000K LED',
    comboSummary: 'Taşıyıcı: Antrasit RAL 7016 Alüminyum · Lamela: Koyu Füme · LED: Sıcak 3000K',
    materialKind: 'metal',
    comboRole: 'exterior_outdoor',
    partFinishes: {
      primary: { hex: '#2F343D', roughness: 0.38, metalness: 0.72, partLabel: 'Antrasit RAL 7016 Profil' },
      secondary: { hex: '#4B525E', roughness: 0.42, metalness: 0.65, partLabel: 'Motorlu Füme Lamela' },
      accent: { hex: '#FFE4B5', roughness: 0.2, metalness: 0.0, partLabel: 'Entegre 3000K LED' },
    },
  }),
  buildCombo({
    id: 'krem-bej-aluminyum',
    label: 'Kaşmir Bej · Sıcak Beyaz Lamela · LED',
    comboSummary: 'Taşıyıcı: Kaşmir Bej Alüminyum · Lamela: Mat Beyaz · LED: Gün Işığı 3000K',
    materialKind: 'metal',
    comboRole: 'exterior_outdoor',
    partFinishes: {
      primary: { hex: '#D5CBBF', roughness: 0.4, metalness: 0.42, partLabel: 'Kaşmir Alüminyum Profil' },
      secondary: { hex: '#F0EEE9', roughness: 0.38, metalness: 0.32, partLabel: 'Mat Beyaz Lamela' },
      accent: { hex: '#FFF0D4', roughness: 0.2, metalness: 0.0, partLabel: 'Entegre 3000K LED' },
    },
  }),
  buildCombo({
    id: 'ahsap-desen-antrasit',
    label: 'Antrasit Gövde · Teak Lamela · LED',
    comboSummary: 'Taşıyıcı: Antrasit RAL 7016 · Lamela: Doğal Teak Ahşap Desen · LED: Sıcak 3000K',
    materialKind: 'metal',
    comboRole: 'exterior_outdoor',
    partFinishes: {
      primary: { hex: '#2C313A', roughness: 0.38, metalness: 0.74, partLabel: 'Antrasit Taşıyıcı' },
      secondary: { hex: '#A47548', roughness: 0.54, metalness: 0.14, partLabel: 'Teak Desen Lamela' },
      accent: { hex: '#FFE0A8', roughness: 0.2, metalness: 0.0, partLabel: 'Sıcak 3000K LED' },
    },
  }),
  buildCombo({
    id: 'siyah-ceviz-pergola-led',
    label: 'Mat Siyah · Ceviz Lamela · Amber LED',
    comboSummary: 'Taşıyıcı: Mat Siyah RAL 9005 · Lamela: Koyu Ceviz · LED: Sıcak Amber 2700K',
    materialKind: 'metal',
    comboRole: 'exterior_outdoor',
    partFinishes: {
      primary: { hex: '#1E2127', roughness: 0.4, metalness: 0.76, partLabel: 'Mat Siyah Alüminyum' },
      secondary: { hex: '#734E33', roughness: 0.52, metalness: 0.14, partLabel: 'Ceviz Ahşap Lamela' },
      accent: { hex: '#FFD699', roughness: 0.2, metalness: 0.0, partLabel: 'Amber 2700K LED' },
    },
  }),
  buildCombo({
    id: 'bronz-traverten-pergola-led',
    label: 'Saten Bronz · Kırık Beyaz Lamela · LED',
    comboSummary: 'Taşıyıcı: Mimari Bronz Alüminyum · Lamela: Kırık Beyaz · LED: Sıcak 3000K',
    materialKind: 'metal',
    comboRole: 'exterior_outdoor',
    partFinishes: {
      primary: { hex: '#5D4B3B', roughness: 0.36, metalness: 0.72, partLabel: 'Mimari Bronz Profil' },
      secondary: { hex: '#ECE7DC', roughness: 0.4, metalness: 0.28, partLabel: 'Kırık Beyaz Lamela' },
      accent: { hex: '#FFE6BA', roughness: 0.2, metalness: 0.0, partLabel: 'Entegre 3000K LED' },
    },
  }),
];

const OUTDOOR_GARDEN_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'teak-ekru-antrasit-bahce',
    label: 'Teak Ahşap · Ekru Minder · Antrasit',
    comboSummary: 'İskelet/Ahşap: Doğal Teak · Minder: Su İtici Ekru Sunbrella · Metal: Antrasit',
    materialKind: 'wood',
    comboRole: 'exterior_outdoor',
    partFinishes: {
      primary: { hex: '#A97A4D', roughness: 0.56, metalness: 0.02, partLabel: 'Doğal Teak Ahşap' },
      secondary: { hex: '#ECE5D8', roughness: 0.9, metalness: 0.0, partLabel: 'Ekru Dış Mekan Kumaşı' },
      accent: { hex: '#2F343D', roughness: 0.42, metalness: 0.72, partLabel: 'Antrasit Alüminyum' },
    },
  }),
  buildCombo({
    id: 'antrasit-aluminyum-tas-gri-bahce',
    label: 'Antrasit Alüminyum · Taş Gri · Teak',
    comboSummary: 'İskelet: Antrasit Alüminyum · Minder/Üst: Taş Gri Sunbrella · Detay: Teak Ahşap',
    materialKind: 'metal',
    comboRole: 'exterior_outdoor',
    partFinishes: {
      primary: { hex: '#343942', roughness: 0.4, metalness: 0.72, partLabel: 'Antrasit Alüminyum' },
      secondary: { hex: '#9EA4AC', roughness: 0.88, metalness: 0.0, partLabel: 'Taş Gri Minder' },
      accent: { hex: '#AD7E50', roughness: 0.54, metalness: 0.02, partLabel: 'Teak Kolçak Detayı' },
    },
  }),
  buildCombo({
    id: 'iroko-vizon-siyah-bahce',
    label: 'İroko Ceviz · Vizon · Mat Siyah',
    comboSummary: 'Ahşap: Yağlı İroko Ceviz · Kumaş: Vizon Dış Mekan · Metal: Mat Siyah Çelik',
    materialKind: 'wood',
    comboRole: 'exterior_outdoor',
    partFinishes: {
      primary: { hex: '#775136', roughness: 0.52, metalness: 0.03, partLabel: 'İroko Ceviz Ahşap' },
      secondary: { hex: '#B4A798', roughness: 0.88, metalness: 0.0, partLabel: 'Vizon Sunbrella' },
      accent: { hex: '#202329', roughness: 0.42, metalness: 0.74, partLabel: 'Mat Siyah Çelik' },
    },
  }),
  buildCombo({
    id: 'beyaz-aluminyum-adacayi-bahce',
    label: 'Mat Beyaz Alüminyum · Adaçayı · Meşe',
    comboSummary: 'Gövde: Mat Beyaz Alüminyum · Minder: Adaçayı Yeşil · Detay: Doğal Meşe',
    materialKind: 'metal',
    comboRole: 'exterior_outdoor',
    partFinishes: {
      primary: { hex: '#EFEFE9', roughness: 0.36, metalness: 0.3, partLabel: 'Mat Beyaz Alüminyum' },
      secondary: { hex: '#768B79', roughness: 0.88, metalness: 0.0, partLabel: 'Adaçayı Dış Kumaş' },
      accent: { hex: '#BC956A', roughness: 0.52, metalness: 0.02, partLabel: 'Doğal Ahşap Detay' },
    },
  }),
  buildCombo({
    id: 'bronz-aluminyum-sicak-kum-bahce',
    label: 'Mimari Bronz · Sıcak Kum · Taş',
    comboSummary: 'Gövde: Mimari Bronz Metal · Minder/Yüzey: Sıcak Kum · Detay: Doğal Traverten',
    materialKind: 'metal',
    comboRole: 'exterior_outdoor',
    partFinishes: {
      primary: { hex: '#5D4B3B', roughness: 0.38, metalness: 0.72, partLabel: 'Mimari Bronz Gövde' },
      secondary: { hex: '#E2D6C3', roughness: 0.86, metalness: 0.0, partLabel: 'Sıcak Kum Kumaş' },
      accent: { hex: '#D8CCB8', roughness: 0.54, metalness: 0.02, partLabel: 'Doğal Traverten' },
    },
  }),
];

const EXTERIOR_LIGHTING_LANDSCAPE_COMBOS: MaterialFinish[] = [
  buildCombo({
    id: 'antrasit-cephe-opal-3000k',
    label: 'Antrasit RAL 7016 · Opal 3000K',
    comboSummary: 'Gövde: Antrasit RAL 7016 Döküm · Cam/Difüzör: Sıcak Opal 3000K · Detay: Saten İnox',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#343942', roughness: 0.42, metalness: 0.72, partLabel: 'Antrasit Döküm Alüminyum' },
      secondary: { hex: '#FAF1DF', roughness: 0.26, metalness: 0.0, partLabel: 'Sıcak 3000K Opal Cam' },
      accent: { hex: '#C6CCD4', roughness: 0.24, metalness: 0.9, partLabel: 'Paslanmaz İnox Detay' },
      ceramic: { hex: '#FBF2E2', roughness: 0.24, metalness: 0.0, partLabel: 'Opal Difüzör' },
    },
  }),
  buildCombo({
    id: 'brut-beton-siyah-cephe',
    label: 'Brüt Beton · Mat Siyah · 3000K',
    comboSummary: 'Gövde: Doğal Brüt Beton · Çerçeve: Mat Siyah Metal · Difüzör: Gün Işığı',
    materialKind: 'stone',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#A5A7AA', roughness: 0.78, metalness: 0.03, partLabel: 'Brüt Beton Gövde' },
      secondary: { hex: '#23262C', roughness: 0.42, metalness: 0.74, partLabel: 'Mat Siyah Metal' },
      accent: { hex: '#FCE8C2', roughness: 0.22, metalness: 0.0, partLabel: '3000K LED Difüzör' },
      ceramic: { hex: '#FAF0DC', roughness: 0.24, metalness: 0.0, partLabel: 'Sıcak Opal Cam' },
    },
  }),
  buildCombo({
    id: 'saten-bronz-buzlu-cam-cephe',
    label: 'Saten Bronz · Buzlu Opal Cam',
    comboSummary: 'Gövde: Dış Mekan Saten Bronz · Cam: Kumlu Buzlu Opal · Detay: Eskitme Pirinç',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#634E3C', roughness: 0.34, metalness: 0.84, partLabel: 'Saten Bronz Gövde' },
      secondary: { hex: '#F3EEE4', roughness: 0.34, metalness: 0.0, partLabel: 'Buzlu Opal Cam' },
      accent: { hex: '#C6A056', roughness: 0.26, metalness: 0.9, partLabel: 'Eskitme Pirinç Detay' },
      ceramic: { hex: '#F6F0E4', roughness: 0.3, metalness: 0.0, partLabel: 'Opal Difüzör' },
    },
  }),
  buildCombo({
    id: 'traverten-tas-antrasit-peyzaj',
    label: 'Doğal Traverten · Antrasit Metal',
    comboSummary: 'Gövde: Doğal Traverten Taş · Çerçeve/Ayak: Antrasit Döküm · Detay: Bronz',
    materialKind: 'stone',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#D8CBB7', roughness: 0.62, metalness: 0.02, partLabel: 'Doğal Traverten Taş' },
      secondary: { hex: '#343942', roughness: 0.42, metalness: 0.72, partLabel: 'Antrasit Metal Çerçeve' },
      accent: { hex: '#B58E52', roughness: 0.28, metalness: 0.86, partLabel: 'Saten Bronz Detay' },
      ceramic: { hex: '#FAF2E2', roughness: 0.26, metalness: 0.0, partLabel: 'Sıcak Opal Cam' },
    },
  }),
  buildCombo({
    id: 'mat-siyah-pirinc-cephe-aplik',
    label: 'Mat Siyah · Fırçalı Pirinç · Opal',
    comboSummary: 'Gövde: Mat Siyah Alüminyum · Reflektör: Fırçalı Pirinç · Cam: Opal Beyaz',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#1F2228', roughness: 0.4, metalness: 0.78, partLabel: 'Mat Siyah Gövde' },
      secondary: { hex: '#CFA859', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Reflektör' },
      accent: { hex: '#D4AF5A', roughness: 0.24, metalness: 0.92, partLabel: 'Pirinç Detay' },
      ceramic: { hex: '#FAF4E8', roughness: 0.24, metalness: 0.0, partLabel: 'Opal Cam Difüzör' },
    },
  }),
];

/**
 * Resolves curated real-world retail multi-part color combinations for ALL 731 catalog assets
 * (Phase 1: Banyo + Salon + Oda Tasarımları = 374; Phase 2: Çamaşır Odası + Yatak Odası +
 * Yemek & Mutfak + Mimari & Çalışma + Aydınlatma + Dekor & Bitki + Dış Cephe = 357).
 * Returns null only for woven rugs (handled separately by 3-tone designer rug palettes).
 */
export function getRetailFinishesForAsset(
  asset: ArchitecturalAsset,
  isRug: boolean,
): MaterialFinish[] | null {
  if (isRug) {
    return null;
  }

  // Preserve researched brand-specific Turkish retail finishes (Geberit, VitrA, Viko, Schneider, Bosch, Siemens, Arçelik, Beko, Vaillant, Demirdöküm, E.C.A., Sur/Kale, Pelsan)
  if (TURKISH_GAP_ASSET_IDS.has(asset.id)) {
    return asset.finishes;
  }

  const groupId = classifyAssetGroup(asset).id;
  const lowerName = asset.name.toLocaleLowerCase('tr-TR');

  switch (groupId) {
    // ── PHASE 1: SALON ──
    case 'kose-koltuk':
    case 'uclu-ikili-koltuk':
    case 'berjer-tekli':
    case 'puf-sedir':
      return withOriginalPbr(asset, SALON_SEATING_COMBOS, 'seating');

    case 'orta-zigon-sehpa':
    case 'tv-unitesi-konsol':
    case 'kitaplik-raf':
      return withOriginalPbr(asset, SALON_TABLE_CONSOLE_COMBOS, 'table_console');

    // ── PHASE 1: BANYO ──
    case 'banyo-dolabi':
      return withOriginalPbr(asset, BANYO_VANITY_COMBOS, 'vanity');

    case 'klozet-pisuvar':
      return withOriginalPbr(asset, BANYO_SANITARY_COMBOS, 'sanitary_ceramic');

    case 'lavabo':
      return withOriginalPbr(asset, BANYO_BASIN_COMBOS, 'sanitary_ceramic');

    case 'dusakabin':
      return withOriginalPbr(asset, BANYO_SHOWER_CABIN_COMBOS, 'shower_cabin');

    case 'kuvet':
      return withOriginalPbr(asset, BANYO_BATHTUB_COMBOS, 'bathtub');

    case 'lavabo-bataryasi':
    case 'dus-seti-tepe-dus':
      return withOriginalPbr(asset, BANYO_FAUCET_SHOWER_COMBOS, 'faucet_hardware');

    case 'havlupan-havluluk':
    case 'tuvalet-kagitligi':
      return withOriginalPbr(asset, BANYO_TOWEL_HARDWARE_COMBOS, 'towel_hardware');

    case 'banyo-aynasi-aplik':
      return withOriginalPbr(asset, BANYO_MIRROR_LIGHT_COMBOS, 'mirror_light');

    case 'banyo-aksesuari':
      return withOriginalPbr(asset, BANYO_ACCESSORY_COMBOS, 'bath_accessory');

    case 'banyo-halisi':
      return withOriginalPbr(asset, BANYO_TOWEL_TEXTILE_COMBOS, 'bath_textile');

    // ── PHASE 1: ODA TASARIMLARI ──
    case 'oda-salon':
    case 'oda-yatak':
    case 'oda-mutfak':
    case 'oda-banyo':
    case 'oda-daire':
      return withOriginalPbr(asset, ROOM_SCENE_COMBOS, 'room_scene');

    // ── PHASE 2: ÇAMAŞIR ODASI ──
    case 'camasir-yan-yana-dolap':
    case 'camasir-ust-uste-dolap':
    case 'camasir-temiz-kirli-sepet':
    case 'camasir-utu-kurutma-aski':
      return withOriginalPbr(asset, LAUNDRY_CABINET_COMBOS, 'laundry_cabinet');

    case 'camasir-makine-kurutma':
      return withOriginalPbr(asset, APPLIANCE_RETAIL_COMBOS, 'appliance');

    case 'camasir-evye-deterjan':
      if (/evye|lavabo|batarya/.test(lowerName)) {
        return withOriginalPbr(asset, BANYO_BASIN_COMBOS, 'sanitary_ceramic');
      }
      return withOriginalPbr(asset, BANYO_ACCESSORY_COMBOS, 'bath_accessory');

    // ── PHASE 2: YATAK ODASI ──
    case 'cift-kisilik-yatak':
    case 'genc-cocuk-odasi':
      return withOriginalPbr(asset, BEDROOM_BED_COMBOS, 'bed_frame');

    case 'gardirop-giyinme':
    case 'komodin-sifonyer':
      return withOriginalPbr(asset, SALON_TABLE_CONSOLE_COMBOS, 'table_console');

    // ── PHASE 2: MUTFAK ANKASTRE ──
    case 'ankastre-setler':
    case 'ankastre-firin-mikrodalga':
    case 'ankastre-ocak':
    case 'ankastre-davlumbaz':
    case 'ankastre-bulasik-buzdolabi':
    case 'ankastre-kahve-sarap':
      return withOriginalPbr(asset, APPLIANCE_RETAIL_COMBOS, 'appliance');

    // ── PHASE 2: YEMEK & MUTFAK ──

    case 'mutfak-dolabi-ada':
      return withOriginalPbr(asset, KITCHEN_CABINET_COMBOS, 'vanity');

    case 'mutfak-konsol-dolap':
      if (/oca[kğ]|aspiratör|davlumbaz|fırın/.test(lowerName)) {
        return withOriginalPbr(asset, APPLIANCE_RETAIL_COMBOS, 'appliance');
      }
      return withOriginalPbr(asset, SALON_TABLE_CONSOLE_COMBOS, 'table_console');

    case 'yemek-masasi':
      return withOriginalPbr(asset, SALON_TABLE_CONSOLE_COMBOS, 'table_console');

    case 'sandalye-tabure':
      return withOriginalPbr(asset, SALON_SEATING_COMBOS, 'seating');

    // ── PHASE 2: MİMARİ & ÇALIŞMA ──
    case 'ic-kapi-surgu':
      return withOriginalPbr(asset, ARCH_DOOR_WINDOW_COMBOS, 'arch_door_window');

    case 'pencere-perde':
      if (/perde|tül|fon|jaluzi|stor/.test(lowerName)) {
        return withOriginalPbr(asset, CURTAIN_BLIND_COMBOS, 'seating');
      }
      return withOriginalPbr(asset, ARCH_DOOR_WINDOW_COMBOS, 'arch_door_window');

    case 'merdiven-yapi':
      if (/klima|vantilatör|ısıtıcı|kombi/.test(lowerName)) {
        return withOriginalPbr(asset, APPLIANCE_RETAIL_COMBOS, 'appliance');
      }
      return withOriginalPbr(asset, ARCH_DOOR_WINDOW_COMBOS, 'arch_door_window');

    // ── PHASE 2: ANTRE & GİRİŞ ──
    case 'celik-villa-kapisi':
      return withOriginalPbr(asset, ARCH_DOOR_WINDOW_COMBOS, 'arch_door_window');

    case 'ayakkabilik-puf-bank':
      if (/bank|puf|kadife|minder/.test(lowerName) && !/ayakkab/.test(lowerName)) {
        return withOriginalPbr(asset, SALON_SEATING_COMBOS, 'seating');
      }
      return withOriginalPbr(asset, SALON_TABLE_CONSOLE_COMBOS, 'table_console');

    case 'vestiyer-portmanto':
    case 'dresuar-boy-aynasi':
      return withOriginalPbr(asset, SALON_TABLE_CONSOLE_COMBOS, 'table_console');

    case 'calisma-ofis':
      if (/koltu[kğ]|sandalye|tabure|berjer/.test(lowerName)) {
        return withOriginalPbr(asset, SALON_SEATING_COMBOS, 'seating');
      }
      if (/pencere|vasistas|kapı|doğrama/.test(lowerName)) {
        return withOriginalPbr(asset, ARCH_DOOR_WINDOW_COMBOS, 'arch_door_window');
      }
      return withOriginalPbr(asset, SALON_TABLE_CONSOLE_COMBOS, 'table_console');

    case 'laptop-bilgisayar':
      return withOriginalPbr(asset, APPLIANCE_RETAIL_COMBOS, 'appliance');

    case 'kalemlik-kirtasiye':
    case 'ders-kitaplari-defter':
      return withOriginalPbr(asset, DECOR_OBJECT_COMBOS, 'bath_accessory');

    // ── PHASE 2: ÇOCUK & OYUN ──
    case 'bebek-kucuk-oyuncak':
    case 'cocuk-oyuncaklari':
      return withOriginalPbr(asset, DECOR_OBJECT_COMBOS, 'bath_accessory');

    case 'oyun-cadiri-mutfak':
    case 'cocuk-calisma-kitaplik':
      return withOriginalPbr(asset, SALON_TABLE_CONSOLE_COMBOS, 'table_console');

    // ── PHASE 2: ELEKTRİK TESİSATI ──
    case 'sigorta-dagitim-panosu':
    case 'otomat-salter-koruma':
    case 'zayif-akim-data-pano':
    case 'priz-anahtar-sayac':
      return withOriginalPbr(asset, APPLIANCE_RETAIL_COMBOS, 'appliance');

    // ── PHASE 2: AYDINLATMA ──
    case 'alcipan-spot-ray':
    case 'serit-led-lineer':
    case 'avize-sarkit':
    case 'lambader-aplik':
    case 'masa-lambasi-abajur':
      return withOriginalPbr(asset, LIGHTING_FIXTURE_COMBOS, 'lighting_fixture');

    // ── PHASE 2: DEKOR & BİTKİ ──
    case 'ic-mekan-bitkisi':
      if (/sehpa|masa/.test(lowerName) && !/bitki|saksı|sukulent|çiçek/.test(lowerName)) {
        return withOriginalPbr(asset, SALON_TABLE_CONSOLE_COMBOS, 'table_console');
      }
      return withOriginalPbr(asset, BOTANICAL_PLANTER_COMBOS, 'botanical_plant');

    case 'vazo-dekor-obje':
      if (/ayna/.test(lowerName)) {
        return withOriginalPbr(asset, BANYO_MIRROR_LIGHT_COMBOS, 'mirror_light');
      }
      if (/kırlent|yastı[kğ]/.test(lowerName)) {
        return withOriginalPbr(asset, BANYO_TOWEL_TEXTILE_COMBOS, 'bath_textile');
      }
      return withOriginalPbr(asset, DECOR_OBJECT_COMBOS, 'bath_accessory');

    // ── PHASE 2: DIŞ CEPHE ──
    case 'pergola-bahce-oturma':
      if (asset.archetype === 'bioclimatic_pergola') {
        return BIOCLIMATIC_PERGOLA_COMBOS;
      }
      return withOriginalPbr(asset, OUTDOOR_GARDEN_COMBOS, 'exterior_outdoor');

    case 'dis-mekan-peyzaj':
      if (/saksı|bitki/.test(lowerName)) {
        return withOriginalPbr(asset, BOTANICAL_PLANTER_COMBOS, 'botanical_plant');
      }
      if (/çarda[kğ]|ateş|pergola|oturma/.test(lowerName)) {
        return withOriginalPbr(asset, OUTDOOR_GARDEN_COMBOS, 'exterior_outdoor');
      }
      return withOriginalPbr(asset, EXTERIOR_LIGHTING_LANDSCAPE_COMBOS, 'lighting_fixture');

    default:
      return withOriginalPbr(asset, SALON_TABLE_CONSOLE_COMBOS, 'table_console');
  }
}

/**
 * Backward-compatible alias for Phase 1 consumers.
 */
export function getPhase1RetailFinishes(
  asset: ArchitecturalAsset,
  isRug: boolean,
): MaterialFinish[] | null {
  if (!isPhase1RetailAsset(asset)) {
    return null;
  }
  return getRetailFinishesForAsset(asset, isRug);
}
