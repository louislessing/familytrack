import { FastifyInstance } from 'fastify';
import { db } from '../db/index.js';
import { families, familyMembers } from '../db/schema/families.js';
import { eq } from 'drizzle-orm';
import { authenticate } from '../middleware/auth.js';

export default async function familiesRoutes(fastify: FastifyInstance) {
  // Get all families for user
  fastify.get('/', { onRequest: [authenticate] }, async (request) => {
    const user = request.user as { id: string };

    const userFamilies = await db
      .select()
      .from(familyMembers)
      .where(eq(familyMembers.userId, user.id))
      .leftJoin(families, eq(familyMembers.familyId, families.id));

    return userFamilies.map(uf => uf.families);
  });

  // Create family
  fastify.post('/', { onRequest: [authenticate] }, async (request, reply) => {
    const user = request.user as { id: string };
    const body = request.body as { name: string; description?: string };

    const [family] = await db.insert(families).values({
      name: body.name,
      description: body.description,
    }).returning();

    await db.insert(familyMembers).values({
      familyId: family.id,
      userId: user.id,
      role: 'parent',
      isAdmin: 'true',
    });

    return family;
  });

  // Get family by ID
  fastify.get('/:id', { onRequest: [authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const [family] = await db.select().from(families).where(eq(families.id, id));

    if (!family) {
      return reply.code(404).send({ error: 'Family not found' });
    }

    return family;
  });
}
