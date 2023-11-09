import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';

function Banana({ z }) {
  const { nodes, materials } = useGLTF('/banana-v1.glb');
  const [clicked, setClicked] = useState(false);
  const box = useRef();

  // Almost the same thing as the state object that useFrame gives us, but for some of these objects it makes sense to pull them out here
  const { viewport, camera } = useThree();
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z]);

  const [data] = useState({
    // x: (Math.random() - 0.5) * 10,
    x: THREE.MathUtils.randFloatSpread(2),
    y: THREE.MathUtils.randFloatSpread(height),
    rX: Math.random() * Math.PI,
    rY: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  });

  useFrame((state, delta) => {
    box.current.rotation.set(
      (data.rX += 0.001),
      (data.rY += 0.001),
      (data.rZ += 0.001)
    );
    box.current.position.set(data.x * width, (data.y += 0.005), z);
    if (data.y > height) {
      data.y = -height;
    }
  });

  return (
    <mesh
      ref={box}
      castShadow
      receiveShadow
      geometry={nodes.banana.geometry}
      material={materials.skin}
      material-emissive="orange"
    />
  );
}

// export function Banana(props) {
//   const { nodes, materials } = useGLTF('/banana-v1.glb');
//   return (
//     <group {...props} dispose={null}>
//       <mesh
//         castShadow
//         receiveShadow
//         geometry={nodes.banana.geometry}
//         material={materials.skin}
//         rotation={[-Math.PI / 2, 0, 0]}
//         material-emissive="orange"
//       />
//     </group>
//   );
// }

useGLTF.preload('/banana-v1.glb');

export default function App({ count = 100, depth = 80 }) {
  return (
    <>
      <Canvas gl={{ alpha: false }} camera={{ near: 0.01, far: 100, fov: 30 }}>
        <color args={['#ffca5f']} attach="background" />

        {/* <spotLight position={[10, 10, 10]} intensity={1} /> */}
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          {Array.from({ length: count }, (_, i) => (
            <Banana key={i} z={-(i / count) * depth - 10} />
          ))}
          <EffectComposer>
            <DepthOfField
              target={[0, 0, depth / 2]}
              focalLength={1}
              bokehScale={30}
              height={700}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </>
  );
}
