# Use Debian-based Node image (required for ffmpeg)
FROM node:20-bullseye

# Install system dependencies
RUN apt-get update && \
    apt-get install -y ffmpeg python3 python3-pip && \
    pip3 install yt-dlp && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy rest of the backend code
COPY . .

# Expose port (Render will inject PORT env var)
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
