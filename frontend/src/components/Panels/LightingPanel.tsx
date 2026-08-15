import { useSceneStore } from '../../store/useSceneStore';
import type { Vector3Tuple } from '../../types/scene';

function NumberVector({ value, onChange }: { value: Vector3Tuple; onChange: (value: Vector3Tuple) => void }) {
  return <div className="grid grid-cols-3 gap-1">{value.map((axis, index) => <input key={index} className="input-dark text-right" type="number" step="0.5" value={Number(axis.toFixed(2))} onChange={(event) => { const next = [...value] as Vector3Tuple; next[index] = Number(event.target.value) || 0; onChange(next); }} />)}</div>;
}

export default function LightingPanel() {
  const settings = useSceneStore((state) => state.sceneSettings);
  const updateSceneSettings = useSceneStore((state) => state.updateSceneSettings);
  return (
    <div>
      <div className="panel-section-title">Lighting & Render</div>
      <div className="px-3 space-y-2 pb-3">
        <label className="text-xs text-gray-400 block">Background <input className="w-full h-8 mt-1" type="color" value={settings.backgroundColor} onChange={(event) => updateSceneSettings({ backgroundColor: event.target.value })} /></label>
        <label className="text-xs text-gray-400 block">Key light color <input className="w-full h-8 mt-1" type="color" value={settings.keyLightColor} onChange={(event) => updateSceneSettings({ keyLightColor: event.target.value })} /></label>
        <label className="text-xs text-gray-400 block">Key intensity <input className="w-full accent-[#4f7cff]" type="range" min="0" max="4" step="0.05" value={settings.keyLightIntensity} onChange={(event) => updateSceneSettings({ keyLightIntensity: Number(event.target.value) })} /></label>
        <label className="text-xs text-gray-400 block">Ambient intensity <input className="w-full accent-[#4f7cff]" type="range" min="0" max="2" step="0.05" value={settings.ambientIntensity} onChange={(event) => updateSceneSettings({ ambientIntensity: Number(event.target.value) })} /></label>
        <label className="text-xs text-gray-400 block">Fill intensity <input className="w-full accent-[#4f7cff]" type="range" min="0" max="2" step="0.05" value={settings.fillLightIntensity} onChange={(event) => updateSceneSettings({ fillLightIntensity: Number(event.target.value) })} /></label>
        <label className="text-xs text-gray-400 block">Key light position</label>
        <NumberVector value={settings.keyLightPosition} onChange={(keyLightPosition) => updateSceneSettings({ keyLightPosition })} />
      </div>
    </div>
  );
}
