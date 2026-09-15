import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SelectDropdownComponent } from '../components/SelectDropdownComponent';
import { TopNavComponent } from '../components/TopNavComponent';
import { expect } from '../fixtures/page.fixture';
/**
 * Leave — models the "Leave" functionality.
 * Driven by CSV data (see src/data/ApplyLeave.csv + tests/ui/Testcase-02-Leave.spec.ts)
 * so the same class handles every row without duplicating test logic.
 */
export class LeavePage extends BasePage {
    readonly Leave: Locator;
    readonly Apply: Locator;
    readonly LeaveType: Locator;
    readonly FromDate: Locator;
    readonly ToDate: Locator;
    readonly Comments: Locator;
    readonly ApplyLeave: Locator;
    readonly successMessage: Locator;
    readonly errorMessage: Locator;
    readonly dateValidationMessage: Locator;
    readonly leaveTypeDropdown: SelectDropdownComponent;
    readonly topNav: TopNavComponent;

    constructor(page: Page) {
        super(page);
        this.Leave = page.getByRole('link', { name: 'Leave', exact: true });
        this.Apply = page.getByRole('link', { name: 'Apply', exact: true });
        this.LeaveType = page.locator('.oxd-input-group').filter({ hasText: 'Leave Type' }).locator('.oxd-select-text').first(); this.FromDate = page.locator('input[placeholder="yyyy-mm-dd"]').first();
        this.ToDate = page.locator('input[placeholder="yyyy-mm-dd"]').nth(1);
        this.Comments = page.locator('textarea').first();
        // Final Apply button
        this.ApplyLeave = page.getByRole('button', { name: 'Apply', exact: true }).first();
        this.successMessage = page.getByText('Successfully Saved', { exact: true });

        this.errorMessage = page.getByText('Failed to Submit: No Working Days Selected', { exact: true });

        this.dateValidationMessage = page.getByText('To date should be after from date', { exact: true });
        // LeaveType's original selector was unscoped (page.getByText), so
        // no optionsContainer is passed here — matches original behaviour.
        this.leaveTypeDropdown = new SelectDropdownComponent(page, this.LeaveType, page.locator('.oxd-select-dropdown'));
        this.topNav = new TopNavComponent(page);//Store those components so the Page Object can use them later.
    }

    async clickLeave(): Promise<void> {

        console.log('Clicking Leave...');

        await this.topNav.goTo('Leave');

        console.log('Leave clicked');
    }
    async clickApply(): Promise<void> {

        console.log('Clicking Apply...');

        await this.waitForElement(this.Apply);
        await this.click(this.Apply);

        // Wait until Apply Leave form is loaded
        await this.waitForElement(this.LeaveType);

        console.log('Apply page loaded');
    }
    async selectLeaveType(leaveType: string): Promise<void> {

        console.log(`Selecting Leave Type: ${leaveType}`);

        await this.leaveTypeDropdown.selectByText(leaveType);

        console.log(`Leave Type selected: ${leaveType}`);
    }
    async AddLeaveDetails(
        fromDate: string,
        toDate: string,
        comment: string
    ): Promise<void> {
        // Enter From Date
        await this.waitForElement(this.FromDate);
        await this.fill(this.FromDate, fromDate);
        await this.page.waitForTimeout(2000);

        // Verify From Date
        await expect(this.FromDate).toHaveValue(fromDate);

        // Enter To Date
        await this.waitForElement(this.ToDate);
        await this.ToDate.fill('');
        await this.ToDate.fill(toDate);
        await this.page.waitForTimeout(2000);

        // Verify To Date
        await expect(this.ToDate).toHaveValue(toDate);

        // Enter Comment
        await this.waitForElement(this.Comments);
        await this.fill(this.Comments, comment);
        await this.page.waitForTimeout(2000);

        // Click Apply Leave
        await this.waitForElement(this.ApplyLeave);
        await this.click(this.ApplyLeave);

        await this.page.waitForTimeout(2000);

    }
}