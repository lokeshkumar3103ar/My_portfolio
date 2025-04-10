import React, { useRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { useWebGLContextRecovery } from '../../utils/useWebGLContextRecovery';
import { trackEvent } from '../../utils/analytics';

// Brain graph network component
const NodeNetwork = ({ count = 75, connections = 40, scrollProgress }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const groupRef = useRef();
  const { scene, gl, camera } = useThree();
  const { manageMemory } = useWebGLContextRecovery();
  const frameSkip = useRef(0);
  
  // Create nodes - reduced count for better performance
  const nodes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ),
      size: Math.random() * 0.12 + 0.04,
      color: isDarkMode 
        ? (i % 4 === 0 ? '#6366f1' : i % 3 === 0 ? '#8b5cf6' : '#a78bfa')
        : (i % 4 === 0 ? '#4f46e5' : i % 3 === 0 ? '#7c3aed' : '#8b5cf6')
    }));
  }, [isDarkMode]);

  // Create connections between nodes - reduced count for better performance
  const edges = useMemo(() => {
    const result = [];
    for (let i = 0; i < connections; i++) {
      const source = Math.floor(Math.random() * count);
      let target = Math.floor(Math.random() * count);
      // Avoid self-connections
      while (target === source) {
        target = Math.floor(Math.random() * count);
      }
      result.push({ source, target });
    }
    return result;
  }, [count, connections]);

  // Animation with frame skipping for performance optimization
  useFrame((state, delta) => {
    // Call memory manager every frame
    manageMemory(gl, scene, camera);
    
    // Skip frames for better performance
    frameSkip.current += 1;
    if (frameSkip.current % 2 !== 0) return;
    
    if (groupRef.current) {
      // Rotate based on scroll position - reduced animation speed
      groupRef.current.rotation.y = scrollProgress.get() * Math.PI + state.clock.elapsedTime * 0.03;
      
      // Apply rotation only on specific frames for performance
      if (frameSkip.current % 4 === 0) {
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.1;
      }
      
      // Pulse effect - reduced animation intensity
      const pulse = Math.sin(state.clock.elapsedTime) * 0.03 + 1;
      groupRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {nodes.map((node) => (
        <mesh key={node.id} position={node.position}>
          <sphereGeometry args={[node.size, 8, 8]} /> {/* Reduced geometry complexity */}
          <meshStandardMaterial 
            color={node.color} 
            emissive={node.color}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Edges - implement frustum culling for better performance */}
      {edges.map((edge, i) => {
        const start = nodes[edge.source].position;
        const end = nodes[edge.target].position;
        
        // Calculate edge midpoint and length
        const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const length = start.distanceTo(end);
        
        // Skip very long edges for better performance
        if (length > 8) return null;
        
        // Calculate rotation to point cylinder in right direction
        const direction = new THREE.Vector3().subVectors(end, start).normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction
        );
        
        return (
          <mesh 
            key={i} 
            position={midPoint} 
            quaternion={quaternion}
            frustumCulled={true} /* Enable frustum culling */
          >
            <cylinderGeometry args={[0.01, 0.01, length, 4]} /> {/* Reduced segments */}
            <meshBasicMaterial 
              color={isDarkMode ? '#6366f1' : '#4f46e5'} 
              opacity={0.4} /* Reduced opacity */
              transparent
            />
          </mesh>
        );
      })}
      
      {/* Central hub */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} /> {/* Reduced segments */}
        <meshStandardMaterial 
          color={isDarkMode ? '#6366f1' : '#4f46e5'} 
          emissive={isDarkMode ? '#6366f1' : '#4f46e5'}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
};

const ExpertiseModel = ({ scrollProgress }) => {
  const canvasRef = useRef(null);
  const { isContextLost, recoveryAttempts } = useWebGLContextRecovery(canvasRef);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  
  // Switch to low power mode if we've had to recover the context
  useEffect(() => {
    if (recoveryAttempts > 0) {
      setIsLowPowerMode(true);
      trackEvent('Performance', 'webgl_low_power_mode', 'ExpertiseModel', recoveryAttempts);
    }
  }, [recoveryAttempts]);
  
  return (
    <div className="w-full h-full">
      {isContextLost ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Optimizing brain network visualization...
          </p>
        </div>
      ) : (
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 0, 15], fov: 60 }}
          dpr={isLowPowerMode ? 1 : [1, 1.5]} // Limit resolution for better performance
          gl={{
            powerPreference: isLowPowerMode ? "low-power" : "default",
            antialias: !isLowPowerMode, // Disable for performance in low power mode
            stencil: false, // Not needed
            depth: true,
            alpha: true
          }}
          performance={{ min: 0.5 }} // Allow frame rate to drop to maintain stability
        >
          <React.Suspense fallback={null}>
            <NodeNetwork 
              scrollProgress={scrollProgress} 
              count={isLowPowerMode ? 40 : 75} // Reduce node count in low power mode
              connections={isLowPowerMode ? 25 : 40} // Reduce connection count in low power mode
            />
            <ambientLight intensity={0.2} />
            <spotLight position={[10, 10, 10]} intensity={0.8} castShadow={!isLowPowerMode} />
            <ContactShadows
              position={[0, -5, 0]}
              opacity={0.3}
              scale={20}
              blur={2}
              far={6}
              resolution={isLowPowerMode ? 64 : 128}
            />
            {isLowPowerMode ? null : <Environment preset="city" />}
          </React.Suspense>
        </Canvas>
      )}
    </div>
  );
};

export default ExpertiseModel;