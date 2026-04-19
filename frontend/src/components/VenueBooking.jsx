import { useState, useEffect } from 'react';
import { apiService } from '../api';

export const VenueBooking = ({ onBookingSuccess }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA')); // YYYY-MM-DD local format
  const [existingBookings, setExistingBookings] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [eventName, setEventName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hours = [9, 10, 11, 12, 13, 14, 15]; // 9 AM to 3 PM start times (3 PM start means 4 PM end)

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom && selectedDate) {
      fetchExistingBookings();
    }
  }, [selectedRoom, selectedDate]);

  const fetchRooms = async () => {
    try {
      const res = await apiService.getRooms();
      setRooms(res.data || []);
      if (res.data?.length > 0) setSelectedRoom(res.data[0].id);
    } catch (err) {
      setError('Failed to fetch rooms');
    }
  };

  const fetchExistingBookings = async () => {
    try {
      const res = await apiService.getRoomAvailability(selectedRoom, selectedDate);
      const bookings = res.data || [];
      setExistingBookings(bookings);
    } catch (err) {
      console.error('Failed to fetch availability:', err);
    }
  };

  const isSlotBooked = (hour) => {
    return existingBookings.some(b => {
      const bStart = new Date(b.start_time).getHours();
      const bEnd = new Date(b.end_time).getHours();
      return hour >= bStart && hour < bEnd;
    });
  };

  const getSlotStatus = (hour) => {
    const booking = existingBookings.find(b => {
      const bStart = new Date(b.start_time).getHours();
      const bEnd = new Date(b.end_time).getHours();
      return hour >= bStart && hour < bEnd;
    });
    return booking ? booking.status : null;
  };

  const handleSlotClick = (hour) => {
    if (isSlotBooked(hour)) return;

    if (selectedSlots.includes(hour)) {
      // If clicking already selected, clear selection or logic for multi-select
      setSelectedSlots([]);
    } else {
      if (selectedSlots.length === 0) {
        setSelectedSlots([hour]);
      } else {
        // Enforce continuity
        const min = Math.min(...selectedSlots, hour);
        const max = Math.max(...selectedSlots, hour);
        const newSelection = [];
        for (let i = min; i <= max; i++) {
          if (isSlotBooked(i)) {
            setError('Cannot select overlapping slots');
            return;
          }
          newSelection.push(i);
        }
        setSelectedSlots(newSelection);
        setError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSlots.length === 0 || !eventName) {
      setError('Please select slots and enter an event name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const minHour = Math.min(...selectedSlots);
      const maxHour = Math.max(...selectedSlots) + 1;

      const [year, month, day] = selectedDate.split('-').map(Number);
      const startTime = new Date(year, month - 1, day, minHour);
      const endTime = new Date(year, month - 1, day, maxHour);

      await apiService.createBooking({
        roomId: selectedRoom,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        eventName: eventName
      });

      setSelectedSlots([]);
      setEventName('');
      onBookingSuccess();
      fetchExistingBookings();
    } catch (err) {
      setError(err.message || 'Failed to book venue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="venue-header">
        <h2>🏛️ Book a Venue</h2>
        {loading && <span>Processing...</span>}
      </div>

      {error && <div className="error">{error}</div>}

      <div className="booking-form">
        <div className="form-group">
          <label>Select Room</label>
          <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.name} ({room.capacity} people) - {room.location}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Select Date</label>
          <input 
            type="date" 
            value={selectedDate} 
            min={new Date().toLocaleDateString('en-CA')}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="slots-section">
          <h3>Select Time Slots (9:00 AM - 4:00 PM)</h3>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
            Click to select. Select multiple for continuous booking.
          </p>
          <div className="slot-grid">
            {hours.map(hour => {
              const status = getSlotStatus(hour);
              const isSelected = selectedSlots.includes(hour);
              let className = "slot-item";
              if (status === 'CONFIRMED') className += " booked";
              else if (status === 'PENDING') className += " reserved";
              else if (isSelected) className += " selected";

              return (
                <div 
                  key={hour} 
                  className={className}
                  onClick={() => handleSlotClick(hour)}
                >
                  {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
                  {status && <div style={{ fontSize: '10px' }}>{status}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {selectedSlots.length > 0 && (
          <div className="booking-details" style={{ marginTop: '20px', padding: '15px', background: '#f0f4ff', borderRadius: '8px' }}>
            <h4>Booking Summary</h4>
            <p><strong>Time:</strong> {Math.min(...selectedSlots)}:00 - {Math.max(...selectedSlots) + 1}:00</p>
            <div className="form-group" style={{ marginTop: '15px' }}>
              <input 
                type="text" 
                placeholder="Enter Event Name (e.g., Annual Tech Meet)" 
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </div>
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              style={{ width: '100%', marginTop: '10px' }}
            >
              {loading ? 'Submitting...' : 'Request Booking'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
