FROM node:22-alpine AS runner

WORKDIR /app

# Copy all source files first
COPY server/ ./server/
COPY *.html ./
COPY *.jsx ./
COPY *.css ./
COPY assets/ ./assets/

# Install + rebuild native modules in one step
RUN cd server && \
    npm ci --omit=dev && \
    npm prune --omit=dev && \
    apk add --no-cache python3 make g++ && \
    npm rebuild better-sqlite3 && \
    apk del python3 make g++

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "server/index.js"]
