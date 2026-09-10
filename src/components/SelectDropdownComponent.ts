import { Page, Locator } from '@playwright/test';

/**
 * SelectDropdownComponent — models OrangeHRM's custom `.oxd-select`
 * dropdown (not a native <select>): click a trigger element, a list of
 * options renders, click the one you want.
 *
 * Two selection strategies exist across the current page objects and
 * are preserved here rather than collapsed into one, since they fit
 * different situations:
 *   - selectByText: scoped/unscoped exact-text match via getByText.
 *     Used by AddUser (Role/Status), AddVacancies (Job Title), and
 *     LeavePage (Leave Type).
 *   - selectByLoopMatch: iterate options and compare innerText. Used by
 *     PimPage's employment-status dropdown, kept as its own method
 *     since it targets a specific options locator rather than relying
 *     on scoped text matching.
 */
export class SelectDropdownComponent {
    constructor(
        private readonly page: Page,
        private readonly trigger: Locator,
        private readonly optionsContainer?: Locator
    ) {}

    /**
     * Clicks the trigger, then clicks the option matching `optionText`
     * within `optionsContainer` (or anywhere on the page if no container
     * was provided — matches AddVacancies' original unscoped behaviour
     * for Job Title).
     */
    async selectByText(
        optionText: string,
        opts?: { exact?: boolean; timeout?: number }
    ): Promise<void> {
        await this.trigger.waitFor({ state: 'visible' });
        await this.trigger.click();

        const scope = this.optionsContainer ?? this.page; //"Use the dropdown options container if available; otherwise use the whole page."
        const option = scope.getByText(optionText, {
            exact: opts?.exact ?? true, //By default, the text should match exactly.
        });

        await option.waitFor({
            state: 'visible',
            timeout: opts?.timeout ?? 10000,
        });//Wait until the option is visible, but don't wait longer than 10 seconds.
        await option.click();
    }

    /**
     * Clicks the trigger, then loops through `optionsLocator` and clicks
     * the first one whose trimmed innerText matches `optionText` exactly.
     */
    async selectByLoopMatch(
        optionsLocator: Locator,
        optionText: string
    ): Promise<void> {
        await this.trigger.waitFor({ state: 'visible' });
        await this.trigger.click();

        const count = await optionsLocator.count();
        for (let i = 0; i < count; i++) {
            const text = (await optionsLocator.nth(i).innerText()).trim();
            if (text === optionText) {
                await optionsLocator.nth(i).click();
                return;
            }
        }

        throw new Error(
            `Dropdown option "${optionText}" not found among ${count} option(s)`
        );
    }
}
