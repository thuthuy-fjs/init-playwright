import { test as base } from "@playwright/test";
import { AdminLoginPage } from "../pages/employer/login.page";
import { HomePage } from "../pages/employer/home.page";
import { JobPostingsListPage } from "../pages/employer/job-postings-list.page";
import { JobPostingDetailPage } from "../pages/employer/job-posting-detail.page";

/**
 * Central fixture file: every Page Object gets wired up here so spec
 * files never do `new SomePage(page)` by hand. Add one fixture per
 * screen as new Page Objects are created.
 */
type Fixtures = {
  adminLoginPage: AdminLoginPage;
  homePage: HomePage;
  jobPostingsListPage: JobPostingsListPage;
  jobPostingDetailPage: JobPostingDetailPage;
};

export const test = base.extend<Fixtures>({
  adminLoginPage: async ({ page }, use) => {
    await use(new AdminLoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  jobPostingsListPage: async ({ page }, use) => {
    await use(new JobPostingsListPage(page));
  },
  jobPostingDetailPage: async ({ page }, use) => {
    await use(new JobPostingDetailPage(page));
  },
});

export { expect } from "@playwright/test";
