// spec: specs/employer-job-postings-flow.md
// seed: tests/seed.spec.ts

import { test, expect } from "../fixtures";

test.describe("Employer Job Postings Flow", () => {
  // No logout here, so this test is read-only and safe to run against
  // the shared cached session from tests/auth.setup.ts.
  test("View My Job Postings and open a job detail", async ({
    homePage,
    jobPostingsListPage,
    jobPostingDetailPage,
    page,
  }) => {
    // 1. Land on the dashboard already authenticated.
    await homePage.goto();

    await expect(page).toHaveURL(/\/en\/admin\/?$/);

    // 2. In the "Active Jobs" widget on the dashboard, click "View all".
    await homePage.viewAllActiveJobs();

    await expect(page).toHaveURL(/\/en\/admin\/job\?status=1/);
    await expect(jobPostingsListPage.breadcrumb).toHaveText("My Job Postings");
    await expect(jobPostingsListPage.jobsTable).toBeVisible();
    await expect(jobPostingsListPage.firstJobTitleLink).toBeVisible();

    // The list row's title link also carries a trailing job code, e.g.
    // page's title heading does not repeat — strip it before comparing.
    const clickedJobTitle = (
      await jobPostingsListPage.firstJobTitleLink.textContent()
    )
      ?.trim()
      .replace(/\s*\([^()]*\)$/, "");
    const clickedJobId = (
      await jobPostingsListPage.firstJobIdCell.textContent()
    )?.trim();

    // 3. Click the title link of the first job posting in the list.
    await jobPostingsListPage.openFirstJobPosting();

    await expect(page).toHaveURL(/\/en\/admin\/requisition\/create\?.*view=1/);
    await expect(
      jobPostingDetailPage.myJobRequisitionBreadcrumbLink,
    ).toHaveText("My Job Requisition");
    await expect(jobPostingDetailPage.viewDetailBreadcrumbItem).toHaveText(
      "View Detail",
    );
    await expect(jobPostingDetailPage.jobTitleValue).toHaveText(
      clickedJobTitle!,
    );
    await expect(jobPostingDetailPage.reqIdValue).toHaveText(clickedJobId!);
  });
});
