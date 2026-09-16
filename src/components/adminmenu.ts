import { expect, type Locator, type Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";
import { CommonMenuComponent } from "./commonmenuitems";

export class AdminMenuComponent extends BaseComponent {
    readonly admin: Locator;
    readonly pim: Locator;
    readonly recruitment: Locator;
    readonly maintenance: Locator;
readonly commonmenu: CommonMenuComponent;

    
    constructor(page: Page) {
        super(page);
        this.commonmenu = new CommonMenuComponent(page);
        this.admin = page.getByRole('link', { name: 'Admin' });
        this.pim = page.getByRole('link', { name: 'PIM' });
        this.recruitment = page.getByRole('link', { name: 'Recruitment' });
        this.maintenance = page.getByRole('link', { name: 'Maintenance' });
    }

    private async clearSidebarSearchIfNeeded(): Promise<void> {
        const sidebarSearch = this.page.locator('.oxd-sidepanel input[placeholder="Search"]');
        if (await sidebarSearch.isVisible().catch(() => false)) {
            const val = await sidebarSearch.inputValue().catch(() => '');
            if (val) {
                await sidebarSearch.fill('');
            }
        }
    }

    async clickAdmin() {
        await this.clearSidebarSearchIfNeeded();
        await this.click(this.admin);
        await this.page.waitForURL(/admin/);
    }
    
    async clickPim() {
        await this.clearSidebarSearchIfNeeded();
        await this.click(this.pim);
        await this.page.waitForURL(/pim/);
    }
    
    async clickRecruitment() {
        await this.clearSidebarSearchIfNeeded();
        await this.click(this.recruitment);
        await this.page.waitForURL(/recruitment/);
    }
    
    
    async clickMaintenance() {
        await this.clearSidebarSearchIfNeeded();
        await this.click(this.maintenance);
        await this.page.waitForURL(/maintenance/);
    }

    async verifyMenuItemsAreVisible() {
        await expect(this.admin).toBeVisible();
        await expect(this.pim).toBeVisible();
        await expect(this.recruitment).toBeVisible();
        await expect(this.maintenance).toBeVisible();
    }
}
