# RCAP Specifications

This directory contains all feature specifications following **SpecKit-driven development** methodology.

## SpecKit Structure

Each feature follows the SpecKit structure:

```
specs/
└── XXX-feature-name/
    ├── spec.md              # Feature specification with user stories
    ├── plan.md              # Implementation plan (generated via /speckit.plan)
    ├── tasks.md              # Task breakdown (generated via /speckit.tasks)
    ├── data-model.md         # Database schema and relationships
    ├── research.md           # Research notes and findings
    ├── quickstart.md         # Quick reference guide
    └── contracts/            # API contracts and interfaces
        ├── api-spec.json     # OpenAPI/Swagger specification
        └── signalr-spec.md   # Real-time contracts (if applicable)
```

## Current Epics

### 001-user-organisation-management ✅
**Status**: SpecKit Format Complete  
**Priority**: High  
**Description**: Multi-tier role-based user and organisation management with hierarchical permissions.  
**Files**: spec.md, data-model.md, research.md, quickstart.md

### 002-activity-tracking ✅
**Status**: SpecKit Format Complete  
**Priority**: High  
**Description**: Activity tracking and reporting with evidence uploads and templates.  
**Files**: spec.md, data-model.md, research.md, quickstart.md

### 003-dashboards-analytics ✅
**Status**: SpecKit Format Complete  
**Priority**: High  
**Description**: Role-based dashboards with analytics and export functionality.  
**Files**: spec.md, data-model.md, research.md, quickstart.md

### 004-communication ✅
**Status**: SpecKit Format Complete  
**Priority**: Medium  
**Description**: Internal messaging and notification system.  
**Files**: spec.md, data-model.md, research.md, quickstart.md

### 005-documentation ✅
**Status**: SpecKit Format Complete  
**Priority**: Medium  
**Description**: API documentation, user guides, and help system.  
**Files**: spec.md, data-model.md, research.md, quickstart.md

### 006-pricing-subscription ✅
**Status**: SpecKit Format Complete  
**Priority**: Medium  
**Description**: Pricing tiers, subscription management, and feature gating.  
**Files**: spec.md

## Workflow

### 1. Epic Creation
- Create feature directory: `specs/XXX-feature-name/`
- Use template: `templates/spec-template.md`
- Or run: `./scripts/create-new-feature.sh feature-name`

### 2. Specification
- Write `spec.md` with user stories and technical requirements
- Define database schema in `data-model.md`
- Document research in `research.md`

### 3. Planning
- Generate plan: Use `/speckit.plan` command or manually create `plan.md`
- Define implementation phases
- Specify architecture decisions

### 4. Task Breakdown
- Generate tasks: Use `/speckit.tasks` command or manually create `tasks.md`
- Organize by user story
- Define dependencies and parallel execution

### 5. Implementation
- Execute: Use `/speckit.implement` command or follow `tasks.md`
- Follow task order respecting dependencies
- Update documentation as you go

## SpecKit Commands

If SpecKit CLI is installed, use these commands:

```bash
# Generate implementation plan from spec
/speckit.plan

# Generate task breakdown from plan
/speckit.tasks

# Execute implementation tasks
/speckit.implement
```

## Templates

Templates are available in `templates/`:
- `spec-template.md` - Feature specification template
- `plan-template.md` - Implementation plan template
- `tasks-template.md` - Task breakdown template
- `data-model-template.md` - Data model template

## Constitution

All specifications must adhere to the project constitution:
- See `memory/constitution.md` for principles and constraints
- MVP scope: Only 5 epics defined
- No mapping, social media, or AI/ML features in MVP

## Status Legend

- **Planning**: Specification and planning phase
- **In Progress**: Implementation started
- **Review**: Code review and testing
- **Complete**: Feature fully implemented and tested

## Related Documentation

- [Constitution](../memory/constitution.md) - Project principles
- [Technical Specification](../project-management/technical-specification.md) - Tech stack
- [Implementation Plan](../IMPLEMENTATION_PLAN.md) - Overall project plan
- [AI Assistant Guide](../.cursor/rules/AI_ASSISTANT_PROMPT.md) - AI assistant guidance
