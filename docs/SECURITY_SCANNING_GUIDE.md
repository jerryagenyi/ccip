# Docker Security Scanning Guide

## Overview

This guide explains how to scan Docker images and configurations for security vulnerabilities using Trivy and Docker Scout.

## Quick Start

### Install Trivy

**macOS:**
```bash
brew install trivy
```

**Linux:**
```bash
# Download latest release
wget https://github.com/aquasecurity/trivy/releases/latest/download/trivy_0.x.x_Linux-64bit.tar.gz
tar -xzf trivy_*.tar.gz
sudo mv trivy /usr/local/bin/
```

**Windows:**
```powershell
# Using Chocolatey
choco install trivy

# Or download from: https://github.com/aquasecurity/trivy/releases
```

### Run Security Scan

```bash
# Scan all images from docker-compose files
./scripts/security-scan.sh

# Or scan individual images
trivy image postgres:15-alpine
trivy image redis:7-alpine
trivy image minio/minio:latest
```

## Scanning Methods

### 1. Scan Built Images

```bash
# Build images first
docker-compose build

# Scan built images
trivy image ccip-backend:latest
trivy image ccip-frontend:latest
```

### 2. Scan Base Images (Before Building)

```bash
# Scan base images used in Dockerfiles
trivy image php:8.4-fpm-alpine
trivy image node:18-alpine
trivy image nginx:alpine
```

### 3. Scan Docker Compose Configuration

```bash
# Scan docker-compose.yml for misconfigurations
trivy config docker-compose.yml
trivy config docker-compose.production.yml
```

### 4. Scan with Severity Filter

```bash
# Only show HIGH and CRITICAL vulnerabilities
trivy image --severity HIGH,CRITICAL <image>

# Exit with error code if vulnerabilities found
trivy image --severity HIGH,CRITICAL --exit-code 1 <image>
```

### 5. Generate Reports

```bash
# JSON report
trivy image --format json --output trivy-report.json <image>

# HTML report
trivy image --format template --template "@contrib/html.tpl" --output trivy-report.html <image>

# SARIF (for GitHub Security)
trivy image --format sarif --output trivy-report.sarif <image>
```

## Automated Scanning

### Using the Provided Script

```bash
# Make script executable
chmod +x scripts/security-scan.sh

# Run scan
./scripts/security-scan.sh
```

The script will:
- Find all images in docker-compose files
- Scan each image for HIGH and CRITICAL vulnerabilities
- Provide a summary report
- Exit with error code if vulnerabilities found

### CI/CD Integration

See `.github/workflows/security-scan.yml` for GitHub Actions integration.

The workflow:
- Runs on push to main/develop
- Runs weekly (Sunday midnight)
- Scans all Docker images
- Uploads results to GitHub Security tab
- Fails build if CRITICAL/HIGH vulnerabilities found

## Docker Scout (Alternative)

Docker Scout is built into Docker Desktop 4.25+:

```bash
# Quick view of vulnerabilities
docker scout quickview

# Scan specific image
docker scout cves <image>

# Compare two images
docker scout compare <old-image> <new-image>

# Recommendations
docker scout recommendations <image>
```

## Interpreting Results

### Severity Levels

- **CRITICAL:** Immediate action required - remote code execution, data breach risk
- **HIGH:** Should be fixed soon - significant security impact
- **MEDIUM:** Fix when possible - moderate security impact
- **LOW:** Low priority - minimal security impact

### Common Vulnerabilities

1. **Outdated Base Images:**
   - Solution: Update to latest version
   - Example: `postgres:15` → `postgres:16-alpine`

2. **Vulnerable Packages:**
   - Solution: Update packages in Dockerfile
   - Run: `apt-get update && apt-get upgrade -y`

3. **Misconfigurations:**
   - Solution: Follow security best practices
   - Use Trivy config scanner to find issues

## Remediation Workflow

1. **Identify Vulnerabilities:**
   ```bash
   trivy image --severity HIGH,CRITICAL <image>
   ```

2. **Prioritize Fixes:**
   - Fix CRITICAL first
   - Then HIGH severity
   - Document MEDIUM/LOW for later

3. **Update Images:**
   ```bash
   # Update base image in Dockerfile
   FROM php:8.4-fpm-alpine  # Update version
   
   # Rebuild
   docker-compose build --no-cache
   ```

4. **Verify Fix:**
   ```bash
   trivy image <updated-image>
   ```

5. **Deploy:**
   - Only deploy after vulnerabilities are fixed
   - Document fixes in commit messages

## Best Practices

1. **Scan Before Building:**
   - Scan base images before using them
   - Check for known vulnerabilities

2. **Scan After Building:**
   - Always scan built images
   - Include in CI/CD pipeline

3. **Regular Scans:**
   - Weekly automated scans
   - Monthly manual review
   - Before major deployments

4. **Document Findings:**
   - Track vulnerabilities in issues
   - Document remediation steps
   - Keep security audit logs

5. **Stay Updated:**
   - Keep Trivy updated: `trivy --version`
   - Update base images regularly
   - Monitor security advisories

## Integration with Development Workflow

### Pre-Commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Scan Dockerfiles before commit
trivy config docker-compose.yml docker-compose.production.yml
if [ $? -ne 0 ]; then
    echo "❌ Security scan failed. Fix vulnerabilities before committing."
    exit 1
fi
```

### Pre-Deployment Check

```bash
# Before deploying to production
./scripts/security-scan.sh
if [ $? -ne 0 ]; then
    echo "❌ Security scan failed. Do not deploy."
    exit 1
fi
```

## Troubleshooting

### Trivy Not Finding Images

```bash
# Ensure images are built locally
docker images | grep <image-name>

# Or pull images first
docker pull <image-name>
```

### False Positives

- Some vulnerabilities may be false positives
- Review CVE details before fixing
- Check if vulnerability affects your use case
- Document why you're ignoring specific CVEs

### Slow Scans

```bash
# Use cache for faster scans
trivy image --cache-dir ~/.cache/trivy <image>

# Skip database update if recent
trivy image --skip-db-update <image>
```

## Resources

- [Trivy Documentation](https://aquasecurity.github.io/trivy/)
- [Docker Scout Documentation](https://docs.docker.com/scout/)
- [CVE Database](https://cve.mitre.org/)
- [OWASP Docker Security](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)

