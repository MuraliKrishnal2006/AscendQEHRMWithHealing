import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ReportsPage extends BasePage {

    readonly Reports: Locator;
    readonly MyLeaveEntitlementsReport: Locator;

    constructor(page: Page) {
        super(page);

        // Reports is an <li> element
        this.Reports = page.locator('li').filter({
            hasText: 'Reports'
        }).first();

        // My Leave Entitlements and Usage Report
        this.MyLeaveEntitlementsReport = page.locator(
            'li > a',
            {
                hasText: 'My Leave Entitlements and Usage Report'
            }
        );
    }

    async openMyLeaveEntitlementsReport(): Promise<void> {

        console.log('Opening Reports...');

        // Wait for Reports <li>
        await this.Reports.waitFor({
            state: 'visible',
            timeout: 15000
        });

        console.log('Reports <li> is visible');

        // Click Reports
        await this.Reports.click();
        // Pause browser here so you can see Reports menu
        


        console.log('Reports clicked');

        // Wait for My Leave Entitlements and Usage Report
        await this.MyLeaveEntitlementsReport.waitFor({
            state: 'visible',
            timeout: 15000
        });

        console.log(
            'My Leave Entitlements and Usage Report is visible'
        );

        // Click report
        await this.MyLeaveEntitlementsReport.click();
        // Pause browser here so you can see Reports menu
        


        console.log(
            'My Leave Entitlements and Usage Report opened successfully'
        );
    }
}