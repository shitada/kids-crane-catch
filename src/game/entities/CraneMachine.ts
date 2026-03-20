import * as THREE from 'three';
import { GAME_SETTINGS } from '../config/GameSettings';

/**
 * クレーンゲーム機の筐体3Dモデル
 */
export class CraneMachine {
  readonly group = new THREE.Group();

  constructor() {
    this.buildCase();
    this.buildGlass();
    this.buildRails();
    this.buildFloor();
    this.buildChute();
    this.buildDecorations();
  }

  /** 筐体フレーム（不透明外枠） */
  private buildCase(): void {
    const hw = GAME_SETTINGS.machineHalfWidth;
    const hd = GAME_SETTINGS.machineHalfDepth;
    const h = GAME_SETTINGS.craneRailHeight + 1.0;
    const frameMat = new THREE.MeshPhongMaterial({ color: 0x6622aa });

    // 4本の柱
    const pillarGeo = new THREE.BoxGeometry(0.3, h, 0.3);
    const positions = [
      [-hw, h / 2, -hd],
      [hw, h / 2, -hd],
      [-hw, h / 2, hd],
      [hw, h / 2, hd],
    ];
    for (const [x, y, z] of positions) {
      const pillar = new THREE.Mesh(pillarGeo, frameMat);
      pillar.position.set(x, y, z);
      this.group.add(pillar);
    }

    // 天井
    const topGeo = new THREE.BoxGeometry(hw * 2 + 0.3, 0.2, hd * 2 + 0.3);
    const top = new THREE.Mesh(topGeo, frameMat);
    top.position.set(0, h, 0);
    this.group.add(top);

    // 底板（筐体の土台）
    const baseGeo = new THREE.BoxGeometry(hw * 2 + 0.6, 0.3, hd * 2 + 0.6);
    const baseMat = new THREE.MeshPhongMaterial({ color: 0x4411aa });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, -0.15, 0);
    this.group.add(base);
  }

  /** 半透明ガラスパネル */
  private buildGlass(): void {
    const hw = GAME_SETTINGS.machineHalfWidth;
    const hd = GAME_SETTINGS.machineHalfDepth;
    const h = GAME_SETTINGS.craneRailHeight + 0.8;

    const glassMat = new THREE.MeshPhongMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });

    // 正面（手前）
    const frontGeo = new THREE.PlaneGeometry(hw * 2, h);
    const front = new THREE.Mesh(frontGeo, glassMat);
    front.position.set(0, h / 2, hd);
    this.group.add(front);

    // 背面
    const back = new THREE.Mesh(frontGeo, glassMat);
    back.position.set(0, h / 2, -hd);
    back.rotation.y = Math.PI;
    this.group.add(back);

    // 左右
    const sideGeo = new THREE.PlaneGeometry(hd * 2, h);
    const left = new THREE.Mesh(sideGeo, glassMat);
    left.position.set(-hw, h / 2, 0);
    left.rotation.y = Math.PI / 2;
    this.group.add(left);

    const right = new THREE.Mesh(sideGeo, glassMat);
    right.position.set(hw, h / 2, 0);
    right.rotation.y = -Math.PI / 2;
    this.group.add(right);
  }

  /** クレーンのレール（上部） */
  private buildRails(): void {
    const hw = GAME_SETTINGS.machineHalfWidth;
    const hd = GAME_SETTINGS.machineHalfDepth;
    const rh = GAME_SETTINGS.craneRailHeight;
    const railMat = new THREE.MeshPhongMaterial({ color: 0xcccccc });

    // X方向レール（2本）
    const xRailGeo = new THREE.BoxGeometry(hw * 2, 0.1, 0.1);
    for (const z of [-hd + 0.3, hd - 0.3]) {
      const rail = new THREE.Mesh(xRailGeo, railMat);
      rail.position.set(0, rh, z);
      this.group.add(rail);
    }
  }

  /** 床面 */
  private buildFloor(): void {
    const hw = GAME_SETTINGS.machineHalfWidth;
    const hd = GAME_SETTINGS.machineHalfDepth;    const floorGeo = new THREE.PlaneGeometry(hw * 2, hd * 2);
    const floorMat = new THREE.MeshPhongMaterial({ color: 0x331166 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    this.group.add(floor);
  }

  /** アイテム取り出し口 */
  private buildChute(): void {
    const hw = GAME_SETTINGS.machineHalfWidth;
    const hd = GAME_SETTINGS.machineHalfDepth;

    // 取り出し口（正面右下に穴）
    const chuteMat = new THREE.MeshPhongMaterial({ color: 0x222222 });
    const chuteGeo = new THREE.BoxGeometry(1.5, 1.0, 0.4);
    const chute = new THREE.Mesh(chuteGeo, chuteMat);
    chute.position.set(hw - 1.0, 0.5, hd + 0.15);
    this.group.add(chute);

    // ドロップボックス（アイテムを落とす箱）
    const boxX = GAME_SETTINGS.dropBoxX;
    const boxZ = GAME_SETTINGS.dropBoxZ;
    const boxW = 1.4;
    const boxD = 1.2;
    const boxH = 0.6;
    const wallThick = 0.06;
    const boxMat = new THREE.MeshPhongMaterial({ color: 0x553399, transparent: true, opacity: 0.6 });

    // 底面
    const boxBottom = new THREE.Mesh(new THREE.BoxGeometry(boxW, wallThick, boxD), boxMat);
    boxBottom.position.set(boxX, wallThick / 2, boxZ);
    this.group.add(boxBottom);

    // 4辺の壁
    const wallFB = new THREE.BoxGeometry(boxW, boxH, wallThick);
    const wallLR = new THREE.BoxGeometry(wallThick, boxH, boxD);

    const boxFront = new THREE.Mesh(wallFB, boxMat);
    boxFront.position.set(boxX, boxH / 2, boxZ + boxD / 2);
    this.group.add(boxFront);

    const boxBack = new THREE.Mesh(wallFB, boxMat);
    boxBack.position.set(boxX, boxH / 2, boxZ - boxD / 2);
    this.group.add(boxBack);

    const boxLeft = new THREE.Mesh(wallLR, boxMat);
    boxLeft.position.set(boxX - boxW / 2, boxH / 2, boxZ);
    this.group.add(boxLeft);

    const boxRight = new THREE.Mesh(wallLR, boxMat);
    boxRight.position.set(boxX + boxW / 2, boxH / 2, boxZ);
    this.group.add(boxRight);
  }

  /** カラフルな装飾 */
  private buildDecorations(): void {
    const hw = GAME_SETTINGS.machineHalfWidth;
    const hd = GAME_SETTINGS.machineHalfDepth;
    const h = GAME_SETTINGS.craneRailHeight + 1.0;

    // 看板（天井の上）
    const signGeo = new THREE.BoxGeometry(hw * 1.6, 0.8, 0.1);
    const signMat = new THREE.MeshPhongMaterial({ color: 0xff6699 });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, h + 0.5, hd + 0.1);
    this.group.add(sign);

    // 看板のライト球（3つ）
    const lightColors = [0xff4444, 0xffdd44, 0x44ff44];
    const lightGeo = new THREE.SphereGeometry(0.15, 8, 8);
    for (let i = 0; i < 3; i++) {
      const mat = new THREE.MeshPhongMaterial({
        color: lightColors[i],
        emissive: lightColors[i],
        emissiveIntensity: 0.5,
      });
      const light = new THREE.Mesh(lightGeo, mat);
      light.position.set(-1.5 + i * 1.5, h + 0.9, hd + 0.2);
      this.group.add(light);
    }
  }
}
