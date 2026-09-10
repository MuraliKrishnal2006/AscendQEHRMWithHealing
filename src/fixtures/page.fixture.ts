import {test as base} from '@playwright/test';
import {LoginPage} from '../pages/LoginPage';
import {DashboardPage} from '../pages/DashboardPage';
import {AddEmployee} from '../pages/AddEmployee';
import { AddUser } from '../pages/AddUser';
import { Timepage } from '../pages/Timepage';
import { LeavePage } from '../pages/LeavePage';
import { LeaveListPage} from '../pages/LeaveListPage';
import { ReportsPage } from '../pages/ReportsPage';
import { DirectoryPage } from '../pages/DirectoryPage';
import { PimPage } from '../pages/PimPage';
import {EmployeeDetailsPage} from '../pages/TC-03-PIMemployee';
import {AdminPage} from '../pages/TC-07-AdminUserManagement';
import { PimPages } from '../pages/PimPages';
import { TC12Page } from '../pages/TC12 1';
import { AdminMenuComponent } from '../components/adminmenu';
import { CommonMenuComponent } from '../components/commonmenuitems';




 
/**
 * page.fixture.ts — injects every Page Object into tests as a fixture,
 * so specs never do `new LoginPage(page)` manually. Add a new page
 * class here once, and every test gets access to it via destructuring
 * (e.g. `async ({ loginPage }) => {...}`).
 */

 type Pages ={
    loginPage : LoginPage;
    dashboardPage : DashboardPage;
    addEmployee : AddEmployee;
    addUser : AddUser;
    timePage : Timepage;
    leavePage : LeavePage;
    leaveListPage : LeaveListPage;
    reportsPage : ReportsPage;
    directoryPage:DirectoryPage;
    pimPage : PimPage;
    employeeDetailsPage : EmployeeDetailsPage;
    adminPage : AdminPage;
    pimPages: PimPages;
    tc12Page:TC12Page;
    adminMenu: AdminMenuComponent;
    commonMenu: CommonMenuComponent;
};

 export const test = base.extend<Pages>({
    loginPage : async ({page},use)=>{
        await use(new LoginPage(page));
    },
    dashboardPage : async ({page},use)=>{
        await use(new DashboardPage(page));
    },
   
    addEmployee : async ({page},use)=>{
        await use(new AddEmployee(page));
    },
     
    addUser : async ({page},use)=>{
        await use(new AddUser(page));
    },
    pimPage : async ({page},use)=>{
        await use(new PimPage(page));
    },
    timePage : async ({page},use)=>{
        await use(new Timepage(page));
    },
    leavePage : async ({page},use)=>{
        await use(new LeavePage(page));
    },
    leaveListPage : async ({page},use)=>{
        await use(new LeaveListPage(page));
    },
    reportsPage : async ({page},use)=>{
        await use(new ReportsPage(page));
    },
    directoryPage : async ({page},use)=>{
        await use(new DirectoryPage(page));
    },
    employeeDetailsPage : async ({page},use)=>{
        await use(new EmployeeDetailsPage(page));
    },
    adminPage : async ({page},use)=>{
        await use(new AdminPage(page));
    },
    pimPages : async ({page},use)=>{
        await use(new PimPages(page));
    },
    tc12Page : async ({ page }, use)=>{
        await use(new TC12Page(page));
    },
    adminMenu : async ({page},use)=>{
        await use(new AdminMenuComponent(page));
    },
    commonMenu : async ({page},use)=>{
        await use(new CommonMenuComponent(page));
    },


 });

 export const expect = test.expect;