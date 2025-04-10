import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { useGLTF, Float, Environment, ContactShadows, OrbitControls, Trail } from '@react-three/drei';
import { useMotionValue, useTransform, motion } from 'framer-motion';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { useWebGLContextRecovery } from '../../utils/useWebGLContextRecovery';

// Laminar Flow Particle component for smooth flowing effect
const LaminarFlowParticle = ({ radius, speed, color, axis, offset, width, trailLength, opacity }) => {
  const particle = useRef();
  const [active, setActive] = useState(false);
  
  useEffect(() => {
    // Small delay for staggered animation start
    const timer = setTimeout(() => setActive(true), Math.random() * 2000);
    return () => clearTimeout(timer);
  }, []);

  useFrame(({ clock }) => {
    if (!particle.current || !active) return;
    
    const t = clock.getElapsedTime() * speed + offset;
    
    // Create smooth flowing path - different for each axis orientation
    if (axis === 'xy') {
      particle.current.position.x = Math.sin(t) * radius;
      particle.current.position.y = Math.cos(t) * radius;
    } else if (axis === 'xz') {
      particle.current.position.x = Math.sin(t) * radius;
      particle.current.position.z = Math.cos(t) * radius;
    } else {
      particle.current.position.y = Math.sin(t) * radius;
      particle.current.position.z = Math.cos(t) * radius;
    }
  });

  return (
    <Trail 
      local
      width={width} 
      length={trailLength} 
      color={color}
      attenuation={(t) => t * t}
      opacity={opacity}
    >
      <mesh ref={particle}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
    </Trail>
  );
};

// Laminar Flow System component that creates multiple flow lines
const LaminarFlowSystem = ({ isDarkMode }) => {
  const primaryColor = isDarkMode ? "#4F46E5" : "#3B82F6";
  const secondaryColor = isDarkMode ? "#A78BFA" : "#60A5FA";
  
  // Create multiple flow systems on different planes
  return (
    <>
      {/* XY Plane Flow */}
      {[...Array(8)].map((_, i) => (
        <LaminarFlowParticle 
          key={`xy-${i}`}
          radius={3.2 + (i % 3) * 0.2}
          speed={0.2 + (i % 3) * 0.05}
          color={i % 2 === 0 ? primaryColor : secondaryColor}
          axis="xy"
          offset={i * Math.PI / 4}
          width={0.15 + (i % 3) * 0.05}
          trailLength={5 + i}
          opacity={0.4}
        />
      ))}
      
      {/* XZ Plane Flow */}
      {[...Array(6)].map((_, i) => (
        <LaminarFlowParticle 
          key={`xz-${i}`}
          radius={3 + (i % 3) * 0.15}
          speed={0.15 + (i % 3) * 0.05}
          color={i % 2 === 0 ? secondaryColor : primaryColor}
          axis="xz"
          offset={i * Math.PI / 3}
          width={0.12 + (i % 3) * 0.04}
          trailLength={4 + i}
          opacity={0.35}
        />
      ))}
      
      {/* YZ Plane Flow */}
      {[...Array(6)].map((_, i) => (
        <LaminarFlowParticle 
          key={`yz-${i}`}
          radius={2.8 + (i % 3) * 0.2}
          speed={0.18 + (i % 3) * 0.04}
          color={i % 2 === 0 ? primaryColor : secondaryColor}
          axis="yz"
          offset={i * Math.PI / 3}
          width={0.1 + (i % 3) * 0.05}
          trailLength={4 + i}
          opacity={0.3}
        />
      ))}
    </>
  );
};

const Model = ({ scrollYProgress }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const mesh = useRef();
  const light = useRef();
  const { scene, gl, camera } = useThree();
  const { manageMemory } = useWebGLContextRecovery();
  
  // Use motion values from framer motion to create smooth animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform mouse movement to rotation - reduced sensitivity for smoother movement
  const rotateY = useTransform(mouseX, [-500, 500], [0.3, -0.3]);
  const rotateX = useTransform(mouseY, [-500, 500], [-0.3, 0.3]);
  
  // For zoom effect based on scroll
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Handle mouse movement with debouncing for smoother performance
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    mouseX.set(clientX - innerWidth / 2);
    mouseY.set(clientY - innerHeight / 2);
  };
  
  // Add and remove event listener with debouncing
  useEffect(() => {
    let timeout;
    const debouncedMouseMove = (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        handleMouseMove(e);
      }, 10); // More responsive but still debounced
    };
    
    window.addEventListener('mousemove', debouncedMouseMove);
    
    // Add scroll event listener for zoom effect
    const handleScroll = () => {
      setScrollPosition(window.scrollY / (document.body.scrollHeight - window.innerHeight));
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', debouncedMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, []);
  
  // Update on each frame with optimized rendering
  useFrame((state, delta) => {
    // Call the memory manager on each frame to prevent context loss
    manageMemory(gl, scene, camera);
    
    if (mesh.current) {
      // Create breathing effect - smoother and more subtle
      mesh.current.position.y = Math.sin(state.clock.elapsedTime / 2.5) * 0.08;
      
      // Apply smooth easing for rotation based on mouse - increased responsiveness
      mesh.current.rotation.x += (rotateX.get() - mesh.current.rotation.x) * delta * 2;
      mesh.current.rotation.y += (rotateY.get() - mesh.current.rotation.y) * delta * 2;
      
      // Scroll-based rotation with much smoother transition - reduced speed factor from 1.5 to 0.5
      const targetZ = scrollYProgress.get() * Math.PI * 0.5;
      mesh.current.rotation.z += (targetZ - mesh.current.rotation.z) * delta * 0.5;
      
      // Apply zoom effect based on scroll
      const baseScale = 1.2; // Increased base size by 20%
      const scrollScale = scrollPosition * 0.15; // Slight zoom effect on scroll
      const targetScale = baseScale - scrollScale;
      mesh.current.scale.x += (targetScale - mesh.current.scale.x) * delta * 2;
      mesh.current.scale.y += (targetScale - mesh.current.scale.y) * delta * 2;
      mesh.current.scale.z += (targetScale - mesh.current.scale.z) * delta * 2;
    }
    
    if (light.current) {
      // Animate light with smoother movement
      light.current.position.x = Math.sin(state.clock.elapsedTime / 4) * 3.5;
      light.current.position.z = Math.cos(state.clock.elapsedTime / 4) * 3.5;
      
      // Pulse light intensity slightly for more dynamic feel
      light.current.intensity = 1.2 + Math.sin(state.clock.elapsedTime) * 0.2;
    }
    
    // Camera subtle movement for parallax effect
    if (camera && scrollYProgress) {
      const scrollValue = scrollYProgress.get();
      camera.position.y = scrollValue * -1; // Move camera down slightly on scroll
      camera.position.z = 12 - scrollValue * 1.5; // Zoom in slightly on scroll
      camera.lookAt(0, 0, 0);
    }
  });
  
  return (
    <>
      {/* Laminar Flow Effect - added around the model */}
      <LaminarFlowSystem isDarkMode={isDarkMode} />
      
      {/* Animated geometric shape - increased size */}
      <mesh ref={mesh} scale={[1.2, 1.2, 1.2]}>
        <octahedronGeometry args={[2, 2]} /> {/* Increased detail and size */}
        <meshStandardMaterial 
          color={isDarkMode ? "#4F46E5" : "#3B82F6"} 
          wireframe={true}
          emissive={isDarkMode ? "#4F46E5" : "#3B82F6"}
          emissiveIntensity={0.6} // Increased glow
        />
      </mesh>
      
      {/* Inner glowing sphere - increased size */}
      <mesh position={[0, 0, 0]} scale={[0.9, 0.9, 0.9]}>
        <sphereGeometry args={[1.8, 32, 16]} /> {/* Increased size */}
        <meshBasicMaterial 
          color={isDarkMode ? "#4F46E5" : "#3B82F6"} 
          opacity={0.2} // Increased opacity for more visible glow
          transparent={true}
        />
      </mesh>
      
      {/* Outer glow for more dramatic effect */}
      <mesh position={[0, 0, 0]} scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[2.2, 32, 16]} />
        <meshBasicMaterial 
          color={isDarkMode ? "#A78BFA" : "#60A5FA"} 
          opacity={0.05} 
          transparent={true}
        />
      </mesh>
      
      {/* Reduced number of floating particles since we've added laminar flow */}
      {[...Array(8)].map((_, i) => (
        <Float 
          key={i}
          speed={i % 3 === 0 ? 0.5 : i % 3 === 1 ? 1 : 1.5}
          rotationIntensity={i % 3 === 0 ? 0.3 : i % 3 === 1 ? 0.5 : 0.7}
          floatIntensity={i % 3 === 0 ? 0.3 : i % 3 === 1 ? 0.5 : 0.7}
        >
          <mesh position={[
            (Math.random() - 0.5) * 7, 
            (Math.random() - 0.5) * 7, 
            (Math.random() - 0.5) * 7
          ]}>
            <sphereGeometry args={[0.12 + Math.random() * 0.15, 12, 12]} />
            <meshStandardMaterial 
              color={i % 3 === 0 ? (isDarkMode ? "#A78BFA" : "#60A5FA") : (isDarkMode ? "#4F46E5" : "#3B82F6")} 
              emissive={i % 3 === 0 ? (isDarkMode ? "#A78BFA" : "#60A5FA") : (isDarkMode ? "#4F46E5" : "#3B82F6")}
              emissiveIntensity={0.7}
            />
          </mesh>
        </Float>
      ))}
      
      {/* Enhanced lighting for better visuals */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        ref={light} 
        position={[3, 3, 3]} 
        intensity={1.5}
        color={isDarkMode ? "#A78BFA" : "#60A5FA"}
        castShadow={false}
      />
      
      {/* Additional point light for dramatic effect */}
      <pointLight
        position={[-3, -2, 2]}
        intensity={0.5}
        color={isDarkMode ? "#4F46E5" : "#3B82F6"}
      />
    </>
  );
};

const HeroModel = ({ scrollYProgress }) => {
  const canvasRef = useRef(null);
  const { isContextLost, attemptContextRecovery } = useWebGLContextRecovery(canvasRef);
  
  return (
    <div className="w-full h-full">
      {isContextLost ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Reloading 3D visualization...
          </p>
        </div>
      ) : (
        <Canvas 
          ref={canvasRef}
          camera={{ position: [0, 0, 12], fov: 55 }} // Wider field of view for better perspective
          gl={{ 
            powerPreference: "default", 
            antialias: true, // Enabled for smoother visuals
            stencil: false,
            depth: true,
            alpha: true
          }}
          dpr={window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio} // Optimize for high-DPI displays
          performance={{ min: 0.5 }}
          style={{ touchAction: 'none' }} // Improve touch interaction
        >
          <React.Suspense fallback={null}>
            <Model scrollYProgress={scrollYProgress} />
            <ContactShadows
              position={[0, -2.5, 0]}
              opacity={0.5}
              scale={12} // Larger shadow
              blur={2.5} // Softer shadow
              far={6}
              resolution={256} // Higher resolution for better quality
            />
            <Environment preset="city" />
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              autoRotate={false}
              enableDamping={true} // Enabled for smoother interaction
              dampingFactor={0.05} // Gentle damping
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.5}
            />
          </React.Suspense>
        </Canvas>
      )}
    </div>
  );
};

export default HeroModel;