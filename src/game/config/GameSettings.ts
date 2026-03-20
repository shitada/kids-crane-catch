export const GAME_SETTINGS = {
  /** クレーンの移動速度 */
  craneSpeed: 3.0,
  /** クレーン降下速度 */
  craneDescendSpeed: 4.0,
  /** クレーン上昇速度 */
  craneAscendSpeed: 3.0,
  /** クレーン戻り速度 */
  craneReturnSpeed: 4.0,
  /** キャッチ判定距離（この距離以内なら成功） */
  catchRadius: 0.7,
  /** 1プレイの回数制限 */
  maxAttempts: 3,
  /** ゲーム機内部のサイズ（X方向の半分） */
  machineHalfWidth: 3.5,
  /** ゲーム機内部のサイズ（Z方向の半分） */
  machineHalfDepth: 2.5,
  /** クレーンの高さ（レール位置） */
  craneRailHeight: 4.0,
  /** アイテムが置かれる床の高さ */
  itemFloorHeight: 0.3,
  /** クレーンの最低降下高さ */
  craneMinHeight: 0.8,
  /** ドロップボックスのX位置 */
  dropBoxX: 2.5,
  /** ドロップボックスのZ位置 */
  dropBoxZ: 1.8,
  /** ドロップボックスのY位置（上面） */
  dropBoxY: 0.6,
} as const;
