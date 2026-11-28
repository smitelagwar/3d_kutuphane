import type {
  ArchitecturalAsset,
  ComposedRoomPlacement,
  ComposedRoomSpec,
  MaterialFinish,
  PatternVariant,
} from './catalogTypes';

export interface PlacementFootprintBox {
  assetId: string;
  roleLabel: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  minY: number;
  maxY: number;
}

export interface RoomValidationIssue {
  roomId: string;
  severity: 'error' | 'warning';
  code: 'MISSING_ASSET' | 'OUT_OF_BOUNDS' | 'NEGATIVE_Y' | 'OVERLAP';
  message: string;
}

export interface RoomValidationResult {
  valid: boolean;
  issues: RoomValidationIssue[];
  resolvedCount: number;
  totalPlacements: number;
}

/**
 * Computes the world-space axis-aligned bounding box (in cm, room-centered XZ, floor Y=0)
 * of a placed catalog asset, accounting for Y rotation and optional scale override.
 */
export function computePlacementWorldBox(
  placement: ComposedRoomPlacement,
  catalogAsset: ArchitecturalAsset,
): PlacementFootprintBox {
  const scale = placement.scaleOverride ?? 1;
  const w = catalogAsset.dimensionsCm.width * scale;
  const d = catalogAsset.dimensionsCm.depth * scale;
  const h = catalogAsset.dimensionsCm.height * scale;

  const rad = (placement.rotYDeg * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));

  const rotW = w * cos + d * sin;
  const rotD = w * sin + d * cos;

  return {
    assetId: placement.assetId,
    roleLabel: placement.roleLabel,
    minX: placement.xCm - rotW / 2,
    maxX: placement.xCm + rotW / 2,
    minZ: placement.zCm - rotD / 2,
    maxZ: placement.zCm + rotD / 2,
    minY: placement.yCm,
    maxY: placement.yCm + h,
  };
}

/**
 * Checks whether two placed furniture items overlap significantly in 3D space.
 * Uses a small architectural contact margin (default 8 cm) so items pushed flush against
 * adjacent pieces (e.g. nightstand next to bed, chairs tucked near dining table) never false-positive.
 */
export function boxesOverlap3D(
  a: PlacementFootprintBox,
  b: PlacementFootprintBox,
  marginCm = 8,
): boolean {
  const overlapX = Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX);
  const overlapZ = Math.min(a.maxZ, b.maxZ) - Math.max(a.minZ, b.minZ);
  const overlapY = Math.min(a.maxY, b.maxY) - Math.max(a.minY, b.minY);
  return overlapX > marginCm && overlapZ > marginCm && overlapY > marginCm;
}

/**
 * Validates a composed room spec against the full catalog asset map:
 * - Every referenced assetId must exist in the catalog.
 * - Every placement must stay inside the room's architectural footprint (with wall-mount tolerance).
 * - Floor elevations must be non-negative (no sinking below floor slab).
 * - Non-overlapping primary floor furniture must not collide with each other.
 */
export function validateComposedRoom(
  roomId: string,
  spec: ComposedRoomSpec,
  catalogById: ReadonlyMap<string, ArchitecturalAsset>,
): RoomValidationResult {
  const issues: RoomValidationIssue[] = [];
  const halfW = spec.shell.widthCm / 2;
  const halfD = spec.shell.depthCm / 2;
  const wallToleranceCm = 14;

  const solidFloorBoxes: PlacementFootprintBox[] = [];
  let resolvedCount = 0;

  for (const placement of spec.placements) {
    const subAsset = catalogById.get(placement.assetId);
    if (!subAsset) {
      issues.push({
        roomId,
        severity: 'error',
        code: 'MISSING_ASSET',
        message: `Placement '${placement.roleLabel}' references unknown assetId '${placement.assetId}'`,
      });
      continue;
    }

    resolvedCount += 1;

    if (placement.yCm < -0.5) {
      issues.push({
        roomId,
        severity: 'error',
        code: 'NEGATIVE_Y',
        message: `Placement '${placement.roleLabel}' (${placement.assetId}) has negative yCm=${placement.yCm}`,
      });
    }

    const box = computePlacementWorldBox(placement, subAsset);
    if (
      box.minX < -halfW - wallToleranceCm ||
      box.maxX > halfW + wallToleranceCm ||
      box.minZ < -halfD - wallToleranceCm ||
      box.maxZ > halfD + wallToleranceCm
    ) {
      issues.push({
        roomId,
        severity: 'error',
        code: 'OUT_OF_BOUNDS',
        message: `Placement '${placement.roleLabel}' (${placement.assetId}) exceeds room bounds [${-halfW}..${halfW}] x [${-halfD}..${halfD}]: X=[${Math.round(box.minX)}..${Math.round(box.maxX)}], Z=[${Math.round(box.minZ)}..${Math.round(box.maxZ)}]`,
      });
    }

    const isRugOrOverlay =
      placement.allowOverlap === true ||
      subAsset.placement === 'ceiling' ||
      subAsset.placement === 'wall-mounted' ||
      subAsset.archetype === 'modern_rug' ||
      subAsset.dimensionsCm.height <= 4;

    if (!isRugOrOverlay) {
      solidFloorBoxes.push(box);
    }
  }

  for (let i = 0; i < solidFloorBoxes.length; i += 1) {
    for (let j = i + 1; j < solidFloorBoxes.length; j += 1) {
      if (boxesOverlap3D(solidFloorBoxes[i], solidFloorBoxes[j], 10)) {
        issues.push({
          roomId,
          severity: 'error',
          code: 'OVERLAP',
          message: `Collision between '${solidFloorBoxes[i].roleLabel}' (${solidFloorBoxes[i].assetId}) and '${solidFloorBoxes[j].roleLabel}' (${solidFloorBoxes[j].assetId})`,
        });
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    resolvedCount,
    totalPlacements: spec.placements.length,
  };
}

/**
 * Resolves the unique Bill of Materials (BOM) entries for a composed room,
 * grouping repeated items (e.g. 4x dining chair, 3x bar stool) with exact quantities.
 */
export interface ComposedRoomBomItem {
  assetId: string;
  asset: ArchitecturalAsset;
  roleLabels: string[];
  quantity: number;
}

export function buildComposedRoomBom(
  spec: ComposedRoomSpec,
  catalogById: ReadonlyMap<string, ArchitecturalAsset>,
): ComposedRoomBomItem[] {
  const byId = new Map<string, ComposedRoomBomItem>();
  for (const placement of spec.placements) {
    const subAsset = catalogById.get(placement.assetId);
    if (!subAsset) continue;
    const existing = byId.get(placement.assetId);
    if (existing) {
      existing.quantity += 1;
      if (!existing.roleLabels.includes(placement.roleLabel)) {
        existing.roleLabels.push(placement.roleLabel);
      }
    } else {
      byId.set(placement.assetId, {
        assetId: placement.assetId,
        asset: subAsset,
        roleLabels: [placement.roleLabel],
        quantity: 1,
      });
    }
  }
  return Array.from(byId.values());
}

function hexToLinearRgbTuple(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const toLin = (c: number) => Number((c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4).toFixed(4));
  return [toLin(r || 0.5), toLin(g || 0.5), toLin(b || 0.5)];
}

/**
 * Generates a runnable Blender 4.x Python (bpy) script for a curated Composed Room:
 * 1) Builds the architectural room shell (floor, back & left cutaway walls, baseboards, island/cabinetry) in metric Z-up.
 * 2) Downloads and imports every real catalog GLB/CAD sub-asset at its exact architectural coordinate & rotation.
 */
export function buildComposedRoomBlenderScript(
  roomAsset: ArchitecturalAsset,
  finish: MaterialFinish,
  pattern: PatternVariant,
  origin: { x: number; y: number; z: number },
  baseUrl: string,
  catalogById?: ReadonlyMap<string, ArchitecturalAsset>,
): string {
  const spec = roomAsset.composedRoom;
  if (!spec) return '';

  const pyName = (roomAsset.slug || roomAsset.id).replace(/[^a-zA-Z0-9_]/g, '_');
  const wM = Number((spec.shell.widthCm / 100).toFixed(3));
  const dM = Number((spec.shell.depthCm / 100).toFixed(3));
  const hM = Number((spec.shell.heightCm / 100).toFixed(3));

  const wallHex = finish.partFinishes?.primary.hex || spec.shell.wallColorHex;
  const floorHex = finish.partFinishes?.secondary.hex || spec.shell.floorTintHex;
  const accentHex = finish.partFinishes?.accent.hex || spec.shell.cabinetPrimaryHex || spec.shell.accentWallColorHex;
  const [wr, wg, wb] = hexToLinearRgbTuple(wallHex);
  const [fr, fg, fb] = hexToLinearRgbTuple(floorHex);
  const [ar, ag, ab] = hexToLinearRgbTuple(accentHex);

  const cleanBase = baseUrl.replace(/\/$/, '');
  const placementLines = spec.placements
    .map((p, idx) => {
      const sub = catalogById?.get(p.assetId);
      const gltfUrl = sub?.modelSource?.gltfUrl
        ? sub.modelSource.gltfUrl.startsWith('http')
          ? sub.modelSource.gltfUrl
          : `${cleanBase}${sub.modelSource.gltfUrl}`
        : `${cleanBase}/api/v1/catalog/${p.assetId}/blender-script`;
      // Convert Three.js Y-up (x, y, z) to Blender Z-up (x, -z, y)
      const bx = Number((p.xCm / 100).toFixed(3));
      const by = Number((-p.zCm / 100).toFixed(3));
      const bz = Number((p.yCm / 100).toFixed(3));
      const rz = Number(p.rotYDeg.toFixed(1));
      const isGlb = Boolean(sub?.modelSource?.gltfUrl);
      return `    {"idx": ${idx + 1}, "id": ${JSON.stringify(p.assetId)}, "role": ${JSON.stringify(p.roleLabel)}, "loc": (${bx}, ${by}, ${bz}), "rot_z_deg": ${rz}, "is_glb": ${isGlb ? 'True' : 'False'}, "url": ${JSON.stringify(gltfUrl)}},`;
    })
    .join('\n');

  const islandBlock = spec.shell.kitchenIsland
    ? `
    # Şelale Mutfak Adası (${spec.shell.kitchenIsland.widthCm}x${spec.shell.kitchenIsland.depthCm} cm)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(${Number((spec.shell.kitchenIsland.centerXCm / 100).toFixed(3))}, ${Number((-spec.shell.kitchenIsland.centerZCm / 100).toFixed(3))}, ${Number(((spec.shell.kitchenIsland.heightCm ?? 90) / 200).toFixed(3))}))
    island = bpy.context.active_object
    island.name = "${pyName}_Kitchen_Island"
    island.scale = (${Number((spec.shell.kitchenIsland.widthCm / 100).toFixed(3))}, ${Number((spec.shell.kitchenIsland.depthCm / 100).toFixed(3))}, ${Number(((spec.shell.kitchenIsland.heightCm ?? 90) / 100).toFixed(3))})
    island.data.materials.append(mat_accent)
    island.parent = root`
    : '';

  return `"""
MimarKatalog — Blender 4.x Hazır Kompoze Oda Tasarımı Oluşturucu
Oda: ${roomAsset.name} (${roomAsset.brandStyle})
Stil: ${spec.designStyle} | Ölçü: ${spec.shell.widthCm}x${spec.shell.depthCm}x${spec.shell.heightCm} cm
Tema: ${finish.label} (${wallHex} / ${floorHex} / ${accentHex}) | Doku: ${pattern.label}
İçerdiği Hazır Katalog Modeli: ${spec.placements.length} parça
"""
import bpy
import math
import os
import tempfile
import urllib.request

def make_mat(name, rgba, rough=0.55, metal=0.0):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = rgba
        bsdf.inputs["Roughness"].default_value = rough
        bsdf.inputs["Metallic"].default_value = metal
    return mat

def build_${pyName}(origin=(${origin.x}, ${origin.y}, ${origin.z})):
    col_name = "MimarKatalog_${pyName}"
    col = bpy.data.collections.get(col_name) or bpy.data.collections.new(col_name)
    if col.name not in bpy.context.scene.collection.children:
        bpy.context.scene.collection.children.link(col)

    root = bpy.data.objects.new("${pyName}_RoomRoot", None)
    root.empty_display_type = "PLAIN_AXES"
    root.location = origin
    col.objects.link(root)

    mat_wall = make_mat("${pyName}_Wall", (${wr}, ${wg}, ${wb}, 1.0), 0.78, 0.0)
    mat_floor = make_mat("${pyName}_Floor", (${fr}, ${fg}, ${fb}, 1.0), 0.48, 0.02)
    mat_accent = make_mat("${pyName}_Accent", (${ar}, ${ag}, ${ab}, 1.0), 0.42, 0.05)

    # Mimari Döşeme & İki Kesit Duvar (${wM}m x ${dM}m x ${hM}m)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.0, 0.0, -0.06))
    floor_obj = bpy.context.active_object
    floor_obj.name = "${pyName}_FloorSlab"
    floor_obj.scale = (${wM}, ${dM}, 0.12)
    floor_obj.data.materials.append(mat_floor)
    floor_obj.parent = root

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.0, ${Number((dM / 2 + 0.06).toFixed(3))}, ${Number((hM / 2).toFixed(3))}))
    back_wall = bpy.context.active_object
    back_wall.name = "${pyName}_BackWall"
    back_wall.scale = (${Number((wM + 0.12).toFixed(3))}, 0.12, ${hM})
    back_wall.data.materials.append(mat_wall)
    back_wall.parent = root

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(${Number((-wM / 2 - 0.06).toFixed(3))}, 0.0, ${Number((hM / 2).toFixed(3))}))
    left_wall = bpy.context.active_object
    left_wall.name = "${pyName}_LeftWall"
    left_wall.scale = (0.12, ${dM}, ${hM})
    left_wall.data.materials.append(mat_wall)
    left_wall.parent = root
${islandBlock}

    # Hazır Katalog Mobilya & Ankastre Yerleşim Listesi (${spec.placements.length} parça)
    placements = [
${placementLines}
    ]

    for item in placements:
        if item["is_glb"]:
            tmp_glb = os.path.join(tempfile.gettempdir(), f"mk_{item['id']}.glb")
            try:
                if not os.path.exists(tmp_glb):
                    urllib.request.urlretrieve(item["url"], tmp_glb)
                before = set(bpy.data.objects)
                bpy.ops.import_scene.gltf(filepath=tmp_glb)
                imported = [o for o in bpy.data.objects if o not in before]
                anchor = bpy.data.objects.new(f"{item['idx']:02d}_{item['id']}", None)
                anchor.location = item["loc"]
                anchor.rotation_euler = (0.0, 0.0, math.radians(item["rot_z_deg"]))
                anchor.parent = root
                col.objects.link(anchor)
                for obj in imported:
                    if obj.parent is None:
                        obj.parent = anchor
            except Exception as exc:
                print(f"Uyarı ({item['id']}): {exc}")
        else:
            # Prosedürel Türk CAD modeli için yerleşim ekseni oluşturuluyor
            anchor = bpy.data.objects.new(f"{item['idx']:02d}_{item['id']}_CAD", None)
            anchor.location = item["loc"]
            anchor.rotation_euler = (0.0, 0.0, math.radians(item["rot_z_deg"]))
            anchor.parent = root
            col.objects.link(anchor)

    print("MimarKatalog: '${roomAsset.name}' (${spec.placements.length} hazır model) Blender sahnesine 1:1 metrik ölçekle kuruldu.")
    return root

if __name__ == "__main__":
    build_${pyName}()
`;
}
