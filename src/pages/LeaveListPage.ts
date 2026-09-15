import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { AutocompleteComponent } from '../components/AutocompleteComponent';
/**
 * LeaveListPage — models the Leave List/search + approve screen.
 * Driven by CSV data (see src/data/ApplyLeave.csv + tests/ui/Testcase-02-Leave.spec.ts)
 * so the same class handles every row without duplicating test logic.
 */
export class LeaveListPage extends BasePage {

    readonly FromDate: Locator;
    readonly ToDate: Locator;
    readonly EmployeeName: Locator;
    readonly SearchButton: Locator;
    readonly LeaveCheckbox: Locator;
    readonly ResetButton: Locator;
    readonly ApproveLeave: Locator;
    readonly RejectLeave: Locator;
    readonly CancelButton: Locator;
    readonly successMessage: Locator;

    readonly employeeNameAutocomplete: AutocompleteComponent;

    constructor(page: Page) {
        super(page);

        this.FromDate =
            page.locator('input[placeholder="yyyy-mm-dd"]').first();

        this.ToDate =
            page.locator('input[placeholder="yyyy-mm-dd"]').nth(1);

        this.EmployeeName = page.locator('input[placeholder="Type for hints..."]').first();

        this.SearchButton = page.getByRole('button', { name: 'Search' });

        this.ResetButton = page.getByRole('button', { name: 'Reset' });

        this.LeaveCheckbox = page.locator('div input[type="checkbox"]');

        this.ApproveLeave = page.getByRole('button', { name: 'Approve' });

        this.RejectLeave = page.getByRole('button', { name: 'Reject' });

        this.CancelButton = page.getByRole('button', { name: 'Cancel' });
        this.successMessage = page.locator('.message.success');

        this.employeeNameAutocomplete = new AutocompleteComponent(
            page,
            this.EmployeeName,
            page.locator(
                '.oxd-autocomplete-dropdown .oxd-autocomplete-option'
            )
        );
    }
             // ================= Candidate Locator Pools =================

    get fromDateCandidates(): Array<() => Locator> {
        return [
            () => this.FromDate,
            () => this.page.getByRole('textbox', { name: /yyyy-mm-dd/i }),
            () => this.page.getByRole('textbox'),
            () => this.page.getByPlaceholder('yyyy-mm-dd'),
            () => this.page.getByPlaceholder('yyyy-mm-dd', { exact: true }),
            () => this.page.locator('input.oxd-input.oxd-input--active'),
            () => this.page.locator('input.oxd-input.oxd-input--active:visible')
        ];
    }

    get toDateCandidates(): Array<() => Locator> {
        return [
            () => this.ToDate,
            () => this.page.getByRole('textbox', { name: /yyyy-mm-dd/i }),
            () => this.page.getByRole('textbox'),
            () => this.page.getByPlaceholder('yyyy-mm-dd'),
            () => this.page.getByPlaceholder('yyyy-mm-dd', { exact: true }),
            () => this.page.locator('input.oxd-input.oxd-input--active'),
            () => this.page.locator('input.oxd-input.oxd-input--active:visible')
        ];
    }

    get employeeNameCandidates(): Array<() => Locator> {
        return [
            () => this.EmployeeName,
            () => this.page.getByRole('textbox', { name: /Type for hints\.\.\./i }),
            () => this.page.getByPlaceholder('Type for hints...'),
            () => this.page.getByPlaceholder('Type for hints...', { exact: true }),
            () => this.page.locator("//input[@placeholder='Type for hints...']"),
            () => this.page.locator("input[placeholder='Type for hints...']"),
            () => this.page.getByRole('textbox')
        ];
    }

    get searchButtonCandidates(): Array<() => Locator> {
        return [
            () => this.SearchButton,
            () => this.page.locator('div.oxd-form-actions').locator('button').nth(1),
            () => this.page.locator("//button[normalize-space()='Search']"),
            () => this.page.locator("button[type='submit']"),
            () => this.page.getByRole('button'),
            () => this.page.locator(':has-text("Search")'),
            () => this.page.locator('button:visible')
        ];
    }

    get resetButtonCandidates(): Array<() => Locator> {
        return [
            () => this.ResetButton,
            () => this.page.locator('button').filter({ hasText: 'Reset' }).last(),
            () => this.page.locator('div.oxd-form-actions').locator('button').nth(0),
            () => this.page.locator("//button[normalize-space()='Reset']"),
            () => this.page.locator("button[type='reset']"),
            () => this.page.getByRole('button'),
            () => this.page.locator(':has-text("Reset")'),
            () => this.page.locator('button:visible')
        ];
    }

    get approveLeaveCandidates(): Array<() => Locator> {
        return [
            () => this.ApproveLeave,
            () => this.page.locator('button').filter({ hasText: 'Approve' }).first(),
            () => this.page.locator('button').filter({ hasText: 'Approve' }).last(),
            () => this.page.locator('div.oxd-table-cell-actions').locator('button').nth(0),
            () => this.page.locator("//body/div[@id='app']/div[@class='oxd-layout']/div[@class='oxd-layout-container']/div[@class='oxd-layout-context']/div[@class='orangehrm-background-container']/div[@class='orangehrm-paper-container']/div[@class='orangehrm-container']/div[@role='table']/div[@role='rowgroup']/div[7]/div[1]/div[9]/div[1]/button[1]"),
            () => this.page.getByRole('button', { name: 'Approve' }),
            () => this.page.locator('button:has-text("Approve")')
        ];
    }

    get rejectLeaveCandidates(): Array<() => Locator> {
        return [
            () => this.RejectLeave,
            () => this.page.locator('button').filter({ hasText: 'Reject' }).first(),
            () => this.page.locator('button').filter({ hasText: 'Reject' }).last(),
            () => this.page.locator('div.oxd-table-cell-actions').locator('button').nth(1),
            () => this.page.locator("//body/div[@id='app']/div[@class='oxd-layout']/div[@class='oxd-layout-container']/div[@class='oxd-layout-context']/div[@class='orangehrm-background-container']/div[@class='orangehrm-paper-container']/div[@class='orangehrm-container']/div[@role='table']/div[@role='rowgroup']/div[7]/div[1]/div[9]/div[1]/button[1]"),
            () => this.page.getByRole('button', { name: 'Reject' }),
            () => this.page.locator('button:has-text("Reject")')
        ];
    }

    get cancelButtonCandidates(): Array<() => Locator> {
        return [
            () => this.CancelButton,
            () => this.page.getByRole('button', { name: /Cancel/i }),
            () => this.page.getByText('Cancel', { exact: true }),
            () => this.page.locator('button:has-text("Cancel")'),
            () => this.page.locator(':text-is("Cancel")'),
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--label-warn.oxd-table-cell-action-space'),
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--label-warn.oxd-table-cell-action-space:visible')
        ];
    }
    async searchLeave(
        fromDate: string,
        toDate: string,
        username: string
    ): Promise<void> {

        // Clear previous search values
        await this.FromDate.fill('');
        await this.ToDate.fill('');
        await this.EmployeeName.fill('');

        // Enter current CSV dates
        await this.FromDate.fill(fromDate);
        await this.ToDate.fill(toDate);

        const employeeSearchText = username.substring(0, 6);

        await this.employeeNameAutocomplete.selectFirstMatch(
            employeeSearchText
        );

        await this.SearchButton.click();

        await this.LeaveCheckbox.first().waitFor({
            state: 'visible',
            timeout: 10000
        });
    }
    async selectLeave(): Promise<void> {

        await this.LeaveCheckbox.first().scrollIntoViewIfNeeded();

        await this.LeaveCheckbox.first().click({ force: true });
    }

    async approveLeave(): Promise<void> {

        await this.ApproveLeave.click();
    }

    async resetSearch(): Promise<void> {

        await this.ResetButton.click();
    }

    async rejectLeave(): Promise<void> {

        await this.RejectLeave.click();
    }

    async cancelLeave(): Promise<void> {

        await this.CancelButton.click();
    }
}