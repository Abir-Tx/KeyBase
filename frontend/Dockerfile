# Use Node.js
FROM node:20-alpine

# Set working directory
WORKDIR /app

RUN apk add --no-cache curl

# Copy package.json and package-lock.json first (cache layer)
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose Next.js dev port
EXPOSE 3000

# Run dev server by default
CMD ["npm", "run", "dev"]
