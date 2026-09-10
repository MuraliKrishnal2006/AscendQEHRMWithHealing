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
    readonly EmployeeRecords: Locator;
    readonly EmployeeName: Locator;
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
        this.EmployeeRecords = page.getByRole('menuitem', { name: 'Employee Records' });
        this.EmployeeName = page.getByPlaceholder('Type for hints...');
        this.ViewButton = page.locator('form').getByRole('button', { name: 'View' });

        this.employeeNameAutocomplete = new AutocompleteComponent(
            page,
            this.EmployeeName,
            page.locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option')
        );
        this.topNav = new TopNavComponent(page);

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