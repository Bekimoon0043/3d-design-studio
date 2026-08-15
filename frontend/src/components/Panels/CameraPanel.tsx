import { useSceneStore } from '../../store/useSceneStore';
import type { CameraType, Vector3Tuple } from '../../types/scene';

function VectorInputs({ value, onChange }: { value: Vector3Tuple; onChange: (value: Vector3Tuple) => void }) {
  return <div className="grid grid-cols-3 gap-1">{value.map((axis, index) => <input key={index} className="input-dark text-right" type="number" step="0.1" value={Number(axis.toFixed(2))} onChange={(event) => { const next = [...value] as Vector3Tuple; next[index] = Number(event.target.value) || 0; onChange(next); }} />)}</div>;
}

export default function CameraPanel() {
  const camera = useSceneStore((state) => state.sceneSettings.camera);
  const render = useSceneStore((state) => state.sceneSettings.render);
  const updateSceneSettings = useSceneStore((state) => state.updateSceneSettings);

  const setCamera = (patch: Partial<typeof camera>) => updateSceneSettings({ camera: { ...camera, ...patch } });
  const setRender = (patch: Partial<typeof render>) => updateSceneSettings({ render: { ...render, ...patch } });

  return (
    <div>
      <div className="panel-section-title">Camera Setup</div>
      <div className="px-3 space-y-2 pb-3">
        <label className="text-xs text-gray-400 block">Camera type<select className="input-dark mt-1" value={camera.type} onChange={(event) => setCamera({ type: event.target.value as CameraType })}><option value="perspective">Perspective</option><option value="orthographic">Orthographic</option></select></label>
        <label className="text-xs text-gray-400 block">Position</label>
        <VectorInputs value={camera.position} onChange={(position) => setCamera({ position })} />
        <label className="text-xs text-gray-400 block">Look-at target</label>
        <VectorInputs value={camera.target} onChange={(target) => setCamera({ target })} />
        {camera.type === 'perspective' ? <label className="text-xs text-gray-400 block">Focal length / FOV<input className="input-dark mt-1" type="number" min="15" max="120" value={camera.fov} onChange={(event) => setCamera({ fov: Math.min(120, Math.max(15, Number(event.target.value) || 50)) })} /></label> : <label className="text-xs text-gray-400 block">Orthographic size<input className="input-dark mt-1" type="number" min="1" max="100" value={camera.orthoSize} onChange={(event) => setCamera({ orthoSize: Math.min(100, Math.max(1, Number(event.target.value) || 10)) })} /></label>}
        <div className="grid grid-cols-2 gap-2"><label className="text-xs text-gray-400">Near<input className="input-dark mt-1" type="number" min="0.01" step="0.1" value={camera.near} onChange={(event) => setCamera({ near: Math.max(0.01, Number(event.target.value) || 0.1) })} /></label><label className="text-xs text-gray-400">Far<input className="input-dark mt-1" type="number" min="10" step="10" value={camera.far} onChange={(event) => setCamera({ far: Math.max(10, Number(event.target.value) || 1000) })} /></label></div>
      </div>
      <div className="panel-section-title">Realistic Render</div>
      <div className="px-3 space-y-2 pb-3">
        <label className="text-xs text-gray-400 block">Render mode<select className="input-dark mt-1" value={render.mode} onChange={(event) => setRender({ mode: event.target.value as typeof render.mode })}><option value="realistic">Realistic</option><option value="studio">Studio preview</option></select></label>
        <div className="grid grid-cols-2 gap-2"><label className="text-xs text-gray-400">Width<input className="input-dark mt-1" type="number" min="320" max="3840" step="16" value={render.width} onChange={(event) => setRender({ width: Math.min(3840, Math.max(320, Number(event.target.value) || 1280)) })} /></label><label className="text-xs text-gray-400">Height<input className="input-dark mt-1" type="number" min="240" max="2160" step="16" value={render.height} onChange={(event) => setRender({ height: Math.min(2160, Math.max(240, Number(event.target.value) || 720)) })} /></label></div>
        <label className="text-xs text-gray-400 block">Exposure<input className="w-full accent-[#4f7cff]" type="range" min="0.1" max="3" step="0.05" value={render.exposure} onChange={(event) => setRender({ exposure: Number(event.target.value) })} /></label>
        <label className="text-xs text-gray-400 block">Environment strength<input className="w-full accent-[#4f7cff]" type="range" min="0" max="3" step="0.05" value={render.environmentIntensity} onChange={(event) => setRender({ environmentIntensity: Number(event.target.value) })} /></label>
        <label className="flex items-center justify-between text-xs text-gray-300">Soft shadows<input type="checkbox" checked={render.shadows} onChange={(event) => setRender({ shadows: event.target.checked })} /></label>
      </div>
    </div>
  );
}
