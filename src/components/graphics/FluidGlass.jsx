import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, RoundedBox, MeshTransmissionMaterial } from '@react-three/drei';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(!!mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return isMobile;
}

function FloatingGlassBar({
  barProps = {},
  materialProps = {},
  floatProps = {},
  floatEnabled = true,
}) {
  const group = useRef();
  const { viewport, camera } = useThree();
  const timeRef = useRef(0);

  // Defaults
  const autoWidth = Math.max(1, viewport.width * 0.96);
  const autoHeight = Math.max(0.25, Math.min(0.9, viewport.height * 0.8));
  const {
    width = autoWidth,
    height = autoHeight,
    depth = 0.35,
    radius = Math.min(autoHeight / 2, 0.4),
    smoothness = 10,
    yOffset = 0,
  } = barProps;

  const {
    amplitudeX = 0.25,
    amplitudeY = 0.4,
    speed = 0.35,
    rotationAmp = 0.06,
  } = floatProps;

  // Camera setup for container mode: keep neutral perspective
  useEffect(() => {
    camera.position.set(0, 0, 8);
    camera.near = 0.1;
    camera.far = 100;
    camera.updateProjectionMatrix();
  }, [camera]);

  // Gentle float animation
  useFrame((_, delta) => {
    if (!group.current) return;
    if (!floatEnabled || speed === 0) {
      group.current.position.set(0, yOffset, 0);
      group.current.rotation.set(0, 0, 0);
      return;
    }
    timeRef.current += delta * speed;
    const t = timeRef.current;
    group.current.position.x = Math.sin(t * 0.7) * amplitudeX;
    group.current.position.y = yOffset + Math.sin(t) * amplitudeY;
    group.current.rotation.y = Math.sin(t * 0.4) * rotationAmp;
    group.current.rotation.x = Math.cos(t * 0.25) * (rotationAmp * 0.65);
  });

  const transmissionProps = useMemo(
    () => ({
      samples: 10,
      resolution: 256,
  transmission: 1,
  roughness: 0.01,
  thickness: 1.0,
  chromaticAberration: 0.003,
  anisotropy: 0.005,
  ior: 1.12,
  distortion: 0.0,
  distortionScale: 0.0,
  temporalDistortion: 0.0,
  attenuationColor: '#ffffff',
  attenuationDistance: 500,
      clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  envMapIntensity: 0.25,
      ...materialProps,
    }),
    [materialProps]
  );

  return (
    <group ref={group}>
      <RoundedBox args={[width, height, depth]} radius={radius} smoothness={smoothness}>
        <MeshTransmissionMaterial {...transmissionProps} />
      </RoundedBox>
    </group>
  );
}

export default function FluidGlass({
  mode = 'bar',
  lensProps,
  barProps,
  cubeProps,
  materialProps,
  floatProps,
  floatEnabled = true,
  className,
  style,
  fullScreen = true,
}) {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // Mobile fallback: do not render 3D to save battery. Header will display glassmorphism CSS.
  if (isMobile || reducedMotion) return null;

  const containerStyle = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }
    : {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      };

  return (
    <div className={className} style={{ ...containerStyle, ...style }} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        orthographic={!fullScreen}
        camera={fullScreen ? { fov: 45, position: [0, 0, 8] } : { position: [0, 0, 10], zoom: 80 }}
      >
        {/* Lighting & environment reflections */}
        <Environment preset="city" />

        {/* The bar mode (default) */}
  <FloatingGlassBar barProps={barProps} materialProps={materialProps} floatProps={floatProps} floatEnabled={floatEnabled} />
      </Canvas>
    </div>
  );
}
