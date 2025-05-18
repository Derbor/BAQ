import { z } from "zod";
import { randomUUID } from 'crypto';
import { whatsappQueue } from '../whatsappQueue.js';
import path from "path";

export const WhatsAppMessageSchema = z.object({
    phoneNumbers: z.array(z.string().regex(/^\d+$/, "Each phone number must be a string of digits.")).min(1),
    messages: z.array(z.object({
        type: z.enum(['text', 'media']),
        content: z.string(),
        caption: z.string().optional()
    })).min(1)
});

const ParamsSchema = z.object({
    campaignId: z.string().openapi({
        param: {
            name: 'campaignId',
            in: 'path',
        },
        example: '123e456700'
    })
});


export const SendSuccessResponseSchema = z.object({
    success: z.boolean(),
    campaignId: z.string(),
    total: z.number()
});

export const SendErrorResponseSchema = z.object({
    success: z.boolean(),
    error: z.string()
});

export const sendWhatsAppMessageRoute = {
    method: 'post',
    path: '/whatsapp/',
    request: {
        param: ParamsSchema,
        body: {
            content: {
                'application/json': {
                    schema: WhatsAppMessageSchema,
                },
            },
        },
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: SendSuccessResponseSchema,
                },
            },
            description: 'La campaña de mensajes fue iniciada correctamente',
        },
        400: {
            content: {
                'application/json': {
                    schema: SendErrorResponseSchema,
                },
            },
            description: 'Error en los datos de entrada',
        },
        500: {
            content: {
                'application/json': {
                    schema: SendErrorResponseSchema,
                },
            },
            description: 'Error interno al iniciar la campaña de WhatsApp',
        },
    }
};

export const sendWhatsAppMessageHandler = async (c) => {
    try {
        // Los datos validados están disponibles a través de c.req.valid('json')
        const messageData = c.req.valid('json');

        // Validar formato de números de teléfono (aunque Zod ya hizo una validación básica)
        const validPhoneNumbers = messageData.phoneNumbers.map(phone => {
            return phone.replace(/\D/g, ''); // Asegurar solo dígitos
        });

        const campaignId = randomUUID();

        whatsappQueue.addCampaign(campaignId, {
            messages: messageData.messages,
            phoneNumbers: validPhoneNumbers
        });

        return c.json({
            success: true,
            campaignId: campaignId,
            total: validPhoneNumbers.length
        });
    } catch (error) {
        // Si el error es de validación de Zod, Hono ya lo maneja por defecto.
        // Este catch sería para otros errores inesperados en la lógica.
        console.error('Error al iniciar la campaña de WhatsApp:', error);
        return c.json({
            success: false,
            error: 'Error interno al iniciar la campaña de WhatsApp',
        }, 500); // Usar 500 para errores del servidor
    }
};
