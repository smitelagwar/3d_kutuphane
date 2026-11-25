import type {
  ArchitecturalAsset,
  AssetDimensionsCm,
  BathroomSubCategory,
  MaterialFinish,
  PatternVariant,
  PlacementType,
} from './catalogTypes';

type BathPaletteKind = 'metal' | 'ceramic' | 'vanity' | 'shower' | 'rug';

interface BathRawSeed {
  id: string;
  slug: string;
  name: string;
  brandStyle: string;
  subCategory: BathroomSubCategory;
  placement: PlacementType;
  palette: BathPaletteKind;
  dims: AssetDimensionsCm;
  poly: number;
  thumbUrl: string;
  gltfUrl: string;
  provider: 'hf' | 'abo';
  license: string;
  keywords: string[];
  surfaceType: string;
  summary: string;
}

const BATH_PATTERNS: PatternVariant[] = [
  {
    id: 'original_pbr',
    label: 'Orijinal PBR Doku',
    description: 'Hazır 3D modelin kendi stüdyo taranmış Diffuse, Normal ve Roughness haritaları.',
    bumpScale: 1.0,
    roughnessDelta: 0.0,
  },
  {
    id: 'satin_brushed',
    label: 'Fırçalı Saten / İpek',
    description: 'Fırçalı pirinç, inox veya saten seramik için dengeli yansımalı mimari profil.',
    bumpScale: 0.9,
    roughnessDelta: -0.06,
  },
  {
    id: 'powder_matte',
    label: 'Ekstra Mat (Elektrostatik)',
    description: 'Mat siyah armatür, mat beyaz vitrifiye veya toz boyalı profil yüzeyi.',
    bumpScale: 1.1,
    roughnessDelta: 0.16,
  },
];

const BATH_RUG_PATTERNS: PatternVariant[] = [
  {
    id: 'original_pbr',
    label: 'Orijinal Dokuma',
    description: 'Gerçek stüdyo taranmış pamuk-yün banyo paspası dokusu.',
    bumpScale: 1.0,
    roughnessDelta: 0.0,
  },
  {
    id: 'boucle_loop',
    label: 'Bukle Yumuşak Hav',
    description: 'Yüksek matlıkta dolgun pamuklu banyo paspası yüzeyi.',
    bumpScale: 1.25,
    roughnessDelta: 0.12,
  },
  {
    id: 'fine_linen',
    label: 'Düz Kilim Dokuma',
    description: 'Düşük havlı modern yazlık ve spa banyo kilimi yüzeyi.',
    bumpScale: 0.85,
    roughnessDelta: -0.04,
  },
];

export const BATH_FINISH_PALETTES: Record<BathPaletteKind, MaterialFinish[]> = {
  metal: [
    {
      id: 'orijinal-pbr',
      label: 'Orijinal PBR',
      materialKind: 'metal',
      primaryHex: '#C9CDD4',
      secondaryHex: '#9AA1AE',
      accentHex: '#E5E8EE',
      roughness: 0.22,
      metalness: 0.88,
      preserveOriginalTextures: true,
    },
    {
      id: 'parlak-krom',
      label: 'Parlak Krom',
      materialKind: 'metal',
      primaryHex: '#E8ECEF',
      secondaryHex: '#CFD6DC',
      accentHex: '#FFFFFF',
      roughness: 0.08,
      metalness: 0.98,
    },
    {
      id: 'mat-siyah',
      label: 'Mat Siyah',
      materialKind: 'metal',
      primaryHex: '#23262C',
      secondaryHex: '#181A1F',
      accentHex: '#3A3F47',
      roughness: 0.42,
      metalness: 0.72,
    },
    {
      id: 'fircali-pirinc-gold',
      label: 'Fırçalı Pirinç (Gold)',
      materialKind: 'metal',
      primaryHex: '#D4AF5A',
      secondaryHex: '#B68E3E',
      accentHex: '#E8CC84',
      roughness: 0.24,
      metalness: 0.94,
    },
    {
      id: 'fircali-nikel-inox',
      label: 'Fırçalı Nikel (İnox)',
      materialKind: 'metal',
      primaryHex: '#BFC4CB',
      secondaryHex: '#9BA2AC',
      accentHex: '#DCE0E5',
      roughness: 0.28,
      metalness: 0.92,
    },
    {
      id: 'fume-gunmetal',
      label: 'Füme Gunmetal',
      materialKind: 'metal',
      primaryHex: '#4E545E',
      secondaryHex: '#363B43',
      accentHex: '#6F7682',
      roughness: 0.26,
      metalness: 0.9,
    },
    {
      id: 'rose-gold-bakir',
      label: 'Rose Gold / Bakır',
      materialKind: 'metal',
      primaryHex: '#C98A74',
      secondaryHex: '#A66B57',
      accentHex: '#E3AC97',
      roughness: 0.22,
      metalness: 0.94,
    },
  ],
  shower: [
    {
      id: 'orijinal-pbr',
      label: 'Orijinal PBR',
      materialKind: 'glass',
      primaryHex: '#C8D0D8',
      secondaryHex: '#9CA6B2',
      accentHex: '#E5E8EE',
      roughness: 0.16,
      metalness: 0.85,
      preserveOriginalTextures: true,
    },
    {
      id: 'mat-siyah-profil',
      label: 'Mat Siyah Profil',
      materialKind: 'metal',
      primaryHex: '#202329',
      secondaryHex: '#17191E',
      accentHex: '#3A3F47',
      roughness: 0.4,
      metalness: 0.74,
    },
    {
      id: 'parlak-krom-profil',
      label: 'Parlak Krom Profil',
      materialKind: 'metal',
      primaryHex: '#E6EAEE',
      secondaryHex: '#CBD2DA',
      accentHex: '#FFFFFF',
      roughness: 0.1,
      metalness: 0.96,
    },
    {
      id: 'fircali-gold-profil',
      label: 'Fırçalı Gold Profil',
      materialKind: 'metal',
      primaryHex: '#D1AC58',
      secondaryHex: '#B28A3C',
      accentHex: '#E6CA82',
      roughness: 0.24,
      metalness: 0.92,
    },
    {
      id: 'fume-gunmetal-profil',
      label: 'Antrasit / Gunmetal',
      materialKind: 'metal',
      primaryHex: '#4A505A',
      secondaryHex: '#343941',
      accentHex: '#6C7380',
      roughness: 0.28,
      metalness: 0.88,
    },
    {
      id: 'beyaz-profil',
      label: 'Mat Beyaz Profil',
      materialKind: 'ceramic',
      primaryHex: '#F2F4F7',
      secondaryHex: '#DCE1E8',
      accentHex: '#FFFFFF',
      roughness: 0.34,
      metalness: 0.15,
    },
  ],
  ceramic: [
    {
      id: 'orijinal-pbr',
      label: 'Orijinal PBR',
      materialKind: 'ceramic',
      primaryHex: '#F4F5F7',
      secondaryHex: '#D8DCE3',
      accentHex: '#C5CBD4',
      roughness: 0.14,
      metalness: 0.04,
      preserveOriginalTextures: true,
    },
    {
      id: 'parlak-beyaz-seramik',
      label: 'Parlak Beyaz',
      materialKind: 'ceramic',
      primaryHex: '#FAFAFB',
      secondaryHex: '#E5E8EE',
      accentHex: '#D0D5DD',
      roughness: 0.09,
      metalness: 0.04,
    },
    {
      id: 'mat-beyaz-seramik',
      label: 'Mat Beyaz',
      materialKind: 'ceramic',
      primaryHex: '#EFEFEF',
      secondaryHex: '#DCDDE0',
      accentHex: '#C5C8CE',
      roughness: 0.48,
      metalness: 0.02,
    },
    {
      id: 'mat-kasmir-bej',
      label: 'Mat Kaşmir / Bej',
      materialKind: 'ceramic',
      primaryHex: '#DDD5C9',
      secondaryHex: '#C2B7A8',
      accentHex: '#B89A67',
      roughness: 0.44,
      metalness: 0.02,
    },
    {
      id: 'mat-tas-gri',
      label: 'Mat Taş Gri',
      materialKind: 'ceramic',
      primaryHex: '#A6ABB3',
      secondaryHex: '#848A94',
      accentHex: '#C7CCD4',
      roughness: 0.45,
      metalness: 0.04,
    },
    {
      id: 'mat-antrasit-seramik',
      label: 'Mat Antrasit',
      materialKind: 'ceramic',
      primaryHex: '#3A3E46',
      secondaryHex: '#272A30',
      accentHex: '#C29E60',
      roughness: 0.46,
      metalness: 0.06,
    },
    {
      id: 'mat-siyah-seramik',
      label: 'Mat Siyah',
      materialKind: 'ceramic',
      primaryHex: '#22252B',
      secondaryHex: '#16181C',
      accentHex: '#D4AF5A',
      roughness: 0.44,
      metalness: 0.08,
    },
  ],
  vanity: [
    {
      id: 'orijinal-pbr',
      label: 'Orijinal PBR',
      materialKind: 'wood',
      primaryHex: '#B89B7A',
      secondaryHex: '#F4F5F7',
      accentHex: '#2C3038',
      roughness: 0.48,
      metalness: 0.05,
      preserveOriginalTextures: true,
    },
    {
      id: 'mat-beyaz-lake',
      label: 'Mat Beyaz Lake',
      materialKind: 'wood',
      primaryHex: '#F3F4F6',
      secondaryHex: '#FFFFFF',
      accentHex: '#23262C',
      roughness: 0.36,
      metalness: 0.04,
    },
    {
      id: 'dogal-mese',
      label: 'Doğal Meşe',
      materialKind: 'wood',
      primaryHex: '#C6A378',
      secondaryHex: '#F7F7F8',
      accentHex: '#23262C',
      roughness: 0.54,
      metalness: 0.03,
    },
    {
      id: 'amerikan-ceviz',
      label: 'Amerikan Ceviz',
      materialKind: 'wood',
      primaryHex: '#6F4E37',
      secondaryHex: '#F5F5F6',
      accentHex: '#D4AF5A',
      roughness: 0.46,
      metalness: 0.04,
    },
    {
      id: 'kasmir-vizon-lake',
      label: 'Kaşmir / Vizon',
      materialKind: 'wood',
      primaryHex: '#CBBFB1',
      secondaryHex: '#F6F6F7',
      accentHex: '#C9A45C',
      roughness: 0.4,
      metalness: 0.04,
    },
    {
      id: 'adacayi-yesili',
      label: 'Adaçayı Yeşili',
      materialKind: 'wood',
      primaryHex: '#7B8F7E',
      secondaryHex: '#F5F6F7',
      accentHex: '#D4AF5A',
      roughness: 0.42,
      metalness: 0.04,
    },
    {
      id: 'mat-antrasit-lake',
      label: 'Mat Antrasit',
      materialKind: 'wood',
      primaryHex: '#3B4049',
      secondaryHex: '#F4F5F7',
      accentHex: '#D4AF5A',
      roughness: 0.42,
      metalness: 0.06,
    },
  ],
  rug: [
    {
      id: 'orijinal-pbr',
      label: 'Orijinal Dokuma',
      materialKind: 'rug',
      primaryHex: '#E5DDD0',
      secondaryHex: '#C7BBA8',
      accentHex: '#9F9280',
      roughness: 0.88,
      metalness: 0.0,
      preserveOriginalTextures: true,
    },
    {
      id: 'ekru-krem',
      label: 'Ekru / Krem',
      materialKind: 'rug',
      primaryHex: '#EFE9DE',
      secondaryHex: '#D8CEBF',
      accentHex: '#B6A896',
      roughness: 0.9,
      metalness: 0.0,
    },
    {
      id: 'kum-beji',
      label: 'Kum / Vizon',
      materialKind: 'rug',
      primaryHex: '#C8B9A6',
      secondaryHex: '#A79784',
      accentHex: '#8A7B69',
      roughness: 0.88,
      metalness: 0.0,
    },
    {
      id: 'tas-gri',
      label: 'Taş Gri',
      materialKind: 'rug',
      primaryHex: '#A4A9B0',
      secondaryHex: '#848A92',
      accentHex: '#636870',
      roughness: 0.88,
      metalness: 0.0,
    },
    {
      id: 'adacayi-spa',
      label: 'Spa Adaçayı',
      materialKind: 'rug',
      primaryHex: '#8C9E8E',
      secondaryHex: '#6F8171',
      accentHex: '#576859',
      roughness: 0.9,
      metalness: 0.0,
    },
    {
      id: 'koyu-antrasit',
      label: 'Koyu Antrasit',
      materialKind: 'rug',
      primaryHex: '#434852',
      secondaryHex: '#2F333B',
      accentHex: '#1F2228',
      roughness: 0.88,
      metalness: 0.0,
    },
  ],
};

const BATH_SEEDS: BathRawSeed[] = [
  {
    "id": "bath-sim-sanitary-toilet-wallmounted-a01",
    "slug": "banyo-sim-sanitary-toilet-wallmounted-a01",
    "name": "Duvara Asma Kanalsız Seramik Klozet (Yüksek Detay)",
    "brandStyle": "Vitra / Kale Asma Klozet Tarzı",
    "subCategory": "Klozet & Pisuvar",
    "placement": "wall-mounted",
    "palette": "ceramic",
    "dims": {
      "width": 37,
      "depth": 56,
      "height": 42,
      "mountHeight": 40
    },
    "poly": 132640,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/sanitary_toilet_wallMounted_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/sanitary_toilet_wallMounted_a01",
    "provider": "hf",
    "license": "CC-BY-4.0 · NVIDIA SimReady",
    "keywords": [
      "asma klozet",
      "duvara asma klozet",
      "klozet",
      "kanalsız klozet",
      "rimless",
      "vitrifiye",
      "wc"
    ],
    "surfaceType": "Parlak Vitrifiye Porselen",
    "summary": "Duvara Asma Kanalsız Seramik Klozet (Yüksek Detay) — yüksek poligonlu (133k tri) stüdyo taranmış PBR 3D banyo modeli. 1:1 metrik ölçü (37×56×42 cm) ve Blender uyumlu."
  },
  {
    "id": "bath-sim-toilet-a01",
    "slug": "banyo-sim-toilet-a01",
    "name": "Rezervuarlı Modern Seramik Klozet Takımı (186k Tri)",
    "brandStyle": "Vitra / Bien Rezervuarlı Klozet",
    "subCategory": "Klozet & Pisuvar",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 38,
      "depth": 66,
      "height": 79
    },
    "poly": 186043,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/toilet_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/toilet_a01",
    "provider": "hf",
    "license": "CC-BY-4.0 · NVIDIA SimReady",
    "keywords": [
      "rezervuarlı klozet",
      "klozet",
      "yer tipi klozet",
      "seramik klozet",
      "vitrifiye",
      "tuvalet"
    ],
    "surfaceType": "Parlak Vitrifiye Porselen",
    "summary": "Rezervuarlı Modern Seramik Klozet Takımı (186k Tri) — yüksek poligonlu (186k tri) stüdyo taranmış PBR 3D banyo modeli. 1:1 metrik ölçü (38×66×79 cm) ve Blender uyumlu."
  },
  {
    "id": "bath-obj-toilet-24d1b493",
    "slug": "banyo-obj-toilet-24d1b493",
    "name": "Modern Kapaklı Rezervuarlı Banyo Klozeti",
    "brandStyle": "Creavit / Serel Klozet Serisi",
    "subCategory": "Klozet & Pisuvar",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 38,
      "depth": 67,
      "height": 78
    },
    "poly": 18500,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/toilet-24d1b493.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/toilet-24d1b493",
    "provider": "hf",
    "license": "CC-BY-4.0 · Objaverse Studio",
    "keywords": [
      "klozet",
      "rezervuarlı klozet",
      "tuvalet",
      "banyo klozeti",
      "vitrifiye"
    ],
    "surfaceType": "Sırlı Beyaz Seramik",
    "summary": "Modern Kapaklı Rezervuarlı Banyo Klozeti — gerçekçi PBR dokulu hazır banyo 3D modeli (38×67×78 cm). Blender Cycles ve iç mekan görselleştirmeleri için hazır."
  },
  {
    "id": "bath-uc-ds-r228-04",
    "slug": "banyo-ds-r228-04",
    "name": "Minimalist Duvara Asma Klozet (Kompakt)",
    "brandStyle": "Vitra Sento / Geberit Tarzı",
    "subCategory": "Klozet & Pisuvar",
    "placement": "wall-mounted",
    "palette": "ceramic",
    "dims": {
      "width": 36,
      "depth": 53,
      "height": 38,
      "mountHeight": 41
    },
    "poly": 12858,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r228_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r228_04",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "asma klozet",
      "klozet",
      "duvara monte klozet",
      "modern klozet",
      "rimless"
    ],
    "surfaceType": "Parlak Seramik Sır",
    "summary": "Minimalist Duvara Asma Klozet (Kompakt) — Vitra Sento / Geberit Tarzı tarzında 1:1 metrik (36×53×38 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r228-05",
    "slug": "banyo-ds-r228-05",
    "name": "Tek Parça Monoblok Modern Klozet",
    "brandStyle": "Duravit / Bocchi Monoblok",
    "subCategory": "Klozet & Pisuvar",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 39,
      "depth": 68,
      "height": 72
    },
    "poly": 41124,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r228_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r228_05",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "tek parça klozet",
      "monoblok klozet",
      "klozet",
      "modern klozet",
      "vitrifiye"
    ],
    "surfaceType": "Parlak Porselen",
    "summary": "Tek Parça Monoblok Modern Klozet — Duravit / Bocchi Monoblok tarzında 1:1 metrik (39×68×72 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r228-07",
    "slug": "banyo-ds-r228-07",
    "name": "Rezervuarsız Akıllı Klozet (Smart WC)",
    "brandStyle": "Vitra V-Care Akıllı Klozet Tarzı",
    "subCategory": "Klozet & Pisuvar",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 70,
      "depth": 40,
      "height": 50
    },
    "poly": 7944,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r228_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r228_07",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "akıllı klozet",
      "smart klozet",
      "rezervuarsız klozet",
      "lüks klozet",
      "klozet"
    ],
    "surfaceType": "Parlak Vitrifiye Seramik",
    "summary": "Rezervuarsız Akıllı Klozet (Smart WC) — Vitra V-Care Akıllı Klozet Tarzı tarzında 1:1 metrik (70×40×50 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r228-02",
    "slug": "banyo-ds-r228-02",
    "name": "Oval Uzun Hazneli Rezervuarlı Klozet",
    "brandStyle": "Ege Vitrifiye / Kale Tarzı",
    "subCategory": "Klozet & Pisuvar",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 38,
      "depth": 70,
      "height": 78
    },
    "poly": 15130,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r228_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r228_02",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "klozet",
      "oval klozet",
      "rezervuarlı klozet",
      "banyo klozet"
    ],
    "surfaceType": "Parlak Porselen",
    "summary": "Oval Uzun Hazneli Rezervuarlı Klozet — Ege Vitrifiye / Kale Tarzı tarzında 1:1 metrik (38×70×78 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r228-03",
    "slug": "banyo-ds-r228-03",
    "name": "Yuvarlak Kompakt Rezervuarlı Klozet",
    "brandStyle": "Serel / Creavit Kompakt",
    "subCategory": "Klozet & Pisuvar",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 37,
      "depth": 64,
      "height": 76
    },
    "poly": 112456,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r228_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r228_03",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "kompakt klozet",
      "küçük banyo klozeti",
      "klozet",
      "rezervuarlı klozet"
    ],
    "surfaceType": "Parlak Porselen",
    "summary": "Yuvarlak Kompakt Rezervuarlı Klozet — Serel / Creavit Kompakt tarzında 1:1 metrik (37×64×76 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r228-06",
    "slug": "banyo-ds-r228-06",
    "name": "Köşe Tipi Rezervuarlı Klozet",
    "brandStyle": "Özel Köşe WC Vitrifiye",
    "subCategory": "Klozet & Pisuvar",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 46,
      "depth": 72,
      "height": 78
    },
    "poly": 10144,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r228_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r228_06",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "köşe klozet",
      "dar banyo klozeti",
      "klozet",
      "wc"
    ],
    "surfaceType": "Parlak Porselen",
    "summary": "Köşe Tipi Rezervuarlı Klozet — Özel Köşe WC Vitrifiye tarzında 1:1 metrik (46×72×78 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r228-09",
    "slug": "banyo-ds-r228-09",
    "name": "Klasik Yandan Krom Kollu Rezervuarlı Klozet",
    "brandStyle": "Klasik Villa Banyo Vitrifiye",
    "subCategory": "Klozet & Pisuvar",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 66,
      "depth": 37,
      "height": 78
    },
    "poly": 29540,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r228_09.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r228_09",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "klasik klozet",
      "rezervuarlı klozet",
      "klozet",
      "vintage klozet"
    ],
    "surfaceType": "Parlak Beyaz Porselen",
    "summary": "Klasik Yandan Krom Kollu Rezervuarlı Klozet — Klasik Villa Banyo Vitrifiye tarzında 1:1 metrik (66×37×78 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-sim-sanitary-urinal-wallmounted-a01",
    "slug": "banyo-sim-sanitary-urinal-wallmounted-a01",
    "name": "Duvara Asma Sensörlü Seramik Pisuvar",
    "brandStyle": "Vitra / Roca Ticari Pisuvar",
    "subCategory": "Klozet & Pisuvar",
    "placement": "wall-mounted",
    "palette": "ceramic",
    "dims": {
      "width": 36,
      "depth": 34,
      "height": 62,
      "mountHeight": 65
    },
    "poly": 46446,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/sanitary_urinal_wallMounted_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/sanitary_urinal_wallMounted_a01",
    "provider": "hf",
    "license": "CC-BY-4.0 · NVIDIA SimReady",
    "keywords": [
      "pisuvar",
      "asma pisuvar",
      "seramik pisuvar",
      "wc",
      "vitrifiye"
    ],
    "surfaceType": "Parlak Vitrifiye Seramik",
    "summary": "Duvara Asma Sensörlü Seramik Pisuvar — yüksek poligonlu (46k tri) stüdyo taranmış PBR 3D banyo modeli. 1:1 metrik ölçü (36×34×62 cm) ve Blender uyumlu."
  },
  {
    "id": "bath-uc-ds-r779-01",
    "slug": "banyo-ds-r779-01",
    "name": "Modern Oval Duvara Asma Seramik Pisuvar",
    "brandStyle": "Kale / Vitra Pisuvar",
    "subCategory": "Klozet & Pisuvar",
    "placement": "wall-mounted",
    "palette": "ceramic",
    "dims": {
      "width": 36,
      "depth": 35,
      "height": 60,
      "mountHeight": 65
    },
    "poly": 2934,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r779_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r779_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "pisuvar",
      "duvara asma pisuvar",
      "vitrifiye"
    ],
    "surfaceType": "Parlak Porselen",
    "summary": "Modern Oval Duvara Asma Seramik Pisuvar — Kale / Vitra Pisuvar tarzında 1:1 metrik (36×35×60 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r779-04",
    "slug": "banyo-ds-r779-04",
    "name": "Minimalist Dikdörtgen Mimari Pisuvar",
    "brandStyle": "Otel & Ofis WC Serisi",
    "subCategory": "Klozet & Pisuvar",
    "placement": "wall-mounted",
    "palette": "ceramic",
    "dims": {
      "width": 30,
      "depth": 28,
      "height": 45,
      "mountHeight": 65
    },
    "poly": 43738,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r779_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r779_04",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "pisuvar",
      "modern pisuvar",
      "otel banyo"
    ],
    "surfaceType": "Parlak Porselen",
    "summary": "Minimalist Dikdörtgen Mimari Pisuvar — Otel & Ofis WC Serisi tarzında 1:1 metrik (30×28×45 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r777-03",
    "slug": "banyo-ds-r777-03",
    "name": "Mat Siyah Çerçeveli Pivot Cam Duşakabin (75×195)",
    "brandStyle": "Hüppe / Sanica Loft Duşakabin",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "shower",
    "dims": {
      "width": 75,
      "depth": 35,
      "height": 195
    },
    "poly": 4312,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r777_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r777_03",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "duşakabin",
      "siyah duşakabin",
      "pivot duşakabin",
      "cam duşakabin",
      "siyah profil duşakabin",
      "duş kabini"
    ],
    "surfaceType": "Mat Siyah Alüminyum + 8mm Temperli Cam",
    "summary": "Mat Siyah Çerçeveli Pivot Cam Duşakabin (75×195) — Hüppe / Sanica Loft Duşakabin tarzında 1:1 metrik (75×35×195 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r778-03",
    "slug": "banyo-ds-r778-03",
    "name": "Mat Siyah Profilli Sürgülü Cam Duşakabin (140×195)",
    "brandStyle": "Trendyol / Hüppe Mat Siyah Seri",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "shower",
    "dims": {
      "width": 140,
      "depth": 15,
      "height": 195
    },
    "poly": 1032,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r778_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r778_03",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "duşakabin",
      "sürgülü duşakabin",
      "siyah duşakabin",
      "temperli cam duşakabin",
      "duş kabini"
    ],
    "surfaceType": "Mat Siyah Profil + Şeffaf Temperli Cam",
    "summary": "Mat Siyah Profilli Sürgülü Cam Duşakabin (140×195) — Trendyol / Hüppe Mat Siyah Seri tarzında 1:1 metrik (140×15×195 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r778-01",
    "slug": "banyo-ds-r778-01",
    "name": "Parlak Krom Çift Raylı Sürgülü Duşakabin (150×190)",
    "brandStyle": "Sanica / Kabinet Krom Seri",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "shower",
    "dims": {
      "width": 150,
      "depth": 15,
      "height": 190
    },
    "poly": 1800,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r778_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r778_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "sürgülü duşakabin",
      "krom duşakabin",
      "duşakabin",
      "iki duvar arası duşakabin",
      "cam kabin"
    ],
    "surfaceType": "Parlak Krom Profil + Temperli Cam",
    "summary": "Parlak Krom Çift Raylı Sürgülü Duşakabin (150×190) — Sanica / Kabinet Krom Seri tarzında 1:1 metrik (150×15×190 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r778-04",
    "slug": "banyo-ds-r778-04",
    "name": "90×90 Oval Köşe Sürgülü Duşakabin (Krom)",
    "brandStyle": "Türkiye Standart 90x90 Köşe Kabin",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "shower",
    "dims": {
      "width": 90,
      "depth": 90,
      "height": 190
    },
    "poly": 7884,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r778_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r778_04",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "köşe duşakabin",
      "oval duşakabin",
      "90x90 duşakabin",
      "sürgülü duşakabin",
      "duşakabin"
    ],
    "surfaceType": "Gümüş Alüminyum Profil + Oval Temperli Cam",
    "summary": "90×90 Oval Köşe Sürgülü Duşakabin (Krom) — Türkiye Standart 90x90 Köşe Kabin tarzında 1:1 metrik (90×90×190 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r777-05",
    "slug": "banyo-ds-r777-05",
    "name": "90×90 Kare Köşe Menteşeli Cam Duşakabin",
    "brandStyle": "Hüppe / Vitra Kare Köşe Kabin",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "shower",
    "dims": {
      "width": 90,
      "depth": 90,
      "height": 190
    },
    "poly": 1944,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r777_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r777_05",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "kare duşakabin",
      "köşe duşakabin",
      "menteşeli duşakabin",
      "90x90 duşakabin",
      "duşakabin"
    ],
    "surfaceType": "Krom Menteşeli + 8mm Temperli Cam",
    "summary": "90×90 Kare Köşe Menteşeli Cam Duşakabin — Hüppe / Vitra Kare Köşe Kabin tarzında 1:1 metrik (90×90×190 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r777-02",
    "slug": "banyo-ds-r777-02",
    "name": "Fırçalı Nikel Buzlu Cam Menteşeli Duşakabin (80×190)",
    "brandStyle": "Modern Buzlu Cam Kabin",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "shower",
    "dims": {
      "width": 80,
      "depth": 30,
      "height": 190
    },
    "poly": 1472,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r777_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r777_02",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "buzlu cam duşakabin",
      "duşakabin",
      "menteşeli duşakabin",
      "kumlama cam duşakabin"
    ],
    "surfaceType": "Fırçalı Nikel Profil + Buzlu Temperli Cam",
    "summary": "Fırçalı Nikel Buzlu Cam Menteşeli Duşakabin (80×190) — Modern Buzlu Cam Kabin tarzında 1:1 metrik (80×30×190 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r777-04",
    "slug": "banyo-ds-r777-04",
    "name": "Çift Kanat Krom Menteşeli Duşakabin (120×195)",
    "brandStyle": "Geniş Banyo Çift Kapılı Kabin",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "shower",
    "dims": {
      "width": 120,
      "depth": 30,
      "height": 195
    },
    "poly": 3920,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r777_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r777_04",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "çift kapılı duşakabin",
      "120 cm duşakabin",
      "krom duşakabin",
      "duşakabin"
    ],
    "surfaceType": "Parlak Krom Çerçeve + Temperli Cam",
    "summary": "Çift Kanat Krom Menteşeli Duşakabin (120×195) — Geniş Banyo Çift Kapılı Kabin tarzında 1:1 metrik (120×30×195 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r777-06",
    "slug": "banyo-ds-r777-06",
    "name": "Küvet Üstü Katlanır Cam Duş Paneli (80×140)",
    "brandStyle": "Küvet Üstü Cam Paravan",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "shower",
    "dims": {
      "width": 80,
      "depth": 25,
      "height": 140
    },
    "poly": 1668,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r777_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r777_06",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "küvet üstü duşakabin",
      "küvet camı",
      "duş paravanı",
      "duşakabin",
      "cam panel"
    ],
    "surfaceType": "Krom Profil + Şeffaf Temperli Cam",
    "summary": "Küvet Üstü Katlanır Cam Duş Paneli (80×140) — Küvet Üstü Cam Paravan tarzında 1:1 metrik (80×25×140 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r777-07",
    "slug": "banyo-ds-r777-07",
    "name": "Bronz Çerçeveli Desenli Cam Duşakabin (85×200)",
    "brandStyle": "Lüks Villa Bronz Profil Seri",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "shower",
    "dims": {
      "width": 85,
      "depth": 30,
      "height": 200
    },
    "poly": 1964,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r777_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r777_07",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "bronz duşakabin",
      "desenli cam duşakabin",
      "lüks duşakabin",
      "duşakabin"
    ],
    "surfaceType": "Antik Bronz Profil + Desenli Cam",
    "summary": "Bronz Çerçeveli Desenli Cam Duşakabin (85×200) — Lüks Villa Bronz Profil Seri tarzında 1:1 metrik (85×30×200 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r777-08",
    "slug": "banyo-ds-r777-08",
    "name": "Beyaz Profilli Füme Cam Menteşeli Duşakabin (70×190)",
    "brandStyle": "Dar Banyo Füme Cam Kabin",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "shower",
    "dims": {
      "width": 70,
      "depth": 30,
      "height": 190
    },
    "poly": 2460,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r777_08.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r777_08",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "füme cam duşakabin",
      "beyaz duşakabin",
      "dar duşakabin",
      "duşakabin"
    ],
    "surfaceType": "Beyaz Alüminyum + Füme Temperli Cam",
    "summary": "Beyaz Profilli Füme Cam Menteşeli Duşakabin (70×190) — Dar Banyo Füme Cam Kabin tarzında 1:1 metrik (70×30×190 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r778-02",
    "slug": "banyo-ds-r778-02",
    "name": "Üst Raylı Paslanmaz Çelik Sürgülü Duşakabin (120×200)",
    "brandStyle": "Minimalist Çerçevesiz Raylı Kabin",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "shower",
    "dims": {
      "width": 120,
      "depth": 20,
      "height": 200
    },
    "poly": 3336,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r778_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r778_02",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "raylı duşakabin",
      "sürgülü duşakabin",
      "120 cm duşakabin",
      "duşakabin"
    ],
    "surfaceType": "Paslanmaz Çelik Ray + 10mm Cam",
    "summary": "Üst Raylı Paslanmaz Çelik Sürgülü Duşakabin (120×200) — Minimalist Çerçevesiz Raylı Kabin tarzında 1:1 metrik (120×20×200 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r778-05",
    "slug": "banyo-ds-r778-05",
    "name": "Beyaz Profilli Buzlu Cam Çift Sürgülü Duşakabin (160×185)",
    "brandStyle": "Geniş Duvar Arası Buzlu Kabin",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "shower",
    "dims": {
      "width": 160,
      "depth": 15,
      "height": 185
    },
    "poly": 800,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r778_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r778_05",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "buzlu cam duşakabin",
      "160 cm duşakabin",
      "sürgülü duşakabin",
      "duşakabin"
    ],
    "surfaceType": "Beyaz Alüminyum + Buzlu Cam",
    "summary": "Beyaz Profilli Buzlu Cam Çift Sürgülü Duşakabin (160×185) — Geniş Duvar Arası Buzlu Kabin tarzında 1:1 metrik (160×15×185 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r778-06",
    "slug": "banyo-ds-r778-06",
    "name": "Siyah Tekerlekli Loft Üst Raylı Duşakabin (100×210)",
    "brandStyle": "Endüstriyel Loft Duşakabin",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "shower",
    "dims": {
      "width": 100,
      "depth": 20,
      "height": 210
    },
    "poly": 1924,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r778_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r778_06",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "loft duşakabin",
      "siyah raylı duşakabin",
      "sürgülü duşakabin",
      "duşakabin"
    ],
    "surfaceType": "Mat Siyah Çelik Ray + Temperli Cam",
    "summary": "Siyah Tekerlekli Loft Üst Raylı Duşakabin (100×210) — Endüstriyel Loft Duşakabin tarzında 1:1 metrik (100×20×210 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r778-07",
    "slug": "banyo-ds-r778-07",
    "name": "Üç Kanatlı Fırçalı Nikel Sürgülü Duşakabin (180×195)",
    "brandStyle": "Geniş Villa Walk-in Duşakabin",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "shower",
    "dims": {
      "width": 180,
      "depth": 20,
      "height": 195
    },
    "poly": 3748,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r778_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r778_07",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "üç kanatlı duşakabin",
      "geniş duşakabin",
      "duşakabin",
      "sürgülü duşakabin"
    ],
    "surfaceType": "Fırçalı Nikel Profil + Temperli Cam",
    "summary": "Üç Kanatlı Fırçalı Nikel Sürgülü Duşakabin (180×195) — Geniş Villa Walk-in Duşakabin tarzında 1:1 metrik (180×20×195 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r236-01",
    "slug": "banyo-ds-r236-01",
    "name": "Oval Freestanding Monoblok Villa Küveti",
    "brandStyle": "Vitra / Bien Freestanding Küvet",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 170,
      "depth": 78,
      "height": 58
    },
    "poly": 49444,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r236_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r236_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "küvet",
      "oval küvet",
      "freestanding küvet",
      "ayaklı küvet",
      "villa küveti",
      "banyo küveti"
    ],
    "surfaceType": "Parlak Akrilik / Solid Surface",
    "summary": "Oval Freestanding Monoblok Villa Küveti — Vitra / Bien Freestanding Küvet tarzında 1:1 metrik (170×78×58 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r236-02",
    "slug": "banyo-ds-r236-02",
    "name": "Klasik Aslan Ayaklı Oval Banyo Küveti",
    "brandStyle": "Klasik Villa Ayaklı Küvet",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 168,
      "depth": 76,
      "height": 64
    },
    "poly": 390696,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r236_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r236_02",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "ayaklı küvet",
      "klasik küvet",
      "küvet",
      "vintage küvet",
      "banyo küveti"
    ],
    "surfaceType": "Parlak Akrilik + Pirinç/Krom Ayak",
    "summary": "Klasik Aslan Ayaklı Oval Banyo Küveti — Klasik Villa Ayaklı Küvet tarzında 1:1 metrik (168×76×64 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r236-03",
    "slug": "banyo-ds-r236-03",
    "name": "Ankastre Dikdörtgen Modern Banyo Küveti",
    "brandStyle": "Sanica / Vitra Dikdörtgen Küvet",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 170,
      "depth": 75,
      "height": 54
    },
    "poly": 40044,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r236_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r236_03",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "dikdörtgen küvet",
      "ankastre küvet",
      "küvet",
      "banyo küveti"
    ],
    "surfaceType": "Parlak Akrilik",
    "summary": "Ankastre Dikdörtgen Modern Banyo Küveti — Sanica / Vitra Dikdörtgen Küvet tarzında 1:1 metrik (170×75×54 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r236-04",
    "slug": "banyo-ds-r236-04",
    "name": "Köşe Tipi Geniş Banyo Küveti / Jakuzi Formu",
    "brandStyle": "Köşe Küvet & Spa Serisi",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 145,
      "depth": 145,
      "height": 56
    },
    "poly": 8002,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r236_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r236_04",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "köşe küvet",
      "jakuzi",
      "küvet",
      "banyo küveti"
    ],
    "surfaceType": "Parlak Akrilik",
    "summary": "Köşe Tipi Geniş Banyo Küveti / Jakuzi Formu — Köşe Küvet & Spa Serisi tarzında 1:1 metrik (145×145×56 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r236-07",
    "slug": "banyo-ds-r236-07",
    "name": "İnce Kenarlı Minimalist Solid Surface Küvet",
    "brandStyle": "Lüks Otel Spa Küveti",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 110,
      "depth": 75,
      "height": 65
    },
    "poly": 39372,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r236_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r236_07",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "modern küvet",
      "solid surface küvet",
      "freestanding küvet",
      "küvet"
    ],
    "surfaceType": "Mat / Parlak Solid Surface",
    "summary": "İnce Kenarlı Minimalist Solid Surface Küvet — Lüks Otel Spa Küveti tarzında 1:1 metrik (110×75×65 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-obj-bath-674b6c07",
    "slug": "banyo-obj-bath-674b6c07",
    "name": "Modern Spa Bağımsız Oval Banyo Küveti",
    "brandStyle": "Villa Master Banyo Küveti",
    "subCategory": "Duşakabin & Küvet",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 170,
      "depth": 80,
      "height": 58
    },
    "poly": 18500,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/bath-674b6c07.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/bath-674b6c07",
    "provider": "hf",
    "license": "CC-BY-4.0 · Objaverse Studio",
    "keywords": [
      "küvet",
      "oval küvet",
      "spa küvet",
      "banyo küveti"
    ],
    "surfaceType": "Parlak Beyaz Akrilik",
    "summary": "Modern Spa Bağımsız Oval Banyo Küveti — gerçekçi PBR dokulu hazır banyo 3D modeli (170×80×58 cm). Blender Cycles ve iç mekan görselleştirmeleri için hazır."
  },
  {
    "id": "bath-uc-ds-r789-01",
    "slug": "banyo-ds-r789-01",
    "name": "30×30 Kare Krom Tepe Duş Başlığı (Duvar Kollu)",
    "brandStyle": "ECA / Artema Tepe Duş Başlığı",
    "subCategory": "Duş Seti & Batarya",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 30,
      "depth": 45,
      "height": 14,
      "mountHeight": 210
    },
    "poly": 16186,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r789_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r789_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "duş başlığı",
      "tepe duş başlığı",
      "duş seti",
      "yağmurlama duş",
      "krom duş başlığı",
      "kare duş başlığı"
    ],
    "surfaceType": "Parlak Krom Paslanmaz Çelik",
    "summary": "30×30 Kare Krom Tepe Duş Başlığı (Duvar Kollu) — ECA / Artema Tepe Duş Başlığı tarzında 1:1 metrik (30×45×14 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r789-03",
    "slug": "banyo-ds-r789-03",
    "name": "35×35 Mat Siyah Kare Yağmurlama Tepe Duş Başlığı",
    "brandStyle": "Grohe / Artema Mat Siyah Duş",
    "subCategory": "Duş Seti & Batarya",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 35,
      "depth": 46,
      "height": 12,
      "mountHeight": 210
    },
    "poly": 21300,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r789_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r789_03",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "siyah duş başlığı",
      "duş başlığı",
      "duş seti",
      "mat siyah duş",
      "tepe duş",
      "yağmur duş"
    ],
    "surfaceType": "Mat Siyah Paslanmaz Çelik",
    "summary": "35×35 Mat Siyah Kare Yağmurlama Tepe Duş Başlığı — Grohe / Artema Mat Siyah Duş tarzında 1:1 metrik (35×46×12 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r789-10",
    "slug": "banyo-ds-r789-10",
    "name": "30×30 Fırçalı Gold (Pirinç) Kare Tepe Duş Başlığı",
    "brandStyle": "Lüks Villa Gold Duş Serisi",
    "subCategory": "Duş Seti & Batarya",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 30,
      "depth": 50,
      "height": 12,
      "mountHeight": 210
    },
    "poly": 1662,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r789_10.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r789_10",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "gold duş başlığı",
      "pirinç duş başlığı",
      "duş başlığı",
      "duş seti",
      "altın duş"
    ],
    "surfaceType": "Fırçalı Altın / Pirinç PVD",
    "summary": "30×30 Fırçalı Gold (Pirinç) Kare Tepe Duş Başlığı — Lüks Villa Gold Duş Serisi tarzında 1:1 metrik (30×50×12 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r789-02",
    "slug": "banyo-ds-r789-02",
    "name": "Ø25 Yuvarlak Tavan Montaj Yağmur Duş Başlığı",
    "brandStyle": "Tavan Tipi Ankastre Yağmur Duş",
    "subCategory": "Duş Seti & Batarya",
    "placement": "ceiling",
    "palette": "metal",
    "dims": {
      "width": 25,
      "depth": 25,
      "height": 32,
      "mountHeight": 240
    },
    "poly": 56412,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r789_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r789_02",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "tavan duş başlığı",
      "yuvarlak duş başlığı",
      "duş başlığı",
      "duş seti",
      "ankastre duş"
    ],
    "surfaceType": "Fırçalı Nikel Çelik",
    "summary": "Ø25 Yuvarlak Tavan Montaj Yağmur Duş Başlığı — Tavan Tipi Ankastre Yağmur Duş tarzında 1:1 metrik (25×25×32 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r789-04",
    "slug": "banyo-ds-r789-04",
    "name": "Döner Kollu Yuvarlak Krom Duş Başlığı (Ø22)",
    "brandStyle": "ECA / Kale Banyo Duş",
    "subCategory": "Duş Seti & Batarya",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 22,
      "depth": 42,
      "height": 16,
      "mountHeight": 205
    },
    "poly": 5522,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r789_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r789_04",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "duş başlığı",
      "krom duş başlığı",
      "duş seti",
      "yuvarlak duş başlığı"
    ],
    "surfaceType": "Parlak Krom",
    "summary": "Döner Kollu Yuvarlak Krom Duş Başlığı (Ø22) — ECA / Kale Banyo Duş tarzında 1:1 metrik (22×42×16 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r789-05",
    "slug": "banyo-ds-r789-05",
    "name": "50×25 Geniş Dikdörtgen Spa Yağmur Duş Başlığı",
    "brandStyle": "Lüks Villa Spa Yağmurlama Duş",
    "subCategory": "Duş Seti & Batarya",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 50,
      "depth": 36,
      "height": 10,
      "mountHeight": 215
    },
    "poly": 86864,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r789_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r789_05",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "geniş duş başlığı",
      "spa duş başlığı",
      "duş başlığı",
      "duş seti",
      "yağmurlama duş"
    ],
    "surfaceType": "Fırçalı Paslanmaz Çelik",
    "summary": "50×25 Geniş Dikdörtgen Spa Yağmur Duş Başlığı — Lüks Villa Spa Yağmurlama Duş tarzında 1:1 metrik (50×36×10 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r789-06",
    "slug": "banyo-ds-r789-06",
    "name": "Antik Pirinç Klasik Kuğu Kollu Tepe Duş Başlığı",
    "brandStyle": "Klasik Villa Pirinç Duş",
    "subCategory": "Duş Seti & Batarya",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 20,
      "depth": 40,
      "height": 22,
      "mountHeight": 210
    },
    "poly": 15340,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r789_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r789_06",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "antik pirinç duş",
      "klasik duş başlığı",
      "duş başlığı",
      "duş seti"
    ],
    "surfaceType": "Antik Pirinç",
    "summary": "Antik Pirinç Klasik Kuğu Kollu Tepe Duş Başlığı — Klasik Villa Pirinç Duş tarzında 1:1 metrik (20×40×22 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r789-07",
    "slug": "banyo-ds-r789-07",
    "name": "Ø30 LED Halkalı Modern Krom Tepe Duş Başlığı",
    "brandStyle": "LED Işıklı Modern Duş Başlığı",
    "subCategory": "Duş Seti & Batarya",
    "placement": "ceiling",
    "palette": "metal",
    "dims": {
      "width": 30,
      "depth": 30,
      "height": 18,
      "mountHeight": 235
    },
    "poly": 90172,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r789_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r789_07",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "led duş başlığı",
      "tepe duş başlığı",
      "duş başlığı",
      "duş seti"
    ],
    "surfaceType": "Parlak Krom + Akrilik LED Halka",
    "summary": "Ø30 LED Halkalı Modern Krom Tepe Duş Başlığı — LED Işıklı Modern Duş Başlığı tarzında 1:1 metrik (30×30×18 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r789-08",
    "slug": "banyo-ds-r789-08",
    "name": "40×40 Tavan Ankastre Gömme Yağmur Duş Paneli",
    "brandStyle": "Tavana Sıfır Ankastre Duş",
    "subCategory": "Duş Seti & Batarya",
    "placement": "ceiling",
    "palette": "metal",
    "dims": {
      "width": 40,
      "depth": 40,
      "height": 6,
      "mountHeight": 245
    },
    "poly": 6126,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r789_08.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r789_08",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "tavan gömme duş",
      "ankastre duş başlığı",
      "duş başlığı",
      "duş seti"
    ],
    "surfaceType": "Mat Beyaz / Çelik Panel",
    "summary": "40×40 Tavan Ankastre Gömme Yağmur Duş Paneli — Tavana Sıfır Ankastre Duş tarzında 1:1 metrik (40×40×6 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r789-09",
    "slug": "banyo-ds-r789-09",
    "name": "Yükseklik Ayarlı Sürgülü Duş Kolonu & Tepe Başlık",
    "brandStyle": "Artema / ECA Duş Robotu",
    "subCategory": "Duş Seti & Batarya",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 25,
      "depth": 44,
      "height": 95,
      "mountHeight": 130
    },
    "poly": 10886,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r789_09.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r789_09",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "duş robotu",
      "duş kolonu",
      "sürgülü duş seti",
      "duş başlığı seti",
      "duş seti"
    ],
    "surfaceType": "Parlak Krom Paslanmaz Çelik",
    "summary": "Yükseklik Ayarlı Sürgülü Duş Kolonu & Tepe Başlık — Artema / ECA Duş Robotu tarzında 1:1 metrik (25×44×95 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r235-01",
    "slug": "banyo-ds-r235-01",
    "name": "Tek Kollu Ankastre Duş Bataryası (Yuvarlak Rozet)",
    "brandStyle": "ECA / Artema Ankastre Duş",
    "subCategory": "Duş Seti & Batarya",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 16,
      "depth": 12,
      "height": 16,
      "mountHeight": 110
    },
    "poly": 14744,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r235_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r235_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "ankastre duş bataryası",
      "duş bataryası",
      "musluk seti",
      "banyo bataryası",
      "duş mikseri"
    ],
    "surfaceType": "Parlak Krom Pirinç",
    "summary": "Tek Kollu Ankastre Duş Bataryası (Yuvarlak Rozet) — ECA / Artema Ankastre Duş tarzında 1:1 metrik (16×12×16 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r235-04",
    "slug": "banyo-ds-r235-04",
    "name": "Kare Rozetli Modern Ankastre Duş Bataryası",
    "brandStyle": "Grohe Cube / Vitra Kare Ankastre",
    "subCategory": "Duş Seti & Batarya",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 15,
      "depth": 11,
      "height": 15,
      "mountHeight": 110
    },
    "poly": 6524,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r235_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r235_04",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "kare ankastre batarya",
      "duş bataryası",
      "ankastre duş",
      "batarya"
    ],
    "surfaceType": "Parlak Krom",
    "summary": "Kare Rozetli Modern Ankastre Duş Bataryası — Grohe Cube / Vitra Kare Ankastre tarzında 1:1 metrik (15×11×15 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r235-06",
    "slug": "banyo-ds-r235-06",
    "name": "Termostatik Çift Çıkışlı Ankastre Duş Bataryası",
    "brandStyle": "Hansgrohe / Artema Termostatik",
    "subCategory": "Duş Seti & Batarya",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 18,
      "depth": 12,
      "height": 24,
      "mountHeight": 110
    },
    "poly": 13672,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r235_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r235_06",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "termostatik duş bataryası",
      "duş bataryası",
      "ankastre duş",
      "duş seti"
    ],
    "surfaceType": "Parlak Krom / Fırçalı Çelik",
    "summary": "Termostatik Çift Çıkışlı Ankastre Duş Bataryası — Hansgrohe / Artema Termostatik tarzında 1:1 metrik (18×12×24 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r235-07",
    "slug": "banyo-ds-r235-07",
    "name": "Mat Siyah Tek Kollu Ankastre Duş Mikseri",
    "brandStyle": "Mat Siyah Ankastre Banyo Serisi",
    "subCategory": "Duş Seti & Batarya",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 16,
      "depth": 12,
      "height": 18,
      "mountHeight": 110
    },
    "poly": 7736,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r235_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r235_07",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "siyah duş bataryası",
      "mat siyah batarya",
      "ankastre duş bataryası",
      "musluk"
    ],
    "surfaceType": "Mat Siyah Elektrostatik Pirinç",
    "summary": "Mat Siyah Tek Kollu Ankastre Duş Mikseri — Mat Siyah Ankastre Banyo Serisi tarzında 1:1 metrik (16×12×18 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r235-10",
    "slug": "banyo-ds-r235-10",
    "name": "Fırçalı Gold Yönlendiricili Ankastre Duş Bataryası",
    "brandStyle": "Lüks Gold Ankastre Seri",
    "subCategory": "Duş Seti & Batarya",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 14,
      "depth": 24,
      "height": 7,
      "mountHeight": 110
    },
    "poly": 3904,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r235_10.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r235_10",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "gold duş bataryası",
      "pirinç duş bataryası",
      "ankastre duş",
      "batarya"
    ],
    "surfaceType": "Fırçalı Gold PVD",
    "summary": "Fırçalı Gold Yönlendiricili Ankastre Duş Bataryası — Lüks Gold Ankastre Seri tarzında 1:1 metrik (14×24×7 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r235-02",
    "slug": "banyo-ds-r235-02",
    "name": "Klasik Haç Volanlı Ankastre Duş Vanası",
    "brandStyle": "Klasik Villa Banyo Bataryası",
    "subCategory": "Duş Seti & Batarya",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 16,
      "depth": 12,
      "height": 16,
      "mountHeight": 110
    },
    "poly": 7872,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r235_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r235_02",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "klasik duş bataryası",
      "volanlı batarya",
      "duş bataryası"
    ],
    "surfaceType": "Parlak Krom",
    "summary": "Klasik Haç Volanlı Ankastre Duş Vanası — Klasik Villa Banyo Bataryası tarzında 1:1 metrik (16×12×16 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r235-05",
    "slug": "banyo-ds-r235-05",
    "name": "Çift Kollu Klasik Duvar Tipi Banyo & Duş Bataryası",
    "brandStyle": "Klasik Çift Kollu Banyo Bataryası",
    "subCategory": "Duş Seti & Batarya",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 22,
      "depth": 15,
      "height": 16,
      "mountHeight": 105
    },
    "poly": 114844,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r235_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r235_05",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "banyo bataryası",
      "duş bataryası",
      "musluk seti",
      "çift kollu batarya"
    ],
    "surfaceType": "Parlak Krom",
    "summary": "Çift Kollu Klasik Duvar Tipi Banyo & Duş Bataryası — Klasik Çift Kollu Banyo Bataryası tarzında 1:1 metrik (22×15×16 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-sim-fixture-faucet-singlelever-a01",
    "slug": "banyo-sim-fixture-faucet-singlelever-a01",
    "name": "Tek Kollu Modern Mimari Lavabo Bataryası (27k Tri)",
    "brandStyle": "Artema / Grohe Modern Batarya",
    "subCategory": "Duş Seti & Batarya",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 6,
      "depth": 17,
      "height": 19
    },
    "poly": 26784,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/fixture_faucet_singleLever_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/fixture_faucet_singleLever_a01",
    "provider": "hf",
    "license": "CC-BY-4.0 · NVIDIA SimReady",
    "keywords": [
      "lavabo bataryası",
      "musluk",
      "musluk seti",
      "banyo musluğu",
      "tek kollu batarya",
      "batarya"
    ],
    "surfaceType": "Mat Siyah / PVD Metal",
    "summary": "Tek Kollu Modern Mimari Lavabo Bataryası (27k Tri) — yüksek poligonlu (27k tri) stüdyo taranmış PBR 3D banyo modeli. 1:1 metrik ölçü (6×17×19 cm) ve Blender uyumlu."
  },
  {
    "id": "bath-sim-fauset-bathroom-a01",
    "slug": "banyo-sim-fauset-bathroom-a01",
    "name": "Yüksek Detaylı Klasik Banyo Lavabo Bataryası (82k Tri)",
    "brandStyle": "Klasik Villa Lavabo Bataryası",
    "subCategory": "Duş Seti & Batarya",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 18,
      "depth": 16,
      "height": 15
    },
    "poly": 81952,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/fauset_bathroom_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/fauset_bathroom_a01",
    "provider": "hf",
    "license": "CC-BY-4.0 · NVIDIA SimReady",
    "keywords": [
      "lavabo bataryası",
      "musluk",
      "banyo bataryası",
      "musluk seti"
    ],
    "surfaceType": "Parlak Krom Pirinç",
    "summary": "Yüksek Detaylı Klasik Banyo Lavabo Bataryası (82k Tri) — yüksek poligonlu (82k tri) stüdyo taranmış PBR 3D banyo modeli. 1:1 metrik ölçü (18×16×15 cm) ve Blender uyumlu."
  },
  {
    "id": "bath-uc-ds-r229-01",
    "slug": "banyo-ds-r229-01",
    "name": "Tek Kollu Kısa Gövde Krom Lavabo Bataryası",
    "brandStyle": "ECA / Artema Standart Seri",
    "subCategory": "Duş Seti & Batarya",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 6,
      "depth": 15,
      "height": 16
    },
    "poly": 9266,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r229_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r229_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "lavabo bataryası",
      "krom musluk",
      "banyo musluğu",
      "batarya",
      "musluk seti"
    ],
    "surfaceType": "Parlak Krom",
    "summary": "Tek Kollu Kısa Gövde Krom Lavabo Bataryası — ECA / Artema Standart Seri tarzında 1:1 metrik (6×15×16 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r229-02",
    "slug": "banyo-ds-r229-02",
    "name": "Yüksek Kuğu Boyunlu Çanak Lavabo Bataryası",
    "brandStyle": "Çanak Lavabo Yüksek Batarya",
    "subCategory": "Duş Seti & Batarya",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 6,
      "depth": 18,
      "height": 28
    },
    "poly": 7132,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r229_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r229_02",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "çanak lavabo bataryası",
      "yüksek lavabo bataryası",
      "kuğu batarya",
      "musluk",
      "batarya"
    ],
    "surfaceType": "Parlak Krom",
    "summary": "Yüksek Kuğu Boyunlu Çanak Lavabo Bataryası — Çanak Lavabo Yüksek Batarya tarzında 1:1 metrik (6×18×28 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r229-04",
    "slug": "banyo-ds-r229-04",
    "name": "Şelale Ağızlı Modern Banyo Lavabo Bataryası",
    "brandStyle": "Şelale Tasarım Lavabo Musluğu",
    "subCategory": "Duş Seti & Batarya",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 8,
      "depth": 17,
      "height": 18
    },
    "poly": 25684,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r229_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r229_04",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "şelale batarya",
      "şelale musluk",
      "lavabo bataryası",
      "modern musluk",
      "batarya"
    ],
    "surfaceType": "Parlak Krom + Şelale Oluk",
    "summary": "Şelale Ağızlı Modern Banyo Lavabo Bataryası — Şelale Tasarım Lavabo Musluğu tarzında 1:1 metrik (8×17×18 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r229-05",
    "slug": "banyo-ds-r229-05",
    "name": "Ankastre Duvar Tipi Minimalist Lavabo Bataryası",
    "brandStyle": "Vitra / Hansgrohe Duvar Bataryası",
    "subCategory": "Duş Seti & Batarya",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 20,
      "depth": 21,
      "height": 10,
      "mountHeight": 102
    },
    "poly": 9272,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r229_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r229_05",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "ankastre lavabo bataryası",
      "duvardan musluk",
      "duvar bataryası",
      "batarya",
      "musluk"
    ],
    "surfaceType": "Parlak Krom",
    "summary": "Ankastre Duvar Tipi Minimalist Lavabo Bataryası — Vitra / Hansgrohe Duvar Bataryası tarzında 1:1 metrik (20×21×10 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r229-08",
    "slug": "banyo-ds-r229-08",
    "name": "Fırçalı Gold 3 Parça Lüks Lavabo Bataryası",
    "brandStyle": "Lüks Villa Gold Batarya Seti",
    "subCategory": "Duş Seti & Batarya",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 22,
      "depth": 14,
      "height": 18
    },
    "poly": 9656,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r229_08.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r229_08",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "gold lavabo bataryası",
      "pirinç musluk",
      "altın batarya",
      "3 parça batarya",
      "musluk seti"
    ],
    "surfaceType": "Fırçalı Gold PVD",
    "summary": "Fırçalı Gold 3 Parça Lüks Lavabo Bataryası — Lüks Villa Gold Batarya Seti tarzında 1:1 metrik (22×14×18 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r229-09",
    "slug": "banyo-ds-r229-09",
    "name": "Mat Siyah Yandan Kollu Silindirik Lavabo Bataryası",
    "brandStyle": "Trendyol / Artema Mat Siyah",
    "subCategory": "Duş Seti & Batarya",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 7,
      "depth": 14,
      "height": 16
    },
    "poly": 27514,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r229_09.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r229_09",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "mat siyah musluk",
      "siyah lavabo bataryası",
      "lavabo bataryası",
      "musluk",
      "batarya"
    ],
    "surfaceType": "Mat Siyah Paslanmaz",
    "summary": "Mat Siyah Yandan Kollu Silindirik Lavabo Bataryası — Trendyol / Artema Mat Siyah tarzında 1:1 metrik (7×14×16 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r229-03",
    "slug": "banyo-ds-r229-03",
    "name": "İki Kollu Modern Banyo Lavabo Bataryası",
    "brandStyle": "Çift Kollu Klasik Lavabo Musluğu",
    "subCategory": "Duş Seti & Batarya",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 20,
      "depth": 15,
      "height": 15
    },
    "poly": 12400,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r229_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r229_03",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "çift kollu musluk",
      "lavabo bataryası",
      "banyo musluğu",
      "batarya"
    ],
    "surfaceType": "Parlak Krom",
    "summary": "İki Kollu Modern Banyo Lavabo Bataryası — Çift Kollu Klasik Lavabo Musluğu tarzında 1:1 metrik (20×15×15 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r229-06",
    "slug": "banyo-ds-r229-06",
    "name": "Sensörlü / Fotoselli Minimalist Lavabo Bataryası",
    "brandStyle": "ECA / Vitra Fotoselli Musluk",
    "subCategory": "Duş Seti & Batarya",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 6,
      "depth": 14,
      "height": 14
    },
    "poly": 21536,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r229_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r229_06",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "fotoselli musluk",
      "sensörlü batarya",
      "lavabo bataryası",
      "otel musluğu"
    ],
    "surfaceType": "Parlak Krom",
    "summary": "Sensörlü / Fotoselli Minimalist Lavabo Bataryası — ECA / Vitra Fotoselli Musluk tarzında 1:1 metrik (6×14×14 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r229-07",
    "slug": "banyo-ds-r229-07",
    "name": "Haç Volanlı Klasik Krom Lavabo Bataryası",
    "brandStyle": "Retro Banyo Bataryası",
    "subCategory": "Duş Seti & Batarya",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 16,
      "depth": 12,
      "height": 10
    },
    "poly": 18002,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r229_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r229_07",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "retro musluk",
      "klasik lavabo bataryası",
      "batarya"
    ],
    "surfaceType": "Parlak Krom",
    "summary": "Haç Volanlı Klasik Krom Lavabo Bataryası — Retro Banyo Bataryası tarzında 1:1 metrik (16×12×10 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-abo-b07s6xkt5x",
    "slug": "banyo-abo-b07s6xkt5x",
    "name": "Beyaz & Doğal Meşe 60 cm Banyo Lavabo Alt Dolabı",
    "brandStyle": "Modern İskandinav Banyo Dolabı",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "vanity",
    "dims": {
      "width": 60,
      "depth": 40,
      "height": 53
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/b3/b316d04b.jpg",
    "gltfUrl": "/api/v1/abo/glb/X/B07S6XKT5X.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "banyo dolabı",
      "lavabo dolabı",
      "60 cm banyo dolabı",
      "meşe banyo dolabı",
      "beyaz banyo dolabı"
    ],
    "surfaceType": "Mat Beyaz Lake + Doğal Meşe",
    "summary": "Beyaz & Doğal Meşe 60 cm Banyo Lavabo Alt Dolabı — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (60×40×53 cm)."
  },
  {
    "id": "bath-abo-b07rmjpjm6",
    "slug": "banyo-abo-b07rmjpjm6",
    "name": "Duvara Asma 2 Kapaklı 4 Raflı Banyo Duvar Dolabı",
    "brandStyle": "Asma Banyo Üst Dolabı",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "wall-mounted",
    "palette": "vanity",
    "dims": {
      "width": 60,
      "depth": 22,
      "height": 70,
      "mountHeight": 135
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/d5/d5e26e16.jpg",
    "gltfUrl": "/api/v1/abo/glb/6/B07RMJPJM6.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "banyo duvar dolabı",
      "asma banyo dolabı",
      "banyo dolabı",
      "ecza dolabı"
    ],
    "surfaceType": "Mat Beyaz MDF Lam",
    "summary": "Duvara Asma 2 Kapaklı 4 Raflı Banyo Duvar Dolabı — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (60×22×70 cm)."
  },
  {
    "id": "bath-abo-b07s4cdhrd",
    "slug": "banyo-abo-b07s4cdhrd",
    "name": "2 Kapaklı 2 Çekmeceli Banyo Depolama Dolabı (60×82)",
    "brandStyle": "Modern Banyo Yan Dolabı",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "vanity",
    "dims": {
      "width": 60,
      "depth": 30,
      "height": 82
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/53/532de495.jpg",
    "gltfUrl": "/api/v1/abo/glb/D/B07S4CDHRD.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "banyo yan dolabı",
      "çekmeceli banyo dolabı",
      "banyo dolabı",
      "havlu dolabı"
    ],
    "surfaceType": "Beyaz Lake + Ahşap Tabla",
    "summary": "2 Kapaklı 2 Çekmeceli Banyo Depolama Dolabı (60×82) — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (60×30×82 cm)."
  },
  {
    "id": "bath-uc-ds-r230-01",
    "slug": "banyo-ds-r230-01",
    "name": "Tek Lavabolu Doğal Ceviz Banyo Dolabı",
    "brandStyle": "Vitra / Orka Banyo Dolabı",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "vanity",
    "dims": {
      "width": 80,
      "depth": 48,
      "height": 85
    },
    "poly": 3064,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r230_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r230_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "banyo dolabı",
      "lavabolu banyo dolabı",
      "80 cm banyo dolabı",
      "ceviz banyo dolabı",
      "hilton lavabo"
    ],
    "surfaceType": "Amerikan Ceviz + Seramik Lavabo",
    "summary": "Tek Lavabolu Doğal Ceviz Banyo Dolabı — Vitra / Orka Banyo Dolabı tarzında 1:1 metrik (80×48×85 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r230-02",
    "slug": "banyo-ds-r230-02",
    "name": "Çift Lavabolu 150 cm Villa Ebeveyn Banyo Dolabı",
    "brandStyle": "Lüks Villa Çift Lavabolu Hilton",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "vanity",
    "dims": {
      "width": 150,
      "depth": 50,
      "height": 85
    },
    "poly": 45468,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r230_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r230_02",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "çift lavabolu banyo dolabı",
      "hilton banyo dolabı",
      "banyo dolabı",
      "villa banyo dolabı",
      "ebeveyn banyosu"
    ],
    "surfaceType": "Ahşap Kaplama + Çift Seramik Lavabo",
    "summary": "Çift Lavabolu 150 cm Villa Ebeveyn Banyo Dolabı — Lüks Villa Çift Lavabolu Hilton tarzında 1:1 metrik (150×50×85 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r230-03",
    "slug": "banyo-ds-r230-03",
    "name": "Duvara Asma Yüzer Modern Banyo Dolabı (90 cm)",
    "brandStyle": "Orka / Kale Asma Banyo Dolabı",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "wall-mounted",
    "palette": "vanity",
    "dims": {
      "width": 90,
      "depth": 46,
      "height": 55,
      "mountHeight": 30
    },
    "poly": 2544,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r230_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r230_03",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "asma banyo dolabı",
      "yüzer banyo dolabı",
      "banyo dolabı",
      "modern banyo dolabı"
    ],
    "surfaceType": "Mat Lake + Entegre Lavabo",
    "summary": "Duvara Asma Yüzer Modern Banyo Dolabı (90 cm) — Orka / Kale Asma Banyo Dolabı tarzında 1:1 metrik (90×46×55 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r230-05",
    "slug": "banyo-ds-r230-05",
    "name": "3 Çekmeceli Modern Lavabolu Banyo Dolabı (100 cm)",
    "brandStyle": "Orka / Vitra 100 cm Seri",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "vanity",
    "dims": {
      "width": 100,
      "depth": 48,
      "height": 84
    },
    "poly": 5992,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r230_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r230_05",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "çekmeceli banyo dolabı",
      "100 cm banyo dolabı",
      "banyo dolabı",
      "hilton banyo"
    ],
    "surfaceType": "Lake MDF + Seramik Lavabo",
    "summary": "3 Çekmeceli Modern Lavabolu Banyo Dolabı (100 cm) — Orka / Vitra 100 cm Seri tarzında 1:1 metrik (100×48×84 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r230-06",
    "slug": "banyo-ds-r230-06",
    "name": "Altı Açık Havlu Raflı Spa Banyo Dolabı",
    "brandStyle": "Otel & Spa Açık Raflı Tezgah",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "vanity",
    "dims": {
      "width": 85,
      "depth": 48,
      "height": 84
    },
    "poly": 6074,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r230_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r230_06",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "açık raflı banyo dolabı",
      "spa banyo tezgahı",
      "banyo dolabı",
      "lavabo tezgahı"
    ],
    "surfaceType": "Doğal Ahşap + Seramik Lavabo",
    "summary": "Altı Açık Havlu Raflı Spa Banyo Dolabı — Otel & Spa Açık Raflı Tezgah tarzında 1:1 metrik (85×48×84 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r230-07",
    "slug": "banyo-ds-r230-07",
    "name": "Mermer Tezgahlı Klasik Beyaz Banyo Dolabı (100 cm)",
    "brandStyle": "Neoklasik Villa Hilton Dolabı",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "vanity",
    "dims": {
      "width": 100,
      "depth": 55,
      "height": 86
    },
    "poly": 6438,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r230_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r230_07",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "mermer tezgahlı banyo dolabı",
      "klasik banyo dolabı",
      "banyo dolabı",
      "hilton lavabo"
    ],
    "surfaceType": "Beyaz Lake + Damarlı Mermer Tezgah",
    "summary": "Mermer Tezgahlı Klasik Beyaz Banyo Dolabı (100 cm) — Neoklasik Villa Hilton Dolabı tarzında 1:1 metrik (100×55×86 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r230-08",
    "slug": "banyo-ds-r230-08",
    "name": "45 cm Dar Misafir WC Banyo Dolabı",
    "brandStyle": "Küçük WC Kompakt Lavabo Dolabı",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "vanity",
    "dims": {
      "width": 45,
      "depth": 35,
      "height": 85
    },
    "poly": 18174,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r230_08.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r230_08",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "küçük banyo dolabı",
      "45 cm banyo dolabı",
      "misafir wc dolabı",
      "dar banyo dolabı",
      "banyo dolabı"
    ],
    "surfaceType": "Açık Gri Laminat + Seramik Lavabo",
    "summary": "45 cm Dar Misafir WC Banyo Dolabı — Küçük WC Kompakt Lavabo Dolabı tarzında 1:1 metrik (45×35×85 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r230-10",
    "slug": "banyo-ds-r230-10",
    "name": "120 cm Çift Çekmeceli Asma Modern Banyo Dolabı",
    "brandStyle": "Lüks 120 cm Asma Hilton",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "wall-mounted",
    "palette": "vanity",
    "dims": {
      "width": 120,
      "depth": 46,
      "height": 55,
      "mountHeight": 30
    },
    "poly": 8784,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r230_10.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r230_10",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "120 cm banyo dolabı",
      "asma banyo dolabı",
      "banyo dolabı",
      "modern banyo"
    ],
    "surfaceType": "Mat Lake + Solid Surface Tezgah",
    "summary": "120 cm Çift Çekmeceli Asma Modern Banyo Dolabı — Lüks 120 cm Asma Hilton tarzında 1:1 metrik (120×46×55 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r230-04",
    "slug": "banyo-ds-r230-04",
    "name": "Köşe Tipi Kompakt Lavabolu Banyo Dolabı",
    "brandStyle": "Dar Alan Köşe Banyo Dolabı",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "vanity",
    "dims": {
      "width": 62,
      "depth": 62,
      "height": 84
    },
    "poly": 6708,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r230_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r230_04",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "köşe banyo dolabı",
      "küçük banyo dolabı",
      "banyo dolabı"
    ],
    "surfaceType": "Lake + Köşe Seramik Lavabo",
    "summary": "Köşe Tipi Kompakt Lavabolu Banyo Dolabı — Dar Alan Köşe Banyo Dolabı tarzında 1:1 metrik (62×62×84 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r231-01",
    "slug": "banyo-ds-r231-01",
    "name": "Tek Kapaklı Aynalı Banyo Üst & Ecza Dolabı",
    "brandStyle": "Aynalı Banyo Üst Dolabı",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "wall-mounted",
    "palette": "vanity",
    "dims": {
      "width": 45,
      "depth": 15,
      "height": 65,
      "mountHeight": 135
    },
    "poly": 1460,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r231_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r231_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "aynalı banyo dolabı",
      "ecza dolabı",
      "banyo üst dolabı",
      "banyo dolabı"
    ],
    "surfaceType": "Lake Gövde + Flotal Ayna",
    "summary": "Tek Kapaklı Aynalı Banyo Üst & Ecza Dolabı — Aynalı Banyo Üst Dolabı tarzında 1:1 metrik (45×15×65 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r231-02",
    "slug": "banyo-ds-r231-02",
    "name": "Çift Kapaklı Aynalı Banyo Üst Dolabı (70 cm)",
    "brandStyle": "Orka / Vitra Aynalı Üst Dolap",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "wall-mounted",
    "palette": "vanity",
    "dims": {
      "width": 70,
      "depth": 16,
      "height": 68,
      "mountHeight": 135
    },
    "poly": 2800,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r231_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r231_02",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "aynalı banyo dolabı",
      "çift kapaklı banyo dolabı",
      "banyo dolabı"
    ],
    "surfaceType": "Beyaz Lake + Çift Ayna Kapak",
    "summary": "Çift Kapaklı Aynalı Banyo Üst Dolabı (70 cm) — Orka / Vitra Aynalı Üst Dolap tarzında 1:1 metrik (70×16×68 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r231-04",
    "slug": "banyo-ds-r231-04",
    "name": "Ahşap Çerçeveli Aynalı Banyo Duvar Dolabı",
    "brandStyle": "Doğal Meşe Aynalı Dolap",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "wall-mounted",
    "palette": "vanity",
    "dims": {
      "width": 60,
      "depth": 16,
      "height": 66,
      "mountHeight": 135
    },
    "poly": 1996,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r231_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r231_04",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "ahşap banyo dolabı",
      "aynalı dolap",
      "banyo dolabı"
    ],
    "surfaceType": "Doğal Meşe + Ayna",
    "summary": "Ahşap Çerçeveli Aynalı Banyo Duvar Dolabı — Doğal Meşe Aynalı Dolap tarzında 1:1 metrik (60×16×66 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r231-06",
    "slug": "banyo-ds-r231-06",
    "name": "İnce Uzun Banyo Boy Dolabı (35×165 cm)",
    "brandStyle": "Banyo Boy Dolabı / Havlu Dolabı",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "vanity",
    "dims": {
      "width": 35,
      "depth": 32,
      "height": 165
    },
    "poly": 800,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r231_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r231_06",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "banyo boy dolabı",
      "uzun banyo dolabı",
      "dar banyo dolabı",
      "banyo dolabı"
    ],
    "surfaceType": "Mat Lake MDF",
    "summary": "İnce Uzun Banyo Boy Dolabı (35×165 cm) — Banyo Boy Dolabı / Havlu Dolabı tarzında 1:1 metrik (35×32×165 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r231-07",
    "slug": "banyo-ds-r231-07",
    "name": "3 Kapaklı Panoramik Aynalı Banyo Üst Dolabı (75 cm)",
    "brandStyle": "Üçlü Aynalı Banyo Üst Dolabı",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "wall-mounted",
    "palette": "vanity",
    "dims": {
      "width": 75,
      "depth": 65,
      "height": 13,
      "mountHeight": 135
    },
    "poly": 1812,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r231_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r231_07",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "üçlü aynalı dolap",
      "aynalı banyo dolabı",
      "banyo dolabı"
    ],
    "surfaceType": "Beyaz Çelik + 3 Ayna Kapak",
    "summary": "3 Kapaklı Panoramik Aynalı Banyo Üst Dolabı (75 cm) — Üçlü Aynalı Banyo Üst Dolabı tarzında 1:1 metrik (75×65×13 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r231-09",
    "slug": "banyo-ds-r231-09",
    "name": "Yuvarlak Pirinç Çerçeveli Aynalı Duvar Dolabı (Ø50)",
    "brandStyle": "Yuvarlak Pirinç Aynalı Dolap",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "wall-mounted",
    "palette": "vanity",
    "dims": {
      "width": 50,
      "depth": 14,
      "height": 50,
      "mountHeight": 140
    },
    "poly": 5312,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r231_09.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r231_09",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "yuvarlak aynalı dolap",
      "pirinç banyo dolabı",
      "banyo aynası",
      "banyo dolabı"
    ],
    "surfaceType": "Fırçalı Pirinç + Yuvarlak Ayna",
    "summary": "Yuvarlak Pirinç Çerçeveli Aynalı Duvar Dolabı (Ø50) — Yuvarlak Pirinç Aynalı Dolap tarzında 1:1 metrik (50×14×50 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r782-02",
    "slug": "banyo-ds-r782-02",
    "name": "Bambu 3 Raflı Klozet Üstü Banyo Düzenleyici",
    "brandStyle": "Trendyol Klozet Üstü Raf",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "vanity",
    "dims": {
      "width": 65,
      "depth": 23,
      "height": 165
    },
    "poly": 11368,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r782_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r782_02",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "klozet üstü raf",
      "klozet üstü dolap",
      "banyo rafı",
      "bambu banyo rafı"
    ],
    "surfaceType": "Doğal Bambu Ahşap",
    "summary": "Bambu 3 Raflı Klozet Üstü Banyo Düzenleyici — Trendyol Klozet Üstü Raf tarzında 1:1 metrik (65×23×165 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r782-04",
    "slug": "banyo-ds-r782-04",
    "name": "Kapaklı Beyaz MDF Klozet Üstü Banyo Dolabı",
    "brandStyle": "Klozet Üstü Kapaklı Dolap",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "vanity",
    "dims": {
      "width": 58,
      "depth": 26,
      "height": 160
    },
    "poly": 88910,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r782_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r782_04",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "klozet üstü dolap",
      "klozet üstü banyo dolabı",
      "banyo dolabı"
    ],
    "surfaceType": "Mat Beyaz MDF",
    "summary": "Kapaklı Beyaz MDF Klozet Üstü Banyo Dolabı — Klozet Üstü Kapaklı Dolap tarzında 1:1 metrik (58×26×160 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-sim-sanitary-sink-wallmounted-a01",
    "slug": "banyo-sim-sanitary-sink-wallmounted-a01",
    "name": "Duvara Asma Modern Seramik Banyo Lavabosu",
    "brandStyle": "Vitra / Kale Asma Lavabo",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "wall-mounted",
    "palette": "ceramic",
    "dims": {
      "width": 58,
      "depth": 46,
      "height": 22,
      "mountHeight": 82
    },
    "poly": 29030,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/sanitary_sink_wallMounted_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/sanitary_sink_wallMounted_a01",
    "provider": "hf",
    "license": "CC-BY-4.0 · NVIDIA SimReady",
    "keywords": [
      "lavabo",
      "asma lavabo",
      "banyo lavabosu",
      "seramik lavabo",
      "vitrifiye"
    ],
    "surfaceType": "Parlak Vitrifiye Porselen",
    "summary": "Duvara Asma Modern Seramik Banyo Lavabosu — yüksek poligonlu (29k tri) stüdyo taranmış PBR 3D banyo modeli. 1:1 metrik ölçü (58×46×22 cm) ve Blender uyumlu."
  },
  {
    "id": "bath-sim-washbasin-a01",
    "slug": "banyo-sim-washbasin-a01",
    "name": "Modern Dikdörtgen Tezgah Üstü Banyo Lavabosu",
    "brandStyle": "Tezgah Üstü Seramik Lavabo",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 60,
      "depth": 45,
      "height": 18
    },
    "poly": 22602,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/washBasin_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/washBasin_a01",
    "provider": "hf",
    "license": "CC-BY-4.0 · NVIDIA SimReady",
    "keywords": [
      "lavabo",
      "tezgah üstü lavabo",
      "çanak lavabo",
      "banyo lavabosu"
    ],
    "surfaceType": "Parlak Porselen",
    "summary": "Modern Dikdörtgen Tezgah Üstü Banyo Lavabosu — yüksek poligonlu (23k tri) stüdyo taranmış PBR 3D banyo modeli. 1:1 metrik ölçü (60×45×18 cm) ve Blender uyumlu."
  },
  {
    "id": "bath-sim-washbasin-long-a01",
    "slug": "banyo-sim-washbasin-long-a01",
    "name": "120 cm Çift Bataryalı Uzun Villa Banyo Lavabosu",
    "brandStyle": "Otel & Villa Uzun Tekne Lavabo",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "wall-mounted",
    "palette": "ceramic",
    "dims": {
      "width": 120,
      "depth": 48,
      "height": 18,
      "mountHeight": 82
    },
    "poly": 27900,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/washBasin_long_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/washBasin_long_a01",
    "provider": "hf",
    "license": "CC-BY-4.0 · NVIDIA SimReady",
    "keywords": [
      "uzun lavabo",
      "çift kişilik lavabo",
      "tekne lavabo",
      "lavabo",
      "banyo lavabosu"
    ],
    "surfaceType": "Parlak Vitrifiye Seramik",
    "summary": "120 cm Çift Bataryalı Uzun Villa Banyo Lavabosu — yüksek poligonlu (28k tri) stüdyo taranmış PBR 3D banyo modeli. 1:1 metrik ölçü (120×48×18 cm) ve Blender uyumlu."
  },
  {
    "id": "bath-obj-washbasin-06292c9f",
    "slug": "banyo-obj-washbasin-06292c9f",
    "name": "Oval İnce Kenarlı Çanak Banyo Lavabosu",
    "brandStyle": "Bocchi / Vitra Çanak Lavabo",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 52,
      "depth": 38,
      "height": 15
    },
    "poly": 18500,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/washbasin-06292c9f.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/washbasin-06292c9f",
    "provider": "hf",
    "license": "CC-BY-4.0 · Objaverse Studio",
    "keywords": [
      "çanak lavabo",
      "oval lavabo",
      "tezgah üstü lavabo",
      "lavabo"
    ],
    "surfaceType": "Sırlı Beyaz Seramik",
    "summary": "Oval İnce Kenarlı Çanak Banyo Lavabosu — gerçekçi PBR dokulu hazır banyo 3D modeli (52×38×15 cm). Blender Cycles ve iç mekan görselleştirmeleri için hazır."
  },
  {
    "id": "bath-uc-ds-r208-01",
    "slug": "banyo-ds-r208-01",
    "name": "Yuvarlak İnce Kenarlı Seramik Çanak Lavabo",
    "brandStyle": "Vitra / Creavit Çanak Lavabo",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 42,
      "depth": 42,
      "height": 15
    },
    "poly": 379584,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r208_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r208_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "çanak lavabo",
      "yuvarlak lavabo",
      "tezgah üstü lavabo",
      "lavabo"
    ],
    "surfaceType": "Parlak Porselen",
    "summary": "Yuvarlak İnce Kenarlı Seramik Çanak Lavabo — Vitra / Creavit Çanak Lavabo tarzında 1:1 metrik (42×42×15 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r208-03",
    "slug": "banyo-ds-r208-03",
    "name": "Dikdörtgen Modern Seramik Tezgah Üstü Lavabo",
    "brandStyle": "Kale / Bien Çanak Lavabo",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 56,
      "depth": 40,
      "height": 14
    },
    "poly": 28418,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r208_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r208_03",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "dikdörtgen lavabo",
      "çanak lavabo",
      "tezgah üstü lavabo",
      "lavabo"
    ],
    "surfaceType": "Parlak Porselen",
    "summary": "Dikdörtgen Modern Seramik Tezgah Üstü Lavabo — Kale / Bien Çanak Lavabo tarzında 1:1 metrik (56×40×14 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r208-05",
    "slug": "banyo-ds-r208-05",
    "name": "Tezgah Altı Oval Gömme Seramik Lavabo",
    "brandStyle": "Mermer Tezgah Altı Lavabo",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 50,
      "depth": 38,
      "height": 19
    },
    "poly": 145454,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r208_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r208_05",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "tezgah altı lavabo",
      "gömme lavabo",
      "oval lavabo",
      "lavabo"
    ],
    "surfaceType": "Parlak Porselen",
    "summary": "Tezgah Altı Oval Gömme Seramik Lavabo — Mermer Tezgah Altı Lavabo tarzında 1:1 metrik (50×38×19 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r208-10",
    "slug": "banyo-ds-r208-10",
    "name": "Kare Temperli Cam Çanak Banyo Lavabosu (38×38)",
    "brandStyle": "Cam Çanak Lavabo",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "shower",
    "dims": {
      "width": 38,
      "depth": 38,
      "height": 14
    },
    "poly": 36792,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r208_10.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r208_10",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "cam lavabo",
      "çanak lavabo",
      "kare lavabo",
      "lavabo"
    ],
    "surfaceType": "Temperli Renkli Cam",
    "summary": "Kare Temperli Cam Çanak Banyo Lavabosu (38×38) — Cam Çanak Lavabo tarzında 1:1 metrik (38×38×14 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r780-01",
    "slug": "banyo-ds-r780-01",
    "name": "Ayaklı Klasik Seramik Banyo Lavabosu",
    "brandStyle": "Vitra / Serel Ayaklı Lavabo",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 60,
      "depth": 48,
      "height": 86
    },
    "poly": 32090,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r780_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r780_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "ayaklı lavabo",
      "seramik lavabo",
      "lavabo",
      "banyo lavabosu"
    ],
    "surfaceType": "Parlak Beyaz Porselen",
    "summary": "Ayaklı Klasik Seramik Banyo Lavabosu — Vitra / Serel Ayaklı Lavabo tarzında 1:1 metrik (60×48×86 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r780-03",
    "slug": "banyo-ds-r780-03",
    "name": "Minimalist Monoblok Silindirik Sütun Lavabo",
    "brandStyle": "Lüks Villa Monoblok Ayaklı Lavabo",
    "subCategory": "Banyo Dolabı & Lavabo",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 66,
      "depth": 52,
      "height": 88
    },
    "poly": 142142,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r780_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r780_03",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "sütun lavabo",
      "monoblok lavabo",
      "ayaklı lavabo",
      "lavabo"
    ],
    "surfaceType": "Mat / Parlak Porselen",
    "summary": "Minimalist Monoblok Silindirik Sütun Lavabo — Lüks Villa Monoblok Ayaklı Lavabo tarzında 1:1 metrik (66×52×88 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r781-03",
    "slug": "banyo-ds-r781-03",
    "name": "Mat Siyah 60×120 Yassı Panel Havlupan Radyatör",
    "brandStyle": "Hammam / Carisa Mat Siyah Havlupan",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 60,
      "depth": 12,
      "height": 120,
      "mountHeight": 75
    },
    "poly": 3056,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r781_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r781_03",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "havlupan",
      "siyah havlupan",
      "banyo radyatörü",
      "havluluk",
      "petek",
      "ısıtıcı"
    ],
    "surfaceType": "Mat Siyah Elektrostatik Çelik",
    "summary": "Mat Siyah 60×120 Yassı Panel Havlupan Radyatör — Hammam / Carisa Mat Siyah Havlupan tarzında 1:1 metrik (60×12×120 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r781-01",
    "slug": "banyo-ds-r781-01",
    "name": "Parlak Krom Merdiven Tipi Banyo Havlupan Radyatör",
    "brandStyle": "ECA / Demirdöküm Krom Havlupan",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 50,
      "depth": 10,
      "height": 80,
      "mountHeight": 75
    },
    "poly": 6456,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r781_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r781_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "havlupan",
      "krom havlupan",
      "merdiven havlupan",
      "banyo radyatörü",
      "havluluk"
    ],
    "surfaceType": "Parlak Krom Kaplama Çelik",
    "summary": "Parlak Krom Merdiven Tipi Banyo Havlupan Radyatör — ECA / Demirdöküm Krom Havlupan tarzında 1:1 metrik (50×10×80 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r781-02",
    "slug": "banyo-ds-r781-02",
    "name": "Ayaklı Fırçalı Çelik Elektrikli Havlupan Standı",
    "brandStyle": "Elektrikli Ayaklı Havlupan",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 55,
      "depth": 35,
      "height": 95
    },
    "poly": 14144,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r781_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r781_02",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "elektrikli havlupan",
      "ayaklı havlupan",
      "havlupan",
      "havluluk"
    ],
    "surfaceType": "Fırçalı Paslanmaz Çelik",
    "summary": "Ayaklı Fırçalı Çelik Elektrikli Havlupan Standı — Elektrikli Ayaklı Havlupan tarzında 1:1 metrik (55×35×95 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r781-04",
    "slug": "banyo-ds-r781-04",
    "name": "Kompakt Beyaz 40×60 Küçük Banyo Havlupanı",
    "brandStyle": "Kompakt Beyaz Havlupan",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 40,
      "depth": 10,
      "height": 60,
      "mountHeight": 95
    },
    "poly": 20182,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r781_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r781_04",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "beyaz havlupan",
      "küçük havlupan",
      "havlupan",
      "banyo radyatörü"
    ],
    "surfaceType": "Parlak Beyaz Elektrostatik Çelik",
    "summary": "Kompakt Beyaz 40×60 Küçük Banyo Havlupanı — Kompakt Beyaz Havlupan tarzında 1:1 metrik (40×10×60 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r781-05",
    "slug": "banyo-ds-r781-05",
    "name": "Antik Pirinç / Gold Lüks Villa Havlupan Radyatör",
    "brandStyle": "Hammam Gold / Pirinç Havlupan",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 65,
      "depth": 14,
      "height": 95,
      "mountHeight": 75
    },
    "poly": 19352,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r781_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r781_05",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "gold havlupan",
      "pirinç havlupan",
      "havlupan",
      "banyo radyatörü"
    ],
    "surfaceType": "Fırçalı Pirinç / Gold",
    "summary": "Antik Pirinç / Gold Lüks Villa Havlupan Radyatör — Hammam Gold / Pirinç Havlupan tarzında 1:1 metrik (65×14×95 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r781-06",
    "slug": "banyo-ds-r781-06",
    "name": "Asimetrik Modern Tasarım Banyo Havlupanı",
    "brandStyle": "Mimari Tasarım Havlupan",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 70,
      "depth": 40,
      "height": 85,
      "mountHeight": 70
    },
    "poly": 9976,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r781_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r781_06",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "tasarım havlupan",
      "modern havlupan",
      "havlupan",
      "radyatör"
    ],
    "surfaceType": "Antrasit / Çelik",
    "summary": "Asimetrik Modern Tasarım Banyo Havlupanı — Mimari Tasarım Havlupan tarzında 1:1 metrik (70×40×85 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r209-01",
    "slug": "banyo-ds-r209-01",
    "name": "Tekli Parlak Krom Duvar Havlu Askılığı (60 cm)",
    "brandStyle": "Artema / Tema Krom Havluluk",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 60,
      "depth": 8,
      "height": 6,
      "mountHeight": 115
    },
    "poly": 4352,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r209_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r209_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "havlu askılığı",
      "havluluk",
      "krom havluluk",
      "duvar havluluğu",
      "banyo havlu askısı"
    ],
    "surfaceType": "Parlak Krom 304 Paslanmaz",
    "summary": "Tekli Parlak Krom Duvar Havlu Askılığı (60 cm) — Artema / Tema Krom Havluluk tarzında 1:1 metrik (60×8×6 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r209-02",
    "slug": "banyo-ds-r209-02",
    "name": "Çift Barlı Paslanmaz Çelik Banyo Havlu Askılığı",
    "brandStyle": "Çiftli Banyo Havlu Askılığı",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 62,
      "depth": 13,
      "height": 8,
      "mountHeight": 115
    },
    "poly": 9080,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r209_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r209_02",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "çiftli havlu askılığı",
      "havlu askılığı",
      "havluluk",
      "ikili havluluk"
    ],
    "surfaceType": "Parlak Krom / 304 Çelik",
    "summary": "Çift Barlı Paslanmaz Çelik Banyo Havlu Askılığı — Çiftli Banyo Havlu Askılığı tarzında 1:1 metrik (62×13×8 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r209-03",
    "slug": "banyo-ds-r209-03",
    "name": "Mat Siyah Kısa El Havlusu Askılığı (35 cm)",
    "brandStyle": "Trendyol Mat Siyah El Havluluğu",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 35,
      "depth": 8,
      "height": 6,
      "mountHeight": 105
    },
    "poly": 1188,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r209_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r209_03",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "siyah havlu askılığı",
      "el havlusu askısı",
      "havlu askılığı",
      "havluluk",
      "mat siyah havluluk"
    ],
    "surfaceType": "Mat Siyah 304 Paslanmaz",
    "summary": "Mat Siyah Kısa El Havlusu Askılığı (35 cm) — Trendyol Mat Siyah El Havluluğu tarzında 1:1 metrik (35×8×6 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r209-04",
    "slug": "banyo-ds-r209-04",
    "name": "Uzun Fırçalı Pirinç (Gold) Havlu Askı Barı",
    "brandStyle": "Lüks Gold Havlu Askılığı",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 65,
      "depth": 8,
      "height": 6,
      "mountHeight": 115
    },
    "poly": 14664,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r209_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r209_04",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "gold havlu askılığı",
      "pirinç havluluk",
      "havlu askılığı",
      "havluluk"
    ],
    "surfaceType": "Fırçalı Pirinç / Gold",
    "summary": "Uzun Fırçalı Pirinç (Gold) Havlu Askı Barı — Lüks Gold Havlu Askılığı tarzında 1:1 metrik (65×8×6 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r209-05",
    "slug": "banyo-ds-r209-05",
    "name": "Doğal Ahşap & Siyah Çelik Modern Havlu Askılığı",
    "brandStyle": "İskandinav Ahşap Havluluk",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "vanity",
    "dims": {
      "width": 58,
      "depth": 9,
      "height": 8,
      "mountHeight": 115
    },
    "poly": 2348,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r209_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r209_05",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "ahşap havlu askılığı",
      "havlu askılığı",
      "havluluk",
      "modern havluluk"
    ],
    "surfaceType": "Doğal Ahşap + Mat Siyah Metal",
    "summary": "Doğal Ahşap & Siyah Çelik Modern Havlu Askılığı — İskandinav Ahşap Havluluk tarzında 1:1 metrik (58×9×8 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r209-06",
    "slug": "banyo-ds-r209-06",
    "name": "3 Katlı Duvara Yaslamalı Merdiven Havlu Askılığı",
    "brandStyle": "Modern Merdiven Havluluk",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 48,
      "depth": 22,
      "height": 155
    },
    "poly": 6880,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r209_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r209_06",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "merdiven havluluk",
      "ayaklı havlu askılığı",
      "havlu askılığı",
      "havluluk"
    ],
    "surfaceType": "Mat Siyah / Fırçalı Çelik",
    "summary": "3 Katlı Duvara Yaslamalı Merdiven Havlu Askılığı — Modern Merdiven Havluluk tarzında 1:1 metrik (48×22×155 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r209-07",
    "slug": "banyo-ds-r209-07",
    "name": "Yuvarlak Halka Krom El Havlusu Askılığı (Ø18 cm)",
    "brandStyle": "Tema / Artema Halka Havluluk",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 18,
      "depth": 7,
      "height": 21,
      "mountHeight": 105
    },
    "poly": 10012,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r209_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r209_07",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "halka havluluk",
      "yuvarlak havlu askılığı",
      "havlu askılığı",
      "havluluk"
    ],
    "surfaceType": "Parlak Krom Çelik",
    "summary": "Yuvarlak Halka Krom El Havlusu Askılığı (Ø18 cm) — Tema / Artema Halka Havluluk tarzında 1:1 metrik (18×7×21 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r209-08",
    "slug": "banyo-ds-r209-08",
    "name": "Ayaklı 2 Katlı Paslanmaz Banyo Havlu Standı",
    "brandStyle": "Ayaklı İkili Havluluk Standı",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 50,
      "depth": 25,
      "height": 85
    },
    "poly": 9848,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r209_08.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r209_08",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "ayaklı havluluk",
      "havlu standı",
      "havlu askılığı",
      "havluluk"
    ],
    "surfaceType": "Fırçalı Nikel Çelik",
    "summary": "Ayaklı 2 Katlı Paslanmaz Banyo Havlu Standı — Ayaklı İkili Havluluk Standı tarzında 1:1 metrik (50×25×85 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r209-09",
    "slug": "banyo-ds-r209-09",
    "name": "Üstü Temperli Cam Raflı Otel Tipi Havlu Askılığı",
    "brandStyle": "Otel Tipi Raflı Havluluk",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 60,
      "depth": 15,
      "height": 12,
      "mountHeight": 125
    },
    "poly": 11960,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r209_09.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r209_09",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "raflı havluluk",
      "cam raflı havlu askılığı",
      "otel havluluk",
      "havlu askılığı",
      "havluluk"
    ],
    "surfaceType": "Krom Çelik + Buzlu Temperli Cam",
    "summary": "Üstü Temperli Cam Raflı Otel Tipi Havlu Askılığı — Otel Tipi Raflı Havluluk tarzında 1:1 metrik (60×15×12 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r209-10",
    "slug": "banyo-ds-r209-10",
    "name": "Klasik Porselen Rozetli Pirinç Havlu Askılığı",
    "brandStyle": "Vintage Pirinç Havluluk",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 50,
      "depth": 8,
      "height": 7,
      "mountHeight": 115
    },
    "poly": 8152,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r209_10.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r209_10",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "vintage havluluk",
      "pirinç havlu askılığı",
      "havlu askılığı",
      "havluluk"
    ],
    "surfaceType": "Parlak Pirinç + Porselen",
    "summary": "Klasik Porselen Rozetli Pirinç Havlu Askılığı — Vintage Pirinç Havluluk tarzında 1:1 metrik (50×8×7 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-obj-towel-rail-free-agustin-honnun-3a0a70f",
    "slug": "banyo-obj-towel-rail-free-agustin-honnun-3a0a70f",
    "name": "Üzerinde Dokuma Havlulu Duvar Havlu Askılığı",
    "brandStyle": "Gerçekçi Havlulu Duvar Askısı",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 62,
      "depth": 10,
      "height": 55,
      "mountHeight": 115
    },
    "poly": 18500,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/towel-rail-free-agustin-honnun-3a0a70f4.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/towel-rail-free-agustin-honnun-3a0a70f4",
    "provider": "hf",
    "license": "CC-BY-4.0 · Objaverse Studio",
    "keywords": [
      "havlulu havlu askılığı",
      "havlu askılığı",
      "havluluk",
      "banyo havlusu"
    ],
    "surfaceType": "Krom / Beyaz Metal + Dokuma Havlu",
    "summary": "Üzerinde Dokuma Havlulu Duvar Havlu Askılığı — gerçekçi PBR dokulu hazır banyo 3D modeli (62×10×55 cm). Blender Cycles ve iç mekan görselleştirmeleri için hazır."
  },
  {
    "id": "bath-obj-towel-rail-4a6f56c6",
    "slug": "banyo-obj-towel-rail-4a6f56c6",
    "name": "Minimalist Duvar Tipi Krom Havlu Barı",
    "brandStyle": "Modern Krom Havlu Barı",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 60,
      "depth": 8,
      "height": 6,
      "mountHeight": 115
    },
    "poly": 18500,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/towel-rail-4a6f56c6.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/towel-rail-4a6f56c6",
    "provider": "hf",
    "license": "CC-BY-4.0 · Objaverse Studio",
    "keywords": [
      "havlu askılığı",
      "havlu barı",
      "havluluk"
    ],
    "surfaceType": "Parlak Krom",
    "summary": "Minimalist Duvar Tipi Krom Havlu Barı — gerçekçi PBR dokulu hazır banyo 3D modeli (60×8×6 cm). Blender Cycles ve iç mekan görselleştirmeleri için hazır."
  },
  {
    "id": "bath-obj-hook-quadriko-1f73240a",
    "slug": "banyo-obj-hook-quadriko-1f73240a",
    "name": "Kare Formlu Modern Banyo Bornoz & Havlu Askı Kancası",
    "brandStyle": "Bornoz & Havlu Askı Kancası",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 6,
      "depth": 6,
      "height": 6,
      "mountHeight": 155
    },
    "poly": 18500,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/hook-quadriko-1f73240a.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/hook-quadriko-1f73240a",
    "provider": "hf",
    "license": "CC-BY-4.0 · Objaverse Studio",
    "keywords": [
      "bornoz askısı",
      "havlu kancası",
      "banyo askısı",
      "havlu askılığı",
      "havluluk"
    ],
    "surfaceType": "Mat Siyah / Krom Metal",
    "summary": "Kare Formlu Modern Banyo Bornoz & Havlu Askı Kancası — gerçekçi PBR dokulu hazır banyo 3D modeli (6×6×6 cm). Blender Cycles ve iç mekan görselleştirmeleri için hazır."
  },
  {
    "id": "bath-abo-b07b8ny189",
    "slug": "banyo-abo-b07b8ny189",
    "name": "Ceviz & Mat Siyah Modern Banyo Bornoz Askısı",
    "brandStyle": "Doğal Ceviz & Siyah Duvar Askısı",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "vanity",
    "dims": {
      "width": 10,
      "depth": 7,
      "height": 10,
      "mountHeight": 155
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/83/83338d02.jpg",
    "gltfUrl": "/api/v1/abo/glb/9/B07B8NY189.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "bornoz askısı",
      "havlu askılığı",
      "ahşap askı",
      "banyo askısı"
    ],
    "surfaceType": "Amerikan Ceviz + Mat Siyah Metal",
    "summary": "Ceviz & Mat Siyah Modern Banyo Bornoz Askısı — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (10×7×10 cm)."
  },
  {
    "id": "bath-sim-fixture-toiletpaperholder-double-a01",
    "slug": "banyo-sim-fixture-toiletpaperholder-double-a01",
    "name": "Telefon Raflı Çift Rulo Duvar Tuvalet Kağıdı Askısı",
    "brandStyle": "Trendyol Telefon Raflı Çift Kağıtlık",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 32,
      "depth": 12,
      "height": 13,
      "mountHeight": 72
    },
    "poly": 22138,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/fixture_toiletPaperHolder_double_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/fixture_toiletPaperHolder_double_a01",
    "provider": "hf",
    "license": "CC-BY-4.0 · NVIDIA SimReady",
    "keywords": [
      "tuvalet kağıdı askısı",
      "telefon raflı kağıtlık",
      "kağıtlık",
      "wc kağıtlık",
      "çiftli tuvalet kağıtlığı"
    ],
    "surfaceType": "Mat Siyah / Fırçalı Çelik",
    "summary": "Telefon Raflı Çift Rulo Duvar Tuvalet Kağıdı Askısı — yüksek poligonlu (22k tri) stüdyo taranmış PBR 3D banyo modeli. 1:1 metrik ölçü (32×12×13 cm) ve Blender uyumlu."
  },
  {
    "id": "bath-uc-ds-r234-04",
    "slug": "banyo-ds-r234-04",
    "name": "Telefon Raflı Tekli Modern Tuvalet Kağıdı Askısı",
    "brandStyle": "Trendyol / Hepsiburada En Çok Satan",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 18,
      "depth": 11,
      "height": 10,
      "mountHeight": 72
    },
    "poly": 2672,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r234_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r234_04",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "telefon raflı tuvalet kağıtlığı",
      "tuvalet kağıdı askısı",
      "tuvalet kağıtlığı",
      "raflı kağıtlık",
      "wc kağıtlık"
    ],
    "surfaceType": "Mat Siyah / Krom Paslanmaz",
    "summary": "Telefon Raflı Tekli Modern Tuvalet Kağıdı Askısı — Trendyol / Hepsiburada En Çok Satan tarzında 1:1 metrik (18×11×10 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r234-01",
    "slug": "banyo-ds-r234-01",
    "name": "Minimalist Duvara Monte Açık Tuvalet Kağıdı Askısı",
    "brandStyle": "Artema / Tema Açık Kağıtlık",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 16,
      "depth": 9,
      "height": 6,
      "mountHeight": 72
    },
    "poly": 4028,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r234_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r234_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "tuvalet kağıdı askısı",
      "tuvalet kağıtlığı",
      "kağıtlık",
      "krom kağıtlık"
    ],
    "surfaceType": "Parlak Krom Paslanmaz",
    "summary": "Minimalist Duvara Monte Açık Tuvalet Kağıdı Askısı — Artema / Tema Açık Kağıtlık tarzında 1:1 metrik (16×9×6 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r234-02",
    "slug": "banyo-ds-r234-02",
    "name": "Ayaklı Yedek Rulolu Tuvalet Kağıdı Standı",
    "brandStyle": "Ayaklı Yedekli WC Kağıtlık",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 20,
      "depth": 20,
      "height": 62
    },
    "poly": 3456,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r234_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r234_02",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "ayaklı tuvalet kağıtlığı",
      "tuvalet kağıdı standı",
      "tuvalet kağıdı askısı",
      "kağıtlık"
    ],
    "surfaceType": "Fırçalı Paslanmaz Çelik",
    "summary": "Ayaklı Yedek Rulolu Tuvalet Kağıdı Standı — Ayaklı Yedekli WC Kağıtlık tarzında 1:1 metrik (20×20×62 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r234-03",
    "slug": "banyo-ds-r234-03",
    "name": "Kapaklı Paslanmaz Çelik Tuvalet Kağıdı Askısı",
    "brandStyle": "Vitra / ECA Kapaklı Kağıtlık",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 15,
      "depth": 11,
      "height": 14,
      "mountHeight": 72
    },
    "poly": 2320,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r234_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r234_03",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "kapaklı tuvalet kağıtlığı",
      "tuvalet kağıdı askısı",
      "kağıtlık",
      "wc aksesuar"
    ],
    "surfaceType": "Parlak Krom 304 Çelik",
    "summary": "Kapaklı Paslanmaz Çelik Tuvalet Kağıdı Askısı — Vitra / ECA Kapaklı Kağıtlık tarzında 1:1 metrik (15×11×14 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r234-06",
    "slug": "banyo-ds-r234-06",
    "name": "İkili Yedekli Duvar Tuvalet Kağıdı Askısı",
    "brandStyle": "Otel & Villa İkili Kağıtlık",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 28,
      "depth": 10,
      "height": 10,
      "mountHeight": 72
    },
    "poly": 8156,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r234_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r234_06",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "ikili tuvalet kağıtlığı",
      "tuvalet kağıdı askısı",
      "kağıtlık"
    ],
    "surfaceType": "Parlak Krom",
    "summary": "İkili Yedekli Duvar Tuvalet Kağıdı Askısı — Otel & Villa İkili Kağıtlık tarzında 1:1 metrik (28×10×10 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r234-07",
    "slug": "banyo-ds-r234-07",
    "name": "Endüstriyel Mat Siyah Boru Tuvalet Kağıdı Askısı",
    "brandStyle": "Loft Siyah Boru Kağıtlık",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 18,
      "depth": 10,
      "height": 12,
      "mountHeight": 72
    },
    "poly": 62720,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r234_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r234_07",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "loft tuvalet kağıtlığı",
      "siyah tuvalet kağıdı askısı",
      "tuvalet kağıdı askısı"
    ],
    "surfaceType": "Mat Siyah Döküm Boru",
    "summary": "Endüstriyel Mat Siyah Boru Tuvalet Kağıdı Askısı — Loft Siyah Boru Kağıtlık tarzında 1:1 metrik (18×10×12 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r234-09",
    "slug": "banyo-ds-r234-09",
    "name": "Duvara Gömme Porselen Tuvalet Kağıdı Nişi",
    "brandStyle": "Gömme Seramik Kağıtlık",
    "subCategory": "Havluluk & Kağıtlık",
    "placement": "wall-mounted",
    "palette": "ceramic",
    "dims": {
      "width": 15,
      "depth": 12,
      "height": 8,
      "mountHeight": 72
    },
    "poly": 8164,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r234_09.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r234_09",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "gömme tuvalet kağıtlığı",
      "tuvalet kağıdı askısı",
      "porselen kağıtlık"
    ],
    "surfaceType": "Sırlı Beyaz Porselen",
    "summary": "Duvara Gömme Porselen Tuvalet Kağıdı Nişi — Gömme Seramik Kağıtlık tarzında 1:1 metrik (15×12×8 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-abo-b07qhl2cx3",
    "slug": "banyo-abo-b07qhl2cx3",
    "name": "Krem & Taş Baklava Desenli El Dokuma Pamuk Banyo Halısı",
    "brandStyle": "Modern Villa Pamuk Banyo Paspası",
    "subCategory": "Banyo Halısı & Tekstil",
    "placement": "floor",
    "palette": "rug",
    "dims": {
      "width": 70,
      "depth": 110,
      "height": 2
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/52/526208f0.jpg",
    "gltfUrl": "/api/v1/abo/glb/3/B07QHL2CX3.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "banyo halısı",
      "banyo paspası",
      "pamuk banyo halısı",
      "krem banyo halısı",
      "baklava banyo paspası",
      "halı"
    ],
    "surfaceType": "El Dokuma Pamuk & Yün Hav",
    "summary": "Krem & Taş Baklava Desenli El Dokuma Pamuk Banyo Halısı — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (70×110×2 cm)."
  },
  {
    "id": "bath-abo-b07qb8k19z",
    "slug": "banyo-abo-b07qb8k19z",
    "name": "Ekru Geometrik Dokuma Modern Banyo Halısı (65×105)",
    "brandStyle": "İskandinav Banyo Paspası",
    "subCategory": "Banyo Halısı & Tekstil",
    "placement": "floor",
    "palette": "rug",
    "dims": {
      "width": 65,
      "depth": 105,
      "height": 2
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/21/2156a065.jpg",
    "gltfUrl": "/api/v1/abo/glb/Z/B07QB8K19Z.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "banyo halısı",
      "banyo paspası",
      "ekru banyo paspası",
      "geometrik banyo halısı"
    ],
    "surfaceType": "Kabartmalı Pamuk-Yün Dokuma",
    "summary": "Ekru Geometrik Dokuma Modern Banyo Halısı (65×105) — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (65×105×2 cm)."
  },
  {
    "id": "bath-abo-b07qhkrs11",
    "slug": "banyo-abo-b07qhkrs11",
    "name": "Krem Baklava Kabartmalı Uzun Banyo Yolluk Paspası (60×140)",
    "brandStyle": "Çift Lavabo Önü Banyo Yolluğu",
    "subCategory": "Banyo Halısı & Tekstil",
    "placement": "floor",
    "palette": "rug",
    "dims": {
      "width": 60,
      "depth": 140,
      "height": 2
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/a7/a7ffdadc.jpg",
    "gltfUrl": "/api/v1/abo/glb/1/B07QHKRS11.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "banyo yolluğu",
      "uzun banyo halısı",
      "banyo halısı",
      "banyo paspası"
    ],
    "surfaceType": "El Dokuma Pamuklu Hav",
    "summary": "Krem Baklava Kabartmalı Uzun Banyo Yolluk Paspası (60×140) — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (60×140×2 cm)."
  },
  {
    "id": "bath-abo-b07qb8jywz",
    "slug": "banyo-abo-b07qb8jywz",
    "name": "Geometrik Tüy Desenli Modern Banyo Yolluk Halısı",
    "brandStyle": "Modern Spa Banyo Yolluğu",
    "subCategory": "Banyo Halısı & Tekstil",
    "placement": "floor",
    "palette": "rug",
    "dims": {
      "width": 60,
      "depth": 135,
      "height": 2
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/4f/4fc37199.jpg",
    "gltfUrl": "/api/v1/abo/glb/Z/B07QB8JYWZ.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "banyo halısı",
      "banyo paspası",
      "banyo yolluğu",
      "desenli banyo halısı"
    ],
    "surfaceType": "Dokuma Pamuk & Yün",
    "summary": "Geometrik Tüy Desenli Modern Banyo Yolluk Halısı — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (60×135×2 cm)."
  },
  {
    "id": "bath-abo-b07qjmfc4d",
    "slug": "banyo-abo-b07qjmfc4d",
    "name": "Sıcak Altın & Krem Eskitme Dokuma Banyo Halısı",
    "brandStyle": "Lüks Villa Banyo Halısı",
    "subCategory": "Banyo Halısı & Tekstil",
    "placement": "floor",
    "palette": "rug",
    "dims": {
      "width": 70,
      "depth": 115,
      "height": 2
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/09/0952161d.jpg",
    "gltfUrl": "/api/v1/abo/glb/D/B07QJMFC4D.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "banyo halısı",
      "banyo paspası",
      "gold krem banyo halısı"
    ],
    "surfaceType": "El Dokuma Pamuk-Yün",
    "summary": "Sıcak Altın & Krem Eskitme Dokuma Banyo Halısı — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (70×115×2 cm)."
  },
  {
    "id": "bath-abo-b07b4wknkw",
    "slug": "banyo-abo-b07b4wknkw",
    "name": "Mavi & Krem Kilim Düz Dokuma Pamuk Banyo Paspası",
    "brandStyle": "Bodrum / Ege Yazlık Banyo Paspası",
    "subCategory": "Banyo Halısı & Tekstil",
    "placement": "floor",
    "palette": "rug",
    "dims": {
      "width": 65,
      "depth": 100,
      "height": 1
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/a5/a51dd9b7.jpg",
    "gltfUrl": "/api/v1/abo/glb/W/B07B4WKNKW.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "banyo paspası",
      "banyo halısı",
      "kilim banyo paspası",
      "pamuk paspas"
    ],
    "surfaceType": "Düz Dokuma %100 Pamuk Kilim",
    "summary": "Mavi & Krem Kilim Düz Dokuma Pamuk Banyo Paspası — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (65×100×1 cm)."
  },
  {
    "id": "bath-abo-b07b51xcgs",
    "slug": "banyo-abo-b07b51xcgs",
    "name": "Siyah-Beyaz Geometrik Düz Dokuma Banyo Paspası",
    "brandStyle": "Monokrom Modern Banyo Paspası",
    "subCategory": "Banyo Halısı & Tekstil",
    "placement": "floor",
    "palette": "rug",
    "dims": {
      "width": 65,
      "depth": 105,
      "height": 1
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/85/851a6e6d.jpg",
    "gltfUrl": "/api/v1/abo/glb/S/B07B51XCGS.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "siyah beyaz banyo paspası",
      "banyo halısı",
      "banyo paspası"
    ],
    "surfaceType": "Düz Dokuma Pamuk Kilim",
    "summary": "Siyah-Beyaz Geometrik Düz Dokuma Banyo Paspası — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (65×105×1 cm)."
  },
  {
    "id": "bath-abo-b07qgg3pv8",
    "slug": "banyo-abo-b07qgg3pv8",
    "name": "Zeytin Yeşili & Krem İkat Desenli Banyo Halısı",
    "brandStyle": "Doğal Spa Yeşil Banyo Halısı",
    "subCategory": "Banyo Halısı & Tekstil",
    "placement": "floor",
    "palette": "rug",
    "dims": {
      "width": 70,
      "depth": 110,
      "height": 2
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/2c/2c762c41.jpg",
    "gltfUrl": "/api/v1/abo/glb/8/B07QGG3PV8.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "yeşil banyo halısı",
      "banyo halısı",
      "banyo paspası",
      "spa paspas"
    ],
    "surfaceType": "El Dokuma Pamuk & Yün",
    "summary": "Zeytin Yeşili & Krem İkat Desenli Banyo Halısı — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (70×110×2 cm)."
  },
  {
    "id": "bath-abo-b07qb8jq5h",
    "slug": "banyo-abo-b07qb8jq5h",
    "name": "Krem & Vizon Dalgalı Çizgili Spa Banyo Halısı",
    "brandStyle": "Otel & Spa Çizgili Banyo Halısı",
    "subCategory": "Banyo Halısı & Tekstil",
    "placement": "floor",
    "palette": "rug",
    "dims": {
      "width": 75,
      "depth": 120,
      "height": 2
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/41/4156c52b.jpg",
    "gltfUrl": "/api/v1/abo/glb/H/B07QB8JQ5H.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "vizon banyo halısı",
      "çizgili banyo paspası",
      "banyo halısı",
      "banyo paspası"
    ],
    "surfaceType": "Yumuşak Yün-Pamuk Dokuma",
    "summary": "Krem & Vizon Dalgalı Çizgili Spa Banyo Halısı — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (75×120×2 cm)."
  },
  {
    "id": "bath-abo-b07qhkv52d",
    "slug": "banyo-abo-b07qhkv52d",
    "name": "Eskitme Mavi-Fildişi Banyo Yolluk Paspası",
    "brandStyle": "Ege Villa Banyo Yolluğu",
    "subCategory": "Banyo Halısı & Tekstil",
    "placement": "floor",
    "palette": "rug",
    "dims": {
      "width": 60,
      "depth": 140,
      "height": 2
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/49/490a5421.jpg",
    "gltfUrl": "/api/v1/abo/glb/D/B07QHKV52D.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "mavi banyo halısı",
      "banyo paspası",
      "banyo halısı",
      "banyo yolluğu"
    ],
    "surfaceType": "El Dokuma Pamuk-Yün",
    "summary": "Eskitme Mavi-Fildişi Banyo Yolluk Paspası — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (60×140×2 cm)."
  },
  {
    "id": "bath-sim-consumable-microfiber-towel-stack-folded-a01",
    "slug": "banyo-sim-consumable-microfiber-towel-stack-folded-a01",
    "name": "Üst Üste Katlı Spa Banyo Havlu Seti (3'lü)",
    "brandStyle": "Otel & Spa Katlı Havlu Dekoru",
    "subCategory": "Banyo Halısı & Tekstil",
    "placement": "floor",
    "palette": "rug",
    "dims": {
      "width": 32,
      "depth": 26,
      "height": 16
    },
    "poly": 1176086,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/consumable_microfiber_towel_stack_folded_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/consumable_microfiber_towel_stack_folded_a01",
    "provider": "hf",
    "license": "CC-BY-4.0 · NVIDIA SimReady",
    "keywords": [
      "katlı havlu",
      "banyo havlusu",
      "havlu seti",
      "banyo tekstil",
      "spa havlu"
    ],
    "surfaceType": "Pamuklu Havlu Kumaş",
    "summary": "Üst Üste Katlı Spa Banyo Havlu Seti (3'lü) — yüksek poligonlu (1176k tri) stüdyo taranmış PBR 3D banyo modeli. 1:1 metrik ölçü (32×26×16 cm) ve Blender uyumlu."
  },
  {
    "id": "bath-sim-consumable-microfiber-towel-folded-large-a01",
    "slug": "banyo-sim-consumable-microfiber-towel-folded-large-a01",
    "name": "Katlanmış Büyük Boy Pamuklu Banyo Havlusu",
    "brandStyle": "Banyo Rafı Katlı Havlu",
    "subCategory": "Banyo Halısı & Tekstil",
    "placement": "floor",
    "palette": "rug",
    "dims": {
      "width": 34,
      "depth": 25,
      "height": 6
    },
    "poly": 888832,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/consumable_microfiber_towel_folded_large_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/consumable_microfiber_towel_folded_large_a01",
    "provider": "hf",
    "license": "CC-BY-4.0 · NVIDIA SimReady",
    "keywords": [
      "banyo havlusu",
      "katlı havlu",
      "banyo tekstil"
    ],
    "surfaceType": "Yumuşak Pamuk Havlu",
    "summary": "Katlanmış Büyük Boy Pamuklu Banyo Havlusu — yüksek poligonlu (889k tri) stüdyo taranmış PBR 3D banyo modeli. 1:1 metrik ölçü (34×25×6 cm) ve Blender uyumlu."
  },
  {
    "id": "bath-obj-folded-towel-c5f9e72e",
    "slug": "banyo-obj-folded-towel-c5f9e72e",
    "name": "Kıvrımlı Katlı Modern Banyo El Havlusu",
    "brandStyle": "Lavabo Kenarı El Havlusu",
    "subCategory": "Banyo Halısı & Tekstil",
    "placement": "floor",
    "palette": "rug",
    "dims": {
      "width": 30,
      "depth": 22,
      "height": 7
    },
    "poly": 18500,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/folded-towel-c5f9e72e.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/folded-towel-c5f9e72e",
    "provider": "hf",
    "license": "CC-BY-4.0 · Objaverse Studio",
    "keywords": [
      "el havlusu",
      "banyo havlusu",
      "katlı havlu"
    ],
    "surfaceType": "Dokuma Pamuk Havlu",
    "summary": "Kıvrımlı Katlı Modern Banyo El Havlusu — gerçekçi PBR dokulu hazır banyo 3D modeli (30×22×7 cm). Blender Cycles ve iç mekan görselleştirmeleri için hazır."
  },
  {
    "id": "bath-abo-b073whys32",
    "slug": "banyo-abo-b073whys32",
    "name": "Mat Siyah Metal Çerçeveli Yuvarlak Banyo Aynası (Ø70)",
    "brandStyle": "Trendyol Siyah Yuvarlak Banyo Aynası",
    "subCategory": "Banyo Aynası & Aplik",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 70,
      "depth": 4,
      "height": 70,
      "mountHeight": 135
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/d7/d7bd1432.jpg",
    "gltfUrl": "/api/v1/abo/glb/2/B073WHYS32.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "banyo aynası",
      "yuvarlak banyo aynası",
      "siyah ayna",
      "ayna",
      "duvar aynası"
    ],
    "surfaceType": "Mat Siyah Demir Çerçeve + Ayna",
    "summary": "Mat Siyah Metal Çerçeveli Yuvarlak Banyo Aynası (Ø70) — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (70×4×70 cm)."
  },
  {
    "id": "bath-abo-b073wh17gb",
    "slug": "banyo-abo-b073wh17gb",
    "name": "Gold Metal Çerçeveli & Ahşap Raflı Banyo Aynası",
    "brandStyle": "Raflı Gold Banyo Aynası",
    "subCategory": "Banyo Aynası & Aplik",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 52,
      "depth": 12,
      "height": 62,
      "mountHeight": 135
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/3b/3b0fd012.jpg",
    "gltfUrl": "/api/v1/abo/glb/B/B073WH17GB.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "raflı banyo aynası",
      "gold banyo aynası",
      "banyo aynası",
      "ayna"
    ],
    "surfaceType": "Fırçalı Gold Çerçeve + Ahşap Raf",
    "summary": "Gold Metal Çerçeveli & Ahşap Raflı Banyo Aynası — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (52×12×62 cm)."
  },
  {
    "id": "bath-abo-b071dqrxdr",
    "slug": "banyo-abo-b071dqrxdr",
    "name": "Sekizgen Geometrik Metal Çerçeveli Banyo Aynası",
    "brandStyle": "Geometrik Modern Banyo Aynası",
    "subCategory": "Banyo Aynası & Aplik",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 62,
      "depth": 4,
      "height": 71,
      "mountHeight": 135
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/36/3603f7a3.jpg",
    "gltfUrl": "/api/v1/abo/glb/R/B071DQRXDR.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "sekizgen ayna",
      "banyo aynası",
      "modern ayna",
      "ayna"
    ],
    "surfaceType": "Metal Çerçeve + Flotal Ayna",
    "summary": "Sekizgen Geometrik Metal Çerçeveli Banyo Aynası — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (62×4×71 cm)."
  },
  {
    "id": "bath-abo-b084kdg762",
    "slug": "banyo-abo-b084kdg762",
    "name": "Kemerli Doğal Ahşap Çerçeveli Banyo Aynası",
    "brandStyle": "Kemerli Villa Banyo Aynası",
    "subCategory": "Banyo Aynası & Aplik",
    "placement": "wall-mounted",
    "palette": "vanity",
    "dims": {
      "width": 66,
      "depth": 5,
      "height": 92,
      "mountHeight": 130
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/54/54b86502.jpg",
    "gltfUrl": "/api/v1/abo/glb/2/B084KDG762.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "kemerli ayna",
      "ahşap banyo aynası",
      "banyo aynası",
      "ayna"
    ],
    "surfaceType": "Doğal Meşe Çerçeve + Ayna",
    "summary": "Kemerli Doğal Ahşap Çerçeveli Banyo Aynası — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (66×5×92 cm)."
  },
  {
    "id": "bath-abo-b07hslg6xk",
    "slug": "banyo-abo-b07hslg6xk",
    "name": "Beyaz Çerçeveli Alt Raflı Banyo Aynası",
    "brandStyle": "Raflı Beyaz Banyo Aynası",
    "subCategory": "Banyo Aynası & Aplik",
    "placement": "wall-mounted",
    "palette": "vanity",
    "dims": {
      "width": 54,
      "depth": 13,
      "height": 61,
      "mountHeight": 135
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/a2/a26e2c41.jpg",
    "gltfUrl": "/api/v1/abo/glb/K/B07HSLG6XK.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "raflı ayna",
      "beyaz banyo aynası",
      "banyo aynası",
      "ayna"
    ],
    "surfaceType": "Beyaz Ahşap + Flotal Ayna",
    "summary": "Beyaz Çerçeveli Alt Raflı Banyo Aynası — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (54×13×61 cm)."
  },
  {
    "id": "bath-abo-b071v8dqvq",
    "slug": "banyo-abo-b071v8dqvq",
    "name": "Damla Oval Askılı Minimalist Banyo Aynası",
    "brandStyle": "Oval Banyo Aynası",
    "subCategory": "Banyo Aynası & Aplik",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 46,
      "depth": 4,
      "height": 61,
      "mountHeight": 138
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/7f/7f69a36d.jpg",
    "gltfUrl": "/api/v1/abo/glb/Q/B071V8DQVQ.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "oval banyo aynası",
      "damla ayna",
      "banyo aynası",
      "ayna"
    ],
    "surfaceType": "Metal Çerçeve + Ayna",
    "summary": "Damla Oval Askılı Minimalist Banyo Aynası — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (46×4×61 cm)."
  },
  {
    "id": "bath-abo-b071nhtq26",
    "slug": "banyo-abo-b071nhtq26",
    "name": "Askı Kayışlı Yuvarlak Modern Banyo Aynası (Ø76)",
    "brandStyle": "Askılı Yuvarlak Banyo Aynası",
    "subCategory": "Banyo Aynası & Aplik",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 76,
      "depth": 4,
      "height": 76,
      "mountHeight": 135
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/60/60aad32e.jpg",
    "gltfUrl": "/api/v1/abo/glb/6/B071NHTQ26.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "askılı ayna",
      "yuvarlak banyo aynası",
      "banyo aynası",
      "ayna"
    ],
    "surfaceType": "Eskitme Metal + Flotal Ayna",
    "summary": "Askı Kayışlı Yuvarlak Modern Banyo Aynası (Ø76) — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (76×4×76 cm)."
  },
  {
    "id": "bath-sim-mirror-bathroom-a01",
    "slug": "banyo-sim-mirror-bathroom-a01",
    "name": "Çerçevesiz Dikdörtgen Mimari Banyo Aynası",
    "brandStyle": "Minimalist Otel Banyo Aynası",
    "subCategory": "Banyo Aynası & Aplik",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 80,
      "depth": 3,
      "height": 65,
      "mountHeight": 135
    },
    "poly": 54722,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/mirror_bathroom_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/mirror_bathroom_a01",
    "provider": "hf",
    "license": "CC-BY-4.0 · NVIDIA SimReady",
    "keywords": [
      "çerçevesiz banyo aynası",
      "dikdörtgen banyo aynası",
      "banyo aynası",
      "ayna"
    ],
    "surfaceType": "Rodajlı Flotal Ayna",
    "summary": "Çerçevesiz Dikdörtgen Mimari Banyo Aynası — yüksek poligonlu (55k tri) stüdyo taranmış PBR 3D banyo modeli. 1:1 metrik ölçü (80×3×65 cm) ve Blender uyumlu."
  },
  {
    "id": "bath-uc-ds-r242-02",
    "slug": "banyo-ds-r242-02",
    "name": "LED Halkalı Masaüstü Makyaj & Banyo Aynası",
    "brandStyle": "LED Işıklı Makyaj Aynası",
    "subCategory": "Banyo Aynası & Aplik",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 22,
      "depth": 14,
      "height": 34
    },
    "poly": 22560,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r242_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r242_02",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "makyaj aynası",
      "led ayna",
      "banyo aynası",
      "tezgah üstü ayna"
    ],
    "surfaceType": "Krom Metal + LED Halka",
    "summary": "LED Halkalı Masaüstü Makyaj & Banyo Aynası — LED Işıklı Makyaj Aynası tarzında 1:1 metrik (22×14×34 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r242-03",
    "slug": "banyo-ds-r242-03",
    "name": "Duvara Monte Akordeon Büyüteçli Otel Banyo Aynası",
    "brandStyle": "Otel Tipi Büyüteçli Ayna",
    "subCategory": "Banyo Aynası & Aplik",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 20,
      "depth": 32,
      "height": 24,
      "mountHeight": 145
    },
    "poly": 9996,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r242_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r242_03",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "otel aynası",
      "akordeon ayna",
      "büyüteçli banyo aynası",
      "makyaj aynası"
    ],
    "surfaceType": "Parlak Krom Çelik",
    "summary": "Duvara Monte Akordeon Büyüteçli Otel Banyo Aynası — Otel Tipi Büyüteçli Ayna tarzında 1:1 metrik (20×32×24 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r242-08",
    "slug": "banyo-ds-r242-08",
    "name": "Fırçalı Pirinç Ayaklı Yuvarlak Banyo Aynası",
    "brandStyle": "Pirinç Tezgah Üstü Ayna",
    "subCategory": "Banyo Aynası & Aplik",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 50,
      "depth": 12,
      "height": 40
    },
    "poly": 10320,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r242_08.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r242_08",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "pirinç ayna",
      "makyaj aynası",
      "banyo aynası"
    ],
    "surfaceType": "Fırçalı Pirinç",
    "summary": "Fırçalı Pirinç Ayaklı Yuvarlak Banyo Aynası — Pirinç Tezgah Üstü Ayna tarzında 1:1 metrik (50×12×40 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-abo-b07qj766rb",
    "slug": "banyo-abo-b07qj766rb",
    "name": "Fırçalı Nikel Ayna Üstü Banyo Apliği",
    "brandStyle": "Banyo Ayna Üstü Aplik",
    "subCategory": "Banyo Aynası & Aplik",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 42,
      "depth": 16,
      "height": 20,
      "mountHeight": 198
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/fd/fd27e37f.jpg",
    "gltfUrl": "/api/v1/abo/glb/B/B07QJ766RB.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "banyo apliği",
      "ayna üstü aplik",
      "banyo aydınlatma",
      "aplik",
      "duvar apliği"
    ],
    "surfaceType": "Fırçalı Nikel + Opal Cam",
    "summary": "Fırçalı Nikel Ayna Üstü Banyo Apliği — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (42×16×20 cm)."
  },
  {
    "id": "bath-abo-b07b4yvx5q",
    "slug": "banyo-abo-b07b4yvx5q",
    "name": "3'lü Opal Cam Küreli Banyo Ayna Üstü Apliği",
    "brandStyle": "3'lü Modern Banyo Apliği",
    "subCategory": "Banyo Aynası & Aplik",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 62,
      "depth": 18,
      "height": 22,
      "mountHeight": 198
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/aa/aa26c8a0.jpg",
    "gltfUrl": "/api/v1/abo/glb/Q/B07B4YVX5Q.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "banyo apliği",
      "ayna üstü aplik",
      "3lü banyo apliği",
      "banyo aydınlatma"
    ],
    "surfaceType": "Mat Siyah Metal + Opal Cam Küre",
    "summary": "3'lü Opal Cam Küreli Banyo Ayna Üstü Apliği — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (62×18×22 cm)."
  },
  {
    "id": "bath-abo-b07b4w24jt",
    "slug": "banyo-abo-b07b4w24jt",
    "name": "3'lü Şeffaf Cam Fanuslu Banyo Ayna Üstü Apliği",
    "brandStyle": "Şeffaf Cam Banyo Apliği",
    "subCategory": "Banyo Aynası & Aplik",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 60,
      "depth": 18,
      "height": 22,
      "mountHeight": 198
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/81/8190bc24.jpg",
    "gltfUrl": "/api/v1/abo/glb/T/B07B4W24JT.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "banyo apliği",
      "ayna üstü aplik",
      "camlı banyo apliği",
      "banyo aydınlatma"
    ],
    "surfaceType": "Krom / Siyah Metal + Şeffaf Cam",
    "summary": "3'lü Şeffaf Cam Fanuslu Banyo Ayna Üstü Apliği — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (60×18×22 cm)."
  },
  {
    "id": "bath-abo-b07b4sc2kw",
    "slug": "banyo-abo-b07b4sc2kw",
    "name": "4'lü Geniş Çift Lavabo Üstü Banyo Apliği",
    "brandStyle": "Geniş Villa Banyo Apliği",
    "subCategory": "Banyo Aynası & Aplik",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 82,
      "depth": 18,
      "height": 22,
      "mountHeight": 198
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/a3/a3467afc.jpg",
    "gltfUrl": "/api/v1/abo/glb/W/B07B4SC2KW.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "4lü banyo apliği",
      "banyo apliği",
      "ayna üstü aplik",
      "banyo aydınlatma"
    ],
    "surfaceType": "Koyu Metal + Cam Fanus",
    "summary": "4'lü Geniş Çift Lavabo Üstü Banyo Apliği — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (82×18×22 cm)."
  },
  {
    "id": "bath-abo-b07qd5rgpb",
    "slug": "banyo-abo-b07qd5rgpb",
    "name": "Koyu Bronz Mid-Century Banyo Duvar Apliği",
    "brandStyle": "Ayna Yanı Banyo Apliği",
    "subCategory": "Banyo Aynası & Aplik",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 16,
      "depth": 18,
      "height": 25,
      "mountHeight": 170
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/10/109a0f1e.jpg",
    "gltfUrl": "/api/v1/abo/glb/B/B07QD5RGPB.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "ayna yanı aplik",
      "banyo apliği",
      "bronz aplik",
      "duvar apliği"
    ],
    "surfaceType": "Koyu Bronz + Opal Cam",
    "summary": "Koyu Bronz Mid-Century Banyo Duvar Apliği — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (16×18×25 cm)."
  },
  {
    "id": "bath-abo-b07b51fdt9",
    "slug": "banyo-abo-b07b51fdt9",
    "name": "3'lü Pirinç & Cam Villa Banyo Ayna Apliği",
    "brandStyle": "Villa Klasik Banyo Apliği",
    "subCategory": "Banyo Aynası & Aplik",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 60,
      "depth": 18,
      "height": 22,
      "mountHeight": 198
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/78/788f30ab.jpg",
    "gltfUrl": "/api/v1/abo/glb/9/B07B51FDT9.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "pirinç banyo apliği",
      "banyo apliği",
      "ayna üstü aplik"
    ],
    "surfaceType": "Pirinç Metal + Cam Fanus",
    "summary": "3'lü Pirinç & Cam Villa Banyo Ayna Apliği — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (60×18×22 cm)."
  },
  {
    "id": "bath-abo-b07ffskhk4",
    "slug": "banyo-abo-b07ffskhk4",
    "name": "Mat Siyah Köpük Sıvı Sabunluk (Tezgah Üstü)",
    "brandStyle": "Modern Mat Siyah Sabunluk",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 9,
      "depth": 9,
      "height": 18
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/b8/b88dd2fe.jpg",
    "gltfUrl": "/api/v1/abo/glb/4/B07FFSKHK4.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "sıvı sabunluk",
      "sabunluk",
      "siyah sabunluk",
      "köpük sabunluk",
      "banyo aksesuarı"
    ],
    "surfaceType": "Mat Siyah Polimer & Krom Pompa",
    "summary": "Mat Siyah Köpük Sıvı Sabunluk (Tezgah Üstü) — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (9×9×18 cm)."
  },
  {
    "id": "bath-sim-fixture-soapdispenser-wallmounted-a01",
    "slug": "banyo-sim-fixture-soapdispenser-wallmounted-a01",
    "name": "Duvara Monte Paslanmaz Çelik Sıvı Sabun Dispenseri",
    "brandStyle": "Otel & Ticari Duvar Sabunluğu",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 11,
      "depth": 12,
      "height": 22,
      "mountHeight": 112
    },
    "poly": 31648,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/fixture_soapDispenser_wallMounted_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/fixture_soapDispenser_wallMounted_a01",
    "provider": "hf",
    "license": "CC-BY-4.0 · NVIDIA SimReady",
    "keywords": [
      "duvar sabunluğu",
      "sıvı sabunluk",
      "sabun dispenseri",
      "sabunluk",
      "banyo aksesuarı"
    ],
    "surfaceType": "Fırçalı Paslanmaz Çelik",
    "summary": "Duvara Monte Paslanmaz Çelik Sıvı Sabun Dispenseri — yüksek poligonlu (32k tri) stüdyo taranmış PBR 3D banyo modeli. 1:1 metrik ölçü (11×12×22 cm) ve Blender uyumlu."
  },
  {
    "id": "bath-sim-cleaning-soapdispenser-a01",
    "slug": "banyo-sim-cleaning-soapdispenser-a01",
    "name": "Şeffaf Pompalı Modern Banyo Sıvı Sabunluğu",
    "brandStyle": "Lavabo Üstü Sıvı Sabunluk",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 8,
      "depth": 8,
      "height": 19
    },
    "poly": 82342,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/cleaning_soapDispenser_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/cleaning_soapDispenser_a01",
    "provider": "hf",
    "license": "CC-BY-4.0 · NVIDIA SimReady",
    "keywords": [
      "sıvı sabunluk",
      "sabunluk",
      "banyo aksesuarı"
    ],
    "surfaceType": "Cam / Akrilik Gövde + Pompa",
    "summary": "Şeffaf Pompalı Modern Banyo Sıvı Sabunluğu — yüksek poligonlu (82k tri) stüdyo taranmış PBR 3D banyo modeli. 1:1 metrik ölçü (8×8×19 cm) ve Blender uyumlu."
  },
  {
    "id": "bath-uc-ds-r232-02",
    "slug": "banyo-ds-r232-02",
    "name": "Yuvarlak Cam Şişeli Krom Pompalı Sıvı Sabunluk",
    "brandStyle": "Cam Banyo Sabunluğu",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 9,
      "depth": 9,
      "height": 19
    },
    "poly": 35638,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r232_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r232_02",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "cam sabunluk",
      "sıvı sabunluk",
      "sabunluk",
      "banyo aksesuarı"
    ],
    "surfaceType": "Temperli Cam + Krom Pompa",
    "summary": "Yuvarlak Cam Şişeli Krom Pompalı Sıvı Sabunluk — Cam Banyo Sabunluğu tarzında 1:1 metrik (9×9×19 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r232-03",
    "slug": "banyo-ds-r232-03",
    "name": "Kare Beyaz Seramik Tezgah Üstü Sıvı Sabunluk",
    "brandStyle": "Seramik Banyo Seti Sabunluk",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 8,
      "depth": 8,
      "height": 18
    },
    "poly": 4116,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r232_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r232_03",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "seramik sabunluk",
      "sıvı sabunluk",
      "sabunluk",
      "banyo seti"
    ],
    "surfaceType": "Sırlı Seramik + Metal Pompa",
    "summary": "Kare Beyaz Seramik Tezgah Üstü Sıvı Sabunluk — Seramik Banyo Seti Sabunluk tarzında 1:1 metrik (8×8×18 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r232-06",
    "slug": "banyo-ds-r232-06",
    "name": "Silindirik Paslanmaz Çelik Sıvı Sabunluk",
    "brandStyle": "İnox Banyo Sabunluğu",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 8,
      "depth": 8,
      "height": 19
    },
    "poly": 39620,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r232_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r232_06",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "paslanmaz sabunluk",
      "inox sabunluk",
      "sıvı sabunluk",
      "sabunluk"
    ],
    "surfaceType": "Fırçalı 304 Paslanmaz",
    "summary": "Silindirik Paslanmaz Çelik Sıvı Sabunluk — İnox Banyo Sabunluğu tarzında 1:1 metrik (8×8×19 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r232-09",
    "slug": "banyo-ds-r232-09",
    "name": "Duş İçi 3 Bölmeli Duvara Monte Şampuan & Jel Dispenseri",
    "brandStyle": "Otel & Spa 3'lü Şampuanlık",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "wall-mounted",
    "palette": "ceramic",
    "dims": {
      "width": 30,
      "depth": 8,
      "height": 20,
      "mountHeight": 135
    },
    "poly": 6090,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r232_09.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r232_09",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "şampuan dispenseri",
      "duş içi sabunluk",
      "üçlü sabunluk",
      "banyo aksesuarı"
    ],
    "surfaceType": "Parlak ABS + Şeffaf Hazne",
    "summary": "Duş İçi 3 Bölmeli Duvara Monte Şampuan & Jel Dispenseri — Otel & Spa 3'lü Şampuanlık tarzında 1:1 metrik (30×8×20 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r232-10",
    "slug": "banyo-ds-r232-10",
    "name": "Amber Cam Apothecary Tasarım Sıvı Sabun Şişesi",
    "brandStyle": "Butik Otel Amber Sabunluk",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 9,
      "depth": 9,
      "height": 20
    },
    "poly": 7762,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r232_10.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r232_10",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "amber sabunluk",
      "cam sabunluk",
      "sıvı sabunluk",
      "banyo aksesuarı"
    ],
    "surfaceType": "Amber Cam + Mat Siyah Pompa",
    "summary": "Amber Cam Apothecary Tasarım Sıvı Sabun Şişesi — Butik Otel Amber Sabunluk tarzında 1:1 metrik (9×9×20 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r233-01",
    "slug": "banyo-ds-r233-01",
    "name": "Yuvarlak Seramik Diş Fırçalık (Tezgah Üstü)",
    "brandStyle": "Seramik Banyo Seti Diş Fırçalık",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 9,
      "depth": 9,
      "height": 11
    },
    "poly": 31034,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r233_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r233_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "diş fırçalık",
      "banyo seti",
      "seramik diş fırçalık",
      "banyo aksesuarı"
    ],
    "surfaceType": "Sırlı Seramik",
    "summary": "Yuvarlak Seramik Diş Fırçalık (Tezgah Üstü) — Seramik Banyo Seti Diş Fırçalık tarzında 1:1 metrik (9×9×11 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r233-04",
    "slug": "banyo-ds-r233-04",
    "name": "Modern Bardak Formlu Banyo Diş Fırçalık",
    "brandStyle": "Minimalist Banyo Bardağı",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 8,
      "depth": 8,
      "height": 11
    },
    "poly": 4516,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r233_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r233_04",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "diş fırçalık",
      "banyo bardağı",
      "banyo aksesuarı"
    ],
    "surfaceType": "Mat Seramik / Taş",
    "summary": "Modern Bardak Formlu Banyo Diş Fırçalık — Minimalist Banyo Bardağı tarzında 1:1 metrik (8×8×11 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r233-06",
    "slug": "banyo-ds-r233-06",
    "name": "Paslanmaz Çelik Silindirik Diş Fırçalık",
    "brandStyle": "İnox Banyo Diş Fırçalığı",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 8,
      "depth": 8,
      "height": 12
    },
    "poly": 4608,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r233_06.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r233_06",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "paslanmaz diş fırçalık",
      "diş fırçalık",
      "banyo aksesuarı"
    ],
    "surfaceType": "Fırçalı Paslanmaz Çelik",
    "summary": "Paslanmaz Çelik Silindirik Diş Fırçalık — İnox Banyo Diş Fırçalığı tarzında 1:1 metrik (8×8×12 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r233-08",
    "slug": "banyo-ds-r233-08",
    "name": "Brüt Beton Minimalist Banyo Diş Fırçalık",
    "brandStyle": "Modern Beton Banyo Aksesuarı",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 10,
      "depth": 6,
      "height": 6
    },
    "poly": 26696,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r233_08.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r233_08",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "beton diş fırçalık",
      "diş fırçalık",
      "banyo aksesuarı"
    ],
    "surfaceType": "Sırlı Brüt Beton",
    "summary": "Brüt Beton Minimalist Banyo Diş Fırçalık — Modern Beton Banyo Aksesuarı tarzında 1:1 metrik (10×6×6 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-abo-b07mf1nj7q",
    "slug": "banyo-abo-b07mf1nj7q",
    "name": "3'lü Kabartmalı Seramik Pamukluk & Banyo Kavanoz Seti",
    "brandStyle": "Seramik Banyo Pamukluk Seti",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 32,
      "depth": 12,
      "height": 22
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/76/7689012e.jpg",
    "gltfUrl": "/api/v1/abo/glb/Q/B07MF1NJ7Q.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "pamukluk",
      "banyo kavanoz seti",
      "banyo aksesuar seti",
      "seramik banyo seti"
    ],
    "surfaceType": "Kabartmalı Seramik Stoneware",
    "summary": "3'lü Kabartmalı Seramik Pamukluk & Banyo Kavanoz Seti — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (32×12×22 cm)."
  },
  {
    "id": "bath-abo-b07ml7j5d2",
    "slug": "banyo-abo-b07ml7j5d2",
    "name": "2'li Beyaz Seramik Banyo Pamukluk Kavanoz Seti",
    "brandStyle": "Beyaz Seramik Pamukluk",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 22,
      "depth": 11,
      "height": 20
    },
    "poly": 16400,
    "thumbUrl": "https://amazon-berkeley-objects.s3.amazonaws.com/images/small/d1/d172e5f9.jpg",
    "gltfUrl": "/api/v1/abo/glb/2/B07ML7J5D2.glb",
    "provider": "abo",
    "license": "CC-BY-4.0 · ABO Studio GLB",
    "keywords": [
      "pamukluk",
      "banyo aksesuarı",
      "seramik kavanoz"
    ],
    "surfaceType": "Sırlı Beyaz Seramik",
    "summary": "2'li Beyaz Seramik Banyo Pamukluk Kavanoz Seti — gerçek ürün fotoğrafıyla %100 birebir stüdyo taranmış PBR 3D banyo modeli (22×11×20 cm)."
  },
  {
    "id": "bath-uc-ds-r238-01",
    "slug": "banyo-ds-r238-01",
    "name": "3 Katlı Duş Başlığına Askılı Paslanmaz Şampuanlık",
    "brandStyle": "Duş İçi Askılı Şampuanlık",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 28,
      "depth": 13,
      "height": 58,
      "mountHeight": 145
    },
    "poly": 12800,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r238_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r238_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "şampuanlık",
      "duş içi raf",
      "banyo rafı",
      "duşakabin rafı",
      "banyo aksesuarı"
    ],
    "surfaceType": "Krom / Paslanmaz Tel",
    "summary": "3 Katlı Duş Başlığına Askılı Paslanmaz Şampuanlık — Duş İçi Askılı Şampuanlık tarzında 1:1 metrik (28×13×58 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r238-02",
    "slug": "banyo-ds-r238-02",
    "name": "Duş İçi İki Katlı Köşe Şampuanlık Rafı",
    "brandStyle": "Trendyol Köşe Duş Şampuanlığı",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 24,
      "depth": 24,
      "height": 38,
      "mountHeight": 125
    },
    "poly": 6848,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r238_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r238_02",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "köşe şampuanlık",
      "duş rafı",
      "banyo köşe rafı",
      "şampuanlık"
    ],
    "surfaceType": "Paslanmaz Çelik / Mat Siyah",
    "summary": "Duş İçi İki Katlı Köşe Şampuanlık Rafı — Trendyol Köşe Duş Şampuanlığı tarzında 1:1 metrik (24×24×38 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r238-04",
    "slug": "banyo-ds-r238-04",
    "name": "Tabandan Tavana Teleskopik Köşe Duş Şampuanlığı",
    "brandStyle": "Teleskopik 4 Katlı Banyo Rafı",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 28,
      "depth": 24,
      "height": 240
    },
    "poly": 20044,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r238_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r238_04",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "teleskopik banyo rafı",
      "köşe şampuanlık",
      "şampuanlık",
      "banyo rafı"
    ],
    "surfaceType": "Paslanmaz Çelik + Raf",
    "summary": "Tabandan Tavana Teleskopik Köşe Duş Şampuanlığı — Teleskopik 4 Katlı Banyo Rafı tarzında 1:1 metrik (28×24×240 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r238-05",
    "slug": "banyo-ds-r238-05",
    "name": "Doğal Bambu Duş İçi Şampuanlık Rafı",
    "brandStyle": "Spa Bambu Banyo Rafı",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "wall-mounted",
    "palette": "vanity",
    "dims": {
      "width": 30,
      "depth": 14,
      "height": 42,
      "mountHeight": 130
    },
    "poly": 7964,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r238_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r238_05",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "bambu şampuanlık",
      "duş rafı",
      "banyo rafı",
      "şampuanlık"
    ],
    "surfaceType": "Suya Dayanıklı Doğal Bambu",
    "summary": "Doğal Bambu Duş İçi Şampuanlık Rafı — Spa Bambu Banyo Rafı tarzında 1:1 metrik (30×14×42 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r238-10",
    "slug": "banyo-ds-r238-10",
    "name": "Havluluklu Paslanmaz Duvar Tipi Banyo Şampuanlığı",
    "brandStyle": "Duvar Tipi Duş Rafı + Askı",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 40,
      "depth": 12,
      "height": 30,
      "mountHeight": 125
    },
    "poly": 11848,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r238_10.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r238_10",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "duş rafı",
      "şampuanlık",
      "banyo duvar rafı",
      "banyo aksesuarı"
    ],
    "surfaceType": "Fırçalı 304 Paslanmaz",
    "summary": "Havluluklu Paslanmaz Duvar Tipi Banyo Şampuanlığı — Duvar Tipi Duş Rafı + Askı tarzında 1:1 metrik (40×12×30 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-obj-actually-shampoo-bottles-v2-467054cb",
    "slug": "banyo-obj-actually-shampoo-bottles-v2-467054cb",
    "name": "Modern Duş İçi Şampuan & Duş Jeli Şişe Seti",
    "brandStyle": "Render Dekoratif Şampuan Seti",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 24,
      "depth": 9,
      "height": 23
    },
    "poly": 18500,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/objaverse-clean-glb/resolve/main/thumbs/actually-shampoo-bottles-v2-467054cb.webp",
    "gltfUrl": "/api/v1/hf/glb/objaverse-clean-glb/actually-shampoo-bottles-v2-467054cb",
    "provider": "hf",
    "license": "CC-BY-4.0 · Objaverse Studio",
    "keywords": [
      "şampuan şişesi",
      "duş jeli",
      "banyo dekoru",
      "banyo aksesuarı"
    ],
    "surfaceType": "Mat Polimer Şişe Seti",
    "summary": "Modern Duş İçi Şampuan & Duş Jeli Şişe Seti — gerçekçi PBR dokulu hazır banyo 3D modeli (24×9×23 cm). Blender Cycles ve iç mekan görselleştirmeleri için hazır."
  },
  {
    "id": "bath-uc-ds-r786-01",
    "slug": "banyo-ds-r786-01",
    "name": "Beyaz Seramik Ayaklı Klozet Fırçalığı",
    "brandStyle": "Seramik Klozet Fırçalığı",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 10,
      "depth": 10,
      "height": 38
    },
    "poly": 9650,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r786_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r786_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "klozet fırçalığı",
      "wc fırçası",
      "tuvalet fırçası",
      "banyo aksesuarı"
    ],
    "surfaceType": "Parlak Seramik + Krom Sap",
    "summary": "Beyaz Seramik Ayaklı Klozet Fırçalığı — Seramik Klozet Fırçalığı tarzında 1:1 metrik (10×10×38 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r786-02",
    "slug": "banyo-ds-r786-02",
    "name": "Mat Siyah Kare Formlu Klozet Fırçalığı",
    "brandStyle": "Trendyol Mat Siyah WC Fırçalığı",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 11,
      "depth": 11,
      "height": 40
    },
    "poly": 30142,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r786_02.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r786_02",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "siyah klozet fırçalığı",
      "klozet fırçalığı",
      "tuvalet fırçası",
      "wc fırçası"
    ],
    "surfaceType": "Mat Siyah Gövde",
    "summary": "Mat Siyah Kare Formlu Klozet Fırçalığı — Trendyol Mat Siyah WC Fırçalığı tarzında 1:1 metrik (11×11×40 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r786-03",
    "slug": "banyo-ds-r786-03",
    "name": "Duvara Monte Buzlu Cam & Krom Klozet Fırçalığı",
    "brandStyle": "Artema / Vitra Duvar Tipi WC Fırçalığı",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 9,
      "depth": 11,
      "height": 36,
      "mountHeight": 18
    },
    "poly": 7168,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r786_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r786_03",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "duvara monte klozet fırçalığı",
      "klozet fırçalığı",
      "wc fırçası"
    ],
    "surfaceType": "Parlak Krom + Buzlu Cam",
    "summary": "Duvara Monte Buzlu Cam & Krom Klozet Fırçalığı — Artema / Vitra Duvar Tipi WC Fırçalığı tarzında 1:1 metrik (9×11×36 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r786-05",
    "slug": "banyo-ds-r786-05",
    "name": "İnce Silindirik Paslanmaz Çelik Klozet Fırçalığı",
    "brandStyle": "İnox Banyo Klozet Fırçalığı",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 9,
      "depth": 9,
      "height": 42
    },
    "poly": 13034,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r786_05.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r786_05",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "paslanmaz klozet fırçalığı",
      "klozet fırçalığı",
      "wc fırçası"
    ],
    "surfaceType": "Fırçalı 304 Çelik",
    "summary": "İnce Silindirik Paslanmaz Çelik Klozet Fırçalığı — İnox Banyo Klozet Fırçalığı tarzında 1:1 metrik (9×9×42 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r786-07",
    "slug": "banyo-ds-r786-07",
    "name": "Rose Gold & Mermer Detaylı Klozet Fırçalığı",
    "brandStyle": "Lüks Rose Gold Banyo Aksesuarı",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 10,
      "depth": 10,
      "height": 40
    },
    "poly": 8444,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r786_07.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r786_07",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "rose gold klozet fırçalığı",
      "klozet fırçalığı",
      "wc fırçası"
    ],
    "surfaceType": "Rose Gold Metal + Mermer Görünüm",
    "summary": "Rose Gold & Mermer Detaylı Klozet Fırçalığı — Lüks Rose Gold Banyo Aksesuarı tarzında 1:1 metrik (10×10×40 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r786-10",
    "slug": "banyo-ds-r786-10",
    "name": "Kağıtlık & Klozet Fırçalık İkili Ayaklı Banyo Standı",
    "brandStyle": "İkili WC Standı (Kağıtlık + Fırça)",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 20,
      "depth": 15,
      "height": 70
    },
    "poly": 7184,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r786_10.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r786_10",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "ikili wc standı",
      "ayaklı kağıtlık fırçalık",
      "klozet fırçalığı",
      "tuvalet kağıdı askısı"
    ],
    "surfaceType": "Fırçalı Nikel Çelik",
    "summary": "Kağıtlık & Klozet Fırçalık İkili Ayaklı Banyo Standı — İkili WC Standı (Kağıtlık + Fırça) tarzında 1:1 metrik (20×15×70 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-sim-furniture-trashbin-lid-a01",
    "slug": "banyo-sim-furniture-trashbin-lid-a01",
    "name": "Kapaklı Modern Banyo Çöp Kovası",
    "brandStyle": "Modern Banyo Çöp Kovası",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 22,
      "depth": 22,
      "height": 30
    },
    "poly": 28840,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/furniture_trashBin_lid_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/furniture_trashBin_lid_a01",
    "provider": "hf",
    "license": "CC-BY-4.0 · NVIDIA SimReady",
    "keywords": [
      "banyo çöp kovası",
      "çöp kovası",
      "pedallı çöp kovası",
      "wc çöp kovası"
    ],
    "surfaceType": "Fırçalı Metal / Mat Gövde",
    "summary": "Kapaklı Modern Banyo Çöp Kovası — yüksek poligonlu (29k tri) stüdyo taranmış PBR 3D banyo modeli. 1:1 metrik ölçü (22×22×30 cm) ve Blender uyumlu."
  },
  {
    "id": "bath-sim-fixture-trashbin-wallmounted-a01",
    "slug": "banyo-sim-fixture-trashbin-wallmounted-a01",
    "name": "Duvara Monte Paslanmaz Çelik WC Çöp Kovası",
    "brandStyle": "Otel & Ticari Duvar Çöp Kovası",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 28,
      "depth": 16,
      "height": 42,
      "mountHeight": 35
    },
    "poly": 7518,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/fixture_trashBin_wallMounted_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/fixture_trashBin_wallMounted_a01",
    "provider": "hf",
    "license": "CC-BY-4.0 · NVIDIA SimReady",
    "keywords": [
      "duvar çöp kovası",
      "banyo çöp kovası",
      "çöp kovası"
    ],
    "surfaceType": "Fırçalı Paslanmaz Çelik",
    "summary": "Duvara Monte Paslanmaz Çelik WC Çöp Kovası — yüksek poligonlu (8k tri) stüdyo taranmış PBR 3D banyo modeli. 1:1 metrik ölçü (28×16×42 cm) ve Blender uyumlu."
  },
  {
    "id": "bath-uc-ds-r255-01",
    "slug": "banyo-ds-r255-01",
    "name": "5 Litre Pedallı Paslanmaz Banyo Çöp Kovası",
    "brandStyle": "Trendyol Pedallı Banyo Çöp Kovası",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 20,
      "depth": 24,
      "height": 29
    },
    "poly": 9528,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r255_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r255_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "pedallı çöp kovası",
      "banyo çöp kovası",
      "çöp kovası",
      "wc çöp kovası"
    ],
    "surfaceType": "Paslanmaz Çelik / Mat Siyah",
    "summary": "5 Litre Pedallı Paslanmaz Banyo Çöp Kovası — Trendyol Pedallı Banyo Çöp Kovası tarzında 1:1 metrik (20×24×29 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r255-03",
    "slug": "banyo-ds-r255-03",
    "name": "Sensörlü Mat Siyah Modern Banyo Çöp Kovası",
    "brandStyle": "Akıllı Sensörlü Banyo Kovası",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 22,
      "depth": 22,
      "height": 32
    },
    "poly": 41544,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r255_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r255_03",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "sensörlü çöp kovası",
      "siyah çöp kovası",
      "banyo çöp kovası",
      "çöp kovası"
    ],
    "surfaceType": "Mat Siyah Çelik",
    "summary": "Sensörlü Mat Siyah Modern Banyo Çöp Kovası — Akıllı Sensörlü Banyo Kovası tarzında 1:1 metrik (22×22×32 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r256-04",
    "slug": "banyo-ds-r256-04",
    "name": "Doğal Ahşap Çıtalı Kapaklı Çamaşır Sepeti",
    "brandStyle": "Bambu / Ahşap Çamaşır Sepeti",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "vanity",
    "dims": {
      "width": 42,
      "depth": 34,
      "height": 60
    },
    "poly": 800,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r256_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r256_04",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "çamaşır sepeti",
      "kirli çamaşır sepeti",
      "ahşap çamaşır sepeti",
      "banyo sepeti"
    ],
    "surfaceType": "Doğal Ahşap Çıta + Kumaş Astar",
    "summary": "Doğal Ahşap Çıtalı Kapaklı Çamaşır Sepeti — Bambu / Ahşap Çamaşır Sepeti tarzında 1:1 metrik (42×34×60 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r256-09",
    "slug": "banyo-ds-r256-09",
    "name": "Hasır Rattan Örgü Kapaklı Kirli Çamaşır Sepeti",
    "brandStyle": "Rattan Banyo Çamaşır Sepeti",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "vanity",
    "dims": {
      "width": 40,
      "depth": 40,
      "height": 65
    },
    "poly": 1000,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r256_09.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r256_09",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "rattan çamaşır sepeti",
      "hasır çamaşır sepeti",
      "çamaşır sepeti",
      "banyo sepeti"
    ],
    "surfaceType": "Doğal Bal Rengi Rattan Örgü",
    "summary": "Hasır Rattan Örgü Kapaklı Kirli Çamaşır Sepeti — Rattan Banyo Çamaşır Sepeti tarzında 1:1 metrik (40×40×65 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r256-08",
    "slug": "banyo-ds-r256-08",
    "name": "3 Bölmeli Siyah Metal Çerçeveli Çamaşır Ayrıştırıcı",
    "brandStyle": "Çamaşır Odası Ayrıştırıcı Sepet",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 70,
      "depth": 35,
      "height": 65
    },
    "poly": 13408,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r256_08.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r256_08",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "üç bölmeli çamaşır sepeti",
      "çamaşır sepeti",
      "çamaşır odası"
    ],
    "surfaceType": "Mat Siyah Çelik + Bez Torba",
    "summary": "3 Bölmeli Siyah Metal Çerçeveli Çamaşır Ayrıştırıcı — Çamaşır Odası Ayrıştırıcı Sepet tarzında 1:1 metrik (70×35×65 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r244-01",
    "slug": "banyo-ds-r244-01",
    "name": "Ön Yüklemeli Modern Çamaşır Makinesi (60×60×85)",
    "brandStyle": "Arçelik / Bosch Çamaşır Makinesi",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 60,
      "depth": 60,
      "height": 85
    },
    "poly": 23664,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r244_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r244_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "çamaşır makinesi",
      "banyo beyaz eşya",
      "çamaşır odası"
    ],
    "surfaceType": "Parlak Beyaz Emaye + Cam Kapak",
    "summary": "Ön Yüklemeli Modern Çamaşır Makinesi (60×60×85) — Arçelik / Bosch Çamaşır Makinesi tarzında 1:1 metrik (60×60×85 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r245-01",
    "slug": "banyo-ds-r245-01",
    "name": "Isı Pompalı Modern Çamaşır Kurutma Makinesi (60×60×85)",
    "brandStyle": "Bosch / Arçelik Kurutma Makinesi",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 60,
      "depth": 60,
      "height": 85
    },
    "poly": 113606,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r245_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r245_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "kurutma makinesi",
      "çamaşır kurutma",
      "çamaşır odası",
      "banyo"
    ],
    "surfaceType": "Parlak Beyaz / Antrasit Emaye",
    "summary": "Isı Pompalı Modern Çamaşır Kurutma Makinesi (60×60×85) — Bosch / Arçelik Kurutma Makinesi tarzında 1:1 metrik (60×60×85 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r245-04",
    "slug": "banyo-ds-r245-04",
    "name": "Üst Üste Çamaşır & Kurutma Makinesi Kulesi",
    "brandStyle": "Çamaşır Odası İkili Kule",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "ceramic",
    "dims": {
      "width": 60,
      "depth": 62,
      "height": 172
    },
    "poly": 87622,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r245_04.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r245_04",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "çamaşır kurutma kulesi",
      "çamaşır makinesi",
      "kurutma makinesi",
      "banyo"
    ],
    "surfaceType": "Beyaz Emaye + Siyah Cam Kapaklar",
    "summary": "Üst Üste Çamaşır & Kurutma Makinesi Kulesi — Çamaşır Odası İkili Kule tarzında 1:1 metrik (60×62×172 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r783-01",
    "slug": "banyo-ds-r783-01",
    "name": "Tik Ağacı Suya Dayanıklı Spa Duş İçi Bankı",
    "brandStyle": "Lüks Villa Spa Duş Oturağı",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "vanity",
    "dims": {
      "width": 50,
      "depth": 48,
      "height": 80
    },
    "poly": 108528,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r783_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r783_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "duş bankı",
      "tik duş oturağı",
      "spa banyo taburesi",
      "banyo bankı"
    ],
    "surfaceType": "Doğal Tik Ağacı (Teak)",
    "summary": "Tik Ağacı Suya Dayanıklı Spa Duş İçi Bankı — Lüks Villa Spa Duş Oturağı tarzında 1:1 metrik (50×48×80 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r785-10",
    "slug": "banyo-ds-r785-10",
    "name": "Mat Siyah Duvara Monte Katlanır Duş Oturağı",
    "brandStyle": "Katlanır Duş İçi Oturak",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 42,
      "depth": 36,
      "height": 8,
      "mountHeight": 45
    },
    "poly": 1524,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r785_10.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r785_10",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "duş oturağı",
      "katlanır duş oturağı",
      "duş içi koltuk",
      "banyo"
    ],
    "surfaceType": "Mat Siyah Alüminyum",
    "summary": "Mat Siyah Duvara Monte Katlanır Duş Oturağı — Katlanır Duş İçi Oturak tarzında 1:1 metrik (42×36×8 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r784-01",
    "slug": "banyo-ds-r784-01",
    "name": "Paslanmaz Çelik Duvara Monte Banyo Tutunma Barı (45 cm)",
    "brandStyle": "Banyo Güvenlik Tutunma Barı",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 45,
      "depth": 8,
      "height": 6,
      "mountHeight": 85
    },
    "poly": 136944,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r784_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r784_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "tutunma barı",
      "banyo tutamağı",
      "engelli banyo barı",
      "duş tutamağı"
    ],
    "surfaceType": "Parlak / Fırçalı 304 Paslanmaz",
    "summary": "Paslanmaz Çelik Duvara Monte Banyo Tutunma Barı (45 cm) — Banyo Güvenlik Tutunma Barı tarzında 1:1 metrik (45×8×6 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r237-01",
    "slug": "banyo-ds-r237-01",
    "name": "Temperli Cam Dijital Banyo Baskülü / Tartısı",
    "brandStyle": "Dijital Banyo Baskülü",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 30,
      "depth": 30,
      "height": 3
    },
    "poly": 3146,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r237_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r237_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "banyo baskülü",
      "baskül",
      "tartı",
      "banyo aksesuarı"
    ],
    "surfaceType": "Temperli Cam + Alüminyum",
    "summary": "Temperli Cam Dijital Banyo Baskülü / Tartısı — Dijital Banyo Baskülü tarzında 1:1 metrik (30×30×3 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r240-03",
    "slug": "banyo-ds-r240-03",
    "name": "Otel Tipi Duvara Monte Banyo Saç Kurutma Makinesi",
    "brandStyle": "Otel Banyosu Saç Kurutma",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "wall-mounted",
    "palette": "ceramic",
    "dims": {
      "width": 16,
      "depth": 12,
      "height": 24,
      "mountHeight": 130
    },
    "poly": 4218,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r240_03.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r240_03",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "saç kurutma makinesi",
      "otel saç kurutma",
      "fön makinesi",
      "banyo"
    ],
    "surfaceType": "Parlak Beyaz ABS",
    "summary": "Otel Tipi Duvara Monte Banyo Saç Kurutma Makinesi — Otel Banyosu Saç Kurutma tarzında 1:1 metrik (16×12×24 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r787-01",
    "slug": "banyo-ds-r787-01",
    "name": "Duvara Monte Paslanmaz Çelik El Kurutma Makinesi",
    "brandStyle": "Ticari WC El Kurutma Makinesi",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 28,
      "depth": 16,
      "height": 24,
      "mountHeight": 115
    },
    "poly": 29028,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r787_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r787_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "el kurutma makinesi",
      "wc el kurutma",
      "banyo"
    ],
    "surfaceType": "Fırçalı Paslanmaz Çelik",
    "summary": "Duvara Monte Paslanmaz Çelik El Kurutma Makinesi — Ticari WC El Kurutma Makinesi tarzında 1:1 metrik (28×16×24 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-uc-ds-r788-01",
    "slug": "banyo-ds-r788-01",
    "name": "Duvara Monte Z-Katlama Kağıt Havlu Dispenseri",
    "brandStyle": "Ticari WC Kağıt Havlu Dispenseri",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "wall-mounted",
    "palette": "metal",
    "dims": {
      "width": 30,
      "depth": 12,
      "height": 40,
      "mountHeight": 130
    },
    "poly": 4908,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/usdcraft-glb/resolve/main/thumbs/ds_r788_01.webp",
    "gltfUrl": "/api/v1/hf/glb/usdcraft-glb/ds_r788_01",
    "provider": "hf",
    "license": "Apache-2.0 · NVIDIA USDCraft",
    "keywords": [
      "kağıt havlu dispenseri",
      "havlu dispenseri",
      "wc aksesuar"
    ],
    "surfaceType": "Fırçalı Paslanmaz Çelik",
    "summary": "Duvara Monte Z-Katlama Kağıt Havlu Dispenseri — Ticari WC Kağıt Havlu Dispenseri tarzında 1:1 metrik (30×12×40 cm) hazır PBR banyo 3D modeli. Blender Cycles/EEVEE ve yapay zeka sahne yerleşimine hazır."
  },
  {
    "id": "bath-sim-drainage-a01",
    "slug": "banyo-sim-drainage-a01",
    "name": "Paslanmaz Çelik Kare Banyo Yer Süzgeci (15×15)",
    "brandStyle": "Duş İçi Yer Süzgeci / Gider",
    "subCategory": "Aksesuar & Çamaşır",
    "placement": "floor",
    "palette": "metal",
    "dims": {
      "width": 15,
      "depth": 15,
      "height": 3
    },
    "poly": 87560,
    "thumbUrl": "https://huggingface.co/datasets/codepawl/simready-glb/resolve/main/thumbs/drainage_a01.webp",
    "gltfUrl": "/api/v1/hf/glb/simready-glb/drainage_a01",
    "provider": "hf",
    "license": "CC-BY-4.0 · NVIDIA SimReady",
    "keywords": [
      "banyo yer süzgeci",
      "duş süzgeci",
      "banyo gideri",
      "süzgeç"
    ],
    "surfaceType": "304 Paslanmaz Çelik",
    "summary": "Paslanmaz Çelik Kare Banyo Yer Süzgeci (15×15) — yüksek poligonlu (88k tri) stüdyo taranmış PBR 3D banyo modeli. 1:1 metrik ölçü (15×15×3 cm) ve Blender uyumlu."
  }
];

export const BATHROOM_CATALOG_ASSETS: ArchitecturalAsset[] = BATH_SEEDS.map((s) => {
  const finishes = BATH_FINISH_PALETTES[s.palette];
  const patterns = s.palette === 'rug' ? BATH_RUG_PATTERNS : BATH_PATTERNS;
  const { width, depth, height } = s.dims;
  const isMetal = s.palette === 'metal' || s.palette === 'shower';

  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    brandStyle: s.brandStyle,
    category: 'Banyo',
    subCategory: s.subCategory,
    archetype: 'external_gltf',
    placement: s.placement,
    dimensionsCm: s.dims,
    polyEstimate: s.poly,
    renderEngines: ['Cycles', 'EEVEE'],
    uvUnwrapped: true,
    thumbnailUrl: s.thumbUrl,
    searchKeywords: [
      ...s.keywords,
      'banyo',
      'banyo malzemesi',
      s.subCategory.toLowerCase(),
      'hazır 3d model',
      'blender',
    ],
    roomTags: ['modern banyo', 'villa banyo', 'ebeveyn banyosu', 'misafir wc'],
    aiSummary: s.summary,
    finishes,
    defaultFinishId: 'orijinal-pbr',
    patterns,
    defaultPatternId: 'original_pbr',
    modelingSpec: {
      geometryBreakdown: [
        `Gerçek 1:1 metrik ölçüler: ${width} cm genişlik × ${depth} cm derinlik × ${height} cm yükseklik.`,
        `Hazır 3D Model (${s.license}): Temiz topoloji, ~${s.poly.toLocaleString('tr-TR')} üçgen poligon, UV açılımlı ve doğrudan Blender uyumlu .GLB.`,
        s.placement === 'wall-mounted' && s.dims.mountHeight
          ? `Duvara montaj referans kotu: Yerden +${s.dims.mountHeight} cm (Türkiye iç mimari tesisat standardı).`
          : 'Zemin sıfır kotuna (Z=0.00 m) hizalı merkez pivotlu yerleşim.',
      ],
      textureAndMaps: {
        surfaceType: s.surfaceType,
        uvTileCm: 'Orijinal 1:1 PBR UV Layout (Embedded glTF 2.0)',
        bumpDepthMm: isMetal ? '0.2 – 0.8 mm (Mikro Fırça / PVD)' : s.palette === 'rug' ? '3.0 – 8.0 mm (Hav & Dokuma)' : '0.4 – 1.5 mm (Sır / Ahşap Damar)',
        roughnessRange: isMetal ? '0.08 – 0.42 (Metalik / Mat Siyah)' : s.palette === 'ceramic' ? '0.08 – 0.46 (Parlak / Mat Porselen)' : s.palette === 'rug' ? '0.84 – 0.94 (Mat Tekstil)' : '0.36 – 0.56',
        shaderRecipe: isMetal
          ? 'Principled BSDF: Metallic 0.72–0.98 (Parlak Krom için R=0.08, Mat Siyah için R=0.42, Fırçalı Gold için #D4AF5A R=0.24). Anisotropic 0.35 ile gerçekçi fırça izi verin.'
          : s.palette === 'ceramic'
            ? 'Principled BSDF: Coat Weight 0.65, Coat Roughness 0.06, IOR 1.52 ile vitrifiye porselen sır derinliği elde edin.'
            : 'Principled BSDF: Orijinal gömülü glTF 2.0 Base Color, Normal ve Roughness haritalarını AgX renk yönetiminde kullanın.',
      },
      microDetails: [
        'Katalog görseli ile 3D model birebir aynı hazır .GLB kaynağından üretilmiştir (%100 form tutarlılığı).',
        '3D İnceleme Stüdyosunda Parlak Krom, Mat Siyah, Fırçalı Gold, Gunmetal veya Özel RAL/HEX renklerine canlı geçiş yapılabilir.',
        'Cam duşakabin ve aynalarda saydam/yansıtıcı yüzeyler korunarak yalnızca metal profiller renklendirilir.',
      ],
      blenderModifiers: [
        'Hazır 3D .GLB dosyası olduğu için ek modelleme gerekmez; bpy betiği modeli 1:1 ölçekte otomatik içe aktarır.',
        'Yakın plan banyo renderlarında Cycles Caustics / Light Path Glossy bounces ≥ 6 önerilir.',
      ],
      lightingAndCameraTip:
        'Banyo renderlarında ayna üstü 3000K sıcak Lineer Area Light + tavan 4000K nötr dolgu ışığı ve mermer/seramik yüzeylerde düşük Roughness yansımaları kullanın.',
      aiRenderPrompt: `Photorealistic Blender Cycles luxury Turkish bathroom architectural render featuring ${s.name} (${s.brandStyle}), exact metric dimensions ${width}x${depth}x${height}cm, authentic ${s.surfaceType}, travertine and Calacatta marble bathroom tiles, warm 3000K architectural cove lighting, crisp reflections, 35mm architectural lens, 8k.`,
      aiBlenderMasterPrompt: `Blender 4.x banyo sahnesine "${s.name}" hazır .GLB 3D modelini (1:1 metrik ${width}x${depth}x${height} cm) içe aktar. "Banyo_${s.subCategory}" koleksiyonuna yerleştir, seçili kaplama rengi/roughness/metalness değerlerini Principled BSDF'ye uygula ve Cycles GPU AgX ile fotogerçekçi banyo renderı al.`,
    },
    modelSource: {
      provider: s.provider,
      gltfUrl: s.gltfUrl,
      license: s.license,
    },
    sourceOrigin: 'bath-ready',
  };
});
