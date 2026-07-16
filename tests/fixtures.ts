import { test as base } from "@playwright/test";
import { AdminLoginPage } from "../pages/employer/login.page";

/**
 * Central fixture file: every Page Object gets wired up here so spec
 * files never do `new SomePage(page)` by hand. Add one fixture per
 * screen as new Page Objects are created.
 */
type Fixtures = {
  adminLoginPage: AdminLoginPage;
};

export const test = base.extend<Fixtures>({
  adminLoginPage: async ({ page }, use) => {
    await use(new AdminLoginPage(page));
  },
});

export { expect } from "@playwright/test";
