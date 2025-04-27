import React, { useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { CubeTextureLoader } from 'three';

// Custom environment component that uses relative paths to load cubemaps
export function CustomEnvironment({ path = './textures/cubemap/' }) {
  const { scene } = useThree();
  
  useEffect(() => {
    // Use relative paths with the base path for GitHub Pages
    const loader = new CubeTextureLoader();
    
    // Important: Use relative paths that start with "./" instead of "/"
    const textureCube = loader.load([
      `${path}px.png`,
      `${path}nx.png`,
      `${path}py.png`,
      `${path}ny.png`,
      `${path}pz.png`,
      `${path}nz.png`
    ]);
    
    // Set the environment map
    scene.environment = textureCube;
    
    // Optional: Set as background if you want a skybox
    // scene.background = textureCube;
    
    return () => {
      // Clean up
      scene.environment = null;
      textureCube.dispose();
    };
  }, [scene, path]);
  
  return null;
}