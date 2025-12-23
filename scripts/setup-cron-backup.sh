#!/bin/bash

echo "=== Setting Up Automated Database Backups ==="
echo "Configuring cron job for automatic PostgreSQL backups"
echo ""

# Path to backup script
BACKUP_SCRIPT="/usr/local/bin/ccip-backup.sh"
CURRENT_DIR="$(pwd)/scripts"
LOG_FILE="/var/log/ccip-backup.log"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo "❌ This script must be run as root (use sudo)"
   exit 1
fi

# Copy backup script to system location
echo "📋 Installing backup script to system location..."
cp "$CURRENT_DIR/backup-database.sh" "$BACKUP_SCRIPT"
chmod +x "$BACKUP_SCRIPT"

echo "✅ Backup script installed at: $BACKUP_SCRIPT"

# Create log file
touch "$LOG_FILE"
chmod 666 "$LOG_FILE"
echo "✅ Log file created at: $LOG_FILE"

# Create cron job
CRON_JOB="0 2 * * * $BACKUP_SCRIPT >> $LOG_FILE 2>&1"
TEMP_CRON="/tmp/ccip_cron"

# Add to root's crontab
echo "⏰ Setting up cron job for daily backups at 2:00 AM..."
(crontab -l 2>/dev/null; echo "$CRON_JOB") | sort -u | crontab -

if crontab -l | grep -q "$BACKUP_SCRIPT"; then
    echo "✅ Cron job added successfully"
    echo "📅 Backups will run daily at 2:00 AM"
else
    echo "❌ Failed to add cron job"
    exit 1
fi

# Show current crontab
echo ""
echo "📋 Current root crontab:"
crontab -l

echo ""
echo "🔍 Cron job details:"
echo "- Schedule: Daily at 2:00 AM"
echo "- Command: $BACKUP_SCRIPT"
echo "- Log file: $LOG_FILE"
echo "- Retention: 7 days (configured in backup script)"

echo ""
echo "🧪 To test the backup immediately:"
echo "sudo $BACKUP_SCRIPT"

echo ""
echo "📊 To view backup logs:"
echo "sudo tail -f $LOG_FILE"

echo ""
echo "❌ To remove the cron job (if needed):"
echo "sudo crontab -e"
echo "# Then delete the line containing $BACKUP_SCRIPT"

echo ""
echo "🎉 Automated backup setup completed!"