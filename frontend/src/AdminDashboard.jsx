import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiService } from './api';
import { IssueList } from './components/IssueList';
import { AnnouncementList } from './components/AnnouncementList';
import './Dashboard.css';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('issues');
  const [issues, setIssues] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [issuesRes, announcementsRes, bookingsRes] = await Promise.all([
        apiService.getIssues(user.id, 'ADMIN'),
        apiService.getAnnouncements(),
        apiService.getAllBookings()
      ]);
      setIssues(issuesRes.data.items || issuesRes.data.issues || issuesRes.data || []);
      setAnnouncements(announcementsRes.data.items || announcementsRes.data.announcements || announcementsRes.data || []);
      setBookings(bookingsRes.data.bookings || bookingsRes.data || []);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await apiService.createAnnouncement({
        title: announcementTitle,
        content: announcementContent
      }, user.id);
      setAnnouncements([...announcements, response.data]);
      setAnnouncementTitle('');
      setAnnouncementContent('');
      setActiveTab('announcements-list');
    } catch (err) {
      setError(err.message || 'Failed to create announcement');
    }
  };

  const handleUpdateIssueStatus = async (issueId, newStatus) => {
    try {
      const response = await apiService.updateIssue(issueId, { status: newStatus });
      setIssues(issues.map(i => i.id === issueId ? response.data : i));
    } catch (err) {
      setError(err.message || 'Failed to update issue');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await apiService.updateBookingStatus(bookingId, newStatus);
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (err) {
      setError(err.message || 'Failed to update booking status');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'OPEN': '#ff6b6b',
      'IN_PROGRESS': '#ffd93d',
      'RESOLVED': '#6bcf7f'
    };
    return <span style={{ 
      display: 'inline-block', 
      padding: '4px 8px', 
      borderRadius: '4px', 
      backgroundColor: colors[status],
      color: '#fff',
      fontSize: '12px',
      fontWeight: 'bold'
    }}>{status}</span>;
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Smart Campus - Admin Panel</h1>
          <p>Welcome, {user.name} 👨‍💼</p>
        </div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </header>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'issues' ? 'active' : ''}`}
          onClick={() => setActiveTab('issues')}
        >
          🔧 All Issues ({issues.length})
        </button>
        <button 
          className={`tab ${activeTab === 'announcement' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcement')}
        >
          📝 Create Announcement
        </button>
        <button 
          className={`tab ${activeTab === 'announcements-list' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcements-list')}
        >
          📢 All Announcements ({announcements.length})
        </button>
        <button 
          className={`tab ${activeTab === 'booking-requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('booking-requests')}
        >
          📅 Booking Requests ({bookings.filter(b => b.status === 'PENDING').length})
        </button>
      </div>

      <div className="content">
        {error && <div className="error">{error}</div>}

        {activeTab === 'issues' && (
          <div className="card">
            <h2>Issue Management</h2>
            {issues.length === 0 ? (
              <p>No issues reported yet</p>
            ) : (
              <div className="announcements-list">
                {issues.map(issue => (
                  <div 
                    key={issue.id} 
                    className="announcement-item" 
                    onClick={() => setError(null) || setIssues(issues.map(i => i.id === issue.id ? { ...i, showModal: true } : i))}
                  >
                    <div className="announcement-header">
                      <h3>{issue.title}</h3>
                      <span className="date">
                        🔧 Priority: <strong>{issue.priority}</strong> | Reported: {new Date(issue.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div 
                      className="badge"
                      style={{ backgroundColor: getStatusBadge(issue.status).props.style.backgroundColor, marginLeft: '12px' }}
                    >
                      {issue.status}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {issues.filter(i => i.showModal).map(selectedIssue => (
              <div key={selectedIssue.id} className="modal-overlay" onClick={() => setIssues(issues.map(i => i.id === selectedIssue.id ? { ...i, showModal: false } : i))}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <button className="modal-close-btn" onClick={() => setIssues(issues.map(i => i.id === selectedIssue.id ? { ...i, showModal: false } : i))}>✕</button>
                  <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedIssue.priority} PRIORITY</span>
                    </div>
                    <h2>{selectedIssue.title}</h2>
                    <div className="modal-meta">
                      <span>📅 Reported on: {new Date(selectedIssue.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="modal-body">
                    <p style={{ marginBottom: '24px' }}>{selectedIssue.description}</p>
                    
                    <div className="admin-actions-box" style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                      <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#4a5568' }}>Update Issue Status</label>
                      <select 
                        value={selectedIssue.status}
                        onChange={(e) => handleUpdateIssueStatus(selectedIssue.id, e.target.value)}
                        className="status-select"
                        style={{ padding: '12px', width: '100%', borderRadius: '8px' }}
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'announcement' && (
          <div className="card">
            <h2>Create New Announcement</h2>
            <form onSubmit={handleCreateAnnouncement}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Announcement Title"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  required
                  maxLength={255}
                />
                <div style={{ fontSize: '12px', color: '#666', textAlign: 'right', marginTop: '4px' }}>
                  {announcementTitle.length}/255 characters
                </div>
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Announcement Content"
                  value={announcementContent}
                  onChange={(e) => setAnnouncementContent(e.target.value)}
                  required
                  rows="6"
                  maxLength={2047}
                />
                <div style={{ fontSize: '12px', color: '#666', textAlign: 'right', marginTop: '4px' }}>
                  {announcementContent.length}/2047 characters
                </div>
              </div>
              <button type="submit" disabled={announcementTitle.length < 5}>
                Post Announcement
              </button>
            </form>
          </div>
        )}

        {activeTab === 'announcements-list' && <AnnouncementList announcements={announcements} />}

        {activeTab === 'booking-requests' && (
          <div className="card">
            <h2>Venue Booking Requests</h2>
            {bookings.length === 0 ? (
              <p>No booking requests found</p>
            ) : (
              <div className="bookings-list">
                {bookings.sort((a,b) => (a.status === 'PENDING' ? -1 : 1)).map(booking => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-room">
                      <h3>{booking.room_name}</h3>
                      <p>Requested by: <strong>{booking.user_name}</strong></p>
                      <p>Event: <strong>{booking.event_name}</strong></p>
                    </div>
                    <div className="booking-time">
                      <div>📅 {new Date(booking.start_time).toLocaleDateString()}</div>
                      <div>
                        {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="booking-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                      {booking.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleUpdateBookingStatus(booking.id, 'CONFIRMED')}
                            style={{ padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleUpdateBookingStatus(booking.id, 'REJECTED')}
                            style={{ padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
