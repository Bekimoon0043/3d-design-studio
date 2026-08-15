import { useCallback, useState } from 'react';
import { useSceneStore } from '../store/useSceneStore';
import { Project, SceneJSON } from '../types/scene';
import { generateId } from '../utils/id';

const STORAGE_KEY = '3d-design-studio:projects';

interface StoredProject {
  id: string;
  name: string;
  scene_json: SceneJSON;
  created_at: string;
  updated_at: string;
}

interface UseProjectPersistence {
  saving: boolean;
  loading: boolean;
  error: string | null;
  saveProject: () => Promise<void>;
  listProjects: () => Promise<Project[]>;
  loadProject: (projectId: string) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

function readAll(): StoredProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(projects: StoredProject[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

/**
 * Browser-cache (localStorage) project persistence for local testing.
 * No backend or Supabase required — everything stays on this device.
 */
export function useProjectPersistence(_user?: unknown): UseProjectPersistence {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const projectId = useSceneStore((s) => s.projectId);
  const projectName = useSceneStore((s) => s.projectName);
  const getSceneJSON = useSceneStore((s) => s.getSceneJSON);
  const loadScene = useSceneStore((s) => s.loadScene);
  const markSaved = useSceneStore((s) => s.markSaved);

  const saveProject = useCallback(async () => {
    setError(null);
    setSaving(true);
    try {
      const sceneJson = getSceneJSON();
      const now = new Date().toISOString();
      const projects = readAll();

      if (projectId) {
        const idx = projects.findIndex((p) => p.id === projectId);
        if (idx >= 0) {
          const existing = projects[idx]!;
          projects[idx] = {
            id: existing.id,
            name: projectName,
            scene_json: sceneJson,
            created_at: existing.created_at,
            updated_at: now,
          };
        } else {
          projects.push({
            id: projectId,
            name: projectName,
            scene_json: sceneJson,
            created_at: now,
            updated_at: now,
          });
        }
        writeAll(projects);
      } else {
        const id = generateId();
        projects.push({
          id,
          name: projectName,
          scene_json: sceneJson,
          created_at: now,
          updated_at: now,
        });
        writeAll(projects);
        loadScene(id, projectName, sceneJson);
      }
      markSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save to browser cache');
    } finally {
      setSaving(false);
    }
  }, [projectId, projectName, getSceneJSON, loadScene, markSaved]);

  const listProjects = useCallback(async (): Promise<Project[]> => {
    setError(null);
    setLoading(true);
    try {
      const projects = readAll();
      projects.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
      return projects.map((p) => ({
        id: p.id,
        user_id: 'local',
        name: p.name,
        scene_json: p.scene_json,
        created_at: p.created_at,
        updated_at: p.updated_at,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to list projects');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProject = useCallback(
    async (id: string) => {
      setError(null);
      setLoading(true);
      try {
        const projects = readAll();
        const found = projects.find((p) => p.id === id);
        if (!found) {
          setError('Project not found in browser cache');
          return;
        }
        loadScene(found.id, found.name, found.scene_json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    },
    [loadScene]
  );

  const deleteProject = useCallback(async (id: string) => {
    setError(null);
    try {
      const projects = readAll().filter((p) => p.id !== id);
      writeAll(projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    }
  }, []);

  return { saving, loading, error, saveProject, listProjects, loadProject, deleteProject };
}
