# RCAP - Risk Communication Activity Platform

<div align="center">

**Risk Communication Activity Platform**

Federal Ministry of Health - Nigeria

A purpose-built platform for tracking, reporting, and analyzing public health risk communication activities, optimized for low-bandwidth contexts.

**Current Status**: UI/UX Prototype Phase (85% Complete)

[![Prototype](https://img.shields.io/badge/Status-85%25%20Complete-orange.svg)]()
[![Vue 3](https://img.shields.io/badge/Vue-3-green.svg)](https://vuejs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-10-red.svg)](https://laravel.com/)

</div>

## 🚀 Current Status

**Prototype Available**: https://9000-firebase-studio-1763236692080.cluster-ikslh4rdsnbqsvu5nw3v4dqjj2.cloudworkstations.dev

**Completion**: 85% of UI/UX prototype implemented
**Next Phase**: Execute implementation prompts (7-10 weeks)

### What's Implemented
- ✅ Authentication system with login
- ✅ Dashboard with metrics and analytics
- ✅ Activity management (list, create, detail, edit)
- ✅ Team directory and user profiles
- ✅ Organisations management (needs data model fix)
- ✅ Reports and analytics
- ✅ Mobile-responsive design

### What's Next
📖 **Implementation Plan**: See [Implementation Readiness Summary](./docs/IMPLEMENTATION_READINESS_SUMMARY.md)
📋 **Requirements**: See [Requirements Specification](./docs/REQUIREMENTS_SPECIFICATION.md)
🔧 **Implementation Prompts**: See [Firebase AI Implementation Prompts](./docs/FIREBASE_AI_IMPLEMENTATION_PROMPTS.md)

## 📋 What RCAP Does

RCAP helps public health officials:

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
rcap/
├── 📁 Documentation Hub
│   ├── README.md                     # 📖 Project overview
│   ├── docs/                         # 📚 Complete documentation
│   └── .cursor/rules/                # 🤖 Cursor IDE rules
│       └── AI_ASSISTANT_PROMPT.md    # AI assistant guide
├── 📁 SpecKit Development
│   ├── specs/                        # 📋 5 MVP epics fully specified
│   ├── memory/                       # 🧠 Project constitution
│   └── templates/                    # 📋 SpecKit templates
├── 📁 Application Code
│   ├── backend/                      # 🔧 Laravel 10 API
│   ├── frontend/                     # 🎨 Vue 3 + Quasar PWA
│   └── docker-compose.yml            # 🐳 Infrastructure
└── 📁 Project Management
    ├── project-management/           # 📋 PRD, technical specs
    └── IMPLEMENTATION_PLAN.md        # 🗓️ Implementation timeline
```

📖 **See**: [Complete Project Structure](./PROJECT_STRUCTURE.md) for detailed overview

## 🎯 MVP Features

### ✅ Currently Implemented
- Multi-tier user management (Super Admin → Admin → Sub-admin → User)
- Hierarchical organization structure
- Activity tracking with evidence uploads
- Role-based dashboards and analytics
- Internal messaging system
- File storage (images, documents, audio, video)

### 🚧 Future Expansion (Not in MVP)
- Mapping and geospatial visualization
- Social media infodemiology monitoring
- AI-powered sentiment analysis
- Advanced research analytics

## 🤝 How to Contribute

RCAP follows **SpecKit-driven development**:

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

RCAP implements a hierarchical role-based access control system to ensure appropriate permissions across organisational structures:

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

- [x] Docker infrastructure setup
- [x] Database schema design
- [x] API architecture planning
- [x] Frontend component structure
- [ ] Authentication implementation *(In Progress)*
- [ ] Activity tracking features
- [ ] Dashboard analytics
- [ ] File upload system

## 🤝 Support

- 📖 **Documentation**: [./docs/](./docs/)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-org/rcap/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-org/rcap/discussions)
- 📧 **Contact**: rcap@example.com

## 📄 License

[MIT License](LICENSE) - See [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built for public health professionals, by public health professionals.**

[![Built with ❤️ for Public Health](https://img.shields.io/badge/Built%20with%20❤️%20for-Public%20Health-red.svg)]()

</div>

