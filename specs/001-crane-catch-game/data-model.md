# Data Model: クレーンキャッチゲーム

**Phase**: 1 — Design & Contracts  
**Date**: 2026-03-17  
**Status**: Complete

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

ゲーム内の操作オブジェクト。ステートマシンで動作管理。

| Field | Type | Description |
|-------|------|-------------|
| positionX | `number` | 水平位置 |
| state | `CraneState` | 現在の状態 |
| armOpenAngle | `number` | アーム開き角度 |
| heldItem | `Item \| null` | 掴んでいるアイテム |

```typescript
type CraneState =
  | 'IDLE'        // 待機中（移動可能）
  | 'MOVING'      // 移動中
  | 'DROPPING'    // アーム下降中
  | 'GRABBING'    // 掴み動作中
  | 'LIFTING'     // 上昇中（アイテムあり/なし）
  | 'RETURNING';  // 初期位置に戻り中

interface CraneConfig {
  readonly moveSpeed: number;       // 水平移動速度
  readonly dropSpeed: number;       // 下降速度
  readonly liftSpeed: number;       // 上昇速度
  readonly minX: number;            // 左端制限
  readonly maxX: number;            // 右端制限
  readonly grabRadius: number;      // 掴み判定半径
  readonly baseCatchRate: number;   // 基本キャッチ成功率
}
```

**State Transitions**:

```
IDLE → MOVING       (左右入力)
MOVING → IDLE       (入力解除)
IDLE → DROPPING     (キャッチボタン)
MOVING → DROPPING   (キャッチボタン)
DROPPING → GRABBING (アームが最下点到達)
GRABBING → LIFTING  (掴み判定完了)
LIFTING → RETURNING (最上部到達)
RETURNING → IDLE    (初期位置到達)
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
