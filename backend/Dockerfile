FROM node:16-alpine

WORKDIR /app

COPY package*.json .

RUN npm i

COPY . .

RUN npm run build

ENV NODE_ENV=prod
EXPOSE 8080

CMD [ "npm", "start" ]