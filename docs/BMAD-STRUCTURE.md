# BMAD Method Project Structure

This document describes the BMAD Method project structure for CCIP.

## Directory Structure

```
docs/
├── prd.md                          # Product Requirements Document
├── architecture.md                 # Architecture Decision Document (workflow output)
├── architecture/                   # Detailed architecture documentation
│   ├── overview.md
│   ├── backend.md
│   ├── frontend.md
│   └── roadmap.md
├── ux-design.md                   # UI/UX Design Specification
├── epics/                         # Epic specifications
│   ├── epic-001-user-organisation-management.md
│   ├── epic-002-activity-tracking.md
│   └── ...
├── stories/                       # User stories
│   ├── US-001-user-registration-authentication.md
│   ├── US-002-role-based-access-control.md
│   └── ...
├── research/                      # Research documents
│   ├── MACHINE_LEARNING_ARCHITECTURAL_FOUNDATION.md
│   └── PERPLEXITY_RESEARCH_REPORT.md
├── sprint-artifacts/              # Sprint planning and status
├── api/                           # API documentation
├── getting-started/               # Getting started guides
├── archived/                      # Archived documents
│   ├── speckit/                  # Archived SpecKit specifications
│   └── ...                       # Other archived docs
├── index.md                       # Documentation index
├── README.md                      # Main technical documentation
├── project_context.md             # AI agent rules and patterns
└── bmm-workflow-status.yaml      # BMAD workflow tracking
```

## BMAD Method Workflow Documents

### Phase 1: Planning
- `prd.md` - Product Requirements Document
- `ux-design.md` - UI/UX Design Specification

### Phase 2: Solutioning
- `architecture.md` - Architecture Decision Document (from workflow)
- `architecture/` - Detailed architecture documentation
- `epics/` - Epic specifications
- `stories/` - User stories

### Phase 3: Implementation
- `sprint-artifacts/` - Sprint planning and status
- Implementation readiness reports

## Research & Reference
- `research/` - Research documents and findings
- `api/` - API documentation
- `getting-started/` - Setup and getting started guides

## Status Tracking
- `bmm-workflow-status.yaml` - Tracks progress through BMAD Method phases

