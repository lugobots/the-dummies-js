FROM node:16

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 6004
CMD [ "npm", "run", "start" ]