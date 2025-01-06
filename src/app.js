const express = require('express');
const app = express();
const axios = require('axios');
const { createBot, createProvider, MemoryDB, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const { BaileysProvider, handleCtx } = require('@bot-whatsapp/provider-baileys');
const moment = require('moment-timezone');

// Middleware para parsear el cuerpo de las solicitudes JSON
app.use(express.json());

// Configuración de la hora actual
const horaActual = moment().tz('America/Asuncion').format('HH:mm:ss');
console.log(`Hora actual del sistema: ${horaActual}`);

// Definir los flujos para las nuevas palabras clave y respuestas
const flowBienvenida = addKeyword(['kiki']).addAction(async (ctx, { flowDynamic }) => {
    return flowDynamic([`¡Hola! ¿En qué podemos ayudarte? En breve serás atendido por un asesor.`]);
});

// Verificación de la hora permitida
const esHoraPermitida = () => {
    const horaActual = moment.tz('America/Asuncion').hour();
    console.log(`Hora actual del sistema: ${horaActual}`);
    return horaActual >= 7 && horaActual <= 20;
};

// Cálculo de la diferencia de horas
const diferenciaHoras = (horaInicio) => {
    const horaActual = moment.tz('America/Asuncion');
    const horaCita = moment.tz(horaInicio, 'America/Asuncion');
    const dif = horaCita.diff(horaActual, 'hours');
    return dif;
};

// Función para enviar datos a la URL específica
const enviarDatos = async (phoneNumber, messageToSend) => {
    try {
        const response = await axios.post('http://146.190.45.149:1414/datos', {
            phoneNumber: phoneNumber,
            message: messageToSend
        });
        console.log(`Datos enviados correctamente: ${JSON.stringify(response.data)}`);
    } catch (error) {
        console.error(`Error al enviar datos: ${error.message}`);
    }
};

// Lógica principal
const main = async () => {
    try {
        const provider = createProvider(BaileysProvider);
        provider.initHttpServer(3000);

        provider.http.server.post('/send-message', handleCtx(async (bot, req, res) => {
            try {
                const { phoneNumber, message, mediaURL } = req.body;
                
                // Validación de los datos de entrada
                if (!phoneNumber || !message) {
                    throw new Error('Número de teléfono o mensaje no proporcionado');
                }

                if (typeof phoneNumber !== 'string' || typeof message !== 'string') {
                    throw new Error('Datos mal formateados');
                }

                await bot.sendMessage(phoneNumber, message, {
                    media: mediaURL || null // Solo se agrega el medio si está disponible
                });

                res.end('Mensaje enviado correctamente');
            } catch (error) {
                console.error('Error al enviar mensaje:', error.message);
                res.status(500).send(`Error al enviar mensaje: ${error.message}`);
            }
        }));

        // Inicializar el bot con todos los flujos, incluida la respuesta predeterminada y los comandos disponibles
        const bot = await createBot({
            flow: createFlow([flowBienvenida]),
            database: new MemoryDB(),
            provider
        });
    } catch (error) {
        console.error('Error en la función principal:', error.message);
    }
};

// Llamar a la función principal
main();
