FROM node:16-alpine

WORKDIR /code

ADD ./package.json backend/package.json
RUN npm install --prefix backend/
ADD . .

EXPOSE 4000

CMD ["npm", "run", "dev", "--prefix", "backend/"]