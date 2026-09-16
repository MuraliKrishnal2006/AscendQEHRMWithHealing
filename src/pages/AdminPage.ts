import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

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
    }
     get usernameInputCandidates(): Array<() => Locator> {
        return [
            () => this.usernameInput,
            () => this.page.locator("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']"),
            () => this.page.locator("div[class='oxd-input-group oxd-input-field-bottom-space'] div input[class='oxd-input oxd-input--active']"),
            () => this.page.getByRole('textbox'),
            () => this.page.locator('input.oxd-input.oxd-input--active'),
            () => this.page.locator('input.oxd-input.oxd-input--active:visible'),
            () => this.page.locator('input:visible')
        ];
    }

    get userRoleDropdownCandidates(): Array<() => Locator> {
        return [
            () => this.userRoleDropdown,
            () => this.page.locator('div').filter({ hasText: '-- Select --' }).first(),
            () => this.page.locator('div').filter({ hasText: '-- Select --' }).last(),
            () => this.page.getByText('-- Select --', { exact: true }),
            () => this.page.locator('div.oxd-select-text.oxd-select-text--active'),
            () => this.page.locator('div').filter({ hasText: '-- Select --' })
        ];
    }

    get statusDropdownCandidates(): Array<() => Locator> {
        return [
            () => this.statusDropdown,
            () => this.page.locator('.oxd-input-group').filter({ has: this.page.getByText('Status', { exact: true }) }).locator('.oxd-select-text'),
            () => this.page.locator('div.oxd-select-text.oxd-select-text--active').nth(1),
            () => this.page.locator('div').filter({ hasText: '-- Select --' }).nth(1),
            () => this.page.locator('div.oxd-select-text.oxd-select-text--active:visible').nth(1)
        ];
    }

    get editUserStatusDropdownCandidates(): Array<() => Locator> {
        return [
            () => this.editUserStatusDropdown,
            () => this.page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)"),
            () => this.page.locator('div.oxd-select-text-input'),
            () => this.page.locator('div.oxd-select-text-input:visible'),
            () => this.page.locator('.oxd-select-text-input'),
            () => this.page.locator('div:has-text("Enabled")'),
            () => this.page.locator('div').filter({ hasText: 'Enabled' }),
        ];
    }

    get searchButtonCandidates(): Array<() => Locator> {
        return [
            () => this.searchButton,
            () => this.page.locator('button').filter({ hasText: 'Search' }).first(),
            () => this.page.locator('div.oxd-form-actions').locator('button').nth(1),
            () => this.page.locator("//button[normalize-space()='Search']"),
            () => this.page.locator("button[type='submit']"),
            () => this.page.locator(':has-text("Search")'),
            () => this.page.locator('button:visible')
        ];
    }

    get resetButtonCandidates(): Array<() => Locator> {
        return [
            () => this.resetButton,
            () => this.page.locator('button').filter({ hasText: 'Reset' }).first(),
            () => this.page.locator('div.oxd-form-actions').locator('button').nth(0),
            () => this.page.locator("//button[normalize-space()='Reset']"),
            () => this.page.locator(".oxd-button.oxd-button--medium.oxd-button--ghost"),
            () => this.page.locator(':has-text("Reset")'),
            () => this.page.locator('button:visible')
        ];
    }

    get saveButtonCandidates(): Array<() => Locator> {
        return [
            () => this.saveButton,
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space'),
            () => this.page.locator('button').filter({ hasText: 'Save' }),
            () => this.page.locator('div.oxd-form-actions').locator('button').nth(1),
            () => this.page.locator("//button[normalize-space()='Save']"),
            () => this.page.locator("button[type='submit']"),
            () => this.page.locator('button:visible'),
        ];
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
