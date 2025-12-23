#!/bin/bash

echo "=== CCIP Log Aggregation Setup ==="
echo "Setting up centralized log collection and monitoring"
echo ""

# Configuration
LOG_DIR="/var/log/ccip"
ROTATION_DIR="/etc/logrotate.d"
NGINX_CONF_DIR="/etc/nginx/conf.d"

# Create log directories
echo "📁 Creating log directories..."
mkdir -p "$LOG_DIR"/{frontend,backend,database,redis,minio,aggregated}
mkdir -p "$LOG_DIR"/archive

# Set permissions
chown -R root:adm "$LOG_DIR"
chmod 755 "$LOG_DIR"
chmod 755 "$LOG_DIR"/*
chmod 750 "$LOG_DIR"/archive

echo "✅ Log directories created: $LOG_DIR"

# Create log aggregation script
cat > "$LOG_DIR/collect-logs.sh" << 'EOF'
#!/bin/bash

# CCIP Log Collection Script
LOG_DIR="/var/log/ccip"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
AGGREGATED_LOG="$LOG_DIR/aggregated/ccip-logs-$TIMESTAMP.log"

echo "=== CCIP Log Collection Started at $(date) ===" >> "$AGGREGATED_LOG"

# Function to collect container logs
collect_container_logs() {
    local container=$1
    local service=$2
    local log_file="$LOG_DIR/$service/$service-$(date +%Y%m%d).log"

    if docker ps | grep -q $container; then
        echo ""
        echo "=== $service Logs $(date) ===" >> "$log_file"
        docker logs --tail 100 $container 2>&1 >> "$log_file"
        echo "" >> "$log_file"
    fi
}

# Collect logs from all services
collect_container_logs "ccip_frontend" "frontend"
collect_container_logs "ccip_backend" "backend"
collect_container_logs "ccip_database" "database"
collect_container_logs "ccip_redis" "redis"
collect_container_logs "ccip_minio" "minio"

# Create aggregated log file
echo "Creating aggregated log file: $AGGREGATED_LOG"

for service in frontend backend database redis minio; do
    LATEST_LOG=$(ls -t "$LOG_DIR/$service"/*.log 2>/dev/null | head -1)
    if [[ -n "$LATEST_LOG" && -f "$LATEST_LOG" ]]; then
        echo ""
        echo "=== Latest $service Logs ===" >> "$AGGREGATED_LOG"
        cat "$LATEST_LOG" >> "$AGGREGATED_LOG"
        echo "" >> "$AGGREGATED_LOG"
    fi
done

echo "=== Log Collection Completed at $(date) ===" >> "$AGGREGATED_LOG"

# Compress old logs
find "$LOG_DIR/aggregated" -name "*.log" -mtime +1 -exec gzip {} \;

# Show summary
echo "Log collection completed:"
echo "- Aggregated log: $AGGREGATED_LOG"
echo "- Log directory size: $(du -sh $LOG_DIR | cut -f1)"
echo "- Total log files: $(find $LOG_DIR -name "*.log" | wc -l)"
EOF

chmod +x "$LOG_DIR/collect-logs.sh"

# Create log rotation configuration
cat > "$ROTATION_DIR/ccip-logs" << EOF
# CCIP Log Rotation Configuration

/var/log/ccip/*/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root adm
    sharedscripts
    postrotate
        # Restart any services that need log rotation awareness
        docker kill -s USR1 ccip_frontend 2>/dev/null || true
    endscript
}

/var/log/ccip/aggregated/*.log {
    daily
    missingok
    rotate 90
    compress
    delaycompress
    notifempty
    create 644 root adm
}
EOF

echo "✅ Log rotation configured"

# Create log analysis script
cat > "$LOG_DIR/analyze-logs.sh" << 'EOF'
#!/bin/bash

# CCIP Log Analysis Script
LOG_DIR="/var/log/ccip"
ANALYSIS_FILE="$LOG_DIR/analysis-$(date +%Y%m%d_%H%M%S).txt"

echo "=== CCIP Log Analysis Report ===" > "$ANALYSIS_FILE"
echo "Generated: $(date)" >> "$ANALYSIS_FILE"
echo "" >> "$ANALYSIS_FILE"

# Function to analyze service logs
analyze_service_logs() {
    local service=$1
    local log_pattern="$LOG_DIR/$service/*$2*.log"

    echo "=== $service Analysis ===" >> "$ANALYSIS_FILE"

    for log_file in $log_pattern; do
        if [[ -f "$log_file" ]]; then
            echo "Analyzing: $(basename $log_file)" >> "$ANALYSIS_FILE"

            # Count error occurrences
            ERROR_COUNT=$(grep -c -i "error\|exception\|failed\|fatal" "$log_file" 2>/dev/null || echo "0")
            echo "  Errors/Warnings: $ERROR_COUNT" >> "$ANALYSIS_FILE"

            # Count warning occurrences
            WARNING_COUNT=$(grep -c -i "warning\|warn" "$log_file" 2>/dev/null || echo "0")
            echo "  Warnings: $WARNING_COUNT" >> "$ANALYSIS_FILE"

            # Show last error if any
            LAST_ERROR=$(grep -i "error\|exception\|failed\|fatal" "$log_file" 2>/dev/null | tail -1)
            if [[ -n "$LAST_ERROR" ]]; then
                echo "  Last Error: $LAST_ERROR" >> "$ANALYSIS_FILE"
            fi

            echo "" >> "$ANALYSIS_FILE"
        fi
    done
}

# Analyze recent logs (today and yesterday)
TODAY=$(date +%Y%m%d)
YESTERDAY=$(date -d "yesterday" +%Y%m%d)

echo "Analyzing logs for: $TODAY, $YESTERDAY" >> "$ANALYSIS_FILE"
echo "" >> "$ANALYSIS_FILE"

# Analyze each service
for service in frontend backend database redis minio; do
    analyze_service_logs "$service" "$TODAY"
    analyze_service_logs "$service" "$YESTERDAY"
done

# Show disk usage
echo "=== Disk Usage ===" >> "$ANALYSIS_FILE"
echo "Total log directory size: $(du -sh $LOG_DIR | cut -f1)" >> "$ANALYSIS_FILE"
echo "Archived logs size: $(du -sh $LOG_DIR/archive 2>/dev/null || echo "0")" >> "$ANALYSIS_FILE"
echo "" >> "$ANALYSIS_FILE"

# Show log file counts
echo "=== Log File Counts ===" >> "$ANALYSIS_FILE"
for service in frontend backend database redis minio aggregated; do
    COUNT=$(find "$LOG_DIR/$service" -name "*.log" 2>/dev/null | wc -l)
    echo "$service: $COUNT log files" >> "$ANALYSIS_FILE"
done

echo "" >> "$ANALYSIS_FILE"
echo "=== Analysis completed at $(date) ===" >> "$ANALYSIS_FILE"

# Display results
cat "$ANALYSIS_FILE"

echo "Analysis report saved to: $ANALYSIS_FILE"
EOF

chmod +x "$LOG_DIR/analyze-logs.sh"

# Create real-time log monitoring script
cat > "$LOG_DIR/monitor-logs.sh" << 'EOF'
#!/bin/bash

# CCIP Real-time Log Monitoring
LOG_DIR="/var/log/ccip"

echo "=== CCIP Real-time Log Monitoring ==="
echo "Press Ctrl+C to stop monitoring"
echo ""

# Function to show container logs in real-time
monitor_container() {
    local container=$1
    local service=$2

    echo "🔍 Monitoring $service (Container: $container)"
    echo "----------------------------------------"

    if docker ps | grep -q $container; then
        docker logs -f $container 2>&1 | while read line; do
            echo "$(date '+%Y-%m-%d %H:%M:%S') [$service] $line"
        done
    else
        echo "❌ Container $container is not running"
        sleep 5
    fi
}

# Menu for selecting services
echo "Select services to monitor:"
echo "1. Frontend"
echo "2. Backend"
echo "3. Database"
echo "4. Redis"
echo "5. MinIO"
echo "6. All services"
echo ""
read -p "Enter choice (1-6): " choice

case $choice in
    1)
        monitor_container "ccip_frontend" "Frontend"
        ;;
    2)
        monitor_container "ccip_backend" "Backend"
        ;;
    3)
        monitor_container "ccip_database" "Database"
        ;;
    4)
        monitor_container "ccip_redis" "Redis"
        ;;
    5)
        monitor_container "ccip_minio" "MinIO"
        ;;
    6)
        echo "🔍 Monitoring all services..."
        docker logs -f ccip_frontend ccip_backend ccip_database ccip_redis ccip_minio 2>&1 | while read line; do
            echo "$(date '+%Y-%m-%d %H:%M:%S') $line"
        done
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
EOF

chmod +x "$LOG_DIR/monitor-logs.sh"

# Create cron jobs for automated log management
echo ""
echo "📅 Setting up automated log management cron jobs..."

# Add to root's crontab
(crontab -l 2>/dev/null; echo "") | sort -u | crontab -
crontab -l 2>/dev/null | { cat; echo "
# CCIP Log Management
0 */6 * * * $LOG_DIR/collect-logs.sh
0 2 * * * $LOG_DIR/analyze-logs.sh
*/15 * * * * /usr/sbin/logrotate -f /etc/logrotate.d/ccip-logs >/dev/null 2>&1
"; } | crontab -

echo "✅ Cron jobs added:"
echo "   - Log collection: Every 6 hours"
echo "   - Log analysis: Daily at 2 AM"
echo "   - Log rotation: Every 15 minutes"

# Create log dashboard summary
cat > "$LOG_DIR/dashboard.sh" << 'EOF'
#!/bin/bash

# CCIP Log Dashboard
LOG_DIR="/var/log/ccip"

clear
echo "=========================================="
echo "        CCIP PRODUCTION LOG DASHBOARD"
echo "=========================================="
echo "Updated: $(date)"
echo ""

echo "📊 LOG STATISTICS"
echo "----------------------------------------"
echo "Total log directory size: $(du -sh $LOG_DIR | cut -f1)"
echo "Archived logs: $(find $LOG_DIR/archive -name "*.gz" 2>/dev/null | wc -l) files"
echo "Active log files: $(find $LOG_DIR -name "*.log" -not -path "*/archive/*" | wc -l) files"
echo ""

echo "📂 LOG FILE BREAKDOWN"
echo "----------------------------------------"
for service in frontend backend database redis minio aggregated; do
    SIZE=$(du -sh "$LOG_DIR/$service" 2>/dev/null | cut -f1)
    COUNT=$(find "$LOG_DIR/$service" -name "*.log" 2>/dev/null | wc -l)
    printf "%-10s: %6s files, %6s\n" "$service" "$COUNT" "$SIZE"
done

echo ""
echo "🔍 RECENT ERRORS (Last 24 Hours)"
echo "----------------------------------------"
for service in frontend backend database redis minio; do
    echo "$service:"
    docker logs --since=24h ccip_$service 2>&1 | grep -i -E "(error|exception|failed|fatal)" | tail -3 | sed 's/^/  /'
    if ! docker logs --since=24h ccip_$service 2>&1 | grep -q -i -E "(error|exception|failed|fatal)"; then
        echo "  ✅ No errors in last 24 hours"
    fi
    echo ""
done

echo "🏥 SERVICE HEALTH STATUS"
echo "----------------------------------------"
for service in frontend backend database redis minio; do
    container="ccip_$service"
    if docker ps | grep -q $container; then
        STATUS=$(docker inspect -f '{{.State.Status}}' $container)
        HEALTH=$(docker inspect -f '{{.State.Health.Status}}' $container 2>/dev/null || echo "no-check")
        printf "%-10s: %-10s (%s)\n" "$service" "$STATUS" "$HEALTH"
    else
        printf "%-10s: %-10s (%s)\n" "$service" "STOPPED" "N/A"
    fi
done

echo ""
echo "🔧 QUICK ACTIONS"
echo "----------------------------------------"
echo "1. Collect logs: $LOG_DIR/collect-logs.sh"
echo "2. Analyze logs: $LOG_DIR/analyze-logs.sh"
echo "3. Monitor logs: $LOG_DIR/monitor-logs.sh"
echo "4. View recent errors: tail -n 20 $LOG_DIR/aggregated/*.log"
echo ""

echo "=========================================="
EOF

chmod +x "$LOG_DIR/dashboard.sh"

# Create symlink for easy access
ln -sf "$LOG_DIR/dashboard.sh" "/usr/local/bin/ccip-logs"

echo ""
echo "✅ Log aggregation setup completed!"
echo ""
echo "📂 Log directory: $LOG_DIR"
echo "📊 Log dashboard: ccip-logs"
echo ""
echo "🔧 Available commands:"
echo "   - View log dashboard: ccip-logs"
echo "   - Collect logs: $LOG_DIR/collect-logs.sh"
echo "   - Analyze logs: $LOG_DIR/analyze-logs.sh"
echo "   - Monitor logs: $LOG_DIR/monitor-logs.sh"
echo ""
echo "⚙️  Automated tasks configured:"
echo "   - Log collection every 6 hours"
echo "   - Log analysis daily at 2 AM"
echo "   - Log rotation every 15 minutes"