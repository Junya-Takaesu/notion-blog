# Docker Compose セットアップガイド

このプロジェクトは、開発用と本番用のDocker環境を提供しています。

## 前提条件

- Docker Desktop がインストールされていること
- `.env.local` ファイルが作成されていること（環境変数の設定）

## 開発環境（ホットリロード対応）

開発環境では、ソースコードの変更が自動的にコンテナ内に反映され、Next.jsの開発サーバーがホットリロードします。

### 起動

```bash
docker compose up -d
```

### ログの確認

```bash
docker compose logs -f
```

### 停止

```bash
docker compose down
```

### アクセス

ブラウザで http://localhost:3000 にアクセス

### 特徴

- ソースコードをボリュームマウント（リアルタイム反映）
- `npm run dev` で起動（Turbopackによる高速開発）
- ホットリロード有効
- `node_modules` と `.next` はコンテナ内で独立

## 本番環境（パフォーマンス重視）

本番環境では、最適化されたビルド成果物のみを含む軽量なイメージを使用します。

### 起動

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### ログの確認

```bash
docker compose -f docker-compose.prod.yml logs -f
```

### 停止

```bash
docker compose -f docker-compose.prod.yml down
```

### アクセス

ブラウザで http://localhost:3000 にアクセス

### 特徴

- Next.js standaloneモードによる最小サイズ
- 本番ビルド済み（`next build` 実行済み）
- 高速起動（通常50ms以内）
- セキュリティ強化（非rootユーザー、read-only filesystem）
- マルチステージビルドによるイメージサイズ削減

## トラブルシューティング

### ポート3000が既に使用されている

既存のプロセスを停止するか、docker-compose.ymlのポート設定を変更してください：

```yaml
ports:
  - "3001:3000"  # 3001に変更
```

### 環境変数が読み込まれない

`.env.local` ファイルが存在し、適切な権限で読み取り可能であることを確認してください。

### ホットリロードが動作しない

開発環境で `docker-compose.yml` の `WATCHPACK_POLLING=true` が設定されていることを確認してください。

### イメージの再ビルド

キャッシュをクリアして完全に再ビルド：

```bash
# 開発環境
docker compose build --no-cache

# 本番環境
docker compose -f docker-compose.prod.yml build --no-cache
```

## Docker設定ファイル

- `Dockerfile` - マルチステージビルド定義
  - `development` ステージ：開発環境
  - `production` ステージ：本番環境
- `docker-compose.yml` - 開発環境の設定
- `docker-compose.prod.yml` - 本番環境の設定
- `.dockerignore` - イメージに含めないファイルの指定
