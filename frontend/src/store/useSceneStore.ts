import { create } from 'zustand';
import {
  DEFAULT_MATERIAL,
  DEFAULT_PHYSICS,
  DEFAULT_SCENE_SETTINGS,
  PrimitiveType,
  SceneJSON,
  SceneObject,
  SceneSettings,
  TransformMode,
  TransformSpace,
  Vector3Tuple,
} from '../types/scene';
import { generateId } from '../utils/id';

type SceneSnapshot = {
  projectId: string | null;
  projectName: string;
  objects: SceneObject[];
  sceneSettings: SceneSettings;
};

interface SceneState extends SceneSnapshot {
  selectedId: string | null;
  transformMode: TransformMode;
  transformSpace: TransformSpace;
  snapEnabled: boolean;
  snapSize: number;
  isDirty: boolean;
  past: SceneSnapshot[];
  future: SceneSnapshot[];

  addObject: (type: PrimitiveType) => void;
  removeObject: (id: string) => void;
  duplicateObject: (id: string) => void;
  updateObject: (id: string, patch: Partial<SceneObject>) => void;
  updateRuntimeObject: (id: string, patch: Partial<SceneObject>) => void;
  renameObject: (id: string, name: string) => void;
  setObjectTransform: (id: string, field: 'position' | 'rotation' | 'scale', value: Vector3Tuple) => void;
  updateSceneSettings: (patch: Partial<SceneSettings>) => void;
  addKeyframe: (id: string, time: number) => void;
  removeKeyframe: (id: string, time: number) => void;

  selectObject: (id: string | null) => void;
  setTransformMode: (mode: TransformMode) => void;
  setTransformSpace: (space: TransformSpace) => void;
  setSnapEnabled: (enabled: boolean) => void;
  setSnapSize: (size: number) => void;
  isPlaying: boolean;
  currentTime: number;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setProjectName: (name: string) => void;
  loadScene: (projectId: string | null, name: string, scene: SceneJSON) => void;
  resetScene: () => void;
  markSaved: () => void;
  getSceneJSON: () => SceneJSON;
  undo: () => void;
  redo: () => void;
}

let objectCounter = 0;

function defaultNameFor(type: PrimitiveType): string {
  objectCounter += 1;
  return `${type.charAt(0).toUpperCase() + type.slice(1)} ${objectCounter}`;
}

function createDefaultObject(type: PrimitiveType): SceneObject {
  return {
    id: generateId(),
    name: defaultNameFor(type),
    type,
    position: [0, type === 'plane' ? 0 : 0.5, 0],
    rotation: type === 'plane' ? [-Math.PI / 2, 0, 0] : [0, 0, 0],
    scale: [1, 1, 1],
    material: { ...DEFAULT_MATERIAL },
    physics: { ...DEFAULT_PHYSICS, velocity: [0, 0, 0] },
    keyframes: [],
  };
}

function normalizeScene(scene: Partial<SceneJSON>): SceneJSON {
  return {
    version: 2,
    settings: {
      ...DEFAULT_SCENE_SETTINGS,
      ...(scene.settings ?? {}),
      gravity: scene.settings?.gravity ?? DEFAULT_SCENE_SETTINGS.gravity,
      keyLightPosition: scene.settings?.keyLightPosition ?? DEFAULT_SCENE_SETTINGS.keyLightPosition,
      camera: { ...DEFAULT_SCENE_SETTINGS.camera, ...(scene.settings?.camera ?? {}) },
      render: { ...DEFAULT_SCENE_SETTINGS.render, ...(scene.settings?.render ?? {}) },
    },
    objects: (scene.objects ?? []).map((object) => ({
      ...object,
      material: { ...DEFAULT_MATERIAL, ...(object.material ?? {}) },
      physics: { ...DEFAULT_PHYSICS, ...(object.physics ?? {}), velocity: object.physics?.velocity ?? [0, 0, 0] },
      keyframes: object.keyframes ?? [],
    })),
  };
}

function snapshotOf(state: Pick<SceneState, 'projectId' | 'projectName' | 'objects' | 'sceneSettings'>): SceneSnapshot {
  return {
    projectId: state.projectId,
    projectName: state.projectName,
    sceneSettings: {
      ...state.sceneSettings,
      gravity: [...state.sceneSettings.gravity] as Vector3Tuple,
      keyLightPosition: [...state.sceneSettings.keyLightPosition] as Vector3Tuple,
      camera: { ...state.sceneSettings.camera, position: [...state.sceneSettings.camera.position] as Vector3Tuple, target: [...state.sceneSettings.camera.target] as Vector3Tuple },
      render: { ...state.sceneSettings.render },
    },
    objects: state.objects.map((object) => ({
      ...object,
      position: [...object.position] as Vector3Tuple,
      rotation: [...object.rotation] as Vector3Tuple,
      scale: [...object.scale] as Vector3Tuple,
      material: { ...object.material },
      physics: { ...object.physics, velocity: [...object.physics.velocity] as Vector3Tuple },
      keyframes: object.keyframes.map((keyframe) => ({ ...keyframe, position: [...keyframe.position] as Vector3Tuple, rotation: [...keyframe.rotation] as Vector3Tuple, scale: [...keyframe.scale] as Vector3Tuple })),
    })),
  };
}

function withHistory(state: SceneState, next: Partial<SceneSnapshot> & Pick<Partial<SceneState>, 'selectedId'> = {}): SceneState {
  return { ...state, ...next, past: [...state.past, snapshotOf(state)].slice(-50), future: [], isDirty: true };
}

export const useSceneStore = create<SceneState>((set, get) => ({
  projectId: null,
  projectName: 'Untitled Project',
  objects: [],
  sceneSettings: { ...DEFAULT_SCENE_SETTINGS },
  selectedId: null,
  transformMode: 'translate',
  transformSpace: 'world',
  snapEnabled: false,
  snapSize: 0.25,
  isPlaying: false,
  currentTime: 0,
  isDirty: false,
  past: [],
  future: [],

  addObject: (type) => set((state) => { const object = createDefaultObject(type); return withHistory(state, { objects: [...state.objects, object], selectedId: object.id }); }),

  removeObject: (id) => set((state) => state.objects.some((object) => object.id === id) ? withHistory(state, { objects: state.objects.filter((object) => object.id !== id), selectedId: state.selectedId === id ? null : state.selectedId }) : state),

  duplicateObject: (id) => set((state) => {
    const source = state.objects.find((object) => object.id === id);
    if (!source) return state;
    const clone: SceneObject = { ...source, id: generateId(), name: `${source.name} Copy`, position: [source.position[0] + 0.5, source.position[1], source.position[2] + 0.5], material: { ...source.material }, physics: { ...source.physics, velocity: [0, 0, 0] }, keyframes: source.keyframes.map((keyframe) => ({ ...keyframe })) };
    return withHistory(state, { objects: [...state.objects, clone], selectedId: clone.id });
  }),

  updateObject: (id, patch) => set((state) => state.objects.some((object) => object.id === id) ? withHistory(state, { objects: state.objects.map((object) => object.id === id ? { ...object, ...patch, material: patch.material ? { ...object.material, ...patch.material } : object.material, physics: patch.physics ? { ...object.physics, ...patch.physics } : object.physics } : object) }) : state),

  updateRuntimeObject: (id, patch) => set((state) => ({ ...state, objects: state.objects.map((object) => object.id === id ? { ...object, ...patch } : object) })),

  renameObject: (id, name) => set((state) => state.objects.some((object) => object.id === id) ? withHistory(state, { objects: state.objects.map((object) => object.id === id ? { ...object, name } : object) }) : state),

  setObjectTransform: (id, field, value) => set((state) => state.objects.some((object) => object.id === id) ? withHistory(state, { objects: state.objects.map((object) => object.id === id ? { ...object, [field]: value } : object) }) : state),

  updateSceneSettings: (patch) => set((state) => withHistory(state, {
    sceneSettings: {
      ...state.sceneSettings,
      ...patch,
      camera: patch.camera ? { ...state.sceneSettings.camera, ...patch.camera } : state.sceneSettings.camera,
      render: patch.render ? { ...state.sceneSettings.render, ...patch.render } : state.sceneSettings.render,
    },
  })),

  addKeyframe: (id, time) => set((state) => {
    const object = state.objects.find((item) => item.id === id);
    if (!object) return state;
    const frame = { time: Math.max(0, time), position: [...object.position] as Vector3Tuple, rotation: [...object.rotation] as Vector3Tuple, scale: [...object.scale] as Vector3Tuple };
    const keyframes = [...object.keyframes.filter((item) => Math.abs(item.time - frame.time) > 0.001), frame].sort((a, b) => a.time - b.time);
    return withHistory(state, { objects: state.objects.map((item) => item.id === id ? { ...item, keyframes } : item) });
  }),

  removeKeyframe: (id, time) => set((state) => withHistory(state, { objects: state.objects.map((item) => item.id === id ? { ...item, keyframes: item.keyframes.filter((keyframe) => Math.abs(keyframe.time - time) > 0.001) } : item) })),

  selectObject: (id) => set({ selectedId: id }),
  setTransformMode: (mode) => set({ transformMode: mode }),
  setTransformSpace: (space) => set({ transformSpace: space }),
  setSnapEnabled: (enabled) => set({ snapEnabled: enabled }),
  setSnapSize: (size) => set({ snapSize: Math.max(0.01, size) }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: Math.max(0, Math.min(get().sceneSettings.animationDuration, time)) }),
  setProjectName: (name) => set((state) => withHistory(state, { projectName: name })),

  loadScene: (projectId, name, scene) => {
    const normalized = normalizeScene(scene);
    set({ projectId, projectName: name, objects: normalized.objects, sceneSettings: normalized.settings, selectedId: null, isDirty: false, past: [], future: [] });
  },

  resetScene: () => set({ projectId: null, projectName: 'Untitled Project', objects: [], sceneSettings: { ...DEFAULT_SCENE_SETTINGS, camera: { ...DEFAULT_SCENE_SETTINGS.camera, position: [...DEFAULT_SCENE_SETTINGS.camera.position] as Vector3Tuple, target: [...DEFAULT_SCENE_SETTINGS.camera.target] as Vector3Tuple }, render: { ...DEFAULT_SCENE_SETTINGS.render } }, selectedId: null, isDirty: false, past: [], future: [] }),
  markSaved: () => set({ isDirty: false }),
  getSceneJSON: () => ({ version: 2, objects: get().objects, settings: get().sceneSettings }),

  undo: () => set((state) => {
    const previous = state.past[state.past.length - 1];
    if (!previous) return state;
    return { ...state, ...previous, past: state.past.slice(0, -1), future: [snapshotOf(state), ...state.future].slice(0, 50), selectedId: null, isDirty: true };
  }),

  redo: () => set((state) => {
    const next = state.future[0];
    if (!next) return state;
    return { ...state, ...next, past: [...state.past, snapshotOf(state)].slice(-50), future: state.future.slice(1), selectedId: null, isDirty: true };
  }),
}));
