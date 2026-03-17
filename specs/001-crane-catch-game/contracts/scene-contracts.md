# Scene Contracts: クレーンキャッチゲーム

**Phase**: 1 — Design & Contracts  
**Date**: 2026-03-17

## Scene Interface（共通）

universe-kids-race の Scene インターフェースを踏襲。

```typescript
type SceneType = 'title' | 'categorySelect' | 'craneGame' | 'result' | 'zukan';

interface SceneContext {
  categoryId?: string;
  catchResult?: CatchResult;
}

interface Scene {
  enter(context: SceneContext): void;
  update(deltaTime: number): void;
  exit(): void;
  getThreeScene(): THREE.Scene;
  getCamera(): THREE.Camera;
}
```

## Scene Transitions

```
title ──「あそぶ」──→ categorySelect
title ──「ずかん」──→ zukan
categorySelect ──カテゴリ選択──→ craneGame { categoryId }
craneGame ──キャッチ完了──→ result { categoryId, catchResult }
result ──「もういっかい」──→ craneGame { categoryId }
result ──「ずかん」──→ zukan
result ──「もどる」──→ title
zukan ──「もどる」──→ title
```

## Scene Details

### TitleScene

**入力**: なし  
**表示要素**:
- ゲームタイトル（ひらがな）
- 「あそぶ」ボタン → `categorySelect` へ遷移
- 「ずかん」ボタン → `zukan` へ遷移
- 背景アニメーション（装飾的な3D要素）

**出力遷移**:
| Action | Target | Context |
|--------|--------|---------|
| 「あそぶ」タップ | `categorySelect` | `{}` |
| 「ずかん」タップ | `zukan` | `{}` |

---

### CategorySelectScene

**入力**: `SceneContext {}` （追加コンテキスト不要）  
**表示要素**:
- カテゴリ一覧（CategoryRegistry.getAll()）
- 各カテゴリ: アイコン + 名前（ひらがな） + ロック状態
- 解放済みカテゴリはタップ可能
- 未解放カテゴリは「きんきゅう」ラベル付きグレーアウト
- 「もどる」ボタン

**出力遷移**:
| Action | Target | Context |
|--------|--------|---------|
| 解放済みカテゴリタップ | `craneGame` | `{ categoryId }` |
| 「もどる」タップ | `title` | `{}` |

---

### CraneGameScene

**入力**: `SceneContext { categoryId: string }`  
**表示要素**:
- 3D クレーン筐体（上部レール + アーム + ガラスケース風枠）
- 配置されたアイテム群（SpawnSystem が categoryId に基づきランダム配置）
- 操作UI（上下左右ボタン + キャッチボタン）← HTML overlay（十字配置）
- チュートリアル（初回のみ、TutorialSystem 制御）

**ゲームフロー**:
1. 入場時: アイテムをX-Z平面にランダム配置
2. 操作フェーズ: クレーンを上下左右（X-Z 2軸）に移動
3. キャッチ: ボタンタップ → リング下降 → X-Z 2D距離で掴み判定 → 上昇
4. 結果判定: CatchSystem が成功/失敗を決定
5. 遷移: result シーンへ

**出力遷移**:
| Action | Target | Context |
|--------|--------|---------|
| キャッチ完了 | `result` | `{ categoryId, catchResult }` |

---

### ResultScene

**入力**: `SceneContext { categoryId: string, catchResult: CatchResult }`  
**表示要素**:
- 成功時: キャッチしたアイテムの3Dモデル + 名前 + お祝いエフェクト
  - 新規アイテム: 「ずかんに とうろく したよ！」
  - 既取得: 「もう つかまえたよ！」
- 失敗時: 励ましメッセージ（「おしい！もういっかい やってみよう！」）
- 「もういっかい」ボタン
- 「ずかん」ボタン
- 「もどる」ボタン

**出力遷移**:
| Action | Target | Context |
|--------|--------|---------|
| 「もういっかい」タップ | `craneGame` | `{ categoryId }` |
| 「ずかん」タップ | `zukan` | `{}` |
| 「もどる」タップ | `title` | `{}` |

---

### ZukanScene（図鑑）

**入力**: `SceneContext {}` （追加コンテキスト不要）  
**表示要素**:
- カテゴリタブ（横スクロール）
- アイテムグリッド:
  - 取得済み: カラー表示、タップで詳細
  - 未取得: シルエット + ？マーク
- 詳細オーバーレイ（ZukanOverlay）:
  - 3Dモデル回転表示
  - ひらがな説明文
  - レアリティ表示
- カテゴリコンプリート時: 特別演出
- 「もどる」ボタン

**出力遷移**:
| Action | Target | Context |
|--------|--------|---------|
| 「もどる」タップ | `title` | `{}` |

## System Contracts

### InputSystem

```typescript
interface MoveDirection {
  x: -1 | 0 | 1;  // 左: -1, なし: 0, 右: 1
  z: -1 | 0 | 1;  // 手前: -1, なし: 0, 奥: 1
}

interface InputState {
  moveDirection: MoveDirection;  // X-Z 2軸方向
  catchPressed: boolean;          // キャッチボタン押下
}

interface InputSystem {
  initialize(container: HTMLElement): void;
  getState(): InputState;
  setMoveDirection(direction: MoveDirection): void;
  reset(): void;
  dispose(): void;
}
```

### CatchSystem

```typescript
interface CatchSystem {
  /**
   * クレーンのX-Z位置とアイテム群からキャッチ判定を行う
   * X-Z平面のユークリッド距離で判定
   * @returns キャッチ結果（成功時はアイテム情報含む）
   */
  evaluate(
    craneX: number,
    craneZ: number,
    grabRadius: number,
    items: readonly SpawnedItem[],
    baseCatchRate: number,
  ): CatchResult;
}
```

### SpawnSystem

```typescript
interface SpawnSystem {
  /**
   * カテゴリ内のアイテムからランダムに選択・配置
   * @returns 配置されたアイテム群（X-Z平面上にランダム配置）
   */
  spawnItems(
    categoryId: string,
    count: number,
    areaWidth: number,
    areaDepth: number,
  ): SpawnedItem[];
}
```

### PhysicsSystem

```typescript
interface PhysicsSystem {
  /** X軸のみの移動（後方互換） */
  moveHorizontal(currentX: number, direction: number, deltaTime: number): number;

  /** X-Z 2軸移動 */
  moveXZ(
    currentX: number,
    currentZ: number,
    dirX: number,
    dirZ: number,
    deltaTime: number,
  ): { x: number; z: number };

  drop(currentY: number, deltaTime: number): number;
  lift(currentY: number, deltaTime: number): number;
}
```

### HUD

```typescript
interface HUD {
  /** 上下左右 + キャッチの5ボタン（十字配置） */
  onMove: ((direction: { x: -1 | 0 | 1; z: -1 | 0 | 1 }) => void) | null;
  onCatch: (() => void) | null;
  setCatchEnabled(enabled: boolean): void;
  dispose(): void;
}
```

### AudioManager

```typescript
type SFXType =
  | 'catchSuccess'
  | 'catchFail'
  | 'buttonTap'
  | 'craneMove'
  | 'armDrop'
  | 'complete'
  | 'transition';

interface AudioManager {
  initialize(): void;
  playSFX(type: SFXType): void;
  playBGM(): void;
  stopBGM(): void;
  setBGMEnabled(enabled: boolean): void;
  setSFXEnabled(enabled: boolean): void;
  resume(): Promise<void>;  // Safari AudioContext resume
  dispose(): void;
}
```

### SaveManager

```typescript
interface SaveManager {
  load(): SaveData;
  save(data: SaveData): boolean;  // false if storage unavailable
  addToCollection(itemId: string): void;
  isCollected(itemId: string): boolean;
  getCollection(): ReadonlyMap<string, CollectionEntry>;
  isTutorialCompleted(): boolean;
  setTutorialCompleted(): void;
  getSettings(): GameSettings;
  updateSettings(settings: Partial<GameSettings>): void;
}
```
