# CCIP - Crisis Communication Intelligence Platform

<div align="center">

**Crisis Communication Intelligence Platform**

Federal Ministry of Health - Nigeria

A purpose-built platform for tracking, reporting, and analyzing public health crisis communication activities, optimized for low-bandwidth contexts.

**Current Status**: MVP Development in Progress

[![Backend](https://img.shields.io/badge/Backend-40%25%20Complete-yellow.svg)]()
[![Frontend](https://img.shields.io/badge/Frontend-25%25%20Complete-orange.svg)]()
[![Vue 3](https://img.shields.io/badge/Vue-3-green.svg)](https://vuejs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-10-red.svg)](https://laravel.com/)

</div>

## 🚀 Current Status

**Overall Progress**: ~30% Complete - Active Development Phase

### Backend Status 🚧 40% Complete
- ✅ Laravel 10 API structure established
- ✅ Database migrations and models complete
- ✅ Authentication system with Laravel Sanctum (login, register, password reset)
- ✅ Activity CRUD operations with workflow (submit, approve, reject, complete)
- ✅ Controllers scaffolded for all major features
- ✅ Core services (AI, Notifications, Reports) implemented
- 🚧 Remaining: Full implementation of controllers, role-based access control, analytics, messaging

### Frontend Status 🚧 25% Complete
- ✅ Vue 3 + Quasar framework setup
- ✅ Authentication UI complete (login, register, password reset)
- ✅ Pinia stores configured for all features
- ✅ Router with guards implemented
- ✅ API service with interceptors
- ✅ Theme system with dark/light mode
- 🚧 Remaining: Activity management UI, dashboards, organisation management, messaging UI

### What's Implemented ✅
- ✅ **Authentication System** - Complete login, registration, and password reset flows
- ✅ **Database Schema** - All migrations and models with relationships
- ✅ **Activity Backend** - CRUD operations and workflow status management
- ✅ **File Upload Backend** - MinIO/S3 integration for file storage
- ✅ **AI Service** - OpenAI integration with graceful fallback
- ✅ **Frontend Foundation** - Component structure, routing, state management

### What's In Progress 🚧
- 🚧 **Role-Based Access Control** - Backend models ready, frontend implementation pending
- 🚧 **Organisation Management** - Backend controllers scaffolded, UI pending
- 🚧 **Activity Management UI** - Backend complete, frontend forms and workflows pending
- 🚧 **Dashboard & Analytics** - Backend structure ready, visualisation pending
- 🚧 **Messaging System** - Backend controllers ready, UI pending

### Windows Setup

**New to Windows?** See [WINDOWS_SETUP.md](./docs/WINDOWS_SETUP.md) for detailed Windows installation instructions.

**Quick Windows Install:**
```powershell
# Install Trivy (security scanner)
.\scripts\install-trivy-windows.ps1

# Or manually with Chocolatey (run as Administrator)
choco install trivy -y

# Or with Scoop
scoop install trivy
```

### Quick Start
```bash
# Clone the repository
git clone https://github.com/your-org/ccip.git
cd ccip

# Start with Docker
docker-compose up

# Or run components separately
# Backend
cd backend && composer install && php artisan serve

# Frontend
cd frontend && npm install && npm run dev
```

## 📋 What CCIP Does

CCIP helps public health officials:

- 🏥 **Track Activities**: Monitor risk communication campaigns and outreach
- 📊 **Generate Reports**: Create evidence-based reports for leadership
- 👥 **Manage Teams**: Organize hierarchical health departments
- 📱 **Work Offline**: Function in low-bandwidth environments
- 🔒 **Secure Data**: Role-based access to sensitive information

## 🏗️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Vue 3 + Quasar | Progressive Web App, low-bandwidth optimized |
| **Backend** | Laravel 10 | RESTful API, rapid development |
| **Database** | PostgreSQL 15 | Reliable relational data storage |
| **Storage** | MinIO (S3-compatible) | File uploads and media storage |
| **Infrastructure** | Docker Compose | Consistent development and deployment |

## 📁 Project Structure

```
ccip/
├── 📁 Documentation
│   ├── docs/                         # 🔧 Technical documentation
│   │   ├── api/                      # API specifications
│   │   ├── architecture/             # Architecture and design
│   │   ├── epics/                    # Epic specifications
│   │   └── stories/                 # User story specifications
│   ├── product/                      # 📋 Product documentation
│   │   ├── requirements/             # Product requirements
│   │   ├── strategy/                 # Strategic documents
│   │   └── research/                 # Research findings
│   └── innovator-founder-visa/       # 🎓 Visa application materials
├── 📁 Application Code
│   ├── backend/                      # 🔧 Laravel 10 API
│   │   ├── app/Http/Controllers/     # API controllers
│   │   ├── app/Services/             # Business logic services
│   │   └── database/migrations/      # Database schema
│   ├── frontend/                     # 🎨 Vue 3 + Quasar PWA
│   │   ├── src/pages/                # Route pages
│   │   ├── src/components/            # Reusable components
│   │   └── src/stores/               # Pinia state management
│   └── firebase-prototype/           # 🚀 Original prototype
├── 📁 Configuration
│   ├── docker-compose.yml            # 🐳 Development environment
│   ├── .env.example                  # 🔒 Environment template
│   └── .gitignore                    # 🚫 Git ignore rules
└── 📄 Project Files
    ├── README.md                     # 📖 This file
    └── CHANGELOG.md                  # 📝 Version history
```

## 📚 Documentation Navigation

### For Product Owners
- [Product Overview](./product/README.md) - Product requirements and strategy
- [Executive Summary](./product/strategy/executive_summary.md) - High-level overview
- [Theory of Change](./product/strategy/theory_of_change.md) - Strategic framework
- [Sprint Status](./_bmad-output/implementation-artifacts/sprint-status.yaml) - Current development progress

### For Developers
- [Technical Documentation](./docs/README.md) - Development guides
- [Backend README](./backend/README.md) - Backend implementation status
- [Frontend README](./frontend/README.md) - Frontend setup and structure
- [CLAUDE.md](./CLAUDE.md) - Development workflow and commands
- [Epic Specifications](./docs/epics/) - Feature specifications

### For Project Managers
- [Sprint Status](./_bmad-output/implementation-artifacts/sprint-status.yaml) - Current sprint progress
- [User Stories](./docs/stories/) - Detailed user story specifications

## 🎯 MVP Features

### ✅ Currently Implemented
- **Authentication System** - Complete login, registration, password reset
- **Database Schema** - Full data model with relationships
- **Activity Backend** - CRUD operations and workflow (draft → submit → approve/reject → complete)
- **File Upload Backend** - S3-compatible storage for evidence files
- **AI Service** - OpenAI integration with fallback handling
- **Frontend Foundation** - Routing, state management, theme system

### 🚧 In Development
- **Role-Based Access Control** - Backend models ready, frontend implementation in progress
- **Organisation Management** - Backend controllers ready, UI pending
- **Activity Management UI** - Forms and workflow interfaces
- **Dashboard & Analytics** - Data visualisation and reporting
- **Messaging System** - Internal communication features
- **Help System** - User documentation and guides

### 📋 Planned (MVP Scope)
- Multi-tier user management UI
- Hierarchical organization management UI
- Role-based dashboards
- Report generation (PDF, Excel, CSV)
- Notification system
- Onboarding flows

### 🚀 Future Expansion (Post-MVP)
- Mapping and geospatial visualization
- Social media infodemiology monitoring
- Advanced AI-powered sentiment analysis
- Pattern database with federated learning

## 🤝 How to Contribute

CCIP follows **SpecKit-driven development**:

1. **Read the Spec**: Check `specs/epic-XXX-*.md` for feature requirements
2. **Follow the Plan**: Use `IMPLEMENTATION_PLAN.md` for task order
3. **Document Changes**: Update specs when implementing features
4. **Test Thoroughly**: Ensure all tests pass before submitting

📖 **See**: [Contributing Guide](./docs/CONTRIBUTING.md)

## 📚 Documentation

| For | Read This |
|-----|-----------|
| **New Developers** | [Quick Start](./docs/QUICK_START.md) → [Developer Setup](./docs/DEVELOPER_SETUP.md) |
| **Product Managers** | [PRD](./project-management/PRD.md) → [Implementation Plan](./IMPLEMENTATION_PLAN.md) |
| **DevOps Engineers** | [Docker Practices](./docs/DOCKER_PRACTICES.md) |
| **AI Assistants** | [AI Assistant Prompt](./.cursor/rules/AI_ASSISTANT_PROMPT.md) |
| **Project Structure** | [Complete Structure Guide](./PROJECT_STRUCTURE.md) |

## 🎯 Use Cases

### Public Health Officials
- Track COVID-19 vaccination campaign outreach
- Monitor Ebola risk communication activities
- Report on malaria prevention initiatives

### Government Organizations
- Federal ministry oversight of state programs
- State coordination of local health departments
- Cross-jurisdiction incident response

### NGOs and Partners
- Coordinate multi-organization response efforts
- Share best practices and resources
- Document impact for funding reports

### Nonprofit Organizations
- Small CSOs can start movements that get adopted by larger organisations
- Easy linking and integration when smaller organisations join larger networks
- Transfer of super admin rights when organisations merge or adopt movements
- Coordinate grassroots initiatives with established nonprofit structures

### Civil Service Organizations
- Multi-level coordination across government departments
- Hierarchical management of public service initiatives
- Cross-departmental collaboration on public health campaigns
- Evidence-based reporting for government oversight

## 🔐 Roles and Access Levels

CCIP implements a hierarchical role-based access control system to ensure appropriate permissions across organisational structures:

### Role Hierarchy

1. **Super Admin**
   - Full system access across all organisations
   - Can create, modify, and delete organisations
   - Can transfer ownership and admin rights between organisations
   - Can link organisations (e.g., when a federal organisation needs to connect with an existing state organisation)
   - Can assign any role to any user
   - Access to all data and analytics across the entire platform

2. **Admin**
   - Full access within their assigned organisation and all child organisations
   - Can create and manage sub-organisations
   - Can assign roles (Sub-admin and User) within their organisation hierarchy
   - Can manage users within their organisation scope
   - Access to organisation-level dashboards and reports
   - Cannot transfer ownership or link organisations (requires Super Admin)

3. **Sub-admin**
   - Limited administrative access within their assigned organisation
   - Can manage users (assign User role only)
   - Can view and edit activities within their organisation
   - Can generate reports for their organisation
   - Cannot create organisations or assign admin roles

4. **User**
   - Standard access to create and manage their own activities
   - Can view organisation activities (based on organisation-level permissions)
   - Can upload evidence and documentation
   - Can participate in internal messaging
   - Cannot manage other users or organisations

### Shared Access with Different Role Levels

- Users can belong to multiple organisations with different roles in each
- Role permissions are scoped to the organisation level
- Higher-level roles inherit permissions from lower-level roles
- Organisation hierarchy determines data visibility (users see data from their organisation and all child organisations)

### Organisation Linking and Ownership Transfer

- **Linking Organisations**: When a state organisation starts before a federal organisation, the federal organisation can connect and link up, placing the state under the federal in the hierarchy
- **Ownership Transfer**: Super admins can transfer ownership and admin rights between organisations, enabling smooth transitions when organisations merge or adopt movements
- **Easy Integration**: Small CSOs can start movements that get adopted by larger organisations with seamless linking and super admin rights transfer

## 🌍 Designed For

- **Low-bandwidth environments** - Progressive Web App technology
- **African health contexts** - Optimized for infrastructure challenges
- **Multi-level governance** - Federal → State → Local hierarchies
- **Evidence-based decisions** - Data-driven reporting and analytics

## 🔧 Development Status

### ✅ Completed
- [x] Docker infrastructure setup
- [x] Database schema design and migrations
- [x] API architecture and base controllers
- [x] Frontend component structure
- [x] Authentication system (backend + frontend)
- [x] Activity CRUD backend with workflow
- [x] File upload backend (MinIO/S3)
- [x] AI service integration
- [x] Frontend routing and state management

### 🚧 In Progress
- [ ] Role-based access control implementation
- [ ] Organisation management UI
- [ ] Activity management UI
- [ ] Dashboard and analytics visualisation
- [ ] Messaging system UI
- [ ] Report generation UI

### 📋 Planned
- [ ] Help system implementation
- [ ] Onboarding flows
- [ ] Advanced analytics
- [ ] Pattern database features

## 🤝 Support

- 📖 **Documentation**: [./docs/](./docs/)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-org/ccip/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-org/ccip/discussions)
- 📧 **Contact**: ccip@example.com

## 📄 License

[MIT License](LICENSE) - See [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built for public health professionals, by public health professionals.**

[![Built with ❤️ for Public Health](https://img.shields.io/badge/Built%20with%20❤️%20for-Public%20Health-red.svg)]()

</div>

