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

    // 1. Launch browser & navigate to URL
    await loginPage.gotoLogin();

    // 2. Enter Username, Password and click Login
    await loginPage.login(
      validUser.username,
      validUser.password
    );
    console.log(`Logged in as Admin: ${validUser.username}`);

    // Verify Admin Dashboard is visible
    await dashboardPage.getDashBoardHeaderText();

    // 3. Click PIM from the Left Navigation Panel
    await pimPages.clickPimMenu();
    console.log('Navigated to PIM module');
    await page.waitForTimeout(4000);

    // 4. Click Employee Name search field, enter employee name, and click Search
    console.log('Searching by Employee Name: Priya');
    await pimPage.searchByEmployeeName('verma');
    await page.waitForTimeout(4000);

    // 5. Clear the Employee Name filter
    await pimPage.clearEmployeeName();
    console.log('Cleared Employee Name filter');

    // 6. Click Employee Id field, enter employee id, and click Search
    console.log('Searching by Employee ID: EMP9002');
    await pimPage.searchByEmployeeId('EMP9002');
    await page.waitForTimeout(4000);

    // 7. Clear filters, click Employment Status drop-down, select status, and click Search
    console.log('Clearing filters and searching by Employment Status: Full-Time Permanent');
    await pimPage.resetSearch();
    await pimPage.searchByEmploymentStatus('Full-Time Permanent');

    // 8. Click on a matching result row to view details
    console.log('Clicking matching result row...');
    await pimPage.clickFirstResultRow();

    // 9. Return to Employee List and click Reset/Clear button
    console.log('Returning to Employee List and clicking Reset...');
    await pimPage.resetSearch();
    await page.waitForTimeout(4000);
    // 10. Click Directory from the Left Navigation Panel
    await directoryPage.clickDirectory();
    await page.waitForTimeout(4000);
    // 11. Enter Employee Name (lower-case) in the Directory Name search field and click Search
    console.log('Searching Directory by name: verma');
    await directoryPage.searchByNameOrText('verma');
    await page.waitForTimeout(4000);
    // 12. Clear all filters and click Search with no criteria entered
    console.log('Clearing Directory filters...');
    await directoryPage.resetFilters();
    console.log('Searching Directory with no criteria...');
    await directoryPage.searchWithNoCriteria();
    await page.waitForTimeout(4000);
    console.log('\nTC06 test execution completed successfully.');
  });
});
