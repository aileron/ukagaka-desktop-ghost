# 🎭 Ukagaka Desktop Ghost

伺か（うかがか）ゴーストをデスクトップで動作させるTauriアプリケーションです。
透明ウィンドウでゴーストを表示し、本物の伺かのような体験を提供します。

## ✨ 機能

- 🖼️ **伺かゴースト表示** - Surface画像の表示とアニメーション
- 🎨 **グリーンバック透過** - `#00FF00`を自動で透過処理
- 🖱️ **ドラッグ移動** - ゴーストをドラッグして自由に移動
- 🪟 **ウィンドウ制御** - 最前面表示切り替え（デフォルトOFF）
- 📱 **デスクトップ統合** - 透明ウィンドウ・タスクバー非表示

## 📚 ドキュメント

技術仕様書と実装ガイドは `/docs` ディレクトリにあります：

- 📋 **[全体仕様書](./docs/ukagaka-specification.md)** - システム概要と基本概念
- 📝 **[さくらスクリプト仕様](./docs/sakura-script-specification.md)** - スクリプト構文と実装
- 🤖 **[SHIORI仕様](./docs/shiori-specification.md)** - 会話エンジンの設計
- 🛣️ **[実装ロードマップ](./docs/implementation-roadmap.md)** - 開発計画とマイルストーン

詳細は **[ドキュメント索引](./docs/README.md)** をご覧ください。

## 🚀 セットアップ

### 必要な依存関係

- Node.js 18+
- pnpm
- Rust (Tauri用)

### インストール

```bash
# 依存関係をインストール
pnpm install

# Rustツールチェーンのインストール（初回のみ）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 開発サーバー起動

```bash
# Tauri開発サーバーを起動
pnpm tauri dev
```

### ビルド

```bash
# 本番用ビルド
pnpm tauri build
```

## 🎮 使い方

### コントロールパネル

ゴーストの上部に表示されるコントロールパネルで操作できます：

**Surface切り替え**
- 通常 - デフォルトの表情
- 笑顔 - 笑顔の表情  
- 困り - 困った表情
- 相方 - パートナーキャラクター
- 隠す - ゴーストを非表示

**位置移動**
- ↖左上 - 画面左上角に移動
- ↗右上 - 画面右上角に移動
- ↙左下 - 画面左下角に移動
- ↘右下 - 画面右下角に移動

### インタラクション

- **ゴーストをクリック** - Surfaceが順番に切り替わります
- **ドラッグ** - 今後実装予定

## 📁 ゴーストファイル

プロジェクトには「N_HokanSakura021214」ゴーストが含まれています：

```
public/ghost/N_HokanSakura021214/
├── ghost/master/          # 会話データ・設定
│   ├── descript.txt       # ゴーストの基本設定
│   ├── shiori.dll         # 会話AI（KAWARI）
│   └── ...
└── shell/master/          # 表面画像
    ├── surface0.png       # メインキャラクター
    ├── surface1.png       # 表情バリエーション
    ├── surface10.png      # パートナーキャラクター
    └── ...
```

## 🛠️ 技術スタック

- **フロントエンド**: React + TypeScript + Vite
- **デスクトップ**: Tauri (Rust)
- **画像処理**: Canvas API (グリーンバック透過)
- **ウィンドウ管理**: Tauri Window API

## 🎨 カスタマイズ

### 他のゴーストを追加

1. `public/ghost/` に新しいゴーストフォルダを配置
2. `src/Ghost.tsx` の `ghostName` プロパティを変更

### 透過色の変更

`src/Ghost.tsx` の `processImage` 関数で透過色を調整できます：

```typescript
// 緑色(#00FF00)を透過 + 近似色も透過
if (r < 30 && g > 200 && b < 30) {
  data[i + 3] = 0; // アルファ値を0にして透過
}
```

## 📋 今後の予定

- [ ] 吹き出し表示（さくらスクリプト対応）
- [ ] ランダムトーク機能
- [ ] ドラッグ移動
- [ ] アニメーション機能
- [ ] SHIORI（会話AI）のJavaScript実装
- [ ] 複数ゴーストの切り替え

## 📄 ライセンス

MIT License

## 🙏 クレジット

- 伺かゴーストシステム
- N_HokanSakura021214 ゴースト制作者様

## 推奨IDE設定

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
