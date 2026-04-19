# Data Models - Smart Campus Utility Application

## Database Schema Overview

```
┌─────────────┐
│    users    │
├─────────────┤
│ PK: id      │
│ email       │
│ password    │
│ name        │
│ role        │
│ created_at  │
│ updated_at  │
└─────────────┘
       ▲
       │ (FK)
       │
┌──────┴──────┐
│             │
│         ┌─────────────┐
│         │   issues    │
│         ├─────────────┤
│         │ PK: id      │
│         │ FK: user_id │
│         │ title       │
│         │ description │
│         │ status      │
│         │ priority    │
│         │ created_at  │
│         │ resolved_at │
│         │ admin_notes │
│         │ updated_at  │
│         └─────────────┘
│
│     ┌────────────────────┐
│     │ announcements      │
│     ├────────────────────┤
│     │ PK: id             │
│     │ FK: admin_id       │
│     │ title              │
│     │ content            │
│     │ created_at         │
│     │ updated_at         │
│     │ expiry_date        │
│     └────────────────────┘
│
└────────────┐
             │
        ┌────┴──────────┐
        │               │
    ┌─────────────┐  ┌──────────────┐
    │  bookings   │  │    rooms     │
    ├─────────────┤  ├──────────────┤
    │ PK: id      │  │ PK: id       │
    │ FK: user_id │  │ name         │
    │ FK: room_id │  │ capacity     │
    │ start_time  │  │ location     │
    │ end_time    │  │ created_at   │
    │ status      │  │ updated_at   │
    │ created_at  │  └──────────────┘
    │ updated_at  │
    └─────────────┘
```

---

## Detailed Entity Definitions

### 1. USERS Table

**Purpose**: Store user account information and authentication details

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PRIMARY KEY | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email (login credential) |
| password | VARCHAR(255) | NOT NULL | Bcrypt-hashed password |
| name | VARCHAR(100) | NOT NULL | User's full name |
| role | ENUM | NOT NULL, DEFAULT='STUDENT' | User role: STUDENT or ADMIN |
| is_active | BOOLEAN | DEFAULT=true | Soft delete flag |
| created_at | TIMESTAMP | NOT NULL, DEFAULT=NOW() | Account creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT=NOW() | Last update timestamp |

**Indexes**:
```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Example Data**:
```
id: 550e8400-e29b-41d4-a716-446655440000
email: john.doe@university.edu
password: $2b$10$N9qo8uLOickgx2ZMRZoMy... (bcrypt hash)
name: John Doe
role: STUDENT
is_active: true
created_at: 2026-04-16 10:30:00
updated_at: 2026-04-16 10:30:00
```

**Relationships**:
- One-to-Many: issues (user_id)
- One-to-Many: announcements (admin_id)
- One-to-Many: bookings (user_id)

---

### 2. ISSUES Table

**Purpose**: Store campus issue reports with lifecycle tracking

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PRIMARY KEY | Unique issue identifier |
| user_id | UUID | NOT NULL, FK→users | Student who reported issue |
| title | VARCHAR(255) | NOT NULL | Issue title/subject |
| description | TEXT | NOT NULL | Detailed issue description |
| status | ENUM | NOT NULL, DEFAULT='OPEN' | OPEN, IN_PROGRESS, RESOLVED |
| priority | ENUM | NOT NULL, DEFAULT='MEDIUM' | LOW, MEDIUM, HIGH |
| created_at | TIMESTAMP | NOT NULL, DEFAULT=NOW() | Issue creation time |
| resolved_at | TIMESTAMP | NULL | Resolution timestamp |
| admin_notes | TEXT | NULL | Admin's notes on issue |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT=NOW() | Last update timestamp |

**Indexes**:
```sql
CREATE INDEX idx_issues_user_id ON issues(user_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_priority ON issues(priority);
CREATE INDEX idx_issues_created_at ON issues(created_at);
CREATE INDEX idx_issues_status_priority ON issues(status, priority);
```

**Valid Status Transitions**:
```
OPEN → IN_PROGRESS → RESOLVED
OPEN → RESOLVED (direct)
IN_PROGRESS → OPEN (reopen, optional)
```

**Example Data**:
```
id: 660e8400-e29b-41d4-a716-446655440001
user_id: 550e8400-e29b-41d4-a716-446655440000
title: Broken Door Lock in Building A
description: The door lock in Building A Room 101 is malfunctioning. It won't lock properly.
status: OPEN
priority: HIGH
created_at: 2026-04-16 10:30:00
resolved_at: null
admin_notes: null
updated_at: 2026-04-16 10:30:00
```

**Relationships**:
- Many-to-One: users (user_id) - who reported
- References: users via admin_id (implicit in admin_notes)

---

### 3. ANNOUNCEMENTS Table

**Purpose**: Distribute campus-wide announcements from administrators

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PRIMARY KEY | Unique announcement identifier |
| admin_id | UUID | NOT NULL, FK→users | Admin who created announcement |
| title | VARCHAR(255) | NOT NULL | Announcement title |
| content | TEXT | NOT NULL | Announcement body/message |
| created_at | TIMESTAMP | NOT NULL, DEFAULT=NOW() | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT=NOW() | Last modification timestamp |
| expiry_date | TIMESTAMP | NULL | Date/time when announcement expires |
| is_archived | BOOLEAN | DEFAULT=false | Soft delete flag |

**Indexes**:
```sql
CREATE INDEX idx_announcements_admin_id ON announcements(admin_id);
CREATE INDEX idx_announcements_created_at ON announcements(created_at);
CREATE INDEX idx_announcements_expiry_date ON announcements(expiry_date);
CREATE INDEX idx_announcements_is_archived ON announcements(is_archived);
```

**Example Data**:
```
id: 770e8400-e29b-41d4-a716-446655440002
admin_id: 550e8400-e29b-41d4-a716-446655440100
title: Library Maintenance Scheduled
content: The main library will be closed on April 20, 2026 for annual maintenance. All materials must be returned by April 19.
created_at: 2026-04-16 08:00:00
updated_at: 2026-04-16 08:00:00
expiry_date: 2026-04-20 23:59:59
is_archived: false
```

**Relationships**:
- Many-to-One: users (admin_id) - who created

---

### 4. BOOKINGS Table

**Purpose**: Manage room/resource reservations (Bonus Feature)

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PRIMARY KEY | Unique booking identifier |
| user_id | UUID | NOT NULL, FK→users | Student who booked room |
| room_id | UUID | NOT NULL, FK→rooms | Room being booked |
| start_time | TIMESTAMP | NOT NULL | Booking start time |
| end_time | TIMESTAMP | NOT NULL | Booking end time |
| status | ENUM | NOT NULL, DEFAULT='CONFIRMED' | CONFIRMED, CANCELLED |
| created_at | TIMESTAMP | NOT NULL, DEFAULT=NOW() | Booking creation time |
| cancelled_at | TIMESTAMP | NULL | Cancellation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT=NOW() | Last update timestamp |

**Indexes**:
```sql
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_room_id ON bookings(room_id);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_end_time ON bookings(end_time);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_room_start_time ON bookings(room_id, start_time, end_time);
```

**Constraints**:
```sql
-- End time must be after start time
ALTER TABLE bookings ADD CONSTRAINT check_time_order CHECK (end_time > start_time);

-- Prevent double-booking for same room
-- (Handled in application logic via query)
```

**Example Data**:
```
id: 880e8400-e29b-41d4-a716-446655440003
user_id: 550e8400-e29b-41d4-a716-446655440000
room_id: 990e8400-e29b-41d4-a716-446655440004
start_time: 2026-04-17 14:00:00
end_time: 2026-04-17 15:30:00
status: CONFIRMED
created_at: 2026-04-16 10:45:00
cancelled_at: null
updated_at: 2026-04-16 10:45:00
```

**Relationships**:
- Many-to-One: users (user_id)
- Many-to-One: rooms (room_id)

---

### 5. ROOMS Table

**Purpose**: Define available rooms/resources for booking

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PRIMARY KEY | Unique room identifier |
| name | VARCHAR(100) | NOT NULL | Room name (e.g., "Study Room A") |
| capacity | INTEGER | NOT NULL | Maximum occupancy |
| location | VARCHAR(255) | NOT NULL | Building/floor location |
| is_available | BOOLEAN | NOT NULL, DEFAULT=true | Availability status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT=NOW() | Room added timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT=NOW() | Last update timestamp |

**Indexes**:
```sql
CREATE INDEX idx_rooms_name ON rooms(name);
CREATE INDEX idx_rooms_location ON rooms(location);
CREATE INDEX idx_rooms_is_available ON rooms(is_available);
```

**Example Data**:
```
id: 990e8400-e29b-41d4-a716-446655440004
name: Study Room A
capacity: 4
location: Building B, Floor 2
is_available: true
created_at: 2026-04-01 00:00:00
updated_at: 2026-04-01 00:00:00
```

**Relationships**:
- One-to-Many: bookings (room_id)

---

## Data Type Decisions

### UUID vs Auto-Increment ID
- **Decision**: UUID (string)
- **Rationale**: 
  - Distributed system friendly
  - Security (no sequential IDs)
  - Database-agnostic

### ENUM vs String
- **Decision**: ENUM for fixed options (role, status, priority)
- **Rationale**:
  - Database-level constraint
  - Storage efficient
  - Prevents invalid values

### Text vs VARCHAR
- **Decision**: TEXT for potentially long fields
- **Rationale**:
  - Issue descriptions, announcement content can be long
  - No performance penalty in PostgreSQL

---

## Constraints & Validations

### Business Rules (Database Level)

**USERS**:
- Email must be unique
- Password must be hashed (never stored plaintext)
- Role must be STUDENT or ADMIN

**ISSUES**:
- Status must follow valid transitions
- Only admins can change status
- User can only create issues (not seen as reported by admin)

**ANNOUNCEMENTS**:
- Only admins can create
- Expiry date is optional (if set, announcements auto-expire)

**BOOKINGS**:
- End time must be after start time
- No overlapping bookings for same room
- Room must exist and be available

---

## Query Patterns

### 1. Get All Open Issues Sorted by Priority
```sql
SELECT * FROM issues
WHERE status = 'OPEN'
ORDER BY 
  CASE WHEN priority = 'HIGH' THEN 1
       WHEN priority = 'MEDIUM' THEN 2
       ELSE 3 END,
  created_at DESC;
```

### 2. Check Room Availability for Time Slot
```sql
SELECT * FROM bookings
WHERE room_id = $1
  AND status = 'CONFIRMED'
  AND start_time < $2  -- requested end_time
  AND end_time > $1;   -- requested start_time
```

### 3. Get Active Announcements
```sql
SELECT * FROM announcements
WHERE is_archived = false
  AND (expiry_date IS NULL OR expiry_date > NOW())
ORDER BY created_at DESC;
```

### 4. Get User's Issues with Details
```sql
SELECT i.*, u.name as reporter_name
FROM issues i
JOIN users u ON i.user_id = u.id
WHERE i.user_id = $1
ORDER BY i.created_at DESC;
```

---

## Relationships Diagram (Crow's Foot)

```
USERS ||──────o{ ISSUES
      ||──────o{ ANNOUNCEMENTS (as admin_id)
      ||──────o{ BOOKINGS

ROOMS ||──────o{ BOOKINGS
```

---

## Migration Strategy

Migrations are version-controlled SQL files in `database/migrations/`:

```
001_create_users_table.sql
002_create_issues_table.sql
003_create_announcements_table.sql
004_create_rooms_table.sql (bonus)
005_create_bookings_table.sql (bonus)
006_create_indexes.sql
```

Each migration includes:
- UP: Schema creation/modification
- DOWN: Rollback instructions

---

## Data Integrity Considerations

### Cascading Deletes
- ON DELETE CASCADE for user → issues, announcements, bookings
  - Deleting a user removes all their issues, announcements, bookings
  
### Soft Deletes
- `is_active` on users (optional)
- `is_archived` on announcements (optional)
- Status-based soft delete on bookings (CANCELLED status)

### Audit Trail (Future Enhancement)
- Add `created_by`, `modified_by` columns
- Add `change_log` table for issue status changes

---

## Performance Considerations

### Indexing Strategy
- All foreign keys are indexed
- Status and priority fields are indexed (common filters)
- Composite index on room_id + time fields for booking conflicts
- Expiry date indexed for announcement filtering

### Query Optimization
- Use EXPLAIN ANALYZE for complex queries
- Pagination on large result sets (issues, bookings)
- Connection pooling in backend (min: 5, max: 20)

### Data Archival
- Archive resolved issues older than 1 year
- Soft-delete expired announcements
- Partition bookings table by year (for large datasets)

