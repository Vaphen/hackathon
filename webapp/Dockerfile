FROM node:15.0.1-alpine3.10 AS build

WORKDIR /app
COPY package*.json /app/

RUN npm install

COPY . /app

RUN npm run build -- --outputPath=./dist/ --base-href=/webapp/

FROM bitnami/nginx

COPY --from=build /app/dist/ /app
