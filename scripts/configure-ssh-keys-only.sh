#!/bin/bash
# Configure SSH to use key authentication only (disable password authentication)
# Run this script on the VPS after SSH'ing in

echo "🔐 Configuring SSH for key-based authentication only..."
echo ""

# Backup SSH config
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup created: /etc/ssh/sshd_config.backup.*"
echo ""

# Check current SSH config
echo "Current SSH configuration:"
echo "---------------------------"
sudo grep -E "^PasswordAuthentication|^PubkeyAuthentication|^PermitRootLogin" /etc/ssh/sshd_config || echo "Settings not found (will be added)"
echo ""

# Configure SSH for key authentication only
echo "Configuring SSH settings..."
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config
sudo sed -i 's/PubkeyAuthentication no/PubkeyAuthentication yes/' /etc/ssh/sshd_config

# Ensure these settings exist (add if missing)
if ! sudo grep -q "^PasswordAuthentication" /etc/ssh/sshd_config; then
    echo "PasswordAuthentication no" | sudo tee -a /etc/ssh/sshd_config
fi

if ! sudo grep -q "^PubkeyAuthentication" /etc/ssh/sshd_config; then
    echo "PubkeyAuthentication yes" | sudo tee -a /etc/ssh/sshd_config
fi

# Disable root login (security best practice)
sudo sed -i 's/#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config

echo ""
echo "Updated SSH configuration:"
echo "---------------------------"
sudo grep -E "^PasswordAuthentication|^PubkeyAuthentication|^PermitRootLogin" /etc/ssh/sshd_config
echo ""

# Test SSH config syntax
echo "Testing SSH configuration syntax..."
if sudo sshd -t; then
    echo "✅ SSH configuration syntax is valid"
    echo ""
    echo "⚠️  IMPORTANT: Before restarting SSH service, make sure you can login with SSH key!"
    echo "   Test from another terminal: ssh ja@100.123.6.36"
    echo ""
    read -p "Do you want to restart SSH service now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Restarting SSH service..."
        sudo systemctl restart sshd
        echo "✅ SSH service restarted"
        echo ""
        echo "🔒 Password authentication is now DISABLED"
        echo "   Only SSH key authentication will work"
    else
        echo "SSH service NOT restarted. Run manually when ready:"
        echo "  sudo systemctl restart sshd"
    fi
else
    echo "❌ SSH configuration syntax error!"
    echo "Restoring backup..."
    sudo cp /etc/ssh/sshd_config.backup.* /etc/ssh/sshd_config
    exit 1
fi

