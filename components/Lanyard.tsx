/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

interface LanyardProps {
    position?: number[];
    gravity?: number[];
    fov?: number;
    transparent?: boolean;
    cardFile?: string;
    textureFile?: string;
}

interface BandProps {
    maxSpeed?: number;
    minSpeed?: number;
    isMobile?: boolean;
    cardGLB: string;
    lanyardTexture: string;
    inView?: boolean;
}


export default function Lanyard({
    position = [0, 0, 30],
    gravity = [0, -40, 0],
    fov = 20,
    transparent = true,
    cardFile = 'card.glb',
    textureFile = 'lanyard.png'
}: LanyardProps) {
    // Preload assets to prevent pop-in
    useGLTF.preload(`/assets/lanyard/${cardFile}`);
    useTexture.preload(`/assets/lanyard/${textureFile}`);

    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
    const [inView, setInView] = useState(false); // Start false, let observer control
    const containerRef = useRef<HTMLDivElement>(null);

    // Build full paths from filenames
    const cardGLB = `/assets/lanyard/${cardFile}`;
    const lanyardTexture = `/assets/lanyard/${textureFile}`;

    const [ready, setReady] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        // Intersection Observer - render Canvas only when in view
        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
        };
    }, []);

    return (
        <div ref={containerRef} className="relative z-0 w-full h-full flex justify-center items-end md:items-center transform scale-100 origin-center">
            {/* Visual Placeholder (prevents pop-in) */}
            <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${ready ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                style={{ zIndex: 1 }}
            >
                <div className="w-[180px] h-[260px] md:w-[220px] md:h-[320px] bg-white/5 backdrop-blur-sm rounded-[15px] border border-white/10 flex items-center justify-center relative shadow-2xl">
                    <div className="absolute -top-24 left-1/2 w-1 h-24 bg-white/20 -translate-x-1/2"></div>
                    <div className="text-white/20 text-sm font-medium animate-pulse">Loading ID...</div>
                </div>
            </div>

            {inView && (
                <Canvas
                    camera={{ position: position as [number, number, number], fov: fov }}
                    dpr={[1, isMobile ? 1.5 : 2]}
                    gl={{ alpha: transparent, powerPreference: "high-performance" }}
                    onCreated={({ gl }) => {
                        gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
                        // Signal ready after a short delay to ensure first frame is rendered
                        setTimeout(() => setReady(true), 500);
                    }}
                    frameloop="always"
                >
                    <ambientLight intensity={Math.PI} />
                    <Physics gravity={gravity as [number, number, number]} timeStep={isMobile ? 1 / 30 : 1 / 60}>
                        <Band isMobile={isMobile} cardGLB={cardGLB} lanyardTexture={lanyardTexture} inView={inView} />
                    </Physics>
                    <Environment blur={0.75}>
                        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
                    </Environment>
                </Canvas>
            )}
        </div>
    );
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false, cardGLB, lanyardTexture, inView = true }: BandProps) {
    const band = useRef<THREE.Mesh>(null);
    const fixed = useRef<any>(null);
    const j1 = useRef<any>(null);
    const j2 = useRef<any>(null);
    const j3 = useRef<any>(null);
    const card = useRef<any>(null);

    const vec = new THREE.Vector3();
    const ang = new THREE.Vector3();
    const rot = new THREE.Vector3();
    const dir = new THREE.Vector3();

    const segmentProps = { type: 'dynamic' as const, canSleep: true, colliders: false as const, angularDamping: 4, linearDamping: 4 };
    const { nodes, materials } = useGLTF(cardGLB) as any;
    const texture = useTexture(lanyardTexture);
    const [curve] = useState(
        () =>
            new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
    );
    const [dragged, drag] = useState<THREE.Vector3 | boolean>(false);
    const [hovered, hover] = useState(false);

    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.3]);
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.3]);
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.3]);
    useSphericalJoint(j3, card, [
        [0, 0, 0],
        [0, 4.3, 0]
    ]);

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = dragged ? 'grabbing' : 'grab';
            return () => { document.body.style.cursor = 'auto'; };
        }
    }, [hovered, dragged]);

    useFrame((state, delta) => {
        if (dragged && typeof dragged !== 'boolean') {
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
            dir.copy(vec).sub(state.camera.position).normalize();
            vec.add(dir.multiplyScalar(state.camera.position.length()));
            [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
            // Remove clamp limits - allow unlimited drag in all directions
            card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
        }
        if (fixed.current) {
            [j1, j2].forEach(ref => {
                if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
                const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
                ref.current.lerped.lerp(
                    ref.current.translation(),
                    delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
                );
            });
            curve.points[0].copy(j3.current.translation());
            curve.points[1].copy(j2.current.lerped);
            curve.points[2].copy(j1.current.lerped);
            curve.points[3].copy(fixed.current.translation());

            if (band.current && (band.current.geometry as any).setPoints) {
                // @ts-ignore
                (band.current.geometry as any).setPoints(curve.getPoints(isMobile ? 16 : 32));
            }

            ang.copy(card.current.angvel());
            rot.copy(card.current.rotation());
            card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
        }
    });

    curve.curveType = 'chordal';
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    return (
        <>
            <group position={[0, 4, 0]}>
                <RigidBody ref={fixed} {...segmentProps} type="fixed" />
                <RigidBody position={[0.3, 0, 0]} ref={j1} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody position={[0.6, 0, 0]} ref={j2} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody position={[0.9, 0, 0]} ref={j3} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody position={[1.2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
                    <CuboidCollider args={[1.8, 2.53125, 0.01]} />
                    <group
                        scale={4.5}
                        position={[0, -1.2, -0.05]}
                        onPointerOver={() => hover(true)}
                        onPointerOut={() => hover(false)}
                        onPointerUp={(e: any) => {
                            e.target.releasePointerCapture(e.pointerId);
                            drag(false);
                        }}
                        onPointerDown={(e: any) => {
                            e.target.setPointerCapture(e.pointerId);
                            drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
                        }}
                    >
                        <mesh geometry={nodes.card.geometry}>
                            <meshPhysicalMaterial
                                map={materials.base.map}
                                map-anisotropy={16}
                                clearcoat={isMobile ? 0 : 1}
                                clearcoatRoughness={0.15}
                                roughness={0.9}
                                metalness={0.8}
                            />
                        </mesh>
                        <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
                        <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
                    </group>
                </RigidBody>
            </group>
            <mesh ref={band}>
                {/* @ts-ignore */}
                <meshLineGeometry />
                {/* @ts-ignore */}
                <meshLineMaterial
                    color="white"
                    depthTest={false}
                    resolution={isMobile ? [1000, 2000] : [1000, 1000]}
                    useMap
                    map={texture}
                    repeat={[-4, 1]}
                    lineWidth={2}
                />
            </mesh>
        </>
    );
}
