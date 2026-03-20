import * as THREE from 'three';

/** ロケット — 三角錐の先頭 + 円筒ボディ + フィン */
export function createRocket(): THREE.Group {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const noseMat = new THREE.MeshPhongMaterial({ color: 0xFF4500 });
  const finMat = new THREE.MeshPhongMaterial({ color: 0xFF4500 });
  const windowMat = new THREE.MeshPhongMaterial({ color: 0x4488ff });

  // ボディ（円筒）
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 1.0, 8), bodyMat);
  body.position.y = 0.6;
  g.add(body);

  // ノーズコーン
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 8), noseMat);
  nose.position.y = 1.35;
  g.add(nose);

  // 窓
  const win = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), windowMat);
  win.position.set(0, 0.8, 0.2);
  g.add(win);

  // フィン（3枚）
  for (let i = 0; i < 3; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.2), finMat);
    const angle = (i * Math.PI * 2) / 3;
    fin.position.set(Math.sin(angle) * 0.22, 0.15, Math.cos(angle) * 0.22);
    fin.rotation.y = angle;
    g.add(fin);
  }

  // ノズル
  const nozzle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.1, 0.15, 8),
    new THREE.MeshPhongMaterial({ color: 0x666666 }),
  );
  nozzle.position.y = 0.05;
  g.add(nozzle);

  g.scale.setScalar(0.5);
  return g;
}
