import crypto from 'crypto';

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

function cifrarRSA(texto, publicKey) {
    let key = publicKey;
    if (key.indexOf('BEGIN PUBLIC KEY') < 0) {
        key = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
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
    // var cipher = crypto.createCipheriv("AES-256-ECB", key, '');
    var cipher = crypto.createCipheriv("AES-256-ECB", key, '');
    cipher.setAutoPadding(true);
    var result = cipher.update(src, 'utf8', 'base64');
    result += cipher.final('base64');
    return result;
}
// Datos de prueba

let cvv = cifrarAES_ECB("123", generado);
let cifrado_tarejta = cifrarAES_ECB("4540639936908783", generado);
let anio = cifrarAES_ECB("29", generado);
let mes = cifrarAES_ECB("04", generado);

export { cifrarRSA, cifrarAES_ECB, CLAVE_PUBLICA_DASHBOARD_PPX, generado, cifradorsa, cvv, cifrado_tarejta, anio, mes };