import type { Locator, Page } from "@playwright/test";
import { AuthenticatedPage } from "../authenticated.page";

/**
 * Page Object for the post-login employer dashboard, e.g.
 * https://ts.stgcrv.dev/en/admin
 *
 * Locator strategy notes (real DOM has no data-testid hooks, MUI class
 * names are hashed/unstable):
 * - The dashboard renders two "View all" links (the "POSITION REQUEST"
 *   and "Active Jobs" widgets) sharing the identical accessible name
 *   "View all", so the Active Jobs one is disambiguated by its stable
 *   destination href (`/en/admin/job?status=1`) instead of link order.
 */
export class HomePage extends AuthenticatedPage {
  readonly path = "/en/admin";

  readonly activeJobsViewAllLink: Locator;

  constructor(page: Page) {
    super(page);

    this.activeJobsViewAllLink = page
      .locator('a[href="/en/admin/job?status=1"]')
      .filter({ hasText: "View all" });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async viewAllActiveJobs(): Promise<void> {
    await this.activeJobsViewAllLink.click();
  }
}
