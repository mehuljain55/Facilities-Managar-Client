import React, { useState } from "react";
import YashLogo from "../Image/yash.jpg";
import {  Button, Dropdown } from 'react-bootstrap';
import CabinRequest from "../CabinRequest/CabinRequest";
import CabinApproveRequest from "../CabinRequest/CabinApproveRequest";
import ViewCabinRequest from "../CabinRequest/ViewCabinRequest";
import UserApprovalList from "../Manager/UserApprovalList";
import Cabin from "../Manager/Cabin";
import AddCabin from "../Manager/AddCabin";
import ViewBooking from "../Bookings/ViewBooking";
import ViewAllCabinRequest from "../CabinRequest/ViewAllCabinRequest";
import ApproveVipRequest from "../Manager/ApproveVipRequest";
import Dashboard from "../Manager/Dashboard";
import UserDashboard from "../User/UserDashboard";
import SuperAdminDashboard from "../SuperAdmin/SuperAdminDashboard";


import "bootstrap/dist/css/bootstrap.min.css";

const MainComponent = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
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
          {user.role === "manager" ? (
            <Dashboard activeSection={setActiveSection} />
          ) : user.role === "super_admin" ? (
            <SuperAdminDashboard activeSection={setActiveSection} />
          ) : (
            <UserDashboard />
          )}
        </div>
        
        );
      case "cabinRequest":
        return (
          <div>
            <CabinRequest />
          </div>
        );
      case "viewRequest":
        return (
          <div>
            <ViewCabinRequest />
          </div>
        );
      case "approveRequest":
        return (
          <div>
            <CabinApproveRequest filterStatus='all' />
          </div>
        );

        case "approveRequestVip":
          return (
            <div>
              <ApproveVipRequest />
            </div>
          );  
        case "todaysBooking":
          return (
            <div>
              <ViewBooking selectedFilterType="Today"/>
            </div>
          );
      case "addCabin":
        return (
          <div>
            <Cabin />
          </div>
        );
      case "approveUserRequest":
        return (
          <div>
            <UserApprovalList />
          </div>
        );
     case "viewBooking":
          return (
            <div>
              <ViewBooking selectedFilterType="All"/>
            </div>
          );
     
    
          case "viewAllCabinRequest":
            return (
             <div>
              <ViewAllCabinRequest />
                </div>
              );
      
         case "viewAllCabinRequestApproved":
          return (
           <div>
            <ViewAllCabinRequest preselectedStatus="approved" />
              </div>
            );
            
       case "viewAllCabinRequestRejected":
           return (
            <div>
            <ViewAllCabinRequest preselectedStatus="rejected" />
              </div>
              );
    
            
      default:
        return (
          <div>
            <h3>404</h3>
            <p>Section not found.</p>
          </div>
        );
    }
  };

  return (
    <div className="d-flex vh-100">
      <div
        className={`sidebar d-flex flex-column bg-light ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
        style={{
          width: isSidebarOpen ? "250px" : "0",
          transition: "width 0.3s ease",
          overflow: "hidden",
          position: "relative",
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
          {user.firstName && (
            <p>
              {user.firstName} {user.lastName}
            </p>
          )}
        </div>
        <div className="menu mt-3">
          {user.role === "user" && (
            <>
              <h6 className="px-4 text-secondary">User</h6>
              <ul className="list-unstyled px-3">
                <li>
                  <button
                    className={`btn btn-link text-decoration-none w-100 text-start ${
                      activeSection === "cabinRequest"
                        ? "fw-bold text-primary"
                        : "text-dark"
                    }`}
                    onClick={() => setActiveSection("cabinRequest")}
                  >
                    Cabin Request
                  </button>
                </li>
                <li>
                  <button
                    className={`btn btn-link text-decoration-none w-100 text-start ${
                      activeSection === "viewRequest"
                        ? "fw-bold text-primary"
                        : "text-dark"
                    }`}
                    onClick={() => setActiveSection("viewRequest")}
                  >
                    View Request
                  </button>
                </li>
              </ul>
            </>
          )}
          {user.role === "manager" && (
            <>
              <h6 className="px-4 text-secondary">Manager Only</h6>
              <ul className="list-unstyled px-3">
                <li>
                  <button
                    className={`btn btn-link text-decoration-none w-100 text-start ${
                      activeSection === "approveRequest"
                        ? "fw-bold text-primary"
                        : "text-dark"
                    }`}
                    onClick={() => setActiveSection("approveRequest")}
                  >
                    Cabin Approval
                  </button>
                </li>
                <li>
                  <button
                    className={`btn btn-link text-decoration-none w-100 text-start ${
                      activeSection === "approveRequestVip"
                        ? "fw-bold text-primary"
                        : "text-dark"
                    }`}
                    onClick={() => setActiveSection("approveRequestVip")}
                  >
                    Cabin Approval VIP
                  </button>
                </li>
                
                <li>
                  <button
                    className={`btn btn-link text-decoration-none w-100 text-start ${
                      activeSection === "approveUserRequest"
                        ? "fw-bold text-primary"
                        : "text-dark"
                    }`}
                    onClick={() => setActiveSection("approveUserRequest")}
                  >
                    User Approval
                  </button>
                </li>
                <li>
                  <button
                    className={`btn btn-link text-decoration-none w-100 text-start ${
                      activeSection === "viewBooking"
                        ? "fw-bold text-primary"
                        : "text-dark"
                    }`}
                    onClick={() => setActiveSection("viewBooking")}
                  >
                    View Booking
                  </button>
                </li>
                <li>
                  <button
                    className={`btn btn-link text-decoration-none w-100 text-start ${
                      activeSection === "viewAllCabinRequest"
                        ? "fw-bold text-primary"
                        : "text-dark"
                    }`}
                    onClick={() => setActiveSection("viewAllCabinRequest")}
                  >
                    Cabin Request View
                  </button>
                </li>


                <li>
                  <button
                    className={`btn btn-link text-decoration-none w-100 text-start ${
                      activeSection === "addCabin"
                        ? "fw-bold text-primary"
                        : "text-dark"
                    }`}
                    onClick={() => setActiveSection("addCabin")}
                  >
                     Cabin Manager
                  </button>
                </li>
              </ul>
            </>
          )}
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
         
          <div className="container-fluid px-4 d-flex align-items-center">
            <button
              className="btn btn-light me-3"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>
            <h2>CBS </h2>
            <Button
              onClick={() => setActiveSection("dashboard")}
              className="navbar-brand text-white fw-bold"
              style={{ fontSize: "18px" }}
            >
              Dashboard
            </Button>
            <button className="btn btn-outline-light ms-auto" onClick={handleLogout}>
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
