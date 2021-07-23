FROM node:16-alpine

WORKDIR /code

ADD ./package.json frontend/package.json
RUN npm install --prefix frontend/
ADD . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--prefix", "frontend/"]