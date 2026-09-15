import { test, expect } from '../../src/fixtures/page.fixture';
import { validUser, dashboardHeader } from '../../src/data/credentials';
import { Pimpagedata } from '../../src/data/TC12_UItables';

test.describe('TC12_UItables - PIM Module: Pagination, Sorting & Search Filter', () => {

    test('TC12_UItables: Verify Pagination, Column Sorting, Employee Filter and Reset in PIM', async ({
        page,
        loginPage,
        dashboardPage,
        adminMenu,
        tc12_UItablesPage,
    }) => {

        await loginPage.gotoLogin();

        await loginPage.login(validUser.username, validUser.password);
        await dashboardPage.waitForElement(dashboardPage.DashBoardheader);
        expect(await dashboardPage.getDashBoardHeaderText()).toBe(dashboardHeader);

        await adminMenu.clickPim();
        await expect(page).toHaveURL(/pim/);

        await tc12_UItablesPage.scrollToBottom();
        await tc12_UItablesPage.verifyPaginationIsVisible();
        await expect(tc12_UItablesPage.firstButton).toBeVisible();

        await tc12_UItablesPage.clickSecondButton();
        await expect(tc12_UItablesPage.tableRows.first()).toBeVisible();

        await tc12_UItablesPage.clickEmployeeIdHeader();
        await tc12_UItablesPage.clickSortAscending();
        await expect(tc12_UItablesPage.tableRows.first()).toBeVisible();

        await tc12_UItablesPage.clickEmployeeIdHeader();
        await tc12_UItablesPage.clickSortDescending();
        await expect(tc12_UItablesPage.tableRows.first()).toBeVisible();

        await tc12_UItablesPage.searchAndSelectEmployee(Pimpagedata.empName, Pimpagedata.employee);
        await tc12_UItablesPage.clickSearch();

        await tc12_UItablesPage.scrollToRecord(Pimpagedata.employee);
        await expect(tc12_UItablesPage.tableRows.first()).toContainText(Pimpagedata.employee);

        await tc12_UItablesPage.clickReset();
        await expect(tc12_UItablesPage.employeeNameInput).toHaveValue('');
        await page.waitForTimeout(3000);
    });

});
