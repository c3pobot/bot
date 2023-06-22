FROM node:16-alpine AS builder
COPY package*.json ./
# don't install dev dependencies for the docker image
RUN npm install --omit=dev

FROM node:16-alpine AS app
WORKDIR /app

COPY --from=builder node_modules node_modules/
COPY . .

RUN apk update && \
  # wrap process in --init in order to handle kernel signals
  # https://github.com/krallin/tini#using-tini
  apk add --no-cache tini && \
  rm -rf /var/cache/apk/*

USER node
ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "node", "index.js" ]
