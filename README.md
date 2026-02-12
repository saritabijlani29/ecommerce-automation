# Amazon E-Commerce Automation Framework

A robust end-to-end test automation framework for Amazon's e-commerce platform, built with Playwright and BDD (Behavior-Driven Development) using Cucumber/Gherkin syntax.

## 📋 Table of Contents

- [Automation Approach](#automation-approach)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
  - [Local Execution](#local-execution)
  - [Docker Execution](#docker-execution)
- [Test Artifacts](#test-artifacts)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Automation Approach

### Why UI Automation?

This framework uses **UI-based automation** rather than API or hybrid approaches for the following reasons:

1. **End-to-End User Journey Validation**: Amazon's e-commerce flow involves complex user interactions (login, search, cart operations) that require visual validation and interaction with dynamic elements.

2. **Real User Experience Testing**: UI automation validates the actual user experience, including:
   - Page load times and rendering
   - Interactive elements (buttons, dropdowns, modals)
   - Visual feedback and error messages
   - Cross-browser compatibility

3. **Security & Authentication Flows**: Amazon's login process includes:
   - CAPTCHA challenges
   - Two-factor authentication
   - Session management
   - Cookie consent popups
   
   These are difficult to replicate via API testing alone.

4. **Dynamic Content Validation**: Product listings, prices, and availability are dynamically rendered and require DOM interaction for accurate validation.

5. **Business-Critical Scenarios**: The framework tests user-facing features that directly impact revenue and customer satisfaction.

### Hybrid Approach Consideration

While this framework focuses on UI automation, a **hybrid approach** could be beneficial for:
- **Setup/Teardown**: Using APIs to create test data or clean up after tests
- **Performance**: API calls for non-critical validations to speed up test execution
- **Future Enhancement**: Combining UI tests with API contract testing

---

## 🛠 Technology Stack

### Core Technologies

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **Playwright** | ^1.40.0 | Browser automation | - Cross-browser support (Chromium, Firefox, WebKit)<br>- Auto-wait mechanisms<br>- Built-in screenshot/video recording<br>- Excellent debugging tools<br>- Fast and reliable |
| **TypeScript** | ^5.0.0 | Programming language | - Type safety and IntelliSense<br>- Better maintainability<br>- Compile-time error detection |
| **Cucumber/Gherkin** | ^12.6.0 | BDD framework | - Human-readable test scenarios<br>- Collaboration between technical and non-technical stakeholders<br>- Living documentation |
| **playwright-bdd** | ^8.4.2 | BDD integration | - Seamless Playwright + Cucumber integration<br>- Automatic step definition generation<br>- Type-safe step implementations |

### Why Playwright Over Selenium?

1. **Auto-waiting**: Playwright automatically waits for elements to be actionable
2. **Better Performance**: Faster execution with direct browser protocol communication
3. **Modern Architecture**: Built for modern web applications with SPA support
4. **Built-in Features**: Screenshots, videos, network interception out-of-the-box
5. **Active Development**: Regular updates and excellent documentation

---

## Project Structure

```
amazon-automation/
├── .features-gen/          # Auto-generated BDD test files
├── data/
│   └── test-data.json      # Test data (credentials, search queries)
├── pages/                  # Page Object Model (POM)
│   ├── BasePage.ts         # Base page with common methods
│   ├── LoginPage.ts        # Login page interactions
│   ├── HomePage.ts         # Homepage interactions
│   ├── ProductPage.ts      # Product detail page
│   └── CartPage.ts         # Shopping cart page
├── tests/
│   ├── features/           # Gherkin feature files
│   │   └── amazon_shopping.feature
│   └── steps/              # Step definitions
│       └── amazon_steps.ts
├── test-results/           # Test execution results
├── playwright-report/      # HTML test reports
├── playwright.config.ts    # Playwright configuration
├── package.json            # Dependencies
├── Dockerfile              # Docker image definition
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # This file
```

---

## Prerequisites

### Local Development
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Git**: For version control

### Docker Execution
- **Docker**: v20.x or higher
- **Docker Compose**: v2.x or higher

---

## Installation

### Local Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd amazon-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   npx playwright install-deps
   ```

4. **Verify installation**
   ```bash
   npx playwright --version
   ```

---

## Configuration

### Environment Variables

Create a `.env` file in the project root (optional, for sensitive data):

```env
# Base Configuration
BASE_URL=https://www.amazon.com
HEADLESS=false
TIMEOUT=300000

# User Credentials (DO NOT commit real credentials)
USER_EMAIL=your-email@example.com
USER_PASSWORD=your-password

# Test Configuration
SLOW_MO=1000
SCREENSHOT=on
VIDEO=retain-on-failure
TRACE=on-first-retry

# Browser Configuration
BROWSER=chromium
VIEWPORT_WIDTH=1280
VIEWPORT_HEIGHT=720
```

### Test Data Configuration

Edit `data/test-data.json` for test-specific data:

```json
{
  "user": {
    "email": "ecommercetest412@gmail.com",
    "password": "test123@2"
  },
  "product": {
    "searchQuery": "Apple iPhone 15 pro",
    "expectedName": "Apple iPhone 15 pro"
  }
}
```

**Security Note**: Never commit real credentials. Use environment variables or secure vaults in production.

### Playwright Configuration

Key settings in `playwright.config.ts`:

- **Base URL**: `https://www.amazon.com`
- **Timeout**: 300 seconds (5 minutes) for Amazon's security checks
- **Screenshot**: Enabled on all tests
- **Trace**: Enabled on first retry
- **Slow Motion**: 1000ms delay between actions (for debugging)
- **Projects**: Chromium (desktop) and Mobile Chrome (Pixel 5)

---

## 🚀 Running Tests

### Local Execution

This project uses **Playwright-BDD**, which requires generating test files from feature files before execution. The easiest way to run tests is using the provided NPM scripts.

#### Recommended: Use NPM Scripts
The following scripts handle both generation and execution automatically:

| Command | Description |
|---------|-------------|
| `npm run test:bdd` | Generate BDD tests and run all of them (headless) |
| `npm run test:headed` | Generate BDD tests and run all of them in **headed mode** |
| `npm run bddgen` | Only generate BDD tests without running them |
| `npm test` | Run already generated tests |

#### Run Specific Feature
To run a specific feature file (ensure you've run `npm run bddgen` first if you've made changes):
```bash
# Run the Amazon shopping feature
npx playwright test tests/features/amazon_shopping.feature
```

#### Run with UI Mode (Interactive)
Best for developing tests:
```bash
npx playwright test --ui
```

#### Debug Mode
```bash
npx playwright test --debug
```

#### Filter by Tags
You can run scenarios with specific tags defined in `.feature` files (e.g., `@Negative`):
```bash
npx playwright test --grep "@Negative"
```

#### Run Specific Browser
```bash
# Run on Desktop Chrome
npx playwright test --project=chromium

# Run on Mobile Chrome
npx playwright test --project=mobile-chrome
```


---

### Docker Execution

#### Build Docker Image

```bash
docker build -t amazon-automation:latest .
```

#### Run Tests with Docker

**Option 1: Using Docker directly**
```bash
docker run --rm \
  -v $(pwd)/test-results:/app/test-results \
  -v $(pwd)/playwright-report:/app/playwright-report \
  -e BASE_URL=https://www.amazon.com \
  -e USER_EMAIL=your-email@example.com \
  -e USER_PASSWORD=your-password \
  amazon-automation:latest
```

**Option 2: Using Docker Compose (Recommended)**

1. **Run tests**
   ```bash
   docker-compose up
   ```

2. **Run tests in detached mode**
   ```bash
   docker-compose up -d
   ```

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

4. **Stop and clean up**
   ```bash
   docker-compose down
   ```

#### Docker Compose Configuration

The `docker-compose.yml` file includes:
- Volume mounts for test results and reports
- Environment variable configuration
- Automatic cleanup after execution

**Example `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  playwright-tests:
    build: .
    container_name: amazon-automation
    environment:
      - BASE_URL=${BASE_URL:-https://www.amazon.com}
      - USER_EMAIL=${USER_EMAIL}
      - USER_PASSWORD=${USER_PASSWORD}
      - HEADLESS=${HEADLESS:-true}
      - CI=true
    volumes:
      - ./test-results:/app/test-results
      - ./playwright-report:/app/playwright-report
      - ./screenshots:/app/screenshots
      - ./videos:/app/videos
    shm_size: '2gb'
```

#### Environment Variables for Docker

Create a `.env` file for Docker Compose:

```env
BASE_URL=https://www.amazon.com
USER_EMAIL=ecommercetest412@gmail.com
USER_PASSWORD=test123@2
HEADLESS=true
```

---

## 📊 Test Artifacts

### Screenshots

- **Location**: `test-results/` directory
- **When Captured**: On every test step (configured in `playwright.config.ts`)
- **Format**: PNG
- **Naming**: `<test-name>-<step>-<timestamp>.png`

**View Screenshots:**
```bash
# Windows
explorer test-results

# Linux/Mac
open test-results
```

### Videos

- **Location**: `test-results/` directory
- **When Captured**: On test failure (configurable)
- **Format**: WebM
- **Configuration**: Set `video: 'retain-on-failure'` in config

**Enable Video Recording:**
```typescript
// playwright.config.ts
use: {
  video: 'retain-on-failure', // or 'on' for all tests
}
```

### HTML Reports

- **Location**: `playwright-report/index.html`
- **Contents**: 
  - Test execution summary
  - Pass/fail status
  - Screenshots and videos
  - Error stack traces
  - Execution timeline

**View Report:**
```bash
npx playwright show-report
```

Or open manually:
```bash
# Windows
start playwright-report/index.html

# Linux/Mac
open playwright-report/index.html
```

### Trace Files

- **Location**: `test-results/` directory
- **When Captured**: On first retry (configurable)
- **Format**: `.zip` file

**View Trace:**
```bash
npx playwright show-trace test-results/<trace-file>.zip
```

The trace viewer provides:
- Network activity
- DOM snapshots
- Console logs
- Action timeline
- Screenshots at each step

### Accessing Artifacts in Docker

Artifacts are automatically copied to your host machine via volume mounts:

```bash
# View test results
ls -la test-results/

# View HTML report
ls -la playwright-report/

# Open report in browser
npx playwright show-report
```

---

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.40.0-jammy
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run Playwright tests
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          USER_EMAIL: ${{ secrets.USER_EMAIL }}
          USER_PASSWORD: ${{ secrets.USER_PASSWORD }}
        run: npm test
        
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "No tests found" Error

**Problem**: Running `npx playwright test` returns "No tests found".

**Solution**:
- Ensure you have run `npm run bddgen` to generate tests in the `.features-gen` directory.
- Verify the path to the feature file is correct (e.g., `tests/features/amazon_shopping.feature`).
- If using tags, ensure the tag exists in the feature file.

#### 2. CAPTCHA Challenges

**Problem**: Amazon shows CAPTCHA during login

**Solution**:
- Run tests in **headed mode** for manual CAPTCHA solving
- Increase timeout: `timeout: 300000` (5 minutes)
- Use `slowMo: 1000` to slow down actions
- Consider using authenticated session cookies

```bash
npx playwright test --headed
```

#### 2. Element Not Found

**Problem**: `TimeoutError: locator.click: Timeout 30000ms exceeded`

**Solution**:
- Verify selectors in `pages/*.ts` files
- Use Playwright Inspector: `npx playwright test --debug`
- Check if element is in iframe or shadow DOM
- Increase timeout for specific actions

#### 3. Docker Permission Issues

**Problem**: Cannot write to mounted volumes

**Solution**:
```bash
# Linux/Mac: Fix permissions
sudo chown -R $USER:$USER test-results playwright-report

# Or run with user mapping
docker run --user $(id -u):$(id -g) ...
```

#### 4. Browser Installation Failed

**Problem**: Playwright browsers not installed in Docker

**Solution**: Ensure Dockerfile includes:
```dockerfile
RUN npx playwright install --with-deps chromium
```

#### 5. Network Timeout

**Problem**: Tests fail due to slow network

**Solution**:
- Increase global timeout in `playwright.config.ts`
- Add retry logic: `retries: 2`
- Use `waitForLoadState('networkidle')`

---

## 📝 Test Scenarios Covered

- ✅ User login with valid credentials
- ✅ Product search functionality
- ✅ Add product to cart
- ✅ Cart verification
- ✅ Cross-browser testing (Chromium, Mobile)

See `test_cases.md` for detailed Gherkin scenarios.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-test`
3. Commit changes: `git commit -am 'Add new test scenario'`
4. Push to branch: `git push origin feature/new-test`
5. Submit a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📧 Contact

For questions or support, please open an issue in the repository.

---

## 🔗 Useful Links

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber/Gherkin Syntax](https://cucumber.io/docs/gherkin/)
- [playwright-bdd](https://vitalets.github.io/playwright-bdd/)
- [Docker Documentation](https://docs.docker.com/)
