import React, { useState } from "react";
import YashLogo from "../Image/yash.jpg"; 
import CabinRequest from "../CabinRequest/CabinRequest";
import "bootstrap/dist/css/bootstrap.min.css";

const MainComponent = () => {
  const [activeSection, setActiveSection] = useState("dashboard"); 
  const user = JSON.parse(sessionStorage.getItem("user")) || {}; 

  const handleLogout = () => {
    sessionStorage.clear(); 
    window.location.reload(); 
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div>
            {user.name ? (
              <p className="text-center">
                Welcome, {user.name} 
              </p>
            ) : (
              <p className="text-center text-danger">User information not found.</p>
            )}
          </div>
        );
      case "cabinRequest":
        return <div><CabinRequest /></div>;
      case "viewRequest":
        return <div><h3>View Request</h3><p>This is the View Request section.</p></div>;
      case "approveRequest":
        return <div><h3>Approve Request</h3><p>This is the Approve Request section (Manager only).</p></div>;
      case "addCabin":
        return <div><h3>Add Cabin</h3><p>This is the Add Cabin section (Manager only).</p></div>;
      default:
        return <div><h3>404</h3><p>Section not found.</p></div>;
    }
  };

  return (
    <div className="d-flex vh-100">
      <div
        className="sidebar d-flex flex-column bg-light"
        style={{
          width: "250px",
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          className="p-4 text-center"
          style={{
            borderBottom: "1px solid #ddd",
            background: "#BFECFF", 
          }}
        >
          <img
            src={YashLogo}
            alt="Company Logo"
            style={{
              height: "80px",
              objectFit: "contain",
              marginBottom: "10px",
            }}
          />
          <h5>Welcome</h5>
          {user.firstName && <p>{user.firstName} {user.lastName}</p>}
        </div>
        <div className="menu mt-3">
          <h6 className="px-4 text-secondary">User</h6>
          <ul className="list-unstyled px-3">
            <li>
              <button
                className={`btn btn-link text-decoration-none w-100 text-start ${activeSection === "cabinRequest" ? "fw-bold text-primary" : "text-dark"}`}
                onClick={() => setActiveSection("cabinRequest")}
              >
                Cabin Request
              </button>
            </li>
            <li>
              <button
                className={`btn btn-link text-decoration-none w-100 text-start ${activeSection === "viewRequest" ? "fw-bold text-primary" : "text-dark"}`}
                onClick={() => setActiveSection("viewRequest")}
              >
                View Request
              </button>
            </li>
          </ul>
          <h6 className="px-4 text-secondary">Manager Only</h6>
          <ul className="list-unstyled px-3">
            <li>
              <button
                className={`btn btn-link text-decoration-none w-100 text-start ${activeSection === "approveRequest" ? "fw-bold text-primary" : "text-dark"}`}
                onClick={() => setActiveSection("approveRequest")}
              >
                Approve Request
              </button>
            </li>
            <li>
              <button
                className={`btn btn-link text-decoration-none w-100 text-start ${activeSection === "addCabin" ? "fw-bold text-primary" : "text-dark"}`}
                onClick={() => setActiveSection("addCabin")}
              >
                Add Cabin
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="main-content flex-grow-1">
        <nav
          className="navbar navbar-expand-lg navbar-light"
          style={{
            background: "#1f509a", 
            color: "white",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="container-fluid px-4">
            <a
              href="#"
              className="navbar-brand text-white fw-bold"
              style={{ fontSize: "18px" }}
            >
              Dashboard
            </a>
            <button
              className="btn btn-outline-light"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </nav>

        <div className="container mt-4">{renderSection()}</div>
      </div>
    </div>
  );
};

export default MainComponent;