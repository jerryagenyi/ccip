# Production Environment Variables Setup

## Overview

This document describes all environment variables required for production deployment using `docker-compose.production.yml`.

## Required Environment Variables

Create a `.env.production` file (DO NOT commit to Git) with the following variables:

```bash
# Database Configuration
POSTGRES_DB=ccip_production
POSTGRES_USER=ccip_user
POSTGRES_PASSWORD=<STRONG_PASSWORD_HERE>

# Redis Configuration
REDIS_PASSWORD=<STRONG_REDIS_PASSWORD_HERE>

# MinIO Configuration
MINIO_ROOT_USER=<MINIO_USERNAME>
MINIO_ROOT_PASSWORD=<STRONG_MINIO_PASSWORD>

# AWS/MinIO S3 Configuration
AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY>
AWS_SECRET_ACCESS_KEY=<AWS_SECRET_KEY>

# JWT Secret (generate a strong random string)
JWT_SECRET=<STRONG_JWT_SECRET_HERE>

# Laravel Application Key (generate with: php artisan key:generate)
APP_KEY=base64:<GENERATED_KEY>
```

## Generating Secure Secrets

### Generate Strong Passwords

```bash
# Using openssl
openssl rand -base64 32

# Using Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Generate Laravel APP_KEY

```bash
# Inside a Laravel container or local installation
php artisan key:generate --show
```

### Generate JWT Secret

```bash
# Use any of the password generation methods above
# Minimum 32 characters recommended
```

## Setting Environment Variables

### Option 1: .env.production File (Recommended for Dokploy)

1. Create `.env.production` in the project root
2. Add all variables from the template above
3. Ensure `.env.production` is in `.gitignore`
4. Dokploy will automatically load this file

### Option 2: Docker Secrets (Advanced)

For maximum security, use Docker secrets:

```bash
# Create secrets
echo "your-password" | docker secret create postgres_password -
echo "your-redis-password" | docker secret create redis_password -

# Reference in docker-compose.yml
secrets:
  - postgres_password
  - redis_password
```

### Option 3: Environment Variables in Dokploy UI

1. Go to Dokploy project settings
2. Navigate to Environment Variables
3. Add each variable manually
4. Mark sensitive variables as "Secret" (hidden in UI)

## Security Best Practices

1. **Never commit secrets:**
   - Add `.env.production` to `.gitignore`
   - Use `.env.production.example` (without values) for documentation

2. **Use strong passwords:**
   - Minimum 32 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Use password generator tools

3. **Rotate secrets regularly:**
   - Change passwords quarterly
   - Rotate immediately if compromised
   - Update all services using the secret

4. **Limit access:**
   - Only grant access to production secrets to necessary team members
   - Use secret management tools (HashiCorp Vault, AWS Secrets Manager) for teams

5. **Monitor for exposure:**
   - Regularly check Git history for accidentally committed secrets
   - Use tools like `git-secrets` or `truffleHog` to scan repositories

## Verification

After setting environment variables, verify they're loaded:

```bash
# Check if variables are set (in Dokploy or local)
docker-compose -f docker-compose.production.yml config | grep -E "POSTGRES_PASSWORD|REDIS_PASSWORD"

# Test database connection
docker-compose -f docker-compose.production.yml exec backend php artisan tinker
# Then run: DB::connection()->getPdo();
```

## Troubleshooting

### Variables Not Loading

1. Check file name matches exactly: `.env.production`
2. Verify file is in project root (same directory as docker-compose.production.yml)
3. Check Dokploy environment variable settings
4. Restart containers after adding variables

### Permission Errors

If you see permission errors after setting variables:
- Ensure database user has correct permissions
- Check Redis password is correctly set
- Verify MinIO credentials match

### Connection Failures

- Verify all passwords match between services
- Check network connectivity between containers
- Review container logs: `docker-compose logs`

