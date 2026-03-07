import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { CosmicObject } from '../../data/observatory';
import gsap from 'gsap';

interface ObservatorySceneProps {
    currentObj: CosmicObject;
    is360View: boolean;
}

// ==========================================
// INDIVIDUAL TREATMENTS
// ==========================================

function NebulaTreatment({ obj, is360View }: { obj: CosmicObject, is360View: boolean }) {
    const rawUrl = obj.imageUrl || '/cosmos/pillars of creation.jpg'; // fallback
    const textureUrl = rawUrl;
    const texture = useTexture(textureUrl);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;

    const groupRef = useRef<THREE.Group>(null);

    // Slow drift inside the nebula
    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = clock.getElapsedTime() * 0.02;
            groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Front hemisphere — nebula image */}
            <mesh>
                <sphereGeometry args={[500, 64, 32, 0, Math.PI * 2, 0, is360View ? Math.PI : Math.PI / 2]} />
                <meshBasicMaterial map={texture} side={THREE.BackSide} />
            </mesh>

            {/* Back hemisphere — deep space fill (hidden if 360) */}
            {!is360View && (
                <mesh rotation={[Math.PI, 0, 0]}>
                    <sphereGeometry args={[490, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshBasicMaterial color="#000005" side={THREE.BackSide} />
                </mesh>
            )}

            {/* Minimal dust particles */}
            <Stars radius={50} depth={200} count={1500} factor={4} saturation={0} fade speed={0.5} />
        </group>
    );
}

function GalaxyTreatment({ obj }: { obj: CosmicObject }) {
    const particlesRef = useRef<THREE.Points>(null);
    const count = 20000;

    // Procedural spiral construction
    const [positions, colors] = React.useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const colorBase = new THREE.Color(obj.glowColor || '#4A6FA5');
        const colorCore = new THREE.Color('#ffffff');

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const r = Math.random() * 80; // Radius
            const branchAngle = (i % 2) * Math.PI; // Two main arms
            const spinAngle = r * 0.1; // Spiral tightness

            // Random scatter
            const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 2;
            const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 2;
            const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 2;

            pos[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
            pos[i3 + 1] = randomY * (20 / (r + 1)); // Flattening out the disk
            pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

            // Color mix based on distance
            const mixedColor = colorCore.clone().lerp(colorBase, r / 80);
            col[i3] = mixedColor.r;
            col[i3 + 1] = mixedColor.g;
            col[i3 + 2] = mixedColor.b;
        }
        return [pos, col];
    }, [obj.glowColor]);

    useFrame(() => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y += 0.0003;
        }
    });

    return (
        <group rotation={[Math.PI / 6, 0, 0]}>
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
                    <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial size={0.15} vertexColors transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
            </points>
            <ambientLight intensity={0.5} />
        </group>
    );
}

function BlackHoleTreatment({ obj }: { obj: CosmicObject }) {
    const diskRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (diskRef.current) {
            diskRef.current.rotation.z = clock.getElapsedTime() * -0.2;
        }
    });

    return (
        <group rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            {/* The Black Hole */}
            <mesh>
                <sphereGeometry args={[10, 64, 64]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* Inner hot ring — brighter, tighter */}
            <mesh ref={diskRef} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[11, 16, 128]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.6}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Outer cooler ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[16, 28, 128]} />
                <meshBasicMaterial
                    color={obj.glowColor || '#FF6B35'}
                    transparent
                    opacity={0.25}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            <mesh>
                <sphereGeometry args={[28, 64, 64]} />
                <shaderMaterial
                    vertexShader={`
                        varying vec3 vNormal;
                        varying vec3 vPosition;
                        void main() {
                            vNormal = normalize(normalMatrix * normal);
                            vPosition = position;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `}
                    fragmentShader={`
                        varying vec3 vNormal;
                        uniform vec3 uGlowColor;
                        void main() {
                            float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
                            gl_FragColor = vec4(uGlowColor, intensity * 0.4);
                        }
                    `}
                    uniforms={{
                        uGlowColor: { value: new THREE.Color(obj.glowColor || '#FF6B35') }
                    }}
                    transparent
                    side={THREE.FrontSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* Also add proper star field behind so lensing is visible */}
            <Stars radius={80} depth={150} count={4000} factor={5} saturation={0} fade speed={0.5} />
        </group>
    );
}

function SupernovaTreatment({ obj }: { obj: CosmicObject }) {
    const rawUrl = obj.imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/0/00/Crab_Nebula.jpg';
    const textureUrl = rawUrl;
    const texture = useTexture(textureUrl);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;

    const layer1 = useRef<THREE.Mesh>(null);
    const layer2 = useRef<THREE.Mesh>(null);
    const layer3 = useRef<THREE.Mesh>(null);

    useFrame(({ mouse }) => {
        // Parallax effect based on mouse
        if (layer1.current) layer1.current.position.set(mouse.x * 5, mouse.y * 5, -200);
        if (layer2.current) layer2.current.position.set(mouse.x * 15, mouse.y * 15, -100);
        if (layer3.current) layer3.current.position.set(mouse.x * 25, mouse.y * 25, -50);
    });

    return (
        <group>
            {/* Back layer — full image, normal blending */}
            <mesh ref={layer1} position={[0, 0, -200]}>
                <planeGeometry args={[380, 380]} />
                <meshBasicMaterial map={texture} transparent opacity={0.5} />
            </mesh>

            {/* Mid layer — normal blending */}
            <mesh ref={layer2} position={[0, 0, -100]}>
                <planeGeometry args={[240, 240]} />
                <meshBasicMaterial map={texture} transparent opacity={0.75} />
            </mesh>

            {/* Front layer — full opacity, this is the main image */}
            <mesh ref={layer3} position={[0, 0, -50]}>
                <planeGeometry args={[140, 140]} />
                <meshBasicMaterial map={texture} transparent opacity={1.0} />
            </mesh>

            {/* Additive glow on top — separate subtle layer */}
            <mesh position={[0, 0, -45]}>
                <planeGeometry args={[160, 160]} />
                <meshBasicMaterial
                    map={texture}
                    transparent
                    opacity={0.15}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
}

function StarClusterTreatment({ obj }: { obj: CosmicObject }) {
    const particlesRef = useRef<THREE.Points>(null);
    const count = 15000;

    const [positions, colors, sizes] = React.useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const siz = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Spherical distribution concentrated at center
            const radius = Math.pow(Math.random(), 2) * 60; // squared = more stars near center
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
            pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            pos[i3 + 2] = radius * Math.cos(phi);

            // Color: blue-white for young/hot stars, orange-yellow for older ones
            const starType = Math.random();
            if (starType < 0.3) {
                // Blue-white young stars
                col[i3] = 0.7 + Math.random() * 0.3;
                col[i3 + 1] = 0.8 + Math.random() * 0.2;
                col[i3 + 2] = 1.0;
            } else if (starType < 0.7) {
                // White stars
                col[i3] = 1.0;
                col[i3 + 1] = 1.0;
                col[i3 + 2] = 0.9 + Math.random() * 0.1;
            } else {
                // Orange-yellow older stars
                col[i3] = 1.0;
                col[i3 + 1] = 0.6 + Math.random() * 0.3;
                col[i3 + 2] = 0.2 + Math.random() * 0.2;
            }

            // Vary star sizes — brighter stars slightly larger
            siz[i] = Math.random() < 0.02 ? 0.8 : 0.2 + Math.random() * 0.3;
        }

        return [pos, col, siz];
    }, []);

    useFrame(() => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y += 0.0002;
            particlesRef.current.rotation.x += 0.0001;
        }
    });

    return (
        <group>
            {/* The cluster itself */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
                    <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
                    <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
                </bufferGeometry>
                <pointsMaterial
                    size={0.3}
                    vertexColors
                    transparent
                    opacity={0.9}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    sizeAttenuation
                />
            </points>

            {/* Sparse background stars to give depth context */}
            <Stars radius={200} depth={300} count={1000} factor={2} saturation={0} fade speed={0.2} />

            {/* Subtle core glow */}
            <pointLight position={[0, 0, 0]} intensity={0.5} color="#fff8e0" distance={80} />
        </group>
    );
}

function AuroraTreatment({ obj }: { obj: CosmicObject }) {
    const rawUrl = obj.imageUrl || '';
    const textureUrl = rawUrl;
    const texture = textureUrl ? useTexture(textureUrl) : null;
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    if (texture) {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
    }

    const vertexShader = `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
            vUv = uv;
            vec3 pos = position;
            // Gentle wave distortion on the mesh itself
            pos.x += sin(pos.y * 0.05 + uTime * 0.3) * 3.0;
            pos.y += cos(pos.x * 0.03 + uTime * 0.2) * 2.0;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const fragmentShader = `
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform float uTime;
        void main() {
            // Subtle UV distortion for ripple effect
            vec2 distortedUv = vUv;
            distortedUv.x += sin(vUv.y * 8.0 + uTime * 0.4) * 0.005;
            distortedUv.y += cos(vUv.x * 6.0 + uTime * 0.3) * 0.003;
            vec4 color = texture2D(uTexture, distortedUv);
            gl_FragColor = color;
        }
    `;

    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
        }
    });

    return (
        <group>
            <mesh ref={meshRef} position={[0, 0, -80]}>
                <planeGeometry args={[400, 300, 32, 32]} />
                {texture ? (
                    <shaderMaterial
                        ref={materialRef}
                        vertexShader={vertexShader}
                        fragmentShader={fragmentShader}
                        uniforms={{
                            uTexture: { value: texture },
                            uTime: { value: 0 }
                        }}
                    />
                ) : (
                    <meshBasicMaterial color={obj.glowColor || '#00d4d8'} />
                )}
            </mesh>
            <Stars radius={100} depth={200} count={2000} factor={3} saturation={0} fade speed={0.3} />
        </group>
    );
}

function PulsarTreatment({ obj }: { obj: CosmicObject }) {
    const starRef = useRef<THREE.Mesh>(null);
    const beam1Ref = useRef<THREE.Mesh>(null);
    const beam2Ref = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime() * 5; // Fast rotation
        if (starRef.current) starRef.current.rotation.y = time;
        if (beam1Ref.current) beam1Ref.current.rotation.y = time;
        if (beam2Ref.current) beam2Ref.current.rotation.y = time;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            {/* Neutron Star */}
            <mesh ref={starRef}>
                <sphereGeometry args={[2, 32, 32]} />
                <meshStandardMaterial emissive="#ffffff" emissiveIntensity={2} color="#ffffff" />
            </mesh>

            {/* Beam 1 */}
            <mesh ref={beam1Ref} position={[0, 40, 0]}>
                <cylinderGeometry args={[0.1, 15, 80, 32, 1, true]} />
                <meshBasicMaterial color={obj.glowColor || "#00d4d8"} transparent opacity={0.3} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
            </mesh>

            {/* Beam 2 */}
            <mesh ref={beam2Ref} position={[0, -40, 0]} rotation={[Math.PI, 0, 0]}>
                <cylinderGeometry args={[0.1, 15, 80, 32, 1, true]} />
                <meshBasicMaterial color={obj.glowColor || "#00d4d8"} transparent opacity={0.3} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
            </mesh>

            <pointLight distance={100} intensity={2} color={obj.glowColor || "#00d4d8"} />
            <Stars radius={50} depth={200} count={2000} factor={4} saturation={0} fade speed={1} />
        </group>
    );
}

// ==========================================
// MAIN COMPONENT EXPORT
// ==========================================

export default function ObservatoryScene({ currentObj, is360View }: ObservatorySceneProps) {
    // Dynamic component rendering based on category
    const renderTreatment = () => {
        switch (currentObj.category) {
            case 'nebula': return <NebulaTreatment obj={currentObj} is360View={is360View} />;
            case 'galaxy': return <GalaxyTreatment obj={currentObj} />;
            case 'blackhole': return <BlackHoleTreatment obj={currentObj} />;
            case 'supernova': return <SupernovaTreatment obj={currentObj} />;
            case 'cluster': return <StarClusterTreatment obj={currentObj} />;
            case 'aurora': return <AuroraTreatment obj={currentObj} />;
            case 'pulsar': return <PulsarTreatment obj={currentObj} />;
            case 'test': return <NebulaTreatment obj={currentObj} is360View={is360View} />;
            default: return <NebulaTreatment obj={currentObj} is360View={is360View} />; // Fallback to skybox
        }
    };

    return (
        <Canvas camera={{ position: [0, 0, 50], fov: 60 }} gl={{ antialias: true, alpha: false }}>
            <color attach="background" args={['#000000']} />

            <Suspense fallback={null}>
                {renderTreatment()}
            </Suspense>

            <OrbitControls
                enablePan={false}
                enableZoom={false}
                rotateSpeed={0.3}
                autoRotate={currentObj.category === 'galaxy' || currentObj.category === 'cluster'}
                autoRotateSpeed={0.5}
                minAzimuthAngle={is360View ? -Infinity : -Math.PI / 2}
                maxAzimuthAngle={is360View ? Infinity : Math.PI / 2}
                minPolarAngle={is360View ? 0 : Math.PI / 4}
                maxPolarAngle={is360View ? Math.PI : Math.PI * 0.75}
            />
        </Canvas>
    );
}
