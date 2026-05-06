FROM node:22-alpine AS runner

WORKDIR /app

# Install production dependencies
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm ci --omit=dev && npm prune --omit=dev

# Copy server source
COPY server/ ./server/

# Rebuild native modules for target platform
RUN apk add --no-cache python3 make g++ && \
    cd server && npm rebuild better-sqlite3 && \
    apk del python3 make g++

# Copy static frontend assets (served by Express)
COPY *.html ./
COPY *.jsx ./
COPY *.css ./
COPY assets/ ./assets/

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "server/index.js"]

