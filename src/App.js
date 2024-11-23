import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './UserComponents/Login/Login';
import MainComponent from './UserComponents/Dashboard/MainComponent';
import API_BASE_URL from './UserComponents/Config/Config';

const App = () => {
  useEffect(() => {
    const validateToken = async () => {
      const token = sessionStorage.getItem('token');
      const user = JSON.parse(sessionStorage.getItem('user'));

      if (token && user) {
        try {
          const response = await fetch(`${API_BASE_URL}/validate_token?userId=${user.emailId}&token=${token}`);
          const result = await response.json();

          if (result.status === 'unauthorized') {
            sessionStorage.clear();
            window.location.href = '/login'; // Redirect to login if unauthorized
          }
        } catch (error) {
          console.error('Error validating token:', error);
          sessionStorage.clear();
          window.location.href = '/login'; // Redirect to login on error
        }
      }
    };

    // Only poll if the token exists
    const token = sessionStorage.getItem('token');
    if (token) {
      const interval = setInterval(validateToken, 2000); // Poll every 2 seconds
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, []);

  const isAuthenticated = sessionStorage.getItem('token') && sessionStorage.getItem('user');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <MainComponent /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
