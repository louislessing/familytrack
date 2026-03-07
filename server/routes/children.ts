import { FastifyInstance } from 'fastify';
import { db } from '../db/index.js';
import { children } from '../db/schema/children.js';
import { eq } from 'drizzle-orm';
import { authenticate } from '../middleware/auth.js';

export default async function childrenRoutes(fastify: FastifyInstance) {
  // Get children by family
  fastify.get('/family/:familyId', { onRequest: [authenticate] }, async (request) => {
    const { familyId } = request.params as { familyId: string };
    return await db.select().from(children).where(eq(children.familyId, familyId));
  });

  // Add child
  fastify.post('/', { onRequest: [authenticate] }, async (request) => {
    const body = request.body as any;
    const [child] = await db.insert(children).values(body).returning();
    return child;
  });

  // Get child by ID
  fastify.get('/:id', { onRequest: [authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const [child] = await db.select().from(children).where(eq(children.id, id));

    if (!child) {
      return reply.code(404).send({ error: 'Child not found' });
    }

    return child;
  });
}
