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

    // ================= Candidate Locator Pools =================

    get adminCandidates(): Array<() => Locator> {
        return [
            () => this.admin,
            () => this.page.locator('a:has-text("Admin")'),
            () => this.page.locator('a.oxd-main-menu-item.active'),
            () => this.page.locator('a.oxd-main-menu-item.active:visible'),
            () => this.page.locator('a').filter({ hasText: 'Admin' }),
            () => this.page.locator('a').filter({ hasText: 'Admin' }).first(),
            () => this.page.getByText('Admin', { exact: true }),
            () => this.page.locator("//a[@class='oxd-main-menu-item active']")
        ];
    }

    get pimCandidates(): Array<() => Locator> {
        return [
            () => this.pim,
            () => this.page.locator('a:has-text("PIM")'),
            () => this.page.locator(':text-is("PIM")'),
            () => this.page.locator(':text("PIM")'),
            () => this.page.locator('a').filter({ hasText: 'PIM' }),
            () => this.page.locator('a').filter({ hasText: 'PIM' }).first(),
            () => this.page.locator(':has-text("PIM")'),
            () => this.page.locator('a.oxd-main-menu-item'),
            () => this.page.locator('a.oxd-main-menu-item:visible')
        ];
    }

    get recruitmentCandidates(): Array<() => Locator> {
        return [
            () => this.recruitment,
            () => this.page.locator('span:has-text("Recruitment")'),
            () => this.page.locator(':text-is("Recruitment")'),
            () => this.page.locator(':text("Recruitment")'),
            () => this.page.locator('span').filter({ hasText: 'Recruitment' }),
            () => this.page.locator('span').filter({ hasText: 'Recruitment' }).first(),
            () => this.page.locator("//span[normalize-space()='Recruitment']"),
            () => this.page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > aside:nth-child(1) > nav:nth-child(1) > div:nth-child(2) > ul:nth-child(2) > li:nth-child(5) > a:nth-child(1) > span:nth-child(2)"),
            () => this.page.locator(':has-text("Recruitment")'),
            () => this.page.locator('span.oxd-text.oxd-text--span.oxd-main-menu-item--name')
        ];
    }

    get maintenanceCandidates(): Array<() => Locator> {
        return [
            () => this.maintenance,
            () => this.page.locator('span').filter({ hasText: 'Maintenance' }),
            () => this.page.locator('span').filter({ hasText: 'Maintenance' }).first(),
            () => this.page.locator('span').filter({ hasText: 'Maintenance' }).last(),
            () => this.page.locator("//span[normalize-space()='Maintenance']"),
            () => this.page.locator("body > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > aside:nth-child(1) > nav:nth-child(1) > div:nth-child(2) > ul:nth-child(2) > li:nth-child(10) > a:nth-child(1) > span:nth-child(2)"),
            () => this.page.locator(':has-text("Maintenance")'),
            () => this.page.locator('span.oxd-text.oxd-text--span.oxd-main-menu-item--name'),
            () => this.page.locator('span.oxd-text.oxd-text--span.oxd-main-menu-item--name:visible')
        ];
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
