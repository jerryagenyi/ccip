# Docker Security Best Practices

## Overview

This document outlines security best practices for Docker deployments, based on OWASP Docker Security Cheat Sheet, CIS Docker Benchmarks, and lessons learned from security audits.

## Container Security

### 1. Run as Non-Root User

**Why:** Reduces impact if container is compromised.

**Implementation:**
```dockerfile
# In Dockerfile
RUN groupadd -r appuser && useradd -r -g appuser -u 1000 appuser
USER appuser
```

```yaml
# In docker-compose.yml
services:
  app:
    user: "appuser:appuser"
```

**Exception:** Services that need root (Apache, Nginx) should drop privileges after binding to ports.

### 2. Security Options

**Why:** Prevents privilege escalation attacks.

**Implementation:**
```yaml
services:
  app:
    security_opt:
      - no-new-privileges:true
```

### 3. Resource Limits

**Why:** Prevents DoS attacks and resource exhaustion.

**Implementation:**
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### 4. Read-Only Root Filesystem

**Why:** Prevents malicious writes to container filesystem.

**Implementation:**
```yaml
services:
  app:
    read_only: true
    tmpfs:
      - /tmp
      - /var/tmp
```

**Note:** May require adjustments for applications that write to filesystem.

## Secrets Management

### 1. Never Hardcode Secrets

**❌ Bad:**
```yaml
environment:
  DB_PASSWORD: mypassword123
```

**✅ Good:**
```yaml
environment:
  DB_PASSWORD: ${DB_PASSWORD}
```

### 2. Use Environment Variables

**Development:**
```bash
# .env file (in .gitignore)
DB_PASSWORD=secure_password_here
```

**Production:**
- Use Docker secrets
- Use external secret managers (HashiCorp Vault, AWS Secrets Manager)
- Use Dokploy environment variables (marked as Secret)

### 3. Rotate Secrets Regularly

- Change passwords quarterly
- Rotate immediately if compromised
- Use strong, randomly generated passwords (32+ characters)

## Image Security

### 1. Use Minimal Base Images

**Prefer:**
- `alpine` variants (smaller attack surface)
- `distroless` images (minimal runtime)
- Official images from Docker Hub

**Avoid:**
- `latest` tag (unpredictable)
- Large base images with unnecessary tools

### 2. Pin Image Versions

**❌ Bad:**
```dockerfile
FROM node:latest
```

**✅ Good:**
```dockerfile
FROM node:20-alpine
```

### 3. Regular Security Scanning

```bash
# Scan before using
trivy image node:20-alpine

# Scan after building
trivy image my-app:latest

# Scan in CI/CD
# See .github/workflows/security-scan.yml
```

### 4. Keep Images Updated

- Update base images monthly
- Patch vulnerabilities promptly
- Test updates in staging first

## Network Security

### 1. Use Bridge Networks

**✅ Good:**
```yaml
networks:
  app-network:
    driver: bridge
```

**❌ Avoid:**
```yaml
network_mode: host  # Bypasses Docker network isolation
```

### 2. Limit Port Exposure

**✅ Good:**
```yaml
ports:
  - "8000:8000"  # Only expose necessary ports
```

**❌ Avoid:**
```yaml
ports:
  - "0.0.0.0:8000:8000"  # Explicitly binds to all interfaces
```

### 3. Use Health Checks

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## Docker Socket Security

### 1. Read-Only Mounts

**If docker.sock must be mounted:**
```yaml
volumes:
  - /var/run/docker.sock:/var/run/docker.sock:ro
```

### 2. Alternatives

- Use Docker-in-Docker (DinD) for better isolation
- Use rootless Docker
- Use Docker API endpoint instead of socket

### 3. Security Warnings

If write access is required (e.g., Watchtower), document the risk:
```yaml
# WARNING: Watchtower requires write access to docker.sock
# This is a necessary security trade-off
# Ensure Watchtower image is kept updated
```

## File Permissions

### 1. Secure Permissions

**✅ Good:**
```dockerfile
RUN chmod -R 755 /app
RUN chmod -R 750 /app/secrets
```

**❌ Avoid:**
```dockerfile
RUN chmod -R 777 /app  # World-write access
```

### 2. Proper Ownership

```dockerfile
RUN chown -R appuser:appuser /app
USER appuser
```

## Volume Security

### 1. Named Volumes vs Bind Mounts

**Production:** Use named volumes
```yaml
volumes:
  - app_data:/app/data
```

**Development:** Bind mounts acceptable
```yaml
volumes:
  - ./app:/app  # OK for development only
```

### 2. Sensitive Data Volumes

- Never mount sensitive host directories (`/etc`, `/var`, `/root`)
- Use named volumes for database data
- Encrypt volumes containing sensitive data

## Monitoring and Logging

### 1. Enable Logging

```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 2. Monitor Container Behavior

- Set up container monitoring (Uptime Kuma, Prometheus)
- Alert on unusual resource usage
- Review logs regularly

### 3. Security Auditing

- Regular security scans (weekly)
- Review access logs
- Monitor for suspicious activity

## CI/CD Security

### 1. Scan in Pipeline

```yaml
# .github/workflows/security-scan.yml
- name: Security Scan
  uses: aquasecurity/trivy-action@master
  with:
    scan-type: 'image'
    severity: 'CRITICAL,HIGH'
    exit-code: '1'
```

### 2. Block on Vulnerabilities

- Fail builds on CRITICAL vulnerabilities
- Require review for HIGH vulnerabilities
- Document MEDIUM/LOW for later

### 3. Automated Updates

- Use Dependabot for base image updates
- Automated security patches where possible
- Manual review for major updates

## Compliance and Auditing

### 1. Security Checklist

Before deploying to production:
- [ ] All containers run as non-root
- [ ] Security options enabled
- [ ] No hardcoded secrets
- [ ] Resource limits set
- [ ] Security scan passed
- [ ] Health checks configured
- [ ] Logging enabled
- [ ] Monitoring configured

### 2. Documentation

- Document security decisions
- Keep security audit logs
- Track vulnerability remediation
- Maintain security runbooks

### 3. Regular Reviews

- Weekly: Automated scans
- Monthly: Security review
- Quarterly: Full security audit
- Annually: Penetration testing

## Incident Response

### 1. Vulnerability Response

1. **Identify:** Security scan or alert
2. **Assess:** Severity and impact
3. **Contain:** Isolate affected containers
4. **Remediate:** Patch or update
5. **Verify:** Re-scan to confirm fix
6. **Deploy:** Update production
7. **Document:** Record incident and resolution

### 2. Breach Response

1. **Isolate:** Stop affected containers
2. **Assess:** Determine scope of breach
3. **Notify:** Alert security team
4. **Remediate:** Fix vulnerabilities
5. **Rotate:** Change all secrets
6. **Monitor:** Enhanced monitoring
7. **Review:** Post-incident analysis

## Resources

- [OWASP Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)
- [Docker Scout](https://docs.docker.com/scout/)

## Quick Reference

```yaml
# Secure service template
services:
  app:
    image: app:tag  # Pinned version
    user: "appuser:appuser"  # Non-root
    security_opt:
      - no-new-privileges:true
    read_only: true  # If possible
    tmpfs:
      - /tmp
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
    environment:
      SECRET: ${SECRET}  # From env, not hardcoded
    healthcheck:
      test: ["CMD", "health-check-command"]
      interval: 30s
    networks:
      - app-network  # Bridge network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
```

