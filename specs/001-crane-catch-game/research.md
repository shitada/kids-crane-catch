# Research: クレーンキャッチゲーム

**Phase**: 0 — Outline & Research  
**Date**: 2026-03-17  
**Status**: Complete（差分更新: 3段階つかむ動作 + BGM和音メロディ + 動物の目追加 + 図鑑グリッド）

## 1. Three.js クレーン物理演算アプローチ

**Decision**: シンプルなステートマシン + Tween ベースのアニメーション（物理エンジン不使用）

**Rationale**:
- クレーンの動きは予測可能で制御しやすい必要がある（対象年齢5〜10歳）
- 物理エンジン（Cannon.js, Ammo.js）は過剰で、パフォーマンスコスト・バンドルサイズが増大する
- アーム下降→掴み→上昇の動作はステートマシン（IDLE → MOVING → DROPPING → GRABBING → LIFTING → RETURNING）で表現可能
- キャッチ判定はバウンディングボックス（Box3）の交差判定で十分
- 「掴んだが途中で落とす」挙動は確率ベースでシミュレート（距離・重さによる成功率計算）

**Alternatives considered**:
- Cannon.js 物理エンジン → バンドルサイズ大（~300KB）、子供向けには制御が不安定になりやすい
- カスタム物理シミュレーション → 開発コスト高、チューニング困難
- 純粋なアニメーション（Tween のみ）→ 選択。ゲーム感として十分で子供にとって予測しやすい

## 2. プロシージャル3Dモデル生成（どうぶつ）

**Decision**: Three.js 基本ジオメトリの組み合わせ + MeshToonMaterial でローポリ・トゥーン調のどうぶつを生成

**Rationale**:
- 子供向けのシンプルでカワイイ見た目が求められる
- 基本ジオメトリ（SphereGeometry, CylinderGeometry, BoxGeometry, ConeGeometry）の組み合わせで十分なバリエーションが作れる
- MeshToonMaterial でアニメ調の見た目を実現し、「ポップで親しみやすい」デザイン要件を満たす
- 各動物は「ボディパーツ定義」をデータとして持ち、ItemFactory がパラメータから Group を構築
- データ駆動のため、新しい動物の追加はパーツ定義の追加のみ

**動物パーツ構成例（ライオン）**:
```
body: { shape: 'sphere', scale: [1, 0.9, 0.8], color: 0xD4A017 }
head: { shape: 'sphere', scale: [0.6, 0.6, 0.6], color: 0xD4A017, position: [0, 0.8, 0.4] }
mane: { shape: 'sphere', scale: [0.75, 0.75, 0.3], color: 0x8B6914, position: [0, 0.8, 0.3] }
ears: [...]
eyes: [...]
legs: [...]
tail: { shape: 'curve', ... }
```

**Alternatives considered**:
- GLB/GLTF ファイル読み込み → 仕様で外部ファイル不使用と明記
- SDF（Signed Distance Field）ベース → 複雑すぎる、パフォーマンスコスト高
- 2D スプライト → 仕様が3Dモデル回転表示を要求しているため不適

## 3. Web Audio API プロシージャルサウンド

**Decision**: AudioContext + OscillatorNode + GainNode による効果音・BGM の実行時生成

**Rationale**:
- 仕様で外部音声ファイル不使用と明記
- universe-kids-race の AudioManager パターンを踏襲
- 効果音はオシレーターの周波数・エンベロープ制御で生成：
  - キャッチ成功: 上昇スケール（ドミソ♪）
  - キャッチ失敗: やさしいトーン（ポワン）
  - ボタンタップ: 短いクリック音
  - コンプリート: ファンファーレ（複数オシレーター）
- BGM はシンプルなループメロディ（短いフレーズの繰り返し）
- iPad Safari の AudioContext 制限対応: ユーザータッチイベントで resume()

**Alternatives considered**:
- Tone.js ライブラリ → 外部依存の追加（Constitution: 大型ライブラリ追加は要検討）。Web Audio API 直接使用で十分
- MIDI.js → 同上、過剰な機能
- 音声なし → エッジケースとしてはあり得るが、フィードバック体験として必須

## 4. データ駆動設計（Registry パターン）

**Decision**: TypeScript の型安全な定義ファイル + Registry パターンでカテゴリ・アイテムを管理

**Rationale**:
- Constitution Principle II が「宣言的データ定義」「コアロジック変更不要」を要求
- カテゴリ追加の流れ:
  1. `config/items.ts` に新カテゴリのアイテム定義を追加
  2. `config/categories.ts` に新カテゴリ定義を追加
  3. 完了（他のファイル変更不要）
- Registry はシンプルな Map ベース（DI コンテナなどは不要）
- 型定義で不正なデータ構造をコンパイル時に検出

**構成**:
```typescript
// CategoryRegistry: Map<CategoryId, CategoryDefinition>
// ItemRegistry: Map<ItemId, ItemDefinition>
// 起動時に config から自動登録
```

**Alternatives considered**:
- JSON ファイルでデータ定義 → 型安全性が失われる。TypeScript の const 定義の方が適切
- データベース（IndexedDB） → 過剰。静的データは TypeScript 定義で十分
- Plugin アーキテクチャ → YAGNI。Registry で十分な拡張性

## 5. localStorage 永続化戦略

**Decision**: SaveManager クラスで JSON シリアライズ・デシリアライズ。バージョニング付き

**Rationale**:
- universe-kids-race の SaveManager パターンを踏襲
- 保存データ: コレクション状態（取得済みアイテムID + 取得日時）、チュートリアル完了フラグ
- データスキーマにバージョン番号を付与し、将来のマイグレーションに対応
- localStorage 利用不可時はメモリ内フォールバック（セッション内のみ有効）

**保存データ構造**:
```typescript
interface SaveData {
  version: number;
  collection: Record<string, { capturedAt: string }>;  // itemId → 取得情報
  tutorialCompleted: boolean;
  settings: { bgmEnabled: boolean; sfxEnabled: boolean };
}
```

**Alternatives considered**:
- IndexedDB → 保存データ量が少ないため過剰
- Cookie → サイズ制限が厳しく不適切
- sessionStorage → ブラウザ閉じると消えるため図鑑の永続化要件を満たさない

## 6. iPad Safari 横向き最適化

**Decision**: CSS メディアクエリ + JavaScript orientation API でレスポンシブ対応。固定アスペクト比でレンダリング

**Rationale**:
- iPad Safari 横向きが最優先ターゲット
- Three.js の renderer を画面サイズに合わせてリサイズ
- UI 要素は CSS で position: absolute、%ベースまたは vw/vh ベースで配置
- 縦向き検出時は `OrientationGuard` コンポーネントが回転促進メッセージを表示し、ゲーム操作をブロック
- 安全領域（safe-area-inset）に対応し、ノッチ/ホームバー領域を避ける

**Alternatives considered**:
- 縦横両対応 → 開発コスト増大。仕様で横向き最適化と明記
- 画面ロック API（screen.orientation.lock） → Safari 未サポート。CSSメッセージで代替

## 7. タッチ入力設計

**Decision**: PointerEvent API ベースの入力システム + 画面上のバーチャルコントローラー

**Rationale**:
- タッチとマウスの統一処理が PointerEvent で可能
- クレーン操作:
  - 左右ボタン（画面下部）でクレーン水平移動
  - 中央のキャッチボタンでアーム降下
  - スワイプ操作もサポート（InputSystem で閾値判定）
- ボタンサイズは 44x44pt 以上（Constitution Principle III 準拠）
- 連打防止: アーム動作中（DROPPING/GRABBING/LIFTING/RETURNING 状態）は入力を無視
- universe-kids-race の InputSystem パターンを踏襲（moveDirection, actionPressed）

**Alternatives considered**:
- TouchEvent API → PointerEvent の方が統一的で将来的にマウス対応も容易
- 画面ドラッグでクレーン直接移動 → 5歳児には直感的でない可能性。ボタン＋スワイプの併用が安全
- ジョイスティックUI → 過剰。左右＋キャッチの3ボタンで十分

## 8. テスト戦略

**Decision**: TDD サイクル厳守。ユニットテスト（ロジック中心）+ インテグレーションテスト（フロー）

**Rationale**:
- Constitution Principle I（TDD NON-NEGOTIABLE）に準拠
- ユニットテスト対象:
  - ゲームロジック（CatchSystem, PhysicsSystem, SpawnSystem）
  - 状態管理（Crane ステートマシン, SaveManager）
  - データ定義（categories, items の整合性検証）
  - Registry（登録・取得・存在チェック）
  - UI コンポーネント（HUD, TutorialOverlay）← jsdom 環境
- インテグレーションテスト対象:
  - クレーンゲームフロー（操作→キャッチ→結果の一連）
  - コレクションフロー（キャッチ→保存→図鑑反映）
  - シーン遷移（タイトル→カテゴリ→ゲーム→結果→図鑑）
- Three.js モック: `vi.mock('three')` でジオメトリ・マテリアル・シーンをモック化
- テスト環境: node（ロジック）/ jsdom（DOM操作・UI）

**Alternatives considered**:
- E2E テスト（Playwright） → 初期リリースではユニット＋インテグレーションで十分。後続で追加検討
- Storybook → ゲームUIには不向き。Three.js ベースのため通常の UI テストで対応

## 9. デプロイ戦略（GitHub Pages + Actions）

**Decision**: universe-kids-race と同じ GitHub Actions ワークフローを踏襲

**Rationale**:
- main ブランチへのプッシュで自動デプロイ
- ビルド: `tsc && vite build`
- デプロイ先: GitHub Pages（`/kids-crane-catch/` パス）
- CI: テスト実行 → 型チェック → ビルド → デプロイ
- Vite の `base` 設定を `/kids-crane-catch/` に変更

**Alternatives considered**:
- Vercel/Netlify → GitHub Pages で十分。外部サービス依存を増やさない
- 手動デプロイ → CI/CD を Constitution Quality Gates が要求

## 10. クレーン4方向移動（X-Z 2軸）設計

**Decision**: X軸のみ → X-Z 2軸移動に拡張。PhysicsSystem に moveXZ メソッド追加、InputState を2D方向オブジェクトに変更

**Rationale**:
- 仕様で「上下左右に動かして2D平面上で位置を決め」と明記されている（FR-002）
- Z軸は「奥行き」に対応。Three.js の座標系で X=左右、Z=手前/奥が自然
- CraneConfig に minZ/maxZ を追加するだけで範囲を設定可能（Data-Driven 原則に適合）
- CatchSystem の距離判定を X-Z ユークリッド距離（`Math.sqrt(dx*dx + dz*dz)`）に変更

## 11. クレーン3段階つかむ動作

**Decision**: DROPPING ステート開始時に `craneArm.open()`、GRABBING ステートで `craneArm.close()` → 判定。現在の `close()` at DROPPING を修正

**Rationale**:
- 仕様 FR-003 で「開く → 下に降りる → 閉じてつかむ」の3段階が明記
- ゲームセンターのリアルなクレーンは、アームが開いた状態で降下し、底に到達してから閉じてアイテムを掴む
- 現状の実装は DROPPING で `close()` を呼んでおり、仕様と逆の挙動になっている
- CraneArm の `open()` / `close()` メソッド自体は変更不要。呼び出しタイミングの修正のみ
- CraneGameScene.update() の switch ケースを2箇所変更するだけで完了

**Alternatives considered**:
- アニメーション状態を追加（OPENING, CLOSING を分離） → 過剰。open/close は即座にターゲットスケール設定するだけで、補間は update() で行われるため現在の DROPPING/GRABBING で十分
- CraneArm 側に状態管理を移動 → YAGNI。Scene 側で呼び分けるのがシンプル

## 12. BGM和音メロディシーケンス設計

**Decision**: AudioManager の `playBGM()` を和音メロディシーケンス再生に書き直し。タイトル用・ゲーム用の2パターン。OscillatorNode × 3 で和音生成、フェードイン/アウト対応

**Rationale**:
- 仕様 FR-013 で「BGMは単音ではなく和音を用いた『るんるんする』メロディ」と明記
- 仕様 FR-013a で「タイトル画面とクレーンゲーム画面でそれぞれ異なるBGM」を要求
- 仕様 FR-013b で「画面遷移時にBGMがスムーズに切り替わる（フェードイン/フェードアウト）」を要求
- 現状の実装は単一の sine オシレーター（262Hz 固定）で和音・メロディの要件を満たしていない
- Web Audio API の OscillatorNode を3つ同時に使用して和音（ルート + 3rd + 5th）を構成
- メロディはノート配列として定義し、setValueAtTime / linearRampToValueAtTime で周波数をスケジューリング
- フェードイン: gainNode.gain を 0 → 0.08 へ 0.5秒で linearRamp
- フェードアウト: gainNode.gain を current → 0 へ 0.3秒で linearRamp、完了後に osc.stop()
- Constitution Principle IV の範囲内（同時発音3〜4音は CPU 負荷微小）

**メロディパターン設計**:
- タイトル BGM: C major 系 — C4-E4-G4, F4-A4-C5, G4-B4-D5, C4-E4-G4（ゆったり、noteLength=0.5s）
- ゲーム BGM: よりテンポ速め — C4-E4-G4, F4-A4-C5, G4-B4-D5, Am→F→G→C 進行（noteLength=0.3s）
- ループポイント: シーケンス終了後に先頭へ再スケジュール

**Alternatives considered**:
- Tone.js → Constitution で大型ライブラリ追加は要検討と明記。Web Audio API 直接使用で十分な表現力
- MIDI シーケンサー → 過剰。数小節のループメロディに MIDI パーサーは不要
- 単一オシレーターのアルペジオ → 和音感が出ない。仕様の「和音」要件を満たさない

## 13. 動物モデルの目パーツ設計

**Decision**: items.ts の ModelParams に白目（eyeWhite: 0xffffff sphere）+ 黒目（pupil: 0x222222 sphere）を各動物の顔前面に配置。ライオン・ゾウ・キリン・コアラが対象

**Rationale**:
- 仕様 FR-012 で「各動物モデルにはしっかり目（黒目＋白目）を付け、正面から見て何の動物か識別しやすくしなければならない」と明記
- 現状: ライオンは目なし、ゾウは目なし、キリンは目なし、コアラは小さい黒球のみ（白目なし）
- ペンギン・イルカ・ウサギは既に目パーツあり。パンダは eyePatch がキャラクター性を表現
- 白目 + 黒目の2層構造でカートゥーン調の表現力のある目を実現
- パーツは既存の PartDefinition 型をそのまま使用。データ追加のみでコード変更なし
- 各動物の頭部位置・向きに合わせた position 調整が必要（研究済み、plan.md の表を参照）

**Alternatives considered**:
- テクスチャマッピングで目を描画 → 外部ファイル不使用の制約に違反。プロシージャル生成の原則に反する
- 全動物の目を統一サイズ → 動物ごとに頭のサイズ・形が異なるため、個別調整が自然
- 目パーツ無しのまま → 仕様 FR-012 に違反

## 14. 図鑑グリッドレイアウト設計

**Decision**: ZukanScene の CSS グリッドを `repeat(4, 1fr)` 固定4列に変更。8アイテムが2行×4列に整列表示

**Rationale**:
- 仕様 FR-007 で「4列のグリッド（マトリックス）レイアウト（2行×4列）で整列表示」と明記
- 現状は `repeat(auto-fill, minmax(80px, 1fr))` で、画面サイズにより列数が変動する
- iPad 横向き（1024×768 有効サイズ）で8アイテムを4列にすると、各セルが約230px幅で子供にも見やすい
- gap を 10px、min-height を 100px に調整して視認性確保
- CSS のみの変更で完結し、ロジック・型の変更なし

**Alternatives considered**:
- `repeat(auto-fill, minmax(200px, 1fr))` → 画面によっては3列になる可能性。仕様の「4列」を厳密に満たさない
- CSS Flexbox → Grid の方がマトリックスレイアウトに適している
- カテゴリごとに列数を動的変更 → YAGNI。現状「どうぶつ」8種のみで4列固定が最適
- HUD は十字配置（上下左右＋中央キャッチ）で5歳児にも直感的

**InputState 変更**:
```typescript
// Before
interface InputState {
  moveDirection: -1 | 0 | 1;
  catchPressed: boolean;
}

// After
interface InputState {
  moveDirection: { x: -1 | 0 | 1; z: -1 | 0 | 1 };
  catchPressed: boolean;
}
```

**HUD レイアウト（十字配置）**:
```
        [▲]
   [◀] [つかむ] [▶]
        [▼]
```

**Alternatives considered**:
- ジョイスティックUI → 5歳児には複雑すぎる。十字ボタンの方が直感的
- X-Y平面移動（Y=上下）→ Three.js ではY=高さ方向。Z軸使用が3D空間として自然
- `moveDirection` を `[number, number]` タプルに → `{ x, z }` の方が読みやすく型安全

## 11. リング形状デザイン（TorusGeometry）

**Decision**: CraneArm のツメ（ConeGeometry×2）→ リング（TorusGeometry×1）に変更。開閉はスケーリングで表現

**Rationale**:
- 仕様で「リング（丸い輪っか形状）」「包み込むように掴む」と明記されている（FR-003、Key Entities）
- TorusGeometry は Three.js 標準ジオメトリで外部依存なし
- スケーリングによる開閉:
  - `open()`: scale を大きく（1.0）→ リングが大きく開いた状態でアイテムの上から被せる
  - `close()`: scale を小さく（0.3）→ リングが縮小してアイテムを包み込む
- ConeGeometry×2（左右のツメ）→ TorusGeometry×1 に減少し、パーツ数が減ってシンプル
- 視覚的にも丸い輪っかは子供にとって「掴む」動作が分かりやすい

**TorusGeometry パラメータ**:
```typescript
new THREE.TorusGeometry(
  0.3,   // radius: リングの半径
  0.06,  // tube: チューブの太さ
  8,     // radialSegments: パフォーマンス考慮で低め
  16     // tubularSegments: パフォーマンス考慮で低め
);
```

**パフォーマンス影響**:
- ConeGeometry(0.08, 0.5, 6) × 2 = 頂点数約28
- TorusGeometry(0.3, 0.06, 8, 16) × 1 = 頂点数約144
- 差は+116頂点で60fps維持に全く影響なし

**Alternatives considered**:
- ツメ形状維持（ConeGeometry）→ 仕様のリング要件を満たさない
- RingGeometry（平面リング）→ 立体感がなくチープに見える。Torus の方が「輪っか」感がある
- カスタムジオメトリ → 過剰。TorusGeometry で十分
