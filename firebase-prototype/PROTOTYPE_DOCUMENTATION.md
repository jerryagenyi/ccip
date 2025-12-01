# RCAP Prototype: Detailed Feature Documentation

## 1. Introduction

The **Risk Communication Activity Platform (RCAP)** is a comprehensive web application designed to be the central nervous system for public health organisations. It addresses the critical challenge of coordinating, tracking, and analyzing health-related activities across complex hierarchical structures, from national ministries down to local community officers.

**Purpose**: To replace fragmented systems (spreadsheets, emails, paper forms) with a single, data-driven platform that enhances efficiency, provides real-time insights, and improves the effectiveness of public health interventions.

**Target Audience**:
- **Government Health Bodies**: Federal, State, and Local Government Area (LGA) level health ministries and agencies.
- **Non-Profit Organisations (NPOs)**: For managing community health programs and grant-funded projects.
- **Civil Society Organisations (CSOs)**: To coordinate grassroots campaigns and awareness drives.

---

## 2. Technology Stack

- **Frontend**: Next.js (App Router) & React
- **UI Components**: ShadCN UI
- **Styling**: Tailwind CSS
- **Generative AI**: Google Genkit
- **Database & Auth**: Firebase (Firestore & Firebase Authentication)

---

## 3. Core Features in Detail

This section provides an in-depth look at each module currently prototyped in the application.

### 3.1. Dashboard (Role-Based)

The Dashboard is the dynamic entry point for every user, providing an immediate, role-specific overview of the most relevant information.

- **Purpose**: To give users a "mission control" view tailored to their responsibilities, enabling quick assessment and action.
- **Functionality**:
    - **Role Switching**: A prominent tab-based switcher allows for simulating the view of different user roles (Federal, State, LGA) to demonstrate the platform's adaptability.
    - **National (Federal) Dashboard**:
        - **High-Level Metrics**: Displays key national statistics like Total Activities, Active Outbreaks, Vaccination Coverage, and Total Workers Trained.
        - **Performance Trends**: Features a comprehensive chart showing activity creation vs. completion over time, and a pie chart for activity type distribution.
        - **Live Heatmap**: A map visualization showing hotspots of activity across the country.
        - **Emergency Center**: A high-visibility card that appears during critical events (e.g., an outbreak), providing quick access to create response activities.
        - **Recent Activities**: A feed of the latest activities from across the entire system.
    - **State Dashboard**:
        - **State-Specific Metrics**: Similar to the national view, but focused on the state's performance (e.g., State Activities, LGAs Covered, Pending Approvals).
        - **Focused Charts & Feeds**: Performance charts and activity feeds are filtered to show data only from within that state.
    - **LGA (Field Officer) Dashboard**:
        - **Task-Oriented Metrics**: Focuses on the individual user's workload, such as "My Assigned Activities," "Completed this Month," and "Pending Reports."
        - **Direct Actions**: Prominent buttons to "Report Activity" or "Submit Weekly Report," streamlining the primary tasks of a field officer.

### 3.2. Activity Management

This is the core operational hub of RCAP, where all health activities are planned, tracked, and managed.

- **Purpose**: To provide a standardized, transparent lifecycle for every public health activity, from draft to completion.
- **Functionality**:
    - **Activity List View**:
        - **Search & Filtering**: A powerful search bar and a slide-out filter panel allow users to find specific activities by date range, status, type, and organization.
        - **Bulk Actions**: Users can select multiple activities via checkboxes to perform bulk actions like changing status (Approve, Reject) or deleting.
        - **Card-Based UI**: Each activity is presented as a detailed card, showing its title, status, organization, location, type, and key dates.
        - **Quick Actions**: Individual cards have icons for quick navigation to view details, edit, or delete.
    - **Create/Edit Activity Form**:
        - **Multi-Step & Multi-Card Form**: A guided form broken down into logical sections (Details, Logistics, Attachments) for a clear user experience.
        - **Rich Inputs**: Utilizes a variety of form controls, including text inputs, text areas, select dropdowns (for state, LGA, type), date pickers with calendar popovers, and a drag-and-drop file uploader.
        - **Dynamic Fields**: The LGA dropdown is dynamically populated based on the selected state.
        - **Client-Side Validation**: Uses `zod` for robust, real-time form validation with clear error messages.
        - **Submission States**: The form includes distinct actions for "Save as Draft" and "Submit for Approval," with clear visual feedback (loading spinners, success messages) after submission.
    - **Activity Detail Page**:
        - **Comprehensive Overview**: A read-only, detailed view of a single activity, including all its fields, status, and key dates.
        - **Logical Grouping**: Information is grouped into sections like "Activity Details," "Logistics," and "Attachments" for easy reading.
        - **Clear Actions**: A prominent "Edit Activity" button allows for easy updates.

### 3.3. Organisation Management

This module allows administrators to define and manage the hierarchical structure of the entities using the platform.

- **Purpose**: To digitally replicate the real-world administrative structure of health organizations, enabling proper data aggregation and permission control.
- **Functionality**:
    - **Organisation List View**:
        - **Data Table**: Presents all organisations in a detailed table with columns for name, category, level, members, activities, status, and parent organisation.
        - **Advanced Filtering**: Users can filter the table by level, category, and status.
        - **Bulk Selection**: Checkboxes allow for the selection of multiple organisations for bulk actions.
        - **Row-Level Actions**: An actions menu (`...`) on each row provides options to "View Details," "Edit," "Link/Unlink from Parent," and "Suspend."
    - **Create/Edit Organisation Form**: A dedicated form for adding new organisations, specifying their name, category (Govt, NGO, CSO), and level (Federal, State, LGA). It includes logic to conditionally require a parent organisation for State and LGA levels.
    - **Organisation Detail Page**:
        - **360-Degree View**: A dashboard-style page for a single organisation, showing its key metrics, team members, and a feed of its recent activities. This provides a complete snapshot of an organisation's health and performance.

### 3.4. Team Directory

This page serves as a central registry for all users on the platform.

- **Purpose**: To manage user access, view team composition, and facilitate communication.
- **Functionality**:
    - **Visual Grid Layout**: Displays team members as profile cards, showing their photo, name, role, team, and status (Active/Invited).
    - **Search & Pagination**: A search bar allows for quickly finding members, and pagination controls handle large numbers of users.
    - **Invite Members**: A primary action button opens a dialog to invite new members by entering their email addresses or uploading a CSV file and assigning them a role.
    - **Individual & Bulk Actions**:
        - **Individual Actions**: Each user card has a menu with options to "View Profile," "Edit Permissions," or "Remove User."
        - **Bulk Actions**: A "Select all" checkbox enables bulk editing of roles or bulk removal of users.
    - **Direct Communication**: A "Message" button on each card opens a dialog to send a direct message to that team member.

### 3.5. Communication Hub (Announcements & Messages)

These modules provide structured channels for internal communication, reducing reliance on external tools.

- **Purpose**: To centralize all official communication, ensuring information is disseminated effectively and securely.
- **Functionality**:
    - **Announcements Page**:
        - **Tabbed Filtering**: Users can filter announcements by category (Platform Update, Federal, State, LGA).
        - **Visual Cards**: Each announcement is displayed as a card with a distinct icon and color based on its type, showing the title, a content snippet, author, and date. "Unread" badges highlight new information.
        - **Detail View**: Clicking an announcement leads to a full-page view with the complete content, attachments, and a list of related announcements.
    - **Messages Page**:
        - **Two-Pane Layout**: A classic messaging interface with a list of conversations on the left and the selected conversation's message history on the right.
        - **Conversation Management**: Searchable inbox with indicators for unread messages. Users can compose new messages.
        - **Threaded View**: Messages within a conversation are displayed chronologically, with clear distinction for the current user's messages.
        - **Message Actions**: Options to reply and forward messages are available.

### 3.6. Reports & Analytics

This module focuses on data visualization and insight generation.

- **Purpose**: To transform raw activity data into actionable intelligence for decision-makers.
- **Functionality**:
    - **Interactive Dashboard**: A central dashboard featuring multiple data visualization components:
        - **Activity Trends**: A bar chart showing activity volume over different time periods (Week, Month, Year).
        - **Type Distribution**: A progress-bar based chart showing the proportion of different activity types.
        - **Status Breakdown**: Key metrics on the number of approved, submitted, and draft activities.
        - **Geographic Distribution**: A bar chart breakdown of activity counts by state/location.
    - **AI Report Generation**:
        - **Quick Templates**: A section with "Quick Report Templates" (e.g., Weekly Summary, Performance Analysis).
        - **Genkit Integration**: Clicking a template triggers a Genkit flow that sends a curated JSON payload of activity data to a generative AI model.
        - **Generated Content**: The AI returns a formatted narrative report analyzing trends and providing recommendations, which is then displayed on a dedicated page.
    - **PDF Export**: A "Download PDF" feature uses `jsPDF` and `jspdf-autotable` to generate a client-side PDF summary of the key charts and data tables.

### 3.7. Settings

A comprehensive, multi-page section for managing user and organizational preferences.

- **Purpose**: To give users and administrators granular control over the platform's behavior and their personal experience.
- **Functionality**:
    - **Account**: Manage personal info, password, and account deletion.
    - **Organisation**: Manage the organisation's profile, branding (logo and primary color), and member access roles.
    - **Hierarchy**: A unique visual editor for defining the administrative tiers of the organisation, with presets for common structures (e.g., National Ministry).
    - **Notifications**: Fine-grained control over which notifications to receive (e.g., Approvals, Alerts) and through which channels (Email, SMS, Push).
    - **Appearance & Data**: Toggles for accessibility (Reduced Motion) and data settings (Auto-sync).
    - **Billing**: A page to view the current subscription plan and upgrade.

---

## 4. Future / Conceptual Features

The prototype includes placeholder pages for planned features to illustrate the long-term vision of RCAP.

- **AI Planning**: A module to analyze implementation plans and automatically suggest KPIs.
- **Resource Management**: A hub for scheduling personnel, equipment, and tracking budgets.
- **Training & Development**: A center for creating, managing, and tracking training courses and certifications.
- **Integrations & APIs**: A future hub for connecting RCAP with external systems like DHIS2.
- **Research Lab**: An advanced analytics environment for epidemiologists to conduct custom research.
