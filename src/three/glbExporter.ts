import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import type { ArchitecturalAsset, MaterialFinish, PatternVariant } from '../lib/catalogTypes';
import { buildArchitecturalAssetMesh } from './assetMeshBuilder';
import { resolveDirectGlbUrl } from './externalModelLoader';
import {
  DEFAULT_EXPORT_MAX_TEXTURE_SIZE,
  isDirectBinaryGlbUrl,
  prepareExportSceneForCompactGlb,
} from './glbExportOptimization';

export interface GlbExportResult {
  filename: string;
  bytes: number;
}

function triggerGlbDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/**
 * Exports any architectural asset as a genuine compact binary .glb (glTF 2.0) 3D model
 * in 1:1 metric scale, ready for direct Blender File > Import > glTF 2.0.
 *
 * - For untouched ready-made binary .glb assets (ABO / HF / Khronos): fetches through our
 *   server-side GLB texture optimizer endpoint so 15–65 MB raw assets download as ~0.6–2.5 MB.
 * - For recolored, custom-finish, or procedural assets: encodes opaque textures as compact
 *   <=1024px JPEG instead of Three.js GLTFExporter's default giant lossless PNGs.
 */
export async function exportAssetAsGlb(
  asset: ArchitecturalAsset,
  finish: MaterialFinish,
  pattern?: PatternVariant,
  existingObject?: THREE.Object3D | null,
): Promise<GlbExportResult> {
  const filename = `${asset.slug}_${finish.id}.glb`;
  const hasCustomPattern = Boolean(pattern && pattern.id !== 'original_pbr');

  // Fast path: untouched ready-made binary .glb assets download the server-optimized .glb directly
  if (
    finish.preserveOriginalTextures &&
    !hasCustomPattern &&
    isDirectBinaryGlbUrl(asset.modelSource?.gltfUrl)
  ) {
    try {
      const resp = await fetch(resolveDirectGlbUrl(asset.modelSource!.gltfUrl!));
      if (resp.ok) {
        const blob = await resp.blob();
        triggerGlbDownload(blob, filename);
        return { filename, bytes: blob.size };
      }
    } catch {
      // Fall through to compact Three.js GLTFExporter
    }
  }

  const built = existingObject
    ? null
    : buildArchitecturalAssetMesh(asset, finish, {
        isSoftwareGl: true,
        maxAnisotropy: 1,
        wireframe: false,
        pattern,
      });

  const exportScene = new THREE.Scene();
  exportScene.name = `MimarKatalog_${asset.slug}`;
  const targetObject = existingObject ? existingObject.clone(true) : built!.group;
  exportScene.add(targetObject);

  // Convert opaque textures to compact JPEG & strip internal runtime userData before export
  const exportPrep = prepareExportSceneForCompactGlb(exportScene);
  const exporter = new GLTFExporter();

  try {
    const glbBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      exporter.parse(
        exportScene,
        (result) => {
          if (result instanceof ArrayBuffer) {
            resolve(result);
          } else {
            const jsonStr = JSON.stringify(result);
            resolve(new TextEncoder().encode(jsonStr).buffer);
          }
        },
        (err) => reject(err),
        {
          binary: true,
          onlyVisible: true,
          maxTextureSize: DEFAULT_EXPORT_MAX_TEXTURE_SIZE,
        },
      );
    });

    const blob = new Blob([glbBuffer], { type: 'model/gltf-binary' });
    triggerGlbDownload(blob, filename);
    return { filename, bytes: blob.size };
  } finally {
    exportPrep.cleanup();
    built?.dispose();
  }
}
