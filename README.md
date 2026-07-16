# init-playwright

Playwright E2E test suite for **TS Employer**, organized with the Page
Object Model (POM) so new screens follow one consistent structure.

## Project structure

```
pages/                  Page Objects — locators + actions, no assertions
  base.page.ts           Common base class shared by every Page Object
  employer/
    login.page.ts         Page Object for /admin/login

tests/
  fixtures.ts             Wires each Page Object into a test fixture
  seed.spec.ts             Seed file used by the Playwright MCP planner/generator tools
  employer/
    login.spec.ts          Spec file for the login screen (uses fixtures, not raw Page Objects)

specs/                  Test plans (markdown scenarios), one file per screen
  admin-login.md          Test plan behind tests/employer/login.spec.ts

utils/
  env.util.ts             requiredEnv() helper for reading .env values (with an optional
                           default) — shared by playwright.config.ts and spec files, not
                           itself a test
  index.ts                 Barrel file — import helpers via "utils", not the file path

playwright.config.ts    Playwright config (baseURL, projects, loads .env)
.env.example            Required environment variable names (no real values)
```

## Setup

```bash
npm install
npx playwright install
cp .env.example .env   # then fill in real values
```

Environment variables currently required (see `.env.example`):

| Variable                 | Purpose                                             |
| ------------------------ | --------------------------------------------------- |
| `BASE_URL`               | Base URL tests run against (`playwright.config.ts`) |
| `EMPLOYER_TEST_EMAIL`    | Login email for the valid-credentials test case     |
| `EMPLOYER_TEST_PASSWORD` | Login password for the valid-credentials test case  |

`.env` is gitignored — never commit real credentials. `requiredEnv()` (from `utils/`) throws a
clear error at startup if a variable is missing and no default was passed.

## Running tests

```bash
npx playwright test                          # run everything
npx playwright test tests/employer/login.spec.ts   # run one spec
npx playwright test --headed                 # watch the browser
npx playwright test --ui                     # interactive UI mode
npx playwright test --debug                  # step through with the Inspector
npx playwright show-report                   # open the last HTML report
```

## Adding a new screen

Follow the same four pieces the login screen uses:

1. **`specs/<screen>.md`** — write the test plan first (scenarios, steps, expected results).
2. **`pages/<module>/<screen>.page.ts`** — Page Object extending `BasePage`: locators as
   `readonly` fields set in the constructor, actions as methods. No `expect()` calls here.
3. **`tests/fixtures.ts`** — add one entry so the new Page Object is injected automatically
   instead of being constructed by hand in every test.
4. **`tests/<module>/<screen>.spec.ts`** — the actual spec, written against the fixture
   (`async ({ myPage }) => { ... }`), with all `expect()` assertions living here.

Shared, non-Page-Object helpers (env access, formatting, API clients, ...) go in `utils/` as
`<name>.util.ts` and get re-exported from `utils/index.ts`, so call sites always
`import { ... } from "../../utils"` instead of reaching into individual files.

Locator tips learned from the login screen (this app has no `data-testid` hooks and MUI class
names are hashed/unstable):

- Prefer semantic queries (`getByRole`, `getByText`) or the app's own stable attributes
  (e.g. `data-field-anchor`) over generated class names.
- Assert on stable signals (URL pattern, an element's accessible role/name) rather than
  language-dependent text where the UI can render in more than one locale.

## CI

`.github/workflows/playwright.yml` runs the full suite on every pull request targeting
`develop`, `staging`, or `main`, and uploads the HTML report as an artifact. `BASE_URL`,
`EMPLOYER_TEST_EMAIL`, and `EMPLOYER_TEST_PASSWORD` must be configured as repository secrets
(Settings → Secrets and variables → Actions) or the run fails at config-load time.
