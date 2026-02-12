Feature: Amazon Shopping Flow

  Scenario: User can search and add product to cart without login
    Given I navigate to Amazon homepage
    When I search for "ailun iphone 17 pro max screen protector"
    And I add the product to the cart
    Then the product "ailun iphone 17 pro max screen protector" should be in the cart

  @Negative @EmptyEmail
  Scenario: Login with empty email field
    Given I navigate to the "Sign-In" page
    When I leave the email field empty
    And I click the "Continue" button
    Then I should see an inline validation error "Enter your mobile number or email"
