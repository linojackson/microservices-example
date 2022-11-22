FROM node:18.12.1

RUN mkdir -p /usr/micro-employee && chown -R node:node /usr/micro-employee

WORKDIR /usr/micro-employee

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3000
