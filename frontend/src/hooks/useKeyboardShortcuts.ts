import { useEffect } from 'react';
import { useSceneStore } from '../store/useSceneStore';

/**
 * Registers common editor keyboard shortcuts, mirroring conventions from
 * professional 3D tools (Blender-style W/E/R for move/rotate/scale).
 * Ignores keystrokes while the user is typing in an input/textarea.
 */
export function useKeyboardShortcuts() {
  const setTransformMode = useSceneStore((s) => s.setTransformMode);
  const selectedId = useSceneStore((s) => s.selectedId);
  const removeObject = useSceneStore((s) => s.removeObject);
  const duplicateObject = useSceneStore((s) => s.duplicateObject);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = ['INPUT', 'TEXTAREA'].includes(target.tagName);
      if (isTyping) return;

      switch (e.key.toLowerCase()) {
        case 'w':
          setTransformMode('translate');
          break;
        case 'e':
          setTransformMode('rotate');
          break;
        case 'r':
          setTransformMode('scale');
          break;
        case 'delete':
        case 'backspace':
          if (selectedId) removeObject(selectedId);
          break;
        case 'd':
          if ((e.ctrlKey || e.metaKey) && selectedId) {
            e.preventDefault();
            duplicateObject(selectedId);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setTransformMode, selectedId, removeObject, duplicateObject]);
}
