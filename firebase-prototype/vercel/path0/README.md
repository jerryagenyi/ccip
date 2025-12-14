# CCIP - Crisis Communication Intelligence Platform

This is a Next.js starter project for **CCIP**, a platform designed to streamline the management and coordination of public health activities. It serves as a central hub for various organizational levels, from federal ministries to local field officers, to plan, execute, and report on health-related initiatives.

The platform is built with a modern tech stack including Next.js, React, ShadCN, and Tailwind CSS, providing a responsive and intuitive user experience.

## Target Audience

While initially designed for government health bodies, CCIP is flexible enough to be adopted by:

- **Non-Profit Organisations (NPOs)**: For managing community health programs, grant-funded projects, and volunteer activities.
- **Civil Society Organisations (CSOs)**: To coordinate grassroots campaigns, awareness drives, and local health initiatives. The platform's structure allows a small CSO to start a movement and later link up with larger organizations for broader impact.
- **State and Local Governments**: States or local bodies can adopt the platform independently and later connect to a federal or national hierarchy as it becomes available.

## Key Features

- **Dashboard**: A role-based overview of key metrics, performance trends, and recent activities.
- **Activity Management**: Create, track, and manage health activities from draft to completion.
- **Team Directory**: Manage team members, invite new users, and handle permissions.
- **Organisation Management**: Link organizations in a hierarchy (e.g., Federal > State > LGA), transfer ownership, and manage organizational profiles.
- **AI-Powered Reporting**: Generate insightful reports on activity trends, geographic distribution, and more.

## User Roles & Access Levels

The platform supports a role-based access control (RBAC) system to ensure users only see and do what's relevant to their position.

- **Super Admin (Federal Level)**
  - **Access**: Full system-wide access.
  - **Capabilities**: Can manage all organizations, link states to the federal level, transfer ownership, manage all users, and view national-level reports and analytics. This role is intended for top-level administrators overseeing the entire platform.

- **State Admin / Coordinator**
  - **Access**: Full access within their own state's organization.
  - **Capabilities**: Can manage their state's profile, branding, and team members. They can approve activities submitted by LGAs within their state and manage the hierarchy of LGAs under them. They view state-specific dashboards and reports.

- **LGA / Field Officer**
  - **Access**: Limited to their assigned activities and local area.
  - **Capabilities**: Can create and submit activity reports for approval. They have a focused dashboard showing their assigned tasks, completed work, and pending reports.

- **Data Analyst / Epidemiologist**
  - **Access**: Primarily read-only access to activity and report data.
  - **Capabilities**: Can view and generate reports, analyze trends, and export data for further analysis. They typically do not have permission to create or approve activities.

## Getting Started

To get started with development, take a look at the main dashboard page located at `src/app/dashboard/page.tsx`.

## Production Deployment (CI/CD)

This project is equipped with a CI/CD pipeline using GitHub Actions to build and deploy a Docker image to a production environment managed by [Dokploy](https://dokploy.com/).

### Firebase Environment Variables

For the deployed application to connect to your Firebase project (Firestore, Auth, etc.), you **must** add your Firebase configuration as environment variables in your Dokploy service settings. Create the following variables in Dokploy:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### GitHub Secrets Setup

**Yes, you absolutely need these secrets.** They are required to securely automate your deployment. You must create the following secrets in your GitHub repository by navigating to **`Settings > Secrets and variables > Actions`** and clicking **`New repository secret`** for each one.

*   `GHCR_PAT`: A GitHub Personal Access Token (PAT) with `write:packages` scope. This is required to allow GitHub Actions to push the Docker image to the GitHub Container Registry.
    *   **How to create**: Go to your `GitHub Settings > Developer settings > Personal access tokens > Fine-grained tokens`.
    *   Create a new token, give it a name (e.g., "CCIP Deploy"), and select your repository.
    *   Under `Permissions > Repository permissions`, find "Packages" and grant it "Read and Write" access.
    *   Generate the token and copy it into the GitHub secret.

*   `DOKPLOY_WEBHOOK_URL`: The webhook URL provided by your Dokploy service. This is how GitHub Actions tells Dokploy that a new image is ready to be deployed.
    *   **How to get**: In Dokploy, go to your service's `Deployments` tab and copy the "Webhook URL".

*   `DOKPLOY_TOKEN`: The secret token associated with your Dokploy webhook. This secures the webhook, ensuring only GitHub Actions can trigger a deployment.
    *   **How to get**: This is the "Secret Token" displayed right below the webhook URL in Dokploy.

### Update Placeholders

Before the first deployment, you must replace the placeholder in `docker-compose.yml`:
*   `<owner>`: Replace this with your GitHub username or organization name (e.g., `ghcr.io/jerryagenyi/ccip-firebase:latest`).

### Docker Hub (Alternative)

If you prefer to use Docker Hub instead of GHCR:

1.  **Update `.github/workflows/deploy.yml`**:
    *   Comment out the `REGISTRY` and `IMAGE_NAME` variables under the `GHCR CONFIGURATION` section.
    *   Uncomment the variables under the `DOCKER HUB CONFIGURATION` section.
    *   In the "Log in" step, comment out the `GHCR_PAT` line and uncomment the `DOKPLOY_USERNAME` and `DOKPLOY_TOKEN` lines.

2.  **Create Docker Hub Secrets**: Create these secrets in your GitHub repo instead of `GHCR_PAT`:
    *   `DOCKERHUB_USERNAME`: Your Docker Hub username.
    *   `DOCKERHUB_TOKEN`: A Docker Hub access token with `Read, Write, Delete` permissions. Create it in `Docker Hub > Account Settings > Security`.

### Troubleshooting Checklist

*   **Build Fails (Cache Issues)**: If `npm ci` fails, delete the `package-lock.json` file and `node_modules` directory locally, run `npm install` to regenerate the lock file, and commit the changes.
*   **Permission Denied on VPS**: Ensure the user running the Docker daemon on your server has the correct permissions. Dokploy usually handles this, but it's a common issue in manual setups.
*   **Webhook Authentication Fails**: Double-check that `DOKPLOY_WEBHOOK_URL` and `DOKPLOY_TOKEN` are copied correctly into your GitHub secrets without extra spaces or characters.
*   **Image Not Found / Pull Error**:
    *   **GHCR**: Verify that your repository is public or that your `GHCR_PAT` has the correct `read:packages` permissions for private repositories.
    *   **Docker Hub**: Ensure your repository is public or that your deployment server is logged into Docker Hub with credentials that can access the private repository.
