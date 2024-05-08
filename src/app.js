const express = require('express');
const app = express();
const axios = require('axios');
const { createBot, createProvider, MemoryDB, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const { BaileysProvider, handleCtx } = require('@bot-whatsapp/provider-baileys');

// Función para verificar si una fecha es la fecha de hoy (comparando solo el día)
const esFechaDeHoy = (fechaString) => {
    const fecha = new Date(fechaString);
    const fechaHoy = new Date();
    return fecha.toDateString() === fechaHoy.toDateString();
};

// Definir los flujos para las nuevas palabras clave y respuestas
const flowBienvenida = addKeyword(['kiki']).addAction(async (ctx, { flowDynamic }) => {
    return flowDynamic([`¡Hola! ¿En qué podemos ayudarte?
En breve serás atendido por un asesor.`]);
});

const consultarDatos = async () => {
    try {
        const response = await axios.get('http://146.190.45.149:4040/api/listar');
        console.log('Datos obtenidos desde la URL:');
        const datosFiltrados = response.data.filter(entry => esFechaDeHoy(entry.inicio)); // Filtrar por fecha de hoy
        console.log(datosFiltrados);
        return datosFiltrados;
    } catch (error) {
        console.error('Error al obtener datos desde la URL:', error.message);
        return [];
    }
};

const enviarMensajes = async (datosFiltrados, provider) => {
    datosFiltrados.forEach(async (entry) => {
        const phoneNumberToSend = entry.phone;
        // Verificar si el mensaje debe enviarse (mensaje !== '0')
        if (entry.mensaje !== '0') {
            const messageToSend = `Buenas!\nLe recordamos que posee una cita en Barbería El Capitán \ncon: ${entry.stylistName}\nHorario: ${entry.inicio}`;
            try {
                await provider.sendText(`${phoneNumberToSend}@s.whatsapp.net`, messageToSend);
                console.log(`Mensaje automático enviado correctamente a ${phoneNumberToSend}: ${messageToSend}`);
                // Actualizar el campo 'mensaje' a '0'
                try {
                    await axios.put(`http://146.190.45.149:4040/api/clients/${entry.id}`, {
                        mensaje: '0'
                    });
                    console.log(`Campo 'mensaje' actualizado a '0' para el cliente con ID ${entry.id}`);
                } catch (error) {
                    console.error(`Error al actualizar el campo 'mensaje' para el cliente con ID ${entry.id}: ${error.message}`);
                }
                // Enviar datos (número de teléfono y mensaje) después de enviar el mensaje
                await enviarDatos(phoneNumberToSend, messageToSend);
            } catch (error) {
                console.error(`Error al enviar mensaje automático a ${phoneNumberToSend}: ${error.message}`);
            }
        } else {
            console.log(`No se envió mensaje a ${phoneNumberToSend} porque el campo 'mensaje' es igual a '0'.`);
        }
    });
};


// Lógica principal
const main = async () => {
    const provider = createProvider(BaileysProvider);
    provider.initHttpServer(53);

    provider.http.server.post('/send-message', handleCtx(async(bot, req, res)=>{
        try {
            const { phoneNumber, message } = req.body;
            if (!phoneNumber || !message) {
                throw new Error('Número de teléfono o mensaje no proporcionado');
            }
            await bot.sendMessage(phoneNumber, message, {});
            res.end('Mensaje enviado correctamente');
        } catch (error) {
            console.error('Error al enviar mensaje:', error.message);
            res.end('Error al enviar mensaje');
        }
    }))
    
    
    // Llamar a la función de consulta y envío de mensajes cada minuto
    setInterval(async () => {
        try {
            const datosFiltrados = await consultarDatos();
            await enviarMensajes(datosFiltrados, provider);
        } catch (error) {
            console.error('Error en la lógica principal:', error.message);
        }
    }, 3600000); // 60 minutos
//}, 5000); // 5 segundos


    // Inicializar el bot con todos los flujos, incluida la respuesta predeterminada y los comandos disponibles
    const bot = await createBot({
        flow: createFlow([flowBienvenida]),
        database: new MemoryDB(),
        provider
    });
};

// Llamar a la función principal
main();