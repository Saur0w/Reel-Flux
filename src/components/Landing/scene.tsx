"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three/webgpu";
import Mesh from "./mesh";

export default function Scene() {
    return (
        <Canvas
            // R3F 9 supports an async factory — no render() monkey-patching needed.
            // WebGPURenderer falls back to WebGL2 automatically when WebGPU is absent.
            gl={async (props) => {
                const renderer = new THREE.WebGPURenderer({
                    ...(props as THREE.WebGPURendererParameters),
                    antialias: true,
                    alpha: true,
                });
                await renderer.init();
                return renderer;
            }}
            flat // no tone-mapping on photos
            camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 100 }}
            dpr={[1, 2]}
        >
            <Mesh />
        </Canvas>
    );
}