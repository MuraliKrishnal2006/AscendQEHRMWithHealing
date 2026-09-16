import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { AutocompleteComponent } from '../components/AutocompleteComponent';
import { SelectDropdownComponent } from '../components/SelectDropdownComponent';
import { AdminMenuComponent } from '../components/adminmenu';
import { healLocator } from '../utils/Locator-healing-utility';

/**
 * AddUser — models the "Add User" form under Admin.
 * Driven by CSV data (see src/data/AddUser.csv + tests/ui/AddUsers.spec.ts)
 * so the same class handles every row without duplicating test logic.
 *
 * Implements auto-healing candidates for form fields, credentials, and buttons.
 */
export class AddUser extends BasePage {
    readonly addButton: Locator;
    readonly UserRole: Locator;
    readonly EmployeeName: Locator;
    readonly Status: Locator;
    readonly Username: Locator;
    readonly Password: Locator;
    readonly ConfirmPassword: Locator;
    readonly SaveButton: Locator;

    // Aliases to support camelCase access
    get username(): Locator { return this.Username; }
    get password(): Locator { return this.Password; }
    get confirmPassword(): Locator { return this.ConfirmPassword; }

    readonly userRoleDropdown: SelectDropdownComponent;
    readonly statusDropdown: SelectDropdownComponent;
    readonly employeeNameAutocomplete: AutocompleteComponent;
    readonly adminMenu: AdminMenuComponent;

    constructor(page: Page) {
        super(page);
        this.addButton = page.getByRole('button', { name: 'Add' }).first();

        this.UserRole = page.locator('.oxd-select-text').first();
        this.EmployeeName = page.locator('input[placeholder="Type for hints..."]').first();
        this.Status = page.locator('.oxd-select-text').nth(1);
        this.Username = page.locator('div.oxd-input-group:has-text("Username") input').first();
        this.Password = page.locator('input[type="password"]').nth(0);
        this.ConfirmPassword = page.locator('input[type="password"]').nth(1);
        this.SaveButton = page.getByRole('button', { name: 'Save' }).first();

        this.userRoleDropdown = new SelectDropdownComponent(page, this.UserRole, page.locator('.oxd-select-dropdown'));
        this.statusDropdown = new SelectDropdownComponent(page, this.Status, page.locator('.oxd-select-dropdown'));
        this.employeeNameAutocomplete = new AutocompleteComponent(page, this.EmployeeName, page.locator('.oxd-autocomplete-option'));
        this.adminMenu = new AdminMenuComponent(page);
    }

    // ==========================================
    // Auto-Healing Candidate Getters
    // ==========================================

    get addButtonCandidates(): Array<() => Locator> {
        return [
            () => this.addButton,
            () => this.page.getByRole('button', { name: 'Add' }),
            () => this.page.getByRole('button', { name: /Add/i }),
            () => this.page.getByText('Add', { exact: true }),
            () => this.page.locator('button:has-text("Add")'),
            () => this.page.locator('button.oxd-button--secondary').filter({ hasText: 'Add' }),
        ];
    }

    get usernameCandidates(): Array<() => Locator> {
        return [
            () => this.Username,
            () => this.page.locator("//body/div[@id='app']/div[@class='oxd-layout']/div[@class='oxd-layout-container']/div[@class='oxd-layout-context']/div[@class='orangehrm-background-container']/div[@class='orangehrm-card-container']/form[@class='oxd-form']/div[@class='orangehrm-employee-container']/div[@class='orangehrm-employee-form']/div[@class='oxd-form-row']/div[1]/div[1]/div[1]/div[2]/input[1]"),
            () => this.page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)"),
            () => this.page.locator('div.oxd-input-group:has-text("Username") input').first(),
            () => this.page.locator('.oxd-input-group').filter({ hasText: 'Username' }).locator('input').first(),
            () => this.page.getByRole('textbox'),
            () => this.page.locator('input.oxd-input.oxd-input--active'),
            () => this.page.locator('input.oxd-input.oxd-input--active:visible'),
            () => this.page.locator('input:visible')
        ];
    }

    get passwordCandidates(): Array<() => Locator> {
        return [
            () => this.Password,
            () => this.page.locator("//div[@class='oxd-grid-item oxd-grid-item--gutters user-password-cell']//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@type='password']"),
            () => this.page.locator("div[class='oxd-grid-item oxd-grid-item--gutters user-password-cell'] div[class='oxd-input-group oxd-input-field-bottom-space'] div input[type='password']"),
            () => this.page.locator('input[type="password"]').first(),
            () => this.page.locator('input.oxd-input.oxd-input--active'),
            () => this.page.locator('input.oxd-input.oxd-input--active:visible')
        ];
    }

    get confirmPasswordCandidates(): Array<() => Locator> {
        return [
            () => this.ConfirmPassword,
            () => this.page.locator("//div[@class='oxd-grid-item oxd-grid-item--gutters']//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@type='password']"),
            () => this.page.locator("div[class='oxd-grid-item oxd-grid-item--gutters'] div[class='oxd-input-group oxd-input-field-bottom-space'] div input[type='password']"),
            () => this.page.locator('input[type="password"]').nth(1),
            () => this.page.locator('input.oxd-input.oxd-input--active'),
            () => this.page.locator('input.oxd-input.oxd-input--active:visible')
        ];
    }

    get saveButtonCandidates(): Array<() => Locator> {
        return [
            () => this.SaveButton,
            () => this.page.getByText('Save', { exact: true }),
            () => this.page.locator('button:has-text("Save")'),
            () => this.page.locator(':text-is("Save")'),
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space:visible'),
            () => this.page.locator('button').filter({ hasText: 'Save' }),
            () => this.page.locator('button').filter({ hasText: 'Save' }).first(),
            () => this.page.locator('div.oxd-form-actions').locator('button').nth(1)
        ];
    }

    async clickAdmin(): Promise<void> {
        console.log('Clicking Admin...');
        await this.adminMenu.clickAdmin();
        console.log('Admin clicked');
    }

    /**
     * Full "add a new user" flow using auto-healing candidates:
     * opens the Add form, fills the fields, and saves.
     */
    async AddUserDetails(
        UserRole: string,
        EmployeeName: string,
        Status: string,
        Username: string,
        Password: string,
        ConfirmPassword: string
    ): Promise<void> {
        const addBtn = await healLocator(this.addButtonCandidates);
        await this.waitForElement(addBtn);
        await this.click(addBtn);

        // User Role - dropdown
        await this.userRoleDropdown.selectByText(UserRole);

        // Employee Name - autocomplete
        await this.employeeNameAutocomplete.selectExact(EmployeeName, undefined, { useKeystrokes: true });

        // Status - dropdown
        await this.statusDropdown.selectByText(Status);
        
        // Username - auto-healed
        const usernameField = await healLocator(this.usernameCandidates);
        await this.fill(usernameField, Username);

        // Password - auto-healed
        const passwordField = await healLocator(this.passwordCandidates);
        await this.fill(passwordField, Password);

        // Confirm Password - auto-healed
        const confirmPasswordField = await healLocator(this.confirmPasswordCandidates);
        await this.fill(confirmPasswordField, ConfirmPassword);

        // Save Button - auto-healed
        const saveBtn = await healLocator(this.saveButtonCandidates);
        await this.waitForElement(saveBtn);
        console.log('Save button is available');
        await this.click(saveBtn);
        console.log('Save button clicked');

        // Success message - auto-healed
        const successToast = await healLocator([
            () => this.page.getByText('Successfully Saved'),
            () => this.page.getByRole('alert'),
            () => this.page.locator('.oxd-toast--success'),
            () => this.page.locator('div[class*="oxd-toast"]'),
        ]);
        await successToast.waitFor({ state: 'visible' });
        console.log('Successfully Saved message displayed');
    }

    /**
     * Searches the System Users list by username on the Admin page using auto-healing.
     */
    async searchUser(username: string): Promise<void> {
        await this.clickAdmin();
        const usernameSearchInput = await healLocator([
            () => this.page.locator('.oxd-input-group').filter({ hasText: 'Username' }).locator('input').first(),
            () => this.page.locator('div.oxd-input-group:has-text("Username") input').first(),
            () => this.page.getByRole('textbox').nth(1),
        ]);
        const searchBtn = await healLocator([
            () => this.page.getByRole('button', { name: 'Search' }),
            () => this.page.getByRole('button', { name: /Search/i }),
            () => this.page.locator('button:has-text("Search")'),
        ]);
        await this.waitForElement(usernameSearchInput);
        await this.fill(usernameSearchInput, username);
        await this.click(searchBtn);
    }
}
