---
paths:
  - "src/**/*.ts"
  - "tests/**/*.ts"
  - "*.ts"
---

# TypeScript Rules

These rules apply to all TypeScript files in this project.

## Strict mode

TypeScript strict mode is enabled in `tsconfig.json`. This means:
- No implicit `any` — every variable, parameter, and return type must be typed
- No implicit `this` — avoid free `this` references
- Strict null checks — handle `null` and `undefined` explicitly

## Type declarations

- Declare return types on all public methods
- Use `readonly` for properties that should not be reassigned after construction
- Prefer `type` aliases over `interface` for simple shapes; use `interface` when you need to extend or implement
- Use `unknown` instead of `any` when the type is genuinely unknown; then narrow with a type guard

```typescript
// ✓ Typed return
async getTitle(): Promise<string> {
  return this.page.title();
}

// ✗ Missing return type
async getTitle() {
  return this.page.title();
}
```

## Null handling

- Use `??` (nullish coalescing) to provide defaults for nullable values:
  ```typescript
  const text = await el.textContent() ?? '';
  ```
- Use optional chaining `?.` before accessing properties on potentially-null objects
- Avoid non-null assertions (`!`) unless you can guarantee the value is non-null at that point

## Async/await

- All Playwright API calls are async — always `await` them
- Do not mix `.then()` chains with `async/await` in the same function
- Mark any function that uses `await` as `async`

## Imports

- Use path aliases defined in `tsconfig.json`: `@pages/`, `@fixtures/`, `@utils/`, `@site-types/`
- Import types with `import type` when the import is only used as a type (reduces runtime bundle)

```typescript
// ✓ Type-only import
import type { SiteConfig } from '@site-types/site-config.types';

// ✓ Value import
import { BasePage } from '@pages/base.page';
```

## Verification

Run before any commit:

```bash
npm run typecheck   # tsc --noEmit — must have 0 errors
npm run lint        # ESLint — must have 0 errors
```
