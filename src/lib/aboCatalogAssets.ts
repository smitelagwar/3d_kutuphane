import type {
  ArchitecturalAsset,
  AssetCategory,
  AssetDimensionsCm,
  AssetModelingSpec,
  MaterialFinish,
  PatternVariant,
  PlacementType,
} from "./catalogTypes";

const ABO_PBR_PATTERNS: PatternVariant[] = [
  {
    id: "original_pbr",
    label: "Orijinal PBR Doku",
    description: "Modelin kendi stüdyo taranmış Diffuse + Normal + Roughness/AO haritaları (değiştirilmemiş).",
    bumpScale: 1.0,
    roughnessDelta: 0.0,
  },
  {
    id: "velvet_matte",
    label: "Ekstra Mat Yüzey",
    description: "Yansıma parıltısını düşürerek yumuşak iç mekan gün ışığına uyarlanmış mat roughness profili.",
    bumpScale: 1.15,
    roughnessDelta: 0.16,
  },
  {
    id: "satin_brushed",
    label: "Saten / Hafif Parlak",
    description: "Vernikli ahşap, mermer, cilalı deri veya saten metal vurgusu için pürüzlülüğü azaltılmış profil.",
    bumpScale: 0.9,
    roughnessDelta: -0.18,
  },
];

function buildAboModelingSpec(params: {
  name: string;
  brandStyle: string;
  category: AssetCategory;
  dimensionsCm: AssetDimensionsCm;
  primaryHex: string;
  surfaceType: string;
  mid: string;
}): AssetModelingSpec {
  const { width, depth, height } = params.dimensionsCm;
  return {
    geometryBreakdown: [
      `Gerçek 1:1 metrik ölçüler: ${width} cm genişlik × ${depth} cm derinlik × ${height} cm yükseklik.`,
      `Kaynak: Amazon Berkeley Objects CC BY 4.0 (${params.mid}.glb) — temiz UV açılımı, gömülü 2K PBR haritalı ve zemin sıfır noktası (Z=0) pivotlu hazır mesh.`,
      `Blender Cycles & EEVEE ile anında render alınacak şekilde optimize edilmiş gerçek ticari mobilya geometrisi.`,
    ],
    textureAndMaps: {
      surfaceType: params.surfaceType,
      uvTileCm: "Orijinal 1:1 UV Layout (Gömülü PBR Diffuse + Normal + Roughness/Metallic)",
      bumpDepthMm: "1.0 – 3.5 mm (OpenGL Normal Map)",
      roughnessRange: params.category === "Banyo" ? "0.06 – 0.25" : "0.28 – 0.88",
      shaderRecipe:
        "Principled BSDF: .GLB içindeki gömülü Base Color, Metallic-Roughness ve Normal haritaları Blender glTF 2.0 içe aktarıcısıyla otomatik bağlanır.",
    },
    microDetails: [
      "Görsel önizleme ile 3D model birebir aynı ticari ürün kaynağından alınmıştır (%100 form, malzeme ve oran tutarlılığı).",
      "Kırık veya ters normal içermez; köşe pahları, dikiş/kumaş kıvrımları ve ayak birleşimleri gerçektir.",
      "İnegöl / modern Türkiye iç mimari sahnelerinde 1:1 metrik ölçekte doğrudan kullanılabilir.",
    ],
    blenderModifiers: [
      "Hazır .GLB mesh olduğu için ek modelleme gerekmez; yakın plan çekimlerde opsiyonel WeightedNormal eklenebilir.",
      "Çoklu yerleşimlerde (sandalye, zigon, abajur) RAM tasarrufu için Alt+D (Linked Duplicate) kullanın.",
    ],
    lightingAndCameraTip:
      "Modern iç mekan sunumlarında 45° yandan gelen doğal gün ışığı (Sky Texture Nishita / Area Light) ve 35–50 mm lens kullanın; mermer, pirinç ve dokuma kumaş haritaları yan ışıkta maksimum gerçekçilik verir.",
    aiRenderPrompt: `Photorealistic Blender Cycles modern Turkish interior visualization (İnegöl modern furniture aesthetic) featuring ${params.name} (${params.brandStyle}), exact dimensions ${width}x${depth}x${height}cm, authentic ${params.surfaceType} textures, primary tone ${params.primaryHex}, soft natural daylight, crisp contact shadows, architectural interior photography, 50mm lens, 8k.`,
    aiBlenderMasterPrompt: `Blender 4.x sahnesine "${params.name}" hazır 3D .GLB modelini (1:1 metrik ${width}x${depth}x${height} cm) glTF 2.0 olarak içe aktar. Zemin sıfır noktasına (Z=0) oturt, gömülü Principled BSDF PBR haritalarını koru, "${params.category}" koleksiyonuna yerleştir ve Cycles GPU (AgX) ile mimari render al.`,
  };
}

interface AboCuratedDef {
  mid: string;
  glbPath: string;
  imgPath: string;
  slug: string;
  name: string;
  brandStyle: string;
  category: AssetCategory;
  placement: PlacementType;
  dimensionsCm: AssetDimensionsCm;
  polyEstimate: number;
  materialKind: MaterialFinish["materialKind"];
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
  searchKeywords: string[];
  enRef: string;
}

function makeAboFinishes(def: AboCuratedDef): MaterialFinish[] {
  const baseRough =
    def.materialKind === "glass"
      ? 0.08
      : def.materialKind === "metal"
        ? 0.28
        : def.materialKind === "stone" || def.materialKind === "ceramic"
          ? 0.22
          : def.materialKind === "wood"
            ? 0.44
            : def.materialKind === "rug"
              ? 0.92
              : 0.82;
  const baseMetal = def.materialKind === "metal" ? 0.85 : 0.04;

  return [
    {
      id: "orijinal-pbr",
      label: "Orijinal Stüdyo PBR",
      materialKind: def.materialKind,
      primaryHex: def.primaryHex,
      secondaryHex: def.secondaryHex,
      accentHex: def.accentHex,
      roughness: baseRough,
      metalness: baseMetal,
      preserveOriginalTextures: true,
    },
    {
      id: "sicak-krem-ton",
      label: "Sıcak Krem / Bej",
      materialKind: def.materialKind,
      primaryHex: "#EAE3D7",
      secondaryHex: "#C5B8A5",
      accentHex: "#B89A67",
      roughness: Math.min(0.92, baseRough + 0.04),
      metalness: Math.max(0, baseMetal - 0.05),
    },
    {
      id: "vizon-ceviz-ton",
      label: "Vizon / Ceviz",
      materialKind: def.materialKind,
      primaryHex: "#9C8977",
      secondaryHex: "#6E523B",
      accentHex: "#C5A059",
      roughness: baseRough,
      metalness: baseMetal,
    },
    {
      id: "mat-antrasit-ton",
      label: "Mat Antrasit",
      materialKind: def.materialKind,
      primaryHex: "#3F434B",
      secondaryHex: "#262930",
      accentHex: "#C5A059",
      roughness: Math.max(0.22, baseRough - 0.04),
      metalness: Math.min(0.88, baseMetal + 0.06),
    },
  ];
}

function surfaceLabelFor(kind: MaterialFinish["materialKind"]): string {
  switch (kind) {
    case "stone":
      return "Doğal Mermer / Taş & Metal Konstrüksiyon (2K PBR)";
    case "wood":
      return "Ceviz / Meşe Ahşap Kaplama & Mimari Metal Detay (PBR)";
    case "metal":
      return "Fırçalı Pirinç / Elektrostatik Mat Metal (PBR)";
    case "glass":
      return "Optik Cam / Ayna & Metal Çerçeve (PBR)";
    case "ceramic":
      return "Sırlı Seramik / Stoneware Mimari Obje (PBR)";
    case "rug":
      return "Dokuma Yün-Pamuk Modern Halı (PBR)";
    case "linen":
      return "Doğal Keten Dokuma Döşeme & Ahşap Ayak (PBR)";
    default:
      return "Stüdyo Dokulu Kumaş / Kadife Döşeme (PBR)";
  }
}

function roomTagsFor(cat: AssetCategory): string[] {
  switch (cat) {
    case "Salon":
      return ["modern salon", "villa salonu", "inegöl modern", "oturma odası"];
    case "Yemek & Mutfak":
      return ["yemek odası", "modern mutfak", "villa mutfak", "çalışma odası"];
    case "Banyo":
      return ["modern banyo", "ebeveyn banyosu", "villa banyo"];
    case "Aydınlatma":
      return ["modern salon", "yemek odası", "yatak odası", "villa aydınlatma"];
    case "Dış Cephe":
      return ["villa dış cephe", "teras", "bahçe girişi"];
    default:
      return ["modern salon", "antre", "konsol dekoru", "villa iç mekan"];
  }
}

function buildAboAsset(def: AboCuratedDef): ArchitecturalAsset {
  const surfaceType = surfaceLabelFor(def.materialKind);
  return {
    id: `abo-${def.mid.toLowerCase()}`,
    slug: def.slug,
    name: def.name,
    brandStyle: `${def.brandStyle} · Stüdyo GLB`,
    category: def.category,
    archetype: "external_gltf",
    placement: def.placement,
    dimensionsCm: def.dimensionsCm,
    polyEstimate: def.polyEstimate,
    renderEngines: ["Cycles", "EEVEE"],
    uvUnwrapped: true,
    thumbnailUrl: `https://amazon-berkeley-objects.s3.amazonaws.com/images/original/${def.imgPath.trim()}`,
    searchKeywords: [
      ...def.searchKeywords,
      "modern mobilya",
      "hazır 3d model",
      "glb",
      "blender",
      "inegöl",
    ],
    roomTags: roomTagsFor(def.category),
    aiSummary: `Hazır stüdyo PBR .GLB 3D modeli (${def.dimensionsCm.width}×${def.dimensionsCm.depth}×${def.dimensionsCm.height} cm): ${def.name}. Görsel önizlemesi ile 3D geometrisi birebir aynı ürün kaynağından alınmıştır (Referans: ${def.enRef}).`,
    defaultFinishId: "orijinal-pbr",
    finishes: makeAboFinishes(def),
    defaultPatternId: "original_pbr",
    patterns: ABO_PBR_PATTERNS,
    modelingSpec: buildAboModelingSpec({
      name: def.name,
      brandStyle: def.brandStyle,
      category: def.category,
      dimensionsCm: def.dimensionsCm,
      primaryHex: def.primaryHex,
      surfaceType,
      mid: def.mid,
    }),
    modelSource: {
      provider: "abo",
      gltfUrl: `/api/v1/abo/glb/${def.glbPath}`,
      license: "CC BY 4.0 (ABO Studio GLB)",
      frontRotationYDeg: 0,
    },
    sourceOrigin: "abo-modern",
  };
}

const CURATED_ABO_DEFS: AboCuratedDef[] = [
  {
    "mid": "B07BWJCPPP",
    "glbPath": "P/B07BWJCPPP.glb",
    "imgPath": "ce/cee2fae8.jpg\r",
    "slug": "andover-genis-modern-l-kose-koltuk-320-cm",
    "name": "Andover Geniş Modern L Köşe Koltuk (320 cm)",
    "brandStyle": "İnegöl Modern / Uzanmalı Köşe Takımı",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 320,
      "depth": 150,
      "height": 88
    },
    "polyEstimate": 23124,
    "materialKind": "fabric",
    "primaryHex": "#8C8F94",
    "secondaryHex": "#52565E",
    "accentHex": "#2E3138",
    "searchKeywords": [
      "köşe koltuk",
      "L koltuk",
      "inegöl koltuk",
      "modern koltuk",
      "gri koltuk",
      "villa salon"
    ],
    "enRef": "Stone & Beam Andover Modern Left Chaise Sofa Sectional, 126\"W, Grey"
  },
  {
    "mid": "B07HZ751KR",
    "glbPath": "R/B07HZ751KR.glb",
    "imgPath": "03/03c9c45a.jpg\r",
    "slug": "goodwin-acik-gri-modern-l-kose-koltuk-223-cm",
    "name": "Goodwin Açık Gri Modern L Köşe Koltuk (223 cm)",
    "brandStyle": "İnegöl Modern / Kompakt L Koltuk",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 223,
      "depth": 150,
      "height": 96
    },
    "polyEstimate": 48684,
    "materialKind": "fabric",
    "primaryHex": "#C7C9CC",
    "secondaryHex": "#8E9196",
    "accentHex": "#4A3A2E",
    "searchKeywords": [
      "köşe koltuk",
      "L koltuk",
      "açık gri koltuk",
      "inegöl mobilya",
      "apartman salonu"
    ],
    "enRef": "Rivet Goodwin Modern Sectional Sofa, 88.6\"W, Light Grey"
  },
  {
    "mid": "B07HZ5RM1P",
    "glbPath": "P/B07HZ5RM1P.glb",
    "imgPath": "ec/ec1ac2ee.jpg\r",
    "slug": "blaine-yumusak-minderli-l-kose-koltuk-232-cm",
    "name": "Blaine Yumuşak Minderli L Köşe Koltuk (232 cm)",
    "brandStyle": "Çağdaş Villa / Geniş Oturumlu Köşe",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 232,
      "depth": 186,
      "height": 108
    },
    "polyEstimate": 51771,
    "materialKind": "fabric",
    "primaryHex": "#D0D2D4",
    "secondaryHex": "#95989E",
    "accentHex": "#5C4738",
    "searchKeywords": [
      "köşe koltuk",
      "L koltuk",
      "modern kanepe",
      "salon takımı",
      "inegöl"
    ],
    "enRef": "Stone & Beam Blaine Modern Sectional Sofa, 79.5\"W, Light Grey"
  },
  {
    "mid": "B07HZ6GJ5J",
    "glbPath": "J/B07HZ6GJ5J.glb",
    "imgPath": "f7/f7723445.jpg\r",
    "slug": "kristin-indigo-lacivert-uzanmali-kose-koltuk-257-cm",
    "name": "Kristin İndigo Lacivert Uzanmalı Köşe Koltuk (257 cm)",
    "brandStyle": "Modern Butik / Şezlonglu Köşe",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 257,
      "depth": 178,
      "height": 106
    },
    "polyEstimate": 64639,
    "materialKind": "fabric",
    "primaryHex": "#2B3B54",
    "secondaryHex": "#1C283B",
    "accentHex": "#C29E60",
    "searchKeywords": [
      "lacivert koltuk",
      "köşe koltuk",
      "L koltuk",
      "modern salon",
      "şezlonglu koltuk"
    ],
    "enRef": "Stone & Beam Kristin Sofa Chaise, 96.5\"W, Indigo"
  },
  {
    "mid": "B071SLGYB3",
    "glbPath": "3/B071SLGYB3.glb",
    "imgPath": "51/515b3f3e.jpg\r",
    "slug": "dalton-kum-beji-modern-moduler-koltuk-209-cm",
    "name": "Dalton Kum Beji Modern Modüler Koltuk (209 cm)",
    "brandStyle": "İnegöl Modern / Kum Beji Keten",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 209,
      "depth": 94,
      "height": 86
    },
    "polyEstimate": 19128,
    "materialKind": "linen",
    "primaryHex": "#D8CEBE",
    "secondaryHex": "#B3A58F",
    "accentHex": "#5C4532",
    "searchKeywords": [
      "bej koltuk",
      "krem koltuk",
      "modern koltuk",
      "keten koltuk",
      "inegöl mobilya"
    ],
    "enRef": "Stone & Beam Dalton Sectional Sofa Couch, 91.5\"W, Sand"
  },
  {
    "mid": "B07HZ6HH61",
    "glbPath": "1/B07HZ6HH61.glb",
    "imgPath": "b7/b7ffbb2f.jpg\r",
    "slug": "dalton-antrasit-uzanmali-l-kose-koltuk-237-cm",
    "name": "Dalton Antrasit Uzanmalı L Köşe Koltuk (237 cm)",
    "brandStyle": "Modern Rezidans / Antrasit Köşe",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 237,
      "depth": 179,
      "height": 97
    },
    "polyEstimate": 60791,
    "materialKind": "fabric",
    "primaryHex": "#45484F",
    "secondaryHex": "#2C2F36",
    "accentHex": "#8C6D4F",
    "searchKeywords": [
      "antrasit koltuk",
      "köşe koltuk",
      "L koltuk",
      "modern kanepe",
      "rezidans"
    ],
    "enRef": "Stone & Beam Dalton Sofa Chaise, 91.5\"W, Charcoal"
  },
  {
    "mid": "B07HZ7X963",
    "glbPath": "3/B07HZ7X963.glb",
    "imgPath": "bd/bd95fd32.jpg\r",
    "slug": "genesse-duman-mavisi-modern-salon-koltugu-234-cm",
    "name": "Genesse Duman Mavisi Modern Salon Koltuğu (234 cm)",
    "brandStyle": "Modern Akdeniz / Geniş Üçlü Koltuk",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 234,
      "depth": 99,
      "height": 93
    },
    "polyEstimate": 28632,
    "materialKind": "fabric",
    "primaryHex": "#6F7F8E",
    "secondaryHex": "#4B5864",
    "accentHex": "#5C4738",
    "searchKeywords": [
      "mavi koltuk",
      "üçlü koltuk",
      "modern koltuk",
      "köşe koltuk",
      "salon"
    ],
    "enRef": "Stone & Beam Genesse Sectional Sofa Couch, 91\"W, Smokey Blue"
  },
  {
    "mid": "B07HZ5PF5S",
    "glbPath": "S/B07HZ5PF5S.glb",
    "imgPath": "52/52a68760.jpg\r",
    "slug": "calhoun-ekru-dokuma-modern-uclu-koltuk-247-cm",
    "name": "Calhoun Ekru Dokuma Modern Üçlü Koltuk (247 cm)",
    "brandStyle": "İnegöl Modern / Ekru Keten Villa Koltuğu",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 247,
      "depth": 101,
      "height": 102
    },
    "polyEstimate": 14368,
    "materialKind": "linen",
    "primaryHex": "#E8E2D5",
    "secondaryHex": "#C7BEAC",
    "accentHex": "#5C4634",
    "searchKeywords": [
      "krem koltuk",
      "ekru koltuk",
      "üçlü koltuk",
      "inegöl koltuk",
      "modern kanepe"
    ],
    "enRef": "Stone & Beam Calhoun Sofa Couch, 91\"W, Ecru"
  },
  {
    "mid": "B07B4DBBPG",
    "glbPath": "G/B07B4DBBPG.glb",
    "imgPath": "7d/7d08f297.jpg\r",
    "slug": "frederick-zumrut-yesili-kapitone-kadife-koltuk-214-cm",
    "name": "Frederick Zümrüt Yeşili Kapitone Kadife Koltuk (214 cm)",
    "brandStyle": "İnegöl Avangart-Modern / Kadife Kanepe",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 214,
      "depth": 90,
      "height": 79
    },
    "polyEstimate": 41046,
    "materialKind": "fabric",
    "primaryHex": "#2A5440",
    "secondaryHex": "#1C3B2C",
    "accentHex": "#6E4B32",
    "searchKeywords": [
      "yeşil koltuk",
      "kadife koltuk",
      "kapitone koltuk",
      "üçlü koltuk",
      "inegöl"
    ],
    "enRef": "Rivet Frederick Mid-Century Modern Tufted Velvet Sofa Couch, 77.5\"W, Forest Green"
  },
  {
    "mid": "B07HYY8ZGY",
    "glbPath": "Y/B07HYY8ZGY.glb",
    "imgPath": "1a/1a22342c.jpg\r",
    "slug": "westcott-sis-gri-genis-villa-koltugu-242-cm",
    "name": "Westcott Sis Gri Geniş Villa Koltuğu (242 cm)",
    "brandStyle": "Çağdaş Minimal / Geniş Salon Kanepesi",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 242,
      "depth": 97,
      "height": 87
    },
    "polyEstimate": 15422,
    "materialKind": "fabric",
    "primaryHex": "#B6B9BE",
    "secondaryHex": "#85888E",
    "accentHex": "#4E3A2B",
    "searchKeywords": [
      "gri koltuk",
      "üçlü koltuk",
      "modern koltuk",
      "villa salon",
      "inegöl mobilya"
    ],
    "enRef": "Stone & Beam Westcott Contemporary 93\" Sofa, Fabric, 93\"W, Haze"
  },
  {
    "mid": "B07HPT2G8F",
    "glbPath": "F/B07HPT2G8F.glb",
    "imgPath": "3a/3aa439dc.jpg\r",
    "slug": "porto-acik-gri-hakiki-deri-modern-koltuk-210-cm",
    "name": "Porto Açık Gri Hakiki Deri Modern Koltuk (210 cm)",
    "brandStyle": "İtalyan & İnegöl / Deri Salon Koltuğu",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 210,
      "depth": 105,
      "height": 93
    },
    "polyEstimate": 18908,
    "materialKind": "fabric",
    "primaryHex": "#C9CBCF",
    "secondaryHex": "#999CA3",
    "accentHex": "#2B2E35",
    "searchKeywords": [
      "deri koltuk",
      "açık gri koltuk",
      "üçlü koltuk",
      "modern kanepe",
      "ofis koltuğu"
    ],
    "enRef": "Alkove Porto Hand-Crafted Leather Sofa, 3 Seater, 97 x 210 x 90cm, Light Grey"
  },
  {
    "mid": "B07B4D86J6",
    "glbPath": "6/B07B4D86J6.glb",
    "imgPath": "93/939beb01.jpg\r",
    "slug": "kaden-baslikli-siyah-deri-modern-koltuk-207-cm",
    "name": "Kaden Başlıklı Siyah Deri Modern Koltuk (207 cm)",
    "brandStyle": "Modern Loft / Ayarlanabilir Başlıklı Deri",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 207,
      "depth": 86,
      "height": 96
    },
    "polyEstimate": 18848,
    "materialKind": "fabric",
    "primaryHex": "#24272C",
    "secondaryHex": "#17191D",
    "accentHex": "#8E939E",
    "searchKeywords": [
      "siyah koltuk",
      "deri koltuk",
      "modern kanepe",
      "loft salon",
      "çalışma odası"
    ],
    "enRef": "Rivet Kaden Mid-Century Modern Adjustable Headrest Leather Loveseat Sofa, 77.5\"W, Black "
  },
  {
    "mid": "B07B4G612M",
    "glbPath": "M/B07B4G612M.glb",
    "imgPath": "59/5906213f.jpg\r",
    "slug": "berkshire-antrasit-mid-century-uclu-koltuk-202-cm",
    "name": "Berkshire Antrasit Mid-Century Üçlü Koltuk (202 cm)",
    "brandStyle": "İnegöl Modern / Ahşap Ayaklı Üçlü",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 202,
      "depth": 81,
      "height": 84
    },
    "polyEstimate": 13406,
    "materialKind": "fabric",
    "primaryHex": "#4C5057",
    "secondaryHex": "#32353B",
    "accentHex": "#7A5438",
    "searchKeywords": [
      "antrasit koltuk",
      "modern koltuk",
      "üçlü kanepe",
      "ahşap ayaklı koltuk",
      "inegöl"
    ],
    "enRef": "Rivet Berkshire Mid-Century Modern Sofa Couch, 82.6\"W, Dark Grey"
  },
  {
    "mid": "B075X4PRNS",
    "glbPath": "S/B075X4PRNS.glb",
    "imgPath": "d9/d98269ae.jpg\r",
    "slug": "uptown-zumrut-kadife-modern-sedir-kanepe-213-cm",
    "name": "Uptown Zümrüt Kadife Modern Sedir & Kanepe (213 cm)",
    "brandStyle": "Minimalist Kadife / Kapitone Daybed",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 213,
      "depth": 82,
      "height": 68
    },
    "polyEstimate": 41186,
    "materialKind": "fabric",
    "primaryHex": "#2D5242",
    "secondaryHex": "#1F3B2F",
    "accentHex": "#6E4B32",
    "searchKeywords": [
      "kadife koltuk",
      "sedir",
      "daybed",
      "yeşil kanepe",
      "modern koltuk"
    ],
    "enRef": "Rivet Uptown Mid-CenturyVelvet Tufted Customizable Daybed Sofa, 78\"W, Hunter Green &amp;"
  },
  {
    "mid": "B071FMSY5M",
    "glbPath": "M/B071FMSY5M.glb",
    "imgPath": "65/650e32ca.jpg\r",
    "slug": "midtown-antrasit-ikili-modern-kanepe-175-cm",
    "name": "Midtown Antrasit İkili Modern Kanepe (175 cm)",
    "brandStyle": "Apartman Salonu / Kompakt İkili Koltuk",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 175,
      "depth": 97,
      "height": 92
    },
    "polyEstimate": 7024,
    "materialKind": "fabric",
    "primaryHex": "#4A4D52",
    "secondaryHex": "#2E3035",
    "accentHex": "#6E4D36",
    "searchKeywords": [
      "ikili koltuk",
      "modern kanepe",
      "antrasit koltuk",
      "apartman mobilyası",
      "inegöl"
    ],
    "enRef": "Rivet Midtown Contemporary Upholstered Loveseat Sofa, 68.5\"W, Charcoal"
  },
  {
    "mid": "B072FVHRZ5",
    "glbPath": "5/B072FVHRZ5.glb",
    "imgPath": "af/afeddea4.jpg\r",
    "slug": "cove-acik-gri-kapitone-sirtli-modern-koltuk-141-cm",
    "name": "Cove Açık Gri Kapitone Sırtlı Modern Koltuk (141 cm)",
    "brandStyle": "İskandinav & İnegöl / Konik Ayaklı İkili",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 141,
      "depth": 84,
      "height": 91
    },
    "polyEstimate": 16770,
    "materialKind": "fabric",
    "primaryHex": "#C5C8CC",
    "secondaryHex": "#919499",
    "accentHex": "#8C6544",
    "searchKeywords": [
      "ikili koltuk",
      "kapitone koltuk",
      "iskandinav koltuk",
      "açık gri kanepe"
    ],
    "enRef": "Rivet Cove Mid-Century Modern Tufted Sofa with Tapered Legs, 72\"W, Light Grey"
  },
  {
    "mid": "B07HZ73RX2",
    "glbPath": "2/B07HZ73RX2.glb",
    "imgPath": "80/80e52001.jpg\r",
    "slug": "dalton-koyu-gri-ikili-oturma-koltugu-153-cm",
    "name": "Dalton Koyu Gri İkili Oturma Koltuğu (153 cm)",
    "brandStyle": "Modern Oturma Odası / İkili Modül",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 153,
      "depth": 97,
      "height": 89
    },
    "polyEstimate": 14964,
    "materialKind": "fabric",
    "primaryHex": "#484B52",
    "secondaryHex": "#303338",
    "accentHex": "#5C4330",
    "searchKeywords": [
      "ikili koltuk",
      "oturma odası",
      "gri kanepe",
      "modern koltuk"
    ],
    "enRef": "Stone & Beam Dalton Loveseat, 63.5\"W, Charcoal"
  },
  {
    "mid": "B072C8Q9S8",
    "glbPath": "8/B072C8Q9S8.glb",
    "imgPath": "89/898e7f8b.jpg\r",
    "slug": "revolve-kot-mavi-yatakli-modern-kanepe-166-cm",
    "name": "Revolve Kot Mavi Yataklı Modern Kanepe (166 cm)",
    "brandStyle": "Fonksiyonel İnegöl / Açılır Yataklı Koltuk",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 166,
      "depth": 100,
      "height": 91
    },
    "polyEstimate": 16340,
    "materialKind": "fabric",
    "primaryHex": "#4C6278",
    "secondaryHex": "#344557",
    "accentHex": "#6E4D35",
    "searchKeywords": [
      "yataklı koltuk",
      "çekyat",
      "mavi kanepe",
      "misafir odası",
      "modern koltuk"
    ],
    "enRef": "Rivet Revolve Modern Upholstered Sofa Bed, 70\"W, Denim Blue"
  },
  {
    "mid": "B07B4NVYM9",
    "glbPath": "9/B07B4NVYM9.glb",
    "imgPath": "04/04c50ddb.jpg\r",
    "slug": "edgewest-bordo-alcak-sirtli-modern-ikili-koltuk-157-cm",
    "name": "Edgewest Bordo Alçak Sırtlı Modern İkili Koltuk (157 cm)",
    "brandStyle": "Butik Salon / Renkli Vurgu Kanepesi",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 157,
      "depth": 86,
      "height": 90
    },
    "polyEstimate": 14625,
    "materialKind": "fabric",
    "primaryHex": "#7D303A",
    "secondaryHex": "#572028",
    "accentHex": "#4A3628",
    "searchKeywords": [
      "bordo koltuk",
      "ikili kanepe",
      "butik koltuk",
      "modern salon"
    ],
    "enRef": "Rivet Edgewest Low Back Modern Loveseat, 65\"W, Rouge Red"
  },
  {
    "mid": "B075ZCLPVG",
    "glbPath": "G/B075ZCLPVG.glb",
    "imgPath": "b6/b60306cb.jpg",
    "slug": "masif-ceviz-siyah-metal-2-li-yuvarlak-zigon-orta-sehpa",
    "name": "Masif Ceviz & Siyah Metal 2’li Yuvarlak Zigon Orta Sehpa",
    "brandStyle": "İnegöl Modern / İkili Yuvarlak Zigon",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 87,
      "depth": 115,
      "height": 52
    },
    "polyEstimate": 22268,
    "materialKind": "wood",
    "primaryHex": "#6E4D35",
    "secondaryHex": "#2A2D34",
    "accentHex": "#9A7452",
    "searchKeywords": [
      "ahşap sehpa",
      "ceviz sehpa",
      "orta sehpa",
      "zigon sehpa",
      "yuvarlak sehpa",
      "inegöl sehpa",
      "modern sehpa"
    ],
    "enRef": "Stone & Beam Wood and Metal Round Nesting Side End Tables, 34\" W, Set of 2, Pine"
  },
  {
    "mid": "B07B7ND7YH",
    "glbPath": "H/B07B7ND7YH.glb",
    "imgPath": "e9/e94e8413.jpg\r",
    "slug": "pirinc-ceviz-2-li-modern-zigon-sehpa-seti",
    "name": "Pirinç & Ceviz 2’li Modern Zigon Sehpa Seti",
    "brandStyle": "İnegöl Lüks / Gold Metal & Ceviz Zigon",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 53,
      "depth": 75,
      "height": 56
    },
    "polyEstimate": 16656,
    "materialKind": "wood",
    "primaryHex": "#7B5438",
    "secondaryHex": "#C5A059",
    "accentHex": "#4E3422",
    "searchKeywords": [
      "zigon sehpa",
      "pirinç sehpa",
      "ceviz sehpa",
      "inegöl sehpa",
      "modern sehpa"
    ],
    "enRef": "Rivet Mid-Century Nesting Metal Side Table, Set of 2, Brass and Walnut"
  },
  {
    "mid": "B07B7J8FV9",
    "glbPath": "9/B07B7J8FV9.glb",
    "imgPath": "7b/7bfc7409.jpg\r",
    "slug": "beyaz-mermer-pirinc-ceviz-rafli-modern-yan-sehpa",
    "name": "Beyaz Mermer, Pirinç & Ceviz Raflı Modern Yan Sehpa",
    "brandStyle": "İnegöl Modern / Mermer & Altın Detay",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 43,
      "depth": 46,
      "height": 49
    },
    "polyEstimate": 12838,
    "materialKind": "stone",
    "primaryHex": "#F1EFEA",
    "secondaryHex": "#C5A059",
    "accentHex": "#7A5438",
    "searchKeywords": [
      "mermer sehpa",
      "yan sehpa",
      "pirinç sehpa",
      "inegöl mobilya",
      "komodin"
    ],
    "enRef": "Rivet Modern White Marble and Wood Double Storage Wood Shelf Side End Table, 21.3\"H, Whi"
  },
  {
    "mid": "B07B7GB7BZ",
    "glbPath": "Z/B07B7GB7BZ.glb",
    "imgPath": "aa/aab3ae06.jpg",
    "slug": "beyaz-mermer-siyah-metal-geometrik-kare-yan-sehpa",
    "name": "Beyaz Mermer & Siyah Metal Geometrik Kare Yan Sehpa",
    "brandStyle": "Modern Minimal / Mermer & Siyah Ayak",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 45,
      "depth": 45,
      "height": 43
    },
    "polyEstimate": 16168,
    "materialKind": "stone",
    "primaryHex": "#F2F0EB",
    "secondaryHex": "#22252A",
    "accentHex": "#D1CEC7",
    "searchKeywords": [
      "mermer sehpa",
      "kare sehpa",
      "yan sehpa",
      "siyah metal sehpa",
      "inegöl sehpa"
    ],
    "enRef": "Rivet Mid-Century Modern White Marble and Metal Side End Table, 17\"W, Black &amp; Marble"
  },
  {
    "mid": "B074KKMQHB",
    "glbPath": "B/B074KKMQHB.glb",
    "imgPath": "37/373acfff.jpg\r",
    "slug": "kum-saati-formlu-beyaz-mermer-modern-sehpa-51-cm",
    "name": "Kum Saati Formlu Beyaz Mermer Modern Sehpa (Ø51 cm)",
    "brandStyle": "Çağdaş Villa / Mermer & Krom Kafes",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 51,
      "depth": 51,
      "height": 43
    },
    "polyEstimate": 15944,
    "materialKind": "stone",
    "primaryHex": "#F0EEE9",
    "secondaryHex": "#C6CCD4",
    "accentHex": "#8E949E",
    "searchKeywords": [
      "mermer sehpa",
      "yuvarlak sehpa",
      "modern sehpa",
      "yan sehpa",
      "villa salon"
    ],
    "enRef": "Rivet Modern Hourglass White Marble Top and Metal Side End Table Nightstand, 17.9\"W, Sil"
  },
  {
    "mid": "B072ZLMBH7",
    "glbPath": "7/B072ZLMBH7.glb",
    "imgPath": "d0/d0aaa3e3.jpg\r",
    "slug": "3-katli-beyaz-mermer-celik-yuvarlak-yan-sehpa",
    "name": "3 Katlı Beyaz Mermer & Çelik Yuvarlak Yan Sehpa",
    "brandStyle": "Modern Butik / Çok Katlı Mermer Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 41,
      "depth": 41,
      "height": 45
    },
    "polyEstimate": 6928,
    "materialKind": "stone",
    "primaryHex": "#EFECE6",
    "secondaryHex": "#BFC5CC",
    "accentHex": "#787E87",
    "searchKeywords": [
      "mermer sehpa",
      "raflı sehpa",
      "yan sehpa",
      "modern sehpa"
    ],
    "enRef": "Rivet Round Three-Shelf White Marble and Stainless Steel End Side Table"
  },
  {
    "mid": "B07B7HVCMB",
    "glbPath": "B/B07B7HVCMB.glb",
    "imgPath": "22/223566f2.jpg\r",
    "slug": "kare-beyaz-mermer-metal-modern-yan-sehpa-45-cm",
    "name": "Kare Beyaz Mermer & Metal Modern Yan Sehpa (45 cm)",
    "brandStyle": "Minimalist Rezidans / Mermer Komodin & Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 45,
      "depth": 45,
      "height": 55
    },
    "polyEstimate": 8752,
    "materialKind": "stone",
    "primaryHex": "#F2F1ED",
    "secondaryHex": "#C5CBD3",
    "accentHex": "#949AA3",
    "searchKeywords": [
      "mermer sehpa",
      "kare sehpa",
      "yan sehpa",
      "komodin",
      "modern sehpa"
    ],
    "enRef": "Rivet Modern White Marble and Metal Side End Table Nightstand, 18\"W, Silver &amp; Marble"
  },
  {
    "mid": "B072ZMSBQT",
    "glbPath": "T/B072ZMSBQT.glb",
    "imgPath": "52/52fc319d.jpg\r",
    "slug": "molly-gri-mermer-paslanmaz-celik-yuvarlak-sehpa",
    "name": "Molly Gri Mermer & Paslanmaz Çelik Yuvarlak Sehpa",
    "brandStyle": "İtalyan & İnegöl / Mermer Yan Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 44,
      "depth": 44,
      "height": 48
    },
    "polyEstimate": 24120,
    "materialKind": "stone",
    "primaryHex": "#D9DADB",
    "secondaryHex": "#BFC5CC",
    "accentHex": "#6E737B",
    "searchKeywords": [
      "mermer sehpa",
      "yuvarlak sehpa",
      "gri mermer",
      "yan sehpa",
      "modern"
    ],
    "enRef": "Rivet Molly Round Marble and Stainless Steel Side End Table"
  },
  {
    "mid": "B07DBB1NJ1",
    "glbPath": "1/B07DBB1NJ1.glb",
    "imgPath": "69/69bdb27f.jpg\r",
    "slug": "parker-altin-pirinc-cam-modern-yuvarlak-sehpa-60-cm",
    "name": "Parker Altın Pirinç & Cam Modern Yuvarlak Sehpa (Ø60 cm)",
    "brandStyle": "Lüks Villa / Gold Metal & Cam Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 60,
      "depth": 60,
      "height": 39
    },
    "polyEstimate": 5968,
    "materialKind": "glass",
    "primaryHex": "#C7A35B",
    "secondaryHex": "#DCE4EC",
    "accentHex": "#8F713A",
    "searchKeywords": [
      "cam sehpa",
      "gold sehpa",
      "pirinç sehpa",
      "yuvarlak sehpa",
      "inegöl sehpa"
    ],
    "enRef": "Ravenna Home Parker Storage End Table, 23.6\"W, Glass &amp; Gold"
  },
  {
    "mid": "B07HSG8DPR",
    "glbPath": "R/B07HSG8DPR.glb",
    "imgPath": "31/314ba0c5.jpg\r",
    "slug": "genis-yuvarlak-masif-ahsap-siyah-metal-orta-sehpa-126-cm",
    "name": "Geniş Yuvarlak Masif Ahşap & Siyah Metal Orta Sehpa (Ø126 cm)",
    "brandStyle": "İnegöl Modern Loft / Büyük Yuvarlak Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 126,
      "depth": 126,
      "height": 52
    },
    "polyEstimate": 1336,
    "materialKind": "wood",
    "primaryHex": "#9C7550",
    "secondaryHex": "#25282E",
    "accentHex": "#6E4F34",
    "searchKeywords": [
      "orta sehpa",
      "yuvarlak sehpa",
      "ahşap sehpa",
      "inegöl sehpa",
      "salon sehpası"
    ],
    "enRef": "Stone & Beam Industrial Round Coffee Table, 48\"W, Wood & Dark Metal"
  },
  {
    "mid": "B07B7NYQLK",
    "glbPath": "K/B07B7NYQLK.glb",
    "imgPath": "5a/5a71c4f8.jpg\r",
    "slug": "parke-desenli-ahsap-siyah-metal-orta-sehpa-124-cm",
    "name": "Parke Desenli Ahşap & Siyah Metal Orta Sehpa (124 cm)",
    "brandStyle": "İnegöl Modern / Balıksırtı Ahşap Orta Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 124,
      "depth": 88,
      "height": 49
    },
    "polyEstimate": 1960,
    "materialKind": "wood",
    "primaryHex": "#A88159",
    "secondaryHex": "#24272C",
    "accentHex": "#6E5236",
    "searchKeywords": [
      "orta sehpa",
      "ahşap sehpa",
      "modern sehpa",
      "inegöl mobilya",
      "salon"
    ],
    "enRef": "Stone & Beam Bernice Industrial Reclaimed Parquet Wood Coffee Table, 42\"W, Natural and B"
  },
  {
    "mid": "B075Z85K2F",
    "glbPath": "F/B075Z85K2F.glb",
    "imgPath": "30/30379e71.jpg\r",
    "slug": "culver-dogal-ahsap-celik-modern-orta-sehpa-140-cm",
    "name": "Culver Doğal Ahşap & Çelik Modern Orta Sehpa (140 cm)",
    "brandStyle": "Geniş Villa Salonu / Dikdörtgen Orta Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 140,
      "depth": 80,
      "height": 44
    },
    "polyEstimate": 2192,
    "materialKind": "wood",
    "primaryHex": "#9E8975",
    "secondaryHex": "#AEB5BD",
    "accentHex": "#5E5146",
    "searchKeywords": [
      "orta sehpa",
      "dikdörtgen sehpa",
      "modern sehpa",
      "ahşap sehpa",
      "salon"
    ],
    "enRef": "Stone & Beam Culver Reclaimed Industrial Wood Coffee Table, 55.1\"W, Natural and Steel"
  },
  {
    "mid": "B07B7GQ1J2",
    "glbPath": "2/B07B7GQ1J2.glb",
    "imgPath": "e0/e0c3558b.jpg\r",
    "slug": "dogal-ahsap-altin-metal-ayakli-modern-orta-sehpa-115-cm",
    "name": "Doğal Ahşap & Altın Metal Ayaklı Modern Orta Sehpa (115 cm)",
    "brandStyle": "İnegöl Modern / Ahşap & Gold Orta Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 100,
      "depth": 115,
      "height": 46
    },
    "polyEstimate": 2382,
    "materialKind": "wood",
    "primaryHex": "#B08962",
    "secondaryHex": "#C5A059",
    "accentHex": "#75583B",
    "searchKeywords": [
      "orta sehpa",
      "gold sehpa",
      "ahşap sehpa",
      "inegöl sehpa",
      "modern salon"
    ],
    "enRef": "Rivet Rustic Reclaimed Fir Wood Coffee Table, 39\"W, Natural and Gold"
  },
  {
    "mid": "B07HSMYNYF",
    "glbPath": "F/B07HSMYNYF.glb",
    "imgPath": "5b/5bde5e5c.jpg\r",
    "slug": "rylee-genis-gri-mese-modern-orta-sehpa-162-cm",
    "name": "Rylee Geniş Gri Meşe Modern Orta Sehpa (162 cm)",
    "brandStyle": "Büyük Villa Salonu / 160 cm Orta Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 162,
      "depth": 92,
      "height": 53
    },
    "polyEstimate": 3232,
    "materialKind": "wood",
    "primaryHex": "#8E8A84",
    "secondaryHex": "#5A5752",
    "accentHex": "#2E3035",
    "searchKeywords": [
      "orta sehpa",
      "büyük sehpa",
      "gri sehpa",
      "villa sehpası",
      "modern sehpa"
    ],
    "enRef": "Stone & Beam Rylee Modern Coffee Table 19.69\"H, Mixed Gray"
  },
  {
    "mid": "B072ZMVR53",
    "glbPath": "3/B072ZMVR53.glb",
    "imgPath": "5d/5d6bf1f8.jpg\r",
    "slug": "hairpin-ceviz-siyah-metal-modern-orta-sehpa-138-cm",
    "name": "Hairpin Ceviz & Siyah Metal Modern Orta Sehpa (138 cm)",
    "brandStyle": "İnegöl Mid-Century / Ceviz Orta Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 138,
      "depth": 64,
      "height": 47
    },
    "polyEstimate": 3604,
    "materialKind": "wood",
    "primaryHex": "#7B5337",
    "secondaryHex": "#22252A",
    "accentHex": "#523622",
    "searchKeywords": [
      "ceviz sehpa",
      "orta sehpa",
      "modern sehpa",
      "inegöl mobilya",
      "salon sehpası"
    ],
    "enRef": "Rivet Hairpin Mid-Century Modern Wood and Metal Coffee Table, Walnut and Black"
  },
  {
    "mid": "B07DBDWL5H",
    "glbPath": "H/B07DBDWL5H.glb",
    "imgPath": "c5/c59c62fa.jpg\r",
    "slug": "koyu-mese-akilli-yukselen-mekanizmali-orta-sehpa-106-cm",
    "name": "Koyu Meşe Akıllı Yükselen Mekanizmalı Orta Sehpa (106 cm)",
    "brandStyle": "Fonksiyonel İnegöl / Akıllı Depolamalı Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 106,
      "depth": 57,
      "height": 41
    },
    "polyEstimate": 3788,
    "materialKind": "wood",
    "primaryHex": "#5E422E",
    "secondaryHex": "#3B281B",
    "accentHex": "#25282E",
    "searchKeywords": [
      "akıllı sehpa",
      "orta sehpa",
      "depolamalı sehpa",
      "meşe sehpa",
      "inegöl sehpa"
    ],
    "enRef": "Ravenna Home Heights Wood Lift Top Storage Coffee Table, 43.3\"W, Dark Oak"
  },
  {
    "mid": "B07DB92J69",
    "glbPath": "9/B07DB92J69.glb",
    "imgPath": "35/3580e261.jpg\r",
    "slug": "beyaz-lake-kavisli-ayakli-rafli-orta-sehpa-133-cm",
    "name": "Beyaz Lake Kavisli Ayaklı Raflı Orta Sehpa (133 cm)",
    "brandStyle": "Modern-Klasik / Beyaz Lake Orta Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 133,
      "depth": 56,
      "height": 47
    },
    "polyEstimate": 5868,
    "materialKind": "wood",
    "primaryHex": "#F0EFEA",
    "secondaryHex": "#D8D5CD",
    "accentHex": "#8C8982",
    "searchKeywords": [
      "beyaz sehpa",
      "lake sehpa",
      "orta sehpa",
      "modern sehpa",
      "salon"
    ],
    "enRef": "Ravenna Home Anne Marie White Wood Shelf Curved Leg Storage Coffee Table, 52.5\"W, White"
  },
  {
    "mid": "B07HSKV2QT",
    "glbPath": "T/B07HSKV2QT.glb",
    "imgPath": "02/023d3daf.jpg\r",
    "slug": "stevens-fircali-gri-depolamali-modern-orta-sehpa-109-cm",
    "name": "Stevens Fırçalı Gri Depolamalı Modern Orta Sehpa (109 cm)",
    "brandStyle": "Çağdaş Minimal / Alt Raflı Orta Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 109,
      "depth": 64,
      "height": 35
    },
    "polyEstimate": 6092,
    "materialKind": "wood",
    "primaryHex": "#7C7974",
    "secondaryHex": "#4A4845",
    "accentHex": "#2A2C30",
    "searchKeywords": [
      "orta sehpa",
      "modern sehpa",
      "gri sehpa",
      "salon sehpası"
    ],
    "enRef": "Rivet Stevens Modern Storage Coffee Table, 47.24\"W, Brushed Tundra Gray"
  },
  {
    "mid": "B075Z85VX9",
    "glbPath": "9/B075Z85VX9.glb",
    "imgPath": "7b/7b9acaa2.jpg\r",
    "slug": "sparrow-masif-ahsap-bronz-metal-orta-sehpa-139-cm",
    "name": "Sparrow Masif Ahşap & Bronz Metal Orta Sehpa (139 cm)",
    "brandStyle": "Lüks Villa / Bronz Çerçeveli Orta Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 139,
      "depth": 77,
      "height": 47
    },
    "polyEstimate": 7068,
    "materialKind": "wood",
    "primaryHex": "#9C7552",
    "secondaryHex": "#9C7E4C",
    "accentHex": "#4A3525",
    "searchKeywords": [
      "orta sehpa",
      "bronz sehpa",
      "ahşap sehpa",
      "inegöl sehpa",
      "modern"
    ],
    "enRef": "Stone & Beam Sparrow Modern Industrial Coffee Table, 55.1\"W, Wood and Bronze"
  },
  {
    "mid": "B01M4OYBOI",
    "glbPath": "I/B01M4OYBOI.glb",
    "imgPath": "5e/5e09e123.jpg\r",
    "slug": "adour-beyaz-mese-iskandinav-oval-orta-sehpa-108-cm",
    "name": "Adour Beyaz & Meşe İskandinav Oval Orta Sehpa (108 cm)",
    "brandStyle": "İnegöl İskandinav / Oval Beyaz Orta Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 108,
      "depth": 54,
      "height": 39
    },
    "polyEstimate": 10190,
    "materialKind": "wood",
    "primaryHex": "#F3F2EE",
    "secondaryHex": "#C29B6F",
    "accentHex": "#D8D6D0",
    "searchKeywords": [
      "oval sehpa",
      "beyaz sehpa",
      "iskandinav sehpa",
      "orta sehpa",
      "inegöl"
    ],
    "enRef": "Movian Adour Oval Coffee Table, 55 x 110 x 39cm, White/Light Brown"
  },
  {
    "mid": "B072ZK885D",
    "glbPath": "D/B072ZK885D.glb",
    "imgPath": "b9/b922645b.jpg\r",
    "slug": "allyson-iki-rafli-ceviz-modern-orta-sehpa-108-cm",
    "name": "Allyson İki Raflı Ceviz Modern Orta Sehpa (108 cm)",
    "brandStyle": "Mid-Century Modern / Ceviz Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 108,
      "depth": 53,
      "height": 43
    },
    "polyEstimate": 12760,
    "materialKind": "wood",
    "primaryHex": "#7E563A",
    "secondaryHex": "#543824",
    "accentHex": "#2B2D33",
    "searchKeywords": [
      "ceviz sehpa",
      "orta sehpa",
      "raflı sehpa",
      "modern sehpa"
    ],
    "enRef": "Rivet Allyson Mid-Century Modern Two-Shelf Adjustable Coffee Table, Walnut"
  },
  {
    "mid": "B07DB92J6D",
    "glbPath": "D/B07DB92J6D.glb",
    "imgPath": "6f/6f671dc9.jpg\r",
    "slug": "koyu-ceviz-cam-tablali-oval-orta-sehpa-124-cm",
    "name": "Koyu Ceviz & Cam Tablalı Oval Orta Sehpa (124 cm)",
    "brandStyle": "İnegöl Modern / Oval Camlı Orta Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 124,
      "depth": 73,
      "height": 46
    },
    "polyEstimate": 12964,
    "materialKind": "wood",
    "primaryHex": "#453024",
    "secondaryHex": "#DCE4EC",
    "accentHex": "#2A1D15",
    "searchKeywords": [
      "cam orta sehpa",
      "oval sehpa",
      "ceviz sehpa",
      "inegöl sehpa",
      "modern"
    ],
    "enRef": "Ravenna Home Oval Wood and Glass Shelf Coffee Table, 49\"W, Dark Espresso"
  },
  {
    "mid": "B07B7FH3S6",
    "glbPath": "6/B07B7FH3S6.glb",
    "imgPath": "b9/b93ae3a2.jpg\r",
    "slug": "gazelle-3-lu-modern-metal-ahsap-zigon-sehpa-seti",
    "name": "Gazelle 3’lü Modern Metal & Ahşap Zigon Sehpa Seti",
    "brandStyle": "İnegöl Modern / 3’lü İç İçe Zigon",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 131,
      "depth": 49,
      "height": 43
    },
    "polyEstimate": 8970,
    "materialKind": "wood",
    "primaryHex": "#9B9186",
    "secondaryHex": "#2C2F36",
    "accentHex": "#6E655C",
    "searchKeywords": [
      "zigon sehpa",
      "3lü zigon",
      "orta sehpa",
      "inegöl sehpa",
      "modern sehpa"
    ],
    "enRef": "Stone & Beam Gazelle Rustic Metal Nesting Tables, 52\"W, Set of 3, Weathered Taupe Gray"
  },
  {
    "mid": "B0768STTR7",
    "glbPath": "7/B0768STTR7.glb",
    "imgPath": "01/01163a26.jpg\r",
    "slug": "weston-2-li-kare-ahsap-siyah-metal-zigon-sehpa",
    "name": "Weston 2’li Kare Ahşap & Siyah Metal Zigon Sehpa",
    "brandStyle": "Modern Loft / İkili Kare Zigon",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 46,
      "depth": 46,
      "height": 62
    },
    "polyEstimate": 10886,
    "materialKind": "wood",
    "primaryHex": "#7B583E",
    "secondaryHex": "#24272C",
    "accentHex": "#523B29",
    "searchKeywords": [
      "zigon sehpa",
      "ikili sehpa",
      "kare sehpa",
      "yan sehpa",
      "inegöl"
    ],
    "enRef": "Stone & Beam Weston Wood & Metal Nesting Tables, Set of 2, Brown"
  },
  {
    "mid": "B072ZLCB3M",
    "glbPath": "M/B072ZLCB3M.glb",
    "imgPath": "d9/d93b23d1.jpg\r",
    "slug": "bristol-dogal-kenarli-ceviz-siyah-metal-yan-sehpa",
    "name": "Bristol Doğal Kenarlı Ceviz & Siyah Metal Yan Sehpa",
    "brandStyle": "İnegöl Organik Modern / Kütük Ceviz Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 48,
      "depth": 49,
      "height": 48
    },
    "polyEstimate": 912,
    "materialKind": "wood",
    "primaryHex": "#7B5437",
    "secondaryHex": "#23262B",
    "accentHex": "#523723",
    "searchKeywords": [
      "yan sehpa",
      "ceviz sehpa",
      "kütük sehpa",
      "modern sehpa",
      "inegöl"
    ],
    "enRef": "Rivet Bristol Natural Edge Black Metal Side Table, Walnut"
  },
  {
    "mid": "B07DBDZ2TG",
    "glbPath": "G/B07DBDZ2TG.glb",
    "imgPath": "9e/9ef0d076.jpg\r",
    "slug": "capraz-ayakli-koyu-ceviz-kare-yan-sehpa-60-cm",
    "name": "Çapraz Ayaklı Koyu Ceviz Kare Yan Sehpa (60 cm)",
    "brandStyle": "Modern Salon / Kare Yan Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 60,
      "depth": 56,
      "height": 56
    },
    "polyEstimate": 564,
    "materialKind": "wood",
    "primaryHex": "#573B28",
    "secondaryHex": "#3B271A",
    "accentHex": "#8C6848",
    "searchKeywords": [
      "yan sehpa",
      "kare sehpa",
      "ceviz sehpa",
      "salon sehpası"
    ],
    "enRef": "Ravenna Home Flush Mount Wood Cross Side Table, 23.6\"W, Dark Brown Walnut"
  },
  {
    "mid": "B07HSKY87X",
    "glbPath": "X/B07HSKY87X.glb",
    "imgPath": "32/327b105a.jpg\r",
    "slug": "dogal-ahsap-altin-ayakli-modern-yan-sehpa-71-cm",
    "name": "Doğal Ahşap & Altın Ayaklı Modern Yan Sehpa (71 cm)",
    "brandStyle": "İnegöl Modern / Gold & Ahşap Yan Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 53,
      "depth": 58,
      "height": 71
    },
    "polyEstimate": 2870,
    "materialKind": "wood",
    "primaryHex": "#B08A63",
    "secondaryHex": "#C5A059",
    "accentHex": "#7A5D40",
    "searchKeywords": [
      "yan sehpa",
      "altın ayaklı sehpa",
      "modern sehpa",
      "inegöl"
    ],
    "enRef": "Rivet Modern End Table, 19.3 Inch Width, Natural and Gold"
  },
  {
    "mid": "B075Z8FV7N",
    "glbPath": "N/B075Z8FV7N.glb",
    "imgPath": "fc/fc4ceee9.jpg\r",
    "slug": "culver-yuvarlak-ahsap-metal-yan-sehpa-56-cm",
    "name": "Culver Yuvarlak Ahşap & Metal Yan Sehpa (Ø56 cm)",
    "brandStyle": "Minimalist Salon / Yuvarlak Yan Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 56,
      "depth": 56,
      "height": 44
    },
    "polyEstimate": 4224,
    "materialKind": "wood",
    "primaryHex": "#9C8A78",
    "secondaryHex": "#AEB4BC",
    "accentHex": "#5E5246",
    "searchKeywords": [
      "yuvarlak sehpa",
      "yan sehpa",
      "modern sehpa",
      "koltuk yanı"
    ],
    "enRef": "Stone & Beam Culver Reclaimed Wood Round Side End Table, 23.6\"D, Natural and Steel"
  },
  {
    "mid": "B072ZLCB32",
    "glbPath": "2/B072ZLCB32.glb",
    "imgPath": "75/75afef59.jpg\r",
    "slug": "axel-kapakli-depolamali-ceviz-metal-yan-sehpa",
    "name": "Axel Kapaklı Depolamalı Ceviz & Metal Yan Sehpa",
    "brandStyle": "Fonksiyonel Modern / Silindir Yan Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 40,
      "depth": 40,
      "height": 61
    },
    "polyEstimate": 4251,
    "materialKind": "wood",
    "primaryHex": "#7A5539",
    "secondaryHex": "#262930",
    "accentHex": "#523824",
    "searchKeywords": [
      "yan sehpa",
      "depolamalı sehpa",
      "komodin",
      "ceviz sehpa"
    ],
    "enRef": "Rivet Axel Lid Storage Wood and Metal Side End Table Nightstand, Walnut"
  },
  {
    "mid": "B07B4MRLRJ",
    "glbPath": "J/B07B4MRLRJ.glb",
    "imgPath": "7e/7e7316be.jpg\r",
    "slug": "berkshire-antrasit-modern-salon-berjeri-100-cm",
    "name": "Berkshire Antrasit Modern Salon Berjeri (100 cm)",
    "brandStyle": "İnegöl Modern / Geniş Oturumlu Berjer",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 100,
      "depth": 80,
      "height": 84
    },
    "polyEstimate": 7124,
    "materialKind": "fabric",
    "primaryHex": "#4B4F56",
    "secondaryHex": "#31343A",
    "accentHex": "#7A5438",
    "searchKeywords": [
      "berjer",
      "tekli koltuk",
      "modern berjer",
      "antrasit berjer",
      "inegöl koltuk"
    ],
    "enRef": "Rivet Berkshire Modern Living Room Accent Chair, 37\"W, Dark Grey"
  },
  {
    "mid": "B07B4DB6Z4",
    "glbPath": "4/B07B4DB6Z4.glb",
    "imgPath": "04/043b74c7.jpg\r",
    "slug": "keten-dokuma-genis-modern-villa-berjeri-80-cm",
    "name": "Keten Dokuma Geniş Modern Villa Berjeri (80 cm)",
    "brandStyle": "İnegöl Modern / Keten Krem Berjer",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 80,
      "depth": 100,
      "height": 97
    },
    "polyEstimate": 9382,
    "materialKind": "linen",
    "primaryHex": "#E4DDD0",
    "secondaryHex": "#C4B9A6",
    "accentHex": "#5C4532",
    "searchKeywords": [
      "berjer",
      "krem berjer",
      "keten koltuk",
      "tekli koltuk",
      "inegöl"
    ],
    "enRef": "Stone & Beam Modern Living Room Chair, 31\"W, Linen"
  },
  {
    "mid": "B07DBB77DV",
    "glbPath": "V/B07DBB77DV.glb",
    "imgPath": "18/18ba5513.jpg\r",
    "slug": "bej-yuksek-sirtli-kulakli-modern-berjer-86-cm",
    "name": "Bej Yüksek Sırtlı Kulaklı Modern Berjer (86 cm)",
    "brandStyle": "Modern-Klasik / Yüksek Sırtlı Okuma Berjeri",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 86,
      "depth": 98,
      "height": 106
    },
    "polyEstimate": 9994,
    "materialKind": "fabric",
    "primaryHex": "#D9CFC0",
    "secondaryHex": "#B3A694",
    "accentHex": "#5A412E",
    "searchKeywords": [
      "berjer",
      "kulaklı berjer",
      "bej koltuk",
      "okuma koltuğu",
      "villa salon"
    ],
    "enRef": "Ravenna Home Modern Wingback Accent Chair, 27.5\"W, Beige"
  },
  {
    "mid": "B072M1W7Z2",
    "glbPath": "2/B072M1W7Z2.glb",
    "imgPath": "26/26745177.jpg\r",
    "slug": "cheyanne-kirik-beyaz-yumusak-modern-berjer-76-cm",
    "name": "Cheyanne Kırık Beyaz Yumuşak Modern Berjer (76 cm)",
    "brandStyle": "İnegöl Modern / Beyaz Tekli Koltuk",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 76,
      "depth": 88,
      "height": 92
    },
    "polyEstimate": 10316,
    "materialKind": "fabric",
    "primaryHex": "#EFECE6",
    "secondaryHex": "#CFC9BE",
    "accentHex": "#5C4432",
    "searchKeywords": [
      "beyaz berjer",
      "krem berjer",
      "modern berjer",
      "tekli koltuk",
      "inegöl"
    ],
    "enRef": "Stone & Beam Cheyanne Living Room Accent Chair, 31\"W, Marshmallow"
  },
  {
    "mid": "B07B4G5RBN",
    "glbPath": "N/B07B4G5RBN.glb",
    "imgPath": "37/37157509.jpg\r",
    "slug": "varon-antrasit-modern-dinlenme-sezlongu-178-cm",
    "name": "Varon Antrasit Modern Dinlenme Şezlongu (178 cm)",
    "brandStyle": "Lüks Villa / İç Mekan Lounge Daybed",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 89,
      "depth": 178,
      "height": 86
    },
    "polyEstimate": 9490,
    "materialKind": "fabric",
    "primaryHex": "#494C54",
    "secondaryHex": "#2F3238",
    "accentHex": "#7A5438",
    "searchKeywords": [
      "şezlong",
      "dinlenme koltuğu",
      "daybed",
      "villa salon",
      "modern koltuk"
    ],
    "enRef": "Stone & Beam Varon Modern Lounge Daybed Chaise, 34.2\"W, Dark Grey"
  },
  {
    "mid": "B07DBHGZP8",
    "glbPath": "8/B07DBHGZP8.glb",
    "imgPath": "3b/3b3069cb.jpg\r",
    "slug": "rai-kapitone-kavisli-antre-yatak-ucu-settee-133-cm",
    "name": "Rai Kapitone Kavisli Antre & Yatak Ucu Settee (133 cm)",
    "brandStyle": "Butik Antre / Kolçaksız Kapitone Bank",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 133,
      "depth": 81,
      "height": 118
    },
    "polyEstimate": 16850,
    "materialKind": "fabric",
    "primaryHex": "#4E5159",
    "secondaryHex": "#33363C",
    "accentHex": "#5A412F",
    "searchKeywords": [
      "antre koltuğu",
      "yatak ucu bench",
      "kapitone bank",
      "modern settee"
    ],
    "enRef": "Ravenna Home Rai Tufted Arched Armless Loveseat Bench Settee, 52\"W, Dark Grey"
  },
  {
    "mid": "B073G94FRB",
    "glbPath": "B/B073G94FRB.glb",
    "imgPath": "78/78c930b6.jpg\r",
    "slug": "altigen-zumrut-yesili-kadife-modern-puf-44-cm",
    "name": "Altıgen Zümrüt Yeşili Kadife Modern Puf (44 cm)",
    "brandStyle": "İnegöl Butik / Geometrik Kadife Puf",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 44,
      "depth": 50,
      "height": 51
    },
    "polyEstimate": 5504,
    "materialKind": "fabric",
    "primaryHex": "#2A5E49",
    "secondaryHex": "#1D4434",
    "accentHex": "#C5A059",
    "searchKeywords": [
      "puf",
      "yeşil puf",
      "kadife puf",
      "salon pufu",
      "makyaj pufu"
    ],
    "enRef": "Rivet Six-Sided Modern Ottoman, 19\"W, Emerald"
  },
  {
    "mid": "B07HZ7SMYQ",
    "glbPath": "Q/B07HZ7SMYQ.glb",
    "imgPath": "0a/0ad33e6b.jpg\r",
    "slug": "blaine-acik-gri-genis-dikdortgen-salon-pufu-94-cm",
    "name": "Blaine Açık Gri Geniş Dikdörtgen Salon Pufu (94 cm)",
    "brandStyle": "Modern Salon / Orta Modül Puf",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 94,
      "depth": 64,
      "height": 48
    },
    "polyEstimate": 6312,
    "materialKind": "fabric",
    "primaryHex": "#CED0D4",
    "secondaryHex": "#999CA2",
    "accentHex": "#5C4532",
    "searchKeywords": [
      "puf",
      "büyük puf",
      "gri puf",
      "ottoman",
      "modern salon"
    ],
    "enRef": "Stone & Beam Blaine Modern Ottoman, 36.2\"W, Light Gray"
  },
  {
    "mid": "B073ZRX6T8",
    "glbPath": "8/B073ZRX6T8.glb",
    "imgPath": "95/95f70157.jpg\r",
    "slug": "kristin-kum-beji-kollu-sandikli-yatak-ucu-bench-110-cm",
    "name": "Kristin Kum Beji Kollu Sandıklı Yatak Ucu Bench (110 cm)",
    "brandStyle": "Yatak Odası / Sandıklı Kumaş Bench",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 110,
      "depth": 62,
      "height": 45
    },
    "polyEstimate": 6644,
    "materialKind": "fabric",
    "primaryHex": "#D9CEBE",
    "secondaryHex": "#B3A692",
    "accentHex": "#5A4230",
    "searchKeywords": [
      "bench",
      "yatak ucu puf",
      "sandıklı puf",
      "bej bench",
      "yatak odası"
    ],
    "enRef": "Stone & Beam Kristin Round Arm Storage Ottoman, 43.5\"W, Sand"
  },
  {
    "mid": "B073G947XM",
    "glbPath": "M/B073G947XM.glb",
    "imgPath": "d0/d0954294.jpg\r",
    "slug": "union-zumrut-kadife-depolamali-antre-banki-99-cm",
    "name": "Union Zümrüt Kadife Depolamalı Antre Bankı (99 cm)",
    "brandStyle": "Butik Antre & Giyinme Odası Bankı",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 99,
      "depth": 50,
      "height": 50
    },
    "polyEstimate": 6744,
    "materialKind": "fabric",
    "primaryHex": "#2A5B47",
    "secondaryHex": "#1C4031",
    "accentHex": "#C5A059",
    "searchKeywords": [
      "antre bankı",
      "bench",
      "yeşil puf",
      "giyinme odası"
    ],
    "enRef": "Stone & Beam Union Modern Storage Bench, 38\"W, Emerald"
  },
  {
    "mid": "B07HSBDCX8",
    "glbPath": "8/B07HSBDCX8.glb",
    "imgPath": "a0/a0e57102.jpg\r",
    "slug": "rylee-gri-akasya-masif-ahsap-yemek-antre-banki-170-cm",
    "name": "Rylee Gri Akasya Masif Ahşap Yemek & Antre Bankı (170 cm)",
    "brandStyle": "Modern Masif / Uzun Ahşap Bench",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 170,
      "depth": 38,
      "height": 43
    },
    "polyEstimate": 1624,
    "materialKind": "wood",
    "primaryHex": "#948F88",
    "secondaryHex": "#66625C",
    "accentHex": "#3A3835",
    "searchKeywords": [
      "ahşap bank",
      "yemek masası bankı",
      "bench",
      "modern yemek odası"
    ],
    "enRef": "Stone & Beam Rylee Modern Farmhouse Acacia Wood Dining Bench, 71\"W, Gray-Wash Acacia"
  },
  {
    "mid": "B07B7B75GF",
    "glbPath": "F/B07B7B75GF.glb",
    "imgPath": "92/9270c190.jpg\r",
    "slug": "carrara-mermer-tablali-siyah-metal-mutfak-yemek-konsolu",
    "name": "Carrara Mermer Tablalı Siyah Metal Mutfak & Yemek Konsolu",
    "brandStyle": "İnegöl Lüks / Mermer & Siyah Metal Konsol",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 116,
      "depth": 61,
      "height": 88
    },
    "polyEstimate": 10172,
    "materialKind": "stone",
    "primaryHex": "#F0EEE9",
    "secondaryHex": "#24272C",
    "accentHex": "#C8C5BE",
    "searchKeywords": [
      "mermer konsol",
      "konsol",
      "mutfak adası",
      "servis masası",
      "inegöl mobilya"
    ],
    "enRef": "Stone & Beam Amber Metal Buffet Table Kitchen Storage Rack, 47.5\"W, White, Carrera Marbl"
  },
  {
    "mid": "B07HSLVMP2",
    "glbPath": "2/B07HSLVMP2.glb",
    "imgPath": "83/835777ce.jpg\r",
    "slug": "rylee-3-cekmeceli-akasya-modern-yemek-konsolu-160-cm",
    "name": "Rylee 3 Çekmeceli Akasya Modern Yemek Konsolu (160 cm)",
    "brandStyle": "İnegöl Modern / 160 cm Konsol & TV Ünitesi",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 160,
      "depth": 46,
      "height": 79
    },
    "polyEstimate": 3834,
    "materialKind": "wood",
    "primaryHex": "#8D8882",
    "secondaryHex": "#5C5852",
    "accentHex": "#2C2E33",
    "searchKeywords": [
      "konsol",
      "tv ünitesi",
      "tv sehpası",
      "inegöl konsol",
      "yemek odası"
    ],
    "enRef": "Stone & Beam Rylee Modern Acacia Wood 3-Drawer Sideboard Buffet, 63\"W, Acacia, Gray-Wash"
  },
  {
    "mid": "B075ZF4SF1",
    "glbPath": "1/B075ZF4SF1.glb",
    "imgPath": "29/29f2e5ab.jpg\r",
    "slug": "beyaz-bronz-genis-villa-antre-tv-konsolu-180-cm",
    "name": "Beyaz & Bronz Geniş Villa Antre & TV Konsolu (180 cm)",
    "brandStyle": "Modern Villa / 180 cm Dresuar & TV Sehpası",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 180,
      "depth": 47,
      "height": 81
    },
    "polyEstimate": 3160,
    "materialKind": "wood",
    "primaryHex": "#EAE6DE",
    "secondaryHex": "#8E6F4E",
    "accentHex": "#5C4735",
    "searchKeywords": [
      "dresuar",
      "konsol",
      "tv sehpası",
      "antre konsolu",
      "modern"
    ],
    "enRef": "Stone & Beam Reclaimed Wood Farmhouse Console Table, 70.9\"W, Natural Finish"
  },
  {
    "mid": "B075YQ46KX",
    "glbPath": "X/B075YQ46KX.glb",
    "imgPath": "f6/f6c27e8c.jpg\r",
    "slug": "ceviz-siyah-metal-modern-antre-dresuari-120-cm",
    "name": "Ceviz & Siyah Metal Modern Antre Dresuarı (120 cm)",
    "brandStyle": "İnegöl Modern / 120 cm Dresuar & Konsol",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 120,
      "depth": 41,
      "height": 74
    },
    "polyEstimate": 3168,
    "materialKind": "wood",
    "primaryHex": "#7A5438",
    "secondaryHex": "#24272C",
    "accentHex": "#523724",
    "searchKeywords": [
      "dresuar",
      "antre konsolu",
      "ceviz konsol",
      "inegöl mobilya",
      "koridor"
    ],
    "enRef": "Rivet Industrial Modern Console Table, 47.25\"W, Walnut Wood, Metal"
  },
  {
    "mid": "B072ZKTSNX",
    "glbPath": "X/B072ZKTSNX.glb",
    "imgPath": "4d/4d457079.jpg\r",
    "slug": "hairpin-ceviz-siyah-metal-alcak-tv-sehpasi-157-cm",
    "name": "Hairpin Ceviz & Siyah Metal Alçak TV Sehpası (157 cm)",
    "brandStyle": "İnegöl Modern / 157 cm Minimal TV Ünitesi",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 157,
      "depth": 43,
      "height": 46
    },
    "polyEstimate": 2484,
    "materialKind": "wood",
    "primaryHex": "#7B5437",
    "secondaryHex": "#23262C",
    "accentHex": "#523622",
    "searchKeywords": [
      "tv sehpası",
      "tv ünitesi",
      "ceviz tv sehpası",
      "inegöl mobilya",
      "salon"
    ],
    "enRef": "Rivet Hairpin Wood and Metal 15.7\" Console Table Bench, Walnut and Dark Metal"
  },
  {
    "mid": "B07H8JRPLT",
    "glbPath": "T/B07H8JRPLT.glb",
    "imgPath": "22/22191d75.jpg\r",
    "slug": "douro-mese-beyaz-2-kapakli-modern-konsol-dolap-117-cm",
    "name": "Douro Meşe & Beyaz 2 Kapaklı Modern Konsol Dolap (117 cm)",
    "brandStyle": "İnegöl İskandinav / Meşe-Beyaz Dolap",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 117,
      "depth": 47,
      "height": 140
    },
    "polyEstimate": 952,
    "materialKind": "wood",
    "primaryHex": "#C49D72",
    "secondaryHex": "#F2F1ED",
    "accentHex": "#7A5D40",
    "searchKeywords": [
      "konsol",
      "dolap",
      "meşe dolap",
      "beyaz konsol",
      "inegöl mobilya"
    ],
    "enRef": "Movian Douro 2-Door 2-Drawer Sideboard Cabinet with additional storage compartments, 120"
  },
  {
    "mid": "B07B813LW1",
    "glbPath": "1/B07B813LW1.glb",
    "imgPath": "12/123a1b5e.jpg\r",
    "slug": "bej-metal-ahsap-mid-century-modern-bufe-konsol-90-cm",
    "name": "Bej Metal & Ahşap Mid-Century Modern Büfe Konsol (90 cm)",
    "brandStyle": "Çağdaş Minimal / Kompakt Konsol",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 90,
      "depth": 46,
      "height": 69
    },
    "polyEstimate": 5083,
    "materialKind": "metal",
    "primaryHex": "#D9CFC0",
    "secondaryHex": "#A89E8E",
    "accentHex": "#4A4845",
    "searchKeywords": [
      "konsol",
      "büfe",
      "bej dolap",
      "modern konsol"
    ],
    "enRef": "Rivet Mid-Century Modern Industrial Metal Buffet Credenza, 28 Inch Height, Beige, Wood"
  },
  {
    "mid": "B07HSH22K8",
    "glbPath": "8/B07HSH22K8.glb",
    "imgPath": "0b/0b5ac752.jpg\r",
    "slug": "ceviz-rafli-kompakt-modern-yan-dolap-71-cm",
    "name": "Ceviz Raflı Kompakt Modern Yan Dolap (71 cm)",
    "brandStyle": "İnegöl Modern / Kapaklı Ceviz Dolap",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 71,
      "depth": 39,
      "height": 75
    },
    "polyEstimate": 1792,
    "materialKind": "wood",
    "primaryHex": "#7D563A",
    "secondaryHex": "#543824",
    "accentHex": "#2A2C30",
    "searchKeywords": [
      "dolap",
      "ceviz dolap",
      "komodin",
      "salon dolabı"
    ],
    "enRef": "Rivet Modern Cabinet with Inner Shelf, 15\"W, Walnut"
  },
  {
    "mid": "B07GFS1R7X",
    "glbPath": "X/B07GFS1R7X.glb",
    "imgPath": "46/46e04da4.jpg\r",
    "slug": "inari-mese-3-kapakli-ince-antre-ayakkabilik-75-cm",
    "name": "Inari Meşe 3 Kapaklı İnce Antre Ayakkabılık (75 cm)",
    "brandStyle": "Türkiye Apartman Antresi / İnce Ayakkabılık",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 75,
      "depth": 25,
      "height": 128
    },
    "polyEstimate": 2562,
    "materialKind": "wood",
    "primaryHex": "#C29B70",
    "secondaryHex": "#8E6B47",
    "accentHex": "#4E3A26",
    "searchKeywords": [
      "ayakkabılık",
      "antre dolabı",
      "portmanto",
      "dresuar",
      "apartman girişi"
    ],
    "enRef": "Movian Inari 3-door Shoe Cabinet/Cupboard/Organizer, 25 x 75 x 128 cm, Light Brown Oak-E"
  },
  {
    "mid": "B07B8FHTJ4",
    "glbPath": "4/B07B8FHTJ4.glb",
    "imgPath": "1e/1e0b766a.jpg\r",
    "slug": "duvara-monte-ahsap-banyo-mutfak-dolabi-49-cm",
    "name": "Duvara Monte Ahşap Banyo & Mutfak Dolabı (49 cm)",
    "brandStyle": "Modern Country / Askılı Duvar Dolabı",
    "category": "Banyo",
    "placement": "wall-mounted",
    "dimensionsCm": {
      "width": 49,
      "depth": 18,
      "height": 59,
      "mountHeight": 135
    },
    "polyEstimate": 4824,
    "materialKind": "wood",
    "primaryHex": "#C7A882",
    "secondaryHex": "#8E7354",
    "accentHex": "#4A3F35",
    "searchKeywords": [
      "banyo dolabı",
      "duvar dolabı",
      "mutfak dolabı",
      "askılı dolap"
    ],
    "enRef": "Stone & Beam Farmhouse Wall Mounted Cabinet Storage Organzier - 23 x19 x 6 Inch, Natural"
  },
  {
    "mid": "B07H8SQ2NZ",
    "glbPath": "Z/B07H8SQ2NZ.glb",
    "imgPath": "c3/c366667b.jpg\r",
    "slug": "oker-mese-beyaz-8-rafli-modern-kitaplik-100-cm",
    "name": "Oker Meşe & Beyaz 8 Raflı Modern Kitaplık (100 cm)",
    "brandStyle": "İnegöl Modern / Kapaklı Kitaplık Ünitesi",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 100,
      "depth": 43,
      "height": 140
    },
    "polyEstimate": 1668,
    "materialKind": "wood",
    "primaryHex": "#C49E74",
    "secondaryHex": "#F2F1ED",
    "accentHex": "#7A5D40",
    "searchKeywords": [
      "kitaplık",
      "modern kitaplık",
      "meşe kitaplık",
      "çalışma odası",
      "inegöl"
    ],
    "enRef": "Movian Oker 2-Door Cabinet/Bookcase with 8 Shelves, 100 x 140cm, Light Brown Oak-Effect/"
  },
  {
    "mid": "B075Z7SQND",
    "glbPath": "D/B075Z7SQND.glb",
    "imgPath": "e7/e705ff2f.jpg\r",
    "slug": "bryson-a-formlu-genis-ahsap-demir-kitaplik-175-cm",
    "name": "Bryson A-Formlu Geniş Ahşap & Demir Kitaplık (175 cm)",
    "brandStyle": "Modern Loft / Geniş Salon Kitaplığı",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 175,
      "depth": 51,
      "height": 181
    },
    "polyEstimate": 2988,
    "materialKind": "wood",
    "primaryHex": "#C8A67D",
    "secondaryHex": "#2B2E35",
    "accentHex": "#8E7050",
    "searchKeywords": [
      "kitaplık",
      "loft kitaplık",
      "geniş raf",
      "salon ünitesi"
    ],
    "enRef": "Stone & Beam Bryson A-Frame Bookcase Shelf Stand, 70.7\"W, Wood and Iron"
  },
  {
    "mid": "B07HSCNKCT",
    "glbPath": "T/B07HSCNKCT.glb",
    "imgPath": "c1/c121cdbd.jpg\r",
    "slug": "rylee-gri-ahsap-5-katli-modern-kitaplik-75-cm",
    "name": "Rylee Gri Ahşap 5 Katlı Modern Kitaplık (75 cm)",
    "brandStyle": "Çağdaş Minimal / Dar Duvar Kitaplığı",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 75,
      "depth": 31,
      "height": 147
    },
    "polyEstimate": 2998,
    "materialKind": "wood",
    "primaryHex": "#8E8A84",
    "secondaryHex": "#5E5B56",
    "accentHex": "#2E3035",
    "searchKeywords": [
      "kitaplık",
      "raf ünitesi",
      "gri kitaplık",
      "çalışma odası"
    ],
    "enRef": "Stone & Beam Rylee Modern Bookcase 39.4\"Wx76.8”H, Mixed Gray"
  },
  {
    "mid": "B07HSGBB2D",
    "glbPath": "D/B07HSGBB2D.glb",
    "imgPath": "f7/f740f55b.jpg\r",
    "slug": "rylee-ince-dikey-dekoratif-kitaplik-rafi-49-cm",
    "name": "Rylee İnce Dikey Dekoratif Kitaplık Rafı (49 cm)",
    "brandStyle": "Kompakt Modern / Köşe Kitaplık",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 49,
      "depth": 27,
      "height": 134
    },
    "polyEstimate": 2274,
    "materialKind": "wood",
    "primaryHex": "#8C8882",
    "secondaryHex": "#5E5A55",
    "accentHex": "#2E3035",
    "searchKeywords": [
      "dar kitaplık",
      "dekor rafı",
      "kitaplık",
      "banyo rafı"
    ],
    "enRef": "Stone & Beam Rylee Modern Bookcase 27.6\"W x 76.8”H, Mixed Gray"
  },
  {
    "mid": "B07H8JN9QF",
    "glbPath": "F/B07H8JN9QF.glb",
    "imgPath": "d8/d829e3b4.jpg\r",
    "slug": "morava-4-kapili-aynali-modern-gardirop-200-cm",
    "name": "Morava 4 Kapılı Aynalı Modern Gardırop (200 cm)",
    "brandStyle": "İnegöl Yatak Odası / Aynalı 4 Kapılı Dolap",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 200,
      "depth": 60,
      "height": 216
    },
    "polyEstimate": 1460,
    "materialKind": "wood",
    "primaryHex": "#C49E74",
    "secondaryHex": "#DCE4EC",
    "accentHex": "#7D6246",
    "searchKeywords": [
      "gardırop",
      "elbise dolabı",
      "aynalı dolap",
      "yatak odası",
      "inegöl mobilya"
    ],
    "enRef": "Movian Morava 4-Door 2-Drawer Wardrobe with Mirrors, 200 x 59 x 212cm, Light Brown Oak-E"
  },
  {
    "mid": "B07B4W81YX",
    "glbPath": "X/B07B4W81YX.glb",
    "imgPath": "3b/3bb0409e.jpg\r",
    "slug": "brecken-modern-ceviz-baslikli-cift-kisilik-karyola-160-2",
    "name": "Brecken Modern Ceviz Başlıklı Çift Kişilik Karyola (160×200)",
    "brandStyle": "İnegöl Yatak Odası / Modern Masif Karyola",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 162,
      "depth": 223,
      "height": 154
    },
    "polyEstimate": 17776,
    "materialKind": "wood",
    "primaryHex": "#7A5438",
    "secondaryHex": "#523622",
    "accentHex": "#E8E3DA",
    "searchKeywords": [
      "yatak",
      "karyola",
      "çift kişilik yatak",
      "yatak odası",
      "inegöl mobilya"
    ],
    "enRef": "Rivet Brecken Modern Wood Queen Bed Frame Platform with Headboard, 64\"W, Brown"
  },
  {
    "mid": "B07B4Y45H5",
    "glbPath": "5/B07B4Y45H5.glb",
    "imgPath": "4f/4ff0b5cb.jpg\r",
    "slug": "fisher-genis-king-size-modern-ahsap-karyola-200-218",
    "name": "Fisher Geniş King Size Modern Ahşap Karyola (200×218)",
    "brandStyle": "Lüks Villa Ebeveyn Odası / King Karyola",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 201,
      "depth": 218,
      "height": 130
    },
    "polyEstimate": 17286,
    "materialKind": "wood",
    "primaryHex": "#9C7A56",
    "secondaryHex": "#6E5338",
    "accentHex": "#E8E4DC",
    "searchKeywords": [
      "yatak",
      "king yatak",
      "ebeveyn yatak odası",
      "karyola",
      "villa"
    ],
    "enRef": "Rivet Fisher Rustic Wood King Bed, 79\"W, Reclaimed-Look Wood"
  },
  {
    "mid": "B071H75K71",
    "glbPath": "1/B071H75K71.glb",
    "imgPath": "20/20d9ed6f.jpg\r",
    "slug": "aveyron-modern-gri-tek-kisilik-genc-odasi-karyolasi-100-",
    "name": "Aveyron Modern Gri Tek Kişilik Genç Odası Karyolası (100×196)",
    "brandStyle": "Genç & Misafir Odası / Tek Kişilik Yatak",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 100,
      "depth": 196,
      "height": 80
    },
    "polyEstimate": 15016,
    "materialKind": "wood",
    "primaryHex": "#8C8F94",
    "secondaryHex": "#5C5F66",
    "accentHex": "#E8E4DC",
    "searchKeywords": [
      "tek kişilik yatak",
      "genç odası",
      "karyola",
      "misafir odası"
    ],
    "enRef": "Movian Aveyron Single Bed Frame, 195 x 100 x 80cm, Grey"
  },
  {
    "mid": "B07GFDPB2V",
    "glbPath": "V/B07GFDPB2V.glb",
    "imgPath": "b7/b7a05d32.jpg\r",
    "slug": "havel-4-cekmeceli-beyaz-antrasit-modern-sifonyer-99-cm",
    "name": "Havel 4 Çekmeceli Beyaz & Antrasit Modern Şifonyer (99 cm)",
    "brandStyle": "İnegöl Yatak Odası / 4 Çekmeceli Şifonyer",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 99,
      "depth": 40,
      "height": 82
    },
    "polyEstimate": 1788,
    "materialKind": "wood",
    "primaryHex": "#4B4F57",
    "secondaryHex": "#F2F1ED",
    "accentHex": "#2E3138",
    "searchKeywords": [
      "şifonyer",
      "çekmeceli dolap",
      "yatak odası",
      "inegöl mobilya"
    ],
    "enRef": "Movian Havel Chest of 4 Drawers, 40 x 100 x 82cm, White/Dark Grey"
  },
  {
    "mid": "B07HSH4WFB",
    "glbPath": "B/B07HSH4WFB.glb",
    "imgPath": "dc/dcfb0172.jpg\r",
    "slug": "baklava-desenli-modern-dogal-ahsap-sifonyer-92-cm",
    "name": "Baklava Desenli Modern Doğal Ahşap Şifonyer (92 cm)",
    "brandStyle": "İnegöl Modern / Geometrik Kabartmalı Şifonyer",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 92,
      "depth": 45,
      "height": 80
    },
    "polyEstimate": 4366,
    "materialKind": "wood",
    "primaryHex": "#B68E64",
    "secondaryHex": "#856442",
    "accentHex": "#2B2D33",
    "searchKeywords": [
      "şifonyer",
      "konsol",
      "ahşap şifonyer",
      "inegöl mobilya",
      "yatak odası"
    ],
    "enRef": "Rivet Modern Chest of Drawers with Diamond Pattern, 17.7 Inch Width, Natural"
  },
  {
    "mid": "B07B4W2FFY",
    "glbPath": "Y/B07B4W2FFY.glb",
    "imgPath": "3f/3f527ee3.jpg\r",
    "slug": "jonathan-ceviz-mid-century-modern-komodin-52-cm",
    "name": "Jonathan Ceviz Mid-Century Modern Komodin (52 cm)",
    "brandStyle": "İnegöl Yatak Odası / Ceviz Komodin",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 52,
      "depth": 44,
      "height": 61
    },
    "polyEstimate": 13890,
    "materialKind": "wood",
    "primaryHex": "#7A5337",
    "secondaryHex": "#523622",
    "accentHex": "#C5A059",
    "searchKeywords": [
      "komodin",
      "ceviz komodin",
      "yatak başı",
      "inegöl mobilya"
    ],
    "enRef": "Rivet Jonathan Mid-Century Modern Wood Bedside Nightstand, 20\", Walnut"
  },
  {
    "mid": "B075X3WD5T",
    "glbPath": "T/B075X3WD5T.glb",
    "imgPath": "e4/e44d54d5.jpg\r",
    "slug": "leonard-cift-tonlu-ceviz-hus-modern-komodin-56-cm",
    "name": "Leonard Çift Tonlu Ceviz & Huş Modern Komodin (56 cm)",
    "brandStyle": "İskandinav & İnegöl / İki Renkli Komodin",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 56,
      "depth": 44,
      "height": 58
    },
    "polyEstimate": 3272,
    "materialKind": "wood",
    "primaryHex": "#8C6342",
    "secondaryHex": "#E4D8C5",
    "accentHex": "#593E28",
    "searchKeywords": [
      "komodin",
      "modern komodin",
      "yatak odası",
      "yan sehpa"
    ],
    "enRef": "Rivet Mid-Century Modern Leonard 2-Tone Nightstand Table, 22\"W, Walnut, Birch Finish"
  },
  {
    "mid": "B07D42T6CX",
    "glbPath": "X/B07D42T6CX.glb",
    "imgPath": "c9/c927f8ab.jpg\r",
    "slug": "havel-2-cekmeceli-mese-beyaz-komodin-43-cm",
    "name": "Havel 2 Çekmeceli Meşe & Beyaz Komodin (43 cm)",
    "brandStyle": "Apartman Yatak Odası / Kompakt Komodin",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 43,
      "depth": 35,
      "height": 45
    },
    "polyEstimate": 1296,
    "materialKind": "wood",
    "primaryHex": "#C49E72",
    "secondaryHex": "#F2F1ED",
    "accentHex": "#7A5D40",
    "searchKeywords": [
      "komodin",
      "meşe komodin",
      "çekmeceli komodin",
      "yatak odası"
    ],
    "enRef": "Movian Havel 2-Drawer Bedside Table, 35 x 43 x 45cm, Light Brown Oak-Effect/White"
  },
  {
    "mid": "B07B7BGXN9",
    "glbPath": "9/B07B7BGXN9.glb",
    "imgPath": "df/df9a475c.jpg\r",
    "slug": "alejandra-8-kisilik-genis-ceviz-modern-yemek-masasi-197-",
    "name": "Alejandra 8 Kişilik Geniş Ceviz Modern Yemek Masası (197 cm)",
    "brandStyle": "İnegöl Yemek Odası / 8-10 Kişilik Masa",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 197,
      "depth": 107,
      "height": 79
    },
    "polyEstimate": 738,
    "materialKind": "wood",
    "primaryHex": "#7B5539",
    "secondaryHex": "#523724",
    "accentHex": "#2E241E",
    "searchKeywords": [
      "yemek masası",
      "8 kişilik masa",
      "ceviz masa",
      "inegöl yemek odası",
      "masa"
    ],
    "enRef": "Stone & Beam Alejandra Casual Wood Dining Kitchen Table, 78\"-98\"L, Brown"
  },
  {
    "mid": "B07B7BM55W",
    "glbPath": "W/B07B7BM55W.glb",
    "imgPath": "d0/d01a0991.jpg\r",
    "slug": "masif-koknar-200-cm-villa-yemek-masasi",
    "name": "Masif Köknar 200 cm Villa Yemek Masası",
    "brandStyle": "Villa Yemek Odası / Doğal Masif Masa",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 200,
      "depth": 95,
      "height": 76
    },
    "polyEstimate": 1524,
    "materialKind": "wood",
    "primaryHex": "#9C7552",
    "secondaryHex": "#6E5035",
    "accentHex": "#3A2C22",
    "searchKeywords": [
      "yemek masası",
      "masif masa",
      "villa yemek odası",
      "ahşap masa",
      "200 cm masa"
    ],
    "enRef": "Stone & Beam Reclaimed Fir Rustic Wood Dining Kitchen Table, 78.8\"L, Brown"
  },
  {
    "mid": "B07HSJJF2X",
    "glbPath": "X/B07HSJJF2X.glb",
    "imgPath": "a8/a8514877.jpg\r",
    "slug": "mango-ahsap-siyah-metal-modern-yemek-masasi-181-cm",
    "name": "Mango Ahşap & Siyah Metal Modern Yemek Masası (181 cm)",
    "brandStyle": "İnegöl Modern Loft / Siyah Ayaklı Yemek Masası",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 181,
      "depth": 89,
      "height": 77
    },
    "polyEstimate": 972,
    "materialKind": "wood",
    "primaryHex": "#A67C52",
    "secondaryHex": "#23262C",
    "accentHex": "#6E4F34",
    "searchKeywords": [
      "yemek masası",
      "siyah ayaklı masa",
      "modern masa",
      "inegöl masa",
      "6 kişilik masa"
    ],
    "enRef": "Stone & Beam Industrial Mango Wood Rectangle Dining Table, 71\"L, Black Metal Legs"
  },
  {
    "mid": "B075YMXWZC",
    "glbPath": "C/B075YMXWZC.glb",
    "imgPath": "da/da599d8f.jpg\r",
    "slug": "ceviz-mid-century-modern-6-kisilik-yemek-masasi-161-cm",
    "name": "Ceviz Mid-Century Modern 6 Kişilik Yemek Masası (161 cm)",
    "brandStyle": "İnegöl Modern / Konik Ayaklı Ceviz Masa",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 161,
      "depth": 81,
      "height": 76
    },
    "polyEstimate": 1000,
    "materialKind": "wood",
    "primaryHex": "#7E563A",
    "secondaryHex": "#543824",
    "accentHex": "#A67C52",
    "searchKeywords": [
      "yemek masası",
      "ceviz yemek masası",
      "6 kişilik masa",
      "inegöl mobilya"
    ],
    "enRef": "Rivet Mid-Century Modern Oak Dining Table, 63\"L, Walnut Finish"
  },
  {
    "mid": "B07H93GTHW",
    "glbPath": "W/B07H93GTHW.glb",
    "imgPath": "53/53cd94f9.jpg\r",
    "slug": "kuban-mese-siyah-metal-modern-yemek-masasi-158-cm",
    "name": "Kuban Meşe & Siyah Metal Modern Yemek Masası (158 cm)",
    "brandStyle": "Apartman Yemek Odası / 6 Kişilik Modern Masa",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 158,
      "depth": 88,
      "height": 74
    },
    "polyEstimate": 1120,
    "materialKind": "wood",
    "primaryHex": "#B68D60",
    "secondaryHex": "#24272C",
    "accentHex": "#7A5B3A",
    "searchKeywords": [
      "yemek masası",
      "meşe masa",
      "modern yemek masası",
      "inegöl masa"
    ],
    "enRef": "Movian Kuban Dining Table, 160 x 78 x 90cm, Brown Oak-Effect Table Top/Black Legs"
  },
  {
    "mid": "B075YQXRJM",
    "glbPath": "M/B075YQXRJM.glb",
    "imgPath": "37/379f95e3.jpg\r",
    "slug": "minimalist-ceviz-4-6-kisilik-mutfak-yemek-masasi-135-cm",
    "name": "Minimalist Ceviz 4-6 Kişilik Mutfak & Yemek Masası (135 cm)",
    "brandStyle": "İnegöl Minimal / Kompakt Ceviz Masa",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 135,
      "depth": 80,
      "height": 72
    },
    "polyEstimate": 772,
    "materialKind": "wood",
    "primaryHex": "#855C3E",
    "secondaryHex": "#593D28",
    "accentHex": "#A8815B",
    "searchKeywords": [
      "mutfak masası",
      "yemek masası",
      "4 kişilik masa",
      "ceviz masa"
    ],
    "enRef": "Rivet Mid-Century Modern Minimalist Dining Kitchen Table, 53.1\"L, Walnut Wood"
  },
  {
    "mid": "B075Z8629N",
    "glbPath": "N/B075Z8629N.glb",
    "imgPath": "a2/a282f781.jpg\r",
    "slug": "altigen-karaagac-modern-tasarim-yemek-masasi-119-cm",
    "name": "Altıgen Karaağaç Modern Tasarım Yemek Masası (Ø119 cm)",
    "brandStyle": "Mimari Tasarım / Geometrik Yemek Masası",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 113,
      "depth": 119,
      "height": 75
    },
    "polyEstimate": 390,
    "materialKind": "wood",
    "primaryHex": "#B8936A",
    "secondaryHex": "#876947",
    "accentHex": "#4A3A28",
    "searchKeywords": [
      "yuvarlak yemek masası",
      "tasarım masa",
      "ahşap masa",
      "modern masa"
    ],
    "enRef": "Rivet Modern Global Hexagonal Elm Dining Table, 47.2\"W, Natural Wood"
  },
  {
    "mid": "B07B7B8KNR",
    "glbPath": "R/B07B7B8KNR.glb",
    "imgPath": "a5/a5d30228.jpg\r",
    "slug": "yuksek-bistro-mutfak-bar-masasi-112-91-cm",
    "name": "Yüksek Bistro & Mutfak Bar Masası (112×91 cm)",
    "brandStyle": "Modern Mutfak / Yüksek Bar Masası",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 112,
      "depth": 56,
      "height": 91
    },
    "polyEstimate": 1524,
    "materialKind": "wood",
    "primaryHex": "#8E6848",
    "secondaryHex": "#5A412C",
    "accentHex": "#2B2E35",
    "searchKeywords": [
      "bar masası",
      "mutfak masası",
      "yüksek masa",
      "bistro masası"
    ],
    "enRef": "Stone & Beam Reclaimed Wood Ladder-Rung Counter-Height Dining Table Bar, 36\"H x 44\"L, Fi"
  },
  {
    "mid": "B07HSJSH2Q",
    "glbPath": "Q/B07HSJSH2Q.glb",
    "imgPath": "f8/f814a26e.jpg\r",
    "slug": "vermont-baklava-dikisli-krem-modern-yemek-sandalyesi",
    "name": "Vermont Baklava Dikişli Krem Modern Yemek Sandalyesi",
    "brandStyle": "İnegöl Modern / Kapitone Yemek Sandalyesi",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 50,
      "depth": 60,
      "height": 93
    },
    "polyEstimate": 7252,
    "materialKind": "fabric",
    "primaryHex": "#EAE6DE",
    "secondaryHex": "#C7C1B5",
    "accentHex": "#2B2E34",
    "searchKeywords": [
      "yemek sandalyesi",
      "krem sandalye",
      "kapitone sandalye",
      "inegöl sandalye"
    ],
    "enRef": "Rivet Vermont Modern Diamond-Stitched Upholstered Dining Chair, 20\"W, Set of 2, Chalk Wh"
  },
  {
    "mid": "B07B78LX2J",
    "glbPath": "J/B07B78LX2J.glb",
    "imgPath": "ca/ca017ced.jpg\r",
    "slug": "hughes-gri-dosemeli-modern-yemek-sandalyesi",
    "name": "Hughes Gri Döşemeli Modern Yemek Sandalyesi",
    "brandStyle": "İnegöl Yemek Odası / Kumaş Sandalye",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 50,
      "depth": 59,
      "height": 94
    },
    "polyEstimate": 5182,
    "materialKind": "fabric",
    "primaryHex": "#8E9196",
    "secondaryHex": "#5C4532",
    "accentHex": "#606368",
    "searchKeywords": [
      "yemek sandalyesi",
      "gri sandalye",
      "modern sandalye",
      "inegöl mobilya"
    ],
    "enRef": "Stone & Beam Hughes Casual Upholstered Dining Room Kitchen Chairs, Set of 2, Grey, Wood"
  },
  {
    "mid": "B07B79SZV1",
    "glbPath": "1/B07B79SZV1.glb",
    "imgPath": "8c/8cd63c79.jpg\r",
    "slug": "hughes-bej-kumas-ahsap-ayakli-yemek-sandalyesi",
    "name": "Hughes Bej Kumaş & Ahşap Ayaklı Yemek Sandalyesi",
    "brandStyle": "İnegöl Yemek Odası / Bej Döşemeli Sandalye",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 50,
      "depth": 61,
      "height": 94
    },
    "polyEstimate": 5588,
    "materialKind": "fabric",
    "primaryHex": "#DDD3C2",
    "secondaryHex": "#6E5138",
    "accentHex": "#B8AB96",
    "searchKeywords": [
      "yemek sandalyesi",
      "bej sandalye",
      "krem sandalye",
      "inegöl sandalye"
    ],
    "enRef": "Stone & Beam Hughes Casual Wood Dining Room Kitchen Chairs, Beige, Set of 2"
  },
  {
    "mid": "B07B7BGYVB",
    "glbPath": "B/B07B7BGYVB.glb",
    "imgPath": "33/3390e796.jpg\r",
    "slug": "ferry-modern-loft-gri-yemek-sandalyesi",
    "name": "Ferry Modern Loft Gri Yemek Sandalyesi",
    "brandStyle": "Modern Loft / Siyah Ayaklı Sandalye",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 45,
      "depth": 56,
      "height": 86
    },
    "polyEstimate": 7584,
    "materialKind": "fabric",
    "primaryHex": "#7B7E84",
    "secondaryHex": "#25282E",
    "accentHex": "#4E5158",
    "searchKeywords": [
      "yemek sandalyesi",
      "loft sandalye",
      "gri sandalye",
      "mutfak sandalyesi"
    ],
    "enRef": "Rivet Ferry Modern Industrial Dining Room Kitchen Chairs, 36 Inch Height, Set of 2, Grey"
  },
  {
    "mid": "B07BTRTC76",
    "glbPath": "6/B07BTRTC76.glb",
    "imgPath": "d7/d7467eed.jpg\r",
    "slug": "ian-ergonomik-kavisli-ahsap-kumas-yemek-sandalyesi",
    "name": "Ian Ergonomik Kavisli Ahşap & Kumaş Yemek Sandalyesi",
    "brandStyle": "İskandinav & İnegöl / Kavisli Sandalye",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 55,
      "depth": 64,
      "height": 92
    },
    "polyEstimate": 8818,
    "materialKind": "wood",
    "primaryHex": "#8C8F94",
    "secondaryHex": "#8E6846",
    "accentHex": "#5C442E",
    "searchKeywords": [
      "yemek sandalyesi",
      "iskandinav sandalye",
      "modern sandalye",
      "mutfak"
    ],
    "enRef": "Rivet Ian Modern Wood Dining Kitchen Chairs, 33 Inch Height, Set of 2, Grey"
  },
  {
    "mid": "B07HSJX7YW",
    "glbPath": "W/B07HSJX7YW.glb",
    "imgPath": "f1/f1cfcfdb.jpg\r",
    "slug": "woodley-yuksek-sirtli-gri-modern-yemek-sandalyesi",
    "name": "Woodley Yüksek Sırtlı Gri Modern Yemek Sandalyesi",
    "brandStyle": "Çağdaş Villa / Yüksek Sırtlı Sandalye",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 45,
      "depth": 61,
      "height": 103
    },
    "polyEstimate": 3936,
    "materialKind": "fabric",
    "primaryHex": "#888B90",
    "secondaryHex": "#4A3A2E",
    "accentHex": "#5E6166",
    "searchKeywords": [
      "yemek sandalyesi",
      "yüksek sandalye",
      "modern yemek odası"
    ],
    "enRef": "Stone & Beam Woodley Modern Dining Room Kitchen Chairs, Set of 2, 40\"H, Grey"
  },
  {
    "mid": "B07HSBJ7J9",
    "glbPath": "9/B07HSBJ7J9.glb",
    "imgPath": "53/5379dcd6.jpg\r",
    "slug": "woodley-lacivert-kadife-modern-yemek-sandalyesi",
    "name": "Woodley Lacivert Kadife Modern Yemek Sandalyesi",
    "brandStyle": "Butik Yemek Odası / Lacivert Sandalye",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 45,
      "depth": 61,
      "height": 103
    },
    "polyEstimate": 3936,
    "materialKind": "fabric",
    "primaryHex": "#2A3B54",
    "secondaryHex": "#4A3A2E",
    "accentHex": "#1E2B3E",
    "searchKeywords": [
      "lacivert sandalye",
      "yemek sandalyesi",
      "modern sandalye"
    ],
    "enRef": "Stone & Beam Woodley Modern Kitchen Dining Room Chairs, Set of 2, 40\"H, Navy Blue"
  },
  {
    "mid": "B075YN3HN9",
    "glbPath": "9/B075YN3HN9.glb",
    "imgPath": "45/45573415.jpg\r",
    "slug": "ray-antrasit-mid-century-modern-yemek-sandalyesi",
    "name": "Ray Antrasit Mid-Century Modern Yemek Sandalyesi",
    "brandStyle": "İnegöl Minimal / Antrasit Sandalye",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 47,
      "depth": 56,
      "height": 89
    },
    "polyEstimate": 9308,
    "materialKind": "fabric",
    "primaryHex": "#45484F",
    "secondaryHex": "#6E4D35",
    "accentHex": "#2B2D33",
    "searchKeywords": [
      "antrasit sandalye",
      "yemek sandalyesi",
      "modern sandalye"
    ],
    "enRef": "Rivet Ray Mid-Century Modern Kitchen Dining Room Chairs, Set of 2, 34.3\"H, Charcoal Faux"
  },
  {
    "mid": "B075YP32LQ",
    "glbPath": "Q/B075YP32LQ.glb",
    "imgPath": "2b/2beb6042.jpg\r",
    "slug": "florence-acik-sirtli-lacivert-modern-yemek-sandalyesi",
    "name": "Florence Açık Sırtlı Lacivert Modern Yemek Sandalyesi",
    "brandStyle": "Tasarım Yemek Odası / Kavisli Sırtlı Sandalye",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 47,
      "depth": 61,
      "height": 93
    },
    "polyEstimate": 11032,
    "materialKind": "fabric",
    "primaryHex": "#2D425E",
    "secondaryHex": "#7A5539",
    "accentHex": "#C5A059",
    "searchKeywords": [
      "modern sandalye",
      "yemek sandalyesi",
      "tasarım sandalye"
    ],
    "enRef": "Rivet Florence Mid-Century Modern Set of 2 Wide Open-Back Accent Kitchen Dining Room Cha"
  },
  {
    "mid": "B075YN3HPQ",
    "glbPath": "Q/B075YN3HPQ.glb",
    "imgPath": "89/894c9aba.jpg\r",
    "slug": "brianna-cikarilabilir-minderli-gri-yemek-sandalyesi",
    "name": "Brianna Çıkarılabilir Minderli Gri Yemek Sandalyesi",
    "brandStyle": "İskandinav Mutfak / Minderli Sandalye",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 48,
      "depth": 52,
      "height": 86
    },
    "polyEstimate": 12508,
    "materialKind": "fabric",
    "primaryHex": "#9B9EA3",
    "secondaryHex": "#7E593B",
    "accentHex": "#606368",
    "searchKeywords": [
      "mutfak sandalyesi",
      "yemek sandalyesi",
      "gri sandalye"
    ],
    "enRef": "Rivet Brianna Mid-Century Modern Kitchen Dining Room Set of 2 Removable Cushion Chairs, "
  },
  {
    "mid": "B07HSFJ2PF",
    "glbPath": "F/B07HSFJ2PF.glb",
    "imgPath": "e0/e0985d67.jpg\r",
    "slug": "siyah-metal-mese-modern-ada-mutfak-bar-sandalyesi-81-cm",
    "name": "Siyah Metal & Meşe Modern Ada Mutfak Bar Sandalyesi (81 cm)",
    "brandStyle": "İnegöl & Modern Villa / Ada Bar Taburesi",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 55,
      "depth": 52,
      "height": 81
    },
    "polyEstimate": 12092,
    "materialKind": "wood",
    "primaryHex": "#B68E62",
    "secondaryHex": "#22252A",
    "accentHex": "#7A5D3E",
    "searchKeywords": [
      "bar sandalyesi",
      "bar taburesi",
      "mutfak adası",
      "siyah metal bar"
    ],
    "enRef": "Rivet Modern Barstool 33.46\"H, Set of 2, Black and Oak"
  },
  {
    "mid": "B075YMN1VY",
    "glbPath": "Y/B075YMN1VY.glb",
    "imgPath": "fc/fc115eb9.jpg\r",
    "slug": "burke-arduvaz-gri-sirtli-mutfak-adasi-bar-sandalyesi-101",
    "name": "Burke Arduvaz Gri Sırtlı Mutfak Adası Bar Sandalyesi (101 cm)",
    "brandStyle": "Modern Mutfak Adası / Yüksek Sırtlı Bar",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 51,
      "depth": 53,
      "height": 101
    },
    "polyEstimate": 11680,
    "materialKind": "fabric",
    "primaryHex": "#6B727B",
    "secondaryHex": "#4A3A2E",
    "accentHex": "#2B2E34",
    "searchKeywords": [
      "bar sandalyesi",
      "mutfak adası",
      "gri bar sandalyesi",
      "villa mutfak"
    ],
    "enRef": "Stone & Beam Burke Modern Wood Kitchen Counter-Height Bar Stool, 40\"H, Slate Grey"
  },
  {
    "mid": "B075YP3C53",
    "glbPath": "3/B075YP3C53.glb",
    "imgPath": "15/153ea213.jpg\r",
    "slug": "julian-kapitone-modern-mutfak-bar-sandalyesi-87-cm",
    "name": "Julian Kapitone Modern Mutfak Bar Sandalyesi (87 cm)",
    "brandStyle": "Butik Mutfak / Renkli Kapitone Bar",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 49,
      "depth": 52,
      "height": 87
    },
    "polyEstimate": 10346,
    "materialKind": "fabric",
    "primaryHex": "#5B929E",
    "secondaryHex": "#4E3A2B",
    "accentHex": "#3B646E",
    "searchKeywords": [
      "bar sandalyesi",
      "kapitone tabure",
      "mutfak bar",
      "modern mutfak"
    ],
    "enRef": "Rivet Julian Minimalist Modern Tufted Dining Room Counter Height Bar Stools, Set of 2, 3"
  },
  {
    "mid": "B07B8JBR7N",
    "glbPath": "N/B07B8JBR7N.glb",
    "imgPath": "e5/e5e72cd6.jpg\r",
    "slug": "stevie-zumrut-yesili-minimalist-bar-taburesi-60-cm",
    "name": "Stevie Zümrüt Yeşili Minimalist Bar Taburesi (60 cm)",
    "brandStyle": "Modern Ada Tezgah / Kısa Bar Taburesi",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 46,
      "depth": 43,
      "height": 60
    },
    "polyEstimate": 10300,
    "materialKind": "fabric",
    "primaryHex": "#2F614A",
    "secondaryHex": "#24272C",
    "accentHex": "#1E4232",
    "searchKeywords": [
      "bar taburesi",
      "yeşil tabure",
      "mutfak adası",
      "tezgah taburesi"
    ],
    "enRef": "Rivet Stevie Mid-Century Modern Bar Stool, 30\"H, Pack of 2, Green"
  },
  {
    "mid": "B07GFLD57T",
    "glbPath": "T/B07GFLD57T.glb",
    "imgPath": "38/38ccb28b.jpg\r",
    "slug": "belaya-antrasit-genis-mimari-calisma-masasi-160-cm",
    "name": "Belaya Antrasit Geniş Mimari Çalışma Masası (160 cm)",
    "brandStyle": "Home Office & Mimar Ofisi / 160 cm Masa",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 160,
      "depth": 80,
      "height": 75
    },
    "polyEstimate": 812,
    "materialKind": "wood",
    "primaryHex": "#4C5058",
    "secondaryHex": "#2E3138",
    "accentHex": "#8E929B",
    "searchKeywords": [
      "çalışma masası",
      "ofis masası",
      "mimar masası",
      "modern masa",
      "160 cm masa"
    ],
    "enRef": "Movian Belaya Classic Desk with Curved Top, 80 x 160 x 75cm, Dark Grey"
  },
  {
    "mid": "B07HSJDN75",
    "glbPath": "5/B07HSJDN75.glb",
    "imgPath": "ca/ca592256.jpg\r",
    "slug": "ceviz-beyaz-minimalist-modern-calisma-masasi-107-cm",
    "name": "Ceviz & Beyaz Minimalist Modern Çalışma Masası (107 cm)",
    "brandStyle": "İnegöl Çalışma Odası / Ceviz-Beyaz Masa",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 107,
      "depth": 41,
      "height": 76
    },
    "polyEstimate": 1134,
    "materialKind": "wood",
    "primaryHex": "#F2F1ED",
    "secondaryHex": "#7E5639",
    "accentHex": "#D8D6D0",
    "searchKeywords": [
      "çalışma masası",
      "bilgisayar masası",
      "beyaz masa",
      "ceviz masa",
      "inegöl"
    ],
    "enRef": "Rivet Modern Computer Desk, 30\"H, Walnut and White"
  },
  {
    "mid": "B075ZBJL11",
    "glbPath": "1/B075ZBJL11.glb",
    "imgPath": "fa/fa5cc3bd.jpg\r",
    "slug": "motion-antrasit-geometrik-dokuma-buyuk-salon-halisi-300-",
    "name": "Motion Antrasit Geometrik Dokuma Büyük Salon Halısı (300×400)",
    "brandStyle": "Geniş Villa Salonu / Geometrik Yün Halı",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 409,
      "depth": 300,
      "height": 2
    },
    "polyEstimate": 432,
    "materialKind": "rug",
    "primaryHex": "#45484F",
    "secondaryHex": "#D8D4CC",
    "accentHex": "#7A7D85",
    "searchKeywords": [
      "halı",
      "salon halısı",
      "antrasit halı",
      "modern halı",
      "geometrik halı",
      "villa halı"
    ],
    "enRef": "Rivet Motion Modern Patterned Wool Area Rug, 5' x 7' 6\", Charcoal"
  },
  {
    "mid": "B07B4ZLJ7D",
    "glbPath": "D/B07B4ZLJ7D.glb",
    "imgPath": "b1/b11d5531.jpg\r",
    "slug": "hardal-krem-geometrik-yun-modern-salon-halisi-152-229",
    "name": "Hardal & Krem Geometrik Yün Modern Salon Halısı (152×229)",
    "brandStyle": "Modern Bohem / Yün Dokuma Halı",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 229,
      "depth": 152,
      "height": 1
    },
    "polyEstimate": 404,
    "materialKind": "rug",
    "primaryHex": "#C99F54",
    "secondaryHex": "#EBE5D8",
    "accentHex": "#8C6D37",
    "searchKeywords": [
      "halı",
      "salon halısı",
      "geometrik halı",
      "yün halı",
      "modern halı"
    ],
    "enRef": "Stone & Beam Casual Geometric Wool Area Rug, 7' 6\" x 5', Gold"
  },
  {
    "mid": "B07B4ZVLCN",
    "glbPath": "N/B07B4ZVLCN.glb",
    "imgPath": "33/33b75f8b.jpg\r",
    "slug": "vizon-tas-rengi-soft-desenli-yun-hali-122-183",
    "name": "Vizon & Taş Rengi Soft Desenli Yün Halı (122×183)",
    "brandStyle": "Modern-Klasik / Vizon Yün Halı",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 183,
      "depth": 122,
      "height": 1
    },
    "polyEstimate": 404,
    "materialKind": "rug",
    "primaryHex": "#B6ABA0",
    "secondaryHex": "#E5DFD5",
    "accentHex": "#7E746A",
    "searchKeywords": [
      "halı",
      "vizon halı",
      "bej halı",
      "yatak odası halısı",
      "modern halı"
    ],
    "enRef": "Stone & Beam Floral Wool Area Rug, 4 x 6 Foot, Taupe"
  },
  {
    "mid": "B0735TWZTT",
    "glbPath": "T/B0735TWZTT.glb",
    "imgPath": "00/0000b301.jpg\r",
    "slug": "bej-cizgili-modern-antre-koridor-yolluk-hali-79-244",
    "name": "Bej Çizgili Modern Antre & Koridor Yolluk Halı (79×244)",
    "brandStyle": "Antre & Koridor / Minimalist Yolluk",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 244,
      "depth": 79,
      "height": 1
    },
    "polyEstimate": 288,
    "materialKind": "rug",
    "primaryHex": "#E4DCCE",
    "secondaryHex": "#B8AE9E",
    "accentHex": "#8C8274",
    "searchKeywords": [
      "yolluk",
      "koridor halısı",
      "antre halısı",
      "bej halı",
      "halı"
    ],
    "enRef": "Stone & Beam Modern Striped Runner Rug, 2' 6\" x 8', Beige"
  },
  {
    "mid": "B071ZJ6BGG",
    "glbPath": "G/B071ZJ6BGG.glb",
    "imgPath": "20/204b09e4.jpg\r",
    "slug": "bakir-krem-noktali-yun-koridor-yollugu-68-224",
    "name": "Bakır & Krem Noktalı Yün Koridor Yolluğu (68×224)",
    "brandStyle": "Çağdaş Villa / Sıcak Ton Yolluk",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 224,
      "depth": 68,
      "height": 1
    },
    "polyEstimate": 440,
    "materialKind": "rug",
    "primaryHex": "#B87A56",
    "secondaryHex": "#EAE2D6",
    "accentHex": "#7E5137",
    "searchKeywords": [
      "yolluk",
      "halı",
      "koridor halısı",
      "bakır halı",
      "modern halı"
    ],
    "enRef": "Stone & Beam Contemporary Speckle Wool Runner Rug, 2' 3\" x 7' 6\", Copper"
  },
  {
    "mid": "B073772DH1",
    "glbPath": "1/B073772DH1.glb",
    "imgPath": "61/6151955a.jpg\r",
    "slug": "antik-pirinc-kavisli-modern-salon-lambaderi-193-cm",
    "name": "Antik Pirinç Kavisli Modern Salon Lambaderi (193 cm)",
    "brandStyle": "Lüks Villa / Altın Pirinç Köşe Lambader",
    "category": "Aydınlatma",
    "placement": "floor",
    "dimensionsCm": {
      "width": 49,
      "depth": 143,
      "height": 193
    },
    "polyEstimate": 9880,
    "materialKind": "metal",
    "primaryHex": "#C5A059",
    "secondaryHex": "#EFECE6",
    "accentHex": "#8F7038",
    "searchKeywords": [
      "lambader",
      "köşe lambası",
      "pirinç lambader",
      "kavisli lambader",
      "aydınlatma"
    ],
    "enRef": "Rivet Brass Arc Mid-Century Modern Living Room Standing Floor Lamp with Bulb, 76\"H, Bras"
  },
  {
    "mid": "B073755HVS",
    "glbPath": "S/B073755HVS.glb",
    "imgPath": "2e/2ef6ada1.jpg\r",
    "slug": "mat-siyah-kavisli-modern-salon-lambaderi-193-cm",
    "name": "Mat Siyah Kavisli Modern Salon Lambaderi (193 cm)",
    "brandStyle": "Modern Rezidans / Siyah Arc Lambader",
    "category": "Aydınlatma",
    "placement": "floor",
    "dimensionsCm": {
      "width": 49,
      "depth": 142,
      "height": 193
    },
    "polyEstimate": 6620,
    "materialKind": "metal",
    "primaryHex": "#23262C",
    "secondaryHex": "#F3F2EE",
    "accentHex": "#484D56",
    "searchKeywords": [
      "siyah lambader",
      "lambader",
      "salon aydınlatma",
      "modern lambader"
    ],
    "enRef": "Stone & Beam Modern Arc Living Room Floor Lamp With Light Bulb And White Shade - 10 x 56"
  },
  {
    "mid": "B073P3NL8C",
    "glbPath": "C/B073P3NL8C.glb",
    "imgPath": "20/205f325b.jpg\r",
    "slug": "harper-mermer-kaide-altin-pirinc-lambader-181-cm",
    "name": "Harper Mermer Kaide & Altın Pirinç Lambader (181 cm)",
    "brandStyle": "İnegöl Lüks / Mermer & Gold Lambader",
    "category": "Aydınlatma",
    "placement": "floor",
    "dimensionsCm": {
      "width": 23,
      "depth": 23,
      "height": 181
    },
    "polyEstimate": 16832,
    "materialKind": "metal",
    "primaryHex": "#C8A35B",
    "secondaryHex": "#F0EEE9",
    "accentHex": "#FFF2D6",
    "searchKeywords": [
      "lambader",
      "mermer lambader",
      "altın lambader",
      "salon lambası",
      "aydınlatma"
    ],
    "enRef": "Rivet Harper Mid-Century Marble and Brass Floor Lamp, 71\"H, with Bulb"
  },
  {
    "mid": "B0742DNY41",
    "glbPath": "1/B0742DNY41.glb",
    "imgPath": "55/552c9245.jpg\r",
    "slug": "avery-mermer-tabanli-pirinc-modern-lambader-159-cm",
    "name": "Avery Mermer Tabanlı Pirinç Modern Lambader (159 cm)",
    "brandStyle": "Minimalist Villa / Pirinç Okuma Lambaderi",
    "category": "Aydınlatma",
    "placement": "floor",
    "dimensionsCm": {
      "width": 19,
      "depth": 65,
      "height": 159
    },
    "polyEstimate": 9476,
    "materialKind": "metal",
    "primaryHex": "#BFA05E",
    "secondaryHex": "#ECEAE4",
    "accentHex": "#FFEEC8",
    "searchKeywords": [
      "lambader",
      "okuma lambası",
      "pirinç lambader",
      "modern aydınlatma"
    ],
    "enRef": "Rivet Marble and Brass Floor Lamp, Avery, 63\"H, With Bulb"
  },
  {
    "mid": "B073751DMK",
    "glbPath": "K/B073751DMK.glb",
    "imgPath": "eb/eb38cd91.jpg\r",
    "slug": "geometrik-kafesli-mat-siyah-modern-lambader-147-cm",
    "name": "Geometrik Kafesli Mat Siyah Modern Lambader (147 cm)",
    "brandStyle": "Modern Loft / Metal Kafes Lambader",
    "category": "Aydınlatma",
    "placement": "floor",
    "dimensionsCm": {
      "width": 47,
      "depth": 23,
      "height": 147
    },
    "polyEstimate": 4154,
    "materialKind": "metal",
    "primaryHex": "#24272D",
    "secondaryHex": "#FFEBC2",
    "accentHex": "#4C515C",
    "searchKeywords": [
      "lambader",
      "siyah lambader",
      "loft aydınlatma",
      "köşe lambası"
    ],
    "enRef": "Stone & Beam Modern Metal Cut-Out Living Room Standing Floor Lamp With Light Bulb - 19 x"
  },
  {
    "mid": "B07374K539",
    "glbPath": "9/B07374K539.glb",
    "imgPath": "ba/ba7a184e.jpg\r",
    "slug": "siyah-metal-cam-fanus-modern-sarkit-avize-114-cm",
    "name": "Siyah Metal & Cam Fanus Modern Sarkıt Avize (114 cm)",
    "brandStyle": "Modern Mutfak Adası & Yemek Sarkıtı",
    "category": "Aydınlatma",
    "placement": "ceiling",
    "dimensionsCm": {
      "width": 29,
      "depth": 29,
      "height": 114,
      "mountHeight": 280
    },
    "polyEstimate": 13014,
    "materialKind": "metal",
    "primaryHex": "#24272C",
    "secondaryHex": "#E4ECF2",
    "accentHex": "#FFECC4",
    "searchKeywords": [
      "avize",
      "sarkıt avize",
      "mutfak avizesi",
      "cam avize",
      "modern aydınlatma"
    ],
    "enRef": "Stone & Beam Modern Ceiling Pendant Light Chandelier Fixture With Glass Shade - 11.5 x 1"
  },
  {
    "mid": "B07HKC3S7C",
    "glbPath": "C/B07HKC3S7C.glb",
    "imgPath": "09/09cdae92.jpg\r",
    "slug": "buzlu-cam-kure-modern-yemek-odasi-sarkit-avize-96-cm",
    "name": "Buzlu Cam Küre Modern Yemek Odası Sarkıt Avize (96 cm)",
    "brandStyle": "İskandinav Villa / Opal Cam Sarkıt",
    "category": "Aydınlatma",
    "placement": "ceiling",
    "dimensionsCm": {
      "width": 24,
      "depth": 24,
      "height": 96,
      "mountHeight": 280
    },
    "polyEstimate": 13304,
    "materialKind": "glass",
    "primaryHex": "#8FA89B",
    "secondaryHex": "#F2F4F2",
    "accentHex": "#C5A059",
    "searchKeywords": [
      "sarkıt avize",
      "avize",
      "cam küre avize",
      "yemek masası avizesi"
    ],
    "enRef": "Rivet Mid-Century Outer Frosted Glass Finish Pendant Light with Bulb, 60\"H, Green"
  },
  {
    "mid": "B07B4ZP62F",
    "glbPath": "F/B07B4ZP62F.glb",
    "imgPath": "b1/b19ca854.jpg\r",
    "slug": "mat-siyah-cam-kure-minimal-tekli-sarkit-lamba",
    "name": "Mat Siyah & Cam Küre Minimal Tekli Sarkıt Lamba",
    "brandStyle": "Modern Bar & Yatak Başı Sarkıtı",
    "category": "Aydınlatma",
    "placement": "ceiling",
    "dimensionsCm": {
      "width": 8,
      "depth": 7,
      "height": 25,
      "mountHeight": 280
    },
    "polyEstimate": 17578,
    "materialKind": "metal",
    "primaryHex": "#23262C",
    "secondaryHex": "#E6EEF5",
    "accentHex": "#FFEBC4",
    "searchKeywords": [
      "sarkıt lamba",
      "tekli avize",
      "yatak başı sarkıt",
      "minimal avize"
    ],
    "enRef": "Rivet Mid-Century Modern Ceiling Hanging Glass Globe Pendant Fixture With Light Bulb - 5"
  },
  {
    "mid": "B07DBHC39X",
    "glbPath": "X/B07DBHC39X.glb",
    "imgPath": "56/56ba597b.jpg\r",
    "slug": "keten-sapkali-modern-tavan-plafonyer-avize-39-cm",
    "name": "Keten Şapkalı Modern Tavan Plafonyer Avize (Ø39 cm)",
    "brandStyle": "Yatak Odası & Koridor / Kumaş Plafonyer",
    "category": "Aydınlatma",
    "placement": "ceiling",
    "dimensionsCm": {
      "width": 39,
      "depth": 39,
      "height": 23,
      "mountHeight": 280
    },
    "polyEstimate": 8640,
    "materialKind": "fabric",
    "primaryHex": "#ECE8DF",
    "secondaryHex": "#C4CAD2",
    "accentHex": "#FFF3D8",
    "searchKeywords": [
      "plafonyer",
      "tavan lambası",
      "avize",
      "yatak odası avizesi"
    ],
    "enRef": "Ravenna Home Classic Linen Fabric Flushmount Ceiling Pendant Light Fixture with 2 LED Li"
  },
  {
    "mid": "B075X2R3BX",
    "glbPath": "X/B075X2R3BX.glb",
    "imgPath": "88/886fbc9d.jpg\r",
    "slug": "mermer-pirinc-sutun-modern-masa-abajuru-42-cm",
    "name": "Mermer & Pirinç Sütun Modern Masa Abajuru (42 cm)",
    "brandStyle": "Lüks Komodin & Konsol Abajuru",
    "category": "Aydınlatma",
    "placement": "floor",
    "dimensionsCm": {
      "width": 23,
      "depth": 23,
      "height": 42
    },
    "polyEstimate": 20086,
    "materialKind": "stone",
    "primaryHex": "#F0EEE9",
    "secondaryHex": "#C5A059",
    "accentHex": "#FAF7F0",
    "searchKeywords": [
      "abajur",
      "masa lambası",
      "mermer abajur",
      "komodin lambası"
    ],
    "enRef": "Rivet Mid-Century Modern Square Pillar Living Room Table Lamp With LED Light Bulb - 10.5"
  },
  {
    "mid": "B07374M818",
    "glbPath": "8/B07374M818.glb",
    "imgPath": "f4/f4abab47.jpg\r",
    "slug": "mermer-kaide-pirinc-modern-calisma-abajuru-41-cm",
    "name": "Mermer Kaide & Pirinç Modern Çalışma Abajuru (41 cm)",
    "brandStyle": "Minimalist Masa & Komodin Lambası",
    "category": "Aydınlatma",
    "placement": "floor",
    "dimensionsCm": {
      "width": 21,
      "depth": 21,
      "height": 41
    },
    "polyEstimate": 11122,
    "materialKind": "metal",
    "primaryHex": "#C5A059",
    "secondaryHex": "#EFECE6",
    "accentHex": "#FFECC4",
    "searchKeywords": [
      "abajur",
      "masa lambası",
      "pirinç lamba",
      "çalışma lambası"
    ],
    "enRef": "Rivet Modern Table Desk Lamp With Light Bulb - 8 x 8 x 16 Inches, Marble and Brass"
  },
  {
    "mid": "B075X2FW6F",
    "glbPath": "F/B075X2FW6F.glb",
    "imgPath": "66/66b2e3aa.jpg\r",
    "slug": "ceviz-siyah-mermer-modern-masa-abajuru-35-cm",
    "name": "Ceviz & Siyah Mermer Modern Masa Abajuru (35 cm)",
    "brandStyle": "Mid-Century / Siyah Mermer Komodin Lambası",
    "category": "Aydınlatma",
    "placement": "floor",
    "dimensionsCm": {
      "width": 20,
      "depth": 20,
      "height": 35
    },
    "polyEstimate": 9816,
    "materialKind": "stone",
    "primaryHex": "#2A2D33",
    "secondaryHex": "#7E563A",
    "accentHex": "#F2EFE9",
    "searchKeywords": [
      "abajur",
      "siyah mermer lamba",
      "masa lambası",
      "komodin abajur"
    ],
    "enRef": "Rivet Wood and Black Marble Lamp, Mid-Century Walnut, With Bulb, 18\"H"
  },
  {
    "mid": "B075X2FZSM",
    "glbPath": "M/B075X2FZSM.glb",
    "imgPath": "a7/a7b2b570.jpg\r",
    "slug": "kavisli-pirinc-ceviz-modern-masa-lambasi-55-cm",
    "name": "Kavisli Pirinç & Ceviz Modern Masa Lambası (55 cm)",
    "brandStyle": "Mimar Çalışma Masası / Pirinç Masa Lambası",
    "category": "Aydınlatma",
    "placement": "floor",
    "dimensionsCm": {
      "width": 42,
      "depth": 40,
      "height": 55
    },
    "polyEstimate": 19300,
    "materialKind": "metal",
    "primaryHex": "#C5A059",
    "secondaryHex": "#7B5337",
    "accentHex": "#FFF1D4",
    "searchKeywords": [
      "masa lambası",
      "çalışma lambası",
      "pirinç abajur",
      "ofis aydınlatma"
    ],
    "enRef": "Rivet Mid-Century Modern Curved Brass Table Desk Lamp With LED Light Bulb - 14.3 x 21.7 "
  },
  {
    "mid": "B07HKGHSR7",
    "glbPath": "7/B07HKGHSR7.glb",
    "imgPath": "72/7267bf33.jpg\r",
    "slug": "mat-siyah-antik-pirinc-silindir-sapkali-abajur-57-cm",
    "name": "Mat Siyah & Antik Pirinç Silindir Şapkalı Abajur (57 cm)",
    "brandStyle": "Modern Salon Konsol Abajuru",
    "category": "Aydınlatma",
    "placement": "floor",
    "dimensionsCm": {
      "width": 30,
      "depth": 30,
      "height": 57
    },
    "polyEstimate": 5916,
    "materialKind": "metal",
    "primaryHex": "#25282E",
    "secondaryHex": "#C5A059",
    "accentHex": "#F4F2ED",
    "searchKeywords": [
      "abajur",
      "konsol lambası",
      "siyah abajur",
      "modern aydınlatma"
    ],
    "enRef": "Rivet Modern Two Tone Table Desk Lamp with LED Light Bulb and Drum Shade - 12 x 12 x 15."
  },
  {
    "mid": "B075X2XZDY",
    "glbPath": "Y/B075X2XZDY.glb",
    "imgPath": "25/25fc07ae.jpg\r",
    "slug": "seffaf-cam-pirinc-cerceveli-modern-abajur-64-cm",
    "name": "Şeffaf Cam & Pirinç Çerçeveli Modern Abajur (64 cm)",
    "brandStyle": "Modern-Klasik Villa / Cam Abajur",
    "category": "Aydınlatma",
    "placement": "floor",
    "dimensionsCm": {
      "width": 30,
      "depth": 30,
      "height": 64
    },
    "polyEstimate": 28760,
    "materialKind": "glass",
    "primaryHex": "#C5A059",
    "secondaryHex": "#E4ECF2",
    "accentHex": "#F6F4EF",
    "searchKeywords": [
      "abajur",
      "cam abajur",
      "pirinç abajur",
      "salon aydınlatma"
    ],
    "enRef": "Rivet Mid-Century Modern Brass Trimmed Table Lamp with LED Light Bulb, 26\"H, Clear"
  },
  {
    "mid": "B07HKGY4F2",
    "glbPath": "2/B07HKGY4F2.glb",
    "imgPath": "96/9656ad8c.jpg\r",
    "slug": "modern-beton-kup-villa-dis-cephe-led-aplik-12-cm",
    "name": "Modern Beton Küp Villa Dış Cephe LED Aplik (12 cm)",
    "brandStyle": "Modern Villa Dış Cephe / Up-Down LED Aplik",
    "category": "Dış Cephe",
    "placement": "wall-mounted",
    "dimensionsCm": {
      "width": 12,
      "depth": 14,
      "height": 12,
      "mountHeight": 185
    },
    "polyEstimate": 1990,
    "materialKind": "stone",
    "primaryHex": "#383C44",
    "secondaryHex": "#FFE6B3",
    "accentHex": "#22252A",
    "searchKeywords": [
      "dış cephe aplik",
      "cephe aydınlatma",
      "villa aplik",
      "beton aplik",
      "duvar lambası"
    ],
    "enRef": "Rivet Modern Concrete Cubic Outdoor Porch Light Wall Sconce with Integrated LED Light - "
  },
  {
    "mid": "B07HKCRWSY",
    "glbPath": "Y/B07HKCRWSY.glb",
    "imgPath": "60/60f9e3ea.jpg\r",
    "slug": "buzlu-opal-cam-bronz-villa-dis-cephe-apligi-35-cm",
    "name": "Buzlu Opal Cam & Bronz Villa Dış Cephe Apliği (35 cm)",
    "brandStyle": "Villa Giriş & Teras / Dış Cephe Aplik",
    "category": "Dış Cephe",
    "placement": "wall-mounted",
    "dimensionsCm": {
      "width": 15,
      "depth": 15,
      "height": 35,
      "mountHeight": 190
    },
    "polyEstimate": 2140,
    "materialKind": "metal",
    "primaryHex": "#4E4135",
    "secondaryHex": "#F2EFE8",
    "accentHex": "#FFE8B8",
    "searchKeywords": [
      "dış cephe aplik",
      "teras lambası",
      "bahçe duvar lambası",
      "villa cephe"
    ],
    "enRef": "Rivet Modern Frosted Opal Glass Outdoor Wall Mount Sconce with Light Bulb - 5.91 x 6.97 "
  },
  {
    "mid": "B07JM714D5",
    "glbPath": "5/B07JM714D5.glb",
    "imgPath": "59/596bb0ce.jpg\r",
    "slug": "modern-cerceveli-banyo-lavabo-aynasi-84-69-cm",
    "name": "Modern Çerçeveli Banyo Lavabo Aynası (84×69 cm)",
    "brandStyle": "Modern Banyo / Siyah Çerçeveli Lavabo Aynası",
    "category": "Banyo",
    "placement": "wall-mounted",
    "dimensionsCm": {
      "width": 84,
      "depth": 3,
      "height": 69,
      "mountHeight": 115
    },
    "polyEstimate": 588,
    "materialKind": "glass",
    "primaryHex": "#25282E",
    "secondaryHex": "#DCE5EE",
    "accentHex": "#8E97A3",
    "searchKeywords": [
      "banyo aynası",
      "lavabo aynası",
      "ayna",
      "siyah çerçeveli ayna",
      "modern banyo"
    ],
    "enRef": "Rivet Industrial Framed Bathroom Wall Vanity Mirror - 33.2 x 27.2 x 0.88 Inch, Whitewash"
  },
  {
    "mid": "B07HSK9SVW",
    "glbPath": "W/B07HSK9SVW.glb",
    "imgPath": "ed/ed70534d.jpg\r",
    "slug": "ahsap-rafli-banyo-antre-duvar-aynasi-63-55-cm",
    "name": "Ahşap Raflı Banyo & Antre Duvar Aynası (63×55 cm)",
    "brandStyle": "Fonksiyonel Banyo / Raflı Lavabo Aynası",
    "category": "Banyo",
    "placement": "wall-mounted",
    "dimensionsCm": {
      "width": 63,
      "depth": 10,
      "height": 55,
      "mountHeight": 118
    },
    "polyEstimate": 656,
    "materialKind": "wood",
    "primaryHex": "#B68F66",
    "secondaryHex": "#DCE5EE",
    "accentHex": "#2A2D34",
    "searchKeywords": [
      "banyo aynası",
      "raflı ayna",
      "antre aynası",
      "duvar aynası",
      "modern banyo"
    ],
    "enRef": "Rivet Mirror Wall Shelf, 21.75\"H, Natural"
  },
  {
    "mid": "B07255WMBH",
    "glbPath": "H/B07255WMBH.glb",
    "imgPath": "ee/ee9fdf51.jpg\r",
    "slug": "altin-cerceveli-modern-boy-aynasi-81-203-cm",
    "name": "Altın Çerçeveli Modern Boy Aynası (81×203 cm)",
    "brandStyle": "Giyinme Odası & Antre / Gold Boy Aynası",
    "category": "Dekor & Bitki",
    "placement": "wall-mounted",
    "dimensionsCm": {
      "width": 81,
      "depth": 3,
      "height": 203,
      "mountHeight": 15
    },
    "polyEstimate": 324,
    "materialKind": "metal",
    "primaryHex": "#C5A059",
    "secondaryHex": "#DCE5EE",
    "accentHex": "#94743B",
    "searchKeywords": [
      "boy aynası",
      "altın ayna",
      "antre aynası",
      "giyinme odası",
      "ayna"
    ],
    "enRef": "Stone & Beam Classic Rectangular Flat Frame Mirror, 80\"H, Gold Finish"
  },
  {
    "mid": "B073WGGXFT",
    "glbPath": "T/B073WGGXFT.glb",
    "imgPath": "95/952a17c6.jpg\r",
    "slug": "ahsap-siyah-demir-modern-banyo-antre-aynasi-52-82-cm",
    "name": "Ahşap & Siyah Demir Modern Banyo/Antre Aynası (52×82 cm)",
    "brandStyle": "Modern Loft / Dikdörtgen Duvar Aynası",
    "category": "Banyo",
    "placement": "wall-mounted",
    "dimensionsCm": {
      "width": 52,
      "depth": 5,
      "height": 82,
      "mountHeight": 115
    },
    "polyEstimate": 660,
    "materialKind": "wood",
    "primaryHex": "#7B5438",
    "secondaryHex": "#24272C",
    "accentHex": "#DCE5EE",
    "searchKeywords": [
      "banyo aynası",
      "duvar aynası",
      "ahşap ayna",
      "antre aynası"
    ],
    "enRef": "Rivet Modern Wood and Iron Hanging Wall Mirror, 32.25 Inch Height, Brown and Black"
  },
  {
    "mid": "B073WHZKB2",
    "glbPath": "2/B073WHZKB2.glb",
    "imgPath": "1e/1e6ce3ab.jpg\r",
    "slug": "uzun-dikey-ahsap-metal-duvar-aynasi-34-112-cm",
    "name": "Uzun Dikey Ahşap & Metal Duvar Aynası (34×112 cm)",
    "brandStyle": "Dar Antre & Banyo / Dikey Askılı Ayna",
    "category": "Dekor & Bitki",
    "placement": "wall-mounted",
    "dimensionsCm": {
      "width": 34,
      "depth": 5,
      "height": 112,
      "mountHeight": 95
    },
    "polyEstimate": 660,
    "materialKind": "wood",
    "primaryHex": "#7A5438",
    "secondaryHex": "#24272C",
    "accentHex": "#DCE5EE",
    "searchKeywords": [
      "duvar aynası",
      "dikey ayna",
      "antre aynası",
      "ayna"
    ],
    "enRef": "Rivet Wood and Iron Rectangular Hanging Wall Mirror, 44.25 Inch Height, Brown and Black"
  },
  {
    "mid": "B075HX7JFC",
    "glbPath": "C/B075HX7JFC.glb",
    "imgPath": "d8/d813c0fe.jpg\r",
    "slug": "geometrik-beyaz-gri-seramik-saksi-25-cm",
    "name": "Geometrik Beyaz & Gri Seramik Saksı (25 cm)",
    "brandStyle": "Modern Minimal / İç Mekan Seramik Saksı",
    "category": "Dekor & Bitki",
    "placement": "floor",
    "dimensionsCm": {
      "width": 25,
      "depth": 25,
      "height": 22
    },
    "polyEstimate": 2160,
    "materialKind": "ceramic",
    "primaryHex": "#ECEBE6",
    "secondaryHex": "#8F939A",
    "accentHex": "#5C6066",
    "searchKeywords": [
      "saksı",
      "seramik saksı",
      "modern saksı",
      "salon bitkisi",
      "dekor"
    ],
    "enRef": "Rivet Geometric Ceramic Planter, 8.7\"H, White and Grey"
  },
  {
    "mid": "B07CBP6GZT",
    "glbPath": "T/B07CBP6GZT.glb",
    "imgPath": "84/844bab9e.jpg\r",
    "slug": "pudra-geometrik-modern-seramik-saksi-19-cm",
    "name": "Pudra Geometrik Modern Seramik Saksı (19 cm)",
    "brandStyle": "İskandinav Dekor / Masaüstü Seramik Saksı",
    "category": "Dekor & Bitki",
    "placement": "floor",
    "dimensionsCm": {
      "width": 19,
      "depth": 19,
      "height": 15
    },
    "polyEstimate": 2160,
    "materialKind": "ceramic",
    "primaryHex": "#D9B4AD",
    "secondaryHex": "#E8E4DC",
    "accentHex": "#A8847C",
    "searchKeywords": [
      "seramik saksı",
      "saksı",
      "sehpa dekoru",
      "modern obje"
    ],
    "enRef": "Rivet Modern Geometric Ceramic Planter, 6.5\"H, Rose"
  },
  {
    "mid": "B078JJHJFX",
    "glbPath": "X/B078JJHJFX.glb",
    "imgPath": "9c/9c954dba.jpg\r",
    "slug": "pencere-onu-banyo-yesil-seramik-uzun-saksi-28-cm",
    "name": "Pencere Önü & Banyo Yeşil Seramik Uzun Saksı (28 cm)",
    "brandStyle": "Modern Banyo & Mutfak / Sukulent Saksısı",
    "category": "Dekor & Bitki",
    "placement": "floor",
    "dimensionsCm": {
      "width": 28,
      "depth": 7,
      "height": 7
    },
    "polyEstimate": 4032,
    "materialKind": "ceramic",
    "primaryHex": "#5B7862",
    "secondaryHex": "#3E5443",
    "accentHex": "#E8E4DC",
    "searchKeywords": [
      "saksı",
      "uzun saksı",
      "pencere saksısı",
      "banyo dekoru",
      "seramik"
    ],
    "enRef": "Rivet Modern Ceramic Indoor Window Sill Planter Box Pot - 3 x 12 x 3 Inch, Green and Blu"
  },
  {
    "mid": "B075HWX46K",
    "glbPath": "K/B075HWX46K.glb",
    "imgPath": "bb/bbcc6f20.jpg\r",
    "slug": "ucgen-kabartmali-beyaz-seramik-cicek-vazosu-23-cm",
    "name": "Üçgen Kabartmalı Beyaz Seramik Çiçek Vazosu (23 cm)",
    "brandStyle": "Wabi-Sabi & Modern / Beyaz Seramik Vazo",
    "category": "Dekor & Bitki",
    "placement": "floor",
    "dimensionsCm": {
      "width": 17,
      "depth": 17,
      "height": 23
    },
    "polyEstimate": 4100,
    "materialKind": "ceramic",
    "primaryHex": "#F2F0EB",
    "secondaryHex": "#D8D5CD",
    "accentHex": "#A6A39B",
    "searchKeywords": [
      "vazo",
      "beyaz vazo",
      "seramik vazo",
      "sehpa dekoru",
      "masa vazosu"
    ],
    "enRef": "Stone & Beam Modern Farmhouse Triangle Pattern Stoneware Home Decor Flower Vase - 9 x 6."
  },
  {
    "mid": "B07B8PXTSY",
    "glbPath": "Y/B07B8PXTSY.glb",
    "imgPath": "fd/fd95ace8.jpg\r",
    "slug": "koyu-kahve-ombre-tas-seramik-vazo-26-cm",
    "name": "Koyu Kahve Ombre Taş Seramik Vazo (26 cm)",
    "brandStyle": "Modern Villa / Konsol & Sehpa Vazosu",
    "category": "Dekor & Bitki",
    "placement": "floor",
    "dimensionsCm": {
      "width": 11,
      "depth": 11,
      "height": 26
    },
    "polyEstimate": 4248,
    "materialKind": "ceramic",
    "primaryHex": "#4E3A2F",
    "secondaryHex": "#8E7A6E",
    "accentHex": "#2E221B",
    "searchKeywords": [
      "vazo",
      "seramik vazo",
      "kahverengi vazo",
      "konsol dekoru",
      "modern obje"
    ],
    "enRef": "Stone & Beam Modern Ombre Stoneware Home Decor Flower Vase - 10 Inch, Dark Brown Red Whi"
  },
  {
    "mid": "B07GFWF2GM",
    "glbPath": "M/B07GFWF2GM.glb",
    "imgPath": "9d/9d53c16c.jpg\r",
    "slug": "indre-antrasit-1-cekmeceli-modern-calisma-masasi-110-cm",
    "name": "Indre Antrasit 1 Çekmeceli Modern Çalışma Masası (110 cm)",
    "brandStyle": "Apartman Çalışma Odası / Antrasit Masa",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 110,
      "depth": 56,
      "height": 73
    },
    "polyEstimate": 660,
    "materialKind": "wood",
    "primaryHex": "#4B4E56",
    "secondaryHex": "#2E3138",
    "accentHex": "#8E939E",
    "searchKeywords": [
      "çalışma masası",
      "antrasit masa",
      "ev ofis",
      "modern masa"
    ],
    "enRef": "Movian Indre Classic 1-Drawer Desk, 56 x 110 x 73cm, Dark Grey"
  },
  {
    "mid": "B07GFWLSS4",
    "glbPath": "4/B07GFWLSS4.glb",
    "imgPath": "1c/1ce208e1.jpg\r",
    "slug": "inari-mese-kompakt-1-cekmeceli-calisma-masasi-89-cm",
    "name": "Inari Meşe Kompakt 1 Çekmeceli Çalışma Masası (89 cm)",
    "brandStyle": "Genç Odası & Home Office / Meşe Masa",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 89,
      "depth": 50,
      "height": 72
    },
    "polyEstimate": 768,
    "materialKind": "wood",
    "primaryHex": "#C49E72",
    "secondaryHex": "#8E6D49",
    "accentHex": "#5C452C",
    "searchKeywords": [
      "çalışma masası",
      "meşe masa",
      "küçük çalışma masası",
      "genç odası"
    ],
    "enRef": "Movian Inari 1-Drawer Desk, 50 x 90 x 73 cm, Light Brown/Oak Foil Finish"
  },
  {
    "mid": "B075X2LLWF",
    "glbPath": "F/B075X2LLWF.glb",
    "imgPath": "ca/ca8d91a2.jpg\r",
    "slug": "pirinc-opal-cam-kure-modern-masa-lambasi-25-cm",
    "name": "Pirinç & Opal Cam Küre Modern Masa Lambası (25 cm)",
    "brandStyle": "Minimalist Komodin / Küre Masa Lambası",
    "category": "Aydınlatma",
    "placement": "floor",
    "dimensionsCm": {
      "width": 15,
      "depth": 14,
      "height": 25
    },
    "polyEstimate": 5572,
    "materialKind": "glass",
    "primaryHex": "#C5A059",
    "secondaryHex": "#F6F4EE",
    "accentHex": "#FFE8B8",
    "searchKeywords": [
      "masa lambası",
      "küre lamba",
      "pirinç lamba",
      "komodin lambası",
      "abajur"
    ],
    "enRef": "Rivet Modern Glass Globe Living Room Table Desk Lamp With LED Light Bulb - 7 x 10 Inches"
  },
  {
    "mid": "B07B4YVX7P",
    "glbPath": "P/B07B4YVX7P.glb",
    "imgPath": "ee/ee0a8dce.jpg\r",
    "slug": "siyah-metal-kafesli-modern-komodin-abajuru-51-cm",
    "name": "Siyah Metal Kafesli Modern Komodin Abajuru (51 cm)",
    "brandStyle": "Modern Loft / Siyah Masa Lambası",
    "category": "Aydınlatma",
    "placement": "floor",
    "dimensionsCm": {
      "width": 28,
      "depth": 28,
      "height": 51
    },
    "polyEstimate": 6983,
    "materialKind": "metal",
    "primaryHex": "#25282E",
    "secondaryHex": "#F4F2ED",
    "accentHex": "#4A4E57",
    "searchKeywords": [
      "abajur",
      "siyah masa lambası",
      "komodin lambası",
      "modern aydınlatma"
    ],
    "enRef": "Stone & Beam Modern Metal Frame Living Room Table Lamp With Light Bulb - 7.5 x 5 x 20.5 "
  },
  {
    "mid": "B07B78M4DN",
    "glbPath": "N/B07B78M4DN.glb",
    "imgPath": "89/89ebd93c.jpg\r",
    "slug": "cottage-yesil-masif-ahsap-mutfak-bar-taburesi-74-cm",
    "name": "Cottage Yeşil Masif Ahşap Mutfak Bar Taburesi (74 cm)",
    "brandStyle": "Modern Country / Masif Bar Taburesi",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 46,
      "depth": 48,
      "height": 74
    },
    "polyEstimate": 9322,
    "materialKind": "wood",
    "primaryHex": "#4A6652",
    "secondaryHex": "#334739",
    "accentHex": "#8E6D4B",
    "searchKeywords": [
      "bar taburesi",
      "ahşap tabure",
      "mutfak adası",
      "yeşil tabure"
    ],
    "enRef": "Stone & Beam Cottage Wood Bar Stool, 24\"H, Green"
  },
  {
    "mid": "B072ZK2FZ6",
    "glbPath": "6/B072ZK2FZ6.glb",
    "imgPath": "93/93c615cf.jpg\r",
    "slug": "ceviz-siyah-metal-kompakt-orta-sehpa-80-cm",
    "name": "Ceviz & Siyah Metal Kompakt Orta Sehpa (80 cm)",
    "brandStyle": "Apartman Salonu / 80 cm Ceviz Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 80,
      "depth": 36,
      "height": 58
    },
    "polyEstimate": 3288,
    "materialKind": "wood",
    "primaryHex": "#7B5437",
    "secondaryHex": "#24272C",
    "accentHex": "#523622",
    "searchKeywords": [
      "orta sehpa",
      "ceviz sehpa",
      "küçük sehpa",
      "inegöl sehpa",
      "modern"
    ],
    "enRef": "Rivet Industrial Modern Wood and Metal Coffee Table, 31.5\"W, Walnut"
  },
  {
    "mid": "B07HSCRGTJ",
    "glbPath": "J/B07HSCRGTJ.glb",
    "imgPath": "af/afc06001.jpg\r",
    "slug": "2-katli-masif-ahsap-siyah-metal-kare-yan-sehpa-63-cm",
    "name": "2 Katlı Masif Ahşap & Siyah Metal Kare Yan Sehpa (63 cm)",
    "brandStyle": "Modern Loft / İki Katlı Kare Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 63,
      "depth": 63,
      "height": 68
    },
    "polyEstimate": 3256,
    "materialKind": "wood",
    "primaryHex": "#B68E62",
    "secondaryHex": "#24272C",
    "accentHex": "#7A5D3E",
    "searchKeywords": [
      "yan sehpa",
      "kare sehpa",
      "iki katlı sehpa",
      "ahşap sehpa"
    ],
    "enRef": "Stone & Beam 2-Tier Rustic Accent End Table, 26\"W, Light Wood and Dark Metal"
  },
  {
    "mid": "B074KMVDPY",
    "glbPath": "Y/B074KMVDPY.glb",
    "imgPath": "5d/5d0cfdba.jpg\r",
    "slug": "sekizgen-siyah-dogal-ahsap-modern-yan-sehpa-46-cm",
    "name": "Sekizgen Siyah & Doğal Ahşap Modern Yan Sehpa (46 cm)",
    "brandStyle": "Çağdaş Tasarım / Geometrik Yan Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 46,
      "depth": 46,
      "height": 54
    },
    "polyEstimate": 4256,
    "materialKind": "wood",
    "primaryHex": "#2A2D33",
    "secondaryHex": "#A8825A",
    "accentHex": "#5C4734",
    "searchKeywords": [
      "yan sehpa",
      "geometrik sehpa",
      "siyah sehpa",
      "modern sehpa"
    ],
    "enRef": "Stone & Beam Arie Rustic Octagonal End Table or Stand - 17.3\"W - Natural"
  },
  {
    "mid": "B07HSCJZQQ",
    "glbPath": "Q/B07HSCJZQQ.glb",
    "imgPath": "d2/d27ab591.jpg\r",
    "slug": "heather-ceviz-modern-komodin-yan-sehpa-45-cm",
    "name": "Heather Ceviz Modern Komodin & Yan Sehpa (45 cm)",
    "brandStyle": "İnegöl Minimal / Ceviz Yan Sehpa",
    "category": "Salon",
    "placement": "floor",
    "dimensionsCm": {
      "width": 45,
      "depth": 40,
      "height": 54
    },
    "polyEstimate": 4264,
    "materialKind": "wood",
    "primaryHex": "#7E563A",
    "secondaryHex": "#543824",
    "accentHex": "#C5A059",
    "searchKeywords": [
      "yan sehpa",
      "ceviz sehpa",
      "komodin",
      "inegöl mobilya"
    ],
    "enRef": "Rivet Heather Modern End Table, 17.7 Inch Weight, Walnut"
  },
  {
    "mid": "B075YP3BD8",
    "glbPath": "8/B075YP3BD8.glb",
    "imgPath": "b9/b9a95e29.jpg\r",
    "slug": "bergen-kapitone-arduvaz-gri-modern-yemek-sandalyesi",
    "name": "Bergen Kapitone Arduvaz Gri Modern Yemek Sandalyesi",
    "brandStyle": "İnegöl Yemek Odası / Kapitone Sandalye",
    "category": "Yemek & Mutfak",
    "placement": "floor",
    "dimensionsCm": {
      "width": 51,
      "depth": 58,
      "height": 91
    },
    "polyEstimate": 10690,
    "materialKind": "fabric",
    "primaryHex": "#6A717A",
    "secondaryHex": "#4A3A2E",
    "accentHex": "#3E434A",
    "searchKeywords": [
      "yemek sandalyesi",
      "kapitone sandalye",
      "gri sandalye",
      "inegöl"
    ],
    "enRef": "Stone & Beam Bergen Tufted Kitchen Dining Room Table Farmhouse Chairs, 38.6\"H, Set of 2,"
  }
];

export const ABO_MODERN_FURNITURE_ASSETS: ArchitecturalAsset[] =
  CURATED_ABO_DEFS.map(buildAboAsset);
