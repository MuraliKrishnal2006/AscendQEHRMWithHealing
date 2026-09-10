import { test, expect } from '../../src/fixtures/page.fixture';
import { readCsv } from '../../src/utils/csvReader';
import { validUser } from '../../src/data/credentials';

type EmployeeUserRow = {
  firstName: string;
  lastName: string;
  employeeId: string;
  userRole: string;
  status: string;
  username: string;
  password: string;
  confirmPassword: string;
};

// Read employee test data from CSV
const employees = readCsv<EmployeeUserRow>('data/TC01_EmployeeAndUser.csv');

test.describe('TC01 - Add Employee, Create ESS User, and Verify Permissions', () => {
  test.describe.configure({ mode: 'serial' });

  for (const emp of employees) {
    test(`TC01: ${emp.firstName} ${emp.lastName} (${emp.employeeId})`, async ({
      page,
      loginPage,
      dashboardPage,
      pimPages,
      pimPage,
      addEmployee,
      addUser,
      leavePage
    }) => {

      // 1. Launch web browser & Navigate to URL
      await loginPage.gotoLogin();

      // 2. Enter Username and Password and Click Login
      await loginPage.login(
        validUser.username,
        validUser.password
      );
      console.log(`Logged in as Admin: ${validUser.username}`);

      // 3. Click PIM from the Left Navigation Panel
      await pimPages.clickPimMenu();
      console.log('Navigated to PIM module');

      // 4. Click + Add button, enter First Name, Last Name, Employee ID and Click Save
      await addEmployee.addNewEmployee(
        emp.firstName,
        emp.lastName,
        emp.employeeId
      );
      await page.waitForTimeout(5000);

      // 5. Navigate to PIM → Employee List and search by Employee ID
      await pimPage.searchByEmployeeId(emp.employeeId);
      console.log(`Searched Employee List by Employee ID: ${emp.employeeId}`);
      await page.waitForTimeout(2000);

      // 6. Click Admin from the Left Navigation Panel
      await addUser.clickAdmin();
      console.log('Navigated to Admin module');

      // 7. Click + Add button, select User Role: ESS, search Employee Name, Status: Enabled, Username, Password, Confirm Password, Click Save
      const employeeFullName = `${emp.firstName} ${emp.lastName}`;
      await addUser.AddUserDetails(
        emp.userRole,
        employeeFullName,
        emp.status,
        emp.username,
        emp.password,
        emp.confirmPassword
      );
      console.log(`Created ESS user: ${emp.username} for employee: ${employeeFullName}`);
      await page.waitForTimeout(5000);

      // 8. On the Users list, search by Username
      await addUser.searchUser(emp.username);
      console.log(`Searched Users list for username: ${emp.username}`);
      await page.waitForTimeout(5000);

      // 9. Click user/profile icon and click Logout
      await dashboardPage.logout();
      console.log('Admin logged out successfully');

      // 10. Enter username and password of ESS user and click Login
      await loginPage.login(
        emp.username,
        emp.password
      );
      console.log(`Logged in as ESS user: ${emp.username}`);

      // 11. Inspect Left Navigation Panel
      await expect(page.getByRole('link', { name: 'Admin', exact: true })).not.toBeVisible();
      console.log('Inspected Left Navigation Panel: Admin is restricted for ESS user');

      // 12. Click into an ESS-permitted module (e.g. Leave)
      await leavePage.clickLeave();
      console.log('Navigated to Leave module as ESS user');
      await page.waitForTimeout(4000);

      // 13. Click user/profile icon and click Logout
      await dashboardPage.logout();
      await page.waitForTimeout(4000);
      console.log(`ESS user ${emp.username} logged out successfully`);

      // 14. Click the browser Back button
      console.log('Clicking browser Back button...');
      console.log('URL before Back:', page.url());

      await page.goBack({
        waitUntil: 'domcontentloaded'
      });

      console.log('URL after Back:', page.url());

      // Verify previous ESS page is displayed
      await expect(
        page.getByRole('link', { name: 'Leave', exact: true })
      ).toBeVisible({ timeout: 30000 });

      console.log('Previous ESS page is displayed. User is still logged in.');

    });
  }
});
