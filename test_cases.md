# Amazon E-Commerce Test Scenarios (Gherkin Format)

Background:
    Given I am on the Amazon homepage
    And I accept all cookies if prompted

# ------------------------------------------------------------------
# Feature: User Authentication & Registration
# ------------------------------------------------------------------

@Registration @HappyPath
Scenario: Successful new user registration
    Given I navigate to the "Sign-In" page
    When I click the "Create your Amazon account" button
    And I enter my name "New Test User"
    And I enter a valid email or mobile number "new_user_123@example.com"
    And I enter a password meeting security criteria "SecurePass!2024"
    And I re-enter the password "SecurePass!2024"
    And I click the "Verify email" button
    Then I should be navigated to the OTP verification page
    And I should receive a verification code
    # Note: Automated OTP verification requires test infrastructure support

@Login @HappyPath
Scenario: Successful login with valid seeded user credentials
    Given I navigate to the "Sign-In" page
    When I enter a valid email address "seeded_user@example.com"
    And I click the "Continue" button
    And I enter the correct password "SecurePassword123!"
    But I ensure the "Keep me signed in" checkbox is unchecked
    And I click the "Sign-In" button
    Then I should be redirected to the homepage
    And I should see "Hello, Seeded" in the account navigation header

@Login @Negative
Scenario: Login attempt with invalid password for a valid email
    Given I navigate to the "Sign-In" page
    When I enter a valid email address "seeded_user@example.com"
    And I click the "Continue" button
    And I enter an incorrect password "WrongPass!"
    And I click the "Sign-In" button
    Then I should see an error message "There was a problem"
    And The error details should state "To better protect your account, please re-enter your password" or similar text

@Login @EdgeCase
Scenario: Login with empty email field
    Given I navigate to the "Sign-In" page
    When I leave the email field empty
    And I click the "Continue" button
    Then I should see an inline validation error "Enter your email or mobile phone number"
    And The password field should not be visible

# ------------------------------------------------------------------
# Feature: Product Search and Navigation
# ------------------------------------------------------------------

@Search @HappyPath
Scenario: Search for a valid product and navigate to product details
    When I verify the search bar is visible
    And I enter "Apple iPhone 15 Pro" into the search bar
    And I click the search icon
    Then I should see a list of search results
    When I click on the first product result link
    Then I should be redirected to the product detail page
    And The product title should contain "Apple iPhone 15 Pro"
    And The "Add to Cart" button should be visible

@Search @EdgeCase
Scenario: Search with special characters
    When I enter "!@#$%^&*()" into the search bar
    And I click the search icon
    Then I should see search results or a "No results found" message
    And The application should not crash or show a server error

# ------------------------------------------------------------------
# Feature: Cart Operations
# ------------------------------------------------------------------

@Cart @HappyPath
Scenario: Add product to cart and verify contents
    Given I am on the product detail page for "Apple iPhone 15 Pro"
    And The product price is displayed as "$999.00"
    When I ensure the quantity is set to "1"
    And I click the "Add to Cart" button
    Then I should see a confirmation message "Added to Cart"
    When I click the "Go to Cart" button
    Then I should be on the Cart page
    And The cart should contain 1 item
    And The product name should be "Apple iPhone 15 Pro"
    And The item price should be "$999.00"
    And The subtotal should verify as "$999.00"

@Cart @EdgeCase
Scenario: Add max quantity of a product (Boundary Value)
    Given I am on the product detail page for a product with limit "5"
    When I select quantity "5" from the dropdown
    And I click the "Add to Cart" button
    Then I should see "Added to Cart"
    And The cart count badge should verify "5"

# ------------------------------------------------------------------
# Feature: Cart Persistence
# ------------------------------------------------------------------

@Persistence @HappyPath
Scenario: Verify cart persistence after page refresh
    Given I have added "Apple iPhone 15 Pro" to my cart
    When I am on the Cart page
    And I verify the subtotal is "$999.00"
    And I refresh the browser page
    Then The cart should still contain "Apple iPhone 15 Pro"
    And The subtotal should remain "$999.00"
    And The cart item count should not change
