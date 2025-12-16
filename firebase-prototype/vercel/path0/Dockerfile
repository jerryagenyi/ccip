# === Stage 1: Build ===
# Use a specific Node.js version for reproducibility
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies using npm ci for reproducibility
# Also install patch-package
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the Next.js application for production
RUN npm run build

# === Stage 2: Production ===
# Use a lightweight Node.js image
FROM node:20-alpine AS runner

WORKDIR /app

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# The standalone output is not used here to ensure `node_modules` are correctly packaged.
# Adjust if you switch to standalone output mode in next.config.js.

# Set the correct ownership for the app folder
USER nextjs

# Expose the port the app will run on
EXPOSE 3000

# The command to start the Next.js production server
CMD ["npm", "start"]
