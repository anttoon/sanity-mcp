FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS release

WORKDIR /app

# Copy package files and built code
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install production dependencies only
RUN npm ci --omit=dev

# Set environment variables
ENV NODE_ENV=production

# Make the entry point executable
RUN chmod +x ./dist/index.js

# Expose port if needed (for HTTP transport)
# EXPOSE 3000

# Set the entry point
ENTRYPOINT ["node", "dist/index.js"] 