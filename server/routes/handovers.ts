import { FastifyInstance } from 'fastify';
import { db } from '../db/index.js';
import { handovers } from '../db/schema/handovers.js';
import { eq } from 'drizzle-orm';
import { authenticate } from '../middleware/auth.js';

export default async function handoversRoutes(fastify: FastifyInstance) {
  // Get handovers by family
  fastify.get('/family/:familyId', { onRequest: [authenticate] }, async (request) => {
    const { familyId } = request.params as { familyId: string };
    return await db.select().from(handovers).where(eq(handovers.familyId, familyId));
  });

  // Create handover
  fastify.post('/', { onRequest: [authenticate] }, async (request) => {
    const body = request.body as any;
    const [handover] = await db.insert(handovers).values(body).returning();
    return handover;
  });

  // Get handover by ID
  fastify.get('/:id', { onRequest: [authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const [handover] = await db.select().from(handovers).where(eq(handovers.id, id));

    if (!handover) {
      return reply.code(404).send({ error: 'Handover not found' });
    }

    return handover;
  });
}
