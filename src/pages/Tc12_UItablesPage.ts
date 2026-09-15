import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { AutocompleteComponent } from '../components/AutocompleteComponent';

/**
 * Tc12_UItablesPage — models the PIM (Employee Information) screen for Tc12_UItables.
 * Handles employee search/filter, table pagination, and column sorting.
 */
export class Tc12_UItablesPage extends BasePage {
    
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
    // ================= Candidate Locator Pools =================

    get paginationContainerCandidates(): Array<() => Locator> {
        return [
            () => this.paginationContainer,
            () => this.page.locator('div.orangehrm-bottom-container:visible'),
            () => this.page.locator('.orangehrm-bottom-container'),
            () => this.page.locator('div.orangehrm-paper-container').locator('div').nth(3),
            () => this.page.locator("//div[@class='orangehrm-bottom-container']"),
            () => this.page.locator(".orangehrm-bottom-container"),
            () => this.page.locator('.oxd-pagination, .orangehrm-bottom-container'),
            () => this.page.locator('div:visible')
        ];
    }

    get searchButtonCandidates(): Array<() => Locator> {
        return [
            () => this.searchButton,
            () => this.page.getByRole('button', { name: /Search/i }),
            () => this.page.getByText('Search', { exact: true }),
            () => this.page.getByText('Search'),
            () => this.page.locator('button:has-text("Search")'),
            () => this.page.locator(':text-is("Search")'),
            () => this.page.locator(':text("Search")'),
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space'),
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space:visible'),
            () => this.page.locator('button').filter({ hasText: 'Search' })
        ];
    }

    get resetButtonCandidates(): Array<() => Locator> {
        return [
            () => this.resetButton,
            () => this.page.getByRole('button', { name: /Reset/i }),
            () => this.page.getByText('Reset', { exact: true }),
            () => this.page.locator('button:has-text("Reset")'),
            () => this.page.locator(':text-is("Reset")'),
            () => this.page.locator(':text("Reset")'),
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--ghost'),
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--ghost:visible'),
            () => this.page.locator('button').filter({ hasText: 'Reset' }),
            () => this.page.locator('button').filter({ hasText: 'Reset' }).first()
        ];
    }

    get firstButtonCandidates(): Array<() => Locator> {
        return [
            () => this.firstButton,
            () => this.page.getByText('1', { exact: true }),
            () => this.page.locator('button:has-text("1")'),
            () => this.page.locator('button.oxd-pagination-page-item.oxd-pagination-page-item--page.oxd-pagination-page-item--page-selected'),
            () => this.page.locator('button.oxd-pagination-page-item.oxd-pagination-page-item--page.oxd-pagination-page-item--page-selected:visible'),
            () => this.page.locator('button').filter({ hasText: '1' }),
            () => this.page.locator('button').filter({ hasText: '1' }).first(),
            () => this.page.locator("//button[normalize-space()='1']")
        ];
    }

    get secondButtonCandidates(): Array<() => Locator> {
        return [
            () => this.secondButton,
            () => this.page.getByText('2', { exact: true }),
            () => this.page.locator('button:has-text("2")'),
            () => this.page.locator(':text-is("2")'),
            () => this.page.locator('button').filter({ hasText: '2' }),
            () => this.page.locator('button').filter({ hasText: '2' }).first(),
            () => this.page.locator('button').filter({ hasText: '2' }).last(),
            () => this.page.locator("//button[normalize-space()='2']")
        ];
    }

    get employeeIdHeaderCandidates(): Array<() => Locator> {
        return [
            () => this.employeeIdHeader,
            () => this.page.locator(':text-is("Id")'),
            () => this.page.locator('div').filter({ hasText: 'Id' }).first(),
            () => this.page.getByRole('columnheader').filter({ hasText: 'Id' }),
            () => this.page.getByText('Id', { exact: true }),
            () => this.page.locator(':text("Id")'),
            () => this.page.locator('div.oxd-table-header-cell.oxd-padding-cell.oxd-table-th').filter({ hasText: 'Id' }),
            () => this.page.locator('div').filter({ hasText: 'Id' })
        ];
    }

    get idSortButtonCandidates(): Array<() => Locator> {
        return [
            () => this.idSortButton,
            () => this.page.locator("/html[1]/body[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[1]/i[1]"),
            () => this.page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > i:nth-child(1)"),
            () => this.page.locator('i.oxd-icon.bi-arrow-down-up.oxd-icon-button__icon.oxd-table-header-sort-icon'),
            () => this.page.locator('i.oxd-icon.bi-arrow-down-up.oxd-icon-button__icon.oxd-table-header-sort-icon:visible'),
            () => this.employeeIdHeader.locator('.oxd-table-header-sort, i.bi-arrow-down-up, i').first()
        ];
    }

    get ascendingCandidates(): Array<() => Locator> {
        return [
            () => this.ascending,
            () => this.page.locator('span').filter({ hasText: 'Ascending' }).first(),
            () => this.page.locator("//div[@class='--active oxd-table-header-sort-dropdown']//span[@class='oxd-text oxd-text--span'][normalize-space()='Ascending']"),
            () => this.page.getByText('Ascending', { exact: true }),
            () => this.page.locator('span:has-text("Ascending")'),
            () => this.page.locator(':text-is("Ascending")'),
            () => this.page.locator('span').filter({ hasText: 'Ascending' }),
            () => this.page.locator(':text("Ascending")'),
            () => this.page.locator('span.oxd-text.oxd-text--span:visible'),
            () => this.employeeIdHeader.locator('li.oxd-table-header-sort-dropdown-item').filter({ hasText: 'Ascending' })
        ];
    }

    get descendingCandidates(): Array<() => Locator> {
        return [
            () => this.descending,
            () => this.page.locator('span').filter({ hasText: 'Descending' }).first(),
            () => this.page.getByText('Descending', { exact: true }),
            () => this.page.locator('span:has-text("Descending")'),
            () => this.page.locator(':text-is("Descending")'),
            () => this.page.locator('span').filter({ hasText: 'Descending' }),
            () => this.page.locator(':text("Descending")'),
            () => this.page.locator('span.oxd-text.oxd-text--span:visible'),
            () => this.page.locator('span.oxd-text.oxd-text--span'),
            () => this.page.locator(':has-text("Descending")'),
            () => this.page.locator('span:visible'),
            () => this.page.locator("//div[@class='--active oxd-table-header-sort-dropdown']//span[@class='oxd-text oxd-text--span'][normalize-space()='Descending']"),
            () => this.employeeIdHeader.locator('li.oxd-table-header-sort-dropdown-item').filter({ hasText: 'Descending' })
        ];
    }

    get tableRowsCandidates(): Array<() => Locator> {
        return [
            () => this.tableRows,
            () => this.page.locator('.oxd-table-card'),
            () => this.page.locator("//div[@class='oxd-table-row oxd-table-row--with-border']"),
            () => this.page.getByRole('row'),
            () => this.page.locator('div.oxd-table-row.oxd-table-row--with-border'),
            () => this.page.locator('div.oxd-table-row.oxd-table-row--with-border:visible')
        ];
    }

    get employeeNameInputCandidates(): Array<() => Locator> {
        return [
            () => this.employeeNameInput,
            () => this.page.locator('.oxd-input-group').filter({ has: this.page.getByText('Employee Name', { exact: true }) }).getByRole('textbox', { name: 'Type for hints...' }),
            () => this.page.getByRole('textbox', { name: /Type for hints\.\.\./i }),
            () => this.page.getByRole('textbox'),
            () => this.page.getByPlaceholder('Type for hints...'),
            () => this.page.getByPlaceholder('Type for hints...', { exact: true }),
            () => this.page.locator('input:visible')
        ];
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
    }

    async clickSecondButton(): Promise<void> {
        await this.waitForElement(this.secondButton);
        await this.click(this.secondButton);
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
        await this.page.waitForTimeout(1000);
    }

    async clickSortDescending(): Promise<void> {
        await this.waitForElement(this.descending);
        await this.click(this.descending);
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
    }
}

export { Tc12_UItablesPage as TC12_UItablesPage };
export { Tc12_UItablesPage as TC12Page };
