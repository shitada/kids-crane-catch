import * as THREE from 'three';

/** パトカー — 白黒のボディ + 赤色灯 */
export function createPoliceCar(): THREE.Group {
  const g = new THREE.Group();
  const whiteMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const blackMat = new THREE.MeshPhongMaterial({ color: 0x1C1C1C });
  const windowMat = new THREE.MeshPhongMaterial({ color: 0x224466 });

  // 下半分（黒）
  const lower = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 0.6), blackMat);
  lower.position.y = 0.25;
  g.add(lower);

  // 上半分（白）
  const upper = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 0.6), whiteMat);
  upper.position.y = 0.47;
  g.add(upper);

  // ルーフ（キャビン）
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.25, 0.55), windowMat);
  cabin.position.y = 0.65;
  g.add(cabin);

  // 赤色灯
  const lightBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.08, 0.2),
    new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.5 }),
  );
  lightBar.position.y = 0.82;
  g.add(lightBar);

  // タイヤ
  const wheelGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 8);
  const wheelMat = new THREE.MeshPhongMaterial({ color: 0x333333 });
  for (const x of [-0.35, 0.35]) {
    for (const z of [-0.33, 0.33]) {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, 0.1, z);
      g.add(wheel);
    }
  }

  g.scale.setScalar(0.55);
  return g;
}
