
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    { command: 'npm run dev', cwd: '.', port: 3000, reuseExistingServer: true },
    { command: 'npm run dev', cwd: '../api', port: 4000, reuseExistingServer: true },
  ],
});
