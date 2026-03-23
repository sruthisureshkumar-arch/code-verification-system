# Use Node.js 18 on Debian Bullseye as the base OS
FROM node:18-bullseye

# Install C, C++, and Java compilers
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json files to install dependencies
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Expose the API port
EXPOSE 5000

# Start the Node.js server
CMD ["node", "server.js"]
