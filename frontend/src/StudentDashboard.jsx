import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiService } from './api';
import { IssueList } from './components/IssueList';
import { AnnouncementList } from './components/AnnouncementList';
import { BookingList } from './components/BookingList';
import { VenueBooking } from './components/VenueBooking';
import './Dashboard.css';

export const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('issues');
  const [issues, setIssues] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [issuesRes, announcementsRes, bookingsRes] = await Promise.all([
        apiService.getIssues(user.id, user.role),
        apiService.getAnnouncements(),
        apiService.getUserBookings(user.id)
      ]);
      setIssues(issuesRes.data.items || issuesRes.data.issues || issuesRes.data || []);
      setAnnouncements(announcementsRes.data.items || announcementsRes.data.announcements || announcementsRes.data || []);
      setBookings(bookingsRes.data.items || bookingsRes.data.bookings || bookingsRes.data || []);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await apiService.createIssue({
        title,
        description,
        priority
      }, user.id);
      setIssues([...issues, response.data]);
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setActiveTab('issues-list');
    } catch (err) {
      setError(err.message || 'Failed to create issue');
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Smart Campus</h1>
          <p>Welcome, {user.name} 👋</p>
        </div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </header>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'issues' ? 'active' : ''}`}
          onClick={() => setActiveTab('issues')}
        >
          📝 Report Issue
        </button>
        <button 
          className={`tab ${activeTab === 'issues-list' ? 'active' : ''}`}
          onClick={() => setActiveTab('issues-list')}
        >
          🔍 My Issues ({issues.length})
        </button>
        <button 
          className={`tab ${activeTab === 'book-venue' ? 'active' : ''}`}
          onClick={() => setActiveTab('book-venue')}
        >
          🏛️ Book Venue
        </button>
        <button 
          className={`tab ${activeTab === 'announcements' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          📢 Announcements ({announcements.length})
        </button>
        <button 
          className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          📅 My Bookings ({bookings.length})
        </button>
      </div>

      <div className="content">
        {error && <div className="error">{error}</div>}

        {activeTab === 'issues' && (
          <div className="card">
            <h2>Report a New Issue</h2>
            <form onSubmit={handleCreateIssue}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Issue Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="5"
                />
              </div>
              <div className="form-group">
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
              </div>
              <button type="submit">Submit Issue</button>
            </form>
          </div>
        )}

        {activeTab === 'issues-list' && <IssueList issues={issues} />}
        {activeTab === 'announcements' && <AnnouncementList announcements={announcements} />}
        {activeTab === 'bookings' && <BookingList bookings={bookings} />}
        {activeTab === 'book-venue' && <VenueBooking onBookingSuccess={() => { loadData(); setActiveTab('bookings'); }} />}
      </div>
    </div>
  );
};
