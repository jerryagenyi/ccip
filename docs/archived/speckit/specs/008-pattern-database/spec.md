# Epic 008: Pattern Database

## Epic Overview
Implement the foundational pattern database for storing, searching, and validating semiotic patterns that power the CCIP intelligence system. This is the core data foundation that enables semiotic risk assessment and continuous learning from field operations.

## Epic Status
- **Priority**: Critical (Core Innovation)
- **Phase**: MVP (Foundation)
- **Stakeholders**: System Admins, Domain Experts, Risk Assessment Engine
- **Dependencies**: None (foundation feature)
- **Estimate**: 2-3 weeks

## Problem Statement
CCIP needs a structured way to store semiotic patterns that represent communication failures and successes across different cultural contexts. Without a pattern database, the semiotic risk assessment cannot function, and the system cannot learn from deployed campaigns.

## Solution Overview
Create a comprehensive pattern database that stores validated semiotic patterns with rich context metadata, enabling the risk assessment engine to provide accurate predictions based on historical evidence.

## Acceptance Criteria

### AC-001: Pattern Storage
- System stores patterns with complete schema: ID, Type, Context, Failed Element, Successful Alternative, Evidence
- Pattern types include: Language, Cultural, Technical, Demographic, Regional, Channel
- Context metadata captures: Region, Country, Language, Demographics, Communication Channel
- Evidence sources are linked and tracked for validation

### AC-002: Pattern Management
- Admins can create, update, and delete patterns
- Patterns follow validation workflow: Draft → Review → Validated → Deprecated
- Version control tracks pattern changes
- Patterns can be marked as organization-specific or globally shared

### AC-003: Pattern Search & Query
- Full-text search across all pattern elements
- Filter patterns by context (region, language, demographics, effectiveness)
- Vector similarity search for semantic pattern matching
- Pattern effectiveness weighting in search results

### AC-004: Pattern Validation
- Domain experts can validate new patterns
- Validation includes confidence scoring and expert notes
- Pattern effectiveness tracking from field reports
- Anonymous pattern sharing between organizations

### AC-005: Performance & Scalability
- Search response time < 500ms
- Support for 10,000+ patterns
- Efficient indexing for fast queries
- Cache frequently accessed patterns

## User Stories

### US-008-001: Create New Pattern
**As a** System Admin
**I want to** create a new semiotic pattern
**So that** it can be used for future risk assessments

**Acceptance Criteria:**
- [ ] Pattern creation form captures all required fields
- [ ] Pattern starts in "Draft" status
- [ ] Can attach evidence from multiple sources
- [ ] Pattern assigned initial confidence score
- [ ] Pattern automatically tagged with creation context

### US-008-002: Validate Pattern
**As a** Domain Expert
**I want to** review and validate draft patterns
**So that** only high-quality patterns are used for assessments

**Acceptance Criteria:**
- [ ] Validation dashboard shows patterns awaiting review
- [ ] Can approve, reject, or request changes
- [ ] Validation includes confidence scoring (0-100)
- [ ] Expert notes are attached to validation
- [ ] Email notifications for validation requests

### US-008-003: Search Patterns
**As a** Risk Assessment Engine
**I want to** search for relevant patterns
**So that** I can provide accurate risk predictions

**Acceptance Criteria:**
- [ ] Full-text search on pattern descriptions
- [ ] Filter by region, language, demographics
- [ ] Vector similarity search for semantic matching
- [ ] Results sorted by relevance and effectiveness
- [ ] API endpoint for programmatic access

### US-008-004: Pattern Analytics
**As a** System Admin
**I want to** view pattern usage analytics
**So that** I can understand which patterns are most valuable

**Acceptance Criteria:**
- [ ] Dashboard shows pattern usage frequency
- [ ] Effectiveness score tracking per pattern
- [ ] Geographic distribution of pattern applications
- [ ] Export analytics reports
- [ ] Identify underperforming patterns for review

## Technical Architecture

### Database Schema

#### Core Pattern Storage
```sql
CREATE TABLE semiotic_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_type VARCHAR(50) NOT NULL, -- 'language', 'cultural', 'technical', 'demographic', 'regional', 'channel'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    -- Core Pattern Elements
    failed_element TEXT NOT NULL,
    successful_alternative TEXT NOT NULL,

    -- Context Metadata
    context_metadata JSONB NOT NULL DEFAULT '{}', -- region, country, language, demographics, channel

    -- Evidence & Validation
    evidence_sources JSONB DEFAULT '[]'::jsonb, -- Array of evidence references
    effectiveness_score DECIMAL(5,2) DEFAULT NULL, -- Average effectiveness from field reports
    confidence_score DECIMAL(5,2) DEFAULT 50.0, -- Expert confidence in pattern
    usage_count INTEGER DEFAULT 0, -- Number of times used in assessments

    -- Metadata
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'validated', 'deprecated'
    is_global BOOLEAN DEFAULT FALSE, -- TRUE for organization sharing
    organization_id UUID REFERENCES organisations(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Pattern Context Details
```sql
CREATE TABLE pattern_contexts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_id UUID REFERENCES semiotic_patterns(id) ON DELETE CASCADE,

    -- Geographic Context
    region VARCHAR(100),
    country VARCHAR(2), -- ISO country code
    administrative_level VARCHAR(50), -- 'national', 'state', 'lga', 'community'

    -- Demographic Context
    target_audience JSONB NOT NULL DEFAULT '{}', -- Age groups, gender, education, etc.
    language VARCHAR(10), -- ISO language code
    cultural_context JSONB DEFAULT '{}', -- Cultural factors

    -- Communication Context
    channel VARCHAR(50), -- 'radio', 'social_media', 'print', 'community_meeting'
    communication_goal VARCHAR(100), -- 'awareness', 'behavior_change', 'information'

    -- Reliability
    reliability_score DECIMAL(5,2) DEFAULT 50.0, -- Confidence in context accuracy
    sample_size INTEGER, -- Number of instances this context applies to

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Pattern Validation
```sql
CREATE TABLE pattern_validations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_id UUID REFERENCES semiotic_patterns(id) ON DELETE CASCADE,

    validator_id UUID REFERENCES users(id),
    validation_type VARCHAR(50) DEFAULT 'expert', -- 'expert', 'field', 'peer', 'automated'

    -- Validation Details
    confidence_score DECIMAL(5,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
    notes TEXT,
    approved BOOLEAN DEFAULT FALSE,

    -- Validation Metrics
    effectiveness_prediction DECIMAL(5,2), -- Predicted effectiveness

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Pattern Evidence
```sql
CREATE TABLE pattern_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_id UUID REFERENCES semiotic_patterns(id) ON DELETE CASCADE,

    -- Source Information
    source_type VARCHAR(50) NOT NULL, -- 'field_report', 'research', 'expert_opinion', 'case_study'
    source_reference TEXT NOT NULL, -- URL, report reference, etc.
    source_date DATE,

    -- Evidence Details
    effectiveness_metrics JSONB DEFAULT '{}'::jsonb, -- Measured outcomes
    confidence_level VARCHAR(20), -- 'high', 'medium', 'low'

    -- Processing
    is_anonymous BOOLEAN DEFAULT TRUE, -- Strip PII for sharing
    processing_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processed', 'error'

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Design

#### Pattern Management Endpoints
```typescript
// Create Pattern
POST /api/v1/patterns
{
  "pattern_type": "cultural",
  "title": "Individual Framing in Communal Contexts",
  "description": "Messages emphasizing individual choice may fail in collectivist cultures",
  "failed_element": "Individual framing",
  "successful_alternative": "Community-focused messaging",
  "context_metadata": {
    "region": "West Africa",
    "country": "NG",
    "cultural_context": "Collectivist"
  },
  "evidence_sources": ["field_report_001", "research_abc"]
}

// Update Pattern
PUT /api/v1/patterns/{id}
{
  "title": "Updated title",
  "effectiveness_score": 75.5
}

// Validate Pattern
POST /api/v1/patterns/{id}/validate
{
  "confidence_score": 85,
  "notes": "Validated with multiple field reports",
  "approved": true
}

// Get Pattern
GET /api/v1/patterns/{id}
{
  "pattern": { ... },
  "contexts": [ ... ],
  "validations": [ ... ],
  "evidence": [ ... ]
}
```

#### Search & Query Endpoints
```typescript
// Search Patterns
GET /api/v1/patterns/search?query=individual&region=west-africa&language=en
{
  "patterns": [ ... ],
  "total": 15,
  "metadata": {
    "query": "individual",
    "filters": {
      "region": "west-africa",
      "language": "en"
    }
  }
}

// Similar Patterns (Vector Search)
GET /api/v1/patterns/{id}/similar
{
  "similar_patterns": [ ... ],
  "similarity_scores": [0.85, 0.78, 0.72]
}

// Pattern Analytics
GET /api/v1/patterns/analytics
{
  "usage_stats": {
    "total_patterns": 1250,
    "validated_patterns": 890,
    "monthly_usage": 2340
  },
  "effectiveness_distribution": {
    "high": 0.25,
    "medium": 0.45,
    "low": 0.30
  }
}
```

### Implementation Details

#### Pattern Validation Workflow
```php
// Pattern Validation Service
class PatternValidationService
{
    public function validatePattern(Pattern $pattern, array $evidence): ValidationResult
    {
        // 1. Check for duplicate patterns
        $duplicates = $this->findSimilarPatterns($pattern);

        // 2. Analyze evidence effectiveness
        $evidenceScore = $this->calculateEvidenceScore($evidence);

        // 3. Generate initial confidence score
        $baseConfidence = 50; // Starting point
        if ($evidenceScore > 70) $baseConfidence += 20;
        if (count($duplicates) > 0) $baseConfidence += 15;

        // 4. Create validation record
        return ValidationResult::create([
            'pattern_id' => $pattern->id,
            'confidence_score' => $baseConfidence,
            'notes' => "Auto-validated based on evidence analysis"
        ]);
    }
}
```

#### Pattern Matching Engine
```php
// Pattern Search Service
class PatternSearchService
{
    public function findRelevantPatterns(array $context): Collection
    {
        // 1. Full-text search
        $textMatches = $this->textSearch($context['message']);

        // 2. Context filtering
        $contextMatches = $this->filterByContext($textMatches, $context);

        // 3. Vector similarity (if enabled)
        $semanticMatches = $this->semanticSearch($context['message'], $contextMatches);

        // 4. Rank by effectiveness and relevance
        return $this->rankPatterns($semanticMatches);
    }
}
```

#### Performance Optimizations
```php
// Pattern Caching
class PatternCacheService
{
    private const CACHE_DURATION = 86400; // 24 hours

    public function cacheSearchResults(string $query, array $results): void
    {
        Cache::put(
            "pattern_search:{$query}",
            $results,
            now()->addSeconds(self::CACHE_DURATION)
        );
    }

    public function getCachedResults(string $query): ?array
    {
        return Cache::get("pattern_search:{$query}");
    }
}
```

## Dependencies

### Technical Dependencies
- PostgreSQL 16+ with pgvector extension
- Redis for caching search results
- Sentence transformer for vector embeddings (Phase 2)

### Feature Dependencies
- None (foundation feature)
- Epic 007 (Semiotic Risk Assessment) will consume this

### External Dependencies
- None initially
- Optional: Integration with research databases

## Risks & Mitigations

### Risk 1: Pattern Quality
**Mitigation**: Multi-stage validation workflow, expert review process, effectiveness tracking from field reports

### Risk 2: Privacy & Data Sharing
**Mitigation**: Automatic anonymization, opt-in sharing, GDPR compliance checks

### Risk 3: Performance at Scale
**Mitigation**: Strategic indexing, result caching, read replicas for analytics

### Risk 4: Cultural Bias
**Mitigation**: Diverse validation pool, regional validation, bias detection algorithms

## Success Metrics

### Technical Metrics
- Pattern creation time: < 30 seconds
- Search response time: < 500ms (p95)
- Pattern storage capacity: 10,000+ patterns
- Search accuracy: 90%+ (relevance feedback)

### Business Metrics
- Pattern validation rate: >80% of patterns validated within 30 days
- Pattern effectiveness: Average score >70% from field reports
- Pattern reuse: Each pattern used in multiple contexts
- Knowledge transfer: Anonymous sharing between organizations

### Product Metrics
- Risk assessment accuracy: 75%+ (validated against outcomes)
- User satisfaction: Pattern database rated as "very useful" by 90% of admins
- Learning rate: 50+ new patterns added monthly from field reports

## Definition of Done

- [ ] Database schema implemented with migrations
- [ ] CRUD API endpoints created and tested
- [ ] Pattern validation workflow functional
- [ ] Search and filtering capabilities implemented
- [ ] Performance benchmarks met
- [ ] Documentation created
- [ ] Admin UI for pattern management
- [ ] Initial pattern dataset seeded from research

## Rollout Plan

### Phase 1: Foundation (Week 1)
- Database migrations
- Basic CRUD operations
- Admin authentication and permissions

### Phase 2: Core Features (Week 1)
- Pattern creation and management
- Validation workflow
- Basic search functionality

### Phase 3: Advanced Features (Week 1)
- Vector similarity search
- Analytics dashboard
- Performance optimization

### Phase 4: Integration (Week 1)
- Integration with Epic 007
- API documentation
- User training materials

## Post-Implementation Considerations

### Maintenance
- Regular pattern quality reviews
- Automatic effectiveness score updates from field reports
- Pattern expiration and archival policies

### Scaling
- Automated pattern extraction from field reports (Phase 2)
- Machine learning for pattern suggestion (Phase 2)
- Cross-organizational pattern sharing federation

### Enhancement Opportunities
- Visual pattern mapping
- Pattern correlation analysis
- Predictive pattern effectiveness modeling

---

**Epic Owner**: System Architecture Team
**Business Stakeholder**: Product Owner
**Technical Lead**: Backend Lead
**UX Lead**: System Designer
**Created**: 2025-12-14
**Last Updated**: 2025-12-14