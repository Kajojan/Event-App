FROM node:20-alpine as builder

WORKDIR /app


ARG REACT_APP_API_URL
ARG REACT_APP_DOMAIN
ARG REACT_APP_CLIENT_ID
ARG REACT_APP_SECRET
ARG REACT_APP_AUDIENCE
ARG REACT_APP_AUTH_URL
ARG REACT_APP_GOOGLE_MAPS_API_KEY

ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_DOMAIN=${REACT_APP_DOMAIN}
ENV REACT_APP_CLIENT_ID=${REACT_APP_CLIENT_ID}
ENV REACT_APP_SECRET=${REACT_APP_SECRET}
ENV REACT_APP_AUDIENCE=${REACT_APP_AUDIENCE}
ENV REACT_APP_AUTH_URL=${REACT_APP_AUTH_URL}
ENV REACT_APP_GOOGLE_MAPS_API_KEY=${REACT_APP_GOOGLE_MAPS_API_KEY}

COPY package.json yarn.lock ./

RUN npm install

COPY . .

RUN npm run test

RUN npm run build

FROM nginx:1.21.3-alpine

COPY --from=builder /app/build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# COPY ./ssl/certificate.crt /etc/nginx/ssl/certificate.crt

# COPY ./ssl/private.key /etc/nginx/ssl/private.key

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
