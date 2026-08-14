## Summary

<!-- What does this PR add or fix? One to three sentences. -->

## Type of change

- [ ] New test(s)
- [ ] Bug fix (broken selector, wrong assertion, flaky test)
- [ ] New Page Object class
- [ ] Visual baseline update
- [ ] Configuration change (`site.config.json`, `playwright.config.ts`)
- [ ] Documentation
- [ ] Chore (lint fix, dependency update, etc.)

## Test suites affected

- [ ] `@smoke`
- [ ] `@navigation`
- [ ] `@forms`
- [ ] `@functional`
- [ ] `@visual`
- [ ] `@responsive`
- [ ] `@custom`

## Pre-merge checklist

### Required (PR will not be merged without these)

- [ ] `npm run typecheck` passes with no errors
- [ ] `npm run lint` passes with no errors
- [ ] `npm run test:smoke` passes (site is reachable)
- [ ] Every new test is tagged with at least one suite tag (`@smoke`, `@functional`, etc.)
- [ ] No `expect()` calls inside any Page Object class
- [ ] No hardcoded URLs — all URLs derive from `siteConfig.url`
- [ ] No `page.waitForTimeout()` in any new code

### If tests were added or changed

- [ ] Tests are independent (no shared state across test cases)
- [ ] Selectors are based on actual DOM inspection (via `WebFetch` or browser DevTools), not guesses
- [ ] Tests do not submit any form or create any account

### If visual baselines were changed

- [ ] `npm run baseline` was run to capture new screenshots
- [ ] Updated `__snapshots__/` files are committed in this PR
- [ ] The visual change is intentional and approved

### If a new Page Object was added

- [ ] The class extends `BasePage`
- [ ] All locators are `readonly Locator` properties declared in the constructor
- [ ] The class is exported and registered in `src/fixtures/site.fixture.ts`

## Related issues

<!-- Closes #123 -->

## Screenshots / evidence

<!-- For visual changes or new UI tests, attach before/after screenshots or a Playwright HTML report link. -->
