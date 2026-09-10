import { userTest } from '../../src/fixtures/auth.fixture';
import { userlogin, validUser } from '../../src/data/credentials';


userTest.describe('Punch In and Punch Out', () => {

  userTest('User Punch In/Out → Logout → Admin Login', async ({
    loggedInUser,
    timePage,
    dashboardPage,
    loginPage
  }) => {

    // Save the user who was logged in by the fixture
    timePage.setPreviousUser(userlogin.username);

    console.log(`Previous user saved: ${userlogin.username}`);

    await timePage.clickTimeMenu();

    await timePage.clickAttendance();

    await timePage.clickPunchInOut();

    await timePage.punchIn();
    console.log('Punch In completed');

    await timePage.punchOut();
    console.log('Punch Out completed');

    await timePage.waitForElement(timePage.InTime);
    console.log('Punch In button is displayed again');

    await timePage.clickAttendance();

    await timePage.clickMyRecords();



    // User: Logout
    await dashboardPage.logout();
    console.log('User muralikrishna.l logged out');

    // Admin: Login
    await loginPage.gotoLogin();

    await loginPage.login(
      validUser.username,
      validUser.password
    );

    console.log('Admin AscendQETest logged in successfully');

    await timePage.clickTimeMenu();
    await timePage.clickAttendance();
    await timePage.clickEmployeeRecords();
    // Search the PREVIOUSLY logged-in user
    await timePage.viewMyTime();






  });
});