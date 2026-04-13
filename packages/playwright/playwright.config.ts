import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../../.env') });

import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // setting up a local webserver where to run the tests
  // webServer: {
  //   command: 'npm run start',
  //   port: 5174,
  //   timeout: 120 * 1000,
  //   reuseExistingServer: !process.env.CI,
  // },
  timeout: 30_000,
  globalTimeout: 10 * 60 * 1000,
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI (Github action) 2 times and locally 1 time */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['list']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.CLIENT_BASE_URL,
    testIdAttribute: 'data-test',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    headless: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        // viewport: { width: 1280, height: 720},
        permissions: ['clipboard-read'],
      },
    },

    // {
    //   name: 'firefox',
    //   dependencies: ['setup'],
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   dependencies: ['setup'],
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 13'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
