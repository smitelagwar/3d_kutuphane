import type { ArchitecturalAsset, AssetCategory } from './catalogTypes';

function normalizeTurkish(input: string): string {
  return input
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();
}

export interface ProductGroupMeta {
  id: string;
  label: string;
  category: AssetCategory;
}

export interface TaxonomyCategoryNode {
  category: AssetCategory;
  count: number;
  groups: Array<{
    id: string;
    label: string;
    count: number;
  }>;
}

/**
 * Ordered master list of fine-grained Turkish architectural product groups.
 * Drives both the left faceted taxonomy sidebar and same-type similar product recommendations.
 */
export const PRODUCT_GROUP_ORDER: ProductGroupMeta[] = [
  // Oda Tasarımları (5 full-room groups for Blender AI item extraction & scene assembly)
  { id: 'oda-salon', label: 'Salon Oda Tasarımı', category: 'Oda Tasarımları' },
  { id: 'oda-yatak', label: 'Yatak Odası Tasarımı', category: 'Oda Tasarımları' },
  { id: 'oda-mutfak', label: 'Mutfak & Set Tasarımı', category: 'Oda Tasarımları' },
  { id: 'oda-banyo', label: 'Banyo Oda Tasarımı', category: 'Oda Tasarımları' },
  { id: 'oda-daire', label: 'Komple Daire & Ev İçi', category: 'Oda Tasarımları' },

  // Çamaşır Odası (6 dedicated Turkish laundry room product groups)
  { id: 'camasir-yan-yana-dolap', label: 'Yan Yana & Villa Çamaşır Dolabı', category: 'Çamaşır Odası' },
  { id: 'camasir-ust-uste-dolap', label: 'Üst Üste & Eviyeli Çamaşır Dolabı', category: 'Çamaşır Odası' },
  { id: 'camasir-temiz-kirli-sepet', label: 'Temiz-Kirli Sepet & Ayırma Dolabı', category: 'Çamaşır Odası' },
  { id: 'camasir-makine-kurutma', label: 'Çamaşır & Kurutma Makinesi', category: 'Çamaşır Odası' },
  { id: 'camasir-utu-kurutma-aski', label: 'Ütü Dolabı, Masası & Kurutmalık', category: 'Çamaşır Odası' },
  { id: 'camasir-evye-deterjan', label: 'Çamaşır Evyesi & Deterjan Dekoru', category: 'Çamaşır Odası' },

  // Banyo (12 exact Turkish groups)
  { id: 'lavabo-bataryasi', label: 'Lavabo Bataryası', category: 'Banyo' },
  { id: 'dus-seti-tepe-dus', label: 'Duş Seti & Tepe Duş', category: 'Banyo' },
  { id: 'dusakabin', label: 'Duşakabin', category: 'Banyo' },
  { id: 'kuvet', label: 'Küvet', category: 'Banyo' },
  { id: 'klozet-pisuvar', label: 'Klozet, Alaturka & Pisuvar', category: 'Banyo' },
  { id: 'gomme-rezervuar-panel', label: 'Gömme Rezervuar & Kumanda Paneli', category: 'Banyo' },
  { id: 'banyo-dolabi', label: 'Banyo Dolabı', category: 'Banyo' },
  { id: 'lavabo', label: 'Lavabo', category: 'Banyo' },
  { id: 'havlupan-havluluk', label: 'Havlupan & Havluluk', category: 'Banyo' },
  { id: 'tuvalet-kagitligi', label: 'Tuvalet Kağıtlığı', category: 'Banyo' },
  { id: 'banyo-halisi', label: 'Banyo Halısı & Tekstil', category: 'Banyo' },
  { id: 'banyo-aynasi-aplik', label: 'Banyo Aynası & Aplik', category: 'Banyo' },
  { id: 'banyo-aksesuari', label: 'Aksesuar & Çamaşır', category: 'Banyo' },

  // Salon (8 groups)
  { id: 'kose-koltuk', label: 'L Köşe Koltuk', category: 'Salon' },
  { id: 'uclu-ikili-koltuk', label: 'Üçlü & İkili Koltuk', category: 'Salon' },
  { id: 'berjer-tekli', label: 'Berjer & Tekli Koltuk', category: 'Salon' },
  { id: 'puf-sedir', label: 'Puf & Sedir', category: 'Salon' },
  { id: 'orta-zigon-sehpa', label: 'Orta & Zigon Sehpa', category: 'Salon' },
  { id: 'tv-unitesi-konsol', label: 'TV Ünitesi, Şömine & Konsol', category: 'Salon' },
  { id: 'salon-halisi', label: 'Salon Halısı', category: 'Salon' },
  { id: 'kitaplik-raf', label: 'Kitaplık & Raf', category: 'Salon' },

  // Yatak Odası (4 groups)
  { id: 'cift-kisilik-yatak', label: 'Çift Kişilik Yatak & Karyola', category: 'Yatak Odası' },
  { id: 'gardirop-giyinme', label: 'Gardırop & Giyinme Dolabı', category: 'Yatak Odası' },
  { id: 'komodin-sifonyer', label: 'Komodin, Şifonyer & Makyaj', category: 'Yatak Odası' },
  { id: 'genc-cocuk-odasi', label: 'Genç, Ranza & Duvar Yatağı', category: 'Yatak Odası' },

  // Yemek & Mutfak (5 groups)
  { id: 'mutfak-dolabi-ada', label: 'Mutfak Dolabı & Ada', category: 'Yemek & Mutfak' },
  { id: 'ankastre-beyaz-esya', label: 'Ankastre & Beyaz Eşya', category: 'Yemek & Mutfak' },
  { id: 'yemek-masasi', label: 'Yemek & Mutfak Masası', category: 'Yemek & Mutfak' },
  { id: 'sandalye-tabure', label: 'Sandalye & Bar Taburesi', category: 'Yemek & Mutfak' },
  { id: 'mutfak-konsol-dolap', label: 'Konsol, Vitrin & Kiler', category: 'Yemek & Mutfak' },

  // Mimari & Çalışma (7 groups)
  { id: 'ic-kapi-surgu', label: 'İç, Dış & Çelik Kapı', category: 'Mimari & Çalışma' },
  { id: 'priz-elektrik-tesisat', label: 'Elektrik, Priz, Sigorta & Diafon', category: 'Mimari & Çalışma' },
  { id: 'mekanik-dogalgaz-isitma', label: 'Kombi, Kalorifer, Doğalgaz & Tesisat', category: 'Mimari & Çalışma' },
  { id: 'pencere-perde', label: 'Pencere, Jaluzi & Perde', category: 'Mimari & Çalışma' },
  { id: 'merdiven-yapi', label: 'Asansör, Merdiven & Yapı', category: 'Mimari & Çalışma' },
  { id: 'calisma-ofis', label: 'Çalışma Masası & Ofis', category: 'Mimari & Çalışma' },
  { id: 'antre-vestiyer', label: 'Antre, Vestiyer & Portmanto', category: 'Mimari & Çalışma' },

  // Aydınlatma (3 groups)
  { id: 'avize-sarkit', label: 'Avize, Sarkıt & Ray Spot', category: 'Aydınlatma' },
  { id: 'masa-lambasi-abajur', label: 'Masa Lambası & Abajur', category: 'Aydınlatma' },
  { id: 'lambader-aplik', label: 'Lambader & Aplik', category: 'Aydınlatma' },

  // Dekor & Bitki (2 groups)
  { id: 'ic-mekan-bitkisi', label: 'İç Mekan Bitkisi', category: 'Dekor & Bitki' },
  { id: 'vazo-dekor-obje', label: 'Vazo, Tablo & Obje', category: 'Dekor & Bitki' },

  // Dış Cephe (2 groups)
  { id: 'pergola-bahce-oturma', label: 'Pergola, Kamelya & Oturma', category: 'Dış Cephe' },
  { id: 'dis-mekan-peyzaj', label: 'Dış Aydınlatma & Peyzaj', category: 'Dış Cephe' },
];

const GROUP_BY_ID = new Map<string, ProductGroupMeta>(
  PRODUCT_GROUP_ORDER.map((g) => [g.id, g]),
);

export function getProductGroupMeta(groupId: string): ProductGroupMeta | undefined {
  return GROUP_BY_ID.get(groupId);
}

/**
 * Deterministically classifies any architectural asset into a fine-grained Turkish product group.
 * Ensures e.g. "Lavabo Bataryası" is cleanly separated from "Tepe Duş", and "Tuvalet Kağıtlığı"
 * is separated from "Havluluk" for pinpoint browsing and sibling recommendations.
 */
export function classifyAssetGroup(asset: ArchitecturalAsset): ProductGroupMeta {
  const nameNorm = normalizeTurkish(asset.name);
  const blob = normalizeTurkish(
    `${asset.name} ${asset.brandStyle} ${asset.subCategory || ''} ${asset.searchKeywords.join(' ')}`,
  );

  if (asset.category === 'Oda Tasarımları') {
    if (/banyo/.test(nameNorm)) {
      return GROUP_BY_ID.get('oda-banyo')!;
    }
    if (/mutfak/.test(nameNorm)) {
      return GROUP_BY_ID.get('oda-mutfak')!;
    }
    if (/yatak odas|suite|yatak/.test(nameNorm)) {
      return GROUP_BY_ID.get('oda-yatak')!;
    }
    if (/daire|ev ic|rezidans|villa ic mekan|toplanti/.test(nameNorm)) {
      return GROUP_BY_ID.get('oda-daire')!;
    }
    return GROUP_BY_ID.get('oda-salon')!;
  }

  if (asset.category === 'Çamaşır Odası') {
    if (
      asset.archetype === 'laundry_side_by_side_elevated' ||
      asset.archetype === 'laundry_side_by_side_counter' ||
      asset.archetype === 'laundry_villa_quad_wall'
    ) {
      return GROUP_BY_ID.get('camasir-yan-yana-dolap')!;
    }
    if (
      asset.archetype === 'laundry_stacked_tower_hamper' ||
      asset.archetype === 'laundry_stacked_sink_combo' ||
      asset.archetype === 'laundry_utility_broom_closet' ||
      asset.archetype === 'laundry_compact_banyo_tower'
    ) {
      return GROUP_BY_ID.get('camasir-ust-uste-dolap')!;
    }
    if (
      asset.archetype === 'laundry_clean_dirty_sorter' ||
      /sepet|kirli|ayirma/.test(nameNorm)
    ) {
      return GROUP_BY_ID.get('camasir-temiz-kirli-sepet')!;
    }
    if (/utu|steamer|kirisik|kurutmalik|kurutma aski|giysi aski/.test(nameNorm)) {
      return GROUP_BY_ID.get('camasir-utu-kurutma-aski')!;
    }
    if (/evye|lavabo|deterjan|yumusatici|sise/.test(nameNorm)) {
      return GROUP_BY_ID.get('camasir-evye-deterjan')!;
    }
    return GROUP_BY_ID.get('camasir-makine-kurutma')!;
  }

  if (asset.category === 'Banyo') {
    // 1. Tuvalet Kağıtlığı vs Havlupan & Havluluk (check Turkish 'kağıdı' -> 'kagidi' & 'kağıt' -> 'kagit')
    if (
      asset.subCategory === 'Havluluk & Kağıtlık' ||
      /havlupan|havluluk|havlu aski|kagitlik|kagidi|tuvalet kagit/.test(nameNorm)
    ) {
      if (/kagid|kagit|rulo/.test(nameNorm)) {
        return GROUP_BY_ID.get('tuvalet-kagitligi')!;
      }
      return GROUP_BY_ID.get('havlupan-havluluk')!;
    }

    // 2. Banyo Aynası & Aplik (must precede lavabo/aksesuar so 'Lavabo Aynası' stays in mirrors!)
    if (
      asset.subCategory === 'Banyo Aynası & Aplik' ||
      (/ayna|aplik|mirror/.test(nameNorm) && !/dolab|dolap/.test(nameNorm))
    ) {
      return GROUP_BY_ID.get('banyo-aynasi-aplik')!;
    }

    // 2b. Aksesuar & Çamaşır (must precede klozet regex so 'Klozet Fırçalığı' stays in accessories!)
    if (
      (asset.subCategory === 'Aksesuar & Çamaşır' && !/dolab|dolap/.test(nameNorm)) ||
      /fircalik|fircaligi|sabunluk|cop kovasi|camasir|sepet|dispenser|havlu kurut/.test(nameNorm)
    ) {
      return GROUP_BY_ID.get('banyo-aksesuari')!;
    }

    // 2c. Gömme Rezervuar & Kumanda Paneli (Geberit Sigma20 / Sigma30)
    if (
      asset.archetype === 'tr_geberit_flush_plate' ||
      /kumanda paneli|sigma20|sigma30|sifon butonu/.test(nameNorm)
    ) {
      return GROUP_BY_ID.get('gomme-rezervuar-panel')!;
    }

    // 3. Klozet, Alaturka & Pisuvar (exclude over-toilet cabinets/organizers -> route to banyo-dolabi / banyo-aksesuari)
    if (
      asset.archetype === 'tr_alaturka_squat_toilet' ||
      ((asset.subCategory === 'Klozet & Pisuvar' ||
        /\bklozet\b|\bpisuvar\b|\balaturka\b|hela tasi|\btoilet\b|\burinal\b/.test(nameNorm)) &&
        !/firca|kagid|kagit|klozet ustu|duzenleyici|dolab|dolap/.test(nameNorm))
    ) {
      return GROUP_BY_ID.get('klozet-pisuvar')!;
    }

    // 4. Küvet vs Duşakabin ('Küvet Üstü Cam Duş Paneli' is a shower screen -> Duşakabin; 'Küveti' -> Küvet!)
    if (asset.subCategory === 'Duşakabin & Küvet' || /dusakabin|kuvet|dus paneli|dus teknesi/.test(nameNorm)) {
      if (/kuvet|jakuzi|bathtub/.test(nameNorm) && !/dus paneli|cam panel|katlanir cam|dusakabin/.test(nameNorm)) {
        return GROUP_BY_ID.get('kuvet')!;
      }
      return GROUP_BY_ID.get('dusakabin')!;
    }

    // 5. Banyo Dolabı vs Lavabo (must precede faucet regex so 'Çift Bataryalı Lavabo' stays in Lavabo!)
    if (asset.subCategory === 'Banyo Dolabı & Lavabo') {
      if (/dolab|dolap|boy dolab|etajer|komodin|cekmece|kapakli/.test(nameNorm)) {
        return GROUP_BY_ID.get('banyo-dolabi')!;
      }
      if (/lavabo|canak|evye|basin/.test(nameNorm)) {
        return GROUP_BY_ID.get('lavabo')!;
      }
      return GROUP_BY_ID.get('banyo-dolabi')!;
    }

    // 6. Lavabo Bataryası vs Duş Seti & Tepe Duş
    if (
      asset.subCategory === 'Duş Seti & Batarya' ||
      /batarya|musluk|dus basligi|dus seti|dus robotu|tepe dus|el dusu/.test(nameNorm)
    ) {
      if (/lavabo batarya|lavabo muslug|canak.*batarya|tezgah ustu.*batarya|armatur.*lavabo|musluk seti/.test(nameNorm)) {
        return GROUP_BY_ID.get('lavabo-bataryasi')!;
      }
      if (/dus basligi|tepe dus|dus robotu|dus seti|el dusu|dus batarya|dus kolonu|yagmurlama|ankastre dus|termostatik dus/.test(nameNorm)) {
        return GROUP_BY_ID.get('dus-seti-tepe-dus')!;
      }
      if (/batarya|musluk|faucet/.test(nameNorm)) {
        return GROUP_BY_ID.get('lavabo-bataryasi')!;
      }
      return GROUP_BY_ID.get('dus-seti-tepe-dus')!;
    }

    // 6b. Fallback for non-subcategorized vanity/basin/cabinet items
    if (/banyo.*dolab|banyo.*dolap|duvar dolab|lavabo|vanity/.test(nameNorm)) {
      if (/dolab|dolap|boy dolab|etajer|komodin|cekmece|kapakli/.test(nameNorm)) {
        return GROUP_BY_ID.get('banyo-dolabi')!;
      }
      return GROUP_BY_ID.get('lavabo')!;
    }

    // 7. Banyo Halısı & Tekstil
    if (asset.subCategory === 'Banyo Halısı & Tekstil' || /banyo halisi|paspas|havlu seti|bornoz|kilim/.test(nameNorm)) {
      return GROUP_BY_ID.get('banyo-halisi')!;
    }

    return GROUP_BY_ID.get('banyo-aksesuari')!;
  }

  if (asset.category === 'Salon') {
    if (asset.archetype === 'modern_rug' || /hali|halisi|kilim|yolluk|yollug|rug|carpet/.test(nameNorm)) {
      return GROUP_BY_ID.get('salon-halisi')!;
    }
    if (/kose koltuk|\bl koltuk\b|\bl kose\b|uzanmali.*koltuk|sezlonglu.*kose/.test(nameNorm)) {
      return GROUP_BY_ID.get('kose-koltuk')!;
    }
    if (/berjer|tekli koltuk|lounge|okuma koltugu|doner koltuk/.test(nameNorm)) {
      return GROUP_BY_ID.get('berjer-tekli')!;
    }
    if (/\bpuf|ottoman|sedir|bench|daybed|settee|bank\b|banki/.test(nameNorm)) {
      return GROUP_BY_ID.get('puf-sedir')!;
    }
    if (
      asset.archetype === 'tr_modern_fireplace' ||
      /tv unite|tv sehpa|televizyon|smart tv|led tv|salon tv|tasarim tv|konsol|dresuar|sideboard|vitrin|dolap|somine|piyano/.test(
        nameNorm,
      )
    ) {
      return GROUP_BY_ID.get('tv-unitesi-konsol')!;
    }
    if (/kitaplik|kitaplig|raf\b|rafi\b|raf unite/.test(nameNorm)) {
      return GROUP_BY_ID.get('kitaplik-raf')!;
    }
    if (/sehpa|zigon|komodin/.test(nameNorm)) {
      return GROUP_BY_ID.get('orta-zigon-sehpa')!;
    }
    if (/koltuk|kanepe|sofa/.test(blob)) {
      return GROUP_BY_ID.get('uclu-ikili-koltuk')!;
    }
    return GROUP_BY_ID.get('orta-zigon-sehpa')!;
  }

  if (asset.category === 'Yatak Odası') {
    if (/gardiro[pb]|giyinme|elbise dolab/.test(nameNorm)) {
      return GROUP_BY_ID.get('gardirop-giyinme')!;
    }
    if (/komodin|sifonyer|makyaj|taki dolab|aynal.*dolab/.test(nameNorm)) {
      return GROUP_BY_ID.get('komodin-sifonyer')!;
    }
    if (/ranza|duvar yatag|murphy|yavrulu|genc|cocuk/.test(nameNorm)) {
      return GROUP_BY_ID.get('genc-cocuk-odasi')!;
    }
    return GROUP_BY_ID.get('cift-kisilik-yatak')!;
  }

  if (asset.category === 'Yemek & Mutfak') {
    if (/sandalye|tabure|bar sandalye|bench/.test(nameNorm)) {
      return GROUP_BY_ID.get('sandalye-tabure')!;
    }
    if (/masa\b|masasi/.test(nameNorm) && !/ada|tezgah/.test(nameNorm)) {
      return GROUP_BY_ID.get('yemek-masasi')!;
    }
    if (
      asset.archetype === 'tr_pullout_kitchen_faucet' ||
      (/evye|eviye|batarya/.test(nameNorm) && !/bulasik/.test(nameNorm))
    ) {
      return GROUP_BY_ID.get('mutfak-dolabi-ada')!;
    }
    if (
      /buzdolab|bulasik|ankastre|firin|ocak|davlumbaz|mikrodalga|kahve|espresso|sarap|beyaz esya|induksiyon/.test(
        nameNorm,
      )
    ) {
      return GROUP_BY_ID.get('ankastre-beyaz-esya')!;
    }
    if (/mutfak adas|alt mutfak|ust mutfak|mutfak dolab|tezgah|studyo mutfak/.test(nameNorm)) {
      return GROUP_BY_ID.get('mutfak-dolabi-ada')!;
    }
    return GROUP_BY_ID.get('mutfak-konsol-dolap')!;
  }

  if (asset.category === 'Mimari & Çalışma') {
    if (
      asset.archetype === 'tr_elevator_landing' ||
      asset.archetype === 'tr_elevator_cabin' ||
      /asansor|merdiven|yapi/.test(nameNorm)
    ) {
      return GROUP_BY_ID.get('merdiven-yapi')!;
    }
    if (
      asset.archetype === 'tr_schuko_socket' ||
      asset.archetype === 'tr_fuse_box' ||
      asset.archetype === 'tr_video_intercom' ||
      asset.archetype === 'tr_tv_data_socket' ||
      /priz|schuko|komutator|duvar anahtari|sigorta|diafon|interkom|rj45|uydu/.test(nameNorm)
    ) {
      return GROUP_BY_ID.get('priz-elektrik-tesisat')!;
    }
    if (
      asset.archetype === 'tr_condensing_boiler' ||
      asset.archetype === 'tr_panel_radiator' ||
      asset.archetype === 'tr_gas_valve_assembly' ||
      asset.archetype === 'tr_gas_meter_g4' ||
      asset.archetype === 'tr_manifold_cabinet' ||
      asset.archetype === 'tr_vertical_radiator' ||
      asset.archetype === 'tr_room_thermostat' ||
      asset.archetype === 'tr_split_ac_unit' ||
      asset.archetype === 'tr_water_meter_group' ||
      /kombi|radyator|petek|kalorifer|dogalgaz|kollektor|termostat|klima|su sayaci|tesisat/.test(nameNorm)
    ) {
      return GROUP_BY_ID.get('mekanik-dogalgaz-isitma')!;
    }
    if (/pencere|vasistas|jaluzi|perde|stor|dograma/.test(nameNorm)) {
      return GROUP_BY_ID.get('pencere-perde')!;
    }
    if (/kapi|surgu|surme|katlanir.*kapi/.test(nameNorm)) {
      return GROUP_BY_ID.get('ic-kapi-surgu')!;
    }
    if (/portmanto|vestiyer|ayakkabilik|aski|antre/.test(nameNorm)) {
      return GROUP_BY_ID.get('antre-vestiyer')!;
    }
    return GROUP_BY_ID.get('calisma-ofis')!;
  }

  if (asset.category === 'Aydınlatma') {
    if (/avize|sarkit|tavan|vantilator|chandel|pendant/.test(nameNorm) || asset.placement === 'ceiling') {
      return GROUP_BY_ID.get('avize-sarkit')!;
    }
    if (/lambader|ayakli lamba|aplik|duvar lambasi|fener/.test(nameNorm) || asset.placement === 'wall-mounted') {
      return GROUP_BY_ID.get('lambader-aplik')!;
    }
    return GROUP_BY_ID.get('masa-lambasi-abajur')!;
  }

  if (asset.category === 'Dekor & Bitki') {
    if (/bitki|saksi|palmiye|monstera|zeytin|agac|cicek|sukulent|kaktus|plant/.test(blob)) {
      return GROUP_BY_ID.get('ic-mekan-bitkisi')!;
    }
    return GROUP_BY_ID.get('vazo-dekor-obje')!;
  }

  // Dış Cephe
  if (/pergola|kamelya|gazebo|oturma|bank|masa|sandalye|sezlong|salincak/.test(nameNorm)) {
    return GROUP_BY_ID.get('pergola-bahce-oturma')!;
  }
  return GROUP_BY_ID.get('dis-mekan-peyzaj')!;
}

/**
 * Builds the full 2-level hierarchical taxonomy tree with exact live counts per category and sub-group.
 */
export function buildTaxonomyTree(assets: ArchitecturalAsset[]): TaxonomyCategoryNode[] {
  const categoryOrder: AssetCategory[] = [
    'Oda Tasarımları',
    'Çamaşır Odası',
    'Banyo',
    'Salon',
    'Yatak Odası',
    'Yemek & Mutfak',
    'Mimari & Çalışma',
    'Aydınlatma',
    'Dekor & Bitki',
    'Dış Cephe',
  ];

  const catCounts = new Map<AssetCategory, number>();
  const groupCounts = new Map<string, number>();

  for (const asset of assets) {
    catCounts.set(asset.category, (catCounts.get(asset.category) ?? 0) + 1);
    const grp = classifyAssetGroup(asset);
    groupCounts.set(grp.id, (groupCounts.get(grp.id) ?? 0) + 1);
  }

  return categoryOrder.map((category) => {
    const groups = PRODUCT_GROUP_ORDER.filter((g) => g.category === category)
      .map((g) => ({
        id: g.id,
        label: g.label,
        count: groupCounts.get(g.id) ?? 0,
      }))
      .filter((g) => g.count > 0);

    return {
      category,
      count: catCounts.get(category) ?? 0,
      groups,
    };
  });
}

/**
 * Finds the most relevant sibling assets for the currently inspected model.
 * Priority:
 *  1) Exact same fine-grained productGroup (e.g., viewing a Lavabo Bataryası -> returns other Lavabo Bataryası models!)
 *  2) Same subCategory (if productGroup has fewer items than `limit`)
 *  3) Same category with highest keyword + placement + scale similarity
 */
export function getSimilarAssets(
  activeAsset: ArchitecturalAsset,
  allAssets: ArchitecturalAsset[],
  limit = 12,
): { groupLabel: string; groupId: string; items: ArchitecturalAsset[] } {
  const activeGroup = classifyAssetGroup(activeAsset);
  const activeTokens = new Set(
    normalizeTurkish(`${activeAsset.name} ${activeAsset.searchKeywords.join(' ')}`)
      .split(/\s+/)
      .filter((t) => t.length >= 3),
  );

  const scored: Array<{ asset: ArchitecturalAsset; score: number }> = [];

  for (const candidate of allAssets) {
    if (candidate.id === activeAsset.id) continue;
    const candGroup = classifyAssetGroup(candidate);

    let score = 0;
    if (candGroup.id === activeGroup.id) {
      score += 1000;
    } else if (activeAsset.subCategory && candidate.subCategory === activeAsset.subCategory) {
      score += 320;
    } else if (candidate.category === activeAsset.category) {
      score += 100;
    } else {
      continue;
    }

    if (candidate.placement === activeAsset.placement) {
      score += 25;
    }

    const candTokens = normalizeTurkish(`${candidate.name} ${candidate.searchKeywords.join(' ')}`)
      .split(/\s+/)
      .filter((t) => t.length >= 3);
    let overlap = 0;
    for (const tok of candTokens) {
      if (activeTokens.has(tok)) overlap += 1;
    }
    score += Math.min(80, overlap * 12);

    // Subtle preference for closer width scale within the same product group
    const widthDiff = Math.abs(candidate.dimensionsCm.width - activeAsset.dimensionsCm.width);
    score += Math.max(0, 20 - widthDiff * 0.15);

    scored.push({ asset: candidate, score });
  }

  scored.sort((a, b) => b.score - a.score);

  // If we have >= 4 exact same-group siblings, only show exact siblings unless user needs more
  const exactSiblings = scored.filter((s) => s.score >= 1000);
  const picked =
    exactSiblings.length >= 4
      ? exactSiblings.slice(0, limit).map((s) => s.asset)
      : scored.slice(0, limit).map((s) => s.asset);

  return {
    groupId: activeGroup.id,
    groupLabel: activeGroup.label,
    items: picked,
  };
}
