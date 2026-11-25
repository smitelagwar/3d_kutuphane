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
// AUTHENTIC TURKISH BUILT-IN KITCHEN APPLIANCE (MUTFAK ANKASTRE) FINISH BANKS
// Researched from Bosch Türkiye, Siemens Ev Aletleri, Vestel, Arçelik, Franke,
// Silverline, Teka & Profilo Turkish retail catalogs.
// ============================================================================

const MODERN_ANKASTRE_GLASS_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'siyah-temperli-cam-inox',
    label: 'Siyah Temperli Cam · Fırçalı İnox · Krom',
    comboSummary: 'Ön Yüzey: Siyah Temperli Kristal Cam · Çerçeve/Kulp: Fırçalı İnox · Detay: Parlak Krom',
    materialKind: 'glass',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#14171D', roughness: 0.1, metalness: 0.14, partLabel: 'Siyah Temperli Cam' },
      secondary: { hex: '#C6CCD4', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Paslanmaz İnox' },
      accent: { hex: '#E0E5EC', roughness: 0.14, metalness: 0.96, partLabel: 'Krom Kulp & Kontrol Halkası' },
      glass: { hex: '#1B2028', opacity: 0.84, roughness: 0.05 },
    },
  }),
  makeFinish({
    id: 'tam-siyah-studioline-karbon',
    label: 'Tam Siyah (BlackSteel / studioLine) · Füme',
    comboSummary: 'Ön Yüzey: Parlak Siyah Cam · Kulp/Çerçeve: Fırçalı Siyah Çelik · Cam: Füme Reflekte',
    materialKind: 'glass',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#111318', roughness: 0.09, metalness: 0.16, partLabel: 'Siyah Kristal Cam' },
      secondary: { hex: '#282C34', roughness: 0.3, metalness: 0.86, partLabel: 'BlackSteel Fırçalı Çelik' },
      accent: { hex: '#4B525E', roughness: 0.26, metalness: 0.88, partLabel: 'Füme Metal Kulp' },
      glass: { hex: '#181C23', opacity: 0.88, roughness: 0.05 },
    },
  }),
  makeFinish({
    id: 'beyaz-kristal-cam-inox',
    label: 'Beyaz Kristal Cam · Fırçalı İnox · Siyah Ekran',
    comboSummary: 'Ön Yüzey: Parlak Beyaz Temperli Cam · Kulp/Şerit: Fırçalı İnox · Ekran: Siyah TFT',
    materialKind: 'glass',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#F2F4F7', roughness: 0.11, metalness: 0.06, partLabel: 'Beyaz Temperli Cam' },
      secondary: { hex: '#C9CFD7', roughness: 0.24, metalness: 0.9, partLabel: 'Fırçalı İnox Kulp' },
      accent: { hex: '#1E222A', roughness: 0.18, metalness: 0.25, partLabel: 'Siyah Dokunmatik Ekran' },
      glass: { hex: '#DCE3EB', opacity: 0.78, roughness: 0.05 },
    },
  }),
  makeFinish({
    id: 'fircali-inox-siyah-cam',
    label: 'Fırçalı Paslanmaz İnox · Siyah Cam',
    comboSummary: 'Gövde & Panel: Parmak İzi Bırakmayan İnox · Kapak Camı: Siyah Temperli · Kulp: İnox',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#C3C9D1', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Paslanmaz İnox' },
      secondary: { hex: '#181C22', roughness: 0.12, metalness: 0.18, partLabel: 'Siyah Temperli Cam' },
      accent: { hex: '#E2E7EE', roughness: 0.14, metalness: 0.96, partLabel: 'Krom Bar Kulp' },
      glass: { hex: '#1E232B', opacity: 0.82, roughness: 0.05 },
    },
  }),
  makeFinish({
    id: 'antrasit-gri-cam-bronz',
    label: 'Antrasit Gri Cam · Şampanya Bronz Çıta',
    comboSummary: 'Ön Yüzey: Antrasit Füme Cam · Kulp & Detay: Fırçalı Şampanya Bronz PVD',
    materialKind: 'glass',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#343942', roughness: 0.14, metalness: 0.22, partLabel: 'Antrasit Gri Cam' },
      secondary: { hex: '#262A31', roughness: 0.32, metalness: 0.78, partLabel: 'Mat Antrasit Gövde' },
      accent: { hex: '#B9945E', roughness: 0.24, metalness: 0.9, partLabel: 'Şampanya Bronz Kulp' },
      glass: { hex: '#2C313A', opacity: 0.84, roughness: 0.06 },
    },
  }),
];

const RUSTIC_ANKASTRE_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'vestel-rustik-krem-antik-pirinc',
    label: 'Rustik Fildişi Krem · Antik Pirinç Kulp',
    comboSummary: 'Gövde: Rustik Emaye Krem · Kulp, Saat Çerçevesi & Düğmeler: Antik Eskitme Pirinç',
    materialKind: 'ceramic',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#EFE6D5', roughness: 0.24, metalness: 0.06, partLabel: 'Rustik Fildişi Emaye' },
      secondary: { hex: '#222429', roughness: 0.14, metalness: 0.18, partLabel: 'Füme Fırın Camı & Döküm Izgara' },
      accent: { hex: '#B89048', roughness: 0.28, metalness: 0.9, partLabel: 'Antik Eskitme Pirinç' },
      glass: { hex: '#22262E', opacity: 0.82, roughness: 0.06 },
    },
  }),
  makeFinish({
    id: 'vestel-rustik-mat-siyah-pirinc',
    label: 'Rustik Antrasit Siyah · Antik Pirinç',
    comboSummary: 'Gövde: Mat Siyah Emaye · Kulp, Analog Saat & Düğmeler: Eskitme Pirinç',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#23262C', roughness: 0.34, metalness: 0.42, partLabel: 'Mat Siyah Emaye' },
      secondary: { hex: '#17191E', roughness: 0.14, metalness: 0.18, partLabel: 'Füme Temperli Cam' },
      accent: { hex: '#C29A52', roughness: 0.26, metalness: 0.92, partLabel: 'Antik Pirinç Kulp & Saat' },
      glass: { hex: '#1A1D24', opacity: 0.84, roughness: 0.06 },
    },
  }),
  makeFinish({
    id: 'vestel-rustik-beyaz-bakir',
    label: 'Rustik Saf Beyaz · Fırçalı Bakır',
    comboSummary: 'Gövde: Parlak Beyaz Emaye · Kulp & Düğmeler: Sıcak Fırçalı Bakır',
    materialKind: 'ceramic',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#F4F3EF', roughness: 0.2, metalness: 0.05, partLabel: 'Saf Beyaz Emaye' },
      secondary: { hex: '#2B2F37', roughness: 0.16, metalness: 0.16, partLabel: 'Fırın Camı & Döküm' },
      accent: { hex: '#B8724B', roughness: 0.26, metalness: 0.9, partLabel: 'Fırçalı Bakır Kulp' },
      glass: { hex: '#262A32', opacity: 0.8, roughness: 0.06 },
    },
  }),
  makeFinish({
    id: 'vestel-rustik-adacayi-pirinc',
    label: 'Country Adaçayı Yeşili · Pirinç',
    comboSummary: 'Gövde: Mat Adaçayı Emaye · Kulp & Analog Saat: Fırçalı Pirinç · Izgara: Döküm',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#7D9082', roughness: 0.32, metalness: 0.18, partLabel: 'Adaçayı Yeşili Emaye' },
      secondary: { hex: '#1F2329', roughness: 0.2, metalness: 0.22, partLabel: 'Siyah Cam & Döküm Izgara' },
      accent: { hex: '#C6A056', roughness: 0.26, metalness: 0.92, partLabel: 'Fırçalı Pirinç' },
      glass: { hex: '#1E2228', opacity: 0.82, roughness: 0.06 },
    },
  }),
  makeFinish({
    id: 'vestel-rustik-antrasit-krom',
    label: 'Rustik Grafit Gri · Saten Krom',
    comboSummary: 'Gövde: Mat Grafit Emaye · Kulp & Düğmeler: Saten Krom · Cam: Füme',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#434852', roughness: 0.34, metalness: 0.45, partLabel: 'Mat Grafit Emaye' },
      secondary: { hex: '#1C2026', roughness: 0.16, metalness: 0.2, partLabel: 'Füme Cam & Döküm' },
      accent: { hex: '#D3D9E2', roughness: 0.2, metalness: 0.94, partLabel: 'Saten Krom Kulp' },
      glass: { hex: '#20242B', opacity: 0.82, roughness: 0.06 },
    },
  }),
];

const HOB_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'schott-ceran-siyah-cam-dokum',
    label: 'Siyah Temperli / Seramik Cam · Mat Döküm',
    comboSummary: 'Yüzey: Schott Ceran / Temperli Siyah Cam · Izgara: Mat Döküm · Düğme: Fırçalı İnox',
    materialKind: 'glass',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#12151B', roughness: 0.08, metalness: 0.14, partLabel: 'Siyah Seramik / Temperli Cam' },
      secondary: { hex: '#25282F', roughness: 0.62, metalness: 0.55, partLabel: 'Mat Döküm Izgara & Brülör' },
      accent: { hex: '#CFD5DE', roughness: 0.22, metalness: 0.92, partLabel: 'Fırçalı İnox Çıta & Düğme' },
      glass: { hex: '#101318', opacity: 0.94, roughness: 0.04 },
    },
  }),
  makeFinish({
    id: 'siyah-cam-tam-siyah-metal',
    label: 'Tam Siyah Cam · Siyah Brülör & Çerçeve',
    comboSummary: 'Yüzey: Siyah Temperli Cam · Izgara & Çerçeve: Mat Siyah Döküm · Düğme: BlackSteel',
    materialKind: 'glass',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#101217', roughness: 0.08, metalness: 0.14, partLabel: 'Parlak Siyah Cam' },
      secondary: { hex: '#1E2127', roughness: 0.58, metalness: 0.6, partLabel: 'Mat Siyah Döküm' },
      accent: { hex: '#3B404A', roughness: 0.28, metalness: 0.84, partLabel: 'BlackSteel Çerçeve' },
      glass: { hex: '#111318', opacity: 0.95, roughness: 0.04 },
    },
  }),
  makeFinish({
    id: 'beyaz-cam-dokum-inox',
    label: 'Beyaz Temperli Cam · Mat Döküm · İnox',
    comboSummary: 'Yüzey: Parlak Beyaz Cam · Izgara: Siyah Döküm · Düğme & Çerçeve: Fırçalı İnox',
    materialKind: 'glass',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#F1F3F6', roughness: 0.1, metalness: 0.06, partLabel: 'Beyaz Temperli Cam' },
      secondary: { hex: '#24272E', roughness: 0.6, metalness: 0.55, partLabel: 'Mat Döküm Izgara' },
      accent: { hex: '#C8CED6', roughness: 0.22, metalness: 0.92, partLabel: 'Fırçalı İnox Düğme' },
      glass: { hex: '#EEF1F5', opacity: 0.92, roughness: 0.05 },
    },
  }),
  makeFinish({
    id: 'fircali-inox-dokum-ocak',
    label: 'Fırçalı Paslanmaz İnox · Ağır Döküm Izgara',
    comboSummary: 'Yüzey: AISI 304 Fırçalı İnox · Izgara: Ağır Döküm · Düğmeler: Paslanmaz Çelik',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#C6CCD4', roughness: 0.24, metalness: 0.92, partLabel: 'AISI 304 Fırçalı İnox' },
      secondary: { hex: '#23262C', roughness: 0.62, metalness: 0.58, partLabel: 'Ağır Döküm Izgara' },
      accent: { hex: '#DCE1E8', roughness: 0.16, metalness: 0.95, partLabel: 'Krom Düğme & Brülör' },
      glass: { hex: '#1A1E24', opacity: 0.9, roughness: 0.05 },
    },
  }),
  makeFinish({
    id: 'antrasit-cam-pirinc-brulor',
    label: 'Antrasit Cam · Siyah Döküm · Pirinç Wok',
    comboSummary: 'Yüzey: Füme Antrasit Cam · Izgara: Mat Döküm · Brülör & Düğme Detayı: Pirinç',
    materialKind: 'glass',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#2A2E36', roughness: 0.12, metalness: 0.2, partLabel: 'Antrasit Temperli Cam' },
      secondary: { hex: '#1E2127', roughness: 0.6, metalness: 0.58, partLabel: 'Mat Döküm Izgara' },
      accent: { hex: '#C6A056', roughness: 0.24, metalness: 0.92, partLabel: 'Pirinç Wok & Düğme' },
      glass: { hex: '#22262E', opacity: 0.92, roughness: 0.05 },
    },
  }),
];

const BUILTIN_FRIDGE_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'kasmir-lake-ankastre-kapak',
    label: 'Kaşmir Mat Lake Kapak · Fırçalı İnox İç',
    comboSummary: 'Ankastre Mobilya Kapağı: Kaşmir Mat Lake · Kulp & Baza Izgara: Fırçalı Siyah/İnox',
    materialKind: 'wood',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#D8CFC4', roughness: 0.34, metalness: 0.04, partLabel: 'Kaşmir Mat Lake Kapak' },
      secondary: { hex: '#262A31', roughness: 0.38, metalness: 0.65, partLabel: 'Baza Havalandırma & Kasa' },
      accent: { hex: '#C5CBD4', roughness: 0.22, metalness: 0.92, partLabel: 'Gömme İnox Kulp & Raf' },
      glass: { hex: '#D6E4F0', opacity: 0.45, roughness: 0.06 },
    },
  }),
  makeFinish({
    id: 'beyaz-lake-ankastre-kapak',
    label: 'İpek Mat Beyaz Lake · Krom Profil',
    comboSummary: 'Kapak: İpek Mat Beyaz Mutfak Dolabı · Baza & Kulp: Fırçalı Alüminyum',
    materialKind: 'wood',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#F3F4F6', roughness: 0.3, metalness: 0.03, partLabel: 'İpek Mat Beyaz Kapak' },
      secondary: { hex: '#CFD5DD', roughness: 0.26, metalness: 0.84, partLabel: 'Alüminyum Baza Izgara' },
      accent: { hex: '#DCE1E8', roughness: 0.18, metalness: 0.94, partLabel: 'Krom Profil Kulp' },
      glass: { hex: '#DCE9F5', opacity: 0.45, roughness: 0.06 },
    },
  }),
  makeFinish({
    id: 'antrasit-mat-ankastre-kapak',
    label: 'Mat Antrasit Lake · Füme Alüminyum',
    comboSummary: 'Kapak: RAL 7016 Mat Antrasit · Kulp & Havalandırma: Füme Eloksal Alüminyum',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#323740', roughness: 0.36, metalness: 0.14, partLabel: 'Mat Antrasit Kapak' },
      secondary: { hex: '#1E2229', roughness: 0.4, metalness: 0.62, partLabel: 'Siyah Baza Izgara' },
      accent: { hex: '#B89458', roughness: 0.24, metalness: 0.9, partLabel: 'Şampanya Pirinç Profil' },
      glass: { hex: '#CEDCE8', opacity: 0.45, roughness: 0.06 },
    },
  }),
  makeFinish({
    id: 'fircali-inox-ankastre-kule',
    label: 'Fırçalı Paslanmaz İnox · Siyah Şerit',
    comboSummary: 'Kapak: Parmak İzi Bırakmayan İnox · Baza & Kulp: Siyah Çelik & Krom Bar',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#C6CCD4', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı İnox Kapak' },
      secondary: { hex: '#23272F', roughness: 0.36, metalness: 0.72, partLabel: 'Mat Siyah Baza Izgara' },
      accent: { hex: '#E3E7EE', roughness: 0.14, metalness: 0.96, partLabel: 'Paslanmaz Bar Kulp' },
      glass: { hex: '#D4E2EE', opacity: 0.45, roughness: 0.06 },
    },
  }),
  makeFinish({
    id: 'ceviz-kaplama-ankastre-kule',
    label: 'Amerikan Ceviz Kaplama · Mat Siyah Profil',
    comboSummary: 'Kapak: Doğal Ceviz Kaplama · Kulp & Baza: Mat Siyah Eloksal',
    materialKind: 'wood',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#7A5236', roughness: 0.46, metalness: 0.04, partLabel: 'Amerikan Ceviz Kapak' },
      secondary: { hex: '#1E2127', roughness: 0.38, metalness: 0.75, partLabel: 'Mat Siyah Baza & Çerçeve' },
      accent: { hex: '#242830', roughness: 0.32, metalness: 0.85, partLabel: 'Mat Siyah Gömme Kulp' },
      glass: { hex: '#D6E4F0', opacity: 0.45, roughness: 0.06 },
    },
  }),
];

function createKitchenBuiltInAsset(cfg: {
  id: string;
  slug: string;
  name: string;
  brandStyle: string;
  archetype: AssetArchetype;
  placement: PlacementType;
  dimensionsCm: AssetDimensionsCm;
  polyEstimate: number;
  thumbnailFile: string;
  searchKeywords: string[];
  roomTags: string[];
  aiSummary: string;
  finishes: MaterialFinish[];
  defaultFinishId?: string;
  surfaceType: string;
  geometryBreakdown: string[];
  microDetails: string[];
  lightingTip: string;
}): ArchitecturalAsset {
  const { width, depth, height } = cfg.dimensionsCm;
  const defaultFinishId = cfg.defaultFinishId || cfg.finishes[0].id;
  const primaryFinish = cfg.finishes.find((f) => f.id === defaultFinishId) || cfg.finishes[0];

  return {
    id: cfg.id,
    slug: cfg.slug,
    name: cfg.name,
    brandStyle: cfg.brandStyle,
    category: 'Mutfak Ankastre',
    archetype: cfg.archetype,
    placement: cfg.placement,
    dimensionsCm: cfg.dimensionsCm,
    polyEstimate: cfg.polyEstimate,
    renderEngines: ['Cycles', 'EEVEE'],
    uvUnwrapped: true,
    thumbnailUrl: `/assets/turkish-gaps/${cfg.thumbnailFile}`,
    searchKeywords: [
      ...cfg.searchKeywords,
      'mutfak ankastre',
      'ankastre mutfak',
      'türkiye ankastre',
      '60 cm modül',
      'blender 3d',
    ],
    roomTags: cfg.roomTags,
    aiSummary: cfg.aiSummary,
    finishes: cfg.finishes,
    defaultFinishId,
    patterns: ARCHITECTURAL_PBR_PATTERNS,
    defaultPatternId: 'original_pbr',
    modelingSpec: {
      geometryBreakdown: [
        `Gerçek 1:1 Türkiye ankastre niş standardı: ${width} × ${depth} × ${height} cm.`,
        ...cfg.geometryBreakdown,
      ],
      textureAndMaps: {
        surfaceType: cfg.surfaceType,
        uvTileCm: '1:1 Gerçek Metrik UV + 512px TFT/Kontrol Paneli Canvas Decal',
        bumpDepthMm: '0.4 – 1.8 mm (Fırçalı İnox / Döküm Izgara Mikro Pürüz)',
        roughnessRange: '0.06 – 0.62 (Temperli Cam vs Fırçalı Çelik vs Mat Döküm)',
        shaderRecipe:
          'Principled BSDF: Temperli cam için Roughness 0.06 + IOR 1.52 + Coat Weight 0.6; Fırçalı inox için Metallic 0.92 + Anisotropic 0.65; Döküm ızgara için Roughness 0.62 + Metallic 0.55; LED/TFT ekran için Emission Strength 2.2.',
      },
      microDetails: cfg.microDetails,
      blenderModifiers: [
        'Bevel (Width: 1.5 mm, Segments: 2) tüm cam ve paslanmaz çelik kenarlarda gerçekçi ışık yansıması verir.',
        'WeightedNormal ile düz temperli cam yüzeylerde sıfır gölgelendirme bozulması sağlanır.',
      ],
      lightingAndCameraTip: cfg.lightingTip,
      aiRenderPrompt: `Photorealistic Turkish luxury kitchen interior Blender Cycles render featuring ${cfg.name} (${cfg.brandStyle}), exact dimensions ${width}x${depth}x${height}cm, primary tone ${primaryFinish.primaryHex}, authentic ${cfg.surfaceType}, warm under-cabinet 3000K LED strip reflections on tempered black glass and brushed stainless steel, architectural photography, 50mm lens, 8k.`,
      aiBlenderMasterPrompt: `Blender 4.x mutfak sahnesine "${cfg.name}" ankastre 3D modelini (1:1 metrik ${width}x${depth}x${height} cm) standart 60/75/90 cm dolap nişine sıfır toleransla yerleştir. "Mutfak Ankastre" koleksiyonuna ekle, temperli cam/inox/döküm Principled BSDF düğümlerini ve TFT/LED emisyon ekranını koruyarak Cycles GPU (AgX) ile render al.`,
    },
    modelSource: {
      provider: 'procedural',
      license: 'MimarKatalog Özel Türkiye Ankastre CAD',
    },
    sourceOrigin: 'catalog',
  };
}

export const TURKISH_KITCHEN_BUILTIN_ASSETS: ArchitecturalAsset[] = [
  // ── 1–3: 3'LÜ ANKASTRE SETLER (BOSCH SERIE 6 · SIEMENS IQ500 · VESTEL RUSTİK) ──
  createKitchenBuiltInAsset({
    id: 'tr-bosch-serie6-uclu-ankastre-set',
    slug: 'bosch-serie6-uclu-siyah-cam-ankastre-set',
    name: "Bosch Serie 6 3'lü Siyah Cam Ankastre Set (Fırın + Gazlı Cam Ocak + Eğimli Davlumbaz)",
    brandStyle: 'Bosch · Serie 6 (HBF534EB0T + POP6B6B10O + DWK65AD60R)',
    archetype: 'tr_bosch_ankastre_set_3',
    placement: 'floor',
    dimensionsCm: { width: 60, depth: 60, height: 185 },
    polyEstimate: 16800,
    thumbnailFile: 'bosch-serie6-uclu-ankastre-set.png',
    searchKeywords: [
      'bosch',
      'serie 6',
      'ankastre set',
      "3'lü ankastre set",
      'hbf534eb0t',
      'pop6b6b10o',
      'dwk65ad60r',
      'ankastre fırın',
      'gazlı cam ocak',
      'doğalgazlı ocak',
      'eğimli davlumbaz',
      'siyah cam set',
    ],
    roomTags: ['Mutfak', 'Açık Mutfak', 'Villa Mutfağı', 'Apartman Mutfağı'],
    aiSummary:
      "Türkiye'nin en çok tercih edilen Bosch Serie 6 3'lü siyah cam ankastre mutfak seti: 66 L 3D Hotair ankastre fırın (60×60 cm), döküm ızgaralı 4 gözlü doğalgazlı siyah cam ocak (POP6B6B10O) ve 65 cm montaj boşluklu eğimli siyah cam duvar davlumbazı tek mimari modülde.",
    finishes: MODERN_ANKASTRE_GLASS_FINISHES,
    defaultFinishId: 'siyah-temperli-cam-inox',
    surfaceType: 'Siyah Temperli Kristal Cam + Mat Döküm Izgara + Fırçalı Paslanmaz İnox + Kırmızı LED Kontrol',
    geometryBreakdown: [
      'Alt ünite: 60×60 cm Bosch Serie 6 ankastre fırın, gömme pop-out çevirme düğmeleri, kırmızı LED saat, 3 katlı temperli cam kapak ve paslanmaz kulp.',
      'Orta tezgah seviyesi (Y=90 cm): 59×52 cm POP6B6B10O 4 gözlü doğalgazlı siyah temperli cam ocak, mat döküm tekli ızgaralar ve yandan çevirmeli ateşleme düğmeleri.',
      'Üst ünite (Y=155 cm): 60 cm çift panelli eğimli siyah cam duvar davlumbazı, teleskopik inox baca ve 2 adet 3000K LED tezgah spotu.',
    ],
    microDetails: [
      'Fırın içinde 2 adet tel raf, derin emaye tepsi ve sıcak fırın iç aydınlatması yer alır.',
      'Ocak üzerinde 4 farklı çaplı gaz brülörü, döküm tencere destek ızgaraları ve sağ ön kontrol düğmeleri işlenmiştir.',
      'Davlumbaz alt yüzeyinde 2 adet 3000K LED aydınlatma ve yıkanabilir alüminyum yağ filtresi işlenmiştir.',
    ],
    lightingTip:
      'Mutfak cephesinde 45° yandan yumuşak gün ışığı ve tezgah altı 3000K şerit LED ile siyah temperli cam yüzeylerde keskin mimari yansımalar oluşturun.',
  }),

  createKitchenBuiltInAsset({
    id: 'tr-siemens-iq500-uclu-ankastre-set',
    slug: 'siemens-iq500-uclu-inox-cam-ankastre-set',
    name: "Siemens iQ500 3'lü İnox & Siyah Cam Ankastre Set (Fırın + FlexInduction Ocak + Eğimli Davlumbaz)",
    brandStyle: 'Siemens · iQ500 (HB517GBS0T + EX651FEB1E + LC67KHM60T)',
    archetype: 'tr_siemens_ankastre_set_3',
    placement: 'floor',
    dimensionsCm: { width: 60, depth: 60, height: 185 },
    polyEstimate: 17400,
    thumbnailFile: 'siemens-iq500-uclu-ankastre-set.png',
    searchKeywords: [
      'siemens',
      'iq500',
      'ankastre set',
      "3'lü ankastre set",
      'hb517gbs0t',
      'ex651feb1e',
      'lc67khm60t',
      'flexinduction',
      'ankastre fırın',
      'indüksiyon ocak',
      'davlumbaz',
    ],
    roomTags: ['Mutfak', 'Villa Mutfağı', 'Rezidans Mutfağı'],
    aiSummary:
      "Siemens iQ500 serisi Türkiye standardı 3'lü ankastre set: mavi/beyaz LCD ekranlı HB517GBS0T ankastre fırın, FlexZone özellikli EX651FEB1E 60 cm indüksiyon ocak ve LC67KHM60T eğimli cam duvar davlumbazı.",
    finishes: MODERN_ANKASTRE_GLASS_FINISHES,
    defaultFinishId: 'fircali-inox-siyah-cam',
    surfaceType: 'Fırçalı İnox + Siyah Kristal Cam + Mavi/Beyaz Siemens LCD',
    geometryBreakdown: [
      'Alt ünite: Siemens iQ500 60×60 cm fırın, fırçalı inox üst bant, mavi/beyaz dijital LCD ve tam boy siyah cam kapak.',
      'Orta seviye: 60.2×52.2 cm FlexInduction ocak, yan alüminyum profil çıtaları ve dual lightSlider kontrol bandı.',
      'Üst ünite: Siemens LC67KHM60T 60 cm eğimli cam davlumbaz, mavi LED touchControl ve fırçalı inox teleskopik baca.',
    ],
    microDetails: [
      'Siemens iQ500 imza mavi-beyaz TFT ekran kontrastı ve fırçalı paslanmaz çelik şeritler.',
      'FlexInduction sol bölgede dikdörtgen birleştirilebilir tencere alanı serigrafisi.',
      'Fırın kapak tutamağı keskin dikdörtgen Siemens profil kesitindedir.',
    ],
    lightingTip:
      'Fırçalı inox ve koyu cam kontrastını vurgulamak için soğuk 5200K pencere dolgu ışığıyla 3000K tezgah aydınlatmasını dengeleyin.',
  }),

  createKitchenBuiltInAsset({
    id: 'tr-vestel-rustik-uclu-ankastre-set',
    slug: 'vestel-rustik-krem-pirinc-uclu-ankastre-set',
    name: "Vestel Rustik Krem & Antik Pirinç 3'lü Ankastre Set (Fırın + Gazlı Ocak + Piramit Davlumbaz)",
    brandStyle: 'Vestel · Rustik Country (AF-8784 + AO-6104 + AD-63321)',
    archetype: 'tr_vestel_rustik_set_3',
    placement: 'floor',
    dimensionsCm: { width: 60, depth: 60, height: 185 },
    polyEstimate: 18200,
    thumbnailFile: 'vestel-rustik-uclu-ankastre-set.png',
    searchKeywords: [
      'vestel',
      'rustik ankastre set',
      'country mutfak',
      'krem ankastre set',
      'pirinç kulp',
      'af-8784',
      'ao-6104',
      'ad-63321',
      'gazlı ocak',
      'piramit davlumbaz',
      'retro fırın',
    ],
    roomTags: ['Mutfak', 'Country Mutfak', 'Villa Mutfağı', 'Klasik Mutfak'],
    aiSummary:
      "Türkiye'de country ve neo-klasik mutfakların en çok satan Vestel Rustik 3'lü ankastre seti: analog saatli krem fırın, döküm ızgaralı 4 gözlü gazlı ocak ve antik pirinç raylı piramit rustik davlumbaz.",
    finishes: RUSTIC_ANKASTRE_FINISHES,
    defaultFinishId: 'vestel-rustik-krem-antik-pirinc',
    surfaceType: 'Krem Emaye Kaplama + Antik Pirinç Kulp & Analog Saat + Ağır Döküm Izgara',
    geometryBreakdown: [
      'Alt ünite: 60×60 cm Vestel Rustik fırın, merkezde Roma rakamlı analog saat, antik pirinç çevirme düğmeleri ve kemerli kapak camı.',
      'Orta seviye: 60 cm 4 gözlü gazlı krem emaye ocak, mat siyah döküm çapraz ızgaralar ve antik pirinç önden düğmeler.',
      'Üst ünite: 60 cm piramit formlu rustik davlumbaz, ön kenarda antik pirinç askı borusu ve mekanik basmalı tuşlar.',
    ],
    microDetails: [
      'Analog fırın saati çerçevesi pirinç halka ve akrep-yelkovan detayıyla CanvasTexture üzerinden çizilir.',
      'Davlumbaz ön dudağında klasik Vestel Rustik pirinç kulp borusu yer alır.',
      '4 gaz brülörü farklı çaplarda (küçük, 2×orta, büyük/wok) döküm tencere destekli modellenmiştir.',
    ],
    lightingTip:
      'Country ve ahşap çerçeveli mutfak dolaplarıyla birlikte sıcak 3200K gün batımı ışığı antik pirinç detayları parlatır.',
  }),

  // ── 4–7: ANKASTRE FIRIN & MİKRODALGA ──
  createKitchenBuiltInAsset({
    id: 'tr-bosch-serie8-ankastre-firin',
    slug: 'bosch-serie8-dokunmatik-halkali-ankastre-firin',
    name: 'Bosch Serie 8 Home Connect Dokunmatik Halkalı Ankastre Fırın (HBG675BB1 · 60×60 cm)',
    brandStyle: 'Bosch · Serie 8 (HBG675BB1 · 71 L · 4D Hotair)',
    archetype: 'tr_bosch_serie8_oven',
    placement: 'floor',
    dimensionsCm: { width: 59.5, depth: 55, height: 59.5 },
    polyEstimate: 9400,
    thumbnailFile: 'bosch-serie8-ankastre-firin.png',
    searchKeywords: [
      'bosch',
      'serie 8',
      'ankastre fırın',
      'hbg675bb1',
      'home connect',
      '4d hotair',
      'siyah cam fırın',
      '60 cm fırın',
      'pirolitik fırın',
    ],
    roomTags: ['Mutfak', 'Villa Mutfağı', 'Boy Dolap'],
    aiSummary:
      'Bosch Serie 8 amiral gemisi 71 litrelik 60×60 cm ankastre fırın: ortada ikonik paslanmaz dijital kontrol halkası (ControlRing), renkli TFT ekran, tam boy siyah kristal cam kapak ve teleskopik iç raflar.',
    finishes: MODERN_ANKASTRE_GLASS_FINISHES,
    defaultFinishId: 'siyah-temperli-cam-inox',
    surfaceType: 'Siyah Temperli Kristal Cam + Paslanmaz Kontrol Halkası + TFT Ekran',
    geometryBreakdown: [
      'Standart 59.5×59.5×54.8 cm niş gövdesi ve 2.4 cm kalınlığında çift katmanlı kristal cam ön panel.',
      'Üst kontrol şeridinde merkezde dönen paslanmaz çelik ControlRing halkası ve yanında parlak TFT sıcaklık/program göstergesi.',
      'İç haznede 2 adet krom tel raf, derin tepsi, arka konveksiyon fanı ve sıcak 2700K halojen iç ışık.',
    ],
    microDetails: [
      'Üst cam şeritte yüksek çözünürlüklü Bosch Serie 8 TFT arayüz ve 180°C 4D Hotair göstergesi.',
      'SoftClose menteşeli düz silindirik paslanmaz çelik kulp ve pahlı ayak bağlantıları.',
    ],
    lightingTip:
      'Boy dolap nişinde gömülü yerleştirildiğinde fırın içi sıcak halojen ışık dış camdan hafifçe sızarak sahneye yaşam katar.',
  }),

  createKitchenBuiltInAsset({
    id: 'tr-siemens-iq700-ankastre-firin',
    slug: 'siemens-iq700-studioline-tft-ankastre-firin',
    name: 'Siemens iQ700 studioLine TFT Ekranlı Ankastre Fırın (HB676G0S1 · 60×60 cm)',
    brandStyle: 'Siemens · iQ700 studioLine (HB676G0S1 · 71 L)',
    archetype: 'tr_siemens_iq700_oven',
    placement: 'floor',
    dimensionsCm: { width: 59.5, depth: 55, height: 59.5 },
    polyEstimate: 9600,
    thumbnailFile: 'siemens-iq700-ankastre-firin.png',
    searchKeywords: [
      'siemens',
      'iq700',
      'studioline',
      'ankastre fırın',
      'hb676g0s1',
      'tft ekran',
      'blacksteel',
      '60 cm fırın',
    ],
    roomTags: ['Mutfak', 'Villa Mutfağı', 'Modern Mutfak'],
    aiSummary:
      'Siemens iQ700 studioLine serisi üst segment 60×60 cm ankastre fırın: blackSteel koyu fırçalı çelik kulp, geniş mavi-beyaz TFT dokunmatik ekran, koyu füme cam ve 71 L pirolitik iç hazne.',
    finishes: MODERN_ANKASTRE_GLASS_FINISHES,
    defaultFinishId: 'tam-siyah-studioline-karbon',
    surfaceType: 'BlackSteel Fırçalı Çelik + Füme Kristal Cam + Siemens Mavi TFT',
    geometryBreakdown: [
      '59.5×59.5 cm studioLine sıfır derzli ön cam cephe ve üst-alt ince blackSteel dekor şeritleri.',
      'Merkezde geniş dokunmatik TFT ekran, tek merkezi hassas çevirme kadranı ve mavi LED durum göstergeleri.',
      'Keskin dikdörtgen kesitli blackSteel kulp ve 3 kademeli teleskopik krom raf sistemi.',
    ],
    microDetails: [
      'Siemens iQ700 mavi-beyaz UI grafikleri ve keskin Alman endüstriyel tasarım oranları.',
      'Alt ve üst havalandırma yarıkları ile gerçekçi fırın kapak boşluğu.',
    ],
    lightingTip:
      'Mat antrasit veya ceviz boy dolap nişinde, studioLine koyu çelik kulp kenarlarına 35° üstten gelen yumuşak rim ışığı verin.',
  }),

  createKitchenBuiltInAsset({
    id: 'tr-vestel-af8784-ankastre-firin',
    slug: 'vestel-af8784-rustik-dijital-ankastre-firin',
    name: 'Vestel AF-8784 Rustik & Retro Analog Saatli Ankastre Fırın (60×60 cm · 78 L)',
    brandStyle: 'Vestel · Rustik / AF-8784 (78 L · 9 Program)',
    archetype: 'tr_vestel_builtin_oven',
    placement: 'floor',
    dimensionsCm: { width: 59.5, depth: 56, height: 59.5 },
    polyEstimate: 9200,
    thumbnailFile: 'vestel-af8784-ankastre-firin.png',
    searchKeywords: [
      'vestel',
      'af-8784',
      'af-5661',
      'rustik fırın',
      'ankastre fırın',
      'krem fırın',
      'country fırın',
      'yerli ankastre',
    ],
    roomTags: ['Mutfak', 'Country Mutfak', 'Apartman Mutfağı', 'Villa Mutfağı'],
    aiSummary:
      "Vestel'in Manisa tesislerinde ürettiği 78 litre geniş hacimli AF-8784 Rustik ankastre fırın: krem emaye ön cephe, antik pirinç analog saat, pirinç kavisli kulp ve çift döner mekanik kontrol düğmeleri.",
    finishes: RUSTIC_ANKASTRE_FINISHES,
    defaultFinishId: 'vestel-rustik-krem-antik-pirinc',
    surfaceType: 'Krem Emaye Kaplama + Antik Pirinç Kulp & Analog Saat',
    geometryBreakdown: [
      '59.5×59.5 cm krem emaye ön çerçeve ve kemerli köşeli çift cam fırın izleme penceresi.',
      'Üst kontrol bandında 2 adet antik pirinç program/sıcaklık düğmesi ve ortada pirinç çerçeveli analog saat.',
      'Klasik kavisli antik pirinç kulp ve geniş 78 L emaye iç hazne.',
    ],
    microDetails: [
      'Roma rakamlı krem kadranlı analog saat CanvasTexture ile yüksek keskinlikte işlenir.',
      'Pirinç düğme çevrelerinde sıcaklık derece işaretleri bulunur.',
    ],
    lightingTip:
      'Çerçeveli (shaker) krem veya adaçayı mutfak dolaplarıyla sıcak gün ışığında ideal renk uyumu sağlar.',
  }),

  createKitchenBuiltInAsset({
    id: 'tr-bosch-siemens-ankastre-mikrodalga',
    slug: 'bosch-siemens-cerceveli-ankastre-mikrodalga-firin',
    name: 'Bosch Serie 6 / Siemens iQ500 Çerçeveli Ankastre Mikrodalga Fırın (60×38 cm · 25 L)',
    brandStyle: 'Bosch / Siemens · BFL524MB0 / BF525LMS0 (60×38 cm)',
    archetype: 'tr_builtin_microwave',
    placement: 'wall-mounted',
    dimensionsCm: { width: 59.5, depth: 39, height: 38.2, mountHeight: 145 },
    polyEstimate: 7400,
    thumbnailFile: 'bosch-siemens-ankastre-mikrodalga.png',
    searchKeywords: [
      'ankastre mikrodalga',
      'mikrodalga fırın',
      'bosch bfl524mb0',
      'siemens bf525lms0',
      '60x38 mikrodalga',
      'boy dolap mikrodalga',
      'ankastre kule',
    ],
    roomTags: ['Mutfak', 'Boy Dolap', 'Villa Mutfağı'],
    aiSummary:
      'Türkiye ankastre boy dolap kulelerinde 60×60 cm fırının hemen üzerine monte edilen standart 59.5×38.2 cm çerçeveli ankastre mikrodalga: tam boy siyah cam, dokunmatik kapı açma butonu, LED zamanlayıcı ve cam döner tabla.',
    finishes: MODERN_ANKASTRE_GLASS_FINISHES,
    defaultFinishId: 'siyah-temperli-cam-inox',
    surfaceType: 'Siyah Temperli Cam + İnox Çerçeve + LED Zamanlayıcı',
    geometryBreakdown: [
      '59.5×38.2×38.8 cm gömme niş kasası ve çevresinde sıfır oturan 2.2 cm ankastre montaj çerçevesi.',
      'Sol yanda menteşeli füme izleme camı, sağda dokunmatik kontrol şeridi, kırmızı/beyaz dijital saat ve elektrikli kapak açma düğmesi.',
      'İç paslanmaz haznede Ø25.5 cm cam döner tabla ve mikro dalga ızgara detayı.',
    ],
    microDetails: [
      'Altındaki 60×60 cm Bosch/Siemens ankastre fırınla birebir hizalanan 59.5 cm dış genişlik.',
      'Sağ panelde AutoPilot program simgeleri ve 900W güç göstergesi.',
    ],
    lightingTip:
      'Boy dolap kulesinde fırın ile mikrodalga arasına 2 cm koyu gölge derzi bırakarak gerçekçi ankastre hizalama elde edin.',
  }),

  // ── 8–11: İNDÜKSİYON & GAZLI ANKASTRE OCAKLAR ──
  createKitchenBuiltInAsset({
    id: 'tr-bosch-pue611-induksiyon-ocak',
    slug: 'bosch-siemens-60cm-flexinduction-cam-ocak',
    name: 'Bosch Serie 4 / Siemens iQ500 60 cm 4 Gözlü FlexInduction Cam Ocak (PUE611BB5E)',
    brandStyle: 'Bosch / Siemens · PUE611BB5E / EX651FEB1E (60×52 cm)',
    archetype: 'tr_induction_hob_60',
    placement: 'floor',
    dimensionsCm: { width: 60, depth: 52, height: 5.5 },
    polyEstimate: 5600,
    thumbnailFile: 'bosch-pue611-induksiyon-ocak.png',
    searchKeywords: [
      'indüksiyon ocak',
      'bosch pue611bb5e',
      'siemens ex651feb1e',
      '60 cm ocak',
      'elektrikli cam ocak',
      'schott ceran',
      'flexinduction',
      'ankastre ocak',
    ],
    roomTags: ['Mutfak', 'Mutfak Adası', 'Villa Mutfağı'],
    aiSummary:
      '60×52 cm Schott Ceran siyah vitroseramik camlı 4 gözlü indüksiyon ankastre ocak: keskin pahlı cam kenar, yan inox koruma çıtaları, FlexZone tencere grafikleri ve kırmızı LED DirectSelect dokunmatik kaydırıcı.',
    finishes: HOB_FINISHES,
    defaultFinishId: 'schott-ceran-siyah-cam-dokum',
    surfaceType: 'Schott Ceran Siyah Vitroseramik Cam + Yan İnox Çıta + Kırmızı LED',
    geometryBreakdown: [
      '59.2×52.2×5.1 cm tezgaha sıfır/yarı gömme kasa ve 4 mm kalınlığında pahlı siyah seramik cam tabla.',
      'Sol tarafta FlexInduction birleştirilebilir 2 bölge, sağda 21 cm ve 14.5 cm yuvarlak pişirme bölgeleri.',
      'Ön şeritte ışıklı kırmızı 1-9 güç kademesi DirectSelect dokunmatik kontrol bandı.',
    ],
    microDetails: [
      '1024×1024 yüksek çözünürlüklü CanvasTexture üzerinde net beyaz serigrafi halkaları, PowerBoost simgeleri ve kırmızı LED rakamlar.',
      'Sağ ve sol kenarlarda 6 mm fırçalı paslanmaz çelik darbe koruma profilleri.',
    ],
    lightingTip:
      'Tezgah üstü yakın planlarda 25° alçak kamera açısıyla cam yüzeydeki tavan/spot yansımalarını ve kırmızı LED dokunmatik bandı öne çıkarın.',
  }),

  createKitchenBuiltInAsset({
    id: 'tr-siemens-pop6-gazli-cam-ocak',
    slug: 'bosch-arcelik-60cm-4gozlu-dokum-izgarali-cam-gazli-ocak',
    name: 'Bosch POP6B6B10O / Arçelik 60 cm 4 Gözlü Döküm Izgaralı Siyah Cam Gazlı Ocak',
    brandStyle: 'Bosch / Arçelik · POP6B6B10O / OCD T 651 (60×52 cm)',
    archetype: 'tr_gas_glass_hob_60',
    placement: 'floor',
    dimensionsCm: { width: 60, depth: 52, height: 10 },
    polyEstimate: 11200,
    thumbnailFile: 'bosch-arcelik-60cm-gazli-cam-ocak.png',
    searchKeywords: [
      'gazlı ocak',
      '4 gözlü ocak',
      'cam ocak',
      'döküm ızgaralı ocak',
      'bosch pop6b6b10o',
      'arçelik ocd t 651',
      'doğalgazlı ocak',
      'ankastre ocak',
    ],
    roomTags: ['Mutfak', 'Apartman Mutfağı', 'Villa Mutfağı'],
    aiSummary:
      "Türkiye konut mutfaklarının %80'inde kullanılan 60 cm 4 gözü gazlı siyah temperli cam ankastre ocak: ağır mat döküm tencere ızgaraları, 4 farklı çaplı gaz brülörü, ateşleme bujileri ve önden ergonomik metal düğmeler.",
    finishes: HOB_FINISHES,
    defaultFinishId: 'schott-ceran-siyah-cam-dokum',
    surfaceType: '8 mm Temperli Siyah Cam + Ağır Mat Döküm Izgara + Fırçalı Metal Düğme',
    geometryBreakdown: [
      '59×52 cm 8 mm kalınlığında temperli cam tabla ve tezgah altı sızdırmazlık kasası.',
      '4 adet gerçekçi Sabaf tipi gaz brülör yuvası (1 küçük, 2 orta, 1 büyük hızlı göz), termokupl ve buji pimleri.',
      '4 adet çok kollu ağır mat döküm ızgara ve ön kenarda 4 adet ergonomik silindirik gaz düğmesi.',
    ],
    microDetails: [
      'Her brülörde alüminyum gövde + mat siyah emaye alev şapkası çift malzeme katmanı.',
      'Döküm tencere ayakları cam yüzeyden 3 mm yüksekte kauçuk tamponlarla oturur.',
    ],
    lightingTip:
      'Mat döküm ızgaralar (Roughness 0.62) ile parlak temperli cam (Roughness 0.08) arasındaki keskin kontrast yakın çekimde yüksek fotorealizm sunar.',
  }),

  createKitchenBuiltInAsset({
    id: 'tr-franke-5goz-wok-gazli-ocak-75',
    slug: 'franke-siemens-75cm-5gozlu-wok-gazli-villa-ocagi',
    name: 'Franke Maris / Siemens 75 cm 5 Gözlü Wok Brülörlü Ankastre Gazlı Ocak',
    brandStyle: 'Franke / Siemens · Maris 75 cm / EO7B6PB10O (5 Göz + Wok)',
    archetype: 'tr_wok_gas_hob_75',
    placement: 'floor',
    dimensionsCm: { width: 75, depth: 52, height: 10.5 },
    polyEstimate: 14600,
    thumbnailFile: 'franke-75cm-5goz-wok-gazli-ocak.png',
    searchKeywords: [
      '5 gözlü ocak',
      'wok ocak',
      '75 cm ocak',
      'franke ocak',
      'siemens 75 cm',
      'villa ocağı',
      'döküm ızgaralı',
      'gazlı ankastre ocak',
    ],
    roomTags: ['Villa Mutfağı', 'Geniş Mutfak', 'Mutfak Adası'],
    aiSummary:
      'Geniş apartman ve villa mutfakları için 75 cm 5 gözlü profesyonel ankastre gazlı ocak: merkezde yüksek güçlü çift halkalı Wok brülörü, 3 parçalı kesintisiz ağır döküm ızgara ve 5 adet ön fırçalı metal düğme.',
    finishes: HOB_FINISHES,
    defaultFinishId: 'antrasit-cam-pirinc-brulor',
    surfaceType: 'Temperli Cam / İnox + 3 Parçalı Ağır Döküm Izgara + Çift Halkalı Wok Brülör',
    geometryBreakdown: [
      '75×52 cm geniş ankastre tabla ve pahlı temperli cam/paslanmaz çelik gövde.',
      'Merkezde 4.0 kW çift halkalı büyük Wok brülörü + 4 köşede yardımcı ve hızlı gaz brülörleri.',
      '3 parçalı kesintisiz ağır döküm tencere ızgarası ve ön sırada 5 adet hassas kademeli kontrol düğmesi.',
    ],
    microDetails: [
      'Merkez Wok brülöründe iç ve dış çift alev halkası ve özel döküm Wok destek tacı bulunur.',
      '90 cm geniş ada veya duvar davlumbazları ile birebir oranlıdır.',
    ],
    lightingTip:
      '75 cm ocağı 90 cm ada/duvar davlumbazı altına ortalayarak mermer tezgah damarlarıyla üst düzey villa mutfağı kadrajı yakalayın.',
  }),

  createKitchenBuiltInAsset({
    id: 'tr-siemens-davlumbazli-induksiyon-ocak',
    slug: 'siemens-bosch-80cm-davlumbazli-downdraft-induksiyon-ocak',
    name: 'Siemens iQ700 / Bosch Serie 8 Entegre Davlumbazlı (Downdraft) İndüksiyon Ocak (80 cm)',
    brandStyle: 'Siemens / Bosch · ED851FQ15E / PVQ811F15E (80×52 cm)',
    archetype: 'tr_downdraft_induction_hob',
    placement: 'floor',
    dimensionsCm: { width: 80, depth: 52, height: 22 },
    polyEstimate: 8800,
    thumbnailFile: 'siemens-davlumbazli-induksiyon-ocak.png',
    searchKeywords: [
      'davlumbazlı ocak',
      'kendinden davlumbazlı ocak',
      'downdraft ocak',
      'ada mutfak ocağı',
      'siemens iq700',
      'bosch serie 8',
      '80 cm indüksiyon',
      'bora tipi ocak',
    ],
    roomTags: ['Mutfak Adası', 'Villa Mutfağı', 'Açık Mutfak'],
    aiSummary:
      'Tavan davlumbazına gerek bırakmayan modern villa ada mutfaklarının gözdesi 80 cm kendinden davlumbazlı indüksiyon ocak: ortada sıfır entegre döküm/cam hava emiş ızgarası, iki yanda CombiZone indüksiyon alanları ve tezgah altı motor kutusu.',
    finishes: HOB_FINISHES,
    defaultFinishId: 'siyah-cam-tam-siyah-metal',
    surfaceType: 'Schott Ceran Siyah Seramik Cam + Sıfır Entegre Emiş Izgarası',
    geometryBreakdown: [
      '80.2×52.2 cm sıfır çerçevesiz siyah vitroseramik cam üst yüzey ve 22 cm derinlikli tezgah altı emiş motor kutusu.',
      'Merkezde dikey kanatlı döküm/cam hava emiş kanalı (downdraft ızgara) ve çıkarılabilir yağ toplama haznesi.',
      'Sağ ve solda 2+2 CombiInduction bölge serigrafisi ve ön merkezde touchSlider + fan hız kontrol bandı.',
    ],
    microDetails: [
      'Merkez emiş ızgarası ince paralel kanatçıklar ve koyu iç filtre derinliğiyle 3 boyutlu işlenmiştir.',
      'Ada mutfakta tavan görüşünü %100 açık bırakan ultra minimalist villa detayı.',
    ],
    lightingTip:
      'Mutfak adasında doğrudan üzerine lineer küre avize yerleştirebilirsiniz; davlumbazsız açık görüş hattı modern villa renderlarının imza kompozisyonudur.',
  }),

  // ── 12–14: EĞİMLİ CAM, ADA & GÖMME DAVLUMBAZLAR ──
  createKitchenBuiltInAsset({
    id: 'tr-silverline-egimli-cam-davlumbaz',
    slug: 'silverline-bosch-60cm-egimli-cam-duvar-davlumbazi',
    name: 'Silverline / Bosch Serie 4 60 cm Eğimli Temperli Cam Duvar Davlumbazı (DWK65AD60R)',
    brandStyle: 'Silverline / Bosch · 3480 / DWK65AD60R (60 cm · 650 m³/h)',
    archetype: 'tr_angled_glass_hood',
    placement: 'wall-mounted',
    dimensionsCm: { width: 60, depth: 39, height: 86, mountHeight: 155 },
    polyEstimate: 7800,
    thumbnailFile: 'silverline-egimli-cam-davlumbaz.png',
    searchKeywords: [
      'eğimli davlumbaz',
      'cam davlumbaz',
      'silverline davlumbaz',
      'bosch dwk65ad60r',
      '60 cm davlumbaz',
      'duvar tipi davlumbaz',
      'ankastre davlumbaz',
    ],
    roomTags: ['Mutfak', 'Apartman Mutfağı', 'Villa Mutfağı'],
    aiSummary:
      "Türkiye mutfaklarında en çok satılan 60 cm dikey/eğimli temperli cam duvar davlumbazı: çift katlı siyah cam ön kapak, 3 kademeli dokunmatik kontrol ekranı, 2×2W 3000K LED tezgah aydınlatması ve teleskopik paslanmaz baca.",
    finishes: MODERN_ANKASTRE_GLASS_FINISHES,
    defaultFinishId: 'siyah-temperli-cam-inox',
    surfaceType: 'Çift Katlı Eğimli Temperli Cam + Teleskopik Çelik Baca + LED Spot',
    geometryBreakdown: [
      '60 cm genişliğinde 35° eğimli çift katlı temperli cam ön emiş paneli (baş çarpmasını önleyen ergonomik geometri).',
      'Üstte tavana uzanan teleskopik dikdörtgen baca kılıfı (24×22 cm) ve arka duvar montaj şasisi.',
      'Alt yüzeyde 2 adet 3000K sıcak LED spot ve gizli kaset alüminyum yağ filtresi.',
    ],
    microDetails: [
      'Ön cam üzerinde beyaz LED dokunmatik hız kademe (1-2-3-Boost) ve ışık açma simgeleri.',
      'Çift cam kanat arasında gerçek 1.8 cm çevresel hava emiş (perimeter suction) boşluğu.',
    ],
    lightingTip:
      'Davlumbaz altındaki 2 adet LED spotu Blender sahnesinde 3000K Spot Light ile destekleyerek ocağın üzerine sıcak ışık havuzu düşürün.',
  }),

  createKitchenBuiltInAsset({
    id: 'tr-franke-t-tipi-ada-davlumbaz-90',
    slug: 'franke-silverline-90cm-t-tipi-tavan-ada-davlumbazi',
    name: 'Franke Mythos / Silverline 90 cm T-Tipi Tavan Ada Davlumbazı (750 m³/h)',
    brandStyle: 'Franke / Silverline · Mythos / 3466 Ada (90×60 cm)',
    archetype: 'tr_island_t_hood_90',
    placement: 'ceiling',
    dimensionsCm: { width: 90, depth: 60, height: 92, mountHeight: 162 },
    polyEstimate: 9400,
    thumbnailFile: 'franke-90cm-t-tipi-ada-davlumbaz.png',
    searchKeywords: [
      'ada davlumbaz',
      'tavan tipi davlumbaz',
      '90 cm davlumbaz',
      't tipi davlumbaz',
      'franke davlumbaz',
      'silverline ada',
      'villa mutfak adası',
    ],
    roomTags: ['Mutfak Adası', 'Villa Mutfağı', 'Açık Mutfak'],
    aiSummary:
      'Geniş villa mutfak adaları için 90×60 cm T-tipi tavan tipi ada davlumbazı: 4 yandan erişimli ultra ince paslanmaz çelik / siyah kutu gövde, teleskopik tavan bacası, 3 adet yıkanabilir alüminyum yağ filtresi ve 4 köşe LED spot.',
    finishes: MODERN_ANKASTRE_GLASS_FINISHES,
    defaultFinishId: 'fircali-inox-siyah-cam',
    surfaceType: 'Fırçalı AISI 304 İnox + Siyah Dokunmatik Şerit + 3× Alüminyum Kaset Filtre',
    geometryBreakdown: [
      '90×60×6.5 cm ultra ince T-tipi yatay emiş tablası ve merkezde tavan montajlı 32×26 cm teleskopik baca.',
      'Alt yüzeyde 3 adet gömme kanallı alüminyum yağ filtresi kaseti ve 4 köşede sıcak 3000K LED aydınlatma spotu.',
      'Ön dar yüzde siyah cam şerit içine entegre dokunmatik kontrol ekranı.',
    ],
    microDetails: [
      'Alt yağ filtrelerinde ince ızgara doku ve mandallı kilit detayları.',
      'Tavan bağlantı noktasında temiz alçıpan kapama rozeti yer alır.',
    ],
    lightingTip:
      '75 cm veya 90 cm ada ocağının tam üzerinde, tabandan 160–165 cm yükseklikte konumlandırın.',
  }),

  createKitchenBuiltInAsset({
    id: 'tr-teka-silverline-gomme-davlumbaz',
    slug: 'teka-silverline-60cm-dolap-ici-gizli-gomme-davlumbaz',
    name: 'Teka / Silverline 60 cm Dolap İçi Gizli Gömme Ankastre Davlumbaz (620 m³/h)',
    brandStyle: 'Teka / Silverline · GFG2 / 3380 Gömme (60×29 cm)',
    archetype: 'tr_recessed_cabinet_hood',
    placement: 'wall-mounted',
    dimensionsCm: { width: 60, depth: 29, height: 28, mountHeight: 155 },
    polyEstimate: 6400,
    thumbnailFile: 'teka-silverline-gomme-davlumbaz.png',
    searchKeywords: [
      'gömme davlumbaz',
      'gizli davlumbaz',
      'dolap içi davlumbaz',
      'ankastre aspiratör',
      'teka davlumbaz',
      'silverline gömme',
      '60 cm gömme',
    ],
    roomTags: ['Mutfak', 'Minimalist Mutfak', 'Apartman Mutfağı'],
    aiSummary:
      'Minimalist ve kesintisiz üst dolap cepheli modern Türk mutfaklarının vazgeçilmezi 60 cm dolap içi gizli gömme ankastre davlumbaz: sıfır paslanmaz/siyah alt çerçeve, çift alüminyum filtre, LED ışık barı ve üst motor ünitesi.',
    finishes: MODERN_ANKASTRE_GLASS_FINISHES,
    defaultFinishId: 'tam-siyah-studioline-karbon',
    surfaceType: 'Mat Siyah / İnox Alt Çerçeve + Çift Alüminyum Filtre + Lineer LED Bar',
    geometryBreakdown: [
      '60×29 cm üst dolap altına sıfır oturan ince flanş çerçevesi ve üstte dolap içine gizlenen 24 cm motor/baca kasası.',
      'Alt yüzeyde 2 adet alüminyum kaset filtre, ön kenarda kapasitif dokunmatik hız şeridi ve boydan boya 3000K lineer LED aydınlatma.',
    ],
    microDetails: [
      'Üst dolap altıyla aynı hizada durduğu için düz lake veya ahşap mutfak çizgisini hiç bölmez.',
      'Üst çıkışta Ø150 mm standart dairesel baca bağlantı flanşı bulunur.',
    ],
    lightingTip:
      'Lineer LED barı tezgah seramik/mermer backsplash yüzeyinde kesintisiz yumuşak yıkama ışığı üretir.',
  }),

  // ── 15–16: ANKASTRE KAHVE MAKİNESİ & TAM ANKASTRE BUZDOLABI KULESİ ──
  createKitchenBuiltInAsset({
    id: 'tr-siemens-bosch-ankastre-kahve-makinesi',
    slug: 'siemens-bosch-60x45-tam-otomatik-ankastre-kahve-makinesi',
    name: 'Siemens iQ700 / Bosch Serie 8 Tam Otomatik Ankastre Kahve Makinesi (60×45 cm)',
    brandStyle: 'Siemens / Bosch · CT636LES1 / CTL636EB6 (60×45.5 cm)',
    archetype: 'tr_builtin_coffee_machine',
    placement: 'wall-mounted',
    dimensionsCm: { width: 59.5, depth: 38, height: 45.5, mountHeight: 135 },
    polyEstimate: 10400,
    thumbnailFile: 'siemens-bosch-ankastre-kahve-makinesi.png',
    searchKeywords: [
      'ankastre kahve makinesi',
      'kahve makinesi',
      'espresso',
      'siemens ct636les1',
      'bosch ctl636eb6',
      'villa mutfağı',
      '60x45 ankastre',
    ],
    roomTags: ['Villa Mutfağı', 'Mutfak', 'Kahve Köşesi', 'Boy Dolap'],
    aiSummary:
      'Lüks villa mutfaklarında ankastre fırınla yan yana veya üst üste konumlandırılan 59.5×45.5 cm Siemens iQ700 / Bosch Serie 8 tam otomatik ankastre kahve makinesi: TFT menü ekranı, çift kahve çıkışı, süt köpürtücü, paslanmaz damlalık ızgarası ve sıcak bardak ışığı.',
    finishes: MODERN_ANKASTRE_GLASS_FINISHES,
    defaultFinishId: 'siyah-temperli-cam-inox',
    surfaceType: 'Siyah Temperli Cam + Fırçalı İnox Damlalık + Renkli TFT Ekran',
    geometryBreakdown: [
      '59.5×45.5×38 cm ankastre boy dolap kasası ve tam boy siyah kristal cam/inox ön cephe.',
      'Üst bölümde renkli TFT içecek seçim ekranı (Espresso, Cappuccino, Latte Macchiato) ve paslanmaz döner kontrol halkası.',
      'Merkezde derinleştirilmiş fincan nişi, yüksekliği ayarlanabilir çift kahve + süt çıkışı, üstte sıcak LED niş ışığı ve altta delikli paslanmaz damlalık ızgarası.',
    ],
    microDetails: [
      'Niş içinde 2 adet şık seramik espresso fincanı sahneye hazır ölçek referansı olarak yer alır.',
      'Yanındaki 60 cm fırın ve ısıtma çekmecesiyle kusursuz yatay hat yakalar.',
    ],
    lightingTip:
      'Kahve nişindeki sıcak 2700K noktasal LED ışık koyu mutfak boy dolaplarında yüksek lüks algısı yaratır.',
  }),

  createKitchenBuiltInAsset({
    id: 'tr-bosch-siemens-ankastre-buzdolabi-kule',
    slug: 'bosch-siemens-178cm-tam-ankastre-nofrost-buzdolabi-kulesi',
    name: 'Bosch Serie 6 / Siemens iQ500 178 cm Tam Ankastre No-Frost Buzdolabı Kulesi (60 cm)',
    brandStyle: 'Bosch / Siemens · KIN86VFE0 / KI86NVFE0 (60×58×195 cm)',
    archetype: 'tr_builtin_fridge_column',
    placement: 'floor',
    dimensionsCm: { width: 60, depth: 58, height: 195 },
    polyEstimate: 8900,
    thumbnailFile: 'bosch-siemens-ankastre-buzdolabi-kulesi.png',
    searchKeywords: [
      'ankastre buzdolabı',
      'tam ankastre buzdolabı',
      'bosch kin86vfe0',
      'siemens ki86nvfe0',
      'no-frost buzdolabı',
      'boy dolap buzdolabı',
      '60 cm buzdolabı',
    ],
    roomTags: ['Mutfak', 'Villa Mutfağı', 'Apartman Mutfağı'],
    aiSummary:
      'Türkiye standart 60 cm mutfak boy dolabı içine tam gizlenen Bosch Serie 6 / Siemens iQ500 alttan donduruculu No-Frost ankastre buzdolabı kulesi: üst soğutucu + alt dondurucu 70/30 kapak bölünmesi, gizli Gola/bar kulp ve baza havalandırma menfezi.',
    finishes: BUILTIN_FRIDGE_FINISHES,
    defaultFinishId: 'kasmir-lake-ankastre-kapak',
    surfaceType: 'Mat Lake / İnox Ankastre Kapak + Alüminyum Baza Havalandırma Izgarası',
    geometryBreakdown: [
      '60×58×195 cm tam boy ankastre dolap gövdesi ve alt bazada zorunlu 200 cm² metal havalandırma menfezi.',
      'Üstte %68 soğutucu kapak, altta %32 dondurucu kapak bölünmesi ve aralarında keskin gölge derzi.',
      'Yan/merkez gömme alüminyum profil kulp ve aralıkta sızdırmazlık/LED soğutucu iç detayı.',
    ],
    microDetails: [
      'Baza havalandırma ızgarasında gerçek 3D paralel kanatlar yer alır (ankastre buzdolaplarının mimari imzası).',
      'Yan yana 2 adet yerleştirilerek 120 cm Side-by-Side ankastre villa duvarı oluşturulabilir.',
    ],
    lightingTip:
      'Fırın + mikrodalga boy dolabının hemen yanına 2 mm derzle hizalayarak modern İstanbul mutfağı boy dolap duvarı kurun.',
  }),
];

export const TURKISH_KITCHEN_BUILTIN_ASSET_IDS = new Set<string>(
  TURKISH_KITCHEN_BUILTIN_ASSETS.map((a) => a.id),
);
