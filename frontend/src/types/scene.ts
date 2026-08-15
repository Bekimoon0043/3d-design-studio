export type PrimitiveType = 'cube' | 'sphere' | 'cylinder' | 'plane';
export type Vector3Tuple = [number, number, number];

export interface ObjectMaterial {
  color: string;
  metalness: number;
  roughness: number;
}

export interface PhysicsBody {
  enabled: boolean;
  useGravity: boolean;
  mass: number;
  restitution: number;
  velocity: Vector3Tuple;
}

export interface TransformKeyframe {
  time: number;
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  scale: Vector3Tuple;
}

export interface SceneObject {
  id: string;
  name: string;
  type: PrimitiveType;
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  scale: Vector3Tuple;
  material: ObjectMaterial;
  physics: PhysicsBody;
  keyframes: TransformKeyframe[];
}

export type TransformMode = 'translate' | 'rotate' | 'scale';
export type TransformSpace = 'world' | 'local';

export type CameraType = 'perspective' | 'orthographic';
export type RenderMode = 'studio' | 'realistic';

export interface CameraSettings {
  type: CameraType;
  position: Vector3Tuple;
  target: Vector3Tuple;
  fov: number;
  near: number;
  far: number;
  orthoSize: number;
}

export interface RenderSettings {
  mode: RenderMode;
  width: number;
  height: number;
  pixelRatio: number;
  exposure: number;
  environmentIntensity: number;
  shadows: boolean;
}

export interface SceneSettings {
  gravity: Vector3Tuple;
  backgroundColor: string;
  ambientIntensity: number;
  keyLightColor: string;
  keyLightIntensity: number;
  keyLightPosition: Vector3Tuple;
  fillLightIntensity: number;
  animationDuration: number;
  animationFps: number;
  camera: CameraSettings;
  render: RenderSettings;
}

export interface SceneJSON {
  version: 2;
  objects: SceneObject[];
  settings: SceneSettings;
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

export const DEFAULT_PHYSICS: PhysicsBody = {
  enabled: false,
  useGravity: true,
  mass: 1,
  restitution: 0.5,
  velocity: [0, 0, 0],
};

export const DEFAULT_SCENE_SETTINGS: SceneSettings = {
  gravity: [0, -9.81, 0],
  backgroundColor: '#17181c',
  ambientIntensity: 0.4,
  keyLightColor: '#ffffff',
  keyLightIntensity: 1.1,
  keyLightPosition: [8, 10, 5],
  fillLightIntensity: 0.3,
  animationDuration: 10,
  animationFps: 30,
  camera: {
    type: 'perspective',
    position: [6, 5, 8],
    target: [0, 0.5, 0],
    fov: 50,
    near: 0.1,
    far: 1000,
    orthoSize: 10,
  },
  render: {
    mode: 'realistic',
    width: 1280,
    height: 720,
    pixelRatio: 1,
    exposure: 1,
    environmentIntensity: 0.8,
    shadows: true,
  },
};
