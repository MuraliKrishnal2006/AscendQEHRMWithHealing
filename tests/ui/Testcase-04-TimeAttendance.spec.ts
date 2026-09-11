import { userTest } from '../../src/fixtures/auth.fixture';
import { userlogin, validUser } from '../../src/data/credentials';
import { expect } from '@playwright/test';


userTest.describe('Punch In and Punch Out', () => {

  userTest('User Punch In/Out → Logout → Admin Login', async ({
    loggedInUser,
    timePage,
    dashboardPage,
    loginPage,
    leavePage
  }) => {

    // Save the user who was logged in by the fixture
    timePage.setPreviousUser(userlogin.username);



    await timePage.clickTimeMenu();
    await expect(timePage.Attendance).toBeVisible();

    await timePage.clickAttendance();
    await expect(timePage.PunchInOut).toBeVisible();


    await timePage.clickPunchInOut();
    // Verify Punch In button is displayed
    await expect(timePage.InTime).toBeVisible();

    await timePage.punchIn();
    // Verify Punch Out button is displayed after Punch In
    await expect(timePage.OutTime).toBeVisible();

    await timePage.punchOut();
    // Verify Punch In button is displayed again after Punch Out
    await expect(timePage.InTime).toBeVisible();

    await timePage.clickAttendance();
    await expect(timePage.MyRecords).toBeVisible();

    await timePage.clickMyRecords();
    await expect(timePage.MyRecordsHeading).toBeVisible();


    // User: Logout
    await dashboardPage.logout();
    // Verify Login page is displayed after logout
    await expect(loginPage.UsernameInput).toBeVisible();
    await expect(loginPage.PasswordInput).toBeVisible();
    await expect(loginPage.LoginButton).toBeVisible();
    // Admin: Login
    await loginPage.gotoLogin();

    await loginPage.login(
      validUser.username,
      validUser.password
    );

    // Verify Leave option is displayed after login
    await expect(leavePage.Leave).toBeVisible();

    await timePage.clickTimeMenu();
    // Verify Time → Attendance menu is displayed
    await expect(timePage.Attendance).toBeVisible();

    await timePage.clickAttendance();
    // Verify Employee Records option is displayed
    await expect(timePage.EmployeeRecords).toBeVisible();
    await timePage.clickEmployeeRecords();
    // Verify Employee Attendance Records page is displayed
    await expect(timePage.EmployeeAttendanceRecords).toBeVisible();
    // Search the PREVIOUSLY logged-in user
    await timePage.viewMyTime();
    await expect(timePage.AllEmployeeName).toBeVisible();
});
});