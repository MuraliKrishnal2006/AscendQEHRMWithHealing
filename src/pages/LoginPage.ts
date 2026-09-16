import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { test as base } from '@playwright/test';
//import {LoginPage} from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PimPage } from '../pages/PimPage';
import { AddEmployee } from './AddEmployee';

/**
 * LoginPage — models OrangeHRM's login screen.
 * Covers both the happy path (valid login) and the negative path
 * (invalid credentials → error message), used across tests/ui/login.spec.ts
 * and as the entry point for the `loggedIn` auth fixture.
 */

export class LoginPage extends BasePage {
    readonly UsernameInput: Locator;
    readonly PasswordInput: Locator;
    readonly LoginButton: Locator;
    readonly ErrorMessage: Locator;

    readonly FieldErrors: Locator;

    constructor(page: Page) {
        super(page);
         // ✅ Using .or() gives you fallbacks during `expect().toBeVisible()` assertions as well!

        this.UsernameInput = page.getByPlaceholder('divya');
        this.PasswordInput = page.getByPlaceholder('pwd');
        this.LoginButton = page.getByRole('button', { name: 'Login' });
        this.ErrorMessage = page.locator('//div[@class="orangehrm-login-error"]/div/div/p');
        this.FieldErrors = page.locator('.oxd-input-field-error-message');
    }

    async gotoLogin(): Promise<void> {
        await this.goto('/web/index.php/auth/login');
    }

    async verifyUsernameVisible(): Promise<void> {
        await this.healExpectVisible([
            () => this.UsernameInput,
            () => this.page.locator('input[placeholder="Username"]'),
            () => this.page.getByRole('textbox', { name: 'Username' }),
            () => this.page.locator('input[type="text"][placeholder="Username"]')
        ]);
    }

    async clickUsername(): Promise<void> {
        await this.healClick([
            () => this.UsernameInput,
            () => this.page.locator('input[placeholder="Username"]'),
            () => this.page.getByRole('textbox', { name: 'Username' })
        ]);
    }

    async fillUsername(username: string): Promise<void> {
        await this.healFill(
            [
                () => this.UsernameInput,
                () => this.page.getByRole('textbox', { name: 'Username' }),
                () => this.page.locator('input[placeholder="Username"]'),
                () => this.page.locator('input[name="username"]'),
                () => this.page.locator('input[type="text"][placeholder="Username"]')
            ],
            username
        );
    }

    async fillPassword(password: string): Promise<void> {
        await this.healFill(
            [
                () => this.PasswordInput,
                () => this.page.getByPlaceholder('Password'),
                () => this.page.locator('input[placeholder="Password"]'),
                () => this.page.locator('input[name="password"]'),
                () => this.page.locator('input[type="password"]')
            ],
            password
        );
    }

    async clearFields(): Promise<void> {
        await this.healClear([
            () => this.UsernameInput,
            () => this.page.getByRole('textbox', { name: 'Username' }),
            () => this.page.locator('input[placeholder="Username"]'),
            () => this.page.locator('input[name="username"]')
        ]);

        await this.healClear([
            () => this.PasswordInput,
            () => this.page.getByPlaceholder('Password'),
            () => this.page.locator('input[placeholder="Password"]'),
            () => this.page.locator('input[name="password"]'),
            () => this.page.locator('input[type="password"]')
        ]);
    }

    async clickLogin(): Promise<void> {
        await this.healClick(
            [
                () => this.LoginButton,
                () => this.page.getByRole('button', { name: 'Login' }),
                () => this.page.locator('button:has-text("Login")'),
                () => this.page.locator('button[type="submit"]')
            ]
        );
    }

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

    async getErrorMessage(): Promise<string> {
        await this.waitForElement(this.ErrorMessage);
        return await this.getText(this.ErrorMessage);
    }

    async getAlertErrorMessage(): Promise<string> {
        return await this.healGetText([
            () => this.ErrorMessage,
            () => this.page.getByRole('alert'),
            () => this.page.locator('.oxd-alert-content-text'),
            () => this.page.locator('.oxd-alert')
        ]);
    }

    async getFieldErrors(): Promise<string[]> {
        await this.page.waitForTimeout(500);
        return await this.FieldErrors.allTextContents();
    }
}