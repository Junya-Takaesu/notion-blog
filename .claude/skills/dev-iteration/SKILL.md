---
name: dev-iteration
description: 開発作業時に自動で発動するスキル。コード実装後にDocker compose環境でlint・build・Playwright MCPによる動作確認を実行し、CodeRabbitコードレビューとサブエージェントによるプロセスレビューを経て完了する。
---

# 開発イテレーションスキル

このスキルは、Next.jsアプリケーションの開発タスクを完遂するための包括的な開発イテレーションプロセスを実行します。

## 開発フロー概要

```
                            +-------------------+
                            |    1. 実装        |
                            +-------------------+
                                     |
                                     v
                            +-------------------+
                            | 2. Dev Server起動 |
                            +-------------------+
                                     |
                                     v
                            +-------------------+
                            |   3. 動作確認     |
                            | (Playwright MCP)  |
                            +-------------------+
                                     |
                                     v
                            +-------------------+
                            |   4. Linting      |
                            +-------------------+
                                     |
                                     v
                            +-------------------+
                            |   5. Build確認    |
                            +-------------------+
                                     |
                                     v
                               +-----------+
                               | エラー?   |
                               +-----------+
                              /             \
                           Yes               No
                            /                 \
                           v                   v
                  +-------------+      +-------------------+
                  |   修正      |      | 6. 完了報告作成   |
                  +-------------+      +-------------------+
                         |                      |
                         |                      v
                         |         +-------------------------+
                         |         |    7. レビュー (並列)    |
                         |         |  ※コミット前に実施      |
                         |         +-------------------------+
                         |                      |
                         |            +---------+---------+
                         |            |                   |
                         |            v                   v
                         |    +-------------+    +-----------------+
                         |    | CodeRabbit  |    | サブエージェント |
                         |    | (コード)    |    | (プロセス)       |
                         |    +-------------+    +-----------------+
                         |            |                   |
                         |            +---------+---------+
                         |                      |
                         |                      v
                         |                +-----------+
                         |                | 指摘あり? |
                         |                +-----------+
                         |               /             \
                         |            Yes               No
                         |             /                 \
                         +<-----------+                   v
                                                 +-------------------+
                                                 |   8. コミット     |
                                                 +-------------------+
                                                          |
                                                          v
                                                 +-------------------+
                                                 | 9. ユーザーへ報告 |
                                                 +-------------------+
```

## ステップ詳細

### Step 1: 実装
- CLAUDE.mdに記載されたエンジニアリング原則（DRY, KISS, YAGNI）に従う
- 既存のコードパターンを踏襲
- Tailwind CSSとshadcn/uiを使用

### Step 2: Dev Server起動
以下のコマンドで開発サーバーを起動:

```bash
docker compose up -d --build
```

ポート番号を確認:
```bash
docker compose port app 3000
```

ログを監視してエラーがないか確認:
```bash
docker compose logs -f app
```

### Step 3: Visual Verification（動作確認）
**重要**: Playwrightテストの実装は禁止。代わりにPlaywright MCPを使ってエージェントが自律的に動作確認を行う。

Playwright MCPを使用した確認手順:
1. `browser_navigate`でアプリにアクセス
2. `browser_snapshot`で現在の画面状態を取得
3. 必要に応じて`browser_click`や`browser_type`で操作
4. `browser_take_screenshot`でスクリーンショットを保存（必要時）
5. `browser_console_messages`でコンソールエラーを確認

### Step 4: Linting
docker compose上でlinterを実行:

```bash
docker compose run --rm app npm run lint
```

エラーがあれば修正し、再実行。

### Step 5: Build確認
本番ビルドが通ることを確認:

```bash
docker compose -f docker-compose.prod.yml build
```

エラーがあれば修正し、再実行。

### Step 6: 完了報告の作成
全てのチェックが通ったら、以下の形式で完了報告を作成:

```markdown
## 完了報告

### 実装内容
- 変更概要
- 変更したファイル一覧

### テスト結果
- Linterの結果: PASS/FAIL
- Buildの結果: PASS/FAIL

### 動作確認結果
- 確認した画面・機能
- スクリーンショット（必要に応じて）

### 技術的な詳細
- 採用した設計判断とその理由
```

### Step 7: レビュー（並列実行）

2つのレビューを**並列で実行**する:

#### 7a. CodeRabbitによるコードレビュー（バックグラウンド実行）

CodeRabbitをBashツールでバックグラウンド実行してコードレビューを行う:

```bash
# run_in_background: true で実行
coderabbit --prompt-only
```

**実行手順**:
1. Bashツールで`coderabbit --prompt-only`を`run_in_background: true`オプション付きで実行
2. TaskOutputツールで結果を取得（`block: true`で完了を待つ）
3. CodeRabbitの指摘事項を確認

**CodeRabbitがチェックする項目**:
- コードスタイルの一貫性
- セキュリティ上の問題
- パフォーマンスの問題
- エッジケースの考慮
- 不要なコードの有無
- ベストプラクティスへの準拠

#### 7b. Claude Codeサブエージェントによるプロセスレビュー

Taskツール（subagent_type: general-purpose）でサブエージェントを起動し、開発プロセスが正しく実行されたことを確認する。

**サブエージェントへのプロンプト**:
```
あなたは開発プロセスレビュアーです。以下の完了報告を確認し、開発プロセスが正しく実行されたか評価してください。

## 確認項目
1. 全てのステップ（lint, build, 動作確認）が実行されたか
2. CLAUDE.mdの開発ワークフローに従っているか
3. 必要なテストや確認が漏れていないか
4. エンジニアリング原則（DRY, KISS, YAGNI）に従っているか
5. AIエージェントにハルシネーションが発生していないか

## 完了報告
[完了報告の内容をここに貼り付け]

## 評価結果
問題があれば具体的に指摘してください。
問題がなければ「プロセス確認OK」と回答してください。
```

### Step 8: 修正と再レビュー

CodeRabbitまたはサブエージェントからの指摘があれば:
1. 指摘事項を修正
2. 再度lint/build/動作確認を実施
3. 完了報告を更新
4. 再度レビューを実施（CodeRabbit + サブエージェント）

**両方のレビューで「問題なし」が得られるまでこのサイクルを繰り返す**

### Step 9: コミット

全てのレビューが完了したら、変更をコミットする。

```bash
git add -A
git commit -m "変更内容の要約"
```

**コミットメッセージのガイドライン**:
- 変更内容を簡潔に要約
- 必要に応じて本文で詳細を説明
- Claude Code の署名を含める

### Step 10: ユーザーへ報告

コミット完了後、以下の内容をユーザーに報告する:
- 実装内容のサマリー
- レビュー結果（CodeRabbit、サブエージェント）
- コミットハッシュ
- **動作確認用URL** - 人間のレビュアーが実際に動作確認できるよう、開発サーバーのlocalhostのURLを必ず提供する
  - `docker compose port app 3000` で取得したポート番号を使用
  - 例: `http://localhost:58906`

**報告テンプレート**:
```markdown
## 完了報告

### 実装内容
- [変更内容のサマリー]

### レビュー結果
- CodeRabbit: [結果]
- サブエージェント: [結果]

### コミット情報
- コミットハッシュ: `{commit_hash}`

### 動作確認URL
- http://localhost:{port}

### 変更ファイル
- [ファイル一覧]
```

## コマンドリファレンス

| 操作 | コマンド |
|------|----------|
| 開発サーバー起動 | `docker compose up -d --build` |
| ポート確認 | `docker compose port app 3000` |
| ログ確認 | `docker compose logs -f app` |
| Lint実行 | `docker compose run --rm app npm run lint` |
| 本番Build | `docker compose -f docker-compose.prod.yml build` |
| コンテナ停止 | `docker compose down` |
| CodeRabbitレビュー | `coderabbit --prompt-only`（バックグラウンド実行） |
| Git差分確認 | `git diff` |
| 変更ファイル確認 | `git status` |
| コミット | `git add -A && git commit -m "メッセージ"` |

## 注意事項

- **コミット前にレビューを実施** - CodeRabbitとサブエージェントのレビューが完了してからコミットする
- **Playwrightテストの実装は禁止** - Playwright MCPを使ったエージェントによる自律的な動作確認のみ
- **CodeRabbitはバックグラウンドで実行** - `run_in_background: true`オプションを使用
- レビューの指摘は真摯に受け止め、必ず対応する
- 開発完了は、CodeRabbitとサブエージェントの両方から「問題なし」の回答を得てからとする
