import type {
  ArchitecturalAsset,
  AssetArchetype,
  AssetCategory,
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
// AUTHENTIC TURKISH WARDROBE, BOOKCASE, STUDY, LAPTOP, STATIONERY & KIDS TOYS
// Curated multi-part PBR finish banks for Doğtaş, Kelebek, İstikbal, Lazzoni,
// Çilek Mobilya, Faber-Castell, Apple/Monster TR, IKEA TR & Montessori Turkey
// ============================================================================

const WARDROBE_BOOKCASE_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'kasmir-lake-mese-pirinc',
    label: 'Kaşmir Mat Lake · Doğal Meşe · Fırçalı Pirinç',
    comboSummary: 'Kapak/Gövde: Kaşmir Mat Lake · İç/Çıta: Doğal Meşe · Kulp & Profil: Fırçalı Pirinç',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#D8CFC2', roughness: 0.36, metalness: 0.03, partLabel: 'Kaşmir Mat Lake Kapak' },
      secondary: { hex: '#BA9366', roughness: 0.5, metalness: 0.02, partLabel: 'Doğal Meşe Gövde & Çıta' },
      accent: { hex: '#C6A056', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Kulp & Profil' },
      glass: { hex: '#635A52', opacity: 0.54, roughness: 0.06 },
    },
  }),
  makeFinish({
    id: 'amerikan-ceviz-antrasit-fume',
    label: 'Amerikan Ceviz · Antrasit Gövde · Füme Cam',
    comboSummary: 'Gövde/Raf: Amerikan Ceviz · Çerçeve: Mat Antrasit · Kulp: Füme Gunmetal',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#6E4B33', roughness: 0.46, metalness: 0.03, partLabel: 'Amerikan Ceviz Kaplama' },
      secondary: { hex: '#282C34', roughness: 0.38, metalness: 0.72, partLabel: 'Mat Antrasit Profil' },
      accent: { hex: '#C5A25A', roughness: 0.24, metalness: 0.9, partLabel: 'Şampanya Pirinç Kulp' },
      glass: { hex: '#2B3038', opacity: 0.56, roughness: 0.05 },
    },
  }),
  makeFinish({
    id: 'mat-beyaz-lake-mese-siyah',
    label: 'Mat Beyaz Lake · İskandinav Meşe · Mat Siyah',
    comboSummary: 'Kapak: İpeksi Mat Beyaz Lake · Raf/Gövde: Açık Meşe · Kulp: Mat Siyah Metal',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#F2F0EB', roughness: 0.34, metalness: 0.02, partLabel: 'Mat Beyaz Lake' },
      secondary: { hex: '#C9A77C', roughness: 0.52, metalness: 0.02, partLabel: 'Açık İskandinav Meşe' },
      accent: { hex: '#22262C', roughness: 0.4, metalness: 0.78, partLabel: 'Mat Siyah Metal Kulp' },
      glass: { hex: '#D8E0E8', opacity: 0.48, roughness: 0.05 },
    },
  }),
  makeFinish({
    id: 'antrasit-lake-ceviz-bronz',
    label: 'Antrasit Mat Lake · Sıcak Ceviz · Bronz',
    comboSummary: 'Dış Gövde: Antrasit Mat Lake · İç Raf: Sıcak Ceviz · Kulp & Çerçeve: Saten Bronz',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#343942', roughness: 0.36, metalness: 0.08, partLabel: 'Antrasit Mat Lake' },
      secondary: { hex: '#7D583B', roughness: 0.48, metalness: 0.03, partLabel: 'Sıcak Ceviz İç Raf' },
      accent: { hex: '#B48D52', roughness: 0.26, metalness: 0.9, partLabel: 'Saten Bronz Profil' },
      glass: { hex: '#22262E', opacity: 0.6, roughness: 0.05 },
    },
  }),
  makeFinish({
    id: 'vizon-tas-mese-gold',
    label: 'Vizon Taş Lake · Meşe · Fırçalı Gold',
    comboSummary: 'Kapak: Mat Vizon Taş · Çıta/Raf: Bal Meşe · Kulp & Detay: Fırçalı Gold',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#BEB4A8', roughness: 0.38, metalness: 0.03, partLabel: 'Mat Vizon Taş Lake' },
      secondary: { hex: '#AE8658', roughness: 0.5, metalness: 0.02, partLabel: 'Bal Meşe Gövde' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Gold Kulp' },
      glass: { hex: '#544D46', opacity: 0.54, roughness: 0.06 },
    },
  }),
];

const STUDY_STATIONERY_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'mese-seramik-krem-pirinc',
    label: 'Doğal Meşe · Krem Seramik · Pirinç',
    comboSummary: 'Ana Gövde: Doğal Meşe · Kap/Taban: Krem Mat Seramik · Detay: Fırçalı Pirinç',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#C69F73', roughness: 0.48, metalness: 0.02, partLabel: 'Doğal Meşe Gövde' },
      secondary: { hex: '#EFECE4', roughness: 0.36, metalness: 0.02, partLabel: 'Mat Krem Seramik' },
      accent: { hex: '#C6A056', roughness: 0.24, metalness: 0.9, partLabel: 'Fırçalı Pirinç Detay' },
    },
  }),
  makeFinish({
    id: 'amerikan-ceviz-antrasit-altin',
    label: 'Amerikan Ceviz · Mat Antrasit · Altın',
    comboSummary: 'Ana Gövde: Masif Ceviz · Düzenleyici: Mat Antrasit · Metal Aksesuar: Gold',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#6F4C34', roughness: 0.46, metalness: 0.03, partLabel: 'Masif Amerikan Ceviz' },
      secondary: { hex: '#2D323A', roughness: 0.42, metalness: 0.38, partLabel: 'Mat Antrasit Gövde' },
      accent: { hex: '#D1AC5B', roughness: 0.24, metalness: 0.92, partLabel: 'Altın Klips & Detay' },
    },
  }),
  makeFinish({
    id: 'adacayi-yesil-husk-mese',
    label: 'Adaçayı Yeşil · Huş Ahşap · Krom',
    comboSummary: 'Ana Gövde: Mat Adaçayı · Altlık/Kap: Doğal Huş · Detay: Saten Krom',
    materialKind: 'ceramic',
    comboRole: 'bath_accessory',
    partFinishes: {
      primary: { hex: '#7D9182', roughness: 0.4, metalness: 0.04, partLabel: 'Mat Adaçayı Seramik' },
      secondary: { hex: '#DFC7A2', roughness: 0.52, metalness: 0.02, partLabel: 'Doğal Huş Kontrplak' },
      accent: { hex: '#CFD5DE', roughness: 0.2, metalness: 0.92, partLabel: 'Saten Krom' },
    },
  }),
  makeFinish({
    id: 'mat-beyaz-traverten-siyah',
    label: 'Mat Beyaz · Traverten Taş · Mat Siyah',
    comboSummary: 'Ana Gövde: Traverten/Beyaz · İç Bölüm: Mat Siyah · Aksesuar: İnox',
    materialKind: 'stone',
    comboRole: 'bath_accessory',
    partFinishes: {
      primary: { hex: '#E3D9C8', roughness: 0.48, metalness: 0.02, partLabel: 'Honlu Traverten / Beyaz' },
      secondary: { hex: '#242830', roughness: 0.4, metalness: 0.6, partLabel: 'Mat Siyah Çelik' },
      accent: { hex: '#C8A55B', roughness: 0.26, metalness: 0.9, partLabel: 'Pirinç Detay' },
    },
  }),
  makeFinish({
    id: 'lacivert-kiremit-mese',
    label: 'Gece Lacivert · Kiremit · Doğal Meşe',
    comboSummary: 'Ana Gövde: Mat Lacivert · Vurgu: Kiremit Terracotta · Taban: Meşe',
    materialKind: 'ceramic',
    comboRole: 'bath_accessory',
    partFinishes: {
      primary: { hex: '#273C5C', roughness: 0.38, metalness: 0.06, partLabel: 'Mat Gece Lacivert' },
      secondary: { hex: '#BD694C', roughness: 0.46, metalness: 0.03, partLabel: 'Kiremit Terracotta' },
      accent: { hex: '#C69F73', roughness: 0.48, metalness: 0.02, partLabel: 'Doğal Meşe Taban' },
    },
  }),
];

const TECH_LAPTOP_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'uzay-grisi-aluminyum-siyah',
    label: 'Uzay Grisi Alüminyum · Siyah Klavye',
    comboSummary: 'Kasa: Eloksal Uzay Grisi Alüminyum · Klavye/Çerçeve: Mat Siyah · Ekran: Parlak Cam',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#636871', roughness: 0.26, metalness: 0.88, partLabel: 'Uzay Grisi CNC Alüminyum' },
      secondary: { hex: '#181B21', roughness: 0.42, metalness: 0.22, partLabel: 'Mat Siyah Klavye & Çerçeve' },
      accent: { hex: '#D2D8E0', roughness: 0.16, metalness: 0.94, partLabel: 'Krom Menteşe & Stant' },
      glass: { hex: '#141922', opacity: 0.92, roughness: 0.05 },
    },
  }),
  makeFinish({
    id: 'gumus-aluminyum-siyah-kece',
    label: 'Gümüş Alüminyum · Siyah Tuşlar · Gri Keçe',
    comboSummary: 'Kasa: Doğal Gümüş Alüminyum · Klavye: Siyah · Masa Altlığı: Antrasit Keçe',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#CFD5DD', roughness: 0.22, metalness: 0.92, partLabel: 'Gümüş Eloksal Alüminyum' },
      secondary: { hex: '#21252D', roughness: 0.46, metalness: 0.2, partLabel: 'Siyah Klavye & Keçe Mat' },
      accent: { hex: '#E4E8EE', roughness: 0.14, metalness: 0.96, partLabel: 'Parlak Alüminyum Pah' },
      glass: { hex: '#171C26', opacity: 0.92, roughness: 0.05 },
    },
  }),
  makeFinish({
    id: 'gece-yarisi-siyah-metal',
    label: 'Gece Yarısı Mat Siyah · Füme Alüminyum',
    comboSummary: 'Kasa: Gece Yarısı Anodize Siyah · Gövde: Mat Siyah · Detay: Füme Gunmetal',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#232833', roughness: 0.28, metalness: 0.84, partLabel: 'Gece Yarısı Anodize Alüminyum' },
      secondary: { hex: '#14171D', roughness: 0.44, metalness: 0.28, partLabel: 'Mat Siyah Klavye' },
      accent: { hex: '#505866', roughness: 0.26, metalness: 0.88, partLabel: 'Füme Gunmetal Stant' },
      glass: { hex: '#11151D', opacity: 0.94, roughness: 0.05 },
    },
  }),
  makeFinish({
    id: 'yildiz-isigi-sampanya-beyaz',
    label: 'Yıldız Işığı Şampanya · Beyaz Aksesuar',
    comboSummary: 'Kasa: Şampanya Altın Alüminyum · Klavye: Kırık Beyaz/Antrasit · Detay: Saten Altın',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#DDD4C6', roughness: 0.24, metalness: 0.86, partLabel: 'Şampanya Alüminyum' },
      secondary: { hex: '#2A2E36', roughness: 0.42, metalness: 0.24, partLabel: 'Antrasit Çerçeve & Mat' },
      accent: { hex: '#CBB896', roughness: 0.2, metalness: 0.92, partLabel: 'Saten Şampanya Stant' },
      glass: { hex: '#181C24', opacity: 0.92, roughness: 0.05 },
    },
  }),
  makeFinish({
    id: 'mat-siyah-ceviz-studyo',
    label: 'Mat Siyah Kasa · Ceviz Stüdyo Altlık',
    comboSummary: 'Ekran/Kasa: Mat Siyah · Masa Üstü Stüdyo Altlık: Ceviz & Antrasit Keçe',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#20242B', roughness: 0.34, metalness: 0.72, partLabel: 'Mat Siyah Metal Gövde' },
      secondary: { hex: '#6E4B33', roughness: 0.48, metalness: 0.03, partLabel: 'Amerikan Ceviz Detay' },
      accent: { hex: '#C6A056', roughness: 0.24, metalness: 0.9, partLabel: 'Pirinç Stüdyo Vurgu' },
      glass: { hex: '#12161E', opacity: 0.94, roughness: 0.05 },
    },
  }),
];

const MONTESSORI_KIDS_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'dogal-hus-pastel-gokkusagi',
    label: 'Doğal Huş · Pastel Adaçayı & Terracotta',
    comboSummary: 'Gövde: Doğal Huş Kontrplak · Detay: Pastel Adaçayı & Kiremit · Kumaş: Ham Pamuk',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#DFC59F', roughness: 0.56, metalness: 0.01, partLabel: 'Doğal Huş / Kayın Ahşap' },
      secondary: { hex: '#869D8B', roughness: 0.48, metalness: 0.02, partLabel: 'Pastel Adaçayı Yeşili' },
      accent: { hex: '#D4846A', roughness: 0.48, metalness: 0.02, partLabel: 'Pastel Terracotta & Hardal' },
    },
  }),
  makeFinish({
    id: 'iskandinav-beyaz-kayin-hardal',
    label: 'İskandinav Beyaz · Doğal Kayın · Hardal',
    comboSummary: 'Gövde: Su Bazlı Beyaz Lake · İskelet: Doğal Kayın · Vurgu: Sıcak Hardal',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#F3EFE8', roughness: 0.42, metalness: 0.02, partLabel: 'Su Bazlı Beyaz Ahşap' },
      secondary: { hex: '#D2AF82', roughness: 0.54, metalness: 0.02, partLabel: 'Masif Kayın Çerçeve' },
      accent: { hex: '#DFAD52', roughness: 0.46, metalness: 0.02, partLabel: 'Sıcak Hardal Vurgu' },
    },
  }),
  makeFinish({
    id: 'pudra-pembe-krem-kayin',
    label: 'Pudra Pembe · Ham Krem · Doğal Kayın',
    comboSummary: 'Gövde/Kumaş: Pudra Pembe & Krem · İskelet: Doğal Kayın · Detay: Altın Sarı',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#E3C3C4', roughness: 0.52, metalness: 0.01, partLabel: 'Pastel Pudra Pembe' },
      secondary: { hex: '#EFE9DE', roughness: 0.6, metalness: 0.01, partLabel: 'Ham Pamuk Krem' },
      accent: { hex: '#CCA67B', roughness: 0.52, metalness: 0.02, partLabel: 'Doğal Kayın Ahşap' },
    },
  }),
  makeFinish({
    id: 'gok-mavi-beyaz-mese',
    label: 'Gök Mavi · Mat Beyaz · Açık Meşe',
    comboSummary: 'Ana Gövde: Pastel Gök Mavi · Yanlar: Beyaz · Ayak & Raf: Açık Meşe',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#94B2C9', roughness: 0.48, metalness: 0.02, partLabel: 'Pastel Gök Mavi' },
      secondary: { hex: '#F2F0EC', roughness: 0.4, metalness: 0.02, partLabel: 'Mat Beyaz Lake' },
      accent: { hex: '#CCA677', roughness: 0.52, metalness: 0.02, partLabel: 'Açık Meşe Detay' },
    },
  }),
  makeFinish({
    id: 'krem-keten-ceviz-zeytin',
    label: 'Ham Keten Krem · Sıcak Meşe · Zeytin',
    comboSummary: 'Yüzey: Ham Keten / Krem · Çerçeve: Sıcak Meşe · Vurgu: Zeytin Yeşili',
    materialKind: 'fabric',
    comboRole: 'seating',
    partFinishes: {
      primary: { hex: '#EFE8DA', roughness: 0.84, metalness: 0.0, partLabel: 'Ham Pamuk Keten' },
      secondary: { hex: '#B99264', roughness: 0.52, metalness: 0.02, partLabel: 'Sıcak Doğal Meşe' },
      accent: { hex: '#7A8B64', roughness: 0.62, metalness: 0.01, partLabel: 'Zeytin Yeşili Vurgu' },
    },
  }),
];

interface HomeStudyToyAssetConfig {
  id: string;
  slug: string;
  name: string;
  brandStyle: string;
  category: AssetCategory;
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
}

function createHomeStudyToyAsset(cfg: HomeStudyToyAssetConfig): ArchitecturalAsset {
  const defaultFinishId = cfg.defaultFinishId ?? cfg.finishes[0].id;
  const primaryFinish = cfg.finishes.find((f) => f.id === defaultFinishId) ?? cfg.finishes[0];
  const { width, depth, height } = cfg.dimensionsCm;

  return {
    id: cfg.id,
    slug: cfg.slug,
    name: cfg.name,
    brandStyle: cfg.brandStyle,
    category: cfg.category,
    archetype: cfg.archetype,
    placement: cfg.placement,
    dimensionsCm: cfg.dimensionsCm,
    polyEstimate: cfg.polyEstimate,
    renderEngines: ['Cycles', 'EEVEE'],
    uvUnwrapped: true,
    thumbnailUrl: `/assets/turkish-gaps/${cfg.thumbnailFile}`,
    searchKeywords: [
      ...cfg.searchKeywords,
      'ev içi 3d model',
      'türkiye iç mekan',
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
        `Gerçek 1:1 metrik ölçü: ${width} × ${depth} × ${height} cm (Z=0 zemin veya masa yüzeyi pivotlu).`,
        ...cfg.geometryBreakdown,
      ],
      textureAndMaps: {
        surfaceType: cfg.surfaceType,
        uvTileCm: '1:1 Gerçek Metrik UV + 512px Canvas Decal (Kitap Sırtı / Ekran / Etiket)',
        bumpDepthMm: '0.4 – 2.2 mm (Ahşap Damar / Kumaş Dokuma / CNC Alüminyum)',
        roughnessRange: '0.06 – 0.88 (Cam/Ekran vs Fırçalı Metal vs Mat Ahşap/Kumaş)',
        shaderRecipe:
          'Principled BSDF: Doğal ahşap için Roughness 0.48–0.56 + hafif bump; CNC alüminyum için Metallic 0.88–0.94 + Roughness 0.22; Mat lake/kitap kağıdı için Roughness 0.36–0.78; Laptop/monitör ekranı için Emission Strength 1.8.',
      },
      microDetails: cfg.microDetails,
      blenderModifiers: [
        'Bevel (Width: 1.5–3 mm, Segments: 2) tüm ahşap, alüminyum ve kitap kenarlarına yumuşak ışık geçişi verir.',
        'WeightedNormal ile düz dolap kapakları ve cam panellerde kusursuz gölgelendirme elde edilir.',
      ],
      lightingAndCameraTip: cfg.lightingTip,
      aiRenderPrompt: `Photorealistic Turkish residential interior Blender Cycles render featuring ${cfg.name} (${cfg.brandStyle}), exact dimensions ${width}x${depth}x${height}cm, authentic ${cfg.surfaceType}, warm natural daylight streaming across modern Turkish apartment/villa room, crisp contact shadows, architectural interior photography, 50mm lens, 8k.`,
      aiBlenderMasterPrompt: `Blender 4.x iç mekan sahnesine "${cfg.name}" 3D modelini (1:1 metrik ${width}x${depth}x${height} cm) Z=0 kotuna sıfır toleransla yerleştir. "${cfg.category}" koleksiyonuna ekle, çok parçalı Principled BSDF malzeme düğümlerini koruyarak Cycles GPU (AgX) ile mimari render al.`,
    },
    modelSource: {
      provider: 'procedural',
      license: 'MimarKatalog Özel Türkiye İç Mekan CAD',
    },
    sourceOrigin: 'catalog',
  };
}

export const TURKISH_HOME_STUDY_TOYS_ASSETS: ArchitecturalAsset[] = [
  // =========================================================================
  // A. GARDIROP & GİYİNME ODASI DOLAPLARI (4 Model — Yatak Odası)
  // =========================================================================
  createHomeStudyToyAsset({
    id: 'tr-6kapak-aynali-gardirop',
    slug: '6-kapakli-aynali-led-yatak-odasi-gardirobu',
    name: '6 Kapaklı Aynalı & LED Aydınlatmalı Yatak Odası Gardırobu (270 cm)',
    brandStyle: 'Doğtaş / Kelebek · 6 Kapaklı Aynalı Gardırop',
    category: 'Yatak Odası',
    archetype: 'tr_mirrored_6door_wardrobe',
    placement: 'floor',
    dimensionsCm: { width: 270, depth: 62, height: 220 },
    polyEstimate: 14800,
    thumbnailFile: '6-kapakli-aynali-gardirop.png',
    searchKeywords: [
      'gardırop',
      'gardirop',
      '6 kapaklı gardırop',
      'aynalı gardırop',
      'elbise dolabı',
      'yatak odası dolabı',
      'doğtaş',
      'kelebek',
    ],
    roomTags: ['Yatak Odası', 'Ebeveyn Yatak Odası', 'Giyinme Odası'],
    aiSummary:
      'Türkiye ebeveyn yatak odalarının klasikleşen 270 cm 6 kapaklı gardırobu: ortada 2 adet tam boy Şişecam ayna kapak, yanlarda mat lake kapaklar, uzun fırçalı pirinç/siyah bar kulplar ve üst taç LED ışık bandı.',
    finishes: WARDROBE_BOOKCASE_FINISHES,
    defaultFinishId: 'kasmir-lake-mese-pirinc',
    surfaceType: 'Mat Kaşmir/Beyaz Lake + Tam Boy Ayna Cam + Fırçalı Pirinç Bar Kulp',
    geometryBreakdown: [
      '270 cm genişlikte 6 eşit kapak bölmesi: sağ ve solda ikişer mat lake kapak, merkezde ince alüminyum çerçeveli 2 tam boy ayna kapak.',
      'Alt 8 cm gizli baza, üst 5 cm mimari taç çıtası ve taç altında sıcak 3000K gizli LED şerit kanalı.',
      'Kapak aralarında 3 mm gerçek gölge derzi ve 95 cm uzunluğunda ince metal bar kulplar.',
    ],
    microDetails: [
      'Orta iki kapakta yüksek yansıtıcı (Metallic 0.94, Roughness 0.04) Şişecam ayna yüzeyi.',
      'Üst alın altında sıcak 3000K emisyon şeridi ile akşam renderlarında yumuşak ambiyans.',
    ],
    lightingTip:
      'Gardırop aynasına karşı pencere veya sıcak abajur yansıyacak şekilde 35° açılı kamera kurarak derinlik algısı oluşturun.',
  }),

  createHomeStudyToyAsset({
    id: 'tr-camli-giyinme-dolabi',
    slug: 'fume-cam-kapakli-led-giyinme-odasi-dolabi',
    name: "Füme Cam Kapaklı & İç LED'li Giyinme Odası Dolabı (240 cm)",
    brandStyle: 'Lazzoni / Enza Home · Camlı Giyinme Dolabı',
    category: 'Yatak Odası',
    archetype: 'tr_glass_walkin_wardrobe',
    placement: 'floor',
    dimensionsCm: { width: 240, depth: 60, height: 235 },
    polyEstimate: 19200,
    thumbnailFile: 'fume-cam-giyinme-dolabi.png',
    searchKeywords: [
      'giyinme dolabı',
      'camlı gardırop',
      'füme cam dolap',
      'ledli gardırop',
      'giyinme odası',
      'gardırop',
      'lazzoni',
      'enza home',
    ],
    roomTags: ['Giyinme Odası', 'Ebeveyn Süiti', 'Villa Yatak Odası'],
    aiSummary:
      'Lüks Türk villa ve rezidans giyinme odaları için 240 cm alüminyum çerçeveli füme cam kapaklı gardırop: içeride aydınlatmalı dikey 3000K LED çıtaları, askı borusunda sıralı elbiseler, katlanmış kazak rafları ve alt 4 çekmece.',
    finishes: WARDROBE_BOOKCASE_FINISHES,
    defaultFinishId: 'amerikan-ceviz-antrasit-fume',
    surfaceType: 'Amerikan Ceviz İç Karkas + Füme Reflekte Cam + Anodize Alüminyum Çerçeve + İç LED',
    geometryBreakdown: [
      '4 modüllü alüminyum ince profilli füme yarı saydam cam kapak sistemi (arkasındaki giysiler net görünür).',
      'İç kurgu: paslanmaz askı boruları, askılarda renkli ceket/gömlek siluetleri, üstte katlı kazak/kutu rafları ve altta 4 adet çekmece.',
      'Her bölmenin dikey iç kenarlarında sıcak 3000K giyinme odası sensörlü LED şeritleri.',
    ],
    microDetails: [
      'Füme cam arkasında 8 adet askılı giysi ve 6 adet katlı tekstil yığını derinlik katar.',
      'Çekmece önlerinde gizli profil kulp ve ceviz/antrasit doku kontrastı.',
    ],
    lightingTip:
      'Oda ışığını %40 kısarak dolap içi 3000K dikey LED şeritlerin füme cam ardındaki sıcak parıltısını öne çıkarın.',
  }),

  createHomeStudyToyAsset({
    id: 'tr-surgulu-citali-gardirop',
    slug: 'cift-surgulu-citali-aynali-gardirop-220',
    name: 'Çift Sürgülü Çıtalı Meşe & Aynalı Modern Gardırop (220 cm)',
    brandStyle: 'İstikbal / Bellona · Sürgülü Gardırop 220 cm',
    category: 'Yatak Odası',
    archetype: 'tr_sliding_wardrobe_220',
    placement: 'floor',
    dimensionsCm: { width: 220, depth: 65, height: 220 },
    polyEstimate: 16400,
    thumbnailFile: 'surgulu-citali-gardirop.png',
    searchKeywords: [
      'sürgülü gardırop',
      'ray dolap',
      'raydolap',
      'gardırop',
      'çıtalı gardırop',
      'aynalı ray dolap',
      'istikbal',
      'bellona',
    ],
    roomTags: ['Yatak Odası', 'Apartman Yatak Odası', 'Giyinme Alanı'],
    aiSummary:
      'Türkiye apartman yatak odalarında kapak açılma alanı kazandırmak için en çok kullanılan 220 cm çift sürgülü ray dolap: sol kanatta dikey akustik meşe çıtalar, sağ kanatta bronz/gümüş ayna ve alüminyum üst-alt ray profili.',
    finishes: WARDROBE_BOOKCASE_FINISHES,
    defaultFinishId: 'antrasit-lake-ceviz-bronz',
    surfaceType: 'Dikey Ahşap Çıtalı Sürgü Kapak + Tam Boy Ayna + Eloksal Ray Profili',
    geometryBreakdown: [
      'Ön ve arka ray ekseninde kademeli konumlandırılmış 2 geniş sürgülü kapak (112 cm × 210 cm).',
      'Sol kapak yüzeyinde 14 adet dikey ahşap çıta rölyefi ve entegre tam boy metal çekme profili.',
      'Sağ kapakta yatay ince metal bölmeli modern tam boy ayna paneli ve üst-alt alüminyum ray kılavuzları.',
    ],
    microDetails: [
      'İki kapağın 3.5 cm ofsetli gerçek ray kademesi yan açılardan fark edilir.',
      'Üst ray siperliği ve alt stoper profili gerçek raydolap kesitindedir.',
    ],
    lightingTip:
      'Pencereden gelen yan gün ışığı sol kapaktaki dikey ahşap çıtalarda ritmik ışık-gölge çizgileri üretir.',
  }),

  createHomeStudyToyAsset({
    id: 'tr-cocuk-3kapak-gardirop',
    slug: '3-kapakli-montessori-cocuk-genc-odasi-gardirobu',
    name: '3 Kapaklı Montessori Çocuk & Genç Odası Gardırobu (135 cm)',
    brandStyle: 'Çilek Mobilya · Montessori Çocuk Gardırobu',
    category: 'Yatak Odası',
    archetype: 'tr_kids_3door_wardrobe',
    placement: 'floor',
    dimensionsCm: { width: 135, depth: 56, height: 195 },
    polyEstimate: 12600,
    thumbnailFile: 'cocuk-3kapak-gardirop.png',
    searchKeywords: [
      'çocuk gardırobu',
      'genç odası gardırobu',
      'bebek dolabı',
      'gardırop',
      'çilek mobilya',
      'montessori dolap',
      '3 kapaklı dolap',
    ],
    roomTags: ['Çocuk Odası', 'Bebek Odası', 'Genç Odası'],
    aiSummary:
      'Çilek Mobilya ve Montessori çocuk odası standartlarında 135 cm 3 kapaklı çocuk gardırobu: iki renkli doğal kayın + pastel/beyaz lake kapaklar, yuvarlak masif ahşap düğme kulplar, 2 alt çekmece ve yan açık oyuncak-kitap nişleri.',
    finishes: MONTESSORI_KIDS_FINISHES,
    defaultFinishId: 'iskandinav-beyaz-kayin-hardal',
    surfaceType: 'Su Bazlı Mat Lake + Masif Kayın Ayak & Düğme Kulp + Açık Niş Rafı',
    geometryBreakdown: [
      'Sol 2 uzun askılık kapak, sağda üst kısa kapak + 2 açık sergi nişi + altta 2 tam genişlikli çekmece.',
      'Çocuk güvenliği için yuvarlatılmış masif kayın topuz kulplar ve 12 cm konik İskandinav ahşap ayaklar.',
      'Açık raf gözlerinde dekoratif katlı battaniye ve oyuncak kutusu siluetleri.',
    ],
    microDetails: [
      'Konik açılı 4 masif kayın ayak alt temizlik için yerden 12 cm yüksektedir.',
      'Açık nişte pastel oyuncak saklama sepeti hazır yerleştirilmiştir.',
    ],
    lightingTip:
      'Yumuşak gün ışığı ve pastel çocuk odası duvar tonlarıyla sıcak İskandinav bebek/çocuk odası atmosferi kurun.',
  }),

  // =========================================================================
  // B. KİTAPLIK & ÇALIŞMA MASASI ÜNİTELERİ (4 Model)
  // =========================================================================
  createHomeStudyToyAsset({
    id: 'tr-dolgulu-5kat-kitaplik',
    slug: 'dolgulu-5-katli-mimari-kitaplik-kitapli',
    name: 'Dolgulu 5 Katlı Mimari Kitaplık (Kitaplar + Dekor Objeler, 100×205 cm)',
    brandStyle: 'Kelebek / IKEA Türkiye · Dolgulu 5 Katlı Kitaplık',
    category: 'Salon',
    archetype: 'tr_tall_filled_bookcase',
    placement: 'floor',
    dimensionsCm: { width: 100, depth: 34, height: 205 },
    polyEstimate: 18400,
    thumbnailFile: 'dolgulu-5kat-kitaplik.png',
    searchKeywords: [
      'kitaplık',
      'kitaplik',
      'dolu kitaplık',
      'kitap rafı',
      'salon kitaplığı',
      'çalışma odası kitaplığı',
      '5 katlı kitaplık',
      'raf ünitesi',
    ],
    roomTags: ['Salon', 'Çalışma Odası', 'Genç Odası', 'Kütüphane Köşesi'],
    aiSummary:
      'Blender sahnelerinde boş raf derdini çözen hazır dolgulu 100×205 cm 5 katlı kitaplık: dikey ve yatay dizili 35+ renkli ciltli kitap, yaslanmış kitap detayı, seramik vazo, küçük saksı bitki ve alt kapalı saklama bölmesi.',
    finishes: WARDROBE_BOOKCASE_FINISHES,
    defaultFinishId: 'mat-beyaz-lake-mese-siyah',
    surfaceType: 'Doğal Meşe / Lake Karkas + Çok Renkli Ciltli Kitaplar + Mat Seramik Dekor',
    geometryBreakdown: [
      '100×34×205 cm karkas, arka panel, 4 açık sergi rafı ve alt 2 kapaklı kapalı dolap bölümü.',
      'Raflara sahneye hazır yerleştirilmiş 35+ farklı yükseklik/kalınlıkta dikey, eğimli ve yatay kitap grupları.',
      'Üst raflarda seramik dekoratif vazo, küçük yeşil iç mekan bitkisi ve dekoratif kutular.',
    ],
    microDetails: [
      'Kitap sırtlarında sıcak mimari renk paleti (lacivert, krem, terracotta, adaçayı, hardal, antrasit).',
      'Her rafta simetrik olmayan doğal ev içi dizilim (bazı kitaplar 15° yaslı, bazıları yatay istifli).',
    ],
    lightingTip:
      'Kitaplığı pencere yanına veya lambader yakınına konumlandırarak kitap sırtları ve raf derinliğinde yumuşak ambient occlusion elde edin.',
  }),

  createHomeStudyToyAsset({
    id: 'tr-kemerli-villa-kitaplik',
    slug: 'kemerli-alt-citali-dolapli-villa-kitapligi',
    name: 'Kemerli (Arch) & Alt Çıtalı Dolaplı Modern Villa Kitaplığı (92×210 cm)',
    brandStyle: 'Mudo Concept / Enza Home · Kemerli Villa Kitaplık',
    category: 'Salon',
    archetype: 'tr_arched_fluted_bookcase',
    placement: 'floor',
    dimensionsCm: { width: 92, depth: 38, height: 210 },
    polyEstimate: 16200,
    thumbnailFile: 'kemerli-villa-kitaplik.png',
    searchKeywords: [
      'kemerli kitaplık',
      'arch kitaplık',
      'kitaplık',
      'villa kitaplığı',
      'çıtalı kitaplık',
      'mudo concept',
      'niş kitaplık',
    ],
    roomTags: ['Villa Salonu', 'Okuma Köşesi', 'Çalışma Odası'],
    aiSummary:
      'Güncel Türk iç mimari trendlerinin yıldızı 92×210 cm kemerli (arch) villa kitaplığı: yarım daire kemer taç, gizli kemer altı sıcak LED, 3 açık kitap-obje rafı ve altta dikey çıtalı pirinç kulplu çift kapaklı dolap.',
    finishes: WARDROBE_BOOKCASE_FINISHES,
    defaultFinishId: 'kasmir-lake-mese-pirinc',
    surfaceType: 'Mat Kaşmir/Ceviz Gövde + Dikey Çıtalı Alt Kapaklar + Sıcak Kemer LED',
    geometryBreakdown: [
      'Üst bölümde 46 cm yarıçaplı tam dairesel mimari kemer çerçeve ve kavisli arka niş.',
      'Kemer içinde 3 adet kalın ahşap raf, mimarlık albümleri, dikey kitap serileri ve traverten küre/vazo objeleri.',
      'Alt 70 cm yükseklikte 12 dikey çıtalı çift kapaklı dolap ve fırçalı pirinç düğme kulplar.',
    ],
    microDetails: [
      'Kemer tavanında gizli sıcak 3000K emisyon şeridi ile akşam sahnelerinde vurgu aydınlatması.',
      'Alt dolap kapaklarında gerçek 3D yarım silindir/çıta profili.',
    ],
    lightingTip:
      'TV duvarının iki yanına simetrik çift yerleştirerek lüks İstanbul villa salon duvarı kurabilirsiniz.',
  }),

  createHomeStudyToyAsset({
    id: 'tr-kitaplikli-calisma-masasi',
    slug: 'kitaplikli-cekmeceli-genc-ogrenci-calisma-masasi',
    name: 'Kitaplıklı & Çekmeceli Genç / Öğrenci Çalışma Masası (130×162 cm)',
    brandStyle: 'Çilek Mobilya / Vivense · Kitaplıklı Çalışma Masası',
    category: 'Mimari & Çalışma',
    archetype: 'tr_study_desk_hutch_set',
    placement: 'floor',
    dimensionsCm: { width: 130, depth: 62, height: 162 },
    polyEstimate: 17600,
    thumbnailFile: 'kitaplikli-calisma-masasi.png',
    searchKeywords: [
      'çalışma masası',
      'kitaplıklı çalışma masası',
      'öğrenci masası',
      'ders çalışma masası',
      'genç odası masası',
      'kitaplık',
      'çilek mobilya',
      'vivense',
    ],
    roomTags: ['Genç Odası', 'Çocuk Odası', 'Çalışma Odası', 'Öğrenci Odası'],
    aiSummary:
      'Türkiye genç ve öğrenci odalarının vazgeçilmezi 130 cm kitaplıklı çalışma masası: sağda 3 çekmeceli keson, masa üstü üst kitaplık ünitesi, ders kitapları, mantar not panosu, gizli çalışma LED barı ve kalemlik detayı.',
    finishes: WARDROBE_BOOKCASE_FINISHES,
    defaultFinishId: 'mat-beyaz-lake-mese-siyah',
    surfaceType: 'Doğal Meşe Tabla + Mat Beyaz Lake Çekmece & Üst Kitaplık + Mantar Pano',
    geometryBreakdown: [
      '130×62 cm geniş ders çalışma tablası (Y=75 cm), sol metal/ahşap ayak ve sağda 3 çekmeceli depolama kesonu.',
      'Üst bölümde (Y=75–162 cm) bölmeli ders kitabı raf ünitesi, mantar not panosu ve not kartları.',
      'Üst raf altında sıcak 4000K çalışma LED şeridi ve raflarda sıralı renkli ders kitapları.',
    ],
    microDetails: [
      'Mantar not panosu üzerinde renkli ders programı ve yapışkan not kağıtları yer alır.',
      'Masa tablası boş bırakılarak laptop, kalemlik veya açık ders kitabı yerleşimine hazır tutulmuştur.',
    ],
    lightingTip:
      'Üstüne tr-ultrabook-laptop-mimar, tr-kalemlik-kirtasiye-seti ve tr-acik-ders-kitabi-calisma-seti ekleyerek tam dolu öğrenci odası kurun.',
  }),

  createHomeStudyToyAsset({
    id: 'tr-montessori-cocuk-kitapligi',
    slug: 'montessori-on-yuzlu-ahsap-cocuk-kitapligi',
    name: 'Montessori Ön Yüzlü Ahşap Çocuk Kitaplığı & Oyuncak Dolabı (105×98 cm)',
    brandStyle: 'Minik Atölye / Montessori TR · Ön Yüzlü Çocuk Kitaplığı',
    category: 'Çocuk & Oyun',
    archetype: 'tr_montessori_kids_bookshelf',
    placement: 'floor',
    dimensionsCm: { width: 105, depth: 36, height: 98 },
    polyEstimate: 14400,
    thumbnailFile: 'montessori-cocuk-kitapligi.png',
    searchKeywords: [
      'çocuk kitaplığı',
      'montessori kitaplık',
      'kitaplık',
      'oyuncak dolabı',
      'bebek odası kitaplık',
      'ahşap kitaplık',
      'hikaye kitabı rafı',
    ],
    roomTags: ['Çocuk Odası', 'Bebek Odası', 'Oyun Odası'],
    aiSummary:
      'Çocukların kitap kapaklarını görerek kendi seçebilmesi için tasarlanmış 105×98 cm Montessori ön yüzlü huş kontrplak çocuk kitaplığı: üstte 3 kademeli resimli hikaye kitabı rafı, altta 3 adet oyuncak saklama kutusu.',
    finishes: MONTESSORI_KIDS_FINISHES,
    defaultFinishId: 'dogal-hus-pastel-gokkusagi',
    surfaceType: 'Doğal Huş Kontrplak + Renkli Resimli Hikaye Kitapları + Pastel Oyuncak Kutuları',
    geometryBreakdown: [
      '105 cm genişlikte doğal huş yan paneller, kademeli 3 adet ön yüzlü kitap sergileme cebi ve düşme engelleyici kayın çıtalar.',
      'Kapakları öne bakan 9 adet renkli resimli çocuk hikaye kitabı (farklı ebat ve illüstrasyon kapaklı).',
      'Alt sırada kulplu 3 adet çıkarılabilir pastel oyuncak saklama kasası.',
    ],
    microDetails: [
      'Tüm üst köşeler çocuk güvenliği için geniş radyüsle yuvarlatılmıştır.',
      'Kitap kapaklarında canlı pastel çocuk kitabı kapak dokuları bulunur.',
    ],
    lightingTip:
      'Çocuk odasında oyun çadırı veya Montessori karyola yanına yerleştirerek sıcak hikaye köşesi oluşturun.',
  }),

  // =========================================================================
  // C. KALEMLİK, KIRTASİYE & DERS KİTAPLARI (5 Model — Mimari & Çalışma)
  // =========================================================================
  createHomeStudyToyAsset({
    id: 'tr-kalemlik-kirtasiye-seti',
    slug: 'masaustu-kalemlik-renkli-kalem-makas-cetvel-seti',
    name: 'Masaüstü Kalemlik & Renkli Kalem, Makas, Cetvel Kırtasiye Seti',
    brandStyle: 'Faber-Castell / Gıpta · Masaüstü Kalemlik & Kırtasiye',
    category: 'Mimari & Çalışma',
    archetype: 'tr_pen_holder_stationery_set',
    placement: 'floor',
    dimensionsCm: { width: 26, depth: 18, height: 18 },
    polyEstimate: 11200,
    thumbnailFile: 'kalemlik-kirtasiye-seti.png',
    searchKeywords: [
      'kalemlik',
      'kalem',
      'kırtasiye',
      'kirtasiye',
      'kurşun kalem',
      'renkli kalem',
      'cetvel',
      'makas',
      'faber castell',
      'masaüstü düzenleyici',
    ],
    roomTags: ['Çalışma Odası', 'Genç Odası', 'Öğrenci Masası', 'Ev Ofis'],
    aiSummary:
      'Çalışma masasına anında yaşanmışlık katan eksiksiz kalemlik ve kırtasiye seti: oluklu seramik kalemlik kupası içinde 10 adet renkli ve kurşun kalem, sarı fosforlu kalem, paslanmaz makas, 15 cm cetvel, silgi ve yanında sarı yapışkan not bloğu.',
    finishes: STUDY_STATIONERY_FINISHES,
    defaultFinishId: 'mese-seramik-krem-pirinc',
    surfaceType: 'Oluklu Mat Seramik Kalemlik + Boyalı Ahşap Kalemler + Paslanmaz Çelik Cetvel & Makas',
    geometryBreakdown: [
      'Meşe alt tabla (26×18 cm) üzerinde dikey oluklu silindirik seramik kalemlik (Ø9.5×11 cm).',
      'Kalemlik içinde farklı açılarda yerleştirilmiş 8 renkli/kurşun kalem (konik ahşap uç + grafit uç + pembe silgi detaylı), 1 neon fosforlu kalem, 1 makas ve 1 metal cetvel.',
      'Yan bölümde katmanlı sarı yapışkan not bloğu (post-it), beyaz-mavi okul silgisi ve metal ataş kabı.',
    ],
    microDetails: [
      'Her kalemin altıgen gövdesi, açılmış konik ahşap ucu ve renkli/grafit çekirdeği ayrı malzemelidir.',
      'Masa üstüne doğrudan Z=0 kotundan oturur; çalışma masası veya genç odası yakından renderlarında yüksek detay verir.',
    ],
    lightingTip:
      'Masa lambası veya pencere yan ışığıyla kalemlik oluklarında ve kalem uçlarında canlı yakın plan vurgusu yakalayın.',
  }),

  createHomeStudyToyAsset({
    id: 'tr-ahsap-masaustu-duzenleyici',
    slug: 'cok-gozlu-ahsap-masaustu-kalemlik-telefon-duzenleyici',
    name: 'Çok Gözlü Ahşap Masaüstü Kalemlik & Telefon / Defter Düzenleyici',
    brandStyle: 'Mudo Concept / IKEA TR · Ahşap Masaüstü Düzenleyici',
    category: 'Mimari & Çalışma',
    archetype: 'tr_desk_organizer_tray',
    placement: 'floor',
    dimensionsCm: { width: 34, depth: 22, height: 16 },
    polyEstimate: 10800,
    thumbnailFile: 'ahsap-masaustu-duzenleyici.png',
    searchKeywords: [
      'kalemlik',
      'masaüstü düzenleyici',
      'ahşap kalemlik',
      'evrak rafı',
      'telefon standı',
      'kırtasiye',
      'çalışma masası aksesuar',
      'mudo concept',
    ],
    roomTags: ['Ev Ofis', 'Çalışma Odası', 'Genç Odası'],
    aiSummary:
      'Mimar ve öğrenci çalışma masaları için 34 cm çok gözlü masif ahşap masaüstü düzenleyici: kademeli kalem bölmeleri, akıllı telefon standı, dikey not defteri yuvası, küçük çekmece ve içinde kalem-cetvel-kartvizit aksesuarları.',
    finishes: STUDY_STATIONERY_FINISHES,
    defaultFinishId: 'amerikan-ceviz-antrasit-altin',
    surfaceType: 'Masif Ceviz/Meşe Düzenleyici + Metal Klips + Kalem & Akıllı Telefon Aksesuarı',
    geometryBreakdown: [
      '34×22 cm kademeli çok bölmeli masif ahşap masaüstü organizer ve alt kaydırmaz baza.',
      'Arka dikey bölmede 2 adet sert kapaklı defter/dosya, sol bölmede 5 adet tükenmez/kurşun kalem ve fosforlu kalem.',
      'Ön sağda eğimli akıllı telefon standında duran modern akıllı telefon ve solda pirinç kulplu mini kırtasiye çekmecesi.',
    ],
    microDetails: [
      'Telefon ekranında saat/takvim arayüzlü sade cam parlaklık detayı.',
      'Bölmeler arası 8 mm ahşap separatörler gerçek marangoz birleşimlidir.',
    ],
    lightingTip:
      'Laptop yanına konumlandırarak gerçekçi home-office çalışma masası kompozisyonu tamamlayın.',
  }),

  createHomeStudyToyAsset({
    id: 'tr-turkce-ders-kitaplari-seti',
    slug: 'turkce-ders-kitaplari-yks-lgs-soru-bankasi-seti',
    name: "Türkçe Ders Kitapları & YKS / LGS Soru Bankası Seti (5'li Yığın + Defter)",
    brandStyle: 'MEB / Palme / 3D Yayınları · Türkçe Ders Kitapları',
    category: 'Mimari & Çalışma',
    archetype: 'tr_turkish_textbooks_stack',
    placement: 'floor',
    dimensionsCm: { width: 32, depth: 26, height: 24 },
    polyEstimate: 9800,
    thumbnailFile: 'turkce-ders-kitaplari-seti.png',
    searchKeywords: [
      'ders kitabı',
      'ders kitapları',
      'kitap',
      'kitap yığını',
      'soru bankası',
      'matematik kitabı',
      'fizik kitabı',
      'defter',
      'yks',
      'lgs',
      'okul kitabı',
    ],
    roomTags: ['Genç Odası', 'Çalışma Masası', 'Kitaplık', 'Öğrenci Odası'],
    aiSummary:
      'Türk öğrenci ve mimar çalışma masaları için gerçek Türkçe kapak ve sırt baskılı 5’li ders kitabı yığını: MATEMATİK, FİZİK, GEOMETRİ, TÜRK DİLİ & EDEBİYATI ve MİMARİ PROJE ders kitapları, üstünde telli spiralli defter ve fosforlu kalem.',
    finishes: STUDY_STATIONERY_FINISHES,
    defaultFinishId: 'lacivert-kiremit-mese',
    surfaceType: 'Mat Kuşe Baskılı Türkçe Ders Kitabı Kapağı + Krem Kağıt Sayfa Blokları + Metal Spiral',
    geometryBreakdown: [
      'Alttan üste hafif açılı dizilmiş 5 farklı kalınlıkta (2.6–3.8 cm) gerçek 21×29 cm A4/B5 ders kitabı.',
      'Her kitapta renkli kapak, krem rengi iç sayfa bloğu (hafif girintili) ve yüksek çözünürlüklü Türkçe sırt/kapak baskısı.',
      'En üstte tel spiralli kareli ders defteri, kırmızı kumaş ayraç kurdelesi ve neon sarı fosforlu kalem.',
    ],
    microDetails: [
      'Kapak ve sırtlarda okunabilir Türkçe başlıklar: MATEMATİK, FİZİK, GEOMETRİ, EDEBİYAT, MİMARİ PROJE.',
      'Sayfa blokları kapaklardan 3 mm içeride oturur; yakın plan renderlarda gerçek kitap hissi verir.',
    ],
    lightingTip:
      'Çalışma masasının sol köşesine veya kitaplık rafına yerleştirerek gerçekçi Türk öğrenci/genç odası hissi verin.',
  }),

  createHomeStudyToyAsset({
    id: 'tr-acik-ders-kitabi-calisma-seti',
    slug: 'acik-ders-kitabi-spiralli-defter-fosforlu-kalem-seti',
    name: 'Açık Ders Kitabı, Spiralli Defter, Fosforlu Kalem & Gönye Seti',
    brandStyle: 'Faber-Castell / MEB · Açık Ders Çalışma Seti',
    category: 'Mimari & Çalışma',
    archetype: 'tr_open_textbook_study_set',
    placement: 'floor',
    dimensionsCm: { width: 54, depth: 36, height: 10 },
    polyEstimate: 11600,
    thumbnailFile: 'acik-ders-kitabi-calisma-seti.png',
    searchKeywords: [
      'açık kitap',
      'ders kitabı',
      'ders kitapları',
      'spiralli defter',
      'fosforlu kalem',
      'gönye',
      'cetvel',
      'çalışma seti',
      'ödev',
    ],
    roomTags: ['Çalışma Masası', 'Genç Odası', 'Öğrenci Odası'],
    aiSummary:
      'Masa başında aktif ders çalışılıyormuş hissi veren 54 cm açık çalışma kompozisyonu: kavisli açık sayfalarında geometri şekilleri ve Türkçe formüller basılı ders kitabı, yanında kareli spiralli not defteri, fosforlu kalem, kurşun kalem ve şeffaf 45° gönye.',
    finishes: STUDY_STATIONERY_FINISHES,
    defaultFinishId: 'mese-seramik-krem-pirinc',
    surfaceType: 'Kavisli Baskılı Ders Kitabı Sayfaları + Kareli Spiralli Defter + Şeffaf Akrilik Gönye',
    geometryBreakdown: [
      'Solda açık sert kapaklı ders kitabı: gerçekçi kavisli sol-sağ sayfa profili ve yüksek çözünürlüklü geometri/matematik sayfa baskısı.',
      'Sağda metal tel spiralli açık kareli defter ve el yazısı not çizgileri.',
      'Defter üzerinde sarı fosforlu kalem, açılmış kurşun kalem, beyaz silgi ve şeffaf 45° teknik çizim gönyesi.',
    ],
    microDetails: [
      'Açık kitap sayfalarında gerçek üçgen/koordinat diyagramları ve sarı fosforlu alt çizili satırlar basılıdır.',
      'Şeffaf akrilik gönye yüzeyinde milimetrik ölçek çizgileri bulunur.',
    ],
    lightingTip:
      'Masa lambasının sıcak koni ışığını doğrudan açık kitap sayfalarına yönelterek hikaye anlatan mimari çekim yapın.',
  }),

  createHomeStudyToyAsset({
    id: 'tr-mermer-kitap-tutuculu-dizi',
    slug: 'traverten-kitap-tutuculu-14lu-roman-mimarlik-kitap-dizisi',
    name: "Traverten Kitap Tutuculu 14'lü Roman & Mimarlık Kitap Dizisi",
    brandStyle: 'Yapı Kredi / Mudo Concept · Kitap Dizisi & Kitap Tutucu',
    category: 'Mimari & Çalışma',
    archetype: 'tr_bookends_encyclopedia_row',
    placement: 'floor',
    dimensionsCm: { width: 58, depth: 22, height: 28 },
    polyEstimate: 10400,
    thumbnailFile: 'mermer-kitap-tutuculu-dizi.png',
    searchKeywords: [
      'kitap dizisi',
      'kitaplar',
      'roman',
      'kitap tutucu',
      'kitaplık aksesuarı',
      'ansiklopedi',
      'mimarlık kitapları',
      'ders kitapları',
    ],
    roomTags: ['Kitaplık', 'TV Ünitesi', 'Çalışma Odası', 'Salon'],
    aiSummary:
      'Herhangi bir kitaplık rafını, konsolu veya çalışma masasını tek tıkla dolduran 58 cm hazır kitap dizisi: sağ ve solda yarım kemer honlu traverten kitap tutucular arasında 14 adet farklı yükseklikte ciltli mimarlık, roman ve referans kitabı.',
    finishes: STUDY_STATIONERY_FINISHES,
    defaultFinishId: 'mat-beyaz-traverten-siyah',
    surfaceType: 'Honlu Traverten Kitap Tutucu + 14 Adet Keten & Ciltli Kitap Sırtı',
    geometryBreakdown: [
      'Sol ve sağ uçta yarım daire kemer formlu 2 adet ağır honlu traverten/mermer kitap tutucu.',
      'Aralarında 18–27 cm arası değişen yüksekliklerde, 14 adet ciltli kitap (2 adedi doğal 12° eğik yaslanmış).',
      'Kitap sırtlarında altın/beyaz minimalist tipografi şeritleri ve gerçek sayfa bloğu kenarları.',
    ],
    microDetails: [
      'Kitaplar tekdüze kutu değil; her kitabın yüksekliği, derinliği ve sırt rengi mimari renk armonisine göre çeşitlidir.',
      'Alt+D ile çoğaltıp kitaplık raflarını saniyeler içinde doldurabilirsiniz.',
    ],
    lightingTip:
      'Raflar boyunca farklı açılarla veya bir kısmını yatay istifleyerek doğal kütüphane ritmi oluşturun.',
  }),

  // =========================================================================
  // D. LAPTOP & BİLGİSAYAR ÇALIŞMA İSTASYONLARI (3 Model — Mimari & Çalışma)
  // =========================================================================
  createHomeStudyToyAsset({
    id: 'tr-ultrabook-laptop-mimar',
    slug: 'aluminyum-ultrabook-laptop-16-mimarlik-ekranli',
    name: '16" Alüminyum Ultrabook Laptop (Türkçe Q Klavye · 3D Mimarlık Ekranlı)',
    brandStyle: 'Apple MacBook Pro / Monster Huma · 16" Ultrabook Laptop',
    category: 'Mimari & Çalışma',
    archetype: 'tr_modern_ultrabook_laptop',
    placement: 'floor',
    dimensionsCm: { width: 36, depth: 25, height: 24 },
    polyEstimate: 12400,
    thumbnailFile: 'ultrabook-laptop-mimar.png',
    searchKeywords: [
      'laptop',
      'dizüstü bilgisayar',
      'bilgisayar',
      'macbook',
      'ultrabook',
      'notebook',
      'monster',
      'çalışma masası',
    ],
    roomTags: ['Çalışma Masası', 'Ev Ofis', 'Genç Odası', 'Salon Sehpası'],
    aiSummary:
      'Modern Türk mimar ve öğrenci masaları için 16 inç CNC alüminyum gövdeli ultrabook laptop: 112° açık ultra ince ekran, parlayan 3D mimari/Blender arayüzü, gömme Türkçe Q klavye tuşları, geniş cam trackpad, yan hoparlör ızgaraları ve USB-C portları.',
    finishes: TECH_LAPTOP_FINISHES,
    defaultFinishId: 'uzay-grisi-aluminyum-siyah',
    surfaceType: 'CNC Eloksal Alüminyum Kasa + Siyah Klavye + Parlayan 3D Arayüzlü Cam Ekran',
    geometryBreakdown: [
      '35.6×24.8×1.5 cm pahlı tek parça CNC alüminyum alt gövde, geniş cam trackpad ve ön açma çentiği.',
      'Siyah gömme klavye havuzunda yüksek çözünürlüklü Türkçe Q tuş haritası (Ç, Ğ, İ, Ö, Ş, Ü) ve yan hoparlör delikleri.',
      '112° açık 4.5 mm ince ekran kapağı, siyah cam çerçeve, üst webcam noktası ve aydınlatmalı 3D mimari viewport ekranı.',
    ],
    microDetails: [
      'Ekran yüzeyinde mimari villa 3D sahne/kat planı arayüzü yumuşak emisyonla parlar.',
      'Yan kenarlarda 2 adet USB-C portu, kulaklık jakı ve alt kauçuk ayaklar işlenmiştir.',
    ],
    lightingTip:
      'Akşam çalışma odası renderlarında laptop ekranının yumuşak mavi-beyaz ışığı masa yüzeyine gerçekçi yansıma düşürür.',
  }),

  createHomeStudyToyAsset({
    id: 'tr-stantli-laptop-klavye-seti',
    slug: 'aluminyum-stantli-laptop-klavye-mouse-kupa-seti',
    name: 'Alüminyum Stantlı Laptop + Kablosuz Klavye, Mouse & Kahve Kupası Seti',
    brandStyle: 'Apple / Logitech TR · Ergonomik Laptop Çalışma Seti',
    category: 'Mimari & Çalışma',
    archetype: 'tr_laptop_stand_workstation',
    placement: 'floor',
    dimensionsCm: { width: 64, depth: 36, height: 28 },
    polyEstimate: 15800,
    thumbnailFile: 'stantli-laptop-klavye-seti.png',
    searchKeywords: [
      'laptop',
      'laptop standı',
      'klavye',
      'mouse',
      'bilgisayar seti',
      'ev ofis',
      'home office',
      'çalışma masası seti',
      'logitech',
    ],
    roomTags: ['Ev Ofis', 'Çalışma Masası', 'Mimarlık Stüdyosu'],
    aiSummary:
      'Tek tıkla tam donanımlı modern home-office çalışma alanı: 64×36 cm antrasit keçe masa altlığı üzerinde eloksal alüminyum yükseltici stantta 15" laptop, ince kablosuz klavye, ergonomik mouse ve kulplu seramik kahve kupası.',
    finishes: TECH_LAPTOP_FINISHES,
    defaultFinishId: 'gumus-aluminyum-siyah-kece',
    surfaceType: 'Antrasit Keçe Masa Altlığı + Gümüş Alüminyum Laptop & Stant + Seramik Kupa',
    geometryBreakdown: [
      '64×36 cm yuvarlatılmış köşeli antrasit keçe masa üstü koruyucu mat.',
      'Arka merkezde 18° eğimli tek parça bükülmüş alüminyum laptop yükseltici stand ve üzerinde açık 15" ultrabook.',
      'Önde ince kablosuz klavye, sağda ergonomik kablosuz mouse ve sağ üstte sıcak kahveli seramik kupa.',
    ],
    microDetails: [
      'Kupa içinde koyu kahve sıvı yüzeyi ve ergonomik kulbu ayrı parça olarak modellenmiştir.',
      'Laptop ekranında mimari proje sunum arayüzü parlar.',
    ],
    lightingTip:
      'Çalışma masasının tam merkezine yerleştirip arkasına masa lambası ekleyerek Instagram/Behance kalitesinde home-office kadrajı alın.',
  }),

  createHomeStudyToyAsset({
    id: 'tr-cift-monitor-mimar-istasyon',
    slug: 'cift-monitorlu-mimar-ogrenci-calisma-istasyonu',
    name: 'Çift 27" Monitörlü Mimar & Öğrenci Çalışma İstasyonu (Kol + Klavye + Hoparlör)',
    brandStyle: 'LG / Dell / Monster · Çift Monitörlü Stüdyo İstasyonu',
    category: 'Mimari & Çalışma',
    archetype: 'tr_dual_monitor_desk_setup',
    placement: 'floor',
    dimensionsCm: { width: 120, depth: 44, height: 56 },
    polyEstimate: 18900,
    thumbnailFile: 'cift-monitor-mimar-istasyon.png',
    searchKeywords: [
      'monitör',
      'çift monitör',
      'bilgisayar',
      'masaüstü bilgisayar',
      'mimar bilgisayar',
      'oyuncu bilgisayarı',
      'çalışma istasyonu',
      'klavye',
      'hoparlör',
    ],
    roomTags: ['Mimarlık Ofisi', 'Ev Ofis', 'Genç Odası', 'Çalışma Odası'],
    aiSummary:
      'Mimarlar, 3D sanatçılar ve genç odaları için 120 cm profesyonel çift 27" monitörlü masaüstü istasyonu: masa kelepçeli çift eklemli monitör kolu, sol ekranda CAD kat planı / sağ ekranda 3D render görüntüsü, mekanik klavye, mouse, keçe mat ve çift stüdyo hoparlörü.',
    finishes: TECH_LAPTOP_FINISHES,
    defaultFinishId: 'mat-siyah-ceviz-studyo',
    surfaceType: 'Çerçevesiz IPS Monitörler + Mat Siyah Monitör Kolu + Stüdyo Hoparlör & Mekanik Klavye',
    geometryBreakdown: [
      'Merkezi dikey çelik direk ve iki yana uzanan mafsallı monitör kollarına asılı, hafif açılı (12°) 2 adet 27" çerçevesiz monitör.',
      'Sol ekranda mimari AutoCAD/kat planı çizimi, sağ ekranda Blender 3D villa sahnesi yüksek çözünürlüklü emisyon dokusu.',
      'Altta geniş 85×36 cm keçe masa matı, mekanik klavye, mouse ve iki yanda ahşap-siyah kompakt stüdyo monitör hoparlörleri.',
    ],
    microDetails: [
      'Monitör kolunun masaya bağlanan C-kelepçe mekanizması ve kablo kanalı işlenmiştir.',
      'Stüdyo hoparlörlerinde bakır/sarı woofer konisi ve tweeter kubbesi görünür.',
    ],
    lightingTip:
      '140–160 cm çalışma masasının merkezine yerleştirerek mimarlık ofisi veya genç odası renderlarında güçlü odak noktası oluşturun.',
  }),

  // =========================================================================
  // E. OYUNCAKLAR & KÜÇÜK ÇOCUK / BEBEK OYUNCAKLARI (6 Model — Çocuk & Oyun)
  // =========================================================================
  createHomeStudyToyAsset({
    id: 'tr-montessori-gokkusagi-blok',
    slug: 'montessori-7li-ahsap-gokkusagi-geometrik-denge-bloklari',
    name: "Montessori 7'li Ahşap Gökkuşağı & Geometrik Denge Blokları Seti",
    brandStyle: 'Woody / Montessori TR · Ahşap Gökkuşağı & Blok Seti',
    category: 'Çocuk & Oyun',
    archetype: 'tr_montessori_rainbow_blocks',
    placement: 'floor',
    dimensionsCm: { width: 42, depth: 26, height: 22 },
    polyEstimate: 11400,
    thumbnailFile: 'montessori-gokkusagi-blok.png',
    searchKeywords: [
      'oyuncak',
      'küçük çocuk oyuncakları',
      'bebek oyuncağı',
      'montessori oyuncak',
      'ahşap gökkuşağı',
      'ahşap bloklar',
      'denge blokları',
      'çocuk odası dekor',
    ],
    roomTags: ['Bebek Odası', 'Çocuk Odası', 'Oyun Köşesi'],
    aiSummary:
      'Modern Türk bebek ve çocuk odalarının imza oyuncağı: doğal huş tepsi üzerinde iç içe geçmiş 7 parçalı pastel ahşap Montessori gökkuşağı kemeri, yanında üst üste dizili geometrik ahşap küp, silindir, köprü ve üçgen denge blokları.',
    finishes: MONTESSORI_KIDS_FINISHES,
    defaultFinishId: 'dogal-hus-pastel-gokkusagi',
    surfaceType: 'Su Bazlı Pastel Boyalı Masif Kayın & Ihlamur Ahşap (CE EN71 Çocuk Güvenli)',
    geometryBreakdown: [
      '7 adet eşmerkezli yarım daire ahşap gökkuşağı kemeri (terracotta, hardal, adaçayı, gök mavisi, pudra, krem, doğal kayın).',
      'Yanında ahşap oyun tepsisi içinde 9 parçalı geometrik küp, silindir, üçgen çatı ve kemer blok kulesi.',
      'Bebek güvenliği için tüm kenarlar yumuşatılmış, doğal mat su bazlı cila (Roughness 0.56).',
    ],
    microDetails: [
      'Gökkuşağı halkaları gerçek 3D kalınlıkta yarım yay profillerinden oluşur, aralarında 2 mm doğal boşluk vardır.',
      'Halı üzerine veya Montessori raf üstüne doğrudan oturur.',
    ],
    lightingTip:
      'Oyun halısı veya çocuk kitaplığı üst rafına yerleştirerek sıcak, dergi kalitesinde bebek/çocuk odası sahnesi kurun.',
  }),

  createHomeStudyToyAsset({
    id: 'tr-ahsap-abakus-ksilofon-seti',
    slug: 'kucuk-cocuk-ahsap-abakus-ksilofon-sekil-kupu-seti',
    name: 'Küçük Çocuk Ahşap Abaküs, 8 Tuşlu Ksilofon & Şekil Eşleştirme Küpü Seti',
    brandStyle: 'Bino / Montessori TR · Erken Gelişim Ahşap Oyuncak Seti',
    category: 'Çocuk & Oyun',
    archetype: 'tr_toddler_wooden_abacus_xylophone',
    placement: 'floor',
    dimensionsCm: { width: 52, depth: 28, height: 26 },
    polyEstimate: 14600,
    thumbnailFile: 'ahsap-abakus-ksilofon-seti.png',
    searchKeywords: [
      'küçük çocuk oyuncakları',
      'bebek oyuncağı',
      'oyuncak',
      'abaküs',
      'ksilofon',
      'şekil eşleştirme',
      'ahşap oyuncak',
      'montessori',
      'eğitici oyuncak',
    ],
    roomTags: ['Bebek Odası', 'Çocuk Odası', 'Kreş', 'Oyun Halısı'],
    aiSummary:
      '1–4 yaş küçük çocuklar için 3’ü 1 arada erken gelişim ahşap oyuncak seti: 4 sıralı 28 renkli boncuklu masif kayın abaküs, 8 renkli metal tuşlu ve tokmaklı ksilofon, yanında ahşap şekil eşleştirme (bultak) küpü.',
    finishes: MONTESSORI_KIDS_FINISHES,
    defaultFinishId: 'iskandinav-beyaz-kayin-hardal',
    surfaceType: 'Masif Kayın Çerçeve + Pastel Ahşap Boncuklar + Renkli Metal Ksilofon Tuşları',
    geometryBreakdown: [
      'Sol tarafta A-çerçeveli masif kayın çocuk abaküsü: 4 paslanmaz çelik çubuk üzerinde dağınık dizili 28 adet renkli ahşap boncuk.',
      'Ön merkezde yamuk ahşap kasalı 8 renkli tuşlu çocuk ksilofonu ve 2 adet yuvarlak başlı ahşap tokmak.',
      'Sağ tarafta üstünde yıldız/daire/üçgen/kare delikleri olan ahşap bultak küpü ve yanında duran renkli blok parçaları.',
    ],
    microDetails: [
      'Abaküs boncukları rastgele doğal gruplara kaydırılmış halde modellenmiştir (yapay simetri yok).',
      'Ksilofon tuşları soldan sağa gerçek nota boyuna göre kısalır ve gökkuşağı tonlarında sıralanır.',
    ],
    lightingTip:
      'Çocuk odası oyun halısının ortasına veya tipi çadır girişine yerleştirerek doğal yaşam izi katın.',
  }),

  createHomeStudyToyAsset({
    id: 'tr-cocuk-oyun-cadiri-tipi',
    slug: 'cocuk-odasi-tipi-oyun-cadiri-minderli-yildiz-ledli',
    name: "Çocuk Odası Oyun Çadırı (Tipi Çadır · Kapitone Minder, Yastık & Yıldız LED'li)",
    brandStyle: 'Mamma / Trendyol Butik TR · Çocuk Tipi Oyun Çadırı',
    category: 'Çocuk & Oyun',
    archetype: 'tr_kids_teepee_play_tent',
    placement: 'floor',
    dimensionsCm: { width: 125, depth: 125, height: 155 },
    polyEstimate: 16400,
    thumbnailFile: 'cocuk-oyun-cadiri-tipi.png',
    searchKeywords: [
      'oyun çadırı',
      'tipi çadır',
      'çocuk çadırı',
      'çocuk odası',
      'bebek odası',
      'oyuncak',
      'montessori çadır',
    ],
    roomTags: ['Çocuk Odası', 'Bebek Odası', 'Oyun Odası'],
    aiSummary:
      'Türkiye’de çocuk odası iç mimari projelerinin en çok sevilen odak noktası 125×155 cm pamuklu tipi oyun çadırı: 4 adet masif kayın sırık, bağlanmış açık ön kanatlar, yuvarlak kapitone oyun minderi, 2 pastel yastık ve sıcak LED ışık zinciri.',
    finishes: MONTESSORI_KIDS_FINISHES,
    defaultFinishId: 'krem-keten-ceviz-zeytin',
    surfaceType: 'Ham Pamuklu Kanvas Kumaş + Masif Kayın Sırıklar + Kapitone Minder & Sıcak LED',
    geometryBreakdown: [
      'Tepede ip sargıyla birleşen 4 adet doğal kayın çadır direği (155 cm) ve çapraz tepe uçları.',
      '3 kapalı yan/arka pamuklu kanvas panel, yan pencere detayı ve iki yana kurdeleyle toplanmış açık ön giriş kanatları.',
      'İçeride kalın kapitone pamuk oyun minderi, 2 adet pastel renkli dekoratif yastık (biri yıldız/bulut tonlu) ve girişte sıcak 2700K mini LED ışık zinciri.',
    ],
    microDetails: [
      'Giriş kenarında 7 adet sıcak parlayan küresel peri LED lambacığı akşam renderlarında büyülü atmosfer yaratır.',
      'Çadır tepesinde pamuklu sargı ipi ve renkli üçgen flama detayları bulunur.',
    ],
    lightingTip:
      'Çocuk odası köşesine konumlandırıp içine yumuşak sıcak nokta ışık (2700K) ekleyerek okuma ve oyun köşesi vurgusu yapın.',
  }),

  createHomeStudyToyAsset({
    id: 'tr-ahsap-cocuk-oyun-mutfagi',
    slug: 'ahsap-montessori-cocuk-oyun-mutfagi-ocakli-firinli',
    name: 'Ahşap Montessori Çocuk Oyun Mutfağı (Ocaklı, Fırınlı, Lavabolu & Tencereli)',
    brandStyle: 'IKEA Duktig / Montessori TR · Ahşap Çocuk Oyun Mutfağı',
    category: 'Çocuk & Oyun',
    archetype: 'tr_wooden_kids_play_kitchen',
    placement: 'floor',
    dimensionsCm: { width: 78, depth: 38, height: 102 },
    polyEstimate: 16900,
    thumbnailFile: 'ahsap-cocuk-oyun-mutfagi.png',
    searchKeywords: [
      'oyun mutfağı',
      'çocuk mutfağı',
      'ahşap mutfak oyuncağı',
      'oyuncak',
      'küçük çocuk oyuncakları',
      'montessori mutfak',
      'ikea duktig',
    ],
    roomTags: ['Çocuk Odası', 'Oyun Odası', 'Kreş'],
    aiSummary:
      '2–6 yaş çocuk odaları için 78×102 cm ahşap Montessori çocuk oyun mutfağı: çift gözlü oyuncak indüksiyon ocak, çevirmeli ahşap düğmeler, pencereli mini fırın ve mikrodalga kapağı, paslanmaz çanak lavabo + musluk, askıda ahşap kepçe ve mini tencere.',
    finishes: MONTESSORI_KIDS_FINISHES,
    defaultFinishId: 'dogal-hus-pastel-gokkusagi',
    surfaceType: 'Doğal Huş & Pastel Lake Gövde + Paslanmaz Mini Evye + Ahşap Mutfak Aksesuarları',
    geometryBreakdown: [
      'Alt ünite (Y=52 cm): sol tarafta cam pencereli mini oyuncak fırın + 3 çevirmeli ahşap düğme, sağda raflı dolap.',
      'Tezgah üstü: sol tarafta 2 kırmızı halkalı oyuncak ocak ve mini tencere, sağda gömme paslanmaz evye ve kavisli ahşap musluk.',
      'Üst ünite (Y=52–102 cm): askı borusunda 3 ahşap kepçe/spatula, üst mini mikrodalga bölmesi ve açık baharat rafı.',
    ],
    microDetails: [
      'Ocak üzerinde kapaklı minik tencere ve tava hazır olarak durur.',
      'Çocuk boyuna uygun 52 cm tezgah yüksekliğiyle 1:1 gerçek orantıdadır.',
    ],
    lightingTip:
      'Çocuk odası duvarı önüne Montessori kitaplık ve oyuncak dolabıyla birlikte hizalayarak eksiksiz oyun duvarı kurun.',
  }),

  createHomeStudyToyAsset({
    id: 'tr-9kutulu-oyuncak-dolabi',
    slug: '9-kutulu-cocuk-odasi-oyuncak-dolabi-montessori-duzenleyici',
    name: '9 Kutulu Çocuk Odası Oyuncak Dolabı & Montessori Düzenleyici (92×84 cm)',
    brandStyle: 'IKEA Trofast / Çilek · 9 Kutulu Oyuncak Dolabı',
    category: 'Çocuk & Oyun',
    archetype: 'tr_kids_toy_storage_organizer',
    placement: 'floor',
    dimensionsCm: { width: 92, depth: 36, height: 84 },
    polyEstimate: 13800,
    thumbnailFile: '9kutulu-oyuncak-dolabi.png',
    searchKeywords: [
      'oyuncak dolabı',
      'oyuncak düzenleyici',
      'çocuk dolabı',
      'trofast',
      'montessori dolap',
      'oyuncak kutusu',
      'çocuk odası',
    ],
    roomTags: ['Çocuk Odası', 'Oyun Odası', 'Bebek Odası'],
    aiSummary:
      'Çocuk odalarını derli toplu gösteren 92×84 cm 9 kutulu ahşap oyuncak düzenleyici dolap: masif kayın/beyaz iskelet içinde 3×3 düzeninde çıkarılabilir pastel saklama kasaları (terracotta, adaçayı, hardal, krem), içlerinden taşan ahşap bloklar ve üst sergileme tablası.',
    finishes: MONTESSORI_KIDS_FINISHES,
    defaultFinishId: 'iskandinav-beyaz-kayin-hardal',
    surfaceType: 'Masif Kayın İskelet + 9 Pastel Mat Saklama Kutusu + Üst Dekoratif Oyuncaklar',
    geometryBreakdown: [
      '92×36×84 cm masif ahşap yan duvarlar, 2 iç dikey bölücü ve raylı kutu kanalları.',
      '3 sütun × 3 satır düzeninde toplam 9 adet çıkarılabilir kulp oyuklu pastel oyuncak kutusu (üst kutular hafif aralık ve içi dolu).',
      'Üst tabla üzerinde 2 adet ahşap oyuncak blok kulesi ve küçük dekoratif oyuncak araba.',
    ],
    microDetails: [
      'Kutuların biri hafif öne çekilmiş ve içinde renkli ahşap bloklar görünecek şekilde gerçekçi kurgulanmıştır.',
      'Üst kenarlarda çocuk güvenliği için yuvarlatılmış masif kenar profili.',
    ],
    lightingTip:
      'Çocuk karyolası veya pencere altı duvarına yerleştirerek pratik ve renkli bir çocuk odası depolama alanı oluşturun.',
  }),

  createHomeStudyToyAsset({
    id: 'tr-3katli-ahsap-bebek-evi',
    slug: '3-katli-ahsap-bebek-evi-mini-mobilyali-catili',
    name: '3 Katlı Ahşap Bebek Evi (Pencereli, Çatılı & Mini Mobilyalı, 68×88 cm)',
    brandStyle: 'Çilek / Montessori Ahşap · 3 Katlı Ahşap Bebek Evi',
    category: 'Çocuk & Oyun',
    archetype: 'tr_wooden_dollhouse_3story',
    placement: 'floor',
    dimensionsCm: { width: 68, depth: 34, height: 88 },
    polyEstimate: 16500,
    thumbnailFile: '3katli-ahsap-bebek-evi.png',
    searchKeywords: [
      'bebek evi',
      'ahşap bebek evi',
      'oyuncak ev',
      'oyuncak',
      'küçük çocuk oyuncakları',
      'çocuk odası oyuncağı',
      'montessori oyuncak',
    ],
    roomTags: ['Çocuk Odası', 'Oyun Odası', 'Bebek Odası'],
    aiSummary:
      'İskandinav çocuk odalarının favorisi 68×88 cm 3 katlı açık cepheli ahşap bebek evi: kırma çatı ve baca detayı, yan pencereler, katlar arası mini ahşap merdivenler ve odaların içinde minyatür koltuk, masa, yatak ve lamba mobilyaları.',
    finishes: MONTESSORI_KIDS_FINISHES,
    defaultFinishId: 'pudra-pembe-krem-kayin',
    surfaceType: 'Doğal Kayın & Pastel Kırma Çatılı Ahşap + 3 Katlı Minyatür Mobilyalı Odalar',
    geometryBreakdown: [
      'Zemin kat (salon & mutfak), 1. kat (oturma & oyun), çatı katı (yatak odası) olmak üzere 3 katlı açık ön cephe mimarisi.',
      'Pastel renkli 35° kırma çatı, çatı penceresi (dormer), baca ve yan duvarlarda pervazlı mini pencereler.',
      'İç mekanlarda minyatür ahşap yatak, masa + 2 tabure, kanepe, katlar arası 2 adet mini merdiven ve duvar kağıdı tonlamalı arka duvarlar.',
    ],
    microDetails: [
      'Her odanın arka duvarı farklı yumuşak pastel tonda boyanarak mimari derinlik kazandırılmıştır.',
      'Minyatür mobilyalar gerçek oranlarda 3D olarak odaların içinde yer alır.',
    ],
    lightingTip:
      'Çocuk odası duvar kenarına koyarak hem eğitici oyuncak hem de göz alıcı mimari çocuk odası dekoru olarak kullanın.',
  }),
];

export const TURKISH_HOME_STUDY_TOYS_ASSET_IDS = new Set<string>(
  TURKISH_HOME_STUDY_TOYS_ASSETS.map((a) => a.id),
);
