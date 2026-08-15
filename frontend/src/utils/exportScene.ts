import { SceneJSON } from '../types/scene';

/**
 * Triggers a browser download of the current scene as a .json file.
 * This is a lightweight, dependency-free "export" — good enough to back up
 * or share a design outside the platform. GLTF/OBJ export is listed as a
 * future improvement in docs/ARCHITECTURE.md.
 */
export function downloadSceneAsJSON(scene: SceneJSON, projectName: string): void {
  const blob = new Blob([JSON.stringify(scene, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName = projectName.trim().replace(/[^a-z0-9-_]+/gi, '_') || 'scene';
  link.href = url;
  link.download = `${safeName}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
