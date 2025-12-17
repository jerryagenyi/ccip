#!/bin/bash

echo "=== PostgreSQL Database Backup Script ==="
echo "Creating automated backups for CCIP production database"
echo ""

# Configuration
DB_CONTAINER="ccip_database"
DB_NAME="ccip_production"
DB_USER="ccip_user"
BACKUP_DIR="/backups"
BACKUP_RETENTION_DAYS=7
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/ccip_backup_${TIMESTAMP}.sql.gz"
LOG_FILE="${BACKUP_DIR}/backup_log.txt"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first." | tee -a "$LOG_FILE"
    exit 1
fi

# Check if database container is running
if ! docker ps | grep $DB_CONTAINER > /dev/null; then
    echo "❌ Database container $DB_CONTAINER is not running." | tee -a "$LOG_FILE"
    exit 1
fi

# Create backup directory if it doesn't exist
echo "📁 Ensuring backup directory exists..."
mkdir -p "$BACKUP_DIR"

# Create backup
echo "🔄 Creating database backup..."
echo "Backup started at: $(date)" >> "$LOG_FILE"

if docker exec $DB_CONTAINER pg_dump -U $DB_USER -d $DB_NAME | gzip > "$BACKUP_FILE"; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "✅ Backup created successfully: $BACKUP_FILE"
    echo "✅ Backup size: $BACKUP_SIZE" | tee -a "$LOG_FILE"
    echo "✅ Backup completed at: $(date)" >> "$LOG_FILE"
else
    echo "❌ Backup failed!" | tee -a "$LOG_FILE"
    echo "❌ Backup failed at: $(date)" >> "$LOG_FILE"
    exit 1
fi

# Clean up old backups (keep only last 7 days)
echo "🧹 Cleaning up old backups (keeping last $BACKUP_RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "ccip_backup_*.sql.gz" -mtime +$BACKUP_RETENTION_DAYS -delete

# List current backups
echo ""
echo "📋 Current backups:"
ls -lh "$BACKUP_DIR"/ccip_backup_*.sql.gz | tee -a "$LOG_FILE"

# Test backup integrity
echo ""
echo "🔍 Testing backup integrity..."
if gzip -t "$BACKUP_FILE" 2>/dev/null; then
    echo "✅ Backup file integrity verified"
else
    echo "❌ Backup file integrity check failed!" | tee -a "$LOG_FILE"
fi

# Calculate total backup size
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
echo "📊 Total backup directory size: $TOTAL_SIZE"

echo ""
echo "🎉 Database backup process completed!"
echo ""
echo "📝 Backup Details:"
echo "- File: $BACKUP_FILE"
echo "- Size: $BACKUP_SIZE"
echo "- Retention: $BACKUP_RETENTION_DAYS days"
echo "- Log file: $LOG_FILE"
echo ""
echo "💡 To restore from backup:"
echo "gunzip -c $BACKUP_FILE | docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME"

# Send notification if you have monitoring setup
# You can add your notification logic here (Slack, email, etc.)