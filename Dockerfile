FROM node:16-alpine AS BUILD_IMAGE

ARG PORT

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma
COPY .env ./.env

RUN npm ci

COPY . .

RUN npm run build
RUN npm prune --production

FROM node:16-alpine

ENV NODE_ENV "production"

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/.env ./.env
COPY --from=BUILD_IMAGE /usr/src/app/package*.json ./
COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

EXPOSE $PORT
CMD ["npm", "run", "start:prod"]
