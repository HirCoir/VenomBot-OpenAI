# Use the official Node.js 20 slim image as base
FROM node:20
# Definir las variables de entorno
ARG TOKEN=""
ARG OPENAI_SERVER=""
ARG MODEL=""
RUN apt update
RUN apt install -y chromium
WORKDIR /home/app
RUN mkdir chats; mkdir temp
COPY package*.json ./
RUN npm install
COPY . .
RUN echo "TOKEN=$TOKEN" > .env && \
    echo "OPENAI_SERVER=$OPENAI_SERVER" >> .env && \
    echo "MODEL=$MODEL" >> .env && \
    echo "PIPER_API_URL=$PIPER_API_URL" >> .env
CMD ["node", "app.js"]
