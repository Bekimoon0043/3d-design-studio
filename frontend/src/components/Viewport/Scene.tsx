import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Grid, OrbitControls, TransformControls, Environment, PerspectiveCamera, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSceneStore } from '../../store/useSceneStore';
import type { SceneObject, Vector3Tuple } from '../../types/scene';
import SceneObjectMesh from './SceneObjectMesh';

function AxesHelper() {
  return <primitive object={new THREE.AxesHelper(3)} />;
}

function interpolate(a: Vector3Tuple, b: Vector3Tuple, amount: number): Vector3Tuple {
  return [a[0] + (b[0] - a[0]) * amount, a[1] + (b[1] - a[1]) * amount, a[2] + (b[2] - a[2]) * amount];
}

function evaluateKeyframes(object: SceneObject, time: number) {
  if (object.keyframes.length === 0) return null;
  const frames = object.keyframes;
  if (time <= frames[0]!.time) return frames[0];
  if (time >= frames[frames.length - 1]!.time) return frames[frames.length - 1];
  for (let index = 0; index < frames.length - 1; index += 1) {
    const left = frames[index]!;
    const right = frames[index + 1]!;
    if (time >= left.time && time <= right.time) {
      const amount = (time - left.time) / Math.max(0.0001, right.time - left.time);
      return { position: interpolate(left.position, right.position, amount), rotation: interpolate(left.rotation, right.rotation, amount), scale: interpolate(left.scale, right.scale, amount) };
    }
  }
  return null;
}

function CameraRig() {
  const cameraSettings = useSceneStore((state) => state.sceneSettings.camera);
  const cameraType = cameraSettings.type;
  const position = cameraSettings.position;
  const target = cameraSettings.target;
  const { camera } = useThree();
  useEffect(() => {
    camera.position.fromArray(position);
    camera.lookAt(new THREE.Vector3(...target));
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = cameraSettings.fov;
      camera.near = cameraSettings.near;
      camera.far = cameraSettings.far;
    } else if (camera instanceof THREE.OrthographicCamera) {
      const aspect = window.innerWidth / Math.max(1, window.innerHeight);
      camera.left = (-cameraSettings.orthoSize * aspect) / 2;
      camera.right = (cameraSettings.orthoSize * aspect) / 2;
      camera.top = cameraSettings.orthoSize / 2;
      camera.bottom = -cameraSettings.orthoSize / 2;
      camera.near = cameraSettings.near;
      camera.far = cameraSettings.far;
    }
    camera.updateProjectionMatrix();
  }, [camera, cameraSettings, position, target]);
  return cameraType === 'orthographic' ? <OrthographicCamera makeDefault position={position} zoom={2} /> : <PerspectiveCamera makeDefault position={position} fov={cameraSettings.fov} near={cameraSettings.near} far={cameraSettings.far} />;
}

function RuntimeRenderer() {
  const render = useSceneStore((state) => state.sceneSettings.render);
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMapping = render.mode === 'realistic' ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;
    gl.toneMappingExposure = render.exposure;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.shadowMap.enabled = render.shadows;
    gl.shadowMap.type = render.mode === 'realistic' ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
  }, [gl, render]);
  return null;
}

function RuntimeSimulation() {
  useFrame((_, delta) => {
    const state = useSceneStore.getState();
    const step = Math.min(delta, 0.05);
    state.objects.forEach((object) => {
      if (object.keyframes.length > 0) {
        const pose = evaluateKeyframes(object, state.currentTime);
        if (pose) state.updateRuntimeObject(object.id, pose);
        return;
      }
      if (!object.physics.enabled) return;
      const velocity: Vector3Tuple = [...object.physics.velocity] as Vector3Tuple;
      if (object.physics.useGravity) {
        velocity[0] += state.sceneSettings.gravity[0] * step;
        velocity[1] += state.sceneSettings.gravity[1] * step;
        velocity[2] += state.sceneSettings.gravity[2] * step;
      }
      const position: Vector3Tuple = [object.position[0] + velocity[0] * step, object.position[1] + velocity[1] * step, object.position[2] + velocity[2] * step];
      const floor = object.type === 'plane' ? 0 : 0.5 * Math.abs(object.scale[1]);
      if (position[1] < floor) {
        position[1] = floor;
        velocity[1] = Math.abs(velocity[1]) * object.physics.restitution;
        if (Math.abs(velocity[1]) < 0.08) velocity[1] = 0;
      }
      state.updateRuntimeObject(object.id, { position, physics: { ...object.physics, velocity } });
    });
    if (state.isPlaying) {
      const next = state.currentTime + step;
      state.setCurrentTime(next >= state.sceneSettings.animationDuration ? 0 : next);
    }
  });
  return null;
}

function RenderCapture() {
  const render = useSceneStore((state) => state.sceneSettings.render);
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    const handleCapture = () => {
      const originalSize = gl.getSize(new THREE.Vector2());
      const originalPixelRatio = gl.getPixelRatio();
      gl.setPixelRatio(render.pixelRatio);
      gl.setSize(render.width, render.height, false);
      gl.render(scene, camera);
      gl.domElement.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = '3d-studio-render.png';
        link.click();
        URL.revokeObjectURL(url);
        gl.setPixelRatio(originalPixelRatio);
        gl.setSize(originalSize.x, originalSize.y, false);
      }, 'image/png');
    };
    window.addEventListener('render-scene', handleCapture);
    return () => window.removeEventListener('render-scene', handleCapture);
  }, [gl, scene, camera, render]);
  return null;
}

function SelectionGizmo({ selectedMesh }: { selectedMesh: THREE.Object3D | null }) {
  const selectedId = useSceneStore((state) => state.selectedId);
  const transformMode = useSceneStore((state) => state.transformMode);
  const transformSpace = useSceneStore((state) => state.transformSpace);
  const snapEnabled = useSceneStore((state) => state.snapEnabled);
  const snapSize = useSceneStore((state) => state.snapSize);
  const setObjectTransform = useSceneStore((state) => state.setObjectTransform);
  if (!selectedMesh || !selectedId) return null;

  const handleChange = () => {
    const position: Vector3Tuple = [selectedMesh.position.x, selectedMesh.position.y, selectedMesh.position.z];
    const rotation: Vector3Tuple = [selectedMesh.rotation.x, selectedMesh.rotation.y, selectedMesh.rotation.z];
    const scale: Vector3Tuple = [selectedMesh.scale.x, selectedMesh.scale.y, selectedMesh.scale.z];
    if (transformMode === 'translate') setObjectTransform(selectedId, 'position', position);
    if (transformMode === 'rotate') setObjectTransform(selectedId, 'rotation', rotation);
    if (transformMode === 'scale') setObjectTransform(selectedId, 'scale', scale);
  };

  return <TransformControls object={selectedMesh} mode={transformMode} space={transformSpace} translationSnap={snapEnabled ? snapSize : undefined} rotationSnap={snapEnabled ? THREE.MathUtils.degToRad(snapSize * 15) : undefined} scaleSnap={snapEnabled ? snapSize : undefined} onObjectChange={handleChange} />;
}

export default function Scene() {
  const objects = useSceneStore((state) => state.objects);
  const selectedId = useSceneStore((state) => state.selectedId);
  const settings = useSceneStore((state) => state.sceneSettings);
  const selectObject = useSceneStore((state) => state.selectObject);
  const [, bumpVersion] = useState(0);
  const selectedMeshRef = useRef<THREE.Mesh | null>(null);
  const attachSelectedRef = useCallback((node: THREE.Mesh | null) => { selectedMeshRef.current = node; bumpVersion((value) => value + 1); }, []);

  return (
    <Canvas shadows camera={{ position: settings.camera.position, fov: settings.camera.fov }} onPointerMissed={() => selectObject(null)} dpr={[1, 1.5]} gl={{ preserveDrawingBuffer: true, antialias: true }}>
      <CameraRig />
      <RuntimeRenderer />
      <color attach="background" args={[settings.backgroundColor]} />
      <ambientLight intensity={settings.ambientIntensity} />
      <directionalLight position={settings.keyLightPosition} color={settings.keyLightColor} intensity={settings.keyLightIntensity} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-6, 4, -4]} intensity={settings.fillLightIntensity} />
      <Suspense fallback={null}><Environment preset="city" environmentIntensity={settings.render.environmentIntensity} /></Suspense>
      <Grid args={[40, 40]} cellSize={1} cellThickness={0.5} cellColor="#3a3d45" sectionSize={5} sectionThickness={1} sectionColor="#565a66" fadeDistance={35} fadeStrength={1} infiniteGrid />
      <AxesHelper />
      <RuntimeSimulation />
      <RenderCapture />
      {objects.map((object) => <SceneObjectMesh key={object.id} ref={object.id === selectedId ? attachSelectedRef : undefined} object={object} isSelected={object.id === selectedId} onSelect={selectObject} />)}
      <SelectionGizmo selectedMesh={selectedId ? selectedMeshRef.current : null} />
      <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
    </Canvas>
  );
}
