import { createBot, createProvider, MemoryDB, createFlow, addKeyword } from '@bot-whatsapp/bot';
import { BaileysProvider } from '@bot-whatsapp/provider-baileys';
import axios from 'axios'; // Importar Axios para hacer solicitudes HTTP

// Función para verificar si una fecha es la fecha de hoy (comparando solo el día)
const esFechaDeHoy = (fechaString) => {
    const fecha = new Date(fechaString);
    const fechaHoy = new Date();
    return fecha.toDateString() === fechaHoy.toDateString();
};

// Definir los flujos para las nuevas palabras clave y respuestas
const flowBienvenida = addKeyword(['Buen', 'día', 'ola', 'tardes', 'Buenas', 'noches', 'Hola', 'dia', 'ola']).addAction(async (ctx, { flowDynamic }) => {
    return flowDynamic([`¡Hola! ¿En qué podemos ayudarte?
En breve serás atendido por un asesor.`]);
});

const consultarDatos = async () => {
    try {
        const response = await axios.get('http://146.190.45.149:8080/api/listar');
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
        // Verificar si el mensaje debe enviarse (mensaje === '1')
        if (entry.mensaje === '1') {
            const messageToSend = `Buenas!\nLe recordamos que posee una cita en NOMBRE DEL LOCAL\ncon: ${entry.stylistName}\nHorario: ${entry.inicio}`;
            try {
                await provider.sendText(`${phoneNumberToSend}@s.whatsapp.net`, messageToSend);
                console.log(`Mensaje automático enviado correctamente a ${phoneNumberToSend}: ${messageToSend}`);
                // Actualizar el campo 'mensaje' a '0'
                try {
                    await axios.put(`http://146.190.45.149:8080/api/clients/${entry.id}`, {
                        mensaje: '0'
                    });
                    console.log(`Campo 'mensaje' actualizado a '0' para el cliente con ID ${entry.id}`);
                } catch (error) {
                    console.error(`Error al actualizar el campo 'mensaje' para el cliente con ID ${entry.id}: ${error.message}`);
                }
            } catch (error) {
                console.error(`Error al enviar mensaje automático a ${phoneNumberToSend}: ${error.message}`);
            }
        } else {
            console.log(`No se envió mensaje a ${phoneNumberToSend} porque el campo 'mensaje' no es igual a '1'.`);
        }
    });
};

// Lógica principal
const main = async () => {
    const provider = createProvider(BaileysProvider);
    provider.initHttpServer(3002);

    // Llamar a la función de consulta y envío de mensajes cada minuto
    setInterval(async () => {
        try {
            const datosFiltrados = await consultarDatos();
            await enviarMensajes(datosFiltrados, provider);
        } catch (error) {
            console.error('Error en la lógica principal:', error.message);
        }
    }, 3600000); // 60 segundos

    // Inicializar el bot con todos los flujos, incluida la respuesta predeterminada y los comandos disponibles
    const bot = await createBot({
        flow: createFlow([flowBienvenida]),
        database: new MemoryDB(),
        provider
    });
};

// Llamar a la función principal
main();
