import type {
  ArchitecturalAsset,
  AssetCategory,
  AssetDimensionsCm,
  BathroomSubCategory,
  MaterialFinish,
  PatternVariant,
  PlacementType,
} from './catalogTypes';

/**
 * Full 9-option tactile architectural PBR texture suite available across expanded
 * home, room, kitchen, bedroom, bathroom, and architectural 3D models.
 */
export const ARCHITECTURAL_PBR_PATTERNS: PatternVariant[] = [
  {
    id: 'original_pbr',
    label: 'Orijinal PBR Doku',
    description: 'Modelin kendi stüdyo taranmış Diffuse + Normal + Roughness haritaları.',
    bumpScale: 1.0,
    roughnessDelta: 0.0,
  },
  {
    id: 'boucle_linen',
    label: 'Bukle / Keten Kumaş',
    description: 'Dokuma atkı-çözgü kabartmalı mat bukle/keten döşeme ve tekstil dokusu.',
    bumpScale: 1.2,
    roughnessDelta: 0.14,
  },
  {
    id: 'oak_wood_grain',
    label: 'Ahşap Damar (Meşe/Ceviz)',
    description: 'Doğal lifli meşe/ceviz ahşap damarları ve saten cila mikro kabartması.',
    bumpScale: 1.05,
    roughnessDelta: 0.02,
  },
  {
    id: 'marble_vein',
    label: 'Damarlı Mermer / Traverten',
    description: 'Calacatta & traverten mineral damarlı cilalı mimari taş yüzeyi.',
    bumpScale: 0.9,
    roughnessDelta: -0.18,
  },
  {
    id: 'brushed_pvd',
    label: 'Fırçalanmış Metal (PVD)',
    description: 'İnce yatay fırça izli anizotropik PVD krom, pirinç veya siyah metal.',
    bumpScale: 0.95,
    roughnessDelta: -0.14,
  },
  {
    id: 'fluted_ribbed',
    label: 'Oluklu / Fitilli (Fluted)',
    description: 'Dikey çıtalı modern banyo/salon dolabı ve mimari panel rölyefi.',
    bumpScale: 1.3,
    roughnessDelta: 0.04,
  },
  {
    id: 'microcement_matte',
    label: 'Brüt Beton / Mikrosement',
    description: 'Gözenekli mineral brüt beton ve ultra mat mikrosement mimari kaplama.',
    bumpScale: 1.15,
    roughnessDelta: 0.18,
  },
  {
    id: 'velvet_matte',
    label: 'Ekstra Mat Yüzey',
    description: 'Parlamasız ipeksi mat lake, seramik veya kadife yüzey profili.',
    bumpScale: 1.05,
    roughnessDelta: 0.16,
  },
  {
    id: 'satin_brushed',
    label: 'Parlak Sır / Saten Cila',
    description: 'Yüksek yansıtıcı parlak lake, porselen sır veya cilalı yüzey.',
    bumpScale: 0.85,
    roughnessDelta: -0.2,
  },
];

type ExpandedMatKind = 'wood' | 'fabric_wood' | 'appliance' | 'metal' | 'ceramic' | 'room';

const FINISH_PALETTES: Record<ExpandedMatKind, MaterialFinish[]> = {
  wood: [
    { id: 'orijinal-pbr', label: 'Orijinal PBR', materialKind: 'wood', primaryHex: '#C9B79C', secondaryHex: '#F5F5F4', accentHex: '#1F242C', roughness: 0.48, metalness: 0.02, preserveOriginalTextures: true },
    { id: 'dogal-mese', label: 'Doğal Meşe', materialKind: 'wood', primaryHex: '#C69F73', secondaryHex: '#F6F7F9', accentHex: '#23262B', roughness: 0.54, metalness: 0.02 },
    { id: 'amerikan-ceviz', label: 'Amerikan Ceviz', materialKind: 'wood', primaryHex: '#6E4B33', secondaryHex: '#F5F5F4', accentHex: '#B9965B', roughness: 0.48, metalness: 0.04 },
    { id: 'mat-beyaz-lake', label: 'Mat Beyaz Lake', materialKind: 'wood', primaryHex: '#F3F4F6', secondaryHex: '#FFFFFF', accentHex: '#1F242C', roughness: 0.36, metalness: 0.02 },
    { id: 'kasmir-vizon', label: 'Kaşmir / Vizon', materialKind: 'wood', primaryHex: '#CFC5B7', secondaryHex: '#F7F7F5', accentHex: '#B89352', roughness: 0.42, metalness: 0.02 },
    { id: 'antrasit-lake', label: 'Antrasit Lake', materialKind: 'wood', primaryHex: '#2C313A', secondaryHex: '#F5F5F4', accentHex: '#C69E57', roughness: 0.38, metalness: 0.06 },
  ],
  fabric_wood: [
    { id: 'orijinal-pbr', label: 'Orijinal PBR', materialKind: 'fabric', primaryHex: '#D8D0C5', secondaryHex: '#6E4B33', accentHex: '#1F242C', roughness: 0.84, metalness: 0.0, preserveOriginalTextures: true },
    { id: 'krem-bukle', label: 'Krem Bukle', materialKind: 'fabric', primaryHex: '#EFEAE1', secondaryHex: '#8A6242', accentHex: '#B89352', roughness: 0.9, metalness: 0.0 },
    { id: 'tas-gri-keten', label: 'Taş Gri Keten', materialKind: 'linen', primaryHex: '#9CA3AF', secondaryHex: '#4B5563', accentHex: '#1F242C', roughness: 0.86, metalness: 0.0 },
    { id: 'vizon-kadife', label: 'Vizon / Bej', materialKind: 'fabric', primaryHex: '#BFA995', secondaryHex: '#6E4B33', accentHex: '#C69E57', roughness: 0.82, metalness: 0.0 },
    { id: 'adacayi-yesili', label: 'Adaçayı Yeşili', materialKind: 'fabric', primaryHex: '#7C8F7B', secondaryHex: '#6E4B33', accentHex: '#C69E57', roughness: 0.84, metalness: 0.0 },
    { id: 'antrasit-kumas', label: 'Mat Antrasit', materialKind: 'fabric', primaryHex: '#343840', secondaryHex: '#1F242C', accentHex: '#D4AF37', roughness: 0.85, metalness: 0.0 },
  ],
  appliance: [
    { id: 'orijinal-pbr', label: 'Orijinal PBR', materialKind: 'metal', primaryHex: '#C9CFD6', secondaryHex: '#181B20', accentHex: '#D8DDE4', roughness: 0.24, metalness: 0.86, preserveOriginalTextures: true },
    { id: 'fircali-inox', label: 'Fırçalı İnox', materialKind: 'metal', primaryHex: '#C5CBD3', secondaryHex: '#181B20', accentHex: '#E5E7EB', roughness: 0.24, metalness: 0.92 },
    { id: 'mat-siyah-cam', label: 'Mat Siyah', materialKind: 'metal', primaryHex: '#1C1F24', secondaryHex: '#111318', accentHex: '#525866', roughness: 0.34, metalness: 0.72 },
    { id: 'parlak-beyaz', label: 'Beyaz Cam', materialKind: 'ceramic', primaryHex: '#F6F7F9', secondaryHex: '#E5E7EB', accentHex: '#9CA3AF', roughness: 0.14, metalness: 0.06 },
    { id: 'fume-gunmetal', label: 'Füme Gunmetal', materialKind: 'metal', primaryHex: '#454B54', secondaryHex: '#1F242C', accentHex: '#9CA3AF', roughness: 0.28, metalness: 0.88 },
    { id: 'rustik-krem', label: 'Krem & Pirinç', materialKind: 'ceramic', primaryHex: '#ECE5D8', secondaryHex: '#D5CBB8', accentHex: '#C9A45C', roughness: 0.26, metalness: 0.08 },
  ],
  metal: [
    { id: 'orijinal-pbr', label: 'Orijinal PBR', materialKind: 'metal', primaryHex: '#262A30', secondaryHex: '#E5E7EB', accentHex: '#C9CDD4', roughness: 0.26, metalness: 0.86, preserveOriginalTextures: true },
    { id: 'mat-siyah-ral9005', label: 'Mat Siyah (RAL 9005)', materialKind: 'metal', primaryHex: '#1B1E23', secondaryHex: '#111318', accentHex: '#374151', roughness: 0.42, metalness: 0.78 },
    { id: 'antrasit-ral7016', label: 'Antrasit (RAL 7016)', materialKind: 'metal', primaryHex: '#363B42', secondaryHex: '#23262B', accentHex: '#9CA3AF', roughness: 0.36, metalness: 0.82 },
    { id: 'parlak-krom', label: 'Parlak Krom', materialKind: 'metal', primaryHex: '#DCE1E8', secondaryHex: '#FFFFFF', accentHex: '#CBD5E1', roughness: 0.09, metalness: 0.98 },
    { id: 'fircali-pirinc', label: 'Fırçalı Pirinç (Gold)', materialKind: 'metal', primaryHex: '#C9A45C', secondaryHex: '#E7D29E', accentHex: '#A57E37', roughness: 0.24, metalness: 0.94 },
    { id: 'mat-beyaz-profil', label: 'Mat Beyaz', materialKind: 'ceramic', primaryHex: '#F3F4F6', secondaryHex: '#FFFFFF', accentHex: '#CBD5E1', roughness: 0.32, metalness: 0.08 },
  ],
  ceramic: [
    { id: 'orijinal-pbr', label: 'Orijinal PBR', materialKind: 'ceramic', primaryHex: '#F5F6F8', secondaryHex: '#D8DDE4', accentHex: '#C9CDD4', roughness: 0.14, metalness: 0.04, preserveOriginalTextures: true },
    { id: 'parlak-beyaz', label: 'Parlak Beyaz', materialKind: 'ceramic', primaryHex: '#FAFBFC', secondaryHex: '#E5E7EB', accentHex: '#C9CDD4', roughness: 0.1, metalness: 0.04 },
    { id: 'mat-beyaz', label: 'Mat Beyaz', materialKind: 'ceramic', primaryHex: '#F1F2F4', secondaryHex: '#E2E4E8', accentHex: '#B4B9C2', roughness: 0.48, metalness: 0.02 },
    { id: 'mat-kasmir', label: 'Mat Kaşmir / Bej', materialKind: 'ceramic', primaryHex: '#DDD5C7', secondaryHex: '#C8BEA9', accentHex: '#B9965B', roughness: 0.46, metalness: 0.02 },
    { id: 'tas-gri', label: 'Mat Taş Gri', materialKind: 'stone', primaryHex: '#9DA3AB', secondaryHex: '#7B818A', accentHex: '#23262B', roughness: 0.56, metalness: 0.04 },
    { id: 'mat-antrasit', label: 'Mat Antrasit', materialKind: 'ceramic', primaryHex: '#2E323A', secondaryHex: '#1D2026', accentHex: '#C9A45C', roughness: 0.48, metalness: 0.06 },
  ],
  room: [
    { id: 'orijinal-pbr', label: 'Orijinal Sahne PBR', materialKind: 'wood', primaryHex: '#DDD6CC', secondaryHex: '#F5F5F4', accentHex: '#262A30', roughness: 0.55, metalness: 0.05, preserveOriginalTextures: true },
    { id: 'sicak-bej-palet', label: 'Sıcak Krem & Bej', materialKind: 'fabric', primaryHex: '#E8E0D5', secondaryHex: '#C69F73', accentHex: '#8A6242', roughness: 0.68, metalness: 0.02 },
    { id: 'iskandinav-acik', label: 'Açık İskandinav', materialKind: 'wood', primaryHex: '#EAECEB', secondaryHex: '#D2B48C', accentHex: '#6B7280', roughness: 0.58, metalness: 0.02 },
    { id: 'koyu-villa-palet', label: 'Koyu Modern Villa', materialKind: 'wood', primaryHex: '#4B4642', secondaryHex: '#2C313A', accentHex: '#C9A45C', roughness: 0.52, metalness: 0.08 },
    { id: 'brut-minimal', label: 'Brüt Beton / Minimal', materialKind: 'stone', primaryHex: '#B9BDC2', secondaryHex: '#374151', accentHex: '#111318', roughness: 0.78, metalness: 0.02 },
  ],
};

interface CompactExpandedRecord {
  id: string;
  slug: string;
  name: string;
  brandStyle: string;
  category: AssetCategory;
  subCategory?: BathroomSubCategory;
  placement: PlacementType;
  mat: ExpandedMatKind;
  dimensionsCm: AssetDimensionsCm;
  polyEstimate: number;
  thumbUrl: string;
  gltfUrl: string;
  license: string;
  keywords: string[];
  sourceOrigin: 'interior-ready' | 'room-scene';
  isRoom: boolean;
}

const COMPACT_EXPANDED_RECORDS: CompactExpandedRecord[] = [
  {
    "id": "exp-obj-low_poly_living_room_e8c74d6d",
    "slug": "minimalist_salon_tv_kosesi_oda_tasarimi",
    "name": "Minimalist Salon & TV Köşesi Oda Tasarımı",
    "brandStyle": "Hazır Oda Tasarımı · Blender Ayıklanabilir",
    "category": "Oda Tasarımları",
    "placement": "floor",
    "mat": "room",
    "dimensionsCm": {
      "width": 450,
      "depth": 380,
      "height": 270
    },
    "polyEstimate": 11934,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/low-poly-living-room-e8c74d6d.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/low-poly-living-room-e8c74d6d",
    "license": "CC-BY-4.0",
    "keywords": [
      "salon tasarımı",
      "oturma odası",
      "hazır oda",
      "tv köşesi"
    ],
    "sourceOrigin": "room-scene",
    "isRoom": true
  },
  {
    "id": "exp-obj-living_room_sofa_furniture_086be698",
    "slug": "klasik_kahverengi_kulakli_berjer_koltuk_116k_tri",
    "name": "Klasik Kahverengi Kulaklı Berjer Koltuk (116k Tri)",
    "brandStyle": "Yüksek Detaylı Salon Berjer",
    "category": "Salon",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 88,
      "depth": 86,
      "height": 102
    },
    "polyEstimate": 116916,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/living-room-sofa-furniture-086be698.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/living-room-sofa-furniture-086be698",
    "license": "CC-BY-4.0",
    "keywords": [
      "berjer",
      "tekli koltuk",
      "kulaklı berjer",
      "salon koltuğu",
      "okuma koltuğu"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-obj-sofa_set_5dabbd94",
    "slug": "ceviz_kollu_modern_beyaz_uclu_kanepe_24k_tri",
    "name": "Ceviz Kollu Modern Beyaz Üçlü Kanepe (24k Tri)",
    "brandStyle": "Modern Salon Oturma Grubu",
    "category": "Salon",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 226,
      "depth": 94,
      "height": 84
    },
    "polyEstimate": 24104,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/sofa-set-5dabbd94.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/sofa-set-5dabbd94",
    "license": "CC-BY-4.0",
    "keywords": [
      "üçlü koltuk",
      "beyaz kanepe",
      "modern koltuk",
      "salon oturma grubu"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-obj-bedroom_7b85b662",
    "slug": "komple_modern_yatak_odasi_tasarimi_tam_oda_42k_t",
    "name": "Komple Modern Yatak Odası Tasarımı — Tam Oda (42k Tri)",
    "brandStyle": "Hazır Oda Tasarımı · Blender Ayıklanabilir",
    "category": "Oda Tasarımları",
    "placement": "floor",
    "mat": "room",
    "dimensionsCm": {
      "width": 420,
      "depth": 380,
      "height": 280
    },
    "polyEstimate": 41998,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/bedroom-7b85b662.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/bedroom-7b85b662",
    "license": "CC-BY-4.0",
    "keywords": [
      "yatak odası tasarımı",
      "hazır yatak odası",
      "tam oda",
      "yatak takımı"
    ],
    "sourceOrigin": "room-scene",
    "isRoom": true
  },
  {
    "id": "exp-obj-purple_bedroom_97357aaf",
    "slug": "modern_yatak_odasi_calisma_kosesi_oda_seti_22k_t",
    "name": "Modern Yatak Odası & Çalışma Köşesi Oda Seti (22k Tri)",
    "brandStyle": "Hazır Oda Tasarımı · Blender Ayıklanabilir",
    "category": "Oda Tasarımları",
    "placement": "floor",
    "mat": "room",
    "dimensionsCm": {
      "width": 400,
      "depth": 360,
      "height": 275
    },
    "polyEstimate": 22840,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/purple-bedroom-97357aaf.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/purple-bedroom-97357aaf",
    "license": "CC-BY-4.0",
    "keywords": [
      "yatak odası tasarımı",
      "genç odası tasarımı",
      "hazır oda",
      "yatak"
    ],
    "sourceOrigin": "room-scene",
    "isRoom": true
  },
  {
    "id": "exp-obj-bedroom_unity_assets_2fb0edd3",
    "slug": "yatak_odasi_komple_mobilya_paketi_yatak_dolap_ko",
    "name": "Yatak Odası Komple Mobilya Paketi (Yatak + Dolap + Komodin)",
    "brandStyle": "Hazır Oda Tasarımı · Blender Ayıklanabilir",
    "category": "Oda Tasarımları",
    "placement": "floor",
    "mat": "room",
    "dimensionsCm": {
      "width": 390,
      "depth": 340,
      "height": 220
    },
    "polyEstimate": 3786,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/bedroom-unity-assets-2fb0edd3.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/bedroom-unity-assets-2fb0edd3",
    "license": "CC-BY-4.0",
    "keywords": [
      "yatak odası takımı",
      "mobilya paketi",
      "hazır oda",
      "gardırop"
    ],
    "sourceOrigin": "room-scene",
    "isRoom": true
  },
  {
    "id": "exp-obj-low_poly_bedroom_c0e9eb2a",
    "slug": "kompakt_daire_yatak_odasi_yerlesim_sahnesi",
    "name": "Kompakt Daire Yatak Odası Yerleşim Sahnesi",
    "brandStyle": "Hazır Oda Tasarımı · Blender Ayıklanabilir",
    "category": "Oda Tasarımları",
    "placement": "floor",
    "mat": "room",
    "dimensionsCm": {
      "width": 360,
      "depth": 320,
      "height": 270
    },
    "polyEstimate": 7217,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/low-poly-bedroom-c0e9eb2a.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/low-poly-bedroom-c0e9eb2a",
    "license": "CC-BY-4.0",
    "keywords": [
      "yatak odası",
      "daire yatak odası",
      "hazır oda"
    ],
    "sourceOrigin": "room-scene",
    "isRoom": true
  },
  {
    "id": "exp-obj-room_6417cbc1",
    "slug": "mimari_studyo_oda_ic_mekan_tasarimi_47k_tri",
    "name": "Mimari Stüdyo Oda İç Mekan Tasarımı (47k Tri)",
    "brandStyle": "Hazır Oda Tasarımı · Blender Ayıklanabilir",
    "category": "Oda Tasarımları",
    "placement": "floor",
    "mat": "room",
    "dimensionsCm": {
      "width": 460,
      "depth": 400,
      "height": 285
    },
    "polyEstimate": 47402,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/room-6417cbc1.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/room-6417cbc1",
    "license": "CC-BY-4.0",
    "keywords": [
      "oda tasarımı",
      "iç mekan",
      "stüdyo oda",
      "hazır sahne"
    ],
    "sourceOrigin": "room-scene",
    "isRoom": true
  },
  {
    "id": "exp-obj-low_poly_kitchen_48cd3fab",
    "slug": "komple_modern_mutfak_tasarimi_dolap_beyaz_esya_3",
    "name": "Komple Modern Mutfak Tasarımı — Dolap & Beyaz Eşya (36k Tri)",
    "brandStyle": "Hazır Oda Tasarımı · Blender Ayıklanabilir",
    "category": "Oda Tasarımları",
    "placement": "floor",
    "mat": "room",
    "dimensionsCm": {
      "width": 420,
      "depth": 360,
      "height": 280
    },
    "polyEstimate": 36357,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/low-poly-kitchen-48cd3fab.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/low-poly-kitchen-48cd3fab",
    "license": "CC-BY-4.0",
    "keywords": [
      "mutfak tasarımı",
      "hazır mutfak",
      "tam mutfak",
      "mutfak dolabı"
    ],
    "sourceOrigin": "room-scene",
    "isRoom": true
  },
  {
    "id": "exp-obj-kitchen_83492c3b",
    "slug": "l_tipi_moduler_mutfak_oda_tasarimi",
    "name": "L Tipi Modüler Mutfak Oda Tasarımı",
    "brandStyle": "Hazır Oda Tasarımı · Blender Ayıklanabilir",
    "category": "Oda Tasarımları",
    "placement": "floor",
    "mat": "room",
    "dimensionsCm": {
      "width": 380,
      "depth": 340,
      "height": 275
    },
    "polyEstimate": 3594,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/kitchen-83492c3b.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/kitchen-83492c3b",
    "license": "CC-BY-4.0",
    "keywords": [
      "l mutfak",
      "mutfak tasarımı",
      "hazır mutfak",
      "oda"
    ],
    "sourceOrigin": "room-scene",
    "isRoom": true
  },
  {
    "id": "exp-obj-minipack_kitchen_items_19879ddd",
    "slug": "mutfak_esyalari_tezgah_ekipman_seti_14k_tri",
    "name": "Mutfak Eşyaları & Tezgah Ekipman Seti (14k Tri)",
    "brandStyle": "Hazır Oda Tasarımı · Blender Ayıklanabilir",
    "category": "Oda Tasarımları",
    "placement": "floor",
    "mat": "room",
    "dimensionsCm": {
      "width": 220,
      "depth": 120,
      "height": 90
    },
    "polyEstimate": 14274,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/minipack-kitchen-items-19879ddd.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/minipack-kitchen-items-19879ddd",
    "license": "CC-BY-4.0",
    "keywords": [
      "mutfak eşyaları",
      "mutfak seti",
      "dekor paketi",
      "mutfak"
    ],
    "sourceOrigin": "room-scene",
    "isRoom": true
  },
  {
    "id": "exp-obj-electronics_kitchen_1cb38a2d",
    "slug": "mutfak_beyaz_esya_kucuk_ev_aletleri_toplu_seti",
    "name": "Mutfak Beyaz Eşya & Küçük Ev Aletleri Toplu Seti",
    "brandStyle": "Hazır Oda Tasarımı · Blender Ayıklanabilir",
    "category": "Oda Tasarımları",
    "placement": "floor",
    "mat": "room",
    "dimensionsCm": {
      "width": 240,
      "depth": 100,
      "height": 185
    },
    "polyEstimate": 10571,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/electronics-kitchen-1cb38a2d.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/electronics-kitchen-1cb38a2d",
    "license": "CC-BY-4.0",
    "keywords": [
      "mutfak elektroniği",
      "beyaz eşya seti",
      "mutfak paketi"
    ],
    "sourceOrigin": "room-scene",
    "isRoom": true
  },
  {
    "id": "exp-obj-bathroom_fbae7109",
    "slug": "komple_modern_banyo_tasarimi_tam_banyo_sahnesi",
    "name": "Komple Modern Banyo Tasarımı — Tam Banyo Sahnesi",
    "brandStyle": "Hazır Oda Tasarımı · Blender Ayıklanabilir",
    "category": "Oda Tasarımları",
    "placement": "floor",
    "mat": "room",
    "dimensionsCm": {
      "width": 320,
      "depth": 280,
      "height": 270
    },
    "polyEstimate": 6580,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/bathroom-fbae7109.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/bathroom-fbae7109",
    "license": "CC-BY-4.0",
    "keywords": [
      "banyo tasarımı",
      "hazır banyo",
      "tam banyo",
      "oda sahnesi"
    ],
    "sourceOrigin": "room-scene",
    "isRoom": true
  },
  {
    "id": "exp-obj-low_poly_house_interior_62b1714e",
    "slug": "komple_ev_ic_mekan_yerlesimi_cok_odali_sahne_72k",
    "name": "Komple Ev İç Mekan Yerleşimi — Çok Odalı Sahne (72k Tri)",
    "brandStyle": "Hazır Oda Tasarımı · Blender Ayıklanabilir",
    "category": "Oda Tasarımları",
    "placement": "floor",
    "mat": "room",
    "dimensionsCm": {
      "width": 650,
      "depth": 520,
      "height": 290
    },
    "polyEstimate": 72740,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/low-poly-house-interior-62b1714e.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/low-poly-house-interior-62b1714e",
    "license": "CC-BY-4.0",
    "keywords": [
      "komple ev",
      "ev iç mekan",
      "apartman dairesi",
      "villa iç mekan",
      "oda tasarımı"
    ],
    "sourceOrigin": "room-scene",
    "isRoom": true
  },
  {
    "id": "exp-obj-jake_s_vr_apartment_c0173173",
    "slug": "1_1_modern_apartman_dairesi_tam_ic_mekan_sahnesi",
    "name": "1+1 Modern Apartman Dairesi Tam İç Mekan Sahnesi (20k Tri)",
    "brandStyle": "Hazır Oda Tasarımı · Blender Ayıklanabilir",
    "category": "Oda Tasarımları",
    "placement": "floor",
    "mat": "room",
    "dimensionsCm": {
      "width": 600,
      "depth": 480,
      "height": 280
    },
    "polyEstimate": 20239,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/jake-s-vr-apartment-c0173173.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/jake-s-vr-apartment-c0173173",
    "license": "CC-BY-4.0",
    "keywords": [
      "apartman dairesi",
      "stüdyo daire",
      "tam daire",
      "iç mekan tasarımı"
    ],
    "sourceOrigin": "room-scene",
    "isRoom": true
  },
  {
    "id": "exp-obj-curtain_fabric_with_organic_pattern_0d",
    "slug": "organik_dokumlu_yuksek_detayli_salon_fon_perdesi",
    "name": "Organik Dökümlü Yüksek Detaylı Salon Fon Perdesi (131k Tri)",
    "brandStyle": "Mimari Hazır 3D Model",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 180,
      "depth": 24,
      "height": 270
    },
    "polyEstimate": 131822,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/curtain-fabric-with-organic-pattern-0d672a10.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/curtain-fabric-with-organic-pattern-0d672a10",
    "license": "CC-BY-4.0",
    "keywords": [
      "fon perde",
      "tül perde",
      "salon perdesi",
      "kumaş perde",
      "pencere"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-obj-curtain_a_prop_e5b01c71",
    "slug": "modern_pileli_pencere_fon_perdesi_260_cm",
    "name": "Modern Pileli Pencere Fon Perdesi (260 cm)",
    "brandStyle": "Mimari Hazır 3D Model",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 160,
      "depth": 20,
      "height": 260
    },
    "polyEstimate": 4505,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/curtain-a-prop-e5b01c71.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/curtain-a-prop-e5b01c71",
    "license": "CC-BY-4.0",
    "keywords": [
      "perde",
      "fon perde",
      "pileli perde",
      "salon perdesi"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-obj-staircase_module_e1433458",
    "slug": "modern_villa_ic_mekan_merdiven_modulu_35k_tri",
    "name": "Modern Villa İç Mekan Merdiven Modülü (35k Tri)",
    "brandStyle": "Mimari Hazır 3D Model",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 140,
      "depth": 340,
      "height": 300
    },
    "polyEstimate": 35796,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/staircase-module-e1433458.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/staircase-module-e1433458",
    "license": "CC-BY-4.0",
    "keywords": [
      "merdiven",
      "villa merdiveni",
      "dubleks merdiven",
      "ahşap merdiven",
      "mimari"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-obj-staircase_15f208e0",
    "slug": "korkuluklu_mimari_dubleks_merdiven_sistemi_24k_t",
    "name": "Korkuluklu Mimari Dubleks Merdiven Sistemi (24k Tri)",
    "brandStyle": "Mimari Hazır 3D Model",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 130,
      "depth": 320,
      "height": 295
    },
    "polyEstimate": 24428,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/staircase-15f208e0.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/staircase-15f208e0",
    "license": "CC-BY-4.0",
    "keywords": [
      "merdiven",
      "korkuluklu merdiven",
      "dubleks",
      "villa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-obj-ergonomic_mesh_office_chair_cd5ef030",
    "slug": "file_sirtli_profesyonel_mimarlik_calisma_koltugu",
    "name": "File Sırtlı Profesyonel Mimarlık Çalışma Koltuğu (181k Tri)",
    "brandStyle": "Mimari Hazır 3D Model",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 68,
      "depth": 68,
      "height": 118
    },
    "polyEstimate": 181494,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/ergonomic-mesh-office-chair-cd5ef030.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/ergonomic-mesh-office-chair-cd5ef030",
    "license": "CC-BY-4.0",
    "keywords": [
      "çalışma koltuğu",
      "fileli koltuk",
      "ergonomik koltuk",
      "ofis koltuğu"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-obj-kitchen_cabinet_1_6ad39b0f",
    "slug": "tezgahli_modern_alt_mutfak_dolap_unitesi",
    "name": "Tezgahlı Modern Alt Mutfak Dolap Ünitesi",
    "brandStyle": "Mimari Hazır 3D Model",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 120,
      "depth": 60,
      "height": 90
    },
    "polyEstimate": 2939,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/kitchen-cabinet-1-6ad39b0f.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/kitchen-cabinet-1-6ad39b0f",
    "license": "CC-BY-4.0",
    "keywords": [
      "mutfak dolabı",
      "mutfak tezgahı",
      "alt dolap"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-obj-kitchen_sink_504248ed",
    "slug": "bataryali_paslanmaz_celik_ankastre_mutfak_evyesi",
    "name": "Bataryalı Paslanmaz Çelik Ankastre Mutfak Evyesi",
    "brandStyle": "Mimari Hazır 3D Model",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "metal",
    "dimensionsCm": {
      "width": 82,
      "depth": 50,
      "height": 26
    },
    "polyEstimate": 4822,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/kitchen-sink-504248ed.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/kitchen-sink-504248ed",
    "license": "CC-BY-4.0",
    "keywords": [
      "mutfak evyesi",
      "evye",
      "mutfak bataryası",
      "lavabo",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-obj-parametric_arc_small_architectural_for",
    "slug": "parametrik_kavisli_modern_villa_bahce_pergolasi_",
    "name": "Parametrik Kavisli Modern Villa Bahçe Pergolası (28k Tri)",
    "brandStyle": "Mimari Hazır 3D Model",
    "category": "Dış Cephe",
    "placement": "exterior-ground",
    "mat": "wood",
    "dimensionsCm": {
      "width": 420,
      "depth": 280,
      "height": 270
    },
    "polyEstimate": 28020,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/parametric-arc-small-architectural-form-e761404c.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/parametric-arc-small-architectural-form-e761404c",
    "license": "CC-BY-4.0",
    "keywords": [
      "parametrik pergola",
      "villa pergola",
      "bahçe gölgelik",
      "dış cephe"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-facilitysystem_kitchenette_module_a01",
    "slug": "komple_studyo_mutfak_modulu_evye_dolap_tezgah",
    "name": "Komple Stüdyo Mutfak Modülü (Evye + Dolap + Tezgah)",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 220,
      "depth": 65,
      "height": 210
    },
    "polyEstimate": 783064,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/facilitySystem_kitchenette_module_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/facilitySystem_kitchenette_module_a01",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "komple mutfak",
      "mini mutfak",
      "mutfak modülü",
      "mutfak tezgahı",
      "mutfak dolabı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-fixture_island_a01",
    "slug": "modern_mermer_ahsap_genis_mutfak_adasi_simready",
    "name": "Modern Mermer & Ahşap Geniş Mutfak Adası (SimReady)",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 180,
      "depth": 90,
      "height": 92
    },
    "polyEstimate": 59490,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/fixture_island_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/fixture_island_a01",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "mutfak adası",
      "ada mutfak",
      "tezgah",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-fixture_counter_a01",
    "slug": "uzun_mutfak_tezgahi_alt_dolap_unitesi_simready",
    "name": "Uzun Mutfak Tezgahı & Alt Dolap Ünitesi (SimReady)",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 240,
      "depth": 65,
      "height": 90
    },
    "polyEstimate": 705540,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/fixture_counter_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/fixture_counter_a01",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "mutfak tezgahı",
      "mutfak dolabı",
      "alt dolap",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-fixture_cabinet_a01",
    "slug": "yuksek_detayli_moduler_mutfak_dolabi_a1",
    "name": "Yüksek Detaylı Modüler Mutfak Dolabı A1",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 90,
      "depth": 60,
      "height": 90
    },
    "polyEstimate": 483180,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/fixture_cabinet_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/fixture_cabinet_a01",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "mutfak dolabı",
      "alt dolap",
      "dolap"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-fixture_cabinet_b01",
    "slug": "cekmeceli_modern_mutfak_alt_dolap_modulu_b1",
    "name": "Çekmeceli Modern Mutfak Alt Dolap Modülü B1",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 80,
      "depth": 60,
      "height": 90
    },
    "polyEstimate": 74076,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/fixture_cabinet_b01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/fixture_cabinet_b01",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "mutfak dolabı",
      "çekmeceli dolap",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-appliance_refrigerator_a01",
    "slug": "yuksek_detayli_inox_cift_kapili_buzdolabi_simrea",
    "name": "Yüksek Detaylı İnox Çift Kapılı Buzdolabı (SimReady)",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 85,
      "depth": 75,
      "height": 188
    },
    "polyEstimate": 232329,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/appliance_refrigerator_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/appliance_refrigerator_a01",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "buzdolabı",
      "inox buzdolabı",
      "beyaz eşya",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-appliance_extractor_a01",
    "slug": "duvar_tipi_modern_inox_davlumbaz_simready",
    "name": "Duvar Tipi Modern İnox Davlumbaz (SimReady)",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 90,
      "depth": 50,
      "height": 75
    },
    "polyEstimate": 9875,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/appliance_extractor_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/appliance_extractor_a01",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "davlumbaz",
      "aspiratör",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-furniture_counter_coffeestation_a01",
    "slug": "modern_kahve_icecek_servis_bari_unitesi",
    "name": "Modern Kahve & İçecek Servis Barı Ünitesi",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 160,
      "depth": 65,
      "height": 95
    },
    "polyEstimate": 282012,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/furniture_counter_coffeeStation_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/furniture_counter_coffeeStation_a01",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "kahve köşesi",
      "bar tezgahı",
      "mutfak konsolu",
      "servis barı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-blinds_window_2m_closed_a01",
    "slug": "200_cm_kapali_modern_pencere_jaluzi_perdesi",
    "name": "200 cm Kapalı Modern Pencere Jaluzi Perdesi",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 200,
      "depth": 8,
      "height": 180
    },
    "polyEstimate": 319960,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/blinds_window_2m_closed_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/blinds_window_2m_closed_a01",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "jaluzi",
      "pencere perdesi",
      "stor perde",
      "salon perdesi"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-blinds_window_2m_open_a01",
    "slug": "200_cm_yarim_acik_dogal_isikli_jaluzi_perde",
    "name": "200 cm Yarım Açık Doğal Işıklı Jaluzi Perde",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 200,
      "depth": 8,
      "height": 180
    },
    "polyEstimate": 169332,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/blinds_window_2m_open_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/blinds_window_2m_open_a01",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "jaluzi",
      "pencere perdesi",
      "açık jaluzi",
      "perde"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-blinds_window_4m_closed_a01",
    "slug": "400_cm_genis_villa_cephe_jaluzi_sistemi",
    "name": "400 cm Geniş Villa Cephe Jaluzi Sistemi",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 400,
      "depth": 10,
      "height": 240
    },
    "polyEstimate": 609120,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/blinds_window_4m_closed_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/blinds_window_4m_closed_a01",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "geniş jaluzi",
      "villa cam perdesi",
      "cephesel perde",
      "stor"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-sofa_soft_b01",
    "slug": "yumusak_minderli_modern_uclu_salon_koltugu_b1",
    "name": "Yumuşak Minderli Modern Üçlü Salon Koltuğu B1",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Salon",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 225,
      "depth": 96,
      "height": 84
    },
    "polyEstimate": 45640,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/sofa_soft_b01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/sofa_soft_b01",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "üçlü koltuk",
      "modern koltuk",
      "kanepe",
      "salon",
      "inegöl"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-sofa_soft_b02",
    "slug": "genis_oturumlu_minimalist_ikili_uclu_kanepe_b2",
    "name": "Geniş Oturumlu Minimalist İkili / Üçlü Kanepe B2",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Salon",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 205,
      "depth": 94,
      "height": 82
    },
    "polyEstimate": 59144,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/sofa_soft_b02.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/sofa_soft_b02",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "koltuk",
      "kanepe",
      "salon koltuğu",
      "modern"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-sofa_soft_b03",
    "slug": "luks_konforlu_modern_villa_salon_koltugu_b3",
    "name": "Lüks Konforlu Modern Villa Salon Koltuğu B3",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Salon",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 240,
      "depth": 98,
      "height": 85
    },
    "polyEstimate": 98004,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/sofa_soft_b03.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/sofa_soft_b03",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "lüks koltuk",
      "villa koltuğu",
      "üçlü koltuk",
      "salon"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-furniture_table_coffee_low_a01",
    "slug": "alcak_minimalist_modern_orta_sehpa_simready",
    "name": "Alçak Minimalist Modern Orta Sehpa (SimReady)",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 120,
      "depth": 70,
      "height": 38
    },
    "polyEstimate": 9908,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/furniture_table_coffee_low_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/furniture_table_coffee_low_a01",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "orta sehpa",
      "alçak sehpa",
      "salon sehpası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-tv_a01",
    "slug": "ultra_ince_cercevesiz_buyuk_ekran_salon_tv_136k_",
    "name": "Ultra İnce Çerçevesiz Büyük Ekran Salon TV (136k Tri)",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Salon",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 145,
      "depth": 7,
      "height": 84
    },
    "polyEstimate": 136861,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/TV_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/TV_a01",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "televizyon",
      "smart tv",
      "duvar tv",
      "salon"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-table_bedside_b01",
    "slug": "yuksek_detayli_modern_yatak_odasi_komodini_361k_",
    "name": "Yüksek Detaylı Modern Yatak Odası Komodini (361k Tri)",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 52,
      "depth": 44,
      "height": 56
    },
    "polyEstimate": 361430,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/table_bedside_b01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/table_bedside_b01",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "komodin",
      "başucu sehpası",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-lamp_table_bedside_a01",
    "slug": "yatak_odasi_modern_basucu_abajur_lambasi_49k_tri",
    "name": "Yatak Odası Modern Başucu Abajur Lambası (49k Tri)",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Aydınlatma",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 28,
      "depth": 28,
      "height": 48
    },
    "polyEstimate": 49166,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/lamp_table_bedside_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/lamp_table_bedside_a01",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "abajur",
      "başucu lambası",
      "komodin lambası",
      "aydınlatma"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-chair_office_fabric_manager_a01",
    "slug": "kumas_dosemeli_ergonomik_yonetici_calisma_koltug",
    "name": "Kumaş Döşemeli Ergonomik Yönetici Çalışma Koltuğu",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 66,
      "depth": 66,
      "height": 112
    },
    "polyEstimate": 91432,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/chair_office_fabric_manager_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/chair_office_fabric_manager_a01",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "çalışma koltuğu",
      "ofis koltuğu",
      "yönetici koltuğu"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-sim-chair_office_amf_black_a01",
    "slug": "siyah_modern_ev_ofis_toplanti_koltugu",
    "name": "Siyah Modern Ev Ofis & Toplantı Koltuğu",
    "brandStyle": "NVIDIA SimReady · Stüdyo PBR",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 62,
      "depth": 62,
      "height": 102
    },
    "polyEstimate": 32253,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/chair_office_amf_black_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/chair_office_amf_black_a01",
    "license": "CC-BY-4.0 (NVIDIA SimReady)",
    "keywords": [
      "ofis koltuğu",
      "çalışma sandalyesi",
      "ev ofis"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r135-01",
    "slug": "4_cekmeceli_cift_kisilik_bazali_yatak_160_200",
    "name": "4 Çekmeceli Çift Kişilik Bazalı Yatak (160×200)",
    "brandStyle": "İnegöl Yatak Odası · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 165,
      "depth": 210,
      "height": 108
    },
    "polyEstimate": 3840,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r135_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r135_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "yatak",
      "bazalı yatak",
      "çift kişilik yatak",
      "çekmeceli yatak",
      "karyola",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r135-02",
    "slug": "2_cekmeceli_tek_kisilik_genc_yatagi_100_200",
    "name": "2 Çekmeceli Tek Kişilik Genç Yatağı (100×200)",
    "brandStyle": "İnegöl Yatak Odası · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 165,
      "depth": 210,
      "height": 108
    },
    "polyEstimate": 3576,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r135_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r135_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "yatak",
      "bazalı yatak",
      "çift kişilik yatak",
      "çekmeceli yatak",
      "karyola",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r135-03",
    "slug": "6_cekmeceli_depolamali_cift_kisilik_karyola",
    "name": "6 Çekmeceli Depolamalı Çift Kişilik Karyola",
    "brandStyle": "İnegöl Yatak Odası · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 165,
      "depth": 210,
      "height": 108
    },
    "polyEstimate": 1020,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r135_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r135_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "yatak",
      "bazalı yatak",
      "çift kişilik yatak",
      "çekmeceli yatak",
      "karyola",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r135-05",
    "slug": "masif_ahsap_baslikli_bazali_cift_kisilik_yatak",
    "name": "Masif Ahşap Başlıklı Bazalı Çift Kişilik Yatak",
    "brandStyle": "İnegöl Yatak Odası · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 165,
      "depth": 210,
      "height": 108
    },
    "polyEstimate": 2220,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r135_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r135_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "yatak",
      "bazalı yatak",
      "çift kişilik yatak",
      "çekmeceli yatak",
      "karyola",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r135-06",
    "slug": "alcak_platform_modern_cekmeceli_yatak",
    "name": "Alçak Platform Modern Çekmeceli Yatak",
    "brandStyle": "İnegöl Yatak Odası · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 165,
      "depth": 210,
      "height": 108
    },
    "polyEstimate": 2136,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r135_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r135_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "yatak",
      "bazalı yatak",
      "çift kişilik yatak",
      "çekmeceli yatak",
      "karyola",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r135-07",
    "slug": "kumas_dosemeli_sandikli_bazali_yatak_150_210",
    "name": "Kumaş Döşemeli Sandıklı Bazalı Yatak (150×210)",
    "brandStyle": "İnegöl Yatak Odası · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 150,
      "depth": 210,
      "height": 105
    },
    "polyEstimate": 5128,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r135_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r135_07",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "yatak",
      "bazalı yatak",
      "çift kişilik yatak",
      "çekmeceli yatak",
      "karyola",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r170-02",
    "slug": "mat_siyah_metal_cerceveli_modern_karyola",
    "name": "Mat Siyah Metal Çerçeveli Modern Karyola",
    "brandStyle": "Modern Karyola · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 170,
      "depth": 215,
      "height": 120
    },
    "polyEstimate": 5104,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r170_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r170_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "karyola",
      "çift kişilik yatak",
      "başlıklı yatak",
      "ahşap yatak",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r170-04",
    "slug": "dort_direkli_cibinlikli_villa_karyolasi",
    "name": "Dört Direkli Cibinlikli Villa Karyolası",
    "brandStyle": "Modern Karyola · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 170,
      "depth": 215,
      "height": 120
    },
    "polyEstimate": 12672,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r170_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r170_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "karyola",
      "çift kişilik yatak",
      "başlıklı yatak",
      "ahşap yatak",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r170-05",
    "slug": "minimalist_beyaz_tek_kisilik_karyola",
    "name": "Minimalist Beyaz Tek Kişilik Karyola",
    "brandStyle": "Modern Karyola · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 170,
      "depth": 215,
      "height": 120
    },
    "polyEstimate": 612,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r170_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r170_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "karyola",
      "çift kişilik yatak",
      "başlıklı yatak",
      "ahşap yatak",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r170-07",
    "slug": "kiraz_ahsap_kavisli_baslikli_klasik_karyola_165_",
    "name": "Kiraz Ahşap Kavisli Başlıklı Klasik Karyola (165×225)",
    "brandStyle": "Modern Karyola · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 165,
      "depth": 225,
      "height": 115
    },
    "polyEstimate": 4872,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r170_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r170_07",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "karyola",
      "çift kişilik yatak",
      "başlıklı yatak",
      "ahşap yatak",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r170-09",
    "slug": "ferforje_siyah_demir_tek_kisilik_karyola_100_200",
    "name": "Ferforje Siyah Demir Tek Kişilik Karyola (100×200)",
    "brandStyle": "Modern Karyola · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 100,
      "depth": 200,
      "height": 130
    },
    "polyEstimate": 40936,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r170_09.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r170_09",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "karyola",
      "çift kişilik yatak",
      "başlıklı yatak",
      "ahşap yatak",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r170-10",
    "slug": "yuksek_kanat_baslikli_luks_kumas_karyola_170_220",
    "name": "Yüksek Kanat Başlıklı Lüks Kumaş Karyola (170×220)",
    "brandStyle": "Modern Karyola · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 170,
      "depth": 220,
      "height": 130
    },
    "polyEstimate": 63876,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r170_10.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r170_10",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "karyola",
      "çift kişilik yatak",
      "başlıklı yatak",
      "ahşap yatak",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r110-01",
    "slug": "iki_kapakli_modern_yatak_odasi_gardirobu",
    "name": "İki Kapaklı Modern Yatak Odası Gardırobu",
    "brandStyle": "Giyinme & Gardırop · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 160,
      "depth": 60,
      "height": 215
    },
    "polyEstimate": 3908,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r110_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r110_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "gardırop",
      "elbise dolabı",
      "sürgülü dolap",
      "giyinme odası",
      "köşe dolap",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r110-02",
    "slug": "uc_kapakli_genis_lake_gardirop",
    "name": "Üç Kapaklı Geniş Lake Gardırop",
    "brandStyle": "Giyinme & Gardırop · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 160,
      "depth": 60,
      "height": 215
    },
    "polyEstimate": 3348,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r110_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r110_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "gardırop",
      "elbise dolabı",
      "sürgülü dolap",
      "giyinme odası",
      "köşe dolap",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r110-03",
    "slug": "surgulu_kapakli_minimalist_gardirop",
    "name": "Sürgülü Kapaklı Minimalist Gardırop",
    "brandStyle": "Giyinme & Gardırop · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 160,
      "depth": 60,
      "height": 215
    },
    "polyEstimate": 1056,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r110_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r110_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "gardırop",
      "elbise dolabı",
      "sürgülü dolap",
      "giyinme odası",
      "köşe dolap",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r110-04",
    "slug": "cekmeceli_l_kose_gardirop_modulu",
    "name": "Çekmeceli L Köşe Gardırop Modülü",
    "brandStyle": "Giyinme & Gardırop · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 160,
      "depth": 60,
      "height": 215
    },
    "polyEstimate": 3280,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r110_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r110_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "gardırop",
      "elbise dolabı",
      "sürgülü dolap",
      "giyinme odası",
      "köşe dolap",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r110-05",
    "slug": "cocuk_genc_odasi_kompakt_gardirop",
    "name": "Çocuk & Genç Odası Kompakt Gardırop",
    "brandStyle": "Giyinme & Gardırop · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 160,
      "depth": 60,
      "height": 215
    },
    "polyEstimate": 8464,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r110_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r110_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "gardırop",
      "elbise dolabı",
      "sürgülü dolap",
      "giyinme odası",
      "köşe dolap",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r110-06",
    "slug": "acik_sistem_giyinme_odasi_dolabi_walk_in",
    "name": "Açık Sistem Giyinme Odası Dolabı (Walk-In)",
    "brandStyle": "Giyinme & Gardırop · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 160,
      "depth": 60,
      "height": 215
    },
    "polyEstimate": 4040,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r110_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r110_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "gardırop",
      "elbise dolabı",
      "sürgülü dolap",
      "giyinme odası",
      "köşe dolap",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r112-01",
    "slug": "tek_cekmeceli_dogal_mese_komodin",
    "name": "Tek Çekmeceli Doğal Meşe Komodin",
    "brandStyle": "Komodin & Başucu · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 50,
      "depth": 42,
      "height": 55
    },
    "polyEstimate": 7692,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r112_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r112_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "komodin",
      "başucu sehpası",
      "çekmeceli komodin",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r112-02",
    "slug": "iki_cekmeceli_modern_yatak_odasi_komodini",
    "name": "İki Çekmeceli Modern Yatak Odası Komodini",
    "brandStyle": "Komodin & Başucu · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 50,
      "depth": 42,
      "height": 55
    },
    "polyEstimate": 1740,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r112_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r112_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "komodin",
      "başucu sehpası",
      "çekmeceli komodin",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r112-03",
    "slug": "iskandinav_ayakli_ceviz_komodin",
    "name": "İskandinav Ayaklı Ceviz Komodin",
    "brandStyle": "Komodin & Başucu · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 50,
      "depth": 42,
      "height": 55
    },
    "polyEstimate": 4064,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r112_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r112_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "komodin",
      "başucu sehpası",
      "çekmeceli komodin",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r112-05",
    "slug": "acik_rafli_minimalist_komodin",
    "name": "Açık Raflı Minimalist Komodin",
    "brandStyle": "Komodin & Başucu · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 50,
      "depth": 42,
      "height": 55
    },
    "polyEstimate": 3230,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r112_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r112_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "komodin",
      "başucu sehpası",
      "çekmeceli komodin",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r112-06",
    "slug": "yuvarlak_formlu_tasarim_yatak_odasi_komodini",
    "name": "Yuvarlak Formlu Tasarım Yatak Odası Komodini",
    "brandStyle": "Komodin & Başucu · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 50,
      "depth": 42,
      "height": 55
    },
    "polyEstimate": 38342,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r112_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r112_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "komodin",
      "başucu sehpası",
      "çekmeceli komodin",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r112-07",
    "slug": "uc_cekmeceli_yuksek_dar_komodin_45_70",
    "name": "Üç Çekmeceli Yüksek Dar Komodin (45×70)",
    "brandStyle": "Komodin & Başucu · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 50,
      "depth": 42,
      "height": 55
    },
    "polyEstimate": 672,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r112_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r112_07",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "komodin",
      "başucu sehpası",
      "çekmeceli komodin",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r133-01",
    "slug": "dikey_katlanir_dolapli_duvar_yatagi",
    "name": "Dikey Katlanır Dolaplı Duvar Yatağı",
    "brandStyle": "Duvar Yatağı · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 165,
      "depth": 55,
      "height": 218
    },
    "polyEstimate": 2992,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r133_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r133_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "duvar yatağı",
      "katlanır yatak",
      "dolaplı yatak",
      "murphy bed",
      "stüdyo daire"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r133-02",
    "slug": "yatay_ceviz_kaplamali_duvar_yatagi",
    "name": "Yatay Ceviz Kaplamalı Duvar Yatağı",
    "brandStyle": "Duvar Yatağı · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 165,
      "depth": 55,
      "height": 218
    },
    "polyEstimate": 1064,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r133_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r133_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "duvar yatağı",
      "katlanır yatak",
      "dolaplı yatak",
      "murphy bed",
      "stüdyo daire"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r133-03",
    "slug": "calisma_masali_katlanir_genc_duvar_yatagi",
    "name": "Çalışma Masalı Katlanır Genç Duvar Yatağı",
    "brandStyle": "Duvar Yatağı · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 165,
      "depth": 55,
      "height": 218
    },
    "polyEstimate": 1116,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r133_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r133_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "duvar yatağı",
      "katlanır yatak",
      "dolaplı yatak",
      "murphy bed",
      "stüdyo daire"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r133-04",
    "slug": "tek_kisilik_ince_dolapli_duvar_yatagi",
    "name": "Tek Kişilik İnce Dolaplı Duvar Yatağı",
    "brandStyle": "Duvar Yatağı · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 165,
      "depth": 55,
      "height": 218
    },
    "polyEstimate": 996,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r133_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r133_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "duvar yatağı",
      "katlanır yatak",
      "dolaplı yatak",
      "murphy bed",
      "stüdyo daire"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r133-06",
    "slug": "mat_siyah_cerceveli_cift_kisilik_duvar_yatagi",
    "name": "Mat Siyah Çerçeveli Çift Kişilik Duvar Yatağı",
    "brandStyle": "Duvar Yatağı · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 165,
      "depth": 55,
      "height": 218
    },
    "polyEstimate": 720,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r133_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r133_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "duvar yatağı",
      "katlanır yatak",
      "dolaplı yatak",
      "murphy bed",
      "stüdyo daire"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r134-01",
    "slug": "beyaz_lake_cift_kisilik_yavru_yatakli_karyola",
    "name": "Beyaz Lake Çift Kişilik Yavru Yataklı Karyola",
    "brandStyle": "Genç & Çocuk Odası · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 100,
      "depth": 200,
      "height": 82
    },
    "polyEstimate": 3952,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r134_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r134_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "yavru yatak",
      "genç odası",
      "çocuk yatağı",
      "çekmeceli yatak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r134-02",
    "slug": "dogal_mese_sedir_tipi_yavru_yatak",
    "name": "Doğal Meşe Sedir Tipi Yavru Yatak",
    "brandStyle": "Genç & Çocuk Odası · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 100,
      "depth": 200,
      "height": 82
    },
    "polyEstimate": 3892,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r134_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r134_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "yavru yatak",
      "genç odası",
      "çocuk yatağı",
      "çekmeceli yatak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r134-03",
    "slug": "cekmeceli_genc_odasi_yavru_yatagi",
    "name": "Çekmeceli Genç Odası Yavru Yatağı",
    "brandStyle": "Genç & Çocuk Odası · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 100,
      "depth": 200,
      "height": 82
    },
    "polyEstimate": 1828,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r134_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r134_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "yavru yatak",
      "genç odası",
      "çocuk yatağı",
      "çekmeceli yatak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r134-04",
    "slug": "siyah_metal_cerceveli_modern_yavru_yatak",
    "name": "Siyah Metal Çerçeveli Modern Yavru Yatak",
    "brandStyle": "Genç & Çocuk Odası · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 100,
      "depth": 200,
      "height": 82
    },
    "polyEstimate": 8684,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r134_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r134_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "yavru yatak",
      "genç odası",
      "çocuk yatağı",
      "çekmeceli yatak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r171-01",
    "slug": "dogal_cam_iki_katli_cocuk_ranzasi",
    "name": "Doğal Çam İki Katlı Çocuk Ranzası",
    "brandStyle": "Genç & Çocuk Odası · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 105,
      "depth": 205,
      "height": 170
    },
    "polyEstimate": 1892,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r171_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r171_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ranza",
      "çalışma masalı ranza",
      "çocuk odası",
      "genç odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r171-02",
    "slug": "beyaz_celik_govdeli_modern_ranza",
    "name": "Beyaz Çelik Gövdeli Modern Ranza",
    "brandStyle": "Genç & Çocuk Odası · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 105,
      "depth": 205,
      "height": 170
    },
    "polyEstimate": 11736,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r171_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r171_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ranza",
      "çalışma masalı ranza",
      "çocuk odası",
      "genç odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r171-03",
    "slug": "alti_calisma_masali_genc_odasi_loft_ranza",
    "name": "Altı Çalışma Masalı Genç Odası Loft Ranza",
    "brandStyle": "Genç & Çocuk Odası · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 105,
      "depth": 205,
      "height": 170
    },
    "polyEstimate": 1992,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r171_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r171_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ranza",
      "çalışma masalı ranza",
      "çocuk odası",
      "genç odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r171-04",
    "slug": "uc_yatakli_aile_genc_odasi_ranzasi",
    "name": "Üç Yataklı Aile & Genç Odası Ranzası",
    "brandStyle": "Genç & Çocuk Odası · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 105,
      "depth": 205,
      "height": 170
    },
    "polyEstimate": 1132,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r171_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r171_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ranza",
      "çalışma masalı ranza",
      "çocuk odası",
      "genç odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r171-07",
    "slug": "alti_cift_kisilik_ceviz_cocuk_ranzasi_145_200",
    "name": "Altı Çift Kişilik Ceviz Çocuk Ranzası (145×200)",
    "brandStyle": "Genç & Çocuk Odası · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 145,
      "depth": 200,
      "height": 165
    },
    "polyEstimate": 1720,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r171_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r171_07",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ranza",
      "çalışma masalı ranza",
      "çocuk odası",
      "genç odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r137-01",
    "slug": "ayakli_boy_aynali_taki_giyinme_dolabi",
    "name": "Ayaklı Boy Aynalı Takı & Giyinme Dolabı",
    "brandStyle": "Giyinme & Aksesuar · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 45,
      "depth": 38,
      "height": 158
    },
    "polyEstimate": 6992,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r137_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r137_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "aynalı dolap",
      "takı dolabı",
      "boy aynalı dolap",
      "giyinme odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r137-02",
    "slug": "duvara_monte_aynali_taki_dolabi",
    "name": "Duvara Monte Aynalı Takı Dolabı",
    "brandStyle": "Giyinme & Aksesuar · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 45,
      "depth": 38,
      "height": 158
    },
    "polyEstimate": 18988,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r137_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r137_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "aynalı dolap",
      "takı dolabı",
      "boy aynalı dolap",
      "giyinme odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r137-03",
    "slug": "uzun_ceviz_boy_aynali_aksesuar_dolabi",
    "name": "Uzun Ceviz Boy Aynalı Aksesuar Dolabı",
    "brandStyle": "Giyinme & Aksesuar · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 45,
      "depth": 38,
      "height": 158
    },
    "polyEstimate": 9688,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r137_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r137_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "aynalı dolap",
      "takı dolabı",
      "boy aynalı dolap",
      "giyinme odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r137-05",
    "slug": "mat_siyah_lake_aynali_taki_dolabi",
    "name": "Mat Siyah Lake Aynalı Takı Dolabı",
    "brandStyle": "Giyinme & Aksesuar · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 45,
      "depth": 38,
      "height": 158
    },
    "polyEstimate": 7328,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r137_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r137_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "aynalı dolap",
      "takı dolabı",
      "boy aynalı dolap",
      "giyinme odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r656-01",
    "slug": "3_cekmeceli_beyaz_lake_yatak_odasi_sifonyeri_90_",
    "name": "3 Çekmeceli Beyaz Lake Yatak Odası Şifonyeri (90×95)",
    "brandStyle": "Şifonyer & Komodin · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 90,
      "depth": 50,
      "height": 95
    },
    "polyEstimate": 5072,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r656_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r656_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "şifonyer",
      "çekmeceli dolap",
      "komodin",
      "bebek odası",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r656-04",
    "slug": "ceviz_kaplama_modern_3_cekmeceli_sifonyer_120_92",
    "name": "Ceviz Kaplama Modern 3 Çekmeceli Şifonyer (120×92)",
    "brandStyle": "Şifonyer & Komodin · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 120,
      "depth": 52,
      "height": 92
    },
    "polyEstimate": 1652,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r656_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r656_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "şifonyer",
      "çekmeceli dolap",
      "komodin",
      "bebek odası",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r656-07",
    "slug": "akcaagac_kose_tipi_sifonyer_dolap_80_95",
    "name": "Akçaağaç Köşe Tipi Şifonyer Dolap (80×95)",
    "brandStyle": "Şifonyer & Komodin · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 80,
      "depth": 80,
      "height": 95
    },
    "polyEstimate": 17908,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r656_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r656_07",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "şifonyer",
      "çekmeceli dolap",
      "komodin",
      "bebek odası",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r656-09",
    "slug": "espresso_ceviz_basamakli_modern_sifonyer_110_90",
    "name": "Espresso Ceviz Basamaklı Modern Şifonyer (110×90)",
    "brandStyle": "Şifonyer & Komodin · Hazır GLB",
    "category": "Yatak Odası",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 110,
      "depth": 50,
      "height": 90
    },
    "polyEstimate": 8600,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r656_09.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r656_09",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "şifonyer",
      "çekmeceli dolap",
      "komodin",
      "bebek odası",
      "yatak odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r102-03",
    "slug": "evyeli_bataryali_modern_mutfak_adasi",
    "name": "Evyeli & Bataryalı Modern Mutfak Adası",
    "brandStyle": "Modern Mutfak Adası · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 145,
      "depth": 75,
      "height": 91
    },
    "polyEstimate": 3392,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r102_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r102_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "mutfak adası",
      "ada mutfak",
      "mermer tezgah",
      "mutfak tezgahı",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r102-05",
    "slug": "acik_rafli_ahsap_tezgahli_mutfak_adasi",
    "name": "Açık Raflı & Ahşap Tezgahlı Mutfak Adası",
    "brandStyle": "Modern Mutfak Adası · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 145,
      "depth": 75,
      "height": 91
    },
    "polyEstimate": 14198,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r102_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r102_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "mutfak adası",
      "ada mutfak",
      "mermer tezgah",
      "mutfak tezgahı",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r102-06",
    "slug": "yuvarlak_formlu_villa_mutfak_adasi",
    "name": "Yuvarlak Formlu Villa Mutfak Adası",
    "brandStyle": "Modern Mutfak Adası · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 145,
      "depth": 75,
      "height": 91
    },
    "polyEstimate": 3412,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r102_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r102_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "mutfak adası",
      "ada mutfak",
      "mermer tezgah",
      "mutfak tezgahı",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r102-07",
    "slug": "tekerlekli_paslanmaz_celik_mutfak_servis_adasi_9",
    "name": "Tekerlekli Paslanmaz Çelik Mutfak Servis Adası (90×91)",
    "brandStyle": "Modern Mutfak Adası · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 90,
      "depth": 50,
      "height": 91
    },
    "polyEstimate": 4124,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r102_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r102_07",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "mutfak adası",
      "ada mutfak",
      "mermer tezgah",
      "mutfak tezgahı",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r102-08",
    "slug": "katlanir_kanatli_beyaz_lake_mutfak_adasi_120_91",
    "name": "Katlanır Kanatlı Beyaz Lake Mutfak Adası (120×91)",
    "brandStyle": "Modern Mutfak Adası · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 120,
      "depth": 65,
      "height": 91
    },
    "polyEstimate": 7192,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r102_08.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r102_08",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "mutfak adası",
      "ada mutfak",
      "mermer tezgah",
      "mutfak tezgahı",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r102-09",
    "slug": "siyah_granit_tezgahli_antrasit_sef_mutfak_adasi_",
    "name": "Siyah Granit Tezgahlı Antrasit Şef Mutfak Adası (150×90)",
    "brandStyle": "Modern Mutfak Adası · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 150,
      "depth": 75,
      "height": 90
    },
    "polyEstimate": 4332,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r102_09.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r102_09",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "mutfak adası",
      "ada mutfak",
      "mermer tezgah",
      "mutfak tezgahı",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r020-01",
    "slug": "iki_kapakli_cerceveli_alt_mutfak_dolabi_80_cm",
    "name": "İki Kapaklı Çerçeveli Alt Mutfak Dolabı (80 cm)",
    "brandStyle": "Modüler Mutfak Dolabı · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 80,
      "depth": 60,
      "height": 87
    },
    "polyEstimate": 3224,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r020_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r020_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "mutfak dolabı",
      "alt mutfak dolabı",
      "evye alt dolabı",
      "mutfak modülü"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r020-02",
    "slug": "tek_kapakli_moduler_alt_mutfak_dolabi_45_cm",
    "name": "Tek Kapaklı Modüler Alt Mutfak Dolabı (45 cm)",
    "brandStyle": "Modüler Mutfak Dolabı · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 80,
      "depth": 60,
      "height": 87
    },
    "polyEstimate": 1644,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r020_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r020_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "mutfak dolabı",
      "alt mutfak dolabı",
      "evye alt dolabı",
      "mutfak modülü"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r020-03",
    "slug": "dort_kapakli_genis_alt_mutfak_dolabi_160_cm",
    "name": "Dört Kapaklı Geniş Alt Mutfak Dolabı (160 cm)",
    "brandStyle": "Modüler Mutfak Dolabı · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 80,
      "depth": 60,
      "height": 87
    },
    "polyEstimate": 3218,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r020_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r020_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "mutfak dolabı",
      "alt mutfak dolabı",
      "evye alt dolabı",
      "mutfak modülü"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r020-04",
    "slug": "cam_kapakli_vitrinli_alt_mutfak_dolabi",
    "name": "Cam Kapaklı Vitrinli Alt Mutfak Dolabı",
    "brandStyle": "Modüler Mutfak Dolabı · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 80,
      "depth": 60,
      "height": 87
    },
    "polyEstimate": 1812,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r020_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r020_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "mutfak dolabı",
      "alt mutfak dolabı",
      "evye alt dolabı",
      "mutfak modülü"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r020-05",
    "slug": "evye_alti_iki_kapakli_mutfak_dolabi",
    "name": "Evye Altı İki Kapaklı Mutfak Dolabı",
    "brandStyle": "Modüler Mutfak Dolabı · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 80,
      "depth": 60,
      "height": 87
    },
    "polyEstimate": 7516,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r020_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r020_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "mutfak dolabı",
      "alt mutfak dolabı",
      "evye alt dolabı",
      "mutfak modülü"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r020-06",
    "slug": "acik_rafli_dogal_ahsap_alt_mutfak_dolabi",
    "name": "Açık Raflı Doğal Ahşap Alt Mutfak Dolabı",
    "brandStyle": "Modüler Mutfak Dolabı · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 80,
      "depth": 60,
      "height": 87
    },
    "polyEstimate": 2088,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r020_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r020_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "mutfak dolabı",
      "alt mutfak dolabı",
      "evye alt dolabı",
      "mutfak modülü"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r021-01",
    "slug": "iki_kapakli_ust_mutfak_duvar_dolabi_80_cm",
    "name": "İki Kapaklı Üst Mutfak Duvar Dolabı (80 cm)",
    "brandStyle": "Modüler Mutfak Dolabı · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 80,
      "depth": 35,
      "height": 72
    },
    "polyEstimate": 1668,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r021_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r021_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "üst mutfak dolabı",
      "duvar dolabı",
      "mutfak dolabı",
      "camlı dolap"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r021-02",
    "slug": "yukari_acilir_pistonlu_ust_mutfak_dolabi",
    "name": "Yukarı Açılır Pistonlu Üst Mutfak Dolabı",
    "brandStyle": "Modüler Mutfak Dolabı · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 80,
      "depth": 35,
      "height": 72
    },
    "polyEstimate": 740,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r021_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r021_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "üst mutfak dolabı",
      "duvar dolabı",
      "mutfak dolabı",
      "camlı dolap"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r021-03",
    "slug": "cam_kapakli_modern_ust_mutfak_dolabi",
    "name": "Cam Kapaklı Modern Üst Mutfak Dolabı",
    "brandStyle": "Modüler Mutfak Dolabı · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 80,
      "depth": 35,
      "height": 72
    },
    "polyEstimate": 1740,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r021_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r021_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "üst mutfak dolabı",
      "duvar dolabı",
      "mutfak dolabı",
      "camlı dolap"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r021-04",
    "slug": "dar_tek_kapakli_ust_mutfak_dolabi_40_cm",
    "name": "Dar Tek Kapaklı Üst Mutfak Dolabı (40 cm)",
    "brandStyle": "Modüler Mutfak Dolabı · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 80,
      "depth": 35,
      "height": 72
    },
    "polyEstimate": 19266,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r021_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r021_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "üst mutfak dolabı",
      "duvar dolabı",
      "mutfak dolabı",
      "camlı dolap"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r021-05",
    "slug": "l_kose_ust_mutfak_dolabi_modulu",
    "name": "L Köşe Üst Mutfak Dolabı Modülü",
    "brandStyle": "Modüler Mutfak Dolabı · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 80,
      "depth": 35,
      "height": 72
    },
    "polyEstimate": 1608,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r021_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r021_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "üst mutfak dolabı",
      "duvar dolabı",
      "mutfak dolabı",
      "camlı dolap"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r021-06",
    "slug": "acik_nisli_yuksek_ust_mutfak_dolabi",
    "name": "Açık Nişli Yüksek Üst Mutfak Dolabı",
    "brandStyle": "Modüler Mutfak Dolabı · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 80,
      "depth": 35,
      "height": 72
    },
    "polyEstimate": 4412,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r021_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r021_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "üst mutfak dolabı",
      "duvar dolabı",
      "mutfak dolabı",
      "camlı dolap"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r023-01",
    "slug": "30_cm_rayli_cekmeceli_boy_kiler_dolabi",
    "name": "30 cm Raylı Çekmeceli Boy Kiler Dolabı",
    "brandStyle": "Kiler & Boy Dolap · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 45,
      "depth": 60,
      "height": 215
    },
    "polyEstimate": 12224,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r023_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r023_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "kiler dolabı",
      "boy mutfak dolabı",
      "erzak dolabı",
      "mutfak dolabı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r023-02",
    "slug": "20_cm_dar_teleskopik_mutfak_kiler_modulu",
    "name": "20 cm Dar Teleskopik Mutfak Kiler Modülü",
    "brandStyle": "Kiler & Boy Dolap · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 45,
      "depth": 60,
      "height": 215
    },
    "polyEstimate": 13188,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r023_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r023_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "kiler dolabı",
      "boy mutfak dolabı",
      "erzak dolabı",
      "mutfak dolabı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r023-03",
    "slug": "cift_sepetli_genis_boy_kiler_dolabi",
    "name": "Çift Sepetli Geniş Boy Kiler Dolabı",
    "brandStyle": "Kiler & Boy Dolap · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 45,
      "depth": 60,
      "height": 215
    },
    "polyEstimate": 5652,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r023_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r023_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "kiler dolabı",
      "boy mutfak dolabı",
      "erzak dolabı",
      "mutfak dolabı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r023-05",
    "slug": "cam_rafli_antrasit_boy_mutfak_kileri",
    "name": "Cam Raflı Antrasit Boy Mutfak Kileri",
    "brandStyle": "Kiler & Boy Dolap · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 45,
      "depth": 60,
      "height": 215
    },
    "polyEstimate": 840,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r023_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r023_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "kiler dolabı",
      "boy mutfak dolabı",
      "erzak dolabı",
      "mutfak dolabı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r023-06",
    "slug": "paslanmaz_celik_kapakli_boy_kiler_dolabi",
    "name": "Paslanmaz Çelik Kapaklı Boy Kiler Dolabı",
    "brandStyle": "Kiler & Boy Dolap · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 45,
      "depth": 60,
      "height": 215
    },
    "polyEstimate": 12516,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r023_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r023_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "kiler dolabı",
      "boy mutfak dolabı",
      "erzak dolabı",
      "mutfak dolabı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r002-01",
    "slug": "ustten_donduruculu_cift_kapili_buzdolabi",
    "name": "Üstten Donduruculu Çift Kapılı Buzdolabı",
    "brandStyle": "Ankastre & Beyaz Eşya · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 84,
      "depth": 72,
      "height": 186
    },
    "polyEstimate": 1968,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r002_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r002_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "buzdolabı",
      "gardırop tipi buzdolabı",
      "inox buzdolabı",
      "beyaz eşya",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r002-02",
    "slug": "french_door_4_kapili_inox_villa_buzdolabi",
    "name": "French Door (4 Kapılı) İnox Villa Buzdolabı",
    "brandStyle": "Ankastre & Beyaz Eşya · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 84,
      "depth": 72,
      "height": 186
    },
    "polyEstimate": 1656,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r002_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r002_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "buzdolabı",
      "gardırop tipi buzdolabı",
      "inox buzdolabı",
      "beyaz eşya",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r002-03",
    "slug": "kompakt_tezgah_alti_mini_buzdolabi",
    "name": "Kompakt Tezgah Altı Mini Buzdolabı",
    "brandStyle": "Ankastre & Beyaz Eşya · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 84,
      "depth": 72,
      "height": 186
    },
    "polyEstimate": 3880,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r002_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r002_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "buzdolabı",
      "gardırop tipi buzdolabı",
      "inox buzdolabı",
      "beyaz eşya",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r002-04",
    "slug": "gardirop_tipi_side_by_side_su_pinarli_buzdolabi",
    "name": "Gardırop Tipi (Side-by-Side) Su Pınarlı Buzdolabı",
    "brandStyle": "Ankastre & Beyaz Eşya · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 84,
      "depth": 72,
      "height": 186
    },
    "polyEstimate": 1744,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r002_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r002_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "buzdolabı",
      "gardırop tipi buzdolabı",
      "inox buzdolabı",
      "beyaz eşya",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r002-05",
    "slug": "retro_pastel_yuvarlak_hatli_tasarim_buzdolabi",
    "name": "Retro Pastel Yuvarlak Hatlı Tasarım Buzdolabı",
    "brandStyle": "Ankastre & Beyaz Eşya · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 84,
      "depth": 72,
      "height": 186
    },
    "polyEstimate": 61892,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r002_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r002_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "buzdolabı",
      "gardırop tipi buzdolabı",
      "inox buzdolabı",
      "beyaz eşya",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r002-07",
    "slug": "cam_kapakli_siyah_icecek_sarap_sogutucu_dolap",
    "name": "Cam Kapaklı Siyah İçecek & Şarap Soğutucu Dolap",
    "brandStyle": "Ankastre & Beyaz Eşya · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 62,
      "depth": 70,
      "height": 200
    },
    "polyEstimate": 18672,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r002_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r002_07",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "buzdolabı",
      "gardırop tipi buzdolabı",
      "inox buzdolabı",
      "beyaz eşya",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r003-01",
    "slug": "60_cm_inox_ankastre_bulasik_makinesi",
    "name": "60 cm İnox Ankastre Bulaşık Makinesi",
    "brandStyle": "Ankastre & Beyaz Eşya · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 60,
      "depth": 58,
      "height": 82
    },
    "polyEstimate": 4132,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r003_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r003_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "bulaşık makinesi",
      "ankastre bulaşık makinesi",
      "beyaz eşya",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r003-02",
    "slug": "45_cm_dar_modul_ankastre_bulasik_makinesi",
    "name": "45 cm Dar Modül Ankastre Bulaşık Makinesi",
    "brandStyle": "Ankastre & Beyaz Eşya · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 60,
      "depth": 58,
      "height": 82
    },
    "polyEstimate": 2094,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r003_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r003_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "bulaşık makinesi",
      "ankastre bulaşık makinesi",
      "beyaz eşya",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r003-05",
    "slug": "mat_siyah_celik_60_cm_bulasik_makinesi",
    "name": "Mat Siyah Çelik 60 cm Bulaşık Makinesi",
    "brandStyle": "Ankastre & Beyaz Eşya · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 60,
      "depth": 58,
      "height": 82
    },
    "polyEstimate": 1876,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r003_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r003_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "bulaşık makinesi",
      "ankastre bulaşık makinesi",
      "beyaz eşya",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r003-06",
    "slug": "tam_ankastre_mobilya_kapakli_bulasik_makinesi",
    "name": "Tam Ankastre Mobilya Kapaklı Bulaşık Makinesi",
    "brandStyle": "Ankastre & Beyaz Eşya · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 60,
      "depth": 58,
      "height": 82
    },
    "polyEstimate": 21768,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r003_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r003_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "bulaşık makinesi",
      "ankastre bulaşık makinesi",
      "beyaz eşya",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r004-01",
    "slug": "60_cm_siyah_cam_inox_ankastre_firin",
    "name": "60 cm Siyah Cam & İnox Ankastre Fırın",
    "brandStyle": "Ankastre Set · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 60,
      "depth": 56,
      "height": 60
    },
    "polyEstimate": 63530,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r004_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r004_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ankastre fırın",
      "fırın",
      "buharlı fırın",
      "beyaz eşya",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r004-02",
    "slug": "cift_hazneli_villa_tipi_ankastre_boy_firin",
    "name": "Çift Hazneli Villa Tipi Ankastre Boy Fırın",
    "brandStyle": "Ankastre Set · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 60,
      "depth": 56,
      "height": 60
    },
    "polyEstimate": 3992,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r004_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r004_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ankastre fırın",
      "fırın",
      "buharlı fırın",
      "beyaz eşya",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r004-03",
    "slug": "yandan_acilir_kapakli_buharli_ankastre_firin",
    "name": "Yandan Açılır Kapaklı Buharlı Ankastre Fırın",
    "brandStyle": "Ankastre Set · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 60,
      "depth": 56,
      "height": 60
    },
    "polyEstimate": 41498,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r004_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r004_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ankastre fırın",
      "fırın",
      "buharlı fırın",
      "beyaz eşya",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r004-04",
    "slug": "krem_pirinc_detayli_rustik_ankastre_firin",
    "name": "Krem & Pirinç Detaylı Rustik Ankastre Fırın",
    "brandStyle": "Ankastre Set · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 60,
      "depth": 56,
      "height": 60
    },
    "polyEstimate": 79764,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r004_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r004_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ankastre fırın",
      "fırın",
      "buharlı fırın",
      "beyaz eşya",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r004-05",
    "slug": "pirolitik_temizlemeli_modern_ankastre_firin",
    "name": "Pirolitik Temizlemeli Modern Ankastre Fırın",
    "brandStyle": "Ankastre Set · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 60,
      "depth": 56,
      "height": 60
    },
    "polyEstimate": 3480,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r004_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r004_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ankastre fırın",
      "fırın",
      "buharlı fırın",
      "beyaz eşya",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r004-06",
    "slug": "45_cm_kompakt_ankastre_firin_modulu",
    "name": "45 cm Kompakt Ankastre Fırın Modülü",
    "brandStyle": "Ankastre Set · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 60,
      "depth": 56,
      "height": 60
    },
    "polyEstimate": 33520,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r004_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r004_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ankastre fırın",
      "fırın",
      "buharlı fırın",
      "beyaz eşya",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r005-01",
    "slug": "4_gozlu_paslanmaz_celik_ankastre_gazli_ocak",
    "name": "4 Gözlü Paslanmaz Çelik Ankastre Gazlı Ocak",
    "brandStyle": "Ankastre Ocak · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 65,
      "depth": 52,
      "height": 8
    },
    "polyEstimate": 33620,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r005_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r005_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ankastre ocak",
      "cam ocak",
      "gazlı ocak",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r005-02",
    "slug": "5_gozlu_siyah_temperli_cam_ankastre_ocak_75_cm",
    "name": "5 Gözlü Siyah Temperli Cam Ankastre Ocak (75 cm)",
    "brandStyle": "Ankastre Ocak · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 65,
      "depth": 52,
      "height": 8
    },
    "polyEstimate": 37756,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r005_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r005_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ankastre ocak",
      "cam ocak",
      "gazlı ocak",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r005-03",
    "slug": "2_gozlu_domino_tezgah_ustu_ankastre_ocak",
    "name": "2 Gözlü Domino Tezgah Üstü Ankastre Ocak",
    "brandStyle": "Ankastre Ocak · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 65,
      "depth": 52,
      "height": 8
    },
    "polyEstimate": 52224,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r005_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r005_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ankastre ocak",
      "cam ocak",
      "gazlı ocak",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r005-05",
    "slug": "6_gozlu_profesyonel_sef_villa_ocagi_90_cm",
    "name": "6 Gözlü Profesyonel Şef Villa Ocağı (90 cm)",
    "brandStyle": "Ankastre Ocak · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 65,
      "depth": 52,
      "height": 8
    },
    "polyEstimate": 128200,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r005_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r005_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ankastre ocak",
      "cam ocak",
      "gazlı ocak",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r621-01",
    "slug": "tekli_siyah_seramik_cam_induksiyon_ocak",
    "name": "Tekli Siyah Seramik Cam İndüksiyon Ocak",
    "brandStyle": "İndüksiyon Ocak · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 60,
      "depth": 45,
      "height": 6
    },
    "polyEstimate": 27174,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r621_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r621_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "indüksiyon ocak",
      "elektrikli ocak",
      "cam ocak",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r621-02",
    "slug": "cift_gozlu_siyah_cam_induksiyon_ocak_60_cm",
    "name": "Çift Gözlü Siyah Cam İndüksiyon Ocak (60 cm)",
    "brandStyle": "İndüksiyon Ocak · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 60,
      "depth": 45,
      "height": 6
    },
    "polyEstimate": 7174,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r621_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r621_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "indüksiyon ocak",
      "elektrikli ocak",
      "cam ocak",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r621-06",
    "slug": "krem_seramik_cam_retro_induksiyon_ocak",
    "name": "Krem Seramik Cam Retro İndüksiyon Ocak",
    "brandStyle": "İndüksiyon Ocak · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 60,
      "depth": 45,
      "height": 6
    },
    "polyEstimate": 6730,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r621_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r621_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "indüksiyon ocak",
      "elektrikli ocak",
      "cam ocak",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r006-01",
    "slug": "piramide_duvar_tipi_inox_mutfak_davlumbazi_60_cm",
    "name": "Piramide Duvar Tipi İnox Mutfak Davlumbazı (60 cm)",
    "brandStyle": "Davlumbaz & Aspiratör · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 60,
      "depth": 48,
      "height": 65
    },
    "polyEstimate": 59960,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r006_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r006_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "davlumbaz",
      "ada davlumbaz",
      "aspiratör",
      "ankastre davlumbaz",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r006-02",
    "slug": "dolap_alti_ince_surgulu_mutfak_aspiratoru",
    "name": "Dolap Altı İnce Sürgülü Mutfak Aspiratörü",
    "brandStyle": "Davlumbaz & Aspiratör · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 60,
      "depth": 48,
      "height": 65
    },
    "polyEstimate": 1944,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r006_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r006_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "davlumbaz",
      "ada davlumbaz",
      "aspiratör",
      "ankastre davlumbaz",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r006-03",
    "slug": "cam_kanatli_tavan_tipi_ada_mutfak_davlumbazi",
    "name": "Cam Kanatlı Tavan Tipi Ada Mutfak Davlumbazı",
    "brandStyle": "Davlumbaz & Aspiratör · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 60,
      "depth": 48,
      "height": 65
    },
    "polyEstimate": 3792,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r006_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r006_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "davlumbaz",
      "ada davlumbaz",
      "aspiratör",
      "ankastre davlumbaz",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r006-05",
    "slug": "tezgah_ici_teleskopik_asansorlu_davlumbaz",
    "name": "Tezgah İçi Teleskopik Asansörlü Davlumbaz",
    "brandStyle": "Davlumbaz & Aspiratör · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 60,
      "depth": 48,
      "height": 65
    },
    "polyEstimate": 102760,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r006_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r006_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "davlumbaz",
      "ada davlumbaz",
      "aspiratör",
      "ankastre davlumbaz",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r006-06",
    "slug": "t_tipi_duz_kutu_modern_inox_davlumbaz",
    "name": "T-Tipi Düz Kutu Modern İnox Davlumbaz",
    "brandStyle": "Davlumbaz & Aspiratör · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 60,
      "depth": 48,
      "height": 65
    },
    "polyEstimate": 3812,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r006_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r006_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "davlumbaz",
      "ada davlumbaz",
      "aspiratör",
      "ankastre davlumbaz",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r001-01",
    "slug": "kompakt_tezgah_ustu_modern_mikrodalga_firin",
    "name": "Kompakt Tezgah Üstü Modern Mikrodalga Fırın",
    "brandStyle": "Ankastre Mikrodalga · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 59,
      "depth": 40,
      "height": 38
    },
    "polyEstimate": 38924,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r001_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r001_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "mikrodalga",
      "ankastre mikrodalga",
      "mutfak",
      "beyaz eşya"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r001-02",
    "slug": "paslanmaz_celik_inox_inverter_mikrodalga",
    "name": "Paslanmaz Çelik İnox İnverter Mikrodalga",
    "brandStyle": "Ankastre Mikrodalga · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 59,
      "depth": 40,
      "height": 38
    },
    "polyEstimate": 1412,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r001_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r001_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "mikrodalga",
      "ankastre mikrodalga",
      "mutfak",
      "beyaz eşya"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r001-03",
    "slug": "60_cm_asagi_acilir_kapakli_ankastre_mikrodalga",
    "name": "60 cm Aşağı Açılır Kapaklı Ankastre Mikrodalga",
    "brandStyle": "Ankastre Mikrodalga · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 59,
      "depth": 40,
      "height": 38
    },
    "polyEstimate": 3924,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r001_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r001_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "mikrodalga",
      "ankastre mikrodalga",
      "mutfak",
      "beyaz eşya"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r001-04",
    "slug": "yuvarlak_dugmeli_retro_krem_mikrodalga_firin",
    "name": "Yuvarlak Düğmeli Retro Krem Mikrodalga Fırın",
    "brandStyle": "Ankastre Mikrodalga · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 59,
      "depth": 40,
      "height": 38
    },
    "polyEstimate": 75524,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r001_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r001_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "mikrodalga",
      "ankastre mikrodalga",
      "mutfak",
      "beyaz eşya"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r012-01",
    "slug": "yari_otomatik_paslanmaz_celik_espresso_makinesi",
    "name": "Yarı Otomatik Paslanmaz Çelik Espresso Makinesi",
    "brandStyle": "Mutfak Kahve Köşesi · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 32,
      "depth": 38,
      "height": 40
    },
    "polyEstimate": 8816,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r012_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r012_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "espresso makinesi",
      "kahve makinesi",
      "mutfak tezgahı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r012-02",
    "slug": "kompakt_barista_tipi_pompali_espresso_makinesi",
    "name": "Kompakt Barista Tipi Pompalı Espresso Makinesi",
    "brandStyle": "Mutfak Kahve Köşesi · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 32,
      "depth": 38,
      "height": 40
    },
    "polyEstimate": 4836,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r012_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r012_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "espresso makinesi",
      "kahve makinesi",
      "mutfak tezgahı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r012-03",
    "slug": "cift_kazan_inox_profesyonel_espresso_makinesi",
    "name": "Çift Kazan İnox Profesyonel Espresso Makinesi",
    "brandStyle": "Mutfak Kahve Köşesi · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 32,
      "depth": 38,
      "height": 40
    },
    "polyEstimate": 32168,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r012_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r012_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "espresso makinesi",
      "kahve makinesi",
      "mutfak tezgahı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r012-05",
    "slug": "tam_otomatik_cekirdek_ogutuculu_kahve_makinesi",
    "name": "Tam Otomatik Çekirdek Öğütücülü Kahve Makinesi",
    "brandStyle": "Mutfak Kahve Köşesi · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 32,
      "depth": 38,
      "height": 40
    },
    "polyEstimate": 6732,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r012_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r012_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "espresso makinesi",
      "kahve makinesi",
      "mutfak tezgahı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r578-01",
    "slug": "tezgah_alti_cam_kapakli_tek_bolgeli_sarap_sogutu",
    "name": "Tezgah Altı Cam Kapaklı Tek Bölgeli Şarap Soğutucu",
    "brandStyle": "Villa Mutfak & Bar · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 58,
      "depth": 58,
      "height": 85
    },
    "polyEstimate": 10908,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r578_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r578_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "şarap soğutucu",
      "şarap dolabı",
      "ankastre soğutucu",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r578-02",
    "slug": "cift_bolgeli_siyah_cam_villa_sarap_dolabi",
    "name": "Çift Bölgeli Siyah Cam Villa Şarap Dolabı",
    "brandStyle": "Villa Mutfak & Bar · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 58,
      "depth": 58,
      "height": 85
    },
    "polyEstimate": 3800,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r578_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r578_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "şarap soğutucu",
      "şarap dolabı",
      "ankastre soğutucu",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r578-05",
    "slug": "ahsap_rafli_ankastre_sarap_sogutucu_dolap",
    "name": "Ahşap Raflı Ankastre Şarap Soğutucu Dolap",
    "brandStyle": "Villa Mutfak & Bar · Hazır GLB",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 58,
      "depth": 58,
      "height": 85
    },
    "polyEstimate": 2984,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r578_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r578_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "şarap soğutucu",
      "şarap dolabı",
      "ankastre soğutucu",
      "mutfak"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r236-05",
    "slug": "japon_tipi_derin_yuvarlak_akrilik_kuvet",
    "name": "Japon Tipi Derin Yuvarlak Akrilik Küvet",
    "brandStyle": "Lüks Villa Küvet · Hazır GLB",
    "category": "Banyo",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "mat": "ceramic",
    "dimensionsCm": {
      "width": 170,
      "depth": 80,
      "height": 60
    },
    "polyEstimate": 17572,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r236_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r236_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "küvet",
      "ayaklı küvet",
      "serbest küvet",
      "jakuzi",
      "banyo"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r236-06",
    "slug": "asimetrik_modern_serbest_duran_villa_kuveti",
    "name": "Asimetrik Modern Serbest Duran Villa Küveti",
    "brandStyle": "Lüks Villa Küvet · Hazır GLB",
    "category": "Banyo",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "mat": "ceramic",
    "dimensionsCm": {
      "width": 170,
      "depth": 80,
      "height": 60
    },
    "polyEstimate": 16384,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r236_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r236_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "küvet",
      "ayaklı küvet",
      "serbest küvet",
      "jakuzi",
      "banyo"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r236-08",
    "slug": "duz_duvar_kenari_gomme_dikdortgen_kuvet",
    "name": "Düz Duvar Kenarı Gömme Dikdörtgen Küvet",
    "brandStyle": "Lüks Villa Küvet · Hazır GLB",
    "category": "Banyo",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "mat": "ceramic",
    "dimensionsCm": {
      "width": 165,
      "depth": 75,
      "height": 60
    },
    "polyEstimate": 83744,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r236_08.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r236_08",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "küvet",
      "ayaklı küvet",
      "serbest küvet",
      "jakuzi",
      "banyo"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r236-09",
    "slug": "hidro_masajli_jakuzi_formlu_cift_kisilik_kuvet",
    "name": "Hidro Masajlı Jakuzi Formlu Çift Kişilik Küvet",
    "brandStyle": "Lüks Villa Küvet · Hazır GLB",
    "category": "Banyo",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "mat": "ceramic",
    "dimensionsCm": {
      "width": 80,
      "depth": 45,
      "height": 22
    },
    "polyEstimate": 71408,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r236_09.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r236_09",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "küvet",
      "ayaklı küvet",
      "serbest küvet",
      "jakuzi",
      "banyo"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r236-10",
    "slug": "ince_kenarli_minimalist_oval_monoblok_kuvet",
    "name": "İnce Kenarlı Minimalist Oval Monoblok Küvet",
    "brandStyle": "Lüks Villa Küvet · Hazır GLB",
    "category": "Banyo",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "mat": "ceramic",
    "dimensionsCm": {
      "width": 180,
      "depth": 90,
      "height": 55
    },
    "polyEstimate": 31088,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r236_10.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r236_10",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "küvet",
      "ayaklı küvet",
      "serbest küvet",
      "jakuzi",
      "banyo"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r793-01",
    "slug": "ayakli_derin_beyaz_camasir_odasi_evyesi_60_85",
    "name": "Ayaklı Derin Beyaz Çamaşır Odası Evyesi (60×85)",
    "brandStyle": "Çamaşır Odası & Banyo · Hazır GLB",
    "category": "Banyo",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "mat": "ceramic",
    "dimensionsCm": {
      "width": 60,
      "depth": 55,
      "height": 85
    },
    "polyEstimate": 4916,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r793_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r793_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çamaşır odası lavabosu",
      "derin evye",
      "banyo lavabosu",
      "dolaplı evye"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r793-02",
    "slug": "paslanmaz_celik_derin_camasir_bahce_evyesi",
    "name": "Paslanmaz Çelik Derin Çamaşır & Bahçe Evyesi",
    "brandStyle": "Çamaşır Odası & Banyo · Hazır GLB",
    "category": "Banyo",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "mat": "ceramic",
    "dimensionsCm": {
      "width": 60,
      "depth": 50,
      "height": 90
    },
    "polyEstimate": 7624,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r793_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r793_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çamaşır odası lavabosu",
      "derin evye",
      "banyo lavabosu",
      "dolaplı evye"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r793-03",
    "slug": "cift_hazneli_100_cm_genis_camasir_odasi_evyesi",
    "name": "Çift Hazneli 100 cm Geniş Çamaşır Odası Evyesi",
    "brandStyle": "Çamaşır Odası & Banyo · Hazır GLB",
    "category": "Banyo",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "mat": "ceramic",
    "dimensionsCm": {
      "width": 100,
      "depth": 55,
      "height": 88
    },
    "polyEstimate": 43290,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r793_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r793_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çamaşır odası lavabosu",
      "derin evye",
      "banyo lavabosu",
      "dolaplı evye"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r793-04",
    "slug": "alt_dolapli_beyaz_lake_camasir_odasi_lavabosu_60",
    "name": "Alt Dolaplı Beyaz Lake Çamaşır Odası Lavabosu (60×90)",
    "brandStyle": "Çamaşır Odası & Banyo · Hazır GLB",
    "category": "Banyo",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "mat": "ceramic",
    "dimensionsCm": {
      "width": 60,
      "depth": 55,
      "height": 90
    },
    "polyEstimate": 20408,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r793_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r793_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çamaşır odası lavabosu",
      "derin evye",
      "banyo lavabosu",
      "dolaplı evye"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r793-05",
    "slug": "duvara_asma_derin_porselen_yardimci_lavabo_45_40",
    "name": "Duvara Asma Derin Porselen Yardımcı Lavabo (45×40)",
    "brandStyle": "Çamaşır Odası & Banyo · Hazır GLB",
    "category": "Banyo",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "mat": "ceramic",
    "dimensionsCm": {
      "width": 45,
      "depth": 40,
      "height": 30
    },
    "polyEstimate": 13736,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r793_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r793_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çamaşır odası lavabosu",
      "derin evye",
      "banyo lavabosu",
      "dolaplı evye"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r154-01",
    "slug": "6_panelli_beyaz_lake_ic_oda_kapisi_90_210",
    "name": "6 Panelli Beyaz Lake İç Oda Kapısı (90×210)",
    "brandStyle": "İç Mimari Kapı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 90,
      "depth": 12,
      "height": 210
    },
    "polyEstimate": 14912,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r154_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r154_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "iç kapı",
      "oda kapısı",
      "lake kapı",
      "ahşap kapı",
      "camlı kapı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r154-02",
    "slug": "duz_ceviz_kaplama_modern_ic_oda_kapisi",
    "name": "Düz Ceviz Kaplama Modern İç Oda Kapısı",
    "brandStyle": "İç Mimari Kapı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 90,
      "depth": 12,
      "height": 210
    },
    "polyEstimate": 1520,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r154_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r154_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "iç kapı",
      "oda kapısı",
      "lake kapı",
      "ahşap kapı",
      "camlı kapı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r154-03",
    "slug": "kare_cam_bolmeli_fransiz_tipi_salon_kapisi",
    "name": "Kare Cam Bölmeli Fransız Tipi Salon Kapısı",
    "brandStyle": "İç Mimari Kapı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 90,
      "depth": 12,
      "height": 210
    },
    "polyEstimate": 2700,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r154_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r154_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "iç kapı",
      "oda kapısı",
      "lake kapı",
      "ahşap kapı",
      "camlı kapı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r154-04",
    "slug": "dar_giyinme_kiler_odasi_lake_kapisi_75_210",
    "name": "Dar Giyinme & Kiler Odası Lake Kapısı (75×210)",
    "brandStyle": "İç Mimari Kapı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 90,
      "depth": 12,
      "height": 210
    },
    "polyEstimate": 3404,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r154_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r154_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "iç kapı",
      "oda kapısı",
      "lake kapı",
      "ahşap kapı",
      "camlı kapı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r154-05",
    "slug": "siyah_celik_profil_temperli_cam_loft_kapi",
    "name": "Siyah Çelik Profil Temperli Cam Loft Kapı",
    "brandStyle": "İç Mimari Kapı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 90,
      "depth": 12,
      "height": 210
    },
    "polyEstimate": 4856,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r154_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r154_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "iç kapı",
      "oda kapısı",
      "lake kapı",
      "ahşap kapı",
      "camlı kapı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r155-01",
    "slug": "siyah_rayli_ahsap_z_kusakli_surgulu_kapi",
    "name": "Siyah Raylı Ahşap Z-Kuşaklı Sürgülü Kapı",
    "brandStyle": "Sürgülü Kapı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 100,
      "depth": 10,
      "height": 215
    },
    "polyEstimate": 3556,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r155_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r155_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "sürgülü kapı",
      "ahır kapısı",
      "raylı kapı",
      "iç kapı",
      "loft"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r155-02",
    "slug": "cift_kanatli_genis_rayli_surgulu_salon_kapisi",
    "name": "Çift Kanatlı Geniş Raylı Sürgülü Salon Kapısı",
    "brandStyle": "Sürgülü Kapı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 100,
      "depth": 10,
      "height": 215
    },
    "polyEstimate": 3748,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r155_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r155_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "sürgülü kapı",
      "ahır kapısı",
      "raylı kapı",
      "iç kapı",
      "loft"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r155-03",
    "slug": "cam_panelli_modern_rayli_surgulu_kapi",
    "name": "Cam Panelli Modern Raylı Sürgülü Kapı",
    "brandStyle": "Sürgülü Kapı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 100,
      "depth": 10,
      "height": 215
    },
    "polyEstimate": 3164,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r155_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r155_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "sürgülü kapı",
      "ahır kapısı",
      "raylı kapı",
      "iç kapı",
      "loft"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r155-04",
    "slug": "rustik_x_citalarli_masif_surgulu_kapi",
    "name": "Rustik X-Çıtalarlı Masif Sürgülü Kapı",
    "brandStyle": "Sürgülü Kapı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 100,
      "depth": 10,
      "height": 215
    },
    "polyEstimate": 8024,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r155_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r155_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "sürgülü kapı",
      "ahır kapısı",
      "raylı kapı",
      "iç kapı",
      "loft"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r155-05",
    "slug": "beyaz_lake_panel_rayli_surgulu_oda_kapisi",
    "name": "Beyaz Lake Panel Raylı Sürgülü Oda Kapısı",
    "brandStyle": "Sürgülü Kapı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 100,
      "depth": 10,
      "height": 215
    },
    "polyEstimate": 2056,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r155_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r155_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "sürgülü kapı",
      "ahır kapısı",
      "raylı kapı",
      "iç kapı",
      "loft"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r707-01",
    "slug": "beyaz_lake_cift_kanatli_camli_salon_kapisi_150_2",
    "name": "Beyaz Lake Çift Kanatlı Camlı Salon Kapısı (150×210)",
    "brandStyle": "Çift Kanatlı Kapı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 150,
      "depth": 14,
      "height": 210
    },
    "polyEstimate": 2064,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r707_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r707_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çift kanatlı kapı",
      "fransız kapı",
      "salon kapısı",
      "teras kapısı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r707-02",
    "slug": "dogal_mese_cift_kanatli_villa_teras_kapisi_160_2",
    "name": "Doğal Meşe Çift Kanatlı Villa Teras Kapısı (160×215)",
    "brandStyle": "Çift Kanatlı Kapı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 160,
      "depth": 215,
      "height": 210
    },
    "polyEstimate": 4908,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r707_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r707_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çift kanatlı kapı",
      "fransız kapı",
      "salon kapısı",
      "teras kapısı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r707-03",
    "slug": "mat_siyah_disbudak_cift_kanatli_modern_kapi_120_",
    "name": "Mat Siyah Dişbudak Çift Kanatlı Modern Kapı (120×205)",
    "brandStyle": "Çift Kanatlı Kapı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 120,
      "depth": 205,
      "height": 210
    },
    "polyEstimate": 8992,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r707_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r707_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çift kanatlı kapı",
      "fransız kapı",
      "salon kapısı",
      "teras kapısı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r707-04",
    "slug": "adacayi_yesili_cift_kanatli_klasik_camli_kapi_14",
    "name": "Adaçayı Yeşili Çift Kanatlı Klasik Camlı Kapı (140×200)",
    "brandStyle": "Çift Kanatlı Kapı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 140,
      "depth": 200,
      "height": 210
    },
    "polyEstimate": 9384,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r707_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r707_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çift kanatlı kapı",
      "fransız kapı",
      "salon kapısı",
      "teras kapısı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r707-05",
    "slug": "kemerli_maun_cift_kanatli_luks_villa_kapisi_180_",
    "name": "Kemerli Maun Çift Kanatlı Lüks Villa Kapısı (180×240)",
    "brandStyle": "Çift Kanatlı Kapı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 180,
      "depth": 240,
      "height": 210
    },
    "polyEstimate": 12472,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r707_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r707_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çift kanatlı kapı",
      "fransız kapı",
      "salon kapısı",
      "teras kapısı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r708-01",
    "slug": "beyaz_mdf_iki_kanatli_katlanir_dolap_kapisi_90_2",
    "name": "Beyaz MDF İki Kanatlı Katlanır Dolap Kapısı (90×200)",
    "brandStyle": "Dolap & Kiler Kapısı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 90,
      "depth": 200,
      "height": 200
    },
    "polyEstimate": 2768,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r708_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r708_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "katlanır kapı",
      "akordeon kapı",
      "panjurlu dolap kapısı",
      "giyinme odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r708-02",
    "slug": "panjurlu_dogal_cam_katlanir_giyinme_kapisi_76_20",
    "name": "Panjurlu Doğal Çam Katlanır Giyinme Kapısı (76×203)",
    "brandStyle": "Dolap & Kiler Kapısı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 76,
      "depth": 203,
      "height": 200
    },
    "polyEstimate": 3412,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r708_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r708_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "katlanır kapı",
      "akordeon kapı",
      "panjurlu dolap kapısı",
      "giyinme odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r708-03",
    "slug": "ciftli_espresso_ceviz_katlanir_gardirop_kapisi_1",
    "name": "Çiftli Espresso Ceviz Katlanır Gardırop Kapısı (150×200)",
    "brandStyle": "Dolap & Kiler Kapısı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 150,
      "depth": 200,
      "height": 200
    },
    "polyEstimate": 1680,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r708_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r708_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "katlanır kapı",
      "akordeon kapı",
      "panjurlu dolap kapısı",
      "giyinme odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r708-05",
    "slug": "adacayi_yesili_cerceveli_katlanir_kiler_kapisi_6",
    "name": "Adaçayı Yeşili Çerçeveli Katlanır Kiler Kapısı (60×200)",
    "brandStyle": "Dolap & Kiler Kapısı · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 60,
      "depth": 200,
      "height": 200
    },
    "polyEstimate": 3032,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r708_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r708_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "katlanır kapı",
      "akordeon kapı",
      "panjurlu dolap kapısı",
      "giyinme odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r153-02",
    "slug": "uc_kanatli_genis_surgulu_aluminyum_pencere",
    "name": "Üç Kanatlı Geniş Sürgülü Alüminyum Pencere",
    "brandStyle": "Mimari Pencere · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "metal",
    "dimensionsCm": {
      "width": 150,
      "depth": 14,
      "height": 140
    },
    "polyEstimate": 3244,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r153_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r153_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "pencere",
      "sürgülü pencere",
      "alüminyum doğrama",
      "antrasit pencere",
      "dış cephe"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r153-03",
    "slug": "mat_siyah_ince_profil_surgulu_villa_penceresi",
    "name": "Mat Siyah İnce Profil Sürgülü Villa Penceresi",
    "brandStyle": "Mimari Pencere · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "metal",
    "dimensionsCm": {
      "width": 150,
      "depth": 14,
      "height": 140
    },
    "polyEstimate": 1116,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r153_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r153_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "pencere",
      "sürgülü pencere",
      "alüminyum doğrama",
      "antrasit pencere",
      "dış cephe"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r153-04",
    "slug": "ahsap_desenli_cift_kanatli_surgulu_pencere",
    "name": "Ahşap Desenli Çift Kanatlı Sürgülü Pencere",
    "brandStyle": "Mimari Pencere · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "metal",
    "dimensionsCm": {
      "width": 150,
      "depth": 14,
      "height": 140
    },
    "polyEstimate": 1800,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r153_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r153_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "pencere",
      "sürgülü pencere",
      "alüminyum doğrama",
      "antrasit pencere",
      "dış cephe"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r153-05",
    "slug": "kompakt_banyo_wc_surgulu_pencere",
    "name": "Kompakt Banyo & WC Sürgülü Pencere",
    "brandStyle": "Mimari Pencere · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "metal",
    "dimensionsCm": {
      "width": 150,
      "depth": 14,
      "height": 140
    },
    "polyEstimate": 1792,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r153_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r153_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "pencere",
      "sürgülü pencere",
      "alüminyum doğrama",
      "antrasit pencere",
      "dış cephe"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r153-06",
    "slug": "yuksek_dikey_fransiz_balkon_surgulu_penceresi",
    "name": "Yüksek Dikey Fransız Balkon Sürgülü Penceresi",
    "brandStyle": "Mimari Pencere · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "metal",
    "dimensionsCm": {
      "width": 150,
      "depth": 14,
      "height": 140
    },
    "polyEstimate": 2604,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r153_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r153_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "pencere",
      "sürgülü pencere",
      "alüminyum doğrama",
      "antrasit pencere",
      "dış cephe"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r705-01",
    "slug": "beyaz_aluminyum_vasistas_pencere_90_60",
    "name": "Beyaz Alüminyum Vasistas Pencere (90×60)",
    "brandStyle": "Vasistas Pencere · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "metal",
    "dimensionsCm": {
      "width": 90,
      "depth": 60,
      "height": 70
    },
    "polyEstimate": 2176,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r705_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r705_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "vasistas pencere",
      "banyo penceresi",
      "alüminyum pencere",
      "buzlu cam pencere"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r705-02",
    "slug": "bronz_eloksal_buzlu_cam_banyo_vasistas_penceresi",
    "name": "Bronz Eloksal Buzlu Cam Banyo Vasistas Penceresi (120×45)",
    "brandStyle": "Vasistas Pencere · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "metal",
    "dimensionsCm": {
      "width": 120,
      "depth": 45,
      "height": 70
    },
    "polyEstimate": 1716,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r705_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r705_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "vasistas pencere",
      "banyo penceresi",
      "alüminyum pencere",
      "buzlu cam pencere"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r705-03",
    "slug": "antrasit_cift_katli_ust_uste_vasistas_pencere_80",
    "name": "Antrasit Çift Katlı Üst Üste Vasistas Pencere (80×140)",
    "brandStyle": "Vasistas Pencere · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "metal",
    "dimensionsCm": {
      "width": 80,
      "depth": 140,
      "height": 70
    },
    "polyEstimate": 2112,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r705_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r705_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "vasistas pencere",
      "banyo penceresi",
      "alüminyum pencere",
      "buzlu cam pencere"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r705-05",
    "slug": "isi_yalitimli_gumus_aluminyum_genis_vasistas_100",
    "name": "Isı Yalıtımlı Gümüş Alüminyum Geniş Vasistas (100×70)",
    "brandStyle": "Vasistas Pencere · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "metal",
    "dimensionsCm": {
      "width": 100,
      "depth": 70,
      "height": 70
    },
    "polyEstimate": 2788,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r705_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r705_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "vasistas pencere",
      "banyo penceresi",
      "alüminyum pencere",
      "buzlu cam pencere"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r151-01",
    "slug": "beyaz_aluminyum_pencere_jaluzi_perdesi",
    "name": "Beyaz Alüminyum Pencere Jaluzi Perdesi",
    "brandStyle": "Jaluzi & Perde · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 120,
      "depth": 6,
      "height": 160
    },
    "polyEstimate": 1148,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r151_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r151_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "jaluzi",
      "ahşap jaluzi",
      "pencere perdesi",
      "stor perde",
      "bambu jaluzi"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r151-02",
    "slug": "genis_bantli_dogal_ahsap_jaluzi_perde",
    "name": "Geniş Bantlı Doğal Ahşap Jaluzi Perde",
    "brandStyle": "Jaluzi & Perde · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 120,
      "depth": 6,
      "height": 160
    },
    "polyEstimate": 2820,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r151_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r151_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "jaluzi",
      "ahşap jaluzi",
      "pencere perdesi",
      "stor perde",
      "bambu jaluzi"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r151-03",
    "slug": "mat_siyah_minimalist_aluminyum_jaluzi",
    "name": "Mat Siyah Minimalist Alüminyum Jaluzi",
    "brandStyle": "Jaluzi & Perde · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 120,
      "depth": 6,
      "height": 160
    },
    "polyEstimate": 2344,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r151_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r151_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "jaluzi",
      "ahşap jaluzi",
      "pencere perdesi",
      "stor perde",
      "bambu jaluzi"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r151-04",
    "slug": "dogal_bambu_gorunumlu_ahsap_jaluzi_perde",
    "name": "Doğal Bambu Görünümlü Ahşap Jaluzi Perde",
    "brandStyle": "Jaluzi & Perde · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 120,
      "depth": 6,
      "height": 160
    },
    "polyEstimate": 1892,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r151_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r151_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "jaluzi",
      "ahşap jaluzi",
      "pencere perdesi",
      "stor perde",
      "bambu jaluzi"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r151-05",
    "slug": "gumus_genis_salon_pencere_jaluzisi",
    "name": "Gümüş Geniş Salon Pencere Jaluzisi",
    "brandStyle": "Jaluzi & Perde · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "wood",
    "dimensionsCm": {
      "width": 120,
      "depth": 6,
      "height": 160
    },
    "polyEstimate": 6884,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r151_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r151_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "jaluzi",
      "ahşap jaluzi",
      "pencere perdesi",
      "stor perde",
      "bambu jaluzi"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r704-01",
    "slug": "teras_kapisi_icin_beyaz_dikey_perde_sistemi_180_",
    "name": "Teras Kapısı İçin Beyaz Dikey Perde Sistemi (180×210)",
    "brandStyle": "Dikey Perde · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 180,
      "depth": 10,
      "height": 210
    },
    "polyEstimate": 2092,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r704_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r704_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "dikey perde",
      "tül dikey perde",
      "balkon kapısı perdesi",
      "ofis perdesi"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r704-02",
    "slug": "krem_dokulu_kisa_mutfak_dikey_perdesi_90_120",
    "name": "Krem Dokulu Kısa Mutfak Dikey Perdesi (90×120)",
    "brandStyle": "Dikey Perde · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 90,
      "depth": 120,
      "height": 210
    },
    "polyEstimate": 2136,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r704_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r704_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "dikey perde",
      "tül dikey perde",
      "balkon kapısı perdesi",
      "ofis perdesi"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r704-03",
    "slug": "acik_gri_modern_ofis_salon_dikey_perdesi_150_160",
    "name": "Açık Gri Modern Ofis & Salon Dikey Perdesi (150×160)",
    "brandStyle": "Dikey Perde · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 180,
      "depth": 10,
      "height": 210
    },
    "polyEstimate": 1524,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r704_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r704_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "dikey perde",
      "tül dikey perde",
      "balkon kapısı perdesi",
      "ofis perdesi"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r704-05",
    "slug": "ceviz_ahsap_gorunumlu_seritli_dikey_perde_120_18",
    "name": "Ceviz Ahşap Görünümlü Şeritli Dikey Perde (120×180)",
    "brandStyle": "Dikey Perde · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "wall-mounted",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 120,
      "depth": 180,
      "height": 210
    },
    "polyEstimate": 2872,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r704_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r704_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "dikey perde",
      "tül dikey perde",
      "balkon kapısı perdesi",
      "ofis perdesi"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r121-01",
    "slug": "tek_kesonlu_dogal_mese_calisma_masasi",
    "name": "Tek Kesonlu Doğal Meşe Çalışma Masası",
    "brandStyle": "Çalışma Masası · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 140,
      "depth": 70,
      "height": 75
    },
    "polyEstimate": 1128,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r121_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r121_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çalışma masası",
      "ofis masası",
      "bilgisayar masası",
      "yazı masası",
      "genç odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r121-02",
    "slug": "cift_kesonlu_ceviz_ev_ofis_calisma_masasi",
    "name": "Çift Kesonlu Ceviz Ev Ofis Çalışma Masası",
    "brandStyle": "Çalışma Masası · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 140,
      "depth": 70,
      "height": 75
    },
    "polyEstimate": 5184,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r121_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r121_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çalışma masası",
      "ofis masası",
      "bilgisayar masası",
      "yazı masası",
      "genç odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r121-03",
    "slug": "iki_cekmeceli_ince_modern_yazi_masasi",
    "name": "İki Çekmeceli İnce Modern Yazı Masası",
    "brandStyle": "Çalışma Masası · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 140,
      "depth": 70,
      "height": 75
    },
    "polyEstimate": 2896,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r121_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r121_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çalışma masası",
      "ofis masası",
      "bilgisayar masası",
      "yazı masası",
      "genç odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r121-04",
    "slug": "siyah_celik_ayakli_endustriyel_calisma_masasi",
    "name": "Siyah Çelik Ayaklı Endüstriyel Çalışma Masası",
    "brandStyle": "Çalışma Masası · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 140,
      "depth": 70,
      "height": 75
    },
    "polyEstimate": 10036,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r121_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r121_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çalışma masası",
      "ofis masası",
      "bilgisayar masası",
      "yazı masası",
      "genç odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r121-06",
    "slug": "iskandinav_tik_ahsap_modern_calisma_masasi",
    "name": "İskandinav Tik Ahşap Modern Çalışma Masası",
    "brandStyle": "Çalışma Masası · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 140,
      "depth": 70,
      "height": 75
    },
    "polyEstimate": 6028,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r121_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r121_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çalışma masası",
      "ofis masası",
      "bilgisayar masası",
      "yazı masası",
      "genç odası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r122-01",
    "slug": "cift_motorlu_yukseklik_ayarli_calisma_masasi",
    "name": "Çift Motorlu Yükseklik Ayarlı Çalışma Masası",
    "brandStyle": "Yükseklik Ayarlı Masa · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 150,
      "depth": 75,
      "height": 75
    },
    "polyEstimate": 968,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r122_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r122_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "yükseklik ayarlı masa",
      "elektrikli çalışma masası",
      "standing desk",
      "ofis masası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r122-02",
    "slug": "kompakt_tek_motorlu_ev_ofis_masasi",
    "name": "Kompakt Tek Motorlu Ev Ofis Masası",
    "brandStyle": "Yükseklik Ayarlı Masa · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 150,
      "depth": 75,
      "height": 75
    },
    "polyEstimate": 36050,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r122_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r122_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "yükseklik ayarlı masa",
      "elektrikli çalışma masası",
      "standing desk",
      "ofis masası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r122-03",
    "slug": "ceviz_tablali_elektrikli_yukseklik_ayarli_masa",
    "name": "Ceviz Tablalı Elektrikli Yükseklik Ayarlı Masa",
    "brandStyle": "Yükseklik Ayarlı Masa · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 150,
      "depth": 75,
      "height": 75
    },
    "polyEstimate": 2314,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r122_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r122_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "yükseklik ayarlı masa",
      "elektrikli çalışma masası",
      "standing desk",
      "ofis masası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r122-04",
    "slug": "l_kose_elektrikli_yukseklik_ayarli_calisma_masas",
    "name": "L Köşe Elektrikli Yükseklik Ayarlı Çalışma Masası",
    "brandStyle": "Yükseklik Ayarlı Masa · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 150,
      "depth": 75,
      "height": 75
    },
    "polyEstimate": 1312,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r122_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r122_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "yükseklik ayarlı masa",
      "elektrikli çalışma masası",
      "standing desk",
      "ofis masası"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r653-01",
    "slug": "dogal_mese_l_kose_calisma_masasi_140_140",
    "name": "Doğal Meşe L Köşe Çalışma Masası (140×140)",
    "brandStyle": "Köşe Çalışma Masası · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 140,
      "depth": 140,
      "height": 75
    },
    "polyEstimate": 1700,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r653_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r653_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "köşe çalışma masası",
      "l çalışma masası",
      "bilgisayar masası",
      "ofis"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r653-03",
    "slug": "koyu_ceviz_siyah_metal_endustriyel_l_masa_150_12",
    "name": "Koyu Ceviz & Siyah Metal Endüstriyel L Masa (150×120)",
    "brandStyle": "Köşe Çalışma Masası · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 150,
      "depth": 120,
      "height": 75
    },
    "polyEstimate": 300,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r653_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r653_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "köşe çalışma masası",
      "l çalışma masası",
      "bilgisayar masası",
      "ofis"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r653-04",
    "slug": "3_cekmeceli_akcaagac_l_kose_calisma_masasi_160_1",
    "name": "3 Çekmeceli Akçaağaç L Köşe Çalışma Masası (160×110)",
    "brandStyle": "Köşe Çalışma Masası · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 160,
      "depth": 110,
      "height": 74
    },
    "polyEstimate": 25596,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r653_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r653_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "köşe çalışma masası",
      "l çalışma masası",
      "bilgisayar masası",
      "ofis"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r653-06",
    "slug": "yuksek_ayakta_calisma_l_kose_masasi_130_100",
    "name": "Yüksek Ayakta Çalışma L Köşe Masası (130×100)",
    "brandStyle": "Köşe Çalışma Masası · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 130,
      "depth": 100,
      "height": 105
    },
    "polyEstimate": 908,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r653_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r653_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "köşe çalışma masası",
      "l çalışma masası",
      "bilgisayar masası",
      "ofis"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r718-01",
    "slug": "koyu_ceviz_deri_sumenli_yonetici_masasi_180_85",
    "name": "Koyu Ceviz & Deri Sümenli Yönetici Masası (180×85)",
    "brandStyle": "Makam & Yönetici Masası · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 180,
      "depth": 85,
      "height": 76
    },
    "polyEstimate": 2664,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r718_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r718_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "makam masası",
      "yönetici masası",
      "büyük çalışma masası",
      "ceviz masa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r718-02",
    "slug": "cift_kesonlu_pirinc_kulplu_klasik_makam_masasi_2",
    "name": "Çift Kesonlu Pirinç Kulplu Klasik Makam Masası (200×95)",
    "brandStyle": "Makam & Yönetici Masası · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 200,
      "depth": 95,
      "height": 78
    },
    "polyEstimate": 11860,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r718_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r718_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "makam masası",
      "yönetici masası",
      "büyük çalışma masası",
      "ceviz masa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r718-03",
    "slug": "beyaz_mese_siyah_celik_kizakli_modern_yonetici_m",
    "name": "Beyaz Meşe & Siyah Çelik Kızaklı Modern Yönetici Masası (180×80)",
    "brandStyle": "Makam & Yönetici Masası · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 180,
      "depth": 80,
      "height": 75
    },
    "polyEstimate": 4600,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r718_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r718_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "makam masası",
      "yönetici masası",
      "büyük çalışma masası",
      "ceviz masa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r718-04",
    "slug": "l_etajerli_espresso_makam_masasi_180_160",
    "name": "L Etajerli Espresso Makam Masası (180×160)",
    "brandStyle": "Makam & Yönetici Masası · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 180,
      "depth": 160,
      "height": 76
    },
    "polyEstimate": 5116,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r718_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r718_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "makam masası",
      "yönetici masası",
      "büyük çalışma masası",
      "ceviz masa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r718-05",
    "slug": "fume_temperli_cam_tablali_modern_yonetici_masasi",
    "name": "Füme Temperli Cam Tablalı Modern Yönetici Masası (170×80)",
    "brandStyle": "Makam & Yönetici Masası · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 170,
      "depth": 80,
      "height": 75
    },
    "polyEstimate": 3772,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r718_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r718_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "makam masası",
      "yönetici masası",
      "büyük çalışma masası",
      "ceviz masa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r717-01",
    "slug": "file_sirtli_ergonomik_siyah_ofis_calisma_koltugu",
    "name": "File Sırtlı Ergonomik Siyah Ofis Çalışma Koltuğu",
    "brandStyle": "Ofis & Çalışma Koltuğu · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 66,
      "depth": 66,
      "height": 112
    },
    "polyEstimate": 160056,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r717_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r717_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çalışma koltuğu",
      "ofis koltuğu",
      "ergonomik koltuk",
      "makam koltuğu"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r717-02",
    "slug": "aluminyum_ayakli_yonetici_makam_koltugu",
    "name": "Alüminyum Ayaklı Yönetici Makam Koltuğu",
    "brandStyle": "Ofis & Çalışma Koltuğu · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 70,
      "depth": 70,
      "height": 120
    },
    "polyEstimate": 26116,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r717_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r717_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çalışma koltuğu",
      "ofis koltuğu",
      "ergonomik koltuk",
      "makam koltuğu"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r717-03",
    "slug": "yuksek_sirtli_spor_oyuncu_calisma_koltugu",
    "name": "Yüksek Sırtlı Spor & Oyuncu Çalışma Koltuğu",
    "brandStyle": "Ofis & Çalışma Koltuğu · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 70,
      "depth": 70,
      "height": 130
    },
    "polyEstimate": 6366,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r717_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r717_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çalışma koltuğu",
      "ofis koltuğu",
      "ergonomik koltuk",
      "makam koltuğu"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r717-06",
    "slug": "krom_cemberli_yuksek_mimari_cizim_taburesi",
    "name": "Krom Çemberli Yüksek Mimari Çizim Taburesi",
    "brandStyle": "Ofis & Çalışma Koltuğu · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 65,
      "depth": 65,
      "height": 120
    },
    "polyEstimate": 16252,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r717_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r717_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "çalışma koltuğu",
      "ofis koltuğu",
      "ergonomik koltuk",
      "makam koltuğu"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r651-01",
    "slug": "oturma_bankli_dogal_mese_antre_portmanto_100_185",
    "name": "Oturma Banklı Doğal Meşe Antre Portmanto (100×185)",
    "brandStyle": "Antre & Vestiyer · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 100,
      "depth": 40,
      "height": 185
    },
    "polyEstimate": 6048,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r651_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r651_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "vestiyer",
      "portmanto",
      "antre dolabı",
      "ayakkabılıklı bank",
      "askılık"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r651-02",
    "slug": "beyaz_lake_citalarli_country_vestiyer_120_190",
    "name": "Beyaz Lake Çıtalarlı Country Vestiyer (120×190)",
    "brandStyle": "Antre & Vestiyer · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 120,
      "depth": 45,
      "height": 190
    },
    "polyEstimate": 4642,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r651_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r651_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "vestiyer",
      "portmanto",
      "antre dolabı",
      "ayakkabılıklı bank",
      "askılık"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r651-03",
    "slug": "dar_antre_icin_ceviz_kompakt_portmanto_70_170",
    "name": "Dar Antre İçin Ceviz Kompakt Portmanto (70×170)",
    "brandStyle": "Antre & Vestiyer · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 70,
      "depth": 35,
      "height": 170
    },
    "polyEstimate": 13824,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r651_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r651_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "vestiyer",
      "portmanto",
      "antre dolabı",
      "ayakkabılıklı bank",
      "askılık"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r651-04",
    "slug": "siyah_celik_ahsap_endustriyel_antre_vestiyeri_11",
    "name": "Siyah Çelik & Ahşap Endüstriyel Antre Vestiyeri (110×180)",
    "brandStyle": "Antre & Vestiyer · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 110,
      "depth": 38,
      "height": 180
    },
    "polyEstimate": 14980,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r651_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r651_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "vestiyer",
      "portmanto",
      "antre dolabı",
      "ayakkabılıklı bank",
      "askılık"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r651-06",
    "slug": "uc_bolmeli_genis_gri_mese_villa_vestiyeri_150_19",
    "name": "Üç Bölmeli Geniş Gri Meşe Villa Vestiyeri (150×195)",
    "brandStyle": "Antre & Vestiyer · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 150,
      "depth": 42,
      "height": 195
    },
    "polyEstimate": 10632,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r651_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r651_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "vestiyer",
      "portmanto",
      "antre dolabı",
      "ayakkabılıklı bank",
      "askılık"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r205-03",
    "slug": "dar_antre_icin_cok_katli_modern_ayakkabilik",
    "name": "Dar Antre İçin Çok Katlı Modern Ayakkabılık",
    "brandStyle": "Antre & Ayakkabılık · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 85,
      "depth": 32,
      "height": 70
    },
    "polyEstimate": 11776,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r205_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r205_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ayakkabılık",
      "antre",
      "oturma bankı",
      "ayakkabı rafı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r205-04",
    "slug": "ahsap_oturma_bankli_2_katli_antre_ayakkabiligi",
    "name": "Ahşap Oturma Banklı 2 Katlı Antre Ayakkabılığı",
    "brandStyle": "Antre & Ayakkabılık · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 85,
      "depth": 32,
      "height": 70
    },
    "polyEstimate": 3644,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r205_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r205_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ayakkabılık",
      "antre",
      "oturma bankı",
      "ayakkabı rafı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r205-05",
    "slug": "genis_iki_rafli_metal_ahsap_ayakkabilik",
    "name": "Geniş İki Raflı Metal & Ahşap Ayakkabılık",
    "brandStyle": "Antre & Ayakkabılık · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 85,
      "depth": 32,
      "height": 70
    },
    "polyEstimate": 14336,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r205_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r205_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ayakkabılık",
      "antre",
      "oturma bankı",
      "ayakkabı rafı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r205-06",
    "slug": "6_katli_yuksek_kule_tipi_antre_ayakkabiligi",
    "name": "6 Katlı Yüksek Kule Tipi Antre Ayakkabılığı",
    "brandStyle": "Antre & Ayakkabılık · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 85,
      "depth": 32,
      "height": 70
    },
    "polyEstimate": 1728,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r205_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r205_06",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "ayakkabılık",
      "antre",
      "oturma bankı",
      "ayakkabı rafı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r206-01",
    "slug": "8_kancali_uc_ayakli_modern_ayakli_askilik",
    "name": "8 Kancalı Üç Ayaklı Modern Ayaklı Askılık",
    "brandStyle": "Antre Askılık · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "metal",
    "dimensionsCm": {
      "width": 45,
      "depth": 45,
      "height": 175
    },
    "polyEstimate": 38304,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r206_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r206_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "askılık",
      "ayaklı askılık",
      "dilsiz uşak",
      "antre",
      "portmanto"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r206-02",
    "slug": "duvar_rayli_minimalist_antre_askiligi",
    "name": "Duvar Raylı Minimalist Antre Askılığı",
    "brandStyle": "Antre Askılık · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "metal",
    "dimensionsCm": {
      "width": 45,
      "depth": 45,
      "height": 175
    },
    "polyEstimate": 16926,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r206_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r206_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "askılık",
      "ayaklı askılık",
      "dilsiz uşak",
      "antre",
      "portmanto"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r206-03",
    "slug": "mermer_tabanli_yuvarlak_ayakli_metal_askilik",
    "name": "Mermer Tabanlı Yuvarlak Ayaklı Metal Askılık",
    "brandStyle": "Antre Askılık · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "metal",
    "dimensionsCm": {
      "width": 45,
      "depth": 45,
      "height": 175
    },
    "polyEstimate": 17016,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r206_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r206_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "askılık",
      "ayaklı askılık",
      "dilsiz uşak",
      "antre",
      "portmanto"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r206-04",
    "slug": "agac_dali_formlu_tasarim_ayakli_portmanto_askili",
    "name": "Ağaç Dalı Formlu Tasarım Ayaklı Portmanto Askılık",
    "brandStyle": "Antre Askılık · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "metal",
    "dimensionsCm": {
      "width": 45,
      "depth": 45,
      "height": 175
    },
    "polyEstimate": 36816,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r206_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r206_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "askılık",
      "ayaklı askılık",
      "dilsiz uşak",
      "antre",
      "portmanto"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r681-01",
    "slug": "beyaz_minimalist_mobil_salon_klimasi_45_75",
    "name": "Beyaz Minimalist Mobil Salon Kliması (45×75)",
    "brandStyle": "İklimlendirme · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 45,
      "depth": 38,
      "height": 75
    },
    "polyEstimate": 3124,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r681_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r681_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "klima",
      "mobil klima",
      "salon kliması",
      "iklimlendirme"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r681-03",
    "slug": "mat_siyah_cift_kanalli_modern_mobil_klima_48_80",
    "name": "Mat Siyah Çift Kanallı Modern Mobil Klima (48×80)",
    "brandStyle": "İklimlendirme · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 48,
      "depth": 40,
      "height": 80
    },
    "polyEstimate": 12224,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r681_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r681_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "klima",
      "mobil klima",
      "salon kliması",
      "iklimlendirme"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r681-04",
    "slug": "gumus_kule_tipi_ince_salon_klimasi_32_85",
    "name": "Gümüş Kule Tipi İnce Salon Kliması (32×85)",
    "brandStyle": "İklimlendirme · Hazır GLB",
    "category": "Mimari & Çalışma",
    "placement": "floor",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 32,
      "depth": 32,
      "height": 85
    },
    "polyEstimate": 2962,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r681_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r681_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "klima",
      "mobil klima",
      "salon kliması",
      "iklimlendirme"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r159-01",
    "slug": "moduler_blok_formlu_uclu_modern_salon_koltugu",
    "name": "Modüler Blok Formlu Üçlü Modern Salon Koltuğu",
    "brandStyle": "İnegöl Modern Salon · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 230,
      "depth": 95,
      "height": 82
    },
    "polyEstimate": 12084,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r159_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r159_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "koltuk",
      "bukle koltuk",
      "köşe koltuk",
      "üçlü koltuk",
      "modern kanepe"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r159-02",
    "slug": "genis_l_kose_moduler_villa_koltuk_takimi",
    "name": "Geniş L Köşe Modüler Villa Koltuk Takımı",
    "brandStyle": "İnegöl Modern Salon · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 230,
      "depth": 95,
      "height": 82
    },
    "polyEstimate": 69160,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r159_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r159_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "koltuk",
      "bukle koltuk",
      "köşe koltuk",
      "üçlü koltuk",
      "modern kanepe"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r159-03",
    "slug": "ahsap_iskeletli_iskandinav_uclu_koltuk",
    "name": "Ahşap İskeletli İskandinav Üçlü Koltuk",
    "brandStyle": "İnegöl Modern Salon · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 230,
      "depth": 95,
      "height": 82
    },
    "polyEstimate": 12140,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r159_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r159_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "koltuk",
      "bukle koltuk",
      "köşe koltuk",
      "üçlü koltuk",
      "modern kanepe"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r159-04",
    "slug": "alcak_oturumlu_minimalist_japon_tarzi_kanepe",
    "name": "Alçak Oturumlu Minimalist Japon Tarzı Kanepe",
    "brandStyle": "İnegöl Modern Salon · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 230,
      "depth": 95,
      "height": 82
    },
    "polyEstimate": 11056,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r159_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r159_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "koltuk",
      "bukle koltuk",
      "köşe koltuk",
      "üçlü koltuk",
      "modern kanepe"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r159-05",
    "slug": "kavisli_krem_bukle_tasarim_salon_koltugu",
    "name": "Kavisli Krem Bukle Tasarım Salon Koltuğu",
    "brandStyle": "İnegöl Modern Salon · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "fabric_wood",
    "dimensionsCm": {
      "width": 230,
      "depth": 95,
      "height": 82
    },
    "polyEstimate": 17190,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r159_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r159_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "koltuk",
      "bukle koltuk",
      "köşe koltuk",
      "üçlü koltuk",
      "modern kanepe"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r113-01",
    "slug": "alcak_minimalist_modern_tv_unitesi_180_cm",
    "name": "Alçak Minimalist Modern TV Ünitesi (180 cm)",
    "brandStyle": "TV Ünitesi · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 175,
      "depth": 44,
      "height": 52
    },
    "polyEstimate": 5744,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r113_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r113_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "tv ünitesi",
      "tv sehpası",
      "salon konsolu",
      "rattan tv ünitesi"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r113-03",
    "slug": "kose_tipi_kapakli_salon_tv_unitesi",
    "name": "Köşe Tipi Kapaklı Salon TV Ünitesi",
    "brandStyle": "TV Ünitesi · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 175,
      "depth": 44,
      "height": 52
    },
    "polyEstimate": 39748,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r113_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r113_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "tv ünitesi",
      "tv sehpası",
      "salon konsolu",
      "rattan tv ünitesi"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r113-04",
    "slug": "hazeran_rattan_kapakli_bohem_tv_sehpasi",
    "name": "Hazeran / Rattan Kapaklı Bohem TV Sehpası",
    "brandStyle": "TV Ünitesi · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 175,
      "depth": 44,
      "height": 52
    },
    "polyEstimate": 6576,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r113_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r113_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "tv ünitesi",
      "tv sehpası",
      "salon konsolu",
      "rattan tv ünitesi"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r113-07",
    "slug": "tik_ahsap_iskandinav_salon_tv_unitesi_160_58",
    "name": "Tik Ahşap İskandinav Salon TV Ünitesi (160×58)",
    "brandStyle": "TV Ünitesi · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 175,
      "depth": 44,
      "height": 52
    },
    "polyEstimate": 4508,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r113_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r113_07",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "tv ünitesi",
      "tv sehpası",
      "salon konsolu",
      "rattan tv ünitesi"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r188-01",
    "slug": "55_inc_cercevesiz_duz_ekran_smart_tv_123_cm",
    "name": "55 İnç Çerçevesiz Düz Ekran Smart TV (123 cm)",
    "brandStyle": "Salon Elektroniği · Hazır GLB",
    "category": "Salon",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 138,
      "depth": 8,
      "height": 80
    },
    "polyEstimate": 3440,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r188_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r188_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "televizyon",
      "tv",
      "smart tv",
      "55 inç tv",
      "65 inç tv",
      "salon"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r188-02",
    "slug": "43_inc_cift_ayakli_modern_led_televizyon",
    "name": "43 İnç Çift Ayaklı Modern LED Televizyon",
    "brandStyle": "Salon Elektroniği · Hazır GLB",
    "category": "Salon",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 138,
      "depth": 8,
      "height": 80
    },
    "polyEstimate": 19276,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r188_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r188_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "televizyon",
      "tv",
      "smart tv",
      "55 inç tv",
      "65 inç tv",
      "salon"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r188-03",
    "slug": "65_inc_duvara_monte_buyuk_salon_tv_145_cm",
    "name": "65 İnç Duvara Monte Büyük Salon TV (145 cm)",
    "brandStyle": "Salon Elektroniği · Hazır GLB",
    "category": "Salon",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 138,
      "depth": 8,
      "height": 80
    },
    "polyEstimate": 5174,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r188_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r188_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "televizyon",
      "tv",
      "smart tv",
      "55 inç tv",
      "65 inç tv",
      "salon"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r188-05",
    "slug": "kavisli_ekran_curved_modern_tasarim_tv",
    "name": "Kavisli Ekran (Curved) Modern Tasarım TV",
    "brandStyle": "Salon Elektroniği · Hazır GLB",
    "category": "Salon",
    "placement": "wall-mounted",
    "mat": "appliance",
    "dimensionsCm": {
      "width": 138,
      "depth": 8,
      "height": 80
    },
    "polyEstimate": 3372,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r188_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r188_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "televizyon",
      "tv",
      "smart tv",
      "55 inç tv",
      "65 inç tv",
      "salon"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r626-01",
    "slug": "masif_ceviz_iki_kapakli_modern_salon_konsolu_160",
    "name": "Masif Ceviz İki Kapaklı Modern Salon Konsolu (160×80)",
    "brandStyle": "İnegöl Konsol · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 160,
      "depth": 45,
      "height": 80
    },
    "polyEstimate": 12392,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r626_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r626_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "konsol",
      "yemek konsolu",
      "büfe",
      "ceviz konsol",
      "salon dolabı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r626-02",
    "slug": "surgulu_kapakli_tik_ahsap_genis_konsol_180_75",
    "name": "Sürgülü Kapaklı Tik Ahşap Geniş Konsol (180×75)",
    "brandStyle": "İnegöl Konsol · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 180,
      "depth": 45,
      "height": 75
    },
    "polyEstimate": 912,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r626_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r626_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "konsol",
      "yemek konsolu",
      "büfe",
      "ceviz konsol",
      "salon dolabı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r626-03",
    "slug": "beyaz_lake_citalarli_country_yemek_konsolu_150_9",
    "name": "Beyaz Lake Çıtalarlı Country Yemek Konsolu (150×90)",
    "brandStyle": "İnegöl Konsol · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 150,
      "depth": 42,
      "height": 90
    },
    "polyEstimate": 2720,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r626_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r626_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "konsol",
      "yemek konsolu",
      "büfe",
      "ceviz konsol",
      "salon dolabı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r626-05",
    "slug": "acik_mese_tek_cekmeceli_kompakt_konsol_100_80",
    "name": "Açık Meşe Tek Çekmeceli Kompakt Konsol (100×80)",
    "brandStyle": "İnegöl Konsol · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 100,
      "depth": 40,
      "height": 80
    },
    "polyEstimate": 2252,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r626_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r626_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "konsol",
      "yemek konsolu",
      "büfe",
      "ceviz konsol",
      "salon dolabı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r165-01",
    "slug": "ince_dogal_mese_antre_salon_dresuari",
    "name": "İnce Doğal Meşe Antre & Salon Dresuarı",
    "brandStyle": "Dresuar & Antre · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 120,
      "depth": 36,
      "height": 80
    },
    "polyEstimate": 19384,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r165_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r165_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "dresuar",
      "antre sehpası",
      "mermer dresuar",
      "konsol masa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r165-02",
    "slug": "mermer_tablali_metal_ayakli_luks_dresuar",
    "name": "Mermer Tablalı Metal Ayaklı Lüks Dresuar",
    "brandStyle": "Dresuar & Antre · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 120,
      "depth": 36,
      "height": 80
    },
    "polyEstimate": 13480,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r165_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r165_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "dresuar",
      "antre sehpası",
      "mermer dresuar",
      "konsol masa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r165-05",
    "slug": "duvara_monte_yuzer_modern_antre_dresuari",
    "name": "Duvara Monte Yüzer Modern Antre Dresuarı",
    "brandStyle": "Dresuar & Antre · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 120,
      "depth": 36,
      "height": 80
    },
    "polyEstimate": 23532,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r165_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r165_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "dresuar",
      "antre sehpası",
      "mermer dresuar",
      "konsol masa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r165-07",
    "slug": "yarim_daire_maun_klasik_antre_dresuari_100_80",
    "name": "Yarım Daire Maun Klasik Antre Dresuarı (100×80)",
    "brandStyle": "Dresuar & Antre · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 100,
      "depth": 40,
      "height": 80
    },
    "polyEstimate": 3892,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r165_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r165_07",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "dresuar",
      "antre sehpası",
      "mermer dresuar",
      "konsol masa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r114-01",
    "slug": "cift_cam_kapakli_modern_salon_kitapligi",
    "name": "Çift Cam Kapaklı Modern Salon Kitaplığı",
    "brandStyle": "Kitaplık & Vitrin · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 110,
      "depth": 38,
      "height": 195
    },
    "polyEstimate": 1264,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r114_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r114_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "kitaplık",
      "camlı kitaplık",
      "vitrin",
      "salon dolabı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r114-02",
    "slug": "dort_kapakli_genis_villa_kutuphane_vitrin",
    "name": "Dört Kapaklı Geniş Villa Kütüphane Vitrin",
    "brandStyle": "Kitaplık & Vitrin · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 110,
      "depth": 38,
      "height": 195
    },
    "polyEstimate": 5660,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r114_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r114_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "kitaplık",
      "camlı kitaplık",
      "vitrin",
      "salon dolabı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r114-04",
    "slug": "klasik_kapakli_moduler_calisma_kitapligi",
    "name": "Klasik Kapaklı Modüler Çalışma Kitaplığı",
    "brandStyle": "Kitaplık & Vitrin · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 110,
      "depth": 38,
      "height": 195
    },
    "polyEstimate": 1980,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r114_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r114_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "kitaplık",
      "camlı kitaplık",
      "vitrin",
      "salon dolabı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r114-05",
    "slug": "siyah_metal_iskeletli_endustriyel_kitaplik",
    "name": "Siyah Metal İskeletli Endüstriyel Kitaplık",
    "brandStyle": "Kitaplık & Vitrin · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 110,
      "depth": 38,
      "height": 195
    },
    "polyEstimate": 4576,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r114_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r114_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "kitaplık",
      "camlı kitaplık",
      "vitrin",
      "salon dolabı"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r564-01",
    "slug": "parlak_siyah_lake_duvar_piyanosu_villa_salonu",
    "name": "Parlak Siyah Lake Duvar Piyanosu (Villa Salonu)",
    "brandStyle": "Lüks Villa Salonu · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 150,
      "depth": 62,
      "height": 122
    },
    "polyEstimate": 1556,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r564_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r564_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "piyano",
      "duvar piyanosu",
      "salon dekoru",
      "lüks villa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r564-02",
    "slug": "dogal_ceviz_ahsap_akustik_duvar_piyanosu",
    "name": "Doğal Ceviz Ahşap Akustik Duvar Piyanosu",
    "brandStyle": "Lüks Villa Salonu · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 150,
      "depth": 62,
      "height": 122
    },
    "polyEstimate": 2914,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r564_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r564_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "piyano",
      "duvar piyanosu",
      "salon dekoru",
      "lüks villa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r564-03",
    "slug": "parlak_beyaz_modern_studyo_duvar_piyanosu",
    "name": "Parlak Beyaz Modern Stüdyo Duvar Piyanosu",
    "brandStyle": "Lüks Villa Salonu · Hazır GLB",
    "category": "Salon",
    "placement": "floor",
    "mat": "wood",
    "dimensionsCm": {
      "width": 150,
      "depth": 62,
      "height": 122
    },
    "polyEstimate": 3164,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r564_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r564_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "piyano",
      "duvar piyanosu",
      "salon dekoru",
      "lüks villa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r141-01",
    "slug": "5_kanatli_dogal_ahsap_villa_tavan_vantilatoru",
    "name": "5 Kanatlı Doğal Ahşap Villa Tavan Vantilatörü",
    "brandStyle": "Tavan Vantilatörü · Hazır GLB",
    "category": "Aydınlatma",
    "placement": "ceiling",
    "mat": "wood",
    "dimensionsCm": {
      "width": 132,
      "depth": 132,
      "height": 36
    },
    "polyEstimate": 73723,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r141_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r141_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "tavan vantilatörü",
      "ahşap vantilatör",
      "avize vantilatör",
      "villa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r141-02",
    "slug": "3_kanatli_mat_siyah_minimalist_tavan_vantilatoru",
    "name": "3 Kanatlı Mat Siyah Minimalist Tavan Vantilatörü",
    "brandStyle": "Tavan Vantilatörü · Hazır GLB",
    "category": "Aydınlatma",
    "placement": "ceiling",
    "mat": "wood",
    "dimensionsCm": {
      "width": 132,
      "depth": 132,
      "height": 36
    },
    "polyEstimate": 37128,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r141_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r141_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "tavan vantilatörü",
      "ahşap vantilatör",
      "avize vantilatör",
      "villa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r141-03",
    "slug": "alcak_tavan_icin_sifir_montaj_modern_vantilator",
    "name": "Alçak Tavan İçin Sıfır Montaj Modern Vantilatör",
    "brandStyle": "Tavan Vantilatörü · Hazır GLB",
    "category": "Aydınlatma",
    "placement": "ceiling",
    "mat": "wood",
    "dimensionsCm": {
      "width": 132,
      "depth": 132,
      "height": 36
    },
    "polyEstimate": 16464,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r141_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r141_03",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "tavan vantilatörü",
      "ahşap vantilatör",
      "avize vantilatör",
      "villa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r141-05",
    "slug": "6_kanatli_hazeran_rattan_bohem_tavan_vantilatoru",
    "name": "6 Kanatlı Hazeran / Rattan Bohem Tavan Vantilatörü",
    "brandStyle": "Tavan Vantilatörü · Hazır GLB",
    "category": "Aydınlatma",
    "placement": "ceiling",
    "mat": "wood",
    "dimensionsCm": {
      "width": 132,
      "depth": 132,
      "height": 36
    },
    "polyEstimate": 13704,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r141_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r141_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "tavan vantilatörü",
      "ahşap vantilatör",
      "avize vantilatör",
      "villa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r963-01",
    "slug": "altigen_sedir_ahsap_villa_bahce_kamelyasi_350_30",
    "name": "Altıgen Sedir Ahşap Villa Bahçe Kamelyası (350×300)",
    "brandStyle": "Villa Bahçe Kamelya · Hazır GLB",
    "category": "Dış Cephe",
    "placement": "exterior-ground",
    "mat": "wood",
    "dimensionsCm": {
      "width": 350,
      "depth": 300,
      "height": 300
    },
    "polyEstimate": 5748,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r963_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r963_01",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "kamelya",
      "gazebo",
      "pergola",
      "çardak",
      "bahçe",
      "dış cephe",
      "villa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r963-02",
    "slug": "sekizgen_beyaz_klasik_bahce_gazebosu_400_400",
    "name": "Sekizgen Beyaz Klasik Bahçe Gazebosu (400×400)",
    "brandStyle": "Villa Bahçe Kamelya · Hazır GLB",
    "category": "Dış Cephe",
    "placement": "exterior-ground",
    "mat": "wood",
    "dimensionsCm": {
      "width": 400,
      "depth": 400,
      "height": 380
    },
    "polyEstimate": 11056,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r963_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r963_02",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "kamelya",
      "gazebo",
      "pergola",
      "çardak",
      "bahçe",
      "dış cephe",
      "villa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r963-04",
    "slug": "koyu_ahsap_kirma_catili_villa_bahce_cardagi_360_",
    "name": "Koyu Ahşap Kırma Çatılı Villa Bahçe Çardağı (360×300)",
    "brandStyle": "Villa Bahçe Kamelya · Hazır GLB",
    "category": "Dış Cephe",
    "placement": "exterior-ground",
    "mat": "wood",
    "dimensionsCm": {
      "width": 360,
      "depth": 300,
      "height": 290
    },
    "polyEstimate": 736,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r963_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r963_04",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "kamelya",
      "gazebo",
      "pergola",
      "çardak",
      "bahçe",
      "dış cephe",
      "villa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  },
  {
    "id": "exp-uc-ds-r963-05",
    "slug": "kose_tipi_kompakt_bahce_kamelyasi_220_220",
    "name": "Köşe Tipi Kompakt Bahçe Kamelyası (220×220)",
    "brandStyle": "Villa Bahçe Kamelya · Hazır GLB",
    "category": "Dış Cephe",
    "placement": "exterior-ground",
    "mat": "wood",
    "dimensionsCm": {
      "width": 220,
      "depth": 220,
      "height": 250
    },
    "polyEstimate": 2044,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r963_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r963_05",
    "license": "Apache-2.0 (NVIDIA USDCraft)",
    "keywords": [
      "kamelya",
      "gazebo",
      "pergola",
      "çardak",
      "bahçe",
      "dış cephe",
      "villa"
    ],
    "sourceOrigin": "interior-ready",
    "isRoom": false
  }
];

function expandRecord(r: CompactExpandedRecord): ArchitecturalAsset {
  const finishes = FINISH_PALETTES[r.mat];
  const d = r.dimensionsCm;
  const roomExtractNote = r.isRoom
    ? 'Bu varlık çok parçalı tam oda / mobilya seti sahnesidir. Blender içine aktardıktan sonra içindeki koltuk, masa, yatak veya dolapları koleksiyon alt nesnelerinden (veya Separate By Loose Parts) tek tek ayıklayıp kendi villa/daire projenizde kullanabilirsiniz.'
    : 'Hazır taranmış/modellenmiş gerçek 3D .GLB varlığıdır; katalog görseli ile 3D önizleme %100 aynı dosyadan gelir.';

  const surfaceMap: Record<ExpandedMatKind, string> = {
    wood: 'Doğal Ahşap Kaplama / Lake MDF',
    fabric_wood: 'Dokuma Bukle / Keten Kumaş + Ahşap',
    appliance: 'Fırçalı İnox / Temperli Cam / Metal',
    metal: 'Elektrostatik Alüminyum / PVD Metal',
    ceramic: 'Vitrifiye Porselen / Akrilik',
    room: 'Çoklu Mimari İç Mekan PBR Sahnesi',
  };

  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    brandStyle: r.brandStyle,
    category: r.category,
    subCategory: r.subCategory,
    archetype: 'external_gltf',
    placement: r.placement,
    dimensionsCm: d,
    polyEstimate: r.polyEstimate,
    renderEngines: ['Cycles', 'EEVEE'],
    uvUnwrapped: true,
    thumbnailUrl: r.thumbUrl,
    searchKeywords: [...r.keywords, r.category.toLowerCase(), 'hazır 3d', 'blender glb'],
    roomTags: r.isRoom
      ? ['Tam Oda', 'Hazır Sahne', 'AI Ayıklama']
      : [r.category, 'Villa', 'Apartman'],
    aiSummary: `${r.name} — ${d.width}×${d.depth}×${d.height} cm 1:1 metrik, ~${r.polyEstimate.toLocaleString('tr-TR')} üçgen hazır .GLB model. ${roomExtractNote}`,
    finishes,
    defaultFinishId: finishes[0].id,
    patterns: ARCHITECTURAL_PBR_PATTERNS,
    defaultPatternId: 'original_pbr',
    modelingSpec: {
      geometryBreakdown: [
        `Gerçek 1:1 metrik ölçüler: ${d.width} cm genişlik × ${d.depth} cm derinlik × ${d.height} cm yükseklik.`,
        `Hazır 3D Model (${r.license}): ~${r.polyEstimate.toLocaleString('tr-TR')} üçgen poligon, UV açılımlı ve doğrudan Blender uyumlu .GLB.`,
        roomExtractNote,
      ],
      textureAndMaps: {
        surfaceType: surfaceMap[r.mat],
        uvTileCm: 'Orijinal 1:1 PBR UV + Canlı Mimari Doku Katmanı (Bukle, Meşe, Mermer, PVD, Fluted, Beton)',
        bumpDepthMm: '0.3 mm – 2.2 mm (seçilen dokuya göre)',
        roughnessRange: '0.08 – 0.90',
        shaderRecipe: 'Principled BSDF: Orijinal gömülü glTF 2.0 dokuları korunur; 3D Stüdyoda seçilen renk (RAL/HEX) ve doku türü (Bukle, Ahşap Damar, Mermer, Fırçalı PVD, Oluklu Fluted, Brüt Beton) Blender .py betiğine otomatik düğüm (node) olarak yazılır.',
      },
      microDetails: [
        'Katalog önizleme görseli ile 3D sahne birebir aynı .GLB kaynağından üretilmiştir (%100 form tutarlılığı).',
        'Cam ve ayna yüzeyleri renk değişimlerinde otomatik korunur.',
        r.isRoom
          ? 'Blender sahnesinde alt nesneler ayrı mesh/collection yapısındadır; yapay zeka veya mimar istediği tek bir mobilyayı ayırıp sahnesine alabilir.'
          : 'Zemin sıfır kotuna (Z=0.00 m) hizalı merkez pivotlu yerleşim.',
      ],
      blenderModifiers: ['Weighted Normal (Keep Sharp)', 'Bevel 0.002 m (isteğe bağlı yakın plan)'],
      lightingAndCameraTip: 'Doğal pencere gün ışığı (5200K) + Cycles AgX renk yönetimi ile malzeme damar ve kabartmalarını net vurgulayın.',
      aiRenderPrompt: `Photorealistic Turkish contemporary architectural interior render featuring ${r.name} (${d.width}x${d.depth}x${d.height} cm), true 1:1 metric proportions, physically based ${surfaceMap[r.mat]} materials, soft natural daylight, Blender Cycles AgX.`,
      aiBlenderMasterPrompt: r.isRoom
        ? `Blender 4.x Python (bpy): ${r.gltfUrl} tam oda sahnesini bpy.ops.import_scene.gltf ile içeri aktar. Ölçüyü ${d.width}x${d.depth}x${d.height} cm metrik sınıra normalize et. Sahne içindeki mobilyaları (koltuk, yatak, masa, dolap vb.) ayrı objeler halinde listele ve istenen objeyi hedef villa/daire koleksiyonuna ayıkla.`
        : `Blender 4.x Python (bpy): ${r.gltfUrl} hazır 3D varlığını içeri aktar, 1:1 metrik ölçüleri (${d.width}x${d.depth}x${d.height} cm) uygula, seçilen RAL/HEX kaplama ve doku düğümünü Principled BSDF üzerine bağla.`,
    },
    modelSource: {
      provider: 'hf',
      gltfUrl: r.gltfUrl,
      license: r.license,
    },
    sourceOrigin: r.sourceOrigin,
  };
}

export const EXPANDED_INTERIOR_ASSETS: ArchitecturalAsset[] = COMPACT_EXPANDED_RECORDS.map(expandRecord);
