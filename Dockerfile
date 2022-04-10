FROM node:16 AS BUILD_IMAGE

ENV NODE_ENV "production"
ARG PORT

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci --include=dev
RUN npx prisma generate

COPY . .

RUN npm run build
RUN npm prune --production

EXPOSE $PORT
CMD ["npm", "run", "start:prod"]
