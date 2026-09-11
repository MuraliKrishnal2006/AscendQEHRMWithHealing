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
     // ================= Candidate Locator Pools =================

    get employeeNameCandidates(): Array<() => Locator> {
        return [
            () => this.employeeName,
            () => this.page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > form:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(2)"),
            () => this.page.getByRole('textbox', { name: 'Type for hints...' }),
            () => this.page.getByRole('textbox', { name: /Type for hints\.\.\./i }),
            () => this.page.getByRole('textbox'),
            () => this.page.getByPlaceholder('Type for hints...'),
            () => this.page.getByPlaceholder('Type for hints...', { exact: true })
        ];
    }

    get employeeIdCandidates(): Array<() => Locator> {
        return [
            () => this.employeeId,
            () => this.page.locator("div[class='oxd-input-group oxd-input-field-bottom-space'] div input[class='oxd-input oxd-input--active']"),
            () => this.page.getByRole('textbox'),
            () => this.page.locator('input.oxd-input.oxd-input--active'),
            () => this.page.locator('input.oxd-input.oxd-input--active:visible')
        ];
    }

    get employeeStatusCandidates(): Array<() => Locator> {
        return [
            () => this.employeeStatus,
            () => this.page.locator("/html[1]/body[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[2]/form[1]/div[1]/div[1]/div[3]/div[1]/div[2]/div[1]/div[1]/div[2]/i[1]"),
            () => this.page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > form:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > i:nth-child(1)"),
            () => this.page.locator('i.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow'),
            () => this.page.locator('i.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow:visible'),
            () => this.page.locator('div.oxd-select-text-input'),
            () => this.page.locator('div.oxd-select-text-input:visible'),
            () => this.page.locator('.oxd-select-text-input'),
            () => this.page.locator('div:has-text("-- Select --")'),
            () => this.page.locator('div').filter({ hasText: '-- Select --' }),
            () => this.page.locator(':has-text("-- Select --")')
        ];
    }

    get searchButtonCandidates(): Array<() => Locator> {
        return [
            () => this.searchButton,
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space:visible'),
            () => this.page.locator('button').filter({ hasText: 'Search' }),
            () => this.page.locator('button').filter({ hasText: 'Search' }).first(),
            () => this.page.locator('button').filter({ hasText: 'Search' }).last(),
            () => this.page.locator('div.oxd-form-actions').locator('button').nth(1),
            () => this.page.locator("//button[normalize-space()='Search']")
        ];
    }

    get jobTitleDropdownCandidates(): Array<() => Locator> {
        return [
            () => this.jobTitleDropdown,
            () => this.page.locator('div.oxd-select-text-input'),
            () => this.page.locator('div.oxd-select-text-input:visible'),
            () => this.page.locator('.oxd-select-text-input'),
            () => this.page.locator('div:has-text("-- Select --")'),
            () => this.page.locator('div').filter({ hasText: '-- Select --' }),
            () => this.page.locator(':has-text("-- Select --")')
        ];
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
