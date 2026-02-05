---
name: browser-test
description: agent-browser CLIを使ってウェブページの表示・動作確認を行い、スナップショットとスクリーンショットを取得するスキル。
---

# Browser Test スキル

このスキルは、`agent-browser` CLIを使用してウェブページの表示・動作確認を行います。

## 使用方法

```
/browser-test <URL>
```

引数:
- `<URL>`: 確認したいページのURL（必須）

例:
```
/browser-test http://localhost:3000
/browser-test http://localhost:41234/posts/my-article
```

## 実行手順

### Step 1: ページを開く

```bash
agent-browser open "<URL>"
```

ページタイトルが表示され、正常に開けたことを確認します。

### Step 2: アクセシビリティスナップショットを取得

```bash
agent-browser snapshot
```

ページの構造を確認し、以下をチェック:
- ページが正常にレンダリングされているか
- 主要なUI要素（ヘッダー、ナビゲーション、コンテンツ）が存在するか
- リンクやボタンなどのインタラクティブ要素が正しく配置されているか

### Step 3: コンソールエラーを確認

```bash
agent-browser console --level error
```

JavaScriptエラーや警告がないかチェックします。

### Step 4: スクリーンショットを撮影

```bash
agent-browser screenshot --full <保存先パス>
```

フルページスクリーンショットを撮影し、指定されたパスに保存します。

### Step 5: 結果サマリーを報告

確認した内容をユーザーに報告:

```markdown
## ページ確認結果

### 基本情報
- **URL**: [確認したURL]
- **タイトル**: [ページタイトル]

### ページ構造
- [主要な要素の概要]

### コンソール状態
- エラー: [あり/なし]
- 警告: [あり/なし]

### スクリーンショット
- 保存先: [ファイルパス]
```

## コマンドリファレンス

| 操作 | コマンド |
|------|----------|
| ページを開く | `agent-browser open "<URL>"` |
| スナップショット取得 | `agent-browser snapshot` |
| インタラクティブ要素のみ | `agent-browser snapshot -i` |
| コンソールログ確認 | `agent-browser console --level <level>` |
| スクリーンショット | `agent-browser screenshot [path]` |
| フルページスクショ | `agent-browser screenshot --full [path]` |
| 要素をクリック | `agent-browser click <selector>` または `agent-browser click @<ref>` |
| テキスト入力 | `agent-browser type <selector> "<text>"` |
| キー押下 | `agent-browser press <key>` |
| スクロール | `agent-browser scroll <direction> [px]` |
| 待機 | `agent-browser wait <selector|ms>` |
| ブラウザを閉じる | `agent-browser close` |

## スナップショットのオプション

| オプション | 説明 |
|-----------|------|
| `-i, --interactive` | インタラクティブ要素のみ表示 |
| `-c, --compact` | 空の構造要素を削除 |
| `-d, --depth <n>` | ツリーの深さを制限 |
| `-s, --selector <sel>` | CSSセレクタでスコープ限定 |

## 参照要素（ref）の使い方

スナップショットで取得した `[ref=e1]` などの参照を使って要素を操作できます:

```bash
# スナップショットで ref を確認
agent-browser snapshot

# ref を使ってクリック
agent-browser click @e2

# ref を使ってテキスト入力
agent-browser fill @e3 "入力テキスト"
```

## インタラクション例

### フォーム入力テスト
```bash
agent-browser open "http://localhost:3000/contact"
agent-browser snapshot -i
agent-browser fill @e5 "test@example.com"
agent-browser fill @e6 "テストメッセージ"
agent-browser click @e7  # 送信ボタン
agent-browser wait 2000
agent-browser snapshot
```

### ナビゲーションテスト
```bash
agent-browser open "http://localhost:3000"
agent-browser snapshot -i
agent-browser click @e3  # ナビゲーションリンク
agent-browser snapshot
agent-browser screenshot page-after-navigation.png
```

## 注意事項

- `agent-browser` は Playwright ベースのヘッドレスブラウザを使用します
- セッションは維持されるため、連続した操作が可能です
- スクリーンショットのデフォルト形式は PNG です
- `--headed` オプションでブラウザウィンドウを表示できます（デバッグ用）
