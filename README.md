# Smart Campus Utility Application

A comprehensive full-stack application demonstrating effective use of GitHub Copilot throughout development.

## Vision
A single platform where students and administrators interact with campus services:
- **Issue Reporting System** - Students report campus issues, admins manage lifecycle
- **Campus Announcements** - Real-time notifications from administrators
- **Room Booking System** - Reserve study rooms/labs with conflict prevention
- **Role-Based Access Control** - JWT authentication with student/admin roles

## Technology Stack
- **Frontend**: React.js with Axios and JWT authentication
- **Backend**: [To be selected - Java/Spring Boot, Node.js/Express, .NET/ASP.NET Core, or Python/FastAPI]
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Tools**: GitHub, GitHub Copilot

## Project Structure
```
CoPilotDemo/
├── docs/                    # Documentation and architecture
│   ├── architecture_plan.md
│   ├── api_contracts.md
│   └── data_models.md
├── backend/                 # Backend services
│   ├── src/
│   ├── tests/
│   └── README.md
├── frontend/                # React application
│   ├── src/
│   ├── public/
│   └── README.md
├── database/                # SQL migrations and schemas
│   └── migrations/
├── CONTEXT.md               # Project state & decisions
└── README.md               # This file
```

## 9 Progressive Labs
1. **Lab 1**: Requirement Analysis - Use Copilot to identify requirements & edge cases
2. **Lab 2**: Architecture Design - Full-stack architecture & API endpoints
3. **Lab 3**: Backend Development - REST APIs for auth, issues, announcements
4. **Lab 4**: Frontend Development - React login & dashboards
5. **Lab 5**: Database Design - SQL schema & persistence integration
6. **Lab 6**: Unit Testing - Backend & frontend tests
7. **Lab 7**: Refactoring - Code quality & maintainability improvements
8. **Lab 8**: Documentation - README & API documentation
9. **Lab 9**: Agent Mode - End-to-end improvements using Copilot Agent

## Modular Development Keywords
- **Decouple**: When features are being mixed inappropriately
- **Interface-first**: Define contracts before implementation
- **Dry run**: Explain logic before writing code
- **Single Responsibility**: Each file does exactly one thing

## Getting Started
See [CONTEXT.md](./CONTEXT.md) for detailed architecture decisions and current project state.
