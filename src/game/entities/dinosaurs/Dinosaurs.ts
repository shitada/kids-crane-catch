import * as THREE from 'three';

export function createTrex(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0x556633 });
  const belly = new THREE.MeshPhongMaterial({ color: 0x99aa77 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.35), mat);
  body.position.set(0, 0.55, 0); g.add(body);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.3, 0.3), mat);
  head.position.set(0.45, 0.75, 0); g.add(head);
  const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.25), belly);
  jaw.position.set(0.48, 0.58, 0); g.add(jaw);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 6), mat);
  tail.rotation.z = Math.PI / 2; tail.position.set(-0.6, 0.55, 0); g.add(tail);
  for (const x of [-0.1, 0.1]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.35, 0.12), mat); leg.position.set(x, 0.18, 0.12 * Math.sign(x === -0.1 ? -1 : 1)); g.add(leg); }
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), new THREE.MeshPhongMaterial({ color: 0xffcc00 }));
  eye.position.set(0.58, 0.82, 0.12); g.add(eye);
  g.scale.setScalar(0.65); return g;
}

export function createTriceratops(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0x886644 });
  const horn = new THREE.MeshPhongMaterial({ color: 0xeeeecc });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.4), mat);
  body.position.set(0, 0.45, 0); g.add(body);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.3, 0.35), mat);
  head.position.set(0.4, 0.55, 0); g.add(head);
  const frill = new THREE.Mesh(new THREE.CircleGeometry(0.2, 8), mat);
  frill.position.set(0.28, 0.65, 0); g.add(frill);
  const h1 = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.2, 6), horn);
  h1.position.set(0.5, 0.75, 0.08); g.add(h1);
  const h2 = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.2, 6), horn);
  h2.position.set(0.5, 0.75, -0.08); g.add(h2);
  const h3 = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.1, 6), horn);
  h3.rotation.z = -0.3; h3.position.set(0.55, 0.55, 0); g.add(h3);
  for (const [x, z] of [[-0.15, 0.15], [-0.15, -0.15], [0.15, 0.15], [0.15, -0.15]]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 0.1), mat); leg.position.set(x, 0.15, z); g.add(leg); }
  g.scale.setScalar(0.65); return g;
}

export function createStegosaurus(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0x669944 });
  const plate = new THREE.MeshPhongMaterial({ color: 0xcc8833 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 8), mat);
  body.scale.set(1.8, 1.0, 1.0); body.position.set(0, 0.45, 0); g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), mat);
  head.position.set(0.5, 0.35, 0); g.add(head);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.5, 6), mat);
  tail.rotation.z = Math.PI / 2; tail.position.set(-0.55, 0.45, 0); g.add(tail);
  for (let i = 0; i < 5; i++) { const p = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.15, 4), plate); p.position.set(-0.2 + i * 0.12, 0.7, 0); g.add(p); }
  for (const [x, z] of [[-0.15, 0.12], [-0.15, -0.12], [0.15, 0.12], [0.15, -0.12]]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.08), mat); leg.position.set(x, 0.15, z); g.add(leg); }
  g.scale.setScalar(0.65); return g;
}

export function createPteranodon(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0x8899aa });
  const wing = new THREE.MeshPhongMaterial({ color: 0xaabbcc, transparent: true, opacity: 0.8 });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.4, 8), mat);
  body.rotation.z = Math.PI / 2; body.position.y = 0.4; g.add(body);
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.25, 6), mat);
  head.rotation.z = -Math.PI / 2; head.position.set(0.32, 0.42, 0); g.add(head);
  const crest = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.2, 4), mat);
  crest.rotation.z = 0.3; crest.position.set(0.15, 0.52, 0); g.add(crest);
  const wL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.7), wing);
  wL.position.set(0, 0.4, 0); g.add(wL);
  g.scale.setScalar(0.65); return g;
}

export function createBrachiosaurus(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0x77aa55 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 8), mat);
  body.scale.set(1.5, 1.0, 0.9); body.position.set(0, 0.5, 0); g.add(body);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.6, 8), mat);
  neck.position.set(0.25, 0.85, 0); neck.rotation.z = -0.3; g.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), mat);
  head.position.set(0.4, 1.15, 0); g.add(head);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.5, 6), mat);
  tail.rotation.z = Math.PI / 2; tail.position.set(-0.5, 0.45, 0); g.add(tail);
  for (const [x, z] of [[-0.1, 0.1], [-0.1, -0.1], [0.15, 0.1], [0.15, -0.1]]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.08), mat); leg.position.set(x, 0.15, z); g.add(leg); }
  g.scale.setScalar(0.65); return g;
}

export function createVelociraptor(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0x998866 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.2, 0.18), mat);
  body.position.set(0, 0.45, 0); g.add(body);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.12), mat);
  head.position.set(0.28, 0.52, 0); g.add(head);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.45, 6), mat);
  tail.rotation.z = Math.PI / 2; tail.position.set(-0.38, 0.45, 0); g.add(tail);
  for (const z of [0.06, -0.06]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 0.06), mat); leg.position.set(0.05, 0.18, z); g.add(leg); }
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), new THREE.MeshPhongMaterial({ color: 0xffcc00 }));
  eye.position.set(0.35, 0.56, 0.06); g.add(eye);
  g.scale.setScalar(0.65); return g;
}

export function createAnkylosaurus(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0x887755 });
  const armor = new THREE.MeshPhongMaterial({ color: 0x665544 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 8), mat);
  body.scale.set(1.5, 0.7, 1.1); body.position.set(0, 0.4, 0); g.add(body);
  for (let i = 0; i < 4; i++) { const spike = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.1, 4), armor); spike.position.set(-0.15 + i * 0.1, 0.58, 0); g.add(spike); }
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.15, 0.2), mat);
  head.position.set(0.35, 0.35, 0); g.add(head);
  const club = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), armor);
  club.position.set(-0.45, 0.35, 0); g.add(club);
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.3, 6), mat);
  tail.rotation.z = Math.PI / 2; tail.position.set(-0.35, 0.38, 0); g.add(tail);
  for (const [x, z] of [[-0.12, 0.12], [-0.12, -0.12], [0.12, 0.12], [0.12, -0.12]]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.08), mat); leg.position.set(x, 0.15, z); g.add(leg); }
  g.scale.setScalar(0.65); return g;
}

export function createParasaurolophus(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0x66aa88 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.3, 0.3), mat);
  body.position.set(0, 0.45, 0); g.add(body);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.18), mat);
  head.position.set(0.35, 0.6, 0); g.add(head);
  const crest = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.3, 6), mat);
  crest.rotation.z = 0.5; crest.position.set(0.25, 0.78, 0); g.add(crest);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.5, 6), mat);
  tail.rotation.z = Math.PI / 2; tail.position.set(-0.5, 0.45, 0); g.add(tail);
  for (const [x, z] of [[-0.1, 0.1], [-0.1, -0.1], [0.1, 0.1], [0.1, -0.1]]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.08), mat); leg.position.set(x, 0.15, z); g.add(leg); }
  g.scale.setScalar(0.65); return g;
}
