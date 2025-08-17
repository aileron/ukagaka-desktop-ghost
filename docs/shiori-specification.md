# SHIORI（会話エンジン）システム仕様書

## 1. 概要

SHIORIは伺かゴーストの「人格」を司る会話エンジンです。ユーザーとの対話、自動会話、イベント処理などを担当します。

## 2. SHIORI通信プロトコル

### 2.1 基本プロトコル

SHIORIは HTTP風プロトコルで通信します。

#### リクエスト形式
```http
GET SHIORI/3.0
Charset: UTF-8
Sender: ベースウェア名
SecurityLevel: Local
ID: イベント名
Reference0: 引数1
Reference1: 引数2
...
```

#### レスポンス形式
```http
SHIORI/3.0 200 OK
Charset: UTF-8
Value: さくらスクリプト

または

SHIORI/3.0 204 No Content
Charset: UTF-8
```

### 2.2 ステータスコード

| コード | 意味 | 説明 |
|--------|------|------|
| 200 | OK | 正常応答、Valueに結果 |
| 204 | No Content | 応答なし（無視） |
| 400 | Bad Request | リクエスト形式エラー |
| 500 | Internal Server Error | 内部エラー |

## 3. 主要イベント

### 3.1 システムイベント

#### OnBoot（起動）
```http
GET SHIORI/3.0
ID: OnBoot
Reference0: 起動理由
```
**起動理由の種類:**
- `install` - 初回インストール
- `vanishbind` - 復帰
- `reload` - リロード

#### OnClose（終了）
```http
GET SHIORI/3.0  
ID: OnClose
Reference0: 終了理由
```

#### OnSecondChange（毎秒）
```http
GET SHIORI/3.0
ID: OnSecondChange
Reference0: 現在時刻（Unix timestamp）
```

### 3.2 ユーザーインタラクション

#### OnMouseClick（クリック）
```http
GET SHIORI/3.0
ID: OnMouseClick
Reference0: クリックされたキャラクター（0=さくら、1=うにゅう）
Reference1: クリック座標X
Reference2: クリック座標Y
Reference3: クリックされたSurface番号
```

#### OnMouseDoubleClick（ダブルクリック）
```http
GET SHIORI/3.0
ID: OnMouseDoubleClick
Reference0: キャラクター番号
Reference1: 座標X
Reference2: 座標Y
```

#### OnUserInput（ユーザー入力）
```http
GET SHIORI/3.0
ID: OnUserInput
Reference0: 入力文字列
```

### 3.3 定期実行イベント

#### OnMinuteChange（毎分）
```http
GET SHIORI/3.0
ID: OnMinuteChange
Reference0: 現在時刻
```

#### RandomTalk（ランダムトーク）
```http
GET SHIORI/3.0
ID: RandomTalk
Reference0: 前回のトークからの経過時間
```

## 4. SHIORI実装タイプ

### 4.1 KAWARI（辞書ベース）

最もシンプルな形式。テキストファイルによる辞書ベース。

```kawari
# 起動時の挨拶
OnBoot {
    \0\s[0]おはよう！今日も一日よろしくね。\e
    \0\s[1]やあ、久しぶり！元気だった？\e
    \0\s[0]こんにちは。調子はどう？\e
}

# クリック時の反応
OnMouseClick {
    \0\s[4]わっ、びっくりした！\e
    \0\s[1]なあに？何か用？\e
    \0\s[0]どうしたの？\e
}

# ランダムトーク
RandomTalk {
    \0\s[0]今日は天気がいいね。\e
    \0\s[2]ちょっと眠くなってきた...\e
    \0\s[1]何か面白いことないかな？\e
}
```

### 4.2 YAYA（スクリプト言語）

プログラミング言語的な記述が可能。

```yaya
OnBoot
{
    hour = GETTIME[0]
    if hour < 12 {
        "\\0\\s[0]おはよう！\\e"
    } else if hour < 18 {
        "\\0\\s[0]こんにちは！\\e"  
    } else {
        "\\0\\s[0]こんばんは！\\e"
    }
}

OnMouseClick
{
    _clickcount++
    if _clickcount % 5 == 0 {
        "\\0\\s[4]もう" + _clickcount + "回もクリックされた！\\e"
    } else {
        "\\0\\s[1]" + _clickcount + "回目のクリック。\\e"
    }
}
```

## 5. JavaScript/TypeScript での SHIORI 実装

### 5.1 基本クラス構造

```typescript
interface SHIORIRequest {
  protocol: string;
  method: string;
  version: string;
  headers: Record<string, string>;
  id: string;
  references: string[];
}

interface SHIORIResponse {
  protocol: string;
  version: string;
  statusCode: number;
  statusMessage: string;
  headers: Record<string, string>;
  value?: string;
}

class SHIORIEngine {
  async request(req: SHIORIRequest): Promise<SHIORIResponse> {
    // イベント処理のメインエントリーポイント
  }
}
```

### 5.2 イベントハンドラーの実装

```typescript
class SHIORIEngine {
  private eventHandlers: Record<string, Function> = {
    'OnBoot': this.handleBoot.bind(this),
    'OnClose': this.handleClose.bind(this),
    'OnSecondChange': this.handleSecondChange.bind(this),
    'OnMouseClick': this.handleMouseClick.bind(this),
    'RandomTalk': this.handleRandomTalk.bind(this),
  };

  private handleBoot(refs: string[]): string {
    const reason = refs[0];
    const hour = new Date().getHours();
    
    if (hour < 12) return "\\0\\s[0]おはよう！\\e";
    if (hour < 18) return "\\0\\s[0]こんにちは！\\e";
    return "\\0\\s[0]こんばんは！\\e";
  }

  private handleMouseClick(refs: string[]): string {
    const character = refs[0];
    const x = refs[1];
    const y = refs[2];
    
    const responses = [
      "\\0\\s[4]わっ！\\e",
      "\\0\\s[1]なあに？\\e", 
      "\\0\\s[0]どうしたの？\\e"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}
```

### 5.3 状態管理

```typescript
interface GhostState {
  favorability: number;        // 好感度
  mood: 'happy' | 'normal' | 'sad' | 'angry';
  lastTalkTime: number;        // 最後の会話時刻
  clickCount: number;          // クリック回数
  bootCount: number;           // 起動回数
  uptime: number;              // 累計稼働時間
}

class StateManager {
  private state: GhostState;
  
  save(): void {
    localStorage.setItem('ghostState', JSON.stringify(this.state));
  }
  
  load(): void {
    const saved = localStorage.getItem('ghostState');
    if (saved) {
      this.state = JSON.parse(saved);
    }
  }
}
```

### 5.4 辞書ベースSHIORI

```typescript
interface TalkDictionary {
  [eventName: string]: string[];
}

class DictionarySHIORI extends SHIORIEngine {
  private dictionary: TalkDictionary = {
    'OnBoot': [
      "\\0\\s[0]おはよう！今日も頑張ろう！\\e",
      "\\0\\s[1]やあ、久しぶり！\\e",
      "\\0\\s[0]こんにちは！調子はどう？\\e"
    ],
    
    'OnMouseClick': [
      "\\0\\s[4]わっ、びっくりした！\\e",
      "\\0\\s[1]なあに？\\e",
      "\\0\\s[0]どうしたの？\\e"
    ],
    
    'RandomTalk': [
      "\\0\\s[0]今日は天気がいいね。\\e",
      "\\0\\s[2]ちょっと眠くなってきた...\\e",
      "\\0\\s[1]何か面白いことないかな？\\e"
    ]
  };

  private getRandomTalk(eventName: string): string {
    const talks = this.dictionary[eventName];
    if (!talks || talks.length === 0) return "";
    
    return talks[Math.floor(Math.random() * talks.length)];
  }
}
```

## 6. 高度な機能

### 6.1 学習機能

```typescript
class LearningSHIORI extends SHIORIEngine {
  private userInputHistory: string[] = [];
  private responseHistory: string[] = [];
  
  private async handleUserInput(refs: string[]): Promise<string> {
    const input = refs[0];
    this.userInputHistory.push(input);
    
    // 簡単なキーワードマッチング
    if (input.includes('おはよう')) {
      return "\\0\\s[1]おはよう！今日も元気だね。\\e";
    }
    
    if (input.includes('ありがとう')) {
      this.state.favorability += 5;
      return "\\0\\s[1]どういたしまして！\\e";
    }
    
    // デフォルト応答
    return "\\0\\s[0]うんうん、そうなんだ。\\e";
  }
}
```

### 6.2 時間に応じた反応

```typescript
class TimedSHIORI extends SHIORIEngine {
  private getTimeBasedGreeting(): string {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 5 && hour < 10) {
      return "\\0\\s[0]おはよう！早起きだね。\\e";
    } else if (hour >= 10 && hour < 12) {
      return "\\0\\s[0]いい朝だね！\\e";
    } else if (hour >= 12 && hour < 15) {
      return "\\0\\s[0]お昼の時間だ。\\e";
    } else if (hour >= 15 && hour < 18) {
      return "\\0\\s[0]午後もがんばろう！\\e";
    } else if (hour >= 18 && hour < 22) {
      return "\\0\\s[0]お疲れ様！\\e";
    } else {
      return "\\0\\s[2]夜遅いね...早く寝なよ？\\e";
    }
  }
}
```

### 6.3 外部API連携

```typescript
class ConnectedSHIORI extends SHIORIEngine {
  private async getWeatherInfo(): Promise<string> {
    try {
      // 天気API呼び出し（実際の実装では適切なAPIを使用）
      const weather = await fetch('/api/weather');
      const data = await weather.json();
      
      return `\\0\\s[0]今日の天気は${data.weather}だよ。\\e`;
    } catch (error) {
      return "\\0\\s[2]天気がわからないや...\\e";
    }
  }
  
  private async handleWeatherRequest(): Promise<string> {
    return await this.getWeatherInfo();
  }
}
```

## 7. デバッグとテスト

### 7.1 SHIORI テスター

```typescript
class SHIORITester {
  constructor(private shiori: SHIORIEngine) {}
  
  async testEvent(eventName: string, refs: string[] = []): Promise<void> {
    const request: SHIORIRequest = {
      protocol: 'SHIORI',
      method: 'GET', 
      version: '3.0',
      headers: { 'Charset': 'UTF-8' },
      id: eventName,
      references: refs
    };
    
    const response = await this.shiori.request(request);
    console.log(`Event: ${eventName}`);
    console.log(`Response: ${response.value}`);
  }
  
  async runAllTests(): Promise<void> {
    await this.testEvent('OnBoot', ['reload']);
    await this.testEvent('OnMouseClick', ['0', '100', '50', '0']);
    await this.testEvent('RandomTalk');
    await this.testEvent('OnClose', ['user']);
  }
}
```

### 7.2 応答品質チェック

```typescript
function validateSakuraScript(script: string): boolean {
  // さくらスクリプトの妥当性チェック
  if (!script.endsWith('\\e')) {
    console.warn('Script should end with \\e');
    return false;
  }
  
  // 無限ループのチェック
  const waitTags = script.match(/\\w\d+/g);
  if (waitTags && waitTags.length > 10) {
    console.warn('Too many wait tags');
    return false;
  }
  
  return true;
}
```

## 8. パフォーマンス最適化

### 8.1 応答キャッシュ

```typescript
class CachedSHIORI extends SHIORIEngine {
  private cache = new Map<string, string>();
  
  async request(req: SHIORIRequest): Promise<SHIORIResponse> {
    const cacheKey = `${req.id}_${req.references.join('_')}`;
    
    if (this.cache.has(cacheKey)) {
      return {
        protocol: 'SHIORI',
        version: '3.0',
        statusCode: 200,
        statusMessage: 'OK',
        headers: { 'Charset': 'UTF-8' },
        value: this.cache.get(cacheKey)
      };
    }
    
    const response = await super.request(req);
    if (response.value) {
      this.cache.set(cacheKey, response.value);
    }
    
    return response;
  }
}
```

---

**SHIORIシステムは伺かゴーストの「魂」です。この仕様に基づいて豊かな人格を持つゴーストを作成しましょう。**