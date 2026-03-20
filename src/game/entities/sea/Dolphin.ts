import * as THREE from 'three';

export function createDolphin(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0x6699cc });
  const bellyM = new THREE.MeshPhongMaterial({ color: 0xccddee });

  // ボディ（大きめ）
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 1.6, 10), mat);
  body.rotation.z = Math.PI / 2; body.position.y = 0.4; g.add(body);

  // ノーズ
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.65, 8), mat);
  nose.rotation.z = -Math.PI / 2; nose.position.set(1.1, 0.4, 0); g.add(nose);

  // お腹
  const belly = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 1.2, 10), bellyM);
  belly.rotation.z = Math.PI / 2; belly.position.set(0, 0.32, 0); g.add(belly);

  // 背びれ
  const dorsal = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 6), mat);
  dorsal.position.set(0, 0.62, 0); dorsal.rotation.z = -0.15; g.add(dorsal);

  // 胸びれ
  for (const z of [0.22, -0.22]) {
    const pec = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.03, 0.12), mat);
    pec.position.set(0.3, 0.25, z); pec.rotation.x = z > 0 ? -0.4 : 0.4; g.add(pec);
  }

  // 尾びれ
  for (const z of [0.12, -0.12]) {
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.03, 0.2), mat);
    t.position.set(-0.9, 0.42, z); g.add(t);
  }

  // 口のライン
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.01, 0.01), new THREE.MeshPhongMaterial({ color: 0x445566 }));
  mouth.position.set(0.7, 0.35, 0.14); g.add(mouth);

  // 目
  for (const z of [0.2, -0.2]) {
    const ew = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshPhongMaterial({ color: 0xffffff }));
    ew.position.set(0.6, 0.48, z); g.add(ew);
    const eb = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), new THREE.MeshPhongMaterial({ color: 0x111111 }));
    eb.position.set(0.63, 0.48, z); g.add(eb);
  }

  g.scale.setScalar(0.5);
  return g;
}
