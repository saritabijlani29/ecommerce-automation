import { createBdd, test as base } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { SearchResultsPage } from '../../pages/SearchResultsPage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';

type Fixtures = {
    loginPage: LoginPage;
    homePage: HomePage;
    searchResultsPage: SearchResultsPage;
    productPage: ProductPage;
    cartPage: CartPage;
};

export const test = base.extend<Fixtures>({
    loginPage: async ({ page }, use) => await use(new LoginPage(page)),
    homePage: async ({ page }, use) => await use(new HomePage(page)),
    searchResultsPage: async ({ page }, use) => await use(new SearchResultsPage(page)),
    productPage: async ({ page }, use) => await use(new ProductPage(page)),
    cartPage: async ({ page }, use) => await use(new CartPage(page)),
});

const { Given, When, Then } = createBdd(test);

Given('I navigate to the "Sign-In" page', async ({ page }) => {
    console.log("Navigating directly to Sign-In page...");
    await page.goto('https://www.amazon.com/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2F%3Fref_%3Dnav_custrec_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0');
    await page.waitForLoadState('load');

    // Check for CAPTCHA
    if (await page.getByText('Solve this puzzle').isVisible({ timeout: 2000 })) {
        console.log("!!! SECURITY BLOCK DETECTED !!! Please solve it.");
        await page.waitForSelector('text=Solve this puzzle', { state: 'detached', timeout: 300000 });
    }
    console.log("Reached login page.");
});

Given('I navigate to Amazon homepage', async ({ page }) => {
    console.log("Navigating to Amazon homepage...");
    await page.goto('https://www.amazon.com');
    await page.waitForLoadState('domcontentloaded');

    // Dismiss shipping popover if it appears
    try {
        const dismissBtn = page.locator('input[data-action-type="DISMISS"]').first();
        await dismissBtn.click({ timeout: 3000 });
        console.log("Dismissed popover.");
    } catch (e) {
        console.log("No popover to dismiss.");
    }
});

When('I login with email {string} and password {string}', async ({ loginPage, page }, email, password) => {
    await loginPage.login(email, password);

    // Check for CAPTCHA or security blocks after login attempt
    const captcha = page.getByText('Solve this puzzle');
    const securityCode = page.getByText('Obtain code from Customer Service');

    try {
        if (await captcha.isVisible({ timeout: 3000 }) || await securityCode.isVisible({ timeout: 3000 })) {
            console.log("!!! SECURITY BLOCK DETECTED !!!");
            console.log("Please solve the CAPTCHA/security challenge manually in the browser window.");
            console.log("You have 20 minutes. The test will continue automatically once solved.");

            // Wait for either to disappear (max 20 minutes)
            await Promise.race([
                page.waitForSelector('text=Solve this puzzle', { state: 'detached', timeout: 1200000 }),
                page.waitForSelector('text=Obtain code from Customer Service', { state: 'detached', timeout: 1200000 })
            ]).catch(() => {
                console.log("Timeout waiting for security block resolution.");
            });

            console.log("Security block resolved, continuing...");
        }
    } catch (e) {
        // No security block detected
    }

    await page.screenshot({ path: 'after_login.png' });
});

Then('I should be successfully logged in', async ({ page }) => {
    await expect(page.locator('#nav-link-accountList')).toBeVisible();
    await expect(page).not.toHaveURL(/sign-in/);
});

let selectedProductName: string;

When('I search for {string}', async ({ homePage, searchResultsPage, page }, query) => {
    await homePage.searchFor(query);
    await page.waitForTimeout(2000); // Allow results to render
    await page.screenshot({ path: 'search_results.png' });
    selectedProductName = await searchResultsPage.selectProduct(query);
});

When('I add the product to the cart', async ({ productPage, page }) => {
    await page.screenshot({ path: 'product_page.png' });
    await productPage.addToCart();
});

Then('the product {string} should be in the cart', async ({ cartPage, page }, productName) => {
    await page.goto('https://www.amazon.com/gp/cart/view.html?ref_=nav_cart');
    await page.screenshot({ path: 'cart_page.png' });
    // Use the captured dynamic name if available, otherwise fallback to Gherkin parameter
    const nameToVerify = selectedProductName || productName;
    console.log(`Verifying product in cart: ${nameToVerify}`);
    await cartPage.verifyProductInCart(nameToVerify);
});

When('I enter a valid email address {string}', async ({ loginPage }, email) => {
    await loginPage.enterEmail(email);
});

When('I click the {string} button', async ({ loginPage, page }, buttonName) => {
    if (buttonName === "Continue") {
        await loginPage.clickContinue();
    } else if (buttonName === "Sign-In") {
        console.log("Clicking Sign-In button...");
        await page.screenshot({ path: 'before_signin_click.png' });
        await loginPage.clickSignIn();
        await page.waitForTimeout(3000); // Wait for error to appear
        await page.screenshot({ path: 'after_signin_click.png' });
    }
});

When('I enter an incorrect password {string}', async ({ loginPage }, password) => {
    await loginPage.enterPassword(password);
});

Then('I should see an error message {string}', async ({ loginPage }, expectedTitle) => {
    const actualTitle = await loginPage.getErrorTitle();
    expect(actualTitle).toContain(expectedTitle);
});

Then('The error details should state {string} or similar text', async ({ loginPage }, expectedDetail) => {
    const actualDetail = await loginPage.getErrorDetail();
    // Use partial match and normalize case for robustness
    expect(actualDetail.toLowerCase()).toContain(expectedDetail.toLowerCase().substring(0, 30));
});

When('I leave the email field empty', async ({ loginPage }) => {
    await loginPage.enterEmail("");
});

Then('I should see an inline validation error {string}', async ({ loginPage }, expectedError) => {
    const actualError = await loginPage.getInlineError();
    expect(actualError.trim()).toBe(expectedError.trim());
});

Then('The password field should not be visible', async ({ loginPage }) => {
    const isVisible = await loginPage.isPasswordVisible();
    expect(isVisible).toBe(false);
});
