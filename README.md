
# VenomBot-OpenAI

VenomBot-OpenAI es un bot de WhatsApp utilizando Venom-Bot y la API de OpenAI para interactuar con los usuarios. Este proyecto guarda el historial de chat de cada usuario y responde a los mensajes utilizando un modelo de lenguaje de OpenAI.
## Información básica:
app-without-tts.js: Un bot simple que solo requiere la url /v1/chat/completions para funcionar.

app-without-json-chat.js: Un bot simple que usa la api de Piper para convertir el texto a voz pero este almacena los mensajes en una variable.

app.js: Un bot que usa la api de Piper para la conversión de voz y almacena los mensajes en la carpeta chats.
## Requisitos

- Node.js
- npm

## Instalación

### Clonar el Repositorio

Primero, clona el repositorio en tu máquina local:

```bash
git clone https://github.com/HirCoir/VenomBot-OpenAI.git
cd VenomBot-OpenAI
```

### Instalación de Node.js

#### Windows

Descarga e instala Node.js desde la [página oficial de Node.js](https://nodejs.org/).

#### Linux

Para distribuciones basadas en Debian (como Ubuntu), usa los siguientes comandos:

```bash
sudo apt update
sudo apt install nodejs npm
```

### Instalación de Dependencias

Una vez que tengas Node.js instalado, navega a la carpeta del proyecto y ejecuta el siguiente comando para instalar las dependencias necesarias:

```bash
npm install
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto y agrega las siguientes variables de entorno:

```
OPENAI_SERVER=https://openaidomain.tld/v1/chat/completions
MODEL=nombre_del_modelo
TOKEN=tu_token_de_autorizacion
```

- `OPENAI_SERVER`: La URL del servidor de OpenAI compatible.
- `MODEL`: El nombre del modelo que deseas utilizar.
- `TOKEN`: Tu token de autorización para acceder a la API.

## Ejecución

Para iniciar el bot, simplemente ejecuta el siguiente comando:

```bash
node index.js
```

## Uso

- Envía un mensaje al bot y este responderá utilizando el modelo de OpenAI configurado.
- Para borrar el historial de chat, envía el comando `/clear`.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para cualquier mejora o problema que encuentres.
## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.
```
