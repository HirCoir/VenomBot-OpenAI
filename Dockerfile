# Use the official Node.js 20 slim image as base
FROM node:20
# Definir las variables de entorno
ARG TOKEN=""
ARG OPENAI_SERVER=""
ARG MODEL=""

RUN apt update
RUN apt install -y chromium
# Establece el directorio de trabajo dentro del contenedor
WORKDIR /home/app
RUN mkdir chats
# Copia el archivo package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Crear el archivo .env durante la construcción
RUN echo "TOKEN=$TOKEN" > .env && \
    echo "OPENAI_SERVER=$OPENAI_SERVER" >> .env && \
    echo "MODEL=$MODEL" >> .env && \
    echo "PIPER_API_URL=$PIPER_API_URL" >> .env

# Comando para ejecutar la aplicación
CMD ["node", "app.js"]
