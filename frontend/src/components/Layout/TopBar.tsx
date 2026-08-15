import { useState } from 'react';
import type { LocalUser } from '../../hooks/useAuth';
import { useSceneStore } from '../../store/useSceneStore';
import { useProjectPersistence } from '../../hooks/useProjectPersistence';
import { downloadSceneAsJSON } from '../../utils/exportScene';
import AccountMenu from '../Auth/AccountMenu';
import ProjectBrowser from './ProjectBrowser';

interface Props {
  user: LocalUser | null;
}

export default function TopBar({ user }: Props) {
  const projectName = useSceneStore((s) => s.projectName);
  const setProjectName = useSceneStore((s) => s.setProjectName);
  const isDirty = useSceneStore((s) => s.isDirty);
  const getSceneJSON = useSceneStore((s) => s.getSceneJSON);
  const resetScene = useSceneStore((s) => s.resetScene);

  const { saveProject, saving, error } = useProjectPersistence(user);
  const [showBrowser, setShowBrowser] = useState(false);

  return (
    <header className="h-12 shrink-0 bg-panel border-b border-border flex items-center justify-between px-3 z-30 relative">
      <div className="flex items-center gap-3">
        <span className="text-accent font-bold text-sm tracking-wide">3D&nbsp;Studio</span>
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-transparent border border-transparent hover:border-border focus:border-accent rounded px-2 py-1 text-sm text-gray-200 focus:outline-none w-52"
        />
        {isDirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Unsaved changes" />}
      </div>

      <div className="flex items-center gap-2">
        {error && <span className="text-xs text-red-400 max-w-xs truncate">{error}</span>}

        <button className="btn-secondary" onClick={() => setShowBrowser(true)}>
          Open
        </button>
        <button className="btn-secondary" onClick={resetScene}>
          New
        </button>
        <button
          className="btn-secondary"
          onClick={() => downloadSceneAsJSON(getSceneJSON(), projectName)}
        >
          Export
        </button>
        <button className="btn-primary disabled:opacity-50" disabled={saving} onClick={saveProject}>
          {saving ? 'Saving…' : 'Save'}
        </button>

        <div className="w-px h-6 bg-border mx-1" />
        <AccountMenu user={user} />
      </div>

      {showBrowser && <ProjectBrowser user={user} onClose={() => setShowBrowser(false)} />}
    </header>
  );
}
