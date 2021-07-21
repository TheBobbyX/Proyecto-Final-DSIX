FROM node:16-alpine

WORKDIR /code

ADD ./package.json package.json
RUN npm install
ADD . .

EXPOSE 4000

CMD ["npm", "run", "dev"]