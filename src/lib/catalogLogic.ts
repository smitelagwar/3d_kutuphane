import type {
  ArchitecturalAsset,
  CatalogFilterState,
  MaterialFinish,
  PatternId,
  PatternVariant,
  PlacedSceneEntry,
  SceneSelectionItem,
} from './catalogTypes';
import { classifyAssetGroup } from './taxonomy';

/**
 * Normalizes Turkish characters so both accented ("köşe koltuk", "halı", "İnegöl")
 * and ASCII-typed queries ("kose koltuk", "hali", "inegol") match reliably.
 */
export function normalizeTurkish(input: string): string {
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

export function filterAssets(
  assets: ArchitecturalAsset[],
  filters: CatalogFilterState,
): ArchitecturalAsset[] {
  const normQuery = normalizeTurkish(filters.query || '');
  const tokens = normQuery ? normQuery.split(/\s+/).filter(Boolean) : [];

  const filtered = assets.filter((asset) => {
    if (filters.category !== 'Tümü' && asset.category !== filters.category) {
      return false;
    }
    if (
      filters.subCategory &&
      filters.subCategory !== 'Tümü' &&
      asset.subCategory !== filters.subCategory
    ) {
      return false;
    }
    if (filters.productGroup && filters.productGroup !== 'all') {
      if (classifyAssetGroup(asset).id !== filters.productGroup) {
        return false;
      }
    }
    if (filters.placement !== 'all' && asset.placement !== filters.placement) {
      return false;
    }
    if (filters.source && filters.source !== 'all' && asset.modelSource?.provider !== filters.source) {
      return false;
    }
    if (
      typeof filters.maxWidthCm === 'number' &&
      !Number.isNaN(filters.maxWidthCm) &&
      filters.maxWidthCm > 0 &&
      asset.dimensionsCm.width > filters.maxWidthCm
    ) {
      return false;
    }
    if (tokens.length === 0) {
      return true;
    }

    const group = classifyAssetGroup(asset);
    const haystack = normalizeTurkish(
      [
        asset.name,
        asset.brandStyle,
        asset.turkishMarket?.brand || '',
        asset.turkishMarket?.series || '',
        asset.turkishMarket?.retailChannel || '',
        asset.category,
        asset.subCategory || '',
        group.label,
        asset.aiSummary,
        asset.slug,
        asset.modelSource?.polyhavenId || '',
        ...asset.searchKeywords,
        ...asset.roomTags,
      ].join(' '),
    );

    return tokens.every((tok) => haystack.includes(tok));
  });

  if (filters.sortBy === 'width-asc') {
    return [...filtered].sort((a, b) => a.dimensionsCm.width - b.dimensionsCm.width);
  }
  if (filters.sortBy === 'width-desc') {
    return [...filtered].sort((a, b) => b.dimensionsCm.width - a.dimensionsCm.width);
  }
  if (filters.sortBy === 'poly-desc') {
    return [...filtered].sort((a, b) => b.polyEstimate - a.polyEstimate);
  }
  return filtered;
}

export function resolveFinish(
  asset: ArchitecturalAsset,
  finishId?: string,
  customFinish?: MaterialFinish,
): MaterialFinish {
  if (customFinish && (!finishId || finishId === customFinish.id)) {
    return customFinish;
  }
  if (finishId) {
    const found = asset.finishes.find((f) => f.id === finishId);
    if (found) return found;
  }
  const fallback = asset.finishes.find((f) => f.id === asset.defaultFinishId);
  return fallback ?? asset.finishes[0];
}

export function resolvePattern(
  asset: ArchitecturalAsset,
  patternId?: string,
): PatternVariant {
  if (patternId && asset.patterns?.length) {
    const found = asset.patterns.find((p) => p.id === patternId);
    if (found) return found;
  }
  const fallback = asset.patterns?.find((p) => p.id === asset.defaultPatternId);
  return (
    fallback ??
    asset.patterns?.[0] ?? {
      id: 'original_pbr',
      label: 'Orijinal PBR Doku',
      description: 'Standart PBR yüzey dokusu.',
      bumpScale: 1.0,
      roughnessDelta: 0,
    }
  );
}

export function formatSourceLabel(asset: ArchitecturalAsset): string {
  if (asset.sourceOrigin === 'room-scene') return 'Komple Oda Sahnesi · GLB';
  if (asset.modelSource?.provider === 'hf') return 'Hazır Mimari / Stüdyo GLB';
  if (asset.modelSource?.provider === 'abo') return 'İnegöl Modern / Stüdyo GLB';
  if (asset.modelSource?.provider === 'polyhaven') return 'Poly Haven CC0 · GLTF + BLEND';
  if (asset.modelSource?.provider === 'khronos') return 'Khronos PBR · GLB';
  return 'MimarKatalog CAD · GLB + BPY';
}

export function hexToLinearRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean.padEnd(6, '0').slice(0, 6);
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const toLin = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return [
    Number(toLin(r).toFixed(4)),
    Number(toLin(g).toFixed(4)),
    Number(toLin(b).toFixed(4)),
  ];
}

export function computeSceneLayout(
  items: SceneSelectionItem[],
): PlacedSceneEntry[] {
  const placed: PlacedSceneEntry[] = [];
  let floorCursorX = 0;
  let wallCursorX = 0;
  let exteriorCursorX = 0;
  let ceilingIndex = 0;
  let globalIdx = 0;

  for (const item of items) {
    const finish = resolveFinish(item.asset, item.finishId, item.customFinish);
    const qty = Math.max(1, Math.min(10, Math.floor(item.quantity || 1)));
    const wM = item.asset.dimensionsCm.width / 100;
    const dM = item.asset.dimensionsCm.depth / 100;

    for (let q = 0; q < qty; q++) {
      let x = 0;
      let y = 0;
      let z = 0;
      const rotationZDeg = 0;

      if (item.asset.placement === 'wall-mounted') {
        x = Number((wallCursorX + wM / 2).toFixed(3));
        y = 2.6;
        z = Number(((item.asset.dimensionsCm.mountHeight ?? 45) / 100).toFixed(3));
        wallCursorX += wM + 0.65;
      } else if (item.asset.placement === 'ceiling') {
        x = Number((ceilingIndex * 2.2).toFixed(3));
        y = 0;
        const dropM = item.asset.dimensionsCm.height / 100;
        const ceilingZ = (item.asset.dimensionsCm.mountHeight ?? 280) / 100;
        z = Number(Math.max(1.8, ceilingZ - dropM).toFixed(3));
        ceilingIndex += 1;
      } else if (item.asset.placement === 'exterior-ground') {
        x = Number((exteriorCursorX + wM / 2).toFixed(3));
        y = -4.5;
        z = 0;
        exteriorCursorX += wM + 1.2;
      } else {
        if (item.asset.archetype === 'modern_rug') {
          x = Number((floorCursorX + wM / 2).toFixed(3));
          y = 0;
          z = 0.004;
          floorCursorX += wM + 0.8;
        } else {
          x = Number((floorCursorX + wM / 2).toFixed(3));
          y = Number((-dM * 0.15).toFixed(3));
          z = 0;
          floorCursorX += wM + 0.75;
        }
      }

      placed.push({
        asset: item.asset,
        finish,
        index: globalIdx++,
        positionMeters: { x, y, z },
        rotationZDeg,
        addedBy: item.addedBy,
        note: item.note,
      });
    }
  }

  return placed;
}

export function formatDimensionsText(asset: ArchitecturalAsset): string {
  const { width, depth, height } = asset.dimensionsCm;
  return `${width}×${depth}×${height} cm`;
}

function sanitizePythonName(raw: string): string {
  return normalizeTurkish(raw)
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48);
}

/**
 * Generates an immediately runnable Blender 4.x Python (bpy) script.
 * - For ready-made Poly Haven CC0 & Khronos GLB assets: downloads and imports the real
 *   studio .glb/.gltf model (or .blend directly) into Blender in 1:1 metric scale.
 * - For specialized Turkish CAD models: builds clean multi-part metric geometry.
 */
export function generateBlenderPythonScript(
  asset: ArchitecturalAsset,
  finishId?: string,
  position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 },
  baseUrl = 'http://localhost:3000',
  customFinish?: MaterialFinish,
  patternId?: PatternId,
): string {
  const finish = resolveFinish(asset, finishId, customFinish);
  const pattern = resolvePattern(asset, patternId);
  const pyName = sanitizePythonName(asset.slug || asset.name);
  const w = Number((asset.dimensionsCm.width / 100).toFixed(3));
  const d = Number((asset.dimensionsCm.depth / 100).toFixed(3));
  const h = Number((asset.dimensionsCm.height / 100).toFixed(3));
  const tagsPy = JSON.stringify([asset.category, ...(asset.subCategory ? [asset.subCategory] : []), ...asset.searchKeywords.slice(0, 5)]);

  // Real External GLTF/GLB (HF Bathroom/SimReady/USDCraft/Objaverse, Poly Haven CC0, Khronos PBR, ABO Modern Studio) importer script
  if (
    asset.modelSource?.provider === 'polyhaven' ||
    asset.modelSource?.provider === 'khronos' ||
    asset.modelSource?.provider === 'abo' ||
    asset.modelSource?.provider === 'hf'
  ) {
    const rawUrl = asset.modelSource.gltfUrl || '';
    const fullGltfUrl = rawUrl.startsWith('http')
      ? rawUrl
      : `${baseUrl.replace(/\/$/, '')}${rawUrl}`;
    const blendUrl = asset.modelSource.blendUrl || '';
    const ext = fullGltfUrl.includes('/hf/glb/') || fullGltfUrl.endsWith('.glb') ? '.glb' : '.gltf';
    const [r1, g1, b1] = hexToLinearRgb(finish.primaryHex);
    const [r2, g2, b2] = hexToLinearRgb(finish.secondaryHex || finish.primaryHex);
    const [r3, g3, b3] = hexToLinearRgb(finish.accentHex || finish.secondaryHex || finish.primaryHex);

    const tactilePatterns = new Set<PatternId>([
      'boucle_linen',
      'oak_wood_grain',
      'marble_vein',
      'brushed_pvd',
      'fluted_ribbed',
      'microcement_matte',
    ]);
    const hasTactilePattern = tactilePatterns.has(pattern.id);
    const shouldOverrideMaterials = !finish.preserveOriginalTextures || hasTactilePattern;
    const isTriToneRug = !finish.preserveOriginalTextures && finish.paletteRecolorMode === 'tri-tone-rug';
    const isMultiPartRetail =
      !finish.preserveOriginalTextures &&
      finish.paletteRecolorMode === 'multi-part-retail' &&
      Boolean(finish.partFinishes);

    const tactileNodeSnippet =
      pattern.id === 'oak_wood_grain' || pattern.id === 'marble_vein' || pattern.id === 'fluted_ribbed'
        ? `
            # Prosedürel mimari doku düğümü: ${pattern.label} (${pattern.id})
            tex_coord = mat.node_tree.nodes.new("ShaderNodeTexCoord")
            wave = mat.node_tree.nodes.new("ShaderNodeTexWave")
            wave.wave_type = "BANDS"
            wave.bands_direction = "${pattern.id === 'fluted_ribbed' ? 'X' : 'Y'}"
            wave.inputs["Scale"].default_value = ${pattern.id === 'fluted_ribbed' ? '26.0' : pattern.id === 'marble_vein' ? '3.5' : '8.5'}
            wave.inputs["Distortion"].default_value = ${pattern.id === 'fluted_ribbed' ? '0.0' : pattern.id === 'marble_vein' ? '9.5' : '4.2'}
            bump = mat.node_tree.nodes.new("ShaderNodeBump")
            bump.inputs["Strength"].default_value = ${pattern.id === 'fluted_ribbed' ? '0.45' : pattern.id === 'marble_vein' ? '0.14' : '0.26'}
            mat.node_tree.links.new(tex_coord.outputs["Object"], wave.inputs["Vector"])
            mat.node_tree.links.new(wave.outputs["Fac"], bump.inputs["Height"])
            mat.node_tree.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])`
        : hasTactilePattern
          ? `
            # Prosedürel mimari doku düğümü: ${pattern.label} (${pattern.id})
            tex_coord = mat.node_tree.nodes.new("ShaderNodeTexCoord")
            noise = mat.node_tree.nodes.new("ShaderNodeTexNoise")
            noise.inputs["Scale"].default_value = ${pattern.id === 'boucle_linen' ? '64.0' : pattern.id === 'brushed_pvd' ? '95.0' : '22.0'}
            noise.inputs["Detail"].default_value = 8.0
            bump = mat.node_tree.nodes.new("ShaderNodeBump")
            bump.inputs["Strength"].default_value = ${pattern.id === 'boucle_linen' ? '0.32' : pattern.id === 'brushed_pvd' ? '0.12' : '0.22'}
            mat.node_tree.links.new(tex_coord.outputs["Object"], noise.inputs["Vector"])
            mat.node_tree.links.new(noise.outputs["Fac"], bump.inputs["Height"])
            mat.node_tree.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])`
          : '';

    const partSpecs = finish.partFinishes;
    const [cr, cg, cb] = partSpecs?.ceramic
      ? hexToLinearRgb(partSpecs.ceramic.hex)
      : [r2, g2, b2];

    const colorAssignSnippet = isTriToneRug
      ? `
            # 3 Tonlu Moda Tasarım Halı Kombinasyonu (${finish.label}: ${finish.primaryHex} / ${finish.secondaryHex} / ${finish.accentHex})
            base_links = list(bsdf.inputs["Base Color"].links)
            if base_links:
                src_socket = base_links[0].from_socket
                for lnk in base_links:
                    mat.node_tree.links.remove(lnk)
                rgb_bw = mat.node_tree.nodes.new("ShaderNodeRGBToBW")
                ramp = mat.node_tree.nodes.new("ShaderNodeValToRGB")
                ramp.color_ramp.elements[0].position = 0.12
                ramp.color_ramp.elements[0].color = (${r3}, ${g3}, ${b3}, 1.0)
                ramp.color_ramp.elements[1].position = 0.88
                ramp.color_ramp.elements[1].color = (${r1}, ${g1}, ${b1}, 1.0)
                mid_el = ramp.color_ramp.elements.new(0.50)
                mid_el.color = (${r2}, ${g2}, ${b2}, 1.0)
                mat.node_tree.links.new(src_socket, rgb_bw.inputs["Color"])
                mat.node_tree.links.new(rgb_bw.outputs["Val"], ramp.inputs["Fac"])
                mat.node_tree.links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
            else:
                bsdf.inputs["Base Color"].default_value = (${r1}, ${g1}, ${b1}, 1.0)
            if "Metallic" in bsdf.inputs:
                bsdf.inputs["Metallic"].default_value = 0.0
            if "Roughness" in bsdf.inputs:
                bsdf.inputs["Roughness"].default_value = ${Number(Math.min(0.98, Math.max(0.78, finish.roughness + pattern.roughnessDelta)).toFixed(2))}`
      : isMultiPartRetail && partSpecs
        ? `
            # Çok Parçalı Gerçek Satış Kombinasyonu (${finish.label} | ${finish.comboSummary || ''})
            if "${finish.comboRole || ''}" == "botanical_plant" and any(k in low_name for k in ("leaf", "leaves", "foliage", "branch", "stem", "fern", "palm", "flower", "soil", "dirt", "bark", "moss", "frond", "twig")):
                continue
            is_metal_part = any(k in low_name for k in ("chrome", "metal", "steel", "brass", "gold", "handle", "hinge", "pivot", "faucet", "drain", "valve", "dial", "lock", "rail")) or (bsdf.inputs.get("Metallic") and bsdf.inputs["Metallic"].default_value > 0.55)
            is_ceramic_part = any(k in low_name for k in ("ceramic", "porcelain", "sink", "basin", "acrylic", "tray", "paper", "roll", "white", "mattress", "sheet", "pillow", "bedding", "shade", "opal", "globe", "bulb", "diffuser"))
            is_secondary_part = any(k in low_name for k in ("wood", "leg", "base", "frame", "seat", "lid", "plastic", "knob", "rubber", "nozzle", "panel", "screen", "cushion", "basket", "counter"))
            if is_ceramic_part and not is_metal_part and "${finish.comboRole || ''}" in ("vanity", "laundry_cabinet", "shower_cabin", "towel_hardware", "bathtub", "bed_frame", "lighting_fixture"):
                part_rgb, part_m, part_r = (${cr}, ${cg}, ${cb}, 1.0), ${Number((partSpecs.ceramic?.metalness ?? partSpecs.secondary.metalness).toFixed(2))}, ${Number((partSpecs.ceramic?.roughness ?? partSpecs.secondary.roughness).toFixed(2))}
            elif is_metal_part and "${finish.comboRole || ''}" not in ("faucet_hardware", "towel_hardware", "shower_cabin", "appliance", "lighting_fixture"):
                part_rgb, part_m, part_r = (${r3}, ${g3}, ${b3}, 1.0), ${Number(partSpecs.accent.metalness.toFixed(2))}, ${Number(partSpecs.accent.roughness.toFixed(2))}
            elif is_secondary_part:
                part_rgb, part_m, part_r = (${r2}, ${g2}, ${b2}, 1.0), ${Number(partSpecs.secondary.metalness.toFixed(2))}, ${Number(partSpecs.secondary.roughness.toFixed(2))}
            else:
                part_rgb, part_m, part_r = (${r1}, ${g1}, ${b1}, 1.0), ${Number(partSpecs.primary.metalness.toFixed(2))}, ${Number(Math.min(0.98, Math.max(0.05, partSpecs.primary.roughness + pattern.roughnessDelta)).toFixed(2))}
            for lnk in list(bsdf.inputs["Base Color"].links):
                mat.node_tree.links.remove(lnk)
            bsdf.inputs["Base Color"].default_value = part_rgb
            if "Metallic" in bsdf.inputs:
                bsdf.inputs["Metallic"].default_value = part_m
            if "Roughness" in bsdf.inputs:
                bsdf.inputs["Roughness"].default_value = part_r`
        : !finish.preserveOriginalTextures
          ? `
            for lnk in list(bsdf.inputs["Base Color"].links):
                mat.node_tree.links.remove(lnk)
            bsdf.inputs["Base Color"].default_value = (${r1}, ${g1}, ${b1}, 1.0)
            if "Metallic" in bsdf.inputs:
                bsdf.inputs["Metallic"].default_value = ${Number(finish.metalness.toFixed(2))}
            if "Roughness" in bsdf.inputs:
                bsdf.inputs["Roughness"].default_value = ${Number(Math.min(0.98, Math.max(0.05, finish.roughness + pattern.roughnessDelta)).toFixed(2))}`
          : `
            if "Roughness" in bsdf.inputs:
                bsdf.inputs["Roughness"].default_value = min(0.98, max(0.05, bsdf.inputs["Roughness"].default_value + ${Number(pattern.roughnessDelta.toFixed(2))}))`;

    const applyOverrideBlock = shouldOverrideMaterials
      ? `
    # Seçili mimari renk & doku (${finish.label} · ${finish.primaryHex} | Doku: ${pattern.label}) Principled BSDF düğümlerine uygulanıyor
    for obj in imported:
        if obj.type != "MESH" or not obj.data:
            continue
        for mat in obj.data.materials:
            if not mat or not mat.use_nodes:
                continue
            low_name = mat.name.lower()
            if any(k in low_name for k in ("glass", "cam", "mirror", "ayna", "water", "emission", "indicator", "plastic__red", "plastic__blue")):
                continue
            bsdf = next((n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
            if not bsdf:
                continue
            alpha_inp = bsdf.inputs.get("Alpha")
            trans_inp = bsdf.inputs.get("Transmission Weight") or bsdf.inputs.get("Transmission")
            if (alpha_inp and alpha_inp.default_value < 0.8) or (trans_inp and trans_inp.default_value > 0.2):
                continue${colorAssignSnippet}${tactileNodeSnippet}
`
      : '';

    const roomExtractBlock =
      asset.category === 'Oda Tasarımları'
        ? `
    # Oda Tasarımı Parça Ayıklama Yardımı (Yapay Zeka / Mimar için alt mesh envanteri)
    extracted_parts = [obj.name for obj in imported if obj.type == "MESH"]
    print(f"MimarKatalog Oda Envanteri ({len(extracted_parts)} parça): {extracted_parts[:20]}")
    # Örnek ayıklama: tek bir mobilyayı ayırmak için obj.parent = None yapıp yeni koleksiyona taşıyabilirsiniz.
`
        : '';

    return `"""
MimarKatalog — Blender 4.x Hazır 3D Model İçe Aktarıcı (${asset.modelSource.license})
Varlık: ${asset.name} (${asset.brandStyle})
Kategori: ${asset.category}${asset.subCategory ? ` / ${asset.subCategory}` : ''} | Gerçek Ölçü: ${asset.dimensionsCm.width}x${asset.dimensionsCm.depth}x${asset.dimensionsCm.height} cm
Poligon: ~${asset.polyEstimate} tri | Kaplama: ${finish.label} (${finish.primaryHex}) | Doku: ${pattern.label}
${blendUrl ? `Doğrudan .blend: ${blendUrl}` : `Doğrudan .glb: ${fullGltfUrl}`}
Kullanım: Blender > Scripting > Run Script veya Blender MCP execute_blender_code
"""
import bpy
import os
import tempfile
import urllib.request

def import_${pyName}(origin=(${position.x}, ${position.y}, ${position.z})):
    col_name = "MimarKatalog_${pyName}"
    col = bpy.data.collections.get(col_name) or bpy.data.collections.new(col_name)
    if col.name not in bpy.context.scene.collection.children:
        bpy.context.scene.collection.children.link(col)

    model_url = ${JSON.stringify(fullGltfUrl)}
    tmp_path = os.path.join(tempfile.gettempdir(), "${pyName}${ext}")
    print(f"MimarKatalog: Hazır 3D model indiriliyor -> {model_url}")
    urllib.request.urlretrieve(model_url, tmp_path)

    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=tmp_path)
    imported = [obj for obj in bpy.data.objects if obj not in before]

    root = bpy.data.objects.new("${pyName}_Root", None)
    root.empty_display_type = "PLAIN_AXES"
    root.empty_display_size = 0.25
    root.location = origin
    col.objects.link(root)

    for obj in imported:
        for c in list(obj.users_collection):
            c.objects.unlink(obj)
        col.objects.link(obj)
        if obj.parent is None:
            obj.parent = root
${applyOverrideBlock}${roomExtractBlock}
    try:
        col.asset_mark()
        col.asset_data.description = ${JSON.stringify(asset.aiSummary)}
        for tag_text in ${tagsPy}:
            col.asset_data.tags.new(tag_text)
    except Exception:
        pass

    print("MimarKatalog: '${asset.name}' (${finish.label} / ${pattern.label}) hazır PBR 3D modeli 1:1 metrik ölçekle sahneye eklendi.")
    return root

if __name__ == "__main__":
    import_${pyName}()
`;
  }

  // Specialized Turkish CAD Asset Builder (includes Pinterest architectural laundry cabinets)
  const [r1, g1, b1] = hexToLinearRgb(finish.primaryHex);
  const [r2, g2, b2] = hexToLinearRgb(finish.secondaryHex);
  const [r3, g3, b3] = hexToLinearRgb(finish.accentHex);
  const geometryBody = buildArchetypePythonBody(asset.archetype, w, d, h);
  const isLaundry = asset.archetype.startsWith('laundry_');
  const tactileCadSnippet =
    pattern.id === 'fluted_ribbed' || pattern.id === 'oak_wood_grain' || pattern.id === 'marble_vein'
      ? `
    # Seçili dokunsal mimari doku (${pattern.label}) ana dolap malzemesine bağlanıyor
    if mat_primary.use_nodes:
        bsdf_p = mat_primary.node_tree.nodes.get("Principled BSDF")
        tc = mat_primary.node_tree.nodes.new("ShaderNodeTexCoord")
        wv = mat_primary.node_tree.nodes.new("ShaderNodeTexWave")
        wv.wave_type = "BANDS"
        wv.bands_direction = "${pattern.id === 'fluted_ribbed' ? 'X' : 'Y'}"
        wv.inputs["Scale"].default_value = ${pattern.id === 'fluted_ribbed' ? '28.0' : pattern.id === 'marble_vein' ? '3.5' : '9.0'}
        wv.inputs["Distortion"].default_value = ${pattern.id === 'fluted_ribbed' ? '0.0' : pattern.id === 'marble_vein' ? '9.0' : '4.0'}
        bp = mat_primary.node_tree.nodes.new("ShaderNodeBump")
        bp.inputs["Strength"].default_value = ${pattern.id === 'fluted_ribbed' ? '0.45' : '0.22'}
        mat_primary.node_tree.links.new(tc.outputs["Object"], wv.inputs["Vector"])
        mat_primary.node_tree.links.new(wv.outputs["Fac"], bp.inputs["Height"])
        mat_primary.node_tree.links.new(bp.outputs["Normal"], bsdf_p.inputs["Normal"])`
      : '';

  return `"""
MimarKatalog — Blender 4.x Türk Mimari CAD Varlık Oluşturucu
Varlık: ${asset.name} (${asset.brandStyle})
Kategori: ${asset.category} | Ölçü: ${asset.dimensionsCm.width}x${asset.dimensionsCm.depth}x${asset.dimensionsCm.height} cm
Kaplama: ${finish.label} (${finish.primaryHex}) | Doku: ${pattern.label} | Render Motoru: Cycles / EEVEE
Not: Yüksek çözünürlüklü tambur/hasır/shaker mesh için 3D Stüdyo'dan ".GLB İndir" butonunu da kullanabilirsiniz.
"""
import bpy
import math

def make_pbr_material(name, rgb, roughness, metallic=0.0, emission=0.0):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (rgb[0], rgb[1], rgb[2], 1.0)
        bsdf.inputs["Roughness"].default_value = roughness
        bsdf.inputs["Metallic"].default_value = metallic
        if emission > 0.0 and "Emission Strength" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = (rgb[0], rgb[1], rgb[2], 1.0)
            bsdf.inputs["Emission Strength"].default_value = emission
    return mat

def add_part(col, name, kind, loc, scale, mat, bevel=0.015, rot=(0, 0, 0)):
    if kind == "cube":
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc, rotation=rot)
    elif kind == "cylinder":
        bpy.ops.mesh.primitive_cylinder_add(vertices=36, radius=0.5, depth=1.0, location=loc, rotation=rot)
    else:
        bpy.ops.mesh.primitive_uv_sphere_add(segments=28, ring_count=18, radius=0.5, location=loc, rotation=rot)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel > 0 and kind == "cube":
        mod = obj.modifiers.new(name="Bevel", type="BEVEL")
        mod.width = bevel
        mod.segments = 3
    if len(obj.data.materials) == 0:
        obj.data.materials.append(mat)
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    col.objects.link(obj)
    return obj

def build_${pyName}(origin=(${position.x}, ${position.y}, ${position.z})):
    col_name = "MimarKatalog_${pyName}"
    col = bpy.data.collections.get(col_name) or bpy.data.collections.new(col_name)
    if col.name not in bpy.context.scene.collection.children:
        bpy.context.scene.collection.children.link(col)

    mat_primary = make_pbr_material("${pyName}_Ana", (${r1}, ${g1}, ${b1}), ${finish.roughness}, ${finish.metalness})
    mat_secondary = make_pbr_material("${pyName}_Ikincil", (${r2}, ${g2}, ${b2}), ${Math.min(0.9, Number((finish.roughness * 0.7).toFixed(2)))}, ${Math.min(0.95, finish.metalness + 0.15)})
    mat_accent = make_pbr_material("${pyName}_Detay", (${r3}, ${g3}, ${b3}), 0.32, ${isLaundry ? 0.82 : 0.25}, ${asset.archetype === 'bioclimatic_pergola' ? 4.0 : 0.0})
    mat_appliance = make_pbr_material("${pyName}_BeyazEsya", (0.93, 0.94, 0.96), 0.18, 0.08)
    mat_glass = make_pbr_material("${pyName}_FumeCam", (0.04, 0.05, 0.07), 0.06, 0.15)
    mat_basket = make_pbr_material("${pyName}_HasirSepet", (0.58, 0.41, 0.23), 0.84, 0.0)
${tactileCadSnippet}

    root = bpy.data.objects.new("${pyName}_Root", None)
    root.empty_display_type = "PLAIN_AXES"
    root.empty_display_size = 0.25
    root.location = origin
    col.objects.link(root)

    parts = []
${geometryBody}

    for p in parts:
        p.parent = root

    try:
        col.asset_mark()
        col.asset_data.description = ${JSON.stringify(asset.aiSummary)}
        for tag_text in ${tagsPy}:
            col.asset_data.tags.new(tag_text)
    except Exception:
        pass

    return root

if __name__ == "__main__":
    build_${pyName}()
`;
}

function buildArchetypePythonBody(
  archetype: ArchitecturalAsset['archetype'],
  w: number,
  d: number,
  h: number,
): string {
  switch (archetype) {
    case 'wall_hung_toilet':
      return `    # D-formlu tek parça asma klozet gövdesi + oval soft-close kapak + Geberit Sigma panel
    parts.append(add_part(col, "Klozet_D_Govde", "cylinder", (0, ${(-d * 0.45).toFixed(3)}, 0), (${w}, ${(d * 0.92).toFixed(3)}, ${h}), mat_primary, 0.0))
    parts.append(add_part(col, "Klozet_SoftClose_Kapak", "cylinder", (0, ${(-d * 0.46).toFixed(3)}, ${(h * 0.52).toFixed(3)}), (${(w * 0.98).toFixed(3)}, ${(d * 0.90).toFixed(3)}, 0.024), mat_primary, 0.0))
    parts.append(add_part(col, "Geberit_Panel", "cube", (0, -0.012, 0.64), (0.246, 0.012, 0.164), mat_secondary, 0.004))
    parts.append(add_part(col, "Buton_Buyuk", "cube", (-0.04, -0.02, 0.64), (0.095, 0.006, 0.068), mat_secondary, 0.002))
    parts.append(add_part(col, "Buton_Eko", "cube", (0.055, -0.02, 0.64), (0.054, 0.006, 0.068), mat_secondary, 0.002))`;

    case 'towel_warmer':
      return `    # İki dikey kollektör + 5+4+4 gruplu yassı yatay barlar + duvar konsolları
    parts.append(add_part(col, "Kollektor_Sol", "cube", (${(-w * 0.46).toFixed(3)}, -0.06, 0), (0.036, 0.036, ${h}), mat_primary, 0.004))
    parts.append(add_part(col, "Kollektor_Sag", "cube", (${(w * 0.46).toFixed(3)}, -0.06, 0), (0.036, 0.036, ${h}), mat_primary, 0.004))
    bar_offsets = [-0.46, -0.40, -0.34, -0.28, -0.22, -0.06, 0.0, 0.06, 0.12, 0.28, 0.34, 0.40, 0.46]
    for idx, rz in enumerate(bar_offsets):
        parts.append(add_part(col, f"Yatay_Bar_{idx+1}", "cube", (0, -0.06, rz * ${h}), (${(w * 0.92).toFixed(3)}, 0.016, 0.038), mat_primary, 0.003))`;

    case 'modern_rug':
      return `    # 200x290 cm High-Low kabartma taban + 4.5 cm kısa kenar püskül şeritleri
    parts.append(add_part(col, "Hali_Ana_Dokuma", "cube", (0, 0, 0.009), (${w}, ${d}, 0.018), mat_primary, 0.004))
    parts.append(add_part(col, "Puskul_On", "cube", (0, ${(-d / 2 - 0.022).toFixed(3)}, 0.004), (${(w * 0.98).toFixed(3)}, 0.045, 0.006), mat_secondary, 0.001))
    parts.append(add_part(col, "Puskul_Arka", "cube", (0, ${(d / 2 + 0.022).toFixed(3)}, 0.004), (${(w * 0.98).toFixed(3)}, 0.045, 0.006), mat_secondary, 0.001))`;

    case 'bioclimatic_pergola':
      return `    # 4 köşe antrasit kolon + çevre kiriş çerçevesi + 16 eğimli alüminyum lamel + LED şerit
    for sx in (-1, 1):
        for sy in (-1, 1):
            parts.append(add_part(col, f"Kolon_{sx}_{sy}", "cube", (sx * ${(w * 0.48).toFixed(3)}, sy * ${(d * 0.48).toFixed(3)}, ${(h * 0.5).toFixed(3)}), (0.14, 0.14, ${h}), mat_primary, 0.008))
    parts.append(add_part(col, "Kiris_On", "cube", (0, ${(-d * 0.48).toFixed(3)}, ${(h - 0.11).toFixed(3)}), (${w}, 0.16, 0.22), mat_primary, 0.008))
    parts.append(add_part(col, "Kiris_Arka", "cube", (0, ${(d * 0.48).toFixed(3)}, ${(h - 0.11).toFixed(3)}), (${w}, 0.16, 0.22), mat_primary, 0.008))
    for i in range(16):
        ly = ${(-d * 0.42).toFixed(3)} + i * ${(d * 0.84 / 15).toFixed(3)}
        parts.append(add_part(col, f"Lamel_{i+1}", "cube", (0, ly, ${(h - 0.06).toFixed(3)}), (${(w - 0.26).toFixed(3)}, 0.14, 0.028), mat_secondary, 0.003, (math.radians(18), 0, 0)))`;

    case 'laundry_side_by_side_elevated':
    case 'laundry_side_by_side_counter':
    case 'laundry_villa_quad_wall':
      return `    # Yan Yana / Villa Çamaşır Odası Dolabı (Blender Z-Yukarı 1:1 Metrik)
    parts.append(add_part(col, "Baza_Gomme", "cube", (0, 0.02, 0.05), (${w}, ${(d - 0.05).toFixed(3)}, 0.10), mat_secondary, 0.002))
    parts.append(add_part(col, "Dolap_Yan_Sol", "cube", (${(-w / 2 + 0.012).toFixed(3)}, 0, ${(h / 2 + 0.05).toFixed(3)}), (0.024, ${d}, ${(h - 0.1).toFixed(3)}), mat_primary, 0.003))
    parts.append(add_part(col, "Dolap_Yan_Sag", "cube", (${(w / 2 - 0.012).toFixed(3)}, 0, ${(h / 2 + 0.05).toFixed(3)}), (0.024, ${d}, ${(h - 0.1).toFixed(3)}), mat_primary, 0.003))
    parts.append(add_part(col, "Alt_Cekmece_Pedestal", "cube", (0, 0, 0.36), (${(w - 0.048).toFixed(3)}, ${d}, 0.52), mat_primary, 0.004))
    parts.append(add_part(col, "Surgu_Sepet_Tepsisi", "cube", (${(w * 0.24).toFixed(3)}, ${(-d * 0.5 - 0.14).toFixed(3)}, 0.66), (0.60, 0.48, 0.032), mat_primary, 0.003))
    parts.append(add_part(col, "Hasir_Camasir_Sepeti", "cube", (${(w * 0.24).toFixed(3)}, ${(-d * 0.5 - 0.14).toFixed(3)}, 0.79), (0.44, 0.34, 0.22), mat_basket, 0.01))
    parts.append(add_part(col, "Camasir_Makinesi_Sol", "cube", (${(-w * 0.24).toFixed(3)}, -0.01, 1.15), (0.595, 0.60, 0.845), mat_appliance, 0.008))
    parts.append(add_part(col, "Tambur_Cam_Sol", "cylinder", (${(-w * 0.24).toFixed(3)}, -0.32, 1.11), (0.44, 0.44, 0.04), mat_glass, 0.0, (math.radians(90), 0, 0)))
    parts.append(add_part(col, "Kurutma_Makinesi_Sag", "cube", (${(w * 0.24).toFixed(3)}, -0.01, 1.15), (0.595, 0.60, 0.845), mat_appliance, 0.008))
    parts.append(add_part(col, "Tambur_Cam_Sag", "cylinder", (${(w * 0.24).toFixed(3)}, -0.32, 1.11), (0.44, 0.44, 0.04), mat_glass, 0.0, (math.radians(90), 0, 0)))
    parts.append(add_part(col, "Ust_Depolama_Dolabi", "cube", (0, 0, ${(h - 0.38).toFixed(3)}), (${(w - 0.048).toFixed(3)}, ${d}, 0.72), mat_primary, 0.004))`;

    case 'laundry_stacked_tower_hamper':
    case 'laundry_stacked_sink_combo':
    case 'laundry_utility_broom_closet':
    case 'laundry_clean_dirty_sorter':
    case 'laundry_compact_banyo_tower':
      return `    # Üst Üste / Kirli Sepetli / Eviyeli Çamaşır Boy Dolabı (Blender Z-Yukarı 1:1 Metrik)
    parts.append(add_part(col, "Baza_Gomme", "cube", (0, 0.02, 0.05), (${w}, ${(d - 0.05).toFixed(3)}, 0.10), mat_secondary, 0.002))
    parts.append(add_part(col, "Dolap_Yan_Sol", "cube", (${(-w / 2 + 0.012).toFixed(3)}, 0, ${(h / 2 + 0.05).toFixed(3)}), (0.024, ${d}, ${(h - 0.1).toFixed(3)}), mat_primary, 0.003))
    parts.append(add_part(col, "Dolap_Yan_Sag", "cube", (${(w / 2 - 0.012).toFixed(3)}, 0, ${(h / 2 + 0.05).toFixed(3)}), (0.024, ${d}, ${(h - 0.1).toFixed(3)}), mat_primary, 0.003))
    parts.append(add_part(col, "Dolap_Arka_Panel", "cube", (0, ${(d / 2 - 0.01).toFixed(3)}, ${(h / 2 + 0.05).toFixed(3)}), (${(w - 0.048).toFixed(3)}, 0.02, ${(h - 0.1).toFixed(3)}), mat_secondary, 0.002))
    parts.append(add_part(col, "Alt_Camasir_Makinesi", "cube", (${(-w * 0.18).toFixed(3)}, -0.01, 0.54), (0.60, 0.59, 0.845), mat_appliance, 0.008))
    parts.append(add_part(col, "Tambur_Alt", "cylinder", (${(-w * 0.18).toFixed(3)}, -0.31, 0.50), (0.44, 0.44, 0.04), mat_glass, 0.0, (math.radians(90), 0, 0)))
    parts.append(add_part(col, "Orta_Surgu_Sepet_Rafi", "cube", (${(-w * 0.18).toFixed(3)}, ${(-d * 0.5 - 0.11).toFixed(3)}, 1.00), (0.62, 0.46, 0.032), mat_primary, 0.003))
    parts.append(add_part(col, "Ust_Kurutma_Makinesi", "cube", (${(-w * 0.18).toFixed(3)}, -0.01, 1.48), (0.60, 0.59, 0.845), mat_appliance, 0.008))
    parts.append(add_part(col, "Tambur_Ust", "cylinder", (${(-w * 0.18).toFixed(3)}, -0.31, 1.44), (0.44, 0.44, 0.04), mat_glass, 0.0, (math.radians(90), 0, 0)))
    parts.append(add_part(col, "Kirli_Sepet_Haznesi", "cube", (${(w * 0.25).toFixed(3)}, -0.06, 0.64), (${Math.max(0.38, w * 0.36).toFixed(3)}, 0.44, 0.52), mat_basket, 0.01, (math.radians(-18), 0, 0)))
    parts.append(add_part(col, "Ust_Deterjan_Dolabi", "cube", (0, 0, ${(h - 0.24).toFixed(3)}), (${(w - 0.048).toFixed(3)}, ${d}, 0.42), mat_primary, 0.004))`;

    case 'tr_alaturka_squat_toilet':
      return `    # VitrA Arkitekt 50x60 cm Alaturka Hela Taşı (Blender Z-Yukarı 1:1 Metrik)
    parts.append(add_part(col, "Alaturka_Dis_Cercesi", "cube", (0, 0, ${(h - 0.015).toFixed(3)}), (${w}, ${d}, 0.03), mat_primary, 0.008))
    parts.append(add_part(col, "Alaturka_Alt_Hazne", "cylinder", (0, 0, ${(h * 0.45).toFixed(3)}), (${(w * 0.72).toFixed(3)}, ${(d * 0.78).toFixed(3)}, ${(h * 0.85).toFixed(3)}), mat_primary, 0.0))
    parts.append(add_part(col, "Ayak_Ped_Sol", "cube", (${(-w * 0.34).toFixed(3)}, -0.02, ${(h + 0.004).toFixed(3)}), (0.105, 0.27, 0.01), mat_secondary, 0.003))
    parts.append(add_part(col, "Ayak_Ped_Sag", "cube", (${(w * 0.34).toFixed(3)}, -0.02, ${(h + 0.004).toFixed(3)}), (0.105, 0.27, 0.01), mat_secondary, 0.003))
    parts.append(add_part(col, "Arka_Su_Davlumbazi", "cylinder", (0, ${(d * 0.38).toFixed(3)}, ${(h + 0.03).toFixed(3)}), (0.14, 0.14, 0.09), mat_primary, 0.0))
    parts.append(add_part(col, "Krom_Sifon_Halka", "cylinder", (0, -0.02, 0.045), (0.108, 0.108, 0.012), mat_accent, 0.0))`;

    case 'tr_geberit_flush_plate':
      return `    # Geberit Sigma20 / Sigma30 Gömme Rezervuar Kumanda Paneli (24.6x16.4 cm)
    parts.append(add_part(col, "Geberit_Ana_Plaka", "cube", (0, -0.006, 0.082), (0.246, 0.012, 0.164), mat_primary, 0.003))
    parts.append(add_part(col, "Geberit_Buyuk_Tus_6L", "cylinder", (-0.044, -0.012, 0.088), (0.076, 0.076, 0.006), mat_secondary, 0.0, (math.radians(90), 0, 0)))
    parts.append(add_part(col, "Geberit_Kucuk_Tus_3L", "cylinder", (0.052, -0.012, 0.088), (0.052, 0.052, 0.006), mat_secondary, 0.0, (math.radians(90), 0, 0)))
    parts.append(add_part(col, "Geberit_Tasarim_Serit", "cube", (0, -0.012, 0.044), (0.174, 0.005, 0.007), mat_accent, 0.001))`;

    case 'tr_schuko_socket':
      return `    # Viko Karre / Schneider Asfora Avrupa Tipi (Type F Schuko) Priz & Anahtar
    parts.append(add_part(col, "Dis_Cerceve", "cube", (0, -0.005, ${(h / 2).toFixed(3)}), (${w}, 0.011, ${h}), mat_primary, 0.002))
    parts.append(add_part(col, "Ic_Kapak_Modulu", "cube", (0, -0.011, ${(h / 2).toFixed(3)}), (${(w * 0.72).toFixed(3)}, 0.006, ${(h * 0.68).toFixed(3)}), mat_secondary, 0.001))
    parts.append(add_part(col, "Schuko_Topraklama_Ust", "cube", (0, -0.008, ${(h / 2 + 0.019).toFixed(3)}), (0.005, 0.014, 0.003), mat_accent, 0.0))
    parts.append(add_part(col, "Schuko_Topraklama_Alt", "cube", (0, -0.008, ${(h / 2 - 0.019).toFixed(3)}), (0.005, 0.014, 0.003), mat_accent, 0.0))`;

    case 'tr_branded_dishwasher':
      return `    # Bosch Serie 6 / Siemens iQ500 / Beko BM 6046 60 cm Ankastre Bulaşık Makinesi
    parts.append(add_part(col, "Alt_Baza", "cube", (0, 0.025, 0.05), (${(w - 0.01).toFixed(3)}, ${(d - 0.06).toFixed(3)}, 0.10), mat_secondary, 0.002))
    parts.append(add_part(col, "Ana_Govde", "cube", (0, 0.015, ${(0.1 + (h - 0.1) / 2).toFixed(3)}), (${w}, ${(d - 0.03).toFixed(3)}, ${(h - 0.1).toFixed(3)}), mat_primary, 0.004))
    parts.append(add_part(col, "On_Kapak", "cube", (0, ${(-d / 2 + 0.014).toFixed(3)}, 0.405), (${(w - 0.006).toFixed(3)}, 0.026, 0.60), mat_primary, 0.003))
    parts.append(add_part(col, "Marka_LED_Kontrol_Paneli", "cube", (0, ${(-d / 2 + 0.014).toFixed(3)}, ${(h - 0.072).toFixed(3)}), (${(w - 0.006).toFixed(3)}, 0.028, 0.136), mat_glass, 0.002))
    parts.append(add_part(col, "Paslanmaz_Kulp", "cube", (0, ${(-d / 2 - 0.018).toFixed(3)}, 0.665), (${(w - 0.12).toFixed(3)}, 0.016, 0.016), mat_accent, 0.002))`;

    case 'tr_branded_builtin_oven':
      return `    # Arçelik 9620 Serisi 60x60 cm Ankastre Cam Fırın
    parts.append(add_part(col, "Firin_Kasa", "cube", (0, 0.02, ${(h / 2).toFixed(3)}), (${(w - 0.04).toFixed(3)}, ${(d - 0.04).toFixed(3)}, ${(h - 0.025).toFixed(3)}), mat_secondary, 0.003))
    parts.append(add_part(col, "Arcelik_Kontrol_Paneli", "cube", (0, ${(-d / 2 + 0.014).toFixed(3)}, ${(h - 0.058).toFixed(3)}), (${w}, 0.028, 0.115), mat_primary, 0.002))
    parts.append(add_part(col, "Dugme_Sol", "cylinder", (${(-w * 0.31).toFixed(3)}, ${(-d / 2 - 0.012).toFixed(3)}, ${(h - 0.058).toFixed(3)}), (0.044, 0.044, 0.022), mat_accent, 0.0, (math.radians(90), 0, 0)))
    parts.append(add_part(col, "Dugme_Sag", "cylinder", (${(w * 0.31).toFixed(3)}, ${(-d / 2 - 0.012).toFixed(3)}, ${(h - 0.058).toFixed(3)}), (0.044, 0.044, 0.022), mat_accent, 0.0, (math.radians(90), 0, 0)))
    parts.append(add_part(col, "Fume_Cam_Kapak", "cube", (0, ${(-d / 2 + 0.012).toFixed(3)}, 0.24), (${w}, 0.026, 0.476), mat_glass, 0.003))
    parts.append(add_part(col, "Boru_Kulp", "cylinder", (0, ${(-d / 2 - 0.036).toFixed(3)}, 0.44), (0.022, 0.022, ${(w - 0.08).toFixed(3)}), mat_accent, 0.0, (0, math.radians(90), 0)))`;

    case 'tr_pullout_kitchen_faucet':
      return `    # E.C.A. / Artema 48 cm Spiralli (Pull-Out) Yaylı Mutfak Bataryası
    parts.append(add_part(col, "Batarya_Govde", "cylinder", (0, 0.05, 0.092), (0.048, 0.048, 0.17), mat_primary, 0.0))
    parts.append(add_part(col, "Kumanda_Kolu", "cylinder", (0.044, 0.05, 0.132), (0.012, 0.012, 0.095), mat_primary, 0.0))
    parts.append(add_part(col, "Spiral_Yay_Boyun", "cylinder", (0, 0.05, 0.31), (0.032, 0.032, 0.28), mat_accent, 0.0))
    parts.append(add_part(col, "Manyetik_Tutucu_Kol", "cylinder", (0, -0.055, 0.275), (0.012, 0.012, 0.21), mat_primary, 0.0, (math.radians(90), 0, 0)))
    parts.append(add_part(col, "El_Sprey_Basligi", "cylinder", (0, -0.178, 0.228), (0.04, 0.04, 0.105), mat_secondary, 0.0))`;

    case 'tr_condensing_boiler':
      return `    # Tam Yoğuşmalı Doğalgaz Kombisi (${Math.round(w * 100)}x${Math.round(d * 100)}x${Math.round(h * 100)} cm)
    parts.append(add_part(col, "Kombi_Govde", "cube", (0, 0, ${(0.12 + (h - 0.12) / 2).toFixed(3)}), (${w}, ${d}, ${(h - 0.12).toFixed(3)}), mat_primary, 0.008))
    parts.append(add_part(col, "Kombi_LCD_Panel", "cube", (0, ${(-d / 2 - 0.004).toFixed(3)}, 0.215), (${(w - 0.06).toFixed(3)}, 0.014, 0.125), mat_glass, 0.002))
    parts.append(add_part(col, "Hermetik_Baca", "cylinder", (0, 0.04, ${(h + 0.04).toFixed(3)}), (0.104, 0.104, 0.08), mat_primary, 0.0))
    for i, px in enumerate([-0.13, -0.065, 0.0, 0.065, 0.13]):
        parts.append(add_part(col, f"Tesisat_Vana_{i+1}", "cylinder", (px, 0.02, 0.06), (0.024, 0.024, 0.12), mat_accent, 0.0))`;

    case 'tr_panel_radiator':
      return `    # Demirdöküm Plus Tip 22 PKKP Panel Radyatör (120x11x60 cm)
    parts.append(add_part(col, "On_Panel", "cube", (-0.03, -0.034, ${(h / 2).toFixed(3)}), (${(w - 0.1).toFixed(3)}, 0.024, ${(h - 0.016).toFixed(3)}), mat_primary, 0.003))
    parts.append(add_part(col, "Arka_Panel", "cube", (-0.03, 0.034, ${(h / 2).toFixed(3)}), (${(w - 0.1).toFixed(3)}, 0.024, ${(h - 0.016).toFixed(3)}), mat_primary, 0.003))
    parts.append(add_part(col, "Ust_Konvektor_Izgara", "cube", (-0.03, 0, ${(h - 0.006).toFixed(3)}), (${(w - 0.086).toFixed(3)}, ${(d - 0.004).toFixed(3)}, 0.012), mat_secondary, 0.002))
    parts.append(add_part(col, "Termostatik_Vana", "cylinder", (${(w / 2 - 0.025).toFixed(3)}, 0, ${(h - 0.065).toFixed(3)}), (0.042, 0.042, 0.072), mat_accent, 0.0, (0, math.radians(90), 0)))`;

    case 'tr_armored_steel_door':
      return `    # Sur / Kale Modern Villa & Daire Çelik Dış Kapısı (95x14x210 cm)
    parts.append(add_part(col, "Celik_Kasa_Sol", "cube", (${(-w / 2 + 0.038).toFixed(3)}, 0, ${(h / 2).toFixed(3)}), (0.075, ${d}, ${h}), mat_secondary, 0.004))
    parts.append(add_part(col, "Celik_Kasa_Sag", "cube", (${(w / 2 - 0.038).toFixed(3)}, 0, ${(h / 2).toFixed(3)}), (0.075, ${d}, ${h}), mat_secondary, 0.004))
    parts.append(add_part(col, "Celik_Kasa_Ust", "cube", (0, 0, ${(h - 0.038).toFixed(3)}), (${w}, ${d}, 0.075), mat_secondary, 0.004))
    parts.append(add_part(col, "Zirhli_Kanat", "cube", (0, -0.015, ${(h / 2 - 0.02).toFixed(3)}), (${(w - 0.15).toFixed(3)}, 0.076, ${(h - 0.095).toFixed(3)}), mat_primary, 0.004))
    parts.append(add_part(col, "Inox_Cekme_Bari", "cube", (${(w * 0.28).toFixed(3)}, -0.098, 1.08), (0.026, 0.022, 1.38), mat_accent, 0.003))
    parts.append(add_part(col, "Kale_Akilli_Kilit", "cube", (${(w * 0.17).toFixed(3)}, -0.062, 1.02), (0.074, 0.022, 0.21), mat_glass, 0.002))`;

    case 'tr_magnetic_track_light':
      return `    # Pelsan / Jupiter 150 cm 3'lü Manyetik Ray Spot & Lineer LED Sistem
    parts.append(add_part(col, "Manyetik_Ray_Profili", "cube", (0, 0, ${(h - 0.024).toFixed(3)}), (${w}, 0.038, 0.044), mat_primary, 0.002))
    parts.append(add_part(col, "Lineer_LED_Modul", "cube", (-0.14, 0, ${(h - 0.048).toFixed(3)}), (0.42, 0.024, 0.014), mat_accent, 0.001))
    for idx, sx in enumerate([-0.54, 0.24, 0.56]):
        parts.append(add_part(col, f"Ray_Spot_{idx+1}", "cylinder", (sx, 0, ${(h - 0.115).toFixed(3)}), (0.058, 0.058, 0.112), mat_secondary, 0.0, (math.radians(18), 0, 0)))`;

    case 'tr_modern_fireplace':
      return `    # Modern TV Altı 140 cm Ankastre Bioetanol / Buharlı Villa Şöminesi
    parts.append(add_part(col, "Mermer_Cerceve_Alt", "cube", (0, 0, 0.042), (${w}, ${d}, 0.085), mat_primary, 0.005))
    parts.append(add_part(col, "Mermer_Cerceve_Ust", "cube", (0, 0, ${(h - 0.042).toFixed(3)}), (${w}, ${d}, 0.085), mat_primary, 0.005))
    parts.append(add_part(col, "Yanma_Haznesi", "cube", (0, 0.03, ${(h / 2).toFixed(3)}), (${(w - 0.17).toFixed(3)}, ${(d - 0.06).toFixed(3)}, ${(h - 0.17).toFixed(3)}), mat_secondary, 0.003))
    parts.append(add_part(col, "Inox_Brulor", "cube", (0, 0, 0.112), (0.96, 0.14, 0.016), mat_accent, 0.002))
    parts.append(add_part(col, "Temperli_On_Cam", "cube", (0, ${(-d / 2 + 0.04).toFixed(3)}, 0.165), (${(w - 0.27).toFixed(3)}, 0.008, 0.115), mat_glass, 0.001))`;

    case 'tr_fuse_box':
      return `    # Viko / Siemens Sıva Altı Sigorta Kutusu (DIN Ray & Otomat Modülleri)
    parts.append(add_part(col, "Pano_Gomme_Kasa", "cube", (0, 0.028, ${(h / 2).toFixed(3)}), (${(w - 0.03).toFixed(3)}, ${(d * 0.72).toFixed(3)}, ${(h - 0.03).toFixed(3)}), mat_secondary, 0.003))
    parts.append(add_part(col, "Pano_Dis_Cerceve", "cube", (0, -0.008, ${(h / 2).toFixed(3)}), (${w}, 0.02, ${h}), mat_primary, 0.004))
    parts.append(add_part(col, "Fume_Seffaf_Kapak", "cube", (0, -0.022, ${(h / 2).toFixed(3)}), (${(w - 0.042).toFixed(3)}, 0.008, ${(h - 0.056).toFixed(3)}), mat_glass, 0.002))
    for r in range(2):
        rz = ${(h * 0.34).toFixed(3)} + r * ${(h * 0.32).toFixed(3)}
        for m in range(8):
            mx = ${(-w * 0.32).toFixed(3)} + m * ${(w * 0.64 / 7).toFixed(3)}
            parts.append(add_part(col, f"Sigorta_Otomat_{r+1}_{m+1}", "cube", (mx, -0.002, rz), (0.017, 0.028, 0.068), mat_accent, 0.001))`;

    case 'tr_video_intercom':
      return `    # Audio 7" Dokunmatik Görüntülü Diafon & İnterkom
    parts.append(add_part(col, "Diafon_Arka_Montaj", "cube", (0, 0.006, ${(h / 2).toFixed(3)}), (${(w - 0.012).toFixed(3)}, 0.012, ${(h - 0.012).toFixed(3)}), mat_accent, 0.002))
    parts.append(add_part(col, "Diafon_Cam_Govde", "cube", (0, -0.005, ${(h / 2).toFixed(3)}), (${w}, 0.012, ${h}), mat_primary, 0.003))
    parts.append(add_part(col, "Diafon_7Inc_Ekran", "cube", (-0.024, -0.012, ${(h / 2).toFixed(3)}), (0.154, 0.004, 0.092), mat_glass, 0.001))`;

    case 'tr_tv_data_socket':
      return `    # Viko Karre TV-Uydu + Cat6 RJ45 İkili Zayıf Akım Prizi
    parts.append(add_part(col, "Dis_Cerceve", "cube", (0, -0.005, ${(h / 2).toFixed(3)}), (${w}, 0.011, ${h}), mat_primary, 0.002))
    parts.append(add_part(col, "TV_Uydu_Modulu", "cube", (${(-w * 0.22).toFixed(3)}, -0.011, ${(h / 2).toFixed(3)}), (0.056, 0.006, 0.056), mat_secondary, 0.001))
    parts.append(add_part(col, "Cat6_RJ45_Modulu", "cube", (${(w * 0.22).toFixed(3)}, -0.011, ${(h / 2).toFixed(3)}), (0.056, 0.006, 0.056), mat_secondary, 0.001))
    parts.append(add_part(col, "F_Konnektor_Krom", "cylinder", (${(-w * 0.22).toFixed(3)}, -0.018, ${(h / 2).toFixed(3)}), (0.012, 0.012, 0.014), mat_accent, 0.0, (math.radians(90), 0, 0)))`;

    case 'tr_gas_valve_assembly':
      return `    # E.C.A. TS EN 331 Doğalgaz Borusu, Sarı Küresel Vana, Filtre & Kombi Fleks Grubu
    parts.append(add_part(col, "Dogalgaz_Celik_Boru", "cylinder", (0, 0, ${(h / 2).toFixed(3)}), (0.026, 0.026, ${h}), mat_primary, 0.0))
    parts.append(add_part(col, "ECA_Kuresel_Vana", "cylinder", (0, 0, ${(h * 0.56).toFixed(3)}), (0.044, 0.044, 0.072), mat_secondary, 0.0))
    parts.append(add_part(col, "Sari_Vana_Kolu", "cube", (0.055, -0.018, ${(h * 0.56).toFixed(3)}), (0.095, 0.014, 0.018), mat_accent, 0.002))
    parts.append(add_part(col, "Pislik_Tutucu_Filtre", "cylinder", (0, -0.028, ${(h * 0.36).toFixed(3)}), (0.032, 0.032, 0.055), mat_secondary, 0.0, (math.radians(45), 0, 0)))`;

    case 'tr_gas_meter_g4':
      return `    # Elster / Baylan BK-G4 İGDAŞ Tipi Doğalgaz Sayacı & Regülatör
    parts.append(add_part(col, "Sayac_Govdesi", "cube", (0, 0, ${(h * 0.44).toFixed(3)}), (${(w * 0.68).toFixed(3)}, ${(d * 0.72).toFixed(3)}, ${(h * 0.58).toFixed(3)}), mat_primary, 0.012))
    parts.append(add_part(col, "Numarator_Ekrani", "cube", (0, ${(-d * 0.37).toFixed(3)}, ${(h * 0.52).toFixed(3)}), (0.092, 0.014, 0.046), mat_glass, 0.002))
    parts.append(add_part(col, "Giris_Rakoru", "cylinder", (-0.065, 0, ${(h * 0.84).toFixed(3)}), (0.03, 0.03, 0.09), mat_secondary, 0.0))
    parts.append(add_part(col, "Cikis_Rakoru", "cylinder", (0.065, 0, ${(h * 0.84).toFixed(3)}), (0.03, 0.03, 0.09), mat_secondary, 0.0))
    parts.append(add_part(col, "Regulator_Kafasi", "cylinder", (-0.095, -0.01, ${(h * 0.84).toFixed(3)}), (0.064, 0.064, 0.044), mat_accent, 0.0, (math.radians(90), 0, 0)))`;

    case 'tr_manifold_cabinet':
      return `    # Rehau / E.C.A. 8 Ağızlı Yerden Isıtma Kollektör Dolabı
    parts.append(add_part(col, "Kollektor_Gomme_Kasa", "cube", (0, 0.01, ${(h / 2).toFixed(3)}), (${(w - 0.03).toFixed(3)}, ${(d - 0.015).toFixed(3)}, ${(h - 0.03).toFixed(3)}), mat_secondary, 0.003))
    parts.append(add_part(col, "Kollektor_Cerceve", "cube", (0, ${(-d / 2 + 0.008).toFixed(3)}, ${(h / 2).toFixed(3)}), (${w}, 0.016, ${h}), mat_primary, 0.003))
    parts.append(add_part(col, "Gidis_Barasi_PEX", "cylinder", (0, 0.004, ${(h * 0.64).toFixed(3)}), (0.036, 0.036, ${(w - 0.14).toFixed(3)}), mat_accent, 0.0, (0, math.radians(90), 0)))
    parts.append(add_part(col, "Donus_Barasi_PEX", "cylinder", (0, 0.004, ${(h * 0.36).toFixed(3)}), (0.036, 0.036, ${(w - 0.14).toFixed(3)}), mat_accent, 0.0, (0, math.radians(90), 0)))`;

    case 'tr_vertical_radiator':
      return `    # E.C.A. / Carisa 180x50 cm Dikey Dekoratif Alüminyum Radyatör
    parts.append(add_part(col, "Alt_Kollektor", "cube", (0, 0.01, 0.04), (${w}, 0.045, 0.045), mat_secondary, 0.004))
    parts.append(add_part(col, "Ust_Kollektor", "cube", (0, 0.01, ${(h - 0.04).toFixed(3)}), (${w}, 0.045, 0.045), mat_secondary, 0.004))
    for i in range(6):
        dx = ${(-w * 0.41).toFixed(3)} + i * ${(w * 0.82 / 5).toFixed(3)}
        parts.append(add_part(col, f"Aluminyum_Dilim_{i+1}", "cube", (dx, -0.008, ${(h / 2).toFixed(3)}), (0.072, 0.038, ${h}), mat_primary, 0.004))`;

    case 'tr_room_thermostat':
      return `    # Cosa / Honeywell Wi-Fi Akıllı Oda Termostatı
    parts.append(add_part(col, "Termostat_Govde", "cube", (0, 0, ${(h / 2).toFixed(3)}), (${w}, ${d}, ${h}), mat_primary, 0.006))
    parts.append(add_part(col, "OLED_Ekran", "cube", (0, ${(-d / 2 - 0.002).toFixed(3)}, ${(h / 2).toFixed(3)}), (${(w - 0.018).toFixed(3)}, 0.004, ${(h - 0.018).toFixed(3)}), mat_glass, 0.002))`;

    case 'tr_split_ac_unit':
      return `    # Daikin Shira Plus 12.000 BTU Inverter Duvar Tipi Split Klima
    parts.append(add_part(col, "Klima_Ic_Unite", "cube", (0, 0, ${(h / 2).toFixed(3)}), (${w}, ${d}, ${h}), mat_primary, 0.016))
    parts.append(add_part(col, "Hava_Yonlendirme_Kanadi", "cube", (0, ${(-d / 2 + 0.02).toFixed(3)}, 0.036), (${(w - 0.06).toFixed(3)}, 0.048, 0.012), mat_secondary, 0.002, (math.radians(-22), 0, 0)))
    parts.append(add_part(col, "LED_Sicaklik_Gosterge", "cube", (${(w * 0.28).toFixed(3)}, ${(-d / 2 - 0.002).toFixed(3)}, ${(h * 0.48).toFixed(3)}), (0.095, 0.004, 0.036), mat_glass, 0.001))`;

    case 'tr_water_meter_group':
      return `    # Baylan / E.C.A. İSKİ Tipi Su Sayacı, Basınç Düşürücü & Ana Vana Grubu
    parts.append(add_part(col, "Tesisat_Ana_Hatti", "cylinder", (0, 0, ${(h * 0.5).toFixed(3)}), (0.028, 0.028, ${w}), mat_secondary, 0.0, (0, math.radians(90), 0)))
    parts.append(add_part(col, "Baylan_Su_Sayaci", "cylinder", (0, 0, ${(h * 0.54).toFixed(3)}), (0.088, 0.088, 0.072), mat_primary, 0.0))
    parts.append(add_part(col, "Ana_Kuresel_Vana", "cylinder", (${(-w * 0.34).toFixed(3)}, 0, ${(h * 0.5).toFixed(3)}), (0.042, 0.042, 0.064), mat_accent, 0.0, (0, math.radians(90), 0)))
    parts.append(add_part(col, "Basinc_Dusurucu_Manometre", "cylinder", (${(w * 0.32).toFixed(3)}, -0.028, ${(h * 0.62).toFixed(3)}), (0.052, 0.052, 0.026), mat_glass, 0.0, (math.radians(90), 0, 0)))`;

    case 'tr_elevator_landing':
      return `    # KONE / Otis EN 81-20 90x210 cm Otomatik Apartman Asansör Kat Kapısı
    parts.append(add_part(col, "Asansor_Sove_Sol", "cube", (${(-w / 2 + 0.105).toFixed(3)}, 0, ${(h / 2).toFixed(3)}), (0.21, ${d}, ${h}), mat_primary, 0.004))
    parts.append(add_part(col, "Asansor_Sove_Sag", "cube", (${(w / 2 - 0.105).toFixed(3)}, 0, ${(h / 2).toFixed(3)}), (0.21, ${d}, ${h}), mat_primary, 0.004))
    parts.append(add_part(col, "Asansor_Ust_Lento", "cube", (0, 0, ${(h - 0.11).toFixed(3)}), (${w}, ${d}, 0.22), mat_primary, 0.004))
    parts.append(add_part(col, "Kapı_Kanadi_Sol", "cube", (-0.226, 0.03, 1.05), (0.448, 0.042, 2.10), mat_secondary, 0.003))
    parts.append(add_part(col, "Kapı_Kanadi_Sag", "cube", (0.226, 0.03, 1.05), (0.448, 0.042, 2.10), mat_secondary, 0.003))
    parts.append(add_part(col, "Dijital_Kat_Gostergesi", "cube", (0, ${(-d / 2 - 0.006).toFixed(3)}, ${(h - 0.11).toFixed(3)}), (0.38, 0.014, 0.12), mat_glass, 0.002))
    parts.append(add_part(col, "LOP_Cagri_Paneli", "cube", (${(w / 2 - 0.105).toFixed(3)}, ${(-d / 2 - 0.006).toFixed(3)}, 1.08), (0.095, 0.014, 0.26), mat_accent, 0.002))`;

    case 'tr_elevator_cabin':
      return `    # Ake / Otis EN 81-20 630 kg (8 Kişilik) Asansör Kabini (110x140 cm İç Alan)
    parts.append(add_part(col, "Granit_Taban", "cube", (0, 0, 0.03), (${w}, ${d}, 0.06), mat_secondary, 0.003))
    parts.append(add_part(col, "LED_Tavan_Paneli", "cube", (0, 0, ${(h - 0.035).toFixed(3)}), (${w}, ${d}, 0.07), mat_primary, 0.003))
    parts.append(add_part(col, "Arka_Duvar_Aynali", "cube", (0, ${(d / 2 - 0.025).toFixed(3)}, ${(h / 2).toFixed(3)}), (${w}, 0.05, ${(h - 0.12).toFixed(3)}), mat_primary, 0.003))
    parts.append(add_part(col, "Sol_Yan_Duvar", "cube", (${(-w / 2 + 0.025).toFixed(3)}, 0, ${(h / 2).toFixed(3)}), (0.05, ${d}, ${(h - 0.12).toFixed(3)}), mat_primary, 0.003))
    parts.append(add_part(col, "Sag_Yan_Duvar", "cube", (${(w / 2 - 0.025).toFixed(3)}, 0, ${(h / 2).toFixed(3)}), (0.05, ${d}, ${(h - 0.12).toFixed(3)}), mat_primary, 0.003))
    parts.append(add_part(col, "Paslanmaz_Tutamak", "cylinder", (0, ${(d / 2 - 0.095).toFixed(3)}, 0.92), (0.038, 0.038, ${(w - 0.24).toFixed(3)}), mat_accent, 0.0, (0, math.radians(90), 0)))
    parts.append(add_part(col, "COP_Kumanda_Paneli", "cube", (${(w / 2 - 0.062).toFixed(3)}, -0.18, 1.15), (0.022, 0.22, 1.68), mat_glass, 0.002))`;

    case 'tr_ac_outdoor_unit':
      return `    # Daikin / Arçelik Inverter Split Klima Dış Ünitesi & Duvar Konsolu
    parts.append(add_part(col, "Klima_Dis_Govde", "cube", (0, 0, ${(h * 0.55).toFixed(3)}), (${(w * 0.94).toFixed(3)}, ${(d * 0.84).toFixed(3)}, ${(h * 0.86).toFixed(3)}), mat_primary, 0.008))
    parts.append(add_part(col, "Fan_Izgara_Halkasi", "cylinder", (${(-w * 0.16).toFixed(3)}, ${(-d * 0.44).toFixed(3)}, ${(h * 0.55).toFixed(3)}), (0.40, 0.40, 0.025), mat_secondary, 0.0, (math.radians(90), 0, 0)))
    parts.append(add_part(col, "Duvar_Konsol_Sol", "cube", (${(-w * 0.32).toFixed(3)}, 0, 0.065), (0.042, ${d}, 0.036), mat_accent, 0.002))
    parts.append(add_part(col, "Duvar_Konsol_Sag", "cube", (${(w * 0.32).toFixed(3)}, 0, 0.065), (0.042, ${d}, 0.036), mat_accent, 0.002))`;

    case 'tr_gas_service_box':
      return `    # İGDAŞ / BaşkentGaz Dış Cephe Sarı Doğalgaz Servis Kutusu
    parts.append(add_part(col, "Beton_Kaide", "cube", (0, 0, 0.11), (${(w + 0.04).toFixed(3)}, ${(d + 0.04).toFixed(3)}, 0.22), mat_secondary, 0.004))
    parts.append(add_part(col, "IGDAS_Sari_Kutu", "cube", (0, 0, 0.48), (${w}, ${d}, 0.52), mat_primary, 0.006))
    parts.append(add_part(col, "Kolon_Yukseltme_Borusu", "cylinder", (${(-w * 0.24).toFixed(3)}, 0.03, ${(h - 0.06).toFixed(3)}), (0.038, 0.038, 0.18), mat_primary, 0.0))`;

    case 'tr_fire_hose_cabinet':
      return `    # TS EN 671-1 Sıva Altı Apartman Yangın Dolabı (Hortum Makarası + 6 kg KKT Tüp)
    parts.append(add_part(col, "Yangin_Dolap_Kasa", "cube", (0, 0.01, ${(h / 2).toFixed(3)}), (${w}, ${d}, ${h}), mat_primary, 0.004))
    parts.append(add_part(col, "Temperli_Gozetleme_Cami", "cube", (0, ${(-d / 2 + 0.008).toFixed(3)}, ${(h / 2).toFixed(3)}), (${(w - 0.12).toFixed(3)}, 0.008, ${(h - 0.14).toFixed(3)}), mat_glass, 0.001))
    parts.append(add_part(col, "Hortum_Makarasi", "cylinder", (${(-w * 0.17).toFixed(3)}, 0, ${(h * 0.52).toFixed(3)}), (0.44, 0.44, 0.09), mat_secondary, 0.0, (math.radians(90), 0, 0)))
    parts.append(add_part(col, "KKT_6kg_Yangin_Tupu", "cylinder", (${(w * 0.3).toFixed(3)}, 0, 0.31), (0.156, 0.156, 0.48), mat_secondary, 0.0))`;

    case 'tr_ip44_lidded_socket':
      return `    # Viko Karre IP44 Kapaklı Banyo & Balkon Topraklı Prizi (Type F Schuko)
    parts.append(add_part(col, "IP44_Conta", "cube", (0, 0.002, ${(h / 2).toFixed(3)}), (${(w + 0.004).toFixed(3)}, 0.005, ${(h + 0.004).toFixed(3)}), mat_secondary, 0.001))
    parts.append(add_part(col, "Karre_Cerceve", "cube", (0, -0.008, ${(h / 2).toFixed(3)}), (${w}, 0.014, ${h}), mat_primary, 0.002))
    parts.append(add_part(col, "IP44_Koruma_Kapagi", "cube", (0, -0.028, ${(h / 2).toFixed(3)}), (${(w * 0.76).toFixed(3)}, 0.009, ${(h * 0.72).toFixed(3)}), mat_glass, 0.002, (math.radians(-14), 0, 0)))`;

    case 'tr_electric_meter_panel':
      return `    # Makel / Luna 3 Fazlı Dijital Elektrik Sayacı & Apartman Panosu
    parts.append(add_part(col, "Sayac_Pano_Kasa", "cube", (0, 0.02, ${(h / 2).toFixed(3)}), (${w}, ${(d * 0.86).toFixed(3)}, ${h}), mat_primary, 0.004))
    parts.append(add_part(col, "Makel_3Faz_Sayac", "cube", (0, -0.01, ${(h * 0.6).toFixed(3)}), (${(w * 0.62).toFixed(3)}, 0.072, ${(h * 0.5).toFixed(3)}), mat_secondary, 0.003))
    parts.append(add_part(col, "Ana_Salter_3x40A", "cube", (-0.04, -0.01, ${(h * 0.21).toFixed(3)}), (0.088, 0.056, 0.084), mat_accent, 0.002))`;

    case 'tr_gas_smoke_detector':
      return `    # Mavili Maxlogic / Teknim İGDAŞ Doğalgaz Kaçak Alarmı & Duman Dedektörü
    parts.append(add_part(col, "Dogalgaz_Alarm_Govde", "cube", (0, -0.02, 0.08), (${(w * 0.82).toFixed(3)}, ${(d * 0.72).toFixed(3)}, ${(h * 0.64).toFixed(3)}), mat_primary, 0.005))
    parts.append(add_part(col, "Optik_Duman_Dedektoru", "cylinder", (0, -0.02, ${(h - 0.048).toFixed(3)}), (0.10, 0.10, 0.042), mat_secondary, 0.0, (math.radians(90), 0, 0)))`;

    case 'tr_electric_water_heater':
      return `    # DemirDöküm DT4 Titanium / Baymak 65L Elektrikli Termosifon
    parts.append(add_part(col, "Termosifon_Kazan", "cylinder", (0, 0, ${(h * 0.5).toFixed(3)}), (${w}, ${d}, ${(h * 0.72).toFixed(3)}), mat_primary, 0.0))
    parts.append(add_part(col, "Dijital_Ekran", "cube", (0, ${(-d / 2).toFixed(3)}, ${(h * 0.34).toFixed(3)}), (0.15, 0.022, 0.072), mat_glass, 0.002))
    parts.append(add_part(col, "Emniyet_Ventili_Soguk", "cylinder", (0.06, 0, 0.07), (0.028, 0.028, 0.12), mat_accent, 0.0))`;

    case 'tr_linear_floor_drain':
      return `    # Sukar / Geberit CleanLine 60 cm Paslanmaz Çelik Lineer Duş Yer Süzgeci
    parts.append(add_part(col, "ABS_Sifon_Govde", "cube", (0, 0, ${(h * 0.36).toFixed(3)}), (0.16, 0.09, ${(h * 0.72).toFixed(3)}), mat_secondary, 0.003))
    parts.append(add_part(col, "Yalitim_Flansi", "cube", (0, 0, ${(h - 0.016).toFixed(3)}), (${(w + 0.032).toFixed(3)}, ${d}, 0.004), mat_accent, 0.001))
    parts.append(add_part(col, "AISI304_Lineer_Izgara", "cube", (0, 0, ${(h - 0.006).toFixed(3)}), (${w}, ${(d * 0.66).toFixed(3)}, 0.01), mat_primary, 0.001))`;

    case 'tr_surface_fuse_box':
      return `    # Viko by Panasonic 12'li Sıva Üstü IP40 Sigorta Kutusu (TS EN 60670)
    parts.append(add_part(col, "Siva_Ustu_Kasa", "cube", (0, 0, ${(h / 2).toFixed(3)}), (${w}, ${(d * 0.85).toFixed(3)}, ${h}), mat_primary, 0.006))
    parts.append(add_part(col, "DIN_Ray_Otomat_Grubu", "cube", (0, ${(-d * 0.25).toFixed(3)}, ${(h * 0.5).toFixed(3)}), (${(w * 0.78).toFixed(3)}, 0.048, 0.078), mat_secondary, 0.002))
    parts.append(add_part(col, "Fume_Seffaf_Kapak", "cube", (0, ${(-d * 0.48).toFixed(3)}, ${(h * 0.48).toFixed(3)}), (${(w * 0.92).toFixed(3)}, 0.012, ${(h * 0.72).toFixed(3)}), mat_glass, 0.003))`;

    case 'tr_mcb_breaker_set':
      return `    # Siemens 5SL6 / Schneider Acti9 DIN Rayı Otomat, Kaçak Akım & Parafudr Grubu
    parts.append(add_part(col, "DIN_Rayi_35mm", "cube", (0, 0.025, ${(h / 2).toFixed(3)}), (${(w * 1.04).toFixed(3)}, 0.012, 0.035), mat_secondary, 0.001))
    parts.append(add_part(col, "Kacak_Akim_RCCB_30mA", "cube", (${(-w * 0.34).toFixed(3)}, -0.01, ${(h / 2).toFixed(3)}), (0.036, ${(d * 0.82).toFixed(3)}, ${h}), mat_primary, 0.002))
    parts.append(add_part(col, "Tip2_Parafudr_SPD", "cube", (${(-w * 0.16).toFixed(3)}, -0.01, ${(h / 2).toFixed(3)}), (0.036, ${(d * 0.82).toFixed(3)}, ${h}), mat_accent, 0.002))
    parts.append(add_part(col, "C16_C25_Otomat_Dizisi", "cube", (${(w * 0.18).toFixed(3)}, -0.01, ${(h / 2).toFixed(3)}), (${(w * 0.54).toFixed(3)}, ${(d * 0.82).toFixed(3)}, ${h}), mat_primary, 0.002))`;

    case 'tr_weak_current_panel':
      return `    # Schneider / Legrand Sıva Altı Data & Multimedia Zayıf Akım Panosu
    parts.append(add_part(col, "Zayif_Akim_Kasa", "cube", (0, 0.03, ${(h / 2).toFixed(3)}), (${w}, ${d}, ${h}), mat_primary, 0.004))
    parts.append(add_part(col, "RJ45_Patch_Panel_8Port", "cube", (0, -0.01, ${(h * 0.78).toFixed(3)}), (${(w * 0.74).toFixed(3)}, 0.042, 0.06), mat_secondary, 0.002))
    parts.append(add_part(col, "FTTH_Modem_Router", "cube", (0, -0.01, ${(h * 0.44).toFixed(3)}), (${(w * 0.62).toFixed(3)}, 0.038, 0.14), mat_accent, 0.003))
    parts.append(add_part(col, "Menfezli_Kapak", "cube", (0, -0.032, ${(h / 2).toFixed(3)}), (${(w * 0.94).toFixed(3)}, 0.008, ${(h * 0.94).toFixed(3)}), mat_primary, 0.002))`;

    case 'tr_rack_cabinet_9u':
      return `    # Estap / Canovate 9U 19" Duvar Tipi Data & Kamera Rack Kabineti
    parts.append(add_part(col, "Rack_Celik_Govde", "cube", (0, 0, ${(h / 2).toFixed(3)}), (${w}, ${d}, ${h}), mat_primary, 0.005))
    parts.append(add_part(col, "PoE_Switch_Patch_1U", "cube", (0, ${(-d * 0.15).toFixed(3)}, ${(h * 0.65).toFixed(3)}), (${(w * 0.82).toFixed(3)}, 0.24, 0.14), mat_secondary, 0.002))
    parts.append(add_part(col, "Temperli_Cam_Kapi", "cube", (0, ${(-d / 2 - 0.006).toFixed(3)}, ${(h / 2).toFixed(3)}), (${(w * 0.86).toFixed(3)}, 0.012, ${(h * 0.88).toFixed(3)}), mat_glass, 0.002))`;

    case 'tr_recessed_spot_round':
      return `    # Jupiter / Cata LED Alçıpan Gömme Yuvarlak Hareketli Spot (Ø9.5 cm)
    parts.append(add_part(col, "Alcipan_Flans_Halka", "cylinder", (0, 0, 0.005), (${w}, ${d}, 0.008), mat_primary, 0.001))
    parts.append(add_part(col, "Aluminyum_Sogutucu", "cylinder", (0, 0, ${(h * 0.56).toFixed(3)}), (${(w * 0.72).toFixed(3)}, ${(d * 0.72).toFixed(3)}, ${(h * 0.84).toFixed(3)}), mat_secondary, 0.002))
    parts.append(add_part(col, "COB_LED_Lens", "cylinder", (0, 0, 0.012), (${(w * 0.44).toFixed(3)}, ${(d * 0.44).toFixed(3)}, 0.008), mat_accent, 0.0))`;

    case 'tr_gimbal_double_spot':
      return `    # Pelsan / Jupiter İkili Kardan (Gimbal) Çerçevesiz Alçıpan Spot (2×12W)
    parts.append(add_part(col, "Alcipan_Ikili_Kasa", "cube", (0, 0, ${(h * 0.52).toFixed(3)}), (${w}, ${d}, ${h}), mat_primary, 0.003))
    parts.append(add_part(col, "Sol_Kardan_Kafa", "cylinder", (${(-w * 0.24).toFixed(3)}, 0, 0.032), (0.092, 0.092, 0.056), mat_secondary, 0.002, (0.2, 0.14, 0)))
    parts.append(add_part(col, "Sag_Kardan_Kafa", "cylinder", (${(w * 0.24).toFixed(3)}, 0, 0.032), (0.092, 0.092, 0.056), mat_secondary, 0.002, (-0.18, -0.16, 0)))`;

    case 'tr_led_downlight_panel':
      return `    # Cata / ACK / Jupiter Slim 18W Alçıpan Gömme Panel LED Downlight (Ø22 cm)
    parts.append(add_part(col, "Slim_Dis_Cerceve", "cylinder", (0, 0, 0.008), (${w}, ${d}, 0.014), mat_primary, 0.001))
    parts.append(add_part(col, "Opal_LED_Difuzor", "cylinder", (0, 0, 0.002), (${(w * 0.86).toFixed(3)}, ${(d * 0.86).toFixed(3)}, 0.004), mat_accent, 0.0))
    parts.append(add_part(col, "LED_Surucu_Driver", "cube", (0.04, 0, ${(h * 0.72).toFixed(3)}), (0.088, 0.038, 0.024), mat_secondary, 0.002))`;

    case 'tr_cove_led_strip':
      return `    # Cata / ACK 24V COB Şerit LED + Alüminyum Köşe Kanal Profili (200 cm)
    parts.append(add_part(col, "Aluminyum_LED_Kanal", "cube", (0, 0, ${(h / 2).toFixed(3)}), (${w}, ${d}, ${h}), mat_primary, 0.001))
    parts.append(add_part(col, "Opal_COB_LED_Difuzor", "cube", (0, ${(-d * 0.2).toFixed(3)}, ${(h * 0.7).toFixed(3)}), (${(w - 0.01).toFixed(3)}, ${(d * 0.65).toFixed(3)}, ${(h * 0.45).toFixed(3)}), mat_accent, 0.0))
    parts.append(add_part(col, "Slim_24V_LED_Trafo", "cube", (${(w * 0.32).toFixed(3)}, 0.04, ${(h * 0.6).toFixed(3)}), (0.18, 0.042, 0.028), mat_secondary, 0.002))`;

    case 'tr_linear_recessed_led':
      return `    # Pelsan / Jupiter Sıva Altı (Trimless) Gömme Mimari Lineer LED Profil (180 cm)
    parts.append(add_part(col, "Aluminyum_Siva_Alti_Profil", "cube", (0, 0, ${(h * 0.52).toFixed(3)}), (${w}, ${d}, ${h}), mat_primary, 0.001))
    parts.append(add_part(col, "Kesintisiz_Opal_Difuzor", "cube", (0, 0, 0.004), (${(w - 0.012).toFixed(3)}, ${(d * 0.62).toFixed(3)}, 0.008), mat_accent, 0.0))`;

    case 'tr_tiered_ring_chandelier':
      return `    # Avonni 3 Katlı Modern LED Halka & Kristal Çubuklu Salon Avizesi (Ø80 cm)
    parts.append(add_part(col, "Tavan_Rozeti", "cylinder", (0, 0, ${(h - 0.024).toFixed(3)}), (0.28, 0.28, 0.044), mat_primary, 0.003))
    parts.append(add_part(col, "Ust_LED_Halka_80cm", "cylinder", (0, 0, ${(h * 0.42).toFixed(3)}), (${w}, ${d}, 0.032), mat_primary, 0.004))
    parts.append(add_part(col, "Orta_LED_Halka_60cm", "cylinder", (0, 0, ${(h * 0.26).toFixed(3)}), (${(w * 0.74).toFixed(3)}, ${(d * 0.74).toFixed(3)}, 0.030), mat_accent, 0.004))
    parts.append(add_part(col, "Alt_LED_Halka_40cm", "cylinder", (0, 0, ${(h * 0.10).toFixed(3)}), (${(w * 0.5).toFixed(3)}, ${(d * 0.5).toFixed(3)}, 0.028), mat_primary, 0.004))`;

    case 'tr_linear_globe_chandelier':
      return `    # Apliqa 6 Küreli Opal Cam Modern Lineer Yemek Masası & Ada Avizesi (120 cm)
    parts.append(add_part(col, "Lineer_Tavan_Rozeti", "cube", (0, 0, ${(h - 0.018).toFixed(3)}), (0.58, 0.08, 0.032), mat_primary, 0.003))
    parts.append(add_part(col, "Ana_Yatay_Bar", "cylinder", (0, 0, ${(h * 0.24).toFixed(3)}), (0.022, 0.022, ${(w * 0.88).toFixed(3)}), mat_primary, 0.0, (0, math.radians(90), 0)))
    parts.append(add_part(col, "Opal_Cam_Kure_Grubu", "cube", (0, 0, ${(h * 0.24).toFixed(3)}), (${w}, ${d}, 0.18), mat_accent, 0.04))`;

    case 'tr_cascade_stair_chandelier':
      return `    # Özcan / Avonni 9'lu Villa Galeri Boşluğu & Merdiven Kaskad Sarkıt Avize (220 cm)
    parts.append(add_part(col, "Galeri_Tavan_Rozeti", "cylinder", (0, 0, ${(h - 0.024).toFixed(3)}), (${(w * 0.84).toFixed(3)}, ${(d * 0.84).toFixed(3)}, 0.045), mat_primary, 0.004))
    parts.append(add_part(col, "Spiral_Sarkit_Silindir_Grubu", "cylinder", (0, 0, ${(h * 0.42).toFixed(3)}), (${(w * 0.72).toFixed(3)}, ${(d * 0.72).toFixed(3)}, ${(h * 0.74).toFixed(3)}), mat_accent, 0.01))`;

    case 'tr_wall_sconce_updown':
      return `    # Jupiter / Özcan Çift Yönlü (Up-Down) Mimari LED Duvar Apliği (IP54)
    parts.append(add_part(col, "Duvar_Montaj_Tabani", "cube", (0, 0.01, ${(h / 2).toFixed(3)}), (0.055, 0.016, 0.12), mat_primary, 0.002))
    parts.append(add_part(col, "Aluminyum_Silindir_Govde", "cylinder", (0, -0.04, ${(h / 2).toFixed(3)}), (${(w * 0.72).toFixed(3)}, ${(w * 0.72).toFixed(3)}, ${h}), mat_primary, 0.002))
    parts.append(add_part(col, "Ust_Alt_LED_Lens", "cylinder", (0, -0.04, ${h}), (${(w * 0.56).toFixed(3)}, ${(w * 0.56).toFixed(3)}, 0.01), mat_accent, 0.0))`;

    case 'tr_slatted_bench_vestiyer':
      return `    # Enza / Kelebek Çıtalı Oturaklı & Gizli LED Antre Vestiyer Portmanto (210x260 cm)
    parts.append(add_part(col, "Sol_Boy_Dolap_Govde", "cube", (${(-w * 0.25).toFixed(3)}, 0, ${(h * 0.5).toFixed(3)}), (${(w * 0.48).toFixed(3)}, ${d}, ${h}), mat_primary, 0.005))
    parts.append(add_part(col, "Sag_Oturak_Ayakkabilik", "cube", (${(w * 0.25).toFixed(3)}, 0, 0.24), (${(w * 0.50).toFixed(3)}, ${d}, 0.44), mat_primary, 0.004))
    parts.append(add_part(col, "Bukle_Oturma_Minderi", "cube", (${(w * 0.25).toFixed(3)}, -0.01, 0.49), (${(w * 0.48).toFixed(3)}, ${(d * 0.92).toFixed(3)}, 0.07), mat_secondary, 0.018))
    parts.append(add_part(col, "Akustik_Citali_Askilik_Paneli", "cube", (${(w * 0.25).toFixed(3)}, ${(d * 0.42).toFixed(3)}, 1.32), (${(w * 0.48).toFixed(3)}, 0.04, 1.56), mat_secondary, 0.003))
    parts.append(add_part(col, "Ust_Kopru_Dolabi", "cube", (${(w * 0.25).toFixed(3)}, 0, ${(h - 0.24).toFixed(3)}), (${(w * 0.50).toFixed(3)}, ${d}, 0.48), mat_primary, 0.004))
    parts.append(add_part(col, "Gizli_LED_Serit", "cube", (${(w * 0.25).toFixed(3)}, ${(d * 0.36).toFixed(3)}, ${(h - 0.49).toFixed(3)}), (${(w * 0.46).toFixed(3)}, 0.02, 0.014), mat_accent, 0.0))`;

    case 'tr_mirrored_sliding_vestiyer':
      return `    # Kelebek / Doğtaş Boy Aynalı Sürgülü Kapaklı Tam Boy Vestiyer (180x260 cm)
    parts.append(add_part(col, "Vestiyer_Ana_Karkas", "cube", (0, 0.02, ${(h * 0.5).toFixed(3)}), (${w}, ${(d * 0.92).toFixed(3)}, ${h}), mat_primary, 0.005))
    parts.append(add_part(col, "Sol_Fume_Ayna_Surgu_Kapak", "cube", (${(-w * 0.245).toFixed(3)}, ${(-d * 0.46).toFixed(3)}, ${(h * 0.51).toFixed(3)}), (${(w * 0.485).toFixed(3)}, 0.026, ${(h * 0.92).toFixed(3)}), mat_glass, 0.002))
    parts.append(add_part(col, "Sag_Surgu_Kapak", "cube", (${(w * 0.245).toFixed(3)}, ${(-d * 0.43).toFixed(3)}, ${(h * 0.51).toFixed(3)}), (${(w * 0.485).toFixed(3)}, 0.026, ${(h * 0.92).toFixed(3)}), mat_primary, 0.003))
    parts.append(add_part(col, "Aluminyum_Surgu_Ray_Ust", "cube", (0, ${(-d * 0.45).toFixed(3)}, ${(h - 0.04).toFixed(3)}), (${(w - 0.04).toFixed(3)}, 0.055, 0.035), mat_accent, 0.002))`;

    case 'tr_compact_entry_portmanto':
      return `    # Rani / Vivense Dar Antre Kompakt Aynalı & Kapaklı Portmanto (120x38x215 cm)
    parts.append(add_part(col, "Sol_Ayna_Kapakli_Dolap", "cube", (${(-w * 0.25).toFixed(3)}, 0, ${(h * 0.5).toFixed(3)}), (${(w * 0.46).toFixed(3)}, ${d}, ${h}), mat_primary, 0.004))
    parts.append(add_part(col, "Kapak_Boy_Aynasi", "cube", (${(-w * 0.25).toFixed(3)}, ${(-d * 0.51).toFixed(3)}, ${(h * 0.53).toFixed(3)}), (${(w * 0.34).toFixed(3)}, 0.01, ${(h * 0.72).toFixed(3)}), mat_glass, 0.002))
    parts.append(add_part(col, "Sag_Alt_Ayakkabilik", "cube", (${(w * 0.24).toFixed(3)}, 0, 0.38), (${(w * 0.50).toFixed(3)}, ${d}, 0.76), mat_primary, 0.004))
    parts.append(add_part(col, "Askilik_Paneli_ve_Ust_Raf", "cube", (${(w * 0.24).toFixed(3)}, ${(d * 0.42).toFixed(3)}, 1.46), (${(w * 0.50).toFixed(3)}, 0.032, 1.32), mat_secondary, 0.003))`;

    case 'tr_villa_pivot_steel_door':
      return `    # Sur Albero / Boss Lüks Villa İroko & Antrasit Pivot Çelik Dış Kapı (130x240 cm)
    parts.append(add_part(col, "Pivot_Celik_Kasa_Sol", "cube", (${(-w * 0.46).toFixed(3)}, 0, ${(h * 0.5).toFixed(3)}), (0.10, ${d}, ${h}), mat_secondary, 0.004))
    parts.append(add_part(col, "Pivot_Celik_Kasa_Sag", "cube", (${(w * 0.46).toFixed(3)}, 0, ${(h * 0.5).toFixed(3)}), (0.10, ${d}, ${h}), mat_secondary, 0.004))
    parts.append(add_part(col, "Pivot_Celik_Kasa_Ust", "cube", (0, 0, ${(h - 0.05).toFixed(3)}), (${w}, ${d}, 0.10), mat_secondary, 0.004))
    parts.append(add_part(col, "Iroko_Zirhli_Pivot_Kanat", "cube", (0, 0, ${(h * 0.49).toFixed(3)}), (${(w - 0.20).toFixed(3)}, 0.095, ${(h - 0.12).toFixed(3)}), mat_primary, 0.004))
    parts.append(add_part(col, "Tam_Boy_LED_Cekme_Bari", "cylinder", (${(w * 0.31).toFixed(3)}, -0.09, ${(h * 0.49).toFixed(3)}), (0.032, 0.032, ${(h * 0.78).toFixed(3)}), mat_accent, 0.0))`;

    case 'tr_double_villa_steel_door':
      return `    # Kale / Formet Çift Kanatlı & Sabit Camlı Villa Çelik Dış Kapı (150x230 cm)
    parts.append(add_part(col, "Cift_Kanat_Celik_Kasa", "cube", (0, 0.01, ${(h * 0.5).toFixed(3)}), (${w}, ${d}, ${h}), mat_secondary, 0.005))
    parts.append(add_part(col, "Ana_Acilir_Kanat", "cube", (${(-w * 0.15).toFixed(3)}, -0.01, ${(h * 0.49).toFixed(3)}), (${(w * 0.58).toFixed(3)}, 0.085, ${(h - 0.14).toFixed(3)}), mat_primary, 0.004))
    parts.append(add_part(col, "Sabit_Camli_Yan_Kanat", "cube", (${(w * 0.30).toFixed(3)}, -0.01, ${(h * 0.49).toFixed(3)}), (${(w * 0.30).toFixed(3)}, 0.075, ${(h - 0.14).toFixed(3)}), mat_glass, 0.003))
    parts.append(add_part(col, "Inox_Cekme_Bari", "cylinder", (${(w * 0.08).toFixed(3)}, -0.09, ${(h * 0.48).toFixed(3)}), (0.028, 0.028, 1.50), mat_accent, 0.0))`;

    case 'tr_door_number_bell_plate':
      return `    # Dekorister Gizli LED Işıklı Daire Kapı Numarası & Paslanmaz Zil Plakası (26x18 cm)
    parts.append(add_part(col, "Arka_LED_Difuzor_Pleksi", "cube", (0, 0.006, ${(h * 0.5).toFixed(3)}), (${(w * 0.96).toFixed(3)}, 0.010, ${(h * 0.94).toFixed(3)}), mat_accent, 0.002))
    parts.append(add_part(col, "On_Kompozit_Plaka", "cube", (0, -0.008, ${(h * 0.5).toFixed(3)}), (${w}, 0.012, ${h}), mat_primary, 0.002))
    parts.append(add_part(col, "Paslanmaz_Zil_Butonu", "cylinder", (${(w * 0.28).toFixed(3)}, -0.018, ${(h * 0.32).toFixed(3)}), (0.028, 0.028, 0.012), mat_accent, 0.0, (math.radians(90), 0, 0)))`;

    case 'tr_flip_drawer_shoe_cabinet':
      return `    # Rani / Adore 3'lü Düşer Kapaklı Ultra İnce (24 cm) Antre Ayakkabılık (90x24x126 cm)
    parts.append(add_part(col, "Ince_Govde_Kasa", "cube", (0, 0, ${(h * 0.54).toFixed(3)}), (${w}, ${d}, ${(h - 0.14).toFixed(3)}), mat_primary, 0.004))
    parts.append(add_part(col, "Ust_Duser_Kapak_1", "cube", (0, ${(-d * 0.52).toFixed(3)}, ${(h * 0.80).toFixed(3)}), (${(w - 0.03).toFixed(3)}, 0.02, 0.34), mat_primary, 0.003))
    parts.append(add_part(col, "Orta_Duser_Kapak_2", "cube", (0, ${(-d * 0.52).toFixed(3)}, ${(h * 0.51).toFixed(3)}), (${(w - 0.03).toFixed(3)}, 0.02, 0.34), mat_primary, 0.003))
    parts.append(add_part(col, "Alt_Duser_Kapak_3_Acik", "cube", (0, ${(-d * 0.62).toFixed(3)}, ${(h * 0.23).toFixed(3)}), (${(w - 0.03).toFixed(3)}, 0.02, 0.34), mat_primary, 0.003, (math.radians(-22), 0, 0)))`;

    case 'tr_entryway_shoe_bench':
      return `    # Vivense / Mudo Bukle Minderli & 2 Katlı Ayakkabı Raflı Antre Oturma Bankı (105x38x48 cm)
    parts.append(add_part(col, "Metal_Ahsap_Iskelet", "cube", (0, 0, 0.20), (${w}, ${d}, 0.38), mat_secondary, 0.004))
    parts.append(add_part(col, "Alt_Ayakkabi_Rafi_1", "cube", (0, 0, 0.11), (${(w - 0.06).toFixed(3)}, ${(d - 0.05).toFixed(3)}, 0.022), mat_accent, 0.002))
    parts.append(add_part(col, "Ust_Ayakkabi_Rafi_2", "cube", (0, 0, 0.26), (${(w - 0.06).toFixed(3)}, ${(d - 0.05).toFixed(3)}, 0.022), mat_accent, 0.002))
    parts.append(add_part(col, "Bukle_Oturma_Minderi", "cube", (0, 0, ${(h - 0.045).toFixed(3)}), (${(w - 0.02).toFixed(3)}, ${(d - 0.02).toFixed(3)}, 0.09), mat_primary, 0.024))`;

    case 'tr_doormat_umbrella_set':
      return `    # Mudo / Madame Coco Doğal Koko Kapı Paspası, Metal Şemsiyelik & Pirinç Çekecek Seti
    parts.append(add_part(col, "Koko_Kapi_Paspasi", "cube", (-0.16, 0, 0.012), (0.70, 0.45, 0.024), mat_primary, 0.004))
    parts.append(add_part(col, "Oluklu_Metal_Semsiyelik", "cylinder", (0.36, -0.02, 0.27), (0.24, 0.24, 0.54), mat_secondary, 0.0))
    parts.append(add_part(col, "Pirinc_Ayakkabi_Cekecegi", "cylinder", (0.39, 0.04, 0.34), (0.018, 0.018, 0.64), mat_accent, 0.0, (0.08, -0.06, 0)))`;

    case 'tr_entryway_console_mirror_set':
      return `    # Enza / Mudo Traverten & Ceviz Fluted Dresuar + Arka LED Oval Ayna Seti (120x36x205 cm)
    parts.append(add_part(col, "Traverten_Ust_Tabla", "cube", (0, 0, 0.81), (${w}, ${d}, 0.036), mat_primary, 0.006))
    parts.append(add_part(col, "Fluted_Ceviz_Cekmece_Govde", "cube", (0, 0, 0.70), (${(w - 0.04).toFixed(3)}, ${(d - 0.02).toFixed(3)}, 0.18), mat_secondary, 0.005))
    parts.append(add_part(col, "Sol_Silindir_Ayak", "cylinder", (${(-w * 0.36).toFixed(3)}, 0, 0.32), (0.14, 0.14, 0.64), mat_secondary, 0.0))
    parts.append(add_part(col, "Sag_Silindir_Ayak", "cylinder", (${(w * 0.36).toFixed(3)}, 0, 0.32), (0.14, 0.14, 0.64), mat_secondary, 0.0))
    parts.append(add_part(col, "Arka_LED_Oval_Ayna", "cylinder", (0, ${(d * 0.44).toFixed(3)}, 1.48), (0.64, 0.028, 1.06), mat_glass, 0.0, (math.radians(90), 0, 0)))`;

    case 'tr_arched_led_floor_mirror':
      return `    # Dekorister / Mudo Kemerli (Arch) Arka LED Işıklı Antre Boy Aynası (75x185 cm)
    parts.append(add_part(col, "Metal_Kemerli_Cerceve", "cube", (0, 0, ${(h * 0.5).toFixed(3)}), (${w}, ${d}, ${h}), mat_primary, 0.015))
    parts.append(add_part(col, "Flotal_Boy_Aynasi_Cam", "cube", (0, -0.016, ${(h * 0.5).toFixed(3)}), (${(w - 0.03).toFixed(3)}, 0.008, ${(h - 0.03).toFixed(3)}), mat_glass, 0.004))
    parts.append(add_part(col, "Arka_LED_Halo", "cube", (0, 0.014, ${(h * 0.5).toFixed(3)}), (${(w - 0.04).toFixed(3)}, 0.008, ${(h - 0.04).toFixed(3)}), mat_accent, 0.004))`;

    case 'tr_organic_led_wall_mirror':
      return `    # Dekorister / Vivense Asimetrik Organik Formlu Dokunmatik LED Antre Aynası (80x115 cm)
    parts.append(add_part(col, "Organik_Arka_LED_Kasa", "cylinder", (0, 0.012, ${(h * 0.5).toFixed(3)}), (${(w * 0.90).toFixed(3)}, 0.018, ${(h * 0.90).toFixed(3)}), mat_accent, 0.0, (math.radians(90), 0, 0)))
    parts.append(add_part(col, "Flotal_Organik_Ayna_Cam", "cylinder", (0, -0.006, ${(h * 0.5).toFixed(3)}), (${w}, 0.012, ${h}), mat_glass, 0.0, (math.radians(90), 0, 0)))`;

    case 'tr_acoustic_slat_coat_panel':
      return `    # AGT / Dekorister Akustik Keçeli Ahşap Duvar Çıtası & Gizli LED Antre Askılık (120x240 cm)
    parts.append(add_part(col, "Akustik_Kece_Taban", "cube", (0, 0.012, ${(h * 0.5).toFixed(3)}), (${w}, 0.012, ${h}), mat_secondary, 0.001))
    for i in range(18):
        sx = ${(-w * 0.46).toFixed(3)} + i * ${(w * 0.92 / 17).toFixed(3)}
        parts.append(add_part(col, f"Ahsap_Cita_{i+1}", "cube", (sx, -0.008, ${(h * 0.5).toFixed(3)}), (0.036, 0.022, ${h}), mat_primary, 0.002))
    parts.append(add_part(col, "Metal_Askilik_Bari", "cube", (0, -0.032, 1.62), (${(w * 0.82).toFixed(3)}, 0.035, 0.045), mat_accent, 0.002))`;

    case 'tr_wall_key_mail_organizer':
      return `    # Mudo / Dekorister Masif Ceviz & Metal Kapı Yanı Anahtarlık, Mektupluk & Raf (52x13x24 cm)
    parts.append(add_part(col, "Masif_Ceviz_Arka_Plaka", "cube", (0, 0.01, ${(h * 0.5).toFixed(3)}), (${w}, 0.02, ${h}), mat_primary, 0.003))
    parts.append(add_part(col, "Cuzdan_Gozluk_Rafi", "cube", (0, ${(-d * 0.42).toFixed(3)}, ${(h * 0.46).toFixed(3)}), (${(w - 0.02).toFixed(3)}, ${d}, 0.02), mat_primary, 0.002))
    parts.append(add_part(col, "Metal_Mektupluk_ve_Kanca_Bari", "cube", (0, -0.035, ${(h * 0.22).toFixed(3)}), (${(w * 0.88).toFixed(3)}, 0.04, 0.028), mat_accent, 0.002))`;

    case 'tr_bosch_ankastre_set_3':
      return `    # Bosch Serie 4/6 3'lü Siyah Cam Ankastre Set (Fırın + Gazlı Cam Ocak + Eğimli Davlumbaz)
    parts.append(add_part(col, "Ankastre_Alt_Kasa", "cube", (0, 0, 0.45), (${w}, ${d}, 0.86), mat_secondary, 0.003))
    parts.append(add_part(col, "Bosch_Ankastre_Firin", "cube", (0, ${(-d * 0.04).toFixed(3)}, 0.48), (0.595, 0.56, 0.595), mat_primary, 0.004))
    parts.append(add_part(col, "Bosch_Firin_Kulp", "cylinder", (0, ${(-d * 0.54).toFixed(3)}, 0.65), (0.014, 0.014, 0.48), mat_accent, 0.0, (0, math.radians(90), 0)))
    parts.append(add_part(col, "Bosch_Gazli_Cam_Ocak", "cube", (0, 0, 0.90), (0.59, 0.52, 0.045), mat_primary, 0.002))
    parts.append(add_part(col, "Bosch_Egimli_Cam_Davlumbaz", "cube", (0, ${(-d * 0.12).toFixed(3)}, 1.72), (0.60, 0.34, 0.42), mat_primary, 0.004, (math.radians(32), 0, 0)))
    parts.append(add_part(col, "Davlumbaz_Baca_Kulesi", "cube", (0, ${(d * 0.28).toFixed(3)}, 2.02), (0.24, 0.22, 0.44), mat_secondary, 0.002))`;

    case 'tr_siemens_ankastre_set_3':
      return `    # Siemens iQ500 3'lü İndüksiyonlu Siyah Cam Ankastre Set (Fırın + İndüksiyon Ocak + Eğimli Davlumbaz)
    parts.append(add_part(col, "Ankastre_Alt_Kasa", "cube", (0, 0, 0.45), (${w}, ${d}, 0.86), mat_secondary, 0.003))
    parts.append(add_part(col, "Siemens_iQ500_Firin", "cube", (0, ${(-d * 0.04).toFixed(3)}, 0.48), (0.595, 0.56, 0.595), mat_primary, 0.004))
    parts.append(add_part(col, "Siemens_Induksiyon_Ocak", "cube", (0, 0, 0.895), (0.595, 0.52, 0.014), mat_glass, 0.001))
    parts.append(add_part(col, "Siemens_Egimli_Davlumbaz", "cube", (0, ${(-d * 0.10).toFixed(3)}, 1.74), (0.60, 0.34, 0.42), mat_primary, 0.004, (math.radians(34), 0, 0)))
    parts.append(add_part(col, "Davlumbaz_Baca_Kulesi", "cube", (0, ${(d * 0.28).toFixed(3)}, 2.04), (0.24, 0.22, 0.44), mat_accent, 0.002))`;

    case 'tr_vestel_rustik_set_3':
      return `    # Vestel Rustik Country 3'lü Ankastre Set (Analog Saatli Fırın + Rustik Ocak + Piramit Davlumbaz)
    parts.append(add_part(col, "Rustik_Alt_Kasa", "cube", (0, 0, 0.45), (${w}, ${d}, 0.86), mat_secondary, 0.003))
    parts.append(add_part(col, "Vestel_Rustik_Firin", "cube", (0, ${(-d * 0.04).toFixed(3)}, 0.48), (0.595, 0.56, 0.595), mat_primary, 0.005))
    parts.append(add_part(col, "Rustik_Pirinc_Kulp", "cylinder", (0, ${(-d * 0.54).toFixed(3)}, 0.65), (0.016, 0.016, 0.46), mat_accent, 0.0, (0, math.radians(90), 0)))
    parts.append(add_part(col, "Vestel_Rustik_Emaye_Ocak", "cube", (0, 0, 0.90), (0.59, 0.52, 0.048), mat_primary, 0.003))
    parts.append(add_part(col, "Vestel_Piramit_Davlumbaz", "cube", (0, 0, 1.68), (0.60, 0.48, 0.28), mat_primary, 0.005))
    parts.append(add_part(col, "Piramit_Baca_Govde", "cube", (0, ${(d * 0.18).toFixed(3)}, 1.98), (0.24, 0.22, 0.48), mat_primary, 0.003))`;

    case 'tr_bosch_serie8_oven':
      return `    # Bosch Serie 8 HBG675BB1 Dijital Kontrol Halkalı Ankastre Fırın (60x57x60 cm)
    parts.append(add_part(col, "Firin_Ankastre_Kasa", "cube", (0, 0.01, ${(h * 0.5).toFixed(3)}), (${(w - 0.02).toFixed(3)}, ${(d - 0.02).toFixed(3)}, ${(h - 0.015).toFixed(3)}), mat_secondary, 0.003))
    parts.append(add_part(col, "Siyah_Cam_On_Kapak", "cube", (0, ${(-d * 0.48).toFixed(3)}, ${(h * 0.42).toFixed(3)}), (${w}, 0.024, ${(h * 0.78).toFixed(3)}), mat_primary, 0.003))
    parts.append(add_part(col, "Serie8_TFT_Halka", "cylinder", (0, ${(-d * 0.51).toFixed(3)}, ${(h * 0.89).toFixed(3)}), (0.068, 0.068, 0.014), mat_accent, 0.0, (math.radians(90), 0, 0)))
    parts.append(add_part(col, "Paslanmaz_Firin_Kulpu", "cylinder", (0, ${(-d * 0.54).toFixed(3)}, ${(h * 0.74).toFixed(3)}), (0.016, 0.016, ${(w * 0.84).toFixed(3)}), mat_accent, 0.0, (0, math.radians(90), 0)))`;

    case 'tr_siemens_iq700_oven':
      return `    # Siemens iQ700 HB676G0S1 studioLine TFT Ankastre Cam Fırın (60x57x60 cm)
    parts.append(add_part(col, "iQ700_Ankastre_Kasa", "cube", (0, 0.01, ${(h * 0.5).toFixed(3)}), (${(w - 0.02).toFixed(3)}, ${(d - 0.02).toFixed(3)}, ${(h - 0.015).toFixed(3)}), mat_secondary, 0.003))
    parts.append(add_part(col, "studioLine_Siyah_Cam_Kapak", "cube", (0, ${(-d * 0.48).toFixed(3)}, ${(h * 0.42).toFixed(3)}), (${w}, 0.024, ${(h * 0.78).toFixed(3)}), mat_primary, 0.003))
    parts.append(add_part(col, "iQ700_Kontrol_Seridi", "cube", (0, ${(-d * 0.49).toFixed(3)}, ${(h * 0.89).toFixed(3)}), (${w}, 0.02, 0.11), mat_glass, 0.002))
    parts.append(add_part(col, "Minimal_Bar_Kulp", "cube", (0, ${(-d * 0.54).toFixed(3)}, ${(h * 0.74).toFixed(3)}), (${(w * 0.86).toFixed(3)}, 0.022, 0.018), mat_accent, 0.002))`;

    case 'tr_vestel_builtin_oven':
      return `    # Vestel AF-8784 ProChef Pop-Up Düğmeli Ankastre Cam Fırın (60x57x60 cm)
    parts.append(add_part(col, "Vestel_Ankastre_Kasa", "cube", (0, 0.01, ${(h * 0.5).toFixed(3)}), (${(w - 0.02).toFixed(3)}, ${(d - 0.02).toFixed(3)}, ${(h - 0.015).toFixed(3)}), mat_secondary, 0.003))
    parts.append(add_part(col, "Temperli_Cam_Kapak", "cube", (0, ${(-d * 0.48).toFixed(3)}, ${(h * 0.42).toFixed(3)}), (${w}, 0.024, ${(h * 0.78).toFixed(3)}), mat_primary, 0.003))
    parts.append(add_part(col, "Sol_PopUp_Dugme", "cylinder", (-0.17, ${(-d * 0.51).toFixed(3)}, ${(h * 0.89).toFixed(3)}), (0.036, 0.036, 0.022), mat_accent, 0.0, (math.radians(90), 0, 0)))
    parts.append(add_part(col, "Sag_PopUp_Dugme", "cylinder", (0.17, ${(-d * 0.51).toFixed(3)}, ${(h * 0.89).toFixed(3)}), (0.036, 0.036, 0.022), mat_accent, 0.0, (math.radians(90), 0, 0)))
    parts.append(add_part(col, "Firin_Boru_Kulpu", "cylinder", (0, ${(-d * 0.54).toFixed(3)}, ${(h * 0.74).toFixed(3)}), (0.016, 0.016, ${(w * 0.82).toFixed(3)}), mat_accent, 0.0, (0, math.radians(90), 0)))`;

    case 'tr_builtin_microwave':
      return `    # Bosch Serie 6 / Siemens iQ500 Çerçeveli Ankastre Mikrodalga Fırın (60x38x38 cm)
    parts.append(add_part(col, "Mikrodalga_Ankastre_Kasa", "cube", (0, 0.01, ${(h * 0.5).toFixed(3)}), (${(w - 0.03).toFixed(3)}, ${(d - 0.02).toFixed(3)}, ${(h - 0.02).toFixed(3)}), mat_secondary, 0.003))
    parts.append(add_part(col, "On_Ankastre_Cerceve", "cube", (0, ${(-d * 0.48).toFixed(3)}, ${(h * 0.5).toFixed(3)}), (${w}, 0.022, ${h}), mat_primary, 0.003))
    parts.append(add_part(col, "Sol_Fume_Cam_Kapak", "cube", (-0.06, ${(-d * 0.50).toFixed(3)}, ${(h * 0.5).toFixed(3)}), (${(w * 0.70).toFixed(3)}, 0.012, ${(h * 0.82).toFixed(3)}), mat_glass, 0.002))`;

    case 'tr_induction_hob_60':
      return `    # Bosch Serie 6 / Siemens iQ500 60 cm 4 Gözlü Schott Ceran İndüksiyon Ankastre Ocak
    parts.append(add_part(col, "Alt_Sogutma_Kasasi", "cube", (0, 0, ${(h * 0.36).toFixed(3)}), (${(w - 0.04).toFixed(3)}, ${(d - 0.04).toFixed(3)}, ${(h * 0.70).toFixed(3)}), mat_secondary, 0.002))
    parts.append(add_part(col, "Schott_Ceran_Cam_Tabla", "cube", (0, 0, ${(h - 0.005).toFixed(3)}), (${w}, ${d}, 0.009), mat_primary, 0.001))`;

    case 'tr_gas_glass_hob_60':
      return `    # Bosch / Arçelik / Siemens 60 cm 4 Gözlü Doğalgazlı Döküm Izgaralı Cam Ocak
    parts.append(add_part(col, "Alt_Ankastre_Kasa", "cube", (0, 0, 0.024), (${(w - 0.04).toFixed(3)}, ${(d - 0.04).toFixed(3)}, 0.044), mat_secondary, 0.002))
    parts.append(add_part(col, "Temperli_Cam_Tabla", "cube", (0, 0, 0.052), (${w}, ${d}, 0.012), mat_primary, 0.002))
    parts.append(add_part(col, "Dokum_Izgara_Sol", "cube", (-0.145, -0.02, 0.078), (0.24, 0.42, 0.032), mat_secondary, 0.002))
    parts.append(add_part(col, "Dokum_Izgara_Sag", "cube", (0.145, -0.02, 0.078), (0.24, 0.42, 0.032), mat_secondary, 0.002))`;

    case 'tr_wok_gas_hob_75':
      return `    # Franke / Bosch 75 cm 5 Gözlü Merkezi Wok Brülörlü Gazlı Ankastre Ocak
    parts.append(add_part(col, "Alt_Ankastre_Kasa_75", "cube", (0, 0, 0.024), (${(w - 0.05).toFixed(3)}, ${(d - 0.04).toFixed(3)}, 0.044), mat_secondary, 0.002))
    parts.append(add_part(col, "Genis_Temperli_Tabla_75", "cube", (0, 0, 0.052), (${w}, ${d}, 0.012), mat_primary, 0.002))
    parts.append(add_part(col, "Merkezi_Wok_Brulor", "cylinder", (0, -0.01, 0.076), (0.135, 0.135, 0.032), mat_accent, 0.0))
    parts.append(add_part(col, "Uclu_Dokum_Izgara_Grubu", "cube", (0, -0.01, 0.080), (${(w * 0.90).toFixed(3)}, ${(d * 0.78).toFixed(3)}, 0.032), mat_secondary, 0.002))`;

    case 'tr_downdraft_induction_hob':
      return `    # Siemens iQ500 / Bosch Serie 8 80 cm Dahili Davlumbazlı (Downdraft) İndüksiyon Ocak
    parts.append(add_part(col, "Downdraft_Motor_Kasasi", "cube", (0, 0, ${(h * 0.46).toFixed(3)}), (${(w - 0.05).toFixed(3)}, ${(d - 0.05).toFixed(3)}, ${(h * 0.90).toFixed(3)}), mat_secondary, 0.003))
    parts.append(add_part(col, "Schott_Ceran_80cm_Tabla", "cube", (0, 0, ${(h - 0.006).toFixed(3)}), (${w}, ${d}, 0.010), mat_primary, 0.001))
    parts.append(add_part(col, "Merkezi_Emmis_Izgarasi", "cube", (0, 0, ${(h - 0.002).toFixed(3)}), (0.14, 0.36, 0.016), mat_accent, 0.002))`;

    case 'tr_angled_glass_hood':
      return `    # Silverline / Bosch 60 cm Eğimli Temperli Cam Duvar Tipi Ankastre Davlumbaz
    parts.append(add_part(col, "Davlumbaz_Baca_Kulesi", "cube", (0, ${(d * 0.24).toFixed(3)}, ${(h * 0.68).toFixed(3)}), (0.24, 0.22, ${(h * 0.62).toFixed(3)}), mat_secondary, 0.002))
    parts.append(add_part(col, "Egimli_Cam_On_Panel", "cube", (0, ${(-d * 0.12).toFixed(3)}, ${(h * 0.26).toFixed(3)}), (${w}, 0.035, 0.42), mat_primary, 0.003, (math.radians(32), 0, 0)))`;

    case 'tr_island_t_hood_90':
      return `    # Franke / Silverline 90 cm Tavandan Askılı T-Tipi Ada Mutfak Davlumbazı
    parts.append(add_part(col, "Tavan_Flansi", "cube", (0, 0, ${(h - 0.012).toFixed(3)}), (0.36, 0.34, 0.024), mat_primary, 0.002))
    parts.append(add_part(col, "Dikey_Ada_Baca_Kolonu", "cube", (0, 0, ${(h * 0.56).toFixed(3)}), (0.30, 0.28, ${(h * 0.84).toFixed(3)}), mat_primary, 0.003))
    parts.append(add_part(col, "Yatay_90cm_Emmis_Kanonu", "cube", (0, 0, 0.045), (${w}, ${d}, 0.085), mat_primary, 0.003))
    parts.append(add_part(col, "Aluminyum_Yag_Filtreleri", "cube", (0, 0, 0.008), (${(w * 0.82).toFixed(3)}, ${(d * 0.72).toFixed(3)}, 0.012), mat_accent, 0.001))`;

    case 'tr_recessed_cabinet_hood':
      return `    # Teka / Silverline 55 cm Üst Dolap İçi Gizli Gömme Ankastre Aspiratör Davlumbaz
    parts.append(add_part(col, "Dolap_Ici_Motor_Kasasi", "cube", (0, 0, ${(h * 0.54).toFixed(3)}), (${(w - 0.04).toFixed(3)}, ${(d - 0.03).toFixed(3)}, ${(h * 0.88).toFixed(3)}), mat_secondary, 0.002))
    parts.append(add_part(col, "Alt_Gorunen_Cerceve", "cube", (0, 0, 0.012), (${w}, ${d}, 0.022), mat_primary, 0.002))
    parts.append(add_part(col, "Aluminyum_Filtre_Kaseti", "cube", (0, 0, 0.004), (${(w * 0.72).toFixed(3)}, ${(d * 0.68).toFixed(3)}, 0.010), mat_accent, 0.001))`;

    case 'tr_builtin_coffee_machine':
      return `    # Siemens iQ700 / Bosch Serie 8 Tam Otomatik Boy Dolap Ankastre Kahve Makinesi (60x45 cm)
    parts.append(add_part(col, "Ankastre_Kahve_Kasasi", "cube", (0, 0.01, ${(h * 0.5).toFixed(3)}), (${(w - 0.02).toFixed(3)}, ${(d - 0.02).toFixed(3)}, ${(h - 0.02).toFixed(3)}), mat_secondary, 0.003))
    parts.append(add_part(col, "Siyah_Cam_On_Cephe", "cube", (0, ${(-d * 0.48).toFixed(3)}, ${(h * 0.5).toFixed(3)}), (${w}, 0.024, ${h}), mat_primary, 0.003))
    parts.append(add_part(col, "Fincan_Demleme_Nisi", "cube", (-0.06, ${(-d * 0.42).toFixed(3)}, ${(h * 0.34).toFixed(3)}), (0.24, 0.14, 0.22), mat_secondary, 0.002))
    parts.append(add_part(col, "Paslanmaz_Damlama_Izgarasi", "cube", (-0.06, ${(-d * 0.42).toFixed(3)}, ${(h * 0.14).toFixed(3)}), (0.22, 0.12, 0.016), mat_accent, 0.001))`;

    case 'tr_builtin_fridge_column':
      return `    # Bosch / Siemens 60x185 cm Tam Ankastre Kombi No-Frost Buzdolabı Kulesi
    parts.append(add_part(col, "Ankastre_Dolap_Karkasi", "cube", (0, 0, ${(h * 0.5).toFixed(3)}), (${w}, ${d}, ${h}), mat_primary, 0.004))
    parts.append(add_part(col, "Ust_Sogutucu_Kapagi", "cube", (0, ${(-d * 0.51).toFixed(3)}, ${(h * 0.68).toFixed(3)}), (${(w - 0.008).toFixed(3)}, 0.022, ${(h * 0.56).toFixed(3)}), mat_primary, 0.003))
    parts.append(add_part(col, "Alt_Dondurucu_Kapagi", "cube", (0, ${(-d * 0.51).toFixed(3)}, ${(h * 0.22).toFixed(3)}), (${(w - 0.008).toFixed(3)}, 0.022, ${(h * 0.34).toFixed(3)}), mat_primary, 0.003))
    parts.append(add_part(col, "Alt_Havalandirma_Baza_Izgara", "cube", (0, ${(-d * 0.46).toFixed(3)}, 0.045), (${(w - 0.04).toFixed(3)}, 0.02, 0.08), mat_secondary, 0.002))`;

    case 'tr_mirrored_6door_wardrobe':
      return `    # Enza Home / Bellona 240 cm 6 Kapaklı Aynalı & Alt Çekmeceli Gardırop
    parts.append(add_part(col, "Gardirop_Ana_Karkas", "cube", (0, 0, ${(h * 0.5).toFixed(3)}), (${w}, ${(d - 0.025).toFixed(3)}, ${h}), mat_primary, 0.004))
    parts.append(add_part(col, "Orta_Aynali_Kapak_Grubu", "cube", (0, ${(-d * 0.505).toFixed(3)}, ${(h * 0.52).toFixed(3)}), (${(w * 0.33).toFixed(3)}, 0.024, ${(h * 0.88).toFixed(3)}), mat_accent, 0.002))
    parts.append(add_part(col, "Alt_Cekmece_Modulleri", "cube", (0, ${(-d * 0.505).toFixed(3)}, ${(h * 0.14).toFixed(3)}), (${(w * 0.96).toFixed(3)}, 0.024, ${(h * 0.22).toFixed(3)}), mat_secondary, 0.003))`;

    case 'tr_glass_walkin_wardrobe':
      return `    # Lazzoni / Lineadecor 260 cm Füme Cam Kapaklı & İç Şerit LED Giyinme Dolabı
    parts.append(add_part(col, "Giyinme_Dolabi_Karkas", "cube", (0, 0.02, ${(h * 0.5).toFixed(3)}), (${w}, ${(d - 0.04).toFixed(3)}, ${h}), mat_secondary, 0.004))
    parts.append(add_part(col, "Fume_Cam_Aluminyum_Kapaklar", "cube", (0, ${(-d * 0.49).toFixed(3)}, ${(h * 0.51).toFixed(3)}), (${(w - 0.02).toFixed(3)}, 0.024, ${(h - 0.06).toFixed(3)}), mat_accent, 0.002))
    parts.append(add_part(col, "Ic_Aski_Borusu_ve_Raflar", "cylinder", (0, -0.02, ${(h * 0.72).toFixed(3)}), (0.022, 0.022, ${(w * 0.86).toFixed(3)}), mat_primary, 0.0, (0, math.radians(90), 0)))`;

    case 'tr_sliding_wardrobe_220':
      return `    # Doğtaş / Kelebek 220 cm Çıtalı Meşe & Füme Aynalı Sürgülü Gardırop
    parts.append(add_part(col, "Surgulu_Dolap_Karkas", "cube", (0, 0.02, ${(h * 0.5).toFixed(3)}), (${w}, ${(d - 0.05).toFixed(3)}, ${h}), mat_primary, 0.004))
    parts.append(add_part(col, "Sol_Citali_Surgu_Kapak", "cube", (${(-w * 0.24).toFixed(3)}, ${(-d * 0.48).toFixed(3)}, ${(h * 0.51).toFixed(3)}), (${(w * 0.51).toFixed(3)}, 0.026, ${(h - 0.08).toFixed(3)}), mat_secondary, 0.003))
    parts.append(add_part(col, "Sag_Aynali_Surgu_Kapak", "cube", (${(w * 0.24).toFixed(3)}, ${(-d * 0.505).toFixed(3)}, ${(h * 0.51).toFixed(3)}), (${(w * 0.51).toFixed(3)}, 0.024, ${(h - 0.08).toFixed(3)}), mat_accent, 0.002))`;

    case 'tr_kids_3door_wardrobe':
      return `    # Çilek Mobilya 135 cm 3 Kapaklı & Çekmeceli Çocuk Odası Gardırobu
    parts.append(add_part(col, "Cocuk_Gardirop_Govde", "cube", (0, 0, ${(h * 0.52).toFixed(3)}), (${w}, ${(d - 0.02).toFixed(3)}, ${(h - 0.12).toFixed(3)}), mat_primary, 0.005))
    parts.append(add_part(col, "Masif_Kayin_Ayak_Bazasi", "cube", (0, 0, 0.06), (${(w - 0.06).toFixed(3)}, ${(d - 0.06).toFixed(3)}, 0.12), mat_secondary, 0.004))
    parts.append(add_part(col, "Ahsap_Kulplar", "cylinder", (0, ${(-d * 0.51).toFixed(3)}, ${(h * 0.55).toFixed(3)}), (0.04, 0.04, 0.024), mat_accent, 0.0, (math.radians(90), 0, 0)))`;

    case 'tr_tall_filled_bookcase':
      return `    # Enza Home / Vivense 100x210 cm 5 Katlı Dolu Mimari Kitaplık
    parts.append(add_part(col, "Kitaplik_Arkalik_ve_Govde", "cube", (0, ${(d * 0.35).toFixed(3)}, ${(h * 0.5).toFixed(3)}), (${w}, 0.022, ${h}), mat_primary, 0.003))
    for i in range(6):
        rz = 0.08 + i * ${((h - 0.16) / 5).toFixed(3)}
        parts.append(add_part(col, f"Kitaplik_Rafi_{i+1}", "cube", (0, 0, rz), (${(w - 0.04).toFixed(3)}, ${(d - 0.02).toFixed(3)}, 0.026), mat_primary, 0.002))
    parts.append(add_part(col, "Alt_Dolap_Kapaklari", "cube", (0, ${(-d * 0.48).toFixed(3)}, 0.24), (${(w - 0.04).toFixed(3)}, 0.022, 0.36), mat_secondary, 0.003))`;

    case 'tr_arched_fluted_bookcase':
      return `    # Lazzoni / Mudo Concept 110x220 cm Kemerli Niş & Fluted Kapaklı Villa Kitaplığı
    parts.append(add_part(col, "Kemerli_Kitaplik_Ana_Govde", "cube", (0, 0.01, ${(h * 0.48).toFixed(3)}), (${w}, ${d}, ${(h * 0.92).toFixed(3)}), mat_primary, 0.005))
    parts.append(add_part(col, "Ust_Kemer_Tac", "cylinder", (0, 0.01, ${(h * 0.78).toFixed(3)}), (${(w * 0.98).toFixed(3)}, ${(w * 0.98).toFixed(3)}, ${d}), mat_primary, 0.0, (math.radians(90), 0, 0)))
    parts.append(add_part(col, "Alt_Fluted_Kapak_Grubu", "cube", (0, ${(-d * 0.49).toFixed(3)}, 0.36), (${(w - 0.05).toFixed(3)}, 0.026, 0.64), mat_secondary, 0.003))`;

    case 'tr_study_desk_hutch_set':
      return `    # Adore / Rani 140 cm Üst Kitaplıklı & Çekmeceli Öğrenci Çalışma Masası
    parts.append(add_part(col, "Calisma_Masasi_Tablasi", "cube", (0, 0, 0.74), (${w}, ${d}, 0.032), mat_primary, 0.003))
    parts.append(add_part(col, "Sag_Cekmece_Kesonu", "cube", (${(w * 0.34).toFixed(3)}, 0, 0.37), (0.42, ${(d - 0.06).toFixed(3)}, 0.72), mat_secondary, 0.003))
    parts.append(add_part(col, "Ust_Kitaplik_Modulu", "cube", (0, ${(d * 0.25).toFixed(3)}, ${(h * 0.76).toFixed(3)}), (${w}, 0.26, ${(h - 0.76).toFixed(3)}), mat_primary, 0.003))`;

    case 'tr_montessori_kids_bookshelf':
      return `    # Woody / Montessori TR 80 cm Ön Yüzü Görünen Çocuk Kitaplığı
    parts.append(add_part(col, "Montessori_Yan_Paneller", "cube", (0, 0, ${(h * 0.5).toFixed(3)}), (${w}, ${d}, ${h}), mat_primary, 0.006))
    for i in range(4):
        rz = 0.16 + i * 0.20
        parts.append(add_part(col, f"Kitap_Sergileme_Citas_{i+1}", "cube", (0, ${(-d * 0.42).toFixed(3)}, rz), (${(w - 0.04).toFixed(3)}, 0.02, 0.06), mat_secondary, 0.002))`;

    case 'tr_pen_holder_stationery_set':
      return `    # Faber-Castell / Gıpta Çok Gözlü Masaüstü Kalemlik & Kırtasiye Seti
    parts.append(add_part(col, "Kalemlik_Taban_Tepsisi", "cube", (0, 0, 0.014), (${w}, ${d}, 0.028), mat_primary, 0.003))
    parts.append(add_part(col, "Silindir_Kalemlik_Kabi", "cylinder", (${(-w * 0.22).toFixed(3)}, 0, 0.065), (0.085, 0.085, 0.115), mat_secondary, 0.0))
    parts.append(add_part(col, "Not_Kagidi_ve_Kalemler", "cube", (${(w * 0.20).toFixed(3)}, 0, 0.036), (0.095, 0.095, 0.055), mat_accent, 0.002))`;

    case 'tr_desk_organizer_tray':
      return `    # Bino / Mudo Concept Doğal Ahşap Çok Bölmeli Masaüstü Düzenleyici
    parts.append(add_part(col, "Duzenleyici_Alt_Kasa", "cube", (0, 0, ${(h * 0.35).toFixed(3)}), (${w}, ${d}, ${(h * 0.70).toFixed(3)}), mat_primary, 0.004))
    parts.append(add_part(col, "Arka_Evrak_Bolmesi", "cube", (0, ${(d * 0.25).toFixed(3)}, ${(h * 0.55).toFixed(3)}), (${(w - 0.02).toFixed(3)}, ${(d * 0.42).toFixed(3)}, ${(h * 0.88).toFixed(3)}), mat_secondary, 0.003))`;

    case 'tr_turkish_textbooks_stack':
      return `    # MEB / Palme Türkçe Ders Kitapları & Spiralli Defter İstifi
    for i in range(6):
        parts.append(add_part(col, f"Ders_Kitabi_{i+1}", "cube", (0, 0, 0.016 + i * 0.030), (${(w * 0.92).toFixed(3)}, ${(d * 0.88).toFixed(3)}, 0.026), mat_primary if i % 2 == 0 else mat_secondary, 0.002, (0, 0, math.radians((i - 2.5) * 4))))`;

    case 'tr_open_textbook_study_set':
      return `    # Açık Geometri Ders Kitabı, Spiralli Defter, Gönye & Kalem Çalışma Seti
    parts.append(add_part(col, "Acik_Ders_Kitabi", "cube", (${(-w * 0.16).toFixed(3)}, 0, 0.018), (${(w * 0.52).toFixed(3)}, ${(d * 0.76).toFixed(3)}, 0.032), mat_primary, 0.002))
    parts.append(add_part(col, "Spiralli_Kareli_Defter", "cube", (${(w * 0.24).toFixed(3)}, 0.02, 0.012), (${(w * 0.34).toFixed(3)}, ${(d * 0.68).toFixed(3)}, 0.020), mat_secondary, 0.002, (0, 0, math.radians(-8))))`;

    case 'tr_bookends_encyclopedia_row':
      return `    # 14 Ciltlik Mimari & Klasik Roman Kitap Dizisi + Traverten Kitap Tutucu Seti
    parts.append(add_part(col, "Sol_Traverten_Kitap_Tutucu", "cube", (${(-w * 0.44).toFixed(3)}, 0, ${(h * 0.36).toFixed(3)}), (0.055, ${(d * 0.65).toFixed(3)}, ${(h * 0.72).toFixed(3)}), mat_secondary, 0.004))
    parts.append(add_part(col, "Sag_Traverten_Kitap_Tutucu", "cube", (${(w * 0.44).toFixed(3)}, 0, ${(h * 0.36).toFixed(3)}), (0.055, ${(d * 0.65).toFixed(3)}, ${(h * 0.72).toFixed(3)}), mat_secondary, 0.004))
    parts.append(add_part(col, "Kitap_Sirasi_Blok", "cube", (0, 0, ${(h * 0.48).toFixed(3)}), (${(w * 0.76).toFixed(3)}, ${(d * 0.84).toFixed(3)}, ${(h * 0.94).toFixed(3)}), mat_primary, 0.003))`;

    case 'tr_modern_ultrabook_laptop':
      return `    # Apple / Monster 16" Alüminyum Gövde Türkçe Q Klavyeli Mimari Ultrabook Laptop
    parts.append(add_part(col, "Laptop_Aluminyum_Alt_Govde", "cube", (0, 0, 0.009), (${w}, ${d}, 0.016), mat_primary, 0.003))
    parts.append(add_part(col, "Laptop_16Inc_Ekran_Kapagi", "cube", (0, ${(d * 0.46).toFixed(3)}, ${(h * 0.52).toFixed(3)}), (${w}, 0.008, ${(h * 0.92).toFixed(3)}), mat_primary, 0.002, (math.radians(-18), 0, 0)))`;

    case 'tr_laptop_stand_workstation':
      return `    # Stantlı 16" Laptop, Türkçe Q Klavye, Mouse & Keçe Desk Mat Seti
    parts.append(add_part(col, "Kece_Desk_Mat", "cube", (0, 0, 0.003), (${w}, ${d}, 0.005), mat_secondary, 0.001))
    parts.append(add_part(col, "Aluminyum_Laptop_Standi", "cube", (${(-w * 0.14).toFixed(3)}, ${(d * 0.16).toFixed(3)}, 0.11), (0.34, 0.25, 0.18), mat_primary, 0.003))
    parts.append(add_part(col, "Kablosuz_Klavye_ve_Mouse", "cube", (${(-w * 0.06).toFixed(3)}, ${(-d * 0.24).toFixed(3)}, 0.012), (0.42, 0.13, 0.016), mat_accent, 0.002))`;

    case 'tr_dual_monitor_desk_setup':
      return `    # LG / Dell Çift 27" 4K CAD & Blender Monitörlü Mimar Çalışma İstasyonu
    parts.append(add_part(col, "Genis_Desk_Mat", "cube", (0, -0.05, 0.003), (${(w * 0.85).toFixed(3)}, 0.42, 0.005), mat_secondary, 0.001))
    parts.append(add_part(col, "Sol_27Inc_4K_Monitor", "cube", (${(-w * 0.26).toFixed(3)}, 0.12, ${(h * 0.64).toFixed(3)}), (0.61, 0.025, 0.36), mat_primary, 0.003, (0, 0, math.radians(-10))))
    parts.append(add_part(col, "Sag_27Inc_4K_Monitor", "cube", (${(w * 0.26).toFixed(3)}, 0.12, ${(h * 0.64).toFixed(3)}), (0.61, 0.025, 0.36), mat_primary, 0.003, (0, 0, math.radians(10))))`;

    case 'tr_montessori_rainbow_blocks':
      return `    # Woody / Montessori TR 7 Kemerli Doğal Ahşap Gökkuşağı & Denge Blok Seti
    parts.append(add_part(col, "Gokkusagi_Kemer_Grubu", "cylinder", (${(-w * 0.16).toFixed(3)}, 0, ${(h * 0.44).toFixed(3)}), (${(w * 0.54).toFixed(3)}, ${(w * 0.54).toFixed(3)}, 0.085), mat_primary, 0.0, (math.radians(90), 0, 0)))
    parts.append(add_part(col, "Ahsap_Denge_Kulesi", "cylinder", (${(w * 0.28).toFixed(3)}, 0, ${(h * 0.45).toFixed(3)}), (0.12, 0.12, ${(h * 0.88).toFixed(3)}), mat_secondary, 0.0))`;

    case 'tr_toddler_wooden_abacus_xylophone':
      return `    # Woody / Toyzz Shop 5 Sıralı Ahşap Bebek Abaküsü & 8 Tuşlu Ksilofon Seti
    parts.append(add_part(col, "Ahsap_Bebek_Abakusu", "cube", (${(-w * 0.22).toFixed(3)}, 0.02, ${(h * 0.5).toFixed(3)}), (0.28, 0.08, ${h}), mat_primary, 0.004))
    parts.append(add_part(col, "8_Tuslu_Ahsap_Ksilofon", "cube", (${(w * 0.22).toFixed(3)}, -0.02, 0.035), (0.30, 0.14, 0.06), mat_secondary, 0.003))`;

    case 'tr_kids_teepee_play_tent':
      return `    # Mudo Kids / Montessori TR 120x120x160 cm Pamuklu Keten Çocuk Oyun Çadırı (Tipi)
    parts.append(add_part(col, "Kapitone_Oyun_Minderi", "cube", (0, 0, 0.03), (${w}, ${d}, 0.06), mat_secondary, 0.01))
    parts.append(add_part(col, "Tipi_Kumas_Cadir_Govdesi", "cylinder", (0, 0, ${(h * 0.46).toFixed(3)}), (${(w * 0.92).toFixed(3)}, ${(d * 0.92).toFixed(3)}, ${(h * 0.86).toFixed(3)}), mat_primary, 0.0))`;

    case 'tr_wooden_kids_play_kitchen':
      return `    # Woody / Çilek 90 cm Montessori Ahşap Çocuk Oyun Mutfağı
    parts.append(add_part(col, "Oyun_Mutfagi_Alt_Tezgah", "cube", (0, 0, 0.28), (${w}, ${d}, 0.54), mat_primary, 0.005))
    parts.append(add_part(col, "Oyun_Mutfagi_Ust_Panel", "cube", (0, ${(d * 0.34).toFixed(3)}, ${(h * 0.72).toFixed(3)}), (${w}, 0.12, ${(h * 0.52).toFixed(3)}), mat_secondary, 0.004))`;

    case 'tr_kids_toy_storage_organizer':
      return `    # Çilek / Adore 100 cm 9 Sepetli Çocuk Odası Oyuncak Düzenleyici Dolap
    parts.append(add_part(col, "Oyuncak_Dolabi_Karkas", "cube", (0, 0, ${(h * 0.5).toFixed(3)}), (${w}, ${d}, ${h}), mat_primary, 0.005))
    for r in range(3):
        parts.append(add_part(col, f"Oyuncak_Sepet_Sirasi_{r+1}", "cube", (0, -0.02, 0.18 + r * 0.28), (${(w - 0.08).toFixed(3)}, ${(d - 0.06).toFixed(3)}, 0.21), mat_secondary, 0.004))`;

    case 'tr_wooden_dollhouse_3story':
      return `    # Woody / Toyzz Shop 85x120 cm 3 Katlı Mobilyalı Ahşap Çocuk Bebek Evi
    parts.append(add_part(col, "Bebek_Evi_3Katli_Govde", "cube", (0, 0, ${(h * 0.40).toFixed(3)}), (${w}, ${d}, ${(h * 0.76).toFixed(3)}), mat_primary, 0.004))
    parts.append(add_part(col, "Ucgen_Cati_Kat_Blok", "cube", (0, 0, ${(h * 0.86).toFixed(3)}), (${(w * 0.92).toFixed(3)}, ${(d + 0.04).toFixed(3)}, ${(h * 0.26).toFixed(3)}), mat_secondary, 0.005))`;

    default:
      return `    # Parametrik Türk mimari varlık kütlesi (${archetype})
    parts.append(add_part(col, "Ana_Baza", "cube", (0, 0, ${(h * 0.08).toFixed(3)}), (${(w * 0.92).toFixed(3)}, ${(d * 0.92).toFixed(3)}, ${(h * 0.16).toFixed(3)}), mat_secondary, 0.015))
    parts.append(add_part(col, "Ana_Govde", "cube", (0, 0, ${(h * 0.52).toFixed(3)}), (${w}, ${d}, ${(h * 0.72).toFixed(3)}), mat_primary, 0.03))`;
  }
}

export function generateBatchSceneScript(
  items: SceneSelectionItem[],
  baseUrl = 'http://localhost:3000',
): string {
  const placed = computeSceneLayout(items);
  if (placed.length === 0) {
    return `# MimarKatalog: Sahne listenizde henüz seçili varlık bulunmuyor.\n`;
  }

  const header = `"""
MimarKatalog — Toplu Blender 4.x Sahne Kurulum Betiği
Toplam Varlık: ${placed.length} adet
Koordinat Sistemi: Blender Metrik (1 BU = 1 Metre, Z-Yukarı)
"""
import bpy
import math
import os
import tempfile
import urllib.request
`;

  const blocks = placed.map((entry, idx) => {
    const single = generateBlenderPythonScript(
      entry.asset,
      entry.finish.id,
      entry.positionMeters,
      baseUrl,
      entry.finish,
    );
    const fnName = sanitizePythonName(entry.asset.slug || entry.asset.name);
    const uniqueFn = `${fnName}_${idx + 1}`;
    return single
      .replace(/^"""[\s\S]*?"""[\s\S]*?(?=def )/m, '')
      .replaceAll(`def build_${fnName}`, `def build_${uniqueFn}`)
      .replaceAll(`def import_${fnName}`, `def import_${uniqueFn}`)
      .replaceAll(`MimarKatalog_${fnName}`, `MimarKatalog_${uniqueFn}`)
      .replace(/if __name__ == "__main__":[\s\S]*$/m, '')
      .trim();
  });

  const runnerCalls = placed
    .map((entry, idx) => {
      const fnName = sanitizePythonName(entry.asset.slug || entry.asset.name);
      const prefix =
        entry.asset.modelSource?.provider === 'polyhaven' ||
        entry.asset.modelSource?.provider === 'khronos' ||
        entry.asset.modelSource?.provider === 'abo' ||
        entry.asset.modelSource?.provider === 'hf'
          ? 'import'
          : 'build';
      const { x, y, z } = entry.positionMeters;
      return `    ${prefix}_${fnName}_${idx + 1}(origin=(${x}, ${y}, ${z}))  # ${entry.asset.name} (${entry.finish.label})`;
    })
    .join('\n');

  return `${header}
${blocks.join('\n\n')}

if __name__ == "__main__":
${runnerCalls}
    print("MimarKatalog: ${placed.length} adet 3D mimari varlık sahneye eklendi.")
`;
}

export function generateLlmsTxt(baseUrl: string, assets: ArchitecturalAsset[]): string {
  const lines = [
    '# MimarKatalog — Türkiye Mimari Blender 3D Varlık Kütüphanesi',
    '',
    `> Blender 4.x ile villa, apartman dış cephe ve iç mekan görselleştirme projeleri için yapay zeka ajanlarının (LLM / Blender MCP / Python) doğrudan sorgulayıp seçebileceği ${assets.length} adet hazır modern mobilya (.GLB), Poly Haven CC0 (.GLTF/.BLEND) ve Türk mimari 3D varlık API servisi.`,
    '',
    '## API Endpoints',
    `- GET ${baseUrl}/api/v1/catalog : Tüm 3D mimari varlıkları JSON olarak listeler (?q=, ?category=, ?placement=, ?maxWidthCm= destekler). Her kayıtta referenceImageUrl, modelSource (gltfUrl, blendUrl), modelingSpec ve aiRenderPrompt bulunur.`,
    `- GET ${baseUrl}/api/v1/catalog/:id : Tek bir varlığın metrik ölçülerini, Cycles PBR shader tarifini, doku/püskül detaylarını, AI promptlarını ve hazır 3D model URL'sini döndürür`,
    `- GET ${baseUrl}/api/v1/polyhaven/search?q=sofa : Poly Haven 522+ hazır CC0 Blender 3D model havuzunda canlı arama yapar`,
    `- GET ${baseUrl}/api/v1/polyhaven/:id/model.gltf : Herhangi bir Poly Haven CC0 modelini geçerli CDN doku bağlantılarıyla anında glTF 2.0 olarak servis eder`,
    `- GET ${baseUrl}/api/v1/catalog/:id/blender-script : Varlığı Blender içinde 1:1 metrik ölçekle yükleyen .py betiğini döndürür`,
    `- GET ${baseUrl}/api/v1/selection : Kullanıcının veya yapay zekanın seçtiği güncel Blender sahne listesini döndürür`,
    `- POST ${baseUrl}/api/v1/selection : JSON { "assetId": "...", "finishId": "...", "addedBy": "ai" } ile sahneye varlık ekler`,
    `- GET ${baseUrl}/api/v1/selection/blender-script : Seçili tüm varlıkları çakışmasız (X,Y,Z) yerleşimle kuran toplu Blender Python betiğini indirir`,
    `- POST ${baseUrl}/api/v1/ai-select : Doğal dilde mimari brif vererek katalogdan otomatik seçim yapar`,
    `- GET ${baseUrl}/api/v1/master-instructions : Projenin MASTER.md talimat dosyasını (tüm kullanıcı istekleri ve kuralları) döndürür`,
    '',
    `## Mevcut Katalog (${assets.length} Varlık)`,
    ...assets.map(
      (a) =>
        `- [${a.id}] ${a.name} | ${a.category} | ${a.dimensionsCm.width}x${a.dimensionsCm.depth}x${a.dimensionsCm.height} cm | Kaynak: ${a.modelSource.provider} | Etiketler: ${a.searchKeywords.slice(0, 4).join(', ')}`,
    ),
  ];
  return lines.join('\n');
}
