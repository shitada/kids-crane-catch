import * as THREE from 'three';

export function createWhale(): THREE.Group {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshPhongMaterial({ color: 0x3366aa });
  const bellyMat = new THREE.MeshPhongMaterial({ color: 0x99bbdd });

  // メインボディ（大きめ）
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12), bodyMat);
  body.scale.set(2.0, 0.85, 1.0);
  body.position.y = 0.4;
  g.add(body);

  // お腹
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 10), bellyMat);
  belly.scale.set(1.7, 0.5, 0.85);
  belly.position.set(0, 0.2, 0);
  g.add(belly);

  // 下あご
  const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 8), bellyMat);
  jaw.scale.set(1.2, 0.3, 0.7);
  jaw.position.set(0.5, 0.15, 0);
  g.add(jaw);

  // 尾びれ
  const tailBase = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.5, 8), bodyMat);
  tailBase.rotation.z = Math.PI / 2;
  tailBase.position.set(-1.1, 0.4, 0);
  g.add(tailBase);
  for (const z of [0.15, -0.15]) {
    const fluke = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.25), bodyMat);
    fluke.position.set(-1.3, 0.45, z);
    fluke.rotation.z = 0.3;
    g.add(fluke);
  }

  // 胸びれ
  for (const z of [0.4, -0.4]) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.03, 0.15), bodyMat);
    fin.position.set(0.2, 0.15, z);
    fin.rotation.x = z > 0 ? -0.3 : 0.3;
    g.add(fin);
  }

  // 潮吹き穴
  const blowhole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 8), new THREE.MeshPhongMaterial({ color: 0x224488 }));
  blowhole.position.set(0.3, 0.72, 0);
  g.add(blowhole);

  // 目（白目＋黒目＋ハイライト）
  for (const z of [0.42, -0.42]) {
    const w = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshPhongMaterial({ color: 0xffffff }));
    w.position.set(0.7, 0.45, z); g.add(w);
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), new THREE.MeshPhongMaterial({ color: 0x111111 }));
    b.position.set(0.73, 0.45, z); g.add(b);
  }

  g.scale.setScalar(0.5);
  return g;
}
