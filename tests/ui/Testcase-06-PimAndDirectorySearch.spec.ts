import { test, expect } from '../../src/fixtures/page.fixture';
import { validUser } from '../../src/data/credentials';

test.describe('TC06 - PIM Search Filters and Directory Verification', () => {

  test('Perform Employee searches by Name, ID, Employment Status and Directory searches', async ({
    page,
    loginPage,
    dashboardPage,
    pimPages,
    pimPage,
    directoryPage
  }) => {

    await loginPage.gotoLogin();
    await expect(page).toHaveURL(/.*auth\/login/);
    await expect(loginPage.UsernameInput).toBeVisible();

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

    console.log('Searching by Employee Name: verma');
    await pimPage.searchByEmployeeName('verma');
    await expect(pimPage.tableRows.first()).toBeVisible();
    await expect(pimPage.tableRows.first()).toContainText(/verma/i);

    await pimPage.clearEmployeeName();
    await expect(pimPage.employeeName).toHaveValue('');
    console.log('Cleared Employee Name filter');

    console.log('Searching by Employee ID: EMP9002');
    await pimPage.searchByEmployeeId('EMP9002');
    await expect(pimPage.tableRows.first()).toBeVisible();
    await expect(pimPage.tableRows.first()).toContainText('EMP9002');

    console.log('Clearing filters and searching by Employment Status: Full-Time Permanent');
    await pimPage.resetSearch();
    await pimPage.searchByEmploymentStatus('Full-Time Permanent');
    await expect(pimPage.tableRows.first()).toBeVisible();
    await expect(pimPage.tableRows.first()).toContainText('Full-Time Permanent');

    console.log('Clicking matching result row...');
    await pimPage.clickFirstResultRow();
    await expect(page).toHaveURL(/.*pim\/viewPersonalDetails/);
    await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();

    console.log('Returning to Employee List and clicking Reset...');
    await pimPage.resetSearch();
    await expect(page).toHaveURL(/.*pim\/viewEmployeeList/);
    await expect(pimPage.employeeId).toHaveValue('');

    await directoryPage.clickDirectory();
    await expect(page).toHaveURL(/.*directory\/viewDirectory/);
    await expect(page.getByRole('heading', { name: 'Directory', exact: true })).toBeVisible();

    console.log('Searching Directory by name: verma');
    await directoryPage.searchByNameOrText('verma');
    await expect(directoryPage.directoryCards.first()).toBeVisible();
    await expect(directoryPage.directoryCards.first()).toContainText(/verma/i);

    console.log('Clearing Directory filters...');
    await directoryPage.resetFilters();
    await expect(directoryPage.employeeNameInput).toHaveValue('');

    console.log('Searching Directory with no criteria...');
    await directoryPage.searchWithNoCriteria();
    await expect(directoryPage.directoryCards.first()).toBeVisible();
    const cardCount = await directoryPage.directoryCards.count();
    expect(cardCount).toBeGreaterThan(0);

    console.log('\nTC06 test execution completed successfully.');
  });
});
