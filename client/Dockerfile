FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Adicionamos a flag para ignorar conflitos de peer dependencies
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "start"]