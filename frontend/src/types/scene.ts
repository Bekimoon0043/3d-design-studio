export type PrimitiveType = 'cube' | 'sphere' | 'cylinder' | 'plane';

export type Vector3Tuple = [number, number, number];

export interface ObjectMaterial {
  color: string; // hex string, e.g. "#ff6a00"
  metalness: number; // 0..1
  roughness: number; // 0..1
}

export interface SceneObject {
  id: string;
  name: string;
  type: PrimitiveType;
  position: Vector3Tuple;
  rotation: Vector3Tuple; // radians
  scale: Vector3Tuple;
  material: ObjectMaterial;
}

export type TransformMode = 'translate' | 'rotate' | 'scale';

export interface SceneJSON {
  version: 1;
  objects: SceneObject[];
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  scene_json: SceneJSON;
  created_at: string;
  updated_at: string;
}

export const DEFAULT_MATERIAL: ObjectMaterial = {
  color: '#4f7cff',
  metalness: 0.2,
  roughness: 0.6,
};
