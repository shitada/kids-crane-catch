import * as THREE from 'three';

/** ふね — 船体 + 煙突 + キャビン */
export function createShip(): THREE.Group {
  const g = new THREE.Group();
  const hullMat = new THREE.MeshPhongMaterial({ color: 0x4169E1 });
  const deckMat = new THREE.MeshPhongMaterial({ color: 0xdddddd });
  const cabinMat = new THREE.MeshPhongMaterial({ color: 0xeeeeee });
  const funnelMat = new THREE.MeshPhongMaterial({ color: 0xff4444 });

  // 船体（台形っぽいBox）
  const hull = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 0.6), hullMat);
  hull.position.y = 0.15;
  g.add(hull);

  // 船首（三角形っぽく）
  const bow = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 4), hullMat);
  bow.rotation.z = -Math.PI / 2;
  bow.rotation.y = Math.PI / 4;
  bow.position.set(1.0, 0.15, 0);
  g.add(bow);

  // デッキ
  const deck = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.55), deckMat);
  deck.position.y = 0.33;
  g.add(deck);

  // キャビン
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.4), cabinMat);
  cabin.position.set(-0.2, 0.5, 0);
  g.add(cabin);

  // ブリッジ（操舵室）
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.35), cabinMat);
  bridge.position.set(-0.2, 0.75, 0);
  g.add(bridge);

  // 窓
  const winMat = new THREE.MeshPhongMaterial({ color: 0x88bbdd });
  const win = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.36), winMat);
  win.position.set(-0.2, 0.78, 0);
  g.add(win);

  // 煙突
  const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.35, 8), funnelMat);
  funnel.position.set(0.15, 0.55, 0);
  g.add(funnel);

  g.scale.setScalar(0.5);
  return g;
}
