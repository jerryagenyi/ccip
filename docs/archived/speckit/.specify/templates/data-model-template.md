# Data Model: [Feature Name]

## Overview
Database schema and data relationships for [Feature Name].

## Entity Relationship Diagram

```
[Entity1] --< [Relationship] >-- [Entity2]
```

## Tables

### table_name
**Purpose**: Description of what this table stores

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| field1 | varchar(255) | NOT NULL | Description |
| field2 | text | NULLABLE | Description |
| created_at | timestamp | NULLABLE | Timestamp |
| updated_at | timestamp | NULLABLE | Timestamp |

**Indexes:**
- `idx_field1` on `field1`
- `idx_created_at` on `created_at`

**Foreign Keys:**
- `fk_entity_id` references `entities(id)`

## Relationships

### One-to-Many
- `Entity1` has many `Entity2`
- `Entity2` belongs to `Entity1`

### Many-to-Many
- `Entity1` belongs to many `Entity2` (via pivot table)

## Data Validation Rules
- Field validation rules
- Business logic constraints
- Referential integrity rules

## Migration Strategy
- Order of migrations
- Data migration requirements
- Rollback strategy

