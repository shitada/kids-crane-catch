# 🏗️ クレーンキャッチ — Kids Crane Catch

5〜10歳向けの3Dクレーンキャッチャー（UFOキャッチャー）ゲーム。クレーンを操作して、いろんな のりものを あつめよう！

🎮 プレイはこちら → [https://shitada.github.io/kids-crane-catch2/](https://shitada.github.io/kids-crane-catch2/)

iPad Safari での横向きプレイに最適化されています。

## ゲーム概要

- 🕹️ バーチャルジョイスティックでクレーンを操作、ボタンでアームを降下
- 🏗️ 二本爪のリアルなクレーンアームがアイテムをつかむ → ドロップボックスに落とす
- 🚗 「のりもの」カテゴリの8種類を集めよう（しんかんせん、ひこうき、バス、パトカー、ショベルカー、ヘリコプター、ロケット、ふね）
- 📖 図鑑でコレクションを確認。タップすると3Dモデルが動いて音が鳴る！
- 🎵 和音ベースのプロシージャルBGM（ホーム / ゲーム / 結果画面で異なる曲調）
- 🎆 全アイテム収集で花火演出！

## 技術スタック

| 項目 | 技術 |
|---|---|
| 3D レンダリング | Three.js v0.170 |
| 言語 | TypeScript 5.7 |
| ビルド | Vite 6 |
| テスト | Vitest 3 |
| サウンド | Web Audio API（OscillatorNode / GainNode） |
| フォント | Zen Maru Gothic（Google Fonts） |
| デプロイ | GitHub Pages + GitHub Actions |

## 開発

```bash
# 依存インストール
npm install

# 開発サーバー起動
npm run dev

# テスト実行
npm run test

# ビルド
npm run build
```

## プロジェクト構成

```
src/
├── main.ts                      # エントリポイント
├── types/index.ts               # 型定義
├── game/
│   ├── GameLoop.ts              # RAF ベースのゲームループ
│   ├── SceneManager.ts          # シーン管理・遷移
│   ├── audio/
│   │   ├── AudioManager.ts      # Web Audio API 管理
│   │   ├── BGMGenerator.ts      # 和音 BGM 生成（title/play/result）
│   │   └── SFXGenerator.ts      # 効果音（キャッチ/ミス/乗り物固有音）
│   ├── config/
│   │   ├── GameSettings.ts      # ゲーム設定定数
│   │   ├── MachineConfig.ts     # クレーンマシンカテゴリ定義
│   │   └── VehicleEncyclopedia.ts # 図鑑データ
│   ├── entities/
│   │   ├── CraneMachine.ts      # ゲーム機筐体 3D モデル
│   │   ├── CraneArm.ts          # 二本爪アーム（開閉/降下/ドロップ）
│   │   ├── ItemPool.ts          # アイテム配置管理
│   │   └── vehicles/            # 8種のプロシージャル 3D 乗り物モデル
│   ├── effects/
│   │   ├── CatchEffect.ts       # キャッチ成功パーティクル
│   │   └── MissEffect.ts        # ミスエフェクト
│   ├── scenes/
│   │   ├── TitleScene.ts        # タイトル画面
│   │   ├── MachineSelectScene.ts # マシン選択画面
│   │   ├── PlayScene.ts         # プレイ画面（メインゲーム）
│   │   ├── ResultScene.ts       # 結果画面（花火演出対応）
│   │   └── EncyclopediaScene.ts # 図鑑画面
│   ├── storage/
│   │   └── SaveManager.ts       # localStorage セーブデータ管理
│   └── systems/
│       ├── CraneController.ts   # クレーン操作ロジック
│       ├── CatchSystem.ts       # キャッチ判定
│       └── InputSystem.ts       # 入力管理
├── ui/
│   ├── VirtualJoystick.ts       # バーチャルジョイスティック
│   ├── DropButton.ts            # 「おろす」ボタン
│   ├── HUD.ts                   # 残り回数・カテゴリ名表示
│   ├── EncyclopediaOverlay.ts   # 図鑑オーバーレイ（3Dプレビュー付き）
│   └── HomeButton.ts            # ホームボタン
tests/                           # ユニットテスト（28テスト）
```

## ライセンス

MIT
