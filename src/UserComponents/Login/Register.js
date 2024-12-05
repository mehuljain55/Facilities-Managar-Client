import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../Config/Config";
import "bootstrap/dist/css/bootstrap.min.css";
import YashLogo from "../Image/yash.jpg";

const Register = () => {
  const [formData, setFormData] = useState({
    emailId: "",
    name: "",
    mobileNo: "",
    password: "",
    officeId: "YIT",
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    mobileNo: "",
    password: "",
    emailId: "",
  });
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case "mobileNo":
        if (!/^\d{10}$/.test(value)) {
          return "Mobile number must be 10 digits.";
        }
        return "";
      case "password":
        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
            value
          )
        ) {
          return "Password must be at least 8 characters with a mix of uppercase, lowercase, and a special character.";
        }
        return "";
      case "emailId":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address.";
        }
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate the specific field
    const errorMessage = validateField(name, value);

    // Update validation errors
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    // Update form data
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Check if there are any validation errors
    const errors = Object.values(validationErrors).filter((msg) => msg !== "");
    if (errors.length > 0) {
      setError("Please correct the highlighted fields.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Registration Response:", result);

      if (result.status === "success") {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div
      style={{ backgroundColor: "#C6E7FF", height: "100vh" }}
      className="d-flex justify-content-center align-items-center"
    >
      <div
        className="rounded p-4"
        style={{
          backgroundColor: "#FBFBFB",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          width: "400px",
        }}
      >
        <div className="text-center mb-4">
          <img src={YashLogo} alt="Company Logo" style={{ height: "80px" }} />
        </div>
        <h2 className="text-center text-dark">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Email ID</label>
            <input
              type="email"
              className="form-control"
              name="emailId"
              value={formData.emailId}
              onChange={handleInputChange}
              required
            />
            {validationErrors.emailId && (
              <small className="text-danger">{validationErrors.emailId}</small>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mobile no</label>
            <input
              type="text"
              className="form-control"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleInputChange}
              required
            />
            {validationErrors.mobileNo && (
              <small className="text-danger">{validationErrors.mobileNo}</small>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            {validationErrors.password && (
              <small className="text-danger">{validationErrors.password}</small>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Office Location</label>
            <select
              className="form-select"
              name="officeId"
              value={formData.officeId}
              onChange={handleInputChange}
              required
            >
              <option value="CIT">CIT</option>
              <option value="YIT">YIT</option>
              <option value="BTC">BTC</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "#FFDDAD",
              color: "#333",
              fontWeight: "bold",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            Register
          </button>
        </form>
        {successMessage && (
          <p className="text-success text-center mt-3">{successMessage}</p>
        )}
        {error && <p className="text-danger text-center mt-3">{error}</p>}
        <div className="text-center mt-3">
          <button
            className="btn btn-link"
            onClick={() => navigate("/login")}
            style={{ color: "#007bff", textDecoration: "none" }}
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
