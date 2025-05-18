import crypto from "crypto";

// --- 1.  CLAVE PÚBLICA QUE TE DIO PAGO PLUX ---
const CLAVE_PUBLICA_PPX = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqel/bZWiGXrKwBqWuBF7
Vub2bNulFTTRg5Y0agXKkjur3ZheyPdXRGNhhgpDlILg2EPZ220OFBdPj1GGnbrG
R564J+QHbhqbeE1XA0663ovGji+tGepNGiZ2UPXj5S3wGA/LN6sfOgT2BjMigzlp
rsCAt/QHI84LG6jAYu/DAhKnSx+ihXjcelPyeTfvtAIuH2rEyzPl6qi6hZm5n7YX
83onUwRfevZFWelb797vsQSpYdeSd/dCoeqYq10djszPF2xWPzvD1vefJV2Hmc1C
9BnjtcGuimDvm+adNR1jRVQ2YX0o63wbGDdbKJOECKH172bV5ItwMl37llNjRk4N
+wIDAQAB
-----END PUBLIC KEY-----`;

// --- 2.  UTILIDADES DE CIFRADO ---
const randomKey32 = () =>
    [...crypto.randomBytes(32)].map(b => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[b % 62]).join("");

function cifrarRSA(textoPlano, publicKeyPem) {
    const buffer = Buffer.from(textoPlano, "utf8");
    const cifrado = crypto.publicEncrypt(
        { key: publicKeyPem, padding: crypto.constants.RSA_PKCS1_PADDING },
        buffer
    );
    return cifrado.toString("base64");
}

function cifrarAES_ECB(textoPlano, clave32) {
    const key = Buffer.from(clave32, "utf8");
    const cipher = crypto.createCipheriv("aes-256-ecb", key, null);
    let enc = cipher.update(textoPlano, "utf8", "base64");
    enc += cipher.final("base64");
    return enc;
}

// --- 3.  DATOS DE PRUEBA ---
const tarjeta = "4540639936908783";
const cvv = "123";
const mes = "04";
const anio = "29";

const client = {
    id: "pdMA2SW2XIQUFlKVMCfJtmbr1E",
    secret: "95VI8Pi1LRGDIj9rWJdF3rSL46OUmVW5Jtby9aVVkgLuc60z",
};

// --- 4.  CONSTRUIR Y ENVIAR PETICIÓN ---
async function registrarTarjeta() {
    // 4.1  Genera clave simétrica y la cifra con RSA
    const simKey = randomKey32();
    const simKeyRSA = cifrarRSA(simKey, CLAVE_PUBLICA_PPX);
    // -- después de generar todo:
    console.log("SimKey plano:", simKey, "len:", simKey.length);
    console.log("simetricKey header (base64):", simKeyRSA, "len:", simKeyRSA.length);

    // 4.2  Cifra los cuatro campos con AES-256-ECB
    const body = {
        card: {
            number: cifrarAES_ECB(tarjeta, simKey),
            expirationYear: cifrarAES_ECB(anio, simKey),
            expirationMonth: cifrarAES_ECB(mes, simKey),
            cvv: cifrarAES_ECB(cvv, simKey),
        },
        buyer: {
            documentNumber: "1704140969",
            firstName: "Pago",
            lastName: "Plux",
            phone: "0961166990",
            email: "cflores@openlab.ec",
        },
        shippingAddress: {
            street: "Arizaga luque y Federico paez",
            city: "Quito",
            country: "EC",
            number: "170135",
        },
        currency: "USD",
        description: "Pago de pruebas",
        clientIp: "192.168.1.1",
        idEstablecimiento: "MTM",
    };

    // 4.3  Cabeceras
    const basic = Buffer.from(`${client.id}:${client.secret}`, "utf8").toString("base64");
    const headers = {
        "Authorization": `Basic ${basic}`,
        "Content-Type": "application/json",
        "simetricKey": simKeyRSA,           // <- ¡CIFRADA!
    };

    // 4.4  Envío
    const url = "https://apipre.pagoplux.com/intv1/credentials/paymentCardResource";
    console.log("🔄  Enviando a Sandbox…");
    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });

    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    const json = await res.json();
    console.log("✅  Respuesta:", json);
}

registrarTarjeta().catch(err => console.error("❌  Error:", err.message));