# CCIP Requirements Specification

**Last Updated**: 2025-01-19
**Status**: Aligned with UI/UX prototype requirements

---

## Overview

This document consolidates all functional requirements for the CCIP (Risk Communication Activity Platform) based on:
- Current UI/UX prototype audit findings
- User-identified feature requirements
- Technical specification alignment

---

## 1. Authentication & User Management

### Current Implementation Status
✅ **Complete**: Login system, user profiles, team directory
⚠️ **Needs Fix**: Registration page (currently returns 404)

### Requirements
1.1 User Registration
- Multi-step registration process
- Organisation assignment during registration
- Email verification workflow
- Admin approval for new users

1.2 User Profiles
- Profile picture upload
- Personal information management
- Activity history tracking
- Notification preferences

1.3 Team Directory
- Searchable member list
- Role-based visibility
- Contact information
- Activity assignment tracking

---

## 2. Organisation Management

### Current Implementation Status
✅ **Complete**: Basic organisations list
⚠️ **Needs Fix**: Data model confusion (category vs hierarchy)
❌ **Missing**: Linking and transfer functionality

### Requirements
2.1 Organisation Data Model
- **Category**: Government, Nonprofit, Civil Service
- **Hierarchy Level**: Federal, State, LGA
- **Parent-Child Relationships**: Clear linking structure

2.2 Organisation Management
- Create/edit organisations with proper categorization
- Link organisations (parent-child relationships)
- Transfer ownership/admin rights
- Visual hierarchy tree view

2.3 Organisation Types
- Government entities (Federal, State, LGA levels)
- Nonprofit organizations
- Civil service departments
- Cross-category relationships allowed

---

## 3. Activity Management

### Current Implementation Status
✅ **Complete**: Activity list, detail view, basic create/edit
⚠️ **Needs Enhancement**: Missing organisation selection, templates, drafts

### Requirements
3.1 Activity Lifecycle
- Create activities with organisation assignment
- Draft functionality with auto-save
- Template selection for recurring activities
- Multi-step approval workflow

3.2 Activity Categorization
- Activity types (Vaccination, Training, Emergency Response, etc.)
- Tags and metadata
- Risk level assignment
- Target population specification

3.3 Evidence Management
- File attachments (PDF, DOC, images, audio, video)
- Upload progress tracking
- File preview and download
- Version control

---

## 4. Communication System

### Current Implementation Status
✅ **Complete**: Notification system
❌ **Missing**: Internal messaging system
❌ **Missing**: Announcements system

### Requirements
4.1 Internal Messaging
- Message inbox with search/filter
- Message composer with rich text
- Conversation threading
- File attachments in messages

4.2 Announcements System (NEW - US-019)
- **Platform Updates**: Feature releases, maintenance notices
- **Federal Announcements**: National-level health communications
- **State Announcements**: State-specific health information
- **LGA Updates**: Local government communications
- **Features**:
  - Filter by announcement type
  - Visual distinction between types
  - Read/unread functionality
  - Search and sort capabilities
  - All users can read all announcement types

4.3 Notification Management
- Real-time notifications
- Email/SMS integration
- Notification preferences
- Batch notification handling

---

## 5. Dashboards & Analytics

### Current Implementation Status
✅ **Complete**: Federal dashboard, reports, analytics
⚠️ **Needs Enhancement**: Role-based views

### Requirements
5.1 Role-Based Dashboards
- Federal dashboard: National overview
- State dashboard: State-specific metrics
- LGA dashboard: Local area focus
- User dashboard: Personal activity view

5.2 Analytics & Reporting
- Activity trends and metrics
- Geographic distribution
- Performance analytics
- Custom report generation
- Export functionality

5.3 Real-time Monitoring
- Activity status tracking
- Emergency alert system
- Performance indicators
- Resource utilization

---

## 6. Navigation & Accessibility

### Current Implementation Status
✅ **Complete**: Desktop sidebar navigation
⚠️ **Needs Enhancement**: Mobile navigation, accessibility fixes

### Requirements
6.1 Desktop Navigation (US-007)
- Fixed sidebar with all main sections
- Organization hierarchy
- Role-based menu visibility
- Collapsible sections

6.2 Mobile Navigation (US-007)
- Bottom navigation bar (mobile only)
- 5 primary tabs: Dashboard, Activities, Reports, Team, Profile
- Active states and badge notifications
- Hidden on desktop, responsive behavior

6.3 Accessibility
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- Touch target optimization (44x44px minimum)
- Focus indicators

---

## 7. Pricing & Subscription (NEW - Epic 006)

### Current Implementation Status
❌ **Missing**: Entire pricing system

### Requirements
7.1 Pricing Tiers
- **Free Tier**:
  - Up to 100 members
  - Basic activity tracking
  - Standard reports
  - Community support
- **Premium Tier**:
  - Unlimited members
  - Advanced analytics
  - AI-powered insights (COMING SOON)
  - AI report generation (COMING SOON)
  - AI activity recommendations (COMING SOON)
  - Priority support
  - Custom integrations

7.2 Subscription Management
- Organization-level subscriptions
- Member limit enforcement
- Upgrade/downgrade capabilities
- Usage tracking and reporting
- Billing management integration

7.3 AI Features Policy
- All AI features marked "Coming Soon"
- Clear communication about availability timeline
- Feature preview capabilities
- User feedback collection

---

## 8. System Architecture

### Technical Requirements
8.1 Frontend
- Vue 3 + Quasar Framework
- Responsive design (mobile-first)
- Progressive Web App (PWA)
- Offline capability

8.2 Backend
- Laravel RESTful API
- PostgreSQL database
- Redis for caching
- MinIO for file storage

8.3 Infrastructure
- Docker containerization
- Scalable architecture
- High availability
- Data backup and recovery

---

## 9. Security & Compliance

### Requirements
9.1 Authentication
- Role-based access control (RBAC)
- Multi-factor authentication
- Session management
- Password policies

9.2 Data Protection
- Encrypted data storage
- Secure file uploads
- Audit logging
- GDPR compliance considerations

9.3 Privacy
- User data anonymization
- Consent management
- Data retention policies
- Right to deletion

---

## 10. Performance & Scalability

### Requirements
10.1 Performance
- Page load time < 3 seconds on 3G
- Smooth animations (60fps)
- Efficient data fetching
- Image optimization

10.2 Scalability
- Horizontal scaling capability
- Database optimization
- Caching strategies
- CDN integration

10.3 Monitoring
- Application performance monitoring
- Error tracking
- User analytics
- System health checks

---

## Implementation Priority

### Phase 1: Critical (Weeks 1-4)
1. Fix organisation data model
2. Create functional registration
3. Implement announcements system
4. Add pricing page

### Phase 2: Enhanced (Weeks 5-8)
5. Complete activity management
6. Add internal messaging
7. Implement mobile navigation
8. Role-based dashboards

### Phase 3: Advanced (Weeks 9-12)
9. Organisation linking/transfer
10. Advanced analytics
11. Subscription management
12. AI features framework

---

## Success Metrics

### User Experience
- Registration completion rate > 90%
- Mobile usage > 60% of traffic
- User satisfaction score > 4.5/5
- Support ticket reduction > 40%

### Technical Performance
- Page load time < 3 seconds
- Uptime > 99.5%
- Error rate < 0.1%
- API response time < 500ms

### Business Objectives
- User adoption rate > 80%
- Activity creation rate > 10/week/organisation
- Cross-organisation collaboration > 30%
- Premium conversion rate > 15%

---

## Notes

### Resource Centre
- Not required for MVP
- Can be added in Phase 4 based on user feedback
- Focus on core functionality first

### AI Features
- All marked "Coming Soon" until ready
- User feedback collection during preview
- Gradual rollout based on readiness

### Mobile-First Approach
- 60%+ expected mobile users
- Progressive enhancement for desktop
- Offline capability for field use

This specification serves as the foundation for the development phase and aligns with the current UI/UX prototype implementation status.