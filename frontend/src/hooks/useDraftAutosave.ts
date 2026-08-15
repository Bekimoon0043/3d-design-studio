import { useEffect, useRef } from 'react';
import { useSceneStore } from '../store/useSceneStore';
import type { SceneJSON } from '../types/scene';

const DRAFT_KEY = '3d-design-studio:draft';
const AUTOSAVE_DELAY = 1200;

type CachedDraft = {
  projectId: string | null;
  projectName: string;
  scene: SceneJSON;
  updatedAt: string;
};

function readDraft(): CachedDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as CachedDraft;
    if (!draft?.scene || !Array.isArray(draft.scene.objects)) return null;
    return draft;
  } catch {
    return null;
  }
}

/** Keeps a recoverable working copy in browser storage for local testing. */
export function useDraftAutosave() {
  const projectId = useSceneStore((state) => state.projectId);
  const projectName = useSceneStore((state) => state.projectName);
  const objects = useSceneStore((state) => state.objects);
  const sceneSettings = useSceneStore((state) => state.sceneSettings);
  const isDirty = useSceneStore((state) => state.isDirty);
  const loadScene = useSceneStore((state) => state.loadScene);
  const restoredRef = useRef(false);

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    const draft = readDraft();
    if (!draft || objects.length > 0) return;
    loadScene(draft.projectId, draft.projectName, draft.scene);
  }, [loadScene, objects.length]);

  useEffect(() => {
    if (!isDirty) return;
    const timeout = window.setTimeout(() => {
      const draft: CachedDraft = {
        projectId,
        projectName,
        scene: { version: 2, objects, settings: sceneSettings },
        updatedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch {
        // A full browser cache should not interrupt editing.
      }
    }, AUTOSAVE_DELAY);

    return () => window.clearTimeout(timeout);
  }, [projectId, projectName, objects, sceneSettings, isDirty]);
}
