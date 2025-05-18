import { config } from "dotenv";
config(); // carga .env

import { OpenAPIHono } from '@hono/zod-openapi';
import { serve } from '@hono/node-server';
import { sendWhatsAppMessageHandler, sendWhatsAppMessageRoute } from "./routes/send.js";
import { statusRoute, statusHandler } from "./routes/status.js";
// import { whatsappService } from './whatsapp.js' // Comentado si no se usa directamente aquí

const app = new OpenAPIHono();

// Ruta para enviar mensajes de WhatsApp
app.openapi(
    sendWhatsAppMessageRoute,
    sendWhatsAppMessageHandler
);

app.doc('/doc', {
    openapi: '3.0.0',
    info: {
        version: '1.0.0',
        title: 'My API',
    },
})

// Ruta para consultar el estado de la campaña
// app.openapi(statusRoute, statusHandler);

// Documentación OpenAPI
// app.doc('/openapi.json', {  // Comentamos o eliminamos la línea original de app.doc()
//     openapi: '3.0.0',
//     info: {
//         version: '1.0.0',
//         title: 'Servicio de WhatsApp API',
//     },
// });

// // Servir explícitamente el documento OpenAPI
// app.get('/openapi.json', (c) => {
//     const document = app.getOpenAPIDocument({
//         openapi: '3.0.0',
//         info: {
//             version: '1.0.0',
//             title: 'Servicio de WhatsApp API',
//         },
//     });
//     return c.json(document);
// });

// // UI de Swagger
app.get('/', (c) => {
    return c.html(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Servicio de WhatsApp API</title>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" rel="stylesheet">
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js" charset="UTF-8"> </script>
      <script>
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            url: '/doc', // Cambiado para apuntar al endpoint del JSON
            dom_id: '#swagger-ui',
          });
        };
      </script>
    </body>
    </html>
  `);
});

serve({
    fetch: app.fetch,
    port: 4500,
}, info => {
    console.log(`Server started on localhost:${info.port}`);
    console.log(`Swagger UI available at http://localhost:${info.port}/`);
    console.log(`OpenAPI spec available at http://localhost:${info.port}/openapi.json`);
})
