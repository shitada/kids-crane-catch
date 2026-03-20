import * as THREE from 'three';
import type { VehicleId } from '../../types';
import { createVehicleModel } from './vehicles/VehicleFactory';
import { GAME_SETTINGS } from '../config/GameSettings';

export interface PlacedItem {
  id: VehicleId;
  model: THREE.Group;
  position: THREE.Vector3;
  caught: boolean;
}

/**
 * ゲーム機内のアイテム配置を管理する
 */
export class ItemPool {
  private items: PlacedItem[] = [];

  /** アイテムを配置して3Dモデルのグループを返す */
  populate(itemIds: VehicleId[], scene: THREE.Scene): PlacedItem[] {
    this.clear(scene);
    const hw = GAME_SETTINGS.machineHalfWidth - 0.8;
    const hd = GAME_SETTINGS.machineHalfDepth - 0.6;
    const floorY = GAME_SETTINGS.itemFloorHeight;

    const positions: THREE.Vector3[] = [];

    for (const id of itemIds) {
      const model = createVehicleModel(id);
      let pos: THREE.Vector3;
      let attempts = 0;

      // 重なり防止：他のアイテムと最低距離を確保
      do {
        pos = new THREE.Vector3(
          (Math.random() * 2 - 1) * hw,
          floorY,
          (Math.random() * 2 - 1) * hd,
        );
        attempts++;
      } while (attempts < 50 && positions.some(p => p.distanceTo(pos) < 1.0));

      positions.push(pos);
      model.position.copy(pos);
      model.rotation.y = Math.random() * Math.PI * 2;
      scene.add(model);

      this.items.push({ id, model, position: pos, caught: false });
    }

    return this.items;
  }

  /** 指定位置に最も近い未キャッチのアイテムを探す */
  findClosest(pos: THREE.Vector3, maxDist: number): PlacedItem | null {
    let closest: PlacedItem | null = null;
    let minDist = maxDist;

    for (const item of this.items) {
      if (item.caught) continue;
      const dist = item.position.distanceTo(new THREE.Vector3(pos.x, item.position.y, pos.z));
      if (dist < minDist) {
        minDist = dist;
        closest = item;
      }
    }

    return closest;
  }

  /** アイテムをキャッチ状態にする */
  markCaught(item: PlacedItem, scene: THREE.Scene): void {
    item.caught = true;
    scene.remove(item.model);
  }

  /** 全アイテムのアニメーション（ゆっくり回転） */
  update(deltaTime: number): void {
    for (const item of this.items) {
      if (!item.caught) {
        item.model.rotation.y += deltaTime * 0.5;
      }
    }
  }

  getItems(): PlacedItem[] {
    return this.items;
  }

  clear(scene: THREE.Scene): void {
    for (const item of this.items) {
      scene.remove(item.model);
    }
    this.items = [];
  }
}
