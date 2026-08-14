# GitHub Copilot Instructions

This repository is an automated end-to-end test suite for [Dealty](https://www.dealty.ai) — a flat-fee MLS listing platform for FSBO home sellers in Arizona and Washington. The suite is built with **Playwright + TypeScript** using the **Page Object Model (POM)** and **Object-Oriented Programming (OOP)** design patterns.

---

## Architecture

### Page Object Model

All browser interactions are encapsulated in Page Object classes under `src/pages/`. Every class:
- Extends `BasePage` from `src/pages/base.page.ts`
- Declares locators as `readonly Locator` properties initialized in the constructor
- Provides action methods (navigate, click, fill, read) — never assertion methods
- Contains no `expect()` calls — those belong only in test files

### Test fixture

Tests always import from the custom fixture, never directly from `@playwright/test`:

```typescript
import { test, expect } from '@fixtures/site.fixture';
```

The fixture exposes: `homePage`, `navigationPage`, `contactPage`, `pricingPage`, `faqPage`, `siteConfig`, `page`.

### Path aliases (tsconfig.json)

| Alias | Resolves to |
|-------|-------------|
| `@pages/*` | `src/pages/*` |
| `@fixtures/*` | `src/fixtures/*` |
| `@utils/*` | `src/utils/*` |
| `@site-types/*` | `src/types/*` |

---

## Rules (enforce in all generated code)

1. **No form submissions** — test field interactions and validation states only; never `form.submit()` or clicking a submit button in a way that sends real data
2. **No hardcoded URLs** — use `siteConfig.url` from the fixture; construct paths by appending to it: `siteConfig.url.replace(/\/$/, '') + '/pricing-plans'`
3. **No `page.waitForTimeout()`** — use Playwright's built-in auto-waiting, `waitForSelector`, or `waitForLoadState`
4. **No `any` types** — strict TypeScript mode is on; every parameter and return type must be explicit
5. **Tag every test** — at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
6. **Assertions in tests only** — never put `expect()` inside a Page Object method
7. **Selector preference:** `getByRole()` > `getByLabel()` > `getByText()` > `data-testid` > CSS class

---

## The Site Being Tested

**URL:** `https://www.dealty.ai`  
**Industry:** Real Estate (FSBO / flat-fee MLS)

Key pages and features:
- `/` — Homepage: hero ("From 'For Sale' to 'Sold'"), closing cost calculator, How Dealty Works, comparison table, testimonials
- `/pricing-plans` — Pricing: flat $199 fee, plan comparison
- `/faq` — FAQ accordion
- `/contact` — Contact form (name, email, message)
- `/arizona-fsbo` — Arizona FSBO listing info
- `/washington-fsbo` — Washington FSBO listing info
- `/buy` — Property search
- `/home-worth` — Home valuation tool
- `/resources/Calculator` — Affordability calculator
- `/about-dealty` — About page
- `/blogs` — Blog listing

---

## Test File Template

```typescript
/**
 * tests/<suite>/<feature>.spec.ts
 *
 * Brief description.
 * Tag: @<suite>
 */
import { test, expect } from '@fixtures/site.fixture';

test.describe('<Feature> @<suite>', () => {
  test.beforeEach(async ({ <pageObject> }) => {
    await <pageObject>.navigate();
    await <pageObject>.waitForLoad();
  });

  test('<assertion description> @<suite>', async ({ <pageObject> }) => {
    const value = await <pageObject>.someMethod();
    expect(value).toBeTruthy();
  });
});
```

## Page Object Template

```typescript
// src/pages/<feature>.page.ts
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class FeaturePage extends BasePage {
  readonly heading: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heading = page.locator('h1');
  }

  async getHeadingText(): Promise<string> {
    return (await this.heading.textContent()) ?? '';
  }
}
```

---

## Available npm Scripts

```bash
npm test                  # All tests
npm run test:smoke        # @smoke only
npm run test:navigation   # @navigation only
npm run test:forms        # @forms only
npm run test:visual       # @visual only
npm run test:responsive   # @responsive only
npm run baseline          # Update visual snapshots
npm run lint              # ESLint
npm run typecheck         # tsc --noEmit
```

---

## Do Not Generate

- Code that submits any form
- Hardcoded URLs (use `siteConfig.url`)
- `page.waitForTimeout()` calls
- `any` types
- `expect()` inside Page Object classes
- Tests without suite tags
- Mock data for real network requests (use actual site responses)
