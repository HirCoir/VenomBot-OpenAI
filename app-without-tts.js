require('dotenv').config(); // Para cargar las variables de entorno desde el archivo .env
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

// Función para guardar el chat del usuario en un archivo JSON
function saveChat(message, conversationMessages) {
  const filePath = `chats/${message.from}.json`;
  fs.writeFileSync(filePath, JSON.stringify(conversationMessages, null, 2)); // Pretty print
}

// Función para cargar el chat del usuario desde un archivo JSON
function loadChat(message) {
  const filePath = `chats/${message.from}.json`;
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

// Función para iniciar el bot y manejar los mensajes
async function start(client) {
  client.onMessage(async (message) => {
    if (!message.isGroupMsg) {
      // Comprobamos si el mensaje es para limpiar el historial
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

      // Cargamos el chat del usuario desde el archivo JSON
      let conversationMessages = loadChat(message);

      // Agregamos el nuevo mensaje del usuario al arreglo
      conversationMessages.push({ role: 'user', content: message.body });

      // Limitamos el número de mensajes almacenados a 10
      if (conversationMessages.length > 10) {
        conversationMessages.shift(); // Eliminamos el mensaje más antiguo
      }

      // Guardamos el chat del usuario en un archivo JSON
      saveChat(message, conversationMessages);

      // Ejecutamos el comando curl utilizando axios
      try {
        const response = await axios.post(process.env.OPENAI_SERVER, {
          model: process.env.MODEL,
          messages: conversationMessages
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.TOKEN}`
          }
        });

        // Extraemos el contenido de la respuesta del asistente
        const assistantResponse = response.data.choices[0].message.content;

        // Agregamos la respuesta del asistente al arreglo
        conversationMessages.push({ role: 'assistant', content: assistantResponse });

        // Limitamos el número de mensajes almacenados a 10
        if (conversationMessages.length > 10) {
          conversationMessages.shift(); // Eliminamos el mensaje más antiguo
        }

        // Guardamos el chat del usuario actualizado en un archivo JSON
        saveChat(message, conversationMessages);

        // Enviamos la respuesta del asistente al usuario
        await client.sendText(message.from, assistantResponse);
      } catch (error) {
        console.error('Error al realizar la solicitud a la API:', error);
      }
    }
  });
}
