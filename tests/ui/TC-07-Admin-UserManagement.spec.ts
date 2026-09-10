import { test, expect } from '../../src/fixtures/auth.fixture';
import { adminUserData } from '../../src/data/TC-07-AdminUserManagement';

// Slows down actions by 1 second for visual observation
test.use({
    launchOptions: {
        slowMo: 1000,
    },
});

test.describe('TC-07: Admin Module - User Management', () => {

    test('TC-07-Admin: Search, Filter by Role, and Edit User Status for pallavin & AscendQETest', async ({
        page,
        loggedIn,
        adminPage
    }) => { 
        // 1. Click on Admin module
        await adminPage.clickAdminMenu();

        // 2. Click Username field, fill 'pallavin', click Search
        await adminPage.searchByUsername(adminUserData.searchUsername);

        // 3. Clear the Username field
        await adminPage.clearUsername();

        // 4. Click User Role dropdown, select ESS, click Search
        await adminPage.searchByUserRole(adminUserData.userRole);

        // 5. Scroll to pallavin and click Edit button
        await adminPage.clickEditUser(adminUserData.searchUsername);

        // 6. On Edit User form, change status to Disabled and click Save
        await adminPage.updateUserStatus(adminUserData.statusDisabled);

        // 7. Research Username: fill 'pallavin' and click Search
        await adminPage.searchByUsername(adminUserData.searchUsername);

        // 8. Scroll to pallavin and click Edit button
        await adminPage.clickEditUser(adminUserData.searchUsername);

        // 9. On Edit User form, change status to Enabled and click Save
        await adminPage.updateUserStatus(adminUserData.statusEnabled);

        // 10. Scroll and open 'AscendQETest'
        await adminPage.openEditForUser(adminUserData.secondUsername);
    });

});

