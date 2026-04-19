# Smart Campus Frontend

A modern React.js application for the Smart Campus Utility System running on **localhost:8000**.

## Features

### 🎓 Student Features
- **Report Issues**: Submit maintenance and facility issues
- **View Issues**: Track the status of reported issues (OPEN, IN_PROGRESS, RESOLVED)
- **View Announcements**: Read campus announcements
- **Book Rooms**: Reserve study rooms and meeting spaces

### 👨‍💼 Admin Features
- **Manage Issues**: View all reported issues and update their status
- **Create Announcements**: Post important campus announcements
- **View All Data**: Monitor student issues and bookings

## Demo Accounts

### Student Account
- Email: `student@university.edu`
- Password: `SecurePass123`

### Admin Account
- Email: `admin@university.edu`
- Password: `AdminPass123`

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

This will start the app on **http://localhost:8000** and automatically open it in your browser.

### 3. Build for Production
```bash
npm run build
npm run preview
```

## Architecture

### Components
- **Auth.jsx** - Login & Registration
- **StudentDashboard.jsx** - Student interface
- **AdminDashboard.jsx** - Admin interface
- **components/IssueList.jsx** - Display issues
- **components/AnnouncementList.jsx** - Display announcements
- **components/BookingList.jsx** - Display bookings

### State Management
- **AuthContext.jsx** - Global authentication state using React Context
- **api.js** - Mock API service with localStorage data persistence

### Styling
- **index.css** - Global styles
- **Auth.css** - Authentication page styles
- **Dashboard.css** - Dashboard and component styles

## Mock Data

The app uses **localStorage** to persist data across sessions. No backend required!

### Pre-loaded Data
- 2 users (1 student, 1 admin)
- 2 sample issues
- 2 sample announcements
- 3 meeting rooms

All data is stored in browser localStorage and persists across page refreshes.

## Features

### Authentication
- ✅ User registration with form validation
- ✅ User login with authentication
- ✅ Role-based dashboards (Student vs Admin)
- ✅ Automatic logout
- ✅ Session persistence via localStorage

### Issues Management
- ✅ Create new issues with priority levels (LOW, MEDIUM, HIGH)
- ✅ View all issues (admins) or only user's issues (students)
- ✅ Track issue status (OPEN → IN_PROGRESS → RESOLVED)
- ✅ Admin can update issue status
- ✅ Admin can delete issues

### Announcements
- ✅ View active announcements
- ✅ Auto-expiry filtering
- ✅ Admin can create announcements
- ✅ Announcement archival

### Room Bookings
- ✅ View available rooms
- ✅ Create bookings with date/time selection
- ✅ Double-booking prevention
- ✅ View user's confirmed bookings
- ✅ Cancel bookings

## Styling

### Design System
- **Color Scheme**: Purple gradient (#667eea to #764ba2)
- **Typography**: System fonts for performance
- **Responsive**: Mobile-friendly design
- **Animations**: Smooth transitions and hover effects

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Development Tools

- **Vite** - Lightning-fast build tool and dev server
- **React 18** - Modern UI library
- **React Router** - Client-side routing (ready for expansion)
- **localStorage** - Client-side data persistence

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Future Enhancements

- [ ] Connect to actual backend API
- [ ] Real-time notifications with WebSocket
- [ ] User profile customization
- [ ] Advanced search and filtering
- [ ] Export reports as PDF
- [ ] Dark mode
- [ ] Multi-language support

## Troubleshooting

**Port 8000 is already in use?**
```bash
# Use a different port
npm run dev -- --port 8001
```

**Data not persisting?**
- Check browser localStorage is enabled
- Clear localStorage and reload: `localStorage.clear()`

**Styles not loading?**
- Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Restart dev server

## File Structure

```
frontend/
├── src/
│   ├── App.jsx                 # Main app component
│   ├── AuthContext.jsx         # Auth state management
│   ├── Auth.jsx                # Login/Register page
│   ├── StudentDashboard.jsx    # Student interface
│   ├── AdminDashboard.jsx      # Admin interface
│   ├── api.js                  # Mock API service
│   ├── main.jsx                # Entry point
│   ├── index.css               # Global styles
│   ├── Auth.css                # Auth page styles
│   ├── Dashboard.css           # Dashboard styles
│   └── components/
│       ├── IssueList.jsx       # Issues display
│       ├── AnnouncementList.jsx # Announcements display
│       └── BookingList.jsx     # Bookings display
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

---

**Ready to explore the Smart Campus? Start the dev server and login with a demo account!** 🚀
