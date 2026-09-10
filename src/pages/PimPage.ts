import {Page,Locator} from '@playwright/test';
import {BasePage} from './BasePage';
import {AutocompleteComponent} from '../components/AutocompleteComponent';
import {SelectDropdownComponent} from '../components/SelectDropdownComponent';
import {AdminMenuComponent} from '../components/adminmenu';

 
/**
 * PimPage — models the PIM module's employee search screen
 * (/pim/viewEmployeeList). Handles the multi-step search flow:
 * typing a partial name, picking the right match from an autocomplete
 * dropdown, filling employee ID, and selecting employment status
 * from a second dropdown — all before submitting the search.
 */

export class PimPage extends BasePage{
    readonly employeeName : Locator;
    readonly employeeNameDropdown : Locator;
    readonly employeeId : Locator;
    readonly employeeStatus : Locator;
    readonly employeeStatusDropdown : Locator;
    readonly searchButton : Locator;
    readonly resetButton : Locator;
    readonly employeeListTab : Locator;
    readonly tableRows : Locator;

    readonly employeeNameAutocomplete : AutocompleteComponent;
    readonly employeeStatusDropdownComponent : SelectDropdownComponent;
    readonly employmentStatusDropdown : SelectDropdownComponent;
    readonly adminMenu : AdminMenuComponent;

    constructor(page : Page){
        super(page);
        // .first() because the placeholder text is reused elsewhere on
        // the page (e.g. supervisor search) — this targets the employee
        // name field specifically, confirmed via codegen.
        this.employeeName = page.getByPlaceholder('Type for hints...').first();
        this.employeeNameDropdown = page.locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option, .oxd-autocomplete-option, [role="option"]');
        this.employeeId = page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input').first();
        this.employeeStatus = page.locator('.oxd-input-group').filter({ hasText: 'Employment Status' }).locator('.oxd-select-text').first();
        this.employeeStatusDropdown = page.locator('.oxd-select-dropdown .oxd-select-option, .oxd-select-option, [role="option"]');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.employeeListTab = page.getByRole('link', { name: 'Employee List' });
        this.tableRows = page.locator('.oxd-table-card');

        this.employeeNameAutocomplete = new AutocompleteComponent(page, this.employeeName, this.employeeNameDropdown);
        this.employeeStatusDropdownComponent = new SelectDropdownComponent(page, this.employeeStatus);
        this.employmentStatusDropdown = new SelectDropdownComponent(page, this.employeeStatus, page.locator('.oxd-select-dropdown'));
        this.adminMenu = new AdminMenuComponent(page);
    }
     //Opens the PIM module from the sidebar.
    async clickPimMenu() : Promise<void> {
        await this.adminMenu.clickPim();
    }
     /**
     * Runs a full employee search using a partial name match.
     * The autocomplete dropdown returns multiple matches for a partial
     * name, so this delegates to AutocompleteComponent.selectExact
     * (with keystroke events, since fill() skips the events OrangeHRM's
     * autocomplete listens for) and to SelectDropdownComponent for the
     * employment-status dropdown.
     */
    async employeesearchPartial(empname : string,employee :string,employeeId :string,employeeStatus :string) : Promise<void> {
        await this.employeeNameAutocomplete.selectExact(empname, employee, { useKeystrokes: true });

        await this.waitForElement(this.employeeId);
        await this.fill(this.employeeId,employeeId);

        await this.employeeStatusDropdownComponent.selectByLoopMatch(this.employeeStatusDropdown, employeeStatus);

        await this.waitForElement(this.searchButton);
        await this.searchButton.click();

    }

    /**
     * Searches the Employee List by Employee ID on the PIM page.
     */
    async searchByEmployeeId(empId: string): Promise<void> {
        await this.clickPimMenu();
        await this.waitForElement(this.employeeId);
        await this.fill(this.employeeId, empId);
        await this.waitForElement(this.searchButton);
        await this.click(this.searchButton);
    }

    /**
     * Searches by Employee Name using Autocomplete.
     */
    async searchByEmployeeName(name: string): Promise<void> {
        await this.employeeNameAutocomplete.selectExact(name);
        await this.waitForElement(this.searchButton);
        await this.click(this.searchButton);
        await this.page.waitForTimeout(2000);
    }

    /**
     * Clears the Employee Name search field.
     */
    async clearEmployeeName(): Promise<void> {
        await this.waitForElement(this.employeeName);
        await this.employeeName.click();
        await this.employeeName.press('Control+A');
        await this.employeeName.press('Backspace');
    }

    /**
     * Selects an employment status from the dropdown and clicks Search.
     */
    async searchByEmploymentStatus(status?: string): Promise<void> {
        await this.waitForElement(this.employeeStatus);
        await this.click(this.employeeStatus);
        const options = this.page.locator('.oxd-select-dropdown [role="option"], .oxd-select-dropdown div, .oxd-select-option');
        await options.first().waitFor({ state: 'visible', timeout: 5000 });

        if (status) {
            const match = options.filter({ hasText: status }).first();
            if (await match.isVisible().catch(() => false)) {
                await match.click();
            } else {
                // Pick first available status option after '-- Select --'
                await options.nth(1).click();
            }
        } else {
            await options.nth(1).click();
        }

        await this.waitForElement(this.searchButton);
        await this.click(this.searchButton);
        await this.page.waitForTimeout(2000);
    }

    /**
     * Clicks on the first matching result row in the employee table.
     */
    async clickFirstResultRow(): Promise<void> {
        await this.page.waitForTimeout(1000);
        const count = await this.tableRows.count();
        if (count > 0) {
            const cell = this.tableRows.first().locator('.oxd-table-cell').nth(2);
            if (await cell.isVisible().catch(() => false)) {
                await cell.click();
            } else {
                await this.tableRows.first().click();
            }
            await this.page.waitForTimeout(2000);
            console.log('Clicked matching result row to view details');
        } else {
            console.log('No matching rows found to click');
        }
    }

    /**
     * Returns to the Employee List and clicks Reset.
     */
    async resetSearch(): Promise<void> {
        await this.clickPimMenu();
        await this.waitForElement(this.resetButton);
        await this.click(this.resetButton);
        await this.page.waitForTimeout(1000);
    }
}
