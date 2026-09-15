import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { TopNavComponent } from '../components/TopNavComponent';
import { healLocator } from '../utils/Locator-healing-utility';

/**
 * AdminPage — models the Admin > User Management screen and Edit User workflow.
 * Implements resilient fallback locators and auto-healing candidates for:
 * 1. Admin Menu navigation link
 * 2. Username search input
 * 3. User Role dropdown
 * 4. Status dropdown
 * 5. Search button
 * 6. Edit User Status dropdown & Save button
 */
export class AdminPage extends BasePage {
    // Search Form Controls
    readonly usernameInput: Locator;
    readonly userRoleDropdown: Locator;
    readonly statusDropdown: Locator;
    readonly searchButton: Locator;
    readonly resetButton: Locator;
    readonly adminMenuLink: Locator;

    // Edit User Form Controls
    readonly editUserStatusDropdown: Locator;
    readonly saveButton: Locator;
    readonly topNav: TopNavComponent;

    constructor(page: Page) {
        super(page);

        // Admin Navigation Link with resilient .or() fallback chain
        this.adminMenuLink = page.getByRole('link', { name: 'Admin', exact: true })
            .or(page.getByRole('link', { name: 'Admin' }))
            .or(page.getByRole('link', { name: /Admin/i }))
            .or(page.getByText('Admin', { exact: true }))
            .or(page.locator('a:has-text("Admin")'))
            .or(page.locator("a[href*='viewAdminModule']"))
            .or(page.locator('.oxd-main-menu-item').filter({ hasText: 'Admin' }))
            .or(page.locator('a.oxd-main-menu-item').filter({ hasText: 'Admin' }))
            .first();

        // System Users Search Form Controls with resilient .or() chains
        this.usernameInput = page.locator('.oxd-input-group').filter({ has: page.getByText('Username', { exact: true }) }).locator('.oxd-input')
            .or(page.locator('.oxd-input-group').filter({ hasText: 'Username' }).locator('input'))
            .or(page.locator('div.oxd-input-group:has-text("Username") input'))
            .or(page.getByRole('textbox').first())
            .or(page.locator('.oxd-form input.oxd-input').first())
            .first();

        this.userRoleDropdown = page.locator('.oxd-input-group').filter({ has: page.getByText('User Role', { exact: true }) }).locator('.oxd-select-text')
            .or(page.locator('.oxd-input-group').filter({ hasText: 'User Role' }).locator('.oxd-select-text'))
            .or(page.locator('.oxd-select-wrapper').first())
            .first();

        this.statusDropdown = page.locator('.oxd-input-group').filter({ has: page.getByText('Status', { exact: true }) }).locator('.oxd-select-text')
            .or(page.locator('.oxd-input-group').filter({ hasText: 'Status' }).locator('.oxd-select-text'))
            .or(page.locator('.oxd-select-wrapper').nth(1))
            .first();

        this.searchButton = page.getByRole('button', { name: 'Search' })
            .or(page.getByRole('button', { name: /Search/i }))
            .or(page.getByText('Search', { exact: true }))
            .or(page.locator('button:has-text("Search")'))
            .or(page.locator('button[type="submit"]'))
            .or(page.locator('button.oxd-button--secondary'))
            .first();

        this.resetButton = page.getByRole('button', { name: 'Reset' })
            .or(page.getByRole('button', { name: /Reset/i }))
            .or(page.locator('button:has-text("Reset")'))
            .or(page.locator('button.oxd-button--ghost'))
            .first();

        // Edit User Form Controls
        this.editUserStatusDropdown = page.locator('.oxd-input-group').filter({ has: page.getByText('Status', { exact: true }) }).locator('.oxd-select-text')
            .or(page.locator('.oxd-input-group').filter({ hasText: 'Status' }).locator('.oxd-select-text'))
            .or(page.locator('.oxd-select-wrapper').first())
            .first();

        this.saveButton = page.getByRole('button', { name: 'Save' })
            .or(page.getByRole('button', { name: /Save/i }))
            .or(page.getByText('Save', { exact: true }))
            .or(page.locator('button[type="submit"]'))
            .or(page.locator('button:has-text("Save")'))
            .first();

        this.topNav = new TopNavComponent(page);
    }

    // ==========================================
    // Auto-Healing Candidate Getters
    // ==========================================

    get adminMenuCandidates(): Array<() => Locator> {
        return [
            () => this.adminMenuLink,
            () => this.page.getByRole('link', { name: 'Admin', exact: true }),
            () => this.page.getByRole('link', { name: 'Admin' }),
            () => this.page.getByRole('link', { name: /Admin/i }),
            () => this.page.getByText('Admin', { exact: true }),
            () => this.page.locator('a:has-text("Admin")'),
            () => this.page.locator("a[href*='viewAdminModule']"),
            () => this.page.locator('.oxd-main-menu-item').filter({ hasText: 'Admin' }),
            () => this.page.locator('a.oxd-main-menu-item.active'),
            () => this.page.locator('a.oxd-main-menu-item.active:visible'),
        ];
    }

    get usernameCandidates(): Array<() => Locator> {
        return [
            () => this.usernameInput,
            () => this.page.locator('.oxd-input-group').filter({ has: this.page.getByText('Username', { exact: true }) }).locator('.oxd-input'),
            () => this.page.locator('.oxd-input-group').filter({ hasText: 'Username' }).locator('input'),
            () => this.page.locator('div.oxd-input-group:has-text("Username") input'),
            () => this.page.getByRole('textbox').first(),
            () => this.page.locator('.oxd-form input.oxd-input').first(),
            () => this.page.locator("div[class='oxd-input-group oxd-input-field-bottom-space'] div input[class='oxd-input oxd-input--active']").first(),
        ];
    }

    get searchButtonCandidates(): Array<() => Locator> {
        return [
            () => this.searchButton,
            () => this.page.getByRole('button', { name: 'Search' }),
            () => this.page.getByRole('button', { name: /Search/i }),
            () => this.page.getByText('Search', { exact: true }),
            () => this.page.locator('button:has-text("Search")'),
            () => this.page.locator('button[type="submit"]'),
            () => this.page.locator('button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space'),
            () => this.page.locator("//button[normalize-space()='Search']"),
        ];
    }

    get userRoleCandidates(): Array<() => Locator> {
        return [
            () => this.userRoleDropdown,
            () => this.page.locator('.oxd-input-group').filter({ has: this.page.getByText('User Role', { exact: true }) }).locator('.oxd-select-text'),
            () => this.page.locator('.oxd-input-group').filter({ hasText: 'User Role' }).locator('.oxd-select-text'),
            () => this.page.locator('.oxd-select-wrapper').first(),
        ];
    }

    get editUserStatusCandidates(): Array<() => Locator> {
        return [
            () => this.editUserStatusDropdown,
            () => this.page.locator('.oxd-input-group').filter({ has: this.page.getByText('Status', { exact: true }) }).locator('.oxd-select-text'),
            () => this.page.locator('.oxd-input-group').filter({ hasText: 'Status' }).locator('.oxd-select-text'),
            () => this.page.locator('.oxd-select-wrapper').first(),
        ];
    }

    get saveButtonCandidates(): Array<() => Locator> {
        return [
            () => this.saveButton,
            () => this.page.getByRole('button', { name: 'Save' }),
            () => this.page.getByRole('button', { name: /Save/i }),
            () => this.page.getByText('Save', { exact: true }),
            () => this.page.locator('button[type="submit"]'),
            () => this.page.locator('button:has-text("Save")'),
        ];
    }

    // ==========================================
    // Page Actions with Auto-Healing
    // ==========================================

    async clickAdminMenu(): Promise<void> {
        try {
            const adminLink = await healLocator(this.adminMenuCandidates);
            await this.click(adminLink);
        } catch {
            await this.topNav.goTo('Admin');
        }
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
     * Fills the Username search field and clicks Search with auto-healing
     */
    async searchByUsername(username: string): Promise<void> {
        const userInput = await healLocator(this.usernameCandidates);
        await this.waitForElement(userInput);
        await userInput.fill('');
        await userInput.fill(username);

        const searchBtn = await healLocator(this.searchButtonCandidates);
        await this.waitForElement(searchBtn);
        await this.click(searchBtn);
    }

    /**
     * Clears the Username search input field with auto-healing
     */
    async clearUsername(): Promise<void> {
        const userInput = await healLocator(this.usernameCandidates);
        await this.waitForElement(userInput);
        await userInput.fill('');
    }

    /**
     * Selects a User Role from the dropdown and clicks Search with auto-healing
     */
    async searchByUserRole(userRole: string): Promise<void> {
        const roleDropdown = await healLocator(this.userRoleCandidates);
        await this.selectDropdownOption(roleDropdown, userRole);

        const searchBtn = await healLocator(this.searchButtonCandidates);
        await this.waitForElement(searchBtn);
        await this.click(searchBtn);
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
     * In the Edit User form, changes Status to the specified value and clicks Save with auto-healing
     */
    async updateUserStatus(status: string): Promise<void> {
        const statusDropdown = await healLocator(this.editUserStatusCandidates);
        await this.selectDropdownOption(statusDropdown, status);

        const saveBtn = await healLocator(this.saveButtonCandidates);
        await this.waitForElement(saveBtn);
        await this.click(saveBtn);
        await this.page.waitForURL(/.*admin\/viewSystemUsers.*/);
    }

    /**
     * Scrolls to a user record and opens its edit form
     */
    async openEditForUser(username: string): Promise<void> {
        await this.clickEditUser(username);
    }
}