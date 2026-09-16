import { test, expect } from '../../src/fixtures/auth.fixture';
import { Pimpagedata } from '../../src/data/pimpagedata';
import { readCsv } from '../../src/utils/csvReader';

type EmployeeRow = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const employees = readCsv<EmployeeRow>('data/employee.csv');

test.describe('PIM page tests', () => {
  test('PIM search page test', async ({ page, loggedIn, pimPage }) => {
    await pimPage.clickPimMenu();
    await expect(page).toHaveURL(/.*pim\/viewEmployeeList/);

    await pimPage.employeesearchPartial(
      Pimpagedata.empName,
      Pimpagedata.employee,
      Pimpagedata.employeeId,
      Pimpagedata.employeeStatus
    );

    // Assert that search results table is displayed and contains matching record
    await expect(pimPage.tableRows.first()).toBeVisible();
    await expect(page.locator('.oxd-table-card')).toContainText(Pimpagedata.employee);
  });
});

test.describe('Add Employee data-driven tests', () => {
  test.describe.configure({ mode: 'serial' });

  for (const emp of employees) {
    test(`Add Employee - ${emp.firstName} ${emp.lastName}`, async ({ page, loggedIn, pimPage, addEmployee }) => {
      await pimPage.clickPimMenu();
      await expect(page).toHaveURL(/.*pim\/viewEmployeeList/);

      await addEmployee.AddEmployeeDetails(
        emp.firstName,
        emp.lastName,
        emp.username,
        emp.password,
        emp.confirmPassword
      );

      // Assert that employee was successfully added and navigated to Personal Details
      await expect(page).toHaveURL(/.*pim\/viewPersonalDetails.*/);
      await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();
    });
  }
});

test.describe('Multiple Employees - Single Login', () => {

  test('Login once and add multiple employees', async ({
    page,
    loggedIn,
    pimPage,
    addEmployee,
    dashboardPage
  }) => {

    // Login is handled once by the loggedIn fixture
    for (const emp of employees) {
      await pimPage.clickPimMenu();
      await expect(page).toHaveURL(/.*pim\/viewEmployeeList/);

      await addEmployee.AddEmployeeDetails(
        emp.firstName,
        emp.lastName,
        emp.username,
        emp.password,
        emp.confirmPassword
      );

      // Assert that employee was successfully added
      await expect(page).toHaveURL(/.*pim\/viewPersonalDetails.*/);

      // Wait after one employee is saved before processing the next employee
      await addEmployee.page.waitForTimeout(5000);
    }

    // Logout once after all employees are added
    await addEmployee.page.waitForTimeout(5000);
    await dashboardPage.logout();

    // Assert successful logout redirects to login page
    await expect(page).toHaveURL(/.*auth\/login.*/);
  });
});
