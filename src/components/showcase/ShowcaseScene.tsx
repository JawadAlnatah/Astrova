import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface ShowcaseSceneProps {
    currentPlanet: any;
    prevPlanet?: any;
    leftPlanet: any;
    rightPlanet: any;
    isScrolled?: boolean;
    onReady?: () => void;
}

const PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// ── Saturn rings ──────────────────────────────────────────────────────────────
function SaturnRings({ ringTextureUrl, planetRadius }: { ringTextureUrl: string; planetRadius: number }) {
    const ringRef = useRef<THREE.Mesh>(null);
    const [ringTex] = useTexture([ringTextureUrl]);

    // Fix Three.js RingGeometry UV so the horizontal strip texture
    // maps correctly from inner to outer edge
    const ringGeo = useMemo(() => {
        const inner = planetRadius * 1.25;
        const outer = planetRadius * 2.3;
        const geo = new THREE.RingGeometry(inner, outer, 128, 8);

        const pos = geo.attributes.position as THREE.BufferAttribute;
        const uv = geo.attributes.uv as THREE.BufferAttribute;
        const v3 = new THREE.Vector3();

        for (let i = 0; i < pos.count; i++) {
            v3.fromBufferAttribute(pos, i);
            const len = v3.length();
            const u = (len - inner) / (outer - inner); // 0 = inner edge, 1 = outer
            uv.setXY(i, u, 0.5);
        }
        uv.needsUpdate = true;
        return geo;
    }, [planetRadius]);

    ringTex.colorSpace = THREE.SRGBColorSpace;

    // Rings tilt — match Saturn's axial tilt ~27°
    return (
        <mesh ref={ringRef} geometry={ringGeo} rotation={[Math.PI * 0.42, 0.1, 0.05]}>
            <meshBasicMaterial
                color="#c8a96e"
                alphaMap={ringTex}
                transparent
                opacity={1}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.NormalBlending}
            />
        </mesh>
    );
}

// ── Planet sphere ─────────────────────────────────────────────────────────────
function PlanetSphere({
    textureUrl,
    cloudsUrl,
    ringTextureUrl,
    radius,
    position,
    isHero,
    opacityMultiplier,
}: {
    textureUrl: string;
    cloudsUrl?: string;
    ringTextureUrl?: string;
    radius: number;
    position: [number, number, number];
    isHero: boolean;
    opacityMultiplier?: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);
    const { gl } = useThree();
    const maxAniso = gl.capabilities.getMaxAnisotropy();

    const textures = useTexture([textureUrl, cloudsUrl || PLACEHOLDER]);
    const texture = textures[0];
    const cloudsTexture = (isHero && cloudsUrl) ? textures[1] : null;

    // Max anisotropy + default mipmap filter = sharpest possible textures
    // Wrapped in useMemo to prevent re-uploading the texture to the GPU on every render
    useMemo(() => {
        if (texture.colorSpace !== THREE.SRGBColorSpace || texture.anisotropy !== maxAniso) {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = maxAniso;
            texture.needsUpdate = true;
        }
        if (cloudsTexture) {
            if (cloudsTexture.colorSpace !== THREE.SRGBColorSpace || cloudsTexture.anisotropy !== maxAniso) {
                cloudsTexture.colorSpace = THREE.SRGBColorSpace;
                cloudsTexture.anisotropy = maxAniso;
                cloudsTexture.needsUpdate = true;
            }
        }
    }, [texture, cloudsTexture, maxAniso]);

    useFrame(() => {
        if (meshRef.current) meshRef.current.rotation.y += isHero ? 0.0025 : 0.004;
        if (cloudsRef.current) cloudsRef.current.rotation.y += 0.003;
    });

    return (
        <group position={position}>
            {/* Planet surface */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[radius, isHero ? 128 : 64, isHero ? 128 : 64]} />
                <meshStandardMaterial
                    map={texture}
                    roughness={0.75}
                    metalness={0.05}
                    transparent={opacityMultiplier !== undefined}
                    opacity={opacityMultiplier ?? 1}
                />
            </mesh>

            {/* Cloud layer — hero Earth only */}
            {cloudsTexture && (
                <mesh ref={cloudsRef}>
                    <sphereGeometry args={[radius * 1.008, 128, 128]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        alphaMap={cloudsTexture}
                        transparent
                        opacity={0.9 * (opacityMultiplier ?? 1)}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            )}

            {/* Saturn rings — shown at any scale */}
            {ringTextureUrl && (
                <SaturnRings ringTextureUrl={ringTextureUrl} planetRadius={radius} />
            )}
        </group>
    );
}

// ── Animated hero planet — position and scale lerp driven by scroll ───────────
function HeroPlanet({
    planet,
    targetY,
    targetX,
    targetScale,
    opacity = 1,
}: {
    planet: any;
    targetY: number;
    targetX: number;
    targetScale: number;
    opacity?: number;
}) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (groupRef.current) {
            // Smooth lerp toward target position and scale
            groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.06;
            groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.06;
            groupRef.current.scale.setScalar(
                groupRef.current.scale.x + (targetScale - groupRef.current.scale.x) * 0.06
            );
        }
    });

    return (
        <group ref={groupRef} position={[0, -22, 0]} scale={1}>
            <PlanetSphere
                key={`hero-${planet.id}`}
                textureUrl={planet.textureUrl}
                cloudsUrl={planet.cloudsUrl}
                ringTextureUrl={planet.ringTextureUrl}
                radius={22}
                position={[0, 0, 0]}
                isHero={true}
                opacityMultiplier={opacity}
            />
        </group>
    );
}

// ── Scene root ────────────────────────────────────────────────────────────────

export function StaticEnvironment() {
    return (
        <>
            <ambientLight intensity={0.08} color="#c8d8ff" />
            <directionalLight position={[-12, 6, 10]} color="#fff5e0" intensity={3.5} castShadow={false} />
            <directionalLight position={[10, -4, -8]} color="#1a3a6a" intensity={0.4} />
            <Stars radius={200} depth={60} count={7000} factor={4} saturation={0} fade speed={0.5} />
        </>
    );
}

export default function ShowcaseScene({
    currentPlanet,
    prevPlanet,
    leftPlanet,
    rightPlanet,
    isScrolled = false,
    onReady
}: ShowcaseSceneProps) {
    // Hero Planet calculations
    // Starts at Y=-22, X=0, Scale=1 (initial peek)
    // Ends at Y=+2, X=+13, Scale=0.5 (fully visible right side)
    const heroTargetY = isScrolled ? 0 : -22;
    const heroTargetX = isScrolled ? 14 : 0;
    const heroTargetScale = isScrolled ? 0.65 : 1;

    // Side Planets calculations
    // Start at Y=-2, move UP entirely out of screen by ending at Y=+30
    const sidePlanetY = isScrolled ? 30 : -2;

    const [transitionProgress, setTransitionProgress] = React.useState(1);

    // Notify parent that the components successfully mounted past suspense
    React.useEffect(() => {
        if (onReady) onReady();
        if (prevPlanet && prevPlanet.id !== currentPlanet.id) {
            setTransitionProgress(0); // Start fade
        }
    }, [currentPlanet.id, prevPlanet, onReady]);

    useFrame(() => {
        if (transitionProgress < 1) {
            setTransitionProgress(p => Math.min(1, p + 0.05));
        }
    });

    return (
        <>
            {/* Hero planet — scroll-driven animations */}
            {prevPlanet && prevPlanet.id !== currentPlanet.id && (
                <HeroPlanet
                    planet={prevPlanet}
                    targetY={heroTargetY}
                    targetX={heroTargetX}
                    targetScale={heroTargetScale}
                    opacity={1 - transitionProgress}
                />
            )}
            <HeroPlanet
                planet={currentPlanet}
                targetY={heroTargetY}
                targetX={heroTargetX}
                targetScale={heroTargetScale}
                opacity={transitionProgress}
            />

            {/* Left side planet — animates up out of screen */}
            <group position={[-34, sidePlanetY, -8]}>
                <PlanetSphere
                    key={`left-${leftPlanet.id}`}
                    textureUrl={leftPlanet.textureUrl}
                    ringTextureUrl={leftPlanet.ringTextureUrl}
                    radius={5}
                    position={[0, 0, 0]}
                    isHero={false}
                />
            </group>

            {/* Right side planet — animates up out of screen */}
            <group position={[34, sidePlanetY, -8]}>
                <PlanetSphere
                    key={`right-${rightPlanet.id}`}
                    textureUrl={rightPlanet.textureUrl}
                    ringTextureUrl={rightPlanet.ringTextureUrl}
                    radius={5}
                    position={[0, 0, 0]}
                    isHero={false}
                />
            </group>
        </>
    );
}

// ─── GPU Idle Preloader ───────────────────────────────────────────────────────
// Silently fetches and uploads adjacent planets to GPU VRAM 1.2s after animations finish
export function IdlePreloader({ planet }: { planet: any }) {
    const { gl } = useThree();
    const maxAniso = gl.capabilities.getMaxAnisotropy();

    const textures = useTexture([planet.textureUrl, planet.cloudsUrl || PLACEHOLDER]);
    const ringTex = useTexture([planet.ringTextureUrl || PLACEHOLDER]);

    React.useEffect(() => {
        const t = setTimeout(() => {
            try {
                textures.forEach(tex => {
                    tex.anisotropy = maxAniso;
                    gl.initTexture(tex);
                });
                if (planet.ringTextureUrl) {
                    ringTex[0].anisotropy = maxAniso;
                    gl.initTexture(ringTex[0]);
                }
            } catch (e) { }
        }, 1200);
        return () => clearTimeout(t);
    }, [textures, ringTex, gl, maxAniso, planet.ringTextureUrl]);

    return null;
}
