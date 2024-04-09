require('dotenv').config(); // Carga las variables de entorno desde el archivo .env si existe

const fs = require('fs');
const venom = require('venom-bot');
const axios = require('axios');

venom
  .create({
    session: 'session-name' // nombre de la sesión
  })
  .then((client) => start(client))
  .catch((error) => {
    console.log(error);
  });

// Función para cargar el chat del usuario desde un archivo JSON
function loadChat(message) {
  const filePath = `chats/${message.from}.json`;
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

// Función para enviar archivos de audio a través de WhatsApp
async function sendAudio(client, message, audioData) {
  const filePath = `temp/${Math.random().toString(36).substring(7)}.mp3`;
  fs.writeFileSync(filePath, audioData, 'base64');
  await client.sendVoice(message.from, filePath);
  fs.unlinkSync(filePath); // Eliminamos el archivo después de enviarlo
}

// Función para limpiar comillas del contenido antes de enviarlo a Piper
function cleanForPiper(text) {
  return text.replace(/['"]/g, ''); // Elimina comillas simples y dobles
}

async function start(client) {
  client.onMessage(async (message) => {
    if (!message.isGroupMsg) {
      if (message.body.toLowerCase() === '/clear') {
        const filePath = `chats/${message.from}.json`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Eliminamos el archivo del historial
          await client.sendText(message.from, '¡Historial eliminado con éxito!');
        } else {
          await client.sendText(message.from, 'No hay historial que eliminar.');
        }
        return;
      }

      // Log del mensaje del usuario
      console.log('Mensaje del usuario:', message.body);

      // Cargamos el chat del usuario desde el archivo JSON
      let conversationMessages = loadChat(message);

      // Agregamos el elemento a la solicitud de la API sin guardarlo en el historial
      const systemMessage = { role: 'system', content: 'Eres un asistente llamado Laura, tus respuestas son directas. Tus respuestas siempre son directas, das información adicional solo si el usuario lo pide.' };

      // Añadimos el mensaje del usuario al historial
      conversationMessages.push({ role: 'user', content: message.body });

      // Limitamos el número de mensajes almacenados a 10
      if (conversationMessages.length > 10) {
        conversationMessages.shift(); // Eliminamos el mensaje más antiguo
      }

      // Guardamos el chat del usuario en un archivo JSON
      const filePath = `chats/${message.from}.json`;
      fs.writeFileSync(filePath, JSON.stringify(conversationMessages, null, 2)); // 2 espacios para indentación

      // Ejecutamos el comando curl para obtener la respuesta de la API
      try {
        const CAPROVER_API_KEY = process.env.CAPROVER_API_KEY;
        const CAPROVER_API_URL = process.env.CAPROVER_API_URL;

        const response = await axios.get(`${CAPROVER_API_URL}/api/v1/apps`, {
          headers: {
            'Authorization': `Bearer ${CAPROVER_API_KEY}`
          }
        });

        // Log de la salida de la API de CapRover
        console.log('Salida de la API de CapRover:', response.data);

        // Ejemplo de cómo puedes usar la respuesta de la API de CapRover en tu aplicación
        // Aquí puedes realizar operaciones adicionales según tus necesidades

        // Enviamos un mensaje al usuario para indicar que la operación fue exitosa
        await client.sendText(message.from, 'Operación exitosa.');

      } catch (error) {
        console.error('Error al realizar la solicitud a la API de CapRover:', error);
        await client.sendText(message.from, 'Hubo un error al procesar tu solicitud.');
      }
    }
  });
}
