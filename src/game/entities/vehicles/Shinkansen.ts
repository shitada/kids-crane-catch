import * as THREE from 'three';

/** しんかんせん — 細長い流線型の車体 */
export function createShinkansen(): THREE.Group {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const stripeMat = new THREE.MeshPhongMaterial({ color: 0x0072CE });
  const windowMat = new THREE.MeshPhongMaterial({ color: 0x222244 });

  // メインボディ
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.5, 0.6), bodyMat);
  body.position.y = 0.35;
  g.add(body);

  // 青いストライプ
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.62), stripeMat);
  stripe.position.y = 0.3;
  g.add(stripe);

  // ノーズ（先頭の流線型）
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8, 4), bodyMat);
  nose.rotation.z = -Math.PI / 2;
  nose.position.set(1.4, 0.35, 0);
  g.add(nose);

  // 窓
  for (let i = -2; i <= 2; i++) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.12, 0.62), windowMat);
    win.position.set(i * 0.35, 0.48, 0);
    g.add(win);
  }

  // 台車
  const bogieGeo = new THREE.BoxGeometry(0.4, 0.1, 0.5);
  const bogieMat = new THREE.MeshPhongMaterial({ color: 0x444444 });
  for (const x of [-0.6, 0.6]) {
    const bogie = new THREE.Mesh(bogieGeo, bogieMat);
    bogie.position.set(x, 0.05, 0);
    g.add(bogie);
  }

  g.scale.setScalar(0.5);
  return g;
}
