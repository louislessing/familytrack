import { FastifyInstance } from 'fastify';
import { db } from '../db/index.js';
import { expenses } from '../db/schema/expenses.js';
import { eq, sql } from 'drizzle-orm';
import { authenticate } from '../middleware/auth.js';

export default async function expensesRoutes(fastify: FastifyInstance) {
  // Get expenses by family
  fastify.get('/family/:familyId', { onRequest: [authenticate] }, async (request) => {
    const { familyId } = request.params as { familyId: string };
    return await db.select().from(expenses).where(eq(expenses.familyId, familyId));
  });

  // Add expense
  fastify.post('/', { onRequest: [authenticate] }, async (request) => {
    const user = request.user as { id: string };
    const body = request.body as any;

    const [expense] = await db.insert(expenses).values({
      ...body,
      paidById: user.id,
    }).returning();

    return expense;
  });

  // Get expense summary
  fastify.get('/family/:familyId/summary', { onRequest: [authenticate] }, async (request) => {
    const { familyId } = request.params as { familyId: string };

    const summary = await db
      .select({
        category: expenses.category,
        total: sql<number>`sum(${expenses.amount})`,
      })
      .from(expenses)
      .where(eq(expenses.familyId, familyId))
      .groupBy(expenses.category);

    return summary;
  });
}
