# Smart Campus Utility App - Backend API

Node.js + Express.js REST API for the Smart Campus Utility Application.

## Overview

This is a production-ready backend API built with Node.js and Express.js, providing comprehensive REST endpoints for:
- **Authentication** - User registration and JWT-based login
- **Issue Reporting** - Campus issue tracking with status lifecycle
- **Announcements** - Campus-wide announcements management
- **Room Booking** - Resource reservation system

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 12+
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Logging**: winston
- **Environment**: dotenv

## Architecture

The application follows a **layered, modular architecture**:

```
HTTP Request
    ↓
Controller Layer (Input validation, HTTP handling)
    ↓
Service Layer (Business logic, validations)
    ↓
Repository Layer (Data access, queries)
    ↓
Database Layer (PostgreSQL)
```

Each feature is organized as an independent module with its own controllers, services, and repositories.

## Project Structure

```
backend/
├── src/
│   ├── app.js                 # Express app setup
│   ├── controllers/           # HTTP request handlers
│   │   ├── authController.js
│   │   ├── issueController.js
│   │   ├── announcementController.js
│   │   └── bookingController.js
│   ├── services/              # Business logic
│   │   ├── authService.js
│   │   ├── issueService.js
│   │   ├── announcementService.js
│   │   └── bookingService.js
│   ├── repositories/          # Data access layer
│   │   ├── userRepository.js
│   │   ├── issueRepository.js
│   │   ├── announcementRepository.js
│   │   └── bookingRepository.js
│   ├── middleware/            # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── config/                # Configuration
│   │   ├── database.js
│   │   ├── logger.js
│   │   └── auth.js
│   ├── utils/                 # Helper functions
│   │   └── helpers.js
│   └── logs/                  # Log files
├── tests/                     # Test files
├── package.json               # Dependencies
├── .env.example               # Environment variables template
└── README.md
```

## Prerequisites

Before getting started, ensure you have:

- Node.js 18+ installed
- PostgreSQL 12+ installed and running
- npm or yarn installed

## Installation & Setup

### 1. Clone & Install Dependencies

```bash
cd backend
npm install
```

### 2. Create PostgreSQL Database

```bash
createdb smart_campus
```

Or if using psql:

```bash
psql -U postgres
CREATE DATABASE smart_campus;
\q
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
NODE_ENV=development
PORT=5000
HOST=localhost

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_campus
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_ACCESS_TOKEN_EXPIRY=900
JWT_REFRESH_TOKEN_EXPIRY=604800

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 4. Run Database Migrations

Execute the migration files to create tables:

```bash
# Using psql
psql -U postgres -d smart_campus -f database/migrations/001_create_users_table.sql
psql -U postgres -d smart_campus -f database/migrations/002_create_issues_table.sql
psql -U postgres -d smart_campus -f database/migrations/003_create_announcements_table.sql
psql -U postgres -d smart_campus -f database/migrations/004_create_rooms_and_bookings_tables.sql
```

Or create a Node.js migration script in the future.

### 5. Start the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will start on `http://localhost:5000`

### 6. Verify Server is Running

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-04-16T10:30:00.000Z"
}
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Available Endpoints

#### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT tokens
- `GET /auth/profile` - Get current user profile (requires auth)

#### Issues
- `POST /issues` - Create issue (students)
- `GET /issues` - List issues (with filters)
- `GET /issues/:id` - Get issue details
- `PATCH /issues/:id` - Update issue status (admins)
- `DELETE /issues/:id` - Delete issue (admins)

#### Announcements
- `POST /announcements` - Create announcement (admins)
- `GET /announcements` - List announcements
- `GET /announcements/:id` - Get announcement details
- `PATCH /announcements/:id` - Update announcement (admins)
- `DELETE /announcements/:id` - Delete announcement (admins)

#### Bookings
- `POST /bookings` - Create booking
- `GET /bookings` - List user's bookings
- `GET /bookings/:id` - Get booking details
- `DELETE /bookings/:id` - Cancel booking

See [../docs/api_contracts.md](../docs/api_contracts.md) for detailed API documentation.

## Key Features

### Authentication & Authorization
- JWT-based stateless authentication
- Role-based access control (STUDENT, ADMIN)
- Automatic token expiration (15 min access, 7 day refresh)
- Password hashing with bcrypt

### Error Handling
- Consistent error response format
- HTTP status codes (400, 401, 403, 404, 500)
- Database error handling (unique constraints, foreign keys)
- Request validation

### Logging
- Request logging with Morgan
- Application logging with Winston
- Error tracking with stack traces
- Log levels: debug, info, warn, error

### Data Validation
- Input validation at controller level
- Business logic validation at service level
- Database constraints at schema level

## Development Workflow

### Code Quality

**Lint code:**
```bash
npm run lint
```

**Format code:**
```bash
npm run format
```

### Testing

**Run tests:**
```bash
npm test
```

**Watch mode:**
```bash
npm run test:watch
```

### Database Management

**Connect to database:**
```bash
psql -U postgres -d smart_campus
```

**Useful psql commands:**
```sql
-- List all tables
\dt

-- Describe a table
\d issues

-- Show table indexes
\di

-- Exit
\q
```

## Deployment

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS to match frontend domain
- [ ] Set up PostgreSQL with SSL
- [ ] Configure database backups
- [ ] Set up monitoring and alerting
- [ ] Use environment-specific .env files
- [ ] Enable HTTPS/TLS

### Deploy to Heroku

```bash
heroku create smart-campus-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
heroku run "psql < database/migrations/001_create_users_table.sql"
```

## Troubleshooting

### Database Connection Issues

**Error**: `connect ECONNREFUSED 127.0.0.1:5432`

**Solution**: Ensure PostgreSQL is running:
```bash
# macOS with Homebrew
brew services start postgresql

# Linux
sudo service postgresql start

# Windows
net start PostgreSQL12
```

### Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**: Change the PORT in `.env` or kill the process:
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### JWT Token Errors

**Error**: `Unauthorized - Invalid token`

**Solution**: 
- Ensure token is passed correctly in header: `Authorization: Bearer <token>`
- Check token hasn't expired
- Verify JWT_SECRET matches between encoding and decoding

## Performance Tips

1. **Database Indexing**: Queries use indexes on frequently searched columns
2. **Connection Pooling**: PostgreSQL connection pool (min: 5, max: 20)
3. **Pagination**: All list endpoints support pagination (limit, offset)
4. **Compression**: Enable gzip compression in production
5. **Caching**: Implement Redis for announcements (future enhancement)

## Security Best Practices

1. ✅ Passwords hashed with bcrypt (10 salt rounds)
2. ✅ JWT tokens with expiration
3. ✅ Input validation on all endpoints
4. ✅ SQL injection prevention (parameterized queries)
5. ✅ CORS configuration for frontend domain
6. ✅ Helmet.js for HTTP security headers
7. ✅ Error messages don't leak sensitive data
8. ✅ Rate limiting recommended (add express-rate-limit)

## Next Steps

1. Set up frontend (React) in `../frontend`
2. Run integration tests with the frontend
3. Deploy to staging environment
4. Set up CI/CD pipeline with GitHub Actions
5. Configure production database and monitoring

## Support & Resources

- [Express.js Documentation](https://expressjs.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js/)

## License

MIT
