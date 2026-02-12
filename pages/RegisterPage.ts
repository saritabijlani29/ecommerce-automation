import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
    private nameInput = '#ap_customer_name';
    private emailInput = '#ap_email';
    private passwordInput = '#ap_password';
    private passwordCheckInput = '#ap_password_check';
    private continueButton = '#continue';

    constructor(page: Page) {
        super(page);
    }

    async registerUser(name: string, email: string, pass: string) {
        await this.page.fill(this.nameInput, name);
        await this.page.fill(this.emailInput, email);
        await this.page.fill(this.passwordInput, pass);
        await this.page.fill(this.passwordCheckInput, pass);
        await this.page.click(this.continueButton);
    }
}
