# Contributing to Dealty QA Agentic Solution

Thank you for contributing to this test suite. This guide explains the conventions, rules, and workflow every contributor must follow. The goal is a maintainable, readable, and reliable test suite that anyone on the team can extend.

---

## Table of Contents

- [Non-Negotiable Rules](#non-negotiable-rules)
- [Getting Set Up](#getting-set-up)
- [Project Architecture](#project-architecture)
- [Writing Tests](#writing-tests)
- [Writing Page Objects](#writing-page-objects)
- [TypeScript Standards](#typescript-standards)
- [Commit & PR Workflow](#commit--pr-workflow)
- [Reviewing a PR](#reviewing-a-pr)
- [Using Claude Code](#using-claude-code)

---

## Non-Negotiable Rules

These rules are enforced in code review and must not be violated:

| # | Rule |
|---|------|
| 1 | **Never submit a form.** Test field interactions and validation states only. |
| 2 | **Never create an account or enter real credentials.** If `auth.required: false` in `site.config.json`, skip any auth flow entirely. |
| 3 | **Never hardcode the base URL.** Always derive URLs from `siteConfig.url` via the custom fixture. |
| 4 | **No `expect()` calls inside Page Objects.** Assertions belong in test files exclusively. |
| 5 | **Tag every test.** Every test must carry at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`. |
| 6 | **No `page.waitForTimeout()`.** Use Playwright's built-in auto-waiting, `waitForSelector`, or `waitForLoadState`. |
| 7 | **No implicit `any`.** TypeScript strict mode is enabled; every variable, parameter, and return type must be typed. |

---

## Getting Set Up

Follow the [README](../README.md#development-environment-setup) for full setup instructions. Summary:

```bash
npm install
npx playwright install
npm run typecheck   # must pass before any PR
npm run test:smoke  # confirms connectivity to the target site
```

---

## Project Architecture

### Page Object Model (POM)

Every page or major section of `dealty.ai` has a corresponding class in `src/pages/`. The class:

- Extends `BasePage` from `src/pages/base.page.ts`
- Declares all locators as `readonly Locator` properties in the constructor
- Exposes action methods (click, fill, navigate) — never assertions
- Is exported and registered in `src/fixtures/site.fixture.ts`

### Test fixture

Tests never import `{ test, expect }` from `@playwright/test` directly. They use the custom fixture:

```typescript
import { test, expect } from '@fixtures/site.fixture';
```

This gives tests access to `homePage`, `navigationPage`, `contactPage`, `pricingPage`, `faqPage`, `siteConfig`, and `page`.

### Test location

| Suite tag | Folder |
|-----------|--------|
| `@smoke` | `tests/smoke/` |
| `@navigation` | `tests/navigation/` |
| `@forms` | `tests/forms/` |
| `@functional` | `tests/functional/` |
| `@visual` | `tests/visual/` |
| `@responsive` | `tests/responsive/` |
| `@custom` | `tests/custom/` (site-specific, AI-generated) |

---

## Writing Tests

### Template

```typescript
/**
 * tests/<suite>/<feature>.spec.ts
 *
 * Brief description of what is tested and why.
 * Tag: @<suite>
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('<Feature Name> @<suite>', () => {
  test.beforeEach(async ({ <pageObject> }) => {
    await <pageObject>.navigate();
    await <pageObject>.waitForLoad();
  });

  test('<what it verifies> @<suite>', async ({ <pageObject>, siteConfig }) => {
    // Arrange: navigate (done in beforeEach)
    // Act: use a POM method
    const value = await <pageObject>.someMethod();
    // Assert: use expect()
    expect(value).toBeTruthy();
  });
});
```

### Checklist before committing a test

- [ ] Test is independent (no shared state with other tests)
- [ ] Uses POM methods, not raw `page.locator()` in the test body
- [ ] Has at least one tagged with `@<suite>`
- [ ] Uses `await` correctly on all async Playwright calls
- [ ] Does not use `waitForTimeout`
- [ ] Does not submit a form or navigate to an auth flow
- [ ] Passes `npm run typecheck`
- [ ] Passes `npm run lint`

---

## Writing Page Objects

### Template

```typescript
// src/pages/<feature>.page.ts
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@types/site-config.types';

export class FeaturePage extends BasePage {
  // Declare all locators as readonly properties
  readonly heading: Locator;
  readonly primaryCta: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    // Initialize with real selectors from the live DOM — use WebFetch to inspect first
    this.heading = page.locator('h1');
    this.primaryCta = page.getByRole('link', { name: /get started/i });
  }

  // Action methods only — no expect() here
  async clickPrimaryCta(): Promise<void> {
    await this.primaryCta.click();
  }

  async getHeadingText(): Promise<string> {
    return (await this.heading.textContent()) ?? '';
  }
}
```

### Registering a new Page Object

After creating the class, add it to `src/fixtures/site.fixture.ts`:

```typescript
import { FeaturePage } from '@pages/feature.page';
// ...
featurePage: async ({ page, siteConfig }, use) => {
  await use(new FeaturePage(page, siteConfig));
},
```

### Selector strategy (in order of preference)

1. `getByRole()` — semantic roles (button, link, heading, textbox)
2. `getByLabel()` / `getByPlaceholder()` — form fields
3. `getByText()` — visible text content
4. `locator('[data-testid="..."]')` — explicit test IDs if present
5. `locator('.class-name')` — CSS classes as a last resort (fragile to redesigns)

---

## TypeScript Standards

- **Strict mode** is enabled in `tsconfig.json` — no implicit `any`
- Use `type` for interfaces and type aliases (not `interface` unless extending)
- Return types must be declared on all public methods
- Avoid non-null assertions (`!`) unless the value provably cannot be null at that point
- Run `npm run typecheck` before every commit

---

## Commit & PR Workflow

### Branch naming

```
feature/add-pricing-page-tests
fix/nav-mobile-menu-assertion
chore/update-visual-baselines
```

### Commit messages

Follow conventional commits:

```
feat: add functional tests for pricing plans page
fix: correct mobile nav toggle selector after site redesign
test: add closing cost calculator assertions
chore: update visual baselines after homepage refresh
```

### Pull Request checklist

When opening a PR, fill in the [pull request template](pull_request_template.md). Make sure:

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run test:smoke` passes (the target site is reachable)
- [ ] New tests are tagged with the correct `@suite` tag
- [ ] No form submissions, no hardcoded URLs
- [ ] Visual baselines updated if UI changed (commit the `__snapshots__/` files)

---

## Reviewing a PR

When reviewing another contributor's test PR, check for:

1. **No hardcoded URLs** — `siteConfig.url` is always the source of truth
2. **No `expect()` in page objects** — assertions in tests only
3. **Proper tagging** — at least one suite tag per test
4. **No `waitForTimeout()`** — use proper waiting strategies
5. **TypeScript types** — all public methods have return types
6. **Selector quality** — role-based > data-testid > CSS class
7. **Test independence** — each test can run standalone without setup from another test

---

## Using Claude Code

This repo is fully integrated with Claude Code. When in doubt, ask Claude Code to help:

```bash
# Start a Claude Code session in this repo
claude

# Then use slash commands:
/analyze-site          # Re-inspect dealty.ai and update site.config.json
/generate-full-suite   # Generate/update all POM classes and test files
/run-smoke             # Run smoke tests with a formatted report
/generate-report       # Summarize the latest test run
```

Claude Code reads `CLAUDE.md` at session start, which contains all the architecture rules. It also uses the agents in `.claude/agents/` for specialized tasks like site analysis.

### Asking Claude to write a test

Claude Code will:
1. Read `site.config.json` to get the URL
2. Use `WebFetch` to inspect the live page's DOM
3. Write selectors based on the actual HTML (not guesses)
4. Follow POM conventions automatically
5. Run `npx tsc --noEmit` to verify the output compiles

You do not need to provide selectors — Claude discovers them from the live site.
