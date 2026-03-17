# Implementation Plan: クレーンキャッチゲーム（Crane Catch Game）

**Branch**: `001-crane-catch-game` | **Date**: 2026-03-17 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-crane-catch-game/spec.md`

## Summary

ゲームセンターのクレーンキャッチャーを再現した5〜10歳向け教育ゲーム。Three.jsによる3Dクレーン操作でアイテムをキャッチし、図鑑にコレクションする。初期カテゴリは「どうぶつ」8種。全アセット（3Dモデル・サウンド）はプロシージャル生成。データ駆動設計によりカテゴリ追加時にコアロジック変更不要。universe-kids-raceのプロジェクト構成・デザインを踏襲し、よりポップな配色で展開。

## Technical Context

**Language/Version**: TypeScript 5.7+（strict モード必須）  
**Primary Dependencies**: Three.js ^0.170.0, Vite ^6.0.0  
**Storage**: ブラウザ localStorage（図鑑コレクション・チュートリアル完了状態の永続化）  
**Testing**: Vitest ^3.0.0 + jsdom ^28.1.0  
**Target Platform**: iPad Safari 横向き最優先、モダンブラウザ（Chrome, Firefox, Edge）  
**Project Type**: Web ゲームアプリケーション（SPA）  
**Performance Goals**: 60fps 安定維持、初回ロード 3秒以内  
**Constraints**: 外部アセットファイル不使用（3D・音声すべてプロシージャル生成）、課金要素・広告・外部リンク禁止、オフラインプレイ対応  
**Scale/Scope**: 5画面（タイトル・カテゴリ選択・クレーンゲーム・結果・図鑑）、初期8アイテム、将来カテゴリ拡張対応

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check | Status |
|---|-----------|-------|--------|
| I | TDD（NON-NEGOTIABLE） | Vitest + jsdom でテスト先行開発。ゲームロジック・状態管理のユニットテスト。Three.js依存部はモックで検証 | ✅ PASS |
| II | Data-Driven Extensibility | カテゴリ・アイテムは宣言的データ定義。Registry パターンで動的登録。コアロジック変更不要で新カテゴリ追加可能 | ✅ PASS |
| III | Child-First UI/UX | ひらがなUI、iPad Safari横向き最適化、44x44pt以上のボタン、ポジティブなフィードバック、universe-kids-raceデザイン踏襲 | ✅ PASS |
| IV | Performance & Quality | プロシージャル生成で軽量アセット、ジオメトリ・マテリアル再利用、RAFベースゲームループ、適切なdispose | ✅ PASS |
| V | Safety & Education | 安全な教育コンテンツのみ、課金・広告・外部リンクなし、動物知識の学習要素、色覚多様性対応 | ✅ PASS |

**Gate Result**: ✅ ALL PASS — Phase 0 に進行可能

### Post-Design Re-check (Phase 1 完了後)

| # | Principle | Re-check | Status |
|---|-----------|----------|--------|
| I | TDD | テスト構造定義済み（unit/ + integration/）。全 System・Entity・Scene にテストファイル対応 | ✅ PASS |
| II | Data-Driven | Registry パターン + config/ 定義ファイルで設計完了。新カテゴリ追加フロー検証済み | ✅ PASS |
| III | Child-First | Scene Contracts で全画面のひらがなUI・ボタン配置・ポジティブメッセージを明記 | ✅ PASS |
| IV | Performance | Tween ベースアニメーション（物理エンジン不使用）、プロシージャル生成、メモリ管理戦略を research.md で確定 | ✅ PASS |
| V | Safety | 全メッセージがポジティブ表現。課金・外部リンクなし。教育要素（動物知識）をデータモデルに組み込み | ✅ PASS |

**Post-Design Gate Result**: ✅ ALL PASS

## Project Structure

### Documentation (this feature)

```text
specs/001-crane-catch-game/
├── plan.md              # This file
├── research.md          # Phase 0: 技術調査結果
├── data-model.md        # Phase 1: エンティティ・データモデル
├── quickstart.md        # Phase 1: 開発クイックスタート
├── contracts/           # Phase 1: インターフェース定義
│   └── scene-contracts.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── main.ts                          # エントリポイント（Three.js初期化・シーン登録）
├── types/
│   └── index.ts                     # 型定義（Scene, Entity, Config等）
├── game/
│   ├── GameLoop.ts                  # RAFベースゲームループ
│   ├── SceneManager.ts              # シーン遷移管理
│   ├── audio/
│   │   └── AudioManager.ts          # Web Audio API サウンド生成・管理
│   ├── config/
│   │   ├── categories.ts            # カテゴリ定義（データ駆動）
│   │   ├── items.ts                 # アイテム定義（どうぶつ8種 etc.）
│   │   └── gameSettings.ts          # ゲーム設定（クレーン速度・判定範囲等）
│   ├── effects/
│   │   ├── CatchCelebration.ts      # キャッチ成功エフェクト
│   │   └── ParticleEffect.ts        # 汎用パーティクル
│   ├── entities/
│   │   ├── Crane.ts                 # クレーン（アーム・レール・状態管理）
│   │   ├── CraneArm.ts             # アームの3Dモデル・アニメーション
│   │   ├── ItemFactory.ts           # アイテム3Dモデル プロシージャル生成
│   │   └── registry/
│   │       ├── ItemRegistry.ts      # アイテムRegistryパターン
│   │       └── CategoryRegistry.ts  # カテゴリRegistryパターン
│   ├── scenes/
│   │   ├── TitleScene.ts            # タイトル画面
│   │   ├── CategorySelectScene.ts   # カテゴリ選択画面
│   │   ├── CraneGameScene.ts        # クレーンゲーム本体
│   │   ├── ResultScene.ts           # 結果画面
│   │   └── ZukanScene.ts            # 図鑑画面
│   ├── storage/
│   │   └── SaveManager.ts           # localStorage永続化
│   └── systems/
│       ├── InputSystem.ts           # タッチ入力処理
│       ├── PhysicsSystem.ts         # クレーン・アイテムの物理演算
│       ├── CatchSystem.ts           # キャッチ判定ロジック
│       ├── SpawnSystem.ts           # アイテム配置（ランダム化）
│       └── TutorialSystem.ts        # チュートリアル制御
└── ui/
    ├── HUD.ts                       # ゲーム中UI（キャッチボタン等）
    ├── TutorialOverlay.ts           # チュートリアルオーバーレイ
    ├── OrientationGuard.ts          # 縦横検知・回転促進メッセージ
    └── ZukanOverlay.ts              # 図鑑詳細オーバーレイ

tests/
├── unit/
│   ├── config/
│   │   ├── categories.test.ts
│   │   └── items.test.ts
│   ├── entities/
│   │   ├── Crane.test.ts
│   │   ├── ItemFactory.test.ts
│   │   └── registry/
│   │       ├── ItemRegistry.test.ts
│   │       └── CategoryRegistry.test.ts
│   ├── scenes/
│   │   ├── TitleScene.test.ts
│   │   ├── CategorySelectScene.test.ts
│   │   ├── CraneGameScene.test.ts
│   │   ├── ResultScene.test.ts
│   │   └── ZukanScene.test.ts
│   ├── storage/
│   │   └── SaveManager.test.ts
│   ├── systems/
│   │   ├── InputSystem.test.ts
│   │   ├── PhysicsSystem.test.ts
│   │   ├── CatchSystem.test.ts
│   │   ├── SpawnSystem.test.ts
│   │   └── TutorialSystem.test.ts
│   ├── audio/
│   │   └── AudioManager.test.ts
│   └── ui/
│       ├── HUD.test.ts
│       ├── TutorialOverlay.test.ts
│       └── OrientationGuard.test.ts
└── integration/
    ├── CraneGameFlow.test.ts
    ├── CollectionFlow.test.ts
    └── SceneTransition.test.ts
```

**Structure Decision**: universe-kids-race のプロジェクト構成を踏襲。`src/game/` 配下に audio, config, effects, entities, scenes, storage, systems を配置。UIは `src/ui/` 配下。テストは `tests/unit/` と `tests/integration/` に分離。クレーンゲーム固有のモジュール（CatchSystem, PhysicsSystem, ItemFactory, Registry）を追加。

## Complexity Tracking

> Constitution Check に違反なし。追加の正当化は不要。
