# RCAP Constitution

This document defines the foundational principles, constraints, and guidelines that govern all development decisions for RCAP (Risk Communication Activity Platform).

## Project Mission

RCAP is a purpose-built platform for tracking, reporting, and analyzing public health risk communication activities. It serves federal, state, and local health officials in coordinating verifiable communications, optimized for low-bandwidth African and global contexts.

## Core Principles

### 1. MVP Discipline
- **Strict Scope Control**: Only implement features defined in the 5 MVP epics
- **No Feature Creep**: Mapping, social media monitoring, and AI/ML infodemiology are **FUTURE EXPANSION ONLY**
- **Document, Don't Build**: Future features must be documented in roadmap, never coded during MVP

### 2. SpecKit-Driven Development
- **Epic → Spec → Plan → Tasks → Implementation**: All features follow this workflow
- **Artifact-Driven**: Every feature must have spec.md, plan.md, and tasks.md
- **Traceability**: Code must be traceable back to user stories and specifications

### 3. Public Health Domain Focus
- **Context-Aware**: All business logic reflects public health risk communication contexts
- **Terminology**: Use domain-appropriate language (activities, evidence, organisations, not generic terms)
- **User-Centric**: Features serve public health officials, not generic users

### 4. Low-Bandwidth First
- **Performance Priority**: Every implementation decision must consider connectivity constraints
- **Optimization**: Image compression, lazy loading, code splitting, PWA capabilities
- **Progressive Enhancement**: Core functionality works offline, enhanced features require connectivity

### 5. Role-Based Security
- **Hierarchical Permissions**: Super Admin → Admin → Sub-admin → User
- **Enforcement**: Permissions enforced at both API and UI levels
- **Audit Trail**: All sensitive operations logged with user and timestamp

## Technology Constraints

### Required Stack
- **Frontend**: Vue 3 + Quasar + Pinia (PWA-optimized)
- **Backend**: Laravel 10+ with PHP 8.2+
- **Database**: PostgreSQL 15+
- **Storage**: S3-compatible (MinIO dev, AWS S3 prod)
- **Infrastructure**: Docker Compose

### Forbidden Technologies
- **No Mapping Libraries**: No GIS, geospatial, or mapping features in MVP
- **No Social Media APIs**: No Twitter/X, Facebook, WhatsApp integrations in MVP
- **No AI/ML Pipelines**: No sentiment analysis, NLP, or ML models in MVP
- **No Heavy Libraries**: Avoid bandwidth-heavy dependencies

## Development Standards

### Code Quality
- **PSR-12**: Laravel code follows PSR-12 standards
- **Composition API**: Vue components use Composition API primarily
- **Type Safety**: TypeScript optional but recommended for frontend
- **Documentation**: All business logic must have inline comments explaining public health context

### Testing Requirements
- **Backend**: Feature tests for all API endpoints
- **Frontend**: Component tests for critical user flows
- **Integration**: API integration tests
- **Security**: Authentication and authorization tests

### Security Requirements
- **Authentication**: Laravel Sanctum for JWT tokens
- **Authorization**: Role-based middleware on all sensitive endpoints
- **Input Validation**: Form requests for all user input
- **File Uploads**: Size limits, type validation, virus scanning
- **SQL Injection**: Use Eloquent ORM, never raw queries

## Workflow Requirements

### Before Implementation
1. Read the relevant Epic spec in `/specs/epic-XXX-*/spec.md`
2. Review the implementation plan in `plan.md`
3. Check task breakdown in `tasks.md`
4. Reference this constitution for constraints

### During Implementation
1. Follow Laravel/Vue best practices
2. Add inline comments explaining business logic
3. Implement role-based permissions
4. Optimize for low-bandwidth scenarios
5. Write tests alongside code

### After Implementation
1. Update relevant SpecKit documents if scope changes
2. Update API documentation
3. Update user guides if UI changes
4. Run full test suite
5. Update IMPLEMENTATION_PLAN.md status

## Documentation Standards

### SpecKit Format
- **spec.md**: Feature specification with user stories
- **plan.md**: Implementation plan with technical details
- **tasks.md**: Task breakdown with dependencies
- **data-model.md**: Database schema and relationships
- **contracts/**: API contracts and interfaces

### Code Documentation
- **PHPDoc**: All Laravel methods must have PHPDoc blocks
- **JSDoc**: Vue components should have JSDoc for business logic
- **Inline Comments**: Explain "why" not "what", especially for public health context

## Decision-Making Framework

When facing a decision:
1. **Check Constitution**: Does it violate any core principles?
2. **Check MVP Scope**: Is it within the 5 epics?
3. **Check SpecKit**: Is there a spec/plan/task for it?
4. **Check Bandwidth**: Does it work in low-bandwidth scenarios?
5. **Check Security**: Does it enforce role-based permissions?

If any check fails, the decision must be:
- **Rejected** if it violates constitution
- **Documented** in roadmap if it's future expansion
- **Specified** in SpecKit if it's a new feature

## Change Management

### Constitution Changes
- Constitution changes require explicit approval
- Document rationale for any changes
- Update all affected specifications

### Scope Changes
- MVP scope changes must be documented in roadmap
- Future expansion features go in Phase 2 documentation
- Never implement future features during MVP

## Success Criteria

RCAP MVP is successful when:
- All 5 epics implemented and tested
- All services running in Docker
- API documentation complete
- User documentation complete
- Security audit passed
- Performance benchmarks met for low-bandwidth scenarios
- All code traceable to SpecKit artifacts

---

**Remember**: Every line of code serves public health officials tracking risk communication activities in bandwidth-constrained environments. Stay focused, stay disciplined, stay within scope.

