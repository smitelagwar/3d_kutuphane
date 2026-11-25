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
    materialKind: params.materialKind,
    primaryHex: params.partFinishes.primary.hex,
    secondaryHex: params.partFinishes.secondary.hex,
    accentHex: params.partFinishes.accent.hex,
    roughness: params.partFinishes.primary.roughness,
    metalness: params.partFinishes.primary.metalness,
    paletteRecolorMode: 'multi-part-retail',
    comboRole: params.comboRole,
    partFinishes: params.partFinishes,
  };
}

// ============================================================================
// TURKISH ELECTRICAL INSTALLATION & ARCHITECTURAL LIGHTING FINISH BANKS
// ============================================================================

const ELECTRICAL_PANEL_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'pano-beyaz-fume-kapak',
    label: 'RAL 9003 Beyaz · Füme Polikarbon Kapak',
    comboSummary: 'Kasa: RAL 9003 Halojensiz ABS · Kapak: Füme Şeffaf · İç Ray: Galvaniz Çelik',
    materialKind: 'ceramic',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#F3F5F8', roughness: 0.24, metalness: 0.04, partLabel: 'RAL 9003 Beyaz Kasa' },
      secondary: { hex: '#DFE4EC', roughness: 0.36, metalness: 0.08, partLabel: 'İç Şasi & DIN Modüller' },
      accent: { hex: '#2563EB', roughness: 0.32, metalness: 0.16, partLabel: 'Sigorta Mandal & LED' },
      glass: { hex: '#374151', opacity: 0.34, roughness: 0.08 },
    },
  }),
  makeFinish({
    id: 'pano-antrasit-fume',
    label: 'Mimari Antrasit (RAL 7016) · Koyu Füme',
    comboSummary: 'Kasa: RAL 7016 Antrasit · Kapak: Koyu Füme · Bağlantı: Krom/Bakır',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#323741', roughness: 0.36, metalness: 0.28, partLabel: 'Antrasit Kasa' },
      secondary: { hex: '#22262E', roughness: 0.42, metalness: 0.24, partLabel: 'İç Şasi' },
      accent: { hex: '#0EA5E9', roughness: 0.3, metalness: 0.2, partLabel: 'Otomat & Durum LED' },
      glass: { hex: '#1F2937', opacity: 0.44, roughness: 0.07 },
    },
  }),
  makeFinish({
    id: 'pano-endustriyel-ral7035',
    label: 'Endüstriyel IP65 Açık Gri (RAL 7035)',
    comboSummary: 'Kasa: RAL 7035 Açık Gri Çelik/ABS · Kapak: Şeffaf Conta Korumalı',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#CBD2DC', roughness: 0.38, metalness: 0.22, partLabel: 'RAL 7035 Gri Gövde' },
      secondary: { hex: '#94A3B8', roughness: 0.42, metalness: 0.38, partLabel: 'Galvaniz İç Plaka' },
      accent: { hex: '#0D9488', roughness: 0.34, metalness: 0.16, partLabel: 'Siemens/Schneider Mandal' },
      glass: { hex: '#475569', opacity: 0.3, roughness: 0.08 },
    },
  }),
  makeFinish({
    id: 'pano-mat-siyah-rack',
    label: 'Mat Siyah (RAL 9005) · Temperli Füme Cam',
    comboSummary: 'Kasa: RAL 9005 Elektrostatik Siyah Çelik · Ön Kapak: Temperli Cam',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#1E222A', roughness: 0.36, metalness: 0.56, partLabel: 'RAL 9005 Siyah Çelik' },
      secondary: { hex: '#2B303B', roughness: 0.4, metalness: 0.48, partLabel: '19" Montaj Dikmeleri' },
      accent: { hex: '#22C55E', roughness: 0.25, metalness: 0.12, partLabel: 'Aktif Port LED & Kilit' },
      glass: { hex: '#111827', opacity: 0.28, roughness: 0.06 },
    },
  }),
  makeFinish({
    id: 'pano-sicak-krem-villa',
    label: 'Villa Sıcak Krem · Bronz Şeffaf Kapak',
    comboSummary: 'Kasa: Sıcak Krem Polikarbon · Kapak: Bronz Şeffaf · Bara: Bakır',
    materialKind: 'ceramic',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#EFE9DD', roughness: 0.26, metalness: 0.04, partLabel: 'Sıcak Krem Çerçeve' },
      secondary: { hex: '#DDD5C5', roughness: 0.36, metalness: 0.06, partLabel: 'İç Kasa' },
      accent: { hex: '#B45309', roughness: 0.28, metalness: 0.78, partLabel: 'Bakır Bara & Mandal' },
      glass: { hex: '#57534E', opacity: 0.32, roughness: 0.08 },
    },
  }),
];

const BREAKER_DIN_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'otomat-siemens-turkuaz',
    label: 'Siemens 5SL6 / 5SV · Gri Gövde · Turkuaz/Siyah',
    comboSummary: 'Gövde: RAL 7035 Teknik Gri · Kaçak Akım: Siemens Turkuaz · DIN Ray: Galvaniz',
    materialKind: 'ceramic',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#E8ECF1', roughness: 0.3, metalness: 0.06, partLabel: 'Siemens Modül Gövde' },
      secondary: { hex: '#94A3B8', roughness: 0.26, metalness: 0.88, partLabel: '35 mm Çelik DIN Ray' },
      accent: { hex: '#0D9488', roughness: 0.3, metalness: 0.14, partLabel: 'Siemens 30mA Turkuaz Mandal' },
    },
  }),
  makeFinish({
    id: 'otomat-schneider-yesil',
    label: 'Schneider Easy9 / Acti9 · Beyaz · Yeşil',
    comboSummary: 'Gövde: Schneider Beyaz · Ana/Kaçak Akım Mandalı: Schneider Yeşil · Ray: Çelik',
    materialKind: 'ceramic',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#F4F6F8', roughness: 0.26, metalness: 0.04, partLabel: 'Schneider Beyaz Gövde' },
      secondary: { hex: '#9CA3AF', roughness: 0.28, metalness: 0.86, partLabel: 'Galvaniz DIN Ray' },
      accent: { hex: '#16A34A', roughness: 0.3, metalness: 0.12, partLabel: 'Schneider Yeşil Mandal' },
    },
  }),
  makeFinish({
    id: 'otomat-abb-mavi-kirmizi',
    label: 'ABB System Pro M · Açık Gri · Mavi/Kırmızı',
    comboSummary: 'Gövde: ABB Açık Gri · Otomat Mandalı: Lacivert/Kırmızı · Bara: Bakır',
    materialKind: 'ceramic',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#E5E7EB', roughness: 0.32, metalness: 0.06, partLabel: 'ABB Teknik Gövde' },
      secondary: { hex: '#A1A1AA', roughness: 0.26, metalness: 0.88, partLabel: 'DIN Ray & Klemens' },
      accent: { hex: '#DC2626', roughness: 0.32, metalness: 0.14, partLabel: 'ABB Kırmızı/Mavi Mandal' },
    },
  }),
  makeFinish({
    id: 'otomat-legrand-mavi',
    label: 'Legrand TX3 / DX3 · Beyaz · Kobalt Mavi',
    comboSummary: 'Gövde: Legrand Beyaz · Kaçak Akım & Otomat Mandalı: Kobalt Mavi',
    materialKind: 'ceramic',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#F1F5F9', roughness: 0.28, metalness: 0.05, partLabel: 'Legrand Gövde' },
      secondary: { hex: '#94A3B8', roughness: 0.28, metalness: 0.86, partLabel: '35 mm DIN Ray' },
      accent: { hex: '#2563EB', roughness: 0.3, metalness: 0.15, partLabel: 'Kobalt Mavi Mandal' },
    },
  }),
  makeFinish({
    id: 'otomat-chint-viko-antrasit',
    label: 'Viko / Chint · Teknik Beyaz · Antrasit Mandal',
    comboSummary: 'Gövde: Teknik Beyaz · Mandallar: Koyu Antrasit & Sarı Test Tuşu',
    materialKind: 'ceramic',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#ECEFF3', roughness: 0.3, metalness: 0.05, partLabel: 'Viko Modüler Gövde' },
      secondary: { hex: '#8B95A5', roughness: 0.28, metalness: 0.85, partLabel: 'Çelik DIN Ray' },
      accent: { hex: '#1E293B', roughness: 0.36, metalness: 0.18, partLabel: 'Antrasit Mandal' },
    },
  }),
];

const ARCHITECTURAL_SPOT_LED_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'spot-mat-beyaz-3000k',
    label: 'Mat Beyaz Alüminyum · 3000K Gün Işığı LED',
    comboSummary: 'Gövde: RAL 9016 Mat Beyaz Alüminyum · Reflektör: Koyu Antrasit · Işık: 3000K Sıcak',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#F3F4F6', roughness: 0.32, metalness: 0.25, partLabel: 'Mat Beyaz Alüminyum Gövde' },
      secondary: { hex: '#232730', roughness: 0.4, metalness: 0.55, partLabel: 'Anti-Glare İç Reflektör' },
      accent: { hex: '#FFE4B5', roughness: 0.12, metalness: 0.0, partLabel: '3000K Sıcak Gün Işığı LED' },
    },
  }),
  makeFinish({
    id: 'spot-mat-siyah-3000k',
    label: 'Mat Siyah Alüminyum · 3000K Gün Işığı LED',
    comboSummary: 'Gövde: RAL 9005 Mat Siyah · Reflektör: Fırçalı Gold/Siyah · Işık: 3000K Sıcak',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#1E2128', roughness: 0.34, metalness: 0.68, partLabel: 'Mat Siyah Alüminyum' },
      secondary: { hex: '#2E323C', roughness: 0.38, metalness: 0.72, partLabel: 'İç Optik Baffle' },
      accent: { hex: '#FFDFA6', roughness: 0.12, metalness: 0.0, partLabel: '3000K Sıcak LED' },
    },
  }),
  makeFinish({
    id: 'spot-siyah-gold-reflektor',
    label: 'Mat Siyah · Fırçalı Gold Reflektör · 2700K',
    comboSummary: 'Çerçeve: Mat Siyah · İç Reflektör: Fırçalı Pirinç Gold · Işık: 2700K Villa Sıcak',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#20232B', roughness: 0.34, metalness: 0.7, partLabel: 'Mat Siyah Çerçeve' },
      secondary: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Gold Reflektör' },
      accent: { hex: '#FFD699', roughness: 0.14, metalness: 0.0, partLabel: '2700K Amber LED' },
    },
  }),
  makeFinish({
    id: 'spot-eloksal-gumus-4000k',
    label: 'Eloksal Gümüş Alüminyum · 4000K Doğal Beyaz',
    comboSummary: 'Profil/Gövde: Eloksal Gümüş Alüminyum · Difüzör: Opal · Işık: 4000K Nötr Beyaz',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#C7CDD6', roughness: 0.24, metalness: 0.88, partLabel: 'Eloksal Gümüş Alüminyum' },
      secondary: { hex: '#4B5563', roughness: 0.36, metalness: 0.72, partLabel: 'Soğutucu Kanatçık' },
      accent: { hex: '#F8FAFC', roughness: 0.12, metalness: 0.0, partLabel: '4000K Doğal Beyaz LED' },
    },
  }),
  makeFinish({
    id: 'spot-mat-beyaz-gold-3000k',
    label: 'Mat Beyaz · Şampanya Gold İç Halka · 3000K',
    comboSummary: 'Gövde: RAL 9016 Mat Beyaz · İç Halka: Şampanya Gold · Işık: 3000K Gün Işığı',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#F5F5F2', roughness: 0.3, metalness: 0.2, partLabel: 'Mat Beyaz Gövde' },
      secondary: { hex: '#C9A86A', roughness: 0.24, metalness: 0.92, partLabel: 'Şampanya Gold İç Baffle' },
      accent: { hex: '#FFE6BD', roughness: 0.12, metalness: 0.0, partLabel: '3000K Gün Işığı LED' },
    },
  }),
];

const LUXURY_CHANDELIER_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'avize-fircali-pirinc-3000k',
    label: 'Fırçalı Altın Pirinç · Opal Beyaz · 3000K',
    comboSummary: 'Gövde: Fırçalı Altın Pirinç PVD · Cam/Difüzör: Opal Beyaz · Işık: 3000K Sıcak',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Altın Pirinç' },
      secondary: { hex: '#F8F4EA', roughness: 0.14, metalness: 0.02, partLabel: 'Opal Cam / Silikon Difüzör' },
      accent: { hex: '#FFE2AE', roughness: 0.1, metalness: 0.0, partLabel: '3000K Sıcak LED Işık' },
    },
  }),
  makeFinish({
    id: 'avize-mat-siyah-gold',
    label: 'Mat Siyah Metal · Pirinç Detay · 3000K',
    comboSummary: 'Gövde: Mat Siyah Elektrostatik · Bağlantı: Pirinç · Cam: Opal/Füme · 3000K',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#1F232B', roughness: 0.34, metalness: 0.74, partLabel: 'Mat Siyah Metal' },
      secondary: { hex: '#F5EFE4', roughness: 0.16, metalness: 0.02, partLabel: 'Opal Difüzör Cam' },
      accent: { hex: '#FFE0A3', roughness: 0.1, metalness: 0.0, partLabel: '3000K Gün Işığı' },
    },
  }),
  makeFinish({
    id: 'avize-saten-bronz-amber',
    label: 'Saten Bronz · Bal Amber Cam · 2700K',
    comboSummary: 'Gövde: Saten Mimari Bronz · Cam: Bal Amber · Işık: 2700K Sıcak Villa',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#8D6942', roughness: 0.28, metalness: 0.88, partLabel: 'Saten Mimari Bronz' },
      secondary: { hex: '#E8C589', roughness: 0.14, metalness: 0.05, partLabel: 'Bal Amber Cam' },
      accent: { hex: '#FFD28A', roughness: 0.1, metalness: 0.0, partLabel: '2700K Sıcak Işık' },
    },
  }),
  makeFinish({
    id: 'avize-parlak-krom-kristal',
    label: 'Parlak Krom · Kristal Opal · 4000K',
    comboSummary: 'Gövde: Ayna Parlak Krom · Difüzör: Kristal Opal · Işık: 4000K Doğal Beyaz',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#E2E7EE', roughness: 0.1, metalness: 0.97, partLabel: 'Parlak Krom' },
      secondary: { hex: '#F8FAFC', roughness: 0.12, metalness: 0.04, partLabel: 'Kristal Opal Cam' },
      accent: { hex: '#FFF6E5', roughness: 0.1, metalness: 0.0, partLabel: '4000K Nötr LED' },
    },
  }),
  makeFinish({
    id: 'avize-fume-gunmetal-fume',
    label: 'Füme Gunmetal · Füme Cam · 3000K',
    comboSummary: 'Gövde: Füme Gunmetal PVD · Cam: Füme Reflektif · Işık: 3000K Gün Işığı',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#4B525E', roughness: 0.24, metalness: 0.9, partLabel: 'Füme Gunmetal' },
      secondary: { hex: '#CBD5E1', roughness: 0.14, metalness: 0.15, partLabel: 'Füme Şeffaf Cam' },
      accent: { hex: '#FFE4B5', roughness: 0.1, metalness: 0.0, partLabel: '3000K LED' },
    },
  }),
];

function createElectricalLightingAsset(params: {
  id: string;
  slug: string;
  name: string;
  brandStyle: string;
  category: AssetCategory;
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
  const first = params.finishes[0];
  return {
    id: params.id,
    slug: params.slug,
    name: params.name,
    brandStyle: params.brandStyle,
    category: params.category,
    archetype: params.archetype,
    placement: params.placement,
    dimensionsCm: params.dimensionsCm,
    polyEstimate: params.polyEstimate,
    renderEngines: ['Cycles', 'EEVEE'],
    uvUnwrapped: true,
    thumbnailUrl: params.thumbnailUrl,
    searchKeywords: params.searchKeywords,
    roomTags: params.roomTags,
    aiSummary: params.aiSummary,
    defaultFinishId: first.id,
    defaultPatternId: ARCHITECTURAL_PBR_PATTERNS[0].id,
    patterns: ARCHITECTURAL_PBR_PATTERNS,
    finishes: params.finishes,
    modelingSpec: {
      geometryBreakdown: [
        `Gerçek 1:1 Türkiye standardı metrik ölçüler: ${width} cm genişlik × ${depth} cm derinlik × ${height} cm yükseklik.`,
        ...params.geometryBreakdown,
      ],
      textureAndMaps: {
        surfaceType: params.surfaceType,
        uvTileCm: '1:1 Metrik UV + Yüksek Çözünürlüklü Marka/Teknik Etiket & Emissive LED',
        bumpDepthMm: '0.5 – 2.5 mm',
        roughnessRange: '0.06 – 0.45 (Çok Parçalı Elektrik & Mimari Aydınlatma PBR)',
        shaderRecipe:
          'Principled BSDF: Gövde (alüminyum/polikarbon/pirinç), cam/difüzör (Transmission/Roughness), teknik etiketler ve 2700K–4000K Emission ışık katmanları ayrı malzeme slotlarındadır.',
      },
      microDetails: [
        ...params.microDetails,
        `1:1 metrik Türkiye montaj ölçüsü (${width}×${depth}×${height} cm) ve Blender Cycles/EEVEE uyumlu ışık/malzeme kurgusu.`,
      ],
      blenderModifiers: [
        'Bevel (Width: 0.001 – 0.0025 m, Segments: 2) + WeightedNormal ile keskin endüstriyel & mimari kenarlar.',
        'Aydınlatma armatürlerinde LED difüzörlere Emission (Strength 6–14, Blackbody 3000K) + isteğe bağlı IES/Area Light eşleştirin.',
      ],
      lightingAndCameraTip: params.lightingTip,
      aiRenderPrompt: `Photorealistic Blender Cycles architectural visualization of ${params.name} (${params.brandStyle}), exact metric dimensions ${width}x${depth}x${height}cm, authentic Turkish residential electrical & architectural lighting detail, crisp PBR materials and realistic warm 3000K LED emission, 8k.`,
      aiBlenderMasterPrompt: `Blender 4.x sahnesine "${params.name}" (${width}×${depth}×${height} cm) Türk standardı 3D varlığını yerleştir. Çok parçalı PBR gövde, teknik baskı ve ışık yayılım (Emission/Area Light) düğümlerini koru.`,
    },
    modelSource: {
      provider: 'procedural',
      license: 'MimarKatalog CAD',
    },
    sourceOrigin: 'catalog',
  };
}

// ============================================================================
// 14 NEW BESPOKE TURKISH ELECTRICAL INSTALLATION & ARCHITECTURAL LIGHTING ASSETS
// (5 Electrical Panels / Breakers / Data Panels + 9 Drywall Spots, LED Strips & Chandeliers)
// ============================================================================

export const TURKISH_ELECTRICAL_LIGHTING_ASSETS: ArchitecturalAsset[] = [
  // ==========================================================================
  // A. ELEKTRİK TESİSATI (5 New Specialized Turkish Standards)
  // ==========================================================================

  // 1. Viko by Panasonic 12'li Sıva Üstü Sigorta Kutusu (IP40)
  createElectricalLightingAsset({
    id: 'tr-viko-siva-ustu-sigorta-kutusu-12',
    slug: 'viko-12li-siva-ustu-sigorta-kutusu-ip40',
    name: "Viko by Panasonic 12'li Sıva Üstü Sigorta Kutusu (IP40 · 28×10×22 cm)",
    brandStyle: 'Viko by Panasonic · Sıva Üstü 12 Modül IP40 Sigorta Panosu (TS EN 60670)',
    category: 'Elektrik Tesisatı',
    archetype: 'tr_surface_fuse_box',
    placement: 'wall-mounted',
    dimensionsCm: { width: 28, depth: 10, height: 22, mountHeight: 165 },
    polyEstimate: 9400,
    thumbnailUrl: '/assets/turkish-gaps/viko-12li-siva-ustu-sigorta-kutusu.png',
    searchKeywords: [
      'sigorta kutusu',
      'sıva üstü sigorta kutusu',
      '12li sigorta kutusu',
      'viko',
      'elektrik tesisatı',
      'ip40',
      'pano',
      'garaj',
      'bodrum',
      'teknik oda',
    ],
    roomTags: ['Teknik Oda', 'Garaj', 'Balkon', 'Bodrum', 'Kazan Dairesi'],
    aiSummary:
      "TS EN 60670-24 uyumlu, 650°C alev geciktirici halojensiz ABS gövdeli Viko 12'li sıva üstü sigorta kutusu (IP40 · 28×10×22 cm). Üst/alt Ø20 mm kablo rakoru girişleri, yukarı açılır füme şeffaf kapak, 35 mm çelik DIN rayı, 30mA kaçak akım rölesi + 10 adet B16/C25 otomat ve pirinç nötr/topraklama baralarıyla eksiksiz.",
    finishes: ELECTRICAL_PANEL_FINISHES,
    surfaceType: 'Halojensiz ABS Sıva Üstü Kasa + Füme Şeffaf Kapak + Pirinç N/PE Baraları',
    geometryBreakdown: [
      'Duvar yüzeyine 10 cm derinlikle tam oturan sıva üstü kasa, üst/alt kablo giriş rakorları (PG16/M20) ve duvar montaj kulakları.',
      'Tek sıra 12 modül 35 mm DIN ray üzerinde 40A 30mA kaçak akım rölesi (2 modül) + 10 adet C16/B16 otomatik sigorta ve Türkçe devre etiketi.',
      'Üstte bakır/pirinç topraklama (PE) ve mavi nötr (N) klemens barası ile yukarı menteşeli füme polikarbon kapak.',
    ],
    microDetails: [
      'Ön üst çerçevede VIKO · IP40 · 12 MODÜL baskısı ve devre etiket şeridi (KAÇAK AKIM · KOMBİ · AYDINLATMA · PRİZ · BAHÇE).',
    ],
    lightingTip: 'Garaj, teknik oda veya tadilat duvarında yerden 165 cm kotta, üstten inen kablo kanalıyla birlikte konumlandırın.',
  }),

  // 2. Legrand Practibox3 36'lı (3×12) Sıva Altı Villa Sigorta Panosu
  createElectricalLightingAsset({
    id: 'tr-legrand-siva-alti-sigorta-kutusu-36',
    slug: 'legrand-practibox3-36li-siva-alti-villa-sigorta-panosu',
    name: "Legrand Practibox3 36'lı (3×12) Sıva Altı Villa Sigorta Panosu (34×11×56 cm)",
    brandStyle: 'Legrand · Practibox3 3 Sıra 36 Modül Trifaze Villa Dağıtım Panosu',
    category: 'Elektrik Tesisatı',
    archetype: 'tr_fuse_box',
    placement: 'wall-mounted',
    dimensionsCm: { width: 34, depth: 11, height: 56, mountHeight: 155 },
    polyEstimate: 14600,
    thumbnailUrl: '/assets/turkish-gaps/legrand-36li-siva-alti-villa-sigorta-panosu.png',
    searchKeywords: [
      'sigorta kutusu',
      'sıva altı sigorta kutusu',
      '36lı sigorta kutusu',
      'legrand',
      'practibox',
      'villa sigorta panosu',
      'trifaze pano',
      'elektrik tesisatı',
      'elektrik mühendisliği',
    ],
    roomTags: ['Villa Antre', 'Elektrik Şaftı', 'Koridor', 'Akıllı Ev'],
    aiSummary:
      "Büyük Türk dubleks/tripleks villaları ve akıllı ev projeleri için Legrand Practibox3 36 modüllü (3×12) sıva altı elektrik dağıtım panosu (TS EN 61439-3 · IP40/IK07). 3 fazlı ana kesici, çift 30mA kaçak akım rölesi, Tip-2 parafudr (SPD), 30+ devre otomatı ve Türkçe villa zon etiket şeritleriyle tam mühendislik detayı.",
    finishes: ELECTRICAL_PANEL_FINISHES,
    surfaceType: 'Legrand RAL 9003 Sıva Altı Çerçeve + Füme Şeffaf Kapak + 3 Sıra DIN Ray',
    geometryBreakdown: [
      '34×56 cm sıva altı gömme şasi, 3 sıra × 12 modül çelik DIN ray ve 36 modül kapasiteli trifaze modüler şalt dizilimi.',
      'Üst sırada 3P C40 ana şalter, Tip-2 aşırı gerilim parafudr ve 30mA kaçak akım rölesi; alt sıralarda salon, mutfak, yerden ısıtma, havuz, bahçe ve EV şarj devreleri.',
    ],
    microDetails: [
      'Üst çerçevede net LEGRAND · 36 MODÜL baskısı ve 3 sıralı Türkçe devre etiket bandı.',
    ],
    lightingTip: 'Villa giriş holü veya vestiyer yanında yerden 155 cm orta eksen kotunda duvara sıva altı gömülü yerleştirin.',
  }),

  // 3. Siemens 5SL6 / Schneider Easy9 DIN Ray Otomat, 30mA Kaçak Akım & Parafudr Seti
  createElectricalLightingAsset({
    id: 'tr-siemens-schneider-otomat-grubu',
    slug: 'siemens-schneider-din-ray-otomat-kacak-akim-seti',
    name: 'Siemens 5SL6 / Schneider Easy9 Otomatlar, 30mA Kaçak Akım & Parafudr Seti (DIN Ray)',
    brandStyle: 'Siemens 5SL6 / Schneider Easy9 · IEC 60898-1 6kA B16/C25/40A Otomat Grubu',
    category: 'Elektrik Tesisatı',
    archetype: 'tr_mcb_breaker_set',
    placement: 'wall-mounted',
    dimensionsCm: { width: 24, depth: 8, height: 11, mountHeight: 155 },
    polyEstimate: 12200,
    thumbnailUrl: '/assets/turkish-gaps/siemens-schneider-din-ray-otomat-grubu.png',
    searchKeywords: [
      'otomat',
      'otomatlar',
      'otomatik sigorta',
      'w otomat',
      'kaçak akım',
      'kaçak akım rölesi',
      'parafudr',
      'din ray',
      'siemens 5sl6',
      'schneider easy9',
      'b16',
      'c25',
      'elektrik tesisatı',
    ],
    roomTags: ['Elektrik Panosu İçi', 'Teknik Detay', 'Elektrik Mühendisliği', 'Atölye'],
    aiSummary:
      'Türkiye elektrik iç tesisat yönetmeliği (IEC/EN 60898-1 & IEC 61008-1) standardında 35 mm galvaniz DIN ray üzerine dizilmiş yüksek detaylı modüler şalt seti: 3 fazlı C40 6kA ana otomat, 40A 30mA Tip-A kaçak akım rölesi (TEST butonlu), 4 adet B16/C16/C25 W-otomat, Tip-2 parafudr (yeşil kartuşlu) ve alt bakır tarak bara.',
    finishes: BREAKER_DIN_FINISHES,
    surfaceType: 'Alev Geciktirici Poliamid Modül Gövdeleri + Galvaniz 35 mm DIN Ray + Bakır Tarak Bara',
    geometryBreakdown: [
      'Delikli 35×7.5 mm galvaniz çelik TS35 DIN montaj rayı ve 11 modül (19.8 cm aktif) modüler şalt dizilimi.',
      'Soldan sağa: 3P C40 ana kesici (birleşik 3’lü köprü mandal), 2P 40A 30mA kaçak akım rölesi (sarı T test butonu + turkuaz/yeşil mandal), 4× tek kutuplu B16/C16/C25 otomat ve 2P Tip-2 parafudr.',
      'Üst/alt vidalı kablo klemens oyukları, kırmızı/yeşil mekanik kontak bayrakları ve altta izolasyonlu bakır tarak bara (busbar).',
    ],
    microDetails: [
      'Her modülün ön yüzünde net amper/eğri kodu (C40 · 40A 30mA · B16 · C16 · C25 · SPD T2) ve 6000A kesme kapasitesi baskısı.',
    ],
    lightingTip: 'Açık pano içi yakın plan renderlarda veya teknik elektrik eğitim/sunum sahnelerinde 30° yan ışıkla modül pahlarını vurgulayın.',
  }),

  // 4. Schneider Pragma / Estap Sıva Altı Data, Fiber & Multimedia Zayıf Akım Panosu
  createElectricalLightingAsset({
    id: 'tr-schneider-zayif-akim-multimedia-pano',
    slug: 'schneider-pragma-data-multimedia-zayif-akim-panosu',
    name: 'Schneider Pragma / Estap Sıva Altı Data, Fiber & Multimedia Zayıf Akım Panosu (45×13×62 cm)',
    brandStyle: 'Schneider Electric / Estap · TS EN 50173 Konut Zayıf Akım & Fiber Dağıtım Panosu',
    category: 'Elektrik Tesisatı',
    archetype: 'tr_weak_current_panel',
    placement: 'wall-mounted',
    dimensionsCm: { width: 45, depth: 13, height: 62, mountHeight: 145 },
    polyEstimate: 15800,
    thumbnailUrl: '/assets/turkish-gaps/schneider-data-multimedia-zayif-akim-panosu.png',
    searchKeywords: [
      'zayıf akım panosu',
      'data panosu',
      'multimedia panosu',
      'fiber pano',
      'patch panel',
      'modem dolabı',
      'switch',
      'rj45',
      'tv dağıtıcı',
      'schneider',
      'estap',
      'elektrik tesisatı',
    ],
    roomTags: ['Antre', 'Vestiyer İçi', 'Elektrik Şaftı', 'Villa Teknik Oda', 'Ofis'],
    aiSummary:
      'Yeni nesil Türk daire ve villalarında sigorta kutusunun hemen yanına konulan TS EN 50173 uyumlu sıva altı Data / Multimedia Zayıf Akım Panosu (45×13×62 cm). İçinde 12 port Cat6A RJ45 patch panel, 8 port Gigabit PoE switch (yeşil/turuncu aktivite LED’li), fiber optik ONT modem, 8 yollu uydu/TV multiswitch ve 3’lü Schuko grup priz bulunur.',
    finishes: ELECTRICAL_PANEL_FINISHES,
    surfaceType: 'RAL 9003 Elektrostatik Çelik Kasa + Havalandırmalı Şeffaf/Kesit Kapak + Cat6/Fiber Donanım',
    geometryBreakdown: [
      '45×62×13 cm sıva altı delikli montaj plakalı zayıf akım kasası ve üst/alt soğutma panjurlu mimari çerçeve.',
      'Üst rayda 12 port Cat6A RJ45 patch panel + renkli mavi/sarı patch kablolar; orta rafta 8 port PoE Gigabit switch ve Türk Telekom/Superonline tipi beyaz fiber ONT kutusu.',
      'Alt bölümde 8 çıkışlı F-konnektörlü uydu/TV dağıtıcı (splitter) ve cihazları besleyen 3’lü korumalı Schuko priz grubu.',
    ],
    microDetails: [
      'Switch üzerinde ışıklı yeşil/amber link LED’leri, fiber kutuda PON/LAN göstergeleri ve üstte "ZAYIF AKIM · DATA / FİBER / TV" teknik etiketi.',
    ],
    lightingTip: 'Daire giriş holünde veya vestiyer dolabı içinde sigorta kutusuyla aynı üst hizada (+145 cm alt kot) yerleştirin.',
  }),

  // 5. Estap / Canovate 9U Duvar Tipi 19" Data & Kamera (NVR/Switch) Rack Kabineti
  createElectricalLightingAsset({
    id: 'tr-estap-rack-kabinet-9u',
    slug: 'estap-canovate-9u-duvar-tipi-19inc-rack-kabinet',
    name: 'Estap / Canovate 9U Duvar Tipi 19" Data, Akıllı Ev & Kamera Rack Kabineti (60×45×50 cm)',
    brandStyle: 'Estap (Legrand) / Canovate · 9U 19" Temperli Cam Kapaklı Rack Kabinet',
    category: 'Elektrik Tesisatı',
    archetype: 'tr_rack_cabinet_9u',
    placement: 'wall-mounted',
    dimensionsCm: { width: 60, depth: 45, height: 50, mountHeight: 160 },
    polyEstimate: 16400,
    thumbnailUrl: '/assets/turkish-gaps/estap-9u-19inc-rack-kabinet.png',
    searchKeywords: [
      'rack kabinet',
      '9u kabinet',
      'data kabineti',
      'network dolabı',
      'zayıf akım',
      'estap',
      'canovate',
      'kamera nvr',
      'akıllı ev panosu',
      'elektrik tesisatı',
    ],
    roomTags: ['Villa Teknik Oda', 'Ofis', 'Güvenlik Odası', 'Bodrum'],
    aiSummary:
      'Villa güvenlik kamerası (NVR), KNX akıllı ev, Wi-Fi Access Point ve ofis ağ altyapıları için Türkiye lideri Estap / Canovate 9U duvar tipi 19" rack kabinet (60×45×50 cm). Kilitli temperli füme cam ön kapı, 24 port Cat6 patch panel, 24 port PoE switch, 1U kablo düzenleyici, 2U kamera NVR cihazı ve 19" 6’lı PDU priz.',
    finishes: [
      ELECTRICAL_PANEL_FINISHES[3],
      ELECTRICAL_PANEL_FINISHES[2],
      ELECTRICAL_PANEL_FINISHES[1],
      ELECTRICAL_PANEL_FINISHES[0],
      ELECTRICAL_PANEL_FINISHES[4],
    ],
    surfaceType: 'RAL 9005 / 7035 Elektrostatik Çelik Kabin + 4 mm Temperli Füme Cam + 19" Ağ Cihazları',
    geometryBreakdown: [
      '60×45×50 cm çelik duvar tipi 9U rack şasisi, yan havalandırma yarıkları, üst çift fan ızgarası ve kilitli temperli cam ön kapak.',
      'İçeride 19" dikmelere vidalı 24 port Cat6 patch panel, 1U fırçalı kablo organizer, 24 port Gigabit PoE switch (ışıklı LED sıralı), 2U NVR kayıt cihazı ve altta şalterli 6’lı 19" PDU.',
    ],
    microDetails: [
      'Ön üst çerçevede ESTAP · 9U 19" logosu, switch ön yüzünde 24 port LED göstergeleri ve silindirik krom kabin kilidi.',
    ],
    lightingTip: 'Villa teknik odası veya ofis bilgi işlem duvarında 160 cm kotta monte edin; cam yüzeyde yumuşak yansıma ve içerideki yeşil/mavi cihaz LED’leri yüksek gerçekçilik verir.',
  }),

  // ==========================================================================
  // B. AYDINLATMA — ALÇIPAN SPOTLAR, ŞERİT LEDLER & AVİZELER (9 New Models)
  // ==========================================================================

  // 6. Jupiter / Pelsan Deep-Cut Trimless Alçıpan Gömme LED Spot (Ø9 cm · 12W)
  createElectricalLightingAsset({
    id: 'tr-jupiter-alcipan-gomme-spot',
    slug: 'jupiter-pelsan-alcipan-gomme-led-spot-9cm',
    name: 'Jupiter / Pelsan Anti-Glare Alçıpan Gömme LED Spot (Ø9 cm · 12W 3000K)',
    brandStyle: 'Jupiter / Pelsan · Deep-Cut Kamaşmasız Alçıpan Gömme Spot',
    category: 'Aydınlatma',
    archetype: 'tr_recessed_spot_round',
    placement: 'ceiling',
    dimensionsCm: { width: 10, depth: 10, height: 9, mountHeight: 270 },
    polyEstimate: 8200,
    thumbnailUrl: '/assets/turkish-gaps/jupiter-alcipan-gomme-led-spot.png',
    searchKeywords: [
      'alçıpan spot',
      'gömme spot',
      'tavan spotu',
      'spot lamba',
      'led spot',
      'jupiter',
      'pelsan',
      'anti glare',
      'gu10',
      'asma tavan',
    ],
    roomTags: ['Salon', 'Koridor', 'Mutfak', 'Banyo', 'Yatak Odası'],
    aiSummary:
      'Türkiye asma tavan projelerinin standardı Ø9 cm (kesim çapı Ø7.5 cm) Jupiter / Pelsan deep-cut kamaşmasız (UGR<16) alçıpan gömme LED spot. Derin optik anti-glare iç reflektör, alüminyum kanatçıklı soğutucu gövde, alçıpan montaj kelebek yayları ve 3000K COB LED merceğiyle tam gerçekçi tavan detayı.',
    finishes: ARCHITECTURAL_SPOT_LED_FINISHES,
    surfaceType: 'Enjeksiyon Alüminyum Gövde + Deep-Cut Reflektör + 3000K COB Optik Lens',
    geometryBreakdown: [
      'Ø9.6 cm ince mimari tavan flanşı ve 4 cm derinliğinde kamaşma önleyici konik reflektör haznesi (siyah/gold/beyaz seçenekli).',
      'Merkezde sıcak 3000K ışıklı COB LED lensi, üstte alüminyum radyal soğutucu kanatçıklar ve iki yanda çelik alçıpan sıkıştırma yayları.',
    ],
    microDetails: [
      'İç reflektör derinliği sayesinde salon renderlarında spotun içi gerçekçi koyu kontrast ve sıcak merkez ışık halesi oluşturur.',
    ],
    lightingTip: 'Asma tavan (alçıpan) yüzeyine sıfır kotta gömün; Blender’da her spotun 2 cm altına 12W–18W 3000K 36° Spot Light / IES profili bağlayın.',
  }),

  // 7. Pelsan / Ack İkili Hareketli (Kardan/Gimbal) Kare Alçıpan Spot (22×12 cm)
  createElectricalLightingAsset({
    id: 'tr-pelsan-ikili-kardan-alcipan-spot',
    slug: 'pelsan-ack-ikili-kardan-hareketli-alcipan-spot',
    name: 'Pelsan / Ack İkili Hareketli (Kardan/Gimbal) Kare Alçıpan Spot (22×12 cm · 2×10W)',
    brandStyle: 'Pelsan / Ack · Çift Optik Yönlendirilebilir Kardan Alçıpan Spot',
    category: 'Aydınlatma',
    archetype: 'tr_gimbal_double_spot',
    placement: 'ceiling',
    dimensionsCm: { width: 22, depth: 12, height: 10, mountHeight: 270 },
    polyEstimate: 10400,
    thumbnailUrl: '/assets/turkish-gaps/pelsan-ikili-kardan-alcipan-spot.png',
    searchKeywords: [
      'ikili spot',
      'kardan spot',
      'hareketli spot',
      'alçıpan spot',
      'kare spot',
      'gimbal spot',
      'pelsan',
      'ack',
      'tv duvarı spot',
      'asma tavan',
    ],
    roomTags: ['Salon', 'TV Duvarı', 'Galeri', 'Mutfak Adası', 'Mağaza'],
    aiSummary:
      'Modern Türk villa salonlarında tablo, taş/ahşap TV duvarı ve mutfak adası vurgulamak için kullanılan Pelsan / Ack ikili hareketli (kardan/gimbal) alçıpan gömme spot (22×12 cm · 2×10W 3000K). Çift eksenli 30° eğilebilir 2 adet optik kafa, derin siyah iç çerçeve ve arka alüminyum soğutucularla eksiksiz.',
    finishes: [
      ARCHITECTURAL_SPOT_LED_FINISHES[1],
      ARCHITECTURAL_SPOT_LED_FINISHES[0],
      ARCHITECTURAL_SPOT_LED_FINISHES[2],
      ARCHITECTURAL_SPOT_LED_FINISHES[3],
      ARCHITECTURAL_SPOT_LED_FINISHES[4],
    ],
    surfaceType: 'Mat Alüminyum Dikdörtgen Kasa + Çift Yönlendirilebilir Gimbal Halka + 2× COB LED',
    geometryBreakdown: [
      '22×12 cm ince çerçeveli dikdörtgen alçıpan kasa ve gömülü koyu iç optik hazne.',
      'İçeride farklı açılara (15° duvar yıkama açısı) yönlendirilmiş 2 adet çift eksenli kardan halkası, COB LED mercekleri ve arka soğutucular.',
    ],
    microDetails: [
      'Kardan halkaları duvara doğru hafif açılı modellenmiştir; tavan planı ve perspektif kamerada hemen profesyonel mimari aydınlatma hissi verir.',
    ],
    lightingTip: 'TV ünitesi veya sanat duvarından 55–70 cm mesafede asma tavana paralel dizin; Blender’da 24° dar açılı IES ışık profiliyle duvarda yumuşak ışık tarakları elde edin.',
  }),

  // 8. Jupiter / Cata 18W Ultra İnce Yuvarlak Alçıpan Panel LED Downlight (Ø22 cm)
  createElectricalLightingAsset({
    id: 'tr-jupiter-panel-led-downlight',
    slug: 'jupiter-cata-18w-alcipan-panel-led-downlight-22cm',
    name: 'Jupiter / Cata 18W Ultra İnce Yuvarlak Alçıpan Panel LED Downlight (Ø22 cm)',
    brandStyle: 'Jupiter / Cata · 18W Slim Alçıpan Gömme Panel LED (3000K / 4000K)',
    category: 'Aydınlatma',
    archetype: 'tr_led_downlight_panel',
    placement: 'ceiling',
    dimensionsCm: { width: 22, depth: 22, height: 5, mountHeight: 270 },
    polyEstimate: 6800,
    thumbnailUrl: '/assets/turkish-gaps/jupiter-cata-18w-panel-led-downlight.png',
    searchKeywords: [
      'panel led',
      'downlight',
      'alçıpan panel led',
      'slim led',
      'yuvarlak led',
      'cata',
      'jupiter',
      '18w led',
      'tavan ledi',
      'banyo tavan spotu',
    ],
    roomTags: ['Mutfak', 'Koridor', 'Banyo', 'Antre', 'Çamaşır Odası', 'Ofis'],
    aiSummary:
      'Türkiye apartman ve rezidanslarında koridor, mutfak, antre ve banyo asma tavanlarının vazgeçilmezi Ø22 cm 18W slim gömme panel LED downlight (Jupiter / Cata / Ack). Ultra ince 1.4 cm alüminyum gövde, homojen ışıklı PMMA opal difüzör, montaj yayları ve harici sabit akım LED sürücü (driver) kutusuyla hazır.',
    finishes: ARCHITECTURAL_SPOT_LED_FINISHES,
    surfaceType: 'Alüminyum Slim Çerçeve + Homojen Opal PMMA Difüzör + Harici LED Driver',
    geometryBreakdown: [
      'Ø22 cm ince alüminyum çerçeve ve homojen ışık yayan Ø19.5 cm opal difüzör yüzeyi.',
      'Üstte ince soğutma plakası, karşılıklı 2 adet yaylı alçıpan mandalı ve kablolu harici 18W LED driver kutusu.',
    ],
    microDetails: [
      'Driver kutusunda teknik 220–240V / 18W baskısı ve difüzörde 3000K/4000K homojen parıltı.',
    ],
    lightingTip: 'Koridor ve mutfak tavanında 140–180 cm aralıklarla yerleştirip difüzör yüzeyine Blender Emission (Strength 6–8) uygulayın.',
  }),

  // 9. Alçıpan Gizli Işık (Kartonpiyer/Cove) Alüminyum Kanal & 24V COB Şerit LED (200 cm)
  createElectricalLightingAsset({
    id: 'tr-alcipan-gizli-serit-led-profil',
    slug: 'alcipan-gizli-isik-cove-aluminyum-kanal-cob-serit-led',
    name: 'Alçıpan Gizli Işık (Cove) Alüminyum Kanal & 24V COB Şerit LED Seti (200 cm · 3000K)',
    brandStyle: 'Pelsan / Jupiter · 24V 480 LED/m Noktasız COB Şerit LED & Alçıpan Gizli Işık Profili',
    category: 'Aydınlatma',
    archetype: 'tr_cove_led_strip',
    placement: 'ceiling',
    dimensionsCm: { width: 200, depth: 12, height: 10, mountHeight: 262 },
    polyEstimate: 8600,
    thumbnailUrl: '/assets/turkish-gaps/alcipan-gizli-isik-cob-serit-led-profil.png',
    searchKeywords: [
      'şerit led',
      'serit led',
      'gizli ışık',
      'gizli led',
      'cove led',
      'alçıpan led',
      'kartonpiyer led',
      'cob led',
      'alüminyum led profil',
      'tavan bandı',
    ],
    roomTags: ['Salon', 'Yatak Odası', 'Perde Bandı', 'TV Arkası', 'Banyo'],
    aiSummary:
      'Türk iç mimarisinde asma tavan havuzu, perde korniş bandı ve TV arkası nişlerin temel elemanı: 200 cm eloksal alüminyum gizli ışık kanalı, 45° açılı opal difüzör, kesintisiz sıcak 3000K 24V COB şerit LED, alçıpan gizli ışık basamağı kesiti ve 24V 100W alüminyum LED trafosu (adaptör) seti.',
    finishes: ARCHITECTURAL_SPOT_LED_FINISHES,
    surfaceType: 'Eloksal Alüminyum LED Kanalı + 45° Opal Difüzör + 24V COB Şerit LED & Trafo',
    geometryBreakdown: [
      '200 cm modüler eloksal alüminyum U/45° soğutucu LED kanalı, yan kapakları ve kesintisiz ışık yayan 24V COB şerit LED + opal polikarbon difüzör.',
      'Altında 1:1 mimari referans için ince alçıpan gizli ışık L-havuz profili ve arkada delikli metal 24V 100W Mean Well tipi LED güç kaynağı (trafo).',
    ],
    microDetails: [
      'Blender’da Array Modifier ile oda çevresine (X ekseninde 2 m adımlarla) anında kesintisiz uzatılacak şekilde uçtan uca hizalıdır.',
    ],
    lightingTip: 'Tavan kotundan 8–12 cm aşağıda perde bandı ve havuz tavan içine yerleştirin; Cycles’da uzun ince Area Light (3000K, Spread 110°) ile tavan yüzeyinde yumuşak ışık geçişi oluşturun.',
  }),

  // 10. Sıva Altı Gömme Mimari Lineer LED Tavan & Duvar Profili (200×3.5 cm · 36W)
  createElectricalLightingAsset({
    id: 'tr-lineer-siva-alti-led-profil',
    slug: 'siva-alti-gomme-mimari-lineer-led-profil-200cm',
    name: 'Sıva Altı Gömme Mimari Lineer LED Tavan & Duvar Profili (200×3.5 cm · 36W)',
    brandStyle: 'Pelsan / Jupiter · Trimless Alçıpan İçi Gömme Lineer LED Kanalı',
    category: 'Aydınlatma',
    archetype: 'tr_linear_recessed_led',
    placement: 'ceiling',
    dimensionsCm: { width: 200, depth: 7, height: 5, mountHeight: 270 },
    polyEstimate: 7400,
    thumbnailUrl: '/assets/turkish-gaps/siva-alti-gomme-mimari-lineer-led-profil.png',
    searchKeywords: [
      'lineer led',
      'şerit led',
      'gömme led profil',
      'trimless led',
      'alçıpan profil led',
      'tavan şerit led',
      'duvar led kanal',
      'pelsan',
      'jupiter',
    ],
    roomTags: ['Modern Salon', 'Koridor', 'Mutfak', 'Villa Antre', 'Ofis'],
    aiSummary:
      'Lüks çağdaş Türk villa ve rezidanslarında alçıpan tavana veya duvara sıfır (trimless) gömülen 200 cm × 3.5 cm mimari lineer LED aydınlatma profili (36W · 3000K/4000K). Alçı fileli/delikli yan sıva kanatları, derin eloksal alüminyum kasa ve sıfır çerçeveli kesintisiz opal ışık şeridi.',
    finishes: [
      ARCHITECTURAL_SPOT_LED_FINISHES[3],
      ARCHITECTURAL_SPOT_LED_FINISHES[0],
      ARCHITECTURAL_SPOT_LED_FINISHES[1],
      ARCHITECTURAL_SPOT_LED_FINISHES[2],
      ARCHITECTURAL_SPOT_LED_FINISHES[4],
    ],
    surfaceType: 'Trimless Delikli Sıva Kanatlı Alüminyum Profil + Kesintisiz Opal LED Difüzör',
    geometryBreakdown: [
      '200 cm boyunca delikli alçı-sıva tutucu yan kanatlara sahip trimless ekstrüzyon alüminyum kanal.',
      'Merkezde 3.5 cm genişliğinde pürüzsüz, noktasız ışıklı opal PMMA difüzör ve uç sonlandırma kapakları.',
    ],
    microDetails: [
      'Tavandan duvara L-dönüş (şelale LED) kurgusu yapmak için 90° döndürülerek kolayca birleştirilebilir.',
    ],
    lightingTip: 'Koridor boyunca veya salon tavanında geometrik ışık çizgileri oluşturmak için alçıpanla sıfır kotta kullanın.',
  }),

  // 11. Avonni / Özcan 3 Katlı Modern Kristal & Fırçalı Gold Halka LED Avize (Ø80×120 cm)
  createElectricalLightingAsset({
    id: 'tr-avonni-modern-kristal-halka-avize',
    slug: 'avonni-ozcan-3-katli-modern-halka-led-avize-80cm',
    name: 'Avonni / Özcan 3 Katlı Modern Halka LED Salon Avizesi (Ø80 / Ø60 / Ø40 cm)',
    brandStyle: 'Avonni / Özcan Aydınlatma · 3 Halkalı Modern Villa LED Avize',
    category: 'Aydınlatma',
    archetype: 'tr_tiered_ring_chandelier',
    placement: 'ceiling',
    dimensionsCm: { width: 80, depth: 80, height: 120, mountHeight: 280 },
    polyEstimate: 18400,
    thumbnailUrl: '/assets/turkish-gaps/avonni-3-katli-modern-halka-led-avize.png',
    searchKeywords: [
      'avize',
      'halka avize',
      'led avize',
      'modern avize',
      'salon avizesi',
      'üçlü halka avize',
      'avonni',
      'özcan aydınlatma',
      'gold avize',
      'siyah avize',
    ],
    roomTags: ['Salon', 'Yemek Odası', 'Villa Oturma Odası', 'Yatak Odası'],
    aiSummary:
      'Türkiye’de modern salon ve villa projelerinin en çok tercih edilen 3 katlı halka LED avizesi (Ø80 + Ø60 + Ø40 cm · 96W 3000K · Avonni / Özcan). İnce çelik askı telleriyle asimetrik açılı asılan 3 adet fırçalı pirinç/mat siyah alüminyum halka, iç yüzeyde sıcak 3000K silikon LED difüzör ve yuvarlak tavan rozansı.',
    finishes: LUXURY_CHANDELIER_FINISHES,
    surfaceType: 'Fırçalı Pirinç / Mat Siyah Alüminyum Halka + 3000K Silikon LED Difüzör + Çelik Askı Teli',
    geometryBreakdown: [
      'Ø28 cm fırçalı metal tavan rozansı ve her halka için 3’er adet ince 1.5 mm çelik askı teli (toplam 9 kablo).',
      'Ø80 cm, Ø60 cm ve Ø40 cm çaplarında organik/asimetrik açılarla kademeli dizilmiş 3 adet dış metal + iç ışıklı LED halka.',
    ],
    microDetails: [
      'Halkaların hafif eğimli mimari kompozisyonu salon perspektif kamerasında heykelsi ve dinamik bir odak noktası oluşturur.',
    ],
    lightingTip: 'Orta sehpa veya yemek masası merkezine tavan rozansından asın; iç silikon şeritlere Blender Emission (Strength 10, 3000K) verin.',
  }),

  // 12. Apliqa / Avonni Yemek Masası & Ada Üstü 6 Cam Küreli Lineer Bar Avize (120 cm)
  createElectricalLightingAsset({
    id: 'tr-apliqa-yemek-masasi-lineer-avize',
    slug: 'apliqa-avonni-6-kureli-lineer-yemek-masasi-avizesi',
    name: 'Apliqa / Avonni Yemek Masası & Mutfak Adası 6 Küreli Lineer Avize (120×25×95 cm)',
    brandStyle: 'Apliqa / Avonni · 6 Opal Cam Küreli Modern Lineer Bar Sarkıt Avize',
    category: 'Aydınlatma',
    archetype: 'tr_linear_globe_chandelier',
    placement: 'ceiling',
    dimensionsCm: { width: 120, depth: 26, height: 95, mountHeight: 280 },
    polyEstimate: 16200,
    thumbnailUrl: '/assets/turkish-gaps/apliqa-6-kureli-lineer-yemek-avizesi.png',
    searchKeywords: [
      'avize',
      'lineer avize',
      'yemek masası avizesi',
      'mutfak adası avizesi',
      'küre avize',
      'glop avize',
      'sarkıt avize',
      'apliqa',
      'avonni',
      'pirinç avize',
    ],
    roomTags: ['Yemek Odası', 'Mutfak Adası', 'Salon', 'Toplantı Masası'],
    aiSummary:
      '8–10 kişilik Türk yemek masaları ve mermer mutfak adaları için tasarlanmış 120 cm Apliqa / Avonni 6’lı opal cam küreli lineer bar sarkıt avize. Dikdörtgen tavan rozansı, çift dikey metal askı borusu, ince pirinç/mat siyah yatay gövde ve her iki yanda dengeli yerleştirilmiş 6 adet Ø15 cm buzlu opal cam küre.',
    finishes: LUXURY_CHANDELIER_FINISHES,
    surfaceType: 'Fırçalı Pirinç / Mat Siyah Gövde + 6× Ø15 cm Buzlu Opal Cam Küre + 3000K G9 LED',
    geometryBreakdown: [
      '50×8 cm dikdörtgen tavan rozansı, çift teleskopik Ø12 mm metal askı çubuğu ve 120 cm ana yatay lineer bar.',
      'Yatay çubuk boyunca ön-arka ve alt-üst ritmik yerleştirilmiş 6 adet pirinç duy kapaklı Ø15 cm opal/amber cam küre.',
    ],
    microDetails: [
      'Opal cam küreler hem yumuşak 3000K ışık yayar hem de gündüz renderlarında zarif yarı saydam cam yansıması verir.',
    ],
    lightingTip: 'Yemek masası veya ada tezgah üstünden 75–85 cm yukarıda kalacak şekilde konumlandırın.',
  }),

  // 13. Özcan / Şişhane Villa Galeri & Merdiven Boşluğu 9'lu Kaskad Sarkıt Avize (Ø60×240 cm)
  createElectricalLightingAsset({
    id: 'tr-villa-galeri-kaskad-sarkit-avize',
    slug: 'ozcan-sishane-villa-galeri-9lu-kaskad-sarkit-avize',
    name: "Özcan / Şişhane Villa Galeri & Merdiven Boşluğu 9'lu Kaskad Sarkıt Avize (Ø60×240 cm)",
    brandStyle: 'Özcan Aydınlatma / Şişhane Özel Tasarım · Dubleks Galeri 9’lu Spiral Kaskad Avize',
    category: 'Aydınlatma',
    archetype: 'tr_cascade_stair_chandelier',
    placement: 'ceiling',
    dimensionsCm: { width: 60, depth: 60, height: 240, mountHeight: 540 },
    polyEstimate: 19600,
    thumbnailUrl: '/assets/turkish-gaps/ozcan-villa-galeri-9lu-kaskad-avize.png',
    searchKeywords: [
      'galeri avizesi',
      'merdiven avizesi',
      'kaskad avize',
      'sarkıt avize',
      'villa avizesi',
      'yüksek tavan avize',
      'dubleks avize',
      'özcan aydınlatma',
      'şişhane',
      'kristal sarkıt',
    ],
    roomTags: ['Villa Galeri Boşluğu', 'Merdiven Holü', 'Dubleks Salon', 'Rezidans Lobi'],
    aiSummary:
      'Bodrum, Çeşme ve İstanbul dubleks/tripleks villa galeri ve merdiven boşlukları için 240 cm yüksekliğinde 9’lu spiral kaskad sarkıt avize (Ø60×240 cm · Özcan / Şişhane). Ø55 cm yuvarlak tavan tablasından helis formda sarkan 9 adet yivli opal/amber cam tüp sarkıt ve fırçalı pirinç metal başlıklar.',
    finishes: LUXURY_CHANDELIER_FINISHES,
    surfaceType: 'Ø55 cm Metal Tavan Tablası + 9× Çelik/Örgü Kablo + Pirinç Başlıklı Opal/Amber Cam Tüp',
    geometryBreakdown: [
      'Ø55 cm fırçalı pirinç / mat siyah tavan rozansı ve 9 farklı yükseklikte (85 cm – 230 cm arası) spiral helis dizilimli sarkıt kabloları.',
      'Her sarkıt ucunda pirinç/bronz silindirik duy gövdesi ve sıcak 2700K–3000K ışık yayan Ø8×28 cm buzlu cam silindir difüzör.',
    ],
    microDetails: [
      'Spiral (Fibonacci) düşüş geometrisi hem aşağıdan yukarı hem merdiven sahanlığından yapılan mimari video turlarında büyüleyici derinlik sağlar.',
    ],
    lightingTip: 'Çift kat yüksekliğindeki (5.4–6.0 m) villa merdiven kovasına veya galeri boşluğuna yerleştirip 2700K sıcak akşam atmosferi alın.',
  }),

  // 14. Jupiter / Özcan Çift Yönlü (Up-Down) Mimari Alüminyum LED Duvar Apliği (10×10×32 cm)
  createElectricalLightingAsset({
    id: 'tr-modern-mimari-duvar-apligi-updown',
    slug: 'jupiter-ozcan-cift-yonlu-updown-mimari-led-duvar-apligi',
    name: 'Jupiter / Özcan Çift Yönlü (Up-Down) Mimari Alüminyum LED Duvar Apliği (10×10×32 cm)',
    brandStyle: 'Jupiter / Özcan Aydınlatma · IP54 İç & Dış Mekan Up-Down LED Duvar Apliği',
    category: 'Aydınlatma',
    archetype: 'tr_wall_sconce_updown',
    placement: 'wall-mounted',
    dimensionsCm: { width: 10, depth: 11, height: 32, mountHeight: 175 },
    polyEstimate: 7600,
    thumbnailUrl: '/assets/turkish-gaps/jupiter-updown-mimari-led-duvar-apligi.png',
    searchKeywords: [
      'duvar apliği',
      'aplik',
      'led aplik',
      'up down aplik',
      'çift yönlü aplik',
      'koridor apliği',
      'cephe apliği',
      'jupiter',
      'özcan aydınlatma',
      'yatak başı aplik',
    ],
    roomTags: ['Koridor', 'TV Duvarı', 'Yatak Başı', 'Merdiven Duvarı', 'Villa Cephe'],
    aiSummary:
      'Hem modern iç mekan (TV duvarı, koridor, yatak başı, merdiven holü) hem de IP54 villa dış cephe kolonlarında kullanılan Jupiter / Özcan 32 cm çift yönlü (up-down) alüminyum LED duvar apliği (2×6W · 3000K). İnce yivli/düz alüminyum gövde, üst-alt cam optik mercekler ve gizli duvar montaj kaidesi.',
    finishes: [
      ARCHITECTURAL_SPOT_LED_FINISHES[1],
      ARCHITECTURAL_SPOT_LED_FINISHES[2],
      ARCHITECTURAL_SPOT_LED_FINISHES[0],
      ARCHITECTURAL_SPOT_LED_FINISHES[3],
      ARCHITECTURAL_SPOT_LED_FINISHES[4],
    ],
    surfaceType: 'CNC Alüminyum Gövde + Üst/Alt Optik Cam Mercek + 3000K Çift Yönlü COB LED',
    geometryBreakdown: [
      'Ø7.2×32 cm silindirik mimari alüminyum gövde, ince pirinç/krom merkez dekoratif bilezik ve gizli duvar montaj konsolu.',
      'Üst ve alt uçlarda sıcak 3000K ışıklı optik cam lensler ve kamaşma önleyici iç siyah çerçeveler.',
    ],
    microDetails: [
      'Duvar yüzeyinde yukarı ve aşağı simetrik kum saati ışık konisi oluşturmak üzere üst/alt mercekleri açık modellenmiştir.',
    ],
    lightingTip: 'Koridor veya villa cephe duvarında yerden 175 cm kotta konumlandırın; Blender’da üst ve alt uca zıt yönlü 45° Spot/IES ışık ekleyin.',
  }),
];

export const TURKISH_ELECTRICAL_LIGHTING_ASSET_IDS = new Set<string>(
  TURKISH_ELECTRICAL_LIGHTING_ASSETS.map((a) => a.id),
);
