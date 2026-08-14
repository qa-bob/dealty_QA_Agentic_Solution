# Skills

Skills are slash commands that package repeatable QA workflows. Type `/skill-name` inside a Claude Code session in this repo to invoke one. Skill definitions live in `.claude/commands/`.

> **Claude Code docs reference:** Skills follow the [Agent Skills](https://agentskills.io) open standard. A `.claude/commands/<name>.md` file and a `.claude/skills/<name>/SKILL.md` file both create the same `/name` command.

---

## Skill Index

| Command | File | Description |
|---------|------|-------------|
| [`/analyze-site`](#analyze-site) | `.claude/commands/analyze-site.md` | Crawl the live site and produce an updated `site.config.json` |
| [`/generate-full-suite`](#generate-full-suite) | `.claude/commands/generate-full-suite.md` | Analyze the site and generate/update all POM classes and test files |
| [`/run-smoke`](#run-smoke) | `.claude/commands/run-smoke.md` | Run smoke tests and display a formatted pass/fail summary |
| [`/update-baseline`](#update-baseline) | `.claude/commands/update-baseline.md` | Re-capture visual regression baseline screenshots |
| [`/generate-report`](#generate-report) | `.claude/commands/generate-report.md` | Generate a Markdown summary of the latest test results |

---

## /analyze-site

**File:** `.claude/commands/analyze-site.md`

Crawls the live website defined in `site.config.json` and produces a fully-populated config with all fields verified against the current DOM.

**Usage:**
```
/analyze-site
/analyze-site https://www.dealty.ai
```

**Steps performed:**
1. Navigates to the site URL with `waitUntil: networkidle`
2. Dismisses cookie consent banners
3. Extracts all navigation items (text + hrefs)
4. Detects forms, email fields, and contact paths
5. Checks responsiveness at 390px viewport
6. Issues HEAD requests to verify link status codes
7. Reports issues: missing meta description, no HTTPS, broken nav links, missing `<h1>`
8. Outputs a ready-to-paste `site.config.json`

**When to run:**
- Before generating new tests (ensure selectors match current DOM)
- After a site redesign
- When nav links return 404 in navigation tests

---

## /generate-full-suite

**File:** `.claude/commands/generate-full-suite.md`

Analyzes the live site and generates or updates the complete POM class set plus all test suite files. Use this when onboarding a new site or after a major site redesign causes widespread selector failures.

**Usage:**
```
/generate-full-suite
```

**Steps performed:**
1. Runs `/analyze-site` internally to get current site structure
2. Fetches each discovered page with `WebFetch` to inspect actual DOM
3. Creates or updates POM classes in `src/pages/` with real selectors
4. Generates test files in `tests/` for all suites (smoke, navigation, forms, functional, visual, responsive)
5. Updates `src/fixtures/site.fixture.ts` to expose new page objects
6. Runs `npx tsc --noEmit` to confirm TypeScript compiles cleanly

**When to run:**
- First-time setup on a new site
- After a site redesign causes multiple test failures
- When `site.config.json` has been substantially updated

---

## /run-smoke

**File:** `.claude/commands/run-smoke.md`

Runs the `@smoke` test suite and displays a clean, formatted summary. Fastest way to verify the site is up and serving meaningful content.

**Usage:**
```
/run-smoke
```

**Example output:**
```
Site: Dealty (https://www.dealty.ai)
Run: 2026-06-13 09:00:00   Duration: 12.4s

+--------------------------------------------------+--------+----------+
| Test                                             | Status | Duration |
+--------------------------------------------------+--------+----------+
| site homepage loads successfully                 | PASS   | 1.2s     |
| page loads within acceptable time               | PASS   | 3.4s     |
| no critical JavaScript errors on load            | PASS   | 2.1s     |
| site is served over HTTPS                        | PASS   | 0.3s     |
| page has a title and meta description            | PASS   | 0.8s     |
+--------------------------------------------------+--------+----------+
Total: 5   Passed: 5   Failed: 0
```

For each failure, a suggested fix is shown (e.g., check hosting, audit with Lighthouse, add SSL cert).

**When to run:**
- First step in any debugging session
- After deploying a site change
- In CI as a gate before running the full suite

---

## /update-baseline

**File:** `.claude/commands/update-baseline.md`

Re-captures visual regression baseline screenshots for all `@visual` tests. Run this after any intentional UI change to accept the new look as the new baseline.

**Usage:**
```
/update-baseline
```

**Steps performed:**
1. Runs `npm run baseline` (`playwright test --grep @visual --update-snapshots`)
2. Reports how many snapshots were updated vs unchanged
3. Reminds you to commit the updated snapshot files

**When to run:**
- After a site redesign or intentional styling change
- When visual tests fail due to an expected change (not a regression)
- After adding a new page to visual regression coverage

**Important:** Commit the updated `__snapshots__/` files after running this command so CI uses the new baselines.

---

## /generate-report

**File:** `.claude/commands/generate-report.md`

Generates a formatted Markdown test results summary from the latest Playwright run. Parses `test-results/results.json` produced by `npm test`.

**Usage:**
```
/generate-report
```

**Output:** A Markdown document with:
- Overall pass/fail/skip counts and total duration
- Per-suite breakdown
- List of failures with full error messages
- Suggested next steps

**When to run:**
- After `npm test` to get a shareable summary
- To include results in a PR comment or Slack message
- In CI to post a test report as a pipeline artifact

---

## Adding a New Skill

1. Create `.claude/commands/<skill-name>.md`
2. Use this structure:
   ```markdown
   # /skill-name
   
   One-sentence description of what this skill does.
   
   ## Usage
   /skill-name [optional args]
   
   ## What this command does
   1. Step one
   2. Step two
   ...
   
   ## Output format
   Description or example of output.
   ```
3. Register the skill in this `Skills.md` file under the Skill Index table

---

## Claude Code Built-in Skills

These skills ship with Claude Code and are available in any session:

| Command | Description |
|---------|-------------|
| `/help` | Show all available commands and keyboard shortcuts |
| `/memory` | View, edit, or toggle CLAUDE.md and auto-memory files |
| `/compact` | Compact conversation history to free context window space |
| `/init` | Generate or improve CLAUDE.md for this project |
| `/review` | Review the current diff for correctness bugs |
| `/code-review` | Detailed code review with configurable depth (low/medium/high) |
| `/run-smoke` | *(Project skill)* Run the smoke test suite |
| `/schedule` | Schedule a recurring Claude Code task (cloud or local) |

---

## Skill vs Agent vs Rule — When to Use What

| Mechanism | Location | Loaded | Best for |
|-----------|----------|--------|----------|
| **Skill** | `.claude/commands/*.md` | On invocation | Multi-step procedures, runnable workflows |
| **Agent** | `.claude/agents/*.md` | When spawned | Autonomous, parallel, or specialized sub-tasks |
| **Rule** | `.claude/rules/*.md` | Always (or when matching files are edited) | Standing constraints and conventions |
| **CLAUDE.md** | `CLAUDE.md` | Every session | Project-wide facts, architecture, "always do X" |
