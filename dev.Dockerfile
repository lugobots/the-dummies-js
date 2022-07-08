FROM node:16 as Builder
EXPOSE 6004
CMD [ "npm", "run", "start" ]