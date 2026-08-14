---
name: Test Failure Report
about: Report a failing or flaky test in this suite
title: '[BUG] '
labels: bug, test-failure
assignees: ''
---

## Failing Test

**Test file:** `tests/<suite>/<file>.spec.ts`  
**Test name:**  
**Suite tag:** `@smoke` / `@navigation` / `@forms` / `@functional` / `@visual` / `@responsive`

## Failure Details

**Error message:**
```
Paste the full error output here
```

**Steps to reproduce:**
```bash
npx playwright test tests/<suite>/<file>.spec.ts --headed
```

## Expected Behavior

What should the test do?

## Actual Behavior

What is the test doing instead?

## Environment

| Field | Value |
|-------|-------|
| Branch | `main` / `feature/...` |
| Node.js version | `node --version` |
| Playwright version | `npx playwright --version` |
| OS | Windows / macOS / Linux |
| Browser | Chromium / Mobile Chrome / Tablet |

## Possible Cause

- [ ] Selector is outdated (site DOM changed)
- [ ] Assertion is too strict for actual site behavior
- [ ] Race condition / missing wait
- [ ] Site is temporarily down or slow
- [ ] Visual snapshot is stale (run `npm run baseline`)
- [ ] TypeScript compilation error
- [ ] Other: ___

## Additional Context

<!-- Attach a Playwright trace file, screenshot, or HTML report if available -->
<!-- Run: npx playwright test --trace on --reporter=html to capture a trace -->
