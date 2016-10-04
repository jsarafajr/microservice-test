FROM node:6.6.0

RUN mkdir /app
WORKDIR /app

RUN npm install -g typescript
RUN npm install -g nodemon

COPY . /app
RUN npm install

CMD npm start
