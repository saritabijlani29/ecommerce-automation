import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    private searchInput = '#twotabsearchtextbox';
    private searchButton = '#nav-search-submit-button';
    private navUser = '#nav-link-accountList-nav-line-1';

    constructor(page: Page) {
        super(page);
    }

    async searchFor(query: string) {
        await this.page.fill(this.searchInput, query);
        await this.page.click(this.searchButton);
    }

    async verifyUserLoggedIn(username: string) {
        await expect(this.page.locator(this.navUser)).toContainText(`Hello, ${username}`);
    }
}
