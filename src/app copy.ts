import { createBot, createProvider, MemoryDB, createFlow, addKeyword } from '@bot-whatsapp/bot';
import { BaileysProvider } from '@bot-whatsapp/provider-baileys';

// Definir los flujos para las nuevas palabras clave y respuestas
const flowBienvenida = addKeyword('Hola').addAnswer('Buenas! Bienvenido');
const flowOtraPalabra = addKeyword('ola').addAnswer('Buenas! Bienvenido');
const flowPromo1 = addKeyword('1').addAnswer('En breve sera contactado con un asesor');
const flowPromo2 = addKeyword('2').addAnswer('La app sera su mejor opcion, En breve sera contactado');
const flowPromo3 = addKeyword('3').addAnswer('En breve sera contactado por un desarrollador');

// Definir el flujo para los comandos disponibles
const flowComandos = addKeyword('').addAnswer(
    `Te comparto los siguientes comandos que puedes realizar:
👉 (1) Contactar con vendedor
👉 (2) Solicitar una prueba de la app
👉 (3) Contacto - Contacta al desarrollador`
);

const main = async () => {
    const provider = createProvider(BaileysProvider);
    provider.initHttpServer(3002);

    // Inicializar el bot con todos los flujos, incluida la respuesta predeterminada y los comandos disponibles
    const bot = await createBot({
        flow: createFlow([flowBienvenida, flowOtraPalabra, flowPromo1, flowPromo2, flowPromo3, flowComandos]), 
        database: new MemoryDB(),
        provider
    });

    // Número de teléfono al que quieres enviar el mensaje automático
    const phoneNumberToSend = '595994288069'; // Reemplaza esto con el número de teléfono deseado

    // Mensaje automático que deseas enviar
    const messageToSend = 'Este es un mensaje automático enviado por el bot.';

    // Función para enviar el mensaje automáticamente
    const enviarMensajeAutomatico = () => {
        // Envía el mensaje automático
        provider.sendText(`${phoneNumberToSend}@s.whatsapp.net`, messageToSend)
            .then(() => {
                console.log(`Mensaje automático enviado correctamente a ${phoneNumberToSend}: ${messageToSend}`);
            })
            .catch((error) => {
                console.error(`Error al enviar mensaje automático a ${phoneNumberToSend}: ${error.message}`);
            });
    };

    // Programar el envío del mensaje automáticamente cada 3 segundos
    // setInterval(enviarMensajeAutomatico, 3000);
};

main();
// 