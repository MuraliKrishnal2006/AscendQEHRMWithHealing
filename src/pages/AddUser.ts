import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { AutocompleteComponent } from '../components/AutocompleteComponent';
import { SelectDropdownComponent } from '../components/SelectDropdownComponent';
import { AdminMenuComponent } from '../components/adminmenu';
/**
 * AddUser — models the "Add User" form under Admin.
 * Driven by CSV data (see src/data/AddUser.csv + tests/ui/AddUsers.spec.ts)
 * so the same class handles every row without duplicating test logic.
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

    async clickAdmin(): Promise<void> {

        console.log('Clicking Admin...');

        await this.adminMenu.clickAdmin();

        console.log('Admin clicked');
    }



    /**
     * Full "add a new user" flow: opens the Add form, fills the
     * name fields, and saves. A successful save redirects to that
     * user's Personal Details page (asserted in the test, not here).
     *
     * Note: this method previously included a `waitForLoadState('networkidle')`
     * call after Save, which was removed — it caused unreliable CI timeouts
     * on this server (see README's CI section). BasePage.click()'s
     * toBeEnabled() check is a more precise, reliable wait than networkidle.
     */

    async AddUserDetails(
        UserRole: string,
        EmployeeName: string,
        Status: string,
        Username: string,
        Password: string,
        ConfirmPassword: string
    ): Promise<void> {

        await this.waitForElement(this.addButton);
        await this.click(this.addButton);

        // User Role - dropdown
        await this.userRoleDropdown.selectByText(UserRole);

        // Employee Name - autocomplete
        //await this.employeeNameAutocomplete.selectExact(EmployeeName);
        await this.employeeNameAutocomplete.selectExact(EmployeeName, undefined,
            { useKeystrokes: true });

        // Status - dropdown
        await this.statusDropdown.selectByText(Status);
        
        // Username
        await this.Username.fill(Username);
        // Password
        await this.Password.fill(Password);

        // Confirm Password
        await this.ConfirmPassword.fill(ConfirmPassword);

        await this.waitForElement(this.SaveButton);

        console.log('Save button is available');

        await this.click(this.SaveButton);

        console.log('Save button clicked');

        await this.page.getByText('Successfully Saved').waitFor({
            state: 'visible'
        });

        console.log('Successfully Saved message displayed');

        //await this.page.waitForTimeout(4000);

    }

    /**
     * Searches the System Users list by username on the Admin page.
     */
    async searchUser(username: string): Promise<void> {
        await this.clickAdmin();
        const usernameSearchInput = this.page.locator('.oxd-input-group').filter({ hasText: 'Username' }).locator('input').first();
        const searchBtn = this.page.getByRole('button', { name: 'Search' });
        await this.waitForElement(usernameSearchInput);
        await this.fill(usernameSearchInput, username);
        await this.click(searchBtn);
    }
}
