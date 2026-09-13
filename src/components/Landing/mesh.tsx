"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { images, imagePaths } from "@/lib/data";
import { scrollState } from "@/hooks/useScroll";
import { updateVelocityUniform, createSliderMaterial } from "@/lib/Shader";

useTexture.preload(imagePaths);

const PLANE_ASPECT = 5 / 3;
const GAP_RATIO = 0.015; // Clean, elegant gap between cards

function Meshes() {
    const textures = useTexture(imagePaths) as THREE.Texture[];
    const viewport = useThree((s) => s.viewport);

    // Responsive sizing: card height = 40% of visible viewport height
    const planeHeight = viewport.height * 0.35;
    const planeWidth = planeHeight * PLANE_ASPECT;
    const stride = planeWidth * (1 + GAP_RATIO);
    const total = textures.length;
    const totalWidth = total * stride;
    const half = totalWidth / 2;

    // 64 segments along X for smooth wave curvature, 16 in Y for smooth 3D torsion
    const geometry = useMemo(
        () => new THREE.PlaneGeometry(planeWidth, planeHeight, 64, 16),
        [planeWidth, planeHeight]
    );
    useEffect(() => () => geometry.dispose(), [geometry]);

    // One material per texture (all share a single compiled shader)
    const materials = useMemo(() => {
        textures.forEach((t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            t.needsUpdate = true;
        });
        return textures.map((t) => createSliderMaterial(t, PLANE_ASPECT));
    }, [textures]);
    useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

    const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

    useFrame(() => {
        updateVelocityUniform(scrollState.velocity);

        // Lenis progress (0→1, wrapping) maps to exactly one lap of the reel
        const scrollX = scrollState.progress * totalWidth;

        for (let i = 0; i < total; i++) {
            const mesh = meshRefs.current[i];
            if (!mesh) continue;
            const offset = (i - total / 2) * stride - scrollX;
            mesh.position.x = ((((offset + half) % totalWidth) + totalWidth) % totalWidth) - half;
        }
    });

    return (
        <group>
            {materials.map((material, i) => (
                <mesh
                    key={images[i]?.id ?? i}
                    ref={(el) => { meshRefs.current[i] = el; }}
                    geometry={geometry}
                    material={material}
                />
            ))}
        </group>
    );
}

export default function Mesh() {
    return (
        <Suspense fallback={null}>
            <Meshes />
        </Suspense>
    );
}