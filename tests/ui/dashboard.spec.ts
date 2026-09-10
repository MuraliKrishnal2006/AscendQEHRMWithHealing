import {test, expect} from '../../src/fixtures/auth.fixture';

test('Dashboard Header Test',{tag : '@smoke'},async({loggedIn,dashboardPage})=>{
    const headerText = await dashboardPage.getDashBoardHeaderText();
    expect(headerText).toBe('Dashboard');
})