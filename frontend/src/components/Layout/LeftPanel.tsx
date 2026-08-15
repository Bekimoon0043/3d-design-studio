import ObjectLibrary from '../Panels/ObjectLibrary';
import ToolsPanel from '../Panels/ToolsPanel';
import SceneHierarchy from '../Panels/SceneHierarchy';

/** Left sidebar: object creation library, transform tools, scene hierarchy. */
export default function LeftPanel() {
  return (
    <aside className="w-64 shrink-0 bg-panel border-r border-border overflow-y-auto scroll-thin flex flex-col py-1">
      <ObjectLibrary />
      <div className="h-px bg-border my-3 mx-3" />
      <ToolsPanel />
      <div className="h-px bg-border my-3 mx-3" />
      <SceneHierarchy />
    </aside>
  );
}
