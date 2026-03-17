# Research: クレーンキャッチゲーム

**Phase**: 0 — Outline & Research  
**Date**: 2026-03-17  
**Status**: Complete

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
