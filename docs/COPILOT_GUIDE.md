# GitHub Copilot Usage Guide - Lab by Lab

This guide shows you how to effectively use GitHub Copilot at each stage of the Smart Campus Utility Application.

---

## Overall Copilot Strategy

**Power Keywords** (Use these in prompts):
- **"Decouple"** - When features are mixed, request separation
- **"Interface-first"** - Define contracts before implementation
- **"Dry run"** - Ask Copilot to explain logic before writing code
- **"Single Responsibility"** - Enforce one-file-one-job principle
- **"Generate"** - Ask for code/configs/schemas
- **"Refactor"** - Request code improvements

---

## Lab 1: Requirement Analysis

### Goal
Identify all requirements, edge cases, and constraints.

### Copilot Prompt
```
I am building a Smart Campus Utility App with these core features:
1. User Management (Student/Admin login with JWT)
2. Issue Reporting (Students report, admins manage with status lifecycle)
3. Campus Announcements (Admins create, students view real-time)
4. Room Bookings (Bonus: reserve rooms with double-booking prevention)

Using GitHub Copilot, help me:
1. List all functional requirements for each feature
2. Identify edge cases and constraints
3. Define acceptance criteria
4. List potential error scenarios
5. Create user stories

Make sure to decouple requirements - list what each service should do independently.
```

### Copilot Chat Usage
1. Open Copilot Chat (Cmd+Shift+I on Mac)
2. Paste the above prompt
3. Review generated requirements
4. Ask follow-up questions:
   - "What if a student tries to access another student's issues?"
   - "How do we handle expired announcements?"
   - "What prevents double-booking?"

### Deliverables
- Requirements document
- User stories
- Edge cases list
- Error scenarios

### Where It Lives
- `docs/requirements.md` (create after this lab)

---

## Lab 2: Architecture Design

### Goal
Design full-stack architecture, define API contracts, data models.

### Copilot Prompts

**Prompt 1: Service Architecture**
```
Referencing our requirements from Lab 1, help me design a Service-Oriented Architecture.

Define the following services:
1. Authentication Service - What methods/endpoints?
2. Issue Reporting Service - What methods/endpoints?
3. Announcement Service - What methods/endpoints?
4. Booking Service - What methods/endpoints?

For each service, list:
- Responsibilities
- Dependencies (other services)
- Data it owns
- Endpoints it exposes

Use Interface-first approach: define service interfaces before implementation.
```

**Prompt 2: Database Schema**
```
Based on our SOA design, generate a PostgreSQL schema with:
1. Users table (id, email, password_hash, name, role, created_at)
2. Issues table (id, user_id, title, description, status, priority, created_at, resolved_at)
3. Announcements table (id, admin_id, title, content, created_at, expiry_date)
4. Bookings table (id, user_id, room_id, start_time, end_time, status)
5. Rooms table (id, name, capacity, location)

For each table:
- Define appropriate constraints
- Suggest indexes for common queries
- Define foreign key relationships
- Include migration comments
```

**Prompt 3: API Contracts**
```
Generate REST API contracts for the [Authentication|Issue|Announcement|Booking] Service.

For each endpoint:
- Method and path (e.g., POST /auth/login)
- Request body with example
- Response body with example
- HTTP status codes
- Authorization requirements
- Validation rules

Format as OpenAPI/Swagger compatible JSON.
```

### Copilot Code Completion Usage
As you write endpoints in documentation, Copilot will suggest:
- Related endpoints
- Common parameter patterns
- Error responses
- Status codes

**Accept suggestions** that match your architecture.

### Deliverables
- Service architecture diagram (in CONTEXT.md)
- Complete API contracts
- Database schema with migrations
- Folder structure plan

### Where It Lives
- `docs/architecture_plan.md` ✅ (Already created)
- `docs/api_contracts.md` ✅ (Already created)
- `docs/data_models.md` ✅ (Already created)

---

## Lab 3: Backend Development

### Goal
Implement REST APIs using your chosen backend technology.

### Copilot Chat Prompts

**For Each Feature (Use Vertical Slices)**:

```
I'm implementing the Issue Reporting Service using [Node.js Express | Java Spring Boot | etc].

Using GitHub Copilot, help me with a vertical slice:

1. Create the IssueRepository class:
   - queryByUserId(userId): Issue[]
   - queryByStatus(status): Issue[]
   - create(issue): Issue
   - updateStatus(id, newStatus): Issue

2. Create the IssueService class:
   - It should call IssueRepository
   - Implement business logic for status transitions
   - Validate that only admins can change status

3. Create the IssueController class:
   - POST /issues - Create issue
   - GET /issues - List issues (with filters)
   - PATCH /issues/:id - Update status (admin only)

For each, generate interfaces/contracts first, then implementation.
Make sure to:
- Use dependency injection
- Separate concerns (repository ≠ service ≠ controller)
- Include error handling
- Add JSDoc/docstring comments
```

### Copilot Inline Suggestions
As you type in your code files:

1. **Type**: `class IssueService {`
   - Copilot suggests: Constructor with dependencies, common methods
   - ✅ Accept suggestions matching your architecture

2. **Type**: `async createIssue(issue) {`
   - Copilot suggests: Validation, database call, error handling
   - ⚠️ Review suggestions, modify if needed

3. **Type**: `// Validate status transition`
   - Copilot suggests: Logic for valid transitions
   - ✅ Usually accurate if given good comments

### Best Practices in Copilot Chat

**Dry Run Pattern**:
```
Before you generate code, explain to me:
1. How will the Controller layer receive requests?
2. How will it validate input?
3. How will it call the Service?
4. What errors can occur?
5. What response should be returned?

Now generate the code for this Controller.
```

**Decouple Pattern**:
```
My IssueController is 300 lines long and has database queries mixed with HTTP logic.

Using GitHub Copilot, help me decouple this:
1. Controller should ONLY handle HTTP (validation, response formatting)
2. Service should ONLY handle business logic (workflows, validations)
3. Repository should ONLY handle database queries

Generate refactored versions of each.
```

### Code Generation Process

1. **Define** the interface/contract in a comment:
```javascript
// IssueService interface:
// - createIssue(title, description, userId): Promise<Issue>
// - getIssues(filters): Promise<Issue[]>
// - updateStatus(issueId, newStatus, adminId): Promise<Issue>
```

2. **Type**: Start the class definition
```javascript
class IssueService {
```

3. **Copilot suggests** method stubs and implementation
4. **Review** - Press Escape to reject, Tab to accept
5. **Modify** as needed for your specific requirements

### Deliverables (Lab 3)
- ✅ Auth Service (Register, Login, JWT generation)
- ✅ Issue Service (CRUD, status management)
- ✅ Announcement Service (CRUD)
- ✅ Booking Service (Create, List, check availability)
- ✅ Unit tests for each service

### Where It Lives
- `backend/src/services/` - Business logic
- `backend/src/controllers/` - HTTP handlers
- `backend/src/repositories/` - Data access
- `backend/tests/` - Unit tests

---

## Lab 4: Frontend Development

### Goal
Create React components for student/admin dashboards, integrate with backend.

### Copilot Chat Prompts

**Prompt: Auth Context & Login**
```
I'm building a React app with JWT authentication.

Using GitHub Copilot, help me create:

1. AuthContext.js:
   - Store: user, token, loading, error
   - Methods: login(), logout(), refreshToken()
   - Auto-refresh on token expiry

2. useAuth.js hook:
   - Consume AuthContext
   - Expose user, token, isAuthenticated

3. ProtectedRoute.jsx:
   - Redirect to login if not authenticated
   - Check user.role for admin-only routes

Include Axios interceptor to:
- Add JWT token to every request
- Handle 401 errors by refreshing token
- Retry original request after refresh

Make sure to handle edge cases:
- Token expired mid-request
- User logs out while request is pending
```

**Prompt: Student Dashboard**
```
Generate a StudentDashboard component that:

1. Fetches and displays:
   - User's reported issues (with status, priority, created_at)
   - Campus announcements (sorted by created_at desc)
   - User's room bookings (with times)

2. Provides actions:
   - "Report Issue" button → modal form
   - Issue list items → detail view
   - "Cancel booking" button for each booking

3. Uses:
   - React hooks (useState, useEffect)
   - Axios for API calls
   - Error handling with try/catch
   - Loading states for each section

Include:
- Component structure
- API call methods
- Error boundaries
- Refresh functionality
```

### Copilot Inline Suggestions

**Type**: `useEffect(() => {`
- Copilot suggests: Setting up dependencies, cleanup functions
- ✅ Accept for data fetching patterns

**Type**: `try { const response = await api.get('/issues')`
- Copilot suggests: Error handling, loading state management
- ✅ Usually good, but verify API endpoint

**Type**: `<button onClick={handleDeleteIssue}>`
- Copilot suggests: Confirmation dialog, error handling
- ✅ Good for UX improvements

### Component Generation Process

1. **Describe the component**:
```javascript
// StudentDashboard component
// - Display user's issues list (title, status, priority)
// - Display announcements (title, content, created_at)
// - Display bookings (room_name, start_time, end_time)
// - Allow create issue, view details, cancel booking
```

2. **Let Copilot generate** the skeleton
3. **Review** for:
   - Correct API endpoints (verify against CONTEXT.md)
   - Proper error handling
   - Loading states
4. **Customize** styling and logic
5. **Test** integration with backend

### Deliverables (Lab 4)
- ✅ Login/Register components
- ✅ Protected route wrapper
- ✅ Student Dashboard
- ✅ Admin Dashboard
- ✅ Issue form & list
- ✅ Announcement display
- ✅ Booking management

### Where It Lives
- `frontend/src/components/` - React components
- `frontend/src/hooks/useAuth.js` - Auth hook
- `frontend/src/context/AuthContext.js` - Auth context
- `frontend/src/services/api.js` - Axios instance

---

## Lab 5: Database Design & Integration

### Goal
Create SQL migrations, integrate with backend ORM/driver.

### Copilot Chat Prompts

**Prompt: SQL Migrations**
```
Generate PostgreSQL migration files for our schema.

I'm using [Flyway | Liquibase | TypeORM | Hibernate | Entity Framework | SQLAlchemy].

Create migration files:
1. 001_create_users_table.sql
2. 002_create_issues_table.sql
3. 003_create_announcements_table.sql
4. 004_create_rooms_table.sql
5. 005_create_bookings_table.sql

For each, include:
- CREATE TABLE statements with proper types
- PRIMARY KEYS and FOREIGN KEYS
- INDEXES for performance
- CONSTRAINTS (CHECK, UNIQUE, NOT NULL)
- UP and DOWN sections (for rollback)
- Comments explaining each table
```

**Prompt: Repository Implementation** (if not done in Lab 3)
```
Using [Prisma | Hibernate | Entity Framework | SQLAlchemy]:

Generate UserRepository class with:
- findById(id): User
- findByEmail(email): User
- create(userData): User
- update(id, userData): User
- delete(id): void

Make sure to:
- Use prepared statements (no SQL injection)
- Handle null/not found cases
- Add proper error handling
- Include timestamps automatically
```

### Database Connection Configuration

**Copilot Chat**:
```
Configure database connection in [backend language]:

My PostgreSQL database:
- Host: localhost
- Port: 5432
- Database: smart_campus
- User: postgres
- Password: [from .env]

Generate:
1. Connection pool configuration
2. .env.example file
3. Database initialization script
4. Connection health check endpoint

Make sure connection pooling is set to:
- Min: 5
- Max: 20
```

### Deliverables (Lab 5)
- ✅ SQL migration files
- ✅ Repository implementations for all entities
- ✅ Database connection pool setup
- ✅ Integration tests for repositories

### Where It Lives
- `database/migrations/` - SQL migration files
- `backend/src/repositories/` - Repository classes

---

## Lab 6: Unit Testing

### Goal
Write tests for backend services and frontend components.

### Copilot Chat Prompts

**Prompt: Backend Service Tests**
```
Generate unit tests for IssueService using [Jest | JUnit | xUnit | pytest].

Test cases:
1. createIssue() - Happy path
2. createIssue() - Validation failure (missing title)
3. getIssues() - Filter by status
4. updateStatus() - Only admin can update
5. updateStatus() - Invalid status transition
6. Edge case: Prevent duplicate issues in short time

Include:
- Mock dependencies (IssueRepository, AuthService)
- Setup/teardown
- Assertions for return values and side effects
- Error cases

Use AAA pattern: Arrange, Act, Assert
```

**Prompt: Frontend Component Tests**
```
Generate tests for StudentDashboard component using [Jest + React Testing Library].

Test cases:
1. Renders dashboard when authenticated
2. Shows loading state while fetching issues
3. Displays issues list correctly
4. Shows error message if API fails
5. "Create issue" button opens modal
6. Can cancel a booking
7. Filters issues by status

Use:
- render() for component rendering
- screen.getByRole() for element selection
- fireEvent or userEvent for interactions
- Mock Axios calls

Include proper async/await handling for API calls.
```

### Test File Generation

1. **Type** test filename pattern:
```javascript
// IssueService.test.js
describe('IssueService', () => {
  let issueService;
  let mockRepository;
  
  beforeEach(() => {
    // Copilot suggests: mock setup, service initialization
  });
  
  test('should create issue', () => {
    // Copilot suggests: test body
  });
});
```

2. **Copilot suggests** test structure and assertions
3. **Review** test logic for correctness
4. **Modify** API endpoint calls and mock data

### Deliverables (Lab 6)
- ✅ Service unit tests (>80% coverage)
- ✅ Repository unit tests
- ✅ Component tests for main UI flows
- ✅ Integration tests for critical paths

### Where It Lives
- `backend/tests/` - Backend test files
- `frontend/src/components/__tests__/` - Frontend test files

---

## Lab 7: Refactoring

### Goal
Improve code quality and maintainability.

### Copilot Chat Prompts

**Prompt: Code Review & Refactoring**
```
Review my IssueController code and identify:
1. Code smells (violations of SOLID principles)
2. Duplicate code that could be extracted
3. Error handling improvements needed
4. Missing validation
5. Performance issues

Based on your review, generate refactored versions that:
- Follow Single Responsibility Principle
- Extract common patterns
- Improve error handling
- Add input validation

Use dependency injection for all external dependencies.
```

**Prompt: Extract Common Patterns**
```
My codebase has these controller patterns repeated:
1. Try/catch around service call
2. HTTP response formatting
3. Permission checking

Generate:
1. BaseController abstract class with common methods
2. Decorators for permission checks
3. Middleware for response formatting
4. Error handling middleware

Use these to DRY up my controllers.
```

**Prompt: Performance Optimization**
```
Identify performance improvements for my application:
1. Missing database indexes
2. N+1 query problems
3. Unnecessary API calls
4. Component re-renders in React

Generate:
1. Database index creation queries
2. Refactored repositories with JOIN queries
3. React useMemo/useCallback optimizations
4. Caching strategy

Explain what each optimization does.
```

### Copilot Inline Suggestions

**As you type** refactoring changes:
- Copilot suggests improved patterns
- ✅ Accept suggestions that improve readability

**Before applying**:
- "Dry run": Have Copilot explain the refactoring benefits
- Run tests to ensure nothing breaks
- Review performance impact

### Deliverables (Lab 7)
- ✅ Refactored services following SOLID
- ✅ Extracted base classes/utilities
- ✅ Performance optimizations applied
- ✅ All tests still passing

---

## Lab 8: Documentation

### Goal
Generate README and API documentation.

### Copilot Chat Prompts

**Prompt: Backend README**
```
Generate a comprehensive README.md for the backend API.

Include:
1. Project overview
2. Technology stack
3. Prerequisites & setup
4. Database setup & migrations
5. Environment variables (.env example)
6. Running the server
7. API endpoints summary
8. Authentication flow
9. Error handling
10. Testing
11. Deployment
12. Troubleshooting

Make it detailed enough for a new developer to get started.
```

**Prompt: API Documentation (OpenAPI)**
```
Generate OpenAPI 3.0 specification (swagger.json) for all endpoints:
- /auth/register, /auth/login, /auth/refresh, /auth/profile
- /issues (CRUD), /issues/:id
- /announcements (CRUD)
- /bookings (CRUD), /rooms

For each endpoint include:
- Summary
- Parameters
- Request body schema
- Response schemas (200, 400, 401, 403, 404, 500)
- Security requirements
- Example values

Format as YAML or JSON compatible with Swagger UI.
```

**Prompt: Frontend README**
```
Generate README for React frontend.

Include:
1. Setup & installation
2. Environment variables
3. Running locally
4. Project structure explanation
5. Component overview
6. State management (Auth context)
7. API integration
8. Testing
9. Building for production
10. Common issues & solutions
```

### Deliverables (Lab 8)
- ✅ Backend README with full setup guide
- ✅ Frontend README with usage guide
- ✅ API documentation (Swagger/OpenAPI)
- ✅ Architecture documentation
- ✅ Deployment guide

### Where It Lives
- `backend/README.md`
- `frontend/README.md`
- `docs/API.md` (OpenAPI/Swagger)
- `docs/DEPLOYMENT.md`

---

## Lab 9: Agent Mode (Advanced)

### Goal
Use Copilot Agent for comprehensive end-to-end improvements.

### Copilot Agent Prompts

**Agent Prompt: Full Code Review**
```
@copilot

I have a complete Smart Campus Utility App built. Please:

1. Review the entire codebase for:
   - Code quality issues
   - Security vulnerabilities
   - Performance bottlenecks
   - Test coverage gaps
   - Documentation gaps

2. Suggest improvements for:
   - Error handling patterns
   - Logging & monitoring
   - Caching strategies
   - API response times

3. Generate a report with:
   - Findings by severity (Critical, High, Medium, Low)
   - Specific lines of code
   - Suggested fixes
   - Estimated effort to fix

Please be thorough and detailed.
```

**Agent Prompt: End-to-End Integration Testing**
```
@copilot

Generate a comprehensive end-to-end test scenario that:

1. Creates a user account (student & admin)
2. Student logs in and reports an issue
3. Admin receives the issue
4. Admin updates issue status to IN_PROGRESS
5. Student sees the update
6. Admin creates an announcement
7. Student views the announcement
8. Student books a room
9. Verify no double-bookings

Generate:
- E2E test code (Playwright/Cypress/Selenium)
- API test scenarios
- Expected behavior at each step
- Assertions for validation
```

**Agent Prompt: Security Audit**
```
@copilot

Perform a security audit of the authentication system:

1. Check JWT handling:
   - Token expiration enforcement
   - Refresh token security
   - Token storage (localStorage vs cookies)
   - CORS configuration

2. Check data protection:
   - Password hashing strength
   - SQL injection prevention
   - XSS prevention
   - CSRF protection

3. Check access control:
   - Role-based access enforcement
   - Endpoint authorization checks
   - Data isolation between users

Generate:
- Security test scenarios
- Vulnerabilities found
- Fixes recommended
- Security best practices checklist
```

### Deliverables (Lab 9)
- ✅ Full codebase review with findings
- ✅ End-to-end test suite
- ✅ Security audit report
- ✅ Performance optimization recommendations
- ✅ Deployment readiness checklist

---

## Summary: Copilot Usage by Lab

| Lab | Main Copilot Use | Prompt Type |
|-----|------------------|-------------|
| 1 | Requirement gathering | Chat analysis |
| 2 | Architecture design | Chat generation + code snippets |
| 3 | Code implementation | Inline suggestions + Chat guides |
| 4 | Frontend components | Inline + Chat for patterns |
| 5 | Database & migrations | Chat SQL generation |
| 6 | Test writing | Chat test scenarios + inline suggestions |
| 7 | Refactoring | Chat code review + inline improvements |
| 8 | Documentation | Chat content generation |
| 9 | Agent review | Comprehensive Agent analysis |

---

## Pro Tips for Maximum Copilot Effectiveness

1. **Be Specific**: "Generate a login form" is vague. "Generate a React login form with email/password inputs, validation, and error messages using Tailwind CSS" is better.

2. **Provide Context**: Include file names, frameworks, and patterns in your prompt.

3. **Dry Run First**: Ask Copilot to explain its approach before generating code.

4. **Review Suggestions**: Don't blindly accept. Verify suggestions match your requirements.

5. **Use Chat for Complex Tasks**: Chat mode is better for multi-step processes; inline is better for single methods.

6. **Reference Architecture**: Mention CONTEXT.md to keep Copilot aligned with your architecture.

7. **Iterate**: If Copilot's first suggestion doesn't match, refine your prompt and try again.

8. **Test Generated Code**: Always run tests after Copilot generates code.

---

## Next: Choose Your Backend & Begin Lab 1!

Once you select your backend technology, we'll start Lab 1 with this Copilot Chat prompt:

```
I am building a Smart Campus Utility App.

Using GitHub Copilot, analyze and document:
1. All functional requirements
2. Non-functional requirements
3. Edge cases and constraints
4. User stories with acceptance criteria
5. Potential error scenarios

Reference: https://github.com/yourrepo/docs/CONTEXT.md
```

Let's go! 🚀
