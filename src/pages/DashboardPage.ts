import {Page,Locator} from '@playwright/test';
import {BasePage} from './BasePage';
/**
 * DashboardPage — models the post-login landing screen.
 * Kept intentionally minimal: its only job right now is to prove a
 * login actually succeeded, by confirming the "Dashboard" heading loads.
 * Extend this if more dashboard-specific assertions are needed later.
 */
export class DashboardPage extends BasePage {
    readonly DashBoardheader: Locator;
    readonly logoutButton: Locator;
    readonly userDropdown: Locator;
    readonly quickLaunchWidget: Locator;
    readonly employeeDistributionSubUnitWidget: Locator;
    readonly myActionsWidget: Locator;
    readonly assignLeaveButton: Locator;
    readonly myLeaveButton: Locator;


    constructor(page: Page) {
        super(page);
        this.DashBoardheader = page.getByRole('heading', { name: 'Dashboard' });
        this.userDropdown = page.locator('.oxd-userdropdown-tab');
        this.logoutButton = page.getByText('Logout', {exact: true});
        this.quickLaunchWidget = page.locator('.oxd-sheet.orangehrm-dashboard-widget').filter({ hasText: 'Quick Launch' });
        this.employeeDistributionSubUnitWidget = page.locator('.oxd-sheet.orangehrm-dashboard-widget').filter({ hasText: 'Employee Distribution by Sub Unit' });
        this.myActionsWidget = page.locator('.oxd-sheet.orangehrm-dashboard-widget').filter({ hasText: 'My Actions' });
        this.assignLeaveButton = page.locator('button[title="Assign Leave"]').or(page.locator('.orangehrm-quick-launch-card').filter({ hasText: 'Assign Leave' })).first();
        this.myLeaveButton = page.locator('button[title="My Leave"]').or(page.locator('.orangehrm-quick-launch-card').filter({ hasText: 'My Leave' })).first();
    }

    /**
     Confirms the dashboard has loaded by reading its header text.
     */
    async getDashBoardHeaderText(): Promise<string> {
        return await this.getText(this.DashBoardheader);
    }

    /**
     * Clicks a specific item in the Quick Launch widget
     */
    async clickQuickLaunch(itemName: string): Promise<void> {
        const itemLocator = this.page.locator(`button[title="${itemName}"]`).or(
            this.page.locator('.orangehrm-quick-launch-card').filter({ hasText: itemName })
        ).first();
        await this.waitForElement(itemLocator);
        await this.click(itemLocator);
    }

    /**
     * Slowly and smoothly scrolls down to the bottom of the dashboard
     */
    async scrollToBottom(): Promise<void> {
        await this.page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                const totalHeight = document.body.scrollHeight;
                let currentPosition = window.scrollY;
                const step = 80;
                const interval = setInterval(() => {
                    window.scrollBy({ top: step, behavior: 'smooth' });
                    currentPosition += step;
                    if (currentPosition >= totalHeight || (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 20) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 60);
            });
        });
        await this.page.waitForTimeout(500);
    }

    /**
     * Slowly and smoothly scrolls up to the top of the dashboard
     */
    async scrollToTop(): Promise<void> {
        await this.page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                const step = 60;
                const interval = setInterval(() => {
                    if (window.scrollY <= 10) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        clearInterval(interval);
                        resolve();
                    } else {
                        window.scrollBy({ top: -step, behavior: 'smooth' });
                    }
                }, 60);
            });
        });
        await this.DashBoardheader.scrollIntoViewIfNeeded().catch(() => {});
        await this.page.waitForTimeout(500);
    }

    /**
     * Smoothly scrolls to a specific widget on the Dashboard
     */
    async scrollToWidget(widgetName: string): Promise<void> {
        const widgetLocator = this.page.locator('.oxd-sheet.orangehrm-dashboard-widget').filter({ hasText: widgetName }).first();
        await this.waitForElement(widgetLocator);
        await widgetLocator.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
    }

    /**
     * Clicks a specific widget on the Dashboard with automatic scrolling
     */
    async clickWidget(widgetName: string): Promise<void> {
        await this.scrollToWidget(widgetName);
        const widgetLocator = this.page.locator('.oxd-sheet.orangehrm-dashboard-widget').filter({ hasText: widgetName }).first();
        await this.click(widgetLocator);
    }


    /**
     * Reloads/refreshes the dashboard page and waits for it to render
     */
    async refreshDashboard(): Promise<void> {
        await this.page.reload();
        await this.waitForElement(this.DashBoardheader);
    }

    async logout(): Promise<void> {
        await this.waitForElement(this.userDropdown);
        await this.click(this.userDropdown);
        await this.waitForElement(this.logoutButton);
        await this.click(this.logoutButton);

        // Wait until application redirects to login page
        await this.page.waitForURL('**/auth/login', {
            timeout: 15000
        });
    }
}

