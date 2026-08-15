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

type SceneSnapshot = {
  projectId: string | null;
  projectName: string;
  objects: SceneObject[];
};

interface SceneState extends SceneSnapshot {
  selectedId: string | null;
  transformMode: TransformMode;
  isDirty: boolean;
  past: SceneSnapshot[];
  future: SceneSnapshot[];

  addObject: (type: PrimitiveType) => void;
  removeObject: (id: string) => void;
  duplicateObject: (id: string) => void;
  updateObject: (id: string, patch: Partial<SceneObject>) => void;
  renameObject: (id: string, name: string) => void;
  setObjectTransform: (
    id: string,
    field: 'position' | 'rotation' | 'scale',
    value: Vector3Tuple
  ) => void;

  selectObject: (id: string | null) => void;
  setTransformMode: (mode: TransformMode) => void;
  setProjectName: (name: string) => void;
  loadScene: (projectId: string | null, name: string, scene: SceneJSON) => void;
  resetScene: () => void;
  markSaved: () => void;
  getSceneJSON: () => SceneJSON;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
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
    rotation: type === 'plane' ? [-Math.PI / 2, 0, 0] : [0, 0, 0],
    scale: [1, 1, 1],
    material: { ...DEFAULT_MATERIAL },
  };
}

function snapshotOf(state: Pick<SceneState, 'projectId' | 'projectName' | 'objects'>): SceneSnapshot {
  return {
    projectId: state.projectId,
    projectName: state.projectName,
    objects: state.objects.map((object) => ({ ...object, material: { ...object.material } })),
  };
}

function withHistory(state: SceneState, next: Partial<SceneSnapshot> & Pick<Partial<SceneState>, 'selectedId'> = {}): SceneState {
  return {
    ...state,
    ...next,
    past: [...state.past, snapshotOf(state)].slice(-50),
    future: [],
    isDirty: true,
  };
}

export const useSceneStore = create<SceneState>((set, get) => ({
  projectId: null,
  projectName: 'Untitled Project',
  objects: [],
  selectedId: null,
  transformMode: 'translate',
  isDirty: false,
  past: [],
  future: [],

  addObject: (type) =>
    set((state) => {
      const object = createDefaultObject(type);
      return withHistory(state, {
        objects: [...state.objects, object],
        selectedId: object.id,
      });
    }),

  removeObject: (id) =>
    set((state) => {
      if (!state.objects.some((object) => object.id === id)) return state;
      return withHistory(state, {
        objects: state.objects.filter((object) => object.id !== id),
        selectedId: state.selectedId === id ? null : state.selectedId,
      });
    }),

  duplicateObject: (id) =>
    set((state) => {
      const source = state.objects.find((object) => object.id === id);
      if (!source) return state;
      const clone: SceneObject = {
        ...source,
        id: generateId(),
        name: `${source.name} Copy`,
        position: [source.position[0] + 0.5, source.position[1], source.position[2] + 0.5],
        material: { ...source.material },
      };
      return withHistory(state, { objects: [...state.objects, clone], selectedId: clone.id });
    }),

  updateObject: (id, patch) =>
    set((state) => {
      if (!state.objects.some((object) => object.id === id)) return state;
      return withHistory(state, {
        objects: state.objects.map((object) =>
          object.id === id
            ? { ...object, ...patch, material: patch.material ?? object.material }
            : object
        ),
      });
    }),

  renameObject: (id, name) =>
    set((state) => {
      if (!state.objects.some((object) => object.id === id)) return state;
      return withHistory(state, {
        objects: state.objects.map((object) => (object.id === id ? { ...object, name } : object)),
      });
    }),

  setObjectTransform: (id, field, value) =>
    set((state) => {
      if (!state.objects.some((object) => object.id === id)) return state;
      return withHistory(state, {
        objects: state.objects.map((object) => (object.id === id ? { ...object, [field]: value } : object)),
      });
    }),

  selectObject: (id) => set({ selectedId: id }),
  setTransformMode: (mode) => set({ transformMode: mode }),

  setProjectName: (name) =>
    set((state) => withHistory(state, { projectName: name })),

  loadScene: (projectId, name, scene) =>
    set({
      projectId,
      projectName: name,
      objects: scene.objects,
      selectedId: null,
      isDirty: false,
      past: [],
      future: [],
    }),

  resetScene: () =>
    set({
      projectId: null,
      projectName: 'Untitled Project',
      objects: [],
      selectedId: null,
      isDirty: false,
      past: [],
      future: [],
    }),

  markSaved: () => set({ isDirty: false }),

  getSceneJSON: () => ({ version: 1, objects: get().objects }),

  undo: () =>
    set((state) => {
      const previous = state.past[state.past.length - 1];
      if (!previous) return state;
      return {
        ...state,
        ...previous,
        past: state.past.slice(0, -1),
        future: [snapshotOf(state), ...state.future].slice(0, 50),
        selectedId: null,
        isDirty: true,
      };
    }),

  redo: () =>
    set((state) => {
      const next = state.future[0];
      if (!next) return state;
      return {
        ...state,
        ...next,
        past: [...state.past, snapshotOf(state)].slice(-50),
        future: state.future.slice(1),
        selectedId: null,
        isDirty: true,
      };
    }),

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
}));
