import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  buildDefaultModelingSpec,
  EXTERNAL_PBR_PATTERNS,
  HARDWARE_PATTERNS,
  INITIAL_TURKISH_ASSETS,
  RUG_PATTERNS,
} from './src/lib/catalogData.ts';
import {
  computeSceneLayout,
  filterAssets,
  generateBatchSceneScript,
  generateBlenderPythonScript,
  generateLlmsTxt,
  normalizeTurkish,
  resolveFinish,
} from './src/lib/catalogLogic.ts';
import type {
  ArchitecturalAsset,
  AssetArchetype,
  AssetCategory,
  CatalogFilterState,
  GroundingSource,
  PlacementType,
  PolyHavenSearchItem,
  SceneSelectionItem,
} from './src/lib/catalogTypes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 3000);

// Live in-memory catalog & scene selection shared between Human UI and external AI / Blender MCP clients
let catalogAssets: ArchitecturalAsset[] = [...INITIAL_TURKISH_ASSETS];
let sceneSelection: SceneSelectionItem[] = [];

// In-memory caches for Poly Haven 522+ CC0 Blender model pool
let polyHavenCatalogCache: Record<string, {
  name?: string;
  categories?: string[];
  tags?: string[];
  dimensions?: number[];
  polycount?: number;
}> | null = null;
let polyHavenCatalogCachedAt = 0;
const polyHavenGltfCache = new Map<string, string>();

const TURKISH_TO_POLYHAVEN_TERMS: Record<string, string[]> = {
  koltuk: ['sofa', 'chair', 'armchair', 'couch', 'lounge'],
  kanepe: ['sofa', 'couch', 'day_bed'],
  berjer: ['armchair', 'chair', 'lounge'],
  sandalye: ['chair', 'stool', 'bench'],
  masa: ['table', 'desk', 'dining'],
  sehpa: ['coffee_table', 'side_table', 'table'],
  dolap: ['cabinet', 'drawer', 'commode', 'console'],
  kitaplik: ['shelf', 'shelves', 'bookshelf'],
  raf: ['shelf', 'shelves', 'rack'],
  avize: ['chandelier', 'ceiling_lamp', 'lamp'],
  lamba: ['lamp', 'light', 'lantern', 'sconce'],
  aplik: ['wall_lamp', 'sconce', 'light'],
  bitki: ['plant', 'potted', 'succulent', 'tree'],
  cicek: ['plant', 'flower', 'vase'],
  vazo: ['vase', 'pot', 'jug'],
  ayna: ['mirror'],
  bahce: ['outdoor', 'bench', 'picnic', 'fire_pit', 'planter'],
  teras: ['outdoor', 'bench', 'table', 'lantern'],
  somine: ['heater', 'fire_pit'],
  saat: ['clock'],
  komodin: ['nightstand', 'drawer'],
  yatak: ['bed'],
  puf: ['ottoman', 'stool'],
  kalemlik: ['pen', 'pencil', 'stationery', 'desk', 'organizer'],
  kirtasiye: ['stationery', 'pencil', 'notebook', 'ruler', 'clipboard'],
  laptop: ['laptop', 'computer', 'monitor', 'keyboard', 'desk'],
  bilgisayar: ['computer', 'laptop', 'monitor', 'keyboard', 'mouse'],
  oyuncak: ['toy', 'plush', 'teddy', 'blocks', 'dollhouse', 'train'],
  cocuk: ['kids', 'toy', 'montessori', 'play', 'plush'],
  kitap: ['book', 'books', 'bookcase', 'shelf', 'notebook'],
  defter: ['notebook', 'book', 'stationery'],
  gardirop: ['wardrobe', 'closet', 'cabinet', 'dresser'],
};

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY tanımlı değil. Yapay zeka destekli keşif ve seçim için sunucu ortam anahtarı gereklidir.',
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getBaseUrl(req: Request): string {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, '');
  }
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http';
  const host = req.get('host') || `localhost:${PORT}`;
  return `${proto}://${host}`;
}

function resolveAbsoluteUrl(baseUrl: string, maybeRelative: string): string {
  if (!maybeRelative) return '';
  if (/^https?:\/\//i.test(maybeRelative)) return maybeRelative;
  return `${baseUrl}${maybeRelative.startsWith('/') ? '' : '/'}${maybeRelative}`;
}

function pickFallbackThumbnail(archetype: AssetArchetype, category: AssetCategory): string {
  const byArchetype = catalogAssets.find((a) => a.archetype === archetype);
  if (byArchetype) return byArchetype.thumbnailUrl;
  const byCat = catalogAssets.find((a) => a.category === category);
  if (byCat) return byCat.thumbnailUrl;
  return catalogAssets[0].thumbnailUrl;
}

const VALID_ARCHETYPES: AssetArchetype[] = [
  'curved_sofa',
  'corner_sofa',
  'wall_hung_toilet',
  'towel_warmer',
  'modern_rug',
  'nesting_coffee_table',
  'ring_chandelier',
  'bioclimatic_pergola',
  'armchair',
  'dining_table',
  'vanity_cabinet',
  'floor_lamp',
  'laundry_side_by_side_elevated',
  'laundry_stacked_tower_hamper',
  'laundry_side_by_side_counter',
  'laundry_stacked_sink_combo',
  'laundry_utility_broom_closet',
  'laundry_clean_dirty_sorter',
  'laundry_compact_banyo_tower',
  'laundry_villa_quad_wall',
  'tr_alaturka_squat_toilet',
  'tr_geberit_flush_plate',
  'tr_schuko_socket',
  'tr_branded_dishwasher',
  'tr_branded_builtin_oven',
  'tr_pullout_kitchen_faucet',
  'tr_condensing_boiler',
  'tr_panel_radiator',
  'tr_armored_steel_door',
  'tr_magnetic_track_light',
  'tr_modern_fireplace',
  'tr_fuse_box',
  'tr_video_intercom',
  'tr_tv_data_socket',
  'tr_gas_valve_assembly',
  'tr_gas_meter_g4',
  'tr_manifold_cabinet',
  'tr_vertical_radiator',
  'tr_room_thermostat',
  'tr_split_ac_unit',
  'tr_water_meter_group',
  'tr_elevator_landing',
  'tr_elevator_cabin',
  'tr_ac_outdoor_unit',
  'tr_gas_service_box',
  'tr_fire_hose_cabinet',
  'tr_ip44_lidded_socket',
  'tr_electric_meter_panel',
  'tr_gas_smoke_detector',
  'tr_electric_water_heater',
  'tr_linear_floor_drain',
  'tr_surface_fuse_box',
  'tr_mcb_breaker_set',
  'tr_weak_current_panel',
  'tr_rack_cabinet_9u',
  'tr_recessed_spot_round',
  'tr_gimbal_double_spot',
  'tr_led_downlight_panel',
  'tr_cove_led_strip',
  'tr_linear_recessed_led',
  'tr_tiered_ring_chandelier',
  'tr_linear_globe_chandelier',
  'tr_cascade_stair_chandelier',
  'tr_wall_sconce_updown',
  'tr_slatted_bench_vestiyer',
  'tr_mirrored_sliding_vestiyer',
  'tr_compact_entry_portmanto',
  'tr_villa_pivot_steel_door',
  'tr_double_villa_steel_door',
  'tr_door_number_bell_plate',
  'tr_flip_drawer_shoe_cabinet',
  'tr_entryway_shoe_bench',
  'tr_doormat_umbrella_set',
  'tr_entryway_console_mirror_set',
  'tr_arched_led_floor_mirror',
  'tr_organic_led_wall_mirror',
  'tr_acoustic_slat_coat_panel',
  'tr_wall_key_mail_organizer',
  'tr_bosch_ankastre_set_3',
  'tr_siemens_ankastre_set_3',
  'tr_vestel_rustik_set_3',
  'tr_bosch_serie8_oven',
  'tr_siemens_iq700_oven',
  'tr_vestel_builtin_oven',
  'tr_builtin_microwave',
  'tr_induction_hob_60',
  'tr_gas_glass_hob_60',
  'tr_wok_gas_hob_75',
  'tr_downdraft_induction_hob',
  'tr_angled_glass_hood',
  'tr_island_t_hood_90',
  'tr_recessed_cabinet_hood',
  'tr_builtin_coffee_machine',
  'tr_builtin_fridge_column',
  'tr_mirrored_6door_wardrobe',
  'tr_glass_walkin_wardrobe',
  'tr_sliding_wardrobe_220',
  'tr_kids_3door_wardrobe',
  'tr_tall_filled_bookcase',
  'tr_arched_fluted_bookcase',
  'tr_study_desk_hutch_set',
  'tr_montessori_kids_bookshelf',
  'tr_pen_holder_stationery_set',
  'tr_desk_organizer_tray',
  'tr_turkish_textbooks_stack',
  'tr_open_textbook_study_set',
  'tr_bookends_encyclopedia_row',
  'tr_modern_ultrabook_laptop',
  'tr_laptop_stand_workstation',
  'tr_dual_monitor_desk_setup',
  'tr_montessori_rainbow_blocks',
  'tr_toddler_wooden_abacus_xylophone',
  'tr_kids_teepee_play_tent',
  'tr_wooden_kids_play_kitchen',
  'tr_kids_toy_storage_organizer',
  'tr_wooden_dollhouse_3story',
  'external_gltf',
];

const VALID_CATEGORIES: AssetCategory[] = [
  'Oda Tasarımları',
  'Çamaşır Odası',
  'Banyo',
  'Salon',
  'Yatak Odası',
  'Yemek & Mutfak',
  'Mutfak Ankastre',
  'Antre & Giriş',
  'Mimari & Çalışma',
  'Çocuk & Oyun',
  'Elektrik Tesisatı',
  'Aydınlatma',
  'Dekor & Bitki',
  'Dış Cephe',
];
const VALID_PLACEMENTS: PlacementType[] = ['floor', 'wall-mounted', 'ceiling', 'exterior-ground'];

function sanitizeAssetInput(raw: Record<string, unknown>, sources: GroundingSource[]): ArchitecturalAsset {
  const name = String(raw.name || 'Özel Türk Mimari Varlığı').trim().slice(0, 90);
  const slugBase = normalizeTurkish(name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'varlik';
  const id = `tr-web-${slugBase}-${Date.now().toString(36).slice(-4)}`;

  const category: AssetCategory = VALID_CATEGORIES.includes(raw.category as AssetCategory)
    ? (raw.category as AssetCategory)
    : 'Salon';
  const archetype: AssetArchetype = VALID_ARCHETYPES.includes(raw.archetype as AssetArchetype)
    ? (raw.archetype as AssetArchetype)
    : category === 'Banyo'
      ? 'vanity_cabinet'
      : category === 'Aydınlatma'
        ? 'floor_lamp'
        : category === 'Dış Cephe'
          ? 'bioclimatic_pergola'
          : 'armchair';
  const placement: PlacementType = VALID_PLACEMENTS.includes(raw.placement as PlacementType)
    ? (raw.placement as PlacementType)
    : category === 'Aydınlatma'
      ? 'ceiling'
      : category === 'Dış Cephe'
        ? 'exterior-ground'
        : 'floor';

  const dims = (raw.dimensionsCm || {}) as Record<string, unknown>;
  const width = Math.max(20, Math.min(600, Math.round(Number(dims.width) || 95)));
  const depth = Math.max(8, Math.min(450, Math.round(Number(dims.depth) || 85)));
  const height = Math.max(2, Math.min(360, Math.round(Number(dims.height) || 82)));
  const mountHeight =
    placement === 'wall-mounted'
      ? Math.max(25, Math.min(180, Math.round(Number(dims.mountHeight) || 45)))
      : placement === 'ceiling'
        ? 280
        : undefined;

  const primaryHex = /^#[0-9a-fA-F]{6}$/.test(String(raw.primaryHex || ''))
    ? String(raw.primaryHex)
    : '#E5DFD3';
  const secondaryHex = /^#[0-9a-fA-F]{6}$/.test(String(raw.secondaryHex || ''))
    ? String(raw.secondaryHex)
    : '#5C4330';
  const accentHex = /^#[0-9a-fA-F]{6}$/.test(String(raw.accentHex || ''))
    ? String(raw.accentHex)
    : '#B89A67';

  const keywords = Array.isArray(raw.searchKeywords)
    ? raw.searchKeywords.map((k) => String(k).trim()).filter(Boolean).slice(0, 8)
    : [name.toLowerCase(), category.toLowerCase(), 'türkiye mobilya'];

  const brandStyle = String(raw.brandStyle || 'Türkiye Pazar Stili').trim().slice(0, 70);
  const dimensionsCm = { width, depth, height, ...(mountHeight ? { mountHeight } : {}) };
  const patterns =
    archetype === 'modern_rug'
      ? RUG_PATTERNS
      : category === 'Banyo' || category === 'Aydınlatma' || category === 'Dış Cephe'
        ? HARDWARE_PATTERNS
        : EXTERNAL_PBR_PATTERNS;

  return {
    id,
    slug: slugBase,
    name,
    brandStyle,
    category,
    archetype,
    placement,
    dimensionsCm,
    polyEstimate: 12400,
    renderEngines: ['Cycles', 'EEVEE'],
    uvUnwrapped: true,
    thumbnailUrl: pickFallbackThumbnail(archetype, category),
    searchKeywords: keywords,
    roomTags: [category === 'Banyo' ? 'modern banyo' : category === 'Dış Cephe' ? 'villa teras' : 'modern salon'],
    aiSummary: String(
      raw.aiSummary ||
        `${name} — Türkiye iç mimari ve villa projeleri için 1:1 metrik ölçekte hazırlanmış Blender 3D varlığı.`,
    ).slice(0, 260),
    defaultFinishId: 'standart-kaplama',
    defaultPatternId: patterns[0].id,
    patterns,
    modelingSpec: buildDefaultModelingSpec({
      name,
      brandStyle,
      category,
      dimensionsCm,
      primaryHex,
      surfaceType: String(raw.finishLabel || 'Mimari PBR Kaplama'),
      providerLabel: 'Türkiye Web Keşfi',
    }),
    modelSource: {
      provider: 'procedural',
      license: 'MimarKatalog CAD',
    },
    sourceOrigin: 'turkish-web-discovery',
    groundingSources: sources.slice(0, 4),
    finishes: [
      {
        id: 'standart-kaplama',
        label: String(raw.finishLabel || 'Özgün Kaplama').slice(0, 32),
        materialKind:
          category === 'Banyo'
            ? 'ceramic'
            : category === 'Aydınlatma' || category === 'Dış Cephe'
              ? 'metal'
              : 'fabric',
        primaryHex,
        secondaryHex,
        accentHex,
        roughness: category === 'Banyo' ? 0.24 : category === 'Aydınlatma' ? 0.26 : 0.78,
        metalness: category === 'Aydınlatma' || category === 'Dış Cephe' ? 0.78 : 0.04,
      },
      {
        id: 'mat-antrasit',
        label: 'Mat Antrasit',
        materialKind: 'fabric',
        primaryHex: '#3A3E45',
        secondaryHex: '#23252A',
        accentHex: '#C29E60',
        roughness: 0.72,
        metalness: 0.12,
      },
    ],
  };
}

function extractJsonBlock(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1);
  }
  return text.trim();
}

async function getPolyHavenModelIndex() {
  const now = Date.now();
  if (polyHavenCatalogCache && now - polyHavenCatalogCachedAt < 1000 * 60 * 30) {
    return polyHavenCatalogCache;
  }
  const resp = await fetch('https://api.polyhaven.com/assets?t=models', {
    headers: { 'User-Agent': 'MimarKatalog/2.0' },
  });
  if (!resp.ok) {
    throw new Error(`Poly Haven kataloğu alınamadı (${resp.status}).`);
  }
  polyHavenCatalogCache = (await resp.json()) as Record<
    string,
    {
      name?: string;
      categories?: string[];
      tags?: string[];
      dimensions?: number[];
      polycount?: number;
    }
  >;
  polyHavenCatalogCachedAt = now;
  return polyHavenCatalogCache;
}

async function createApp() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // Allow local Blender Python scripts & MCP tools to read the catalog API
  app.use('/api', (_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (_req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  // Persistent MASTER.md project instructions (read/written directly to workspace root /MASTER.md)
  const masterInstructionsPath = path.resolve(__dirname, 'MASTER.md');

  app.get('/api/v1/master-instructions', async (_req: Request, res: Response) => {
    try {
      const content = await fs.readFile(masterInstructionsPath, 'utf-8');
      const stat = await fs.stat(masterInstructionsPath);
      res.json({
        filename: 'MASTER.md',
        content,
        updatedAt: stat.mtime.toISOString(),
      });
    } catch {
      res.status(404).json({ error: 'MASTER.md dosyası bulunamadı.' });
    }
  });

  app.put('/api/v1/master-instructions', async (req: Request, res: Response) => {
    const content = typeof req.body?.content === 'string' ? req.body.content : null;
    if (content === null || content.trim().length < 10) {
      res.status(400).json({ error: 'Geçerli bir talimat içeriği (en az 10 karakter) girilmelidir.' });
      return;
    }
    if (content.length > 200_000) {
      res.status(413).json({ error: 'Talimat dosyası 200 KB sınırını aşamaz.' });
      return;
    }
    try {
      await fs.writeFile(masterInstructionsPath, content, 'utf-8');
      const stat = await fs.stat(masterInstructionsPath);
      res.json({
        filename: 'MASTER.md',
        content,
        updatedAt: stat.mtime.toISOString(),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'MASTER.md kaydedilemedi.';
      res.status(500).json({ error: msg });
    }
  });

  // Machine-readable AI / Blender MCP discovery file
  app.get('/llms.txt', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(generateLlmsTxt(getBaseUrl(req), catalogAssets));
  });

  // Poly Haven GLTF URI-Rewriting Resolver: rewrites relative buffer/texture URIs to exact dl.polyhaven.org URLs (ZERO 404s!)
  app.get('/api/v1/polyhaven/:id/model.gltf', async (req: Request, res: Response) => {
    const phId = String(req.params.id || '').trim();
    if (!/^[a-zA-Z0-9_-]{2,80}$/.test(phId)) {
      res.status(400).json({ error: 'Geçersiz Poly Haven varlık kimliği.' });
      return;
    }

    const cached = polyHavenGltfCache.get(phId);
    if (cached) {
      res.setHeader('Content-Type', 'model/gltf+json; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(cached);
      return;
    }

    try {
      const filesRes = await fetch(`https://api.polyhaven.com/files/${encodeURIComponent(phId)}`, {
        headers: { 'User-Agent': 'MimarKatalog/2.0' },
      });
      if (!filesRes.ok) {
        res.status(404).json({ error: `Poly Haven '${phId}' dosyaları bulunamadı.` });
        return;
      }
      const filesJson = (await filesRes.json()) as {
        gltf?: Record<
          string,
          {
            gltf?: {
              url?: string;
              include?: Record<string, { url?: string }>;
            };
          }
        >;
      };

      const gltfVariant =
        filesJson.gltf?.['1k']?.gltf ??
        filesJson.gltf?.['2k']?.gltf ??
        Object.values(filesJson.gltf ?? {})[0]?.gltf;

      if (!gltfVariant?.url) {
        res.status(404).json({ error: `Poly Haven '${phId}' için glTF dosyası mevcut değil.` });
        return;
      }

      const gltfResp = await fetch(gltfVariant.url, {
        headers: { 'User-Agent': 'MimarKatalog/2.0' },
      });
      if (!gltfResp.ok) {
        res.status(502).json({ error: 'Poly Haven glTF dosyası indirilemedi.' });
        return;
      }

      const gltfDoc = (await gltfResp.json()) as {
        buffers?: Array<{ uri?: string }>;
        images?: Array<{ uri?: string }>;
      };
      const includeMap = gltfVariant.include ?? {};

      // Build lookup by exact relative path AND by basename
      const resolveUri = (uri: string | undefined): string | undefined => {
        if (!uri || /^https?:\/\/|^data:/i.test(uri)) return uri;
        if (includeMap[uri]?.url) return includeMap[uri].url;
        const baseName = uri.split('/').pop() || uri;
        for (const [k, v] of Object.entries(includeMap)) {
          if (k === uri || k.endsWith('/' + baseName) || k === baseName) {
            if (v?.url) return v.url;
          }
        }
        return uri;
      };

      if (Array.isArray(gltfDoc.buffers)) {
        for (const buf of gltfDoc.buffers) {
          buf.uri = resolveUri(buf.uri);
        }
      }
      if (Array.isArray(gltfDoc.images)) {
        for (const img of gltfDoc.images) {
          img.uri = resolveUri(img.uri);
        }
      }

      const serialized = JSON.stringify(gltfDoc);
      polyHavenGltfCache.set(phId, serialized);
      res.setHeader('Content-Type', 'model/gltf+json; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(serialized);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Poly Haven glTF çözümlenirken hata oluştu.';
      res.status(502).json({ error: msg });
    }
  });

  // Amazon Berkeley Objects (CC BY 4.0) binary .GLB — validated 302 redirect to CORS-enabled S3 origin
  // Avoids Cloud Run's 32 MiB HTTP/1.1 response limit so 30–65 MB high-res PBR rug/furniture GLBs never HTTP 500
  app.get('/api/v1/abo/glb/:dir/:filename', (req: Request, res: Response) => {
    const dir = String(req.params.dir || '').trim();
    const filename = String(req.params.filename || '').trim();
    if (!/^[0-9a-zA-Z]$/.test(dir) || !/^[A-Z0-9_-]{4,28}\.glb$/i.test(filename)) {
      res.status(400).json({ error: 'Geçersiz 3D GLB varlık yolu.' });
      return;
    }

    const upstreamUrl = `https://amazon-berkeley-objects.s3.amazonaws.com/3dmodels/original/${dir}/${filename}`;
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.redirect(302, upstreamUrl);
  });

  // Hugging Face (NVIDIA USDCraft Apache-2.0 / SimReady / Objaverse-Clean CC-BY-4.0) — validated 302 redirect to CORS-enabled HF CDN
  const ALLOWED_HF_REPOS = new Set(['usdcraft-glb', 'simready-glb', 'objaverse-clean-glb']);
  app.get('/api/v1/hf/glb/:repo/:id', (req: Request, res: Response) => {
    const repo = String(req.params.repo || '').trim();
    const assetId = String(req.params.id || '').trim();
    if (!ALLOWED_HF_REPOS.has(repo) || !/^[a-zA-Z0-9_-]{2,96}$/.test(assetId)) {
      res.status(400).json({ error: 'Geçersiz hazır 3D model yolu.' });
      return;
    }

    const upstreamUrl = `https://huggingface.co/datasets/codepawl/${repo}/resolve/main/engine/${assetId}/${assetId}.glb`;
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.redirect(302, upstreamUrl);
  });

  // Live search across ALL 522+ Poly Haven CC0 Blender 3D models (supports Turkish & English keywords!)
  app.get('/api/v1/polyhaven/search', async (req: Request, res: Response) => {
    const rawQ = String(req.query.q || '').trim();
    const limit = Math.max(1, Math.min(48, Number(req.query.limit) || 24));
    try {
      const all = await getPolyHavenModelIndex();
      const normQ = normalizeTurkish(rawQ);
      const rawTokens = normQ ? normQ.split(/\s+/).filter(Boolean) : [];
      const expandedGroups = rawTokens.map((tok) => {
        const mapped = TURKISH_TO_POLYHAVEN_TERMS[tok];
        return mapped ? [tok, ...mapped] : [tok];
      });

      const entries = Object.entries(all);
      const filtered = entries.filter(([id, info]) => {
        const cats = (info.categories || []).join(' ').toLowerCase();
        const tags = (info.tags || []).join(' ').toLowerCase();
        const name = (info.name || id).toLowerCase();
        const blob = `${id.toLowerCase()} ${name} ${cats} ${tags}`;

        if (expandedGroups.length === 0) {
          // Default view: clean architectural/furniture/lighting/decor/plant models
          return /furniture|seating|lighting|table|shelves|potted|vase|wall decoration|bed/.test(cats);
        }
        return expandedGroups.every((group) => group.some((term) => blob.includes(term)));
      });

      const results: PolyHavenSearchItem[] = filtered.slice(0, limit).map(([id, info]) => {
        const dims = info.dimensions || [800, 800, 800];
        return {
          id,
          name: info.name || id,
          categories: info.categories || [],
          tags: (info.tags || []).slice(0, 8),
          dimensionsCm: {
            width: Math.max(5, Math.round((dims[0] || 800) / 10)),
            depth: Math.max(5, Math.round((dims[1] || 800) / 10)),
            height: Math.max(5, Math.round((dims[2] || 800) / 10)),
          },
          polyEstimate: Number(info.polycount) || 8500,
          thumbnailUrl: `https://cdn.polyhaven.com/asset_img/primary/${id}.png?height=512`,
          gltfUrl: `/api/v1/polyhaven/${id}/model.gltf`,
          blendUrl: `https://dl.polyhaven.org/file/ph-assets/Models/blend/2k/${id}/${id}_2k.blend`,
        };
      });

      res.json({
        query: rawQ,
        totalPool: entries.length,
        matchedCount: filtered.length,
        items: results,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Poly Haven havuzu sorgulanamadı.';
      res.status(502).json({ error: msg });
    }
  });

  app.get('/api/v1/manifest.json', (req: Request, res: Response) => {
    const baseUrl = getBaseUrl(req);
    res.json({
      name: 'MimarKatalog',
      locale: 'tr-TR',
      blenderVersion: '4.x',
      units: 'metric (meters, Z-up)',
      totalAssets: catalogAssets.length,
      selectedCount: sceneSelection.reduce((acc, s) => acc + s.quantity, 0),
      endpoints: {
        catalog: `${baseUrl}/api/v1/catalog`,
        assetDetail: `${baseUrl}/api/v1/catalog/{id}`,
        assetBlenderScript: `${baseUrl}/api/v1/catalog/{id}/blender-script`,
        polyhavenSearch: `${baseUrl}/api/v1/polyhaven/search?q=sofa`,
        polyhavenGltf: `${baseUrl}/api/v1/polyhaven/{id}/model.gltf`,
        selection: `${baseUrl}/api/v1/selection`,
        selectionBlenderScript: `${baseUrl}/api/v1/selection/blender-script`,
        discoverTurkishWeb: `${baseUrl}/api/v1/discover`,
        aiSelectScene: `${baseUrl}/api/v1/ai-select`,
        masterInstructions: `${baseUrl}/api/v1/master-instructions`,
        llmsTxt: `${baseUrl}/llms.txt`,
      },
      mcpTools: [
        {
          name: 'search_turkish_blender_assets',
          description:
            `Katalogdaki ${catalogAssets.length} hazır modern mobilya (İnegöl/ABO GLB), Poly Haven CC0, Khronos PBR ve Türk mimari 3D varlığını Türkçe arama, ölçü ve kategori ile sorgular.`,
          method: 'GET',
          url: `${baseUrl}/api/v1/catalog`,
          parameters: {
            q: 'Türkçe arama kelimesi (örn. inegöl, mermer sehpa, köşe koltuk, yemek masası, asma klozet, havlupan, halı, avize)',
            category: 'Salon | Yemek & Mutfak | Banyo | Aydınlatma | Dekor & Bitki | Dış Cephe',
            placement: 'floor | wall-mounted | ceiling | exterior-ground',
            source: 'all | hf | abo | polyhaven | khronos | procedural',
            subCategory: 'Banyo alt kategorisi (örn. Klozet & Pisuvar, Duşakabin & Küvet, Duş Seti & Batarya, Havluluk & Kağıtlık, Banyo Halısı & Tekstil)',
            maxWidthCm: 'Maksimum genişlik (cm)',
          },
        },
        {
          name: 'search_polyhaven_cc0_pool',
          description: 'Poly Haven 522+ ücretsiz CC0 Blender 3D model havuzunda canlı arama yapar.',
          method: 'GET',
          url: `${baseUrl}/api/v1/polyhaven/search`,
          parameters: {
            q: 'Türkçe veya İngilizce arama terimi (örn. koltuk, masa, chair, lamp, plant)',
          },
        },
        {
          name: 'select_asset_for_blender_scene',
          description: 'Belirtilen 3D varlığı aktif Blender sahne listesine ekler.',
          method: 'POST',
          url: `${baseUrl}/api/v1/selection`,
          bodySchema: {
            action: 'add',
            assetId: 'bath-uc-ds-r789-03',
            finishId: 'mat-siyah',
            addedBy: 'ai',
          },
        },
        {
          name: 'get_blender_python_scene_script',
          description: 'Seçili tüm varlıkları 1:1 metrik ölçekle Blender sahnesine kuran bpy Python kodunu döndürür.',
          method: 'GET',
          url: `${baseUrl}/api/v1/selection/blender-script`,
        },
      ],
    });
  });

  // GET /api/v1/catalog
  app.get('/api/v1/catalog', (req: Request, res: Response) => {
    const q = String(req.query.q || '');
    const categoryParam = String(req.query.category || 'Tümü');
    const subCategoryParam = String(req.query.subCategory || 'Tümü');
    const productGroupParam = String(req.query.productGroup || 'all');
    const placementParam = String(req.query.placement || 'all');
    const sourceParam = String(req.query.source || 'all');
    const maxWidthParam = req.query.maxWidthCm ? Number(req.query.maxWidthCm) : undefined;

    const category = VALID_CATEGORIES.includes(categoryParam as AssetCategory)
      ? (categoryParam as AssetCategory)
      : 'Tümü';
    const placement = VALID_PLACEMENTS.includes(placementParam as PlacementType)
      ? (placementParam as PlacementType)
      : 'all';
    const validSources = ['all', 'hf', 'abo', 'polyhaven', 'khronos', 'procedural'] as const;
    const source = validSources.includes(sourceParam as (typeof validSources)[number])
      ? (sourceParam as (typeof validSources)[number])
      : 'all';

    const items = filterAssets(catalogAssets, {
      query: q,
      category,
      subCategory: subCategoryParam as CatalogFilterState['subCategory'],
      productGroup: productGroupParam,
      placement,
      source,
      maxWidthCm: maxWidthParam,
    });

    const baseUrl = getBaseUrl(req);
    res.json({
      count: items.length,
      totalCatalog: catalogAssets.length,
      items: items.map((item) => ({
        ...item,
        referenceImageUrl: resolveAbsoluteUrl(baseUrl, item.thumbnailUrl),
        model3dUrl: item.modelSource?.gltfUrl
          ? resolveAbsoluteUrl(baseUrl, item.modelSource.gltfUrl)
          : undefined,
        apiUrls: {
          detail: `${baseUrl}/api/v1/catalog/${item.id}`,
          blenderScript: `${baseUrl}/api/v1/catalog/${item.id}/blender-script`,
        },
      })),
    });
  });

  // POST /api/v1/catalog — register a newly imported/discovered asset into the live catalog
  app.post('/api/v1/catalog', (req: Request, res: Response) => {
    const incoming = req.body?.asset as ArchitecturalAsset | undefined;
    if (!incoming || !incoming.id || !incoming.name) {
      res.status(400).json({ error: 'Geçerli bir varlık nesnesi (asset.id ve asset.name) gereklidir.' });
      return;
    }
    const existing = catalogAssets.find((a) => a.id === incoming.id);
    if (!existing) {
      catalogAssets = [incoming, ...catalogAssets];
    }
    res.status(201).json({ asset: existing ?? incoming, totalCatalog: catalogAssets.length });
  });

  // GET /api/v1/catalog/:id
  app.get('/api/v1/catalog/:id', (req: Request, res: Response) => {
    const asset = catalogAssets.find(
      (a) => a.id === req.params.id || a.slug === req.params.id,
    );
    if (!asset) {
      res.status(404).json({ error: 'Varlık katalogda bulunamadı.' });
      return;
    }
    const baseUrl = getBaseUrl(req);
    res.json({
      ...asset,
      referenceImageUrl: resolveAbsoluteUrl(baseUrl, asset.thumbnailUrl),
      model3dUrl: asset.modelSource?.gltfUrl
        ? resolveAbsoluteUrl(baseUrl, asset.modelSource.gltfUrl)
        : undefined,
      apiUrls: {
        blenderScript: `${baseUrl}/api/v1/catalog/${asset.id}/blender-script`,
      },
    });
  });

  // GET /api/v1/catalog/:id/blender-script
  app.get('/api/v1/catalog/:id/blender-script', (req: Request, res: Response) => {
    const asset = catalogAssets.find(
      (a) => a.id === req.params.id || a.slug === req.params.id,
    );
    if (!asset) {
      res.status(404).send('# Hata: Varlık bulunamadı.');
      return;
    }
    const finishId = req.query.finish ? String(req.query.finish) : asset.defaultFinishId;
    const patternId = req.query.pattern ? (String(req.query.pattern) as ArchitecturalAsset['defaultPatternId']) : undefined;
    const script = generateBlenderPythonScript(
      asset,
      finishId,
      { x: 0, y: 0, z: 0 },
      getBaseUrl(req),
      undefined,
      patternId,
    );
    res.setHeader('Content-Type', 'text/x-python; charset=utf-8');
    res.setHeader('Content-Disposition', `inline; filename="${asset.slug}.py"`);
    res.send(script);
  });

  // GET /api/v1/selection
  app.get('/api/v1/selection', (req: Request, res: Response) => {
    const baseUrl = getBaseUrl(req);
    const layout = computeSceneLayout(sceneSelection);
    res.json({
      count: sceneSelection.reduce((sum, item) => sum + item.quantity, 0),
      items: sceneSelection,
      layout,
      blenderSceneScriptUrl: `${baseUrl}/api/v1/selection/blender-script`,
    });
  });

  // POST /api/v1/selection
  app.post('/api/v1/selection', (req: Request, res: Response) => {
    const { action = 'add', assetId, finishId, customFinish, quantity, addedBy = 'user', note } = req.body || {};

    if (action === 'clear') {
      sceneSelection = [];
    } else if (action === 'remove') {
      sceneSelection = sceneSelection.filter(
        (s) => !(s.asset.id === assetId && (!finishId || s.finishId === finishId)),
      );
    } else if (action === 'setQuantity') {
      const qty = Math.max(0, Math.min(10, Math.floor(Number(quantity) || 0)));
      if (qty === 0) {
        sceneSelection = sceneSelection.filter(
          (s) => !(s.asset.id === assetId && (!finishId || s.finishId === finishId)),
        );
      } else {
        sceneSelection = sceneSelection.map((s) =>
          s.asset.id === assetId && (!finishId || s.finishId === finishId)
            ? { ...s, quantity: qty }
            : s,
        );
      }
    } else if (action === 'add') {
      const asset = catalogAssets.find((a) => a.id === assetId || a.slug === assetId);
      if (!asset) {
        res.status(404).json({ error: `Katalogda '${assetId}' kimlikli varlık bulunamadı.` });
        return;
      }
      const safeCustom =
        customFinish &&
        typeof customFinish.primaryHex === 'string' &&
        /^#[0-9a-fA-F]{6}$/.test(customFinish.primaryHex)
          ? {
              id: String(customFinish.id || `ozel-${customFinish.primaryHex.slice(1).toLowerCase()}`),
              label: String(customFinish.label || `Özel (${customFinish.primaryHex})`).slice(0, 40),
              materialKind: customFinish.materialKind || 'metal',
              primaryHex: customFinish.primaryHex,
              secondaryHex: customFinish.secondaryHex || customFinish.primaryHex,
              accentHex: customFinish.accentHex || customFinish.primaryHex,
              roughness: Math.max(0.04, Math.min(0.98, Number(customFinish.roughness) || 0.35)),
              metalness: Math.max(0, Math.min(1, Number(customFinish.metalness) || 0.2)),
            }
          : undefined;
      const resolvedFinish = resolveFinish(asset, finishId, safeCustom);
      const existingIdx = sceneSelection.findIndex(
        (s) => s.asset.id === asset.id && s.finishId === resolvedFinish.id,
      );
      if (existingIdx >= 0) {
        sceneSelection[existingIdx] = {
          ...sceneSelection[existingIdx],
          customFinish: safeCustom ?? sceneSelection[existingIdx].customFinish,
          quantity: Math.min(10, sceneSelection[existingIdx].quantity + (Number(quantity) || 1)),
        };
      } else {
        sceneSelection.push({
          asset,
          finishId: resolvedFinish.id,
          customFinish: safeCustom,
          quantity: Math.max(1, Math.min(10, Number(quantity) || 1)),
          addedBy: addedBy === 'ai' ? 'ai' : 'user',
          note: typeof note === 'string' ? note.slice(0, 140) : undefined,
        });
      }
    } else {
      res.status(400).json({ error: 'Geçersiz işlem türü.' });
      return;
    }

    const baseUrl = getBaseUrl(req);
    res.json({
      count: sceneSelection.reduce((sum, item) => sum + item.quantity, 0),
      items: sceneSelection,
      layout: computeSceneLayout(sceneSelection),
      blenderSceneScriptUrl: `${baseUrl}/api/v1/selection/blender-script`,
    });
  });

  // GET /api/v1/selection/blender-script
  app.get('/api/v1/selection/blender-script', (req: Request, res: Response) => {
    const script = generateBatchSceneScript(sceneSelection, getBaseUrl(req));
    res.setHeader('Content-Type', 'text/x-python; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline; filename="mimarkatalog_sahne.py"');
    res.send(script);
  });

  // POST /api/v1/discover — Real Gemini + Google Search Grounding for Turkish Furniture & Fixtures
  app.post('/api/v1/discover', async (req: Request, res: Response) => {
    const query = String(req.body?.query || '').trim();
    if (!query || query.length < 2) {
      res.status(400).json({ error: 'Lütfen en az 2 karakterli Türkçe bir mobilya veya mimari arama terimi girin.' });
      return;
    }

    try {
      const ai = getGeminiClient();
      const prompt = `Sen Türkiye mimari görselleştirme ve iç mimarlık (Blender 3D) uzmanısın.
Kullanıcı Türkiye'de Google Görseller ve Pinterest'te aradığı şu mobilya/mimari eleman için gerçek Türkiye pazarına uygun 3D varlık önerileri istiyor: "${query}".

Google Arama kullanarak Türkiye'deki gerçek mobilya, vitrifiye, aydınlatma veya dış cephe markalarının güncel modellerini, gerçek santimetre ölçülerini ve malzeme renklerini araştır.

SADECE geçerli bir JSON nesnesi döndür (ek açıklama yazma). JSON yapısı:
{
  "summary": "Arama sonucuna dair 1-2 cümlelik Türkçe mimari özet",
  "assets": [
    {
      "name": "Türkçe gerçekçi model adı",
      "brandStyle": "Türkiye marka / tarz referansı",
      "category": "Salon | Yemek & Mutfak | Banyo | Aydınlatma | Dekor & Bitki | Dış Cephe",
      "archetype": "wall_hung_toilet | towel_warmer | modern_rug | bioclimatic_pergola | armchair | dining_table | vanity_cabinet | floor_lamp",
      "placement": "floor | wall-mounted | ceiling | exterior-ground",
      "dimensionsCm": { "width": 85, "depth": 82, "height": 78, "mountHeight": 0 },
      "finishLabel": "Krem Bukle / Ceviz Ayak",
      "primaryHex": "#E8E2D7",
      "secondaryHex": "#5E4330",
      "accentHex": "#C29E60",
      "searchKeywords": ["anahtar1", "anahtar2", "anahtar3"],
      "aiSummary": "Blender mimari sahnesi için kısa Türkçe teknik özet"
    }
  ]
}
Tam olarak 3 farklı, Türkiye'de gerçekte kullanılan model döndür.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const rawText = (response.text ?? '').trim();
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
      const groundingSources: GroundingSource[] = chunks
        .map((ch) => ch.web)
        .filter((w): w is { uri?: string; title?: string } => Boolean(w && w.uri))
        .map((w) => ({
          title: w.title || w.uri || 'Türkiye Web Kaynağı',
          uri: w.uri || '',
        }))
        .slice(0, 6);

      const parsed = JSON.parse(extractJsonBlock(rawText)) as {
        summary?: string;
        assets?: Record<string, unknown>[];
      };

      const discoveredAssets = (parsed.assets ?? [])
        .slice(0, 3)
        .map((item) => sanitizeAssetInput(item, groundingSources));

      if (discoveredAssets.length === 0) {
        res.status(502).json({
          error: 'Arama sonucu yapılandırılmış varlığa dönüştürülemedi. Lütfen daha spesifik bir Türkçe mobilya adı deneyin.',
        });
        return;
      }

      res.json({
        query,
        summary:
          parsed.summary ||
          `"${query}" için Türkiye mobilya ve mimari pazarından 3 adet Blender 1:1 metrik varlık derlendi.`,
        discoveredAssets,
        groundingSources,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Keşif sırasında beklenmeyen bir sunucu hatası oluştu.';
      res.status(500).json({ error: message });
    }
  });

  // POST /api/v1/ai-select — AI Architectural Brief -> Automatic Catalog Selection for Blender
  app.post('/api/v1/ai-select', async (req: Request, res: Response) => {
    const brief = String(req.body?.brief || '').trim();
    const applyToSelection = req.body?.applyToSelection !== false;

    if (!brief || brief.length < 4) {
      res.status(400).json({
        error: 'Lütfen mimari sahne brifinizi yazın (ör. "Bodrum modern villa salonu ve banyosu için mobilya seç").',
      });
      return;
    }

    try {
      const ai = getGeminiClient();
      const catalogDigest = catalogAssets.map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        placement: a.placement,
        dimensionsCm: a.dimensionsCm,
        finishes: a.finishes.map((f) => ({ id: f.id, label: f.label })),
        keywords: a.searchKeywords.slice(0, 5),
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Sen Blender mimari görselleştirme projeleri için çalışan uzman bir iç mimar yapay zeka ajanısın.
Aşağıdaki mevcut 3D varlık kataloğundan, kullanıcının verdiği mimari brife en uygun varlıkları ve kaplama seçeneklerini seç.

Mimari Brif: "${brief}"

Mevcut Katalog JSON:
${JSON.stringify(catalogDigest)}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              rationale: {
                type: Type.STRING,
                description: 'Seçilen mobilya ve vitrifiyelerin mimari uyumunu açıklayan kısa Türkçe özet.',
              },
              selections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    assetId: { type: Type.STRING },
                    finishId: { type: Type.STRING },
                    quantity: { type: Type.INTEGER },
                    placementNote: { type: Type.STRING },
                  },
                  required: ['assetId', 'finishId', 'quantity', 'placementNote'],
                },
              },
            },
            required: ['rationale', 'selections'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim()) as {
        rationale?: string;
        selections?: Array<{
          assetId: string;
          finishId: string;
          quantity: number;
          placementNote: string;
        }>;
      };

      const matchedItems: SceneSelectionItem[] = [];
      for (const sel of parsed.selections ?? []) {
        const asset = catalogAssets.find((a) => a.id === sel.assetId);
        if (!asset) continue;
        const finish = resolveFinish(asset, sel.finishId);
        matchedItems.push({
          asset,
          finishId: finish.id,
          quantity: Math.max(1, Math.min(4, Number(sel.quantity) || 1)),
          addedBy: 'ai',
          note: sel.placementNote,
        });
      }

      if (applyToSelection && matchedItems.length > 0) {
        for (const item of matchedItems) {
          const existingIdx = sceneSelection.findIndex(
            (s) => s.asset.id === item.asset.id && s.finishId === item.finishId,
          );
          if (existingIdx >= 0) {
            sceneSelection[existingIdx] = { ...sceneSelection[existingIdx], addedBy: 'ai', note: item.note };
          } else {
            sceneSelection.push(item);
          }
        }
      }

      res.json({
        rationale:
          parsed.rationale || 'Mimari brifinize uygun 3D varlıklar seçilerek Blender sahne listesine eklendi.',
        selectedItems: matchedItems,
        totalSelectionCount: sceneSelection.reduce((sum, s) => sum + s.quantity, 0),
        sceneSelection,
        layout: computeSceneLayout(sceneSelection),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI sahne seçimi sırasında hata oluştu.';
      res.status(500).json({ error: message });
    }
  });

  // Serve generated studio thumbnails & local static assets immediately in both dev and production
  app.use(
    '/assets',
    express.static(path.resolve(__dirname, 'public', 'assets'), {
      maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0,
    }),
  );

  // Mount Vite dev server in development or serve built dist/ in production
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MimarKatalog full-stack server running at http://localhost:${PORT}`);
  });
}

createApp().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
