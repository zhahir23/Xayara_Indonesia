FROM node:20-alpine AS client-builder
WORKDIR /build
COPY client/package.json ./client/
RUN npm install --prefix client
COPY client/ ./client/
COPY referensi/ ./referensi/
RUN npm run --prefix client build

FROM node:20-alpine
WORKDIR /app

COPY server/package.json ./
RUN npm install --omit=dev

COPY server/ ./
COPY --from=client-builder /build/client/dist ./public

EXPOSE 5000
CMD ["node", "server.js"]
