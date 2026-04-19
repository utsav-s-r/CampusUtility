import { useState } from 'react';

export const IssueList = ({ issues }) => {
  const [selectedIssue, setSelectedIssue] = useState(null);

  const getStatusColor = (status) => {
    const colors = {
      'OPEN': '#ff6b6b',
      'IN_PROGRESS': '#ffd93d',
      'RESOLVED': '#6bcf7f'
    };
    return colors[status] || '#999';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      'HIGH': '🔴',
      'MEDIUM': '🟡',
      'LOW': '🟢'
    };
    return icons[priority] || '⚪';
  };

  const handleCloseModal = () => setSelectedIssue(null);

  return (
    <div className="card">
      <h2>Your Issues</h2>
      {issues.length === 0 ? (
        <p>You haven't reported any issues yet</p>
      ) : (
        <div className="announcements-list">
          {issues.map(issue => (
            <div 
              key={issue.id} 
              className="announcement-item" 
              onClick={() => setSelectedIssue(issue)}
            >
              <div className="announcement-header">
                <h3>{getPriorityIcon(issue.priority)} {issue.title}</h3>
                <span className="date">
                  📅 Reported: {new Date(issue.created_at).toLocaleDateString()}
                </span>
              </div>
              <div 
                className="badge"
                style={{ backgroundColor: getStatusColor(issue.status), marginLeft: '12px' }}
              >
                {issue.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedIssue && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModal} aria-label="Close modal">
              ✕
            </button>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                {getPriorityIcon(selectedIssue.priority)}
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedIssue.priority} PRIORITY</span>
              </div>
              <h2>{selectedIssue.title}</h2>
              <div className="modal-meta">
                <span>📅 Reported on: {new Date(selectedIssue.created_at).toLocaleDateString()}</span>
                <span 
                  className="badge"
                  style={{ backgroundColor: getStatusColor(selectedIssue.status), minWidth: 'auto', padding: '4px 12px' }}
                >
                  {selectedIssue.status}
                </span>
              </div>
            </div>
            <div className="modal-body">
              {selectedIssue.description}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
