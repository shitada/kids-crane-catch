import * as THREE from 'three';

export function createLion(): THREE.Group {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshPhongMaterial({ color: 0xcc8833 });
  const maneMat = new THREE.MeshPhongMaterial({ color: 0x995522 });
  const bellyMat = new THREE.MeshPhongMaterial({ color: 0xddaa55 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 10), bodyMat);
  body.scale.set(1.4, 0.9, 0.9); body.position.y = 0.45; g.add(body);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 8), bellyMat);
  belly.scale.set(1.2, 0.6, 0.8); belly.position.set(0, 0.35, 0); g.add(belly);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), bodyMat);
  head.position.set(0.45, 0.65, 0); g.add(head);
  const mane = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), maneMat);
  mane.position.set(0.42, 0.65, 0); g.add(mane);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), new THREE.MeshPhongMaterial({ color: 0x333333 }));
  nose.position.set(0.62, 0.62, 0); g.add(nose);
  for (const z of [0.1, -0.1]) { const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), new THREE.MeshPhongMaterial({ color: 0x222222 })); eye.position.set(0.58, 0.72, z); g.add(eye); }
  for (const [x, z] of [[-0.15, 0.15], [-0.15, -0.15], [0.2, 0.15], [0.2, -0.15]] as [number, number][]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.3, 8), bodyMat); leg.position.set(x, 0.15, z); g.add(leg); }
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.01, 0.4, 6), bodyMat);
  tail.rotation.z = 0.8; tail.position.set(-0.5, 0.55, 0); g.add(tail);
  g.scale.setScalar(0.8); return g;
}

export function createElephant(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0x888899 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 10), mat);
  body.scale.set(1.3, 1.0, 1.0); body.position.y = 0.55; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), mat);
  head.position.set(0.5, 0.7, 0); g.add(head);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.45, 8), mat);
  trunk.rotation.z = 0.5; trunk.position.set(0.7, 0.5, 0); g.add(trunk);
  for (const z of [0.18, -0.18]) { const ear = new THREE.Mesh(new THREE.CircleGeometry(0.18, 8), mat); ear.position.set(0.4, 0.75, z); ear.rotation.y = z > 0 ? -0.3 : 0.3; g.add(ear); }
  for (const z of [0.1, -0.1]) { const eye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), new THREE.MeshPhongMaterial({ color: 0x222222 })); eye.position.set(0.65, 0.78, z); g.add(eye); }
  for (const [x, z] of [[-0.15, 0.15], [-0.15, -0.15], [0.2, 0.15], [0.2, -0.15]] as [number, number][]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.35, 8), mat); leg.position.set(x, 0.18, z); g.add(leg); }
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.01, 0.25, 4), mat);
  tail.rotation.z = 0.6; tail.position.set(-0.5, 0.6, 0); g.add(tail);
  g.scale.setScalar(0.75); return g;
}

export function createGiraffe(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0xddaa44 });
  const spotMat = new THREE.MeshPhongMaterial({ color: 0x995522 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 8), mat);
  body.scale.set(1.3, 0.8, 0.8); body.position.y = 0.55; g.add(body);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.6, 8), mat);
  neck.position.set(0.3, 0.95, 0); neck.rotation.z = -0.2; g.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), mat);
  head.position.set(0.4, 1.25, 0); g.add(head);
  for (const z of [0.04, -0.04]) { const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.1, 4), mat); horn.position.set(0.38, 1.38, z); g.add(horn); const tip = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), spotMat); tip.position.set(0.38, 1.43, z); g.add(tip); }
  for (const z of [0.06, -0.06]) { const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), new THREE.MeshPhongMaterial({ color: 0x222222 })); eye.position.set(0.47, 1.28, z); g.add(eye); }
  for (let i = 0; i < 4; i++) { const spot = new THREE.Mesh(new THREE.CircleGeometry(0.05, 6), spotMat); spot.position.set(-0.1 + i * 0.12, 0.6 + (i % 2) * 0.08, 0.25); g.add(spot); }
  for (const [x, z] of [[-0.1, 0.1], [-0.1, -0.1], [0.15, 0.1], [0.15, -0.1]] as [number, number][]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 6), mat); leg.position.set(x, 0.2, z); g.add(leg); }
  g.scale.setScalar(0.75); return g;
}

export function createPanda(): THREE.Group {
  const g = new THREE.Group();
  const white = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const black = new THREE.MeshPhongMaterial({ color: 0x222222 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 10), white);
  body.scale.set(1.0, 1.1, 0.9); body.position.y = 0.45; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), white);
  head.position.set(0, 0.85, 0); g.add(head);
  for (const z of [0.12, -0.12]) { const eyePatch = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), black); eyePatch.position.set(0.15, 0.9, z); g.add(eyePatch); const eyeW = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), white); eyeW.position.set(0.18, 0.92, z); g.add(eyeW); const eyeB = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), black); eyeB.position.set(0.2, 0.92, z); g.add(eyeB); }
  for (const z of [0.15, -0.15]) { const ear = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), black); ear.position.set(-0.05, 1.08, z); g.add(ear); }
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), black);
  nose.position.set(0.22, 0.82, 0); g.add(nose);
  for (const [x, z] of [[-0.12, 0.12], [-0.12, -0.12], [0.12, 0.12], [0.12, -0.12]] as [number, number][]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.25, 8), black); leg.position.set(x, 0.13, z); g.add(leg); }
  g.scale.setScalar(0.8); return g;
}

export function createRabbit(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0xeeeeee });
  const pink = new THREE.MeshPhongMaterial({ color: 0xffaaaa });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), mat);
  body.scale.set(0.9, 1.1, 0.9); body.position.y = 0.35; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), mat);
  head.position.set(0, 0.7, 0); g.add(head);
  for (const z of [0.06, -0.06]) { const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.3, 6), mat); ear.position.set(-0.02, 0.98, z); g.add(ear); const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.015, 0.25, 6), pink); inner.position.set(-0.01, 0.98, z); g.add(inner); }
  for (const z of [0.08, -0.08]) { const eye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), new THREE.MeshPhongMaterial({ color: 0xcc2222 })); eye.position.set(0.12, 0.75, z); g.add(eye); }
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), pink);
  nose.position.set(0.16, 0.68, 0); g.add(nose);
  const tail = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), mat);
  tail.position.set(-0.22, 0.35, 0); g.add(tail);
  g.scale.setScalar(0.85); return g;
}

export function createPenguin(): THREE.Group {
  const g = new THREE.Group();
  const black = new THREE.MeshPhongMaterial({ color: 0x222233 });
  const white = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const orange = new THREE.MeshPhongMaterial({ color: 0xff8800 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), black);
  body.scale.set(0.9, 1.2, 0.8); body.position.y = 0.4; g.add(body);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), white);
  belly.scale.set(0.7, 1.0, 0.5); belly.position.set(0.05, 0.38, 0); g.add(belly);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), black);
  head.position.set(0, 0.72, 0); g.add(head);
  for (const z of [0.08, -0.08]) { const eyeW = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), white); eyeW.position.set(0.1, 0.76, z); g.add(eyeW); const eyeB = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), new THREE.MeshPhongMaterial({ color: 0x111111 })); eyeB.position.set(0.12, 0.76, z); g.add(eyeB); }
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 6), orange);
  beak.rotation.z = -Math.PI / 2; beak.position.set(0.18, 0.7, 0); g.add(beak);
  for (const z of [0.18, -0.18]) { const wing = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.04), black); wing.position.set(0, 0.4, z); wing.rotation.x = z > 0 ? -0.3 : 0.3; g.add(wing); }
  for (const z of [0.06, -0.06]) { const foot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.06), orange); foot.position.set(0.03, 0.05, z); g.add(foot); }
  g.scale.setScalar(0.85); return g;
}

export function createCat(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0xdd8844 });
  const white = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), mat);
  body.scale.set(1.3, 0.9, 0.8); body.position.y = 0.35; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), mat);
  head.position.set(0.3, 0.55, 0); g.add(head);
  for (const z of [0.08, -0.08]) { const ear = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.1, 4), mat); ear.position.set(0.25, 0.75, z); g.add(ear); }
  for (const z of [0.08, -0.08]) { const eyeW = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), new THREE.MeshPhongMaterial({ color: 0x44cc44 })); eyeW.position.set(0.4, 0.6, z); g.add(eyeW); const eyeB = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshPhongMaterial({ color: 0x111111 })); eyeB.position.set(0.42, 0.6, z); g.add(eyeB); }
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshPhongMaterial({ color: 0xff8888 }));
  nose.position.set(0.45, 0.53, 0); g.add(nose);
  for (const [x, z] of [[-0.08, 0.08], [-0.08, -0.08], [0.12, 0.08], [0.12, -0.08]] as [number, number][]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.2, 6), mat); leg.position.set(x, 0.1, z); g.add(leg); }
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.015, 0.4, 6), mat);
  tail.rotation.z = 1.0; tail.position.set(-0.35, 0.45, 0); g.add(tail);
  g.scale.setScalar(0.85); return g;
}

export function createDog(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0xaa7744 });
  const bellyMat = new THREE.MeshPhongMaterial({ color: 0xddbb88 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), mat);
  body.scale.set(1.3, 0.9, 0.85); body.position.y = 0.4; g.add(body);
  const bellyM = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), bellyMat);
  bellyM.scale.set(1.1, 0.5, 0.7); bellyM.position.set(0, 0.3, 0); g.add(bellyM);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), mat);
  head.position.set(0.35, 0.6, 0); g.add(head);
  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), bellyMat);
  snout.position.set(0.48, 0.55, 0); g.add(snout);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), new THREE.MeshPhongMaterial({ color: 0x222222 }));
  nose.position.set(0.55, 0.57, 0); g.add(nose);
  for (const z of [0.12, -0.12]) { const ear = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.15, 0.04), mat); ear.position.set(0.3, 0.68, z); ear.rotation.x = z > 0 ? 0.3 : -0.3; g.add(ear); }
  for (const z of [0.08, -0.08]) { const eye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), new THREE.MeshPhongMaterial({ color: 0x222222 })); eye.position.set(0.44, 0.65, z); g.add(eye); }
  for (const [x, z] of [[-0.1, 0.1], [-0.1, -0.1], [0.15, 0.1], [0.15, -0.1]] as [number, number][]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.25, 6), mat); leg.position.set(x, 0.13, z); g.add(leg); }
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.015, 0.25, 6), mat);
  tail.rotation.z = 1.2; tail.position.set(-0.35, 0.55, 0); g.add(tail);
  g.scale.setScalar(0.8); return g;
}
