# --- Stage 1: Build ---
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build the Next.js app
RUN npm run build

# --- Stage 2: Production image ---
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Correct ENV syntax to avoid warnings
ENV NODE_ENV=production
ENV PORT=3000

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
