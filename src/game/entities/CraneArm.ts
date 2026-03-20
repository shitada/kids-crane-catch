import * as THREE from 'three';
import { GAME_SETTINGS } from '../config/GameSettings';
import type { CraneState } from '../../types';

/**
 * クレーンアーム（二本爪リアル型）
 * 待機時は開いた状態 → つかむ時に閉じる → ボックスへ移動 → 開いて落とす
 */
export class CraneArm {
  readonly group = new THREE.Group();
  private wireGroup = new THREE.Group();
  private clawGroup = new THREE.Group();
  private wire: THREE.Mesh;
  private leftArm = new THREE.Group();
  private rightArm = new THREE.Group();

  state: CraneState = 'IDLE';
  readonly position = { x: 0, z: 0 };
  private clawHeight: number = GAME_SETTINGS.craneRailHeight;
  private targetClawHeight: number = GAME_SETTINGS.craneRailHeight;

  /** 0 = closed, 1 = fully open */
  private openAmount = 1.0;
  private targetOpenAmount = 1.0;
  private static readonly OPEN_CLOSE_SPEED = 4.0;
  private static readonly MAX_OPEN_ANGLE = 0.45;

  /** Attached (caught) item that follows the claw */
  private attachedItem: THREE.Group | null = null;

  /** Callback: item dropped into the box */
  onDropInBox: ((item: THREE.Group) => void) | null = null;
  onGrabComplete: ((pos: THREE.Vector3) => void) | null = null;
  onReturnComplete: (() => void) | null = null;

  private armColor: number;

  constructor(themeColor?: number) {
    this.armColor = themeColor ?? 0xffcc00;
    this.buildCarriage();
    this.wire = this.buildWire();
    this.buildClaw();
    this.group.add(this.wireGroup);
    this.group.add(this.clawGroup);
    this.updateVisual();
  }

  private buildCarriage(): void {
    const mat = new THREE.MeshPhongMaterial({ color: 0xdddddd });
    const geo = new THREE.BoxGeometry(0.7, 0.2, 0.7);
    const carriage = new THREE.Mesh(geo, mat);
    carriage.position.set(0, GAME_SETTINGS.craneRailHeight + 0.1, 0);
    this.group.add(carriage);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.2, 0.04, 8, 16),
      new THREE.MeshPhongMaterial({ color: 0xffcc00 }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, GAME_SETTINGS.craneRailHeight + 0.22, 0);
    this.group.add(ring);
  }

  private buildWire(): THREE.Mesh {
    const mat = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
    const geo = new THREE.CylinderGeometry(0.025, 0.025, 1, 6);
    const wire = new THREE.Mesh(geo, mat);
    this.wireGroup.add(wire);
    return wire;
  }

  /** 二本爪クロー構築 */
  private buildClaw(): void {
    const shoulder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.22, 12),
      new THREE.MeshPhongMaterial({ color: 0xcccccc }),
    );
    shoulder.position.y = 0.11;
    this.clawGroup.add(shoulder);

    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.35, 6),
      new THREE.MeshPhongMaterial({ color: 0x888888 }),
    );
    bolt.rotation.z = Math.PI / 2;
    bolt.position.y = 0.11;
    this.clawGroup.add(bolt);

    this.buildArmAssembly(this.leftArm, -1);
    this.buildArmAssembly(this.rightArm, 1);
    this.leftArm.position.set(-0.12, 0, 0);
    this.rightArm.position.set(0.12, 0, 0);
    this.clawGroup.add(this.leftArm);
    this.clawGroup.add(this.rightArm);
  }

  /** 1本のアーム：上腕→肘球→前腕→フック＋赤ゴム */
  private buildArmAssembly(armGroup: THREE.Group, side: number): void {
    const armMat = new THREE.MeshPhongMaterial({ color: this.armColor, shininess: 80 });
    const jointMat = new THREE.MeshPhongMaterial({ color: 0xdddddd, shininess: 80 });
    const tipMat = new THREE.MeshPhongMaterial({ color: 0xffaa00, shininess: 60 });
    const rubberMat = new THREE.MeshPhongMaterial({ color: 0xdd3333, shininess: 20 });

    const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.4, 0.07), armMat);
    upperArm.position.y = -0.2;
    armGroup.add(upperArm);

    const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), jointMat);
    elbow.position.y = -0.4;
    armGroup.add(elbow);

    const forearmGroup = new THREE.Group();
    forearmGroup.position.y = -0.4;
    forearmGroup.rotation.z = -side * 0.18;

    const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.28, 0.06), armMat);
    forearm.position.y = -0.14;
    forearmGroup.add(forearm);

    const hookGroup = new THREE.Group();
    hookGroup.position.y = -0.28;
    hookGroup.rotation.z = -side * 0.5;

    const hookStem = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.13, 0.06), tipMat);
    hookStem.position.y = -0.065;
    hookGroup.add(hookStem);

    const hookTip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 0.06), tipMat);
    hookTip.position.set(-side * 0.05, -0.13, 0);
    hookGroup.add(hookTip);

    const rubberPad = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.07), rubberMat);
    rubberPad.position.set(-side * 0.05, -0.16, 0);
    hookGroup.add(rubberPad);

    forearmGroup.add(hookGroup);
    armGroup.add(forearmGroup);
  }

  move(dx: number, dz: number): void {
    if (this.state !== 'IDLE' && this.state !== 'MOVING') return;
    this.state = 'MOVING';
    const hw = GAME_SETTINGS.machineHalfWidth - 0.5;
    const hd = GAME_SETTINGS.machineHalfDepth - 0.5;
    this.position.x = Math.max(-hw, Math.min(hw, this.position.x + dx));
    this.position.z = Math.max(-hd, Math.min(hd, this.position.z + dz));
    this.updateVisual();
  }

  stopMoving(): void {
    if (this.state === 'MOVING') this.state = 'IDLE';
  }

  startDescent(): void {
    if (this.state !== 'IDLE' && this.state !== 'MOVING') return;
    this.state = 'DESCENDING';
    this.targetClawHeight = GAME_SETTINGS.craneMinHeight;
    this.targetOpenAmount = 1.0;
  }

  update(deltaTime: number): void {
    // スムーズ開閉アニメーション
    if (this.openAmount !== this.targetOpenAmount) {
      const diff = this.targetOpenAmount - this.openAmount;
      const step = CraneArm.OPEN_CLOSE_SPEED * deltaTime;
      if (Math.abs(diff) < step) {
        this.openAmount = this.targetOpenAmount;
      } else {
        this.openAmount += Math.sign(diff) * step;
      }
    }

    switch (this.state) {
      case 'DESCENDING':
        this.clawHeight -= GAME_SETTINGS.craneDescendSpeed * deltaTime;
        if (this.clawHeight <= this.targetClawHeight) {
          this.clawHeight = this.targetClawHeight;
          this.state = 'GRABBING';
          this.targetOpenAmount = 0;
          setTimeout(() => {
            const grabPos = new THREE.Vector3(this.position.x, this.clawHeight, this.position.z);
            this.onGrabComplete?.(grabPos);
            this.state = 'ASCENDING';
            this.targetClawHeight = GAME_SETTINGS.craneRailHeight;
          }, 400);
        }
        break;

      case 'ASCENDING':
        this.clawHeight += GAME_SETTINGS.craneAscendSpeed * deltaTime;
        if (this.clawHeight >= GAME_SETTINGS.craneRailHeight) {
          this.clawHeight = GAME_SETTINGS.craneRailHeight;
          this.state = 'RETURNING';
        }
        break;

      case 'RETURNING': {
        // アイテム保持中→ドロップボックスへ、なければ中央へ
        const targetX = this.attachedItem ? GAME_SETTINGS.dropBoxX : 0;
        const targetZ = this.attachedItem ? GAME_SETTINGS.dropBoxZ : 0;
        const spd = GAME_SETTINGS.craneReturnSpeed * deltaTime;
        const dx = targetX - this.position.x;
        const dz = targetZ - this.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < spd) {
          this.position.x = targetX;
          this.position.z = targetZ;
          if (this.attachedItem) {
            // ボックス到着→アームを開いて落とす
            this.state = 'DROPPING';
            this.targetOpenAmount = 1.0;
          } else {
            // 中央到着→待機
            this.state = 'IDLE';
            this.targetOpenAmount = 1.0;
            this.onReturnComplete?.();
          }
        } else {
          this.position.x += (dx / dist) * spd;
          this.position.z += (dz / dist) * spd;
        }
        break;
      }

      case 'DROPPING':
        // アームが十分開いたらアイテムを落とす
        if (this.openAmount > 0.6) {
          const item = this.detachItem();
          if (item) {
            this.onDropInBox?.(item);
          }
          // 中央へ戻る（attachedItem=nullなのでRETURNINGは中央を目指す）
          this.state = 'RETURNING';
        }
        break;
    }

    // アタッチ中のアイテムがアームに追従
    if (this.attachedItem) {
      const wp = this.getClawWorldPosition();
      this.attachedItem.position.set(wp.x, wp.y, wp.z);
    }

    this.updateVisual();
  }

  private updateVisual(): void {
    const railH = GAME_SETTINGS.craneRailHeight;
    this.group.position.set(this.position.x, 0, this.position.z);

    const wireLen = railH - this.clawHeight;
    this.wire.scale.y = Math.max(wireLen, 0.01);
    this.wire.position.set(0, railH - wireLen / 2, 0);

    this.clawGroup.position.set(0, this.clawHeight, 0);

    // 左アーム: 負方向(外側へ開く) / 右アーム: 正方向(外側へ開く)
    const angle = this.openAmount * CraneArm.MAX_OPEN_ANGLE;
    this.leftArm.rotation.z = -angle;
    this.rightArm.rotation.z = angle;
  }

  attachItem(item: THREE.Group, scene: THREE.Scene): void {
    if (this.attachedItem) return;
    this.attachedItem = item;
    scene.add(item);
    const wp = this.getClawWorldPosition();
    item.position.set(wp.x, wp.y, wp.z);
  }

  detachItem(): THREE.Group | null {
    const item = this.attachedItem;
    this.attachedItem = null;
    return item;
  }

  hasAttachedItem(): boolean {
    return this.attachedItem !== null;
  }

  getAttachedItem(): THREE.Group | null {
    return this.attachedItem;
  }

  isGrabbing(): boolean {
    return this.targetOpenAmount === 0 && this.openAmount < 0.3;
  }

  isIdle(): boolean {
    return this.state === 'IDLE';
  }

  getClawWorldPosition(): THREE.Vector3 {
    return new THREE.Vector3(this.position.x, this.clawHeight - 0.7, this.position.z);
  }

  reset(): void {
    this.state = 'IDLE';
    this.position.x = 0;
    this.position.z = 0;
    this.clawHeight = GAME_SETTINGS.craneRailHeight;
    this.targetClawHeight = GAME_SETTINGS.craneRailHeight;
    this.openAmount = 1.0;
    this.targetOpenAmount = 1.0;
    this.detachItem();
    this.updateVisual();
  }
}
