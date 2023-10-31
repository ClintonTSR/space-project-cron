ARG NODE_VERSION=18.15-alpine3.17

FROM node:$NODE_VERSION as build

WORKDIR /usr/src/app

COPY src .
COPY package*.json ./
COPY tsconfig.json .

RUN npm ci && npm run build

FROM node:$NODE_VERSION as deps

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

FROM node:$NODE_VERSION as final

ARG NODE_ENV=production COMMIT_SHA=latest

ENV NODE_ENV=$NODE_ENV

WORKDIR /usr/src/app

USER node

COPY --from=deps --chown=node:node /usr/src/app/node_modules ./node_modules/
COPY --from=build --chown=node:node /usr/src/app/dist ./dist/
COPY package*.json ./

CMD ["node", "dist/main"]