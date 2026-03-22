require('dotenv').config();

// Upload only when a key is present — lets contributors run tests without a Testream account.
const apiKey = process.env.TESTREAM_API_KEY || '';
const uploadEnabled = apiKey.length > 0;

module.exports = {
  // TypeScript support via ts-node — no separate compile step needed.
  require: ['ts-node/register'],

  spec: 'test/**/*.spec.ts',
  timeout: 10000,

  // Testream reporter is only activated when an API key is available.
  // Without a key the suite still runs using the default 'spec' reporter —
  // results just won't be uploaded.
  reporter: uploadEnabled ? '@testream/mocha-reporter' : 'spec',

  ...(uploadEnabled && {
    'reporter-option': [
      // Store TESTREAM_API_KEY in .env locally and in GitHub Actions Secrets for CI.
      `apiKey=${apiKey}`,
      'uploadEnabled=true',
      'failOnUploadError=true',

      // Application info
      `appName=mocha-jira-reporter-example`,
      `appVersion=${process.env.TESTREAM_APP_VERSION || '1.0.0'}`,

      // Environment
      `testEnvironment=${process.env.TEST_ENV || 'local'}`,

      // Report type
      'testType=unit',

      // branch, commitSha, repositoryUrl, buildNumber, and buildUrl
      // are auto-detected by the reporter in CI environments.
    ],
  }),
};
