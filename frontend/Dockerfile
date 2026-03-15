# STAGE 1: Build the React app
FROM node:18-alpine as build  # First stage called 'build'

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build the app (creates 'build' folder with optimized files)
RUN npm run build

# STAGE 2: Serve with nginx (lightweight web server)
FROM nginx:alpine

# Copy built files from stage 1 to nginx's serving folder
COPY --from=build /app/build /usr/share/nginx/html

# Nginx uses port 80 by default
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]