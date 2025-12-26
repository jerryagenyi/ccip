# BMAD Output Artifacts

This directory contains BMAD Method workflow artifacts organized according to v6.0.0-alpha.20 conventions.

## Directory Structure

### `planning-artifacts/`
Contains Phase 1-3 artifacts (Analysis, Planning, Solutioning):
- `prd.md` - Product Requirements Document
- `ux-design.md` - UI/UX Design Specification  
- `architecture.md` - Architecture Decision Document

**Git Strategy:** ✅ **COMMIT** - These are important project documents that should be version controlled.

### `implementation-artifacts/`
Contains Phase 4 artifacts (Implementation):
- `sprint-status.yaml` - Sprint planning and story tracking
- `bmm-workflow-status.yaml` - Workflow progress tracking
- `implementation-readiness-report-*.md` - Implementation readiness assessments

**Git Strategy:** ✅ **COMMIT** - These track project progress and should be version controlled.

## Git Strategy

**All files in `_bmad-output/` should be committed to git.**

These are project artifacts, not temporary files:
- Planning artifacts document project requirements and design decisions
- Implementation artifacts track development progress
- Both are essential for project continuity and team collaboration

**Note:** If BMAD workflows generate temporary cache files in the future, add specific patterns to `.gitignore` (e.g., `_bmad-output/**/*.cache`), but do not ignore the entire directory.

## Migration from v6.0.0-alpha.18

Files were migrated from `docs/` to `_bmad-output/` during the v6.0.0-alpha.20 upgrade:
- Planning artifacts moved from `docs/` → `_bmad-output/planning-artifacts/`
- Implementation artifacts moved from `docs/sprint-artifacts/` → `_bmad-output/implementation-artifacts/`
- Long-term knowledge (epics, stories, research) remains in `docs/`

