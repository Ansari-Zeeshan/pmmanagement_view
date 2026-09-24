# Production Node.js Image for GKE Backend
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY . .

# Expose backend API port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "src/server.js"]
