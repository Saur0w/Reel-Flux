import {
    sin,
    cos,
    clamp,
    vec3,
    vec4,
    float,
    uv,
    texture,
    uniform,
    positionGeometry,
    positionLocal,
    modelWorldMatrix,
    mix,
    dot,
} from "three/tsl";
import * as THREE from "three/webgpu";

export const uVelocity = uniform(0);

const MAX_VELOCITY = 1.6;

export const updateVelocityUniform = (lenisVelocity: number, alpha = 0.12) => {
    const target = THREE.MathUtils.clamp(lenisVelocity * 0.011, -MAX_VELOCITY, MAX_VELOCITY);
    uVelocity.value = THREE.MathUtils.lerp(uVelocity.value, target, alpha);
};

const worldPos = modelWorldMatrix.mul(vec4(positionGeometry, 1.0));
const worldX = worldPos.x;
const localY = positionGeometry.y;

const waveFreq = float(1.15);
const wavePhase = worldX.mul(waveFreq);
const sinW = sin(wavePhase);
const cosW = cos(wavePhase);

const dynY = sinW.mul(uVelocity).mul(0.48);
const dynZ = cosW.mul(uVelocity).mul(0.80);
const twistZ = localY.mul(sinW).mul(uVelocity).mul(0.35);
const dispX = sinW.mul(cosW).mul(uVelocity).mul(-0.05);

export const reelPositionNode = positionLocal.add(vec3(dispX, dynY, dynZ.add(twistZ)));

/**
 * Refined Minimal Editorial Tone:
 * - All images share the same uniform, cohesive color tone.
 * - Subtly desaturated (0.80) so colors are tasteful, minimal, and aesthetic rather than harsh/oversaturated.
 * - Gentle, airy lift on dark tones for an elegant photographic finish.
 */
export const createColorNode = (tex: THREE.Texture, planeAspect: number) => {
    const img = tex.image as { width: number; height: number };
    const imageAspect = (img && img.width && img.height) ? img.width / img.height : planeAspect;

    const scale =
        imageAspect > planeAspect
            ? new THREE.Vector2(planeAspect / imageAspect, 1)
            : new THREE.Vector2(1, imageAspect / planeAspect);

    const coverUv = uv().sub(0.5).mul(uniform(scale)).add(0.5);
    const baseColor = texture(tex, coverUv);

    // Standard Rec. 709 luminance
    const luma = dot(baseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
    const gray = vec3(luma);

    // Uniform aesthetic saturation: a touch less saturated than original across all images
    const sat = float(0.80);
    const satColor = mix(gray, baseColor.rgb, sat);

    // Minimal, light photographic tone mapping: soft lift on deep shadows, clean highlights
    const lift = float(0.018);
    const gain = float(1.02);
    const tonedRgb = satColor.mul(gain).add(vec3(lift));

    // Delicate 3D highlight on wave crests
    const curveHighlight = clamp(cosW.mul(uVelocity).mul(0.05), 0.0, 0.06);
    const finalRgb = tonedRgb.add(vec3(curveHighlight));

    return vec4(finalRgb, baseColor.a);
};

export function createSliderMaterial(tex: THREE.Texture, planeAspect: number) {
    const mat = new THREE.MeshBasicNodeMaterial();
    mat.positionNode = reelPositionNode;
    mat.colorNode = createColorNode(tex, planeAspect);
    mat.side = THREE.DoubleSide;
    return mat;
}