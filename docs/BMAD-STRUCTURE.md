# BMAD Method Project Structure

This document describes the BMAD Method project structure for CCIP.

**BMAD Method** (Breakthrough Method for Agile AI Driven Development) is a structured development methodology available at [github.com/bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD). It provides specialized AI agents working together through proven workflows to deliver exceptional development results.

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

BMAD Method follows a 4-phase methodology:

### Phase 1: Analysis (Optional)
- Research and exploration documents
- Brainstorming outputs
- Solution exploration

### Phase 2: Planning
- `prd.md` - Product Requirements Document (created via `@bmad/bmm/workflows/create-prd`)
- `ux-design.md` - UI/UX Design Specification (created via `@bmad/bmm/workflows/create-ux-design`)
- Tech specs and game design documents

### Phase 3: Solutioning
- `architecture.md` - Architecture Decision Document (created via `@bmad/bmm/workflows/create-architecture`)
- `architecture/` - Detailed architecture documentation
- `epics/` - Epic specifications (created via `@bmad/bmm/workflows/create-epics-stories`)
- `stories/` - User stories (created via `@bmad/bmm/workflows/create-story`)

### Phase 4: Implementation
- `sprint-artifacts/` - Sprint planning and status (via `@bmad/bmm/workflows/sprint-planning`)
- Implementation readiness reports (via `@bmad/bmm/workflows/check-implementation-readiness`)
- Story-driven development (via `@bmad/bmm/workflows/dev-story`)

## Research & Reference
- `research/` - Research documents and findings
- `api/` - API documentation
- `getting-started/` - Setup and getting started guides

## BMAD Method Agents

CCIP uses BMAD Method's specialized agents:

**Development Agents:**
- **Developer** (`@bmad/bmm/agents/dev`) - Implementation and coding
- **UX Designer** (`@bmad/bmm/agents/ux-designer`) - User experience design
- **Tech Writer** (`@bmad/bmm/agents/tech-writer`) - Technical documentation

**Architecture Agents:**
- **Architect** (`@bmad/bmm/agents/architect`) - System architecture
- **TEA (Test Engineering Agent)** (`@bmad/bmm/agents/tea`) - Testing and quality assurance

**Product Agents:**
- **PM (Product Manager)** (`@bmad/bmm/agents/pm`) - Product planning and requirements
- **Analyst** (`@bmad/bmm/agents/analyst`) - Business analysis

**Leadership Agents:**
- **Scrum Master** (`@bmad/bmm/agents/sm`) - Agile process management
- **BMad Master** (`@bmad/bmm/agents/bmad-master`) - Overall methodology coordination

## Status Tracking
- `bmm-workflow-status.yaml` - Tracks progress through BMAD Method phases
- `sprint-artifacts/sprint-status.yaml` - Current sprint status

## BMAD Method Resources

- **Official Repository**: [github.com/bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)
- **Documentation**: Available in `.cursor/rules/bmad/` directory
- **Workflows**: 50+ workflows covering all development scenarios
- **Version**: Using BMAD Method v6 (alpha) with scale-adaptive intelligence

