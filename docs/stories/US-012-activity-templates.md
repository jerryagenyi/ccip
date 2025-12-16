# Story US-012: Activity Templates

**Epic:** Epic 002 - Activity Tracking & Reporting

**As a** State Admin or LGA Officer  
**I want to** create and use activity templates  
**So that** I can quickly create similar activities without re-entering common information

## Acceptance Criteria

- [ ] User can save activity as template
- [ ] User can create activity from template
- [ ] Template includes: title pattern, type, common target population, message template
- [ ] Templates are organisation-specific (or global)
- [ ] User can edit template before creating activity
- [ ] User can manage (edit, delete) saved templates

## Technical Details

### Backend
- API Endpoints: 
  - `GET /api/v1/activity-templates`
  - `POST /api/v1/activity-templates`
  - `PUT /api/v1/activity-templates/{id}`
  - `DELETE /api/v1/activity-templates/{id}`
- Model: `ActivityTemplate` with fields: name, type, target_population_template, message_template, organisation_id, created_by
- Template variables: Support placeholders like {location}, {date}

### Frontend
- Components: `ActivityTemplateSelector.vue`, `TemplateForm.vue`
- Template selection: Dropdown or modal when creating activity
- Store: `useActivityStore.ts` with template management actions

## Dependencies
- Epic 001: User & Organisation Management (for organisation context)

## Status
Ready for implementation
