# BMAD Quick Start for CivicTech Operations

**Quick reference for using BMAD agents and workflows in your civictech organization.**

---

## 🎯 Agent → Function Quick Map

| Agent | Primary Use | CivicTech Application |
|-------|------------|---------------------|
| **Research Agent** | Research & Intelligence | Market research, policy analysis, competitive intelligence |
| **Analyst Agent (Mary)** | Strategic Analysis | Opportunity analysis, risk assessment, decision support |
| **PM Agent** | Product & Program Management | Product planning, roadmaps, stakeholder alignment |
| **Architect Agent** | Technical Strategy | System design, technology selection, technical roadmaps |
| **Dev Agent** | Implementation | Feature development, code quality, problem solving |
| **UX Designer Agent** | User Experience | User research, design systems, accessibility |
| **Tech Writer Agent** | Documentation | User docs, stakeholder reports, grant proposals |

---

## 🔄 Common Workflow Patterns

### Pattern 1: Strategic Research & Analysis
```
Research Agent (research workflow)
  → Analyst Agent (brainstorm-project workflow)
  → PM Agent (create-product-brief)
  → Output: Strategic recommendations
```

### Pattern 2: Product Development
```
PM Agent (create-prd)
  → Architect Agent (create-architecture)
  → PM Agent (create-epics-stories)
  → Dev Agent (dev-story)
  → Output: Implemented feature
```

### Pattern 3: Grant Proposal
```
Research Agent (research funder, domain)
  → Analyst Agent (analyze fit, opportunity)
  → PM Agent (create-product-brief)
  → Tech Writer (write proposal)
  → Output: Grant proposal package
```

### Pattern 4: Strategic Planning
```
Research Agent (market, policy, trends)
  → Brainstorm Workflow (generate options)
  → Analyst Agent (analyze options)
  → PM Agent (create roadmap)
  → Output: Strategic plan
```

---

## 📋 Common Tasks → Workflow Mapping

| Task | Workflow(s) | Agent(s) |
|------|------------|---------|
| Research market opportunity | `research` | Research Agent |
| Analyze strategic options | `brainstorm-project` | Analyst Agent |
| Plan new product/feature | `create-product-brief` → `create-prd` | PM Agent |
| Design system architecture | `create-architecture` | Architect Agent |
| Plan implementation | `create-epics-stories` | PM Agent |
| Develop feature | `dev-story` | Dev Agent |
| Write grant proposal | Custom workflow | Research + Analyst + Tech Writer |
| Create stakeholder report | `document-project` | Tech Writer |
| Review code quality | `code-review` | TEA Agent |
| Plan sprint | `sprint-planning` | SM Agent |
| Measure impact | Custom workflow | Analyst + Tech Writer |

---

## 🚀 Getting Started Checklist

### Week 1: Setup
- [ ] Review `BMAD-CIVICTECH-STRATEGY.md`
- [ ] Create domain context files:
  - [ ] `.bmad/bmm/data/civictech-context.md`
  - [ ] `.bmad/bmm/data/public-health-context.md`
  - [ ] `.bmad/bmm/data/nonprofit-context.md`
- [ ] Document organizational knowledge
- [ ] Run first `research` workflow

### Week 2-4: Strategic Operations
- [ ] Use Research Agent for market intelligence
- [ ] Use Analyst Agent for opportunity analysis
- [ ] Use `brainstorm-project` for strategic planning
- [ ] Create first product brief using PM Agent

### Month 2-3: Development Integration
- [ ] Integrate `create-story` → `dev-story` workflow
- [ ] Use `code-review` for quality assurance
- [ ] Use Tech Writer for documentation
- [ ] Set up sprint planning with SM Agent

### Month 4+: Customization
- [ ] Create custom workflows (grant proposal, stakeholder analysis)
- [ ] Expand domain knowledge base
- [ ] Train team on BMAD usage
- [ ] Measure and optimize

---

## 💡 Pro Tips

1. **Start Small**: Begin with one workflow (e.g., `research`) and expand
2. **Document Learnings**: Keep notes on what works, what doesn't
3. **Iterate**: Refine workflows based on actual usage
4. **Share Knowledge**: Build organizational knowledge base over time
5. **Measure Impact**: Track time saved, quality improved, decisions better

---

## 📚 Key Documents

- **Full Strategy**: `docs/strategy/BMAD-CIVICTECH-STRATEGY.md`
- **BMAD Reference**: `.bmad/BMAD-QUICK-REFERENCE.md`
- **Workflow Guide**: `.bmad/bmm/docs/workflows-*.md`

---

*Last updated: 2025-12-11*

