import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { AutocompleteComponent } from '../components/AutocompleteComponent';

/**
 * TC12Page — models the PIM (Employee Information) screen for TC12.
 * Handles employee search/filter, table pagination, and column sorting.
 */
export class TC12Page extends BasePage {
    
    readonly searchButton: Locator;
    readonly resetButton: Locator;
    readonly paginationContainer: Locator;
    readonly firstButton: Locator;
    readonly secondButton: Locator;
    readonly employeeIdHeader: Locator;
    readonly idSortButton: Locator;
    readonly ascending: Locator;
    readonly descending: Locator;
    readonly tableRows: Locator;
    readonly employeeNameInput: Locator;
    readonly autocomplete: AutocompleteComponent;

    constructor(page: Page) {
        super(page);
        this.employeeNameInput = page.locator('.oxd-input-group').filter({ has: page.getByText('Employee Name', { exact: true }) }).locator('input');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.firstButton = page.getByRole('button', { name: '1' });
        this.secondButton = page.getByRole('button', { name: '2' });
        this.paginationContainer = page.locator('.oxd-pagination, .orangehrm-bottom-container');
        this.employeeIdHeader = page.locator('.oxd-table-header-cell').filter({ hasText: /Employee Id|Id/i }).first();
        this.idSortButton = this.employeeIdHeader.locator('.oxd-table-header-sort, i.bi-arrow-down, i').first();
        this.ascending = this.employeeIdHeader.locator('li.oxd-table-header-sort-dropdown-item').filter({ hasText: 'Ascending' });
        this.descending = this.employeeIdHeader.locator('li.oxd-table-header-sort-dropdown-item').filter({ hasText: 'Descending' });
        this.tableRows = page.locator('.oxd-table-card');
        this.autocomplete = new AutocompleteComponent(
            page,
            this.employeeNameInput,
            page.locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option, .oxd-autocomplete-option')
        );
           
    }


    
   async scrollToBottom(): Promise<void> {
    await this.page.evaluate(async () => {
        await new Promise<void>((resolve) => {
            const distance = 100;
            const delay = 100;

            const timer = setInterval(() => {
                window.scrollBy(0, distance);

                const reachedBottom =
                    window.innerHeight + window.scrollY >=
                    document.documentElement.scrollHeight - 10;

                if (reachedBottom) {
                    clearInterval(timer);
                    resolve();
                }
            }, delay);
        });
    });

    await this.paginationContainer.first().scrollIntoViewIfNeeded();

    await this.page.waitForTimeout(500);
}

    async scrollToTop(): Promise<void> {
        await this.page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                const step = 40;
                const interval = setInterval(() => {
                    if (window.scrollY <= 10) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        clearInterval(interval);
                        resolve();
                    } else {
                        window.scrollBy({ top: -step, behavior: 'smooth' });
                    }
                }, 300);
            });
        });
        await this.employeeNameInput.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
    }

    async searchAndSelectEmployee(name: string, fullName?: string): Promise<void> {
        await this.scrollToTop();
        await this.autocomplete.selectFirstMatch(name, fullName);
    }

    async verifyPaginationIsVisible(): Promise<void> {
        await this.waitForElement(this.paginationContainer.first());
        await expect(this.paginationContainer.first()).toBeVisible();
    }

    async clickFirstButton(): Promise<void> {
        await this.waitForElement(this.firstButton);
        await this.click(this.firstButton);
        await this.page.waitForLoadState('networkidle').catch(() => {});
    }

    async clickSecondButton(): Promise<void> {
        await this.waitForElement(this.secondButton);
        await this.click(this.secondButton);
        await this.page.waitForLoadState('networkidle').catch(() => {});
    }

    async clickEmployeeIdHeader(): Promise<void> {
        await this.employeeIdHeader.scrollIntoViewIfNeeded();
        const sortTrigger = this.employeeIdHeader.locator('.oxd-table-header-sort, i, [role="button"]').first();
        if (await sortTrigger.isVisible()) {
            await sortTrigger.click();
        } else {
            await this.employeeIdHeader.click();
        }
        await this.page.locator('.oxd-table-header-sort-dropdown, [role="menu"], .oxd-dropdown-menu').first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    }

    async clickSortAscending(): Promise<void> {
        await this.waitForElement(this.ascending);
        await this.click(this.ascending);
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForTimeout(1000);
    }

    async clickSortDescending(): Promise<void> {
        await this.waitForElement(this.descending);
        await this.click(this.descending);
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForTimeout(1000);
    }

    async fillEmployeeName(name: string): Promise<void> {
        await this.waitForElement(this.employeeNameInput);
        await this.employeeNameInput.fill('');
        await this.employeeNameInput.fill(name);
    }

    async clickSearch(): Promise<void> {
        await this.waitForElement(this.searchButton);
        await this.click(this.searchButton);
        await this.page.waitForLoadState('networkidle').catch(() => {});
    }

    async scrollToRecord(name?: string): Promise<void> {
        const targetRow = name 
            ? this.tableRows.filter({ hasText: name }).first() 
            : this.tableRows.first();
        await this.waitForElement(targetRow);
        await targetRow.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000);
    }
    async clickReset(): Promise<void> {
        await this.waitForElement(this.resetButton);
        await this.click(this.resetButton);
        await this.page.waitForLoadState('networkidle').catch(() => {});
    }
}

