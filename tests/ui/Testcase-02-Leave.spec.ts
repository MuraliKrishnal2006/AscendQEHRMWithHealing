import { test, expect } from '../../src/fixtures/page.fixture';
import { readCsv } from '../../src/utils/csvReader';
import { userlogin, validUser } from '../../src/data/credentials';



type LeaveRow = {
  'Leave Type': string;
  FromDate: string;
  ToDate: string;
  Comments: string;
  Expected: string;
};

test.describe('Multiple Leaves - Single Login', () => {

  test('employee submits leave, admin approves it, and employee verifies the report', async ({
    page,
    loginPage,
    leavePage,
    leaveListPage,
    dashboardPage,
    reportsPage
  }) => {

    // Read leave test data from CSV
    const leaves = readCsv<LeaveRow>('data/ApplyLeave.csv');

    // Login as specific user
    await loginPage.gotoLogin();

    await loginPage.login(
      userlogin.username,
      userlogin.password
    );

    await expect(dashboardPage.DashBoardheader).toBeVisible();

    await test.step('Employee submits leave requests and verifies validation', async () => {
      for (const leave of leaves) {
        await leavePage.clickLeave();
        await expect(page.getByRole('heading', { name: 'Leave', exact: true })).toBeVisible();
        await leavePage.clickApply();
        await expect(page.getByRole('heading', { name: 'Apply Leave', exact: true })).toBeVisible();
        await leavePage.selectLeaveType(leave['Leave Type']);
        await expect(leavePage.leaveBalance).toBeVisible();
        await leavePage.AddLeaveDetails(leave['FromDate'], leave['ToDate'], leave['Comments']);

        if (leave.Expected === 'Successfully Saved') {
          await expect(leavePage.successMessage).toHaveText(leave.Expected);
        } else if (leave.Expected === 'To date should be after from date') {
          await expect(leavePage.dateValidationMessage).toHaveText(leave.Expected);
        } else {
          await expect(leavePage.errorMessage).toHaveText(leave.Expected);
        }
      }
    });

    // Logout after all leaves are applied
    await dashboardPage.logout();

    await loginPage.verifyUsernameVisible();

    // Login again as Admin
    await loginPage.gotoLogin();



    await loginPage.login(
      validUser.username,
      validUser.password
    );

    await expect(dashboardPage.DashBoardheader).toBeVisible();

    await test.step('Admin searches and approves the submitted request', async () => {
    // Open Leave List/Search page after Admin login
    await leavePage.clickLeave();
    // Verify Leave page is displayed
    await expect(page.getByRole('heading', { name: 'Leave', exact: true })).toBeVisible();

    // Search each leave using CSV dates
    // Employee Name comes from the login user's username
    // Search each successfully saved leave
    for (const leave of leaves) {

  if (leave.Expected !== 'Successfully Saved') {
    continue;
  }

  await leaveListPage.searchLeave(
    leave['FromDate'],
    leave['ToDate'],
    userlogin.username
  );

  await expect(leaveListPage.EmployeeName)
    .not.toHaveValue('');

  await expect(leaveListPage.FromDate)
    .toHaveValue(leave['FromDate']);

  await expect(leaveListPage.ToDate)
    .toHaveValue(leave['ToDate']);

  await expect(leaveListPage.LeaveCheckbox.first())
    .toBeVisible();

  await leaveListPage.approveFirstPendingLeave();

  // Allow approval/update to complete before next search
  await page.waitForTimeout(2000);
}

      await expect(leaveListPage.leaveTable).toBeVisible();
      await expect(leaveListPage.leaveRows.first()).toBeVisible();

      // Verify successful approval
      //await expect(leaveListPage.successMessage).toBeVisible();

      //await expect(leaveListPage.successMessage).toHaveText('Successfully Updated');
    
    });

    // Logout after search
    await dashboardPage.logout();

    await loginPage.verifyUsernameVisible();

    await test.step('Employee verifies the approved leave report', async () => {
    // Login again as specific user

    await loginPage.gotoLogin();
    // Verify Login page is displayed
    await loginPage.verifyUsernameVisible();

    // Login as specific user
    //await loginPage.gotoLogin();

    await loginPage.login(
      userlogin.username,
      userlogin.password
    );
    await expect(dashboardPage.DashBoardheader).toBeVisible({ timeout: 15000 });

    //console.log('Specific user login completed successfully');
    await expect(dashboardPage.DashBoardheader).toBeVisible();
    // Navigate to Leave
    await leavePage.clickLeave();

    await expect(page.getByRole('heading', {
      name: 'Leave', exact: true
    })).toBeVisible();

    // Click Reports → My Leave Entitlements and Usage Report
    await reportsPage.openMyLeaveEntitlementsReport();

    await expect(page.getByRole('heading', {
      name: 'My Leave Entitlements and Usage Report'
    })).toBeVisible();
    await expect(page.locator('.oxd-table')).toBeVisible();
    });

  });
});