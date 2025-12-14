

import type { NavItem, Activity, Notification, User, Organisation, Announcement, Conversation, SemioticPattern } from "@/lib/types";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Users,
  Settings,
  ShieldAlert,
  Syringe,
  UserCheck,
  Bell,
  MessageSquare,
  FileCheck2,
  AlertTriangle,
  Info,
  Palette,
  Database,
  HelpCircle,
  User as UserIcon,
  PlusCircle,
  List,
  Calendar,
  FileText,
  TrendingUp,
  Map,
  CheckCircle,
  Clock,
  Building,
  Megaphone,
  DollarSign,
  BrainCircuit,
  Box,
  GraduationCap,
  Network,
  FlaskConical,
  Home,
  LogIn,
  UserPlus as UserPlusIcon
} from "lucide-react";

export const publicNavItems: NavItem[] = [
    {
        title: "Landing Page",
        href: "/",
        icon: Home,
    },
    {
        title: "Pricing",
        href: "/#pricing",
        icon: DollarSign,
    },
    {
        title: "Login",
        href: "/login",
        icon: LogIn,
    },
    {
        title: "Register",
        href: "/register",
        icon: UserPlusIcon,
    }
];

export const navItems: NavItem[] = [
  // Main Section
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Campaigns",
    href: "/dashboard/activities",
    icon: ClipboardList,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  // Management Section
  {
    title: "Organisations",
    href: "/dashboard/organisations",
    icon: Building,
  },
  {
    title: "Announcements",
    href: "/dashboard/announcements",
    icon: Megaphone,
    badge: 2
  },
  {
    title: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare,
    badge: 1
  },
  // Personal Section
  {
    title: 'Notifications',
    href: '/dashboard/notifications',
    icon: Bell,
    badge: 3
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: UserIcon,
  },
  {
    title: "Help & Support",
    href: "/dashboard/settings/help",
    icon: HelpCircle
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    children: [
        {
            title: "Account",
            href: "/dashboard/settings/account",
            icon: UserCheck
        },
        {
            title: "Organisation Settings",
            href: "/dashboard/settings/organisation",
            icon: Building
        },
        {
            title: "Hierarchy",
            href: "/dashboard/settings/hierarchy",
            icon: Network
        },
        {
            title: "Notification Preferences",
            href: "/dashboard/settings/notifications-preferences",
            icon: Bell
        },
        {
            title: "Appearance",
            href: "/dashboard/settings/appearance",
            icon: Palette
        },
        {
            title: "Data & Sync",
            href: "/dashboard/settings/data",
            icon: Database
        },
        // Billing Section (under settings)
        {
            title: "Billing",
            href: "/dashboard/settings/billing",
            icon: DollarSign,
        }
    ]
  },
];

export const futureNavItems: NavItem[] = [
    {
        title: "AI Planning",
        href: "/dashboard/planning",
        icon: BrainCircuit,
    },
    {
        title: "Resources",
        href: "/dashboard/resources",
        icon: Box,
    },
    {
        title: "Training",
        href: "/dashboard/training",
        icon: GraduationCap,
    },
    {
        title: "Integrations",
        href: "/dashboard/integrations",
        icon: Network,
    },
    {
        title: "Research Lab",
        href: "/dashboard/research",
        icon: FlaskConical,
    },
];

export const federalDashboardMetrics = [
  {
    title: "Total Campaigns",
    value: "1,247",
    trend: "+12% this month",
    icon: ClipboardList,
    accentColor: "bg-primary",
    trendColor: "text-green-500",
  },
  {
    title: "Active Outbreaks",
    value: "3",
    trend: "2 under control, 1 active",
    icon: ShieldAlert,
    accentColor: "bg-orange-500",
  },
  {
    title: "Vaccination Coverage",
    value: "67.3%",
    trend: "Target: 70%",
    icon: Syringe,
    accentColor: "bg-green-500",
    progress: 67.3,
  },
  {
    title: "Workers Trained",
    value: "15,892",
    trend: "↑ 1,234 this quarter",
    icon: UserCheck,
    accentColor: "bg-accent",
    trendColor: "text-accent"
  },
];

export const stateDashboardMetrics = [
  {
    title: "State Campaigns",
    value: "182",
    trend: "+8% this month",
    icon: ClipboardList,
    accentColor: "bg-primary",
    trendColor: "text-green-500",
  },
  {
    title: "LGAs Covered",
    value: "18 / 20",
    trend: "90% coverage",
    icon: Map,
    accentColor: "bg-blue-500",
    progress: 90,
  },
  {
    title: "Pending Approvals",
    value: "12",
    trend: "3 overdue",
    icon: Clock,
    accentColor: "bg-orange-500",
  },
  {
    title: "State Field Workers",
    value: "1,240",
    trend: "↑ 50 new this quarter",
    icon: Users,
    accentColor: "bg-accent",
    trendColor: "text-accent"
  },
];

export const lgaDashboardMetrics = [
  {
    title: "My Assigned Campaigns",
    value: "8",
    trend: "3 starting this week",
    icon: ClipboardList,
    accentColor: "bg-primary",
  },
  {
    title: "Completed this Month",
    value: "12",
    trend: "On track with target",
    icon: CheckCircle,
    accentColor: "bg-green-500",
  },
  {
    title: "Pending Reports",
    value: "3",
    trend: "1 overdue",
    icon: FileText,
    accentColor: "bg-orange-500",
  },
   {
    title: "My Team Members",
    value: "5",
    trend: "In Ikeja LGA",
    icon: Users,
    accentColor: "bg-accent",
  },
];

export const performanceChartData = [
    { date: 'Jan', created: 45, completed: 30 },
    { date: 'Feb', created: 55, completed: 42 },
    { date: 'Mar', created: 70, completed: 60 },
    { date: 'Apr', created: 65, completed: 55 },
    { date: 'May', created: 80, completed: 70 },
    { date: 'Jun', created: 75, completed: 68 },
    { date: 'Jul', created: 90, completed: 82 },
    { date: 'Aug', created: 85, completed: 78 },
    { date: 'Sep', created: 100, completed: 90 },
    { date: 'Oct', created: 95, completed: 85 },
    { date: 'Nov', created: 110, completed: 100 },
    { date: 'Dec', created: 120, completed: 115 },
];

export const activityTypeChartData = [
  { name: 'Vaccination', value: 400, fill: 'hsl(var(--chart-1))' },
  { name: 'Health Ed', value: 300, fill: 'hsl(var(--chart-2))' },
  { name: 'Outreach', value: 250, fill: 'hsl(var(--chart-3))' },
  { name: 'Training', value: 200, fill: 'hsl(var(--chart-4))' },
  { name: 'Surveillance', value: 150, fill: 'hsl(var(--chart-5))' },
];

export const mockOrganisations: Organisation[] = [
    // Government Network
    {
        id: 'ORG-001',
        name: 'Federal MOH',
        category: 'Government',
        level: 'Federal',
        members: 45,
        activities: 340,
        status: 'Active',
        parent: null
    },
    {
        id: 'ORG-002',
        name: 'Lagos State MOH',
        category: 'Government',
        level: 'State',
        members: 28,
        activities: 182,
        status: 'Active',
        parent: 'Federal MOH'
    },
     {
        id: 'ORG-003',
        name: 'Kano State PHCDA',
        category: 'Government',
        level: 'State',
        members: 35,
        activities: 218,
        status: 'Active',
        parent: 'Federal MOH'
    },
    {
        id: 'ORG-004',
        name: 'Rivers State MOH',
        category: 'Government',
        level: 'State',
        members: 22,
        activities: 156,
        status: 'Pending',
        parent: 'Federal MOH'
    },
    {
        id: 'ORG-005',
        name: 'Ikeja LGA PHC',
        category: 'Government',
        level: 'LGA',
        members: 12,
        activities: 45,
        status: 'Active',
        parent: 'Lagos State MOH'
    },
    // NGO Network
    {
        id: 'ORG-006',
        name: 'HealthForAll Foundation',
        category: 'NGO',
        level: 'Federal',
        members: 80,
        activities: 50,
        status: 'Active',
        parent: null
    },
    {
        id: 'ORG-007',
        name: 'HealthForAll - Kano Office',
        category: 'NGO',
        level: 'State',
        members: 15,
        activities: 25,
        status: 'Active',
        parent: 'HealthForAll Foundation'
    },
    // CSO
    {
        id: 'ORG-008',
        name: 'Community Action for Health',
        category: 'CSO',
        level: 'State',
        members: 8,
        activities: 12,
        status: 'Active',
        parent: 'Rivers State MOH'
    }
];

export const mockTeamMembers: User[] = [
    {
        id: 'USR-001',
        name: 'Dr. Amina Yusuf',
        email: 'amina.yusuf@ccip.gov',
        avatarId: 'user1',
        role: 'Super Admin',
        team: 'Federal MOH',
        status: 'Active',
    },
    {
        id: 'USR-002',
        name: 'Bolanle Adebayo',
        email: 'bolanle.adebayo@ccip.gov',
        avatarId: 'user2',
        role: 'State Coordinator',
        team: 'Lagos State MOH',
        status: 'Active',
    },
    {
        id: 'USR-003',
        name: 'Chinedu Okoro',
        email: 'chinedu.okoro@ccip.gov',
        avatarId: 'user3',
        role: 'Field Officer',
        team: 'Ikeja LGA PHC',
        status: 'Active',
    },
    {
        id: 'USR-004',
        name: 'Fatima Bello',
        email: 'fatima.bello@ccip.gov',
        avatarId: 'user4',
        role: 'Data Analyst',
        team: 'Federal MOH',
        status: 'Active',
    },
    {
        id: 'USR-005',
        name: 'Musa Ibrahim',
        email: 'musa.ibrahim@ccip.gov',
        avatarId: 'user5',
        role: 'State Coordinator',
        team: 'Kano State PHCDA',
        status: 'Active',
    },
    {
        id: 'USR-006',
        name: 'Ngozi Eze',
        email: 'ngozi.eze@ccip.gov',
        avatarId: 'user6',
        role: 'Program Manager',
        team: 'HealthForAll Foundation',
        status: 'Active',
    },
    {
        id: 'USR-007',
        name: 'David Akpan',
        email: 'david.akpan@ccip.gov',
        avatarId: 'user7',
        role: 'Director',
        team: 'Community Action for Health',
        status: 'Active',
    },
    {
        id: 'USR-008',
        name: 'Blessing Nwosu',
        email: 'blessing.nwosu@ccip.gov',
        avatarId: 'user8',
        role: 'Field Officer',
        team: 'Ikeja LGA PHC',
        status: 'Invited',
    },
     {
        id: 'USR-009',
        name: 'Sani Mohammed',
        email: 'sani.mohammed@healthforall.org',
        avatarId: 'user9',
        role: 'Field Officer',
        team: 'HealthForAll - Kano Office',
        status: 'Active',
    },
     {
        id: 'USR-010',
        name: 'Titi Olawole',
        email: 'titi.olawole@communityaction.org',
        avatarId: 'user10',
        role: 'Volunteer Coordinator',
        team: 'Community Action for Health',
        status: 'Active',
    },
];


export const mockActivities: Activity[] = [
    // Federal MOH Activities (5)
    {
        id: "ACT-001",
        title: "National COVID-19 Vaccination Strategy",
        status: "Completed",
        organization: "Federal MOH",
        location: "Abuja FCT, Municipal Area Council",
        dateCreated: "2025-01-15",
        lastModified: "2025-06-30",
        description: "Development and oversight of the national strategy for COVID-19 vaccine distribution and administration across all states.",
        type: "Policy & Strategy",
        semioticRiskScore: 15,
        targetContext: { region: 'Nigeria', language: 'English', culture: 'General Audience' },
        plannedMessage: { content: '', channels: [], messengers: [] },
        communicationEffectiveness: { understandingScore: 8, complianceRate: 92, barriersEncountered: [], messageResonance: 'high', culturalAlignment: 9 },
        humanReviewCompleted: true,
    },
    {
        id: "ACT-002",
        title: "Cholera Prevention Training of Trainers (ToT)",
        status: "Approved",
        organization: "Federal MOH",
        location: "Abuja FCT, Municipal Area Council",
        dateCreated: "2025-11-05",
        lastModified: "2025-11-06",
        description: "A national-level workshop to train state coordinators on the latest cholera prevention and control protocols.",
        type: "Training Workshop",
        semioticRiskScore: 25,
        targetContext: { region: 'Nigeria', language: 'English', culture: 'General Audience' },
        plannedMessage: { content: '', channels: [], messengers: [] },
        communicationEffectiveness: { understandingScore: 7, complianceRate: 85, barriersEncountered: [], messageResonance: 'medium', culturalAlignment: 8 },
        humanReviewCompleted: true,
    },
    {
        id: "ACT-010",
        title: "Public Health Seminar: Non-communicable Diseases",
        status: "Submitted",
        organization: "Federal MOH",
        location: "Abuja FCT, Gwagwalada",
        dateCreated: "2025-12-01",
        lastModified: "2025-12-01",
        description: "A public seminar to raise awareness about preventing NCDs like diabetes and hypertension.",
        type: "Health Education",
        semioticRiskScore: 85,
        targetContext: { region: 'Nigeria', language: 'English', culture: 'General Audience' },
        plannedMessage: { content: '', channels: [], messengers: [] },
        communicationEffectiveness: { understandingScore: 6, complianceRate: 70, barriersEncountered: ['low attendance'], messageResonance: 'medium', culturalAlignment: 7 },
    },
     {
        id: "ACT-011",
        title: "Data Management Training for Health Officials",
        status: "Approved",
        organization: "Federal MOH",
        location: "Abuja FCT, Municipal Area Council",
        dateCreated: "2025-09-01",
        lastModified: "2025-09-10",
        description: "Training state officials on using the CCIP platform for data entry and analysis.",
        type: "Training Workshop",
        targetContext: { region: 'Nigeria', language: 'English', culture: 'General Audience' },
        plannedMessage: { content: '', channels: [], messengers: [] },
        communicationEffectiveness: { understandingScore: 9, complianceRate: 98, barriersEncountered: [], messageResonance: 'high', culturalAlignment: 9 },
        humanReviewCompleted: true,
    },
    {
        id: "ACT-016",
        title: "Review of National Health Policy",
        status: "Draft",
        organization: "Federal MOH",
        location: "Abuja FCT, Municipal Area Council",
        dateCreated: "2025-12-20",
        lastModified: "2025-12-20",
        description: "Internal review of the existing national health policy to identify gaps and areas for improvement.",
        type: "Policy Review",
        semioticRiskScore: 72,
        targetContext: { region: 'Nigeria', language: 'English', culture: 'General Audience' },
        plannedMessage: { content: '', channels: [], messengers: [] },
    },

    // Lagos State MOH Activities (3)
    {
        id: "ACT-001L",
        title: "Lagos COVID-19 Vaccination Campaign - Phase 3",
        status: "Approved",
        organization: "Lagos State MOH",
        location: "Lagos, Ikeja LGA",
        dateCreated: "2025-10-01",
        lastModified: "2025-12-01",
        description: "Third phase of the statewide COVID-19 vaccination drive, targeting remaining unvaccinated populations.",
        type: "Vaccination Campaign",
        targetContext: { region: 'Nigeria', language: 'English', culture: 'General Audience' },
        plannedMessage: { content: '', channels: [], messengers: [] },
        communicationEffectiveness: { understandingScore: 8, complianceRate: 88, barriersEncountered: [], messageResonance: 'high', culturalAlignment: 8 },
        humanReviewCompleted: true,
    },
     {
        id: "ACT-007",
        title: "School Hand Hygiene Awareness Program",
        status: "Completed",
        organization: "Lagos State MOH",
        location: "Lagos, Epe",
        dateCreated: "2025-08-01",
        lastModified: "2025-08-30",
        description: "A month-long campaign in primary schools across Epe to promote effective handwashing techniques.",
        type: "Health Education",
        targetContext: { region: 'Nigeria', language: 'English', culture: 'General Audience' },
        plannedMessage: { content: '', channels: [], messengers: [] },
        communicationEffectiveness: { understandingScore: 9, complianceRate: 95, barriersEncountered: [], messageResonance: 'high', culturalAlignment: 9 },
        humanReviewCompleted: true,
    },
    {
        id: "ACT-012",
        title: "Maternal Health Workshop for PHC Staff",
        status: "Draft",
        organization: "Lagos State MOH",
        location: "Lagos, Ikorodu",
        dateCreated: "2025-12-15",
        lastModified: "2025-12-15",
        description: "A workshop focused on improving maternal and child health outcomes at the primary care level.",
        type: "Training Workshop",
        semioticRiskScore: 45,
        targetContext: { region: 'Nigeria', language: 'English', culture: 'General Audience' },
        plannedMessage: { content: '', channels: [], messengers: [] },
    },

    // Ikeja LGA PHC Activities (2)
    {
        id: "ACT-I01",
        title: "Community Outreach in Ikeja Market",
        status: "Submitted",
        organization: "Ikeja LGA PHC",
        location: "Lagos, Ikeja",
        dateCreated: "2025-11-18",
        lastModified: "2025-11-19",
        description: "Health education and free health screenings conducted at the main market.",
        type: "Outreach",
        targetContext: { region: 'Nigeria', language: 'English', culture: 'General Audience' },
        plannedMessage: { content: '', channels: [], messengers: [] },
        communicationEffectiveness: { understandingScore: 7, complianceRate: 75, barriersEncountered: ['market noise'], messageResonance: 'medium', culturalAlignment: 7 },
    },
    {
        id: "ACT-I02",
        title: "Routine Immunization Follow-up",
        status: "Approved",
        organization: "Ikeja LGA PHC",
        location: "Lagos, Ikeja",
        dateCreated: "2025-11-25",
        lastModified: "2025-11-25",
        description: "Home visits to follow up on children who missed their routine immunization schedules.",
        type: "Immunization",
        targetContext: { region: 'Nigeria', language: 'English', culture: 'General Audience' },
        plannedMessage: { content: '', channels: [], messengers: [] },
        communicationEffectiveness: { understandingScore: 9, complianceRate: 90, barriersEncountered: [], messageResonance: 'high', culturalAlignment: 9 },
        humanReviewCompleted: true,
    },
    
    // HealthForAll Foundation (NGO) Activities (3)
    {
        id: "ACT-HFA01",
        title: "Nutrition Program for IDP Camps",
        status: "Approved",
        organization: "HealthForAll Foundation",
        location: "Borno, Maiduguri",
        dateCreated: "2025-10-10",
        lastModified: "2025-10-12",
        description: "Distribution of nutritional supplements and health education in camps for internally displaced persons.",
        type: "Nutrition",
        targetContext: { region: 'Nigeria', language: 'English', culture: 'General Audience' },
        plannedMessage: { content: '', channels: [], messengers: [] },
        communicationEffectiveness: { understandingScore: 8, complianceRate: 85, barriersEncountered: ['logistics'], messageResonance: 'high', culturalAlignment: 8 },
        humanReviewCompleted: true,
    },
    {
        id: "ACT-HFA02",
        title: "Kano Malaria Prevention Project",
        status: "Completed",
        organization: "HealthForAll - Kano Office",
        location: "Kano, Dala",
        dateCreated: "2025-07-01",
        lastModified: "2025-09-30",
        description: "A 3-month project involving ITN distribution and community sensitization on malaria prevention.",
        type: "Outreach",
        targetContext: { region: 'Nigeria', language: 'English', culture: 'General Audience' },
        plannedMessage: { content: '', channels: [], messengers: [] },
        communicationEffectiveness: { understandingScore: 9, complianceRate: 92, barriersEncountered: [], messageResonance: 'high', culturalAlignment: 9 },
        humanReviewCompleted: true,
    },
    {
        id: "ACT-HFA03",
        title: "Mobile Clinic for Rural Communities",
        status: "Submitted",
        organization: "HealthForAll - Kano Office",
        location: "Kano, Gezawa",
        dateCreated: "2025-11-20",
        lastModified: "2025-11-20",
        description: "Proposal for a mobile clinic to provide basic healthcare services to remote villages in Gezawa LGA.",
        type: "Outreach",
        targetContext: { region: 'Nigeria', language: 'English', culture: 'General Audience' },
        plannedMessage: { content: '', channels: [], messengers: [] },
    },

    // Community Action for Health (CSO) Activities (2)
    {
        id: "ACT-CAH01",
        title: "Community Dialogue on Vaccine Hesitancy",
        status: "Completed",
        organization: "Community Action for Health",
        location: "Rivers, Port Harcourt",
        dateCreated: "2025-09-05",
        lastModified: "2025-09-06",
        description: "Facilitated discussions with community leaders to address concerns and misinformation about vaccines.",
        type: "Advocacy",
        targetContext: { region: 'Nigeria', language: 'English', culture: 'General Audience' },
        plannedMessage: { content: '', channels: [], messengers: [] },
        communicationEffectiveness: { understandingScore: 8, complianceRate: 80, barriersEncountered: ['trust issues'], messageResonance: 'medium', culturalAlignment: 7 },
        humanReviewCompleted: true,
    },
    {
        id: "ACT-CAH02",
        title: "Water Source Testing Initiative",
        status: "Approved",
        organization: "Community Action for Health",
        location: "Rivers, Oyigbo",
        dateCreated: "2025-11-01",
        lastModified: "2025-11-05",
        description: "Volunteers testing community water sources for contaminants and reporting findings to the state MOH.",
        type: "Surveillance",
        targetContext: { region: 'Nigeria', language: 'English', culture: 'General Audience' },
        plannedMessage: { content: '', channels: [], messengers: [] },
        communicationEffectiveness: { understandingScore: 9, complianceRate: 95, barriersEncountered: [], messageResonance: 'high', culturalAlignment: 9 },
        humanReviewCompleted: true,
    },
];

export const mockNotifications: Notification[] = [
  {
    id: "NOTIF-001",
    type: "Approval",
    title: "Campaign Approved",
    description: "Your campaign 'Cholera Prevention Training Workshop' has been approved.",
    timestamp: "2025-12-11T10:00:00Z",
    isRead: false,
    icon: FileCheck2,
    iconColor: "text-green-500"
  },
  {
    id: "NOTIF-002",
    type: "Assignment",
    title: "New Task Assigned",
    description: "You have been assigned to 'Emergency Response - Lassa Fever Outbreak'.",
    timestamp: "2025-12-10T14:30:00Z",
    isRead: false,
    icon: FileCheck2,
    iconColor: "text-blue-500"
  },
  {
    id: "NOTIF-003",
    type: "Alert",
    title: "Urgent: Outbreak Alert",
    description: "A new Cholera outbreak has been reported in Kano State.",
    timestamp: "2025-12-10T09:00:00Z",
    isRead: false,
    icon: AlertTriangle,
    iconColor: "text-red-500"
  },
  {
    id: "NOTIF-004",
    type: "System",
    title: "System Update",
    description: "CCIP has been updated to version 1.1.0.",
    timestamp: "2025-12-09T18:00:00Z",
    isRead: true,
    icon: Info,
    iconColor: "text-primary"
  },
  {
    id: "NOTIF-005",
    type: "Comment",
    title: "New Comment",
    description: "Dr. Aisha added a comment on 'COVID-19 Vaccination Campaign'.",
    timestamp: "2025-12-08T11:45:00Z",
    isRead: true,
    icon: MessageSquare,
    iconColor: "text-gray-500"
  },
];

export const reportActivityTrendsWeek = [
    { period: 'Week 1', activities: '85 campaigns', date: 'Jan 1-7', progress: 85 },
    { period: 'Week 2', activities: '92 campaigns', date: 'Jan 8-14', progress: 92 },
    { period: 'Week 3', activities: '78 campaigns', date: 'Jan 15-21', progress: 78 },
    { period: 'Week 4', activities: '95 campaigns', date: 'Jan 22-28', progress: 95 },
];

export const reportActivityTrendsMonth = [
    { period: 'January', activities: '340 campaigns', date: 'Month view', progress: 85 },
    { period: 'February', activities: '368 campaigns', date: 'Month view', progress: 92 },
    { period: 'March', activities: '312 campaigns', date: 'Month view', progress: 78 },
    { period: 'April', activities: '380 campaigns', date: 'Month view', progress: 95 },
];

export const reportActivityTrendsYear = [
    { period: '2023', activities: '4080 campaigns', date: 'Year view', progress: 85 },
    { period: '2024', activities: '4416 campaigns', date: 'Year view', progress: 92 },
    { period: '2025', 'activities': '3744 campaigns', date: 'Year view', progress: 78 },
];


export const reportActivityTypes = [
    { name: 'Vaccination Campaign', count: 342, colorClass: 'bg-chart-1' },
    { name: 'Health Education', count: 256, colorClass: 'bg-chart-2' },
    { name: 'Emergency Response', count: 189, colorClass: 'bg-chart-3' },
    { name: 'Training Workshop', count: 145, colorClass: 'bg-chart-4' },
    { name: 'Disease Surveillance', count: 71, colorClass: 'bg-chart-5' },
];

export const reportStatusBreakdown = [
    { name: 'Approved', count: 572, description: '↑ 12% vs last month', borderColor: 'hsl(var(--primary))' },
    { name: 'Submitted', count: 134, description: 'Pending review', borderColor: 'hsl(var(--accent))' },
    { name: 'Draft', count: 89, description: 'In progress', borderColor: 'hsl(var(--muted))' },
    { name: 'Rejected', count: 24, description: 'Needs revision', borderColor: 'hsl(var(--destructive))' },
];

export const reportGeographicDistribution = [
    { name: 'Lagos', count: 342, colorClass: 'bg-chart-1' },
    { name: 'Kano', count: 218, colorClass: 'bg-chart-1' },
    { name: 'Rivers', count: 156, colorClass: 'bg-chart-2' },
    { name: 'Kaduna', count: 134, colorClass: 'bg-chart-2' },
    { name: 'FCT Abuja', count: 98, colorClass: 'bg-chart-3' },
    { name: 'Oyo', count: 87, colorClass: 'bg-chart-3' },
    { name: 'Edo', count: 76, colorClass: 'bg-chart-4' },
    { name: 'Others', count: 136, colorClass: 'bg-chart-5' },
];

export const reportTemplates = [
    { id: 'weekly-summary', name: 'Weekly Summary', description: 'A snapshot of the week\'s performance.', icon: Calendar },
    { id: 'monthly-report', name: 'Monthly Report', description: 'A comprehensive monthly review.', icon: FileText },
    { id: 'performance-analysis', name: 'Performance Analysis', description: 'Deep-dive into campaign trends.', icon: TrendingUp },
];

export const mockAnnouncements: Announcement[] = [
    {
        id: 'ANNC-001',
        type: 'Platform Update',
        title: 'New Feature: Advanced Reporting',
        content: 'We have launched a new advanced reporting module. You can now generate more detailed analytics and visualizations for your campaigns. Check out the "Reports" page to explore the new features.',
        author: 'CCIP Team',
        organisation: 'CCIP Platform',
        timestamp: '2025-12-10T10:00:00Z',
        isRead: false,
        priority: 'medium',
    },
    {
        id: 'ANNC-002',
        type: 'Federal Announcement',
        title: 'National Health Policy Update 2025',
        content: 'The Federal Ministry of Health has released an update to the National Health Policy. All state and LGA coordinators are required to review the document and ensure compliance with the new guidelines. The document is available in the resource center.',
        author: 'Dr. Amina Yusuf',
        organisation: 'Federal MOH',
        timestamp: '2025-12-09T09:00:00Z',
        isRead: false,
        priority: 'high',
    },
    {
        id: 'ANNC-003',
        type: 'State Announcement',
        title: 'Lagos State: Polio Vaccination Campaign',
        content: 'Lagos State is launching a new polio vaccination campaign starting January 15th, 2026. All LGA field officers are to attend a mandatory briefing session next week. Details will be sent via email.',
        author: 'Bolanle Adebayo',
        organisation: 'Lagos State MOH',
        timestamp: '2025-12-08T15:30:00Z',
        isRead: true,
        priority: 'high',
    },
    {
        id: 'ANNC-004',
        type: 'LGA Update',
        title: 'Ikeja LGA: Weekly Report Submission Deadline',
        content: 'This is a reminder that the deadline for weekly campaign reports is Friday at 5:00 PM. Please ensure all your reports are submitted on time to avoid delays in data compilation.',
        author: 'Ikeja LGA Admin',
        organisation: 'Ikeja LGA PHC',
        timestamp: '2025-12-07T11:00:00Z',
        isRead: true,
        priority: 'medium',
    },
    {
        id: 'ANNC-005',
        type: 'Platform Update',
        title: 'Scheduled Maintenance: Dec 15th',
        content: 'The CCIP platform will be undergoing scheduled maintenance on December 15th from 2:00 AM to 4:00 AM. The platform may be unavailable during this time. We apologize for any inconvenience.',
        author: 'CCIP Team',
        organisation: 'CCIP Platform',
        timestamp: '2025-12-05T18:00:00Z',
        isRead: true,
        priority: 'low',
    }
];

export const mockConversations: Conversation[] = [
    {
        id: 'CONV-001',
        subject: 'Re: Cholera Prevention Training Workshop',
        participants: [
            { id: 'USR-001', name: 'Dr. Amina Yusuf' },
            { id: 'USR-002', name: 'Bolanle Adebayo' },
        ],
        isRead: false,
        lastMessageTimestamp: '2025-12-12T10:00:00Z',
        messages: [
            {
                id: 'MSG-001-1',
                sender: { name: 'Bolanle Adebayo', avatarId: 'user2' },
                content: 'Hi Dr. Yusuf, I have a question about the budget for the Cholera workshop. Can we allocate more funds for transportation?',
                timestamp: '2025-12-11T14:30:00Z',
            },
            {
                id: 'MSG-001-2',
                sender: { name: 'Dr. Amina Yusuf', avatarId: 'user1' },
                content: 'Bolanle, good question. Let me review the current budget allocation. I think we can make some adjustments. I will get back to you shortly.',
                timestamp: '2025-12-12T10:00:00Z',
            },
        ],
    },
    {
        id: 'CONV-002',
        subject: 'Urgent: Lassa Fever Outbreak Response',
        participants: [
            { id: 'USR-001', name: 'Dr. Amina Yusuf' },
            { id: 'USR-006', name: 'Ngozi Eze' },
        ],
        isRead: true,
        lastMessageTimestamp: '2025-12-11T18:45:00Z',
        messages: [
            {
                id: 'MSG-002-1',
                sender: { name: 'Ngozi Eze', avatarId: 'user6' },
                content: 'We have a critical situation in Ibadan North. Need immediate support and resources for the Lassa Fever outbreak.',
                timestamp: '2025-12-11T18:45:00Z',
            },
        ],
    },
    {
        id: 'CONV-003',
        subject: 'Quarterly Report Submission',
        participants: [
            { id: 'USR-001', name: 'Dr. Amina Yusuf' },
            { id: 'USR-004', name: 'Fatima Bello' },
            { id: 'USR-005', name: 'Musa Ibrahim' },
        ],
        isRead: true,
        lastMessageTimestamp: '2025-12-10T11:20:00Z',
        messages: [
             {
                id: 'MSG-003-1',
                sender: { name: 'Fatima Bello', avatarId: 'user4' },
                content: 'Hi all, a reminder that the Q4 reports are due next Friday. Please ensure all campaign data is up to date.',
                timestamp: '2025-12-10T11:20:00Z',
            },
        ],
    },
];

export const mockSemioticPatterns: SemioticPattern[] = [
    {
        patternId: 'IF-042',
        patternType: 'framing_failure',
        context: {
            region: 'Nigeria',
            language: 'English',
            culture: 'Collectivist',
        },
        failedElement: 'protect yourself',
        recommendation: 'Reframe as "protect your family" or "protect your community" to align with collectivist values.',
        riskScore: 65,
        confidence: 0.85,
    },
    {
        patternId: 'TT-011',
        patternType: 'technical_terminology_failure',
        context: {
            region: 'Any',
            language: 'Any',
            culture: 'General Audience',
        },
        failedElement: 'viral shedding',
        recommendation: 'Replace with simpler, more accessible language like "when you can pass the virus to others".',
        riskScore: 40,
        confidence: 0.95,
    },
    {
        patternId: 'AM-003',
        patternType: 'authority_mismatch',
        context: {
            region: 'Nigeria',
            language: 'Any',
            culture: 'High Power Distance',
        },
        failedElement: 'community volunteer',
        recommendation: 'For critical health directives, the primary messenger should be a recognized authority figure like a doctor or government health official. Use volunteers for support and logistics.',
        riskScore: 80,
        confidence: 0.90,
    },
];

// Data for Activity Form dropdowns
export const activityTypes = [...new Set(mockActivities.map(a => a.type))];
export const regions = ['Nigeria', 'UK', 'Germany'];
export const languages = ['English', 'Hausa', 'Yoruba', 'Igbo', 'Pidgin', 'French', 'Portuguese', 'Arabic', 'Swahili'];
export const cultures = ['General Audience', 'Collectivist', 'High Power Distance', 'Youth', 'Northern Nigeria, Muslim-majority'];
export const messengers = ['Government Official', 'Community Leader', 'Religious Leader', 'Healthcare Worker', 'Celebrity', 'Community Volunteer'];
export const userRoles = [
    { name: 'National Super Admin', context: 'Primary Role' },
    { name: 'State Coordinator (Lagos)', context: 'Secondary Role' },
];
    

    