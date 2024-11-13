# Use Node.js 18 LTS version as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/collaboration-service

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the port your service listens on
EXPOSE 3006

# Start the server
CMD ["node", "server.js"]
