import { whatsappService } from './whatsapp.js';

/**
 * Almacén para la cola de mensajes de WhatsApp con control de tasa de envío
 */
class WhatsAppQueueStore {
    constructor() {
        /** @type {Map<string, any>} */
        this.queue = new Map();
        this.processInterval = 1000; // 1 segundo entre mensajes
        this.maxConcurrent = 10; // máximo de mensajes procesando a la vez
        this.activeProcesses = 0;
        this.isProcessing = false;
    }

    /**
     * Añade una nueva campaña a la cola
     * @param {string} campaignId - ID único de la campaña
     * @param {Object} campaign - Configuración de la campaña
     * @param {Array<{type: 'text'|'media', content: string, caption?: string}>} campaign.messages - Mensajes a enviar
     * @param {Array<string>} campaign.phoneNumbers - Lista de números de teléfono destinatarios
     * @returns {string} campaignId
     */
    addCampaign(campaignId, { messages, phoneNumbers }) {
        // Crear un registro para cada destinatario con la secuencia completa de mensajes
        const recipients = phoneNumbers.map(phone => ({
            phone,
            messages: [...messages], // Copia de los mensajes para cada destinatario
            status: 'pending',
            currentMessageIndex: 0,
            attempts: 0
        }));

        this.queue.set(campaignId, {
            total: phoneNumbers.length,
            messages, // Plantilla de mensajes original
            recipients, // Lista de destinatarios y su progreso
            completed: [],
            failed: [],
            createdAt: new Date(),
            updatedAt: new Date()
        });

        if (!this.isProcessing) {
            this.startProcessing();
        }

        return campaignId;
    }

    /**
     * Actualiza el estado de un destinatario
     * @private
     */
    updateRecipientStatus(campaignId, phone, status, error = null) {
        const campaign = this.queue.get(campaignId);
        if (!campaign) return null;

        const recipientData = {
            phone,
            status,
            completedAt: new Date(),
            ...(error && { error: error.message })
        };

        // Eliminar de la lista de destinatarios pendientes
        campaign.recipients = campaign.recipients.filter(r => r.phone !== phone);

        if (status === 'completed') {
            campaign.completed.push(recipientData);
        } else if (status === 'failed') {
            campaign.failed.push(recipientData);
        }

        campaign.updatedAt = new Date();
        this.queue.set(campaignId, campaign);
        this.activeProcesses--;
        return campaign;
    }

    /**
     * Obtiene el estado actual de una campaña
     * @param {string} campaignId - ID de la campaña
     */
    getCampaignStatus(campaignId) {
        const campaign = this.queue.get(campaignId);
        if (!campaign) return null;

        return {
            total: campaign.total,
            pending: campaign.recipients.length,
            completed: campaign.completed.length,
            failed: campaign.failed.length,
            status: this.getCampaignStatusLabel(campaign),
            createdAt: campaign.createdAt,
            updatedAt: campaign.updatedAt,
            completedPhones: campaign.completed.map(r => r.phone),
            failedPhones: campaign.failed.map(r => r.phone),
            pendingPhones: campaign.recipients.map(r => r.phone)
        };
    }

    /**
     * Determina el estado general de la campaña
     * @private
     */
    getCampaignStatusLabel(campaign) {
        if (campaign.recipients.length > 0) return 'processing';
        if (campaign.failed.length === campaign.total) return 'failed';
        if (campaign.completed.length === campaign.total) return 'completed';
        return 'partial';
    }

    /**
     * Inicia el procesamiento de la cola
     * @private
     */
    async startProcessing() {
        this.isProcessing = true;

        while (this.isProcessing) {
            for (const [campaignId, campaign] of this.queue.entries()) {
                if (this.activeProcesses >= this.maxConcurrent) {
                    await new Promise(resolve => setTimeout(resolve, this.processInterval));
                    continue;
                }

                // Buscar un destinatario pendiente
                const recipient = campaign.recipients.find(r => r.attempts === 0);
                if (!recipient) continue;

                this.activeProcesses++;
                recipient.attempts++;

                this.processRecipient(campaignId, recipient).catch(console.error);
            }

            // Verificar si hay más destinatarios pendientes
            const hasMorePending = Array.from(this.queue.values()).some(campaign =>
                campaign.recipients.some(r => r.attempts === 0)
            );

            if (!hasMorePending) {
                this.isProcessing = false;
                break;
            }

            await new Promise(resolve => setTimeout(resolve, this.processInterval));
        }
    }

    /**
     * Procesa todos los mensajes para un destinatario
     * @private
     */
    async processRecipient(campaignId, recipient) {
        try {
            const chatId = whatsappService.getChatId(recipient.phone);
            await whatsappService.sendSequence(chatId, recipient.messages);
            this.updateRecipientStatus(campaignId, recipient.phone, 'completed');
        } catch (error) {
            console.error(`Error processing recipient ${recipient.phone}:`, error);
            this.updateRecipientStatus(campaignId, recipient.phone, 'failed', error);
        }
    }
}

export const whatsappQueue = new WhatsAppQueueStore();
export default whatsappQueue;
