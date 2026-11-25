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
import { TURKISH_MEP_ASSETS, TURKISH_MEP_ASSET_IDS } from './turkishMepAssets';
import {
  TURKISH_ELECTRICAL_LIGHTING_ASSETS,
  TURKISH_ELECTRICAL_LIGHTING_ASSET_IDS,
} from './turkishElectricalLightingAssets';
import {
  TURKISH_ENTRYWAY_ASSETS,
  TURKISH_ENTRYWAY_ASSET_IDS,
} from './turkishEntrywayAssets';
import {
  TURKISH_KITCHEN_BUILTIN_ASSETS,
  TURKISH_KITCHEN_BUILTIN_ASSET_IDS,
} from './turkishKitchenBuiltInAssets';
import {
  TURKISH_HOME_STUDY_TOYS_ASSETS,
  TURKISH_HOME_STUDY_TOYS_ASSET_IDS,
} from './turkishHomeStudyToysAssets';

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
// OFFICIAL TURKISH RETAIL FINISH BANKS (Researched Real Brands Sold in Turkey)
// ============================================================================

const VITRA_ALATURKA_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'vitra-hygiene-parlak-beyaz',
    label: 'VitrA Hygiene Parlak Beyaz · Krom',
    comboSummary: 'Taş: VitrA Parlak Beyaz Vitrifiye · Sifon/Giriş: Parlak Krom',
    materialKind: 'ceramic',
    comboRole: 'sanitary_ceramic',
    partFinishes: {
      primary: { hex: '#F7F8FA', roughness: 0.08, metalness: 0.02, partLabel: 'VitrA Hygiene Parlak Beyaz' },
      secondary: { hex: '#ECEEF2', roughness: 0.24, metalness: 0.02, partLabel: 'Kaydırmaz Ayak Olukları' },
      accent: { hex: '#DCE1E7', roughness: 0.1, metalness: 0.96, partLabel: 'Paslanmaz Krom Sifon' },
    },
  }),
  makeFinish({
    id: 'vitra-mat-beyaz-siyah',
    label: 'VitrA Mat Beyaz · Mat Siyah',
    comboSummary: 'Taş: VitrA Mat Beyaz Seramik · Sifon/Detay: Mat Siyah Metal',
    materialKind: 'ceramic',
    comboRole: 'sanitary_ceramic',
    partFinishes: {
      primary: { hex: '#EEEFE9', roughness: 0.42, metalness: 0.02, partLabel: 'Mat Beyaz Seramik' },
      secondary: { hex: '#E1E1DA', roughness: 0.56, metalness: 0.02, partLabel: 'Kaydırmaz Yüzey' },
      accent: { hex: '#23262C', roughness: 0.36, metalness: 0.78, partLabel: 'Mat Siyah Sifon' },
    },
  }),
  makeFinish({
    id: 'vitra-krem-fildisi-krom',
    label: 'VitrA Fildişi Krem · Krom',
    comboSummary: 'Taş: Sıcak Fildişi Vitrifiye · Sifon: Parlak Krom',
    materialKind: 'ceramic',
    comboRole: 'sanitary_ceramic',
    partFinishes: {
      primary: { hex: '#F0E9DC', roughness: 0.12, metalness: 0.02, partLabel: 'Fildişi Vitrifiye' },
      secondary: { hex: '#E2D9C9', roughness: 0.28, metalness: 0.02, partLabel: 'Ayak Basma Olukları' },
      accent: { hex: '#DDE2E8', roughness: 0.12, metalness: 0.95, partLabel: 'Parlak Krom Sifon' },
    },
  }),
  makeFinish({
    id: 'vitra-mat-antrasit-siyah',
    label: 'VitrA Mat Antrasit · Siyah',
    comboSummary: 'Taş: Mat Antrasit Seramik · Sifon/Giriş: Füme Siyah Metal',
    materialKind: 'ceramic',
    comboRole: 'sanitary_ceramic',
    partFinishes: {
      primary: { hex: '#3D424B', roughness: 0.44, metalness: 0.05, partLabel: 'Mat Antrasit Seramik' },
      secondary: { hex: '#31353D', roughness: 0.58, metalness: 0.05, partLabel: 'Kaydırmaz Oluklar' },
      accent: { hex: '#1E2126', roughness: 0.34, metalness: 0.82, partLabel: 'Mat Siyah Sifon' },
    },
  }),
  makeFinish({
    id: 'vitra-kasmir-tas-bronz',
    label: 'VitrA Kaşmir Taş · Bronz',
    comboSummary: 'Taş: Mat Kaşmir Seramik · Sifon: Saten Bronz',
    materialKind: 'ceramic',
    comboRole: 'sanitary_ceramic',
    partFinishes: {
      primary: { hex: '#D6CDC0', roughness: 0.42, metalness: 0.02, partLabel: 'Kaşmir Seramik' },
      secondary: { hex: '#C6BCAE', roughness: 0.55, metalness: 0.02, partLabel: 'Ayak Basma Olukları' },
      accent: { hex: '#A5804D', roughness: 0.26, metalness: 0.88, partLabel: 'Saten Bronz Sifon' },
    },
  }),
];

const GEBERIT_SIGMA_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'geberit-mat-siyah-krom',
    label: 'Geberit Mat Siyah · Parlak Krom Halka',
    comboSummary: 'Plaka & Tuşlar: Geberit Mat Siyah · Tasarım Halkası/Şeridi: Parlak Krom',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#202329', roughness: 0.4, metalness: 0.16, partLabel: 'Mat Siyah Plaka' },
      secondary: { hex: '#272B32', roughness: 0.36, metalness: 0.2, partLabel: 'Mat Siyah Basma Tuşları' },
      accent: { hex: '#E4E9EF', roughness: 0.08, metalness: 0.97, partLabel: 'Parlak Krom Tasarım Halka/Şerit' },
    },
  }),
  makeFinish({
    id: 'geberit-beyaz-gold',
    label: 'Geberit Alp Beyazı · Altın Pirinç',
    comboSummary: 'Plaka & Tuşlar: Alp Beyazı · Tasarım Halkası/Şeridi: Fırçalı Altın Pirinç',
    materialKind: 'ceramic',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#F6F7F9', roughness: 0.16, metalness: 0.03, partLabel: 'Alp Beyazı Plaka' },
      secondary: { hex: '#FFFFFF', roughness: 0.14, metalness: 0.03, partLabel: 'Parlak Beyaz Tuşlar' },
      accent: { hex: '#D4AF5A', roughness: 0.2, metalness: 0.94, partLabel: 'Altın Pirinç Tasarım Halka' },
    },
  }),
  makeFinish({
    id: 'geberit-parlak-krom-mat-krom',
    label: 'Geberit Parlak Krom · Mat Krom',
    comboSummary: 'Plaka: Parlak Ayna Krom · Tuşlar: Fırçalı Mat Krom · Çerçeve: Parlak Krom',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#E5E9EE', roughness: 0.09, metalness: 0.97, partLabel: 'Parlak Krom Plaka' },
      secondary: { hex: '#C4CAD2', roughness: 0.28, metalness: 0.92, partLabel: 'Mat Krom Tuşlar' },
      accent: { hex: '#F0F3F6', roughness: 0.08, metalness: 0.98, partLabel: 'Parlak Krom Halka' },
    },
  }),
  makeFinish({
    id: 'geberit-beyaz-krom',
    label: 'Geberit Alp Beyazı · Parlak Krom',
    comboSummary: 'Plaka & Tuşlar: Parlak Alp Beyazı · Tasarım Halkası: Parlak Krom',
    materialKind: 'ceramic',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#F5F6F8', roughness: 0.15, metalness: 0.03, partLabel: 'Alp Beyazı Plaka' },
      secondary: { hex: '#FBFCFD', roughness: 0.14, metalness: 0.03, partLabel: 'Beyaz Basma Tuşları' },
      accent: { hex: '#DFE4EA', roughness: 0.09, metalness: 0.96, partLabel: 'Parlak Krom Halka' },
    },
  }),
  makeFinish({
    id: 'geberit-fircali-pirinc-siyah',
    label: 'Geberit Fırçalı Pirinç · Mat Siyah',
    comboSummary: 'Plaka: Fırçalı Pirinç PVD · Tuşlar: Mat Siyah · Tasarım Halkası: Parlak Gold',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#D4AF5A', roughness: 0.24, metalness: 0.94, partLabel: 'Fırçalı Pirinç Plaka' },
      secondary: { hex: '#23262C', roughness: 0.38, metalness: 0.35, partLabel: 'Mat Siyah Tuşlar' },
      accent: { hex: '#E6C979', roughness: 0.18, metalness: 0.96, partLabel: 'Parlak Gold Halka' },
    },
  }),
];

const VIKO_SCHNEIDER_SOCKET_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'schneider-viko-beyaz-krom',
    label: 'Parlak Beyaz · Krom Tırnak',
    comboSummary: 'Çerçeve & Kapak: Parlak Beyaz Polikarbonat · Topraklama Tırnağı: Krom/Pirinç',
    materialKind: 'ceramic',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#F6F7F8', roughness: 0.18, metalness: 0.02, partLabel: 'Parlak Beyaz Çerçeve' },
      secondary: { hex: '#ECEDF0', roughness: 0.24, metalness: 0.02, partLabel: 'İç Yuva & Tuş' },
      accent: { hex: '#D4DAE2', roughness: 0.14, metalness: 0.94, partLabel: 'Schuko Topraklama Tırnağı' },
    },
  }),
  makeFinish({
    id: 'schneider-asfora-antrasit',
    label: 'Schneider Asfora Antrasit · Çelik',
    comboSummary: 'Çerçeve & Kapak: Mat Antrasit (RAL 7016) · Topraklama & USB Detay: Çelik',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#343840', roughness: 0.36, metalness: 0.18, partLabel: 'Asfora Antrasit Çerçeve' },
      secondary: { hex: '#262A31', roughness: 0.42, metalness: 0.14, partLabel: 'İç Soket & Tuş' },
      accent: { hex: '#CFD5DC', roughness: 0.18, metalness: 0.94, partLabel: 'Çelik Topraklama Tırnağı' },
    },
  }),
  makeFinish({
    id: 'viko-karre-krem',
    label: 'Viko Karre / Asfora Krem · Pirinç',
    comboSummary: 'Çerçeve & Kapak: Sıcak Krem · Topraklama Tırnağı: Saten Pirinç',
    materialKind: 'ceramic',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#EFE7D6', roughness: 0.22, metalness: 0.02, partLabel: 'Sıcak Krem Çerçeve' },
      secondary: { hex: '#E3D9C4', roughness: 0.28, metalness: 0.02, partLabel: 'Krem İç Kapak' },
      accent: { hex: '#CFA859', roughness: 0.22, metalness: 0.92, partLabel: 'Pirinç Tırnak' },
    },
  }),
  makeFinish({
    id: 'schneider-asfora-aluminyum',
    label: 'Schneider Asfora Alüminyum · Siyah',
    comboSummary: 'Çerçeve & Kapak: Fırçalı Metalik Alüminyum · İç Yuva: Koyu Gri · Tırnak: Krom',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#C5CBD3', roughness: 0.26, metalness: 0.84, partLabel: 'Fırçalı Alüminyum' },
      secondary: { hex: '#3B4048', roughness: 0.42, metalness: 0.25, partLabel: 'Antrasit İç Yuva' },
      accent: { hex: '#E4E8EE', roughness: 0.12, metalness: 0.96, partLabel: 'Krom Tırnak' },
    },
  }),
  makeFinish({
    id: 'schneider-asfora-bronz',
    label: 'Schneider Asfora Bronz · Siyah',
    comboSummary: 'Çerçeve: Metalik Saten Bronz · İç Yuva: Mat Siyah · Tırnak: Pirinç',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#6F5844', roughness: 0.3, metalness: 0.78, partLabel: 'Asfora Saten Bronz' },
      secondary: { hex: '#23262C', roughness: 0.42, metalness: 0.16, partLabel: 'Siyah İç Soket' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.92, partLabel: 'Pirinç Tırnak' },
    },
  }),
  makeFinish({
    id: 'schneider-asfora-mese-antrasit',
    label: 'Schneider Asfora Meşe · Antrasit',
    comboSummary: 'Dış Çerçeve: Doğal Meşe Ahşap · İç Mekanizma: Mat Antrasit · Tırnak: Krom',
    materialKind: 'wood',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#BA9266', roughness: 0.48, metalness: 0.04, partLabel: 'Meşe Çerçeve' },
      secondary: { hex: '#32363E', roughness: 0.38, metalness: 0.16, partLabel: 'Antrasit Mekanizma' },
      accent: { hex: '#DCE1E8', roughness: 0.14, metalness: 0.94, partLabel: 'Krom Tırnak' },
    },
  }),
];

const BRANDED_APPLIANCE_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'tr-fircali-inox-siyah-ekran',
    label: 'Fırçalı İnox · Siyah Ekran · Krom',
    comboSummary: 'Gövde & Kapak: Fırçalı Paslanmaz İnox · Kontrol Paneli: Siyah Cam · Kulp: Krom',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#C8CED6', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Paslanmaz İnox' },
      secondary: { hex: '#181B22', roughness: 0.14, metalness: 0.26, partLabel: 'Siyah Cam Ekran Paneli' },
      accent: { hex: '#E4E8EE', roughness: 0.12, metalness: 0.96, partLabel: 'Parlak Krom Kulp' },
      ceramic: { hex: '#1A1E25', roughness: 0.12, metalness: 0.22, partLabel: 'Füme Fırın/Panel Camı' },
    },
  }),
  makeFinish({
    id: 'tr-dark-inox-siyah-cam',
    label: 'DarkSteel / Siyah Cam · İnox Kulp',
    comboSummary: 'Gövde & Kapak: Siyah Temperli Cam / DarkSteel · Kulp & Detay: Fırçalı İnox',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#1F232A', roughness: 0.22, metalness: 0.62, partLabel: 'DarkSteel / Siyah Cam' },
      secondary: { hex: '#14171D', roughness: 0.12, metalness: 0.28, partLabel: 'Parlak Siyah Ekran' },
      accent: { hex: '#D0D6DE', roughness: 0.18, metalness: 0.94, partLabel: 'Fırçalı İnox Kulp' },
      ceramic: { hex: '#161920', roughness: 0.12, metalness: 0.24, partLabel: 'Siyah Fırın Camı' },
    },
  }),
  makeFinish({
    id: 'tr-parlak-beyaz-siyah-panel',
    label: 'Parlak Beyaz · Siyah Ekran · Krom',
    comboSummary: 'Gövde & Kapak: Parlak Beyaz Cam/Emaye · Ekran: Siyah Panel · Kulp: İnox',
    materialKind: 'ceramic',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#F4F6F8', roughness: 0.14, metalness: 0.06, partLabel: 'Parlak Beyaz Emaye/Cam' },
      secondary: { hex: '#1D2129', roughness: 0.16, metalness: 0.24, partLabel: 'Siyah LED Kontrol Paneli' },
      accent: { hex: '#DCE1E8', roughness: 0.12, metalness: 0.95, partLabel: 'İnox Kulp' },
      ceramic: { hex: '#20242C', roughness: 0.14, metalness: 0.22, partLabel: 'Füme Cam Pencere' },
    },
  }),
  makeFinish({
    id: 'tr-antrasit-mat-inox',
    label: 'Ankastre Mat Antrasit · İnox',
    comboSummary: 'Gövde: Mat Antrasit Çelik · Ekran: Siyah Cam · Kulp: Saten İnox',
    materialKind: 'metal',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#3B414C', roughness: 0.34, metalness: 0.72, partLabel: 'Ankastre Mat Antrasit' },
      secondary: { hex: '#171A21', roughness: 0.14, metalness: 0.28, partLabel: 'Siyah Cam Panel' },
      accent: { hex: '#C6CCD5', roughness: 0.2, metalness: 0.92, partLabel: 'Saten İnox Kulp' },
      ceramic: { hex: '#1A1D24', roughness: 0.14, metalness: 0.24, partLabel: 'Füme Cam' },
    },
  }),
  makeFinish({
    id: 'tr-country-krem-pirinc',
    label: 'Country Krem · Siyah Cam · Pirinç',
    comboSummary: 'Gövde: Sıcak Country Krem · Panel: Siyah Cam · Kulp & Düğme: Fırçalı Pirinç',
    materialKind: 'ceramic',
    comboRole: 'appliance',
    partFinishes: {
      primary: { hex: '#EAE1D2', roughness: 0.22, metalness: 0.05, partLabel: 'Country Krem Gövde' },
      secondary: { hex: '#1E2128', roughness: 0.16, metalness: 0.24, partLabel: 'Siyah Cam Panel' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Pirinç Kulp' },
      ceramic: { hex: '#1C2027', roughness: 0.14, metalness: 0.24, partLabel: 'Füme Cam' },
    },
  }),
];

const ECA_PULLOUT_FAUCET_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'eca-parlak-krom-siyah-hortum',
    label: 'E.C.A. Parlak Krom · Siyah Hortum',
    comboSummary: 'Gövde & Spiral Yay: Parlak Krom · Esnek Hortum & Nozul: Mat Siyah Silikon',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#E6EAEF', roughness: 0.09, metalness: 0.97, partLabel: 'Parlak Krom Gövde' },
      secondary: { hex: '#23262C', roughness: 0.62, metalness: 0.1, partLabel: 'Mat Siyah Esnek Hortum' },
      accent: { hex: '#D4DAE2', roughness: 0.14, metalness: 0.95, partLabel: 'Krom Spiral Yay' },
    },
  }),
  makeFinish({
    id: 'eca-mat-siyah-pirinc',
    label: 'E.C.A. Mat Siyah · Fırçalı Pirinç',
    comboSummary: 'Gövde & Spiral Yay: Mat Siyah PVD · Başlık/Halka Detay: Fırçalı Pirinç',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#1F2228', roughness: 0.38, metalness: 0.78, partLabel: 'Mat Siyah Gövde' },
      secondary: { hex: '#2B2F37', roughness: 0.64, metalness: 0.12, partLabel: 'Siyah Silikon Hortum' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Pirinç Detay' },
    },
  }),
  makeFinish({
    id: 'artema-fircali-gold-siyah',
    label: 'Artema Fırçalı Gold · Siyah Hortum',
    comboSummary: 'Gövde & Yay: Fırçalı Altın Gold PVD · Hortum & Nozul: Mat Siyah',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Gold Gövde' },
      secondary: { hex: '#22252C', roughness: 0.62, metalness: 0.12, partLabel: 'Mat Siyah Hortum' },
      accent: { hex: '#E4C676', roughness: 0.18, metalness: 0.96, partLabel: 'Parlak Gold Yay' },
    },
  }),
  makeFinish({
    id: 'artema-fume-gunmetal',
    label: 'Artema Füme Gunmetal · Siyah',
    comboSummary: 'Gövde & Yay: Füme Gunmetal PVD · Hortum: Mat Siyah',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#4B525E', roughness: 0.24, metalness: 0.92, partLabel: 'Füme Gunmetal Gövde' },
      secondary: { hex: '#202329', roughness: 0.62, metalness: 0.12, partLabel: 'Mat Siyah Hortum' },
      accent: { hex: '#6C7482', roughness: 0.2, metalness: 0.94, partLabel: 'Antrasit Spiral Yay' },
    },
  }),
  makeFinish({
    id: 'eca-fircali-inox',
    label: 'E.C.A. Fırçalı İnox · Siyah Hortum',
    comboSummary: 'Gövde: Fırçalı Paslanmaz İnox · Hortum: Mat Siyah · Yay: Saten Çelik',
    materialKind: 'metal',
    comboRole: 'faucet_hardware',
    partFinishes: {
      primary: { hex: '#C2C8D0', roughness: 0.26, metalness: 0.92, partLabel: 'Fırçalı İnox' },
      secondary: { hex: '#24272D', roughness: 0.6, metalness: 0.12, partLabel: 'Siyah Hortum' },
      accent: { hex: '#DCE1E8', roughness: 0.16, metalness: 0.94, partLabel: 'Saten Çelik Yay' },
    },
  }),
];

function createBoilerFinishes(opts: {
  id: string;
  label: string;
  comboSummary: string;
  panelHex?: string;
  panelLabel?: string;
}): MaterialFinish[] {
  return [
    makeFinish({
      id: opts.id,
      label: opts.label,
      comboSummary: opts.comboSummary,
      materialKind: 'ceramic',
      comboRole: 'appliance',
      partFinishes: {
        primary: { hex: '#F6F7F9', roughness: 0.18, metalness: 0.08, partLabel: 'RAL 9016 Parlak Beyaz Gövde' },
        secondary: { hex: opts.panelHex ?? '#1B1F26', roughness: 0.18, metalness: 0.24, partLabel: opts.panelLabel ?? 'Dijital LCD Panel' },
        accent: { hex: '#C79B52', roughness: 0.26, metalness: 0.9, partLabel: 'Pirinç & Bakır Tesisat Vanaları' },
      },
    }),
    makeFinish({
      id: 'kombi-mat-beyaz-krom',
      label: 'Mat Beyaz · Antrasit Ekran · Krom',
      comboSummary: 'Gövde: Mat Beyaz Emaye · Panel: Antrasit · Alt Tesisat: Krom Vana',
      materialKind: 'ceramic',
      comboRole: 'appliance',
      partFinishes: {
        primary: { hex: '#EFF0EC', roughness: 0.36, metalness: 0.08, partLabel: 'Mat Beyaz Gövde' },
        secondary: { hex: '#2C313A', roughness: 0.24, metalness: 0.25, partLabel: 'Antrasit Ekran' },
        accent: { hex: '#D8DDE4', roughness: 0.14, metalness: 0.95, partLabel: 'Krom Tesisat Vanaları' },
      },
    }),
    makeFinish({
      id: 'kombi-trafik-beyaz-gri',
      label: 'Trafik Beyazı · Metalik Gri Panel',
      comboSummary: 'Gövde: Trafik Beyazı · Panel: Metalik Gri Çerçeveli LCD · Vana: Pirinç',
      materialKind: 'ceramic',
      comboRole: 'appliance',
      partFinishes: {
        primary: { hex: '#F4F5F7', roughness: 0.2, metalness: 0.08, partLabel: 'Trafik Beyazı Gövde' },
        secondary: { hex: '#484E59', roughness: 0.26, metalness: 0.45, partLabel: 'Metalik Gri Kontrol Paneli' },
        accent: { hex: '#C7A05A', roughness: 0.26, metalness: 0.88, partLabel: 'Pirinç Vana Grubu' },
      },
    }),
    makeFinish({
      id: 'kombi-mat-antrasit-ozel',
      label: 'Özel Seri Mat Antrasit · Krom Vana',
      comboSummary: 'Gövde: Mat Antrasit (RAL 7016) · Panel: Siyah Cam · Tesisat: Krom',
      materialKind: 'metal',
      comboRole: 'appliance',
      partFinishes: {
        primary: { hex: '#383D46', roughness: 0.38, metalness: 0.42, partLabel: 'Mat Antrasit Gövde' },
        secondary: { hex: '#171A20', roughness: 0.16, metalness: 0.26, partLabel: 'Siyah LCD Panel' },
        accent: { hex: '#DCE1E8', roughness: 0.14, metalness: 0.95, partLabel: 'Krom Vana & Baca' },
      },
    }),
    makeFinish({
      id: 'kombi-fircali-inox',
      label: 'Fırçalı İnox · Siyah Ekran',
      comboSummary: 'Gövde: Fırçalı Çelik İnox · Panel: Siyah Cam · Tesisat: Krom',
      materialKind: 'metal',
      comboRole: 'appliance',
      partFinishes: {
        primary: { hex: '#C6CCD4', roughness: 0.26, metalness: 0.9, partLabel: 'Fırçalı İnox Gövde' },
        secondary: { hex: '#1A1E24', roughness: 0.16, metalness: 0.26, partLabel: 'Siyah LCD Panel' },
        accent: { hex: '#E4E8EE', roughness: 0.12, metalness: 0.96, partLabel: 'Parlak Krom Vana' },
      },
    }),
  ];
}

const VAILLANT_BOILER_FINISHES = createBoilerFinishes({
  id: 'vaillant-ecotec-beyaz-bakir',
  label: 'Vaillant Parlak Beyaz · Siyah Ekran · Bakır',
  comboSummary: 'Gövde: Vaillant RAL 9016 Beyaz · Ekran: Siyah Cam · Tesisat Vanaları: Pirinç/Bakır',
});

const ECA_BOILER_FINISHES = createBoilerFinishes({
  id: 'eca-proteus-beyaz-mavi-lcd',
  label: 'E.C.A. Parlak Beyaz · Mavi LCD · Bakır',
  comboSummary: 'Gövde: E.C.A. RAL 9016 Beyaz · Ekran: Mavi Aydınlatmalı LCD · Vanalar: Pirinç Hidroblok',
  panelHex: '#182438',
  panelLabel: 'E.C.A. Mavi LCD Panel',
});

const DEMIRDOKUM_BOILER_FINISHES = createBoilerFinishes({
  id: 'demirdokum-nitromix-beyaz-gumus',
  label: 'DemirDöküm Beyaz · Gümüş Panel · Bakır',
  comboSummary: 'Gövde: DemirDöküm RAL 9016 Beyaz · Panel: Gümüş LCD & Çift Düğme · Vanalar: Pirinç',
  panelHex: '#4A515C',
  panelLabel: 'DemirDöküm Gümüş Kontrol Paneli',
});

const BOSCH_BOILER_FINISHES = createBoilerFinishes({
  id: 'bosch-condens-beyaz-siyah-cam',
  label: 'Bosch Parlak Beyaz · Siyah Cam · Bakır',
  comboSummary: 'Gövde: Bosch RAL 9016 Beyaz · Ekran: Siyah Cam Dijital LCD · Tesisat: Pirinç/Bakır',
  panelHex: '#15181E',
  panelLabel: 'Bosch Siyah Cam LCD',
});

const DEMIRDOKUM_RADIATOR_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'demirdokum-ral9016-beyaz-krom',
    label: 'Demirdöküm RAL 9016 Beyaz · Krom Vana',
    comboSummary: 'Gövde & Izgara: RAL 9016 Trafik Beyazı · Termostatik Vana: Beyaz & Krom',
    materialKind: 'metal',
    comboRole: 'towel_hardware',
    partFinishes: {
      primary: { hex: '#F5F6F8', roughness: 0.22, metalness: 0.12, partLabel: 'RAL 9016 Trafik Beyazı' },
      secondary: { hex: '#E8EAEE', roughness: 0.3, metalness: 0.14, partLabel: 'Üst Konvektör Izgara' },
      accent: { hex: '#DCE1E8', roughness: 0.1, metalness: 0.96, partLabel: 'Krom Termostatik Vana' },
    },
  }),
  makeFinish({
    id: 'radyator-antrasit-ral7016',
    label: 'Mat Antrasit RAL 7016 · Siyah Vana',
    comboSummary: 'Gövde: Mat Antrasit Elektrostatik · Termostatik Vana: Mat Siyah Metal',
    materialKind: 'metal',
    comboRole: 'towel_hardware',
    partFinishes: {
      primary: { hex: '#383E46', roughness: 0.4, metalness: 0.48, partLabel: 'RAL 7016 Antrasit' },
      secondary: { hex: '#2D3239', roughness: 0.44, metalness: 0.48, partLabel: 'Antrasit Üst Izgara' },
      accent: { hex: '#1E2126', roughness: 0.34, metalness: 0.82, partLabel: 'Mat Siyah Vana' },
    },
  }),
  makeFinish({
    id: 'radyator-mat-siyah-pirinc',
    label: 'Mat Siyah · Fırçalı Pirinç Vana',
    comboSummary: 'Gövde: Mat Siyah Elektrostatik · Vana & Bağlantı: Fırçalı Pirinç',
    materialKind: 'metal',
    comboRole: 'towel_hardware',
    partFinishes: {
      primary: { hex: '#202329', roughness: 0.42, metalness: 0.52, partLabel: 'Mat Siyah Gövde' },
      secondary: { hex: '#191C21', roughness: 0.46, metalness: 0.52, partLabel: 'Mat Siyah Izgara' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Pirinç Vana' },
    },
  }),
  makeFinish({
    id: 'radyator-kasmir-grej-krom',
    label: 'Kaşmir Grej · Krom Vana',
    comboSummary: 'Gövde: Mat Kaşmir Grej · Vana & Bağlantı: Parlak Krom',
    materialKind: 'metal',
    comboRole: 'towel_hardware',
    partFinishes: {
      primary: { hex: '#D4CBC0', roughness: 0.38, metalness: 0.16, partLabel: 'Kaşmir Grej Gövde' },
      secondary: { hex: '#C6BCB0', roughness: 0.42, metalness: 0.16, partLabel: 'Kaşmir Izgara' },
      accent: { hex: '#E0E5EC', roughness: 0.1, metalness: 0.96, partLabel: 'Parlak Krom Vana' },
    },
  }),
  makeFinish({
    id: 'radyator-metalik-gumus',
    label: 'Fırçalı Metalik Gri · Krom Vana',
    comboSummary: 'Gövde: Saten Metalik Gri · Vana: Parlak Krom',
    materialKind: 'metal',
    comboRole: 'towel_hardware',
    partFinishes: {
      primary: { hex: '#9EA5B0', roughness: 0.3, metalness: 0.78, partLabel: 'Metalik Gri Gövde' },
      secondary: { hex: '#888F9A', roughness: 0.34, metalness: 0.78, partLabel: 'Metalik Izgara' },
      accent: { hex: '#E4E8EE', roughness: 0.1, metalness: 0.96, partLabel: 'Parlak Krom Vana' },
    },
  }),
];

const SUR_KALE_STEEL_DOOR_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'sur-arizona-ceviz-antrasit',
    label: 'Sur Arizona Ceviz · Antrasit Kasa · İnox',
    comboSummary: 'Kanat: Arizona Ceviz CNC Kaplama · Kasa: Antrasit RAL 7016 · Çekme Kolu: İnox',
    materialKind: 'wood',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#6E4A31', roughness: 0.46, metalness: 0.04, partLabel: 'Arizona Ceviz Kanat' },
      secondary: { hex: '#2F343C', roughness: 0.38, metalness: 0.62, partLabel: 'Antrasit Çelik Kasa & Şerit' },
      accent: { hex: '#DDE2E8', roughness: 0.16, metalness: 0.95, partLabel: 'Paslanmaz İnox Çekme Barı' },
    },
  }),
  makeFinish({
    id: 'kale-antrasit-cam-inox',
    label: 'Kale Antrasit RAL 7016 · Siyah Cam · İnox',
    comboSummary: 'Kanat: Antrasit Çelik & Temperli Siyah Şerit · Kasa: Mat Siyah · Kulp: İnox',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#383E46', roughness: 0.36, metalness: 0.58, partLabel: 'Antrasit RAL 7016 Kanat' },
      secondary: { hex: '#1B1E24', roughness: 0.18, metalness: 0.42, partLabel: 'Siyah Kasa & Cam Şerit' },
      accent: { hex: '#E2E7ED', roughness: 0.14, metalness: 0.96, partLabel: 'İnox Çekme Barı & Kilit' },
    },
  }),
  makeFinish({
    id: 'sur-dogal-mese-siyah',
    label: 'Sur Doğal Meşe Çıtalı · Mat Siyah Kasa',
    comboSummary: 'Kanat: Doğal Meşe Yatay Çıtalı · Kasa & Şerit: Mat Siyah · Kulp: Mat Siyah/İnox',
    materialKind: 'wood',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#BC9366', roughness: 0.5, metalness: 0.03, partLabel: 'Doğal Meşe Kanat' },
      secondary: { hex: '#202329', roughness: 0.4, metalness: 0.7, partLabel: 'Mat Siyah Çelik Kasa' },
      accent: { hex: '#24272D', roughness: 0.32, metalness: 0.84, partLabel: 'Mat Siyah Bar Kulp' },
    },
  }),
  makeFinish({
    id: 'kale-mat-siyah-gold',
    label: 'Kale Mat Siyah · Fırçalı Gold Bar',
    comboSummary: 'Kanat & Kasa: Mat Siyah Zırhlı Panel · Şerit & Çekme Kolu: Fırçalı Altın Pirinç',
    materialKind: 'metal',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#22252C', roughness: 0.38, metalness: 0.52, partLabel: 'Mat Siyah Zırhlı Panel' },
      secondary: { hex: '#191C22', roughness: 0.42, metalness: 0.65, partLabel: 'Mat Siyah Çelik Kasa' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Fırçalı Gold Bar & Kilit' },
    },
  }),
  makeFinish({
    id: 'sur-venge-bronz',
    label: 'Sur Koyu Venge · Saten Bronz Bar',
    comboSummary: 'Kanat: Koyu Venge Ahşap · Kasa: Antrasit · Şerit & Bar Kulp: Saten Bronz',
    materialKind: 'wood',
    comboRole: 'arch_door_window',
    partFinishes: {
      primary: { hex: '#3F2E25', roughness: 0.44, metalness: 0.04, partLabel: 'Koyu Venge Kanat' },
      secondary: { hex: '#2A2E35', roughness: 0.4, metalness: 0.64, partLabel: 'Antrasit Çelik Kasa' },
      accent: { hex: '#B58E52', roughness: 0.24, metalness: 0.9, partLabel: 'Saten Bronz Çekme Barı' },
    },
  }),
];

const PELSAN_TRACK_LIGHT_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'pelsan-mat-siyah-gold-3000k',
    label: 'Mat Siyah Ray · Gold Reflektör · 3000K',
    comboSummary: 'Ray & Spot Gövde: Mat Siyah Alüminyum · Reflektör Halka: Gold · Işık: 3000K',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#1F2228', roughness: 0.38, metalness: 0.78, partLabel: 'Mat Siyah Alüminyum Ray' },
      secondary: { hex: '#282C33', roughness: 0.36, metalness: 0.76, partLabel: 'Mat Siyah Spot Gövdesi' },
      accent: { hex: '#D4AF5A', roughness: 0.22, metalness: 0.94, partLabel: 'Gold Reflektör Halka' },
      ceramic: { hex: '#FFF0CE', roughness: 0.2, metalness: 0.0, partLabel: '3000K Gün Işığı LED' },
    },
  }),
  makeFinish({
    id: 'pelsan-mat-beyaz-siyah-3000k',
    label: 'Mat Beyaz Ray · Siyah Reflektör · 3000K',
    comboSummary: 'Ray & Spot: Mat Beyaz Alüminyum · İç Reflektör: Mat Siyah · Işık: 3000K',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#F0EFEA', roughness: 0.32, metalness: 0.24, partLabel: 'Mat Beyaz Alüminyum Ray' },
      secondary: { hex: '#F4F4F0', roughness: 0.3, metalness: 0.22, partLabel: 'Mat Beyaz Spot' },
      accent: { hex: '#23262C', roughness: 0.4, metalness: 0.72, partLabel: 'Siyah Petek Reflektör' },
      ceramic: { hex: '#FFF2D6', roughness: 0.2, metalness: 0.0, partLabel: '3000K LED Difüzör' },
    },
  }),
  makeFinish({
    id: 'pelsan-tam-siyah-3000k',
    label: 'Mat Siyah · Füme Reflektör · 3000K',
    comboSummary: 'Ray & Spot: Mat Siyah · Reflektör: Füme Gunmetal · Işık: 3000K Gün Işığı',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#1C1F25', roughness: 0.4, metalness: 0.8, partLabel: 'Mat Siyah Ray' },
      secondary: { hex: '#23272E', roughness: 0.38, metalness: 0.78, partLabel: 'Mat Siyah Spot' },
      accent: { hex: '#58606E', roughness: 0.26, metalness: 0.9, partLabel: 'Füme Gunmetal Halka' },
      ceramic: { hex: '#FFEECA', roughness: 0.2, metalness: 0.0, partLabel: '3000K LED' },
    },
  }),
  makeFinish({
    id: 'pelsan-pirinc-siyah-ray',
    label: 'Fırçalı Pirinç Spot · Mat Siyah Ray',
    comboSummary: 'Ray: Mat Siyah · Spot Gövdeleri: Fırçalı Pirinç · Difüzör: 3000K',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#1F2228', roughness: 0.38, metalness: 0.78, partLabel: 'Mat Siyah Ray' },
      secondary: { hex: '#D4AF5A', roughness: 0.24, metalness: 0.94, partLabel: 'Fırçalı Pirinç Spot' },
      accent: { hex: '#E4C676', roughness: 0.2, metalness: 0.96, partLabel: 'Gold Detay' },
      ceramic: { hex: '#FFF0CE', roughness: 0.2, metalness: 0.0, partLabel: '3000K LED' },
    },
  }),
  makeFinish({
    id: 'pelsan-antrasit-krom-4000k',
    label: 'Füme Antrasit · Krom Reflektör · 4000K',
    comboSummary: 'Ray & Spot: Füme Antrasit · Reflektör: Parlak Krom · Işık: 4000K Doğal Beyaz',
    materialKind: 'metal',
    comboRole: 'lighting_fixture',
    partFinishes: {
      primary: { hex: '#3E444F', roughness: 0.3, metalness: 0.84, partLabel: 'Füme Antrasit Ray' },
      secondary: { hex: '#353A44', roughness: 0.32, metalness: 0.82, partLabel: 'Antrasit Spot' },
      accent: { hex: '#E0E5EC', roughness: 0.1, metalness: 0.96, partLabel: 'Krom Reflektör' },
      ceramic: { hex: '#F7F9FC', roughness: 0.2, metalness: 0.0, partLabel: '4000K Doğal LED' },
    },
  }),
];

const MODERN_FIREPLACE_FINISHES: MaterialFinish[] = [
  makeFinish({
    id: 'somine-siyah-calacatta',
    label: 'Mat Siyah Hazne · Calacatta Mermer · Alev',
    comboSummary: 'Çerçeve: Calacatta Mermer · İç Hazne: Mat Siyah Çelik · Brülör: İnox & Canlı Alev',
    materialKind: 'stone',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#F0EDE7', roughness: 0.2, metalness: 0.02, partLabel: 'Calacatta Mermer Çerçeve' },
      secondary: { hex: '#1B1E24', roughness: 0.44, metalness: 0.65, partLabel: 'Mat Siyah Yanma Haznesi' },
      accent: { hex: '#D4DAE2', roughness: 0.18, metalness: 0.94, partLabel: 'Paslanmaz Çelik Brülör' },
      glass: { hex: '#E8F0F6', opacity: 0.24, roughness: 0.05 },
    },
  }),
  makeFinish({
    id: 'somine-siyah-traverten',
    label: 'Mat Siyah Hazne · Traverten Çerçeve',
    comboSummary: 'Çerçeve: Doğal Honlu Traverten · Hazne: Mat Siyah Çelik · Brülör: Saten İnox',
    materialKind: 'stone',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#DDD1BD', roughness: 0.5, metalness: 0.02, partLabel: 'Honlu Traverten Çerçeve' },
      secondary: { hex: '#1C1F25', roughness: 0.44, metalness: 0.65, partLabel: 'Mat Siyah Çelik Hazne' },
      accent: { hex: '#CFA859', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Şerit' },
      glass: { hex: '#EAE5DA', opacity: 0.24, roughness: 0.05 },
    },
  }),
  makeFinish({
    id: 'somine-ceviz-antrasit',
    label: 'Amerikan Ceviz · Antrasit Çelik Hazne',
    comboSummary: 'Çerçeve: Amerikan Ceviz · İç Hazne: Mat Antrasit Çelik · Detay: Pirinç',
    materialKind: 'wood',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#6E4B32', roughness: 0.46, metalness: 0.03, partLabel: 'Amerikan Ceviz Çerçeve' },
      secondary: { hex: '#23272F', roughness: 0.42, metalness: 0.68, partLabel: 'Antrasit Çelik Hazne' },
      accent: { hex: '#D4AF5A', roughness: 0.24, metalness: 0.92, partLabel: 'Pirinç Brülör Şeridi' },
      glass: { hex: '#E8EFF5', opacity: 0.24, roughness: 0.05 },
    },
  }),
  makeFinish({
    id: 'somine-nero-mermer-gunmetal',
    label: 'Nero Siyah Mermer · Gunmetal Hazne',
    comboSummary: 'Çerçeve: Siyah Nero Mermer · Hazne: Füme Gunmetal · Brülör: İnox',
    materialKind: 'stone',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#272A30', roughness: 0.18, metalness: 0.05, partLabel: 'Nero Siyah Mermer' },
      secondary: { hex: '#181B20', roughness: 0.42, metalness: 0.72, partLabel: 'Siyah Çelik Hazne' },
      accent: { hex: '#88909C', roughness: 0.22, metalness: 0.92, partLabel: 'Gunmetal Brülör' },
      glass: { hex: '#7C8694', opacity: 0.28, roughness: 0.05 },
    },
  }),
  makeFinish({
    id: 'somine-kasmir-tas-pirinc',
    label: 'Kaşmir Mikroçimento · Pirinç Şerit',
    comboSummary: 'Çerçeve: Mat Kaşmir Mikroçimento · Hazne: Mat Siyah · Detay: Fırçalı Pirinç',
    materialKind: 'stone',
    comboRole: 'table_console',
    partFinishes: {
      primary: { hex: '#D8CFC1', roughness: 0.62, metalness: 0.02, partLabel: 'Kaşmir Mikroçimento' },
      secondary: { hex: '#1E2127', roughness: 0.44, metalness: 0.68, partLabel: 'Mat Siyah Çelik Hazne' },
      accent: { hex: '#CFA859', roughness: 0.24, metalness: 0.92, partLabel: 'Fırçalı Pirinç Çıta' },
      glass: { hex: '#E8EFF4', opacity: 0.24, roughness: 0.05 },
    },
  }),
];

interface TurkishGapSeed {
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
  finishes: MaterialFinish[];
  searchKeywords: string[];
  roomTags: string[];
  aiSummary: string;
  surfaceType: string;
  geometryBreakdown: string[];
  microDetails: string[];
  aiRenderPrompt: string;
  aiBlenderMasterPrompt: string;
}

function buildTurkishGapAsset(seed: TurkishGapSeed): ArchitecturalAsset {
  const { width, depth, height } = seed.dimensionsCm;
  const defFinish = seed.finishes[0];
  return {
    id: seed.id,
    slug: seed.slug,
    name: seed.name,
    brandStyle: seed.brandStyle,
    category: seed.category,
    subCategory: seed.subCategory,
    archetype: seed.archetype,
    placement: seed.placement,
    dimensionsCm: seed.dimensionsCm,
    polyEstimate: seed.polyEstimate,
    renderEngines: ['Cycles', 'EEVEE', 'Unreal Engine 5'],
    uvUnwrapped: true,
    thumbnailUrl: `/assets/turkish-gaps/${seed.slug}.png`,
    searchKeywords: seed.searchKeywords,
    roomTags: seed.roomTags,
    aiSummary: seed.aiSummary,
    finishes: seed.finishes,
    defaultFinishId: defFinish.id,
    patterns: ARCHITECTURAL_PBR_PATTERNS,
    defaultPatternId: 'original_pbr',
    modelingSpec: {
      geometryBreakdown: seed.geometryBreakdown,
      textureAndMaps: {
        surfaceType: seed.surfaceType,
        uvTileCm: '1:1 Metrik UV + Yüksek Çözünürlüklü Marka & Kontrol Paneli Dokusu',
        bumpDepthMm: '0.5 – 2.5 mm (Mikro Pah & Yüzey Kabartması)',
        roughnessRange: '0.08 – 0.62 (Çok Parçalı PBR)',
        shaderRecipe:
          'Principled BSDF çok parçalı malzeme kanalları: Gövde, ekran/cam, metalik kulp/vana ve baskılı marka paneli ayrı PBR shader olarak aktarılır.',
      },
      microDetails: seed.microDetails,
      blenderModifiers: ['Bevel (Segments: 3, 1.5–3 mm)', 'Weighted Normal (Keep Sharp)'],
      lightingAndCameraTip:
        '3/4 mimari açıda 45° stüdyo yumuşak ışık ile ön panel marka logosu, cam ekran ve metalik pah yansımalarını vurgulayın.',
      aiRenderPrompt: seed.aiRenderPrompt,
      aiBlenderMasterPrompt: seed.aiBlenderMasterPrompt,
    },
    modelSource: {
      provider: 'procedural',
      license: 'MimarKatalog TR Mimari CAD (Blender Ready)',
    },
    sourceOrigin: 'catalog',
  };
}

export const TURKISH_GAP_ASSET_IDS = new Set<string>([
  'tr-vitra-arkitekt-alaturka',
  'tr-geberit-sigma20-panel',
  'tr-geberit-sigma30-panel',
  'tr-viko-karre-priz',
  'tr-schneider-asfora-cift-priz-usb',
  'tr-schneider-asfora-komutator',
  'tr-bosch-serie6-bulasik',
  'tr-siemens-iq500-bulasik',
  'tr-arcelik-ankastre-firin',
  'tr-beko-ankastre-bulasik',
  'tr-eca-artema-spiralli-mutfak-batarya',
  'tr-vaillant-ecotec-kombi',
  'tr-eca-proteus-premix-kombi',
  'tr-demirdokum-nitromix-kombi',
  'tr-bosch-condens-2500w-kombi',
  'tr-demirdokum-panel-radyator',
  'tr-sur-kale-celik-kapi',
  'tr-pelsan-ray-spot-lineer',
  'tr-modern-tv-bioetanol-somine',
  ...TURKISH_MEP_ASSET_IDS,
  ...TURKISH_ELECTRICAL_LIGHTING_ASSET_IDS,
  ...TURKISH_ENTRYWAY_ASSET_IDS,
  ...TURKISH_KITCHEN_BUILTIN_ASSET_IDS,
  ...TURKISH_HOME_STUDY_TOYS_ASSET_IDS,
]);

export const TURKISH_GAP_ASSETS: ArchitecturalAsset[] = [
  // 1. VitrA Arkitekt 50×60 Alaturka Hela Taşı
  buildTurkishGapAsset({
    id: 'tr-vitra-arkitekt-alaturka',
    slug: 'vitra-arkitekt-alaturka-hela-tasi',
    name: 'VitrA Arkitekt 50×60 cm Alaturka Hela Taşı (Çevre Yıkamalı)',
    brandStyle: 'VitrA Arkitekt · Türkiye Standart Vitrifiye',
    category: 'Banyo',
    subCategory: 'Klozet & Pisuvar',
    archetype: 'tr_alaturka_squat_toilet',
    placement: 'floor',
    dimensionsCm: { width: 50, depth: 60, height: 18 },
    polyEstimate: 11800,
    finishes: VITRA_ALATURKA_FINISHES,
    surfaceType: 'VitrA Hygiene Sırlı Vitrifiye Seramik + Paslanmaz Sifon',
    searchKeywords: [
      'alaturka',
      'alaturka tuvalet',
      'hela taşı',
      'vitra',
      'vitra arkitekt',
      'yer tuvaleti',
      'squat toilet',
      'banyo',
      'wc',
    ],
    roomTags: ['misafir wc', 'alaturka banyo', 'daire wc', 'cami & ticari wc'],
    aiSummary:
      'Türkiye daire ve ticari projelerinin vazgeçilmezi VitrA Arkitekt 50×60 cm çevre yıkamalı alaturka hela taşı; kaydırmaz ayak basma olukları, oval çukur hazne ve VitrA seramik logosuyla 1:1 metrik.',
    geometryBreakdown: [
      'Gerçek 1:1 Türkiye ölçüsü: 50 cm genişlik × 60 cm derinlik × 18 cm gömme çanak yüksekliği.',
      'Sol ve sağ ergonomik kaydırmaz kabartma ayak basma pedleri (7 paralel oluklu) ve su sıçratma önleyici yüksek kenar bordürü.',
      'Arka su giriş davlumbazı, çevre yıkama kanalı, oval çukur seramik hazne ve paslanmaz gider sifon halkası.',
    ],
    microDetails: [
      'Ön üst kenarda baskılı VitrA marka amblemi',
      'Kaydırmaz seramik oluklarda ince mat/saten doku farkı',
      'Zemin seramiğine sıfır oturan 8 mm pahlı dış çerçeve dudağı',
    ],
    aiRenderPrompt:
      'Photorealistic architectural product render of a Turkish VitrA Arkitekt 50x60cm ceramic alaturka squat toilet floor pan with ribbed anti-slip footrests, glossy VitrA Hygiene white porcelain glaze, rear flush hood and VitrA ceramic badge, studio lighting, 8k Cycles.',
    aiBlenderMasterPrompt:
      'Blender sahnesinde zemin kotuna (Z=0) gömülü VitrA Arkitekt 50x60 cm alaturka hela taşı yerleştirin. Sırlı beyaz porselen (Roughness 0.08, Coat 0.6) ve kaydırmaz ayak oluklarında hafif pürüzlülük farkı uygulayın.',
  }),

  // 2. Geberit Sigma20 Kumanda Paneli
  buildTurkishGapAsset({
    id: 'tr-geberit-sigma20-panel',
    slug: 'geberit-sigma20-kumanda-paneli',
    name: 'Geberit Sigma20 Gömme Rezervuar Kumanda Paneli (Yuvarlak Çift Basmalı)',
    brandStyle: 'Geberit Sigma20 · İsviçre / Türkiye Standart',
    category: 'Banyo',
    subCategory: 'Klozet & Pisuvar',
    archetype: 'tr_geberit_flush_plate',
    placement: 'wall-mounted',
    dimensionsCm: { width: 25, depth: 2, height: 16, mountHeight: 105 },
    polyEstimate: 6400,
    finishes: GEBERIT_SIGMA_FINISHES,
    surfaceType: 'Geberit Sigma20 Mat/Parlak Plaka + Metalik Tasarım Halkası',
    searchKeywords: [
      'geberit',
      'sigma20',
      'sigma 20',
      'gömme rezervuar',
      'kumanda paneli',
      'sifon butonu',
      'klozet düğmesi',
      'rezervuar kapağı',
    ],
    roomTags: ['ebeveyn banyosu', 'misafir wc', 'asma klozet duvarı'],
    aiSummary:
      'Asma klozet üstü duvarların vazgeçilmezi Geberit Sigma20 (24.6×16.4 cm) yuvarlak çift basmalı gömme rezervuar kumanda paneli; ikonik kontrast tasarım halkaları ve GEBERIT logosuyla.',
    geometryBreakdown: [
      'Gerçek Geberit Sigma20 dış ölçüsü: 24.6 cm × 16.4 cm × 1.2 cm kalınlık, duvar kotu +105 cm.',
      'Sol büyük (6L) ve sağ küçük (3L) dairesel çift basma tuşları, her tuş etrafında 2.5 mm metalik krom/gold tasarım halkası.',
      'Alt merkezde keskin GEBERIT marka baskısı ve duvara sıfır oturan gizli montaj çerçevesi.',
    ],
    microDetails: [
      'Alt kenarda gerçek GEBERIT marka logosu',
      'Büyük ve küçük yuvarlak butonlarda 1.8 mm basma derzi gölgesi',
      'Kontrast krom/altın tasarım halkaları ile gerçek Geberit kombinasyonları',
    ],
    aiRenderPrompt:
      'Photorealistic macro architectural render of a Geberit Sigma20 wall-mounted dual-flush actuator plate (24.6x16.4cm) with two circular flush buttons, chrome/gold accent rings and GEBERIT logo on modern bathroom tile wall, Cycles 8k.',
    aiBlenderMasterPrompt:
      'Asma klozet ekseninin tam üstüne +105 cm duvar kotuna Geberit Sigma20 (24.6x16.4 cm) yuvarlak çift basmalı kumanda panelini yerleştirin; tuş çevresi metalik tasarım halkasını parlak krom/gold PVD yapın.',
  }),

  // 3. Geberit Sigma30 Kumanda Paneli
  buildTurkishGapAsset({
    id: 'tr-geberit-sigma30-panel',
    slug: 'geberit-sigma30-kumanda-paneli',
    name: 'Geberit Sigma30 Gömme Rezervuar Kumanda Paneli (Kare Çift Basmalı)',
    brandStyle: 'Geberit Sigma30 · Mimari Geometrik Seri',
    category: 'Banyo',
    subCategory: 'Klozet & Pisuvar',
    archetype: 'tr_geberit_flush_plate',
    placement: 'wall-mounted',
    dimensionsCm: { width: 25, depth: 2, height: 16, mountHeight: 105 },
    polyEstimate: 6100,
    finishes: [GEBERIT_SIGMA_FINISHES[1], GEBERIT_SIGMA_FINISHES[0], ...GEBERIT_SIGMA_FINISHES.slice(2)],
    surfaceType: 'Geberit Sigma30 Geometrik Plaka + Yatay Metalik Şerit',
    searchKeywords: [
      'geberit',
      'sigma30',
      'sigma 30',
      'gömme rezervuar',
      'kumanda paneli',
      'kare sifon',
      'rezervuar kapağı',
      'vitra rezervuar',
    ],
    roomTags: ['modern banyo', 'villa banyo', 'misafir wc'],
    aiSummary:
      'Keskin dikdörtgen hatlı Geberit Sigma30 (24.6×16.4 cm) gömme rezervuar kumanda paneli; yatay metalik alt tasarım şeritli çift kademeli basma butonları ve GEBERIT logosuyla.',
    geometryBreakdown: [
      'Gerçek Geberit Sigma30 dış ölçüsü: 24.6 cm × 16.4 cm × 1.2 cm, duvar kotu +105 cm.',
      'Sol geniş (6L) ve sağ dar (3L) dikdörtgen basma butonları, alt kenarlarında parlak krom veya fırçalı gold tasarım şeridi.',
      'Alt merkezde keskin GEBERIT marka baskısı ve gölge derzli plaka çerçevesi.',
    ],
    microDetails: [
      'Geberit Sigma30 imzası olan yatay parlak tasarım şeridi',
      'Alt merkezde keskin GEBERIT wordmark baskısı',
      'Mat siyah / alp beyazı / mat krom gerçek Geberit mağaza kombinasyonları',
    ],
    aiRenderPrompt:
      'Photorealistic architectural render of a Geberit Sigma30 rectangular dual-flush actuator plate (24.6x16.4cm) with horizontal metallic accent bar under the twin flush buttons and GEBERIT logo, mounted on porcelain tile wall, Cycles 8k.',
    aiBlenderMasterPrompt:
      'Asma klozet ekseninde +105 cm kota Geberit Sigma30 kare/dikdörtgen çift basmalı kumanda paneli yerleştirin; alt tasarım şeridini kontrast krom veya pirinç malzeme ile ayırın.',
  }),

  // 4. Viko Karre Avrupa Tipi (Type F Schuko) Tekli Topraklı Priz
  buildTurkishGapAsset({
    id: 'tr-viko-karre-priz',
    slug: 'viko-karre-avrupa-tipi-schuko-priz',
    name: 'Viko Karre Avrupa Tipi (Type F Schuko) Topraklı Tekli Priz',
    brandStyle: 'Viko Panasonic Karre · Türkiye Standart Priz',
    category: 'Elektrik Tesisatı',
    archetype: 'tr_schuko_socket',
    placement: 'wall-mounted',
    dimensionsCm: { width: 9, depth: 4, height: 9, mountHeight: 40 },
    polyEstimate: 5400,
    finishes: VIKO_SCHNEIDER_SOCKET_FINISHES,
    surfaceType: 'Viko Karre Parlak Polikarbonat + Metal Schuko Topraklama Tırnağı',
    searchKeywords: [
      'priz',
      'viko',
      'viko karre',
      'avrupa tipi priz',
      'schuko',
      'topraklı priz',
      'elektrik prizi',
      'duvar prizi',
      'type f',
    ],
    roomTags: ['salon', 'yatak odası', 'mutfak tezgah arası', 'ofis', 'antre'],
    aiSummary:
      'Türkiye’de her konut ve ofiste kullanılan standart Avrupa Tipi (Type F Schuko) Viko Karre tekli topraklı duvar prizi; çukur dairesel soket yuvası, üst/alt metal topraklama tırnakları ve VİKO logosuyla.',
    geometryBreakdown: [
      'Gerçek 8.4×8.4 cm kare Viko Karre dış çerçeve ve 1.1 cm duvar çıkıntısı (+40 cm veya tezgah üstü +110 cm montaj kotu).',
      '18 mm derinlikli silindirik Type F Schuko priz kuyusu, 19 mm eksen aralıklı 2 adet 4.8 mm kontak deliği.',
      'Üst ve altta yaylı paslanmaz krom/pirinç topraklama tırnakları ve alt çerçevede ince VİKO marka baskısı.',
    ],
    microDetails: [
      'Avrupa/Türkiye Type F Schuko standardı 19 mm pin aralığı ve üst-alt topraklama tırnağı',
      'Çerçeve alt kenarında VİKO kabartma logosu',
      'Duvar ile çerçeve arasında gerçekçi 1 mm gölge derzi',
    ],
    aiRenderPrompt:
      'Close-up photorealistic architectural render of a Turkish Viko Karre European Type F Schuko grounded wall power outlet (8.4x8.4cm) with recessed circular well, top and bottom metal grounding clips, two pin holes and subtle VIKO logo, Cycles 8k.',
    aiBlenderMasterPrompt:
      'İç mekan duvarlarına +40 cm (süpürgelik üstü) veya mutfak tezgah üstü +110 cm kota Avrupa Tipi (Type F Schuko) Viko Karre topraklı priz yerleştirin; topraklama tırnaklarını metalik krom/pirinç shader yapın.',
  }),

  // 5. Schneider Electric Asfora Çiftli Schuko Priz + USB-C
  buildTurkishGapAsset({
    id: 'tr-schneider-asfora-cift-priz-usb',
    slug: 'schneider-asfora-ciftli-schuko-priz-usb',
    name: 'Schneider Electric Asfora Çiftli Avrupa Tipi (Schuko) Priz + USB-C',
    brandStyle: 'Schneider Electric Asfora · Modern İç Mimari',
    category: 'Elektrik Tesisatı',
    archetype: 'tr_schuko_socket',
    placement: 'wall-mounted',
    dimensionsCm: { width: 16, depth: 4, height: 9, mountHeight: 40 },
    polyEstimate: 7800,
    finishes: [
      VIKO_SCHNEIDER_SOCKET_FINISHES[1],
      VIKO_SCHNEIDER_SOCKET_FINISHES[0],
      ...VIKO_SCHNEIDER_SOCKET_FINISHES.slice(2),
    ],
    surfaceType: 'Schneider Asfora Antrasit / Alüminyum / Bronz / Meşe + USB-C Modül',
    searchKeywords: [
      'schneider',
      'schneider electric',
      'asfora',
      'çiftli priz',
      'usb priz',
      'usb-c priz',
      'avrupa tipi priz',
      'schuko',
      'yatak başı priz',
    ],
    roomTags: ['yatak başucu', 'çalışma masası', 'mutfak tezgahı', 'otel odası'],
    aiSummary:
      'Modern iç mimari ve yatak başuçlarında en çok tercih edilen Schneider Electric Asfora ikili çerçeve: solda Avrupa Tipi (Schuko) topraklı priz, sağda USB-A + USB-C hızlı şarj modülü ve Schneider logosu.',
    geometryBreakdown: [
      'Gerçek 15.6×8.4 cm ikili yatay Schneider Asfora çerçeve ve yuvarlatılmış mimari dış pah.',
      'Sol modülde çukur Type F Schuko topraklı priz yuvası ve yaylı metal topraklama tırnakları.',
      'Sağ modülde dikey USB-A (5V) + USB-C PD (20W) metalik soket yuvaları ve alt köşede Schneider logosu.',
    ],
    microDetails: [
      'Gerçek Schneider Asfora Türkiye renkleri: Antrasit, Beyaz, Krem, Alüminyum, Bronz, Meşe',
      'USB-A ve USB-C portlarında metalik çerçeve ve iç pin detayı',
      'Yatak başı komodin üstü (+65 cm) ve çalışma masası için ideal 1:1 ölçek',
    ],
    aiRenderPrompt:
      'Photorealistic architectural render of a Schneider Electric Asfora 2-gang European Type F Schuko wall outlet combined with USB-A and USB-C charging module in matte anthracite finish with Schneider logo, mounted on plaster wall, Cycles 8k.',
    aiBlenderMasterPrompt:
      'Yatak başucu (+65 cm) veya çalışma duvarına Schneider Electric Asfora ikili Schuko + USB-C priz modülü yerleştirin; Asfora Antrasit, Alüminyum, Bronz veya Meşe çerçeve kombinasyonlarından birini seçin.',
  }),

  // 6. Schneider Electric Asfora İkili Komütatör Duvar Anahtarı
  buildTurkishGapAsset({
    id: 'tr-schneider-asfora-komutator',
    slug: 'schneider-asfora-ikili-komutator-anahtar',
    name: 'Schneider Electric Asfora İkili Komütatör Duvar Anahtarı',
    brandStyle: 'Schneider Electric Asfora · Aydınlatma Kontrol',
    category: 'Elektrik Tesisatı',
    archetype: 'tr_schuko_socket',
    placement: 'wall-mounted',
    dimensionsCm: { width: 9, depth: 3, height: 9, mountHeight: 110 },
    polyEstimate: 4200,
    finishes: [
      VIKO_SCHNEIDER_SOCKET_FINISHES[0],
      VIKO_SCHNEIDER_SOCKET_FINISHES[1],
      ...VIKO_SCHNEIDER_SOCKET_FINISHES.slice(2),
    ],
    surfaceType: 'Schneider Asfora Saten Polikarbonat + LED Gece Çizgisi',
    searchKeywords: [
      'anahtar',
      'ışık anahtarı',
      'komütatör',
      'schneider',
      'asfora',
      'viko',
      'duvar anahtarı',
      'elektrik anahtarı',
    ],
    roomTags: ['kapı yanı', 'antre', 'salon', 'yatak odası', 'banyo girişi'],
    aiSummary:
      'Kapı yanlarında +110 cm kotta kullanılan Schneider Electric Asfora ikili komütatör ışık anahtarı; hafif açılı çift basma tuşu, ince LED gece göstergesi ve Schneider baskısıyla.',
    geometryBreakdown: [
      'Gerçek 8.4×8.4 cm kare Schneider Asfora dış çerçeve ve ince duvar profili.',
      'Sol ve sağ bağımsız 6° açılı basma tuşları ve merkezde 1 mm hassas ayrım derzi.',
      'Tuş alt kenarında sıcak/mavi LED gece konum çizgisi ve çerçevede Schneider logosu.',
    ],
    microDetails: [
      'İki tuş arasında gerçekçi 1.2 mm basma derzi',
      'Hafif açılı ergonomik komütatör tuş eğimi',
      'Asfora Beyaz, Antrasit, Alüminyum, Bronz, Krem ve Meşe seçenekleri',
    ],
    aiRenderPrompt:
      'Photorealistic architectural render of a Schneider Electric Asfora double rocker wall light switch (8.4x8.4cm) with thin LED locator bar and Schneider logo, clean minimalist interior wall, Cycles 8k.',
    aiBlenderMasterPrompt:
      'İç kapı kasası yanına +110 cm yüksekliğe Schneider Electric Asfora ikili komütatör duvar anahtarı yerleştirin; prizlerle aynı çerçeve rengini (Beyaz/Antrasit/Alüminyum/Bronz) eşleştirin.',
  }),

  // 7. Bosch Serie 6 Bulaşık Makinesi
  buildTurkishGapAsset({
    id: 'tr-bosch-serie6-bulasik',
    slug: 'bosch-serie6-ankastre-bulasik-makinesi',
    name: 'Bosch Serie 6 Yarı Ankastre Bulaşık Makinesi (SMS/SMI 60 cm)',
    brandStyle: 'Bosch Serie 6 · Almanya / Türkiye Lider Beyaz Eşya',
    category: 'Mutfak Ankastre',
    archetype: 'tr_branded_dishwasher',
    placement: 'floor',
    dimensionsCm: { width: 60, depth: 60, height: 85 },
    polyEstimate: 14200,
    finishes: BRANDED_APPLIANCE_FINISHES,
    surfaceType: 'Bosch Fırçalı İnox / Dark Inox + Siyah Dijital Ekran & BOSCH Logo',
    searchKeywords: [
      'bosch',
      'bosch serie 6',
      'bulaşık makinesi',
      'ankastre bulaşık makinesi',
      'inox bulaşık makinesi',
      'beyaz eşya',
      'mutfak',
    ],
    roomTags: ['modern mutfak', 'ada mutfak', 'ankastre mutfak'],
    aiSummary:
      'Ön kontrol panelinde gerçek BOSCH logosu, kırmızı-beyaz Serie 6 dijital süre ekranı (01:45), dokunmatik program ikonları ve gömme paslanmaz çelik kulp detayıyla 60 cm Bosch Serie 6 bulaşık makinesi.',
    geometryBreakdown: [
      'Standart 60×60×85 cm Türkiye mutfak tezgah altı modül ölçüsü (10 cm gömme alt baza dahil).',
      'Üst kısımda 13 cm yüksekliğinde siyah cam kontrol şeridi, baskılı BOSCH logosu, dijital LED zaman göstergesi ve dokunmatik program tuşları.',
      'Alt kısımda 3 mm derzli fırçalı inox / dark inox / beyaz kapak ve üstte tam boy gömme metal kulp.',
    ],
    microDetails: [
      'Ön panel sol üstte keskin BOSCH marka logosu ve Serie 6 imzası',
      'Parlayan dijital LED ekran (01:45 · Eco 50° · Auto 45-65°)',
      'Gerçek Bosch Türkiye mağaza renkleri: Fırçalı İnox, Dark Inox, Parlak Beyaz, Antrasit',
    ],
    aiRenderPrompt:
      'Photorealistic architectural product render of a Bosch Serie 6 60cm brushed stainless steel dishwasher with black upper control fascia, crisp BOSCH brand logo, glowing white LED time display 01:45, recessed pocket handle, modern Turkish kitchen studio lighting, Cycles 8k.',
    aiBlenderMasterPrompt:
      'Mutfak alt dolap sırasına 60x60x85 cm Bosch Serie 6 bulaşık makinesi yerleştirin; üst siyah cam panelde BOSCH logosu ve dijital ekran ışıklandırmasını koruyarak İnox/Siyah/Beyaz gövdeyi mutfakla eşleştirin.',
  }),

  // 8. Siemens iQ500 Bulaşık Makinesi
  buildTurkishGapAsset({
    id: 'tr-siemens-iq500-bulasik',
    slug: 'siemens-iq500-ankastre-bulasik-makinesi',
    name: 'Siemens iQ500 Ankastre Bulaşık Makinesi (SN55 60 cm)',
    brandStyle: 'Siemens iQ500 · DarkSteel & Mavi LED Seri',
    category: 'Mutfak Ankastre',
    archetype: 'tr_branded_dishwasher',
    placement: 'floor',
    dimensionsCm: { width: 60, depth: 60, height: 85 },
    polyEstimate: 14400,
    finishes: [
      BRANDED_APPLIANCE_FINISHES[1],
      BRANDED_APPLIANCE_FINISHES[0],
      ...BRANDED_APPLIANCE_FINISHES.slice(2),
    ],
    surfaceType: 'Siemens DarkSteel / İnox + İkonik Mavi LED Ekran & SIEMENS Logo',
    searchKeywords: [
      'siemens',
      'siemens iq500',
      'bulaşık makinesi',
      'darksteel',
      'ankastre bulaşık makinesi',
      'siyah bulaşık makinesi',
      'beyaz eşya',
    ],
    roomTags: ['lüks mutfak', 'modern mutfak', 'siyah ankastre mutfak'],
    aiSummary:
      'Siemens’in ikonik turkuaz-mavi LED ekranı (02:10), keskin SIEMENS logosu, DarkSteel koyu çelik veya fırçalı inox gövdesi ve yatay çelik bar kulpuyla 60 cm Siemens iQ500 bulaşık makinesi.',
    geometryBreakdown: [
      'Standart 60×60×85 cm tezgah altı ankastre ölçü ve 10 cm geri çekilmiş siyah baza.',
      'Üst siyah cam kontrol panelinde baskılı SIEMENS iQ500 logosu ve ikonik camgöbeği-mavi dijital LED gösterge.',
      'Ön kapakta ince yatay paslanmaz çelik bar kulp ve DarkSteel / İnox fırçalanmış metal yüzey.',
    ],
    microDetails: [
      'Ön panelde net okunan SIEMENS marka logosu ve iQ500 ibaresi',
      'Siemens imzası olan camgöbeği-mavi (cyan) LED dijital ekran',
      'DarkSteel Siyah, Fırçalı İnox ve Parlak Beyaz gerçek Siemens Türkiye renkleri',
    ],
    aiRenderPrompt:
      'Photorealistic architectural product render of a Siemens iQ500 60cm DarkSteel black stainless dishwasher with black glass control strip, crisp SIEMENS wordmark, glowing cyan-blue LED display 02:10, brushed steel handle, Cycles 8k.',
    aiBlenderMasterPrompt:
      'Mutfak alt modülüne 60x60x85 cm Siemens iQ500 bulaşık makinesi yerleştirin; DarkSteel koyu çelik gövde üzerinde SIEMENS logosu ve cyan-mavi LED paneli koruyun.',
  }),

  // 9. Arçelik 9620 Serisi Ankastre Cam Fırın
  buildTurkishGapAsset({
    id: 'tr-arcelik-ankastre-firin',
    slug: 'arcelik-9620-ankastre-cam-firin',
    name: 'Arçelik 9620 Serisi Ankastre Cam Fırın (60×60 cm)',
    brandStyle: 'Arçelik Ankastre · Türkiye Lider Ev Teknolojisi',
    category: 'Mutfak Ankastre',
    archetype: 'tr_branded_builtin_oven',
    placement: 'floor',
    dimensionsCm: { width: 60, depth: 57, height: 60 },
    polyEstimate: 15600,
    finishes: [
      BRANDED_APPLIANCE_FINISHES[1],
      BRANDED_APPLIANCE_FINISHES[2],
      BRANDED_APPLIANCE_FINISHES[0],
      BRANDED_APPLIANCE_FINISHES[3],
      BRANDED_APPLIANCE_FINISHES[4],
    ],
    surfaceType: 'Arçelik Temperli Siyah/Beyaz Cam + Fırçalı İnox Kulp & arçelik Logo',
    searchKeywords: [
      'arçelik',
      'arcelik',
      'ankastre fırın',
      'fırın',
      'cam fırın',
      'siyah fırın',
      'beyaz fırın',
      'mutfak ankastre',
    ],
    roomTags: ['modern mutfak', 'boy fırın dolabı', 'ankastre set'],
    aiSummary:
      'Türkiye mutfaklarının en çok satan ankastre serisi Arçelik 9620 cam fırın (60×60 cm): üst panelde arçelik logosu, gömülebilir çift döner düğme, 180°C LED saat, füme cam iç tel ızgara ve boru kulp.',
    geometryBreakdown: [
      'Standart 60×57×60 cm ankastre fırın dolabı yuvasına birebir uyumlu 1:1 metrik kasa.',
      'Üst kontrol şeridinde baskılı arçelik logosu, sol/sağ 2 adet pop-out döner seçici düğme ve merkezi 180°C beyaz dijital ekran.',
      'Üç katmanlı temperli füme cam fırın kapağı, arkada sıcak ışıklı iç hazne ile paslanmaz fırın teli ve tam boy silindirik metal kulp.',
    ],
    microDetails: [
      'Ön kontrol şeridinde keskin arçelik marka baskısı',
      'Füme fırın camının arkasında hafif sıcak aydınlatmalı iç hazne ve krom tel raf',
      'Siyah Cam, Beyaz Cam, İnox, Antrasit ve Country Krem gerçek Arçelik renkleri',
    ],
    aiRenderPrompt:
      'Photorealistic architectural product render of a Turkish Arcelik 60x60cm black tempered glass built-in kitchen oven with crisp arcelik brand logo, twin rotary knobs, glowing 180C digital clock, stainless steel tubular door handle and subtle warm glowing oven rack inside, Cycles 8k.',
    aiBlenderMasterPrompt:
      'Mutfak boy dolabına (+85 cm kot) veya tezgah altına 60x57x60 cm Arçelik ankastre cam fırın yerleştirin; füme cam kapağa Transmission ve arçelik kontrol şeridine emission ekran ekleyin.',
  }),

  // 10. Beko BM 6046 Serisi Ankastre Bulaşık Makinesi
  buildTurkishGapAsset({
    id: 'tr-beko-ankastre-bulasik',
    slug: 'beko-bm6046-ankastre-bulasik-makinesi',
    name: 'Beko BM 6046 Serisi Ankastre Bulaşık Makinesi (60 cm)',
    brandStyle: 'Beko · Türkiye & Avrupa Ankastre Seri',
    category: 'Mutfak Ankastre',
    archetype: 'tr_branded_dishwasher',
    placement: 'floor',
    dimensionsCm: { width: 60, depth: 60, height: 85 },
    polyEstimate: 14100,
    finishes: BRANDED_APPLIANCE_FINISHES,
    surfaceType: 'Beko İnox / Siyah Cam / Beyaz + Siyah Dijital Ekran & beko Logo',
    searchKeywords: [
      'beko',
      'beko bulaşık makinesi',
      'bulaşık makinesi',
      'ankastre',
      'beyaz eşya',
      'mutfak',
    ],
    roomTags: ['modern mutfak', 'apartman mutfağı', 'ankastre mutfak'],
    aiSummary:
      'Ön kontrol panelinde mavi-gümüş beko logosu, beyaz LED program göstergesi, ergonomik gizli tutma kulpu ve gerçek Beko İnox/Siyah/Beyaz/Antrasit renkleriyle 60 cm Beko BM 6046 bulaşık makinesi.',
    geometryBreakdown: [
      'Standart 60×60×85 cm tezgah altı ankastre ölçü ve 10 cm geri çekilmiş alt baza.',
      'Üst kontrol panelinde ikonik mavi şeritli beko marka logosu, dijital süre göstergesi (01:30) ve program seçim butonları.',
      'Pürüzsüz fırçalı çelik / parlak beyaz / siyah cam ön kapak ve entegre tutma oyuğu.',
    ],
    microDetails: [
      'Ön panelde mavi-gümüş ikonik beko marka logosu',
      'Yüksek kontrastlı dijital süre ve HygieneIntense gösterge şeridi',
      'Gerçek Beko Türkiye satış renkleri: İnox, Siyah Cam, Beyaz, Antrasit Gri',
    ],
    aiRenderPrompt:
      'Photorealistic architectural product render of a Beko 60cm brushed stainless steel dishwasher with black upper control panel, crisp blue-silver beko brand logo, glowing digital display 01:30, integrated grip handle, Cycles 8k.',
    aiBlenderMasterPrompt:
      'Mutfak alt tezgah boşluğuna 60x60x85 cm Beko BM 6046 bulaşık makinesi yerleştirin; üst siyah ekrandaki beko logosu ve LED göstergesini koruyarak gövde rengini seçili ankastre setle eşleştirin.',
  }),

  // 11. E.C.A. / Artema Spiralli (Pull-Out) Mutfak Bataryası
  buildTurkishGapAsset({
    id: 'tr-eca-artema-spiralli-mutfak-batarya',
    slug: 'eca-artema-spiralli-mutfak-bataryasi',
    name: 'E.C.A. / Artema Spiralli (Pull-Out) Yaylı Mutfak Eviye Bataryası',
    brandStyle: 'E.C.A. / Artema · Profesyonel Mutfak Armatürü',
    category: 'Yemek & Mutfak',
    archetype: 'tr_pullout_kitchen_faucet',
    placement: 'floor',
    dimensionsCm: { width: 24, depth: 26, height: 48 },
    polyEstimate: 16800,
    finishes: ECA_PULLOUT_FAUCET_FINISHES,
    surfaceType: 'PVD Parlak Krom / Mat Siyah / Fırçalı Gold + Spiral Çelik Yay & E.C.A. Logo',
    searchKeywords: [
      'mutfak bataryası',
      'spiralli batarya',
      'yaylı batarya',
      'eca',
      'e.c.a.',
      'artema',
      'grohe',
      'eviye bataryası',
      'mutfak musluğu',
      'pull-out faucet',
    ],
    roomTags: ['mutfak eviyesi', 'ada mutfak', 'çamaşır eviyesi'],
    aiSummary:
      'Türkiye’de şef tipi modern mutfakların favorisi E.C.A. / Artema 48 cm yüksek yaylı spiralli (pull-out) mutfak bataryası; esnek siyah silikon hortum, spiral çelik yay, manyetik kol tutucu ve gövdede E.C.A. logosu.',
    geometryBreakdown: [
      '48 cm yüksekliğinde kavisli profesyonel kuğu boyun (TubeGeometry), 26 cm çıkış ucu erişimi.',
      'Esnek siyah silikon iç hortum etrafında 22 sarımlı gerçek 3D çelik spiral yay ve manyetik sabitleme kolu.',
      'Çift fonksiyonlu (akış/duş) çıkarılabilir el sprey başlığı, yan aç-kapa seramik kartuş kolu (kırmızı-mavi sıcak/soğuk noktası) ve E.C.A. gövde işlemesi.',
    ],
    microDetails: [
      'Batarya taban gövdesinde keskin E.C.A. marka baskısı',
      'Sıcak/soğuk kırmızı-mavi yön göstergeli ergonomik yan kumanda kolu',
      'Parlak Krom, Mat Siyah + Pirinç, Fırçalı Gold, Gunmetal ve İnox gerçek PVD seçenekleri',
    ],
    aiRenderPrompt:
      'Photorealistic architectural product render of a Turkish E.C.A. / Artema 48cm high-arch pull-out spring kitchen sink faucet with coiled stainless steel spring, matte black silicone hose, magnetic docking arm, side lever with red/blue dot and E.C.A. base engraving, Cycles 8k.',
    aiBlenderMasterPrompt:
      'Mutfak eviyesi arkasına 48 cm yüksekliğinde E.C.A. / Artema yaylı spiralli batarya yerleştirin; metal gövde ve spiral yayı seçili PVD (Krom/Mat Siyah/Gold/Gunmetal), esnek hortumu ise mat siyah kauçuk (Roughness 0.62) bırakın.',
  }),

  // 12. Vaillant ecoTEC Plus Yoğuşmalı Kombi
  buildTurkishGapAsset({
    id: 'tr-vaillant-ecotec-kombi',
    slug: 'vaillant-ecotec-plus-yogusmali-kombi',
    name: 'Vaillant ecoTEC Plus Yoğuşmalı Kombi (72×44×34 cm)',
    brandStyle: 'Vaillant ecoTEC / Demirdöküm / E.C.A. · Türkiye Isıtma',
    category: 'Mimari & Çalışma',
    archetype: 'tr_condensing_boiler',
    placement: 'wall-mounted',
    dimensionsCm: { width: 44, depth: 34, height: 72, mountHeight: 135 },
    polyEstimate: 12400,
    finishes: VAILLANT_BOILER_FINISHES,
    surfaceType: 'Vaillant RAL 9016 Emaye Çelik + Dijital LCD Ekran + Pirinç Tesisat Vanaları',
    searchKeywords: [
      'kombi',
      'vaillant',
      'ecotec',
      'yoğuşmalı kombi',
      'demirdöküm',
      'eca kombi',
      'bosch kombi',
      'mutfak balkonu',
      'doğalgaz kombi',
    ],
    roomTags: ['mutfak', 'cam balkon', 'çamaşır odası', 'teknik oda'],
    aiSummary:
      'Türkiye’de neredeyse her daire mutfağında veya kapalı balkonda bulunan Vaillant ecoTEC Plus (72×44×34 cm) yoğuşmalı doğalgaz kombisi; yeşil Vaillant logosu, 55°C / 1.5 bar LCD ekran, alt pirinç vanalar ve üst hermetik baca.',
    geometryBreakdown: [
      'Gerçek Vaillant ecoTEC Plus ölçüsü: 44 cm genişlik × 34 cm derinlik × 72 cm yükseklik (+135 cm duvar montaj kotu).',
      'Ön kapakta yeşil Vaillant amblemi + wordmark, alt bölümde siyah cam dijital LCD ekran (55°C · 1.5 bar) ve dokunmatik ayar tuşları.',
      'Üstte Ø100 mm beyaz hermetik koaksiyel baca dirseği, altta 5 adet kalorifer/sıcak su/doğalgaz tesisat borusu ve renkli küresel vanalar.',
    ],
    microDetails: [
      'Ön kapakta gerçek yeşil Vaillant logosu ve ecoTEC plus baskısı',
      'Mavi-beyaz aydınlatmalı LCD basınç ve sıcaklık ekranı (55°C · 1.5 bar)',
      'Alt bağlantıda pirinç/krom küresel vanalar ve sarı doğalgaz vanası detayı',
    ],
    aiRenderPrompt:
      'Photorealistic architectural product render of a Turkish wall-hung Vaillant ecoTEC plus condensing gas combi boiler (44x34x72cm) in gloss white steel with iconic green Vaillant logo, backlit blue-white digital LCD display 55C 1.5 bar, top coaxial flue elbow and bottom brass/chrome plumbing manifold valves, Cycles 8k.',
    aiBlenderMasterPrompt:
      'Mutfak veya kapalı balkon duvarına +135 cm kota Vaillant ecoTEC Plus (44x34x72 cm) kombi yerleştirin; alt kısımdaki 5 tesisat borusunu ve sarı doğalgaz vanasını gerçekçi metal/pirinç shader ile koruyun.',
  }),

  // 12b. E.C.A. Proteus Premix 24 kW Tam Yoğuşmalı Kombi
  buildTurkishGapAsset({
    id: 'tr-eca-proteus-premix-kombi',
    slug: 'eca-proteus-premix-yogusmali-kombi',
    name: 'E.C.A. Proteus Premix 24 kW Tam Yoğuşmalı Kombi (68×40×33 cm)',
    brandStyle: 'E.C.A. · Proteus Premix Serisi',
    category: 'Mimari & Çalışma',
    archetype: 'tr_condensing_boiler',
    placement: 'wall-mounted',
    dimensionsCm: { width: 40, depth: 33, height: 68, mountHeight: 135 },
    polyEstimate: 12600,
    finishes: ECA_BOILER_FINISHES,
    surfaceType: 'E.C.A. Parlak Beyaz Emaye Çelik + Lacivert LCD Ekran + Pirinç Hidroblok Tesisat',
    searchKeywords: [
      'kombi',
      'eca',
      'e.c.a.',
      'proteus premix',
      'eca kombi',
      'yoğuşmalı kombi',
      'pirinç hidroblok',
      'mutfak kombisi',
      'doğalgaz kombi',
    ],
    roomTags: ['mutfak', 'cam balkon', 'çamaşır odası', 'teknik oda'],
    aiSummary:
      'Türkiye’nin en çok satan fiyat/performans yerli yoğuşmalı kombisi E.C.A. Proteus Premix 24 kW (68×40×33 cm); kompakt gövde, kırmızı E.C.A. logosu, mavi aydınlatmalı dijital ekran, pirinç hidroblok alt bağlantılar ve üst hermetik baca.',
    geometryBreakdown: [
      'Gerçek E.C.A. Proteus Premix kompakt ölçüsü: 40 cm genişlik × 33 cm derinlik × 68 cm yükseklik (standart mutfak dolabı içi uyumlu).',
      'Ön kapakta kırmızı E.C.A. amblemi + Proteus Premix baskısı, alt kısımda mavi-beyaz LCD ekran (52°C · 1.4 bar · Eco) ve ergonomik tuş takımı.',
      'Üstte Ø100 mm hermetik koaksiyel baca dirseği, altta 5 adet kalorifer/sıcak su/doğalgaz borusu ve pirinç/sarı vana grubu.',
    ],
    microDetails: [
      'Ön kapakta keskin kırmızı E.C.A. logosu ve Proteus Premix seri yazısı',
      'Mavi arka aydınlatmalı dijital sıcaklık & basınç LCD göstergesi (52°C · 1.4 bar)',
      'E.C.A. imzası pirinç hidroblok alt bağlantı manifoldu ve sarı doğalgaz vanası',
    ],
    aiRenderPrompt:
      'Photorealistic architectural render of a Turkish wall-hung E.C.A. Proteus Premix 24kW compact condensing combi boiler (40x33x68cm) in gloss white steel with crimson E.C.A. logo, navy-blue backlit digital LCD screen 52C 1.4 bar, top white coaxial flue elbow and bottom brass manifold valves, Cycles 8k.',
    aiBlenderMasterPrompt:
      'Mutfak veya kapalı balkon duvarına +135 cm kota E.C.A. Proteus Premix (40x33x68 cm) kombi yerleştirin; ön yüzde kırmızı E.C.A. marka baskısı ve mavi LCD ekranı koruyun.',
  }),

  // 12c. DemirDöküm Nitromix P 24 kW Tam Yoğuşmalı Kombi
  buildTurkishGapAsset({
    id: 'tr-demirdokum-nitromix-kombi',
    slug: 'demirdokum-nitromix-yogusmali-kombi',
    name: 'DemirDöküm Nitromix P 24 kW Tam Yoğuşmalı Kombi (74×42×33 cm)',
    brandStyle: 'DemirDöküm · Nitromix P Serisi',
    category: 'Mimari & Çalışma',
    archetype: 'tr_condensing_boiler',
    placement: 'wall-mounted',
    dimensionsCm: { width: 42, depth: 33, height: 74, mountHeight: 135 },
    polyEstimate: 12800,
    finishes: DEMIRDOKUM_BOILER_FINISHES,
    surfaceType: 'DemirDöküm Beyaz Emaye Çelik + Gümüş Çerçeveli LCD & Çift Çevirmeli Düğme',
    searchKeywords: [
      'kombi',
      'demirdöküm',
      'demirdokum',
      'nitromix',
      'nitromix p',
      'yoğuşmalı kombi',
      'yerli kombi',
      'doğalgaz kombi',
    ],
    roomTags: ['mutfak', 'cam balkon', 'çamaşır odası', 'teknik oda'],
    aiSummary:
      'Türkiye’nin en köklü yerli ısıtma markası DemirDöküm Nitromix P 24 kW tam yoğuşmalı kombi (74×42×33 cm); üstte kırmızı-lacivert DemirDöküm logosu, altta gümüş çerçeveli dijital LCD ve ikiz çevirmeli petek/su ayar düğmeleri.',
    geometryBreakdown: [
      'Gerçek DemirDöküm Nitromix P ölçüsü: 42 cm genişlik × 33 cm derinlik × 74 cm yükseklik (+135 cm duvar kotu).',
      'Ön kapakta kırmızı-lacivert DemirDöküm amblemi + Nitromix seri yazısı; alt konsolda gümüş çerçeveli LCD (55°C · 1.5 bar) ve 2 adet 3D silindirik çevirmeli ayar düğmesi.',
      'Üst hermetik baca dirseği ve altta 5’li tesisat bağlantı vanaları (kırmızı kalorifer, mavi su, sarı doğalgaz).',
    ],
    microDetails: [
      'Ön gövdede orijinal DemirDöküm amblemi ve Nitromix P seri baskısı',
      'Gümüş çerçeveli dijital ekranın sağ ve solunda 3D çevirmeli sıcaklık ayar düğmeleri',
      'Alt 5’li tesisat bağlantısı, sarı gaz vanası ve Ø100 mm beyaz baca dirseği',
    ],
    aiRenderPrompt:
      'Photorealistic architectural render of a Turkish wall-hung DemirDokum Nitromix P 24kW condensing boiler (42x33x74cm) in gloss white enamel steel with red-navy DemirDokum logo, lower silver-bezel digital LCD 55C 1.5 bar flanked by two rotary control dials, top coaxial flue and bottom plumbing valves, Cycles 8k.',
    aiBlenderMasterPrompt:
      'Duvara +135 cm kota DemirDöküm Nitromix P (42x33x74 cm) kombi yerleştirin; alt gümüş kontrol paneli ve çift çevirmeli düğme geometrisini koruyun.',
  }),

  // 12d. Bosch Condens 2500 W 24 kW Tam Yoğuşmalı Kombi
  buildTurkishGapAsset({
    id: 'tr-bosch-condens-2500w-kombi',
    slug: 'bosch-condens-2500w-yogusmali-kombi',
    name: 'Bosch Condens 2500 W 24 kW Tam Yoğuşmalı Kombi (72×40×30 cm)',
    brandStyle: 'Bosch Termoteknik · Condens 2500 W',
    category: 'Mimari & Çalışma',
    archetype: 'tr_condensing_boiler',
    placement: 'wall-mounted',
    dimensionsCm: { width: 40, depth: 30, height: 72, mountHeight: 135 },
    polyEstimate: 12700,
    finishes: BOSCH_BOILER_FINISHES,
    surfaceType: 'Bosch Parlak Beyaz / Titanyum Emaye Gövde + Siyah Cam Dikey Kontrol Şeridi',
    searchKeywords: [
      'kombi',
      'bosch',
      'condens',
      'condens 2500',
      'condens 2200i',
      'bosch kombi',
      'yoğuşmalı kombi',
      'alman kombi',
      'doğalgaz kombi',
    ],
    roomTags: ['mutfak', 'cam balkon', 'çamaşır odası', 'teknik oda'],
    aiSummary:
      'Türkiye’de en çok tercih edilen Alman segment yoğuşmalı kombi Bosch Condens 2500 W (72×40×30 cm); yumuşak yuvarlatılmış beyaz gövde, kırmızı BOSCH amblemi, siyah cam dijital ekran şeridi ve 5’li alt tesisat grubu.',
    geometryBreakdown: [
      'Gerçek Bosch Condens 2500 W ölçüsü: 40 cm genişlik × 30 cm derinlik × 72 cm yükseklik (ince derinlikli modern profil).',
      'Ön yüzde kırmızı BOSCH amblemi + Condens 2500 W yazısı, alt merkezde parlak siyah cam kontrol ekranı (54°C · Eco) ve dokunmatik ikonlar.',
      'Üstte Ø100 mm hermetik baca dirseği ve altta 5’li pirinç/krom tesisat vanası grubu.',
    ],
    microDetails: [
      'Üst merkezde gerçek dairesel Bosch amblemi ve kırmızı BOSCH baskısı',
      'Parlak siyah cam panel üzerinde keskin beyaz 54°C LED ekran',
      'Kompakt 30 cm derinlik ile dar balkon ve dolap içi yerleşime tam uyum',
    ],
    aiRenderPrompt:
      'Photorealistic architectural render of a Turkish wall-hung Bosch Condens 2500 W 24kW condensing combi boiler (40x30x72cm) in sleek rounded gloss white steel with crimson BOSCH logo, glossy black center control panel displaying crisp white 54C LED digits, top coaxial flue and bottom manifold valves, Cycles 8k.',
    aiBlenderMasterPrompt:
      'Duvara +135 cm kota Bosch Condens 2500 W (40x30x72 cm) kombi yerleştirin; üstte kırmızı BOSCH logosu ve altta siyah cam LED kontrol panelini koruyun.',
  }),

  // 13. Demirdöküm Tip 22 Panel Radyatör
  buildTurkishGapAsset({
    id: 'tr-demirdokum-panel-radyator',
    slug: 'demirdokum-tip22-panel-radyator',
    name: 'Demirdöküm Plus Tip 22 PKKP Panel Radyatör (120×60 cm)',
    brandStyle: 'Demirdöküm Plus · Türkiye Standart Kalorifer Peteği',
    category: 'Mimari & Çalışma',
    archetype: 'tr_panel_radiator',
    placement: 'wall-mounted',
    dimensionsCm: { width: 120, depth: 11, height: 60, mountHeight: 15 },
    polyEstimate: 14800,
    finishes: DEMIRDOKUM_RADIATOR_FINISHES,
    surfaceType: 'RAL 9016 Elektrostatik Toz Boya Çelik + Termostatik Vana & DemirDöküm Logo',
    searchKeywords: [
      'radyatör',
      'petek',
      'kalorifer',
      'kalorifer peteği',
      'demirdöküm',
      'tip 22',
      'panel radyatör',
      'termostatik vana',
    ],
    roomTags: ['pencere altı', 'salon', 'yatak odası', 'çocuk odası', 'antre'],
    aiSummary:
      'Türkiye dairelerinde pencere altlarının olmazsa olmazı Demirdöküm Plus Tip 22 PKKP (120×60 cm) çift panelli kalorifer peteği; dikey su kanalları, üst konvektör ızgarası, sağ üst termostatik vana ve DemirDöküm logosu.',
    geometryBreakdown: [
      'Standart Türkiye ölçüsü: 120 cm genişlik × 10.5 cm derinlik (Tip 22 PKKP) × 60 cm yükseklik (+15 cm yerden kot).',
      '36 adet dikey preslenmiş su kanalı kaburgası, delikli üst konvektör ızgarası, kapalı yan kapaklar ve duvar konsolları.',
      'Sağ üstte 0–5 kademeli beyaz-krom termostatik vana başlığı, sağ altta krom dönüş rakor vanası ve sol üstte DemirDöküm logosu.',
    ],
    microDetails: [
      'Sol üst köşede baskılı DemirDöküm marka etiketi',
      'Üstte hava akışı sağlayan gerçek delikli konvektör ızgara kanalları',
      'RAL 9016 Trafik Beyazı, Antrasit RAL 7016, Mat Siyah + Pirinç ve Kaşmir seçenekleri',
    ],
    aiRenderPrompt:
      'Photorealistic architectural product render of a Turkish Demirdokum Type 22 PKKP steel panel radiator (120x60cm) in RAL 9016 traffic white powder coat with vertical water flutes, perforated top grille, chrome-white thermostatic valve head and subtle DemirDokum corner badge, Cycles 8k.',
    aiBlenderMasterPrompt:
      'Pencere altına yerden +15 cm kota 120x11x60 cm Demirdöküm Tip 22 PKKP panel radyatör yerleştirin; sağ üst termostatik vanayı krom gövde + beyaz kademeli başlık olarak koruyun.',
  }),

  // 14. Sur / Kale Modern Villa & Daire Çelik Dış Kapısı
  buildTurkishGapAsset({
    id: 'tr-sur-kale-celik-kapi',
    slug: 'sur-kale-modern-celik-dis-kapi',
    name: 'Sur / Kale Modern Villa & Daire Çelik Dış Kapısı (95×210 cm)',
    brandStyle: 'Sur Çelik Kapı / Kale Kilit · Türkiye Güvenlik Kapısı',
    category: 'Antre & Giriş',
    archetype: 'tr_armored_steel_door',
    placement: 'floor',
    dimensionsCm: { width: 95, depth: 14, height: 210 },
    polyEstimate: 16200,
    finishes: SUR_KALE_STEEL_DOOR_FINISHES,
    surfaceType: 'CNC Ahşap/Antrasit Zırhlı Kanat + İnox Çekme Barı & Akıllı Kilit',
    searchKeywords: [
      'çelik kapı',
      'dış kapı',
      'daire kapısı',
      'villa kapısı',
      'sur çelik kapı',
      'kale çelik kapı',
      'kale kilit',
      'giriş kapısı',
      'antre',
    ],
    roomTags: ['antre', 'daire girişi', 'villa dış cephe', 'apartman holü'],
    aiSummary:
      'Türkiye daire ve villa girişlerinin standardı Sur / Kale 95×210 cm modern çelik dış kapısı; ağır pervazlı çelik kasa, yatay CNC çıtalı ceviz/antrasit kanat, tam boy paslanmaz çekme barı, Kale akıllı kilit ve SUR eşik plakası.',
    geometryBreakdown: [
      'Standart Türkiye giriş ölçüsü: 95 cm genişlik × 14 cm kasa derinliği × 210 cm yükseklik.',
      'Kalın elektrostatik boyalı çelik kasa, yatay CNC oluklu Arizona Ceviz / Antrasit kanat ve 3 adet gömme metalik/cam tasarım şeridi.',
      '140 cm dikey paslanmaz çelik çekme barı, Kale çok noktalı güvenlik bareli + parmak izli akıllı kilit paneli, kapı dürbünü ve SUR çelik eşik.',
    ],
    microDetails: [
      'Üst ve kilit rozetinde keskin SUR / KALE metalik marka baskısı',
      'Parmak izli/şifreli modern siyah cam akıllı kilit modülü',
      'Gerçek Sur/Kale satış renkleri: Arizona Ceviz, Antrasit RAL 7016, Doğal Meşe, Mat Siyah + Gold',
    ],
    aiRenderPrompt:
      'Photorealistic architectural render of a Turkish Sur / Kale modern armored steel entrance door (95x210cm) with horizontal CNC walnut wood panel cladding, anthracite steel frame, vertical brushed stainless pull bar, smart fingerprint lock keypad and stainless threshold plate, Cycles 8k.',
    aiBlenderMasterPrompt:
      'Daire veya villa girişine 95x14x210 cm Sur / Kale çelik dış kapı yerleştirin; kanatta yatay CNC ahşap/antrasit yüzey, kasa çevresinde elektrostatik koyu çelik ve tam boy paslanmaz inox çekme barı kullanın.',
  }),

  // 15. Pelsan / Jupiter 3'lü Manyetik Ray Spot & Lineer LED Sistem
  buildTurkishGapAsset({
    id: 'tr-pelsan-ray-spot-lineer',
    slug: 'pelsan-jupiter-manyetik-ray-spot-led',
    name: "Pelsan / Jupiter 3'lü Manyetik Ray Spot & Lineer LED Sistem (150 cm)",
    brandStyle: 'Pelsan / Jupiter · Modern Türkiye Mimari Aydınlatma',
    category: 'Aydınlatma',
    archetype: 'tr_magnetic_track_light',
    placement: 'ceiling',
    dimensionsCm: { width: 150, depth: 12, height: 18, mountHeight: 265 },
    polyEstimate: 11200,
    finishes: PELSAN_TRACK_LIGHT_FINISHES,
    surfaceType: 'Eloksal Alüminyum Manyetik Ray + 3000K Sıcak LED & Gold Reflektör',
    searchKeywords: [
      'ray spot',
      'manyetik ray',
      'lineer led',
      'tavan spot',
      'pelsan',
      'jupiter aydınlatma',
      'philips spot',
      'mutfak aydınlatma',
      'salon tavan spot',
    ],
    roomTags: ['modern salon', 'mutfak tezgah üstü', 'koridor', 'giyinme odası'],
    aiSummary:
      'Modern iç mekan tavanlarında en çok kullanılan 150 cm Pelsan / Jupiter manyetik ray sistemi; 3 adet açısı ayarlanabilir silindirik LED spot başlık, 1 adet opal lineer LED bar ve 3000K gün ışığı yayılımı.',
    geometryBreakdown: [
      '150 cm uzunluğunda 48V sıva üstü/gömme siyah veya beyaz alüminyum manyetik ray profili.',
      '3 adet mafsallı silindirik spot başlık (gold/siyah kamaşma önleyici reflektör halkalı) ve 40 cm opal difüzörlü lineer LED modül.',
      'Ray ucunda PELSAN / JUPITER marka detayı ve tavan bağlantı aparatları.',
    ],
    microDetails: [
      'Spot içlerinde sıcak 3000K parlayan COB LED optik lensler',
      'Kamaşma önleyici altın pirinç veya füme reflektör halkaları',
      'Mat Siyah + Gold, Mat Beyaz + Siyah ve Fırçalı Pirinç mimari tavan kombinasyonları',
    ],
    aiRenderPrompt:
      'Photorealistic architectural render of a 150cm black aluminum magnetic track lighting system with three articulating cylindrical spotlight heads featuring gold anti-glare rings and one warm 3000K linear opal LED diffuser bar, Pelsan / Jupiter modern style, Cycles 8k.',
    aiBlenderMasterPrompt:
      'Tavan kotuna (+265 cm) 150 cm Pelsan/Jupiter manyetik ray spot sistemi yerleştirin; spot lenslerine ve lineer LED difüzöre 3000K Emission (Strength 6.0) + gerçek IES spot ışıkları bağlayın.',
  }),

  // 16. Modern TV Altı Ankastre Bioetanol / Buharlı Villa Şöminesi
  buildTurkishGapAsset({
    id: 'tr-modern-tv-bioetanol-somine',
    slug: 'modern-tv-alti-bioetanol-villa-sominesi',
    name: 'Modern TV Altı Ankastre Bioetanol / Buharlı Villa Şöminesi (140 cm)',
    brandStyle: 'Decoflame / Şömineci · Modern Türkiye Villa Salonu',
    category: 'Salon',
    archetype: 'tr_modern_fireplace',
    placement: 'floor',
    dimensionsCm: { width: 140, depth: 36, height: 48 },
    polyEstimate: 13600,
    finishes: MODERN_FIREPLACE_FINISHES,
    surfaceType: 'Mermer / Traverten Çerçeve + Mat Siyah Çelik Hazne + Temperli Cam & Canlı Alev',
    searchKeywords: [
      'şömine',
      'somine',
      'bioetanol şömine',
      'buharlı şömine',
      'elektrikli şömine',
      'tv altı şömine',
      'salon şöminesi',
      'villa şömine',
    ],
    roomTags: ['villa salonu', 'tv ünitesi duvarı', 'lounge'],
    aiSummary:
      'Modern Türk villa salonlarında TV duvarı altına konumlanan 140 cm ankastre bioetanol / su buharlı şömine; Calacatta/Traverten/Ceviz dış çerçeve, mat siyah yanma haznesi, temperli ön cam koruma, volkanik taşlar ve 3D sıcak alev şeridi.',
    geometryBreakdown: [
      '140 cm genişlik × 36 cm derinlik × 48 cm yükseklik; TV altı nişine veya müstakil mermer konsola doğrudan oturur.',
      'Doğal Calacatta mermer / traverten / Amerikan ceviz dış mimari çerçeve ve ısıya dayanıklı mat siyah çelik iç yanma haznesi.',
      'Önde 8 mm temperli şeffaf güvenlik camı, 90 cm paslanmaz çelik lineer brülör, siyah volkanik dekoratif taşlar ve sıcak amber 3D alev şeridi.',
    ],
    microDetails: [
      'Paslanmaz çelik brülör hattında sıcak turuncu-amber parlayan 3D alev dili geometrisi',
      'İnox paslanmaz kontrol şeridi ve temperli cam siperlik ayakları',
      'Calacatta, Traverten, Amerikan Ceviz, Nero Mermer ve Kaşmir Mikroçimento çerçeve seçenekleri',
    ],
    aiRenderPrompt:
      'Photorealistic architectural interior render of a 140cm modern recessed bioethanol fireplace under a TV wall with Calacatta marble surround, matte black steel firebox, low tempered glass wind guard, brushed stainless linear burner, black volcanic stones and warm glowing amber flames, Cycles 8k.',
    aiBlenderMasterPrompt:
      'TV duvarı altına 140x36x48 cm modern ankastre bioetanol şömine yerleştirin; alev şeridine 2400K sıcak turuncu Emission + hazne içine yumuşak sıcak Point/Area ışık ekleyerek mermer çerçeveye canlı ateş yansıması verin.',
  }),

  // 17–30. Türkiye Elektrik, Doğalgaz, Isıtma/Sıhhi Tesisat, Klima & EN 81-20 Asansör Grubu (14 Model)
  ...TURKISH_MEP_ASSETS,

  // 42–55. Türkiye Elektrik Tesisatı (Sigorta Kutuları, Otomatlar, Zayıf Akım) & Alçıpan Spot / Şerit LED / Avize (14 Model)
  ...TURKISH_ELECTRICAL_LIGHTING_ASSETS,

  // 56–69. Türkiye Daire & Villa Girişi / Antre Koleksiyonu (Vestiyer, Villa Pivot Kapı, Dresuar, LED Boy Aynası, Ayakkabılık — 14 Model)
  ...TURKISH_ENTRYWAY_ASSETS,

  // 70–85. Türkiye Mutfak Ankastre Koleksiyonu (Bosch, Siemens, Vestel, Franke, Silverline, Teka — 16 Model)
  ...TURKISH_KITCHEN_BUILTIN_ASSETS,

  // 86–107. Ev İçi Gardırop, Kitaplık, Kalemlik, Ders Kitapları, Laptop & Çocuk/Bebek Oyuncakları (22 Model)
  ...TURKISH_HOME_STUDY_TOYS_ASSETS,
];
