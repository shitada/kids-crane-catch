import * as THREE from 'three';

export function createCastle(): THREE.Group {
  const g = new THREE.Group();
  const wallMat = new THREE.MeshPhongMaterial({ color: 0xeeeedd });
  const roofMat = new THREE.MeshPhongMaterial({ color: 0x334455 });
  const baseMat = new THREE.MeshPhongMaterial({ color: 0x888877 });
  // 石垣
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.6), baseMat);
  base.position.y = 0.12; g.add(base);
  // 1階
  const f1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.25, 0.45), wallMat);
  f1.position.y = 0.37; g.add(f1);
  const r1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.55), roofMat);
  r1.position.y = 0.52; g.add(r1);
  // 2階
  const f2 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.2, 0.35), wallMat);
  f2.position.y = 0.65; g.add(f2);
  const r2 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 0.45), roofMat);
  r2.position.y = 0.78; g.add(r2);
  // 天守
  const top = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.25), wallMat);
  top.position.y = 0.88; g.add(top);
  const rTop = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.12, 4), roofMat);
  rTop.rotation.y = Math.PI / 4; rTop.position.y = 1.0; g.add(rTop);
  // 金のシャチホコ
  const shachi = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), new THREE.MeshPhongMaterial({ color: 0xffdd00 }));
  shachi.position.y = 1.08; g.add(shachi);
  g.scale.setScalar(0.8); return g;
}

export function createTorii(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0xcc2211 });
  // 柱2本
  for (const z of [0.25, -0.25]) { const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.0, 8), mat); pillar.position.set(0, 0.5, z); g.add(pillar); }
  // 笠木（上の横棒）
  const kasagi = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.7), mat);
  kasagi.position.set(0, 1.02, 0); g.add(kasagi);
  // 島木
  const shimagi = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.6), mat);
  shimagi.position.set(0, 0.92, 0); g.add(shimagi);
  // 額束
  const gakuzuka = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.1, 0.12), new THREE.MeshPhongMaterial({ color: 0x222222 }));
  gakuzuka.position.set(0, 0.88, 0); g.add(gakuzuka);
  g.scale.setScalar(0.8); return g;
}

export function createFujisan(): THREE.Group {
  const g = new THREE.Group();
  const mountMat = new THREE.MeshPhongMaterial({ color: 0x4466aa });
  const snowMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
  // 山
  const mount = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.9, 12), mountMat);
  mount.position.y = 0.45; g.add(mount);
  // 雪
  const snow = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.2, 12), snowMat);
  snow.position.y = 0.8; g.add(snow);
  // 雲
  for (const [x, z] of [[0.4, 0.1], [-0.3, -0.1]] as [number, number][]) {
    const cloud = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }));
    cloud.scale.set(1.5, 0.6, 1.0); cloud.position.set(x, 0.55, z); g.add(cloud);
  }
  g.scale.setScalar(0.8); return g;
}

export function createSakuramochi(): THREE.Group {
  const g = new THREE.Group();
  const mochiMat = new THREE.MeshPhongMaterial({ color: 0xff88aa });
  const leafMat = new THREE.MeshPhongMaterial({ color: 0x448833 });
  // 餅
  const mochi = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), mochiMat);
  mochi.scale.set(1.2, 0.8, 1.0); mochi.position.y = 0.3; g.add(mochi);
  // 葉
  const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 0.25), leafMat);
  leaf.position.y = 0.3; leaf.rotation.z = 0.1; g.add(leaf);
  // 皿
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.22, 0.04, 12), new THREE.MeshPhongMaterial({ color: 0xeeeecc }));
  plate.position.y = 0.12; g.add(plate);
  g.scale.setScalar(0.95); return g;
}

export function createKoinobori(): THREE.Group {
  const g = new THREE.Group();
  const poleMat = new THREE.MeshPhongMaterial({ color: 0x888888 });
  // ポール
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 1.2, 6), poleMat);
  pole.position.set(-0.4, 0.6, 0); g.add(pole);
  // 矢車
  const yaguruma = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), new THREE.MeshPhongMaterial({ color: 0xffdd00 }));
  yaguruma.position.set(-0.4, 1.22, 0); g.add(yaguruma);
  // 鯉3匹
  const colors = [0x111111, 0xcc2222, 0x2266cc];
  for (let i = 0; i < 3; i++) {
    const fishMat = new THREE.MeshPhongMaterial({ color: colors[i] });
    const fish = new THREE.Mesh(new THREE.CylinderGeometry(0.06 - i * 0.01, 0.08 - i * 0.01, 0.4 - i * 0.05, 8), fishMat);
    fish.rotation.z = Math.PI / 2;
    fish.position.set(-0.15, 1.05 - i * 0.2, 0);
    g.add(fish);
    // 尾
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.06 - i * 0.01, 0.1, 4), fishMat);
    tail.rotation.z = Math.PI / 2; tail.position.set(-0.38, 1.05 - i * 0.2, 0); g.add(tail);
    // 目
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshPhongMaterial({ color: 0xffffff }));
    eye.position.set(0.05, 1.08 - i * 0.2, 0.06); g.add(eye);
  }
  g.scale.setScalar(0.75); return g;
}

export function createDaruma(): THREE.Group {
  const g = new THREE.Group();
  const red = new THREE.MeshPhongMaterial({ color: 0xcc2211 });
  const white = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const gold = new THREE.MeshPhongMaterial({ color: 0xffdd00 });
  // 体
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 10), red);
  body.scale.set(0.9, 1.0, 0.85); body.position.y = 0.35; g.add(body);
  // 顔の白い部分
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.15, 12), white);
  face.position.set(0.26, 0.45, 0); g.add(face);
  // 目の枠
  for (const y of [0.5, 0.4]) { const eyeFrame = new THREE.Mesh(new THREE.CircleGeometry(0.05, 10), white); eyeFrame.position.set(0.28, y, 0.06); g.add(eyeFrame); }
  // 金の模様（額）
  const goldLine = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.03, 0.2), gold);
  goldLine.position.set(0.28, 0.55, 0); g.add(goldLine);
  // 底面の安定
  const bottom = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.04, 10), red);
  bottom.position.y = 0.08; g.add(bottom);
  g.scale.setScalar(0.9); return g;
}

export function createChochin(): THREE.Group {
  const g = new THREE.Group();
  const paperMat = new THREE.MeshPhongMaterial({ color: 0xee4422, transparent: true, opacity: 0.85 });
  const frameMat = new THREE.MeshPhongMaterial({ color: 0x222222 });
  // 提灯本体
  const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 10), paperMat);
  lantern.scale.set(0.8, 1.2, 0.8); lantern.position.y = 0.5; g.add(lantern);
  // 上下の枠
  const topRim = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.04, 10), frameMat);
  topRim.position.y = 0.78; g.add(topRim);
  const botRim = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.04, 10), frameMat);
  botRim.position.y = 0.22; g.add(botRim);
  // 吊り紐
  const string = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.2, 4), frameMat);
  string.position.y = 0.9; g.add(string);
  // 横線の骨
  for (let i = 0; i < 4; i++) { const rib = new THREE.Mesh(new THREE.TorusGeometry(0.18 + (i % 2) * 0.02, 0.008, 4, 12), frameMat); rib.rotation.x = Math.PI / 2; rib.position.y = 0.35 + i * 0.12; g.add(rib); }
  // 文字「祭」の代わりに装飾
  const kanji = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.1), new THREE.MeshPhongMaterial({ color: 0x111111 }));
  kanji.position.set(0.2, 0.5, 0); g.add(kanji);
  g.scale.setScalar(0.85); return g;
}

export function createManekiNeko(): THREE.Group {
  const g = new THREE.Group();
  const white = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const orange = new THREE.MeshPhongMaterial({ color: 0xee8833 });
  const gold = new THREE.MeshPhongMaterial({ color: 0xffdd00 });
  // 体
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), white);
  body.scale.set(0.9, 1.1, 0.8); body.position.y = 0.35; g.add(body);
  // 頭
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), white);
  head.position.set(0, 0.7, 0); g.add(head);
  // 耳
  for (const z of [0.1, -0.1]) { const ear = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.1, 4), white); ear.position.set(-0.02, 0.9, z); g.add(ear); }
  // 目
  for (const z of [0.08, -0.08]) { const eye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), new THREE.MeshPhongMaterial({ color: 0x222222 })); eye.position.set(0.14, 0.74, z); g.add(eye); }
  // 鼻
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshPhongMaterial({ color: 0xff6666 }));
  nose.position.set(0.18, 0.68, 0); g.add(nose);
  // 右手（招き手、上げている）
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.25, 6), white);
  arm.position.set(0.15, 0.65, 0.2); arm.rotation.x = -0.8; g.add(arm);
  // 小判（金）
  const koban = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 8), gold);
  koban.position.set(0.1, 0.4, -0.2); koban.rotation.x = Math.PI / 2; g.add(koban);
  // 首輪
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.02, 6, 12), new THREE.MeshPhongMaterial({ color: 0xcc2222 }));
  collar.rotation.x = Math.PI / 2; collar.position.y = 0.58; g.add(collar);
  // 鈴
  const bell = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), gold);
  bell.position.set(0.12, 0.53, 0); g.add(bell);
  // 模様
  const spot = new THREE.Mesh(new THREE.CircleGeometry(0.06, 8), orange);
  spot.position.set(-0.1, 0.4, 0.2); g.add(spot);
  g.scale.setScalar(0.85); return g;
}
