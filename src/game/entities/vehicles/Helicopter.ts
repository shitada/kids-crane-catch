import * as THREE from 'three';

/** ヘリコプター — ローター付き */
export function createHelicopter(): THREE.Group {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshPhongMaterial({ color: 0x2E8B57 });
  const rotorMat = new THREE.MeshPhongMaterial({ color: 0x666666 });
  const windowMat = new THREE.MeshPhongMaterial({ color: 0x88ccee, transparent: true, opacity: 0.8 });

  // 胴体
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.2, 0.9, 8), bodyMat);
  body.rotation.z = Math.PI / 2;
  body.position.y = 0.35;
  g.add(body);

  // コックピット
  const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), windowMat);
  cockpit.position.set(0.4, 0.35, 0);
  g.add(cockpit);

  // テールブーム
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.1), bodyMat);
  tail.position.set(-0.8, 0.4, 0);
  g.add(tail);

  // テールローター
  const tailRotor = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.04), rotorMat);
  tailRotor.position.set(-1.2, 0.45, 0);
  g.add(tailRotor);

  // メインローターマスト
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.2, 6), rotorMat);
  mast.position.set(0, 0.55, 0);
  g.add(mast);

  // メインローター（2枚ブレード）
  const blade1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.02, 0.1), rotorMat);
  blade1.position.set(0, 0.66, 0);
  g.add(blade1);

  const blade2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 1.4), rotorMat);
  blade2.position.set(0, 0.66, 0);
  g.add(blade2);

  // スキッド（脚）
  const skidMat = new THREE.MeshPhongMaterial({ color: 0x888888 });
  for (const z of [-0.2, 0.2]) {
    const skid = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.03, 0.03), skidMat);
    skid.position.set(0, 0.08, z);
    g.add(skid);
    // 支柱
    const strut = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.15, 0.03), skidMat);
    strut.position.set(0, 0.18, z);
    g.add(strut);
  }

  g.scale.setScalar(0.6);
  return g;
}
