import * as THREE from 'three';

/** ひこうき — 翼と尾翼のある飛行機 */
export function createAirplane(): THREE.Group {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshPhongMaterial({ color: 0xeeeeee });
  const wingMat = new THREE.MeshPhongMaterial({ color: 0x87CEEB });
  const tailMat = new THREE.MeshPhongMaterial({ color: 0xff4444 });

  // 胴体
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 1.8, 8), bodyMat);
  body.rotation.z = Math.PI / 2;
  body.position.y = 0.3;
  g.add(body);

  // ノーズ
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), bodyMat);
  nose.position.set(0.9, 0.3, 0);
  g.add(nose);

  // 主翼
  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 2.0), wingMat);
  wing.position.set(-0.1, 0.3, 0);
  g.add(wing);

  // 尾翼（水平）
  const hTail = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.03, 0.8), tailMat);
  hTail.position.set(-0.85, 0.35, 0);
  g.add(hTail);

  // 尾翼（垂直）
  const vTail = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.03), tailMat);
  vTail.position.set(-0.85, 0.55, 0);
  g.add(vTail);

  // エンジン
  const engGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.3, 8);
  const engMat = new THREE.MeshPhongMaterial({ color: 0x666666 });
  for (const z of [-0.5, 0.5]) {
    const eng = new THREE.Mesh(engGeo, engMat);
    eng.rotation.z = Math.PI / 2;
    eng.position.set(0.0, 0.2, z);
    g.add(eng);
  }

  g.scale.setScalar(0.55);
  return g;
}
