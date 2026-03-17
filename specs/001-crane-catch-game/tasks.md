# Tasks: クレーンキャッチゲーム（Crane Catch Game）

**Input**: Design documents from `/specs/001-crane-catch-game/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/scene-contracts.md ✅, quickstart.md ✅

**Tests**: TDD は Constitution Principle I（NON-NEGOTIABLE）のため、全フェーズでテストタスクを含む。テストを先に書き、FAILを確認してから実装する。

**Organization**: タスクはユーザーストーリーごとにグループ化。各ストーリーは独立して実装・テスト可能。

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: 並列実行可能（異なるファイル、未完了タスクへの依存なし）
- **[Story]**: 対応するユーザーストーリー（US1, US2, US3, US4, US5）
- 各タスクに正確なファイルパスを記載

## Path Conventions

```text
src/
├── main.ts                          # エントリポイント
├── types/index.ts                   # 共通型定義
├── game/                            # ゲームコア
│   ├── GameLoop.ts, SceneManager.ts
│   ├── audio/AudioManager.ts
│   ├── config/                      # データ駆動定義
│   ├── effects/                     # ビジュアルエフェクト
│   ├── entities/                    # Crane, ItemFactory, Registry
│   ├── scenes/                      # 5画面シーン
│   ├── storage/SaveManager.ts
│   └── systems/                     # Input, Catch, Spawn, Physics, Tutorial
└── ui/                              # HTMLオーバーレイUI
tests/
├── unit/                            # ユニットテスト
└── integration/                     # インテグレーションテスト
```

---

## Phase 1: Setup（プロジェクト初期化）

**Purpose**: Vite + TypeScript + Three.js プロジェクトの初期構築

- [x] T001 Create project directory structure per plan.md (src/game/{audio,config,effects,entities/registry,scenes,storage,systems}, src/ui, src/types, tests/unit/{config,entities/registry,scenes,storage,systems,audio,ui}, tests/integration)
- [x] T002 Initialize npm project with package.json (three ^0.170.0, vite ^6.0.0, typescript ^5.7.0, vitest ^3.0.0, jsdom ^28.1.0, @types/three)
- [x] T003 [P] Configure TypeScript strict mode in tsconfig.json (ES2022 target, path alias @/*)
- [x] T004 [P] Configure Vite in vite.config.ts (base: /kids-crane-catch/, path alias) and create index.html with responsive viewport meta
- [x] T005 [P] Configure Vitest in vitest.config.ts (globals: true, environment: jsdom, path alias)

---

## Phase 2: Foundational（基盤インフラ）

**Purpose**: 全ユーザーストーリーが依存するコアインフラ。このフェーズ完了まで US 作業は開始不可。

**⚠️ CRITICAL**: ユーザーストーリーの実装はこのフェーズ完了後に開始

### Tests（テスト先行）

> **NOTE**: テストを先に書き、FAIL を確認してから実装に進む

- [x] T006 [P] Unit test for CategoryRegistry (register/get/getAll/getUnlocked) in tests/unit/entities/registry/CategoryRegistry.test.ts
- [x] T007 [P] Unit test for ItemRegistry (register/get/getByCategory/getAll) in tests/unit/entities/registry/ItemRegistry.test.ts
- [x] T008 [P] Unit test for categories config (どうぶつカテゴリ定義の整合性) in tests/unit/config/categories.test.ts
- [x] T009 [P] Unit test for items config (8種アイテム定義・ModelParams検証) in tests/unit/config/items.test.ts
- [x] T010 [P] Unit test for SaveManager (load/save/collection/tutorial/settings) in tests/unit/storage/SaveManager.test.ts
- [x] T011 [P] Unit test for AudioManager (SFX/BGM/resume/dispose) in tests/unit/audio/AudioManager.test.ts
- [x] T012 [P] Unit test for InputSystem (moveDirection/catchPressed/swipe/dispose) in tests/unit/systems/InputSystem.test.ts
- [x] T013 [P] Unit test for OrientationGuard (portrait detection/rotation prompt) in tests/unit/ui/OrientationGuard.test.ts

### Implementation（実装）

- [x] T014 Define all shared type definitions in src/types/index.ts — Scene, SceneType, SceneContext, CraneState, CraneConfig, CategoryDefinition, ItemDefinition, ModelParams, PartDefinition, Rarity, CollectionEntry, CollectionState, PlaySession, SpawnedItem, CatchResult, SaveData, GameSettings, InputState, SFXType
- [x] T015 [P] Implement CategoryRegistry (Map-based registry pattern) in src/game/entities/registry/CategoryRegistry.ts
- [x] T016 [P] Implement ItemRegistry (Map-based registry pattern) in src/game/entities/registry/ItemRegistry.ts
- [x] T017 [P] Implement category definitions (どうぶつ: id, name, icon, description, unlocked, sortOrder) in src/game/config/categories.ts
- [x] T018 [P] Implement item definitions (らいおん/ぞう/きりん/ぺんぎん/ぱんだ/こあら/いるか/うさぎ with ModelParams) in src/game/config/items.ts
- [x] T019 [P] Implement game settings (moveSpeed, dropSpeed, liftSpeed, minX/maxX, grabRadius, baseCatchRate, spawnCount, areaWidth/Depth) in src/game/config/gameSettings.ts
- [x] T020 Implement GameLoop (requestAnimationFrame, deltaTime計算, pause/resume, visibility change対応) in src/game/GameLoop.ts
- [x] T021 Implement SceneManager (scene registration, enter/exit transitions with SceneContext, active scene update) in src/game/SceneManager.ts
- [x] T022 Implement SaveManager (localStorage JSON serialize, version 1 schema, メモリフォールバック) in src/game/storage/SaveManager.ts
- [x] T023 Implement AudioManager (OscillatorNode + GainNode, catchSuccess/catchFail/buttonTap/craneMove/armDrop/complete/transition SFX, BGM loop, Safari AudioContext resume) in src/game/audio/AudioManager.ts
- [x] T024 Implement InputSystem (PointerEvent handler, left/right button + swipe threshold, catchPressed debounce, dispose) in src/game/systems/InputSystem.ts
- [x] T025 Implement OrientationGuard (matchMedia orientation check, fullscreen rotation prompt message in hiragana, game input blocking) in src/ui/OrientationGuard.ts
- [x] T026 Create application entry point in src/main.ts — Three.js WebGLRenderer init, GameLoop/SceneManager/SaveManager/AudioManager instantiation, Registry setup with config data, OrientationGuard mount

**Checkpoint**: 基盤インフラ完了 — ユーザーストーリーの実装を開始可能

---

## Phase 3: User Story 1 — クレーンでアイテムをキャッチする (Priority: P1) 🎯 MVP

**Goal**: クレーン操作 → アーム下降 → キャッチ判定 → 成功/失敗演出 → 結果表示の一連のコアゲームプレイループを完成させる

**Independent Test**: CraneGameScene を直接開き、タッチ操作でクレーン移動 → キャッチボタンでアーム降下 → 成功/失敗の演出 → ResultScene への遷移が完結する

### Tests for User Story 1

> **NOTE**: テストを先に書き、FAIL を確認してから実装に進む

- [x] T027 [P] [US1] Unit test for Crane entity (state transitions: IDLE→MOVING→DROPPING→GRABBING→LIFTING→RETURNING, 境界値テスト, 連打防止) in tests/unit/entities/Crane.test.ts
- [x] T028 [P] [US1] Unit test for ItemFactory (ModelParams→THREE.Group生成, パーツ構成, スケール) in tests/unit/entities/ItemFactory.test.ts
- [x] T029 [P] [US1] Unit test for CatchSystem (Box3交差判定, 成功率計算, 距離・難易度考慮) in tests/unit/systems/CatchSystem.test.ts
- [x] T030 [P] [US1] Unit test for SpawnSystem (ランダム配置, 範囲内配置, アイテム選択) in tests/unit/systems/SpawnSystem.test.ts
- [x] T031 [P] [US1] Unit test for PhysicsSystem (Tween-based移動, 速度, 境界制限) in tests/unit/systems/PhysicsSystem.test.ts
- [x] T032 [P] [US1] Unit test for HUD (ボタン生成, イベント発火, 44pt以上サイズ, 状態連動) in tests/unit/ui/HUD.test.ts
- [x] T033 [P] [US1] Unit test for CraneGameScene (シーンライフサイクル, アイテム配置, ゲームフロー) in tests/unit/scenes/CraneGameScene.test.ts
- [x] T034 [P] [US1] Unit test for ResultScene (成功/失敗表示, 新規/既取得メッセージ, ナビゲーション) in tests/unit/scenes/ResultScene.test.ts
- [x] T035 [P] [US1] Integration test for CraneGameFlow (操作→キャッチ→結果→コレクション保存の一連フロー) in tests/integration/CraneGameFlow.test.ts

### Implementation for User Story 1

- [x] T036 [P] [US1] Implement Crane entity (CraneState state machine, positionX, armOpenAngle, heldItem, move/drop/grab/lift/return methods) in src/game/entities/Crane.ts
- [x] T037 [US1] Implement CraneArm (3D arm model: rail + arm body + claws, open/close animation, Tween descend/ascend) in src/game/entities/CraneArm.ts
- [x] T038 [US1] Implement ItemFactory (PartDefinition→THREE.Mesh生成, Group組み立て, MeshToonMaterial, bounceAnimation) in src/game/entities/ItemFactory.ts
- [x] T039 [P] [US1] Implement CatchSystem (craneX + grabRadius vs SpawnedItem位置のBox3交差, baseCatchRate × catchDifficulty成功率計算) in src/game/systems/CatchSystem.ts
- [x] T040 [P] [US1] Implement SpawnSystem (categoryId→ItemRegistry.getByCategory, ランダム選択, areaWidth/areaDepth内ランダム配置) in src/game/systems/SpawnSystem.ts
- [x] T041 [US1] Implement PhysicsSystem (Tween-based crane horizontal movement, arm drop/lift animation, speed from gameSettings) in src/game/systems/PhysicsSystem.ts
- [x] T042 [P] [US1] Implement ParticleEffect (generic particle system: spawn/update/dispose, configurable color/size/lifetime) in src/game/effects/ParticleEffect.ts
- [x] T043 [US1] Implement CatchCelebration (success: パーティクル + 上昇スケール音, fail: やさしいトーン + 励ましメッセージ) in src/game/effects/CatchCelebration.ts
- [x] T044 [US1] Implement HUD (HTML overlay: left/right move buttons + center catch button, 44×44pt+ touch targets, crane state連動でボタン無効化) in src/ui/HUD.ts
- [x] T045 [US1] Implement CraneGameScene (3D crane cabinet scene, SpawnSystem→アイテム配置, InputSystem→Crane操作, CatchSystem→判定, 結果遷移) in src/game/scenes/CraneGameScene.ts
- [x] T046 [US1] Implement ResultScene (success: 3Dモデル表示+名前+祝演出, fail: 励ましメッセージ, 新規:「ずかんに とうろく したよ！」, 既取得:「もう つかまえたよ！」, もういっかい/ずかん/もどるボタン) in src/game/scenes/ResultScene.ts

**Checkpoint**: コアゲームプレイループが完成。CraneGameScene→ResultScene の一連が独立動作可能。MVP 検証可能。

---

## Phase 4: User Story 2 — 図鑑でコレクションを閲覧する (Priority: P2)

**Goal**: キャッチ済みアイテムの3D回転表示・説明文閲覧・未取得シルエット表示・コンプリート演出を提供する

**Independent Test**: 図鑑画面を開き、取得済みアイテムのタップ→3Dモデル回転+説明文、未取得のシルエット表示、全取得時のコンプリート演出を確認

### Tests for User Story 2

> **NOTE**: テストを先に書き、FAIL を確認してから実装に進む

- [x] T047 [P] [US2] Unit test for ZukanScene (カテゴリタブ, アイテムグリッド, 取得/未取得表示, コンプリート検出) in tests/unit/scenes/ZukanScene.test.ts
- [x] T048 [P] [US2] Integration test for CollectionFlow (キャッチ→SaveManager保存→図鑑反映の一連フロー) in tests/integration/CollectionFlow.test.ts

### Implementation for User Story 2

- [x] T049 [P] [US2] Implement ZukanOverlay (detail view: 3Dモデル自動回転表示, ひらがな説明文, レアリティ表示, 閉じるボタン) in src/ui/ZukanOverlay.ts
- [x] T050 [US2] Implement ZukanScene (カテゴリ横スクロールタブ, アイテムグリッド: 取得済み=カラー/未取得=シルエット+？マーク, タップで ZukanOverlay, もどるボタン) in src/game/scenes/ZukanScene.ts
- [x] T051 [US2] Add category complete celebration (全アイテム取得検出 → 特別演出 + サウンド) to ZukanScene in src/game/scenes/ZukanScene.ts

**Checkpoint**: 図鑑機能が独立動作可能。コレクション閲覧・シルエット・コンプリート演出が確認可能

---

## Phase 5: User Story 3 — カテゴリを選択してゲームを開始する (Priority: P3)

**Goal**: タイトル画面 → カテゴリ選択画面 → クレーンゲーム画面の導線を完成させる

**Independent Test**: タイトル画面表示 → 「あそぶ」→ カテゴリ選択 → 「どうぶつ」タップ → クレーンゲーム開始の遷移確認

### Tests for User Story 3

> **NOTE**: テストを先に書き、FAIL を確認してから実装に進む

- [x] T052 [P] [US3] Unit test for TitleScene (タイトル表示, あそぶ/ずかんボタン遷移) in tests/unit/scenes/TitleScene.test.ts
- [x] T053 [P] [US3] Unit test for CategorySelectScene (カテゴリ一覧, 解放/未解放表示, 選択遷移) in tests/unit/scenes/CategorySelectScene.test.ts
- [x] T054 [P] [US3] Integration test for SceneTransition (title→categorySelect→craneGame→result→title/zukan全遷移) in tests/integration/SceneTransition.test.ts

### Implementation for User Story 3

- [x] T055 [P] [US3] Implement TitleScene (ゲームタイトルひらがな表示, 「あそぶ」→categorySelect, 「ずかん」→zukan, ポップな配色) in src/game/scenes/TitleScene.ts
- [x] T056 [US3] Implement CategorySelectScene (CategoryRegistry.getAll()一覧, 解放済み=タップ→craneGame{categoryId}, 未解放=「きんきゅう」ラベル+グレーアウト, もどるボタン) in src/game/scenes/CategorySelectScene.ts
- [x] T057 [US3] Wire full scene navigation in src/main.ts — 全5シーン登録, SceneManager起動シーンを title に設定, 全遷移パス接続

**Checkpoint**: ゲーム全体の画面遷移が完成。タイトルからゲームプレイ→結果→図鑑の全フローが動作

---

## Phase 6: User Story 4 — はじめてのチュートリアル (Priority: P4)

**Goal**: 初回プレイ時のステップバイステップ操作ガイドを実装し、5歳児でも直感的にクレーン操作を学べるようにする

**Independent Test**: SaveManager の tutorialCompleted=false 状態で CraneGameScene に入り、チュートリアルが自動開始 → 指示に従い操作完了 → 次回以降スキップを確認

### Tests for User Story 4

> **NOTE**: テストを先に書き、FAIL を確認してから実装に進む

- [ ] T058 [P] [US4] Unit test for TutorialSystem (ステップ進行, 完了判定, スキップ条件) in tests/unit/systems/TutorialSystem.test.ts
- [ ] T059 [P] [US4] Unit test for TutorialOverlay (ガイド表示, ハイライト, アニメーション) in tests/unit/ui/TutorialOverlay.test.ts

### Implementation for User Story 4

- [ ] T060 [US4] Implement TutorialSystem (step-by-step guide: 「くれーんを みぎに うごかしてみよう！」→「ぼたんを おしてみよう！」, step completion detection, SaveManager.setTutorialCompleted) in src/game/systems/TutorialSystem.ts
- [ ] T061 [US4] Implement TutorialOverlay (ひらがな指示テキスト, 操作対象ハイライト, 指アニメーション, ステップ進行表示) in src/ui/TutorialOverlay.ts
- [ ] T062 [US4] Integrate tutorial with CraneGameScene — SaveManager.isTutorialCompleted() チェック, 初回時 TutorialSystem 起動, 完了後通常ゲームフロー in src/game/scenes/CraneGameScene.ts

**Checkpoint**: 初回プレイ時のチュートリアルが動作。2回目以降は自動スキップ

---

## Phase 7: User Story 5 — タイトル画面の表示と導線 (Priority: P5)

**Goal**: タイトル画面のビジュアルを洗練し、ポップで楽しい第一印象を演出する

**Independent Test**: 起動時にタイトル画面が表示され、3D背景アニメーション・ポップな配色・ひらがなタイトルが確認できる

### Implementation for User Story 5

- [ ] T063 [US5] Add decorative 3D background animation (floating items, gentle rotation, colorful particles) to TitleScene in src/game/scenes/TitleScene.ts
- [ ] T064 [US5] Polish title screen visual design (universe-kids-race踏襲のポップ配色, 大きなボタン, ひらがなタイポグラフィ, ゲームロゴ) in src/game/scenes/TitleScene.ts

**Checkpoint**: タイトル画面が洗練され、子供が「あそびたい！」と感じるビジュアルが完成

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: 複数ストーリーにまたがる改善と最終品質保証

- [ ] T065 [P] Create global CSS styling for all HTML overlay UI elements (buttons, overlays, text) in src/style.css
- [ ] T066 Performance optimization — ジオメトリ・マテリアル再利用, シーン exit 時の proper dispose, RAF 最適化
- [ ] T067 [P] Create GitHub Actions CI/CD workflow (test → typecheck → build → deploy to GitHub Pages) in .github/workflows/deploy.yml
- [ ] T068 Run quickstart.md validation — 全フロー手動テスト (title→category→game→catch→result→zukan→title, チュートリアル, コレクション永続化, 横向き強制)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存なし — 即時開始可能
- **Foundational (Phase 2)**: Setup 完了が必要 — **全ユーザーストーリーをブロック**
- **User Stories (Phase 3-7)**: Foundational 完了が必要
  - 各ストーリーは並列実行可能（チーム開発時）
  - または優先順（P1 → P2 → P3 → P4 → P5）で順次実行
- **Polish (Phase 8)**: 全ユーザーストーリー完了が必要

### User Story Dependencies

- **US1 (P1)**: Foundational 完了後に開始可能。他ストーリーへの依存なし → **MVP**
- **US2 (P2)**: Foundational 完了後に開始可能。US1 と独立テスト可能（SaveManager 経由でデータ連携）
- **US3 (P3)**: Foundational 完了後に開始可能。全シーン接続のため US1/US2 のシーンが必要（T057 の full wiring で統合）
- **US4 (P4)**: US1 の CraneGameScene 完了後に開始推奨（チュートリアルは CraneGameScene 上で動作）
- **US5 (P5)**: US3 の TitleScene 完了後に開始推奨（TitleScene のビジュアル強化）

### Within Each User Story

1. テストを先に書き、FAIL を確認する（TDD Red）
2. 最小限の実装で テストを通す（TDD Green）
3. リファクタリング（TDD Refactor）
4. Models → Systems → Effects → UI → Scene の順で実装
5. Scene は各コンポーネント完了後に統合

### Parallel Opportunities

- **Phase 1**: T003, T004, T005 は並列実行可能
- **Phase 2**: T006-T013（テスト8件）は全て並列実行可能。T015-T019（Registry + Config）は並列実行可能
- **Phase 3 (US1)**: T027-T035（テスト9件）は全て並列。T036, T039, T040, T042 は並列実行可能
- **Phase 4 (US2)**: T047, T048（テスト）は並列。T049 は独立
- **Phase 5 (US3)**: T052-T054（テスト）は並列。T055 は独立
- **Phase 6 (US4)**: T058, T059（テスト）は並列
- **US1, US2 は Foundational 完了後に並列開始可能**（異なるシーン・ファイル）

---

## Parallel Example: User Story 1

```bash
# Step 1: テストを全て並列で作成 (T027-T035)
Task: "Unit test for Crane entity in tests/unit/entities/Crane.test.ts"
Task: "Unit test for ItemFactory in tests/unit/entities/ItemFactory.test.ts"
Task: "Unit test for CatchSystem in tests/unit/systems/CatchSystem.test.ts"
Task: "Unit test for SpawnSystem in tests/unit/systems/SpawnSystem.test.ts"
Task: "Unit test for PhysicsSystem in tests/unit/systems/PhysicsSystem.test.ts"
Task: "Unit test for HUD in tests/unit/ui/HUD.test.ts"

# Step 2: 独立エンティティ・システムを並列で実装 (T036, T039, T040, T042)
Task: "Implement Crane entity in src/game/entities/Crane.ts"
Task: "Implement CatchSystem in src/game/systems/CatchSystem.ts"
Task: "Implement SpawnSystem in src/game/systems/SpawnSystem.ts"
Task: "Implement ParticleEffect in src/game/effects/ParticleEffect.ts"

# Step 3: 依存タスクを順次実装 (T037→T038, T041→T043, T044, T045→T046)
Task: "Implement CraneArm in src/game/entities/CraneArm.ts"           # depends on Crane
Task: "Implement ItemFactory in src/game/entities/ItemFactory.ts"
Task: "Implement PhysicsSystem in src/game/systems/PhysicsSystem.ts"   # depends on Crane
Task: "Implement CatchCelebration in src/game/effects/CatchCelebration.ts"  # depends on ParticleEffect
Task: "Implement HUD in src/ui/HUD.ts"

# Step 4: シーン統合 (T045, T046)
Task: "Implement CraneGameScene in src/game/scenes/CraneGameScene.ts"
Task: "Implement ResultScene in src/game/scenes/ResultScene.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup 完了
2. Phase 2: Foundational 完了 (**CRITICAL** — 全ストーリーをブロック)
3. Phase 3: User Story 1 完了
4. **STOP and VALIDATE**: CraneGameScene → ResultScene の独立動作を確認
5. MVP としてデプロイ/デモ可能

### Incremental Delivery

1. Setup + Foundational → 基盤完了
2. **US1 完了** → コアゲームプレイ動作確認 → **MVP デプロイ** 🎯
3. **US2 追加** → 図鑑機能追加 → デプロイ
4. **US3 追加** → 全画面遷移完成 → デプロイ
5. **US4 追加** → チュートリアル追加 → デプロイ
6. **US5 追加** → タイトル画面洗練 → デプロイ
7. **Polish** → 最終品質保証 → **正式リリース**

### Parallel Team Strategy

チーム開発の場合:

1. 全員で Setup + Foundational を完了
2. Foundational 完了後:
   - **Developer A**: US1（コアゲームプレイ）
   - **Developer B**: US2（図鑑）
3. US1/US2 完了後:
   - **Developer A**: US3（画面遷移統合）
   - **Developer B**: US4（チュートリアル）
4. US5 + Polish は最後にまとめて実施

---

## Notes

- [P] タスク = 異なるファイル、依存なし → 並列実行可能
- [Story] ラベル = 対応するユーザーストーリーへのトレーサビリティ
- 各ユーザーストーリーは独立して完了・テスト可能
- TDD サイクル厳守: Red → Green → Refactor
- タスク完了ごとまたは論理的グループごとにコミット
- Checkpoint でストーリーの独立動作を検証
- Three.js 依存部のテストは vi.mock('three') でモック化
- 全 UI テキストはひらがな中心（対象年齢5〜10歳）
- 外部アセットファイル不使用 — 3D モデル・サウンドは全てプロシージャル生成
