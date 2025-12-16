# Research: Dashboards & Analytics

## Technology Research

### Chart Libraries
- **Chart.js**: Lightweight, good for basic charts
  - Size: ~60KB minified
  - Good for: Line, bar, pie charts
  - Low-bandwidth friendly
  
- **ApexCharts**: More features, better for complex visualizations
  - Size: ~200KB minified
  - Good for: Heatmaps, advanced charts
  - Consider for MVP: May be too heavy

**Recommendation**: Start with Chart.js for MVP, upgrade to ApexCharts if needed

### PDF Generation
- **Backend (Laravel)**: Use DomPDF or Snappy
  - DomPDF: Pure PHP, no external dependencies
  - Snappy: Uses wkhtmltopdf, better quality
  
- **Frontend (JavaScript)**: Use jsPDF
  - Client-side generation
  - Smaller file size
  - Good for simple reports

**Recommendation**: Backend generation for complex reports, frontend for simple exports

### Excel Export
- **Backend (Laravel)**: Use Laravel Excel (Maatwebsite)
  - Easy integration
  - Good performance
  
- **Frontend (JavaScript)**: Use xlsx library
  - Client-side generation
  - Good for simple exports

**Recommendation**: Backend generation for consistency

### Heatmap Implementation
- **Calendar Heatmap**: Custom implementation using SVG/Canvas
  - Lightweight
  - Full control
  - Low-bandwidth friendly

- **Library Options**: 
  - cal-heatmap (small, simple)
  - Custom Vue component (recommended for MVP)

**Note**: Geographic heatmap NOT in scope (per constitution)

## Performance Research

### Caching Strategy
- **Dashboard Summary**: Cache for 5 minutes (Redis)
- **Analytics Aggregations**: Cache for 15 minutes (Redis)
- **Heatmap Data**: Cache for 1 hour (Redis)
- **Invalidate**: On activity create/update/delete

### Database Optimization
- **Materialized Views**: For frequently accessed aggregations
- **Indexes**: On date fields, status, organisation_id
- **Partitioning**: Consider for activity_status_history if large volume

### Query Optimization
- **Eager Loading**: Load relationships efficiently
- **Pagination**: For large datasets
- **Lazy Loading**: Load charts on demand

## Low-Bandwidth Optimizations
- **Chart Data**: Send minimal data, render on client
- **Progressive Loading**: Load dashboard sections incrementally
- **Image Compression**: For exported charts/images
- **Data Compression**: Compress API responses (gzip)

## Security Research

### Data Access Control
- **Role-Based Filtering**: Users see only their organisation's data
- **Hierarchy Filtering**: Admins see sub-organisation data
- **Export Permissions**: Admin-only for sensitive exports

### Data Privacy
- **Anonymization**: For cross-organisation comparisons
- **Aggregation**: Show aggregates, not individual records
- **Access Logging**: Log who accessed what dashboard data

## Implementation Notes
- **Heatmap**: Time-based calendar view only (no geographic)
- **Engagement Metrics**: Manual entry initially, automated later
- **Export Formats**: PDF, Excel, CSV
- **Real-Time Updates**: Start with polling, upgrade to WebSocket later
- **Dashboard Customization**: Basic for MVP, advanced later

## Dependencies
- Epic 001 (User & Organisation Management) - Required
- Epic 002 (Activity Tracking) - Required
- Chart library (Chart.js recommended)
- PDF/Excel generation library
- Redis for caching

