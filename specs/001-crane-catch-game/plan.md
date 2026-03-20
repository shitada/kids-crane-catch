# Implementation Plan: クレーンキャッチゲーム（差分更新: UFOキャッチャー型プロング + BGMシーン呼び出し）

**Branch**: `001-crane-catch-game` | **Date**: 2026-03-20 | **Spec**: specs/001-crane-catch-game/spec.md
**Input**: Feature specification from `/specs/001-crane-catch-game/spec.md`

## Summary

2つの変更をクレーンキャッチゲームに適用する:

1. **UFOキャッチャー型アームへの変更**: CraneArm.ts の半トーラスアーク（ringLeft/ringRight）を削除し、2本のプロング（curved claw fingers）をヒンジで取り付けた構造に変更。各プロングは CylinderGeometry（棒部分）+ SphereGeometry（先端の曲がり部分）で構成。open() で V字型に広がり、close() で閉じる。
2. **BGMのシーン呼び出し**: TitleScene.ts の enter() で audioManager.playBGM('title')、exit() で stopBGM() を呼び出し。CraneGameScene.ts の enter() で audioManager.playBGM('game')、exit() で stopBGM() を呼び出し。

## Technical Context

**Language/Version**: TypeScript ^5.7.0 (strict mode)
**Primary Dependencies**: Three.js ^0.170.0, Vite ^6.0.0
**Storage**: localStorage (SaveManager)
**Testing**: Vitest ^3.0.0 + jsdom ^28.1.0
**Target Platform**: iPad Safari (landscape) 最優先、モダンブラウザ
**Project Type**: web-app (browser game)
**Performance Goals**: 60fps 安定維持
**Constraints**: 外部アセット不使用（3D/音声ともプロシージャル生成）、オフライン対応
**Scale/Scope**: 5画面シーン、8種アイテム（どうぶつカテゴリ）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. TDD (NON-NEGOTIABLE) | ✅ PASS | CraneArm テスト更新必要、BGM 呼び出しテスト追加必要 |
| II. Data-Driven Extensibility | ✅ PASS | 変更はコアロジックに影響なし |
| III. Child-First UI/UX | ✅ PASS | アーム形状変更は見た目の改善（UFOキャッチャーらしさ向上）、BGM は体験向上 |
| IV. Performance & Quality | ✅ PASS | プロングは軽量ジオメトリ（CylinderGeometry + SphereGeometry）、BGM は既存 AudioManager 利用 |
| V. Safety & Education | ✅ PASS | 変更なし |

**Post-Design Re-check**: ✅ 全原則パス。プロング構造は TorusGeometry より軽量。BGM 呼び出しは既存 API の利用のみ。

## Project Structure

### Documentation (this feature)

```text
specs/001-crane-catch-game/
├── plan.md              # This file (updated 2026-03-20)
├── research.md          # Phase 0 output (updated: §11 プロング設計, §12 BGMシーン呼び出し)
├── data-model.md        # Phase 1 output (updated: CraneArm プロング構造)
├── quickstart.md        # Phase 1 output (unchanged)
├── contracts/           # Phase 1 output (updated: TitleScene BGM追加)
│   └── scene-contracts.md
└── tasks.md             # Phase 2 output
```

### Source Code (変更対象ファイル)

```text
src/game/
├── entities/
│   └── CraneArm.ts          # 半トーラスリング → UFOキャッチャー型2本プロングに全面書き換え
├── scenes/
│   ├── TitleScene.ts         # enter() に playBGM('title')、exit() に stopBGM() 追加
│   └── CraneGameScene.ts    # enter() に playBGM('game')、exit() に stopBGM() 追加
└── audio/
    └── AudioManager.ts       # 変更なし（playBGM/stopBGM 実装済み）

tests/
├── unit/
│   ├── entities/
│   │   └── CraneArm.test.ts       # プロング構造のテストに更新
│   └── scenes/
│       ├── TitleScene.test.ts      # BGM 呼び出し検証テスト追加
│       └── CraneGameScene.test.ts  # BGM 呼び出し検証テスト追加
```

**Structure Decision**: 既存のディレクトリ構造を維持。変更は3つのソースファイルと3つのテストファイルに限定。

## Complexity Tracking

変更は Constitution 違反なし。追加の正当化不要。

| Change | Impact | Files |
|--------|--------|-------|
| CraneArm プロング化 | CraneArm.ts 全面書き換え、テスト更新 | 2 files |
| BGM シーン呼び出し | TitleScene/CraneGameScene に 2行ずつ追加 | 4 files |
