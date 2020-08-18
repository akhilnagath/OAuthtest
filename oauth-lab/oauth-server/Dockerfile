FROM node:12-slim

ARG PORT=3001
ENV PORT $PORT
EXPOSE $PORT

RUN npm i npm@latest -g

RUN mkdir /opt/app && chown node:node /opt/app
WORKDIR /opt/app

USER node
COPY . .
RUN npm install --no-optional && npm cache clean --force
ENV PATH /opt/app/node_modules/.bin:$PATH

CMD [ "node", "./index.js" ]
