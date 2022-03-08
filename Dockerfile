FROM node:16-slim AS BUILD_IMAGE

ARG PORT

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y openssl

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci
RUN npx prisma generate

COPY . .

RUN npm run build
RUN du -sh node_modules/
RUN npm prune --production
RUN du -sh node_modules/

FROM node:16-slim

ENV NODE_ENV "production"

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/package*.json ./
COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

EXPOSE $PORT
CMD ["npm", "run", "start:prod"]
