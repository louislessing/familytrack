# FamilyTrack

A comprehensive family management platform for co-parenting, guardianship, and foster care coordination.

## Features

- **Children Profiles** - Manage child information, medical details, school info
- **Shared Calendar** - Family calendar with custody schedules and appointments
- **Handover Tracking** - Log custody exchanges with time, location, photo proof
- **Expense Management** - Track child-related expenses across 16+ categories
- **Communications Log** - Document all co-parent communications for legal records
- **Document Storage** - Secure storage for court orders, medical records, legal documents
- **Guardians & Foster Care** - Support for multiple carer types
- **Legal Records** - Track court orders, custody agreements, compliance

## Tech Stack

### Frontend
- React 19
- TanStack Router (file-based routing)
- TanStack Query (server state management)
- Tailwind CSS v4
- shadcn/ui components
- TypeScript

### Backend
- Node.js 20
- Fastify
- PostgreSQL 16
- Drizzle ORM
- Redis (optional caching)
- TypeScript

## Prerequisites

- Node.js 20+
- Docker Desktop (for local development)
- PostgreSQL 16 (if not using Docker)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### 3. Start Database (Local Development)

```bash
docker-compose up -d postgres redis
```

### 4. Run Database Migrations

```bash
npm run db:push
npm run db:migrate
```

### 5. Start Development Servers

Terminal 1 - Backend API:
```bash
npm run api:dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Health: http://localhost:3000/health

## Deployment

### Railway.app

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Render.com

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure environment variables
4. Deploy automatically on git push

### Docker

```bash
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

## Scripts

- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run api:dev` - Start backend development server
- `npm run api:start` - Start backend production server
- `npm run db:push` - Push database schema changes
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio
- `npm run test` - Run tests
- `npm run format` - Format code with Prettier

## Environment Variables

See `.env.example` for all available environment variables.

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens (min 32 chars)
- `PORT` - Backend API port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

### Families
- `GET /api/v1/families` - List families
- `POST /api/v1/families` - Create family
- `GET /api/v1/families/:id` - Get family

### Children
- `GET /api/v1/children/family/:familyId` - List children
- `POST /api/v1/children` - Add child
- `GET /api/v1/children/:id` - Get child

### Events
- `GET /api/v1/events/family/:familyId` - List events
- `POST /api/v1/events` - Create event

### Expenses
- `GET /api/v1/expenses/family/:familyId` - List expenses
- `POST /api/v1/expenses` - Add expense
- `GET /api/v1/expenses/family/:familyId/summary` - Get summary

## Security

- JWT authentication with bcrypt password hashing
- Rate limiting to prevent abuse
- CORS configuration
- Helmet for security headers
- Input validation with Zod
- SQL injection protection via Drizzle ORM

## License

Proprietary - All rights reserved

## Support

For issues, questions, or feature requests, please contact support@familytrack.app
