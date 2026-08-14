---
paths:
  - "tests/**/*.ts"
  - "tests/**/*.spec.ts"
---

# Testing Rules

These rules apply to all files in the `tests/` directory.

## Imports

- Always import `test` and `expect` from `@fixtures/site.fixture`, never from `@playwright/test` directly
- Import Page Object classes only through the fixture — never instantiate them in test files

```typescript
// Correct
import { test, expect } from '@fixtures/site.fixture';

// Wrong — do not do this
import { test, expect } from '@playwright/test';
import { HomePage } from '@pages/home.page';
```

## Test structure

- Every `test.describe()` block must have the suite tag in its title: `test.describe('Feature @functional', () => {`
- Every `test()` must also carry at least one tag inline: `test('heading visible @functional', ...)`
- Use `test.beforeEach()` for shared setup — do not duplicate navigation calls across tests
- Tests must be fully independent: no test should rely on state left by another test

## Assertions

- Use Playwright's `expect()` for all assertions — no raw `if` checks
- Prefer `toBeVisible()` over checking `.count() > 0` for visibility
- Prefer `toHaveText()` / `toContainText()` over asserting `textContent()` manually
- Use `expect.soft()` only for non-critical warnings (e.g., missing optional meta tags)

## Waiting

- Do not use `page.waitForTimeout()` — use `waitForLoadState`, `waitForSelector`, or Playwright auto-waiting
- After navigation, always await `waitForLoad()` or `waitForLoadState('domcontentloaded')` before making assertions

## Forms

- Never call `.submit()` on a form element
- Never click a button with `type="submit"` in a way that sends real data to a server
- Clicking submit to test HTML5 validation (which prevents network requests) is acceptable — but intercept the request to confirm no POST was sent

## Selectors in tests

- Do not call `page.locator()` directly in test files — all selectors must live in Page Object classes
- Exception: one-off assertions on elements that don't need a POM method (e.g., `expect(page.locator('h1')).toBeVisible()` in a quick check)

## File naming

- `tests/<suite>/<feature>.spec.ts` — kebab-case filename, `.spec.ts` extension
- One `describe` block per file unless the file covers closely related features
- Functional tests: one file per business feature area (e.g., `pricing.spec.ts`, `faq.spec.ts`)
