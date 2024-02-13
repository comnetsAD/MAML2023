FROM node:16-alpine

WORKDIR /app

COPY package*.json .

RUN npm i

COPY . .

RUN npm run build
EXPOSE 8080

CMD [ "npm", "start", "--", "--port", "8080"]