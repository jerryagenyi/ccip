# CCIP Project Structure

## 📁 Complete Directory Structure

```
ccip/
├── 📁 Documentation Hub
│   ├── README.md                     # 📖 Project overview and quick start
│   └── .cursor/rules/                # 🤖 Cursor IDE rules
│       └── AI_ASSISTANT_PROMPT.md    # AI assistant guide
│   ├── FIGMA_MAKE_DESIGN_PROMPT.md   # 🎨 Complete UI/UX design requirements
│   ├── PROJECT_STRUCTURE.md          # 📋 This file - complete project overview
│   └── docs/                         # 📚 Comprehensive documentation
│       ├── README.md                 # Navigation guide
│       ├── QUICK_START.md            # 15-minute setup guide
│       ├── DEVELOPER_SETUP.md        # Complete development environment
│       ├── DOCKER_PRACTICES.md       # Volume management best practices
│       └── CONTRIBUTING.md           # Code standards and workflow
│
├── 📁 Project Management
│   └── project-management/           # 📋 Business and technical planning
│       ├── PRD.md                    # Product Requirements Document
│       ├── technical-specification.md # Technology stack and architecture
│       └── architectural-roadmap.md  # Phase 1 MVP + Phase 2 expansion
│
├── 📁 SpecKit-Driven Development
│   ├── IMPLEMENTATION_PLAN.md        # 🗓️ Phase-based implementation timeline
│   ├── memory/                       # 🧠 Project principles
│   │   └── constitution.md           # Core project constraints and values
│   ├── templates/                    # 📋 SpecKit templates
│   │   ├── spec-template.md          # Feature specification template
│   │   ├── plan-template.md          # Implementation plan template
│   │   ├── tasks-template.md         # Task breakdown template
│   │   └── data-model-template.md    # Database schema template
│   └── specs/                        # 📋 Feature specifications (SpecKit format)
│       ├── README.md                 # Epic overview
│       ├── 001-user-organisation-management/
│       │   ├── spec.md               # Feature specification and user stories
│       │   ├── plan.md               # 8-phase implementation plan
│       │   ├── tasks.md              # 70+ detailed tasks
│       │   ├── data-model.md         # Database schema and relationships
│       │   ├── research.md           # Research and best practices
│       │   ├── quickstart.md         # Development quick start
│       │   └── contracts/            # API contracts (OpenAPI format)
│       ├── 002-activity-tracking/
│       ├── 003-dashboards-analytics/
│       ├── 004-communication/
│       └── 005-documentation/
│
├── 📁 Application Code
│   ├── backend/                      # 🔧 Laravel API
│   │   ├── Dockerfile                # Backend container definition
│   │   └── README.md                 # Backend-specific documentation
│   ├── frontend/                     # 🎨 Vue 3 + Quasar PWA (initialized)
│   │   ├── Dockerfile                # Frontend container definition
│   │   ├── src/                      # Vue source code
│   │   │   ├── stores/               # 12 Pinia stores ready
│   │   │   ├── pages/                # 20+ pages created
│   │   │   ├── router/               # Complete routing setup
│   │   │   └── services/             # API integration layer
│   │   └── package.json              # Dependencies configured
│   └── docker-compose.yml            # 🐳 Infrastructure configuration
│
└── 📁 Configuration
    ├── .gitignore                    # 🚫 Files excluded from version control
```

## 🎯 SpecKit Workflow

CCIP follows strict **SpecKit-driven development**:

### 1️⃣ **Read Spec** → `specs/XXX-feature-name/spec.md`
- User stories and acceptance criteria
- Business requirements for public health context
- Technical constraints and considerations

### 2️⃣ **Read Plan** → `specs/XXX-feature-name/plan.md`
- 8-phase implementation approach
- Dependencies and prerequisites
- Timeline and resource estimates

### 3️⃣ **Read Tasks** → `specs/XXX-feature-name/tasks.md`
- Detailed task breakdown by user story
- File-by-file implementation guide
- Testing and documentation requirements

### 4️⃣ **Implement** → Following task order
- Backend API endpoints
- Frontend components
- Database migrations
- Tests and documentation

### 5️⃣ **Document** → Update all relevant docs
- Inline code comments
- API documentation
- User guides

## 📊 Project Statistics

### Documentation Coverage
- **Total Markdown Files**: 55+
- **SpecKit Documents**: 30 (5 epics × 6 documents each)
- **Technical Documentation**: 15+ comprehensive guides
- **Epic Coverage**: 100% (all 5 MVP epics fully specified)

### Implementation Scope
- **Total Tasks**: 225+ across all epics
- **Estimated Hours**: ~325 hours
- **Timeline**: 8-9 weeks (5 days/week, 8 hours/day)

### Feature Completeness
- ✅ **Epic 001**: User & Organisation Management (Foundation)
- ✅ **Epic 002**: Activity Tracking & Reporting (Core)
- ✅ **Epic 003**: Dashboards & Analytics (Insights)
- ✅ **Epic 004**: Communication System (Collaboration)
- ✅ **Epic 005**: Documentation & Help (Usability)

## 🚀 Getting Started

### For New Developers
1. **Start Here**: `README.md` → 15-minute quick start
2. **Deep Dive**: `docs/DEVELOPER_SETUP.md` → Complete environment setup
3. **Understand**: `docs/DOCKER_PRACTICES.md` → Volume management
4. **Learn Flow**: `docs/CONTRIBUTING.md` → Development workflow

### For Product Managers
1. **Product Vision**: `project-management/PRD.md`
2. **Technical Context**: `project-management/technical-specification.md`
3. **Implementation Plan**: `IMPLEMENTATION_PLAN.md`
4. **Progress Tracking**: Review individual epic statuses in `specs/`

### For DevOps Engineers
1. **Infrastructure**: `docker-compose.yml`
2. **Deployment**: `docs/DEPLOYMENT.md` (when created)
3. **Best Practices**: `docs/DOCKER_PRACTICES.md`
4. **Production Setup**: `docs/DEPLOYMENT.md` → Production configuration

## 🔍 Key Architectural Decisions

### SpecKit Integration
- **Why**: Ensures traceability from requirements to code
- **How**: Epic → Spec → Plan → Tasks → Implementation
- **Result**: Every feature has complete documentation before coding

### Docker Volume Strategy
- **Runtime Data**: Docker-managed volumes (not in Git)
- **Source Code**: Git-tracked with mount points
- **Team Consistency**: Seeders provide consistent test data
- **Production**: Backup strategies for critical data

### Public Health Context
- **Domain-Specific**: All examples and terminology reflect health communication
- **Low-Bandwidth**: Progressive Web App with offline capabilities
- **Multi-Level**: Federal → State → Local organizational hierarchies
- **Evidence-Based**: Activity tracking with file uploads and audit trails

## 📝 Maintenance Guidelines

### Documentation Updates
1. **Update docs BEFORE code changes**
2. **Include documentation in pull request reviews**
3. **Monthly documentation reviews**
4. **Version-controlled with application code**

### Adding New Features
1. **Create SpecKit spec** first
2. **Generate plan and tasks**
3. **Review with team**
4. **Implement following task order**
5. **Update all relevant documentation**

### Code Quality Standards
- **Backend**: PSR-12, PHPDoc blocks, Laravel best practices
- **Frontend**: Vue 3 Composition API, TypeScript support, Quasar patterns
- **Testing**: Feature tests, component tests, E2E coverage
- **Security**: Role-based permissions, input validation, audit trails

---

## 🎯 Quick Reference

| Need | Go To |
|------|-------|
| **Get Running in 15 Min** | `README.md` |
| **Complete Setup Guide** | `docs/DEVELOPER_SETUP.md` |
| **Understand Docker Volumes** | `docs/DOCKER_PRACTICES.md` |
| **Implement Feature** | `specs/XXX-feature-name/` |
| **Code Standards** | `docs/CONTRIBUTING.md` |
| **Product Context** | `project-management/PRD.md` |
| **AI Assistant Guide** | `.cursor/rules/AI_ASSISTANT_PROMPT.md` |

---

**Built for public health professionals, using SpecKit for transparent, traceable development.** 🏥💙