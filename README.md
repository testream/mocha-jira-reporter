# Mocha Reporter for Jira Teams using Testream

This repository demonstrates how to integrate [Mocha](https://mochajs.org) with [Testream](https://testream.app) so that test results are automatically uploaded to your Jira workspace after every CI run.

## What is Testream?

[Testream](https://testream.app) is a test reporting tool for Jira teams. It imports CI/CD test results from native reporters (Vitest, Playwright, Jest, Cypress, Mocha, and others), giving your team failure inspection, trends, and release visibility directly inside Jira — without manual test case management.

Once configured, every Mocha run streams structured results to Testream. Failed tests appear in Jira with the full error message and stack trace attached, so triage starts with complete context.

## Project structure

```
src/
  cart.ts          — Cart class: add/remove items, calculate totals, checkout
  product.ts       — Product type, formatPrice, validateProduct, getDiscountedPrice
  discount.ts      — Coupon type, applyPercentage, applyFixed, validateCoupon
test/
  cart.spec.ts     — Cart tests (passing + 1 intentional failure)
  product.spec.ts  — Product tests (passing + 1 intentional failure)
  discount.spec.ts — Discount tests (passing + 1 intentional failure)
.mocharc.js
.github/workflows/mocha.yml
.env.example
```

The three intentionally failing tests exist so you can see exactly what a failed test looks like inside Testream and Jira — with the error diff and stack trace surfaced in the dashboard.

## Getting started

### 1. Install Testream for Jira

Install the **[Testream for Jira](https://marketplace.atlassian.com/apps/3048460704/testream-for-jira)** app from the Atlassian Marketplace into your Jira workspace. This is what surfaces test results, failure details, trends, and dashboards inside Jira.

### 2. Create a Testream project

1. Sign in at [testream.app](https://testream.app) (free plan available).
2. Create a project and copy your API key.

### 3. Install dependencies

```bash
npm install
```

### 4. Configure your API key

```bash
cp .env.example .env
# then set TESTREAM_API_KEY=<your key> in .env
```

### 5. Run the tests

```bash
npm test
```

Results are uploaded to Testream automatically when `TESTREAM_API_KEY` is present. Without a key, tests still run locally using the default `spec` reporter — no upload occurs.

## Testream reporter configuration

The reporter is configured in `.mocharc.js`. Because Mocha's reporter is set as a single string (not an array), the conditional pattern switches the entire reporter rather than spreading it in:

```js
require('dotenv').config();

const apiKey = process.env.TESTREAM_API_KEY || '';
const uploadEnabled = apiKey.length > 0;

module.exports = {
  require: ['ts-node/register'],
  spec: 'test/**/*.spec.ts',
  reporter: uploadEnabled ? '@testream/mocha-reporter' : 'spec',
  ...(uploadEnabled && {
    'reporter-option': [
      `apiKey=${apiKey}`,
      'uploadEnabled=true',
      'failOnUploadError=true',
      `appName=mocha-jira-reporter-example`,
      `appVersion=${process.env.TESTREAM_APP_VERSION || '1.0.0'}`,
      `testEnvironment=${process.env.TEST_ENV || 'local'}`,
      'testType=unit',
      // branch, commitSha, repositoryUrl, buildNumber, and buildUrl
      // are auto-detected by the reporter in CI environments.
    ],
  }),
};
```

See the [Testream Mocha reporter docs](https://docs.testream.app/reporters/mocha) for the full list of configuration options.

## CI with GitHub Actions

The workflow at `.github/workflows/mocha.yml` runs all tests on every push and pull request. The only secret you need to add is your Testream API key:

**Settings → Secrets and variables → Actions → New repository secret**

| Name | Value |
|---|---|
| `TESTREAM_API_KEY` | your Testream API key |

All other metadata (branch, commit SHA, build number, build URL, repository URL) is resolved automatically — nothing else to configure.

## Viewing results in Jira

Once tests are uploaded, open your Testream project and connect it to your Jira workspace. With the **[Testream for Jira](https://marketplace.atlassian.com/apps/3048460704/testream-for-jira)** app installed you get:

- **Dashboard** — pass rates, failure counts, flaky test detection, and execution summaries at a glance
- **Failure Insights** — inspect failed tests with the full error, stack trace, and diff
- **Trends & Analytics** — pass/fail trends, duration patterns, and suite growth over custom date ranges
- **Test Suite Changes** — see which tests were added or removed between runs
- **Release Visibility** — link test runs to Jira releases to track quality before shipping
- **Jira Issues** — create issues directly from any failed test with failure context pre-filled

See the [Testream Mocha reporter docs](https://docs.testream.app/reporters/mocha) for the full list of configuration options.
