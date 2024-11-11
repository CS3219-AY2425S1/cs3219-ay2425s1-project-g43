FROM node:18-alpine
WORKDIR /usr/src/ai-service
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3007
CMD ["node", "server.js"]