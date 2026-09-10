import {test, expect} from '../../src/fixtures/page.fixture';
import {validUser, invalidUser, dashboardHeader, invalidErrorMesage, specificUser} from '../../src/data/credentials';

test.describe('Login Tests',()=>{
    test.beforeEach(async({loginPage})=>{
        await loginPage.gotoLogin();
    });
    test('valid login - Admin',{tag :'@smoke'},async({loginPage,dashboardPage})=>{
        await loginPage.login(validUser.username,validUser.password);
        const headerText = await dashboardPage.getDashBoardHeaderText();
        expect(headerText).toBe(dashboardHeader);
    });
      test('valid login - Specific User',{tag :'@smoke'},async({loginPage,dashboardPage})=>{
        await loginPage.login(specificUser.username,specificUser.password);
        const headerText = await dashboardPage.getDashBoardHeaderText();
        expect(headerText).toBe(dashboardHeader);
    });
    test('Invalid login',{tag :'@regression'},async({loginPage})=>{
        await loginPage.login(invalidUser.username,invalidUser.password);
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe(invalidErrorMesage);
    });
});