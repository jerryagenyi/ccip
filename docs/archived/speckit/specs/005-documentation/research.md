# Research: Documentation & Help System

## Technology Research

### API Documentation
- **L5-Swagger**: Laravel package for Swagger/OpenAPI
  - Auto-generates from code annotations
  - Swagger UI integration
  - Easy to maintain
  
- **Laravel Swagger**: Alternative package
  - Similar functionality
  - Check compatibility with Laravel 10+

**Recommendation**: L5-Swagger for Laravel integration

### Markdown Rendering
- **Backend**: Use Parsedown or similar
  - Convert Markdown to HTML
  - Server-side rendering
  
- **Frontend**: Use marked.js or markdown-it
  - Client-side rendering
  - Better for dynamic content

**Recommendation**: Backend rendering for security, frontend for preview

### Onboarding Tour
- **Driver.js**: Lightweight tour library
  - Size: ~10KB
  - Good for MVP
  - Easy to customize
  
- **Intro.js**: More features
  - Size: ~30KB
  - More customization options

**Recommendation**: Driver.js for MVP (lightweight, low-bandwidth friendly)

### Search Functionality
- **Database Full-Text Search**: PostgreSQL full-text search
  - Built-in, no external dependencies
  - Good for MVP
  
- **Elasticsearch**: Future enhancement
  - Better search capabilities
  - More complex setup

**Recommendation**: PostgreSQL full-text search for MVP

## Security Research

### Content Access Control
- **Role-Based**: Help articles filtered by role_access
- **Published Status**: Only published articles visible
- **API Docs**: Authenticated users only
- **Admin-Only**: Help article editing (admin only)

### Content Security
- **Markdown Sanitization**: Sanitize user-generated content
- **XSS Prevention**: Escape HTML in Markdown rendering
- **Link Validation**: Validate external links

## Performance Research

### Caching Strategy
- **Help Articles**: Cache in Redis (1 hour TTL)
- **Onboarding Steps**: Cache in Redis (1 hour TTL)
- **API Documentation**: Pre-generate, cache static files
- **Invalidate**: On help article create/update

### Search Optimization
- **Full-Text Index**: PostgreSQL full-text search index
- **Search Results**: Limit to 20 results, paginate
- **Search Caching**: Cache common searches (5 minutes)

## Low-Bandwidth Optimizations
- **Lazy Loading**: Load help content on demand
- **Image Optimization**: Compress screenshots/illustrations
- **Minimal Markdown**: Keep help articles concise
- **Progressive Loading**: Load onboarding steps incrementally

## Implementation Notes
- **Help Articles**: Stored as Markdown, rendered to HTML
- **Onboarding**: Role-specific steps, progress tracked per user
- **API Docs**: Auto-generated from code annotations
- **Search**: Full-text search on title and content
- **Categories**: Predefined categories for organization

## Dependencies
- Epic 001 (User & Organisation Management) - Required
- L5-Swagger or similar (for API docs)
- Markdown parser (Parsedown or similar)
- Tour library (Driver.js recommended)
- PostgreSQL full-text search

## Future Enhancements
- Video tutorials
- Interactive API explorer
- User-contributed help articles
- Help article versioning
- Multi-language support

