import {
    sin,
    vec3,
    float,
    uv,
    texture,
    positionLocal,
    positionWorld,
    uniform,
} from "three/tsl";
import * as THREE from "three/webgpu";

export const uVelocity = uniform(0);
export const createPositionNode = (velocityNode = uVelocity) => {
    const wave = sin(positionWorld.x.mul(0.9))
        .mul(velocityNode)
        .mul(0.006);

    const waveOffset = wave.mul(0.5);

    const offset = vec3(float(0), waveOffset, waveOffset);

    return positionLocal.add(offset);
};

export const createColorNode = (tex: THREE.Texture) => {
    return texture(tex, uv());
};

export function createSliderMaterial(tex: THREE.Texture) {
    const material = new THREE.MeshBasicNodeMaterial();
    material.positionNode = createPositionNode(uVelocity);
    material.colorNode = createColorNode(tex);
    return material;
}
