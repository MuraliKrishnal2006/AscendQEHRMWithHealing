import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * EmployeeDetailsPage — models the PIM > Employee Details workflow
 * (Personal Details, Contact Details, Job Details, Attachments).
 *
 * Uses Playwright's prioritized locator strategy:
 *  1. getByRole, getByText, getByLabel, getByPlaceholder, getByAltText, getByTitle, getByTestId
 *  2. CSS selectors where custom components lack semantic ARIA roles
 *  3. XPath only if CSS is not feasible (0 XPath used)
 */
export class EmployeeDetailsPage extends BasePage {
    // --- Navigation Tabs ---
    readonly personalDetailsTab: Locator;
    readonly contactDetailsTab: Locator;
    readonly jobTab: Locator;

    // --- Personal Details Section ---
    readonly nicknameInput: Locator;
    readonly maritalStatusDropdown: Locator;
    readonly maritalStatusOptions: Locator;
    readonly dateOfBirthInput: Locator;
    readonly dateOfBirthCalendarIcon: Locator;
    readonly personalDetailsSaveButton: Locator;

    // --- Contact Details Section ---
    readonly mobileInput: Locator;
    readonly workEmailInput: Locator;
    readonly contactDetailsSaveButton: Locator;
    readonly workEmailErrorMessage: Locator;

    // --- Job Section ---
    readonly jobTitleDropdown: Locator;
    readonly subUnitDropdown: Locator;
    readonly employmentStatusDropdown: Locator;
    readonly jobSaveButton: Locator;

    // --- Attachments Section ---
    readonly attachmentsSection: Locator;
    readonly addAttachmentButton: Locator;
    readonly fileInput: Locator;
    readonly fileBrowseButton: Locator;
    readonly attachmentCommentInput: Locator;
    readonly attachmentSaveButton: Locator;

    // --- Shared Dropdown Options & Notification Toast ---
    readonly selectDropdownOptions: Locator;
    readonly successToast: Locator;

    constructor(page: Page) {
        super(page);

        // Navigation Tabs (Priority 1: getByRole)
        this.personalDetailsTab = page.getByRole('link', { name: 'Personal Details' });
        this.contactDetailsTab = page.getByRole('link', { name: 'Contact Details' });
        this.jobTab = page.getByRole('link', { name: 'Job' });

        // Personal Details Form Controls (Priority 1: getByRole / getByText + Priority 2: CSS scoping)
        this.nicknameInput = page.locator('.oxd-input-group').filter({ has: page.getByText('Nickname', { exact: true }) }).locator('.oxd-input');
        this.maritalStatusDropdown = page.locator('.oxd-input-group').filter({ has: page.getByText('Marital Status', { exact: true }) }).locator('.oxd-select-text');
        this.maritalStatusOptions = page.getByRole('listbox').getByRole('option').or(page.locator('.oxd-select-dropdown div'));
        this.dateOfBirthInput = page.locator('.oxd-input-group').filter({ has: page.getByText('Date of Birth', { exact: true }) }).locator('.oxd-input').first();
        this.dateOfBirthCalendarIcon = page.locator('.oxd-input-group').filter({ has: page.getByText('Date of Birth', { exact: true }) }).locator('.oxd-date-input-icon');
        this.personalDetailsSaveButton = page.locator('form').filter({ has: page.getByText('Personal Details') }).getByRole('button', { name: 'Save' }).or(
            page.locator('.orangehrm-horizontal-padding > form').first().getByRole('button', { name: 'Save' })
        );

        // Contact Details Form Controls
        this.mobileInput = page.locator('.oxd-input-group').filter({ has: page.getByText('Mobile', { exact: true }) }).locator('.oxd-input');
        this.workEmailInput = page.locator('.oxd-input-group').filter({ has: page.getByText('Work Email', { exact: true }) }).locator('.oxd-input');
        this.contactDetailsSaveButton = page.locator('form').filter({ has: page.getByText('Contact Details') }).getByRole('button', { name: 'Save' }).or(
            page.locator('.orangehrm-horizontal-padding > form').first().getByRole('button', { name: 'Save' })
        );
        this.workEmailErrorMessage = page.locator('.oxd-input-group').filter({ has: page.getByText('Work Email', { exact: true }) }).locator('.oxd-input-field-error-message');

        // Job Form Controls
        this.jobTitleDropdown = page.locator('.oxd-input-group').filter({ has: page.getByText('Job Title', { exact: true }) }).locator('.oxd-select-text');
        this.subUnitDropdown = page.locator('.oxd-input-group').filter({ has: page.getByText('Sub Unit', { exact: true }) }).locator('.oxd-select-text');
        this.employmentStatusDropdown = page.locator('.oxd-input-group').filter({ has: page.getByText('Employment Status', { exact: true }) }).locator('.oxd-select-text');
        this.jobSaveButton = page.locator('form').filter({ has: page.getByText('Job Details') }).getByRole('button', { name: 'Save' }).or(
            page.locator('.orangehrm-horizontal-padding > form').first().getByRole('button', { name: 'Save' })
        ).or(
            page.getByRole('button', { name: 'Save' }).first()
        );

        // Attachments Section Controls (Priority 1: getByRole / getByPlaceholder / getByText)
        this.attachmentsSection = page.getByRole('heading', { name: 'Attachments' }).or(
            page.locator('.orangehrm-attachment-header')
        );
        this.addAttachmentButton = page.locator('.orangehrm-attachment-header').getByRole('button', { name: 'Add' }).or(
            page.getByRole('button', { name: 'Add' })
        );
        this.fileInput = page.locator('input[type="file"]');
        this.fileBrowseButton = page.getByText('Browse').or(page.locator('.oxd-file-button'));
        this.attachmentCommentInput = page.getByPlaceholder('Type comment here').or(
            page.locator('.oxd-input-group').filter({ has: page.getByText('Comment', { exact: true }) }).locator('textarea')
        );
        this.attachmentSaveButton = page.locator('form').filter({ has: page.getByText('Add Attachment') }).getByRole('button', { name: 'Save' }).or(
            page.locator('.orangehrm-attachment-header ~ form').getByRole('button', { name: 'Save' })
        ).or(
            page.getByRole('button', { name: 'Save' }).last()
        );

        // Global dropdown option list & toast popup (Priority 1: getByRole / CSS)
        this.selectDropdownOptions = page.getByRole('listbox').getByRole('option').or(
            page.locator('.oxd-select-dropdown span, .oxd-select-dropdown div')
        );
        this.successToast = page.getByRole('alert').or(page.locator('.oxd-toast--success'));
    }

    /**
     * Helper to select an option from an OrangeHRM/AscendqeHRM custom dropdown
     * Priority: getByRole('option') -> getByText -> CSS fallback
     */
    async selectDropdownOption(dropdownOrLabel: Locator | string, optionText: string): Promise<void> {
        const dropdown = typeof dropdownOrLabel === 'string'
            ? this.page.locator('.oxd-input-group').filter({ has: this.page.getByText(dropdownOrLabel, { exact: true }) }).locator('.oxd-select-text')
            : dropdownOrLabel;

        await this.waitForElement(dropdown);
        await this.click(dropdown);

        // Match option text inside dropdown listbox
        const option = this.page.getByRole('option', { name: optionText, exact: false }).or(
            this.page.getByRole('listbox').getByText(optionText, { exact: false })
        ).or(
            this.page.locator('.oxd-select-dropdown').getByText(optionText, { exact: false })
        ).first();

        await this.waitForElement(option);
        await option.click();
    }

    // ==========================================
    // 1. Personal Details Actions
    // ==========================================

    /**
     * Navigates to Personal Details tab
     */
    async clickPersonalDetailsTab(): Promise<void> {
        await this.waitForElement(this.personalDetailsTab);
        await this.click(this.personalDetailsTab);
    }

    /**
     * Fills Nickname, selects Marital Status, fills Date of Birth, and saves Personal Details
     */
    async updatePersonalDetails(nickname: string, maritalStatus: string, dateOfBirth: string): Promise<void> {
        // Nickname
        await this.waitForElement(this.nicknameInput);
        await this.fill(this.nicknameInput, nickname);

        // Marital Status Dropdown
        await this.selectDropdownOption(this.maritalStatusDropdown, maritalStatus);

        // Date of Birth input field
        await this.waitForElement(this.dateOfBirthInput);
        await this.click(this.dateOfBirthInput);
        await this.dateOfBirthInput.fill('');
        await this.dateOfBirthInput.fill(dateOfBirth);

        // Save
        await this.click(this.personalDetailsSaveButton);
    }

    // ==========================================
    // 2. Contact Details Actions
    // ==========================================

    /**
     * Navigates to Contact Details tab
     */
    async clickContactDetailsTab(): Promise<void> {
        await this.waitForElement(this.contactDetailsTab);
        await this.click(this.contactDetailsTab);
    }

    /**
     * Fills Mobile and Work Email, then saves
     */
    async fillContactDetails(mobile: string, workEmail: string): Promise<void> {
        await this.waitForElement(this.mobileInput);
        await this.fill(this.mobileInput, mobile);

        await this.waitForElement(this.workEmailInput);
        await this.fill(this.workEmailInput, workEmail);

        await this.click(this.contactDetailsSaveButton);
    }

    /**
     * Enters an invalid email and attempts to save to trigger validation error
     */
    async testInvalidWorkEmail(invalidEmail: string): Promise<void> {
        await this.waitForElement(this.workEmailInput);
        // Clear input and type invalid email
        await this.workEmailInput.fill('');
        await this.workEmailInput.fill(invalidEmail);
        await this.click(this.contactDetailsSaveButton);
    }

    /**
     * Retrieves the error message under Work Email field
     */
    async getWorkEmailValidationMessage(): Promise<string> {
        await this.waitForElement(this.workEmailErrorMessage);
        return await this.getText(this.workEmailErrorMessage);
    }

    /**
     * Corrects the work email and saves successfully
     */
    async correctWorkEmailAndSave(validEmail: string): Promise<void> {
        await this.waitForElement(this.workEmailInput);
        await this.workEmailInput.fill('');
        await this.workEmailInput.fill(validEmail);
        await this.click(this.contactDetailsSaveButton);
    }

    // ==========================================
    // 3. Job Details Actions
    // ==========================================

    /**
     * Navigates to Job tab
     */
    async clickJobTab(): Promise<void> {
        await this.waitForElement(this.jobTab);
        await this.click(this.jobTab);
    }

    /**
     * Selects Job Title, Sub Unit, Employment Status from dropdowns and saves
     */
    async updateJobDetails(jobTitle?: string, subUnit?: string, employmentStatus?: string): Promise<void> {
        // Job Title Dropdown
        if (jobTitle) {
            await this.selectDropdownOption(this.jobTitleDropdown, jobTitle);
        }

        // Sub Unit Dropdown
        if (subUnit) {
            await this.selectDropdownOption(this.subUnitDropdown, subUnit);
        }

        // Employment Status Dropdown
        if (employmentStatus) {
            await this.selectDropdownOption(this.employmentStatusDropdown, employmentStatus);
        }

        // Save
        await this.click(this.jobSaveButton);
    }

    /**
     * Selects Employment Status from dropdown and saves
     */
    async selectEmploymentStatus(employmentStatus: string): Promise<void> {
        await this.selectDropdownOption(this.employmentStatusDropdown, employmentStatus);
    }

    /**
     * Clicks the Save button on Job form
     */
    async clickJobSave(): Promise<void> {
        await this.click(this.jobSaveButton);
    }

    // ==========================================
    // 4. Attachments Actions
    // ==========================================

    /**
     * Adds an attachment by clicking '+ Add', uploading the specified file,
     * typing the comment, and clicking Save.
     */
    async addAttachment(filePath: string, comment: string): Promise<void> {
        await this.waitForElement(this.addAttachmentButton);
        await this.click(this.addAttachmentButton);

        // Upload file via file input element
        await this.fileInput.setInputFiles(filePath);

        // Fill comment
        await this.waitForElement(this.attachmentCommentInput);
        await this.fill(this.attachmentCommentInput, comment);

        // Save attachment
        await this.click(this.attachmentSaveButton);
    }

    /**
     * Scrolls the page to make the Attachments section visible
     */
    async scrollToAttachments(): Promise<void> {
        await this.attachmentsSection.scrollIntoViewIfNeeded();
    }
}
