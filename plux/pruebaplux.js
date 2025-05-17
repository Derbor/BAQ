const crypto = require('crypto')
const CLAVE_PUBLICA_DASHBOARD_PPX = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqel/bZWiGXrKwBqWuBF7
Vub2bNulFTTRg5Y0agXKkjur3ZheyPdXRGNhhgpDlILg2EPZ220OFBdPj1GGnbrG
R564J+QHbhqbeE1XA0663ovGji+tGepNGiZ2UPXj5S3wGA/LN6sfOgT2BjMigzlp
rsCAt/QHI84LG6jAYu/DAhKnSx+ihXjcelPyeTfvtAIuH2rEyzPl6qi6hZm5n7YX
83onUwRfevZFWelb797vsQSpYdeSd/dCoeqYq10djszPF2xWPzvD1vefJV2Hmc1C
9BnjtcGuimDvm+adNR1jRVQ2YX0o63wbGDdbKJOECKH172bV5ItwMl37llNjRk4N
+wIDAQAB
-----END PUBLIC KEY-----`

function getGenerado(size = 32) {
const caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let codigo = '';
let length = caracteres.length;
if (size <= 10) {
length = 10;
}
while (codigo.length < size) {
codigo += caracteres[Math.floor(Math.random() * length)];
}
return codigo;
};

const generado = getGenerado()

function cifrarRSA (texto, publicKey) {
let key = publicKey;
if (key.indexOf('BEGIN PUBLIC KEY') < 0) {
key = `-----BEGIN PUBLIC KEY-----\n${publicKey} \n-----END PUBLIC KEY-----`;
}
const encryptedData = crypto.publicEncrypt(
{
key: key,
padding: crypto.constants.RSA_PKCS1_PADDING
},
// We convert the data string to a buffer using `Buffer.from`
Buffer.from(texto)
);
return encryptedData.toString("base64");
}

let cifradorsa = cifrarRSA(generado, CLAVE_PUBLICA_DASHBOARD_PPX);

function cifrarAES_ECB(texto, claveSimetrica) {
var key = Buffer.from(claveSimetrica);
var src = Buffer.from(texto);
var cipher = crypto.createCipheriv("AES-256-ECB", key, '');
cipher.setAutoPadding(true);
var result = cipher.update(src, 'utf8', 'base64');
result += cipher.final('base64');
return result;
}

let cvv = cifrarAES_ECB("123", generado);
let cifrado_tarejta = cifrarAES_ECB("4540639936908783", generado);
let anio= cifrarAES_ECB("29", generado);
let mes= cifrarAES_ECB("04", generado);
console.log("Dato cifrado CVV: ", cvv)
console.log("Dato cifrado Tarjeta: ", cifrado_tarejta)
console.log("Dato año: ", anio)
console.log("Dato mes: ", mes)

const url = "https://apipre.pagoplux.com/intv1/credentials/paymentCardResource";

// ---------- CONFIGURACIÓN CORRECTA ----------
const BEARER_TOKEN = "Bearer sk_test_2YxEThbzVGs5Nbh7HRJZMgYoJG7wYZaem8qR9eY5E8yAEKSTm9";
// const SANDBOX_API_URL = "https://apipre.pagoplux.com/intv1/integrations/createLinkFacturaResource";
const SANDBOX_API_URL = "https://apipre.pagoplux.com/intv1/credentials/paymentCardResource";


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
const AUTH = Buffer.from(`${USER}:${PASSWORD}`).toString('base64');

const headers = {
"Authorization": `Basic ${AUTH}`,
"Content-Type": "application/json",
"simetricKey": cifrarRSA(generado, CLAVE_PUBLICA_DASHBOARD_PPX),
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
idEstablecimiento: "NTE5MDAwMDAwMDAwMA==", // ejemplo codificado en base64
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
