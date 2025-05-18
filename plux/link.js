import crypto from 'crypto';
import { cifrarRSA, cifrarAES_ECB, CLAVE_PUBLICA_DASHBOARD_PPX, generado, cifradorsa, cvv, cifrado_tarejta, anio, mes } from './utils.js';

const URL_BASE = "https://apipre.pagoplux.com/intv1";

// ---------- CONFIGURACIÓN CORRECTA ----------
const SANDBOX_API_URL = URL_BASE + "/integrations/createLinkFacturaResource";

// ---------- SOLICITAR ENLACE DE PAGO ----------
async function solicitarEnlaceDePago() {
    const USER = "pdMA2SW2XIQUFlKVMCfJtmbr1E";

    const PASSWORD = "95VI8Pi1LRGDIj9rWJdF3rSL46OUmVW5Jtby9aVVkgLuc60z";
    const textoPlano = `${USER}:${PASSWORD}`;
    const base64 = Buffer.from(textoPlano, 'utf-8').toString('base64');


    const headers = {
        "Authorization": `Basic ${base64}`,
        "Content-Type": "application/json",
        "simetricKey": cifradorsa,
    };

    // const payload = construirPayload();

    const body = {
        "rucEstablecimiento": "123456789012",
        "montoCero": 2.0,
        "monto12": 3.0,
        "ci": "1714171417",
        "nombreCliente": "Pago Plux",
        "correoCliente": "botonpago@pagoplux.com",
        "direccion": "Arizaga luque y Federico paez",
        "descripcion": "Pago de pruebas",
        "linkUnico": true,
        "esQR": false,
        "telefono": "0961166990",
        "prefijo": "+593"
    }



    try {
        console.log("🔄 Enviando solicitud al entorno SANDBOX de PagoPlux...");
        const response = await fetch(SANDBOX_API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.log("Error, ", response)
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const respuesta = await response.json();
        console.log("Respuesta:", respuesta)
        console.log("✅ Enlace generado:");
        // console.log("🔗 URL:", respuesta?.detail?.url || "No disponible");

    } catch (error) {
        console.log("❌ Error:", error.message);
    }
}


solicitarEnlaceDePago();