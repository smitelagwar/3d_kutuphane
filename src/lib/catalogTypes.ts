export type AssetCategory =
  | 'Oda Tasarımları'
  | 'Çamaşır Odası'
  | 'Banyo'
  | 'Salon'
  | 'Yatak Odası'
  | 'Çocuk & Oyun'
  | 'Yemek & Mutfak'
  | 'Mutfak Ankastre'
  | 'Antre & Giriş'
  | 'Mimari & Çalışma'
  | 'Elektrik Tesisatı'
  | 'Aydınlatma'
  | 'Dekor & Bitki'
  | 'Dış Cephe';

export type BathroomSubCategory =
  | 'Klozet & Pisuvar'
  | 'Duşakabin & Küvet'
  | 'Duş Seti & Batarya'
  | 'Banyo Dolabı & Lavabo'
  | 'Havluluk & Kağıtlık'
  | 'Banyo Halısı & Tekstil'
  | 'Banyo Aynası & Aplik'
  | 'Aksesuar & Çamaşır';

export type PlacementType = 'floor' | 'wall-mounted' | 'ceiling' | 'exterior-ground';

export type AssetArchetype =
  | 'curved_sofa'
  | 'corner_sofa'
  | 'wall_hung_toilet'
  | 'towel_warmer'
  | 'modern_rug'
  | 'nesting_coffee_table'
  | 'ring_chandelier'
  | 'bioclimatic_pergola'
  | 'armchair'
  | 'dining_table'
  | 'vanity_cabinet'
  | 'floor_lamp'
  | 'laundry_side_by_side_elevated'
  | 'laundry_stacked_tower_hamper'
  | 'laundry_side_by_side_counter'
  | 'laundry_stacked_sink_combo'
  | 'laundry_utility_broom_closet'
  | 'laundry_clean_dirty_sorter'
  | 'laundry_compact_banyo_tower'
  | 'laundry_villa_quad_wall'
  | 'tr_alaturka_squat_toilet'
  | 'tr_geberit_flush_plate'
  | 'tr_schuko_socket'
  | 'tr_branded_dishwasher'
  | 'tr_branded_builtin_oven'
  | 'tr_pullout_kitchen_faucet'
  | 'tr_condensing_boiler'
  | 'tr_panel_radiator'
  | 'tr_armored_steel_door'
  | 'tr_magnetic_track_light'
  | 'tr_modern_fireplace'
  | 'tr_fuse_box'
  | 'tr_video_intercom'
  | 'tr_tv_data_socket'
  | 'tr_gas_valve_assembly'
  | 'tr_gas_meter_g4'
  | 'tr_manifold_cabinet'
  | 'tr_vertical_radiator'
  | 'tr_room_thermostat'
  | 'tr_split_ac_unit'
  | 'tr_water_meter_group'
  | 'tr_elevator_landing'
  | 'tr_elevator_cabin'
  | 'tr_ac_outdoor_unit'
  | 'tr_gas_service_box'
  | 'tr_fire_hose_cabinet'
  | 'tr_ip44_lidded_socket'
  | 'tr_electric_meter_panel'
  | 'tr_gas_smoke_detector'
  | 'tr_electric_water_heater'
  | 'tr_linear_floor_drain'
  | 'tr_surface_fuse_box'
  | 'tr_mcb_breaker_set'
  | 'tr_weak_current_panel'
  | 'tr_rack_cabinet_9u'
  | 'tr_recessed_spot_round'
  | 'tr_gimbal_double_spot'
  | 'tr_led_downlight_panel'
  | 'tr_cove_led_strip'
  | 'tr_linear_recessed_led'
  | 'tr_tiered_ring_chandelier'
  | 'tr_linear_globe_chandelier'
  | 'tr_cascade_stair_chandelier'
  | 'tr_wall_sconce_updown'
  | 'tr_slatted_bench_vestiyer'
  | 'tr_mirrored_sliding_vestiyer'
  | 'tr_compact_entry_portmanto'
  | 'tr_villa_pivot_steel_door'
  | 'tr_double_villa_steel_door'
  | 'tr_door_number_bell_plate'
  | 'tr_flip_drawer_shoe_cabinet'
  | 'tr_entryway_shoe_bench'
  | 'tr_doormat_umbrella_set'
  | 'tr_entryway_console_mirror_set'
  | 'tr_arched_led_floor_mirror'
  | 'tr_organic_led_wall_mirror'
  | 'tr_acoustic_slat_coat_panel'
  | 'tr_wall_key_mail_organizer'
  | 'tr_bosch_ankastre_set_3'
  | 'tr_siemens_ankastre_set_3'
  | 'tr_vestel_rustik_set_3'
  | 'tr_bosch_serie8_oven'
  | 'tr_siemens_iq700_oven'
  | 'tr_vestel_builtin_oven'
  | 'tr_builtin_microwave'
  | 'tr_induction_hob_60'
  | 'tr_gas_glass_hob_60'
  | 'tr_wok_gas_hob_75'
  | 'tr_downdraft_induction_hob'
  | 'tr_angled_glass_hood'
  | 'tr_island_t_hood_90'
  | 'tr_recessed_cabinet_hood'
  | 'tr_builtin_coffee_machine'
  | 'tr_builtin_fridge_column'
  | 'tr_mirrored_6door_wardrobe'
  | 'tr_glass_walkin_wardrobe'
  | 'tr_sliding_wardrobe_220'
  | 'tr_kids_3door_wardrobe'
  | 'tr_tall_filled_bookcase'
  | 'tr_arched_fluted_bookcase'
  | 'tr_study_desk_hutch_set'
  | 'tr_montessori_kids_bookshelf'
  | 'tr_pen_holder_stationery_set'
  | 'tr_desk_organizer_tray'
  | 'tr_turkish_textbooks_stack'
  | 'tr_open_textbook_study_set'
  | 'tr_bookends_encyclopedia_row'
  | 'tr_modern_ultrabook_laptop'
  | 'tr_laptop_stand_workstation'
  | 'tr_dual_monitor_desk_setup'
  | 'tr_montessori_rainbow_blocks'
  | 'tr_toddler_wooden_abacus_xylophone'
  | 'tr_kids_teepee_play_tent'
  | 'tr_wooden_kids_play_kitchen'
  | 'tr_kids_toy_storage_organizer'
  | 'tr_wooden_dollhouse_3story'
  | 'external_gltf';

export type PatternId =
  | 'original_pbr'
  | 'boucle_linen'
  | 'oak_wood_grain'
  | 'marble_vein'
  | 'brushed_pvd'
  | 'fluted_ribbed'
  | 'microcement_matte'
  | 'geometric_relief'
  | 'linear_ribbed'
  | 'anatolian_diamond'
  | 'boucle_loop'
  | 'fine_linen'
  | 'velvet_matte'
  | 'honed_pores'
  | 'veined_polished'
  | 'satin_brushed'
  | 'powder_matte';

export interface PatternVariant {
  id: PatternId;
  label: string;
  description: string;
  bumpScale: number;
  roughnessDelta: number;
}

export type RetailComboRole =
  | 'seating'
  | 'table_console'
  | 'vanity'
  | 'sanitary_ceramic'
  | 'shower_cabin'
  | 'bathtub'
  | 'faucet_hardware'
  | 'towel_hardware'
  | 'mirror_light'
  | 'bath_accessory'
  | 'bath_textile'
  | 'room_scene'
  | 'laundry_cabinet'
  | 'appliance'
  | 'bed_frame'
  | 'lighting_fixture'
  | 'botanical_plant'
  | 'arch_door_window'
  | 'exterior_outdoor';

export interface PartMaterialSpec {
  hex: string;
  roughness: number;
  metalness: number;
  /** Human-readable Turkish part label (e.g. "Döşeme: Krem Bukle", "Ayak: Amerikan Ceviz") */
  partLabel?: string;
}

export interface MultiPartFinishSpec {
  primary: PartMaterialSpec;
  secondary: PartMaterialSpec;
  accent: PartMaterialSpec;
  ceramic?: PartMaterialSpec;
  glass?: {
    hex: string;
    opacity: number;
    roughness: number;
  };
}

export interface MaterialFinish {
  id: string;
  label: string;
  materialKind: 'fabric' | 'linen' | 'ceramic' | 'metal' | 'wood' | 'stone' | 'glass' | 'rug';
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
  roughness: number;
  metalness: number;
  /** When true on external GLTF/GLB models, preserve original PBR textures untinted */
  preserveOriginalTextures?: boolean;
  /**
   * 'tri-tone-rug': remaps woven rug PBR diffuse textures into a 3-color designer palette.
   * 'multi-part-retail': applies realistic real-world multi-part retail color combinations
   * (never washing multi-part models into flat single-color white or black).
   */
  paletteRecolorMode?: 'tri-tone-rug' | 'multi-part-retail';
  /** Semantic product role guiding multi-part mesh & texture-zone classification */
  comboRole?: RetailComboRole;
  /** Explicit per-part PBR finishes for main body, secondary frame/top/basin, accent hardware, ceramic & glass */
  partFinishes?: MultiPartFinishSpec;
  /** Short Turkish retail combination breakdown shown in tooltips & studio panel */
  comboSummary?: string;
}

export interface AssetDimensionsCm {
  width: number;
  depth: number;
  height: number;
  mountHeight?: number;
}

export interface AssetModelingSpec {
  geometryBreakdown: string[];
  textureAndMaps: {
    surfaceType: string;
    uvTileCm: string;
    bumpDepthMm: string;
    roughnessRange: string;
    shaderRecipe: string;
  };
  microDetails: string[];
  blenderModifiers: string[];
  lightingAndCameraTip: string;
  aiRenderPrompt: string;
  aiBlenderMasterPrompt: string;
}

export interface ExternalModelSource {
  provider: 'polyhaven' | 'khronos' | 'abo' | 'hf' | 'procedural';
  polyhavenId?: string;
  /** Browser-loadable glTF/GLB URL (e.g. /api/v1/polyhaven/<id>/model.gltf, /api/v1/abo/glb/..., /api/v1/hf/glb/..., or Khronos .glb) */
  gltfUrl?: string;
  /** Optional direct Blender native .blend file URL */
  blendUrl?: string;
  license: string;
  /** Optional Y rotation in degrees to ensure front faces +Z in viewport */
  frontRotationYDeg?: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface TurkishMarketInfo {
  /** Authentic brand sold in Turkey (e.g. "Merinos Halı", "Enza Home", "Artema", "E.C.A.") */
  brand: string;
  /** Official Turkish retail series / collection (e.g. "Therapy Serisi", "Giorno", "Proteus Premix") */
  series: string;
  /** Origin / market status in Turkey (e.g. "Türkiye Merkezli Marka" or "Türkiye Yetkili Satış & Yerel Üretim") */
  originLabel: string;
  /** Local Turkish architectural or interior design language (e.g. "İnegöl Çağdaş Salon & Ceviz İşçiliği") */
  designLanguage: string;
  /** Turkish retail availability channels (e.g. "Yetkili Bayiler · Koçtaş · Trendyol") */
  retailChannel: string;
  /** 'exact-model': bespoke branded 3D CAD with printed logo; 'tr-retail-matched': verified TR market equivalent */
  matchType: 'exact-model' | 'tr-retail-matched';
}

export interface ArchitecturalAsset {
  id: string;
  slug: string;
  name: string;
  brandStyle: string;
  turkishMarket?: TurkishMarketInfo;
  category: AssetCategory;
  subCategory?: BathroomSubCategory;
  archetype: AssetArchetype;
  placement: PlacementType;
  dimensionsCm: AssetDimensionsCm;
  polyEstimate: number;
  renderEngines: string[];
  uvUnwrapped: boolean;
  thumbnailUrl: string;
  searchKeywords: string[];
  roomTags: string[];
  aiSummary: string;
  finishes: MaterialFinish[];
  defaultFinishId: string;
  patterns: PatternVariant[];
  defaultPatternId: PatternId;
  modelingSpec: AssetModelingSpec;
  modelSource: ExternalModelSource;
  sourceOrigin:
    | 'catalog'
    | 'polyhaven-cc0'
    | 'khronos-gltf'
    | 'abo-modern'
    | 'bath-ready'
    | 'interior-ready'
    | 'room-scene'
    | 'turkish-web-discovery';
  groundingSources?: GroundingSource[];
}

export type SourceFilter = 'all' | 'hf' | 'abo' | 'polyhaven' | 'khronos' | 'procedural';

export type CatalogSortBy = 'featured' | 'width-asc' | 'width-desc' | 'poly-desc';

export interface CatalogFilterState {
  query: string;
  category: AssetCategory | 'Tümü';
  subCategory?: BathroomSubCategory | 'Tümü';
  productGroup?: string;
  placement: PlacementType | 'all';
  source?: SourceFilter;
  sortBy?: CatalogSortBy;
  maxWidthCm?: number;
}

export interface SceneSelectionItem {
  asset: ArchitecturalAsset;
  finishId: string;
  customFinish?: MaterialFinish;
  quantity: number;
  addedBy: 'user' | 'ai';
  note?: string;
}

export interface BlenderVector3 {
  x: number;
  y: number;
  z: number;
}

export interface PlacedSceneEntry {
  asset: ArchitecturalAsset;
  finish: MaterialFinish;
  index: number;
  positionMeters: BlenderVector3;
  rotationZDeg: number;
  addedBy: 'user' | 'ai';
  note?: string;
}

export interface DiscoveryResponse {
  query: string;
  summary: string;
  discoveredAssets: ArchitecturalAsset[];
  groundingSources: GroundingSource[];
}

export interface PolyHavenSearchItem {
  id: string;
  name: string;
  categories: string[];
  tags: string[];
  dimensionsCm: AssetDimensionsCm;
  polyEstimate: number;
  thumbnailUrl: string;
  gltfUrl: string;
  blendUrl: string;
}
