import { test, expect } from '../../src/fixtures/page.fixture';
import { validUser, userlogin, dashboardHeader } from '../../src/data/credentials';

test.describe('TC11 - Navigation Menu, Sidebar Toggle, Rapid Navigation & ESS Role Inspection', () => {
    test('TC11: Complete Left Navigation Workflow for Admin and ESS Users', async ({ page, loginPage, dashboardPage, adminMenu, commonMenu }) => {
        await loginPage.gotoLogin();

        await loginPage.login(validUser.username, validUser.password);
        expect(await dashboardPage.getDashBoardHeaderText()).toBe(dashboardHeader);

        await adminMenu.clickAdmin();
        await expect(page).toHaveURL(/admin/);

        await adminMenu.clickPim();
        await expect(page).toHaveURL(/pim/);

        await commonMenu.clickLeave();
        await expect(page).toHaveURL(/leave/);

        await commonMenu.clickTime();
        await expect(page).toHaveURL(/time/);

        await commonMenu.clickDashboard();
        await expect(page).toHaveURL(/dashboard/);

        await commonMenu.clickDirectory();
        await expect(page).toHaveURL(/directory/);
 
        for (let i = 0; i < 3; i++) {
            await adminMenu.clickPim();
            await expect(page).toHaveURL(/pim/);

            await commonMenu.clickLeave();
            await expect(page).toHaveURL(/leave/);

            await adminMenu.clickAdmin();
            await expect(page).toHaveURL(/admin/);

            await commonMenu.clickDashboard();
            await expect(page).toHaveURL(/dashboard/);
        }

        await commonMenu.clickCollapse();
        await expect(commonMenu.collapse).toBeVisible();

        await commonMenu.clickExpand();
        await expect(commonMenu.search).toBeVisible();

        await dashboardPage.logout();
        await expect(page).toHaveURL(/auth\/login/);

        await loginPage.login(userlogin.username, userlogin.password);
        expect(await dashboardPage.getDashBoardHeaderText()).toBe(dashboardHeader);
        await expect(dashboardPage.DashBoardheader).toBeVisible();
        await page.waitForTimeout(3000);

        await expect(adminMenu.admin).not.toBeVisible();
        await expect(adminMenu.maintenance).not.toBeVisible();

        await commonMenu.verifyMenuItemsAreVisible();
    });
});
