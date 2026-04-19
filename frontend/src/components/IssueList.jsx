export const IssueList = ({ issues }) => {
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

  return (
    <div className="card">
      <h2>Your Issues</h2>
      {issues.length === 0 ? (
        <p>You haven't reported any issues yet</p>
      ) : (
        <div className="issues-list">
          {issues.map(issue => (
            <div key={issue.id} className="issue-item">
              <div className="issue-left">
                <div className="issue-title">
                  {getPriorityIcon(issue.priority)} {issue.title}
                </div>
                <div className="issue-description">{issue.description}</div>
                <div className="issue-meta">
                  Created: {new Date(issue.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="issue-right">
                <div 
                  className="badge"
                  style={{ backgroundColor: getStatusColor(issue.status) }}
                >
                  {issue.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
