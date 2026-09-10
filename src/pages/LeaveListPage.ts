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