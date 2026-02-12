# Use official Playwright image with Node.js
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV CI=true

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy project files
COPY . .

# Install Playwright browsers (Chromium only for smaller image)
RUN npx playwright install chromium
RUN npx playwright install-deps chromium

# Create directories for test artifacts
RUN mkdir -p test-results playwright-report screenshots videos

# Set permissions
RUN chmod -R 777 test-results playwright-report screenshots videos

# Generate BDD test files
RUN npx bddgen || true

# Default command to run tests
CMD ["npm", "test"]
