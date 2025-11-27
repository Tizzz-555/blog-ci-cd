// @ts-check
const { defineConfig, devices } = require("@playwright/test");

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  timeout: 30000,
  globalTimeout: process.env.CI ? 10 * 60 * 1000 : undefined, // 10 min max in CI
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0, // Reduced from 2 to 1
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? "list" : "html", // Simpler output in CI
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://127.0.0.1:5173",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    /* Extra HTTP headers for API requests - not needed but good for debugging */
    extraHTTPHeaders: {
      Accept: "application/json",
    },
  },

  /* Configure projects for major browsers */
  // Only test Chromium in CI for speed, all browsers locally
  projects: process.env.CI
    ? [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
    : [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },
      ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: "npm run start:test",
      url: "http://127.0.0.1:3000/health",
      cwd: "..",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      env: /** @type {Record<string, string>} */ (process.env),
    },
    {
      command: "npm run dev -- --host 0.0.0.0",
      url: "http://127.0.0.1:5173",
      cwd: "../bloglist",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});
