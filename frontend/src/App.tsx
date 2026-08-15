import TopBar from './components/Layout/TopBar';
import LeftPanel from './components/Layout/LeftPanel';
import RightPanel from './components/Layout/RightPanel';
import Scene from './components/Viewport/Scene';
import { useAuth } from './hooks/useAuth';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useDraftAutosave } from './hooks/useDraftAutosave';

export default function App() {
  const { user } = useAuth();
  useKeyboardShortcuts();
  useDraftAutosave();

  return (
    <div className="h-screen w-screen flex flex-col bg-[#141519]">
      <TopBar user={user} />
      <div className="flex-1 flex overflow-hidden">
        <LeftPanel />
        <main className="flex-1 relative">
          <Scene />
        </main>
        <RightPanel />
      </div>
    </div>
  );
}
