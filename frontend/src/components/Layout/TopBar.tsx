import { useState } from 'react';
import { Redo2, Undo2 } from 'lucide-react';
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
  const pastLength = useSceneStore((s) => s.past.length);
  const futureLength = useSceneStore((s) => s.future.length);
  const getSceneJSON = useSceneStore((s) => s.getSceneJSON);
  const undo = useSceneStore((s) => s.undo);
  const redo = useSceneStore((s) => s.redo);
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
        <span className="hidden lg:inline text-[11px] text-gray-500">Browser cache only</span>
      </div>

      <div className="flex items-center gap-2">
        {error && <span className="text-xs text-red-400 max-w-xs truncate">{error}</span>}
        <div className="flex items-center gap-1 border-r border-border pr-2 mr-1">
          <button
            className="icon-btn disabled:opacity-30 disabled:hover:bg-transparent"
            disabled={pastLength === 0}
            onClick={undo}
            title="Undo (Ctrl/Cmd + Z)"
            aria-label="Undo"
          >
            <Undo2 size={16} />
          </button>
          <button
            className="icon-btn disabled:opacity-30 disabled:hover:bg-transparent"
            disabled={futureLength === 0}
            onClick={redo}
            title="Redo (Ctrl/Cmd + Shift + Z)"
            aria-label="Redo"
          >
            <Redo2 size={16} />
          </button>
        </div>

        <button className="btn-secondary" onClick={() => setShowBrowser(true)}>
          Open
        </button>
        <button className="btn-secondary" onClick={resetScene}>
          New
        </button>
        <button className="btn-secondary" onClick={() => downloadSceneAsJSON(getSceneJSON(), projectName)}>
          Export JSON
        </button>
        <button className="btn-secondary" onClick={() => window.dispatchEvent(new Event('render-scene'))}>
          Render PNG
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
