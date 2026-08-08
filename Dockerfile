# Use a Node.js base image
FROM node:latest

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire app to the Docker image
COPY . .

# Build the Angular app for production
RUN npm run build

# Install serve to serve the production build
RUN npm install -g serve

# Expose the HTTP port (Apache handles off https to this)
EXPOSE 3002

# Serve the production build over HTTP
CMD ["serve", "-s", "-l", "3002", "-C", "dist/brett-angular/browser"]
