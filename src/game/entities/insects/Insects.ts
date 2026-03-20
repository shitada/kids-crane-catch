import * as THREE from 'three';

export function createBeetleKabuto(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0x553311 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), mat);
  body.scale.set(1.2, 0.7, 1.0); body.position.y = 0.25; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), mat);
  head.position.set(0.3, 0.3, 0); g.add(head);
  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.35, 6), mat);
  horn.rotation.z = -0.4; horn.position.set(0.35, 0.5, 0); g.add(horn);
  for (const [x, z] of [[0.1, 0.18], [0.1, -0.18], [-0.1, 0.18], [-0.1, -0.18], [0, 0.2], [0, -0.2]]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.01, 0.2, 4), mat);
    leg.position.set(x, 0.08, z); leg.rotation.z = z > 0 ? -0.5 : 0.5; g.add(leg);
  }
  g.scale.setScalar(0.6); return g;
}

export function createBeetleKuwagata(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0x331100 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), mat);
  body.scale.set(1.3, 0.6, 0.9); body.position.y = 0.22; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), mat);
  head.position.set(0.28, 0.25, 0); g.add(head);
  const jawL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.03, 0.03), mat);
  jawL.position.set(0.4, 0.3, 0.06); jawL.rotation.y = 0.3; g.add(jawL);
  const jawR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.03, 0.03), mat);
  jawR.position.set(0.4, 0.3, -0.06); jawR.rotation.y = -0.3; g.add(jawR);
  for (const [x, z] of [[0.08, 0.15], [0.08, -0.15], [-0.08, 0.15], [-0.08, -0.15], [0, 0.17], [0, -0.17]]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.008, 0.18, 4), mat);
    leg.position.set(x, 0.06, z); leg.rotation.z = z > 0 ? -0.5 : 0.5; g.add(leg);
  }
  g.scale.setScalar(0.6); return g;
}

export function createButterfly(): THREE.Group {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshPhongMaterial({ color: 0x222222 });
  const wingMat = new THREE.MeshPhongMaterial({ color: 0xff8844, transparent: true, opacity: 0.85 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.3, 6), bodyMat);
  body.rotation.z = Math.PI / 2; body.position.y = 0.3; g.add(body);
  const wL = new THREE.Mesh(new THREE.CircleGeometry(0.25, 8), wingMat);
  wL.position.set(0, 0.35, 0.15); wL.rotation.y = 0.3; g.add(wL);
  const wR = new THREE.Mesh(new THREE.CircleGeometry(0.25, 8), wingMat);
  wR.position.set(0, 0.35, -0.15); wR.rotation.y = -0.3; g.add(wR);
  const dotMat = new THREE.MeshPhongMaterial({ color: 0x4444ff });
  const dL = new THREE.Mesh(new THREE.CircleGeometry(0.06, 8), dotMat);
  dL.position.set(0, 0.38, 0.16); dL.rotation.y = 0.3; g.add(dL);
  const dR = new THREE.Mesh(new THREE.CircleGeometry(0.06, 8), dotMat);
  dR.position.set(0, 0.38, -0.16); dR.rotation.y = -0.3; g.add(dR);
  g.scale.setScalar(0.6); return g;
}

export function createLadybug(): THREE.Group {
  const g = new THREE.Group();
  const red = new THREE.MeshPhongMaterial({ color: 0xdd2222 });
  const black = new THREE.MeshPhongMaterial({ color: 0x111111 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), red);
  body.position.y = 0.18; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), black);
  head.position.set(0.18, 0.2, 0); g.add(head);
  for (const [x, z] of [[0.05, 0.1], [-0.05, 0.12], [0.05, -0.1], [-0.05, -0.12]]) {
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.04, 8), black);
    dot.position.set(x, 0.37, z); dot.rotation.x = -Math.PI / 2; g.add(dot);
  }
  const line = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.01, 0.01), black);
  line.position.set(0, 0.38, 0); line.rotation.x = -Math.PI / 2; g.add(line);
  g.scale.setScalar(0.65); return g;
}

export function createDragonfly(): THREE.Group {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshPhongMaterial({ color: 0x2266aa });
  const wingMat = new THREE.MeshPhongMaterial({ color: 0xccddff, transparent: true, opacity: 0.5 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.8, 6), bodyMat);
  body.rotation.z = Math.PI / 2; body.position.y = 0.3; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), bodyMat);
  head.position.set(0.42, 0.3, 0); g.add(head);
  for (const [x, z] of [[0.1, 0.2], [0.1, -0.2], [-0.05, 0.18], [-0.05, -0.18]]) {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.01, 0.08), wingMat);
    wing.position.set(x, 0.34, z); g.add(wing);
  }
  const eyeM = new THREE.MeshPhongMaterial({ color: 0x44ff44 });
  const eL = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), eyeM);
  eL.position.set(0.46, 0.33, 0.04); g.add(eL);
  const eR = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), eyeM);
  eR.position.set(0.46, 0.33, -0.04); g.add(eR);
  g.scale.setScalar(0.55); return g;
}

export function createGrasshopper(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0x44aa22 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.5, 8), mat);
  body.rotation.z = Math.PI / 2; body.position.y = 0.3; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), mat);
  head.position.set(0.28, 0.32, 0); g.add(head);
  const legBack = new THREE.MeshPhongMaterial({ color: 0x338811 });
  for (const z of [0.08, -0.08]) {
    const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.2, 0.04), legBack);
    thigh.position.set(-0.1, 0.35, z); thigh.rotation.z = 0.8; g.add(thigh);
    const shin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.2, 0.03), legBack);
    shin.position.set(-0.2, 0.2, z); shin.rotation.z = -0.5; g.add(shin);
  }
  g.scale.setScalar(0.6); return g;
}

export function createFirefly(): THREE.Group {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshPhongMaterial({ color: 0x333333 });
  const glowMat = new THREE.MeshPhongMaterial({ color: 0xffff44, emissive: 0xffff00, emissiveIntensity: 0.8 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.3, 6), bodyMat);
  body.rotation.z = Math.PI / 2; body.position.y = 0.3; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), bodyMat);
  head.position.set(0.18, 0.3, 0); g.add(head);
  const glow = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), glowMat);
  glow.position.set(-0.16, 0.3, 0); g.add(glow);
  const wingMat = new THREE.MeshPhongMaterial({ color: 0x888888, transparent: true, opacity: 0.4 });
  const wL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.01, 0.06), wingMat);
  wL.position.set(0, 0.34, 0.06); g.add(wL);
  const wR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.01, 0.06), wingMat);
  wR.position.set(0, 0.34, -0.06); g.add(wR);
  g.scale.setScalar(0.65); return g;
}

export function createMantis(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0x55aa33 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.5, 6), mat);
  body.rotation.z = Math.PI / 2; body.position.y = 0.3; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), mat);
  head.position.set(0.28, 0.33, 0); head.scale.set(1.0, 0.8, 0.7); g.add(head);
  const armMat = new THREE.MeshPhongMaterial({ color: 0x448822 });
  for (const z of [0.06, -0.06]) {
    const upper = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.15, 0.03), armMat);
    upper.position.set(0.2, 0.4, z); upper.rotation.z = -0.8; g.add(upper);
    const lower = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.02), armMat);
    lower.position.set(0.28, 0.35, z); lower.rotation.z = 0.5; g.add(lower);
  }
  for (const [x, z] of [[0, 0.08], [0, -0.08], [-0.1, 0.08], [-0.1, -0.08]]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.008, 0.2, 4), mat);
    leg.position.set(x, 0.15, z); leg.rotation.z = z > 0 ? -0.4 : 0.4; g.add(leg);
  }
  const eyeM = new THREE.MeshPhongMaterial({ color: 0x111111 });
  const eL = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), eyeM);
  eL.position.set(0.32, 0.36, 0.04); g.add(eL);
  const eR = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), eyeM);
  eR.position.set(0.32, 0.36, -0.04); g.add(eR);
  g.scale.setScalar(0.6); return g;
}
