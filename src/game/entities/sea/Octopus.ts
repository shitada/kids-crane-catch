import * as THREE from 'three';

export function createOctopus(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0xcc4488 });
  const lightMat = new THREE.MeshPhongMaterial({ color: 0xdd6699 });

  // 頭（大きめ）
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 10), mat);
  head.scale.set(1.0, 1.3, 1.0); head.position.y = 0.7; g.add(head);

  // 8本の足（太め）
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.025, 0.55, 8), mat);
    leg.position.set(Math.cos(angle) * 0.25, 0.18, Math.sin(angle) * 0.25);
    leg.rotation.x = Math.sin(angle) * 0.4; leg.rotation.z = Math.cos(angle) * 0.4;
    g.add(leg);
    // 吸盤
    const sucker = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), lightMat);
    sucker.position.set(Math.cos(angle) * 0.3, 0.03, Math.sin(angle) * 0.3);
    g.add(sucker);
  }

  // 目（白目＋黒目＋ハイライト）
  for (const z of [-0.2, 0.2]) {
    const ew = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshPhongMaterial({ color: 0xffffff }));
    ew.position.set(0.25, 0.8, z); g.add(ew);
    const eb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshPhongMaterial({ color: 0x111111 }));
    eb.position.set(0.3, 0.8, z); g.add(eb);
    const shine = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), new THREE.MeshPhongMaterial({ color: 0xffffff }));
    shine.position.set(0.32, 0.83, z); g.add(shine);
  }

  g.scale.setScalar(0.5);
  return g;
}
