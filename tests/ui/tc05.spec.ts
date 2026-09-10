import { test, expect } from '../../src/fixtures/page.fixture';
import { validUser, userlogin, dashboardHeader } from '../../src/data/credentials';

test.describe('TC05 - Dashboard Widget Navigation, Refresh & ESS Dashboard Interaction', () => {

    test('TC05: Admin & ESS Dashboard Quick Launch, Widget Navigation, Page Refresh, and Logout', async ({
        page,
        loginPage,
        dashboardPage,
        commonMenu
    }) => {
    
        await loginPage.gotoLogin();

        await loginPage.login(validUser.username, validUser.password);

        expect(await dashboardPage.getDashBoardHeaderText()).toBe(dashboardHeader);
        await expect(dashboardPage.quickLaunchWidget).toBeVisible();
      

        await dashboardPage.clickQuickLaunch('Assign Leave');
        await expect(page).toHaveURL(/leave/);

        await commonMenu.clickDashboard();
        await expect(page).toHaveURL(/dashboard/);

        await dashboardPage.scrollToWidget('Employee Distribution by Sub Unit');
        await dashboardPage.clickWidget('Employee Distribution by Sub Unit');
        await expect(dashboardPage.employeeDistributionSubUnitWidget).toBeVisible();


        await commonMenu.clickDashboard();
        await expect(page).toHaveURL(/dashboard/);


        await dashboardPage.refreshDashboard();
        expect(await dashboardPage.getDashBoardHeaderText()).toBe(dashboardHeader);

        await dashboardPage.logout();
        await expect(page).toHaveURL(/auth\/login/);

        await loginPage.gotoLogin();

        await loginPage.login(userlogin.username, userlogin.password);

        expect(await dashboardPage.getDashBoardHeaderText()).toBe(dashboardHeader);
        await expect(dashboardPage.quickLaunchWidget).toBeVisible();
        await expect(dashboardPage.myActionsWidget).toBeVisible();

        await dashboardPage.clickQuickLaunch('My Leave');
        await expect(page).toHaveURL(/leave/);
        await page.waitForTimeout(3000);

    });

});
