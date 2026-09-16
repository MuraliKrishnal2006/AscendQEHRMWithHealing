import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { AutocompleteComponent } from '../components/AutocompleteComponent';
import { SelectDropdownComponent } from '../components/SelectDropdownComponent';
import { AdminMenuComponent } from '../components/adminmenu';
import { healLocator } from '../utils/Locator-healing-utility';

/**
 * PimPage — models the PIM module's employee search screen
 * (/pim/viewEmployeeList). Handles the multi-step search flow:
 * typing a partial name, picking the right match from an autocomplete
 * dropdown, filling employee ID, and selecting employment status
 * from a second dropdown — all before submitting the search.
 * 
 * Implements auto-healing candidate locators for sidebar links,
 * inputs, dropdowns, buttons, and result tables.
 */
export class PimPage extends BasePage {
    readonly employeeName: Locator;
    readonly employeeNameDropdown: Locator;
    readonly employeeId: Locator;
    readonly employeeStatus: Locator;
    readonly employeeStatusDropdown: Locator;
    readonly searchButton: Locator;
    readonly resetButton: Locator;
    readonly employeeListTab: Locator;
    readonly tableRows: Locator;
    readonly pimMenu: Locator;
    readonly adminMenuLink: Locator;

    readonly employeeNameAutocomplete: AutocompleteComponent;
    readonly employeeStatusDropdownComponent: SelectDropdownComponent;
    readonly employmentStatusDropdown: SelectDropdownComponent;
    readonly adminMenu: AdminMenuComponent;

    constructor(page: Page) {
        super(page);

        // Sidebar Navigation Links
        this.pimMenu = page.getByRole('link', { name: 'PIM' });
        this.adminMenuLink = page.getByRole('link', { name: 'Admin' });

        // Search Form Inputs
        this.employeeName = page.getByPlaceholder('Type for hints...').first();
        this.employeeNameDropdown = page.locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option');
        this.employeeId = page.locator('.oxd-table-filter, .oxd-layout-context').locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input').first();
        this.employeeStatus = page.locator('.oxd-input-group').filter({ hasText: 'Employment Status' }).locator('.oxd-select-text').first();
        this.employeeStatusDropdown = page.locator('.oxd-select-dropdown .oxd-select-option');

        // Buttons
        this.searchButton = page.getByRole('button', { name: 'Search' }).first();
        this.resetButton = page.getByRole('button', { name: 'Reset' }).first();

        // Tabs & Table
        this.employeeListTab = page.getByRole('link', { name: 'Employee List' });
        this.tableRows = page.locator('.oxd-table-card');

        this.employeeNameAutocomplete = new AutocompleteComponent(page, this.employeeName, this.employeeNameDropdown);
        this.employeeStatusDropdownComponent = new SelectDropdownComponent(page, this.employeeStatus);
        this.employmentStatusDropdown = new SelectDropdownComponent(page, this.employeeStatus, page.locator('.oxd-select-dropdown'));
        this.adminMenu = new AdminMenuComponent(page);
    }

    // ==========================================
    // Auto-Healing Candidate Getters
    // ==========================================

    get pimMenuCandidates(): Array<() => Locator> {
        return [
            () => this.pimMenu,
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

    get adminMenuCandidates(): Array<() => Locator> {
        return [
            () => this.adminMenuLink,
            () => this.page.getByRole('link', { name: 'Admin', exact: true }),
            () => this.page.getByRole('link', { name: 'Admin' }),
            () => this.page.getByRole('link', { name: /Admin/i }),
            () => this.page.locator('a:has-text("Admin")'),
            () => this.page.locator('a.oxd-main-menu-item.active'),
            () => this.page.locator('a.oxd-main-menu-item.active:visible'),
            () => this.page.locator('a').filter({ hasText: 'Admin' }).first(),
            () => this.page.locator("a[href*='viewAdminModule']"),
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
            () => this.page.locator('.oxd-table-filter, .oxd-layout-context').locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input').first(),
            () => this.page.locator('.oxd-input-group').filter({ has: this.page.getByText('Employee Id', { exact: true }) }).locator('input').first(),
            () => this.page.locator("//label[text()='Employee Id']/../following-sibling::div//input").first(),
            () => this.page.locator("div[class='oxd-input-group oxd-input-field-bottom-space'] div input[class='oxd-input oxd-input--active']").first(),
            () => this.employeeId,
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

    get searchButtonCandidates(): Array<() => Locator> {
        return [
            () => this.searchButton,
            () => this.page.getByRole('button', { name: 'Search' }),
            () => this.page.getByRole('button', { name: /Search/i }),
            () => this.page.getByText('Search', { exact: true }),
            () => this.page.getByText('Search').first(),
            () => this.page.locator('button:has-text("Search")').first(),
            () => this.page.locator(':text-is("Search")').first(),
            () => this.page.locator(':text("Search")').first(),
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space').first(),
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space:visible').first(),
            () => this.page.locator('button').filter({ hasText: 'Search' }).first(),
            () => this.page.locator('button').filter({ hasText: 'Search' }).last(),
            () => this.page.locator('div.oxd-form-actions').locator('button').nth(1),
            () => this.page.locator("//button[normalize-space()='Search']"),
            () => this.page.locator("button[type='submit']").first(),
        ];
    }

    get resetButtonCandidates(): Array<() => Locator> {
        return [
            () => this.resetButton,
            () => this.page.getByRole('button', { name: 'Reset' }),
            () => this.page.getByRole('button', { name: /Reset/i }),
            () => this.page.getByText('Reset', { exact: true }),
            () => this.page.getByText('Reset').first(),
            () => this.page.locator('button:has-text("Reset")').first(),
            () => this.page.locator(':text-is("Reset")').first(),
            () => this.page.locator('button.oxd-button--ghost').first(),
            () => this.page.locator("//button[normalize-space()='Reset']"),
        ];
    }

    get tableRowsCandidates(): Array<() => Locator> {
        return [
            () => this.tableRows,
            () => this.page.locator('.oxd-table-card'),
            () => this.page.locator('.oxd-table-body .oxd-table-row'),
            () => this.page.locator("//div[@class='oxd-table-row oxd-table-row--with-border']"),
            () => this.page.locator("div[class='oxd-table-row oxd-table-row--with-border']"),
            () => this.page.getByRole('row'),
            () => this.page.locator('div.oxd-table-row.oxd-table-row--with-border'),
            () => this.page.locator('div.oxd-table-row.oxd-table-row--with-border:visible'),
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
            await this.adminMenu.clickPim();
        }
        await this.page.waitForTimeout(2000);
    }

    // Opens the Admin module from the sidebar.
    async clickAdminMenu(): Promise<void> {
        try {
            const adminLink = await healLocator(this.adminMenuCandidates);
            await this.click(adminLink);
        } catch {
            await this.page.goto('/web/index.php/admin/viewAdminModule');
        }
        await this.page.waitForTimeout(2000);
    }

    /**
     * Runs a full employee search using a partial name match.
     */
    async employeesearchPartial(
        empname: string,
        employee: string,
        employeeId: string,
        employeeStatus: string
    ): Promise<void> {
        await this.employeeNameAutocomplete.selectExact(empname, employee, { useKeystrokes: true });

        const empIdField = await healLocator(this.employeeIdCandidates);
        await this.waitForElement(empIdField);
        await this.fill(empIdField, employeeId);

        const statusDropdown = await healLocator(this.employeeStatusCandidates);
        await this.employeeStatusDropdownComponent.selectByLoopMatch(this.employeeStatusDropdown, employeeStatus);

        const searchBtn = await healLocator(this.searchButtonCandidates);
        await this.waitForElement(searchBtn);
        await searchBtn.click();
    }

    /**
     * Searches the Employee List by Employee ID on the PIM page.
     */
    async searchByEmployeeId(empId: string): Promise<void> {
        await this.clickPimMenu();
        const empIdField = await healLocator(this.employeeIdCandidates);
        await this.waitForElement(empIdField);
        await this.fill(empIdField, empId);

        const searchBtn = await healLocator(this.searchButtonCandidates);
        await this.waitForElement(searchBtn);
        await this.click(searchBtn);
    }

    /**
     * Searches by Employee Name using Autocomplete.
     */
    async searchByEmployeeName(name: string): Promise<void> {
        await this.employeeNameAutocomplete.selectExact(name);
        const searchBtn = await healLocator(this.searchButtonCandidates);
        await this.waitForElement(searchBtn);
        await this.click(searchBtn);
        await this.page.waitForTimeout(2000);
    }

    /**
     * Clears the Employee Name search field.
     */
    async clearEmployeeName(): Promise<void> {
        const empNameInput = await healLocator(this.employeeNameCandidates);
        await this.waitForElement(empNameInput);
        await empNameInput.click();
        await empNameInput.press('Control+A');
        await empNameInput.press('Backspace');
    }

    /**
     * Selects an employment status from the dropdown and clicks Search.
     */
    async searchByEmploymentStatus(status?: string): Promise<void> {
        const statusField = await healLocator(this.employeeStatusCandidates);
        await this.waitForElement(statusField);
        await this.click(statusField);
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

        const searchBtn = await healLocator(this.searchButtonCandidates);
        await this.waitForElement(searchBtn);
        await this.click(searchBtn);
        await this.page.waitForTimeout(2000);
    }

    /**
     * Clicks on the first matching result row in the employee table.
     */
    async clickFirstResultRow(): Promise<void> {
        await this.page.waitForTimeout(1000);
        const rows = await healLocator(this.tableRowsCandidates);
        const count = await rows.count();
        if (count > 0) {
            const cell = rows.first().locator('.oxd-table-cell').nth(2);
            if (await cell.isVisible().catch(() => false)) {
                await cell.click();
            } else {
                await rows.first().click();
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
        const resetBtn = await healLocator(this.resetButtonCandidates);
        await this.waitForElement(resetBtn);
        await this.click(resetBtn);
        await this.page.waitForTimeout(1000);
    }
}

