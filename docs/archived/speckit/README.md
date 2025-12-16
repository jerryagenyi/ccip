# SpecKit Archive

This directory contains archived SpecKit specifications and the entire `.specify` folder that were migrated to BMAD Method format.

## Migration Date
2025-12-14

## Archive Date
2025-01-16

## Migration Details
- Original location: `.specify/specs/` (root directory)
- New location: `docs/epics/` and `docs/stories/`
- Format: Converted from SpecKit format to BMAD Method format

## Why This Was Archived
The entire `.specify` folder was moved here because:
1. All specifications have been migrated to BMAD Method format (epics and stories)
2. The specs were already archived in `docs/archived/speckit/specs/`
3. The original `.specify` folder in the root directory was redundant and could cause confusion
4. Keeping the complete `.specify` folder (including templates and memory) provides historical reference

## Archived Contents

### Specs Directory (`specs/`)
- 001-user-organisation-management/
- 002-activity-tracking/
- 003-dashboards-analytics/
- 004-communication/
- 005-documentation/
- 006-pricing-subscription/
- 007-semiotic-risk-assessment/
- 008-pattern-database/

### Complete `.specify` Folder
The entire `.specify` folder from the root directory has been moved here and contains:
- `specs/` - All feature specifications (duplicate of the `specs/` directory above)
- `templates/` - SpecKit templates (spec-template.md, plan-template.md, tasks-template.md, data-model-template.md)
- `memory/constitution.md` - Project constitution and principles

## Current Status
All epics and stories have been converted to BMAD Method format and are available in:
- `docs/epics/epic-XXX-feature-name.md`
- `docs/stories/US-XXX-story-name.md`

## Note
This archive is kept for reference during the transition period. It can be deleted once confidence is established that all information has been successfully migrated to BMAD format.
