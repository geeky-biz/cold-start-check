import * as THREE from "three";

export function runThreeServerSide() {
  // Pure math / scene graph usage — SSR safe
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);

  // Do some real work so bundler + runtime can't optimize it away
  let sum = 0;
  const pos = geometry.attributes.position.array as Float32Array;

  for (let i = 0; i < pos.length; i++) {
    sum += pos[i];
  }

  return {
    vertexCount: geometry.attributes.position.count,
    checksum: Math.round(sum * 1_000),
  };
}