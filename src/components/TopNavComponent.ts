import { Page, expect } from '@playwright/test';

/**
 * TopNavComponent — models the sidebar/top-level module links shared by
 * every page in the app (PIM, Recruitment, Admin, Time, Leave, and
 * Recruitment's own Vacancies sub-link).
 *
 * Every page object previously declared its own `getByRole('link', ...)`
 * locator for whichever module it needed, plus its own click sequence.
 * This gives every page object the same one call — `topNav.goTo('PIM')`
 * — instead of a locator + a click method per module. It intentionally
 * does NOT cover second-level tabs like Time > Attendance's "Punch
 * In/Out", which use a different locator strategy
 * (`.oxd-topbar-body-nav-tab-item` / `menuitem` role, not `link`) —
 * those stay in Timepage.ts, since they aren't the same widget.
 */
export class TopNavComponent {
    constructor(private readonly page: Page) {}

    /**
     * Clicks a top-level nav link by its accessible name, using the same
     * defensive sequence as BasePage.click() (visible → scrolled into
     * view → enabled → click), since components don't extend BasePage.
     *
     * @param moduleName  Accessible name of the link, e.g. 'PIM',
     *                    'Recruitment', 'Admin', 'Time', 'Leave',
     *                    'Vacancies'.
     * @param exact       Whether to require an exact name match. Some
     *                    modules (PIM, Recruitment as used by
     *                    AddCandidates, Time) were originally matched
     *                    non-exactly; default true matches the majority
     *                    of call sites (Recruitment via AddVacancies,
     *                    Admin, Leave, Vacancies).
     */
    async goTo(moduleName: string, exact = true): Promise<void> {
        const link = this.page.getByRole('link', {
            name: moduleName,
            exact,
        });

        await link.waitFor({ state: 'visible' });
        await link.scrollIntoViewIfNeeded();
        await expect(link).toBeEnabled();
        await link.click();
    }
}
