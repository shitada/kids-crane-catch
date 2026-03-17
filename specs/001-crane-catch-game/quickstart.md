# Quickstart: クレーンキャッチゲーム開発

**Date**: 2026-03-17

## Prerequisites

- Node.js 20+
- npm

## Project Setup

```bash
# リポジトリクローン & ブランチ切り替え
git clone <repo-url> kids-crane-catch
cd kids-crane-catch
git checkout 001-crane-catch-game

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

## npm Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite 開発サーバー起動（ホットリロード対応） |
| `npm run build` | TypeScript 型チェック + Vite ビルド |
| `npm run preview` | ビルド済みファイルのプレビュー |
| `npm test` | Vitest テスト実行（単発） |
| `npm run test:watch` | Vitest テスト実行（ウォッチモード） |

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| TypeScript | ^5.7.0 | 言語（strict モード） |
| Three.js | ^0.170.0 | 3D レンダリング |
| Vite | ^6.0.0 | ビルドツール・開発サーバー |
| Vitest | ^3.0.0 | テストフレームワーク |
| jsdom | ^28.1.0 | DOM テスト環境 |

## Key Configuration Files

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript 設定（strict, ES2022, path alias `@/*`) |
| `vite.config.ts` | Vite 設定（base: `/kids-crane-catch/`, alias） |
| `vitest.config.ts` | テスト設定（globals, environment） |

## Directory Structure

```
src/
├── main.ts              # エントリポイント
├── types/index.ts       # 共通型定義
├── game/                # ゲームコア
│   ├── GameLoop.ts      # ゲームループ
│   ├── SceneManager.ts  # シーン遷移管理
│   ├── audio/           # サウンド生成
│   ├── config/          # データ定義（カテゴリ・アイテム）
│   ├── effects/         # ビジュアルエフェクト
│   ├── entities/        # ゲームエンティティ（クレーン・アイテム）
│   ├── scenes/          # 各画面シーン
│   ├── storage/         # データ永続化
│   └── systems/         # ゲームシステム（入力・物理・キャッチ判定）
└── ui/                  # HTMLオーバーレイUI
tests/
├── unit/                # ユニットテスト
└── integration/         # インテグレーションテスト
```

## TDD Workflow

Constitution Principle I に基づき、すべてのプロダクションコードは TDD サイクルで開発する:

1. **Red**: テストを書く → `npm run test:watch`
2. **Green**: 最小限の実装でテストを通す
3. **Refactor**: リファクタリング（テストが通り続けることを確認）

```bash
# ウォッチモードでテスト駆動開発
npm run test:watch

# 特定ファイルのテストのみ実行
npx vitest run tests/unit/systems/CatchSystem.test.ts
```

## Adding a New Category（データ駆動設計の検証）

新カテゴリ追加時にコアロジック変更が不要であることを確認:

1. `src/game/config/items.ts` にアイテム定義を追加
2. `src/game/config/categories.ts` にカテゴリ定義を追加
3. 完了 — 他のファイル変更不要

## Deploy

GitHub Actions で main ブランチへのプッシュ時に自動デプロイ:

```bash
git push origin 001-crane-catch-game
# PR 作成 → レビュー → main マージ → 自動デプロイ
```

デプロイ先: `https://<username>.github.io/kids-crane-catch/`
