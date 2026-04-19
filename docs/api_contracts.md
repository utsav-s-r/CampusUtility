# API Contracts - Smart Campus Utility Application

## Base Configuration
- **Base URL**: `http://localhost:5000/api` (development)
- **Authentication**: JWT Bearer Token in `Authorization` header
- **Content-Type**: `application/json`

---

## Authentication Service

### Register User
```
POST /auth/register
Content-Type: application/json

Request Body:
{
  "email": "student@university.edu",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "role": "STUDENT"  // STUDENT or ADMIN
}

Response (201 Created):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid-1234",
    "email": "student@university.edu",
    "name": "John Doe",
    "role": "STUDENT",
    "created_at": "2026-04-16T10:30:00Z"
  }
}

Response (400 Bad Request):
{
  "success": false,
  "error": "Email already exists"
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "student@university.edu",
  "password": "SecurePassword123!"
}

Response (200 OK):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-1234",
      "email": "student@university.edu",
      "name": "John Doe",
      "role": "STUDENT"
    },
    "expires_in": 900  // seconds (15 minutes)
  }
}

Response (401 Unauthorized):
{
  "success": false,
  "error": "Invalid email or password"
}
```

### Refresh Token
```
POST /auth/refresh
Content-Type: application/json

Request Body:
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (200 OK):
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 900
  }
}

Response (401 Unauthorized):
{
  "success": false,
  "error": "Invalid or expired refresh token"
}
```

### Get Current User Profile
```
GET /auth/profile
Authorization: Bearer <access_token>

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "uuid-1234",
    "email": "student@university.edu",
    "name": "John Doe",
    "role": "STUDENT",
    "created_at": "2026-04-16T10:30:00Z"
  }
}

Response (401 Unauthorized):
{
  "success": false,
  "error": "Unauthorized - invalid token"
}
```

---

## Issue Reporting Service

### Create Issue
```
POST /issues
Authorization: Bearer <access_token>
Content-Type: application/json

Request Body:
{
  "title": "Broken Door Lock",
  "description": "The door lock in Building A Room 101 is broken",
  "priority": "HIGH"  // LOW, MEDIUM, HIGH
}

Response (201 Created):
{
  "success": true,
  "message": "Issue created successfully",
  "data": {
    "id": "issue-uuid-001",
    "user_id": "uuid-1234",
    "title": "Broken Door Lock",
    "description": "The door lock in Building A Room 101 is broken",
    "status": "OPEN",  // OPEN, IN_PROGRESS, RESOLVED
    "priority": "HIGH",
    "created_at": "2026-04-16T10:30:00Z",
    "resolved_at": null,
    "admin_notes": null
  }
}

Response (400 Bad Request):
{
  "success": false,
  "error": "Title is required"
}

Response (401 Unauthorized):
{
  "success": false,
  "error": "Unauthorized"
}
```

### Get All Issues (with Filters)
```
GET /issues?status=OPEN&priority=HIGH&page=1&limit=10
Authorization: Bearer <access_token>

Query Parameters:
- status: OPEN, IN_PROGRESS, RESOLVED (optional)
- priority: LOW, MEDIUM, HIGH (optional)
- page: pagination (default: 1)
- limit: items per page (default: 10)

Response (200 OK):
{
  "success": true,
  "data": {
    "issues": [
      {
        "id": "issue-uuid-001",
        "user_id": "uuid-1234",
        "title": "Broken Door Lock",
        "description": "The door lock in Building A Room 101 is broken",
        "status": "OPEN",
        "priority": "HIGH",
        "created_at": "2026-04-16T10:30:00Z",
        "resolved_at": null,
        "admin_notes": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}

Authorization Notes:
- STUDENT: Can only see their own issues
- ADMIN: Can see all issues
```

### Get Issue Details
```
GET /issues/:id
Authorization: Bearer <access_token>

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "issue-uuid-001",
    "user_id": "uuid-1234",
    "title": "Broken Door Lock",
    "description": "The door lock in Building A Room 101 is broken",
    "status": "OPEN",
    "priority": "HIGH",
    "created_at": "2026-04-16T10:30:00Z",
    "resolved_at": null,
    "admin_notes": null
  }
}

Response (403 Forbidden):
{
  "success": false,
  "error": "Cannot view other user's issues"
}

Response (404 Not Found):
{
  "success": false,
  "error": "Issue not found"
}
```

### Update Issue Status (Admin Only)
```
PATCH /issues/:id
Authorization: Bearer <access_token>
Content-Type: application/json

Request Body:
{
  "status": "IN_PROGRESS",  // OPEN, IN_PROGRESS, RESOLVED
  "admin_notes": "Maintenance team assigned"
}

Response (200 OK):
{
  "success": true,
  "message": "Issue updated successfully",
  "data": {
    "id": "issue-uuid-001",
    "user_id": "uuid-1234",
    "title": "Broken Door Lock",
    "description": "The door lock in Building A Room 101 is broken",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "created_at": "2026-04-16T10:30:00Z",
    "resolved_at": null,
    "admin_notes": "Maintenance team assigned"
  }
}

Response (403 Forbidden):
{
  "success": false,
  "error": "Only admins can update issue status"
}

Response (400 Bad Request):
{
  "success": false,
  "error": "Invalid status transition from RESOLVED to OPEN"
}
```

### Delete Issue (Admin Only)
```
DELETE /issues/:id
Authorization: Bearer <access_token>

Response (200 OK):
{
  "success": true,
  "message": "Issue deleted successfully"
}

Response (403 Forbidden):
{
  "success": false,
  "error": "Only admins can delete issues"
}

Response (404 Not Found):
{
  "success": false,
  "error": "Issue not found"
}
```

---

## Announcement Service

### Create Announcement (Admin Only)
```
POST /announcements
Authorization: Bearer <access_token>
Content-Type: application/json

Request Body:
{
  "title": "Library Maintenance",
  "content": "The library will be closed on April 20 for maintenance.",
  "expiry_date": "2026-04-20T23:59:59Z"  // optional
}

Response (201 Created):
{
  "success": true,
  "message": "Announcement created successfully",
  "data": {
    "id": "announcement-uuid-001",
    "admin_id": "uuid-admin-1",
    "title": "Library Maintenance",
    "content": "The library will be closed on April 20 for maintenance.",
    "created_at": "2026-04-16T10:30:00Z",
    "updated_at": "2026-04-16T10:30:00Z",
    "expiry_date": "2026-04-20T23:59:59Z"
  }
}

Response (403 Forbidden):
{
  "success": false,
  "error": "Only admins can create announcements"
}

Response (400 Bad Request):
{
  "success": false,
  "error": "Title and content are required"
}
```

### Get All Announcements
```
GET /announcements?page=1&limit=10
Authorization: Bearer <access_token>

Query Parameters:
- page: pagination (default: 1)
- limit: items per page (default: 10)

Response (200 OK):
{
  "success": true,
  "data": {
    "announcements": [
      {
        "id": "announcement-uuid-001",
        "admin_id": "uuid-admin-1",
        "title": "Library Maintenance",
        "content": "The library will be closed on April 20 for maintenance.",
        "created_at": "2026-04-16T10:30:00Z",
        "updated_at": "2026-04-16T10:30:00Z",
        "expiry_date": "2026-04-20T23:59:59Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}

Authorization Notes:
- All authenticated users can view announcements
- Expired announcements are not included
```

### Update Announcement (Admin Only)
```
PATCH /announcements/:id
Authorization: Bearer <access_token>
Content-Type: application/json

Request Body:
{
  "title": "Library Maintenance - Updated",
  "content": "The library will be closed on April 20-21 for maintenance.",
  "expiry_date": "2026-04-21T23:59:59Z"
}

Response (200 OK):
{
  "success": true,
  "message": "Announcement updated successfully",
  "data": {
    "id": "announcement-uuid-001",
    "admin_id": "uuid-admin-1",
    "title": "Library Maintenance - Updated",
    "content": "The library will be closed on April 20-21 for maintenance.",
    "created_at": "2026-04-16T10:30:00Z",
    "updated_at": "2026-04-16T11:00:00Z",
    "expiry_date": "2026-04-21T23:59:59Z"
  }
}

Response (403 Forbidden):
{
  "success": false,
  "error": "Only admins can update announcements"
}

Response (404 Not Found):
{
  "success": false,
  "error": "Announcement not found"
}
```

### Delete Announcement (Admin Only)
```
DELETE /announcements/:id
Authorization: Bearer <access_token>

Response (200 OK):
{
  "success": true,
  "message": "Announcement deleted successfully"
}

Response (403 Forbidden):
{
  "success": false,
  "error": "Only admins can delete announcements"
}

Response (404 Not Found):
{
  "success": false,
  "error": "Announcement not found"
}
```

---

## Booking Service (Bonus)

### Create Booking
```
POST /bookings
Authorization: Bearer <access_token>
Content-Type: application/json

Request Body:
{
  "room_id": "room-001",
  "start_time": "2026-04-17T14:00:00Z",
  "end_time": "2026-04-17T15:30:00Z"
}

Response (201 Created):
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "booking-uuid-001",
    "user_id": "uuid-1234",
    "room_id": "room-001",
    "start_time": "2026-04-17T14:00:00Z",
    "end_time": "2026-04-17T15:30:00Z",
    "status": "CONFIRMED",
    "created_at": "2026-04-16T10:30:00Z"
  }
}

Response (400 Bad Request):
{
  "success": false,
  "error": "Room is already booked for this time slot"
}

Response (400 Bad Request):
{
  "success": false,
  "error": "End time must be after start time"
}
```

### Get User's Bookings
```
GET /bookings?page=1&limit=10
Authorization: Bearer <access_token>

Response (200 OK):
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "booking-uuid-001",
        "user_id": "uuid-1234",
        "room_id": "room-001",
        "start_time": "2026-04-17T14:00:00Z",
        "end_time": "2026-04-17T15:30:00Z",
        "status": "CONFIRMED",
        "created_at": "2026-04-16T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "pages": 1
    }
  }
}

Authorization Notes:
- STUDENT: Can only see their own bookings
- ADMIN: Can see all bookings
```

### Get Available Rooms
```
GET /rooms?date=2026-04-17&time=14:00
Authorization: Bearer <access_token>

Query Parameters:
- date: ISO 8601 date (required)
- time: HH:MM 24-hour format (required)

Response (200 OK):
{
  "success": true,
  "data": {
    "rooms": [
      {
        "id": "room-001",
        "name": "Study Room A",
        "capacity": 4,
        "location": "Building B, Floor 2",
        "available": true
      },
      {
        "id": "room-002",
        "name": "Lab Room B",
        "capacity": 20,
        "location": "Building C, Floor 1",
        "available": false
      }
    ]
  }
}
```

### Cancel Booking
```
DELETE /bookings/:id
Authorization: Bearer <access_token>

Response (200 OK):
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "id": "booking-uuid-001",
    "user_id": "uuid-1234",
    "room_id": "room-001",
    "start_time": "2026-04-17T14:00:00Z",
    "end_time": "2026-04-17T15:30:00Z",
    "status": "CANCELLED",
    "created_at": "2026-04-16T10:30:00Z"
  }
}

Response (403 Forbidden):
{
  "success": false,
  "error": "Cannot cancel other user's booking"
}

Response (404 Not Found):
{
  "success": false,
  "error": "Booking not found"
}
```

---

## HTTP Status Codes Reference

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input, validation errors |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Authorized user but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Double-booking, business logic violation |
| 500 | Internal Server Error | Server-side error |

---

## Error Response Format

All errors follow this consistent format:

```json
{
  "success": false,
  "error": "Error message",
  "details": {
    "field": "error details (optional)"
  }
}
```

---

## Authentication Flow Diagram

```
1. User enters credentials
   ↓
2. POST /auth/login
   ↓
3. Server validates, returns access_token + refresh_token
   ↓
4. Client stores tokens (localStorage/cookie)
   ↓
5. For each request:
   - Add Authorization: Bearer <access_token>
   - Server validates token
   ↓
6. If token expired:
   - POST /auth/refresh with refresh_token
   - Server returns new access_token
   ↓
7. Resume original request
```

