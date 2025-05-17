import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { emailQueue } from '../store/emailQueue.js';

export class EmailStatus extends OpenAPIRoute {
    schema = {
        tags: ["Correos"],
        summary: "Consultar estado de envío de correos",
        request: {
            params: z.object({
                batchId: z.string()
            })
        },
        responses: {
            "200": {
                description: "Estado del lote de correos",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: z.boolean(),
                            status: z.object({
                                total: z.number(),
                                pending: z.array(z.object({
                                    email: z.string(),
                                    status: z.string()
                                })),
                                completed: z.array(z.object({
                                    email: z.string(),
                                    status: z.string(),
                                    updatedAt: z.date()
                                })),
                                failed: z.array(z.object({
                                    email: z.string(),
                                    status: z.string(),
                                    error: z.string(),
                                    updatedAt: z.date()
                                }))
                            })
                        })
                    }
                }
            }
        }
    };

    async handle(c) {
        const { batchId } = c.req.param();
        const status = emailQueue.getBatchStatus(batchId);

        if (!status) {
            return c.json({
                success: false,
                error: 'Batch no encontrado'
            }, {
                status: 404
            });
        }

        return c.json({
            success: true,
            status
        });
    }
}