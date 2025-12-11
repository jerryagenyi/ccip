# CCIP Product Requirements Document (PRD)

Version: 2.1

Date: December 1, 2025

Status: Updated with Research Validation

Platform Name: CCIP – Crisis Communication Intelligence Platform

**Tagline:** Predictive Intelligence for Culturally-Resonant Crisis Communication



## Executive Summary

**What is CCIP?**

CCIP (Crisis Communication Intelligence Platform) is a **Crisis Communication Intelligence Platform** that combines organizational coordination infrastructure with **AI-powered semiotic analysis** to prevent communication failures during health crises.



**Core Innovation:** We don't just help organizations track activities—we **predict where health messages will fail** before they're deployed, enabling culturally-intelligent communication that saves lives.



**Strategic Positioning:** Programme-First (Grant-funded pilots) → Validated product → B2G SaaS commercialization.



## 1. Product Vision & Strategy

### 1.1 Long-Term Vision (5-10 years)

A world where crisis communication is semiotically intelligent by default.

### 1.2 Mission Statement

To prevent preventable deaths from communication failures by building the world's first computational disaster semiotics platform that predicts meaning breakdown before messages are deployed.

### 1.3 Success Metrics

* **Phase 1 (MVP - 18-24 months):** 30-50% improvement in communication effectiveness, 3 pilot deployments, 75%+ AI prediction accuracy, 2,000+ semiotic patterns in database.

* **Phase 2 (Scale - 3-5 years):** Thousands of lives saved (modeled), 10-15 organizations using platform, Industry standard emerging.

### 1.4 Competitive Positioning

Our **Moat:** Irreplicable semiotic pattern database that grows with every deployment through federated learning architecture. We are the only platform that is **predictive**, **semiotic**, and **systematically learning** across crisis contexts.

**Key Differentiation:**
- **Everbridge:** Crisis alerting & notifications—delivers messages quickly but doesn't analyze whether messages will be understood/acted upon
- **Noggin:** Resilience & incident management—integrated workspace with ISO templates and collaboration tools, but logistics focus with no meaning-making capability or cross-cultural learning
- **DHIS2:** Health data management—tracks outcomes but not causes, no communication analysis or predictive capability
- **CCIP:** Predictive semiotic assessment + organizational coordination + systematic cross-contextual learning



## 2. User Personas & Roles

### 2.1 Primary Personas

1.  **State Health Coordinator (Admin):** Focus on planning, approval, and coordination. **CCIP Help:** Semiotic risk assessment before launching campaigns, coordination across local departments.

2.  **Field Health Officer (User):** Focus on execution, local adaptation, and structured reporting. **CCIP Help:** Culturally-adapted message recommendations, offline-capable reporting, contributions feed system learning.

3.  **Federal Public Health Official (Super Admin):** Focus on national oversight, policy, and equitable outcomes. **CCIP Help:** National dashboard, cross-regional learning, evidence base for policy decisions.

4.  **Research Epidemiologist (Analyst):** Focus on academic study and policy advice. **CCIP Help:** Access to anonymized effectiveness data and semiotic pattern database.

### 2.2 Role-Based Access Control

| Role | Access Level | Key Functions |

|:---|:---|:---|

| **Super Admin** | Full system access | Manage organizations, national analytics, policy settings. |

| **State Admin** | Organization + children | Plan/approve activities, state analytics. |

| **LGA Officer** | Local activities only | Create/submit activities, field reporting, local team management. |

| **Data Analyst** | Read-only + export | View analytics, generate reports, export data. |

| **Field Officer** | Assigned activities | Execute activities, submit reports, upload evidence. |



## 3. MVP Feature Set (Phase 1: 18-24 months)

### 3.1 Core Features (Must-Have)

* **Feature 1: Multi-Tier Organization Management**

    * *Requirement:* Hierarchical organization tree (Federal → State → LGA/Local), role-based permissions, organization profiles.

    * *Technical Notes:* PostgreSQL adjacency list for hierarchy, Row-Level Security (RLS).

* **Feature 2: Activity Planning & Management**

    * *Requirement:* Activity creation workflow (Title, Type, Target Population, Planned Message), Draft/submit/approve workflow, Version history.

* **Feature 3: Semiotic Risk Assessment (Core Innovation)**

    * *Requirement:* **Phase 1 (MVP - Rule-Based):** Manual pattern matching, risk scoring, display predicted failure points, recommend adaptations.

    * *Acceptance Criteria:* Input message content + target context; receive risk assessment within 5 seconds; see 3-5 specific predicted failure points; get 3-5 actionable recommendations; view similar successful campaigns; user can apply recommendations (one-click). System must provide human-reviewable confidence scores with each prediction, enabling human-in-the-loop oversight consistent with EU AI Act transparency requirements.

    * *Phase 2 (Post-MVP):* ML-Powered prediction, confidence intervals, automated pattern extraction.

* **Feature 4: Field Reporting & Evidence Collection**

    * *Requirement:* Offline-capable report submission (PWA), capture communication effectiveness metrics (Understanding Score, Compliance, Barriers Encountered), evidence uploads (photos, documents), GPS location tagging.

    * *Critical:* Data captured here is the training data for the semiotic patterns.

* **Feature 5: Role-Based Dashboards**

    * *Requirement:* Role-specific overview (National metrics for Super Admin, activities pending approval for State Admin, assigned tasks for Field Officer).

* **Feature 6: Internal Communication System**

    * *Requirement:* One-on-one and group messaging (organization-based), real-time notifications.

* **Feature 7: Pattern Database (Foundation for Intelligence)**

    * *Requirement:* Storage schema for `SemioticPattern` (ID, Type, Context, Failed Element, Successful Alternative, Evidence), search/query capabilities, pattern validation workflow.



### 3.2 Feature Status Matrix (Prototype vs. Production)

| Feature | Prototype Status | Production Status | Implementation Path |
|---------|------------------|-------------------|-------------------|
| **Multi-Tier Organization Management** | ✅ Complete | ⚠️ Migrate from Figma | Vue + Quasar components from design system |
| **Activity Planning & Management** | ✅ Complete | ⚠️ Migrate from Figma | Enhanced with semiotic assessment UI |
| **Semiotic Risk Assessment** | ⚠️ Framework only | ❌ New Implementation | PostgreSQL + pgvector + Python/FastAPI |
| **Field Reporting & Evidence Collection** | ✅ Basic structure | ⚠️ Enhanced version | Add effectiveness metrics and pattern extraction |
| **Role-Based Dashboards** | ✅ Complete | ⚠️ Migrate from Figma | Vue components with real-time analytics |
| **Internal Communication System** | ✅ Complete | ⚠️ Migrate from Figma | Messaging and announcements modules |
| **Pattern Database** | ❌ Not applicable | ❌ New Implementation | Core production infrastructure |

### 3.3 Features Explicitly Excluded from MVP (Deferred to Phase 2)

* ❌ Geographic Mapping Module

* ❌ Social Media Monitoring / Infodemiology Pipeline

* ❌ ML-Powered Pattern Extraction (Requires pilot data)

* ❌ Advanced Analytics (Predictive Trends)

* ❌ Third-Party Integrations (DHIS2, Ushahidi)

* ❌ Multi-Language Interface (MVP is English interface with multilingual content support)



## 4. User Flows (Key Workflows)

* **Activity Planning Workflow:** State Admin inputs message → Clicks "Assess Semiotic Risk" → Applies recommendations → Submits/Activates → Field Officers see assigned task.

* **Field Reporting Workflow:** Field Officer executes activity → Submits report with effectiveness data (online/offline) → System extracts patterns (background job) → State Admin reviews report.

* **Cross-Organizational Learning Workflow:** Org A runs campaign, pattern is extracted and stored (anonymized) in Pattern DB → Org B runs similar campaign, receives prediction based on Org A's learning.



## 5. Non-Functional Requirements

| Metric | Target | Rationale |

|:---|:---|:---|

| **Performance (p95)** | API < 500ms; Assessment < 5s | Responsive user experience, low-bandwidth contexts (Nigeria). |

| **Security** | GDPR/NDPR compliant; RBAC; TLS 1.3; Audit Logging | Enterprise-grade security from day one. |

| **Scalability** | 100+ concurrent users (MVP); Horizontal scaling | Accommodate pilot growth and future B2G scaling. |

| **Usability** | Mobile-First (PWA); WCAG 2.1 AA compliant; Offline Capability | Accessibility and field-based work. |

| **Reliability** | 99.5% Uptime (MVP); Daily Backup; RTO < 4 hours | Crisis communication must be reliable. |
| **Regulatory Compliance** | EU AI Act "limited risk" classification | Minimize compliance burden; transparency-by-design |



## 6. Technical Requirements

* **Tech Stack:** Vue 3 + Quasar (Frontend), Laravel 11 + PostgreSQL (Backend), Python + FastAPI (ML/AI).

* **API Design:** RESTful, Versioned (`/api/v1/`), Consistent Error/Response Format.

* **Database Schema:** [See Technical Spec for detailed schema]

* **Infrastructure:** Docker Compose (Dev), Load Balancer/Auto-scaling (Prod Phase 2), S3-compatible storage.



## 7. Success Criteria & KPIs

| Metric | Target | Measurement |

|:---|:---|:---|

| **Product:** AI Prediction Accuracy | 75%+ | Validation against field outcomes. |

| **Business:** Pilot Deployments Complete | 3 successful pilots | Month 24. |

| **Impact:** Communication Improvement | 30-50% increase in compliance rates | Pre/post comparison. |



## 8. Risks & Mitigation

* **Risk:** Low field data quality. **Mitigation:** Comprehensive training, validation checks, incentives for quality reports.

* **Risk:** Pilot partner withdrawal. **Mitigation:** Multiple pilots, strong relationships.

* **Risk:** AI accuracy insufficient. **Mitigation:** Start rule-based, validate extensively, human-in-the-loop design.

* **Risk:** EU AI Act compliance evolution. **Mitigation:** Compliance flexibility in architecture; quarterly regulatory review; design for "limited risk" classification with transparency-by-design.



## 9. Development Roadmap

* **Phase 1 (Months 1-12):** Foundation (Auth, Org Mgmt), Core Features (Activity, Rule-Based Semiotic Assessment, Reporting), Pilot 1 & 2 Onboarding.

* **Phase 2 (Months 13-24):** Pilot 3 Active, ML model development/deployment (v1), Advanced Analytics, Research Paper Submission.



## 10. Dependencies & Assumptions

* **Dependencies:** Pilot partner commitments, Funding secured, Technical team.

* **Assumptions:** Semiotic patterns are learnable; Organizations will act on intelligence; Federated learning is legally/technically viable.



## 11. Appendices

A. Glossary

B. References (ToC v1.0, Tech Arch v1.0)

C. Change Log

