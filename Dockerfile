FROM node:16 AS BUILD_IMAGE

ARG PORT

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci
RUN npx prisma generate

COPY . .

RUN npm run build
RUN npm prune --production

FROM node:16-slim

ENV NODE_ENV "production"

WORKDIR /usr/src/app

COPY package*.json ./
COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

EXPOSE $PORT
CMD ["npm", "run", "start:prod"]
