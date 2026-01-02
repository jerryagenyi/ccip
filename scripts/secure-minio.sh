#!/bin/bash

echo "=== MinIO Security: Credential Rotation ==="
echo "Changing default MinIO credentials for production security"
echo ""

# Configuration
MINIO_CONTAINER="ccip_minio"
CURRENT_USER=${MINIO_ROOT_USER:-minioadmin}
CURRENT_PASS=${MINIO_ROOT_PASSWORD:-}

# Generate secure new credentials
echo "🔐 Generating secure new credentials..."
NEW_USER="ccip-admin-$(date +%s | tail -c 5)"
NEW_PASS=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-20)

echo "📝 New credentials generated:"
echo "   Username: $NEW_USER"
echo "   Password: $NEW_PASS"
echo ""

# Function to generate secure password
generate_secure_password() {
    openssl rand -base64 32 | tr -d "=+/\n" | cut -c1-20
}

# Check if container is running
if ! docker ps | grep $MINIO_CONTAINER > /dev/null; then
    echo "❌ MinIO container is not running. Please start services first."
    exit 1
fi

echo "⚠️  SECURITY WARNING: Changing MinIO credentials will:"
echo "   - Update access keys in your backend environment"
echo "   - Require restart of backend service"
echo "   - Update any external integrations using MinIO"
echo ""

read -p "🔄 Do you want to proceed with credential rotation? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Credential rotation cancelled."
    exit 0
fi

echo ""
echo "🔄 Starting credential rotation process..."

# Create new access key and secret key
ACCESS_KEY="ccip-$(date +%s | tail -c 8)"
SECRET_KEY=$(generate_secure_password)

echo ""
echo "🔑 Generated new MinIO credentials:"
echo "   Access Key: $ACCESS_KEY"
echo "   Secret Key: $SECRET_KEY"
echo "   Console User: $NEW_USER"
echo "   Console Pass: $NEW_PASS"
echo ""

# Update MinIO environment variables
echo "📝 Updating MinIO environment variables..."

# You need to update these in your Dokploy backend environment:
echo "🔄 Please update these environment variables in Dokploy for backend service:"
echo ""
echo "   MINIO_ACCESS_KEY=$ACCESS_KEY"
echo "   MINIO_SECRET_KEY=$SECRET_KEY"
echo "   AWS_ACCESS_KEY_ID=$ACCESS_KEY"
echo "   AWS_SECRET_ACCESS_KEY=$SECRET_KEY"
echo ""

# Create script to update MinIO container
echo "🔧 Creating MinIO credential update script..."

cat > /tmp/update-minio-creds.sh << 'EOF'
#!/bin/bash
# This script updates MinIO credentials
# Run this after updating Dokploy environment variables

NEW_USER="$NEW_USER"
NEW_PASS="$NEW_PASS"

echo "Updating MinIO credentials..."
docker exec -i ccip_minio sh << 'EOS'
# Set new console credentials
mc alias set local http://localhost:9000 $CURRENT_USER $CURRENT_PASS
mc admin user add local $NEW_USER $NEW_PASS
mc admin policy set local readwrite user=$NEW_USER

# Remove default user for security
mc admin user remove local minioadmin

echo "MinIO credentials updated successfully!"
EOS
EOF

chmod +x /tmp/update-minio-creds.sh

echo ""
echo "📋 Steps to complete MinIO security setup:"
echo ""
echo "1️⃣  Update Backend Environment Variables in Dokploy:"
echo "    - Go to ccip-backend application"
echo "    - Environment tab"
echo "    - Update these variables:"
echo "      • MINIO_ACCESS_KEY=$ACCESS_KEY"
echo "      • MINIO_SECRET_KEY=$SECRET_KEY"
echo "      • AWS_ACCESS_KEY_ID=$ACCESS_KEY"
echo "      • AWS_SECRET_ACCESS_KEY=$SECRET_KEY"
echo ""
echo "2️⃣  Update MinIO Environment Variables in Dokploy:"
echo "    - Go to ccip-minio application"
echo "    - Environment tab"
echo "    - Update these variables:"
echo "      • MINIO_ROOT_USER=$NEW_USER"
echo "      • MINIO_ROOT_PASSWORD=$NEW_PASS"
echo ""
echo "3️⃣  Restart Services:"
echo "    - Restart ccip-minio service"
echo "    - Restart ccip-backend service"
echo ""
echo "4️⃣  Test Access:"
echo "    - Test MinIO console: https://minio.jerryagenyi.xyz"
echo "    - Test file uploads from backend"
echo ""
echo "5️⃣  Save Credentials Securely:"
echo "    - Store these credentials in your password manager"
echo "    - Update any documentation"
echo ""

# Save credentials to file for backup
CREDENTIAL_FILE="./minio-credentials-$(date +%Y%m%d).txt"
cat > "$CREDENTIAL_FILE" << EOF
MinIO Production Credentials
===========================
Generated: $(date)

Console Access:
- URL: https://minio.jerryagenyi.xyz
- Username: $NEW_USER
- Password: $NEW_PASS

API Access:
- Access Key: $ACCESS_KEY
- Secret Key: $SECRET_KEY

Previous Credentials (for reference only):
- Username: $CURRENT_USER
- Password: $CURRENT_PASS

IMPORTANT: Store this file securely and delete after updating Dokploy.
EOF

echo "📄 Credentials saved to: $CREDENTIAL_FILE"
echo ""
echo "⚠️  IMPORTANT SECURITY NOTES:"
echo "   - Delete the credential file after updating Dokploy"
echo "   - Never commit credentials to version control"
echo "   - Use a password manager for secure storage"
echo "   - Rotate credentials regularly (every 90 days recommended)"
echo ""

echo "🎉 MinIO credential rotation script completed!"
echo "Next: Update your Dokploy environment variables and restart services."