---
stepsCompleted: [1, 2]
inputDocuments:
  - file: _bmad-output/planning-artifacts/prd.md
    type: prd
    loaded: true
  - file: docs/research/ccip-research-foundation.md
    type: research
    loaded: true
  - file: docs/epics/epic-001-user-organisation-management.md
    type: epic
    loaded: true
  - file: _bmad-output/planning-artifacts/ux-design.md
    type: ux-legacy
    loaded: true
workflowType: 'ux-design'
lastStep: 0
project_name: 'ccip'
user_name: 'Jerry'
date: '2025-12-25'
---

# UX Design Specification ccip

**Author:** Jerry
**Date:** 2025-12-25

---


## Executive Summary

### Project Vision

CCIP (Crisis Communication Intelligence Platform) is a predictive intelligence platform for culturally-resonant crisis communication in public health contexts. The core innovation is **AI-powered semiotic analysis** that predicts where health messages will fail BEFORE deployment, enabling culturally-intelligent communication that saves lives.

Unlike competitors (Everbridge, Noggin, DHIS2) that focus on rapid message delivery or logistics coordination, CCIP optimizes **message effectiveness** through computational disaster semiotics—understanding how meaning is made across different cultural contexts and predicting semiotic breakdown before it occurs.

The platform follows a **programme-first strategy**: grant-funded pilots → validated product → B2G SaaS commercialization, with a federated learning architecture that grows smarter with each deployment while respecting data sovereignty.

### Target Users

| User Role | Level | Primary Goals | UX Needs |
|-----------|-------|---------------|----------|
| **Federal Public Health Official** | Super Admin | National oversight, policy decisions, equitable outcomes | National dashboard, cross-regional learning analytics, evidence base for policy |
| **State Health Coordinator** | Admin | Planning, approval, coordination across departments | Semiotic risk assessment before campaigns, coordination views, state-level analytics |
| **Field Health Officer** | User | Execution, local adaptation, structured reporting | Culturally-adapted message recommendations, offline-capable reporting, mobile-optimized workflows |
| **Research Epidemiologist** | Analyst | Academic study, policy advice | Access to anonymized effectiveness data, semiotic pattern database exploration |

**User Context Insights:**
- **Tech-savviness:** Field officers are primarily researchers, **not tech-savvy**—fiddling with technology is not on their todo list
- **Devices:** Smartphones, tablets, and desktops/laptops—responsive design critical
- **Usage locations:** Both **in the field** (offline data collection) and **in the office** (planning, coordination, analytics)

**Context:** Users work primarily in African health contexts with **low-bandwidth environments**. Field officers need offline-first PWA capabilities, while administrators need real-time dashboards and coordination tools.

### Key Design Challenges

1. **Offline-First Mobile Experience**
   - Field officers work in areas with poor or no connectivity
   - Forms (activity reports, evidence uploads, effectiveness metrics) must work identically online/offline
   - Sync status must be clear; conflict resolution intuitive
   - IndexedDB storage for reports, attachments, user preferences

2. **Complex Semiotic Assessment Communication**
   - Risk scores, confidence intervals, predicted failure points, and recommendations must be presented clearly
   - Human-in-the-loop design for EU AI Act compliance ("limited risk" classification)
   - One-click "Apply Recommendation" actions for rapid message adaptation
   - Color-coded visual feedback (red=high risk, orange=moderate, green=low risk)

3. **Multi-Role Hierarchical Experience**
   - 4 distinct user types with different permissions and workflows
   - Organization hierarchy (Federal → State → LGA) affects data visibility
   - Clear role-based navigation without overwhelming users with irrelevant options
   - Role switcher in prototype demonstrates need for multi-context views

4. **Effectiveness Metrics Capture**
   - Understanding Score (1-5), Compliance Score (1-5), Barriers Encountered
   - Must capture training data for ML without burdening field officers
   - Slider/star input with color feedback; tag input for barriers
   - Visual indicators when additional detail required (e.g., barriers if score < 3)

5. **Non-Tech-Savvy Field Users**
   - Field officers are researchers, not technologists—**simplicity is paramount**
   - Minimize fiddling with UI controls; focus on core data capture tasks
   - Clear, predictable workflows with minimal decision points
   - Touch-friendly interfaces that work reliably on various devices

6. **Fragmentation & Silos Problem**
   - Current crisis communication suffers from **fragmentation, lack of data insight, no history/knowledge management**
   - Too much work done in silos without cross-organizational learning
   - UX must address: unified activity view, historical context, campaign learning
   - Federated learning must be surfaced as visible benefit, not hidden infrastructure

### Design Opportunities

1. **Visual Risk Intelligence**
   - Color-coded risk scoring with clear call-to-action buttons
   - "Apply Recommendation" one-click actions for rapid message improvement
   - Confidence scores displayed transparently (EU AI Act alignment)
   - Similar successful campaigns shown for pattern learning

2. **Offline Sync Patterns**
   - Visual sync status indicator in header (online/syncing/offline)
   - Optimistic UI updates: show success immediately, sync in background
   - Conflict resolution dialog: "Keep my changes / Use server version / Merge manually"
   - Pending reports counter with manual "Sync Now" option

3. **Cross-Organizational Learning**
   - "Similar campaigns" section showing what worked in comparable contexts
   - Pattern database insights integrated into activity creation flow
   - Anonymized effectiveness data sharing across organizations
   - Federated learning enables network effects while preserving data sovereignty

4. **Mobile-First Field Reporting**
   - Star ratings and sliders for effectiveness metrics (touch-friendly)
   - Tag-based barrier selection with add/remove functionality
   - GPS location capture with "Use current location" one-tap action
   - Photo/document uploads with progress indicators for large files

5. **Historical Context & Knowledge Management**
   - Campaign history view showing past activities, outcomes, and lessons learned
   - "What worked before" suggestions based on historical patterns
   - Organization-level knowledge base that accumulates over time
   - Search across past campaigns by topic, location, effectiveness

6. **Data Insight & Analytics**
   - Easy-to-understand dashboards showing communication effectiveness trends
   - Visual comparisons: "This campaign vs. similar past campaigns"
   - Clear metrics that answer: "Did this work? Why? How can we improve?"
   - Export capabilities for reporting to stakeholders

---

## Research Task: Market Gap Analysis

A comprehensive research hypothesis and market gap analysis has been documented in:
**`_bmad-output/planning-artifacts/ccip-research-hypothesis.md`**

This document includes:
1. **All agent questions** from the multi-agent discussion (Sally, Mary, John)
2. **User assumptions** organized for validation/invalidation (Problem Space, Solution Needs, CCIP Idea Evolution, User Background)
3. **Market gap insights** from all three agents
4. **Formulated research hypotheses** (H1-H5) with testing plans
5. **Next steps** for validation

### Key Hypotheses Formulated

| Hypothesis | Focus | Success Metric |
|------------|-------|----------------|
| **H1** | Market Gap: 3 unaddressed needs (semiotic prediction, federated learning, offline-first for non-tech-savvy users) | 80% of interviewees confirm all 3 gaps |
| **H2** | Semiotic AI can predict message failure with ≥70% accuracy | ≥70% prediction accuracy on test set |
| **H3** | Federated learning improves campaign effectiveness by +20% | +20% compliance in federated vs. isolated |
| **H4** | Offline-first PWA achieves ≥80% task completion vs. 40% for existing tools | ≥80% task completion rate |
| **H5** | Programme-first model achieves faster market penetration than B2B SaaS | 3+ pilot-to-SaaS conversions in Year 1 |

### CCIP Idea Evolution (Documented for Validation)

1. **Stage 1:** Coordination platform for tracking activities at national/regional/global levels
2. **Stage 2:** Templates + AI-powered support for intelligent campaigns (e.g., rumor vs. disease spread)
3. **Stage 3:** Semiotic intelligence to predict message effectiveness, track impact, preempt failures

**Validation Status:** These are assumptions based on Jerry's experience as a health communication expert. No peer-reviewed research validation exists yet. This is the primary research gap to be addressed.

---

**Next Actions:**
1. Conduct market gap research using the research workflow
2. Validate assumptions through user interviews and competitive analysis
3. Update this UX specification based on research findings

<!-- Party Mode discussion completed - Research hypothesis documented -->

