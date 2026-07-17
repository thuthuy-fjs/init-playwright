import type { Locator, Page } from "@playwright/test";
import { AuthenticatedPage } from "../authenticated.page";

/**
 * Page Object for the job posting detail page, e.g.
 * https://ts.stgcrv.dev/en/admin/requisition/create?status=1&lst_type=job&requisition_id=<id>&page=<n>&view=1
 *
 * Locator strategy notes (real DOM has no data-testid hooks, MUI class
 * names are hashed/unstable):
 * - The breadcrumb renders a "My Job Requisition" link followed by an
 *   icon separator and a plain "View Detail" item; both are scoped
 *   inside the breadcrumb navigation landmark.
 * - The summary heading renders as
 *   `<h6>Job Title <span>{title}</span></h6>`, so the job title text
 *   itself is scoped to the <span> inside the heading that starts with
 *   "Job Title" (to exclude the "Job Title" label prefix).
 * - Each summary field is an <li> with two <p> children (label, value);
 *   the Req ID value is the 2nd <p> in the <li> containing "Req ID:".
 */
export class JobPostingDetailPage extends AuthenticatedPage {
  readonly breadcrumb: Locator;
  readonly myJobRequisitionBreadcrumbLink: Locator;
  readonly viewDetailBreadcrumbItem: Locator;
  readonly jobTitleHeading: Locator;
  readonly jobTitleValue: Locator;
  readonly reqIdValue: Locator;

  constructor(page: Page) {
    super(page);

    this.breadcrumb = page.getByRole("navigation", { name: "breadcrumb" });
    this.myJobRequisitionBreadcrumbLink = this.breadcrumb.getByRole("link", {
      name: "My Job Requisition",
    });
    this.viewDetailBreadcrumbItem = this.breadcrumb.getByText("View Detail");
    this.jobTitleHeading = this.page
      .getByRole("heading", { level: 6 })
      .filter({ hasText: "Job Title" });
    this.jobTitleValue = this.jobTitleHeading.locator("span");
    this.reqIdValue = this.page
      .locator("li")
      .filter({ hasText: "Req ID:" })
      .locator("p")
      .nth(1);
  }
}
