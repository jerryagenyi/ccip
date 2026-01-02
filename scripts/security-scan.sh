#!/bin/bash
# Docker Security Scanning Script
# Scans all Docker images for vulnerabilities using Trivy

set -e

echo "🔒 Docker Security Scanning"
echo "============================"
echo ""

# Check if Trivy is installed
if ! command -v trivy &> /dev/null; then
    echo "❌ Trivy is not installed."
    echo "Install it with:"
    echo "  brew install trivy  # macOS"
    echo "  or download from: https://github.com/aquasecurity/trivy/releases"
    exit 1
fi

echo "✅ Trivy found: $(trivy --version | head -n 1)"
echo ""

# Get all images from docker-compose files
IMAGES=()

# Extract images from docker-compose.yml
if [ -f "docker-compose.yml" ]; then
    echo "📋 Scanning docker-compose.yml..."
    IMAGES+=($(grep -E "^\s+image:" docker-compose.yml | sed 's/.*image: *//' | sed 's/ *$//' | sort -u))
fi

# Extract images from docker-compose.production.yml
if [ -f "docker-compose.production.yml" ]; then
    echo "📋 Scanning docker-compose.production.yml..."
    IMAGES+=($(grep -E "^\s+image:" docker-compose.production.yml | sed 's/.*image: *//' | sed 's/ *$//' | sort -u))
fi

# Extract built images (from build context)
BUILD_IMAGES=()
if [ -f "docker-compose.yml" ]; then
    BUILD_IMAGES+=($(docker-compose config --images 2>/dev/null || true))
fi

# Combine and deduplicate
ALL_IMAGES=($(printf '%s\n' "${IMAGES[@]}" "${BUILD_IMAGES[@]}" | sort -u))

if [ ${#ALL_IMAGES[@]} -eq 0 ]; then
    echo "⚠️  No images found to scan"
    exit 0
fi

echo "Found ${#ALL_IMAGES[@]} unique image(s) to scan:"
for img in "${ALL_IMAGES[@]}"; do
    echo "  - $img"
done
echo ""

# Scan each image
FAILED_SCANS=0
for image in "${ALL_IMAGES[@]}"; do
    echo "🔍 Scanning: $image"
    echo "----------------------------------------"
    
    # Run Trivy scan
    if trivy image --severity HIGH,CRITICAL --exit-code 1 "$image" 2>&1; then
        echo "✅ No HIGH or CRITICAL vulnerabilities found"
    else
        echo "❌ HIGH or CRITICAL vulnerabilities detected!"
        FAILED_SCANS=$((FAILED_SCANS + 1))
    fi
    echo ""
done

# Summary
echo "============================"
echo "📊 Scan Summary"
echo "============================"
echo "Total images scanned: ${#ALL_IMAGES[@]}"
if [ $FAILED_SCANS -eq 0 ]; then
    echo "✅ All images passed security scan"
    exit 0
else
    echo "❌ $FAILED_SCANS image(s) have HIGH or CRITICAL vulnerabilities"
    echo ""
    echo "💡 Recommendations:"
    echo "  1. Update base images to latest versions"
    echo "  2. Review and patch vulnerabilities"
    echo "  3. Consider using distroless or alpine images"
    exit 1
fi

