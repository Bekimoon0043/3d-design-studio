import PropertiesPanel from '../Panels/PropertiesPanel';
import MaterialEditor from '../Panels/MaterialEditor';

/** Right sidebar: transform properties and material editor for the selected object. */
export default function RightPanel() {
  return (
    <aside className="w-72 shrink-0 bg-panel border-l border-border overflow-y-auto scroll-thin flex flex-col py-1">
      <PropertiesPanel />
      <div className="h-px bg-border my-3 mx-3" />
      <MaterialEditor />
    </aside>
  );
}
