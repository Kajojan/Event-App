FROM node:16-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

ENV PORT=4000

RUN npm test 

EXPOSE 4000

CMD ["node", "app.js"]
