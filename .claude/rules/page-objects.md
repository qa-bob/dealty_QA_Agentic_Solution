---
paths:
  - "src/pages/**/*.ts"
---

# Page Object Rules

These rules apply to all files in `src/pages/`.

## Class structure

- Every Page Object class must extend `BasePage` from `./base.page`
- Constructor signature: `constructor(page: Page, config: SiteConfig)` — call `super(page, config)` first
- All locators must be declared as `readonly Locator` properties on the class
- Locators are initialized in the constructor — not lazily inside methods

```typescript
export class MyPage extends BasePage {
  readonly heading: Locator;       // ✓ readonly Locator property
  readonly ctaButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heading = page.locator('h1');
    this.ctaButton = page.getByRole('link', { name: /get started/i });
  }
}
```

## Methods

- Methods represent user actions or data retrieval — never assertions
- Every public method must declare a return type
- Return `Promise<void>` for actions, `Promise<string>` / `Promise<boolean>` / `Promise<Locator[]>` for data
- Use `async/await` — no raw `.then()` chains

```typescript
// ✓ Action method
async clickCta(): Promise<void> {
  await this.ctaButton.click();
}

// ✓ Data method
async getHeadingText(): Promise<string> {
  return (await this.heading.textContent()) ?? '';
}

// ✗ Never do this — no assertions in page objects
async verifyHeadingVisible(): Promise<void> {
  await expect(this.heading).toBeVisible();  // WRONG
}
```

## No assertions

- `expect()` must never appear in a Page Object file
- Page Objects describe WHAT can be done, not WHETHER it passes

## Selectors

Write selectors based on the actual live DOM. Use `WebFetch` to inspect `https://www.dealty.ai/<path>` before writing any selector.

Selector preference order:
1. `page.getByRole('button', { name: /text/i })` — semantic roles
2. `page.getByLabel('Email')` — form field labels
3. `page.getByPlaceholder('Enter email')` — placeholders
4. `page.getByText('visible text')` — visible text
5. `page.locator('[data-testid="hero"]')` — explicit test IDs
6. `page.locator('.class-name')` — CSS classes (last resort; fragile)
7. `page.locator('#id')` — IDs (acceptable when stable)

Avoid XPath and deeply nested CSS selectors.

## Exports

- One class per file
- Export the class as a named export: `export class MyPage extends BasePage`
- File name: kebab-case matching the class name: `MyPage` → `my.page.ts`
- Register every new page object in `src/fixtures/site.fixture.ts`

## Imports

```typescript
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';
```
