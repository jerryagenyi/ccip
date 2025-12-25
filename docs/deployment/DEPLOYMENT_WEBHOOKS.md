# CCIP Deployment Webhooks

This document contains the webhook URLs and deployment information for CCIP production services managed by Dokploy.

## 🚀 Deployment Webhooks

### Frontend Application
- **Service**: CCIP Vue.js Frontend
- **Repository**: [jerryagenyi/ccip](https://github.com/jerryagenyi/ccip)
- **Branch**: `main`
- **Build Context**: `./frontend`
- **Dockerfile**: `frontend/Dockerfile.prod`

**Webhook URLs**:
```bash
# Add these to your GitHub repository settings > Webhooks
# Frontend Deployment Webhook:
[TO BE FILLED FROM DOKPLOY DASHBOARD]

# Example format: https://dokploy.your-domain.com/api/v1/webhooks/[webhook-id]
```

### Backend Application
- **Service**: CCIP Laravel API Backend
- **Repository**: [jerryagenyi/ccip](https://github.com/jerryagenyi/ccip)
- **Branch**: `main`
- **Build Context**: `./backend`
- **Dockerfile**: `backend/Dockerfile.prod`

**Webhook URLs**:
```bash
# Backend Deployment Webhook:
[TO BE FILLED FROM DOKPLOY DASHBOARD]

# Example format: https://dokploy.your-domain.com/api/v1/webhooks/[webhook-id]
```

## 📋 How to Find Your Webhook URLs

### In Dokploy Dashboard:

1. **Login to Dokploy**
2. **Navigate to Application**:
   - Go to your ccip-frontend application
   - Go to your ccip-backend application
3. **Find Webhooks Section**:
   - Click on the application
   - Go to "Settings" tab
   - Look for "Webhooks" or "Deployments" section
4. **Copy Webhook URL**:
   - Each application has its own webhook URL
   - Format: `https://dokploy.your-domain.com/webhooks/[unique-id]`

### Adding Webhooks to GitHub:

1. **Go to your GitHub repository**: https://github.com/jerryagenyi/ccip
2. **Navigate to Settings**: Click "Settings" tab
3. **Find Webhooks**: Click "Webhooks" in the left menu
4. **Add Webhook**: Click "Add webhook"
5. **Configure Webhook**:
   - **Payload URL**: Your Dokploy webhook URL
   - **Content type**: `application/json`
   - **Secret**: Generate a secure secret key
   - **Which events**: Choose "Just the push event"
   - **Branch**: `main` (or your deployment branch)
   - **Active**: ✅ Check this box

## 🔄 GitHub Actions Integration

### Example GitHub Actions Workflow

Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Deploy Frontend
      run: |
        curl -X POST \
          -H "Content-Type: application/json" \
          -H "X-Webhook-Secret: ${{ secrets.DOKPLOY_WEBHOOK_SECRET }}" \
          -d '{"ref":"${{ github.ref }}","repository":"${{ github.repository }}","pusher":{"name":"${{ github.actor }}"}}' \
          ${{ secrets.DOKPLOY_FRONTEND_WEBHOOK }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Deploy Backend
      run: |
        curl -X POST \
          -H "Content-Type: application/json" \
          -H "X-Webhook-Secret: ${{ secrets.DOKPLOY_WEBHOOK_SECRET }}" \
          -d '{"ref":"${{ github.ref }}","repository":"${{ github.repository }}","pusher":{"name":"${{ github.actor }}"}}' \
          ${{ secrets.DOKPLOY_BACKEND_WEBHOOK }}

  notify:
    needs: [deploy-frontend, deploy-backend]
    runs-on: ubuntu-latest
    if: always()
    steps:
    - name: Notify Deployment Status
      run: |
        # Add your notification logic here (Slack, Discord, etc.)
        echo "Deployment completed!"
```

### GitHub Secrets Configuration

Add these secrets to your GitHub repository:

1. Go to: Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Add these secrets:

```bash
# Replace with your actual webhook URLs and secrets
DOKPLOY_FRONTEND_WEBHOOK=https://dokploy.your-domain.com/webhooks/frontend-id
DOKPLOY_BACKEND_WEBHOOK=https://dokploy.your-domain.com/webhooks/backend-id
DOKPLOY_WEBHOOK_SECRET=your-generated-secret-key
```

## 🔍 Testing Webhook URLs

### Test Webhook with curl:

```bash
# Test frontend webhook
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/main","repository":"jerryagenyi/ccip"}' \
  YOUR_FRONTEND_WEBHOOK_URL

# Test backend webhook
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/main","repository":"jerryagenyi/ccip"}' \
  YOUR_BACKEND_WEBHOOK_URL
```

## 📊 Deployment Monitoring

### Check Deployment Status

1. **Dokploy Dashboard**: Monitor deployment progress in real-time
2. **Build Logs**: Check build logs for any errors
3. **Service Health**: Verify services are running after deployment

### Automated Health Checks

After deployment, run these commands:

```bash
# Check all services
./scripts/setup-health-checks.sh

# Monitor logs
./scripts/monitor-logs.sh

# Check application health
curl https://ccip.jerryagenyi.xyz
curl https://api.ccip.jerryagenyi.xyz/api/health
```

## 🚨 Troubleshooting

### Common Webhook Issues:

1. **403 Forbidden**: Check webhook secret configuration
2. **404 Not Found**: Verify webhook URL is correct
3. **Timeout**: Check if Dokploy instance is accessible
4. **Build Failures**: Check build logs in Dokploy dashboard

### Manual Deployment:

If webhooks fail, you can manually trigger deployments:

1. **Dokploy Dashboard**: Click "Redeploy" on each application
2. **CLI Alternative**: Use Dokploy CLI if available
3. **GitHub Actions**: Manually trigger workflow

## 📝 Update This Document

After setting up your actual webhook URLs:

1. Replace `[TO BE FILLED FROM DOKPLOY DASHBOARD]` with actual URLs
2. Update the domain names to match your setup
3. Add any additional webhooks for monitoring or notifications
4. Commit this updated documentation

---

**Last Updated**: $(date)
**Responsible**: DevOps Team
**Contact**: Your DevOps Team Contact Information