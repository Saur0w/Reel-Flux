
import {
    sin,
    vec2,
    vec3,
    vec4,
    float,
    uv,
    texture,
    uniform,
    positionGeometry,
    positionLocal,
    modelWorldMatrix,
} from "three/tsl";
import * as THREE from "three/webgpu";

/** Shared velocity uniform — one value drives every plane. */
export const uVelocity = uniform(0);

const MAX_VELOCITY = 1.2;

/** Lenis velocity is px/frame — normalise, clamp, then ease the uniform. */
export const updateVelocityUniform = (lenisVelocity: number, alpha = 0.12) => {
    const target = THREE.MathUtils.clamp(lenisVelocity * 0.01, -MAX_VELOCITY, MAX_VELOCITY);
    uVelocity.value = THREE.MathUtils.lerp(uVelocity.value, target, alpha);
};

/**
 * Reel wave — same math as the old GLSL but in *world* X, so all planes
 * ride one continuous wave. Built once and shared by every material.
 */
const worldX = modelWorldMatrix.mul(vec4(positionGeometry, 1.0)).x;
const wave = sin(worldX.mul(0.9)).mul(uVelocity).mul(0.5);
export const reelPositionNode = positionLocal.add(vec3(float(0), wave, wave));

/**
 * `object-fit: cover` UVs. The scale is a uniform (not a constant) so all
 * 20 materials compile to ONE shader program and only swap bindings.
 */
export const createColorNode = (tex: THREE.Texture, planeAspect: number) => {
    const img = tex.image as { width: number; height: number };
    const imageAspect = img.width / img.height;

    const scale =
        imageAspect > planeAspect
            ? new THREE.Vector2(planeAspect / imageAspect, 1)
            : new THREE.Vector2(1, imageAspect / planeAspect);

    const coverUv = uv().sub(0.5).mul(uniform(scale)).add(0.5);
    return texture(tex, coverUv);
};

export function createSliderMaterial(tex: THREE.Texture, planeAspect: number) {
    const mat = new THREE.MeshBasicNodeMaterial();
    mat.positionNode = reelPositionNode;
    mat.colorNode = createColorNode(tex, planeAspect);
    return mat;
}