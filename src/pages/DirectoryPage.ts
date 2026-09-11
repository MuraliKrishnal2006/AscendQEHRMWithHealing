import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { AutocompleteComponent } from '../components/AutocompleteComponent';
import { CommonMenuComponent } from '../components/commonmenuitems';

/**
 * DirectoryPage — models the Directory module search screen (/directory/viewDirectory).
 * Supports searching by employee name, job title, location, resetting filters,
 * and searching without criteria.
 */
export class DirectoryPage extends BasePage {
    readonly employeeNameInput: Locator;
    readonly searchButton: Locator;
    readonly resetButton: Locator;
    readonly directoryCards: Locator;

    readonly employeeNameAutocomplete: AutocompleteComponent;
    readonly commonMenu: CommonMenuComponent;

    constructor(page: Page) {
        super(page);
        this.employeeNameInput = page.getByPlaceholder('Type for hints...').first();
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.directoryCards = page.locator('.oxd-grid-item, .orangehrm-directory-card');

        this.employeeNameAutocomplete = new AutocompleteComponent(
            page,
            this.employeeNameInput,
            page.locator('.oxd-autocomplete-option, [role="option"]')
        );
        this.commonMenu = new CommonMenuComponent(page);
    }
        // ================= Candidate Locator Pools =================

    get employeeNameInputCandidates(): Array<() => Locator> {
        return [
            () => this.employeeNameInput,
            () => this.page.getByRole('textbox', { name: /Type for hints\.\.\./i }),
            () => this.page.getByPlaceholder('Type for hints...'),
            () => this.page.getByPlaceholder('Type for hints...', { exact: true }),
            () => this.page.locator("//input[@placeholder='Type for hints...']"),
            () => this.page.locator("input[placeholder='Type for hints...']")
        ];
    }

    get searchButtonCandidates(): Array<() => Locator> {
        return [
            () => this.searchButton,
            () => this.page.locator('button').filter({ hasText: 'Search' }).last(),
            () => this.page.locator('div.oxd-form-actions').locator('button').nth(1),
            () => this.page.locator("//button[normalize-space()='Search']"),
            () => this.page.locator("button[type='submit']"),
            () => this.page.getByRole('button'),
            () => this.page.locator('button:visible'),
            () => this.page.locator(':has-text("Search")')
        ];
    }

    get resetButtonCandidates(): Array<() => Locator> {
        return [
            () => this.resetButton,
            () => this.page.locator("//button[normalize-space()='Reset']"),
            () => this.page.locator("button[type='reset']"),
            () => this.page.getByRole('button'),
            () => this.page.locator('button:visible'),
            () => this.page.locator(':has-text("Reset")')
        ];
    }
    /**
     * Navigates to the Directory module from the sidebar.
     */
    async clickDirectory(): Promise<void> {
        console.log('Clicking Directory...');
        await this.commonMenu.clickDirectory();
        console.log('Directory module opened');
    }

    /**
     * Enters a name in the Directory search field, selects autocomplete option, and clicks Search.
     */
    async searchByName(name: string): Promise<void> {
        console.log(`Searching Directory by Name: ${name}`);
        await this.employeeNameAutocomplete.selectExact(name);
        await this.waitForElement(this.searchButton);
        await this.click(this.searchButton);
        await this.page.waitForTimeout(2000);
        console.log(`Search completed for: ${name}`);
    }

    /**
     * Types a search string (like 'sanjay') into Directory Name, selects match if available, and clicks Search.
     */
    async searchByNameOrText(text: string): Promise<void> {
        console.log(`Entering search term in Directory: ${text}`);
        await this.waitForElement(this.employeeNameInput);
        await this.employeeNameInput.click();
        await this.employeeNameInput.fill(text);
        await this.page.waitForTimeout(1500);

        // If an autocomplete suggestion appears, select it
        const option = this.page.locator('.oxd-autocomplete-option, [role="option"]').filter({ hasText: new RegExp(text, 'i') }).first();
        if (await option.isVisible().catch(() => false)) {
            await option.click();
        }

        await this.waitForElement(this.searchButton);
        await this.click(this.searchButton);
        await this.page.waitForTimeout(2000);
        console.log(`Search completed for: ${text}`);
    }

    /**
     * Clears all filters by clicking the Reset button.
     */
    async resetFilters(): Promise<void> {
        console.log('Clicking Reset to clear all filters...');
        await this.waitForElement(this.resetButton);
        await this.click(this.resetButton);
        await this.page.waitForTimeout(1000);
        console.log('Filters cleared');
    }

    /**
     * Clicks Search with no criteria entered.
     */
    async searchWithNoCriteria(): Promise<void> {
        console.log('Clicking Search with no criteria entered...');
        await this.waitForElement(this.searchButton);
        await this.click(this.searchButton);
        await this.page.waitForTimeout(2000);
        console.log('Unfiltered search results displayed');
    }
}
