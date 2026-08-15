import { useSceneStore } from '../../store/useSceneStore';

export default function PhysicsPanel() {
  const selectedId = useSceneStore((state) => state.selectedId);
  const selected = useSceneStore((state) => state.objects.find((object) => object.id === state.selectedId));
  const updateObject = useSceneStore((state) => state.updateObject);
  const updateRuntimeObject = useSceneStore((state) => state.updateRuntimeObject);

  if (!selected || !selectedId) {
    return <div><div className="panel-section-title">Physics</div><p className="text-xs text-gray-500 px-3 pb-2">Select an object to configure its body.</p></div>;
  }

  return (
    <div>
      <div className="panel-section-title">Physics Body</div>
      <div className="px-3 space-y-2 pb-2">
        <label className="flex items-center justify-between text-xs text-gray-300">
          Simulate body
          <input type="checkbox" checked={selected.physics.enabled} onChange={(event) => updateObject(selected.id, { physics: { ...selected.physics, enabled: event.target.checked } })} />
        </label>
        <label className="flex items-center justify-between text-xs text-gray-300">
          Use gravity
          <input type="checkbox" checked={selected.physics.useGravity} onChange={(event) => updateObject(selected.id, { physics: { ...selected.physics, useGravity: event.target.checked } })} />
        </label>
        <label className="text-xs text-gray-400 block">Mass <input className="input-dark mt-1" type="number" min="0.1" step="0.1" value={selected.physics.mass} onChange={(event) => updateObject(selected.id, { physics: { ...selected.physics, mass: Math.max(0.1, Number(event.target.value) || 1) } })} /></label>
        <label className="text-xs text-gray-400 block">Restitution <input className="input-dark mt-1" type="number" min="0" max="1" step="0.05" value={selected.physics.restitution} onChange={(event) => updateObject(selected.id, { physics: { ...selected.physics, restitution: Math.min(1, Math.max(0, Number(event.target.value) || 0)) } })} /></label>
        <button className="btn-secondary w-full" onClick={() => updateRuntimeObject(selected.id, { physics: { ...selected.physics, velocity: [0, 0, 0] } })}>Reset velocity</button>
      </div>
    </div>
  );
}
