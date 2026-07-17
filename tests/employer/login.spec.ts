import { test, expect } from "../fixtures";
import { requiredEnv } from "../../utils";

const EMPLOYER_EMAIL = requiredEnv("EMPLOYER_TEST_EMAIL");
const EMPLOYER_PASSWORD = requiredEnv("EMPLOYER_TEST_PASSWORD");

test.describe("Admin Login", () => {
  // The login screen must be reachable without an existing session, so
  // this suite opts out of the project-level authenticated storageState.
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ adminLoginPage }) => {
    await adminLoginPage.goto();
  });

  test("should display the login form", async ({ adminLoginPage, page }) => {
    await expect(page).toHaveTitle("TS Employer - Login");
    await expect(adminLoginPage.emailInput).toBeVisible();
    await expect(adminLoginPage.passwordInput).toBeVisible();
    await expect(adminLoginPage.loginButton).toBeVisible();
    await expect(adminLoginPage.forgotPasswordLink).toBeVisible();
  });

  test("should show validation errors when submitting an empty form", async ({
    adminLoginPage,
  }) => {
    await adminLoginPage.submit();

    await expect(adminLoginPage.emailError).toHaveText("Enter your email");
    await expect(adminLoginPage.passwordError).toHaveText(
      "Please enter password",
    );
  });

  test("should show an error when the email format is invalid", async ({
    adminLoginPage,
  }) => {
    await adminLoginPage.fillEmail("not-an-email");
    await adminLoginPage.submit();

    await expect(adminLoginPage.emailError).toHaveText("Wrong email format");
  });

  test("should toggle password visibility", async ({ adminLoginPage }) => {
    await adminLoginPage.fillPassword("Secret123!");
    await expect(adminLoginPage.passwordInput).toHaveAttribute(
      "type",
      "password",
    );

    await adminLoginPage.togglePasswordVisibility();

    await expect(adminLoginPage.passwordInput).toHaveAttribute("type", "text");
  });

  test("should show an error message for invalid credentials", async ({
    adminLoginPage,
  }) => {
    await adminLoginPage.login("invalid-user@example.com", "WrongPassword123!");

    await expect(adminLoginPage.formError).toBeVisible();
  });

  test("should log in successfully with valid credentials", async ({
    adminLoginPage,
    page,
  }) => {
    await adminLoginPage.login(EMPLOYER_EMAIL, EMPLOYER_PASSWORD);

    await expect(page).toHaveURL(/\/admin\/?$/);
    await expect(page.getByRole("button", { name: "avatar" })).toBeVisible();
  });

  test("should navigate to the forgot password page", async ({
    adminLoginPage,
    page,
  }) => {
    await adminLoginPage.forgotPasswordLink.click();

    await expect(page).toHaveURL(/\/admin\/forgotpass/);
  });
});
