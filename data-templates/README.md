# CCIP Data Templates

This directory contains CSV templates for generating realistic test data to import into CCIP during development and demonstrations.

## Overview

These templates simulate a complete organizational ecosystem with multiple implementation types:

### Implementation Type 1: Nigeria (Hierarchical Government Structure)
- **Government Network**: Federal → State → LGA hierarchy
- **NGO Network**: National organization with regional offices
- **CSO Network**: Grassroots civil society organization

### Implementation Type 2: International Organization (Regional Branches)
- **Global Headquarters**: International health organization
- **Regional Offices**: Africa and Asia regional branches

### Implementation Type 3: National-Level Organizations
- **UK National**: UK National Health Coordination Office
- **Kenya National**: Kenya Ministry of Health

## Files

1. **organisations.csv** - Defines all organizations and their hierarchical relationships
2. **users.csv** - Populates users with different roles across organizations
3. **activities.csv** - Creates realistic activities tied to organizations and users

## Data Distribution

### Organizations
**Nigeria (Type 1 - Hierarchical):**
- **Government**: 1 Federal, 1 State, 1 LGA (3 total)
- **NGO**: 1 National, 1 Regional Office (2 total)
- **CSO**: 1 State-level organization (1 total)

**International (Type 2 - Regional Branches):**
- **Global Headquarters**: 1 organization
- **Regional Offices**: 2 regional branches (Africa, Asia)

**National-Level (Type 3):**
- **UK**: 1 national organization
- **Kenya**: 1 national organization

**Total**: 11 organizations

### Users
- **Nigeria Government Network**: 12 users
- **Nigeria NGO Network**: 6 users
- **Nigeria CSO Network**: 4 users
- **International Organization**: 8 users (3 global, 3 Africa, 2 Asia)
- **UK National**: 5 users
- **Kenya National**: 5 users
- **Total**: 40 users

### Activities
- Activities are distributed across users (some have 3-4, some have 5-7, some have 8+)
- Activities reflect the organizational type and level:
  - **Federal/Global**: Policy, strategy, coordination activities
  - **State/Regional**: Program implementation, training, data review
  - **LGA/Field**: Community outreach, direct service delivery
  - **National**: National-level programs and policy
- Mix of statuses: Draft, Submitted, Approved, Completed
- Various activity types: workshop, campaign, meeting, training, outreach, policy_review, other
- **Total**: 74 activities

## Usage

### Import Process

1. **Import Organizations First**
   - Organizations must be imported before users and activities
   - Parent organizations must exist before child organizations

2. **Import Users Second**
   - Users reference organizations, so orgs must exist first
   - Ensure email addresses are unique

3. **Import Activities Last**
   - Activities reference both organizations and users
   - Both must exist before importing activities

### CSV Format Requirements

- **Encoding**: UTF-8
- **Delimiter**: Comma (,)
- **Header Row**: First row contains column names
- **Quotes**: Use double quotes for fields containing commas or special characters
- **Dates**: Format as YYYY-MM-DD
- **Empty Fields**: Leave blank (not "NULL" or "null")

### Data Validation

Before importing, ensure:
- All `parent_id` values in organisations.csv reference existing `id` values
- All `organisation_id` values in users.csv reference existing organisation `id` values
- All `organisation_id` and `user_id` values in activities.csv reference existing records
- Email addresses are unique across all users
- Date formats are correct (YYYY-MM-DD)

## Customization

You can modify these templates to:
- Add more organizations to any network
- Create additional users with different roles
- Generate more activities for specific users
- Adjust dates to reflect current/future timeframes
- Change locations to match your target regions

## Notes

- **IDs**: Use descriptive prefixes (e.g., `org_gov_fed_01`, `user_001`) for easy reference
- **Realistic Data**: All data is fictional but designed to be realistic
- **Relationships**: The templates maintain proper hierarchical and relational integrity
- **Variety**: Activities vary in type, status, and complexity to showcase different features

## Future Enhancements

Consider adding templates for:
- Activity evidence/attachments
- Activity tags
- Report templates
- Announcements
- Messages/notifications
- Subscription data

