import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
/**
 * AddEmployee — models the "Add Employee" form under PIM.
 * Driven by CSV data (see src/data/employee.csv + tests/ui/pim.spec.ts)
 * so the same class handles every row without duplicating test logic.
 */
export class AddEmployee extends BasePage {
    readonly addButton: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly employeeId: Locator;
    readonly createLoginDetails: Locator;
    readonly status: Locator;
    readonly username: Locator;
    readonly password: Locator;
    readonly confirmPassword: Locator;
    readonly SaveButton: Locator;

    constructor(page: Page) {
        super(page);
        this.addButton = page.getByRole('button', { name: 'Add' }).first();
        this.firstName = page.locator('input[placeholder="First Name"]').first();
        this.lastName = page.locator('input[placeholder="Last Name"]').first();
        this.employeeId = page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input').first();
        this.createLoginDetails = page.locator('.oxd-switch-input').first();
        this.status = page.getByRole('radio', { name: 'Enabled' }).first();
        this.username = page.locator('div.oxd-input-group:has-text("Username") input').first();
        this.password = page.locator('input[type="password"]').nth(0);
        this.confirmPassword = page.locator('input[type="password"]').nth(1);
        this.SaveButton = page.getByRole('button', { name: 'Save' }).first();
    }

    /**
     * Full "add a new employee" flow: opens the Add form, fills the
     * name fields, and saves. A successful save redirects to that
     * employee's Personal Details page (asserted in the test, not here).
     *
     * Note: this method previously included a `waitForLoadState('networkidle')`
     * call after Save, which was removed — it caused unreliable CI timeouts
     * on this server (see README's CI section). BasePage.click()'s
     * toBeEnabled() check is a more precise, reliable wait than networkidle.
     */

    async AddEmployeeDetails(
        firstname: string,
        lastname: string,
        username: string,
        password: string,
        confirmPassword: string
    ): Promise<void> {

        await this.waitForElement(this.addButton);
        await this.click(this.addButton);

        await this.waitForElement(this.firstName);
        await this.fill(this.firstName, firstname);

        await this.waitForElement(this.lastName);
        await this.fill(this.lastName, lastname);

        await this.waitForElement(this.createLoginDetails);
        await this.click(this.createLoginDetails);

        await this.waitForElement(this.username);
        await this.fill(this.username, username);

        // Password
        await this.password.waitFor({ state: 'visible' });
        await this.password.fill(password);

        // Confirm Password
        await this.confirmPassword.waitFor({ state: 'visible' });
        await this.confirmPassword.fill(confirmPassword);
       
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
     * Adds an employee with optional custom Employee ID (without creating login details on this screen).
     */
    async addNewEmployee(
        firstname: string,
        lastname: string,
        employeeId?: string
    ): Promise<void> {
        await this.waitForElement(this.addButton);
        await this.click(this.addButton);

        await this.waitForElement(this.firstName);
        await this.fill(this.firstName, firstname);

        await this.waitForElement(this.lastName);
        await this.fill(this.lastName, lastname);

        if (employeeId) {
            await this.waitForElement(this.employeeId);
            const autoSuggestedId = await this.employeeId.inputValue();
            console.log(`Auto-suggested Employee ID was: ${autoSuggestedId}, overriding with: ${employeeId}`);
            await this.employeeId.click();
            await this.employeeId.fill('');
            await this.employeeId.fill(employeeId);
        }

        await this.waitForElement(this.SaveButton);
        await this.click(this.SaveButton);

        await this.page.getByText('Successfully Saved').waitFor({
            state: 'visible'
        });
        console.log(`Employee ${firstname} ${lastname} added successfully`);
    }
}