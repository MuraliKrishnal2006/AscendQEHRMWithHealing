/**
 * Test data for TC-09: Login Security & Field Validation test suite
 */
export const tc09LoginData = {
    // Step 4: Initial username fill (password left blank)
    initialUsername: 'AscendQETest',
 
    // Step 5: Both invalid credentials
    invalidUsername: 'wronguser',
    invalidPassword: 'wrongpass123',
 
    // Step 6 & 8: Valid username
    validUsername: 'AscendQETest',
 
    // Step 7: Distinct incorrect username (so 'wronguser' is not repeated)
    step7IncorrectUsername: 'incorrectuser',
 
    // Step 7 & 8: Valid password
    validPassword: '@Ascendqe123',
 
    // Expected validation error messages
    expectedRequiredError: 'Required',
    expectedInvalidCredentialsError: 'Invalid credentials',
 
    // Expected dashboard header after successful login
    dashboardHeader: 'Dashboard',
    };
