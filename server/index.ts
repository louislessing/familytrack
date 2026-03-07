import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import familiesRoutes from './routes/families.js';
import childrenRoutes from './routes/children.js';
import eventsRoutes from './routes/events.js';
import expensesRoutes from './routes/expenses.js';
import handoversRoutes from './routes/handovers.js';

dotenv.config();

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// Register plugins
await fastify.register(helmet);
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
});

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-super-secret-key-change-this-to-random-32-chars-min',
});

await fastify.register(rateLimit, {
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  timeWindow: Number(process.env.RATE_LIMIT_WINDOW) || 900000,
});

await fastify.register(multipart);

// Health check
fastify.get('/health', async () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
});

// Register routes
await fastify.register(authRoutes, { prefix: '/api/v1/auth' });
await fastify.register(familiesRoutes, { prefix: '/api/v1/families' });
await fastify.register(childrenRoutes, { prefix: '/api/v1/children' });
await fastify.register(eventsRoutes, { prefix: '/api/v1/events' });
await fastify.register(expensesRoutes, { prefix: '/api/v1/expenses' });
await fastify.register(handoversRoutes, { prefix: '/api/v1/handovers' });

// Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`Server running on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
