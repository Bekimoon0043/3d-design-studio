import { forwardRef } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneObject } from '../../types/scene';

interface Props {
  object: SceneObject;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/**
 * Renders a single primitive (cube/sphere/cylinder/plane) using the object's
 * transform + material data from the store.
 */
const SceneObjectMesh = forwardRef<THREE.Mesh, Props>(({ object, isSelected, onSelect }, ref) => {
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(object.id);
  };

  const renderGeometry = () => {
    switch (object.type) {
      case 'cube':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.6, 32, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
      case 'plane':
        return <planeGeometry args={[2, 2]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh
      ref={ref}
      name={object.id}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
      castShadow
      receiveShadow
      onClick={handleClick}
    >
      {renderGeometry()}
      <meshPhysicalMaterial
        color={object.material.color}
        metalness={object.material.metalness}
        roughness={object.material.roughness}
        clearcoat={0.18}
        clearcoatRoughness={0.24}
        emissive={isSelected ? new THREE.Color('#4f7cff') : new THREE.Color('#000000')}
        emissiveIntensity={isSelected ? 0.25 : 0}
      />
    </mesh>
  );
});

SceneObjectMesh.displayName = 'SceneObjectMesh';

export default SceneObjectMesh;
