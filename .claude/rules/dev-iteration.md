# dev-iteration スキル - AI/システム指示

> このドキュメントはAIエージェント向けの詳細な運用指示です。開発者向けサマリーは`CLAUDE.md`を参照してください。

## スキル実行フロー

dev-iterationスキルが起動されたとき、以下のフローを実行する:

### Phase 1: 開発サイクル

1. **実装**: CLAUDE.mdのエンジニアリング原則（DRY, KISS, YAGNI）に従ってコードを実装
2. **Dev Server起動**: `docker compose up -d --build`を実行し、`docker compose port app 3000`でポート確認
3. **動作確認**: Playwright MCPを使用して自律的に動作確認
   - `browser_navigate`でアプリにアクセス
   - `browser_snapshot`で画面状態を取得
   - `browser_console_messages`でコンソールエラーを確認
   - 必要に応じて`browser_click`、`browser_type`で操作
4. **Linting**: `docker compose run --rm app npm run lint`を実行
5. **Build確認**: `docker compose -f docker-compose.prod.yml build`を実行

エラーがあれば修正してPhase 1を繰り返す。

### Phase 2: レビューサイクル

全てのチェックが通ったら:

6. **完了報告作成**: 以下の形式で作成
   ```
   ## 完了報告
   ### 実装内容
   ### テスト結果
   ### 動作確認結果
   ### 技術的な詳細
   ```

7. **レビュー実行** (並列):
   - **CodeRabbit** (バックグラウンド): `coderabbit --prompt-only`を`run_in_background: true`で実行
   - **プロセスレビュー** (サブエージェント): Taskツールでgeneral-purposeエージェントを起動

8. **指摘対応**: CodeRabbitまたはサブエージェントから指摘があればPhase 1に戻る

### 終了条件

両方のレビューで「問題なし」が得られたら完了。

## サブエージェントプロンプト

プロセスレビュー用:

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

## 制約事項

- Playwrightテストファイル（`*.spec.ts`、`*.test.ts`）の作成は禁止
- Playwright MCPによるエージェント自律的な動作確認のみ許可
- CodeRabbitは必ずバックグラウンドで実行
