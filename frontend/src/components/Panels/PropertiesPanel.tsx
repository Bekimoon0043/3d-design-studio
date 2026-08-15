import { useSceneStore } from '../../store/useSceneStore';
import { Vector3Tuple } from '../../types/scene';

const AXES = ['X', 'Y', 'Z'] as const;
const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;

interface VectorRowProps {
  label: string;
  value: Vector3Tuple;
  step?: number;
  isAngle?: boolean;
  onChange: (next: Vector3Tuple) => void;
}

function VectorRow({ label, value, step = 0.1, isAngle = false, onChange }: VectorRowProps) {
  const display = isAngle ? (value.map((v) => v * RAD_TO_DEG) as Vector3Tuple) : value;

  const handleAxisChange = (axisIndex: number, raw: string) => {
    const parsed = parseFloat(raw);
    if (Number.isNaN(parsed)) return;
    const next: Vector3Tuple = [display[0] ?? 0, display[1] ?? 0, display[2] ?? 0];
    next[axisIndex] = parsed;
    onChange(
      isAngle
        ? ([next[0] * DEG_TO_RAD, next[1] * DEG_TO_RAD, next[2] * DEG_TO_RAD] as Vector3Tuple)
        : next
    );
  };

  return (
    <div className="px-3 mb-2">
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <div className="grid grid-cols-3 gap-1.5">
        {AXES.map((axisLabel, i) => {
          const axisValue = display[i] ?? 0;
          return (
            <div key={axisLabel} className="relative">
              <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">
                {axisLabel}
              </span>
              <input
                type="number"
                step={step}
                value={Number(axisValue.toFixed(3))}
                onChange={(e) => handleAxisChange(i, e.target.value)}
                className="input-dark pl-4 text-right"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Shows the currently selected object's name and transform, all editable. */
export default function PropertiesPanel() {
  const objects = useSceneStore((s) => s.objects);
  const selectedId = useSceneStore((s) => s.selectedId);
  const updateObject = useSceneStore((s) => s.updateObject);
  const renameObject = useSceneStore((s) => s.renameObject);

  const selected = objects.find((o) => o.id === selectedId);

  if (!selected) {
    return (
      <div>
        <div className="panel-section-title">Properties</div>
        <p className="text-xs text-gray-500 px-3 py-2">Select an object to edit its properties.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="panel-section-title">Properties</div>

      <div className="px-3 mb-3">
        <label className="text-xs text-gray-400 mb-1 block">Name</label>
        <input
          type="text"
          value={selected.name}
          onChange={(e) => renameObject(selected.id, e.target.value)}
          className="input-dark"
        />
      </div>

      <VectorRow
        label="Position"
        value={selected.position}
        onChange={(v) => updateObject(selected.id, { position: v })}
      />
      <VectorRow
        label="Rotation (deg)"
        value={selected.rotation}
        isAngle
        step={1}
        onChange={(v) => updateObject(selected.id, { rotation: v })}
      />
      <VectorRow
        label="Scale"
        value={selected.scale}
        step={0.1}
        onChange={(v) => updateObject(selected.id, { scale: v })}
      />
    </div>
  );
}
