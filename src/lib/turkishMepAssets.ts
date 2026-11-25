import type {
  ArchitecturalAsset,
  AssetArchetype,
  AssetCategory,
  AssetDimensionsCm,
  BathroomSubCategory,
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
// AUTHENTIC TURKISH MEP & ELEVATOR FINISH BANKS
// ============================================================================

const FUSE_BOX_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'sigorta-beyaz-fume-kapak',
    label: 'Sıva Altı Beyaz · Füme Şeffaf Kapak',
    comboSummary: 'Çerçeve: RAL 9003 Beyaz · Kapak: Füme Şeffaf Polikarbon · Sigortalar: C16/C25 Otomat',
    materialKind: 'ceramic',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#F4F6F8', roughness: 0.22, metalness: 0.04, partLabel: 'Beyaz Pano Çerçevesi' },
      secondary: { hex: '#E4E8EE', roughness: 0.34, metalness: 0.08, partLabel: 'DIN Ray & Otomat Gövde' },
      accent: { hex: '#2563EB', roughness: 0.35, metalness: 0.15, partLabel: 'Sigorta Mandal & Kaçak Akım' },
      glass: { hex: '#374151', opacity: 0.42, roughness: 0.08 },
    },
  }),
  makeFinish({
    id: 'sigorta-beyaz-opak-kapak',
    label: 'Sıva Altı Beyaz · Opak Beyaz Kapak',
    comboSummary: 'Çerçeve & Kapak: Mat Beyaz · İç Tesisat: DIN Ray + 30mA Kaçak Akım Rölesi',
    materialKind: 'ceramic',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#F7F8FA', roughness: 0.2, metalness: 0.03, partLabel: 'Mat Beyaz Gövde' },
      secondary: { hex: '#E8ECF1', roughness: 0.3, metalness: 0.05, partLabel: 'Opak Kapak & İç Kasa' },
      accent: { hex: '#1D4ED8', roughness: 0.32, metalness: 0.15, partLabel: 'Mandal & Röle Test Tuşu' },
      glass: { hex: '#F1F5F9', opacity: 0.86, roughness: 0.18 },
    },
  }),
  makeFinish({
    id: 'sigorta-antrasit-fume',
    label: 'Mimari Antrasit · Koyu Füme Kapak',
    comboSummary: 'Çerçeve: RAL 7016 Mat Antrasit · Kapak: Koyu Füme Şeffaf · İç Ray: Galvaniz Çelik',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#323740', roughness: 0.38, metalness: 0.22, partLabel: 'Antrasit Çerçeve' },
      secondary: { hex: '#23272F', roughness: 0.42, metalness: 0.2, partLabel: 'İç Pano Modülü' },
      accent: { hex: '#0EA5E9', roughness: 0.3, metalness: 0.2, partLabel: 'Otomat Mandalları' },
      glass: { hex: '#1F2937', opacity: 0.52, roughness: 0.07 },
    },
  }),
  makeFinish({
    id: 'sigorta-krem-seffaf',
    label: 'Sıcak Krem · Şeffaf Bronz Kapak',
    comboSummary: 'Çerçeve: Sıcak Krem Polikarbon · Kapak: Bronz Şeffaf · Baralar: Bakır',
    materialKind: 'ceramic',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#EFE9DC', roughness: 0.24, metalness: 0.03, partLabel: 'Krem Pano Çerçevesi' },
      secondary: { hex: '#DFD8CA', roughness: 0.34, metalness: 0.06, partLabel: 'İç Gövde' },
      accent: { hex: '#B45309', roughness: 0.28, metalness: 0.82, partLabel: 'Bakır Bara & Mandal' },
      glass: { hex: '#57534E', opacity: 0.4, roughness: 0.08 },
    },
  }),
  makeFinish({
    id: 'sigorta-endustriyel-gri',
    label: 'Endüstriyel IP65 Gri · Füme Kapak',
    comboSummary: 'Gövde: RAL 7035 Teknik Gri · Kapak: Conta Korumalı Füme · Kilit: Çelik Mandal',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#CBD2DA', roughness: 0.38, metalness: 0.28, partLabel: 'RAL 7035 Teknik Gövde' },
      secondary: { hex: '#9BA5B2', roughness: 0.42, metalness: 0.34, partLabel: 'Conta & Montaj Kasa' },
      accent: { hex: '#DC2626', roughness: 0.35, metalness: 0.12, partLabel: 'Ana Kesici & Uyarı' },
      glass: { hex: '#334155', opacity: 0.46, roughness: 0.09 },
    },
  }),
];

const INTERCOM_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'audio-parlak-beyaz-cam',
    label: 'Audio Parlak Beyaz Cam · Gümüş Çerçeve',
    comboSummary: 'Ön Yüzey: Temperli Beyaz Cam · Ekran: 7" HD IPS · Kenar: Eloksal Gümüş',
    materialKind: 'glass',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#F6F8FA', roughness: 0.1, metalness: 0.04, partLabel: 'Beyaz Temperli Cam' },
      secondary: { hex: '#131922', roughness: 0.08, metalness: 0.15, partLabel: '7" HD Ekran & Çerçeve' },
      accent: { hex: '#D0D6DE', roughness: 0.2, metalness: 0.9, partLabel: 'Eloksal Gümüş Kenar' },
    },
  }),
  makeFinish({
    id: 'audio-piano-siyah-cam',
    label: 'Audio Piano Siyah Cam · Füme Alüminyum',
    comboSummary: 'Ön Yüzey: Piano Black Cam · Ekran: 7" Dokunmatik · Kenar: Füme Alüminyum',
    materialKind: 'glass',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#1B1E24', roughness: 0.09, metalness: 0.14, partLabel: 'Piano Siyah Cam' },
      secondary: { hex: '#0F131A', roughness: 0.08, metalness: 0.18, partLabel: 'Dokunmatik Ekran' },
      accent: { hex: '#64748B', roughness: 0.24, metalness: 0.88, partLabel: 'Füme Alüminyum Şerit' },
    },
  }),
  makeFinish({
    id: 'audio-antrasit-sampanya',
    label: 'Mat Antrasit · Şampanya Gold Çerçeve',
    comboSummary: 'Gövde: Mat Antrasit Cam · Kenar: Fırçalı Şampanya Gold · Dokunmatik İkonlar',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#2D3139', roughness: 0.22, metalness: 0.22, partLabel: 'Antrasit Cam Gövde' },
      secondary: { hex: '#141820', roughness: 0.1, metalness: 0.15, partLabel: '7" IPS Ekran' },
      accent: { hex: '#C9A86A', roughness: 0.24, metalness: 0.92, partLabel: 'Şampanya Gold Kenar' },
    },
  }),
  makeFinish({
    id: 'audio-fircali-inox',
    label: 'Fırçalı İnox · Siyah Ekran',
    comboSummary: 'Gövde: Fırçalı Paslanmaz Çelik · Ekran: Siyah Çerçeveli 7" HD Panel',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#C8CFD8', roughness: 0.26, metalness: 0.88, partLabel: 'Fırçalı İnox Gövde' },
      secondary: { hex: '#14171E', roughness: 0.09, metalness: 0.14, partLabel: '7" Ekran Paneli' },
      accent: { hex: '#E2E8F0', roughness: 0.16, metalness: 0.94, partLabel: 'Krom Detay' },
    },
  }),
  makeFinish({
    id: 'audio-kasmir-bronz',
    label: 'Kaşmir Mat · Saten Bronz Çerçeve',
    comboSummary: 'Gövde: Sıcak Kaşmir · Ekran: 7" HD IPS · Kenar: Saten Bronz',
    materialKind: 'ceramic',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#DDD5C9', roughness: 0.24, metalness: 0.04, partLabel: 'Kaşmir Gövde' },
      secondary: { hex: '#181C24', roughness: 0.1, metalness: 0.15, partLabel: '7" HD Ekran' },
      accent: { hex: '#A48050', roughness: 0.26, metalness: 0.88, partLabel: 'Saten Bronz Kenar' },
    },
  }),
];

const VIKO_SOCKET_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'viko-karre-beyaz-sat-data',
    label: 'Viko Karre Parlak Beyaz · Krom',
    comboSummary: 'Çerçeve: Parlak Beyaz · Soketler: TV/SAT Koaksiyel + RJ45 Cat6 Data',
    materialKind: 'ceramic',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#F6F7F9', roughness: 0.18, metalness: 0.02, partLabel: 'Beyaz İkili Çerçeve' },
      secondary: { hex: '#EBEDF0', roughness: 0.24, metalness: 0.03, partLabel: 'TV & Data Modülü' },
      accent: { hex: '#D3D9E0', roughness: 0.15, metalness: 0.94, partLabel: 'F-Konnektör & Metal Pin' },
    },
  }),
  makeFinish({
    id: 'viko-karre-antrasit-sat-data',
    label: 'Mat Antrasit (RAL 7016) · Çelik',
    comboSummary: 'Çerçeve & Modül: Mat Antrasit · Konnektörler: Nikel Kaplı Pirinç',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#333840', roughness: 0.36, metalness: 0.16, partLabel: 'Antrasit Çerçeve' },
      secondary: { hex: '#262A31', roughness: 0.42, metalness: 0.12, partLabel: 'Soket Yüzeyi' },
      accent: { hex: '#CBD2DA', roughness: 0.18, metalness: 0.92, partLabel: 'Konnektör Metali' },
    },
  }),
  makeFinish({
    id: 'viko-karre-krem-sat-data',
    label: 'Viko Karre Sıcak Krem · Pirinç',
    comboSummary: 'Çerçeve & Modül: Sıcak Krem · Konnektör: Pirinç Kaplama',
    materialKind: 'ceramic',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#F0E8D8', roughness: 0.22, metalness: 0.02, partLabel: 'Krem Çerçeve' },
      secondary: { hex: '#E4DAC6', roughness: 0.28, metalness: 0.02, partLabel: 'İç Modül' },
      accent: { hex: '#C7A35B', roughness: 0.22, metalness: 0.9, partLabel: 'Pirinç Konnektör' },
    },
  }),
  makeFinish({
    id: 'viko-karre-siyah-sat-data',
    label: 'Mat Siyah · Füme Metal',
    comboSummary: 'Çerçeve: Mat Siyah · Modül: Kadife Siyah · Konnektör: Gunmetal',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#1F2228', roughness: 0.38, metalness: 0.18, partLabel: 'Mat Siyah Çerçeve' },
      secondary: { hex: '#16191F', roughness: 0.42, metalness: 0.14, partLabel: 'Soket Modülü' },
      accent: { hex: '#6B7280', roughness: 0.25, metalness: 0.88, partLabel: 'Füme Konnektör' },
    },
  }),
  makeFinish({
    id: 'viko-karre-gumus-sat-data',
    label: 'Füme Gümüş Metalik · Krom',
    comboSummary: 'Çerçeve: Fırçalı Gümüş · Modül: Metalik Gri · Konnektör: Krom',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#B8C0CA', roughness: 0.26, metalness: 0.78, partLabel: 'Metalik Gümüş Çerçeve' },
      secondary: { hex: '#9AA3AF', roughness: 0.32, metalness: 0.68, partLabel: 'Gri Modül' },
      accent: { hex: '#E2E8F0', roughness: 0.14, metalness: 0.95, partLabel: 'Krom Konnektör' },
    },
  }),
];

const GAS_VALVE_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'igdas-sari-boru-pirinc-vana',
    label: 'İGDAŞ Sarı Çelik Boru · E.C.A. Pirinç Vana',
    comboSummary: 'Boru & Vana Kolu: TS EN 331 Emniyet Sarısı · Vana Gövdesi: Dövme Pirinç · Flex: Paslanmaz',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#EAB308', roughness: 0.3, metalness: 0.28, partLabel: 'İGDAŞ Emniyet Sarısı Boru' },
      secondary: { hex: '#C8A24A', roughness: 0.24, metalness: 0.92, partLabel: 'E.C.A. Dövme Pirinç Vana' },
      accent: { hex: '#CBD3DC', roughness: 0.22, metalness: 0.94, partLabel: 'Paslanmaz Çelik Flex Hortum' },
    },
  }),
  makeFinish({
    id: 'beyaz-boyali-boru-sari-kol',
    label: 'Beyaz Boyalı Doğalgaz Borusu · Sarı E.C.A. Vana',
    comboSummary: 'Boru: Mutfak Uyumlu Beyaz Boyalı · Vana Kolu: Standart Sarı · Vana: Nikel Pirinç',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#F3F5F8', roughness: 0.26, metalness: 0.12, partLabel: 'Beyaz Boyalı Çelik Boru' },
      secondary: { hex: '#D4D9E0', roughness: 0.18, metalness: 0.94, partLabel: 'Nikel Kaplı E.C.A. Vana' },
      accent: { hex: '#EAB308', roughness: 0.34, metalness: 0.18, partLabel: 'Sarı Küresel Vana Kolu' },
    },
  }),
  makeFinish({
    id: 'antrasit-boru-sari-kol',
    label: 'Antrasit Loft Boru · Pirinç & Sarı Emniyet Kolu',
    comboSummary: 'Boru: Mat Antrasit · Vana: Dövme Pirinç · Kelebek Kol: İGDAŞ Sarısı',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#343A44', roughness: 0.38, metalness: 0.45, partLabel: 'Antrasit Çelik Boru' },
      secondary: { hex: '#C8A24A', roughness: 0.24, metalness: 0.92, partLabel: 'Pirinç Vana Gövdesi' },
      accent: { hex: '#FACC15', roughness: 0.32, metalness: 0.2, partLabel: 'Sarı Emniyet Kolu' },
    },
  }),
  makeFinish({
    id: 'galvaniz-boru-nikel-vana',
    label: 'Galvaniz Tesisat Borusu · Nikel E.C.A. Vana',
    comboSummary: 'Boru: Galvaniz Çelik · Vana: Nikel Kaplama · Flex: Sarı Makaronlu Çelik',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#B4BDC8', roughness: 0.34, metalness: 0.82, partLabel: 'Galvaniz Çelik Boru' },
      secondary: { hex: '#D6DCE3', roughness: 0.18, metalness: 0.94, partLabel: 'Nikel Vana Gövdesi' },
      accent: { hex: '#EAB308', roughness: 0.32, metalness: 0.16, partLabel: 'Sarı Makaron & Kol' },
    },
  }),
  makeFinish({
    id: 'bakir-boru-sari-kol',
    label: 'Bakır Tesisat Hattı · Pirinç Vana & Sarı Kol',
    comboSummary: 'Boru: Satine Bakır · Vana: Pirinç · Kol: TS EN 331 Sarı',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#B8734A', roughness: 0.26, metalness: 0.9, partLabel: 'Satine Bakır Boru' },
      secondary: { hex: '#D0AE5A', roughness: 0.24, metalness: 0.92, partLabel: 'Pirinç Vana' },
      accent: { hex: '#EAB308', roughness: 0.3, metalness: 0.16, partLabel: 'Sarı Emniyet Kolu' },
    },
  }),
];

const GAS_METER_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'elster-galvaniz-gri-sari',
    label: 'Elster Standart Galvaniz Gri · Sarı Vana',
    comboSummary: 'Sayaç Gövdesi: RAL 7035 Galvaniz Sac · Vana & Regülatör: Sarı/Pirinç · Endeks: 8 Haneli m³',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#C7CFD8', roughness: 0.34, metalness: 0.56, partLabel: 'Galvaniz Çelik Sayaç Gövde' },
      secondary: { hex: '#374151', roughness: 0.38, metalness: 0.45, partLabel: 'Regülatör & Bağlantı Rakoru' },
      accent: { hex: '#EAB308', roughness: 0.32, metalness: 0.22, partLabel: 'İGDAŞ Sarı Küresel Vana' },
    },
  }),
  makeFinish({
    id: 'elektromed-beyaz-emaye',
    label: 'Elektromed Beyaz Boyalı · Sarı Vana',
    comboSummary: 'Gövde: Elektrostatik Beyaz · Boru & Vana: Sarı Emniyet Kolu · Pirinç Rakor',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#EFF2F6', roughness: 0.26, metalness: 0.24, partLabel: 'Beyaz Boyalı Sayaç' },
      secondary: { hex: '#4B5563', roughness: 0.36, metalness: 0.5, partLabel: 'Rakor & Regülatör' },
      accent: { hex: '#EAB308', roughness: 0.32, metalness: 0.2, partLabel: 'Sarı Gaz Vanası' },
    },
  }),
  makeFinish({
    id: 'elster-acik-mavi-endustriyel',
    label: 'Teknik Gri-Mavi · Pirinç Rakor',
    comboSummary: 'Gövde: İGDAŞ/BursaGaz Teknik Gri-Mavi · Rakor: Pirinç · Vana: Sarı',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#94A8BE', roughness: 0.34, metalness: 0.46, partLabel: 'Teknik Gri-Mavi Gövde' },
      secondary: { hex: '#C7A24C', roughness: 0.24, metalness: 0.9, partLabel: 'Pirinç Rakor & Somun' },
      accent: { hex: '#EAB308', roughness: 0.32, metalness: 0.2, partLabel: 'Sarı Gaz Vanası' },
    },
  }),
  makeFinish({
    id: 'elster-antrasit-balkon',
    label: 'Balkon Uyumlu Antrasit · Sarı Emniyet',
    comboSummary: 'Gövde: RAL 7016 Antrasit · Rakor: Çelik · Vana: Emniyet Sarısı',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#3B424D', roughness: 0.38, metalness: 0.48, partLabel: 'Antrasit Sayaç Gövde' },
      secondary: { hex: '#9CA3AF', roughness: 0.24, metalness: 0.88, partLabel: 'Çelik Rakor' },
      accent: { hex: '#FACC15', roughness: 0.3, metalness: 0.18, partLabel: 'Sarı Vana Kolu' },
    },
  }),
  makeFinish({
    id: 'elster-ham-galvaniz',
    label: 'Ham Çelik Galvaniz · Pirinç Regülatör',
    comboSummary: 'Gövde: Fırçalı Galvaniz · Regülatör: Dövme Pirinç · Vana: Sarı',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#B3BBC4', roughness: 0.3, metalness: 0.8, partLabel: 'Galvaniz Gövde' },
      secondary: { hex: '#CCA652', roughness: 0.24, metalness: 0.92, partLabel: 'Pirinç Regülatör' },
      accent: { hex: '#EAB308', roughness: 0.32, metalness: 0.18, partLabel: 'Sarı Gaz Vanası' },
    },
  }),
];

const MANIFOLD_CABINET_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'kollektor-acik-kesit-pirinc',
    label: 'Beyaz Kasa · İç Pirinç Kollektör (Mimari Kesit)',
    comboSummary: 'Dolap: RAL 9016 Sıva Altı Beyaz · Kollektör: Dövme Pirinç + Debimetre · Hatlar: Kırmızı/Mavi PEX',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#F4F6F9', roughness: 0.24, metalness: 0.18, partLabel: 'RAL 9016 Metal Kasa' },
      secondary: { hex: '#D4AD52', roughness: 0.22, metalness: 0.92, partLabel: '8\'li Pirinç Kollektör & Purjör' },
      accent: { hex: '#DC2626', roughness: 0.34, metalness: 0.14, partLabel: 'Gidiş/Dönüş Vanaları & PEX' },
      glass: { hex: '#E2E8F0', opacity: 0.18, roughness: 0.1 },
    },
  }),
  makeFinish({
    id: 'kollektor-beyaz-kapakli',
    label: 'RAL 9016 Beyaz Panjurlu Kapak · Pirinç İç',
    comboSummary: 'Kapak & Kasa: Elektrostatik Beyaz Sac · Kilit: Krom · İç Kollektör: Pirinç',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#F6F7F9', roughness: 0.22, metalness: 0.16, partLabel: 'Beyaz Sac Kapak' },
      secondary: { hex: '#C8A24A', roughness: 0.24, metalness: 0.92, partLabel: 'Pirinç Kollektör' },
      accent: { hex: '#2563EB', roughness: 0.34, metalness: 0.15, partLabel: 'Dönüş Vana & Debimetre' },
      glass: { hex: '#F8FAFC', opacity: 0.78, roughness: 0.24 },
    },
  }),
  makeFinish({
    id: 'kollektor-antrasit-paslanmaz',
    label: 'Antrasit Kasa · Paslanmaz Çelik Kollektör',
    comboSummary: 'Dolap: RAL 7016 Mat Antrasit · Kollektör: 304 Paslanmaz Çelik + Debimetre',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#343942', roughness: 0.36, metalness: 0.32, partLabel: 'Antrasit Metal Kasa' },
      secondary: { hex: '#D5DCE4', roughness: 0.18, metalness: 0.94, partLabel: '304 Paslanmaz Kollektör' },
      accent: { hex: '#EF4444', roughness: 0.34, metalness: 0.14, partLabel: 'Kırmızı/Mavi Vanalar' },
      glass: { hex: '#334155', opacity: 0.22, roughness: 0.1 },
    },
  }),
  makeFinish({
    id: 'kollektor-krem-pirinc',
    label: 'Sıcak Krem Kasa · Pirinç Kollektör',
    comboSummary: 'Dolap: Sıcak Krem · Kollektör: Dövme Pirinç · Kilit: Krom',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#EFE9DC', roughness: 0.26, metalness: 0.14, partLabel: 'Krem Metal Kasa' },
      secondary: { hex: '#CFA84E', roughness: 0.22, metalness: 0.92, partLabel: 'Pirinç Kollektör' },
      accent: { hex: '#DC2626', roughness: 0.34, metalness: 0.14, partLabel: 'Vana & Debimetre' },
      glass: { hex: '#F5F0E6', opacity: 0.22, roughness: 0.12 },
    },
  }),
  makeFinish({
    id: 'kollektor-galvaniz-teknik',
    label: 'Galvaniz Teknik Şaft · Pirinç Kollektör',
    comboSummary: 'Dolap: Galvaniz Sac · Kollektör: 8 Ağızlı Pirinç · Hatlar: Oksijen Bariyerli PEX-A',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#C2C9D2', roughness: 0.34, metalness: 0.65, partLabel: 'Galvaniz Kasa' },
      secondary: { hex: '#D2AA4E', roughness: 0.22, metalness: 0.92, partLabel: 'Pirinç Kollektör' },
      accent: { hex: '#2563EB', roughness: 0.34, metalness: 0.15, partLabel: 'Vanalar & PEX Hatlar' },
      glass: { hex: '#CBD5E1', opacity: 0.18, roughness: 0.1 },
    },
  }),
];

const VERTICAL_RADIATOR_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'dikey-radyator-antrasit-krom',
    label: 'Mat Antrasit (RAL 7016) · Krom Termostatik Vana',
    comboSummary: 'Gövde: RAL 7016 Kumlu Antrasit Alüminyum · Alt Vana: Parlak Krom E.C.A. Termostatik',
    materialKind: 'metal',
    comboRole: 'towel_hardware',
    partFinishes: {
      primary: { hex: '#343942', roughness: 0.42, metalness: 0.44, partLabel: 'Mat Antrasit Alüminyum Dilimler' },
      secondary: { hex: '#23272F', roughness: 0.46, metalness: 0.38, partLabel: 'Arka Kollektör & Konsol' },
      accent: { hex: '#DCE2E8', roughness: 0.12, metalness: 0.96, partLabel: 'Krom Termostatik Vana' },
    },
  }),
  makeFinish({
    id: 'dikey-radyator-mat-beyaz',
    label: 'Mat Beyaz (RAL 9016) · Beyaz-Krom Vana',
    comboSummary: 'Gövde: RAL 9016 Mat Beyaz Alüminyum · Vana: Beyaz Başlıklı Krom',
    materialKind: 'metal',
    comboRole: 'towel_hardware',
    partFinishes: {
      primary: { hex: '#F4F6F9', roughness: 0.26, metalness: 0.14, partLabel: 'Mat Beyaz Alüminyum' },
      secondary: { hex: '#E3E7EE', roughness: 0.32, metalness: 0.18, partLabel: 'Kollektör & Askı' },
      accent: { hex: '#DFE5EC', roughness: 0.12, metalness: 0.96, partLabel: 'Krom Vana' },
    },
  }),
  makeFinish({
    id: 'dikey-radyator-mat-siyah',
    label: 'Mat Siyah (RAL 9005) · Siyah Termostatik Vana',
    comboSummary: 'Gövde: İnce Kumlu Mat Siyah · Vana: Mat Siyah Köşe Vana Seti',
    materialKind: 'metal',
    comboRole: 'towel_hardware',
    partFinishes: {
      primary: { hex: '#1E2127', roughness: 0.44, metalness: 0.36, partLabel: 'Mat Siyah Dilimler' },
      secondary: { hex: '#14171C', roughness: 0.48, metalness: 0.32, partLabel: 'Arka Kasa' },
      accent: { hex: '#2B3038', roughness: 0.32, metalness: 0.82, partLabel: 'Mat Siyah Vana' },
    },
  }),
  makeFinish({
    id: 'dikey-radyator-eloksal-gumus',
    label: 'Fırçalı Eloksal Gümüş · Krom Vana',
    comboSummary: 'Gövde: Fırçalı Alüminyum Eloksal · Vana: Parlak Krom',
    materialKind: 'metal',
    comboRole: 'towel_hardware',
    partFinishes: {
      primary: { hex: '#CBD2DA', roughness: 0.26, metalness: 0.88, partLabel: 'Eloksal Gümüş Dilimler' },
      secondary: { hex: '#A5AEBA', roughness: 0.32, metalness: 0.82, partLabel: 'Kollektör' },
      accent: { hex: '#E5EAF0', roughness: 0.1, metalness: 0.96, partLabel: 'Krom Vana' },
    },
  }),
  makeFinish({
    id: 'dikey-radyator-kasmir-bronz',
    label: 'Sıcak Kaşmir · Fırçalı Bronz Vana',
    comboSummary: 'Gövde: Mat Kaşmir Bej Alüminyum · Vana: Saten Bronz Termostatik',
    materialKind: 'metal',
    comboRole: 'towel_hardware',
    partFinishes: {
      primary: { hex: '#CFC6B8', roughness: 0.38, metalness: 0.22, partLabel: 'Kaşmir Alüminyum Dilimler' },
      secondary: { hex: '#B7AD9E', roughness: 0.42, metalness: 0.2, partLabel: 'Kollektör' },
      accent: { hex: '#A88250', roughness: 0.24, metalness: 0.9, partLabel: 'Saten Bronz Vana' },
    },
  }),
];

const BAYMAK_BOILER_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'baymak-parlak-beyaz-mavi',
    label: 'Baymak Parlak Beyaz · Mavi LCD · Bakır',
    comboSummary: 'Gövde: RAL 9016 Parlak Beyaz · Ekran: Dairesel Mavi LCD · Tesisat: Sarı Gaz & Bakır Vanalar',
    materialKind: 'ceramic',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#F6F8FA', roughness: 0.12, metalness: 0.08, partLabel: 'Baymak Beyaz Emaye Gövde' },
      secondary: { hex: '#1E3A8A', roughness: 0.14, metalness: 0.2, partLabel: 'Baymak Lacivert LCD Panel' },
      accent: { hex: '#C69D53', roughness: 0.26, metalness: 0.9, partLabel: 'Pirinç & Sarı Gaz Vanası' },
    },
  }),
  makeFinish({
    id: 'baymak-mat-beyaz-siyah',
    label: 'Baymak Mat Beyaz · Siyah Ekran · Krom',
    comboSummary: 'Gövde: Mat Beyaz · Ekran: Siyah Çerçeveli LCD · Tesisat: Krom Vanalar',
    materialKind: 'ceramic',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#EEF0F3', roughness: 0.34, metalness: 0.06, partLabel: 'Mat Beyaz Gövde' },
      secondary: { hex: '#181C24', roughness: 0.12, metalness: 0.18, partLabel: 'Siyah Kontrol Paneli' },
      accent: { hex: '#D4DAE2', roughness: 0.16, metalness: 0.94, partLabel: 'Krom Vana Seti' },
    },
  }),
  makeFinish({
    id: 'baymak-inox-siyah',
    label: 'Fırçalı İnox · Siyah LCD · Pirinç',
    comboSummary: 'Gövde: Fırçalı Çelik · Ekran: Siyah Cam LCD · Vanalar: Pirinç',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#C6CDD6', roughness: 0.26, metalness: 0.86, partLabel: 'Fırçalı İnox Gövde' },
      secondary: { hex: '#141820', roughness: 0.12, metalness: 0.22, partLabel: 'Siyah LCD Panel' },
      accent: { hex: '#C69D53', roughness: 0.26, metalness: 0.9, partLabel: 'Pirinç Vanalar' },
    },
  }),
  makeFinish({
    id: 'baymak-antrasit-cam',
    label: 'Mat Antrasit · Siyah Ekran · Krom',
    comboSummary: 'Gövde: RAL 7016 Antrasit · Ekran: Siyah LCD · Vanalar: Krom',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#343A44', roughness: 0.34, metalness: 0.36, partLabel: 'Antrasit Gövde' },
      secondary: { hex: '#11141B', roughness: 0.1, metalness: 0.2, partLabel: 'Siyah Panel' },
      accent: { hex: '#DCE2E8', roughness: 0.14, metalness: 0.95, partLabel: 'Krom Vana Grubu' },
    },
  }),
  makeFinish({
    id: 'baymak-krem-bakir',
    label: 'Sıcak Krem · Antrasit Panel · Bakır',
    comboSummary: 'Gövde: Sıcak Krem · Ekran: Antrasit LCD · Tesisat: Bakır',
    materialKind: 'ceramic',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#F0EAE0', roughness: 0.2, metalness: 0.05, partLabel: 'Krem Emaye Gövde' },
      secondary: { hex: '#262C36', roughness: 0.16, metalness: 0.16, partLabel: 'Antrasit LCD' },
      accent: { hex: '#B8784A', roughness: 0.24, metalness: 0.9, partLabel: 'Bakır Tesisat' },
    },
  }),
];

const THERMOSTAT_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'cosa-parlak-beyaz-oled',
    label: 'Parlak Beyaz Cam · Sıcak Turuncu/Beyaz OLED',
    comboSummary: 'Gövde: Parlak Beyaz Cam · Ekran: 22.5°C OLED Halka · Kenar: Gümüş Alüminyum',
    materialKind: 'glass',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#F7F8FA', roughness: 0.1, metalness: 0.04, partLabel: 'Beyaz Cam Gövde' },
      secondary: { hex: '#141820', roughness: 0.08, metalness: 0.16, partLabel: 'OLED Ekran' },
      accent: { hex: '#D4DAE2', roughness: 0.18, metalness: 0.92, partLabel: 'Alüminyum Çerçeve' },
    },
  }),
  makeFinish({
    id: 'cosa-piano-siyah-oled',
    label: 'Piano Siyah Cam · Füme Metal Çerçeve',
    comboSummary: 'Gövde: Piano Siyah Cam · Ekran: Beyaz/Amber OLED · Kenar: Füme Metal',
    materialKind: 'glass',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#1A1D24', roughness: 0.09, metalness: 0.14, partLabel: 'Piano Siyah Cam' },
      secondary: { hex: '#0D1016', roughness: 0.08, metalness: 0.18, partLabel: 'OLED Ekran' },
      accent: { hex: '#6B7280', roughness: 0.24, metalness: 0.88, partLabel: 'Füme Metal Kenar' },
    },
  }),
  makeFinish({
    id: 'cosa-antrasit-gold',
    label: 'Mat Antrasit · Şampanya Gold Halka',
    comboSummary: 'Gövde: Mat Antrasit · Çevirme Halkası: Fırçalı Gold',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#2E323A', roughness: 0.32, metalness: 0.24, partLabel: 'Antrasit Gövde' },
      secondary: { hex: '#11141B', roughness: 0.1, metalness: 0.15, partLabel: 'OLED Ekran' },
      accent: { hex: '#C8A45E', roughness: 0.22, metalness: 0.92, partLabel: 'Gold Çerçeve' },
    },
  }),
  makeFinish({
    id: 'cosa-krem-krom',
    label: 'Sıcak Krem · Parlak Krom Kenar',
    comboSummary: 'Gövde: Sıcak Krem · Kenar: Krom · Ekran: Dijital OLED',
    materialKind: 'ceramic',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#EFE8DA', roughness: 0.2, metalness: 0.04, partLabel: 'Krem Gövde' },
      secondary: { hex: '#1B1F27', roughness: 0.1, metalness: 0.15, partLabel: 'OLED Ekran' },
      accent: { hex: '#E2E8F0', roughness: 0.12, metalness: 0.95, partLabel: 'Krom Kenar' },
    },
  }),
  makeFinish({
    id: 'cosa-gumus-inox',
    label: 'Fırçalı Alüminyum Gümüş · Siyah OLED',
    comboSummary: 'Gövde: Fırçalı Gümüş · Ekran: Siyah Cam OLED',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#C5CCD5', roughness: 0.26, metalness: 0.88, partLabel: 'Alüminyum Gövde' },
      secondary: { hex: '#12151C', roughness: 0.08, metalness: 0.16, partLabel: 'OLED Ekran' },
      accent: { hex: '#E5EAF0', roughness: 0.14, metalness: 0.94, partLabel: 'Krom Şerit' },
    },
  }),
];

const SPLIT_AC_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'daikin-mat-beyaz-gumus',
    label: 'Daikin Mat Kristal Beyaz · Gümüş Şerit',
    comboSummary: 'Gövde: Kristal Mat Beyaz · Hava Kanatçığı: Beyaz · Dekor Şerit: Fırçalı Gümüş · LED: 23°C',
    materialKind: 'ceramic',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#F6F8FA', roughness: 0.2, metalness: 0.04, partLabel: 'Kristal Beyaz Ön Panel' },
      secondary: { hex: '#E5E9EF', roughness: 0.34, metalness: 0.06, partLabel: 'Alt Kanatçık & Izgara' },
      accent: { hex: '#C9D1DC', roughness: 0.2, metalness: 0.88, partLabel: 'Gümüş Dekor Şerit' },
    },
  }),
  makeFinish({
    id: 'daikin-mat-siyah-antrasit',
    label: 'Mat Siyah (Stylish Black) · Füme Şerit',
    comboSummary: 'Gövde: Mat Siyah · Kanatçık: Koyu Antrasit · Şerit: Füme Krom',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#1E2228', roughness: 0.32, metalness: 0.16, partLabel: 'Mat Siyah Ön Panel' },
      secondary: { hex: '#14171C', roughness: 0.42, metalness: 0.14, partLabel: 'Hava Kanatçığı' },
      accent: { hex: '#64748B', roughness: 0.22, metalness: 0.88, partLabel: 'Füme Şerit' },
    },
  }),
  makeFinish({
    id: 'daikin-fircali-gumus',
    label: 'Fırçalı Gümüş Metalik · Krom Şerit',
    comboSummary: 'Gövde: Metalik Gümüş · Kanatçık: Koyu Gri · Şerit: Parlak Krom',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#CBD2DA', roughness: 0.26, metalness: 0.78, partLabel: 'Metalik Gümüş Gövde' },
      secondary: { hex: '#94A3B8', roughness: 0.36, metalness: 0.52, partLabel: 'Alt Kanatçık' },
      accent: { hex: '#E2E8F0', roughness: 0.14, metalness: 0.94, partLabel: 'Krom Şerit' },
    },
  }),
  makeFinish({
    id: 'daikin-antrasit-gri',
    label: 'Mimari Antrasit (RAL 7016) · Gümüş',
    comboSummary: 'Gövde: Mat Antrasit · Kanatçık: Antrasit · Şerit: Gümüş',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#383E48', roughness: 0.36, metalness: 0.24, partLabel: 'Antrasit Ön Panel' },
      secondary: { hex: '#282D35', roughness: 0.42, metalness: 0.2, partLabel: 'Kanatçık & Izgara' },
      accent: { hex: '#CBD5E1', roughness: 0.18, metalness: 0.9, partLabel: 'Gümüş Şerit' },
    },
  }),
  makeFinish({
    id: 'daikin-krem-sampanya',
    label: 'Sıcak Krem · Şampanya Gold Şerit',
    comboSummary: 'Gövde: Sıcak Krem · Kanatçık: Taş Krem · Şerit: Şampanya Gold',
    materialKind: 'ceramic',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#F1ECE2', roughness: 0.24, metalness: 0.04, partLabel: 'Sıcak Krem Gövde' },
      secondary: { hex: '#E1D9CB', roughness: 0.34, metalness: 0.05, partLabel: 'Alt Kanatçık' },
      accent: { hex: '#C7A668', roughness: 0.24, metalness: 0.9, partLabel: 'Şampanya Gold Şerit' },
    },
  }),
];

const WATER_METER_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'baylan-mavi-pirinc-kirmizi',
    label: 'Baylan Mavi Su Sayacı · Pirinç & E.C.A. Kırmızı Vana',
    comboSummary: 'Sayaç: Baylan Soğuk Su Mavisi · Pislik Tutucu & Düşürücü: Pirinç · Ana Vana: Kırmızı E.C.A.',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#1D4ED8', roughness: 0.3, metalness: 0.34, partLabel: 'Baylan Mavi Sayaç Gövde' },
      secondary: { hex: '#CFA84E', roughness: 0.24, metalness: 0.92, partLabel: 'Pirinç Basınç Düşürücü & Filtre' },
      accent: { hex: '#DC2626', roughness: 0.34, metalness: 0.16, partLabel: 'E.C.A. Kırmızı Ana Su Vanası' },
    },
  }),
  makeFinish({
    id: 'baylan-pirinc-nikel-mavi',
    label: 'Nikel Kaplı Pirinç Hat · Mavi Kelebek Vana',
    comboSummary: 'Sayaç: Mavi-Pirinç · Boru & Rakor: Nikel Kaplama · Vana: Mavi',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#2563EB', roughness: 0.28, metalness: 0.35, partLabel: 'Mavi Sayaç Gövdesi' },
      secondary: { hex: '#D4DAE2', roughness: 0.18, metalness: 0.94, partLabel: 'Nikel Tesisat Hattı' },
      accent: { hex: '#1D4ED8', roughness: 0.32, metalness: 0.16, partLabel: 'Mavi Küresel Vana' },
    },
  }),
  makeFinish({
    id: 'baylan-sicak-su-kirmizi',
    label: 'Baylan Kırmızı Sıcak Su Sayacı · Pirinç',
    comboSummary: 'Sayaç: Kırmızı Sıcak Su Gövdesi · Filtre & Rakor: Pirinç · Vana: Kırmızı',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#B91C1C', roughness: 0.3, metalness: 0.32, partLabel: 'Kırmızı Sıcak Su Sayacı' },
      secondary: { hex: '#CFA84E', roughness: 0.24, metalness: 0.92, partLabel: 'Pirinç Basınç Düşürücü' },
      accent: { hex: '#991B1B', roughness: 0.34, metalness: 0.16, partLabel: 'Kırmızı Ana Vana' },
    },
  }),
  makeFinish({
    id: 'baylan-ham-pirinc-proje',
    label: 'Dövme Pirinç Gövde · Paslanmaz Tesisat',
    comboSummary: 'Sayaç & Düşürücü: Dövme Pirinç · Boru: Paslanmaz Çelik · Vana: Kırmızı',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#C8A046', roughness: 0.24, metalness: 0.92, partLabel: 'Dövme Pirinç Sayaç' },
      secondary: { hex: '#CBD2DA', roughness: 0.2, metalness: 0.94, partLabel: 'Paslanmaz Boru & Rakor' },
      accent: { hex: '#DC2626', roughness: 0.34, metalness: 0.16, partLabel: 'Kırmızı Küresel Vana' },
    },
  }),
  makeFinish({
    id: 'baylan-pprc-beyaz-hat',
    label: 'PPRC Beyaz Boru Hattı · Baylan Mavi Sayaç',
    comboSummary: 'Boru: Fırat/Kalde PPRC Beyaz · Sayaç: Baylan Mavi · Vana: Pirinç-Kırmızı',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#1E40AF', roughness: 0.3, metalness: 0.32, partLabel: 'Baylan Mavi Sayaç' },
      secondary: { hex: '#EEF1F5', roughness: 0.28, metalness: 0.08, partLabel: 'PPRC Beyaz Tesisat Borusu' },
      accent: { hex: '#DC2626', roughness: 0.34, metalness: 0.16, partLabel: 'E.C.A. Ana Vana' },
    },
  }),
];

const ELEVATOR_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'asansor-satine-paslanmaz-siyah',
    label: '304 Satine Paslanmaz Çelik · Siyah Cam Panel',
    comboSummary: 'Kapı & Kabin: 304 Fırçalı Paslanmaz · Gösterge & Buton Paneli: Siyah Temperli Cam · Zemin: Siyah Granit',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#C6CDD6', roughness: 0.26, metalness: 0.9, partLabel: '304 Satine Paslanmaz Çelik' },
      secondary: { hex: '#1B1F27', roughness: 0.12, metalness: 0.28, partLabel: 'Siyah Cam Gösterge & Granit' },
      accent: { hex: '#E5E9F0', roughness: 0.12, metalness: 0.96, partLabel: 'Parlak Krom Tutamak & Çerçeve' },
    },
  }),
  makeFinish({
    id: 'asansor-fume-titanyum-ceviz',
    label: 'Füme Titanyum Çelik · Amerikan Ceviz & Gold',
    comboSummary: 'Kasa/Kapı: Füme Titanyum Paslanmaz · İç/Panel: Ceviz & Bronz · Detay: Şampanya Gold',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#434852', roughness: 0.26, metalness: 0.86, partLabel: 'Füme Titanyum Paslanmaz' },
      secondary: { hex: '#6B482E', roughness: 0.42, metalness: 0.08, partLabel: 'Ceviz Panel & Sıcak Granit' },
      accent: { hex: '#CCA45A', roughness: 0.2, metalness: 0.94, partLabel: 'Şampanya Gold Tutamak & Şerit' },
    },
  }),
  makeFinish({
    id: 'asansor-sampanya-gold-mermer',
    label: 'Şampanya Gold Paslanmaz · Krem Mermer',
    comboSummary: 'Kapı & Çerçeve: Fırçalı Şampanya Gold PVD · Zemin/Panel: Krem Mermer · Ekran: Siyah Cam',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#C7A972', roughness: 0.24, metalness: 0.92, partLabel: 'Şampanya Gold PVD Çelik' },
      secondary: { hex: '#EAE4D8', roughness: 0.18, metalness: 0.05, partLabel: 'Krem Mermer Zemin & Panel' },
      accent: { hex: '#1E222A', roughness: 0.12, metalness: 0.24, partLabel: 'Siyah Cam Gösterge' },
    },
  }),
  makeFinish({
    id: 'asansor-antrasit-rezidans',
    label: 'Mat Antrasit Rezidans · Fırçalı İnox',
    comboSummary: 'Çerçeve & Kapı: RAL 7016 Mat Antrasit · Eşik & Tutamak: Fırçalı Paslanmaz İnox',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#343A44', roughness: 0.36, metalness: 0.54, partLabel: 'Mat Antrasit Çelik Kapı' },
      secondary: { hex: '#23272F', roughness: 0.3, metalness: 0.35, partLabel: 'Antrasit Kasa & Granit' },
      accent: { hex: '#D4DBE3', roughness: 0.2, metalness: 0.94, partLabel: 'Fırçalı İnox Eşik & Panel' },
    },
  }),
  makeFinish({
    id: 'asansor-bronz-otel',
    label: 'Saten Bronz PVD · Füme Ayna & Koyu Granit',
    comboSummary: 'Kapı & Kabin: Saten Bronz PVD · Detay: Füme Ayna & Nero Granit · LED: Sıcak 3000K',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#8F6F49', roughness: 0.26, metalness: 0.9, partLabel: 'Saten Bronz PVD Çelik' },
      secondary: { hex: '#242220', roughness: 0.16, metalness: 0.22, partLabel: 'Nero Granit & Siyah Cam' },
      accent: { hex: '#D8B77A', roughness: 0.18, metalness: 0.94, partLabel: 'Pirinç Tutamak & Çerçeve' },
    },
  }),
];

const FIRE_CABINET_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'yangin-ral3000-kirmizi',
    label: 'RAL 3000 Yangın Kırmızısı · Füme Cam',
    comboSummary: 'Gövde & Kapak: RAL 3000 Elektrostatik Kırmızı · Hortum & Tüp: TS EN 671-1 Kırmızı · Lans: Pirinç',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#C81E1E', roughness: 0.28, metalness: 0.34, partLabel: 'RAL 3000 Kırmızı Çelik Kasa' },
      secondary: { hex: '#E5E7EB', roughness: 0.32, metalness: 0.2, partLabel: 'İç Makara Şasisi' },
      accent: { hex: '#D4A847', roughness: 0.24, metalness: 0.92, partLabel: 'Pirinç Lans & Kilit' },
      glass: { hex: '#1F2937', opacity: 0.36, roughness: 0.08 },
    },
  }),
  makeFinish({
    id: 'yangin-satine-inox',
    label: '304 Satine Paslanmaz İnox · Rezidans Tipi',
    comboSummary: 'Çerçeve & Kapak: 304 Fırçalı Paslanmaz · İç Makara & Tüp: RAL 3000 Kırmızı',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#CBD2D9', roughness: 0.24, metalness: 0.9, partLabel: '304 Fırçalı Paslanmaz Kapak' },
      secondary: { hex: '#B91C1C', roughness: 0.3, metalness: 0.28, partLabel: 'İç Kırmızı Hortum Makarası' },
      accent: { hex: '#D4A847', roughness: 0.24, metalness: 0.92, partLabel: 'Pirinç Vana & Kulp' },
      glass: { hex: '#1E293B', opacity: 0.38, roughness: 0.08 },
    },
  }),
  makeFinish({
    id: 'yangin-mat-antrasit',
    label: 'RAL 7016 Mat Antrasit · Modern Hol Tipi',
    comboSummary: 'Dış Kasa: RAL 7016 Mat Antrasit · İç Donanım: Kırmızı Hortum Makarası + 6 kg KKT Tüp',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#333942', roughness: 0.38, metalness: 0.44, partLabel: 'Mat Antrasit Çelik Çerçeve' },
      secondary: { hex: '#DC2626', roughness: 0.3, metalness: 0.25, partLabel: 'Kırmızı Makara & Yangın Tüpü' },
      accent: { hex: '#D1D5DB', roughness: 0.22, metalness: 0.92, partLabel: 'Krom Kulp & Lans' },
      glass: { hex: '#111827', opacity: 0.4, roughness: 0.07 },
    },
  }),
  makeFinish({
    id: 'yangin-ral9003-beyaz',
    label: 'RAL 9003 Mimari Beyaz · Kırmızı Donanım',
    comboSummary: 'Dış Çerçeve: RAL 9003 Beyaz · İç Makara & Tüp: Kırmızı · Kulp: Krom',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#F1F4F7', roughness: 0.26, metalness: 0.22, partLabel: 'Beyaz Elektrostatik Çerçeve' },
      secondary: { hex: '#DC2626', roughness: 0.3, metalness: 0.25, partLabel: 'Kırmızı Makara & Tüp' },
      accent: { hex: '#D4A847', roughness: 0.24, metalness: 0.92, partLabel: 'Pirinç Lans & Kulp' },
      glass: { hex: '#1F2937', opacity: 0.34, roughness: 0.08 },
    },
  }),
  makeFinish({
    id: 'yangin-mat-siyah-otel',
    label: 'RAL 9005 Mat Siyah · Lüks Rezidans Tipi',
    comboSummary: 'Dış Kasa: RAL 9005 Mat Siyah · İç Makara & Tüp: Kırmızı · Detay: Pirinç Lans',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#1E2127', roughness: 0.36, metalness: 0.52, partLabel: 'Mat Siyah Çelik Kasa' },
      secondary: { hex: '#DC2626', roughness: 0.3, metalness: 0.25, partLabel: 'Kırmızı Hortum & Tüp' },
      accent: { hex: '#D4A847', roughness: 0.24, metalness: 0.92, partLabel: 'Pirinç Lans & Kulp' },
      glass: { hex: '#0F172A', opacity: 0.44, roughness: 0.07 },
    },
  }),
];

const GAS_SERVICE_BOX_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'igdas-sari-standart',
    label: 'İGDAŞ Standart Sarı (RAL 1021) · Çelik Kutu',
    comboSummary: 'Kutu: RAL 1021 İGDAŞ Sarısı · Kolon Borusu: Sarı Çelik · Kaide: Beton',
    materialKind: 'metal',
    comboRole: 'exterior_outdoor',
    partFinishes: {
      primary: { hex: '#EAB308', roughness: 0.34, metalness: 0.28, partLabel: 'RAL 1021 Sarı Çelik Kasa' },
      secondary: { hex: '#94A3B8', roughness: 0.72, metalness: 0.08, partLabel: 'Beton Zemin Kaidesi' },
      accent: { hex: '#1E293B', roughness: 0.42, metalness: 0.65, partLabel: 'Üçgen Kilit & Havalandırma' },
    },
  }),
  makeFinish({
    id: 'igdas-antrasit-villa',
    label: 'Villa Cephesi Mat Antrasit · Sarı İGDAŞ Şeridi',
    comboSummary: 'Kutu: RAL 7016 Antrasit Boyalı Çelik · Uyarı Bandı & Boru: İGDAŞ Sarısı',
    materialKind: 'metal',
    comboRole: 'exterior_outdoor',
    partFinishes: {
      primary: { hex: '#363C46', roughness: 0.38, metalness: 0.35, partLabel: 'Antrasit Cephe Kutusu' },
      secondary: { hex: '#94A3B8', roughness: 0.72, metalness: 0.08, partLabel: 'Beton Kaide' },
      accent: { hex: '#EAB308', roughness: 0.34, metalness: 0.2, partLabel: 'İGDAŞ Sarı Uyarı & Boru' },
    },
  }),
  makeFinish({
    id: 'igdas-gri-galvaniz',
    label: 'Açık Cephe Grisi (RAL 7035) · Sarı Borulu',
    comboSummary: 'Kutu: RAL 7035 Açık Gri · İç Boru & Etiket: İGDAŞ Standart Sarı',
    materialKind: 'metal',
    comboRole: 'exterior_outdoor',
    partFinishes: {
      primary: { hex: '#D8DDE4', roughness: 0.36, metalness: 0.32, partLabel: 'Açık Gri Çelik Kutu' },
      secondary: { hex: '#8F96A1', roughness: 0.74, metalness: 0.06, partLabel: 'Beton Kaide' },
      accent: { hex: '#EAB308', roughness: 0.32, metalness: 0.22, partLabel: 'Sarı Doğalgaz Borusu' },
    },
  }),
  makeFinish({
    id: 'igdas-krem-cephe',
    label: 'Sıva Uyumlu Krem Bej · İGDAŞ Uyarı Etiketli',
    comboSummary: 'Kutu: RAL 1015 Krem Bej · Kaide: Beton · Kolon Borusu: İGDAŞ Sarı',
    materialKind: 'metal',
    comboRole: 'exterior_outdoor',
    partFinishes: {
      primary: { hex: '#E6DEC8', roughness: 0.4, metalness: 0.18, partLabel: 'Krem Bej Cephe Kutusu' },
      secondary: { hex: '#94A3B8', roughness: 0.74, metalness: 0.06, partLabel: 'Beton Kaide' },
      accent: { hex: '#1E293B', roughness: 0.42, metalness: 0.65, partLabel: 'Üçgen Kilit & Menteşe' },
    },
  }),
  makeFinish({
    id: 'igdas-koyu-yesil-bahce',
    label: 'Bahçe Duvarı Koyu Yeşil · Sarı Borulu',
    comboSummary: 'Kutu: RAL 6005 Peyzaj Yeşili · Kaide: Beton · Boru: İGDAŞ Sarı',
    materialKind: 'metal',
    comboRole: 'exterior_outdoor',
    partFinishes: {
      primary: { hex: '#234433', roughness: 0.38, metalness: 0.28, partLabel: 'Peyzaj Yeşili Çelik Kutu' },
      secondary: { hex: '#94A3B8', roughness: 0.74, metalness: 0.06, partLabel: 'Beton Kaide' },
      accent: { hex: '#EAB308', roughness: 0.34, metalness: 0.22, partLabel: 'İGDAŞ Sarı Uyarı' },
    },
  }),
];

const LINEAR_DRAIN_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'suzgec-fircali-inox',
    label: 'AISI 304 Fırçalı Paslanmaz Çelik · Çizgi Izgara',
    comboSummary: 'Kapak & Çerçeve: 304 Fırçalı Paslanmaz · Sifon Gövde: Antrasit ABS',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#D5DCE3', roughness: 0.22, metalness: 0.94, partLabel: '304 Fırçalı Paslanmaz Izgara' },
      secondary: { hex: '#2B313B', roughness: 0.56, metalness: 0.14, partLabel: 'ABS Sifon & Koku Önleyici' },
      accent: { hex: '#9CA3AF', roughness: 0.26, metalness: 0.9, partLabel: 'Yalıtım Eteği & Flanş' },
    },
  }),
  makeFinish({
    id: 'suzgec-mat-siyah',
    label: 'PVD Mat Siyah · Modern Walk-in Duş',
    comboSummary: 'Kapak & Çerçeve: PVD Mat Siyah Paslanmaz · Sifon: ABS',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#23262D', roughness: 0.38, metalness: 0.78, partLabel: 'PVD Mat Siyah Izgara' },
      secondary: { hex: '#1E2228', roughness: 0.58, metalness: 0.12, partLabel: 'ABS Sifon Haznesi' },
      accent: { hex: '#3B424E', roughness: 0.36, metalness: 0.65, partLabel: 'Çerçeve Flanşı' },
    },
  }),
  makeFinish({
    id: 'suzgec-fircali-gold',
    label: 'PVD Fırçalı Gold · Lüks Villa Banyo',
    comboSummary: 'Kapak & Çerçeve: PVD Fırçalı Gold · Sifon: Antrasit ABS',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#D4B062', roughness: 0.24, metalness: 0.94, partLabel: 'PVD Fırçalı Gold Izgara' },
      secondary: { hex: '#2B313B', roughness: 0.56, metalness: 0.14, partLabel: 'ABS Sifon Haznesi' },
      accent: { hex: '#B89246', roughness: 0.26, metalness: 0.9, partLabel: 'Gold Çerçeve Flanşı' },
    },
  }),
  makeFinish({
    id: 'suzgec-fume-gunmetal',
    label: 'PVD Füme Gunmetal · Minimalist Banyo',
    comboSummary: 'Kapak & Çerçeve: PVD Füme Gunmetal · Sifon: Antrasit ABS',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#525864', roughness: 0.26, metalness: 0.9, partLabel: 'PVD Gunmetal Izgara' },
      secondary: { hex: '#252A32', roughness: 0.56, metalness: 0.14, partLabel: 'ABS Sifon Haznesi' },
      accent: { hex: '#6B7280', roughness: 0.28, metalness: 0.86, partLabel: 'Gunmetal Flanş' },
    },
  }),
  makeFinish({
    id: 'suzgec-rose-gold-bronz',
    label: 'PVD Rose Gold / Saten Bronz · Spa Banyo',
    comboSummary: 'Kapak & Çerçeve: PVD Rose Gold / Bronz · Sifon: Antrasit ABS',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#B9836A', roughness: 0.24, metalness: 0.92, partLabel: 'PVD Rose Gold Izgara' },
      secondary: { hex: '#2B313B', roughness: 0.56, metalness: 0.14, partLabel: 'ABS Sifon Haznesi' },
      accent: { hex: '#9A6B55', roughness: 0.28, metalness: 0.88, partLabel: 'Bronz Flanş' },
    },
  }),
];

function createMepAsset(params: {
  id: string;
  slug: string;
  name: string;
  brandStyle: string;
  category: AssetCategory;
  subCategory?: BathroomSubCategory;
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
  const defaultFinish = params.finishes[0];
  const { width, depth, height } = params.dimensionsCm;
  return {
    id: params.id,
    slug: params.slug,
    name: params.name,
    brandStyle: params.brandStyle,
    category: params.category,
    ...(params.subCategory ? { subCategory: params.subCategory } : {}),
    archetype: params.archetype,
    placement: params.placement,
    dimensionsCm: params.dimensionsCm,
    polyEstimate: params.polyEstimate,
    renderEngines: ['Cycles', 'EEVEE'],
    uvUnwrapped: true,
    thumbnailUrl: params.thumbnailUrl,
    searchKeywords: [
      ...params.searchKeywords,
      'türkiye standardı',
      'tesisat',
      'mep',
      'blender 3d',
      'mimari cad',
    ],
    roomTags: params.roomTags,
    aiSummary: params.aiSummary,
    defaultFinishId: defaultFinish.id,
    finishes: params.finishes,
    defaultPatternId: 'original_pbr',
    patterns: ARCHITECTURAL_PBR_PATTERNS,
    modelingSpec: {
      geometryBreakdown: [
        `Gerçek 1:1 Türkiye standardı metrik ölçüler: ${width} cm genişlik × ${depth} cm derinlik × ${height} cm yükseklik.`,
        ...params.geometryBreakdown,
      ],
      textureAndMaps: {
        surfaceType: params.surfaceType,
        uvTileCm: '1:1 Metrik UV + Yüksek Çözünürlüklü Marka & Gösterge Dokusu',
        bumpDepthMm: '0.4 – 2.2 mm (Mikro PVR & Metal Fırça)',
        roughnessRange: '0.08 – 0.48 (Çok Parçalı Mühendislik PBR)',
        shaderRecipe:
          'Principled BSDF: Çok parçalı mühendislik malzemesi — gövde, metal tesisat/vana, cam/ekran ve marka baskı katmanları birbirinden bağımsız ayrılmıştır.',
      },
      microDetails: [
        ...params.microDetails,
        `1:1 metrik Türkiye montaj ölçüsü (${width}×${depth}×${height} cm) ve gerçek satış rengi çok parçalı PBR ayrımı.`,
      ],
      blenderModifiers: [
        'Bevel (Width: 0.0015 – 0.003 m, Segments: 2) + WeightedNormal ile keskin teknik CAD kenarları.',
        'Sıva altı pano ve dolaplarda duvar yüzeyinden +1.5 cm taşacak şekilde Z/Y ekseninde sıfırlanmıştır.',
      ],
      lightingAndCameraTip: params.lightingTip,
      aiRenderPrompt: `Photorealistic architectural engineering close-up of ${params.name} (${params.brandStyle}), exact metric dimensions ${width}x${depth}x${height}cm, crisp Turkish residential installation, realistic ${params.surfaceType} materials, natural daylight, Blender Cycles 8k.`,
      aiBlenderMasterPrompt: `Blender 4.x sahnesine "${params.name}" (${params.brandStyle}) 3D CAD varlığını 1:1 metrik (${width}x${depth}x${height} cm) olarak yerleştir. ${params.placement === 'wall-mounted' ? `Duvar yüzeyine yerden ${params.dimensionsCm.mountHeight ?? 145} cm kotta sabitle.` : 'Zemin sıfır noktasına (Z=0) oturt.'} Çok parçalı PBR malzemelerini koru ve Cycles AgX ile render al.`,
    },
    modelSource: {
      provider: 'procedural',
      license: 'MimarKatalog TR Mimari & MEP CAD (Blender Ready)',
    },
    sourceOrigin: 'catalog',
  };
}

export const TURKISH_MEP_ASSETS: ArchitecturalAsset[] = [
  // 1. Viko by Panasonic 24'lü Sıva Altı Sigorta Kutusu
  createMepAsset({
    id: 'tr-viko-sigorta-kutusu-24',
    slug: 'viko-panasonic-24lu-siva-alti-sigorta-kutusu',
    name: "Viko by Panasonic 24'lü Sıva Altı Sigorta Kutusu (Otomat & Kaçak Akım)",
    brandStyle: "Viko by Panasonic · 24'lü Sıva Altı Elektrik Panosu",
    category: 'Elektrik Tesisatı',
    archetype: 'tr_fuse_box',
    placement: 'wall-mounted',
    dimensionsCm: { width: 32, depth: 11, height: 42, mountHeight: 165 },
    polyEstimate: 11400,
    thumbnailUrl: '/assets/turkish-gaps/viko-24lu-siva-alti-sigorta-kutusu.png',
    searchKeywords: [
      'sigorta kutusu',
      'elektrik panosu',
      'viko',
      'panasonic',
      'kaçak akım rölesi',
      'otomatik sigorta',
      'sıva altı sigorta',
      'dağıtım panosu',
      'elektrik tesisat',
      '24lü sigorta',
    ],
    roomTags: ['Antre', 'Koridor', 'Teknik Oda', 'Daire Girişi'],
    aiSummary:
      "Türkiye daire girişlerinin vazgeçilmezi Viko by Panasonic 24'lü sıva altı elektrik sigorta kutusu. Füme şeffaf kapağı, çift sıra DIN rayı, 30mA kaçak akım rölesi ve etiketli C16/C25 otomatik sigorta grubuyla birebir ölçekli.",
    finishes: FUSE_BOX_FINISHES,
    surfaceType: 'Polikarbonat Pano Çerçevesi + Füme Şeffaf Kapak + Otomatik Sigorta Modülleri',
    geometryBreakdown: [
      '32×42 cm sıva altı montaj çerçevesi, ergonomik mandallı menteşeli füme şeffaf koruma kapağı.',
      'İç kısımda 2 sıra 12 modül DIN rayı, 1 adet 40A 30mA Kaçak Akım Koruma Rölesi (mavi test butonlu) ve 14 adet C16/C25 otomatik sigorta.',
    ],
    microDetails: [
      'Üst çerçevede net VIKO by Panasonic marka baskısı ve devre etiket şeridi (Salon, Mutfak, Kombi, Klima, Fırın).',
      'Şeffaf füme kapak arkasından sigorta mandalları ve nötr/toprak barası görünür.',
    ],
    lightingTip: 'Antre duvarında 45° yandan ışık kullanarak füme polikarbonat kapaktaki yansıma ile iç otomat derinliğini öne çıkarın.',
  }),

  // 2. Siemens 18'li Sıva Altı Elektrik Dağıtım Panosu
  createMepAsset({
    id: 'tr-siemens-sigorta-panosu-18',
    slug: 'siemens-18li-siva-alti-elektrik-dagitim-panosu',
    name: "Siemens 18'li Sıva Altı Elektrik Dağıtım Panosu (5SL6 & 5SV Kaçak Akım)",
    brandStyle: 'Siemens · 5SL6 / 5SV Sıva Altı Dağıtım Panosu',
    category: 'Elektrik Tesisatı',
    archetype: 'tr_fuse_box',
    placement: 'wall-mounted',
    dimensionsCm: { width: 38, depth: 11, height: 34, mountHeight: 165 },
    polyEstimate: 10800,
    thumbnailUrl: '/assets/turkish-gaps/siemens-18li-elektrik-dagitim-panosu.png',
    searchKeywords: [
      'siemens',
      'sigorta kutusu',
      'elektrik panosu',
      'dağıtım panosu',
      '5sl6',
      '5sv',
      'kaçak akım',
      'w otomat',
      'elektrik mühendisliği',
    ],
    roomTags: ['Antre', 'Koridor', 'Villa Teknik Oda', 'Ofis'],
    aiSummary:
      "Nitelikli Türkiye konut ve villa elektrik projelerinde kullanılan Siemens 18'li sıva altı dağıtım panosu. Petrol yeşili SIEMENS logosu, 5SL6 otomat dizisi ve 5SV kaçak akım rölesi ile 1:1 mühendislik CAD modeli.",
    finishes: FUSE_BOX_FINISHES,
    surfaceType: 'Siemens Mimari Pano Gövdesi + Füme Şeffaf Kapak + 5SL6/5SV Otomatlar',
    geometryBreakdown: [
      '38×34 cm yatay 18 modüllü Siemens mimari kasa, bas-aç mandallı füme kapak.',
      'İç kısımda Siemens 5SL6 C16/C25 sigortalar, 5SV kaçak akım rölesi ve bakır topraklama barası.',
    ],
    microDetails: [
      'Kasa üst bandında özgün Siemens petrol yeşili/turkuaz marka baskısı ve teknik güvenlik etiketi.',
    ],
    lightingTip: 'Koridor tavan spotları altında füme kapağın hafif geçirgenliğiyle iç Siemens modülleri gerçekçi görünür.',
  }),

  // 3. Audio 7" Dokunmatik Görüntülü Diafon & İnterkom
  createMepAsset({
    id: 'tr-audio-goruntulu-diafon-7',
    slug: 'audio-7-inc-dokunmatik-goruntulu-diafon-interkom',
    name: 'Audio 7" Dokunmatik Görüntülü Diafon & Akıllı Ev İnterkom Paneli',
    brandStyle: 'Audio · 7" HD Görüntülü Diafon & Kapı Otomatiği',
    category: 'Elektrik Tesisatı',
    archetype: 'tr_video_intercom',
    placement: 'wall-mounted',
    dimensionsCm: { width: 22, depth: 3, height: 15, mountHeight: 145 },
    polyEstimate: 5400,
    thumbnailUrl: '/assets/turkish-gaps/audio-7inc-goruntulu-diafon-paneli.png',
    searchKeywords: [
      'görüntülü diafon',
      'audio',
      'netelsan',
      'interkom',
      'kapı otomatiği',
      'akıllı ev paneli',
      'zayıf akım',
      'daire girişi',
      'zil paneli',
    ],
    roomTags: ['Antre', 'Daire Girişi', 'Koridor', 'Salon'],
    aiSummary:
      'Türkiye apartman ve site dairelerinin standardı Audio 7 inç dokunmatik görüntülü diafon paneli. Canlı bina giriş kamerası önizlemesi, kapı açma, güvenlik arama ve konuşma dokunmatik ikonlarıyla antre duvarı için hazır.',
    finishes: INTERCOM_FINISHES,
    surfaceType: 'Temperli Dokunmatik Cam + 7" IPS Ekran + Eloksal Alüminyum Çerçeve',
    geometryBreakdown: [
      '22×15×2.4 cm ultra ince sıva üstü duvar gövdesi ve pahlı metal kenar şeridi.',
      '7 inç yüksek kontrastlı bina lobi görüntülü IPS ekran + sağ/alt dokunmatik kapı açma/görüşme/güvenlik ikonları.',
    ],
    microDetails: [
      'Alt kenarda net AUDIO marka logosu, hoparlör mikro ızgarası ve mavi/yeşil durum LED göstergesi.',
    ],
    lightingTip: 'Antre giriş kapısı yanına yerden 145 cm kotta yerleştirin; ekran emisyon değeri iç mekan renderlarında doğal parlar.',
  }),

  // 4. Viko Karre TV-Uydu (SAT) + RJ45 Cat6 İnternet İkili Priz
  createMepAsset({
    id: 'tr-viko-karre-tv-data-priz',
    slug: 'viko-karre-tv-uydu-sat-rj45-data-ikili-priz',
    name: 'Viko Karre TV-Uydu (SAT) + RJ45 Cat6 İnternet İkili Priz Seti',
    brandStyle: 'Viko by Panasonic · Karre TV-SAT + Cat6 Data İkili Priz',
    category: 'Elektrik Tesisatı',
    archetype: 'tr_tv_data_socket',
    placement: 'wall-mounted',
    dimensionsCm: { width: 16, depth: 4, height: 9, mountHeight: 40 },
    polyEstimate: 4800,
    thumbnailUrl: '/assets/turkish-gaps/viko-karre-tv-uydu-rj45-data-priz.png',
    searchKeywords: [
      'tv prizi',
      'uydu prizi',
      'internet prizi',
      'rj45',
      'cat6',
      'data prizi',
      'viko',
      'karre',
      'zayıf akım',
      'elektrik prizi',
    ],
    roomTags: ['Salon', 'Yatak Odası', 'Çalışma Odası'],
    aiSummary:
      'Her Türk evinin TV duvarı ve çalışma masası arkasında standart bulunan Viko Karre ikili zayıf akım prizi: sol modülde vidalı TV/Uydu (SAT) koaksiyel soketi, sağ modülde kapaklı RJ45 Cat6 ethernet portu.',
    finishes: VIKO_SOCKET_FINISHES,
    surfaceType: 'Polikarbonat Karre Çerçeve + Nikel F-Konnektör + RJ45 Cat6 Modül',
    geometryBreakdown: [
      '16×9 cm Viko Karre keskin hatlı ikili çerçeve ve çift modül iç plakalar.',
      'Sol modülde dişli metal F-tipi uydu/TV çıkışı, sağ modülde toz kapaklı RJ45 Cat6 ethernet yuvası.',
    ],
    microDetails: [
      'Üzerinde SAT/TV ve CAT6 sembol baskıları ile VIKO kabartma detayları yer alır.',
    ],
    lightingTip: 'TV ünitesi arkasında yerden 35–45 cm kotta veya duvara asılı TV arkasında 110 cm kotta kullanın.',
  }),

  // 5. E.C.A. Küresel Doğalgaz Vanası (Sarı Kol) + İGDAŞ Boru & Çelik Flex Grubu
  createMepAsset({
    id: 'tr-eca-dogalgaz-vana-tesisat',
    slug: 'eca-kuresel-dogalgaz-vanasi-sari-kol-flex-tesisat',
    name: 'E.C.A. Küresel Doğalgaz Vanası (Sarı Kol), İGDAŞ Boru & Çelik Flex Grubu',
    brandStyle: 'E.C.A. · TS EN 331 Sarı Kollu Küresel Doğalgaz Vanası & Flex',
    category: 'Mimari & Çalışma',
    archetype: 'tr_gas_valve_assembly',
    placement: 'wall-mounted',
    dimensionsCm: { width: 28, depth: 12, height: 48, mountHeight: 115 },
    polyEstimate: 12600,
    thumbnailUrl: '/assets/turkish-gaps/eca-dogalgaz-vanasi-boru-flex-grubu.png',
    searchKeywords: [
      'doğalgaz vanası',
      'doğalgaz borusu',
      'küresel vana',
      'eca',
      'igdaş',
      'sarı vana',
      'çelik flex',
      'doğalgaz tesisatı',
      'selenoid vana',
      'mekanik tesisat',
    ],
    roomTags: ['Mutfak', 'Balkon', 'Teknik Oda', 'Kazan Dairesi'],
    aiSummary:
      'Türkiye İGDAŞ/BOTAŞ doğalgaz iç tesisat yönetmeliğine tam uyumlu E.C.A. TS EN 331 sarı kollu küresel doğalgaz vanası, duvar kelepçeli dikey çelik gaz borusu, selenoid emniyet vanası ve paslanmaz çelik ocak/kombi flex hortum seti.',
    finishes: GAS_VALVE_FINISHES,
    surfaceType: 'TS EN 331 Sarı Boyalı Çelik Boru + E.C.A. Dövme Pirinç Küresel Vana + Örgülü Çelik Flex',
    geometryBreakdown: [
      'Dikey Ø22 mm çelik doğalgaz kolon borusu, 2 adet lastik contalı duvar kelepçesi ve 90° kaynak dirsek.',
      'E.C.A. altıgen rakorlu dövme pirinç küresel vana, sarı kelebek/kol mandalı, selenoid kesici ve kavisli paslanmaz çelik flex bağlantısı.',
    ],
    microDetails: [
      'Vana gövdesinde E.C.A. / PN5 / MOP5 kabartması ve tesisat yön oku yer alır.',
    ],
    lightingTip: 'Kombi veya ankastre ocak yanına yerleştirin; sarı vana kolu ve dövme pirinç rakorlar yan ışıkta metalik vurgu verir.',
  }),

  // 6. Elster / Elektromed G4 Diyaframlı Doğalgaz Sayacı & Regülatör Seti
  createMepAsset({
    id: 'tr-elster-dogalgaz-sayaci-g4',
    slug: 'elster-elektromed-g4-dogalgaz-sayaci-regulator',
    name: 'Elster / Elektromed G4 Diyaframlı Doğalgaz Sayacı & Regülatör Seti',
    brandStyle: 'Elster / Elektromed · G4 Konut Doğalgaz Sayacı (İGDAŞ Standart)',
    category: 'Mimari & Çalışma',
    archetype: 'tr_gas_meter_g4',
    placement: 'wall-mounted',
    dimensionsCm: { width: 34, depth: 18, height: 40, mountHeight: 165 },
    polyEstimate: 11800,
    thumbnailUrl: '/assets/turkish-gaps/elster-g4-dogalgaz-sayaci-regulator.png',
    searchKeywords: [
      'doğalgaz sayacı',
      'g4 sayaç',
      'elster',
      'elektromed',
      'gaz saati',
      'regülatör',
      'igdaş',
      'doğalgaz tesisatı',
      'mekanik tesisat',
    ],
    roomTags: ['Balkon', 'Daire Girişi', 'Apartman Merdiven Boşluğu', 'Mutfak'],
    aiSummary:
      'Türkiye konut balkon ve kat hollerinin standart G4 diyaframlı doğalgaz sayacı (gaz saati). 8 haneli kırmızı ondalıklı m³ mekanik endeks kadranı, çift üst rakor bağlantısı, 21 mbar basınç regülatörü ve sarı kesme vanasıyla birlikte.',
    finishes: GAS_METER_FINISHES,
    surfaceType: 'Galvaniz Pres Sac Gövde + 8 Haneli m³ Endeks Kadranı + 21 mbar Regülatör & Sarı Vana',
    geometryBreakdown: [
      'Kenetli pres çelik G4 sayaç kasası, duvara sabitleme konsolu ve 130 mm eksenli üst giriş/çıkış rakor boruları.',
      'Sol girişte sarı kollu ana doğalgaz kesme vanası ve yuvarlak 21 mbar diyaframlı basınç regülatörü.',
    ],
    microDetails: [
      'Ön yüzde net okunabilir m³ mekanik sayaç numaratörü (00428,615 m³), G4 Qmax 6 m³/h teknik etiketi ve mühür detayı.',
    ],
    lightingTip: 'Daire girişi veya balkon duvarına yerden 160–175 cm kotta monte edin.',
  }),

  // 7. Rehau / E.C.A. 8'li Yerden Isıtma & Mobil Kalorifer Kollektör Dolabı
  createMepAsset({
    id: 'tr-rehau-kollektor-dolabi-8',
    slug: 'rehau-eca-8li-yerden-isitma-kollektor-dolabi',
    name: "Rehau / E.C.A. 8'li Yerden Isıtma & Kalorifer Kollektör Dolabı (Sıva Altı)",
    brandStyle: "Rehau / E.C.A. · 8'li Debimetreli Kollektör & Sıva Altı Dolap",
    category: 'Mimari & Çalışma',
    archetype: 'tr_manifold_cabinet',
    placement: 'wall-mounted',
    dimensionsCm: { width: 75, depth: 14, height: 65, mountHeight: 20 },
    polyEstimate: 16200,
    thumbnailUrl: '/assets/turkish-gaps/rehau-eca-8li-yerden-isitma-kollektor-dolabi.png',
    searchKeywords: [
      'kollektör dolabı',
      'yerden ısıtma',
      'kalorifer kollektörü',
      'mobil sistem',
      'rehau',
      'eca',
      'danfoss',
      'debimetre',
      'purjör',
      'mekanik tesisat',
      'ısıtma tesisatı',
    ],
    roomTags: ['Koridor', 'Antre', 'Çamaşır Odası', 'Teknik Oda'],
    aiSummary:
      "Yeni nesil tüm Türkiye rezidans ve apartman dairelerinin koridor duvarında yer alan sıva altı 8'li yerden ısıtma / mobil kalorifer kollektör dolabı. İçerisinde debimetreli pirinç gidiş-dönüş kollektörleri, otomatik purjörler, kırmızı-mavi ana küresel vanalar ve 16 adet PEX-A boru çıkışı bulunur.",
    finishes: MANIFOLD_CABINET_FINISHES,
    surfaceType: 'RAL 9016 Sıva Altı Metal Dolap + Dövme Pirinç 8\'li Kollektör + Kırmızı/Mavi PEX Borular',
    geometryBreakdown: [
      '75×65×14 cm sıva altı metal kasa, sökülebilir çerçeve ve mimari kesit/panjur kapak seçeneği.',
      'Üstte 8 adet şeffaf tüplü debimetreli gidiş kollektörü, altta termostatik vana başlıklı dönüş kollektörü, uçlarda otomatik hava purjörü ve doldurma-boşaltma musluğu.',
      'Zemine inen 8 kırmızı (gidiş) ve 8 mavi (dönüş) izolasyonlu PEX-A yerden ısıtma borusu.',
    ],
    microDetails: [
      'Sol girişte kırmızı ve mavi kollu E.C.A. ana küresel vanalar ile oda devresi etiket şeridi.',
    ],
    lightingTip: 'Koridor duvarında süpürgelik üstü 15–20 cm kotta konumlandırın; açık kesit kaplaması mekanik proje sunumlarında olağanüstü teknik detay verir.',
  }),

  // 8. E.C.A. / DemirDöküm 50×180 cm Dikey Alüminyum Tasarım Kalorifer Radyatörü
  createMepAsset({
    id: 'tr-eca-dikey-aluminyum-radyator',
    slug: 'eca-demirdokum-dikey-aluminyum-tasarim-radyator',
    name: 'E.C.A. / DemirDöküm Dikey Alüminyum Tasarım Kalorifer Radyatörü (50×180 cm)',
    brandStyle: 'E.C.A. / DemirDöküm · Dikey Alüminyum Mimari Radyatör',
    category: 'Mimari & Çalışma',
    archetype: 'tr_vertical_radiator',
    placement: 'wall-mounted',
    dimensionsCm: { width: 50, depth: 10, height: 180, mountHeight: 15 },
    polyEstimate: 11200,
    thumbnailUrl: '/assets/turkish-gaps/eca-dikey-aluminyum-tasarim-radyator.png',
    searchKeywords: [
      'dikey radyatör',
      'alüminyum radyatör',
      'dekoratif kalorifer',
      'antrasit petek',
      'kalorifer',
      'petek',
      'eca',
      'demirdöküm',
      'termostatik vana',
    ],
    roomTags: ['Salon', 'Mutfak', 'Antre', 'Yatak Odası'],
    aiSummary:
      'Trendyol ve Koçtaş yapı marketlerinin en çok satan modern Türk salon radyatörü: 50×180 cm dikey ekstrüzyon alüminyum tasarım kalorifer peteği. Alt merkezden bağlantılı krom/siyah termostatik vana setiyle Fransız balkon yanları için ideal.',
    finishes: VERTICAL_RADIATOR_FINISHES,
    surfaceType: 'Ekstrüzyon Alüminyum Dikey Dilimler + Termostatik Köşe Vana Seti',
    geometryBreakdown: [
      '8 adet 55 mm genişliğinde yassı dikey alüminyum ısıtma dilimi ve arka yatay su kollektörleri.',
      'Alt bağlantıda duvardan çıkışlı krom/siyah köşe termostatik vana (TRV) ve dönüş vanası.',
    ],
    microDetails: [
      'Üst sol köşede minimal E.C.A. marka işareti ve gizli duvar montaj konsolları.',
    ],
    lightingTip: 'Fransız pencere yanındaki dar kolon duvarına yerden 15 cm kotta yerleştirin; yan gün ışığı dikey dilimler arasında derin gölge ritmi yaratır.',
  }),

  // 9. Baymak Duo Tec Compact 24 kW Tam Yoğuşmalı Kombi
  createMepAsset({
    id: 'tr-baymak-duotec-kombi',
    slug: 'baymak-duotec-compact-24kw-tam-yogusmali-kombi',
    name: 'Baymak Duo Tec Compact 24 kW Tam Yoğuşmalı Kombi (70×40×30 cm)',
    brandStyle: 'Baymak · Duo Tec Compact 24 kW Premix Yoğuşmalı Kombi',
    category: 'Mimari & Çalışma',
    archetype: 'tr_condensing_boiler',
    placement: 'wall-mounted',
    dimensionsCm: { width: 40, depth: 30, height: 70, mountHeight: 135 },
    polyEstimate: 12600,
    thumbnailUrl: '/assets/turkish-gaps/baymak-duotec-compact-yogusmali-kombi.png',
    searchKeywords: [
      'baymak',
      'duo tec',
      'duotec',
      'kombi',
      'yoğuşmalı kombi',
      'doğalgaz kombi',
      '24 kw',
      'premix',
      'ısıtma',
    ],
    roomTags: ['Mutfak', 'Balkon', 'Çamaşır Odası', 'Teknik Oda'],
    aiSummary:
      'Türkiye doğalgaz piyasasının en çok satan 5 kombisinden biri olan Baymak Duo Tec Compact 24 kW tam yoğuşmalı kombi. Kompakt 40×70 cm gövde, mavi aydınlatmalı dijital LCD ekran, BAYMAK logosu ve 5\'li alt tesisat vana grubu.',
    finishes: BAYMAK_BOILER_FINISHES,
    surfaceType: 'Baymak Parlak Beyaz Emaye Çelik + Lacivert/Mavi LCD Ekran + Pirinç Tesisat Vanaları',
    geometryBreakdown: [
      '70×40×30 cm kompakt duvar gövdesi, üstte Ø60/100 mm hermetik eş merkezli baca dirseği.',
      'Ön alt bölümde Baymak dijital kontrol ekranı, basınç bar göstergesi ve alt yüzde sarı gaz vanalı 5\'li tesisat grubu.',
    ],
    microDetails: [
      'Ön kapakta net BAYMAK / Duo Tec Compact baskısı ve 50°C / 1.5 bar canlı dijital ekran dokusu.',
    ],
    lightingTip: 'Mutfak dolabı içi veya cam balkon köşesinde yerden 135 cm kotta monte edin.',
  }),

  // 10. Cosa / General Life Kablosuz Dijital Akıllı Kombi Oda Termostatı
  createMepAsset({
    id: 'tr-cosa-akilli-oda-termostati',
    slug: 'cosa-general-life-akilli-kombi-oda-termostati',
    name: 'Cosa / General Life Kablosuz Dijital Akıllı Kombi Oda Termostatı',
    brandStyle: 'Cosa · Akıllı Wi-Fi Kombi Oda Termostatı (22.5°C OLED)',
    category: 'Mimari & Çalışma',
    archetype: 'tr_room_thermostat',
    placement: 'wall-mounted',
    dimensionsCm: { width: 12, depth: 3, height: 12, mountHeight: 145 },
    polyEstimate: 4200,
    thumbnailUrl: '/assets/turkish-gaps/cosa-akilli-kombi-oda-termostati.png',
    searchKeywords: [
      'oda termostatı',
      'kombi termostatı',
      'cosa',
      'general life',
      'akıllı termostat',
      'dijital termostat',
      'ısıtma kontrol',
      'akıllı ev',
    ],
    roomTags: ['Salon', 'Oturma Odası', 'Koridor', 'Yatak Odası'],
    aiSummary:
      'Türkiye\'de üretilen ve Trendyol/Hepsiburada\'da en çok satılan yerli akıllı kombi kontrol cihazı Cosa dijital oda termostatı. Yuvarlatılmış cam yüzey, 22.5°C OLED sıcaklık göstergesi ve dokunmatik Ev/Uyku/Dışarı modları.',
    finishes: THERMOSTAT_FINISHES,
    surfaceType: 'Temperli Cam Ön Yüz + OLED Sıcaklık Halkası + Eloksal Çerçeve',
    geometryBreakdown: [
      '12×12×2.6 cm yuvarlatılmış kare duvar modülü ve ince metalik çevre çerçevesi.',
      'Yüksek kontrastlı OLED ekran üzerinde 22.5°C oda sıcaklığı, 23.0°C hedef sıcaklık ve alev/kombi aktif ikonu.',
    ],
    microDetails: [
      'Alt çerçevede COSA marka baskısı ve kapasitif +/- sıcaklık ayar ikonları.',
    ],
    lightingTip: 'Salon ana duvarında elektrik anahtarlarının üzerinde yerden 145–150 cm kotta konumlandırın.',
  }),

  // 11. Daikin Shira Plus / Arçelik 12.000 BTU Duvar Tipi Inverter Split Klima
  createMepAsset({
    id: 'tr-daikin-split-klima-12k',
    slug: 'daikin-shira-plus-12000-btu-duvar-tipi-split-klima',
    name: 'Daikin Shira Plus 12.000 BTU Duvar Tipi Inverter Split Klima (İç Ünite)',
    brandStyle: 'Daikin Türkiye · Shira Plus Inverter Duvar Tipi Split Klima',
    category: 'Mimari & Çalışma',
    archetype: 'tr_split_ac_unit',
    placement: 'wall-mounted',
    dimensionsCm: { width: 80, depth: 22, height: 29, mountHeight: 225 },
    polyEstimate: 9600,
    thumbnailUrl: '/assets/turkish-gaps/daikin-shira-plus-duvar-tipi-split-klima.png',
    searchKeywords: [
      'split klima',
      'duvar tipi klima',
      'daikin',
      'arçelik klima',
      'inverter klima',
      '12000 btu',
      'iklimlendirme',
      'hvac',
      'klima iç ünite',
    ],
    roomTags: ['Salon', 'Yatak Odası', 'Çalışma Odası', 'Ofis'],
    aiSummary:
      'Türkiye evlerinin gerçek iklimlendirme standardı olan duvar tipi inverter split klima iç ünitesi (Daikin Hendek tesisleri / Türkiye üretimi). Aerodinamik kavisli ön panel, motorlu alt üfleme kanatçığı, 23°C gizli LED ekran ve DAIKIN marka baskısı.',
    finishes: SPLIT_AC_FINISHES,
    surfaceType: 'Mat Kristal Polimer Gövde + Motorlu Hava Kanatçığı + Gizli Beyaz LED Ekran',
    geometryBreakdown: [
      '80×29×22 cm duvar tipi iç ünite kasası, üst hava emiş panjurları ve yumuşak kavisli ön kapak.',
      'Alt kısımda açık açılı motorlu üfleme kanatçığı, iç yönlendirme lamelleri ve sağda gizli 23°C dijital LED göstergesi.',
    ],
    microDetails: [
      'Ön panel ortasında özgün DAIKIN mavi üçgen & wordmark baskısı ve gizli infrared alıcı gözü.',
    ],
    lightingTip: 'Tavan kotundan 20–25 cm aşağıya (yerden ~225 cm) yerleştirin; pencere yan duvarında en doğal mimari görünümü verir.',
  }),

  // 12. Baylan Su Sayacı, E.C.A. Ana Su Vanası & Basınç Düşürücü Tesisat Grubu
  createMepAsset({
    id: 'tr-baylan-su-sayaci-vana-grubu',
    slug: 'baylan-su-sayaci-eca-ana-vana-basinc-dusurucu',
    name: 'Baylan Su Sayacı, E.C.A. Ana Küresel Vana & Basınç Düşürücü Tesisat Grubu',
    brandStyle: 'Baylan / E.C.A. · Konut Sıhhi Tesisat Su Sayacı & Vana Grubu',
    category: 'Mimari & Çalışma',
    archetype: 'tr_water_meter_group',
    placement: 'wall-mounted',
    dimensionsCm: { width: 44, depth: 14, height: 24, mountHeight: 130 },
    polyEstimate: 11200,
    thumbnailUrl: '/assets/turkish-gaps/baylan-su-sayaci-eca-vana-grubu.png',
    searchKeywords: [
      'su sayacı',
      'baylan',
      'su saati',
      'ana su vanası',
      'küresel vana',
      'basınç düşürücü',
      'pislik tutucu',
      'sıhhi tesisat',
      'mekanik tesisat',
      'eca',
    ],
    roomTags: ['Apartman Şaftı', 'Daire Girişi', 'Banyo Şaftı', 'Teknik Oda'],
    aiSummary:
      'Türkiye apartman su şaftlarının standart sıhhi tesisat giriş grubu: İzmir merkezli Baylan mavi soğuk su sayacı, kırmızı kollu E.C.A. küresel ana kesme vanası, Y-tipi pirinç pislik tutucu filtre ve manometreli basınç düşürücü.',
    finishes: WATER_METER_FINISHES,
    surfaceType: 'Baylan Mavi Döküm Sayaç + Dövme Pirinç Basınç Düşürücü & Manometre + Kırmızı E.C.A. Vana',
    geometryBreakdown: [
      'Sıralı 3/4" yatay sıhhi tesisat hattı: girişte kırmızı kollu E.C.A. küresel vana ve Y-tipi pirinç pislik tutucu.',
      'Ortada okunabilir m³ kadranlı mavi Baylan soğuk su sayacı, çıkışta üstten 0–10 bar manometreli pirinç basınç düşürücü ve çekvalf.',
    ],
    microDetails: [
      'Sayaç kadranında BAYLAN · Q3=2.5 · m³ baskısı ve basınç düşürücü üzerinde 4 bar kalibreli manometre kadranı.',
    ],
    lightingTip: 'Teknik şaft veya kazan dairesi mekanik duvar kesitinde yerden 120–140 cm kotta kullanın.',
  }),

  // 13. KONE / Ake Asansör EN 81-20 Otomatik Çift Kanatlı Kat Kapısı & Çağrı Paneli
  createMepAsset({
    id: 'tr-kone-apartman-asansor-kapisi',
    slug: 'kone-ake-en81-20-otomatik-asansor-kat-kapisi',
    name: 'KONE / Ake Asansör EN 81-20 Otomatik Çift Kanatlı Kat Kapısı (630 kg · 8 Kişilik)',
    brandStyle: 'KONE / Ake Asansör · EN 81-20 Paslanmaz Kat Kapısı & LOP Panel',
    category: 'Mimari & Çalışma',
    archetype: 'tr_elevator_landing',
    placement: 'floor',
    dimensionsCm: { width: 132, depth: 26, height: 232 },
    polyEstimate: 14800,
    thumbnailUrl: '/assets/turkish-gaps/kone-ake-asansor-kat-kapisi-panel.png',
    searchKeywords: [
      'asansör',
      'asansör kapısı',
      'kat kapısı',
      'kone',
      'otis',
      'ake asansör',
      'en 81-20',
      '630 kg',
      '8 kişilik',
      'apartman asansörü',
      'çağrı butonu',
      'dikey sirkülasyon',
    ],
    roomTags: ['Apartman Holü', 'Lobi', 'Kat Sahanlığı', 'Rezidans'],
    aiSummary:
      'Türkiye Planlı Alanlar İmar Yönetmeliği ve TS EN 81-20 standardına uygun 90×210 cm net geçişli, 630 kg (8 kişilik) otomatik çift kanatlı satine paslanmaz çelik asansör kat kapısı. Üst dijital LED kat göstergesi (↑ 04) ve ışıklı çağrı butonu paneliyle (LOP) tam set.',
    finishes: ELEVATOR_FINISHES,
    surfaceType: '304 Fırçalı Paslanmaz Çelik Kapı & Kasa + Siyah Cam Dijital Kat Göstergesi + Alüminyum Eşik',
    geometryBreakdown: [
      '132×232 cm derin paslanmaz çelik söve çerçeve, yivli alüminyum alt kapı eşiği (sill) ve 90×210 cm merkezden açılır çift teleskopik kapı kanadı.',
      'Üst lentoda siyah temperli cam içinde sıcak amber/beyaz dot-matrix dijital kat göstergesi (↑ 04 · 630 kg / 8 Kişi).',
      'Sağ söve yanında sıva altı paslanmaz çelik kat çağrı paneli (LOP), ışıklı yukarı/aşağı paslanmaz butonlar ve anahtarlı servis kilidi.',
    ],
    microDetails: [
      'Üst gösterge camında KONE / EN 81-20 işareti ve buton çevresinde ince mavi/beyaz LED halka aydınlatma.',
    ],
    lightingTip: 'Kat holü ve apartman lobisi görselleştirmelerinde tavan lineer LED ışıkla 304 fırçalı çelik dikey yansımasını vurgulayın.',
  }),

  // 14. Ake / Otis EN 81-20 630 kg (8 Kişilik) Paslanmaz Çelik & Aynalı Asansör Kabini
  createMepAsset({
    id: 'tr-ake-asansor-kabini-630kg',
    slug: 'ake-otis-en81-20-630kg-8-kisilik-asansor-kabini',
    name: 'Ake / Otis EN 81-20 630 kg (8 Kişilik) Paslanmaz & Aynalı Asansör Kabini (110×140 cm)',
    brandStyle: 'Ake Asansör / Otis · EN 81-20 & EN 81-70 Konut Asansör Kabini',
    category: 'Mimari & Çalışma',
    archetype: 'tr_elevator_cabin',
    placement: 'floor',
    dimensionsCm: { width: 120, depth: 150, height: 226 },
    polyEstimate: 22400,
    thumbnailUrl: '/assets/turkish-gaps/ake-otis-630kg-asansor-kabini.png',
    searchKeywords: [
      'asansör kabini',
      'asansör',
      'ake asansör',
      'otis',
      'schindler',
      '630 kg',
      '8 kişilik',
      'en 81-20',
      'en 81-70',
      'kabin içi',
      'apartman asansörü',
    ],
    roomTags: ['Apartman', 'Rezidans', 'Otel', 'İş Merkezi'],
    aiSummary:
      'Türkiye 4 kat ve üzeri binalar için TS EN 81-20 / EN 81-70 erişilebilirlik normunda 110×140×220 cm iç ölçülü, 630 kg (8 kişilik) tam yürünür asansör kabini. Granit taban, satine paslanmaz & ceviz/bronz yan paneller, arka boy aynası, paslanmaz tutamak, LED tavan difüzörü ve tam donanımlı COP kat buton paneli.',
    finishes: ELEVATOR_FINISHES,
    surfaceType: '304 Paslanmaz Çelik & Dekoratif Yan Paneller + Güvenlik Aynası + Granit Zemin + LED Tavan',
    geometryBreakdown: [
      '110×140 cm iç alana sahip 3 duvarlı açık-önlü mimari kabin kesiti (iç mekan ve kesit renderlarına hazır).',
      'Doğal granit taban, arka duvarda yarım/tam boy lamine güvenlik aynası ve Ø38 mm paslanmaz çelik engelli erişim tutamağı.',
      'Sağ yan duvarda tam boy siyah cam COP kumanda paneli (kat göstergesi, Z/1–8 kabartmalı butonlar, alarm, kapı aç/kapa ve 630 kg / 8 Kişi etiketi).',
      'Tavanda gizli çerçeveli 3000K/4000K lineer LED aydınlatma difüzörü ve havalandırma yarıkları.',
    ],
    microDetails: [
      'COP panelinde okunaklı Z, 1, 2, 3, 4, 5, 6, 7, 8 tuş dizilimi, sarı acil alarm butonu ve EN 81-20 CE kapasite plakası.',
    ],
    lightingTip: 'Kabin iç mekan renderında kamera 24–28 mm geniş açıyla ön eşikten içeri bakacak şekilde konumlandırın; tavan LED difüzörü doğal dolgu ışığı sağlar.',
  }),

  // 15. Daikin / Arçelik Inverter Split Klima Dış Ünitesi & Duvar Konsolu (Dış Cephe)
  createMepAsset({
    id: 'tr-daikin-klima-dis-unite',
    slug: 'daikin-arcelik-inverter-split-klima-dis-unitesi-konsol',
    name: 'Daikin / Arçelik Inverter Split Klima Dış Ünitesi & Duvar Konsolu (80×30×55 cm)',
    brandStyle: 'Daikin / Arçelik · R32 Inverter Klima Dış Ünite & L-Konsol Seti',
    category: 'Dış Cephe',
    archetype: 'tr_ac_outdoor_unit',
    placement: 'wall-mounted',
    dimensionsCm: { width: 80, depth: 34, height: 56, mountHeight: 160 },
    polyEstimate: 14600,
    thumbnailUrl: '/assets/turkish-gaps/daikin-inverter-klima-dis-unite-konsol.png',
    searchKeywords: [
      'klima dış ünite',
      'klima motoru',
      'split klima',
      'daikin',
      'arçelik',
      'dış cephe klima',
      'balkon kliması',
      'klima konsolu',
      'mekanik mühendislik',
      'dış cephe',
    ],
    roomTags: ['Dış Cephe', 'Balkon', 'Villa Terası', 'Apartman Cephesi'],
    aiSummary:
      'Türkiye apartman balkonları ve villa dış cephe renderlarının olmazsa olmazı Daikin / Arçelik R32 inverter split klima dış ünitesi. Koruyucu dairesel fan ızgarası, 3 kanatlı aksiyel pervane, L-tipi duvar askı konsolları, kauçuk titreşim takozları ve izoleli çift bakır gaz borusu bağlantısı ile gerçekçi dış cephe CAD modeli.',
    finishes: SPLIT_AC_FINISHES,
    surfaceType: 'Elektrostatik Fırın Boyalı Galvaniz Sac + Siyah Koruyucu Fan Izgarası + Bakır Servis Vanası',
    geometryBreakdown: [
      '78×29×55 cm korozyona dayanıklı dış cephe kompresör gövdesi ve üst servis kapağı.',
      'Sol ön cephede dairesel koruyucu tel ızgara arkasında 3 kanatlı koyu aksiyel fan pervanesi.',
      'Altında 2 adet L-profil çelik duvar konsolu, kauçuk titreşim takozu ve sağ yanda koruma kapaklı çift izoleli bakır tesisat borusu.',
    ],
    microDetails: [
      'Sağ ön yüzeyde net DAIKIN INVERTER R32 teknik etiketi ve arka kısımda alüminyum kondenser serpantin lamelleri.',
    ],
    lightingTip: 'Dış cephe ve balkon renderlarında güneş ışığını 35° açıyla vererek dairesel fan ızgarasının gölgesini kompresör kasasına düşürün.',
  }),

  // 16. İGDAŞ / BaşkentGaz Dış Cephe Doğalgaz Servis Kutusu (Sarı Çelik Kutu)
  createMepAsset({
    id: 'tr-igdas-dogalgaz-servis-kutusu',
    slug: 'igdas-dis-cephe-dogalgaz-servis-kutusu-sari',
    name: 'İGDAŞ / BaşkentGaz Dış Cephe Doğalgaz Servis Kutusu — Sarı Çelik Kutu (42×22×52 cm)',
    brandStyle: 'İGDAŞ / BaşkentGaz · S-200 Dış Cephe Doğalgaz Servis Kutusu',
    category: 'Dış Cephe',
    archetype: 'tr_gas_service_box',
    placement: 'exterior-ground',
    dimensionsCm: { width: 42, depth: 22, height: 86 },
    polyEstimate: 7800,
    thumbnailUrl: '/assets/turkish-gaps/igdas-dis-cephe-dogalgaz-servis-kutusu.png',
    searchKeywords: [
      'igdaş',
      'doğalgaz kutusu',
      'servis kutusu',
      'sarı kutu',
      'başkentgaz',
      'izmirgaz',
      'doğalgaz kolon',
      'dış cephe',
      'bina girişi',
      'mekanik mühendislik',
    ],
    roomTags: ['Dış Cephe', 'Villa Bahçe Duvarı', 'Apartman Girişi', 'Cephe Tesisatı'],
    aiSummary:
      'Türkiye’deki her apartman ve villa cephesinde yer alan İGDAŞ / BaşkentGaz S-200 tipi sarı çelik doğalgaz servis kutusu. Üçgen servis kilidi, havalandırma panjurları, İGDAŞ · DOĞALGAZ uyarı baskısı, beton zemin kaidesi ve binaya yükselen sarı çelik kolon borusuyla dış cephe renderlarına anında Türkiye gerçekçiliği katar.',
    finishes: GAS_SERVICE_BOX_FINISHES,
    surfaceType: 'RAL 1021 İGDAŞ Sarısı Elektrostatik Çelik + Beton Kaide + Sarı Çelik Kolon Borusu',
    geometryBreakdown: [
      '42×22×52 cm eğimli yağmur şapkalı çelik servis kutusu, ön kapak menteşeleri ve üçgen kilit rozeti.',
      'Kapak alt ve üstünde damgalı gaz havalandırma panjurları ve sarı/siyah alev tehlike + İGDAŞ uyarı levhası.',
      'Altında 24 cm beton tesisat kaidesi ve üst çıkışta duvar kelepçeli DN32 sarı doğalgaz kolon yükseltme borusu.',
    ],
    microDetails: [
      'Ön kapakta okunaklı "İGDAŞ · DOĞALGAZ SERVİS KUTUSU · 187 ACİL" teknik uyarı grafiği.',
    ],
    lightingTip: 'Apartman giriş cephesi veya villa bahçe duvarı köşesinde zemin sıfır noktasına yerleştirerek dış mekan mimari gerçekçiliğini güçlendirin.',
  }),

  // 17. TS EN 671-1 Sıva Altı Apartman Yangın Dolabı (Hortum Makarası + 6 kg KKT Tüp)
  createMepAsset({
    id: 'tr-yangin-dolabi-siva-alti',
    slug: 'ts-en-671-1-siva-alti-apartman-yangin-dolabi-tup',
    name: 'TS EN 671-1 Sıva Altı Apartman Yangın Dolabı (Hortum Makarası + 6 kg KKT Tüp)',
    brandStyle: 'Üçyıldız / Norm · TS EN 671-1 Hortum Makaralı & Tüplü Yangın Dolabı',
    category: 'Mimari & Çalışma',
    archetype: 'tr_fire_hose_cabinet',
    placement: 'wall-mounted',
    dimensionsCm: { width: 80, depth: 22, height: 80, mountHeight: 100 },
    polyEstimate: 15200,
    thumbnailUrl: '/assets/turkish-gaps/ts-en-671-siva-alti-yangin-dolabi.png',
    searchKeywords: [
      'yangın dolabı',
      'yangın hortumu',
      'yangın tüpü',
      'ts en 671',
      'apartman holü',
      'merdiven sahanlığı',
      'mekanik mühendislik',
      'yangın tesisatı',
      'kkt tüp',
    ],
    roomTags: ['Apartman Holü', 'Merdiven Sahanlığı', 'Rezidans Koridoru', 'Otopark'],
    aiSummary:
      'Binaların Yangından Korunması Hakkında Yönetmelik ve TS EN 671-1 standardına uygun 80×80×22 cm sıva altı apartman yangın dolabı. Şeffaf/füme gözetleme camı arkasında sarılı yarı sert kırmızı yangın hortumu makarası, pirinç jet-sprey lansı ve sağ bölmede 6 kg ABC kuru kimyevi tozlu (KKT) yangın söndürme tüpü yer alır.',
    finishes: FIRE_CABINET_FINISHES,
    surfaceType: 'RAL 3000 Elektrostatik Çelik / 304 İnox Kasa + Temperli Cam + Kırmızı Hortum Makarası & KKT Tüp',
    geometryBreakdown: [
      '80×80×22 cm sıva altı çelik gömme kasa, 2.5 cm duvar taşma çerçevesi, krom bas-aç kulp ve temperli cam gözetleme penceresi.',
      'Sol bölmede Ø48 cm döner çelik makara üzerinde katmanlı 3D kırmızı yangın hortumu, pirinç vana ve jet-sprey lans ucu.',
      'Sağ bölmede manometreli, tetikli ve hortumlu 6 kg ABC KKT yangın söndürme tüpü.',
    ],
    microDetails: [
      'Üst çerçeve bandında net "YANGIN DOLABI · TS EN 671-1" ikonu ve tüp üzerinde kırmızı-beyaz ABC talimat etiketi.',
    ],
    lightingTip: 'Asansör kapısı ve kat holü renderlarında yerden 100 cm alt kotta yerleştirin; temperli camdan iç kırmızı makara ve tüp silüeti okunur.',
  }),

  // 18. Viko Karre IP44 Kapaklı Banyo & Balkon Topraklı Prizi (Type F Schuko)
  createMepAsset({
    id: 'tr-viko-karre-ip44-kapakli-priz',
    slug: 'viko-karre-ip44-kapakli-banyo-balkon-prizi',
    name: 'Viko Karre IP44 Kapaklı Banyo & Balkon Topraklı Prizi (Type F Schuko)',
    brandStyle: 'Viko by Panasonic · Karre IP44 Sızdırmaz Kapaklı Schuko Priz',
    category: 'Elektrik Tesisatı',
    archetype: 'tr_ip44_lidded_socket',
    placement: 'wall-mounted',
    dimensionsCm: { width: 9, depth: 5, height: 9, mountHeight: 115 },
    polyEstimate: 4600,
    thumbnailUrl: '/assets/turkish-gaps/viko-karre-ip44-kapakli-banyo-prizi.png',
    searchKeywords: [
      'kapaklı priz',
      'banyo prizi',
      'balkon prizi',
      'ip44 priz',
      'viko',
      'karre',
      'schuko',
      'topraklı priz',
      'elektrik tesisatı',
    ],
    roomTags: ['Banyo', 'Balkon', 'Teras', 'Çamaşır Odası', 'Mutfak'],
    aiSummary:
      'Türkiye banyo lavabo yanları, çamaşır odaları ve balkon/teras duvarları için zorunlu Viko Karre IP44 yaylı kapaklı, su sıçramasına dayanıklı Avrupa tipi (Type F Schuko) topraklı priz. Yarı şeffaf/opak menteşeli koruma kapağı, kauçuk sızdırmazlık contası ve alt parmak açma tırnağıyla 1:1 ölçekli.',
    finishes: VIKO_SOCKET_FINISHES,
    surfaceType: 'IP44 Polikarbonat Çerçeve + Yaylı Koruma Kapağı + Kauçuk Conta + Nikel Schuko Topraklama',
    geometryBreakdown: [
      '8.8×8.8 cm Viko Karre çerçeve, IP44 siyah/gri sızdırmazlık conta halkası ve üstten yaylı menteşeli koruyucu kapak.',
      'Hafif aralık/yarı saydam kapak altında Avrupa tipi (Type F) dairesel priz kuyusu, çift kutup deliği ve üst-alt metal topraklama klipsleri.',
    ],
    microDetails: [
      'Kapak ön yüzünde "VIKO · IP44" kabartma işareti ve su damlası koruma piktogramı.',
    ],
    lightingTip: 'Banyo aynası yanında 115–120 cm kotta veya balkon duvarında 45 cm kotta seramik derz hizasına yerleştirin.',
  }),

  // 19. Makel / Luna 3 Fazlı Dijital Elektrik Sayacı & Apartman Sayaç Panosu
  createMepAsset({
    id: 'tr-makel-elektrik-sayac-panosu',
    slug: 'makel-luna-3-fazli-dijital-elektrik-sayaci-panosu',
    name: 'Makel / Luna 3 Fazlı Dijital Elektrik Sayacı & Apartman Sayaç Panosu (36×16×48 cm)',
    brandStyle: 'Makel / Luna · M560 TEDAŞ Onaylı Dijital kWh Sayaç & Şaft Panosu',
    category: 'Elektrik Tesisatı',
    archetype: 'tr_electric_meter_panel',
    placement: 'wall-mounted',
    dimensionsCm: { width: 36, depth: 16, height: 48, mountHeight: 150 },
    polyEstimate: 11200,
    thumbnailUrl: '/assets/turkish-gaps/makel-luna-elektrik-sayac-panosu.png',
    searchKeywords: [
      'elektrik sayacı',
      'makel',
      'luna',
      'sayaç panosu',
      'tedaş',
      'bedaş',
      'elektrik şaftı',
      'kwh sayacı',
      'elektrik mühendisliği',
      'apartman panosu',
    ],
    roomTags: ['Apartman Şaftı', 'Teknik Oda', 'Villa Garajı', 'Bina Girişi'],
    aiSummary:
      'Türkiye apartman elektrik şaftları ve müstakil villa girişleri için Makel / Luna 3 fazlı çok tarifeli dijital elektrik sayacı (T1/T2/T3) ve sıva üstü şaft panosu. Arkadan aydınlatmalı LCD kWh ekranı, optik okuma portu, mühürlü klemens kapağı ve 3x40A ana kesici şalteriyle gerçekçi elektrik mühendisliği varlığı.',
    finishes: FUSE_BOX_FINISHES,
    surfaceType: 'RAL 7035 Çelik Sayaç Panosu + Polikarbonat Makel Sayaç + LCD Ekran + 3 Faz Otomat',
    geometryBreakdown: [
      '36×16×48 cm gözetleme pencereli metal/polikarbonat apartman sayaç panosu ve 3 fazlı 40A ana sigorta.',
      'İçeride Makel / Luna M560 3 fazlı elektronik kWh sayacı, T1/T2/T3 arkadan aydınlatmalı LCD ekran, kırmızı darbe LED’i ve dairesel optik okuma portu.',
      'Alt kısımda mühürlenebilir şeffaf klemens koruma kapağı ve 4’lü bakır/PVC faz kablo girişleri.',
    ],
    microDetails: [
      'Sayaç ön panelinde net "MAKEL · M560 · 3x230/400V · 01482.6 kWh" LCD ekran grafiği ve CE/MID onay işareti.',
    ],
    lightingTip: 'Villa teknik odası veya apartman merdiven altı elektrik şaftında yerden 150 cm kotta konumlandırın.',
  }),

  // 20. Mavili Maxlogic / Teknim İGDAŞ Doğalgaz Kaçak Alarmı & Optik Duman Dedektörü Seti
  createMepAsset({
    id: 'tr-mavili-gaz-duman-dedektoru',
    slug: 'mavili-teknim-igdas-dogalgaz-alarmi-duman-dedektoru',
    name: 'Mavili Maxlogic / Teknim İGDAŞ Doğalgaz Kaçak Alarmı & Duman Dedektörü (14×6×22 cm)',
    brandStyle: 'Mavili / Teknim · TS EN 50194 Doğalgaz Kaçak Dedektörü & Yangın Sensörü',
    category: 'Elektrik Tesisatı',
    archetype: 'tr_gas_smoke_detector',
    placement: 'wall-mounted',
    dimensionsCm: { width: 14, depth: 6, height: 22, mountHeight: 230 },
    polyEstimate: 5600,
    thumbnailUrl: '/assets/turkish-gaps/mavili-igdas-dogalgaz-duman-dedektoru.png',
    searchKeywords: [
      'doğalgaz dedektörü',
      'gaz alarmı',
      'duman dedektörü',
      'yangın sensörü',
      'mavili',
      'teknim',
      'igdaş',
      'mutfak güvenliği',
      'zayıf akım',
      'elektrik mühendisliği',
    ],
    roomTags: ['Mutfak', 'Kombi Balkonu', 'Koridor', 'Kazan Dairesi'],
    aiSummary:
      'İGDAŞ doğalgaz açılış şartnamesine uygun mutfak doğalgaz (metan) kaçak alarm cihazı (duvar tipi, tavandan 15–30 cm aşağıda) ve eşleşen EN 54 optik duman dedektörü. Havalandırma sensör ızgaraları, yeşil enerji / sarı hata / kırmızı alarm LED’leri ve TEST/RESET butonuyla modern Türk mutfak renderlarını tamamlar.',
    finishes: INTERCOM_FINISHES,
    surfaceType: 'Alev Geciktirici ABS Gövde + Sensör Panjur Izgarası + 3 Renk Durum LED’i',
    geometryBreakdown: [
      '12×4.5×16 cm yuvarlatılmış duvar tipi doğalgaz kaçak alarm ünitesi, çift sıralı metan sensör ızgarası, 3 durum LED’i ve TEST butonu.',
      'Altında esnek besleme kablo rakoru ve üst modülde kompakt EN 54 optik duman sensör başlığı.',
    ],
    microDetails: [
      'Ön yüzeyde "MAVİLİ · DOĞALGAZ / METAN ALARM · TS EN 50194" baskısı ve yumuşak yeşil güç LED parıltısı.',
    ],
    lightingTip: 'Mutfak ocağı veya kombi yakınında tavandan 20–30 cm aşağıda (yaklaşık 230 cm kot) duvara yerleştirin.',
  }),

  // 21. DemirDöküm DT4 Titanium / Baymak 65L Elektrikli Termosifon
  createMepAsset({
    id: 'tr-demirdokum-dt4-termosifon-65l',
    slug: 'demirdokum-dt4-titanium-65l-elektrikli-termosifon',
    name: 'DemirDöküm DT4 Titanium / Baymak 65L Elektrikli Termosifon (44×45×76 cm)',
    brandStyle: 'DemirDöküm · DT4 Titanium Digital 65L Silindirik Termosifon',
    category: 'Mimari & Çalışma',
    archetype: 'tr_electric_water_heater',
    placement: 'wall-mounted',
    dimensionsCm: { width: 44, depth: 45, height: 76, mountHeight: 140 },
    polyEstimate: 10400,
    thumbnailUrl: '/assets/turkish-gaps/demirdokum-dt4-65l-elektrikli-termosifon.png',
    searchKeywords: [
      'termosifon',
      'şofben',
      'demirdöküm',
      'baymak',
      'elektrikli su ısıtıcı',
      '65 litre',
      'dt4 titanium',
      'yazlık villa',
      'banyo tesisat',
      'mekanik mühendislik',
    ],
    roomTags: ['Banyo', 'Yazlık Villa', 'Çamaşır Odası', 'Teknik Oda'],
    aiSummary:
      'Bodrum, Çeşme, Antalya sahil villaları ve doğalgazsız Türk konutlarının standardı DemirDöküm DT4 Titanium 65 litre silindirik duvar tipi elektrikli termosifon. Parlak beyaz titanyum emaye silindirik kazan, siyah dijital derece göstergesi (55°C), emniyet tahliye ventili ve mavi/kırmızı soğuk-sıcak flex bağlantılarıyla eksiksiz.',
    finishes: BAYMAK_BOILER_FINISHES,
    surfaceType: 'Titanyum Emaye Silindirik Çelik Gövde + Siyah Dijital LED Panel + Pirinç Emniyet Ventili',
    geometryBreakdown: [
      'Ø44×66 cm bombe üst-alt kapaklı silindirik termosifon kazanı ve arka çelik duvar askı konsolları.',
      'Alt ön yüzeyde siyah cam dijital sıcaklık paneli (55°C · ECO), güç düğmesi ve DemirDöküm DT4 Titanium marka grafiği.',
      'Alt kısımda mavi soğuk su girişi (pirinç çekvalf emniyet ventilli), kırmızı sıcak su çıkışı ve örgülü çelik flex hortum bağlantıları.',
    ],
    microDetails: [
      'Kazan üzerinde net DemirDöküm DT4 Titanium logosu ve mavi/kırmızı su bağlantısı renk kodlaması.',
    ],
    lightingTip: 'Banyo veya teknik oda duvarına yerden 140 cm alt kotta asın; silindirik parlak emaye yüzeyde dikey yumuşak ışık şeridi oluşturun.',
  }),

  // 22. Sukar / Geberit CleanLine 60 cm Paslanmaz Çelik Lineer Duş & Balkon Yer Süzgeci
  createMepAsset({
    id: 'tr-sukar-lineer-dus-suzgeci',
    slug: 'sukar-geberit-60cm-paslanmaz-lineer-dus-yer-suzgeci',
    name: 'Sukar / Geberit CleanLine 60 cm Paslanmaz Çelik Lineer Duş & Balkon Yer Süzgeci',
    brandStyle: 'Sukar / Geberit · AISI 304 60 cm Lineer Duş Kanalı & Koku Önleyici Sifon',
    category: 'Banyo',
    subCategory: 'Duşakabin & Küvet',
    archetype: 'tr_linear_floor_drain',
    placement: 'floor',
    dimensionsCm: { width: 60, depth: 11, height: 8 },
    polyEstimate: 7400,
    thumbnailUrl: '/assets/turkish-gaps/sukar-60cm-paslanmaz-lineer-dus-suzgeci.png',
    searchKeywords: [
      'yer süzgeci',
      'lineer süzgeç',
      'duş kanalı',
      'sukar',
      'geberit cleanline',
      'duş gideri',
      'banyo gideri',
      'balkon süzgeci',
      'sıhhi tesisat',
    ],
    roomTags: ['Banyo', 'Walk-in Duş', 'Balkon', 'Villa Terası', 'Çamaşır Odası'],
    aiSummary:
      'Modern Türk walk-in duşakabin zeminleri ve villa balkonlarında kullanılan Sukar / Geberit CleanLine 60 cm AISI 304 paslanmaz çelik lineer yer süzgeci. Hassas kesimli ince oluklu fırçalı paslanmaz kapak, çevre seramik izolasyon flansı ve alt koku önleyici Ø50 mm ABS sifon çıkışıyla zemin kotuna tam gömülür.',
    finishes: LINEAR_DRAIN_FINISHES,
    surfaceType: 'AISI 304 Fırçalı Paslanmaz / PVD Kapak + Su Yalıtım Flansı + ABS Sifon',
    geometryBreakdown: [
      '60×7 cm sıfır kotlu paslanmaz çelik dış kanal çerçevesi ve çıkarılabilir ince çizgi kanallı (slot) paslanmaz ızgara kapağı.',
      'Kanal çevresinde delikli su yalıtım eteği (flanş) ve altında Ø50 mm yatay PVC/ABS koku önleyici sifon haznesi.',
    ],
    microDetails: [
      'Izgara kenarında lazer kazıma SUKAR AISI 304 detayı ve mikro pahlı su akış boşlukları.',
    ],
    lightingTip: 'Walk-in duş zemininde arka duvardan 8–10 cm içeride seramik üst yüzeyle sıfır kotta konumlandırın.',
  }),
];

export const TURKISH_MEP_ASSET_IDS = new Set<string>(TURKISH_MEP_ASSETS.map((a) => a.id));
