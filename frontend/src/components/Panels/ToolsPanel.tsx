import { useSceneStore } from '../../store/useSceneStore';
import { TransformMode } from '../../types/scene';

const MODES: { mode: TransformMode; label: string; shortcut: string }[] = [
  { mode: 'translate', label: 'Move', shortcut: 'W' },
  { mode: 'rotate', label: 'Rotate', shortcut: 'E' },
  { mode: 'scale', label: 'Scale', shortcut: 'R' },
];

/** Transform-mode switcher plus duplicate / delete for the selected object. */
export default function ToolsPanel() {
  const transformMode = useSceneStore((s) => s.transformMode);
  const setTransformMode = useSceneStore((s) => s.setTransformMode);
  const selectedId = useSceneStore((s) => s.selectedId);
  const duplicateObject = useSceneStore((s) => s.duplicateObject);
  const removeObject = useSceneStore((s) => s.removeObject);

  return (
    <div>
      <div className="panel-section-title">Transform Tools</div>
      <div className="flex gap-1 px-3">
        {MODES.map((m) => (
          <button
            key={m.mode}
            onClick={() => setTransformMode(m.mode)}
            className={`flex-1 text-xs py-1.5 rounded border transition-colors ${
              transformMode === m.mode
                ? 'bg-accent border-accent text-white'
                : 'bg-panelLight border-border text-gray-300 hover:bg-[#2c2f38]'
            }`}
            title={`${m.label} (${m.shortcut})`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 px-3 mt-2">
        <button
          disabled={!selectedId}
          onClick={() => selectedId && duplicateObject(selectedId)}
          className="btn-secondary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Duplicate
        </button>
        <button
          disabled={!selectedId}
          onClick={() => selectedId && removeObject(selectedId)}
          className="btn-secondary flex-1 disabled:opacity-40 disabled:cursor-not-allowed hover:!bg-red-500/20 hover:!border-red-500/50 hover:!text-red-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
