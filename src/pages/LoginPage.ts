import {Page ,Locator} from '@playwright/test';
import {BasePage} from './BasePage';
import { test as base } from '@playwright/test';
//import {LoginPage} from '../pages/LoginPage';
import {DashboardPage} from '../pages/DashboardPage';
import {PimPage} from '../pages/PimPage';
import {AddEmployee} from './AddEmployee';
 
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

    constructor(page: Page) {
        super(page);

        this.UsernameInput = page.getByPlaceholder('Usernames');
        this.PasswordInput = page.getByPlaceholder('Passwords');
        this.LoginButton = page.getByRole('button', { name: 'Logins' });
        this.ErrorMessage = page.locator('//div[@class="orangehrm-login-error"]/div/div/p');
    }

    async gotoLogin(): Promise<void> {
        await this.goto('/web/index.php/auth/login');
    }

    async fillUsername(username: string): Promise<void> {
        await this.healFill(
            [
                () => this.UsernameInput,
                () => this.page.locator('input[placeholder="Username"]'),
                () => this.page.locator('input[type="text"][placeholder="Username"]')
            ],
            username
        );
    }

    async fillPassword(password: string): Promise<void> {
        await this.healFill(
            [
                () => this.PasswordInput,
                () => this.page.locator('input[placeholder="Password"]'),
                () => this.page.locator('input[type="password"][placeholder="Password"]')
            ],
            password
        );
    }

    async clickLogin(): Promise<void> {
        await this.healClick(
            [
                () => this.LoginButton,
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
}