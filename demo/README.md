# RCAP Demo Data Templates

## Purpose

This directory contains comprehensive CSV templates for generating realistic test data to import into RCAP during development, testing, and demonstrations. The data is designed to mirror real-world organizational structures, relationships, and scenarios that RCAP will encounter in production.

## What We Intend to Do With These Files

### Primary Use Cases

1. **Development Testing**
   - Import data during backend development to test database relationships, queries, and API endpoints
   - Validate hierarchical structures, role-based access control, and data integrity
   - Test edge cases and boundary conditions

2. **UI/UX Prototyping**
   - Populate the application with realistic data to design and test user interfaces
   - Demonstrate how the system handles different organizational structures and user roles
   - Show data visualization, filtering, and reporting capabilities

3. **Demonstrations**
   - Showcase RCAP's capabilities to stakeholders, potential clients, and investors
   - Demonstrate multi-tenancy, hierarchical relationships, and cross-organizational features
   - Illustrate how RCAP works across different countries, organizational types, and implementation models

4. **Training and Onboarding**
   - Provide sample data for training new developers and users
   - Help users understand how to structure their own data
   - Serve as examples for data import processes

5. **Performance Testing**
   - Test system performance with realistic data volumes
   - Validate scalability with multiple organizations, users, and activities
   - Test query optimization and database performance

## Implementation Types Covered

### Type 1: Hierarchical Government Structure (Nigeria)
**Structure**: Federal → State → LGA
- **Federal Ministry of Health**: National policy and coordination
- **State Ministries**: Lagos State, Kano State (multiple states)
- **Local Government Areas**: Ikeja LGA, Dala LGA (field implementation)
- **NGOs**: National organization with regional offices
- **CSOs**: Grassroots organizations at state level

**Real-World Scenario**: Represents a typical federal system where health services are delivered through multiple administrative levels, with coordination flowing from federal to state to local levels.

### Type 2: International Organization with Regional Branches
**Structure**: Global HQ → Regional Offices → Country Offices
- **Global Health Initiative**: International headquarters
- **Regional Offices**: Africa Regional Office, Asia Regional Office
- **Country Offices**: Nigeria, Kenya, Ghana (Africa); India, Bangladesh (Asia)

**Real-World Scenario**: Mirrors how international NGOs and UN agencies operate, with global strategy set at headquarters, regional coordination, and country-level implementation.

### Type 3: National-Level Organizations
**Structure**: National → Regional/County (where applicable)
- **UK**: National Health Coordination Office → Regional Health Services (North West, London & South East)
- **Kenya**: Ministry of Health → County Health Departments (Nairobi, Kisumu)

**Real-World Scenario**: Represents single-country implementations where national health ministries coordinate services, with regional or county-level delivery units.

## Real-Life Scenarios Mirrored

### 1. **Multi-Level Hierarchies**
- Federal/State/LGA structure (Nigeria)
- Global/Regional/Country structure (International)
- National/Regional structure (UK, Kenya)

### 2. **Cross-Sector Collaboration**
- Government organizations working with NGOs
- International organizations partnering with national governments
- CSOs advocating to government agencies

### 3. **Geographic Diversity**
- Multiple countries (Nigeria, UK, Kenya, Ghana, India, Bangladesh)
- Multiple regions within countries (Lagos, Kano; North West, London; Nairobi, Kisumu)
- Urban and rural contexts

### 4. **Organizational Variety**
- Government ministries and departments
- International NGOs
- National NGOs
- Civil society organizations
- Research institutes

### 5. **Role Distribution**
- Super Admins at top levels (Federal, Global)
- Admins at state/regional levels
- Sub-admins at local/country levels
- Regular users at all levels

## Edge Cases Included

### 1. **Standalone Organizations**
- **Independent Health Research Institute**: Organization with no parent, representing research institutions or independent entities
- **Community Health Volunteers Network**: Grassroots network without formal hierarchy

**Why This Matters**: Tests how RCAP handles organizations that don't fit into traditional hierarchies, ensuring the system is flexible enough for various organizational models.

### 2. **Organizations with Minimal Users**
- Some organizations have only 2-3 users (e.g., standalone organizations)
- Tests system behavior with small teams

**Why This Matters**: Ensures RCAP works for both large and small organizations, not just large bureaucracies.

### 3. **Invited Users**
- Users with "Invited" status who haven't yet activated their accounts
- Tests user onboarding and invitation workflows

**Why This Matters**: Represents real-world scenarios where users are invited but haven't completed registration.

### 4. **Cross-Category Hierarchies**
- CSO linked to government organization (demonstrates collaboration)
- International organization working with national governments

**Why This Matters**: Tests RCAP's ability to handle complex relationships where organizations from different categories collaborate.

### 5. **Multiple States/Regions Under Same Parent**
- Two states (Lagos, Kano) under Federal MOH
- Multiple country offices under regional offices
- Multiple counties under national ministry

**Why This Matters**: Tests how RCAP handles organizations with multiple children at the same level.

### 6. **Activities Across Different Statuses**
- Mix of Draft, Submitted, Approved, Completed, and Rejected activities
- Activities with past dates (completed) and future dates (planned)

**Why This Matters**: Tests workflow states and time-based filtering/reporting.

### 7. **Varied Activity Distribution**
- Some users have 3-4 activities
- Some have 5-7 activities
- Some have 8+ activities
- Some have no activities (new users)

**Why This Matters**: Represents realistic workload distribution and tests how the system handles varying data volumes per user.

### 8. **Different Activity Types**
- Policy reviews (federal/global level)
- Workshops and training (capacity building)
- Campaigns (awareness and prevention)
- Outreach (field activities)
- Meetings (coordination)
- Other (system upgrades, research, etc.)

**Why This Matters**: Tests categorization, filtering, and reporting by activity type.

## Data Statistics

### Organizations: 25 total
- **Nigeria**: 11 organizations
  - Government: 5 (1 Federal, 2 State, 2 LGA)
  - NGO: 3 (1 National, 2 Regional)
  - CSO: 2 (State-level)
  - Standalone: 1
- **International**: 8 organizations
  - Global: 1
  - Regional: 2 (Africa, Asia)
  - Country: 5 (Nigeria, Kenya, Ghana, India, Bangladesh)
- **UK**: 3 organizations
  - National: 1
  - Regional: 2
- **Kenya**: 3 organizations
  - National: 1
  - County: 2

### Users: 75 total
- **Nigeria**: 30 users
- **International**: 21 users
- **UK**: 9 users
- **Kenya**: 12 users
- **Standalone**: 3 users

**Role Distribution**:
- Super Admin: 2
- Admin: 12
- Sub-admin: 16
- User: 45

### Activities: 113 total
- **Nigeria**: 47 activities
- **International**: 35 activities
- **UK**: 13 activities
- **Kenya**: 14 activities
- **Standalone**: 4 activities

**Status Distribution**:
- Approved: 48
- Submitted: 40
- Draft: 18
- Completed: 7

**Type Distribution**:
- Outreach: 20
- Campaign: 16
- Workshop: 12
- Training: 13
- Meeting: 12
- Other: 28
- Policy Review: 6

## Files Structure

1. **organisations.csv** - All organizations with hierarchical relationships
2. **users.csv** - All users with role assignments and organization links
3. **activities.csv** - All activities with organization and user assignments

## Import Order

**Critical**: Import in this exact order to maintain referential integrity:

1. **organisations.csv** (no dependencies)
2. **users.csv** (depends on organisations)
3. **activities.csv** (depends on organisations and users)

## Data Validation

Before importing, ensure:
- All `parent_id` values reference existing organization IDs
- All `organisation_id` values in users.csv reference existing organizations
- All `organisation_id` and `assigned_user_id` values in activities.csv reference existing records
- Email addresses are unique across all users
- Date formats are correct (YYYY-MM-DD)

## Customization

You can modify these templates to:
- Add more organizations to any network
- Create additional users with different roles
- Generate more activities for specific users or organizations
- Adjust dates to reflect current/future timeframes
- Change locations to match your target regions
- Add edge cases specific to your use case

## Future Enhancements

Consider adding templates for:
- Activity evidence/attachments
- Activity tags
- Report templates
- Announcements (platform, federal, state, LGA)
- Messages/notifications
- Subscription data
- User roles and permissions audit trail

## Notes

- **IDs**: Use descriptive prefixes (e.g., `org_gov_fed_01`, `user_001`) for easy reference
- **Realistic Data**: All data is fictional but designed to be realistic and contextually appropriate
- **Relationships**: The templates maintain proper hierarchical and relational integrity
- **Variety**: Activities vary in type, status, complexity, and distribution to showcase different features
- **Geographic Accuracy**: Locations are realistic but may not reflect actual administrative boundaries

## Usage in Development Workflow

1. **Initial Setup**: Import all three files to populate the database
2. **Feature Development**: Use specific organizations/users for testing new features
3. **Integration Testing**: Test cross-organizational features using the full dataset
4. **Performance Testing**: Use the complete dataset to test system performance
5. **Demo Preparation**: Customize dates and add organization-specific activities for demos

## Support

For questions or issues with these templates, refer to:
- Main project README
- Data model specifications in `.specify/specs/`
- API documentation

---

**Last Updated**: 2025-01-19
**Version**: 2.0 (Expanded with international and national-level organizations)

