# CCIP Technical Specification

## Technology Stack

| Layer           | Technology    | Notes                                           |
|-----------------|--------------|-------------------------------------------------|
| Frontend        | Vue 3 + Quasar + Pinia | Rapid PWA dev, low bandwidth, modular UI      |
| Backend         | Laravel       | RESTful API, quick dev, Docker compatible        |
| Database        | PostgreSQL    | Reliable, scalable                              |
| Infra           | Docker Compose| All services dev/prod parity                    |
| Storage         | S3-compatible | Media/evidence uploads                          |
| Docs            | SpecKit .md, Markdown | Specs, plans, tasks, guides                    |
| AI Assistance   | GLM-4.6, ChatGPT | Codegen, docs, UI conversion (per strict mapping)|
| Design Source   | Figma, Figma Make | Mapping table guides AI Vue/Quasar conversion  |

## Frontend Architecture

### Framework: Vue 3
- Composition API (primary)
- TypeScript support (optional but recommended)
- Single File Components (SFCs)

### UI Framework: Quasar
- Component library for rapid development
- PWA capabilities built-in
- Responsive design out of the box
- Low-bandwidth optimised components

### State Management: Pinia
- Centralised state management
- Type-safe stores
- DevTools integration

### HTTP Client: Axios
- RESTful API communication
- Request/response interceptors
- Error handling middleware

## Backend Architecture

### Framework: Laravel
- RESTful API endpoints
- Authentication via Laravel Sanctum
- File upload handling
- Queue system for async tasks

### Database: PostgreSQL
- Relational data model
- JSON support for flexible schemas
- Full-text search capabilities
- ACID compliance

### Storage: S3-Compatible
- MinIO for local development
- AWS S3 for production
- Media file storage (images, docs, audio, video)
- Secure access via signed URLs

## Infrastructure

### Docker Compose Services
- Frontend (Vue/Quasar dev server)
- Backend (Laravel API)
- Database (PostgreSQL)
- Storage (MinIO for S3-compatible storage)
- Redis (optional, for caching/queues)

### Development Environment
- Hot reload for frontend
- Database migrations
- Seed data for testing
- Environment variable management

## Security Requirements

### Authentication & Authorisation
- Role-based access control (RBAC)
- JWT tokens via Laravel Sanctum
- Password hashing (bcrypt)
- Session management

### Data Protection
- Encrypted file uploads
- Secure API endpoints (HTTPS)
- Input validation and sanitisation
- SQL injection prevention (Eloquent ORM)

## Performance Requirements

### Low-Bandwidth Optimisation
- Image compression and lazy loading
- Code splitting and tree shaking
- CDN for static assets
- Progressive Web App (PWA) for offline capability

### Scalability
- Database indexing strategy
- Caching layer (Redis)
- Queue system for heavy operations
- Horizontal scaling capability

## API Design

### RESTful Principles
- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE, PATCH)
- JSON request/response format
- Standardised error responses

### Endpoint Structure
```
/api/v1/
  ├── auth/
  ├── users/
  ├── organisations/
  ├── activities/
  ├── reports/
  ├── messages/
  └── notifications/
```

## Documentation Standards

### Code Documentation
- Inline comments for business logic
- API documentation (OpenAPI/Swagger)
- Component documentation (JSDoc)
- Database schema documentation

### SpecKit Integration
- All features documented in SpecKit format
- Epic → Spec → Plan → Tasks workflow
- Traceability from requirements to code

