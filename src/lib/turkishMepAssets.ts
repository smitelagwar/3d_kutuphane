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

function createMepAsset(params: {
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
  const defaultFinish = params.finishes[0];
  const { width, depth, height } = params.dimensionsCm;
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
    category: 'Mimari & Çalışma',
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
    category: 'Mimari & Çalışma',
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
    category: 'Mimari & Çalışma',
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
    category: 'Mimari & Çalışma',
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
];

export const TURKISH_MEP_ASSET_IDS = new Set<string>(TURKISH_MEP_ASSETS.map((a) => a.id));
