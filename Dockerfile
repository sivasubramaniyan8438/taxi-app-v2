# ===== Stage 1: Build React Frontend =====
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

COPY public/package.json ./
RUN npm install

COPY public ./
RUN npm run build

# ===== Stage 2: Backend + Serve Frontend =====
FROM node:20-alpine

WORKDIR /app

# Install backend deps
COPY package.json ./
RUN npm install

# Copy backend source
COPY src ./src

# Copy built frontend
COPY --from=frontend-builder /frontend/build ./public/build

# Create data directory for SQLite
RUN mkdir -p /data

EXPOSE 3000

CMD ["node", "src/index.js"]
