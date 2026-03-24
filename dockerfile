FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY src/.env ./src/.env

EXPOSE 3001

CMD ["node", "--env-file=src/.env","src/server.js"]