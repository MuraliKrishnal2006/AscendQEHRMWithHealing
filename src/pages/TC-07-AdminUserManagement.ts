import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { TopNavComponent } from '../components/TopNavComponent';

/**
 * AdminPage — models the Admin > User Management screen and Edit User workflow.
 * Uses Playwright's prioritized locator strategy:
 *  1. getByRole, getByText, getByLabel, etc.
 *  2. CSS selectors where custom components lack semantic ARIA roles.
 */
export class AdminPage extends BasePage {
    // Search Form Controls
    readonly usernameInput: Locator;
    readonly userRoleDropdown: Locator;
    readonly statusDropdown: Locator;
    readonly searchButton: Locator;
    readonly resetButton: Locator;

    // Edit User Form Controls
    readonly editUserStatusDropdown: Locator;
    readonly saveButton: Locator;
    readonly topNav: TopNavComponent;

    constructor(page: Page) {
        super(page);

        // System Users Search Form (getByText / getByRole / CSS scoped)
        this.usernameInput = page.locator('.oxd-input-group').filter({ has: page.getByText('Username', { exact: true }) }).locator('.oxd-input');
        this.userRoleDropdown = page.locator('.oxd-input-group').filter({ has: page.getByText('User Role', { exact: true }) }).locator('.oxd-select-text');
        this.statusDropdown = page.locator('.oxd-input-group').filter({ has: page.getByText('Status', { exact: true }) }).locator('.oxd-select-text');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });

        // Edit User Form
        this.editUserStatusDropdown = page.locator('.oxd-input-group').filter({ has: page.getByText('Status', { exact: true }) }).locator('.oxd-select-text');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.topNav = new TopNavComponent(page);
    }

    async clickAdminMenu(): Promise<void> {
        await this.topNav.goTo('Admin');
    }

    /**
     * Helper to select an option from an OrangeHRM/AscendqeHRM custom dropdown
     * Priority: getByRole('option') -> getByText -> CSS fallback
     */
    async selectDropdownOption(dropdown: Locator, optionText: string): Promise<void> {
        await this.waitForElement(dropdown);
        await this.click(dropdown);

        const option = this.page.getByRole('option', { name: optionText, exact: false }).or(
            this.page.getByRole('listbox').getByText(optionText, { exact: false })
        ).or(
            this.page.locator('.oxd-select-dropdown').getByText(optionText, { exact: false })
        ).first();

        await this.waitForElement(option);
        await option.click();
    }

    /**
     * Fills the Username search field and clicks Search
     */
    async searchByUsername(username: string): Promise<void> {
        await this.waitForElement(this.usernameInput);
        await this.usernameInput.fill('');
        await this.usernameInput.fill(username);
        await this.waitForElement(this.searchButton);
        await this.click(this.searchButton);
    }

    /**
     * Clears the Username search input field
     */
    async clearUsername(): Promise<void> {
        await this.waitForElement(this.usernameInput);
        await this.usernameInput.fill('');
    }

    /**
     * Selects a User Role from the dropdown and clicks Search
     */
    async searchByUserRole(userRole: string): Promise<void> {
        await this.selectDropdownOption(this.userRoleDropdown, userRole);
        await this.waitForElement(this.searchButton);
        await this.click(this.searchButton);
    }

    /**
     * Finds the row matching `username` in the search results table (handling pagination if needed), scrolls to it, and clicks Edit
     */
    async clickEditUser(username: string): Promise<void> {
        let userRow = this.page.locator('.oxd-table-card').filter({ hasText: username }).first();

        // If not visible on current page, navigate through pagination
        for (let attempt = 0; attempt < 5; attempt++) {
            if (await userRow.isVisible()) {
                break;
            }
            const nextButton = this.page.locator('.oxd-pagination-page-item--previous-next').last();
            if (await nextButton.isVisible() && await nextButton.isEnabled()) {
                await nextButton.click();
                await this.page.waitForLoadState('networkidle').catch(() => { });
                userRow = this.page.locator('.oxd-table-card').filter({ hasText: username }).first();
            } else {
                break;
            }
        }

        await this.waitForElement(userRow);
        await userRow.scrollIntoViewIfNeeded();

        const editButton = userRow.locator('button:has(.bi-pencil-fill), .bi-pencil-fill').first();

        await this.waitForElement(editButton);
        await editButton.click();
    }

    /**
     * In the Edit User form, changes Status to the specified value and clicks Save
     */
    async updateUserStatus(status: string): Promise<void> {
        await this.selectDropdownOption(this.editUserStatusDropdown, status);
        await this.waitForElement(this.saveButton);
        await this.click(this.saveButton);
        await this.page.waitForURL(/.*admin\/viewSystemUsers.*/);
    }

    /**
     * Scrolls to a user record and opens its edit form
     */
    async openEditForUser(username: string): Promise<void> {
        await this.clickEditUser(username);
    }
}
