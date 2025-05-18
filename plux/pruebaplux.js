import crypto from 'buffer';
import { cifrarRSA, cifrarAES_ECB, CLAVE_PUBLICA_DASHBOARD_PPX, generado, cifradorsa, cvv, cifrado_tarejta, anio, mes } from './utils';

const URL_BASE = "https://apipre.pagoplux.com/intv1";

// ---------- CONFIGURACIÓN CORRECTA ----------
const SANDBOX_API_URL = URL_BASE + "/credentials/paymentCardResource";

const datosPrueba = {
    rucEstablecimiento: "MTAwMzA4ODY3OTAwNA==", // ejemplo codificado en base64
    montoCero: 2.0,
    monto12: 3.0,
    ci: "1704140969",
    nombreCliente: "Pago",
    apellidoCliente: "Plux",
    //
    // correoCliente: "abautista@pagoplux.com",
    correoCliente: "cflores@openlab.ec",
    direccion: "Arizaga luque y Federico paez",
    descripcion: "Pago de pruebas",
    linkUnico: true,
    esQR: false,
    telefono: "0961166990",
    prefijo: "+593"
};

// ---------- SOLICITAR ENLACE DE PAGO ----------
async function solicitarEnlaceDePago() {
    const USER = "pdMA2SW2XIQUFlKVMCfJtmbr1E";

    const PASSWORD = "95VI8Pi1LRGDIj9rWJdF3rSL46OUmVW5Jtby9aVVkgLuc60z";
    // const AUTH = Buffer.from(`${USER}:${PASSWORD}`).toString('base64');
    // const AUTH = btoa(`${USER}:${PASSWORD}`);
    // const textoPlano = `${USER}:${PASSWORD}`;
    // const base64 = Buffer.from(textoPlano, 'utf-8').toString('base64');
    const textoPlano = `${USER}:${PASSWORD}`;
    const base64 = Buffer.from(textoPlano, 'utf-8').toString('base64');


    const headers = {
        "Authorization": `Basic ${base64}`,
        "Content-Type": "application/json",
        "simetricKey": cifradorsa,
    };

    // const payload = construirPayload();
    const body = {
        card: {
            number: cifrado_tarejta,
            expirationYear: anio,
            expirationMonth: mes,
            cvv: cvv,
        },
        buyer: {
            documentNumber: datosPrueba.ci,
            firstName: datosPrueba.nombreCliente,
            lastName: datosPrueba.apellidoCliente,
            phone: datosPrueba.telefono,
            email: datosPrueba.correoCliente,
        },
        shippingAddress: {
            street: datosPrueba.direccion,
            city: "Quito",
            country: "EC",
            number: "170135",
        },
        currency: "USD",
        description: datosPrueba.descripcion,
        clientIp: "192.168.1.1",
        idEstablecimiento: "MTM", // ejemplo codificado en base64
    }

    console.log(body)

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