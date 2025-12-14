

import type { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  badge?: number;
  children?: NavItem[];
};

export type ActivityStatus = "Draft" | "Submitted" | "Approved" | "Rejected" | "Completed";

export type Activity = {
  id: string;
  title: string;
  status: ActivityStatus;
  organization: string;
  location: string;
  dateCreated: string;
  lastModified: string;
  description: string;
  type: string;
  // Semiotic & Reporting Fields
  targetContext: {
    region: string;
    language: string;
    culture: string;
  };
  plannedMessage: {
    content: string;
    channels: string[];
    messengers: string[];
  };
  semioticRiskScore?: number;
  semioticAssessment?: SemioticAssessment | null;
  communicationEffectiveness?: {
    understandingScore: number;
    complianceRate: number;
    barriersEncountered: string[];
    messageResonance: "high" | "medium" | "low";
    culturalAlignment: number;
  };
  semioticValidation?: {
    predictedFailuresValidated: boolean[];
    recommendationsUsed: string[];
    actualOutcome: "success" | "partial" | "failure";
  };
  humanReviewCompleted?: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarId: string;
  role: string;
  team: string;
  status: 'Active' | 'Invited';
};

export type NotificationType = "Approval" | "Assignment" | "Alert" | "System" | "Comment";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  icon: LucideIcon;
  iconColor: string;
};

export type ReportTemplate = {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
}

export type OrganisationCategory = 'Government' | 'NGO' | 'CSO';
export type OrganisationLevel = 'Federal' | 'State' | 'LGA';

export type Organisation = {
    id: string;
    name: string;
    category: OrganisationCategory;
    level: OrganisationLevel;
    members: number;
    activities: number;
    status: 'Active' | 'Pending' | 'Suspended';
    parent: string | null;
}

export type AnnouncementType = 'Platform Update' | 'Federal Announcement' | 'State Announcement' | 'LGA Update';
export type AnnouncementPriority = 'high' | 'medium' | 'low';

export type Announcement = {
  id: string;
  type: AnnouncementType;
  title: string;
  content: string;
  author: string;
  organisation: string;
  timestamp: string;
  isRead: boolean;
  priority: AnnouncementPriority;
};

export type Message = {
    id: string;
    sender: Pick<User, 'name' | 'avatarId'>;
    content: string;
    timestamp: string;
};

export type Conversation = {
    id: string;
    subject: string;
    participants: Pick<User, 'id' | 'name'>[];
    messages: Message[];
    isRead: boolean;
    lastMessageTimestamp: string;
};

export type SemioticPattern = {
  patternId: string;
  patternType: string;
  context: {
    region: string;
    language: string;
    culture: string;
  };
  failedElement: string;
  recommendation: string;
  riskScore: number;
  confidence: number;
};

export type SemioticAssessment = {
  riskScore: number;
  confidence: number;
  predictedFailures: {
    element: string;
    issue: string;
    probability: number;
    patternId: string;
  }[];
  recommendations: {
    priority: "High" | "Medium" | "Low";
    suggestion: string;
    expectedImprovement: number;
  }[];
  assessedAt: Date;
};

export type FieldReport = {
    activityId: string;
    reportDate: string;
    submittedBy: string;
    communicationEffectiveness: {
        understandingScore: number;
        complianceRate: number;
        barriersEncountered: string[];
        messageResonance: "high" | "medium" | "low";
        culturalAlignment: number;
    };
    semioticValidation: {
        predictedFailuresValidated: boolean[];
        recommendationsUsed: string[];
        actualOutcome: "success" | "partial" | "failure";
    };
};
