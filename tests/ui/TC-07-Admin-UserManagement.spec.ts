import { test, expect } from '../../src/fixtures/auth.fixture';
import { adminUserData } from '../../src/data/TC-07-AdminUserManagement';
 
 
 
test.describe('TC-07: Admin Module - User Management', () => {
 
    test('TC-07-Admin: Search, Filter by Role, and Edit User Status for pallavin & AscendQETest', async ({
        page,
        loggedIn,
        adminPage
    }) => {
        // 1. Click on Admin module
        await adminPage.clickAdminMenu();
        await expect(page).toHaveURL(/.*admin\/viewSystemUsers.*/);
 
        // 2. Click Username field, fill 'pallavin', click Search
        await adminPage.searchByUsername(adminUserData.searchUsername);
        const pallavinRow = page.locator('.oxd-table-card').filter({ hasText: adminUserData.searchUsername });
        await expect(pallavinRow).toBeVisible();
 
        // 3. Clear the Username field
        await adminPage.clearUsername();
 
        // 4. Click User Role dropdown, select ESS, click Search
        await adminPage.searchByUserRole(adminUserData.userRole);
        await expect(page.locator('.oxd-table-card').first()).toBeVisible();
 
        // 5. Scroll to pallavin and click Edit button
        await adminPage.clickEditUser(adminUserData.searchUsername);
        await expect(page).toHaveURL(/.*admin\/saveSystemUser.*/);
        await expect(page.getByRole('heading', { name: 'Edit User' })).toBeVisible();
 
        // 6. On Edit User form, change status to Disabled and click Save
        await adminPage.updateUserStatus(adminUserData.statusDisabled);
        await expect(page).toHaveURL(/.*admin\/viewSystemUsers.*/);
 
        // 7. Research Username: fill 'pallavin' and click Search
        await adminPage.searchByUsername(adminUserData.searchUsername);
        await expect(pallavinRow).toBeVisible();
        await expect(pallavinRow).toContainText(adminUserData.statusDisabled);
 
        // 8. Scroll to pallavin and click Edit button
        await adminPage.clickEditUser(adminUserData.searchUsername);
        await expect(page).toHaveURL(/.*admin\/saveSystemUser.*/);
 
        // 9. On Edit User form, change status to Enabled and click Save
        await adminPage.updateUserStatus(adminUserData.statusEnabled);
        await expect(page).toHaveURL(/.*admin\/viewSystemUsers.*/);
 
        // 10. Scroll and open 'AscendQETest'
        await adminPage.openEditForUser(adminUserData.secondUsername);
        await expect(page).toHaveURL(/.*admin\/saveSystemUser.*/);
        await expect(page.getByRole('heading', { name: 'Edit User' })).toBeVisible();
    });
 
});