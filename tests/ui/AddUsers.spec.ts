import { test } from '../../src/fixtures/auth.fixture';
import { readCsv } from '../../src/utils/csvReader';

type Row = {
  'UserRole': string;
  'EmployeeName': string;
  'Status': string;
  'Username': string;
  'Password': string;
  'ConfirmPassword': string;
};

test.describe('Multiple Users - Single Login', () => {

  test('Login once and add multiple users', async ({
    loggedIn,
    addUser,
    dashboardPage
  }) => {

    // Read user test data from CSV 
    const users = readCsv<Row>('data/AddUser.csv');

    // Login is handled once by the loggedIn fixture

    for (const user of users) {

      // Navigate to Recruitment
      await addUser.clickAdmin();

      

      console.log(
        `Adding user: ${user['Username']}`
      );
      

      // Add user using CSV data
      await addUser.AddUserDetails(
        user['UserRole'],
        user['EmployeeName'],
        user['Status'],
        user['Username'],
        user['Password'],
        user['ConfirmPassword']
      );

      console.log(`User ${user['Username']} added successfully`);
      await addUser.page.waitForTimeout(10000);
    }
    
    // Logout only once after all candidates are added
    await dashboardPage.logout();

    console.log('Application logged out successfully');
  });
});