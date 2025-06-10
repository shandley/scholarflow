# ScholarFlow Development Workflow

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run all checks before committing
npm run test:build
```

## Available Scripts

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run type-check:watch` - Watch for TypeScript errors in real-time

### Testing & Validation

- `npm run type-check` - Check TypeScript types
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run test` - Run all checks (type-check + lint + format)
- `npm run build:test` - Test production build
- `npm run test:build` - Run all tests + build test

### Build & Deploy

- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run build:analyze` - Analyze bundle size

## Git Hooks (Automatic)

### Pre-commit Hook

Runs automatically when you commit:

1. **lint-staged** - Formats and lints only staged files
2. **type-check** - Ensures no TypeScript errors
3. Files are automatically fixed if possible

### Pre-push Hook

Runs automatically when you push:

1. **Full test suite** - All linting and type checks
2. **Build test** - Ensures production build works

## Catching Next.js 15 Issues Early

### During Development

```bash
# Run this periodically to catch build-only errors
npm run build:test

# Keep this running in a separate terminal
npm run type-check:watch
```

### Before Committing Major Changes

```bash
# Run full validation suite
npm run test:build
```

### Common Next.js 15 Gotchas

1. **Dynamic Route Params**: Must be `Promise<{ param }>` type
2. **Route Exports**: Only GET, POST, PUT, DELETE, etc. allowed
3. **Metadata**: Must be exported from page.tsx, not route.ts
4. **Image Optimization**: Use next/image when possible

## Troubleshooting

### Build Fails but Dev Works

This usually means Next.js 15 strict mode caught something:

```bash
# See detailed error
npm run build:test

# Check types specifically
npm run type-check
```

### Pre-commit Hook Fails

```bash
# Run checks manually to see detailed errors
npm run lint
npm run type-check
npm run format:check

# Fix formatting automatically
npm run format
```

### Skipping Hooks (Emergency Only)

```bash
# Skip pre-commit hook
git commit --no-verify -m "Emergency fix"

# Skip pre-push hook
git push --no-verify
```

## Best Practices

1. **Run `npm run type-check:watch` during development**
2. **Test builds regularly with `npm run build:test`**
3. **Don't skip hooks unless absolutely necessary**
4. **Fix issues immediately, don't let them accumulate**
5. **Update this guide when you find new issues**

## VS Code Integration

Add these settings to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```
