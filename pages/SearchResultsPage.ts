import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
    private resultsList = '[data-component-type="s-search-result"]';
    private productTitleLink = 'a.a-link-normal:has(h2), h2 a.a-link-normal';

    constructor(page: Page) {
        super(page);
    }

    async selectProduct(productName: string): Promise<string> {
        console.log(`Searching for product: ${productName}`);
        // Wait for results to load
        await this.page.waitForSelector(this.resultsList, { timeout: 30000 });

        const results = this.page.locator(this.resultsList);
        const count = await results.count();
        console.log(`Found ${count} search results.`);

        // Try to find exact or close match first
        const matchedProduct = results.filter({ hasText: productName }).locator(this.productTitleLink).first();

        let productToClick;
        if (await matchedProduct.isVisible()) {
            console.log("Found matching product.");
            productToClick = matchedProduct;
        } else {
            console.log("Exact match not visible, selecting the first product as fallback.");
            productToClick = results.first().locator(this.productTitleLink);
        }

        const actualName = await productToClick.innerText();
        console.log(`Selecting product: ${actualName}`);

        await productToClick.scrollIntoViewIfNeeded();
        await this.page.screenshot({ path: 'before_product_click.png' });
        await expect(productToClick).toBeVisible({ timeout: 10000 });

        console.log("Attempting to click product...");
        // Use a more robust click strategy
        try {
            await productToClick.click({ timeout: 15000 });
            console.log("Regular click successful.");
        } catch (e: any) {
            console.log(`Regular click failed: ${e.message}. Trying force click...`);
            await productToClick.click({ force: true });
            console.log("Force click attempted.");
        }

        await this.page.waitForLoadState('load');
        await this.page.screenshot({ path: 'after_product_click.png' });
        return actualName.trim();
    }
}
