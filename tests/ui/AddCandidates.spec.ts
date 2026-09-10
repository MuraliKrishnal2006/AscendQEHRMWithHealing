import { test } from '../../src/fixtures/auth.fixture';
import { readCsv } from '../../src/utils/csvReader';

type CandidateRow = {
  FirstName: string;
  LastName: string;
  Email: string;
};

test.describe('Multiple Candidates - Single Login', () => {

  test('Login once and add multiple candidates', async ({
    loggedIn,
    addCandidates,
    dashboardPage
  }) => {

    // Read candidate test data from CSV 
    const candidates = readCsv<CandidateRow>
      ('data/AddCandidates.csv');

    // Login is handled once by the loggedIn fixture

    for (const candidate of candidates) {

      // Navigate to Recruitment
      await addCandidates.clickRecruitment();

      console.log(
        `Adding candidate: ${candidate.FirstName} ${candidate.LastName}`
      );

      // Add candidate using CSV data
      await addCandidates.AddCandidatesDetails(
        candidate.FirstName,
        candidate.LastName,
        candidate.Email
      );

      console.log(
        `Candidate ${candidate.FirstName} ${candidate.LastName} added successfully`
      );
    }
    
    // Logout only once after all candidates are added
    await dashboardPage.logout();

    console.log('Application logged out successfully');
  });
});