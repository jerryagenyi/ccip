# Technical Architecture Document

## CCIP: Crisis Communication Intelligence Platform

**Tagline:** Predictive Intelligence for Culturally-Resonant Crisis Communication

Version: 1.1

Date: December 1, 2025

Status: Updated with Research Validation

Audience: Technical co-founder, development team, data protection authorities, technical partners



## Executive Summary

This document defines the technical architecture for the Crisis Communication Intelligence Platform—a system that combines organizational coordination infrastructure with AI-powered semiotic analysis to prevent communication failures during health crises.

* **Core architectural principles:** Data sovereignty by design, Federated learning architecture, Security-first approach, Scalable foundation.

* **Tech Stack:** Vue 3 + Quasar (Frontend), Laravel 11 + PostgreSQL (Backend), Python + FastAPI (ML/AI Layer).



## 1. System Overview

### 1.1 High-Level Architecture

[Diagram described in the system output: CLIENT LAYER (Vue/Quasar) → APPLICATION LAYER (Laravel API Gateway) → ML/AI LAYER (Python FastAPI) → DATA LAYER (Flexible Storage + Proprietary Semiotic DB)]



### 1.2 Technology Stack

| Component | Technology | Version | Purpose |

|:---|:---|:---|:---|

| **Frontend** | Vue 3 + Quasar | 3.4+ / 2.14+ | Cross-platform PWA (web/mobile), modern reactive UI. |

| **Backend** | Laravel | 11.x | Robust security, rapid API development, business logic. |

| **Database** | PostgreSQL | 16+ | Primary store, JSONB support, `pgvector` for semiotic patterns. |

| **ML/AI** | Python + FastAPI | 3.11+ / 0.109+ | High-performance model serving, ML library ecosystem. |

| **Caching/Queue** | Redis | 7+ | Performance, session management, Laravel queues. |

| **Storage** | S3-compatible (MinIO/AWS) | - | Secure, scalable media/evidence storage. |

| **Authentication** | JWT (via Sanctum/Passport) | - | Stateless API authentication. |



## 2. Data Architecture & Sovereignty

### 2.1 The Data Management Challenge

Government agencies (WHO, NCDC) have strict requirements for **data sovereignty** (where data is stored, who controls access). Our solution must enable network effects (learning from all data) without violating sovereignty (centralizing sensitive data).

### 2.2 Three-Tier Data Architecture

* **TIER 1: CLIENT OPERATIONAL DATA (Sensitive, Organization-Owned)**

    * *Includes:* User identities, activity locations, identifiable field reports.

    * *Storage Options (Client Chooses):*

        * **Option A (Client-Managed):** Client hosts database, we query via secure API (Maximum sovereignty).

        * **Option B (Platform-Managed):** We host in a secure, multi-tenant database (Faster deployment, multi-tenancy RLS).

        * **Option C (Hybrid/Federated):** Sensitive data stays with client, non-sensitive metadata is hosted by us.

* **TIER 2: SEMIOTIC INTELLIGENCE DATA (Our Proprietary Database)**

    * *Always stored in our systems (PostgreSQL + pgvector).*

    * *Includes:* Anonymized semiotic patterns (e.g., `IF-042: Individual framing failure in communal context`), ML training data, aggregated effectiveness metrics.

    * ***This is our Moat:*** No personally identifiable information (PII) is stored here, only the generalized patterns that power the AI.

* **TIER 3: PLATFORM METADATA**

    * *Includes:* Hashed passwords, organization configurations, audit logs.



### 2.3 Federated Learning & Data Flow

1.  **Message Planning:** User inputs message/context → Platform sends to ML Service. ML Service queries **Tier 2** (Pattern DB) → Returns prediction. (PII is never involved).

2.  **Field Reporting:** Field Officer submits report (contains PII) → Operational data stored in **Tier 1** (client's choice).

3.  **Pattern Extraction (Background Job):** Report data runs through **Anonymization Pipeline** → Generalized pattern (e.g., `IF-042` validation) extracted → Pattern added to **Tier 2**. (Raw data is not stored in Tier 2).

4.  **Cross-Organizational Learning:** All clients benefit from the continually improved **Tier 2** pattern database without seeing each other's raw data.



## 3. Database Design

### 3.1 Core Schema (PostgreSQL 16+)

* `organizations` (Hierarchical tree via `parent_id`)

* `users` (Role-based access control, linked to `organizations`)

* `activities` (Includes `target_population` (JSONB) and `semiotic_assessment` (JSONB))

* `field_reports` (Includes `message_understanding_score`, `barriers_encountered` (JSONB), **critical for learning**)

* `semiotic_patterns` (Core IP: `feature_vector` (VECTOR(768)) for similarity search, `context` (JSONB), `failed_element` (JSONB), `evidence` (JSONB))

* `audit_logs` (Accountability, compliance)



## 4. ML/AI Architecture

### 4.1 ML Service Design

* **Service:** Python + FastAPI (high-performance API server).

* **Endpoint:** `POST /semiotic/assess`

* **Functionality:**

    1.  **Message Encoding:** Consider leveraging multilingual medical corpus (MMedC) and Medical mT5 architecture as foundation for domain adaptation rather than general-purpose BERT. Use multilingual BERT embeddings for semantic understanding with cultural prompting methodology for context-aware recommendations.

    2.  **Pattern Matching:** Use `pgvector` in PostgreSQL for vector similarity search of the message embedding against the Pattern DB.

    3.  **Risk Prediction:** Ensemble model (Neural Network + Rule-based logic) combines pattern matches, message features (e.g., metaphor density), and context features (e.g., historical trust index) to generate a **Risk Score (0-100)**. Implement cultural prompting methodology for context-aware recommendations, as validated by research on cultural alignment in LLMs.

    4.  **Recommendation Generation:** Returns specific, validated adaptations from the Pattern DB.



### 4.2 Training Pipeline

* Scheduled nightly job (via Laravel Queues/Horizon).

* Fetches anonymized/validated `field_reports` data.

* Retrains `SemioticRiskPredictor` model.

* **Accuracy threshold:** Minimum 75% validation accuracy before production deployment. Human-in-the-loop mandatory for recommendations below 70% confidence threshold.

* Deploys new model (if accuracy threshold > 75% met) via MLflow/Torch.



## 5. Security Architecture

* **Authentication:** JWT tokens (short-lived access + long-lived refresh) via Laravel.

* **Authorization:** Role-Based Access Control (RBAC) + Laravel Policies + **Row-Level Security (RLS)** in PostgreSQL (ensures data isolation for Option B clients).

* **Encryption:** TLS 1.3 in transit, TDE/AES-256 at rest, HashiCorp Vault for key management.

* **Vulnerabilities:** Input validation (prevents SQLi, XSS), Rate Limiting (DoS/Brute Force protection), Regular SAST/DAST scans (Trivy, Composer Audit).

### 5.6 Regulatory Compliance Architecture

* **EU AI Act Classification:** Design for "limited risk" category with transparency obligations rather than "high-risk" requiring extensive compliance.

* **Explainable AI Features:** Implement human-reviewable recommendations with confidence scores and reasoning explanations for all AI-generated assessments.

* **Audit Trail:** Maintain comprehensive audit trail for all AI-generated recommendations per GDPR/NDPR requirements, including timestamp, user, input context, and output reasoning.

* **Compliance Flexibility:** Build architecture with compliance flexibility to adapt to evolving EU AI Act guidance and regulatory updates. Quarterly regulatory review process.



## 6. Scalability & Performance

* **Phase 1 (MVP):** Simple, single-server setup.

* **Phase 2 (Scale):** Load balancing, horizontal scaling of Laravel/FastAPI servers, Primary/Read replicas for PostgreSQL, dedicated Redis cluster.

* **Performance Targets:** Semiotic Assessment < 5 seconds, API Response p95 < 500ms.

* **Optimization:** Materialized Views for dashboards, Multi-level caching (Redis, CDN), Indexing (`GIN`, `pgvector`).



## 7. Development Workflow

### 7.1 Design-to-Code Development Process

* **Phase 1 - Prototype Validation (Next.js + Firebase):**
  - Build functional prototype in Firebase Studio to validate UX flows and semiotic intelligence features
  - Collect user feedback and optimize experience before production development
  - **Git Flow:** `prototype` → `staging` → `feature` branches in Firebase repository

* **Phase 2 - Design System (Figma):**
  - Convert validated prototype into comprehensive design system and component library
  - Create Vue/Quasar-compatible specifications with semiotic assessment patterns
  - **Design Versioning:** Figma version control synchronized with development milestones

* **Phase 3 - Production Build (Vue + Quasar + Laravel):**
  - Build production system from Figma specifications (not migrating Next.js code)
  - Implement PostgreSQL + pgvector for semiotic pattern database and Python/FastAPI ML services
  - **Git Flow:** `main` → `staging` → `develop` → `feature` branches in production repository

### 7.2 CI/CD Pipeline

* **Automated Testing:** PHPUnit (backend), Jest (frontend), Cypress (E2E) for production code
* **Automated Deployment:** GitHub Actions with staging and production environments
* **Quality Gates:** Code coverage (>80%), security scans (SAST/DAST), performance benchmarks

### 7.3 Monitoring & Observability

* **Structured Logging:** Laravel logs with correlation IDs for debugging semiotic assessments
* **Error Tracking:** Sentry integration for real-time error detection and alerting
* **Performance Metrics:** Datadog/Prometheus for API response times, ML service latency, database performance
* **User Analytics:** Semiotic assessment accuracy and user interaction patterns (anonymized)



---



## 8. Document Control & Next Steps

**Approvals:** [To be completed by Founder, Technical Co-founder, Security Advisor]

**Related Documents:** Theory of Change (v1.0), Executive Summary (v1.0), Product Requirements Document (v2.0).



*Next Step:* Use this document to brief the technical co-founder, address the data sovereignty concerns, and begin breaking down the MVP features into development sprints.

