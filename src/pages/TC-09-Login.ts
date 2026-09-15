import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage — models AscendqeHRM's login screen.
 * Covers both the happy path (valid login) and the negative path
 * (invalid credentials → error message), used across tests/ui/login.spec.ts
 * and as the entry point for the `loggedIn` auth fixture.
 * Uses semantic Playwright locators (no XPaths) with auto-healing support.
 */
export class LoginPage extends BasePage {
    readonly UsernameInput: Locator;
    readonly PasswordInput: Locator;
    readonly LoginButton: Locator;
    readonly ErrorMessage: Locator;
    readonly ForgotPasswordLink: Locator;
    readonly ResetPasswordBackLink: Locator;
    readonly FieldErrors: Locator;

    constructor(page: Page) {
        super(page);
        this.UsernameInput = page.getByRole('textbox', { name: 'Username' });
        this.PasswordInput = page.getByPlaceholder('Password');
        this.LoginButton = page.getByRole('button', { name: 'Login' });
        // Semantic alert locator 
        this.ErrorMessage = page.getByRole('alert');
        this.ForgotPasswordLink = page.locator('.orangehrm-login-forgot-header');
        this.ResetPasswordBackLink = page.locator('.orangehrm-forgot-password-reset--link');
        this.FieldErrors = page.locator('.oxd-input-field-error-message');
    }

    // Navigates directly to the login URL (bypasses any prior page state).
    async gotoLogin(): Promise<void> {
        await this.goto('/web/index.php/auth/login');
    }

    // Fills credentials and submits the form — the standard login flow.
    async login(username: string, password: string): Promise<void> {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLogin();
    }

    async userlogin(username: string, password: string): Promise<void> {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLogin();
    }

    /**
     * Clicks the username input field with auto-healing
     */
    async clickUsername(): Promise<void> {
        await this.healClick([
            () => this.UsernameInput,
            () => this.page.locator('input[placeholder="Username"]'),
            () => this.page.locator('input[name="username"]')
        ]);
    }

    /**
     * Fills the username field with auto-healing candidates
     */
    async fillUsername(username: string): Promise<void> {
        await this.healFill([
            () => this.UsernameInput,
            () => this.page.locator('input[placeholder="Username"]'),
            () => this.page.locator('input[name="username"]'),
            () => this.page.locator('input[type="text"][placeholder="Username"]')
        ], username);
    }

    /**
     * Fills the password field with auto-healing candidates
     */
    async fillPassword(password: string): Promise<void> {
        await this.healFill([
            () => this.PasswordInput,
            () => this.page.locator('input[placeholder="Password"]'),
            () => this.page.locator('input[name="password"]'),
            () => this.page.locator('input[type="password"]')
        ], password);
    }

    /**
     * Clicks the login button with auto-healing candidates
     */
    async clickLogin(): Promise<void> {
        await this.healClick([
            () => this.LoginButton,
            () => this.page.locator('button:has-text("Login")'),
            () => this.page.locator('button[type="submit"]')
        ]);
    }

    /**
     * Clears both username and password input fields with auto-healing
     */
    async clearFields(): Promise<void> {
        await this.healClear([
            () => this.UsernameInput,
            () => this.page.locator('input[placeholder="Username"]'),
            () => this.page.locator('input[name="username"]')
        ]);

        await this.healClear([
            () => this.PasswordInput,
            () => this.page.locator('input[placeholder="Password"]'),
            () => this.page.locator('input[type="password"]')
        ]);
    }

    /**
     * Reads the error banner text after a failed login attempt with auto-healing
     */
    async getErrorMessage(): Promise<string> {
        return await this.getAlertErrorMessage();
    }

    /**
     * Reads alert error banner text with auto-healing
     */
    async getAlertErrorMessage(): Promise<string> {
        return await this.healGetText([
            () => this.ErrorMessage,
            () => this.page.getByRole('alert'),
            () => this.page.locator('.oxd-alert-content-text'),
            () => this.page.locator('.oxd-alert')
        ]);
    }

    /**
     * Returns inline field error messages (e.g. ['Required', 'Required'])
     */
    async getFieldErrors(): Promise<string[]> {
        await this.page.waitForTimeout(500);
        return await this.FieldErrors.allTextContents();
    }

    /**
     * Clicks the 'Forgot your password?' link on the login page
     */
    async clickForgotPassword(): Promise<void> {
        await this.healClick([
            () => this.ForgotPasswordLink,
            () => this.page.getByText('Forgot your password?')
        ]);
    }

    /**
     * Clicks the 'Click here' link on the reset password page to navigate back to login
     */
    async clickBackToLogin(): Promise<void> {
        await this.healClick([
            () => this.ResetPasswordBackLink,
            () => this.page.getByText('Cancel')
        ]);
    }
}