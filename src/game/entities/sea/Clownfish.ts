import * as THREE from 'three';

export function createClownfish(): THREE.Group {
  const g = new THREE.Group();
  const orange = new THREE.MeshPhongMaterial({ color: 0xff6622 });
  const white = new THREE.MeshPhongMaterial({ color: 0xffffff });

  // ボディ（大きめ）
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 10), orange);
  body.scale.set(1.6, 1.0, 0.7); body.position.y = 0.35; g.add(body);

  // 白い縞模様3本
  for (const x of [-0.15, 0.1, 0.35]) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.7, 0.55), white);
    stripe.position.set(x, 0.35, 0); g.add(stripe);
  }

  // 尾びれ
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.25, 6), orange);
  tail.rotation.z = Math.PI / 2; tail.position.set(-0.6, 0.35, 0); g.add(tail);

  // 背びれ
  const dorsal = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.03), orange);
  dorsal.position.set(0, 0.7, 0); g.add(dorsal);

  // 胸びれ
  for (const z of [0.25, -0.25]) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, 0.03), orange);
    fin.position.set(0.15, 0.2, z); g.add(fin);
  }

  // 目
  for (const z of [0.22, -0.22]) {
    const ew = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshPhongMaterial({ color: 0xffffff }));
    ew.position.set(0.35, 0.45, z); g.add(ew);
    const eb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), new THREE.MeshPhongMaterial({ color: 0x111111 }));
    eb.position.set(0.38, 0.45, z); g.add(eb);
  }

  g.scale.setScalar(0.5);
  return g;
}
