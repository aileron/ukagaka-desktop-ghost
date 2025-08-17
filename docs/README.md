# 伺かゴーストシステム ドキュメント

このディレクトリには、伺かゴーストシステムの実装に関する技術仕様書とドキュメントが含まれています。

## 📚 ドキュメント一覧

### 1. [全体仕様書](./ukagaka-specification.md)
伺かゴーストシステムの全体像と基本概念について説明。

**内容:**
- システム概要
- ファイル構造
- 基本構成要素
- 動作フロー

### 2. [さくらスクリプト仕様書](./sakura-script-specification.md)
さくらスクリプトの構文と実装方法について詳細に解説。

**内容:**
- 基本構文・タグ一覧
- Surface制御・アニメーション
- 条件分岐・制御構造
- TypeScript実装例

### 3. [SHIORI仕様書](./shiori-specification.md)
会話エンジン（SHIORI）システムの設計と実装について説明。

**内容:**
- SHIORI通信プロトコル
- イベント処理システム
- JavaScript/TypeScript実装
- 状態管理・学習機能

### 4. [実装ロードマップ](./implementation-roadmap.md)
段階的な実装計画とマイルストーンについて詳述。

**内容:**
- フェーズ別実装計画
- 技術実装詳細
- テスト戦略
- 品質指標・継続的改善

## 🎯 実装フェーズ

### Phase 1: 基盤システム ✅ **完了**
- Surface表示・透過処理
- ドラッグ移動・ウィンドウ制御
- 基本UI/UX

### Phase 2: さくらスクリプトエンジン 🚧 **次期実装**
- スクリプト解析・実行
- 基本タグ処理
- Surface切り替え制御

### Phase 3: バルーンシステム 📝 **計画中**
- 吹き出し表示
- テキストレンダリング
- フォント・改行制御

### Phase 4: SHIORIシステム 🤖 **設計段階**
- 会話エンジン
- イベント処理
- AI・学習機能

### Phase 5: アニメーション 🎬 **将来実装**
- フレームアニメーション
- surfaces.txt パーサー
- 当たり判定

### Phase 6: 音声・エフェクト 🔊 **将来実装**
- 音声再生システム
- BGM管理
- 効果音制御

## 🛠 技術スタック

```
Frontend: React + TypeScript + Vite
Desktop:  Tauri (Rust)
Graphics: HTML5 Canvas + CSS
Audio:    Web Audio API
Storage:  LocalStorage/IndexedDB
```

## 📋 開発ガイドライン

### コーディング規約
- TypeScript厳格モード使用
- ESLint + Prettier による整形
- React Hooks パターンの採用
- 関数型プログラミング重視

### ファイル命名規則
```
src/
├── components/          # React コンポーネント
│   ├── Ghost.tsx       # PascalCase
│   └── *.css          # CSS Modules
├── script/             # さくらスクリプト関連
├── shiori/             # SHIORI システム
├── balloon/            # バルーンシステム
└── types/              # 型定義
```

### Git ワークフロー
- feature branch での開発
- Pull Request によるコードレビュー
- CI/CD パイプライン
- セマンティックバージョニング

## 🧪 テスト方針

### テストレベル
1. **Unit Test**: 個別関数・クラス
2. **Integration Test**: システム間連携
3. **E2E Test**: ユーザーシナリオ
4. **Performance Test**: パフォーマンス

### テストツール
```
Jest:          ユニット・統合テスト
React Testing: コンポーネントテスト
Playwright:    E2Eテスト
Lighthouse:    パフォーマンス測定
```

## 📊 開発進捗

### 完了済み機能
- [x] プロジェクト基盤構築
- [x] Surface表示システム
- [x] グリーンバック透過処理
- [x] ドラッグ移動機能
- [x] ウィンドウ位置制御
- [x] 仕様書・ドキュメント作成

### 開発中機能
- [ ] さくらスクリプトパーサー
- [ ] スクリプト実行エンジン
- [ ] 基本タグハンドラー

### 今後の予定
- [ ] バルーン表示システム
- [ ] SHIORI エンジン
- [ ] アニメーションシステム

## 🔗 外部リソース

### 伺か関連資料
- [SSP（伺か用ベースウェア）](http://ssp.shillest.net/)
- [伺かゴースト開発Wiki](https://ukadoc.osdn.jp/)
- [KAWARI（SHIORI）](http://kawari.sourceforge.net/)

### 技術資料
- [Tauri Documentation](https://tauri.app/)
- [React TypeScript Guide](https://react-typescript-cheatsheet.netlify.app/)
- [HTML5 Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

## 💡 参考実装

### オープンソースプロジェクト
- [Ikagaka Desktop](https://github.com/Ikagaka/ikagaka-desktop)
- [YAYA SHIORI](https://github.com/YAYA-shiori/yaya-shiori)
- [Cuttlebone](https://github.com/Ikagaka/cuttlebone)

## 📞 サポート・コミュニティ

### 開発支援
- **Issue**: バグ報告・機能要望
- **Discussions**: 技術相談・アイデア交換
- **Wiki**: 開発ノウハウ共有

### コントリビューション
1. Fork & Clone
2. Feature Branch 作成
3. 変更・テスト実装
4. Pull Request 作成
5. コードレビュー

---

**このドキュメントは開発の進行に合わせて継続的に更新されます。**

**質問や提案がありましたら、Issueやディスカッションでお気軽にお声かけください！**