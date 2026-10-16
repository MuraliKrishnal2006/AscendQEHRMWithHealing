import { Page, Locator, expect, test } from '@playwright/test';
import { healLocator } from '../utils/Locator-healing-utility';
import { showAction } from '../utils/LiveActivity';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(path: string = '/'): Promise<void> {
        await showAction(this.page, `Navigate to "${path}"`);
        await this.page.goto(path);
    }

    async waitForElement(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'visible' });
    }

    async waitForLoader(timeout: number = 15000): Promise<void> {
        await this.page
            .locator('.oxd-form-loader, .oxd-loading-spinner')
            .waitFor({
                state: 'hidden',
                timeout,
            })
            .catch(() => { });
    }

    async fill(locator: Locator, value: string): Promise<void> {
        await this.waitForLoader();
        await this.waitForElement(locator);

        await showAction(
            this.page,
            `Enter value: ${value}`
        );

        await locator.fill(value);
    }

    async click(locator: Locator): Promise<void> {
        await this.waitForLoader();
        await locator.waitFor({ state: 'visible' });
        await locator.scrollIntoViewIfNeeded();
        await expect(locator).toBeEnabled();

        await showAction(
            this.page,
            `Click ${await this.getLocatorDescription(locator)}`
        );

        await locator.click();
    }

    async clear(locator: Locator): Promise<void> {
        await this.waitForElement(locator);

        await showAction(
            this.page,
            `Clear ${await this.getLocatorDescription(locator)}`
        );

        await locator.clear();
    }

    async getText(locator: Locator): Promise<string> {
        await this.waitForElement(locator);
        return (await locator.textContent())?.trim() ?? '';
    }

    // ============================================================
    // HEAL CLICK
    // ============================================================

    async healClick(
        candidates: Array<() => Locator>,
        actionName?: string
    ): Promise<void> {

        await this.waitForLoader();

        if (actionName) {
            await test.step(actionName, async () => {
                await this.performHealClick(
                    candidates,
                    actionName
                );
            });
            return;
        }

        await this.performHealClick(candidates);
    }

    private async performHealClick(
        candidates: Array<() => Locator>,
        actionName?: string
    ): Promise<void> {

        const locator = await healLocator(candidates);

        await locator.scrollIntoViewIfNeeded();
        await expect(locator).toBeEnabled();

        /*
         * If an action name was supplied from the Page Object,
         * use that meaningful business action in Live Activity.
         *
         * Example:
         * Click on Login button
         * Click on Save button
         * Click on Add Employee button
         */
        if (actionName) {
            await showAction(
                this.page,
                actionName
            );
        } else {
            await showAction(
                this.page,
                `Click ${await this.getLocatorDescription(locator)}`
            );
        }

        await locator.click();
    }

    // ============================================================
    // HEAL FILL
    // ============================================================

    async healFill(
        candidates: Array<() => Locator>,
        value: string,
        actionName?: string,
        maskValue: boolean = false
    ): Promise<void> {

        await this.waitForLoader();

        if (actionName) {

            const displayValue = maskValue
                ? '********'
                : value;

            await test.step(
                `${actionName} value: ${displayValue}`,
                async () => {

                    await this.performHealFill(
                        candidates,
                        value,
                        actionName,
                        maskValue
                    );
                }
            );

            return;
        }

        await this.performHealFill(
            candidates,
            value
        );
    }

    private async performHealFill(
        candidates: Array<() => Locator>,
        value: string,
        actionName?: string,
        maskValue: boolean = false
    ): Promise<void> {

        const locator = await healLocator(candidates);

        await locator.waitFor({
            state: 'visible'
        });

        /*
         * Display the meaningful business action.
         *
         * Example:
         * Enter Username value: AscendQETest
         * Enter Password value: ********
         * Enter FirstName value: Murali
         */
        if (actionName) {

            const displayValue = maskValue
                ? '********'
                : value;

            await showAction(
                this.page,
                `${actionName} value: ${displayValue}`
            );

        } else {

            await showAction(
                this.page,
                `Enter value: ${maskValue ? '********' : value}`
            );
        }

        await locator.fill(value);

        /*
         * Keep the existing diagnostic logging.
         * Password values are masked.
         */
        const inputType = await locator.getAttribute('type');

        console.log(
            'Value:',
            inputType === 'password'
                ? '********'
                : await locator.inputValue()
        );

        console.log(
            'Visible:',
            await locator.isVisible()
        );

        console.log(
            'Enabled:',
            await locator.isEnabled()
        );

        await this.page.waitForTimeout(1000);
    }

    // ============================================================
    // HEAL CLEAR
    // ============================================================

    async healClear(
        candidates: Array<() => Locator>
    ): Promise<void> {

        const locator = await healLocator(candidates);

        await locator.waitFor({
            state: 'visible'
        });

        await showAction(
            this.page,
            `Clear ${await this.getLocatorDescription(locator)}`
        );

        await locator.clear();
    }

    // ============================================================
    // HEAL GET TEXT
    // ============================================================

    async healGetText(
        candidates: Array<() => Locator>
    ): Promise<string> {

        const locator = await healLocator(candidates);

        await locator.waitFor({
            state: 'visible'
        });

        return (
            await locator.textContent()
        )?.trim() ?? '';
    }

    // ============================================================
    // HEAL EXPECT VISIBLE
    // ============================================================

    async healExpectVisible(
        locators: (() => Locator)[]
    ): Promise<void> {

        for (const getLocator of locators) {

            try {

                await expect(
                    getLocator()
                ).toBeVisible({
                    timeout: 2000
                });

                return;

            } catch {

                console.log(
                    'Locator failed. Trying next locator...'
                );
            }
        }

        throw new Error(
            'All locators failed'
        );
    }

    // ============================================================
    // LOCATOR DESCRIPTION
    // ============================================================

    private async getLocatorDescription(
        locator: Locator
    ): Promise<string> {

        try {

            const ariaLabel =
                await locator.getAttribute(
                    'aria-label'
                );

            if (ariaLabel) {
                return `"${ariaLabel}"`;
            }

            const title =
                await locator.getAttribute(
                    'title'
                );

            if (title) {
                return `"${title}"`;
            }

            const text =
                (
                    await locator.textContent()
                )?.trim();

            if (text) {
                return `"${text.substring(0, 50)}"`;
            }

        } catch {
            // Reporting only — do not allow
            // description failure to affect
            // the actual test.
        }

        return 'element';
    }
}