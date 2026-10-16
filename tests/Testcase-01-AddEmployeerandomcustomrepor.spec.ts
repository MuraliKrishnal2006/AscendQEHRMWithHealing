
import { test, expect } from '../src/fixtures/page.fixture';

import { readCsv } from '../src/utils/csvReader';

import { validUser } from '../src/data/credentials';

import { showAction } from '../src/utils/LiveActivity';

import {
  generateRandomEmployeeId,
  generateRandomFirstName,
  generateRandomLastName,
  generateRandomUsername,
  generateRandomPassword
} from '../src/utils/randomData';

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

    // Execute CSV test cases serially
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

          // Confirm password must be exactly the same
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
          // 1. Navigate to Login Page
          // ============================================================

          await test.step('Navigate to Login Page', async () => {

            await loginPage.gotoLogin();

            await expect(page).toHaveURL(
              /.*auth\/login/
            );

            // Diagnostic only
            await showAction(
              page,
              'TEST MESSAGE - LiveActivity is working'
            );

            // Keep message visible for 5 seconds
            await page.waitForTimeout(5000);

            await loginPage.verifyUsernameVisible();
          });


          // ============================================================
          // 2. Login as Admin
          // ============================================================

          await test.step('Login as Admin', async () => {

            await showAction(
              page,
              'Entering Admin credentials...'
            );

            await loginPage.login(
              validUser.username,
              validUser.password
            );

            await showAction(
              page,
              'Login submitted - verifying Admin Dashboard...'
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
          });


          // ============================================================
          // 3. Navigate to PIM
          // ============================================================

          await test.step('Navigate to PIM', async () => {

            await showAction(
              page,
              'Clicking PIM module...'
            );

            await pimPages.clickPimMenu();

            await showAction(
              page,
              'PIM module opened - verifying Employee List...'
            );

            await expect(page).toHaveURL(
              /.*pim\/viewEmployeeList/
            );

            await expect(
              page.getByRole('heading', {
                name: 'PIM',
                exact: true
              })
            ).toBeVisible();

            console.log(
              'Navigated to PIM module'
            );
          });


          // ============================================================
          // 4. Add Random Employee
          // ============================================================

          await test.step('Add Random Employee', async () => {

            await showAction(
              page,
              `Adding employee: ${firstName} ${lastName}...`
            );

            await addEmployee.addNewEmployee(
              firstName,
              lastName,
              employeeId
            );

            await showAction(
              page,
              'Employee created - verifying Personal Details...'
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
          });


          // ============================================================
          // 5. Search Employee
          // ============================================================

          await test.step(
            'Search Employee using generated Employee ID',
            async () => {

              await showAction(
                page,
                `Searching Employee ID: ${employeeId}...`
              );

              await pimPage.searchByEmployeeId(
                employeeId
              );

              const pimCard = page.locator('.oxd-table-card').first();

              await expect(
                pimCard
              ).toBeVisible();

              await expect(
                pimCard
              ).toContainText(employeeId);

              await expect(
                pimCard
              ).toContainText(firstName);

              await showAction(
                page,
                `Employee ${employeeId} found successfully.`
              );

              console.log(
                `Searched Employee List by Employee ID: ${employeeId}`
              );
            }
          );


          // ============================================================
          // 6. Navigate to Admin
          // ============================================================

          await test.step('Navigate to Admin', async () => {

            await showAction(
              page,
              'Clicking Admin module...'
            );

            await addUser.clickAdmin();

            await showAction(
              page,
              'Admin module opened - verifying System Users...'
            );

            await expect(page).toHaveURL(
              /.*admin\/viewSystemUsers/
            );

            await expect(
              page.getByRole('heading', {
                name: 'Admin',
                exact: true
              })
            ).toBeVisible();

            console.log(
              'Navigated to Admin module'
            );
          });


          // ============================================================
          // 7. Create ESS User
          // ============================================================

          await test.step(
            'Create ESS User with generated credentials',
            async () => {

              const employeeFullName =
                `${firstName} ${lastName}`;

              await showAction(
                page,
                `Creating ESS user for ${employeeFullName}...`
              );

              await addUser.AddUserDetails(
                emp.userRole,
                employeeFullName,
                emp.status,
                username,
                password,
                confirmPassword
              );

              await showAction(
                page,
                `ESS user ${username} created successfully.`
              );

              await expect(page).toHaveURL(
                /.*admin\/viewSystemUsers/
              );

              console.log(
                `Created ESS user: ${username} for employee: ${employeeFullName}`
              );
            }
          );


          // ============================================================
          // 8. Search Generated Username
          // ============================================================

          await test.step(
            'Search generated username',
            async () => {

              await showAction(
                page,
                `Searching username: ${username}...`
              );

              await addUser.searchUser(
                username
              );

              const userCard = page
                .locator('.oxd-table-card')
                .first();

              await expect(
                userCard
              ).toBeVisible();

              await expect(
                userCard
              ).toContainText(username);

              await showAction(
                page,
                `Username ${username} found successfully.`
              );

              console.log(
                `Searched Users list for username: ${username}`
              );
            }
          );


          // ============================================================
          // 9. Logout from Admin
          // ============================================================

          await test.step(
            'Logout from Admin',
            async () => {

              await showAction(
                page,
                'Logging out Admin user...'
              );

              await dashboardPage.logout();

              await showAction(
                page,
                'Admin logout completed - verifying Login page...'
              );

              await expect(page).toHaveURL(
                /.*auth\/login/
              );

              await loginPage.verifyUsernameVisible();

              console.log(
                'Admin logged out successfully'
              );
            }
          );


          // ============================================================
          // 10. Login using ESS Credentials
          // ============================================================

          await test.step(
            'Login using generated ESS credentials',
            async () => {

              await showAction(
                page,
                `Entering ESS credentials for ${username}...`
              );

              await loginPage.login(
                username,
                password
              );

              await showAction(
                page,
                'ESS login submitted - verifying Dashboard...'
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
            }
          );


          // ============================================================
          // 11. Verify Admin Access Restriction
          // ============================================================

          await test.step(
            'Verify Admin module access',
            async () => {

              await showAction(
                page,
                'Checking Admin module access for ESS user...'
              );

              await expect(
                page.getByRole('link', {
                  name: 'Admin',
                  exact: true
                })
              ).not.toBeVisible();

              await showAction(
                page,
                'Admin access is restricted for ESS user.'
              );

              console.log(
                'Inspected Left Navigation Panel: Admin is restricted for ESS user'
              );
            }
          );


          // ============================================================
          // 12. Navigate to Leave
          // ============================================================

          await test.step(
            'Navigate to Leave module',
            async () => {

              await showAction(
                page,
                'Clicking Leave module...'
              );

              await leavePage.clickLeave();

              await showAction(
                page,
                'Leave module opened - verifying Leave page...'
              );

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
            }
          );


          // ============================================================
          // 13. Logout from ESS User
          // ============================================================

          await test.step(
            'Logout from ESS User',
            async () => {

              await showAction(
                page,
                `Logging out ESS user ${username}...`
              );

              await dashboardPage.logout();

              await showAction(
                page,
                'ESS logout completed - verifying Login page...'
              );

              await expect(page).toHaveURL(
                /.*auth\/login/
              );

              await loginPage.verifyUsernameVisible();

              console.log(
                `ESS user ${username} logged out successfully`
              );
            }
          );


          // ============================================================
          // 14. Browser Back Button Verification
          // ============================================================

          await test.step(
            'Click Browser Back button and verify session protection',
            async () => {

              await showAction(
                page,
                'Clicking browser Back button...'
              );

              console.log(
                'URL before Back:',
                page.url()
              );

              await page.goBack();

              await showAction(
                page,
                'Back navigation completed - verifying session protection...'
              );

              await expect(page).toHaveURL(
                /.*auth\/login/
              );

              await loginPage.verifyUsernameVisible();

              console.log(
                'URL after Back:',
                page.url()
              );

              await showAction(
                page,
                'Session protection verified successfully.'
              );

              console.log(
                'Verified: Session is closed and user is prevented from accessing protected pages.'
              );
            }
          );
        }
      );
    }
  }
);

