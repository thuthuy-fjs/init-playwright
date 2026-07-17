# Employer Job Postings Flow

## Application Overview

This plan covers the employer/admin flow of logging in, landing on the post-login home (dashboard) page, navigating to "My Job Postings" (reached via the "View all" link on the Active Jobs widget on the dashboard, landing on a page whose breadcrumb reads "My Job Postings"), opening the detail view of a job posting from that list, and logging out. Login itself is already covered by specs/admin-login.md and is used here only as the entry step. All URLs use the `en` locale because the app redirects `/vi/admin/login` to `/en/admin/login` in the current environment; BASE_URL, EMPLOYER_TEST_EMAIL and EMPLOYER_TEST_PASSWORD come from the repo's .env file. Scenarios below reflect only what was directly observed while exploring the live app (https://ts.stgcrv.dev) with the employer test account.

## Test Scenarios

### 1. Employer Job Postings Flow

**Seed:** `tests/seed.spec.ts`

#### 1.1. Home page (dashboard) is displayed after login

**File:** `specs/employer-job-postings-flow.md`

**Steps:**
  1. Navigate to the admin login page and log in with the employer test credentials (email: EMPLOYER_TEST_EMAIL, password: EMPLOYER_TEST_PASSWORD from .env).
    - expect: Browser is redirected to `/en/admin`.
    - expect: Page title is "Welcome to the hrvietnam Talent Network".
    - expect: Left sidebar menu is visible with items: HomePage, Job Requisitions, Candidates, Import Candidates, Report, Account Tools, FAQs, Referral Management, HR Central, Member Search, Calendar.
    - expect: Breadcrumb shows "Dashboard Referral".
    - expect: Top-right avatar button is visible.
  2. Observe the dashboard content.
    - expect: "Activity Summary" section shows tiles for MY REQUISITIONS, MY CANDIDATES, TALENT POOL, and ACTIVITIES FOR PAST 30 DAYS with numeric counters.
    - expect: "POSITION REQUEST" section with a requisitions table and "Create Requisition" / "View all" links is visible.
    - expect: "Active Jobs" section is visible with two tab buttons: "My Job Postings (N)" and "Jobs Ending Less Than 7 Days (N)", a jobs table, and a "View all" link.

#### 1.2. Active Jobs widget tab with zero results shows an empty state

**File:** `specs/employer-job-postings-flow.md`

**Steps:**
  1. Log in and land on the `/en/admin` dashboard.
  2. In the "Active Jobs" section, click the "Jobs Ending Less Than 7 Days (0)" tab button.
    - expect: The URL stays on `/en/admin` (no navigation occurs; this is an in-page tab toggle).
    - expect: The jobs table for that tab shows a "No data" icon and the text "No record found" instead of job rows.
  3. Click the "My Job Postings (N)" tab button again.
    - expect: The table reverts to showing job rows (e.g. "post referral", location, status, posting date, candidate count).

#### 1.3. Navigate from the dashboard to My Job Postings

**File:** `specs/employer-job-postings-flow.md`

**Steps:**
  1. Log in and land on the `/en/admin` dashboard.
  2. In the "Active Jobs" section, click the "View all" link (next to the jobs table, url `/en/admin/job?status=1`).
    - expect: Browser navigates to `/en/admin/job?status=1`.
    - expect: Breadcrumb reads "My Job Postings".
    - expect: Four filter tabs are visible: "All (N)", "Active (N)", "Inactive (N)", "Pending (N)", with "Active" selected by default.
    - expect: A "Filter" button, an "Export" button, and a "Row per pages" selector (options 20/50/100, default 20) are visible.
    - expect: A table is displayed with columns: Job Title, Job ID, Status, Date Posted, Date Inactive, Views, Candidates, Matched TS, Matched RDB.
    - expect: Pagination controls are visible at the bottom (Go to previous page / page number buttons / Go to next page), with "Go to previous page" disabled on page 1.

#### 1.4. My Job Postings list row displays expected metadata

**File:** `specs/employer-job-postings-flow.md`

**Steps:**
  1. Log in, then navigate to My Job Postings (`/en/admin/job?status=1`) via the dashboard's Active Jobs "View all" link.
  2. Inspect the first row in the job postings table.
    - expect: The row shows the job title as a link, a "View job" link (pointing to the public job posting page), Job Category, Workplace, and Employment Type.
    - expect: The row shows a numeric Job ID, a Status button (e.g. "Active"), Date Posted, Date Inactive, a Views count, and a Candidates count with a breakdown by match score.

#### 1.5. Switch between My Job Postings status tabs

**File:** `specs/employer-job-postings-flow.md`

**Steps:**
  1. Log in and navigate to My Job Postings (`/en/admin/job?status=1`).
    - expect: "Active (N)" tab is selected by default and the URL query is `status=1`.
  2. Click the "All (N)" tab.
    - expect: The table content updates to include postings of all statuses (a much larger count, e.g. All (5580) vs Active (69)).
  3. Click the "Inactive (N)" tab.
    - expect: The table content updates to show only inactive postings.
  4. Click the "Pending (N)" tab.
    - expect: The table content updates to show only pending postings.

#### 1.6. Open the detail view of a job posting from the list

**File:** `specs/employer-job-postings-flow.md`

**Steps:**
  1. Log in and navigate to My Job Postings (`/en/admin/job?status=1`).
  2. Click the title link of the first job posting in the table (e.g. "post referral").
    - expect: Browser navigates to `/en/admin/requisition/create?status=1&lst_type=job&requisition_id=<id>&page=<n>&view=1`.
    - expect: Breadcrumb reads "My Job Requisition > View Detail", where "My Job Requisition" is a link back to `/en/admin/requisition`.
    - expect: A row of tabs is visible: "Job Requisition" (selected), "Approval", "Matching Score Settings", "Posting", "External Apply Sources", "History", "Import Source".

#### 1.7. Job posting detail page displays read-only job information

**File:** `specs/employer-job-postings-flow.md`

**Steps:**
  1. Log in, navigate to My Job Postings, and open the detail view of the first job posting in the list.
  2. Inspect the summary header section.
    - expect: The job title is shown as a heading (e.g. "Job Title post referral").
    - expect: Key-value fields are shown: Req ID, Job Level, Employee Type, Experience, Salary Range, Client Name, Workplace, Job Category, Number of Vacancies, Deadline to Apply, Expected Fill Date, Repost, Date Created, Date Posted, Modified Date, Disposition Stage, Views, and Candidates (as a link).
  3. Scroll through the rest of the page.
    - expect: A "Job Description" section with formatted rich text is visible.
    - expect: A "Job Requirements" section with formatted rich text is visible.
    - expect: An "Other Information" section with fields such as "Reason for Vacancy" and "Note" is visible.

#### 1.8. Logout ends the session and redirects to the login page

**File:** `specs/employer-job-postings-flow.md`

**Steps:**
  1. Log in, navigate to My Job Postings, and open the detail view of a job posting.
  2. Click the avatar button in the top-right corner to open the user menu.
    - expect: A dropdown/tooltip menu appears with: user email and "This is a Heading" label, "My Account" link, "Talent Network" link, a "Languages" selector, and a "Logout" item.
  3. Click "Logout".
    - expect: Browser is redirected to `/en/admin/login`.
    - expect: The login form (Email, Password, Login button) is displayed again.
  4. After logging out, navigate directly to `/en/admin`.
    - expect: Browser is redirected to `/en/admin/login?callbackUrl=%2Fen%2Fadmin`, confirming the session was cleared and the dashboard route requires authentication.
  5. After logging out, navigate directly to `/en/admin/job?status=1`.
    - expect: Browser is redirected to `/en/admin/login?status=1&callbackUrl=%2Fen%2Fadmin%2Fjob%3Fstatus%3D1`, confirming the job postings list route is also protected.

#### 1.9. End-to-end: login, view My Job Postings, open a job detail, and logout

**File:** `specs/employer-job-postings-flow.md`

**Steps:**
  1. Navigate to the admin login page and log in with the employer test credentials.
    - expect: Browser lands on `/en/admin` (dashboard/home page).
  2. In the "Active Jobs" widget on the dashboard, click "View all".
    - expect: Browser navigates to `/en/admin/job?status=1` with breadcrumb "My Job Postings" and a populated jobs table.
  3. Click the title link of the first job posting in the list.
    - expect: Browser navigates to the job posting detail page with breadcrumb "My Job Requisition > View Detail", showing the same job title and Req ID as the row that was clicked.
  4. Click the avatar button, then click "Logout" from the user menu.
    - expect: Browser is redirected to `/en/admin/login` and the login form is shown, ending the session.
