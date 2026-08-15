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
  const selected = useSceneStore((s) => s.objects.find((object) => object.id === s.selectedId));
  const transformSpace = useSceneStore((s) => s.transformSpace);
  const setTransformSpace = useSceneStore((s) => s.setTransformSpace);
  const snapEnabled = useSceneStore((s) => s.snapEnabled);
  const setSnapEnabled = useSceneStore((s) => s.setSnapEnabled);
  const snapSize = useSceneStore((s) => s.snapSize);
  const setSnapSize = useSceneStore((s) => s.setSnapSize);
  const updateObject = useSceneStore((s) => s.updateObject);
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

      <div className="flex gap-1 px-3 mt-2">
        {(['world', 'local'] as const).map((space) => (
          <button key={space} onClick={() => setTransformSpace(space)} className={`flex-1 text-xs py-1 rounded border capitalize ${transformSpace === space ? 'bg-accent/20 text-accent border-accent/50' : 'bg-panelLight border-border text-gray-400'}`}>{space}</button>
        ))}
      </div>
      <div className="px-3 mt-2 flex items-center gap-2">
        <label className="flex items-center gap-2 text-xs text-gray-400 flex-1"><input type="checkbox" checked={snapEnabled} onChange={(event) => setSnapEnabled(event.target.checked)} /> Snap</label>
        <input className="input-dark w-20 text-right" type="number" min="0.01" step="0.05" value={snapSize} onChange={(event) => setSnapSize(Number(event.target.value) || 0.25)} aria-label="Snap increment" />
      </div>
      <div className="flex gap-2 px-3 mt-2">
        <button disabled={!selectedId} onClick={() => selected && updateObject(selected.id, { position: [0, 0.5, 0], rotation: [0, 0, 0], scale: [1, 1, 1] })} className="btn-secondary flex-1 disabled:opacity-40">Reset transform</button>
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
