#!/bin/bash

# Sync sprint-status.yaml to GitHub Projects via Issues
# This script creates GitHub Issues for epics and stories, then adds them to a GitHub Project

set -e

# Configuration
REPO="jerryagenyi/ccip"
SPRINT_STATUS="_bmad-output/implementation-artifacts/sprint-status.yaml"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}GitHub Projects Sync Script${NC}"
echo "================================"
echo ""

# Check if GitHub token is set
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${YELLOW}Warning: GITHUB_TOKEN not set${NC}"
    echo "Set it with: export GITHUB_TOKEN=your_token"
    echo "Or create a GitHub Personal Access Token with 'repo' and 'write:org' permissions"
    echo ""
    exit 1
fi

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}GitHub CLI (gh) not found${NC}"
    echo "Install it from: https://cli.github.com/"
    echo ""
    exit 1
fi

# Authenticate
gh auth status || gh auth login --with-token <<< "$GITHUB_TOKEN"

echo -e "${GREEN}Reading sprint-status.yaml...${NC}"

# Parse sprint-status.yaml and create issues
# This is a simplified version - you may want to use a YAML parser like yq

echo ""
echo -e "${GREEN}Epics and Stories Found:${NC}"
echo ""

# Extract epics and stories (simplified - you'd want proper YAML parsing)
grep -E "^(epic-|US-)" "$SPRINT_STATUS" | while IFS=: read -r key status; do
    key=$(echo "$key" | xargs)
    status=$(echo "$status" | xargs)
    
    if [[ $key == epic-* ]]; then
        epic_num=$(echo "$key" | sed 's/epic-//')
        echo "Epic $epic_num: $status"
    elif [[ $key == US-* ]]; then
        echo "  Story $key: $status"
    fi
done

echo ""
echo -e "${YELLOW}Note: This script is a template.${NC}"
echo "To fully implement, you would:"
echo "1. Parse YAML properly (use yq or Python)"
echo "2. Create GitHub Issues for each epic/story"
echo "3. Link stories to epics"
echo "4. Add issues to GitHub Project"
echo "5. Set custom fields (Status, Epic, Story ID)"
echo ""
echo "Would you like me to create a Python script for this?"
