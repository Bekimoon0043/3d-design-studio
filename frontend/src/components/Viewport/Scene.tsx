import { Suspense, useCallback, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Grid, OrbitControls, TransformControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '../../store/useSceneStore';
import SceneObjectMesh from './SceneObjectMesh';
import { Vector3Tuple } from '../../types/scene';

function AxesHelper() {
  const axes = new THREE.AxesHelper(3);
  return <primitive object={axes} />;
}

function SelectionGizmo({ selectedMesh }: { selectedMesh: THREE.Object3D | null }) {
  const selectedId = useSceneStore((s) => s.selectedId);
  const transformMode = useSceneStore((s) => s.transformMode);
  const setObjectTransform = useSceneStore((s) => s.setObjectTransform);

  if (!selectedMesh || !selectedId) return null;

  const handleChange = () => {
    const obj = selectedMesh;
    const position: Vector3Tuple = [obj.position.x, obj.position.y, obj.position.z];
    const rotation: Vector3Tuple = [obj.rotation.x, obj.rotation.y, obj.rotation.z];
    const scale: Vector3Tuple = [obj.scale.x, obj.scale.y, obj.scale.z];
    if (transformMode === 'translate') setObjectTransform(selectedId, 'position', position);
    if (transformMode === 'rotate') setObjectTransform(selectedId, 'rotation', rotation);
    if (transformMode === 'scale') setObjectTransform(selectedId, 'scale', scale);
  };

  return (
    <TransformControls object={selectedMesh} mode={transformMode} onObjectChange={handleChange} />
  );
}

export default function Scene() {
  const objects = useSceneStore((s) => s.objects);
  const selectedId = useSceneStore((s) => s.selectedId);
  const selectObject = useSceneStore((s) => s.selectObject);

  const [, bumpVersion] = useState(0);
  const selectedMeshRef = useRef<THREE.Mesh | null>(null);

  const attachSelectedRef = useCallback((node: THREE.Mesh | null) => {
    selectedMeshRef.current = node;
    bumpVersion((v) => v + 1);
  }, []);

  return (
    <Canvas
      shadows
      camera={{ position: [6, 5, 8], fov: 50 }}
      onPointerMissed={() => selectObject(null)}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={['#17181c']} />
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[8, 10, 5]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.3} />

      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      <Grid
        args={[40, 40]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#3a3d45"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#565a66"
        fadeDistance={35}
        fadeStrength={1}
        infiniteGrid
      />
      <AxesHelper />

      {objects.map((obj) => (
        <SceneObjectMesh
          key={obj.id}
          ref={obj.id === selectedId ? attachSelectedRef : undefined}
          object={obj}
          isSelected={obj.id === selectedId}
          onSelect={selectObject}
        />
      ))}

      <SelectionGizmo selectedMesh={selectedId ? selectedMeshRef.current : null} />

      <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
    </Canvas>
  );
}
