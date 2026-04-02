# Mocha Jira Reporter: Send Mocha Test Results to Jira with Testream

This repository is a practical **Mocha + Jira integration example** using [`@testream/mocha-reporter`](https://docs.testream.app/reporters/mocha). It shows how to upload Mocha results from local runs and GitHub Actions into Jira through Testream.

If you are searching for **"Mocha Jira reporter"**, **"Mocha GitHub Actions Jira integration"**, or **"send Mocha results to Jira"**, this repo is the implementation template.

## Why this example is useful

- **CI-ready**: Includes a complete GitHub Actions workflow.
- **Fallback-safe**: Uses standard `spec` reporter when no API key is present.
- **Strict upload behavior**: `failOnUploadError=true` is set in reporter options.
- **Real failure triage**: Intentional failing tests demonstrate error flow in Jira.

## What is Testream?

[Testream](https://testream.app) is an automated test management and reporting platform for Jira teams. It ingests results from frameworks like Mocha, Jest, Vitest, and Playwright, then provides failure diagnostics and run trends directly in Jira.

If this sample repository is not the framework you need, browse all native reporters in the Testream docs: <https://docs.testream.app/>.

### Watch Testream in action

Click to see how Testream turns raw CI test results into actionable Jira insights (failures, trends, and release visibility):  
[![Watch the video](https://img.youtube.com/vi/5sDao2Q8k1k/maxresdefault.jpg)](https://www.youtube.com/watch?v=5sDao2Q8k1k)

Install **[Testream Automated Test Management and Reporting for Jira](https://marketplace.atlassian.com/apps/3048460704/testream-automated-test-management-and-reporting-for-jira)** in your Jira workspace to view uploaded runs.

## Project structure

```text
src/
  cart.ts          - Cart class and checkout behavior
  product.ts       - Product validation and pricing helpers
  discount.ts      - Coupon validation and discount helpers
test/
  cart.spec.ts     - Cart tests (passing + 1 intentional failure)
  product.spec.ts  - Product tests (passing + 1 intentional failure)
  discount.spec.ts - Discount tests (passing + 1 intentional failure)
.mocharc.js
.github/workflows/mocha.yml
.env.example
```

The intentional failures help you verify how Mocha failures are represented in Testream/Jira.

## Quick start: Mocha to Jira reporting

### 1. Create your Testream project and API key

1. Sign in at [testream.app](https://testream.app).
2. Create a project.
3. Copy your API key.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Set at least:

```bash
TESTREAM_API_KEY=<your key>
```

### 4. Run Mocha tests

```bash
npm test
```

With `TESTREAM_API_KEY`, results are uploaded automatically. Without a key, tests still run with Mocha `spec` output and upload is skipped.

## Reporter configuration (`.mocharc.js`)

This setup conditionally switches Mocha reporter:

- Uses `@testream/mocha-reporter` when API key exists.
- Uses default `spec` reporter when API key is missing.
- Sets `failOnUploadError=true`, `appName`, `appVersion`, `testEnvironment`, and `testType`.
- CI metadata (`branch`, `commitSha`, `repositoryUrl`, `buildNumber`, `buildUrl`) is auto-detected.

Reporter docs: <https://docs.testream.app/reporters/mocha>

## GitHub Actions setup

The workflow at `.github/workflows/mocha.yml` runs on pushes and pull requests to `main`.

Add this repository secret:

**Settings -> Secrets and variables -> Actions -> New repository secret**

| Name | Value |
|---|---|
| `TESTREAM_API_KEY` | Your Testream API key |

Workflow env examples already set:

| Variable | Example |
|---|---|
| `TESTREAM_APP_VERSION` | `${{ github.sha }}` |
| `TEST_ENV` | `ci` |

## How results appear in Jira

After connecting Testream to Jira, you get:

- Dashboard-level pass/fail visibility
- Failure diagnostics with assertion diffs and stack traces
- Trend analysis across runs
- Jira issue creation from failed tests

## Troubleshooting

### Upload is skipped unexpectedly

- Confirm `TESTREAM_API_KEY` is present in `.env` or CI secrets.
- Verify `.mocharc.js` loaded your environment variables.

### Upload fails in CI

- Confirm secrets are available to the workflow.
- Keep `failOnUploadError=true` if you want CI to fail on upload issues.

### Tests run but no Jira data appears

- Verify your Testream project is connected to the intended Jira workspace.

## FAQ

### Is this only a demo?

It is an example repository with production-style setup intended to be cloned and adapted.

### Why include failing tests?

To demonstrate how failures, diffs, and stack traces appear in Testream/Jira.

### Can I run Mocha without Testream?

Yes. Mocha runs as usual; upload only activates with an API key.

## Mocha Jira reporting alternatives (quick view)

| Approach | Benefit | Tradeoff |
|---|---|---|
| Raw console logs/artifacts | Minimal setup | Limited Jira-native reporting |
| Custom upload tooling | Flexible | More maintenance complexity |
| Testream Mocha reporter (this repo) | Native integration + Jira workflows | Requires Testream setup |

## Related links

- Testream app: <https://testream.app>
- Testream Automated Test Management and Reporting for Jira: <https://marketplace.atlassian.com/apps/3048460704/testream-automated-test-management-and-reporting-for-jira>
- Mocha reporter docs: <https://docs.testream.app/reporters/mocha>
- Mocha docs: <https://mochajs.org>
