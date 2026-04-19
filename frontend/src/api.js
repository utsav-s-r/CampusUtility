const API_BASE_URL = 'http://localhost:5001/api';

// Helper for making API requests with automatically injected authorization headers
const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw { statusCode: response.status, message: data.error || data.message || 'API Request Failed' };
  }

  return data;
};

export const apiService = {
  // Auth
  register: async (userData) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (email, password) => {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    // The response is usually expected to have an accessToken
    if (data && data.data && data.data.accessToken) {
        localStorage.setItem('access_token', data.data.accessToken);
    }
    return data;
  },

  getProfile: async (userId) => {
    // We shouldn't need userId for this endpoint if the backend infers from JWT, 
    // but we'll include it or call the typical /auth/profile route.
    return fetchAPI('/auth/profile', {
      method: 'GET',
    });
  },

  // Issues
  createIssue: async (issueData, userId) => {
    return fetchAPI('/issues', {
      method: 'POST',
      body: JSON.stringify({ ...issueData, user_id: userId }),
    });
  },

  getIssues: async (userId, userRole) => {
    // The backend should handle filtering based on the token
    return fetchAPI('/issues', {
      method: 'GET',
    });
  },

  getIssueById: async (issueId, userId, userRole) => {
    return fetchAPI(`/issues/${issueId}`, {
      method: 'GET',
    });
  },

  updateIssue: async (issueId, updateData) => {
    return fetchAPI(`/issues/${issueId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  },

  deleteIssue: async (issueId) => {
    return fetchAPI(`/issues/${issueId}`, {
      method: 'DELETE',
    });
  },

  // Announcements
  getAnnouncements: async () => {
    return fetchAPI('/announcements', {
      method: 'GET',
    });
  },

  createAnnouncement: async (announcementData, adminId) => {
    return fetchAPI('/announcements', {
      method: 'POST',
      body: JSON.stringify({ ...announcementData, admin_id: adminId }),
    });
  },

  // Rooms & Bookings
  getRooms: async () => {
    return fetchAPI('/bookings/rooms', {
      method: 'GET',
    });
  },

  createBooking: async (bookingData, userId) => {
    return fetchAPI('/bookings', {
      method: 'POST',
      body: JSON.stringify({ ...bookingData, user_id: userId }),
    });
  },

  getUserBookings: async (userId) => {
    // Backend should filter based on token or query param
    return fetchAPI(`/bookings`, {
      method: 'GET',
    });
  },

  getAllBookings: async () => {
    return fetchAPI(`/bookings/all`, {
      method: 'GET',
    });
  },

  getRoomAvailability: async (roomId, date) => {
    return fetchAPI(`/bookings/room/${roomId}/date/${date}`, {
      method: 'GET',
    });
  },

  updateBookingStatus: async (bookingId, status) => {
    return fetchAPI(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
};
