FROM node:20-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install

COPY . .

RUN npm run test

RUN npm run build

FROM nginx:1.21.3-alpine

COPY --from=builder /app/build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY ./ssl/certificate.crt /etc/nginx/ssl/certificate.crt

COPY ./ssl/private.key /etc/nginx/ssl/private.key

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
