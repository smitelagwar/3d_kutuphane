import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import type { ArchitecturalAsset, MaterialFinish, PatternVariant } from '../lib/catalogTypes';
import { buildArchitecturalAssetMesh } from './assetMeshBuilder';

/**
 * Exports any architectural asset as a genuine binary .glb (glTF 2.0) 3D model
 * in 1:1 metric scale, ready for direct Blender File > Import > glTF 2.0.
 * If an already-loaded external GLTF/GLB Object3D is provided from the viewport,
 * exports that exact studio mesh directly!
 */
export async function exportAssetAsGlb(
  asset: ArchitecturalAsset,
  finish: MaterialFinish,
  pattern?: PatternVariant,
  existingObject?: THREE.Object3D | null,
): Promise<void> {
  // Fast path: for untouched ready-made binary .glb assets (ABO / Khronos), download the original studio .glb directly
  if (finish.preserveOriginalTextures && asset.modelSource?.gltfUrl?.endsWith('.glb')) {
    try {
      const resp = await fetch(asset.modelSource.gltfUrl);
      if (resp.ok) {
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${asset.slug}_${finish.id}.glb`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        return;
      }
    } catch {
      // Fall through to Three.js GLTFExporter
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
        { binary: true },
      );
    });

    const blob = new Blob([glbBuffer], { type: 'model/gltf-binary' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${asset.slug}_${finish.id}.glb`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  } finally {
    built?.dispose();
  }
}
