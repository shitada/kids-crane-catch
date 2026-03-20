import * as THREE from 'three';

export function createManta(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0x334466 });
  const bellyMat = new THREE.MeshPhongMaterial({ color: 0xdddddd });

  // ボディ
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.4), mat);
  body.position.y = 0.35; g.add(body);

  // 翼（大きなヒレ）
  for (const z of [0.45, -0.45]) {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.5), mat);
    wing.position.set(0, 0.35, z); wing.rotation.x = z > 0 ? -0.12 : 0.12; g.add(wing);
  }

  // 白いお腹
  const belly = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.04, 0.35), bellyMat);
  belly.position.set(0, 0.3, 0); g.add(belly);

  // 頭のヒレ
  for (const z of [0.12, -0.12]) {
    const ceph = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.06), mat);
    ceph.position.set(0.35, 0.35, z); g.add(ceph);
  }

  // 尾
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.01, 0.7, 6), mat);
  tail.rotation.z = Math.PI / 2; tail.position.set(-0.6, 0.35, 0); g.add(tail);

  // エラ模様
  for (const z of [0.1, -0.1]) {
    const gill = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.01, 0.03), bellyMat);
    gill.position.set(0.05, 0.29, z); g.add(gill);
  }

  // 目
  for (const z of [0.18, -0.18]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), new THREE.MeshPhongMaterial({ color: 0x111111 }));
    eye.position.set(0.25, 0.4, z); g.add(eye);
  }

  g.scale.setScalar(0.5);
  return g;
}
