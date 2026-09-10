import { Page } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

/**
 * BaseComponent — shared foundation for UI components.
 * Extends BasePage to provide common helper methods (click, fill, waitForElement, getText)
 * and holds the page reference.
 */
export class BaseComponent extends BasePage {
    constructor(page: Page) {
        super(page);
    }
}
