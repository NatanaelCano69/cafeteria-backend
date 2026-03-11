# ---- Base Image ----
FROM node:20-alpine

# ---- App Directory ----
WORKDIR /src

# ---- Install Dependencies ----
# Copy only package files first (better docker caching)
COPY ../package*.json ./

RUN npm install --production

# ---- Copy App Source ----
COPY . .

# ---- Expose Port ----
EXPOSE 8090

# ---- Start Service ----
CMD ["node", "server.js"]