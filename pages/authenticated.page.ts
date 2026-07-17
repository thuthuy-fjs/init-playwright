import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

/**
 * Common ancestor for Page Objects that require a logged-in session.
 * Every authenticated employer admin screen shares the same top-right
 * avatar button and its dropdown user menu, so login/logout live here.
 *
 * Locator strategy notes (real DOM has no data-testid hooks):
 * - The avatar button is matched by its accessible name "avatar"
 *   (same check already used in tests/employer/login.spec.ts).
 * - The "Logout" entry in the dropdown has no role/button semantics;
 *   it is matched by its exact, DOM-unique text.
 */
export abstract class AuthenticatedPage extends BasePage {
  readonly avatarButton: Locator;
  readonly logoutMenuItem: Locator;

  constructor(page: Page) {
    super(page);

    this.avatarButton = page.getByRole("button", { name: "avatar" });
    this.logoutMenuItem = page.getByText("Logout", { exact: true });
  }

  async openUserMenu(): Promise<void> {
    await this.avatarButton.click();
  }

  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.logoutMenuItem.click();
  }
}
