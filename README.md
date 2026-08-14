# Dealty QA Agentic Solution

Automated end-to-end test suite for [Dealty](https://www.dealty.ai) — an Arizona-based flat-fee MLS listing platform that lets homeowners sell properties independently for a $199 flat fee. Built with **Playwright + TypeScript** following the **Page Object Model (POM)** and **Object-Oriented Programming (OOP)** design patterns. Orchestrated by **Claude Code** for AI-assisted test generation, site analysis, and maintenance.

---

## What This Repo Tests

[Dealty](https://www.dealty.ai) is a real estate platform operating in Arizona and Washington. This suite tests every publicly accessible feature without signing up, logging in, or submitting any form.

| Suite | Tag | What Is Tested |
|-------|-----|----------------|
| Smoke | `@smoke` | Site availability, HTTPS, load time, console errors, title/meta |
| Navigation | `@navigation` | All nav links, mobile hamburger menu, logo link, no 404s |
| Forms | `@forms` | Contact form fields, HTML5 validation, submit button, labels |
| Functional | `@functional` | Homepage hero, CTAs, pricing plans, FAQ accordion, closing cost calculator, FSBO flows |
| Visual | `@visual` | Screenshot regression across desktop/tablet/mobile |
| Responsive | `@responsive` | No horizontal overflow, correct layout at 390px / 768px / 1280px |

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev/) | ^1.44 | Browser automation across Chromium, mobile, tablet |
| TypeScript | ^5.4 | Strict-mode, type-safe test code |
| Node.js | ≥18 | Runtime |
| ESLint + TypeScript ESLint | ^8 / ^7 | Linting |
| Claude Code | latest | AI-assisted test generation, site analysis, CI orchestration |

---

## Prerequisites

Before you begin, ensure the following are installed:

- **Node.js ≥ 18** — [Download](https://nodejs.org/)
- **npm ≥ 9** (bundled with Node.js)
- Network access to `https://www.dealty.ai`
- **Claude Code** *(optional, for AI-assisted workflows)* — [Install](https://code.claude.com/)

---

## Development Environment Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/dealty_QA_Agentic_Solution.git
cd dealty_QA_Agentic_Solution

# 2. Install Node.js dependencies
npm install

# 3. Install Playwright browser binaries
npx playwright install

# 4. Install Playwright OS-level dependencies (Linux / CI only)
npx playwright install-deps

# 5. Verify TypeScript compiles cleanly
npm run typecheck

# 6. Run smoke tests to confirm connectivity to the target site
npm run test:smoke
```

If smoke tests pass, you are fully set up. If they fail, verify network access to `https://www.dealty.ai`.

---

## Running Tests

```bash
# Run the full test suite
npm test

# Run a specific suite by tag
npm run test:smoke          # Availability, HTTPS, load time, console errors
npm run test:navigation     # Nav links, mobile menu, routing
npm run test:forms          # Contact form presence and validation
npm run test:visual         # Screenshot regression (requires baseline snapshots)
npm run test:responsive     # Layout at mobile/tablet/desktop viewports

# Run a specific test file
npx playwright test tests/functional/homepage-features.spec.ts

# Run in headed mode (watch the browser)
npm run test:headed

# Launch the interactive UI runner
npx playwright test --ui

# Open the HTML report after a run
npm run report

# Update visual regression baseline screenshots
npm run baseline
```

---

## Project Structure

```
dealty_QA_Agentic_Solution/
├── site.config.json              # Site URL, flags, expected nav items
├── playwright.config.ts          # Browser projects: desktop, tablet, mobile
├── global-setup.ts               # Pre-run reachability check
├── CLAUDE.md                     # Claude Code session instructions (loaded every session)
├── AGENTS.md                     # Subagent registry and descriptions
├── Skills.md                     # Slash command / skill index
│
├── src/
│   ├── pages/                    # Page Object Model classes (one per page/section)
│   │   ├── base.page.ts          #   BasePage — shared methods all POMs extend
│   │   ├── home.page.ts          #   HomePage
│   │   ├── navigation.page.ts    #   NavigationPage
│   │   ├── contact.page.ts       #   ContactFormPage
│   │   ├── pricing.page.ts       #   PricingPage
│   │   └── faq.page.ts           #   FaqPage
│   ├── fixtures/
│   │   └── site.fixture.ts       #   Custom Playwright fixture exposing POMs
│   ├── utils/
│   │   ├── link-checker.ts       #   HTTP link validation helper
│   │   └── visual-helper.ts      #   Screenshot/diff utilities
│   └── types/
│       └── site-config.types.ts  #   TypeScript interfaces
│
├── tests/
│   ├── smoke/                    # @smoke — up, HTTPS, load time, console, meta
│   ├── navigation/               # @navigation — nav links, mobile menu, logo
│   ├── forms/                    # @forms — contact form fields and validation
│   ├── functional/               # @functional — business features (pricing, FAQs, etc.)
│   ├── visual/                   # @visual — screenshot regression
│   └── responsive/               # @responsive — viewport-specific layout checks
│
├── .claude/
│   ├── commands/                 # Slash command definitions
│   │   ├── analyze-site.md       #   /analyze-site
│   │   ├── generate-full-suite.md#   /generate-full-suite
│   │   ├── run-smoke.md          #   /run-smoke
│   │   ├── update-baseline.md    #   /update-baseline
│   │   └── generate-report.md    #   /generate-report
│   ├── agents/                   # Subagent definitions
│   │   ├── site-analyzer.md      #   Crawls site → site.config.json
│   │   └── test-generator.md     #   Generates site-specific tests
│   ├── rules/                    # Path-scoped rules loaded by Claude Code
│   │   ├── testing.md            #   Rules for tests/ files
│   │   ├── page-objects.md       #   Rules for src/pages/ files
│   │   └── typescript.md         #   Rules for all *.ts files
│   └── hooks/
│       └── pre-test.sh           # Pre-run hook
│
└── .github/
    ├── CONTRIBUTING.md           # Contributor guidelines
    ├── pull_request_template.md  # PR checklist
    ├── copilot-instructions.md   # GitHub Copilot context
    └── ISSUE_TEMPLATE/
        ├── bug_report.md         # Test failure report template
        └── test_request.md       # New test coverage request template
```

---

## Architecture: POM + OOP

All browser interaction is encapsulated in **Page Object classes** under `src/pages/`. Tests import POMs via the custom fixture; raw `page.locator()` calls never appear in test bodies.

### OOP principles applied

| Principle | How It Is Used |
|-----------|----------------|
| **Inheritance** | All page objects extend `BasePage`, which provides `navigate()`, `waitForLoad()`, `isResponsive()`, `takeScreenshot()`, etc. |
| **Encapsulation** | Locators are `readonly Locator` properties; implementation details stay inside the class |
| **Single Responsibility** | Each class models one page or major section — no cross-page logic in one class |
| **Polymorphism** | `BasePage` methods can be overridden in subclasses when a page needs custom navigation behavior |

### Writing a new Page Object

```typescript
// src/pages/my-page.page.ts
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@types/site-config.types';

export class MyPage extends BasePage {
  // Locators are readonly properties — never put assertions here
  readonly heading: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heading = page.locator('h1');
    this.ctaButton = page.getByRole('link', { name: /get started/i });
  }

  // Methods represent user actions, not assertions
  async clickCta(): Promise<void> {
    await this.ctaButton.click();
  }
}
```

### Writing a test using a POM

```typescript
// tests/functional/my-feature.spec.ts
import { test, expect } from '@fixtures/site.fixture';

test.describe('My Feature @functional', () => {
  test('CTA button is visible and clickable @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url);
    // Assertions live in tests, not in POMs
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

---

## Available Slash Commands (Claude Code)

With Claude Code installed, type these commands directly in the CLI:

| Command | Description |
|---------|-------------|
| `/analyze-site` | Crawl the live site and produce an updated `site.config.json` |
| `/generate-full-suite` | Analyze the site and generate/update all POM classes and test files |
| `/run-smoke` | Run smoke tests and display a formatted pass/fail summary |
| `/update-baseline` | Re-capture visual regression baseline screenshots |
| `/generate-report` | Generate a Markdown summary of the latest test results |

---

## Configuration: `site.config.json`

This file drives which site is tested and which features are enabled:

```json
{
  "name": "Dealty",
  "url": "https://www.dealty.ai",
  "description": "Flat-fee MLS listing service for FSBO home sellers",
  "industry": "Real Estate",
  "hasContactForm": true,
  "expectedNavItems": ["Pricing", "About Us", "FAQs", "Blogs", "Contact Us"],
  "viewports": ["desktop", "mobile", "tablet"],
  "skipVisual": false,
  "skipForms": false,
  "auth": { "required": false, "loginUrl": "", "username": "", "password": "" }
}
```

To test a different site, update `site.config.json` and run `/generate-full-suite` to regenerate the POM classes and tests.

---

## Contributor Rules

See [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md) for the full guide. The non-negotiable rules are:

1. **Never submit a form** — test field interactions and validation states only
2. **Never create an account or enter real credentials**
3. **No hardcoded URLs** — always use `baseURL` from `siteConfig` via the fixture
4. **No `expect()` in Page Objects** — assertions belong exclusively in test files
5. **Tag every test** — at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
6. **Strict TypeScript** — no implicit `any`; run `npm run typecheck` before pushing
7. **No `page.waitForTimeout()`** — use Playwright auto-waiting or `waitForSelector`

---

## Claude Code Integration

This repository is fully configured for Claude Code agentic execution:

- **`CLAUDE.md`** — persistent instructions loaded into every Claude Code session
- **`.claude/commands/`** — slash commands for common QA workflows
- **`.claude/agents/`** — subagent definitions for site analysis and test generation
- **`.claude/rules/`** — path-scoped rules that load only when relevant files are edited

To start an AI-assisted session:

```bash
cd dealty_QA_Agentic_Solution
claude
```

Then use any slash command (e.g., `/run-smoke`, `/analyze-site`) or describe the task in natural language.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Cannot find module '@fixtures/site.fixture'` | Run `npm install`; verify `tsconfig.json` path aliases |
| Smoke tests fail — site unreachable | Check network access to `https://www.dealty.ai` |
| Visual tests fail with pixel diff | Run `npm run baseline` to accept the current look |
| TypeScript compilation errors | Run `npm run typecheck` for details |
| Playwright browser not found | Run `npx playwright install` |
| Pre-commit hook failure | Run `npm run lint` and `npm run typecheck` to fix issues |

---

*This repository is part of the QA Agentic Solutions initiative — AI-assisted test automation for B2B SaaS websites.*
