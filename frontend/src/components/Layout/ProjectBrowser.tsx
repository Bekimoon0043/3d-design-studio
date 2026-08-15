import { useEffect, useState } from 'react';
import type { LocalUser } from '../../hooks/useAuth';
import { useProjectPersistence } from '../../hooks/useProjectPersistence';
import { Project } from '../../types/scene';

interface Props {
  user: LocalUser | null;
  onClose: () => void;
}

/** Lists projects saved in browser localStorage. */
export default function ProjectBrowser({ onClose }: Props) {
  const { listProjects, loadProject, deleteProject, loading, error } = useProjectPersistence();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    listProjects().then(setProjects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoad = async (id: string) => {
    await loadProject(id);
    onClose();
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-panel border border-border rounded-lg w-full max-w-md p-5 max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-white mb-3">Cached Projects</h2>
        <p className="text-xs text-gray-500 mb-3">Stored in this browser only (localStorage).</p>

        {loading && <p className="text-sm text-gray-400">Loading…</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!loading && projects.length === 0 && (
          <p className="text-sm text-gray-400">No saved projects yet. Hit Save to create one.</p>
        )}

        <div className="flex-1 overflow-y-auto scroll-thin flex flex-col gap-1">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between px-3 py-2 rounded hover:bg-panelLight border border-transparent hover:border-border"
            >
              <button onClick={() => handleLoad(p.id)} className="text-left flex-1">
                <div className="text-sm text-gray-200">{p.name}</div>
                <div className="text-[11px] text-gray-500">
                  Updated {new Date(p.updated_at).toLocaleString()}
                </div>
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-xs text-gray-500 hover:text-red-400 px-2"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="btn-secondary mt-4 self-end">
          Close
        </button>
      </div>
    </div>
  );
}
