# FamilyTrack Setup Guide

This guide will help you set up your FamilyTrack instance based on your configuration.

## Quick Start

### Prerequisites
- Node.js 20+
- Docker Desktop (for local development)
- PostgreSQL 16 (if not using Docker)
- Redis (optional, for caching)

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

3. **Start Database (Local Development)**
   ```bash
   docker-compose up -d postgres redis
   ```

4. **Run Database Migrations**
   ```bash
   npm run db:push
   npm run db:migrate
   ```

5. **Seed Database (Optional)**
   ```bash
   npm run db:seed
   ```

6. **Start Development Servers**

   Terminal 1 - Backend API:
   ```bash
   npm run api:dev
   ```

   Terminal 2 - Frontend:
   ```bash
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Health: http://localhost:3000/health

## Deployment Options

### Railway.app (Recommended for Production)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init

# Deploy
railway up
```

### Render.com
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure environment variables
4. Deploy automatically on git push

### Docker Production
```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

## Features Configuration

Your FamilyTrack instance includes the following features:
- Children Profiles
- Calendar & Events
- Handover Tracking
- Expense Management
- Communication Logs
- Document Storage
- Guardian Management
- Legal Records
- Clothing Inventory
- LAC Reviews

## Environment Variables Reference

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens (min 32 chars)
- `PORT` - Backend API port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### Optional
- `REDIS_URL` - Redis connection string (for caching)
- `VITE_API_URL` - Frontend API URL
- `S3_BUCKET` - S3 bucket for document storage
- `S3_REGION` - AWS region for S3
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key

## Database Schema

The database includes the following tables:
- `users` - User authentication and profiles
- `families` - Family management
- `children` - Children profiles
- `events` - Calendar events
- `expenses` - Expense tracking
- `handovers` - Custody handovers
- `communications` - Communication logs
- `documents` - Document metadata
- `guardians` - Guardian information
- `legal_records` - Legal documents and court orders
- `clothing_inventory` - Clothing tracking
- `lac_reviews` - Looked After Children reviews

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh token

### Families
- `GET /api/v1/families` - List families
- `POST /api/v1/families` - Create family
- `GET /api/v1/families/:id` - Get family
- `PUT /api/v1/families/:id` - Update family
- `DELETE /api/v1/families/:id` - Delete family

### Children
- `GET /api/v1/children/family/:familyId` - List children
- `POST /api/v1/children` - Add child
- `GET /api/v1/children/:id` - Get child
- `PUT /api/v1/children/:id` - Update child
- `DELETE /api/v1/children/:id` - Delete child

### Events
- `GET /api/v1/events/family/:familyId` - List events
- `POST /api/v1/events` - Create event
- `PUT /api/v1/events/:id` - Update event
- `DELETE /api/v1/events/:id` - Delete event

### Expenses
- `GET /api/v1/expenses/family/:familyId` - List expenses
- `POST /api/v1/expenses` - Add expense
- `GET /api/v1/expenses/family/:familyId/summary` - Get summary

## Testing

### Run Tests
```bash
# Unit tests
npm run test

# Smoke tests
npm run test:smoke

# Database connection test
npm run test:db

# API configuration test
npm run test:api
```

### Code Quality
```bash
# Lint
npm run format

# Type check
tsgo --noEmit
```

## Security Best Practices

1. **JWT Secret**: Use a strong, random secret (min 32 characters)
2. **Database**: Use strong passwords and restrict access
3. **HTTPS**: Always use HTTPS in production
4. **Environment Variables**: Never commit .env files
5. **Rate Limiting**: Configure appropriate rate limits
6. **CORS**: Configure CORS for your domain only
7. **Input Validation**: All inputs are validated with Zod
8. **SQL Injection**: Protected by Drizzle ORM

## Troubleshooting

### Database Connection Issues
```bash
# Test database connection
npm run test:db
```

### Migration Issues
```bash
# Reset database (development only)
npm run db:push

# View database in Drizzle Studio
npm run db:studio
```

### Port Conflicts
If ports 3000 or 5173 are in use, update them in:
- `.env` (PORT for backend)
- `vite.config.js` (port for frontend)

## Support

For issues, questions, or feature requests:
- GitHub Issues: https://github.com/louislessing/familytrack/issues
- Email: support@familytrack.app

## License

This software is proprietary and owned by Louis Lessing. See LICENSE file for details.
