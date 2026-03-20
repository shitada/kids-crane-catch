import * as THREE from 'three';

export function createSeaTurtle(): THREE.Group {
  const g = new THREE.Group();
  const shell = new THREE.MeshPhongMaterial({ color: 0x558844 });
  const shellDark = new THREE.MeshPhongMaterial({ color: 0x446633 });
  const skin = new THREE.MeshPhongMaterial({ color: 0x77aa66 });

  // 甲羅（大きめ）
  const shellM = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), shell);
  shellM.position.y = 0.28; g.add(shellM);

  // 甲羅の模様
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const p = new THREE.Mesh(new THREE.CircleGeometry(0.1, 6), shellDark);
    p.rotation.x = -Math.PI / 2; p.position.set(Math.cos(a) * 0.2, 0.52, Math.sin(a) * 0.2); g.add(p);
  }

  // 腹板
  const bellyPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.06, 12), skin);
  bellyPlate.position.y = 0.25; g.add(bellyPlate);

  // 頭
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), skin);
  head.position.set(0.45, 0.3, 0); g.add(head);

  // 4つのヒレ
  for (const [x, z, rot] of [[0.35, 0.3, 0.4], [0.35, -0.3, -0.4], [-0.25, 0.3, 0.3], [-0.25, -0.3, -0.3]] as [number, number, number][]) {
    const flipper = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.12), skin);
    flipper.position.set(x, 0.22, z); flipper.rotation.y = rot; g.add(flipper);
  }

  // 尾
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.15, 6), skin);
  tail.rotation.z = Math.PI / 2; tail.position.set(-0.5, 0.28, 0); g.add(tail);

  // 目
  for (const z of [0.1, -0.1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), new THREE.MeshPhongMaterial({ color: 0x111111 }));
    eye.position.set(0.55, 0.35, z); g.add(eye);
  }

  g.scale.setScalar(0.5);
  return g;
}
