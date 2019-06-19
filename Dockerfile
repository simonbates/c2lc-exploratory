FROM node:10-alpine as builder

WORKDIR /usr/src/app

COPY . ./

RUN npm install

RUN npx grunt build

FROM nginx:alpine

COPY --from=builder /usr/src/app/build /usr/share/nginx/html