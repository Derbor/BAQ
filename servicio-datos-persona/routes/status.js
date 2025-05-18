import { createRoute, z } from '@hono/zod-openapi'
import { whatsappQueue } from '../whatsappQueue.js';

const ParamsSchema = z.object({
    campaignId: z.string().openapi({
        param: {
            name: 'campaignId',
            in: 'path',
        },
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
});

const SuccessResponseSchema = z.object({
    success: z.boolean().openapi({ example: true }),
    status: z.object({
        total: z.number().openapi({ example: 100 }),
        completed: z.number().openapi({ example: 50 }),
        failed: z.number().openapi({ example: 10 }),
        pending: z.number().openapi({ example: 40 }),
        status: z.enum(['processing', 'completed', 'failed', 'partial']).openapi({ example: 'processing' }),
        createdAt: z.string().datetime().openapi({ example: '2023-01-01T12:00:00Z' }),
        updatedAt: z.string().datetime().openapi({ example: '2023-01-01T12:30:00Z' }),
        completedPhones: z.array(z.string()).openapi({ example: ['1234567890'] }),
        failedPhones: z.array(z.string()).openapi({ example: ['0987654321'] }),
        pendingPhones: z.array(z.string()).openapi({ example: ['1122334455'] })
    })
});

const NotFoundResponseSchema = z.object({
    success: z.boolean().openapi({ example: false }),
    error: z.string().openapi({ example: 'Campaña no encontrada' })
});

export const statusRoute = createRoute({
    method: 'get',
    path: 'whatsapp/{campaignId}',
    request: {
        params: ParamsSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: SuccessResponseSchema,
                },
            },
            description: 'Estado de la campaña de WhatsApp',
        },
        404: {
            content: {
                'application/json': {
                    schema: NotFoundResponseSchema,
                },
            },
            description: 'Campaña no encontrada',
        },
    },
});



export const statusHandler = async (c) => {
    const { campaignId } = c.req.valid('param');
    const status = whatsappQueue.getCampaignStatus(campaignId);

    if (!status) {
        return c.json(
            {
                success: false,
                error: 'Campaña no encontrada',
            },
            404
        );
    }
    // Convertir fechas a formato ISO string para la respuesta OpenAPI
    const responseStatus = {
        ...status,
        createdAt: status.createdAt.toISOString(),
        updatedAt: status.updatedAt.toISOString(),
    };

    return c.json({
        success: true,
        status: responseStatus,
    });
};

