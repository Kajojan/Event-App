FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install 


COPY . .

# RUN npm test

EXPOSE 4000

CMD ["node", "app.js"]
