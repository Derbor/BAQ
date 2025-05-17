import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
// import { type AppContext, Correo } from "../types";
import nodemailer from 'nodemailer';
import { emailQueue } from '../emailQueue.js';
import { randomUUID } from 'crypto';


export const Correo = z.object({
    emails: z.array(z.string().email()),
    subject: z.string(),
    body: z.string(),
    attachments: z.array(z.string()).optional(),
})

export class EmailSend extends OpenAPIRoute {
	schema = {
		tags: ["Correos"],
		summary: "Enviar correos electronicos",
		request: {
			body: {
				content: {
					"application/json": {
						schema: Correo,
					},
				},
			},
		},
		responses: {
			"200": {
				description: "El correo fue enviado correctamente",
				content: {
					"application/json": {
						schema: z.object({
							series: z.object({
								success: Bool(),
							}),
						}),
					},
				},
			},
            "400": {
                description: "Error al enviar el correo",
                content: {
                    "application/json": {
                        schema: z.object({
                            series: z.object({
                                success: Bool(),
                                error: z.string(),
                            }),
                        }),
                    },
                },
            },
		},
	};

	async handle(c) {
		// Get validated data
		const data = await this.getValidatedData();

		// Retrieve the validated request body
		const correo = data.body;
        const batchId = randomUUID();

        emailQueue.addBatch(batchId, correo.emails);

        this.processEmails(correo, batchId).catch(console.error)

        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_SENDER,
                    pass: process.env.GMAIL_PASS
                }
            });

            // Define el correo
            const mailOptions = {
                from: process.env.GMAIL_SENDER,
                to: correo.email,
                subject: correo.subject,
                html: correo.body,
                attachments: correo.attachments ? correo.attachments.map(file => ({ path: file })) : []
            };

            // Enviar de forma asíncrona
            await transporter.sendMail(mailOptions);

            return {
                success: true,
            }
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            return c.json({
                success: false,
                error: 'Error al enviar el correo',
            }, {
                status: 400,
            });
        }
	}

    async processEmails(correo, batchId) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_SENDER,
                pass: process.env.GMAIL_PASS
            }
        });

        for (const email of correo.emails) {
            try {
                const mailOptions = {
                    from: process.env.GMAIL_SENDER,
                    to: email,
                    subject: correo.subject,
                    html: correo.body,
                    attachments: correo.attachments 
                        ? correo.attachments.map(file => ({ path: file })) 
                        : []
                };

                await transporter.sendMail(mailOptions);
                emailQueue.updateEmailStatus(batchId, email, 'completed');

            } catch (error) {
                emailQueue.updateEmailStatus(batchId, email, 'failed', error.message);
            }
        }
    }
}
