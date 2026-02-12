// Generated from: tests\features\amazon_shopping.feature
import { test } from "../../../tests/steps/amazon_steps.ts";

test.describe('Amazon Shopping Flow', () => {

  test('User can search and add product to cart without login', async ({ Given, When, Then, And, cartPage, homePage, page, productPage, searchResultsPage }) => { 
    await Given('I navigate to Amazon homepage', null, { page }); 
    await When('I search for "ailun iphone 17 pro max screen protector"', null, { homePage, page, searchResultsPage }); 
    await And('I add the product to the cart', null, { page, productPage }); 
    await Then('the product "ailun iphone 17 pro max screen protector" should be in the cart', null, { cartPage, page }); 
  });

  test('Login with empty email field', { tag: ['@Negative', '@EmptyEmail'] }, async ({ Given, When, Then, And, loginPage, page }) => { 
    await Given('I navigate to the "Sign-In" page', null, { page }); 
    await When('I leave the email field empty', null, { loginPage }); 
    await And('I click the "Continue" button', null, { loginPage, page }); 
    await Then('I should see an inline validation error "Enter your mobile number or email"', null, { loginPage }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests\\features\\amazon_shopping.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I navigate to Amazon homepage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When I search for \"ailun iphone 17 pro max screen protector\"","stepMatchArguments":[{"group":{"start":13,"value":"\"ailun iphone 17 pro max screen protector\"","children":[{"start":14,"value":"ailun iphone 17 pro max screen protector","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"And I add the product to the cart","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then the product \"ailun iphone 17 pro max screen protector\" should be in the cart","stepMatchArguments":[{"group":{"start":12,"value":"\"ailun iphone 17 pro max screen protector\"","children":[{"start":13,"value":"ailun iphone 17 pro max screen protector","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":13,"pickleLine":10,"tags":["@Negative","@EmptyEmail"],"steps":[{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Context","textWithKeyword":"Given I navigate to the \"Sign-In\" page","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When I leave the email field empty","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"And I click the \"Continue\" button","stepMatchArguments":[{"group":{"start":12,"value":"\"Continue\"","children":[{"start":13,"value":"Continue","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then I should see an inline validation error \"Enter your mobile number or email\"","stepMatchArguments":[{"group":{"start":40,"value":"\"Enter your mobile number or email\"","children":[{"start":41,"value":"Enter your mobile number or email","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end