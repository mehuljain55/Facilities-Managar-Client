import React from "react";
import { useNavigate } from "react-router-dom";

const MainComponent = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear sessionStorage to log the user out
    sessionStorage.clear();
    // Redirect to login page
    navigate("/login");
  };

  // Retrieve user info from sessionStorage
  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <div className="dashboard-container">
      <h2>Welcome to the Dashboard</h2>
      {user ? (
        <div>
          <p>Hello, {user.firstName} {user.lastName}!</p>
          <p>Email: {user.emailId}</p>
        </div>
      ) : (
        <p>User not found.</p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default MainComponent;
