import * as THREE from 'three';

/** ショベルカー — アーム付き */
export function createExcavator(): THREE.Group {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshPhongMaterial({ color: 0xFFD700 });
  const trackMat = new THREE.MeshPhongMaterial({ color: 0x444444 });
  const cabMat = new THREE.MeshPhongMaterial({ color: 0xFFD700 });
  const armMat = new THREE.MeshPhongMaterial({ color: 0xccaa00 });

  // キャタピラ（左右）
  for (const z of [-0.3, 0.3]) {
    const track = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.2, 0.2), trackMat);
    track.position.set(0, 0.1, z);
    g.add(track);
  }

  // ボディ
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.3, 0.55), bodyMat);
  body.position.y = 0.35;
  g.add(body);

  // キャビン
  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.45), cabMat);
  cab.position.set(-0.1, 0.65, 0);
  g.add(cab);

  // キャビンの窓
  const winMat = new THREE.MeshPhongMaterial({ color: 0x88bbdd });
  const win = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.2, 0.4), winMat);
  win.position.set(0.1, 0.7, 0);
  g.add(win);

  // アーム（ブーム）
  const boom = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.08), armMat);
  boom.position.set(0.35, 0.7, 0);
  boom.rotation.z = 0.4;
  g.add(boom);

  // アーム（スティック）
  const stick = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 0.06), armMat);
  stick.position.set(0.6, 0.55, 0);
  stick.rotation.z = -0.6;
  g.add(stick);

  // バケット
  const bucket = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.12, 0.2), trackMat);
  bucket.position.set(0.65, 0.28, 0);
  g.add(bucket);

  g.scale.setScalar(0.6);
  return g;
}
