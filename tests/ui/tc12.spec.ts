import { test, expect } from '../../src/fixtures/page.fixture';
import { validUser, dashboardHeader } from '../../src/data/credentials';
import { Pimpagedata } from '../../src/data/TC12';

test.describe('TC12 - PIM Module: Pagination, Sorting & Search Filter', () => {

    test('TC12: Verify Pagination, Column Sorting, Employee Filter and Reset in PIM', async ({
        page,
        loginPage,
        dashboardPage,
        adminMenu,
        tc12Page,
    }) => {

        await loginPage.gotoLogin();

        await loginPage.login(validUser.username, validUser.password);
        await dashboardPage.waitForElement(dashboardPage.DashBoardheader);
        expect(await dashboardPage.getDashBoardHeaderText()).toBe(dashboardHeader);

        await adminMenu.clickPim();
        await expect(page).toHaveURL(/pim/);
        await page.waitForLoadState('networkidle').catch(() => {});

        await tc12Page.scrollToBottom();
        await tc12Page.verifyPaginationIsVisible();
        await expect(tc12Page.firstButton).toBeVisible();

        await tc12Page.clickSecondButton();
        await expect(tc12Page.tableRows.first()).toBeVisible();

        await tc12Page.clickEmployeeIdHeader();
        await tc12Page.clickSortAscending();
        await expect(tc12Page.tableRows.first()).toBeVisible();

        await tc12Page.clickEmployeeIdHeader();
        await tc12Page.clickSortDescending();
        await expect(tc12Page.tableRows.first()).toBeVisible();

        await tc12Page.searchAndSelectEmployee(Pimpagedata.empName, Pimpagedata.employee);
        await tc12Page.clickSearch();

        await tc12Page.scrollToRecord(Pimpagedata.employee);
        await expect(tc12Page.tableRows.first()).toContainText(Pimpagedata.employee);

        await tc12Page.clickReset();
        await expect(tc12Page.employeeNameInput).toHaveValue('');
        await page.waitForTimeout(3000);
    });

});
