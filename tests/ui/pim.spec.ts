import { test } from '../../src/fixtures/auth.fixture';
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
  test('PIM search page test', async ({ loggedIn, pimPage }) => {
    await pimPage.clickPimMenu();
    await pimPage.employeesearchPartial(
      Pimpagedata.empName,
      Pimpagedata.employee,
      Pimpagedata.employeeId,
      Pimpagedata.employeeStatus
    );
  });
});

test.describe('Add Employee data-driven tests', () => {
  test.describe.configure({ mode: 'serial' });

  for (const emp of employees) {
    test(`Add Employee - ${emp.firstName} ${emp.lastName}`, async ({ loggedIn, pimPage, addEmployee }) => {
      await pimPage.clickPimMenu();
      await addEmployee.AddEmployeeDetails(
        emp.firstName,
        emp.lastName,
        emp.username,
        emp.password,
        emp.confirmPassword
      );
    });
  }
});
test.describe('Multiple Employees - Single Login', () => {

  test('Login once and add multiple employees', async ({
    loggedIn,
    pimPage,
    addEmployee,
    dashboardPage
  }) => {

    // Login is handled once by the loggedIn fixture
       
    for (const emp of employees) {

      await pimPage.clickPimMenu();

      await addEmployee.AddEmployeeDetails(
        emp.firstName,
        emp.lastName,
        emp.username,
        emp.password,
        emp.confirmPassword
      );
      // Wait after one employee is saved before processing the next employee
      await addEmployee.page.waitForTimeout(5000);
    }

   
    // Logout once after all employees are added
     await addEmployee.page.waitForTimeout(5000);
    await dashboardPage.logout();
  });
});
