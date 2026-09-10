
import { test, expect } from '../../src/fixtures/auth.fixture';
import { pimEmployeeData } from '../../src/data/TC-03-PIMemployee';
 
// Slows down actions by 1 second for visual observation
test.use({
    launchOptions: {
        slowMo: 1000,
    },
});
 
test.describe('TC-03: PIM Module - Employee Details Update', () => {
 
    test('TC-03-PIM: Search Lakshmi Sai Inaganti and update Personal, Contact, and Job details', async ({
        loggedIn,
        page,
        pimPages,
        employeeDetailsPage
    }) => {
        // 1. Navigate to PIM module
        await pimPages.clickPimMenu();
 
        // 2. Search for employee 'Geetika' & click Search
        await pimPages.searchEmployeeByName(pimEmployeeData.searchEmployeeName);
 
        // 3. Scroll & click on employee 'Geetika' in search results
        await pimPages.selectEmployeeFromResults(pimEmployeeData.employeeCellText);
 
        // 4. Personal Details Tab: Fill Nickname ('Geetu'), Marital Status ('Married'), DOB ('2003-10-10') and Save
        await employeeDetailsPage.updatePersonalDetails(
            pimEmployeeData.nickname,
            pimEmployeeData.maritalStatus,
            pimEmployeeData.dateOfBirth
        );
 
        // 5. Contact Details Tab: Click link
        await employeeDetailsPage.clickContactDetailsTab();
 
        // 6. Fill Mobile ('9876543210') & Work Email ('geetu.s1@ascendqe.com') and Save
        await employeeDetailsPage.fillContactDetails(
            pimEmployeeData.mobile,
            pimEmployeeData.validWorkEmail
        );
 
        // 7. Negative test: Clear and enter invalid email ('geet.12.com.') & Save
        await employeeDetailsPage.testInvalidWorkEmail(pimEmployeeData.invalidWorkEmail);
 
        // 8. Assert validation message appears
        const validationMsg = await employeeDetailsPage.getWorkEmailValidationMessage();
        expect(validationMsg).toBe(pimEmployeeData.emailValidationMessage);
 
        // 9. Re-enter valid email and Save
        await employeeDetailsPage.correctWorkEmailAndSave(pimEmployeeData.validWorkEmail);
 
        // 10. Job Tab: Click link
        await employeeDetailsPage.clickJobTab();
 
        // 11. Select Job Title ('AI Engineer'), Sub Unit ('Engineering'), Employment Status ('Full-Time Permanent') and Save
        await employeeDetailsPage.updateJobDetails(
            pimEmployeeData.jobTitle,
            pimEmployeeData.subUnit,
            pimEmployeeData.employmentStatus
        );
 
        // 12. Add Attachment: Click '+ Add', browse & upload 'what is agent' file, fill comment 'EMP9001', and Save
        await employeeDetailsPage.addAttachment(
            pimEmployeeData.attachmentFilePath,
            pimEmployeeData.attachmentComment
        );
 
        // 13. Navigate to Admin module
        await pimPages.clickAdminMenu();
 
        // 14. Navigate to PIM module
        await pimPages.clickPimMenu();
 
        // 15. Search for Employee Name 'Lakshmi Sai Inaganti' & click Search
        await pimPages.searchEmployeeByName(pimEmployeeData.searchEmployeeName);
 
        // 16. Click on employee 'Lakshmi Sai Inaganti' in search results to open Personal Details
        await pimPages.selectEmployeeFromResults(pimEmployeeData.employeeCellText);
 
        // 17. Click on Job tab
        await employeeDetailsPage.clickJobTab();
 
        // 18. Scroll up/down to see the Attachments section
        await employeeDetailsPage.scrollToAttachments();
 
        // 19. Refresh the page (F5 / reload)
        await page.reload();
 
        // 20. Navigate to PIM module
        await pimPages.clickPimMenu();
 
        // 21. Search by Job Title: Select 'AI Engineer' from dropdown and click Search
        await pimPages.searchByJobTitle(pimEmployeeData.jobTitle);
    });
 
});
 
 
 

 
 