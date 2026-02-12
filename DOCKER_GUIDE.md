# Docker Quick Reference Guide

This guide provides quick commands for running tests with Docker.

## 🚀 Quick Start

### Windows
```cmd
run-docker-tests.bat
```

### Linux/Mac
```bash
chmod +x run-docker-tests.sh
./run-docker-tests.sh
```

---

## 📦 Docker Commands

### Build Docker Image
```bash
docker-compose build
```

### Run Tests
```bash
# Run and remove containers after completion
docker-compose up --abort-on-container-exit

# Run in detached mode
docker-compose up -d

# Run and follow logs
docker-compose up --abort-on-container-exit --remove-orphans
```

### View Logs
```bash
# View logs from running container
docker-compose logs -f

# View logs from specific service
docker-compose logs -f playwright-tests
```

### Stop and Clean Up
```bash
# Stop running containers
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Remove all containers, networks, and images
docker-compose down --rmi all
```

---

## 🔧 Advanced Usage

### Run with Custom Environment Variables
```bash
# Override environment variables
docker-compose run -e USER_EMAIL=test@example.com -e USER_PASSWORD=mypass playwright-tests

# Use different .env file
docker-compose --env-file .env.staging up
```

### Run Specific Tests
```bash
# Run specific feature file
docker-compose run playwright-tests npx playwright test tests/features/amazon_shopping.feature

# Run with specific tag
docker-compose run playwright-tests npx playwright test --grep @Login
```

### Interactive Mode
```bash
# Run container interactively
docker-compose run --rm playwright-tests /bin/bash

# Inside container, you can run:
npm test
npx playwright test --headed
npx playwright test --debug
```

### View HTML Report
```bash
# Start nginx server to view reports
docker-compose --profile reports up report-server

# Access report at: http://localhost:8080
```

---

## 🐛 Debugging

### Check Container Status
```bash
docker-compose ps
```

### View Container Logs
```bash
docker logs amazon-automation
```

### Execute Commands in Running Container
```bash
docker-compose exec playwright-tests /bin/bash
```

### Inspect Docker Image
```bash
docker images | grep amazon-automation
docker inspect amazon-automation:latest
```

### Clean Up Everything
```bash
# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune -a

# Remove all unused volumes
docker volume prune

# Remove everything (use with caution!)
docker system prune -a --volumes
```

---

## 📊 Accessing Test Artifacts

### From Host Machine
All artifacts are automatically mounted to your host machine:

```bash
# View test results
ls -la test-results/

# View HTML report
ls -la playwright-report/

# View screenshots
ls -la screenshots/

# View videos
ls -la videos/
```

### From Docker Container
```bash
# Copy files from container to host
docker cp amazon-automation:/app/test-results ./test-results

# Copy specific file
docker cp amazon-automation:/app/playwright-report/index.html ./report.html
```

---

## 🔐 Security Best Practices

### Never Commit Credentials
```bash
# Ensure .env is in .gitignore
echo ".env" >> .gitignore

# Use .env.example as template
cp .env.example .env
# Edit .env with your credentials
```

### Use Docker Secrets (Production)
```yaml
# docker-compose.yml
services:
  playwright-tests:
    secrets:
      - user_email
      - user_password

secrets:
  user_email:
    file: ./secrets/user_email.txt
  user_password:
    file: ./secrets/user_password.txt
```

---

## 🚀 CI/CD Integration

### GitHub Actions
```yaml
- name: Run tests in Docker
  run: docker-compose up --abort-on-container-exit
  
- name: Upload artifacts
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: |
      test-results/
      playwright-report/
```

### GitLab CI
```yaml
test:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker-compose up --abort-on-container-exit
  artifacts:
    paths:
      - test-results/
      - playwright-report/
```

---

## 📝 Troubleshooting

### Issue: Permission Denied
```bash
# Fix permissions on Linux/Mac
sudo chown -R $USER:$USER test-results playwright-report

# Or run with user mapping
docker-compose run --user $(id -u):$(id -g) playwright-tests
```

### Issue: Port Already in Use
```bash
# Change port in docker-compose.yml
ports:
  - "8081:80"  # Changed from 8080
```

### Issue: Out of Disk Space
```bash
# Clean up Docker resources
docker system df  # Check disk usage
docker system prune -a --volumes  # Clean up
```

### Issue: Container Exits Immediately
```bash
# Check logs
docker-compose logs playwright-tests

# Run interactively to debug
docker-compose run --rm playwright-tests /bin/bash
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Playwright Docker Guide](https://playwright.dev/docs/docker)
- [Best Practices for Dockerfile](https://docs.docker.com/develop/dev-best-practices/)
