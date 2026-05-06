FROM node:22-slim

WORKDIR /app

# Copy all source files
COPY server/ ./server/
COPY *.html ./
COPY *.jsx ./
COPY *.css ./
COPY assets/ ./assets/

# Install build tools + production deps
RUN cd server && \
    apt-get update -qq && \
    apt-get install -y -qq python3 make g++ && \
    npm ci --omit=dev && \
    npm prune --omit=dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "server/index.js"]
