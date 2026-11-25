import type {
  ArchitecturalAsset,
  AssetArchetype,
  AssetDimensionsCm,
  MaterialFinish,
  MultiPartFinishSpec,
  PlacementType,
  RetailComboRole,
} from './catalogTypes';
import { ARCHITECTURAL_PBR_PATTERNS } from './expandedInteriorAssets';

function makeFinish(params: {
  id: string;
  label: string;
  comboSummary: string;
  materialKind: MaterialFinish['materialKind'];
  comboRole: RetailComboRole;
  partFinishes: MultiPartFinishSpec;
}): MaterialFinish {
  return {
    id: params.id,
    label: params.label,
    comboSummary: params.comboSummary,
    primaryHex: params.partFinishes.primary.hex,
    secondaryHex: params.partFinishes.secondary.hex,
    accentHex: params.partFinishes.accent.hex,
    roughness: params.partFinishes.primary.roughness,
    metalness: params.partFinishes.primary.metalness,
    materialKind: params.materialKind,
    paletteRecolorMode: 'multi-part-retail',
    comboRole: params.comboRole,
    partFinishes: params.partFinishes,
  };
}

// ============================================================================
// AUTHENTIC TURKISH ENTRYWAY (ANTRE & GİRİŞ) MULTI-PART RETAIL FINISHES
// ============================================================================

const VESTIYER_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'kasmir-mese-antrasit',
    label: 'Kaşmir Mat Lake · Doğal Meşe Çıta · Füme Ayna',
    comboSummary: 'Dolap: Kaşmir Mat Lake · Niş: Doğal Meşe Çıta + Krem Bukle · Kulp/Askı: Mat Siyah',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#D8CFC4', roughness: 0.34, metalness: 0.04, partLabel: 'Kaşmir Lake Gövde' },
      secondary: { hex: '#B98C5A', roughness: 0.48, metalness: 0.04, partLabel: 'Doğal Meşe Çıta' },
      accent: { hex: '#23272F', roughness: 0.36, metalness: 0.78, partLabel: 'Mat Siyah Askı & Profil' },
      glass: { hex: '#524943', opacity: 0.92, roughness: 0.04 },
    },
  }),
  makeFinish({
    id: 'beyaz-safir-mese-pirinc',
    label: 'Mat Beyaz Lake · Safir Meşe Çıta · Fırçalı Pirinç',
    comboSummary: 'Dolap: İpek Mat Beyaz · Çıta: Safir Meşe · Askı/Kulp: Fırçalı Pirinç · Ayna: Şeffaf Kristal',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#F3F4F6', roughness: 0.32, metalness: 0.03, partLabel: 'Mat Beyaz Lake' },
      secondary: { hex: '#C69C6D', roughness: 0.46, metalness: 0.04, partLabel: 'Safir Meşe Çıta' },
      accent: { hex: '#C6A357', roughness: 0.24, metalness: 0.9, partLabel: 'Fırçalı Pirinç' },
      glass: { hex: '#D8E1E8', opacity: 0.94, roughness: 0.03 },
    },
  }),
  makeFinish({
    id: 'antrasit-ceviz-bronz',
    label: 'Mat Antrasit · Amerikan Ceviz Çıta · Bronz Ayna',
    comboSummary: 'Dolap: RAL 7016 Mat Antrasit · Çıta: Amerikan Ceviz · Ayna: Bronz Flotal',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#343942', roughness: 0.38, metalness: 0.08, partLabel: 'Mat Antrasit Gövde' },
      secondary: { hex: '#7A5134', roughness: 0.44, metalness: 0.04, partLabel: 'Amerikan Ceviz Çıta' },
      accent: { hex: '#B48E54', roughness: 0.26, metalness: 0.88, partLabel: 'Bronz Metal Aksesuar' },
      glass: { hex: '#635042', opacity: 0.9, roughness: 0.04 },
    },
  }),
  makeFinish({
    id: 'vizon-koyu-mese-siyah',
    label: 'Vizon Grej Lake · Koyu Füme Meşe · Siyah Profil',
    comboSummary: 'Dolap: Vizon Grej · Çıta: Koyu Füme Meşe · Profil: Eloksal Mat Siyah',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#A99E93', roughness: 0.36, metalness: 0.04, partLabel: 'Vizon Grej Lake' },
      secondary: { hex: '#5D4636', roughness: 0.48, metalness: 0.04, partLabel: 'Füme Meşe Çıta' },
      accent: { hex: '#1B1E24', roughness: 0.34, metalness: 0.82, partLabel: 'Eloksal Siyah' },
      glass: { hex: '#4B5058', opacity: 0.9, roughness: 0.04 },
    },
  }),
  makeFinish({
    id: 'adacayi-dogal-mese',
    label: 'Adaçayı Yeşili Lake · Doğal Meşe · Şampanya Metal',
    comboSummary: 'Dolap: Mat Adaçayı Yeşili · Niş: Doğal Meşe Çıta · Kulp: Şampanya Altın',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#8FA091', roughness: 0.38, metalness: 0.04, partLabel: 'Adaçayı Lake' },
      secondary: { hex: '#C29A6A', roughness: 0.46, metalness: 0.04, partLabel: 'Doğal Meşe' },
      accent: { hex: '#C9AE7E', roughness: 0.24, metalness: 0.88, partLabel: 'Şampanya Metal' },
      glass: { hex: '#D6DFE6', opacity: 0.92, roughness: 0.04 },
    },
  }),
];

const VILLA_STEEL_DOOR_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'iroko-antrasit-pivot',
    label: 'İroko Ahşap Çıta · RAL 7016 Antrasit · Siyah Bar',
    comboSummary: 'Kanat: Dış Mekan İroko Çıta + Sinter Taş · Kasa: Antrasit Çelik · Kulp: LED’li Mat Siyah',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#2D3138', roughness: 0.36, metalness: 0.48, partLabel: 'Antrasit Çelik Kasa & Taş' },
      secondary: { hex: '#8B5A34', roughness: 0.44, metalness: 0.06, partLabel: 'İroko Masif Ahşap Çıta' },
      accent: { hex: '#181A1F', roughness: 0.28, metalness: 0.88, partLabel: 'Mat Siyah Bar & Biyometrik' },
      glass: { hex: '#CBD5E1', opacity: 0.55, roughness: 0.12 },
    },
  }),
  makeFinish({
    id: 'termowood-siyah-pirinc',
    label: 'Termowood Ceviz · Mat Siyah Çelik · Fırçalı Pirinç',
    comboSummary: 'Kanat: Isıl İşlem Termowood · Kasa: Mat Siyah Zırhlı · Kulp: 180 cm Fırçalı Pirinç',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#1C1F26', roughness: 0.34, metalness: 0.54, partLabel: 'Mat Siyah Zırhlı Kasa' },
      secondary: { hex: '#6E472B', roughness: 0.42, metalness: 0.06, partLabel: 'Termowood Ceviz' },
      accent: { hex: '#C6A154', roughness: 0.22, metalness: 0.92, partLabel: 'Fırçalı Pirinç Kulp' },
      glass: { hex: '#334155', opacity: 0.5, roughness: 0.1 },
    },
  }),
  makeFinish({
    id: 'bazalt-tas-inox',
    label: 'Bazalt Sinter Taş · Koyu Meşe · 304 Paslanmaz İnox',
    comboSummary: 'Kanat: Bazalt Doğal Taş Dokulu · Kasa: Antrasit · Kulp: 304 Paslanmaz Çelik',
    materialKind: 'stone',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#3C4047', roughness: 0.54, metalness: 0.25, partLabel: 'Bazalt Sinter Taş' },
      secondary: { hex: '#5C4535', roughness: 0.46, metalness: 0.08, partLabel: 'Koyu Meşe Panel' },
      accent: { hex: '#D8DEE6', roughness: 0.18, metalness: 0.95, partLabel: '304 Paslanmaz İnox' },
      glass: { hex: '#94A3B8', opacity: 0.52, roughness: 0.14 },
    },
  }),
  makeFinish({
    id: 'beyaz-lake-mese-krom',
    label: 'RAL 9016 Beyaz Kompozit · Doğal Meşe · İnox Bar',
    comboSummary: 'Kanat: Dış Mekan Beyaz Kompozit + Doğal Meşe Şerit · Kulp: Saten İnox',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#ECEFF2', roughness: 0.28, metalness: 0.2, partLabel: 'Beyaz Kompozit Kanat' },
      secondary: { hex: '#BA8F5D', roughness: 0.44, metalness: 0.06, partLabel: 'Doğal Meşe Panel' },
      accent: { hex: '#CFD6DE', roughness: 0.18, metalness: 0.94, partLabel: 'Saten İnox Kulp' },
      glass: { hex: '#E2E8F0', opacity: 0.58, roughness: 0.12 },
    },
  }),
  makeFinish({
    id: 'bronz-kortens-antrasit',
    label: 'Korten Bronz Metal · Antrasit Kasa · Siyah Bar',
    comboSummary: 'Kanat: Mimari Korten Bronz Kaplama · Kasa: RAL 7016 Antrasit · Biyometrik Kilit',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#282C33', roughness: 0.36, metalness: 0.52, partLabel: 'Antrasit Çelik Kasa' },
      secondary: { hex: '#8B4F32', roughness: 0.48, metalness: 0.62, partLabel: 'Korten Bronz Panel' },
      accent: { hex: '#17191E', roughness: 0.26, metalness: 0.9, partLabel: 'Mat Siyah Bar Kulp' },
      glass: { hex: '#475569', opacity: 0.48, roughness: 0.1 },
    },
  }),
];

const ENTRY_CONSOLE_MIRROR_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'traverten-ceviz-pirinc',
    label: 'Honlu Traverten · Amerikan Ceviz · Fırçalı Pirinç',
    comboSummary: 'Üst Tabla: Denizli Traverten · Gövde: Ceviz Çıta · Çerçeve: Fırçalı Pirinç + 3000K LED',
    materialKind: 'stone',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#DDD2C0', roughness: 0.54, metalness: 0.04, partLabel: 'Denizli Traverten' },
      secondary: { hex: '#7A5134', roughness: 0.44, metalness: 0.05, partLabel: 'Amerikan Ceviz' },
      accent: { hex: '#C6A154', roughness: 0.22, metalness: 0.92, partLabel: 'Fırçalı Pirinç & 3000K LED' },
      glass: { hex: '#DCE4EC', opacity: 0.95, roughness: 0.03 },
    },
  }),
  makeFinish({
    id: 'calacatta-mese-siyah',
    label: 'Calacatta Mermer · Doğal Meşe · Mat Siyah Metal',
    comboSummary: 'Üst Tabla: Beyaz Mermer · Gövde: Doğal Meşe · Ayak & Ayna Çerçevesi: Mat Siyah',
    materialKind: 'stone',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#F2F1EE', roughness: 0.24, metalness: 0.04, partLabel: 'Calacatta Mermer' },
      secondary: { hex: '#BC905E', roughness: 0.46, metalness: 0.04, partLabel: 'Doğal Meşe' },
      accent: { hex: '#1F232B', roughness: 0.34, metalness: 0.84, partLabel: 'Mat Siyah Alüminyum' },
      glass: { hex: '#E1E7ED', opacity: 0.95, roughness: 0.03 },
    },
  }),
  makeFinish({
    id: 'nero-ceviz-altin',
    label: 'Nero Siyah Mermer · Koyu Ceviz · Şampanya Altın',
    comboSummary: 'Üst Tabla: Nero Marquina · Gövde: Koyu Ceviz · Metal: Şampanya Altın PVD',
    materialKind: 'stone',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#24272D', roughness: 0.22, metalness: 0.08, partLabel: 'Nero Siyah Mermer' },
      secondary: { hex: '#5D3E29', roughness: 0.44, metalness: 0.05, partLabel: 'Koyu Ceviz' },
      accent: { hex: '#D1B06B', roughness: 0.2, metalness: 0.94, partLabel: 'Şampanya Altın' },
      glass: { hex: '#63564B', opacity: 0.9, roughness: 0.03 },
    },
  }),
  makeFinish({
    id: 'kasmir-mese-bronz',
    label: 'Kaşmir Lake · Safir Meşe · Bronz Metal',
    comboSummary: 'Gövde: Kaşmir Mat Lake · Detay: Safir Meşe · Ayna Çerçeve: Fırçalı Bronz',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#D8CFC4', roughness: 0.34, metalness: 0.04, partLabel: 'Kaşmir Mat Lake' },
      secondary: { hex: '#B98C5A', roughness: 0.46, metalness: 0.04, partLabel: 'Safir Meşe' },
      accent: { hex: '#9A7952', roughness: 0.26, metalness: 0.88, partLabel: 'Fırçalı Bronz' },
      glass: { hex: '#C8CFD6', opacity: 0.94, roughness: 0.03 },
    },
  }),
  makeFinish({
    id: 'beyaz-antrasit-krom',
    label: 'Parlak Beyaz · Mat Antrasit · Krom Çerçeve',
    comboSummary: 'Gövde: Beyaz Lake · İkincil: Antrasit · Çerçeve & Ayak: Parlak Krom',
    materialKind: 'metal',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#F5F6F8', roughness: 0.24, metalness: 0.04, partLabel: 'Beyaz Lake' },
      secondary: { hex: '#373D47', roughness: 0.38, metalness: 0.12, partLabel: 'Mat Antrasit' },
      accent: { hex: '#DCE2E8', roughness: 0.14, metalness: 0.96, partLabel: 'Parlak Krom' },
      glass: { hex: '#E4EAF0', opacity: 0.96, roughness: 0.02 },
    },
  }),
];

const BENCH_SHOE_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'krem-bukle-mese',
    label: 'Krem Bukle Minder · Doğal Meşe · Mat Siyah',
    comboSummary: 'Minder/Gövde: Krem Bukle & Mat Beyaz · Ahşap: Doğal Meşe · Aksesuar: Mat Siyah',
    materialKind: 'fabric',
    comboRole: 'seating',
    partFinishes: {
      primary: { hex: '#EFECE6', roughness: 0.86, metalness: 0.02, partLabel: 'Krem Bukle / Beyaz' },
      secondary: { hex: '#BD9160', roughness: 0.46, metalness: 0.04, partLabel: 'Doğal Meşe Ahşap' },
      accent: { hex: '#23272F', roughness: 0.36, metalness: 0.8, partLabel: 'Mat Siyah Metal' },
    },
  }),
  makeFinish({
    id: 'vizon-keten-ceviz',
    label: 'Vizon Keten · Amerikan Ceviz · Fırçalı Pirinç',
    comboSummary: 'Minder/Yüzey: Vizon Keten · Ahşap: Amerikan Ceviz · Kulp/Detay: Fırçalı Pirinç',
    materialKind: 'fabric',
    comboRole: 'seating',
    partFinishes: {
      primary: { hex: '#B9AEA1', roughness: 0.84, metalness: 0.02, partLabel: 'Vizon Keten / Kaşmir' },
      secondary: { hex: '#764E32', roughness: 0.44, metalness: 0.04, partLabel: 'Amerikan Ceviz' },
      accent: { hex: '#C6A154', roughness: 0.24, metalness: 0.9, partLabel: 'Fırçalı Pirinç' },
    },
  }),
  makeFinish({
    id: 'antrasit-keten-mese',
    label: 'Antrasit Keten · Doğal Meşe · Siyah Metal',
    comboSummary: 'Minder/Gövde: Antrasit Gri · Ahşap: Doğal Meşe · Metal: Mat Siyah',
    materialKind: 'fabric',
    comboRole: 'seating',
    partFinishes: {
      primary: { hex: '#3E434C', roughness: 0.82, metalness: 0.04, partLabel: 'Antrasit Gri' },
      secondary: { hex: '#C19766', roughness: 0.46, metalness: 0.04, partLabel: 'Doğal Meşe' },
      accent: { hex: '#1B1E24', roughness: 0.34, metalness: 0.84, partLabel: 'Mat Siyah Metal' },
    },
  }),
  makeFinish({
    id: 'taba-deri-ceviz',
    label: 'Taba Nubuk Deri · Koyu Ceviz · Bronz Metal',
    comboSummary: 'Minder: Taba Nubuk · Gövde: Koyu Ceviz · Metal: Fırçalı Bronz',
    materialKind: 'fabric',
    comboRole: 'seating',
    partFinishes: {
      primary: { hex: '#A5693F', roughness: 0.56, metalness: 0.04, partLabel: 'Taba Nubuk Deri' },
      secondary: { hex: '#593A26', roughness: 0.44, metalness: 0.05, partLabel: 'Koyu Ceviz' },
      accent: { hex: '#9E7D54', roughness: 0.26, metalness: 0.88, partLabel: 'Fırçalı Bronz' },
    },
  }),
  makeFinish({
    id: 'beyaz-lake-safir-mese',
    label: 'Mat Beyaz Lake · Safir Meşe · Şampanya Kulp',
    comboSummary: 'Gövde: Mat Beyaz · Raf/Ayak: Safir Meşe · Kulp: Şampanya Altın',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#F3F4F6', roughness: 0.32, metalness: 0.03, partLabel: 'Mat Beyaz Lake' },
      secondary: { hex: '#C49A6B', roughness: 0.46, metalness: 0.04, partLabel: 'Safir Meşe' },
      accent: { hex: '#CCB07A', roughness: 0.24, metalness: 0.88, partLabel: 'Şampanya Altın' },
    },
  }),
];

const DOOR_PLAQUE_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'siyah-pirinc-led',
    label: 'Mat Siyah Pleksi · Fırçalı Pirinç Rakam · 3000K LED',
    comboSummary: 'Plaka: Mat Siyah Pleksi/Alüminyum · Harf/Rakam: Fırçalı Pirinç · Zil LED: 3000K',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#1B1E24', roughness: 0.3, metalness: 0.72, partLabel: 'Mat Siyah Plaka' },
      secondary: { hex: '#D1AC5C', roughness: 0.2, metalness: 0.94, partLabel: 'Fırçalı Pirinç Rakam' },
      accent: { hex: '#FFD38A', roughness: 0.14, metalness: 0.05, partLabel: '3000K Gün Işığı LED' },
    },
  }),
  makeFinish({
    id: 'antrasit-inox-beyaz-led',
    label: 'Antrasit Alüminyum · 304 İnox Rakam · 4000K LED',
    comboSummary: 'Plaka: RAL 7016 Antrasit · Rakam: 304 Paslanmaz İnox · Zil LED: 4000K',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#343942', roughness: 0.34, metalness: 0.76, partLabel: 'Antrasit Alüminyum' },
      secondary: { hex: '#E2E8F0', roughness: 0.16, metalness: 0.96, partLabel: '304 Paslanmaz İnox' },
      accent: { hex: '#F4F7FA', roughness: 0.14, metalness: 0.05, partLabel: '4000K Doğal Beyaz LED' },
    },
  }),
  makeFinish({
    id: 'ceviz-siyah-led',
    label: 'Ceviz Ahşap · Mat Siyah Rakam · 3000K LED',
    comboSummary: 'Plaka: Masif Ceviz Kompozit · Rakam: Mat Siyah Metal · Zil LED: 3000K',
    materialKind: 'wood',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#764E32', roughness: 0.44, metalness: 0.06, partLabel: 'Ceviz Panel' },
      secondary: { hex: '#1E222A', roughness: 0.28, metalness: 0.86, partLabel: 'Mat Siyah Rakam' },
      accent: { hex: '#FFD691', roughness: 0.14, metalness: 0.05, partLabel: '3000K LED' },
    },
  }),
  makeFinish({
    id: 'beyaz-altin-led',
    label: 'Parlak Beyaz Pleksi · Gold Rakam · 3000K LED',
    comboSummary: 'Plaka: Parlak Beyaz Pleksi · Rakam: Altın Ayna Pleksi · Zil LED: 3000K',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#F6F7F9', roughness: 0.18, metalness: 0.06, partLabel: 'Parlak Beyaz Pleksi' },
      secondary: { hex: '#D4AF5A', roughness: 0.16, metalness: 0.95, partLabel: 'Gold Ayna Rakam' },
      accent: { hex: '#FFE0A3', roughness: 0.14, metalness: 0.05, partLabel: '3000K LED' },
    },
  }),
  makeFinish({
    id: 'bronz-siyah-led',
    label: 'Fırçalı Bronz · Mat Siyah Rakam · 2700K Amber LED',
    comboSummary: 'Plaka: Fırçalı Bronz Alüminyum · Rakam: Mat Siyah · Zil LED: 2700K Amber',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#8F6F4D', roughness: 0.28, metalness: 0.88, partLabel: 'Fırçalı Bronz' },
      secondary: { hex: '#1B1E24', roughness: 0.3, metalness: 0.86, partLabel: 'Mat Siyah Rakam' },
      accent: { hex: '#FFBF69', roughness: 0.14, metalness: 0.05, partLabel: '2700K Amber LED' },
    },
  }),
];

function createEntrywayAsset(params: {
  id: string;
  slug: string;
  name: string;
  brandStyle: string;
  archetype: AssetArchetype;
  placement: PlacementType;
  dimensionsCm: AssetDimensionsCm;
  polyEstimate: number;
  thumbnailUrl: string;
  searchKeywords: string[];
  roomTags: string[];
  aiSummary: string;
  finishes: MaterialFinish[];
  surfaceType: string;
  geometryBreakdown: string[];
  microDetails: string[];
  lightingTip: string;
}): ArchitecturalAsset {
  const { width, depth, height } = params.dimensionsCm;
  return {
    id: params.id,
    slug: params.slug,
    name: params.name,
    brandStyle: params.brandStyle,
    category: 'Antre & Giriş',
    archetype: params.archetype,
    placement: params.placement,
    dimensionsCm: params.dimensionsCm,
    polyEstimate: params.polyEstimate,
    renderEngines: ['Cycles', 'EEVEE Next'],
    uvUnwrapped: true,
    thumbnailUrl: params.thumbnailUrl,
    searchKeywords: params.searchKeywords,
    roomTags: params.roomTags,
    aiSummary: params.aiSummary,
    finishes: params.finishes,
    defaultFinishId: params.finishes[0].id,
    patterns: ARCHITECTURAL_PBR_PATTERNS,
    defaultPatternId: 'original_pbr',
    modelingSpec: {
      geometryBreakdown: params.geometryBreakdown,
      textureAndMaps: {
        surfaceType: params.surfaceType,
        uvTileCm: '1:1 Metrik UV + Gerçek Ahşap Damar, Ayna & LED Difüzör Haritası',
        bumpDepthMm: '0.5 – 2.5 mm (Ahşap Çıta, Traverten & Kumaş Kabartma)',
        roughnessRange: '0.02 – 0.88 (Ayna / Lake / Masif Ahşap / Bukle PBR)',
        shaderRecipe:
          'Principled BSDF çok parçalı malzeme kanalları: Gövde lake/ahşap, çıta/kumaş, metalik kulp/çerçeve, ayna (Metallic 0.98, Roughness 0.02) ve 3000K gizli LED Emission ayrı shader olarak aktarılır.',
      },
      microDetails: [
        ...params.microDetails,
        `1:1 metrik Türkiye antre/giriş ölçüsü (${width}×${depth}×${height} cm) ve Blender Cycles/EEVEE uyumlu PBR malzeme kurgusu.`,
      ],
      blenderModifiers: [
        'Bevel (Width: 0.0015 – 0.003 m, Segments: 2) + WeightedNormal ile keskin mobilya, çıta ve çelik kapı kenarları.',
        'Ayna yüzeylerinde Metallic: 0.98, Roughness: 0.02 ve arka gizli LED kanallarında 3000K Blackbody Emission (Strength 8–12) kullanın.',
      ],
      lightingAndCameraTip: params.lightingTip,
      aiRenderPrompt: `Photorealistic Blender Cycles architectural interior visualization of ${params.name} (${params.brandStyle}), exact metric dimensions ${width}x${depth}x${height}cm, authentic contemporary Turkish apartment and villa entryway design, natural oak slats, warm 3000K cove LED, crisp PBR materials, 8k.`,
      aiBlenderMasterPrompt: `Blender 4.x sahnesine "${params.name}" (${width}×${depth}×${height} cm) Türk antre ve giriş varlığını 1:1 ölçekle yerleştir. Ahşap çıta, ayna yansıması, gizli LED ve çok parçalı PBR kaplamalarını koru.`,
    },
    modelSource: {
      provider: 'procedural',
      license: 'MimarKatalog CAD',
    },
    sourceOrigin: 'catalog',
  };
}

// ============================================================================
// 14 SHOWPIECE TURKISH ENTRYWAY (ANTRE & DAİRE GİRİŞİ) CAD ASSETS
// ============================================================================

export const TURKISH_ENTRYWAY_ASSETS: ArchitecturalAsset[] = [
  // 1. Tavana Kadar Ahşap Çıtalı, Oturaklı & Gizli LED'li Modern Antre Vestiyeri (220×50×260 cm)
  createEntrywayAsset({
    id: 'tr-citali-oturakli-led-vestiyer',
    slug: 'tavana-kadar-ahsap-citali-oturakli-led-vestiyer',
    name: "Lineadecor / Kelebek Tavana Kadar Ahşap Çıtalı, Oturaklı & LED'li Vestiyer (220×50×260 cm)",
    brandStyle: 'Lineadecor / Kelebek · Tavana Kadar Çıtalı, Oturaklı & Füme Aynalı Antre Vestiyeri',
    archetype: 'tr_slatted_bench_vestiyer',
    placement: 'floor',
    dimensionsCm: { width: 220, depth: 50, height: 260 },
    polyEstimate: 24800,
    thumbnailUrl: '/assets/turkish-gaps/citali-oturakli-led-antre-vestiyer.png',
    searchKeywords: [
      'vestiyer',
      'portmanto',
      'çıtalı vestiyer',
      'oturaklı vestiyer',
      'ledli vestiyer',
      'aynalı vestiyer',
      'tavana kadar vestiyer',
      'antre dolabı',
      'daire girişi',
      'lineadecor',
      'kelebek',
    ],
    roomTags: ['Antre', 'Daire Girişi', 'Villa Holü', 'Koridor'],
    aiSummary:
      'Türkiye yeni nesil rezidans ve villa girişlerinin gözdesi 220×260 cm tavana kadar modüler vestiyer: solda kulpsuz mat lake çift mont dolabı, ortada 14 dikey doğal meşe akustik çıta + gizli 3000K üst/alt LED + bukle oturma minderi + derin ayakkabı çekmecesi, sağda tam boy füme ayna kapak.',
    finishes: VESTIYER_FINISHES,
    surfaceType: 'Mat Kaşmir Lake MDF-LAM + Doğal Meşe Akustik Çıta + Bukle Minder + Füme Flotal Ayna',
    geometryBreakdown: [
      'Sol blok: 2 adet kulpsuz tam boy lake dolap kapağı (freze dikey J-profil kulp kanalı ve 3 mm derz).',
      'Orta niş (90 cm): 14 adet dikey doğal meşe ahşap çıta, üst köprü dolap altı 3000K gizli LED şerit, 4 adet mat siyah askı düğmesi, yumuşak köşeli bukle oturma minderi ve alt çekmeceli yüzer ayakkabı bazası.',
      'Sağ blok: Tam boy 260 cm füme/bronz çerçevesiz ayna kapak ve alt gölge bazasında sıcak zemin LED’i.',
    ],
    microDetails: [
      'Antre tavan yüksekliğine (260 cm) sıfır oturan modern Türk iç mimarisi vestiyer oranları.',
      'Alt yüzer ayakkabı nişinde günlük terlik/ayakkabı koyma boşluğu ve 3000K gizli zemin ışığı.',
    ],
    lightingTip:
      'Antre giriş kamerasını 35 mm odak uzaklığında kapı eşiğinden konumlandırın; niş üstü ve baza altı 3000K LED şeritler ahşap çıtalarda sıcak gölge çizgileri oluşturur.',
  }),

  // 2. Tam Boy Füme Aynalı & Alüminyum Profilli Sürgülü Antre Vestiyeri (180×55×230 cm)
  createEntrywayAsset({
    id: 'tr-aynali-surgulu-antre-vestiyer',
    slug: 'tam-boy-fume-aynali-surgulu-antre-vestiyeri',
    name: 'Vivense / Doğtaş Tam Boy Füme Aynalı & Alüminyum Profilli Sürgülü Vestiyer (180×55×230 cm)',
    brandStyle: 'Vivense / Doğtaş · Alüminyum Çerçeveli Sürgülü Aynalı Portmanto',
    archetype: 'tr_mirrored_sliding_vestiyer',
    placement: 'floor',
    dimensionsCm: { width: 180, depth: 55, height: 230 },
    polyEstimate: 16400,
    thumbnailUrl: '/assets/turkish-gaps/aynali-surgulu-antre-vestiyer.png',
    searchKeywords: [
      'sürgülü vestiyer',
      'aynalı vestiyer',
      'füme ayna dolap',
      'portmanto',
      'antre dolabı',
      'vivense',
      'doğtaş',
      'daire girişi',
    ],
    roomTags: ['Antre', 'Koridor', 'Daire Girişi', 'Giyinme Holü'],
    aiSummary:
      'Dar apartman koridorlarını geniş gösteren 180 cm genişliğinde çift raylı sürgülü vestiyer. Sol kanat mat siyah alüminyum kayıtlı tam boy füme ayna, sağ kanat dikey freze meşe/lake panel, üst-alt eloksal ray mekanizması.',
    finishes: [VESTIYER_FINISHES[2], VESTIYER_FINISHES[0], VESTIYER_FINISHES[1], VESTIYER_FINISHES[3], VESTIYER_FINISHES[4]],
    surfaceType: 'Füme Flotal Ayna + Eloksal Alüminyum Sürgü Profili + Freze MDF-LAM',
    geometryBreakdown: [
      '180×55×230 cm gövde, üst ve alt çift kanallı alüminyum sürgü rayları ve 8 cm çekik baza.',
      'Ön sürgü kanat: İnce alüminyum çerçeveli ve 3 yatay kayıt çıtalı tam boy füme ayna.',
      'Arka sürgü kanat: Dikey oluklu ahşap/lake dekoratif kapak ve boydan boya entegre tutamak profili.',
    ],
    microDetails: [
      'İki sürgü kapak arasında gerçek 2.8 cm ray kademesi ve alüminyum fırça fitil çizgisi.',
    ],
    lightingTip:
      'Tavan gömme spotların füme ayna yüzeyindeki hafif yansıması koridor derinliğini iki katına çıkarır.',
  }),

  // 3. Dar Antre İçin Oturaklı, Aynalı & Çıtalı Kompakt Portmanto (120×38×210 cm)
  createEntrywayAsset({
    id: 'tr-kompakt-dar-antre-portmanto',
    slug: 'dar-antre-oturakli-aynali-citali-kompakt-portmanto',
    name: 'Adore / Rani Dar Antre İçin Oturaklı, Aynalı & Çıtalı Kompakt Portmanto (120×38×210 cm)',
    brandStyle: 'Adore / Rani · 120 cm Kompakt Türk Apartman Antre Portmantosu',
    archetype: 'tr_compact_entry_portmanto',
    placement: 'floor',
    dimensionsCm: { width: 120, depth: 38, height: 210 },
    polyEstimate: 17200,
    thumbnailUrl: '/assets/turkish-gaps/kompakt-dar-antre-portmanto.png',
    searchKeywords: [
      'kompakt portmanto',
      'dar antre vestiyer',
      '120 cm vestiyer',
      'aynalı portmanto',
      'oturaklı portmanto',
      'adore',
      'rani',
      'apartman girişi',
    ],
    roomTags: ['Küçük Antre', 'Apartman Daire Girişi', '1+1 / 2+1 Hol'],
    aiSummary:
      'Türkiye 1+1 ve 2+1 apartman dairelerinde en çok satılan 120×38 cm kompakt portmanto ölçüsü: solda boy aynalı tek kapaklı dolap, sağda ahşap çıtalı duvar askılığı, üst şapka rafı, minderli oturak ve 2 katlı düşer ayakkabılık.',
    finishes: [VESTIYER_FINISHES[1], VESTIYER_FINISHES[0], VESTIYER_FINISHES[2], VESTIYER_FINISHES[3], VESTIYER_FINISHES[4]],
    surfaceType: 'Mat Beyaz / Kaşmir MDF-LAM + Safir Meşe Çıta + Kristal Boy Aynası + Keten Minder',
    geometryBreakdown: [
      'Sol 46 cm dolap: Tam boy 188 cm parlak kristal ayna kapak ve ince dikey pirinç/siyah kulp.',
      'Sağ 74 cm açık bölüm: 9 dikey meşe çıtalı sırt paneli, üst kutu/şapka rafı, 4 ikili metal mont askısı.',
      'Alt bölüm: Kalın keten oturma minderi altında çift katlı ayakkabı depolama dolabı ve konik ahşap ayaklar.',
    ],
    microDetails: [
      '38 cm ince derinliği sayesinde 115–130 cm genişliğindeki dar Türk apartman hollerinde geçişi daraltmaz.',
    ],
    lightingTip:
      'Üst şapka rafına bir dekoratif hasır kutu ekleyerek giriş kamerasında yaşam hissi güçlendirin.',
  }),

  // 4. Sur Albero / Boss Lüks Villa Hemyüz Pivot Çelik Giriş Kapısı (140×12×260 cm)
  createEntrywayAsset({
    id: 'tr-sur-albero-villa-pivot-kapi',
    slug: 'sur-albero-boss-luks-villa-pivot-celik-kapi',
    name: 'Sur Albero / Boss Lüks Villa Hemyüz Pivot Çelik Giriş Kapısı — İroko Çıtalı & Parmak İzli (140×12×260 cm)',
    brandStyle: 'Sur Çelik Kapı Albero / Boss · 140×260 cm Lüks Villa Pivot Dış Kapı',
    archetype: 'tr_villa_pivot_steel_door',
    placement: 'floor',
    dimensionsCm: { width: 140, depth: 12, height: 260 },
    polyEstimate: 19600,
    thumbnailUrl: '/assets/turkish-gaps/sur-albero-luks-villa-pivot-celik-kapi.png',
    searchKeywords: [
      'pivot kapı',
      'villa kapısı',
      'villa çelik kapı',
      'sur çelik kapı',
      'albero',
      'boss çelik kapı',
      'iroko kapı',
      'parmak izli çelik kapı',
      'dış kapı',
      'hemyüz kapı',
    ],
    roomTags: ['Villa Girişi', 'Dış Cephe', 'Lüks Antre', 'Müstakil Konut'],
    aiSummary:
      'Modern Türk müstakil villalarının imza giriş kapısı: 140×260 cm hemyüz alüminyum-çelik kasa, eksen dışı gizli pivot mekanizmalı kanat, dış cephe dayanımlı iroko ahşap dikey çıtalar, antrasit sinter taş şerit, 180 cm LED aydınlatmalı bar kulp ve gömme parmak izi/şifre okuyucu.',
    finishes: VILLA_STEEL_DOOR_FINISHES,
    surfaceType: 'Dış Cephe İroko Ahşap Çıta + Antrasit Sinter Taş + Zırhlı Çelik Kasa + LED Bar Kulp',
    geometryBreakdown: [
      '140×260 cm kalın antrasit hemyüz dış cephe çelik pervaz kasası ve paslanmaz alt eşik profili.',
      '122 cm genişliğinde masif pivot kanat: sol %65 dış mekan iroko ahşap dikey çıta, sağ %35 antrasit sinter taş bant.',
      '180 cm boydan boya mat siyah/pirinç tüp bar çekme kolu, arkasında sıcak 3000K dikey gizli LED ışık şeridi ve gömme dokunmatik parmak izi kilidi.',
    ],
    microDetails: [
      'Üst ve alt eksen dışı (24 cm) ağır hizmet paslanmaz çelik pivot menteşe pimi ve 4 mm gölge derzi.',
    ],
    lightingTip:
      'Alacakaranlık (dusk) villa dış cephe renderlarında çekme kolu arkasındaki 3000K dikey LED şerit çarpıcı mimari derinlik yaratır.',
  }),

  // 5. Kale / Formet Çift Kanatlı & Yan Camlı Lüks Villa Çelik Kapısı (170×14×240 cm)
  createEntrywayAsset({
    id: 'tr-kale-formet-cift-kanat-villa-kapi',
    slug: 'kale-formet-cift-kanatli-yan-camli-villa-celik-kapi',
    name: 'Kale / Formet Çift Kanatlı & Zırhlı Yan Camlı Lüks Villa Çelik Dış Kapısı (170×14×240 cm)',
    brandStyle: 'Kale / Formet Çelik Kapı · 170×240 cm Çift Kanatlı Villa Giriş Kapısı',
    archetype: 'tr_double_villa_steel_door',
    placement: 'floor',
    dimensionsCm: { width: 170, depth: 14, height: 240 },
    polyEstimate: 21200,
    thumbnailUrl: '/assets/turkish-gaps/kale-formet-cift-kanatli-villa-celik-kapi.png',
    searchKeywords: [
      'çift kanatlı çelik kapı',
      'villa çelik kapı',
      'kale çelik kapı',
      'formet çelik kapı',
      'yan camlı çelik kapı',
      'bina giriş kapısı',
      'daire giriş kapısı',
      'zırhlı kapı',
    ],
    roomTags: ['Villa Girişi', 'Müstakil Ev Cephe', 'Geniş Antre', 'Konak Girişi'],
    aiSummary:
      'Türkiye müstakil villa ve büyük daire girişleri için Kale / Formet 170×240 cm çift kanatlı çelik dış kapı. 105 cm ana kanat + 50 cm yatay paslanmaz zırh çubuklu buzlu camlı yardımcı kanat, 14 noktalı Kale monoblok kilit rozeti, optik dürbün ve uzun inox bar kulp.',
    finishes: [
      VILLA_STEEL_DOOR_FINISHES[1],
      VILLA_STEEL_DOOR_FINISHES[0],
      VILLA_STEEL_DOOR_FINISHES[2],
      VILLA_STEEL_DOOR_FINISHES[3],
      VILLA_STEEL_DOOR_FINISHES[4],
    ],
    surfaceType: '2 mm DKP Zırhlı Çelik + Kompakt Laminat/Termowood Panel + Temperli Buzlu Cam + 304 İnox',
    geometryBreakdown: [
      '170×240 cm ağır hizmet dış pervazlı çelik kasa ve granit/paslanmaz yağmur eşiği.',
      'Ana kanat: Yatay mimari derzli ve inox şerit kakmalı zırhlı gövde, 140 cm dikey bar çekme kolu, Kale güvenlik kilit rozeti ve geniş açılı kapı dürbünü.',
      'Sabit/yarı-aktif yan kanat: 3 katmanlı buzlu güvenlik camı + 5 adet yatay 304 paslanmaz zırh koruma çubuğu.',
    ],
    microDetails: [
      'Kale Kilit çift barelli çelik rozet, üst emniyet mandalı ve dış pervaz köşe pahları.',
    ],
    lightingTip:
      'İç antre sıcak ışığını buzlu yan camdan dışarı hafifçe sızdırarak akşam cephe renderlarına canlılık katın.',
  }),

  // 6. Modern Lazer Kesim Pleksi & Pirinç Daire Kapı Numarası + LED Zil Plakası (22×3×26 cm)
  createEntrywayAsset({
    id: 'tr-daire-kapi-numarasi-led-zil',
    slug: 'modern-lazer-kesim-daire-kapi-numarasi-led-zil-plakasi',
    name: 'Modern Lazer Kesim Pleksi & Pirinç Daire Kapı Numarası + LED Zil Plakası (22×3×26 cm)',
    brandStyle: 'Türkiye Modern Apartman & Rezidans Kapı Numarası + Işıklı Zil Butonu',
    archetype: 'tr_door_number_bell_plate',
    placement: 'wall-mounted',
    dimensionsCm: { width: 22, depth: 3, height: 26, mountHeight: 145 },
    polyEstimate: 4800,
    thumbnailUrl: '/assets/turkish-gaps/daire-kapi-numarasi-led-zil-plakasi.png',
    searchKeywords: [
      'kapı numarası',
      'daire numarası',
      'zil butonu',
      'ışıklı kapı numarası',
      'kapı isimliği',
      'apartman kat holü',
      'daire girişi',
      'pleksi kapı numarası',
    ],
    roomTags: ['Kat Holü', 'Daire Girişi', 'Apartman Koridoru', 'Villa Dış Giriş'],
    aiSummary:
      'Türkiye yeni apartman ve rezidans kat hollerinin çelik kapı yanı standardı: arkadan 3000K gizli LED halesine sahip çift katmanlı mat siyah/pirinç daire numarası ("NO: 14"), isimlik bandı ve ışıklı paslanmaz zil butonu.',
    finishes: DOOR_PLAQUE_FINISHES,
    surfaceType: 'Mat Siyah Pleksi/Alüminyum + 3D Kabartma Pirinç Rakam + LED Halka Zil Butonu',
    geometryBreakdown: [
      '22×26 cm arkadan 1.4 cm mesafe pimli (standoff) çift katmanlı mimari kapı plakası.',
      'Arkadan duvara vuran sıcak 3000K gizli LED ışık çerçevesi ve üstte net kabartma "NO: 14" tipografisi.',
      'Alt merkezde dairesel ışıklı zil butonu halkası ve fırçalı metal isimlik şeridi.',
    ],
    microDetails: [
      'Apartman kat holünde çelik kapı kolu tarafına yerden +145 cm kota birebir montaj ölçüsü.',
    ],
    lightingTip:
      'Apartman kat holü renderlarında zil halkasındaki 3000K LED halesi çelik kapı detayını zenginleştirir.',
  }),

  // 7. 3'lü Düşer Kapaklı Ultra İnce (24 cm) Antre Ayakkabılık (80×24×125 cm)
  createEntrywayAsset({
    id: 'tr-duser-kapakli-slim-ayakkabilik',
    slug: 'duser-kapakli-ultra-ince-antre-ayakkabilik',
    name: "Adore / Vivense 3'lü Düşer Kapaklı Ultra İnce (24 cm) Antre Ayakkabılık (80×24×125 cm)",
    brandStyle: 'Adore / Vivense · 3 Bölmeli Düşer Kapaklı Slim Antre Ayakkabılığı',
    archetype: 'tr_flip_drawer_shoe_cabinet',
    placement: 'floor',
    dimensionsCm: { width: 80, depth: 24, height: 125 },
    polyEstimate: 14200,
    thumbnailUrl: '/assets/turkish-gaps/duser-kapakli-slim-antre-ayakkabilik.png',
    searchKeywords: [
      'ayakkabılık',
      'düşer kapaklı ayakkabılık',
      'ince ayakkabılık',
      'dar antre ayakkabılık',
      'slim ayakkabılık',
      'adore',
      'vivense',
      'antre mobilyası',
    ],
    roomTags: ['Dar Antre', 'Apartman Girişi', 'Koridor', 'Kapı Arkası'],
    aiSummary:
      'Türkiye dar apartman koridorlarının vazgeçilmez 24 cm derinlikli 3 gözlü düşer kapaklı ayakkabılığı. Üst kapağı 22° aralık sergilenerek iç çift sıralı ayakkabı bölmesi, pirinç/siyah ince kulplar, masif meşe konik ayaklar ve üstte anahtarlık kasesi dahil.',
    finishes: [
      BENCH_SHOE_FINISHES[4],
      BENCH_SHOE_FINISHES[0],
      BENCH_SHOE_FINISHES[1],
      BENCH_SHOE_FINISHES[2],
      BENCH_SHOE_FINISHES[3],
    ],
    surfaceType: 'Mat Beyaz / Kaşmir MDF-LAM + Masif Meşe Ayak + Pirinç Kulp + Dekoratif Anahtar Kasesi',
    geometryBreakdown: [
      '80×24×125 cm ultra ince gövde, üstte kenarlı eşya/anahtar tablası ve seramik anahtarlık kasesi.',
      '3 adet yatay düşer kapaklı ayakkabı gözü (üst göz 22° açık pozisyonda, iç ayırıcı plaka ve stilize ayakkabı formlarıyla).',
      '14 cm yüksekliğinde masif meşe açılı ayaklar (robot süpürge geçişine uygun Türk konut standardı).',
    ],
    microDetails: [
      'Üst kapağın hafif açık sergilenmesi mekanizmayı ve çift katmanlı iç ayakkabı kapasitesini anında okutur.',
    ],
    lightingTip:
      'Üzerine asimetrik veya kemerli bir antre aynası yerleştirerek dar koridor kompozisyonunu tamamlayın.',
  }),

  // 8. Bukle Minderli & Ahşap Çıtalı Antre Oturma Bankı — Ayakkabılıklı (110×40×48 cm)
  createEntrywayAsset({
    id: 'tr-minderli-antre-oturma-banki',
    slug: 'bukle-minderli-ahsap-citali-antre-oturma-banki',
    name: 'Enza Home / Lazzoni Bukle Minderli & Ahşap Çıtalı Antre Oturma Bankı — Ayakkabılıklı (110×40×48 cm)',
    brandStyle: 'Enza Home / Lazzoni · Minderli Antre Puf Bank & Ayakkabı Rafı',
    archetype: 'tr_entryway_shoe_bench',
    placement: 'floor',
    dimensionsCm: { width: 110, depth: 40, height: 48 },
    polyEstimate: 15800,
    thumbnailUrl: '/assets/turkish-gaps/minderli-antre-oturma-banki.png',
    searchKeywords: [
      'antre bankı',
      'oturma bankı',
      'antre pufu',
      'minderli ayakkabılık',
      'ayakkabı giyme bankı',
      'enza home',
      'lazzoni',
      'bukle puf',
    ],
    roomTags: ['Antre', 'Daire Girişi', 'Giyinme Odası', 'Villa Holü'],
    aiSummary:
      'Ayakkabı giyerken konfor sağlayan 110 cm bukle minderli modern Türk antre oturma bankı. Kalın yumuşak köşeli bukle minder, masif meşe/ceviz gövde, alt katta 2 sıralı çıtalı ayakkabı rafı, yan bölmede hasır düzenleyici sepet ve şık ayakkabı formları.',
    finishes: BENCH_SHOE_FINISHES,
    surfaceType: 'Krem Bukle / Vizon Keten Döşeme + Masif Meşe Çıtalı Gövde + Hasır Sepet',
    geometryBreakdown: [
      '110×40 cm masif ahşap karkas, yuvarlatılmış silindirik ayaklar ve 7 cm kalınlığında yumuşak biye dikişli bukle oturma minderi.',
      'Alt ayakkabı bölmesi: 7 adet aralıklı ahşap çıtalı nefes alan ayakkabı rafı + sol yanda örgü hasır terlik/aksesuar sepeti.',
      'Sağ tarafta raf üzerinde ölçekli günlük spor ayakkabı çifti detayı.',
    ],
    microDetails: [
      '48 cm ergonomik oturma yüksekliği ile her yaştan kullanıcı için gerçek mimari konfor ölçüsü.',
    ],
    lightingTip:
      'Üzerinde akustik ahşap duvar çıtası veya duvar askılığı ile birlikte kullanıldığında eksiksiz bir antre köşesi oluşturur.',
  }),

  // 9. Doğal Hindistan Cevizi (Coir) Kapı Önü Paspası & Pirinç Şemsiyelik Seti (80×50×55 cm)
  createEntrywayAsset({
    id: 'tr-antre-paspas-semsiyelik-seti',
    slug: 'dogal-coir-kapi-onu-paspasi-pirinc-semsiyelik-seti',
    name: 'Mudo Concept / Koçtaş Doğal Coir Kapı Önü Paspası & Pirinç Şemsiyelik Seti (80×50×55 cm)',
    brandStyle: 'Mudo Concept / Koçtaş · Hoş Geldiniz Kapı Paspası, Şemsiyelik & Kerata',
    archetype: 'tr_doormat_umbrella_set',
    placement: 'floor',
    dimensionsCm: { width: 80, depth: 50, height: 55 },
    polyEstimate: 11400,
    thumbnailUrl: '/assets/turkish-gaps/antre-paspas-semsiyelik-seti.png',
    searchKeywords: [
      'kapı paspası',
      'kapı önü paspas',
      'hoş geldiniz paspas',
      'hindistan cevizi paspas',
      'şemsiyelik',
      'kerata',
      'antre aksesuarı',
      'mudo concept',
      'koçtaş',
    ],
    roomTags: ['Çelik Kapı Önü', 'Antre Eşiği', 'Kat Holü', 'Villa Sundurma'],
    aiSummary:
      'Daire ve villa girişine gerçekçilik katan eksiksiz eşik seti: kalın dokulu doğal Hindistan cevizi lifi (coir) "HOŞ GELDİNİZ" kapı önü paspası, yanında oluklu mat siyah & pirinç silindir şemsiyelik, 2 adet kıvrık ahşap saplı kapalı şemsiye ve uzun pirinç ayakkabı çekeceği (kerata).',
    finishes: [
      ENTRY_CONSOLE_MIRROR_FINISHES[0],
      ENTRY_CONSOLE_MIRROR_FINISHES[1],
      ENTRY_CONSOLE_MIRROR_FINISHES[2],
      ENTRY_CONSOLE_MIRROR_FINISHES[3],
      ENTRY_CONSOLE_MIRROR_FINISHES[4],
    ],
    surfaceType: 'Doğal Coir Lif Paspas + Kauçuk Çerçeve + Oluklu Metal & Pirinç Şemsiyelik',
    geometryBreakdown: [
      '75×45×2.2 cm siyah kauçuk çerçeveli, dokulu doğal Hindistan cevizi lifi paspas ve keskin "HOŞ GELDİNİZ" tipografisi.',
      'Ø23×50 cm oluklu mat siyah/bronz silindir şemsiyelik, üst pirinç ağız halkası ve su damlama tepsisi.',
      'İçeride 2 adet katlı kumaş şemsiye (kıvrık masif kayın J-saplı) + 52 cm uzun pirinç kerata.',
    ],
    microDetails: [
      'Çelik kapı açılış alanının hemen yanına veya dış kat holüne yerleştirildiğinde fotogerçekçi hikaye anlatımı sağlar.',
    ],
    lightingTip:
      'Paspas üzerinde hafif bump/roughness dokusu sayesinde tavan ışığı doğal coir liflerini gerçekçi gösterir.',
  }),

  // 10. Traverten & Ceviz Çıtalı Modern Antre Dresuar + Oval LED Ayna Seti (125×36×185 cm)
  createEntrywayAsset({
    id: 'tr-traverten-mermer-dresuar-ayna-seti',
    slug: 'traverten-ceviz-citali-modern-antre-dresuar-oval-led-ayna-seti',
    name: 'Lazzoni / Mudo Concept Traverten & Ceviz Çıtalı Antre Dresuar + Oval LED Ayna Seti (125×36×185 cm)',
    brandStyle: 'Lazzoni / Mudo Concept · Traverten Üstlü Çıtalı Dresuar & LED’li Antre Aynası',
    archetype: 'tr_entryway_console_mirror_set',
    placement: 'floor',
    dimensionsCm: { width: 125, depth: 36, height: 185 },
    polyEstimate: 22400,
    thumbnailUrl: '/assets/turkish-gaps/traverten-ceviz-dresuar-oval-led-ayna-seti.png',
    searchKeywords: [
      'dresuar',
      'antre dresuarı',
      'mermer dresuar',
      'traverten dresuar',
      'aynalı dresuar',
      'oval led ayna',
      'lazzoni',
      'mudo concept',
      'giriş konsolu',
    ],
    roomTags: ['Antre', 'Villa Giriş Holü', 'Salon Geçişi', 'Koridor'],
    aiSummary:
      'Lüks Türk villa ve rezidans girişlerinin başrol oyuncusu: oval köşeli dikey ceviz çıtalı ve honlu Denizli traverten üst tablalı 125 cm dresuar, üzerinde seramik anahtarlık kasesi, bambu oda kokusu (diffuser) ve heykelimsi vazo; üstünde 3000K arkadan LED aydınlatmalı kemerli/oval kristal ayna.',
    finishes: ENTRY_CONSOLE_MIRROR_FINISHES,
    surfaceType: 'Denizli Traverten / Calacatta Mermer + Ceviz Çıta + Fırçalı Pirinç + 3000K LED Ayna',
    geometryBreakdown: [
      '125×36×82 cm yuvarlatılmış oval uçlu, dikey ceviz çıtalı gövde, 2.5 cm kalınlığında pahlı traverten üst tabla ve ikiz kemer metal/ahşap ayaklar.',
      'Üst aksesuar kurgusu: traverten anahtar kasesi, çubuklu cam oda kokusu şişesi ve mat krem seramik vazo.',
      'Duvar üstü 68×96 cm oval/hap form kristal ayna, ince pirinç çerçeve ve arkadan 3000K sıcak duvar LED halesi.',
    ],
    microDetails: [
      '36 cm zarif derinliğiyle antre duvarında hacim çalmadan lüks otel lobisi atmosferi yaratır.',
    ],
    lightingTip:
      'Ayna arkasındaki 3000K LED duvar yıkamasını yumuşak tutarak traverten tabla ve seramik objelerde sıcak yansıma elde edin.',
  }),

  // 11. Kemerli (Arch) İnce Metal Çerçeveli & Arkadan LED'li Antre Boy Aynası (75×6×185 cm)
  createEntrywayAsset({
    id: 'tr-kemerli-led-boy-aynasi',
    slug: 'kemerli-arch-metal-cerceveli-led-antre-boy-aynasi',
    name: "Mudo Concept / Karaca Kemerli (Arch) İnce Metal Çerçeveli & LED'li Antre Boy Aynası (75×6×185 cm)",
    brandStyle: 'Mudo Concept / Karaca · 75×185 cm Kemerli (Arch) LED’li Boy Aynası',
    archetype: 'tr_arched_led_floor_mirror',
    placement: 'floor',
    dimensionsCm: { width: 75, depth: 8, height: 185 },
    polyEstimate: 8600,
    thumbnailUrl: '/assets/turkish-gaps/kemerli-arch-led-antre-boy-aynasi.png',
    searchKeywords: [
      'boy aynası',
      'kemerli ayna',
      'arch ayna',
      'ledli boy aynası',
      'antre aynası',
      'metal çerçeveli ayna',
      'mudo concept',
      'karaca',
    ],
    roomTags: ['Antre', 'Giyinme Odası', 'Yatak Odası', 'Koridor'],
    aiSummary:
      'Son yılların en popüler Türk iç mimari antre objesi: 75×185 cm tam yarım daire kemerli (arch) ultra ince fırçalı pirinç/mat siyah alüminyum çerçeveli kristal boy aynası, gizli arka 3000K LED ışık halesi ve katlanır zemin destek ayağıyla.',
    finishes: ENTRY_CONSOLE_MIRROR_FINISHES,
    surfaceType: 'Yüksek Yansıtıcılı Flotal Kristal Ayna + Eloksal Alüminyum Çerçeve + 3000K LED',
    geometryBreakdown: [
      '75×185 cm kusursuz yarım daire kemerli (Arch) üst form ve 1.4 cm ince pahlı metal çerçeve.',
      'Yüksek parlaklıklı flotal ayna yüzeyi + arka kasada gizli 3000K gün ışığı LED difüzör şeridi.',
      'Hem duvara yaslamalı (arka katlanır destek ayağı dahil) hem de duvara asmalı kullanım geometrisi.',
    ],
    microDetails: [
      '185 cm yüksekliğiyle evden çıkmadan önce tam boy görünüm ve dar antrede güçlü ferahlık etkisi verir.',
    ],
    lightingTip:
      'Kemerli boy aynasını çelik kapının çaprazındaki duvara yerleştirerek salon ışığını antreye yansıtın.',
  }),

  // 12. Asimetrik Organik Formlu Arkadan Gün Işığı LED'li Antre Aynası (85×5×115 cm)
  createEntrywayAsset({
    id: 'tr-asimetrik-organik-duvar-aynasi',
    slug: 'asimetrik-organik-formlu-led-antre-duvar-aynasi',
    name: "Vivense / English Home Asimetrik Organik Formlu Arkadan LED'li Antre Aynası (85×5×115 cm)",
    brandStyle: 'Vivense / English Home · Organik Asimetrik Çerçevesiz Backlit LED Ayna',
    archetype: 'tr_organic_led_wall_mirror',
    placement: 'wall-mounted',
    dimensionsCm: { width: 85, depth: 5, height: 115, mountHeight: 95 },
    polyEstimate: 7400,
    thumbnailUrl: '/assets/turkish-gaps/asimetrik-organik-led-antre-aynasi.png',
    searchKeywords: [
      'organik ayna',
      'asimetrik ayna',
      'ledli ayna',
      'antre duvar aynası',
      'çerçevesiz ayna',
      'vivense',
      'english home',
      'dresuar üstü ayna',
    ],
    roomTags: ['Antre', 'Dresuar Üstü', 'Banyo', 'Makyaj Köşesi'],
    aiSummary:
      'Modern Türk iç mekan ve antre dresuar üstü dekorasyonlarının gözdesi 85×115 cm akışkan organik (çakıl taşı formlu) çerçevesiz rodajlı kristal duvar aynası; arka gizli alüminyum şasi ve 360° yumuşak 3000K gün ışığı LED halesiyle.',
    finishes: ENTRY_CONSOLE_MIRROR_FINISHES,
    surfaceType: '4 mm Rodajlı Flotal Ayna + Gizli Alüminyum Şasi + 360° 3000K Backlit LED',
    geometryBreakdown: [
      'Kübik Bezier eğrileriyle oluşturulmuş pürüzsüz organik asimetrik ayna silüeti ve ince parlatılmış rodaj kenarı.',
      'Duvara 3 cm yüzer mesafe veren arka alüminyum montaj şasisi ve çepeçevre kesintisiz 3000K LED şerit.',
      'Ayna yüzeyinde dokunmatik LED açma-kapama sensör simgesi.',
    ],
    microDetails: [
      'Düşer kapaklı ayakkabılık veya 100–120 cm dresuar üzerinde yerden +95 cm alt kotta ideal oran.',
    ],
    lightingTip:
      'Açık taş/sıva veya ahşap çıtalı duvar üzerinde arka 3000K LED halesi yumuşak bir mimari derinlik oluşturur.',
  }),

  // 13. Akustik Keçeli Ahşap Duvar Çıtası + Gizli LED + Metal Askılık Paneli (120×6×240 cm)
  createEntrywayAsset({
    id: 'tr-akustik-ahsap-duvar-citasi-askilik',
    slug: 'akustik-keceli-ahsap-duvar-citasi-led-askilik-paneli',
    name: 'AGT / Dekorister Akustik Keçeli Ahşap Duvar Çıtası + Gizli LED + Metal Askı Paneli (120×6×240 cm)',
    brandStyle: 'AGT / Dekorister · 120×240 cm Akustik Duvar Çıtası, Lineer LED & Duvar Askılığı',
    archetype: 'tr_acoustic_slat_coat_panel',
    placement: 'floor',
    dimensionsCm: { width: 120, depth: 8, height: 240 },
    polyEstimate: 16200,
    thumbnailUrl: '/assets/turkish-gaps/akustik-ahsap-duvar-citasi-askilik.png',
    searchKeywords: [
      'duvar çıtası',
      'ahşap çıta',
      'akustik panel',
      'akustik duvar paneli',
      'ledli duvar çıtası',
      'antre duvar paneli',
      'duvar askılığı',
      'agt',
      'dekorister',
    ],
    roomTags: ['Antre', 'Koridor', 'TV Duvarı', 'Merdiven Kovası'],
    aiSummary:
      'Türkiye çağdaş iç mimarisinin imzası 120×240 cm siyah akustik keçe tabanlı 18 çıtalı doğal meşe/ceviz duvar paneli; çıtalar arasına gömülü dikey 3000K lineer LED profili, 5 adet kademeli metal mont askı düğmesi ve +110 cm kotta ince yüzer anahtarlık rafı.',
    finishes: [
      VESTIYER_FINISHES[0],
      VESTIYER_FINISHES[2],
      VESTIYER_FINISHES[1],
      VESTIYER_FINISHES[3],
      VESTIYER_FINISHES[4],
    ],
    surfaceType: 'Siyah Akustik Keçe + Doğal Meşe / Ceviz MDF Çıta + Gömme 3000K LED + Metal Askı Düğmesi',
    geometryBreakdown: [
      '120×240 cm antrasit/siyah 9 mm akustik PET keçe taban plakası.',
      '18 adet 3×2 cm dikey meşe/ceviz çıta + 6. ve 13. aralıkta tam boy gömme siyah alüminyum 3000K lineer LED kanalı.',
      'Ergonomik kademeli 5 adet silindirik pirinç/mat siyah mont-çanta askı düğmesi ve 42 cm ince yüzer anahtarlık rafı.',
    ],
    microDetails: [
      'Antre oturma bankı veya düşer kapaklı ayakkabılık arkasına sıfır oturarak özel marangozluk etkisi verir.',
    ],
    lightingTip:
      'Çıtalar arasındaki ikiz dikey 3000K LED şeritleri akşam sahnelerinde antreye sıcak dikey ritim katar.',
  }),

  // 14. Ahşap & Metal Duvar Tipi Antre Anahtarlık, Mektupluk & Askı Rafı (48×12×22 cm)
  createEntrywayAsset({
    id: 'tr-duvar-anahtarlik-raf-modulu',
    slug: 'ahsap-metal-duvar-tipi-antre-anahtarlik-mektupluk-rafi',
    name: 'Mudo Concept / Vivense Ahşap & Metal Duvar Tipi Antre Anahtarlık, Mektupluk & Rafı (48×12×22 cm)',
    brandStyle: 'Mudo Concept / Vivense · Duvar Tipi Anahtarlık, Mektupluk & Gözlük Rafı',
    archetype: 'tr_wall_key_mail_organizer',
    placement: 'wall-mounted',
    dimensionsCm: { width: 48, depth: 12, height: 22, mountHeight: 135 },
    polyEstimate: 6200,
    thumbnailUrl: '/assets/turkish-gaps/duvar-anahtarlik-mektupluk-rafi.png',
    searchKeywords: [
      'anahtarlık',
      'duvar anahtarlık',
      'mektupluk',
      'antre rafı',
      'kapı girişi rafı',
      'anahtar askısı',
      'mudo concept',
      'vivense',
    ],
    roomTags: ['Daire Girişi', 'Diafon Yanı', 'Antre', 'Çelik Kapı Yanı'],
    aiSummary:
      'Çelik kapı ve görüntülü diafon yanına asılan 48 cm masif ceviz/meşe & mat siyah metal duvar tipi antre düzenleyici: üstte mektup/gözlük rafı ve dikey mektup yuvası, altta 6 kancalı metal anahtar askısı ve üzerinde asılı pirinç anahtarlık detayları.',
    finishes: [
      BENCH_SHOE_FINISHES[1],
      BENCH_SHOE_FINISHES[0],
      BENCH_SHOE_FINISHES[2],
      BENCH_SHOE_FINISHES[3],
      BENCH_SHOE_FINISHES[4],
    ],
    surfaceType: 'Masif Ceviz / Doğal Meşe + Elektrostatik Mat Siyah Çelik + Pirinç Anahtar Detayları',
    geometryBreakdown: [
      '48×22 cm pahlı masif ahşap arka pano, 11 cm derinliğinde üst gözlük/cüzdan rafı ve zarf tutucu çıta.',
      'Alt mat siyah metal şerit üzerinde 6 adet kavisli anahtar kancası ve 2 adet asılı pirinç anahtarlık halkası.',
      'Raf üstünde dekoratif zarf ve küçük minimalist sukulent/cüzdan kütlesi.',
    ],
    microDetails: [
      'Görüntülü diafon (+145 cm) yanında +135 cm kotta daire giriş duvarına gerçek yaşam detayı ekler.',
    ],
    lightingTip:
      'Kapı girişi yakın plan renderlarında pirinç anahtarların hafif metalik parıltısı sahneye sıcaklık katar.',
  }),
];

export const TURKISH_ENTRYWAY_ASSET_IDS = new Set<string>(
  TURKISH_ENTRYWAY_ASSETS.map((a) => a.id),
);
