import { Page, Locator, expect } from '@playwright/test';

/**
 * AutocompleteComponent — models the "type-for-hints" autocomplete widget
 * that appears across the app (employee name search on PIM, Leave, Time
 * Attendance, and User/Vacancy creation forms).
 *
 * Before this component existed, five different page objects each
 * re-implemented their own version of "type text, wait for suggestions,
 * click a match" — with small, easy-to-miss differences (fill vs.
 * pressSequentially, exact match vs. first-match) that made behaviour
 * inconsistent across the suite. This centralizes both real usage
 * patterns found in the codebase as two explicit methods, instead of
 * silently picking one and hoping it fits every call site.
 */
export class AutocompleteComponent {
    constructor(
        private readonly page: Page,
        private readonly input: Locator,
        private readonly options: Locator
    ) { }

    /**
     * Types `typedText` and clicks the option whose text matches
     * `matchText` exactly. Most callers type and match the same string
     * (e.g. AddUser's employee picker); PimPage's search is the
     * exception — it types a partial name (e.g. "Cha") but matches the
     * full name returned in the dropdown (e.g. "Charles Carter"), so
     * the two are kept as separate parameters rather than one.
     *
     * @param typedText       Text typed into the input.
     * @param matchText       Exact text of the option to select.
     *                        Defaults to `typedText` when omitted.
     * @param useKeystrokes   Use pressSequentially instead of fill.
     *                        Some autocompletes (e.g. PIM's) only trigger
     *                        their suggestion list on real keystroke
     *                        events — fill() sets the value instantly and
     *                        skips those events entirely.
     */
    async selectExact(
        typedText: string,
        matchText?: string,
        opts?: { useKeystrokes?: boolean }
    ): Promise<void> {

        const target = (matchText ?? typedText)
            .trim()
            .toLowerCase();

        await this.input.waitFor({
            state: 'visible',
            timeout: 15000
        });

        // Clear existing value
        await this.input.fill('');

        // Type the search text
        if (opts?.useKeystrokes) {
            await this.input.pressSequentially(typedText, {
                delay: 100
            });
        } else {
            await this.input.fill(typedText);
        }

        // Wait for the actual matching suggestion
        await expect.poll(
            async () => {
                const count = await this.options.count();

                for (let i = 0; i < count; i++) {
                    const optionText = (await this.options.nth(i).innerText())
                        .trim()
                        .toLowerCase();

                    console.log(
                        `Search text: ${target} | Suggestion: ${optionText}`
                    );

                    // Ignore loading message
                    if (optionText === 'searching....') {
                        continue;
                    }

                    // Check for matching suggestion
                    if (optionText.includes(target)) {
                        return true;
                    }
                }

                return false;
            },
            {
                timeout: 30000,
                intervals: [500, 1000, 1500]
            }
        ).toBe(true);

        // Select the matching suggestion
        const count = await this.options.count();

        for (let i = 0; i < count; i++) {
            const option = this.options.nth(i);

            const optionText = (await option.innerText())
                .trim()
                .toLowerCase();

            if (
                optionText !== 'searching....' &&
                optionText.includes(target)
            ) {
                console.log(`Selecting employee: ${optionText}`);

                await option.click();
                return;
            }
        }

        throw new Error(
            `Autocomplete option matching "${target}" not found`
        );
    }

    /**
     * Types a (possibly partial) search string and clicks the first
     * matching suggestion — used where the caller only has a partial
     * value on hand (e.g. LeaveListPage/Timepage searching by the first
     * six characters of a username) and any reasonable match is fine.
     *
     * @param searchText  Text to type into the input.
     * @param filterText  Optional: only consider options containing this
     *                    text (used by AddVacancies' Hiring Manager field,
     *                    where multiple suggestions can otherwise match).
     */


    async selectFirstMatch(
        searchText: string,
        filterText?: string,
        timeout = 15000
    ): Promise<void> {

        // Click the autocomplete input
        await this.input.click();

        // Clear existing text
        await this.input.fill('');

        // Type the search criteria character by character
        await this.input.pressSequentially(searchText, {
            delay: 200
        });

        // Wait after the last character for the autocomplete
        // search result to be loaded
        await this.input.page().waitForTimeout(1500);

        // Find the required employee
        const target = filterText
            ? this.options.filter({ hasText: filterText })
            : this.options;

        // Select the first matching result
        const option = target.first();

        // Wait up to 15 seconds for the result to become visible
        await option.waitFor({
            state: 'visible',
            timeout
        });

        // Click the employee result
        await option.click();

    }

}
