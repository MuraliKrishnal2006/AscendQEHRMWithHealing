import {Page,Locator} from '@playwright/test';
import {BasePage} from './BasePage';
import {AutocompleteComponent} from '../components/AutocompleteComponent';
import {SelectDropdownComponent} from '../components/SelectDropdownComponent';
import {TopNavComponent} from '../components/TopNavComponent';

 
/**
 * PimPage — models the PIM module's employee search screen
 * (/pim/viewEmployeeList). Handles the multi-step search flow:
 * typing a partial name, picking the right match from an autocomplete
 * dropdown, filling employee ID, and selecting employment status
 * from a second dropdown — all before submitting the search.
 */

export class PimPages extends BasePage{
    readonly Pimmenu : Locator;
    readonly employeeName : Locator;
    readonly employeeNameDropdown : Locator;
    readonly employeeId : Locator;
    readonly employeeStatus : Locator;
    readonly employeeStatusDropdown : Locator;
    readonly searchButton : Locator;
    readonly jobTitleDropdown : Locator;

    readonly employeeNameAutocomplete : AutocompleteComponent;
    readonly employeeStatusDropdownComponent : SelectDropdownComponent;
    readonly topNav : TopNavComponent;

    constructor(page : Page){
        super(page);
        this.Pimmenu = page.getByRole('link',{name :'PIM'});
        // .first() because the placeholder text is reused elsewhere on
        // the page (e.g. supervisor search) — this targets the employee
        // name field specifically, confirmed via codegen.
        this.employeeName = page.getByPlaceholder('Type for hints...').first();
        this.employeeNameDropdown = page.locator('//div[@class="oxd-autocomplete-dropdown --positon-bottom"]/div');
        this.employeeId = page.locator('//div[@class="oxd-grid-item oxd-grid-item--gutters"]/div/div/input');
        this.employeeStatus = page.locator('//div[@class="oxd-select-wrapper"]/div/div/i').nth(0);
        this.employeeStatusDropdown = page.locator('//div[@class="oxd-select-dropdown --positon-bottom"]/div[@class="oxd-select-option"]');
        this.jobTitleDropdown = page.locator('.oxd-input-group').filter({ has: page.getByText('Job Title', { exact: true }) }).locator('.oxd-select-text');
        this.searchButton = page.getByRole('button', { name: ' Search ' }).or(page.getByRole('button', { name: 'Search' }));

        this.employeeNameAutocomplete = new AutocompleteComponent(page, this.employeeName, this.employeeNameDropdown);
        this.employeeStatusDropdownComponent = new SelectDropdownComponent(page, this.employeeStatus);
        this.topNav = new TopNavComponent(page);
    }
     //Opens the PIM module from the sidebar.
    async clickPimMenu() : Promise<void> {
        await this.topNav.goTo('PIM', false);
    }

    //Opens the Admin module from the sidebar.
    async clickAdminMenu() : Promise<void> {
        await this.topNav.goTo('Admin');
    }

    async searchByEmployeeId(employeeId: string): Promise<void> {
        await this.waitForElement(this.employeeId);
        await this.fill(this.employeeId, employeeId);
        await this.waitForElement(this.searchButton);
        await this.click(this.searchButton);
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
     * Searches for an employee by name (e.g. 'Lakshmi Sai Inaganti') and triggers search.
     * Optionally selects autocomplete match if shown.
     */
    async searchEmployeeByName(employeeName: string): Promise<void> {
        await this.waitForElement(this.employeeName);
        await this.employeeName.fill('');
        await this.employeeName.pressSequentially(employeeName, { delay: 100 });

        // If autocomplete dropdown appears, select the matching option
        try {
            const firstOption = this.page.locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option, .oxd-autocomplete-dropdown div').first();
            await firstOption.waitFor({ state: 'visible', timeout: 3000 });
            await firstOption.click();
        } catch {
            // Autocomplete did not show or not required, continue
        }

        await this.waitForElement(this.searchButton);
        await this.click(this.searchButton);
    }

    /**
     * Clicks on an employee record in the search results table (using table card)
     */
    async selectEmployeeFromResults(employeeName: string): Promise<void> {
        const employee = this.page
            .locator('.oxd-table-card')
            .filter({ hasText: employeeName })
            .first();

        await this.waitForElement(employee);
        await employee.click();
    }

    /**
     * Searches employees by Job Title from the PIM search form.
     */
    async searchByJobTitle(jobTitle: string): Promise<void> {
        await this.waitForElement(this.jobTitleDropdown);
        await this.click(this.jobTitleDropdown);

        const option = this.page.getByRole('option', { name: jobTitle, exact: false }).or(
            this.page.locator('.oxd-select-dropdown').getByText(jobTitle, { exact: false })
        ).first();

        await this.waitForElement(option);
        await option.click();

        await this.waitForElement(this.searchButton);
        await this.click(this.searchButton);
    }
    
}
