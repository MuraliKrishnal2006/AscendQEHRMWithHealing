import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { healLocator } from '../utils/Locator-healing-utility';

/**
 * EmployeeDetailsPage — models the PIM > Employee Details workflow
 * (Personal Details, Contact Details, Job Details, Attachments).
 *
 * Implements multi-candidate auto-healing locators via healLocator():
 *  1. getByRole, getByText, getByLabel, getByPlaceholder
 *  2. Scoped CSS component selectors
 *  3. Fallback XPath / DOM tree paths
 */
export class EmployeeDetailsPage extends BasePage {
    // --- Navigation Tabs ---
    readonly personalDetailsTab: Locator;
    readonly contactDetailsTab: Locator;
    readonly jobTab: Locator;

    // --- Personal Details Section ---
    readonly firstNameInput: Locator;
    readonly middleNameInput: Locator;
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

        // Navigation Tabs (Chained candidates for assertions with .first() to prevent strict mode violations)
        this.personalDetailsTab = page.getByRole('link', { name: 'Personal Details' })
            .or(page.getByRole('link', { name: /Personal Details/i }))
            .or(page.locator('a:has-text("Personal Details")'))
            .or(page.locator('//a[contains(@href, "viewPersonalDetails")]')).first();

        this.contactDetailsTab = page.getByRole('link', { name: 'Contact Details' })
            .or(page.getByRole('link', { name: /Contact Details/i }))
            .or(page.locator('a:has-text("Contact Details")'))
            .or(page.locator('//a[contains(@href, "contactDetails")]')).first();

        this.jobTab = page.getByRole('link', { name: 'Job' })
            .or(page.getByRole('link', { name: /Job/i }))
            .or(page.locator('a:has-text("Job")'))
            .or(page.locator('//a[contains(@href, "viewJobDetails")]')).first();

        // Personal Details Form Controls
        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' })
            .or(page.getByRole('textbox', { name: /First Name/i }))
            .or(page.getByPlaceholder('First Name'))
            .or(page.locator('[name="firstName"]'))
            .or(page.locator('input[name="firstName"]'))
            .or(page.locator('input.oxd-input.oxd-input--active.orangehrm-firstname'));

        this.middleNameInput = page.getByPlaceholder('Middle Name', { exact: true })
            .or(page.locator('[name="middleName"]'))
            .or(page.locator('input[name="middleName"]'))
            .or(page.locator('input.oxd-input.oxd-input--active.orangehrm-middlename'));

        this.nicknameInput = page.locator('.oxd-input-group').filter({ has: page.getByText('Nickname', { exact: true }) }).locator('.oxd-input')
            .or(page.locator("//div[@class='orangehrm-horizontal-padding orangehrm-vertical-padding']//div[1]//div[2]//div[1]//div[1]//div[2]//input[1]"))
            .or(page.locator("div[class='orangehrm-horizontal-padding orangehrm-vertical-padding'] div:nth-child(1) div:nth-child(2) div:nth-child(1) div:nth-child(1) div:nth-child(2) input:nth-child(1)"));

        this.maritalStatusDropdown = page.locator('.oxd-input-group').filter({ has: page.getByText('Marital Status', { exact: true }) }).locator('.oxd-select-text')
            .or(page.locator("//div[6]//div[1]//div[2]//div[1]//div[1]//div[2]//i[1]"))
            .or(page.locator("div:nth-child(6) div:nth-child(1) div:nth-child(2) div:nth-child(1) div:nth-child(1) div:nth-child(2) i:nth-child(1)"))
            .or(page.locator('.oxd-input-group').filter({ has: page.getByText('Marital Status', { exact: true }) }).locator('i.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow'));

        this.maritalStatusOptions = page.getByRole('listbox').getByRole('option').or(page.locator('.oxd-select-dropdown div'));
        this.dateOfBirthInput = page.locator('.oxd-input-group').filter({ has: page.getByText('Date of Birth', { exact: true }) }).locator('.oxd-input').first()
            .or(page.locator('//label[text()="Date of Birth"]/../following-sibling::div//input')).first();
        this.dateOfBirthCalendarIcon = page.locator('.oxd-input-group').filter({ has: page.getByText('Date of Birth', { exact: true }) }).locator('.oxd-date-input-icon');

        this.personalDetailsSaveButton = page.locator('form').filter({ has: page.getByText('Personal Details') }).getByRole('button', { name: 'Save' })
            .or(page.locator('.orangehrm-horizontal-padding > form').first().getByRole('button', { name: 'Save' }))
            .or(page.getByRole('button', { name: 'Save' }))
            .or(page.locator('button:has-text("Save")')).first();

        // Contact Details Form Controls
        this.mobileInput = page.locator('.oxd-input-group').filter({ has: page.getByText('Mobile', { exact: true }) }).locator('.oxd-input')
            .or(page.locator("//div[@class='orangehrm-edit-employee-content']//div[2]//div[1]//div[2]//div[1]//div[2]//input[1]")).first();

        this.workEmailInput = page.locator('.oxd-input-group').filter({ has: page.getByText('Work Email', { exact: true }) }).locator('.oxd-input')
            .or(page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > form:nth-child(3) > div:nth-child(9) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)")).first();

        this.contactDetailsSaveButton = page.locator('form').filter({ has: page.getByText('Contact Details') }).getByRole('button', { name: 'Save' })
            .or(page.locator('.orangehrm-horizontal-padding > form').first().getByRole('button', { name: 'Save' }))
            .or(page.getByRole('button', { name: 'Save' }))
            .or(page.locator('button:has-text("Save")')).first();

        this.workEmailErrorMessage = page.locator('.oxd-input-group').filter({ has: page.getByText('Work Email', { exact: true }) }).locator('.oxd-input-field-error-message')
            .or(page.locator('.oxd-input-field-error-message')).first();

        // Job Form Controls
        this.jobTitleDropdown = page.locator('.oxd-input-group').filter({ has: page.getByText('Job Title', { exact: true }) }).locator('.oxd-select-text').first();
        this.subUnitDropdown = page.locator('.oxd-input-group').filter({ has: page.getByText('Sub Unit', { exact: true }) }).locator('.oxd-select-text').first();
        this.employmentStatusDropdown = page.locator('.oxd-input-group').filter({ has: page.getByText('Employment Status', { exact: true }) }).locator('.oxd-select-text').first();
        this.jobSaveButton = page.locator('form').filter({ has: page.getByText('Job Details') }).getByRole('button', { name: 'Save' })
            .or(page.locator('.orangehrm-horizontal-padding > form').first().getByRole('button', { name: 'Save' }))
            .or(page.getByRole('button', { name: 'Save' }).first())
            .or(page.locator('button:has-text("Save")')).first();

        // Attachments Section Controls
        this.attachmentsSection = page.getByRole('heading', { name: 'Attachments' }).first()
            .or(page.locator('.orangehrm-attachment-header').first());

        this.addAttachmentButton = page.locator('.orangehrm-attachment-header').getByRole('button', { name: 'Add' })
            .or(page.getByRole('button', { name: 'Add' }))
            .or(page.getByRole('button', { name: /Add/i }))
            .or(page.getByText('Add', { exact: true }))
            .or(page.locator('button:has-text("Add")')).first();

        this.fileInput = page.locator('input[type="file"]').or(page.locator('.oxd-file-input')).first();
        this.fileBrowseButton = page.getByText('Browse').or(page.locator('.oxd-file-button')).first();

        this.attachmentCommentInput = page.getByPlaceholder('Type comment here')
            .or(page.locator('.oxd-input-group').filter({ has: page.getByText('Comment', { exact: true }) }).locator('textarea'))
            .or(page.locator('textarea.oxd-textarea')).first();

        this.attachmentSaveButton = page.locator('form').filter({ has: page.getByText('Add Attachment') }).getByRole('button', { name: 'Save' })
            .or(page.locator('.orangehrm-attachment-header ~ form').getByRole('button', { name: 'Save' }))
            .or(page.getByRole('button', { name: 'Save' }).last())
            .or(page.locator('button:has-text("Save")').last()).first();

        // Global dropdown option list & toast popup
        this.selectDropdownOptions = page.getByRole('listbox').getByRole('option').or(
            page.locator('.oxd-select-dropdown span, .oxd-select-dropdown div')
        );
        this.successToast = page.getByRole('alert').or(page.locator('.oxd-toast--success'));
    }

    // ==========================================
    // Auto-Healing Dynamic Candidate Resolvers
    // ==========================================

    async getPersonalDetailsTab(): Promise<Locator> {
        return await healLocator([
            () => this.page.getByRole('link', { name: 'Personal Details' }),
            () => this.page.getByRole('link', { name: /Personal Details/i }),
            () => this.page.locator('a:has-text("Personal Details")'),
            () => this.page.locator(':text-is("Personal Details")'),
            () => this.page.locator('.orangehrm-tabs a').filter({ hasText: 'Personal Details' }),
            () => this.page.locator('//a[contains(@href, "viewPersonalDetails")]'),
        ]);
    }

    async getContactDetailsTab(): Promise<Locator> {
        return await healLocator([
            () => this.page.getByRole('link', { name: 'Contact Details' }),
            () => this.page.getByRole('link', { name: /Contact Details/i }),
            () => this.page.getByText('Contact Details', { exact: true }),
            () => this.page.getByText('Contact Details'),
            () => this.page.locator('a:has-text("Contact Details")'),
            () => this.page.locator(':text-is("Contact Details")'),
            () => this.page.locator(':text("Contact Details")'),
            () => this.page.locator('//a[contains(@href, "contactDetails")]'),
        ]);
    }

    async getJobTab(): Promise<Locator> {
        return await healLocator([
            () => this.page.getByRole('link', { name: 'Job' }),
            () => this.page.getByRole('link', { name: /Job/i }),
            () => this.page.locator('a:has-text("Job")'),
            () => this.page.locator(':text-is("Job")'),
            () => this.page.locator('//a[contains(@href, "viewJobDetails")]'),
        ]);
    }

    async getFirstNameInput(): Promise<Locator> {
        return await healLocator([
            () => this.page.getByRole('textbox', { name: 'First Name' }),
            () => this.page.getByRole('textbox', { name: /First Name/i }),
            () => this.page.getByPlaceholder('First Name'),
            () => this.page.getByPlaceholder('First Name', { exact: true }),
            () => this.page.locator('[name="firstName"]'),
            () => this.page.locator('input[name="firstName"]'),
            () => this.page.locator('input.oxd-input.oxd-input--active.orangehrm-firstname'),
        ]);
    }

    async getMiddleNameInput(): Promise<Locator> {
        return await healLocator([
            () => this.page.getByPlaceholder('Middle Name', { exact: true }),
            () => this.page.locator('[name="middleName"]'),
            () => this.page.locator('input[name="middleName"]'),
            () => this.page.locator('input.oxd-input.oxd-input--active.orangehrm-middlename'),
        ]);
    }

    async getNicknameInput(): Promise<Locator> {
        return await healLocator([
            () => this.page.locator('.oxd-input-group').filter({ has: this.page.getByText('Nickname', { exact: true }) }).locator('.oxd-input'),
            () => this.page.locator("//div[@class='orangehrm-horizontal-padding orangehrm-vertical-padding']//div[1]//div[2]//div[1]//div[1]//div[2]//input[1]"),
            () => this.page.locator("div[class='orangehrm-horizontal-padding orangehrm-vertical-padding'] div:nth-child(1) div:nth-child(2) div:nth-child(1) div:nth-child(1) div:nth-child(2) input:nth-child(1)"),
            () => this.page.locator('label:has-text("Nickname")').locator('..').locator('..').locator('input'),
        ]);
    }

    async getMaritalStatusDropdown(): Promise<Locator> {
        return await healLocator([
            () => this.page.locator('.oxd-input-group').filter({ has: this.page.getByText('Marital Status', { exact: true }) }).locator('.oxd-select-text'),
            () => this.page.locator("//div[6]//div[1]//div[2]//div[1]//div[1]//div[2]//i[1]"),
            () => this.page.locator("div:nth-child(6) div:nth-child(1) div:nth-child(2) div:nth-child(1) div:nth-child(1) div:nth-child(2) i:nth-child(1)"),
            () => this.page.locator('.oxd-input-group').filter({ has: this.page.getByText('Marital Status', { exact: true }) }).locator('i.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow'),
            () => this.page.locator('label:has-text("Marital Status")').locator('..').locator('..').locator('.oxd-select-wrapper'),
        ]);
    }

    async getDateOfBirthInput(): Promise<Locator> {
        return await healLocator([
            () => this.page.locator('.oxd-input-group').filter({ has: this.page.getByText('Date of Birth', { exact: true }) }).locator('.oxd-input').first(),
            () => this.page.locator('//label[text()="Date of Birth"]/../following-sibling::div//input').first(),
            () => this.page.locator('label:has-text("Date of Birth")').locator('..').locator('..').locator('input').first(),
        ]);
    }

    async getPersonalDetailsSaveButton(): Promise<Locator> {
        return await healLocator([
            () => this.page.locator('.orangehrm-horizontal-padding > form').first().getByRole('button', { name: 'Save' }),
            () => this.page.locator('form').filter({ has: this.page.getByRole('button', { name: 'Save' }) }).first().getByRole('button', { name: 'Save' }),
            () => this.page.getByRole('button', { name: 'Save' }).first(),
            () => this.page.getByRole('button', { name: /Save/i }).first(),
            () => this.page.getByText('Save', { exact: true }).first(),
            () => this.page.locator('button:has-text("Save")').first(),
            () => this.page.locator(':text-is("Save")').first(),
        ]);
    }

    async getMobileInput(): Promise<Locator> {
        return await healLocator([
            () => this.page.locator('.oxd-input-group').filter({ has: this.page.getByText('Mobile', { exact: true }) }).locator('.oxd-input'),
            () => this.page.locator("//div[@class='orangehrm-edit-employee-content']//div[2]//div[1]//div[2]//div[1]//div[2]//input[1]"),
            () => this.page.locator('label:has-text("Mobile")').locator('..').locator('..').locator('input'),
            () => this.page.locator('//label[text()="Mobile"]/../following-sibling::div//input'),
        ]);
    }

    async getWorkEmailInput(): Promise<Locator> {
        return await healLocator([
            () => this.page.locator('.oxd-input-group').filter({ has: this.page.getByText('Work Email', { exact: true }) }).locator('.oxd-input'),
            () => this.page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > form:nth-child(3) > div:nth-child(9) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)"),
            () => this.page.locator('label:has-text("Work Email")').locator('..').locator('..').locator('input'),
            () => this.page.locator('//label[text()="Work Email"]/../following-sibling::div//input'),
        ]);
    }

    async getContactDetailsSaveButton(): Promise<Locator> {
        return await healLocator([
            () => this.page.locator('.orangehrm-horizontal-padding > form').first().getByRole('button', { name: 'Save' }),
            () => this.page.locator('.orangehrm-edit-employee-content form').getByRole('button', { name: 'Save' }).first(),
            () => this.page.getByRole('button', { name: 'Save' }),
            () => this.page.getByRole('button', { name: /Save/i }),
            () => this.page.getByText('Save', { exact: true }),
            () => this.page.locator('button:has-text("Save")'),
            () => this.page.locator(':text-is("Save")'),
        ]);
    }

    async getJobSaveButton(): Promise<Locator> {
        return await healLocator([
            () => this.page.locator('.orangehrm-horizontal-padding > form').first().getByRole('button', { name: 'Save' }),
            () => this.page.locator('.orangehrm-edit-employee-content form').getByRole('button', { name: 'Save' }).first(),
            () => this.page.getByRole('button', { name: 'Save' }).first(),
            () => this.page.locator('button:has-text("Save")').first(),
            () => this.page.locator(':text-is("Save")').first(),
        ]);
    }

    async getAddAttachmentButton(): Promise<Locator> {
        return await healLocator([
            () => this.page.getByRole('button', { name: 'Add' }).first(),
            () => this.page.getByRole('button', { name: /Add/i }).first(),
            () => this.page.locator('.orangehrm-attachment-header').getByRole('button', { name: 'Add' }),
            () => this.page.getByText('Add', { exact: true }),
            () => this.page.getByText('Add'),
            () => this.page.locator('button:has-text("Add")'),
            () => this.page.locator(':text-is("Add")'),
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--text'),
            () => this.page.locator('button').filter({ hasText: 'Add' }),
        ]);
    }

    async getAttachmentCommentInput(): Promise<Locator> {
        return await healLocator([
            () => this.page.getByPlaceholder('Type comment here'),
            () => this.page.locator('.oxd-input-group').filter({ has: this.page.getByText('Comment', { exact: true }) }).locator('textarea'),
            () => this.page.locator('textarea.oxd-textarea'),
        ]);
    }

    async getAttachmentSaveButton(): Promise<Locator> {
        return await healLocator([
            () => this.page.locator('.orangehrm-edit-employee-content form').last().getByRole('button', { name: 'Save' }),
            () => this.page.getByRole('button', { name: 'Save' }).last(),
            () => this.page.locator('.orangehrm-attachment-header ~ form').getByRole('button', { name: 'Save' }),
            () => this.page.locator('form').filter({ has: this.page.getByText('Add Attachment') }).getByRole('button', { name: 'Save' }),
            () => this.page.locator('button:has-text("Save")').last(),
        ]);
    }

    /**
     * Helper to select an option from an OrangeHRM/AscendqeHRM custom dropdown
     * Priority: getByRole('option') -> getByText -> CSS fallback -> XPath
     */
    async selectDropdownOption(dropdownOrLabel: Locator | string, optionText: string): Promise<void> {
        const dropdown = typeof dropdownOrLabel === 'string'
            ? await healLocator([
                () => this.page.locator('.oxd-input-group').filter({ has: this.page.getByText(dropdownOrLabel, { exact: true }) }).locator('.oxd-select-text'),
                () => this.page.locator('label:has-text("' + dropdownOrLabel + '")').locator('..').locator('..').locator('.oxd-select-wrapper'),
                () => this.page.locator('//label[text()="' + dropdownOrLabel + '"]/../following-sibling::div//div[contains(@class, "oxd-select-text")]'),
            ])
            : dropdownOrLabel;

        await this.waitForElement(dropdown);
        await this.click(dropdown);

        // Match option text inside dropdown listbox using auto-healing candidates
        const option = await healLocator([
            () => this.page.getByRole('option', { name: optionText, exact: false }),
            () => this.page.getByRole('listbox').getByText(optionText, { exact: false }),
            () => this.page.locator('.oxd-select-dropdown').getByText(optionText, { exact: false }),
            () => this.page.locator('//div[@role="listbox"]//span[text()="' + optionText + '"]'),
        ]);

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
        const tab = await this.getPersonalDetailsTab();
        await this.click(tab);
        await this.waitForLoader();
    }

    /**
     * Fills Nickname, selects Marital Status, fills Date of Birth, and saves Personal Details
     */
    async updatePersonalDetails(nickname: string, maritalStatus: string, dateOfBirth: string): Promise<void> {
        // Nickname
        const nicknameField = await this.getNicknameInput();
        await this.fill(nicknameField, nickname);

        // Marital Status Dropdown
        const maritalDropdown = await this.getMaritalStatusDropdown();
        await this.selectDropdownOption(maritalDropdown, maritalStatus);

        // Date of Birth input field
        const dobField = await this.getDateOfBirthInput();
        await this.click(dobField);
        await dobField.fill('');
        await dobField.fill(dateOfBirth);

        // Save
        const saveBtn = await this.getPersonalDetailsSaveButton();
        await this.click(saveBtn);
        await this.page.locator('.oxd-form-loader').waitFor({ state: 'visible', timeout: 1500 }).catch(() => {});
        await this.waitForLoader();
    }

    // ==========================================
    // 2. Contact Details Actions
    // ==========================================

    /**
     * Navigates to Contact Details tab
     */
    async clickContactDetailsTab(): Promise<void> {
        const tab = await this.getContactDetailsTab();
        await this.click(tab);
        await this.waitForLoader();
    }

    /**
     * Fills Mobile and Work Email, then saves
     */
    async fillContactDetails(mobile: string, workEmail: string): Promise<void> {
        const mobileField = await this.getMobileInput();
        await this.fill(mobileField, mobile);

        const emailField = await this.getWorkEmailInput();
        await this.fill(emailField, workEmail);

        const saveBtn = await this.getContactDetailsSaveButton();
        await this.click(saveBtn);
        await this.page.locator('.oxd-form-loader').waitFor({ state: 'visible', timeout: 1500 }).catch(() => {});
        await this.waitForLoader();
    }

    /**
     * Enters an invalid email and attempts to save to trigger validation error
     */
    async testInvalidWorkEmail(invalidEmail: string): Promise<void> {
        await this.waitForLoader();
        const emailField = await this.getWorkEmailInput();
        await emailField.fill('');
        await emailField.fill(invalidEmail);

        const saveBtn = await this.getContactDetailsSaveButton();
        await this.click(saveBtn);
    }

    /**
     * Retrieves the error message under Work Email field
     */
    async getWorkEmailValidationMessage(): Promise<string> {
        const errorMsg = await healLocator([
            () => this.page.locator('.oxd-input-group').filter({ has: this.page.getByText('Work Email', { exact: true }) }).locator('.oxd-input-field-error-message'),
            () => this.page.locator('.oxd-input-field-error-message'),
            () => this.page.locator('span.oxd-input-field-error-message:has-text("Expected format")'),
        ]);
        return await this.getText(errorMsg);
    }

    /**
     * Corrects the work email and saves successfully
     */
    async correctWorkEmailAndSave(validEmail: string): Promise<void> {
        await this.waitForLoader();
        const emailField = await this.getWorkEmailInput();
        await emailField.fill('');
        await emailField.fill(validEmail);

        const saveBtn = await this.getContactDetailsSaveButton();
        await this.click(saveBtn);
        await this.page.locator('.oxd-form-loader').waitFor({ state: 'visible', timeout: 1500 }).catch(() => {});
        await this.waitForLoader();
    }

    // ==========================================
    // 3. Job Details Actions
    // ==========================================

    /**
     * Navigates to Job tab
     */
    async clickJobTab(): Promise<void> {
        const tab = await this.getJobTab();
        await this.click(tab);
        await this.waitForLoader();
    }

    /**
     * Selects Job Title, Sub Unit, Employment Status from dropdowns and saves
     */
    async updateJobDetails(jobTitle?: string, subUnit?: string, employmentStatus?: string): Promise<void> {
        // Job Title Dropdown
        if (jobTitle) {
            await this.selectDropdownOption('Job Title', jobTitle);
        }

        // Sub Unit Dropdown
        if (subUnit) {
            await this.selectDropdownOption('Sub Unit', subUnit);
        }

        // Employment Status Dropdown
        if (employmentStatus) {
            await this.selectDropdownOption('Employment Status', employmentStatus);
        }

        // Save
        const saveBtn = await this.getJobSaveButton();
        await this.click(saveBtn);
        await this.page.locator('.oxd-form-loader').waitFor({ state: 'visible', timeout: 1500 }).catch(() => {});
        await this.waitForLoader();
    }

    /**
     * Selects Employment Status from dropdown and saves
     */
    async selectEmploymentStatus(employmentStatus: string): Promise<void> {
        await this.selectDropdownOption('Employment Status', employmentStatus);
    }

    /**
     * Clicks the Save button on Job form
     */
    async clickJobSave(): Promise<void> {
        const saveBtn = await this.getJobSaveButton();
        await this.click(saveBtn);
        await this.page.locator('.oxd-form-loader').waitFor({ state: 'visible', timeout: 1500 }).catch(() => {});
        await this.waitForLoader();
    }

    // ==========================================
    // 4. Attachments Actions
    // ==========================================

    /**
     * Adds an attachment by clicking '+ Add', uploading the specified file,
     * typing the comment, and clicking Save.
     */
    async addAttachment(filePath: string, comment: string): Promise<void> {
        const addBtn = await this.getAddAttachmentButton();
        await this.click(addBtn);

        // Upload file via file input element (attached in DOM, visually covered by custom button)
        const fileInput = await healLocator([
            () => this.page.locator('input[type="file"]'),
            () => this.page.locator('.oxd-file-input'),
            () => this.fileInput,
        ], { state: 'attached' });
        await fileInput.setInputFiles(filePath);

        // Fill comment
        const commentInput = await this.getAttachmentCommentInput();
        await this.fill(commentInput, comment);

        // Save attachment
        const saveBtn = await this.getAttachmentSaveButton();
        await this.click(saveBtn);
        await this.page.locator('.oxd-form-loader').waitFor({ state: 'visible', timeout: 1500 }).catch(() => {});
        await this.waitForLoader();
    }

    /**
     * Scrolls the page to make the Attachments section visible using auto-healing
     */
    async scrollToAttachments(): Promise<void> {
        const section = await healLocator([
            () => this.attachmentsSection,
            () => this.page.getByRole('heading', { name: 'Attachments' }),
            () => this.page.locator('.orangehrm-attachment-header'),
            () => this.page.locator('//h6[text()="Attachments"]'),
        ]);
        await section.scrollIntoViewIfNeeded();
    }
}
