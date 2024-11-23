import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import API_BASE_URL from "../Config/Config";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ userId, password }),
      });

      const result = await response.json();

      if (result.status === "success") {
        sessionStorage.setItem("token", result.payload.token);
        sessionStorage.setItem("user", JSON.stringify(result.payload.user));
        navigate("/dashboard");  // Redirect to dashboard 
      } else {
        setError(result.message || "Login failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again."); 
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-header">
          <h1>Company Name</h1>
        </div>
        <div className="login-body">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>User ID:</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-submit">Login</button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
