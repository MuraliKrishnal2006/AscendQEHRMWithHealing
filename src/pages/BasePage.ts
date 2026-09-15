import {Page, Locator,expect} from '@playwright/test';
import { healLocator } from '../utils/Locator-healing-utility';
 
/**
 * BasePage — shared foundation for every Page Object in the framework.
 * All page classes extend this instead of duplicating common Playwright
 * actions, so a fix or improvement here (e.g. a better wait strategy)
 * automatically applies to every page.
 */

export class BasePage {
     readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(path: string = '/'): Promise<void> {
        await this.page.goto(path);
    }

    async waitForElement(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'visible' });
    }

    /**
     * Waits for any active OrangeHRM loader or spinner overlay to disappear.
     * In Playwright, if no loader is present or attached, this returns immediately.
     */
    async waitForLoader(timeout: number = 15000): Promise<void> {
        await this.page.locator('.oxd-form-loader, .oxd-loading-spinner').waitFor({
            state: 'hidden',
            timeout,
        }).catch(() => {});
    }

    async fill(locator: Locator, value: string): Promise<void> {
        await this.waitForLoader();
        await this.waitForElement(locator);
        await locator.fill(value);
    }

    async click(locator: Locator): Promise<void> {
        await this.waitForLoader();
        await locator.waitFor({ state: 'visible' });
        await locator.scrollIntoViewIfNeeded();
        await expect(locator).toBeEnabled();
        await locator.click();
    }

    async getText(locator: Locator): Promise<string> {
        await this.waitForElement(locator);
        return (await locator.textContent())?.trim() ?? '';
    }

    async healClick(candidates: Array<() => Locator>): Promise<void> {
        await this.waitForLoader();
        const locator = await healLocator(candidates);

        await locator.scrollIntoViewIfNeeded();
        await expect(locator).toBeEnabled();
        await locator.click();
    }

    async healFill(
        candidates: Array<() => Locator>,
        value: string
    ): Promise<void> {
        await this.waitForLoader();
        const locator = await healLocator(candidates);

        await locator.waitFor({ state: 'visible' });
        await locator.fill(value);
    }

    async healClear(candidates: Array<() => Locator>): Promise<void> {
        const locator = await healLocator(candidates);
        await locator.waitFor({ state: 'visible' });
        await locator.fill('');
    }

    async healGetText(candidates: Array<() => Locator>): Promise<string> {
        const locator = await healLocator(candidates);
        return (await locator.textContent())?.trim() ?? '';
    }
}