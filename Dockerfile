FROM node:20-alpine AS builder
COPY package*.json ./
# don't install dev dependencies for the docker image
RUN npm install --omit=dev

FROM node:20-alpine AS app
LABEL org.opencontainers.image.source https://github.com/c3pobot/bot
WORKDIR /app
ENV NODE_PATH=/app
RUN apk update && \
  # wrap process in --init in order to handle kernel signals
  # https://github.com/krallin/tini#using-tini
  apk add --no-cache tini && \
  rm -rf /var/cache/apk/*

COPY --from=builder node_modules node_modules/
COPY package*.json ./
COPY index.js index.js
COPY src ./src

USER node
ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "node", "index.js" ]
