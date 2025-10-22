# === STAGE 1: Build Dependencies ===
FROM node:20-slim AS deps
WORKDIR /app

# Install dependencies based on the lock file.
COPY package.json package-lock.json* ./
RUN npm ci

# === STAGE 2: Build Application ===
FROM node:20-slim AS builder
WORKDIR /app

# Copy dependencies from the 'deps' stage.
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application source code.
COPY . .

# Build the Next.js application.
RUN npm run build

# === STAGE 3: Production Runner ===
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy the standalone Next.js server output.
# COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set the user to a non-root user for security.
USER nextjs

EXPOSE 3000

ENV PORT 3000

# Start the Next.js application.
CMD ["node", "server.js"]