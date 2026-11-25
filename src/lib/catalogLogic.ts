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
