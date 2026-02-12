import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    private cartItems = '.sc-list-item-content';
    private subtotalLabel = '#sc-subtotal-label-activecart';
    private quantitySelect = 'select[name="quantity"]';

    constructor(page: Page) {
        super(page);
    }

    async verifyProductInCart(productName: string) {
        console.log(`Verifying product in cart: ${productName}`);
        // If name is very long, take the first 50 chars to be safe
        const shortName = productName.length > 50 ? productName.substring(0, 50) : productName;
        await expect(this.page.locator(this.cartItems).first()).toContainText(shortName);
    }

    async verifyQuantity(expectedQuantity: string) {
        const quantity = await this.page.locator(this.quantitySelect).first().inputValue();
        expect(quantity).toBe(expectedQuantity);
    }

    async updateQuantity(newQuantity: string) {
        await this.page.selectOption(this.quantitySelect, newQuantity);
    }
}
