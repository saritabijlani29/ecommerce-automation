import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    private emailInput = '#ap_email';
    private continueButton = '#continue'; // sometimes id is 'continue', sometimes input#continue
    private passwordInput = '#ap_password';
    private signInButton = '#signInSubmit';
    private errorMessage = '#auth-error-message-box'; // More generic container

    constructor(page: Page) {
        super(page);
    }

    async enterEmail(email: string) {
        const input = this.page.locator('#ap_email').or(this.page.getByLabel('Email'));
        await input.click();
        await input.pressSequentially(email, { delay: 100 });
    }

    async clickContinue() {
        console.log("Locating Continue button...");
        const btn = this.page.locator('input#continue').or(this.page.getByRole('button', { name: 'Continue' }));
        await this.page.screenshot({ path: 'before_continue_click.png' });
        await btn.click();
        console.log("Clicked Continue button.");
        await this.page.waitForTimeout(2000);
        await this.page.screenshot({ path: 'after_continue_click.png' });
        // 
        //CHECK FOR CAPTCHA or Security Blocks
        // const captcha = this.page.getByText('Solve this puzzle');
        // const securityCode = this.page.getByText('Obtain code from Customer Service');

        // if (await captcha.isVisible() || await securityCode.isVisible()) {
        // console.log("!!! SECURITY BLOCK DETECTED !!! Please solve it manually in the browser window.");
        // console.log("Waiting up to 5 minutes for you to solve it...");
        //Wait for the block to disappear (user solves it) - 5 minutes timeout
        // await this.page.waitForSelector('text=Solve this puzzle', { state: 'detached', timeout: 300000 });
        // await this.page.waitForSelector('text=Obtain code from Customer Service', { state: 'detached', timeout: 300000 });
        // }
    }

    async enterPassword(password: string) {
        const input = this.page.locator('#ap_password').or(this.page.getByLabel('Password'));
        await input.click();
        await input.pressSequentially(password, { delay: 100 });
    }

    async clickSignIn() {
        const btn = this.page.locator('#signInSubmit').or(this.page.getByRole('button', { name: 'Sign in' }));
        await btn.click();
    }

    async login(email: string, password?: string) {
        console.log(`Entering email: ${email}`);
        await this.enterEmail(email);
        console.log("Clicking Continue...");
        await this.clickContinue();
        if (password) {
            console.log("Entering password...");
            await this.enterPassword(password);
            console.log("Clicking Sign In...");
            await this.clickSignIn();
        }
    }
    async getErrorTitle(): Promise<string> {
        return await this.page.locator('#auth-error-message-box h4').innerText();
    }

    async getErrorDetail(): Promise<string> {
        return await this.page.locator('#auth-error-message-box .a-list-item').innerText();
    }

    async getInlineError(): Promise<string> {
        console.log("Waiting for inline error text...");
        const text = await this.page.locator('.a-alert-content').first().innerText();
        const cleaned = text.trim();
        console.log(`Found inline error text: "${cleaned}"`);
        return cleaned;
    }

    async isPasswordVisible(): Promise<boolean> {
        return await this.page.locator('#ap_password').isVisible();
    }

    async verifyErrorMessage(expectedMessage: string) {
        console.log(`Verifying error message contains: ${expectedMessage}`);
        const errorBox = this.page.locator(this.errorMessage);
        await expect(errorBox).toBeVisible({ timeout: 15000 });
        await expect(errorBox).toContainText(expectedMessage);
    }
}
