import { FastifyInstance } from 'fastify';
import { db } from '../db/index.js';
import { events } from '../db/schema/events.js';
import { eq } from 'drizzle-orm';
import { authenticate } from '../middleware/auth.js';

export default async function eventsRoutes(fastify: FastifyInstance) {
  // Get events by family
  fastify.get('/family/:familyId', { onRequest: [authenticate] }, async (request) => {
    const { familyId } = request.params as { familyId: string };
    return await db.select().from(events).where(eq(events.familyId, familyId));
  });

  // Create event
  fastify.post('/', { onRequest: [authenticate] }, async (request) => {
    const user = request.user as { id: string };
    const body = request.body as any;

    const [event] = await db.insert(events).values({
      ...body,
      createdById: user.id,
    }).returning();

    return event;
  });
}
