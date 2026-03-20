import * as THREE from 'three';

/** バス — 大きな四角い車体 */
export function createBus(): THREE.Group {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshPhongMaterial({ color: 0xFF8C00 });
  const windowMat = new THREE.MeshPhongMaterial({ color: 0xaaddff });
  const wheelMat = new THREE.MeshPhongMaterial({ color: 0x333333 });

  // ボディ
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 0.7), bodyMat);
  body.position.y = 0.45;
  g.add(body);

  // 屋根
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.05, 0.65),
    new THREE.MeshPhongMaterial({ color: 0xeeeeee }),
  );
  roof.position.y = 0.78;
  g.add(roof);

  // 窓（両サイド）
  for (let i = -2; i <= 2; i++) {
    for (const z of [-0.36, 0.36]) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.02), windowMat);
      win.position.set(i * 0.3, 0.55, z);
      g.add(win);
    }
  }

  // フロントガラス
  const front = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.6), windowMat);
  front.position.set(0.81, 0.55, 0);
  g.add(front);

  // タイヤ
  const wheelGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 8);
  for (const x of [-0.5, 0.5]) {
    for (const z of [-0.38, 0.38]) {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, 0.12, z);
      g.add(wheel);
    }
  }

  g.scale.setScalar(0.5);
  return g;
}
