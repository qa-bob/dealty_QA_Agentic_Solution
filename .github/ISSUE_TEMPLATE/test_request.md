---
name: Test Coverage Request
about: Request tests for a new page, feature, or edge case on dealty.ai
title: '[TEST] '
labels: enhancement, new-test
assignees: ''
---

## Feature / Page to Test

**Page URL:** `https://www.dealty.ai/<path>`  
**Suite tag:** `@smoke` / `@navigation` / `@forms` / `@functional` / `@visual` / `@responsive`

## What Should Be Tested?

Describe the behavior, user flow, or business requirement to cover:

1.
2.
3.

## Why Is This Test Needed?

- [ ] New page or feature was added to the site
- [ ] Regression was found that wasn't caught by existing tests
- [ ] Business-critical flow not currently covered
- [ ] Accessibility concern
- [ ] Performance concern
- [ ] Other: ___

## Constraints

- [ ] Must not submit any form
- [ ] Must not create an account or log in
- [ ] Must work across all viewports (desktop / tablet / mobile)
- [ ] Other: ___

## Existing Related Tests

<!-- List any tests that partially cover this area -->
- `tests/<suite>/<file>.spec.ts` — covers X but not Y

## Acceptance Criteria

The request is complete when:
- [ ] A POM class exists in `src/pages/` for the target page (if not already)
- [ ] At least one test covers the primary happy path
- [ ] Edge cases / error states are covered where applicable
- [ ] Tests pass on all three browser projects (desktop, mobile, tablet)
- [ ] TypeScript compiles cleanly (`npm run typecheck`)

## Additional Context

<!-- Screenshots of the feature, links to design docs, etc. -->
