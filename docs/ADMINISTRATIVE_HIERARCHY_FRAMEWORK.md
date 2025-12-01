# RCAP Administrative Hierarchy Framework
**Global Scalability & Flexible Role Configuration**

**Date**: 2025-01-19
**Purpose**: Comprehensive guide for configuring administrative levels in RCAP
**Audience**: System administrators, organization managers, implementation partners

---

## Overview

RCAP's administrative hierarchy system is designed to be **globally scalable** and **organizationally flexible**. Unlike rigid systems that assume specific governmental structures, RCAP adapts to any administrative context - from international NGOs operating across continents to local health departments serving single communities.

## Core Principles

### **1. Geographic Scalability**
- **Global Level**: Continental and international organizations
- **National Level**: Country-wide health authorities
- **Regional Level**: States, provinces, counties
- **Local Level**: Districts, municipalities, wards
- **Community Level**: Facilities, neighborhoods, households
- **Individual Level**: Personal health coordination

### **2. Organizational Adaptability**
- **Preset Templates**: Quick setup for common organizational structures
- **Custom Configuration**: Full control over administrative levels
- **Role Mapping**: Flexible assignment of permissions to administrative levels
- **Hierarchical Boundaries**: Clear data access and management boundaries

### **3. Contextual Terminology**
- **Region-Appropriate Names**: Use terms familiar to your context
- **Local Government Structures**: Match existing administrative divisions
- **International Standards**: Align with WHO, UN administrative classifications
- **Custom Terminology**: Define names that work for your organization

---

## Administrative Tiers

### **Tier 1: Global/Continental Level**
**Scope**: Multi-country operations, continental coordination

**Typical Organizations**:
- WHO Regional Offices
- CDC Global Division
- International NGOs (Doctors Without Borders, Red Cross)
- Continental Bodies (Africa CDC, EU Health Commission)

**Common Role Names**:
- Continental Administrator
- Regional Director (Africa, Asia, etc.)
- Global Program Director
- International Operations Manager

**Data Access**: Cross-country health data, regional trends, international disease surveillance

### **Tier 2: National/Federal Level**
**Scope**: Entire country or nation-state

**Typical Organizations**:
- National Health Ministries
- National CDC/NCDC equivalents
- Federal Health Departments
- National Health Insurance Schemes

**Common Role Names**:
- Federal Administrator
- National Director of Health
- Country Health Coordinator
- National Health Authority

**Data Access**: Nationwide health statistics, federal programs, national disease reporting

### **Tier 3: Sub-National/Regional Level**
**Scope**: States, provinces, regions, major administrative divisions

**Typical Organizations**:
- State Health Departments
- Provincial Health Authorities
- Regional Health Offices
- State-level Public Health Agencies

**Common Role Names**:
- State Administrator
- Provincial Health Director
- Regional Health Manager
- State Health Commissioner

**Data Access**: State-level health data, regional programs, sub-national disease surveillance

### **Tier 4: Local/Municipal Level**
**Scope**: Districts, counties, municipalities, local government areas

**Typical Organizations**:
- LGA Health Offices
- County Health Departments
- Municipal Health Authorities
- District Medical Offices

**Common Role Names**:
- LGA Administrator
- County Health Director
- Municipal Health Officer
- District Medical Officer

**Data Access**: Local health data, community programs, facility-level reporting

### **Tier 5: Community Level**
**Scope**: Specific facilities, neighborhoods, wards, communities

**Typical Organizations**:
- Hospitals and Health Centers
- Community Health Clinics
- Ward Health Offices
- Primary Health Centers

**Common Role Names**:
- Facility Administrator
- Ward Health Officer
- Community Health Supervisor
- Facility Manager

**Data Access**: Facility-specific data, community health metrics, patient-level statistics

### **Tier 6: Family/Individual Level**
**Scope**: Households, individual patients, personal health tracking

**Typical Organizations**:
- Community Health Worker Programs
- Home-based Care Organizations
- Family Health Services
- Personal Health Coordination

**Common Role Names**:
- Family Health Worker
- Community Health Volunteer
- Personal Health Coordinator
- Household Health Supervisor

**Data Access**: Individual patient data, family health records, personal health tracking

---

## Configuration Options

### **Option 1: Preset Templates**

Quick setup using pre-configured administrative structures:

#### **International NGO Template**
```
Tier 1: Global Director (Worldwide Operations)
Tier 2: Regional Director (Africa/Asia/Europe/Americas)
Tier 3: Country Director (Nigeria/Kenya/Ghana/etc.)
Tier 4: Program Manager (State/Province Level)
Tier 5: Field Coordinator (District/LGA Level)
Tier 6: Community Health Worker (Community Level)
```

#### **National Health Ministry Template**
```
Tier 1: Federal Administrator (National Level)
Tier 2: State Administrator (36 States + FCT)
Tier 3: LGA Administrator (774 LGAs)
Tier 4: Ward Administrator (Ward Level)
Tier 5: Facility Administrator (Health Facilities)
Tier 6: Community Health Worker (Household Level)
```

#### **State-Level Organization Template**
```
Tier 1: State Director (Entire State)
Tier 2: Regional Manager (Health Zones/Regions)
Tier 3: District Supervisor (Health Districts)
Tier 4: Facility Manager (Health Facilities)
Tier 5: Community Health Supervisor (Communities)
Tier 6: Health Volunteer (Households)
```

### **Option 2: Custom Configuration**

Define your own administrative structure:

#### **Step 1: Define Your Tiers**
```
How many administrative levels does your organization need? [1-6]

For each level:
- Level Name: [Your Custom Name]
- Geographic Scope: [Define Coverage Area]
- Parent Level: [Optional - for hierarchical structure]
- Primary Responsibilities: [List main functions]
```

#### **Step 2: Map Roles to Tiers**
```
For each role in your organization:
- Role Name: [Your Custom Role]
- Administrative Tier: [Which level 1-6]
- Data Access Level: [What data can they access]
- Management Scope: [Who can they manage]
- Reporting Requirements: [What reports they need]
```

#### **Step 3: Set Permission Boundaries**
```
For each administrative tier:
- Can view data from: [Own level + lower levels]
- Can manage users at: [Own level + specified lower levels]
- Can generate reports for: [Own level + lower levels]
- Can approve activities at: [Own level + specified levels]
```

---

## Implementation Examples

### **Example 1: Nigeria Federal Ministry of Health**
```
Tier 1: Federal Administrator (NCDC National)
├── Tier 2: State Administrator (36 States + FCT)
│   ├── Tier 3: LGA Administrator (774 LGAs)
│   │   ├── Tier 4: Ward Administrator (8,809 Wards)
│   │   │   ├── Tier 5: Facility Administrator (30,000+ Health Facilities)
│   │   │   │   └── Tier 6: Community Health Worker (200,000+ CHWs)
```

### **Example 2: Kenya County Health System**
```
Tier 1: National Administrator (Ministry of Health)
├── Tier 2: County Administrator (47 Counties)
│   ├── Tier 3: Sub-County Administrator (Sub-Counties)
│   │   ├── Tier 4: Ward Administrator (Wards)
│   │   │   ├── Tier 5: Facility Administrator (Health Facilities)
│   │   │   │   └── Tier 6: Community Health Volunteer (CHVs)
```

### **Example 3: International NGO (MSF Operations)**
```
Tier 1: Global Operations Director (International)
├── Tier 2: Regional Director (West Africa)
│   ├── Tier 3: Country Director (Nigeria)
│   │   ├── Tier 4: Program Manager (Borno State)
│   │   │   ├── Tier 5: Field Coordinator (LGA Level)
│   │   │   │   └── Tier 6: Community Health Worker (Facility Level)
```

### **Example 4: State Health Department (Single State)**
```
Tier 1: State Health Commissioner (State Level)
├── Tier 2: Zonal Director (Health Zones)
│   ├── Tier 3: District Health Officer (Districts)
│   │   ├── Tier 4: Facility Manager (Health Centers)
│   │   │   ├── Tier 5: Ward Health Supervisor (Wards)
│   │   │   │   └── Tier 6: Health Volunteer (Communities)
```

### **Example 5: Private Healthcare Network**
```
Tier 1: CEO (National Hospital Chain)
├── Tier 2: Regional Director (North/South/East/West)
│   ├── Tier 3: Hospital Administrator (Individual Hospitals)
│   │   ├── Tier 4: Department Head (Clinical Departments)
│   │   │   ├── Tier 5: Ward Manager (Hospital Wards)
│   │   │   │   └── Tier 6: Patient Care Coordinator (Patient Level)
```

---

## Role-Based Permission Matrix

### **Data Access by Tier**

| Administrative Tier | Can View Data From | Can Manage Users At | Can Approve Activities At |
|---------------------|-------------------|---------------------|---------------------------|
| Tier 1 (Global)     | All Tiers         | All Tiers           | All Tiers                 |
| Tier 2 (National)   | Tiers 2-6         | Tiers 2-6           | Tiers 2-6                 |
| Tier 3 (Regional)   | Tiers 3-6         | Tiers 3-6           | Tiers 3-6                 |
| Tier 4 (Local)      | Tiers 4-6         | Tiers 4-6           | Tiers 4-6                 |
| Tier 5 (Community)  | Tiers 5-6         | Tier 6              | Tier 5-6                  |
| Tier 6 (Individual) | Tier 6 Only       | None                | None                      |

### **Function-Specific Permissions**

| Function | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Tier 5 | Tier 6 |
|----------|--------|--------|--------|--------|--------|--------|
| **View National Reports** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Manage State Users** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Approve Regional Activities** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **View District Data** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Manage Facility Users** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Generate Community Reports** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Update Household Records** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Configuration Instructions

### **For System Administrators**

#### **Step 1: Access Organization Settings**
1. Navigate to **Organization Management**
2. Select **Administrative Structure**
3. Choose **Configure Hierarchy**

#### **Step 2: Select Configuration Type**
```
☐ Use preset template: [Select from dropdown]
☐ Create custom administrative structure
```

#### **Step 3: Define Administrative Levels**

**For preset templates**:
- Select appropriate template
- Review tier names and scopes
- Customize role names if needed

**For custom configuration**:
- Set number of administrative tiers (1-6)
- Define each tier's name and scope
- Establish hierarchical relationships

#### **Step 4: Map Roles to Tiers**
- Map existing roles to administrative tiers
- Define data access boundaries
- Set user management permissions
- Configure activity approval levels

#### **Step 5: Test Configuration**
- Create test users for each tier
- Verify data access boundaries
- Test user management permissions
- Validate reporting functionality

### **For Organization Managers**

#### **Review Your Structure**
1. **Assess Current Hierarchy**: How many administrative levels do you have?
2. **Identify Role Names**: What are your actual administrative titles?
3. **Define Boundaries**: Who reports to whom? Who manages which areas?
4. **Map Data Access**: Who needs to see what data?

#### **Choose Your Template**
- **International NGO**: International NGO Template
- **National Ministry**: National Health Ministry Template
- **State Department**: State-Level Organization Template
- **Custom**: Create Custom Configuration

#### **Customize for Your Context**
- Change role names to match your terminology
- Adjust geographic scopes to match your areas
- Modify permissions to fit your workflows
- Add custom roles if needed

---

## Technical Implementation

### **Database Schema**

```sql
-- Administrative level definitions
CREATE TABLE administrative_levels (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  tier_number INTEGER NOT NULL CHECK (tier_number BETWEEN 1 AND 6),
  level_name VARCHAR(255) NOT NULL,
  geographic_scope VARCHAR(255),
  parent_tier INTEGER,
  permissions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User administrative assignments
ALTER TABLE users ADD COLUMN administrative_tier INTEGER;
ALTER TABLE users ADD COLUMN geographic_boundaries JSONB;
ALTER TABLE users ADD COLUMN permission_scope JSONB;

-- Organization hierarchy configuration
ALTER TABLE organizations ADD COLUMN hierarchy_type VARCHAR(50) DEFAULT 'preset';
ALTER TABLE organizations ADD COLUMN hierarchy_config JSONB;
```

### **API Implementation**

```typescript
// Administrative structure configuration
interface ConfigureHierarchyRequest {
  organization_id: string;
  hierarchy_type: 'preset' | 'custom';
  preset_template?: string;
  custom_levels?: AdministrativeLevel[];
  role_mappings?: RoleMapping[];
}

// Role-based access control
interface UserPermissions {
  user_id: string;
  administrative_tier: number;
  data_access_levels: number[];
  user_management_levels: number[];
  activity_approval_levels: number[];
  geographic_boundaries: GeographicBoundary[];
}
```

---

## Best Practices

### **Configuration Guidelines**

1. **Keep It Simple**: Don't create more levels than necessary
2. **Use Familiar Names**: Match existing organizational terminology
3. **Clear Boundaries**: Ensure each role has well-defined responsibilities
4. **Test Thoroughly**: Verify permissions with test accounts
5. **Document Changes**: Keep records of configuration modifications

### **Security Considerations**

1. **Principle of Least Privilege**: Grant minimum necessary permissions
2. **Regular Reviews**: Periodically review role assignments and permissions
3. **Audit Trails**: Log all administrative actions and data access
4. **Segregation of Duties**: Prevent concentration of excessive power
5. **Access Revocation**: Immediate removal of access when roles change

### **User Training**

1. **Role-Specific Training**: Train users on their specific permissions and responsibilities
2. **Data Handling**: Educate on proper data access and privacy practices
3. **Workflow Processes**: Train on approval processes and escalation procedures
4. **Security Awareness**: Regular security training for all administrative users

---

## Support and Troubleshooting

### **Common Configuration Issues**

**Problem**: Users can't access data they should see
**Solution**: Check administrative tier assignment and data access permissions

**Problem**: Role hierarchy doesn't match organizational structure
**Solution**: Use custom configuration instead of preset templates

**Problem**: Too many administrative levels causing confusion
**Solution**: Consolidate similar roles and reduce tier complexity

### **Getting Help**

1. **Documentation**: Refer to this guide and user manuals
2. **Support Team**: Contact RCAP implementation support
3. **Community Forums**: Connect with other RCAP administrators
4. **Training Programs**: Attend RCAP administrator training sessions

---

## Conclusion

The RCAP Administrative Hierarchy Framework provides the flexibility needed to deploy our public health platform in any organizational context, from international NGOs operating across continents to local health departments serving single communities.

By following this framework, organizations can:

- **Configure** administrative structures that match their existing systems
- **Maintain** clear data access boundaries and user management permissions
- **Scale** operations as organizations grow and evolve
- **Adapt** terminology to match local contexts and languages
- **Ensure** security through proper role-based access control

This flexibility makes RCAP truly **globally scalable** while maintaining the **security and integrity** needed for public health data management.

---

**For questions or implementation support, contact:**
- RCAP Implementation Team: support@rcap.health
- Technical Documentation: docs.rcap.health
- Training Programs: training@rcap.health

---

*This framework is continuously updated based on user feedback and evolving public health needs. Last updated: January 2025*