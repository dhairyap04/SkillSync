import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  timeout: 90000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:5175', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    { command: 'node --import tsx tests/e2e/server.ts', url: 'http://127.0.0.1:3101/api/health', reuseExistingServer: false },
    { command: 'npm run dev -- --host 127.0.0.1 --port 5175 --strictPort', url: 'http://127.0.0.1:5175', env: { API_PROXY_TARGET: 'http://127.0.0.1:3101' }, reuseExistingServer: false },
  ],
})
