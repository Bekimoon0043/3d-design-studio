import { useSceneStore } from '../../store/useSceneStore';

/** Flat list of every object currently in the scene, for quick selection. */
export default function SceneHierarchy() {
  const objects = useSceneStore((s) => s.objects);
  const selectedId = useSceneStore((s) => s.selectedId);
  const selectObject = useSceneStore((s) => s.selectObject);
  const removeObject = useSceneStore((s) => s.removeObject);

  return (
    <div>
      <div className="panel-section-title">Scene Objects ({objects.length})</div>
      <div className="px-2 flex flex-col gap-0.5 max-h-56 overflow-y-auto scroll-thin">
        {objects.length === 0 && (
          <p className="text-xs text-gray-500 px-2 py-2">No objects yet. Add one above.</p>
        )}
        {objects.map((obj) => (
          <div
            key={obj.id}
            onClick={() => selectObject(obj.id)}
            className={`group flex items-center justify-between px-2 py-1.5 rounded text-sm cursor-pointer transition-colors ${
              obj.id === selectedId
                ? 'bg-accent/20 text-accent border border-accent/40'
                : 'hover:bg-panelLight text-gray-300 border border-transparent'
            }`}
          >
            <span className="truncate">{obj.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeObject(obj.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 text-xs px-1"
              title="Delete"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
