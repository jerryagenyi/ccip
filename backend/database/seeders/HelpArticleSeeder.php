<?php

namespace Database\Seeders;

use App\Models\HelpArticle;
use Illuminate\Database\Seeder;

class HelpArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $articles = [
            [
                'title' => 'Getting Started with CCIP',
                'slug' => 'getting-started',
                'content' => '# Getting Started with CCIP

Welcome to the Crisis Communication and Information Platform (CCIP)! This guide will help you get started.

## Creating Your First Activity

1. Navigate to the Activities page
2. Click "Create Activity"
3. Fill in the required information
4. Submit for approval

## Understanding Activity Status

- **Draft**: Work in progress
- **Submitted**: Awaiting approval
- **Approved**: Ready to proceed
- **In Progress**: Currently active
- **Completed**: Finished successfully

## Need Help?

Contact support or check other help articles for more information.',
                'excerpt' => 'Learn how to get started with CCIP and create your first activity.',
                'category' => 'Getting Started',
                'role_access' => null, // Available to all
                'is_published' => true,
            ],
            [
                'title' => 'How to Create an Activity',
                'slug' => 'create-activity',
                'content' => '# How to Create an Activity

Creating an activity in CCIP is straightforward.

## Steps

1. Go to Activities → Create
2. Fill in the activity details:
   - Title and description
   - Type and priority
   - Target audience
   - Location information
   - Planned message content
3. Upload any supporting files
4. Save as draft or submit for approval

## Tips

- Be specific with your descriptions
- Include all relevant details
- Upload supporting documents
- Review before submitting',
                'excerpt' => 'Step-by-step guide to creating activities in CCIP.',
                'category' => 'Activities',
                'role_access' => null,
                'is_published' => true,
            ],
            [
                'title' => 'Understanding Semiotic Analysis',
                'slug' => 'semiotic-analysis',
                'content' => '# Understanding Semiotic Analysis

Semiotic analysis helps evaluate the effectiveness of your communication messages across different cultural contexts.

## What is Semiotic Analysis?

Semiotic analysis examines how messages are interpreted based on:
- Cultural context
- Language nuances
- Visual elements
- Symbolic meanings

## How It Works

1. Submit your activity with message content
2. AI analyzes the message
3. Receive risk score and recommendations
4. Review and adjust as needed

## Benefits

- Identify potential cultural issues
- Improve message effectiveness
- Reduce communication risks
- Enhance audience engagement',
                'excerpt' => 'Learn about semiotic analysis and how it helps improve your communication.',
                'category' => 'AI Features',
                'role_access' => null,
                'is_published' => true,
            ],
            [
                'title' => 'Managing Organisations',
                'slug' => 'manage-organisations',
                'content' => '# Managing Organisations

Organisations in CCIP represent hierarchical structures.

## Organisation Levels

- **National/Federal**: Top-level organisation
- **Regional/State**: Regional divisions
- **District/LGA**: District-level offices
- **Local/Municipal**: Local centers
- **Community**: Community-level initiatives

## Creating Organisations

1. Navigate to Organisations
2. Click "Create Organisation"
3. Select appropriate administrative level
4. Set parent organisation if applicable
5. Add location information

## Managing Members

- Invite users to your organisation
- Assign roles and permissions
- View organisation activities',
                'excerpt' => 'Guide to managing organisations and their hierarchical structure.',
                'category' => 'Organisations',
                'role_access' => ['admin', 'super_admin'],
                'is_published' => true,
            ],
            [
                'title' => 'Generating Reports',
                'slug' => 'generate-reports',
                'content' => '# Generating Reports

CCIP allows you to generate comprehensive reports.

## Report Types

- Activity Summary
- Performance Analysis
- Impact Assessment
- Semiotic Analysis
- Stakeholder Updates
- Research Findings
- Incident Reports

## Creating Reports

1. Go to Reports
2. Select a template
3. Choose filters and date range
4. Generate report
5. Export in PDF, Excel, or CSV

## AI-Powered Reports

Use AI to generate insights and recommendations automatically.',
                'excerpt' => 'Learn how to create and export reports in various formats.',
                'category' => 'Reports',
                'role_access' => null,
                'is_published' => true,
            ],
            [
                'title' => 'User Roles and Permissions',
                'slug' => 'user-roles',
                'content' => '# User Roles and Permissions

CCIP has different user roles with varying permissions.

## Roles

### Super Admin
- Full system access
- Manage all organisations
- System configuration

### Admin
- Manage organisation
- Approve activities
- View analytics

### Sub Admin
- Create and manage activities
- Limited administrative access

### User
- Create activities
- View own activities
- Basic reporting

## Permissions

Each role has specific permissions. Contact your administrator for role changes.',
                'excerpt' => 'Understanding user roles and their permissions in CCIP.',
                'category' => 'User Guide',
                'role_access' => null,
                'is_published' => true,
            ],
        ];

        foreach ($articles as $article) {
            HelpArticle::create($article);
        }
    }
}

