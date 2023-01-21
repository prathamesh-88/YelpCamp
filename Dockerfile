FROM node:16

WORKDIR /usr/src/YelpCamp

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]