# CCIP Architectural Roadmap

## Phase 1: MVP Development (Current)

### Architecture Approach
- **Mono-repo**: Frontend, backend, and API in one repository until team expansion
- **SpecKit-driven**: All specs, plans, and task breakouts driven by SpecKit
- **Design-first**: Figma as UI/UX source of truth; map components to Quasar via DSL
- **State Management**: Pinia for frontend state, Axios for API communication
- **Authentication**: Role-based authentication and dashboarding

### Core Components

#### 1. User & Organisation Management
- Multi-tier role system (Super Admin, Admin, Sub-admin, User)
- Hierarchical organisation structure
- Permission-based access control
- User profile management

#### 2. Activity Tracking System
- Activity creation and submission workflow
- Evidence upload system (images, docs, audio, video)
- Audit trail for all activities
- Customisable reporting templates
- Metrics tagging system

#### 3. Dashboard & Analytics
- Role-based dashboard views
- Activity status tracking
- Activity heatmaps
- Engagement rate analytics
- Exportable summary reports

#### 4. Communication System
- Internal messaging/chat between organisation levels
- Notification system (urgent news, reminders)
- Real-time updates (WebSocket or polling)

#### 5. Documentation System
- Developer documentation (auto-generated/spec-driven)
- User help and onboarding guides
- Feature-specific documentation per role

### Technical Implementation

#### Frontend Structure
```
frontend/
├── src/
│   ├── components/     # Reusable Vue components
│   ├── pages/          # Route pages
│   ├── stores/         # Pinia stores
│   ├── services/       # API services
│   ├── router/         # Vue Router config
│   ├── layouts/        # Quasar layouts
│   └── boot/           # Quasar boot files
```

#### Backend Structure
```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   ├── Services/
│   └── Policies/
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
└── routes/
    └── api.php
```

## Phase 2: Future Expansion (Post-MVP)

### Mapping Module
- External/cross-sector mapping (disaster, emergency, workplace)
- Geographic visualisation of activities
- Integration with Ushahidi, Sahana Eden
- Open-source mapping integrations

### Social Media Monitoring Module
- Silent monitoring: Twitter/X, Facebook, WhatsApp
- Public mentions, hashtags, keyword tracking
- Real-time data collection
- Privacy-compliant data handling

### AI/ML Infodemiology Pipeline
- Sentiment analysis
- Spike detection algorithms
- Misinformation tagging
- Pattern recognition

### Search Analytics Module
- Google Trends integration
- Real-time information demand visualisation
- Search query analysis
- Trend correlation with activities

### SMS Gateway
- Low-connectivity field data collection
- Two-way SMS communication
- Offline-first data sync

### Researcher Dashboard
- Social data visualisation
- Search tracking analytics
- Time-series analysis
- Thematic and geographic overlays
- Export capabilities for research

## Development Workflow

### Spec-Driven Development Process
1. **Epic Creation**: High-level feature definition
2. **Specification**: Detailed technical specification
3. **Planning**: Implementation plan with tasks
4. **Development**: Code implementation
5. **Documentation**: Update all relevant docs
6. **Review**: Code review and testing

### Design Pipeline
- **Figma**: Design authority and source of truth
- **Mapping Table**: Strict Quasar component mapping
- **Vue SFCs**: Generated from Figma designs
- **Component Library**: Reusable Quasar components

### Documentation Standards
- All code commented with business logic explanations
- UI choices documented
- API contracts clearly defined
- Reference latest `plan.md` for endpoint and schema specs

### Security & IP Management
- Role-based repository access (post-team scaling)
- Frontend/backend split if needed
- Secure credential management
- Audit logging for sensitive operations

## Guidance for AI Assistants and Team

### MVP Focus
- **Only deliver**: Activity tracking, dashboards, secure uploads, internal messaging
- **Ignore**: Mapping/social modules during MVP development
- **Document**: Future features in SpecKit roadmap and backlog
- **Do not code**: Mapping or social media features in MVP

### Design Pipeline
- Always use Figma as design authority
- Map to Vue SFCs with strict Quasar mapping table
- Maintain component consistency

### Documentation Requirements
- Code must explain business logic
- UI choices must be documented
- API contracts must be clear
- Reference latest plan.md for specs

### Development Workflow
- Each feature starts as SpecKit epic
- Follow: Spec → Plan → Task list → Implementation → Documentation
- Maintain full traceability

## Cross-Sector & Researcher Expansion

### Modular Approach
- Mapping and infodemiological analysis as non-MVP backlog
- Execute only if stakeholders request and resources allow
- Maintain modular architecture for easy extension

### Pilot Workflow for Social Media Modules
1. Listen to public posts/tweets (using platform accounts, not costly APIs)
2. Track keywords, hashtags, mentions with timestamp and frequency
3. Aggregate and graph spikes/events for research or early warning
4. Respect privacy and public communications best practices

## Conclusion

CCIP's architecture is designed for:
- **MVP Delivery**: Focused, lean implementation
- **Future Expansion**: Modular, extensible design
- **Spec-Driven**: Full traceability and documentation
- **Team Scalability**: Clear structure for growth

