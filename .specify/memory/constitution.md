<!--
  Sync Impact Report
  ==================
  Version change: N/A → 1.0.0 (initial creation)
  Modified principles: N/A (initial)
  Added sections:
    - Core Principles (5 principles)
    - Technology Stack
    - Quality Gates
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ compatible (no changes needed)
    - .specify/templates/spec-template.md ✅ compatible (no changes needed)
    - .specify/templates/tasks-template.md ✅ compatible (no changes needed)
  Follow-up TODOs: None
-->

# Kids Crane Catch Constitution

## Core Principles

### I. Test-Driven Development（NON-NEGOTIABLE）

- TDD サイクルを厳格に遵守しなければならない（MUST）:
  1. テストを書く
  2. テストが失敗することを確認する（Red）
  3. 最小限の実装でテストを通す（Green）
  4. リファクタリングする（Refactor）
- テストフレームワーク: Vitest + jsdom
- ゲームロジック・状態管理のユニットテストカバレッジを重視する
- Three.js 依存部分は Integration テストまたはモックで検証する
- テストなしのプロダクションコードマージは禁止（MUST NOT）

### II. Data-Driven Extensibility

- クレーンキャッチのアイテムカテゴリは宣言的データ定義で
  管理しなければならない（MUST）
- 新カテゴリ追加時にコアロジックの変更は不要とする設計を
  維持しなければならない（MUST）
- カテゴリデータは型安全な定義ファイルとして管理する:
  - アイテム定義（名前・3Dモデルパラメータ・カテゴリ・難易度）
  - ステージ定義（使用カテゴリ・配置ルール・報酬条件）
- Registry パターンでカテゴリを動的に登録・取得する
- データスキーマの変更にはマイグレーション戦略を伴うこと

### III. Child-First UI/UX

- 対象年齢 5〜10歳の子供がひとりで操作できなければならない（MUST）
- テキスト表示はひらがなを基本とする（漢字使用禁止）
- iPad Safari 横向き表示に最適化しなければならない（MUST）
- タッチ操作を前提とし、ボタンは十分な大きさ（最低 44x44pt）を
  確保する
- ポップで親しみやすいビジュアルデザインとする
  （universe-kids-race のフォント・ボタンデザインを踏襲）
- アニメーション・効果音でフィードバックを明確にする
- ゲームオーバー・失敗時もポジティブな表現を使用する

### IV. Performance & Quality

- 60fps を安定的に維持しなければならない（MUST）
- Three.js のレンダリング最適化:
  - ジオメトリ・マテリアルの再利用
  - 不要なオブジェクトの適切な dispose
  - RequestAnimationFrame ベースのゲームループ
- アセットは軽量に保つ（3Dモデルはプロシージャル生成を優先）
- Web Audio API によるサウンド生成（外部音声ファイル不要）
- 初期ロード時間を最小化する（コード分割・遅延読み込み）
- メモリリークを防止する（イベントリスナー・Three.js リソースの
  適切なクリーンアップ）

### V. Safety & Education

- 安全で教育的なコンテンツのみを提供しなければならない（MUST）
- 暴力的・恐怖を煽る・不適切な表現は禁止（MUST NOT）
- 課金要素・外部リンク・広告は含めない（MUST NOT）
- アイテム収集を通じた学習要素を提供する
  （動物・食べ物・乗り物などカテゴリ別の知識）
- アクセシビリティへの配慮:
  - 色覚多様性に対応した配色
  - 十分なコントラスト比
  - 操作ガイダンスの提供

## Technology Stack

- **言語**: TypeScript（strict モード必須）
- **3D レンダリング**: Three.js
- **ビルドツール**: Vite
- **テスト**: Vitest + jsdom
- **サウンド**: Web Audio API（外部音声ファイル不使用）
- **デプロイ**: GitHub Pages + GitHub Actions
- **対応ブラウザ**: iPad Safari（横向き）を最優先、
  モダンブラウザ（Chrome, Firefox, Edge）もサポート
- **外部依存**: 最小限に抑える（Three.js 以外の大型ライブラリ追加は
  要検討・承認）

## Quality Gates

- すべての PR は以下を満たさなければならない（MUST）:
  1. Vitest によるテストが全件パスすること
  2. TypeScript の型チェック（tsc --noEmit）がエラーなしであること
  3. ESLint / Prettier によるコード品質チェックをパスすること
  4. 新規ゲームロジック・状態管理コードにはテストが付随すること
- GitHub Actions による CI パイプラインで自動検証する
- パフォーマンスに影響する変更は 60fps 維持を実機確認すること
- アクセシビリティチェックを定期的に実施すること

## Governance

- この Constitution はプロジェクトの最上位規範であり、
  他のすべてのガイドラインに優先する
- 原則の追加・変更・削除にはドキュメント更新と影響範囲の
  確認を必須とする
- 改定はセマンティックバージョニングに従う:
  - MAJOR: 原則の削除・根本的な再定義
  - MINOR: 新原則の追加・既存原則の重要な拡張
  - PATCH: 文言修正・明確化・誤字修正
- すべての PR レビューで Constitution 準拠を確認すること
- 複雑さの追加には正当な理由を要求する（YAGNI 原則）

**Version**: 1.0.0 | **Ratified**: 2026-03-16 | **Last Amended**: 2026-03-16
