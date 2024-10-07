FROM node:20

WORKDIR /usr/src/blinkord-bot

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g ts-node

RUN npm install -g pm2

CMD ["pm2-runtime", "start", "pm2.config.js"]