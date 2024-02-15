FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .
RUN npm ci 

ENV PORT=3000

USER node
CMD npm run dev