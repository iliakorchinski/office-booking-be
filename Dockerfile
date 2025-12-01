# -------- BUILD STAGE --------
    FROM node:22 AS builder

    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install
    
    COPY . .
    
    RUN npm run build
    
    
    # -------- PRODUCTION STAGE --------
    FROM node:22 AS production
    
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install --only=production
    
    # Copy built code from the builder
    COPY --from=builder /app/dist ./dist
    
    # Prisma needs schema in production
    COPY --from=builder /app/prisma ./prisma
    
    CMD ["node", "dist/main.js"]