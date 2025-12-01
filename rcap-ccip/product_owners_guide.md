# Product Owner's Guide: Crisis Communication Intelligence Platform

**Version:** 1.0  
**Date:** November 30, 2025  
**Status:** Living Document  
**Purpose:** Single source of truth for strategic, theoretical, and technical decisions

---

## Document Purpose

This guide synthesises all strategic, theoretical, and technical decisions made during the foundational planning phase. It serves as:

- **Strategic reference** for maintaining focus and preventing scope creep
- **Decision rationale** for explaining choices to stakeholders, co-founders, and investors
- **Onboarding resource** for new team members and partners
- **Alignment tool** for ensuring all tracks (academic, funding, product) remain coherent

**Related Documents:**
- Theory of Change (v1.0) - The North Star
- Executive Summary (v1.0) - External pitch
- Technical Architecture Document (v1.0) - Technical foundation
- Product Requirements Document (v2.0) - Feature specifications
- Technical Specification (v2.0) - Implementation details

---

## I. Core Identity and Strategic Repositioning

### A. The Paradigm Shift (From Translation to Semiotics)

The most critical takeaway is the pivot from thinking of the project as a **Health Communication Tool** or **CMS** to defining it as a **Crisis Communication Intelligence Platform**.

| Old Framing | New Framing: **Crisis Communication Intelligence** | Rationale |
|:---|:---|:---|
| **Problem** | Communication fails due to translation and logistics. | Communication fails due to **semiotic breakdown**—the collapse of shared meaning across cultural/linguistic contexts. |
| **Core Value** | Content delivery and organizational efficiency. | **Predictive Intelligence** that prevents meaning collapse and ensures communication *effectiveness*. |
| **Product** | CMS for health alerts. | **Computational Disaster Semiotics Platform**. |
| **Target** | Help organizations coordinate faster. | Help organizations communicate **successfully** in high-stress, diverse contexts. |

### B. Definitions (Your Key Vocabulary)

* **Disaster Semiotics:** The academic field that studies how signs, symbols, and meaning-making systems function (or fail) under crisis conditions.

* **Semiotic Breakdown:** The root cause of communication failure; it occurs when the signs used by the sender (e.g., "quarantine," "social distancing") conflict with the existing cultural and social frameworks of the receiver.

* **Semiotic Pattern:** A generalized, anonymized instance of a communication success or failure documented across multiple contexts (e.g., "Individualistic framing fails in communal societies"). This is the **core IP**.

* **Semiotic Intelligence:** The output of the platform; the systematic, data-driven understanding of how meaning works across contexts, used to predict message failure.

* **Computational Disaster Semiotics:** The new discipline we're establishing—applying AI/ML to semiotic analysis for crisis communication.

### C. The Programmatic-First Strategy

The decision to lead with a **Programme-First** approach is strategic:

* **Programme (Years 1-2):** Grant-funded pilots (e.g., through UKRI, Wellcome) focused on validation and research.
* **Product (Years 3+):** Commercialization (B2G SaaS) using the **academic validation and case studies** generated in the programme phase as the primary sales collateral.
* **Benefit:** Grants fund development (reducing early financial risk), and academic validation provides credibility for B2G sales (reducing market risk).

**Why This Matters:** This approach aligns with:
- PhD research requirements (programme generates research data)
- Innovator Founder Visa requirements (validated innovation pathway)
- Grant funder expectations (research + impact focus)
- Commercial viability (proven case studies = easier B2G sales)

---

## II. Product Scope and Positioning

### A. Core Focus and Expansion Strategy

* **Start Vertical (Initial Focus):** **Public Health Crisis Communication** (outbreaks, vaccination campaigns). This leverages your **NCDC experience** (your domain credibility/unfair advantage) and aligns with well-funded streams (WHO, UKHSA, RKI).

* **Design Horizontal (Future Expansion):** The underlying problem (semiotic breakdown) is universal. The platform is designed to expand to other crisis domains, such as **emergency management (NEMA), climate disaster communication, and social cohesion (e.g., political/religious misinformation)**.

* **Anti-Scope Creep Rule:** Stay focused on Public Health for Phase 1 (pilots). Use the UK riots/social unrest context not as a target market, but as a **powerful illustration of the universal problem** solved by semiotic intelligence.

**Decision Framework:** When evaluating new features or markets, ask:
1. Does this serve Public Health crisis communication in Phase 1?
2. Does this build the semiotic pattern database (our moat)?
3. Does this align with the Theory of Change?

### B. Unique Selling Proposition (USP/Moat)

Your differentiation is based on the combination of coordination and intelligence:

1. **Predictive Capability:** You predict failure *before* messages are sent (competitors only do post-mortems).
2. **Semiotic Pattern Database:** An irreplicable dataset of communication successes and failures, built via federated learning. This is your **defensible moat**.
3. **Coordination + Intelligence:** Combines organizational workflow (your original RCAP prototype) *with* the semiotic intelligence layer.

**Competitive Landscape:**

| Competitor | What They Do | What They Miss |
|:---|:---|:---|
| DHIS2 | Tracks health data and outcomes | Doesn't capture *why* communication failed |
| Everbridge/Noggin | Delivers messages quickly | Doesn't analyze if messages will be understood |
| Ushahidi | Reactive crisis mapping | No prediction or organizational coordination |
| Translation Services | Word-to-word translation | Cultural meaning adaptation, not just translation |

### C. Key Use Cases (The Value Proposition)

| Feature | Value to End User (Field Officer/Admin) | Impact (High Level) |
|:---|:---|:---|
| **Semiotic Risk Assessment** | Alerts you when your draft message will fail in a target community. | **Saves lives** by preventing non-compliance. |
| **Actionable Recommendations** | Provides culturally-resonant alternatives (e.g., 'Use this local metaphor', 'Route through Imam'). | **Prevents resource waste** on failed campaigns. |
| **Structured Field Reporting** | Provides a structured way to report *why* a message succeeded or failed in the field. | **Reduces misinformation** by filling meaning vacuums. |
| **Meaning Analytics Dashboard** | Shows which messages work best in which contexts across the organization/nation. | **Strengthens institutional credibility**. |

---

## III. Technical Architecture and Data Rationale

### A. Data Sovereignty (The Co-Founder's Question)

The data architecture is designed to manage sensitive government/health data while still enabling global learning.

| Data Tier | Storage Location | Ownership | Function |
|:---|:---|:---|:---|
| **Tier 1: Client Operational Data** | **Flexible:** Client's DB (Option A), Our Hosted Multi-Tenant DB (Option B), or Hybrid (Option C). | Client (Data Controller). | Raw activities, user data, sensitive field reports. |
| **Tier 2: Semiotic Intelligence Data** | **Always Our Database** (PostgreSQL + `pgvector`). | Our Platform (Proprietary IP). | Anonymized patterns (e.g., `IF-042`), ML training data, confidence scores. |
| **Tier 3: Platform Metadata** | Our Database. | Our Platform. | User authentication, configurations, audit logs. |

* **Federated Learning Rationale:** Our platform never stores the raw, sensitive data of large clients (Option A). It only extracts **anonymized, generalized patterns** and stores *those* in our central database, which trains the ML model. This respects client sovereignty while enabling network effects.

**Key Technical Decision:** PostgreSQL with `pgvector` extension enables efficient vector similarity search of semiotic patterns using BERT embeddings.

### B. Tech Stack and Development Approach

**Confirmed Stack:**
- **Frontend:** Vue 3 + Quasar (PWA for mobile-first, offline capability)
- **Backend:** Laravel 11 + PHP 8.3+ (Robust security, rapid API development)
- **Database:** PostgreSQL 16+ (JSONB support, `pgvector` extension)
- **ML/AI Layer:** Python 3.11+ + FastAPI (High-performance model serving)
- **Infrastructure:** Docker/Docker Compose (Dev), Kubernetes (Prod Phase 2)
- **Caching/Queues:** Redis 7+
- **Storage:** S3-compatible (MinIO/AWS)

**Why This Stack:**
- **Quasar/Laravel:** Provides robust, enterprise-grade, performant, and secure foundation while allowing rapid cross-platform deployment for field officers.
- **PostgreSQL + pgvector:** Critical for efficient vector similarity search of semiotic patterns.
- **Python/FastAPI:** Separates ML concerns from business logic, enables high-performance model serving.

**Development Approach:** Build towards the **MVP (Minimum Viable Product)** features (e.g., Rule-Based Semiotic Assessment) in Phase 1, deferring complex features (e.g., full ML pattern extraction, geo-mapping) until pilot data is secured and validated.

---

## IV. The Personal and Academic Track

### A. The Research Pathway (PhD)

* **PhD Topic:** Computational Disaster Semiotics.
* **Integration:** Your platform is the **research environment**; every activity generates training data, and the pilot's success validates the thesis.
* **Credibility:** The research track (academic papers, collaboration with LSHTM/RKI) gives you credibility that is essential for B2G sales and the Innovator Founder Visa.

**Academic Outputs (Phase 1):**
- 2-3 peer-reviewed publications
- Conference presentations
- Collaboration with LSHTM, University of Lagos, RKI

### B. Innovator Founder Visa Strategy

The disaster semiotics framing supports the visa application because it proves:

1. **Novel Innovation:** Disaster Semiotics + AI is genuinely novel.
2. **Scalable Business:** B2G SaaS with a global focus.
3. **UK Benefit:** Solves problems relevant to UK crises (e.g., social cohesion, NHS communication failures).

**Key Evidence:**
- UK-based company (CIC/LTG structure)
- UK pilot partner (UKHSA/Local Authority)
- Academic validation pathway
- Clear commercialization plan

### C. Your Personal Toolkit

* **Self-Study:** Focus on self-study (Chandler's "Semiotics for Beginners") now, and formal courses later. Your strength is *applied* semiotics, not pure theory.
* **"Internal Workbook" (Your Manual):** Highly recommended to capture simple explanations, complex concepts, real-world analogies, and a personal learning map. This is your private document to keep your thinking clear.

---

## V. Key Next Steps (Action Plan)

| Priority | Action | Rationale | Timeline |
|:---|:---|:---|:---|
| **1. Strategy** | Finalize Legal Structure (CIC/LTG recommended). | Required for grant applications and UK visa pathway. | Month 1 |
| **2. Funding** | Customize and submit the **Concept Note** to 2-3 target funders (UKRI, Wellcome, EU Horizon). | Secures Phase 1 capital for pilots and development. | Months 1-3 |
| **3. Partnerships** | Secure Letters of Intent from 3 pilot partners (UK, Nigeria, Germany). | Critical dependency for funding and visa endorsement. | Months 1-4 |
| **4. Technical** | Begin development environment setup based on the Technical Specification. | Start building the core organizational structure and initial pattern library. | Months 1-6 |
| **5. Academic** | Establish academic partnerships and supervisor agreements. | Required for PhD pathway and research validation. | Months 1-3 |

---

## VI. Decision-Making Framework

### A. The Theory of Change as North Star

**Every decision should be tested against the Theory of Change:**

1. Does this advance the core hypothesis? (Computational semiotic intelligence → Predict meaning breakdown → Prevent failures → Save lives)
2. Does this build the semiotic pattern database? (Our moat)
3. Does this respect data sovereignty? (Client trust)
4. Does this align with programme-first strategy? (Grant funding → Validation → Commercialization)

### B. Scope Creep Prevention

**Red Flags:**
- Features that don't directly serve Public Health crisis communication in Phase 1
- Integrations that don't build the semiotic pattern database
- Markets that distract from core validation (Phase 1)

**Green Lights:**
- Features that improve semiotic assessment accuracy
- Partnerships that provide pilot data
- Research outputs that validate the approach

### C. Feature Prioritization (MVP Focus)

**Must-Have (Phase 1):**
- Multi-tier organization management
- Activity planning & management
- Rule-based semiotic risk assessment
- Field reporting with effectiveness data
- Pattern database foundation

**Deferred (Phase 2+):**
- ML-powered pattern extraction (requires pilot data)
- Geographic mapping module
- Social media monitoring
- Advanced analytics
- Third-party integrations

---

## VII. Key Risks and Mitigation

| Risk | Impact | Mitigation Strategy |
|:---|:---|:---|
| **ML Models Fail to Predict Accurately** | High | Start with rule-based; extensive validation; human-in-the-loop design |
| **Pilot Partner Withdrawal** | High | Multiple pilots (diversification); strong relationship management |
| **Data Quality Issues** | High | Comprehensive field officer training; data validation checks |
| **Scope Creep** | Medium | Theory of Change as North Star; strict governance |
| **Ethical Risks (Manipulation/Privacy)** | Very High | Ethics board oversight; transparent AI; GDPR/NDPR compliance |
| **Funding Gaps** | High | Multiple funding sources; phased, lean approach |

---

## VIII. Success Metrics (Phase 1)

| Metric | Target | Measurement |
|:---|:---|:---|
| **Platform Uptime** | >99% | System monitoring |
| **Semiotic Patterns in DB** | 2,000+ by Month 24 | Database count |
| **Academic Publications** | 2-3 peer-reviewed papers | Publication records |
| **Communication Effectiveness** | 30-50% improvement | Pre/post comparison |
| **AI Prediction Accuracy** | >75% | Model validation metrics |
| **Pilot Deployments** | 3 successful pilots | Month 24 |

---

## IX. Document Maintenance

**This is a living document.** Update it when:
- Major strategic decisions are made
- Technical architecture changes
- New partnerships or markets are identified
- Key learnings from pilots emerge

**Review Cycle:** Quarterly, or after major milestones (funding secured, pilot completed, etc.)

---

## X. Quick Reference: Document Relationships

```
Theory of Change (North Star)
    ↓
Product Owner's Guide (This Document - Strategic Synthesis)
    ↓
    ├── Executive Summary (External Pitch)
    ├── Concept Note Template (Grant Applications)
    ├── Technical Architecture Document (Technical Foundation)
    ├── Product Requirements Document (Feature Specs)
    └── Technical Specification (Implementation Details)
```

**When to Use Each:**
- **Theory of Change:** Strategic alignment, decision validation
- **Product Owner's Guide:** Daily reference, onboarding, decision rationale
- **Executive Summary:** External pitches, investor meetings
- **Concept Note:** Grant applications (customize per funder)
- **Technical Architecture:** Technical co-founder briefing, data sovereignty discussions
- **PRD:** Development team, feature prioritization
- **Technical Specification:** Implementation, sprint planning

---

## Conclusion

This guide synthesises the strategic, theoretical, and technical foundation of the Crisis Communication Intelligence Platform. It should be your first reference when making decisions, onboarding team members, or explaining the project to stakeholders.

**Remember:** The Theory of Change is your North Star. This guide is your compass.

---

**Document Control:**
- **Version:** 1.0
- **Last Updated:** November 30, 2025
- **Next Review:** February 2026 (or after major milestone)
- **Owner:** Product Owner / Founder

