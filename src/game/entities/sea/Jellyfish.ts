import * as THREE from 'three';

export function createJellyfish(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0xaabbff, transparent: true, opacity: 0.7 });
  const innerMat = new THREE.MeshPhongMaterial({ color: 0xccddff, transparent: true, opacity: 0.5 });

  // 傘（ベル）大きめ
  const bell = new THREE.Mesh(new THREE.SphereGeometry(0.4, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat);
  bell.position.y = 0.55; g.add(bell);

  // 内側の模様
  const inner = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), innerMat);
  inner.position.y = 0.53; g.add(inner);

  // 縁のフリル
  const frill = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.03, 8, 20), mat);
  frill.rotation.x = Math.PI / 2; frill.position.y = 0.55; g.add(frill);

  // 触手（8本）
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const t = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.008, 0.6, 4),
      new THREE.MeshPhongMaterial({ color: 0xccddff, transparent: true, opacity: 0.5 }),
    );
    t.position.set(Math.cos(angle) * 0.2, 0.18, Math.sin(angle) * 0.2);
    g.add(t);
  }

  g.scale.setScalar(0.5);
  return g;
}
