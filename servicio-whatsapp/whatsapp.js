import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";

/**
 * Servicio para manejar la comunicación con WhatsApp Web
 */
export class WhatsAppService {
    constructor() {
        /** @type {pkg.Client} */
        this.client = null;
        /** @type {boolean} */
        this.isReady = false;
        /** @type {Array<function(any): void>} */
        this.messageCallbacks = []; // Almacena múltiples callbacks

        console.log("Inicializando cliente WhatsAppWebjs...");
        this.client = new Client({
            puppeteer: {
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-accelerated-2d-canvas",
                    "--no-first-run",
                    "--no-zygote",
                    "--disable-gpu",
                ],
                headless: "new",
                timeout: 60000, // Aumentar el tiempo de espera a 60 segundos
                executablePath: process.env.CHROME_PATH || undefined, // Usar Chrome instalado en el sistema
            },
            authStrategy: new LocalAuth(),
            qrMaxRetries: 5, // Número máximo de reintentos para el código QR
        });

        this.client.on("qr", (qr) => {
            console.log("Escanea el código QR:");
            qrcode.generate(qr, { small: true });
        });

        this.client.on("ready", () => {
            console.log("Cliente WhatsApp listo");
            this.isReady = true;
        });

        this.client.on("message", async (message) => {
            if (!this.isReady || this.messageCallbacks.length === 0) return;

            // Ejecutar todos los callbacks registrados
            this.messageCallbacks.forEach((callback) => callback(message));
        });

        this.client.initialize();
    }

    /**
     * Espera hasta que el cliente de WhatsApp esté listo
     * @returns {Promise<void>}
     * @private
     */
    async ensureReady() {
        while (!this.isReady) {
            console.log("Esperando a que WhatsApp Web esté listo...");
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }

    /**
     * Envía un mensaje a un chat específico
     * @param {string} chatId - ID del chat
     * @param {string} message - Mensaje a enviar
     * @returns {Promise<void>}
     */
    async sendMessage(chatId, message) {
        await this.ensureReady();
        await this.client.sendMessage(chatId, message);
    }

    /**
     * Envía un archivo multimedia a un chat específico
     * @param {string} chatId - ID del chat
     * @param {string} mediaPath - Ruta o URL del archivo multimedia
     * @param {string} [caption] - Texto opcional que acompaña al medio
     * @returns {Promise<void>}
     */
    async sendMedia(chatId, mediaPath, caption = '') {
        await this.ensureReady();
        const media = await this.getMediaMessage(mediaPath);
        await this.client.sendMessage(chatId, media, { caption });
    }

    /**
     * Prepara un mensaje multimedia para enviar
     * @param {string} mediaPath - Ruta o URL del archivo multimedia
     * @returns {Promise<any>} - Mensaje multimedia listo para enviar
     * @private
     */
    async getMediaMessage(mediaPath) {
        if (mediaPath.startsWith('http')) {
            // Si es una URL, crear un MessageMedia desde la URL
            const { MessageMedia } = pkg;
            return await MessageMedia.fromUrl(mediaPath);
        } else {
            // Si es una ruta local, crear un MessageMedia desde el archivo
            const { MessageMedia } = pkg;
            return MessageMedia.fromFilePath(mediaPath);
        }
    }

    /**
     * Envía una secuencia de mensajes en orden
     * @param {string} chatId - ID del chat
     * @param {Array<{type: 'text'|'media', content: string, caption?: string}>} messages - Array de mensajes a enviar
     * @returns {Promise<void>}
     */
    async sendSequence(chatId, messages) {
        await this.ensureReady();

        for (const msg of messages) {
            if (msg.type === 'text') {
                await this.sendMessage(chatId, msg.content);
            } else if (msg.type === 'media') {
                await this.sendMedia(chatId, msg.content, msg.caption);
            }
            // Pequeña pausa entre mensajes para evitar problemas
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    /**
     * Obtiene mensajes de un chat específico
     * @param {string} chatId - ID del chat
     * @param {number} [limit=30] - Límite de mensajes a obtener
     * @returns {Promise<Array>}
     */
    async getMessages(chatId, limit = 30) {
        await this.ensureReady();
        const chat = await this.client.getChatById(chatId);
        return chat.fetchMessages({ limit });
    }

    /**
     * Obtiene el último mensaje de un chat
     * @param {string} chatId - ID del chat
     * @returns {Promise<any>}
     */
    async getLatestMessage(chatId) {
        const lastMessage = await this.getMessages(chatId, 1);
        return lastMessage[0];
    }

    /**
     * Registra un callback para recibir mensajes
     * @param {function(any): void} callback - Función a llamar cuando se recibe un mensaje
     */
    receiveMessages(callback) {
        this.messageCallbacks.push(callback);
    }

    /**
     * Limpia todos los listeners de mensajes
     */
    clearMessageListeners() {
        this.messageCallbacks = [];
    }

    /**
     * Convierte un número de teléfono en un ID de chat
     * @param {string} phoneNumber - Número de teléfono
     * @returns {string} ID del chat
     */
    getChatId(phoneNumber) {
        return `${phoneNumber}@c.us`;
    }
}

export const whatsappService = new WhatsAppService();
export default whatsappService;
