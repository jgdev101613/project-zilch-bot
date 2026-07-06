FROM node:18-slim

# Install system-level FFmpeg and necessary audio codecs
RUN apt-get update && apt-get install -y ffmpeg libopus-dev build-essential && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
CMD ["npm", "start"]