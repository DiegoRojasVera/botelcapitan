const axios = require('axios');

// Array de números de teléfono a los que deseas enviar el mensaje
const phoneNumbers = [

"595982415478",

  ];
     

  
// Mensaje y media a enviar

const message =
"👋 **Hola, esperamos que estés muy bien** 🌟\n\n" +
"🙋‍♂️ Desde **RV Apps**, queremos presentarte una **nueva herramienta web para reservas** diseñada especialmente para facilitar la gestión de tu negocio.\n\n" +
"📅 Con nuestra aplicación, podrás:\n" +
"- Administrar tus reservas de manera sencilla y eficiente.\n" +
"- Enviar recordatorios automáticos a tus clientes.\n\n" +
"💻 **¡Tenemos una demo disponible!** Puedes explorar todas las funcionalidades sin compromiso.\n\n" +
"🎁 **La demo es completamente gratis**, para que veas cómo puede ayudarte en tu negocio.\n\n" +
"👉 Si deseas más información o probar la demo, no dudes en contactarnos. Estamos aquí para ayudarte.\n\n" +
"🔗 **Prueba ahora**:\n" +
"👉 **Web demo**: https://salonreservas.rvsolutionsapp.com/\n" +
"👉 **Android**: https://play.google.com/store/apps/details?id=com.reservasRV&pcampaignid=web_share\n" +
"👉 **iOS**: https://apps.apple.com/us/app/agendabooking/id6449905638";

// const message = 
// "📢 **Facilita las reservas en tu negocio** 🎉\n" +
// "🌟 Gestiona las reservas de tus clientes de manera fácil y rápida con nuestra **app** 📲 y nuestra **web** 🌍.\n" +
// "⏳ **Reservas sin complicaciones**: Tus clientes pueden agendar citas en cualquier momento y desde cualquier lugar.\n\n" +
// "🔔 **Optimiza tu negocio**: Simplifica la gestión y mejora la experiencia de tus clientes con nuestra plataforma.\n" +
// "📩 **Notificaciones automáticas**: Envía mensajes de **confirmación** ✅ y **recordatorios** ⏰ tanto a tus clientes como a tu equipo.\n\n" +
// "🔗 **Prueba nuestra demo**:\n" +
// "👉 **Web demo**: https://salonreservas.rvsolutionsapp.com/\n" +
// "👉 **Android**: https://play.google.com/store/apps/details?id=com.reservasRV&pcampaignid=web_share\n" +
// "👉 **iOS**: https://apps.apple.com/us/app/agendabooking/id6449905638";


// const message = 
// "📢 **¡Una solución ideal para tu negocio!** 🎉\n" +
// "Esta **app** puede ser de gran utilidad para tu negocio. Está disponible para **iOS**, **Android** y también en su **versión web** 🌐. Tanto los clientes como los propietarios podrán gestionar fácilmente las reservas, y la app se encargará de enviar **mensajes de recordatorio** ⏰ y **confirmación** ✅ de citas.\n\n" +
// "🔗 Si deseas ver cómo funciona, aquí tienes los enlaces:\n" +
// "👉 **Google Play**: https://play.google.com/store/apps/details?id=com.reservasRV&pcampaignid=web_share\n" +
// "👉 **iOS**: https://apps.apple.com/us/app/agendabooking/id6449905638\n" +
// "👉 **Web**: https://salonreservas.rvsolutionsapp.com/";





const mediaURL = "https://firebasestorage.googleapis.com/v0/b/fir-e7634.appspot.com/o/promoweb.mp4?alt=media&token=94fa253c-14c3-47bb-8ee4-466995980fa9";

// Función para hacer una pausa (delay) de n milisegundos
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Función para enviar el mensaje a cada número de teléfono con retraso de 10 segundos
const enviarMensajesMasivos = async () => {
    for (const phoneNumber of phoneNumbers) {
        try {
            const response = await axios.post('http://localhost:3000/send-message', {
                phoneNumber: phoneNumber,
                message: message,
                mediaURL: mediaURL
            });
            console.log(`Mensaje enviado a ${phoneNumber}: ${response.data}`);
        } catch (error) {
            console.error(`Error al enviar mensaje a ${phoneNumber}:`, error.message);
        }
        
        // Esperar 10 segundos (10000 ms) antes de enviar el siguiente mensaje
        await delay(15000);
    }
};


// setTimeout(() => {
//     console.log("Iniciando el envío de mensajes masivos...");
//     enviarMensajesMasivos();
// }, 3600000); // 1 hora

// Retardo de 1 minuto (60000 ms) antes de iniciar el envío masivo
setTimeout(() => {
    console.log("Iniciando el envío de mensajes masivos...");
    enviarMensajesMasivos();
}, 60000);
// 

// // Retardo de 3 horas (10800000 ms) antes de iniciar el envío masivo
// setTimeout(() => {
//     console.log("Iniciando el envío de mensajes masivos...");
//     enviarMensajesMasivos();
// }, 10800000);