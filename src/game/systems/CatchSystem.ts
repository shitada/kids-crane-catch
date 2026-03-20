import * as THREE from 'three';
import type { PlacedItem } from '../entities/ItemPool';
import { GAME_SETTINGS } from '../config/GameSettings';

/**
 * キャッチ判定ロジック
 */
export class CatchSystem {
  /** 距離ベースでキャッチ判定 */
  evaluate(grabPosition: THREE.Vector3, items: PlacedItem[]): PlacedItem | null {
    let closest: PlacedItem | null = null;
    let minDist: number = GAME_SETTINGS.catchRadius;

    for (const item of items) {
      if (item.caught) continue;
      // XZ平面上の距離で判定
      const dist = Math.sqrt(
        (grabPosition.x - item.position.x) ** 2 +
        (grabPosition.z - item.position.z) ** 2,
      );
      if (dist < minDist) {
        minDist = dist;
        closest = item;
      }
    }

    return closest;
  }
}
