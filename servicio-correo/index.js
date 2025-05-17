import { config } from "dotenv";
config(); // carga .env

import { fromHono } from "chanfana";
import { Hono } from "hono";
import { EmailSend } from "./routes/send.js";

const app = new Hono();

const openapi = fromHono(app, {
    docs_url: "/",
});

openapi.post("/correo", EmailSend);

import { serve } from '@hono/node-server'
serve({
    fetch: app.fetch,
    port: 3000,
}, info => {
    console.log(`Server started on localhost:${info.port}`);
})
