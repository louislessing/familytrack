import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import { db } from '../db/index.js';
import { users } from '../db/schema/users.js';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post('/register', async (request, reply) => {
    try {
      const body = registerSchema.parse(request.body);

      // Check if user exists
      const existingUser = await db.select().from(users).where(eq(users.email, body.email));
      if (existingUser.length > 0) {
        return reply.code(400).send({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(body.password, 10);

      // Create user
      const [newUser] = await db.insert(users).values({
        email: body.email,
        password: hashedPassword,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
      }).returning();

      const token = fastify.jwt.sign({
        id: newUser.id,
        email: newUser.email
      });

      return {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName
        }
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(400).send({ error: 'Invalid request' });
    }
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body);

      const [user] = await db.select().from(users).where(eq(users.email, body.email));
      if (!user) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(body.password, user.password);
      if (!validPassword) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      const token = fastify.jwt.sign({
        id: user.id,
        email: user.email
      });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(400).send({ error: 'Invalid request' });
    }
  });

  // Get current user
  fastify.get('/me', {
    onRequest: [async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ error: 'Unauthorized' });
      }
    }]
  }, async (request, reply) => {
    const payload = request.user as { id: string };
    const [user] = await db.select().from(users).where(eq(users.id, payload.id));

    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };
  });
}
