import { test, expect } from '../../src/fixtures/page.fixture';
import { readCsv } from '../../src/utils/csvReader';
import { validUser } from '../../src/data/credentials';

import {
  generateRandomEmployeeId,
  generateRandomFirstName,
  generateRandomLastName,
  generateRandomUsername,
  generateRandomPassword
} from '../../src/utils/randomData';

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
const employees = readCsv<EmployeeUserRow>(
  'data/TC01_EmployeeAndUser.csv'
);

test.describe(
  'TC01 - Add Employee, Create ESS User, and Verify Permissions',
  () => {

    test.describe.configure({ mode: 'serial' });

    for (const emp of employees) {

      test(
        `TC01: Add Employee, Create ESS User - ${emp.userRole} - ${emp.status}`,
        async ({
          page,
          loginPage,
          dashboardPage,
          pimPages,
          pimPage,
          addEmployee,
          addUser,
          leavePage
        }) => {

          // ============================================================
          // Generate Random Test Data
          // ============================================================

          const firstName = generateRandomFirstName();
          const lastName = generateRandomLastName();
          const employeeId = generateRandomEmployeeId();

          const username = generateRandomUsername(
            firstName,
            lastName
          );

          const password = generateRandomPassword();

          // Confirm password MUST be exactly the same
          const confirmPassword = password;

          console.log('==============================================');
          console.log('Generated Random Test Data');
          console.log('First Name       :', firstName);
          console.log('Last Name        :', lastName);
          console.log('Employee ID      :', employeeId);
          console.log('Username         :', username);
          console.log('User Role        :', emp.userRole);
          console.log('Status           :', emp.status);
          console.log('Password         : ********');
          console.log('==============================================');

          // ============================================================
          // Action: Navigate to Login Page
          // Expected Result: Login page should be displayed
          // ============================================================

          await loginPage.gotoLogin();

          await expect(page).toHaveURL(
            /.*auth\/login/
          );

          await loginPage.verifyUsernameVisible();

          // ============================================================
          // Action: Login as Admin
          // Expected Result: Admin Dashboard should be displayed
          // ============================================================

          await loginPage.login(
            validUser.username,
            validUser.password
          );

          await expect(
            dashboardPage.DashBoardheader
          ).toBeVisible();

          expect(
            await dashboardPage.getDashBoardHeaderText()
          ).toBe('Dashboard');

          console.log(
            `Logged in as Admin: ${validUser.username}`
          );

          // ============================================================
          // Action: Navigate to PIM
          // Expected Result: PIM Employee List should be displayed
          // ============================================================

          await pimPages.clickPimMenu();

          await expect(page).toHaveURL(
            /.*pim\/viewEmployeeList/
          );

          await expect(
            page.getByRole('heading', {
              name: 'PIM',
              exact: true
            })
          ).toBeVisible();

          console.log('Navigated to PIM module');

          // ============================================================
          // Action: Add Random Employee
          // Expected Result: Employee should be created successfully
          // ============================================================

          await addEmployee.addNewEmployee(
            firstName,
            lastName,
            employeeId
          );

          await expect(page).toHaveURL(
            /.*pim\/viewPersonalDetails/
          );

          await expect(
            page.getByRole('heading', {
              name: 'Personal Details'
            })
          ).toBeVisible({
            timeout: 10000
          });

          console.log(
            `Employee created: ${firstName} ${lastName}`
          );

          // ============================================================
          // Action: Search Employee using generated Employee ID
          // Expected Result: Created employee should be displayed
          // ============================================================

          await pimPage.searchByEmployeeId(
            employeeId
          );

          const pimCard = page
            .locator('.oxd-table-card')
            .first();

          await expect(pimCard).toBeVisible();

          await expect(pimCard).toContainText(
            employeeId
          );

          await expect(pimCard).toContainText(
            firstName
          );

          console.log(
            `Searched Employee List by Employee ID: ${employeeId}`
          );

          // ============================================================
          // Action: Navigate to Admin
          // Expected Result: Admin module should be displayed
          // ============================================================

          await addUser.clickAdmin();

          await expect(page).toHaveURL(
            /.*admin\/viewSystemUsers/
          );

          await expect(
            page.getByRole('heading', {
              name: 'Admin',
              exact: true
            })
          ).toBeVisible();

          console.log('Navigated to Admin module');

          // ============================================================
          // Action: Create ESS User with generated credentials
          // Expected Result: ESS user should be created successfully
          // ============================================================

          const employeeFullName =
            `${firstName} ${lastName}`;

          await addUser.AddUserDetails(
            emp.userRole,
            employeeFullName,
            emp.status,
            username,
            password,
            confirmPassword
          );

          await expect(page).toHaveURL(
            /.*admin\/viewSystemUsers/
          );

          console.log(
            `Created ESS user: ${username} for employee: ${employeeFullName}`
          );

          // ============================================================
          // Action: Search generated username
          // Expected Result: Created ESS user should be displayed
          // ============================================================

          await addUser.searchUser(
            username
          );

          const userCard = page
            .locator('.oxd-table-card')
            .first();

          await expect(userCard).toBeVisible();

          await expect(userCard).toContainText(
            username
          );

          console.log(
            `Searched Users list for username: ${username}`
          );

          // ============================================================
          // Action: Logout from Admin
          // Expected Result: Login page should be displayed
          // ============================================================

          await dashboardPage.logout();

          await expect(page).toHaveURL(
            /.*auth\/login/
          );

          await loginPage.verifyUsernameVisible();

          console.log(
            'Admin logged out successfully'
          );

          // ============================================================
          // Action: Login using generated ESS credentials
          // Expected Result: ESS Dashboard should be displayed
          // ============================================================

          await loginPage.login(
            username,
            password
          );

          await expect(
            dashboardPage.DashBoardheader
          ).toBeVisible();

          expect(
            await dashboardPage.getDashBoardHeaderText()
          ).toBe('Dashboard');

          console.log(
            `Logged in as ESS user: ${username}`
          );

          // ============================================================
          // Action: Verify Admin module access
          // Expected Result: Admin menu should not be visible
          // ============================================================

          await expect(
            page.getByRole('link', {
              name: 'Admin',
              exact: true
            })
          ).not.toBeVisible();

          console.log(
            'Inspected Left Navigation Panel: Admin is restricted for ESS user'
          );

          // ============================================================
          // Action: Navigate to Leave module
          // Expected Result: Leave module should be displayed
          // ============================================================

          await leavePage.clickLeave();

          await expect(page).toHaveURL(
            /.*leave\/viewMyLeaveList/
          );

          await expect(
            page.getByRole('heading', {
              name: 'Leave',
              exact: true
            })
          ).toBeVisible();

          console.log(
            'Navigated to Leave module as ESS user'
          );

          // ============================================================
          // Action: Logout from ESS User
          // Expected Result: Login page should be displayed
          // ============================================================

          await dashboardPage.logout();

          await expect(page).toHaveURL(
            /.*auth\/login/
          );

          await loginPage.verifyUsernameVisible();

          console.log(
            `ESS user ${username} logged out successfully`
          );

          // ============================================================
          // Action: Click Browser Back button
          // Expected Result: User should remain on Login page
          // ============================================================

          console.log(
            'Clicking browser Back button...'
          );

          console.log(
            'URL before Back:',
            page.url()
          );

          await page.goBack();

          await expect(page).toHaveURL(
            /.*auth\/login/
          );

          await loginPage.verifyUsernameVisible();

          console.log(
            'URL after Back:',
            page.url()
          );

          console.log(
            'Verified: Session is closed and user is prevented from accessing protected pages.'
          );
        }
      );
    }
  }
);