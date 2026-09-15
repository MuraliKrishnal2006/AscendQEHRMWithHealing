import {Page, Locator,expect} from '@playwright/test';
import { healLocator } from '../utils/locatorHeal';
 
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

    async fill(locator: Locator, value: string): Promise<void> {
        await this.waitForElement(locator);
        await locator.fill(value);
    }

    async click(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'visible' });
        await locator.scrollIntoViewIfNeeded();
        await expect(locator).toBeEnabled();
        await locator.click();
    }

    async clear(locator: Locator): Promise<void> {
        await this.waitForElement(locator);
        await locator.clear();
    }

    async getText(locator: Locator): Promise<string> {
        await this.waitForElement(locator);
        return (await locator.textContent())?.trim() ?? '';
    }

    async healClick(candidates: Array<() => Locator>): Promise<void> {
        const locator = await healLocator(candidates);

        await locator.scrollIntoViewIfNeeded();
        await expect(locator).toBeEnabled();
        await locator.click();
    }

    async healFill(
        candidates: Array<() => Locator>,
        value: string
    ): Promise<void> {
        const locator = await healLocator(candidates);

        await locator.waitFor({ state: 'visible' });
        await locator.fill(value);
    }

    async healClear(candidates: Array<() => Locator>): Promise<void> {
        const locator = await healLocator(candidates);

        await locator.waitFor({ state: 'visible' });
        await locator.clear();
    }

    async healGetText(candidates: Array<() => Locator>): Promise<string> {
        const locator = await healLocator(candidates);

        await locator.waitFor({ state: 'visible' });
        return (await locator.textContent())?.trim() ?? '';
    }

    async healExpectVisible(locators: (() => Locator)[]): Promise<void> {
        for (const getLocator of locators) {
            try {
                await expect(getLocator()).toBeVisible({ timeout: 2000 });
                return;
            } catch {
                console.log('Locator failed. Trying next locator...');
            }
        }

        throw new Error('All locators failed');
    }
}