#use LTS for base image
FROM node:18

#set working directory
WORKDIR /usr/src/user-service

# Copy package.json and package-lock.json before installing dependencies
COPY package*.json ./

# Install dependencies for production
RUN npm ci --omit=dev

#copy src
COPY . .

#expose port
EXPOSE 3002

#start server
CMD [ "node", "server.js" ]

