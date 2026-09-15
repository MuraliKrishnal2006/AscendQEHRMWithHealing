import { test, expect } from '../../src/fixtures/auth.fixture';
import { pimEmployeeData } from '../../src/data/TC-03-PIMemployee';
 
 
test.describe('TC-03: PIM Module - Employee Details Update', () => {
    test.setTimeout(300000);
 
    test('TC-03-PIM: Search Lakshmi Sai Inaganti and update Personal, Contact, and Job details', async ({
        loggedIn,
        page,
        pimPages,
        employeeDetailsPage
    }) => {
        // 1. Navigate to PIM module
        await pimPages.clickPimMenu();
        await expect(page).toHaveURL(/.*pim\/viewEmployeeList/);
        await expect(page.getByRole('heading', { name: 'PIM' })).toBeVisible();
 
        // 2. Search for employee 'Lakshmi Sai Inaganti' & click Search
        await pimPages.searchEmployeeByName(pimEmployeeData.searchEmployeeName);
        const searchResultCard = page.locator('.oxd-table-card').filter({ hasText: pimEmployeeData.employeeCellText }).first();
        await expect(searchResultCard).toBeVisible();
 
        // 3. Scroll & click on employee in search results
        await pimPages.selectEmployeeFromResults(pimEmployeeData.employeeCellText);
        await expect(page).toHaveURL(/.*pim\/viewPersonalDetails.*/);
        await expect(employeeDetailsPage.personalDetailsTab).toBeVisible();
 
        // 4. Personal Details Tab: Fill Nickname ('Geetu'), Marital Status ('Married'), DOB ('2003-10-10') and Save
        await employeeDetailsPage.updatePersonalDetails(
            pimEmployeeData.nickname,
            pimEmployeeData.maritalStatus,
            pimEmployeeData.dateOfBirth
        );
        // Verify Personal Details updated
        await expect(employeeDetailsPage.nicknameInput).toHaveValue(pimEmployeeData.nickname);
        await expect(employeeDetailsPage.dateOfBirthInput).toHaveValue(pimEmployeeData.dateOfBirth);
 
        // 5. Contact Details Tab: Click link
        await employeeDetailsPage.clickContactDetailsTab();
        await expect(page).toHaveURL(/.*pim\/contactDetails.*/);
        await expect(employeeDetailsPage.mobileInput).toBeVisible();
        await expect(employeeDetailsPage.workEmailInput).toBeVisible();
 
        // 6. Fill Mobile ('9876543210') & Work Email ('geetika.s1@ascendqe.com') and Save
        await employeeDetailsPage.fillContactDetails(
            pimEmployeeData.mobile,
            pimEmployeeData.validWorkEmail
        );
        // Verify Contact Details updated
        await expect(employeeDetailsPage.mobileInput).toHaveValue(pimEmployeeData.mobile);
 
        // 7. Negative test: Clear and enter invalid email ('geeti@12.com.') & Save
        await employeeDetailsPage.testInvalidWorkEmail(pimEmployeeData.invalidWorkEmail);
 
        // 8. Assert validation message appears
        await expect(employeeDetailsPage.workEmailErrorMessage).toBeVisible();
        const validationMsg = await employeeDetailsPage.getWorkEmailValidationMessage();
        expect(validationMsg).toBe(pimEmployeeData.emailValidationMessage);
 
        // 9. Re-enter valid email and Save
        await employeeDetailsPage.correctWorkEmailAndSave(pimEmployeeData.validWorkEmail);
        await expect(employeeDetailsPage.workEmailInput).toHaveValue(pimEmployeeData.validWorkEmail);
        await expect(employeeDetailsPage.workEmailErrorMessage).not.toBeVisible();
 
        // 10. Job Tab: Click link
        await employeeDetailsPage.clickJobTab();
        await expect(page).toHaveURL(/.*pim\/viewJobDetails.*/);
        await expect(employeeDetailsPage.jobTitleDropdown).toBeVisible();
 
        // 11. Select Job Title ('AI Engineer'), Sub Unit ('Engineering'), Employment Status ('Full-Time Permanent') and Save
        await employeeDetailsPage.updateJobDetails(
            pimEmployeeData.jobTitle,
            pimEmployeeData.subUnit,
            pimEmployeeData.employmentStatus
        );
        await expect(employeeDetailsPage.jobSaveButton).toBeVisible();
 
        // 12. Add Attachment: Click '+ Add', browse & upload 'what is agent' file, fill comment 'EMP9001', and Save
        await employeeDetailsPage.addAttachment(
            pimEmployeeData.attachmentFilePath,
            pimEmployeeData.attachmentComment
        );
        // Verify attachment is present in Attachments table
        await expect(page.getByText(pimEmployeeData.attachmentFileName).first()).toBeVisible();
        await expect(page.getByText(pimEmployeeData.attachmentComment).first()).toBeVisible();
 
        // 13. Navigate to Admin module
        await pimPages.clickAdminMenu();
        await expect(page).toHaveURL(/.*admin\/viewSystemUsers/);
        await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible();
 
        // 14. Navigate to PIM module
        await pimPages.clickPimMenu();
        await expect(page).toHaveURL(/.*pim\/viewEmployeeList/);
 
        // 15. Search for Employee Name 'Lakshmi Sai Inaganti' & click Search
        await pimPages.searchEmployeeByName(pimEmployeeData.searchEmployeeName);
        await expect(page.locator('.oxd-table-card').filter({ hasText: pimEmployeeData.employeeCellText }).first()).toBeVisible();
 
        // 16. Click on employee 'Lakshmi Sai Inaganti' in search results to open Personal Details
        await pimPages.selectEmployeeFromResults(pimEmployeeData.employeeCellText);
        await expect(page).toHaveURL(/.*pim\/viewPersonalDetails.*/);
 
        // 17. Click on Job tab
        await employeeDetailsPage.clickJobTab();
        await expect(page).toHaveURL(/.*pim\/viewJobDetails.*/);
 
        // 18. Scroll up/down to see the Attachments section
        await employeeDetailsPage.scrollToAttachments();
        await expect(employeeDetailsPage.attachmentsSection).toBeVisible();
        await expect(page.getByText(pimEmployeeData.attachmentFileName).first()).toBeVisible();
 
        // 19. Refresh the page (F5 / reload)
        await page.reload();
        await expect(page).toHaveURL(/.*pim\/viewJobDetails.*/);
 
        // 20. Navigate to PIM module
        await pimPages.clickPimMenu();
        await expect(page).toHaveURL(/.*pim\/viewEmployeeList/);
 
        // 21. Search by Job Title: Select 'AI Engineer' from dropdown and click Search
        await pimPages.searchByJobTitle(pimEmployeeData.jobTitle);
        await expect(page.locator('.oxd-table-card').first()).toBeVisible();
    });
 
});