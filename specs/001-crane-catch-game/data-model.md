# Data Model: クレーンキャッチゲーム

**Phase**: 1 — Design & Contracts  
**Date**: 2026-03-17  
**Status**: Complete（差分更新: UFOキャッチャー型プロング, BGMシーン呼び出し, 3段階つかむ動作, BGM和音メロディ, 動物の目, 図鑑グリッド）

## Entities

### Category（カテゴリ）

ゲーム内のアイテムグループ。データ駆動で追加可能。

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | `string` | 一意のカテゴリ識別子 | `^[a-z-]+$`, 必須 |
| name | `string` | 表示名（ひらがな） | 必須、ひらがなのみ |
| icon | `string` | カテゴリアイコン（絵文字） | 必須 |
| description | `string` | カテゴリ説明（ひらがな） | 必須 |
| unlocked | `boolean` | 解放状態 | デフォルト: false |
| sortOrder | `number` | 表示順 | >= 0 |

```typescript
interface CategoryDefinition {
  readonly id: string;
  readonly name: string;        // e.g., "どうぶつ"
  readonly icon: string;        // e.g., "🦁"
  readonly description: string; // e.g., "いろんな どうぶつを つかまえよう！"
  readonly unlocked: boolean;
  readonly sortOrder: number;
}
```

### Item（アイテム）

キャッチ対象のオブジェクト。3Dモデルパラメータをデータとして保持。

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | `string` | 一意のアイテム識別子 | `^[a-z-]+$`, 必須 |
| categoryId | `string` | 所属カテゴリID | 存在するカテゴリIDを参照 |
| name | `string` | 表示名（ひらがな） | 必須 |
| description | `string` | 図鑑説明文（ひらがな） | 必須 |
| rarity | `'common' \| 'rare' \| 'legendary'` | レアリティ | 必須 |
| modelParams | `ModelParams` | 3Dモデル生成パラメータ | 必須 |
| catchDifficulty | `number` | キャッチ難易度 | 0.0〜1.0 |

```typescript
interface ItemDefinition {
  readonly id: string;
  readonly categoryId: string;
  readonly name: string;          // e.g., "らいおん"
  readonly description: string;   // e.g., "たてがみが りっぱな どうぶつの おうさま"
  readonly rarity: Rarity;
  readonly modelParams: ModelParams;
  readonly catchDifficulty: number; // 0.0(易) 〜 1.0(難)
}

type Rarity = 'common' | 'rare' | 'legendary';
```

### ModelParams（3Dモデルパラメータ）

プロシージャル3Dモデル生成用のパーツ定義。

```typescript
interface ModelParams {
  readonly parts: readonly PartDefinition[];
  readonly scale: number;         // 全体スケール
  readonly bounceAnimation: boolean; // 待機アニメーション有無
}

interface PartDefinition {
  readonly name: string;
  readonly shape: 'sphere' | 'box' | 'cylinder' | 'cone' | 'torus';
  readonly color: number;         // hex color
  readonly position: readonly [number, number, number];
  readonly scale: readonly [number, number, number];
  readonly rotation?: readonly [number, number, number];
}
```

### Crane（クレーン）

ゲーム内の操作オブジェクト。ステートマシンで動作管理。X-Z 2軸で移動可能。

| Field | Type | Description |
|-------|------|-------------|
| positionX | `number` | X軸位置（左右） |
| positionZ | `number` | Z軸位置（上下/奥行き） |
| state | `CraneState` | 現在の状態 |
| heldItem | `Item \| null` | 掴んでいるアイテム |

```typescript
type CraneState =
  | 'IDLE'        // 待機中（移動可能）
  | 'MOVING'      // 移動中
  | 'DROPPING'    // リング下降中
  | 'GRABBING'    // 掴み動作中（リング縮小）
  | 'LIFTING'     // 上昇中（アイテムあり/なし）
  | 'RETURNING';  // 初期位置に戻り中

interface CraneConfig {
  readonly moveSpeed: number;       // X-Z移動速度
  readonly dropSpeed: number;       // 下降速度
  readonly liftSpeed: number;       // 上昇速度
  readonly minX: number;            // X軸左端制限
  readonly maxX: number;            // X軸右端制限
  readonly minZ: number;            // Z軸手前制限
  readonly maxZ: number;            // Z軸奥側制限
  readonly grabRadius: number;      // 掴み判定半径（X-Z 2D距離）
  readonly baseCatchRate: number;   // 基本キャッチ成功率
}
```

**State Transitions**:

```
IDLE → MOVING       (上下左右入力)
MOVING → IDLE       (入力解除)
IDLE → DROPPING     (キャッチボタン)
MOVING → DROPPING   (キャッチボタン)
DROPPING → GRABBING (リングが最下点到達)
GRABBING → LIFTING  (掴み判定完了)
LIFTING → RETURNING (最上部到達)
RETURNING → IDLE    (初期位置到達)
```

### CraneArm（クレーンアーム / プロング）

クレーンの視覚的表現。UFOキャッチャー型2本プロング（爪）のキャッチ機構。垂直シャフト（armBody）の下端に2本のプロングがヒンジで取り付けられた構造。各プロングは CylinderGeometry（棒部分）+ SphereGeometry（先端の曲がり部分）で構成。

| Field | Type | Description |
|-------|------|-------------|
| prongLeftPivot | `THREE.Group` | 左プロングのヒンジ（回転軸）グループ |
| prongRightPivot | `THREE.Group` | 右プロングのヒンジ（回転軸）グループ |
| prongLeftArm | `THREE.Mesh` | 左プロング棒部分（CylinderGeometry） |
| prongRightArm | `THREE.Mesh` | 右プロング棒部分（CylinderGeometry） |
| prongLeftTip | `THREE.Mesh` | 左プロング先端（SphereGeometry、内側カーブ） |
| prongRightTip | `THREE.Mesh` | 右プロング先端（SphereGeometry、内側カーブ） |
| openAngle | `number` | 現在のプロング開き角（rad） |
| targetOpenAngle | `number` | 目標プロング開き角（rad） |

```typescript
class CraneArm {
  readonly group: THREE.Group;     // シーンに追加するルートグループ
  setPositionX(x: number): void;   // X軸位置設定
  setPositionZ(z: number): void;   // Z軸位置設定
  setArmY(y: number): void;        // アーム高さ設定（シャフト伸縮 + プロング位置）
  open(): void;   // プロングをV字型に開く（targetOpenAngle = 0.5 rad）← DROPPING 開始時に呼ぶ
  close(): void;  // プロングを閉じて掴む（targetOpenAngle = 0 rad）← GRABBING 時に呼ぶ
  update(deltaTime: number): void; // lerp 補間でプロング開閉アニメーション
  dispose(): void;                 // ジオメトリ・マテリアルの破棄
}
```

**3Dオブジェクト階層**:
```
group (THREE.Group)
├── railX (BoxGeometry, 横レール)
├── railZ (BoxGeometry, 奥行きレール)
├── armBody (CylinderGeometry, 垂直シャフト)
└── prongGroup (THREE.Group, シャフト下端に配置)
    ├── prongLeftPivot (THREE.Group, rotation.z でヒンジ回転)
    │   └── prongLeftArm (CylinderGeometry, 棒)
    │       └── prongLeftTip (SphereGeometry, 先端曲がり)
    └── prongRightPivot (THREE.Group, rotation.z でヒンジ回転, ミラー)
        └── prongRightArm (CylinderGeometry, 棒)
            └── prongRightTip (SphereGeometry, 先端曲がり)
```

**3段階つかむ動作フロー（CraneGameScene.update から制御）**:
```
1. DROPPING 開始 → craneArm.open()  → プロングがV字型に開く
2. アーム下降（armY 減少）→ armBottomY 到達
3. GRABBING 開始 → craneArm.close() → プロングが閉じてつかむ → CatchSystem.evaluate()
```

### Collection（コレクション/図鑑）

プレイヤーの取得状態。localStorage に永続化。

```typescript
interface CollectionEntry {
  readonly itemId: string;
  readonly capturedAt: string; // ISO 8601 日時文字列
}

interface CollectionState {
  readonly entries: ReadonlyMap<string, CollectionEntry>;
}
```

### PlaySession（プレイセッション）

1回のゲームプレイの状態。

```typescript
interface PlaySession {
  readonly categoryId: string;
  readonly spawnedItems: readonly SpawnedItem[];
  catchResult: CatchResult | null;
}

interface SpawnedItem {
  readonly itemDefinition: ItemDefinition;
  position: { x: number; y: number; z: number };
}

interface CatchResult {
  readonly success: boolean;
  readonly item: ItemDefinition | null;
  readonly isNewItem: boolean;    // 初回キャッチかどうか
}
```

### SaveData（永続化データ）

localStorage に保存されるルートデータ構造。

```typescript
interface SaveData {
  readonly version: number;        // スキーマバージョン（現在: 1）
  collection: Record<string, { capturedAt: string }>;
  tutorialCompleted: boolean;
  settings: GameSettings;
}
```

### BGMType（BGM種別）

AudioManager で再生するBGMの種類を指定する型。

```typescript
type BGMType = 'title' | 'game';
```

### AudioManager（サウンド管理 — 更新）

BGM を和音メロディシーケンスとして再生。フェードイン/アウト対応。

```typescript
class AudioManager {
  playBGM(type: BGMType): void;   // 指定タイプのBGMメロディを開始（フェードイン付き）
  stopBGM(): void;                 // BGMをフェードアウトして停止
  // ... 他のメソッドは変更なし
}
```

**BGM 内部構造**:
```typescript
interface MelodyNote {
  readonly frequencies: readonly number[];  // 和音の周波数群（例: [261.63, 329.63, 392.00] = C-E-G）
  readonly duration: number;                // ノート長（秒）
}

interface MelodyPattern {
  readonly notes: readonly MelodyNote[];
  readonly tempo: number;                   // BPM相当のテンポ係数
}
```
interface GameSettings {
  bgmEnabled: boolean;
  sfxEnabled: boolean;
}
```

## Relationships

```
Category 1 ──── * Item
    │
    └── CategoryRegistry で管理

Item * ──── 0..1 CollectionEntry
    │
    └── ItemRegistry で管理

PlaySession 1 ──── 1 Category
PlaySession 1 ──── * SpawnedItem
SpawnedItem 1 ──── 1 ItemDefinition

Crane ──── PlaySession（1回のゲームで1つのCraneが存在）
```

## Registry Pattern

```typescript
// カテゴリの登録・取得
class CategoryRegistry {
  register(category: CategoryDefinition): void;
  get(id: string): CategoryDefinition | undefined;
  getAll(): readonly CategoryDefinition[];
  getUnlocked(): readonly CategoryDefinition[];
}

// アイテムの登録・取得
class ItemRegistry {
  register(item: ItemDefinition): void;
  get(id: string): ItemDefinition | undefined;
  getByCategory(categoryId: string): readonly ItemDefinition[];
  getAll(): readonly ItemDefinition[];
}
```

## Initial Data: どうぶつカテゴリ（8種）

| id | name | rarity | catchDifficulty | description |
|----|------|--------|-----------------|-------------|
| lion | らいおん | common | 0.5 | たてがみが りっぱな どうぶつの おうさま |
| elephant | ぞう | common | 0.6 | おおきな みみと ながい はなが とくちょう |
| giraffe | きりん | common | 0.4 | せが たかくて くびが ながい どうぶつ |
| penguin | ぺんぎん | common | 0.5 | こおりの うえを あるく とりの なかま |
| panda | らんだ | rare | 0.6 | しろと くろの もようが かわいい |
| koala | こあら | rare | 0.5 | きの うえで ねむるのが だいすき |
| dolphin | いるか | rare | 0.7 | うみを じゆうに およぐ あたまの いい どうぶつ |
| rabbit | うさぎ | common | 0.4 | ながい みみと まるい しっぽが チャームポイント |
