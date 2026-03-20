import * as THREE from 'three';

export function createPiano(): THREE.Group {
  const g = new THREE.Group();
  const black = new THREE.MeshPhongMaterial({ color: 0x111111 });
  const white = new THREE.MeshPhongMaterial({ color: 0xffffff });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.12, 0.5), black);
  body.position.y = 0.3;
  g.add(body);
  for (let i = 0; i < 7; i++) {
    const key = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.35), white);
    key.position.set(-0.42 + i * 0.14, 0.37, 0.05);
    g.add(key);
  }
  for (const x of [-0.35, -0.21, -0.0, 0.14, 0.28]) {
    const bk = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.2), black);
    bk.position.set(x, 0.39, -0.05);
    g.add(bk);
  }
  g.scale.setScalar(0.7);
  return g;
}

export function createGuitar(): THREE.Group {
  const g = new THREE.Group();
  const wood = new THREE.MeshPhongMaterial({ color: 0xcc8844 });
  const dark = new THREE.MeshPhongMaterial({ color: 0x663322 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), wood);
  body.scale.set(1.0, 0.3, 1.2);
  body.position.y = 0.25;
  g.add(body);
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.08, 12), dark);
  hole.position.set(0, 0.25, 0.26);
  g.add(hole);
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.6), wood);
  neck.position.set(0, 0.28, -0.5);
  neck.rotation.x = 0.1;
  g.add(neck);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.12), dark);
  head.position.set(0, 0.32, -0.82);
  g.add(head);
  g.scale.setScalar(0.7);
  return g;
}

export function createTaiko(): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.MeshPhongMaterial({ color: 0xcc3333 });
  const skin = new THREE.MeshPhongMaterial({ color: 0xeeddbb });

  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.35, 12), body);
  drum.position.y = 0.35;
  g.add(drum);
  const top = new THREE.Mesh(new THREE.CircleGeometry(0.3, 12), skin);
  top.rotation.x = -Math.PI / 2;
  top.position.y = 0.53;
  g.add(top);
  const stick = new THREE.MeshPhongMaterial({ color: 0xddaa66 });
  const s1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 4), stick);
  s1.position.set(0.25, 0.55, 0.1);
  s1.rotation.z = -0.5;
  g.add(s1);
  g.scale.setScalar(0.7);
  return g;
}

export function createTrumpet(): THREE.Group {
  const g = new THREE.Group();
  const gold = new THREE.MeshPhongMaterial({ color: 0xddaa22, shininess: 100 });

  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8), gold);
  tube.rotation.z = Math.PI / 2;
  tube.position.y = 0.35;
  g.add(tube);
  const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.15, 0.2, 10), gold);
  bell.rotation.z = Math.PI / 2;
  bell.position.set(0.45, 0.35, 0);
  g.add(bell);
  for (let i = 0; i < 3; i++) {
    const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.1, 6), gold);
    valve.position.set(-0.1 + i * 0.1, 0.45, 0);
    g.add(valve);
  }
  g.scale.setScalar(0.7);
  return g;
}

export function createViolin(): THREE.Group {
  const g = new THREE.Group();
  const wood = new THREE.MeshPhongMaterial({ color: 0xaa5522 });
  const dark = new THREE.MeshPhongMaterial({ color: 0x442211 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), wood);
  body.scale.set(0.8, 0.2, 1.2);
  body.position.y = 0.25;
  g.add(body);
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, 0.5), wood);
  neck.position.set(0, 0.28, -0.45);
  g.add(neck);
  const scroll = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), dark);
  scroll.position.set(0, 0.3, -0.72);
  g.add(scroll);
  const bow = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.7, 4), dark);
  bow.rotation.z = Math.PI / 2;
  bow.position.set(0.05, 0.35, 0.1);
  g.add(bow);
  g.scale.setScalar(0.7);
  return g;
}

export function createHarmonica(): THREE.Group {
  const g = new THREE.Group();
  const silver = new THREE.MeshPhongMaterial({ color: 0xcccccc, shininess: 100 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.15), silver);
  body.position.y = 0.3;
  g.add(body);
  for (let i = 0; i < 8; i++) {
    const hole = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.02), new THREE.MeshPhongMaterial({ color: 0x333333 }));
    hole.position.set(-0.25 + i * 0.07, 0.32, 0.08);
    g.add(hole);
  }
  g.scale.setScalar(0.7);
  return g;
}

export function createCymbal(): THREE.Group {
  const g = new THREE.Group();
  const gold = new THREE.MeshPhongMaterial({ color: 0xccaa33, shininess: 100 });

  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.02, 16), gold);
  disc.position.y = 0.5;
  g.add(disc);
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.5, 6), new THREE.MeshPhongMaterial({ color: 0x888888 }));
  stand.position.y = 0.25;
  g.add(stand);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.04, 8), new THREE.MeshPhongMaterial({ color: 0x444444 }));
  base.position.y = 0.02;
  g.add(base);
  g.scale.setScalar(0.7);
  return g;
}

export function createRecorder(): THREE.Group {
  const g = new THREE.Group();
  const cream = new THREE.MeshPhongMaterial({ color: 0xeeddbb });
  const brown = new THREE.MeshPhongMaterial({ color: 0x886633 });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.8, 8), cream);
  body.rotation.z = Math.PI / 2;
  body.position.y = 0.3;
  g.add(body);
  const mouth = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.15, 8), brown);
  mouth.rotation.z = Math.PI / 2;
  mouth.position.set(-0.47, 0.3, 0);
  g.add(mouth);
  for (let i = 0; i < 6; i++) {
    const hole = new THREE.Mesh(new THREE.CircleGeometry(0.015, 8), new THREE.MeshPhongMaterial({ color: 0x333333 }));
    hole.position.set(-0.15 + i * 0.08, 0.35, 0.045);
    g.add(hole);
  }
  g.scale.setScalar(0.7);
  return g;
}
