# Architecture Plan - Smart Campus Utility Application

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Auth Module  │  │ Student      │  │ Admin        │       │
│  │ (Login/Reg)  │  │ Dashboard    │  │ Dashboard    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                          ↓
        JWT Tokens (Axios Interceptors)
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              API Gateway / Load Balancer                    │
│                (Optional for production)                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                Backend (Service Layer)                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            Authentication Service                  │    │
│  │  (JWT generation, token validation, user auth)     │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Issue Reporting Service                │    │
│  │  (CRUD, status management, lifecycle)              │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            Announcement Service                     │    │
│  │  (Create, update, distribute, fetch)                │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │             Booking Service (Bonus)                 │    │
│  │  (Room management, double-booking prevention)       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│            Data Access Layer (Repositories)                 │
│  (User | Issue | Announcement | Booking Repositories)      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ users    │ │ issues   │ │announcem.│ │ bookings │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## Layered Architecture Pattern

### Presentation Layer (Frontend)
- **Responsibility**: UI rendering, form handling, user interaction
- **Components**:
  - Authentication components (Login, Register)
  - Student Dashboard (View issues, announcements, manage bookings)
  - Admin Dashboard (Manage issues, create announcements)
  - Reusable UI components

### API Layer (Backend - REST)
- **Responsibility**: HTTP request handling, input validation, response formatting
- **Pattern**: Controllers expose endpoints

### Service Layer (Backend - Business Logic)
- **Responsibility**: Implement business rules, orchestrate repositories, handle transactions
- **Examples**:
  - AuthService: Validate credentials, generate JWT
  - IssueService: Implement status workflow, validations
  - AnnouncementService: Filter by date, manage visibility

### Data Access Layer (Repositories)
- **Responsibility**: Database queries, persistence operations
- **Pattern**: Repository pattern (abstract DB implementation)

### Database Layer
- **Responsibility**: Data storage, integrity, relationships
- **Schema**: Normalized SQL tables with foreign keys

---

## Service-Oriented Architecture (SOA) Principles

### 1. Authentication Service
**Endpoints**:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/profile`

**Responsibilities**:
- User credential validation
- Password hashing (bcrypt)
- JWT token generation and validation
- Role assignment

**Dependencies**: User Repository

---

### 2. Issue Reporting Service
**Endpoints**:
- `POST /issues` - Create
- `GET /issues` - List (with filters)
- `GET /issues/:id` - Get details
- `PATCH /issues/:id` - Update status
- `DELETE /issues/:id` - Delete (Admin)

**Responsibilities**:
- Enforce status workflow (OPEN → IN_PROGRESS → RESOLVED)
- Validate transitions (only Admins can change status)
- Track issue history
- Authorization checks (users see their own issues)

**Dependencies**: Issue Repository, User Repository

---

### 3. Announcement Service
**Endpoints**:
- `POST /announcements` - Create (Admin only)
- `GET /announcements` - List
- `PATCH /announcements/:id` - Update (Admin only)
- `DELETE /announcements/:id` - Delete (Admin only)

**Responsibilities**:
- Validate Admin role before CRUD
- Filter expired announcements
- Timestamp management

**Dependencies**: Announcement Repository, User Repository

---

### 4. Booking Service (Bonus)
**Endpoints**:
- `POST /bookings` - Create
- `GET /bookings` - List user bookings
- `GET /rooms` - List available rooms
- `DELETE /bookings/:id` - Cancel

**Responsibilities**:
- Prevent double-booking (check time conflicts)
- Room availability management
- Status transitions (CONFIRMED → CANCELLED)

**Dependencies**: Booking Repository, Room Repository, User Repository

---

## Cross-Cutting Concerns

### Authentication & Authorization
- **Mechanism**: JWT (JSON Web Tokens)
- **Flow**:
  1. User logs in → Server generates JWT with user ID + role
  2. Client stores JWT
  3. Client includes JWT in `Authorization: Bearer <token>` header
  4. Server validates JWT on each protected request
  5. If expired, client refreshes using `/auth/refresh` endpoint

### Middleware Stack
1. **CORS Middleware** - Allow frontend requests
2. **Request Logging Middleware** - Log all requests
3. **Authentication Middleware** - Validate JWT
4. **Authorization Middleware** - Check roles
5. **Error Handling Middleware** - Consistent error responses
6. **Request Validation Middleware** - Validate input schema

### Error Handling
- Consistent HTTP status codes:
  - `200` - Success
  - `400` - Bad Request (validation error)
  - `401` - Unauthorized (missing/invalid JWT)
  - `403` - Forbidden (insufficient permissions)
  - `404` - Not Found
  - `500` - Internal Server Error

---

## Deployment Architecture (Conceptual)

```
Developer → GitHub (Push Code)
              ↓
         GitHub Actions / CI/CD Pipeline
              ↓
        (Optional) Run Tests & Linting
              ↓
         Docker Container Build
              ↓
         Deploy to Server (AWS/Azure/Heroku)
              ↓
         Frontend served on port :3000
         Backend served on port :5000
         PostgreSQL on port :5432
```

---

## Technology Selection Rationale

### Frontend: React.js
- ✅ Component-based, reusable UI
- ✅ Strong ecosystem (Axios, React Router)
- ✅ JWT token handling via interceptors
- ✅ Easy testing (Jest, React Testing Library)

### Database: PostgreSQL
- ✅ Robust, open-source SQL database
- ✅ Excellent for RBAC (role-based access control)
- ✅ Foreign key constraints prevent data inconsistency
- ✅ JSONB for flexibility when needed

### Backend (To be Selected)
- **Node.js/Express**: Fastest development, single language (JS)
- **Java/Spring Boot**: Enterprise-grade, strong patterns
- **.NET/ASP.NET Core**: Windows ecosystem, strong tooling
- **Python/FastAPI**: Clean syntax, rapid prototyping

### JWT Authentication
- ✅ Stateless (no server-side session storage)
- ✅ Scalable (works with load balancers)
- ✅ Standard (RFC 7519)
- ✅ Includes claims (user ID, role) in token

---

## Development Workflow

### Code Organization
```
Atomic Vertical Slices:
1. Database Table (Migration)
2. Data Model/Entity
3. Repository
4. Service
5. Controller/API Endpoint
6. Frontend Component
7. Integration tests
8. API documentation
```

### Branching Strategy
```
main (production)
  ↑
develop (integration)
  ↑
feature/lab-1-auth (feature branch)
feature/lab-2-issues
...
```

### Definition of "Done" for Each Feature
- ✅ Code written and reviewed
- ✅ Unit tests pass
- ✅ Integration tests pass
- ✅ API documented
- ✅ Frontend integrated
- ✅ No console errors/warnings
- ✅ Code follows style guide

---

## Performance Considerations

### Backend Optimizations
- Connection pooling for database
- Query indexing on frequently searched columns (user_id, status)
- Caching layer (Redis) for announcements (optional)

### Frontend Optimizations
- Lazy load admin/student dashboards
- Memoize components to prevent unnecessary re-renders
- Pagination for long lists (issues, bookings)

### Database Optimizations
- Indexes on foreign keys
- Composite indexes for common filter combinations
- Archive old resolved issues (partitioning)

---

## Security Best Practices

1. **Password Storage**: Bcrypt with salt rounds ≥ 10
2. **JWT Secret**: Strong random string, rotate periodically
3. **HTTPS Only**: In production, enforce TLS 1.3+
4. **Input Validation**: Sanitize all user inputs
5. **SQL Injection Prevention**: Use parameterized queries
6. **CSRF Protection**: CSRF tokens for state-changing operations
7. **Rate Limiting**: Prevent brute force attacks on login
8. **CORS Configuration**: Whitelist frontend domain only
9. **Sensitive Data**: Never log passwords or tokens
10. **Token Expiration**: Short-lived access tokens (15 min), long-lived refresh tokens (7 days)

---

## Testing Strategy

### Unit Tests
- Service layer logic (validations, calculations)
- Repository layer queries
- Utility functions

### Integration Tests
- Full flow: API endpoint → Service → Repository → DB
- Example: POST /issues → verify issue is in database

### End-to-End (E2E) Tests
- Selenium/Cypress: User workflow (login → create issue → verify in list)
- Run against staging environment

---

## Future Enhancements

1. **WebSocket for Real-Time Updates**: Announcements push to connected clients
2. **Email Notifications**: Notify users on issue status changes
3. **File Upload**: Attach screenshots/documents to issues
4. **Advanced Analytics**: Admin dashboard with statistics
5. **Mobile App**: React Native version
6. **API Versioning**: v1, v2 support for backward compatibility
7. **Microservices**: Split each service into separate containers

