import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AddEmployee } from '../pages/AddEmployee';
import { AddUser } from '../pages/AddUser';
import { LeavePage } from '../pages/LeavePage';
import { PimPage } from '../pages/PimPage';
import { EmployeeDetailsPage } from '../pages/TC-03-PIMemployee';
import { PimPages } from '../pages/PimPages';
import { Tc12_UItablesPage } from '../pages/Tc12_UItablesPage';
import { AdminMenuComponent } from '../components/adminmenu';
import { CommonMenuComponent } from '../components/commonmenuitems';

/**
 * page.fixture.ts — injects every Page Object into tests as a fixture,
 * so specs never do `new LoginPage(page)` manually.
 */

type Pages = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    addEmployee: AddEmployee;
    addUser: AddUser;
    leavePage: LeavePage;
    pimPage: PimPage;
    employeeDetailsPage: EmployeeDetailsPage;
    pimPages: PimPages;
    tc12_UItablesPage: Tc12_UItablesPage;
    tc12Page: Tc12_UItablesPage;
    adminMenu: AdminMenuComponent;
    commonMenu: CommonMenuComponent;
};

export const test = base.extend<Pages>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },
    addEmployee: async ({ page }, use) => {
        await use(new AddEmployee(page));
    },
    addUser: async ({ page }, use) => {
        await use(new AddUser(page));
    },
    pimPage: async ({ page }, use) => {
        await use(new PimPage(page));
    },
    leavePage: async ({ page }, use) => {
        await use(new LeavePage(page));
    },
    employeeDetailsPage: async ({ page }, use) => {
        await use(new EmployeeDetailsPage(page));
    },
    pimPages: async ({ page }, use) => {
        await use(new PimPages(page));
    },
    tc12_UItablesPage: async ({ page }, use) => {
        await use(new Tc12_UItablesPage(page));
    },
    tc12Page: async ({ page }, use) => {
        await use(new Tc12_UItablesPage(page));
    },
    adminMenu: async ({ page }, use) => {
        await use(new AdminMenuComponent(page));
    },
    commonMenu: async ({ page }, use) => {
        await use(new CommonMenuComponent(page));
    },
});

export const expect = test.expect;