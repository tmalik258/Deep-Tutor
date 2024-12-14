"use client"

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

interface AvatarProps {
  avatarUrl: string;
}

function AvatarModel({ avatarUrl }: { avatarUrl: string }) {
  const { scene } = useGLTF(avatarUrl);
    
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <primitive object={scene} scale={1.5} />
      <OrbitControls />
    </>
  );
}

const Avatar = ({ avatarUrl }: AvatarProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Canvas onCreated={() => setIsLoading(false)}>
      {!isLoading && (
        <Suspense fallback={null}>
          <AvatarModel avatarUrl={avatarUrl} />
        </Suspense>
      )}
    </Canvas>
  );
};

export default Avatar;