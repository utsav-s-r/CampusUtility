# PROJECT CONTEXT & DECISIONS

## Current State
**Last Updated**: Lab 0 - Project Initialization  
**Status**: Setting up architectural blueprint

---

## Key Decisions

### Backend Technology
**Status**: ✅ SELECTED
**Choice**: Node.js + Express
**Rationale**:
- Fastest development (same language as React frontend)
- Large npm ecosystem
- Perfect for REST APIs
- Full-stack JavaScript shop
- Excellent for demonstrating Copilot throughout
- Timeline: 5-7 days total

**Tech Stack**:
- Runtime: Node.js 18+
- Framework: Express.js
- Auth: jsonwebtoken (JWT)
- Database Driver: pg (PostgreSQL)
- Validation: express-validator
- Testing: Jest + Supertest
- Logging: winston
- Environment: dotenv

### Database
**Selected**: PostgreSQL
**Rationale**: SQL-based, robust, open-source, excellent for role-based access control

---

## Architecture Overview

### Service-Oriented Architecture (SOA)
The application is divided into independent services:

#### 1. **Authentication Service**
- Handles user login/registration
- Generates and validates JWT tokens
- Manages role assignment (Student/Admin)

#### 2. **Issue Reporting Service**
- CRUD operations for issue tickets
- Issue lifecycle: OPEN → IN_PROGRESS → RESOLVED
- Maintains issue history and status updates

#### 3. **Announcement Service**
- Create/update announcements (Admin only)
- Fetch and filter announcements (Students + Admins)
- Real-time updates (future: WebSocket)

#### 4. **Booking Service** (Bonus)
- Room/resource availability management
- Double-booking prevention
- Cancellation handling

---

## Data Models (High-Level)

### Users
```
- id (PK)
- email (unique)
- password (hashed)
- name
- role (STUDENT | ADMIN)
- created_at
- updated_at
```

### Issues
```
- id (PK)
- user_id (FK → Users)
- title
- description
- status (OPEN | IN_PROGRESS | RESOLVED)
- priority (LOW | MEDIUM | HIGH)
- created_at
- resolved_at
- admin_notes
```

### Announcements
```
- id (PK)
- admin_id (FK → Users)
- title
- content
- created_at
- updated_at
- expiry_date (optional)
```

### Bookings (Bonus)
```
- id (PK)
- user_id (FK → Users)
- room_id
- start_time
- end_time
- status (CONFIRMED | CANCELLED)
- created_at
```

---

## API Endpoints (High-Level)

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login (returns JWT)
- `POST /auth/refresh` - Refresh JWT token
- `GET /auth/profile` - Get current user profile (protected)

### Issues
- `POST /issues` - Create issue (Students)
- `GET /issues` - List issues (filtered by user role)
- `GET /issues/:id` - Get issue details
- `PATCH /issues/:id` - Update issue status (Admins)
- `DELETE /issues/:id` - Delete issue (Admins)

### Announcements
- `POST /announcements` - Create announcement (Admins)
- `GET /announcements` - List announcements (all users)
- `PATCH /announcements/:id` - Update announcement (Admins)
- `DELETE /announcements/:id` - Delete announcement (Admins)

### Bookings (Bonus)
- `POST /bookings` - Create booking
- `GET /bookings` - List user bookings
- `GET /rooms` - List available rooms
- `DELETE /bookings/:id` - Cancel booking

---

## Folder Structure (Backend - TBD Based on Technology)

### General Pattern
```
backend/
├── src/
│   ├── controllers/          # HTTP request handlers
│   │   ├── AuthController
│   │   ├── IssueController
│   │   ├── AnnouncementController
│   │   └── BookingController
│   ├── services/             # Business logic
│   │   ├── AuthService
│   │   ├── IssueService
│   │   ├── AnnouncementService
│   │   └── BookingService
│   ├── repositories/         # Data access layer
│   │   ├── UserRepository
│   │   ├── IssueRepository
│   │   ├── AnnouncementRepository
│   │   └── BookingRepository
│   ├── models/              # Data models/entities
│   ├── middleware/          # Auth, validation, logging
│   ├── utils/               # Helpers, validators
│   ├── config/              # Configuration
│   └── main.[ts|java|cs|py] # Application entry point
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── README.md
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── StudentDashboard/
│   │   ├── AdminDashboard/
│   │   ├── Issues/
│   │   ├── Announcements/
│   │   └── Common/
│   ├── pages/
│   ├── services/
│   │   └── api.js          # Axios instance with JWT interceptors
│   ├── hooks/
│   │   └── useAuth.js      # Auth context hook
│   ├── context/
│   │   └── AuthContext.js
│   ├── utils/
│   └── App.jsx
├── public/
└── README.md
```

---

## Development Strategy

### Vertical Slice Approach
Each feature is implemented as a complete slice from Database → Backend API → Frontend UI:

**Example - Issue Reporting Slice**:
1. Create `issues` table (Migration)
2. Implement IssueRepository (Data Access)
3. Implement IssueService (Business Logic)
4. Implement IssueController (API Endpoints)
5. Create Issue Form Component (Frontend)
6. Create Issue List Component (Frontend)
7. Integration test the entire flow

### Modular Principles
- ✅ Single Responsibility: Each class/file does ONE thing
- ✅ Decouple Services: Controller → Service → Repository (never skip layers)
- ✅ Interface-First: Define contracts before implementation
- ✅ Dry Run: Explain logic before coding

---

## Labs Checklist

- [x] **Lab 0**: Project Initialization (COMPLETE - Generated all architecture docs)
- [ ] **Lab 1**: Requirement Analysis (NEXT - Use Copilot to identify edge cases)
- [ ] **Lab 2**: Architecture Design (COMPLETE - All docs already generated)
- [x] **Lab 3**: Backend Development (IN PROGRESS - Node.js + Express project created)
- [ ] **Lab 4**: Frontend Development (React.js setup)
- [ ] **Lab 5**: Database Design (SQL migrations created - ready to run)
- [ ] **Lab 6**: Unit Testing (Write tests for services)
- [ ] **Lab 7**: Refactoring (Code quality improvements)
- [ ] **Lab 8**: Documentation (Generate API docs & Swagger)
- [ ] **Lab 9**: Agent Mode (Copilot comprehensive review)

---

## Notes for Future Labs

**When starting a new lab**, reference this file:
```
"Referencing our CONTEXT.md and architecture plan, help me build Lab X..."
```

This keeps the agent aligned with earlier decisions.
