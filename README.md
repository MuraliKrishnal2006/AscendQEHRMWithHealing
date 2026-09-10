# OrangeHRM Playwright Automation Framework

![Playwright Tests](https://github.com/Thomson507/Playwright_Version2/actions/workflows/playwright.yml/badge.svg)

A TypeScript + Playwright test automation framework built from scratch against the [OrangeHRM demo application](https://opensource-demo.orangehrmlive.com), covering UI automation, data-driven testing, API testing, and CI/CD.

Built as a hands-on deep dive after a few months of using Playwright professionally inside a pre-built framework — this project exists to understand the *why* behind the architecture, not just the *how* of writing tests. It's a work in progress, not a finished product, and I'm continuing to build on it.

## What's covered

| Area | Coverage |
|---|---|
| Login | Valid + invalid credentials |
| Dashboard | Post-login load verification |
| PIM | Employee search, CSV-driven employee creation (3 data sets) |
| API | Public REST basics, authenticated OrangeHRM endpoint, raw CSRF-token login flow |
| CI/CD | GitHub Actions — runs on every push/PR to `main` |

## What this project demonstrates

- **Page Object Model** with a shared `BasePage` (defensive click/fill wrappers — visibility, enabled-state, and scroll checks before every interaction)
- **Fixture composition** — layered fixtures (`pages.fixture.ts` → `auth.fixture.ts`) for page injection and authenticated test setup
- **Data-driven testing** — CSV-driven test generation for employee creation, decoupling test data from test logic
- **API testing at three levels of difficulty:**
  - Basic REST calls (GET/POST) against a public API
  - Authenticated calls against real OrangeHRM endpoints, including reverse-engineering the exact headers (`Accept`, `X-Requested-With`, `Referer`) required to get JSON instead of an HTML redirect
  - A raw, cookie-free login flow: extracting a CSRF token from Vue-rendered HTML via regex and submitting it as form-encoded data — no browser, no UI, pure HTTP
- **CI/CD** — GitHub Actions pipeline (Node pinned, npm caching, artifact upload on failure) that caught two real bugs before merge: a case-sensitivity import bug (silent on Windows, fatal on Linux CI) and a test-timeout root cause found via trace-file analysis, not guesswork. Credentials are injected from **GitHub Actions Secrets** (`ASCENDQE_ADMIN_USERNAME`, `ASCENDQE_ADMIN_PASSWORD`, `ASCENDQE_USER_USERNAME`, `ASCENDQE_USER_PASSWORD` — set these under Settings → Secrets and variables → Actions) rather than being committed to the repo.

## Project structure

```
src/
├── data/        # test data (CSV, credentials)
├── utils/       # CSV reader, shared helpers
├── pages/       # Page Object classes
├── fixtures/    # fixture composition (page injection, auth)
tests/
├── *.spec.ts    # UI test specs, tagged (@smoke, @regression)
└── api/         # API-level tests
.github/workflows/  # CI pipeline
```

## Getting started

```bash
# Clone the repository
git clone https://github.com/Thomson507/orangehrm-playwright-framework.git

# Navigate to the project
cd orangehrm-playwright-framework

# Install dependencies
npm ci

# Set up credentials (never committed — see .env.example)
cp .env.example .env
# then fill in ASCENDQE_ADMIN_USERNAME / ASCENDQE_ADMIN_PASSWORD /
# ASCENDQE_USER_USERNAME / ASCENDQE_USER_PASSWORD with real values

# Install Playwright browsers
npx playwright install --with-deps

# Run all tests
npx playwright test

# Open the HTML report
npx playwright show-report
```

## Running the tests

```bash
npm test                              # all tests
npx playwright test --grep "@smoke"   # tagged subset
npm run report                        # view last HTML report
```

## Notes on AI-assisted tooling

Part of this project involved evaluating AI-driven test authoring tools — specifically Playwright's MCP server (via GitHub Copilot Agent Mode) and `playwright-cli` — for exploring pages and drafting locators.

**Honest finding:** multi-step autonomous browser control (log in → navigate → interact → verify, chained without human checkpoints) proved unreliable in practice — session state got confused across chat sessions, leading to the agent landing on unrelated logged-in accounts on the shared public demo server rather than the account it was instructed to use. Single-step, human-verified-at-each-step usage (one instruction, one action, confirm, repeat) worked reliably and successfully produced real locator data for the Leave module.

The takeaway that shaped this repo: AI tooling is genuinely useful for **exploration and locator discovery**, but committed test code should always be human-reviewed line-by-line before it's trusted — which is how every page object and test in this repo was actually built, whether the initial exploration used DevTools, `playwright-cli`, or Copilot Agent Mode.

This exploration is ongoing — future updates will cover MCP self-healing capabilities and further CLI-driven workflows as I test them.

## Tech stack

TypeScript · Playwright · GitHub Actions · CSV-driven data testing

## Status

Actively maintained, work in progress. Next planned additions: Leave module (Assign Leave), expanded CI reporting.
