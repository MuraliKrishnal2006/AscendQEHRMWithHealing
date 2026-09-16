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
         // ================= Candidate Locator Pools =================

    get dashboardHeader(): Array<() => Locator> {
        return [
            () => this.page.getByRole('heading', { name: 'Dashboard' }),
            () => this.page.getByRole('heading', { name: /Dashboard/i }),
            () => this.page.getByRole('heading'),
            () => this.page.locator('h6:has-text("Dashboard")'),
            () => this.page.locator('h6.oxd-text.oxd-text--h6.oxd-topbar-header-breadcrumb-module'),
            () => this.page.locator('h6.oxd-text.oxd-text--h6.oxd-topbar-header-breadcrumb-module:visible')
        ];
    }

    get quickLaunchWidgetCandidates(): Array<() => Locator> {
        return [
            () => this.quickLaunchWidget,
            () => this.page.locator('div.oxd-sheet.oxd-sheet--rounded.oxd-sheet--white.orangehrm-dashboard-widget').filter({ hasText: 'Quick Launch' }),
            () => this.page.locator('.oxd-sheet.orangehrm-dashboard-widget:has-text("Quick Launch")'),
            () => this.page.locator('div.oxd-sheet.orangehrm-dashboard-widget:has-text("Quick Launch")'),
            () => this.page.getByText('Quick Launch', { exact: true }),
            () => this.page.getByText('Quick Launch')
        ];
    }

    get employeeDistributionSubUnitWidgetCandidates(): Array<() => Locator> {
        return [
            () => this.employeeDistributionSubUnitWidget,
            () => this.page.locator('div').filter({ hasText: 'Employee Distribution by Sub Unit' }).first(),
            () => this.page.locator('div:has-text("Employee Distribution by Sub Unit")'),
            () => this.page.locator('div').filter({ hasText: 'Employee Distribution by Sub Unit' }),
            () => this.page.locator('.orangehrm-dashboard-widget-header'),
            () => this.page.locator('.oxd-sheet.orangehrm-dashboard-widget').filter({ hasText: 'Employee Distribution by Sub Unit' })
        ];
    }

    get assignLeaveButtonCandidates(): Array<() => Locator> {
        return [
            () => this.assignLeaveButton,
            () => this.page.locator("//button[@title='Assign Leave']"),
            () => this.page.locator("button[title='Assign Leave']"),
            () => this.page.getByTitle('Assign Leave'),
            () => this.page.getByTitle('Assign Leave', { exact: true }),
            () => this.page.locator('button.oxd-icon-button.orangehrm-quick-launch-icon'),
            () => this.page.locator('button.oxd-icon-button.orangehrm-quick-launch-icon:visible')
        ];
    }

    get myLeaveButtonCandidates(): Array<() => Locator> {
        return [
            () => this.myLeaveButton,
            () => this.page.locator("//button[@title='My Leave']"),
            () => this.page.locator("button[title='My Leave']"),
            () => this.page.getByTitle('My Leave'),
            () => this.page.getByTitle('My Leave', { exact: true }),
            () => this.page.locator('button.oxd-icon-button.orangehrm-quick-launch-icon'),
            () => this.page.locator('button.oxd-icon-button.orangehrm-quick-launch-icon:visible')
        ];
    }

    get userDropdownCandidates(): Array<() => Locator> {
        return [
            () => this.page.locator('i.oxd-icon.bi-caret-down-fill.oxd-userdropdown-icon'),
            () => this.page.locator('i.oxd-icon.bi-caret-down-fill.oxd-userdropdown-icon:visible'),
            () => this.page.locator("//i[@class='oxd-icon bi-caret-down-fill oxd-userdropdown-icon']"),
            () => this.page.locator(".oxd-icon.bi-caret-down-fill.oxd-userdropdown-icon"),
            () => this.page.locator('i:visible')
        ];
    }

    get logoutButtonCandidates(): Array<() => Locator> {
        return [
            () => this.logoutButton,
            () => this.page.getByRole('menuitem', { name: 'Logout' }),
            () => this.page.getByRole('menuitem', { name: /Logout/i }),
            () => this.page.getByText('Logout', { exact: true }),
            () => this.page.getByText('Logout'),
            () => this.page.locator('a:has-text("Logout")'),
            () => this.page.locator(':text-is("Logout")'),
            () => this.page.locator(':text("Logout")'),
            () => this.page.locator('a').filter({ hasText: 'Logout' })
        ];
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

