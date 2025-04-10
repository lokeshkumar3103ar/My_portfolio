import React, { useRef, useEffect, useState, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Html, 
  useTexture, 
  PresentationControls, 
  Environment, 
  ContactShadows,
  useGLTF,
  Plane,
  MeshDistortMaterial,
  CameraShake
} from '@react-three/drei';
import { gsap } from 'gsap';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { useWebGLContextRecovery } from '../../utils/useWebGLContextRecovery';
import { trackEvent } from '../../utils/analytics';

// Project Card component that will be displayed in 3D space
const ProjectCard = ({ project, position, rotation, onClick, hovered, setHovered, index }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const cardRef = useRef();
  const { size, scene, gl, camera } = useThree();
  const materialRef = useRef();
  const { manageMemory } = useWebGLContextRecovery();
  
  // Load texture for the project image - optimized with error handling
  let texture;
  try {
    texture = useTexture(project.image);
  } catch (e) {
    console.error(`Failed to load texture for ${project.title}:`, e);
    // Use a placeholder texture if loading fails
    texture = new THREE.Texture();
  }
  
  // Optimization: Only animate when visible in viewport
  const isVisible = useRef(true);
  useEffect(() => {
    const checkVisibility = () => {
      if (cardRef.current) {
        // Convert 3D position to screen position
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(cardRef.current.matrixWorld);
        vector.project(camera);
        
        const x = (vector.x + 1) * size.width / 2;
        const y = (-vector.y + 1) * size.height / 2;
        
        // Check if object is within viewport
        isVisible.current = (
          x > 0 && x < size.width &&
          y > 0 && y < size.height
        );
      }
    };
    
    checkVisibility();
  }, [camera, size]);
  
  // Animation for card hover effect with morphing - optimized with RAF
  useEffect(() => {
    if (!cardRef.current || !isVisible.current) return;
    
    // Use requestAnimationFrame for smoother animation with less overhead
    let animationId;
    const animateCard = () => {
      if (!cardRef.current) return;
      
      // Position and rotation animation
      gsap.to(cardRef.current.position, {
        y: hovered === index ? position[1] + 0.4 : position[1],
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
        onComplete: () => animationId = null
      });
      
      gsap.to(cardRef.current.rotation, {
        y: hovered === index ? rotation[1] + 0.3 : rotation[1],
        z: hovered === index ? rotation[2] + 0.05 : rotation[2],
        duration: 0.5,
        ease: 'power2.out'
      });
      
      // Scale animation
      gsap.to(cardRef.current.scale, {
        x: hovered === index ? 1.1 : 1,
        y: hovered === index ? 1.1 : 1,
        z: hovered === index ? 1.1 : 1,
        duration: 0.5,
        ease: 'power2.out'
      });
      
      // Material distortion animation for morphing effect
      if (materialRef.current) {
        gsap.to(materialRef.current, {
          speed: hovered === index ? 2 : 0.2,
          distort: hovered === index ? 0.2 : 0.05,
          radius: hovered === index ? 1 : 0.5,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
    };
    
    animateCard();
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [hovered, index, position, rotation]);
  
  // Subtle continuous movement - optimized with reduced updates
  useFrame(({ clock }) => {
    // Manage WebGL memory every frame
    manageMemory(gl, scene, camera);
    
    if (cardRef.current && hovered !== index && isVisible.current) {
      // Only update every few frames for better performance
      if (Math.floor(clock.elapsedTime * 10) % 3 === 0) {
        const t = clock.getElapsedTime() * 0.5 + index;
        cardRef.current.position.y = position[1] + Math.sin(t) * 0.05;
        cardRef.current.rotation.z = rotation[2] + Math.sin(t * 0.5) * 0.01;
      }
    }
  });
  
  return (
    <group 
      ref={cardRef} 
      position={position} 
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        onClick(project);
      }}
      onPointerOver={() => setHovered(index)}
      onPointerOut={() => setHovered(null)}
    >
      {/* Card base with distortion material for morphing effect */}
      <mesh castShadow receiveShadow={false}> {/* Disabled shadow receiving for performance */}
        <boxGeometry args={[2, 3, 0.1]} />
        <MeshDistortMaterial
          ref={materialRef}
          color={isDarkMode ? "#1F2937" : "#FFFFFF"}
          speed={0.2}
          distort={0.05}
          radius={0.5}
          metalness={0.4}
          roughness={0.2}
        />
      </mesh>
      
      {/* Project image with parallax effect */}
      <mesh position={[0, 0.5, 0.06]}>
        <planeGeometry args={[1.8, 1.2, 10, 10]} /> {/* Reduced geometry complexity */}
        <meshStandardMaterial 
          map={texture} 
          metalness={0.1}
          roughness={0.6}
          envMapIntensity={0.8}
        />
      </mesh>
      
      {/* Decorative pattern */}
      <mesh position={[0, 0, 0.05]} rotation={[0, 0, Math.PI / 6]}>
        <planeGeometry args={[2.2, 3.2]} />
        <meshStandardMaterial 
          color={isDarkMode ? "#2D3748" : "#F3F4F6"}
          wireframe={true}
          transparent={true}
          opacity={0.1}
        />
      </mesh>
      
      {/* Project info with improved styling - only render HTML when visible */}
      {isVisible.current && (
        <Html 
          position={[0, -0.7, 0.06]} 
          transform 
          scale={0.15} 
          rotation={[0, 0, 0]} 
          distanceFactor={1.5}
          occlude
        >
          <div className={`w-[250px] text-center p-2 rounded-lg backdrop-blur-sm ${isDarkMode ? "bg-slate-900/60 text-white" : "bg-white/60 text-gray-800"}`}>
            <h3 className="font-bold text-xl mb-1">{project.title}</h3>
            <div className="flex justify-center gap-1 flex-wrap mb-2">
              {project.tags.slice(0, 3).map((tag, i) => (
                <span 
                  key={i} 
                  className={`${
                    isDarkMode 
                      ? "bg-indigo-900/50 text-indigo-300" 
                      : "bg-indigo-100 text-indigo-800"
                  } px-2 py-0.5 rounded-full text-xs backdrop-blur-md`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Html>
      )}
      
      {/* Hover indicator with glow effect - only render when hovered */}
      {hovered === index && isVisible.current && (
        <group position={[0, -1.4, 0.06]}>
          <mesh>
            <planeGeometry args={[1.4, 0.4]} />
            <meshBasicMaterial 
              color={isDarkMode ? "#4F46E5" : "#3B82F6"} 
              opacity={0.9} 
              transparent
            />
          </mesh>
          
          {/* Glow effect */}
          <mesh position={[0, 0, -0.01]} scale={[1.2, 1.2, 1]}>
            <planeGeometry args={[1.4, 0.4]} />
            <meshBasicMaterial 
              color={isDarkMode ? "#4F46E5" : "#3B82F6"} 
              opacity={0.4} 
              transparent
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          
          <Html 
            position={[0, 0, 0.01]} 
            transform 
            scale={0.1} 
            rotation={[0, 0, 0]}
          >
            <div className="text-white text-center font-medium w-[120px] flex items-center justify-center">
              <span>View Project</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Html>
        </group>
      )}
      
      {/* Category indicator with pulsing animation */}
      <group position={[0.8, 1.4, 0.06]}>
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} /> {/* Reduced segments */}
          <meshStandardMaterial 
            color={project.category === "Web-based Attendance" ? "#10B981" : 
                  project.category === "Prompt Crafter" ? "#F59E0B" :
                  project.category === "Prompt Systems" ? "#8B5CF6" :
                  project.category === "TINE" ? "#3B82F6" : "#3B82F6"}
            emissive={project.category === "Web-based Attendance" ? "#10B981" : 
                     project.category === "Prompt Crafter" ? "#F59E0B" :
                     project.category === "Prompt Systems" ? "#8B5CF6" :
                     project.category === "TINE" ? "#3B82F6" : "#3B82F6"}
            emissiveIntensity={hovered === index ? 1 : 0.5}
          />
        </mesh>
        
        {/* Pulsing effect - only render when hovered for performance */}
        {hovered === index && isVisible.current && (
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial 
              color={project.category === "Web-based Attendance" ? "#10B981" : 
                    project.category === "Prompt Crafter" ? "#F59E0B" :
                    project.category === "Prompt Systems" ? "#8B5CF6" :
                    project.category === "TINE" ? "#3B82F6" : "#3B82F6"}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};

// Enhanced scene with immersive effects & optimized for performance
const ProjectsScene = ({ projects, onProjectSelect }) => {
  const [hovered, setHovered] = useState(null);
  const groupRef = useRef();
  const { camera, viewport, gl, scene } = useThree();
  const { manageMemory } = useWebGLContextRecovery();
  const frameCount = useRef(0);
  
  // Setup enhanced initial camera position and scene parameters
  useEffect(() => {
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 0, 0);
    
    // Create intro animation for the scene
    if (groupRef.current) {
      gsap.fromTo(
        groupRef.current.rotation,
        { y: Math.PI * 2 },
        { y: 0, duration: 2, ease: "power3.out" }
      );
      
      gsap.fromTo(
        groupRef.current.position,
        { y: -5 },
        { y: 0, duration: 1.5, ease: "elastic.out(1, 0.5)" }
      );
    }
    
    // Track the scene initialization for analytics
    trackEvent('Performance', '3d_scene_loaded', 'ProjectModel', projects.length);
    
    // Clean up GSAP animations on unmount
    return () => {
      gsap.killTweensOf(groupRef.current?.rotation);
      gsap.killTweensOf(groupRef.current?.position);
    };
  }, [camera, projects.length]);
  
  // Enhanced interactive rotation with inertia - optimized with frame skipping
  useFrame(({ clock, mouse, viewport }) => {
    // Call memory manager every frame
    manageMemory(gl, scene, camera);
    
    // Skip frames for better performance
    frameCount.current += 1;
    if (frameCount.current % 2 !== 0) return;
    
    if (groupRef.current) {
      // Smoother mouse-based rotation with inertia
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        (mouse.x * Math.PI) / 4,
        0.03
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        (-mouse.y * Math.PI) / 10,
        0.03
      );
      
      // Subtle continuous rotation - reduced rate
      groupRef.current.rotation.y += 0.0005;
      
      // Parallax effect based on mouse position
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        mouse.x * viewport.width * 0.03, // Reduced movement intensity
        0.05
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        mouse.y * viewport.height * 0.01 + 0.5, // Reduced movement intensity
        0.05
      );
    }
  });
  
  return (
    <>
      {/* Add camera shake for immersive feel - reduced intensity */}
      <CameraShake 
        intensity={0.1} // Reduced intensity
        maxYaw={0.005} 
        maxPitch={0.005} 
        maxRoll={0.005} 
        yawFrequency={0.1} 
        pitchFrequency={0.1} 
        rollFrequency={0.1}
      />
      
      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 3, Math.PI / 3]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 300 }}
        zoom={1.2}
        speed={1.5}
      >
        <group ref={groupRef}>
          {/* Background plane with morphing effect */}
          <mesh position={[0, 0, -2]} rotation={[0, 0, 0]} scale={[15, 15, 1]}>
            <planeGeometry args={[1, 1, 16, 16]} /> {/* Reduced segments */}
            <MeshDistortMaterial
              color="#0F172A"
              transparent
              opacity={0.4}
              speed={0.8}
              distort={0.4}
              radius={1}
            />
          </mesh>
          
          {/* Project cards */}
          {projects.map((project, i) => {
            // Calculate position in a more interesting curved arrangement
            const totalProjects = projects.length;
            const angle = (i / totalProjects) * Math.PI * 2;
            const radius = Math.min(totalProjects * 0.6, 4);
            
            // Create slight variation in positioning for more natural look
            const variationX = Math.sin(i * 912.3) * 0.3;
            const variationY = Math.cos(i * 423.1) * 0.2;
            const variationZ = Math.sin(i * 133.7) * 0.15;
            
            const x = Math.sin(angle) * radius + variationX;
            const y = variationY;
            const z = Math.cos(angle) * radius + variationZ;
            
            return (
              <ProjectCard
                key={project.id}
                project={project}
                position={[x, y, z]}
                rotation={[0, -angle + Math.PI, 0]}
                onClick={onProjectSelect}
                hovered={hovered}
                setHovered={setHovered}
                index={i}
              />
            );
          })}
          
          {/* Enhanced center decoration - simplified for performance */}
          <group>
            {/* Outer ring */}
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[3, 0.05, 16, 64]} /> {/* Reduced segments */}
              <meshStandardMaterial 
                color="#3B82F6" 
                emissive="#3B82F6" 
                emissiveIntensity={0.4}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            
            {/* Inner ring with opposite rotation */}
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
              <torusGeometry args={[2, 0.03, 16, 50]} /> {/* Reduced segments */}
              <meshStandardMaterial 
                color="#8B5CF6" 
                emissive="#8B5CF6" 
                emissiveIntensity={0.4}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            
            {/* Animated center sphere */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} /> {/* Reduced segments */}
              <meshStandardMaterial 
                color="#FFFFFF"
                emissive="#FFFFFF"
                emissiveIntensity={0.4}
                metalness={1}
                roughness={0.1}
              />
            </mesh>
          </group>
          
          {/* Floating particles - reduced count for performance */}
          {[...Array(10)].map((_, i) => { // Reduced from 20 to 10
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 6 + 2;
            const x = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * 4;
            const z = Math.cos(angle) * radius;
            const scale = Math.random() * 0.2 + 0.02;
            
            return (
              <mesh 
                key={i} 
                position={[x, y, z]}
                scale={[scale, scale, scale]}
              >
                <sphereGeometry args={[1, 8, 8]} /> {/* Reduced segments */}
                <meshBasicMaterial 
                  color={i % 2 === 0 ? "#4F46E5" : "#8B5CF6"}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            );
          })}
        </group>
      </PresentationControls>
    </>
  );
};

const ProjectModel = ({ projects, onProjectSelect }) => {
  const canvasRef = useRef(null);
  const { isContextLost, recoveryAttempts } = useWebGLContextRecovery(canvasRef);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  
  // Detect if we should use low power mode based on recovery attempts
  useEffect(() => {
    if (recoveryAttempts > 1) {
      setIsLowPowerMode(true);
    }
  }, [recoveryAttempts]);
  
  return (
    <div className="w-full h-[700px]"> {/* Increased height for better immersion */}
      {isContextLost ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Optimizing 3D models for your device...
          </p>
        </div>
      ) : (
        <Canvas 
          ref={canvasRef}
          camera={{ position: [0, 2, 10], fov: 50 }}
          dpr={isLowPowerMode ? 1 : [1, 2]} // Reduce resolution in low power mode
          gl={{ 
            antialias: !isLowPowerMode, // Disable antialiasing in low power mode
            alpha: true,
            powerPreference: isLowPowerMode ? "low-power" : "high-performance",
            stencil: false, // Not needed for this scene
            depth: true
          }}
          performance={{ min: 0.5 }} // Allow frame rate to drop to maintain stability
        >
          <color attach="background" args={["rgba(0, 0, 0, 0)"]} />
          {isLowPowerMode ? null : <fog attach="fog" args={["#0f1729", 8, 15]} />} {/* Disable fog in low power mode */}
          
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} castShadow={!isLowPowerMode} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.3} />
          
          <Suspense fallback={
            <Html center>
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse mr-2"></div>
                <span>Loading models...</span>
              </div>
            </Html>
          }>
            <ProjectsScene projects={projects} onProjectSelect={onProjectSelect} />
            {isLowPowerMode ? null : <Environment preset="night" background={false} />}
            <ContactShadows 
              position={[0, -1.5, 0]} 
              opacity={isLowPowerMode ? 0.3 : 0.7} 
              scale={isLowPowerMode ? 10 : 15} 
              blur={isLowPowerMode ? 1 : 2.5} 
              far={5} 
              resolution={isLowPowerMode ? 128 : 256}
              color="#000000"
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

export default ProjectModel;