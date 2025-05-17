import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
// import { type AppContext, Correo } from "../types";
import nodemailer from 'nodemailer';

export const Correo = z.object({
    email: z.string().email(),
    subject: z.string(),
    body: z.string(),
    attachments: z.array(z.string()).optional(),
})

export class EmailSend extends OpenAPIRoute {
	schema = {
		tags: ["Correo"],
		summary: "Enviar un correo electronico",
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
}
