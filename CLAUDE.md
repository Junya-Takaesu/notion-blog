# Claude Code Development Guide

## Project Overview

Next.js 16 blog application that fetches content from Notion API.

## Engineering Principles

- **DRY (Don't Repeat Yourself)**: コードの重複を排除し、保守性と品質の一貫性を保つ
- **KISS (Keep It Simple, Stupid)**: シンプルな設計を心がけ、理解しやすく変更に強いコードを書く
- **YAGNI (You Aren't Gonna Need It)**: 現時点で必要な機能のみを実装し、過剰設計を避ける

## Development Workflow

1. **Implementation** - Make code changes following Next.js/TypeScript best practices
2. **Dev Server** - Run `npm run dev`, monitor logs for errors
3. **Playwright Testing** - Test UI elements and user interactions
4. **Visual Verification** - Verify display and check console
5. **Linting** - Run `npm run lint`, fix all issues
6. **Build** - Run `npm run build`, ensure no errors
7. **Iterate** - Repeat 3-6 until all checks pass

## Serena Integration

Use **Serena MCP server** for semantic code operations. Use symbolic tools (find_symbol, get_symbols_overview) instead of reading entire files.

**Available memories:** `development-workflow`, `notion-api-blog-implementation`

## Key Commands

- `npm run dev` - Start dev server (localhost:3000)
- `npm run lint` - Run ESLint
- `npm run build` - Production build

## Project Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components (shadcn/ui patterns)
- `src/actions/` - Server actions (Notion API client)
- `src/lib/` - Utilities

## Important Notes

Global header with "My Blog" link on all pages. Use Tailwind CSS for styling. Environment variables in `.env.local` (not committed). Test with Playwright to verify UI rendering and navigation.
