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
export const uWaveFreq = uniform(1.15);
export const uAmpY = uniform(0.48);
export const uAmpZ = uniform(0.80);
export const uTwistZ = uniform(0.35);

const MAX_VELOCITY = 1.6;

export function updateVelocityUniform(lenisVelocity: number, alpha = 0.12): void {
    const target = THREE.MathUtils.clamp(lenisVelocity * 0.011, -MAX_VELOCITY, MAX_VELOCITY);
    uVelocity.value = THREE.MathUtils.lerp(uVelocity.value, target, alpha);
}

export function updateWaveDimensions(stride: number, planeHeight: number): void {
    const wavelength = stride * 1.82;
    uWaveFreq.value = (Math.PI * 2) / wavelength;
    uAmpY.value = planeHeight * 0.8;
    uAmpZ.value = planeHeight * 0.8;
    uTwistZ.value = planeHeight * 0.20;
}

const worldPos = modelWorldMatrix.mul(vec4(positionGeometry, 1.0));
const worldX = worldPos.x;
const localY = positionGeometry.y;

const wavePhase = worldX.mul(uWaveFreq);
const sinW = sin(wavePhase);
const cosW = cos(wavePhase);

const dynY = sinW.mul(uVelocity).mul(uAmpY);
const dynZ = cosW.mul(uVelocity).mul(uAmpZ);
const twistZ = localY.mul(sinW).mul(uVelocity).mul(uTwistZ);
const dispX = sinW.mul(cosW).mul(uVelocity).mul(-0.05);

export const reelPositionNode = positionLocal.add(vec3(dispX, dynY, dynZ.add(twistZ)));

export const createColorNode = (tex: THREE.Texture, planeAspect: number) => {
    const img = tex.image as { width: number; height: number };
    const imageAspect = (img && img.width && img.height) ? img.width / img.height : planeAspect;

    const scale =
        imageAspect > planeAspect
            ? new THREE.Vector2(planeAspect / imageAspect, 1)
            : new THREE.Vector2(1, imageAspect / planeAspect);

    const coverUv = uv().sub(0.5).mul(uniform(scale)).add(0.5);
    const baseColor = texture(tex, coverUv);

    const luma = dot(baseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
    const gray = vec3(luma);

    const sat = float(0.80);
    const satColor = mix(gray, baseColor.rgb, sat);

    const lift = float(0.018);
    const gain = float(1.02);
    const tonedRgb = satColor.mul(gain).add(vec3(lift));

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