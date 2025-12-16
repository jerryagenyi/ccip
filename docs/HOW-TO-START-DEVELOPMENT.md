# How to Start Development with BMAD Method

## Quick Answer: Are We Ready?

**✅ YES, we are ready for development!**

All required BMAD Method workflows are complete:
- ✅ PRD
- ✅ Architecture  
- ✅ Epics & Stories (35 stories)
- ✅ UX Design
- ✅ Implementation Readiness (passed)
- ✅ Sprint Planning (complete)

## How to Use the Dev Workflow

### What is `*dev-story`?

`*dev-story` is a BMAD workflow command that activates the Developer agent to implement a user story. It's not something you type literally - it's a reference to the workflow.

### How to Start Development in Cursor:

**Option 1: Reference the Workflow Directly**
```
@bmad/bmm/workflows/dev-story
```

**Option 2: Activate Dev Agent**
```
Start the bmad agent for dev
```
Then select the dev-story workflow from the menu.

**Option 3: Specify a Story Directly**
```
Develop docs/stories/US-001-user-registration-authentication.md
```

### What Happens When You Run Dev Workflow:

1. **Story Discovery:**
   - Reads `docs/sprint-artifacts/sprint-status.yaml`
   - Finds first story with status `ready-for-dev`
   - If none found, asks you to choose

2. **Story Implementation:**
   - Reads the complete story file
   - Implements according to acceptance criteria
   - Creates/updates code files
   - Writes tests
   - Updates story file with progress

3. **Completion:**
   - Moves story to `review` status
   - Runs code review workflow
   - Marks `done` when approved

## Before Starting Development

### Step 1: Move First Story to `ready-for-dev`

Currently all stories are `drafted`. Before development can start, you need to move at least one story to `ready-for-dev`.

**Edit `docs/sprint-artifacts/sprint-status.yaml`:**
```yaml
development_status:
  epic-001: backlog
  US-001-user-registration-authentication: ready-for-dev  # Changed from "drafted"
```

### Step 2: Start Dev Workflow

Then run the dev workflow (Option 1, 2, or 3 above).

## Story Status Flow

```
backlog → drafted → ready-for-dev → in-progress → review → done
```

**Current State:** All 35 stories are `drafted` (story files exist).  
**Next Step:** Move first story to `ready-for-dev`, then start dev workflow.

## Recommended First Story

Start with **US-001: User Registration & Authentication** because:
- It's the foundation for all other features
- No dependencies
- Well-defined acceptance criteria
- Epic 001 must be completed before other epics

## Workflow Commands Reference

- **Dev Agent:** `*dev-story` - Implements a user story
- **Scrum Master:** `*create-story` - Creates new story from epic
- **Dev Agent:** `*code-review` - Reviews completed code
- **Scrum Master:** `*sprint-status` - Check current sprint progress

---

**Ready to start?** Move US-001 to `ready-for-dev` in sprint-status.yaml, then run the dev workflow!
