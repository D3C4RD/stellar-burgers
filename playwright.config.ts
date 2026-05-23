import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',  // ← ИЗМЕНИТЕ: укажите правильную папку с тестами
  /* Run tests in files in parallel */
  fullyParallel: false,  // ← ИЗМЕНИТЕ: лучше отключить для стабильности
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,  // ← ИЗМЕНИТЕ: используйте 1 воркер для начала
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:4000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: 1000
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Временно отключите firefox и webkit для ускорения тестов
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',  // команда для запуска сервера
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,  // если сервер уже запущен - не запускать новый
  },
});