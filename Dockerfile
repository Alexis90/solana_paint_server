# Use the official Node.js image
FROM node:18

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the application source code
COPY . .

# Expose the app port
EXPOSE 3000

CMD ["npm", "start"]