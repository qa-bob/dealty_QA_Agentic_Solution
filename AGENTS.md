# Agents

This repository uses Claude Code subagents to automate complex, multi-step QA tasks. Agent definitions live in `.claude/agents/` and are invoked by Claude Code when their trigger conditions are met, or explicitly via a slash command.

> **Note for Claude Code:** Agent files in `.claude/agents/` are subagent configuration files. The built-in `CLAUDE.md` is the primary instruction file for the main session. See [CLAUDE.md](CLAUDE.md) for project-level rules.

---

## Agent Index

| Agent | File | Trigger |
|-------|------|---------|
| [`site-analyzer`](#site-analyzer) | `.claude/agents/site-analyzer.md` | `/analyze-site`, onboarding a new site, post-redesign config refresh |
| [`test-generator`](#test-generator) | `.claude/agents/test-generator.md` | `/generate-full-suite`, new feature coverage, bug regression |

---

## site-analyzer

**File:** `.claude/agents/site-analyzer.md`

Crawls a live website using headless browser automation and produces a fully-populated `site.config.json` that can be dropped into any company QA repo to configure the Playwright regression framework.

### When to invoke

- Onboarding a new company's website into the framework for the first time
- Verifying an existing `site.config.json` is still accurate after a site redesign
- Running the `/analyze-site` slash command

### Inputs

| Input | Required | Description |
|-------|----------|-------------|
| `url` | Yes | The website URL to analyze |
| `companyName` | No | Override the inferred company name |

### Output

A complete, validated `site.config.json` with all fields populated, plus:
- An "Issues found" checklist (missing meta description, broken links, no HTTPS, etc.)
- A confidence assessment (High / Medium / Low) with reasoning

### Capabilities

- Navigate to URLs with headless Chromium
- Dismiss cookie consent banners before inspection
- Extract nav items, forms, headings, CTAs, and meta tags
- Follow redirect chains and use the canonical final URL
- Set viewport to mobile/tablet/desktop for responsiveness checks
- Issue HEAD requests to validate link status codes

---

## test-generator

**File:** `.claude/agents/test-generator.md`

Reads a populated `site.config.json` and generates site-specific Playwright test files for features not covered by the generic shared suites. All output lands in `tests/custom/`.

### When to invoke

- A site has unique functionality not covered by smoke/navigation/forms/visual/responsive suites
- Running the `/generate-full-suite` slash command
- Writing regression tests for a recently discovered bug
- A site's structure is unusual enough that generic selectors fail

### Inputs

| Input | Required | Description |
|-------|----------|-------------|
| `siteConfig` | Yes | The populated `site.config.json` |
| `testScenarios` | No | Description of specific scenarios to cover |
| `pagesToTest` | No | Specific page paths (e.g., `/pricing-plans`) |

### Output

TypeScript test files at `tests/custom/<scenario-name>.spec.ts`. Each file:
1. Opens with a JSDoc comment explaining what is tested and why it is site-specific
2. Imports from `@fixtures/site.fixture`
3. Tags all tests with `@custom` plus any relevant suite tag
4. Uses `async/await` throughout with no fixed timeouts > 500ms
5. Never submits a form or creates an account

---

## How Claude Code Uses These Agents

Agents are subagents spawned from the main Claude Code session. They:

- Run with their own scoped context window, keeping the main session clean
- Can be spawned in parallel for independent tasks (e.g., analyzing multiple pages simultaneously)
- Return structured results (JSON objects or TypeScript files) back to the orchestrating session

### Invoking an agent explicitly

Ask Claude Code in natural language:

```
"Use the site-analyzer agent to re-analyze dealty.ai and update site.config.json"
"Use the test-generator agent to write tests for the /pricing-plans page"
"Run site-analyzer on https://www.dealty.ai and then test-generator to update the suite"
```

---

## Adding a New Agent

1. Create `.claude/agents/<agent-name>.md`
2. Define the following sections:
   - **Role** — What does this agent do?
   - **When to invoke** — Trigger conditions
   - **Capabilities** — What tools/actions does it use?
   - **Inputs** — Parameter table (Input | Required | Description)
   - **Output** — What does it produce and where does it land?
   - **Step-by-step instructions** — Numbered steps
   - **Handling edge cases** — SPAs, auth-gated content, redirects, etc.
3. Register the agent in this `AGENTS.md` file

---

## Claude Code Built-in Orchestration

Beyond custom agents, Claude Code's main session provides these orchestration capabilities relevant to this QA repo:

| Capability | How It Is Used |
|-----------|----------------|
| **WebFetch** | Inspect live site HTML before writing selectors |
| **Glob / Grep** | Find existing POM classes and test patterns before generating |
| **Edit / Write** | Create or update page objects and test files |
| **Bash** | Run `npx playwright test`, `npm run typecheck`, `npm run lint` |
| **Agent spawning** | Fan out to `site-analyzer` and `test-generator` for parallel work |
| **Auto memory** | Persist build commands, selector patterns, and debugging insights across sessions |

---

## GitHub Actions (CI)

For automated CI integration, see `.github/workflows/`. Agents can also be invoked in GitHub Actions via the Claude Code CLI:

```yaml
- name: Analyze site and update config
  run: claude -p "/analyze-site" --no-interactive
```

See [GitHub Actions integration](https://code.claude.com/docs/en/github-actions) for setup details.
