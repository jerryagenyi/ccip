# BMAD Quick Reference Guide

## Table of Contents

- [What is BMAD?](#what-is-bmad)
- [🔥 IMPORTANT: How to Use BMAD Commands](#-important-how-to-use-bmad-commands)
- [When to Use BMAD](#when-to-use-bmad)
  - [1. Starting a New Project](#1-starting-a-new-project)
  - [2. Architecture & Technical Planning](#2-architecture--technical-planning)
  - [3. Writing Code & Implementation](#3-writing-code--implementation)
  - [4. Code Quality & Review](#4-code-quality--review)
  - [5. Documentation](#5-documentation)
  - [6. Team Collaboration](#6-team-collaboration)
- [Common Task Patterns](#common-task-patterns)
  - [New Feature Development](#new-feature-development)
  - [Bug Fix](#bug-fix)
  - [Project Documentation](#project-documentation)
- [Quick Agent Access](#quick-agent-access)
  - [Claude Code Users:](#claude-code-users)
  - [Other Platforms:](#other-platforms)
- [Pro Tips](#pro-tips)
- [BMAD's Native Workflow (Without `.specify/`)](#bmads-native-workflow-without-specify)
  - [When You DON'T Have `.specify/` Specs](#when-you-dont-have-specify-specs)
  - [Example: Building Login Without `.specify/`](#example-building-login-without-specify)
  - [BMAD Tech Spec Structure](#bmad-tech-spec-structure)
  - [Key Differences](#key-differences)
- [Working with Existing Specifications (Your `.specify/` Folder)](#working-with-existing-specifications-your-specify-folder)
  - [Your Specs are the Source of Truth](#your-specs-are-the-source-of-truth)
  - [How to Check Existing Features with BMAD](#how-to-check-existing-features-with-bmad)
  - [Example: Checking Login/Authentication Flow](#example-checking-loginauthentication-flow)
  - [Key Points](#key-points)
- [Getting Help](#getting-help)
- [Platform-Specific Notes](#platform-specific-notes)

---

## What is BMAD?
BMAD (Business Methodology for Agile Development) is a collection of specialized AI agents and workflows designed to streamline software development processes. Each agent has a specific role and expertise.

## 🔥 IMPORTANT: How to Use BMAD Commands

**The commands in this guide (like `*code-review`) are NOT terminal commands!**

### To use BMAD:

1. **First, activate an agent** using one of these methods:
   - **Claude Code**: Use slash commands like `/bmad:bmm:agents:dev`
   - **MCP-enabled IDE**: Use agent activation commands
   - **Other platforms**: Check your specific integration method

2. **Once an agent is active**, you'll see a numbered menu of options

3. **Then you can:**
   - Type the menu number (e.g., `1`)
   - Type the command with asterisk (e.g., `*code-review`)
   - Type fuzzy matches (e.g., `code rev` would match `*code-review`)

### Example Workflow:
```bash
# DON'T do this in terminal:
# *code-review  ❌ This won't work!

# INSTEAD, first activate an agent:
/bmad:bmm:agents:dev  # or however you activate agents in your platform

# THEN, once the agent is active and shows menu:
*code-review  # ✅ This works within the agent conversation!
```

## When to Use BMAD

### 1. Starting a New Project
**When:** You have an idea but need structure and planning
**Agent:** Business Analyst (Mary) or Product Manager (John)
**How:** `/bmad:bmm:agents:analyst` → then `*product-brief`
**Commands:**
- `*product-brief` - Create a product brief
- `*brainstorm-project` - Guided brainstorming session
- `*research` - Market/domain/competitive research

### 2. Architecture & Technical Planning
**When:** You need technical design and architecture decisions
**Agent:** Architect (Winston)
**How:** `/bmad:bmm:agents:architect` → then `*create-architecture`
**Commands:**
- `*create-architecture` - Design system architecture
- `*create-tech-spec` - Create detailed technical specifications

### 3. Writing Code & Implementation
**When:** You're ready to build features
**Agent:** Developer (Amelia) or Quick Flow Solo Dev (Barry)
**How:** `/bmad:bmm:agents:quick-flow-solo-dev` → then `*quick-dev`
**Commands:**
- `*quick-dev` - Implement tech spec end-to-end (Barry)
- `*dev-story` - Execute a specific story (Amelia)

### 4. Code Quality & Review
**When:** You need to ensure code quality and catch issues
**Agent:** Test Architect (Murat) or use Code Review workflow
**How:** `/bmad:bmm:agents:tea` → then `*code-review`
**Commands:**
- `*code-review` - Review and improve code
- Test-related commands with Murat for testing strategy

### 5. Documentation
**When:** You need to document your project
**Agent:** Technical Writer (Paige)
**How:** `/bmad:bmm:agents:tech-writer` → then `*document-project`
**Commands:**
- `*document-project` - Comprehensive project documentation
- `*standards-guide` - Show documentation standards
- `*improve-readme` - Review and improve README

### 6. Team Collaboration
**When:** You need multiple perspectives or team input
**Any Agent:** Use party mode
**How:** Activate any agent → then `*party-mode` or type "SPM"
**Commands:**
- `*party-mode` or "SPM" - Start Party Mode with multiple agents

## Common Task Patterns

### New Feature Development
1. Activate Business Analyst: `/bmad:bmm:agents:analyst`
2. Run: `*product-brief`
3. Activate Product Manager: `/bmad:bmm:agents:pm`
4. Refine requirements
5. Activate Architect: `/bmad:bmm:agents:architect`
6. Run: `*create-architecture`
7. Activate Developer: `/bmad:bmm:agents:quick-flow-solo-dev`
8. Run: `*quick-dev`
9. Run: `*code-review`
10. Activate Technical Writer: `/bmad:bmm:agents:tech-writer`
11. Run: `*document-project`

### Bug Fix
1. Activate Developer: `/bmad:bmm:agents:dev`
2. Fix the issue
3. Run: `*code-review`
4. Activate Test Architect: `/bmad:bmm:agents:tea`
5. Validate testing approach

### Project Documentation
1. Activate Quick Flow Solo Dev: `/bmad:bmm:agents:quick-flow-solo-dev`
2. Run: `*document-project` (for existing projects)
3. Or activate Technical Writer: `/bmad:bmm:agents:tech-writer`
4. Run: `*improve-readme` or specific documentation tasks

## Quick Agent Access

### Claude Code Users:
Use these slash commands:
- `/bmad:bmm:agents:pm` - Load Product Manager
- `/bmad:bmm:agents:architect` - Load Architect
- `/bmad:bmm:agents:dev` - Load Developer
- `/bmad:bmm:agents:quick-flow-solo-dev` - Load Barry for Quick Flow
- `/bmad:bmm:agents:tech-writer` - Load Technical Writer
- `/bmad:bmm:agents:analyst` - Load Business Analyst
- `/bmad:bmm:agents:tea` - Load Test Architect

### Other Platforms:
Check your specific documentation for agent activation commands.

## Pro Tips
1. **Always check if `project-context.md` exists** - Agents use this as their guide
2. **Use `*menu`** to see all available options for an agent
3. **Party Mode** is great for getting multiple perspectives quickly
4. **Quick Flow** (Barry) is perfect for solo developers who want to move fast
5. **Save intermediate results** - Workflows prompt to save after each step
6. **You can type numbers instead of commands** - When an agent shows a numbered menu, just type the number

## BMAD's Native Workflow (Without `.specify/`)

### When You DON'T Have `.specify/` Specs

BMAD has its own native workflow for generating and managing technical specifications:

#### Step 1: Create Technical Specification
```bash
# Activate Architect or Quick Flow Solo Dev
/bmad:bmm:agents:architect
# OR
/bmad:bmm:agents:quick-flow-solo-dev

# Use the create-tech-spec command
*create-tech-spec
```

**What BMAD does:**
- Asks what you want to build
- Investigates existing code patterns (if brownfield)
- Generates complete technical specification
- Saves to `docs/sprint-artifacts/tech-spec-{feature-name}.md`

#### Step 2: Develop the Feature
```bash
# Activate Developer or Quick Flow Solo Dev
/bmad:bmm:agents:dev
# OR
/bmad:bmm:agents:quick-flow-solo-dev

# Execute the tech spec
*quick-dev  # Using the tech spec file
```

#### Step 3: Code Review
```bash
*code-review
```

### Example: Building Login Without `.specify/`
```bash
/bmad:bmm:agents:architect

> Agent loaded. What would you like to do?
*create-tech-spec

> BMAD will ask:
"What feature would you like to build?"
Type: User authentication system with login and registration

> BMAD then:
- Analyzes your existing codebase
- Detects Laravel Sanctum patterns
- Creates tech spec with tasks and acceptance criteria
- Saves as: docs/sprint-artifacts/tech-spec-user-auth.md

/bmad:bmm:agents:quick-flow-solo-dev

> Agent loaded. What would you like to do?
*quick-dev

> When prompted for spec:
docs/sprint-artifacts/tech-spec-user-auth.md

> BMAD will:
- Read the tech spec
- Implement all tasks
- Follow acceptance criteria
- Complete the feature
```

### BMAD Tech Spec Structure
BMAD generates specs with:
- **Problem Statement** - What problem are we solving?
- **Solution Overview** - High-level approach
- **Code Context** - Existing patterns and conventions
- **Implementation Tasks** - Detailed task list
- **Acceptance Criteria** - Given/When/Then format
- **Dependencies** - What needs to be in place
- **Testing Strategy** - How to test the implementation

### Key Differences

| **With `.specify/`** | **Without `.specify/` (BMAD Native)** |
|---------------------|--------------------------------------|
| Your specs are source of truth | BMAD generates specs from conversation |
| Structured pre-planning | Conversational spec engineering |
| Detailed business requirements | Technical-focused specifications |
| Manual spec creation | AI-generated specs with code analysis |
| Perfect for large projects | Great for rapid development |

---

## Working with Existing Specifications (Your `.specify/` Folder)

**IMPORTANT:** BMAD does NOT replace your existing specs! It works WITH them.

### Your Specs are the Source of Truth
- Your `.specify/specs/` folder contains authoritative specifications
- BMAD agents **read and use** your existing specs as the primary source
- The Developer agent treats your specs as "The Story File is the single source of truth"

### How to Check Existing Features with BMAD

**To review an existing feature (e.g., Login/Auth):**
```bash
# 1. Activate the Developer agent
/bmad:bmm:agents:dev

# 2. Use the develop-story command
*develop-story

# 3. When prompted, provide your spec path:
.specify/specs/001-user-organisation-management/spec.md

# 4. BMAD will:
# - Read your spec's acceptance criteria
# - Check current implementation
# - Report what's implemented vs missing
# - Suggest fixes or improvements
```

**For Code Review of Existing Features:**
```bash
/bmad:bmm:agents:dev
*code-review
# Specify the feature and files when prompted
```

**For Test Coverage Review:**
```bash
/bmad:bmm:agents:tea  # Test Architect
# Ask to review specific feature's test strategy
```

**For Documentation:**
```bash
/bmad:bmm:agents:tech-writer
*document-project  # Scans and documents existing code
```

### Example: Checking Login/Authentication Flow
```bash
/bmad:bmm:agents:dev

> Agent loaded. What would you like to do?
Type: I want to check the login feature implementation

> Provide spec path:
.specify/specs/001-user-organisation-management/spec.md

> Agent will:
- Verify JWT authentication is implemented per your spec
- Check email verification flow
- Validate role-based permissions
- Test password reset functionality
- Report compliance with your acceptance criteria
```

### Key Points
- ✅ Your `.specify/` specs remain the authoritative source
- ✅ BMAD reads your specs to understand requirements
- ✅ BMAD checks implementation against your specs
- ✅ BMAD doesn't generate new specs (it uses yours)
- ✅ Perfect for validating existing features work correctly

## Getting Help
- Use `*menu` in any agent to see options
- Reference documentation standards with `*standards-guide`
- Use `*workflow-status` to check project state
- When in doubt, start with Business Analyst for requirements

## Platform-Specific Notes

### Claude Code:
- BMAD agents are available as slash commands
- Commands work after agent activation
- Use `*` prefix or menu numbers

### Other IDEs/Platforms:
- Check if BMAD is installed as an MCP server
- Look for agent activation commands in your documentation
- Commands may vary by platform integration