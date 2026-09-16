import { test, expect } from '../../src/fixtures/page.fixture';
import { tc09LoginData } from '../../src/data/TC-09-Login';

test.describe('TC-09: Login Security and Validation', () => {
    test.beforeEach(async () => {
        test.setTimeout(300000);
    });

    test('TC-09: Field Validation, Invalid Credentials, and Successful Login', async ({
        page,
        loginPage,
        dashboardPage,
    }) => {
        test.setTimeout(300000);
        // 1 & 2. Launch the web browser & navigate to URL: https://ascendqe.org/
        await test.step('1 & 2: Launch the web browser and navigate to https://ascendqe.org/', async () => {
            await page.goto('https://ascendqe.org/');
        });

        // 3. Click the Login button without entering a Username or Password.
        await test.step('3: Click the Login button without entering a Username or Password', async () => {
            await loginPage.clickLogin();
            const emptyErrors = await loginPage.getFieldErrors();
            expect(emptyErrors).toContain(tc09LoginData.expectedRequiredError);
            expect(emptyErrors.length).toBe(2);
        });

        // 4. Click the Username field and enter AscendQETest; leave the Password field blank, then click Login.
        await test.step('4: Click the Username field and enter AscendQETest; leave the Password field blank, then click Login', async () => {
            await loginPage.clickUsername();
            await loginPage.fillUsername(tc09LoginData.initialUsername);
            await loginPage.clickLogin();
            const usernameOnlyErrors = await loginPage.getFieldErrors();
            expect(usernameOnlyErrors).toContain(tc09LoginData.expectedRequiredError);
            expect(usernameOnlyErrors.length).toBe(1);
        });

        // 5. Clear both fields; enter an invalid username wronguser and an invalid password wrongpass123, then click Login.
        await test.step('5: Clear both fields; enter an invalid username wronguser and an invalid password wrongpass123, then click Login', async () => {
            await loginPage.clearFields();
            await loginPage.fillUsername(tc09LoginData.invalidUsername);
            await loginPage.fillPassword(tc09LoginData.invalidPassword);
            await loginPage.clickLogin();
            const alertStep5 = await loginPage.getAlertErrorMessage();
            expect(alertStep5).toBe(tc09LoginData.expectedInvalidCredentialsError);
        });

        // 6. Clear both fields; enter the valid username AscendQETest with an incorrect password, then click Login.
        await test.step('6: Clear both fields; enter the valid username AscendQETest with an incorrect password, then click Login', async () => {
            await loginPage.clearFields();
            await loginPage.fillUsername(tc09LoginData.validUsername);
            await loginPage.fillPassword(tc09LoginData.invalidPassword);
            await loginPage.clickLogin();
            const alertStep6 = await loginPage.getAlertErrorMessage();
            expect(alertStep6).toBe(tc09LoginData.expectedInvalidCredentialsError);
        });

        // 7. Clear both fields; enter an incorrect username with the valid password @Ascendqe123, then click Login.
        await test.step('7: Clear both fields; enter an incorrect username with the valid password @Ascendqe123, then click Login', async () => {
            await loginPage.clearFields();
            await loginPage.fillUsername(tc09LoginData.step7IncorrectUsername);
            await loginPage.fillPassword(tc09LoginData.validPassword);
            await loginPage.clickLogin();
            const alertStep7 = await loginPage.getAlertErrorMessage();
            expect(alertStep7).toBe(tc09LoginData.expectedInvalidCredentialsError);
        });

        // 8. Clear both fields; enter the valid username AscendQETest and valid password @Ascendqe123, then click Login.
        await test.step('8: Clear both fields; enter the valid username AscendQETest and valid password @Ascendqe123, then click Login', async () => {
            await loginPage.clearFields();
            await loginPage.fillUsername(tc09LoginData.validUsername);
            await loginPage.fillPassword(tc09LoginData.validPassword);
            await loginPage.clickLogin();
            await page.waitForURL(/.*dashboard.*/);
            const headerText = await dashboardPage.getDashBoardHeaderText();
            expect(headerText).toBe(tc09LoginData.dashboardHeader);
        });
    });

});
