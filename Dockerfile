FROM node:21-alpine

WORKDIR /app

COPY package.* ./
RUN npm install

COPY . .
RUN npm run build
RUN apk add --no-cache ghostscript

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]