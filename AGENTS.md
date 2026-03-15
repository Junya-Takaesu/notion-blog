# Claude Code 開発ガイド

## プロジェクト概要

Notion API からコンテンツを取得する Next.js 16 ブログアプリケーション。

## エンジニアリング原則

- **DRY (Don't Repeat Yourself)**: コードの重複を排除し、保守性と品質の一貫性を保つ
- **KISS (Keep It Simple, Stupid)**: シンプルな設計を心がけ、理解しやすく変更に強いコードを書く
- **YAGNI (You Aren't Gonna Need It)**: 現時点で必要な機能のみを実装し、過剰設計を避ける

## 開発ワークフロー

1. **実装** - Next.js/TypeScript のベストプラクティスに従ってコード変更を行う
2. **開発サーバー** - `docker compose up -d --build` を実行し、`docker compose port app 3000` でポートを確認し、エラーがないかログを監視する
3. **視覚的検証** - Playwright MCP を使用:
   - ページがエラーなくレンダリングされる（空白画面にならない）
   - 主要な UI 要素が表示される（ヘッダー、ナビゲーション、メインコンテンツ）
   - コンソールエラー/警告がない
   - 例: `/` に移動し、ヘッダー "My Blog" が存在することを確認し、console.error がないことをチェック
4. **Linting** - `docker compose run --rm app npm run lint` を実行し、すべての問題を修正する
5. **ビルド** - `docker compose -f docker-compose.prod.yml build` を実行し、エラーがないことを確認する
6. **繰り返し** - すべてのチェックがパスするまで 3-5 を繰り返す

## Serena 連携

意味的なコード操作には **Serena MCP サーバー** を使用します。ファイル全体を読む代わりに、シンボルツール (find_symbol, get_symbols_overview) を使用してください。

**利用可能なメモリ:** `development-workflow`, `notion-api-blog-implementation`

## 主要コマンド

- `docker compose up -d --build` - 開発サーバーを起動（ポートはランダムに選択される）
- `docker compose run --rm app npm run lint` - ESLint を実行
- `docker compose -f docker-compose.prod.yml build` - 本番ビルド
- `docker compose -f docker-compose.prod.yml up --build -d` - 本番サーバーを起動

## プロジェクト構造

- `src/app/` - Next.js App Router のページとレイアウト
- `src/components/` - React コンポーネント (shadcn/ui パターン)
- `src/actions/` - サーバーアクション (Notion API クライアント)
- `src/lib/` - ユーティリティ
