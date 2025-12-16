#!/usr/bin/env python3
"""
Sync sprint-status.yaml to GitHub Projects via Issues

This script:
1. Reads docs/sprint-artifacts/sprint-status.yaml
2. Creates GitHub Issues for epics and stories
3. Links stories to epics
4. Adds issues to a GitHub Project
5. Sets custom fields (Status, Epic, Story ID)

Requirements:
- pip install pyyaml requests
- GitHub Personal Access Token with 'repo' and 'write:org' permissions
- GitHub CLI (gh) installed and authenticated
"""

import yaml
import os
import sys
import subprocess
import json
from pathlib import Path

# Configuration
REPO = "jerryagenyi/ccip"
SPRINT_STATUS_FILE = "docs/sprint-artifacts/sprint-status.yaml"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def read_sprint_status():
    """Read and parse sprint-status.yaml"""
    with open(SPRINT_STATUS_FILE, 'r') as f:
        content = f.read()
    
    # Parse YAML
    data = yaml.safe_load(content)
    return data.get('development_status', {})

def create_github_issue(title, body, labels):
    """Create a GitHub issue using gh CLI"""
    cmd = [
        'gh', 'issue', 'create',
        '--repo', REPO,
        '--title', title,
        '--body', body,
        '--label', ','.join(labels)
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        issue_url = result.stdout.strip()
        issue_number = issue_url.split('/')[-1]
        return issue_number
    else:
        print(f"Error creating issue: {result.stderr}")
        return None

def get_epic_issue_number(epic_key):
    """Get existing issue number for epic, or create one"""
    # Check if issue already exists
    cmd = ['gh', 'issue', 'list', '--repo', REPO, '--label', f'epic:{epic_key}', '--json', 'number,title', '--limit', '1']
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0 and result.stdout.strip():
        issues = json.loads(result.stdout)
        if issues:
            return issues[0]['number']
    
    # Create new epic issue
    epic_file = f"docs/epics/epic-{epic_key.replace('epic-', '')}-*.md"
    epic_files = list(Path("docs/epics").glob(f"epic-{epic_key.replace('epic-', '')}-*.md"))
    
    if epic_files:
        with open(epic_files[0], 'r') as f:
            epic_content = f.read()
        
        title = f"Epic {epic_key.replace('epic-', '')}: {epic_content.split('## Epic')[1].split('##')[0].strip()[:50] if '## Epic' in epic_content else 'Epic'}"
        body = f"Epic from BMAD Method\n\n{epic_content[:2000]}"
        labels = ['epic', f'epic:{epic_key}']
        
        return create_github_issue(title, body, labels)
    
    return None

def sync_to_github_projects():
    """Main sync function"""
    if not GITHUB_TOKEN:
        print("Error: GITHUB_TOKEN environment variable not set")
        print("Set it with: export GITHUB_TOKEN=your_token")
        sys.exit(1)
    
    print("Reading sprint-status.yaml...")
    status = read_sprint_status()
    
    epic_issues = {}
    story_issues = {}
    
    print("\nCreating GitHub Issues...")
    
    # First pass: Create epic issues
    for key, value in status.items():
        if key.startswith('epic-') and not key.endswith('-retrospective'):
            epic_num = key.replace('epic-', '')
            issue_num = get_epic_issue_number(key)
            if issue_num:
                epic_issues[key] = issue_num
                print(f"✅ Epic {epic_num}: Issue #{issue_num}")
    
    # Second pass: Create story issues
    for key, value in status.items():
        if key.startswith('US-'):
            # Extract epic number from story
            story_num = key.split('-')[1]
            epic_key = f"epic-{story_num.zfill(3)}"
            
            # Read story file
            story_file = Path(f"docs/stories/{key}.md")
            if story_file.exists():
                with open(story_file, 'r') as f:
                    story_content = f.read()
                
                title = f"{key}: {story_content.split('**Epic:**')[0].split('# Story')[1].strip()[:50] if '# Story' in story_content else key}"
                body = f"Story from BMAD Method\n\n{story_content[:2000]}"
                
                # Link to epic issue
                if epic_key in epic_issues:
                    body += f"\n\nRelated Epic: #{epic_issues[epic_key]}"
                
                labels = ['story', f'epic:{epic_key}', f'status:{value}']
                
                issue_num = create_github_issue(title, body, labels)
                if issue_num:
                    story_issues[key] = issue_num
                    print(f"✅ {key}: Issue #{issue_num} (Status: {value})")
    
    print(f"\n✅ Created {len(epic_issues)} epic issues and {len(story_issues)} story issues")
    print("\nNext steps:")
    print("1. Go to GitHub Projects and create a new project")
    print("2. Add all issues to the project")
    print("3. Set up custom fields: Epic, Story ID, Status")
    print("4. Create columns: Backlog, Drafted, Ready for Dev, In Progress, Review, Done")
    print("5. Use automation to move issues based on labels")

if __name__ == "__main__":
    sync_to_github_projects()
