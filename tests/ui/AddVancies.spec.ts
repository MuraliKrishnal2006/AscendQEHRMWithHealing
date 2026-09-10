import { test } from '../../src/fixtures/auth.fixture';
import { readCsv } from '../../src/utils/csvReader';

type VacancyRow = {
  'VacancyName': string;
  'JobTitle': string;
  'HiringManager': string;
};

test.describe('Multiple Vacancies - Single Login', () => {

  test('Login once and add multiple vacancies', async ({
    loggedIn,
    addVacancies,
    dashboardPage
  }) => {

    // Read vacancy test data from CSV 
    const vacancies = readCsv<VacancyRow>
      ('data/AddVacancies.csv');

    // Login is handled once by the loggedIn fixture

    for (const vacancy of vacancies) {

      // Navigate to Recruitment
      await addVacancies.clickRecruitment();

      await addVacancies.clickVacancies();

      console.log(
        `Adding vacancy: ${vacancy['VacancyName']}`
      );
      

      // Add vacancy using CSV data
      await addVacancies.AddVancyDetails(
        vacancy['VacancyName'],
        vacancy['JobTitle'],
        vacancy['HiringManager']
      );

      console.log(
        `Vacancy ${vacancy['VacancyName']} added successfully`
      );
    }
    
    // Logout only once after all candidates are added
    await dashboardPage.logout();

    console.log('Application logged out successfully');
  });
});