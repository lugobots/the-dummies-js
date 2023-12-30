FROM node:18.19.0-slim as Builder

WORKDIR /app
COPY package*.json ./

# first we install eveyrything, including dev dependecies
RUN npm install
COPY .. .

# now we can generate the prod files
RUN npm run tsc

FROM node:18.19.0-slim
# and, for many reasons, we copy only the essencial!
COPY --from=Builder /app/package*.json /app/
COPY --from=Builder /app/.dist /app/.dist
WORKDIR /app
RUN npm install --production


CMD [ "npm", "run", "start" ]