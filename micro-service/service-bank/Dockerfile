FROM node:18-alpine
WORKDIR /home/app/test
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3506
CMD ["npm", "start"]
