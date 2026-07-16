import type { Page } from "@playwright/test";

/**
 * Common ancestor for every Page Object. Keep page-wide helpers here
 * (e.g. shared header/toast locators) as more screens are added.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}
}
