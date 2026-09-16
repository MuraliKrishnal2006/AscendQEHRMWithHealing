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

      await loginPage.gotoLogin();
      await expect(page).toHaveURL(/.*auth\/login/);
      await loginPage.verifyUsernameVisible();

      await loginPage.login(
        validUser.username,
        validUser.password
      );
      await expect(dashboardPage.DashBoardheader).toBeVisible();
      expect(await dashboardPage.getDashBoardHeaderText()).toBe('Dashboard');
      console.log(`Logged in as Admin: ${validUser.username}`);

      await pimPages.clickPimMenu();
      await expect(page).toHaveURL(/.*pim\/viewEmployeeList/);
      await expect(page.getByRole('heading', { name: 'PIM', exact: true })).toBeVisible();
      console.log('Navigated to PIM module');

      await addEmployee.addNewEmployee(
        emp.firstName,
        emp.lastName,
        emp.employeeId
      );
      await expect(page).toHaveURL(/.*pim\/viewPersonalDetails/);
      await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible({ timeout: 10000 });
      console.log(`Employee created: ${emp.firstName} ${emp.lastName}`);

      await pimPage.searchByEmployeeId(emp.employeeId);
      const pimCard = page.locator('.oxd-table-card').first();
      await expect(pimCard).toBeVisible();
      await expect(pimCard).toContainText(emp.employeeId);
      await expect(pimCard).toContainText(emp.firstName);
      console.log(`Searched Employee List by Employee ID: ${emp.employeeId}`);

      await addUser.clickAdmin();
      await expect(page).toHaveURL(/.*admin\/viewSystemUsers/);
      await expect(page.getByRole('heading', { name: 'Admin', exact: true })).toBeVisible();
      console.log('Navigated to Admin module');

      const employeeFullName = `${emp.firstName} ${emp.lastName}`;
      await addUser.AddUserDetails(
        emp.userRole,
        employeeFullName,
        emp.status,
        emp.username,
        emp.password,
        emp.confirmPassword
      );
      await expect(page).toHaveURL(/.*admin\/viewSystemUsers/);
      console.log(`Created ESS user: ${emp.username} for employee: ${employeeFullName}`);

      await addUser.searchUser(emp.username);
      const userCard = page.locator('.oxd-table-card').first();
      await expect(userCard).toBeVisible();
      await expect(userCard).toContainText(emp.username);
      console.log(`Searched Users list for username: ${emp.username}`);

      await dashboardPage.logout();
      await expect(page).toHaveURL(/.*auth\/login/);
      await loginPage.verifyUsernameVisible();
      console.log('Admin logged out successfully');

      await loginPage.login(
        emp.username,
        emp.password
      );
      await expect(dashboardPage.DashBoardheader).toBeVisible();
      expect(await dashboardPage.getDashBoardHeaderText()).toBe('Dashboard');
      console.log(`Logged in as ESS user: ${emp.username}`);

      await expect(page.getByRole('link', { name: 'Admin', exact: true })).not.toBeVisible();
      console.log('Inspected Left Navigation Panel: Admin is restricted for ESS user');

      await leavePage.clickLeave();
      await expect(page).toHaveURL(/.*leave\/viewMyLeaveList/);
      await expect(page.getByRole('heading', { name: 'Leave', exact: true })).toBeVisible();
      console.log('Navigated to Leave module as ESS user');

      await dashboardPage.logout();
      await expect(page).toHaveURL(/.*auth\/login/);
      await loginPage.verifyUsernameVisible();
      console.log(`ESS user ${emp.username} logged out successfully`);

      console.log('Clicking browser Back button...');
      console.log('URL before Back:', page.url());  

      await page.goBack();
      await expect(page).toHaveURL(/.*auth\/login/);
      await loginPage.verifyUsernameVisible();

      console.log('URL after Back:', page.url());
      console.log('Verified: Session is closed and user is prevented from accessing protected pages.');

    });
  }
});
