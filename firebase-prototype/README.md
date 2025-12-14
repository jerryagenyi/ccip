# CCIP - Crisis Communication Intelligence Platform

This project is a high-fidelity **UI/UX prototype** for the Crisis Communication Intelligence Platform (CCIP). It serves as a visual guide to demonstrate the intended user experience, interface design, and application flow for the production application.

The actual product vision, feature set, and production requirements are defined in the **Product Requirements Document (PRD)**. This prototype is the visual and interactive representation of that vision.

## Prototype Technology Stack

*   **Framework**: Next.js & React (with App Router)
*   **UI Components**: ShadCN UI & Tailwind CSS
*   **AI/Backend Simulation**: Google Genkit
*   **Authentication & DB (Simulated)**: Firebase Auth & Firestore

## Key Features Demonstrated

- **Role-Based Dashboards**: Interactive views for Federal, State, and LGA-level users.
- **Activity & Organisation Management**: UI for creating, managing, and viewing campaigns and organizations.
- **Team Directory**: Interface for managing team members and invitations.
- **AI-Powered Semiotic Analysis**: A user flow demonstrating how a user would assess communication risk.
- **Comprehensive Settings**: Detailed UI for managing user, organization, and application settings.

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
*   **Firebase Connection Error**: Ensure all `NEXT_PUBLIC_FIREBASE_*` environment variables are correctly set in your local `.env` file for development and in your Dokploy service settings for production. Missing or invalid keys will cause the app to fail.