import { useState } from 'react';

export const AnnouncementList = ({ announcements }) => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const handleCloseModal = () => setSelectedAnnouncement(null);

  return (
    <div className="card">
      <h2>📢 Announcements</h2>
      {announcements.length === 0 ? (
        <p>No announcements available</p>
      ) : (
        <div className="announcements-list">
          {[...announcements].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).map(announcement => (
            <div 
              key={announcement.id} 
              className="announcement-item" 
              onClick={() => setSelectedAnnouncement(announcement)}
            >
              <h3>{announcement.title}</h3>
              <span className="date">
                📅 {new Date(announcement.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {selectedAnnouncement && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModal} aria-label="Close modal">
              ✕
            </button>
            <div className="modal-header">
              <h2>{selectedAnnouncement.title}</h2>
              <div className="modal-meta">
                <span>📅 Posted on: {new Date(selectedAnnouncement.created_at).toLocaleDateString()}</span>
                {selectedAnnouncement.expiry_date && (
                  <span>⌛ Expires: {new Date(selectedAnnouncement.expiry_date).toLocaleDateString()}</span>
                )}
              </div>
            </div>
            <div className="modal-body">
              {selectedAnnouncement.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
