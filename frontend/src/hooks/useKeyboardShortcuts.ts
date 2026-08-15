import { useEffect } from 'react';
import { useSceneStore } from '../store/useSceneStore';

/** Registers Blender-style transform shortcuts plus common scene editing commands. */
export function useKeyboardShortcuts() {
  const setTransformMode = useSceneStore((s) => s.setTransformMode);
  const selectedId = useSceneStore((s) => s.selectedId);
  const removeObject = useSceneStore((s) => s.removeObject);
  const duplicateObject = useSceneStore((s) => s.duplicateObject);
  const undo = useSceneStore((s) => s.undo);
  const redo = useSceneStore((s) => s.redo);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if (isTyping) return;

      const modifier = event.ctrlKey || event.metaKey;
      if (modifier && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
        return;
      }
      if (modifier && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        redo();
        return;
      }

      switch (event.key.toLowerCase()) {
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
          if (modifier && selectedId) {
            event.preventDefault();
            duplicateObject(selectedId);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setTransformMode, selectedId, removeObject, duplicateObject, undo, redo]);
}
