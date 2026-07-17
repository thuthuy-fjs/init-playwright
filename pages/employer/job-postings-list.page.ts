import type { Locator, Page } from "@playwright/test";
import { AuthenticatedPage } from "../authenticated.page";

/**
 * Page Object for the My Job Postings list page, e.g.
 * https://ts.stgcrv.dev/en/admin/job?status=1
 *
 * Locator strategy notes (real DOM has no data-testid hooks, MUI class
 * names are hashed/unstable):
 * - Rows are scoped to the table that owns the "Job Title" column
 *   header (the page also renders other, unrelated tables).
 * - Within that table, the first data row is the first <tr> containing
 *   an <h6> (the job title cell). Other rows in this table are a
 *   spacer/separator row and an expandable candidate-breakdown row,
 *   neither of which contains an <h6>.
 * - The title link is the first <a> inside that <h6> (the second <a>
 *   in the same heading is the "View job" public-page link).
 * - The Job ID cell is the 3rd <td> (index 2) of the row: expand
 *   button, job info, Job ID.
 */
export class JobPostingsListPage extends AuthenticatedPage {
  readonly path = "/en/admin/job?status=1";

  readonly breadcrumb: Locator;
  readonly jobsTable: Locator;
  readonly firstJobRow: Locator;
  readonly firstJobTitleLink: Locator;
  readonly firstJobIdCell: Locator;

  constructor(page: Page) {
    super(page);

    this.breadcrumb = page.getByRole("navigation", { name: "breadcrumb" });
    this.jobsTable = page
      .locator("table")
      .filter({ has: page.getByRole("columnheader", { name: "Job Title" }) });
    this.firstJobRow = this.jobsTable
      .locator("tbody tr")
      .filter({ has: page.locator("h6") })
      .first();
    this.firstJobTitleLink = this.firstJobRow.locator("h6 a").first();
    this.firstJobIdCell = this.firstJobRow.locator("td").nth(2);
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async openFirstJobPosting(): Promise<void> {
    await this.firstJobTitleLink.click();
  }
}
