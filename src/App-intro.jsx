import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';

function Box() {
  const [clicked, setClicked] = useState(false);
  const box = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    box.current.position.z = THREE.MathUtils.lerp(
      box.current.position.z,
      clicked ? 1 : 0,
      0.1
    );
  });

  return (
    <mesh
      ref={box}
      onClick={() => {
        setClicked(!clicked);
      }}
      // position={[0, 0, clicked ? 1 : 0]}
    >
      <boxGeometry />
      <meshBasicMaterial color="orange" />
    </mesh>
  );
}

export default function App() {
  return (
    <>
      <Canvas>
        <Box />
      </Canvas>
    </>
  );
}
