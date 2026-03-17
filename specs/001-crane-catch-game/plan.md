# Implementation Plan: クレーンキャッチゲーム

**Branch**: `001-crane-catch-game` | **Date**: 2026-03-17 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-crane-catch-game/spec.md`

**Note**: 差分更新 — 3段階つかむ動作、BGM和音メロディ化、動物の目追加、図鑑グリッドレイアウトの4点を反映。

## Summary

ゲームセンターのクレーンキャッチャーを再現した5〜10歳向け教育ゲーム。TypeScript + Three.js + Vite 構成で、プロシージャル3Dモデル・サウンド生成、データ駆動カテゴリ設計を採用。本更新では以下4点を実装計画に反映する:

1. **クレーンの3段階つかむ動作**: DROPPING ステートで `open()` → 下降、GRABBING ステートで `close()` → 掴み判定。ゲームセンターのクレーンのように「開いたまま降下→底で閉じて掴む」を再現。
2. **BGM和音メロディ化**: AudioManager の `playBGM()` を和音メロディシーケンスに書き直し。タイトル用・ゲーム用の2種類のメロディパターン。OscillatorNode 複数使用の和音＋フェードイン/アウト対応。
3. **動物のモデル改善（目の追加）**: items.ts の ModelParams にライオン・ゾウ・コアラ・キリンの目（白目 eyeWhite + 黒目 pupil）パーツを追加。正面から見て識別しやすい大きめの目を配置。
4. **図鑑グリッドレイアウト**: ZukanScene の CSS グリッドを `repeat(4, 1fr)` に変更し、2×4 マトリックス表示。セルサイズと間隔を調整。

## Technical Context

**Language/Version**: TypeScript ^5.7.0（strict モード必須）
**Primary Dependencies**: Three.js ^0.170.0
**Build Tool**: Vite ^6.0.0
**Storage**: localStorage（SaveManager でバージョニング付きJSON）
**Testing**: Vitest ^3.0.0 + jsdom ^28.1.0
**Target Platform**: iPad Safari 横向き（モダンブラウザもサポート）
**Project Type**: web-game（SPA、GitHub Pages デプロイ）
**Performance Goals**: 60fps 安定維持
**Constraints**: 外部3Dファイル/音声ファイル不使用、ひらがなUIのみ、課金/広告なし
**Scale/Scope**: 初期「どうぶつ」カテゴリ8種、5画面（タイトル/カテゴリ選択/クレーンゲーム/結果/図鑑）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. TDD (NON-NEGOTIABLE) | ✅ PASS | 全変更に対しテスト先行で実装。CraneGameScene の DROPPING/GRABBING ステート挙動テスト、AudioManager の BGM メロディテスト、items.ts のパーツ定義検証テスト、ZukanScene のグリッドレイアウトテストを計画 |
| II. Data-Driven Extensibility | ✅ PASS | items.ts へのパーツ追加のみでモデル変更完結。BGM パターンもデータ定義。カテゴリ/アイテムのデータ駆動設計に影響なし |
| III. Child-First UI/UX | ✅ PASS | 3段階つかむ動作はゲームセンターのクレーンを忠実に再現し直感的。和音メロディはより楽しい体験を提供。目の追加でどうぶつの識別性向上。4列グリッドは8アイテムを2行×4列で一覧性向上 |
| IV. Performance & Quality | ✅ PASS | OscillatorNode 複数使用は和音3〜4音程度で負荷微小。目パーツ追加は各動物2〜4sphere程度で60fps維持に影響なし。グリッドは CSS のみの変更 |
| V. Safety & Education | ✅ PASS | コンテンツ変更なし。教育的要素は維持 |

### Post-Design Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. TDD | ✅ PASS | 変更対象ファイルすべてにテスト更新を計画（後述の Change Summary 参照） |
| II. Data-Driven | ✅ PASS | BGM 定義をメロディパターンデータとして構造化。動物の目はパーツ定義データの追加のみ |
| III. Child-First | ✅ PASS | リング開閉と3段階動作でクレーンの動きが分かりやすく。和音メロディで「るんるんする」体験。目でどうぶつの親しみやすさ向上 |
| IV. Performance | ✅ PASS | BGM は同時発音4音以下。eye パーツは SphereGeometry の再利用可能。CSS Grid の変更はレンダリングコスト変化なし |
| V. Safety | ✅ PASS | 変更なし |

## Project Structure

### Documentation (this feature)

```text
specs/001-crane-catch-game/
├── plan.md              # This file (差分更新済み)
├── research.md          # Phase 0 output (更新済み)
├── data-model.md        # Phase 1 output (更新済み)
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── scene-contracts.md  # Phase 1 output (更新済み)
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── main.ts                          # エントリポイント
├── types/index.ts                   # 共通型定義 ← BGMType 追加
├── game/
│   ├── GameLoop.ts
│   ├── SceneManager.ts
│   ├── audio/
│   │   └── AudioManager.ts          # ← playBGM() 和音メロディ化、フェード対応
│   ├── config/
│   │   ├── categories.ts
│   │   ├── gameSettings.ts
│   │   └── items.ts                 # ← 4動物に目パーツ追加
│   ├── effects/
│   │   ├── CatchCelebration.ts
│   │   └── ParticleEffect.ts
│   ├── entities/
│   │   ├── Crane.ts
│   │   ├── CraneArm.ts             # ← open()/close() タイミング変更なし（呼び出し元の変更）
│   │   ├── ItemFactory.ts
│   │   └── registry/
│   │       ├── CategoryRegistry.ts
│   │       └── ItemRegistry.ts
│   ├── scenes/
│   │   ├── CategorySelectScene.ts
│   │   ├── CraneGameScene.ts        # ← DROPPING で open()、GRABBING で close()
│   │   ├── ResultScene.ts
│   │   ├── TitleScene.ts            # ← playBGM('title') 呼び出し
│   │   └── ZukanScene.ts            # ← CSS Grid repeat(4, 1fr)、セルサイズ調整
│   ├── storage/
│   │   └── SaveManager.ts
│   └── systems/
│       ├── CatchSystem.ts
│       ├── InputSystem.ts
│       ├── PhysicsSystem.ts
│       ├── SpawnSystem.ts
│       └── TutorialSystem.ts
└── ui/
    ├── HUD.ts
    ├── OrientationGuard.ts
    ├── TutorialOverlay.ts
    └── ZukanOverlay.ts

tests/
├── unit/
│   ├── audio/
│   │   └── AudioManager.test.ts     # ← 和音メロディ・フェードテスト追加
│   ├── config/
│   │   └── items.test.ts            # ← 目パーツ存在検証テスト追加
│   └── scenes/
│       ├── CraneGameScene.test.ts   # ← DROPPING=open, GRABBING=close テスト追加
│       └── ZukanScene.test.ts       # ← 4列グリッドテスト追加
└── integration/
    └── CraneGameFlow.test.ts        # ← 3段階つかむフロー追加
```

**Structure Decision**: 既存構造を維持。新ファイル追加なし、既存ファイルの変更のみ。

## Change Summary

### 変更1: クレーンの3段階つかむ動作

**概要**: DROPPING ステートで `craneArm.open()` を呼んでからリング降下、GRABBING ステートで `craneArm.close()` を呼んでから掴み判定。現状は DROPPING で `close()` を呼んでいるため逆になっている。

| File | Change |
|------|--------|
| `src/game/scenes/CraneGameScene.ts` | DROPPING ケースで `this.craneArm.close()` → `this.craneArm.open()` に変更。GRABBING ケースの先頭で `this.craneArm.close()` を呼び、リング閉じアニメーション後に掴み判定を実行 |

**ステート遷移の詳細**:
```
IDLE/MOVING → (キャッチボタン) → DROPPING
  DROPPING: craneArm.open() → リングが開く → armYが下降
  armBottomY 到達 → GRABBING
  GRABBING: craneArm.close() → リングが閉じる → CatchSystem.evaluate()
  判定完了 → LIFTING
  LIFTING: armYが上昇
  armTopY 到達 → RETURNING
  RETURNING: 結果処理 → IDLE
```

**テスト更新**:
- `tests/unit/scenes/CraneGameScene.test.ts`: DROPPING ステートで `open()` が呼ばれることを検証、GRABBING ステートで `close()` が呼ばれることを検証
- `tests/integration/CraneGameFlow.test.ts`: 「開く→下降→閉じる→判定→上昇」の一連フロー検証

### 変更2: BGM和音メロディ化

**概要**: AudioManager の `playBGM()` を和音メロディシーケンスに書き直し。タイトル画面用・ゲーム画面用の2種類のメロディパターンを再生可能にする。

| File | Change |
|------|--------|
| `src/game/audio/AudioManager.ts` | `playBGM()` を `playBGM(type: BGMType)` に変更。内部にタイトル用・ゲーム用のメロディパターン（音符配列）を定義。複数 OscillatorNode で和音生成。`stopBGM()` にフェードアウト追加。再生開始時にフェードイン。メロディはループ再生 |
| `src/types/index.ts` | `BGMType = 'title' \| 'game'` 型を追加 |
| `src/game/scenes/TitleScene.ts` | `playBGM()` → `playBGM('title')` に変更 |
| `src/game/scenes/CraneGameScene.ts` | `playBGM()` → `playBGM('game')` に変更（enter 内） |

**メロディ設計**:
- **タイトル BGM**: 明るくゆったりしたメロディ（C-E-G の和音ベース、テンポ遅め）
- **ゲーム BGM**: ワクワクする明るいメロディ（C-F-G の進行、テンポ速め）
- **和音構造**: ルート + 3rd + 5th の3音同時発音（OscillatorNode × 3）
- **フェードイン**: bgmGain を 0 → targetVolume へ 0.5秒で ramp
- **フェードアウト**: bgmGain を currentVolume → 0 へ 0.3秒で ramp、ramp 完了後に OscillatorNode を stop
- **ループ**: メロディシーケンス終端で先頭に戻り無限ループ

**テスト更新**:
- `tests/unit/audio/AudioManager.test.ts`: `playBGM('title')` / `playBGM('game')` でそれぞれ異なるメロディが再生されることを検証。フェードイン/アウトの GainNode 値変化を検証

### 変更3: 動物のモデル改善（目の追加）

**概要**: ライオン・ゾウ・キリン・コアラの ModelParams に白目（eyeWhite）+ 黒目（pupil）パーツを追加。正面から見て何の動物か識別しやすい大きめの目を配置。

| File | Change |
|------|--------|
| `src/game/config/items.ts` | 以下4動物のパーツ配列に eyeWhite（白, sphere） + pupil（黒, sphere）を左右各1組追加 |

**追加パーツ詳細**:

| 動物 | パーツ | color | position | scale |
|------|--------|-------|----------|-------|
| らいおん | eyeWhiteL | 0xffffff | [-0.15, 0.85, 0.75] | [0.1, 0.1, 0.06] |
| らいおん | eyeWhiteR | 0xffffff | [0.15, 0.85, 0.75] | [0.1, 0.1, 0.06] |
| らいおん | pupilL | 0x222222 | [-0.15, 0.84, 0.79] | [0.05, 0.06, 0.03] |
| らいおん | pupilR | 0x222222 | [0.15, 0.84, 0.79] | [0.05, 0.06, 0.03] |
| ぞう | eyeWhiteL | 0xffffff | [-0.2, 0.7, 0.8] | [0.1, 0.1, 0.06] |
| ぞう | eyeWhiteR | 0xffffff | [0.2, 0.7, 0.8] | [0.1, 0.1, 0.06] |
| ぞう | pupilL | 0x222222 | [-0.2, 0.69, 0.84] | [0.05, 0.06, 0.03] |
| ぞう | pupilR | 0x222222 | [0.2, 0.69, 0.84] | [0.05, 0.06, 0.03] |
| きりん | eyeWhiteL | 0xffffff | [-0.1, 1.52, 0.55] | [0.08, 0.08, 0.05] |
| きりん | eyeWhiteR | 0xffffff | [0.1, 1.52, 0.55] | [0.08, 0.08, 0.05] |
| きりん | pupilL | 0x222222 | [-0.1, 1.51, 0.58] | [0.04, 0.05, 0.03] |
| きりん | pupilR | 0x222222 | [0.1, 1.51, 0.58] | [0.04, 0.05, 0.03] |
| こあら | eyeWhiteL | 0xffffff | [-0.15, 0.78, 0.48] | [0.1, 0.1, 0.06] |
| こあら | eyeWhiteR | 0xffffff | [0.15, 0.78, 0.48] | [0.1, 0.1, 0.06] |
| こあら | pupilL | 0x222222 | [-0.15, 0.77, 0.52] | [0.05, 0.06, 0.03] |
| こあら | pupilR | 0x222222 | [0.15, 0.77, 0.52] | [0.05, 0.06, 0.03] |

**注**: ペンギン・イルカ・ウサギは既存の eye パーツで十分。パンダは eyePatch の上に白目+黒目を重ねて追加検討可。

**テスト更新**:
- `tests/unit/config/items.test.ts`: ライオン・ゾウ・キリン・コアラにそれぞれ `eyeWhiteL`, `eyeWhiteR`, `pupilL`, `pupilR` パーツが存在することを検証

### 変更4: 図鑑グリッドレイアウト

**概要**: ZukanScene の CSS グリッドを `repeat(auto-fill, minmax(80px, 1fr))` から `repeat(4, 1fr)` に変更し、2行×4列のマトリックス表示にする。

| File | Change |
|------|--------|
| `src/game/scenes/ZukanScene.ts` | グリッド CSS を `grid-template-columns: repeat(4, 1fr)` に変更。gap を 10px に調整。セルの min-height を 100px に拡大して視認性向上 |

**レイアウト仕様**:
```
┌──────┬──────┬──────┬──────┐
│ らいおん │  ぞう  │ きりん │ ぺんぎん│
├──────┼──────┼──────┼──────┤
│ ぱんだ │ こあら │ いるか │ うさぎ │
└──────┴──────┴──────┴──────┘
```
- `grid-template-columns: repeat(4, 1fr)`: 固定4列
- `gap: 10px`: セル間隔
- セル: `min-height: 100px`, `border-radius: 12px`
- iPad 横向き表示で 8 アイテムが 2行×4列に収まる

**テスト更新**:
- `tests/unit/scenes/ZukanScene.test.ts`: グリッドの `gridTemplateColumns` が `repeat(4, 1fr)` であることを検証

## Complexity Tracking

> 変更は既存ファイルの修正のみで完結し、新規抽象化・パターン追加なし。Constitution 違反なし。

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (なし) | — | — |
