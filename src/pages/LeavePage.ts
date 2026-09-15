import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SelectDropdownComponent } from '../components/SelectDropdownComponent';
import { TopNavComponent } from '../components/TopNavComponent';
import { expect } from '../fixtures/page.fixture';
import { healLocator } from '../utils/Locator-healing-utility';

/**
 * LeavePage — models the "Leave" functionality (applying and managing leave).
 * Driven by CSV data (see src/data/ApplyLeave.csv + tests/ui/Testcase-02-Leave.spec.ts).
 * 
 * Implements auto-healing candidate locators for navigation, inputs, dropdowns,
 * buttons, and toast notifications.
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
    readonly leaveBalance: Locator;
    readonly leaveTypeDropdown: SelectDropdownComponent;
    readonly topNav: TopNavComponent;

    constructor(page: Page) {
        super(page);

        // Core element properties with resilient .or() chains (with .first() to prevent strict mode violations)
        this.Leave = page.getByRole('link', { name: 'Leave', exact: true })
            .or(page.locator('a.oxd-main-menu-item').filter({ hasText: 'Leave' }))
            .or(page.locator("a[href*='viewLeaveModule']"))
            .or(page.locator("//a[@class='oxd-main-menu-item active']"))
            .or(page.locator('.oxd-main-menu-item.active'))
            .first();

        this.Apply = page.getByRole('link', { name: 'Apply', exact: true })
            .or(page.getByRole('link', { name: /Apply/i }))
            .or(page.getByText('Apply', { exact: true }))
            .or(page.locator('a:has-text("Apply")'))
            .or(page.locator('.oxd-topbar-body-nav-tab-item').filter({ hasText: 'Apply' }))
            .first();

        this.LeaveType = page.getByText('-- Select --', { exact: true })
            .or(page.locator('.oxd-select-text-input'))
            .or(page.locator('div.oxd-select-text-input:visible'))
            .or(page.locator('i.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow'))
            .first();

        this.FromDate = page.locator('.oxd-input-group').filter({ hasText: 'From Date' }).locator('input').first()
            .or(page.locator('input[placeholder="yyyy-mm-dd"]').first())
            .first();

        this.ToDate = page.locator('.oxd-input-group').filter({ hasText: 'To Date' }).locator('input').first()
            .or(page.locator('input[placeholder="yyyy-mm-dd"]').nth(1))
            .first();

        this.Comments = page.locator('textarea.oxd-textarea.oxd-textarea--active.oxd-textarea--resize-vertical')
            .or(page.locator('textarea.oxd-textarea').first())
            .or(page.locator("//textarea[@class='oxd-textarea oxd-textarea--active oxd-textarea--resize-vertical']"))
            .or(page.locator('textarea:visible').first())
            .first();

        this.ApplyLeave = page.getByRole('button', { name: 'Apply', exact: true })
            .or(page.getByRole('button', { name: /Apply/i }))
            .or(page.locator('button:has-text("Apply")'))
            .or(page.locator('button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space'))
            .or(page.locator("//button[normalize-space()='Apply']"))
            .or(page.locator("button[type='submit']"))
            .first();

        this.successMessage = page.locator('p.oxd-text--toast-message:has-text("Successfully Saved")')
            .or(page.locator('.oxd-toast--success').locator('p.oxd-text--toast-message'))
            .or(page.locator('.oxd-toast-content--success p.oxd-toast-content-text').last())
            .or(page.getByText('Successfully Saved', { exact: true }))
            .or(page.locator("//p[contains(@class,'oxd-text--toast-message') and contains(text(),'Successfully Saved')]"))
            .first();

        this.errorMessage = page.locator('p.oxd-text--toast-message:has-text("Failed to Submit")')
            .or(page.locator('.oxd-toast--warn').locator('p.oxd-text--toast-message'))
            .or(page.locator(".oxd-toast.oxd-toast--warn .oxd-toast-content-text:not(.oxd-text--toast-title)"))
            .or(page.getByText('Failed to Submit: No Working Days Selected', { exact: true }))
            .first();

        this.dateValidationMessage = page.getByText('To date should be after from date', { exact: true })
            .or(page.locator('.oxd-input-field-error-message:has-text("To date should be after from date")'))
            .or(page.locator('.oxd-input-group__message:has-text("To date should be after from date")'))
            .or(page.locator("span:has-text('To date should be after from date')"))
            .first();

        this.leaveBalance = page.getByText('Leave Balance', { exact: true })
            .or(page.locator('.orangehrm-leave-balance-text'))
            .or(page.locator('p:has-text("Leave Balance")'))
            .or(page.locator(':text-is("Leave Balance")'))
            .first();

        this.leaveTypeDropdown = new SelectDropdownComponent(page, this.LeaveType);
        this.topNav = new TopNavComponent(page);
    }

    // ==========================================
    // Auto-Healing Candidate Getters
    // ==========================================

    get leaveMenuCandidates(): Array<() => Locator> {
        return [
            () => this.Leave,
            () => this.page.getByRole('link', { name: 'Leave', exact: true }),
            () => this.page.locator('a.oxd-main-menu-item.active'),
            () => this.page.locator('a.oxd-main-menu-item.active:visible'),
            () => this.page.locator('a').filter({ hasText: 'Leave' }).first(),
            () => this.page.locator('a').filter({ hasText: 'Leave' }).last(),
            () => this.page.locator("//a[@class='oxd-main-menu-item active']"),
            () => this.page.locator('.oxd-main-menu-item.active'),
            () => this.page.locator("a[href*='viewLeaveModule']"),
        ];
    }

    get applyTabCandidates(): Array<() => Locator> {
        return [
            () => this.Apply,
            () => this.page.getByRole('link', { name: 'Apply' }),
            () => this.page.getByRole('link', { name: /Apply/i }),
            () => this.page.getByText('Apply', { exact: true }),
            () => this.page.getByText('Apply').first(),
            () => this.page.locator('a:has-text("Apply")').first(),
            () => this.page.locator(':text-is("Apply")').first(),
            () => this.page.locator(':text("Apply")').first(),
            () => this.page.locator('a').filter({ hasText: 'Apply' }).first(),
            () => this.page.locator('a').filter({ hasText: 'Apply' }).last(),
            () => this.page.locator('.oxd-topbar-body-nav-tab-item').filter({ hasText: 'Apply' }).first(),
        ];
    }

    get leaveTypeCandidates(): Array<() => Locator> {
        return [
            () => this.LeaveType,
            () => this.page.getByText('-- Select --', { exact: true }),
            () => this.page.getByText('-- Select --').first(),
            () => this.page.locator(':text-is("-- Select --")').first(),
            () => this.page.locator(':text("-- Select --")').first(),
            () => this.page.locator('div').filter({ hasText: '-- Select --' }).first(),
            () => this.page.locator('div').filter({ hasText: '-- Select --' }).last(),
            () => this.page.locator("div[class='oxd-select-text oxd-select-text--active oxd-select-text--error'] div[class='oxd-select-text-input']"),
            () => this.page.locator('div.oxd-select-text.oxd-select-text--active.oxd-select-text--error').locator('div').nth(0),
            () => this.page.locator('.oxd-input-group').filter({ hasText: 'Leave Type' }).locator('.oxd-select-text').first(),
            () => this.page.locator('div.oxd-select-text-input:visible').first(),
            () => this.page.locator('div.oxd-select-text-input').first(),
            () => this.page.locator('.oxd-select-text-input').first(),
            () => this.page.locator('div.oxd-select-text.oxd-select-text--active').first(),
            () => this.page.locator("//div[contains(text(),'-- Select --')]").first(),
            () => this.page.locator('div:has-text("-- Select --")').first(),
            () => this.page.locator(':has-text("-- Select --")').first(),
            () => this.page.locator('i.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').first(),
            () => this.page.locator('i.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow:visible').first(),
            () => this.page.locator("//i[@class='oxd-icon bi-caret-down-fill oxd-select-text--arrow']").first(),
            () => this.page.locator(".oxd-icon.bi-caret-down-fill.oxd-select-text--arrow").first(),
        ];
    }

    get fromDateCandidates(): Array<() => Locator> {
        return [
            () => this.FromDate,
            () => this.page.locator('.oxd-input-group').filter({ hasText: 'From Date' }).locator('input').first(),
            () => this.page.locator('input[placeholder="yyyy-mm-dd"]').first(),
            () => this.page.locator("/html[1]/body[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/form[1]/div[2]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/i[1]").locator('..').locator('input'),
            () => this.page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > i:nth-child(2)").locator('..').locator('input'),
            () => this.page.locator('i.oxd-icon.bi-calendar.oxd-date-input-icon').first().locator('..').locator('input'),
            () => this.page.locator('i.oxd-icon.bi-calendar.oxd-date-input-icon:visible').first().locator('..').locator('input'),
        ];
    }

    get fromDateIconCandidates(): Array<() => Locator> {
        return [
            () => this.page.locator('i.oxd-icon.bi-calendar.oxd-date-input-icon').first(),
            () => this.page.locator('i.oxd-icon.bi-calendar.oxd-date-input-icon:visible').first(),
            () => this.page.locator("/html[1]/body[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/form[1]/div[2]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/i[1]"),
            () => this.page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > i:nth-child(2)"),
        ];
    }

    get toDateCandidates(): Array<() => Locator> {
        return [
            () => this.ToDate,
            () => this.page.locator('.oxd-input-group').filter({ hasText: 'To Date' }).locator('input').first(),
            () => this.page.locator('input[placeholder="yyyy-mm-dd"]').nth(1),
            () => this.page.locator("/html[1]/body[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/form[1]/div[2]/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/i[1]").locator('..').locator('input'),
            () => this.page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > i:nth-child(2)").locator('..').locator('input'),
            () => this.page.locator('i.oxd-icon.bi-calendar.oxd-date-input-icon').nth(1).locator('..').locator('input'),
            () => this.page.locator('i.oxd-icon.bi-calendar.oxd-date-input-icon:visible').nth(1).locator('..').locator('input'),
        ];
    }

    get toDateIconCandidates(): Array<() => Locator> {
        return [
            () => this.page.locator('i.oxd-icon.bi-calendar.oxd-date-input-icon').nth(1),
            () => this.page.locator('i.oxd-icon.bi-calendar.oxd-date-input-icon:visible').nth(1),
            () => this.page.locator("/html[1]/body[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/form[1]/div[2]/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/i[1]"),
            () => this.page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > i:nth-child(2)"),
        ];
    }

    get commentsCandidates(): Array<() => Locator> {
        return [
            () => this.Comments,
            () => this.page.locator('textarea.oxd-textarea.oxd-textarea--active.oxd-textarea--resize-vertical'),
            () => this.page.locator('textarea.oxd-textarea.oxd-textarea--active.oxd-textarea--resize-vertical:visible'),
            () => this.page.locator('textarea:visible').first(),
            () => this.page.locator("//textarea[@class='oxd-textarea oxd-textarea--active oxd-textarea--resize-vertical']"),
            () => this.page.locator(".oxd-textarea.oxd-textarea--active.oxd-textarea--resize-vertical"),
            () => this.page.locator('textarea').first(),
            () => this.page.getByRole('textbox').last(),
        ];
    }

    get applyLeaveButtonCandidates(): Array<() => Locator> {
        return [
            () => this.ApplyLeave,
            () => this.page.getByRole('button', { name: 'Apply' }),
            () => this.page.getByRole('button', { name: /Apply/i }),
            () => this.page.locator('button:has-text("Apply")').first(),
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space'),
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space:visible'),
            () => this.page.locator('button').filter({ hasText: 'Apply' }).first(),
            () => this.page.locator('button').filter({ hasText: 'Apply' }).last(),
            () => this.page.locator("//button[normalize-space()='Apply']"),
            () => this.page.locator("button[type='submit']").first(),
            () => this.page.getByRole('button').filter({ hasText: 'Apply' }).first(),
            () => this.page.getByText('Apply', { exact: true }),
            () => this.page.locator(':text-is("Apply")').first(),
            () => this.page.locator(':text("Apply")').first(),
            () => this.page.locator('button:visible').filter({ hasText: 'Apply' }).first(),
        ];
    }

    get successMessageCandidates(): Array<() => Locator> {
        return [
            () => this.successMessage,
            () => this.page.locator('p.oxd-text--toast-message:has-text("Successfully Saved")'),
            () => this.page.getByText('Successfully Saved', { exact: true }),
            () => this.page.getByText('Successfully Saved').first(),
            () => this.page.locator('p:has-text("Successfully Saved")').first(),
            () => this.page.locator(':text-is("Successfully Saved")').first(),
            () => this.page.locator(':text("Successfully Saved")').first(),
            () => this.page.locator('p.oxd-text.oxd-text--p.oxd-text--toast-message.oxd-toast-content-text').filter({ hasText: 'Successfully Saved' }).first(),
            () => this.page.locator('p.oxd-text.oxd-text--p.oxd-text--toast-message.oxd-toast-content-text:visible').filter({ hasText: 'Successfully Saved' }).first(),
            () => this.page.locator('p').filter({ hasText: 'Successfully Saved' }).first(),
            () => this.page.locator('p').filter({ hasText: 'Successfully Saved' }).last(),
            () => this.page.locator('div.oxd-toast-content.oxd-toast-content--success').locator('p').nth(1),
            () => this.page.locator("//p[@class='oxd-text oxd-text--p oxd-text--toast-message oxd-toast-content-text']"),
            () => this.page.locator(".oxd-text.oxd-text--p.oxd-text--toast-message.oxd-toast-content-text"),
            () => this.page.locator('.oxd-toast--success').locator('p.oxd-text--toast-message').first(),
        ];
    }

    get errorMessageCandidates(): Array<() => Locator> {
        return [
            () => this.errorMessage,
            () => this.page.locator('p.oxd-text--toast-message:has-text("Failed to Submit")').first(),
            () => this.page.getByText('Failed to Submit: No Working Days Selected', { exact: true }),
            () => this.page.locator('.oxd-toast--warn').locator('p.oxd-text--toast-message').first(),
            () => this.page.locator('div.oxd-toast.oxd-toast--warn.oxd-toast-container--toast').locator('p.oxd-text--toast-message').first(),
            () => this.page.locator(".oxd-toast.oxd-toast--warn.oxd-toast-container--toast").locator('p.oxd-text--toast-message').first(),
            () => this.page.locator('div.oxd-toast--warn').locator('p.oxd-text--toast-message').first(),
        ];
    }

    get dateValidationCandidates(): Array<() => Locator> {
        return [
            () => this.dateValidationMessage,
            () => this.page.getByText('To date should be after from date', { exact: true }),
            () => this.page.getByText('To date should be after from date'),
            () => this.page.locator('.oxd-input-field-error-message').filter({ hasText: 'To date should be after from date' }).first(),
            () => this.page.locator('.oxd-input-group__message').filter({ hasText: 'To date should be after from date' }).first(),
            () => this.page.locator("span:has-text('To date should be after from date')").first(),
            () => this.page.locator(':text-is("To date should be after from date")').first(),
        ];
    }

    get leaveBalanceCandidates(): Array<() => Locator> {
        return [
            () => this.leaveBalance,
            () => this.page.getByText('Leave Balance', { exact: true }),
            () => this.page.getByText('Leave Balance'),
            () => this.page.locator('p:has-text("Leave Balance")').first(),
            () => this.page.locator('.orangehrm-leave-balance-text').first(),
            () => this.page.locator(':text-is("Leave Balance")').first(),
        ];
    }

    // ==========================================
    // Page Actions
    // ==========================================

    async clickLeave(): Promise<void> {
        console.log('Clicking Leave...');
        try {
            const leaveLink = await healLocator(this.leaveMenuCandidates);
            await this.click(leaveLink);
        } catch {
            await this.topNav.goTo('Leave');
        }
        console.log('Leave clicked');
    }

    async clickApply(): Promise<void> {
        console.log('Clicking Apply...');
        try {
            const applyTab = await healLocator(this.applyTabCandidates);
            await this.waitForElement(applyTab);
            await this.click(applyTab);
        } catch {
            await this.page.goto('/web/index.php/leave/applyLeave');
        }

        // Wait until Apply Leave form is loaded
        const leaveType = await healLocator(this.leaveTypeCandidates);
        await this.waitForElement(leaveType);
        console.log('Apply page loaded');
    }

    async selectLeaveType(leaveType: string): Promise<void> {
        console.log(`Selecting Leave Type: ${leaveType}`);
        try {
            const trigger = await healLocator(this.leaveTypeCandidates);
            await trigger.click();
            const option = this.page.getByRole('option', { name: leaveType })
                .or(this.page.getByText(leaveType, { exact: true }))
                .or(this.page.locator('.oxd-select-dropdown').getByText(leaveType))
                .first();
            await option.waitFor({ state: 'visible', timeout: 10000 });
            await option.click();
        } catch {
            await this.leaveTypeDropdown.selectByText(leaveType);
        }
        console.log(`Leave Type selected: ${leaveType}`);
    }

    async AddLeaveDetails(
        fromDate: string,
        toDate: string,
        comment: string
    ): Promise<void> {
        // Enter From Date
        const fromDateField = await healLocator(this.fromDateCandidates);
        await this.waitForElement(fromDateField);
        await fromDateField.fill('');
        await this.fill(fromDateField, fromDate);
        await this.page.waitForTimeout(2000);

        // Verify From Date
        await expect(fromDateField).toHaveValue(fromDate);

        // Enter To Date
        const toDateField = await healLocator(this.toDateCandidates);
        await this.waitForElement(toDateField);
        await toDateField.fill('');
        await toDateField.fill(toDate);
        await this.page.waitForTimeout(2000);

        // Verify To Date
        await expect(toDateField).toHaveValue(toDate);

        // Enter Comment
        const commentsField = await healLocator(this.commentsCandidates);
        await this.waitForElement(commentsField);
        await commentsField.fill('');
        await this.fill(commentsField, comment);
        await this.page.waitForTimeout(2000);

        // Click Apply Leave
        const applyBtn = await healLocator(this.applyLeaveButtonCandidates);
        await this.waitForElement(applyBtn);
        await this.click(applyBtn);
    }
}