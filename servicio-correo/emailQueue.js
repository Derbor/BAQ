class EmailQueueStore {
    constructor() {
        this.queue = new Map();
    }

    addBatch(batchId, emails) {
        this.queue.set(batchId, {
            total: emails.length,
            pending: emails.map(email => ({
                email,
                status: 'pending'
            })),
            completed: [],
            failed: [],
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return batchId;
    }

    updateEmailStatus(batchId, email, status, error = null) {
        const batch = this.queue.get(batchId);
        if (!batch) return null;

        const emailData = {
            email,
            status,
            updatedAt: new Date(),
            ...(error && { error })
        };

        // Remover de pending
        batch.pending = batch.pending.filter(e => e.email !== email);

        // Agregar a completed o failed
        if (status === 'completed') {
            batch.completed.push(emailData);
        } else if (status === 'failed') {
            batch.failed.push(emailData);
        }

        batch.updatedAt = new Date();
        this.queue.set(batchId, batch);
        return batch;
    }

    getBatchStatus(batchId) {
        return this.queue.get(batchId) || null;
    }
}

export const emailQueue = new EmailQueueStore();