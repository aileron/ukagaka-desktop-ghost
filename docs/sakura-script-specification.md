# さくらスクリプト仕様書

## 1. 概要

さくらスクリプトは、伺かゴーストの会話表示・Surface制御・効果音再生などを行うためのマークアップ言語です。

## 2. 基本構文

### 2.1 基本ルール

- タグは `\` (バックスラッシュ) で始まる
- タグは大文字小文字を区別しない
- 引数は `[]` で囲む
- 文字列は通常の文字で記述

### 2.2 基本例

```
\0\s[0]こんにちは！\w5\s[1]今日はいい天気ですね。\e
```

## 3. 基本制御タグ

### 3.1 キャラクター切り替え

| タグ | 説明 | 例 |
|-----|------|-----|
| `\0` | メインキャラクター（さくら）に切り替え | `\0こんにちは` |
| `\1` | 相方キャラクター（うにゅう）に切り替え | `\1はい、こんにちは` |
| `\p[n]` | n番目のキャラクターに切り替え | `\p[2]` |

### 3.2 Surface（表情）制御

| タグ | 説明 | 例 |
|-----|------|-----|
| `\s[n]` | Surface n番に変更 | `\s[1]` |
| `\s[-1]` | 前のSurfaceに戻る | `\s[-1]` |
| `\i[n]` | n秒間だけSurface変更 | `\i[5]\s[2]` |

### 3.3 待機・タイミング制御

| タグ | 説明 | 例 |
|-----|------|-----|
| `\w1` - `\w9` | 1-9段階の待機時間 | `\w5` |
| `\w[n]` | n×50ms待機 | `\w[100]` |
| `\_w[n]` | n ms待機（正確） | `\_w[1500]` |

### 3.4 文字表示制御

| タグ | 説明 | 例 |
|-----|------|-----|
| `\n` | 改行 | `こんにちは\n元気ですか？` |
| `\n[half]` | 半分の高さで改行 | `\n[half]` |
| `\_n` | 改行（クリック待ちなし） | `\_n` |
| `\c` | 画面クリア | `\c` |

### 3.5 会話終了

| タグ | 説明 | 例 |
|-----|------|-----|
| `\e` | 会話終了 | `またね！\e` |
| `\-` | ノーウェイト会話終了 | `\-` |

## 4. 高度な制御タグ

### 4.1 特殊命令（\!）

```
\![*]     特殊命令の開始マーカー
```

#### 4.1.1 システム制御

| 命令 | 説明 | 例 |
|-----|------|-----|
| `\![raise,OnSecondChange]` | イベント発生 | `\![raise,OnSecondChange]` |
| `\![set,autotalk,300]` | 自動トーク間隔設定 | `\![set,autotalk,300]` |
| `\![set,balloonnum,1]` | バルーン番号設定 | `\![set,balloonnum,1]` |

#### 4.1.2 ウィンドウ制御

| 命令 | 説明 | 例 |
|-----|------|-----|
| `\![move,x,y]` | ウィンドウ移動 | `\![move,100,200]` |
| `\![bind,キャラ,x,y]` | キャラクター位置調整 | `\![bind,本体,10,20]` |

#### 4.1.3 音声・エフェクト

| 命令 | 説明 | 例 |
|-----|------|-----|
| `\![sound,filename]` | 音声再生 | `\![sound,hello.wav]` |
| `\![bgm,filename]` | BGM再生 | `\![bgm,music.mp3]` |

### 4.2 当たり判定・マウス制御

| タグ | 説明 | 例 |
|-----|------|-----|
| `\_a[OnMouseClick]` | クリック可能領域開始 | `\_a[OnMouseClick]ここをクリック\_a` |
| `\_a` | 当たり判定終了 | |
| `\![embed,OnMouseMove]` | マウス追従 | |

### 4.3 変数・計算

| タグ | 説明 | 例 |
|-----|------|-----|
| `\![set,変数名,値]` | 変数設定 | `\![set,counter,10]` |
| `\![get,変数名]` | 変数取得 | `\![get,counter]` |
| `\![add,変数名,値]` | 変数加算 | `\![add,counter,1]` |

## 5. フォント・表示制御

### 5.1 フォント設定

| タグ | 説明 | 例 |
|-----|------|-----|
| `\f[height,15]` | フォントサイズ | `\f[height,20]大きな文字` |
| `\f[color,255,0,0]` | フォント色（RGB） | `\f[color,255,0,0]赤い文字` |
| `\f[bold,1]` | 太字ON/OFF | `\f[bold,1]太字\f[bold,0]` |

### 5.2 表示効果

| タグ | 説明 | 例 |
|-----|------|-----|
| `\_s[n]` | 文字表示速度変更 | `\_s[10]ゆっくり` |
| `\![quicksection,1]` | 瞬間表示ON | `\![quicksection,1]即座に表示` |
| `\![quicksection,0]` | 瞬間表示OFF | |

## 6. 条件分岐・制御構造

### 6.1 条件分岐

```sakura
\![if,変数,値,true処理,false処理]

例：
\![if,favorability,50,\0\s[1]君のことが好きだよ,\0\s[0]まだよくわからないな]
```

### 6.2 選択肢

```sakura
\![*]\q[選択肢1,選択肢1の処理]\q[選択肢2,選択肢2の処理]\![*]

例：
\0\s[0]今日は何をしようか？\![*]
\q[散歩に行く,\![raise,OnWalk]]
\q[読書をする,\![raise,OnRead]]
\q[ゲームをする,\![raise,OnGame]]
\![*]
```

## 7. 実装例

### 7.1 基本的な会話

```sakura
\0\s[0]おはよう！\w5\s[1]今日も一日頑張ろうね。\w8\e

\1\s[10]はい。\w3\s[11]今日もよろしくお願いします。\e
```

### 7.2 アニメーション付き会話

```sakura
\0\s[0]ちょっと見てて！\w5\s[100]\w8\s[101]\w8\s[102]\w8\s[0]どう？すごいでしょ？\e
```

### 7.3 音声付き会話

```sakura
\0\s[0]\![sound,hello.wav]こんにちは！\w5音が出たかな？\e
```

### 7.4 選択肢のある会話

```sakura
\0\s[0]お疲れ様！何か飲み物はいかが？\![*]
\q[コーヒー,\![raise,OnCoffee]]
\q[紅茶,\![raise,OnTea]]  
\q[水,\![raise,OnWater]]
\q[いらない,\0\s[2]そう...残念。\e]
\![*]
```

### 7.5 時間による分岐

```sakura
\![if,hour,<,12,\0\s[0]おはよう！,\![if,hour,<,18,\0\s[0]こんにちは！,\0\s[0]こんばんは！]]
今は\![get,hour]時ですね。\e
```

## 8. TypeScript実装での変換例

### 8.1 基本パーサー構造

```typescript
interface SakuraScriptToken {
  type: 'text' | 'tag' | 'command';
  value: string;
  args?: string[];
}

class SakuraScriptParser {
  parse(script: string): SakuraScriptToken[] {
    // \タグを解析してトークン配列に変換
  }
  
  execute(tokens: SakuraScriptToken[]): void {
    // トークンを実行してSurface変更・テキスト表示等を実行
  }
}
```

### 8.2 タグ処理の実装例

```typescript
const tagHandlers = {
  's': (args: string[]) => {
    // Surface変更
    const surfaceId = parseInt(args[0]);
    changeSurface(surfaceId);
  },
  
  'w': (args: string[]) => {
    // 待機
    const waitTime = args[0] ? parseInt(args[0]) * 500 : 500;
    setTimeout(() => continueScript(), waitTime);
  },
  
  'e': () => {
    // 会話終了
    endConversation();
  }
};
```

## 9. エラー処理と互換性

### 9.1 未知のタグ処理

```typescript
// 未知のタグは無視するか、警告を出力
if (!tagHandlers[tagName]) {
  console.warn(`Unknown sakura script tag: \\${tagName}`);
  return;
}
```

### 9.2 後方互換性

- 古いバージョンのタグもサポート
- 代替タグの提供
- グレースフルデグラデーション

## 10. デバッグ・開発支援

### 10.1 スクリプトデバッガー

```typescript
class SakuraScriptDebugger {
  trace: boolean = false;
  
  log(token: SakuraScriptToken) {
    if (this.trace) {
      console.log('Executing:', token);
    }
  }
}
```

### 10.2 スクリプト検証

```typescript
function validateScript(script: string): ValidationResult {
  // 構文チェック
  // 未対応タグの警告
  // パフォーマンス問題の検出
}
```

---

**このドキュメントは実装と共に継続的に更新されます。**