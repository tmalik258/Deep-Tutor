"use client";
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

interface AvatarProps {
  avatarUrl: string; // Explicitly defining the type of avatarUrl as string
}

const Avatar = ({ avatarUrl }: AvatarProps) => {
  const { scene } = useGLTF(avatarUrl); // useGLTF provides the correct types internally
  
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <primitive object={scene} scale={1.5} />
      <OrbitControls />
    </Canvas>
  );
};

export default Avatar;
