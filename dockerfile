# Use Node.js LTS (Latest LTS version)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy project files
COPY . .

# Build the application
# RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]