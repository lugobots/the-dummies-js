FROM node:16 as Builder
EXPOSE 6004
WORKDIR /app


CMD [ "npm", "run", "start" ]