
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const documentationSections = [
    {
        title: "1. Introduction to CCIP",
        items: [
            { question: "What is CCIP?", answer: "An overview of the Crisis Communication Intelligence Platform, its purpose, and target audience (Government, NGOs, CSOs)." },
            { question: "Key Terminology", answer: "Definitions of core concepts like Activities, Organisations, Roles, and Hierarchies." },
            { question: "Platform Goals", answer: "What CCIP aims to achieve for public health coordination." }
        ]
    },
    {
        title: "2. Getting Started",
        items: [
            { question: "Creating Your Account", answer: "A step-by-step guide to the registration and verification process." },
            { question: "Logging In & Security", answer: "Instructions on signing in, password requirements, and multi-factor authentication (if applicable)." },
            { question: "First Look: The Dashboard", answer: "An explanation of the role-based dashboard and its key components." }
        ]
    },
    {
        title: "3. Core Features in Detail",
        items: [
            { question: "Activity Management", answer: "How to create, edit, submit, and track the status of activities. Explanation of fields like 'Type', 'Location', etc." },
            { question: "Organisation Management", answer: "How to view, add, and link organisations. Understanding parent-child relationships between Federal, State, and LGA levels." },
            { question: "Team Directory", answer: "How to invite new members, manage existing users, and understand user roles (Super Admin, State Coordinator, Field Officer, etc.)." },
            { question: "Messaging System", answer: "Guide to using the internal messaging for direct and group communication, including how to find conversations and start new ones." },
            { question: "Reports & Analytics", answer: "How to generate, view, and export reports. Explanation of the different report templates and data visualizations." },
        ]
    },
    {
        title: "4. User Roles and Permissions",
        items: [
            { question: "Super Admin (Federal)", answer: "Detailed breakdown of full system access, capabilities, and responsibilities." },
            { question: "State Admin / Coordinator", answer: "Explanation of state-level management duties, from approving activities to managing LGA hierarchies." },
            { question: "LGA / Field Officer", answer: "A guide for field officers on creating reports and managing their assigned tasks." },
            { question: "Data Analyst / Epidemiologist", answer: "Information on read-only access for data analysis and trend reporting." },
        ]
    },
    {
        title: "5. Account & Organisation Settings",
        items: [
            { question: "Managing Your Profile", answer: "How to update personal information, change your password, and set your profile picture." },
            { question: "Notification Preferences", answer: "How to configure email, push, and SMS notifications for different event types." },
            { question: "Organisation Settings", answer: "For admins: how to manage organisation details, branding, and ownership." }
        ]
    },
    {
        title: "6. Advanced Topics & Best Practices",
        items: [
            { question: "Best Practices for Reporting", answer: "Tips for writing clear, effective, and data-rich activity reports." },
            { question: "Understanding Data Hierarchy", answer: "How data rolls up from LGA to State to Federal levels for comprehensive analytics." },
            { question: "Using AI for Insights", answer: "An overview of how to leverage the AI report generation feature for deeper analysis (when available)." },
        ]
    }
];

export default function HelpSettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Help & Documentation
        </h1>
        <p className="text-muted-foreground">
          Find answers and detailed guides for using the CCIP platform.
        </p>
      </div>

      <Card>
          <CardHeader>
              <CardTitle>Platform Knowledge Base</CardTitle>
              <CardDescription>
                  A comprehensive guide to understanding and using all features of CCIP.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <Accordion type="single" collapsible className="w-full">
                  {documentationSections.map(section => (
                      <AccordionItem key={section.title} value={section.title}>
                          <AccordionTrigger className="text-xl font-bold">{section.title}</AccordionTrigger>
                          <AccordionContent>
                              <Accordion type="single" collapsible className="w-full pl-4 border-l">
                                  {section.items.map(item => (
                                      <AccordionItem key={item.question} value={item.question}>
                                          <AccordionTrigger className="text-base font-semibold">{item.question}</AccordionTrigger>
                                          <AccordionContent className="text-muted-foreground">
                                              {item.answer}
                                          </AccordionContent>
                                      </AccordionItem>
                                  ))}
                              </Accordion>
                          </AccordionContent>
                      </AccordionItem>
                  ))}
              </Accordion>
          </CardContent>
      </Card>
    </div>
  );
}
