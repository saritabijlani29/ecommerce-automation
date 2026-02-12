import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
    // Sometimes the button ID is different or heavily nested
    private addToCartButton = '#add-to-cart-button';
    private addToCartButtonAlt = '#add-to-cart-button-ubb';
    private addedToCartMessage = '#NATC_SMART_WAGON_CONF_MSG_SUCCESS';
    private sideCartMessage = '#attach-start-of-checkout-flow-sheet';

    constructor(page: Page) {
        super(page);
    }

    async addToCart() {
        console.log("Locating Add to Cart button...");
        const primary = this.page.locator(this.addToCartButton);
        const alt = this.page.locator(this.addToCartButtonAlt);
        const roleBtn = this.page.getByRole('button', { name: /Add to Cart/i }).first();

        if (await primary.isVisible()) {
            await primary.click();
        } else if (await alt.isVisible()) {
            await alt.click();
        } else {
            console.log("Primary/Alt not visible, trying role-based button...");
            await roleBtn.click();
        }
    }

    async verifyAddedToCart() {
        console.log("Verifying item added to cart...");
        // Amazon shows different confirmation UI depending on the product/account
        const successMessage = this.page.locator(this.addedToCartMessage);
        const sidePanel = this.page.locator(this.sideCartMessage);
        const genericAddedText = this.page.getByText(/Added to Cart/i).first();

        const isVisible = await Promise.race([
            successMessage.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false),
            sidePanel.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false),
            genericAddedText.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false)
        ]);

        expect(isVisible, "Expected 'Added to Cart' confirmation message to be visible").toBeTruthy();
    }
}
