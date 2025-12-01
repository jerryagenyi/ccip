# Firebase Studio AI Prompt: CCIP Prototype Enhancement

**[DO NOT DELETE] - This prompt document guides prototype updates based on research validation.**

---

## Context & Background

You previously built a functional prototype (Next.js + Firebase) with organizational coordination features. The platform has been repositioned as **CCIP (Crisis Communication Intelligence Platform)** with **computational disaster semiotics** as its core innovation. Recent research validation confirms the approach and identifies specific enhancements needed.

**Platform Name:**
- **Name:** **CCIP (Crisis Communication Intelligence Platform)**
- **Tagline:** "Predictive Intelligence for Culturally-Resonant Crisis Communication"
- **Value Proposition:** "We predict where health messages will fail before deployment, enabling culturally-intelligent communication that saves lives."

**Key Evolution:**
- From: Organizational coordination platform
- To: Crisis Communication Intelligence Platform with predictive semiotic assessment

---

## Research-Validated Enhancements Required

Based on comprehensive research validation, the following updates are needed in the prototype:

### 1. Platform Rebranding (Critical)

**Update throughout the prototype:**
- Replace all instances of "RCAP" with "CCIP" (already done in this prompt)
- Replace "Risk Communication Activity Platform" with "Crisis Communication Intelligence Platform"
- Add tagline: "Predictive Intelligence for Culturally-Resonant Crisis Communication"
- Update landing page, navigation, headers, and documentation

**Branding Elements:**
- Platform name: **CCIP**
- Full name: **Crisis Communication Intelligence Platform**
- Tagline: **Predictive Intelligence for Culturally-Resonant Crisis Communication**
- Value proposition: "We predict where health messages will fail before deployment, enabling culturally-intelligent communication that saves lives."

---

### 2. Semiotic Risk Assessment Feature (Core Innovation)

**Location:** Activity Management Form → New Section: "Communication Strategy"

**Required Implementation:**

1. **New Form Section: "Communication Strategy"**
   - Add after "Logistics" section in Activity Create/Edit form
   - Include fields:
     - `plannedMessage.content` (large textarea)
     - `targetContext.region` (dropdown: Nigeria, UK, Germany, etc.)
     - `targetContext.language` (dropdown: English, Hausa, Yoruba, etc.)
     - `targetContext.culture` (text input: e.g., "Northern Nigeria, Muslim-majority")
     - `plannedMessage.messengers` (multi-select: Government Official, Community Leader, Religious Leader, Healthcare Worker)

2. **"Assess Semiotic Risk" Button**
   - Prominent button below Communication Strategy fields
   - Triggers assessment API call
   - Shows loading state during assessment

3. **Semiotic Assessment Display Component**
   - Display after assessment completes:
     - **Risk Score** (0-100, large number, color-coded: Green <30, Yellow 30-70, Red >70)
     - **Predicted Failures** (list of 3-5 specific failure points with explanations)
     - **Recommendations** (list of 3-5 actionable recommendations with "Apply" buttons)
     - **Confidence Score** (for transparency, per EU AI Act requirements)
     - **Similar Successful Campaigns** (link to view examples)

4. **Assessment Service (Firebase Cloud Function)**
   - Create function: `callSemioticAssessment`
   - **Temporary Logic (Rule-Based MVP):**
     - Query `semiotic_patterns` Firestore collection
     - Match patterns based on `targetContext` (region, language, culture)
     - Aggregate risk scores from matching patterns
     - Return assessment JSON with risk score, predicted failures, and recommendations
   - **Response Format:**
     ```json
     {
       "riskScore": 75,
       "confidence": 0.82,
       "predictedFailures": [
         {
           "element": "Individual framing",
           "issue": "Conflicts with communal norms",
           "probability": 0.85,
           "patternId": "IF-042"
         }
       ],
       "recommendations": [
         {
           "priority": "High",
           "suggestion": "Reframe as family protection",
           "expectedImprovement": 35
         }
       ]
     }
     ```

---

### 3. Semiotic Pattern Database (Firestore Collection)

**Create New Collection: `semiotic_patterns`**

**Document Structure:**
```typescript
{
  patternId: string,           // e.g., "IF-042"
  patternType: string,         // e.g., "framing_failure", "authority_mismatch"
  context: {
    region: string,            // e.g., "Northern Nigeria"
    language: string,          // e.g., "Hausa"
    culture: string            // e.g., "Muslim-majority, communal"
  },
  failedElement: string,       // e.g., "protect yourself"
  recommendation: string,      // e.g., "Reframe as family protection"
  riskScore: number,           // Base risk (0-100)
  confidence: number,          // 0.0-1.0
  evidence: {
    source: string,            // e.g., "Lassa Fever 2023"
    description: string
  },
  createdAt: Timestamp,
  validated: boolean
}
```

**Seed Data Required (Minimum 3-5 patterns):**

1. **Pattern IF-042: Individual Framing Failure**
   - Context: Northern Nigeria, Hausa, Muslim-majority communal
   - Failed Element: "Protect yourself" messaging
   - Recommendation: "Reframe as family/community protection"
   - Risk Score: 85
   - Evidence: COVID-19 vaccine hesitancy research

2. **Pattern AT-001: Authority Mismatch**
   - Context: Northern Nigeria, Hausa, Muslim-majority
   - Failed Element: Government official as messenger
   - Recommendation: "Route through local imam or community leader"
   - Risk Score: 70
   - Evidence: Field research on trust structures

3. **Pattern TT-015: Technical Terminology Failure**
   - Context: General, multiple languages
   - Failed Element: Medical jargon without explanation
   - Recommendation: "Use culturally-appropriate metaphors"
   - Risk Score: 60
   - Evidence: Cross-cultural communication research

---

### 4. Enhanced Activity Data Model

**Update `activities` Collection Schema:**

Add new fields:
```typescript
{
  // ... existing fields ...
  
  targetContext: {
    region: string,
    language: string,
    culture: string
  },
  
  plannedMessage: {
    content: string,
    channels: string[],
    messengers: string[]
  },
  
  semioticRiskScore: number,        // Last calculated (0-100)
  semioticAssessment: {
    assessedAt: Timestamp,
    riskScore: number,
    confidence: number,
    predictedFailures: any[],
    recommendations: any[],
    appliedRecommendations: string[]  // Track which were used
  }
}
```

---

### 5. Enhanced Field Reporting Schema

**Update `field_reports` Collection:**

Add effectiveness metrics:
```typescript
{
  // ... existing fields ...
  
  communicationEffectiveness: {
    understandingScore: number,      // 1-10 scale
    complianceRate: number,          // Percentage
    barriersEncountered: string[],  // e.g., ["religious objections", "cultural conflict"]
    messageResonance: "high" | "medium" | "low",
    culturalAlignment: number        // 1-10 scale
  },
  
  semioticValidation: {
    predictedFailuresValidated: boolean[],
    recommendationsUsed: string[],
    actualOutcome: "success" | "partial" | "failure"
  }
}
```

**Critical:** This data is the training data for future ML models. Ensure structured capture.

---

### 6. UI/UX Enhancements

**Activity Management Form:**
- Add "Communication Strategy" section with clear visual separation
- Make "Assess Semiotic Risk" button prominent (primary color, large)
- Display assessment results in expandable card with clear visual hierarchy
- Show risk score prominently with color coding
- Make recommendations actionable with one-click "Apply" buttons

**Dashboard Updates:**
- Add "Semiotic Risk Overview" widget showing:
  - Activities with high risk scores
  - Recent assessments
  - Pattern database size
- Update terminology: "Activities" → "Campaigns" (more appropriate for communication context)

**Branding Updates:**
- Update all page titles and headers
- Update navigation labels
- Update footer and about sections
- Ensure consistent use of "CCIP" and tagline

---

### 7. Regulatory Compliance Considerations

**EU AI Act Alignment:**
- Add transparency notice: "AI-powered assessment for informational purposes. Human review recommended."
- Display confidence scores prominently
- Include "Human Review" checkbox before finalizing activity
- Add audit log entry for each assessment

**Implementation:**
- Add `assessmentAuditLog` subcollection to track:
  - Who requested assessment
  - When
  - Input context
  - Output recommendations
  - Whether recommendations were applied

---

## Implementation Priority

**Phase 1 (Immediate - MVP):**
1. ✅ Platform rebranding (RCAP → CCIP) - Update all UI, documentation, and code references
2. ✅ Semiotic Pattern Database creation and seed data
3. ✅ Communication Strategy section in Activity form
4. ✅ Basic rule-based assessment function
5. ✅ Assessment display component

**Phase 2 (Enhancement):**
6. Enhanced field reporting with effectiveness metrics
7. Dashboard widgets for semiotic insights
8. Audit logging for assessments
9. Pattern validation workflow

---

## Technical Implementation Notes

**Firebase Cloud Function Structure:**
```typescript
// functions/src/semioticAssessment.ts
export const callSemioticAssessment = functions.https.onCall(async (data, context) => {
  // Validate input
  const { message, targetContext } = data;
  
  // Query semiotic_patterns collection
  const patternsRef = admin.firestore().collection('semiotic_patterns');
  const matchingPatterns = await patternsRef
    .where('context.region', '==', targetContext.region)
    .where('context.language', '==', targetContext.language)
    .get();
  
  // Aggregate risk scores and generate recommendations
  // Return assessment object
});
```

**Frontend Component Structure:**
```typescript
// components/SemioticAssessmentDisplay.tsx
- Props: assessment result
- Displays: Risk score, failures, recommendations
- Actions: Apply recommendation, view similar campaigns
```

---

## Testing Requirements

**User Acceptance Criteria:**
- User can input message and context
- User receives assessment within 5 seconds
- User sees 3-5 specific predicted failure points
- User gets 3-5 actionable recommendations
- User can apply recommendations with one click
- Assessment results are saved with activity

**Data Quality:**
- Pattern database has minimum 3-5 validated patterns
- Assessment function handles edge cases (no matching patterns, etc.)
- Error handling for API failures

---

## Success Metrics

**Prototype Validation:**
- Users can successfully assess semiotic risk for activities
- Assessment recommendations are understandable and actionable
- Field officers can report effectiveness data
- Pattern database grows with validated patterns

**UX Validation:**
- Users understand the semiotic assessment concept
- Workflow feels natural and integrated
- Recommendations are perceived as valuable
- No confusion about platform purpose (coordination + intelligence)

---

## Important Notes

1. **This is MVP/Prototype:** Rule-based assessment is sufficient. ML-powered version comes in production build.

2. **Focus on UX Validation:** The prototype's primary purpose is to validate that users understand and value semiotic intelligence, not to build production ML.

3. **Data Collection:** Enhanced field reporting is critical—this data will train future ML models.

4. **Brand Consistency:** Ensure CCIP name and tagline are used consistently throughout.

5. **Theoretical Foundation:** Consider adding tooltip or help text referencing "Semiotic Cultural Psychology Theory" for academic credibility (optional, but strengthens positioning).

---

**Expected Outcome:** A prototype that demonstrates the full CCIP vision—organizational coordination enhanced with predictive semiotic intelligence—validating both the concept and user experience before production build from Figma designs.

