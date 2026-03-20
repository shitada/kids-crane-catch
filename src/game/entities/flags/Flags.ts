import * as THREE from 'three';

function createFlagBase(colors: { bg: number; elements: { geo: THREE.BufferGeometry; color: number; pos: [number, number, number]; rot?: [number, number, number] }[] }): THREE.Group {
  const g = new THREE.Group();
  const poleMat = new THREE.MeshPhongMaterial({ color: 0x888888 });
  // ポール（太め・長め）
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8), poleMat);
  pole.position.set(-0.55, 0.75, 0);
  g.add(pole);
  // ポール先端の球
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshPhongMaterial({ color: 0xeeeeee }));
  ball.position.set(-0.55, 1.52, 0);
  g.add(ball);
  // ポール土台
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.06, 8), poleMat);
  base.position.set(-0.55, 0.03, 0);
  g.add(base);
  // 旗（大きめ）
  const flag = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.65, 0.02), new THREE.MeshPhongMaterial({ color: colors.bg }));
  flag.position.set(0, 1.15, 0);
  g.add(flag);
  // 旗の模様
  for (const el of colors.elements) {
    const mesh = new THREE.Mesh(el.geo, new THREE.MeshPhongMaterial({ color: el.color }));
    mesh.position.set(el.pos[0], el.pos[1] + 1.15, el.pos[2]);
    if (el.rot) mesh.rotation.set(el.rot[0], el.rot[1], el.rot[2]);
    g.add(mesh);
  }
  g.scale.setScalar(0.5);
  return g;
}

export function createFlagJapan(): THREE.Group {
  return createFlagBase({ bg: 0xffffff, elements: [
    { geo: new THREE.CircleGeometry(0.18, 16), color: 0xcc0000, pos: [0, 0, 0.011] },
  ]});
}
export function createFlagUSA(): THREE.Group {
  return createFlagBase({ bg: 0xffffff, elements: [
    { geo: new THREE.BoxGeometry(1.0, 0.09, 0.021), color: 0xcc0033, pos: [0, 0.25, 0] },
    { geo: new THREE.BoxGeometry(1.0, 0.09, 0.021), color: 0xcc0033, pos: [0, 0.07, 0] },
    { geo: new THREE.BoxGeometry(1.0, 0.09, 0.021), color: 0xcc0033, pos: [0, -0.11, 0] },
    { geo: new THREE.BoxGeometry(1.0, 0.09, 0.021), color: 0xcc0033, pos: [0, -0.29, 0] },
    { geo: new THREE.BoxGeometry(0.38, 0.33, 0.022), color: 0x003399, pos: [-0.31, 0.16, 0] },
  ]});
}
export function createFlagBrazil(): THREE.Group {
  return createFlagBase({ bg: 0x009933, elements: [
    { geo: new THREE.BoxGeometry(0.55, 0.35, 0.021), color: 0xffcc00, pos: [0, 0, 0], rot: [0, 0, Math.PI / 4] },
    { geo: new THREE.CircleGeometry(0.12, 16), color: 0x003399, pos: [0, 0, 0.022] },
  ]});
}
export function createFlagFrance(): THREE.Group {
  return createFlagBase({ bg: 0xffffff, elements: [
    { geo: new THREE.BoxGeometry(0.333, 0.65, 0.021), color: 0x003399, pos: [-0.333, 0, 0] },
    { geo: new THREE.BoxGeometry(0.333, 0.65, 0.021), color: 0xcc0000, pos: [0.333, 0, 0] },
  ]});
}
export function createFlagChina(): THREE.Group {
  return createFlagBase({ bg: 0xcc0000, elements: [
    { geo: new THREE.CircleGeometry(0.12, 5), color: 0xffcc00, pos: [-0.25, 0.15, 0.011] },
    { geo: new THREE.CircleGeometry(0.04, 5), color: 0xffcc00, pos: [-0.12, 0.25, 0.011] },
    { geo: new THREE.CircleGeometry(0.04, 5), color: 0xffcc00, pos: [-0.06, 0.18, 0.011] },
    { geo: new THREE.CircleGeometry(0.04, 5), color: 0xffcc00, pos: [-0.06, 0.08, 0.011] },
    { geo: new THREE.CircleGeometry(0.04, 5), color: 0xffcc00, pos: [-0.12, 0.02, 0.011] },
  ]});
}
export function createFlagAustralia(): THREE.Group {
  return createFlagBase({ bg: 0x003399, elements: [
    { geo: new THREE.BoxGeometry(0.38, 0.22, 0.021), color: 0xcc0033, pos: [-0.31, 0.21, 0] },
    { geo: new THREE.BoxGeometry(0.5, 0.05, 0.021), color: 0xffffff, pos: [-0.31, 0.21, 0] },
    { geo: new THREE.BoxGeometry(0.05, 0.22, 0.021), color: 0xffffff, pos: [-0.31, 0.21, 0] },
    { geo: new THREE.CircleGeometry(0.05, 6), color: 0xffffff, pos: [0.2, -0.08, 0.011] },
    { geo: new THREE.CircleGeometry(0.04, 6), color: 0xffffff, pos: [0.35, -0.15, 0.011] },
  ]});
}
export function createFlagIndia(): THREE.Group {
  return createFlagBase({ bg: 0xffffff, elements: [
    { geo: new THREE.BoxGeometry(1.0, 0.217, 0.021), color: 0xff9933, pos: [0, 0.217, 0] },
    { geo: new THREE.BoxGeometry(1.0, 0.217, 0.021), color: 0x009933, pos: [0, -0.217, 0] },
    { geo: new THREE.CircleGeometry(0.08, 20), color: 0x000088, pos: [0, 0, 0.011] },
  ]});
}
export function createFlagKorea(): THREE.Group {
  return createFlagBase({ bg: 0xffffff, elements: [
    { geo: new THREE.CircleGeometry(0.15, 16), color: 0xcc0033, pos: [0, 0.03, 0.011] },
    { geo: new THREE.CircleGeometry(0.08, 16), color: 0x003399, pos: [0, 0.03, 0.012] },
    { geo: new THREE.CircleGeometry(0.05, 16), color: 0x003399, pos: [0, 0.03, 0.012] },
  ]});
}
