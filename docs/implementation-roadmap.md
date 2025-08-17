# 伺かゴーストシステム実装ロードマップ

## 🎯 全体目標

本物の伺かと同等の機能を持つデスクトップゴーストアプリケーションを段階的に実装する。

## 📋 フェーズ別実装計画

### Phase 1: 基盤システム ✅ **完了**

**目標**: 基本的なゴースト表示とインタラクション

#### 完了済み機能
- [x] Tauri + React + TypeScript 環境構築
- [x] Surface画像表示システム
- [x] グリーンバック（#00FF00）透過処理
- [x] ドラッグ移動機能
- [x] 最前面表示切り替え（デフォルトOFF）
- [x] ウィンドウ位置管理
- [x] 基本的なUI/UX

#### 技術実装
```typescript
// 完了済みコンポーネント
- Ghost.tsx           // メインゴーストコンポーネント
- Ghost.css           // スタイリング
- Canvas透過処理       // グリーンバック除去
- Tauri Window API    // 位置・表示制御
```

### Phase 2: さくらスクリプトエンジン 🚧 **次期実装**

**目標**: さくらスクリプトの解析・実行システム

#### 実装予定機能
- [ ] さくらスクリプトパーサー
- [ ] 基本タグ実行エンジン
- [ ] Surface切り替え制御
- [ ] 待機・タイミング制御
- [ ] 改行・文字表示制御

#### 実装ファイル
```
src/
├── script/
│   ├── SakuraScriptParser.ts     # スクリプト解析
│   ├── ScriptExecutor.ts         # スクリプト実行
│   ├── TagHandlers.ts            # タグ処理
│   └── types.ts                  # 型定義
└── components/
    └── ScriptDisplay.tsx         # スクリプト表示
```

#### 実装スケジュール
| タスク | 期間 | 説明 |
|--------|------|------|
| パーサー基盤 | 3日 | トークナイザー・構文解析 |
| 基本タグ | 2日 | \0, \1, \s, \w, \e 等 |
| 実行エンジン | 2日 | 非同期実行・状態管理 |
| テスト | 1日 | ユニット・統合テスト |

### Phase 3: バルーンシステム 📝 **計画中**

**目標**: 吹き出し表示とテキスト描画

#### 実装予定機能
- [ ] バルーン画像表示
- [ ] テキストレンダリング
- [ ] 改行・フォント制御
- [ ] クリック待ち・自動スクロール
- [ ] 複数バルーン対応

#### 技術要件
```typescript
interface BalloonSystem {
  displayText(text: string, character: number): void;
  setFont(size: number, color: string): void;
  waitForClick(): Promise<void>;
  clearText(): void;
  positionBalloon(x: number, y: number): void;
}
```

#### 実装ファイル
```
src/
├── balloon/
│   ├── BalloonRenderer.tsx       # バルーン描画
│   ├── TextRenderer.ts           # テキスト表示
│   ├── FontManager.ts            # フォント管理
│   └── BalloonConfig.ts          # 設定管理
└── assets/
    └── balloons/                 # バルーン画像
```

### Phase 4: SHIORI（AI）システム 🤖 **設計段階**

**目標**: 会話エンジンとゴーストの人格実装

#### 実装予定機能
- [ ] SHIORI通信プロトコル
- [ ] イベント処理システム
- [ ] 辞書ベース会話エンジン
- [ ] 状態管理・学習機能
- [ ] ランダムトーク

#### アーキテクチャ
```typescript
class SHIORIEngine {
  // イベント処理
  async handleEvent(event: string, refs: string[]): Promise<string>
  
  // 状態管理
  private state: GhostState
  
  // 会話生成
  private generateResponse(input: string): string
}
```

#### データ構造
```typescript
interface GhostState {
  favorability: number;     // 好感度
  mood: string;            // 気分
  lastTalk: number;        // 最後の会話時刻
  clickCount: number;      // クリック回数
  preferences: object;     // 学習データ
}
```

### Phase 5: アニメーションシステム 🎬 **将来実装**

**目標**: Surface アニメーション・エフェクト

#### 実装予定機能
- [ ] surfaces.txt パーサー
- [ ] フレームアニメーション
- [ ] まばたき・口パク
- [ ] ランダムアニメーション
- [ ] 当たり判定システム

#### 技術実装
```typescript
interface AnimationSystem {
  loadAnimations(surfaceId: number): Animation[]
  playAnimation(animId: string): void
  stopAnimation(animId: string): void
  setAnimationInterval(interval: number): void
}
```

### Phase 6: 音声・エフェクトシステム 🔊 **将来実装**

**目標**: 音声再生とエフェクト

#### 実装予定機能
- [ ] WAV/MP3 音声再生
- [ ] BGM管理
- [ ] 効果音システム
- [ ] 音量制御
- [ ] 音声ファイル管理

#### 技術要件
```typescript
class AudioManager {
  playSound(filename: string): void
  playBGM(filename: string, loop: boolean): void
  setVolume(type: 'sound' | 'bgm', volume: number): void
  stopAll(): void
}
```

## 🛠 技術実装詳細

### アーキテクチャ概要

```
Frontend (React/TypeScript)
├── Ghost Component         # ゴースト表示
├── Script Engine          # さくらスクリプト
├── Balloon System         # 吹き出し
├── SHIORI Engine          # AI・会話
├── Animation Manager      # アニメーション
└── Audio Manager          # 音声

Backend (Tauri/Rust)
├── Window Management      # ウィンドウ制御
├── File System Access     # ファイル読み込み
├── System Integration     # OS連携
└── Performance Layer      # 最適化
```

### 状態管理設計

```typescript
// Redux Toolkit or Zustand での状態管理
interface AppState {
  ghost: {
    currentSurface: number;
    position: { x: number; y: number };
    isVisible: boolean;
    isAlwaysOnTop: boolean;
  };
  
  script: {
    isExecuting: boolean;
    currentScript: string;
    executionStack: any[];
  };
  
  shiori: {
    state: GhostState;
    isActive: boolean;
    lastEventTime: number;
  };
  
  balloon: {
    isVisible: boolean;
    text: string;
    position: { x: number; y: number };
  };
}
```

## 📊 実装優先度マトリクス

| フェーズ | 重要度 | 難易度 | 実装時間 | 依存関係 |
|----------|--------|--------|----------|----------|
| Phase 1 | 🔴 高 | 🟢 低 | 2週間 | なし |
| Phase 2 | 🔴 高 | 🟡 中 | 1週間 | Phase 1 |
| Phase 3 | 🟠 中 | 🟡 中 | 1週間 | Phase 2 |
| Phase 4 | 🔴 高 | 🔴 高 | 2週間 | Phase 2,3 |
| Phase 5 | 🟡 低 | 🟠 中 | 1週間 | Phase 1,2 |
| Phase 6 | 🟡 低 | 🟢 低 | 3日 | Phase 4 |

## 🎯 マイルストーン

### Milestone 1: MVP (Phase 1-2) 🚀
**目標日**: 2週間後  
**成果物**: さくらスクリプト実行可能なゴースト

**デモシナリオ**:
```sakura
\0\s[0]こんにちは！\w5\s[1]私はゴーストです。\e
```

### Milestone 2: Basic Ghost (Phase 1-3) 💬
**目標日**: 3週間後  
**成果物**: 吹き出し表示対応ゴースト

**デモシナリオ**:
```sakura
\0\s[0]この吹き出しが見えますか？\n改行もできるんです。\e
```

### Milestone 3: Interactive Ghost (Phase 1-4) 🤖  
**目標日**: 5週間後  
**成果物**: AIによる対話可能ゴースト

**デモシナリオ**:
- ユーザークリック → ランダム応答
- 時間による自動トーク
- 簡単な学習機能

### Milestone 4: Full-Featured Ghost (All Phases) ✨
**目標日**: 6週間後  
**成果物**: 本格的な伺かゴースト

## 🧪 テスト戦略

### ユニットテスト
```typescript
// さくらスクリプトパーサーのテスト
describe('SakuraScriptParser', () => {
  test('basic tags parsing', () => {
    const script = '\\0\\s[1]hello\\e';
    const tokens = parser.parse(script);
    expect(tokens).toHaveLength(4);
  });
});
```

### 統合テスト
```typescript
// ゴーストシステム全体のテスト
describe('Ghost Integration', () => {
  test('complete conversation flow', async () => {
    await ghost.executeScript('\\0\\s[0]test\\e');
    expect(ghost.getCurrentSurface()).toBe(0);
  });
});
```

### E2Eテスト
- Tauri アプリの起動〜終了
- ユーザーインタラクション
- パフォーマンステスト

## 📈 品質指標

### パフォーマンス目標
- 起動時間: < 3秒
- Surface切り替え: < 100ms
- メモリ使用量: < 100MB
- CPU使用率: < 5% (待機時)

### ユーザビリティ目標
- 直感的な操作性
- レスポンシブな反応
- 安定した動作
- クラッシュなし

## 🔄 継続的改善

### フィードバックループ
1. **実装** → コード作成
2. **テスト** → 品質確認  
3. **デプロイ** → ユーザー検証
4. **分析** → 使用状況分析
5. **改善** → 次期実装へ反映

### リリース戦略
- **Alpha**: 開発チーム内テスト
- **Beta**: 限定ユーザーテスト  
- **RC**: リリース候補
- **Stable**: 一般リリース

---

**このロードマップは進捗に応じて継続的に更新されます。**

**次のアクション**: Phase 2 さくらスクリプトエンジンの実装開始 🚀