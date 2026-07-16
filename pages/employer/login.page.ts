import type { Locator, Page } from "@playwright/test";
import { BasePage } from "../base.page";

/**
 * Page Object for https://ts.stgcrv.dev/vi/admin/login
 *
 * Locator strategy notes (real DOM has no data-testid hooks, MUI class
 * names are hashed/unstable):
 * - Inputs are scoped via the app's own `data-field-anchor` attribute.
 * - The password visibility toggle has no accessible name, so it is
 *   scoped to `form button[type="button"]` (the only such button on the page).
 */
export class AdminLoginPage extends BasePage {
  readonly path = "/vi/admin/login";

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordToggleButton: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly formError: Locator;

  constructor(page: Page) {
    super(page);

    this.emailInput = page.locator('[data-field-anchor="email"] input');
    this.passwordInput = page.locator('[data-field-anchor="password"] input');
    this.passwordToggleButton = page.locator('form button[type="button"]');
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.forgotPasswordLink = page.getByRole("link", { name: "Forgot Password?" });
    this.emailError = page.locator('[data-field-anchor="email"] .MuiFormHelperText-root');
    this.passwordError = page.locator('[data-field-anchor="password"] .MuiFormHelperText-root');
    this.formError = page.getByText("Error occurr, please input again");
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.passwordToggleButton.click();
  }

  async submit(): Promise<void> {
    await this.loginButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }
}
