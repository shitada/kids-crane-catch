import * as THREE from 'three';

export function createSeahorse(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0xffaa33 });
  const lightMat = new THREE.MeshPhongMaterial({ color: 0xffcc66 });

  // 頭
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), mat);
  head.position.set(0.12, 0.85, 0); g.add(head);

  // くちばし
  const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.025, 0.2, 8), mat);
  snout.rotation.z = -Math.PI / 2; snout.position.set(0.28, 0.85, 0); g.add(snout);

  // クラウン
  const crown = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.1, 6), mat);
  crown.position.set(0.1, 1.02, 0); g.add(crown);

  // 胴体
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.55, 10), mat);
  body.position.y = 0.52; g.add(body);

  // お腹（明るい色）
  const belly = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.06, 0.45, 10), lightMat);
  belly.position.set(0.03, 0.52, 0); g.add(belly);

  // 尾（カール）
  const tail = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 8, 12, Math.PI * 1.5), mat);
  tail.position.set(-0.08, 0.15, 0); tail.rotation.y = Math.PI / 2; g.add(tail);

  // 背びれ
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.1), mat);
  fin.position.set(-0.12, 0.6, 0); g.add(fin);

  // 目
  const ew = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshPhongMaterial({ color: 0xffffff }));
  ew.position.set(0.18, 0.9, 0.1); g.add(ew);
  const eb = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), new THREE.MeshPhongMaterial({ color: 0x111111 }));
  eb.position.set(0.2, 0.9, 0.1); g.add(eb);

  g.scale.setScalar(0.5);
  return g;
}
