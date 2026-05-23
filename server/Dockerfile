FROM node:22.17.0-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["/bin/bash","-c","npm run populate && npm run dev"]

