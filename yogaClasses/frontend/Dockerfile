FROM node:alpine

WORKDIR /app/frontend

COPY package*.json ./

RUN npm config set legacy-peer-deps true
RUN npm i

COPY . .


CMD ["npm", "start"]