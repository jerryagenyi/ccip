# Data Model: User & Organisation Management

## Overview
Database schema and data relationships for user authentication, role-based access control, and organisational hierarchy.

## Entity Relationship Diagram

```
[users] --< belongs to >-- [organisations]
[users] --< has many >-- [user_roles] --< belongs to >-- [roles]
[organisations] --< parent >-- [organisations] (self-referential)
```

## Tables

### users
**Purpose**: Stores user account information and authentication data

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| email | varchar(255) | UNIQUE, NOT NULL | User email (login) |
| password | varchar(255) | NOT NULL | Hashed password (bcrypt) |
| name | varchar(255) | NOT NULL | User full name |
| role | enum | NOT NULL, DEFAULT 'user' | Role: super_admin, admin, sub_admin, user |
| organisation_id | bigint | FOREIGN KEY, NULLABLE | Organisation user belongs to |
| email_verified_at | timestamp | NULLABLE | Email verification timestamp |
| profile_picture | varchar(255) | NULLABLE | Profile picture file path |
| remember_token | varchar(100) | NULLABLE | Remember me token |
| created_at | timestamp | NULLABLE | Account creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_users_email` on `email` (unique)
- `idx_users_organisation_id` on `organisation_id`
- `idx_users_role` on `role`

**Foreign Keys:**
- `fk_users_organisation_id` references `organisations(id)` ON DELETE SET NULL

### organisations
**Purpose**: Stores organisational hierarchy structure

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| name | varchar(255) | NOT NULL | Organisation name |
| parent_id | bigint | FOREIGN KEY, NULLABLE | Parent organisation ID |
| category | enum | NOT NULL | Category: government, nonprofit, civil_service |
| type | enum | NULLABLE | Hierarchy level: federal, state, local (required for government, optional for others) |
| description | text | NULLABLE | Organisation description |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_organisations_parent_id` on `parent_id`
- `idx_organisations_category` on `category`
- `idx_organisations_type` on `type`

**Foreign Keys:**
- `fk_organisations_parent_id` references `organisations(id)` ON DELETE CASCADE

### roles
**Purpose**: Defines available roles and their permissions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| name | varchar(255) | UNIQUE, NOT NULL | Role name |
| permissions | json | NOT NULL | JSON array of permissions |
| description | text | NULLABLE | Role description |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_roles_name` on `name` (unique)

### user_roles
**Purpose**: Pivot table for user-role assignments (for audit trail)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| user_id | bigint | FOREIGN KEY, NOT NULL | User ID |
| role_id | bigint | FOREIGN KEY, NOT NULL | Role ID |
| assigned_by | bigint | FOREIGN KEY, NULLABLE | Admin who assigned role |
| assigned_at | timestamp | NOT NULL, DEFAULT NOW() | Assignment timestamp |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_user_roles_user_id` on `user_id`
- `idx_user_roles_role_id` on `role_id`
- `idx_user_roles_assigned_by` on `assigned_by`

**Foreign Keys:**
- `fk_user_roles_user_id` references `users(id)` ON DELETE CASCADE
- `fk_user_roles_role_id` references `roles(id)` ON DELETE CASCADE
- `fk_user_roles_assigned_by` references `users(id)` ON DELETE SET NULL

## Relationships

### One-to-Many
- `organisations` has many `users` (users belong to organisation)
- `organisations` has many `organisations` (parent-child hierarchy)
- `users` has many `user_roles` (for audit trail)
- `roles` has many `user_roles`

### Many-to-Many
- `users` belongs to many `roles` (via `user_roles` pivot table)

## Data Validation Rules
- Email must be unique across all users
- Password must be at least 8 characters
- Organisation parent_id cannot reference itself (prevent circular references)
- Organisation `type` (hierarchy level) must match hierarchy when set (federal > state > local)
- Organisation `type` is required when `category` is 'government'
- Organisation `type` is optional when `category` is 'nonprofit' or 'civil_service'
- Cross-category hierarchies are allowed (e.g., nonprofit can be child of government organisation when collaborating)
- Role assignment can only be done by higher-level admins

## Migration Strategy
1. Create `organisations` table first (no dependencies)
2. Create `roles` table (no dependencies)
3. Create `users` table (depends on organisations)
4. Create `user_roles` pivot table (depends on users and roles)

## Seed Data
- Initial Super Admin user
- Default roles: super_admin, admin, sub_admin, user
- Sample government organisations:
  - Federal organisation (category: government, type: federal)
  - State organisations (category: government, type: state, children of federal)
  - Local organisations (category: government, type: local, children of state)
- Sample nonprofit organisations:
  - National nonprofit (category: nonprofit, type: federal)
  - Regional nonprofit (category: nonprofit, type: state)
  - Local CSO (category: nonprofit, type: local)
- Sample civil service organisations:
  - Federal civil service department (category: civil_service, type: federal)
  - State civil service office (category: civil_service, type: state)

