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

const dynY = sinW.mul(uVelocity).mul(1.48);
const dynZ = cosW.mul(uVelocity).mul(1.4);
const twistZ = localY.mul(sinW).mul(uVelocity).mul(0.25);
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

    const curvatureLight = float(2.0).add(cosW.mul(uVelocity).mul(0.014));
    const lightFactor = clamp(curvatureLight, 0.88, 1.15);

    const finalRgb = baseColor.rgb.mul(lightFactor);
    return vec4(finalRgb, baseColor.a);
};

export function createSliderMaterial(tex: THREE.Texture, planeAspect: number) {
    const mat = new THREE.MeshBasicNodeMaterial();
    mat.positionNode = reelPositionNode;
    mat.colorNode = createColorNode(tex, planeAspect);
    mat.side = THREE.DoubleSide;
    return mat;
}