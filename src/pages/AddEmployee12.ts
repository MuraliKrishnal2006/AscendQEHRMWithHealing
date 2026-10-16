import { Page, Locator, test } from '@playwright/test';
import { BasePage } from './BasePage';
import { healLocator } from '../utils/Locator-healing-utility';

/**
 * AddEmployee — models the "Add Employee" form under PIM.
 * Driven by CSV data (see src/data/employee.csv + tests/ui/pim.spec.ts)
 * so the same class handles every row without duplicating test logic.
 */
export class AddEmployee extends BasePage {
    readonly addButton: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly employeeId: Locator;
    readonly createLoginDetails: Locator;
    readonly status: Locator;
    readonly username: Locator;
    readonly password: Locator;
    readonly confirmPassword: Locator;
    readonly SaveButton: Locator;

    constructor(page: Page) {
        super(page);

        this.addButton =
            page.getByRole('button', { name: 'click' }).first();

        this.firstName =
            page.locator('input[placeholder="enter"]').first();

        this.lastName =
            page.locator('input[placeholder="Last Name"]').first();

        this.employeeId =
            page.locator('.oxd-input-group')
                .filter({ hasText: 'Employee Id' })
                .locator('input')
                .first();

        this.createLoginDetails =
            page.locator('.oxd-switch-input').first();

        this.status =
            page.getByRole('radio', { name: 'Enabled' }).first();

        this.username =
            page.locator(
                'div.oxd-input-group:has-text("field") input'
            ).first();

        this.password =
            page.locator('input[type="password"]').nth(0);

        this.confirmPassword =
            page.locator('input[type="password"]').nth(1);

        this.SaveButton =
            page.getByRole(
                'button',
                { name: 'Save' }
            ).first();
    }

    get addButtonCandidates(): Array<() => Locator> {
        return [
            () => this.addButton,
            () => this.page.locator('button')
                .filter({ hasText: 'Add' }),
            () => this.page.locator('button')
                .filter({ hasText: 'Add' })
                .first(),
            () => this.page.locator(
                "//button[normalize-space()='Add']"
            ),
            () => this.page.locator(
                "button[class='oxd-button oxd-button--medium oxd-button--secondary']"
            ),
            () => this.page.locator('button:visible')
        ];
    }

    get firstNameCandidates(): Array<() => Locator> {
        return [
            () => this.firstName,
            () => this.page.getByRole(
                'textbox',
                { name: /First Name/i }
            ),
            () => this.page.getByPlaceholder('First Name'),
            () => this.page.getByPlaceholder(
                'First Name',
                { exact: true }
            ),
            () => this.page.locator('[name="firstName"]'),
            () => this.page.locator(
                'input[name="firstName"]'
            ),
            () => this.page.locator(
                'input.oxd-input.oxd-input--active.orangehrm-firstname'
            )
        ];
    }

    get lastNameCandidates(): Array<() => Locator> {
        return [
            () => this.lastName,
            () => this.page.getByRole(
                'textbox',
                { name: /Last Name/i }
            ),
            () => this.page.getByPlaceholder('Last Name'),
            () => this.page.getByPlaceholder(
                'Last Name',
                { exact: true }
            ),
            () => this.page.locator('[name="lastName"]'),
            () => this.page.locator(
                'input[name="lastName"]'
            ),
            () => this.page.locator(
                'input.oxd-input.oxd-input--active.orangehrm-lastname'
            )
        ];
    }

    get employeeIdCandidates(): Array<() => Locator> {
        return [
            () => this.employeeId,
            () => this.page.locator(
                "//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']"
            ),
            () => this.page.locator(
                "div[class='oxd-input-group oxd-input-field-bottom-space'] div input[class='oxd-input oxd-input--active']"
            ),
            () => this.page.getByRole('textbox'),
            () => this.page.locator(
                'input.oxd-input.oxd-input--active'
            ),
            () => this.page.locator(
                'input.oxd-input.oxd-input--active:visible'
            ),
            () => this.page.locator('input:visible')
        ];
    }

    get createLoginDetailsCandidates(): Array<() => Locator> {
        return [
            () => this.createLoginDetails,
            () => this.page.locator(
                'span.oxd-switch-input.oxd-switch-input--active.--label-right'
            ),
            () => this.page.locator(
                'span.oxd-switch-input.oxd-switch-input--active.--label-right:visible'
            ),
            () => this.page.locator(
                "//span[@class='oxd-switch-input oxd-switch-input--active --label-right']"
            ),
            () => this.page.locator(
                ".oxd-switch-input.oxd-switch-input--active.--label-right"
            ),
            () => this.page.locator('span:visible')
        ];
    }

    get statusCandidates(): Array<() => Locator> {
        return [
            () => this.status,
            () => this.page.getByLabel('Enabled'),
            () => this.page.getByLabel(
                'Enabled',
                { exact: true }
            ),
            () => this.page.locator(
                "//label[normalize-space()='Enabled']"
            ),
            () => this.page.locator(
                "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > label:nth-child(1) > span:nth-child(2)"
            ),
            () => this.page.locator(
                'span.oxd-radio-input.oxd-radio-input--active.--label-right.oxd-radio-input'
            ),
            () => this.page.locator(
                'span.oxd-radio-input.oxd-radio-input--active.--label-right'
            )
        ];
    }

    get usernameCandidates(): Array<() => Locator> {
        return [
            () => this.username,
            () => this.page.locator(
                "//body/div[@id='app']/div[@class='oxd-layout']/div[@class='oxd-layout-container']/div[@class='oxd-layout-context']/div[@class='orangehrm-background-container']/div[@class='orangehrm-card-container']/form[@class='oxd-form']/div[@class='orangehrm-employee-container']/div[@class='orangehrm-employee-form']/div[@class='oxd-form-row']/div[1]/div[1]/div[1]/div[2]/input[1]"
            ),
            () => this.page.locator(
                "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)"
            ),
            () => this.page.getByRole('textbox'),
            () => this.page.locator(
                'input.oxd-input.oxd-input--active'
            ),
            () => this.page.locator(
                'input.oxd-input.oxd-input--active:visible'
            ),
            () => this.page.locator('input:visible')
        ];
    }

    get passwordCandidates(): Array<() => Locator> {
        return [
            () => this.password,
            () => this.page.locator(
                "//div[@class='oxd-grid-item oxd-grid-item--gutters user-password-cell']//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@type='password']"
            ),
            () => this.page.locator(
                "div[class='oxd-grid-item oxd-grid-item--gutters user-password-cell'] div[class='oxd-input-group oxd-input-field-bottom-space'] div input[type='password']"
            ),
            () => this.page.locator(
                'input[type="password"]'
            ),
            () => this.page.locator(
                'input.oxd-input.oxd-input--active'
            ),
            () => this.page.locator(
                'input.oxd-input.oxd-input--active:visible'
            )
        ];
    }

    get confirmPasswordCandidates(): Array<() => Locator> {
        return [
            () => this.confirmPassword,
            () => this.page.locator(
                "//div[@class='oxd-grid-item oxd-grid-item--gutters']//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@type='password']"
            ),
            () => this.page.locator(
                "div[class='oxd-grid-item oxd-grid-item--gutters'] div[class='oxd-input-group oxd-input-field-bottom-space'] div input[type='password']"
            ),
            () => this.page.locator(
                'input[type="password"]'
            ),
            () => this.page.locator(
                'input.oxd-input.oxd-input--active'
            ),
            () => this.page.locator(
                'input.oxd-input.oxd-input--active:visible'
            )
        ];
    }

    get saveButtonCandidates(): Array<() => Locator> {
        return [
            () => this.SaveButton,
            () => this.page.getByText(
                'Save',
                { exact: true }
            ),
            () => this.page.locator(
                'button:has-text("Save")'
            ),
            () => this.page.locator(
                ':text-is("Save")'
            ),
            () => this.page.locator(
                'button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space:visible'
            ),
            () => this.page.locator('button')
                .filter({ hasText: 'Save' }),
            () => this.page.locator('button')
                .filter({ hasText: 'Save' })
                .first(),
            () => this.page.locator(
                'div.oxd-form-actions'
            ).locator('button').nth(1)
        ];
    }

    async AddEmployeeDetails(
        firstname: string,
        lastname: string,
        username: string,
        password: string,
        confirmPassword: string
    ): Promise<void> {

        await this.healClick(
            this.addButtonCandidates,
            'Click on Add Employee button'
        );

        await this.healFill(
            this.firstNameCandidates,
            firstname,
            'Enter FirstName'
        );

        await this.healFill(
            this.lastNameCandidates,
            lastname,
            'Enter LastName'
        );

        await this.healClick(
            this.createLoginDetailsCandidates,
            'Click on Create Login Details'
        );

        await this.healFill(
            this.usernameCandidates,
            username,
            'Enter Username'
        );

        await this.healFill(
            this.passwordCandidates,
            password,
            'Enter Password',
            true
        );

        await this.healFill(
            this.confirmPasswordCandidates,
            confirmPassword,
            'Enter Confirm Password',
            true
        );

        console.log('Save button is available');

        await this.healClick(
            this.saveButtonCandidates,
            'Click on Save button'
        );

        console.log('Save button clicked');

        await this.page.getByText(
            'Successfully Saved'
        ).waitFor({
            state: 'visible'
        });

        console.log(
            'Successfully Saved message displayed'
        );
    }

    async addNewEmployee(
        firstname: string,
        lastname: string,
        employeeId?: string
    ): Promise<void> {

        await this.healClick(
            this.addButtonCandidates,
            'Click on Add Employee button'
        );

        await this.healFill(
            this.firstNameCandidates,
            firstname,
            'Enter FirstName'
        );

        const firstNameLocator =
            await healLocator(
                this.firstNameCandidates
            );

        console.log(
            'FIRST NAME DOM VALUE:',
            await firstNameLocator.inputValue()
        );

        await this.healFill(
            this.lastNameCandidates,
            lastname,
            'Enter LastName'
        );

        if (employeeId) {

            const empIdLocator =
                await healLocator(
                    this.employeeIdCandidates
                );

            await empIdLocator.waitFor({
                state: 'visible'
            });

            const autoSuggestedId =
                await empIdLocator.inputValue();

            console.log(
                `Auto-suggested Employee ID was: ${autoSuggestedId}, overriding with: ${employeeId}`
            );

            await test.step(
                `Enter Employee ID value: ${employeeId}`,
                async () => {

                    await empIdLocator.click();
                    await empIdLocator.fill('');
                    await empIdLocator.fill(employeeId);

                }
            );
        }

        await this.healClick(
            this.saveButtonCandidates,
            'Click on Save button'
        );

        console.log(
            `Employee ${firstname} ${lastname} added successfully`
        );
    }
}