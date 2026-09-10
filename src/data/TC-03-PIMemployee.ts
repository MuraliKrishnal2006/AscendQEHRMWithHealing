import path from 'path';

/**
 * Test data for PIM Employee Details workflow (Personal Details, Contact Details, Job)
 */
export const pimEmployeeData = {
    // Search
    searchEmployeeName: 'Lakshmi Sai Inaganti',
    employeeCellText: 'Geethika',

    // Personal Details
    nickname: 'Geetu',
    maritalStatus: 'Married',
    dateOfBirth: '2003-10-15',

    // Contact Details
    mobile: '9876543210',
    validWorkEmail: 'geetika.s1@ascendqe.com',
    invalidWorkEmail: 'geeti@12.com.',
    emailValidationMessage: 'Expected format: admin@example.com',

    // Job Details
    jobTitle: 'AI Engineer',
    subUnit: 'no records found',
    employmentStatus: 'Enable',

    // Attachments
    attachmentFileName: 'what is agent.txt',
    attachmentFilePath: path.resolve(__dirname, 'what is agent.txt'),
    attachmentComment: 'EMP9001'
};

