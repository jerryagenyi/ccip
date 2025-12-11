# CCIP Technical Specification Document

Version: 2.1

Date: December 1, 2025

Status: Updated with Research Validation

Platform: CCIP (Crisis Communication Intelligence Platform)

**Tagline:** Predictive Intelligence for Culturally-Resonant Crisis Communication



## Executive Summary

This document specifies the technical architecture, design patterns, and implementation details for CCIP.

* **Key Technical Decisions:** Federated Learning Architecture, Flexible Data Tier System (Client/Platform/Hybrid), Security-First Design, Vue/Quasar/Laravel/PostgreSQL/Python stack.

* **Innovation Focus:** Detailed schema for `semiotic_patterns` using PostgreSQL's `pgvector` extension.



## 1. System Architecture Overview

### 1.1 High-Level Architecture

[Diagram described in the system output: CLIENT LAYER → APPLICATION LAYER (Laravel API Gateway) → ML/AI LAYER (Python FastAPI) → DATA LAYER (Flexible Storage + Proprietary Semiotic DB)]



### 1.2 Architecture Principles

Separation of Concerns, API-First, Data Sovereignty, Federated Learning, Security by Design, Offline-First (PWA).

### 1.3 Design-to-Code Development Phases

**Phase 1 - Prototype Validation (Next.js + Firebase):**
- Functional prototype built in Firebase Studio for UX validation
- Tests semiotic intelligence features with real users
- Collects feedback and optimizes user experience
- **Repository:** `ccip-firebase` (Next.js prototype)

**Phase 2 - Design System Conversion (Figma):**
- Convert validated prototype into comprehensive design system
- Create Vue/Quasar-compatible component library
- Design semiotic assessment UI patterns for production
- **Output:** Component specifications for Vue implementation

**Phase 3 - Production Build (Vue + Quasar + Laravel):**
- Build production system from Figma specifications
- Implement PostgreSQL + pgvector for semiotic pattern database
- Deploy Python/FastAPI ML services for advanced analysis
- **Repository:** `ccip-production` (Vue + Laravel + Python stack)



## 2. Technology Stack

| Component | Technology | Version | Key Libraries |

|:---|:---|:---|:---|

| **Frontend** | Vue.js | 3.4+ | Quasar, Pinia, Vue Router |

| **Backend** | Laravel | 11.x | Sanctum/Passport, Spatie Permissions, Laravel Horizon |

| **Database** | PostgreSQL | 16+ | **pgvector** extension, JSONB |

| **ML/AI** | Python | 3.11+ | FastAPI, TensorFlow/PyTorch, scikit-learn, spaCy, Sentence Transformers |

| **Infrastructure** | Docker | - | Docker Compose (Dev), Kubernetes (Prod Phase 2), MinIO/S3 |



## 3. Database Design

### 3.1 Core Schema (PostgreSQL with RLS)

* **`organizations`:** Hierarchical structure (`parent_id`).

* **`users`:** Linked to `organizations`, `role` field (for RBAC).

* **`activities`:** Central table for campaigns, includes `target_population` (JSONB) and `semiotic_assessment` (JSONB).

* **`field_reports`:** **Critical for learning**; includes structured effectiveness data, `barriers_encountered` (JSONB).

* **`semiotic_patterns` (The Moat):**

    ```sql

    -- CRITICAL: pgvector extension for similarity search

    CREATE EXTENSION IF NOT EXISTS vector; 

    CREATE TABLE semiotic_patterns (

        ...

        feature_vector VECTOR(768), -- For similarity search (BERT embeddings)

        context JSONB NOT NULL,     -- Generalized context parameters

        ...

    );

    CREATE INDEX idx_pattern_vector ON semiotic_patterns USING ivfflat (feature_vector vector_cosine_ops);

    ```

* **`audit_logs`:** Tracks all state-changing actions (`user_id`, `action`, `resource_type`, `changes` (JSONB)).



### 3.2 Multi-Tenancy Strategy

* **Approach:** Row-Level Security (RLS) enabled on all operational tables (`activities`, `field_reports`, etc.).

* **Policy:** Users only see data belonging to their organization or its descendants (enforced via recursive query in RLS policy).



## 4. API Design

### 4.1 RESTful Endpoints (Key Features)

* **Authentication:** `POST /auth/login`, `POST /auth/refresh`

* **Activities:** `GET /activities`, `POST /activities`, `POST /activities/{id}/approve`

* **Semiotic Assessment (CORE):**

    * `POST /semiotic/assess` (Takes message + context, returns risk score + recommendations)

    * `GET /semiotic/patterns` (Search pattern database)

* **Field Reports:** `POST /reports` (Submission of effectiveness data, supports media upload)

* **Analytics:** `GET /analytics/effectiveness`, `POST /analytics/export`



### 4.2 Semiotic Assessment API (Detailed)

* **Request:** Includes `message` (content, channel, messenger) and `target_context` (region, language, culture, trust level).

* **Response:** Includes `risk_score` (0-100), `predicted_failures` (element, issue, probability, pattern\_id), and `recommendations` (priority, suggestion, expected\_improvement).



## 5. Security Implementation

* **Authentication:** JWT with short access/long refresh tokens.

* **Authorization:** RBAC via `role` field + Laravel Policies for business logic + RLS for data isolation.

* **Encryption:** TLS 1.3 in transit, TDE/AES-256 at rest.

* **Key Management:** HashiCorp Vault for key rotation.

* **Vulnerability Protection:** Full input validation, CSRF protection, SQLi prevention (Eloquent ORM), Rate Limiting.



## 6. Performance Optimization

* **Caching:** Multi-level (Browser, Redis Application Cache, Query Result Cache).

* **Database:** Use of `Materialized Views` for dashboard aggregations, extensive indexing (e.g., covering indexes, partial indexes).

* **Frontend:** Code splitting, lazy loading, virtual scrolling.



## 7. Development Workflow

* **Git:** Standard Git Flow.

* **CI/CD:** GitHub Actions for automated unit tests, feature tests, and deployment to staging/production environments.

* **Testing:** Comprehensive plan covering Unit (PHPUnit/Vitest), Integration, E2E (Cypress), and **Load Testing (k6)**.



## 8. ML/AI Implementation

* **Service:** Python/FastAPI separates ML from business logic.

* **Model:** Ensemble approach (`SemioticRiskPredictor`) combining neural network embedding (BERT) and rule-based pattern matching.

* **Pipeline:** Scheduled training fetches anonymized `training_examples` (from field reports), updates embeddings, and retrains the model artifact.



## 9. Deployment Architecture

* **Development:** `docker-compose.yml` for local environment (frontend, backend, ML, postgres, redis, minio).

* **Production:** Load balanced deployment (e.g., Kubernetes) for horizontal scaling.



## 10. Document Control & Next Steps

**Approvals Needed:** Technical Co-founder, Security Advisor.

**Next Steps:** Begin development environment setup and core database schema implementation.

