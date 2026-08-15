import { useSceneStore } from '../../store/useSceneStore';

export default function AnimationPanel() {
  const selectedId = useSceneStore((state) => state.selectedId);
  const selected = useSceneStore((state) => state.objects.find((object) => object.id === state.selectedId));
  const currentTime = useSceneStore((state) => state.currentTime);
  const isPlaying = useSceneStore((state) => state.isPlaying);
  const duration = useSceneStore((state) => state.sceneSettings.animationDuration);
  const setCurrentTime = useSceneStore((state) => state.setCurrentTime);
  const setIsPlaying = useSceneStore((state) => state.setIsPlaying);
  const addKeyframe = useSceneStore((state) => state.addKeyframe);
  const removeKeyframe = useSceneStore((state) => state.removeKeyframe);
  const updateSceneSettings = useSceneStore((state) => state.updateSceneSettings);

  return (
    <div>
      <div className="panel-section-title">Animation Timeline</div>
      <div className="px-3 space-y-2 pb-2">
        <div className="flex items-center gap-2">
          <button className="btn-primary flex-1" onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? 'Pause' : 'Play'}</button>
          <button className="btn-secondary" onClick={() => setCurrentTime(0)}>Reset</button>
        </div>
        <input className="w-full accent-[#4f7cff]" type="range" min="0" max={duration} step="0.01" value={currentTime} onChange={(event) => setCurrentTime(Number(event.target.value))} />
        <div className="flex justify-between text-[11px] text-gray-500"><span>{currentTime.toFixed(2)}s</span><span>{duration.toFixed(1)}s</span></div>
        <label className="text-xs text-gray-400 block">Duration (seconds)<input className="input-dark mt-1" type="number" min="1" max="120" step="1" value={duration} onChange={(event) => updateSceneSettings({ animationDuration: Math.min(120, Math.max(1, Number(event.target.value) || 10)) })} /></label>
        <div className="flex gap-2">
          <button disabled={!selectedId} className="btn-secondary flex-1 disabled:opacity-40" onClick={() => selectedId && addKeyframe(selectedId, currentTime)}>Add keyframe</button>
          <button disabled={!selected || !selected.keyframes.some((frame) => Math.abs(frame.time - currentTime) < 0.05)} className="btn-secondary flex-1 disabled:opacity-40" onClick={() => selected && removeKeyframe(selected.id, currentTime)}>Remove</button>
        </div>
        {selected && <div className="text-[11px] text-gray-500">{selected.keyframes.length} keyframe{selected.keyframes.length === 1 ? '' : 's'} on {selected.name}</div>}
      </div>
    </div>
  );
}
