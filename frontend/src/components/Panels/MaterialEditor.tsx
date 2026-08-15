import { useSceneStore } from '../../store/useSceneStore';

interface SliderRowProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
}

function SliderRow({ label, value, onChange }: SliderRowProps) {
  return (
    <div className="px-3 mb-3">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{label}</span>
        <span className="text-gray-300">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-accent"
      />
    </div>
  );
}

/** Lets the user tweak the selected object's color, metalness and roughness. */
export default function MaterialEditor() {
  const objects = useSceneStore((s) => s.objects);
  const selectedId = useSceneStore((s) => s.selectedId);
  const updateObject = useSceneStore((s) => s.updateObject);

  const selected = objects.find((o) => o.id === selectedId);

  if (!selected) {
    return (
      <div>
        <div className="panel-section-title">Material</div>
        <p className="text-xs text-gray-500 px-3 py-2">Select an object to edit its material.</p>
      </div>
    );
  }

  const setMaterial = (patch: Partial<typeof selected.material>) =>
    updateObject(selected.id, { material: { ...selected.material, ...patch } });

  return (
    <div>
      <div className="panel-section-title">Material</div>

      <div className="px-3 mb-3">
        <label className="text-xs text-gray-400 mb-1 block">Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={selected.material.color}
            onChange={(e) => setMaterial({ color: e.target.value })}
            className="w-9 h-9 rounded border border-border bg-transparent cursor-pointer"
          />
          <input
            type="text"
            value={selected.material.color}
            onChange={(e) => setMaterial({ color: e.target.value })}
            className="input-dark"
          />
        </div>
      </div>

      <SliderRow
        label="Metalness"
        value={selected.material.metalness}
        onChange={(v) => setMaterial({ metalness: v })}
      />
      <SliderRow
        label="Roughness"
        value={selected.material.roughness}
        onChange={(v) => setMaterial({ roughness: v })}
      />
    </div>
  );
}
