import fs from "fs";
import path from "path";
import { test as setup, request } from "@playwright/test";
import { AdminLoginPage } from "../pages/employer/login.page";
import { requiredEnv } from "../utils";

/**
 * Runs once before the authenticated project. Reuses the cached
 * session in authFile as long as it still passes an auth check; only
 * falls back to a real UI login (and re-saves the file) when the
 * session is missing or expired. `/en/admin` 307-redirects to the
 * login page for an unauthenticated/expired session and returns 200
 * otherwise, so a plain HTTP request is enough to tell them apart —
 * no browser needed for the check itself.
 */
const authFile = path.resolve(__dirname, "../playwright/.auth/employer.json");
const baseURL = requiredEnv("BASE_URL");

async function hasValidSession(): Promise<boolean> {
  if (!fs.existsSync(authFile)) return false;

  const context = await request.newContext({
    baseURL,
    storageState: authFile,
    ignoreHTTPSErrors: true,
  });
  try {
    const response = await context.get("/en/admin", { maxRedirects: 0 });
    return response.status() === 200;
  } finally {
    await context.dispose();
  }
}

setup("authenticate as employer", async ({ page }) => {
  if (await hasValidSession()) return;

  const loginPage = new AdminLoginPage(page);
  await loginPage.goto();
  await loginPage.login(
    requiredEnv("EMPLOYER_TEST_EMAIL"),
    requiredEnv("EMPLOYER_TEST_PASSWORD"),
  );
  await page.waitForURL(/\/en\/admin\/?$/);

  await page.context().storageState({ path: authFile });
});
