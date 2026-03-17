# Implementation Plan: クレーンキャッチゲーム

**Branch**: `001-crane-catch-game` | **Date**: 2026-03-17 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-crane-catch-game/spec.md`

**Note**: 差分更新 — クレーン4方向移動拡張 + リング形状デザイン変更を反映。

## Summary

ゲームセンターのクレーンキャッチャーを再現した5〜10歳向け教育ゲーム。TypeScript + Three.js + Vite 構成で、プロシージャル3Dモデル・サウンド生成、データ駆動カテゴリ設計を採用。本更新では以下2点を実装計画に反映する:

1. **クレーン4方向移動**: X軸のみ → X-Z 2軸移動に拡張。CraneConfig に minZ/maxZ 追加、InputState を2D方向に変更、CatchSystem で2D距離判定に移行。
2. **リング形状デザイン**: CraneArm のツメ（ConeGeometry）→ リング（TorusGeometry）に変更。開閉はスケーリングで直径を変化させアイテムを包み込む動作を表現。

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
| I. TDD (NON-NEGOTIABLE) | ✅ PASS | 全変更に対しテスト先行で実装。Crane.test.ts, PhysicsSystem.test.ts, CatchSystem.test.ts, InputSystem.test.ts, HUD.test.ts, CraneArm は Three.js モック環境で検証 |
| II. Data-Driven Extensibility | ✅ PASS | CraneConfig へのフィールド追加のみ。カテゴリ/アイテムのデータ駆動設計に影響なし |
| III. Child-First UI/UX | ✅ PASS | 上下ボタン追加で操作が増えるが、十分な大きさ（44x44pt以上）を維持。リング形状はアームより視覚的に分かりやすい |
| IV. Performance & Quality | ✅ PASS | TorusGeometry は ConeGeometry と同程度の頂点数。Z軸追加は演算コスト微増だが60fps維持に影響なし |
| V. Safety & Education | ✅ PASS | UI/UX変更のみ、コンテンツに影響なし |

### Post-Design Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. TDD | ✅ PASS | 変更対象の全ファイル（7ファイル）にテスト更新を計画 |
| II. Data-Driven | ✅ PASS | gameSettings.ts に minZ/maxZ を追加するだけでZ軸範囲を設定可能 |
| III. Child-First | ✅ PASS | HUDレイアウトは十字配置（上下左右＋中央キャッチ）で直感的 |
| IV. Performance | ✅ PASS | TorusGeometry(0.3, 0.06, 8, 16) は軽量。距離計算は Math.sqrt 1回追加のみ |
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
├── types/index.ts                   # 共通型定義 ← InputState, CraneConfig 変更
├── game/
│   ├── GameLoop.ts
│   ├── SceneManager.ts
│   ├── audio/
│   │   └── AudioManager.ts
│   ├── config/
│   │   ├── categories.ts
│   │   ├── gameSettings.ts          # ← minZ/maxZ 追加
│   │   └── items.ts
│   ├── effects/
│   │   ├── CatchCelebration.ts
│   │   └── ParticleEffect.ts
│   ├── entities/
│   │   ├── Crane.ts                 # ← positionZ, moveDirection 2軸化
│   │   ├── CraneArm.ts             # ← リング形状化, setPositionZ 追加
│   │   ├── ItemFactory.ts
│   │   └── registry/
│   │       ├── CategoryRegistry.ts
│   │       └── ItemRegistry.ts
│   ├── scenes/
│   │   ├── CategorySelectScene.ts
│   │   ├── CraneGameScene.ts        # ← Z軸移動・リング連携
│   │   ├── ResultScene.ts
│   │   ├── TitleScene.ts
│   │   └── ZukanScene.ts
│   ├── storage/
│   │   └── SaveManager.ts
│   └── systems/
│       ├── CatchSystem.ts           # ← X-Z 2D距離判定
│       ├── InputSystem.ts           # ← 上下入力対応
│       ├── PhysicsSystem.ts         # ← moveXZ 追加
│       ├── SpawnSystem.ts
│       └── TutorialSystem.ts
└── ui/
    ├── HUD.ts                       # ← 上下ボタン追加
    ├── OrientationGuard.ts
    ├── TutorialOverlay.ts
    └── ZukanOverlay.ts

tests/
├── unit/
│   ├── entities/
│   │   └── Crane.test.ts            # ← Z軸移動テスト追加
│   ├── systems/
│   │   ├── CatchSystem.test.ts      # ← 2D距離判定テスト追加
│   │   ├── InputSystem.test.ts      # ← 上下入力テスト追加
│   │   └── PhysicsSystem.test.ts    # ← moveXZ テスト追加
│   └── ui/
│       └── HUD.test.ts              # ← 上下ボタンテスト追加
└── integration/
    └── CraneGameFlow.test.ts        # ← 4方向移動フロー追加
```

**Structure Decision**: 既存構造を維持。新ファイル追加なし、既存ファイルの変更のみ。

## Change Summary

### 変更1: クレーン4方向移動（X-Z 2軸）

| File | Change |
|------|--------|
| `src/types/index.ts` | `CraneConfig` に `minZ`, `maxZ` 追加。`InputState.moveDirection` を `{ x: -1\|0\|1, z: -1\|0\|1 }` に変更 |
| `src/game/config/gameSettings.ts` | `minZ: -1.5`, `maxZ: 1.5` 追加 |
| `src/game/entities/Crane.ts` | `positionZ` フィールド追加、`move()` を2軸方向に対応、`update()` でZ軸移動処理追加、`getPositionZ()` 追加 |
| `src/game/systems/PhysicsSystem.ts` | `moveXZ(currentX, currentZ, dirX, dirZ, deltaTime)` メソッド追加（`moveHorizontal` は後方互換のため残す） |
| `src/game/systems/InputSystem.ts` | `moveDirection` を `{ x, z }` で管理、上下スワイプ検出追加 |
| `src/game/systems/CatchSystem.ts` | `evaluate()` に `craneZ` パラメータ追加、X-Z 平面の2D ユークリッド距離で判定 |
| `src/ui/HUD.ts` | 上下ボタン（▲ ▼）追加、`onMove` コールバックを `(direction: { x: -1\|0\|1, z: -1\|0\|1 }) => void` に変更 |
| `src/game/entities/CraneArm.ts` | `setPositionZ(z: number)` メソッド追加 |

### 変更2: リング形状デザイン

| File | Change |
|------|--------|
| `src/game/entities/CraneArm.ts` | `clawLeft`/`clawRight` を `ring: THREE.Mesh`（TorusGeometry）に変更。`open()` でスケールを大きく、`close()` でスケールを小さくする |

## Complexity Tracking

> 変更は既存ファイルの修正のみで完結し、新規抽象化・パターン追加なし。Constitution 違反なし。

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (なし) | — | — |
