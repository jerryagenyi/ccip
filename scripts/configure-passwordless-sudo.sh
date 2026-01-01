#!/bin/bash
# Configure passwordless sudo for user 'ja'
# Run this script on the VPS after SSH'ing in

USERNAME="ja"

echo "Configuring passwordless sudo for user: $USERNAME"
echo ""

# Create sudoers file for passwordless sudo
echo "$USERNAME ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/${USERNAME}-nopasswd

# Set correct permissions (read-only for root, no access for others)
sudo chmod 0440 /etc/sudoers.d/${USERNAME}-nopasswd

# Verify sudoers syntax
if sudo visudo -c; then
    echo ""
    echo "✅ Passwordless sudo configured successfully!"
    echo "You can now use 'sudo' without entering a password."
    echo ""
    echo "Test it with: sudo whoami"
else
    echo ""
    echo "❌ Error: Sudoers syntax check failed!"
    echo "Removing the file to prevent lockout..."
    sudo rm /etc/sudoers.d/${USERNAME}-nopasswd
    exit 1
fi

