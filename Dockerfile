# --------- STAGE 1: Angular Build ---------
FROM node:18-slim as builder

WORKDIR /app

# Copy frontend code
COPY frontend/ ./frontend/

# Install Angular CLI if not already installed
RUN npm install -g @angular/cli

# Build frontend
WORKDIR /app/frontend
RUN npm install
RUN ng build --configuration production


# --------- STAGE 2: Backend & Runtime Setup ---------
FROM node:18-slim

# Install required languages
RUN apt-get update && apt-get install -y \
  build-essential \
  python3 python3-pip \
  openjdk-17-jdk \
  golang \
  curl \
  && apt-get clean \
  && ln -s /usr/bin/python3 /usr/bin/python

# Set working directory
WORKDIR /app

# Copy backend code
COPY backend/ ./backend/
WORKDIR /app/backend

# Copy built frontend from previous stage
COPY --from=builder /app/frontend/dist/ ./public/

# Install backend dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
