
import {test as pagesTest} from '../fixtures/page.fixture';
import {userlogin,validUser} from '../data/credentials';

/**
 * auth.fixture.ts — extends page.fixture.ts (chained, not built from
 * scratch) to add a `loggedIn` fixture: a pre-authenticated session
 * any test can opt into.
 *
 * { auto: false } means this fixture only runs when a test explicitly
 * requests it (e.g. `async ({ loggedIn, dashboardPage }) => {...}`) —
 * tests that don't need auth (like the login-negative-path test) skip
 * this setup entirely, keeping them fast.
 */

export const test = pagesTest.extend<{loggedIn : void}>({
    loggedIn: [async({loginPage,dashboardPage},use)=>{
        await loginPage.gotoLogin();
        await loginPage.login(validUser.username,validUser.password);

         // Confirms login actually succeeded before handing control back
        // to the test — fails fast here rather than deep inside a test
        // with a confusing downstream error.
        
        await dashboardPage.getDashBoardHeaderText();
        await use();
    },{auto : false}]
})
export const userTest = pagesTest.extend<{loggedInUser : void}>({
    loggedInUser: [async({loginPage,dashboardPage},use)=>{
        await loginPage.gotoLogin();
        await loginPage.login(userlogin.username,userlogin.password);

         // Confirms login actually succeeded before handing control back
        // to the test — fails fast here rather than deep inside a test
        // with a confusing downstream error.
        
        await dashboardPage.getDashBoardHeaderText();
        await use();
    },{auto : false}]
})
export const expect = test.expect;