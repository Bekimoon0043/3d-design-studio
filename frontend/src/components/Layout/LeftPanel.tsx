import ObjectLibrary from '../Panels/ObjectLibrary';
import ToolsPanel from '../Panels/ToolsPanel';
import SceneHierarchy from '../Panels/SceneHierarchy';
import PhysicsPanel from '../Panels/PhysicsPanel';
import AnimationPanel from '../Panels/AnimationPanel';
import LightingPanel from '../Panels/LightingPanel';
import CameraPanel from '../Panels/CameraPanel';

/** Left sidebar: object creation, transforms, simulation, animation, lighting, and hierarchy. */
export default function LeftPanel() {
  return (
    <aside className="w-72 shrink-0 bg-panel border-r border-border overflow-y-auto scroll-thin flex flex-col py-1">
      <ObjectLibrary />
      <div className="h-px bg-border my-3 mx-3" />
      <ToolsPanel />
      <div className="h-px bg-border my-3 mx-3" />
      <PhysicsPanel />
      <div className="h-px bg-border my-3 mx-3" />
      <AnimationPanel />
      <div className="h-px bg-border my-3 mx-3" />
      <LightingPanel />
      <div className="h-px bg-border my-3 mx-3" />
      <CameraPanel />
      <div className="h-px bg-border my-3 mx-3" />
      <SceneHierarchy />
    </aside>
  );
}
