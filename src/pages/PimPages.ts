import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { AutocompleteComponent } from '../components/AutocompleteComponent';
import { SelectDropdownComponent } from '../components/SelectDropdownComponent';
import { TopNavComponent } from '../components/TopNavComponent';
import { healLocator } from '../utils/Locator-healing-utility';

/**
 * PimPages — models the PIM module's employee search screen
 * (/pim/viewEmployeeList). Handles the multi-step search flow:
 * typing a partial name, picking the right match from an autocomplete
 * dropdown, filling employee ID, and selecting employment status
 * from a second dropdown — all before submitting the search.
 * 
 * Implements resilient fallback locators and auto-healing candidates for:
 * 1. PIM Menu Link
 * 2. Employee Name input
 * 3. Employee ID input
 * 4. Employment Status dropdown arrow/trigger
 */
export class PimPages extends BasePage {
    readonly Pimmenu: Locator;
    readonly employeeName: Locator;
    readonly employeeNameDropdown: Locator;
    readonly employeeId: Locator;
    readonly employeeStatus: Locator;
    readonly employeeStatusDropdown: Locator;
    readonly searchButton: Locator;
    readonly jobTitleDropdown: Locator;

    readonly employeeNameAutocomplete: AutocompleteComponent;
    readonly employeeStatusDropdownComponent: SelectDropdownComponent;
    readonly topNav: TopNavComponent;

    constructor(page: Page) {
        super(page);

        // 1. PIM Navigation Menu Link with resilient .or() fallback chain
        this.Pimmenu = page.getByRole('link', { name: 'PIM', exact: true })
            .or(page.getByRole('link', { name: 'PIM' }))
            .or(page.getByRole('link', { name: /PIM/i }))
            .or(page.getByText('PIM', { exact: true }))
            .or(page.getByText('PIM'))
            .or(page.locator('a:has-text("PIM")'))
            .or(page.locator(':text-is("PIM")'))
            .or(page.locator(':text("PIM")'))
            .or(page.locator("a[href*='viewPimModule']"))
            .or(page.locator('.oxd-main-menu-item').filter({ hasText: 'PIM' }))
            .or(page.locator('a.oxd-main-menu-item').filter({ hasText: 'PIM' }))
            .or(page.locator('a').filter({ hasText: 'PIM' }).first())
            .or(page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > aside:nth-child(1) > nav:nth-child(1) > div:nth-child(2) > ul:nth-child(2) > li:nth-child(2) > a:nth-child(1)"))
            .first();

        // 2. Employee Name search input with resilient .or() fallback chain
        this.employeeName = page.getByPlaceholder('Type for hints...').first()
            .or(page.getByRole('textbox', { name: 'Type for hints...' }))
            .or(page.getByRole('textbox', { name: /Type for hints\.\.\./i }))
            .or(page.locator('.oxd-input-group').filter({ hasText: 'Employee Name' }).locator('input').first())
            .or(page.locator("/html[1]/body[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[2]/form[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/input[1]"))
            .or(page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > form:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(2)"))
            .first();

        this.employeeNameDropdown = page.locator('//div[@class="oxd-autocomplete-dropdown --positon-bottom"]/div')
            .or(page.locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option, .oxd-autocomplete-option, [role="option"]'));

        // 3. Employee ID search input with resilient .or() fallback chain
        this.employeeId = page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input').first()
            .or(page.locator("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']").first())
            .or(page.locator("div[class='oxd-input-group oxd-input-field-bottom-space'] div input[class='oxd-input oxd-input--active']").first())
            .or(page.locator('//div[@class="oxd-grid-item oxd-grid-item--gutters"]/div/div/input').first())
            .or(page.locator('.oxd-input-group:has-text("Employee Id") input').first())
            .or(page.locator('input.oxd-input.oxd-input--active').first())
            .or(page.locator('input.oxd-input.oxd-input--active:visible').first())
            .first();

        // 4. Employment Status dropdown trigger/arrow with resilient .or() fallback chain
        this.employeeStatus = page.locator('.oxd-input-group').filter({ hasText: 'Employment Status' }).locator('.oxd-select-text').first()
            .or(page.locator('.oxd-input-group:has-text("Employment Status") .oxd-select-text-input').first())
            .or(page.locator('.oxd-input-group:has-text("Employment Status") i.oxd-select-text--arrow').first())
            .or(page.locator('i.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').first())
            .or(page.locator('i.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow:visible').first())
            .or(page.locator('//div[@class="oxd-select-wrapper"]/div/div/i').first())
            .or(page.locator("//div[3]//div[1]//div[2]//div[1]//div[1]//div[2]//i[1]").first())
            .or(page.locator("/html[1]/body[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[2]/form[1]/div[1]/div[1]/div[3]/div[1]/div[2]/div[1]/div[1]/div[2]/i[1]").first())
            .or(page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > form:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > i:nth-child(1)").first())
            .first();

        this.employeeStatusDropdown = page.locator('//div[@class="oxd-select-dropdown --positon-bottom"]/div[@class="oxd-select-option"]')
            .or(page.locator('.oxd-select-dropdown .oxd-select-option, .oxd-select-option, [role="option"]'));

        this.jobTitleDropdown = page.locator('.oxd-input-group').filter({ has: page.getByText('Job Title', { exact: true }) }).locator('.oxd-select-text');

        this.searchButton = page.getByRole('button', { name: ' Search ' })
            .or(page.getByRole('button', { name: 'Search' }))
            .or(page.getByRole('button', { name: /Search/i }))
            .or(page.getByText('Search', { exact: true }))
            .or(page.locator('button:has-text("Search")'))
            .or(page.locator('button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space'))
            .or(page.locator("//button[normalize-space()='Search']"))
            .first();

        this.employeeNameAutocomplete = new AutocompleteComponent(page, this.employeeName, this.employeeNameDropdown);
        this.employeeStatusDropdownComponent = new SelectDropdownComponent(page, this.employeeStatus);
        this.topNav = new TopNavComponent(page);
    }

    // ==========================================
    // Auto-Healing Candidate Getters
    // ==========================================

    get pimMenuCandidates(): Array<() => Locator> {
        return [
            () => this.Pimmenu,
            () => this.page.getByRole('link', { name: 'PIM', exact: true }),
            () => this.page.getByRole('link', { name: 'PIM' }),
            () => this.page.getByRole('link', { name: /PIM/i }),
            () => this.page.getByText('PIM', { exact: true }),
            () => this.page.getByText('PIM'),
            () => this.page.locator('a:has-text("PIM")'),
            () => this.page.locator(':text-is("PIM")'),
            () => this.page.locator(':text("PIM")'),
            () => this.page.locator('a').filter({ hasText: 'PIM' }).first(),
            () => this.page.locator('a').filter({ hasText: 'PIM' }).last(),
            () => this.page.locator('a.oxd-main-menu-item').filter({ hasText: 'PIM' }),
            () => this.page.locator('.oxd-main-menu-item').filter({ hasText: 'PIM' }),
            () => this.page.locator("a[href*='viewPimModule']"),
            () => this.page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > aside:nth-child(1) > nav:nth-child(1) > div:nth-child(2) > ul:nth-child(2) > li:nth-child(2) > a:nth-child(1)"),
            () => this.page.locator('a.oxd-main-menu-item.active'),
            () => this.page.locator('a.oxd-main-menu-item.active:visible'),
            () => this.page.locator("//a[@class='oxd-main-menu-item active']"),
            () => this.page.locator("//a[normalize-space()='']"),
        ];
    }

    get employeeNameCandidates(): Array<() => Locator> {
        return [
            () => this.employeeName,
            () => this.page.getByPlaceholder('Type for hints...').first(),
            () => this.page.getByRole('textbox', { name: 'Type for hints...' }),
            () => this.page.getByRole('textbox', { name: /Type for hints\.\.\./i }),
            () => this.page.locator('.oxd-input-group').filter({ hasText: 'Employee Name' }).locator('input').first(),
            () => this.page.locator("/html[1]/body[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[2]/form[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/input[1]"),
            () => this.page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > form:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(2)"),
            () => this.page.locator("div.oxd-autocomplete-text-input input").first(),
        ];
    }

    get employeeIdCandidates(): Array<() => Locator> {
        return [
            () => this.employeeId,
            () => this.page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input').first(),
            () => this.page.locator("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']").first(),
            () => this.page.locator("div[class='oxd-input-group oxd-input-field-bottom-space'] div input[class='oxd-input oxd-input--active']").first(),
            () => this.page.locator('//div[@class="oxd-grid-item oxd-grid-item--gutters"]/div/div/input'),
            () => this.page.locator('.oxd-input-group:has-text("Employee Id") input').first(),
            () => this.page.locator('input.oxd-input.oxd-input--active').first(),
            () => this.page.locator('input.oxd-input.oxd-input--active:visible').first(),
        ];
    }

    get employeeStatusCandidates(): Array<() => Locator> {
        return [
            () => this.employeeStatus,
            () => this.page.locator('.oxd-input-group').filter({ hasText: 'Employment Status' }).locator('.oxd-select-text').first(),
            () => this.page.locator('.oxd-input-group:has-text("Employment Status") .oxd-select-text-input').first(),
            () => this.page.locator('.oxd-input-group:has-text("Employment Status") i.oxd-select-text--arrow').first(),
            () => this.page.locator('i.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow:visible').first(),
            () => this.page.locator('i.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').first(),
            () => this.page.locator('//div[@class="oxd-select-wrapper"]/div/div/i').first(),
            () => this.page.locator("//div[3]//div[1]//div[2]//div[1]//div[1]//div[2]//i[1]"),
            () => this.page.locator("/html[1]/body[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[2]/form[1]/div[1]/div[1]/div[3]/div[1]/div[2]/div[1]/div[1]/div[2]/i[1]"),
            () => this.page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > form:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > i:nth-child(1)"),
        ];
    }

    // ==========================================
    // Page Actions with Auto-Healing
    // ==========================================

    // Opens the PIM module from the sidebar.
    async clickPimMenu(): Promise<void> {
        try {
            const pimLink = await healLocator(this.pimMenuCandidates);
            await this.click(pimLink);
        } catch {
            await this.topNav.goTo('PIM', false);
        }
    }

    // Opens the Admin module from the sidebar.
    async clickAdminMenu(): Promise<void> {
        await this.topNav.goTo('Admin');
    }

    async searchByEmployeeId(employeeId: string): Promise<void> {
        const empIdField = await healLocator(this.employeeIdCandidates);
        await this.waitForElement(empIdField);
        await this.fill(empIdField, employeeId);
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
    async employeesearchPartial(empname: string, employee: string, employeeId: string, employeeStatus: string): Promise<void> {
        await this.employeeNameAutocomplete.selectExact(empname, employee, { useKeystrokes: true });

        const empIdField = await healLocator(this.employeeIdCandidates);
        await this.waitForElement(empIdField);
        await this.fill(empIdField, employeeId);

        await this.employeeStatusDropdownComponent.selectByLoopMatch(this.employeeStatusDropdown, employeeStatus);

        await this.waitForElement(this.searchButton);
        await this.searchButton.click();
    }

    /**
     * Searches for an employee by name (e.g. 'Lakshmi Sai Inaganti') and triggers search.
     * Optionally selects autocomplete match if shown.
     */
    async searchEmployeeByName(employeeName: string): Promise<void> {
        const nameField = await healLocator(this.employeeNameCandidates);
        await this.waitForElement(nameField);
        await nameField.fill('');
        await nameField.pressSequentially(employeeName, { delay: 100 });

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
