import { create } from 'zustand';
import {
  DEFAULT_MATERIAL,
  PrimitiveType,
  SceneJSON,
  SceneObject,
  TransformMode,
  Vector3Tuple,
} from '../types/scene';
import { generateId } from '../utils/id';

interface SceneState {
  projectId: string | null;
  projectName: string;
  objects: SceneObject[];
  selectedId: string | null;
  transformMode: TransformMode;
  isDirty: boolean;

  // Object lifecycle
  addObject: (type: PrimitiveType) => void;
  removeObject: (id: string) => void;
  duplicateObject: (id: string) => void;
  updateObject: (id: string, patch: Partial<SceneObject>) => void;
  renameObject: (id: string, name: string) => void;

  // Transform helpers used directly by the viewport's TransformControls
  setObjectTransform: (
    id: string,
    field: 'position' | 'rotation' | 'scale',
    value: Vector3Tuple
  ) => void;

  // Selection & tools
  selectObject: (id: string | null) => void;
  setTransformMode: (mode: TransformMode) => void;

  // Project-level
  setProjectName: (name: string) => void;
  loadScene: (projectId: string | null, name: string, scene: SceneJSON) => void;
  resetScene: () => void;
  markSaved: () => void;
  getSceneJSON: () => SceneJSON;
}

let objectCounter = 0;

function defaultNameFor(type: PrimitiveType): string {
  objectCounter += 1;
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  return `${label} ${objectCounter}`;
}

function createDefaultObject(type: PrimitiveType): SceneObject {
  return {
    id: generateId(),
    name: defaultNameFor(type),
    type,
    position: [0, type === 'plane' ? 0 : 0.5, 0],
    // Planes default to lying flat on the grid (rotated -90deg on X);
    // all other primitives start with no rotation.
    rotation: type === 'plane' ? [-Math.PI / 2, 0, 0] : [0, 0, 0],
    scale: [1, 1, 1],
    material: { ...DEFAULT_MATERIAL },
  };
}

export const useSceneStore = create<SceneState>((set, get) => ({
  projectId: null,
  projectName: 'Untitled Project',
  objects: [],
  selectedId: null,
  transformMode: 'translate',
  isDirty: false,

  addObject: (type) =>
    set((state) => {
      const obj = createDefaultObject(type);
      return {
        objects: [...state.objects, obj],
        selectedId: obj.id,
        isDirty: true,
      };
    }),

  removeObject: (id) =>
    set((state) => ({
      objects: state.objects.filter((o) => o.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
      isDirty: true,
    })),

  duplicateObject: (id) =>
    set((state) => {
      const source = state.objects.find((o) => o.id === id);
      if (!source) return state;
      const clone: SceneObject = {
        ...source,
        id: generateId(),
        name: `${source.name} Copy`,
        position: [source.position[0] + 0.5, source.position[1], source.position[2] + 0.5],
        material: { ...source.material },
      };
      return {
        objects: [...state.objects, clone],
        selectedId: clone.id,
        isDirty: true,
      };
    }),

  updateObject: (id, patch) =>
    set((state) => ({
      objects: state.objects.map((o) => (o.id === id ? { ...o, ...patch } : o)),
      isDirty: true,
    })),

  renameObject: (id, name) =>
    set((state) => ({
      objects: state.objects.map((o) => (o.id === id ? { ...o, name } : o)),
      isDirty: true,
    })),

  setObjectTransform: (id, field, value) =>
    set((state) => ({
      objects: state.objects.map((o) => (o.id === id ? { ...o, [field]: value } : o)),
      isDirty: true,
    })),

  selectObject: (id) => set({ selectedId: id }),
  setTransformMode: (mode) => set({ transformMode: mode }),

  setProjectName: (name) => set({ projectName: name, isDirty: true }),

  loadScene: (projectId, name, scene) =>
    set({
      projectId,
      projectName: name,
      objects: scene.objects,
      selectedId: null,
      isDirty: false,
    }),

  resetScene: () =>
    set({
      projectId: null,
      projectName: 'Untitled Project',
      objects: [],
      selectedId: null,
      isDirty: false,
    }),

  markSaved: () => set({ isDirty: false }),

  getSceneJSON: () => ({
    version: 1,
    objects: get().objects,
  }),
}));
