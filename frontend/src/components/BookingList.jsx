export const BookingList = ({ bookings }) => {
  return (
    <div className="card">
      <h2>📅 Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>You don't have any bookings yet</p>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking.id} className="booking-item">
              <div className="booking-room">
                <h3>{booking.room_name || booking.room?.name || 'Unknown Room'}</h3>
                <p>{booking.room?.location}</p>
                <div style={{ marginTop: '8px', fontSize: '14px', fontWeight: 'bold', color: '#667eea' }}>
                  Event: {booking.event_name}
                </div>
              </div>
              <div className="booking-time">
                <div>📅 {new Date(booking.start_time).toLocaleDateString()}</div>
                <div>
                  {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="booking-right" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <span className={`status-badge status-${booking.status?.toLowerCase()}`}>
                  {booking.status}
                </span>
                <div className="booking-capacity" style={{ margin: 0 }}>
                  {booking.room?.capacity || booking.capacity} people
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
