# syntax=docker/dockerfile:1

# ==============================================================================
# Stage 1: Builder
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies (cached layer)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# ==============================================================================
# Stage 2: Production Runner
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install ONLY production dependencies (smaller image, faster startup)
RUN npm ci --omit=dev

# Create a non-root user for security best practices
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Expose the port the app runs on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
