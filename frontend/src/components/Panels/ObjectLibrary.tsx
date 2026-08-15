import { PrimitiveType } from '../../types/scene';
import { useSceneStore } from '../../store/useSceneStore';

const PRIMITIVES: { type: PrimitiveType; label: string; icon: string }[] = [
  { type: 'cube', label: 'Cube', icon: '◼' },
  { type: 'sphere', label: 'Sphere', icon: '●' },
  { type: 'cylinder', label: 'Cylinder', icon: '⬤' },
  { type: 'plane', label: 'Plane', icon: '▭' },
];

/** Grid of primitive buttons that add a new object to the scene when clicked. */
export default function ObjectLibrary() {
  const addObject = useSceneStore((s) => s.addObject);

  return (
    <div>
      <div className="panel-section-title">Create Object</div>
      <div className="grid grid-cols-2 gap-2 px-3">
        {PRIMITIVES.map((p) => (
          <button
            key={p.type}
            onClick={() => addObject(p.type)}
            className="flex flex-col items-center justify-center gap-1 bg-panelLight hover:bg-[#2c2f38] border border-border rounded-md py-3 text-gray-200 transition-colors"
            title={`Add ${p.label}`}
          >
            <span className="text-xl leading-none">{p.icon}</span>
            <span className="text-xs">{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
