FROM node:slim
LABEL authors="miron"

WORKDIR /my-tour

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "bin/www"]
