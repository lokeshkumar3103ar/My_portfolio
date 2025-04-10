import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { trackEvent } from './analytics';

/**
 * Custom hook for handling WebGL context loss and recovery
 * This reduces memory usage and prevents crashes by proactively 
 * managing Three.js resources and handling WebGL context events
 */
export const useWebGLContextRecovery = (canvasRef) => {
  const [isContextLost, setIsContextLost] = useState(false);
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  
  // Initialize context event listeners
  useEffect(() => {
    if (!canvasRef?.current) return;
    
    const canvas = canvasRef.current;
    
    // Handle context lost event
    const handleContextLost = (event) => {
      event.preventDefault(); // This allows recovery
      setIsContextLost(true);
      console.warn('WebGL context lost. Attempting recovery...');
      trackEvent('Error', 'webgl_context_lost', 'recovery_attempt', recoveryAttempts + 1);
      
      // Clean up resources to help recovery
      if (rendererRef.current) {
        rendererRef.current.forceContextLoss();
        rendererRef.current.dispose();
      }
      
      // Clear the scene to free memory
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
      
      setRecoveryAttempts(prev => prev + 1);
    };
    
    // Handle context restored event
    const handleContextRestored = () => {
      setIsContextLost(false);
      console.log('WebGL context restored successfully');
      trackEvent('Performance', 'webgl_context_restored', 'attempts', recoveryAttempts);
    };
    
    // Add event listeners to the canvas
    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
    
    // Clean up event listeners when component unmounts
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [canvasRef, recoveryAttempts]);
  
  // Memory management function to be called in animation loops
  const manageMemory = (renderer, scene, camera) => {
    if (!renderer || !scene) return;
    
    // Store references for cleanup during context loss
    rendererRef.current = renderer;
    sceneRef.current = scene;
    
    // Optimize renderer settings to reduce memory usage
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    
    // Reset the WebGL state on each frame to prevent memory buildup
    renderer.resetState();
    
    // For complex scenes, selectively render only what's visible
    if (recoveryAttempts > 1 && camera) {
      const frustum = new THREE.Frustum();
      frustum.setFromProjectionMatrix(
        new THREE.Matrix4().multiplyMatrices(
          camera.projectionMatrix,
          camera.matrixWorldInverse
        )
      );
      
      scene.traverse((object) => {
        if (object.isMesh && object.geometry) {
          // Only update visible objects
          object.frustumCulled = true;
          
          // For objects that moved outside view, dispose textures temporarily
          if (!frustum.intersectsObject(object) && object.material.map) {
            object.visible = false;
          } else {
            object.visible = true;
          }
        }
      });
    }
  };
  
  // Attempts to restore context by recreating the renderer
  const attemptContextRecovery = (canvas) => {
    if (!canvas || !isContextLost) return null;
    
    try {
      // Create new renderer with optimized parameters
      const newRenderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false, // Disable antialiasing for performance
        powerPreference: 'low-power',
        failIfMajorPerformanceCaveat: true,
        depth: true,
        stencil: false
      });
      
      // Apply conservative settings
      newRenderer.setPixelRatio(1);
      newRenderer.shadowMap.enabled = false;
      
      return newRenderer;
    } catch (error) {
      console.error('Failed to restore WebGL context:', error);
      trackEvent('Error', 'webgl_recovery_failed', 'error', error.message);
      return null;
    }
  };
  
  return {
    isContextLost,
    recoveryAttempts,
    manageMemory,
    attemptContextRecovery
  };
};