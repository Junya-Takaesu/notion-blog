# Claude Code Development Guide

## Project Overview

Next.js 16 blog application that fetches content from Notion API.

## Engineering Principles

- **DRY (Don't Repeat Yourself)**: コードの重複を排除し、保守性と品質の一貫性を保つ
- **KISS (Keep It Simple, Stupid)**: シンプルな設計を心がけ、理解しやすく変更に強いコードを書く
- **YAGNI (You Aren't Gonna Need It)**: 現時点で必要な機能のみを実装し、過剰設計を避ける

## Development Workflow

1. **Implementation** - Make code changes following Next.js/TypeScript best practices
2. **Dev Server** - Run `docker compose up -d --build`, check port with `docker compose port app 3000`, monitor logs for errors
3. **Visual Verification** - Using Playwright MCP:
   - Page renders without errors (no blank screen)
   - Key UI elements visible (header, navigation, main content)
   - No console errors/warnings
   - Example: Navigate to `/`, verify header "My Blog" is present, check no console.error
4. **Linting** - Run `docker compose run --rm app npm run lint`, fix all issues
5. **Build** - Run `docker compose -f docker-compose.prod.yml build`, ensure no errors
6. **Iterate** - Repeat 3-5 until all checks pass

## Serena Integration

Use **Serena MCP server** for semantic code operations. Use symbolic tools (find_symbol, get_symbols_overview) instead of reading entire files.

**Available memories:** `development-workflow`, `notion-api-blog-implementation`

## Key Commands

- `docker compose up -d --build` - Start dev server (port is picked randomly)
- `docker compose run --rm app npm run lint` - Run ESLint
- `docker compose -f docker-compose.prod.yml build` - Production build
- `docker compose -f docker-compose.prod.yml up --build -d` - Start production server

## Project Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components (shadcn/ui patterns)
- `src/actions/` - Server actions (Notion API client)
- `src/lib/` - Utilities
