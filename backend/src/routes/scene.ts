import { Router, Request, Response } from 'express';

const router = Router();

interface SceneObjectPayload {
  id: string;
  name: string;
  type: 'cube' | 'sphere' | 'cylinder' | 'plane';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  material: { color: string; metalness: number; roughness: number };
}

interface ScenePayload {
  version: number;
  objects: SceneObjectPayload[];
}

function isVector3(v: unknown): v is [number, number, number] {
  return Array.isArray(v) && v.length === 3 && v.every((n) => typeof n === 'number');
}

function validateScene(payload: unknown): payload is ScenePayload {
  if (typeof payload !== 'object' || payload === null) return false;
  const p = payload as Partial<ScenePayload>;
  if (typeof p.version !== 'number' || !Array.isArray(p.objects)) return false;

  return p.objects.every((obj) => {
    const o = obj as Partial<SceneObjectPayload>;
    return (
      typeof o.id === 'string' &&
      typeof o.name === 'string' &&
      ['cube', 'sphere', 'cylinder', 'plane'].includes(o.type as string) &&
      isVector3(o.position) &&
      isVector3(o.rotation) &&
      isVector3(o.scale) &&
      typeof o.material === 'object' &&
      o.material !== null &&
      typeof (o.material as any).color === 'string' &&
      typeof (o.material as any).metalness === 'number' &&
      typeof (o.material as any).roughness === 'number'
    );
  });
}

/**
 * POST /api/scene/validate
 * Validates a scene JSON payload against the expected shape. Useful as a
 * server-side safety net before persisting client-submitted scene data,
 * or as a foundation for future server-side export (e.g. to glTF).
 */
router.post('/validate', (req: Request, res: Response) => {
  const isValid = validateScene(req.body);
  if (!isValid) {
    res.status(400).json({ valid: false, error: 'Scene payload failed shape validation.' });
    return;
  }
  res.json({ valid: true, objectCount: (req.body as ScenePayload).objects.length });
});

export default router;
