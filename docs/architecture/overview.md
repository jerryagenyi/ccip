# CCIP Architecture Overview

**Tagline:** Predictive Intelligence for Culturally-Resonant Crisis Communication

Version: 1.2

Date: December 14, 2025

Status: Production Architecture Specification

## Executive Summary

CCIP (Crisis Communication Intelligence Platform) is a system that combines organizational coordination infrastructure with AI-powered semiotic analysis to prevent communication failures during health crises.

### Core Architectural Principles
- **Data Sovereignty by Design**: Clients control their operational data
- **Federated Learning Architecture**: Pattern intelligence shared across deployments
- **Security-First Approach**: Enterprise-grade security from day one
- **Scalable Foundation**: Built to grow from pilots to global deployment

### Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Frontend** | Vue 3 + Quasar | 3.5 / 2.18 | Cross-platform PWA with responsive design |
| **Frontend Language** | TypeScript | 5.9 | Type-safe development |
| **Frontend Build** | Vite | 7.1 | Modern build tool and dev server |
| **Frontend State** | Pinia | - | State management (14 stores) |
| **Frontend Components** | Vue 3 Components | 72 components | Component-based architecture |
| **Backend** | Laravel | 11 | Robust API framework with business logic |
| **Backend Language** | PHP | 8.2 | Server-side runtime |
| **Database** | PostgreSQL | 16 | Primary data store with JSONB and pgvector |
| **Caching** | Redis | 7 | Performance and session management |
| **Storage** | S3-compatible | - | Secure media and evidence storage |
| **Authentication** | Laravel Sanctum | - | Token-based API authentication |
| **OAuth** | Google OAuth | - | Social authentication |
| **Testing (Frontend)** | Vitest, Playwright | - | Unit and E2E testing |
| **Testing (Backend)** | PHPUnit | - | Backend unit and feature testing |
| **ML/AI** | Python + FastAPI | 3.11+ / 0.109+ | High-performance semiotic analysis service |

## High-Level Architecture

**Architecture Pattern:** Multi-part architecture (Frontend + Backend)
**API Design:** API-first RESTful design
**PWA Strategy:** Offline-first capabilities

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Vue 3.5   │  │ Quasar 2.18 │  │      PWA            │  │
│  │ TypeScript  │  │   UI Kit    │  │   Service Worker    │  │
│  │ 72 Components│  │             │  │  Offline-First     │  │
│  │ 14 Pinia    │  │             │  │                     │  │
│  │   Stores    │  └─────────────┘  └─────────────────────┘  │
│  └─────────────┘                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  API GATEWAY      │
                    │  Laravel 11       │
                    │  PHP 8.2          │
                    │                   │
                    │ • Authentication  │
                    │   (Sanctum + OAuth)│
                    │ • Service Layer  │
                    │ • Business Logic  │
                    │ • Data Validation  │
                    └─────────┬─────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
    ┌─────▼─────┐      ┌─────▼─────┐      ┌─────▼─────┐
    │PostgreSQL │      │   Redis   │      │MinIO/S3   │
    │    16     │      │     7     │      │ Storage   │
    └───────────┘      └───────────┘      └───────────┘
                              │
                    ┌─────────▼─────────┐
                    │    ML/AI Layer    │
                    │  Python + FastAPI │
                    │                   │
                    │ • Semiotic Engine │
                    │ • Pattern DB      │
                    │ • AI Services     │
                    └───────────────────┘
```

## Data Architecture & Sovereignty

### Three-Tier Data Model

1. **Tier 1: Client Operational Data** (Sensitive, Organization-Owned)
   - User identities, activity locations, field reports
   - Storage options: Client-managed, Platform-managed, or Hybrid
   - Always under client control

2. **Tier 2: Semiotic Intelligence Data** (Proprietary, Anonymized)
   - Pattern database (e.g., "IF-042: Individual framing failure")
   - ML training data, aggregated metrics
   - **This is our competitive moat** - no PII, only generalized patterns

3. **Tier 3: Platform Metadata**
   - Hashed passwords, configurations, audit logs
   - Non-sensitive operational data

### Federated Learning Flow

1. **Message Planning**: Query pattern DB (no PII involved)
2. **Field Reporting**: Store operational data in Tier 1
3. **Pattern Extraction**: Anonymize and extract patterns to Tier 2
4. **Cross-Organizational Learning**: All clients benefit from shared intelligence

## System Components

### Frontend Application
- [Frontend Architecture Details](frontend/)
- Vue 3.5 Composition API for reactive components (72 components)
- Quasar 2.18 for cross-platform UI components
- TypeScript 5.9 for type-safe development
- Vite 7.1 for build tooling and development
- Pinia stores (14 stores) for state management
- PWA architecture with offline-first capabilities
- Component-based Vue 3 architecture

### Backend API
- [Backend Architecture Details](backend/)
- Laravel 11 with RESTful API design
- PHP 8.2 runtime
- Service layer pattern for business logic
- Sanctum for token-based authentication
- Google OAuth integration
- Queue system for async processing
- Comprehensive audit logging

### Database Design
- [Database Schema](database/)
- PostgreSQL with JSONB for flexible data
- pgvector extension for semiotic pattern storage
- Row-Level Security for multi-tenancy
- Comprehensive migration strategy

### AI/ML Service
- Python + FastAPI for high-performance inference
- Scikit-learn/PyTorch for semiotic analysis
- Asynchronous processing for large analyses
- Model versioning and A/B testing support

## Security Architecture

### Authentication & Authorization
- JWT tokens via Laravel Sanctum
- Role-based access control (RBAC)
- Organization-level data isolation
- Session management with Redis

### Data Protection
- GDPR/NDPR compliance by design
- End-to-end encryption for sensitive data
- Audit logging for all data access
- Regular security assessments

### Infrastructure Security
- TLS 1.3 for all communications
- API rate limiting and DDoS protection
- Container isolation with Docker
- Secrets management

## Performance & Scalability

### Performance Targets
- API response time: < 500ms (p95)
- Semiotic assessment: < 5 seconds
- Page load time: < 2 seconds
- Concurrent users: 100+ (MVP), 10,000+ (scale)

### Scalability Strategy
- Horizontal scaling with load balancers
- Database read replicas for analytics
- CDN for static assets
- Microservices preparation for AI service

## Development Workflow

### Code Organization
```
ccip/
├── backend/           # Laravel API
│   ├── app/
│   ├── database/
│   └── tests/
├── frontend/          # Vue 3 + Quasar
│   ├── src/
│   │   ├── components/
│   │   ├── stores/
│   │   └── pages/
│   └── tests/
├── ai-service/        # Python FastAPI
└── docs/             # Documentation
```

### Deployment Architecture
- Docker containers for all services
- Docker Compose for development
- Kubernetes orchestration for production
- CI/CD pipeline with GitHub Actions

## Monitoring & Observability

### Application Monitoring
- Application Performance Monitoring (APM)
- Error tracking and alerting
- Custom metrics for semiotic analysis
- Health check endpoints

### Infrastructure Monitoring
- Resource utilization metrics
- Database performance monitoring
- Security event logging
- Backup verification

## Roadmap Integration

See [Architectural Roadmap](roadmap.md) for detailed implementation phases:

- **Phase 1**: Core platform with rule-based semiotic assessment
- **Phase 2**: ML-powered predictions and pattern learning
- **Phase 3**: Advanced analytics and federated learning

## Related Documentation

- [Frontend Architecture](frontend.md) - Vue 3 + Quasar implementation
- [Backend Architecture](backend.md) - Laravel API design
- [Database Schema] - Schema is defined in `.specify/specs/*/data-model.md`
- [API Documentation](../api/) - Endpoint reference
- [Technical Roadmap](roadmap.md) - Implementation phases

---

*Last updated: December 14, 2025*