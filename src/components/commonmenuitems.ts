import { expect, type Locator, type Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

export class CommonMenuComponent extends BaseComponent {
    readonly search: Locator;
    readonly collapse: Locator;
    readonly leave: Locator;
    readonly time: Locator;
    readonly myinfo: Locator;
    readonly performance: Locator;
    readonly dashbaord: Locator;
    readonly directory: Locator;
    readonly claim: Locator;
    readonly buzz: Locator;


    constructor(page: Page) {
        super(page);
        
        this.search = page.getByRole('textbox', { name: 'Search' });
        this.collapse = page.locator('.oxd-icon-button.oxd-main-menu-button');
        this.leave = page.getByRole('link', { name: 'Leave', exact: true }).filter({ hasText: 'Leave' }).first();
        this.time = page.getByRole('link', { name: 'Time' });
        this.myinfo = page.getByRole('link', { name: 'My Info' });
        this.performance = page.getByRole('link', { name: 'Performance' });
        this.dashbaord = page.getByRole('link', { name: 'Dashboard' });
        this.directory = page.getByRole('link', { name: 'Directory' });
        this.claim = page.getByRole('link', { name: 'Claim' });
        this.buzz = page.getByRole('link', { name: 'Buzz' });
    }
    
    async clickLeave() {
        await this.click(this.leave);
        await this.page.waitForURL(/leave/);
    }
    async clickTime() {
        await this.click(this.time);
        await this.page.waitForURL(/time/);
    }
    
    async clickMyInfo() {
        await this.click(this.myinfo);
        await this.page.waitForURL(/myinfo/);
    }
    async clickPerformance() {
        await this.click(this.performance);
        await this.page.waitForURL(/performance/);
    }
    async clickDashboard() {
        await this.click(this.dashbaord);
        await this.page.waitForURL(/dashboard/);
    }
    async clickDirectory() {
        await this.click(this.directory);
        await this.page.waitForURL(/directory/);
    }
    async clickClaim() {
        await this.click(this.claim);
        await this.page.waitForURL(/claim/);
    }
    async clickBuzz() {
        await this.click(this.buzz);
        await this.page.waitForURL(/buzz/);
    }
    async searchItem(item: string) {
        await this.fill(this.search, item);
    }
    async clickCollapse() {
        await this.click(this.collapse);
    }
    async clickExpand() {
        await this.click(this.collapse);
    }
    async verifyMenuItemsAreVisible() {
        await expect(this.search).toBeVisible();
        await expect(this.collapse).toBeVisible();
        await expect(this.leave).toBeVisible();
        await expect(this.time).toBeVisible();
        await expect(this.myinfo).toBeVisible();
        await expect(this.performance).toBeVisible();
        await expect(this.dashbaord).toBeVisible();
        await expect(this.directory).toBeVisible();
        await expect(this.claim).toBeVisible();
        await expect(this.buzz).toBeVisible();
    }

}