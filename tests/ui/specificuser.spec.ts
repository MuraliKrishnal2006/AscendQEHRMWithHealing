import {test, expect} from '../../src/fixtures/page.fixture';
import {specificUser, invalidUser, dashboardHeader, invalidErrorMesage} from '../../src/data/credentials';

test.describe('Specific User Login Tests',()=>{
    test.beforeEach(async({loginPage})=>{
        await loginPage.gotoLogin();
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