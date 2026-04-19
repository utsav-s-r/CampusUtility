import { useState } from 'react';
import { useAuth } from './AuthContext';
import { apiService } from './api';
import './Auth.css';

export const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginRole, setLoginRole] = useState('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await apiService.login(email, password);
        if (response.data.user.role !== loginRole) {
          setError(`Invalid credentials for ${loginRole === 'ADMIN' ? 'Admin' : 'User'} login`);
          setLoading(false);
          return;
        }
        login(response.data.user);
        onLoginSuccess();
      } else {
        await apiService.register({ email, password, name, role: loginRole });
        // Instead of auto-login, prompt user to login
        setIsLogin(true);
        setError('Registration successful! Please login with your new credentials.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Smart Campus</h1>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>

        <div className="role-toggle">
          <button 
            type="button"
            className={`role-btn ${loginRole === 'STUDENT' ? 'active' : ''}`}
            onClick={() => setLoginRole('STUDENT')}
            disabled={loading}
          >
            User
          </button>
          <button 
            type="button"
            className={`role-btn ${loginRole === 'ADMIN' ? 'active' : ''}`}
            onClick={() => setLoginRole('ADMIN')}
            disabled={loading}
          >
            Admin
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            className="toggle-btn"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};
