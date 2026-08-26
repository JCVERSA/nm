"use client";
import * as THREE from "three";
import { useRef, useState, useEffect, useMemo, memo } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { useFBO, Scroll, ScrollControls, MeshTransmissionMaterial, Text, Image, Preload } from "@react-three/drei";
import { easing } from "maath";

export default function FluidGlassLive({ mode = "lens", className = "" }: { mode?: "lens" | "cube" | "bar"; className?: string }) {
  const Wrapper = mode === "bar" ? BarLive : mode === "cube" ? CubeLive : LensLive;
  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true, antialias: false }} style={{ background: "transparent" }}>
        <ScrollControls damping={0.2} pages={3} distance={0.4}>
          <Wrapper />
          <Scroll html />
          <Preload />
        </ScrollControls>
      </Canvas>
    </div>
  );
}

/* ---------- Primitive geometries (no GLB) ---------- */
function LensLive({ modeProps = {} }: { modeProps?: any }) {
  const geo = useMemo(() => new THREE.CylinderGeometry(1.2, 1.2, 0.35, 64), []);
  return <ModeWrapperLive geometry={geo} geometryKey="Lens" followPointer modeProps={modeProps} />;
}
function CubeLive({ modeProps = {} }: { modeProps?: any }) {
  const geo = useMemo(() => new THREE.BoxGeometry(1.8, 1.8, 1.8), []);
  return <ModeWrapperLive geometry={geo} geometryKey="Cube" followPointer modeProps={modeProps} />;
}
function BarLive({ modeProps = {} }: { modeProps?: any }) {
  const geo = useMemo(() => new THREE.BoxGeometry(3.2, 0.5, 1), []);
  return <ModeWrapperLive geometry={geo} geometryKey="Bar" lockToBottom followPointer={false} modeProps={{ transmission: 1, roughness: 0, thickness: 10, ior: 1.15, color: "#ffffff", attenuationColor: "#ffffff", attenuationDistance: 0.25, ...modeProps }} />;
}

/* ---------- Core wrapper (FBO + MeshTransmissionMaterial) ---------- */
const ModeWrapperLive = memo(function ModeWrapperLive({
  geometry,
  geometryKey,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  ...props
}: {
  geometry: THREE.BufferGeometry;
  geometryKey: string;
  lockToBottom?: boolean;
  followPointer?: boolean;
  modeProps?: any;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  const geoWidthRef = useRef(1);

  useEffect(() => {
    geometry.computeBoundingBox();
    geoWidthRef.current = (geometry.boundingBox!.max.x - geometry.boundingBox!.min.x) || 1;
  }, [geometry]);

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (pointer.y * v.height) / 2 : 0;
    if (ref.current) easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

    if (modeProps.scale == null && ref.current) {
      const maxWorld = v.width * 0.9;
      const desired = maxWorld / geoWidthRef.current;
      ref.current.scale.setScalar(Math.min(0.15, desired));
    }

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.setClearColor(0x5227ff, 1);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps;

  return (
    <>
      {createPortal(<TypographyLive />, scene)}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>
      <mesh ref={ref} scale={scale ?? 0.15} rotation-x={Math.PI / 2} geometry={geometry} {...props}>
        <MeshTransmissionMaterial buffer={buffer.texture} ior={ior ?? 1.15} thickness={thickness ?? 5} anisotropy={anisotropy ?? 0.01} chromaticAberration={chromaticAberration ?? 0.1} {...extraMat} />
      </mesh>
    </>
  );
});

/* ---------- Typography / Images (self-contained) ---------- */
function TypographyLive() {
  return (
    <Text position={[0, 0, 12]} fontSize={0.5} letterSpacing={-0.05} outlineWidth={0} outlineBlur="20%" outlineColor="#000" outlineOpacity={0.5} color="white" anchorX="center" anchorY="middle">
      NebulaXnova
    </Text>
  );
}

/* Place inside App behind main content */
function ImagesLive() {
  // self-contained gradient planes instead of external webp
  return (
    <group>
      {[[-2, 0, 0], [2, 0, 3], [-2.05, -2, 6], [-0.6, -2, 9], [0.75, -2, 10.5]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} scale={[3, 2, 1]}>
          <planeGeometry />
          <meshBasicMaterial color={i % 2 === 0 ? "#8b5cf6" : "#4f46e5"} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export { ModeWrapperLive };
