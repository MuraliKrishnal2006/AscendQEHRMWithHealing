import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { AutocompleteComponent } from '../components/AutocompleteComponent';
import { TopNavComponent } from '../components/TopNavComponent';


export class Timepage extends BasePage {
    readonly Time: Locator;
    readonly Attendance: Locator;
    readonly PunchInOut: Locator;
    readonly InTime: Locator;
    readonly OutTime: Locator;
    readonly MyRecords: Locator;
    readonly MyRecordsHeading: Locator;
    readonly EmployeeRecords: Locator;
    readonly EmployeeAttendanceRecords: Locator;
    readonly EmployeeName: Locator;
    readonly AllEmployeeName: Locator;
    readonly ViewButton: Locator;

    readonly employeeNameAutocomplete: AutocompleteComponent;
    readonly topNav: TopNavComponent;



    constructor(page: Page) {
        super(page);

        this.Time = page.getByRole('link', { name: 'Time' });

        // Attendance/PunchInOut/MyRecords/EmployeeRecords are second-level
        // tabs/menu items, not top-nav links — a different widget from
        // TopNavComponent, so they keep their own locators here.
        this.Attendance = page
            .locator('.oxd-topbar-body-nav-tab-item', {
                hasText: 'Attendance'
            }).first();

        this.PunchInOut = page.getByRole('menuitem', {
            name: 'Punch In/Out'
        });

        this.InTime = page.getByRole('button', { name: 'In' });

        this.OutTime = page.getByRole('button', { name: 'Out' });

        this.MyRecords = page.getByRole('menuitem', { name: 'My Records' });
        this.MyRecordsHeading = page.getByRole('heading', { name: /My Attendance Records|My Records/i }).or(page.getByText('My Attendance Records'));
        this.EmployeeRecords = page.getByRole('menuitem', { name: 'Employee Records' });
        this.EmployeeAttendanceRecords = page.getByRole('heading', { name: /Employee Attendance Records|Employee Records/i }).or(page.getByText('Employee Attendance Records'));
        this.EmployeeName = page.getByPlaceholder('Type for hints...');
        this.AllEmployeeName = page.locator('.oxd-table-card').or(page.locator('.oxd-table')).or(page.locator('.orangehrm-container')).first();
        this.ViewButton = page.locator('form').getByRole('button', { name: 'View' });

        this.employeeNameAutocomplete = new AutocompleteComponent(
            page,
            this.EmployeeName,
            page.locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option')
        );
        this.topNav = new TopNavComponent(page);

    }

    // ================= Candidate Locator Pools =================

    get attendanceCandidates(): Array<() => Locator> {
        return [
            () => this.Attendance,
            () => this.page.getByText('Attendance', { exact: true }),
            () => this.page.getByText('Attendance'),
            () => this.page.locator('span:has-text("Attendance")'),
            () => this.page.locator(':text-is("Attendance")'),
            () => this.page.locator(':text("Attendance")'),
            () => this.page.locator('span').filter({ hasText: 'Attendance' })
        ];
    }

    get punchInOutCandidates(): Array<() => Locator> {
        return [
            () => this.PunchInOut,
            () => this.page.getByText('Punch In/Out', { exact: true }),
            () => this.page.getByText('Punch In/Out'),
            () => this.page.locator('a:has-text("Punch In/Out")'),
            () => this.page.locator(':text-is("Punch In/Out")'),
            () => this.page.locator(':text("Punch In/Out")'),
            () => this.page.locator('a').filter({ hasText: 'Punch In/Out' }),
            () => this.page.locator('a').filter({ hasText: 'Punch In/Out' }).first()
        ];
    }

    get inTimeCandidates(): Array<() => Locator> {
        return [
            () => this.InTime,
            () => this.page.getByText('In', { exact: true }),
            () => this.page.locator('button:has-text("In")'),
            () => this.page.locator(':text-is("In")'),
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space'),
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space:visible'),
            () => this.page.locator('button').filter({ hasText: 'In' })
        ];
    }

    get outTimeCandidates(): Array<() => Locator> {
        return [
            () => this.OutTime,
            () => this.page.getByText('Out', { exact: true }),
            () => this.page.locator('button:has-text("Out")'),
            () => this.page.locator(':text-is("Out")'),
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space'),
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space:visible'),
            () => this.page.locator('button').filter({ hasText: 'Out' })
        ];
    }

    get myRecordsCandidates(): Array<() => Locator> {
        return [
            () => this.MyRecords,
            () => this.page.getByText('My Records', { exact: true }),
            () => this.page.getByText('My Records'),
            () => this.page.locator('a:has-text("My Records")'),
            () => this.page.locator(':text-is("My Records")'),
            () => this.page.locator(':text("My Records")'),
            () => this.page.locator('a').filter({ hasText: 'My Records' }),
            () => this.page.locator('a').filter({ hasText: 'My Records' }).first()
        ];
    }

    get myRecordsHeadingCandidates(): Array<() => Locator> {
        return [
            () => this.MyRecordsHeading,
            () => this.page.getByRole('heading', { name: 'My Attendance Records' }),
            () => this.page.getByRole('heading', { name: /My Attendance Records/i }),
            () => this.page.getByText('My Attendance Records', { exact: true }),
            () => this.page.getByText('My Attendance Records'),
            () => this.page.locator('h5:has-text("My Attendance Records")'),
            () => this.page.locator('h6:has-text("Attendance")')
        ];
    }

    get employeeRecordsCandidates(): Array<() => Locator> {
        return [
            () => this.EmployeeRecords,
            () => this.page.getByText('Employee Records', { exact: true }),
            () => this.page.getByText('Employee Records'),
            () => this.page.locator('a:has-text("Employee Records")'),
            () => this.page.locator(':text-is("Employee Records")'),
            () => this.page.locator(':text("Employee Records")'),
            () => this.page.locator('a').filter({ hasText: 'Employee Records' }),
            () => this.page.locator('a').filter({ hasText: 'Employee Records' }).first()
        ];
    }

    get employeeAttendanceRecordsCandidates(): Array<() => Locator> {
        return [
            () => this.EmployeeAttendanceRecords,
            () => this.page.getByRole('heading', { name: 'Employee Attendance Records' }),
            () => this.page.getByRole('heading', { name: /Employee Attendance Records/i }),
            () => this.page.getByText('Employee Attendance Records', { exact: true }),
            () => this.page.getByText('Employee Attendance Records'),
            () => this.page.locator('h5:has-text("Employee Attendance Records")')
        ];
    }

    get allEmployeeNameCandidates(): Array<() => Locator> {
        return [
            () => this.AllEmployeeName,
            () => this.page.locator('.oxd-table-card').first(),
            () => this.page.locator('.oxd-table'),
            () => this.page.locator('.oxd-table-body'),
            () => this.page.locator('.orangehrm-container')
        ];
    }

    get employeeNameCandidates(): Array<() => Locator> {
        return [
            () => this.EmployeeName,
            () => this.page.getByRole('textbox', { name: /Type for hints\.\.\./i }),
            () => this.page.getByPlaceholder('Type for hints...'),
            () => this.page.getByPlaceholder('Type for hints...', { exact: true }),
            () => this.page.locator("//input[@placeholder='Type for hints...']"),
            () => this.page.locator("input[placeholder='Type for hints...']")
        ];
    }

    get viewButtonCandidates(): Array<() => Locator> {
        return [
            () => this.ViewButton,
            () => this.page.locator('button.oxd-button.oxd-button--medium.oxd-button--secondary:visible'),
            () => this.page.locator('button').filter({ hasText: 'View' }).first(),
            () => this.page.locator('button').filter({ hasText: 'View' }).last(),
            () => this.page.locator("//button[@type='submit']"),
            () => this.page.locator("button[type='submit']")
        ];
    }

    async clickTimeMenu(): Promise<void> {
        console.log('Clicking Time...');

        // Original locator wasn't scoped with { exact: true }, so match
        // that here rather than TopNavComponent.goTo's exact-true default.
        await this.topNav.goTo('Time', false);

        console.log('Time clicked');

        await this.waitForElement(this.Attendance);
    }

    async clickAttendance(): Promise<void> {
        console.log('Clicking Attendance...');

        await this.waitForElement(this.Attendance);
        await this.click(this.Attendance);

        console.log('Attendance clicked');

        await this.waitForElement(this.PunchInOut);
    }

    async clickPunchInOut(): Promise<void> {
        console.log('Clicking Punch In/Out...');

        await this.waitForElement(this.PunchInOut);
        await this.click(this.PunchInOut);

        console.log('Punch In/Out clicked');

        await this.waitForElement(this.InTime);
        await this.page.waitForTimeout(5000);
        console.log('Punch In/Out page loaded');
    }
    async punchIn(): Promise<void> {
        await this.waitForElement(this.InTime);
        await this.click(this.InTime);
        await this.page.waitForTimeout(5000);
        console.log('Punch In clicked');

        // Wait only if the application actually needs time
        await this.waitForElement(this.OutTime);

        console.log('Punch Out is available');
    }

    async punchOut(): Promise<void> {
        await this.waitForElement(this.OutTime);
        await this.click(this.OutTime);
        await this.page.waitForTimeout(3000);
        console.log('Punch Out clicked');
    }
    async clickMyRecords(): Promise<void> {
        await this.waitForElement(this.MyRecords);
        await this.click(this.MyRecords);
       await this.page.waitForTimeout(3000);
        console.log('My Records clicked');
         // Wait for My Records page/content to load
    await this.page.waitForLoadState('domcontentloaded');

    // Scroll down to the records
    await this.page.mouse.wheel(0, 800);

    // Give the page a chance to render the records
    await this.page.waitForTimeout(1000);
    }
    
    async clickEmployeeRecords(): Promise<void> {
        await this.waitForElement(this.EmployeeRecords);
        await this.click(this.EmployeeRecords);
        await this.page.waitForTimeout(3000);
    }
    private previousUsername = '';

    setPreviousUser(username: string): void {
        this.previousUsername = username;
    }
     async viewMyTime(): Promise<void> {

    const employeeSearchText =
        this.previousUsername.substring(0, 6);

    console.log(`Searching employee: ${employeeSearchText}`);

    // Search employee — first-match autocomplete (same pattern as
    // LeaveListPage's search, factored into AutocompleteComponent)
    await this.employeeNameAutocomplete.selectFirstMatch(employeeSearchText);

    console.log('Employee selected');
 await this.page.waitForTimeout(2000);

    // Give application time to update selected employee
   

    // Click View
    await this.ViewButton.click();
    await this.page.waitForTimeout(2000);

    console.log('View clicked');
     // See the results
     // Wait for My Records page/content to load
    await this.page.waitForLoadState('domcontentloaded');

    // Scroll down to the records
    await this.page.mouse.wheel(0, 800);

    // Give the page a chance to render the records
    await this.page.waitForTimeout(1000);


     await this.EmployeeName.click();
await this.EmployeeName.press('Control+A');
await this.EmployeeName.press('Backspace');

console.log('Employee name cleared');

await this.page.waitForTimeout(1000);
await this.ViewButton.click();

console.log('Second View clicked');
// Wait for results
    await this.page.waitForTimeout(5000);
     // Wait for My Records page/content to load
    await this.page.waitForLoadState('domcontentloaded');

    // Scroll down to the records
    await this.page.mouse.wheel(0, 800);

    // Give the page a chance to render the records
    await this.page.waitForTimeout(1000);

}


}